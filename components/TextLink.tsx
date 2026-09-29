import Link from "next/link";
import type { ReactNode } from "react";

// Secondary actions are underlined text, not buttons, but still get a 48px tap area.
export function TextLink({ href, children, className = "" }: { href: string; children: ReactNode; className?: string }) {
  const classes = `inline-flex min-h-12 items-center font-semibold underline decoration-2 underline-offset-4 hover:decoration-4 ${className}`;
  if (href.startsWith("http")) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={classes}>
        {children}
      </a>
    );
  }
  return (
    <Link href={href} className={classes}>
      {children}
    </Link>
  );
}
