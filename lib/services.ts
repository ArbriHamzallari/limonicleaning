import type { Metadata } from "next";
import { serviceIndex, serviceSlugs, businessPath, type PageKey, type ServiceSlug } from "./service-index";
import { pageMetadata } from "./seo";
import { photos, videos, type PhotoAsset, type VideoAsset } from "./photos";
import type { FaqEntry } from "./content";

export type { ServiceSlug } from "./service-index";

// All service page copy, plus /per-biznese. Every page renders through
// components/ServicePage.tsx, but each one picks its own sections and headings so the pages
// don't read as copies. Wording is the Albanian reviewer's final text (docs/limoni-copy-final.md).
// Rules: no prices, no em dashes, no claims beyond what the business confirmed (CLAUDE.md).

export const priceAnswer =
  "Çmimi varet nga madhësia dhe gjendja e pronës, lloji i pastrimit dhe sa shpesh ju nevojitet. Na lini numrin ose na dërgoni foto në WhatsApp, që t'ju përgatisim ofertën.";

export type ChecklistItem = string | { label: string; text: string };

export type ServiceSection =
  | { kind: "checklist"; title: string; items: ChecklistItem[]; note?: string; id?: string }
  | { kind: "steps"; title: string; intro?: string; steps: { title: string; text: string }[]; id?: string }
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
  | { kind: "note"; text: string; link?: { href: string; label: string }; id?: string }
  /** Real photos and clips with captions. Title optional: without one it reads as part of the
   *  section above. */
  | { kind: "media"; title?: string; photos?: PhotoAsset[]; videos?: VideoAsset[]; id?: string };

export interface ServicePageContent {
  key: PageKey;
  path: string;
  navLabel: string;
  metaTitle: string;
  /** 140 to 155 characters, ends in the lead action. */
  metaDescription: string;
  h1: string;
  /** Two or three short sentences. */
  intro: string;
  /** One sentence, used on /sherbime and in llms.txt. */
  summary: string;
  /** Hero photo. Omitted = text-only hero (or the video below). Never the homepage hero. */
  hero?: PhotoAsset;
  /** Hero clip instead of a photo (portrait, with controls). */
  heroVideo?: VideoAsset;
  /** The hero's main button; defaults to the site-wide "Merrni ofertën tuaj". */
  ctaLabel?: string;
  sections: ServiceSection[];
  /** Rendered only when there are 3 or more. */
  faq: FaqEntry[];
  related: PageKey[];
  /** Overrides the closer's heading and line. */
  closer?: { title: string; text: string };
}

export interface Service extends ServicePageContent {
  slug: ServiceSlug;
}

type ServiceData = Omit<ServicePageContent, "key" | "path" | "navLabel">;

const data: Record<ServiceSlug, ServiceData> = {
  apartamente: {
    metaTitle: "Pastrim gjeneral shtëpie dhe apartamenti",
    metaDescription:
      "Pastrim për shtëpi dhe apartamente në Tiranë, me pastrim të rregullt ose me themel, nga ekip me mbi 10 vjet përvojë. Na shkruani në WhatsApp për ofertë.",
    h1: "Pastrim gjeneral dhe i rregullt për apartamente e shtëpi në Tiranë",
    intro:
      "Vijmë në apartamente dhe shtëpi të madhësive të ndryshme. Pastrojmë dhomë pas dhome: kuzhinën, banjën, dhomat dhe dyshemetë.",
    summary: "Pastrim gjeneral, një herë ose rregullisht, për apartamente dhe shtëpi të çdo madhësie.",
    hero: photos.livingRoomClean,
    sections: [
      {
        kind: "checklist",
        title: "Dhomë pas dhome",
        items: [
          { label: "Kuzhina", text: "Sipërfaqet dhe lavamani." },
          { label: "Banjoja", text: "Lavamani, dushi, tualeti dhe pasqyra." },
          { label: "Dhomat", text: "Heqim pluhurin, pastrojmë sipërfaqet dhe bëjmë një rregullim bazë." },
          { label: "Dyshemetë", text: "I fshijmë dhe i lajmë në të gjithë shtëpinë." },
          { label: "Koshat", text: "I zbrazim para se të largohemi." },
        ],
      },
      {
        kind: "photoStory",
        title: "Nga kuzhina te korridori",
        text: "Çdo pastrim ndjek një listë të caktuar pune, që rezultati të mos varet nga rastësia. Pastrojmë kuzhinën, banjën dhe dhomat, pastaj dyshemetë deri te dera e hyrjes.",
        photos: [photos.kitchen, photos.hallwayClean],
      },
      {
        kind: "text",
        title: "Pastrim i rregullt apo me themel?",
        paragraphs: [
          "Pastrimi i rregullt e mban shtëpinë të pastër javë pas jave.",
          "Kur hyni në një pronë të re ose kur shtëpia nuk është pastruar me themel prej kohësh, zgjidhni pastrimin me themel. Ai mund të përfshijë edhe dollapët, frigoriferin dhe furrën nga brenda.",
        ],
        link: { href: "/pastrim-me-themel-tirane", label: "Si bëhet pastrimi me themel" },
      },
    ],
    faq: [
      {
        question: "Çfarë përfshin pastrimi i rregullt?",
        answer:
          "Heqim pluhurin, pastrojmë sipërfaqet dhe pasqyrat, lajmë dyshemetë, pastrojmë kuzhinën dhe banjën, zbrazim koshat dhe bëjmë një rregullim bazë.",
      },
      {
        question: "A mund të vini rregullisht?",
        answer: "Po. Sa shpesh vijmë e vendosim bashkë: çdo javë, çdo dy javë ose sipas nevojës suaj.",
      },
      { question: "Sa kushton pastrimi i apartamentit?", answer: priceAnswer },
    ],
    related: ["me-themel", "divane"],
  },

  "me-themel": {
    metaTitle: "Pastrim me themel në Tiranë",
    metaDescription:
      "Pastrim me themel në Tiranë, përfshirë dollapët, frigoriferin, furrën, prapa mobilieve dhe kornizat. Na shkruani në WhatsApp për të marrë ofertë.",
    h1: "Pastrim me themel në Tiranë",
    intro:
      "Pastrim i thellë për ambiente që kanë nevojë për më shumë se pastrimi i përditshëm. Hapim dollapët, lëvizim mobiliet dhe pastrojmë kornizat dhe binarët.",
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
          "Të gjitha sipërfaqet e banjës dhe të kuzhinës",
        ],
        note: "Përfshin edhe shërbimet e pastrimit të rregullt.",
      },
      { kind: "media", photos: [photos.atticWindow], videos: [videos.teamBedroom] },
      {
        kind: "checklist",
        title: "Kur ka kuptim",
        items: [
          "Para se të hyni në një apartament ose zyrë të re",
          "Kur prona nuk është pastruar me themel prej kohësh",
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
          "Pastrimi i rregullt mban pastër sipërfaqet që përdoren çdo ditë. Pastrimi me themel përfshin edhe vende si brenda dollapëve, frigoriferit e furrës dhe prapa mobilieve.",
      },
      { question: "Sa kushton pastrimi me themel?", answer: priceAnswer },
    ],
    related: ["apartamente", "pas-ndertimit"],
  },

  vila: {
    metaTitle: "Pastrim vilash në Tiranë",
    metaDescription:
      "Pastrim vilash në Tiranë, me plan sipas kateve, dhomave dhe banjove të pronës. Na lini numrin ose na shkruani në WhatsApp për të marrë ofertën tuaj.",
    h1: "Pastrim vile në Tiranë",
    intro:
      "Për vilat, marrim parasysh numrin e kateve, dhomave, banjove dhe dritareve. Fillojmë me një vlerësim të pronës.",
    summary: "Plan pastrimi për vila dhe shtëpi private të mëdha.",
    hero: photos.villaSalon,
    sections: [
      {
        kind: "steps",
        title: "Si e organizojmë",
        intro:
          "Për vilat, vijmë fillimisht për një vizitë pa pagesë, që të përgatisim një plan dhe ofertë të saktë.",
        steps: [
          {
            title: "Vlerësimi",
            text: "Shohim katet, dhomat dhe banjot, që të vlerësojmë kohën dhe numrin e punonjësve të nevojshëm.",
          },
          { title: "Plani", text: "Vendosim bashkë çfarë pastrohet dhe në çfarë radhe." },
          { title: "Pastrimi", text: "Ekipi vjen në ditën e caktuar dhe pastron dhomat, kuzhinën dhe banjot." },
        ],
      },
      {
        kind: "note",
        text: "E përgatitni vilën para sezonit ose pas tij? Na shkruani datat dhe planifikojmë pastrimin.",
      },
    ],
    faq: [
      {
        question: "Pse duhet një vlerësim para pastrimit?",
        answer:
          "Sepse vilat ndryshojnë shumë. Vlerësimi na ndihmon të përcaktojmë sa kohë dhe sa punonjës nevojiten, që oferta të jetë e saktë.",
      },
      {
        question: "A bëni pastrim me themel për vila?",
        answer: "Po, pastrimi me themel ofrohet për lloje të ndryshme pronash, përfshirë vilat.",
      },
      { question: "Sa kushton pastrimi i vilës?", answer: priceAnswer },
    ],
    related: ["apartamente", "me-themel"],
  },

  "pas-ndertimit": {
    metaTitle: "Pastrim pas ndërtimit në Tiranë",
    metaDescription:
      "Pastrim pas ndërtimit ose rinovimit në Tiranë, duke hequr pluhurin nga dyshemetë, xhamat, dyert dhe dritaret. Na shkruani në WhatsApp për ofertë.",
    h1: "Pastrim pas ndërtimit dhe rinovimit në Tiranë",
    intro:
      "Punimet mbarojnë, por pluhuri mbetet: mbi dysheme, mbi xhama dhe brenda binarëve të dyerve. E pastrojmë ambientin që prona të jetë gati për t'u banuar.",
    summary: "Heqja e pluhurit të punimeve nga sipërfaqet, para se prona të banohet.",
    hero: photos.constructionGlass,
    sections: [
      {
        kind: "pair",
        title: "Një apartament i ri në Tiranë",
        text: "Najlon mbi dysheme, kuti dhe ngjitëse mbi xhama. Ekipi pastaj pastron dritaret.",
        left: photos.constructionBefore,
        right: photos.windowsTeam,
      },
      {
        kind: "checklist",
        title: "Çfarë pastrojmë pas punimeve",
        items: [
          "Pluhuri nga të gjitha sipërfaqet",
          "Dyshemetë dhe pllakat",
          "Xhamat dhe kornizat",
          "Binarët e dyerve rrëshqitëse",
          "Mbetjet e vogla që mund të hiqen gjatë pastrimit",
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
          "Jo. Ne heqim pluhurin dhe papastërtitë e punimeve. Mbetjet e mëdha, si inertet, tullat dhe materialet e ndërtimit, duhet të largohen para se të vijmë.",
      },
      {
        question: "Kur duhet t'ju kontaktoj?",
        answer: "Pasi punimet të kenë përfunduar dhe mbetjet e mëdha të jenë larguar.",
      },
      { question: "Sa kushton pastrimi pas ndërtimit?", answer: priceAnswer },
    ],
    related: ["me-themel", "zyra"],
  },

  divane: {
    metaTitle: "Larje divanesh dhe dyshekësh në Tiranë",
    metaDescription:
      "Larje divanesh, këndesh, kolltuqesh dhe dyshekësh me makineri ekstraktimi në shtëpinë ose zyrën tuaj në Tiranë. Na dërgoni 1–3 foto në WhatsApp për ofertë.",
    h1: "Larje divanesh dhe dyshekësh në Tiranë",
    intro:
      "Lajmë divane, kënde, kolltuqe, karrige me pëlhurë dhe dyshekë me makineri ekstraktimi, në shtëpinë ose zyrën tuaj. Na dërgoni 1–3 foto në WhatsApp dhe ju japim ofertën.",
    summary: "Larje divanesh, kolltuqesh dhe dyshekësh me makineri ekstraktimi, në shtëpinë tuaj.",
    heroVideo: videos.sofaExtraction,
    sections: [
      {
        kind: "checklist",
        title: "Çfarë lajmë",
        items: ["Divane dhe kënde", "Kolltuqe", "Karrige me pëlhurë", "Dyshekë"],
      },
      {
        kind: "steps",
        title: "Si e bëjmë",
        steps: [
          { title: "Heqja e pluhurit", text: "Heqim pluhurin dhe papastërtinë e thatë." },
          {
            title: "Larja me makineri ekstraktimi",
            text: "Makineria hedh ujë me detergjent në pëlhurë dhe e thith sërish bashkë me papastërtinë.",
          },
          {
            title: "Tharja",
            text: "Pëlhura lihet të thahet. Koha varet nga lloji i pëlhurës dhe nga ajrimi.",
          },
        ],
      },
      { kind: "media", videos: [videos.sofaWater] },
      {
        kind: "text",
        title: "Çfarë duhet të dini",
        paragraphs: [
          "Rezultati varet nga lloji i pëlhurës dhe i njollës. Disa njolla të vjetra ose njolla boje mund të mos hiqen plotësisht. Na tregoni për njollat kur na dërgoni fotot. Presim që divani të thahet mirë para se ta përdorni.",
        ],
      },
    ],
    faq: [
      {
        question: "A vini në shtëpi?",
        answer: "Po, e lajmë divanin ose dyshekun aty ku ndodhet.",
      },
      {
        question: "Sa kohë duhet për t'u tharë?",
        answer: "Varet nga pëlhura dhe nga ajrimi i dhomës. Ju tregojmë kur mund ta përdorni pasi ta shohim.",
      },
      {
        question: "Sa kushton?",
        answer:
          "Varet nga numri, përmasat dhe gjendja e divaneve ose dyshekëve. Na dërgoni 1–3 foto në WhatsApp dhe ju japim ofertën.",
      },
    ],
    related: ["me-themel", "apartamente"],
  },

  airbnb: {
    metaTitle: "Pastrim Airbnb për pronarë në Tiranë",
    metaDescription:
      "Pastrim Airbnb në Tiranë pas çdo check-out-i, për ta përgatitur pronën për mysafirin tjetër. Për një ose disa prona. Na shkruani në WhatsApp për ofertë.",
    h1: "Pastrim Airbnb në Tiranë",
    intro:
      "Pas largimit të mysafirit, pastrojmë pronën, ndërrojmë çarçafët kur ka të pastër në pronë dhe e përgatisim për mysafirin tjetër.",
    summary: "Pas çdo check-out-i, pastrojmë pronën dhe e përgatisim për mysafirin tjetër.",
    hero: photos.bedroom,
    sections: [
      {
        kind: "steps",
        title: "Si funksionon pastrimi pas check-out-it",
        steps: [
          { title: "Kalendari", text: "Na dërgoni datat e check-out-it ose kalendarin e rezervimeve." },
          {
            title: "Pastrimi",
            text: "Vijmë pasi largohet mysafiri dhe pastrojmë dhomat, banjën dhe kuzhinën.",
          },
          {
            title: "Shtrati",
            text: "Rregullojmë shtratin dhe ndërrojmë çarçafët kur ka të pastër në pronë.",
          },
          {
            title: "Kontrolli",
            text: "Në fund kontrollojmë ambientin për t'u siguruar që është gati për mysafirin tjetër.",
          },
        ],
      },
      {
        kind: "checklist",
        title: "Çfarë përfshin çdo pastrim",
        items: [
          {
            label: "Dhoma e gjumit",
            text: "Krevati, sipërfaqet dhe dyshemeja. Çarçafët ndërrohen kur ka të pastër në pronë.",
          },
          { label: "Banjoja", text: "Tualeti, dushi, lavamani, pasqyra dhe dyshemeja." },
          { label: "Kuzhina", text: "Sipërfaqet, banaku, pianura dhe lavamani." },
          { label: "Në fund", text: "Përgatisim pronën për mysafirin tjetër dhe bëjmë një kontroll të fundit." },
        ],
      },
      {
        kind: "photoStory",
        title: "Gati për mysafirin tjetër",
        text: "Shtrati i rregulluar, peshqirët në vend dhe dhoma e ndenjes e rregullt pas qëndrimit të fundit.",
        photos: [photos.guestRoom, photos.livingRoomClean],
      },
      {
        kind: "text",
        id: "pronare",
        title: "Për një pronë apo për disa prona",
        paragraphs: [
          "Kur keni disa prona, rëndësi ka edhe organizimi i pastrimit sipas kalendarit. Na tregoni sa prona keni dhe sa shpesh ndërrohen mysafirët, që ta planifikojmë punën bashkë.",
          "Bashkëpunojmë me Prago, kompani që menaxhon prona me qira ditore, për pastrimin e pronave Airbnb.",
        ],
        link: { href: "https://www.prago.al/", label: "Rreth Prago" },
      },
    ],
    faq: [
      { question: "Sa kushton pastrimi i një Airbnb?", answer: priceAnswer },
      {
        question: "A i ndërroni çarçafët?",
        answer: "Po, i ndërrojmë kur ka çarçafë të pastër në pronë.",
      },
      {
        question: "Sa shpesh duhet pastruar një Airbnb?",
        answer: "Zakonisht pas çdo check-out-i. Na tregoni kalendarin e pronës dhe e organizojmë pastrimin bashkë.",
      },
      {
        question: "Çfarë ju duhet për ofertën?",
        answer:
          "Na tregoni sa prona keni, sa të mëdha janë, sa herë në muaj pastrohen dhe në cilën zonë ndodhen. Na i shkruani këto të dhëna në formular ose në WhatsApp.",
      },
    ],
    related: ["apartamente", "hotele"],
  },

  zyra: {
    metaTitle: "Pastrim zyrash në Tiranë",
    metaDescription:
      "Pastrim zyrash dhe ambientesh biznesi në Tiranë, para hapjes ose pas mbylljes, sipas orarit tuaj. Na shkruani në WhatsApp për të marrë ofertë.",
    h1: "Pastrim zyrash në Tiranë",
    intro:
      "Pastrojmë zyra dhe biznese të vogla e të mesme në Tiranë. Vijmë kur nuk ju pengojmë punën: para hapjes, pas mbylljes ose në ditët që zgjidhni.",
    summary: "Pastrim i rregullt për zyra dhe biznese në Tiranë.",
    sections: [
      {
        kind: "text",
        title: "Sipas orarit tuaj",
        paragraphs: [
          "E përgatisim zyrën para se të vijë stafi. Orarin e pastrimit e caktojmë bashkë, që të mos pengojë punën.",
          "Përpiqemi të dërgojmë të njëjtin ekip sa herë që është e mundur, që stafi juaj t'i njohë punonjësit.",
        ],
      },
      {
        kind: "checklist",
        title: "Në çdo vizitë",
        items: [
          "Tavolinat dhe sipërfaqet e punës",
          "Kuzhina ose salla e çajit",
          "Fshirja dhe larja e dyshemeve",
          "Zbrazja e koshave",
        ],
      },
      {
        kind: "photoStory",
        title: "Edhe pas rinovimit",
        text: "Kur zyra rinovohet, e pastrojmë pasi mbarojnë punimet. Heqim pluhurin, bojën dhe mbetjet e materialeve mbrojtëse nga dyshemeja.",
        photos: [photos.officeRenovation],
      },
      {
        kind: "note",
        text: "Keni disa ambiente ose dëshironi pastrim të rregullt?",
        link: { href: businessPath, label: "Shikoni shërbimin tonë të pastrimit për biznese." },
      },
    ],
    faq: [
      {
        question: "A pastroni jashtë orarit të punës?",
        answer: "Po. Vijmë para hapjes, pas mbylljes ose në ditët e caktuara të javës.",
      },
      {
        question: "Sa shpesh vini?",
        answer:
          "Sa shpesh vijmë e vendosim bashkë, sipas madhësisë së zyrës dhe numrit të njerëzve që punojnë aty.",
      },
      { question: "Sa kushton pastrimi i zyrës?", answer: priceAnswer },
    ],
    related: ["biznese", "ambiente"],
  },

  ambiente: {
    metaTitle: "Pastrim shkallësh dhe hollesh pallati",
    metaDescription:
      "Pastrim shkallësh, hollesh dhe hyrjesh pallatesh në Tiranë, çdo javë ose çdo muaj. Vizita për vlerësim është pa pagesë. Na shkruani në WhatsApp.",
    h1: "Pastrim shkallësh dhe ambientesh të përbashkëta në Tiranë",
    intro:
      "Shkallët, hollet dhe hyrjet e pallatit, të pastruara rregullisht. Flasim me administratorin ose përfaqësuesit e banorëve dhe caktojmë bashkë ditët.",
    summary: "Shkallë, holle dhe hyrje pallatesh, të pastruara rregullisht.",
    hero: photos.stairsTeam,
    sections: [
      {
        kind: "checklist",
        title: "Çfarë pastrojmë",
        // No lift: Limoni doesn't clean apartment-block lifts (Arbri, 17 Oct 2026).
        items: [
          "Shkallët dhe pragjet",
          "Parmakët",
          "Hollet dhe korridoret",
          "Hyrja dhe dera kryesore",
          "Xhamat e hyrjes nga brenda",
          "Zbrazja e koshave të ambienteve të përbashkëta",
        ],
      },
      {
        kind: "checklist",
        title: "Për kë është",
        items: [
          "Administratorë pallatesh",
          "Përfaqësues të banorëve",
          "Komplekse banimi",
          "Ndërtues që dorëzojnë një pallat të ri",
        ],
      },
      {
        kind: "steps",
        title: "Si e organizojmë",
        steps: [
          { title: "Vizitë pa pagesë", text: "Shohim katet, shkallët dhe hyrjet." },
          {
            title: "Plani dhe oferta",
            text: "Përcaktojmë sa shpesh vijmë dhe çfarë pastrojmë në çdo vizitë.",
          },
          {
            title: "Pastrim i rregullt",
            text: "Vijmë në ditët e caktuara, që banorët ta dinë kur pastrohet.",
          },
        ],
      },
      { kind: "media", videos: [videos.stairsAfter] },
    ],
    faq: [
      {
        question: "Sa shpesh vini?",
        answer: "Mund të vijmë çdo javë ose çdo muaj, sipas asaj që vendos pallati.",
      },
      {
        question: "Me kë bini dakord?",
        answer: "Me administratorin e pallatit ose me përfaqësuesit e banorëve.",
      },
      { question: "A paguhet vizita?", answer: "Jo, vizita për vlerësim është pa pagesë." },
    ],
    related: ["biznese", "zyra"],
  },

  hotele: {
    metaTitle: "Pastrim hotelesh në Tiranë",
    metaDescription:
      "Pastrim hotelesh dhe apart-hotelesh në Tiranë, për dhomat dhe ambientet e përbashkëta sipas orarit të check-in/check-out. Na shkruani në WhatsApp.",
    h1: "Pastrim hotelesh në Tiranë",
    intro:
      "Pastrojmë dhoma dhe ambiente të përbashkëta për hotele dhe apart-hotele. Ekipi përshtatet me numrin e dhomave dhe me oraret e check-in-it dhe check-out-it.",
    summary: "Dhoma dhe ambiente të përbashkëta, me plan sipas nevojave tuaja.",
    hero: photos.guestRoom,
    sections: [
      {
        kind: "text",
        title: "Fillojmë me një bisedë",
        paragraphs: [
          "Numri i dhomave, oraret e check-in-it dhe check-out-it dhe periudhat me më shumë punë ndryshojnë nga një hotel te tjetri. Na tregoni si punoni dhe ju propozojmë një plan.",
          "Në periudhat me më shumë punë mund të sjellim ekip shtesë, sipas marrëveshjes.",
        ],
      },
    ],
    faq: [
      {
        question: "A mund të na ndihmoni vetëm gjatë sezonit?",
        answer: "Po. Mund të organizojmë ekip shtesë gjatë periudhave me shumë punë, sipas marrëveshjes.",
      },
      {
        question: "A pastroni edhe ambientet e përbashkëta?",
        answer: "Po, përveç dhomave, pastrojmë edhe ambientet e përbashkëta, sipas planit që vendosim bashkë.",
      },
      { question: "Sa kushton pastrimi për një hotel?", answer: priceAnswer },
    ],
    related: ["biznese", "airbnb"],
  },
};

export const services: Service[] = serviceSlugs.map((slug) => ({
  slug,
  key: slug,
  path: serviceIndex[slug].path,
  navLabel: serviceIndex[slug].navLabel,
  ...data[slug],
}));

/** /per-biznese: the door for offices, shops, hotels and building administrators. */
export const businessPage: ServicePageContent = {
  key: "biznese",
  path: businessPath,
  navLabel: "Për biznese",
  metaTitle: "Pastrim për biznese dhe pallate në Tiranë",
  metaDescription:
    "Pastrim zyrash, dyqanesh, hotelesh dhe ambientesh të përbashkëta pallatesh në Tiranë, një herë ose rregullisht. Na shkruani në WhatsApp për ofertë.",
  h1: "Pastrim për biznese dhe pallate në Tiranë",
  intro:
    "Pastrojmë zyra, dyqane, hotele dhe ambientet e përbashkëta të pallateve. Vijmë një herë ose rregullisht, në orarin që nuk ju pengon punën.",
  summary: "Pastrojmë zyra, dyqane, hotele dhe ambientet e përbashkëta të pallateve.",
  ctaLabel: "Merrni ofertë për biznesin tuaj",
  sections: [
    {
      kind: "checklist",
      title: "Kë ndihmojmë",
      items: [
        "Zyra dhe studio",
        "Dyqane dhe salla ekspozimi",
        "Hotele dhe apart-hotele",
        "Administratorë pallatesh dhe kompleksesh",
        "Pronarë me disa prona me qira",
      ],
    },
    {
      kind: "checklist",
      title: "Çfarë pastrojmë",
      items: [
        "Tavolinat, sipërfaqet e punës dhe pajisjet nga jashtë",
        "Kuzhinën ose sallën e çajit",
        "Tualetet",
        "Dyshemetë",
        "Xhamat që arrihen nga brenda",
        "Shkallët, hollet dhe hyrjet",
        "Zbrazjen e koshave",
      ],
    },
    {
      kind: "text",
      title: "Një herë ose rregullisht",
      paragraphs: [
        "Mund të vijmë për një pastrim të vetëm, për shembull pas rinovimit, ose çdo javë dhe çdo muaj. Orarin e caktojmë bashkë: para hapjes, pas mbylljes ose në fundjavë. Përpiqemi të dërgojmë të njëjtin ekip, që stafi juaj t'i njohë punonjësit.",
      ],
    },
    {
      kind: "steps",
      title: "Si përgatitet oferta për biznesin",
      steps: [
        { title: "Na kontaktoni", text: "Na tregoni llojin e ambientit dhe çfarë ju duhet." },
        {
          title: "Vizitë pa pagesë",
          text: "Vijmë dhe e shohim ambientin, ose e vlerësojmë nga fotot që na dërgoni.",
        },
        { title: "Oferta me shkrim", text: "Ju tregojmë çfarë përfshihet, sa shpesh vijmë dhe sa kushton." },
        { title: "Fillojmë", text: "Caktojmë ditët dhe orarin." },
      ],
    },
    {
      kind: "checklist",
      title: "Çfarë na duhet për ofertën",
      items: [
        "Lloji i ambientit dhe adresa e përafërt",
        "Sipërfaqja e përafërt ose numri i kateve",
        "Sa shpesh e dëshironi pastrimin",
        "Orari kur mund të punojmë",
        "Foto ose video, nëse keni",
      ],
    },
    { kind: "media", title: "Nga puna jonë", photos: [photos.stairsTeam, photos.windowsTeam] },
  ],
  faq: [
    {
      question: "A mund të vini jashtë orarit të punës?",
      answer: "Po. Vijmë para hapjes, pas mbylljes ose në ditët që zgjidhni.",
    },
    {
      question: "A bëni kontratë për pastrim të rregullt?",
      answer:
        "Po. Pasi biem dakord për ofertën, bëjmë një kontratë ku përcaktojmë çfarë përfshihet dhe sa shpesh vijmë.",
    },
    { question: "A paguhet vizita për vlerësim?", answer: "Jo. Vizita para ofertës është pa pagesë." },
    { question: "Sa kushton?", answer: priceAnswer },
  ],
  related: ["zyra", "ambiente", "hotele"],
  closer: {
    title: "Keni një ambient pune për të pastruar?",
    text: "Na tregoni për ambientin dhe ju dërgojmë ofertën.",
  },
};

export function getService(slug: ServiceSlug): Service {
  return services.find((s) => s.slug === slug)!;
}

/** Label and path for any page key, for "Mund t'ju interesojë edhe" rows. */
export function pageLink(key: PageKey): { label: string; href: string } {
  if (key === "biznese") return { label: businessPage.navLabel, href: businessPage.path };
  return { label: serviceIndex[key].navLabel, href: serviceIndex[key].path };
}

/** A photo for list rows and social previews: the hero (or the hero clip's poster) if sharp. */
export function cardImage(page: ServicePageContent): PhotoAsset | undefined {
  if (page.hero) return page.hero.lowRes ? undefined : page.hero;
  if (page.heroVideo)
    return {
      src: page.heroVideo.poster,
      alt: page.heroVideo.label,
      caption: page.heroVideo.caption,
      orientation: "portrait",
      ratio: "9/16",
    };
  return undefined;
}

export function contentMetadata(page: ServicePageContent): Metadata {
  return pageMetadata({
    title: page.metaTitle,
    description: page.metaDescription,
    path: page.path,
    ogImage: cardImage(page)?.src,
  });
}

export function serviceMetadata(slug: ServiceSlug): Metadata {
  return contentMetadata(getService(slug));
}
