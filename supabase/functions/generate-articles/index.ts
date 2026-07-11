import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { Pool } from "https://deno.land/x/postgres@v0.17.0/mod.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// ===========================================
// HELPERS
// ===========================================

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .substring(0, 200);
}

async function callOpenRouter(
  model: string,
  messages: { role: string; content: string }[],
  apiKey: string,
  responseFormat?: "json_object"
): Promise<any> {
  const body: any = {
    model,
    messages,
    max_tokens: 4096,
  };
  if (responseFormat) {
    body.response_format = { type: responseFormat };
  }

  const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      "HTTP-Referer": "https://cmpapp.ng",
      "X-Title": "CMPapp Article Agent",
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`OpenRouter error ${res.status}: ${text}`);
  }

  const data = await res.json();
  const raw = data.choices?.[0]?.message?.content;
  if (!raw) throw new Error("Empty response from OpenRouter");

  // Some OpenRouter models don't support response_format — extract JSON if raw isn't pure JSON
  let content = raw;
  if (responseFormat) {
    try {
      JSON.parse(raw);
    } catch {
      const jsonMatch = raw.match(/\{[\s\S]*\}/);
      if (jsonMatch) content = jsonMatch[0];
      else content = JSON.stringify({ content: raw.trim() });
    }
  }

  return {
    choices: [{ message: { content } }],
  };
}

async function generateImageViaPollinations(prompt: string): Promise<Uint8Array> {
  const sanitized = encodeURIComponent(prompt.replace(/[<>]/g, "").substring(0, 200));
  const url = `https://image.pollinations.ai/prompt/${sanitized}?width=1200&height=630&nologo=true&private=true`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Pollinations error ${res.status}`);
  const buffer = await res.arrayBuffer();
  return new Uint8Array(buffer);
}

async function callOpenRouterImage(
  prompt: string,
  apiKey: string
): Promise<Uint8Array> {
  const model = Deno.env.get("OPENROUTER_IMAGE_MODEL") || "sourceful/riverflow-v2-fast";
  const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      "HTTP-Referer": "https://cmpapp.ng",
      "X-Title": "CMPapp Article Agent",
    },
    body: JSON.stringify({
      model,
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: `Generate a clean editorial cover image for an article about: ${prompt}. No text overlay, no logos, no real identifiable people.`,
            },
          ],
        },
      ],
      max_tokens: 1024,
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Image generation error ${res.status}: ${text}`);
  }

  const data = await res.json();
  const rawContent = data.choices?.[0]?.message?.content;

  // Case 1: content is a plain string — may contain a markdown image URL or direct URL
  if (typeof rawContent === "string") {
    const urlMatch = rawContent.match(/https?:\/\/[^\s\)\]]+/);
    if (urlMatch) {
      const imgUrl = urlMatch[0];
      const imgRes = await fetch(imgUrl);
      if (!imgRes.ok) throw new Error(`Failed to download image from URL: ${imgRes.status}`);
      const buffer = await imgRes.arrayBuffer();
      return new Uint8Array(buffer);
    }
    throw new Error("No URL found in string response");
  }

  // Case 2: content is an array of parts
  if (Array.isArray(rawContent)) {
    let imageUrl: string | null = null;

    const imagePart = rawContent.find((p: any) => p.type === "image_url");
    if (imagePart?.image_url?.url) imageUrl = imagePart.image_url.url;

    if (!imageUrl) {
      const base64Part = rawContent.find((p: any) => p.type === "base64");
      if (base64Part?.base64_url?.data) {
        const binary = atob(base64Part.base64_url.data);
        const bytes = new Uint8Array(binary.length);
        for (let i = 0; i < binary.length; i++) { bytes[i] = binary.charCodeAt(i); }
        return bytes;
      }
      if (base64Part?.base64_url?.url) imageUrl = base64Part.base64_url.url;
    }

    if (!imageUrl) {
      for (const part of rawContent) {
        if (part.type === "text" && typeof part.text === "string") {
          const m = part.text.match(/https?:\/\/[^\s\)\]]+/);
          if (m) { imageUrl = m[0]; break; }
        }
      }
    }

    if (imageUrl) {
      if (imageUrl.startsWith("data:")) {
        const commaIdx = imageUrl.indexOf(",");
        const binary = atob(imageUrl.substring(commaIdx + 1));
        const bytes = new Uint8Array(binary.length);
        for (let i = 0; i < binary.length; i++) { bytes[i] = binary.charCodeAt(i); }
        return bytes;
      }
      const imgRes = await fetch(imageUrl);
      if (!imgRes.ok) throw new Error(`Failed to download image: ${imgRes.status}`);
      const buffer = await imgRes.arrayBuffer();
      return new Uint8Array(buffer);
    }

    throw new Error("No image URL found in array content");
  }

  // Case 3: content is null/object — fallback to Pollinations
  console.warn("OpenRouter returned unexpected content type, falling back to Pollinations");
  return await generateImageViaPollinations(prompt);
}

// ===========================================
// PIPELINE STEPS
// ===========================================

async function selectTopic(pool: Pool, openRouterKey: string): Promise<{ category: string; topic: string }> {
  const client = await pool.connect();
  try {
    // Pick the most overdue category
    const catResult = await client.queryObject`
      SELECT category, daily_target, last_generated_at
      FROM article_categories_config
      WHERE is_active = true
      ORDER BY
        COALESCE(last_generated_at, '1970-01-01'::timestamptz) ASC,
        daily_target DESC
      LIMIT 1
    `;
    const category = (catResult.rows[0] as any)?.category;
    if (!category) throw new Error("No active categories found");

    // Get recent article titles in this category for dedupe
    const recentResult = await client.queryObject`
      SELECT title FROM articles
      WHERE category = ${category}
        AND created_at > NOW() - INTERVAL '30 days'
      ORDER BY created_at DESC
      LIMIT 20
    `;
    const recentTitles = (recentResult.rows as any[]).map((r) => r.title);

    // Ask LLM for a fresh topic angle
    const dedupeContext = recentTitles.length > 0
      ? `\n\nAvoid topics similar to these recent articles:\n${recentTitles.map((t: string) => `- ${t}`).join("\n")}`
      : "";

    const response = await callOpenRouter(
      Deno.env.get("OPENROUTER_WRITER_MODEL") || "deepseek/deepseek-v4-flash",
      [
        {
          role: "system",
          content: `You are a content strategist. Suggest ONE specific, fresh article topic in the category "${category}" targeting a Nigerian/African audience.${dedupeContext}\n\nRespond with ONLY a JSON object: {"topic": "string", "why_fresh": "string"}`,
        },
        {
          role: "user",
          content: `Suggest a fresh article topic in the category "${category}" that hasn't been covered recently.`,
        },
      ],
      openRouterKey,
      "json_object"
    );

    const content = response.choices?.[0]?.message?.content;
    const parsed = JSON.parse(content || "{}");
    return { category, topic: parsed.topic || `${category} - Today's Update` };
  } finally {
    client.release();
  }
}

async function researchTopic(topic: string, tavilyKey: string): Promise<{ title: string; url: string; content: string }[]> {
  const res = await fetch("https://api.tavily.com/search", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      api_key: tavilyKey,
      query: topic,
      search_depth: "advanced",
      max_results: 6,
      include_answer: false,
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Tavily error ${res.status}: ${text}`);
  }

  const data = await res.json();
  return (data.results || []).map((r: any) => ({
    title: r.title || "",
    url: r.url || "",
    content: r.content || "",
  }));
}

async function writeDraft(
  topic: string,
  category: string,
  sources: { title: string; url: string; content: string }[],
  openRouterKey: string
): Promise<{
  title: string;
  slug: string;
  excerpt: string;
  content_html: string;
  tags: string[];
  read_time_minutes: number;
}> {
  const sourcesText = sources
    .map((s, i) => `[${i + 1}] ${s.title}\n    URL: ${s.url}\n    Content: ${s.content.substring(0, 1500)}`)
    .join("\n\n");

  const response = await callOpenRouter(
    Deno.env.get("OPENROUTER_WRITER_MODEL") || "deepseek/deepseek-v4-flash",
    [
      {
        role: "system",
        content: `You are a professional journalist writing for a Nigerian/African audience on CMPapp, a creative economy platform.

Write an 800-1200 word article grounded in the provided sources. Synthesize, don't copy. Never use em dashes. Write at a high-school reading level — clear, engaging, and practical.

Category: ${category}

Return ONLY valid JSON with this exact structure:
{
  "title": "string (catchy, 8-15 words)",
  "excerpt": "string (1-2 sentences, max 280 chars)",
  "content_html": "string (full HTML article with <h2>, <p>, <ul>, <li> tags — no markdown)",
  "tags": ["string", "string", ...] (3-5 tags),
  "read_time_minutes": number (1-15)
}`,
      },
      {
        role: "user",
        content: `Write an article about: ${topic}\n\nUse these sources for facts and context:\n\n${sourcesText}`,
      },
    ],
    openRouterKey,
    "json_object"
  );

  const content = response.choices?.[0]?.message?.content;
  if (!content) throw new Error("Empty response from writer model");

  const parsed = JSON.parse(content);
  const slug = slugify(parsed.title);

  return {
    title: parsed.title,
    slug,
    excerpt: parsed.excerpt || "",
    content_html: parsed.content_html || "",
    tags: parsed.tags || [],
    read_time_minutes: parsed.read_time_minutes || 5,
  };
}

async function qualityCheck(
  draft: { title: string; content_html: string },
  sources: { title: string; url: string; content: string }[],
  openRouterKey: string
): Promise<{ passed: boolean; reason?: string }> {
  const sourcesText = sources
    .map((s, i) => `[${i + 1}] ${s.title}: ${s.content.substring(0, 800)}`)
    .join("\n\n");

  const response = await callOpenRouter(
    Deno.env.get("OPENROUTER_WRITER_MODEL") || "deepseek/deepseek-v4-flash",
    [
      {
        role: "system",
        content: `You are a fact-checker. Review the article against the provided sources. Identify any claims, statistics, or statements that are NOT supported by the sources.

Return ONLY JSON: {"passed": boolean, "reason": "string if failed, empty if passed"}

Mark as failed only if there are clear factual claims contradicted or unsupported by the sources. Minor style differences are fine.`,
      },
      {
        role: "user",
        content: `Article title: ${draft.title}\n\nArticle content:\n${draft.content_html.substring(0, 4000)}\n\nSources:\n${sourcesText}`,
      },
    ],
    openRouterKey,
    "json_object"
  );

  const content = response.choices?.[0]?.message?.content;
  const parsed = JSON.parse(content || '{"passed": false, "reason": "Parse error"}');
  return { passed: parsed.passed !== false, reason: parsed.reason };
}

async function generateCoverImage(
  topic: string,
  openRouterKey: string,
  supabaseClient: any
): Promise<{ url: string | null; error: string | null }> {
  try {
    const imageBytes = await callOpenRouterImage(topic, openRouterKey);

    const fileName = `cover-${crypto.randomUUID()}.png`;
    const { data, error } = await supabaseClient.storage
      .from("article-covers")
      .upload(fileName, imageBytes, {
        contentType: "image/png",
        upsert: false,
      });

    if (error) throw error;

    const { data: urlData } = supabaseClient.storage
      .from("article-covers")
      .getPublicUrl(fileName);

    return { url: urlData?.publicUrl || null, error: null };
  } catch (err: any) {
    console.error("Cover image generation failed:", err);
    return { url: null, error: err.message || "Unknown image error" }; // Non-fatal
  }
}

async function generateImagePrompt(
  draft: { title: string; excerpt: string; content_html: string },
  openRouterKey: string
): Promise<string> {
  try {
    const response = await callOpenRouter(
      "google/gemma-4-31b-it",
      [
        {
          role: "system",
          content: "Generate a detailed, vivid image generation prompt for an editorial cover image based on this article. Describe a scene — no text overlay, no logos, no real identifiable people. Return ONLY the prompt text, 1-2 sentences.",
        },
        {
          role: "user",
          content: `Article title: ${draft.title}\n\nExcerpt: ${draft.excerpt || ""}\n\nContent: ${(draft.content_html || "").replace(/<[^>]*>/g, "").substring(0, 2000)}`,
        },
      ],
      openRouterKey
    );

    const prompt = response.choices?.[0]?.message?.content?.trim();
    if (prompt && prompt.length > 10) return prompt;
    throw new Error("Generated prompt too short or empty");
  } catch (err: any) {
    console.error("Image prompt generation failed, falling back to topic:", err.message);
    return draft.title; // fallback
  }
}

// ===========================================
// MAIN HANDLER WITH RETRY LOOP
// ===========================================

const MAX_RETRIES = 3;

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const startTime = Date.now();
  const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
  const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
  const openRouterKey = Deno.env.get("OPENROUTER_API_KEY")!;
  const tavilyKey = Deno.env.get("TAVILY_API_KEY")!;
  const authorId = Deno.env.get("AI_ARTICLE_AUTHOR_ID")!;

  // Validate required secrets
  const missing = [];
  if (!supabaseUrl) missing.push("SUPABASE_URL");
  if (!supabaseServiceKey) missing.push("SUPABASE_SERVICE_ROLE_KEY");
  if (!openRouterKey) missing.push("OPENROUTER_API_KEY");
  if (!tavilyKey) missing.push("TAVILY_API_KEY");
  if (!authorId) missing.push("AI_ARTICLE_AUTHOR_ID");
  if (missing.length > 0) {
    return new Response(
      JSON.stringify({ error: `Missing secrets: ${missing.join(", ")}` }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }

  const supabase = createClient(supabaseUrl, supabaseServiceKey);
  const dbUrl = Deno.env.get("SUPABASE_DB_URL")!;
  let pool: Pool | null = null;

  try {
    pool = new Pool(dbUrl, 1);
    const writerModel = Deno.env.get("OPENROUTER_WRITER_MODEL") || "deepseek/deepseek-v4-flash";
    const imageModel = "sourceful/riverflow-v2-fast";

    // RETRY LOOP: keep trying until successful insertion
    let attempt = 0;
    let articleId: string | null = null;
    let finalDraft: any = null;
    let finalCategory: string | null = null;
    let finalTopic: string | null = null;
    let finalCoverUrl: string | null = null;

    while (attempt < MAX_RETRIES && !articleId) {
      attempt++;
      if (attempt > 1) {
        // Brief delay before retry to let rate limits reset
        await new Promise((r) => setTimeout(r, 5000));
      }
      console.log(`=== Attempt ${attempt}/${MAX_RETRIES} ===`);

      try {
        // Step 1: Select topic (fresh topic each attempt)
        console.log("Step 1: Selecting topic...");
        const { category, topic } = await selectTopic(pool, openRouterKey);
        console.log(`Selected category="${category}" topic="${topic}"`);

        // Step 2: Research
        console.log("Step 2: Researching...");
        let sources: { title: string; url: string; content: string }[] = [];
        try {
          sources = await researchTopic(topic, tavilyKey);
        } catch (err) {
          console.error("Research failed, continuing with empty sources:", err);
        }

        // Step 3: Write draft
        console.log("Step 3: Writing draft...");
        let draft: any;
        try {
          draft = await writeDraft(topic, category, sources, openRouterKey);
        } catch (err: any) {
          console.error("Write draft failed:", err);
          throw new Error(`Write draft failed: ${err.message}`);
        }

        // Step 4: Generate image prompt from article content
        console.log("Step 4: Generating image prompt from article...");
        const imagePrompt = await generateImagePrompt(draft, openRouterKey);
        console.log(`Image prompt: "${imagePrompt.substring(0, 100)}..."`);

        // Step 5: Generate cover image
        console.log("Step 5: Generating cover image...");
        const { url: coverImageUrl, error: coverImageError } = await generateCoverImage(imagePrompt, openRouterKey, supabase);
        if (coverImageError) {
          console.error("Cover image error (non-fatal):", coverImageError);
        }

        // Step 6: Insert into articles
        console.log("Step 6: Inserting article...");
        const newArticleId = crypto.randomUUID();
        const sourceUrls = sources.map((s) => s.url);

        const client = await pool.connect();
        try {
          // Ensure unique slug
          let slug = draft.slug;
          const slugCheck = await client.queryObject`
            SELECT id FROM articles WHERE slug = ${draft.slug} LIMIT 1
          `;
          if ((slugCheck.rows as any[]).length > 0) {
            slug = `${draft.slug}-${Date.now()}`;
          }

          await client.queryObject`
            INSERT INTO articles (id, title, slug, content, excerpt, cover_image_url, author_id, category, tags, read_time_minutes, coin_reward, source_urls, is_ai_generated, is_published, published_at)
            VALUES (
              ${newArticleId},
              ${draft.title},
              ${slug},
              ${draft.content_html},
              ${draft.excerpt},
              ${coverImageUrl},
              ${authorId},
              ${category},
              ${draft.tags},
              ${draft.read_time_minutes},
              50,
              ${sources.map((s) => s.url)},
              true,
              true,
              NOW()
            )
          `;

          // Update category config
          await client.queryObject`
            UPDATE article_categories_config
            SET last_generated_at = NOW()
            WHERE category = ${category}
          `;

          // Log success (include cover image error if any)
          const logErrorMsg = coverImageError ? `Cover image: ${coverImageError}` : null;
          await client.queryObject`
            INSERT INTO article_generation_logs (category, topic, status, article_id, source_urls, model_used, image_model_used, tokens_used, error_message)
            VALUES (${category}, ${topic}, 'success', ${newArticleId}, ${sources.map((s) => s.url)}, ${writerModel}, ${imageModel}, ${0}, ${logErrorMsg})
          `;

          // Success! Capture results for response
          articleId = newArticleId;
          finalDraft = draft;
          finalCategory = category;
          finalTopic = topic;
          finalCoverUrl = coverImageUrl;
        } finally {
          client.release();
        }
      } catch (err: any) {
        console.error(`Attempt ${attempt} failed:`, err);
        // Log the failure but continue retry loop
        try {
          const client = await pool.connect();
          try {
            await client.queryObject`
              INSERT INTO article_generation_logs (category, topic, status, error_message, model_used)
              VALUES (${'unknown'}, ${'unknown'}, 'failed', ${err.message || "Unknown error"}, ${writerModel})
            `;
          } finally {
            client.release();
          }
        } catch (logErr) {
          console.error("Failed to log error:", logErr);
        }
        // Continue to next retry
      }
    }

    if (!articleId) {
      throw new Error(`All ${MAX_RETRIES} attempts failed to generate a valid article`);
    }

    const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
    console.log(`Article generated in ${elapsed}s after ${attempt} attempt(s): "${finalDraft.title}"`);

    return new Response(
      JSON.stringify({
        success: true,
        article_id: articleId,
        title: finalDraft.title,
        slug: finalDraft.slug,
        category: finalCategory,
        cover_image_url: finalCoverUrl,
        attempts: attempt,
        elapsed_seconds: Number(elapsed),
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err: any) {
    console.error("Function error:", err);
    return new Response(
      JSON.stringify({ error: err.message || "Server error" }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } finally {
    if (pool) await pool.end();
  }
};

serve(handler);