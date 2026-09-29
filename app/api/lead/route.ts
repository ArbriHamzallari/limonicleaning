import { NextResponse, after } from "next/server";
import { prisma } from "@/lib/prisma";
import { leadSchema, composeLeadMessage } from "@/lib/validation";
import { allowRequest, clientIp } from "@/lib/rate-limit";
import { notifyNewLead } from "@/lib/notify";

const MIN_FILL_MS = 3000;
const FAILED = "Kërkesa nuk u dërgua. Provoni përsëri ose na shkruani në WhatsApp.";

export async function POST(request: Request) {
  if (!allowRequest(clientIp(request))) {
    return NextResponse.json(
      { error: "Keni dërguar disa kërkesa radhazi. Provoni përsëri pas pak minutash ose na shkruani në WhatsApp." },
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

  let lead;
  try {
    lead = await prisma.lead.create({
      data: {
        service: input.service,
        name: input.name,
        phone: input.phone,
        channel: input.channel,
        area: input.area,
        message: composeLeadMessage(input),
        pagePath: input.pagePath,
        utmSource: input.utmSource,
        utmCampaign: input.utmCampaign,
      },
    });
  } catch (dbError) {
    console.error("[api/lead] Failed to save lead:", dbError);
    return NextResponse.json({ error: FAILED }, { status: 500 });
  }

  // The row is saved; notifications run after the response so the visitor isn't kept waiting.
  after(() => notifyNewLead(lead));

  return NextResponse.json({ ok: true });
}
