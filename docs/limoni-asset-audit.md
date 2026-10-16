# Limoni Cleaning: media asset audit

Date: 16 October 2026. Every file below was opened and looked at (photos converted from HEIC
and viewed; videos sampled at five evenly spaced frames). Descriptions say only what is visible.

Folders inspected: `public/images`, `public/videos`, `public/` (logos), `app/` (icons),
`media-source/` (raw originals, git-ignored), `media-source/2026-10/` (new batch),
`media-source/ai-video/`, and `Claude outputs/` (social graphics, git-ignored).

## 1. Summary

| Group | Count | Status |
|---|---|---|
| Web-ready photos in `public/images` | 12 photos + 2 video posters | In use on the live site, metadata stripped, ≤1600 px |
| Web-ready videos in `public/videos` | 5 | In use, H.264 MP4, location data removed |
| Raw originals (older batches) | 10 photos, 5 videos | Source for the web copies above; keep, never publish raw |
| **New batch, 8 and 15 Oct 2026** (`media-source/2026-10/`) | **4 photos, 5 videos** | **Not yet on the site.** All contain GPS coordinates; videos are HEVC |
| AI-assisted reels (`media-source/ai-video/`) | 3 videos + 1 still | Mix of real frames and AI-generated shots. Not for the website |
| Social graphics (`Claude outputs/`) | ~45 designed images | Instagram carousels and campaign posts. Not website photography |

**Housekeeping done during this audit:** the new batch had been dropped into `public/` (where
files are served as-is to anyone). They were moved to `media-source/2026-10/` before any commit,
because every one of them carries GPS coordinates of the client's property (latitude ≈ 41.326).

## 2. New batch (October 2026): what it adds

This is the most valuable new material: it shows the **team in uniform working inside a large
multi-storey house**, **sofa extraction cleaning**, and **stairwell cleaning**. These directly
support three things the current site can't show: larger residential jobs, upholstery cleaning,
and stairs/common-area work.

| File | Type / size | What it actually shows | Service | Suitability and issues | Recommended placement |
|---|---|---|---|---|---|
| `media-source/2026-10/IMG_3357.HEIC` | Photo 5712×4284, 2.8 MB | Limoni team member (back view, logo clearly visible) on her knees cleaning granite stairs with a bucket; wooden balustrade; glass-block ceiling; a second worker in hi-vis green/yellow in the background | Stairs / common areas; large house | **Strongest new photo.** Real, branded, no face. Caption honestly: stairs in a multi-storey house, not a residential complex | Homepage "Ekipi në punë"; common-areas page hero; business page |
| `media-source/2026-10/IMG_3296.HEIC` | Photo 4032×3024, 1.6 MB | Large formal living room: two chandeliers, ornate sofas, framed oil painting, patterned rugs, seen from a stair landing | Villa / large house | Looks finished and clean; no people. **Shows a client's interior and artwork: needs the owner's OK.** Not a before/after | Villa page (with permission) |
| `media-source/2026-10/IMG_3354.JPG` | Photo 3520×1980, 1.6 MB | Attic window set in a wooden ceiling, thick cobwebs in the corner | Deep cleaning ("vendet që harrohen") | Real "before" detail; no people; no matching "after" | Deep-clean page as a detail image |
| `media-source/2026-10/IMG_3365.HEIC` | Photo 5712×4284, 2.6 MB | Exterior of a 3–4 storey house, lemon tree, yellow vacuum by the door | Context of the same job | **Do not publish:** identifies the property (plus GPS) | None |
| `media-source/2026-10/IMG_3360.MOV` | Video 1080×1920, 5.4 s, HEVC | Three team members in a bedroom: one on a chair cleaning high up, one dusting at a desk, one mopping | Deep / general cleaning, team | Good proof of a team (not one cleaner). Shaky in places; a staff face partly visible; client's personal items (bedding, paintings, books). **Needs staff consent and a tight crop** | Short muted loop in "Ekipi në punë" (portrait frame) |
| `media-source/2026-10/IMG_3362.MOV` | Video 1080×1920, 4.3 s, HEVC | Technician cleaning a blue velvet sofa with a wet-extraction machine | Sofa / upholstery | Steady, clear, professional. Technician's face visible in profile (**staff consent**) | Upholstery page hero video; homepage service strip |
| `media-source/2026-10/IMG_3368.MOV` | Video 1080×1920, 3.1 s, HEVC | Close-up of the extraction machine's tank full of dirty water being emptied | Sofa / upholstery | No people. Honest "result" proof without a staged before/after | Upholstery page, next to IMG_3362 |
| `media-source/2026-10/IMG_3356.MOV` | Video 1080×1920, 9.8 s, HEVC | Walk-through of granite stairs and landings with wooden handrails; a uniform edge visible | Stairs / common areas | Calm, clean result; no faces | Common-areas page; business page |
| `media-source/2026-10/IMG_3366.MOV` | Video 1080×1920, 3.4 s, HEVC | House exterior and garden path | Context | **Do not publish:** identifies the property | None |

## 3. Assets already on the site

| File (public) | Size | Shows | Category | Current use | Keep / change |
|---|---|---|---|---|---|
| `images/ekipi-pastrim-xhamash-pas-ndertimit-tirane.jpg` | 1600×1200, 280 KB | Two uniformed team members cleaning floor-to-ceiling windows in a new flat (crib, ladder, plastic) | Team; post-construction | Homepage hero; pas-ndërtimit pair | Keep. Best wide team photo |
| `images/apartament-pas-ndertimit-para-pastrimit.jpg` | 1200×1600, 248 KB | Same new flat before cleaning: plastic sheeting, boxes, stickers on glass | Post-construction (before) | Homepage gallery; pas-ndërtimit | Keep |
| `images/xhama-dhe-korniza-apartament-i-ri.jpg` | 1600×1200, 172 KB | Large glass panes and black frames, city and sky | Post-construction; windows | Pas-ndërtimit hero; homepage | Keep |
| `images/pastrim-me-avull-korniza-dere.jpg` | 900×1600, 128 KB | Steam-cleaning a sliding door frame and track (frame from video) | Deep clean; post-construction | Me-themel hero; homepage | Keep |
| `images/ekipi-pastrim-kuzhine-tirane.jpg` | 1200×1600, 248 KB | Team member at the kitchen sink of an apartment | Team; kitchen; residential | Rreth Limoni; apartments | Keep |
| `images/ekipi-shtrim-shtrati-tirane.jpg` | 1200×1600, 156 KB | Team member putting pillowcases on in a bedroom | Team; Airbnb / residential | Airbnb hero; homepage Airbnb | Keep, but move off the homepage hero area (Airbnb no longer leads) |
| `images/dhome-e-pergatitur-per-mysafire.jpg` | 1600×1200, 236 KB | Guest-ready bedroom, folded towels on the bed | Airbnb / hotels | Hotels hero; homepage gallery | Keep |
| `images/dhoma-ndenje-e-pastruar-tirane.jpg` | 1600×1200, 260 KB | Tidy living room (the "after" scene, full frame) | Residential | Apartments hero | Keep |
| `images/dhoma-ndenje-para-pastrimit.jpg` + `dhoma-ndenje-pas-pastrimit.jpg` | 1600×1067 each | Same living room before (bottles, clutter) / after, aligned and cropped to the shared view | Before/after | Slider on homepage and Puna jonë | Keep. **The only genuine aligned pair** |
| `images/zyre-gjate-rinovimit-para-pastrimit.jpg` | 360×640, 20 KB | Office mid-renovation: orange walls, plastic, ladder | Office (before) | Zyra page (small) | Keep small only (low resolution) |
| `images/puna-jone-para-pastrimit.jpg` | 900×1600 | Video poster: bathroom with paper on the floor | Before | Puna jonë video | Keep |
| `images/puna-jone-vizite-apartamenti-1.jpg` | 900×1600 | Video poster: clean hallway | Residential | Apartments; Puna jonë | Keep |
| `images/puna-jone-vizite-apartamenti-2.jpg` | 1080×608 | Video poster: bedroom, unmade bed | Residential | Puna jonë video | Keep as poster only |
| `videos/pastrim-me-avull-korniza.mp4` | 720×1280, 4.3 s | Steam cleaning frame/track | Deep / post-construction | Puna jonë | Keep; candidate for a muted loop |
| `videos/puna-jone-para-pastrimit.mp4` | 720×1280, 17.9 s | Apartment walk-through before cleaning | Before | Puna jonë | Keep |
| `videos/puna-jone-vizite-apartamenti-1.mp4` | 720×1280, 26.0 s | Apartment walk-through after cleaning | Residential | Puna jonë | Keep |
| `videos/puna-jone-vizite-apartamenti-2.mp4` | 720×406, 34.6 s | Regularly maintained apartment walk-through | Residential | Puna jonë | Keep |
| `videos/zyre-gjate-rinovimit.mp4` | 360×640, 4.5 s | Office mid-renovation | Office | Puna jonë | Keep (small) |
| `public/logo.png`, `public/limoni_logo.png`, `app/icon.png`, `app/apple-icon.png` | — | Lemon mark / wordmark | Brand | Header, favicon, OG card | Keep |

Originals in `media-source/` map to these files (IMG_2973 kitchen, IMG_2988/IMG_2990 living
room, IMG_3021 bedroom, IMG_30872/30942/3097 new flat, IMG_31002 guest room, IMG_2986/2999/3002
walk-throughs, IMG_3112 steam, 208…MOV office). `before_after_cleaning.jpg` is the old split
composite, superseded by the aligned pair; keep as source only.

## 4. Not for the website

| Item | Why |
|---|---|
| `media-source/ai-video/limoni-reel-dritare.mp4`, `limoni-reel-stafi.mp4`, `limoni-dritare-limon.mp4`, `kling-start-frame-dritare.jpg` | AI-assisted social reels: a gloved hand wiping glass and a lemon on a sill are generated; other frames reuse real footage; logo end card. Publishing these as "our work" would misrepresent them. Fine for social media if labelled. |
| `Claude outputs/` carousels and campaign posts (pastrimi-javor, pastrimi-zyrave, pastrimi-me-themel, pastrimi-i-rregullt, pastrimi-airbnb, "Vera iku", "Fund sezoni") | Designed social posts (text over photos already on the site). Not photography; would duplicate images and add text-in-image (bad for accessibility and SEO). |
| IMG_3365, IMG_3366 | Identify a client's house. |

## 5. Classification (only where real material exists)

| Category | Real assets available |
|---|---|
| Team and staff | windowsTeam, kitchen, bedroom, **IMG_3357**, **IMG_3360**, **IMG_3362** |
| Deep cleaning | steamFrame + video, **IMG_3354** (cobwebs detail), **IMG_3360** |
| General residential | living room pair, hallway, kitchen, apartment walk-throughs |
| Apartments and villas | apartment set; **IMG_3296** (large formal living room, with permission) |
| Office and commercial | office mid-renovation (low-res only). **Gap.** |
| Residential complexes / common areas | **IMG_3357**, **IMG_3356** (stairs of a multi-storey house). **No photo of an actual apartment-block stairwell or lobby yet.** |
| Kitchen and bathroom | kitchen photo; bathroom only as a video poster. **Gap for bathrooms.** |
| Sofa, mattress, upholstery | **IMG_3362**, **IMG_3368**. No mattress footage yet. |
| Post-construction / renovation | new-flat set (before, team at windows, glass), steam video, office renovation |
| Before / after | **One** aligned pair (living room). |
| Brand | logos, icons |
| Video / social | 5 site videos, 5 new clips, AI reels (social only) |

## 6. Processing needed before the new batch goes live

1. Convert HEIC to JPEG, max 1600 px, sRGB, **strip all EXIF incl. GPS** (the pipeline used for
   the existing photos: `sips` → Pillow re-encode without metadata).
2. Videos: HEVC (`hvc1`) does not play in every browser. Re-encode to H.264 MP4 at 720×1280
   (AVFoundation export preset with `metadataItemFilter = .forSharing()` to drop location), and
   produce a **muted** variant for any autoplaying loop (strip the audio track; it carries
   household noise).
3. Posters: one still per video, served through the image optimizer.
4. IMG_3360 / IMG_3362: crop so faces are not the focus, and get the staff members' OK.
   IMG_3296: get the house owner's OK.
5. Descriptive Albanian filenames, e.g. `ekipi-pastrim-shkallesh-tirane.jpg`,
   `larje-divani-me-ekstraktor.mp4`, `uji-i-ndotur-pas-larjes-se-divanit.mp4`,
   `dritare-papafingo-me-merimanga.jpg`, `sallon-vile-tirane.jpg`.

Keep all originals in `media-source/`; never overwrite them.

## 7. Recommended mapping for the redesign (each photo once per page)

| Page / section | Primary asset | Secondary |
|---|---|---|
| Homepage hero | windowsTeam (team, wide, real) | — |
| Homepage "Ekipi në punë" | IMG_3357 stairs (photo) | IMG_3362 sofa loop (muted, portrait) |
| Homepage before/after | living-room pair | — |
| Homepage gallery | constructionBefore, kitchen, IMG_3296 (if allowed) | — |
| Business page | IMG_3357 | office renovation (small), windowsTeam not reused if it is the homepage hero on the same page set |
| Common areas page (new) | IMG_3357 | IMG_3356 video |
| Upholstery page (new) | IMG_3362 video | IMG_3368 video |
| Deep-clean page | steamFrame | IMG_3354 cobwebs, IMG_3360 loop |
| Villa page | IMG_3296 (with permission) | — |
| Apartments page | livingRoomClean | kitchen, hallway |
| Post-construction page | constructionGlass | constructionBefore + windowsTeam pair |
| Airbnb page | bedroom | guestRoom |
| Hotels page | guestRoom | — |
| Office page | text-led | office renovation (small) |

## 8. Photos Limoni should capture next

Ranked by how much they would help the new business positioning:

1. **An apartment-block stairwell, lobby or entrance** being cleaned (residential complexes).
2. **An office during or after a regular clean** (desks, kitchenette, meeting room), wide and sharp.
3. **True before/after pairs**, shot from the same spot (phone on the same mark): kitchen hob,
   oven, bathroom tiles, shower glass, sofa, mattress, window frame, stairs.
4. **The team arriving with equipment** (machines, products, uniforms), faces optional.
5. **Bathrooms** (currently only a video poster).
6. **Mattress cleaning** (upholstery page has sofas only).
7. Landscape (horizontal) clips of 5–10 s for any future hero video; all current clips are vertical.

Tips: shoot in good daylight, landscape for wide shots, hold the phone still, avoid showing
house numbers, family photos, documents or faces of clients; turn off location in the camera
app (Settings → Privacy → Location → Camera → Never) to stop GPS being written into files.
