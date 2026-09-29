# Limoni Cleaning

Marketing + booking website for Limoni Cleaning (Tirana, Albania). See `CLAUDE.md` for the full
project brief, brand system, and business facts.

## Stack

Next.js (App Router, TypeScript) · Tailwind CSS v4 · Prisma + Postgres · Resend (email) · Zod.

## Local setup

1. **Install dependencies**

   ```bash
   npm install
   ```

2. **Database.** Provision a free Postgres database on either [Vercel Postgres](https://vercel.com/docs/storage/vercel-postgres)
   or [Supabase](https://supabase.com) (either works — the app just needs a standard
   `postgresql://` connection string).

3. **Environment variables.** Copy `.env.example` to `.env` (Prisma CLI) and `.env.local`
   (Next.js dev server reads this too) and fill in:
   - `DATABASE_URL` — your Postgres connection string.
   - `RESEND_API_KEY`, `EMAIL_FROM`, `EMAIL_TO` — for booking/contact email notifications.
     Get a free key at [resend.com](https://resend.com). Without these set, submissions still
     persist to the database, but the notification email is skipped (logged to the console)
     instead of failing the request.
   - `NEXT_PUBLIC_SITE_URL` — used for canonical URLs, sitemap, and OG tags.
   - `NEXT_PUBLIC_GA_MEASUREMENT_ID` — optional. Leave unset and no analytics script loads at
     all. Set a real GA4 ID and key events start firing (see `lib/analytics.ts`): CTA clicks,
     WhatsApp clicks, phone clicks, booking started/completed, contact submitted.

4. **Run migrations**

   ```bash
   npx prisma migrate dev
   ```

5. **Start the dev server**

   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000).

## Testing the booking/contact flow locally

- Go to `/rezervo`, complete the wizard, and submit. On success you'll see a reference number
  (e.g. `LC-20260903-AB12`) — that means the row was written to `bookings` in Postgres.
- Go to `/kontakt` and submit the form — check the `contact_messages` table.
- Inspect the database directly with `npx prisma studio`.
- If `RESEND_API_KEY`/`EMAIL_TO` aren't set, the terminal running `next dev` logs a warning
  instead of sending an email — the submission still succeeds and persists.

## Project structure

- `app/` — routes (see `CLAUDE.md` for the full site map).
- `app/api/booking`, `app/api/contact` — Route Handlers that validate (Zod), persist (Prisma),
  and email-notify (Resend) each submission.
- `components/` — shared UI (`Header`, `Footer`, `Button`, `Card`, `Section`, `PriceTable`,
  `FaqItem`, `WhatsAppLink`, `PhoneLink`, `PlaceholderImage`, `Breadcrumbs`, `MobileStickyCta`,
  `Analytics`, `Logo`).
- `lib/` — business facts, pricing, structured content (migrated from `content/source-copy.md`),
  validation schemas, Prisma client, email sending, WhatsApp message presets, analytics event
  wrapper, SEO/JSON-LD helpers.
- `prisma/schema.prisma` — `Booking` and `ContactMessage` models.

## Deploy

Target is Vercel. Set the same environment variables from `.env.example` in the Vercel project
settings, then deploy. Run `npx prisma migrate deploy` against the production database before
(or as part of) the first deploy.
