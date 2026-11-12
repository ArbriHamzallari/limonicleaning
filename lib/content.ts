// Site-wide copy that isn't tied to one service. Service copy lives in lib/services.ts.
// Wording is the Albanian reviewer's final text (docs/limoni-copy-final.md).
// One published price only (deep cleaning of homes, lib/quote.ts); no em dashes, nothing beyond
// the confirmed facts in CLAUDE.md.

import { deepCleanPriceAnswer, priceAnswer } from "./services";
import { DEEP_CLEAN_RATE_LEK } from "./quote";

export interface FaqEntry {
  question: string;
  answer: string;
}

// Three confirmed facts. Plain text, no icons, no numbers dressed up as "stats".
// "10 vjet" is the team's experience, never the company's age (Limoni is new).
export const trustFacts = [
  "Mbi 50 prona të pastruara",
  "Anëtarët e ekipit kanë mbi 10 vjet përvojë në pastrim",
  "Shtëpi, zyra dhe pallate",
];

/** Service area, everywhere it's mentioned. */
export const serviceAreaLine = "Punojmë në Tiranë dhe në zonat përreth, si Kamza dhe Durrësi.";

/** Homepage "Si përgatitet oferta". */
export const quoteSteps = [
  {
    title: "Na tregoni çfarë ju duhet",
    text: "Plotësoni formularin, na shkruani në WhatsApp ose na telefononi. Sipërfaqja, zona dhe lloji i pastrimit mjaftojnë.",
  },
  {
    title: "Bëjmë vlerësimin",
    text: "Me një telefonatë, me foto nëse doni, ose me vizitë kur gjendja nuk sqarohet dot nga larg.",
  },
  {
    title: "Merrni planin dhe ofertën me shkrim",
    text: "Punët që përfshihen, ato që nuk përfshihen dhe totali. Pa pagesë dhe pa detyrim.",
  },
  { title: "Konfirmojmë datën", text: "Pastrimi rezervohet vetëm pasi të pranoni ofertën dhe të caktojmë ditën." },
];

export const priceFactors = [
  "Madhësia dhe gjendja e ambientit",
  "Lloji i pastrimit",
  "Shërbimet që përfshihen",
  "Një herë apo rregullisht",
];

const faqPrice: FaqEntry = {
  question: "Sa kushton pastrimi?",
  answer: `Për pastrimin me themel të një apartamenti, çmimi orientues nis nga ${DEEP_CLEAN_RATE_LEK} lekë të reja/m²: për 80 m², llogaritja bazë është 20.000 lekë të reja. Totalin e konfirmojmë pas vlerësimit. Për shtëpitë, vilat dhe shërbimet e tjera, ${priceAnswer.charAt(0).toLowerCase()}${priceAnswer.slice(1)}`,
};

const faqUnits: FaqEntry = {
  question: "Çmimet janë në lekë të reja apo të vjetra?",
  answer:
    "Në lekë të reja. 250 lekë të reja janë 2.500 lekë të vjetra. Për shembull, 20.000 lekë të reja janë 200.000 lekë të vjetra.",
};

const faqPhotos: FaqEntry = {
  question: "A duhet t'ju dërgoj foto të shtëpisë?",
  answer:
    "Jo. Fotot ndihmojnë, por nuk janë të detyrueshme. Mund ta nisim me një telefonatë. Nëse duhet ta shohim ambientin, caktojmë një vizitë vlerësimi; nëse ajo ka kosto, jua themi përpara.",
};

const faqRequest: FaqEntry = {
  question: "A është rezervim kërkesa që dërgoj?",
  answer:
    "Jo. Formulari ose mesazhi në WhatsApp është kërkesë për vlerësim. Pastrimi rezervohet vetëm kur biem dakord për punët, totalin dhe datën.",
};

const faqPlan: FaqEntry = {
  question: "Çfarë është plani i pastrimit pa pagesë?",
  answer:
    "Pas vlerësimit ju dërgojmë me shkrim punët që përfshihen, ato që nuk përfshihen, totalin dhe si ta përgatitni pronën. E përgatisim pa pagesë dhe nuk keni detyrim të rezervoni.",
};

export const faqUpholsteryIncluded: FaqEntry = {
  question: "A përfshihet larja e divanit dhe e dyshekëve?",
  answer:
    "Në pastrimin me themel të një apartamenti, po: larja e divanit dhe e të gjithë dyshekëve të apartamentit përfshihet në paketë. Gjatë vlerësimit shënojmë sa janë, përmasat, materialin dhe gjendjen, dhe në ofertën me shkrim shkruajmë saktë cilat përfshihen. Larja e divaneve si shërbim më vete ka ofertën e vet.",
};

export const faqDrying: FaqEntry = {
  question: "Sa kohë duhet që të thahen divani dhe dyshekët?",
  answer:
    "Varet nga materiali dhe ajrimi i dhomës. Nuk thahen menjëherë pas larjes. Nëse ju duhen po atë ditë, na e thoni që ta planifikojmë para rezervimit.",
};

const faqHowToAsk: FaqEntry = {
  question: "Si mund të kërkoj një ofertë?",
  answer:
    "Na lini emrin dhe numrin te formulari ose na shkruani drejtpërdrejt në WhatsApp. Ju kontaktojmë për të kuptuar nevojat tuaja dhe për të përgatitur ofertën.",
};

export const faqArea: FaqEntry = {
  question: "Në cilat zona punoni?",
  answer:
    "Punojmë në Tiranë dhe në zonat përreth, si Kamza dhe Durrësi. Baza jonë është në Komunën e Parisit. Për zonat jashtë Tiranës, konfirmojmë paraprakisht mundësinë dhe kostot e transportit.",
};

const faqVisit: FaqEntry = {
  question: "A vini për ta parë ambientin para ofertës?",
  answer:
    "Po, kur duhet. Shpesh mjafton një telefonatë. Nëse vizita ka ndonjë kosto, jua themi përpara dhe vijmë vetëm pasi të bini dakord. Plani dhe oferta me shkrim janë pa pagesë.",
};

const faqSchedule: FaqEntry = {
  question: "A mund të zgjedh ditën dhe orën?",
  answer: "Po. Ditën dhe orën i caktojmë bashkë kur ju kontaktojmë për ofertën.",
};

/** The four shown on the homepage. */
export const homeFaq: FaqEntry[] = [faqPrice, faqPhotos, faqRequest, faqVisit];

/** Homepage "Si funksionon": what happens after a request. Never implies a held date or a free visit. */
export const howItWorks = [
  {
    title: "Zgjidhni shërbimin dhe një datë",
    text: "Data që zgjidhni është e preferuar. Nuk mbahet derisa ta konfirmojmë bashkë.",
  },
  {
    title: "Ju telefonojmë",
    text: "Sqarojmë punën. Kur duhet, caktojmë një vizitë; nëse ka kosto, jua themi që më parë.",
  },
  {
    title: "Plan dhe ofertë me shkrim",
    text: "Pa pagesë dhe pa detyrim. Në ofertë shkruhet çfarë përfshihet dhe totali.",
  },
  {
    title: "Konfirmojmë ditën",
    text: "Ditën dhe orën e caktojmë vetëm pasi të pranoni ofertën.",
  },
];

/** Deep-cleaning page: its own price answer plus the shared practical ones. */
export const deepCleanFaq: FaqEntry[] = [
  { question: "Sa kushton pastrimi me themel?", answer: deepCleanPriceAnswer },
  faqUnits,
  faqUpholsteryIncluded,
  faqDrying,
  faqPhotos,
  faqRequest,
  {
    question: "Cili është ndryshimi nga pastrimi pas ndërtimit?",
    answer:
      "Çmimi orientues vlen për apartamente ku jetohet ose që janë bosh. Pas punimeve ka pluhur, mbetje ngjitësi ose boje që kërkojnë më shumë kohë, prandaj ai pastrim vlerësohet veçmas dhe nuk llogaritet automatikisht me 250 lekë të reja/m².",
  },
  {
    question: "A vlen ky çmim edhe për shtëpi dhe vila?",
    answer:
      "Jo. Për momentin çmimi orientues vlen vetëm për apartamente. Për shtëpitë dhe vilat ju japim planin dhe ofertën me shkrim pas vlerësimit.",
  },
  faqArea,
];

/** Everything on /faq (the only page with FAQPage structured data). */
export const faqEntries: FaqEntry[] = [
  faqPrice,
  faqUnits,
  faqPlan,
  faqPhotos,
  faqRequest,
  faqHowToAsk,
  faqArea,
  faqVisit,
  faqSchedule,
  {
    question: "Çfarë përfshin pastrimi i rregullt?",
    answer:
      "Heqja e pluhurit, pastrimi i sipërfaqeve dhe pasqyrave, larja e dyshemeve, pastrimi i kuzhinës dhe i banjës, zbrazja e koshave dhe rregullimi bazë.",
  },
  {
    question: "Çfarë përfshin pastrimi me themel?",
    answer:
      "Përfshin gjithçka nga pastrimi i rregullt, plus pastrimin e detajuar të kuzhinës dhe banjës, brenda dollapëve, frigoriferit dhe furrës, si dhe dyerve, bazamenteve dhe kornizave. Për apartamentet, në paketë përfshihet edhe larja e divanit dhe e të gjithë dyshekëve.",
  },
  faqUpholsteryIncluded,
  faqDrying,
  {
    question: "A punoni me biznese dhe pallate?",
    answer:
      "Po. Pastrojmë zyra, dyqane, hotele dhe ambientet e përbashkëta të pallateve, një herë ose rregullisht.",
  },
  {
    question: "A lani divane dhe dyshekë?",
    answer:
      "Po, me makineri ekstraktimi, në shtëpinë ose zyrën tuaj. Si shërbim më vete, çmimi varet nga numri, përmasat dhe gjendja.",
  },
  {
    question: "Çfarë përfshin pastrimi Airbnb?",
    answer:
      "Pastrojmë dhomat, banjën dhe kuzhinën, rregullojmë ambientin dhe bëjmë një kontroll përfundimtar para se prona të jetë gati për mysafirin tjetër. Çarçafët i ndërrojmë kur ka të pastër në pronë.",
  },
  {
    question: "A punoni me pronarë që kanë disa Airbnb?",
    answer:
      "Po. Na tregoni sa prona keni, sa të mëdha janë dhe sa shpesh nevojitet pastrimi, që ta organizojmë punën bashkë.",
  },
  {
    question: "A mund të vini rregullisht?",
    answer: "Po, organizojmë pastrim të rregullt. Sa shpesh vijmë e vendosim bashkë, sipas nevojave tuaja.",
  },
  {
    question: "A bëni pastrim pas ndërtimit ose rinovimit?",
    answer:
      "Po, heqim pluhurin e imët të punimeve nga sipërfaqet. Mbetjet e mëdha të ndërtimit duhet të largohen para se të vijë ekipi ynë.",
  },
  {
    question: "A bëni pastrim hotelesh?",
    answer:
      "Po, bëjmë housekeeping për hotele dhe apart-hotele: pastrojmë dhe rregullojmë dhomat midis mysafirëve, sipas orareve të check-in-it dhe check-out-it.",
  },
  {
    question: "Po nëse duhet ta shtyj ose ta anuloj pastrimin?",
    answer: "Na njoftoni sa më shpejt në telefon ose në WhatsApp dhe caktojmë një ditë tjetër.",
  },
];

export const aboutValues = [
  {
    title: "Përvojë",
    description:
      "Anëtarët e ekipit kanë mbi 10 vjet përvojë në pastrim dhe mirëmbajtje ambientesh, të fituar në kompani të tjera pastrimi.",
  },
  {
    title: "Punë e rregullt",
    description: "Çdo pastrim ndjek të njëjtën listë pune, që rezultati të mos varet nga rastësia.",
  },
  {
    title: "Kujdes për detajet",
    description: "Pronën tuaj e trajtojmë si të ishte e jona, dhomë pas dhome.",
  },
  {
    title: "Komunikim i drejtpërdrejtë",
    description: "Flisni drejtpërdrejt me ne, në WhatsApp ose në telefon, pa ndërmjetës.",
  },
];
