"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { WhatsAppIcon, PhoneIcon } from "./icons";
import { business, whatsappLink } from "@/lib/business";
import { pageKeyForPath } from "@/lib/service-index";
import { waMessageFor } from "@/lib/whatsapp-messages";
import { trackEvent } from "@/lib/analytics";

function isTextField(el: EventTarget | null) {
  return el instanceof HTMLElement && el.matches("input, textarea, select, [contenteditable='true']");
}

const side =
  "flex min-h-14 flex-col items-center justify-center gap-0.5 rounded-lg text-base font-semibold leading-tight";

// Phones only. Three labelled actions: WhatsApp, the quote request in the centre (the most
// prominent), and a call. The quote button scrolls to the page's own form when there is one,
// otherwise opens /kerko-oferte with the page's service preselected. Hidden while a field has
// focus (on-screen keyboard). On /kerko-oferte the form is the page, so only WhatsApp and the
// call remain. Body padding in the layout keeps it from covering content, and the bar steps
// aside while a form is on screen so it never sits over fields or the submit button.
export function MobileStickyCta() {
  const pathname = usePathname();
  const [typing, setTyping] = useState(false);
  const [formVisible, setFormVisible] = useState(false);

  useEffect(() => {
    const visible = new Set<Element>();
    const observer = new IntersectionObserver((entries) => {
      for (const e of entries) {
        if (e.isIntersecting) visible.add(e.target);
        else visible.delete(e.target);
      }
      setFormVisible(visible.size > 0);
    });
    const observeAll = () => document.querySelectorAll("[data-lead-form]").forEach((el) => observer.observe(el));
    observeAll();
    // The form swaps for its success message after sending; watch for new form nodes.
    const mutations = new MutationObserver(observeAll);
    mutations.observe(document.body, { childList: true, subtree: true });
    return () => {
      observer.disconnect();
      mutations.disconnect();
      setFormVisible(false);
    };
  }, [pathname]);

  useEffect(() => {
    const onFocusIn = (e: FocusEvent) => setTyping(isTextField(e.target));
    const onFocusOut = () => setTyping(false);
    document.addEventListener("focusin", onFocusIn);
    document.addEventListener("focusout", onFocusOut);
    return () => {
      document.removeEventListener("focusin", onFocusIn);
      document.removeEventListener("focusout", onFocusOut);
    };
  }, []);

  // Private pages (owner panel, status links, job sheets) don't get the marketing bar.
  if (typing || formVisible || /^\/(admin|kerkesa|flete-pune)(\/|$)/.test(pathname)) return null;

  const service = pageKeyForPath(pathname);
  const onQuotePage = pathname === "/kerko-oferte";
  const quoteHref = service ? `/kerko-oferte?sherbimi=${service}` : "/kerko-oferte";

  // Opens the request flow with the page's service preselected.
  function onQuote() {
    trackEvent("quote_cta_click", { service: service ?? "pergjithshem", placement: "mobile_bar" });
  }

  return (
    <nav
      aria-label="Veprime të shpejta"
      className={`fixed inset-x-0 bottom-0 z-40 grid gap-2 border-t border-border bg-bg pt-2 lg:hidden ${
        onQuotePage ? "grid-cols-2" : "grid-cols-[1fr_1.35fr_1fr]"
      }`}
      style={{
        paddingBottom: "max(0.5rem, env(safe-area-inset-bottom))",
        paddingLeft: "max(0.5rem, env(safe-area-inset-left))",
        paddingRight: "max(0.5rem, env(safe-area-inset-right))",
      }}
    >
      <a
        href={whatsappLink(waMessageFor(service))}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => trackEvent("whatsapp_click", { service: service ?? "pergjithshem", placement: "mobile_bar" })}
        className={`${side} text-whatsapp`}
      >
        <WhatsAppIcon className="h-6 w-6" />
        WhatsApp
      </a>
      {!onQuotePage && (
        <a
          href={quoteHref}
          onClick={onQuote}
          className="flex min-h-14 items-center justify-center rounded-full bg-accent px-3 text-center text-lg font-bold leading-tight text-text hover:bg-accent-hover"
        >
          Kërko ofertë
        </a>
      )}
      <a
        href={`tel:${business.phoneE164}`}
        onClick={() => trackEvent("phone_click", { placement: "mobile_bar" })}
        className={`${side} text-primary`}
      >
        <PhoneIcon className="h-6 w-6" />
        Telefono
      </a>
    </nav>
  );
}
