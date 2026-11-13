import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { hashToken, looksLikeToken } from "@/lib/booking/tokens";
import { describeDate, snapshotOf, type ProposalSnapshot } from "@/lib/booking/requests";
import { PrintButton } from "@/components/booking/PrintButton";
import { CheckIcon, MinusIcon } from "@/components/icons";

export const metadata: Metadata = { title: "Fleta e punës", robots: { index: false, follow: false } };

// Private job sheet for the team doing this job (link shared by the owner, revocable).
// The agreed scope only: no photos or videos, no prices.
export default async function JobSheet({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  if (!looksLikeToken(token)) notFound();
  const r = await prisma.serviceRequest.findUnique({
    where: { jobSheetTokenHash: hashToken(token) },
    include: { proposals: { where: { status: "ACCEPTED" }, orderBy: { version: "desc" }, take: 1 } },
  });
  if (!r || !["CONFIRMED", "COMPLETED"].includes(r.status) || !r.proposals[0]) notFound();
  const snap = snapshotOf(r.proposals[0]) as ProposalSnapshot;

  return (
    <div className="mx-auto max-w-2xl px-4 py-8 print:py-0">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-base text-text-muted">Fleta e punës · Limoni Cleaning</p>
          <h1 className="mt-1 text-3xl font-extrabold tracking-tight">{snap.serviceLabel}</h1>
        </div>
        <PrintButton />
      </div>
      <dl className="mt-6 grid gap-2 text-lg">
        <div>
          <dt className="inline text-text-muted">Data: </dt>
          <dd className="inline font-semibold">{describeDate(snap.date)}</dd>
        </div>
        <div>
          <dt className="inline text-text-muted">Adresa: </dt>
          <dd className="inline font-semibold">{r.address ?? r.area ?? "Pyesni Arbrin"}</dd>
        </div>
        <div>
          <dt className="inline text-text-muted">Klienti: </dt>
          <dd className="inline font-semibold">
            {r.name.split(/\s+/)[0]} ·{" "}
            <a href={`tel:${r.phone}`} className="underline">
              {r.phone}
            </a>
          </dd>
        </div>
        {(r.plannedCrews || r.plannedMinutes) && (
          <div>
            <dt className="inline text-text-muted">Plani: </dt>
            <dd className="inline font-semibold">
              {r.plannedCrews ? `${r.plannedCrews} ekip` : ""}
              {r.plannedCrews && r.plannedMinutes ? ", " : ""}
              {r.plannedMinutes ? `${Math.round((r.plannedMinutes / 60) * 10) / 10} orë` : ""}
            </dd>
          </div>
        )}
      </dl>
      <h2 className="mt-8 text-2xl font-bold">Punët</h2>
      <ul className="mt-3 space-y-3 text-lg">
        {snap.checklist.included.map((i) => (
          <li key={i} className="flex gap-3">
            <span aria-hidden className="mt-1 h-5 w-5 shrink-0 rounded border-2 border-text print:block" />
            <span>{i}</span>
          </li>
        ))}
      </ul>
      {snap.checklist.priorities.length > 0 && (
        <>
          <h2 className="mt-8 text-2xl font-bold">Ka rëndësi për klientin</h2>
          <ul className="mt-3 space-y-2 text-lg">
            {snap.checklist.priorities.map((i) => (
              <li key={i} className="flex gap-3">
                <CheckIcon className="mt-1 h-5 w-5 shrink-0 text-primary" />
                {i}
              </li>
            ))}
          </ul>
        </>
      )}
      {snap.checklist.excluded.length > 0 && (
        <>
          <h2 className="mt-8 text-2xl font-bold">Nuk përfshihen</h2>
          <ul className="mt-3 space-y-2 text-lg">
            {snap.checklist.excluded.map((i) => (
              <li key={i} className="flex gap-3">
                <MinusIcon className="mt-1 h-5 w-5 shrink-0 text-text-muted" />
                {i}
              </li>
            ))}
          </ul>
        </>
      )}
      {snap.checklist.clarify.length > 0 && (
        <>
          <h2 className="mt-8 text-2xl font-bold">Kontrolloni me klientin</h2>
          <ul className="mt-3 list-disc space-y-2 pl-6 text-lg">
            {snap.checklist.clarify.map((i) => (
              <li key={i}>{i}</li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}
