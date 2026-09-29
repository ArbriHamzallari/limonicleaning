// Every real photo on the site, described by what it actually shows (checked by eye).
// Never caption a photo as something it isn't: e.g. the "before" living room is only ever
// used as the "before" half of the comparison.

export interface PhotoAsset {
  src: string;
  alt: string;
  /** Short visible caption. */
  caption: string;
  orientation: "portrait" | "landscape";
}

export const photos = {
  bedroom: {
    src: "/images/ekipi-shtrim-shtrati-tirane.jpg",
    alt: "Punonjëse e Limoni Cleaning duke rregulluar shtratin në një dhomë gjumi në Tiranë",
    caption: "Rregullimi i shtratit gjatë një pastrimi",
    orientation: "portrait",
  },
  kitchen: {
    src: "/images/ekipi-pastrim-kuzhine-tirane.jpg",
    alt: "Punonjëse e Limoni Cleaning duke pastruar lavamanin e kuzhinës në një apartament në Tiranë",
    caption: "Pastrimi i kuzhinës",
    orientation: "portrait",
  },
  livingRoomClean: {
    src: "/images/dhoma-ndenje-e-pastruar-tirane.jpg",
    alt: "Dhomë ndenjeje e rregullt dhe e pastër pas pastrimit",
    caption: "Dhomë ndenjeje pas pastrimit",
    orientation: "landscape",
  },
  hallwayClean: {
    src: "/images/puna-jone-vizite-apartamenti-1.jpg",
    alt: "Korridor apartamenti me dysheme të pastër pas pastrimit",
    caption: "Korridor pas pastrimit",
    orientation: "portrait",
  },
} satisfies Record<string, PhotoAsset>;

export const beforeAfter = {
  beforeSrc: "/images/dhoma-ndenje-para-pastrimit.jpg",
  afterSrc: "/images/dhoma-ndenje-pas-pastrimit.jpg",
  beforeAlt: "Dhomë ndenjeje para pastrimit, me shishe dhe sende të shpërndara mbi tavolina",
  afterAlt: "E njëjta dhomë ndenjeje pas pastrimit, e rregullt dhe pa mbeturina",
  caption: "Dhomë ndenjeje, para dhe pas pastrimit",
};
