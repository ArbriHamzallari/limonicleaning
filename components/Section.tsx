import type { HTMLAttributes } from "react";

type Tone = "default" | "muted" | "warm" | "dark" | "ink";

interface SectionProps extends HTMLAttributes<HTMLElement> {
  tone?: Tone;
  /** Removes default vertical padding for sections that manage their own (e.g. a
   *  full-bleed media block immediately followed by a text block). */
  flush?: boolean;
}

const toneClasses: Record<Tone, string> = {
  default: "bg-bg text-text",
  muted: "bg-bg-muted text-text",
  warm: "bg-bg-warm text-text",
  dark: "bg-primary text-text-on-dark",
  ink: "bg-bg-ink text-text-on-dark",
};

export function Section({
  tone = "default",
  flush = false,
  className = "",
  children,
  ...props
}: SectionProps) {
  return (
    <section className={`${toneClasses[tone]} ${flush ? "" : "py-16 sm:py-24"} ${className}`} {...props}>
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">{children}</div>
    </section>
  );
}
