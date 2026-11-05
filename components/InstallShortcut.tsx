"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { detectInstallMode, type InstallMode } from "@/lib/install";
import { trackEvent } from "@/lib/analytics";

// "Shto Limoni në ekranin kryesor": an optional Home Screen shortcut that opens the quote page.
// Not a native widget and never required. Offered only in the mobile menu, the footer and
// after a successful request; never as a pop-up and never in standalone mode.
//
// Chromium's `beforeinstallprompt` can fire before React mounts, so InstallPromptListener
// (mounted once in the layout) keeps it in this module until someone asks.

interface DeferredPrompt extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

let deferred: DeferredPrompt | null = null;
let installed = false;
const listeners = new Set<() => void>();
const emit = () => listeners.forEach((l) => l());
const subscribe = (l: () => void) => {
  listeners.add(l);
  return () => listeners.delete(l);
};

export function InstallPromptListener() {
  useEffect(() => {
    const onPrompt = (e: Event) => {
      e.preventDefault(); // we show our own button; no mini-infobar
      deferred = e as DeferredPrompt;
      emit();
    };
    const onInstalled = () => {
      installed = true;
      deferred = null;
      trackEvent("install_accepted", { source: "appinstalled" });
      emit();
    };
    window.addEventListener("beforeinstallprompt", onPrompt);
    window.addEventListener("appinstalled", onInstalled);
    return () => {
      window.removeEventListener("beforeinstallprompt", onPrompt);
      window.removeEventListener("appinstalled", onInstalled);
    };
  }, []);
  return null;
}

const DISMISS_KEY = "limoni.install.dismissed";

function currentMode(): InstallMode {
  const standalone =
    installed ||
    window.matchMedia("(display-mode: standalone)").matches ||
    (navigator as Navigator & { standalone?: boolean }).standalone === true;
  return detectInstallMode({
    userAgent: navigator.userAgent,
    standalone,
    hasPrompt: !!deferred,
    maxTouchPoints: navigator.maxTouchPoints,
  });
}

/** null during server render and hydration; the real mode right after. */
function useInstallMode(): InstallMode | null {
  return useSyncExternalStore(subscribe, currentMode, () => null);
}

function readDismissed(): boolean {
  if (typeof window === "undefined") return false;
  try {
    return localStorage.getItem(DISMISS_KEY) === "1";
  } catch {
    return false; // storage blocked: just show it
  }
}

function Instructions({ mode }: { mode: InstallMode }) {
  if (mode === "ios-safari")
    return (
      <ol className="mt-3 list-decimal space-y-1 pl-6">
        <li>
          Shtypni butonin <strong>…</strong> poshtë ose lart në Safari, pastaj <strong>Share</strong> (Ndaj). Në disa
          pamje butoni Share duket direkt.
        </li>
        <li>
          Zgjidhni <strong>Add to Home Screen</strong> (Shto në ekranin bazë). Nëse nuk e shihni, rrëshqisni poshtë te{" "}
          <strong>Edit Actions</strong>.
        </li>
        <li>
          Aktivizoni <strong>Open as Web App</strong>, nëse ju shfaqet, dhe shtypni <strong>Add</strong>.
        </li>
      </ol>
    );
  if (mode === "ios-other")
    return (
      <p className="mt-3">
        Hapni menynë <strong>Share</strong> (Ndaj) të shfletuesit dhe zgjidhni <strong>Add to Home Screen</strong>. Nëse
        nuk e gjeni, hapeni faqen në Safari.
      </p>
    );
  if (mode === "in-app")
    return (
      <p className="mt-3">
        Ky shfletues brenda aplikacionit nuk e lejon. Hapeni faqen në Safari ose Chrome (nga menyja <strong>…</strong>{" "}
        ose <strong>⋮</strong>, &quot;Hape në shfletues&quot;) dhe provoni atje.
      </p>
    );
  return (
    <p className="mt-3">
      Hapni menynë <strong>⋮</strong> të shfletuesit dhe zgjidhni <strong>Shto në ekranin kryesor</strong> ose{" "}
      <strong>Instalo aplikacionin</strong>. Nëse nuk e shihni, ndoshta Limoni është shtuar tashmë.
    </p>
  );
}

export function InstallShortcut({
  placement,
  variant = "inline",
  className = "",
}: {
  placement: string;
  /** "card": dismissible box after a successful request. "inline": menu/footer disclosure. */
  variant?: "card" | "inline";
  className?: string;
}) {
  const mode = useInstallMode();
  const [open, setOpen] = useState(false);
  // Only the post-success card remembers a dismissal (a per-viewer convenience).
  const [dismissed, setDismissed] = useState(() => variant === "card" && readDismissed());

  const visible = mode !== null && mode !== "installed" && mode !== "desktop" && !dismissed;

  useEffect(() => {
    if (visible) trackEvent("install_offer_view", { placement, mode: mode! });
  }, [visible, placement, mode]);

  if (!visible) return null;

  async function install() {
    trackEvent("install_click", { placement, mode: mode! });
    if (mode === "prompt" && deferred) {
      const prompt = deferred;
      deferred = null;
      await prompt.prompt();
      const { outcome } = await prompt.userChoice;
      trackEvent(outcome === "accepted" ? "install_accepted" : "install_dismissed", { placement });
      emit();
      return;
    }
    setOpen((v) => !v);
  }

  function dismiss() {
    setDismissed(true);
    trackEvent("install_dismissed", { placement });
    try {
      localStorage.setItem(DISMISS_KEY, "1");
    } catch {
      // ignore
    }
  }

  const label = "Shto Limoni në ekranin kryesor";
  const help = "Një ikonë në telefon që hap direkt faqen e kërkesës për ofertë. Nuk është e detyrueshme.";

  if (variant === "card") {
    return (
      <div className={`rounded-lg border border-border bg-bg p-4 ${className}`}>
        <p className="font-semibold">Për herën tjetër</p>
        <p className="mt-1 text-text-muted">{help}</p>
        <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2">
          <button
            type="button"
            onClick={install}
            aria-expanded={mode === "prompt" ? undefined : open}
            className="inline-flex min-h-12 items-center font-semibold text-primary underline decoration-primary/40 decoration-2 underline-offset-4"
          >
            {label}
          </button>
          <button type="button" onClick={dismiss} className="inline-flex min-h-12 items-center text-text-muted underline underline-offset-4">
            Jo, faleminderit
          </button>
        </div>
        {open && <Instructions mode={mode!} />}
      </div>
    );
  }

  return (
    <div className={className}>
      <button
        type="button"
        onClick={install}
        aria-expanded={mode === "prompt" ? undefined : open}
        className="inline-flex min-h-12 items-center text-left font-semibold text-primary underline decoration-primary/40 decoration-2 underline-offset-4"
      >
        {label}
      </button>
      {open && (
        <div className="mt-1 text-base text-text-muted">
          <p>{help}</p>
          <Instructions mode={mode!} />
        </div>
      )}
    </div>
  );
}
