// Structured content migrated from content/source-copy.md.
// Reused verbatim where the source provides it; do not regenerate wholesale.

export type ServiceSlug =
  | "pastrim-airbnb"
  | "pastrim-apartamentesh"
  | "pastrim-zyrash"
  | "pastrim-vilash"
  | "pastrim-hotelesh"
  | "pastrim-pas-ndertimit";

export interface Service {
  slug: ServiceSlug;
  /** Full route, e.g. "/pastrim-airbnb-tirane" — flat, keyword-rich URLs per the SEO plan. */
  path: string;
  name: string;
  shortDescription: string;
  description: string;
  /** What is normally part of this service. Keep conditional items qualified inline
   *  ("kur janë në dispozicion", "sipas gjendjes") rather than presented as unconditional. */
  includes: string[];
  /** Tasks that exist but are NOT an automatic part of this service — only ever phrased as
   *  "mund të organizohet veçmas" / "sipas marrëveshjes". Never merge these into `includes`. */
  addOns?: string[];
  priceNote: string;
  /** Real photo for card/summary contexts — omitted until one exists for that service. */
  image?: string;
}

export const services: Service[] = [
  {
    slug: "pastrim-airbnb",
    path: "/pastrim-airbnb-tirane",
    name: "Pastrim Airbnb",
    shortDescription: "Nga check-out te prona gati për mysafirin tjetër.",
    description:
      "Pastrim dhe përgatitje e pronës pas qëndrimit të mysafirit, sipas karakteristikave të apartamentit dhe shërbimit të rënë dakord. Ky është shërbimi ku Limoni Cleaning ka specializimin më të fortë.",
    includes: [
      "Pastrim i dhomave, banjove dhe kuzhinës sipas gjendjes së pronës",
      "Rregullim dhe organizim i ambientit për mysafirin e ardhshëm",
      "Ndërrimi i çarçafëve të pastër kur janë në dispozicion në pronë",
      "Kontroll final përpara se prona të jetë gati",
    ],
    addOns: [
      "Larja dhe hekurosja e çarçafëve mund të organizohet veçmas.",
      "Restockimi i produkteve të konsumit mund të organizohet sipas marrëveshjes.",
    ],
    priceNote: "Ofertë e personalizuar",
    image: "/images/ekipi-shtrim-shtrati-tirane.jpg",
  },
  {
    slug: "pastrim-apartamentesh",
    path: "/pastrim-apartamentesh-tirane",
    name: "Pastrim Apartamentesh",
    shortDescription: "Pastrim i rregullt për mbajtjen e pastërtisë dhe freskisë së ambientit.",
    description:
      "Ofrojmë pastrim standard dhe pastrim me themel për apartamente e shtëpi të çdo madhësie, nga studio deri te 4+1. Ekipi ynë vjen i pajisur dhe trajton çdo dhomë me kujdes, si të ishte shtëpia jonë.",
    includes: [
      "Fshirje pluhuri",
      "Pastrim sipërfaqesh",
      "Larje dyshemesh",
      "Pastrim kuzhine e banjoje",
    ],
    priceNote: "Nga 150 ALL/m²",
    image: "/images/ekipi-pastrim-kuzhine-tirane.jpg",
  },
  {
    slug: "pastrim-zyrash",
    path: "/pastrim-zyrash-tirane",
    name: "Pastrim Zyrash",
    shortDescription: "Ambiente të pastra, staf më produktiv dhe klientë më të kënaqur.",
    description:
      "Ofrojmë pastrim periodik për zyra dhe biznese të vogla e të mesme në Tiranë, me plan pastrimi të përshtatur me orarin tuaj të punës.",
    includes: [
      "Pastrim i rregullt periodik",
      "Zbrazje koshash",
      "Pastrim kuzhine/salle çaji",
      "Fshirje dhe larje dyshemesh",
    ],
    priceNote: "Nga 175 ALL/m²",
  },
  {
    slug: "pastrim-vilash",
    path: "/pastrim-vilash-tirane",
    name: "Pastrim Vilash",
    shortDescription: "Pastrim profesional i vilave, çmim sipas m² dhe nevojave tuaja.",
    description:
      "Vilat kërkojnë një ekip të dedikuar dhe një plan pastrimi të personalizuar. Fillojmë me një vlerësim të pronës për të përcaktuar kohën dhe burimet e nevojshme.",
    includes: [
      "Vlerësim fillestar i pronës",
      "Plan pastrimi i personalizuar",
      "Ekip i dedikuar për prona të mëdha",
    ],
    priceNote: "Nga 200 ALL/m²",
  },
  {
    slug: "pastrim-hotelesh",
    path: "/pastrim-hotelesh-tirane",
    name: "Pastrim Hotelesh",
    shortDescription: "Mbështetje pastrimi për hotele dhe apart-hotele, sipas numrit të dhomave.",
    description:
      "Ndihmojmë hotele dhe apart-hotele në Tiranë me pastrimin e dhomave dhe hapësirave të përbashkëta, me ekip që përshtatet me volumin dhe orarin e check-in/check-out të pronës suaj.",
    includes: [
      "Pastrim dhomash sipas check-in/check-out",
      "Pastrim hapësirash të përbashkëta",
      "Ekip shtesë në periudha me volum të lartë",
      "Standard i qëndrueshëm në çdo dhomë",
    ],
    priceNote: "Ofertë sipas numrit të dhomave",
  },
  {
    slug: "pastrim-pas-ndertimit",
    path: "/pastrim-pas-ndertimit-tirane",
    name: "Pastrim Pas Ndërtimit",
    shortDescription: "Heqja e pluhurit dhe mbetjeve të punimeve, para se prona të përdoret.",
    description:
      "Pas rinovimit ose ndërtimit, prona ka nevojë për një pastrim të thelluar që largon pluhurin e llaçit, ngjyrës dhe punimeve nga çdo sipërfaqe — dysheme, xhama, kornizat e dyerve dhe dritaret.",
    includes: [
      "Heqje pluhuri nga çdo sipërfaqe",
      "Pastrim i detajuar i dyshemeve dhe pllakave",
      "Pastrim xhamash dhe kornizash",
      "Grumbullim mbetjesh të lehta pastrimi (jo inerte ndërtimi)",
    ],
    priceNote: "Ofertë sipas gjendjes së pronës",
  },
];

export function getServiceBySlug(slug: string): Service | undefined {
  return services.find((s) => s.slug === slug);
}

// Practical breakdown of what an Airbnb turnover clean covers, by room — used on
// /pastrim-airbnb-tirane. Deliberately room-by-room rather than one flat list, and
// deliberately does not claim laundry, restocking, or guest communication (see addOns
// on the Airbnb Service entry above, and CLAUDE.md's service-claim rules).
export const airbnbCleaningChecklist = [
  {
    category: "Dhoma gjumi",
    items: [
      "Rregullimi i krevatit",
      "Ndërrimi i çarçafëve kur janë në dispozicion në pronë",
      "Pastrim i sipërfaqeve dhe pluhurave",
      "Pastrim i dyshemesë",
    ],
  },
  {
    category: "Banjo",
    items: ["Tualeti", "Dushi", "Lavamani", "Pasqyra", "Dysheme"],
  },
  {
    category: "Kuzhina",
    items: ["Sipërfaqet dhe banaku", "Pianura", "Lavamani", "Pastrim bazë i zonave të përdorura"],
  },
  {
    category: "Kontrolli final",
    items: ["Kontroll vizual i ambientit", "Organizimi i hapësirës", "Përgatitja për mysafirin tjetër"],
  },
];

export const trustCards = [
  {
    title: "Produkte dhe pajisje profesionale",
    description: "Vijmë të pajisur me gjithçka të nevojshme për një pastrim të plotë.",
  },
  {
    title: "Ekip i trajnuar",
    description: "Të përzgjedhur me kujdes për të garantuar cilësi dhe besueshmëri.",
  },
  {
    title: "Rezervim online",
    description: "Zgjidh shërbimin, datën dhe orën direkt nga faqja — pa pritje.",
  },
  {
    title: "Konfirmim në WhatsApp",
    description: "Të kontaktojmë shpejt për të konfirmuar çdo detaj të rezervimit.",
  },
  {
    title: "Orar i përshtatshëm",
    description: "Zgjedh ditën dhe orën që të përshtatet me ty.",
  },
];

export const propertyCategories = ["Apartament", "Airbnb", "Vilë", "Zyrë", "Biznes", "Tjetër"];

// Two confirmed real stats (see CLAUDE.md). Deliberately just these two — no rating/review
// count until real ones exist, and "10+ years" is the team's combined background, not
// Limoni Cleaning's own age (the company is new).
export const homeStats = ["50+ prona të pastruara", "Ekip me mbi 10 vjet eksperiencë të kombinuar"];

export interface FaqEntry {
  question: string;
  answer: string;
}

// Airbnb questions lead — it's the site's strongest commercial story — followed by
// residential/general questions. See CLAUDE.md's service-claim rules: pricing is always
// "assessed", never a fixed Airbnb figure; linen/laundry/restocking stay conditional.
export const faqEntries: FaqEntry[] = [
  {
    question: "Sa kushton pastrimi i një Airbnb në Tiranë?",
    answer:
      "Nuk kemi një çmim fiks për Airbnb. Oferta përcaktohet pasi kuptojmë pronën — sipërfaqja, gjendja dhe frekuenca e pastrimit ndikojnë në çmim. Na dërgo disa informacione paraprake në WhatsApp dhe të kthehemi me një ofertë.",
  },
  {
    question: "Çfarë përfshin pastrimi Airbnb?",
    answer:
      "Pastrim i dhomave, banjove dhe kuzhinës, rregullim i ambientit dhe kontroll final përpara se prona të jetë gati për mysafirin tjetër. Ndërrimi i çarçafëve bëhet kur ka çarçafë të pastër në dispozicion në pronë; larja dhe hekurosja mund të organizohen veçmas.",
  },
  {
    question: "Sa shpesh duhet pastruar një Airbnb?",
    answer:
      "Varet nga frekuenca e rezervimeve tuaja. Për prona me turnover të rregullt, organizimi mund të përshtatet me kalendarin e pronës — na tregoni sa shpesh nevojitet dhe e diskutojmë mënyrën më të përshtatshme.",
  },
  {
    question: "A punoni me pronarë që kanë disa Airbnb?",
    answer:
      "Po. Na tregoni sa prona keni, sa m² është secila dhe sa shpesh nevojitet pastrimi për secilën — më pas përcaktojmë mënyrën më të përshtatshme të organizimit dhe ofertën.",
  },
  {
    question: "Çfarë informacioni ju duhet për një ofertë Airbnb?",
    answer:
      "Vetëm disa gjëra paraprake: sa Airbnb keni, sa m² është secila, sa herë në muaj nevojitet mesatarisht pastrimi për pronë, dhe në cilat zona ndodhen. Na i dërgo në WhatsApp dhe ju kontaktojmë për të diskutuar pronat.",
  },
  {
    question: "A ndërroni çarçafët?",
    answer:
      "Ndërrojmë çarçafët e pastër kur janë në dispozicion në pronë. Larja dhe hekurosja e çarçafëve mund të organizohen veçmas, sipas marrëveshjes.",
  },
  {
    question: "A punoni në të gjithë Tiranën?",
    answer:
      "Ofrojmë shërbime pastrimi në pjesën më të madhe të Tiranës, me bazë në Komuna e Parisit. Na kontaktoni për të konfirmuar mbulimin në zonën tuaj.",
  },
  {
    question: "Çfarë përfshin pastrimi standard?",
    answer:
      "Fshirje pluhuri, pastrim sipërfaqesh, larje dyshemesh, pastrim kuzhine e banjoje, pastrim pasqyrash, zbrazje koshash dhe rregullim bazë.",
  },
  {
    question: "Çfarë përfshin pastrimi me themel?",
    answer:
      "Gjithçka nga pastrimi standard, plus pastrim i detajuar i kuzhinës e banjës, brenda dollapëve dhe frigoriferit, furrës, dyerve, bazamenteve dhe kornizave.",
  },
  {
    question: "A mund të rezervoj online?",
    answer: "Po, mund të rezervosh direkt nga faqja, ose të na shkruash në WhatsApp.",
  },
  {
    question: "A mund të kërkoj një orar specifik?",
    answer: "Po, zgjedh datën dhe orarin që të përshtatet gjatë rezervimit.",
  },
  {
    question: "A bëni pastrim zyrash?",
    answer: "Po, ofrojmë pastrim të rregullt për zyra dhe biznese të vogla e të mesme.",
  },
  {
    question: "A pastroni vila?",
    answer: "Po. Çmimi për vila përcaktohet sipas metrave katrorë dhe kërkesave specifike.",
  },
  {
    question: "A ofroni larje rrobash?",
    answer: "Po, si shërbim shtesë, jo i përfshirë në pastrimin bazë.",
  },
  {
    question: "A ofroni hekurosje?",
    answer: "Po, si shërbim shtesë, jo i përfshirë në pastrimin bazë.",
  },
  {
    question: "A mund të rezervoj pastrim të rregullt?",
    answer:
      "Po, mund të organizojmë pastrim periodik sipas nevojave tuaja, na kontakto për të përcaktuar frekuencën.",
  },
  {
    question: "Si funksionon anulimi?",
    answer:
      "Për anulim ose ndryshim të rezervimit, na kontakto sa më shpejt nëpërmjet telefonit ose WhatsApp.",
  },
  {
    question: "A mund të kërkoj një ofertë të personalizuar?",
    answer:
      "Absolutisht, na shkruaj për një ofertë të personalizuar sipas pronës dhe nevojave tuaja.",
  },
  {
    question: "A bëni pastrim hotelesh?",
    answer:
      "Po, ndihmojmë hotele dhe apart-hotele në Tiranë me pastrimin e dhomave dhe hapësirave të përbashkëta. Çmimi varet nga numri i dhomave dhe frekuenca.",
  },
  {
    question: "A bëni pastrim pas ndërtimit ose rinovimit?",
    answer:
      "Po, largojmë pluhurin e imët të lënë nga punimet nga çdo sipërfaqe. Mbetjet e rënda të ndërtimit duhen hequr nga prona përpara se ekipi ynë të vijë.",
  },
  {
    question: "Cili është ndryshimi mes pastrimit standard dhe atij me themel?",
    answer:
      "Pastrimi standard mban ambientin të pastër rregullisht. Pastrimi me themel shkon më thellë — brenda dollapëve, frigoriferit, furrës dhe kornizave — dhe ka kuptim një ose dy herë në vit, ose kur hyni në një pronë të re.",
  },
];

// Kept factual and specific rather than aspirational — see CLAUDE.md's non-negotiable
// rules and the "no founded-with-passion" guidance for /rreth-nesh.
export const aboutValues = [
  {
    title: "Eksperiencë",
    description:
      "Anëtarët e ekipit sjellin mbi 10 vjet eksperiencë të kombinuar në pastrim dhe mirëmbajtje ambientesh.",
  },
  {
    title: "Ekzekutim praktik",
    description: "Fokusi është te puna konkrete — jo premtime, por një proces i qartë në çdo pastrim.",
  },
  {
    title: "Vëmendje ndaj detajeve",
    description: "Çdo cep trajtohet me kujdes, sipas një liste pune të qëndrueshme.",
  },
  {
    title: "Komunikim i drejtpërdrejtë",
    description: "Koordinimi bëhet direkt me ekipin tonë, në WhatsApp ose telefon.",
  },
];

export interface PortfolioEntry {
  title: string;
  category: "Airbnb" | "Apartamente" | "Vila" | "Zyra";
  location: string;
  src?: string;
}

// Placeholder labels from the source prototype — real jobs/photos pending, see CLAUDE.md.
export const portfolioEntries: PortfolioEntry[] = [
  { title: "Turnover i shpejtë", category: "Airbnb", location: "Komuna e Parisit" },
  {
    title: "Përgatitje shtrati për turnover",
    category: "Airbnb",
    location: "Tiranë",
    src: "/images/ekipi-shtrim-shtrati-tirane.jpg",
  },
  {
    title: "Pastrim periodik",
    category: "Apartamente",
    location: "Tiranë",
    src: "/images/apartament-i-pastruar-dhoma-ndenje-tirane-2.jpg",
  },
  {
    title: "Pastrim kuzhine",
    category: "Apartamente",
    location: "Tiranë",
    src: "/images/ekipi-pastrim-kuzhine-tirane.jpg",
  },
  { title: "Përgatitje sezonale", category: "Vila", location: "Tiranë" },
  { title: "Mirëmbajtje e rregullt", category: "Zyra", location: "Tiranë" },
];

export const portfolioFilters = ["Të gjitha", "Airbnb", "Apartamente", "Vila", "Zyra"] as const;
