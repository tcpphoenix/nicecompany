# ნისეკომპანი — website

Services site for ნისეკომპანი: heating (გათბობა), cooling (გაგრილება) and water supply
(წყალმომარაგება) repair in Tbilisi. Built with [Astro](https://astro.build); the output is plain static HTML.

## Changing business details

Everything the site says about the business lives in **`src/data/site.ts`**: phone, WhatsApp,
Viber, working hours, districts, and the text of each service page. Search it for `TODO_KOBA`
to find values still waiting for real answers.

## Commands

| Command | What it does |
|---|---|
| `npm install` | Install dependencies (once) |
| `npm run dev` | Local preview at http://localhost:4321 while editing |
| `npm test` | Build the site and check SEO basics on every page |
| `npm run assets` | Regenerate favicons and share image after replacing `logo.jpeg` |

## Pages

| URL | Page |
|---|---|
| `/` | Home |
| `/gatboba/` | Heating |
| `/gagrileba/` | Cooling |
| `/tskalmomarageba/` | Water supply |
| `/kontaqti/` | Contact |

## Getting on Google (after the site is live on its domain)

1. **Domain.** Set the real address in `astro.config.mjs` (`site`), rebuild and redeploy.
2. **Google Search Console** (search.google.com/search-console): add the domain, verify it
   (DNS record at the domain registrar), then under *Sitemaps* submit `sitemap-index.xml`.
   Use *URL inspection → Request indexing* on the home page and the three service pages.
3. **Google Business Profile** (business.google.com): create the business, category
   "Heating contractor" / "Air conditioning contractor" / "Plumber", service area = Tbilisi,
   add the phone and website link, verify. This is what shows the business on Google Maps.
4. **Reviews.** Ask happy customers to leave a Google review — they strongly affect local ranking.
5. **Photos.** Real photos of work, added to the Business Profile and later to the site.
