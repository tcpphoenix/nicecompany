# Business Clients Section Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a `/biznesi/` page and entry points to it so hotels, restaurants, offices, building associations, shops and clinics see that ნისეკომპანი services businesses under a maintenance contract or per visit.

**Architecture:** All new copy lives in a `business` export in `src/data/site.ts` (plus a `business` sentence on each service). A new page `src/pages/biznesi.astro` renders it using existing components and two new ones: `ServiceCalendar.astro` (the signature 12-month strip) and `AudienceChoice.astro` (home page home/business split). Service pages get a small `BusinessNote.astro`. Tests keep running against `dist/`.

**Tech Stack:** Astro 7, existing components/styles, Node `node:test`.

**Spec:** `docs/superpowers/specs/2026-09-28-business-clients-design.md`

## Global Constraints

- Georgian only. No prices, no mention of invoices, no portfolio.
- Only systems Koba works on: boiler rooms, commercial gas boilers, radiators/underfloor heating, chillers, fan coils, groups of AC units, water heaters & kalonkas, pumps & pressure systems, pipework.
- Sectors exactly: hotels & guesthouses; restaurants, cafés & bakeries; offices & business centers; residential building associations; shops & supermarkets; clinics, kindergartens & schools.
- Title 20–65 chars, description 70–170 chars, one H1, canonical, OG on `/biznesi/` (existing test rules).
- All internal links via `href()`; no hard-coded business facts in pages.
- Mobile: no horizontal scroll at 390px. Lighthouse ≥ 95 on all four categories.

## Review Focus

1. Service calendar at 390px wide — 12 month columns must fit without horizontal page scroll; row labels stay readable. (Checked by screenshot `scrollWidth` in Task 5.)
2. Calendar understood without colour — each marked cell carries a visually hidden text label, and the table has a caption. (Test in Task 2.)
3. Site built under a sub-path (`BASE_PATH=/nicecompany`, as CI does) — links to `/biznesi/` must include the base. (Test in Task 3 asserts `href` ends in `/biznesi/`; CI runs the tests with the base.)
4. Mobile header chip row with a fifth item — still scrolls horizontally inside itself, not the page. (Screenshot check in Task 5.)
5. Long Georgian sector names / equipment names wrap without overflowing cards at 390px. (Screenshot check in Task 5.)

---

### Task 1: Business data

**Files:**
- Modify: `src/data/site.ts`

**Interfaces:**
- Produces: `business` object (shape below); `Service.business: string` on each service.

- [ ] **Step 1: Extend the `Service` interface** — add after `faq: Faq[];`:

```ts
  /** One sentence for the "for businesses" note on the service page. */
  business: string;
```

- [ ] **Step 2: Add `business` to each service object** (after its `faq` array):

gatboba:
```ts
    business: 'სასტუმროებს, ოფისებს და ამხანაგობებს ვემსახურებით ხელშეკრულებით: საქვაბეები, კომერციული გაზის ქვაბები, გათბობის სისტემები.',
```
gagrileba:
```ts
    business: 'ოფისებს, რესტორნებს და მაღაზიებს ვემსახურებით ხელშეკრულებით: ჩილერები, ფანკოილები, კონდიციონერების ჯგუფები.',
```
tskalmomarageba:
```ts
    business: 'სასტუმროებს, რესტორნებს და ამხანაგობებს ვემსახურებით ხელშეკრულებით: წყლის გამაცხელებლები, ტუმბოები, წნევის სისტემები.',
```

- [ ] **Step 3: Add the `business` export** at the end of the file, before the link helpers:

```ts
export const monthsShort = ['იან', 'თებ', 'მარ', 'აპრ', 'მაი', 'ივნ', 'ივლ', 'აგვ', 'სექ', 'ოქტ', 'ნოე', 'დეკ'];

export const business = {
  title: 'გათბობის და გაგრილების მომსახურება ბიზნესისთვის | ნისეკომპანი',
  description:
    'სასტუმროების, რესტორნების, ოფისების და ამხანაგობების გათბობის, გაგრილების და წყლის სისტემების მომსახურება თბილისში — ხელშეკრულებით ან გამოძახებით.',
  h1: 'გათბობის, გაგრილების და წყლის სისტემების მომსახურება ბიზნესისთვის',
  intro:
    'სასტუმრო, რესტორანი, ოფისი თუ საცხოვრებელი კორპუსი — ვზრუნავთ, რომ ქვაბი, ჩილერი, კონდიციონერები და ტუმბოები სეზონის შუაში არ გაჩერდეს.',
  offers: [
    {
      title: 'მომსახურების ხელშეკრულება',
      lead: 'სისტემებს გეგმით ვემსახურებით, რომ ავარია არ მოხდეს.',
      points: [
        'რეგულარული ვიზიტები შეთანხმებული გრაფიკით',
        'გათბობის მომზადება ზამთრისთვის, გაგრილების — ზაფხულისთვის',
        'ავარიისას პრიორიტეტული გამოძახება',
        'ყველა შესრულებული სამუშაოს ჩანაწერი',
      ],
      featured: true,
    },
    {
      title: 'ერთჯერადი გამოძახება',
      lead: 'დაგვირეკეთ, როცა რამე გაფუჭდება ან ახალი დანადგარი გჭირდებათ.',
      points: ['დიაგნოსტიკა და შეკეთება', 'ახალი დანადგარის მონტაჟი', 'ნებისმიერი ბრენდის დანადგარზე'],
      featured: false,
    },
  ],
  /** Service calendar rows. `months` are 0-based (0 = January). */
  calendar: [
    { accent: 'fire', label: 'გათბობა', note: 'შემოწმება გათბობის სეზონამდე', months: [8, 9] },
    { accent: 'ice', label: 'გაგრილება', note: 'წმენდა და შემოწმება ზაფხულამდე', months: [3, 4] },
    { accent: 'water', label: 'წყალმომარაგება', note: 'შემოწმება ყოველ კვარტალში', months: [2, 5, 8, 11] },
    { accent: 'ink', label: 'ავარიული გამოძახება', note: 'პრიორიტეტულად, წლის ნებისმიერ დროს', months: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11] },
  ] as { accent: Accent | 'ink'; label: string; note: string; months: number[] }[],
  equipment: [
    { accent: 'fire', name: 'საქვაბეები' },
    { accent: 'fire', name: 'კომერციული გაზის ქვაბები' },
    { accent: 'fire', name: 'რადიატორები და იატაკის გათბობა' },
    { accent: 'ice', name: 'ჩილერები' },
    { accent: 'ice', name: 'ფანკოილები' },
    { accent: 'ice', name: 'კონდიციონერების ჯგუფები' },
    { accent: 'water', name: 'წყლის გამაცხელებლები და კალონკები' },
    { accent: 'water', name: 'ტუმბოები და წნევის სისტემები' },
    { accent: 'water', name: 'მილგაყვანილობა' },
  ] as { accent: Accent; name: string }[],
  sectors: [
    {
      name: 'სასტუმროები და სასტუმრო სახლები',
      systems: 'ცხელი წყალი ყველა ოთახში, საქვაბე, კონდიციონერები ოთახებში და ლობიში',
      text: 'სტუმარი ცივ შხაპს არ აპატიებს. სისტემებს ისე ვემსახურებით, რომ სეზონის პიკზე არაფერი გაჩერდეს.',
    },
    {
      name: 'რესტორნები, კაფეები და საცხობები',
      systems: 'ცხელი წყალი სამზარეულოში, კონდიციონერები დარბაზში, გათბობა',
      text: 'სამზარეულო ცხელი წყლის გარეშე ვერ იმუშავებს, დარბაზი კი ზაფხულში — გაგრილების გარეშე.',
    },
    {
      name: 'ოფისები და ბიზნეს-ცენტრები',
      systems: 'ჩილერები, ფანკოილები, კონდიციონერები, საქვაბე',
      text: 'სამუშაო დღე არ უნდა შეწყდეს იმის გამო, რომ ოფისში ცხელა ან ცივა.',
    },
    {
      name: 'საცხოვრებელი ამხანაგობები',
      systems: 'საერთო საქვაბე, წყლის ტუმბოები, წნევის სისტემები',
      text: 'ერთი ტუმბოს გაჩერება მთელ კორპუსს წყლის გარეშე ტოვებს. რეგულარული შემოწმება ამას აცილებს.',
    },
    {
      name: 'მაღაზიები და სუპერმარკეტები',
      systems: 'კონდიციონერები, გათბობა, ცხელი წყალი',
      text: 'მყიდველისთვის სასიამოვნო ტემპერატურა და თანამშრომლებისთვის ნორმალური სამუშაო პირობები.',
    },
    {
      name: 'კლინიკები, ბაღები და სკოლები',
      systems: 'გათბობა, ცხელი წყალი, კონდიციონერები',
      text: 'სადაც ბავშვები და პაციენტები არიან, გათბობა და ცხელი წყალი ყოველთვის უნდა მუშაობდეს.',
    },
  ],
  contractSteps: [
    { title: 'ობიექტის დათვალიერება', text: 'მოვალთ და შევამოწმებთ ყველა სისტემას და დანადგარს.' },
    { title: 'გეგმა და ფასი', text: 'შევადგენთ მომსახურების გრაფიკს და შევთანხმდებით ფასზე.' },
    { title: 'რეგულარული ვიზიტები', text: 'გრაფიკით მოვდივართ, ვწმენდთ, ვამოწმებთ და ვიწერთ, რა გაკეთდა.' },
    { title: 'პრიორიტეტული შეკეთება', text: 'თუ რამე გაფუჭდა, ხელშეკრულების მქონე კლიენტთან პირველ რიგში მივდივართ.' },
  ],
  faq: [
    {
      q: 'როგორ განისაზღვრება ხელშეკრულების ფასი?',
      a: 'ფასი დამოკიდებულია დანადგარების რაოდენობაზე, ტიპზე და ვიზიტების სიხშირეზე. ობიექტის დათვალიერების შემდეგ შემოგთავაზებთ ზუსტ ფასს.',
    },
    {
      q: 'რა შედის მომსახურების ხელშეკრულებაში?',
      a: 'გრაფიკით ვიზიტები, დანადგარების წმენდა და შემოწმება, სეზონისთვის მომზადება, ავარიისას პრიორიტეტული გამოძახება და შესრულებული სამუშაოს ჩანაწერი.',
    },
    {
      q: 'რა ხდება, თუ დანადგარი ვიზიტებს შორის გაფუჭდა?',
      a: 'დაგვირეკეთ ან მოგვწერეთ. ხელშეკრულების მქონე კლიენტთან პირველ რიგში მივდივართ.',
    },
    {
      q: 'შეგიძლიათ უკვე დამონტაჟებულ სისტემას მოემსახუროთ?',
      a: 'დიახ. ვმუშაობთ ნებისმიერი ბრენდის დანადგარზე, მიუხედავად იმისა, ვინ დაამონტაჟა.',
    },
    {
      q: 'გვაქვს რამდენიმე ობიექტი თბილისში. მოემსახურებით ყველას?',
      a: 'დიახ. ვმუშაობთ თბილისის ყველა რაიონში, ამიტომ ყველა თქვენს ობიექტს მოვემსახურებით.',
    },
  ] as Faq[],
};
```

- [ ] **Step 4: Typecheck** — `npx astro check` is not installed; run `npm run build`. Expected: build succeeds (nothing renders the data yet).
- [ ] **Step 5: Commit** — `git commit -am "Add business clients data"`.

### Task 2: Tests for the new page and entry points (failing first)

**Files:**
- Modify: `tests/build.test.mjs`

- [ ] **Step 1: Add `/biznesi/` to `pages`** (so the existing head/H1/contact-link checks cover it):

```js
  '/biznesi/': 'biznesi/index.html',
```

- [ ] **Step 2: Add tests** at the end of the file:

```js
test('/biznesi/ has business Service, FAQPage and BreadcrumbList data', () => {
  const html = read(pages['/biznesi/']);
  const t = types(html);
  for (const want of ['Service', 'FAQPage', 'BreadcrumbList']) assert.ok(t.includes(want), `${want} in ${t}`);
  assert.match(html, /"BusinessAudience"/);
});

test('service calendar is readable without colour', () => {
  const html = read(pages['/biznesi/']);
  assert.match(html, /<table[^>]*class="[^"]*calendar/);
  assert.match(html, /<caption/);
  // every marked month carries a text label for screen readers
  const marks = html.match(/class="mark[^"]*"/g) ?? [];
  const labels = html.match(/<span class="visually-hidden">მომსახურება<\/span>/g) ?? [];
  assert.ok(marks.length >= 20, `marks: ${marks.length}`);
  assert.equal(labels.length, marks.length);
});

for (const path of ['/', '/gatboba/', '/gagrileba/', '/tskalmomarageba/']) {
  test(`${path} links to the business page`, () => {
    assert.match(read(pages[path]), /href="[^"]*\/biznesi\/"/);
  });
}
```

- [ ] **Step 3: Run** `npm test` → FAIL (`biznesi/index.html missing`, link tests fail).
- [ ] **Step 4: Commit** — `git commit -am "Test business page and entry points"`.

### Task 3: `/biznesi/` page with the service calendar

**Files:**
- Create: `src/components/ServiceCalendar.astro`, `src/pages/biznesi.astro`
- Modify: `src/lib/schema.ts` (add `businessServiceSchema`)

**Interfaces:**
- Consumes: `business`, `monthsShort` (Task 1); `businessSchema`, `faqSchema`, `breadcrumbSchema` (existing).
- Produces: `businessServiceSchema(siteUrl: URL): object`.

- [ ] **Step 1: Schema builder** — append to `src/lib/schema.ts`:

```ts
export function businessServiceSchema(siteUrl: URL) {
  return {
    '@type': 'Service',
    name: business.h1,
    serviceType: 'გათბობის, გაგრილების და წყლის სისტემების მომსახურება',
    description: business.description,
    url: abs(siteUrl, '/biznesi/'),
    provider: { '@id': abs(siteUrl, '/#business') },
    areaServed: { '@type': 'City', name: 'თბილისი' },
    audience: { '@type': 'BusinessAudience', name: business.sectors.map((s) => s.name).join(', ') },
  };
}
```
and change the import line to `import { site, business, type Faq, type Service } from '../data/site';`.

- [ ] **Step 2: `ServiceCalendar.astro`** — a real `<table class="calendar">` with `<caption>`, a header row of `monthsShort`, one `<tr>` per `business.calendar` row: `<th scope="row">` with label + note, then 12 `<td>`; marked months render `<span class="mark mark--{accent}"><span class="visually-hidden">მომსახურება</span></span>`. The "ავარიული გამოძახება" row (all 12 months) renders as a continuous bar (adjacent marks join via zero cell gap and rounded ends only on first/last). Desktop: first column 13rem for labels. At ≤ 640px each `<tr>` becomes a 12-column grid and the row `<th>` spans the full width above its marks; the month header's first cell is hidden. Current month column gets a subtle highlight via a tiny inline script that adds `data-now` to the matching column index (progressive enhancement; the table is complete without it).

- [ ] **Step 3: `biznesi.astro`** — `Base` with `title`/`description` from `business`, `path="/biznesi/"`, `current="biznesi"`, schema `[businessSchema(root), businessServiceSchema(root), faqSchema(business.faq), breadcrumbSchema(root, [{ name: 'მთავარი', path: '/' }, { name: 'ბიზნესისთვის', path: '/biznesi/' }])]`. Sections in spec order: hero (breadcrumb, label "ბიზნესისთვის", H1, intro, `ContactButtons`), offers (two cards, featured card navy), calendar (`ServiceCalendar`), equipment (chips with accent dot), sectors (6 cards: name as `h3`, systems line, text), contract steps (numbered list — a real sequence), `Faq items={business.faq}`, `Districts`, `CallBand title="მოითხოვეთ ობიექტის დათვალიერება" text="დაგვირეკეთ ან მოგვწერეთ — შევთანხმდებით ვიზიტზე და შევამოწმებთ თქვენს სისტემებს."`.

- [ ] **Step 4: Run** `npm test` → `/biznesi/` head, schema and calendar tests PASS; home/service link tests still FAIL.
- [ ] **Step 5: Commit** — `git add -A && git commit -m "Add business page with service calendar"`.

### Task 4: Entry points — home, nav, footer, service pages

**Files:**
- Create: `src/components/AudienceChoice.astro`, `src/components/BusinessNote.astro`
- Modify: `src/pages/index.astro`, `src/pages/[service].astro`, `src/components/Header.astro`, `src/components/Footer.astro`

- [ ] **Step 1: `AudienceChoice.astro`** — two large linked cards in a 2-column grid (1 column ≤ 700px):
  - "სახლისთვის" — "ქვაბი, კონდიციონერი, ბოილერი — შეკეთება და მონტაჟი ბინაში თუ სახლში." → `href('/') + '#services'` (the home services section gets `id="services"`).
  - "ბიზნესისთვის" — "სასტუმროები, რესტორნები, ოფისები, ამხანაგობები — მომსახურება ხელშეკრულებით ან გამოძახებით." → `href('/biznesi/')`; navy card.
- [ ] **Step 2: Home** — render `<AudienceChoice />` in a section directly after the hero; add `id="services"` to the services section.
- [ ] **Step 3: Header** — add `<li><a href={href('/biznesi/')} aria-current={current === 'biznesi' ? 'page' : undefined}>ბიზნესისთვის</a></li>` before "კონტაქტი".
- [ ] **Step 4: Footer** — add `<li><a href={href('/biznesi/')}>ბიზნესისთვის</a></li>` before "კონტაქტი".
- [ ] **Step 5: `BusinessNote.astro`** — props `text: string`; a single bordered strip: label "ბიზნესისთვის", the text, and a link "ხელშეკრულებით მომსახურება →" to `href('/biznesi/')`. Render in `[service].astro` inside the problems section's wrap, after the problems grid, with `text={service.business}`.
- [ ] **Step 6: Run** `npm test` → all PASS. Also `SITE_URL=https://tcpphoenix.github.io BASE_PATH=/nicecompany npm test` → all PASS (sub-path check, Review Focus 3).
- [ ] **Step 7: Commit** — `git add -A && git commit -m "Link business page from home, nav, footer and service pages"`.

### Task 5: Visual check, Lighthouse, offer PDF, deploy

- [ ] **Step 1:** `npm run build && npx astro preview`; screenshot `/biznesi/`, `/`, `/gagrileba/` at 390×844 and 1440×900 with the scratchpad `shot.mjs`; confirm `scrollWidth == innerWidth` (Review Focus 1, 4, 5). Fix any overflow.
- [ ] **Step 2:** Lighthouse on `/biznesi/` — all four categories ≥ 95.
- [ ] **Step 3:** Offer PDF — in `private/kartvelops-offer.html` change "5 გვერდი" card to "6 გვერდი" with text "მთავარი, გათბობა, გაგრილება, წყალმომარაგება, ბიზნესისთვის და კონტაქტი. ყველა ქართულად." and the price row's "5 გვერდი" to "6 გვერდი"; regenerate the PDF with `pdf.mjs`; confirm still 3 pages.
- [ ] **Step 4:** Update `TODO.md` Done section; commit; push to `main` (triggers deploy); confirm the workflow succeeds and `https://tcpphoenix.github.io/nicecompany/biznesi/` returns 200.
