# Founder video: production packet and how to publish it

Status (4 Nov 2026): **not recorded.** The website has a configured slot that renders nothing
until a real video, poster and Albanian captions exist. No placeholder, no dead play button,
no "coming soon" block. The existing real-work clips (sofa extraction, team in a bedroom,
post-construction footage) remain on the pages as evidence; they are supporting footage, not
the founder video.

Proposed length 90–120 seconds. This is a test recommendation, not a rule: time the real
read and don't rush to fit it.

## Where it appears

| Page | Position | Rule |
|---|---|---|
| `/pastrim-me-themel-tirane` | after "Si llogaritet çmimi", before "Shikoni ekipin në punë" | The hero (price, "Kërko vlerësim", WhatsApp) never depends on the video |
| `/` (homepage) | after "Si përgatitet oferta" | Optional, below the process |

## Script (Albanian, from `Limoni-Vsl-Recording-Script.md`, checked against the site)

Every line matches what the website now says. Change the site and the script together.

1. **Arbri and the situation.** "Përshëndetje, jam Arbri, themeluesi i Limoni Cleaning. Kur
   kërkoni pastrim me themel, doni të dini çfarë do të pastrohet, sa do të kushtojë dhe si do
   të organizohet puna."
2. **Real footage.** "Ne pastrojmë banesa në Tiranë dhe zonat përreth. Në këto pamje mund të
   shihni punën e ekipit tonë në detaje: kuzhinë, banjë, xhama dhe pjesët që shpesh kërkojnë
   më shumë kujdes." (Remove "Në këto pamje" if there is no matching work footage.)
3. **Scope and upholstery.** "Për apartamentin tuaj, përcaktojmë bashkë çfarë përfshihet. Në
   paketën e pastrimit me themel të apartamentit përfshihet edhe larja e divanit dhe e të
   gjithë dyshekëve. Sqarojmë numrin, përmasat, materialin dhe gjendjen e tyre përpara punës
   dhe i shkruajmë në ofertë."
4. **Honest price.** "Për apartamentet, çmimi orientues nis nga 250 lekë të reja për metër
   katror. Për shembull, për 80 metra katrorë, llogaritja bazë është 20 mijë lekë të reja. Për
   shtëpitë dhe vilat ju japim ofertë pas vlerësimit. Për punë të rënda pas
   ndërtimit ose kushte që kërkojnë trajtim shtesë, bëjmë vlerësimin përkatës dhe ju
   konfirmojmë totalin përpara rezervimit."
5. **Photos optional, assessment benefit.** "Nuk doni të dërgoni foto të shtëpisë? Mund ta
   nisim me një telefonatë. Nëse duhet ta shohim ambientin, caktojmë një vizitë vlerësimi.
   Edhe kohën e tharjes së divanit dhe dyshekëve e sqarojmë sipas materialit dhe ajrimit."
   "Na tregoni sipërfaqen, zonën dhe çfarë ju duhet. Pas vlerësimit, merrni planin e
   pastrimit dhe ofertën me shkrim, pa pagesë dhe pa detyrim për të rezervuar pastrimin."
6. **Call to action.** "Klikoni 'Kërko vlerësim' ose na shkruani në WhatsApp. Unë dhe ekipi do
   t'ju ndihmojmë të përcaktoni punët që ju nevojiten."

"Kërko vlerësim" is the exact label of the deep-cleaning page's main button and of the form's
submit button, so the spoken call to action matches the screen.

## Storyboard

| # | Seconds (estimate, re-time after recording) | Picture | On screen text |
|---|---|---|---|
| 1 | 0–10 | Arbri to camera in a real, clean work setting; small logo | "Arbri, themeluesi i Limoni Cleaning" |
| 2 | 10–30 | Real details: bathroom fittings, window tracks, cabinet interiors, final floor | none, or the room name |
| 3 | 30–50 | Extraction machine on a sofa, then a mattress (not steam footage) | "Divani dhe dyshekët e banesës përfshihen" |
| 4 | 50–70 | Price card | "80 m² × 250 lekë të reja = 20.000 lekë të reja" / "Vlerësim orientues; totali konfirmohet pas vlerësimit." |
| 5 | 70–90 | Arbri on the phone, or a simple graphic: telefon / foto (opsionale) / vizitë | "Plan pastrimi dhe ofertë me shkrim, pa pagesë." |
| 6 | 90–110 | Arbri to camera | "Kërko vlerësim" |

No fabricated customer chats, fake booking notifications or testimonials. Show only work that
was really performed, with the customer's permission and with personal items/addresses out of
frame. Don't suggest instant drying or guaranteed stain removal.

## Asset checklist (what must exist before the slot turns on)

- [ ] Landscape master (16:9), composed so a vertical ad cut is possible.
- [ ] Web export: H.264 MP4, 1280×720 or 1920×1080, AAC audio, target ≤ 15 MB for 2 minutes
      (example: `ffmpeg -i master.mov -c:v libx264 -crf 26 -preset slow -vf scale=1280:-2 -c:a aac -b:a 96k -movflags +faststart public/videos/arbri-pastrim-me-themel.mp4`).
- [ ] Poster JPG from a real frame (1280×720, ≤ 150 KB): `public/images/arbri-pastrim-me-themel.jpg`.
- [ ] Albanian captions, WebVTT, corrected punctuation and units ("lekë të reja", "m²"):
      `public/videos/arbri-pastrim-me-themel.vtt`.
- [ ] Transcript paragraphs (same text as the captions).
- [ ] Measured runtime: `ffprobe -v error -show_entries format=duration -of csv=p=0 <file>`.
- [ ] Permission from every person and property owner shown; metadata/GPS stripped.
- [ ] Every statement validated by Arbri before recording (scope, area, free plan and offer).
- [ ] Don't call the assessment visit free (unconfirmed). Only the plan and written offer are free.
- [ ] The 250 reference is said for apartments only.

## How to publish (configuration)

Edit `lib/founder-video.ts`:

```ts
export const founderVideo: FounderVideoConfig | null = {
  src: "/videos/arbri-pastrim-me-themel.mp4",
  poster: "/images/arbri-pastrim-me-themel.jpg",
  captions: "/videos/arbri-pastrim-me-themel.vtt",
  durationSeconds: 104.2, // from ffprobe, never estimated
  title: "Arbri shpjegon pastrimin me themel",
  transcript: ["Përshëndetje, jam Arbri…", "…"],
};
```

At build time `publishedFounderVideo()` checks that the three files are in `public/`. If any is
missing, or the transcript is empty, the player stays hidden.

Player behaviour (`components/FounderVideoPlayer.tsx`): native controls (keyboard and caption
menu), `playsInline`, `preload="metadata"`, no autoplay, fixed 16:9 frame, Albanian captions on
by default, transcript in a disclosure under the player. If the file fails to load, the frame
says so and the transcript stays available. The page's buttons don't depend on it.
Analytics: `video_start` (first play), `video_progress` at 25/50/75 % (real `timeupdate`),
`video_complete` (`ended`). Only the placement is sent.

## How the slot was verified without a real video

On 4 Nov 2026 the slot was tested locally by pointing the config at an existing real clip
(`/videos/larje-divani-me-ekstraktim.mp4`) with a temporary test caption file, checking
poster, controls, captions track, transcript and the error state, then reverting the config to
`null` and deleting the test caption file. Nothing of that test is committed.

## After publishing

Compare inquiry quality and bookings (docs/sales-handoff.md stages) before and after. Video
views alone are not the business outcome.
