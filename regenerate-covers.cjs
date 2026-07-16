const SUPABASE_URL = process.env.SUPABASE_URL || 'https://eztaonlpenuzpoosqonx.supabase.co';
const KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const OR_KEY = process.env.OPENROUTER_API_KEY;

if (!KEY) { console.error('Missing SUPABASE_SERVICE_ROLE_KEY'); process.exit(1); }
if (!OR_KEY) { console.error('Missing OPENROUTER_API_KEY'); process.exit(1); }

const AUTH = { 'apikey': KEY, 'Authorization': `Bearer ${KEY}`, 'Content-Type': 'application/json' };
const OR_HDR = { 'Authorization': `Bearer ${OR_KEY}`, 'Content-Type': 'application/json', 'HTTP-Referer': 'https://cmpapp.ng', 'X-Title': 'CMPapp Cover Regenerator' };

async function orFetch(model, messages, format) {
  const body = { model, messages, max_tokens: 4096 };
  if (format) body.response_format = { type: format };
  const r = await fetch('https://openrouter.ai/api/v1/chat/completions', { method: 'POST', headers: OR_HDR, body: JSON.stringify(body) });
  if (!r.ok) throw new Error(`OR ${r.status}: ${await r.text()}`);
  return r.json();
}

async function generatePrompt(title, excerpt, content) {
  const clean = (content||'').replace(/<[^>]*>/g,'').substring(0,2000);
  const r = await orFetch('google/gemma-4-31b-it', [
    { role: 'system', content: 'Generate a detailed image prompt for an editorial cover image. Describe a scene — no text, no logos, no real people. Return ONLY JSON: {"prompt":"string"}' },
    { role: 'user', content: `Title: ${title}\n\nExcerpt: ${excerpt||''}\n\nContent: ${clean}` },
  ], 'json_object');
  const parsed = JSON.parse(r.choices?.[0]?.message?.content||'{}');
  return parsed.prompt || title;
}

async function generateImage(prompt) {
  const r = await orFetch('sourceful/riverflow-v2-fast', [
    { role: 'user', content: [{ type: 'text', text: `Editorial cover: ${prompt}. No text, no logos, no identifiable people.` }] },
  ]);
  const c = r.choices?.[0]?.message?.content;
  let url = null;
  if (typeof c === 'string') { const m = c.match(/https?:\/\/[^\s)\]]+/); if (m) url = m[0]; }
  else if (Array.isArray(c)) { const i = c.find(p => p.type === 'image_url'); if (i?.image_url?.url) url = i.image_url.url; }
  if (!url) throw new Error('No image URL: ' + JSON.stringify(c).slice(0,200));
  const img = await fetch(url);
  if (!img.ok) throw new Error(`Download ${img.status}`);
  return new Uint8Array(await img.arrayBuffer());
}

async function uploadAndUpdate(articleId, bytes) {
  const name = `cover-${crypto.randomUUID()}.png`;
  const up = await fetch(`${SUPABASE_URL}/storage/v1/object/article-covers/${name}`, { method: 'POST', headers: {...AUTH, 'Content-Type': 'image/png'}, body: bytes });
  if (!up.ok) throw new Error(`Upload ${up.status}: ${await up.text()}`);
  const pub = `${SUPABASE_URL}/storage/v1/object/public/article-covers/${name}`;
  const pat = await fetch(`${SUPABASE_URL}/rest/v1/articles?id=eq.${articleId}`, { method: 'PATCH', headers: AUTH, body: JSON.stringify({ cover_image_url: pub }) });
  if (!pat.ok) throw new Error(`Update ${pat.status}: ${await pat.text()}`);
  return pub;
}

async function main() {
  const r = await fetch(`${SUPABASE_URL}/rest/v1/articles?select=id,title,excerpt,content&is_ai_generated=eq.true&order=created_at.desc`, { headers: AUTH });
  if (!r.ok) throw new Error(`Query ${r.status}: ${await r.text()}`);
  const articles = await r.json();
  console.log(`Found ${articles.length} AI-generated articles`);

  let ok = 0, fail = 0;
  for (const a of articles) {
    try {
      console.log(`\n[${ok+fail+1}/${articles.length}] ${a.title.slice(0,50)}...`);
      const prompt = await generatePrompt(a.title, a.excerpt, a.content);
      console.log(`  Prompt: ${prompt.slice(0,80)}...`);
      const bytes = await generateImage(prompt);
      const pub = await uploadAndUpdate(a.id, bytes);
      console.log(`  ✅ ${pub.slice(0,70)}...`);
      ok++;
    } catch (e) {
      console.error(`  ❌ ${e.message}`);
      fail++;
    }
  }
  console.log(`\nDone — ${ok} updated, ${fail} failed`);
}

main().catch(console.error);
