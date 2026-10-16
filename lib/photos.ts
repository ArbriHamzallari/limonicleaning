// Every real photo on the site, described by what it actually shows (checked by eye).
// Never caption a photo as something it isn't: e.g. the "before" living room is only ever
// used as the "before" half of the comparison.

export interface PhotoAsset {
  src: string;
  alt: string;
  /** Short visible caption. */
  caption: string;
  orientation: "portrait" | "landscape";
  /** Real width/height ratio of the file, so large photos can show uncropped. */
  ratio: "3/4" | "4/3" | "9/16";
  /** Source is small (e.g. a frame from a phone video): never display it large. */
  lowRes?: boolean;
}

export const photos = {
  bedroom: {
    src: "/images/ekipi-shtrim-shtrati-tirane.jpg",
    alt: "Punonjëse e Limoni Cleaning duke rregulluar shtratin në një dhomë gjumi në Tiranë",
    caption: "Rregullimi i shtratit gjatë një pastrimi",
    orientation: "portrait",
    ratio: "3/4",
  },
  kitchen: {
    src: "/images/ekipi-pastrim-kuzhine-tirane.jpg",
    alt: "Punonjëse e Limoni Cleaning duke pastruar lavamanin e kuzhinës në një apartament në Tiranë",
    caption: "Pastrimi i kuzhinës",
    orientation: "portrait",
    ratio: "3/4",
  },
  livingRoomClean: {
    src: "/images/dhoma-ndenje-e-pastruar-tirane.jpg",
    alt: "Dhomë ndenjeje e rregullt dhe e pastër pas pastrimit",
    caption: "Dhomë ndenjeje pas pastrimit",
    orientation: "landscape",
    ratio: "4/3",
  },
  hallwayClean: {
    src: "/images/puna-jone-vizite-apartamenti-1.jpg",
    alt: "Korridor apartamenti me dysheme të pastër pas pastrimit",
    caption: "Korridor pas pastrimit",
    orientation: "portrait",
    ratio: "9/16",
  },
  windowsTeam: {
    src: "/images/ekipi-pastrim-xhamash-pas-ndertimit-tirane.jpg",
    alt: "Dy punonjëse të Limoni Cleaning duke pastruar xhamat e mëdhenj të një apartamenti të ri pas punimeve në Tiranë",
    caption: "Pastrimi i xhamave pas punimeve",
    orientation: "landscape",
    ratio: "4/3",
  },
  constructionBefore: {
    src: "/images/apartament-pas-ndertimit-para-pastrimit.jpg",
    alt: "Apartament i ri pas punimeve, me najlon në dysheme, kuti dhe ngjitëse mbi xhama, para pastrimit",
    caption: "Para pastrimit",
    orientation: "portrait",
    ratio: "3/4",
  },
  constructionGlass: {
    src: "/images/xhama-dhe-korniza-apartament-i-ri.jpg",
    alt: "Xhamat e mëdhenj dhe kornizat e zeza të dritareve në një apartament të ri në Tiranë",
    caption: "Xhamat dhe kornizat e dritareve",
    orientation: "landscape",
    ratio: "4/3",
  },
  steamFrame: {
    src: "/images/pastrim-me-avull-korniza-dere.jpg",
    alt: "Punonjëse duke pastruar me avull kornizën dhe binarin e një dere xhami rrëshqitëse",
    caption: "Pastrim me avull i kornizave dhe binarëve",
    orientation: "portrait",
    ratio: "9/16",
  },
  guestRoom: {
    src: "/images/dhome-e-pergatitur-per-mysafire.jpg",
    alt: "Dhomë gjumi e rregullt me peshqirë të palosur mbi shtrat, gati për mysafirët",
    caption: "Dhomë e përgatitur për mysafirët",
    orientation: "landscape",
    ratio: "4/3",
  },
  officeRenovation: {
    src: "/images/zyre-gjate-rinovimit-para-pastrimit.jpg",
    alt: "Zyrë gjatë rinovimit, me mure të sapolyera dhe najlon mbi dysheme, para pastrimit",
    caption: "Zyrë gjatë rinovimit, para pastrimit",
    orientation: "portrait",
    ratio: "9/16",
    lowRes: true,
  },
  // October 2026 (media-source/2026-10, GPS stripped). Staff and the house owner agreed to
  // publication (CLAUDE.md, 17 Oct). The stairs are in a multi-storey house, not an apartment
  // block: never caption them as a residential complex.
  stairsTeam: {
    src: "/images/ekipi-pastrim-shkallesh-tirane.jpg",
    alt: "Punonjëse e Limoni Cleaning duke pastruar shkallët prej graniti në një ndërtesë me disa kate",
    caption: "Pastrimi i shkallëve në një ndërtesë me disa kate",
    orientation: "portrait",
    ratio: "3/4",
  },
  villaSalon: {
    src: "/images/sallon-vile-tirane.jpg",
    alt: "Sallon i madh me dy llambadarë, divane klasike dhe një pikturë",
    caption: "Salloni i një vile pas pastrimit",
    orientation: "landscape",
    ratio: "4/3",
  },
  atticWindow: {
    src: "/images/dritare-papafingo-para-pastrimit.jpg",
    alt: "Dritare papafingoje me rrjeta merimangash në qoshe, para pastrimit",
    caption: "Dritarja e papafingos para pastrimit, një nga vendet që zakonisht harrohen",
    orientation: "portrait",
    ratio: "9/16",
  },
} satisfies Record<string, PhotoAsset>;

/** Short real clips (H.264, no sound, no location data). `label` is the accessible name. */
export interface VideoAsset {
  src: string;
  poster: string;
  label: string;
  caption: string;
}

export const videos = {
  sofaExtraction: {
    src: "/videos/larje-divani-me-ekstraktim.mp4",
    poster: "/images/larje-divani-me-ekstraktim.jpg",
    label: "Punonjës i Limoni Cleaning duke larë një divan blu me makineri ekstraktimi",
    caption: "Larja e një divani me makineri ekstraktimi",
  },
  sofaWater: {
    src: "/videos/uji-i-ndotur-pas-larjes-se-divanit.mp4",
    poster: "/images/uji-i-ndotur-pas-larjes-se-divanit.jpg",
    label: "Rezervuari i makinerisë me ujë të ndotur pas larjes së divanit",
    caption: "Uji që del nga divani pas larjes",
  },
  teamBedroom: {
    src: "/videos/ekipi-pastrim-dhome-gjumi.mp4",
    poster: "/images/ekipi-pastrim-dhome-gjumi.jpg",
    label: "Tre punonjës të Limoni Cleaning duke pastruar një dhomë gjumi",
    caption: "Ekipi gjatë një pastrimi me themel në një shtëpi me disa kate",
  },
  stairsAfter: {
    src: "/videos/shkalle-pas-pastrimit.mp4",
    poster: "/images/shkalle-pas-pastrimit.jpg",
    label: "Shkallë graniti dhe parmakë druri pas pastrimit",
    caption: "Shkallët dhe parmakët pas pastrimit",
  },
} satisfies Record<string, VideoAsset>;

export const beforeAfter = {
  beforeSrc: "/images/dhoma-ndenje-para-pastrimit.jpg",
  afterSrc: "/images/dhoma-ndenje-pas-pastrimit.jpg",
  beforeAlt: "Dhomë ndenjeje para pastrimit, me shishe dhe sende të shpërndara mbi tavolina",
  afterAlt: "E njëjta dhomë ndenjeje pas pastrimit, e rregullt dhe pa mbeturina",
  caption: "Dhoma e ndenjes para dhe pas pastrimit",
};

const aspectClass = { "3/4": "aspect-[3/4]", "4/3": "aspect-[4/3]", "9/16": "aspect-[9/16]" } as const;

/** Tailwind aspect class matching the photo's real proportions. */
export function naturalAspect(photo: PhotoAsset): string {
  return aspectClass[photo.ratio];
}
