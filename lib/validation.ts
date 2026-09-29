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
  // The form no longer asks for these (prompt 04); the columns keep their defaults.
  channel: z.enum(["WHATSAPP", "TELEFON"]).default("WHATSAPP"),
  area: optionalText(120),
  message: optionalText(1000),
  pagePath: z.string().trim().max(200).startsWith("/").catch("/"),
  utmSource: optionalText(100),
  utmCampaign: optionalText(100),
  /** Milliseconds timestamp from when the form was rendered (spam timing check). */
  startedAt: z.number().int().positive(),
});

export type LeadInput = z.infer<typeof leadSchema>;
