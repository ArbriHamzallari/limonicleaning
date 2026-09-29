# Limoni Cleaning

Lead-first marketing website for Limoni Cleaning (Tirana, Albania). See `CLAUDE.md` for the
project brief, rules and business facts, and `SITE_OVERVIEW.md` for how the code fits together.

## Stack

Next.js 16 (App Router, TypeScript) · Tailwind CSS v4 · Prisma + Postgres · Resend (email) ·
WhatsApp Cloud API (optional owner alerts) · Zod.

## Local setup

1. **Install dependencies**

   ```bash
   npm install
   ```

2. **Database.** Any Postgres works (Vercel Postgres, Supabase, or a local one). The app only
   needs a `postgresql://` connection string.

3. **Environment variables.** Copy `.env.example` to `.env` (Prisma CLI) and `.env.local`
   (Next.js) and fill in:
   - `DATABASE_URL`: Postgres connection string.
   - `RESEND_API_KEY`, `EMAIL_FROM`, `EMAIL_TO`: lead notification emails. `EMAIL_FROM` must be
     on a domain verified in Resend. Without them, leads are still saved and a skip line is
     logged.
   - `WHATSAPP_TOKEN`, `WHATSAPP_PHONE_NUMBER_ID`, `OWNER_WHATSAPP`,
     `WHATSAPP_TEMPLATE_NEW_LEAD`: optional owner alert on WhatsApp (see comments in
     `.env.example` and `lib/notify.ts`).
   - `NEXT_PUBLIC_SITE_URL`: canonical URLs, sitemap, OG tags, JSON-LD.
   - `NEXT_PUBLIC_GA_MEASUREMENT_ID`: optional. Unset means no analytics script at all.

4. **Run migrations**

   ```bash
   npx prisma migrate dev
   ```

5. **Start the dev server**

   ```bash
   npm run dev
   ```

## Testing the lead form locally

- Submit the form on `/kerko-oferte` (or any service page). Wait at least 3 seconds after the
  page loads; faster submissions are treated as bots.
- Check the `leads` table with `npx prisma studio`. The phone is stored in E.164
  (`068 900 7252` → `+355689007252`).
- Without email/WhatsApp keys, the server log shows `[notify:email] … skipping` and
  `[notify:whatsapp] … skipping`; the lead is still saved.

## Project structure

- `app/`: routes. Service pages are five-line files rendering `components/ServicePage.tsx`.
- `app/api/lead`: the only form endpoint (validation, spam checks, save, notify).
- `components/`: shared UI (`Button`, `WhatsAppButton`, `PhoneButton`, `LeadActions`,
  `LeadForm`, `ServicePage`, `ServiceCard`, `ServiceGrid`, `Section`, `SectionHeading`, `Photo`,
  `Header`, `Footer`, `MobileStickyCta`, …).
- `lib/`: service data, site copy, photos, WhatsApp messages, phone normalisation, validation,
  rate limiting, notifications, SEO helpers, business facts.
- `prisma/schema.prisma`: `Lead` (in use); `Booking` and `ContactMessage` kept for history.

## Deploy

Target is Vercel. Set the variables from `.env.example` in the project settings and run
`npx prisma migrate deploy` against the production database before the first deploy.
