# Limoni Cleaning — Project Brief

Read this file first, every session. It's the source of truth for facts, brand, architecture, and rules. Prompts in `prompts/` are task instructions; this file is what stays true across all of them.

## What this is

Production marketing and **lead-capture** website for **Limoni Cleaning**, a cleaning company in Tirana, Albania. Since prompt 03 the site is lead-first: every page explains what Limoni does, shows real work, and ends in two actions: (A) a short assessment form (service preselected, optional details, name + phone, saved to the database, emailed to the business, optionally sent to the owner's WhatsApp) or (B) a WhatsApp chat with a prefilled, service-specific message. There is no online booking. Since 4 Nov 2026 there is **one** public price: the indicative deep-cleaning reference for homes (see "Services & pricing").

## Tech stack (decided — don't relitigate these)

- **Next.js 16, App Router, TypeScript.** Static generation for every marketing page.
- **Tailwind CSS v4** for styling. Inter for everything; Barlow Condensed 800 only for display headings (`components/DisplayHeading.tsx`).
- **Route Handlers**: the booking-request API `app/api/kerkesa/*` (every public form: the `#rezervo` booking section on each page and the full flow at `/kerko-oferte`; uploads, availability) plus `app/api/cron/kerkesa` (daily maintenance). `app/api/lead` has no UI caller since Nov 2026 (kept for history and its tests). `app/api/booking` and `app/api/contact` return 410 (legacy).
- **Booking requests** (Nov 2026, `docs/booking-system.md`): `ServiceRequest` / `Proposal` (immutable versions) / `RequestMedia` (private) / `SlotReservation` (Postgres exclusion constraint against double holds) / `RequestEvent` (audit). Owner panel `/admin` (env-password login), customer status link `/kerkesa/<token>`, team job sheet `/flete-pune/<token>`. Google Calendar mirrors holds/bookings as private blocks; the database stays the source of truth. Live holds are OFF until Arbri gives hours, crews, durations and buffer (`BOOKING_SETTINGS`); until then dates are "preferred, not held". Never claim a hold that doesn't exist, never send customers automatic messages or calendar invites, never put personal data or media in calendar events or analytics. Analytics never runs in a document that shows a private path (`isPrivatePath` in `lib/analytics.ts`); public pages never client-navigate into `/kerkesa`, `/flete-pune` or `/admin` (`tests/private-navigation.test.ts`).
- **Database**: Postgres via Prisma. `Lead` (quick form) and the booking-request tables are written; the old `bookings` / `contact_messages` tables are kept for history, never dropped.
- **Email notification** via Resend on every new lead (`lib/notify.ts`).
- **WhatsApp Cloud API notification** to the owner on every new lead, implemented in `lib/notify.ts` and active only when the four `WHATSAPP_*` / `OWNER_WHATSAPP` env vars are set. Never claim in the UI that the *customer* receives an automatic WhatsApp confirmation.
- **Deploy target**: Vercel.

## Brand system

- Primary (dark green): `#184A2C`, hover `#0F3520`
- Accent (lemon yellow): `#F5C518`, hover `#E5B60C`
- Backgrounds: `#FFFFFF`, muted section background `#F8F8F5`, warm highlight `#FEFBEA` / `#FDF3D3`
- Text: primary `#16241C`, muted `#5B6B60`
- Borders: `#ECE9E1`
- Font: Inter (400/500/600/700/800)
- Logo: single lemon icon (yellow fruit, dark green leaf), asset provided separately
- Tone: clean, premium, warm, minimal, trustworthy, local. Not a generic SaaS look, not cartoonish, not stock-photo-heavy. The lemon is a brand mark, not a dominant visual motif.

## Ground-truth business facts — do not exceed these, never invent more

- Business name: **Limoni Cleaning**
- City: Tirana, Albania. Based in the "Komuna e Parisit" area — no verified street address yet.
- Service area (Arbri, 4 Nov 2026): Tirana and nearby areas, **including Kamza and Durrës**. Outside Tirana, feasibility and any transport cost are confirmed before the offer; never imply identical pricing everywhere.
- Team: five cleaners; the founder, **Arbri**, manages the operation. The site may name Arbri as founder; never publish team size, capacity, margins or staffing problems.
- Phone / WhatsApp: **+355 68 900 7252** — `https://wa.me/355689007252`
- Domain: **limonicleaning.com** (bought at Hostinger, Sep 2026). Hosted on Vercel; DNS and business email stay at Hostinger. Deployment steps are in `DEPLOY.md`.
- Email: **info@limonicleaning.com** (Hostinger mailbox). Lead notifications are *sent* via Resend from `kerkesa@limonicleaning.com` and delivered to info@. DNS is managed in Vercel (nameservers moved there), so all mail records live in Vercel DNS.
- Google Maps listing: https://maps.app.goo.gl/5eHU2M2ihKJaPWyi6 (`business.googleMapsUrl`).
- Social media (Arbri, 12 Nov 2026): Instagram https://www.instagram.com/limonicleaning.al/ and Facebook https://www.facebook.com/limonicleaning.al/ (`business.instagramUrl`, `business.facebookUrl`, shown via `socialLinks` in the footer and on /kontakt).
- Hours: not defined — do not display specific opening hours until Arbri provides them.
- **Team experience: confirmed real, ~10+ years.** This describes the team's individual/combined backgrounds (staff hand-picked from other cleaning companies), NOT how long Limoni Cleaning itself has existed, Limoni is a new company. Always phrase this as the team's experience ("ekip me mbi 10 vjet përvojë"; always "përvojë", never "eksperiencë"), never as the company's age or years in operation.
- **Properties cleaned: confirmed real, 50+.** Safe to use on-site as "50+ prona të pastruara."
- Reviews / ratings: still none. Do not display star ratings, review counts, or testimonials until real ones exist, this is unchanged by the two confirmed stats above.
- **Related business: Prago** (https://www.prago.al/) — Arbri's short-term rental property management company. Two separate companies that work together. Mention Prago only on the homepage Airbnb section and in `/pastrim-airbnb-tirane#pronare`, always as: "Bashkëpunojmë me Prago, kompani që menaxhon prona me qira ditore, për pastrimin e pronave Airbnb." Never "partner zyrtar" and never in the trust row or footer.

## Services & pricing

**One published price (Arbri, 4 Nov 2026; restricted to apartments 5 Nov 2026):** deep cleaning (`me-themel`) of an occupied or empty **apartment**, **from 250 lekë të reja/m²**, always labelled indicative ("vlerësim orientues; totali konfirmohet pas vlerësimit"), example 80 m² × 250 = 20.000 lekë të reja. Logic and the constant live in `lib/quote.ts` only. Rules:
- Never apply the m² rate to houses or villas (assessed quote until Arbri confirms their pricing), offices, hotels, Airbnb, common areas, recurring cleaning, standalone upholstery or post-construction work. The form only shows a number after "Apartament" is chosen. Those are priced after assessment (`priceAnswer` in `lib/services.ts`).
- Heavy post-construction work: say it is priced higher and confirmed after assessment. **The founder's heavy-work rate is never published and never committed, not even as a number in docs or comments** (the GitHub repo is public); it lives in the git-ignored `internal/` folder.
- Amounts are written "lekë të reja"; "lekë të vjetra" only to explain the unit in the FAQ.
- In apartment deep cleaning, **washing the sofa and all the apartment's mattresses is included** (not a promotion, not a free bonus, not "unlimited"). Quantities, sizes, materials and condition are recorded during the assessment and the included items are listed in the written offer. Not applied to other services.
- Customer incentive: **"Plan pastrimi dhe ofertë me shkrim, pa pagesë."** (`lib/assessment.ts`). It is prepared by hand after the assessment (`docs/assessment-fulfillment-template.md`); never say it is generated on submit. Photos are always optional. **The assessment visit is not promised as free** (5 Nov 2026): a visit is arranged when needed, and any charge is stated and agreed before it (`visitNote` in `lib/assessment.ts`). No discounts, credits, countdowns, scarcity or review rewards.

Services offered (all confirmed by Arbri, including hotels and post-construction on 29 Sep 2026; common areas of residential buildings/complexes and sofa/mattress/upholstery cleaning confirmed 16 Oct 2026): apartamente dhe shtëpi, Airbnb, zyra, vila, pastrim me themel, pastrim pas ndërtimit, hotele, ambiente të përbashkëta (shkallë, holle, hyrje pallatesh/kompleksesh), larje divanesh/dyshekësh/kolltuqesh; and (Arbri, 12 Nov 2026) larje qilimash, xhama (nga brenda dhe nga jashtë) and fasada. Carpets live on the divane page, windows and façades on /per-biznese (façades always after an on-site assessment); no separate pages for them. Media for divane and ambiente exists in `media-source/2026-10/` (see `docs/limoni-asset-audit.md`). Research and redesign plan from 16 Oct 2026: `docs/limoni-competitive-research.md`, `docs/limoni-redesign-strategy.md`. Service data lives in `lib/services.ts`; every service page renders through `components/ServicePage.tsx`.

WhatsApp messages come from one function, `waMessageFor(page?)` in `lib/whatsapp-messages.ts` (one message per service plus `biznese`). Don't add other presets.

`/per-biznese` is not a service slug: its copy is `businessPage` in `lib/services.ts`, rendered by the same template (`ServicePageView`). Pages are keyed by `PageKey` (`ServiceSlug | "biznese"`, `lib/service-index.ts`), which drives the WhatsApp message and the form preset (`formPreset`).

## Site architecture (final — use these exact routes)

```
/                                  Kryefaqja
/sherbime                          Overview of all services
/pastrim-apartamentesh-tirane      Apartamente dhe shtëpi
/pastrim-airbnb-tirane             Airbnb (includes #pronare section)
/pastrim-zyrash-tirane             Zyra
/pastrim-vilash-tirane             Vila
/pastrim-me-themel-tirane          Pastrim me themel (deep clean)
/pastrim-pas-ndertimit-tirane      Pas ndërtimit / rinovimit
/pastrim-hotelesh-tirane           Hotele dhe apart-hotele
/pastrim-ambientesh-te-perbashketa-tirane   Shkallë, holle, hyrje pallatesh (slug "ambiente")
/larje-divanesh-dyshekesh-tirane   Larje divanesh dhe dyshekësh (slug "divane")
/per-biznese                       Business door: zyra, dyqane, hotele, pallate
/puna-jone                         Photos, before/after, videos
/rreth-nesh
/faq
/kontakt
/kerko-oferte                      Lead form (replaces /rezervo and /cmimet)
/blog, /blog/[slug]                noindex until first post
/privatesia, /kushtet
```

Permanent redirects (`next.config.ts`): `/rezervo` and `/cmimet` → `/kerko-oferte`; `/pronare-airbnb` → `/pastrim-airbnb-tirane#pronare`.

Phase 2 (not now, don't build yet): `/tirana/[neighborhood]` pages (Blloku, Komuna e Parisit, Don Bosko, etc.), English-language version.

## Confirmed by Arbri on 17 Oct 2026 (for the business-first redesign)

- Staff in the October clips (IMG_3360, IMG_3362) and the owner of the house in IMG_3296 agreed to publication.
- Staff in the 24 October apartment and commercial-kitchen footage (IMG_3440–3443, IMG_3463–3468) agreed to publication (Arbri, 24 Oct 2026).
- Staff in the 26 October to 9 November footage (IMG_3488 to IMG_3654, used in the homepage reel and the photos listed in `docs/media-triage-2026-11.md`) agreed to publication (Arbri, 12 Nov 2026).
- Limoni can commit to regular (weekly/monthly) cleaning for offices and buildings.
- ~~The assessment visit before a quote is free~~: **withdrawn 5 Nov 2026** (treated as unconfirmed). Don't call any visit free anywhere. A visit is arranged when it makes sense (larger jobs, businesses, buildings, villas); any charge is disclosed and agreed first. Only the plan and written offer are free.
- **Service area: all of Tirana and the surrounding areas** (extended 4 Nov 2026: "si Kamza dhe Durrësi"). Keep "bazë në Komunën e Parisit" as the base.
- Upholstery: all types (divane, kënde, kolltuqe, karrige me pëlhurë, dyshekë).
- Main CTA: the Albanian reviewer recommended the polite form **"Merrni ofertën tuaj"** (matches the "ju" used everywhere else); business CTA **"Merrni ofertë për biznesin tuaj"**. Final copy and decisions: `docs/limoni-copy-final.md`.

## Confirmed by Arbri on 17 Oct 2026 (after the copy review)

- Regular business cleaning is under a **kontratë** (use that word, not "marrëveshje me shkrim").
- Limoni works **every day of the week**, weekends included. Hotels: **extra staff according to demand**.
- Hotels (12 Nov 2026): **housekeeping only**, rooms and their bathrooms between guests. Common areas, reception and kitchen are not included.
- **No laundry, no ironing, no restocking of consumables** (rrobat, çarçafët, produktet e konsumit). Sheets are changed only when clean ones are in the property. Never offer these as extras.
- **Lift cleaning**: only inside offices, villas and apartments; **not** apartment-block lifts. The common-areas page does not list the lift.
- Upholstery process and drying wording, the privacy line on the form, and "mbi 10 vjet përvojë" for team members are all confirmed as written.

## Confirmed by Arbri on 12 Nov 2026 (clarity restructure answers)

- Terminology: **pastrim i rregullt** = maintenance (weekly/monthly); **pastrim gjeneral** = a big one-off clean; **pastrim me themel** = bigger than gjeneral. The site uses only "i rregullt" and "me themel"; don't add a third tier without Arbri.
- Crew size and job duration are decided by the apartment's area (input for live holds, `docs/booking-system.md`).
- "Rezervoni pastrimin" is the right main button. The nav label stays "Puna jonë". Airbnb belongs under "Për biznesin".
- No office photo yet; the office page keeps no hero image until Arbri adds one.
- Arbri gave an hourly range for weekly/monthly cleaning. It is **not published** and not written in committed files until he confirms the unit, whether it is per cleaner or per team, and which services it covers.
- Hours, street address, response time, guarantee and visit price: unchanged (see below).

## Open decisions (defaults in force until Arbri says otherwise)

- **Response time**: no "brenda X orësh" promise. Use "së shpejti".
- **Guarantee**: no re-clean guarantee on the site.
- **Hours, street address**: none yet, show nothing. (Email, Google Maps listing, Instagram and Facebook exist, see facts above.)

## Non-negotiable rules

1. **Never fabricate**: reviews, ratings, customer counts, years in business, certifications, service-area claims, awards, or "#1 in Tirana"-style superlatives. If real data doesn't exist yet, build the UI slot and leave it clearly marked for Arbri to fill in later — don't fill it with a plausible-sounding placeholder that could ship by accident.
2. **Every form must actually work.** Every public form submits to `POST /api/kerkesa`, which saves a `ServiceRequest` (deduped by `clientRequestId`) and alerts the owner (`lib/booking/notify-owner.ts`, `docs/booking-system.md`); the customer then lands on `/kerkesa/<token>`. The older `POST /api/lead` path (`Lead` row, `notifyNewLead()`, `docs/lead-notifications.md`) keeps the same rules. The success state only shows after the row is saved; it confirms storage, not owner notification or a slot. Never log request bodies or raw Prisma errors (they can contain names and phones). No booking references, no "rezervimi u konfirmua" wording: a lead is a request for assessment, not a confirmed slot; a booking needs agreed scope, total and date. Run `npm test` after touching the form, API, pricing or install logic. Run `npm run check:media` before committing: it fails when code references a `public/` file that is missing or untracked.
3. Albanian copy only (unless explicitly building the future English version). Correct ë/ç and grammar, natural tone, no literal English-to-Albanian translation, no keyword stuffing.
4. Don't create thin pages for keywords alone. Every route needs real, useful content.
5. Mobile-first. Most local-service traffic will be on mobile.
6. Prefer editing and extending existing code over rewriting things that already work, once the initial build exists.

## Design rules (from prompt 03, keep them)

- Inter for everything, hierarchy from size and weight; Barlow Condensed 800 only for display headings via `DisplayHeading`. No italic serif kickers, no "01/02/03" numerals, no "→" arrow links, no `✓` characters (use `components/icons.tsx` (`CheckIcon`, `CheckList`)).
- No em dashes in visible copy, `alt` or meta text.
- No empty image slots on public pages. No "Foto — …" placeholder labels.
- Body copy 18px on mobile; `text-sm` only for captions and legal text. Every tap target ≥ 48px. Never yellow text on white. Labels always above inputs.
- No carousels, autoplay, arrival popups, or fake chat widgets. One exception, approved in the redesign strategy and moved into the hero in Nov 2026: the homepage reel (`components/HeroReel.tsx`, `public/videos/puna-jone-permbledhje.mp4`), silent (no audio track), no video bytes before the page load event, plays only while on screen, never with reduced motion or Save-Data, with a visible pause button.
- Homepage heading (Arbri, 12 Nov 2026): "Pastërti për [shtëpinë / zyrën / hotelin / vilën / dyqanin / pallatin] tuaj", one place at a time (`components/RotatingWords.tsx`). Screen readers get the full sentence; it never moves with reduced motion or Save-Data, stops off screen and pauses with the reel's pause button. Only confirmed services in the list.
- Header nav (Nov 2026): Kryefaqja · Shërbimet · Si funksionon · Rreth nesh (Puna jonë, Për biznese, FAQ and Kontakt in the mobile menu and footer), then the phone and the booking button **"Rezervoni pastrimin"** (`bookingCtaLabel` in `lib/nav.ts`). The same label is on every service hero and the mobile bar. `mainCtaLabel` ("Merrni ofertën tuaj") remains only where a page asks for an offer rather than a date.
- One booking section per marketing page, before the footer: `components/booking/BookingSection.tsx` (`#rezervo`, steps service, date and time, details, review). It replaced `LeadForm`, `Closer` and `WorkLoop`. Every booking button jumps to it (`lib/jump-to-form.ts`), else opens `/kerko-oferte` with the service preselected. Dates are "preferred, not held" until live holds are configured; demo slots exist only outside production with `?orare-demo` and are labelled as such.
- Mobile action bar (`components/MobileStickyCta.tsx`): WhatsApp · **Rezervoni pastrimin** (centre, yellow; jumps to `#rezervo`) · Telefono. It steps aside while a form or the homepage hero is on screen. The deep-clean landing's main button says **"Kërko vlerësim"** (founder video script); the booking section submits with "Dërgo kërkesën".
- Albanian month and weekday names are spelled out in `lib/booking/time.ts`, never taken from `Intl`: Chromium ships no `sq` locale data and falls back to English, which also breaks hydration. `tests/booking-albanian-names.test.ts` guards it.
- Optional Home Screen shortcut (`app/manifest.ts`, `components/InstallShortcut.tsx`): only in the mobile menu and the footer; never a pop-up. No service worker (nothing cached, so no stale prices).
- Founder video slot (`lib/founder-video.ts`) stays `null` until a real file, poster and Albanian captions exist (`docs/vsl-production.md`). Never a placeholder or dead play button.

## Prompts

1. `prompts/01-initial-build.md` — initial build (done).
2. `prompts/02-optimization-audit.md` — polish/SEO audit (done).
3. `prompts/03-lead-first-refactor.md` — lead-first refactor (done 29 Sep 2026). Supersedes earlier pricing, `/rezervo` and `/cmimet` instructions.
4. `prompts/04-editorial-redesign.md` — editorial redesign (done).
5. `prompts/05-rishikim-teksti-shqip.md` — Albanian copy review for the business-first redesign; reply and decisions in `docs/limoni-copy-final.md`; implemented 17 Oct 2026 per `docs/limoni-redesign-strategy.md`.
7. Service-specific booking requests with manual approval and Google Calendar (5 Nov 2026): `docs/booking-system.md` (setup, states, sync limits, owner decisions). Pricing/scope templates in `lib/booking/catalog.ts`; bump `CATALOG_VERSION` when they change.
6. Assessment, pricing and mobile booking brief (4 Nov 2026, from Arbri's `Limoni-Claude-Website-Prompt.md`): audit and change log in `docs/website-audit.md`; sales replies in `docs/sales-handoff.md`; plan template in `docs/assessment-fulfillment-template.md`; video packet in `docs/vsl-production.md`.
8. `prompts/08-clarity-restructure.md`: clarity restructure (12 Nov 2026). Audit `docs/clarity-audit-2026-11.md`, plan `docs/phase2-plan-2026-11.md`, media triage `docs/media-triage-2026-11.md`, review ledger `.claude/reviews/phase2.ledger.md`.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
