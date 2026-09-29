"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/Button";
import { WhatsAppLink } from "@/components/WhatsAppLink";
import { PhoneLink } from "@/components/PhoneLink";
import {
  propertyTypeOptions,
  cleaningTypeOptions,
  typologyInputTypes,
  typologies,
  sqmRateByPropertyType,
  timeSlots,
  extrasOptions,
  type PropertyTypeValue,
  type CleaningTypeValue,
} from "@/lib/booking-options";
import { formatPerSqm } from "@/lib/pricing";
import { waMessages } from "@/lib/whatsapp-messages";
import { trackEvent } from "@/lib/analytics";

interface FormState {
  propertyType: PropertyTypeValue | null;
  typology: string;
  cleaningType: CleaningTypeValue | null;
  date: string;
  time: string;
  extras: string[];
  name: string;
  phone: string;
  email: string;
  address: string;
  notes: string;
}

const initialState: FormState = {
  propertyType: null,
  typology: "",
  cleaningType: null,
  date: "",
  time: "",
  extras: [],
  name: "",
  phone: "",
  email: "",
  address: "",
  notes: "",
};

const steps = ["Lloji i pronës", "Madhësia", "Lloji i pastrimit", "Data dhe ora", "Kontakti", "Përmbledhje"];

function todayIso() {
  return new Date().toISOString().slice(0, 10);
}

export function BookingWizard() {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<FormState>(initialState);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<{ reference: string } | null>(null);

  const showTypologyButtons = form.propertyType ? typologyInputTypes.includes(form.propertyType) : false;

  // Flat "Nga X ALL/m²" starting rate for the chosen property type, if it has a published one
  // (Apartament/Zyrë/Vilë). Airbnb and everything else is quote-only — see lib/pricing.ts.
  const sqmRate = form.propertyType ? sqmRateByPropertyType[form.propertyType] : undefined;

  useEffect(() => {
    if (form.propertyType) trackEvent("booking_started");
    // Fire once, the first time a property type is chosen.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [!!form.propertyType]);

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function toggleExtra(extra: string) {
    setForm((f) => ({
      ...f,
      extras: f.extras.includes(extra) ? f.extras.filter((e) => e !== extra) : [...f.extras, extra],
    }));
  }

  function canAdvance(): boolean {
    switch (step) {
      case 0:
        return !!form.propertyType;
      case 1:
        return form.typology.trim().length > 0;
      case 2:
        return !!form.cleaningType;
      case 3:
        return form.date.trim().length > 0 && form.time.trim().length > 0;
      case 4:
        return form.name.trim().length > 1 && form.phone.trim().length > 5;
      default:
        return true;
    }
  }

  function next() {
    if (!canAdvance()) return;
    setStep((s) => Math.min(s + 1, steps.length - 1));
  }

  function back() {
    setStep((s) => Math.max(s - 1, 0));
  }

  async function handleSubmit() {
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/booking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          propertyType: form.propertyType,
          typology: form.typology,
          cleaningType: form.cleaningType,
          date: form.date,
          time: form.time,
          extras: form.extras,
          name: form.name,
          phone: form.phone,
          email: form.email || undefined,
          address: form.address || undefined,
          notes: form.notes || undefined,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "Diçka shkoi keq. Provo përsëri ose na shkruaj në WhatsApp.");
        return;
      }

      trackEvent("booking_completed");
      setResult({ reference: data.reference });
    } catch {
      setError(
        "Nuk arritëm të lidhemi me serverin. Kontrollo lidhjen tënde dhe provo përsëri, ose na shkruaj direkt në WhatsApp.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  if (result) {
    return (
      <div className="rounded-lg border border-border bg-bg-warm p-8 text-center">
        <h2 className="font-display text-2xl font-semibold text-text sm:text-3xl">Rezervimi u dërgua</h2>
        <p className="mt-2 text-text-muted">
          Numri i referencës: <span className="font-semibold text-text">{result.reference}</span>
        </p>
        <p className="mt-4 text-text-muted">
          Do t&apos;ju kontaktojmë në WhatsApp për konfirmimin.
        </p>
        <div className="mt-6 flex justify-center gap-3">
          <WhatsAppLink
            message={waMessages.bookingFollowUp(result.reference)}
            source="booking_success"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-primary-hover"
          >
            Na shkruaj në WhatsApp
          </WhatsAppLink>
        </div>
      </div>
    );
  }

  return (
    <div>
      <ol className="mb-8 flex flex-wrap gap-2 text-xs font-medium text-text-muted">
        {steps.map((label, i) => (
          <li
            key={label}
            className={`rounded-full border px-3 py-1 ${
              i === step
                ? "border-primary bg-primary text-white"
                : i < step
                  ? "border-primary/40 text-primary"
                  : "border-border"
            }`}
          >
            {i + 1}. {label}
          </li>
        ))}
      </ol>

      <div className="rounded-lg border border-border bg-bg p-6 sm:p-8">
        {step === 0 && (
          <fieldset>
            <legend className="font-display text-lg font-semibold text-text">Çfarë dëshiron të pastrosh?</legend>
            <p className="mt-1 text-sm text-text-muted">Zgjidh llojin e pronës.</p>
            <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3">
              {propertyTypeOptions.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => update("propertyType", opt.value)}
                  className={`rounded-lg border px-4 py-3 text-sm font-medium transition-colors ${
                    form.propertyType === opt.value
                      ? "border-primary bg-primary text-white"
                      : "border-border text-text hover:border-primary"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </fieldset>
        )}

        {step === 1 && (
          <fieldset>
            <legend className="font-display text-lg font-semibold text-text">Cila është madhësia e pronës?</legend>
            {showTypologyButtons ? (
              <>
                <p className="mt-1 text-sm text-text-muted">Zgjidh tipologjinë.</p>
                <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
                  {typologies.map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => update("typology", t)}
                      className={`rounded-lg border px-4 py-3 text-sm font-medium transition-colors ${
                        form.typology === t
                          ? "border-primary bg-primary text-white"
                          : "border-border text-text hover:border-primary"
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </>
            ) : (
              <>
                <p className="mt-1 text-sm text-text-muted">
                  Shkruaj sipërfaqen (m²) ose një përshkrim të shkurtër të pronës.
                </p>
                <input
                  type="text"
                  value={form.typology}
                  onChange={(e) => update("typology", e.target.value)}
                  placeholder="p.sh. 150 m²"
                  className="mt-5 w-full rounded-lg border border-border px-4 py-3 text-sm focus:border-primary focus:outline-none"
                />
              </>
            )}
          </fieldset>
        )}

        {step === 2 && (
          <fieldset>
            <legend className="font-display text-lg font-semibold text-text">Çfarë lloj pastrimi dëshiron?</legend>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {cleaningTypeOptions.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => update("cleaningType", opt.value)}
                  className={`rounded-lg border p-4 text-left transition-colors ${
                    form.cleaningType === opt.value
                      ? "border-primary bg-bg-warm"
                      : "border-border hover:border-primary"
                  }`}
                >
                  <span className="block font-semibold text-text">{opt.label}</span>
                  <span className="mt-1 block text-sm text-text-muted">{opt.description}</span>
                </button>
              ))}
            </div>
          </fieldset>
        )}

        {step === 3 && (
          <fieldset>
            <legend className="font-display text-lg font-semibold text-text">Zgjidh datën dhe orën</legend>
            <div className="mt-5 grid gap-6 sm:grid-cols-2">
              <div>
                <label className="text-sm font-medium text-text">Data</label>
                <input
                  type="date"
                  min={todayIso()}
                  value={form.date}
                  onChange={(e) => update("date", e.target.value)}
                  className="mt-1.5 w-full rounded-lg border border-border px-4 py-3 text-sm focus:border-primary focus:outline-none"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-text">Ora</label>
                <div className="mt-1.5 grid grid-cols-3 gap-2">
                  {timeSlots.map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => update("time", t)}
                      className={`rounded-lg border px-3 py-3 text-sm font-medium transition-colors ${
                        form.time === t
                          ? "border-primary bg-primary text-white"
                          : "border-border text-text hover:border-primary"
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </fieldset>
        )}

        {step === 4 && (
          <fieldset>
            <legend className="font-display text-lg font-semibold text-text">Të dhënat e kontaktit</legend>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label className="text-sm font-medium text-text">Emri *</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => update("name", e.target.value)}
                  className="mt-1.5 w-full rounded-lg border border-border px-4 py-3 text-sm focus:border-primary focus:outline-none"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-text">Telefon *</label>
                <input
                  type="tel"
                  value={form.phone}
                  onChange={(e) => update("phone", e.target.value)}
                  placeholder="+355 6..."
                  className="mt-1.5 w-full rounded-lg border border-border px-4 py-3 text-sm focus:border-primary focus:outline-none"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-text">Adresa</label>
                <input
                  type="text"
                  value={form.address}
                  onChange={(e) => update("address", e.target.value)}
                  className="mt-1.5 w-full rounded-lg border border-border px-4 py-3 text-sm focus:border-primary focus:outline-none"
                />
              </div>
            </div>

            <div className="mt-5">
              <label className="text-sm font-medium text-text">Shërbime shtesë (opsionale)</label>
              <div className="mt-1.5 grid gap-2 sm:grid-cols-3">
                {extrasOptions.map((extra) => (
                  <label
                    key={extra}
                    className={`flex cursor-pointer items-center gap-2 rounded-lg border px-4 py-3 text-sm font-medium transition-colors ${
                      form.extras.includes(extra)
                        ? "border-primary bg-bg-warm"
                        : "border-border hover:border-primary"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={form.extras.includes(extra)}
                      onChange={() => toggleExtra(extra)}
                      className="accent-primary"
                    />
                    {extra}
                  </label>
                ))}
              </div>
            </div>

            <div className="mt-5">
              <label className="text-sm font-medium text-text">Shënime</label>
              <textarea
                value={form.notes}
                onChange={(e) => update("notes", e.target.value)}
                rows={3}
                className="mt-1.5 w-full rounded-lg border border-border px-4 py-3 text-sm focus:border-primary focus:outline-none"
              />
            </div>
          </fieldset>
        )}

        {step === 5 && (
          <div>
            <h2 className="font-display text-lg font-semibold text-text">Përmbledhje</h2>
            <dl className="mt-5 divide-y divide-border text-sm">
              {[
                ["Lloji i pronës", propertyTypeOptions.find((o) => o.value === form.propertyType)?.label],
                ["Madhësia", form.typology],
                ["Lloji i pastrimit", cleaningTypeOptions.find((o) => o.value === form.cleaningType)?.label],
                ["Data", form.date],
                ["Ora", form.time],
                ["Shtesa", form.extras.length ? form.extras.join(", ") : "Asnjë"],
                ["Emri", form.name],
                ["Telefon", form.phone],
              ].map(([label, value]) => (
                <div key={label} className="flex justify-between gap-4 py-2">
                  <dt className="text-text-muted">{label}</dt>
                  <dd className="text-right font-medium text-text">{value || "—"}</dd>
                </div>
              ))}
            </dl>

            {sqmRate ? (
              <p className="mt-4 rounded-lg bg-bg-warm px-4 py-3 text-sm font-semibold text-text">
                {formatPerSqm(sqmRate)} — çmimi final përcaktohet pas shqyrtimit të pronës.
              </p>
            ) : (
              <p className="mt-4 rounded-lg bg-bg-muted px-4 py-3 text-sm text-text-muted">
                Çmimi do të konfirmohet sipas pronës dhe kërkesave — do t&apos;ju kontaktojmë në WhatsApp.
              </p>
            )}

            {error && (
              <p className="mt-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>
            )}
          </div>
        )}
      </div>

      <div className="mt-6 flex items-center justify-between">
        <Button variant="outline" onClick={back} disabled={step === 0 || submitting}>
          Kthehu
        </Button>

        {step < steps.length - 1 ? (
          <Button variant="primary" onClick={next} disabled={!canAdvance()}>
            Vazhdo
          </Button>
        ) : (
          <Button variant="primary" onClick={handleSubmit} disabled={submitting}>
            {submitting ? "Duke dërguar..." : "Konfirmo rezervimin"}
          </Button>
        )}
      </div>

      <p className="mt-6 text-center text-sm text-text-muted">
        Preferon të flasësh direkt? <PhoneLink className="font-medium text-primary" /> ose{" "}
        <WhatsAppLink message={waMessages.general} source="booking_wizard" className="font-medium text-primary">
          shkruaj në WhatsApp
        </WhatsAppLink>
        .
      </p>
    </div>
  );
}
