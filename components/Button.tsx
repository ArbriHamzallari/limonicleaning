import Link from "next/link";
import type { AnchorHTMLAttributes, ButtonHTMLAttributes } from "react";

type Variant = "primary" | "secondary" | "outline" | "whatsapp" | "link";
type Size = "md" | "lg";

// Colours are checked for contrast: white on primary (10.6:1) and on the WhatsApp green
// #157A3E (5.4:1); the yellow button always carries dark text (9.9:1), never white.
const variantClasses: Record<Variant, string> = {
  primary: "rounded-full bg-primary text-white hover:bg-primary-hover",
  secondary: "rounded-full bg-accent text-text hover:bg-accent-hover",
  outline:
    "rounded-full border-2 border-primary/30 bg-bg text-primary hover:border-primary hover:bg-primary hover:text-white",
  whatsapp: "rounded-full bg-whatsapp text-white hover:bg-whatsapp-hover",
  link: "text-primary underline decoration-primary/40 decoration-2 underline-offset-4 hover:decoration-primary",
};

const sizeClasses: Record<Size, string> = {
  md: "min-h-12 px-6 text-base",
  lg: "min-h-14 px-7 text-lg",
};

const baseClasses =
  "inline-flex items-center justify-center gap-2 font-semibold transition-colors duration-150 disabled:pointer-events-none disabled:opacity-50";

interface CommonProps {
  variant?: Variant;
  size?: Size;
  className?: string;
}

type ButtonAsLink = CommonProps &
  AnchorHTMLAttributes<HTMLAnchorElement> & {
    href: string;
  };

type ButtonAsButton = CommonProps &
  ButtonHTMLAttributes<HTMLButtonElement> & {
    href?: undefined;
  };

export type ButtonProps = ButtonAsLink | ButtonAsButton;

export function buttonClasses({ variant = "primary", size = "md", className = "" }: CommonProps = {}) {
  // Text links keep the 48px tap height but no horizontal padding.
  const sizing = variant === "link" ? `min-h-12 ${size === "lg" ? "text-lg" : "text-base"}` : sizeClasses[size];
  return `${baseClasses} ${sizing} ${variantClasses[variant]} ${className}`;
}

export function Button({ variant = "primary", size = "md", className = "", ...props }: ButtonProps) {
  const classes = buttonClasses({ variant, size, className });

  if ("href" in props && props.href) {
    const { href, ...rest } = props;
    // tel:, https://wa.me and other external targets are plain anchors; internal routes use Link.
    if (!href.startsWith("/") && !href.startsWith("#")) {
      const external = href.startsWith("http");
      return (
        <a
          href={href}
          className={classes}
          {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
          {...rest}
        />
      );
    }
    return <Link href={href} className={classes} {...rest} />;
  }

  return <button className={classes} {...(props as ButtonAsButton)} />;
}
