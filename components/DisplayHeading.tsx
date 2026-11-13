import type { ReactNode } from "react";

type Level = "h1" | "h2" | "h3";
type Size = "xl" | "lg" | "md";

const sizeClasses: Record<Size, string> = {
  xl: "text-[3rem] sm:text-7xl",
  lg: "text-[2.5rem] sm:text-6xl",
  md: "text-3xl sm:text-4xl",
};

interface DisplayHeadingProps {
  as?: Level;
  size?: Size;
  /** First line, in the surrounding text colour. */
  children: ReactNode;
  /** Optional second line: lemon on dark backgrounds, green on light ones. Never lemon on white. */
  second?: ReactNode;
  onDark?: boolean;
  className?: string;
  id?: string;
}

// Condensed uppercase heading (Barlow Condensed 800). The two-tone second line is the only
// place the lemon colour is used for text, and only on dark green.
export function DisplayHeading({
  as: Tag = "h2",
  size = "lg",
  children,
  second,
  onDark = false,
  className = "",
  id,
}: DisplayHeadingProps) {
  return (
    <Tag id={id} className={`display text-balance ${sizeClasses[size]} ${onDark ? "" : "text-primary"} ${className}`}>
      {children}
      {second && <span className={`block ${onDark ? "text-accent" : "text-text"}`}>{second}</span>}
    </Tag>
  );
}
