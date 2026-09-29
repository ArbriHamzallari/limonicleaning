# Prompt 04: Make it feel like Limoni, not a template

Read `CLAUDE.md` and `SITE_OVERVIEW.md` first, then the relevant guide in `node_modules/next/dist/docs/` before touching routing or metadata (Next.js 16).

Prompt 03 is done and live on https://limonicleaning.com. The code is clean now (one `ServicePage` template, `lib/services.ts`, `lib/photos.ts`, `LeadForm`, `/api/lead`). **The problem is no longer the code, it's the feel.** The site reads as a generated landing page: the same component rhythm on every page, 7 identical service cards, the WhatsApp link repeated on every card, headings like "Shërbimet tona / Si funksionon / Pyetje të shpeshta", and copy that is correct but uniform.

Direction: **more editorial, more photographic, less component-based.** A local company that is in apartments every day, not a SaaS landing page. Do not redesign from zero: keep the brand colors, Inter, the backend, the lead flow, the SEO setup and all URLs.

Keep all existing rules: no prices, no invented claims, no em dashes in visible copy, correct ë/ç, request vs confirmation wording, 48px tap targets, 18px body text.

## 1. Global copy changes

**"eksperiencë" becomes "përvojë" everywhere** (visible copy, meta descriptions, alt text, `lib/content.ts`, `lib/services.ts`, `app/rreth-nesh`, `CLAUDE.md`). The claim must always read as the team's experience, never the company's age:

- Hero / long form: "Ekip me mbi 10 vjet përvojë në pastrim."
- Short form (trust row): "Ekip me mbi 10 vjet përvojë"
- Rreth nesh keeps the explicit version: the company is new, the people have 10+ years.

**Delete** "jo foto stoku" / "nuk përdorim foto stoku" (`app/page.tsx`, `app/puna-jone/page.tsx`). Don't explain the photos, show them.

**Heading vocabulary.** Replace generic section titles site-wide:

| Now | Use instead |
|---|---|
| Shërbimet tona | Çfarë pastrojmë |
| Puna jonë (section title) | Shikoni si e lëmë pronën |
| Si funksionon | Si organizohet një pastrim |
| Pyetje të shpeshta (home) | Pyetjet që na bëni më shpesh |
| Na lini numrin, ju kontaktojmë ne (home closer) | Keni një pronë për të pastruar? |
| Shërbime të tjera (service pages) | plain text links, see section 4 |

"Kërko ofertë" stays in exactly two places: the header button and the hero. Everywhere else the action is WhatsApp, the phone number, or a sentence like "Na shkruani për çmimin". Keep the nav label "Puna jonë" and the `/faq` page title "Pyetje të shpeshta" (clear navigation beats clever wording).

**Specific copy fixes** (find them in `lib/services.ts` / `lib/content.ts`):

| Now | Replace with |
|---|---|
| Zgjidhni llojin e pronës për të parë çfarë përfshin pastrimi. | Zgjidhni shërbimin që ju nevojitet. |
| Pastrim i rregullt ose me themel | Pastrim i rregullt ose pastrim i thellë |
| Pastrimi më i thellë: brenda dollapëve, frigoriferit, furrës… | Pastrim i thellë, nga sipërfaqet deri te vendet që zakonisht harrohen. |
| Pastrim i rregullt periodik për zyra | Pastrim periodik për zyra dhe biznese në Tiranë. |
| Na thërrisni kur punimet të kenë mbaruar plotësisht. | Na kontaktoni pasi punimet të kenë përfunduar dhe mbetjet e mëdha të jenë larguar. |
| Organizim i ambientit për mysafirin tjetër | Përgatitje e pronës për mysafirin tjetër |

Keep "Pastrim me themel" as the page name, H1 and SEO term, and define it once on that page: "Një pastrim i thellë për ambiente që kanë nevojë për më shumë se pastrimi i përditshëm."

Then do a **voice pass** on every service's `intro`, `howWeWork` and FAQ answers: shorter sentences, concrete nouns (kuzhina, banjo, xhamat, binarët e dyerve, çarçafët), first person plural ("vijmë", "pastrojmë", "e lëmë"), no sentence that could appear on any other cleaning company's site. Do not add facts that aren't already in the data or confirmed in `CLAUDE.md`.

**Prago, once and modest.** Remove "Partner zyrtar i Prago" from the trust row and from the footer tagline. Mention Prago only in the homepage Airbnb section and in the `#pronare` section of `/pastrim-airbnb-tirane`, worded so the two companies are clearly separate:

> Bashkëpunojmë me Prago, kompani që menaxhon prona me qira ditore, për pastrimin e pronave Airbnb.

## 2. Homepage (rewrite `app/page.tsx`)

Target order. 9 blocks, each short. Background tone changes at most 3 times on the whole page (white by default; one muted block; one dark green block for Airbnb).

1. **Header.** Logo · Shërbimet · Airbnb · Puna jonë · Rreth nesh · phone number as text · button "Kërko ofertë". (Drop "Kontakt" from the header; it stays in the footer and the phone is already visible. Keep "Airbnb" because it is the main vertical.)

2. **Hero.**
   - H1: **"Ne pastrojmë. Ju e gjeni ambientin gati."**
   - Paragraph: "Pastrime për apartamente, Airbnb, vila dhe biznese në Tiranë. Ekip me mbi 10 vjet përvojë në pastrim. Na tregoni çfarë duhet pastruar dhe ju japim ofertën."
   - Buttons: "Kërko ofertë" (primary) and "WhatsApp" (secondary).
   - No extra "Apartamente · Airbnb · …" line: the paragraph already names them, two lists would repeat.
   - Photo: `photos.windowsTeam` (two team members in uniform), large. SEO note: the title tag stays "Kompani Pastrimi në Tiranë | Limoni Cleaning" and the paragraph carries "pastrime … në Tiranë", so the human H1 costs nothing that matters.

3. **Trust row, 3 facts, no icons:** "50+ prona të pastruara" · "Ekip me mbi 10 vjet përvojë" · "Tiranë".

4. **Çfarë pastrojmë: 4 groups, not 7 cards.** Editorial layout: one large photo on one side (`photos.steamFrame`), a divided text list on the other. No card borders, no photo per item, no WhatsApp per item. Each row: name, one sentence, text link "Shiko shërbimin".
   - **Airbnb.** "Pas çdo check-out-i, e pastrojmë pronën dhe e përgatisim për mysafirin tjetër." → `/pastrim-airbnb-tirane`
   - **Shtëpi dhe apartamente.** "Pastrim i rregullt për apartamente, shtëpi dhe vila, sipas gjendjes së pronës." → `/pastrim-apartamentesh-tirane` (vila also linked inline to `/pastrim-vilash-tirane`)
   - **Biznese.** "Zyra, hotele dhe ambiente të tjera biznesi, me plan sipas orarit tuaj." → `/pastrim-zyrash-tirane` (hotele inline to `/pastrim-hotelesh-tirane`)
   - **Pastrime të veçanta.** "Pastrim me themel dhe pastrim pas ndërtimit ose rinovimit." → both pages inline
   - Below the list: "Shiko të gjitha shërbimet" link to `/sherbime`.
   - (Note: "i thellë" appears only in the last group, so the groups don't overlap.)

5. **Airbnb, its own large section** (dark green), photo `photos.bedroom` large beside the text:
   - H2: "Keni një Airbnb në Tiranë?"
   - "Ne merremi me pastrimin pas çdo check-out-i. Ekipi vjen sipas kalendarit të rezervimeve, pastron pronën, rregullon ambientin dhe e lë gati për mysafirin tjetër."
   - "Për një pronë apo për disa prona."
   - The Prago sentence from section 1.
   - One link/button: "Pastrimi për Airbnb".

6. **Shikoni si e lëmë pronën.** The before/after slider becomes the widest element on the page (full container width on desktop, edge to edge on mobile). Caption: "Dhoma e ndenjes, para dhe pas pastrimit". Under it, 2 or 3 photos in an uneven layout (one large, two small), not a uniform square grid: `photos.kitchen`, `photos.constructionBefore` + `photos.constructionGlass` if they read well together, otherwise `photos.guestRoom`. Link "Shiko më shumë foto".

7. **Çfarë përfshin një pastrim.** One elegant two-column checklist (plain text rows with a thin check, hairline dividers), no cards. Build it only from items already present in `services.includes` for the apartment service; don't write new promises.

8. **Rreth Limoni.** A team photo (use one not already on the page; if none is left, text only) and 4 to 5 real lines taken from `/rreth-nesh`: new company, team with 10+ years, based in Komuna e Parisit, 50+ properties. Link "Më shumë për ne".

9. **Closer, heading: "Keni një pronë për të pastruar?"**
   - Left: "Na shkruani në WhatsApp zonën, madhësinë e pronës dhe llojin e pastrimit. Ju përgjigjemi me ofertën." Large WhatsApp button. Under it: "Preferoni telefonin?" and the number as a large `tel:` link.
   - Below, three numbered lines in a row, no boxes (this replaces the separate "Si funksionon" section, since it explains what happens after they write):
     1. **Na kontaktoni.** Na dërgoni në WhatsApp madhësinë, zonën dhe llojin e pronës.
     2. **Ju japim çmimin.** Shikojmë çfarë ju nevojitet dhe ju japim ofertën.
     3. **Vijmë dhe pastrojmë.** Caktojmë ditën dhe orën dhe ekipi vjen në pronë.
   - Then, visually secondary, "Ose na lini numrin dhe ju telefonojmë ne:" and the `LeadForm`.
   - Then 4 FAQ items under "Pyetjet që na bëni më shpesh", link to `/faq`.

Footer: minimal. Remove the Prago tagline. Keep services, company links, contact, legal.

**Photo rule:** on any page, each photo appears once. On the homepage, no photo is used both as a section image and in a gallery. Add a dev-only check (or a simple test) that fails if the same `src` is rendered twice on `/`.

## 3. WhatsApp and form

- The homepage closer's WhatsApp link uses a fill-in message, because that is what we ask people to send:
  "Përshëndetje! Dua një ofertë për pastrim.\nZona: \nMadhësia e pronës (m²): \nLloji i pastrimit: "
  Service pages keep their service-specific message from `waMessageFor()`.
- **Simplify `LeadForm`:** Shërbimi (preselected on service pages), Emri, Numri i telefonit, and one optional "Mesazh (opsional)" field. Remove the "Si preferoni t'ju kontaktojmë?" chips and the separate "Zona" field (area goes in the message; the `Lead.area` and `channel` columns stay in the schema with their defaults, no migration needed). Keep honeypot, timing check, rate limit and the success text.
- Remove the per-card WhatsApp shortcut from `ServiceCard`/`ServiceGrid`. WhatsApp stays in the header (mobile), hero, sticky mobile bar, the closer, and service page heroes. Nowhere else.

## 4. Service pages: stop looking like copies

`ServicePage` currently renders the same 8 blocks with the same headings for every service. Change it to a small set of **blocks each service chooses**, with its own headings:

- In `lib/services.ts`, add `sections: ServiceSection[]` where a section is one of: `checklist` (title, items), `steps` (title, 3 to 4 lines), `photoStory` (title, text, photos), `beforeAfter` (pair + caption), `text` (title, paragraph), `note` (short highlighted line).
- The template keeps only the fixed parts: breadcrumbs, hero (H1, intro, the two actions, photo), the chosen sections in order, a short FAQ **only if the service has 3+ real questions**, a one-line "Mund t'ju interesojë edhe:" row of 2 text links to related services, and the closer (WhatsApp first, form second, same as the homepage).
- Suggested composition (adjust to the real data, don't invent content):
  - **Airbnb:** steps "Si funksionon pastrimi pas check-out-it", checklist "Çfarë bëjmë në çdo pastrim", photoStory with `bedroom` + `guestRoom`, the `#pronare` section "Për një pronë apo për disa prona" with the Prago sentence. This page should be the richest.
  - **Shtëpi dhe apartamente:** photoStory (kitchen), checklist by room (kuzhina, banjo, dhomat, dyshemetë).
  - **Pastrim me themel:** the definition sentence, checklist of the "places that are usually forgotten" already in the data, `steamFrame` photo.
  - **Pas ndërtimit:** beforeAfter-style pairing with `constructionBefore` and `windowsTeam`, note: "Na kontaktoni pasi punimet të kenë përfunduar dhe mbetjet e mëdha të jenë larguar."
  - **Zyra:** text about scheduling around working hours, short checklist, no fake photo (use `officeRenovation` only small, it's low-res).
  - **Vila, Hotele:** shorter pages are fine. A short honest page beats padding.
- Vary the hero photo per page; no page reuses the homepage hero photo as its own hero.

## 5. Visual rules (enforce while doing the above)

Not allowed: gradients, glassmorphism, blobs or floating shapes, decorative icons, grids of 3+ identical bordered cards, shadows, badges or pills for claims, motion without purpose, a background change every section, secondary actions styled as buttons.

Concretely in this codebase:
- Remove the bordered boxes around the "how it works" steps and around FAQ items (use hairline dividers).
- `rounded-full` only on real buttons; filters on `/puna-jone` can become underlined text tabs.
- Secondary actions ("Shiko shërbimin", "Shiko më shumë foto", "Më shumë për ne") are underlined text links with a 48px tap area, not outline buttons.
- Photos: let the big ones be big. Use asymmetric photo + text layouts (roughly 7/5 columns), bleed photos to the screen edge on mobile, and use the natural aspect ratio of each photo instead of forcing everything square.
- At most one dark section per page.

## 6. Verification

1. `npm run build` and `npm run lint` pass.
2. `grep -rn "eksperienc\|stoku\|Partner zyrtar" app components lib` returns nothing (CLAUDE.md is updated to "përvojë" too).
3. "Kërko ofertë" appears in rendered HTML of `/` only in the header and hero (count it).
4. No image `src` renders twice on `/` or on any service page.
5. Playwright screenshots at 375×812 and 1440×900 of `/`, `/pastrim-airbnb-tirane`, `/pastrim-apartamentesh-tirane`, `/pastrim-pas-ndertimit-tirane`. Put the service pages side by side and confirm they no longer share the same block sequence and headings.
6. Submit the simplified form once: a `Lead` row is created and the notification goes out.
7. Open the homepage WhatsApp link on a phone: the fill-in template shows with line breaks and ë intact.
8. Albanian QA pass on every changed string (ë/ç, agreement, word order, no calques, no English leftovers other than "Airbnb" and "check-out", consistent terms: "ofertë", "kërkesë", "përvojë").
9. Update `SITE_OVERVIEW.md` (homepage structure, service sections model, visual rules).
