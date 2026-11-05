import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashToken, looksLikeToken } from "@/lib/booking/tokens";
import { serveMedia } from "@/lib/booking/serve-media";

// A customer can only open files attached to the request their own link points to.
export async function GET(_request: Request, { params }: { params: Promise<{ token: string; id: string }> }) {
  const { token, id } = await params;
  if (!looksLikeToken(token)) return new NextResponse("Not found", { status: 404 });
  const media = await prisma.requestMedia.findFirst({
    where: { id, status: "ready", request: { publicTokenHash: hashToken(token) } },
  });
  if (!media) return new NextResponse("Not found", { status: 404 });
  return serveMedia(media);
}
