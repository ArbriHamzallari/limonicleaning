// New project photos/videos processed from original phone files. Originals are kept in the
// git-ignored media-source/ folder. Missing processed files are never rendered on the site:
// the gallery appears automatically after web-ready assets are committed to public/.
import { existsSync } from "node:fs";
import { join } from "node:path";
import type { PhotoAsset } from "./photos";

function published(publicPath: string) {
  return existsSync(join(process.cwd(), "public", publicPath.startsWith("/") ? publicPath.slice(1) : publicPath));
}

const residentialPhotos: PhotoAsset[] = [
  {
    src: "/images/ekipi-pastrim-tavani-apartament-i-ri.jpg",
    alt: "Punonjëse duke pastruar pjesën e sipërme të murit dhe tavanit në një apartament të sapopërfunduar",
    caption: "Pastrimi i pjesëve të larta në apartament pas punimeve",
    orientation: "portrait",
    ratio: "3/4",
  },
  {
    src: "/images/ekipi-pastrim-dysheme-apartament-i-ri.jpg",
    alt: "Dy punonjëse duke hequr mbetjet e punimeve nga dyshemeja me pllaka në një apartament të ri",
    caption: "Heqja e mbetjeve të punimeve nga pllakat e dyshemesë",
    orientation: "portrait",
    ratio: "3/4",
  },
];

interface NewVideo {
  src: string;
  poster: string;
  caption: string;
  label: string;
  name: string;
  description: string;
  uploadDate: string;
  durationSeconds: number;
}

const residenceVideos: NewVideo[] = [
  {
    src: "/videos/pastrim-pllakash-apartament-i-ri.mp4",
    poster: "/images/pastrim-pllakash-apartament-i-ri.jpg",
    label: "Punonjëse duke hequr papastërti nga sipërfaqja e pllakave në apartament të ri",
    caption: "Punë e detajuar në pllakat e apartamentit",
    name: "Pastrimi i pllakave të apartamentit pas punimeve",
    description: "Pamje reale të ekipit duke punuar në detaje mbi dyshemenë e një apartamenti të ri në Tiranë.",
    uploadDate: "2026-10-24",
    durationSeconds: 5.6,
  },
  {
    src: "/videos/pamje-banjo-apartament-i-ri.mp4",
    poster: "/images/pamje-banjo-apartament-i-ri.jpg",
    label: "Pamje e banjës së një apartamenti të ri me pllaka gri gjatë fazës së pastrimit",
    caption: "Detajet e banjës së apartamentit të ri",
    name: "Pamje të banjës së apartamentit të ri",
    description: "Pamje e banjës me pllaka gri gjatë pastrimit pas punimeve.",
    uploadDate: "2026-10-24",
    durationSeconds: 9.3,
  },
  {
    src: "/videos/pamje-apartament-pas-punimeve.mp4",
    poster: "/images/pamje-apartament-pas-punimeve.jpg",
    label: "Pamje nga dhomat e një apartamenti të ri gjatë pastrimit pas punimeve",
    caption: "Pamje nga ambienti gjatë punës pas ndërtimit",
    name: "Ambient i ri gjatë pastrimit pas punimeve",
    description: "Pamje të apartamentit në Tiranë gjatë fazës së pastrimit pas punimeve.",
    uploadDate: "2026-10-24",
    durationSeconds: 7.6,
  },
];

const kitchenVideos: NewVideo[] = [
  {
    src: "/videos/kuzhine-profesionale-gjendja-fillestare.mp4",
    poster: "/images/kuzhine-profesionale-gjendja-fillestare.jpg",
    label: "Pamje e një kuzhine profesionale me aspiratorë inox dhe tavolina të mbuluara",
    caption: "Kuzhina profesionale, me aspiratorë dhe pajisje inox",
    name: "Kuzhinë profesionale: pamje e ambientit",
    description: "Pamje e ambientit dhe e pajisjeve inox të një kuzhine profesionale ku punoi ekipi.",
    uploadDate: "2026-10-24",
    durationSeconds: 7.1,
  },
  {
    src: "/videos/ekipi-pastrim-kuzhine-profesionale.mp4",
    poster: "/images/ekipi-pastrim-kuzhine-profesionale.jpg",
    label: "Ekipi i Limoni Cleaning duke pastruar muret dhe aspiratorët në një kuzhinë profesionale",
    caption: "Ekipi duke pastruar muret dhe aspiratorët e kuzhinës",
    name: "Punë pastrimi në kuzhinë profesionale",
    description: "Pamje reale të ekipit gjatë punës në një kuzhinë profesionale.",
    uploadDate: "2026-10-24",
    durationSeconds: 5.6,
  },
  {
    src: "/videos/pastrim-siperfaqe-inox-1.mp4",
    poster: "/images/pastrim-siperfaqe-inox-1.jpg",
    label: "Ekipi duke pastruar një dollap inox në një kuzhinë profesionale",
    caption: "Pastrimi i një dollapi inox",
    name: "Pastrimi i një dollapi inox",
    description: "Pamje nga pastrimi i pajisjeve inox në një kuzhinë profesionale.",
    uploadDate: "2026-10-24",
    durationSeconds: 4.3,
  },
  {
    src: "/videos/pastrim-siperfaqe-inox-2.mp4",
    poster: "/images/pastrim-siperfaqe-inox-2.jpg",
    label: "Ekipi duke pastruar një dollap inox dhe aspiratorin e një kuzhine profesionale",
    caption: "Pastrimi i dollapit inox dhe i aspiratorit",
    name: "Pastrimi i dollapit inox dhe i aspiratorit",
    description: "Pamje reale nga pastrimi i pajisjeve inox dhe i aspiratorit në një kuzhinë profesionale.",
    uploadDate: "2026-10-24",
    durationSeconds: 6.4,
  },
];

export const latestApartmentPhotos = residentialPhotos.filter((photo) => published(photo.src));
export const latestApartmentVideos = residenceVideos.filter((video) => published(video.src) && published(video.poster));
export const latestKitchenVideos = kitchenVideos.filter((video) => published(video.src) && published(video.poster));
