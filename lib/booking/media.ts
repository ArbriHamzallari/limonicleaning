// Upload rules shared by the browser (to show limits and reject early) and the server (which
// is the authority: it re-checks size and the file's real signature after upload).

export const MAX_FILES = 8;
export const UPLOADS_OFF = "Ngarkimi i fotove nuk është aktiv tani. Mund t'i dërgoni në WhatsApp ose të vazhdoni pa foto.";
export const MAX_PHOTO_BYTES = 15 * 1024 * 1024;
export const MAX_VIDEO_BYTES = 100 * 1024 * 1024;

const PHOTO_TYPES = ["image/jpeg", "image/png", "image/webp", "image/heic", "image/heif"];
const VIDEO_TYPES = ["video/mp4", "video/quicktime"];
const BY_EXTENSION: Record<string, string> = {
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  png: "image/png",
  webp: "image/webp",
  heic: "image/heic",
  heif: "image/heif",
  mp4: "video/mp4",
  mov: "video/quicktime",
};

export const ACCEPT_ATTR = [...PHOTO_TYPES, ...VIDEO_TYPES, ".heic", ".heif", ".mov"].join(",");
export const LIMITS_TEXT = "Foto (JPG, PNG, WEBP, HEIC) deri në 15 MB, video (MP4, MOV) deri në 100 MB, gjithsej deri në 8 skedarë.";

export function resolveType(name: string, declared: string): string | null {
  const t = declared.toLowerCase();
  if (PHOTO_TYPES.includes(t) || VIDEO_TYPES.includes(t)) return t;
  const ext = name.toLowerCase().split(".").pop() ?? "";
  return BY_EXTENSION[ext] ?? null;
}

export function kindOf(type: string): "photo" | "video" {
  return type.startsWith("video/") ? "video" : "photo";
}

export function checkFile(name: string, declared: string, size: number): { ok: true; type: string; kind: "photo" | "video" } | { ok: false; error: string } {
  const type = resolveType(name, declared);
  if (!type) return { ok: false, error: "Ky lloj skedari nuk pranohet. Dërgoni foto (JPG, PNG, WEBP, HEIC) ose video (MP4, MOV)." };
  const kind = kindOf(type);
  if (!Number.isInteger(size) || size <= 0) return { ok: false, error: "Skedari është bosh." };
  if (size > (kind === "video" ? MAX_VIDEO_BYTES : MAX_PHOTO_BYTES))
    return { ok: false, error: kind === "video" ? "Videoja është më e madhe se 100 MB." : "Fotoja është më e madhe se 15 MB." };
  return { ok: true, type, kind };
}

/** Real file signature check on the first bytes (server side, after upload). */
export function signatureMatches(type: string, head: Uint8Array): boolean {
  const ascii = (from: number, to: number) => String.fromCharCode(...head.slice(from, to));
  switch (type) {
    case "image/jpeg":
      return head[0] === 0xff && head[1] === 0xd8 && head[2] === 0xff;
    case "image/png":
      return head[0] === 0x89 && ascii(1, 4) === "PNG";
    case "image/webp":
      return ascii(0, 4) === "RIFF" && ascii(8, 12) === "WEBP";
    case "image/heic":
    case "image/heif":
      return ascii(4, 8) === "ftyp" && ["heic", "heix", "hevc", "heim", "heis", "mif1", "msf1", "heif"].includes(ascii(8, 12));
    case "video/mp4":
      return ascii(4, 8) === "ftyp";
    case "video/quicktime":
      return ["ftyp", "moov", "wide", "mdat", "free", "skip"].includes(ascii(4, 8));
    default:
      return false;
  }
}

export function formatBytes(n: number): string {
  return n >= 1024 * 1024 ? `${(n / 1024 / 1024).toFixed(1)} MB` : `${Math.max(1, Math.round(n / 1024))} KB`;
}
