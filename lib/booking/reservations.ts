// Capacity reservations. Atomic at the database level: the exclusion constraint
// "slot_reservations_no_overlap" forbids overlapping active rows for the same crew, and
// INSERT … ON CONFLICT DO NOTHING lets us try crew after crew without aborting the
// transaction. Two simultaneous requests for the last free crew: exactly one gets it.
import { randomUUID } from "node:crypto";
import type { Prisma } from "@prisma/client";

export class SlotTakenError extends Error {
  constructor() {
    super("slot-taken");
  }
}

type Tx = Prisma.TransactionClient;

export async function reserveCrews(
  tx: Tx,
  r: { requestId: string; startsAt: Date; holdEndsAt: Date; jobEndsAt: Date; crewsNeeded: number; crews: number; status?: "held" | "confirmed" },
): Promise<number[]> {
  const got: number[] = [];
  for (let crew = 1; crew <= r.crews && got.length < r.crewsNeeded; crew++) {
    // Explicit UTC conversion: the columns are timestamp without time zone, stored as UTC.
    const rows = await tx.$queryRaw<{ id: string }[]>`
      INSERT INTO "slot_reservations" ("id", "requestId", "crew", "startsAt", "endsAt", "jobEndsAt", "status")
      VALUES (${randomUUID()}, ${r.requestId}, ${crew},
        (${r.startsAt.toISOString()}::timestamptz AT TIME ZONE 'UTC'),
        (${r.holdEndsAt.toISOString()}::timestamptz AT TIME ZONE 'UTC'),
        (${r.jobEndsAt.toISOString()}::timestamptz AT TIME ZONE 'UTC'),
        ${r.status ?? "held"})
      ON CONFLICT DO NOTHING
      RETURNING "id"`;
    if (rows.length) got.push(crew);
  }
  if (got.length < r.crewsNeeded) throw new SlotTakenError();
  return got;
}

export async function releaseReservations(tx: Tx, requestId: string): Promise<number> {
  const res = await tx.slotReservation.updateMany({
    where: { requestId, status: { not: "released" } },
    data: { status: "released", releasedAt: new Date() },
  });
  return res.count;
}

export async function confirmReservations(tx: Tx, requestId: string): Promise<number> {
  const res = await tx.slotReservation.updateMany({ where: { requestId, status: "held" }, data: { status: "confirmed" } });
  return res.count;
}
