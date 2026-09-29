import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { bookingSchema } from "@/lib/validation";
import { generateBookingReference } from "@/lib/reference";
import { sendBookingNotification } from "@/lib/email";

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Trupi i kërkesës nuk është JSON i vlefshëm." }, { status: 400 });
  }

  const parsed = bookingSchema.safeParse(body);
  if (!parsed.success) {
    const message = parsed.error.issues[0]?.message ?? "Të dhëna të pavlefshme.";
    return NextResponse.json({ error: message }, { status: 400 });
  }

  const input = parsed.data;

  try {
    const booking = await prisma.booking.create({
      data: {
        reference: generateBookingReference(),
        propertyType: input.propertyType,
        typology: input.typology,
        cleaningType: input.cleaningType,
        date: new Date(input.date),
        time: input.time,
        extras: input.extras,
        estimatedPriceAll: input.estimatedPriceAll,
        name: input.name,
        phone: input.phone,
        email: input.email || null,
        address: input.address || null,
        notes: input.notes || null,
      },
    });

    try {
      await sendBookingNotification(booking);
    } catch (emailError) {
      console.error("[api/booking] Failed to send notification email:", emailError);
      // The booking is already persisted — don't fail the request over email delivery.
    }

    // TODO: notifyWhatsApp(booking) — Meta WhatsApp Business API integration, not yet configured.
    // See lib/email.ts for the stub. Do not enable until it's actually implemented.

    return NextResponse.json({ reference: booking.reference }, { status: 201 });
  } catch (dbError) {
    console.error("[api/booking] Failed to persist booking:", dbError);
    return NextResponse.json(
      { error: "Nuk arritëm të ruajmë rezervimin. Provo përsëri ose na shkruaj në WhatsApp." },
      { status: 500 },
    );
  }
}
