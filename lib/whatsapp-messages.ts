// Contextual WhatsApp message presets, kept in one place so wording stays consistent
// across the site instead of drifting page by page.
export const waMessages = {
  general: "Përshëndetje, dëshiroj të rezervoj pastrim për apartamentin tim.",
  offer:
    "Përshëndetje, do të doja një ofertë pastrimi. Më tregoni çfarë informacioni ju nevojitet.",
  airbnb:
    "Përshëndetje, jam i interesuar për pastrimin e Airbnb-së. Do të doja të diskutoja pronën dhe të merrja një ofertë.",
  pricing: "Përshëndetje, do të doja informacion më të detajuar rreth çmimeve të pastrimit.",
  service: (serviceName: string) =>
    `Përshëndetje, dëshiroj informacion rreth shërbimit "${serviceName}".`,
  contact: "Përshëndetje, do të doja të flisja me dikë nga Limoni Cleaning.",
  bookingFollowUp: (reference: string) =>
    `Përshëndetje! Sapo bëra një rezervim (${reference}) në faqe.`,

  // Pricing-card CTAs (/cmimet, service pages) — see CLAUDE.md "Services & pricing".
  apartmentQuote:
    "Përshëndetje, jam i interesuar për pastrimin e shtëpisë/apartamentit. Do të doja një ofertë.",
  officeQuote: "Përshëndetje, jam i interesuar për pastrimin e zyrës. Do të doja një ofertë.",
  villaQuote: "Përshëndetje, jam i interesuar për pastrimin e vilës. Do të doja një ofertë.",
  hotelQuote:
    "Përshëndetje, jam i interesuar për pastrimin e hotelit/apart-hotelit tim. Do të doja një ofertë.",
  constructionQuote:
    "Përshëndetje, kam nevojë për pastrim pas ndërtimit/rinovimit. Do të doja një ofertë.",
  deepCleanQuote:
    "Përshëndetje, jam i interesuar për një pastrim me themel. Do të doja më shumë informacion.",

  // Airbnb owner page: two separate pathways into two separate businesses.
  airbnbCleaningPath:
    "Përshëndetje, kam nevojë për pastrim Airbnb. Do të doja të diskutoja pronën dhe të merrja një ofertë.",
  airbnbBothPaths:
    "Përshëndetje, kam një Airbnb dhe më duhet ndihmë si me pastrimin ashtu edhe me menaxhimin e pronës.",

  // Airbnb inquiry: builds a real message from whatever the visitor filled in on the
  // four-field prompt (properties, m², monthly frequency per property, zone). No literal
  // blanks — reads naturally whether all, some, or none of the fields were filled in. This
  // is the primary Airbnb conversion path: it starts a conversation, it does not price
  // anything or promise a turnaround.
  airbnbInquiry: (properties?: string, sqm?: string, frequency?: string, zone?: string) => {
    const details: string[] = [];
    if (properties) details.push(`kam ${properties} prona`);
    if (sqm) details.push(`rreth ${sqm} m² secila`);
    if (frequency) details.push(`pastrimi nevojitet rreth ${frequency} herë në muaj për pronë`);
    if (zone) details.push(`pronat ndodhen në ${zone}`);

    const parts = ["Përshëndetje, jam i interesuar për pastrimet e Airbnb-ve."];
    if (details.length > 0) {
      const last = details[details.length - 1];
      const rest = details.slice(0, -1);
      const detailSentence = rest.length > 0 ? `${rest.join(", ")} dhe ${last}` : last;
      parts.push(`${detailSentence.charAt(0).toUpperCase()}${detailSentence.slice(1)}.`);
    }
    parts.push("Do të doja një ofertë.");
    return parts.join(" ");
  },
} as const;
