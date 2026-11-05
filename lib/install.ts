// "Shto Limoni në ekranin kryesor": decides which install help to show. Pure and unit-tested.
// Facts (checked 4 Nov 2026):
//  - Chromium (Chrome, Edge, Samsung Internet) fires `beforeinstallprompt` when the manifest
//    qualifies; no service worker is required (MDN, "Making PWAs installable").
//  - iOS has no install prompt. Safari: tap "…" (or the Share button), "Share",
//    "Add to Home Screen", turn on "Open as Web App", "Add" (Apple iPhone User Guide, iOS 26/27).
//    Since iOS 16.4 Chrome, Edge and Firefox on iPhone can add from their Share menu too.
//  - In-app browsers (Instagram, Facebook, Messenger, TikTok…) can't add to the Home Screen.
//  - Firefox on Android adds a browser shortcut from its menu.

export type InstallMode =
  | "installed" // already running from the Home Screen: show nothing
  | "prompt" // Chromium gave us a deferred prompt: show a real button
  | "ios-safari"
  | "ios-other" // Chrome/Edge/Firefox on iPhone: their own Share menu
  | "in-app" // open in Safari/Chrome first
  | "android-manual" // Android browser without a prompt (already installed, Firefox, etc.)
  | "desktop"; // not offered

export function detectInstallMode(env: {
  userAgent: string;
  standalone: boolean;
  hasPrompt: boolean;
  maxTouchPoints?: number;
}): InstallMode {
  const ua = env.userAgent;
  if (env.standalone) return "installed";
  if (/FBAN|FBAV|FB_IAB|Instagram|Messenger|Line\/|TikTok|musical_ly|Snapchat|; wv\)/i.test(ua)) return "in-app";
  if (env.hasPrompt) return "prompt";
  // iPadOS reports a Mac user agent; touch points give it away.
  const isIOS = /iPhone|iPad|iPod/i.test(ua) || (/Macintosh/i.test(ua) && (env.maxTouchPoints ?? 0) > 1);
  if (isIOS) return /CriOS|FxiOS|EdgiOS|OPiOS|GSA\//i.test(ua) ? "ios-other" : "ios-safari";
  if (/Android/i.test(ua)) return "android-manual";
  return "desktop";
}
