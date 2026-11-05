// First-touch campaign attribution for the lead form. Someone lands on a page with
// ?utm_source=…, reads two more pages and submits the form: the lead still records the source.
// Only the campaign parameters are kept, in sessionStorage (this tab only, gone when it closes).
// Never personal data, never written back into a URL.

const KEY = "limoni.utm";
const PARAMS = ["utm_source", "utm_campaign"] as const;
type Attribution = Partial<Record<(typeof PARAMS)[number], string>>;

/** Campaign tags only: letters, digits, "-", "_", "." (max 60). Anything else (spaces, "@",
 *  "+", digits-only phone-like strings) is dropped, so personal data can't ride along. */
function clean(value: string | null): string | undefined {
  const v = value?.trim();
  if (!v || v.length > 60 || !/^[A-Za-z0-9._-]+$/.test(v) || /^\+?\d{6,}$/.test(v)) return undefined;
  return v;
}

/** Reads the current URL; keeps the first values seen in this tab. */
export function captureAttribution(search: string = typeof window === "undefined" ? "" : window.location.search) {
  const params = new URLSearchParams(search);
  const fromUrl: Attribution = {};
  for (const p of PARAMS) {
    const v = clean(params.get(p));
    if (v) fromUrl[p] = v;
  }
  try {
    const stored = sessionStorage.getItem(KEY);
    if (!stored && Object.keys(fromUrl).length) sessionStorage.setItem(KEY, JSON.stringify(fromUrl));
  } catch {
    // Storage blocked (private mode, in-app browsers): the URL values below still work.
  }
  return fromUrl;
}

export function currentAttribution(search?: string): Attribution {
  const fromUrl = captureAttribution(search);
  try {
    const stored = sessionStorage.getItem(KEY);
    if (stored) {
      const parsed = JSON.parse(stored) as Attribution;
      return { utm_source: clean(parsed.utm_source ?? null), utm_campaign: clean(parsed.utm_campaign ?? null) };
    }
  } catch {
    // fall through
  }
  return fromUrl;
}
