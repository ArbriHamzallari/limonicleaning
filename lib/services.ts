import type { Metadata } from "next";
import { serviceIndex, serviceSlugs, type ServiceSlug } from "./service-index";
import { pageMetadata } from "./seo";
import { photos, type PhotoAsset } from "./photos";
import type { FaqEntry } from "./content";

export type { ServiceSlug } from "./service-index";

// All service page copy. Every app/pastrim-*-tirane/page.tsx renders one entry through
// components/ServicePage.tsx. Rules: no prices, no em dashes, no claims beyond what the
// business confirmed (see CLAUDE.md). Price questions always get the same answer.

export const priceAnswer =
  "Çmimi varet nga madhësia dhe gjendja e pronës. Na lini numrin dhe ju japim ofertën.";

export interface Service {
  slug: ServiceSlug;
  path: string;
  navLabel: string;
  metaTitle: string;
  /** 140 to 155 characters, ends in the lead action. */
  metaDescription: string;
  h1: string;
  /** Two sentences max. */
  intro: string;
  /** One sentence for cards. */
  summary: string;
  includes: string[];
  /** Qualifier shown under the includes list (what is extra or excluded). */
  includesNote?: string;
  goodFor: string[];
  howWeWork: { title: string; text: string };
  faq: FaqEntry[];
  /** First image is the hero; the rest form the photo block. Empty = text-only page. */
  images: PhotoAsset[];
  related: [ServiceSlug, ServiceSlug];
}

type ServiceData = Omit<Service, "slug" | "path" | "navLabel">;

const data: Record<ServiceSlug, ServiceData> = {
  apartamente: {
    metaTitle: "Pastrim Shtëpie dhe Apartamenti në Tiranë",
    metaDescription:
      "Pastrim shtëpie dhe apartamenti në Tiranë, i rregullt ose me themel, nga ekip me mbi 10 vjet eksperiencë. Na lini numrin ose na shkruani në WhatsApp.",
    h1: "Pastrim shtëpie dhe apartamenti në Tiranë",
    intro:
      "Pastrojmë apartamente dhe shtëpi të çdo madhësie, nga studio deri te 4+1. Ekipi vjen i pajisur dhe trajton çdo dhomë me kujdes.",
    summary: "Pastrim i rregullt ose me themel për apartamente dhe shtëpi të çdo madhësie.",
    includes: [
      "Fshirje pluhuri në të gjitha dhomat",
      "Pastrim i sipërfaqeve dhe i pasqyrave",
      "Larje e dyshemeve",
      "Pastrim i kuzhinës dhe i banjës",
      "Zbrazje e koshave dhe rregullim bazë",
    ],
    includesNote: "Larja dhe hekurosja e rrobave mund të organizohen veçmas, si shërbim shtesë.",
    goodFor: [
      "Kush do ta mbajë shtëpinë të pastër rregullisht, pa u marrë vetë me të",
      "Kush po hyn ose po largohet nga një apartament me qira",
      "Pronarë që duan ta dorëzojnë apartamentin të pastër te qiramarrësi i ri",
      "Pas festave ose pas një periudhe të gjatë pa pastrim",
    ],
    howWeWork: {
      title: "I rregullt apo me themel?",
      text: "Pastrimi i rregullt e mban shtëpinë të pastër javë pas jave. Kur apartamenti ka nevojë për më shumë, para se të hyni në një pronë të re ose pas një kohe të gjatë pa pastrim, sugjerojmë pastrimin me themel, që përfshin edhe brenda dollapëve, frigoriferit dhe furrës.",
    },
    faq: [
      {
        question: "Çfarë përfshin pastrimi i rregullt?",
        answer:
          "Fshirje pluhuri, pastrim sipërfaqesh dhe pasqyrash, larje dyshemesh, pastrim i kuzhinës dhe i banjës, zbrazje koshash dhe rregullim bazë.",
      },
      {
        question: "Cili është ndryshimi mes pastrimit të rregullt dhe atij me themel?",
        answer:
          "Pastrimi i rregullt e mban ambientin të pastër. Pastrimi me themel shkon më thellë: brenda dollapëve, frigoriferit, furrës dhe te kornizat. Ka kuptim një ose dy herë në vit, ose kur hyni në një pronë të re.",
      },
      {
        question: "A mund të vini rregullisht?",
        answer: "Po. Organizojmë pastrim periodik sipas nevojës suaj. Frekuencën e vendosim bashkë.",
      },
      { question: "Sa kushton pastrimi i apartamentit?", answer: priceAnswer },
    ],
    images: [photos.kitchen, photos.livingRoomClean, photos.hallwayClean],
    related: ["me-themel", "airbnb"],
  },

  airbnb: {
    metaTitle: "Pastrim Airbnb në Tiranë për Pronarë",
    metaDescription:
      "Pastrim Airbnb në Tiranë pas çdo check-out, që prona të jetë gati për mysafirin tjetër. Për një ose disa prona. Na lini numrin ose shkruani në WhatsApp.",
    h1: "Pastrim Airbnb në Tiranë",
    intro:
      "Pastrojmë dhe përgatisim pronën pas çdo check-out, që të jetë gati për mysafirin tjetër. Ky është shërbimi ku kemi përvojën më të madhe.",
    summary: "Nga check-out te prona gati për mysafirin tjetër, për një ose disa prona.",
    includes: [
      "Pastrim i dhomave, i banjës dhe i kuzhinës sipas gjendjes së pronës",
      "Rregullim i krevatit dhe ndërrim i çarçafëve kur ka të pastër në pronë",
      "Pastrim i sipërfaqeve, i dyshemeve dhe i lavamanëve",
      "Organizim i ambientit për mysafirin tjetër",
      "Kontroll final përpara se prona të jetë gati",
    ],
    includesNote:
      "Larja dhe hekurosja e çarçafëve, si dhe rimbushja e produkteve të konsumit, mund të organizohen veçmas.",
    goodFor: [
      "Pronarë me një apartament me qira ditore",
      "Pronarë dhe menaxherë me disa prona",
      "Prona me hyrje dhe dalje të shpeshta mysafirësh",
    ],
    howWeWork: {
      title: "Pastrimi sipas kalendarit të pronës",
      text: "Na tregoni sa shpesh ndërrohen mysafirët dhe e planifikojmë pastrimin rreth hyrjeve dhe daljeve. Për pastrime të përsëritura, oraret organizohen sipas kalendarit të rezervimeve.",
    },
    faq: [
      { question: "Sa kushton pastrimi i një Airbnb?", answer: priceAnswer },
      {
        question: "A ndërroni çarçafët?",
        answer:
          "Po, ndërrojmë çarçafët e pastër kur janë në dispozicion në pronë. Larja dhe hekurosja mund të organizohen veçmas.",
      },
      {
        question: "Sa shpesh duhet pastruar një Airbnb?",
        answer:
          "Varet nga rezervimet. Zakonisht pas çdo check-out. Na tregoni kalendarin e pronës dhe e organizojmë bashkë.",
      },
      {
        question: "Çfarë informacioni ju duhet për ofertën?",
        answer:
          "Sa prona keni, sa të mëdha janë, sa herë në muaj nevojitet pastrimi dhe në cilën zonë ndodhen. Mund t'i shkruani te formulari ose në WhatsApp.",
      },
    ],
    images: [photos.bedroom, photos.livingRoomClean],
    related: ["apartamente", "hotele"],
  },

  zyra: {
    metaTitle: "Pastrim Zyrash në Tiranë",
    metaDescription:
      "Pastrim zyrash dhe ambientesh biznesi në Tiranë, me plan sipas orarit tuaj të punës: para hapjes ose pas mbylljes. Na lini numrin ose shkruani në WhatsApp.",
    h1: "Pastrim zyrash në Tiranë",
    intro:
      "Ofrojmë pastrim periodik për zyra dhe biznese të vogla e të mesme në Tiranë. Plani i pastrimit përshtatet me orarin tuaj të punës.",
    summary: "Pastrim periodik për zyra dhe biznese, pa ndërhyrë në orarin e punës.",
    includes: [
      "Pastrim i rregullt periodik i ambienteve të punës",
      "Fshirje pluhuri nga tavolinat dhe sipërfaqet",
      "Fshirje dhe larje e dyshemeve",
      "Pastrim i kuzhinës ose i sallës së çajit",
      "Zbrazje e koshave",
    ],
    goodFor: [
      "Zyra dhe biznese të vogla e të mesme",
      "Ambiente pune që duan pastrim para hapjes ose pas mbylljes",
      "Biznese që duan një plan të rregullt, jo pastrim të rastësishëm",
    ],
    howWeWork: {
      title: "Plan sipas orarit tuaj",
      text: "Zyrat kanë nevojë për pastrim që nuk ndërhyn në ditën e punës. Koordinojmë orarin e vizitave, para hapjes, pas mbylljes ose në ditë të caktuara të javës, dhe përpiqemi të dërgojmë të njëjtin ekip, që stafi juaj ta njohë kush hyn në zyrë.",
    },
    faq: [
      {
        question: "A pastroni jashtë orarit të punës?",
        answer: "Po. Orarin e vendosim bashkë: para hapjes, pas mbylljes ose në ditë të caktuara të javës.",
      },
      {
        question: "Sa shpesh vini?",
        answer: "Frekuencën e vendosim me ju, sipas madhësisë së zyrës dhe numrit të njerëzve që punojnë aty.",
      },
      { question: "Sa kushton pastrimi i zyrës?", answer: priceAnswer },
    ],
    images: [],
    related: ["hotele", "me-themel"],
  },

  vila: {
    metaTitle: "Pastrim Vilash në Tiranë",
    metaDescription:
      "Pastrim vile në Tiranë me ekip të dedikuar dhe plan sipas kateve, dhomave dhe banjove të shtëpisë. Na lini numrin ose na shkruani në WhatsApp për ofertë.",
    h1: "Pastrim vile në Tiranë",
    intro:
      "Vilat kërkojnë një ekip të dedikuar dhe një plan pastrimi të menduar për to. Fillojmë me një vlerësim të pronës për të përcaktuar kohën dhe ekipin e nevojshëm.",
    summary: "Ekip i dedikuar dhe plan pastrimi për vila dhe shtëpi private të mëdha.",
    includes: [
      "Vlerësim fillestar i pronës",
      "Plan pastrimi sipas kateve, dhomave dhe banjove",
      "Ekip i dedikuar për prona të mëdha",
      "Pastrim i dhomave, i kuzhinës dhe i banjove",
    ],
    goodFor: [
      "Vila dhe shtëpi private me disa kate",
      "Pronarë që e përgatisin vilën para ose pas sezonit",
      "Vila që jepen me qira për pushime",
    ],
    howWeWork: {
      title: "Fillon me një vlerësim",
      text: "Çdo vilë është ndryshe. Numri i kateve, i ambienteve dhe i banjove ndikon te koha dhe ekipi i nevojshëm. Prandaj fillojmë me një vlerësim të shkurtër të pronës, që plani dhe oferta të jenë realiste.",
    },
    faq: [
      {
        question: "Pse duhet një vlerësim para pastrimit?",
        answer:
          "Sepse vilat ndryshojnë shumë nga njëra te tjetra. Vlerësimi na tregon sa kohë dhe sa njerëz duhen, që oferta të jetë e saktë.",
      },
      {
        question: "A bëni pastrim me themel për vila?",
        answer: "Po, pastrimi me themel mund të bëhet për çdo lloj prone, përfshirë vilat.",
      },
      { question: "Sa kushton pastrimi i vilës?", answer: priceAnswer },
    ],
    images: [],
    related: ["apartamente", "me-themel"],
  },

  "me-themel": {
    metaTitle: "Pastrim me Themel në Tiranë",
    metaDescription:
      "Pastrim me themel në Tiranë: brenda dollapëve, frigoriferit dhe furrës, prapa mobilieve dhe te kornizat. Na lini numrin ose na shkruani në WhatsApp.",
    h1: "Pastrim me themel në Tiranë",
    intro:
      "Pastrimi me themel është pastrimi më i thellë që bëjmë. Përfshin çdo cep që pastrimi i rregullt nuk e mbulon: brenda dollapëve, frigoriferit dhe furrës, prapa mobilieve dhe te kornizat.",
    summary: "Pastrimi më i thellë: brenda dollapëve, frigoriferit, furrës dhe prapa mobilieve.",
    includes: [
      "Gjithçka që përfshin pastrimi i rregullt",
      "Brenda dollapëve, frigoriferit dhe furrës",
      "Prapa dhe poshtë mobilieve që lëvizen",
      "Kornizat e dyerve dhe të dritareve, bazamentet",
      "Pastrim i detajuar i banjës dhe i kuzhinës",
    ],
    goodFor: [
      "Para se të hyni në një apartament ose zyrë të re",
      "Kur prona nuk është pastruar thellë prej kohësh",
      "Një ose dy herë në vit, si mirëmbajtje",
      "Para ose pas një feste me shumë të ftuar",
    ],
    howWeWork: {
      title: "Për çdo lloj prone",
      text: "Pastrimin me themel e bëjmë në apartamente, shtëpi, vila dhe zyra. Oferta varet nga lloji i pronës dhe gjendja e saj, jo nga një tarifë e njëjtë për të gjithë.",
    },
    faq: [
      {
        question: "Sa shpesh duhet bërë pastrimi me themel?",
        answer: "Zakonisht një ose dy herë në vit, ose kur hyni në një pronë të re.",
      },
      {
        question: "Cili është ndryshimi nga pastrimi i rregullt?",
        answer:
          "Pastrimi i rregullt mban pastër sipërfaqet që përdoren çdo ditë. Pastrimi me themel shkon edhe brenda dollapëve, frigoriferit e furrës dhe prapa mobilieve.",
      },
      { question: "Sa kushton pastrimi me themel?", answer: priceAnswer },
    ],
    images: [],
    related: ["apartamente", "pas-ndertimit"],
  },

  "pas-ndertimit": {
    metaTitle: "Pastrim pas Ndërtimit në Tiranë",
    metaDescription:
      "Pastrim pas ndërtimit ose rinovimit në Tiranë: pluhuri nga dyshemetë, xhamat, dyert dhe dritaret, gati për t'u banuar. Na lini numrin ose shkruani në WhatsApp.",
    h1: "Pastrim pas ndërtimit dhe rinovimit në Tiranë",
    intro:
      "Pas rinovimit ose ndërtimit, prona ka nevojë për një pastrim të thellë që largon pluhurin e llaçit, të bojës dhe të punimeve. Pastrojmë dyshemetë, xhamat, kornizat e dyerve dhe dritaret.",
    summary: "Heqja e pluhurit të punimeve nga çdo sipërfaqe, para se prona të banohet.",
    includes: [
      "Heqje e pluhurit nga çdo sipërfaqe",
      "Pastrim i detajuar i dyshemeve dhe i pllakave",
      "Pastrim i xhamave dhe i kornizave",
      "Grumbullim i mbetjeve të lehta të pastrimit",
    ],
    includesNote:
      "Mbetjet e rënda të ndërtimit (inerte, tulla, materiale) duhet të largohen nga prona para se të vijë ekipi ynë.",
    goodFor: [
      "Apartamente dhe shtëpi pas rinovimit",
      "Prona të reja para se të mobilohen ose të banohen",
      "Zyra dhe ambiente biznesi pas punimeve",
    ],
    howWeWork: {
      title: "Kur të na thërrisni",
      text: "Na thërrisni kur punimet të kenë mbaruar dhe mbetjet e rënda të jenë larguar. Ne merremi me pluhurin e imët që mbulon çdo sipërfaqe pas një rinovimi.",
    },
    faq: [
      {
        question: "A i largoni edhe mbetjet e ndërtimit?",
        answer:
          "Jo. Ne largojmë pluhurin dhe papastërtinë e punimeve. Mbetjet e rënda (inerte, tulla, materiale) duhet të largohen para se të vijmë.",
      },
      {
        question: "Kur duhet t'ju thërras?",
        answer: "Kur punimet të kenë mbaruar plotësisht. Pluhuri bie edhe për disa ditë, ndaj është mirë ta bëjmë pastrimin në fund.",
      },
      { question: "Sa kushton pastrimi pas ndërtimit?", answer: priceAnswer },
    ],
    images: [],
    related: ["me-themel", "apartamente"],
  },

  hotele: {
    metaTitle: "Pastrim Hotelesh në Tiranë",
    metaDescription:
      "Pastrim hotelesh dhe apart-hotelesh në Tiranë: dhoma sipas check-in/check-out dhe hapësira të përbashkëta. Na lini numrin ose na shkruani në WhatsApp.",
    h1: "Pastrim hotelesh në Tiranë",
    intro:
      "Ndihmojmë hotele dhe apart-hotele në Tiranë me pastrimin e dhomave dhe të hapësirave të përbashkëta. Ekipi përshtatet me volumin dhe orarin e check-in/check-out të pronës suaj.",
    summary: "Dhoma dhe hapësira të përbashkëta, me ekip që përshtatet me volumin tuaj.",
    includes: [
      "Pastrim i dhomave sipas check-in dhe check-out",
      "Pastrim i hapësirave të përbashkëta",
      "Ekip shtesë në periudhat me shumë punë",
      "I njëjti standard në çdo dhomë",
    ],
    goodFor: [
      "Hotele të vogla dhe apart-hotele",
      "Prona që kanë nevojë për ndihmë shtesë në sezonin e lartë",
      "Menaxherë që duan një partner të rregullt për pastrimin",
    ],
    howWeWork: {
      title: "Ekip që përshtatet me volumin tuaj",
      text: "Numri i dhomave, ritmi i check-in/check-out dhe orët e pikut ndryshojnë nga një hotel te tjetri. Prandaj fillojmë me një bisedë të shkurtër për volumin dhe orarin real të pronës, para se të propozojmë një plan.",
    },
    faq: [
      {
        question: "A mund të na ndihmoni vetëm gjatë sezonit?",
        answer: "Po. Mund të sjellim ekip shtesë në periudhat me shumë punë, sipas marrëveshjes.",
      },
      {
        question: "A pastroni edhe hapësirat e përbashkëta?",
        answer: "Po, përveç dhomave pastrojmë edhe hapësirat e përbashkëta, sipas planit që vendosim bashkë.",
      },
      { question: "Sa kushton pastrimi për një hotel?", answer: priceAnswer },
    ],
    images: [],
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

export function serviceMetadata(slug: ServiceSlug): Metadata {
  const service = getService(slug);
  return pageMetadata({
    title: service.metaTitle,
    description: service.metaDescription,
    path: service.path,
    ogImage: service.images[0]?.src,
  });
}
