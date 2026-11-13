# Booking requests, owner review and Google Calendar

Built 5 November 2026 on branch `feat/assessment-pricing-mobile-bar`. Not deployed, not committed.
The website database is the source of truth for status, scope, price, date and history. Google
Calendar only mirrors holds and bookings as private busy blocks, and supplies busy time typed in
by hand.

## 1. What works now and what waits

| Part | State |
|---|---|
| Customer flow at `/kerko-oferte` (service → questions → photos → estimate and checklist → date → contact → submit) | **Works.** Verified locally on a 390 px phone emulation. |
| Private status page `/kerkesa/<link>` (pending, info request, revised proposal accept/decline, confirmed, cancel) | **Works locally.** |
| Owner panel `/admin` (login, inbox, review, approve, revise, ask, decline, cancel, complete, job sheet) | **Works locally.** Needs `ADMIN_USERS` + `ADMIN_SESSION_SECRET` in Vercel. |
| Service questions, pricing rule (apartment deep clean 250 lekë të reja/m² only), checklists, versioned snapshots | **Works.** |
| Live holds with database concurrency protection | **Works with test settings.** **Off in production** until the operating settings below exist (`BOOKING_SETTINGS`). Until then customers choose a preferred date, shown as "nuk mbahet". |
| Google Calendar blocks, busy-time checks, retries, drift detection | **Works against a local fake of the Google API** (including token signing). **Not tested against real Google**: needs a service account and a calendar. |
| Photo/video uploads | **Works with the local driver** (development). **Production needs a private S3-compatible bucket** (e.g. Cloudflare R2): not purchased, not configured. Without it, the photo step says uploads are off and offers WhatsApp or "vazhdo pa foto". |
| Owner email / WhatsApp alerts for requests | Uses the existing Resend / WhatsApp Cloud API setup; delivery status stored apart from booking status. **Not tested with real delivery** (no keys locally). Customers get **no** automatic message. |
| Daily maintenance (`/api/cron/kerkesa`, Vercel Cron 06:00 UTC) | **Works locally.** Needs `CRON_SECRET` in Vercel. |

## 2. States

```
submit ──► PENDING_REVIEW ──ask──► AWAITING_INFO ──customer replies──► PENDING_REVIEW
              │                                                            │
              ├──approve original (feasibility checked, conflicts rechecked)──► CONFIRMED ──► COMPLETED
              │
              └──revised proposal (price/scope/date changed)──► AWAITING_CUSTOMER
                                                                   ├─ customer accepts ──► CONFIRMED
                                                                   └─ customer declines ─► DECLINED
any open state ──owner declines──► DECLINED     any open/confirmed ──owner or customer cancels──► CANCELLED
```

- "Approve original" is allowed only if the customer's own proposal has a price (today: the
  apartment deep-clean estimate) and an exact time. On a preferred date the owner may set the
  time on that same date. Anything else is a revised proposal.
- Every proposal version is stored (`proposals`), never edited: version, kind
  (`submitted` / `revised` / `approved`), who made it, when, who responded, and the full snapshot
  (answers, price, checklist, date, message). Template edits later can't change old requests;
  `catalogVersion` records which template produced them.
- `request_events` is the audit log (actor = `klienti`, `sistemi` or the owner's username).

## 3. Pricing and scope configuration (`lib/booking/catalog.ts`)

- `services`: per-service questions (choice, multi, count, area, text), neutral condition wording,
  and what photos help.
- `estimateFor`: the only rule is apartment deep cleaning (`DEEP_CLEAN_RATE_LEK` in
  `lib/quote.ts`): area 20–400 m², not post-construction. Everything else returns
  **"Çmimi përcaktohet pas vlerësimit"**. Never zero.
- `checklistFor`: included / excluded / to clarify / customer priorities, built only from the
  template and the answers. Exclusions are only the confirmed ones (laundry, ironing, restocking,
  building lifts, large debris, painting).
- To add a confirmed price for another service: add a branch in `estimateFor`, add tests in
  `tests/booking-catalog.test.ts`, bump `CATALOG_VERSION`, and record the decision in `CLAUDE.md`.
- The browser shows a live preview with the same code; **the server recomputes everything on
  submit** and stores that snapshot.

## 4. Availability, holds and concurrency

Settings: `lib/booking/settings.ts`, overridable with `BOOKING_SETTINGS` (JSON) in Vercel. Live
holds are made only when `liveHolds` is true **and** start times, end of day, buffer, crews and
the service's duration are all set, **and** Google Calendar is configured. Example (values are
placeholders, not Limoni's real settings):

```json
{
  "liveHolds": true,
  "startTimes": ["08:00", "13:00"],
  "dayEndsAt": "18:00",
  "bufferMinutes": 60,
  "crews": 2,
  "minLeadHours": 24,
  "horizonDays": 30,
  "holdHours": null,
  "staleHoldAlertHours": 24,
  "manualBusyBlocks": "all",
  "services": { "me-themel": { "durationMinutes": 240, "crewsNeeded": 1 } }
}
```

- Crew size and job duration depend on the apartment's area (Arbri, 12 Nov 2026). The current
  settings take one fixed `durationMinutes` and `crewsNeeded` per service, so before live holds
  are switched on for apartments, either the durations are set per area band or the settings
  gain an area-based rule. Live holds stay off until then.
- Time zone: Europe/Tirane for every wall-clock value; DST is handled (tests cover the March
  and October switches).
- A slot is offered if: working day, within hours, after the lead time, the job (+ buffer) fits,
  enough crews are free (website holds and bookings), and no manual busy event overlaps (default:
  a manual appointment blocks all crews; `"one"` = blocks one crew).
- **Concurrency**: the hold is a row per crew in `slot_reservations`, protected by the Postgres
  exclusion constraint `slot_reservations_no_overlap` (same crew, overlapping time, not released).
  Inserts use `ON CONFLICT DO NOTHING` crew by crew inside the request's transaction, so two
  simultaneous requests for the last crew can't both succeed (tested), and the loser's request
  isn't saved at all ("Ky orar sapo u zu").
- **Idempotency**: the browser sends one `clientRequestId` per form; a retry or double tap returns
  the same request and link.
- **Holds don't expire by themselves** unless `holdHours` is set (no promise is published).
  Holds older than `staleHoldAlertHours` are highlighted in the inbox and listed in the daily
  digest email, so they can't sit unnoticed.
- Services without a duration, or Google unavailable at submit: the date is saved as
  **preferred, not held**, with the reason; the customer page says so.
- When capacity isn't configured and the owner confirms a job, a reservation with `crew = NULL`
  is stored: it shows in the calendar and counts as one busy crew in availability, but never
  blocks via the constraint.

## 5. Google Calendar setup (owner, ~15 minutes)

1. Google Cloud Console → create a project → enable **Google Calendar API**.
2. IAM → Service accounts → create one (no roles needed) → Keys → add JSON key. Keep it private.
3. In Google Calendar, create a calendar (e.g. "Limoni punët") or use the existing one → Settings
   → **Share with specific people** → add the service account's email with **"Make changes to
   events"**. Copy the **Calendar ID**.
4. Vercel → Environment Variables (Production only; give Preview a separate test calendar):
   `GOOGLE_SERVICE_ACCOUNT_EMAIL`, `GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY` (the `private_key` value;
   `\n` sequences are fine), `GOOGLE_CALENDAR_ID`.
5. Test on a Preview deployment with a **test calendar** first.

What goes into the calendar: one private event per request, deterministic id
`lmn<sha256(requestId)>`, title "Në shqyrtim (pa konfirmuar): <shërbimi>" →
"Në pritje të klientit: …" → "Konfirmuar: …", description = link to the protected owner page only.
No name, phone, address, answers or media. No attendees, so **no invitations are sent**.

Sync rules:
- After every state change the event is created/updated/removed to match the database.
  Approval updates the **same** event; release/cancel/decline deletes it.
- A failed Google call never undoes a database hold; the request shows "Kalendari: Dështoi" in
  the inbox, the daily job retries (max 20 times), and the owner can press "Provo sërish".
- Busy time is read with `events.list` and our own events are excluded by their private property.
- **Manual edits**: if our event is deleted or moved by hand in Google, the daily job flags the
  request "Ndryshuar me dorë" (DRIFT). The booking and the customer's offer are **not** changed.
  The owner either restores the block ("Ktheje bllokun në orën e dakordësuar") or reschedules
  through the website, which sends the customer a revised proposal.
- Limits: busy time typed into Google after a slot was held is caught only at approval (re-check)
  and by the daily drift run; recurring busy events are read as their single instances; all-day
  events block the whole day; calendars other than the configured one are not read.

## 6. Photos and videos

- Limits (shown on the page): photos JPG/PNG/WEBP/HEIC up to 15 MB, videos MP4/MOV up to 100 MB,
  at most 8 files. Checked in the browser and **again on the server**, including the real file
  signature (a renamed text file is rejected).
- Flow: start (server reserves a random private key) → upload with progress (direct to the bucket
  with a 15-minute signed PUT in production) → server verification → attached on submit, only by
  the browser that holds the upload's draft key. Retry and remove are on each file.
- Access: the owner (logged in) through `/admin/media/<id>`; the customer only through their own
  link `/kerkesa/<link>/media/<id>`. Both return `Cache-Control: private, no-store` and, in
  production, a 5-minute signed URL. Nothing is public or permanent. Not shown on job sheets.
- No AI or automatic analysis; the site says photos are looked at by people.
- Retention: unattached uploads are deleted after 24 hours (daily job). Media of declined,
  cancelled or completed requests is deleted after `MEDIA_RETENTION_DAYS` days **only if set**;
  otherwise it stays until deleted by hand. Deleting a request row deletes its media rows
  (cascade); the bucket object must also be removed (the daily job does it for the cases above).
- Bucket setup (Cloudflare R2 example): create a private bucket (public access off), an API
  token with object read/write on that bucket, CORS rule allowing `PUT` from
  `https://limonicleaning.com` with header `Content-Type`. Env: `MEDIA_STORAGE=s3`,
  `S3_ENDPOINT`, `S3_REGION=auto`, `S3_BUCKET`, `S3_ACCESS_KEY_ID`, `S3_SECRET_ACCESS_KEY`.

## 7. Owner panel and links

- Set up: `npm run admin:hash` (asks for a password, 12+ characters) → put the printed line in
  `ADMIN_USERS`; put 32+ random characters in `ADMIN_SESSION_SECRET` and in `BOOKING_LINK_SECRET`.
  The hash uses dots, not `$` (Next.js would expand `$` in `.env` files).
- Login is rate-limited (5 per 10 minutes per IP); the session cookie is httpOnly, SameSite=Strict,
  Secure, 12 hours. Every admin page, action and media route checks the session itself.
- Customer links: 256-bit random tokens; the database stores a SHA-256 hash for lookup and an
  AES-GCM copy (key from `BOOKING_LINK_SECRET`) so the owner can copy the link again. "Krijo
  lidhje të re" invalidates the old one. Pages send `noindex`, `no-referrer`, `no-store`.
- "Shkruaji në WhatsApp me lidhjen" opens the owner's own WhatsApp with a prefilled message;
  the owner sends it. The site never messages customers.
- Job sheet `/flete-pune/<link>`: confirmed requests only; agreed checklist, date, address,
  planned crew/duration, customer first name and phone; **no media, no price**; printable;
  revocable link.

## 8. Tests and evidence

- `npm test`: 78 unit tests (time zone/DST, catalogue, pricing, checklists, availability, upload
  rules, owner login) + the earlier site tests.
- `TEST_DATABASE_URL=postgresql://…local… npm run test:integration`: 15 tests against a real local
  Postgres and the fake Google API: hold + single private event without personal data; duplicate
  submit; **two simultaneous requests for the last crew (one wins)**; manual busy time blocks;
  **Google outage → preferred date, no hold**; calendar write failure → hold kept, FAILED, retried
  without duplicates; approve updates the same event; conflict re-check before approval
  (override recorded); revised proposal → customer acceptance, versions kept; decline/cancel
  release the slot; manual deletion → DRIFT, booking unchanged, restore; hold expiry only when
  configured; preferred date for unconfigured services; no-photo submit + notification status;
  uploads (real JPG accepted, fake rejected, other draft keys refused, customers can't open
  others' media).
- Browser run (headless Chrome, 390 × 844, local dev server, fake Google, local media):
  screenshots in `Claude outputs/screenshots-2026-11-05-booking/` (20–34).

## 9. Owner decisions still needed

1. Working hours: start times and latest end of a job.
2. Independently bookable crews (not the number of cleaners), and crews per service.
3. Conservative duration per service (at least apartment deep cleaning) and travel/setup buffer.
4. Minimum notice and how far ahead customers may book.
5. Hold policy: how long a pending hold lasts (`holdHours`), and whether to tell customers.
6. Whether a manual appointment in the calendar blocks all crews or one.
7. Prices for services other than apartment deep cleaning, or keep "pas vlerësimit".
8. Whether an assessment visit ever costs something.
9. Media: storage provider (R2/S3 account), retention period, which staff (if any) may see media.
10. Whether the job sheet should show the customer's phone number.
11. Which Google calendar to connect, and the service account to create.
