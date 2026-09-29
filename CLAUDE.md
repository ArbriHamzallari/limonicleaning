# Limoni Cleaning — Project Brief

Read this file first, every session. It's the source of truth for facts, brand, architecture, and rules. Prompts in `prompts/` are task instructions; this file is what stays true across all of them.

## What this is

Production marketing + booking website for **Limoni Cleaning**, a cleaning company in Tirana, Albania. It replaces a Claude Design prototype (a `.dc.html` export) that looked good but had no real routing, no working backend, and mostly placeholder images. This is a real, from-scratch implementation, not a port of that runtime.

## Tech stack (decided — don't relitigate these)

- **Next.js, App Router, TypeScript.** Static generation for every marketing page.
- **Tailwind CSS** for styling.
- **Route Handlers** (`app/api/booking`, `app/api/contact`) for form submissions.
- **Database**: Postgres (Vercel Postgres or Supabase — pick one and stay consistent) to persist bookings and contact messages. This is non-negotiable: nothing gets lost like it did in the prototype.
- **Email notification** (e.g. Resend) to the business on every new booking/contact — the always-works default that requires no external account setup beyond an API key.
- **WhatsApp Business API automation** is a planned future layer, not built yet (Arbri builds WhatsApp automation professionally at Codrix and will likely wire this himself). Leave one clearly commented integration point (e.g. a `notifyWhatsApp()` stub called alongside the email send). Do not fake it, and do not claim in the UI that a WhatsApp confirmation is automatic unless this is actually implemented.
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

## Services & pricing (current model — supersedes the earlier fixed-tier table)

Full extracted copy (services, FAQ, about, nav labels, portfolio categories) is in `content/source-copy.md`. Its pricing figures are superseded by this section, the rest of it (FAQ, about, services descriptions) is still current.

**Public pricing model (per m², shown on-site):**
- **Apartamente & Shtëpi**: Nga 150 ALL/m² — "Çmimi final përcaktohet në bazë të sipërfaqes, gjendjes së pronës dhe llojit të pastrimit." CTA: Kërko Ofertë.
- **Zyra**: Nga 175 ALL/m² — customized further by frequency, room/bathroom count, workload. CTA: Kërko Ofertë.
- **Vila**: Nga 200 ALL/m² — positioned as the premium/comprehensive tier. CTA: Kërko Ofertë.
- **Airbnb**: NO fixed public price. Shows "Paketa të personalizuara" and routes to WhatsApp, price is only discussed after a short conversation (property size, turnover frequency, type, requirements). CTA: Merr Ofertën / Merr Ofertën në WhatsApp. Never show a fixed Airbnb price table publicly, and never make Airbnb pricing look identical to residential cleaning, it's a distinct, faster turnover-focused service.
  - **Implemented as the two-field dynamic prefill** (`components/AirbnbWhatsAppQuote.tsx`): optional m² and turnovers/month inputs that build the WhatsApp message client-side before the link opens (see `lib/whatsapp-messages.ts`'s `airbnbQuote()`). Leaving both blank still produces a clean message with no literal blanks. Used on `/cmimet`'s Airbnb card and the `/sherbime/pastrim-airbnb` pricing section.
- **Extras**: laundry ("Lavanderi për Airbnb — 250 ALL/kg", positioned as a managed service, don't promise pickup/delivery unless actually implemented), ironing, window cleaning, others on request.

**Internal-only figures (Airbnb reference tiers by m², laundry wholesale cost, recurring partner-rate logic) live in `internal/pricing-reference.md`, not here.** Never surface those numbers, or the underlying formula, in any user-facing copy, component, or API response. See that file's own note about keeping it out of a public repo.

**Old fixed-tier table (obsolete, kept here only for history, do not use):** the original design showed flat prices per typology (1+1/2+1/3+1/4+1) for "Pastrim Standard" (3,000 to 6,000 ALL) and "Pastrim me Themel" (6,000 to 11,000 ALL). That model is replaced by the per-m² model above. The `/rezervo` booking wizard built in Prompt 01 may still reference this old structure, when touching pricing display there, bring it in line with the new model too, but per the pricing-update prompt's own scope, don't otherwise rebuild `/rezervo`.

## Site architecture (final — use these exact routes)

```
/
/sherbime
/sherbime/pastrim-airbnb
/sherbime/pastrim-apartamentesh
/sherbime/pastrim-zyrash
/sherbime/pastrim-vilash
/pronare-airbnb        (B2B: hosts / property managers, recurring + turnover contracts)
/cmimet
/rezervo               (real booking flow, backend-connected)
/puna-jone             (before/after portfolio)
/rreth-nesh
/faq
/kontakt
/blog, /blog/[slug]
/privatesia
/kushtet
```
Phase 2 (not now, don't build yet): `/tirana/[neighborhood]` pages (Blloku, Komuna e Parisit, Don Bosko, etc.), English-language version.

## Non-negotiable rules

1. **Never fabricate**: reviews, ratings, customer counts, years in business, certifications, service-area claims, awards, or "#1 in Tirana"-style superlatives. If real data doesn't exist yet, build the UI slot and leave it clearly marked for Arbri to fill in later — don't fill it with a plausible-sounding placeholder that could ship by accident.
2. **Every form must actually work.** Booking and contact submissions persist to the database and trigger an email notification. No client-side-only fake confirmations — the prototype's `Math.random()`-generated booking reference with nothing behind it is exactly what not to do.
3. Albanian copy only (unless explicitly building the future English version). Correct ë/ç and grammar, natural tone, no literal English-to-Albanian translation, no keyword stuffing.
4. Don't create thin pages for keywords alone. Every route needs real, useful content.
5. Mobile-first. Most local-service traffic will be on mobile.
6. Prefer editing and extending existing code over rewriting things that already work, once the initial build exists.

## Known issues in the prototype — fix these, don't carry them over

- Booking and contact forms don't send data anywhere; "confirmation" is a random number generated in the browser with no persistence.
- All "pages" are client-side state toggles in one file — no real routes, nothing indexable.
- 10 of roughly 12 images are empty placeholders tied to the design tool's own runtime, not real assets.
- No favicon, no `lang="sq"` attribute, no Open Graph/Twitter tags, no structured data, no sitemap.
- A floating "AI chat" widget exists in the prototype (`showAiChat`) but only has two hardcoded canned answers and one generic fallback message — it is not real AI, despite introducing itself as an assistant. Decide: cut it for launch (simplest, matches "don't overengineer"), or replace it with something genuinely functional later. Don't ship it presented as AI if it isn't one.

## Prompts

Run in order:
1. `prompts/01-initial-build.md` — scaffold the real project and implement the core site + working booking/contact backend. There is no existing codebase yet; this creates it.
2. `prompts/02-optimization-audit.md` — polish, conversion, and SEO audit pass. Run this against the real codebase produced by step 1, not against the prototype.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
