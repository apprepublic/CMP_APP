import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    // Verify auth
    const supabaseAdmin = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
    const authHeader = req.headers.get("authorization");
    const token = authHeader?.replace("Bearer ", "") || "";
    const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token);
    if (authError || !user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    const { article_id } = await req.json();
    if (!article_id) throw new Error("Missing article_id in request body");

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const textApiKey = Deno.env.get("TEXT_API_KEY")!;
    const deepaiKey = Deno.env.get("DEEPAI_API_KEY")!;
    if (!textApiKey) throw new Error("Missing TEXT_API_KEY");
    if (!deepaiKey) throw new Error("Missing DEEPAI_API_KEY");

    const supabase = createClient(supabaseUrl, supabaseKey);
    const textBaseUrl = Deno.env.get("TEXT_API_BASE_URL") || "https://api.opencode.ai/v1";
    const textModel = Deno.env.get("TEXT_MODEL") || "deepseek-v4-flash";

    async function textFetch(messages: any[], format?: "json_object"): Promise<string> {
      const body: any = { model: textModel, messages, max_tokens: 4096 };
      if (format) body.response_format = { type: format };
      const r = await fetch(`${textBaseUrl}/chat/completions`, {
        method: "POST",
        headers: { "Authorization": `Bearer ${textApiKey}`, "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!r.ok) throw new Error(`Text API ${r.status}: ${await r.text()}`);
      const data = await r.json();
      return data.choices?.[0]?.message?.content || "";
    }

    async function pollinations(prompt: string): Promise<Uint8Array> {
      const url = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt.replace(/[<>]/g, "").substring(0, 200))}?width=1200&height=630&nologo=true&private=true`;
      const r = await fetch(url);
      if (!r.ok) throw new Error(`Pollinations ${r.status}`);
      return new Uint8Array(await r.arrayBuffer());
    }

    async function getImageBytes(prompt: string): Promise<Uint8Array> {
      try {
        const r = await fetch("https://api.deepai.org/api/text2img", {
          method: "POST",
          headers: { "api-key": deepaiKey, "Content-Type": "application/json" },
          body: JSON.stringify({ text: `Editorial cover: ${prompt}. No text, no logos, no identifiable people.` }),
        });
        if (!r.ok) throw new Error(`DeepAI ${r.status}: ${await r.text()}`);
        const data = await r.json();
        const imageUrl = data.output_url;
        if (!imageUrl) throw new Error("No image URL in DeepAI response");
        const dl = await fetch(imageUrl);
        if (!dl.ok) throw new Error(`Download ${dl.status}`);
        return new Uint8Array(await dl.arrayBuffer());
      } catch (e) { console.warn(`DeepAI image failed, using Pollinations: ${e.message}`); }
      return await pollinations(prompt);
    }

    const { data: article, error } = await supabase.from("articles").select("id,title,excerpt,content").eq("id", article_id).single();
    if (error) throw error;
    if (!article) throw new Error("Article not found");

    console.log(`Processing: ${article.title.substring(0, 60)}`);

    const clean = (article.content || "").replace(/<[^>]*>/g, "").substring(0, 2000);
    let prompt = article.title;
    try {
      const raw = await textFetch([
        { role: "system", content: "Generate a detailed image prompt for an editorial cover image. Describe a scene — no text, no logos, no real people. Return the prompt as a plain sentence, no JSON wrapping." },
        { role: "user", content: `Title: ${article.title}\n\nExcerpt: ${article.excerpt || ""}\n\nContent: ${clean}` },
      ]);
      const extracted = raw.replace(/^["'\s]+|["'\s]+$/g, "").substring(0, 500);
      if (extracted.length > 10) prompt = extracted;
    } catch (e) { console.warn(`Text prompt failed: ${e.message}`); }
    console.log(`  Prompt: ${prompt.substring(0, 80)}...`);

    const bytes = await getImageBytes(prompt);

    const fileName = `cover-${crypto.randomUUID()}.png`;
    const { error: upErr } = await supabase.storage.from("article-covers").upload(fileName, bytes, { contentType: "image/png" });
    if (upErr) throw upErr;
    const { data: urlData } = supabase.storage.from("article-covers").getPublicUrl(fileName);
    const pubUrl = urlData?.publicUrl;

    const { error: patErr } = await supabase.from("articles").update({ cover_image_url: pubUrl }).eq("id", article_id);
    if (patErr) throw patErr;

    return new Response(JSON.stringify({ ok: true, article_id, title: article.title, cover_image_url: pubUrl }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e: any) {
    return new Response(JSON.stringify({ error: e.message }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }
});
