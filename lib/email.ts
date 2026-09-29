import { Resend } from "resend";
import type { Booking } from "@prisma/client";

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

const FROM = process.env.EMAIL_FROM ?? "Limoni Cleaning <onboarding@resend.dev>";
const TO = process.env.EMAIL_TO;

export async function sendBookingNotification(booking: Booking) {
  if (!resend || !TO) {
    console.warn(
      "[email] RESEND_API_KEY or EMAIL_TO not set — skipping booking notification email.",
    );
    return;
  }

  await resend.emails.send({
    from: FROM,
    to: TO,
    subject: `Rezervim i ri — ${booking.reference}`,
    text: [
      `Rezervim i ri (${booking.reference})`,
      "",
      `Emri: ${booking.name}`,
      `Telefon: ${booking.phone}`,
      booking.email ? `Email: ${booking.email}` : null,
      `Lloji i pronës: ${booking.propertyType}`,
      `Tipologjia: ${booking.typology}`,
      `Lloji i pastrimit: ${booking.cleaningType}`,
      `Data: ${booking.date.toISOString().slice(0, 10)}`,
      `Ora: ${booking.time}`,
      booking.extras.length ? `Shërbime shtesë: ${booking.extras.join(", ")}` : null,
      booking.address ? `Adresa: ${booking.address}` : null,
      booking.notes ? `Shënime: ${booking.notes}` : null,
      booking.estimatedPriceAll ? `Çmimi paraprak: ${booking.estimatedPriceAll} Lekë` : null,
    ]
      .filter(Boolean)
      .join("\n"),
  });
}

export async function sendContactNotification(contact: {
  name: string;
  phone: string | null;
  email: string | null;
  subject: string | null;
  message: string;
}) {
  if (!resend || !TO) {
    console.warn(
      "[email] RESEND_API_KEY or EMAIL_TO not set — skipping contact notification email.",
    );
    return;
  }

  await resend.emails.send({
    from: FROM,
    to: TO,
    subject: `Mesazh i ri nga faqja — ${contact.subject ?? contact.name}`,
    text: [
      `Emri: ${contact.name}`,
      contact.phone ? `Telefon: ${contact.phone}` : null,
      contact.email ? `Email: ${contact.email}` : null,
      "",
      contact.message,
    ]
      .filter(Boolean)
      .join("\n"),
  });
}

// TODO: notifyWhatsApp(booking) — Meta WhatsApp Business API integration, not yet configured.
// Arbri (Codrix) plans to wire this himself. Until then, the business follows up on WhatsApp
// manually using the phone number submitted with each booking. Do not call this from the
// booking route until it has a real implementation behind it.
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function notifyWhatsApp(_booking: Booking): Promise<void> {
  return;
}
