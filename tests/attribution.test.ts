import { beforeEach, describe, expect, it } from "vitest";
import { currentAttribution } from "@/lib/attribution";

const store = new Map<string, string>();
beforeEach(() => {
  store.clear();
  (globalThis as { sessionStorage?: unknown }).sessionStorage = {
    getItem: (k: string) => store.get(k) ?? null,
    setItem: (k: string, v: string) => void store.set(k, v),
  };
});

describe("first-touch campaign attribution", () => {
  it("keeps the landing UTM when the form is submitted on another page", () => {
    expect(currentAttribution("?utm_source=facebook&utm_campaign=themel-nov")).toEqual({
      utm_source: "facebook",
      utm_campaign: "themel-nov",
    });
    expect(currentAttribution("")).toEqual({ utm_source: "facebook", utm_campaign: "themel-nov" });
    expect(currentAttribution("?utm_source=google")).toMatchObject({ utm_source: "facebook" });
  });

  it("stores only campaign parameters", () => {
    currentAttribution("?utm_source=ig&name=Ana&phone=0690000000");
    expect([...store.values()].join("")).not.toMatch(/Ana|069/);
  });

  it("drops values that aren't plain campaign tags (spaces, emails, phone numbers)", () => {
    expect(currentAttribution("?utm_source=ana%40mail.com&utm_campaign=0690000000")).toEqual({});
    store.clear();
    expect(currentAttribution("?utm_source=Ana%20Hoxha")).toEqual({});
  });

  it("still works when storage is blocked", () => {
    (globalThis as { sessionStorage?: unknown }).sessionStorage = {
      getItem: () => {
        throw new Error("blocked");
      },
      setItem: () => {
        throw new Error("blocked");
      },
    };
    expect(currentAttribution("?utm_source=whatsapp")).toEqual({ utm_source: "whatsapp" });
  });
});
