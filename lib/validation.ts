import { z } from "zod";
import { normalizePhone } from "./phone";
import { frequencies, leadServiceValues, propertyTypes, timings } from "./service-index";

const optionalText = (max: number) =>
  z
    .string()
    .trim()
    .max(max, "Teksti është shumë i gjatë.")
    .optional()
    .transform((v) => (v ? v : undefined));

/** An optional choice: unknown or empty values are dropped rather than rejected. */
const optionalChoice = <T extends readonly { value: string }[]>(options: T) =>
  z
    .string()
    .optional()
    .transform((v) => (options.some((o) => o.value === v) ? (v as T[number]["value"]) : undefined));

export const SIZE_ERROR = "Shkruani vetëm një numër, për shembull, 80.";

export const leadSchema = z.object({
  service: z.enum(leadServiceValues, "Zgjidhni llojin e pastrimit."),
  name: z
    .string("Shkruani emrin.")
    .trim()
    .min(2, "Shkruani emrin me të paktën dy shkronja.")
    .max(80, "Emri është shumë i gjatë."),
  phone: z.string("Shkruani numrin e telefonit.").transform((value, ctx) => {
    const normalized = normalizePhone(value);
    if (!normalized) {
      ctx.addIssue({ code: "custom", message: "Numri nuk duket i saktë. Kontrolloni numrin dhe provoni përsëri." });
      return z.NEVER;
    }
    return normalized;
  }),
  propertyType: optionalChoice(propertyTypes),
  sizeM2: z
    .string()
    .trim()
    .optional()
    .transform((value, ctx) => {
      if (!value) return undefined;
      if (!/^\d{1,6}$/.test(value)) {
        ctx.addIssue({ code: "custom", message: SIZE_ERROR });
        return z.NEVER;
      }
      return Number(value);
    }),
  frequency: optionalChoice(frequencies),
  timing: optionalChoice(timings),
  businessName: optionalText(120),
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
