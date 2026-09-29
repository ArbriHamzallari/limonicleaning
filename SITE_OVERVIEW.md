# Limoni Cleaning: Site Overview

For a new contributor or AI agent. Describes the site as of 29 September 2026, after the
lead-first refactor (`prompts/03-lead-first-refactor.md`). `CLAUDE.md` holds the rules and
business facts; this file explains how the code is put together.

## 1. What the site does

A lead-first marketing site for a cleaning company in Tirana. Every page explains a service,
shows real work, and ends in two actions:

- **A. Short form** (`LeadForm`): service, name, phone, preferred channel, optional area and
  message. Saved as a `Lead` row, emailed to the business, optionally sent to the owner's
  WhatsApp.
- **B. WhatsApp** with a prefilled, service-specific message (`waMessageFor()`).

No prices anywhere, no online booking, no booking references. Albanian only.

## 2. Stack

Next.js 16 (App Router, Turbopack) · React 19 · TypeScript · Tailwind CSS v4 (tokens in
`app/globals.css`, no config file) · Prisma 6 + Postgres · Resend · WhatsApp Cloud API · Zod 4.
No test framework; verification is `npm run build`, `npm run lint`, and browser checks.

## 3. Routes

| Route | What |
|---|---|
| `/` | Hero, 3 facts, Çfarë pastrojmë (4 groups), Airbnb (dark), before/after + photos, checklist, Rreth Limoni, closer (WhatsApp, phone, steps, form, FAQ) |
| `/sherbime` | All services as cards |
| `/pastrim-apartamentesh-tirane` | Service page (template) |
| `/pastrim-airbnb-tirane` | Service page + `#pronare` section (Prago partnership) |
| `/pastrim-zyrash-tirane`, `/pastrim-vilash-tirane`, `/pastrim-me-themel-tirane`, `/pastrim-pas-ndertimit-tirane`, `/pastrim-hotelesh-tirane` | Service pages (template) |
| `/kerko-oferte` | The lead form; `?sherbimi=<slug>` preselects the service |
| `/puna-jone` | Before/after slider, photos, three phone videos |
| `/rreth-nesh`, `/faq`, `/kontakt` | About, FAQ (only page with FAQPage schema), contact + form |
| `/blog`, `/blog/[slug]` | No posts yet: `noindex`, not in sitemap or nav |
| `/privatesia`, `/kushtet` | Legal |
| `POST /api/lead` | The only form endpoint |
| `POST /api/booking`, `POST /api/contact` | Retired, return 410 |

Permanent redirects in `next.config.ts`: `/rezervo`, `/cmimet` → `/kerko-oferte`;
`/pronare-airbnb` → `/pastrim-airbnb-tirane#pronare`.

## 4. Where things live

- `lib/service-index.ts`: slugs (`apartamente`, `airbnb`, `zyra`, `vila`, `me-themel`,
  `pas-ndertimit`, `hotele`), routes, short labels. Client-safe.
- `lib/services.ts`: all service page copy (meta, h1, intro, includes, who it's for, FAQ,
  photos, related) and `serviceMetadata(slug)`. Each `app/pastrim-*-tirane/page.tsx` is five
  lines that render `components/ServicePage.tsx`.
- `lib/content.ts`: site-wide copy (trust facts, how it works, FAQ, about values).
- `lib/photos.ts`: every real photo with alt text that describes what it actually shows.
- `lib/whatsapp-messages.ts`: `waMessageFor(service?)`, the only WhatsApp wording.
- `lib/phone.ts`: phone normalisation to E.164 (`068…` → `+35568…`), used by form and API.
- `lib/validation.ts`: Zod `leadSchema`; folds optional Airbnb details into the message.
- `lib/rate-limit.ts`: in-memory 5 requests / 10 min per IP.
- `lib/notify.ts`: `notifyNewLead()` → `sendLeadEmail()` + `sendLeadWhatsApp()`, independent.
- `lib/seo.tsx`: `pageMetadata()`, one `@graph` (HousekeepingService `#business` + WebSite),
  `serviceJsonLd()` pointing at `#business`, breadcrumbs, FAQ, video.

## 5. Lead pipeline

1. `LeadForm` validates on the client (name ≥ 2 chars, phone normalisable, service chosen),
   shows errors in Albanian under each field and focuses the first one.
2. `POST /api/lead`: rate limit (429) → honeypot `website` filled → silent 200, nothing
   saved → Zod → under 3 s since render → 400 "Prisni disa sekonda" → `prisma.lead.create`.
   DB failure → 500 with the WhatsApp fallback text. Success only after the row exists.
3. `after()` runs `notifyNewLead()` once the response is sent. Missing keys log a skip line;
   provider errors are logged and never affect the saved lead.
4. The form swaps to the thank-you state (focus moves to it) with a WhatsApp button for
   urgent cases. Analytics: `lead_submitted`, `whatsapp_click`, `phone_click` (GA4 only when
   `NEXT_PUBLIC_GA_MEASUREMENT_ID` is set).

Leads are read with `npx prisma studio` or the DB console (no admin UI by design). `status`
(`E_RE`, `KONTAKTUAR`, `OFERTE_DERGUAR`, `FITUAR`, `HUMBUR`) is there for manual tracking.

## 6. Design system (editorial, since prompt 04)

- **Feel:** editorial and photographic, not a component kit. White by default; per page at
  most one muted block and one dark green block. Asymmetric photo + text (roughly 7/5),
  photos at their natural aspect (`naturalAspect()` in `lib/photos.ts`), big photos bleed to
  the screen edge on phones (`Photo bleed`, `BeforeAfterSlider bleed`).
- **Not allowed:** gradients, glass, blobs, decorative icons, shadows, pills/badges for
  claims, grids of 3+ identical bordered cards, a background change every section, secondary
  actions styled as buttons. `rounded-full` only on real buttons.
- **Type:** Inter only, body 18px, `text-sm` only for captions and legal lines.
- **Actions:** "Kërko ofertë" only in the header and in heroes (`LeadActions`: yellow button
  + outline WhatsApp). Elsewhere: `ContactActions` (WhatsApp button + phone as a link) or the
  `Closer`. Secondary actions are `TextLink`s (underlined, 48px tap area).
- **Homepage closer / service closer (`Closer`):** heading "Keni një pronë për të pastruar?",
  WhatsApp (homepage uses the fill-in `waQuoteTemplate`), phone, three numbered steps, then
  "Ose na lini numrin…" with `LeadForm`, then FAQ.
- **Service pages:** `lib/services.ts` gives each service a `hero` and its own `sections`
  (`checklist`, `steps`, `photoStory`, `pair`, `text`, `note`) with its own headings.
  `ServicePage` adds only breadcrumbs, hero, a "Mund t'ju interesojë edhe:" link row and the
  closer (FAQ shown only with 3+ questions). No service hero repeats the homepage hero.
- **Lists:** hairline dividers (`Checklist`, `FaqItem`, `ServiceList` on `/sherbime`), no boxes.
- **Photo rule:** a photo appears once per page. `npm run check:images` (after a build) fails
  if `/` or any service page renders the same image twice.
- **LeadForm:** service, name, phone, optional message. `Lead.area` / `channel` keep their
  defaults.
- **Mobile:** sticky bar with WhatsApp · Telefono (56px), hidden on `/kerko-oferte` and while
  typing. Header: 48px phone button + full-screen menu (includes Kontakt and FAQ).
- **Copy:** "përvojë" (never "eksperiencë"), always the team's experience. Prago only on the
  homepage Airbnb block and `/pastrim-airbnb-tirane#pronare`, as "Bashkëpunojmë me Prago…".

## 7. Photos and videos

All in `public/images` / `public/videos`, max 1600px, metadata (including GPS) stripped; raw
originals live in git-ignored `media-source/`. Never put raw phone files in `public/`.
`lib/photos.ts` lists every photo with alt text describing what it actually shows;
`lib/portfolio.ts` groups them into the jobs shown on `/puna-jone`.

- Apartments/Airbnb: kitchen, bed-making, living room before/after (aligned from two full
  frames of the same view), hallway, guest-ready bedroom.
- Post-construction: team cleaning windows, the same flat before cleaning, glass and frames,
  steam-cleaning a sliding door track (photo + 4 s video).
- Office: a frame from a 360×640 phone video of an office mid-renovation (`lowRes`, so it is
  never shown large or on cards) + the clip itself.
- **Villa: no photo yet**, page is text-only.

## 8. Verification status (29 Sep 2026)

- Build and lint clean. Every page: one H1, title ≤ 60 chars, meta description 140 to 156
  chars (legal pages included).
- No prices, em dashes, "Foto —" labels or `/rezervo` links in rendered HTML.
- 375×812 and 1440×900: no horizontal scroll, no tap target under 48px, footer clear of the
  sticky bar.
- Against a local Postgres: lead saved with E.164 phone; honeypot → no row; 6th request →
  429; DB down → 500; failing Resend/Meta keys → logged, lead still saved.
- Lighthouse mobile (local production build): `/` 91 to 92 performance, service pages 93,
  `/kerko-oferte` 96; accessibility, best practices and SEO 100 on all.

## 9. Still needed from Arbri

- **Domain:** limonicleaning.com (Hostinger). Follow `DEPLOY.md`; `NEXT_PUBLIC_SITE_URL` must be
  `https://limonicleaning.com` in Vercel.
- **Email:** `RESEND_API_KEY`, `EMAIL_TO`, and `EMAIL_FROM` on a verified domain.
- **WhatsApp alerts:** the four `WHATSAPP_*` / `OWNER_WHATSAPP` vars and an approved template
  with body variables {{1}} service, {{2}} name, {{3}} phone.
- **Response time (D6):** a real number before promising "brenda X orësh".
- **Guarantee (D7):** only if one exists, with its terms.
- **Photos:** a villa job, and a sharper office photo (the current one is a small video frame).
- **Google Business Profile** (service-area business), then real Google reviews, then a
  reviews section linking to the profile. Submit the sitemap in Search Console once the
  domain resolves.
- **Hours, email address, social profiles:** add to `lib/business.ts` when they exist;
  `sameAs` in the JSON-LD fills automatically.
