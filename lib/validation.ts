import { z } from "zod";
import { normalizePhone } from "./phone";
import { frequencies, leadServiceValues, propertyTypes, timings } from "./service-index";
import { assessmentMethods, conditions, isValidPreferredDate, priorityValues } from "./lead-form";

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

const campaignTag = z
  .string()
  .trim()
  .optional()
  .transform((v) => (v && v.length <= 60 && /^[A-Za-z0-9._-]+$/.test(v) && !/^\+?\d{6,}$/.test(v) ? v : undefined));

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
  sizeUnknown: z.boolean().optional().default(false),
  frequency: optionalChoice(frequencies),
  timing: optionalChoice(timings),
  /** Only kept when it is a real day from today to a year ahead; otherwise dropped. */
  preferredDate: z
    .string()
    .optional()
    .transform((v) => (v && isValidPreferredDate(v) ? v : undefined)),
  condition: optionalChoice(conditions),
  assessmentMethod: optionalChoice(assessmentMethods),
  priorities: z
    .array(z.string())
    .max(12)
    .optional()
    .transform((list) => Array.from(new Set((list ?? []).filter((v) => priorityValues.includes(v))))),
  businessName: optionalText(120),
  /** How the visitor wants to be contacted (form chips, Nov 2026). */
  channel: z.enum(["WHATSAPP", "TELEFON"]).catch("WHATSAPP").default("WHATSAPP"),
  /** Zona ose qyteti, free text. */
  area: optionalText(120),
  /** Random id per form instance: a double or retried submit returns the first saved row. */
  clientRequestId: z
    .string()
    .regex(/^[A-Za-z0-9-]{8,64}$/)
    .optional()
    .catch(undefined),
  message: optionalText(1000),
  pagePath: z.string().trim().max(200).startsWith("/").catch("/"),
  // Campaign tags only (same rule as lib/attribution.ts): anything else is dropped.
  utmSource: campaignTag,
  utmCampaign: campaignTag,
  /** Milliseconds timestamp from when the form was rendered (spam timing check). */
  startedAt: z.number().int().positive(),
});

export type LeadInput = z.infer<typeof leadSchema>;
