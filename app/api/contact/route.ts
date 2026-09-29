import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { contactSchema } from "@/lib/validation";
import { sendContactNotification } from "@/lib/email";

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Trupi i kërkesës nuk është JSON i vlefshëm." }, { status: 400 });
  }

  const parsed = contactSchema.safeParse(body);
  if (!parsed.success) {
    const message = parsed.error.issues[0]?.message ?? "Të dhëna të pavlefshme.";
    return NextResponse.json({ error: message }, { status: 400 });
  }

  const input = parsed.data;

  try {
    const contact = await prisma.contactMessage.create({
      data: {
        name: input.name,
        phone: input.phone || null,
        email: input.email || null,
        subject: input.subject || null,
        message: input.message,
      },
    });

    try {
      await sendContactNotification(contact);
    } catch (emailError) {
      console.error("[api/contact] Failed to send notification email:", emailError);
    }

    return NextResponse.json({ ok: true }, { status: 201 });
  } catch (dbError) {
    console.error("[api/contact] Failed to persist contact message:", dbError);
    return NextResponse.json(
      { error: "Nuk arritëm të dërgojmë mesazhin. Provo përsëri ose na shkruaj në WhatsApp." },
      { status: 500 },
    );
  }
}
