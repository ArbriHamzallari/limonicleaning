// Site-wide copy that isn't tied to one service. Service copy lives in lib/services.ts.
// Wording is the Albanian reviewer's final text (docs/limoni-copy-final.md).
// No prices, no em dashes, nothing beyond the confirmed facts in CLAUDE.md.

import { priceAnswer } from "./services";

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
export const serviceAreaLine = "Punojmë në të gjithë Tiranën dhe në zonat përreth.";

/** Free assessment visit: only for larger jobs (CLAUDE.md, 17 Oct 2026). */
export const freeVisitLine = "Për punët më të mëdha, vijmë fillimisht për të parë ambientin. Vizita është pa pagesë.";

/** Next to WhatsApp: photos make the offer more precise. */
export const photosHint =
  "Nëse keni foto ose një video të shkurtër të ambientit, na i dërgoni në WhatsApp. Kjo na ndihmon t'ju japim një ofertë më të saktë.";

/** What happens after someone writes to us (service page closers and /kerko-oferte). */
export const closerSteps = [
  { title: "Na kontaktoni", text: "Na dërgoni në WhatsApp madhësinë, zonën dhe llojin e pronës." },
  { title: "Ju dërgojmë ofertën", text: "Shqyrtojmë çfarë ju nevojitet dhe ju përgatisim ofertën." },
  { title: "Vijmë dhe pastrojmë", text: "Caktojmë bashkë ditën dhe orarin, pastaj ekipi vjen në pronë." },
];

/** Homepage "Si përgatitet oferta". */
export const quoteSteps = [
  {
    title: "Na tregoni çfarë ju duhet",
    text: "Plotësoni formularin, na shkruani në WhatsApp ose na telefononi.",
  },
  {
    title: "E shohim ambientin",
    text: "Shqyrtojmë fotot ose videon që na dërgoni, ose vijmë për një vizitë pa pagesë kur puna është më e madhe.",
  },
  { title: "Ju dërgojmë ofertën", text: "Ju tregojmë me shkrim çfarë përfshihet dhe sa kushton." },
  { title: "Caktojmë ditën", text: "Pasi të pranoni ofertën, caktojmë ditën dhe orarin e punës." },
];

export const priceFactors = [
  "Madhësia dhe gjendja e ambientit",
  "Lloji i pastrimit",
  "Shërbimet që përfshihen",
  "Një herë apo rregullisht",
];

const faqPrice: FaqEntry = { question: "Sa kushton pastrimi?", answer: priceAnswer };

const faqHowToAsk: FaqEntry = {
  question: "Si mund të kërkoj një ofertë?",
  answer:
    "Na lini emrin dhe numrin te formulari ose na shkruani drejtpërdrejt në WhatsApp. Ju kontaktojmë për të kuptuar nevojat tuaja dhe për të përgatitur ofertën.",
};

const faqArea: FaqEntry = {
  question: "Në cilat zona punoni?",
  answer: "Punojmë në të gjithë Tiranën dhe në zonat përreth. Baza jonë është në Komunën e Parisit.",
};

const faqVisit: FaqEntry = {
  question: "A vini për ta parë ambientin para ofertës?",
  answer: "Po, për punët më të mëdha. Vizita është pa pagesë.",
};

const faqSchedule: FaqEntry = {
  question: "A mund të zgjedh ditën dhe orën?",
  answer: "Po. Ditën dhe orën i caktojmë bashkë kur ju kontaktojmë për ofertën.",
};

/** The four shown on the homepage. */
export const homeFaq: FaqEntry[] = [faqPrice, faqHowToAsk, faqArea, faqVisit];

/** Everything on /faq (the only page with FAQPage structured data). */
export const faqEntries: FaqEntry[] = [
  faqPrice,
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
      "Përfshin gjithçka nga pastrimi i rregullt, plus pastrimin e detajuar të kuzhinës dhe banjës, brenda dollapëve, frigoriferit dhe furrës, si dhe dyerve, bazamenteve dhe kornizave.",
  },
  {
    question: "A punoni me biznese dhe pallate?",
    answer:
      "Po. Pastrojmë zyra, dyqane, hotele dhe ambientet e përbashkëta të pallateve, një herë ose rregullisht.",
  },
  {
    question: "A lani divane dhe dyshekë?",
    answer: "Po, me makineri ekstraktimi, në shtëpinë ose zyrën tuaj.",
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
      "Po, ndihmojmë hotelet dhe apart-hotelet me pastrimin e dhomave dhe të ambienteve të përbashkëta.",
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
