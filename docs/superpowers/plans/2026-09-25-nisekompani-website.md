# ნისეკომპანი Website Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build and ship a fast, Georgian-language, SEO-ready services website for ნისეკომპანი (heating, cooling, water supply repair in Tbilisi).

**Architecture:** Astro static site. All business facts live in one data module (`src/data/site.ts`); pages render from it. A single `Seo.astro` head component emits meta tags and JSON-LD. Tests are Node `node:test` files that run against the built `dist/` output, so they check exactly what Google will see.

**Tech Stack:** Astro 7, `@astrojs/sitemap`, `@fontsource-variable/noto-sans-georgian`, `sharp` (asset generation), Node 26 `node:test`, `linkinator` (link check), Lighthouse via `npx`.

**Spec:** `docs/superpowers/specs/2026-09-25-nisekompani-website-design.md`

## Global Constraints

- Language: Georgian only, `<html lang="ka">`.
- Brand name spelled exactly `ნისეკომპანი`. Service names: `გათბობა`, `გაგრილება`, `წყალმომარაგება`.
- URL slugs: `/`, `/gatboba/`, `/gagrileba/`, `/tskalmomarageba/`, `/kontaqti/`, 404. Trailing slashes on.
- Contact channels: phone call, WhatsApp, Viber only. No forms.
- Palette: fire `#E8561F` (heating), ice `#1F6FD1` (cooling), water `#138A8A` (water), navy `#16202E` base, paper `#F6F4EF` background.
- Every business fact comes from `src/data/site.ts`; no hard-coded phone numbers in pages.
- All internal links go through `href()` so a non-root `base` still works.
- No third-party requests at runtime (fonts self-hosted, no analytics yet).
- Lighthouse target ≥ 95 on Performance, Accessibility, Best Practices, SEO.

## File Structure

```
astro.config.mjs            site URL, base, sitemap integration, trailingSlash
package.json                scripts: dev, build, preview, test, assets, check:links
scripts/make-assets.mjs     crops logo emblem → favicons, header mark, OG image
src/data/site.ts            business facts + service content (single source of truth)
src/lib/href.ts             base-aware internal link helper
src/lib/schema.ts           JSON-LD builders (business, service, FAQ, breadcrumbs)
src/styles/global.css       tokens, reset, typography, utilities
src/layouts/Base.astro      <html>, <Seo>, header, footer, sticky contact bar
src/components/Seo.astro    title/description/canonical/OG/JSON-LD
src/components/Header.astro
src/components/Footer.astro
src/components/ContactBar.astro   sticky mobile call/WhatsApp/Viber bar
src/components/ContactButtons.astro  inline call/WhatsApp/Viber buttons
src/components/ServiceCard.astro
src/components/Steps.astro        how-it-works
src/components/Districts.astro
src/components/Faq.astro
src/components/Icon.astro         inline SVG icons (flame, snow, drop, phone, whatsapp, viber)
src/pages/index.astro
src/pages/[service].astro         the three service pages from data
src/pages/kontaqti.astro
src/pages/404.astro
src/pages/robots.txt.ts     robots.txt endpoint (uses site URL)
tests/build.test.mjs        tests over dist/
.github/workflows/deploy.yml
README.md                   how to edit details, deploy, Search Console steps
```

---

### Task 1: Scaffold Astro, site data, and the build test harness

**Files:**
- Create: `package.json`, `astro.config.mjs`, `tsconfig.json`, `src/data/site.ts`, `src/lib/href.ts`, `src/pages/index.astro` (temporary stub), `tests/build.test.mjs`

**Interfaces:**
- Produces: `site` (object), `services: Service[]`, `getService(slug)`, `href(path: string): string`, `telLink()`, `whatsappLink()`, `viberLink()`.

- [ ] **Step 1: Install**

```bash
npm init -y
npm i astro@^7 @astrojs/sitemap @fontsource-variable/noto-sans-georgian
npm i -D linkinator sharp
```

`package.json` scripts:

```json
{
  "type": "module",
  "scripts": {
    "dev": "astro dev",
    "build": "astro build",
    "preview": "astro preview",
    "assets": "node scripts/make-assets.mjs",
    "test": "astro build && node --test tests/",
    "check:links": "linkinator dist --recurse --skip '^(?!file:)'"
  }
}
```

- [ ] **Step 2: Config**

`astro.config.mjs`:

```js
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// SITE_URL / BASE_PATH are overridden in CI until the real domain exists.
export default defineConfig({
  site: process.env.SITE_URL ?? 'https://nisekompani.ge',
  base: process.env.BASE_PATH ?? '/',
  trailingSlash: 'always',
  integrations: [sitemap({ filter: (page) => !page.includes('/404') })],
});
```

`src/lib/href.ts`:

```ts
const base = import.meta.env.BASE_URL.replace(/\/$/, '');
export const href = (path: string) => `${base}${path.startsWith('/') ? path : `/${path}`}`;
```

- [ ] **Step 3: Site data** — `src/data/site.ts` holds name, phone (placeholder `+995 500 00 00 00`, marked `TODO_KOBA`), hours placeholder, 10 Tbilisi districts (მთაწმინდა, ვაკე, საბურთალო, კრწანისი, ისანი, სამგორი, ჩუღურეთი, დიდუბე, ნაძალადევი, გლდანი), and three `Service` objects with `slug`, `name`, `accent`, `title`, `description`, `keyword`, `intro`, `items[]`, `problems[]`, `faq[]`. Link helpers:

```ts
export const telLink = () => `tel:${site.phone.replace(/\s/g, '')}`;
export const whatsappLink = () => `https://wa.me/${site.whatsapp.replace(/\D/g, '')}`;
export const viberLink = () => `viber://chat?number=%2B${site.viber.replace(/\D/g, '')}`;
```

- [ ] **Step 4: Write failing tests** — `tests/build.test.mjs` reads `dist/` and asserts, for each of `index.html`, `gatboba/index.html`, `gagrileba/index.html`, `tskalmomarageba/index.html`, `kontaqti/index.html`:
  - `lang="ka"` on `<html>`
  - exactly one `<title>`, 20–65 chars, unique across pages
  - `meta name="description"` 70–170 chars, unique
  - `link rel="canonical"` absolute, ending in the page path
  - `og:title`, `og:description`, `og:image`, `og:url` present
  - exactly one `<h1>`
  - every `application/ld+json` block parses; index has `@type` including `HVACBusiness`; service pages have `FAQPage` and `BreadcrumbList`
  - a `tel:` link and a `wa.me` link present
  - `404.html` exists and has `noindex`
  - `sitemap-index.xml` exists and the sitemap lists all 5 pages and not 404
  - `robots.txt` contains `Sitemap:` with an absolute URL

- [ ] **Step 5: Run** `npm test` → FAIL (pages missing).
- [ ] **Step 6: Commit** scaffold + tests.

### Task 2: Brand assets

**Files:** Create `scripts/make-assets.mjs`; outputs `public/favicon.png` (48), `public/apple-touch-icon.png` (180), `public/icon-512.png`, `src/assets/emblem.png` (emblem crop, transparent-ish on paper bg), `public/og.png` (1200×630: emblem left, name + three services right on paper background).

- [ ] Crop emblem region from `logo.jpeg` (approx. x 240–840, y 190–620 in the 1080×1095 source), square it, resize. Compose OG image with sharp + SVG text overlay (Georgian text rendered by sharp's librsvg using a system font fallback; if glyphs fail to render, use the full logo on paper background instead).
- [ ] Run `npm run assets`, inspect images visually.
- [ ] Commit.

### Task 3: Design system, layout, SEO head

**Files:** `src/styles/global.css`, `src/layouts/Base.astro`, `src/components/{Seo,Header,Footer,ContactBar,ContactButtons,Icon}.astro`, `src/lib/schema.ts`

Design direction (apply with the frontend-design skill):
- **Concept: "three currents."** The logo's ring split into fire / ice / water. Recurring motif: a thick three-colour arc segment used as section dividers, the hero backdrop, and the service card top edge. Each service page takes over one current's colour.
- **Type:** Noto Sans Georgian Variable. Headlines use Mtavruli (`text-transform: uppercase`, supported for Georgian) at weight 800, width ~80% (`font-stretch`), tight tracking — echoing the logo's wordmark. Body 400, width 100%, 1.65 line height (Georgian needs generous leading).
- **Surface:** warm paper background, navy ink, hairline rules like the logo's divider lines, no generic gradients-on-white, no stock photos.
- **Mobile:** sticky bottom bar with 3 equal buttons (დარეკვა / WhatsApp / Viber), hidden on ≥ 900px where the header shows the phone number.
- **Accessibility:** contrast ≥ 4.5:1 for text (accent colours used for large text/shapes only, or darkened variants for text), `:focus-visible` rings, skip link, `prefers-reduced-motion` respected.

`schema.ts` exports `businessSchema()`, `serviceSchema(service)`, `faqSchema(faq)`, `breadcrumbSchema(items)`. Business type `['HVACBusiness', 'Plumber']`, `areaServed` = Tbilisi `City` + districts, `telephone`, `url`, `logo`, `image`.

`Seo.astro` props: `title`, `description`, `path`, `schema?: object[]`, `noindex?: boolean`.

- [ ] Build stub pages using Base; run `npm test` — head-related assertions pass for existing pages.
- [ ] Commit.

### Task 4: Home page

Sections: hero (Mtavruli headline "გათბობა, გაგრილება, წყალმომარაგება — თბილისში", sub-line, ContactButtons, emblem with arc backdrop), three ServiceCards linking to service pages, why-us (3 points that don't depend on unknown facts: all districts of Tbilisi, one call for all three systems, diagnosis before any work), Steps (დარეკეთ → ვიზიტი და დიაგნოსტიკა → შეკეთება), Districts, final CTA band.

- [ ] Implement; `npm test` index assertions pass.
- [ ] Screenshot 375px and 1440px; fix issues.
- [ ] Commit.

### Task 5: Service pages

`src/pages/[service].astro` with `getStaticPaths()` from `services`. Sections: hero in accent colour with H1 = service keyword headline, intro, items grid, "common problems we fix" list, Steps, Districts, Faq (with `FAQPage` JSON-LD), breadcrumb (visible + JSON-LD), cross-links to the other two services, CTA.

- [ ] Implement; `npm test` service assertions pass.
- [ ] Screenshots; commit.

### Task 6: Contact, 404, robots

- [ ] `kontaqti.astro`: big phone, WhatsApp, Viber, hours, service area, note "ვმუშაობთ თბილისის ყველა რაიონში".
- [ ] `404.astro`: `noindex`, links home + services.
- [ ] `robots.txt.ts`: `User-agent: *\nAllow: /\nSitemap: ${new URL('sitemap-index.xml', site + base)}`.
- [ ] `npm test` fully green; `npm run check:links` clean. Commit.

### Task 7: Deploy + README

- [ ] `.github/workflows/deploy.yml` using `withastro/action` + `actions/deploy-pages` (GitHub Pages) — or Cloudflare Pages if chosen (private repo on free GitHub plan cannot use Pages).
- [ ] README (Georgian + English short): where to change phone/hours (`src/data/site.ts`), how to deploy, Search Console + sitemap submission, Google Business Profile checklist.
- [ ] Commit, push.

### Task 8: Verification

- [ ] `npm test` green, link check clean.
- [ ] Lighthouse (`npx lighthouse` against `astro preview`) mobile, all four ≥ 95; fix regressions.
- [ ] Screenshots at 375 / 768 / 1440 reviewed.
- [ ] Report results to user with the list of `TODO_KOBA` placeholders remaining.
