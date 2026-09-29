import { z } from "zod";

export const propertyTypeValues = [
  "APARTAMENT",
  "AIRBNB",
  "VILE",
  "ZYRE",
  "BIZNES",
  "TJETER",
] as const;

export const cleaningTypeValues = ["STANDARD", "THEMEL"] as const;

export const bookingSchema = z.object({
  propertyType: z.enum(propertyTypeValues),
  typology: z.string().min(1, "Zgjidh madhësinë e pronës."),
  cleaningType: z.enum(cleaningTypeValues),
  date: z
    .string()
    .min(1, "Zgjidh një datë.")
    .refine((val) => !Number.isNaN(Date.parse(val)), "Data nuk është e vlefshme."),
  time: z.string().min(1, "Zgjidh një orar."),
  extras: z.array(z.string()).default([]),
  estimatedPriceAll: z.number().int().positive().optional(),
  name: z.string().trim().min(2, "Shkruaj emrin tënd."),
  phone: z
    .string()
    .trim()
    .min(6, "Shkruaj një numër telefoni të vlefshëm.")
    .max(20, "Numri i telefonit është shumë i gjatë."),
  email: z.union([z.literal(""), z.string().trim().email("Email nuk është i vlefshëm.")]).optional(),
  address: z.string().trim().max(300).optional(),
  notes: z.string().trim().max(1000).optional(),
});

export type BookingInput = z.infer<typeof bookingSchema>;

export const contactSchema = z.object({
  name: z.string().trim().min(2, "Shkruaj emrin tënd."),
  phone: z.string().trim().max(20).optional(),
  email: z.union([z.literal(""), z.string().trim().email("Email nuk është i vlefshëm.")]).optional(),
  subject: z.string().trim().max(200).optional(),
  message: z.string().trim().min(5, "Shkruaj një mesazh më të gjatë."),
});

export type ContactInput = z.infer<typeof contactSchema>;
