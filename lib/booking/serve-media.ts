// Serves one private file to an already-authorised caller (owner session or the request's own
// customer link). S3: a 5-minute presigned redirect. Local: streamed. Never cached.
import { NextResponse } from "next/server";
import type { RequestMedia } from "@prisma/client";
import { getStorage } from "./storage";

const PRIVATE_HEADERS = {
  "Cache-Control": "private, no-store",
  "X-Content-Type-Options": "nosniff",
  "Referrer-Policy": "no-referrer",
  "X-Robots-Tag": "noindex, nofollow",
};

export async function serveMedia(media: RequestMedia): Promise<Response> {
  const storage = getStorage();
  if (!storage) return new NextResponse("Not found", { status: 404 });
  const s = await storage;
  const url = await s.viewUrl(media.storageKey, media.contentType);
  if (url) return NextResponse.redirect(url, { status: 302, headers: PRIVATE_HEADERS });
  if (!s.read) return new NextResponse("Not found", { status: 404 });
  const data = await s.read(media.storageKey).catch(() => null);
  if (!data) return new NextResponse("Not found", { status: 404 });
  return new NextResponse(new Uint8Array(data), {
    headers: { ...PRIVATE_HEADERS, "Content-Type": media.contentType, "Content-Disposition": "inline", "Content-Length": String(data.length) },
  });
}
