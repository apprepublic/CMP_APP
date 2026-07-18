import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const SUPABASE_URL = 'https://eztaonlpenuzpoosqonx.supabase.co';
const SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV6dGFvbmxwZW51enBvb3Nxb254Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MjU5NDE3NSwiZXhwIjoyMDk4MTcwMTc1fQ.1qF9UMLV0SMMgviakSqzkzdiy7LbppOzTofYQp--kf0';
const TEXT_KEY = Deno.env.get('TEXT_API_KEY');
const DEEPAI_KEY = Deno.env.get('DEEPAI_API_KEY');
const TEXT_BASE = Deno.env.get('TEXT_API_BASE_URL') || 'https://api.opencode.ai/v1';
const TEXT_MODEL = Deno.env.get('TEXT_MODEL') || 'deepseek-v4-flash';

const supabase = createClient(SUPABASE_URL, SERVICE_KEY);

async function textFetch(messages) {
  const body = { model: TEXT_MODEL, messages, max_tokens: 4096, response_format: { type: 'json_object' } };
  const res = await fetch(`${TEXT_BASE}/chat/completions`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${TEXT_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`Text API ${res.status}: ${await res.text()}`);
  const data = await res.json();
  return data.choices?.[0]?.message?.content || '{}';
}

async function generateImagePrompt(article) {
  const clean = (article.content || '').replace(/<[^>]*>/g, '').substring(0, 2000);
  const raw = await textFetch([
    { role: 'system', content: 'Generate a detailed image prompt for an editorial cover image. Describe a scene — no text, no logos, no people. Return ONLY a JSON object: {"prompt": "string"}' },
    { role: 'user', content: `Title: ${article.title}\n\nExcerpt: ${article.excerpt || ''}\n\nContent: ${clean}` },
  ]);
  try { return JSON.parse(raw).prompt || article.title; } catch { return article.title; }
}

async function generateCoverImage(prompt) {
  const res = await fetch('https://api.deepai.org/api/text2img', {
    method: 'POST',
    headers: { 'api-key': DEEPAI_KEY, 'Content-Type': 'application/json' },
    body: JSON.stringify({ text: `Editorial cover: ${prompt}. No text, no logos.` }),
  });
  if (!res.ok) throw new Error(`DeepAI ${res.status}: ${await res.text()}`);
  const data = await res.json();
  if (!data.output_url) throw new Error('No image URL in DeepAI response');
  const imgRes = await fetch(data.output_url);
  if (!imgRes.ok) throw new Error(`Download failed: ${imgRes.status}`);
  return new Uint8Array(await imgRes.arrayBuffer());
}

async function uploadToStorage(articleId, imageBytes) {
  const fileName = `cover-${crypto.randomUUID()}.png`;
  const { error } = await supabase.storage.from('article-covers').upload(fileName, imageBytes, { contentType: 'image/png' });
  if (error) throw error;
  const { data: urlData } = supabase.storage.from('article-covers').getPublicUrl(fileName);
  return urlData?.publicUrl || null;
}

async function main() {
  const { data: articles, error } = await supabase
    .from('articles')
    .select('id, title, excerpt, content')
    .eq('is_ai_generated', true)
    .order('created_at', { ascending: false });

  if (error) throw new Error(`Query failed: ${error.message}`);
  console.log(`Found ${articles.length} AI-generated articles`);

  let success = 0, fail = 0;
  for (const article of articles) {
    try {
      console.log(`\n[${success + fail + 1}/${articles.length}] ${article.title.slice(0, 50)}...`);
      const prompt = await generateImagePrompt(article);
      console.log(`  Prompt: ${prompt.slice(0, 80)}...`);
      const imageBytes = await generateCoverImage(prompt);
      const url = await uploadToStorage(article.id, imageBytes);
      const { error: updateError } = await supabase
        .from('articles')
        .update({ cover_image_url: url })
        .eq('id', article.id);
      if (updateError) throw updateError;
      console.log(`  ✅ Cover updated: ${url.slice(0, 60)}...`);
      success++;
    } catch (err) {
      console.error(`  ❌ Failed: ${err.message}`);
      fail++;
    }
  }
  console.log(`\nDone — ${success} updated, ${fail} failed`);
}

await main();
