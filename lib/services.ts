import type { Metadata } from "next";
import { serviceIndex, serviceSlugs, type ServiceSlug } from "./service-index";
import { pageMetadata } from "./seo";
import { photos, type PhotoAsset } from "./photos";
import type { FaqEntry } from "./content";

export type { ServiceSlug } from "./service-index";

// All service page copy. Every app/pastrim-*-tirane/page.tsx renders one entry through
// components/ServicePage.tsx, but each service picks its own sections and headings so the
// pages don't read as copies. Rules: no prices, no em dashes, no claims beyond what the
// business confirmed (CLAUDE.md). Voice: short sentences, concrete things, "we" verbs.

export const priceAnswer =
  "Çmimi varet nga madhësia dhe gjendja e pronës. Na lini numrin dhe ju japim ofertën.";

export type ChecklistItem = string | { label: string; text: string };

export type ServiceSection =
  | { kind: "checklist"; title: string; items: ChecklistItem[]; note?: string; id?: string }
  | { kind: "steps"; title: string; steps: { title: string; text: string }[]; id?: string }
  | { kind: "photoStory"; title: string; text: string; photos: PhotoAsset[]; id?: string }
  | {
      kind: "pair";
      title: string;
      text?: string;
      left: PhotoAsset;
      right: PhotoAsset;
      id?: string;
    }
  | {
      kind: "text";
      title: string;
      paragraphs: string[];
      link?: { href: string; label: string };
      id?: string;
    }
  | { kind: "note"; text: string; id?: string };

export interface Service {
  slug: ServiceSlug;
  path: string;
  navLabel: string;
  metaTitle: string;
  /** 140 to 155 characters, ends in the lead action. */
  metaDescription: string;
  h1: string;
  /** Two or three short sentences. */
  intro: string;
  /** One sentence, used on /sherbime. */
  summary: string;
  /** Hero photo. Omitted = text-only hero. Never the homepage hero (windowsTeam). */
  hero?: PhotoAsset;
  sections: ServiceSection[];
  /** Rendered only when there are 3 or more. */
  faq: FaqEntry[];
  related: [ServiceSlug, ServiceSlug];
}

type ServiceData = Omit<Service, "slug" | "path" | "navLabel">;

/** The apartment checklist, also shown on the homepage ("Çfarë përfshin një pastrim"). */
export const apartmentIncludes = [
  "Fshirje pluhuri në të gjitha dhomat",
  "Sipërfaqet dhe pasqyrat",
  "Kuzhina: sipërfaqet dhe lavamani",
  "Banjo: lavamani, dushi, tualeti",
  "Fshirje dhe larje e dyshemeve",
  "Zbrazje e koshave dhe rregullim bazë",
];

const data: Record<ServiceSlug, ServiceData> = {
  apartamente: {
    metaTitle: "Pastrim Shtëpie dhe Apartamenti në Tiranë",
    metaDescription:
      "Pastrim shtëpie dhe apartamenti në Tiranë, i rregullt ose me themel, nga ekip me mbi 10 vjet përvojë. Na lini numrin ose na shkruani në WhatsApp.",
    h1: "Pastrim shtëpie dhe apartamenti në Tiranë",
    intro:
      "Vijmë në apartament ose në shtëpi, nga studio deri te 4+1. Pastrojmë dhomë pas dhome: kuzhinën, banjon, dhomat dhe dyshemetë.",
    summary: "Pastrim i rregullt ose pastrim i thellë për apartamente dhe shtëpi të çdo madhësie.",
    hero: photos.livingRoomClean,
    sections: [
      {
        kind: "checklist",
        title: "Dhomë pas dhome",
        items: [
          { label: "Kuzhina", text: "Sipërfaqet dhe lavamani." },
          { label: "Banjo", text: "Lavamani, dushi, tualeti dhe pasqyra." },
          { label: "Dhomat", text: "Fshijmë pluhurin, pastrojmë sipërfaqet, rregullojmë." },
          { label: "Dyshemetë", text: "I fshijmë dhe i lajmë në të gjithë shtëpinë." },
          { label: "Koshat", text: "I zbrazim para se të largohemi." },
        ],
        note: "Larja dhe hekurosja e rrobave mund të organizohen veçmas.",
      },
      {
        kind: "photoStory",
        title: "Nga kuzhina te korridori",
        text: "Çdo pastrim ndjek të njëjtën listë pune, që rezultati të mos varet nga rastësia. Kuzhina, banjo, dhomat, pastaj dyshemetë deri te dera e hyrjes.",
        photos: [photos.kitchen, photos.hallwayClean],
      },
      {
        kind: "text",
        title: "I rregullt apo me themel?",
        paragraphs: [
          "Pastrimi i rregullt e mban shtëpinë të pastër javë pas jave.",
          "Kur hyni në një pronë të re, ose kur shtëpia s'është pastruar thellë prej kohësh, zgjidhni pastrimin me themel: aty hyjnë edhe dollapët, frigoriferi dhe furra nga brenda.",
        ],
        link: { href: "/pastrim-me-themel-tirane", label: "Si bëhet pastrimi me themel" },
      },
    ],
    faq: [
      {
        question: "Çfarë përfshin pastrimi i rregullt?",
        answer:
          "Fshijmë pluhurin, pastrojmë sipërfaqet dhe pasqyrat, lajmë dyshemetë, pastrojmë kuzhinën dhe banjon, zbrazim koshat dhe rregullojmë.",
      },
      {
        question: "A mund të vini rregullisht?",
        answer: "Po. Frekuencën e vendosim bashkë: çdo javë, çdo dy javë ose kur ju duhet.",
      },
      { question: "Sa kushton pastrimi i apartamentit?", answer: priceAnswer },
    ],
    related: ["me-themel", "airbnb"],
  },

  airbnb: {
    metaTitle: "Pastrim Airbnb në Tiranë për Pronarë",
    metaDescription:
      "Pastrim Airbnb në Tiranë pas çdo check-out, që prona të jetë gati për mysafirin tjetër. Për një ose disa prona. Na lini numrin ose shkruani në WhatsApp.",
    h1: "Pastrim Airbnb në Tiranë",
    intro:
      "Mysafiri del, ne hyjmë. Pastrojmë pronën pas çdo check-out-i, ndërrojmë çarçafët dhe e lëmë gati për mysafirin tjetër.",
    summary: "Pas çdo check-out-i, pastrimi dhe përgatitja e pronës për mysafirin tjetër.",
    hero: photos.bedroom,
    sections: [
      {
        kind: "steps",
        title: "Si funksionon pastrimi pas check-out-it",
        steps: [
          { title: "Kalendari", text: "Na dërgoni datat e check-out-it ose kalendarin e rezervimeve." },
          { title: "Pastrimi", text: "Vijmë pasi del mysafiri dhe pastrojmë dhomat, banjon dhe kuzhinën." },
          {
            title: "Shtrati",
            text: "Rregullojmë shtratin dhe ndërrojmë çarçafët kur ka të pastër në pronë.",
          },
          { title: "Kontrolli", text: "Kontrollojmë ambientin në fund. Prona është gati për mysafirin tjetër." },
        ],
      },
      {
        kind: "checklist",
        title: "Çfarë bëjmë në çdo pastrim",
        items: [
          { label: "Dhoma e gjumit", text: "Krevati, çarçafët kur janë në pronë, sipërfaqet, dyshemeja." },
          { label: "Banjo", text: "Tualeti, dushi, lavamani, pasqyra, dyshemeja." },
          { label: "Kuzhina", text: "Sipërfaqet, banaku, pianura dhe lavamani." },
          { label: "Në fund", text: "Përgatitje e pronës për mysafirin tjetër dhe një kontroll i fundit." },
        ],
        note: "Larja dhe hekurosja e çarçafëve, si dhe rimbushja e produkteve të konsumit, organizohen veçmas.",
      },
      {
        kind: "photoStory",
        title: "Gati për mysafirin tjetër",
        text: "Shtrati i rregulluar, peshqirët në vend, dhoma e ndenjes e rregullt pas qëndrimit të fundit.",
        photos: [photos.guestRoom, photos.livingRoomClean],
      },
      {
        kind: "text",
        id: "pronare",
        title: "Për një pronë apo për disa prona",
        paragraphs: [
          "Me disa prona, rëndësi ka jo vetëm pastrimi, por edhe organizimi i tij sipas kalendarit. Na tregoni sa prona keni dhe sa shpesh ndërrohen mysafirët, dhe e planifikojmë bashkë.",
          "Bashkëpunojmë me Prago, kompani që menaxhon prona me qira ditore, për pastrimin e pronave Airbnb.",
        ],
        link: { href: "https://www.prago.al/", label: "Rreth Prago" },
      },
    ],
    faq: [
      { question: "Sa kushton pastrimi i një Airbnb?", answer: priceAnswer },
      {
        question: "A i ndërroni çarçafët?",
        answer: "Po, kur ka çarçafë të pastër në pronë. Larjen dhe hekurosjen i organizojmë veçmas.",
      },
      {
        question: "Sa shpesh duhet pastruar një Airbnb?",
        answer: "Zakonisht pas çdo check-out-i. Na tregoni kalendarin e pronës dhe e organizojmë bashkë.",
      },
      {
        question: "Çfarë ju duhet për ofertën?",
        answer:
          "Sa prona keni, sa të mëdha janë, sa herë në muaj pastrohen dhe në cilën zonë ndodhen. Na i shkruani te formulari ose në WhatsApp.",
      },
    ],
    related: ["apartamente", "hotele"],
  },

  zyra: {
    metaTitle: "Pastrim Zyrash në Tiranë",
    metaDescription:
      "Pastrim zyrash dhe ambientesh biznesi në Tiranë, me plan sipas orarit tuaj të punës: para hapjes ose pas mbylljes. Na lini numrin ose shkruani në WhatsApp.",
    h1: "Pastrim zyrash në Tiranë",
    intro:
      "Pastrojmë zyra dhe biznese të vogla e të mesme në Tiranë. Vijmë kur nuk ju pengojmë: para hapjes, pas mbylljes ose në ditët që zgjidhni.",
    summary: "Pastrim periodik për zyra dhe biznese në Tiranë.",
    sections: [
      {
        kind: "text",
        title: "Sipas orarit tuaj",
        paragraphs: [
          "Zyra duhet të jetë e pastër kur vjen stafi, jo plot me njerëz që pastrojnë. Orarin e vizitave e vendosim bashkë.",
          "Përpiqemi të dërgojmë të njëjtin ekip çdo herë, që stafi juaj ta njohë kush hyn në zyrë.",
        ],
      },
      {
        kind: "checklist",
        title: "Në çdo vizitë",
        items: [
          "Tavolinat dhe sipërfaqet e punës",
          "Kuzhina ose salla e çajit",
          "Fshirje dhe larje e dyshemeve",
          "Zbrazje e koshave",
        ],
      },
      {
        kind: "photoStory",
        title: "Edhe pas rinovimit",
        text: "Kur zyra rinovohet, e pastrojmë pasi mbarojnë punimet: pluhuri, boja, najloni mbi dysheme.",
        photos: [photos.officeRenovation],
      },
    ],
    faq: [
      {
        question: "A pastroni jashtë orarit të punës?",
        answer: "Po. Vijmë para hapjes, pas mbylljes ose në ditë të caktuara të javës.",
      },
      {
        question: "Sa shpesh vini?",
        answer: "E vendosim bashkë, sipas madhësisë së zyrës dhe numrit të njerëzve që punojnë aty.",
      },
      { question: "Sa kushton pastrimi i zyrës?", answer: priceAnswer },
    ],
    related: ["hotele", "pas-ndertimit"],
  },

  vila: {
    metaTitle: "Pastrim Vilash në Tiranë",
    metaDescription:
      "Pastrim vile në Tiranë me ekip të dedikuar dhe plan sipas kateve, dhomave dhe banjove të shtëpisë. Na lini numrin ose na shkruani në WhatsApp për ofertë.",
    h1: "Pastrim vile në Tiranë",
    intro:
      "Një vilë ka më shumë kate, më shumë banjo, më shumë xhama. Vijmë me ekip të dedikuar dhe fillojmë me një vlerësim të pronës.",
    summary: "Ekip i dedikuar dhe plan pastrimi për vila dhe shtëpi private të mëdha.",
    sections: [
      {
        kind: "steps",
        title: "Si e organizojmë",
        steps: [
          { title: "Vlerësimi", text: "Shohim katet, dhomat dhe banjot, që të dimë sa kohë dhe sa njerëz duhen." },
          { title: "Plani", text: "Vendosim bashkë çfarë pastrohet dhe në çfarë radhe." },
          { title: "Pastrimi", text: "Ekipi vjen në ditën e caktuar dhe pastron dhomat, kuzhinën dhe banjot." },
        ],
      },
      {
        kind: "note",
        text: "E përgatitni vilën para sezonit ose pas tij? Na shkruani datat dhe e planifikojmë.",
      },
    ],
    faq: [
      {
        question: "Pse duhet një vlerësim para pastrimit?",
        answer: "Sepse vilat ndryshojnë shumë. Vlerësimi na tregon sa kohë dhe sa njerëz duhen, që oferta të jetë e saktë.",
      },
      {
        question: "A bëni pastrim me themel për vila?",
        answer: "Po, pastrimi me themel bëhet për çdo lloj prone, edhe për vila.",
      },
      { question: "Sa kushton pastrimi i vilës?", answer: priceAnswer },
    ],
    related: ["apartamente", "me-themel"],
  },

  "me-themel": {
    metaTitle: "Pastrim me Themel në Tiranë",
    metaDescription:
      "Pastrim me themel në Tiranë: brenda dollapëve, frigoriferit dhe furrës, prapa mobilieve dhe te kornizat. Na lini numrin ose na shkruani në WhatsApp.",
    h1: "Pastrim me themel në Tiranë",
    intro:
      "Një pastrim i thellë për ambiente që kanë nevojë për më shumë se pastrimi i përditshëm. Hapim dollapët, lëvizim mobiljet, pastrojmë kornizat dhe binarët.",
    summary: "Pastrim i thellë, nga sipërfaqet deri te vendet që zakonisht harrohen.",
    hero: photos.steamFrame,
    sections: [
      {
        kind: "checklist",
        title: "Vendet që zakonisht harrohen",
        items: [
          "Brenda dollapëve të kuzhinës",
          "Frigoriferi dhe furra nga brenda",
          "Prapa dhe poshtë mobilieve që lëvizen",
          "Kornizat e dyerve dhe të dritareve",
          "Bazamentet",
          "Banjo dhe kuzhina, çdo sipërfaqe",
        ],
        note: "Plus gjithçka që bëjmë në pastrimin e rregullt.",
      },
      {
        kind: "checklist",
        title: "Kur ka kuptim",
        items: [
          "Para se të hyni në një apartament ose zyrë të re",
          "Kur prona s'është pastruar thellë prej kohësh",
          "Një ose dy herë në vit",
          "Para ose pas një feste me shumë të ftuar",
        ],
      },
    ],
    faq: [
      {
        question: "Sa shpesh duhet bërë pastrimi me themel?",
        answer: "Zakonisht një ose dy herë në vit, ose kur hyni në një pronë të re.",
      },
      {
        question: "Cili është ndryshimi nga pastrimi i rregullt?",
        answer:
          "Pastrimi i rregullt mban pastër atë që përdoret çdo ditë. Pastrimi me themel shkon edhe brenda dollapëve, frigoriferit e furrës dhe prapa mobilieve.",
      },
      { question: "Sa kushton pastrimi me themel?", answer: priceAnswer },
    ],
    related: ["apartamente", "pas-ndertimit"],
  },

  "pas-ndertimit": {
    metaTitle: "Pastrim pas Ndërtimit në Tiranë",
    metaDescription:
      "Pastrim pas ndërtimit ose rinovimit në Tiranë: heqim pluhurin nga dyshemetë, xhamat, dyert dhe dritaret. Na lini numrin ose na shkruani në WhatsApp.",
    h1: "Pastrim pas ndërtimit dhe rinovimit në Tiranë",
    intro:
      "Punimet mbarojnë, pluhuri mbetet: mbi dysheme, mbi xhama, brenda binarëve të dyerve. Ne e heqim, që prona të jetë gati për t'u banuar.",
    summary: "Heqja e pluhurit të punimeve nga çdo sipërfaqe, para se prona të banohet.",
    hero: photos.constructionGlass,
    sections: [
      {
        kind: "pair",
        title: "Një apartament i ri në Tiranë",
        text: "Najlon mbi dysheme, kuti dhe ngjitëse mbi xhama. Pastaj ekipi te dritaret.",
        left: photos.constructionBefore,
        right: photos.windowsTeam,
      },
      {
        kind: "checklist",
        title: "Çfarë pastrojmë pas punimeve",
        items: [
          "Pluhurin nga çdo sipërfaqe",
          "Dyshemetë dhe pllakat",
          "Xhamat dhe kornizat",
          "Binarët e dyerve rrëshqitëse",
          "Mbetjet e lehta të pastrimit",
        ],
      },
      {
        kind: "note",
        text: "Na kontaktoni pasi punimet të kenë përfunduar dhe mbetjet e mëdha të jenë larguar.",
      },
    ],
    faq: [
      {
        question: "A i largoni edhe mbetjet e ndërtimit?",
        answer:
          "Jo. Ne heqim pluhurin dhe papastërtinë e punimeve. Mbetjet e mëdha (inerte, tulla, materiale) duhet të largohen para se të vijmë.",
      },
      {
        question: "Kur duhet t'ju kontaktoj?",
        answer: "Pasi punimet të kenë përfunduar dhe mbetjet e mëdha të jenë larguar.",
      },
      { question: "Sa kushton pastrimi pas ndërtimit?", answer: priceAnswer },
    ],
    related: ["me-themel", "zyra"],
  },

  hotele: {
    metaTitle: "Pastrim Hotelesh në Tiranë",
    metaDescription:
      "Pastrim hotelesh dhe apart-hotelesh në Tiranë: dhoma sipas check-in/check-out dhe hapësira të përbashkëta. Na lini numrin ose na shkruani në WhatsApp.",
    h1: "Pastrim hotelesh në Tiranë",
    intro:
      "Pastrojmë dhoma dhe hapësira të përbashkëta për hotele dhe apart-hotele. Ekipi përshtatet me numrin e dhomave dhe me orarin e check-in/check-out.",
    summary: "Dhoma dhe hapësira të përbashkëta, me ekip që përshtatet me volumin tuaj.",
    hero: photos.guestRoom,
    sections: [
      {
        kind: "text",
        title: "Fillojmë me një bisedë",
        paragraphs: [
          "Numri i dhomave, ritmi i check-in/check-out dhe orët e pikut ndryshojnë nga një hotel te tjetri. Na tregoni si punoni dhe ju propozojmë një plan.",
          "Në sezonin e lartë mund të sjellim ekip shtesë, sipas marrëveshjes.",
        ],
      },
    ],
    faq: [
      {
        question: "A mund të na ndihmoni vetëm gjatë sezonit?",
        answer: "Po. Sjellim ekip shtesë në periudhat me shumë punë, sipas marrëveshjes.",
      },
      {
        question: "A pastroni edhe hapësirat e përbashkëta?",
        answer: "Po, përveç dhomave pastrojmë edhe hapësirat e përbashkëta, sipas planit që vendosim bashkë.",
      },
      { question: "Sa kushton pastrimi për një hotel?", answer: priceAnswer },
    ],
    related: ["airbnb", "zyra"],
  },
};

export const services: Service[] = serviceSlugs.map((slug) => ({
  slug,
  path: serviceIndex[slug].path,
  navLabel: serviceIndex[slug].navLabel,
  ...data[slug],
}));

export function getService(slug: ServiceSlug): Service {
  return services.find((s) => s.slug === slug)!;
}

/** A photo for list rows and social previews: the hero, if it's sharp enough. */
export function cardImage(service: Service): PhotoAsset | undefined {
  return service.hero && !service.hero.lowRes ? service.hero : undefined;
}

export function serviceMetadata(slug: ServiceSlug): Metadata {
  const service = getService(slug);
  return pageMetadata({
    title: service.metaTitle,
    description: service.metaDescription,
    path: service.path,
    ogImage: cardImage(service)?.src,
  });
}
