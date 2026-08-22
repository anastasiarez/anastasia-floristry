/**
 * SEO / crawlability audit against a running server.
 *
 * Run:  pnpm seo            (expects pnpm dev on :3000)
 *       BASE=https://... pnpm seo
 *
 * Checks the things that actually move the needle for a local service
 * business, plus the things that determine whether an AI assistant can read
 * the page at all (most AI crawlers do not execute JavaScript).
 */

const BASE = process.env.BASE ?? 'http://localhost:3000';
const PAGES = ['/', '/about', '/services', '/portfolio', '/faq', '/contact'];

const results = [];
const add = (level, page, msg) => results.push({ level, page, msg });

const text = (html, re) => { const m = html.match(re); return m ? m[1].trim() : null; };
const all  = (html, re) => [...html.matchAll(re)];

for (const path of PAGES) {
  const res = await fetch(BASE + path);
  if (!res.ok) { add('FAIL', path, `HTTP ${res.status}`); continue; }
  const html = await res.text();

  // --- Title -------------------------------------------------------------
  const title = text(html, /<title[^>]*>([^<]*)<\/title>/i);
  if (!title) add('FAIL', path, 'no <title>');
  else if (title.length > 60) add('WARN', path, `title ${title.length} chars, Google truncates near 60: "${title}"`);
  else if (title.length < 15) add('WARN', path, `title very short (${title.length}): "${title}"`);

  // --- Meta description --------------------------------------------------
  const desc = text(html, /<meta name="description" content="([^"]*)"/i);
  if (!desc) add('FAIL', path, 'no meta description');
  else {
    if (desc.length > 160) add('WARN', path, `description ${desc.length} chars, truncates near 160`);
    if (desc.length < 70) add('WARN', path, `description only ${desc.length} chars, wasting the snippet`);
    if (/TODO|placeholder|lorem/i.test(desc)) add('FAIL', path, `description contains placeholder text: "${desc.slice(0,80)}…"`);
  }

  // --- Canonical ---------------------------------------------------------
  if (!/<link rel="canonical"/i.test(html)) add('WARN', path, 'no canonical link');

  // --- Headings ----------------------------------------------------------
  const h1s = all(html, /<h1[^>]*>([\s\S]*?)<\/h1>/gi);
  if (h1s.length === 0) add('FAIL', path, 'no <h1>');
  if (h1s.length > 1) add('FAIL', path, `${h1s.length} <h1> elements, should be exactly 1`);

  // --- Images ------------------------------------------------------------
  const imgs = all(html, /<img\b[^>]*>/gi).map(m => m[0]);
  const noAlt = imgs.filter(t => !/\balt=/.test(t));
  const emptyAlt = imgs.filter(t => /\balt=""/.test(t));
  const todoAlt = imgs.filter(t => /alt="[^"]*TODO[^"]*"/i.test(t));
  if (noAlt.length)    add('FAIL', path, `${noAlt.length} <img> with no alt attribute`);
  if (emptyAlt.length) add('WARN', path, `${emptyAlt.length} <img> with empty alt`);
  if (todoAlt.length)  add('FAIL', path, `${todoAlt.length} <img> with placeholder TODO alt text`);

  // --- Open Graph / social ----------------------------------------------
  if (!/<meta property="og:title"/i.test(html))       add('WARN', path, 'no og:title');
  if (!/<meta property="og:description"/i.test(html)) add('WARN', path, 'no og:description');
  if (!/<meta property="og:image"/i.test(html))       add('FAIL', path, 'no og:image, link previews will be blank');
  if (!/name="twitter:card"/i.test(html))             add('WARN', path, 'no twitter:card');

  // --- Structured data ---------------------------------------------------
  const ld = all(html, /<script type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/gi);
  if (ld.length === 0) add('WARN', path, 'no JSON-LD structured data');
  const types = ld.flatMap(m => { try { const j = JSON.parse(m[1]); return [].concat(j).map(x => x['@type']); } catch { add('FAIL', path, 'JSON-LD does not parse'); return []; } });
  if (types.length) add('INFO', path, `schema types: ${types.join(', ')}`);

  // --- Is the content readable without JS? ------------------------------
  // Strip script/style, then measure visible text. AI crawlers and most
  // search bots read this, not the hydrated DOM.
  const stripped = html.replace(/<script[\s\S]*?<\/script>/gi,' ').replace(/<style[\s\S]*?<\/style>/gi,' ').replace(/<[^>]+>/g,' ');
  const words = stripped.split(/\s+/).filter(w => w.length > 1).length;
  add('INFO', path, `${words} words in server-rendered HTML`);
  if (words < 120) add('WARN', path, `only ${words} words server-rendered, thin for ranking`);
  if (/TODO placeholder/i.test(stripped)) add('WARN', path, 'placeholder body copy still present');
}

// --- Site-level files -----------------------------------------------------
// Four independent static files, fetched concurrently. The PAGES loop above
// stays sequential on purpose: against `pnpm dev`, parallel requests mean
// competing on-demand route compiles, which is slower overall.
const [robotsRes, sitemapRes, notFoundRes, llmsRes] = await Promise.all([
  fetch(BASE + '/robots.txt'),
  fetch(BASE + '/sitemap.xml'),
  fetch(BASE + '/definitely-not-a-real-page-xyz'),
  fetch(BASE + '/llms.txt'),
]);

for (const [res, file, label] of [
  [robotsRes, '/robots.txt', 'robots.txt'],
  [sitemapRes, '/sitemap.xml', 'sitemap.xml'],
]) {
  add(res.ok ? 'INFO' : 'FAIL', file, res.ok ? `${label} present` : `${label} missing (HTTP ${res.status})`);
}
add(notFoundRes.status === 404 ? 'INFO' : 'FAIL', '/404', `unknown URL returns HTTP ${notFoundRes.status}`);
add(llmsRes.ok ? 'INFO' : 'WARN', '/llms.txt', llmsRes.ok ? 'llms.txt present' : 'no llms.txt');

// --- Report ---------------------------------------------------------------
const order = { FAIL: 0, WARN: 1, INFO: 2 };
results.sort((a,b) => order[a.level] - order[b.level] || a.page.localeCompare(b.page));
for (const r of results) console.log(`${r.level.padEnd(4)} ${r.page.padEnd(12)} ${r.msg}`);
const fails = results.filter(r => r.level === 'FAIL').length;
const warns = results.filter(r => r.level === 'WARN').length;
console.log(`\n${fails} FAIL, ${warns} WARN`);
