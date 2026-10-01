# ნისეკომპანი — pending items

Things still missing from Koba, and the steps that depend on them.
Business details are edited in `src/data/site.ts` (search for `TODO_KOBA`).

## Waiting on Koba

- [ ] **Facebook page.** Not created yet. When it exists, add the link.
      → `facebook` in `src/data/site.ts` (then it shows in the footer, on the contact page and in Google data).
- [ ] **Work photos.** None yet. The site currently uses 6 free stock photos (Pexels, listed in
      `src/assets/photos/CREDITS.md`). Replace them one by one with Koba's real photos (same file names),
      then add a "პროექტები" (Projects) page and upload photos to the Google Business Profile.
- [ ] **Email address.** Needed to create the Google Business Profile (doesn't have to be shown on the site).
- [ ] **Physical address or service-area only?** Decides how the Google Business Profile is set up.
- [ ] **Customer reviews.** Ask happy customers for Google reviews once the Business Profile exists.

## Business page (`/biznesi/`) — confirm with Koba

- [ ] **Invoices.** Can Koba issue invoices to companies (individual entrepreneur / LLC)? If yes, add it to the business page — companies look for it.
- [ ] **Service calendar.** The page shows heating checks in Sep–Oct, cooling in Apr–May, water quarterly, emergency call-outs any time. Confirm this matches how he wants to work.
- [ ] **Contract promises.** Page promises: scheduled visits, seasonal preparation, priority call-outs, a record of all work done. Confirm he can deliver all four.
- [ ] **Business references.** Any hotels / restaurants / offices he already serves (with permission) — strongest proof for business clients.

## Claude Design version (live as preview since 2026-10-01) — confirm with Koba before the real launch

Built from "Nisekompani home page redesign.pdf" (v2, 28.09.2026), including its sign-off sheet items:
- [ ] **New logo** (blue "N" + ნისე კომპანი) — approve or change.
- [ ] **Ventilation** (new service + page `/ventilacia/`): recuperators, AHU, rooftop units, kitchen exhaust — does Koba do these?
- [ ] **New items** on other services: cascade boiler systems, heat pumps, VRF/VRV, multi-zone systems, sewage & drainage — confirm each.
- [ ] **Work cycle** "inspection & design → installation → testing → service" — confirm he does design/projects.
- [ ] **Photos** are stock (see `src/assets/photos/CREDITS.md`) — replace with real ones.
Anything he doesn't confirm is removed in `src/data/site.ts` before the domain goes live.

## Domain: `nisecompany.ge`

- [ ] Register `nisecompany.ge` **in Koba's name** (~30–60 ₾/year).
- [ ] Point the domain to GitHub Pages (DNS records at the registrar) and set it as the custom domain in the repo's Pages settings.
- [ ] In `.github/workflows/deploy.yml`, remove `SITE_URL` and `BASE_PATH` (the site config already uses `https://nisecompany.ge`).

## Google (only after the domain works)

- [ ] Google Search Console: add `nisecompany.ge`, verify via DNS, submit `sitemap-index.xml`, request indexing for the 5 pages.
- [ ] Google Business Profile: create, categories (heating / air conditioning contractor / plumber), service area Tbilisi,
      hours Mon–Sat 10:00–18:00, phone, website link, verify.

## Business (KartvelOps offer)

- [ ] Decide on the monthly support price: keep 300 ₾ with more included, or lower to 150–200 ₾. Update the offer PDF (`private/`) if it changes.

## Done

- [x] Services list, all brands, new installations, hours Mon–Sat 10:00–18:00, 1-month warranty, no prices, no emphasis on experience.
- [x] Diagnosis fee (50 ₾, household equipment) is **not** shown on the site — decided 2026-09-25.
- [x] Domain name chosen: `nisecompany.ge`.
- [x] Phone number +995 571 09 34 95 (calls, WhatsApp, Viber) — 2026-09-28.
- [x] Redesign in the ChatGPT concept's direction (navy + blue, photo headers) + About page — 2026-09-28. Offer PDF updated to 7 pages.
- [x] Business clients page `/biznesi/` (contract + per-visit, 6 sectors, service calendar) — 2026-09-28. Offer PDF updated to 6 pages.
