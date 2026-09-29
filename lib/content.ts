// Site-wide copy that isn't tied to one service. Service copy lives in lib/services.ts.
// No prices, no em dashes, nothing beyond the confirmed facts in CLAUDE.md.

import { priceAnswer } from "./services";

export interface FaqEntry {
  question: string;
  answer: string;
}

// The four confirmed facts. Plain text, no icons, no numbers dressed up as "stats".
// "10 vjet" is the team's experience, never the company's age (Limoni is new).
export const trustFacts = [
  "50+ prona të pastruara",
  "Ekip me mbi 10 vjet eksperiencë",
  "Partner zyrtar i Prago",
  "Punojmë në Tiranë",
];

export const howItWorks = [
  "Na lini numrin ose na shkruani në WhatsApp.",
  "Ju kontaktojmë, pyesim për pronën dhe ju japim ofertën.",
  "Vijmë në orarin e rënë dakord dhe pastrojmë.",
];

const faqPrice: FaqEntry = { question: "Sa kushton pastrimi?", answer: priceAnswer };

const faqHowToAsk: FaqEntry = {
  question: "Si mund të kërkoj një ofertë?",
  answer:
    "Na lini emrin dhe numrin te formulari, ose na shkruani direkt në WhatsApp. Ju kontaktojmë, pyesim për pronën dhe ju japim ofertën.",
};

const faqArea: FaqEntry = {
  question: "Në cilat zona punoni?",
  answer:
    "Punojmë në Tiranë dhe kemi bazën në Komunën e Parisit. Na tregoni zonën tuaj dhe ju konfirmojmë nëse vijmë.",
};

const faqSchedule: FaqEntry = {
  question: "A mund të zgjedh ditën dhe orën?",
  answer: "Po. Ditën dhe orën i caktojmë bashkë kur ju kontaktojmë për ofertën.",
};

/** The four shown on the homepage. */
export const homeFaq: FaqEntry[] = [faqPrice, faqHowToAsk, faqArea, faqSchedule];

/** Everything on /faq (the only page with FAQPage structured data). */
export const faqEntries: FaqEntry[] = [
  faqPrice,
  faqHowToAsk,
  faqArea,
  faqSchedule,
  {
    question: "Çfarë përfshin pastrimi i rregullt?",
    answer:
      "Fshirje pluhuri, pastrim sipërfaqesh dhe pasqyrash, larje dyshemesh, pastrim i kuzhinës dhe i banjës, zbrazje koshash dhe rregullim bazë.",
  },
  {
    question: "Çfarë përfshin pastrimi me themel?",
    answer:
      "Gjithçka nga pastrimi i rregullt, plus pastrim i detajuar i kuzhinës dhe i banjës, brenda dollapëve, frigoriferit dhe furrës, dyert, bazamentet dhe kornizat.",
  },
  {
    question: "Çfarë përfshin pastrimi Airbnb?",
    answer:
      "Pastrimin e dhomave, të banjës dhe të kuzhinës, rregullimin e ambientit dhe një kontroll final para se prona të jetë gati për mysafirin tjetër. Çarçafët i ndërrojmë kur ka të pastër në pronë; larja dhe hekurosja organizohen veçmas.",
  },
  {
    question: "A punoni me pronarë që kanë disa Airbnb?",
    answer:
      "Po. Na tregoni sa prona keni, sa të mëdha janë dhe sa shpesh nevojitet pastrimi, dhe e organizojmë bashkë.",
  },
  {
    question: "A mund të vini rregullisht?",
    answer: "Po, organizojmë pastrim periodik. Frekuencën e vendosim bashkë, sipas nevojës suaj.",
  },
  {
    question: "A bëni pastrim zyrash?",
    answer: "Po, pastrojmë rregullisht zyra dhe biznese të vogla e të mesme, në orar që nuk ju pengon punën.",
  },
  {
    question: "A bëni pastrim pas ndërtimit ose rinovimit?",
    answer:
      "Po, largojmë pluhurin e imët të punimeve nga çdo sipërfaqe. Mbetjet e rënda të ndërtimit duhet të largohen para se të vijë ekipi ynë.",
  },
  {
    question: "A bëni pastrim hotelesh?",
    answer: "Po, ndihmojmë hotele dhe apart-hotele me pastrimin e dhomave dhe të hapësirave të përbashkëta.",
  },
  {
    question: "A ofroni larje dhe hekurosje rrobash?",
    answer: "Po, si shërbim shtesë. Nuk përfshihen në pastrimin bazë.",
  },
  {
    question: "Po nëse duhet ta shtyj ose ta anuloj pastrimin?",
    answer: "Na njoftoni sa më shpejt në telefon ose në WhatsApp dhe gjejmë një ditë tjetër.",
  },
];

export const aboutValues = [
  {
    title: "Eksperiencë",
    description:
      "Njerëzit e ekipit kanë mbi 10 vjet eksperiencë në pastrim dhe mirëmbajtje ambientesh, të fituar në kompani të tjera pastrimi.",
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
    title: "Komunikim direkt",
    description: "Flisni direkt me ne, në WhatsApp ose në telefon, pa ndërmjetës.",
  },
];
