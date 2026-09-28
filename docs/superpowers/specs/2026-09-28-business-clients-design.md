# ნისეკომპანი — Business Clients Section Design Spec

Date: 2026-09-28
Status: Draft for review
Builds on: `2026-09-25-nisekompani-website-design.md`

## Intent

**From the user:** the site speaks only to households. ნისეკომპანი also wants business
clients (hotels, restaurants, offices, anyone with heating, cooling or water systems).
Those clients need regular maintenance and service, not only one-off repairs.
baumer.ge was given as a reference.

**Agreed decisions:**
- Households stay a primary audience; business is added alongside, not instead.
- Koba offers both a **maintenance contract** and **per-visit service** to businesses.
- Six sectors: hotels & guesthouses; restaurants, cafés & bakeries; offices & business
  centers; residential building associations (ამხანაგობები); shops & supermarkets;
  clinics, kindergartens & schools.
- Take baumer.ge's structure (design → install → ongoing service, offers per sector),
  not its scope. Only list systems Koba actually works on.
- No prices, no mention of invoices (unconfirmed), no portfolio (no photos yet).
- Everything is data-driven so sectors and wording can change later.

**Success:** a hotel or restaurant manager landing on the site can tell within seconds
that ნისეკომპანი services businesses, sees their type of business and equipment named,
understands the maintenance contract, and calls.

## Information architecture

| Change | Detail |
|---|---|
| New page `/biznesi/` | "ბიზნესისთვის" — the business landing page |
| Home | Audience choice block directly after the hero: "სახლისთვის" → service pages, "ბიზნესისთვის" → `/biznesi/` |
| Header nav | Adds "ბიზნესისთვის" (desktop nav and the mobile chip row) |
| Footer | Adds "ბიზნესისთვის" link |
| Service pages | Short "ბიზნესისთვის" block linking to `/biznesi/`, naming that service's commercial equipment |
| Sitemap | Includes `/biznesi/` automatically |

No per-sector sub-pages in this iteration (possible later for SEO once there is real
sector content, e.g. photos from hotel jobs).

## `/biznesi/` page sections

1. **Hero** — H1 "გათბობის, გაგრილების და წყლის სისტემების მომსახურება ბიზნესისთვის",
   short lead, call / WhatsApp / Viber buttons.
2. **Two ways to work** — side-by-side:
   - Maintenance contract (მომსახურების ხელშეკრულება): scheduled visits, seasonal
     preparation, priority call-outs, a record of all work done.
   - Per-visit service (ერთჯერადი გამოძახება): call when needed.
3. **Service calendar (signature element)** — a 12-month strip showing when each system
   is serviced: heating in September–October, cooling in April–May, water systems every
   quarter. Colours follow the existing fire / ice / water accents. Static HTML/CSS,
   readable without colour (each marker has a text label), accessible as a table-like
   structure for screen readers.
4. **Equipment we service** — boiler rooms, commercial gas boilers, chillers, fan coils,
   multiple AC units, water heaters and kalonkas, pumps and pressure systems, pipework.
5. **Sectors** — six blocks, each with the sector name, the systems it relies on, and
   what goes wrong for them (e.g. hotel: hot water in every room, boiler room, AC in
   rooms and lobby).
6. **How a contract starts** — numbered sequence: site visit and system check → service
   plan and price → regular visits → priority repairs.
7. **Business FAQ** — 4–5 questions (how the contract price is set, what's included,
   response to breakdowns, working with sites across Tbilisi, existing equipment of any
   brand). Emitted as `FAQPage` JSON-LD.
8. **Call band** — existing `CallBand` component.

## Data

New `business` export in `src/data/site.ts`: page SEO strings, the two offer cards,
calendar entries, equipment list, sectors, contract steps, FAQ. Service objects gain a
`business` field: one sentence plus the commercial equipment names for that service.

## SEO

- Title ≤ 65 chars, description 70–170 chars, one H1, canonical, OG — same rules as the
  other pages (the existing build tests are extended to cover `/biznesi/`).
- JSON-LD: business entity, a `Service` with `audience: BusinessAudience`, `FAQPage`,
  `BreadcrumbList`.
- Primary keywords: "გათბობის სისტემის მომსახურება", "ჩილერის სერვისი", "საქვაბის
  მომსახურება", "კონდიციონერების მომსახურება ოფისისთვის", plus "თბილისი".

## Design

- Reuses the existing visual system (palette, type, components).
- The business page's accent is the logo's navy; fire / ice / water appear in the
  service calendar and equipment markers.
- Must meet the existing bar: mobile-first, no horizontal scroll at 390px, Lighthouse
  ≥ 95 in all four categories.

## Related change

The KartvelOps offer PDF (`private/`) says "5 pages"; update it to 6 pages including the
business page.

## Verification

- `npm test` green, including new `/biznesi/` assertions (head, one H1, JSON-LD types
  `Service` + `FAQPage` + `BreadcrumbList`, contact links, sitemap entry).
- Home and each service page link to `/biznesi/`.
- Screenshots at 390px and 1440px reviewed; Lighthouse run on `/biznesi/`.
