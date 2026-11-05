// The customer benefit for asking for an assessment (Arbri, 4 Nov 2026). It is a deliverable,
// not a discount: a personalised plan and a written offer, prepared by hand AFTER the
// assessment (docs/assessment-fulfillment-template.md). Never say it is generated on submit,
// never promise a free visit (unconfirmed, 5 Nov 2026), never attach a deadline or scarcity.

export const assessmentBenefit = "Plan pastrimi dhe ofertë me shkrim, pa pagesë.";

export const assessmentBenefitText =
  "Sqarojmë çfarë ju duhet, përcaktojmë punët që përfshihen dhe ju japim një ofertë me shkrim. Pa detyrim për të rezervuar pastrimin.";

/** The three ways the assessment can happen. Photos are optional everywhere. */
export const assessmentRoutes = [
  {
    title: "Me një telefonatë",
    text: "Shpesh mjafton një bisedë e shkurtër: sipërfaqja, zona dhe çfarë ju duhet.",
  },
  {
    title: "Me foto, nëse doni",
    text: "Mund të na dërgoni disa foto në WhatsApp vetëm të zonave që duhen pastruar. Nuk janë të detyrueshme.",
  },
  {
    title: "Me vizitë, kur duhet",
    text: "Kur gjendja nuk sqarohet dot nga larg, caktojmë një vizitë vlerësimi përpara se të konfirmojmë çmimin. Nëse ka kosto, jua themi përpara.",
  },
];

/** Visits: arranged only when needed; any charge is disclosed and agreed first (5 Nov 2026). */
export const visitNote =
  "Kur duhet ta shohim ambientin, caktojmë një vizitë vlerësimi. Nëse vizita ka ndonjë kosto, jua themi përpara dhe vijmë vetëm pasi të bini dakord. Për zonat jashtë Tiranës, sqarojmë paraprakisht edhe mundësinë dhe kostot e transportit.";
