import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Section } from "@/components/Section";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { PhoneButton } from "@/components/PhoneButton";
import { ProposalView } from "@/components/booking/ProposalView";
import { CopyLink } from "@/components/booking/CopyLink";
import { describeDate, findByToken, latestProposal, snapshotOf, type ProposalSnapshot } from "@/lib/booking/requests";
import { looksLikeToken } from "@/lib/booking/tokens";
import { formatDateSq } from "@/lib/booking/time";
import { siteUrl } from "@/lib/seo";
import { acceptProposal, cancelRequest, declineProposal, replyToRequest } from "./actions";

export const metadata: Metadata = { title: "Kërkesa juaj", robots: { index: false, follow: false } };

const notices: Record<string, string> = {
  pranuar: "Faleminderit! E pranuat ofertën. Pastrimi është konfirmuar.",
  refuzuar: "E morëm përgjigjen tuaj. Kërkesa u mbyll.",
  anuluar: "Kërkesa u anulua.",
  derguar: "Mesazhi juaj u dërgua.",
};
const errorsText: Record<string, string> = {
  veprimi: "Ky veprim nuk është më i mundur. Rifreskoni faqen.",
  teknik: "Diçka nuk funksionoi. Provoni përsëri ose na shkruani në WhatsApp.",
  konfirmo: "Shënoni kutinë për ta konfirmuar anulimin.",
  bosh: "Shkruani mesazhin.",
  shume: "Shumë veprime radhazi. Provoni pas pak minutash.",
};

const btn = "inline-flex min-h-14 items-center justify-center rounded-full px-7 text-lg font-semibold";
const field = "mt-2 block min-h-12 w-full rounded-lg border-2 border-border bg-bg px-4 py-2 text-lg";

export default async function RequestStatusPage({
  params,
  searchParams,
}: {
  params: Promise<{ token: string }>;
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const { token } = await params;
  const q = await searchParams;
  if (!looksLikeToken(token)) notFound();
  const r = await findByToken(token);
  if (!r) notFound();

  const current = latestProposal(r);
  const snap = snapshotOf(current) as ProposalSnapshot;
  const accepted = [...r.proposals].reverse().find((p) => p.status === "ACCEPTED");
  const agreed = accepted ? (snapshotOf(accepted) as ProposalSnapshot) : null;
  const holdActive = r.dateMode === "HELD" && r.reservations.length > 0;
  const lastDecision = [...r.events].reverse().find((e) => ["declined", "declined_proposal", "cancelled"].includes(e.action));
  const thread = r.events.filter((e) => e.action === "asked_for_info" || e.action === "customer_message");
  const link = `${siteUrl}/kerkesa/${token}`;
  const open = ["PENDING_REVIEW", "AWAITING_INFO", "AWAITING_CUSTOMER"].includes(r.status);

  let title: string;
  let lead: string;
  switch (r.status) {
    case "PENDING_REVIEW":
      title = "Kërkesa juaj është dërguar për shqyrtim.";
      lead = "Çmimi dhe lista e punëve janë paraprake. Pastrimi konfirmohet pasi të biem dakord për vendndodhjen, punët, çmimin dhe datën.";
      break;
    case "AWAITING_INFO":
      title = "Na duhen edhe disa të dhëna";
      lead = "Lexoni pyetjen më poshtë dhe na përgjigjuni këtu ose në WhatsApp. Pastrimi nuk është ende i konfirmuar.";
      break;
    case "AWAITING_CUSTOMER":
      title = "Kemi një ofertë të rishikuar për ju";
      lead = "Pas shqyrtimit ndryshuam disa gjëra. Lexojeni ofertën dhe na tregoni nëse ju përshtatet. Pastrimi konfirmohet vetëm kur e pranoni.";
      break;
    case "CONFIRMED":
      title = "Pastrimi juaj është konfirmuar";
      lead = "Ramë dakord për punët, çmimin dhe datën. Nëse ndryshon diçka, na shkruani sa më shpejt.";
      break;
    case "DECLINED":
      title = "Kërkesa u mbyll";
      lead =
        lastDecision?.actor === "klienti"
          ? "E morëm përgjigjen tuaj se oferta nuk ju përshtatet. Nëse ndryshoni mendje, na shkruani."
          : "Na vjen keq, këtë herë nuk mund ta marrim përsipër këtë pastrim. Nëse doni, na shkruani për një zgjidhje tjetër.";
      break;
    case "CANCELLED":
      title = "Kërkesa u anulua";
      lead = "Nëse doni të kërkoni sërish, na shkruani ose dërgoni një kërkesë të re.";
      break;
    default:
      title = "Pastrimi u krye";
      lead = "Faleminderit që zgjodhët Limoni Cleaning.";
  }

  return (
    <Section className="pt-8 sm:pt-12">
      <div className="mx-auto max-w-3xl">
        {q.u && notices[q.u] && (
          <p role="status" className="mb-6 rounded-lg bg-bg-warm p-4 font-semibold">
            {notices[q.u]}
          </p>
        )}
        {q.gabim && errorsText[q.gabim] && (
          <p role="alert" className="mb-6 rounded-lg border-2 border-red-700/30 bg-red-50 p-4 font-medium text-red-800">
            {errorsText[q.gabim]}
          </p>
        )}
        <p className="text-base text-text-muted">
          {snap.serviceLabel} · dërguar më {formatDateSq(r.createdAt)}
        </p>
        <h1 className="mt-2 text-3xl leading-tight font-extrabold tracking-tight sm:text-4xl">{title}</h1>
        <p className="mt-4 text-xl text-text-muted">{lead}</p>

        {/* Date: hold wording only when a hold really exists. */}
        <div className="mt-6 rounded-lg border border-border p-5">
          {r.status === "CONFIRMED" && agreed ? (
            <p>
              <span className="text-text-muted">Data e konfirmuar: </span>
              <strong>{describeDate(agreed.date)}</strong>
            </p>
          ) : holdActive && open ? (
            <p>
              <span className="text-text-muted">Data e kërkuar: </span>
              <strong>{describeDate(snap.date)}</strong>. E mbajmë përkohësisht ndërsa e shqyrtojmë kërkesën; nuk është ende e konfirmuar.
            </p>
          ) : r.dateMode === "PREFERRED" && r.preferredDate && open ? (
            <p>
              <span className="text-text-muted">Data e preferuar: </span>
              <strong>{formatDateSq(r.preferredDate)}</strong>. Nuk është mbajtur; datën e konfirmojmë bashkë.
              {r.dateNote && <span className="mt-1 block text-base text-text-muted">{r.dateNote}</span>}
            </p>
          ) : open ? (
            <p>Pa datë të zgjedhur: e sqarojmë bashkë.</p>
          ) : (
            <p className="text-text-muted">Kjo kërkesë nuk ka më datë aktive.</p>
          )}
        </div>

        {thread.length > 0 && (
          <div className="mt-8">
            <h2 className="text-2xl font-bold">Mesazhet</h2>
            <ul className="mt-3 grid gap-3">
              {thread.map((e) => (
                <li key={e.id} className={`rounded-lg p-4 ${e.actor === "klienti" ? "bg-bg-muted" : "border-l-4 border-primary bg-bg-warm"}`}>
                  <p className="text-sm text-text-muted">
                    {e.actor === "klienti" ? "Ju" : "Limoni Cleaning"} · {formatDateSq(e.at)}
                  </p>
                  <p className="mt-1 whitespace-pre-line">{String((e.detail as { message?: string } | null)?.message ?? "")}</p>
                </li>
              ))}
            </ul>
          </div>
        )}

        {open && (
          <form action={replyToRequest} className="mt-6">
            <input type="hidden" name="token" value={token} />
            <label htmlFor="message" className="block text-lg font-semibold">
              {r.status === "AWAITING_INFO" ? "Përgjigja juaj" : "Na shkruani diçka (opsionale)"}
            </label>
            <textarea id="message" name="message" rows={3} maxLength={1500} className={field} />
            <button className={`${btn} mt-3 border-2 border-primary/30 text-primary`}>Dërgo mesazhin</button>
          </form>
        )}

        <h2 className="mt-10 text-2xl font-bold">
          {r.status === "AWAITING_CUSTOMER" ? "Oferta e rishikuar" : r.status === "CONFIRMED" ? "Çfarë ramë dakord" : "Kërkesa juaj"}
        </h2>
        <div className="mt-4">
          <ProposalView
            snap={r.status === "CONFIRMED" && agreed ? agreed : snap}
            stage={r.status === "CONFIRMED" || r.status === "COMPLETED" ? "agreed" : r.status === "AWAITING_CUSTOMER" ? "proposed" : "pending"}
          />
        </div>

        {r.status === "AWAITING_CUSTOMER" && current.status === "PROPOSED" && (
          <div className="mt-8 rounded-lg border-2 border-primary/20 p-5">
            <p className="font-semibold">A ju përshtatet kjo ofertë?</p>
            <div className="mt-4 flex flex-col gap-3 sm:flex-row">
              <form action={acceptProposal}>
                <input type="hidden" name="token" value={token} />
                <input type="hidden" name="proposalId" value={current.id} />
                <button className={`${btn} w-full bg-primary text-white`}>Po, e pranoj ofertën</button>
              </form>
              <form action={declineProposal}>
                <input type="hidden" name="token" value={token} />
                <input type="hidden" name="proposalId" value={current.id} />
                <button className={`${btn} w-full border-2 border-primary/30 text-primary`}>Jo, nuk më përshtatet</button>
              </form>
            </div>
            {r.proposals.length > 1 && (
              <details className="mt-5">
                <summary className="inline-flex min-h-12 cursor-pointer items-center font-semibold text-primary">Shikoni kërkesën fillestare</summary>
                <div className="mt-3">
                  <ProposalView snap={snapshotOf(r.proposals[0]) as ProposalSnapshot} stage="pending" showAnswers={false} />
                </div>
              </details>
            )}
          </div>
        )}

        {r.media.length > 0 && (
          <div className="mt-10">
            <h2 className="text-2xl font-bold">Fotot dhe videot tuaja</h2>
            <p className="mt-1 text-base text-text-muted">I shohim vetëm ne, për këtë kërkesë.</p>
            <ul className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {r.media.map((m) => (
                <li key={m.id}>
                  <a href={`/kerkesa/${token}/media/${m.id}`} target="_blank" rel="noopener noreferrer" className="block rounded-lg border border-border p-2 text-sm">
                    {m.kind === "photo" ? (
                      // eslint-disable-next-line @next/next/no-img-element -- private, short-lived source; not for the image optimizer
                      <img src={`/kerkesa/${token}/media/${m.id}`} alt={`Foto: ${m.originalName}`} loading="lazy" className="aspect-square w-full rounded object-cover" />
                    ) : (
                      <span className="flex aspect-square items-center justify-center rounded bg-bg-muted">Video</span>
                    )}
                    <span className="mt-1 block truncate">{m.originalName}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="mt-10 rounded-lg bg-bg-muted p-5">
          <h2 className="text-xl font-bold">Ruajeni këtë lidhje</h2>
          <p className="mt-1 text-text-muted">Me këtë lidhje e shihni kërkesën dhe përgjigjen tonë. Mos ia jepni të tjerëve.</p>
          <CopyLink link={link} />
        </div>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <WhatsAppButton placement="request_status" size="lg">
            Na shkruani në WhatsApp
          </WhatsAppButton>
          <PhoneButton placement="request_status" size="lg" />
        </div>

        {["PENDING_REVIEW", "AWAITING_INFO", "AWAITING_CUSTOMER", "CONFIRMED"].includes(r.status) && (
          <details className="mt-10">
            <summary className="inline-flex min-h-12 cursor-pointer items-center font-semibold text-text-muted">Anuloni kërkesën</summary>
            <form action={cancelRequest} className="mt-3 rounded-lg border border-border p-4">
              <input type="hidden" name="token" value={token} />
              <label htmlFor="reason" className="block font-semibold">
                Arsyeja (opsionale)
              </label>
              <input id="reason" name="reason" maxLength={500} className={field} />
              <label className="mt-4 flex min-h-12 items-center gap-3">
                <input type="checkbox" name="confirm" value="po" className="h-5 w-5" /> Po, dua ta anuloj këtë kërkesë
              </label>
              <button className={`${btn} mt-3 border-2 border-red-700/40 text-red-800`}>Anulo kërkesën</button>
            </form>
          </details>
        )}
      </div>
    </Section>
  );
}
