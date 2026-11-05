"use client";

import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { WhatsAppButton } from "../WhatsAppButton";
import { PhoneButton } from "../PhoneButton";
import { CheckIcon, MinusIcon } from "../icons";
import {
  checklistFor,
  cleanPriorities,
  estimateFor,
  serviceKeys,
  services,
  type AnswerValue,
  type Answers,
  type Question,
  type ServiceKey,
} from "@/lib/booking/catalog";
import { ACCEPT_ATTR, checkFile, formatBytes, LIMITS_TEXT, MAX_FILES } from "@/lib/booking/media";
import { normalizePhone } from "@/lib/phone";
import { currentAttribution } from "@/lib/attribution";
import { trackEvent } from "@/lib/analytics";
import { formatDateSq } from "@/lib/booking/time";

const STEPS = ["Shërbimi", "Përshkrimi", "Foto", "Vlerësimi", "Data", "Dërgimi"];
const zones = [
  { value: "tirane", label: "Tiranë" },
  { value: "kamez", label: "Kamëz" },
  { value: "durres", label: "Durrës" },
  { value: "tjeter", label: "Tjetër" },
];

const chip =
  "inline-flex min-h-12 cursor-pointer items-center rounded-lg border-2 border-border bg-bg px-4 text-base font-medium text-text has-checked:border-primary has-checked:bg-primary has-checked:text-white has-focus-visible:outline-3 has-focus-visible:outline-offset-2 has-focus-visible:outline-primary";
const input =
  "mt-2 block min-h-12 w-full rounded-lg border-2 border-border bg-bg px-4 py-2 text-lg text-text focus:border-primary aria-[invalid=true]:border-red-700";
const label = "block text-lg font-semibold";
const primaryBtn =
  "inline-flex min-h-14 items-center justify-center rounded-full bg-primary px-7 text-lg font-semibold text-white hover:bg-primary-hover disabled:opacity-50";
const ghostBtn = "inline-flex min-h-12 items-center justify-center rounded-full border-2 border-primary/30 px-6 font-semibold text-primary hover:border-primary";

interface Upload {
  localId: string;
  file: File;
  kind: "photo" | "video";
  status: "uploading" | "verifying" | "ready" | "error";
  progress: number;
  error?: string;
  mediaId?: string;
  /** False when the file itself is not allowed (type/size): retrying can't help. */
  retryable: boolean;
}

type Availability =
  | { mode: "loading" }
  | { mode: "live"; days: { date: string; label: string; times: string[] }[] }
  | { mode: "preferred"; reason: string; minDate: string; maxDate: string }
  | { mode: "error" };

function newId() {
  return typeof crypto !== "undefined" && "randomUUID" in crypto ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

function putWithProgress(url: string, file: File, headers: Record<string, string>, onProgress: (p: number) => void): Promise<void> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("PUT", url);
    for (const [k, v] of Object.entries(headers)) xhr.setRequestHeader(k, v);
    xhr.upload.onprogress = (e) => e.lengthComputable && onProgress(Math.round((e.loaded / e.total) * 100));
    xhr.onload = () => (xhr.status >= 200 && xhr.status < 300 ? resolve() : reject(new Error(String(xhr.status))));
    xhr.onerror = () => reject(new Error("network"));
    xhr.send(file);
  });
}

function QuestionField({ q, value, onChange, error }: { q: Question; value: AnswerValue | undefined; onChange: (v: AnswerValue) => void; error?: string }) {
  const id = `q-${q.id}`;
  if (q.type === "choice" || q.type === "multi") {
    const selected = q.type === "multi" ? ((value as string[]) ?? []) : value;
    return (
      <fieldset aria-describedby={error ? `${id}-err` : undefined}>
        <legend className={label}>{q.label}</legend>
        {q.hint && <p className="mt-1 text-base text-text-muted">{q.hint}</p>}
        <div className="mt-3 flex flex-wrap gap-2">
          {q.options.map((opt) => (
            <label key={opt.value} className={chip}>
              <input
                type={q.type === "multi" ? "checkbox" : "radio"}
                name={id}
                className="sr-only"
                checked={q.type === "multi" ? (selected as string[]).includes(opt.value) : selected === opt.value}
                onChange={(e) => {
                  if (q.type === "multi") {
                    const cur = (selected as string[]) ?? [];
                    onChange(e.target.checked ? [...cur, opt.value] : cur.filter((x) => x !== opt.value));
                  } else onChange(opt.value);
                }}
                onClick={() => q.type === "choice" && !q.required && selected === opt.value && onChange(null)}
              />
              {opt.label}
            </label>
          ))}
        </div>
        {error && (
          <p id={`${id}-err`} className="mt-2 font-medium text-red-700">
            {error}
          </p>
        )}
      </fieldset>
    );
  }
  if (q.type === "count") {
    const n = typeof value === "number" ? value : null;
    const set = (v: number) => onChange(Math.min(q.max, Math.max(q.min, v)));
    return (
      <div>
        <p className={label} id={`${id}-label`}>
          {q.label}
        </p>
        <div className="mt-2 flex items-center gap-3" role="group" aria-labelledby={`${id}-label`}>
          <button type="button" className={ghostBtn + " w-14 px-0! text-2xl"} onClick={() => set((n ?? q.min) - 1)} aria-label={`Më pak: ${q.label}`}>
            −
          </button>
          <output className="min-w-12 text-center text-2xl font-bold" aria-live="polite">
            {n ?? "–"}
          </output>
          <button type="button" className={ghostBtn + " w-14 px-0! text-2xl"} onClick={() => set(n == null ? Math.max(q.min, 1) : n + 1)} aria-label={`Më shumë: ${q.label}`}>
            +
          </button>
        </div>
      </div>
    );
  }
  if (q.type === "area") {
    const unknown = value === "nuk-e-di";
    return (
      <div>
        <label htmlFor={id} className={label}>
          {q.label}
        </label>
        <div className="flex flex-wrap items-start gap-3">
          <input
            id={id}
            type="text"
            inputMode="numeric"
            className={`${input} max-w-40`}
            disabled={unknown}
            value={typeof value === "number" ? String(value) : ""}
            onChange={(e) => {
              const digits = e.target.value.replace(/\D/g, "").slice(0, 6);
              onChange(digits ? Number(digits) : null);
            }}
          />
          <label className={`${chip} mt-2`}>
            <input type="checkbox" className="sr-only" checked={unknown} onChange={(e) => onChange(e.target.checked ? "nuk-e-di" : null)} />
            Nuk e di
          </label>
        </div>
      </div>
    );
  }
  return (
    <div>
      <label htmlFor={id} className={label}>
        {q.label}
      </label>
      <textarea id={id} rows={3} maxLength={q.maxLength} className={input} value={(value as string) ?? ""} onChange={(e) => onChange(e.target.value)} />
    </div>
  );
}

function ListBlock({ title, items, kind }: { title: string; items: string[]; kind: "in" | "out" | "ask" }) {
  if (!items.length) return null;
  return (
    <div className="mt-6">
      <h3 className="text-lg font-bold">{title}</h3>
      {kind === "out" && <span className="sr-only">Këto nuk përfshihen:</span>}
      <ul className="mt-3 space-y-2">
        {items.map((i) => (
          <li key={i} className="flex gap-3">
            {kind === "in" ? (
              <CheckIcon className="mt-1 h-5 w-5 shrink-0 text-primary" />
            ) : kind === "out" ? (
              <MinusIcon className="mt-1 h-5 w-5 shrink-0 text-text-muted" />
            ) : (
              <span aria-hidden className="mt-0.5 w-5 shrink-0 text-center font-bold text-accent-hover">?</span>
            )}
            <span>{i}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function BookingWizard({ initialService, uploadsEnabled }: { initialService?: ServiceKey; uploadsEnabled: boolean }) {
  const router = useRouter();
  const [step, setStep] = useState(initialService ? 1 : 0);
  const [service, setService] = useState<ServiceKey | undefined>(initialService);
  const [answers, setAnswers] = useState<Answers>({});
  const [zone, setZone] = useState("");
  const [areaDetail, setAreaDetail] = useState("");
  const [uploads, setUploads] = useState<Upload[]>([]);
  const [priorities, setPriorities] = useState<string[]>([]);
  const [priorityText, setPriorityText] = useState("");
  const [availability, setAvailability] = useState<Availability>({ mode: "loading" });
  const [slot, setSlot] = useState<{ date: string; time: string } | null>(null);
  const [preferredDate, setPreferredDate] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [channel, setChannel] = useState("WHATSAPP");
  const [note, setNote] = useState("");
  const [honeypot, setHoneypot] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const draftKey = useRef<string | undefined>(undefined);
  const clientRequestId = useRef(newId());
  const startedAt = useRef(0);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const firstRender = useRef(true);

  useEffect(() => {
    startedAt.current = Date.now();
  }, []);

  // Each step change: focus the new heading (keyboard and screen readers) and bring it into view.
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    headingRef.current?.focus({ preventScroll: true });
    headingRef.current?.scrollIntoView({ block: "start" });
  }, [step]);

  const def = service ? services[service] : undefined;
  const outsideTirana = zone !== "" && zone !== "tirane";
  const preview = useMemo(() => {
    if (!service) return null;
    const ctx = { outsideTirana, priorities: cleanPriorities(priorities) };
    return { estimate: estimateFor(service, answers, ctx), checklist: checklistFor(service, answers, ctx) };
  }, [service, answers, outsideTirana, priorities]);

  useEffect(() => {
    if (step !== 4 || !service) return;
    let cancelled = false;
    fetch(`/api/kerkesa/disponueshmeria?sherbimi=${service}`)
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((data) => !cancelled && setAvailability(data))
      .catch(() => !cancelled && setAvailability({ mode: "error" }));
    return () => {
      cancelled = true;
    };
  }, [step, service]);

  const setAnswer = (id: string, v: AnswerValue) => setAnswers((a) => ({ ...a, [id]: v }));
  const updateUpload = (localId: string, patch: Partial<Upload>) => setUploads((list) => list.map((u) => (u.localId === localId ? { ...u, ...patch } : u)));
  const busyUploading = uploads.some((u) => u.status === "uploading" || u.status === "verifying");

  async function startUpload(u: Upload) {
    updateUpload(u.localId, { status: "uploading", progress: 0, error: undefined });
    try {
      const init = await fetch("/api/kerkesa/media", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ draftKey: draftKey.current, name: u.file.name, type: u.file.type, size: u.file.size }),
      });
      const data = await init.json().catch(() => ({}));
      if (!init.ok) throw new Error(data.error ?? "Ngarkimi nuk filloi.");
      draftKey.current = data.draftKey;
      updateUpload(u.localId, { mediaId: data.id });
      const local = String(data.upload.url).startsWith("/");
      await putWithProgress(data.upload.url, u.file, { ...data.upload.headers, ...(local ? { "x-draft-key": data.draftKey } : {}) }, (p) =>
        updateUpload(u.localId, { progress: p }),
      );
      updateUpload(u.localId, { status: "verifying", progress: 100 });
      const done = await fetch(`/api/kerkesa/media/${data.id}`, { method: "POST", headers: { "x-draft-key": data.draftKey } });
      const doneData = await done.json().catch(() => ({}));
      if (!done.ok) throw new Error(doneData.error ?? "Skedari nuk u pranua.");
      updateUpload(u.localId, { status: "ready" });
    } catch (e) {
      updateUpload(u.localId, { status: "error", error: e instanceof Error && e.message.length > 6 ? e.message : "Ngarkimi dështoi. Provoni përsëri." });
    }
  }

  async function removeUpload(u: Upload) {
    setUploads((list) => list.filter((x) => x.localId !== u.localId));
    if (u.mediaId && draftKey.current)
      await fetch(`/api/kerkesa/media/${u.mediaId}`, { method: "DELETE", headers: { "x-draft-key": draftKey.current } }).catch(() => {});
  }

  async function retryUpload(u: Upload) {
    if (u.mediaId && draftKey.current)
      await fetch(`/api/kerkesa/media/${u.mediaId}`, { method: "DELETE", headers: { "x-draft-key": draftKey.current } }).catch(() => {});
    const fresh = { ...u, mediaId: undefined };
    updateUpload(u.localId, { mediaId: undefined });
    void startUpload(fresh);
  }

  function addFiles(files: FileList | null) {
    if (!files) return;
    const room = MAX_FILES - uploads.length;
    const picked = Array.from(files).slice(0, Math.max(0, room));
    const added: Upload[] = picked.map((file) => {
      const c = checkFile(file.name, file.type, file.size);
      return {
        localId: newId(),
        file,
        kind: c.ok ? c.kind : "photo",
        status: c.ok ? "uploading" : "error",
        progress: 0,
        error: c.ok ? undefined : c.error,
        retryable: c.ok,
      };
    });
    setUploads((list) => [...list, ...added]);
    added.filter((u) => u.status === "uploading").forEach((u) => void startUpload(u));
    if (files.length > picked.length) setFormError(`Mund të dërgoni deri në ${MAX_FILES} skedarë.`);
  }

  function validateStep(s: number): boolean {
    const next: Record<string, string> = {};
    if (s === 0 && !service) next.service = "Zgjidhni një shërbim.";
    if (s === 1 && def) {
      for (const q of def.questions) if (q.type === "choice" && q.required && !answers[q.id]) next[`q-${q.id}`] = "Zgjidhni një përgjigje.";
      if (!zone) next.zone = "Zgjidhni zonën.";
    }
    if (s === 2 && busyUploading) next.uploads = "Prisni të mbarojë ngarkimi, ose hiqni skedarin.";
    if (s === 5) {
      if (name.trim().length < 2) next.name = "Shkruani emrin me të paktën dy shkronja.";
      if (!normalizePhone(phone)) next.phone = "Numri nuk duket i saktë. Kontrolloni numrin dhe provoni përsëri.";
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  function go(to: number) {
    setFormError("");
    if (to > step && !validateStep(step)) return;
    if (to === 1 && step === 0) trackEvent("form_start", { service: service ?? "pa-zgjedhur", placement: "booking" });
    setStep(to);
  }

  async function submit() {
    if (!validateStep(5) || submitting || !service) return;
    if (typeof navigator !== "undefined" && navigator.onLine === false) {
      setFormError("Nuk jeni të lidhur me internetin. Kërkesa nuk u dërgua; të dhënat janë ende këtu.");
      return;
    }
    setSubmitting(true);
    setFormError("");
    const utm = currentAttribution();
    try {
      const res = await fetch("/api/kerkesa", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        signal: AbortSignal.timeout(20000),
        body: JSON.stringify({
          service,
          answers,
          priorities,
          note,
          name,
          phone,
          channel,
          zone,
          areaDetail,
          mediaIds: uploads.filter((u) => u.status === "ready").map((u) => u.mediaId),
          draftKey: draftKey.current,
          slot: slot ?? undefined,
          preferredDate: !slot && preferredDate ? preferredDate : undefined,
          clientRequestId: clientRequestId.current,
          pagePath: window.location.pathname,
          utmSource: utm.utm_source,
          utmCampaign: utm.utm_campaign,
          website: honeypot,
          startedAt: startedAt.current,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok && data.statusUrl) {
        trackEvent("lead_submitted", { service, placement: "booking" });
        router.push(data.statusUrl);
        return;
      }
      if (res.status === 409) {
        setSlot(null);
        setAvailability({ mode: "loading" });
        setStep(4);
        setFormError(data.error ?? "Ky orar sapo u zu. Zgjidhni një tjetër.");
      } else if (res.status === 422) {
        setStep(2);
        setFormError(data.error);
      } else if (data.fieldErrors) {
        setErrors(data.fieldErrors);
        setFormError(data.error ?? "Kontrolloni fushat.");
      } else setFormError(data.error ?? "Kërkesa nuk u dërgua. Provoni përsëri ose na shkruani në WhatsApp.");
      trackEvent("lead_failed", { reason: `http_${res.status}`, placement: "booking" });
    } catch {
      setFormError("Kërkesa nuk u dërgua (lidhja u ndërpre). Provoni përsëri: nuk do të krijohet dy herë.");
    } finally {
      setSubmitting(false);
    }
  }

  const heading = (text: string, sub?: ReactNode) => (
    <div>
      <p className="text-base font-semibold text-text-muted" aria-live="polite">
        Hapi {step + 1} nga {STEPS.length}: {STEPS[step]}
      </p>
      <h2 ref={headingRef} tabIndex={-1} className="mt-1 scroll-mt-24 text-2xl font-extrabold tracking-tight sm:text-3xl">
        {text}
      </h2>
      {sub && <div className="mt-2 text-text-muted">{sub}</div>}
    </div>
  );

  const nav = (nextLabel = "Vazhdo", onNext = () => go(step + 1)) => (
    <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
      {step > 0 ? (
        <button type="button" className={ghostBtn} onClick={() => go(step - 1)}>
          Mbrapa
        </button>
      ) : (
        <span />
      )}
      <button type="button" className={primaryBtn} onClick={onNext}>
        {nextLabel}
      </button>
    </div>
  );

  return (
    <div data-lead-form className="min-w-0 rounded-lg border border-border bg-bg p-5 sm:p-8">
      <ol className="mb-6 flex gap-1" aria-hidden>
        {STEPS.map((s, i) => (
          <li key={s} className={`h-1.5 flex-1 rounded-full ${i <= step ? "bg-primary" : "bg-border"}`} />
        ))}
      </ol>

      {formError && (
        <div role="alert" className="mb-6 rounded-lg border-2 border-red-700/30 bg-red-50 p-4 font-medium text-red-800">
          {formError}
        </div>
      )}

      {step === 0 && (
        <section>
          {heading("Çfarë pastrimi ju duhet?")}
          <fieldset className="mt-6">
            <legend className="sr-only">Shërbimi</legend>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {serviceKeys.map((k) => (
                <label key={k} className="flex min-h-16 cursor-pointer gap-3 rounded-lg border-2 border-border p-4 has-checked:border-primary has-checked:bg-bg-warm has-focus-visible:outline-3 has-focus-visible:outline-primary">
                  <input
                    type="radio"
                    name="service"
                    className="mt-1.5 h-5 w-5 accent-[#184A2C]"
                    checked={service === k}
                    onChange={() => {
                      setService(k);
                      setAnswers({});
                      setSlot(null);
                    }}
                  />
                  <span>
                    <strong className="block text-lg">{services[k].label}</strong>
                    <span className="text-base text-text-muted">{services[k].blurb}</span>
                  </span>
                </label>
              ))}
            </div>
            {errors.service && <p className="mt-2 font-medium text-red-700">{errors.service}</p>}
          </fieldset>
          <p className="mt-6 text-text-muted">
            Preferoni të flisni direkt? <WhatsAppButton placement="booking_start" variant="link">Na shkruani në WhatsApp</WhatsAppButton> ose{" "}
            <PhoneButton placement="booking_start" variant="link" showIcon={false}>
              telefononi
            </PhoneButton>
            .
          </p>
          {nav()}
        </section>
      )}

      {step === 1 && def && (
        <section>
          {heading(service === "divane" ? "Na tregoni për divanet dhe dyshekët" : "Na tregoni për pronën", "Përgjigjuni sa dini. Çdo gjë tjetër e sqarojmë bashkë.")}
          <div className="mt-6 grid grid-cols-1 gap-7">
            {def.questions.map((q) => (
              <QuestionField key={q.id} q={q} value={answers[q.id]} onChange={(v) => setAnswer(q.id, v)} error={errors[`q-${q.id}`]} />
            ))}
            <fieldset>
              <legend className={label}>Ku ndodhet?</legend>
              <div className="mt-3 flex flex-wrap gap-2">
                {zones.map((z) => (
                  <label key={z.value} className={chip}>
                    <input type="radio" name="zone" className="sr-only" checked={zone === z.value} onChange={() => setZone(z.value)} />
                    {z.label}
                  </label>
                ))}
              </div>
              {errors.zone && <p className="mt-2 font-medium text-red-700">{errors.zone}</p>}
              <label htmlFor="area-detail" className="mt-4 block text-base font-semibold">
                Lagjja ose zona (opsionale, pa adresën e saktë)
              </label>
              <input id="area-detail" className={input} maxLength={120} value={areaDetail} onChange={(e) => setAreaDetail(e.target.value)} />
            </fieldset>
          </div>
          {nav()}
        </section>
      )}

      {step === 2 && def && (
        <section>
          {heading("Foto ose video (opsionale)", <p>Fotot na ndihmojnë ta kuptojmë punën. {def.mediaHint}</p>)}
          <ul className="mt-5 space-y-2 text-base text-text-muted">
            <li>Fotografoni vetëm zonat që duhen pastruar, pa njerëz dhe pa sende personale.</li>
            <li>Fotot dhe videot i shohim vetëm ne, kur shqyrtojmë kërkesën. Nuk analizohen automatikisht.</li>
            <li>Edhe me foto, një ofertë e saktë mund të kërkojë një vlerësim të mëtejshëm.</li>
          </ul>
          {uploadsEnabled ? (
            <>
              <label className={`${primaryBtn} mt-6 w-full cursor-pointer sm:w-auto`}>
                Zgjidhni foto ose video
                <input
                  type="file"
                  multiple
                  accept={ACCEPT_ATTR}
                  className="sr-only"
                  onChange={(e) => {
                    addFiles(e.target.files);
                    e.target.value = "";
                  }}
                  disabled={uploads.length >= MAX_FILES}
                />
              </label>
              <p className="mt-3 text-sm text-text-muted">{LIMITS_TEXT}</p>
              {uploads.length > 0 && (
                <ul className="mt-5 grid grid-cols-1 gap-3" aria-live="polite">
                  {uploads.map((u) => (
                    <li key={u.localId} className="rounded-lg border border-border p-3">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <span className="min-w-0 max-w-full flex-1 basis-40">
                          <span className="block truncate font-medium">{u.file.name}</span>
                          <span className="block text-sm text-text-muted">{formatBytes(u.file.size)}</span>
                        </span>
                        <span className="flex gap-2">
                          {u.status === "error" && u.retryable && (
                            <button type="button" className={ghostBtn + " min-h-12 px-4"} onClick={() => retryUpload(u)}>
                              Provo sërish
                            </button>
                          )}
                          <button type="button" className={ghostBtn + " min-h-12 px-4"} onClick={() => removeUpload(u)} aria-label={`Hiq ${u.file.name}`}>
                            Hiq
                          </button>
                        </span>
                      </div>
                      {u.status === "uploading" || u.status === "verifying" ? (
                        <div className="mt-2">
                          <div className="h-2 rounded-full bg-border">
                            <div className="h-2 rounded-full bg-primary transition-[width]" style={{ width: `${u.progress}%` }} />
                          </div>
                          <p className="mt-1 text-sm text-text-muted">{u.status === "verifying" ? "Po kontrollohet…" : `Po ngarkohet ${u.progress}%`}</p>
                        </div>
                      ) : u.status === "ready" ? (
                        <p className="mt-1 text-sm font-medium text-primary">Gati</p>
                      ) : (
                        <p className="mt-1 text-sm font-medium text-red-700">{u.error}</p>
                      )}
                    </li>
                  ))}
                </ul>
              )}
              {errors.uploads && <p className="mt-3 font-medium text-red-700">{errors.uploads}</p>}
            </>
          ) : (
            <p className="mt-6 rounded-lg bg-bg-muted p-4">
              Ngarkimi i fotove nuk është aktiv tani. Nëse doni, na i dërgoni në WhatsApp pasi të dërgoni kërkesën, ose vazhdoni pa foto.
            </p>
          )}
          <p className="mt-6 text-text-muted">
            Nuk doni të dërgoni foto? S&apos;ka problem: vazhdoni pa foto dhe e sqarojmë në telefon.
          </p>
          {nav(uploads.some((u) => u.status === "ready") ? "Vazhdo" : "Vazhdo pa foto")}
        </section>
      )}

      {step === 3 && preview && (
        <section>
          {heading("Vlerësimi paraprak dhe lista e punëve", "Llogaritet nga përgjigjet tuaja. Nuk është ofertë përfundimtare.")}
          <div className="mt-6 rounded-lg border-l-4 border-accent bg-bg-warm p-5">
            {preview.estimate.kind === "indicative" ? (
              <>
                <p className="text-text-muted">Vlerësim orientues</p>
                <p className="mt-1 text-3xl font-extrabold tracking-tight">{preview.estimate.amountText}</p>
                <p className="mt-1 text-text-muted">{preview.estimate.basis}</p>
              </>
            ) : (
              <>
                <p className="text-2xl font-extrabold tracking-tight">Çmimi përcaktohet pas vlerësimit</p>
                <p className="mt-1 text-text-muted">{preview.estimate.reason}</p>
              </>
            )}
            <ul className="mt-4 space-y-1 text-base">
              {preview.estimate.assumptions.map((a) => (
                <li key={a}>{a}</li>
              ))}
            </ul>
          </div>
          <ListBlock title="Punët e propozuara" items={preview.checklist.included} kind="in" />
          <ListBlock title="Nuk përfshihen" items={preview.checklist.excluded} kind="out" />
          <ListBlock title="Për t'u sqaruar" items={preview.checklist.clarify} kind="ask" />
          <div className="mt-8">
            <label htmlFor="priority" className={label}>
              Diçka që ka rëndësi të veçantë për ju? (opsionale)
            </label>
            <div className="mt-2 flex gap-2">
              <input
                id="priority"
                className={`${input} mt-0`}
                maxLength={120}
                value={priorityText}
                onChange={(e) => setPriorityText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    if (priorityText.trim()) setPriorities((p) => cleanPriorities([...p, priorityText]));
                    setPriorityText("");
                  }
                }}
              />
              <button
                type="button"
                className={ghostBtn}
                onClick={() => {
                  if (priorityText.trim()) setPriorities((p) => cleanPriorities([...p, priorityText]));
                  setPriorityText("");
                }}
              >
                Shto
              </button>
            </div>
            {priorities.length > 0 && (
              <ul className="mt-3 flex flex-wrap gap-2">
                {priorities.map((p) => (
                  <li key={p} className="inline-flex min-h-12 items-center gap-2 rounded-lg bg-bg-muted pl-4">
                    {p}
                    <button type="button" className="min-h-12 min-w-12 font-bold" aria-label={`Hiq: ${p}`} onClick={() => setPriorities((list) => list.filter((x) => x !== p))}>
                      ×
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
          {nav()}
        </section>
      )}

      {step === 4 && service && (
        <section>
          {heading("Kur ju përshtatet?")}
          {availability.mode === "loading" && <p className="mt-6">Po kontrollojmë datat…</p>}
          {availability.mode === "live" && (
            <div className="mt-6">
              <p className="text-text-muted">
                Zgjidhni një orar të lirë. Nëse është ende i lirë kur dërgoni kërkesën, e mbajmë përkohësisht ndërsa e shqyrtojmë. Pastrimi
                konfirmohet vetëm pasi të biem dakord.
              </p>
              {availability.days.length === 0 && <p className="mt-4 font-medium">Nuk ka orare të lira në ditët në vijim. Na shkruani në WhatsApp.</p>}
              <div className="mt-5 grid grid-cols-1 gap-5">
                {availability.days.map((d) => (
                  <fieldset key={d.date}>
                    <legend className="font-semibold">{d.label}</legend>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {d.times.map((t) => (
                        <label key={t} className={chip}>
                          <input type="radio" name="slot" className="sr-only" checked={slot?.date === d.date && slot.time === t} onChange={() => setSlot({ date: d.date, time: t })} />
                          {t}
                        </label>
                      ))}
                    </div>
                  </fieldset>
                ))}
              </div>
            </div>
          )}
          {(availability.mode === "preferred" || availability.mode === "error") && (
            <div className="mt-6">
              <p className="rounded-lg bg-bg-muted p-4">
                {availability.mode === "preferred" && availability.reason === "calendar-unavailable"
                  ? "Kalendari nuk u kontrollua dot tani. "
                  : ""}
                Zgjidhni një datë që ju përshtatet. Është <strong>datë e preferuar</strong>: nuk mbahet. Datën dhe orën i konfirmojmë bashkë.
              </p>
              <label htmlFor="preferred" className={`${label} mt-5`}>
                Data e preferuar (opsionale)
              </label>
              <input
                id="preferred"
                type="date"
                className={`${input} max-w-64`}
                min={availability.mode === "preferred" ? availability.minDate : undefined}
                max={availability.mode === "preferred" ? availability.maxDate : undefined}
                value={preferredDate}
                onChange={(e) => setPreferredDate(e.target.value)}
              />
            </div>
          )}
          <label className={`${chip} mt-6`}>
            <input
              type="checkbox"
              className="sr-only"
              checked={!slot && !preferredDate}
              onChange={() => {
                setSlot(null);
                setPreferredDate("");
              }}
            />
            Pa datë tani, e sqarojmë në telefon
          </label>
          {nav()}
        </section>
      )}

      {step === 5 && service && preview && (
        <section>
          {heading("Kontakti dhe dërgimi")}
          <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <label htmlFor="b-name" className={label}>
                Emri
              </label>
              <input id="b-name" autoComplete="name" className={input} value={name} maxLength={80} onChange={(e) => setName(e.target.value)} aria-invalid={!!errors.name} />
              {errors.name && <p className="mt-2 font-medium text-red-700">{errors.name}</p>}
            </div>
            <div>
              <label htmlFor="b-phone" className={label}>
                Numri i telefonit
              </label>
              <input id="b-phone" type="tel" inputMode="tel" autoComplete="tel" className={input} value={phone} maxLength={25} onChange={(e) => setPhone(e.target.value)} aria-invalid={!!errors.phone} />
              {errors.phone && <p className="mt-2 font-medium text-red-700">{errors.phone}</p>}
            </div>
          </div>
          <fieldset className="mt-6">
            <legend className={label}>Ku t&apos;ju kontaktojmë?</legend>
            <div className="mt-3 flex gap-2">
              {[
                ["WHATSAPP", "WhatsApp"],
                ["TELEFON", "Telefonatë"],
              ].map(([v, l]) => (
                <label key={v} className={chip}>
                  <input type="radio" name="channel" className="sr-only" checked={channel === v} onChange={() => setChannel(v)} />
                  {l}
                </label>
              ))}
            </div>
          </fieldset>
          <div className="mt-6">
            <label htmlFor="b-note" className={label}>
              Shënim (opsional)
            </label>
            <textarea id="b-note" rows={3} maxLength={1500} className={input} value={note} onChange={(e) => setNote(e.target.value)} />
          </div>
          <div aria-hidden className="absolute -left-[9999px] h-px w-px overflow-hidden">
            <label htmlFor="b-website">Mos e plotësoni</label>
            <input id="b-website" tabIndex={-1} autoComplete="off" value={honeypot} onChange={(e) => setHoneypot(e.target.value)} />
          </div>

          <div className="mt-8 rounded-lg bg-bg-muted p-5">
            <h3 className="text-lg font-bold">Përmbledhja</h3>
            <dl className="mt-3 grid grid-cols-1 gap-1">
              <div className="flex flex-wrap gap-x-2">
                <dt className="text-text-muted">Shërbimi:</dt>
                <dd className="font-medium">{services[service].label}</dd>
              </div>
              <div className="flex flex-wrap gap-x-2">
                <dt className="text-text-muted">Çmimi:</dt>
                <dd className="font-medium">
                  {preview.estimate.kind === "indicative" ? `${preview.estimate.amountText} (vlerësim orientues)` : "Përcaktohet pas vlerësimit"}
                </dd>
              </div>
              <div className="flex flex-wrap gap-x-2">
                <dt className="text-text-muted">Data:</dt>
                <dd className="font-medium">
                  {slot ? `${formatDateSq(slot.date)}, ora ${slot.time}` : preferredDate ? `${formatDateSq(preferredDate)} (e preferuar, nuk mbahet)` : "Pa datë"}
                </dd>
              </div>
              <div className="flex flex-wrap gap-x-2">
                <dt className="text-text-muted">Foto/video:</dt>
                <dd className="font-medium">{uploads.filter((u) => u.status === "ready").length}</dd>
              </div>
            </dl>
          </div>
          <p className="mt-6">
            Kërkesa juaj shkon për shqyrtim. Çmimi dhe lista e punëve janë paraprake. Pastrimi konfirmohet pasi të biem dakord për vendndodhjen,
            punët, çmimin dhe datën.
          </p>
          <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
            <button type="button" className={ghostBtn} onClick={() => go(4)}>
              Mbrapa
            </button>
            <button type="button" className={primaryBtn} onClick={submit} disabled={submitting}>
              {submitting ? "Po dërgohet…" : "Dërgo kërkesën për shqyrtim"}
            </button>
          </div>
          <p className="mt-3 text-sm text-text-muted">
            Numrin e përdorim vetëm për këtë kërkesë.{" "}
            <Link href="/privatesia" className="underline underline-offset-4">
              Politika e privatësisë
            </Link>
          </p>
        </section>
      )}
    </div>
  );
}
