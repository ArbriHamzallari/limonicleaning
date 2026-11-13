import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { Lead } from "@prisma/client";

// Local only: the database write-back, Resend and the WhatsApp endpoint are all mocked.
// No email or WhatsApp message is sent by these tests.
const update = vi.fn();
const resendSend = vi.fn();
vi.mock("@/lib/prisma", () => ({ prisma: { lead: { update } } }));
vi.mock("resend", () => ({
  Resend: class {
    emails = { send: resendSend };
  },
}));

const { notifyNewLead } = await import("@/lib/notify");

const lead = {
  id: "lead_test",
  service: "me-themel",
  name: "Test Klient",
  phone: "+355690000000",
  channel: "WHATSAPP",
  pagePath: "/",
  priorities: [],
  sizeUnknown: false,
} as unknown as Lead;

const ENV = ["RESEND_API_KEY", "EMAIL_TO", "EMAIL_FROM", "WHATSAPP_TOKEN", "WHATSAPP_PHONE_NUMBER_ID", "OWNER_WHATSAPP", "WHATSAPP_TEMPLATE_NEW_LEAD"];

beforeEach(() => {
  update.mockReset().mockResolvedValue({});
  resendSend.mockReset();
  for (const k of ENV) delete process.env[k];
  vi.spyOn(console, "warn").mockImplementation(() => {});
  vi.spyOn(console, "error").mockImplementation(() => {});
});
afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe("owner notification result is recorded on the lead", () => {
  it("records 'skipped' when nothing is configured (the lead itself is untouched)", async () => {
    await notifyNewLead(lead);
    expect(update).toHaveBeenCalledWith({
      where: { id: "lead_test" },
      data: { emailSentAt: null, whatsappSentAt: null, notifyStatus: "email:skipped; whatsapp:skipped" },
    });
  });

  it("records a sent email with its time", async () => {
    Object.assign(process.env, { RESEND_API_KEY: "re_test", EMAIL_TO: "owner@example.test", EMAIL_FROM: "x@example.test" });
    resendSend.mockResolvedValue({ error: null });
    await notifyNewLead(lead);
    const data = update.mock.calls[0][0].data;
    expect(data.emailSentAt).toBeInstanceOf(Date);
    expect(data.notifyStatus).toBe("email:sent; whatsapp:skipped");
  });

  it("records failures per channel and keeps customer data out of the log", async () => {
    Object.assign(process.env, {
      RESEND_API_KEY: "re_test",
      EMAIL_TO: "owner@example.test",
      EMAIL_FROM: "x@example.test",
      WHATSAPP_TOKEN: "t",
      WHATSAPP_PHONE_NUMBER_ID: "1",
      OWNER_WHATSAPP: "355600000000",
      WHATSAPP_TEMPLATE_NEW_LEAD: "kerkese_e_re",
    });
    resendSend.mockResolvedValue({ error: { message: "domain not verified" } });
    const fetchMock = vi.fn().mockResolvedValue(new Response("template paused", { status: 400 }));
    vi.stubGlobal("fetch", fetchMock);
    const errors = vi.spyOn(console, "error").mockImplementation(() => {});

    await notifyNewLead(lead);

    const data = update.mock.calls[0][0].data;
    expect(data.emailSentAt).toBeNull();
    expect(data.whatsappSentAt).toBeNull();
    expect(data.notifyStatus).toBe(
      "email:failed (Resend: domain not verified); whatsapp:failed (WhatsApp Cloud API 400: template paused)",
    );
    expect(fetchMock).toHaveBeenCalledTimes(1); // mocked: nothing left this machine
    const logged = errors.mock.calls.flat().map(String).join(" ");
    expect(logged).toContain("lead_test");
    expect(logged).not.toMatch(/Test Klient|355690000000/);
  });

  it("a failed write-back is logged, never thrown", async () => {
    update.mockRejectedValueOnce(new Error("db down"));
    await expect(notifyNewLead(lead)).resolves.toBeUndefined();
  });
});
