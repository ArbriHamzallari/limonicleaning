import type { HTMLAttributes } from "react";

// Deliberately flat: a hairline border and no drop shadow, so cards read as structure
// rather than the generic "SaaS card kit" (uniform rounded-2xl + soft grey shadow).
export function Card({ className = "", children, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={`rounded-lg border border-border bg-bg p-6 ${className}`} {...props}>
      {children}
    </div>
  );
}
