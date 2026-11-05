// Which questions the lead form asks for each service (progressive disclosure), and the
// option lists for the Nov 2026 assessment fields. Client-safe; the API validates against
// the same lists. Values are stored as-is in the Lead row.

import type { LeadService } from "./service-index";

export const conditions = [
  { value: "banohet", label: "Banesë ku jetohet" },
  { value: "bosh", label: "Bosh, para se të hyni" },
  { value: "pas-punimeve", label: "Pas punimeve ose rinovimit" },
] as const;

export const assessmentMethods = [
  { value: "telefon", label: "Me një telefonatë" },
  { value: "foto", label: "Me foto në WhatsApp" },
  { value: "vizite", label: "Me vizitë, nëse duhet" },
] as const;

export const contactChannels = [
  { value: "WHATSAPP", label: "WhatsApp" },
  { value: "TELEFON", label: "Telefonatë" },
] as const;

const homePriorities = [
  { value: "kuzhina", label: "Kuzhina" },
  { value: "banja", label: "Banja" },
  { value: "xhamat", label: "Xhamat dhe kornizat" },
  { value: "dollapet", label: "Brenda dollapëve" },
  { value: "pajisjet", label: "Furra dhe frigoriferi" },
] as const;

const deepPriorities = [...homePriorities, { value: "divani-dysheket", label: "Divani dhe dyshekët" }] as const;

const constructionPriorities = [
  { value: "pluhuri", label: "Pluhuri i punimeve" },
  { value: "xhamat", label: "Xhamat dhe kornizat" },
  { value: "pllakat", label: "Pllakat dhe dyshemetë" },
  { value: "banja", label: "Banja" },
] as const;

const upholsteryItems = [
  { value: "divan", label: "Divan ose kënd" },
  { value: "kolltuqe", label: "Kolltuqe" },
  { value: "karrige", label: "Karrige me pëlhurë" },
  { value: "dyshek", label: "Dyshekë" },
] as const;

type Option = { readonly value: string; readonly label: string };

/** Deep cleaning asks this first: the reference price applies to apartments only. */
export const homePropertyTypes = [
  { value: "apartament", label: "Apartament" },
  { value: "shtepi", label: "Shtëpi" },
  { value: "vile", label: "Vilë" },
] as const;

export interface FormFields {
  size: boolean;
  condition: boolean;
  frequency: boolean;
  propertyType: boolean;
  /** Restricted property chips (deep cleaning); otherwise the full list. */
  propertyOptions?: readonly Option[];
  /** Business-name field regardless of the property type chosen. */
  business: boolean;
  priorities?: { legend: string; options: readonly Option[] };
}

const RECURRING: LeadService[] = ["apartamente", "vila", "airbnb", "zyra", "ambiente", "hotele", "tjeter"];
const NO_SIZE: LeadService[] = ["divane", "ambiente", "hotele"];

export function formFieldsFor(service: LeadService | ""): FormFields {
  const s = service || "tjeter";
  return {
    size: !NO_SIZE.includes(s),
    condition: s === "me-themel",
    frequency: RECURRING.includes(s),
    propertyType: service === "" || s === "tjeter" || s === "zyra" || s === "me-themel",
    propertyOptions: s === "me-themel" ? homePropertyTypes : undefined,
    business: s === "zyra" || s === "ambiente" || s === "hotele",
    priorities:
      s === "me-themel"
        ? { legend: "Çfarë ka më shumë rëndësi për ju? (opsionale)", options: deepPriorities }
        : s === "apartamente"
          ? { legend: "Çfarë ka më shumë rëndësi për ju? (opsionale)", options: homePriorities }
          : s === "pas-ndertimit"
            ? { legend: "Çfarë ka mbetur pas punimeve? (opsionale)", options: constructionPriorities }
            : s === "divane"
              ? { legend: "Çfarë doni të lani? (opsionale)", options: upholsteryItems }
              : undefined,
  };
}

/** Every priority value any service can send (server-side allow list). */
export const priorityValues: readonly string[] = Array.from(
  new Set([...deepPriorities, ...constructionPriorities, ...upholsteryItems].map((o) => o.value)),
);

export const priorityLabel = (value: string): string =>
  [...deepPriorities, ...constructionPriorities, ...upholsteryItems].find((o) => o.value === value)?.label ?? value;

/** "80", "80 m2" and "80m²" all mean 80. Empty is undefined; anything else is null (error). */
export function parseSize(raw: string): number | null | undefined {
  const value = raw.trim();
  if (!value) return undefined;
  const match = value.match(/^(\d{1,6})\s*(m2|m²|m)?$/i);
  return match ? Number(match[1]) : null;
}

/** A preferred date must be a real calendar day from today up to a year ahead. */
export function isValidPreferredDate(value: string, today = new Date()): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const [y, m, d] = value.split("-").map(Number);
  const date = new Date(Date.UTC(y, m - 1, d));
  if (date.getUTCFullYear() !== y || date.getUTCMonth() !== m - 1 || date.getUTCDate() !== d) return false;
  const start = Date.UTC(today.getFullYear(), today.getMonth(), today.getDate());
  return date.getTime() >= start && date.getTime() <= start + 366 * 86_400_000;
}
