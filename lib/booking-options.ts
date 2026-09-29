import type { propertyTypeValues, cleaningTypeValues } from "@/lib/validation";
import { sqmRates } from "@/lib/pricing";

export type PropertyTypeValue = (typeof propertyTypeValues)[number];
export type CleaningTypeValue = (typeof cleaningTypeValues)[number];

export const propertyTypeOptions: { value: PropertyTypeValue; label: string }[] = [
  { value: "APARTAMENT", label: "Apartament" },
  { value: "AIRBNB", label: "Airbnb" },
  { value: "VILE", label: "Vilë" },
  { value: "ZYRE", label: "Zyrë" },
  { value: "BIZNES", label: "Biznes" },
  { value: "TJETER", label: "Tjetër" },
];

export const cleaningTypeOptions: { value: CleaningTypeValue; label: string; description: string }[] = [
  {
    value: "STANDARD",
    label: "Pastrim Standard",
    description: "Fshirje pluhuri, sipërfaqe, dysheme, kuzhinë e banjo.",
  },
  {
    value: "THEMEL",
    label: "Pastrim me Themel",
    description: "Gjithçka nga standard, plus brenda dollapëve, furrës dhe kornizave.",
  },
];

// Typology (1+1 … 4+1) as a quick way to describe a property's size in the booking form.
// This is purely an input convenience, independent of pricing — see lib/pricing.ts for
// the actual public per-m² rates.
export type Typology = "1+1" | "2+1" | "3+1" | "4+1";
export const typologies: Typology[] = ["1+1", "2+1", "3+1", "4+1"];

// Property types that use the quick typology buttons in step 2 of the booking form.
// Others get a free-text "sipërfaqja / përshkrim" field instead.
export const typologyInputTypes: PropertyTypeValue[] = ["APARTAMENT", "AIRBNB"];

// Property types with a published per-m² starting rate (see lib/pricing.ts). Airbnb and
// everything else is quote-only — never show a computed number for those.
export const sqmRateByPropertyType: Partial<Record<PropertyTypeValue, number>> = {
  APARTAMENT: sqmRates.apartament,
  ZYRE: sqmRates.zyre,
  VILE: sqmRates.vile,
};

export const timeSlots = ["09:00", "11:00", "13:00", "15:00", "17:00"];

export const extrasOptions = ["Larje rrobash", "Hekurosje", "Pastrim dritaresh"];
