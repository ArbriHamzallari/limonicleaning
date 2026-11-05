import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { currentAdmin } from "@/lib/admin/auth";
import { serveMedia } from "@/lib/booking/serve-media";

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await currentAdmin())) return new NextResponse("Unauthorized", { status: 401 });
  const { id } = await params;
  const media = await prisma.requestMedia.findUnique({ where: { id } });
  if (!media || !media.requestId || media.status !== "ready") return new NextResponse("Not found", { status: 404 });
  return serveMedia(media);
}
