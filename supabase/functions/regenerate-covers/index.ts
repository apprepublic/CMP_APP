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
    const openRouterKey = Deno.env.get("OPENROUTER_API_KEY")!;
    if (!openRouterKey) throw new Error("Missing OPENROUTER_API_KEY");

    const supabase = createClient(supabaseUrl, supabaseKey);
    const orHeaders = { "Authorization": `Bearer ${openRouterKey}`, "Content-Type": "application/json", "HTTP-Referer": "https://cmpapp.ng", "X-Title": "CMPapp Cover Regenerator" };

    async function orFetch(model: string, messages: any[], format?: "json_object") {
      const body: any = { model, messages, max_tokens: 4096 };
      if (format) body.response_format = { type: format };
      const r = await fetch("https://openrouter.ai/api/v1/chat/completions", { method: "POST", headers: orHeaders, body: JSON.stringify(body) });
      if (!r.ok) throw new Error(`OR ${r.status}: ${await r.text()}`);
      return r.json();
    }

    async function pollinations(prompt: string): Promise<Uint8Array> {
      const url = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt.replace(/[<>]/g, "").substring(0, 200))}?width=1200&height=630&nologo=true&private=true`;
      const r = await fetch(url);
      if (!r.ok) throw new Error(`Pollinations ${r.status}`);
      return new Uint8Array(await r.arrayBuffer());
    }

    async function getImageBytes(prompt: string): Promise<Uint8Array> {
      try {
        const r = await orFetch("sourceful/riverflow-v2-fast", [
          { role: "user", content: [{ type: "text", text: `Editorial cover: ${prompt}. No text, no logos, no identifiable people.` }] },
        ]);
        const c = r.choices?.[0]?.message?.content;
        if (c && typeof c === "string") { const m = c.match(/https?:\/\/[^\s)\]]+/); if (m) { const dl = await fetch(m[0]); if (dl.ok) return new Uint8Array(await dl.arrayBuffer()); } }
        if (Array.isArray(c)) {
          const imgPart = c.find((p: any) => p.type === "image_url");
          if (imgPart?.image_url?.url) { const dl = await fetch(imgPart.image_url.url); if (dl.ok) return new Uint8Array(await dl.arrayBuffer()); }
        }
      } catch (e) { console.warn(`Riverflow failed, using Pollinations: ${e.message}`); }
      return await pollinations(prompt);
    }

    const { data: article, error } = await supabase.from("articles").select("id,title,excerpt,content").eq("id", article_id).single();
    if (error) throw error;
    if (!article) throw new Error("Article not found");

    console.log(`Processing: ${article.title.substring(0, 60)}`);

    const clean = (article.content || "").replace(/<[^>]*>/g, "").substring(0, 2000);
    let prompt = article.title;
    for (const model of ["z-ai/glm-5.2", "deepseek/deepseek-v4-flash"]) {
      try {
        const gemma = await orFetch(model, [
          { role: "system", content: "Generate a detailed image prompt for an editorial cover image. Describe a scene — no text, no logos, no real people. Return the prompt as a plain sentence, no JSON wrapping." },
          { role: "user", content: `Title: ${article.title}\n\nExcerpt: ${article.excerpt || ""}\n\nContent: ${clean}` },
        ]);
        const raw = gemma.choices?.[0]?.message?.content || "";
        const extracted = raw.replace(/^["'\s]+|["'\s]+$/g, "").substring(0, 500);
        if (extracted.length > 10) { prompt = extracted; break; }
      } catch (e) { console.warn(`${model} failed: ${e.message}`); }
    }
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
