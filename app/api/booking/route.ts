import { NextResponse } from "next/server";

// Retired in prompt 03: every form now posts to /api/lead. Kept briefly so any cached page
// gets a clear answer instead of a 404. Safe to delete once no traffic reaches it.
export function POST() {
  return NextResponse.json(
    { error: "Ky formular nuk përdoret më. Na lini numrin te /kerko-oferte ose na shkruani në WhatsApp." },
    { status: 410 },
  );
}
