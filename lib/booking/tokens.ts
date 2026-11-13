// Unguessable links (customer status page, team job sheet) and the draft key for uploads.
// 32 random bytes (256 bits), base64url. The database stores a SHA-256 hash to look links up
// and an AES-256-GCM copy so the owner can copy a customer's link again; a database leak alone
// doesn't reveal working links without BOOKING_LINK_SECRET.
import { createCipheriv, createDecipheriv, createHash, randomBytes, timingSafeEqual } from "node:crypto";

export function newToken(): string {
  return randomBytes(32).toString("base64url");
}

export function hashToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

/** Accepts only strings shaped like our tokens (43 base64url chars). */
export function looksLikeToken(value: unknown): value is string {
  return typeof value === "string" && /^[A-Za-z0-9_-]{43}$/.test(value);
}

function key(): Buffer {
  const secret = process.env.BOOKING_LINK_SECRET;
  if (!secret || secret.length < 32) {
    if (process.env.NODE_ENV === "production") throw new Error("BOOKING_LINK_SECRET (32+ characters) is not set.");
    return createHash("sha256").update("limoni-dev-only-link-secret").digest();
  }
  return createHash("sha256").update(secret).digest();
}

export function encryptToken(token: string): string {
  const iv = randomBytes(12);
  const cipher = createCipheriv("aes-256-gcm", key(), iv);
  const enc = Buffer.concat([cipher.update(token, "utf8"), cipher.final()]);
  return [iv, cipher.getAuthTag(), enc].map((b) => b.toString("base64url")).join(".");
}

export function decryptToken(value: string): string | null {
  try {
    const [iv, tag, enc] = value.split(".").map((p) => Buffer.from(p, "base64url"));
    const decipher = createDecipheriv("aes-256-gcm", key(), iv);
    decipher.setAuthTag(tag);
    return Buffer.concat([decipher.update(enc), decipher.final()]).toString("utf8");
  } catch {
    return null;
  }
}

export function safeEqual(a: string, b: string): boolean {
  const ab = Buffer.from(a);
  const bb = Buffer.from(b);
  return ab.length === bb.length && timingSafeEqual(ab, bb);
}
