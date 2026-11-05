import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin/auth";
import { services, type ServiceKey } from "@/lib/booking/catalog";
import { describeDate, latestProposal, snapshotOf, type ProposalSnapshot } from "@/lib/booking/requests";
import { getBookingSettings } from "@/lib/booking/settings";
import { formatDateSq, formatTimeSq } from "@/lib/booking/time";
import { logout } from "../hyr/actions";
import { statusLabel } from "@/lib/booking/labels";

export const metadata = { title: "Kërkesat" };


const filters = [
  { key: "hapur", label: "Të hapura", statuses: ["PENDING_REVIEW", "AWAITING_INFO", "AWAITING_CUSTOMER"] },
  { key: "konfirmuar", label: "Të konfirmuara", statuses: ["CONFIRMED"] },
  { key: "mbyllur", label: "Të mbyllura", statuses: ["DECLINED", "CANCELLED", "COMPLETED"] },
];

/** Dynamic page (reads the session): "now" is the request time. */
function hoursAgo(hours: number) {
  return new Date(Date.now() - hours * 3600000);
}

export default async function InboxPage({ searchParams }: { searchParams: Promise<{ f?: string }> }) {
  const user = await requireAdmin();
  const wanted = (await searchParams).f;
  const f = filters.find((x) => x.key === wanted) ?? filters[0];
  const s = getBookingSettings();
  const staleBefore = hoursAgo(s.staleHoldAlertHours);

  const rows = await prisma.serviceRequest.findMany({
    where: { status: { in: f.statuses as never } },
    orderBy: { createdAt: "desc" },
    take: 100,
    include: {
      proposals: true,
      events: { orderBy: { at: "desc" }, take: 1 },
      _count: { select: { media: { where: { status: "ready" } } } },
      reservations: { where: { status: { not: "released" } } },
    },
  });

  const attention = (r: (typeof rows)[number]) => {
    const why: string[] = [];
    if (["PENDING_REVIEW", "AWAITING_INFO", "AWAITING_CUSTOMER"].includes(r.status) && r.createdAt < staleBefore)
      why.push(r.reservations.length ? "Datë e mbajtur prej kohësh" : "E hapur prej kohësh");
    if (r.calendarSync === "FAILED") why.push("Kalendari nuk u përditësua");
    if (r.calendarSync === "DRIFT") why.push("Ndryshim me dorë në kalendar");
    if (r.events[0]?.actor === "klienti" && r.events[0].action === "customer_message") why.push("Klienti u përgjigj");
    return why;
  };
  const sorted = [...rows].sort((a, b) => attention(b).length - attention(a).length);

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-3xl font-extrabold tracking-tight">Kërkesat</h1>
        <form action={logout} className="flex items-center gap-3 text-base text-text-muted">
          {user}
          <button className="inline-flex min-h-12 items-center rounded-full border-2 border-border px-4 font-semibold">Dil</button>
        </form>
      </div>
      <nav className="mt-4 flex flex-wrap gap-2" aria-label="Filtri">
        {filters.map((x) => (
          <Link
            key={x.key}
            href={`/admin/kerkesa?f=${x.key}`}
            aria-current={x.key === f.key ? "page" : undefined}
            className="inline-flex min-h-12 items-center rounded-full border-2 border-border px-4 font-semibold aria-[current=page]:border-primary aria-[current=page]:bg-primary aria-[current=page]:text-white"
          >
            {x.label}
          </Link>
        ))}
      </nav>
      {sorted.length === 0 && <p className="mt-8 text-text-muted">Asnjë kërkesë këtu.</p>}
      <ul className="mt-6 grid gap-3">
        {sorted.map((r) => {
          const snap = snapshotOf(latestProposal(r)) as ProposalSnapshot;
          const why = attention(r);
          return (
            <li key={r.id}>
              <Link href={`/admin/kerkesa/${r.id}`} className={`block rounded-lg border-2 p-4 hover:border-primary ${why.length ? "border-accent" : "border-border"}`}>
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <strong className="text-lg">{services[r.service as ServiceKey]?.label ?? r.service}</strong>
                  <span className="rounded-full bg-bg-muted px-3 py-1 text-sm font-semibold">{statusLabel[r.status]}</span>
                </div>
                <p className="mt-1">
                  {r.name} · {r.area ?? "pa zonë"} · {r._count.media} foto/video
                </p>
                <p className="mt-1 text-base text-text-muted">
                  {describeDate(snap.date)}
                  {r.reservations.length > 0 && r.status !== "CONFIRMED" ? " · e mbajtur" : ""}
                </p>
                <p className="mt-1 text-sm text-text-muted">
                  Dërguar {formatDateSq(r.createdAt)}, {formatTimeSq(r.createdAt)}
                </p>
                {why.length > 0 && <p className="mt-2 font-semibold text-red-800">{why.join(" · ")}</p>}
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
