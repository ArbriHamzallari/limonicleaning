"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { WhatsAppIcon, PhoneIcon } from "./icons";
import { business, whatsappLink } from "@/lib/business";
import { serviceForPath } from "@/lib/service-index";
import { waMessageFor } from "@/lib/whatsapp-messages";
import { trackEvent } from "@/lib/analytics";

const itemClasses = "flex min-h-14 items-center justify-center gap-2 rounded-lg text-lg font-semibold";

function isTextField(el: EventTarget | null) {
  return el instanceof HTMLElement && el.matches("input, textarea, select, [contenteditable='true']");
}

// Two equal actions on phones: WhatsApp and a call. Hidden on /kerko-oferte (the form is the
// page) and while a field has focus, so it never sits on top of the on-screen keyboard.
export function MobileStickyCta() {
  const pathname = usePathname();
  const [typing, setTyping] = useState(false);

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

  if (pathname === "/kerko-oferte" || typing) return null;

  const service = serviceForPath(pathname);

  return (
    <div
      className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-2 gap-2 border-t border-border bg-bg px-2 pt-2 lg:hidden"
      style={{ paddingBottom: "max(0.5rem, env(safe-area-inset-bottom))" }}
    >
      <a
        href={whatsappLink(waMessageFor(service))}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => trackEvent("whatsapp_click", { service: service ?? "pergjithshem", placement: "mobile_sticky" })}
        className={`${itemClasses} bg-whatsapp text-white`}
      >
        <WhatsAppIcon className="h-5 w-5" />
        WhatsApp
      </a>
      <a
        href={`tel:${business.phoneE164}`}
        onClick={() => trackEvent("phone_click", { placement: "mobile_sticky" })}
        className={`${itemClasses} border-2 border-primary/30 text-primary`}
      >
        <PhoneIcon className="h-5 w-5" />
        Telefono
      </a>
    </div>
  );
}
