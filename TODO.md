# ნისეკომპანი — pending items

Things still missing from Koba, and the steps that depend on them.
Business details are edited in `src/data/site.ts` (search for `TODO_KOBA`).

## Waiting on Koba

- [ ] **Phone number.** Koba is getting a new one. The same number is used for calls, WhatsApp and Viber.
      → `phone`, `whatsapp`, `viber` in `src/data/site.ts`.
- [ ] **Facebook page.** Not created yet. When it exists, add the link.
      → `facebook` in `src/data/site.ts` (then it shows in the footer, on the contact page and in Google data).
- [ ] **Work photos.** None yet. When he has some (before/after, installations), add a gallery to the site
      and upload them to the Google Business Profile.
- [ ] **Diagnosis fee (50 ₾ for household equipment: boiler, kalonka, AC).** Koba said no prices on the site.
      Confirm whether this one fee should be shown or not.
- [ ] **Email address.** Needed to create the Google Business Profile (doesn't have to be shown on the site).
- [ ] **Physical address or service-area only?** Decides how the Google Business Profile is set up.
- [ ] **Customer reviews.** Ask happy customers for Google reviews once the Business Profile exists.

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
- [x] Domain name chosen: `nisecompany.ge`.
