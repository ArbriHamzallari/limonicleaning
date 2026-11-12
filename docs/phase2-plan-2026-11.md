# Phase 2 plan: clarity restructure, hero reel and booking section (Nov 2026)

Source brief: `prompts/08-clarity-restructure.md` (Phase 2), the Phase 1 audit
(`docs/clarity-audit-2026-11.md`), and the owner's message of 12 Nov 2026:

- the homepage opens with a short looping reel of real work (video, not photos);
- each service explains what it is, what it includes and how it differs from related services;
- simple navigation (Kryefaqja, Shërbimet, Si funksionon, Rreth nesh, plus a booking button);
- one booking section near the bottom of every marketing page, before the footer, reached by
  every booking button: service, then date and time, then contact and property details, then
  review and submit; service preselected on service pages; Europe/Tirane; past dates blocked;
  selected, unavailable, loading and error states; demo availability only in development and
  clearly labelled; nothing called confirmed unless it was saved.

Phase 1 direction approved by "continue with phase 2": the Blitz-style system from
`docs/research/2026-11-clarity/mockup-blitz-limoni.html` (condensed display headings,
dark green hero band, two-tone headings, photo cards with a caption bar).

Branch: `feat/clarity-restructure`, cut from `feat/assessment-pricing-mobile-bar` at `7b00cc7`.

## Measured premises

| Premise | Command | Output | Date |
|---|---|---|---|
| Hero reel size | `ls -l public/videos/puna-jone-permbledhje.mp4` | 1,688,481 bytes (CRF 29; CRF 27 was 2,152,359) | 12 Nov 2026 |
| Hero reel length and frame | `ffprobe -show_entries format=duration:stream=width,height` | 18.000000 s, 720x900, no audio stream | 12 Nov 2026 |
| Reel poster size | `ls -l public/images/puna-jone-permbledhje.jpg` | 44,121 bytes | 12 Nov 2026 |
| Media folder totals before this batch | `du -sh public/videos public/images` | 21M / 4.2M | 12 Nov 2026 |
| Largest video already shipped | `ls -l public/videos` | 4,958,232 bytes | 12 Nov 2026 |
| New photos carry no GPS | PIL `getexif()`, tag 34853 | absent on all 11 | 12 Nov 2026 |
| New photo dimensions | `sips -g pixelWidth -g pixelHeight` | 1200x1600, one 1600x1200 | 12 Nov 2026 |
| Availability today | read of `app/api/kerkesa/disponueshmeria/route.ts` and `BOOKING_SETTINGS` | `mode: "preferred"` (holds off), minDate today+1, maxDate today+90 | 12 Nov 2026 |
| Submit schema has no email or preferred time | read of `lib/booking/requests.ts:92` (`SubmitInput`) and `prisma/schema.prisma` (`ServiceRequest`) | no `email`, no `preferredTime` | 12 Nov 2026 |
| Baseline Lighthouse mobile, `/` | `next build && next start` of `7b00cc7` in a separate worktree, `npx lighthouse@12.8.2 --form-factor=mobile --only-categories=performance`, 3 runs | 85 / 92 / 92 (median 92); LCP 4.4 / 3.4 / 3.4 s; TBT 0 to 10 ms; CLS 0; LCP element is the hero `IMG` | 12 Nov 2026 |
| Baseline transfer, `/` | same runs, `total-byte-weight` | 640,456 bytes | 12 Nov 2026 |
| Baseline JS per page (gzip) | sum of `/_next/static/*.js` script tags fetched with `Accept-Encoding: gzip` | `/` 202,799; `/pastrim-apartamentesh-tirane` 200,532; `/pastrim-me-themel-tirane` 201,147; `/kerko-oferte` 206,481 bytes | 12 Nov 2026 |

Targets for task 7, against the same commands: Lighthouse mobile on `/` at least 92 (median of
3), LCP not slower than 3.4 s, CLS 0, and JS per page no more than 15 KB gzip above baseline.
Unmeasured until task 7: that the reel poster becomes the LCP element and that the video bytes
are not fetched before the `load` event.

## Decisions

### Visual system

- **Display face**: Barlow Condensed 800 through `next/font/google`, subsets latin and
  latin-ext (ë, ç), exposed as `--font-display`, headings only. Inter stays for everything else.
- Uppercase only on display headings, photo-card captions and short kickers. Body copy keeps
  sentence case.
- Shared pieces: `DisplayHeading` (white or ink line plus a lemon or green second line),
  `PhotoCard` (photo with a dark green caption bar), `DarkBand`, dark footer (`#0F3520`).
- Never yellow text on white: the lemon line appears only on dark green.
- CLAUDE.md design rules change accordingly (second typeface for display headings, uppercase on
  display headings, more than one dark block, a photo-card grid for the service picker, the hero
  reel as a second approved autoplay clip).

### Hero reel

- `HeroReel`, a sibling of `WorkLoop` that is not lazy: the optimized poster is rendered as a
  priority image (LCP). The video has no `src` until the window `load` event has fired and at
  least half of it is on screen, so its 1.7 MB never competes with the poster or the page's
  own resources (review F-premise b).
- Never plays with `prefers-reduced-motion: reduce` or Save-Data; then the poster stays.
  Visible pause button (48px), state stays paused once the visitor pauses. Silent file, no audio
  track. Loops.
- Mobile: reel full width at 4:5, then the dark green band with the H1, one proof line, and two
  actions (booking button, WhatsApp). Desktop: text left, reel right.
- This replaces the prompt's "no video autoplay in the hero": the owner asked for the reel.

### Homepage order

1. Hero reel and H1.
2. Service picker in two groups. Për shtëpinë: Pastrim i rregullt, Pastrim me themel, Vila,
   Pas ndërtimit, Larje divanesh dhe dyshekësh. Për biznesin: Zyra, Ambiente të përbashkëta,
   Hotele, Airbnb. Photo cards, one link each.
3. Pse Limoni: three points with `CheckIcon` (ekip me mbi 10 vjet përvojë, 50+ prona të
   pastruara, plan dhe ofertë me shkrim pa pagesë) and one large photo.
4. Proof: the existing before/after plus the new drain pair.
5. Si funksionon (`id="si-funksionon"`): numbered steps are allowed here because the order is
   real.
6. Price block: deep cleaning of an apartment from 250 lekë të reja/m², indicative, apartments
   only (`lib/quote.ts`).
7. "Jeni kompani?" dark band to `/per-biznese` and the phone.
8. Service area (Tirana, Kamza, Durrës; base in Komuna e Parisit).
9. FAQ.
10. Booking section (shared, see below).

Removed: the old dark business section, the jump-link row, the duplicated service lists, the
trust row that repeats the hero, the separate "Ekipi në punë" section (the reel replaces it).
Copy that implies a free visit is removed.

### Services

- Each service gets three standard fields in `lib/services.ts`, rendered in a fixed order by
  `ServicePage.tsx` near the top: **Çfarë është**, **Çfarë përfshihet**, **Si ndryshon nga**
  (one or two named comparisons that link to the related service). Content comes from what the
  site already confirms; competitor pages are reference for structure only, nothing is copied.
- Only confirmed services. Carpets and rugs, standalone window cleaning, façades and floor
  polishing are not added; they are questions for Arbri. Move-in and move-out becomes an
  "empty apartment" situation under deep cleaning. Scheduled maintenance becomes regular
  cleaning plus the business kontratë.
- Naming: "Pastrim i rregullt" replaces "Pastrim gjeneral" everywhere (`lib/service-index.ts`,
  `app/page.tsx`, apartamente `h1` and `metaTitle`, `lib/booking/catalog.ts`). "Pastrim i
  thellë" is retired in favour of "Pastrim me themel". One post-construction name ("Pastrim pas
  ndërtimit"). One business label ("Për biznese").
- `/sherbime`: situation list plus the regular vs deep comparison (audit section 4.3), Airbnb
  listed under business.
- URLs and redirects stay as they are.

### Navigation

- Header: Kryefaqja, Shërbimet, Si funksionon (`/#si-funksionon`), Rreth nesh, phone, booking
  button. Puna jonë and Për biznese leave the header and stay in the footer and the picker.
- Booking button label: **"Rezervoni pastrimin"** (the owner asked for "Book a Cleaning";
  review F8 rejected with that reason). The section copy says the date is the
  visitor's preferred date and that Limoni confirms it by phone or WhatsApp. No "konfirmuar",
  no hold wording while holds are off.
- Every booking button has `href="/kerko-oferte?sherbimi=..."` and, on click, jumps to
  `#rezervo` when the section exists on the page (the `QuoteButton` `jump` pattern), so it never
  dead-ends (F7).
- Mobile bar: WhatsApp, booking button, Telefono. On the homepage it
  appears once the hero has left the screen; it hides while the booking section is visible so it
  never covers the form.

### Booking section

- `BookingSection`, a client component with `id="rezervo"`, rendered **by each marketing page**
  as its last block (homepage, `/sherbime`, every `ServicePage`, the deep-cleaning landing,
  `/per-biznese`, `/puna-jone`, `/rreth-nesh`, `/faq`, `/kontakt`). Not in the root layout, so it
  never appears on 404, legal pages, `/kerko-oferte` or private routes (F2), and it remounts on
  every navigation (F4).
- The page passes an explicit `preset?: ServiceKey`; `/per-biznese` and general pages pass none
  (F5). After a successful submit a new `clientRequestId` is minted (F4).
- The demo flag is read from `window.location.search` inside an effect, never `useSearchParams`
  (F3). The calendar code is in the same client chunk; its added JS is checked against the
  15 KB target.
- `ResidentialDeepCleaningLanding` (`/pastrim-me-themel-tirane`) is in scope: it gets the three
  service fields and its own `LeadForm` is replaced by the shared section (F6).
- `Closer` keeps its FAQ role; its quick form is removed from service pages and the homepage in
  favour of the shared section. `/api/lead` keeps working (kontakt and any other caller).
- Steps, as few screens as possible:
  1. **Shërbimi**: chips; when preselected, shown as a summary chip with "Ndrysho".
  2. **Data dhe ora**: one screen. Month grid in Europe/Tirane, today and past days disabled,
     days past `maxDate` disabled, roving tabindex with arrow keys, Home/End, PageUp/PageDown
     for months, full Albanian date as each day's accessible name. Live mode shows real time
     chips from the API. Preferred mode (today's production) shows "Paradite", "Pasdite",
     "Nuk ka rëndësi", labelled as a preference. Loading skeleton, error with retry and the
     WhatsApp fallback, unavailable days visibly struck and `aria-disabled`.
  3. **Të dhënat**: emri, telefoni, zona, "Lagjja ose adresa", the service's required questions
     from `lib/booking/catalog.ts`, sipërfaqja when the service asks for it, shënime
     (optional), email (optional), preferred contact channel.
  4. **Kontrolli**: service, date, time window, contact, then submit to `POST /api/kerkesa`.
     Success only after the API returns `ok`; then it routes to the status link, or shows the
     plain success text when `statusUrl` is null (F14).
- **Availability provider interface** (`lib/booking/availability-client.ts`): one function the
  UI calls, returning either `{ mode: "live", days }` or `{ mode: "preferred", minDate, maxDate }`
  or an error. The production provider is the existing endpoint. A demo provider exists only
  when `NODE_ENV !== "production"` and a query flag is set; it labels every slot "Orare demo,
  vetëm në zhvillim" and its picks are sent as a preferred date and time, never as a `slot`.
  A later Google Calendar or Notion source plugs in behind the endpoint without UI changes.
- **Migration** `20261112120000_request_email_time`: additive, nullable `email` and
  `preferredTime` on `ServiceRequest`. zod accepts an optional email (max 120) and a
  `preferredTime` from a fixed set. Email is shown only in `/admin` and the owner's email
  notification; never in the job sheet, calendar events, the WhatsApp notification, analytics or
  logs. `/privatesia` lists it (F10). Demo picks map to Paradite (before 12:00) or Pasdite (F16).
  The server's `preferredDate` bound is aligned to the availability `maxDate`, today+90 (F13).
- `Analytics` does not render on `/kerkesa/*`, `/flete-pune/*` or `/admin`, so a status token
  never reaches GA once it is configured (F11).
- `CATALOG_VERSION` is bumped for the label change (F12).
- The full `/kerko-oferte` wizard (photos, priorities) stays as the detailed route; the section
  links to it for visitors who want to send photos.

### Small fixes from the audit

- Honeypot label hidden from screen readers (`aria-hidden` on the wrapper, `tabIndex={-1}`).
- Wrong comment in `MobileStickyCta.tsx` corrected.

## Tasks

1. Branch; a11y and copy fixes; naming changes; free-visit copy removed. `npm test`.
2. Visual system: display font, `DisplayHeading`, `PhotoCard`, `DarkBand`, dark footer.
3. Service data fields and `ServicePage` rendering; `/sherbime` comparison.
4. Homepage rebuild with `HeroReel`.
5. Navigation, mobile bar behaviour.
6. Booking section: availability client, calendar, steps, migration, API and admin changes,
   unit tests for date rules (Europe/Tirane, past days, max date) and the submit mapping.
7. Verify: `npm test`, `npm run lint`, `npm run build`, `npm run check:images`; browser at
   390 and 1440 (no horizontal scroll, tap targets at least 48px, one H1 per page, keyboard
   path through the calendar, reduced motion); Lighthouse mobile on `/`; copy QA (no em dashes,
   no "falas" near "vizitë", "përvojë" only). Pre-commit review of the full diff.
8. Docs: CLAUDE.md rules and routes (rule 2 rewritten for both `/api/lead` and `/api/kerkesa`,
   F9), `SITE_OVERVIEW.md`, changelog in the audit.

## Not committed

- The untracked `public/` images (the ChatGPT image, `biseda-post-04.png`, the two Google Ads
  banners, `limoni-cleaning-logo.png`) and anything in `internal/` (F15).
- **The reel and the 26 Oct to 9 Nov photos are built and checked locally only. They are not
  committed or deployed until Arbri confirms staff consent and it is written into CLAUDE.md**
  (F1).

## Open for Arbri

- Staff consent for the 26 Oct to 9 Nov footage used in the reel and photos (blocks commit).
- Carpets, standalone windows, façades, floor polishing: offered or not.
- Hours, crews, durations and buffer, so live slots can be switched on.
- The booking button wording.
