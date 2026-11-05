import { CheckIcon, MinusIcon } from "../icons";
import { describeDate, type ProposalSnapshot } from "@/lib/booking/requests";

function List({ title, items, kind }: { title: string; items: string[]; kind: "in" | "out" | "ask" | "prio" }) {
  if (!items.length) return null;
  return (
    <div className="mt-5">
      <h3 className="font-bold">{title}</h3>
      {kind === "out" && <span className="sr-only">Këto nuk përfshihen:</span>}
      <ul className="mt-2 space-y-2">
        {items.map((i) => (
          <li key={i} className="flex gap-3">
            {kind === "out" ? (
              <MinusIcon className="mt-1 h-5 w-5 shrink-0 text-text-muted" />
            ) : kind === "ask" ? (
              <span aria-hidden className="mt-0.5 w-5 shrink-0 text-center font-bold text-accent-hover">?</span>
            ) : (
              <CheckIcon className="mt-1 h-5 w-5 shrink-0 text-primary" />
            )}
            <span>{i}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

/**
 * stage: "pending" (submitted, under review), "proposed" (revised, awaiting acceptance),
 * "agreed" (confirmed). The price label changes with it, so an indicative estimate is never
 * presented as a final total until both sides agreed.
 */
export function ProposalView({ snap, stage, showAnswers = true }: { snap: ProposalSnapshot; stage: "pending" | "proposed" | "agreed"; showAnswers?: boolean }) {
  const p = snap.price;
  const priceLabel =
    p.kind === "after-assessment"
      ? null
      : stage === "agreed"
        ? "Totali i dakordësuar"
        : p.kind === "proposed-total"
          ? "Totali i propozuar"
          : "Vlerësim orientues";
  return (
    <div>
      {snap.message && (
        <blockquote className="mb-5 border-l-4 border-primary bg-bg-muted p-4">
          <p className="text-base text-text-muted">Shënim nga Limoni Cleaning</p>
          <p className="mt-1 whitespace-pre-line">{snap.message}</p>
        </blockquote>
      )}
      <div className="rounded-lg border-l-4 border-accent bg-bg-warm p-5">
        {priceLabel && p.kind !== "after-assessment" ? (
          <>
            <p className="text-text-muted">{priceLabel}</p>
            <p className="mt-1 text-3xl font-extrabold tracking-tight">{p.amountText}</p>
            {p.kind === "indicative" && <p className="mt-1 text-text-muted">{p.basis}</p>}
            {p.kind === "proposed-total" && p.note && <p className="mt-1 text-text-muted">{p.note}</p>}
          </>
        ) : (
          <>
            <p className="text-2xl font-extrabold tracking-tight">Çmimi përcaktohet pas vlerësimit</p>
            {p.kind === "after-assessment" && <p className="mt-1 text-text-muted">{p.reason}</p>}
          </>
        )}
        {stage !== "agreed" && "assumptions" in p && p.assumptions.length > 0 && (
          <ul className="mt-3 space-y-1 text-base">
            {p.assumptions.map((a) => (
              <li key={a}>{a}</li>
            ))}
          </ul>
        )}
      </div>
      <p className="mt-4">
        <span className="text-text-muted">Data: </span>
        <strong>{describeDate(snap.date)}</strong>
      </p>
      <List title="Punët" items={snap.checklist.included} kind="in" />
      <List title="Nuk përfshihen" items={snap.checklist.excluded} kind="out" />
      <List title="Për t'u sqaruar" items={snap.checklist.clarify} kind="ask" />
      <List title="Ka rëndësi për ju" items={snap.checklist.priorities} kind="prio" />
      {showAnswers && snap.answerLines.length > 0 && (
        <details className="mt-5">
          <summary className="inline-flex min-h-12 cursor-pointer items-center font-semibold text-primary">Përgjigjet tuaja</summary>
          <dl className="mt-2 grid gap-1">
            {snap.answerLines.map((l) => (
              <div key={l.label} className="flex flex-wrap gap-x-2">
                <dt className="text-text-muted">{l.label}:</dt>
                <dd>{l.value}</dd>
              </div>
            ))}
          </dl>
        </details>
      )}
    </div>
  );
}
