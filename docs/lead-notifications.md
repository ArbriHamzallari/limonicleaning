# How a website request reaches the owner

Written 5 Nov 2026 from the code (`app/api/lead/route.ts`, `lib/notify.ts`). Nothing here was
tested against real email or WhatsApp: no external message has been sent. The controlled test
that is still needed is at the end.

## The path, step by step

1. The visitor presses **Kërko vlerësim**. The browser sends `POST /api/lead` (JSON).
2. The server checks, in order: rate limit (5 per 10 minutes per IP, in memory) → valid JSON →
   honeypot (bots get a fake "ok", nothing is saved) → field validation → 3-second fill time →
   duplicate `clientRequestId` (answers "ok" without saving again).
3. **The lead row is written to Postgres** (`leads` table). If this fails, the visitor sees
   "Kërkesa nuk u dërgua…" with WhatsApp and phone buttons, and nothing else happens.
4. Only after the row is saved does the server answer `{ ok: true }`, and the visitor sees
   "E morëm kërkesën tuaj". **This confirms storage, not that the owner was notified.**
5. After the response (Next.js `after()`), `notifyNewLead()` runs two independent channels:

   | Channel | Needs (Vercel env) | Goes to | Contains |
   |---|---|---|---|
   | Email via Resend | `RESEND_API_KEY`, `EMAIL_FROM` (verified domain), `EMAIL_TO` | `EMAIL_TO` (intended: info@limonicleaning.com) | all fields, the indicative amount labelled "jo total i konfirmuar", WhatsApp/phone buttons |
   | WhatsApp Cloud API template | `WHATSAPP_TOKEN`, `WHATSAPP_PHONE_NUMBER_ID`, `OWNER_WHATSAPP`, `WHATSAPP_TEMPLATE_NEW_LEAD` (approved, 3 variables) | the owner's number only | service, name, phone |

   A channel whose variables are missing is **skipped**, not failed. The customer never
   receives an automatic message from the site.
6. The result of both channels is written back on the same row:

   | Column | Meaning |
   |---|---|
   | `emailSentAt` | time Resend accepted the email; `NULL` = not sent |
   | `whatsappSentAt` | time the Cloud API accepted the template; `NULL` = not sent |
   | `notifyStatus` | e.g. `email:sent; whatsapp:skipped` or `email:failed (Resend: …); whatsapp:sent` |

   "Accepted by the provider" is not the same as "read by the owner": a Resend-accepted email
   can still land in spam, and Meta can accept a template and fail to deliver it later.

## What happens when a notification fails

- The lead is **already saved**; the visitor already saw the success message.
- There is **no automatic retry** and no alert about the failure itself.
- The server log (Vercel → project → Logs) gets one line:
  `[notify] email failed for lead <id>: <provider message>` (no customer data in it).
- If even the write-back fails (database briefly unavailable), the log says
  `[notify] could not record the notification result for lead <id>` and the three columns stay
  `NULL`.
- If the serverless function is cut off before `after()` finishes, neither the alert nor the
  write-back happens; the columns stay `NULL`.

## How the owner finds a lead that wasn't notified

Open the database (Neon console SQL editor, or `npx prisma studio` with the production
`DATABASE_URL` on a trusted computer) and run:

```sql
SELECT id, "createdAt", service, name, phone, "notifyStatus"
FROM leads
WHERE "emailSentAt" IS NULL
  AND "whatsappSentAt" IS NULL
  AND "createdAt" >= '<date this release went live>'
ORDER BY "createdAt" DESC;
```

The date filter matters: leads saved before this release have no notification columns filled
in, even if their email went out.

Suggested habit until a retry exists: check this query once a day, and every time a customer
says "I filled in the form".

## Controlled delivery test still required (not done)

Needs Arbri's explicit go-ahead, because it sends a real email and a real WhatsApp template.

1. Confirm in Vercel → Settings → Environment Variables which of the variables above exist for
   **Production** (names only; values aren't needed). Unknown from the repository.
2. After deploying, submit one request on `https://limonicleaning.com/kerko-oferte` with the
   name `TEST Limoni` and the owner's own phone number.
3. Check: the email arrives at `EMAIL_TO` (and not in spam); the WhatsApp template arrives at
   `OWNER_WHATSAPP` if configured; the row shows `emailSentAt`/`whatsappSentAt` and
   `notifyStatus`.
4. Delete the test row (`DELETE FROM leads WHERE name = 'TEST Limoni';`).
5. Optional failure drill on a Preview deployment with its own database: set a wrong
   `RESEND_API_KEY`, submit once, confirm the visitor still sees success, the row exists and
   `notifyStatus` says `email:failed (…)`.
