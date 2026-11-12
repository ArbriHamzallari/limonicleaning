"use client";

// Form pieces shared by the full request wizard (/kerko-oferte) and the booking section at the
// bottom of each marketing page, so both ask the catalogue questions the same way.
import type { AnswerValue, Question } from "@/lib/booking/catalog";

export const chip =
  "inline-flex min-h-12 cursor-pointer items-center rounded-lg border-2 border-border bg-bg px-4 text-base font-medium text-text has-checked:border-primary has-checked:bg-primary has-checked:text-white has-focus-visible:outline-3 has-focus-visible:outline-offset-2 has-focus-visible:outline-primary";
export const input =
  "mt-2 block min-h-12 w-full rounded-lg border-2 border-border bg-bg px-4 py-2 text-lg text-text focus:border-primary aria-[invalid=true]:border-red-700";
export const label = "block text-lg font-semibold";
export const primaryBtn =
  "inline-flex min-h-14 items-center justify-center rounded-full bg-primary px-7 text-lg font-semibold text-white hover:bg-primary-hover disabled:opacity-50";
export const ghostBtn = "inline-flex min-h-12 items-center justify-center rounded-full border-2 border-primary/30 px-6 font-semibold text-primary hover:border-primary";

export function QuestionField({ q, value, onChange, error }: { q: Question; value: AnswerValue | undefined; onChange: (v: AnswerValue) => void; error?: string }) {
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

