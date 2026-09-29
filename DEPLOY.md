# Deploying limonicleaning.com

> **Current setup (29 Sep 2026):** the domain's nameservers point to **Vercel**
> (`ns1/ns2.vercel-dns.com`). So every DNS record, including the Hostinger email records
> (MX, SPF, DKIM, DMARC) and Resend's records, is added in **Vercel → Domains →
> limonicleaning.com → DNS Records**, not in Hostinger. Where the steps below say "Hostinger
> DNS", use Vercel DNS instead.

Order: **GitHub → database → Vercel → domain DNS at Hostinger → email sending (Resend) →
Google.** The site is hosted on Vercel. The domain and the business mailbox stay at Hostinger;
you only change a few DNS records there. **Keep Hostinger's nameservers** (don't switch them to
Vercel's): that way the Hostinger email keeps working without extra setup.

## 1. GitHub (done once)

The code is in the private repo `ArbriHamzallari/limonicleaning`. Later changes:

```bash
git add -A && git commit -m "…" && git push
```

Every push to `main` redeploys the site automatically once Vercel is connected.

## 2. Database (Postgres)

Easiest: in Vercel, open the project → **Storage** → **Create** → **Neon (Postgres)**, free plan,
region Frankfurt (closest to Tirana), and connect it to the project. It adds `DATABASE_URL` and
`DATABASE_URL_UNPOOLED` for you.

(Supabase also works: set `DATABASE_URL` to the pooled connection string and
`DATABASE_URL_UNPOOLED` to the direct one.)

The tables are created automatically on each deploy (`prisma migrate deploy` runs in the build,
see `vercel.json`).

## 3. Vercel

1. vercel.com → **Add New… → Project** → import `limonicleaning` from GitHub. Framework is
   detected as Next.js; leave the build settings alone (`vercel.json` sets the build command).
2. **Settings → Environment Variables** (Production and Preview):

   | Variable | Value |
   |---|---|
   | `NEXT_PUBLIC_SITE_URL` | `https://limonicleaning.com` |
   | `DATABASE_URL`, `DATABASE_URL_UNPOOLED` | set by Neon (step 2) |
   | `RESEND_API_KEY` | from resend.com (step 5) |
   | `EMAIL_FROM` | `Limoni Cleaning <kerkesa@limonicleaning.com>` (after step 5) |
   | `EMAIL_TO` | your Hostinger mailbox, e.g. `info@limonicleaning.com` |
   | `NEXT_PUBLIC_GA_MEASUREMENT_ID` | optional, GA4 ID |
   | `WHATSAPP_*`, `OWNER_WHATSAPP` | optional, see `.env.example` |

3. Deploy. Test on the `*.vercel.app` address first: send yourself a request from
   `/kerko-oferte` and check it arrives (Neon console or `npx prisma studio`).

## 4. Connect the domain (Vercel + Hostinger DNS)

1. Vercel → project → **Settings → Domains** → add `limonicleaning.com` and
   `www.limonicleaning.com`. Make `limonicleaning.com` the main one and let `www` redirect to it.
2. Vercel then shows the exact DNS records to create. Usually:
   - `A` record, name `@`, value `76.76.21.21` (Vercel may show a different IP; use theirs)
   - `CNAME` record, name `www`, value `cname.vercel-dns.com` (or the value Vercel shows)
3. Hostinger hPanel → **Domains → limonicleaning.com → DNS / Nameservers → DNS records**:
   - delete the existing `A` record for `@` and the `CNAME`/`A` for `www` (Hostinger's
     parking page), then add the two records above;
   - **don't touch** the `MX`, `TXT` (SPF `v=spf1 include:_spf.mail.hostinger.com ~all`),
     DKIM `CNAME`s or DMARC records. Those are your email.
4. Wait for Vercel to show both domains as **Valid** (minutes to a few hours). HTTPS is
   automatic.

## 5. Sending the lead emails (Resend)

The website sends the "new request" email through Resend, not through the Hostinger mailbox.

1. resend.com → **Domains → Add domain** → `limonicleaning.com`, region EU.
2. Resend lists 3 to 4 records (a DKIM `TXT` at `resend._domainkey`, and an `MX` + SPF `TXT` on
   the `send` subdomain). Add them in Hostinger DNS exactly as shown. They sit on subdomains,
   so they don't clash with Hostinger's email records.
3. When Resend shows **Verified**, create an API key and put it in Vercel as `RESEND_API_KEY`,
   set `EMAIL_FROM` and `EMAIL_TO`, and **redeploy** (env changes need a new deploy).

## 6. After launch

- **Google Search Console**: add `limonicleaning.com` (Domain property, verify with a `TXT`
  record in Hostinger DNS) and submit `https://limonicleaning.com/sitemap.xml`.
- **Google Business Profile**: set the website to `https://limonicleaning.com`. If you can get
  the full `maps.google.com/?cid=…` link, replace the share link in `lib/business.ts`.
- Once the mailbox address is final, put it in `lib/business.ts` (`email`): it then appears on
  `/kontakt` and in the structured data.
