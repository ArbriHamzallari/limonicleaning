import type { HTMLAttributes } from "react";

type Tone = "default" | "muted" | "warm" | "dark";

interface SectionProps extends HTMLAttributes<HTMLElement> {
  tone?: Tone;
  /** Removes default vertical padding for sections that manage their own. */
  flush?: boolean;
}

// Each tone also sets --fg-muted (secondary text colour) so shared components such as
// SectionHeading stay readable on both light and dark backgrounds.
const toneClasses: Record<Tone, string> = {
  default: "bg-bg text-text [--fg-muted:var(--color-text-muted)]",
  muted: "bg-bg-muted text-text [--fg-muted:var(--color-text-muted)]",
  warm: "bg-bg-warm text-text [--fg-muted:var(--color-text-muted)]",
  dark: "on-dark bg-primary text-text-on-dark [--fg-muted:var(--color-text-on-dark-muted)]",
};

export function Section({ tone = "default", flush = false, className = "", children, ...props }: SectionProps) {
  return (
    <section className={`${toneClasses[tone]} ${flush ? "" : "py-14 sm:py-20"} ${className}`} {...props}>
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">{children}</div>
    </section>
  );
}
