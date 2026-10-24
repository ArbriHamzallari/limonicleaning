import { photos, type PhotoAsset } from "./photos";
import { latestApartmentPhotos, latestApartmentVideos, latestKitchenVideos } from "./latest-project-media";
import type { PageKey } from "./service-index";

// /puna-jone content, grouped by job. Text only describes what the photos and videos show;
// no invented outcomes, client names or addresses.

export interface PortfolioVideoAsset {
  src: string;
  poster: string;
  caption: string;
  /** Accessible name: what the clip shows. Falls back to the caption. */
  label?: string;
  /** For VideoObject structured data. */
  name: string;
  description: string;
  uploadDate: string;
  durationSeconds: number;
}

export interface PortfolioProject {
  id: string;
  title: string;
  text: string;
  /** The page the project links to (a service, or /per-biznese). */
  service: PageKey;
  photos: PhotoAsset[];
  videos: PortfolioVideoAsset[];
  /** Show the before/after slider in this project. */
  beforeAfter?: boolean;
}

export const portfolioProjects: PortfolioProject[] = [
  {
    id: "pas-ndertimit",
    title: "Apartament i ri pas punimeve",
    text: "Një apartament i sapopërfunduar në Tiranë, me najlon mbi dysheme, kuti dhe ngjitëse mbi xhama. Punuam te xhamat e mëdhenj, te kornizat dhe te binarët e dyerve rrëshqitëse, ku pluhuri i punimeve mblidhet më shumë. Kornizat dhe binarët i pastruam me avull.",
    service: "pas-ndertimit",
    photos: [photos.constructionBefore, photos.windowsTeam, photos.constructionGlass],
    videos: [
      {
        src: "/videos/pastrim-me-avull-korniza.mp4",
        poster: "/images/pastrim-me-avull-korniza-dere.jpg",
        caption: "Pastrim me avull i kornizës dhe binarit",
        name: "Pastrim me avull i kornizës së një dere rrëshqitëse",
        description: "Pamje reale nga celulari i ekipit: pastrim me avull i kornizës dhe binarit të një dere xhami pas punimeve.",
        uploadDate: "2026-09-21",
        durationSeconds: 4.33,
      },
    ],
  },
  {
    id: "apartament",
    title: "Dhomë ndenjeje, para dhe pas",
    text: "Një apartament me shishe, sende të shpërndara dhe qese mbeturinash në dhomën e ndenjes. Lëvizni vijën mbi foto për të parë të njëjtën dhomë para dhe pas pastrimit. Më poshtë: kuzhina gjatë pastrimit dhe disa video nga i njëjti lloj pune.",
    service: "apartamente",
    beforeAfter: true,
    // hallwayClean is the poster of the "pas pastrimit" clip below, so it isn't repeated as a photo.
    photos: [photos.kitchen],
    videos: [
      {
        src: "/videos/puna-jone-para-pastrimit.mp4",
        poster: "/images/puna-jone-para-pastrimit.jpg",
        caption: "Apartament, para fillimit të pastrimit",
        name: "Vizitë e apartamentit para fillimit të pastrimit",
        description: "Pamje reale nga celulari i ekipit, në apartamentin ku po nisim punën.",
        uploadDate: "2026-09-10",
        durationSeconds: 17.87,
      },
      {
        src: "/videos/puna-jone-vizite-apartamenti-1.mp4",
        poster: "/images/puna-jone-vizite-apartamenti-1.jpg",
        caption: "Apartament pas pastrimit",
        name: "Vizitë e apartamentit pas pastrimit",
        description: "Pamje reale nga celulari i ekipit, në apartamentin pas pastrimit.",
        uploadDate: "2026-09-11",
        durationSeconds: 25.97,
      },
      {
        src: "/videos/puna-jone-vizite-apartamenti-2.mp4",
        poster: "/images/puna-jone-vizite-apartamenti-2.jpg",
        caption: "Apartament që mirëmbajmë rregullisht",
        name: "Vizitë e një apartamenti që Limoni Cleaning mirëmban rregullisht",
        description: "Pamje reale nga celulari i ekipit, në një nga pronat që mirëmbajmë me vizita periodike.",
        uploadDate: "2026-09-11",
        durationSeconds: 34.57,
      },
    ],
  },
  {
    id: "mysafire",
    title: "Dhoma gati për mysafirët",
    text: "Te pronat me qira ditore dhe te dhomat për mysafirë, pastrimi mbaron me shtratin e rregulluar dhe dhomën gati për ardhjen e radhës.",
    service: "airbnb",
    photos: [photos.bedroom, photos.guestRoom],
    videos: [],
  },
  {
    id: "zyre",
    title: "Zyrë gjatë rinovimit",
    text: "Një zyrë me mure të sapolyera, najlon mbi dysheme dhe mjete pune ende në dhomë. Kështu duket një ambient para pastrimit pas punimeve.",
    service: "zyra",
    photos: [],
    videos: [
      {
        src: "/videos/zyre-gjate-rinovimit.mp4",
        poster: "/images/zyre-gjate-rinovimit-para-pastrimit.jpg",
        caption: "Zyrë gjatë rinovimit, para pastrimit",
        name: "Zyrë gjatë rinovimit, para pastrimit",
        description: "Pamje reale nga celulari i ekipit, në një zyrë me mure të sapolyera para pastrimit.",
        uploadDate: "2026-09-29",
        durationSeconds: 4.55,
      },
    ],
  },
];

// October 24 projects: these appear only after processed images/video files have been
// committed to public/. The commercial kitchen is kept separate from residential cleaning.
if (latestApartmentPhotos.length || latestApartmentVideos.length) {
  portfolioProjects.unshift({
    id: "apartament-tetor-2026",
    title: "Apartament i ri, pastrim pas punimeve",
    text: "Pastrimi në një apartament të ri në Tiranë: puna në pjesët e larta, në dysheme, te pllakat dhe në banjë. Pamjet tregojnë procesin gjatë punës, jo një rezultat para/pas.",
    service: "pas-ndertimit",
    photos: latestApartmentPhotos,
    videos: latestApartmentVideos,
  });
}

if (latestKitchenVideos.length) {
  portfolioProjects.push({
    id: "kuzhine-profesionale-tetor-2026",
    title: "Punë pastrimi në një kuzhinë profesionale",
    text: "Pastrimi i një kuzhine profesionale: muret, aspiratorët dhe pajisjet inox. Pamjet janë marrë gjatë punës, jo pas përfundimit të saj.",
    service: "biznese",
    photos: [],
    videos: latestKitchenVideos,
  });
}
