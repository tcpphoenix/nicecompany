# ნისეკომპანი — Website Design Spec

Date: 2026-09-25
Status: Approved

## Purpose

A services website for **ნისეკომპანი** (Nisekompani), a Tbilisi-based repair and
installation business covering heating (გათბობა), cooling (გაგრილება) and water
supply (წყალ მომარაგება). No online sales. The goal is to make customers call or
message, and to rank on Google for local searches in Tbilisi.

## Scope

In scope (v1):
- Georgian-only site (`lang="ka"`)
- Pages: home, three service pages, contact, 404
- Contact via phone call, WhatsApp, Viber (no form)
- Technical SEO foundation (see below)
- Deploy from GitHub to GitHub Pages

Out of scope (v1): request form, other languages, blog, prices, reviews, work
photos, team/about page. These wait for business details from the owner.

## Tech

- **Astro** static site generator, output is plain static HTML/CSS with minimal JS.
- `@astrojs/sitemap` for `sitemap.xml`.
- Self-hosted Georgian web font (via Fontsource) — no third-party font requests.
- Deployed via GitHub Actions to GitHub Pages; custom domain added later.

## Pages

| URL | Page | Primary keyword (ka) |
|---|---|---|
| `/` | Home | გათბობა, გაგრილება, წყალმომარაგება თბილისში |
| `/gatboba/` | Heating | ქვაბის შეკეთება თბილისი |
| `/gagrileba/` | Cooling | კონდიციონერის მონტაჟი / შეკეთება თბილისი |
| `/tskalmomarageba/` | Water supply | სანტექნიკოსი / წყლის გამაცხელებლის შეკეთება თბილისი |
| `/kontaqti/` | Contact | ნისეკომპანი კონტაქტი |
| `/404` | Not found | — |

Latin-transliterated URL slugs so shared links stay readable.

Home sections: hero (headline + call/WhatsApp/Viber), three service cards, why us,
how it works (call → visit/diagnosis → repair), Tbilisi districts served, final CTA.

Service pages: hero in the service's accent color, list of sub-services, common
problems we fix, how it works, districts, FAQ, CTA.

## Content data

All business details live in one file, `src/data/site.ts`: name, phone, WhatsApp,
Viber, email, hours, districts, services and sub-services. Unknown values use
clearly marked placeholders (`TODO_…`) until the owner answers the open questions.

## Design

- Palette from the logo: fire orange (heating), ice blue (cooling), water teal
  (water), dark navy base, off-white background.
- Each service page uses its own accent color.
- Georgian typeface with good Mkhedruli support.
- Mobile-first; sticky bottom action bar on phones (call / WhatsApp / Viber).
- Distinctive, non-template visual direction (frontend-design / ui-ux-pro-max skills).
- Accessible: sufficient contrast, visible focus states, semantic HTML.

## SEO

- Unique `<title>` and meta description per page, canonical URL, `lang="ka"`.
- Open Graph + Twitter card tags with a share image.
- JSON-LD `HVACBusiness` (also typed `Plumber`) with Tbilisi `areaServed`,
  telephone, opening hours; `Service` entries; `FAQPage` on service pages;
  `BreadcrumbList` on inner pages.
- `sitemap.xml`, `robots.txt` pointing to the sitemap.
- Favicon and apple-touch icon from the logo emblem.
- Target Lighthouse ≥ 95 in Performance, Accessibility, Best Practices and SEO.

## Post-launch steps (owner, with guidance)

1. Buy domain, connect to GitHub Pages, update `site` URL in config.
2. Google Search Console: verify domain, submit `sitemap.xml`.
3. Google Business Profile: create, verify, link to site.

## Verification

- `astro build` succeeds with no errors.
- No broken internal links.
- Structured data valid (JSON parses; required fields present).
- Lighthouse run on built site.
- Visual check at mobile (375px) and desktop (1440px) widths.
