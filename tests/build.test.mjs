// Checks the built site (dist/) the way a search engine sees it.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync, readdirSync } from 'node:fs';

const dist = new URL('../dist/', import.meta.url);
const read = (p) => readFileSync(new URL(p, dist), 'utf8');

const pages = {
  '/': 'index.html',
  '/gatboba/': 'gatboba/index.html',
  '/gagrileba/': 'gagrileba/index.html',
  '/ventilacia/': 'ventilacia/index.html',
  '/tskalmomarageba/': 'tskalmomarageba/index.html',
  '/kontaqti/': 'kontaqti/index.html',
  '/biznesi/': 'biznesi/index.html',
  '/chven-shesakheb/': 'chven-shesakheb/index.html',
};
const servicePaths = ['/gatboba/', '/gagrileba/', '/ventilacia/', '/tskalmomarageba/'];

const decode = (s) =>
  s.replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&lt;/g, '<').replace(/&gt;/g, '>');
const all = (html, re) => [...html.matchAll(re)];
const meta = (html, attr, key) => {
  const m = html.match(new RegExp(`<meta[^>]*${attr}="${key}"[^>]*content="([^"]*)"`)) ??
    html.match(new RegExp(`<meta[^>]*content="([^"]*)"[^>]*${attr}="${key}"`));
  return m ? decode(m[1]) : undefined;
};
const jsonLd = (html) =>
  all(html, /<script type="application\/ld\+json">([\s\S]*?)<\/script>/g).map((m) => JSON.parse(m[1]));
const types = (html) =>
  jsonLd(html)
    .flatMap((d) => (d['@graph'] ? d['@graph'] : [d]))
    .flatMap((n) => [].concat(n['@type']));

const titles = new Set();
const descriptions = new Set();

for (const [path, file] of Object.entries(pages)) {
  test(`${path} has complete SEO head`, () => {
    assert.ok(existsSync(new URL(file, dist)), `${file} missing`);
    const html = read(file);

    assert.match(html, /<html[^>]*lang="ka"/);

    const t = all(html, /<title>([^<]*)<\/title>/g);
    assert.equal(t.length, 1, 'exactly one <title>');
    const title = decode(t[0][1]);
    assert.ok(title.length >= 20 && title.length <= 65, `title length ${title.length}: ${title}`);
    assert.ok(!titles.has(title), 'title unique');
    titles.add(title);

    const desc = meta(html, 'name', 'description');
    assert.ok(desc, 'description present');
    assert.ok(desc.length >= 70 && desc.length <= 170, `description length ${desc.length}`);
    assert.ok(!descriptions.has(desc), 'description unique');
    descriptions.add(desc);

    const canonical = html.match(/<link[^>]*rel="canonical"[^>]*href="([^"]+)"/)?.[1];
    assert.ok(canonical?.startsWith('https://'), 'canonical absolute');
    assert.ok(canonical.endsWith(path), `canonical ${canonical} ends with ${path}`);

    for (const p of ['og:title', 'og:description', 'og:image', 'og:url']) {
      assert.ok(meta(html, 'property', p), `${p} present`);
    }

    assert.equal(all(html, /<h1[\s>]/g).length, 1, 'exactly one <h1>');
    assert.ok(jsonLd(html).length > 0, 'has JSON-LD');
    assert.match(html, /href="tel:\+995\d+"/, 'tel link');
    assert.match(html, /href="https:\/\/wa\.me\/995\d+"/, 'WhatsApp link');
    assert.match(html, /href="viber:\/\/chat\?number=%2B995\d+"/, 'Viber link');
  });
}

test('home declares the local business', () => {
  const t = types(read(pages['/']));
  assert.ok(t.includes('HVACBusiness'), `types: ${t}`);
});

for (const path of servicePaths) {
  test(`${path} has Service, FAQPage and BreadcrumbList data`, () => {
    const t = types(read(pages[path]));
    for (const want of ['Service', 'FAQPage', 'BreadcrumbList']) assert.ok(t.includes(want), `${want} in ${t}`);
  });
}

test('404 page exists and is noindex', () => {
  const html = read('404.html');
  assert.match(html, /<meta[^>]*name="robots"[^>]*content="noindex/);
});

test('sitemap lists all pages and not 404', () => {
  assert.ok(existsSync(new URL('sitemap-index.xml', dist)));
  const xml = read('sitemap-0.xml');
  for (const path of Object.keys(pages)) assert.match(xml, new RegExp(`<loc>https://[^<]*${path.replace(/\//g, '\\/')}</loc>`));
  assert.doesNotMatch(xml, /404/);
});

test('robots.txt points to the sitemap', () => {
  assert.match(read('robots.txt'), /^Sitemap: https:\/\/\S+\/sitemap-index\.xml$/m);
});

test('/biznesi/ has business Service, FAQPage and BreadcrumbList data', () => {
  const html = read(pages['/biznesi/']);
  const t = types(html);
  for (const want of ['Service', 'FAQPage', 'BreadcrumbList']) assert.ok(t.includes(want), `${want} in ${t}`);
  assert.match(html, /"BusinessAudience"/);
});

test('service calendar is readable without colour', () => {
  const html = read(pages['/biznesi/']).match(/<table[^>]*class="[^"]*calendar[\s\S]*?<\/table>/)?.[0] ?? '';
  assert.match(html, /<table[^>]*class="[^"]*calendar/);
  assert.match(html, /<caption/);
  // every marked month carries a text label for screen readers
  const marks = html.match(/class="mark[^"]*"/g) ?? [];
  const labels = html.match(/<span class="visually-hidden"[^>]*>მომსახურება<\/span>/g) ?? [];
  assert.ok(marks.length >= 20, `marks: ${marks.length}`);
  assert.equal(labels.length, marks.length);
});

for (const path of ['/', '/gatboba/', '/gagrileba/', '/ventilacia/', '/tskalmomarageba/']) {
  test(`${path} links to the business page`, () => {
    assert.match(read(pages[path]), /href="[^"]*\/biznesi\/"/);
  });
}

test('emergency call-outs are not promised outside working hours', () => {
  const html = read(pages['/biznesi/']);
  assert.doesNotMatch(html, /ნებისმიერ დროს/);
  assert.match(html, /ავარიული გამოძახება[\s\S]{0,400}10:00–18:00/);
});

test('Georgian capitals (Mtavruli) are covered by the shipped font', () => {
  const cssFiles = readdirSync(new URL('_astro/', dist)).filter((f) => f.endsWith('.css'));
  const css = cssFiles.map((f) => read(`_astro/${f}`)).join('\n');
  assert.match(css, /unicode-range:[^;]*U\+1C90-1CBA/i);
  for (const file of Object.values(pages)) assert.doesNotMatch(read(file), /�/, `${file} has replacement chars`);
});

test('/chven-shesakheb/ is an About page with breadcrumbs', () => {
  const t = types(read(pages['/chven-shesakheb/']));
  for (const want of ['AboutPage', 'BreadcrumbList']) assert.ok(t.includes(want), `${want} in ${t}`);
});

test('header links to the About page', () => {
  assert.match(read(pages['/']), /href="[^"]*\/chven-shesakheb\/"/);
});

test('hero photos stay light enough for phones', () => {
  const imgs = readdirSync(new URL('_astro/', dist)).filter((f) => /^(hero|heating|cooling|water|business|band)\..*\.(webp|avif|jpe?g)$/.test(f));
  assert.ok(imgs.length > 0, 'photo variants found');
  for (const f of imgs) {
    const size = readFileSync(new URL(`_astro/${f}`, dist)).length;
    assert.ok(size <= 450_000, `${f} is ${size} bytes`);
  }
});

test('section labels use one colour', () => {
  const css = readdirSync(new URL('_astro/', dist)).filter((f) => f.endsWith('.css')).map((f) => read(`_astro/${f}`)).join('\n');
  assert.match(css, /\.section-head \.label\{color:var\(--blue-600\)\}/);
});

test('home H1 reads as separate words', () => {
  const h1 = read(pages['/']).match(/<h1[^>]*>([\s\S]*?)<\/h1>/)[1].replace(/<[^>]+>/g, '');
  assert.match(h1, /სერვისი\s+გათბობა/);
});

test('phone menu panel scrolls when taller than the screen', () => {
  const css = readdirSync(new URL('_astro/', dist)).filter((f) => f.endsWith('.css')).map((f) => read(`_astro/${f}`)).join('\n');
  assert.match(css, /\.panel\[data-astro-cid-[^\]]+\]\{[^}]*overflow-y:auto/);
});

test('other-services row has no lonely card (3 per row)', () => {
  // Small page styles may be inlined into the HTML, so search both.
  const css = readdirSync(new URL('_astro/', dist)).filter((f) => f.endsWith('.css')).map((f) => read(`_astro/${f}`)).join('\n') + read(pages['/gatboba/']);
  assert.match(css, /\.others-list\[data-astro-cid-[^\]]+\]\{[^}]*grid-template-columns:repeat\(3,1fr\)/);
});
