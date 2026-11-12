# Review ledger: phase2 (feat/clarity-restructure)

Reviewer: Opus substitute (not model-diverse). Stop rule: two consecutive rounds with zero newly accepted P1/P2, round 5, or a third accepted finding of one class.

## Round 1 (plan, docs/phase2-plan-2026-11.md)

Verdict: REJECT on Measured premises (hero LCP, startup video transfer, First Load JS of a layout-level client section had no rows).
Response: accepted. Baseline measured on 7b00cc7 in a separate worktree before the homepage rebuild (rows added to the plan).

| ID | Sev | Class | File | Title | Decision |
|---|---|---|---|---|---|
| F1 | P1 | privacy-consent | docs/media-triage-2026-11.md:44 | 26 Oct to 9 Nov staff footage published before consent is recorded | ACCEPT: build locally only; nothing with that media is committed or deployed until Arbri confirms consent and it is written into CLAUDE.md |
| F2 | P2 | design-cannot-work | app/not-found.tsx | usePathname cannot detect a 404, so a layout-level section renders on it | ACCEPT: BookingSection is rendered per page with an explicit preset, not from the root layout |
| F3 | P2 | build-break | plan, demo flag | useSearchParams in a layout client component without Suspense fails the production build | ACCEPT: demo flag read from window.location in an effect |
| F4 | P2 | stale-layout-state | lib/booking/requests.ts:150 | reused clientRequestId after a client-side navigation dedupes a second request into the first | ACCEPT: per-page render remounts the section; a fresh clientRequestId is minted after every success |
| F5 | P2 | preselect-biznese | lib/service-index.ts | "biznese" is not a ServiceKey; submit and availability return 400 | ACCEPT: explicit preset prop; /per-biznese passes none |
| F6 | P2 | false-claim | app/pastrim-me-themel-tirane/page.tsx:7 | deep-clean page renders ResidentialDeepCleaningLanding, not ServicePage | ACCEPT: the landing gets the three service fields and swaps its LeadForm for the shared section |
| F7 | P2 | dead-anchor | plan, Navigation | #rezervo absent on pages without the section | ACCEPT: href is /kerko-oferte?sherbimi=..., and the click jumps to #rezervo only when it exists (QuoteButton jump pattern) |
| F8 | P2 | rule-conflict | CLAUDE.md rule 2 | "Rezervoni pastrimin" while nothing is reserved | REJECT: the owner's 12 Nov brief explicitly asks for a "Book a Cleaning" button. Rule 2 bans booking reference numbers and confirmation wording ("rezervimi u konfirmua"), which stay out: the section says the date is a preference that Limoni confirms by phone or WhatsApp. The label stays an open question for Arbri. |
| F9 | P2 | rule-conflict | CLAUDE.md rule 2 | rule says every form posts to /api/lead | ACCEPT: rule 2 rewritten to cover both endpoints in the docs task, before commit |
| F10 | P2 | privacy-email | app/privatesia/page.tsx:31 | email not listed in the privacy page; no rule for where it may appear | ACCEPT: /privatesia lists email; email shown only in /admin and the owner email notification; never in the job sheet, calendar, analytics or WhatsApp notification |
| F11 | P2 | analytics-token-leak | components/Analytics.tsx | GA page_view would send /kerkesa/<token> once GA is configured | ACCEPT: Analytics does not render on /kerkesa, /flete-pune, /admin |
| F12 | P3 | catalog-version | lib/booking/catalog.ts:12 | label change without CATALOG_VERSION bump | ACCEPT |
| F13 | P3 | bounds-mismatch | app/api/kerkesa/route.ts:73 | server accepts today+180, UI stops at today+90 | ACCEPT: server bound aligned to the availability maxDate |
| F14 | P3 | honeypot-null | app/api/kerkesa/route.ts:56 | statusUrl null for bots | ACCEPT: UI handles null |
| F15 | P3 | brief-omission | public/ | untracked ad images must not be committed | ACCEPT: listed in the plan |
| F16 | P3 | demo-time-mapping | plan | demo clock times vs fixed preferredTime set | ACCEPT: demo picks map to Paradite (before 12:00) or Pasdite |

Newly accepted P1/P2 this round: 10 (F1 to F7, F9 to F11). Status: CONTINUE (round 2 after the plan revision).

## Round 2 (revised plan)

Verdict: REVISE. Measured-premises gate passed. Nothing under SETTLED re-raised.

| ID | Sev | Class | File | Title | Decision |
|---|---|---|---|---|---|
| F17 | P2 | analytics-token-leak | components/booking/BookingWizard.tsx:386 | router.push to /kerkesa/<token> keeps an already-loaded gtag running, so a history page_view carries the token | ACCEPT, and the class invariant is written (second finding of the class): `isPrivatePath()` in lib/analytics.ts; trackEvent no-ops on private paths; Analytics is not rendered on them; status links are reached by a full document load (`window.location.assign`), never a client navigation |
| F18 | P2 | silent-field-drop | app/api/kerkesa/route.ts:78 | an out-of-range preferredDate is dropped silently and the request still succeeds | ACCEPT: a supplied but invalid preferredDate returns 400 with fieldErrors.preferredDate; the section takes "today" from the API's minDate (never from static render) and returns to the date step on that error |
| F19 | P2 | consent-enforcement | lib/photos.ts, public/ | "not committed" is discipline only; code committed without the media 404s the LCP poster | ACCEPT: the pending-consent media paths go in .git/info/exclude; scripts/check-media-refs.mjs fails when a public/ file referenced from code is missing or untracked, and runs before any commit; the code and the media are committed together after consent |
| F20 | P2 | availability-request-amplification | app/api/kerkesa/disponueshmeria/route.ts:12 | one no-store availability call per page view, no rate limit | ACCEPT: fetched only when the date step is on screen, cached per service for the page session; allowRequest on the route |
| F21 | P3 | preferred-time-not-propagated | lib/booking/requests.ts:39 | snapshot and describeDate omit the preferred time | ACCEPT |
| F22 | P3 | jump-target-ambiguity | lib/jump-to-form.ts:6 | jump picks the first form anchor, not #rezervo | ACCEPT: #rezervo first; mobile bar uses the same jump |
| F23 | P3 | demo-notifies-owner | plan, demo provider | demo submits send real owner alerts in dev | ACCEPT: a demo flag in the body skips notification outside production |
| F24 | P3 | load-event-race | components/HeroReel.tsx | load listener missed after hydration; source fetched before load | ACCEPT: readyState check, no source until load and visible |
| F25 | P3 | unbudgeted-payload | plan, targets | reel bytes have no budget | ACCEPT: target added, zero reel bytes before the load event (network log) |
| F26 | P3 | request-id-entropy | components/booking/BookingWizard.tsx:62 | Math.random fallback for clientRequestId | ACCEPT: crypto.getRandomValues only |

Newly accepted P1/P2 this round: 4 (F17 to F20). Class count: analytics-token-leak 2 (invariant written). Status: CONTINUE (round 3 runs on the plan plus the implemented booking section).

## Round 3 (plan plus implemented booking section)

Verdict: REVISE. F17 re-raised with a quoted false sentence (Back button turns a status page into a client navigation), which the protocol allows.

| ID | Sev | Class | File | Title | Decision |
|---|---|---|---|---|---|
| F27 | P2 | analytics-token-leak | components/Analytics.tsx | Back from a public page into /kerkesa/<token> is a client navigation inside a gtag document | ACCEPT. Third of the class, so the invariant was rewritten instead of patched: gtag never runs in a document that shows a private URL. Analytics does not load in a document whose first page was private; public code never client-navigates into a private prefix, enforced by tests/private-navigation.test.ts |
| F28 | P2 | tap-target-size | components/booking/BookingSection.tsx | calendar day cells about 44px wide at 375px | ACCEPT: td padding moved inside the button, calendar bleeds to the card edge (-mx-4); 341/7 = 48.7px per cell at 375px. Measured 12 Nov 2026 (Playwright, 375x812, /pastrim-apartamentesh-tirane): 30 cells, min 48.71 x 48 px, scrollWidth 375. Below 375px the rule cannot be met inside the card |
| F29 | P3 | submit-mapping-untested | components/booking/BookingSection.tsx | slot vs preferred vs demo mapping untested | ACCEPT: dateFieldsFor in lib/booking/preferred-time.ts, four cases tested |
| F30 | P3 | silent-field-drop | lib/booking/requests.ts | demoted live slot drops the time; slot.date not range-checked | ACCEPT, FIXED: demote() keeps preferredTimeForClock(time) and applies isPreferredDateInRange, else slot-invalid (409) |
| F31 | P3 | wizard-error-handling | components/booking/BookingWizard.tsx | fieldErrors.preferredDate leaves /kerko-oferte on the send step | ACCEPT, FIXED: handled like 409 (date cleared, back to the date step) |
| F32 | P3 | a11y-error-announcement | components/booking/BookingSection.tsx | failed Vazhdo is silent to screen readers; month tab stop can leave the shown month | ACCEPT, FIXED: tab stop stays in the shown month; focusFirstError() focuses the first described control; grid and time fieldset reference bs-when-err |

Newly accepted P1/P2 this round: 2 (F27, F28). Class count: analytics-token-leak 3 (invariant rewritten, no fourth patch allowed). Status: CONTINUE. Round 4 runs on the full pre-commit diff.

## Round 4 (full pre-commit diff, Opus substitute)

| ID | Sev | Class | File | Finding | Decision |
|---|---|---|---|---|---|
| F33 | P3 | rule-docs-typeface | CLAUDE.md:12, :127 | "Inter is the only typeface" contradicts Barlow Condensed in DisplayHeading | ACCEPT: both lines now say Inter for everything, Barlow Condensed 800 only for display headings via DisplayHeading |
| F34 | P3 | ledger-drift-preset | components/ServicePage.tsx:167 | /per-biznese preselected "zyra", so hotel and building requests were filed as offices; F5 says "passes none" | ACCEPT: preset is undefined for "biznese"; verified /per-biznese opens on step 1 (service choice) |
| F35 | P3 | pricing-condition-unasked | components/booking/BookingSection.tsx:272 | me-themel never asked the condition, so a post-renovation apartment got the 250/m² indicative total | ACCEPT: condition question shown for me-themel; verified at 375px: "Pas punimeve" gives "Përcaktohet pas vlerësimit", "Pastrohet rregullisht" at 80 m² gives 20.000 lekë të reja (vlerësim orientues) |
| F36 | P3 | media-check-coverage | scripts/check-media-refs.mjs:9 | concatenated paths escape the gate | ACCEPT (document): header states the limit; template literals with ${...} fail as missing, concatenation is not seen; keep paths literal |

Also fixed outside the review: the owner email listed the time of day twice (describeDate already appends it); the separate "Koha e preferuar" row is removed.

Newly accepted P1/P2 this round: 0. Consecutive zero rounds: 1. Status: CONTINUE (round 5 is the cap and the last round).

## Round 5 (full pre-commit diff, Opus substitute, the cap)

Reviewer verdict: no findings above P3. F1 to F36 not re-raised. tsc exit 0; npm test 105 passed, 15 skipped.

- **F37 P3 rate-limit-scope** `app/api/kerkesa/disponueshmeria/route.ts:15`: the per-IP limit ran before the static "preferred" answers, so visitors behind a shared carrier IP could get 429 while holds are off. ACCEPT. Fix: the limiter now runs after the `holdBlocker` / `isCalendarConfigured` returns and guards only the Google Calendar and database path.
- **F38 P3 unverified-claim** `app/page.tsx:170`, `app/page.tsx:62`: "pa ndryshime" is untrue (the before/after pair was aligned and cropped, `docs/limoni-asset-audit.md:56`), and "nga punët tona në Tiranë" is narrower than the service area and unverified for every pictured job. ACCEPT. Fix: "Pamje nga punët tona, pa filtra." and "Fotot dhe videot në faqe janë nga punët tona, jo foto stoku."
- **F39 P3 dedupe-retry-edge** `components/booking/BookingSection.tsx:322-390`: after a client timeout on a request the server saved, an edited retry reused the same clientRequestId and the server returned the original, dropping the edits. ACCEPT. Fix: the section fingerprints the content of each attempt; a retry with changed content gets a new clientRequestId, an unchanged retry replays. Retry copy now reads "e njëjta kërkesa nuk krijohet dy herë". Not applied to `components/booking/BookingWizard.tsx`: its uploads are claimed by the first saved request (`lib/booking/requests.ts:232-238`), so a new id on an edited retry would fail with MediaClaimError; the wizard stays replay-only and its copy is accurate for that.
- **F40 P3 validation-drift** `components/booking/BookingSection.tsx:303`: client email regex looser than the server's `z.email`. REJECT: zod is not in the client bundle; importing it for one check costs more than the rare round trip, and the server's `fieldErrors.email` already returns the visitor to step 2 with the message.

Newly accepted P1/P2 this round: 0. Consecutive zero rounds: 2. Status: STOP (two consecutive zero rounds, and round 5 is the cap). No open findings.

## Delta review (13 Nov 2026, Opus substitute, new scope after the STOP)

Scope: the rotating homepage heading (`components/RotatingWords.tsx`, the `HeroReel` pause event, the hero h1) and the P3 follow-ups from the 12 Nov answers (hotel housekeeping-only copy, carpets in the divane catalog). Not a sixth round of the phase 2 diff.

- **F41 P2 wcag-pause-gap** `components/RotatingWords.tsx:28`: with Save-Data on and reduced motion off, the reel shows no pause button but the heading rotated indefinitely (WCAG 2.2.2). ACCEPT (also found in Claude's own review). Fix: `lib/motion.ts` `motionAllowed()` shared by both components; the heading is still whenever the reel is off.
- **F42 P3 pause-label-scope** `components/HeroReel.tsx:109`: "Ndalo videon" also stops the heading. REJECT: the label is accurate for the control it sits on; the heading is aria-hidden and stops together with it.
- **F43 P3 static-motion-pref** `components/RotatingWords.tsx:9`: a mid-session change to reduced motion is not picked up. REJECT: same accepted pattern as `HeroReel`; a reload applies it.
- **F44 P3 nowrap-width-headroom** `components/RotatingWords.tsx:59`: about 10px of headroom at 320px. ACCEPT. Fix: prop comment caps new phrases at the length of "shtëpinë tuaj".
- **F45 P3 textcontent-duplication** `app/page.tsx:104`: textContent runs the sr-only sentence into the phrases. ACCEPT (partial). Fix: the sr-only sentence ends with ". " so text extractors get a sentence boundary.
- **F46 P3 carpet-material-choices** `lib/booking/catalog.ts:450`: a carpet-only request with material "nuk-e-di" got an extraction clarify line. ACCEPT. Fix: the line only applies when extraction items are picked (or nothing is); CATALOG_VERSION 2026-11-12.4.
- **F47 P3 test-gap** `tests/booking-catalog.test.ts`: no clamp test for carpets. ACCEPT. Fix: `validateAnswers("divane", { carpets: 99 })` clamps to 10; carpet-only "nuk-e-di" has no extraction clarify.

Newly accepted P1/P2: 1 (F41, fixed). The remaining findings are P3, so no further round.

### Delta round 2 (Opus substitute)

Reviewer verdict: F41, F44 to F47 fixes correct; no findings above P3. SSR snapshots static on both components, no import cycle, the `extraction` gate correct in all four cases.

- **F48 P3 heading-reel-desync** `components/HeroReel.tsx:41`: when autoplay is refused (iOS Low Power Mode) the reel shows its poster and "Luaj videon" while the heading kept rotating. ACCEPT. Fix: the `play()` rejection announces `paused: true`, so the heading stops until the visitor presses play.
- **F49 P3 orphan-comment** `components/HeroReel.tsx:9`: the server-snapshot comment had lost its anchor. ACCEPT. Fix: moved onto the `useSyncExternalStore` call; the dispatch lives in `announceMotion()`.

Newly accepted P1/P2: 0. Remaining findings P3 and fixed. Review closed for this delta. Checked in a visible browser on a production build: rotates, holds for 5 s when the reel is paused, resumes on play.
