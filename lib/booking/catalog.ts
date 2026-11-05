// Service catalogue for booking requests: the questions each service asks, the pricing rule
// (only where Arbri confirmed one) and the checklist template. Shared by the browser (to show
// questions and a live preview) and the server (which recomputes everything on submit and saves
// a snapshot with CATALOG_VERSION, so later edits here never change an existing request).
//
// Rules: neutral wording about condition (no shaming); never a price that wasn't confirmed;
// never "0 lekë"; exclusions only where confirmed (CLAUDE.md); anything unknown goes to
// "Për t'u sqaruar".

import { DEEP_CLEAN_RATE_LEK, ESTIMATE_MAX_M2, ESTIMATE_MIN_M2, formatLek } from "../quote";

export const CATALOG_VERSION = "2026-11-05.1";

export type ServiceKey =
  | "apartamente"
  | "me-themel"
  | "vila"
  | "pas-ndertimit"
  | "divane"
  | "airbnb"
  | "zyra"
  | "ambiente"
  | "hotele"
  | "tjeter";

export const serviceKeys: ServiceKey[] = [
  "me-themel",
  "apartamente",
  "pas-ndertimit",
  "vila",
  "divane",
  "airbnb",
  "zyra",
  "ambiente",
  "hotele",
  "tjeter",
];

type Option = { value: string; label: string };
type ShowIf = { question: string; in: string[] };

export type Question =
  | { id: string; type: "choice"; label: string; hint?: string; options: Option[]; required?: boolean; showIf?: ShowIf }
  | { id: string; type: "multi"; label: string; hint?: string; options: Option[]; showIf?: ShowIf }
  | { id: string; type: "count"; label: string; hint?: string; min: number; max: number; showIf?: ShowIf }
  | { id: string; type: "area"; label: string; hint?: string; showIf?: ShowIf }
  | { id: string; type: "text"; label: string; hint?: string; maxLength: number; showIf?: ShowIf };

export type AnswerValue = string | string[] | number | null;
export type Answers = Record<string, AnswerValue>;

export interface ServiceDefinition {
  key: ServiceKey;
  label: string;
  /** One line under the service choice. */
  blurb: string;
  questions: Question[];
  /** What photos/videos help for this service (shown on the media step). */
  mediaHint: string;
}

const o = (value: string, label: string): Option => ({ value, label });

const conditionOptions = [
  o("e-mirembajtur", "Pastrohet rregullisht"),
  o("pa-pastrim-te-thelle", "Ka kohë pa pastrim të thellë"),
  o("pas-punimeve", "Pas punimeve ose rinovimit"),
];

const frequencyOptions = [o("njehere", "Një herë"), o("javore", "Çdo javë"), o("dyjavore", "Çdo dy javë"), o("mujore", "Çdo muaj")];

export const services: Record<ServiceKey, ServiceDefinition> = {
  "me-themel": {
    key: "me-themel",
    label: "Pastrim me themel",
    blurb: "Pastrim i thellë: kuzhina, banja, xhamat dhe vendet që harrohen.",
    mediaHint: "Kuzhina, banja, divani dhe dyshekët, si dhe çdo zonë që ka nevojë për më shumë kujdes.",
    questions: [
      {
        id: "propertyType",
        type: "choice",
        label: "Çfarë prone është?",
        hint: `Çmimi orientues prej ${DEEP_CLEAN_RATE_LEK} lekë të reja/m² vlen për apartamente.`,
        options: [o("apartament", "Apartament"), o("shtepi", "Shtëpi"), o("vile", "Vilë")],
        required: true,
      },
      { id: "areaM2", type: "area", label: "Sipërfaqja e përafërt (m²)" },
      { id: "occupancy", type: "choice", label: "A jetohet aktualisht?", options: [o("banohet", "Po, jetohet"), o("bosh", "Jo, është bosh")] },
      { id: "bathrooms", type: "count", label: "Sa banjo ka?", min: 1, max: 6 },
      { id: "condition", type: "choice", label: "Si e përshkruani gjendjen?", options: conditionOptions },
      { id: "sofas", type: "count", label: "Sa divane ose kënde ka?", min: 0, max: 8 },
      { id: "mattresses", type: "count", label: "Sa dyshekë ka?", min: 0, max: 12 },
      {
        id: "extras",
        type: "multi",
        label: "Çfarë doni të përfshihet patjetër?",
        options: [o("dollapet", "Brenda dollapëve"), o("furra-frigo", "Furra dhe frigoriferi"), o("xhamat", "Xhamat dhe kornizat")],
      },
    ],
  },
  apartamente: {
    key: "apartamente",
    label: "Pastrim gjeneral",
    blurb: "Pastrim i rregullt i apartamentit ose shtëpisë, një herë ose periodikisht.",
    mediaHint: "Kuzhina, banja dhe dhomat kryesore.",
    questions: [
      { id: "propertyType", type: "choice", label: "Çfarë prone është?", options: [o("apartament", "Apartament"), o("shtepi", "Shtëpi")], required: true },
      { id: "areaM2", type: "area", label: "Sipërfaqja e përafërt (m²)" },
      { id: "occupancy", type: "choice", label: "A jetohet aktualisht?", options: [o("banohet", "Po, jetohet"), o("bosh", "Jo, është bosh")] },
      { id: "bathrooms", type: "count", label: "Sa banjo ka?", min: 1, max: 6 },
      { id: "condition", type: "choice", label: "Si e përshkruani gjendjen?", options: conditionOptions },
      { id: "frequency", type: "choice", label: "Sa shpesh?", options: frequencyOptions },
    ],
  },
  "pas-ndertimit": {
    key: "pas-ndertimit",
    label: "Pas ndërtimit ose rinovimit",
    blurb: "Heqja e pluhurit dhe e mbetjeve të vogla pas punimeve.",
    mediaHint: "Dyshemetë, xhamat dhe kornizat, banja dhe çdo mbetje boje, llaçi ose ngjitësi.",
    questions: [
      {
        id: "propertyType",
        type: "choice",
        label: "Çfarë ambienti është?",
        options: [o("apartament", "Apartament"), o("shtepi", "Shtëpi"), o("vile", "Vilë"), o("zyre", "Zyrë ose dyqan")],
        required: true,
      },
      { id: "areaM2", type: "area", label: "Sipërfaqja e përafërt (m²)" },
      { id: "worksFinished", type: "choice", label: "Kanë përfunduar punimet?", options: [o("po", "Po"), o("jo", "Jo ende")] },
      { id: "debrisRemoved", type: "choice", label: "Janë larguar mbetjet e mëdha?", options: [o("po", "Po"), o("jo", "Jo ende")] },
      {
        id: "residues",
        type: "multi",
        label: "Çfarë ka mbetur?",
        options: [o("pluhur", "Pluhur"), o("boje", "Njolla boje"), o("llac", "Llaç ose çimento"), o("ngjites", "Ngjitës ose etiketa"), o("najlon", "Najlon mbrojtës")],
      },
      { id: "bathrooms", type: "count", label: "Sa banjo ka?", min: 0, max: 6 },
    ],
  },
  vila: {
    key: "vila",
    label: "Vilë",
    blurb: "Vila dhe shtëpi të mëdha, me plan sipas kateve dhe dhomave.",
    mediaHint: "Ambientet kryesore, banjot dhe xhamat e mëdhenj.",
    questions: [
      { id: "floors", type: "count", label: "Sa kate ka?", min: 1, max: 6 },
      { id: "rooms", type: "count", label: "Sa dhoma ka?", min: 1, max: 20 },
      { id: "bathrooms", type: "count", label: "Sa banjo ka?", min: 1, max: 12 },
      { id: "areaM2", type: "area", label: "Sipërfaqja e përafërt (m²)" },
      { id: "occupancy", type: "choice", label: "A jetohet aktualisht?", options: [o("banohet", "Po, jetohet"), o("bosh", "Jo, është bosh")] },
      { id: "condition", type: "choice", label: "Si e përshkruani gjendjen?", options: conditionOptions },
      { id: "frequency", type: "choice", label: "Sa shpesh?", options: frequencyOptions },
    ],
  },
  divane: {
    key: "divane",
    label: "Larje divanesh dhe dyshekësh",
    blurb: "Divane, kënde, kolltuqe, karrige me pëlhurë dhe dyshekë, me makineri ekstraktimi.",
    mediaHint: "Çdo divan ose dyshek nga larg, plus një foto nga afër e pëlhurës dhe e njollave.",
    questions: [
      { id: "sofas", type: "count", label: "Divane", min: 0, max: 10 },
      { id: "corners", type: "count", label: "Kënde", min: 0, max: 6 },
      { id: "armchairs", type: "count", label: "Kolltuqe", min: 0, max: 12 },
      { id: "chairs", type: "count", label: "Karrige me pëlhurë", min: 0, max: 24 },
      { id: "mattressSingle", type: "count", label: "Dyshekë teke", min: 0, max: 12 },
      { id: "mattressDouble", type: "count", label: "Dyshekë dopio", min: 0, max: 12 },
      {
        id: "material",
        type: "choice",
        label: "Materiali kryesor",
        options: [o("peliure", "Pëlhurë"), o("kadife", "Kadife"), o("mikrofiber", "Mikrofibër"), o("lekure", "Lëkurë ose lëkurë artificiale"), o("nuk-e-di", "Nuk e di")],
      },
      { id: "stains", type: "choice", label: "Ka njolla të vjetra?", options: [o("po", "Po"), o("jo", "Jo"), o("nuk-e-di", "Nuk e di")] },
    ],
  },
  airbnb: {
    key: "airbnb",
    label: "Airbnb",
    blurb: "Pastrim pas check-out-it, për një ose disa prona.",
    mediaHint: "Dhoma e gjumit, banja dhe kuzhina.",
    questions: [
      { id: "units", type: "count", label: "Sa prona?", min: 1, max: 30 },
      { id: "areaM2", type: "area", label: "Sipërfaqja e përafërt e një prone (m²)" },
      { id: "bathrooms", type: "count", label: "Sa banjo ka një pronë?", min: 1, max: 4 },
      { id: "frequency", type: "choice", label: "Sa shpesh?", options: [o("cdo-checkout", "Pas çdo check-out-i"), ...frequencyOptions] },
      { id: "linen", type: "choice", label: "A ka çarçafë të pastër në pronë?", options: [o("po", "Po"), o("jo", "Jo")] },
    ],
  },
  zyra: {
    key: "zyra",
    label: "Zyrë ose biznes",
    blurb: "Zyra, dyqane dhe studio, një herë ose rregullisht.",
    mediaHint: "Ambientet e punës, kuzhina ose salla e çajit dhe tualetet.",
    questions: [
      {
        id: "premises",
        type: "choice",
        label: "Çfarë ambienti është?",
        options: [o("zyre", "Zyrë"), o("dyqan", "Dyqan ose sallë ekspozimi"), o("studio", "Studio ose klinikë"), o("tjeter", "Tjetër")],
        required: true,
      },
      { id: "areaM2", type: "area", label: "Sipërfaqja e përafërt (m²)" },
      { id: "floors", type: "count", label: "Sa kate?", min: 1, max: 10 },
      { id: "toilets", type: "count", label: "Sa tualete?", min: 0, max: 20 },
      { id: "condition", type: "choice", label: "Si e përshkruani gjendjen?", options: conditionOptions },
      { id: "frequency", type: "choice", label: "Një herë apo rregullisht?", options: frequencyOptions },
      {
        id: "access",
        type: "multi",
        label: "Kur mund të punojmë?",
        options: [o("para-hapjes", "Para hapjes"), o("pas-mbylljes", "Pas mbylljes"), o("fundjave", "Në fundjavë"), o("gjate-orarit", "Gjatë orarit")],
      },
    ],
  },
  ambiente: {
    key: "ambiente",
    label: "Ambientet e pallatit",
    blurb: "Shkallë, holle dhe hyrje pallatesh ose kompleksesh.",
    mediaHint: "Hyrja, shkallët dhe një kat tipik.",
    questions: [
      { id: "floors", type: "count", label: "Sa kate ka pallati?", min: 1, max: 30 },
      { id: "entrances", type: "count", label: "Sa hyrje?", min: 1, max: 10 },
      { id: "frequency", type: "choice", label: "Sa shpesh?", options: [o("njehere", "Një herë"), o("javore", "Çdo javë"), o("mujore", "Çdo muaj")] },
      { id: "role", type: "choice", label: "Kush e kërkon?", options: [o("administrator", "Administratori"), o("banor", "Përfaqësues i banorëve"), o("ndertues", "Ndërtuesi"), o("tjeter", "Tjetër")] },
    ],
  },
  hotele: {
    key: "hotele",
    label: "Hotel",
    blurb: "Dhoma dhe ambiente të përbashkëta për hotele dhe apart-hotele.",
    mediaHint: "Një dhomë tipike dhe ambientet e përbashkëta.",
    questions: [
      { id: "rooms", type: "count", label: "Sa dhoma?", min: 1, max: 200 },
      { id: "commonAreas", type: "choice", label: "Edhe ambientet e përbashkëta?", options: [o("po", "Po"), o("jo", "Jo")] },
      { id: "frequency", type: "choice", label: "Si ju duhet?", options: [o("rregullisht", "Rregullisht"), o("sezon", "Vetëm gjatë sezonit"), o("njehere", "Një herë")] },
    ],
  },
  tjeter: {
    key: "tjeter",
    label: "Tjetër",
    blurb: "Na tregoni çfarë ju duhet.",
    mediaHint: "Ambienti ose sendet që duhen pastruar.",
    questions: [
      { id: "description", type: "text", label: "Çfarë duhet pastruar?", maxLength: 600 },
      { id: "areaM2", type: "area", label: "Sipërfaqja e përafërt (m², nëse e dini)" },
    ],
  },
};

export function isServiceKey(value: unknown): value is ServiceKey {
  return typeof value === "string" && (serviceKeys as string[]).includes(value);
}

function visible(q: Question, a: Answers): boolean {
  if (!q.showIf) return true;
  const v = a[q.showIf.question];
  return typeof v === "string" && q.showIf.in.includes(v);
}

/** Server-side cleaning: unknown keys dropped, values coerced and clamped, hidden answers removed. */
export function validateAnswers(service: ServiceKey, raw: unknown): { answers: Answers; errors: Record<string, string> } {
  const input = (raw && typeof raw === "object" ? raw : {}) as Record<string, unknown>;
  const answers: Answers = {};
  const errors: Record<string, string> = {};
  for (const q of services[service].questions) {
    const v = input[q.id];
    if (q.type === "choice") {
      if (typeof v === "string" && q.options.some((x) => x.value === v)) answers[q.id] = v;
    } else if (q.type === "multi") {
      if (Array.isArray(v)) {
        const picked = q.options.filter((x) => v.includes(x.value)).map((x) => x.value);
        if (picked.length) answers[q.id] = picked;
      }
    } else if (q.type === "count") {
      const n = typeof v === "number" ? v : typeof v === "string" && v.trim() ? Number(v) : NaN;
      if (Number.isInteger(n)) answers[q.id] = Math.min(q.max, Math.max(q.min, n));
    } else if (q.type === "area") {
      if (v === "nuk-e-di") answers[q.id] = "nuk-e-di";
      else {
        const n = typeof v === "number" ? v : typeof v === "string" ? Number(v.trim()) : NaN;
        if (Number.isInteger(n) && n > 0 && n <= 100000) answers[q.id] = n;
      }
    } else if (q.type === "text") {
      if (typeof v === "string" && v.trim()) answers[q.id] = v.trim().slice(0, q.maxLength);
    }
  }
  for (const q of services[service].questions) {
    if (!visible(q, answers)) delete answers[q.id];
    else if (q.type === "choice" && q.required && answers[q.id] == null) errors[q.id] = "Zgjidhni një përgjigje.";
  }
  return { answers, errors };
}

// ---------------------------------------------------------------------------------------
// Pricing. Only rules Arbri confirmed. A service without a rule shows
// "Çmimi përcaktohet pas vlerësimit"; to add one, add an entry here (and to CLAUDE.md).
// ---------------------------------------------------------------------------------------

export type Estimate =
  | { kind: "indicative"; amountLek: number; amountText: string; basis: string; assumptions: string[] }
  | { kind: "after-assessment"; reason: string; assumptions: string[] };

export const AFTER_ASSESSMENT = "Çmimi përcaktohet pas vlerësimit";

const num = (a: Answers, id: string) => (typeof a[id] === "number" ? (a[id] as number) : 0);
const str = (a: Answers, id: string) => (typeof a[id] === "string" ? (a[id] as string) : undefined);
const list = (a: Answers, id: string) => (Array.isArray(a[id]) ? (a[id] as string[]) : []);

export function estimateFor(service: ServiceKey, a: Answers, ctx: { outsideTirana: boolean }): Estimate {
  const assumptions = [
    "Ky është vlerësim paraprak. Totali përfundimtar konfirmohet me shkrim pas vlerësimit, përpara rezervimit.",
  ];
  if (ctx.outsideTirana) assumptions.push("Për zonat jashtë Tiranës, mundësinë dhe kostot e transportit i konfirmojmë paraprakisht.");

  if (service === "me-themel") {
    if (str(a, "propertyType") !== "apartament")
      return { kind: "after-assessment", reason: "Çmimi orientues vlen vetëm për apartamente. Për shtëpitë dhe vilat jepet ofertë pas vlerësimit.", assumptions };
    if (str(a, "condition") === "pas-punimeve")
      return { kind: "after-assessment", reason: "Pas punimeve çmimi varet nga mbetjet dhe përcaktohet pas vlerësimit.", assumptions };
    const area = a.areaM2;
    if (typeof area !== "number")
      return { kind: "after-assessment", reason: "Pa sipërfaqen nuk llogarisim dot vlerësimin orientues; e sqarojmë bashkë.", assumptions };
    if (area < ESTIMATE_MIN_M2 || area > ESTIMATE_MAX_M2)
      return { kind: "after-assessment", reason: "Për këtë sipërfaqe çmimin e sqarojmë bashkë, pa llogaritje automatike.", assumptions };
    const amount = area * DEEP_CLEAN_RATE_LEK;
    return {
      kind: "indicative",
      amountLek: amount,
      amountText: `${formatLek(amount)} lekë të reja`,
      basis: `${area} m² × ${DEEP_CLEAN_RATE_LEK} lekë të reja`,
      assumptions: [
        ...assumptions,
        "Përfshin larjen e divanit dhe të të gjithë dyshekëve të apartamentit; sasitë, materialet dhe gjendja konfirmohen në ofertë.",
        "Nëse gjendja kërkon më shumë punë se sa duket nga përshkrimi, totali mund të ndryshojë dhe jua themi përpara.",
      ],
    };
  }
  return { kind: "after-assessment", reason: AFTER_ASSESSMENT + ".", assumptions };
}

// ---------------------------------------------------------------------------------------
// Checklists: built from the template + the customer's answers, nothing else.
// ---------------------------------------------------------------------------------------

export interface Checklist {
  included: string[];
  excluded: string[];
  clarify: string[];
  priorities: string[];
}

const plural = (n: number, one: string, many: string) => `${n} ${n === 1 ? one : many}`;

export function checklistFor(service: ServiceKey, a: Answers, ctx: { outsideTirana: boolean; priorities: string[] }): Checklist {
  const included: string[] = [];
  const excluded: string[] = [];
  const clarify: string[] = [];
  const bathrooms = num(a, "bathrooms");
  const bathLine = (base: string) => (bathrooms ? `${base} (${plural(bathrooms, "banjo", "banjo")})` : base);

  switch (service) {
    case "me-themel": {
      const apartment = str(a, "propertyType") === "apartament";
      included.push(
        "Kuzhina: banakët, sipërfaqet, lavamani dhe pajisjet nga jashtë",
        bathLine("Banja: pllakat, dushi, lavamani, tualeti dhe pasqyrat"),
        "Dhomat: pluhuri, sipërfaqet, dyert, kornizat dhe bazamentet",
        "Prapa dhe poshtë mobilieve që lëvizen në mënyrë të sigurt",
        "Dyshemetë në të gjithë pronën",
      );
      const extras = list(a, "extras");
      if (extras.includes("dollapet")) included.push("Brenda dollapëve të kuzhinës");
      if (extras.includes("furra-frigo")) included.push("Furra dhe frigoriferi nga brenda");
      if (extras.includes("xhamat")) included.push("Xhamat, kornizat dhe binarët e arritshëm");
      const sofas = num(a, "sofas");
      const mattresses = num(a, "mattresses");
      if (apartment) {
        if (sofas) included.push(`Larja e divaneve me makineri ekstraktimi: ${plural(sofas, "divan ose kënd", "divane ose kënde")}`);
        if (mattresses) included.push(`Larja e dyshekëve: ${plural(mattresses, "dyshek", "dyshekë")}`);
        if (sofas || mattresses) clarify.push("Materiali, përmasat dhe gjendja e divaneve dhe e dyshekëve, për t'i shënuar në ofertë");
      } else if (sofas || mattresses) {
        clarify.push("Larja e divaneve dhe e dyshekëve për shtëpi ose vilë: sqarohet në ofertë");
      }
      if (str(a, "condition") === "pas-punimeve") clarify.push("Mbetjet pas punimeve: llojet dhe sasia, për ofertën");
      excluded.push("Larja dhe hekurosja e rrobave", "Largimi i mbetjeve të mëdha të ndërtimit dhe lyerja e mureve", "Rimbushja e produkteve të konsumit");
      break;
    }
    case "apartamente":
      included.push(
        "Kuzhina: sipërfaqet dhe lavamani",
        bathLine("Banja: lavamani, dushi, tualeti dhe pasqyra"),
        "Dhomat: pluhuri, sipërfaqet dhe rregullim bazë",
        "Dyshemetë: fshirje dhe larje",
        "Zbrazja e koshave",
      );
      excluded.push(
        "Larja dhe hekurosja e rrobave",
        "Brenda dollapëve, frigoriferit dhe furrës (pjesë e pastrimit me themel)",
        "Larja e divaneve dhe e dyshekëve (shërbim më vete)",
      );
      if (str(a, "frequency") && str(a, "frequency") !== "njehere") clarify.push("Ditët dhe ora e vizitave të rregullta");
      break;
    case "pas-ndertimit": {
      included.push(
        "Heqja e pluhurit nga të gjitha sipërfaqet",
        "Dyshemetë dhe pllakat",
        "Xhamat dhe kornizat",
        "Binarët e dyerve rrëshqitëse",
        "Mbetjet e vogla që mund të hiqen gjatë pastrimit",
      );
      if (bathrooms) included.push(bathLine("Banjot"));
      const residues = list(a, "residues");
      const labels: Record<string, string> = { boje: "njollat e bojës", llac: "llaçi ose çimentoja", ngjites: "ngjitësi dhe etiketat", najlon: "najloni mbrojtës" };
      const special = residues.filter((r) => labels[r]).map((r) => labels[r]);
      if (special.length) clarify.push(`Si trajtohen ${special.join(", ")}: sqarohet pas vlerësimit`);
      if (str(a, "worksFinished") === "jo") clarify.push("Pastrimi bëhet pasi të përfundojnë punimet");
      if (str(a, "debrisRemoved") === "jo") clarify.push("Mbetjet e mëdha duhet të largohen para pastrimit");
      excluded.push("Largimi i mbetjeve të mëdha të ndërtimit", "Lyerja e mureve ose riparimet");
      break;
    }
    case "vila":
      included.push(
        `Të gjitha katet${num(a, "floors") ? ` (${plural(num(a, "floors"), "kat", "kate")})` : ""} dhe dhomat${num(a, "rooms") ? ` (${plural(num(a, "rooms"), "dhomë", "dhoma")})` : ""}`,
        "Kuzhina",
        bathLine("Banjot"),
        "Dyshemetë",
      );
      clarify.push("Radha e punës sipas kateve dhe numri i punonjësve, pas vlerësimit");
      excluded.push("Larja dhe hekurosja e rrobave dhe e çarçafëve", "Rimbushja e produkteve të konsumit");
      break;
    case "divane": {
      const items: [string, string, string][] = [
        ["sofas", "divan", "divane"],
        ["corners", "kënd", "kënde"],
        ["armchairs", "kolltuk", "kolltuqe"],
        ["chairs", "karrige me pëlhurë", "karrige me pëlhurë"],
        ["mattressSingle", "dyshek tek", "dyshekë teke"],
        ["mattressDouble", "dyshek dopio", "dyshekë dopio"],
      ];
      const picked = items.filter(([id]) => num(a, id) > 0).map(([id, one, many]) => plural(num(a, id), one, many));
      included.push("Heqja e pluhurit dhe e papastërtisë së thatë");
      included.push(picked.length ? `Larja me makineri ekstraktimi: ${picked.join(", ")}` : "Larja me makineri ekstraktimi e sendeve që do të na tregoni");
      if (str(a, "material") === "lekure" || str(a, "material") === "nuk-e-di") clarify.push("Materiali: a lahet me ekstraktim, e konfirmojmë pas fotove ose vlerësimit");
      if (str(a, "stains") !== "jo") clarify.push("Njollat e vjetra: disa mund të mos hiqen plotësisht");
      excluded.push("Garanci që çdo njollë do të hiqet", "Tharje e menjëhershme: koha varet nga materiali dhe ajrimi");
      break;
    }
    case "airbnb":
      included.push(
        "Dhoma e gjumit: krevati, sipërfaqet dhe dyshemeja",
        "Banja: tualeti, dushi, lavamani, pasqyra dhe dyshemeja",
        "Kuzhina: sipërfaqet, banaku, pianura dhe lavamani",
        "Kontroll i fundit para mysafirit tjetër",
      );
      if (str(a, "linen") === "po") included.push("Ndërrimi i çarçafëve me ata të pastër që janë në pronë");
      else clarify.push("Çarçafët: i ndërrojmë vetëm kur ka të pastër në pronë");
      if (num(a, "units") > 1) clarify.push("Kalendari i check-out-eve për të gjitha pronat");
      excluded.push("Larja dhe hekurosja e çarçafëve dhe e peshqirëve", "Rimbushja e produkteve të konsumit");
      break;
    case "zyra":
      included.push("Tavolinat dhe sipërfaqet e punës", "Kuzhina ose salla e çajit", "Tualetet", "Fshirja dhe larja e dyshemeve", "Zbrazja e koshave");
      if (list(a, "access").length === 0) clarify.push("Orari kur mund të punojmë dhe kush na hap");
      else clarify.push("Kush na hap dhe kush është personi i kontaktit");
      if (str(a, "frequency") && str(a, "frequency") !== "njehere") clarify.push("Për pastrim të rregullt bëjmë kontratë");
      excluded.push("Larja e rrobave dhe rimbushja e produkteve të konsumit");
      break;
    case "ambiente":
      included.push("Shkallët dhe pragjet", "Parmakët", "Hollet dhe korridoret", "Hyrja dhe dera kryesore", "Xhamat e hyrjes nga brenda", "Zbrazja e koshave të ambienteve të përbashkëta");
      clarify.push("Ditët e pastrimit, të dakordësuara me administratorin ose banorët");
      excluded.push("Ashensorët e pallatit", "Pastrimi brenda apartamenteve");
      break;
    case "hotele":
      included.push("Dhomat sipas planit të dakordësuar");
      if (str(a, "commonAreas") === "po") included.push("Ambientet e përbashkëta");
      clarify.push("Oraret e check-in-it dhe check-out-it dhe periudhat me më shumë punë");
      excluded.push("Larja dhe hekurosja e çarçafëve dhe e peshqirëve", "Rimbushja e produkteve të konsumit");
      break;
    case "tjeter":
      clarify.push("Punët e sakta: i përcaktojmë bashkë pas vlerësimit");
      break;
  }
  if (ctx.outsideTirana) clarify.push("Transporti për zonat jashtë Tiranës");
  return { included, excluded, clarify, priorities: ctx.priorities };
}

/** Customer-chosen priorities: short free texts, cleaned. */
export function cleanPriorities(raw: unknown): string[] {
  if (!Array.isArray(raw)) return [];
  return raw
    .filter((p): p is string => typeof p === "string")
    .map((p) => p.replace(/\s+/g, " ").trim().slice(0, 120))
    .filter(Boolean)
    .slice(0, 8);
}
