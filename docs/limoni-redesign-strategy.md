# Limoni Cleaning: redesign strategy

Date: 16 October 2026. Based on `docs/limoni-competitive-research.md` (market) and
`docs/limoni-asset-audit.md` (media). **Status: implemented 17 Oct 2026** with the reviewed copy
(`docs/limoni-copy-final.md`). Wording in §9–§10 below is the pre-review draft: the site uses
"Merrni ofertën tuaj" / "Merrni ofertë për biznesin tuaj", not "Kërko preventiv".

## 1. Audit of the current site (live, 16 Oct 2026)

### 1.1 What exists

- **Stack:** Next.js 16 (App Router, static pages), Tailwind v4, Prisma + Postgres (Neon on
  Vercel), Resend email, optional WhatsApp Cloud API alerts. Inter only. npm.
- **Routes:** `/`, `/sherbime`, 7 service pages (`/pastrim-{apartamentesh,airbnb,zyrash,vilash,
  me-themel,pas-ndertimit,hotelesh}-tirane`), `/puna-jone`, `/rreth-nesh`, `/faq`, `/kontakt`,
  `/kerko-oferte`, `/blog` (noindex, empty), `/privatesia`, `/kushtet`, `/llms.txt`, Albanian 404.
  Redirects: `/rezervo`, `/cmimet` → `/kerko-oferte`; `/pronare-airbnb` → `/pastrim-airbnb-tirane#pronare`.
- **Navigation:** Shërbimet · Airbnb · Puna jonë · Rreth nesh · phone number · "Kërko ofertë".
  Mobile: phone icon + full-screen menu; sticky bar with WhatsApp and Telefono.
- **Homepage (prompt 04):** hero "Ne pastrojmë. Ju e gjeni ambientin gati." with the team-at-
  windows photo; 3 facts; "Çfarë pastrojmë" (4 groups, **Airbnb listed first**); a dark green
  **Airbnb section**; before/after slider + 3 photos; checklist; Rreth Limoni; closer
  (WhatsApp fill-in template, phone, 3 steps, form, 4 FAQs).
- **Service pages:** one template (`components/ServicePage.tsx`), each service chooses its own
  sections (checklist, steps, photoStory, pair, text, note) in `lib/services.ts`.
- **Lead flow (works, keep):** `LeadForm` (service chips, name, phone, optional message) →
  `POST /api/lead` (Zod, honeypot, 3-second timing check, 5 per 10 min rate limit, phone →
  E.164) → `Lead` row → email + optional WhatsApp alert after the response. The success state
  only shows after the row is saved.
- **WhatsApp / phone:** `waMessageFor(service)` per service; homepage uses a fill-in template;
  all tested and decoding correctly in September.
- **Trust:** 50+ properties, team with 10+ years' experience, real photos and five real
  videos. No testimonials (none exist; correct). FAQ on `/faq` with FAQPage schema.
- **SEO:** unique titles/descriptions (141–155 characters), canonicals, OG images on every
  page, HousekeepingService `@graph`, Service schema per page, sitemap, robots, noindex on
  `*.vercel.app`, `llms.txt`, Google Maps link.
- **Measured quality:** Lighthouse mobile 94 / 100 / 100 / 100 (performance / accessibility /
  best practices / SEO). It is the fastest Albanian-language site in the comparison set. No
  horizontal scroll at 390 px.

### 1.2 Problems found

| # | Problem | Evidence |
|---|---|---|
| 1 | **Positioning reads Airbnb-first**: Airbnb is the first service group, the only dark section, a nav item, and named in the hero paragraph | Homepage structure above |
| 2 | **No business journey**: offices sit inside a "Biznese" row; no page explains how a business or building gets a quote | Competitor gap too (research §7.3) |
| 3 | **Two confirmed services have no page**: common areas of buildings, sofa/mattress cleaning | Confirmed 16 Oct; footage exists |
| 4 | **Slider touch behaviour**: on touch, dragging anywhere except the handle does nothing; a vertical scroll gesture over the image also jumps the comparison to the finger. No visible instruction | Chrome touch emulation, 16 Oct (§7). Confirm on a real iPhone |
| 5 | **Form lacks the information needed to quote**: no property type, size, one-off vs recurring, timing, or business name; everything goes in the free-text message | `LeadForm` fields |
| 6 | **Quote process is implicit**: price questions get one line ("Çmimi varet nga…"); people search "kompani pastrimi tirane cmimet" | Autocomplete evidence |
| 7 | **New real media unused**: stairs, team in a large house, sofa extraction | Asset audit §2 |
| 8 | **Only one before/after pair**, shown on two pages | Asset audit §5 |
| 9 | **CTA wording** "Kërko ofertë" is fine, but the market's B2B term is "preventiv" (Alfa, Ndrit's dropdown); business visitors get the same wording as homeowners | Research §4.2 |

### 1.3 Keep (do not break)

All URLs and redirects; the lead pipeline and spam protection; `waMessageFor` and the closer
template; the before/after slider (improve it, don't replace it); the per-service sections model;
the image pipeline (≤1600 px, metadata stripped, `npm run check:images`); speed and accessibility
scores; no public prices; no invented claims.

## 2. Positioning

> **Limoni Cleaning është një ekip profesional pastrimi në Tiranë për biznese dhe prona
> banimi: pastrim me themel, pastrim gjeneral dhe mirëmbajtje e rregullt.**

What this means on the page:
- Lead with **businesses and homes together**, deep cleaning and general cleaning first.
- **Show a team** (several people, uniforms, machines), not one cleaner. The October footage
  supports this.
- Airbnb stays a **service among others**, with its own page, not the brand's identity.
- Sound like a capable, honest local team: no "lider", "nr. 1", "standarde britanike",
  certificates or guarantees Limoni can't document.

## 3. Audiences and journeys

| Audience | What they need to see | Entry | Action |
|---|---|---|---|
| **Office / shop / clinic manager** | That Limoni cleans around working hours, can come regularly, and how a proposal is prepared | Home "Për biznese" block, nav "Për biznese", Google "pastrim zyrash tirane" | "Kërko ofertë për biznesin" (form with business fields) or WhatsApp |
| **Building administrator / residents' association** | Stairs, lobbies and entrances cleaned on a schedule; who to talk to; what information is needed (floors, entrances, frequency) | `/pastrim-ambientesh-te-perbashketa-tirane`, business page | Business form with "Pallat / kompleks" selected |
| **Owner/manager of several properties** | One team for several flats, recurring visits | Business page, Airbnb page | Business form or WhatsApp |
| **Homeowner, deep clean** | What "me themel" covers, real results, how the price is set | Home hero, services, "pastrim me themel" | "Kërko preventiv" or WhatsApp with photos |
| **Homeowner, general / regular clean** | Simple: what's included, how often, how to ask | Apartments page | Same |
| **Villa owner** | Larger team, planning by floors | Villa page | Same |
| **After renovation** | When to call, what's removed, real post-construction photos | Pas ndërtimit page | Same |
| **Sofa / mattress** | Real extraction footage, dirty-water proof | Upholstery page; Google "larje divanesh tirane" | WhatsApp with 1–3 photos |
| **Airbnb host** (secondary) | Turnover routine, linens, multiple properties | Airbnb page via Shërbimet | WhatsApp / form |

The navigation serves both groups without extra complexity: **Shërbimet** (homes) and
**Për biznese** (businesses and buildings) are the two doors.

## 4. Design principles

1. **Keep prompt 04's editorial base** (white, hairlines, big real photos, few tone changes,
   text links for secondary actions). The market is full of stock, blobs and badges; restraint
   is a differentiator.
2. **Show the team at work** on every main page; the stairs photo and the extraction clip
   carry the "professional team" message better than any claim.
3. **One clear action per page**, worded for that audience ("Kërko preventiv" for homes,
   "Kërko ofertë për biznesin" for businesses), with WhatsApp always one tap away.
4. **Explain, don't hide**: every service says what's included, what affects the quote, and what
   to send.
5. **Brand colours as today**: dark green for structure and the one dark section; lemon yellow
   only on the primary button. The dark section moves from Airbnb to **business**.
6. **Motion only with a purpose**: a single muted, optional work clip; no autoplaying hero video,
   no music.

## 5. Sitemap (proposed)

All existing URLs stay. New pages are marked **new**.

```
/                                              Kryefaqja (rewritten)
/sherbime                                      Të gjitha shërbimet (grouped: Shtëpi / Biznese / Të veçanta)
/per-biznese                                   new: Pastrim për biznese dhe ndërtesa
/pastrim-zyrash-tirane                         Zyra (expanded)
/pastrim-ambientesh-te-perbashketa-tirane      new: Shkallë, holle, hyrje pallatesh dhe kompleksesh
/pastrim-hotelesh-tirane                       Hotele
/pastrim-me-themel-tirane                      Pastrim me themel
/pastrim-apartamentesh-tirane                  Pastrim gjeneral dhe i rregullt për apartamente e shtëpi
/pastrim-vilash-tirane                         Vila
/pastrim-pas-ndertimit-tirane                  Pas ndërtimit / rinovimit
/larje-divanesh-dyshekesh-tirane               new: Larje divanesh, dyshekësh dhe kolltuqesh
/pastrim-airbnb-tirane                         Airbnb (secondary, unchanged URL)
/puna-jone, /rreth-nesh, /faq, /kontakt, /kerko-oferte, /blog, /privatesia, /kushtet
```

Header: **Shërbimet · Për biznese · Puna jonë · Rreth nesh** · phone · **Kërko preventiv**.
Airbnb leaves the header (still in Shërbimet, footer, and the services page).

Not created: separate "pastrim gjeneral" page. It would duplicate the apartments page. Instead
the apartments page targets "pastrim gjeneral" in its title and H1.

## 6. Homepage wireframe

| # | Block | Content | Media |
|---|---|---|---|
| 1 | Header | As in §5 | Logo |
| 2 | Hero | H1 "Pastrim profesional për biznese dhe shtëpi në Tiranë". Line: "Pastrim me themel, pastrim gjeneral dhe mirëmbajtje e rregullt, nga një ekip me mbi 10 vjet përvojë." Buttons: **Kërko preventiv** · text link **Shikoni punën tonë** | windowsTeam (team, wide) |
| 3 | Facts | 50+ prona të pastruara · Ekip me mbi 10 vjet përvojë · Shtëpi, zyra dhe ndërtesa | none |
| 4 | Two doors | Side by side: **Për shtëpinë** (apartamente, vila, me themel, pas rinovimit, divane) · **Për biznesin** (zyra, ambiente të përbashkëta, hotele, mirëmbajtje e rregullt). Each a short list of text links | none (typography) |
| 5 | Për biznese (the one dark section) | "Zyra, dyqane dhe pallate: pastrim sipas orarit tuaj". 3 lines on how a proposal works. Link to `/per-biznese` + "Kërko ofertë për biznesin" | IMG_3357 stairs (team, branded) |
| 6 | Shikoni si e lëmë pronën | Improved slider (full width), caption, then 3 photos uneven | living-room pair; constructionBefore, kitchen, IMG_3296 (if permitted) |
| 7 | Ekipi në punë | Short text + one muted loop | IMG_3362 sofa extraction (poster first) |
| 8 | Si përgatitet oferta | 4 lines: what you tell us → photos/video on WhatsApp or a visit if needed → written offer → schedule. Plus the factors list (size, condition, type, scope, one-off vs recurring) | none |
| 9 | Closer | "Keni një pronë apo ambient pune për të pastruar?" WhatsApp (fill-in template), phone, form (new fields), 4 FAQs | none |

Airbnb appears as one line in block 4 ("Pastrim për Airbnb"), not its own section.
Tone changes: white → dark (block 5) → muted (6–7) → white: three, as in prompt 04.

## 7. Before/after slider: improvements

Measured on the live site (Chrome touch emulation, 390 px, 16 Oct):
- drag starting on the handle: **works** (50 → 86);
- mouse drag: **works**;
- drag starting elsewhere on the image: **does nothing**;
- vertical swipe over the image: page scrolls **and** the comparison jumps to the finger (50 → 29).

Plan (same component, same purpose):
1. Drive the comparison with **pointer events on the frame** (drag from anywhere), and set
   `touch-action: pan-y` so vertical swipes scroll the page without moving the slider.
2. Keep a real, keyboard-focusable control (`role="slider"`, arrow keys ±5, Home/End,
   `aria-valuenow`, Albanian label) for keyboard and screen-reader users.
3. **Visible instruction** under the frame: "Tërhiqni vijën për të krahasuar".
4. Default 50%; the handle has a 48 px target.
5. Reserved aspect ratio from the image pair (3:2), both images same crop; lazy-loaded below
   the fold.
6. Support **several pairs** in data (`beforeAfterPairs`), but render only real ones. Today
   there is one; the Puna jonë page gets more as Limoni shoots matched pairs.

## 8. Video and sound

- **No full-screen hero video:** every real clip is vertical, 3–10 s, and several show faces or
  client belongings. A cropped vertical clip behind a headline would look blurry and slow the
  page that currently loads fastest in the market.
- **One "Ekipi në punë" loop** (IMG_3362 sofa extraction, or IMG_3360 team after cropping):
  H.264, muted (audio track removed), ≤1 MB, poster image first. It plays only when on screen,
  and never with `prefers-reduced-motion` or Save-Data; otherwise the poster stays with a play
  button. The page works fully if the video never loads.
- **Music: not recommended.** Browsers block audible autoplay (iOS Safari and Chrome require a
  user gesture for sound), so music "on open" can't work reliably. An optional sound toggle (as
  Ndrit has) adds weight and a control nobody needs to request a quote. If Arbri still wants
  it later: a small, user-started toggle, off by default, never on mobile data.

## 9. Conversion

- **CTA wording:** "Kërko preventiv" (homes, header, hero); "Kërko ofertë për biznesin"
  (business page and business block). WhatsApp: "Na shkruani në WhatsApp". No "falas" (free)
  claims: Arbri hasn't confirmed free visits.
- **Form (same endpoint, a few added optional columns):**
  1. Lloji i pronës (chips): Apartament ose shtëpi · Vilë · Zyrë ose dyqan · Pallat ose kompleks · Tjetër
  2. Shërbimi (chips, preselected per page)
  3. Emri · Numri i telefonit (WhatsApp) (required)
  4. Sipërfaqja përafërsisht (m², optional)
  5. Një herë apo rregullisht? (optional chips)
  6. Kur ju duhet? (optional: Sa më shpejt · Këtë javë · Këtë muaj · Pa datë të caktuar)
  7. Emri i biznesit / administratës (only when "Zyrë" or "Pallat" is chosen)
  8. Mesazh (optional), with the line "Mund të na dërgoni foto ose video në WhatsApp pas kësaj."
  - Prisma: add nullable `propertyType`, `sizeM2`, `frequency`, `timing`, `businessName` to
    `Lead` (new migration, no data loss). Email shows them; WhatsApp alert unchanged.
  - Keep validation, honeypot, timing, rate limit, success only after save.
- **"Si përgatitet oferta" block** on the home, business and every service page: factors and the
  photo/video route, so the site doesn't feel secretive about pricing.
- **Reviews slot:** a component that renders only when real Google reviews are added to data,
  with a link to the Google profile. Empty = nothing rendered.

## 10. Proposed Albanian copy (key lines)

| Place | Copy |
|---|---|
| Home H1 | Pastrim profesional për biznese dhe shtëpi në Tiranë |
| Home intro | Pastrim me themel, pastrim gjeneral dhe mirëmbajtje e rregullt, nga një ekip me mbi 10 vjet përvojë në pastrim. |
| Two doors | Për shtëpinë · Për biznesin |
| Business section | Zyra, dyqane dhe pallate: pastrim sipas orarit tuaj. |
| Business page H1 | Pastrim për biznese dhe ndërtesa në Tiranë |
| Business page intro | Pastrojmë zyra, dyqane, hotele dhe ambientet e përbashkëta të pallateve. Vijmë një herë ose rregullisht, në orarin që nuk ju pengon. |
| Business: what we need | Lloji i ambientit · sipërfaqja përafërsisht · sa shpesh · orari kur mund të punojmë · foto ose video nëse keni |
| Common areas H1 | Pastrim shkallësh dhe ambientesh të përbashkëta në Tiranë |
| Common areas intro | Shkallët, hollet dhe hyrjet e pallatit, të pastruara me rregull. Flasim me administratorin ose me banorët dhe caktojmë bashkë ditët. |
| Upholstery H1 | Larje divanesh, dyshekësh dhe kolltuqesh në Tiranë |
| Upholstery intro | Larje me makineri ekstraktimi, direkt në shtëpinë ose zyrën tuaj. Na dërgoni 1–3 foto në WhatsApp për ofertën. |
| Apartments H1 | Pastrim gjeneral dhe i rregullt për apartamente e shtëpi në Tiranë |
| Quote block title | Si përgatitet oferta |
| Quote factors | Madhësia dhe gjendja e pronës · lloji i pastrimit · çfarë përfshihet · një herë apo rregullisht |
| Slider hint | Tërhiqni vijën për të krahasuar |
| Team section | Ekipi në punë |
| Closer | Keni një pronë apo ambient pune për të pastruar? |
| Primary CTAs | Kërko preventiv · Kërko ofertë për biznesin · Na shkruani në WhatsApp |

Rules unchanged: no prices, "përvojë" not "eksperiencë", no em dashes, Prago only on Airbnb.

## 11. SEO direction

| URL | Primary query (phrasing seen in autocomplete or competitor titles) | Title (≤60 with brand) |
|---|---|---|
| `/` | kompani pastrimi tirane | Kompani Pastrimi në Tiranë \| Limoni Cleaning (keep) |
| `/per-biznese` (new) | pastrim per biznese, pastrim ambientesh tirane | Pastrim për Biznese dhe Ndërtesa në Tiranë |
| `/pastrim-zyrash-tirane` | pastrim zyrash tirane | keep |
| `/pastrim-ambientesh-te-perbashketa-tirane` (new) | pastrim shkallesh pallati, ambiente te perbashketa | Pastrim Shkallësh dhe Ambientesh të Përbashkëta |
| `/larje-divanesh-dyshekesh-tirane` (new) | larje divanesh tirane, larje dysheku | Larje Divanesh dhe Dyshekësh në Tiranë |
| `/pastrim-apartamentesh-tirane` | pastrim shtepie tirane, pastrim gjeneral i shtepise | Pastrim Gjeneral Shtëpie dhe Apartamenti, Tiranë |
| `/pastrim-me-themel-tirane` | pastrim me themel | keep |

- Service schema for each new page (provider `#business`), breadcrumbs, OG image from a real
  photo, sitemap entries with a new date, internal links from home, services, business page
  and footer.
- Answer price-intent searches on-page with the "Si përgatitet oferta" block (no numbers).
- Service-area: keep "Tiranë" and "Komuna e Parisit". **Add a neighbourhood list only after
  Arbri confirms the areas served.**
- Reviews: when Google reviews exist, link the profile; never add `aggregateRating` until then.

## 12. Decisions driven by the research and media

| Decision | Because |
|---|---|
| Business door + dark business section | No competitor explains a business quote; Alfa/Ndrit show demand for B2B framing |
| Common-areas page aimed at administrators | Building cleaning is bought via administrators (AMAI); only Silvio mentions it; Limoni has real stair photos |
| Upholstery page with extraction footage | "larje divanesh tirane" in autocomplete; Genesis/Roel own it with stock or unlinked claims; Limoni has real clips |
| "Send photos on WhatsApp" route | Roel's simplest-in-market quote flow; fits no-price policy |
| No counters, badges or guarantees | Market is saturated with unverifiable claims; honesty is the differentiator |
| No hero video, no music | Clips are vertical/short/private; Limoni's speed lead is an asset; audible autoplay is blocked |
| Keep the slider, fix touch | Only real before/after in the market that is aligned; measured touch problems |
| "Preventiv" wording | Used by B2B-oriented competitors (Alfa) |

## 13. Answers from Arbri (17 Oct 2026)

All yes: staff and owner permissions; regular business work; **free assessment visit**;
**all of Tirana and surroundings**; **all upholstery types**; main CTA **"Merr ofertën tënde"**.
Copy is being reviewed by an Albanian-language agent via `prompts/05-rishikim-teksti-shqip.md`.

## 13a. Original questions

1. **Permissions:** staff in IMG_3360 / IMG_3362 (faces visible), owner of the house in IMG_3296.
2. **Recurring business work:** can Limoni commit to regular weekly/monthly visits for offices
   and buildings today? (The pages will say "rregullisht" only if yes.)
3. **Site visits before a quote:** does Limoni visit to assess larger jobs? Free or not? (Copy
   currently avoids the word "falas".)
4. **Neighbourhoods actually served** (for a service-area list).
5. **Upholstery scope:** sofas, mattresses, armchairs, chairs, carpets? (Footage shows sofas.)
6. **CTA wording:** "Kërko preventiv" site-wide instead of "Kërko ofertë"? (Recommended.)

## 14. Implementation outline (after approval)

1. Process new media (privacy-safe JPEG/H.264, posters, muted loop).
2. Prisma migration for the optional lead fields; update form, validation and email.
3. Slider rewrite (pointer events + accessible control + hint), keep data model.
4. New pages via the existing `ServicePage` sections model (+ a `quoteFactors` section and a
   `video` section type); new `/per-biznese` page.
5. Homepage rewrite per §6; header and footer nav; `/sherbime` grouping.
6. SEO: titles, schema, sitemap, llms.txt, internal links.
7. Verify: build, lint, `check:images`, Lighthouse, touch tests on the slider, form submissions
   against a test database, WhatsApp link decoding, 390/1440 screenshots.
