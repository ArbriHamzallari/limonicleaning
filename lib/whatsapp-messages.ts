import type { ServiceSlug } from "./service-index";

// One prefilled message per service, gender-neutral so it reads naturally whoever sends it.
// This is the only source of WhatsApp wording on the site: don't add other presets.
const messages: Record<ServiceSlug, string> = {
  apartamente:
    "Përshëndetje! Më intereson pastrimi i apartamentit/shtëpisë. A mund të më jepni një ofertë?",
  airbnb: "Përshëndetje! Më intereson pastrimi për Airbnb. A mund të flasim për pronën?",
  zyra: "Përshëndetje! Më intereson pastrimi i zyrës. A mund të më jepni një ofertë?",
  vila: "Përshëndetje! Më intereson pastrimi i vilës. A mund të më jepni një ofertë?",
  "me-themel": "Përshëndetje! Më intereson një pastrim me themel. A mund të më jepni një ofertë?",
  "pas-ndertimit":
    "Përshëndetje! Më duhet pastrim pas ndërtimit/rinovimit. A mund të më jepni një ofertë?",
  hotele: "Përshëndetje! Më intereson pastrimi për hotelin. A mund të flasim?",
};

const defaultMessage = "Përshëndetje! Do të doja një ofertë për pastrim.";

/** Homepage closer: a fill-in message, because that's exactly what we ask people to send. */
export const waQuoteTemplate =
  "Përshëndetje! Dua një ofertë për pastrim.\nZona: \nMadhësia e pronës (m²): \nLloji i pastrimit: ";

export function waMessageFor(service?: ServiceSlug): string {
  return service ? messages[service] : defaultMessage;
}
