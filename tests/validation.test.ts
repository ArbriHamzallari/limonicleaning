import { describe, expect, it } from "vitest";
import { leadSchema } from "@/lib/validation";

const base = { service: "me-themel", name: "Ana Test", phone: "068 900 0000", startedAt: 1_700_000_000_000 };

describe("leadSchema", () => {
  it("accepts the shortest real request: service, name and phone, no photos, no size", () => {
    const r = leadSchema.safeParse(base);
    expect(r.success).toBe(true);
    if (!r.success) return;
    expect(r.data.phone).toBe("+355689000000");
    expect(r.data.channel).toBe("WHATSAPP");
    expect(r.data.priorities).toEqual([]);
    expect(r.data.sizeUnknown).toBe(false);
  });

  it("rejects a missing service, a short name and a bad phone with Albanian messages", () => {
    const r = leadSchema.safeParse({ ...base, service: "x", name: "A", phone: "123" });
    expect(r.success).toBe(false);
    if (r.success) return;
    const paths = r.error.issues.map((i) => i.path[0]);
    expect(paths).toEqual(expect.arrayContaining(["service", "name", "phone"]));
    expect(r.error.issues.find((i) => i.path[0] === "phone")?.message).toMatch(/Numri/);
  });

  it("rejects a size that is not a number", () => {
    const r = leadSchema.safeParse({ ...base, sizeM2: "80m" });
    expect(r.success).toBe(false);
  });

  it("drops unknown or tampered optional values instead of storing them", () => {
    const r = leadSchema.parse({
      ...base,
      priorities: ["kuzhina", "kuzhina", "drop table", "divani-dysheket"],
      condition: "e-shpikur",
      assessmentMethod: "foto",
      channel: "SMS",
      preferredDate: "2001-01-01",
      clientRequestId: "../../etc",
    });
    expect(r.priorities).toEqual(["kuzhina", "divani-dysheket"]);
    expect(r.condition).toBeUndefined();
    expect(r.assessmentMethod).toBe("foto");
    expect(r.channel).toBe("WHATSAPP");
    expect(r.preferredDate).toBeUndefined();
    expect(r.clientRequestId).toBeUndefined();
  });

  it("keeps a valid request id for duplicate protection", () => {
    const id = "3f1c2a9e-7b4d-4e0a-9c1f-2d5b6a7e8f90";
    expect(leadSchema.parse({ ...base, clientRequestId: id }).clientRequestId).toBe(id);
  });
});
