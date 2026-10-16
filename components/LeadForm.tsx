"use client";

import { useEffect, useId, useRef, useState, type FormEvent, type ReactNode } from "react";
import Link from "next/link";
import { Button } from "./Button";
import { WhatsAppButton } from "./WhatsAppButton";
import { normalizePhone } from "@/lib/phone";
import { trackEvent } from "@/lib/analytics";
import {
  businessPropertyTypes,
  formPreset,
  frequencies,
  leadServiceChips,
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

type FieldErrors = Partial<Record<"service" | "name" | "phone" | "sizeM2" | "form", string>>;

const serviceOptions = leadServiceChips.map((value) => ({
  value,
  label: value === "tjeter" ? "Tjetër" : serviceIndex[value].chipLabel,
}));

const FAILED = "Kërkesa nuk u dërgua. Provoni përsëri ose na shkruani në WhatsApp.";
const SIZE_ERROR = "Shkruani vetëm një numër, për shembull, 80.";

const inputClasses =
  "mt-2 block min-h-12 w-full rounded-lg border-2 border-border bg-bg px-4 py-2 text-lg text-text focus:border-primary aria-[invalid=true]:border-red-700";
const labelClasses = "block text-lg font-semibold text-text";
const chipClasses =
  "inline-flex min-h-12 cursor-pointer items-center rounded-lg border-2 border-border bg-bg px-4 text-base font-medium text-text has-checked:border-primary has-checked:bg-primary has-checked:text-white has-focus-visible:outline-3 has-focus-visible:outline-offset-2 has-focus-visible:outline-primary";

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
  options,
  value,
  onChange,
  optional = false,
  errorId,
  error,
}: {
  name: string;
  legend: string;
  options: readonly { value: string; label: string }[];
  value: string;
  onChange: (value: string) => void;
  optional?: boolean;
  errorId?: string;
  error?: string;
}) {
  return (
    <fieldset aria-describedby={error ? errorId : undefined}>
      <legend className={labelClasses}>{legend}</legend>
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

/** "80", "80 m2" and "80m²" all mean 80. Anything else is an error. */
function parseSize(raw: string): number | null | undefined {
  const value = raw.trim();
  if (!value) return undefined;
  const match = value.match(/^(\d{1,6})\s*(m2|m²|m)?$/i);
  return match ? Number(match[1]) : null;
}

export function LeadForm({ page, placement }: LeadFormProps) {
  const id = useId();
  const preset = formPreset(page);
  const [propertyType, setPropertyType] = useState<string>(preset.propertyType ?? "");
  const [service, setService] = useState<LeadService | "">(preset.service ?? "");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [size, setSize] = useState("");
  const [frequency, setFrequency] = useState("");
  const [timing, setTiming] = useState("");
  const [message, setMessage] = useState("");
  const [honeypot, setHoneypot] = useState("");
  const [errors, setErrors] = useState<FieldErrors>({});
  const [status, setStatus] = useState<"idle" | "submitting" | "success">("idle");
  const [submittedName, setSubmittedName] = useState("");

  const startedAt = useRef(0);
  const successRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const errorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    startedAt.current = Date.now();
  }, []);

  useEffect(() => {
    if (status === "success") successRef.current?.focus();
  }, [status]);

  useEffect(() => {
    if (errors.form) errorRef.current?.scrollIntoView({ block: "center" });
  }, [errors.form]);

  const showBusinessName = (businessPropertyTypes as readonly string[]).includes(propertyType);

  function focusFirstError(next: FieldErrors) {
    const first = (["service", "name", "phone", "sizeM2"] as const).find((k) => next[k]);
    if (!first) return;
    const selector = first === "service" ? `input[name="service"]` : `#${CSS.escape(`${id}-${first}`)}`;
    formRef.current?.querySelector<HTMLElement>(selector)?.focus();
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();

    const sizeM2 = parseSize(size);
    const next: FieldErrors = {};
    if (!service) next.service = "Zgjidhni llojin e pastrimit.";
    if (name.trim().length < 2) next.name = "Shkruani emrin me të paktën dy shkronja.";
    if (!normalizePhone(phone)) next.phone = "Numri nuk duket i saktë. Kontrolloni numrin dhe provoni përsëri.";
    if (sizeM2 === null) next.sizeM2 = SIZE_ERROR;
    setErrors(next);
    if (Object.keys(next).length) {
      focusFirstError(next);
      return;
    }

    setStatus("submitting");
    const params = new URLSearchParams(window.location.search);

    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          service,
          name,
          phone,
          propertyType: propertyType || undefined,
          sizeM2: sizeM2 != null ? String(sizeM2) : undefined,
          frequency: frequency || undefined,
          timing: timing || undefined,
          businessName: showBusinessName ? businessName : undefined,
          message,
          pagePath: window.location.pathname,
          utmSource: params.get("utm_source") ?? undefined,
          utmCampaign: params.get("utm_campaign") ?? undefined,
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
        if (hasFieldError) focusFirstError(fromServer);
        return;
      }

      trackEvent("lead_submitted", { service, placement });
      setSubmittedName(name.trim().split(/\s+/)[0]);
      setStatus("success");
    } catch {
      setErrors({ form: FAILED });
      setStatus("idle");
    }
  }

  if (status === "success") {
    return (
      <div
        ref={successRef}
        tabIndex={-1}
        role="status"
        className="rounded-lg border-2 border-primary/20 bg-bg-warm p-6 text-text sm:p-8"
      >
        <p className="text-2xl font-bold">Faleminderit, {submittedName}!</p>
        <p className="mt-3">E morëm kërkesën tuaj. Një anëtar i ekipit do t&apos;ju kontaktojë për ofertën.</p>
        <WhatsAppButton service={page} placement={`${placement}_success`} variant="outline" className="mt-6">
          Nëse e keni me ngut, na shkruani në WhatsApp
        </WhatsAppButton>
      </div>
    );
  }

  const err = (field: keyof FieldErrors) => (errors[field] ? `${id}-${field}-error` : undefined);

  return (
    <form
      ref={formRef}
      onSubmit={handleSubmit}
      noValidate
      className="relative rounded-lg border border-border bg-bg p-5 text-text sm:p-8"
    >
      <ChipGroup
        name="propertyType"
        legend="Çfarë lloj ambienti dëshironi të pastroni?"
        options={propertyTypes}
        value={propertyType}
        onChange={setPropertyType}
        optional
      />

      <div className="mt-6">
        <ChipGroup
          name="service"
          legend="Çfarë pastrimi ju nevojitet?"
          options={serviceOptions}
          value={service}
          onChange={(v) => setService(v as LeadService)}
          errorId={`${id}-service-error`}
          error={errors.service}
        />
      </div>

      <div className="mt-6 grid gap-6 sm:grid-cols-2">
        <div>
          <label htmlFor={`${id}-name`} className={labelClasses}>
            Emri
          </label>
          <input
            id={`${id}-name`}
            type="text"
            autoComplete="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            aria-invalid={!!errors.name}
            aria-describedby={err("name")}
            maxLength={80}
            className={inputClasses}
          />
          <FieldError id={`${id}-name-error`}>{errors.name}</FieldError>
        </div>

        <div>
          <label htmlFor={`${id}-phone`} className={labelClasses}>
            Numri i telefonit (WhatsApp)
          </label>
          <input
            id={`${id}-phone`}
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            aria-invalid={!!errors.phone}
            aria-describedby={err("phone")}
            maxLength={25}
            className={inputClasses}
          />
          <FieldError id={`${id}-phone-error`}>{errors.phone}</FieldError>
        </div>
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
            value={businessName}
            onChange={(e) => setBusinessName(e.target.value)}
            maxLength={120}
            className={inputClasses}
          />
        </div>
      )}

      <div className="mt-6 grid gap-6 sm:grid-cols-2">
        <div>
          <label htmlFor={`${id}-sizeM2`} className={labelClasses}>
            Sipërfaqja e përafërt (m², opsionale)
          </label>
          <input
            id={`${id}-sizeM2`}
            type="text"
            inputMode="numeric"
            value={size}
            onChange={(e) => setSize(e.target.value)}
            aria-invalid={!!errors.sizeM2}
            aria-describedby={err("sizeM2")}
            maxLength={12}
            className={inputClasses}
          />
          <FieldError id={`${id}-sizeM2-error`}>{errors.sizeM2}</FieldError>
        </div>
        <ChipGroup
          name="frequency"
          legend="Një herë apo rregullisht? (opsionale)"
          options={frequencies}
          value={frequency}
          onChange={setFrequency}
          optional
        />
      </div>

      <div className="mt-6">
        <ChipGroup
          name="timing"
          legend="Kur ju duhet? (opsionale)"
          options={timings}
          value={timing}
          onChange={setTiming}
          optional
        />
      </div>

      <div className="mt-6">
        <label htmlFor={`${id}-message`} className={labelClasses}>
          Mesazh (opsional)
        </label>
        <p id={`${id}-message-hint`} className="mt-1 text-base text-text-muted">
          Për shembull, zona, numri i kateve ose çdo gjë tjetër që duhet të dimë.
        </p>
        <textarea
          id={`${id}-message`}
          aria-describedby={`${id}-message-hint`}
          rows={3}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          maxLength={1000}
          className={inputClasses}
        />
      </div>

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

      {errors.form && (
        <div ref={errorRef} role="alert" className="mt-6 rounded-lg border-2 border-red-700/30 bg-red-50 p-4 text-red-800">
          <p className="font-medium">{errors.form}</p>
          <WhatsAppButton service={page} placement={`${placement}_error`} className="mt-3" />
        </div>
      )}

      <p className="mt-8 text-text-muted">
        Pas dërgimit të kërkesës, mund të na dërgoni fotot ose videot e ambientit në WhatsApp.
      </p>
      <Button type="submit" variant="primary" size="lg" className="mt-4 w-full sm:w-auto" disabled={status === "submitting"}>
        {status === "submitting" ? "Po dërgohet..." : "Dërgo kërkesën"}
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
