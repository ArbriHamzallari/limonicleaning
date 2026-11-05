import { describe, expect, it } from "vitest";
import { whatsappLink } from "@/lib/business";
import { waMessageFor } from "@/lib/whatsapp-messages";
import { serviceSlugs } from "@/lib/service-index";

describe("WhatsApp links", () => {
  it("point at the one business number and keep ë/ç intact", () => {
    for (const key of [...serviceSlugs, "biznese" as const, undefined]) {
      const url = new URL(whatsappLink(waMessageFor(key)));
      expect(url.origin + url.pathname).toBe("https://wa.me/355689007252");
      expect(url.searchParams.get("text")).toBe(waMessageFor(key));
    }
    expect(new URL(whatsappLink("Përshëndetje, çmimi?")).searchParams.get("text")).toBe("Përshëndetje, çmimi?");
  });

  it("no preset promises photos", () => {
    for (const key of serviceSlugs) expect(waMessageFor(key)).not.toMatch(/foto/i);
  });
});
