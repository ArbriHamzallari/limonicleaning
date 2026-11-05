// Operating settings for availability and holds. Every business value Limoni hasn't decided
// yet is null, and a null switches live holds OFF for that service: the customer then picks a
// preferred date that is explicitly NOT held. Nothing here is published as a promise.
//
// To change settings without a code change, set BOOKING_SETTINGS (JSON, same shape, merged
// over these defaults) in the environment. Example in docs/booking-system.md.

import type { ServiceKey } from "./catalog";

export interface ServiceCapacity {
  /** Conservative reserved working window for one job, in minutes. */
  durationMinutes: number | null;
  /** How many crews one job of this service occupies. */
  crewsNeeded: number;
}

export interface BookingSettings {
  /** Master switch: holds are only made when this is true AND the rest is configured. */
  liveHolds: boolean;
  /** 0 = Sunday … 6 = Saturday. Limoni works every day (Arbri, 17 Oct 2026). */
  workingDays: number[];
  /** Times a job may start, Tirana wall clock, e.g. ["08:00", "13:00"]. */
  startTimes: string[] | null;
  /** Latest end of a job (wall clock), e.g. "18:00". */
  dayEndsAt: string | null;
  /** Travel/setup buffer added after each job, minutes. */
  bufferMinutes: number | null;
  /** Independently bookable crews (NOT the number of cleaners). */
  crews: number | null;
  /** Earliest bookable start, hours from now. */
  minLeadHours: number;
  /** How far ahead the date picker goes. */
  horizonDays: number;
  /** A pending hold is released automatically after this many hours. null = never automatically. */
  holdHours: number | null;
  /** Internal reminder: holds older than this are flagged in the owner inbox and the daily digest. */
  staleHoldAlertHours: number;
  /** A busy appointment typed into Google Calendar blocks "all" crews (safe default) or "one". */
  manualBusyBlocks: "all" | "one";
  services: Partial<Record<ServiceKey, ServiceCapacity>>;
}

export const defaultBookingSettings: BookingSettings = {
  liveHolds: false,
  workingDays: [0, 1, 2, 3, 4, 5, 6],
  startTimes: null,
  dayEndsAt: null,
  bufferMinutes: null,
  crews: null,
  minLeadHours: 24,
  horizonDays: 30,
  holdHours: null,
  staleHoldAlertHours: 24,
  manualBusyBlocks: "all",
  services: {},
};

let cached: { raw: string | undefined; value: BookingSettings } | null = null;

export function getBookingSettings(): BookingSettings {
  const raw = process.env.BOOKING_SETTINGS;
  if (cached && cached.raw === raw) return cached.value;
  let override: Partial<BookingSettings> = {};
  if (raw) {
    try {
      override = JSON.parse(raw);
    } catch {
      console.error("[booking] BOOKING_SETTINGS is not valid JSON; using defaults (no live holds).");
    }
  }
  const value = { ...defaultBookingSettings, ...override, services: { ...defaultBookingSettings.services, ...override.services } };
  cached = { raw, value };
  return value;
}

/** Why live holds are off for a service (Albanian-free, for the owner/docs), or null when on. */
export function holdBlocker(service: ServiceKey, s: BookingSettings = getBookingSettings()): string | null {
  if (!s.liveHolds) return "live holds are switched off";
  if (!s.startTimes?.length || !s.dayEndsAt) return "working hours are not set";
  if (s.bufferMinutes == null) return "travel/setup buffer is not set";
  if (!s.crews) return "crew capacity is not set";
  const cap = s.services[service];
  if (!cap?.durationMinutes) return "this service has no duration";
  if (cap.crewsNeeded > s.crews) return "this service needs more crews than configured";
  return null;
}
