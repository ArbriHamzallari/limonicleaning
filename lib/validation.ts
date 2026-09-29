import { z } from "zod";
import { normalizePhone } from "./phone";
import { leadServiceValues } from "./service-index";

const optionalText = (max: number) =>
  z
    .string()
    .trim()
    .max(max, "Teksti është shumë i gjatë.")
    .optional()
    .transform((v) => (v ? v : undefined));

const optionalCount = z
  .string()
  .trim()
  .regex(/^\d{0,5}$/, "Shkruani vetëm një numër.")
  .optional()
  .transform((v) => (v ? v : undefined));

export const leadSchema = z.object({
  service: z.enum(leadServiceValues, "Zgjidhni llojin e pastrimit."),
  name: z
    .string("Shkruani emrin.")
    .trim()
    .min(2, "Shkruani emrin (të paktën 2 shkronja).")
    .max(80, "Emri është shumë i gjatë."),
  phone: z.string("Shkruani numrin e telefonit.").transform((value, ctx) => {
    const normalized = normalizePhone(value);
    if (!normalized) {
      ctx.addIssue({ code: "custom", message: "Numri nuk duket i saktë. Shembull: 068 123 4567." });
      return z.NEVER;
    }
    return normalized;
  }),
  channel: z.enum(["WHATSAPP", "TELEFON"]).default("WHATSAPP"),
  area: optionalText(120),
  message: optionalText(1000),
  // Only sent when service is "airbnb"; folded into the message on save.
  airbnbProperties: optionalCount,
  airbnbSize: optionalCount,
  airbnbTurnovers: optionalCount,
  pagePath: z.string().trim().max(200).startsWith("/").catch("/"),
  utmSource: optionalText(100),
  utmCampaign: optionalText(100),
  /** Milliseconds timestamp from when the form was rendered (spam timing check). */
  startedAt: z.number().int().positive(),
});

export type LeadInput = z.infer<typeof leadSchema>;

/** Builds the stored message, adding the optional Airbnb details as one plain sentence. */
export function composeLeadMessage(input: LeadInput): string | undefined {
  const parts: string[] = [];
  if (input.service === "airbnb") {
    const details = [
      input.airbnbProperties && `${input.airbnbProperties} prona`,
      input.airbnbSize && `rreth ${input.airbnbSize} m² secila`,
      input.airbnbTurnovers && `${input.airbnbTurnovers} pastrime në muaj për pronë`,
    ].filter(Boolean);
    if (details.length) parts.push(`Airbnb: ${details.join(", ")}.`);
  }
  if (input.message) parts.push(input.message);
  return parts.length ? parts.join("\n\n") : undefined;
}
