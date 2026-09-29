import { Resend } from "resend";
import type { Lead } from "@prisma/client";
import { leadServiceLabel } from "./service-index";

// Every saved lead is announced on two independent channels. Either one failing (or not
// being configured) never affects the other, and never affects the lead itself: by the time
// this runs the row is already in the database.
export async function notifyNewLead(lead: Lead): Promise<void> {
  const results = await Promise.allSettled([sendLeadEmail(lead), sendLeadWhatsApp(lead)]);
  results.forEach((result, i) => {
    if (result.status === "rejected") {
      console.error(`[notify] ${i === 0 ? "email" : "whatsapp"} failed for lead ${lead.id}:`, result.reason);
    }
  });
}

const channelLabel = { WHATSAPP: "WhatsApp", TELEFON: "Telefonatë" } as const;

function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);
}

// ---------------------------------------------------------------------------------------
// Email (Resend)
// Needs RESEND_API_KEY, EMAIL_TO and EMAIL_FROM on a domain verified in Resend.
// ---------------------------------------------------------------------------------------
export async function sendLeadEmail(lead: Lead): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.EMAIL_TO;
  const from = process.env.EMAIL_FROM;

  if (!apiKey || !to || !from) {
    console.warn("[notify:email] RESEND_API_KEY, EMAIL_TO or EMAIL_FROM not set, skipping lead email.");
    return;
  }
  if (from.includes("onboarding@resend.dev")) {
    console.warn(
      "[notify:email] EMAIL_FROM is still onboarding@resend.dev. Resend only delivers that to the account owner; set a sender on a verified domain before launch.",
    );
  }

  const service = leadServiceLabel(lead.service);
  const waUrl = `https://wa.me/${lead.phone.replace(/^\+/, "")}`;
  const telUrl = `tel:${lead.phone}`;

  const rows: [string, string][] = [
    ["Shërbimi", service],
    ["Emri", lead.name],
    ["Telefoni", lead.phone],
    ["Preferon", channelLabel[lead.channel]],
    ...(lead.area ? ([["Zona", lead.area]] as [string, string][]) : []),
    ...(lead.message ? ([["Mesazhi", lead.message]] as [string, string][]) : []),
    ["Faqja", lead.pagePath],
    ...(lead.utmSource ? ([["UTM source", lead.utmSource]] as [string, string][]) : []),
    ...(lead.utmCampaign ? ([["UTM campaign", lead.utmCampaign]] as [string, string][]) : []),
  ];

  const text = [
    `Kërkesë e re nga faqja`,
    "",
    ...rows.map(([k, v]) => `${k}: ${v}`),
    "",
    `Shkruaji në WhatsApp: ${waUrl}`,
    `Telefono: ${telUrl}`,
  ].join("\n");

  const html = `
    <div style="font-family:Arial,sans-serif;font-size:16px;line-height:1.5;color:#16241C">
      <p style="margin:0 0 16px">
        <a href="${waUrl}" style="display:inline-block;background:#157A3E;color:#fff;padding:12px 20px;border-radius:999px;text-decoration:none;font-weight:bold">Shkruaji në WhatsApp</a>
        &nbsp;
        <a href="${telUrl}" style="display:inline-block;background:#184A2C;color:#fff;padding:12px 20px;border-radius:999px;text-decoration:none;font-weight:bold">Telefono ${escapeHtml(lead.phone)}</a>
      </p>
      <table cellpadding="6" style="border-collapse:collapse">
        ${rows
          .map(
            ([k, v]) =>
              `<tr><td style="color:#5B6B60;vertical-align:top">${escapeHtml(k)}</td><td style="white-space:pre-wrap">${escapeHtml(v)}</td></tr>`,
          )
          .join("")}
      </table>
    </div>`;

  const resend = new Resend(apiKey);
  const { error } = await resend.emails.send({
    from,
    to,
    subject: `Kërkesë e re: ${service} (${lead.name})`,
    text,
    html,
  });
  if (error) throw new Error(`Resend: ${error.message}`);
}

// ---------------------------------------------------------------------------------------
// WhatsApp Cloud API: template message to the owner's own number.
//
// Runs only when all four variables are set, otherwise logs a skip:
//   WHATSAPP_TOKEN               permanent system-user token with whatsapp_business_messaging
//   WHATSAPP_PHONE_NUMBER_ID     the sending number's ID (WhatsApp Manager > API setup)
//   OWNER_WHATSAPP               where to send, digits only with country code, e.g. 355689007252
//   WHATSAPP_TEMPLATE_NEW_LEAD   name of an approved template whose body has exactly three
//                                variables, in this order: {{1}} service, {{2}} name, {{3}} phone
// Optional: WHATSAPP_TEMPLATE_LANG (default "sq").
//
// A template is required because the business is messaging a number outside a 24h customer
// window. This notifies the owner only; the customer receives nothing automatically.
// ---------------------------------------------------------------------------------------
const GRAPH_API_VERSION = "v23.0";

export async function sendLeadWhatsApp(lead: Lead): Promise<void> {
  const token = process.env.WHATSAPP_TOKEN;
  const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;
  const owner = process.env.OWNER_WHATSAPP;
  const template = process.env.WHATSAPP_TEMPLATE_NEW_LEAD;

  if (!token || !phoneNumberId || !owner || !template) {
    console.warn("[notify:whatsapp] WhatsApp Cloud API variables not set, skipping owner notification.");
    return;
  }

  const res = await fetch(`https://graph.facebook.com/${GRAPH_API_VERSION}/${phoneNumberId}/messages`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      messaging_product: "whatsapp",
      to: owner.replace(/\D/g, ""),
      type: "template",
      template: {
        name: template,
        language: { code: process.env.WHATSAPP_TEMPLATE_LANG || "sq" },
        components: [
          {
            type: "body",
            parameters: [leadServiceLabel(lead.service), lead.name, lead.phone].map((text) => ({
              type: "text",
              text,
            })),
          },
        ],
      },
    }),
    signal: AbortSignal.timeout(10_000),
  });

  if (!res.ok) {
    throw new Error(`WhatsApp Cloud API ${res.status}: ${await res.text()}`);
  }
}
