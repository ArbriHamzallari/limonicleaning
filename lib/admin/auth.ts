// Owner login: the smallest secure option for one or two people. No accounts table.
//  ADMIN_USERS          "arbri:scrypt.16384.8.1.<salt>.<hash>" (comma-separated for more people).
//                       Dots, not "$": Next.js expands "$…" inside .env files.
//                       create a hash with `npm run admin:hash` (reads the password from stdin).
//  ADMIN_SESSION_SECRET 32+ random characters, signs the session cookie.
// Session: httpOnly, SameSite=Strict, Secure in production, 12 hours. Every admin page,
// action and media route calls requireAdmin() itself (no reliance on a proxy).
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createHmac, scryptSync, timingSafeEqual } from "node:crypto";
import { cache } from "react";

export const SESSION_COOKIE = "limoni_admin";
const SESSION_HOURS = 12;
const DUMMY = ["scrypt", "16384", "8", "1", "AAAAAAAAAAAAAAAAAAAAAA", "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA"].join(".");

export function adminConfigured(): boolean {
  return !!(process.env.ADMIN_USERS && (process.env.ADMIN_SESSION_SECRET?.length ?? 0) >= 32);
}

function users(): Map<string, string> {
  const map = new Map<string, string>();
  for (const entry of (process.env.ADMIN_USERS ?? "").split(",")) {
    const i = entry.indexOf(":");
    if (i > 0) map.set(entry.slice(0, i).trim().toLowerCase(), entry.slice(i + 1).trim());
  }
  return map;
}

export function hashPassword(password: string, salt: Buffer): string {
  const hash = scryptSync(password, salt, 32, { N: 16384, r: 8, p: 1 });
  return ["scrypt", "16384", "8", "1", salt.toString("base64url"), hash.toString("base64url")].join(".");
}

export function verifyPassword(username: string, password: string): boolean {
  const stored = users().get(username.trim().toLowerCase());
  // Always do the scrypt work so unknown usernames take as long as wrong passwords.
  const parts = (stored ?? DUMMY).split(".");
  const [, N, r, p, salt, hash] = parts.length === 6 ? parts : DUMMY.split(".");
  const expected = Buffer.from(hash, "base64url");
  const actual = scryptSync(password, Buffer.from(salt, "base64url"), expected.length, { N: Number(N), r: Number(r), p: Number(p) });
  return !!stored && actual.length === expected.length && timingSafeEqual(actual, expected);
}

function sign(payload: string): string {
  return createHmac("sha256", process.env.ADMIN_SESSION_SECRET!).update(payload).digest("base64url");
}

export function makeSessionValue(username: string, now = Date.now()): string {
  const payload = Buffer.from(JSON.stringify({ u: username.toLowerCase(), exp: now + SESSION_HOURS * 3600000 })).toString("base64url");
  return `${payload}.${sign(payload)}`;
}

export function readSessionValue(value: string | undefined, now = Date.now()): string | null {
  if (!value || !adminConfigured()) return null;
  const [payload, mac] = value.split(".");
  if (!payload || !mac) return null;
  const expected = sign(payload);
  if (mac.length !== expected.length || !timingSafeEqual(Buffer.from(mac), Buffer.from(expected))) return null;
  try {
    const { u, exp } = JSON.parse(Buffer.from(payload, "base64url").toString()) as { u: string; exp: number };
    if (typeof u !== "string" || exp < now || !users().has(u)) return null;
    return u;
  } catch {
    return null;
  }
}

export async function startSession(username: string) {
  (await cookies()).set(SESSION_COOKIE, makeSessionValue(username), {
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_HOURS * 3600,
  });
}

export async function endSession() {
  (await cookies()).delete(SESSION_COOKIE);
}

export const currentAdmin = cache(async (): Promise<string | null> => readSessionValue((await cookies()).get(SESSION_COOKIE)?.value));

/** Use at the top of every admin page, action and route. */
export async function requireAdmin(): Promise<string> {
  const user = await currentAdmin();
  if (!user) redirect("/admin/hyr");
  return user;
}
