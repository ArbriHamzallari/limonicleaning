import Link from "next/link";
import type { AnchorHTMLAttributes, ButtonHTMLAttributes } from "react";

type Variant = "primary" | "secondary" | "outline" | "link";

const variantClasses: Record<Variant, string> = {
  primary:
    "bg-primary text-white shadow-[0_1px_0_rgba(0,0,0,0.08)] hover:bg-primary-hover hover:-translate-y-px active:translate-y-0",
  secondary:
    "bg-accent text-bg-ink hover:bg-accent-hover hover:-translate-y-px active:translate-y-0",
  outline:
    "bg-transparent text-primary border border-primary/30 hover:border-primary hover:bg-primary hover:text-white",
  link: "rounded-none px-0 py-0 gap-1.5 text-primary underline decoration-primary/30 decoration-2 underline-offset-4 hover:decoration-primary",
};

const baseClasses =
  "inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-semibold transition-[background-color,color,transform,border-color] duration-150 ease-[cubic-bezier(0.16,1,0.3,1)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 disabled:opacity-50 disabled:pointer-events-none";

interface CommonProps {
  variant?: Variant;
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

export function Button({ variant = "primary", className = "", ...props }: ButtonProps) {
  const classes = `${baseClasses} ${variantClasses[variant]} ${className}`;

  if ("href" in props && props.href) {
    const { href, ...rest } = props;
    return (
      <Link href={href} className={classes} {...rest}>
        {props.children}
      </Link>
    );
  }

  const { ...rest } = props as ButtonAsButton;
  return (
    <button className={classes} {...rest}>
      {props.children}
    </button>
  );
}
