import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const SUPABASE_URL = 'https://eztaonlpenuzpoosqonx.supabase.co';
const SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV6dGFvbmxwZW51enBvb3Nxb254Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MjU5NDE3NSwiZXhwIjoyMDk4MTcwMTc1fQ.1qF9UMLV0SMMgviakSqzkzdiy7LbppOzTofYQp--kf0';
const OPENROUTER_KEY = Deno.env.get('OPENROUTER_API_KEY');

const supabase = createClient(SUPABASE_URL, SERVICE_KEY);

async function callOpenRouter(model, messages) {
  const body = { model, messages, max_tokens: 4096 };
  if (model !== 'sourceful/riverflow-v2-fast') body.response_format = { type: 'json_object' };

  const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${OPENROUTER_KEY}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': 'https://cmpapp.ng',
      'X-Title': 'CMPapp Cover Regenerator',
    },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`OpenRouter ${res.status}: ${await res.text()}`);
  return res.json();
}

async function generateImagePrompt(article) {
  const clean = (article.content || '').replace(/<[^>]*>/g, '').substring(0, 2000);
  const res = await callOpenRouter('google/gemma-4-31b-it', [
    { role: 'system', content: 'Generate a detailed image prompt for an editorial cover image. Describe a scene — no text, no logos, no people. Return ONLY a JSON object: {"prompt": "string"}' },
    { role: 'user', content: `Title: ${article.title}\n\nExcerpt: ${article.excerpt || ''}\n\nContent: ${clean}` },
  ]);
  const raw = res.choices?.[0]?.message?.content || '{}';
  const parsed = JSON.parse(raw);
  return parsed.prompt || article.title;
}

async function generateCoverImage(prompt) {
  const textRes = await callOpenRouter('sourceful/riverflow-v2-fast', [
    { role: 'user', content: [{ type: 'text', text: `Editorial cover: ${prompt}. No text, no logos.` }] },
  ]);
  const content = textRes.choices?.[0]?.message?.content;
  if (!content) throw new Error('No image content');

  // Try to extract URL from response
  let imageUrl = null;
  if (typeof content === 'string') {
    const m = content.match(/https?:\/\/[^\s)\]]+/);
    if (m) imageUrl = m[0];
  } else if (Array.isArray(content)) {
    const img = content.find(p => p.type === 'image_url');
    if (img?.image_url?.url) imageUrl = img.image_url.url;
  }
  if (!imageUrl) throw new Error('Could not extract image URL from response');

  const imgRes = await fetch(imageUrl);
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
