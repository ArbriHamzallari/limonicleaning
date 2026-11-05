import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin/auth";
import { ProposalView } from "@/components/booking/ProposalView";
import { CopyLink } from "@/components/booking/CopyLink";
import { customerLink, describeDate, latestProposal, recheckConflicts, snapshotOf, type ProposalSnapshot } from "@/lib/booking/requests";
import { decryptToken } from "@/lib/booking/tokens";
import { formatDateSq, formatTimeSq, tzDate } from "@/lib/booking/time";
import { actionLabel, statusLabel, syncLabel } from "@/lib/booking/labels";
import { siteUrl } from "@/lib/seo";
import { formatBytes } from "@/lib/booking/media";
import {
  addressAction,
  approveAction,
  closeAction,
  feasibilityAction,
  infoAction,
  planningAction,
  reviseAction,
  rotateJobSheetAction,
  rotateLinkAction,
  syncAction,
} from "./actions";

export const metadata = { title: "Kërkesa" };

const card = "mt-6 rounded-lg border border-border p-5";
const h2 = "text-xl font-bold";
const field = "mt-1 block min-h-12 w-full rounded-lg border-2 border-border bg-bg px-3 py-2 text-base";
const primary = "inline-flex min-h-12 items-center justify-center rounded-full bg-primary px-6 font-semibold text-white";
const ghost = "inline-flex min-h-12 items-center justify-center rounded-full border-2 border-primary/30 px-5 font-semibold text-primary";
const danger = "inline-flex min-h-12 items-center justify-center rounded-full border-2 border-red-700/40 px-5 font-semibold text-red-800";

function Hidden({ id }: { id: string }) {
  return <input type="hidden" name="id" value={id} />;
}

export default async function RequestDetail({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<{ ok?: string; gabim?: string }> }) {
  await requireAdmin();
  const { id } = await params;
  const q = await searchParams;
  const r = await prisma.serviceRequest.findUnique({
    where: { id },
    include: {
      proposals: { orderBy: { version: "asc" } },
      media: { where: { status: "ready" }, orderBy: { createdAt: "asc" } },
      events: { orderBy: { at: "asc" } },
      reservations: { where: { status: { not: "released" } } },
    },
  });
  if (!r) notFound();

  const current = latestProposal(r);
  const snap = snapshotOf(current) as ProposalSnapshot;
  const open = ["PENDING_REVIEW", "AWAITING_INFO", "AWAITING_CUSTOMER"].includes(r.status);
  const link = customerLink(r, siteUrl);
  const jobSheet = r.jobSheetTokenEnc ? decryptToken(r.jobSheetTokenEnc) : null;
  const conflicts = open && snap.date.startsAt ? await recheckConflicts(r.id, snap.date) : null;
  const firstName = r.name.split(/\s+/)[0];
  const lastInfo = [...r.events].reverse().find((e) => e.action === "asked_for_info");
  const waText =
    r.status === "AWAITING_INFO"
      ? `Përshëndetje ${firstName}, ju shkruan Arbri nga Limoni Cleaning. Për kërkesën tuaj na duhen disa të dhëna: ${String((lastInfo?.detail as { message?: string } | null)?.message ?? "")}\nMund të përgjigjeni këtu: ${link}`
      : r.status === "AWAITING_CUSTOMER"
        ? `Përshëndetje ${firstName}, ju shkruan Arbri nga Limoni Cleaning. Ju përgatita ofertën e rishikuar. Mund ta shihni dhe ta pranoni këtu: ${link}`
        : r.status === "CONFIRMED"
          ? `Përshëndetje ${firstName}, pastrimi juaj u konfirmua: ${describeDate(snap.date)}. Detajet: ${link}`
          : `Përshëndetje ${firstName}, ju shkruan Arbri nga Limoni Cleaning për kërkesën tuaj. Mund ta shihni këtu: ${link}`;
  const minDate = tzDate(new Date());

  return (
    <div>
      <Link href="/admin/kerkesa" className="inline-flex min-h-12 items-center font-semibold text-primary underline underline-offset-4">
        Të gjitha kërkesat
      </Link>
      {q.ok && (
        <p role="status" className="mt-4 rounded-lg bg-bg-warm p-4 font-semibold">
          U ruajt.
        </p>
      )}
      {q.gabim && (
        <p role="alert" className="mt-4 rounded-lg border-2 border-red-700/30 bg-red-50 p-4 font-medium text-red-800">
          {q.gabim}
        </p>
      )}

      <div className="mt-4 flex flex-wrap items-baseline justify-between gap-2">
        <h1 className="text-3xl font-extrabold tracking-tight">{snap.serviceLabel}</h1>
        <span className="rounded-full bg-bg-muted px-3 py-1 font-semibold">{statusLabel[r.status]}</span>
      </div>
      <p className="mt-1 text-text-muted">
        Dërguar {formatDateSq(r.createdAt)}, {formatTimeSq(r.createdAt)} · versioni i katalogut {r.catalogVersion}
      </p>

      <section className={card}>
        <h2 className={h2}>Klienti</h2>
        <p className="mt-2 text-lg">
          {r.name} · <a href={`tel:${r.phone}`} className="font-semibold text-primary underline">{r.phone}</a> · preferon {r.channel === "TELEFON" ? "telefonatë" : "WhatsApp"}
        </p>
        <p className="mt-1">Zona: {r.area ?? "-"}{r.outsideTirana ? " (jashtë Tiranës)" : ""}</p>
        {r.note && <p className="mt-2 whitespace-pre-line rounded-lg bg-bg-muted p-3">{r.note}</p>}
        <div className="mt-4 flex flex-wrap gap-3">
          <a className={primary} href={`https://wa.me/${r.phone.replace(/\D/g, "")}?text=${encodeURIComponent(waText)}`} target="_blank" rel="noopener noreferrer">
            Shkruaji në WhatsApp me lidhjen
          </a>
        </div>
        <p className="mt-2 text-sm text-text-muted">Mesazhi hapet në WhatsApp-in tuaj; e dërgoni ju. Faqja nuk i dërgon asgjë klientit vetë.</p>
        <p className="mt-2 text-sm text-text-muted">
          Njoftimi juaj: {r.notifyStatus ?? "pa të dhëna"}
        </p>
      </section>

      <section className={card}>
        <h2 className={h2}>Data dhe kalendari</h2>
        <p className="mt-2 text-lg font-semibold">{describeDate(snap.date)}</p>
        <p className="mt-1">
          {r.reservations.length
            ? `Kapaciteti i rezervuar: ${r.reservations.map((x) => (x.crew == null ? "pa ekip të caktuar" : `ekipi ${x.crew}`)).join(", ")} (${r.reservations[0].status === "confirmed" ? "konfirmuar" : "mbajtje"})`
            : "Asnjë rezervim kapaciteti."}
        </p>
        {r.dateNote && <p className="mt-1 text-text-muted">{r.dateNote}</p>}
        <p className="mt-2">
          Google Calendar: <strong>{syncLabel[r.calendarSync]}</strong>
          {r.calendarSyncError ? ` · ${r.calendarSyncError}` : ""}
        </p>
        {(r.calendarSync === "FAILED" || r.calendarSync === "DRIFT" || r.calendarSync === "PENDING") && (
          <form action={syncAction} className="mt-3">
            <Hidden id={r.id} />
            <button className={ghost}>{r.calendarSync === "DRIFT" ? "Ktheje bllokun në orën e dakordësuar" : "Provo sërish kalendarin"}</button>
          </form>
        )}
        {conflicts && (
          <p className={`mt-3 rounded-lg p-3 ${conflicts.conflict ? "bg-red-50 font-semibold text-red-800" : "bg-bg-muted"}`}>
            {conflicts.conflict ? conflicts.message : conflicts.checked ? "Kontrolli i konflikteve: asnjë konflikt tani." : conflicts.message}
          </p>
        )}
      </section>

      <section className={card}>
        <h2 className={h2}>
          Oferta aktuale (versioni {current.version}, {current.kind === "submitted" ? "nga klienti" : current.kind === "approved" ? "e miratuar" : `rishikuar nga ${current.createdBy}`},{" "}
          {current.status === "PROPOSED" ? "në pritje" : current.status === "ACCEPTED" ? "pranuar" : current.status.toLowerCase()})
        </h2>
        <div className="mt-4">
          <ProposalView snap={snap} stage={r.status === "CONFIRMED" ? "agreed" : current.kind === "revised" ? "proposed" : "pending"} />
        </div>
      </section>

      {r.media.length > 0 && (
        <section className={card}>
          <h2 className={h2}>Foto dhe video ({r.media.length})</h2>
          <ul className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {r.media.map((m) => (
              <li key={m.id}>
                <a href={`/admin/media/${m.id}`} target="_blank" rel="noopener noreferrer" className="block rounded-lg border border-border p-2 text-sm">
                  {m.kind === "photo" ? (
                    // eslint-disable-next-line @next/next/no-img-element -- private file behind the admin session
                    <img src={`/admin/media/${m.id}`} alt={m.originalName} loading="lazy" className="aspect-square w-full rounded object-cover" />
                  ) : (
                    <span className="flex aspect-square items-center justify-center rounded bg-bg-muted">Video</span>
                  )}
                  <span className="mt-1 block truncate">{m.originalName}</span>
                  <span className="block text-text-muted">{formatBytes(m.sizeBytes)}</span>
                </a>
              </li>
            ))}
          </ul>
        </section>
      )}

      {open && (
        <>
          <section className={card}>
            <h2 className={h2}>1. Vendndodhja dhe mundësia</h2>
            <form action={feasibilityAction} className="mt-3 grid gap-3">
              <Hidden id={r.id} />
              <label className="flex min-h-12 items-center gap-3">
                <input type="checkbox" name="ok" value="po" defaultChecked={r.feasibilityOk} className="h-5 w-5" />
                E kam kontrolluar: zona dhe shërbimi janë të mundshëm
              </label>
              <input name="note" placeholder="Shënim (opsional)" className={field} />
              <button className={ghost}>Ruaj</button>
            </form>
          </section>

          <section className={card}>
            <h2 className={h2}>2. Planifikimi (vetëm për ju)</h2>
            <form action={planningAction} className="mt-3 grid gap-3 sm:grid-cols-3 sm:items-end">
              <Hidden id={r.id} />
              <label>
                Ekipe
                <input name="crews" type="number" min={1} max={10} defaultValue={r.plannedCrews ?? ""} className={field} />
              </label>
              <label>
                Kohëzgjatja (minuta)
                <input name="minutes" type="number" min={30} step={15} defaultValue={r.plannedMinutes ?? ""} className={field} />
              </label>
              <button className={ghost}>Ruaj</button>
            </form>
          </section>

          {current.kind === "submitted" && current.status === "PROPOSED" && r.status !== "AWAITING_CUSTOMER" && (
            <section className={card}>
              <h2 className={h2}>3a. Mirato kërkesën siç është</h2>
              <p className="mt-1 text-text-muted">
                Pa ndryshim çmimi, punësh apo date. Çmimi orientues bëhet totali i dakordësuar. Për çdo ndryshim, përdorni “Dërgo ofertë të rishikuar”.
              </p>
              <form action={approveAction} className="mt-3 grid gap-3">
                <Hidden id={r.id} />
                {snap.date.mode === "preferred" && (
                  <label>
                    Ora në datën e preferuar ({snap.date.preferredDate}); vendosni më parë kohëzgjatjen
                    <input name="time" type="time" className={`${field} max-w-48`} />
                  </label>
                )}
                {conflicts?.conflict && (
                  <label className="flex min-h-12 items-center gap-3 font-semibold text-red-800">
                    <input type="checkbox" name="override" value="po" className="h-5 w-5" /> Mirato gjithsesi (e kam kontrolluar konfliktin)
                  </label>
                )}
                <button className={primary} disabled={!r.feasibilityOk}>
                  Mirato dhe konfirmo
                </button>
                {!r.feasibilityOk && <p className="text-sm text-text-muted">Konfirmoni më parë vendndodhjen dhe mundësinë (hapi 1).</p>}
              </form>
            </section>
          )}

          <section className={card}>
            <h2 className={h2}>3b. Dërgo ofertë të rishikuar</h2>
            <p className="mt-1 text-text-muted">Çmimi, punët ose data ndryshojnë: klienti duhet ta pranojë para konfirmimit. Versionet e mëparshme ruhen.</p>
            <form action={reviseAction} className="mt-3 grid gap-4">
              <Hidden id={r.id} />
              <div className="grid gap-3 sm:grid-cols-2">
                <label>
                  Totali i propozuar (lekë të reja, bosh = pas vlerësimit)
                  <input name="price" type="number" min={1} defaultValue={snap.price.kind === "after-assessment" ? "" : snap.price.amountLek} className={field} />
                </label>
                <label>
                  Shënim për çmimin
                  <input name="priceNote" maxLength={200} className={field} />
                </label>
              </div>
              <label>
                Punët (një për rresht)
                <textarea name="included" rows={6} defaultValue={snap.checklist.included.join("\n")} className={field} />
              </label>
              <label>
                Nuk përfshihen (një për rresht)
                <textarea name="excluded" rows={3} defaultValue={snap.checklist.excluded.join("\n")} className={field} />
              </label>
              <label>
                Për t&apos;u sqaruar (një për rresht)
                <textarea name="clarify" rows={3} defaultValue={snap.checklist.clarify.join("\n")} className={field} />
              </label>
              <div className="grid gap-3 sm:grid-cols-3">
                <label>
                  Data e re (opsionale)
                  <input name="date" type="date" min={minDate} className={field} />
                </label>
                <label>
                  Ora
                  <input name="time" type="time" className={field} />
                </label>
                <label>
                  Kohëzgjatja (minuta)
                  <input name="minutes" type="number" min={30} step={15} defaultValue={r.plannedMinutes ?? ""} className={field} />
                </label>
              </div>
              <label>
                Mesazh për klientin
                <textarea name="message" rows={3} maxLength={1500} className={field} />
              </label>
              <button className={primary}>Dërgo ofertën për pranim</button>
            </form>
          </section>

          {r.status !== "AWAITING_CUSTOMER" && (
            <section className={card}>
              <h2 className={h2}>Kërko më shumë të dhëna</h2>
              <form action={infoAction} className="mt-3 grid gap-3">
                <Hidden id={r.id} />
                <textarea name="message" rows={3} maxLength={1500} placeholder="P.sh. Sa dyshekë dopio janë? A mund të na dërgoni një foto të banjës?" className={field} />
                <button className={ghost}>Ruaj pyetjen (pastaj dërgojeni në WhatsApp)</button>
              </form>
            </section>
          )}
        </>
      )}

      {r.status === "CONFIRMED" && (
        <section className={card}>
          <h2 className={h2}>Fleta e punës për ekipin</h2>
          <form action={addressAction} className="mt-3 grid gap-3">
            <Hidden id={r.id} />
            <label>
              Adresa e saktë (shfaqet vetëm në fletën e punës)
              <input name="address" maxLength={300} defaultValue={r.address ?? ""} className={field} />
            </label>
            <button className={ghost}>Ruaj adresën</button>
          </form>
          {jobSheet && (
            <>
              <p className="mt-4 text-text-muted">Ndajeni vetëm me ekipin e këtij pastrimi. Nuk përmban foto ose video.</p>
              <CopyLink link={`${siteUrl}/flete-pune/${jobSheet}`} whatsappText={`Fleta e punës: ${siteUrl}/flete-pune/${jobSheet}`} />
              <form action={rotateJobSheetAction} className="mt-3">
                <Hidden id={r.id} />
                <button className={ghost}>Lidhje e re (e vjetra nuk punon më)</button>
              </form>
            </>
          )}
        </section>
      )}

      <section className={card}>
        <h2 className={h2}>Lidhja e klientit</h2>
        {link ? <CopyLink link={link} whatsappText={waText} /> : <p className="mt-2">Lidhja nuk mund të shfaqet: krijoni një të re.</p>}
        <form action={rotateLinkAction} className="mt-3">
          <Hidden id={r.id} />
          <button className={ghost}>Krijo lidhje të re (e vjetra nuk punon më)</button>
        </form>
      </section>

      {r.proposals.length > 1 && (
        <section className={card}>
          <h2 className={h2}>Të gjitha versionet</h2>
          {r.proposals.map((p) => (
            <details key={p.id} className="mt-3 rounded-lg border border-border p-3">
              <summary className="min-h-12 cursor-pointer font-semibold">
                Versioni {p.version} · {p.kind} · nga {p.createdBy} · {formatDateSq(p.createdAt)} {formatTimeSq(p.createdAt)} · {p.status}
                {p.respondedBy ? ` (${p.respondedBy})` : ""}
              </summary>
              <div className="mt-3">
                <ProposalView snap={snapshotOf(p) as ProposalSnapshot} stage="pending" showAnswers={false} />
              </div>
            </details>
          ))}
        </section>
      )}

      <section className={card}>
        <h2 className={h2}>Historiku</h2>
        <ol className="mt-3 grid gap-2">
          {r.events.map((e) => {
            const d = e.detail as { message?: string; reason?: string; error?: string; problem?: string } | null;
            return (
              <li key={e.id} className="border-b border-border pb-2">
                <span className="text-sm text-text-muted">
                  {formatDateSq(e.at)} {formatTimeSq(e.at)} · {e.actor}
                </span>
                <br />
                {actionLabel[e.action] ?? e.action}
                {d?.message || d?.reason || d?.error || d?.problem ? `: ${d.message ?? d.reason ?? d.error ?? d.problem}` : ""}
              </li>
            );
          })}
        </ol>
      </section>

      {(open || r.status === "CONFIRMED") && (
        <section className={card}>
          <h2 className={h2}>Mbyllja</h2>
          <div className="mt-3 grid gap-4">
            {r.status === "CONFIRMED" && (
              <form action={closeAction}>
                <Hidden id={r.id} />
                <input type="hidden" name="to" value="COMPLETED" />
                <button className={ghost}>Shëno si të kryer</button>
              </form>
            )}
            {(["DECLINED", "CANCELLED"] as const).map((to) => (
              <form key={to} action={closeAction} className="grid gap-2 rounded-lg border border-border p-3">
                <Hidden id={r.id} />
                <input type="hidden" name="to" value={to} />
                <input name="reason" placeholder="Arsyeja (për historikun)" maxLength={500} className={field} />
                <label className="flex min-h-12 items-center gap-3">
                  <input type="checkbox" name="confirm" value="po" className="h-5 w-5" /> Po, {to === "DECLINED" ? "refuzoje" : "anuloje"} dhe liro datën
                </label>
                <button className={danger}>{to === "DECLINED" ? "Refuzo kërkesën" : "Anulo"}</button>
              </form>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
