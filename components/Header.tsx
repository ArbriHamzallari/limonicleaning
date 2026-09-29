"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "./Logo";
import { Button } from "./Button";
import { WhatsAppLink } from "./WhatsAppLink";
import { mainNav } from "@/lib/nav";
import { waMessages } from "@/lib/whatsapp-messages";

export function Header() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-bg/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        <Link href="/" onClick={() => setOpen(false)} aria-label="Limoni Cleaning — kryefaqja">
          <Logo />
        </Link>

        <nav className="hidden items-center gap-6 lg:flex" aria-label="Kryesore">
          {mainNav.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  active ? "text-primary" : "text-text"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <WhatsAppLink
            message={waMessages.general}
            source="header"
            className="inline-flex items-center justify-center gap-2 rounded-full border border-primary/30 px-5 py-3 text-sm font-semibold text-primary transition-colors hover:border-primary hover:bg-primary hover:text-white"
          >
            WhatsApp
          </WhatsAppLink>
          <Button href="/rezervo" variant="primary">
            Rezervo
          </Button>
        </div>

        <button
          type="button"
          className="inline-flex items-center justify-center rounded-lg p-2 text-text lg:hidden"
          aria-label={open ? "Mbyll menynë" : "Hap menynë"}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth={1.8}>
            {open ? (
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5M3.75 17.25h16.5" />
            )}
          </svg>
        </button>
      </div>

      {open && (
        <nav
          className="border-t border-border bg-bg px-4 py-4 lg:hidden"
          aria-label="Kryesore (mobile)"
        >
          <ul className="flex flex-col gap-1">
            {mainNav.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="block rounded-lg px-3 py-2.5 text-sm font-medium text-text hover:bg-bg-muted"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
          <div className="mt-4 flex flex-col gap-2">
            <Button href="/rezervo" variant="primary" className="w-full" onClick={() => setOpen(false)}>
              Rezervo tani
            </Button>
            <WhatsAppLink
              message={waMessages.general}
              source="header_mobile"
              className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-primary/30 px-6 py-3 text-sm font-semibold text-primary transition-colors hover:border-primary hover:bg-primary hover:text-white"
            >
              Na shkruaj në WhatsApp
            </WhatsAppLink>
          </div>
        </nav>
      )}
    </header>
  );
}
