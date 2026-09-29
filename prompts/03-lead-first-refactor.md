# Prompt 03: Lead-first refactor (no prices, simpler, less "template")

Read `CLAUDE.md` and `SITE_OVERVIEW.md` first. Then read the relevant guide in `node_modules/next/dist/docs/` before touching routing, metadata or route handlers (this is Next.js 16, APIs differ from your training data).

This prompt **supersedes** parts of `CLAUDE.md` (pricing, `/rezervo`, `/cmimet`, route map). Phase 1 updates `CLAUDE.md` so the two never disagree again.

## Goal in one paragraph

Turn the site from a "browse, compare prices, book a slot" site into a **simple lead-first site**: every page explains clearly what Limoni does, shows real work, and pushes the visitor to one of two actions: (A) leave their name and phone in a short form (saved to the database, emailed to us, optionally sent to our WhatsApp), or (B) open WhatsApp with a prefilled message such as "Më intereson pastrimi i apartamentit". No prices anywhere. Clean up duplicated code and the visual habits that make the site look generated. It must be easy for a 65-year-old on a phone.

## What the audit found (why we're doing this)

| # | Finding | Where |
|---|---|---|
| 1 | Prices appear on many surfaces: `/cmimet`, `priceNote` on every service, `formatPerSqm`, meta descriptions ("nga 175 ALL/m²"), wizard estimate. Arbri now wants **no prices**. | `lib/pricing.ts`, `lib/content.ts`, `lib/booking-options.ts`, `app/cmimet`, service pages, `BookingWizard.tsx` |
| 2 | Six service pages are hand-copied files (~90 to 237 lines each) with the same layout and small text differences. Any design change must be made six times. | `app/pastrim-*-tirane/page.tsx` |
| 3 | The WhatsApp button's Tailwind class string is pasted inline about 17 times instead of being a `Button` variant. | 16 files (grep `rounded-full bg-primary px-6 py-3`) |
| 4 | Booking wizard has 6 steps (property, size, cleaning type, date+time, contact, summary) and asks for date/time before contact info. Too long for a quote request, and "Rezervo" implies a confirmed slot we don't give. | `app/rezervo/BookingWizard.tsx` (451 lines) |
| 5 | Two separate tables and forms (`Booking`, `ContactMessage`) for what is really one thing: a lead. | `prisma/schema.prisma`, `app/api/*` |
| 6 | No spam protection on either API route (no honeypot, no rate limit). Public forms will get bot spam. | `app/api/booking`, `app/api/contact` |
| 7 | Empty image placeholders ("Foto — pastrim zyre") are shown on 5 public service pages. Real, unused photos sit in `media-source/`. | service pages, `MediaFrame` |
| 8 | Visual tells of a generated site: italic serif "kicker" lines above every heading, "01 / 02 / 03" numerals, "→" text links, em dashes in UI copy (105 occurrences), long homepage (9 sections, Airbnb pitched 3 times). | `app/page.tsx` and most pages |
| 9 | Readability for older visitors: 138 uses of `text-sm` including body copy and buttons, hamburger target is 40px, mobile menu has no phone number. | global |
| 10 | Two pages target the same search intent (`/pastrim-airbnb-tirane` and `/pronare-airbnb`), which splits ranking signals. | `app/pronare-airbnb` |
| 11 | Schema: `addressRegion` holds "Komuna e Parisit, Tiranë" (wrong field), Organization and LocalBusiness are two disconnected entities, `sitemap.ts` stamps every URL with `new Date()` on each build, empty `/blog` is indexable. | `lib/seo.tsx`, `app/sitemap.ts` |
| 12 | Email sender defaults to `onboarding@resend.dev`; WhatsApp notification is a stub. | `lib/email.ts` |
| 13 | The project is **not a git repository**. A refactor this size needs a safety net. | root |
| 14 | `https://limonicleaning.al` did not resolve on 29 Sep 2026. Confirm the domain and DNS before launch; `NEXT_PUBLIC_SITE_URL` drives canonicals and the sitemap. | `.env` |

## Decisions (defaults chosen; Arbri can override before running)

- **D1. Hotels and post-construction.** `CLAUDE.md` lists apartments/houses, offices, villas and Airbnb. The code also has hotel and post-construction pages. Default: **keep them only if Arbri confirms Limoni actually does this work.** If not confirmed, remove the pages and 301 them to `/sherbime`. Never market a service we don't deliver.
- **D2. `/pronare-airbnb`** merges into `/pastrim-airbnb-tirane` as a section "Për pronarë me disa prona" (anchor `#pronare`). 301 the old URL.
- **D3. `/rezervo` and `/cmimet`** are replaced by one page, **`/kerko-oferte`**, with the short lead form. 301 both old URLs to it.
- **D4. Fonts.** Drop Fraunces. Use Inter only (it is what the brand spec says) and get hierarchy from size and weight, not a second face in italics.
- **D5. Blog.** Keep the route but `noindex` it and leave it out of the sitemap and nav until the first real article exists.
- **D6. Response-time promise.** Do not write "ju kontaktojmë brenda X orësh" unless Arbri gives a real number. Use "së shpejti" until then.
- **D7. Guarantee.** Do not add a re-clean guarantee unless Arbri confirms one exists and its terms.

## Phase 0: safety net

1. `git init`, add a proper `.gitignore` (confirm `.env*`, `.next`, `node_modules`, `media-source/*.MOV`, `Claude outputs/` are ignored), commit the current state as `baseline before lead-first refactor`.
2. Run `npm run build` and `npm run lint` once and record the result, so later failures are clearly ours.
3. Work in small commits, one per phase.

## Phase 1: source of truth

Update `CLAUDE.md`:
- Replace "Services & pricing" with: *No prices are shown anywhere on the site. Every service page ends in the two lead actions.* Keep internal pricing out of the repo entirely.
- Replace the route map with the one below.
- Replace "Every form must actually work" wording to reference the `Lead` model.

Final route map:

```
/                                  Kryefaqja
/sherbime                          Overview of all services
/pastrim-apartamentesh-tirane      Apartamente dhe shtëpi
/pastrim-airbnb-tirane             Airbnb (includes #pronare section)
/pastrim-zyrash-tirane             Zyra
/pastrim-vilash-tirane             Vila
/pastrim-me-themel-tirane          Pastrim me themel (deep clean)
/pastrim-pas-ndertimit-tirane      only if D1 confirmed
/pastrim-hotelesh-tirane           only if D1 confirmed
/puna-jone                         Photos, before/after, videos
/rreth-nesh
/faq
/kontakt
/kerko-oferte                      Lead form (replaces /rezervo and /cmimet)
/blog, /blog/[slug]                noindex until first post
/privatesia, /kushtet
```

Redirects (permanent, in `next.config.ts`): `/rezervo` and `/cmimet` to `/kerko-oferte`; `/pronare-airbnb` to `/pastrim-airbnb-tirane#pronare`; D1 pages to `/sherbime` if removed.

## Phase 2: design system cleanup (do this before rebuilding pages)

**Components (one place, used everywhere):**
- `Button`: add `variant="whatsapp"` (green with the WhatsApp glyph) and a `size` prop: `md` = 48px min height, `lg` = 56px. Default text size `text-base`. Make `WhatsAppLink` render through `Button` so the 17 inline class strings disappear. Add a `PhoneButton` the same way (`tel:+355689007252`).
- `SectionHeading` (h2 + optional one-line intro). Replaces the hand-written heading blocks on every page.
- `LeadActions`: the pair [Kërko ofertë] [WhatsApp], taking a `service` prop so the WhatsApp message and the form preselection match the page. Used as the closing block on every page.
- `ServiceCard`: real photo, name, one sentence, link. No price line.
- Delete `Card` if unused after the rebuild, delete `components/AirbnbWhatsAppQuote.tsx` once `LeadForm` covers its use (see Phase 3).

**Remove these patterns site-wide:**
- Italic serif kickers above headings, "01/02/03" numerals, "Shiko … →" arrow links (use a plain underlined link or a button), `✓` characters as bullets (use a small inline SVG check, same one everywhere).
- Em dashes in all visible copy and in `alt`/meta text. Use a comma, period or colon. (Code comments can stay.)
- Any public empty image slot. `MediaFrame` without `src` must not render on public pages; the layout simply goes text-only until a photo exists.
- Placeholder labels such as "Foto — …".

**Readability and touch (all ages):**
- Base font 18px on mobile for body copy (`html { font-size: 112.5% }` or set `text-lg` as body default, pick one). `text-sm` only for captions and legal text, never for buttons, form labels or service descriptions.
- Minimum 48×48px for every tappable element, including the hamburger and filter chips. 8px minimum gap between adjacent targets.
- Contrast: never yellow `#F5C518` text or icons on white (1.6:1, fails). On yellow buttons use `#16241C` text (9.9:1). Muted text `#5B6B60` is fine on white and on `#F8F8F5`.
- Labels always visible above inputs, never placeholder-only. Error messages in plain Albanian under the field.
- No carousels, no autoplay, no popups on arrival, no time limits.
- Visible focus rings everywhere.

## Phase 3: lead capture backend

**Prisma:** add one model, keep old tables for history (stop writing to them, do not drop them).

```prisma
enum LeadStatus { E_RE KONTAKTUAR OFERTE_DERGUAR FITUAR HUMBUR }
enum ContactChannel { WHATSAPP TELEFON }

model Lead {
  id          String         @id @default(cuid())
  service     String         // slug from lib/services.ts, or "tjeter"
  name        String
  phone       String
  area        String?        // zona në Tiranë, free text
  message     String?
  channel     ContactChannel @default(WHATSAPP)
  pagePath    String         // where the form was submitted
  utmSource   String?
  utmCampaign String?
  status      LeadStatus     @default(E_RE)
  createdAt   DateTime       @default(now())
  @@index([createdAt])
  @@map("leads")
}
```

**`POST /api/lead`** (replaces `/api/booking` and `/api/contact`; keep those two returning 410 for a while or delete them after the forms are switched):
1. Zod validate. Phone: accept spaces, `+`, leading `0`; normalise to E.164 for Albania (`06x…` becomes `+3556x…`). Name 2 to 80 chars.
2. Spam: hidden honeypot field (reject silently with 200), minimum 3 seconds between render and submit (timestamp field), simple in-memory or Upstash rate limit per IP (5 per 10 min).
3. Save to `Lead`. If the DB write fails, return 500 with the WhatsApp fallback message. Never show success without a saved row.
4. Notify with `notifyNewLead(lead)` which calls, independently and without blocking each other:
   - `sendLeadEmail(lead)` via Resend. Require `EMAIL_FROM` on a verified domain; log a clear warning if it is still `onboarding@resend.dev`. Subject: `Kërkesë e re: {shërbimi} ({emri})`. Body includes a ready-to-tap `https://wa.me/{phone}` link and a `tel:` link so Arbri can reply in one tap from the email.
   - `sendLeadWhatsApp(lead)`: WhatsApp Cloud API template message to the owner's number. Only runs when `WHATSAPP_TOKEN`, `WHATSAPP_PHONE_NUMBER_ID`, `OWNER_WHATSAPP` and `WHATSAPP_TEMPLATE_NEW_LEAD` are set; otherwise skip with a log line. Arbri builds this at Codrix, so keep the function small and clearly documented rather than clever.
5. Return `{ ok: true }`. No booking reference number shown to the user (it implied a confirmed booking).

**Update `.env.example`** with the four WhatsApp variables, commented.

**`LeadForm` component** (client), used on `/kerko-oferte`, homepage, every service page (with `service` preselected) and `/kontakt`:

| Field | Required | Albanian label |
|---|---|---|
| Service (large tappable chips, preselected on service pages) | yes | Çfarë pastrimi ju nevojitet? |
| Name | yes | Emri |
| Phone, `type="tel"`, `inputMode="tel"`, `autoComplete="tel"` | yes | Numri i telefonit (WhatsApp) |
| Preferred channel, 2 chips | yes, default WhatsApp | Si preferoni t'ju kontaktojmë? (WhatsApp / Telefonatë) |
| Area | no | Zona në Tiranë (opsionale) |
| Message | no | Diçka tjetër që duhet të dimë? (opsionale) |

- Submit: **Dërgo kërkesën**. Under the button, small text: "Numrin e përdorim vetëm për t'ju kontaktuar për këtë kërkesë." with a link to `/privatesia`.
- Success state (replaces the form, focus moves to it): "Faleminderit, {emri}! E morëm kërkesën tuaj. Dikush nga ekipi do t'ju kontaktojë së shpejti për ofertën." plus a secondary WhatsApp button "Nëse keni ngut, na shkruani në WhatsApp". Never say "rezervimi u konfirmua".
- Error: "Kërkesa nuk u dërgua. Provoni përsëri ose na shkruani në WhatsApp."
- Fire analytics events `lead_submitted` (with service) and `whatsapp_click` (with service and placement).

**WhatsApp direct (feature B):** rewrite `lib/whatsapp-messages.ts` so there is **one function** `waMessageFor(service?: ServiceSlug)` that returns a gender-neutral message:

- default: "Përshëndetje! Do të doja një ofertë për pastrim."
- apartamente: "Përshëndetje! Më intereson pastrimi i apartamentit/shtëpisë. A mund të më jepni një ofertë?"
- airbnb: "Përshëndetje! Më intereson pastrimi për Airbnb. A mund të flasim për pronën?"
- zyra: "Përshëndetje! Më intereson pastrimi i zyrës. A mund të më jepni një ofertë?"
- vila: "Përshëndetje! Më intereson pastrimi i vilës. A mund të më jepni një ofertë?"
- me themel: "Përshëndetje! Më intereson një pastrim me themel. A mund të më jepni një ofertë?"
- (D1) pas ndërtimit: "Përshëndetje! Më duhet pastrim pas ndërtimit/rinovimit. A mund të më jepni një ofertë?"
- (D1) hotel: "Përshëndetje! Më intereson pastrimi për hotelin. A mund të flasim?"

Delete the other message presets. Keep the optional Airbnb details (number of properties, m², frequency) as optional fields in `LeadForm` only when `service === "airbnb"`, not as a separate widget.

**Mobile sticky bar:** three equal buttons, 56px tall, icon plus label: **WhatsApp** · **Telefono** · **Kërko ofertë**. Hide it on `/kerko-oferte` and while the on-screen keyboard is open (input focused). WhatsApp message follows the current page's service.

**Clean up:** delete `BookingWizard.tsx`, `lib/booking-options.ts`, `lib/pricing.ts`, `lib/reference.ts`, `app/rezervo`, `app/cmimet`, the old contact form, and every import of them. `grep -rn "ALL\|Lekë\|lekë\|m²\|çmim" app components lib` must return nothing user-facing afterwards (FAQ answers about price become "Çmimi varet nga madhësia dhe gjendja e pronës. Na lini numrin dhe ju japim ofertën.").

## Phase 4: pages

**Service pages become data plus one template.**
- Create `lib/services.ts` (replace the service parts of `lib/content.ts`) with, per service: `slug`, `path`, `navLabel`, `metaTitle`, `metaDescription`, `h1`, `intro` (2 sentences max), `includes[]`, `goodFor[]` (who it's for), `howWeWork` (short paragraph), `faq[]` (3 to 4 service-specific), `images[]`, `related[]` slugs.
- Create `components/ServicePage.tsx`. Each `app/pastrim-*-tirane/page.tsx` becomes about 5 lines: `export const metadata = serviceMetadata("zyra"); export default function Page() { return <ServicePage slug="zyra" />; }`.
- Template order: breadcrumbs, H1 + intro + LeadActions + photo, "Çfarë përfshin", "Për kë është", real photos from this service type (skip the block if none), 3 to 4 FAQ, related services, inline `LeadForm` with service preselected.
- Existing copy in the page files is the starting point for the data. Move it, tighten it, fix Albanian, remove prices and em dashes. Do not invent new claims.

**Homepage** (keep it to 8 blocks, mobile order):
1. Header: logo, phone icon button (48px, `tel:`), menu button. Desktop nav: Shërbimet · Airbnb · Puna jonë · Rreth nesh · Kontakt, plus button **Kërko ofertë** and the phone number as visible text.
2. Hero: H1 **"Pastrim profesional për shtëpi, zyra dhe Airbnb në Tiranë"**. One line: "Ekip me mbi 10 vjet eksperiencë. Na lini numrin ose na shkruani në WhatsApp dhe ju japim ofertën." LeadActions. One real photo (the team at work).
3. Trust row, four plain facts, no icons needed: "50+ prona të pastruara" · "Ekip me mbi 10 vjet eksperiencë" · "Partner zyrtar i Prago" · "Punojmë në Tiranë".
4. Services: photo cards in a single column on mobile, 2 or 3 columns on desktop. Each card: name, one sentence, "Më shumë" link and a small WhatsApp shortcut.
5. Puna jonë: before/after slider plus 4 photos, button "Shiko më shumë foto".
6. Si funksionon, three steps written as a sentence each: "Na lini numrin ose na shkruani në WhatsApp." / "Ju kontaktojmë, pyesim për pronën dhe ju japim ofertën." / "Vijmë në orarin e rënë dakord dhe pastrojmë."
7. Airbnb, one short block for owners with a link to `/pastrim-airbnb-tirane`. Mention Prago once here, not three times across the page.
8. Inline `LeadForm` titled "Na lini numrin, ju kontaktojmë ne". Then 4 top FAQ items and the footer.

**Mobile menu:** full-screen sheet, 56px rows, 18px text, WhatsApp and phone buttons at the top of the sheet, then the nav links, then "Kërko ofertë".

**Photos:** convert the unused `media-source/IMG_2973.HEIC`, `IMG_2988.HEIC`, `IMG_2990.HEIC`, `IMG_3021.HEIC` and `before_after_cleaning.jpg` to WebP/JPEG (max 1600px wide, sRGB, stripped EXIF including GPS). Look at each image before captioning it; follow the existing rule of never describing a photo as something it doesn't show. Descriptive Albanian filenames and alt text. Use `next/image` with correct `sizes`. Only the hero image gets `priority`.

**Kontakt:** phone, WhatsApp, area ("Komuna e Parisit, Tiranë"), LeadForm. Remove the "Orari: Do konfirmohet së shpejti" row and the map placeholder; show nothing until real data exists.

## Phase 5: SEO and keywords

Albanian competitors ranking for these queries use titles like "Kompani Pastrimi në Tiranë" and "Pastrim Shtëpie Tiranë" (for example shndrit.com, pastrimi.al, roelpastrim.com). Target map, one primary intent per URL, no overlap:

| URL | `<title>` (≤ 60 chars) | Primary query | Secondary |
|---|---|---|---|
| `/` | Kompani Pastrimi në Tiranë \| Limoni Cleaning | kompani pastrimi tiranë | shërbime pastrimi tiranë, pastrim profesional |
| `/pastrim-apartamentesh-tirane` | Pastrim Shtëpie dhe Apartamenti në Tiranë | pastrim shtëpie tiranë | pastrim apartamenti, pastrim banese |
| `/pastrim-airbnb-tirane` | Pastrim Airbnb në Tiranë për Pronarë | pastrim airbnb tiranë | pastrim apartamente me qira ditore, turnover |
| `/pastrim-zyrash-tirane` | Pastrim Zyrash në Tiranë | pastrim zyrash tiranë | pastrim zyre, pastrim ambientesh biznesi |
| `/pastrim-vilash-tirane` | Pastrim Vilash në Tiranë | pastrim vile tiranë | pastrim shtëpie private |
| `/pastrim-me-themel-tirane` | Pastrim me Themel në Tiranë | pastrim me themel | pastrim i thellë, pastrim gjeneral |
| `/pastrim-pas-ndertimit-tirane` (D1) | Pastrim pas Ndërtimit në Tiranë | pastrim pas ndërtimit | pastrim pas rinovimit |
| `/sherbime` | Shërbime Pastrimi në Tiranë | shërbime pastrimi | |
| `/kerko-oferte` | Kërko Ofertë për Pastrim | ofertë pastrimi | |

Rules:
- Home uses an absolute title (skip the `%s | Limoni Cleaning` template so the brand doesn't appear twice).
- Meta descriptions 140 to 155 characters, no prices, one clear action ("Na lini numrin ose na shkruani në WhatsApp"). Written in natural Albanian, not keyword lists.
- One H1 per page that contains the primary query naturally. H2s describe content, not slogans.
- Always write correct ë/ç. Google matches "pastrim shtepie" to "pastrim shtëpie" on its own; never add misspelled variants to copy or keywords meta.
- Internal links: each service page links to 2 related services and to `/puna-jone`; homepage cards link to every service page.

Structured data (`lib/seo.tsx`):
- One `@graph` in the layout: `HousekeepingService` with `@id: {siteUrl}/#business`, `name`, `url`, `telephone`, `image`, `logo`, `address` = `{ addressLocality: "Tiranë", addressCountry: "AL" }` (remove the misused `addressRegion`), `areaServed: { "@type": "City", "name": "Tiranë" }`, `hasOfferCatalog` listing the services **without prices**, `sameAs` filled only when the Google Business Profile or social links exist. `WebSite` references the business via `publisher: { "@id": … }`. Delete the separate `organizationJsonLd`.
- `Service` on each service page with `provider: { "@id": "{siteUrl}/#business" }`.
- Never add `aggregateRating` or `review` until real reviews exist.
- `FAQPage` stays on `/faq` only (Google now shows FAQ rich results mainly for government and health sites, so it is harmless but not a ranking lever).

Sitemap and robots:
- Static `lastModified` per route (a constant or the file's git date), not `new Date()` on every build.
- Remove `/cmimet`, `/rezervo`, `/pronare-airbnb`, `/blog` (until posts exist). Add `/kerko-oferte`.
- `noindex` on `/blog` (D5). Legal pages stay indexable.

Outside the code (list these in the final report for Arbri, don't try to do them):
- Create and verify a **Google Business Profile** as a service-area business (hide the address, list Tirana areas actually served). This matters more for local ranking than anything on-page.
- After the first jobs, ask happy customers for Google reviews. Only then add a reviews section that links to the real profile.
- Submit the sitemap in Google Search Console once the domain resolves.

## Phase 6: verification (do all of it, report results)

1. `npm run build` and `npm run lint` pass with no new warnings.
2. `grep` checks return nothing user-facing: prices (`ALL`, `Lekë`, `m²` in copy), em dashes in rendered strings, "Foto —", `text-sm` on buttons/labels, `rezervo` links.
3. Playwright screenshots at 375×812 and 1440×900 for `/`, one service page, `/kerko-oferte`, `/kontakt`, and the open mobile menu. Check: no horizontal scroll, nothing overlaps the sticky bar, every tap target ≥ 48px (measure with `getBoundingClientRect`).
4. Submit the form locally against a real Postgres: a `Lead` row exists, the email arrives (or the skip warning is logged when keys are missing), WhatsApp notification sends or logs a skip. Submit with the honeypot filled: no row. Submit 6 times quickly: rate limit returns 429.
5. Open every WhatsApp link and check the decoded text reads naturally, with ë/ç intact.
6. Validate JSON-LD with the Rich Results Test (paste the rendered HTML) and check each page's title/description length.
7. Lighthouse mobile on `/` and one service page: Performance ≥ 90, Accessibility ≥ 95, SEO 100.
8. Albanian QA pass on every changed string: ë/ç, agreement, no calques, no English leftovers, consistent terms (use "ofertë" and "kërkesë" everywhere, never mix in "rezervim" for the lead flow), no claim stronger than what the business really does.
9. Update `SITE_OVERVIEW.md` to describe the new structure, and list anything that still needs input from Arbri (D1, D6, D7, domain, GBP, photos per service).

## Out of scope

- English version and `/tirana/[lagja]` neighbourhood pages (Phase 2 of the roadmap, only with real content).
- An admin dashboard for leads (use Prisma Studio or the DB console for now).
- A fake chatbot of any kind.
