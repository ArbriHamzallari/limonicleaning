# 08: Clarity and structure pass (review first, then build)

Owner: Arbri. Written 12 Nov 2026.

## The problem in one paragraph

A first-time visitor cannot tell within five seconds what Limoni does, which service fits them,
what is included and what it roughly costs. Services are listed three times on the homepage,
four different links lead to the same business page, regular cleaning and deep cleaning blur
into each other, each service page answers a different set of questions, and there are two
quote paths (the inline `LeadForm` and `/kerko-oferte`) with no explanation of the difference.
The site should feel as simple as the two references below, while keeping everything in
`CLAUDE.md` that is true and works.

## Rules before you start

1. Read `CLAUDE.md`, `SITE_OVERVIEW.md`, `docs/limoni-redesign-strategy.md`,
   `docs/website-audit.md`, `docs/limoni-copy-final.md` and `docs/booking-system.md`.
   `CLAUDE.md` wins every conflict. Every non-negotiable rule and design rule still applies.
2. Work in two phases. **Phase 1 changes no code.** Stop after Phase 1 and wait for Arbri.
3. Never invent facts to fill a gap (durations, hours, guarantees, reviews, counts, prices beyond
   the one published apartment deep-clean rate). If a section needs a fact that does not exist,
   list it as a question for Arbri.
4. All public copy is Albanian and follows the Albanian localization rules (natural, ë/ç, no
   calques, "përvojë", request vs confirmation). No em dashes anywhere.
5. Keep every URL and redirect. If you propose merging pages, merge by redirect, never by
   deleting a route that is indexed.

## Tools to use

- **Playwright MCP** (`.mcp.json`): screenshot at 390x844 and 1440x900, full page, of:
  the live site `https://limonicleaning.com` (homepage, `/sherbime`, every service page,
  `/per-biznese`, `/kerko-oferte`), `https://beeclean.al/` and `https://blitzcarwash.al/`.
  Save to `docs/research/2026-11-clarity/`. Also run the local production build
  (`npm run build && npm start`) and screenshot the same routes, because the live site may be
  behind the current branch (`feat/assessment-pricing-mobile-bar`). Say which version each
  finding comes from.
- **impeccable** (`.claude/skills/impeccable`): run its setup (`scripts/impeccable context`)
  first. Use `critique` and `audit` in Phase 1; `clarify`, `distill`, `layout`, `typeset` and
  `polish` in Phase 2. If it asks for PRODUCT.md / DESIGN.md, generate them from `CLAUDE.md`
  (brand system, tone, rules) instead of inventing a new direction. Do not let it introduce
  anything the design rules forbid (gradients, glass, badges, carousels, decorative icons).
- **apple-design** (`.claude/skills/apple-design`): for hierarchy, restraint, typography rhythm,
  tap feedback and reduced-motion. Not for adding motion: the site stays calm.
- **ig-human** (Cowork/Claude skill, if available): final pass on any new copy to remove
  machine-sounding phrasing. The Albanian QA pass is still required on top.

## What to take from the references (and what not to)

| Borrow | From | Why |
|---|---|---|
| A hero that says what, where and the next step in one glance | both | Blitz: one short headline, cities named, one phone number repeated |
| One grid of service cards with photo, one line and one link, grouped home / business | BeeClean | Visitors pick their service in one scroll |
| One quote form that lists every service, with area and frequency as dropdowns | BeeClean | Same form everywhere, preselected by page |
| Short, plain section headings that can be scanned | both | No clever headings that need reading twice |
| A plain B2B pitch: "Jeni kompani? Pastrim i rregullt me kontratë" | Blitz | Businesses see themselves immediately |
| One phone number, used consistently | Blitz | The next step is never in doubt |

**Do not copy:** counters or stats that are not real (Blitz shows "0" counters and "years in
market"), superlatives ("i vetmi në Shqipëri", "standard europian"), eco or health claims Limoni
cannot prove, client logos (none exist), opening hours or a street address (not defined),
duplicated card blocks, carousels, or "Rezervo" wording (Limoni takes requests, not bookings).

## Visual direction: Blitz's look, Limoni's brand

Arbri wants the site to look like blitzcarwash.al, in Limoni's own colors and logo. Blitz's
look (screenshots taken 12 Nov) comes from six things. Take these, not its content:

1. **Full-bleed, dark photo hero.** A real photo fills the first screen, darkened, with large
   uppercase text over it. The header is transparent on top of it.
2. **Condensed uppercase display type** (Blitz uses Bebas Neue) for H1, H2, card captions and
   small kickers. The body text is a plain sans (Poppins at Blitz).
3. **Two-tone headlines.** One line in white, the next in the accent color.
4. **Tall photo cards with a solid caption bar.** Real work photos (about 4:5), each with a
   short uppercase caption in a solid dark bar underneath. One column on phones, three on
   desktop.
5. **Split "why us" block.** Three short points on the left, one big real photo on the right.
6. **High contrast and few colors.** Black, white, a pale grey section background and one
   loud accent. A dark footer.

### Mapping to Limoni

| Blitz | Limoni |
|---|---|
| Black backgrounds, photo overlay, caption bars, footer | Dark green `#184A2C`, or `#0F3520` for overlays and the footer |
| Pink accent text and buttons | Lemon `#F5C518`, **only on dark green or on photos with a dark overlay**, never on white |
| White text over the hero | White, plus a lemon second line |
| Pale grey section background `#F5F9F9` | `#F8F8F5` |
| Bebas Neue display | A condensed display face for headings only. Inter stays for body, UI and forms. Test Bebas Neue, Oswald and Barlow Condensed (700/800) with real Albanian uppercase text ("PASTËRTI", "ÇDO", "SHTËPI", "PËR BIZNESIN"). Pick the one whose Ë/Ç look right and that loads light (`next/font`, subset latin-ext). |
| Pink "Blitz" wordmark | The existing lemon logo, unchanged |
| Hero photo of the car wash | A real Limoni photo (team at work or a finished room), with a dark green overlay strong enough for at least 4.5:1 text contrast. No stock photos, no video autoplay in the hero. |
| "Prezente në 4 qytete" | Only confirmed facts. Example direction (final copy goes through the Albanian QA): "PASTRIM PROFESIONAL" / lemon line "PËR SHTËPI DHE BIZNESE NË TIRANË" |
| Three service photo cards | The service picker: real photo per service plus a dark green caption bar. A service with no real photo gets a text card in the same grid, never an empty slot. |
| "Pse të zgjidhni Blitz?" with 1/2/3 circles | "Pse Limoni": three points, but only confirmed facts (10+ years team experience, 50+ properties, written offer). Use `CheckIcon`, not numbers. Numbers only where order is real ("Si funksionon"). |
| Locations tab panel | No addresses or hours exist. Use a simple service-area block instead: Tiranë and nearby areas, including Kamza and Durrës, transport confirmed before the offer. |
| "Jeni kompani?" strip with a big phone number | Same idea, pointing to `/per-biznese` and the phone number |
| Newsletter and social icons in the footer | Leave them out. No social account yet, no newsletter. |

### Design rules this changes (only once Arbri approves the Phase 1 mockup)

Once approved, update `CLAUDE.md` and `SITE_OVERVIEW.md` §6 to say so:

- "Inter is the only typeface" becomes Inter for body and UI, plus one condensed display face
  for headings.
- Uppercase is allowed for display headings, card captions and short kickers. It stays off
  body copy, buttons with long labels and form labels.
- More than one dark green block per page is fine. The hero, the service caption bars, the
  B2B strip and the footer can all be dark.
- A grid of three or more identical photo cards is allowed for the service picker only.

These rules stay: no carousels or autoplay (the existing `WorkLoop` exception stays as it is),
no gradients (a flat dark overlay on a photo is fine), no glass or decorative icons, no em
dashes, no yellow text on white, body text 18px on phones, tap targets at least 48px, labels
above inputs, one use of each photo per page, real media only.

## Phase 1: review (no code changes)

Write `docs/clarity-audit-2026-11.md` with the screenshots linked. It must contain:

### 1. Five-second test
For the homepage and each service page at 390px: what does a visitor understand above the fold?
What is missing (what we do, for whom, where, what's included, price logic, next step)?

### 2. Findings to verify (from a quick read of the live homepage on 12 Nov)
Confirm or reject each, with file and line where the cause lives:
- Services listed three times on the homepage (home group, business group, footer) plus
  `/sherbime`; the business page is reached from four differently named links
  ("Për biznese", "Për biznesin", "Pastrimi për biznese", "Mirëmbajtje e rregullt").
- Post-construction appears under two names ("Pastrim pas rinovimit" and
  "Pas ndërtimit ose rinovimit").
- "Apartamente dhe shtëpi" (regular) vs "Pastrim me themel" (deep): the difference is not
  clear from the cards; "me themel" is never defined in one sentence where it is first seen.
- The live homepage business section mentions a **free visit** for large sites. That
  contradicts `CLAUDE.md` (withdrawn 5 Nov). Check whether the current branch is deployed.
- About 15 conversion actions on one page (6 phone links, 4 WhatsApp, 4 quote links, one form).
- Two quote paths: inline `LeadForm` (8 fields) and `/kerko-oferte` (booking-request flow).
- Text-extraction artifacts that may also affect screen readers: step numbers rendering as
  "1 1Na tregoni", the video file path visible as text, and the honeypot label
  "Mos e plotësoni këtë fushë" being read out. Fix the accessibility cause, not just the look.
- FAQ answers the price question only with "varet"; the one real price (apartment deep clean,
  from 250 lekë të reja/m²) is not surfaced where people look for price.
- Experience claim and service-area line repeated in adjacent sections.

### 3. Service page consistency matrix
One row per service page (9 services + `/per-biznese`), one column per question below. Mark
what each page answers today, and where the answer exists only in another page.

The standard every service page must answer, in this order:
1. **Çfarë është** (one sentence, plain words) and **për kë** (who books it)
2. **Çfarë përfshin** (checklist) and **çfarë nuk përfshin** (laundry, ironing, consumables,
   building lifts, etc. per `CLAUDE.md`)
3. **Si funksionon** (3 to 4 steps, the same pattern on every page)
4. **Çmimi** (the indicative apartment rate where it applies; otherwise "çmim pas vlerësimit"
   plus what the price depends on)
5. **Foto nga puna reale** (only real media for that service; none means no slot, per rules)
6. **Pyetje të shpeshta** for that service only
7. One closer with the form preselected to the service + WhatsApp

### 4. Proposed structure
- Homepage wireframe (section list, one line each, at 390px), target: hero, service picker,
  proof (before/after + real numbers already confirmed), how it works, price logic, closer.
  Every section appears once. Target at most 3 distinct actions per screen.
- Service picker: two groups (Për shtëpinë / Për biznesin), each card = real photo, name,
  one-line "për kë", link. Decide where Airbnb and sofa/mattress sit and justify it.
- `/sherbime`: same picker plus a short "Cilin shërbim më duhet?" comparison
  (regular vs deep vs post-construction) so the overlap is explained once.
- Navigation and labels: are "Puna jonë" and "Pastrim me themel" clear enough? Offer 2 to 3
  alternatives each with reasoning; keep the slugs.
- Quote path: recommend one path (or a clear split, e.g. short form inline, full request on
  `/kerko-oferte`) and explain how `LeadForm`, `/api/lead` and `/api/kerkesa/*` fit. Do not
  break either pipeline.
- Merges: if any two services should become one page, propose it with the redirect.

### 5. Social readiness (light)
Limoni has no Instagram yet. Note what the site needs so Instagram traffic converts: a link-in-bio
target (likely `/kerko-oferte` or a service page with UTM support via `AttributionCapture`),
`sameAs` in `lib/business.ts` once the handle exists, and which real photos/videos are strong
enough to reuse as posts. Do not add social links until the account exists.

### 6. Visual mockup
Build the homepage hero, the service picker and the "Pse Limoni" block in the new look, at
390px and 1440px. Put it on a temporary route (for example `/preview/blitz-style`), set to
`noindex` and left out of the sitemap, or make it a static HTML file in
`docs/research/2026-11-clarity/`. Show it next to the Blitz screenshots, together with the
three display-font candidates rendering real Albanian headings. Report the contrast ratio for
every text-on-photo and lemon-on-green pair.

### 7. Questions for Arbri
A short numbered list of every fact the new structure needs and that does not exist yet.

**Stop here.** Show Arbri the audit, the 390px wireframe and the visual mockup. Do not start Phase 2 until he
approves or edits it.

## Phase 2: build (after approval)

1. New branch from the current one, e.g. `feat/clarity-restructure`.
2. Implement in this order, committing after each step:
   1. Accessibility and copy bugs from Phase 1 §2 (cheap, independent).
   2. Visual system: the display font via `next/font`, tokens in `app/globals.css`, and shared
      components (dark hero with overlay, photo card with caption bar, two-tone heading,
      dark strip, dark footer). Apply them site-wide so pages don't mix the old and new look.
      Delete the temporary preview route.
   3. Data: one source of truth per service in `lib/services.ts` following the standard in §3
      (add fields rather than free-form sections where every page needs the same answer).
      Update `ServicePage.tsx` to render that order.
   4. Homepage and `/sherbime` per the approved wireframe; remove the duplicate service lists.
   5. Navigation, footer and CTA consolidation (labels from `lib/nav.ts`).
   6. Quote path changes as approved.
3. Use impeccable `clarify` / `distill` / `polish` on each changed page, then a full Albanian
   QA pass on every changed string.
4. Verify and report: `npm test`, `npm run lint`, `npm run build`, `npm run check:images`;
   Playwright screenshots before vs after at 390 and 1440 for every changed route; no
   horizontal scroll, tap targets at least 48px, one H1 per page, no em dashes, no "falas"
   near "vizitë", no prices outside `lib/quote.ts` rules; Lighthouse mobile not lower than
   before. Add a dated change log to `docs/clarity-audit-2026-11.md`.
5. Do not commit the untracked images in `public/` (ChatGPT image, `biseda-post-04.png`, ad
   banners) unless Arbri asks, and never anything from `internal/`.
6. Open a PR; do not deploy. Update `CLAUDE.md` and `SITE_OVERVIEW.md` where the structure
   changed.
