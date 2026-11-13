# Clarity audit, November 2026 (prompt 08, Phase 1)

Date: 12 Nov 2026. Scope: review only, no code changed. Phase 2 waits for Arbri's approval.

## How to read this

Two versions of the site exist and they differ a lot, so every finding says which one it comes from.

| Version | What it is | Commit |
|---|---|---|
| **live** | limonicleaning.com as served on 12 Nov 2026 (Vercel cache age 574293 s, about 6.6 days) | `main` @ `2268558` (Merge PR #7) |
| **local** | production build (`next build && next start`, port 3100) of the open branch | `feat/assessment-pricing-mobile-bar` @ `7b00cc7` |

`git diff --stat main..7b00cc7`: 52 files, +5198, -318. Most of the pricing, service-area and free-visit fixes exist only in **local**; they reach the live site when this branch is merged.

File and line citations point at **local** (`7b00cc7`) unless written `main:path:line`.

Screenshots (full page, 390x844 and 1440x900, Chrome via Playwright) are in [`research/2026-11-clarity/`](research/2026-11-clarity/):

- `live-<page>-<width>.jpg`, `local-<page>-<width>.jpg` for 13 routes (home, sherbime, the 9 services, per-biznese, kerko-oferte).
- `comp-beeclean-*.jpg`, `comp-blitz-*.jpg`: the two reference sites.
- First-screen contact sheets at 390, one tile per route in the order home, sherbime, apartamente, me-themel, vila, pas-ndertimit, divane, airbnb, zyra, ambiente, hotele, per-biznese, kerko-oferte: [live](research/2026-11-clarity/folds-live-390.jpg), [local](research/2026-11-clarity/folds-local-390.jpg), [competitors](research/2026-11-clarity/folds-competitors-390.jpg).
- Mockup: [`mockup-blitz-limoni.html`](research/2026-11-clarity/mockup-blitz-limoni.html) and its renders (section 6).

Measurements behind the numbers below (12 Nov 2026): Playwright `innerText` and `ariaSnapshot()` per page, visible `a`/`button` counts, `scrollWidth - clientWidth` and tap-target heights at 390 on local, `curl -I` for the live cache age, and `git grep` / `git show main:` for source. A claim without a measurement is marked as a judgment.

---

## 1. Five-second test at 390

What a first-time visitor can tell from the first screen (844 px tall), checked against six questions: **what** we do, **for whom**, **where**, **what's included**, **price logic**, **next step**. "Yes" means it is readable above the fold without scrolling.

Every service page on both versions has the same first screen: header (logo, phone icon, Menu), breadcrumb, a small service label, H1, one or two lines of intro, a yellow button and an outline WhatsApp button. The hero photo starts below the buttons and is cut by the fold, so **no service page shows a real photo on its first screen at 390** (contact sheets above). Local adds the sticky bar (WhatsApp, Kërko ofertë, Telefono) at the bottom.

| Page | What | For whom | Where | Included | Price logic | Next step | Notes |
|---|---|---|---|---|---|---|---|
| Home (live) | Yes, but three overlapping terms: "pastrim me themel, pastrim gjeneral dhe mirëmbajtje e rregullt" | Yes ("biznese dhe shtëpi") | Tiranë only | No | No | Yes (offer, WhatsApp, "Shikoni punën tonë") | No photo above the fold. |
| Home (local) | Same three terms (`app/page.tsx:75`) | Yes | Yes ("Tiranë dhe zonat përreth") | No | No | Yes, 2 hero buttons plus 3 sticky buttons plus 3 jump links | First screen carries **6 conversion actions** plus 3 in-page links. |
| /sherbime | Yes, a list | Partly (three groups named) | Tiranë | No | No | "Shikoni shërbimin" per row | First row repeats its own name twice in `innerText` (card title plus link text). |
| Apartamente | Yes | Yes | Tiranë | Partly ("kuzhinën, banjën, dhomat dhe dyshemetë") | No | Yes | H1 "Pastrim gjeneral dhe i rregullt" uses two terms for one thing. |
| Me themel (live) | Yes | Partly | Tiranë | Partly | "Çmimi përcaktohet sipas gjendjes" | Yes | No 250 rate. |
| Me themel (local) | Yes | Yes (apartamente) | Tiranë | Yes, sofa and mattresses named | **Yes**: "Apartamente: nga 250 lekë të reja/m²" plus the 80 m² example | "Kërko vlerësim" | The only page that answers all six on the first screen. |
| Vila | Yes | Yes | Tiranë | Partly (floors, rooms, windows) | "Fillojmë me një vlerësim" | Yes | Live hero copy is fine; the free-visit line sits lower (section 2). |
| Pas ndërtimit | Yes | Partly | Tiranë | Partly (dust, glass, rails) | No | Yes | Name differs from the home link (section 2). |
| Divane | Yes, very concrete | Yes ("shtëpinë ose zyrën") | No | Yes (types listed) | Live: "1–3 foto dhe ju japim ofertën"; local: photos optional | Yes | Strongest service intro on the site. |
| Airbnb | Yes | Implied (hosts) | Tiranë | Yes (clean, sheets when available) | No | Yes | Good. |
| Zyra | Yes | Yes (SMEs) | Tiranë | No | No | Yes | No hero image at any width (`lib/services.ts:488` has no `hero`). |
| Ambiente | Yes | Yes (administrator, residents) | Tiranë | Partly | No | Yes | Good. |
| Hotele | Yes | Yes | Tiranë | Partly | No | Yes | Thinnest page below the fold (section 3). |
| Për biznese | Yes | Yes (offices, shops, hotels, buildings) | Tiranë | Starts "Kë ndihmojmë" list | No | "Merrni ofertë për biznesin tuaj" | No hero image. |
| /kerko-oferte (local) | Yes | n/a | n/a | n/a | No | "Hapi 1 nga 6" | Wizard starts on the first screen, fine. |

**Verdict.** "What" and "next step" pass everywhere. "Where" passes only in local. "Price logic" passes only on local me-themel. "What's included" is partial on most pages. The biggest first-screen gap is not copy, it is the missing photo: at 390 the visitor sees text and buttons and has to scroll to see a real job.

---

## 2. The ten findings from the brief

| # | Finding | Verdict | Version | Cause |
|---|---|---|---|---|
| 1 | Services listed 3 times on the homepage, plus /sherbime | **Confirmed** (4 times, counting the footer) | both | see below |
| 2 | Business page reached by 4 differently named links | **Confirmed** (5 names) | both | see below |
| 3 | Post-construction under two names | **Confirmed** | both | `app/page.tsx:40` vs `lib/service-index.ts:59` |
| 4 | Regular and "me themel" never clearly told apart | **Rejected as written, confirmed in spirit** | both | see below |
| 5 | Live site mentions a free visit | **Confirmed live, fixed in local** | live | see below |
| 6 | About 15 conversion actions on the homepage | **Confirmed**: 12 live, 13 local at 390 | both | see below |
| 7 | Two quote paths | **Confirmed** | local (live has one) | see below |
| 8 | Screen-reader artifacts | **Rejected for assistive tech, confirmed in raw text** | both | see below |
| 9 | FAQ answers price with "varet" only, 250 not shown | **Confirmed live, fixed in local** (with a remaining gap) | live | see below |
| 10 | Experience and area lines repeat in adjacent sections | **Confirmed** for experience; area only in local | both | see below |

### 1. Services listed repeatedly on the homepage

Confirmed on both versions. On local the same nine services appear as:

1. The hero intro names three kinds of cleaning: `app/page.tsx:75`.
2. The two "doors" lists ("Për shtëpinë" / "Për biznesin"): `app/page.tsx:31-56`, rendered at `app/page.tsx:79-95` (jump links) and again as full sections.
3. The dark business section H2 and checklist: "Zyra, dyqane dhe pallate" at `app/page.tsx:165-195`, which repeats the "Për biznesin" door.
4. The footer services list (all nine): `components/Footer.tsx` via `footerServiceLinks` in `lib/nav.ts:17-20`.

Then /sherbime lists them a fifth time, in a third grouping ("Pastrime të veçanta", `app/sherbime/page.tsx:29`) that the homepage does not use. The trust row adds "Shtëpi, zyra dhe pallate" (`lib/content.ts:19`). Same on `main` (doors at `main:app/page.tsx:36` and `:48`).

### 2. The business page has five names

Confirmed on both. All of these link to `/per-biznese`:

| Label | Where |
|---|---|
| "Për biznese" | header nav `lib/nav.ts:12`, footer `lib/nav.ts:23`, breadcrumb, "Mund t'ju interesojë edhe" rows via `pageLink` `lib/services.ts:785` |
| "Mirëmbajtje e rregullt" | homepage door `app/page.tsx:53` (`main:app/page.tsx:48`) |
| "Pastrimi për biznese" | homepage business section `app/page.tsx:190-192` and /sherbime `app/sherbime/page.tsx:27` |
| "Shikoni shërbimin tonë të pastrimit për biznese." | zyra page note `lib/services.ts:524` |
| "Merrni ofertë për biznesin tuaj" (CTA, goes to the quote flow, not the page) | `lib/nav.ts:5` |

"Mirëmbajtje e rregullt" is the worst of these: the hero uses the same words for a kind of cleaning (`app/page.tsx:75`), so a home visitor reads it as their own option and lands on a business page.

### 3. Post-construction has two names

Confirmed on both. Homepage door: "Pastrim pas rinovimit" (`app/page.tsx:40`, `main:app/page.tsx:36`). Everywhere else: "Pas ndërtimit ose rinovimit" (`lib/service-index.ts:59`) and H1 "Pastrim pas ndërtimit dhe rinovimit në Tiranë".

Related naming splits found on the way:
- Common areas: "Ambientet e përbashkëta" (nav, `lib/service-index.ts:71`), "Ambientet e pallatit" (form chip, `:72`), "Ambientet e pallateve" (homepage door).
- Apartments: nav "Apartamente dhe shtëpi", form chip "Pastrim gjeneral" (`lib/service-index.ts:48-49`), H1 "Pastrim gjeneral dhe i rregullt".
- Deep clean: "Pastrim me themel" everywhere, but "Pastrim i thellë" in the wizard blurb (`lib/booking/catalog.ts:76`) and the service summary (`lib/services.ts:165-166`). "Pastrim i thellë" reads as a calque of "deep cleaning".

### 4. Regular vs "me themel"

The finding as written is wrong: the distinction exists on both versions. The apartment page has a section "Pastrim i rregullt apo me themel?" (`lib/services.ts:119-125`, `main:lib/services.ts:105`) and /faq defines both (`lib/content.ts:162-171`, `main:lib/content.ts:92-99`).

But it fails in practice, for three reasons:
- It sits in the middle of one page (apartamente), and is absent from the homepage and /sherbime, which are the places a visitor chooses.
- The site uses four names for the lighter service: "pastrim gjeneral", "pastrim i rregullt", "mirëmbajtje e rregullt" and "pastrimi i përditshëm" (me-themel intro). The hero lists "pastrim gjeneral" and "mirëmbajtje e rregullt" as if they were two different things.
- In everyday Albanian "pastrim gjeneral" often means the big, thorough clean, which is what "me themel" is. This is a language judgment, not a measurement; question 3 in section 7 asks Arbri to confirm it.

### 5. Free visit

Confirmed on **live**, fixed in **local** (0 occurrences of a free visit on HEAD; the only "pa pagesë" left is the plan and written offer, which is allowed). Live text and its source on `main`:

- Homepage: "vijmë fillimisht për një vizitë pa pagesë" (`main:app/page.tsx:142`).
- Vila: "Për vilat, vijmë fillimisht për një vizitë pa pagesë" (`main:lib/services.ts:192`).
- Ambiente: step titled "Vizitë pa pagesë" (`main:lib/services.ts:496`), meta description "Vizita për vlerësim është pa pagesë" (`:462`), FAQ "Jo, vizita për vlerësim është pa pagesë" (`:518`).
- Për biznese: step "Vizitë pa pagesë" (`main:lib/services.ts:616`), FAQ "Jo. Vizita para ofertës është pa pagesë." (`:646`).
- Shared: `freeVisitLine` (`main:lib/content.ts:24`), quote step (`:45`), FAQ (`:73`).

The withdrawal on 5 Nov 2026 is therefore not public yet. **This is the one finding with a business risk today**: until the branch merges, the live site promises something Arbri has not confirmed.

### 6. Conversion actions on the homepage

Counted at 390 as distinct visible buttons or links that start contact or a quote:

- **Live: 12.** Header phone, hero "Merrni ofertën tuaj" and WhatsApp, business-section CTA and WhatsApp, closer "Na shkruani në WhatsApp" and "068 900 7252", form submit "Dërgo kërkesën", footer "Na lini numrin" and the phone, sticky WhatsApp and Telefononi.
- **Local: 13.** Same, plus the sticky "Kërko ofertë"; the submit reads "Kërko vlerësim".
- Desktop adds the header "Merrni ofertën tuaj" button.
- All visible `a`/`button`: live 51 (25 inside `main`), local 55 (28 inside `main`).

The problem is less the total than the first screen: local shows **6 conversion actions** at once (header phone, two hero buttons, three sticky buttons) plus three jump links. The phone appears twice on that screen (header icon and sticky "Telefono"). The quote action has five labels across the site: "Merrni ofertën tuaj", "Kërko ofertë", "Kërko vlerësim", "Na lini numrin", "Dërgo kërkesën".

Small code note: `components/MobileStickyCta.tsx:19-20` says the yellow button scrolls to the page's form; the code links to `/kerko-oferte` instead. CLAUDE.md describes the scroll behaviour. One of the two is wrong.

### 7. Two quote paths

Confirmed on local. Two forms, two APIs, two database models:

| Entry | Form | API | Saved as |
|---|---|---|---|
| Header button, hero button, sticky "Kërko ofertë", mobile menu, footer "Na lini numrin" | `BookingWizard`, 6 steps, `/kerko-oferte` (`app/kerko-oferte/page.tsx:61`) | `/api/kerkesa/*` | `ServiceRequest` |
| Closer form at the bottom of every service page and the homepage | `LeadForm` in `components/Closer.tsx:85` | `/api/lead` | `Lead` |

So a visitor who taps the yellow hero button gets a 6-step wizard, and one who scrolls to the end gets a short form, and the two produce different records in different admin views. Live has only `LeadForm`.

Documentation drift found here: CLAUDE.md rule 2 says every submission goes through `POST /api/lead`, but the wizard posts to `/api/kerkesa`. The booking-system section of CLAUDE.md describes the wizard correctly; rule 2 was never updated.

### 8. Screen-reader artifacts

Rejected for real assistive technology, on both versions. `ariaSnapshot()` (the accessibility tree a screen reader uses) shows:
- "Na tregoni çfarë ju duhet" without the number, because the number span is `aria-hidden` (`app/page.tsx:259-261`).
- No honeypot field: the wrapper is `aria-hidden` (`components/LeadForm.tsx:771-782`).
- No `.mp4` path: videos carry an `aria-label` (`components/PortfolioVideo.tsx`, `components/WorkLoop.tsx`).

They do exist in raw `innerText`, which is what copy-paste, reader modes and some crawlers see:
- "1Na tregoni" (no space after the hidden number span).
- "Mos e plotësoni këtë fushë" (`components/LeadForm.tsx:771-782`) and "Mos e plotësoni" (`components/booking/BookingWizard.tsx:770`), because the honeypot is moved off-screen rather than `display:none`.
- The `.mp4` paths appear only in the RSC payload and JSON-LD, not in visible text.

Severity P3 (hygiene). Worth fixing in Phase 2 because it is cheap, not because users hit it.

### 9. Price in the FAQ

Confirmed on **live**: the number 250 appears 0 times on every live page; the homepage FAQ answers "Sa kushton?" with the generic `priceAnswer` ("Çmimi varet nga madhësia dhe gjendja...").

Fixed on **local**: 250 appears on home (2), /sherbime (1), apartamente (1), me-themel (3). The homepage FAQ uses `faqPrice` (`lib/content.ts:63-66`) with the rate and the 80 m² example.

Remaining gap on local: airbnb, zyra, hotele, vila and per-biznese answer price with the bare `priceAnswer` (`lib/services.ts:16`, used at `:248`, `:460`, `:537`, `:654`, `:761`). That is correct, since the rate is apartments only, but a visitor who saw "nga 250 lekë/m²" on the homepage is not told why their service has no number. One sentence fixes it ("Çmimi për m² vlen vetëm për pastrimin me themel të apartamenteve...").

### 10. Repeated lines in adjacent sections

Experience: confirmed on both. The hero says "Anëtarët e ekipit kanë mbi 10 vjet përvojë në pastrim" (`app/page.tsx:76`) and the trust row directly below repeats it word for word (`lib/content.ts:18`, rendered at `app/page.tsx:110-118`).

Area: local only. Each service page shows the area line (`serviceAreaLine`, `lib/content.ts:23`) three times (practical block, closer area FAQ, footer). Live uses the older "Punojmë në të gjithë Tiranën dhe në zonat përreth" without Kamza and Durrës.

---

## 3. Consistency matrix (local)

Nine services plus /per-biznese, against the seven questions. "Generic" means the answer comes from shared copy that is the same on every page, not from the service.

| Page | Çfarë / për kë | Përfshin / nuk përfshin | Si funksionon | Çmimi | Foto reale | FAQ e shërbimit | Closer (form preset + WhatsApp) |
|---|---|---|---|---|---|---|---|
| Apartamente | Yes | Yes: checklist "Dhomë pas dhome" + practical "nuk përfshin" | Generic only (closer steps) | "varet" | Yes: hero + before/after pair | Yes | Yes |
| Me themel (landing) | Yes | Yes: "Çfarë përfshihet" + "Çfarë nuk përfshihet" | Yes, own section | **250/m²** + example | Yes: hero, video | Yes | Own form anchor + WhatsApp |
| Vila | Yes | "Nuk përfshin" only | **Yes**, steps "Si e organizojmë" | "varet" | Hero only | Yes | Yes |
| Pas ndërtimit | Yes | Yes: checklist "Çfarë pastrojmë pas punimeve" | Generic only | "varet", heavy work priced higher | **Strongest**: before/after pair, October block | Yes | Yes |
| Divane | Yes | Yes: "Çfarë lajmë" + "Çfarë duhet të dini" | **Yes**, "Si e bëjmë" | "varet" | Yes: extraction video | Yes | Yes |
| Airbnb | Yes | Yes: "Çfarë përfshin çdo pastrim" | **Yes**, 4 steps | "varet" | Yes: pair | Yes | Yes |
| Zyra | Yes | Yes: "Në çdo vizitë" | Generic only | "varet" + kontratë | Renovation photo only, **no hero** | Yes | Yes |
| Ambiente | Yes: "Për kë është" | Yes: "Çfarë pastrojmë" | **Yes**, 3 steps | "varet" | Yes: hero + video | Yes | Yes |
| Hotele | Yes | **No inclusions list** | Generic only | "varet" | Hero only (guest room, shared with Airbnb) | Yes | Yes |
| Për biznese | Yes: "Kë ndihmojmë" | Yes: "Çfarë pastrojmë" | **Yes**, 4 steps | "varet", "nuk aplikojmë çmimin për m²" | Yes: media block, **no hero** | Yes | Yes, custom title |

Line refs: apartamente `lib/services.ts:90-158`, me-themel `components/ResidentialDeepCleaningLanding.tsx`, vila `lib/services.ts:209-258`, pas-ndertimit `:260-323`, divane `:325-398`, airbnb `:400-486`, zyra `:488-547`, ambiente `:549-624`, hotele `:626-665`, per-biznese `:676-770`. Closer steps `lib/content.ts:29-36`, rendered at `components/Closer.tsx:64-78`.

Gaps, in the order I'd fix them:
1. **Hotele**: no inclusions, no service steps, no photo of its own. It is the only page I'd call thin under rule 4.
2. **Zyra and per-biznese**: no hero image, so the business door is the only one with a text-only first screen even at 1440.
3. **Apartamente, pas-ndertimit, zyra, hotele**: no service-specific "si funksionon"; they rely on the generic closer steps.
4. **Every page except me-themel**: the price answer does not say why there is no number (finding 9).
5. **Every page**: the closer H2 is the same sentence ("Keni një pronë apo ambient pune për të pastruar?", `components/Closer.tsx:30`). It reads as boilerplate the third time a visitor sees it.

---

## 4. Proposed structure

Rule used throughout: each piece of content appears once; at most three conversion actions on any 390 x 844 screen; slugs and redirects stay as they are.

### 4.1 Homepage wireframe at 390

```
┌──────────────────────────────┐
│ [logo]          [tel]  [Menu]│  header (1 action: phone icon)
├──────────────────────────────┤
│ HERO: real photo, flat dark  │
│ overlay (no gradient)        │
│ H1 one line: what + where    │
│ one line: who + one proof    │
│ [Merrni ofertën tuaj]        │  2 actions
│ [WhatsApp]                   │
├──────────────────────────────┤  sticky bar appears only after
│                              │  the hero leaves the screen
│ SERVICE PICKER               │
│ Për shtëpinë                 │  5 rows: name + one line
│ Për biznesin                 │  4 rows + "kontratë" line
│ (links, not buttons)         │
├──────────────────────────────┤
│ PROOF                        │
│ before/after, 2 real photos, │
│ "50+ prona", "mbi 10 vjet    │
│ përvojë" (said here only)    │
│ silent work clip (existing)  │
├──────────────────────────────┤
│ SI FUNKSIONON (4 steps)      │
├──────────────────────────────┤
│ ÇMIMI                        │
│ apartament me themel: nga    │
│ 250 lekë të reja/m², 80 m²   │
│ example; everything else     │
│ after assessment, and why    │
├──────────────────────────────┤
│ CLOSER: form + WhatsApp,     │
│ FAQ (4)                      │
└──────────────────────────────┘
```

What changes against local:
- The dark business section (`app/page.tsx:165-195`) is removed; its content becomes the "Për biznesin" group of the picker. One business link label everywhere: "Për biznese".
- The hero intro stops listing kinds of cleaning (the picker does that) and the trust row stops repeating the hero.
- Jump links in the hero (`app/page.tsx:79-95`) go; the picker sits directly below.
- `MobileStickyCta` stays hidden until the hero has scrolled away, so the first screen has 3 actions (phone icon, two hero buttons). Today it has 6.
- The founder video slot stays `null`.

### 4.2 Service picker, two groups

| Për shtëpinë | Për biznesin |
|---|---|
| Pastrim i rregullt (apartamente dhe shtëpi) | Zyra dhe dyqane |
| Pastrim me themel | Ambientet e pallatit |
| Vila | Hotele dhe apart-hotele |
| Pas ndërtimit ose rinovimit | Airbnb dhe qira ditore |
| Larje divanesh dhe dyshekësh | |

**Airbnb goes under business.** The buyer runs a rental business: cleaning is per check-out, often for several properties ("Për një pronë apo për disa prona", `lib/services.ts`), and the Prago link sits on this page. A host does not think of a guest flat as "my home". Today `/sherbime` files it under "Për shtëpinë" (`app/sherbime/page.tsx:23`) and `lib/nav.ts:9` says it is reached through Shërbimet; both change.

**Sofa and mattress washing stays under home.** Most of what it washes (divane, kënde, dyshekë) is household furniture, and it is bundled into apartment deep cleaning. Offices also use it ("në shtëpinë ose zyrën tuaj"), so the business page's "Çfarë pastrojmë" list names it once and links to it; it is not listed twice in the picker.

**Pas ndërtimit stays under home** because all of its real media is apartments; the office page already links to it ("Edhe pas rinovimit"). The third /sherbime group "Pastrime të veçanta" goes away.

### 4.3 /sherbime with "Cilin shërbim më duhet?"

A short situation list above the two groups. Each line is a situation in the visitor's words and the service it points to. Draft copy (Albanian, checked in section 6.4):

| Situata | Shërbimi |
|---|---|
| Dua që shtëpia të mbahet e pastër çdo javë ose çdo muaj | Pastrim i rregullt |
| Shtëpia nuk është pastruar mirë prej kohësh, ose po hyj në një banesë | Pastrim me themel |
| Sapo mbaruan punimet në shtëpi ose në zyrë | Pas ndërtimit ose rinovimit |
| Kam divan, kolltuqe ose dyshekë me njolla | Larje divanesh dhe dyshekësh |
| Kam një apartament me qira ditore | Airbnb |
| Kam zyrë ose dyqan | Zyra |
| Administroj një pallat ose kompleks | Ambientet e pallatit |
| Kam hotel ose apart-hotel | Hotele |

Under it, a two-column comparison of the two services people confuse, using only confirmed copy from `lib/content.ts:162-171` and `lib/services.ts:119-125`:

| | Pastrim i rregullt | Pastrim me themel |
|---|---|---|
| Sa shpesh | Çdo javë ose çdo muaj | Një ose dy herë në vit, ose para se të hyni në një banesë |
| Çfarë përfshin | Pluhuri, sipërfaqet, pasqyrat, dyshemetë, kuzhina, banja, koshat | Gjithçka nga pastrimi i rregullt, plus brenda dollapëve, frigoriferit dhe furrës, dyert, bazamentet, kornizat |
| Divani dhe dyshekët | Nuk përfshihen | Përfshihen në apartamente |
| Çmimi | Pas vlerësimit | Apartamente: nga 250 lekë të reja/m², vlerësim orientues |

### 4.4 Labels (slugs stay)

"Puna jonë" (header nav, `lib/nav.ts:13`). "Puna jonë" can also mean "how we work". The page is photos and videos of real jobs.
1. **Foto nga puna** (recommended): says exactly what is behind the link.
2. Para dhe pas: concrete, but the page is more than before/after pairs.
3. Foto dhe video.

"Pastrim me themel". The term is right (it is what people search and say); the problem is the competing names around it (finding 4). Options:
1. **Keep "Pastrim me themel"** (recommended) and retire "Pastrim i thellë" (`lib/booking/catalog.ts:76`, `lib/services.ts:165-166`). Add a five-word definition wherever it appears in a list, for example "Pastrim me themel: çdo cep, edhe brenda dollapëve".
2. Pastrim i plotë.
3. Pastrim i madh i shtëpisë (colloquial, but long for nav).

For the lighter service, pick one name and use it everywhere: **"Pastrim i rregullt"** (recommended, matches the existing FAQ) instead of "Pastrim gjeneral", "Mirëmbajtje e rregullt" and "Pastrim gjeneral dhe i rregullt". This touches `lib/service-index.ts:49`, `app/page.tsx:75`, the apartamente H1 and the wizard catalog.

### 4.5 Quote paths

Both pipelines keep working; Phase 2 changes labels and links only, never `/api/lead` or `/api/kerkesa/*`.

**Recommended (option A): one quote path, one quick callback.**
- Every "offer" button (header, hero, sticky, mobile menu, footer) keeps going to `/kerko-oferte?sherbimi=<key>` (the wizard), with one label: "Merrni ofertën tuaj". The deep-clean page keeps "Kërko vlerësim" per CLAUDE.md.
- The closer `LeadForm` stays on every page but is reframed as the quick option: "Preferoni t'ju telefonojmë?" with service preselected, name and phone. Its submit becomes "Më telefononi". It still writes a `Lead` and notifies. Visitors then see one offer flow and one callback form, not two offer forms.
- Footer "Na lini numrin" points to the closer form anchor on the current page, or to /kontakt, instead of the wizard.
- Fix CLAUDE.md rule 2 to name both endpoints.

Option B (not recommended for Phase 2): embed the wizard in the closer and retire `LeadForm` from service pages. One path, but it changes which pipeline service-page leads use and needs a migration plan for the Lead admin view. Too much for a clarity pass.

Any page merge happens by `permanentRedirect` in `next.config.ts`; none is proposed in this phase.

---

## 5. Social readiness

Today `lib/business.ts:18-19` has `instagramUrl` and `facebookUrl` set to `null`; `lib/seo.tsx:52` already builds `sameAs` from them plus the Maps URL, so filling a handle there is the whole JSON-LD change. Nothing links to social today, and nothing should until an account exists.

**Link-in-bio target.** Use the homepage, not /kerko-oferte: someone arriving from a reel wants to see work and prices first.
- Instagram bio: `https://limonicleaning.com/?utm_source=instagram&utm_campaign=bio`
- Per-post links (stories, pinned): `?utm_source=instagram&utm_campaign=<post-slug>`, for example `utm_campaign=divan-ekstraktim`.

`components/AttributionCapture.tsx` calls `captureAttribution()` (`lib/attribution.ts:19-33`) on every route change. It keeps the first `utm_source` and `utm_campaign` seen in the tab, in `sessionStorage`, and drops anything that is not `[A-Za-z0-9._-]{1,60}` or looks like a phone number (`lib/attribution.ts:12-16`). So the values above survive the tag filter, and a visitor who lands from the bio, reads two pages and submits still records `instagram / bio`. Not verified: whether the wizard (`/api/kerkesa`) records attribution the way `LeadForm` does. Checking that is a Phase 2 task.

**Real media that works as posts** (all with publication consent per CLAUDE.md):
- Sofa extraction and the dirty-water clip (`/videos/larje-divani-me-ekstraktim.mp4`, `/videos/uji-i-ndotur-pas-larjes-se-divanit.mp4`). The water clip is the strongest hook on the site.
- New-apartment before/after (`apartament-pas-ndertimit-para-pastrimit.jpg` vs `xhama-dhe-korniza-apartament-i-ri.jpg`), and the two-person window clean (`ekipi-pastrim-xhamash-pas-ndertimit-tirane.jpg`).
- Steam on door frame and rail (`pastrim-me-avull-korniza-dere.jpg`): a detail shot that explains "me themel" without words.
- Stair cleaning in a multi-storey building (`ekipi-pastrim-shkallesh-tirane.jpg`), for the building-administrator audience.
- Team in the bedroom clip (`/videos/ekipi-pastrim-dhome-gjumi.mp4`).
- The 24 Oct apartment and commercial-kitchen footage (IMG_3440-3443, IMG_3463-3468).

Untracked Instagram drafts already exist in `instagram/` and `public/biseda-post-04.png`; they are not part of this review and stay uncommitted.

---

## 6. Visual mockup

File: [`research/2026-11-clarity/mockup-blitz-limoni.html`](research/2026-11-clarity/mockup-blitz-limoni.html) (static, opens from disk; fonts from Google Fonts). Renders:
- [mockup-390.jpg](research/2026-11-clarity/mockup-390.jpg), [mockup-1440.jpg](research/2026-11-clarity/mockup-1440.jpg)
- Side by side with Blitz: [390](research/2026-11-clarity/mockup-vs-blitz-390.jpg), [1440](research/2026-11-clarity/mockup-vs-blitz-1440.jpg)
- Font comparison: [mockup-fonts.jpg](research/2026-11-clarity/mockup-fonts.jpg)

What it takes from Blitz (`comp-blitz-*.jpg`): a full-bleed real photo with a flat dark overlay, a condensed all-caps headline in two tones (white line, lemon line), dark solid service tiles, and a "why us" block beside a large photo. What it leaves: numerals on the why-us items, the 24/7 and "i vetëm në Shqipëri" superlatives, the location tabs, anything pink. Lemon appears only on dark green or on the darkened photo.

### 6.1 Display fonts

Rendering "PASTËRTI", "ÇDO", "SHTËPI", "PËR BIZNESIN" in each:

All five specimens in [mockup-fonts.jpg](research/2026-11-clarity/mockup-fonts.jpg) are rendered at 72 px on a 1440 px page, with real Google Fonts files (Chrome, 12 Nov 2026). Ë and Ç render with the correct glyphs in every font, with no fallback substitution.

| Font | Width at 72 px | Notes |
|---|---|---|
| Bebas Neue 400 | Narrowest: the four words fit on one line with room to spare | Closest to Blitz. Only one weight exists, so it looks lighter than the others; the diaeresis on Ë is small. |
| Oswald 700 | Widest: wraps to two lines | Heavy and wide; it needs smaller sizes on a phone to fit the same words. |
| Barlow Condensed 700 | One line | Clean, slightly lighter than 800. |
| Barlow Condensed 800 | One line | Weight closest to Blitz's headlines while staying narrow; used in the mockup. |
| Inter 800 (today's font) | Wraps to two lines | The fallback if no second typeface is approved. |

These are visual judgments from the render, not measurements. Recommendation: Barlow Condensed 800 for display headings only, Inter for everything else. This is a second typeface, which CLAUDE.md ("Inter is the only typeface") does not allow today, so it is question 9 in section 7. The site works without it: the same layout in Inter 800 is the fallback.

### 6.2 Contrast

WCAG 2.x ratios, computed with the relative-luminance formula. AA needs 4.5:1 for body text and 3:1 for large text (24 px, or 18.66 px bold).

Flat colours:

| Text | Background | Ratio | Use |
|---|---|---|---|
| White `#FFFFFF` | Green `#184A2C` | 10.22 | Pass AAA |
| White | Dark green `#0F3520` | 13.54 | Pass AAA |
| Lemon `#F5C518` | Green `#184A2C` | 6.27 | Pass AA body |
| Lemon | Dark green `#0F3520` | 8.31 | Pass AAA |
| Lemon hover `#E5B60C` | Green `#184A2C` | 5.37 | Pass AA body |
| Cream `#FEFBEA` | Green `#184A2C` | 9.83 | Pass AAA |
| Cream | Dark green `#0F3520` | 13.03 | Pass AAA |
| Text `#16241C` | Lemon `#F5C518` (buttons) | 9.88 | Pass AAA |
| Green `#184A2C` | Lemon | 6.27 | Pass AA |
| Lemon | White | **1.63** | **Fail**: the existing rule (never yellow on white) is right |
| Muted `#5B6B60` | White / `#F8F8F5` | 5.65 / 5.31 | Pass AA |

Text on a photo, measured against the **worst case**: a pure white pixel under the overlay. Any real photo pixel is darker, so these are lower bounds.

| Overlay (flat, no gradient) | White text | Lemon text |
|---|---|---|
| `#0F3520` at 60% | 3.92 (large only) | 2.40 (fail) |
| `#0F3520` at 65% | 4.53 | 2.78 (fail) |
| `#0F3520` at 70% | 5.26 | 3.23 (large only) |
| `#0F3520` at 80% | 7.28 | 4.47 (large only, just under body) |
| `#0F3520` at 82% | 7.77 | 4.77 (pass body) |
| Black at 65% | 7.00 | 4.30 (large only) |
| Black at 70% | 8.45 | 5.19 (pass body) |

The mockup uses `#0F3520` at 82% on the hero, so every text pair on the photo passes AA body even over a white wall. Lemon on the photo is used only for the display line, which is large text anyway.

### 6.3 apple-design pass (hierarchy, restraint, motion)

- One focal point per screen: the headline on the hero, the group names in the picker, the photo in "Pse Limoni".
- No motion is added. The mockup has no animation; the existing work clip keeps its rules (silent, in view only, off under reduced motion or Save-Data, visible pause).
- Hierarchy comes from size and weight: display 44-56 px on the phone, Inter 18 px body, no decorative icons, no badges, no counters.

### 6.4 Copy QA on new Albanian text

All new copy (the mockup text, the section 4.3 table, the 4.5 callback lines) went through two passes on 12 Nov 2026.

Mechanical pass (`ig-human`: `humanize.py --report` and `detect.py` on the extracted text, 64 sentences):
- 0 em dashes, 0 invisible characters, 0 curly quotes, 0 slop-lexicon hits, 0 structural tells.
- Overall score 66.7 (REVIEW). The weakest check is VOICE (41.9), which counts English contractions and pronouns; Albanian has no contractions, so this check does not apply here. Burstiness 88.9, specificity 85.1.
- The only automatic change it proposed (15 middle dots to hyphens) is in the font specimen separators, so the original was kept.

Manual pass (ë/ç, "ju" form, "përvojë", claims checked against CLAUDE.md). Changes made:
- "Me lejen e ekipit dhe të pronarëve" was removed from the why-us text. Consent is recorded only for specific clips, not for every photo, so the claim went beyond the facts.
- The common-areas situation line became a sentence in the first person ("Administroj një pallat ose kompleks"), to match the other rows.
- The vila line was shortened to "Kate, dhoma dhe xhama të mëdhenj".

Still for a native reviewer: the headline "Pastërti në çdo shtëpi dhe për biznesin" mixes "në" and "për" so that it can carry the words the brief asked for. "Pastërti për çdo shtëpi dhe biznes" reads more evenly.

---

## 7. Questions for Arbri

Every fact this review needed and could not find. Defaults in brackets stay in force until you answer.

1. **Merge timing.** The live site still promises a free visit and shows no 250 price (findings 5 and 9). Can `feat/assessment-pricing-mobile-bar` be merged before Phase 2, so the redesign starts from a truthful live site? [Not merged.]
2. **Quote paths.** Option A in 4.5: the wizard is the only offer flow, the bottom form becomes "t'ju telefonojmë". Agree? [Both stay as today.]
3. **"Pastrim gjeneral".** Do your customers use "pastrim gjeneral" for the light weekly clean, or for the big clean? [Treat it as ambiguous and use "pastrim i rregullt".]
4. **Airbnb under "Për biznesin".** OK to move it? [Stays under home on /sherbime.]
5. **Nav label.** "Foto nga puna" instead of "Puna jonë"? [Puna jonë.]
6. **Hotel page.** What is included in a hotel clean (rooms, corridors, reception, kitchen?) and is there a photo from a real hotel job with consent? [Page stays as is; it is the thinnest page.]
7. **Office and business hero.** Is there a photo from a real office or shop job with consent? [No hero image.]
8. **Regular cleaning price.** Is there any confirmed price logic for weekly or monthly home cleaning? [Priced after assessment.]
9. **Second typeface.** May display headings use Barlow Condensed (CLAUDE.md says Inter only)? [Inter only.]
10. **Social accounts.** Instagram or Facebook handle, if one is being created? [No links, `sameAs` stays Maps only.]
11. Still open from CLAUDE.md, unchanged: hours, street address, response time, re-clean guarantee, assessment visit price when it is charged.

### Answers (Arbri, 12 Nov 2026)

1. Merge: yes. The branch is PR #9; its preview build has to go green first.
2. Agreed. Implemented in Phase 2 as one booking section per page (`#rezervo`) plus the full flow at `/kerko-oferte`.
3. "Pastrim gjeneral" means a big one-off clean; "pastrim me themel" is bigger than that; "pastrim i rregullt" is maintenance. The site keeps two names, "i rregullt" and "me themel".
4. Move it. Airbnb is under "Për biznesin" on the homepage and on /sherbime.
5. Keep "Puna jonë".
6. Housekeeping only: rooms and their bathrooms between guests. Common areas, reception and kitchen are excluded. Hotel copy and the booking catalog were updated.
7. No office photo yet; Arbri will add one. The office page keeps no hero image.
8. A range per hour for weekly or monthly cleaning, depending on workload. Not published: kept in the git-ignored `internal/` folder until the unit, per cleaner or per team, and the services it covers are confirmed.
9. Barlow Condensed allowed for display headings (`components/DisplayHeading.tsx`).
10. Instagram `limonicleaning.al` and Facebook `limonicleaning.al`: linked in the footer, on /kontakt and in the JSON-LD `sameAs`.
11. Unchanged.

Also confirmed: carpet, window and façade cleaning (added to the divane page and /per-biznese, no new pages); crew size and duration depend on the apartment's area; "Rezervoni pastrimin" stays the main button.

---

## Appendix A. Impeccable critique

`⚠️ DEGRADED: single-context (session policy: no sub-agents unless the user asks)`. The critique normally runs as two isolated reviewers; here it ran inline in the same session that gathered the evidence, so it is not independent.

Surface mode: **Persuade** (marketing and lead capture). Target: local build, homepage and service pages at 390. Context: no PRODUCT.md or DESIGN.md (`impeccable context` reported `NO_PRODUCT_MD`, `EXISTING_VISUAL_SYSTEM`); CLAUDE.md's brand section stood in for both. No files were generated.

### Nielsen heuristics (0-4)

| # | Heuristic | Score | Evidence |
|---|---|---|---|
| 1 | Visibility of system status | 3 | Wizard shows "Hapi 1 nga 6"; form success shows only after the row is saved. |
| 2 | Match with the real world | 3 | Natural Albanian, real photos; loses a point on the four names for regular cleaning. |
| 3 | User control and freedom | 3 | WhatsApp and phone on every page; wizard steps can go back. |
| 4 | Consistency and standards | **1** | Five names for the business page, five labels for the quote action, two quote forms, three names for common areas. |
| 5 | Error prevention | 3 | Labels above inputs, optional fields marked, price shown only after "Apartament". |
| 6 | Recognition over recall | 2 | Services grouped three different ways (home doors, /sherbime groups, footer). |
| 7 | Flexibility and efficiency | n/a | Persuade surface. |
| 8 | Aesthetic and minimalist design | 2 | Clean visual system, but repeated lines and a 6-action first screen. |
| 9 | Error recovery | 3 | Not exercised end to end in this review; judged from source. |
| 10 | Help and documentation | n/a | Persuade surface. |
| | **Total** | **20/32** | |

### Cognitive load checklist

| Check | Result |
|---|---|
| One primary action per screen | Fail on home (local first screen: 6 actions) |
| Consistent names for the same thing | Fail (findings 2, 3, 4) |
| Choices grouped, at most about 7 per group | Pass (5 and 4) |
| Information shown once | Fail (findings 1, 10) |
| Price expectation set early | Pass on local me-themel only |
| Real proof near the decision | Partial (photos start below the fold at 390) |
| No decoration competing with content | Pass |
| Clear next step after every section | Pass |

### Personas

- **Jordan, first time, comparing two cleaning companies.** Understands "cleaning in Tirana" in two seconds. Cannot tell what "pastrim gjeneral" vs "mirëmbajtje e rregullt" means and has to open a service page to find a price, which only the deep-clean page has.
- **Casey, on a phone between errands.** Taps the yellow button expecting a short form and gets six steps. Would have finished the short form at the bottom of the page but never scrolled there. Gets two phone buttons and three WhatsApp buttons on the way.
- **Sam, screen-reader user.** The accessibility tree is clean (finding 8). Landmarks, labels and tap targets pass. The only friction is the repeated phrases and the many same-named links ("WhatsApp" appears 3 to 4 times per page with no context in the link name).

### Verdict

The visual system is coherent and honest; the problems are structural: naming, repetition and two competing quote flows. None needs new facts, only decisions (section 7).

## Appendix B. Impeccable audit

| # | Dimension | Score | Key finding |
|---|---|---|---|
| 1 | Accessibility | 3 | Contrast passes everywhere checked; repeated "WhatsApp" link names lack context (P2). |
| 2 | Performance | 3 | Judged from source only, not measured: `next/image`, lazy video, no service worker. LCP and INP were not measured in this review. |
| 3 | Theming | 3 | Tailwind tokens for every brand colour; single light theme by design. |
| 4 | Responsive | 4 | Measured on local at 390: horizontal overflow 0 px on all 13 routes; 0 tap targets under 48 px after excluding visually hidden inputs (their labels are the targets). |
| 5 | Implementation integrity | 3 | One deliberate repeated pattern (see below); otherwise coherent. |
| | **Total** | **16/20** | **Good** |

Implementation integrity: **pass**. The detector (`impeccable detect --json app components`) flagged 5 "side-tab" uses of `border-l-4`: `app/kerkesa/[token]/page.tsx:140`, `app/page.tsx:142`, `components/LeadForm.tsx:234`, `components/booking/BookingWizard.tsx:595`, `components/booking/ProposalView.tsx:51`. It missed two more of the same pattern (`components/ServicePage.tsx:259`, `app/page.tsx:251`). This is the brand's note style (lemon rule on cream), used consistently, so it is a P3 consistency note, not a defect.

Findings by severity:
- **P1**: Live free-visit promise (finding 5). Fix: merge the branch.
- **P2**: Naming splits (findings 2, 3, 4); two quote flows with different labels (finding 7); first screen with 6 actions (finding 6); hotel page thin (section 3); non-descriptive repeated "WhatsApp" link names.
- **P3**: `innerText` artifacts (finding 8); sticky-bar comment vs code mismatch; CLAUDE.md rule 2 drift; detector misses on two `border-l-4` uses.

Reports were not written to `.impeccable/` (kept this phase to `docs/`).

## Review gates

Phase 1 changed no code and commits nothing, so the pre-commit review gate (codex-review, Opus substitute) is skipped. It runs on the full diff before any Phase 2 commit.
