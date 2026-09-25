// Checks the built site (dist/) the way a search engine sees it.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';

const dist = new URL('../dist/', import.meta.url);
const read = (p) => readFileSync(new URL(p, dist), 'utf8');

const pages = {
  '/': 'index.html',
  '/gatboba/': 'gatboba/index.html',
  '/gagrileba/': 'gagrileba/index.html',
  '/tskalmomarageba/': 'tskalmomarageba/index.html',
  '/kontaqti/': 'kontaqti/index.html',
};
const servicePaths = ['/gatboba/', '/gagrileba/', '/tskalmomarageba/'];

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
