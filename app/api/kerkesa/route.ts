import { NextResponse, after } from "next/server";
import { z } from "zod";
import { allowRequest, clientIp } from "@/lib/rate-limit";
import { normalizePhone } from "@/lib/phone";
import { cleanPriorities, isServiceKey, validateAnswers } from "@/lib/booking/catalog";
import { submitRequest } from "@/lib/booking/requests";
import { notifyOwnerNewRequest } from "@/lib/booking/notify-owner";
import { addDays, isValidYmd, tzDate } from "@/lib/booking/time";
import { looksLikeToken } from "@/lib/booking/tokens";

const MIN_FILL_MS = 3000;
const FAILED = "Kërkesa nuk u dërgua. Provoni përsëri ose na shkruani në WhatsApp.";
const zones = { tirane: "Tiranë", kamez: "Kamëz", durres: "Durrës", tjeter: "Tjetër" } as const;
const tag = z
  .string()
  .optional()
  .transform((v) => (v && v.length <= 60 && /^[A-Za-z0-9._-]+$/.test(v) && !/^\+?\d{6,}$/.test(v) ? v : undefined));

const schema = z.object({
  service: z.string().refine(isServiceKey, "Zgjidhni shërbimin."),
  answers: z.record(z.string(), z.unknown()).default({}),
  priorities: z.unknown().optional(),
  note: z.string().trim().max(1500).optional(),
  name: z.string("Shkruani emrin.").trim().min(2, "Shkruani emrin me të paktën dy shkronja.").max(80),
  phone: z.string("Shkruani numrin.").transform((v, ctx) => {
    const n = normalizePhone(v);
    if (!n) ctx.addIssue({ code: "custom", message: "Numri nuk duket i saktë. Kontrolloni numrin dhe provoni përsëri." });
    return n ?? "";
  }),
  channel: z.enum(["WHATSAPP", "TELEFON"]).catch("WHATSAPP"),
  zone: z.enum(["tirane", "kamez", "durres", "tjeter"], "Zgjidhni zonën."),
  areaDetail: z.string().trim().max(120).optional(),
  mediaIds: z.array(z.string().max(40)).max(8).default([]),
  draftKey: z.string().optional(),
  slot: z.object({ date: z.string(), time: z.string().regex(/^\d{2}:\d{2}$/) }).optional(),
  preferredDate: z.string().optional(),
  clientRequestId: z.string().regex(/^[A-Za-z0-9-]{8,64}$/).optional().catch(undefined),
  pagePath: z.string().max(200).startsWith("/").catch("/kerko-oferte"),
  utmSource: tag,
  utmCampaign: tag,
  startedAt: z.number().int().positive(),
});

export async function POST(request: Request) {
  if (!allowRequest(`kerkesa:${clientIp(request)}`)) {
    return NextResponse.json({ error: "Keni dërguar disa kërkesa radhazi. Provoni përsëri pas disa minutash ose na shkruani në WhatsApp." }, { status: 429 });
  }
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: FAILED }, { status: 400 });
  }
  if (typeof body.website === "string" && body.website.trim()) return NextResponse.json({ ok: true, statusUrl: null });

  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const i of parsed.error.issues) fieldErrors[String(i.path[0] ?? "form")] ??= i.message;
    return NextResponse.json({ error: "Kontrolloni fushat e shënuara.", fieldErrors }, { status: 400 });
  }
  const input = parsed.data;
  if (Date.now() - input.startedAt < MIN_FILL_MS) return NextResponse.json({ error: "Prisni disa sekonda dhe provoni përsëri." }, { status: 400 });

  const service = input.service as Parameters<typeof validateAnswers>[0];
  const { answers, errors } = validateAnswers(service, input.answers);
  if (Object.keys(errors).length) return NextResponse.json({ error: "Plotësoni pyetjet e shënuara.", answerErrors: errors }, { status: 400 });

  const today = tzDate(new Date());
  const preferredDate =
    input.preferredDate && isValidYmd(input.preferredDate) && input.preferredDate > today && input.preferredDate <= addDays(today, 180)
      ? input.preferredDate
      : undefined;
  const slot = input.slot && isValidYmd(input.slot.date) ? input.slot : undefined;
  if (input.mediaIds.length && !looksLikeToken(input.draftKey)) return NextResponse.json({ error: FAILED }, { status: 400 });

  const result = await submitRequest({
    service,
    answers,
    priorities: cleanPriorities(input.priorities),
    note: input.note || undefined,
    name: input.name,
    phone: input.phone,
    channel: input.channel,
    area: [zones[input.zone], input.areaDetail].filter(Boolean).join(", "),
    outsideTirana: input.zone !== "tirane",
    draftKey: looksLikeToken(input.draftKey) ? input.draftKey : undefined,
    mediaIds: input.mediaIds,
    slot,
    preferredDate,
    clientRequestId: input.clientRequestId,
    pagePath: input.pagePath,
    utmSource: input.utmSource,
    utmCampaign: input.utmCampaign,
  });

  if (!result.ok) {
    const status = result.code === "slot-taken" || result.code === "slot-invalid" ? 409 : result.code === "media" ? 422 : 500;
    return NextResponse.json({ error: result.message, code: result.code }, { status });
  }
  if (!result.duplicate) after(() => notifyOwnerNewRequest(result.requestId));
  return NextResponse.json({ ok: true, statusUrl: `/kerkesa/${result.token}`, held: result.held });
}
