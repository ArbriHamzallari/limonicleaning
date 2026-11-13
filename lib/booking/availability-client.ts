// Browser side of GET /api/kerkesa/disponueshmeria for the booking section.
//
// - One request per service per page view (cached for five minutes), and only once the date
//   step is on screen, so a page view that never reaches the booking section costs nothing.
// - Demo times exist only in development (`next dev` with ?orare-demo in the address). They are
//   labelled as demo in the UI and a pick is sent as a preferred date and time of day, never as
//   a slot, so nothing can be held from them. In a production build the demo branch is removed.
import type { ServiceKey } from "./catalog";
import { addDays, formatDateSq, tzDate } from "./time";
import { PREFERRED_MAX_DAYS } from "./preferred-time";

export interface AvailableDay {
  date: string;
  label: string;
  times: string[];
}

export type Availability =
  | { mode: "live"; days: AvailableDay[] }
  | { mode: "preferred"; reason: string; minDate: string; maxDate: string }
  | { mode: "demo"; days: AvailableDay[]; minDate: string; maxDate: string };

const TTL_MS = 5 * 60 * 1000;
const cache = new Map<ServiceKey, { at: number; value: Promise<Availability> }>();

function isAvailability(data: unknown): data is Availability {
  if (!data || typeof data !== "object") return false;
  const d = data as Record<string, unknown>;
  if (d.mode === "live") return Array.isArray(d.days);
  if (d.mode === "preferred") return typeof d.minDate === "string" && typeof d.maxDate === "string";
  return false;
}

export function demoTimesEnabled(): boolean {
  if (process.env.NODE_ENV === "production") return false;
  return new URLSearchParams(window.location.search).has("orare-demo");
}

/** Sample times for development only. Some days are full so the "unavailable" state shows. */
export function demoAvailability(today: string): Availability {
  const days: AvailableDay[] = [];
  for (let i = 1; i <= 21; i++) {
    if (i % 5 === 0) continue;
    const date = addDays(today, i);
    days.push({ date, label: formatDateSq(date), times: i % 3 === 0 ? ["13:00"] : ["09:00", "13:00", "16:00"] });
  }
  return { mode: "demo", days, minDate: addDays(today, 1), maxDate: addDays(today, Math.min(21, PREFERRED_MAX_DAYS)) };
}

export function loadAvailability(service: ServiceKey, { refresh = false } = {}): Promise<Availability> {
  if (demoTimesEnabled()) return Promise.resolve(demoAvailability(tzDate(new Date())));
  const hit = cache.get(service);
  if (hit && !refresh && Date.now() - hit.at < TTL_MS) return hit.value;
  const value = fetch(`/api/kerkesa/disponueshmeria?sherbimi=${service}`, { signal: AbortSignal.timeout(15000) })
    .then((r) => (r.ok ? r.json() : Promise.reject(new Error(String(r.status)))))
    .then((data: unknown) => {
      if (!isAvailability(data)) throw new Error("shape");
      return data;
    });
  // A failure is never cached: "Provo sërish" must really try again.
  value.catch(() => cache.delete(service));
  cache.set(service, { at: Date.now(), value });
  return value;
}
