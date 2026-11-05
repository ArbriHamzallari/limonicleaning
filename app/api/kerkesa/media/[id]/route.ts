import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { signatureMatches } from "@/lib/booking/media";
import { getStorage } from "@/lib/booking/storage";
import { hashToken, looksLikeToken, safeEqual } from "@/lib/booking/tokens";

type Ctx = { params: Promise<{ id: string }> };

/** The upload's owner is whoever holds its draft key (sent as a header, never in the URL). */
async function ownedDraft(request: Request, id: string) {
  const key = request.headers.get("x-draft-key");
  if (!looksLikeToken(key)) return null;
  const media = await prisma.requestMedia.findUnique({ where: { id } });
  if (!media || !safeEqual(media.draftKeyHash, hashToken(key))) return null;
  return media;
}

// Local driver only: receives the file body (development/tests). Production uses presigned S3.
export async function PUT(request: Request, { params }: Ctx) {
  const { id } = await params;
  const storage = getStorage();
  const media = await ownedDraft(request, id);
  if (!storage || !media || media.status !== "uploading") return NextResponse.json({ error: "not-found" }, { status: 404 });
  const s = await storage;
  if (s.driver !== "local" || !s.write) return NextResponse.json({ error: "not-found" }, { status: 404 });
  const declared = Number(request.headers.get("content-length"));
  if (declared && declared !== media.sizeBytes) return NextResponse.json({ error: "Madhësia nuk përputhet." }, { status: 400 });
  const data = Buffer.from(await request.arrayBuffer());
  if (data.length !== media.sizeBytes) return NextResponse.json({ error: "Madhësia nuk përputhet." }, { status: 400 });
  await s.write(media.storageKey, data);
  return NextResponse.json({ ok: true });
}

// Step 2: the server checks what actually arrived (size and real file signature).
export async function POST(request: Request, { params }: Ctx) {
  const { id } = await params;
  const storage = getStorage();
  const media = await ownedDraft(request, id);
  if (!storage || !media) return NextResponse.json({ error: "not-found" }, { status: 404 });
  if (media.status === "ready") return NextResponse.json({ ok: true });
  const s = await storage;
  const info = await s.info(media.storageKey);
  const head = info && info.size === media.sizeBytes ? await s.head(media.storageKey, 16).catch(() => null) : null;
  if (!head || !signatureMatches(media.contentType, head)) {
    await s.remove(media.storageKey).catch(() => {});
    await prisma.requestMedia.update({ where: { id }, data: { status: "rejected" } });
    return NextResponse.json({ error: "Skedari nuk u pranua: nuk është foto ose video e vlefshme, ose nuk u ngarkua plotësisht." }, { status: 422 });
  }
  await prisma.requestMedia.update({ where: { id }, data: { status: "ready", verifiedAt: new Date() } });
  return NextResponse.json({ ok: true });
}

// Remove before submitting. Attached media can only be removed by the owner.
export async function DELETE(request: Request, { params }: Ctx) {
  const { id } = await params;
  const media = await ownedDraft(request, id);
  if (!media || media.requestId) return NextResponse.json({ error: "not-found" }, { status: 404 });
  const storage = getStorage();
  if (storage) await (await storage).remove(media.storageKey).catch(() => {});
  await prisma.requestMedia.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
