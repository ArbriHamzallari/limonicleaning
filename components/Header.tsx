"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "./Logo";
import { Button } from "./Button";
import { WhatsAppButton } from "./WhatsAppButton";
import { PhoneButton } from "./PhoneButton";
import { mainNav } from "@/lib/nav";
import { serviceForPath } from "@/lib/service-index";

export function Header() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const service = serviceForPath(pathname);

  // Full-screen sheet on mobile: lock page scroll behind it and let Escape close it.
  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const close = () => setOpen(false);

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-bg">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6 lg:h-20 lg:px-8">
        <Link href="/" onClick={close} className="inline-flex min-h-12 items-center" aria-label="Limoni Cleaning, kryefaqja">
          <Logo />
        </Link>

        <nav className="hidden items-center gap-6 lg:flex" aria-label="Kryesore">
          {mainNav.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={`inline-flex min-h-12 items-center text-base font-medium hover:text-primary ${
                  active ? "text-primary underline decoration-2 underline-offset-8" : "text-text"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="hidden items-center gap-4 lg:flex">
          <PhoneButton placement="header" variant="link" className="no-underline! text-text hover:text-primary" />
          <Button href="/kerko-oferte" variant="secondary">
            Kërko ofertë
          </Button>
        </div>

        <div className="flex items-center gap-2 lg:hidden">
          <PhoneButton placement="header_mobile" iconOnly />
          <button
            type="button"
            className="inline-flex h-12 min-w-12 items-center justify-center gap-2 rounded-full border-2 border-border px-3 text-base font-semibold text-text"
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => setOpen((v) => !v)}
          >
            <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden>
              {open ? (
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5M3.75 17.25h16.5" />
              )}
            </svg>
            {open ? "Mbyll" : "Menu"}
          </button>
        </div>
      </div>

      {open && (
        <div
          id="mobile-menu"
          className="fixed inset-x-0 top-16 bottom-0 z-50 overflow-y-auto bg-bg px-4 pt-4 pb-10 lg:hidden"
        >
          <div className="grid gap-3">
            <WhatsAppButton service={service} placement="mobile_menu" size="lg" className="w-full" />
            <PhoneButton placement="mobile_menu" size="lg" className="w-full">
              Telefononi: 068 900 7252
            </PhoneButton>
          </div>

          <nav aria-label="Kryesore" className="mt-6">
            <ul className="border-t border-border">
              {[{ label: "Kryefaqja", href: "/" }, ...mainNav, { label: "Pyetje të shpeshta", href: "/faq" }].map(
                (item) => (
                  <li key={item.href} className="border-b border-border">
                    <Link
                      href={item.href}
                      onClick={close}
                      aria-current={pathname === item.href ? "page" : undefined}
                      className="flex min-h-14 items-center justify-between text-lg font-medium text-text aria-[current=page]:text-primary"
                    >
                      {item.label}
                      <span aria-hidden className="text-text-muted">
                        ›
                      </span>
                    </Link>
                  </li>
                ),
              )}
            </ul>
          </nav>

          <Button href="/kerko-oferte" variant="secondary" size="lg" className="mt-6 w-full" onClick={close}>
            Kërko ofertë
          </Button>
        </div>
      )}
    </header>
  );
}
