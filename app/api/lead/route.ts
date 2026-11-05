import { NextResponse, after } from "next/server";
import { prisma } from "@/lib/prisma";
import { leadSchema } from "@/lib/validation";
import { allowRequest, clientIp } from "@/lib/rate-limit";
import { notifyNewLead } from "@/lib/notify";
import { deepCleanEstimate } from "@/lib/quote";
import { Prisma } from "@prisma/client";

const MIN_FILL_MS = 3000;

/** Error class and Prisma code only, no message text (it can contain the submitted values). */
function safeErrorLabel(error: unknown): string {
  if (error instanceof Prisma.PrismaClientKnownRequestError) return `PrismaClientKnownRequestError ${error.code}`;
  return error instanceof Error ? error.name : "unknown error";
}
const FAILED = "Kërkesa nuk u dërgua. Provoni përsëri ose na shkruani në WhatsApp.";

export async function POST(request: Request) {
  if (!allowRequest(clientIp(request))) {
    return NextResponse.json(
      { error: "Keni dërguar disa kërkesa radhazi. Provoni përsëri pas disa minutash ose na shkruani në WhatsApp." },
      { status: 429 },
    );
  }

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: FAILED }, { status: 400 });
  }

  // Honeypot: a field people never see. Bots that fill it get a normal-looking success and
  // nothing is saved.
  if (typeof body.website === "string" && body.website.trim() !== "") {
    return NextResponse.json({ ok: true });
  }

  const parsed = leadSchema.safeParse(body);
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const key = String(issue.path[0] ?? "form");
      fieldErrors[key] ??= issue.message;
    }
    return NextResponse.json({ error: "Kontrolloni fushat e shënuara.", fieldErrors }, { status: 400 });
  }
  const input = parsed.data;

  // Humans don't fill a form in under three seconds. Not silent: an autofilled real visitor
  // just presses the button again.
  if (Date.now() - input.startedAt < MIN_FILL_MS) {
    return NextResponse.json({ error: "Prisni disa sekonda dhe provoni përsëri." }, { status: 400 });
  }

  // A double tap or a retry after a lost response carries the same clientRequestId: answer
  // with the first row's success instead of saving (and notifying) twice.
  if (input.clientRequestId) {
    const existing = await prisma.lead
      .findUnique({ where: { clientRequestId: input.clientRequestId }, select: { id: true } })
      .catch(() => null);
    if (existing) return NextResponse.json({ ok: true, duplicate: true });
  }

  // The indicative amount is recomputed here from the stored inputs, never taken from the client.
  const estimate = deepCleanEstimate({
    service: input.service,
    sizeM2: input.sizeM2,
    sizeUnknown: input.sizeUnknown,
    condition: input.condition,
    propertyType: input.propertyType,
  });

  let lead;
  try {
    lead = await prisma.lead.create({
      data: {
        service: input.service,
        name: input.name,
        phone: input.phone,
        channel: input.channel,
        area: input.area,
        message: input.message,
        pagePath: input.pagePath,
        propertyType: input.propertyType,
        sizeM2: input.sizeUnknown ? undefined : input.sizeM2,
        sizeUnknown: input.sizeUnknown,
        frequency: input.frequency,
        timing: input.timing,
        preferredDate: input.timing === "date" ? input.preferredDate : undefined,
        condition: input.condition,
        assessmentMethod: input.assessmentMethod,
        priorities: input.priorities,
        estimateLek: estimate.kind === "indicative" ? estimate.totalLek : undefined,
        clientRequestId: input.clientRequestId,
        businessName: input.businessName,
        utmSource: input.utmSource,
        utmCampaign: input.utmCampaign,
      },
    });
  } catch (dbError) {
    // Two identical requests racing each other: the second hits the unique index.
    if (dbError instanceof Prisma.PrismaClientKnownRequestError && dbError.code === "P2002") {
      return NextResponse.json({ ok: true, duplicate: true });
    }
    // Never log the error object itself: Prisma messages can echo the submitted name and phone.
    console.error("[api/lead] Failed to save lead:", safeErrorLabel(dbError));
    return NextResponse.json({ error: FAILED }, { status: 500 });
  }

  // The row is saved; notifications run after the response so the visitor isn't kept waiting.
  after(() => notifyNewLead(lead));

  return NextResponse.json({ ok: true });
}
