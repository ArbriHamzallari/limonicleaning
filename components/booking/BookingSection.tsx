"use client";

import { useEffect, useMemo, useRef, useState, type KeyboardEvent, type ReactNode } from "react";
import Link from "next/link";
import { WhatsAppButton } from "../WhatsAppButton";
import { PhoneButton } from "../PhoneButton";
import { DisplayHeading } from "../DisplayHeading";
import {
  estimateFor,
  isQuestionVisible,
  serviceKeys,
  services,
  type AnswerValue,
  type Answers,
  type ServiceKey,
} from "@/lib/booking/catalog";
import { loadAvailability, type Availability } from "@/lib/booking/availability-client";
import { isSelectable, monthGrid, monthLabelSq, monthOf, moveDay, addMonths, weekdaysSq, type DayRule } from "@/lib/booking/calendar";
import { dateFieldsFor, preferredTimeLabel, preferredTimes, type DatePick } from "@/lib/booking/preferred-time";
import { formatDateSq } from "@/lib/booking/time";
import { newId } from "@/lib/booking/client-id";
import { normalizePhone } from "@/lib/phone";
import { currentAttribution } from "@/lib/attribution";
import { trackEvent } from "@/lib/analytics";
import { isPageKey } from "@/lib/service-index";
import { QuestionField, chip, ghostBtn, input, label, primaryBtn } from "./fields";

const STEPS = ["Shërbimi", "Data dhe ora", "Të dhënat", "Kontrolli"];
const zones = [
  { value: "tirane", label: "Tiranë" },
  { value: "kamez", label: "Kamëz" },
  { value: "durres", label: "Durrës" },
  { value: "tjeter", label: "Tjetër" },
];

type Load = { state: "idle" | "loading" | "error" } | { state: "ready"; data: Availability };
/** What the visitor picked on the date step. `time` is a clock time for live/demo days, else a time of day. */
type When = DatePick;

/** Move focus to the first control the shown errors describe, so keyboard and screen reader users land on it. */
function focusFirstError() {
  requestAnimationFrame(() => {
    const root = document.getElementById("rezervo");
    const target = root?.querySelector<HTMLElement>('[aria-invalid="true"], [aria-describedby$="-err"]');
    if (!target) return;
    const control = target.matches("input, select, textarea, button")
      ? target
      : target.querySelector<HTMLElement>('input:not([type="hidden"]), select, textarea, [tabindex="0"]');
    (control ?? target).focus();
  });
}

function errorText(id: string, text?: string) {
  return text ? (
    <p id={id} className="mt-2 font-medium text-red-700">
      {text}
    </p>
  ) : null;
}

interface MonthCalendarProps {
  rule: DayRule;
  selected?: string;
  onSelect: (ymd: string) => void;
  /** Id of the error text that describes the grid, when there is one. */
  describedBy?: string;
}

// Month grid with one tab stop (roving tabindex): arrows move by day or week, Home/End to the
// week's ends, PageUp/PageDown by month. Days outside the range or without free times stay
// focusable but are marked aria-disabled, so a screen reader hears why they can't be chosen.
function MonthCalendar({ rule, selected, onSelect, describedBy }: MonthCalendarProps) {
  const start = selected ?? (rule.open ? ([...rule.open].sort()[0] ?? rule.min) : rule.min);
  const [month, setMonth] = useState(monthOf(start));
  const [focusDay, setFocusDay] = useState(start);
  const grid = useRef<HTMLTableElement>(null);
  const moved = useRef(false);

  useEffect(() => {
    if (!moved.current) return;
    moved.current = false;
    grid.current?.querySelector<HTMLButtonElement>(`[data-day="${focusDay}"]`)?.focus();
  }, [focusDay, month]);

  const firstMonth = monthOf(rule.min);
  const lastMonth = monthOf(rule.max);

  function onKey(e: KeyboardEvent<HTMLTableElement>) {
    const next = moveDay(focusDay, e.key, rule);
    if (!next) return;
    e.preventDefault();
    moved.current = true;
    setFocusDay(next);
    setMonth(monthOf(next));
  }

  function showMonth(n: number) {
    const m = addMonths(month, n);
    setMonth(m);
    const days = monthGrid(m)
      .flat()
      .filter((d): d is string => !!d);
    // The tab stop stays inside the shown month, even when none of its days is free.
    const inRange = days.find((d) => d >= rule.min && d <= rule.max);
    setFocusDay(days.find((d) => isSelectable(d, rule)) ?? inRange ?? (n < 0 ? rule.min : rule.max));
  }

  const headingId = `cal-${month}`;
  return (
    // Bleeds to the card edge on phones so each day is at least 48px wide from 375px up.
    <div className="-mx-4 sm:mx-0">
      <div className="flex items-center justify-between gap-2 px-1">
        <button type="button" className={`${ghostBtn} min-w-12 px-4`} onClick={() => showMonth(-1)} disabled={month <= firstMonth} aria-label="Muaji i kaluar">
          <span aria-hidden>‹</span>
        </button>
        <h4 id={headingId} className="text-lg font-bold first-letter:uppercase" aria-live="polite">
          {monthLabelSq(month)}
        </h4>
        <button type="button" className={`${ghostBtn} min-w-12 px-4`} onClick={() => showMonth(1)} disabled={month >= lastMonth} aria-label="Muaji tjetër">
          <span aria-hidden>›</span>
        </button>
      </div>
      <table ref={grid} role="grid" aria-labelledby={headingId} aria-describedby={describedBy} className="mt-3 w-full table-fixed border-collapse" onKeyDown={onKey}>
        <thead>
          <tr>
            {weekdaysSq.map((w) => (
              <th key={w.short} scope="col" abbr={w.long} className="pb-2 text-center text-sm font-semibold text-text-muted">
                {w.short}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {monthGrid(month).map((week, i) => (
            <tr key={i}>
              {week.map((d, j) =>
                d ? (
                  <td key={d} className="p-0">
                    {(() => {
                      const ok = isSelectable(d, rule);
                      const isSel = d === selected;
                      const status = !ok ? (rule.open && d >= rule.min && d <= rule.max ? ", nuk ka orare të lira" : ", nuk mund të zgjidhet") : "";
                      return (
                        <button
                          type="button"
                          data-day={d}
                          tabIndex={d === focusDay ? 0 : -1}
                          aria-disabled={!ok || undefined}
                          aria-pressed={isSel}
                          aria-label={`${formatDateSq(d)}${status}`}
                          onClick={() => {
                            setFocusDay(d);
                            if (ok) onSelect(d);
                          }}
                          className={`group block h-12 w-full rounded-lg p-0.5 text-base font-semibold focus-visible:outline-3 focus-visible:outline-offset-0 focus-visible:outline-primary ${!ok ? "cursor-not-allowed" : ""}`}
                        >
                          <span
                            className={`flex h-full w-full items-center justify-center rounded-lg ${
                              isSel
                                ? "bg-primary text-white"
                                : ok
                                  ? "border-2 border-border bg-bg text-text group-hover:border-primary"
                                  : "text-text-muted/60 line-through decoration-1"
                            }`}
                          >
                            {Number(d.slice(8))}
                          </span>
                        </button>
                      );
                    })()}
                  </td>
                ) : (
                  <td key={`e${j}`} />
                ),
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

interface BookingSectionProps {
  /** Service of the page: preselected, the visitor can still change it. */
  preset?: ServiceKey;
  title?: ReactNode;
  intro?: ReactNode;
}

// The booking request at the bottom of each marketing page (#rezervo). Four short steps:
// service, date and time, details, check and send. It sends to POST /api/kerkesa like the full
// flow on /kerko-oferte (which keeps photos and the detailed questions). Nothing here is a
// confirmed booking: the owner reviews every request, and while live holds are off the date is
// only a preference.
export function BookingSection({ preset, title = "Rezervoni pastrimin", intro }: BookingSectionProps) {
  const [step, setStep] = useState(preset ? 1 : 0);
  const [service, setService] = useState<ServiceKey | undefined>(preset);
  const [load, setLoad] = useState<Load>({ state: "idle" });
  const [when, setWhen] = useState<When>({ kind: "none" });
  const [answers, setAnswers] = useState<Answers>({});
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [zone, setZone] = useState("");
  const [areaDetail, setAreaDetail] = useState("");
  const [channel, setChannel] = useState("WHATSAPP");
  const [note, setNote] = useState("");
  const [honeypot, setHoneypot] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);

  const clientRequestId = useRef("");
  // What the last attempt sent. A retry with the same content reuses clientRequestId (the server
  // returns the request it may already have saved); changed content gets a new id, so the edits
  // are never silently replaced by the earlier version.
  const lastAttempt = useRef("");
  const startedAt = useRef(0);
  const started = useRef(false);
  const stepHeading = useRef<HTMLHeadingElement>(null);
  const dateStep = useRef<HTMLDivElement>(null);
  const firstRender = useRef(true);

  useEffect(() => {
    clientRequestId.current = newId();
    startedAt.current = Date.now();
  }, []);

  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    stepHeading.current?.focus({ preventScroll: true });
    stepHeading.current?.scrollIntoView({ block: "start" });
  }, [step]);

  // Availability is fetched only once the date step is actually on screen.
  useEffect(() => {
    if (step !== 1 || !service || load.state !== "idle") return;
    const el = dateStep.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();
        fetchAvailability(service);
      },
      { rootMargin: "200px" },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [step, service, load.state]);

  function fetchAvailability(s: ServiceKey, refresh = false) {
    setLoad({ state: "loading" });
    loadAvailability(s, { refresh }).then(
      (data) => setLoad({ state: "ready", data }),
      () => setLoad({ state: "error" }),
    );
  }

  const data = load.state === "ready" ? load.data : undefined;
  const rule = useMemo<DayRule | undefined>(() => {
    if (!data) return undefined;
    if (data.mode === "preferred") return { min: data.minDate, max: data.maxDate };
    if (data.mode === "demo") return { min: data.minDate, max: data.maxDate, open: new Set(data.days.map((d) => d.date)) };
    if (!data.days.length) return undefined;
    return { min: data.days[0].date, max: data.days[data.days.length - 1].date, open: new Set(data.days.map((d) => d.date)) };
  }, [data]);
  const clockTimes = data && data.mode !== "preferred" && when.kind === "day" ? (data.days.find((d) => d.date === when.date)?.times ?? []) : [];

  const def = service ? services[service] : undefined;
  // Required choices, the area, and for deep cleaning the condition: "after works" withholds the
  // indicative m² number (estimateFor), so it has to be asked before an estimate is shown.
  const questions = def
    ? def.questions.filter(
        (q) =>
          ((q.type === "choice" && q.required) || q.type === "area" || (service === "me-themel" && q.id === "condition")) &&
          isQuestionVisible(q, answers),
      )
    : [];
  const outsideTirana = zone !== "" && zone !== "tirane";
  const estimate = service ? estimateFor(service, answers, { outsideTirana }) : undefined;

  function chooseService(k: ServiceKey) {
    if (k === service) return;
    setService(k);
    setAnswers({});
    setWhen({ kind: "none" });
    setLoad({ state: "idle" });
  }

  function validate(s: number): boolean {
    const next: Record<string, string> = {};
    if (s === 0 && !service) next.service = "Zgjidhni një shërbim.";
    if (s === 1) {
      if (when.kind === "none") next.when = "Zgjidhni një datë, ose zgjidhni që datën ta sqarojmë në telefon.";
      else if (when.kind === "day" && !when.time) next.when = data?.mode === "preferred" ? "Zgjidhni pjesën e ditës." : "Zgjidhni një orë.";
    }
    if (s === 2) {
      if (name.trim().length < 2) next.name = "Shkruani emrin me të paktën dy shkronja.";
      if (!normalizePhone(phone)) next.phone = "Numri nuk duket i saktë. Kontrolloni numrin dhe provoni përsëri.";
      if (!zone) next.zone = "Zgjidhni zonën.";
      if (email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) next.email = "Email-i nuk duket i saktë.";
      for (const q of questions) if (q.type === "choice" && !answers[q.id]) next[`q-${q.id}`] = "Zgjidhni një përgjigje.";
    }
    setErrors(next);
    const ok = Object.keys(next).length === 0;
    if (!ok) focusFirstError();
    return ok;
  }

  function go(to: number) {
    setFormError("");
    if (to > step && !validate(step)) return;
    if (!started.current && to > step) {
      started.current = true;
      trackEvent("form_start", { service: service ?? "pa-zgjedhur", placement: "booking_section" });
    }
    setStep(to);
  }

  async function submit() {
    if (submitting || !service || !validate(2)) return;
    if (navigator.onLine === false) {
      setFormError("Nuk jeni të lidhur me internetin. Kërkesa nuk u dërgua; të dhënat janë ende këtu.");
      return;
    }
    setSubmitting(true);
    setFormError("");
    const utm = currentAttribution();
    const demo = data?.mode === "demo";
    const { slot, preferredDate, preferredTime } = dateFieldsFor(data?.mode, when);
    const content = {
      service,
      answers,
      note,
      name,
      phone,
      channel,
      email: email.trim() || undefined,
      zone,
      areaDetail,
      slot,
      preferredDate,
      preferredTime,
    };
    const fingerprint = JSON.stringify(content);
    if (lastAttempt.current && lastAttempt.current !== fingerprint) clientRequestId.current = newId();
    lastAttempt.current = fingerprint;
    try {
      const res = await fetch("/api/kerkesa", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        signal: AbortSignal.timeout(20000),
        body: JSON.stringify({
          ...content,
          clientRequestId: clientRequestId.current,
          pagePath: window.location.pathname,
          utmSource: utm.utm_source,
          utmCampaign: utm.utm_campaign,
          website: honeypot,
          startedAt: startedAt.current,
          demo: demo || undefined,
        }),
      });
      const body = await res.json().catch(() => ({}));
      if (res.ok && body.ok) {
        trackEvent("lead_submitted", { service, placement: "booking_section" });
        if (body.statusUrl) {
          // Full page load, never router.push: see isPrivatePath in lib/analytics.ts.
          window.location.assign(body.statusUrl);
          return;
        }
        clientRequestId.current = newId();
        lastAttempt.current = "";
        setSent(true);
        return;
      }
      trackEvent("lead_failed", { reason: `http_${res.status}`, placement: "booking_section" });
      if (res.status === 409 || body.fieldErrors?.preferredDate) {
        setWhen({ kind: "none" });
        fetchAvailability(service, true);
        setStep(1);
        setFormError(body.error ?? "Ky orar nuk është më i lirë. Zgjidhni një tjetër.");
      } else if (body.answerErrors) {
        const next: Record<string, string> = {};
        for (const [k, v] of Object.entries(body.answerErrors as Record<string, string>)) next[`q-${k}`] = v;
        setErrors(next);
        setStep(2);
        setFormError(body.error ?? "Plotësoni pyetjet e shënuara.");
      } else if (body.fieldErrors) {
        setErrors(body.fieldErrors);
        setStep(2);
        setFormError(body.error ?? "Kontrolloni fushat e shënuara.");
      } else setFormError(body.error ?? "Kërkesa nuk u dërgua. Provoni përsëri ose na shkruani në WhatsApp.");
    } catch {
      setFormError("Kërkesa nuk u dërgua (lidhja u ndërpre). Provoni përsëri: e njëjta kërkesa nuk krijohet dy herë.");
    } finally {
      setSubmitting(false);
    }
  }

  const whenText =
    when.kind === "day"
      ? data?.mode === "live"
        ? `${formatDateSq(when.date)}, ora ${when.time}`
        : `${formatDateSq(when.date)}${when.time ? `, ${(data?.mode === "demo" ? `ora ${when.time}` : (preferredTimeLabel(when.time) ?? "")).toLowerCase()}` : ""} (e preferuar, nuk mbahet)`
      : "Pa datë, e sqarojmë në telefon";

  const stepTitle = (text: string) => (
    <div>
      <p className="text-base font-semibold text-text-muted">
        Hapi {step + 1} nga {STEPS.length}
      </p>
      <h3 ref={stepHeading} tabIndex={-1} className="mt-1 scroll-mt-24 text-2xl font-extrabold tracking-tight">
        {text}
      </h3>
    </div>
  );

  const nav = (nextLabel = "Vazhdo") => (
    <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
      {step > 0 ? (
        <button type="button" className={ghostBtn} onClick={() => go(step - 1)}>
          Mbrapa
        </button>
      ) : (
        <span />
      )}
      <button type="button" className={primaryBtn} onClick={() => go(step + 1)}>
        {nextLabel}
      </button>
    </div>
  );

  return (
    <section id="rezervo" data-lead-form aria-labelledby="rezervo-title" className="scroll-mt-16 bg-bg-muted py-14 sm:py-20">
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <DisplayHeading id="rezervo-title" size="md">
          <span data-lead-form-anchor tabIndex={-1} className="scroll-mt-24 outline-none lg:scroll-mt-28">
            {title}
          </span>
        </DisplayHeading>
        <div className="mt-3 max-w-2xl text-lg text-text-muted">
          {intro ?? "Zgjidhni shërbimin dhe datën që ju përshtatet. E shohim kërkesën dhe ju kontaktojmë për ta konfirmuar bashkë."}
        </div>

        <div className="mt-8 min-w-0 rounded-xl border border-border bg-bg p-4 sm:p-8">
          {sent ? (
            <div role="status">
              <h3 className="text-2xl font-extrabold tracking-tight">Kërkesa u dërgua</h3>
              <p className="mt-2">E shohim dhe ju kontaktojmë së shpejti. Pastrimi konfirmohet vetëm pasi të biem dakord për punët, çmimin dhe datën.</p>
            </div>
          ) : (
            <>
              <ol className="mb-6 grid grid-cols-4 gap-1" aria-label="Hapat">
                {STEPS.map((s, i) => (
                  <li key={s} aria-current={i === step ? "step" : undefined}>
                    <span className={`block h-1.5 rounded-full ${i <= step ? "bg-primary" : "bg-border"}`} />
                    <span className={`mt-2 hidden text-sm sm:block ${i === step ? "font-semibold text-text" : "text-text-muted"}`}>{s}</span>
                    <span className="sr-only sm:hidden">{s}</span>
                  </li>
                ))}
              </ol>

              {formError && (
                <div role="alert" className="mb-6 rounded-lg border-2 border-red-700/30 bg-red-50 p-4 font-medium text-red-800">
                  {formError}
                </div>
              )}

              {step > 0 && service && (
                <p className="mb-6 flex flex-wrap items-center gap-x-3 gap-y-1 rounded-lg bg-bg-muted px-4 py-2">
                  <span>
                    <span className="text-text-muted">Shërbimi: </span>
                    <strong>{services[service].label}</strong>
                  </span>
                  <button type="button" className="inline-flex min-h-12 items-center font-semibold text-primary underline underline-offset-4" onClick={() => go(0)}>
                    Ndrysho
                  </button>
                </p>
              )}

              {step === 0 && (
                <div>
                  {stepTitle("Çfarë pastrimi ju duhet?")}
                  <fieldset className="mt-6" aria-describedby={errors.service ? "bs-service-err" : undefined}>
                    <legend className="sr-only">Shërbimi</legend>
                    <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                      {serviceKeys.map((k) => (
                        <label
                          key={k}
                          className="flex min-h-14 cursor-pointer items-center gap-3 rounded-lg border-2 border-border px-4 py-3 has-checked:border-primary has-checked:bg-bg-warm has-focus-visible:outline-3 has-focus-visible:outline-primary"
                        >
                          <input type="radio" name="bs-service" className="h-5 w-5 shrink-0 accent-[#184A2C]" checked={service === k} onChange={() => chooseService(k)} />
                          <span className="text-lg font-semibold">{services[k].label}</span>
                        </label>
                      ))}
                    </div>
                    {errorText("bs-service-err", errors.service)}
                  </fieldset>
                  {nav()}
                </div>
              )}

              {step === 1 && service && (
                <div ref={dateStep}>
                  {stepTitle("Kur ju përshtatet?")}
                  <div className="mt-6" aria-busy={load.state !== "ready" && load.state !== "error"}>
                    {(load.state === "idle" || load.state === "loading") && (
                      <div>
                        <p className="sr-only" role="status">
                          Po ngarkohen datat.
                        </p>
                        <div aria-hidden className="grid animate-pulse grid-cols-7 gap-1">
                          {Array.from({ length: 35 }, (_, i) => (
                            <span key={i} className="h-12 rounded-lg bg-bg-muted" />
                          ))}
                        </div>
                      </div>
                    )}

                    {load.state === "error" && (
                      <div className="rounded-lg bg-bg-muted p-4">
                        <p className="font-medium">Datat nuk u ngarkuan dot.</p>
                        <div className="mt-3 flex flex-wrap gap-3">
                          <button type="button" className={ghostBtn} onClick={() => fetchAvailability(service, true)}>
                            Provo sërish
                          </button>
                          <WhatsAppButton service={isPageKey(service) ? service : undefined} placement="booking_section_error" variant="outline">
                            Na shkruani në WhatsApp
                          </WhatsAppButton>
                        </div>
                      </div>
                    )}

                    {data?.mode === "demo" && (
                      <p className="mb-4 rounded-lg border-2 border-dashed border-text-muted p-3 font-semibold">
                        Orare demo, vetëm në zhvillim. Nuk janë orare të vërteta dhe nuk mbahet asgjë.
                      </p>
                    )}
                    {data?.mode === "preferred" && (
                      <p className="mb-4 text-text-muted">
                        {data.reason === "calendar-unavailable" ? "Kalendari nuk u kontrollua dot tani. " : ""}
                        Zgjidhni datën që ju përshtatet. Është <strong className="text-text">datë e preferuar</strong>: nuk mbahet. Datën dhe orën i konfirmojmë bashkë.
                      </p>
                    )}
                    {data?.mode === "live" && (
                      <p className="mb-4 text-text-muted">
                        {data.days.length
                          ? "Ditët me orare të lira janë të theksuara. Nëse orari është ende i lirë kur dërgoni kërkesën, e mbajmë përkohësisht ndërsa e shqyrtojmë."
                          : "Nuk ka orare të lira në ditët në vijim. Zgjidhni që datën ta sqarojmë në telefon, ose na shkruani në WhatsApp."}
                      </p>
                    )}

                    {rule && (
                      <MonthCalendar
                        key={`${service}-${data?.mode}`}
                        rule={rule}
                        selected={when.kind === "day" ? when.date : undefined}
                        describedBy={errors.when && when.kind === "none" ? "bs-when-err" : undefined}
                        onSelect={(d) => {
                          setWhen({ kind: "day", date: d });
                          setErrors({});
                        }}
                      />
                    )}

                    {when.kind === "day" && data && (
                      <fieldset className="mt-6" aria-describedby={errors.when ? "bs-when-err" : undefined}>
                        <legend className={label}>
                          {data.mode === "preferred" ? "Cila pjesë e ditës?" : "Ora"} <span className="font-normal text-text-muted">({formatDateSq(when.date)})</span>
                        </legend>
                        <div className="mt-3 flex flex-wrap gap-2">
                          {(data.mode === "preferred" ? preferredTimes.map((t) => ({ value: t.value as string, label: t.label as string })) : clockTimes.map((t) => ({ value: t, label: t }))).map((t) => (
                            <label key={t.value} className={chip}>
                              <input type="radio" name="bs-time" className="sr-only" checked={when.time === t.value} onChange={() => setWhen({ ...when, time: t.value })} />
                              {t.label}
                            </label>
                          ))}
                        </div>
                      </fieldset>
                    )}

                    {load.state !== "idle" && load.state !== "loading" && (
                      <label className={`${chip} mt-6`}>
                        <input type="checkbox" className="sr-only" checked={when.kind === "later"} onChange={(e) => setWhen(e.target.checked ? { kind: "later" } : { kind: "none" })} />
                        Pa datë tani, e sqarojmë në telefon
                      </label>
                    )}
                    {errorText("bs-when-err", errors.when)}
                  </div>
                  {nav()}
                </div>
              )}

              {step === 2 && service && (
                <div>
                  {stepTitle("Të dhënat tuaja")}
                  <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <div>
                      <label htmlFor="bs-name" className={label}>
                        Emri
                      </label>
                      <input id="bs-name" autoComplete="name" className={input} value={name} maxLength={80} onChange={(e) => setName(e.target.value)} aria-invalid={!!errors.name} aria-describedby={errors.name ? "bs-name-err" : undefined} />
                      {errorText("bs-name-err", errors.name)}
                    </div>
                    <div>
                      <label htmlFor="bs-phone" className={label}>
                        Numri i telefonit
                      </label>
                      <input id="bs-phone" type="tel" inputMode="tel" autoComplete="tel" className={input} value={phone} maxLength={25} onChange={(e) => setPhone(e.target.value)} aria-invalid={!!errors.phone} aria-describedby={errors.phone ? "bs-phone-err" : undefined} />
                      {errorText("bs-phone-err", errors.phone)}
                    </div>
                  </div>

                  <fieldset className="mt-6" aria-describedby={errors.zone ? "bs-zone-err" : undefined}>
                    <legend className={label}>Ku ndodhet prona?</legend>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {zones.map((z) => (
                        <label key={z.value} className={chip}>
                          <input type="radio" name="bs-zone" className="sr-only" checked={zone === z.value} onChange={() => setZone(z.value)} />
                          {z.label}
                        </label>
                      ))}
                    </div>
                    {errorText("bs-zone-err", errors.zone)}
                  </fieldset>
                  <div className="mt-6">
                    <label htmlFor="bs-area" className={label}>
                      Lagjja ose adresa <span className="font-normal text-text-muted">(opsionale)</span>
                    </label>
                    <input id="bs-area" autoComplete="street-address" className={input} maxLength={120} value={areaDetail} onChange={(e) => setAreaDetail(e.target.value)} />
                  </div>

                  {questions.length > 0 && (
                    <div className="mt-6 grid grid-cols-1 gap-6">
                      {questions.map((q) => (
                        <QuestionField key={q.id} q={q} value={answers[q.id]} onChange={(v: AnswerValue) => setAnswers((a) => ({ ...a, [q.id]: v }))} error={errors[`q-${q.id}`]} />
                      ))}
                    </div>
                  )}

                  <div className="mt-6">
                    <label htmlFor="bs-note" className={label}>
                      Shënime <span className="font-normal text-text-muted">(opsionale)</span>
                    </label>
                    <textarea id="bs-note" rows={3} maxLength={1500} className={input} value={note} onChange={(e) => setNote(e.target.value)} />
                  </div>
                  <div className="mt-6">
                    <label htmlFor="bs-email" className={label}>
                      Email <span className="font-normal text-text-muted">(opsional)</span>
                    </label>
                    <input id="bs-email" type="email" inputMode="email" autoComplete="email" className={input} maxLength={120} value={email} onChange={(e) => setEmail(e.target.value)} aria-invalid={!!errors.email} aria-describedby={errors.email ? "bs-email-err" : undefined} />
                    {errorText("bs-email-err", errors.email)}
                  </div>
                  <fieldset className="mt-6">
                    <legend className={label}>Ku t&apos;ju kontaktojmë?</legend>
                    <div className="mt-3 flex gap-2">
                      {[
                        ["WHATSAPP", "WhatsApp"],
                        ["TELEFON", "Telefonatë"],
                      ].map(([v, l]) => (
                        <label key={v} className={chip}>
                          <input type="radio" name="bs-channel" className="sr-only" checked={channel === v} onChange={() => setChannel(v)} />
                          {l}
                        </label>
                      ))}
                    </div>
                  </fieldset>
                  <div aria-hidden className="absolute -left-[9999px] h-px w-px overflow-hidden">
                    <label htmlFor="bs-website">Mos e plotësoni</label>
                    <input id="bs-website" tabIndex={-1} autoComplete="off" value={honeypot} onChange={(e) => setHoneypot(e.target.value)} />
                  </div>
                  <p className="mt-6 text-text-muted">
                    Doni të dërgoni foto ose t&apos;u përgjigjeni më shumë pyetjeve?{" "}
                    <Link href={`/kerko-oferte?sherbimi=${service}`} className="font-semibold text-primary underline underline-offset-4">
                      Përdorni formularin e plotë
                    </Link>
                    .
                  </p>
                  {nav()}
                </div>
              )}

              {step === 3 && service && (
                <div>
                  {stepTitle("Kontrolloni dhe dërgoni")}
                  <dl className="mt-6 grid grid-cols-1 gap-3 rounded-lg bg-bg-muted p-5">
                    {[
                      ["Shërbimi", services[service].label],
                      ["Data dhe ora", whenText],
                      ["Emri", name.trim()],
                      ["Telefoni", phone.trim()],
                      ["Zona", [zones.find((z) => z.value === zone)?.label, areaDetail.trim()].filter(Boolean).join(", ")],
                      ...(email.trim() ? [["Email", email.trim()]] : []),
                      ["Çmimi", estimate?.kind === "indicative" ? `${estimate.amountText} (vlerësim orientues)` : "Përcaktohet pas vlerësimit"],
                    ].map(([k, v]) => (
                      <div key={k} className="grid grid-cols-1 gap-x-3 sm:grid-cols-[10rem_1fr]">
                        <dt className="text-text-muted">{k}</dt>
                        <dd className="font-semibold break-words">{v}</dd>
                      </div>
                    ))}
                  </dl>
                  <p className="mt-6">
                    Kërkesa shkon për shqyrtim. Pastrimi konfirmohet pasi të biem dakord për punët, çmimin dhe datën.
                  </p>
                  <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
                    <button type="button" className={ghostBtn} onClick={() => go(2)}>
                      Mbrapa
                    </button>
                    <button type="button" className={primaryBtn} onClick={submit} disabled={submitting}>
                      {submitting ? "Po dërgohet…" : "Dërgo kërkesën"}
                    </button>
                  </div>
                  <p className="mt-3 text-sm text-text-muted">
                    Të dhënat i përdorim vetëm për këtë kërkesë.{" "}
                    <Link href="/privatesia" className="underline underline-offset-4">
                      Politika e privatësisë
                    </Link>
                  </p>
                </div>
              )}
            </>
          )}
        </div>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-6">
          <p className="text-text-muted">Preferoni të na shkruani ose të telefononi?</p>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
            <WhatsAppButton service={isPageKey(service) ? service : undefined} placement="booking_section_alt" variant="outline">
              WhatsApp
            </WhatsAppButton>
            <PhoneButton placement="booking_section_alt" variant="link" showIcon={false} className="text-lg font-bold">
              068 900 7252
            </PhoneButton>
          </div>
        </div>
      </div>
    </section>
  );
}
