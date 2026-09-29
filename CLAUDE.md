# Limoni Cleaning — Project Brief

Read this file first, every session. It's the source of truth for facts, brand, architecture, and rules. Prompts in `prompts/` are task instructions; this file is what stays true across all of them.

## What this is

Production marketing and **lead-capture** website for **Limoni Cleaning**, a cleaning company in Tirana, Albania. Since prompt 03 the site is lead-first: every page explains what Limoni does, shows real work, and ends in two actions: (A) a short form (name + phone, saved to the database, emailed to the business, optionally sent to the owner's WhatsApp) or (B) a WhatsApp chat with a prefilled, service-specific message. There is no online booking and no public pricing.

## Tech stack (decided — don't relitigate these)

- **Next.js 16, App Router, TypeScript.** Static generation for every marketing page.
- **Tailwind CSS v4** for styling. Inter is the only typeface.
- **One Route Handler** (`app/api/lead`) for form submissions. `app/api/booking` and `app/api/contact` return 410.
- **Database**: Postgres via Prisma. The `Lead` model is the only table written to; the old `bookings` / `contact_messages` tables are kept for history, never dropped.
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
- Phone / WhatsApp: **+355 68 900 7252** — `https://wa.me/355689007252`
- Email: none yet.
- Social media: none yet.
- Hours: not defined — do not display specific opening hours until Arbri provides them.
- **Team experience: confirmed real, ~10+ years.** This describes the team's individual/combined backgrounds (staff hand-picked from other cleaning companies), NOT how long Limoni Cleaning itself has existed, Limoni is a new company. Always phrase this as the team's experience ("ekip me mbi 10 vjet eksperiencë"), never as the company's age or years in operation.
- **Properties cleaned: confirmed real, 50+.** Safe to use on-site as "50+ prona të pastruara."
- Reviews / ratings: still none. Do not display star ratings, review counts, or testimonials until real ones exist, this is unchanged by the two confirmed stats above.
- **Related business: Prago** (https://www.prago.al/) — Arbri's short-term rental property management company. Official partner of Limoni Cleaning (two separate companies, formal partnership, not the same legal entity).

## Services & pricing

**No prices are shown anywhere on the site.** Every service page ends in the two lead actions (`LeadActions` + inline `LeadForm`). FAQ answers about price say: "Çmimi varet nga madhësia dhe gjendja e pronës. Na lini numrin dhe ju japim ofertën." Internal pricing stays out of the repo entirely (no rate tables, no formulas, not even in comments).

Services offered (all confirmed by Arbri, including hotels and post-construction on 29 Sep 2026): apartamente dhe shtëpi, Airbnb, zyra, vila, pastrim me themel, pastrim pas ndërtimit, hotele. Service data lives in `lib/services.ts`; every service page renders through `components/ServicePage.tsx`.

WhatsApp messages come from one function, `waMessageFor(service?)` in `lib/whatsapp-messages.ts`. Don't add other presets.

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

## Open decisions (defaults in force until Arbri says otherwise)

- **Response time**: no "brenda X orësh" promise. Use "së shpejti".
- **Guarantee**: no re-clean guarantee on the site.
- **Hours, email, social, street address, Google Business Profile**: none yet, show nothing.

## Non-negotiable rules

1. **Never fabricate**: reviews, ratings, customer counts, years in business, certifications, service-area claims, awards, or "#1 in Tirana"-style superlatives. If real data doesn't exist yet, build the UI slot and leave it clearly marked for Arbri to fill in later — don't fill it with a plausible-sounding placeholder that could ship by accident.
2. **Every form must actually work.** Every submission goes through `POST /api/lead`, is saved as a `Lead` row, and triggers `notifyNewLead()`. The success state only shows after the row is saved. No booking references, no "rezervimi u konfirmua" wording: a lead is a request for an offer, not a confirmed slot.
3. Albanian copy only (unless explicitly building the future English version). Correct ë/ç and grammar, natural tone, no literal English-to-Albanian translation, no keyword stuffing.
4. Don't create thin pages for keywords alone. Every route needs real, useful content.
5. Mobile-first. Most local-service traffic will be on mobile.
6. Prefer editing and extending existing code over rewriting things that already work, once the initial build exists.

## Design rules (from prompt 03, keep them)

- Inter only; hierarchy from size and weight. No italic serif kickers, no "01/02/03" numerals, no "→" arrow links, no `✓` characters (use `components/icons.tsx` (`CheckIcon`, `CheckList`)).
- No em dashes in visible copy, `alt` or meta text.
- No empty image slots on public pages. No "Foto — …" placeholder labels.
- Body copy 18px on mobile; `text-sm` only for captions and legal text. Every tap target ≥ 48px. Never yellow text on white. Labels always above inputs.
- No carousels, autoplay, arrival popups, or fake chat widgets.

## Prompts

1. `prompts/01-initial-build.md` — initial build (done).
2. `prompts/02-optimization-audit.md` — polish/SEO audit (done).
3. `prompts/03-lead-first-refactor.md` — lead-first refactor (done 29 Sep 2026). Supersedes earlier pricing, `/rezervo` and `/cmimet` instructions.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
