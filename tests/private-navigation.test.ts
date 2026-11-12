import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

// Guards the analytics privacy invariant in lib/analytics.ts: public code never navigates into a
// private route on the client (next/link, router.push/replace, redirect), because a document
// that already runs gtag would then show the private URL.
const PRIVATE = ["/kerkesa", "/flete-pune", "/admin"];
// lib/admin runs only inside the owner panel (private to private).
const PRIVATE_DIRS = ["app/admin", "app/kerkesa", "app/flete-pune", "lib/admin"];
const ROOTS = ["app", "components", "lib"];

function files(dir: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) return files(path);
    return /\.(tsx?|mjs)$/.test(name) ? [path] : [];
  });
}

const prefix = PRIVATE.map((p) => p.replace("/", "\\/")).join("|");
const clientNav = new RegExp(`(href=\\{?\\s*[\`"'](${prefix})|(push|replace|redirect)\\(\\s*[\`"'](${prefix}))`);

describe("private routes", () => {
  it("are never the target of a client navigation from public code", () => {
    const offenders = ROOTS.flatMap(files)
      .filter((f) => !PRIVATE_DIRS.some((d) => f.startsWith(d)))
      .filter((f) => !f.startsWith("app/api/"))
      .filter((f) => clientNav.test(readFileSync(f, "utf8")));
    expect(offenders).toEqual([]);
  });

  it("catches a link into a private route", () => {
    expect(clientNav.test('<Link href="/admin/kerkesa">')).toBe(true);
    expect(clientNav.test("router.push(`/kerkesa/${t}`)")).toBe(true);
    expect(clientNav.test('<Link href="/kerko-oferte">')).toBe(false);
  });
});
