# Limoni Cleaning — Site Overview for AI Agents

This document exists so another AI agent (or a new human contributor) can understand the
current state of this codebase, its design system, its content, and the constraints it
was built under, without needing screenshots or prior conversation history. It reflects
the site as of September 2026, after a full UX/UI redesign and a six-part production
readiness audit (accessibility, performance/Core Web Vitals, SEO, responsive/mobile, code
architecture, visual consistency).

## 1. What this is

Limoni Cleaning is a real, currently operating cleaning company based in Tirana, Albania,
owned by Arbri. This repository is its marketing and booking website: a Next.js app that
markets six cleaning services, lets visitors book a cleaning through a multi step wizard,
and collects contact messages, all in Albanian (sq-AL).

A related but legally separate business, Prago (prago.al), is referenced as an "official
partner" in Airbnb related copy. It is not the same company and should never be described
as one.

### Ground truth facts (do not contradict these)

These live in `lib/business.ts` and `CLAUDE.md` and are the only facts about the business
that are allowed to appear anywhere on the site:

- Phone: +355 68 900 7252 (WhatsApp: https://wa.me/355689007252)
- City: Tirane, area served: Komuna e Parisit, Tirane
- No confirmed business email, social links, street address, or published hours yet
  (all three fields are `null` in `lib/business.ts` on purpose)
- "50+ prona te pastruara" (50+ properties cleaned): confirmed real, safe to state
- "Ekip me mbi 10 vjet eksperience" (team with 10+ years of combined experience):
  confirmed real, but this describes the *staff's* combined background, not the
  *company's* age. Limoni Cleaning itself is a new company. Never rephrase this into
  a "10 years in business" style claim.
- There are currently no reviews, ratings, or testimonials, real or otherwise. None may
  be displayed anywhere until real ones exist.

### The single most important constraint on this project

Never fabricate: reviews, ratings, customer counts, years in business, certifications,
service-area claims, awards, or superlatives. Every stat, quote, or claim on the site
must trace back to something Arbri actually confirmed. When a slot needs content that
doesn't exist yet (a testimonial, a case-study photo, a map), the correct move is a
deliberately designed empty state (see `MediaFrame`, section 4), never a placeholder
that reads as real content. This rule shaped almost every design decision described
below, including why there are no star ratings, no "founded in", and no stock-photo
person quotes anywhere on the site.

## 2. Tech stack

- Next.js 16 (App Router, Turbopack), React 19, TypeScript
- Tailwind CSS v4, configured entirely in CSS via `@theme inline` in `app/globals.css`.
  There is no `tailwind.config.js` in this project; all design tokens live in CSS custom
  properties.
- Prisma 6 ORM against plain PostgreSQL (`prisma/schema.prisma`), works against Vercel
  Postgres or Supabase, whichever `DATABASE_URL` points at
- Resend for transactional email (booking/contact notifications)
- Zod for form/API validation
- No CMS. All copy lives in TypeScript data files under `lib/` (see section 6) or is
  hardcoded directly in page components. `content/source-copy.md` is the original copy
  brief the site content was migrated from; treat it as historical reference, not a
  live source of truth (the TS files are canonical).
- `@tailwindcss/typography` (the `prose` plugin) is deliberately NOT installed. An
  earlier bug had two legal pages relying on `prose prose-neutral` classes that did
  nothing; the fix was removing them and writing explicit Tailwind utility classes for
  heading/paragraph spacing instead. Do not reach for `prose` classes in this project;
  they will not do anything unless the plugin is added.
- No testing framework is set up. Verification in this project has been done via
  `next build` (type checking + static generation) and manual/Playwright visual review,
  not automated tests.

## 3. Design system

### Typography

Two typefaces, loaded via `next/font/google` in `app/layout.tsx`:

- **Inter** (`--font-inter`, weights 400 to 800, latin + latin-ext for Albanian
  diacritics) is the body/UI face, applied globally via `font-family: var(--font-sans)`
  on `body`.
- **Fraunces** (`--font-fraunces`, weights 500/600/700, normal and italic, latin +
  latin-ext) is a display serif used only for headings, via a `.font-display` utility
  class defined in `globals.css`. It is applied selectively: h1/h2 headings, numbered
  list markers ("01", "02"...), pull-quote-style short lines, and italic captions on
  empty-state media slots. Body copy, buttons, nav, and form labels stay in Inter. The
  pairing is meant to read as "editorial and considered", not a single-typeface SaaS
  default, and Fraunces should never be used decoratively or in large blocks of running
  text, only in headings and short emphasis moments.

### Color tokens

All color is defined once, as CSS custom properties in `:root` in `app/globals.css`,
then re-exposed to Tailwind via `@theme inline` so they're usable as
`bg-primary`, `text-text-muted`, `border-border`, etc. Exact values:

```
Brand:
  --color-primary        #184a2c   (deep green, primary brand color)
  --color-primary-hover  #0f3520
  --color-primary-soft   #21603a
  --color-accent         #f5c518   (citrus yellow, used sparingly as a secondary accent)
  --color-accent-hover   #e5b60c

Surfaces:
  --color-bg             #ffffff
  --color-bg-muted       #f6f5f0   (warm off-white, used for "muted" section tone)
  --color-bg-warm        #fefbea   (pale yellow, used for "warm" section tone / CTA blocks)
  --color-bg-warm-strong #fdf3d3
  --color-bg-ink         #102019   (near-black green, used for "ink" section tone)

Text:
  --color-text                #16241c
  --color-text-muted          #5b6b60
  --color-text-on-dark        #f3f6f2
  --color-text-on-dark-muted  rgba(243, 246, 242, 0.72)

Borders:
  --color-border          #e7e3d7   (warm hairline gray, used everywhere instead of shadows)
  --color-border-on-dark  rgba(243, 246, 242, 0.16)

Motion:
  --ease-out      cubic-bezier(0.16, 1, 0.3, 1)
  --duration-fast 150ms
  --duration-base 320ms
  --duration-slow 600ms
```

There is no gray/slate default Tailwind palette in use anywhere in this codebase. Every
neutral is one of the warm, brand-tinted tokens above. The palette overall reads as
"citrus and deep green", not corporate blue.

### The `Section` component (`components/Section.tsx`)

The page-level layout primitive. Every page is built as a stack of `<Section>` blocks.
It takes a `tone` prop, one of `"default" | "muted" | "warm" | "dark" | "ink"`, which
maps to the surface/text color pairs above, and a `flush` boolean that removes the
default `py-16 sm:py-24` vertical padding for sections that manage their own spacing
(e.g. a full-bleed hero immediately followed by a text block). Content is always
constrained to `mx-auto max-w-6xl px-4 sm:px-6 lg:px-8` inside the section. Alternating
tones (`default` -> `muted` -> `dark`/`warm` -> `default`...) is how the site creates
visual rhythm down a long page instead of using dividers or shadows.

### The `Card` component (`components/Card.tsx`)

Deliberately flat: `rounded-lg border border-border bg-bg p-6`, no drop shadow, ever.
The code comment in the file states the reasoning directly: this is to avoid the
generic "SaaS card kit" look (uniform `rounded-2xl` + soft gray shadow) that the whole
redesign was reacting against.

### The `Button` component (`components/Button.tsx`)

Pill-shaped (`rounded-full`), four variants:
- `primary`: solid deep green (`bg-primary`), white text, subtle 1px lift on hover
- `secondary`: solid citrus yellow (`bg-accent`), ink-colored text
- `outline`: transparent with a translucent primary border, fills solid green on hover
- `link`: no padding/background, underlined text in primary color

Renders as a Next.js `<Link>` when given an `href`, or a native `<button>` otherwise.

### The `MediaFrame` component (`components/MediaFrame.tsx`)

This is the direct design answer to "we don't have a real photo/video for this slot yet,
but we refuse to fake one." When given a `src`, it renders a normal optimized
`next/image`. When no `src` is given, instead of a dashed "coming soon" placeholder box,
it renders a designed empty state: a hairline border, a faint brand-specific dot texture
(`.bg-citrus-texture`, a radial-gradient dot pattern at low opacity, not a stock pattern),
and a short italic `.font-display` caption describing what will eventually go there (e.g.
"Harta do te shtohet kur adresa e saktë konfirmohet"). This pattern is used across the
site anywhere a photo doesn't exist yet, most visibly in the portfolio grid on
`/puna-jone`.

### `BeforeAfterSlider` (`components/BeforeAfterSlider.tsx`)

A native `<input type="range">` drives a CSS `clip-path` reveal between a "before" and
"after" `next/image`, with "Para"/"Mbas" (Before/After) pill labels in the corners. Takes
a `priority` prop (default false) that should be set true only when the slider is the
largest above-the-fold image on a given page (LCP candidate).

### `PortfolioVideo` (`components/PortfolioVideo.tsx`)

New component added in the most recent work (see section 8). Renders a native HTML5
`<video controls preload="none" poster={...} playsInline>` in a `9:16` portrait frame,
plus a caption below. Deliberately not a custom video player and deliberately not
autoplay: nothing downloads until the visitor taps play.

### Anti-pattern checklist actively enforced throughout

These were treated as hard rules during the redesign and should continue to be enforced
in any future work on this codebase:

- No `rounded-2xl` or `rounded-xl` anywhere. Every rounded corner in the codebase is
  `rounded-lg` (cards, inputs, media frames) or `rounded-full` (pill buttons/badges).
- No gradients (aside from the one small radial-dot texture used at low opacity behind
  empty-state media slots, which is not a background gradient in the usual sense).
- No uppercase, letter-spaced "eyebrow" labels above headings (a very common generic
  SaaS-template pattern this project deliberately avoided). Kickers, where used, are
  set in normal case.
- No shadow-based card styling anywhere; borders only.
- No fake stats, testimonials, reviews, client logos, or superlative claims. See
  section 1.

## 4. Site structure / route map

All routes are Albanian-language, flat, keyword-rich paths (no nested locale prefix,
no `/en`). Every page follows the same anatomy: an h1 in `.font-display`, a `Breadcrumbs`
component plus its matching `BreadcrumbList` JSON-LD, one or more `<Section>` blocks, and
usually a closing CTA section in `tone="warm"` or `tone="dark"` pointing at WhatsApp
and/or `/rezervo`.

| Route | Purpose |
|---|---|
| `/` | Homepage: hero, trust strip, services grid, Airbnb feature block (`tone="dark"`), "Si funksionon" (how it works, numbered steps), warm CTA close |
| `/sherbime` | Overview/index of all six services |
| `/pastrim-apartamentesh-tirane` | Service page: apartment/house cleaning |
| `/pastrim-airbnb-tirane` | Service page: Airbnb turnover cleaning |
| `/pastrim-zyrash-tirane` | Service page: office cleaning |
| `/pastrim-vilash-tirane` | Service page: villa cleaning |
| `/pastrim-hotelesh-tirane` | Service page: hotel/apart-hotel cleaning |
| `/pastrim-pas-ndertimit-tirane` | Service page: post-construction cleaning |
| `/pastrim-me-themel-tirane` | Explainer page: "pastrim me themel" (deep/foundational clean) vs. standard clean, not tied to a single service card |
| `/pronare-airbnb` | Landing page for Airbnb property owners specifically (recurring turnover arrangements), includes `AirbnbWhatsAppQuote` component |
| `/cmimet` | Pricing: numbered divided price list (per m² pricing for apartments/offices/villas) plus a merged dark-tone Airbnb custom-quote panel and an "extra services" grid |
| `/rezervo` | Multi-step booking wizard (`BookingWizard.tsx`), writes to the `Booking` Prisma model |
| `/puna-jone` | Portfolio: before/after slider, video walkthroughs section, then a filterable photo grid (see section 8) |
| `/rreth-nesh` | About page |
| `/faq` | FAQ, accordion via `<details>/<summary>` in `FaqItem.tsx`, backed by `faqEntries` in `lib/content.ts`, also emits `FAQPage` JSON-LD |
| `/kontakt` | Contact page: WhatsApp promoted as the primary CTA, contact info as a hairline divided list, `ContactForm.tsx` as a secondary column, writes to `ContactMessage` Prisma model |
| `/blog` | Blog index. Currently empty by design (`blogPosts` array is empty in `lib/blog.ts`) pending real articles; renders a designed empty state, not a fake grid |
| `/blog/[slug]` | Blog post template (dynamic, currently unreachable since there are no posts yet, but fully built and styled) |
| `/privatesia` | Privacy policy |
| `/kushtet` | Terms of service |

Navigation (`lib/nav.ts`) is deliberately short: the header nav is
Shërbimet / Airbnb / Çmimet / Puna jonë / Rreth nesh / Kontakt, plus a "Rezervo" button.
FAQ and "Si funksionon" are reachable via footer/contextual links rather than competing
for header space. The footer additionally lists all six service links, About/Blog/FAQ/
Contact under "Kompania", and the two legal pages. `MobileStickyCta.tsx` adds a
persistent mobile-only bottom action bar.

## 5. Content data model (`lib/`)

- `lib/business.ts`: the ground-truth business facts described in section 1, plus a
  `whatsappLink(message)` helper that builds a prefilled `wa.me` deep link, and the
  `prago` object for the partner business reference.
- `lib/content.ts`: the `Service` interface and the `services` array (six services, each
  with slug, path, name, short/long description, an `includes` list, a `priceNote`, and
  an optional `image`), `trustCards`, `propertyCategories`, `homeStats` (exactly the two
  confirmed stats from section 1, deliberately not more), `faqEntries` (16 Q&A pairs),
  `aboutValues`, and `portfolioEntries`/`portfolioFilters` for the `/puna-jone` photo
  grid (some entries still use the `MediaFrame` empty state where no photo exists yet).
- `lib/pricing.ts`, `lib/booking-options.ts`: structured pricing/option data consumed by
  the booking wizard and pricing page.
- `lib/blog.ts`: `blogPosts` array, currently empty.
- `lib/seo.tsx`: all SEO helpers, described in section 6.
- `lib/whatsapp-messages.ts`: prebuilt WhatsApp message templates per context (booking
  inquiry, Airbnb quote request, etc.) fed into `whatsappLink()`.
- `lib/validation.ts`: Zod schemas for the booking and contact API routes.
- `lib/email.ts`: Resend integration for notification emails.
- `lib/prisma.ts`: Prisma client singleton.
- `lib/reference.ts`, `lib/analytics.ts`: booking reference-code generation and a small
  client-side event tracking helper (`trackEvent`) used by the contact/booking forms.

## 6. SEO setup

`lib/seo.tsx` centralizes all metadata and structured data:

- `pageMetadata({ title, description, path })`: builds per-page `Metadata`, feeding into
  the title template `"%s | Limoni Cleaning"` set in `app/layout.tsx`.
- `siteUrl`, `business` (imported from `lib/business.ts`) as the base facts.
- `localBusinessJsonLd()` (emitted as `HousekeepingService`), `organizationJsonLd()`,
  and `websiteJsonLd()`: emitted globally in `app/layout.tsx` on every page.
- `serviceJsonLd()`: per-service structured data on service pages.
- `faqJsonLd()`: emitted on `/faq`.
- `breadcrumbJsonLd(items)`: emitted on every page via the shared `Breadcrumbs`
  component pattern.
- `videoJsonLd({ name, description, thumbnailPath, contentPath, uploadDate,
  durationSeconds })`: added most recently for the `/puna-jone` portfolio videos, emits
  `VideoObject` structured data (thumbnail, ISO 8601 duration, publisher block pointing
  at the business's logo).
- `JsonLd` is a tiny shared component that serializes any of the above into a
  `<script type="application/ld+json">` tag.

`app/sitemap.ts` covers every static route, all six service paths (derived from
`services.map(s => s.path)`), the standalone `/pastrim-me-themel-tirane` explainer, and
blog post routes (currently none). `app/robots.ts` allows `/`, disallows `/api/`, and
points at the sitemap. `app/opengraph-image.tsx` generates the shared OG image.

## 7. Known non-issues (do not "fix" these)

- During `next build` or `next dev` on a Linux dev/preview machine, the console will
  show `PrismaClientInitializationError` messages related to the
  `linux-arm64-openssl-3.0.x` engine during static page data collection. This is
  expected/non-fatal in this environment and does not affect the build's exit code or
  the deployed behavior on the actual hosting platform (originally built/tested for
  macOS + Vercel). Do not spend time "fixing" this unless the production deploy target
  actually changes.
- Running bare `npx tsc --noEmit` immediately after deleting `.next/` will falsely
  report `Cannot find name 'LayoutProps'`. `LayoutProps` is a Next.js 15+ generated
  type that only exists after a `next build`/`next dev` run. Use `next build` itself as
  the type-check, not standalone `tsc`, when verifying this project.

## 8. Most recent work: portfolio video integration

The company had three unlabeled handheld `.MOV` video clips (HEVC, 1920x1080 sensor,
portrait via rotation metadata) sitting unused. The task was to use them as portfolio
content, with full discretion on placement, under the standing constraint that they
must never be used as an autoplaying hero video.

What was done:

- Each clip was visually inspected (multiple extracted frames per clip) before writing
  any caption, specifically to avoid guessing what it showed, in keeping with the
  "never fabricate" rule. This ruled out pairing two of the clips as a false
  before/after of the same property (they are visibly different apartments), and led to
  a deliberately neutral caption for the third clip (it shows a mostly tidy apartment
  with one unmade bed, so it's captioned as a regularly-maintained property rather than
  claimed as "after cleaning").
- All three were transcoded from HEVC to H.264 (`libx264`, crf 26, scaled to 720px
  width, AAC 96k audio, faststart flag) and now live in `public/videos/` at 2.6 to 5MB
  each. Poster frames were extracted at representative timestamps and saved as JPEGs in
  `public/images/` (56 to 99KB each).
- They were placed on `/puna-jone` in a new "Video nga puna jonë" section, positioned
  between the existing before/after slider and the existing photo portfolio grid: the
  strongest static proof first, then raw video walkthroughs, then the fuller photo
  catalog.
- Playback uses the new `PortfolioVideo` component: native controls, `preload="none"`
  (zero video bytes downloaded until a visitor taps play, to protect Core Web Vitals
  and mobile data), no autoplay anywhere, `poster` set to the extracted JPEG frame.
- Each video also gets `VideoObject` JSON-LD (via the new `videoJsonLd()` helper in
  `lib/seo.tsx`) with real duration, upload date, and thumbnail.
- The original HEVC source files remain untouched in `media-source/` (outside
  `public/`, not shipped) as the source archive.

This closed out the last open item from the full-site redesign plus six-part audit
(accessibility/design, performance/Core Web Vitals, SEO, responsive/mobile,
code/architecture, and full cross-route visual consistency) that this session
completed for every route on the site.
