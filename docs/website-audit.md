# Limoni Cleaning: website audit (4 November 2026)

Audit made before the November changes from `Limoni-Claude-Website-Prompt.md` and
`Limoni-VSL-Recording-Script.md`. Inspected: source code on branch
`fix/remove-uppercase-labels` (commit 750ffb0, one commit ahead of `main`), the local dev
server (every route fetched, status/title/H1 recorded), and mobile screenshots at 375 px. The
live site was not changed. The change log is at the end of this file.

## 1. Stack and plumbing

| Area | Finding |
|---|---|
| Framework | Next.js 16.3.4 App Router, TypeScript, React 19.2, Tailwind v4, Inter. Every marketing page is static. |
| Content sources | `lib/services.ts` (all service copy + `/per-biznese`), `lib/content.ts` (site-wide copy, FAQ), `lib/service-index.ts` (client-safe slugs, labels, form options), `lib/photos.ts`, `lib/portfolio.ts`, `lib/latest-project-media.ts` (media rendered only if the processed file exists). |
| Shared components | `ServicePage` (one template, per-page sections), `ResidentialDeepCleaningLanding` (custom page for `/pastrim-me-themel-tirane`), `LeadForm`, `Closer`, `LeadActions`, `Header`, `MobileStickyCta`, `Footer`, `WorkLoop`, `PortfolioVideo`, `BeforeAfterSlider`. |
| Forms | One component, `LeadForm`, used on the homepage closer, every service closer, `/kerko-oferte`, `/kontakt` and the deep-cleaning page. All post to `POST /api/lead`. |
| API | `app/api/lead` (Zod validation, honeypot, 3 s minimum fill time, 5 per 10 min per IP in memory, phone normalised to E.164, row saved with Prisma, then `notifyNewLead()` in `after()`). `app/api/booking` and `app/api/contact` return 405 for GET (410 for POST, kept for history). |
| Delivery | Resend email (needs `RESEND_API_KEY`, `EMAIL_TO`, `EMAIL_FROM`); WhatsApp Cloud API owner alert only when the four `WHATSAPP_*`/`OWNER_WHATSAPP` vars exist. Both are skipped with a log line when unset. Success is shown only after the row is saved: correct. |
| Database | Postgres via Prisma. `Lead` is the only table written. `bookings` / `contact_messages` kept for history. |
| Analytics | GA4 only when `NEXT_PUBLIC_GA_MEASUREMENT_ID` is set (unset in `.env.example`; production value unknown from the repo). Events: `lead_submitted`, `whatsapp_click`, `phone_click` (`quote_cta_click` declared but never fired). No PII in payloads. |
| Hosting | Vercel (`vercel.json` runs `prisma migrate deploy` on build). DNS at Vercel, mail at Hostinger. |
| SEO | Per-page metadata and canonicals, OG images, `HousekeepingService` @graph, Service + Breadcrumb JSON-LD, FAQPage only on `/faq`, VideoObject on `/puna-jone`, sitemap, robots (disallow `/api/`), `llms.txt`, noindex on `*.vercel.app`, blog noindex while empty. |
| Languages | Albanian only (`lang="sq"`). No locales to preserve. |
| PWA / install | None: no manifest (`/manifest.webmanifest` → 404), no service worker. `app/icon.png` and `app/apple-icon.png` exist (512×512). |
| Consent banner | None (no advertising cookies; GA optional). Nothing for the mobile bar to collide with. |
| Tests | None in the repo. Checks available: `npm run lint`, `npx tsc`, `npm run build`, `npm run check:images`. |
| Repo visibility | **Public on GitHub.** Internal pricing beyond the published reference rate, ad metrics and customer conversations must not be committed (see §6). |

## 2. Route inventory

From the file system (`app/`), the sitemap, the header/footer/mobile menu and in-page links.
Status codes from the local dev server.

| Route | Status | In sitemap | Linked from | Notes |
|---|---|---|---|---|
| `/` | 200 | yes | logo, menu | |
| `/sherbime` | 200 | yes | header, menu, footer | |
| `/pastrim-apartamentesh-tirane` | 200 | yes | footer, /sherbime, home | |
| `/pastrim-me-themel-tirane` | 200 | yes | footer, /sherbime, home | custom landing; campaign page |
| `/pastrim-pas-ndertimit-tirane` | 200 | yes | footer, /sherbime, home | |
| `/pastrim-vilash-tirane` | 200 | yes | footer, /sherbime, home | |
| `/larje-divanesh-dyshekesh-tirane` | 200 | yes | footer, /sherbime, home | |
| `/pastrim-airbnb-tirane` (+ `#pronare`) | 200 | yes | footer, /sherbime, home | |
| `/pastrim-zyrash-tirane` | 200 | yes | footer, /sherbime, home | |
| `/pastrim-ambientesh-te-perbashketa-tirane` | 200 | yes | footer, /sherbime, home | |
| `/pastrim-hotelesh-tirane` | 200 | yes | footer, /sherbime, home | |
| `/per-biznese` | 200 | yes | header, menu, footer | |
| `/puna-jone` | 200 | yes | header, menu, footer | |
| `/rreth-nesh` | 200 | yes | header, menu, footer | |
| `/faq` | 200 | yes | menu, footer | |
| `/kontakt` | 200 | yes | menu, footer | |
| `/kerko-oferte` (+ `?sherbimi=<key>` for every page key) | 200 | yes | header CTA, every hero | query variant preselects the service |
| `/privatesia`, `/kushtet` | 200 | yes | footer, form | |
| `/blog` | 200 | no (noindex) | nowhere | orphan by design until the first post |
| `/blog/[slug]` | 404 | no | nowhere | no posts |
| `/rezervo`, `/cmimet` | 308 → `/kerko-oferte` | no | old links | |
| `/pronare-airbnb` | 308 → `/pastrim-airbnb-tirane#pronare` | no | old links | |
| unknown path | 404 | | | Albanian 404 with service links and a form |
| `/llms.txt`, `/sitemap.xml`, `/robots.txt`, `/opengraph-image` | 200 | | | |
| `/api/lead` | POST only | | forms | |

States inspected in code: form idle / field errors / server field errors / rate limit (429) /
network failure / success; mobile menu open (scroll lock, Escape); sticky bar hidden on
`/kerko-oferte` and while a text field has focus.

## 3. Page-by-page matrix (before the changes)

Legend for "price": what the page says about cost before this work.

| Page | Audience and intent | H1 | Service definition / inclusions | Exclusions | Proof | Price treatment | Next step / form context | Mobile | Issues found |
|---|---|---|---|---|---|---|---|---|---|
| `/` | Everyone; "who cleans in Tirana and how do I get a price" | Pastrim profesional për biznese dhe shtëpi në Tiranë | Two doors (home / business), business block, quote steps, price factors | none | 3 confirmed facts, before/after, 3 photos, sofa clip | "Çmimi varet…" (no numbers) | Header CTA, hero LeadActions, closer (WhatsApp template, phone, form, 4 FAQs) | good; sticky WhatsApp/phone | No deep-cleaning price although ads quote one; free plan/assessment benefit not stated; no path to the campaign offer |
| `/sherbime` | Choosing a service | Shërbime pastrimi në Tiranë | 3 groups with one-line summaries | n/a | none | none | WhatsApp/phone | good | Deep clean sits in "Pastrime të veçanta", far from the home group |
| `/pastrim-apartamentesh-tirane` | Occupied home, one-off or regular | Pastrim gjeneral dhe i rregullt… | Room-by-room list; explains gjeneral vs me themel | not stated | 3 photos | generic | hero + closer form preset `apartamente` | good | No exclusions (laundry, inside appliances, sofa washing); no assessment explanation |
| `/pastrim-me-themel-tirane` | Campaign page; occupied home deep clean | Pastrim me themel, deri në detaj. | Kitchen, bath, rooms, windows, inside cupboards "sipas marrëveshjes", appliances "sipas kërkesës" | none | 50+ / 10 vjet / equipment, real media (mostly post-construction) | "Çmimi përcaktohet sipas gjendjes" | WhatsApp "Dërgoni foto", form preset | good | **No price although the ad and WhatsApp replies quote 250 lekë të reja/m²**; **sofa and mattresses included in the package but never mentioned**; steps say "Na dërgoni … disa foto" (photos read as required); no drying/preparation/exclusions; hero mentions villas (villa pricing is assessed); evidence captions mix post-construction with deep clean |
| `/pastrim-pas-ndertimit-tirane` | New/renovated property | Pastrim pas ndërtimit dhe rinovimit… | Dust, floors, glass, frames, tracks, small residues | large debris must be removed first | before/after pair, Oct media | generic | form preset | good | Not distinguished from deep-clean pricing; no note that heavy residues change the price |
| `/pastrim-vilash-tirane` | Large private houses | Pastrim vile në Tiranë | Floors, rooms, bathrooms, windows; assessment first | none | 1 photo | generic + "vizitë pa pagesë" | form presets property type `vile`, service unselected | good | Visitor must pick the service again; no exclusions |
| `/larje-divanesh-dyshekesh-tirane` | Standalone upholstery | Larje divanesh dhe dyshekësh… | Sofas, corners, armchairs, fabric chairs, mattresses; extraction; drying depends | stains may remain | 2 real clips | "Na dërgoni 1–3 foto … dhe ju japim ofertën" | form preset `divane` | good | **Photos presented as the way to get a price** (meta, intro, FAQ); does not say the deep-clean package already includes the home's sofa and mattresses |
| `/pastrim-airbnb-tirane` | Hosts, one or several units | Pastrim Airbnb në Tiranë | Turnover steps, rooms, sheets changed when clean ones are in the property, Prago line | sheets only if clean ones present (implicit) | 2 photos | generic | form preset | good | Laundry/restocking exclusion only implicit |
| `/pastrim-zyrash-tirane` | Offices | Pastrim zyrash në Tiranë | Desks, kitchen, floors, bins; out of hours | none | 1 photo | generic | form preset | good | No exclusions; free visit not mentioned here |
| `/pastrim-ambientesh-te-perbashketa-tirane` | Building administrators | Pastrim shkallësh dhe ambientesh… | Stairs, rails, halls, entrance, glass, bins; free visit | lift omitted (correct) | photo + clip | free visit | form preset | good | Lift exclusion not stated explicitly |
| `/pastrim-hotelesh-tirane` | Hotels / apart-hotels | Pastrim hotelesh në Tiranë | Rooms + common areas; extra staff by demand | none | 1 photo | generic | form preset | good | Thin; laundry exclusion not stated |
| `/per-biznese` | Business door | Pastrim për biznese dhe pallate… | Who, what, frequency, quote steps, contract | none | 2 photos | free visit, written offer | form preset property type `zyre` | good | Fine; same "plan + written offer" benefit can be named consistently |
| `/puna-jone` | Proof | Puna jonë: para dhe pas pastrimit | 6 projects with honest captions | n/a | real media | n/a | WhatsApp/phone | good | Fine |
| `/rreth-nesh` | Trust | Rreth nesh | New company, team 10+ years, 50+ properties | n/a | 1 photo | free visit for larger jobs | WhatsApp/phone | good | Founder not named although the founder video will introduce Arbri |
| `/faq` | Objections | Pyetje të shpeshta | 16 Q&As | | | "Çmimi varet…" | WhatsApp/phone | good | No price/unit answer (lekë të reja vs të vjetra), no "is this a booking", no "photos required?", no drying, no Kamza/Durrës |
| `/kontakt` | Direct contact | Kontakt | Phone, area, email, maps, form | | | | form (no preset) | good | Area line to update |
| `/kerko-oferte` | Quote request | Kërkoni ofertë për pastrim | Form + WhatsApp/phone + next steps | | | none | form preset from `?sherbimi=` | sticky bar hidden | No price guidance before personal data; service must be reselected when no preset; no assessment-method choice; success text promises contact "për ofertën" only |
| `/privatesia` | Legal | Politika e Privatësisë | lists stored fields | | | | | | Field list will be out of date once new form fields exist; "Të drejtat e tua" mixes ti/ju |
| `/kushtet` | Legal | Kushtet e Shërbimit | request ≠ booking (good) | | | **"Faqja nuk publikon tarifa"** | | | Contradicts the new indicative price |
| `/blog` | none yet | Blog | empty state | | | | | | Fine (noindex) |
| 404 | Lost visitors | Kjo faqe nuk ekziston | service links + form | | | | | | Fine |

## 4. Contradictions and risks found

| # | Topic | Where | Resolution |
|---|---|---|---|
| C1 | **Price**: ads and WhatsApp replies quote 250 lekë të reja/m² for deep cleaning; the site says no prices anywhere (`CLAUDE.md`, `/kushtet`, every FAQ) | site-wide | Publish the 250 reference **only for apartment deep cleaning** (restricted 5 Nov 2026; houses were an assumption), labelled indicative, with the 80 m² example. Houses, villas and every other service stay "after assessment". `/kushtet` and `CLAUDE.md` updated. |
| C2 | **Heavy post-construction work** (the founder uses a higher internal rate) vs deep cleaning | `/pastrim-pas-ndertimit-tirane`, deep-clean page | Public pages say heavy residues are priced higher and confirmed after assessment, **without publishing the number** (it is not a universal ceiling and the repo is public). the rate lives in `internal/` sales notes. |
| C3 | **Sofa and mattresses**: included in the deep-clean package (founder), never mentioned on the deep-clean page; upholstery page treats them as a separate paid job only | deep-clean, upholstery | Apartment deep clean: "larja e divanit dhe e të gjithë dyshekëve përfshihet"; quantities, sizes, materials and condition recorded at assessment and the included items listed in the written offer. No one-item limit, no "unlimited", not a promotion. Upholstery page: standalone washing quoted separately, plus a pointer to the package. |
| C4 | **"Sofa OR mattress"** wording (WhatsApp preset "divanit ose dyshekut", FAQ "A lani divane dhe dyshekë?") | whatsapp-messages, FAQ | Kept for standalone upholstery (correct there). Package wording says both. |
| C5 | **Photos optional vs required**: "Na dërgoni 1–3 foto … dhe ju japim ofertën", "Na dërgoni … disa foto", WhatsApp preset "Po ju dërgoj disa foto" | upholstery, deep clean, presets | Photos become optional everywhere ("nëse doni"); a phone call is always enough to start; visit if needed. Upholstery preset rewritten. |
| C6 | **Gjeneral vs me themel**: deep-clean hero lists villas; apartments page says deep clean "mund të përfshijë" cupboards | deep clean, apartments | Deep-clean price applies to "banesa" (apartamente dhe shtëpi). Villas stay assessed. Apartments page keeps the comparison and links to the priced page. |
| C7 | **Construction vs occupied home**: deep-clean evidence is mostly post-construction footage | deep clean | Captions already say so; the page now states which job each clip is from and adds an explicit "Pas punimeve?" split. |
| C8 | **Drying claims**: upholstery page is careful; deep-clean page silent although the package includes upholstery | deep clean | Drying note added (depends on material and airing, not instant, plan same-day use beforehand). |
| C9 | **Totals vs estimates**: form success says "për ofertën"; nothing distinguishes indicative from confirmed total | form, deep clean | Calculator result labelled "vlerësim orientues"; written offer = confirmed total; booking needs agreed scope, total and date. |
| C10 | **Requesting vs confirming**: `/kushtet` is correct ("nuk është rezervim"); form success does not say it | form | Success state states it is a request, not a confirmed cleaning. |
| C11 | **Free visit** promised "për punët më të mëdha" (vila, zyra, ambiente, per-biznese, rreth-nesh, FAQ, homepage) | content, faq | **Free visit removed everywhere (5 Nov 2026, unconfirmed).** Free deliverable is only the **plan and written offer**; a visit is arranged when needed and any charge is stated and agreed first; outside Tirana, feasibility and transport are confirmed first. |
| C12 | **Service area**: "të gjithë Tiranën dhe zonat përreth" | content | "Tiranë dhe zonat përreth, si Kamza dhe Durrësi", feasibility confirmed per job. |
| C13 | **Phone numbers** | all | Consistent: +355 68 900 7252 / `wa.me/355689007252` everywhere (checked by grep). No conflict. |
| C14 | **WhatsApp prefills** | all | One function, encoded with `encodeURIComponent`; ë/ç survive. Fine; upholstery preset edited (C5). |
| C15 | **Mobile bar** has no quote action; quote CTA only in header/hero | layout | New three-item bar: WhatsApp · Kërko ofertë (centre, prominent) · Telefono. |
| C16 | **Accessibility**: chips are radio inputs with visible focus, labels above inputs, 48 px targets. Sticky bar uses icon + text. OK. | | Keep patterns. |
| C17 | **Stale promotion copy** | none found | n/a |
| C18 | **Broken/duplicate links** | none found (all internal links resolve; `/blog` orphan by design) | n/a |
| C19 | `quote_cta_click` declared, never sent | analytics | Now sent from the quote buttons and the mobile bar. |
| C20 | **UTM lost** if the visitor lands on a page with UTM and submits the form on another page | LeadForm | First-touch UTM kept in `sessionStorage` (campaign values only, no personal data). |

## 5. Information architecture decisions

1. **No new routes.** `/pastrim-me-themel-tirane` stays the residential campaign page (it already
   receives the ad traffic and has the custom template). No duplicate landing page. Sitemap and
   canonicals unchanged apart from `lastModified`.
2. **Homepage stays business + home.** It gains a deep-cleaning price band inside the home path
   and the named assessment benefit; the business door is unchanged.
3. **Every service page** gets the same four practical blocks, filled with page-specific content:
   *Për kë është*, *Çfarë nuk përfshihet*, *Si caktohet çmimi*, *Para pastrimit* (preparation).
   Only confirmed facts; open points are listed in §7.
4. **One form, progressive disclosure.** The service comes from the page; fields shown depend on
   the service (area + "Nuk e di", occupied vs after works only for deep cleaning, items for
   upholstery, frequency only for recurring services, business name only for business types).
   Price guidance and service questions come before name and phone.
5. **CTA wording.** Header and heroes keep the reviewed "Merrni ofertën tuaj". The deep-cleaning
   page's primary button and the form's submit button say **"Kërko vlerësim"** (matches the
   founder script). The mobile bar says **"Kërko ofertë"** (short label, same convention as the
   existing "Dërgo kërkesën"). No "Rezervo" anywhere.
6. **Assessment benefit** everywhere a quote is requested: "Plan pastrimi dhe ofertë me shkrim,
   pa pagesë." Personalised plan is prepared manually after assessment
   (`docs/assessment-fulfillment-template.md`); the site never says it was generated on submit.
7. **Install shortcut** without a service worker (not needed for installability in Chromium per
   MDN; avoids caching prices). Manifest `start_url` = `/kerko-oferte?utm_source=homescreen`.
8. **Founder video** is a configured slot (`lib/founder-video.ts`), hidden until a real file,
   poster and Albanian captions exist in `public/`. The existing real-work clips remain as the
   honest fallback.

## 6. What stays out of the public repo

`internal/` is git-ignored. It holds: the heavy-work rate and its reply, the conversation
recoveries from the sales playbook, and the ad baseline (€51.53, 39 conversations, 1 booking).
`docs/sales-handoff.md` contains only templates that are safe to publish.

## 7. Open items for Arbri (not invented on the site)

| Item | Why it matters | Current treatment |
|---|---|---|
| Does 250 lekë të reja/m² apply to houses/villas? | Deep-clean page | Apartments only since 5 Nov; houses and villas get an assessed quote until confirmed. |
| Number of sofas included (one living-room sofa? all?) | Package wording | "divani dhe dyshekët e banesës", quantities confirmed in the written offer. Confirm. |
| Transport cost policy for Kamza / Durrës | Area line | "E konfirmojmë paraprakisht". Give the actual rule. |
| Does an assessment **visit** cost anything, and how much (in and outside Tirana)? | Visit wording | No visit is called free; "any cost is stated and agreed first". |
| Minimum job size / minimum price | Small flats (e.g. 30 m² = 7.500) | Not mentioned. |
| Water and electricity needed on site | Preparation note | Removed from all pages and the template (5 Nov 2026); add back only if confirmed. |
| Products/method names for upholstery and kitchens | FAQ "çfarë produktesh" | Answer offers to tell the product names; no eco/safety claims. |
| Hours of reply on WhatsApp | Out-of-hours reply | No response-time promise anywhere. |
| Founder video file, poster, captions, measured runtime | VSL slot | Hidden until supplied (`docs/vsl-production.md`). |
| Real testimonials with permission | Proof | None shown. |
| Completion inspection / quality check | Final-offer template | Not promised. |
| GA4 Measurement ID in production | Measurement | Unknown from the repo; events no-op without it. |
| Legal review of `/privatesia` and `/kushtet` | Compliance | Field list and price paragraph updated factually; no new legal claims. |

## 8. Change log (branch `feat/assessment-pricing-mobile-bar`, not committed, not deployed)

### Page by page

| Page | Change |
|---|---|
| `/` | Hero mentions "Tiranë dhe zonat përreth"; two path links (Për shtëpinë / Për biznesin); deep-clean price band in the home door (nga 250 lekë të reja/m², sofa and mattresses included, 80 m² example); "Si përgatitet oferta" names the benefit and the new four steps (assessment routes, written plan, booking only after acceptance); price paragraph; founder-video slot (hidden); FAQ: price, photos optional, request ≠ booking, area. |
| `/pastrim-me-themel-tirane` | Rebuilt: outcome H1, indicative price + example in the hero, "Kërko vlerësim" + WhatsApp, "photos optional"; "Çfarë përfshihet" with the sofa/mattress inclusion and drying note; "Si llogaritet çmimi" (worked example, old-lek equivalent, what changes the total, where it doesn't apply, no surprise charges, link to post-construction); founder-video slot (hidden); evidence with corrected captions; benefit + three assessment routes + visit note; four steps; exclusions and preparation; preselected form with live estimate; 8 FAQs. Meta title/description now carry the price. |
| `/pastrim-apartamentesh-tirane` | Practical blocks (who / not included / pricing: no m² rate for regular cleaning / preparation); deep-clean comparison mentions upholstery and the reference price. |
| `/pastrim-pas-ndertimit-tirane` | Practical blocks; price FAQ explains heavy residues are priced higher after assessment (no number published). |
| `/pastrim-vilash-tirane` | Practical blocks (assessed; visit "zakonisht", any cost disclosed first). |
| `/larje-divanesh-dyshekesh-tirane` | Photos optional in meta, intro, FAQ and the WhatsApp preset; note linking to the deep-clean package; practical blocks (standalone pricing, no stain or drying guarantees). |
| `/pastrim-airbnb-tirane`, `/pastrim-zyrash-tirane`, `/pastrim-ambientesh-te-perbashketa-tirane`, `/pastrim-hotelesh-tirane`, `/per-biznese` | Practical blocks with page-specific exclusions (no laundry/restocking, no building lifts), pricing basis and preparation; visit answers limited to Tirana. |
| `/kerko-oferte` | New H1/meta, benefit box, deep-clean reference line, visit note, request ≠ booking; bar shows WhatsApp + phone only. |
| `/faq` | New: lekë të reja vs të vjetra, the free plan, photos optional, request ≠ booking, upholstery included, drying; updated price, area and visit answers. |
| `/rreth-nesh` | Founder named; area and free plan/visit wording. |
| `/kontakt`, footer | New area line; footer has the optional install link on phones. |
| `/kushtet` | Price paragraph replaced (indicative price, written total, travel outside Tirana); new section on the free plan and offer. Dated Nov 2026. **Needs owner/legal review.** |
| `/privatesia` | Field list updated for the new optional fields; photos stay in WhatsApp; form values are not stored on the device; "Të drejtat tuaja". Dated Nov 2026. **Needs owner/legal review.** |
| All pages | Mobile action bar (WhatsApp · Kërko ofertë · Telefono), install link in the mobile menu, manifest + icons, first-touch UTM kept per tab, 1 px header overflow at 320 px fixed. |
| `llms.txt`, sitemap | Price and benefit sentence; `lastModified` 2026-11-04. No route changes, no new redirects. |

### Functionality

- **Form** (`components/LeadForm.tsx`, `lib/lead-form.ts`): service preselected with "Ndrysho shërbimin"; fields by service; area with "Nuk e di"; condition (deep clean only); live indicative estimate (deep clean only, never for post-construction or unknown size); priorities/items; zone or city (no address); preferred timing with optional date (a preference); assessment method; contact channel; live summary; "Kërko vlerësim". Values survive validation errors and client-side navigation in memory only. Offline: nothing sent, nothing queued. 15 s timeout. Same request id on retry.
- **API** (`app/api/lead`): new optional fields; estimate recomputed server-side; duplicate submits answered from the first row (`clientRequestId` unique, race handled); honeypot, timing check and rate limit unchanged.
- **Email**: new fields, indicative amount labelled "jo total i konfirmuar", "kërkesë për vlerësim, jo rezervim".
- **Database**: migration `20261104120000_lead_assessment_flow` (additive, nullable/defaulted columns; statuses `VLERESIM`, `PERFUNDUAR`, `PAGUAR`, `NE_PRITJE`; `quotedTotalLek`, `statusNote`). Runs automatically on the next Vercel build (`prisma migrate deploy`).
- **Analytics**: `service_view`, `quote_cta_click`, `whatsapp_click`, `phone_click`, `form_start`, `lead_submitted`, `lead_failed`, `video_start/progress/complete`, `install_offer_view/click/accepted/dismissed`. No personal data. No-op without `NEXT_PUBLIC_GA_MEASUREMENT_ID`.
- **Install shortcut**: manifest (`start_url=/kerko-oferte?utm_source=homescreen`, standalone, 192/512/maskable icons), Chromium prompt when offered, Safari/iOS steps from Apple's guide, in-app browser guidance, hidden in standalone and on desktop. No service worker.
- **Founder video**: slot + accessible player, hidden until configured (`docs/vsl-production.md`).

### Verification (4 Nov 2026)

| Check | Result |
|---|---|
| `npx tsc --noEmit` | pass |
| `npm run lint` | pass |
| `npm test` (vitest, 7 files, 42 tests: estimate arithmetic, service rules, preselection, field visibility, parsing, schema, API success/failure/duplicate/race/honeypot/timing/rate limit, no-photo completion, install detection, WhatsApp encoding, attribution) | pass |
| `npm run build` | pass, all marketing pages static |
| `npm run check:images` | pass |
| Browser, throwaway local Postgres, no email/WhatsApp keys | deep-clean submit saved with estimate 20.000; validation focus and kept values; DB stopped → error + fallback, no success; offline → no request; retry + double click → one row; replay of the same id → `duplicate:true`, no new row |
| Overflow sweep, 22 routes × 320/390/768/1440 | no horizontal overflow (after the header fix); every route has an H1 |
| Accessibility spot check (deep-clean page) | no controls under 44 px in `main`, no unnamed controls, logical headings and tab order; chips keep the focus ring |
| Video slot | tested with an existing clip and a temporary caption file: 16:9, captions on, no autoplay, error state keeps the transcript; reverted |
| Performance (localhost, production build, warm) | deep-clean page: ~156 KB JS, 8 KB CSS, 64 KB images, 0 video bytes before play. Not a Lighthouse score or a real-network measurement. |

Not verified: real iPhone/Android installation (only emulation and unit tests), real email/WhatsApp delivery (keys not available locally), screen readers, the live site.

## 9. Review corrections (5 November 2026)

### What changed

| # | Point | Change |
|---|---|---|
| 1 | Free visit | Removed from every page, FAQ, meta description, `llms.txt`, Terms, sales docs and video script (vila, zyra, ambiente, per-biznese, rreth-nesh, homepage, FAQ). New rule everywhere: a visit is arranged when needed; "Nëse vizita ka ndonjë kosto, jua themi përpara dhe vijmë vetëm pasi të bini dakord." Only the plan and written offer are free. `CLAUDE.md` marks the 17 Oct "free visit" fact as withdrawn. |
| 2 | 250/m² scope | Apartments only, everywhere (hero, price section, FAQ incl. new "A vlen edhe për shtëpi dhe vila?", homepage band, `/kerko-oferte`, Terms, meta, `llms.txt`, sales replies, template, script). Form: deep cleaning first asks Apartament / Shtëpi / Vilë; the number appears only for Apartament (server recomputes the same rule). New property value `shtepi`; old `apartament` rows meant "apartment or house". |
| 3 | Upholstery | "Larja e divanit dhe e të gjithë dyshekëve" for apartment deep cleaning; quantities, sizes, materials and condition recorded at assessment; included items listed in the written offer. No limit, no "unlimited", no promotion wording. Template has a line per item. |
| 4 | Mobile journey | Form moved up the deep-clean page (after scope and price); duplicate "Si funksionon" and duplicate checklist removed; evidence two-up on phones; form shortened (optional priorities, assessment method, home-service frequency and the note folded into "Shtoni detaje"; one-line summary). Bar and hero buttons jump **instantly** (no animated scroll) to the form heading and move focus there without opening the keyboard. Bar hides while any form or success message is on screen. `/kerko-oferte` shows WhatsApp/phone above the form on phones. |
| 5 | Personal data | API no longer logs raw database errors (Prisma messages can echo name/phone); only error class and code. UTM values accepted only as plain tags (letters, digits, `-_.`, ≤ 60, not phone-like), in the browser and on the server. Audit table below. |
| 6 | Notifications | `emailSentAt`, `whatsappSentAt`, `notifyStatus` written after each alert; logs without customer data; `docs/lead-notifications.md` documents the path, failure behaviour, the owner's query and the controlled test still required. |
| 7 | Migrations | Verified on a copy of the pre-release schema with legacy rows (below). `DEPLOY.md`/`README.md` corrected: migrations run in **every** Vercel build, Preview included, with a warning. |
| 8 | Terms / Privacy / sales | Terms: no 24-hour complaint deadline (never confirmed), apartment-only price, visit cost disclosed first. Privacy: no "secure database" claim; hosting processors named; accurate browser-storage and cookie statement; autofill caveat. Sales docs: free-visit, house pricing and unconfirmed water/electricity requirement removed; product-names reply only if a list exists. |

### Personal-data audit

| Where | What is stored or sent | Personal data? |
|---|---|---|
| Form values while typing | React state + an in-memory `Map` (survives client-side navigation and validation errors, cleared after success or reload) | Yes, memory only, never written to storage |
| `localStorage` | `limoni.install.dismissed = "1"` only after dismissing the install card | No |
| `sessionStorage` | `limoni.utm` = first `utm_source` / `utm_campaign` of the tab, plain tags only | No |
| Cookies | None set by the site (GA sets its own only if configured) | No |
| URLs | `?sherbimi=<key>`, UTM tags; `pagePath` stored without query | No |
| Analytics events | service key, placement, reason, percent, install mode | No |
| WhatsApp links | fixed per-page preset text | No |
| Server logs | rate-limit IP in memory; error class/code; lead id; provider error text | No customer fields |
| Database / owner email / owner WhatsApp | the submitted fields, as intended and disclosed in `/privatesia` | Yes, intended |
| Browser autofill | the browser's own feature (`autocomplete` attributes kept for accessibility) | User-controlled |

Checked after a full submit in headless Chrome: `localStorage {}`, `sessionStorage {}`, `cookies ""`, URL unchanged.

### Mobile quote flow evidence (390 × 844, production build, headless Chrome with touch emulation)

| Page | Before (4 Nov) | After (5 Nov) |
|---|---|---|
| Deep clean: page height | 15,243 px | 12,827 px |
| Deep clean: form starts | 9,923 px (11.8 screens) | 4,867 px (5.8 screens) |
| Deep clean: form height (empty) | 2,714 px | 2,060 px |
| Apartments / Upholstery form height | 2,398 / 2,066 px | 1,552 / 1,473 px |
| Bar "Kërko ofertë" | smooth scroll ≈ 9,900 px | instant: `scrollY` 4,552 set within the click handler, unchanged 600 ms later |
| Focus after jump | none (stayed on the button) | `H2 "Kërkoni vlerësim për pronën tuaj"`, no keyboard |
| Heading position after jump | n/a | 80 px from the top, header ends at 65 px |
| Bar over the form | visible over fields and submit | hidden while the form is on screen; submit button is the top element at its centre |
| Homepage / apartments page | smooth scroll | instant, focus on "Ose plotësoni formularin…", heading at 80 px |
| Page without a form (`/puna-jone`) | `/kerko-oferte` | `/kerko-oferte` (unchanged) |
| Estimate | 80 m² → 20.000 for any home | Apartament + 80 m² → "20.000 lekë të reja" labelled orientues; Shtëpi → "vlen vetëm për apartamente… pas vlerësimit" |
| Submit | saved | saved: `propertyType apartament`, `estimateLek 20000`, `notifyStatus "email:skipped; whatsapp:skipped"` |

Screenshots: `Claude outputs/screenshots-2026-11-05-review/` (11 after bar tap, 12 apartment estimate, 13 house without price, 14 success, 15 apartments page after bar tap). Overflow sweep: 10 changed pages × 320/390/768/1440, no horizontal overflow. Real iPhone/Android not tested.

### Migration configuration evidence

- `vercel.json`: `"buildCommand": "npm run vercel-build"`.
- `package.json`: `"vercel-build": "prisma generate && prisma migrate deploy && next build"`.
- So, **if** Vercel builds with this repository's `vercel.json` (its documented behaviour; no Vercel build log was inspected), every Production **and Preview** build runs `prisma migrate deploy` against that environment's `DATABASE_URL_UNPOOLED`. `DEPLOY.md` tells you to set the same database variables for Production and Preview, so a preview build of this branch could migrate the production database before merge.
- Pending migration: `prisma/migrations/20261104120000_lead_assessment_flow/migration.sql`. It adds 4 `LeadStatus` values (`VLERESIM`, `PERFUNDUAR`, `PAGUAR`, `NE_PRITJE`), 12 nullable/defaulted `leads` columns (`sizeUnknown` default false, `condition`, `preferredDate`, `assessmentMethod`, `priorities` default `{}`, `estimateLek`, `clientRequestId`, `emailSentAt`, `whatsappSentAt`, `notifyStatus`, `quotedTotalLek`, `statusNote`) and a unique index on `clientRequestId`. No column is dropped, renamed or made required; `bookings` and `contact_messages` are untouched.
- Local proof (throwaway Postgres 16, not production): built the schema from the three committed migrations at HEAD, inserted two legacy leads and a legacy booking, `prisma migrate status` → "Following migration have not yet been applied: 20261104120000_lead_assessment_flow"; `npx prisma migrate deploy` → "Applying migration … All migrations have been successfully applied"; `leads` columns 17 → 29; legacy rows intact (`sizeUnknown false`, `priorities {}`, new columns NULL); an insert using only the old columns still succeeds (code currently in production keeps working); multiple NULL `clientRequestId` allowed; `prisma migrate diff` against `schema.prisma` → empty; the new Prisma client reads the legacy rows.
- Rollback note: old code reads rows fine unless a lead is set to one of the new statuses; set statuses only after this release is live.
- Nothing was run against production.

### Remaining launch blockers

1. **Preview database**: confirm whether Vercel Preview uses the production database before pushing this branch (otherwise the migration lands on production at push time). Read-only check: Vercel → Settings → Environment Variables / Neon integration settings.
2. **Notification config unknown**: production values for `RESEND_API_KEY` / `EMAIL_FROM` / `EMAIL_TO` and the four WhatsApp variables can't be seen from the repo. Until the controlled test in `docs/lead-notifications.md` is done with Arbri's OK, owner alerts are unverified (leads are still saved).
3. **Owner sign-off on Terms and Privacy** (factual edits only; no legal review done; retention period not stated).
4. **Founder video** is not recorded; the slot stays hidden (not a blocker for launch, a blocker for "VSL done").

## 10. Clarity restructure (12 November 2026, branch `feat/clarity-restructure`)

Brief: `prompts/08-clarity-restructure.md`. Audit: `docs/clarity-audit-2026-11.md`. Plan: `docs/phase2-plan-2026-11.md`. Review ledger: `.claude/reviews/phase2.ledger.md`.

### What changed

| Area | Change |
|---|---|
| Navigation | Kryefaqja · Shërbimet · Si funksionon · Rreth nesh; booking button "Rezervoni pastrimin" in the header, every service hero and the mobile bar centre. Puna jonë, Për biznese, FAQ and Kontakt move to the mobile menu and footer. |
| Booking | One `#rezervo` section (`BookingSection`) before the footer on each marketing page, replacing `LeadForm`, `Closer` and `WorkLoop`. Steps: service, preferred date and time, details (name, phone, address, size where relevant, optional notes and email), review. Posts to `POST /api/kerkesa`. Dates are preferences, not holds. Demo slots only outside production with `?orare-demo`, labelled as demo. |
| Homepage | Opens with `HeroReel`: a silent loop of real work (1.69 MB, no audio stream), no video bytes before the load event, not loaded with reduced motion or Save-Data, pause button. |
| Services | Each service has an `overview` (what it is, how it differs, which services to compare). `/sherbime` adds a situation picker and a regular versus deep-clean comparison (table on desktop, stacked on phones). |
| Media | New photos and the reel from the 26 Oct to 9 Nov footage; staff consent recorded 12 Nov 2026 (`docs/media-triage-2026-11.md`). `npm run check:media` fails on a referenced `public/` file that is missing or untracked. |
| Privacy | Analytics never runs in a document showing a private path (`isPrivatePath`); public pages never client-navigate into `/kerkesa`, `/flete-pune` or `/admin`. |
| Dates | Albanian month and weekday names are hardcoded (`lib/booking/time.ts`); Chromium has no `sq` locale data and rendered English plus a hydration mismatch. |
| Database | Migration `20261112120000_request_email_time`: two nullable columns on `service_requests` (`email`, `preferredTime`). Additive; the preview-database caveat in section 9 applies again. |

### Verification (production build, local)

- `npm test`, `tsc --noEmit`, `eslint` and `next build` clean.
- 17 pages: one H1 each; no em dash, `✓`, `→`, "eksperienc" or "falas" in rendered HTML. No horizontal scroll and no tap target under 48 px at 390 px.
- Gzipped JS per page within +7.6 KB of the previous commit (`/`, apartments, deep clean); `/kerko-oferte` +0.2 KB.
- Lighthouse 12.8.2 mobile with applied (devtools) throttling, two runs each, previous commit versus this branch: apartments page LCP 1.92 s versus 1.90 s, score 99 both; homepage LCP 2.03 s versus 1.61 s. The homepage score reads 96 because the playing reel keeps Speed Index at about 5 s (a looping video never settles); with reduced motion (no reel) it is 99 with Speed Index 1.7 s. Lighthouse's simulated throttling shows about +0.3 s LCP on both pages; that estimate is not reproduced with applied throttling.
