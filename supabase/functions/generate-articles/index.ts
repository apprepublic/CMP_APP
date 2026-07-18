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

async function callOpenAIText(
  model: string,
  messages: { role: string; content: string }[],
  apiKey: string,
  responseFormat?: "json_object"
): Promise<any> {
  const baseUrl = Deno.env.get("TEXT_API_BASE_URL") || "https://api.opencode.ai/v1";

  const body: any = { model, messages, max_tokens: 4096 };
  if (responseFormat) body.response_format = { type: responseFormat };

  const res = await fetch(`${baseUrl}/chat/completions`, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Text API error ${res.status}: ${text}`);
  }

  const data = await res.json();
  const raw = data.choices?.[0]?.message?.content;
  if (!raw) throw new Error("Empty response from text API");

  let content = raw;
  if (responseFormat) {
    try { JSON.parse(raw); } catch {
      const jsonMatch = raw.match(/\{[\s\S]*\}/);
      if (jsonMatch) content = jsonMatch[0];
      else content = JSON.stringify({ content: raw.trim() });
    }
  }

  return { choices: [{ message: { content } }] };
}

async function generateImageViaPollinations(prompt: string): Promise<Uint8Array> {
  const sanitized = encodeURIComponent(prompt.replace(/[<>]/g, "").substring(0, 200));
  const url = `https://image.pollinations.ai/prompt/${sanitized}?width=1200&height=630&nologo=true&private=true`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Pollinations error ${res.status}`);
  const buffer = await res.arrayBuffer();
  return new Uint8Array(buffer);
}

async function callDeepAIImage(prompt: string, apiKey: string): Promise<Uint8Array> {
  const res = await fetch("https://api.deepai.org/api/text2img", {
    method: "POST",
    headers: { "api-key": apiKey, "Content-Type": "application/json" },
    body: JSON.stringify({ text: `Editorial cover: ${prompt}. No text overlay, no logos, no real identifiable people.` }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`DeepAI error ${res.status}: ${text}`);
  }

  const data = await res.json();
  const imageUrl = data.output_url;
  if (!imageUrl) throw new Error("No image URL in DeepAI response");

  const imgRes = await fetch(imageUrl);
  if (!imgRes.ok) throw new Error(`Download failed: ${imgRes.status}`);
  return new Uint8Array(await imgRes.arrayBuffer());
}

// ===========================================
// PIPELINE STEPS
// ===========================================

async function selectTopic(pool: Pool, textApiKey: string): Promise<{ category: string; topic: string }> {
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

    const response = await callOpenAIText(
      Deno.env.get("TEXT_MODEL") || "deepseek/deepseek-v4-flash",
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
      textApiKey,
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
  textApiKey: string
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

  const response = await callOpenAIText(
    Deno.env.get("TEXT_MODEL") || "deepseek/deepseek-v4-flash",
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
    textApiKey,
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

async function generateCoverImage(
  topic: string,
  deepaiKey: string,
  supabaseClient: any
): Promise<{ url: string | null; error: string | null }> {
  let imageBytes: Uint8Array | null = null;
  try {
    imageBytes = await callDeepAIImage(topic, deepaiKey);
  } catch (err: any) {
    console.warn("DeepAI image failed, trying Pollinations:", err.message);
    try {
      imageBytes = await generateImageViaPollinations(topic);
    } catch (e) {
      return { url: null, error: `Image failed: ${e.message}` };
    }
  }
  if (!imageBytes) return { url: null, error: "No image generated" };

  try {
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
    console.error("Storage upload failed:", err);
    return { url: null, error: err.message || "Unknown error" };
  }
}

async function generateImagePrompt(
  draft: { title: string; excerpt: string; content_html: string },
  textApiKey: string
): Promise<string> {
  const content = (draft.content_html || "").replace(/<[^>]*>/g, "").substring(0, 2000);
  const model = Deno.env.get("TEXT_MODEL") || "deepseek/deepseek-v4-flash";
  try {
    const response = await callOpenAIText(
      model,
      [
        { role: "system", content: "Generate a detailed image prompt for an editorial cover image. Describe a scene — no text, no logos, no real people. Return the prompt as a plain sentence, no JSON wrapping." },
        { role: "user", content: `Title: ${draft.title}\n\nExcerpt: ${draft.excerpt || ""}\n\nContent: ${content}` },
      ],
      textApiKey
    );
    const raw = response.choices?.[0]?.message?.content?.trim();
    if (raw && raw.length > 10) return raw.replace(/^["'\s]+|["'\s]+$/g, "");
  } catch (err: any) {
    console.warn(`Image prompt via ${model} failed: ${err.message}`);
  }
  return draft.title;
}

// ===========================================
// MAIN HANDLER WITH RETRY LOOP
// ===========================================

const MAX_RETRIES = 3;

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  // Verify cron secret for auth
  const authHeader = req.headers.get("authorization");
  const cronSecret = Deno.env.get("CRON_SECRET");
  if (cronSecret) {
    const token = authHeader?.replace("Bearer ", "") || "";
    if (token !== cronSecret) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }
  } else {
    // Fallback: verify JWT
    const supabaseAdmin = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
    const token = authHeader?.replace("Bearer ", "") || "";
    const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token);
    if (authError || !user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }
  }

  const startTime = Date.now();
  const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
  const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
  const textApiKey = Deno.env.get("TEXT_API_KEY")!;
  const deepaiKey = Deno.env.get("DEEPAI_API_KEY")!;
  const tavilyKey = Deno.env.get("TAVILY_API_KEY")!;
  const authorId = Deno.env.get("AI_ARTICLE_AUTHOR_ID")!;

  // Validate required secrets
  const missing = [];
  if (!supabaseUrl) missing.push("SUPABASE_URL");
  if (!supabaseServiceKey) missing.push("SUPABASE_SERVICE_ROLE_KEY");
  if (!textApiKey) missing.push("TEXT_API_KEY");
  if (!deepaiKey) missing.push("DEEPAI_API_KEY");
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
    const writerModel = Deno.env.get("TEXT_MODEL") || "deepseek/deepseek-v4-flash";
    const imageModel = "deepai-text2img";

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
        const { category, topic } = await selectTopic(pool, textApiKey);
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
          draft = await writeDraft(topic, category, sources, textApiKey);
        } catch (err: any) {
          console.error("Write draft failed:", err);
          throw new Error(`Write draft failed: ${err.message}`);
        }

        // Step 4: Generate image prompt from article content
        console.log("Step 4: Generating image prompt from article...");
        const imagePrompt = await generateImagePrompt(draft, textApiKey);
        console.log(`Image prompt: "${imagePrompt.substring(0, 100)}..."`);

        // Step 5: Generate cover image
        console.log("Step 5: Generating cover image...");
        const { url: coverImageUrl, error: coverImageError } = await generateCoverImage(imagePrompt, deepaiKey, supabase);
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