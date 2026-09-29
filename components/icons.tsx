// The only icons on the site. One check mark everywhere (never a ✓ character), plus the
// WhatsApp and phone glyphs used by the lead buttons.

interface IconProps {
  className?: string;
}

export function CheckIcon({ className = "h-5 w-5" }: IconProps) {
  return (
    <svg viewBox="0 0 20 20" className={className} fill="none" stroke="currentColor" strokeWidth={2.2} aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 10.5 3.5 3.5 7.5-8" />
    </svg>
  );
}

export function WhatsAppIcon({ className = "h-5 w-5" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden>
      <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2.05 22l5.29-1.39a9.9 9.9 0 0 0 4.7 1.2h.01c5.46 0 9.91-4.45 9.91-9.91S17.5 2 12.04 2Zm5.8 14.19c-.24.68-1.4 1.3-1.93 1.37-.49.07-1.11.1-1.79-.11-.41-.13-.94-.3-1.62-.6-2.85-1.23-4.7-4.1-4.85-4.29-.14-.19-1.16-1.54-1.16-2.94s.73-2.09.99-2.37c.24-.27.53-.34.71-.34.18 0 .35 0 .5.01.16.01.38-.06.6.46.24.55.79 1.9.86 2.03.07.14.11.3.02.48-.09.19-.14.3-.27.46-.14.16-.29.36-.41.48-.14.14-.28.28-.12.56.16.27.71 1.17 1.53 1.89 1.05.94 1.94 1.23 2.21 1.37.27.14.43.12.59-.05.16-.16.68-.79.86-1.06.18-.27.36-.22.6-.13.25.09 1.58.75 1.85.88.27.14.45.2.51.32.07.11.07.65-.17 1.33Z" />
    </svg>
  );
}

export function PhoneIcon({ className = "h-5 w-5" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth={1.8} aria-hidden>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M2.25 6.75c0 8.28 6.72 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.37c0-.52-.35-.97-.85-1.09l-4.42-1.1c-.44-.11-.9.05-1.17.41l-.97 1.29a1.13 1.13 0 0 1-1.21.38 12.04 12.04 0 0 1-7.14-7.14 1.13 1.13 0 0 1 .38-1.21l1.29-.97c.36-.27.52-.73.41-1.17l-1.1-4.42a1.13 1.13 0 0 0-1.09-.85H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z"
      />
    </svg>
  );
}

export function CheckList({
  items,
  className = "",
  iconClassName = "text-primary",
}: {
  items: string[];
  className?: string;
  /** Use "text-accent" on dark sections. */
  iconClassName?: string;
}) {
  return (
    <ul className={`space-y-3 ${className}`}>
      {items.map((item) => (
        <li key={item} className="flex gap-3">
          <CheckIcon className={`mt-1 h-5 w-5 shrink-0 ${iconClassName}`} />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}
