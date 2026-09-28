# ნისეკომპანი — Visual Redesign Spec

Date: 2026-09-28
Status: Draft for review
Supersedes the visual sections of `2026-09-25-nisekompani-website-design.md`; content,
SEO and page structure specs stay in force unless changed here.

## Intent

**From the user:** redesign the whole site to look like the ChatGPT concept image
(saved locally as "ვებგვერდის შექმნა.html"): dark, corporate, photo-led, "modern
engineering company" serving homes and businesses. Real phone number 571 09 34 95 (done).

**Agreed decisions:**
- Photos: free stock (Unsplash / Pexels licence — free commercial use), realistic
  residential/commercial equipment, not large industrial plants. Replaced with Koba's
  real photos later. The two boiler-room images in the saved ChatGPT page come from a
  third-party site (TAME Group) and must not be used.
- Colours: dark navy + bright blue. Fire / ice / water colours only on small service icons.
- The pressure-gauge dial stays, restyled, in its own section below the hero.
- Koba's real logo and the Georgian name ნისეკომპანი stay (the concept's invented "N" logo is not used).
- New About page. Projects page only once real photos exist.
- Kept: all copy, SEO, JSON-LD, tests, Georgian only, call/WhatsApp/Viber, business page
  content (incl. service calendar), mobile-first, Lighthouse ≥ 95 in all four categories.

**Success:** side by side with the concept image, the home page reads as the same design
direction (photo hero, blue highlights, white header with phone, icon row, photo service
cards) while using Koba's brand and real content, and nothing regresses in tests,
Lighthouse or mobile layout.

## Visual system

| Token | Value | Use |
|---|---|---|
| navy-950 | `#0B1420` | hero overlays, dark sections, footer |
| navy-900 | `#111C29` | dark cards, call band |
| ink | `#152233` | body text on light |
| blue-500 | `#1E7BFF` | primary buttons, highlight text on dark |
| blue-600 | `#1766D6` | button hover, links on light (contrast ≥ 4.5:1) |
| mist | `#F3F6F9` | light section background |
| white | `#FFFFFF` | header, cards |
| line | `#DCE3EA` | borders |
| fire / ice / water | existing | service icons only |

- **Type:** Noto Sans Georgian (existing, self-hosted). Headings heavy (800). Short eyebrow
  labels rendered in Mtavruli (Georgian capitals, U+1C90–U+1CBF) via a build-time helper;
  H1/H2 text stays Mkhedruli so search engines index normal text.
- **Buttons:** solid blue with white text and arrow; secondary = outlined white on dark,
  outlined navy on light. WhatsApp/Viber keep their brand-coloured icons.
- **Photos:** full-bleed hero photos with a left-to-right navy gradient (text side ≥ 85%
  opaque for contrast). Delivered through Astro `<Image>` as WebP/AVIF with responsive
  widths; hero image `loading="eager"` + `fetchpriority="high"`, others lazy.

## Header

White bar: logo (emblem + wordmark) left; nav: მთავარი, ჩვენ შესახებ, სერვისები
(gathers the 3 service pages), ბიზნესისთვის, კონტაქტი; right: phone number large, and a
small "მოგვწერეთ WhatsApp-ით" line with the WhatsApp icon linking to WhatsApp. Mobile:
existing pattern (logo row + scrollable chip row, fixed bottom call/WhatsApp/Viber bar).
"სერვისები" links to the home services section; the three service pages remain in the
chip row / footer.

## Pages

**Home**
1. Hero: full-bleed photo, Mtavruli eyebrow "სრული სერვისი", H1 (existing SEO heading),
   blue line "გათბობა • გაგრილება • წყალმომარაგება", lead, blue "დაგვიკავშირდით" button
   (→ tel) plus WhatsApp link; bottom row of three service icon items linking to the service pages.
2. Audience choice (home / business), restyled.
3. Services: three photo cards (photo, icon, name, summary, first items, link).
4. Dial section: "რა გაფუჭდა? აირჩიეთ სისტემა" — existing Gauge on a navy panel.
5. Why us (4), steps, districts, call band over a darkened photo.

**Service pages (3):** photo hero per service; then existing sections restyled
(items, problems, business note, steps, FAQ, districts, other services, call band).

**Business page:** photo hero (commercial equipment); existing sections restyled,
service calendar kept.

**About page `/chven-shesakheb/`:** H1, who we are (Tbilisi, heating/cooling/water for
homes and businesses), what we do (links to the 3 services + business), how we work
(diagnosis first, 1-month warranty, all brands, all districts, new installations), CTA.
No years-of-experience claims, no team photos. JSON-LD: AboutPage + business entity +
BreadcrumbList. Title/description within existing test limits.

**Contact and 404:** restyled.

## Photos

~6 images: home hero, heating, cooling, water, business, call band / about. Chosen from
Unsplash or Pexels (non-premium, free licence), stored in `src/assets/photos/`, with a
`CREDITS.md` listing source URL, author and licence for each. If a suitable free photo for
a slot cannot be found, that slot uses a navy gradient with the logo pattern instead of a
photo — never a third-party company's image.

## Offer PDF

Page count 6 → 7 (adds About); the scope list mentions the new design.

## Verification

- `npm test` green; tests extended for `/chven-shesakheb/` (head, one H1, JSON-LD, sitemap)
  and the header phone.
- No horizontal scroll on every page at 360–1920px.
- Lighthouse ≥ 95 on home, a service page, business and about.
- Screenshots compared with the concept image at 1440px and reviewed at 390px.
- Final independent review before publishing.
