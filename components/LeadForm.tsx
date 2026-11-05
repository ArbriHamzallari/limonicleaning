"use client";

import { useEffect, useId, useRef, useState, type FormEvent, type ReactNode } from "react";
import Link from "next/link";
import { Button } from "./Button";
import { WhatsAppButton } from "./WhatsAppButton";
import { PhoneButton } from "./PhoneButton";
import { InstallShortcut } from "./InstallShortcut";
import { normalizePhone } from "@/lib/phone";
import { trackEvent } from "@/lib/analytics";
import { currentAttribution } from "@/lib/attribution";
import { assessmentMethods, conditions, contactChannels, formFieldsFor, isValidPreferredDate, parseSize } from "@/lib/lead-form";
import { deepCleanEstimate, formatLek, DEEP_CLEAN_RATE_LEK } from "@/lib/quote";
import { assessmentBenefit, assessmentBenefitText } from "@/lib/assessment";
import {
  businessPropertyTypes,
  formPreset,
  frequencies,
  leadServiceChips,
  optionLabel,
  propertyTypes,
  serviceIndex,
  timings,
  type LeadService,
  type PageKey,
} from "@/lib/service-index";

interface LeadFormProps {
  /** The page the form sits on: preselects the service and/or property type. */
  page?: PageKey;
  /** Where the form sits, for analytics. */
  placement: string;
}

type FieldKey = "service" | "name" | "phone" | "sizeM2" | "preferredDate" | "form";
type FieldErrors = Partial<Record<FieldKey, string>>;

interface Draft {
  service: LeadService | "";
  propertyType: string;
  condition: string;
  size: string;
  sizeUnknown: boolean;
  priorities: string[];
  frequency: string;
  area: string;
  timing: string;
  preferredDate: string;
  assessmentMethod: string;
  name: string;
  phone: string;
  channel: string;
  businessName: string;
  message: string;
}

// Values survive client-side navigation (go to "Puna jonë", come back) and validation errors,
// in memory only: nothing personal is written to storage, and a reload starts clean.
const drafts = new Map<string, Draft>();

const serviceLabel = (value: LeadService) => (value === "tjeter" ? "Tjetër" : serviceIndex[value].chipLabel);
const serviceOptions = leadServiceChips.map((value) => ({ value, label: serviceLabel(value) }));

const FAILED = "Kërkesa nuk u dërgua. Provoni përsëri ose na shkruani në WhatsApp.";
const OFFLINE =
  "Nuk jeni të lidhur me internetin, prandaj kërkesa nuk u dërgua. Të dhënat që shkruat janë ende këtu: provoni sërish kur të keni lidhje, ose na telefononi.";
const SIZE_ERROR = "Shkruani vetëm një numër, për shembull, 80.";
const DATE_ERROR = "Zgjidhni një datë nga sot e tutje.";

const inputClasses =
  "mt-2 block min-h-12 w-full rounded-lg border-2 border-border bg-bg px-4 py-2 text-lg text-text focus:border-primary disabled:bg-bg-muted disabled:text-text-muted aria-[invalid=true]:border-red-700";
const labelClasses = "block text-lg font-semibold text-text";
const chipClasses =
  "inline-flex min-h-12 cursor-pointer items-center rounded-lg border-2 border-border bg-bg px-4 text-base font-medium text-text has-checked:border-primary has-checked:bg-primary has-checked:text-white has-focus-visible:outline-3 has-focus-visible:outline-offset-2 has-focus-visible:outline-primary";

function newRequestId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) return crypto.randomUUID();
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 12)}`;
}

function todayIso(offsetDays = 0) {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function FieldError({ id, children }: { id: string; children?: ReactNode }) {
  if (!children) return null;
  return (
    <p id={id} className="mt-2 font-medium text-red-700">
      {children}
    </p>
  );
}

/** Radio chips. Optional groups can be cleared by tapping the selected chip again. */
function ChipGroup({
  name,
  legend,
  hint,
  options,
  value,
  onChange,
  optional = false,
  errorId,
  error,
}: {
  name: string;
  legend: string;
  hint?: string;
  options: readonly { value: string; label: string }[];
  value: string;
  onChange: (value: string) => void;
  optional?: boolean;
  errorId?: string;
  error?: string;
}) {
  const hintId = `${name}-hint`;
  return (
    <fieldset aria-describedby={[error ? errorId : "", hint ? hintId : ""].filter(Boolean).join(" ") || undefined}>
      <legend className={labelClasses}>{legend}</legend>
      {hint && (
        <p id={hintId} className="mt-1 text-base text-text-muted">
          {hint}
        </p>
      )}
      <div className="mt-3 flex flex-wrap gap-2">
        {options.map((option) => (
          <label key={option.value} className={chipClasses}>
            <input
              type="radio"
              name={name}
              value={option.value}
              checked={value === option.value}
              onChange={() => onChange(option.value)}
              onClick={() => optional && value === option.value && onChange("")}
              className="sr-only"
            />
            {option.label}
          </label>
        ))}
      </div>
      {errorId && <FieldError id={errorId}>{error}</FieldError>}
    </fieldset>
  );
}

function CheckChips({
  name,
  legend,
  options,
  values,
  onChange,
}: {
  name: string;
  legend: string;
  options: readonly { value: string; label: string }[];
  values: string[];
  onChange: (values: string[]) => void;
}) {
  return (
    <fieldset>
      <legend className={labelClasses}>{legend}</legend>
      <div className="mt-3 flex flex-wrap gap-2">
        {options.map((option) => (
          <label key={option.value} className={chipClasses}>
            <input
              type="checkbox"
              name={name}
              value={option.value}
              checked={values.includes(option.value)}
              onChange={(e) =>
                onChange(e.target.checked ? [...values, option.value] : values.filter((v) => v !== option.value))
              }
              className="sr-only"
            />
            {option.label}
          </label>
        ))}
      </div>
    </fieldset>
  );
}

/** The indicative amount, only for deep cleaning, always labelled as indicative. */
function EstimatePanel({ estimate }: { estimate: ReturnType<typeof deepCleanEstimate> }) {
  let body: ReactNode;
  if (estimate.kind === "indicative") {
    body = (
      <>
        <p className="text-base text-text-muted">Vlerësim orientues</p>
        <p className="mt-1 text-2xl font-extrabold tracking-tight">
          {formatLek(estimate.totalLek)} lekë të reja
        </p>
        <p className="mt-1 text-base text-text-muted">
          {estimate.sizeM2} m² × {estimate.rateLek} lekë të reja. Nuk është totali përfundimtar: e konfirmojmë pas
          vlerësimit, sipas gjendjes së apartamentit dhe punëve që përfshihen.
        </p>
      </>
    );
  } else if (estimate.kind === "assessment" && estimate.reason === "property") {
    body = (
      <p className="text-base">
        Çmimi orientues prej {DEEP_CLEAN_RATE_LEK} lekë të reja/m² vlen vetëm për apartamente. Për shtëpitë dhe vilat
        ju japim planin dhe ofertën me shkrim pas vlerësimit.
      </p>
    );
  } else if (estimate.kind === "assessment") {
    body = (
      <p className="text-base">
        Pastrimi pas punimeve nuk llogaritet automatikisht me {DEEP_CLEAN_RATE_LEK} lekë të reja/m²: varet nga
        mbetjet që kanë mbetur. Totalin ua konfirmojmë pas vlerësimit, përpara se të rezervoni.
      </p>
    );
  } else if (estimate.kind === "needs-type") {
    body = (
      <p className="text-base">
        Zgjidhni më lart llojin e pronës. Për apartamente, çmimi orientues nis nga {DEEP_CLEAN_RATE_LEK} lekë të
        reja/m².
      </p>
    );
  } else {
    body = (
      <p className="text-base">
        {estimate.reason === "out-of-range"
          ? "Për këtë sipërfaqe çmimin e sqarojmë bashkë, pa llogaritje automatike."
          : estimate.reason === "unknown"
            ? "Nuk ka problem. Sipërfaqen e sqarojmë bashkë në telefon ose gjatë vlerësimit."
            : `Shkruani sipërfaqen për të parë një vlerësim orientues. Çmimi orientues nis nga ${DEEP_CLEAN_RATE_LEK} lekë të reja/m².`}
      </p>
    );
  }
  return (
    <div aria-live="polite" className="mt-4 rounded-lg border-l-4 border-accent bg-bg-warm p-4">
      {body}
    </div>
  );
}

export function LeadForm({ page, placement }: LeadFormProps) {
  const id = useId();
  const draftKey = `${placement}:${page ?? ""}`;
  const preset = formPreset(page);

  const initial: Draft = drafts.get(draftKey) ?? {
    service: preset.service ?? "",
    propertyType: preset.propertyType ?? "",
    condition: "",
    size: "",
    sizeUnknown: false,
    priorities: [],
    frequency: "",
    area: "",
    timing: "",
    preferredDate: "",
    assessmentMethod: "",
    name: "",
    phone: "",
    channel: "WHATSAPP",
    businessName: "",
    message: "",
  };

  const [d, setDraft] = useState<Draft>(initial);
  const set = <K extends keyof Draft>(key: K, value: Draft[K]) => setDraft((prev) => ({ ...prev, [key]: value }));
  const [choosingService, setChoosingService] = useState(!preset.service);
  const [detailsOpen, setDetailsOpen] = useState(
    () =>
      initial.priorities.length > 0 ||
      !!initial.message ||
      !!initial.assessmentMethod ||
      (!!initial.frequency && !formFieldsFor(initial.service).business),
  );
  const [honeypot, setHoneypot] = useState("");
  const [errors, setErrors] = useState<FieldErrors>({});
  const [status, setStatus] = useState<"idle" | "submitting" | "success">("idle");
  const [submitted, setSubmitted] = useState<{ name: string; channel: string } | null>(null);

  const startedAt = useRef(0);
  const started = useRef(false);
  const requestId = useRef("");
  const successRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const errorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    startedAt.current = Date.now();
    requestId.current = newRequestId();
  }, []);

  useEffect(() => {
    if (status !== "success") drafts.set(draftKey, d);
  }, [d, draftKey, status]);

  useEffect(() => {
    if (status === "success") successRef.current?.focus();
  }, [status]);

  useEffect(() => {
    if (errors.form) errorRef.current?.scrollIntoView({ block: "center" });
  }, [errors.form]);

  const fields = formFieldsFor(d.service);
  // A property type carried over from another service (e.g. "zyre") never counts for deep cleaning.
  const propertyType =
    fields.propertyOptions && !fields.propertyOptions.some((o) => o.value === d.propertyType) ? "" : d.propertyType;
  const showBusinessName =
    fields.business || (fields.propertyType && (businessPropertyTypes as readonly string[]).includes(d.propertyType));
  const sizeM2 = fields.size && !d.sizeUnknown ? parseSize(d.size) : undefined;
  const estimate = deepCleanEstimate({
    service: d.service || undefined,
    sizeM2: sizeM2 ?? undefined,
    sizeUnknown: d.sizeUnknown,
    condition: d.condition,
    propertyType: fields.propertyType ? propertyType : undefined,
  });
  const allowedPriorities = fields.priorities?.options.map((o) => o.value) ?? [];
  const priorities = d.priorities.filter((p) => allowedPriorities.includes(p));

  function onFirstInput() {
    if (started.current) return;
    started.current = true;
    trackEvent("form_start", { service: d.service || "pa-zgjedhur", placement });
  }

  function focusFirstError(next: FieldErrors) {
    const first = (["service", "sizeM2", "preferredDate", "name", "phone"] as const).find((k) => next[k]);
    if (!first) return;
    if (first === "service") setChoosingService(true);
    const selector = first === "service" ? `input[name="${id}-service"]` : `#${CSS.escape(`${id}-${first}`)}`;
    requestAnimationFrame(() => formRef.current?.querySelector<HTMLElement>(selector)?.focus());
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (status === "submitting") return;

    const next: FieldErrors = {};
    if (!d.service) next.service = "Zgjidhni llojin e pastrimit.";
    if (d.name.trim().length < 2) next.name = "Shkruani emrin me të paktën dy shkronja.";
    if (!normalizePhone(d.phone)) next.phone = "Numri nuk duket i saktë. Kontrolloni numrin dhe provoni përsëri.";
    if (sizeM2 === null) next.sizeM2 = SIZE_ERROR;
    if (d.timing === "date" && d.preferredDate && !isValidPreferredDate(d.preferredDate)) next.preferredDate = DATE_ERROR;
    setErrors(next);
    if (Object.keys(next).length) {
      focusFirstError(next);
      return;
    }

    if (typeof navigator !== "undefined" && navigator.onLine === false) {
      setErrors({ form: OFFLINE });
      trackEvent("lead_failed", { reason: "offline", placement });
      return;
    }

    setStatus("submitting");
    const utm = currentAttribution();

    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        signal: AbortSignal.timeout(15_000),
        body: JSON.stringify({
          service: d.service,
          name: d.name,
          phone: d.phone,
          propertyType: fields.propertyType ? propertyType || undefined : undefined,
          sizeM2: sizeM2 != null ? String(sizeM2) : undefined,
          sizeUnknown: fields.size ? d.sizeUnknown : false,
          condition: fields.condition ? d.condition || undefined : undefined,
          priorities,
          frequency: fields.frequency ? d.frequency || undefined : undefined,
          timing: d.timing || undefined,
          preferredDate: d.timing === "date" ? d.preferredDate || undefined : undefined,
          assessmentMethod: d.assessmentMethod || undefined,
          channel: d.channel,
          area: d.area,
          businessName: showBusinessName ? d.businessName : undefined,
          message: d.message,
          pagePath: window.location.pathname,
          utmSource: utm.utm_source,
          utmCampaign: utm.utm_campaign,
          clientRequestId: requestId.current,
          website: honeypot,
          startedAt: startedAt.current,
        }),
      });
      const data = (await res.json().catch(() => ({}))) as {
        error?: string;
        fieldErrors?: Record<string, string>;
      };

      if (!res.ok) {
        const fromServer: FieldErrors = {
          service: data.fieldErrors?.service,
          name: data.fieldErrors?.name,
          phone: data.fieldErrors?.phone,
          sizeM2: data.fieldErrors?.sizeM2,
        };
        const hasFieldError = Object.values(fromServer).some(Boolean);
        setErrors({ ...fromServer, form: hasFieldError ? undefined : (data.error ?? FAILED) });
        setStatus("idle");
        trackEvent("lead_failed", { reason: `http_${res.status}`, placement });
        if (hasFieldError) focusFirstError(fromServer);
        return;
      }

      trackEvent("lead_submitted", { service: d.service, placement });
      drafts.delete(draftKey);
      setSubmitted({ name: d.name.trim().split(/\s+/)[0], channel: d.channel });
      setStatus("success");
    } catch {
      // Network error or timeout. The same request id is kept, so if the first attempt did
      // reach the server, pressing the button again doesn't create a second lead.
      setErrors({ form: navigator.onLine === false ? OFFLINE : FAILED });
      setStatus("idle");
      trackEvent("lead_failed", { reason: "network", placement });
    }
  }

  if (status === "success" && submitted) {
    return (
      <div
        ref={successRef}
        tabIndex={-1}
        role="status"
        data-lead-form
        className="rounded-lg border-2 border-primary/20 bg-bg-warm p-6 text-text sm:p-8"
      >
        <p className="text-2xl font-bold">Faleminderit, {submitted.name}! E morëm kërkesën tuaj.</p>
        <p className="mt-3 font-semibold">Kjo është kërkesë për vlerësim, jo ende një pastrim i rezervuar.</p>
        <ol className="mt-4 grid gap-3">
          <li className="flex gap-3">
            <span aria-hidden className="font-extrabold text-primary">1</span>
            <span>
              Ju kontaktojmë {submitted.channel === "TELEFON" ? "me telefon" : "në WhatsApp"} për të sqaruar çfarë ju
              duhet.
            </span>
          </li>
          <li className="flex gap-3">
            <span aria-hidden className="font-extrabold text-primary">2</span>
            <span>Pas vlerësimit ju dërgojmë planin e pastrimit dhe ofertën me shkrim, pa pagesë.</span>
          </li>
          <li className="flex gap-3">
            <span aria-hidden className="font-extrabold text-primary">3</span>
            <span>Pastrimi konfirmohet vetëm kur biem dakord për punët, totalin dhe datën.</span>
          </li>
        </ol>
        <p className="mt-5 text-text-muted">Nëse e keni me ngut, mund të na shkruani ose të na telefononi tani:</p>
        <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          <WhatsAppButton service={page} placement={`${placement}_success`} variant="outline">
            Na shkruani në WhatsApp
          </WhatsAppButton>
          <PhoneButton placement={`${placement}_success`} variant="outline" />
        </div>
        <InstallShortcut placement={`${placement}_success`} variant="card" className="mt-6" />
      </div>
    );
  }

  const err = (field: FieldKey) => (errors[field] ? `${id}-${field}-error` : undefined);
  const timingLabel = optionLabel(timings, d.timing);
  const summary: [string, string][] = [
    ["Shërbimi", d.service ? serviceLabel(d.service) : ""],
    ["Prona", fields.propertyOptions ? (optionLabel(fields.propertyOptions, propertyType) ?? "") : ""],
    ["Gjendja", fields.condition ? (optionLabel(conditions, d.condition) ?? "") : ""],
    [
      "Sipërfaqja",
      fields.size ? (d.sizeUnknown ? "Nuk e di ende" : sizeM2 ? `${sizeM2} m²` : "") : "",
    ],
    ["Vlerësim orientues", estimate.kind === "indicative" ? `${formatLek(estimate.totalLek)} lekë të reja` : ""],
    ["Zona", d.area.trim()],
    [
      "Kur",
      d.timing === "date" && d.preferredDate ? `Preferoni ${d.preferredDate.split("-").reverse().join(".")}` : (timingLabel ?? ""),
    ],
    ["Vlerësimi", optionLabel(assessmentMethods, d.assessmentMethod) ?? ""],
  ].filter((row): row is [string, string] => !!row[1]);

  return (
    <form
      ref={formRef}
      onSubmit={handleSubmit}
      onInput={onFirstInput}
      onChange={onFirstInput}
      noValidate
      data-lead-form
      aria-label="Formulari i kërkesës për vlerësim"
      className="relative scroll-mt-24 rounded-lg border border-border bg-bg p-5 text-text sm:p-8"
    >
      {/* 1. Service: preselected from the page, changeable. */}
      {choosingService || !d.service ? (
        <ChipGroup
          name={`${id}-service`}
          legend="Çfarë pastrimi ju nevojitet?"
          options={serviceOptions}
          value={d.service}
          onChange={(v) => set("service", v as LeadService)}
          errorId={`${id}-service-error`}
          error={errors.service}
        />
      ) : (
        <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1 border-b border-border pb-4">
          <p>
            <span className="text-text-muted">Shërbimi: </span>
            <strong className="font-bold">{serviceLabel(d.service)}</strong>
          </p>
          <button
            type="button"
            onClick={() => setChoosingService(true)}
            className="inline-flex min-h-12 items-center font-semibold text-primary underline decoration-primary/40 decoration-2 underline-offset-4"
          >
            Ndrysho shërbimin
          </button>
        </div>
      )}

      {fields.propertyType && (
        <div className="mt-6">
          <ChipGroup
            name={`${id}-propertyType`}
            legend={fields.propertyOptions ? "Çfarë prone është?" : "Çfarë lloj ambienti është? (opsionale)"}
            hint={fields.propertyOptions ? `Çmimi orientues prej ${DEEP_CLEAN_RATE_LEK} lekë të reja/m² vlen për apartamente.` : undefined}
            options={fields.propertyOptions ?? propertyTypes}
            value={propertyType}
            onChange={(v) => set("propertyType", v)}
            optional
          />
        </div>
      )}

      {fields.condition && (
        <div className="mt-6">
          <ChipGroup
            name={`${id}-condition`}
            legend="Në çfarë gjendje është? (opsionale)"
            options={conditions}
            value={d.condition}
            onChange={(v) => set("condition", v)}
            optional
          />
        </div>
      )}

      {fields.size && (
        <div className="mt-6">
          <label htmlFor={`${id}-sizeM2`} className={labelClasses}>
            Sipërfaqja e përafërt (m², opsionale)
          </label>
          <div className="flex flex-wrap items-start gap-x-4 gap-y-2">
            <input
              id={`${id}-sizeM2`}
              type="text"
              inputMode="numeric"
              value={d.sizeUnknown ? "" : d.size}
              disabled={d.sizeUnknown}
              onChange={(e) => set("size", e.target.value)}
              aria-invalid={!!errors.sizeM2}
              aria-describedby={err("sizeM2")}
              maxLength={12}
              className={`${inputClasses} max-w-40`}
            />
            <label className={`${chipClasses} mt-2`}>
              <input
                type="checkbox"
                checked={d.sizeUnknown}
                onChange={(e) => set("sizeUnknown", e.target.checked)}
                className="sr-only"
              />
              Nuk e di
            </label>
          </div>
          <FieldError id={`${id}-sizeM2-error`}>{errors.sizeM2}</FieldError>
          {d.service === "me-themel" && <EstimatePanel estimate={estimate} />}
        </div>
      )}

      {fields.frequency && fields.business && (
        <div className="mt-6">
          <ChipGroup
            name={`${id}-frequency`}
            legend="Një herë apo rregullisht? (opsionale)"
            options={frequencies}
            value={d.frequency}
            onChange={(v) => set("frequency", v)}
            optional
          />
        </div>
      )}

      <div className="mt-6">
        <label htmlFor={`${id}-area`} className={labelClasses}>
          Zona ose qyteti (opsionale)
        </label>
        <p id={`${id}-area-hint`} className="mt-1 text-base text-text-muted">
          Për shembull, Komuna e Parisit, Kamëz ose Durrës. Adresën e saktë nuk e kërkojmë tani.
        </p>
        <input
          id={`${id}-area`}
          type="text"
          autoComplete="address-level2"
          value={d.area}
          onChange={(e) => set("area", e.target.value)}
          aria-describedby={`${id}-area-hint`}
          maxLength={120}
          className={inputClasses}
        />
      </div>

      <div className="mt-6">
        <ChipGroup
          name={`${id}-timing`}
          legend="Kur ju përshtatet? (opsionale)"
          hint="Është preferencë: datën e konfirmojmë bashkë."
          options={timings}
          value={d.timing}
          onChange={(v) => set("timing", v)}
          optional
        />
        {d.timing === "date" && (
          <div className="mt-4">
            <label htmlFor={`${id}-preferredDate`} className={labelClasses}>
              Data që preferoni
            </label>
            <input
              id={`${id}-preferredDate`}
              type="date"
              min={todayIso()}
              max={todayIso(365)}
              value={d.preferredDate}
              onChange={(e) => set("preferredDate", e.target.value)}
              aria-invalid={!!errors.preferredDate}
              aria-describedby={err("preferredDate")}
              className={`${inputClasses} max-w-64`}
            />
            <FieldError id={`${id}-preferredDate-error`}>{errors.preferredDate}</FieldError>
          </div>
        )}
      </div>

      <div className="mt-8 grid gap-6 border-t border-border pt-6 sm:grid-cols-2">
        <div>
          <label htmlFor={`${id}-name`} className={labelClasses}>
            Emri
          </label>
          <input
            id={`${id}-name`}
            type="text"
            autoComplete="name"
            value={d.name}
            onChange={(e) => set("name", e.target.value)}
            aria-invalid={!!errors.name}
            aria-describedby={err("name")}
            maxLength={80}
            className={inputClasses}
          />
          <FieldError id={`${id}-name-error`}>{errors.name}</FieldError>
        </div>

        <div>
          <label htmlFor={`${id}-phone`} className={labelClasses}>
            Numri i telefonit
          </label>
          <input
            id={`${id}-phone`}
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            value={d.phone}
            onChange={(e) => set("phone", e.target.value)}
            aria-invalid={!!errors.phone}
            aria-describedby={err("phone")}
            maxLength={25}
            className={inputClasses}
          />
          <FieldError id={`${id}-phone-error`}>{errors.phone}</FieldError>
        </div>
      </div>

      <div className="mt-6">
        <ChipGroup
          name={`${id}-channel`}
          legend="Ku t'ju kontaktojmë?"
          options={contactChannels}
          value={d.channel}
          onChange={(v) => set("channel", v)}
        />
      </div>

      {showBusinessName && (
        <div className="mt-6">
          <label htmlFor={`${id}-business`} className={labelClasses}>
            Emri i biznesit ose i administratës (opsionale)
          </label>
          <input
            id={`${id}-business`}
            type="text"
            autoComplete="organization"
            value={d.businessName}
            onChange={(e) => set("businessName", e.target.value)}
            maxLength={120}
            className={inputClasses}
          />
        </div>
      )}

      {/* Less essential, all optional: folded so the form stays short on phones. */}
      <details className="group mt-6 border-t border-border pt-2" open={detailsOpen} onToggle={(e) => setDetailsOpen(e.currentTarget.open)}>
        <summary className="flex min-h-12 cursor-pointer list-none items-center justify-between text-lg font-semibold text-primary">
          Shtoni detaje: vlerësimi, prioritetet, shënime
          <span aria-hidden className="text-2xl leading-none group-open:rotate-45">+</span>
        </summary>
      <div className="mt-4">
        <ChipGroup
          name={`${id}-assessment`}
          legend="Si preferoni ta bëjmë vlerësimin? (opsionale)"
          hint="Fotot nuk janë të detyrueshme. Mund të nisim me një telefonatë."
          options={assessmentMethods}
          value={d.assessmentMethod}
          onChange={(v) => set("assessmentMethod", v)}
          optional
        />
      </div>

      {fields.priorities && (
        <div className="mt-4">
          <CheckChips
            name={`${id}-priorities`}
            legend={fields.priorities.legend}
            options={fields.priorities.options}
            values={priorities}
            onChange={(v) => set("priorities", v)}
          />
        </div>
      )}

      {fields.frequency && !fields.business && (
        <div className="mt-6">
          <ChipGroup
            name={`${id}-frequency`}
            legend="Një herë apo rregullisht? (opsionale)"
            options={frequencies}
            value={d.frequency}
            onChange={(v) => set("frequency", v)}
            optional
          />
        </div>
      )}

      <div className="mt-6">
        <label htmlFor={`${id}-message`} className={labelClasses}>
          Diçka tjetër që duhet të dimë? (opsionale)
        </label>
        <p id={`${id}-message-hint`} className="mt-1 text-base text-text-muted">
          Për shembull, numri i banjove, kafshë shtëpiake ose zona që doni t&apos;i trajtojmë me më shumë kujdes.
        </p>
        <textarea
          id={`${id}-message`}
          aria-describedby={`${id}-message-hint`}
          rows={3}
          value={d.message}
          onChange={(e) => set("message", e.target.value)}
          maxLength={1000}
          className={inputClasses}
        />
      </div>

      </details>

      {/* Honeypot: hidden from people and screen readers; bots tend to fill every field. */}
      <div aria-hidden className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label htmlFor={`${id}-website`}>Mos e plotësoni këtë fushë</label>
        <input
          id={`${id}-website`}
          type="text"
          name="website"
          tabIndex={-1}
          autoComplete="off"
          value={honeypot}
          onChange={(e) => setHoneypot(e.target.value)}
        />
      </div>

      {summary.length > 1 && (
        <p className="mt-6 rounded-lg bg-bg-muted px-4 py-3 text-base" aria-live="polite">
          <span className="font-semibold">Përmbledhja: </span>
          {summary.map(([k, v]) => `${k}: ${v}`).join(" · ")}
        </p>
      )}

      {errors.form && (
        <div ref={errorRef} role="alert" className="mt-6 rounded-lg border-2 border-red-700/30 bg-red-50 p-4 text-red-800">
          <p className="font-medium">{errors.form}</p>
          <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <WhatsAppButton service={page} placement={`${placement}_error`} />
            <PhoneButton placement={`${placement}_error`} />
          </div>
        </div>
      )}

      <div className="mt-8">
        <p className="font-bold">{assessmentBenefit}</p>
        <p className="mt-1 text-text-muted">
          {assessmentBenefitText} Fotot nuk janë të detyrueshme: mund ta nisim me një telefonatë.
        </p>
      </div>
      <Button
        type="submit"
        variant="primary"
        size="lg"
        className="mt-5 w-full sm:w-auto"
        disabled={status === "submitting"}
        aria-disabled={status === "submitting"}
      >
        {status === "submitting" ? "Po dërgohet..." : "Kërko vlerësim"}
      </Button>
      <p className="mt-3 text-sm text-text-muted">
        Numrin e përdorim vetëm për t&apos;ju kontaktuar për këtë kërkesë.{" "}
        <Link href="/privatesia" className="underline underline-offset-4 hover:text-primary">
          Politika e privatësisë
        </Link>
      </p>
    </form>
  );
}
