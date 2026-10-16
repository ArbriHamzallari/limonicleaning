# Limoni Cleaning: competitive research (Albanian cleaning market)

Research date: **16 October 2026**. Author: Claude (Opus 5.5) for Limoni Cleaning.

## 1. Method

- **Sources reviewed:** the 8 sites in the brief, plus 5 found through searches in Albanian and
  English: "kompani pastrimi Tiranë", "pastrim me themel Tiranë", "pastrim zyrash Tiranë kompani
  pastrimi për biznese", "pastrim pas ndërtimit Tiranë", "pastrim pallatesh ambiente të
  përbashkëta Tiranë", "pastrim divanesh dysheke Tiranë", "professional cleaning services Tirana".
- **What was collected for each site:**
  1. The raw HTML: status, redirects, title, meta description, headings, structured data,
     WhatsApp/phone/form presence, page weight. Script: `scratchpad/comp/signals.py`.
  2. A desktop screenshot (1440 px wide).
  3. A mobile screenshot with real device emulation: 390×844, DPR 2, touch, iPhone user agent,
     via Chrome DevTools Protocol. A first attempt with a narrow desktop window was discarded
     because Chrome does not lay pages out below ~500 px that way.
  4. A rendered-content read of the page (sections, claims, forms, testimonials, services).
  5. Lighthouse 12, mobile, one run per site.
- **Screenshots:** in [`docs/research/screenshots/`](research/screenshots/), named
  `<site>-desktop.jpg` / `<site>-mobile.jpg`.
- **Keyword evidence:** Google autocomplete for Albania (`hl=sq&gl=al`). These are suggestion
  lists only; **no search volumes are claimed** (no volume tool was available).
- **Not known and not claimed:** competitors' traffic, revenue, conversion rates, customer
  satisfaction, or whether their stated figures are true. Their claims are quoted as claims.
- **Observation vs. assumption:** anything marked *(assumption)* is an inference, not something
  shown on the site.

## 2. Sites reviewed

| # | Company | Verified URL | Status | Notes |
|---|---|---|---|---|
| 0 | Limoni Cleaning (us) | https://limonicleaning.com/ | 200 | Baseline |
| 1 | Ndrit Cleaning | https://ndritcleaning.al/ | 200 | Blocks Lighthouse (403) |
| 2 | Alfa Pastrim | https://alfapastrim.al/ | 200 | |
| 3 | Genesis Kompani Pastrimi | https://www.genesiskompanipastrimi.com/ | 200 | Wix site |
| 4 | Sky Cleaning | https://www.skycleaningalbania.com/ | 200 | |
| 5 | Cleaning.al | https://cleaning.al/en/ | 200 | Brief's URL is the English version; site also has SQ/UA/RU |
| 6 | Pastrimi.AL | https://www.pastrimi.al/cities/tirana (+ homepage) | 200 | Client-rendered pages |
| 7 | Shndrit | https://shndrit.com/ | 200 | Client-rendered (3 KB of HTML before JS) |
| 8 | Andi Pastrim | https://www.andipastrim.com/ | 200 | Found via search; footer © 2020 |
| 9 | Pastrime Silvio | https://pastrimesilvio.com/ | 200 | Found via search; also sells cleaning products |
| 10 | Homey.al | https://homey.al/ | 200 | Found via search; English only |
| 11 | Roel Pastrim | https://roelpastrim.com/ | 200 | Found via search; blocks Lighthouse (403) |
| 12 | AMAI (building administration) | https://amai.al/administrim-pallatesh/ | 200 | **Not a competitor:** a real-estate agency that also administers buildings. A potential client/channel for common-area cleaning |

All 8 URLs in the brief were accessible and belong to the intended businesses. No URL was dead
or redirected elsewhere.

## 3. Measured data

### 3.1 SEO and conversion signals (homepage HTML)

| Site | `<title>` | H1 | Structured data | Rating schema | WhatsApp | Phone link | Form | Price shown |
|---|---|---|---|---|---|---|---|---|
| Limoni | Kompani Pastrimi në Tiranë \| Limoni Cleaning | "Ne pastrojmë. Ju e gjeni ambientin gati." | HousekeepingService, Service, OfferCatalog, WebSite | No | Yes | Yes | Yes (service, name, phone, message) | No |
| Ndrit | Ndrit Cleaning — Pastërti që ndriçon çdo ambient | Brand + tagline | None | No | Yes | Yes | Yes → opens WhatsApp | No |
| Alfa | Alfa Pastrim - Shërbime Profesionale Pastrimi Rezidencial dhe Komercial | "Shërbime Profesionale Pastrimi për Shtëpi & Biznese" | LocalBusiness | No | No | Yes | Yes (name, phone, service) | Discount banner "Ulje deri në 30%" |
| Genesis | Genesis Kompani Pastrimi - Sherbime Pastrimi Profesionale - Tirane | **None** | LocalBusiness, WebSite | No | Yes | Yes | Yes | No |
| Sky | Sky Cleaning - Shërbime Premium | "Aty ku pastërtia takon qiellin." | None | No | Yes | **No** | Booking page | No ("Pa tarifa të fshehta") |
| Cleaning.al | Cleaning Services in Durres and Tirana \| … (English) | "Professional Cleaning Service" | Organization, WebSite, Breadcrumb | No | Yes | Yes | No quote form (login form only) | No |
| Pastrimi.AL | Kompani Pastrimi në Tiranë ★ 4.9 \| Pastrimi.AL | "Kompani Pastrimi në Tiranë" | LocalBusiness, FAQPage, AggregateRating, Offer (per-m² prices), GeoCoordinates | **Yes** | Yes | Yes | Booking page + calculator | **Yes, from 350 Lek/m²** |
| Shndrit | Shndrit — Kompani Pastrimi në Tiranë \| Shtëpi, Zyra, Airbnb | (rendered by JS) | CleaningService | No | **Broken** (see §4.7) | Yes | Booking | **Yes, business monthly tiers** |
| Andi | 131-character title | Broken markup in H1 | None | No | Yes | Yes | No | No |
| Silvio | Home - Pastrime Silvio | "Pastrime Profesionale Cilësi e Garantuar" | Article, WebSite | No | No | Yes | Yes (incl. "Ngarkoni CV") | No |
| Homey | Homey.al - Professional Home Cleaning Services in Tirana, Albania | "Where clean meets comfort." | LocalBusiness, OpeningHours, Offer | No | Yes | No | Booking calendar | **Yes, €/hour** |
| Roel | Larje & Pastrim Divanesh, Kolltuqesh në Shtëpi \| Tiranë, Durrës | Services + cities | HouseCleaningService, Offer, Breadcrumb, OpeningHours | No | Yes | Yes | No (phone/WhatsApp + photos) | No |

### 3.2 Lighthouse (mobile, single run, 16 Oct 2026)

| Site | Performance | Accessibility | Best practices | SEO | LCP | CLS | Page weight |
|---|---|---|---|---|---|---|---|
| **Limoni** | **94** | **100** | **100** | **100** | 3.1 s | 0 | 535 KiB |
| Homey | 98 | 95 | 75 | 100 | 2.0 s | 0.022 | 2,136 KiB |
| Pastrimi.AL | 88 | 91 | 96 | 100 | 3.0 s | 0 | 129 KiB |
| Sky | 88 | 73 | 100 | 91 | 3.7 s | 0.044 | 974 KiB |
| Cleaning.al | 69 | 88 | 100 | 92 | 12.1 s | 0.052 | 4,287 KiB |
| Shndrit | 67 | 94 | 100 | 100 | 5.9 s | 0 | 576 KiB |
| Alfa | 63 | 81 | 93 | 100 | 15.9 s | 0.014 | 5,802 KiB |
| Genesis | 56 | 85 | 79 | 92 | 47.2 s | 0.176 | 8,084 KiB |
| Silvio | 56 | 85 | 100 | 100 | 20.8 s | 0 | 16,160 KiB |
| Andi | 52 | 94 | 96 | 100 | 11.6 s | 0.527 | 1,977 KiB |
| Ndrit, Roel | not measurable: server returned 403 to the automated test | | | | | | |

Single runs vary by a few points; treat differences under ~5 points as noise.

### 3.3 Mobile layout (device emulation 390 px)

No horizontal scrolling on any site except **Roel** (the layout is 445 px wide on a 390 px
screen, so the phone zooms out). **Genesis** uses Wix's fixed 320 px mobile layout and opens a
chat popup over the content. **Silvio** shows its service cards as empty blue boxes on mobile.
**AMAI** stayed on a loading overlay.

## 4. Competitor reviews

Each review covers positioning, first impression, services, trust, conversion, design and
search, per the brief.

### 4.1 Ndrit Cleaning: the closest "premium" rival
Screenshots: [desktop](research/screenshots/ndrit-desktop.jpg) · [mobile](research/screenshots/ndrit-mobile.jpg)

- **Positioning:** "luxury" cleaning for homes and businesses, built on the owner's London
  experience. Targets both homeowners and businesses; offers recurring maintenance
  (weekly/biweekly/monthly) and lists offices, gyms, public spaces, pools and new buildings.
- **First impression:** full-screen dark hero with a serif headline, a stock-looking photo
  (goggles and mask), "Rezervo Tani" + "Shiko Shërbimet", five trust chips. A **music toggle**
  sits bottom-left; nothing plays until tapped.
- **Services:** three packages (Pastrim me themel, Pastrim pas punimeve, Mirëmbajtje e
  vazhdueshme) with task lists, plus extras (corners/mattresses, facades, pools). Single page;
  no service URLs.
- **Trust:** two team photos and three field videos ("gjatë procesit"), which are strong.
  Weakened by inconsistent experience claims in the same page ("+8 vite", "6-vjeçare në Londër",
  "7+ vite"), "100% klientë të kënaqur", "Garanci e plotë" without terms, and six named
  testimonials attributed to Google with no link. Three service images are Unsplash stock.
- **Conversion:** form fields: Emri / Emri i Biznesit, Telefon, Lloji i Shërbimit
  (residential vs business options), m², Mesazh. Submitting opens WhatsApp. Business is a first
  -class option in the dropdown, which is good.
- **Design:** polished, dark, serif + teal. Mobile fits. Feels "nightclub premium" rather than
  "practical cleaning team" *(assumption about audience perception)*.
- **Search:** one page, no structured data, no canonical, no Open Graph image.

### 4.2 Alfa Pastrim: the most explicitly B2B
Screenshots: [desktop](research/screenshots/alfa-desktop.jpg) · [mobile](research/screenshots/alfa-mobile.jpg)

- **Positioning:** "Shërbime Profesionale Pastrimi për Shtëpi & Biznese", residential,
  commercial and industrial. Service grid covers offices, hotels, restaurants, malls,
  hospitals, banks, facades and DDD (pest control).
- **First impression:** hero with a real team photo on a rooftop terrace (machines visible),
  "Zbulo më shumë", a reviews widget showing "5.0 · 100+ new review" with no source.
  A short quote form ("Kërkoni një Preventiv": name, phone, service) sits right under the hero.
- **Trust:** client logos (Wurth, Sigal, Armani Exchange, La Boheme Hotel, Baumarket…),
  "ISO 9001-2015" and "HSEM" badges, counters (350+ projects, 500+ clients, 30+ staff,
  120+ facades). Testimonials have names but no source link. The logos and ISO claims are the
  strongest B2B signals in the market, if true; they are not verifiable from the site.
- **Conversion:** the 3-field form directly under the hero is the best low-friction business
  quote pattern seen. "Kërko Preventiv" is the header CTA. No WhatsApp link.
- **Weak:** cluttered (decorative sparkles, blob shapes, 99 images), a "limited offer up to
  30%" banner (false-urgency pattern), 5.8 MB page, LCP 15.9 s on mobile. No recurring-contract
  offer despite the B2B focus.
- **Search:** service pages (`/sherbimet.html`, `/pastrimi-i-shtepise.html`), a blog with
  four articles, LocalBusiness schema.

### 4.3 Genesis Kompani Pastrimi
Screenshots: [desktop](research/screenshots/genesis-desktop.jpg) · [mobile](research/screenshots/genesis-mobile.jpg)

- **Positioning:** general cleaning (homes, apartments, villas, offices) plus a strong sofa/
  mattress washing line with dedicated pages.
- **Trust:** claims "Kompania më e Vlerësuar e Pastrimit në Shqipëri", "20 vjet përvojë",
  "50,000 klientë", "certified" staff and machinery, none sourced. One testimonial links to a
  real Google profile, and there is a "read all Google reviews" link: the only competitor with
  a **linked** review source besides Pastrimi.AL. Many photos carry stock attributions.
- **Design / tech:** Wix; English and Albanian mixed in headings; no H1; 8 MB; LCP 47 s on
  mobile; chat popup covers mobile content.
- **Takeaway:** dedicated upholstery pages (`/larje-divanesh`, `/larje-dysheku`) match real
  searches ("larje divanesh tirane" appears in autocomplete).

### 4.4 Sky Cleaning
Screenshots: [desktop](research/screenshots/sky-desktop.jpg) · [mobile](research/screenshots/sky-mobile.jpg)

- **Positioning:** "premium" for apartments, villas, offices, Airbnb and businesses; three
  plans (standard, deep "MË I KËRKUARI", pre-move disinfection); 24/7 emergency cleaning.
- **Trust:** stock villa-with-pool hero; no address, legal name or phone link; three named
  testimonials without source; claims of "5-yje" standards and punctuality "çdo herë".
- **Good ideas:** a practical FAQ (Do I need to be home? Do you bring supplies? Cancellation?);
  a recruitment section ("Bëhu pjesë e jonë").
- **Weak:** no visible identity of a real company, so trust rests on copy alone.

### 4.5 Cleaning.al
Screenshots: [desktop](research/screenshots/cleaningal-desktop.jpg) · [mobile](research/screenshots/cleaningal-mobile.jpg)

- **Positioning:** homes and apartments in Durrës, Golem and Tirana; services each with a page
  (regular, general, post-construction, Airbnb, sofa & mattress, car interior). Offices
  mentioned but no page.
- **Trust:** stock hero; a portfolio section with categorized results (deep kitchen, sofa stain
  removal); six testimonials without source; animated counters that render as "0+" when not
  animated.
- **Conversion:** WhatsApp and phone only; "special offer on first cleaning" without terms.
- **Search:** the brief's URL defaults to English for an Albanian market; four languages
  (SQ/EN/UA/RU) suggest a foreign-resident audience *(assumption)*. Blog with renovation-cleaning
  articles.

### 4.6 Pastrimi.AL: the strongest local-SEO competitor
Screenshots: [desktop](research/screenshots/pastrimial-desktop.jpg) · [mobile](research/screenshots/pastrimial-mobile.jpg)

- **Positioning:** residential deep cleaning, post-construction, Airbnb checkout and
  "Mirëmbajtje Sistematike" (recurring), across 10 cities.
- **Trust:** "4.9 · 33 vlerësime në Google" with a link to the Google profile and a
  "leave a review" link: **verifiable**, and the most credible trust signal in the market.
- **Conversion:** WhatsApp, phone and online booking above the fold; a per-m² price calculator.
- **Search:** title carries "★ 4.9"; city pages (Tirana page lists neighbourhoods served:
  Bllok, Komuna e Parisit, Don Bosko, Yzberish, Astir…); FAQPage, AggregateRating and Offer
  schema; very light pages (129 KiB).
- **Weak:** inconsistent claims (quote "within 1 minute" vs "5 seconds"), generic images,
  thin visual design; no business/office plans.
- **Lesson for Limoni:** Google reviews + neighbourhood coverage + answering price questions
  win local search. Limoni can match the first two honestly; for the third it can explain
  quote factors without publishing prices.

### 4.7 Shndrit
Screenshots: [desktop](research/screenshots/shndrit-desktop.jpg) · [mobile](research/screenshots/shndrit-mobile.jpg)

- **Positioning:** homes, offices and Airbnb in Tirana; clean, modern, coral palette; one of
  the few to publish **business monthly tiers** (30,000–350,000 ALL/muaj for shops/clinics/
  showrooms) and Airbnb subscriptions.
- **Conversion problem (verified in the rendered page):** the WhatsApp button links to
  `wa.me/355691234567` (a placeholder), while the phone link is `+355 69 255 5518`. Anyone
  tapping WhatsApp reaches the wrong number.
- **Trust:** "I verifikuar dhe i siguruar", "500+ shtëpi", three testimonials (English quotes
  on an Albanian page) without source. The hero is a generic interior render.
- **Search:** separate pages for home, office and Airbnb cleaning in Tirana; content rendered
  by JavaScript (3 KB of server HTML), which is riskier for indexing.

### 4.8 Andi Pastrim
Screenshots: [desktop](research/screenshots/andi-desktop.jpg) · [mobile](research/screenshots/andi-mobile.jpg)

- Offices, apartments, facades, factories; Gmail address; © 2020; stock carousel; golden "10"
  3D graphic for "Eksperiencë 10-vjeçare". Broken markup in the H1 and a 131-character title.
  CLS 0.53 (layout jumps). A dated site that still ranks for "kompani pastrimi" *(observed in
  search results; ranking position not measured)*.

### 4.9 Pastrime Silvio
Screenshots: [desktop](research/screenshots/silvio-desktop.jpg) · [mobile](research/screenshots/silvio-mobile.jpg)

- Positions as a large operator: facade abseiling hero, counters (6714 ambiente, 4225
  ndërtesa…), "+25 vite në treg", building cleaning ("Pastrim Ndërtesash" incl. stairs and
  corridors), commercial, waste, septic tanks, equipment rental, plus a product shop.
- Mixing a cleaning service with a product catalogue dilutes the message. 16 MB page; mobile
  service cards render empty. The building-cleaning page names stairs and corridors but no
  process, frequency or contract model.

### 4.10 Homey.al
Screenshots: [desktop](research/screenshots/homey-desktop.jpg) · [mobile](research/screenshots/homey-mobile.jpg)

- Expats/Airbnb/homes; English only; €/hour pricing; "Insured & Vetted", "Satisfaction
  guaranteed", "contacts you via WhatsApp within 45 minutes". Clean, fast (98), but no offices
  and no Albanian version: different audience.

### 4.11 Roel Pastrim
Screenshots: [desktop](research/screenshots/roel-desktop.jpg) · [mobile](research/screenshots/roel-mobile.jpg)

- Sofa/mattress/carpet washing plus house and window cleaning; editorial serif design; city
  pages (Tiranë, Durrës, Elbasan, Kavajë); quote by sending 1–3 photos on WhatsApp; "pay after
  you confirm the result"; a "48-hour guarantee" with stated terms (they return free within 48 h).
- Claims "3000+ mobilje", "99% klientë të kënaqur", "5 yje në çdo vlerësim" without source;
  reviews show neighbourhood + month (e.g. "Megi K., Komuna e Parisit, February 2025") but no
  link. The 445 px mobile layout overflows.
- **Best idea:** "send us 1–3 photos on WhatsApp for an offer" is the simplest quote path in the
  market and fits Limoni's no-price model.

### 4.12 AMAI (building administration): context, not competitor

- A real-estate agency whose "Administrim pallatesh" service (per search results) covers
  elevator maintenance and **stairwell/yard cleaning** under Law 10112 on co-ownership. The page
  itself shows only a heading and a phone number.
- **Implication:** in Tirana, common-area cleaning is often bought through the building
  administrator, so the decision-maker for that segment is the **administrator or the
  residents' association**, not individual owners. Limoni's complex page should speak to
  administrators and explain how a quote for a building is prepared.

## 5. Comparison matrix

| Company | Apparent audience | Strongest positioning element | Best website feature | Weakest / missing | Best conversion tactic | Idea for Limoni to adapt | Avoid copying | Confidence / source |
|---|---|---|---|---|---|---|---|---|
| Ndrit | Homes + businesses, premium | "London standards", recurring plans | Field videos of real work | Contradictory year claims; stock images | Form with business option and m² that hands off to WhatsApp | Business as an explicit option in the quote form; real process video | Dark luxury styling; unsourced "100%" claims; music | High: page + screenshots |
| Alfa | Businesses (+ homes) | Client logos, ISO badges, broad B2B services | 3-field quote form under the hero | Clutter, 5.8 MB, fake-urgency discount | Short quote form above the fold | Short business quote form; list of business property types | Discount banners; unverifiable counters | High |
| Genesis | Homes, villas, upholstery | Dedicated upholstery pages | Link to real Google reviews | 47 s LCP, no H1, stock photos | Click-to-call + WhatsApp chat | Separate upholstery page that matches real searches | Superlatives ("më e vlerësuara") | High |
| Sky | Homes/offices/Airbnb, premium | Plans + emergency service | Practical FAQ | No real identity, stock photos | "Rezervo tani" booking | FAQ answering access, supplies, rescheduling | Anonymous company presentation | Medium: content read, no Lighthouse issues |
| Cleaning.al | Homes, expats | Each service has its own page | Categorized results portfolio | English default, "0+" counters | WhatsApp + phone | Results grouped by service | Animated counters | High |
| Pastrimi.AL | Homes, Airbnb, recurring | **Linked Google rating** | City/neighbourhood pages, FAQ schema | Generic visuals, no business plans | WhatsApp/phone/booking above the fold | Collect Google reviews; list neighbourhoods actually served | Publishing per-m² prices (Limoni policy) | High |
| Shndrit | Homes, offices, Airbnb | Business monthly tiers | Separate home/office/Airbnb pages | **Broken WhatsApp link**, render images | Booking in 2 minutes | Service pages per audience | Placeholder contact data; fixed public prices | High (link verified in browser) |
| Andi | Offices, facades | "10 years" | — | Dated, stock, CLS 0.53 | Phone/WhatsApp | — | Golden-number graphics | High |
| Silvio | Buildings, commercial | Building & facade capability | Building-cleaning page | Product shop mixed in; 16 MB | Phone | A page for building/common areas | Huge unsourced counters | High |
| Homey | Expats, Airbnb | Transparent hourly pricing | Clear 1-2-3 process | English only, homes only | WhatsApp in 45 min promise | Plain "what happens next" | Promising response times Limoni can't guarantee | High |
| Roel | Upholstery, homes | Photo-based WhatsApp quote, local pages | Editorial layout, neighbourhood in reviews | Overflowing mobile layout; unsourced 99% | "Send 1–3 photos on WhatsApp" | Ask for photos/video on WhatsApp for a quote | Guarantee/claims Limoni hasn't confirmed | Medium-high (no Lighthouse) |

## 6. Ranked shortlist for Limoni's intended positioning

Method (no official market ranking exists): each competitor scored 1–5 on
**(a) segment overlap** with Limoni's target (businesses, residential complexes, homes/villas),
**(b) service overlap** (deep, general, office, post-construction, upholstery, common areas),
**(c) website strength** (trust you can verify, conversion path, mobile, speed), and
**(d) search presence** in our Albanian searches (appeared repeatedly vs. rarely).
Relevance = 2a + 2b + c + d (max 30). Scores are judgement from the evidence above.

| Rank | Company | a | b | c | d | Score | Why it matters |
|---|---|---|---|---|---|---|---|
| 1 | Alfa Pastrim | 5 | 4 | 3 | 4 | 25 | Most direct rival for business contracts |
| 2 | Ndrit Cleaning | 4 | 5 | 4 | 2 | 24 | Same mix (homes + business + recurring + upholstery), real videos |
| 3 | Pastrimi.AL | 3 | 4 | 4 | 5 | 23 | Wins local search through reviews and area pages |
| 4 | Shndrit | 4 | 3 | 3 | 4 | 21 | Sells to offices with structured monthly offers |
| 5 | Cleaning.al | 3 | 4 | 3 | 3 | 20 | Strong per-service pages, incl. upholstery and post-construction |
| 6 | Sky Cleaning | 4 | 4 | 2 | 1 | 19 | Same "premium homes + offices" pitch, weak identity |
| 7 | Pastrime Silvio | 4 | 3 | 2 | 3 | 19 | Owns "buildings/commercial" positioning |
| 8 | Genesis | 3 | 4 | 2 | 4 | 19 | Upholstery and villas; linked Google reviews |
| 9 | Andi Pastrim | 4 | 3 | 1 | 3 | 18 | Office focus, weak site |
| 10 | Roel Pastrim | 2 | 3 | 4 | 3 | 17 | Upholstery specialist; best quote-by-photo flow |
| 11 | Homey.al | 2 | 2 | 4 | 2 | 14 | Expat homes only |

Ties (19) are ordered by segment overlap (a), then service overlap (b).

## 7. Market patterns

1. **Almost everyone claims more than they show.** Counters (500+, 6714, 50,000), "100%
   satisfied", "most rated", ISO badges and guarantees appear without sources on most sites.
   Only Pastrimi.AL and Genesis link to a real review source.
2. **Stock and generated images dominate.** Real team photos are rare (Alfa hero, Ndrit
   videos, Roel gallery). Limoni has more real, branded team material than most.
3. **Business buyers get a dropdown option, not a journey.** No site explains how a business or
   building quote is prepared, what information is needed, or what a recurring arrangement looks
   like. Alfa lists sectors; Shndrit lists prices; nobody explains the process.
4. **Residential complexes / common areas are barely addressed** by cleaning companies (only
   Silvio's building page and Alfa's "ambiente të përbashkëta" mention), while building
   administrators (AMAI and others) bundle cleaning into administration.
5. **WhatsApp is the default channel**, often alongside a short form. Photo-based quoting
   (Roel) fits the Albanian market well.
6. **Pricing splits the market:** per-m² (Pastrimi.AL), monthly tiers (Shndrit), hourly
   (Homey), or none (most). Autocomplete shows people search "kompani pastrimi tirane cmimet" and
   "pastrim shtepie cmimi", so price questions must be answered, even without numbers.
7. **Speed is a weakness of the market:** most sites score 52–69 on mobile with 2–16 MB pages.
   Limoni is already the fastest Albanian-language site measured.

## 8. Missed opportunities Limoni can take honestly

- A **business page** that explains the process (visit or photos → proposal → schedule →
  regular team) and the information needed. Nobody does this well.
- A **common-areas page aimed at administrators**, with real stair-cleaning photos (IMG_3357).
- An **upholstery page** with real extraction footage and the dirty-water clip, matching the
  "larje divanesh tirane" search.
- **Verifiable trust only:** real team photos, real job write-ups, and Google reviews once they
  exist (with a link). This becomes a differentiator in a market of unsourced numbers.
- **Explain the quote** in plain language for the price-seeking searches, and invite photos/video
  on WhatsApp.
- **Neighbourhood list** only for areas Limoni actually serves (needs Arbri's confirmation).

## 9. Evidence-based recommendations

1. Lead the homepage with professional cleaning for **businesses and homes**; move Airbnb to a
   secondary service (Ndrit/Alfa show this framing; Limoni's media now supports it).
2. Add a **business quote path** with a property-type choice, approximate m², one-off vs
   recurring, and optional business name (Ndrit's form shows the pattern; keep it short like
   Alfa's).
3. Create pages for **ambiente të përbashkëta** and **larje divanesh/dyshekësh**, both
   confirmed by Arbri on 16 Oct 2026 and backed by real footage.
4. Keep **no prices**; add a clear "Si përgatitet oferta" explanation and the WhatsApp
   "dërgoni foto ose video" route (Roel's pattern).
5. Never add counters, guarantees, insurance or certifications that Limoni can't document.
   Prepare a reviews slot that only renders when real Google reviews exist.
6. Keep the speed and accessibility lead: any video must be small, muted, posterised and
   optional.

## 10. Limitations

- Lighthouse could not test Ndrit and Roel (403); AMAI's page did not finish loading in the
  mobile emulator.
- Shndrit and Pastrimi.AL render content with JavaScript; their content was read from the
  rendered page.
- Competitor claims (clients, years, ISO, ratings) were not independently verified.
- Search "presence" reflects the results seen in this session's searches, not measured rankings.
- No search-volume data was available; autocomplete shows phrasing, not volume.
- Mobile screenshots show the first ~1,700 px of each page, not the full page.
