import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const SUPABASE_URL = 'https://eztaonlpenuzpoosqonx.supabase.co';
const SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV6dGFvbmxwZW51enBvb3Nxb254Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MjU5NDE3NSwiZXhwIjoyMDk4MTcwMTc1fQ.1qF9UMLV0SMMgviakSqzkzdiy7LbppOzTofYQp--kf0';
const GEMINI_KEY = Deno.env.get('GEMINI_API_KEY');
const GEMINI_MODEL = Deno.env.get('GEMINI_TEXT_MODEL') || 'gemini-2.0-flash';

const supabase = createClient(SUPABASE_URL, SERVICE_KEY);

async function geminiFetch(messages) {
  let systemInstruction;
  const contents = [];
  for (const msg of messages) {
    if (msg.role === 'system') { systemInstruction = msg.content; }
    else { contents.push({ role: msg.role, parts: [{ text: msg.content }] }); }
  }
  const body = { contents, generationConfig: { maxOutputTokens: 4096 } };
  if (systemInstruction) body.system_instruction = { parts: [{ text: systemInstruction }] };
  body.generationConfig.response_mime_type = 'application/json';
  const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_KEY}`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`Gemini ${res.status}: ${await res.text()}`);
  const data = await res.json();
  return data.candidates?.[0]?.content?.parts?.[0]?.text || '{}';
}

async function generateImagePrompt(article) {
  const clean = (article.content || '').replace(/<[^>]*>/g, '').substring(0, 2000);
  const raw = await geminiFetch([
    { role: 'system', content: 'Generate a detailed image prompt for an editorial cover image. Describe a scene — no text, no logos, no people. Return ONLY a JSON object: {"prompt": "string"}' },
    { role: 'user', content: `Title: ${article.title}\n\nExcerpt: ${article.excerpt || ''}\n\nContent: ${clean}` },
  ]);
  try { return JSON.parse(raw).prompt || article.title; } catch { return article.title; }
}

async function generateCoverImage(prompt) {
  const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-image:generateContent?key=${GEMINI_KEY}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: `Editorial cover: ${prompt}. No text, no logos.` }] }],
      generationConfig: { responseModalities: ['Text', 'Image'] },
    }),
  });
  if (!res.ok) throw new Error(`Gemini ${res.status}: ${await res.text()}`);
  const data = await res.json();
  const parts = data.candidates?.[0]?.content?.parts || [];
  const imagePart = parts.find(p => p.inlineData?.mimeType?.startsWith('image/'));
  if (!imagePart?.inlineData?.data) throw new Error('No image data in Gemini response');
  const binary = atob(imagePart.inlineData.data);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return bytes;
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
