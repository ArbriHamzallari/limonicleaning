import { beforeAll, describe, expect, it, vi } from "vitest";

vi.mock("next/headers", () => ({ cookies: async () => ({ get: () => undefined, set: () => {}, delete: () => {} }) }));
vi.mock("next/navigation", () => ({ redirect: () => { throw new Error("redirect"); } }));

const auth = await import("@/lib/admin/auth");

beforeAll(() => {
  process.env.ADMIN_USERS = `arbri:${auth.hashPassword("nje-fjalekalim-i-gjate", Buffer.alloc(16, 7))}`;
  process.env.ADMIN_SESSION_SECRET = "x".repeat(40);
});

describe("owner login", () => {
  it("verifies the right password only", () => {
    expect(auth.verifyPassword("arbri", "nje-fjalekalim-i-gjate")).toBe(true);
    expect(auth.verifyPassword("Arbri", "nje-fjalekalim-i-gjate")).toBe(true);
    expect(auth.verifyPassword("arbri", "gabim")).toBe(false);
    expect(auth.verifyPassword("dikush", "nje-fjalekalim-i-gjate")).toBe(false);
  });
  it("sessions are signed, expire, and stop working when the user is removed", () => {
    const v = auth.makeSessionValue("arbri", 1_000);
    expect(auth.readSessionValue(v, 2_000)).toBe("arbri");
    expect(auth.readSessionValue(v, 1_000 + 13 * 3600000)).toBeNull();
    const [payload, mac] = v.split(".");
    const forged = Buffer.from(JSON.stringify({ u: "arbri", exp: 9e15 })).toString("base64url");
    expect(auth.readSessionValue(`${forged}.${mac}`, 2_000)).toBeNull();
    expect(auth.readSessionValue(`${payload}.x${mac.slice(1)}`, 2_000)).toBeNull();
    const saved = process.env.ADMIN_USERS;
    process.env.ADMIN_USERS = "tjeter:abc";
    expect(auth.readSessionValue(v, 2_000)).toBeNull();
    process.env.ADMIN_USERS = saved;
  });
  it("is off when not configured", () => {
    const saved = process.env.ADMIN_SESSION_SECRET;
    process.env.ADMIN_SESSION_SECRET = "short";
    expect(auth.adminConfigured()).toBe(false);
    expect(auth.readSessionValue(auth.makeSessionValue("arbri"))).toBeNull();
    process.env.ADMIN_SESSION_SECRET = saved;
  });
});
