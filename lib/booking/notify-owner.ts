// Owner alerts for booking requests, reusing the existing channels (Resend email, optional
// WhatsApp Cloud API template to the OWNER only). Delivery status is stored apart from the
// booking status: a failed email never changes a request. Customers receive nothing
// automatically; the owner shares their status link by hand (see docs/booking-system.md).
import { Resend } from "resend";
import type { Lead } from "@prisma/client";
import { prisma } from "../prisma";
import { siteUrl } from "../seo";
import { sendLeadWhatsApp } from "../notify";
import { services, type ServiceKey } from "./catalog";
import { describeDate, latestProposal, priceText, snapshotOf } from "./requests";

const esc = (v: string) => v.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);
const text = (e: unknown) => (e instanceof Error ? e.message : String(e)).replace(/\s+/g, " ").slice(0, 200);

async function sendEmail(subject: string, rows: [string, string][], link: string): Promise<"sent" | "skipped"> {
  const { RESEND_API_KEY: key, EMAIL_TO: to, EMAIL_FROM: from } = process.env;
  if (!key || !to || !from) return "skipped";
  const html = `<div style="font-family:Arial,sans-serif;font-size:16px;color:#16241C">
    <p><a href="${esc(link)}" style="display:inline-block;background:#184A2C;color:#fff;padding:12px 20px;border-radius:999px;text-decoration:none;font-weight:bold">Hap kërkesën</a></p>
    <table cellpadding="6">${rows.map(([k, v]) => `<tr><td style="color:#5B6B60;vertical-align:top">${esc(k)}</td><td>${esc(v)}</td></tr>`).join("")}</table>
    <p style="color:#5B6B60">Kërkesë, jo rezervim: konfirmohet vetëm pasi ta miratoni.</p></div>`;
  const { error } = await new Resend(key).emails.send({ from, to, subject, html, text: [...rows.map(([k, v]) => `${k}: ${v}`), "", link].join("\n") });
  if (error) throw new Error(`Resend: ${error.message}`);
  return "sent";
}

export async function notifyOwnerNewRequest(requestId: string): Promise<void> {
  const r = await prisma.serviceRequest.findUnique({ where: { id: requestId }, include: { proposals: true, media: { where: { status: "ready" } } } });
  if (!r) return;
  const snap = snapshotOf(latestProposal(r));
  const label = services[r.service as ServiceKey]?.label ?? r.service;
  const link = `${siteUrl}/admin/kerkesa/${r.id}`;
  const rows: [string, string][] = [
    ["Shërbimi", label],
    ["Emri", r.name],
    ["Telefoni", r.phone],
    ["Zona", r.area ?? "-"],
    ["Data", describeDate(snap.date)],
    ...(r.email ? [["Email", r.email] as [string, string]] : []),
    ["Çmimi", priceText(snap.price)],
    ["Foto/video", String(r.media.length)],
  ];
  const [email, whatsapp] = await Promise.allSettled([
    sendEmail(`Kërkesë e re për shqyrtim: ${label} (${r.name})`, rows, link),
    sendLeadWhatsApp({ service: r.service, name: r.name, phone: r.phone } as Lead),
  ]);
  const d = (n: string, x: PromiseSettledResult<"sent" | "skipped">) => (x.status === "fulfilled" ? `${n}:${x.value}` : `${n}:failed (${text(x.reason)})`);
  await prisma.serviceRequest
    .update({
      where: { id: requestId },
      data: {
        emailSentAt: email.status === "fulfilled" && email.value === "sent" ? new Date() : null,
        whatsappSentAt: whatsapp.status === "fulfilled" && whatsapp.value === "sent" ? new Date() : null,
        notifyStatus: `${d("email", email)}; ${d("whatsapp", whatsapp)}`,
      },
    })
    .catch(() => console.error(`[booking:notify] could not record result for ${requestId}`));
}

/** Customer accepted/declined/cancelled/replied: email the owner (best effort, logged on failure). */
export async function notifyOwnerUpdate(requestId: string, what: string): Promise<void> {
  try {
    const r = await prisma.serviceRequest.findUnique({ where: { id: requestId } });
    if (!r) return;
    const label = services[r.service as ServiceKey]?.label ?? r.service;
    await sendEmail(`${what}: ${label} (${r.name})`, [["Kërkesa", label], ["Klienti", r.name], ["Ngjarja", what]], `${siteUrl}/admin/kerkesa/${r.id}`);
  } catch (e) {
    console.error(`[booking:notify] update email failed for ${requestId}: ${text(e)}`);
  }
}

export async function sendOwnerDigest(lines: string[]): Promise<"sent" | "skipped"> {
  return sendEmail("Limoni: kërkesa që presin vëmendje", lines.map((l, i) => [String(i + 1), l] as [string, string]), `${siteUrl}/admin/kerkesa`);
}
