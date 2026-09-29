// Normalises what people actually type ("068 900 7252", "+355 68 900 7252", "0035568...",
// "689007252") to E.164. Albanian numbers are the default; foreign numbers must start with
// + or 00. Returns null when the input can't be a phone number. Shared by the form (for an
// instant error message) and the API (authoritative).
export function normalizePhone(raw: string): string | null {
  let s = raw.trim().replace(/[\s\-()./]/g, "");
  if (s.startsWith("00")) s = `+${s.slice(2)}`;

  if (!s.startsWith("+")) {
    if (!/^\d+$/.test(s)) return null;
    if (s.startsWith("355")) s = `+${s}`;
    else if (s.startsWith("0")) s = `+355${s.slice(1)}`;
    else if (/^6\d{8}$/.test(s)) s = `+355${s}`;
    else return null;
  }

  if (!/^\+\d{8,15}$/.test(s)) return null;

  if (s.startsWith("+355")) {
    // Mobile: 6X XXX XXXX (9 digits). Landline: e.g. Tirana 4 XXX XXXX (8 digits).
    const national = s.slice(4);
    if (!/^[1-9]\d{7,8}$/.test(national)) return null;
  }

  return s;
}
