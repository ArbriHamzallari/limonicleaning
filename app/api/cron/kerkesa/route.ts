import { NextResponse } from "next/server";
import { runMaintenance } from "@/lib/booking/maintenance";
import { safeEqual } from "@/lib/booking/tokens";

// Vercel Cron calls this with "Authorization: Bearer <CRON_SECRET>" when CRON_SECRET is set.
export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET;
  const auth = request.headers.get("authorization") ?? "";
  if (!secret || !safeEqual(auth, `Bearer ${secret}`)) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const summary = await runMaintenance();
  return NextResponse.json(summary, { headers: { "Cache-Control": "no-store" } });
}
