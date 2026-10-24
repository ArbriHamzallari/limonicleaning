# Media nga pastrimet e 24 tetorit 2026

Fotot/video origjinale nga telefoni mbahen në `media-source/` (dosje lokale, e përjashtuar nga Git). Nuk vendosen direkt në `public/`, sepse mund të përmbajnë të dhëna EXIF/GPS dhe kanë madhësi të panevojshme.

## Përdorimi

1. Instaloni `ffmpeg` (me koduesin `libx264`) dhe kontrolloni që është në PATH.
2. Vendosni skedarët origjinalë `IMG_3463.jpg`, `IMG_3468.jpg`, `IMG_3464.MOV`, `IMG_3466.MOV`, `IMG_3467.MOV`, `IMG_3440.MOV`, `IMG_3441.MOV`, `IMG_3442.MOV`, `IMG_3443.MOV` në `media-source/` ose në një nën-dosje brenda tij.
3. Ekzekutoni:

```bash
npm run media:oct24
```

Nëse janë në një dosje tjetër:

```bash
npm run media:oct24 -- "/absolute/path/to/source-folder"
```

4. Kontrolloni fotot dhe videot e konvertuara në `public/images/` dhe `public/videos/`. Sigurohuni që në media nuk shfaqen informacione private që nuk duhen publikuar dhe që personat e filmuar kanë dhënë pëlqimin për publikim.
5. Shtoni vetëm skedarët e përpunuar në GitHub:

```bash
git add public/images public/videos
git commit -m "Add web-ready October cleaning photos and videos"
git push
```

**E rëndësishme:** skedarët e rinj shfaqen në faqet e mëposhtme vetëm kur ekzistojnë në `public/`. Mund ta bashkoni kodin e galerisë në `main` përpara importimit të medieve pa prishur faqen ekzistuese.

## Ku shfaqen

- `/pastrim-pas-ndertimit-tirane`: foto të pastrimit të pjesëve të sipërme dhe dyshemesë së apartamentit (`IMG_3468`, `IMG_3463`) dhe video të pllakave, banjës dhe ambientit (`IMG_3464`, `IMG_3466`, `IMG_3467`).
- `/puna-jone#apartament-tetor-2026`: të njëjtat pamje, të organizuara si projekt i ri rezidencial.
- `/puna-jone#kuzhine-profesionale-tetor-2026`: pamje të kuzhinës profesionale dhe pastrimit të pajisjeve inox (`IMG_3440`–`IMG_3443`).

Klipet nuk përshkruhen si **rezultat përfundimtar** apo si një krahasim **para/pas**. Shfaqen si pamje reale gjatë punës.

## Specifikimet

- Fotot: JPEG deri në 1600px, pa metadata të origjinalit.
- Videot: MP4 H.264, deri në 720px, 20fps, pa audio/metadata, poster JPEG për hapje të shpejtë.
- Klipet nuk nisin automatikisht. Videoja hapet vetëm me komandat e shfletuesit.
