import { NextResponse } from "next/server";
import { randomUUID } from "node:crypto";
import { prisma } from "@/lib/prisma";
import { allowRequest, clientIp } from "@/lib/rate-limit";
import { checkFile, MAX_FILES, UPLOADS_OFF } from "@/lib/booking/media";
import { getStorage } from "@/lib/booking/storage";
import { hashToken, looksLikeToken, newToken } from "@/lib/booking/tokens";

// Step 1 of an upload: check the declared file, reserve a private storage key and return
// where to PUT it. Nothing is public; the key is random and only reachable through
// authorised routes.
export async function POST(request: Request) {
  if (!allowRequest(`media:${clientIp(request)}`, Date.now(), 40)) {
    return NextResponse.json({ error: "Shumë ngarkime radhazi. Provoni pas pak minutash." }, { status: 429 });
  }
  const storage = getStorage();
  if (!storage) return NextResponse.json({ error: UPLOADS_OFF, code: "uploads-off" }, { status: 503 });

  const body = (await request.json().catch(() => ({}))) as { draftKey?: unknown; name?: unknown; type?: unknown; size?: unknown };
  const name = typeof body.name === "string" ? body.name.slice(0, 120) : "skedar";
  const check = checkFile(name, typeof body.type === "string" ? body.type : "", Number(body.size));
  if (!check.ok) return NextResponse.json({ error: check.error }, { status: 400 });

  const draftKey = looksLikeToken(body.draftKey) ? body.draftKey : newToken();
  const draftKeyHash = hashToken(draftKey);
  const count = await prisma.requestMedia.count({ where: { draftKeyHash, status: { not: "rejected" } } });
  if (count >= MAX_FILES) return NextResponse.json({ error: `Mund të dërgoni deri në ${MAX_FILES} skedarë.` }, { status: 400 });

  const ext = check.type.split("/")[1].replace("quicktime", "mov").replace("jpeg", "jpg");
  const storageKey = `kerkesa/${new Date().toISOString().slice(0, 7)}/${randomUUID()}.${ext}`;
  const media = await prisma.requestMedia.create({
    data: { draftKeyHash, storageKey, originalName: name, contentType: check.type, sizeBytes: Number(body.size), kind: check.kind },
  });
  const target = await (await storage).uploadTarget(storageKey, check.type, media.sizeBytes, `/api/kerkesa/media/${media.id}`);
  return NextResponse.json({ id: media.id, draftKey, upload: { method: "PUT", ...target } }, { headers: { "Cache-Control": "no-store" } });
}
