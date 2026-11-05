import { describe, expect, it } from "vitest";
import { detectInstallMode } from "@/lib/install";

const UA = {
  iphoneSafari:
    "Mozilla/5.0 (iPhone; CPU iPhone OS 18_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.5 Mobile/15E148 Safari/604.1",
  iphoneChrome:
    "Mozilla/5.0 (iPhone; CPU iPhone OS 18_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) CriOS/140.0 Mobile/15E148 Safari/604.1",
  iphoneInstagram:
    "Mozilla/5.0 (iPhone; CPU iPhone OS 18_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 Instagram 350.0",
  iphoneFacebook:
    "Mozilla/5.0 (iPhone; CPU iPhone OS 18_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 [FBAN/FBIOS;FBAV/480.0]",
  ipadDesktopUa:
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.5 Safari/605.1.15",
  androidChrome:
    "Mozilla/5.0 (Linux; Android 15; Pixel 9) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0 Mobile Safari/537.36",
  androidWebView:
    "Mozilla/5.0 (Linux; Android 15; Pixel 9; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/140.0 Mobile Safari/537.36",
  desktopChrome:
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0 Safari/537.36",
};

const mode = (userAgent: string, extra: Partial<Parameters<typeof detectInstallMode>[0]> = {}) =>
  detectInstallMode({ userAgent, standalone: false, hasPrompt: false, maxTouchPoints: 0, ...extra });

describe("install shortcut feature detection", () => {
  it("shows nothing once running from the Home Screen", () => {
    expect(mode(UA.iphoneSafari, { standalone: true })).toBe("installed");
    expect(mode(UA.androidChrome, { standalone: true, hasPrompt: true })).toBe("installed");
  });

  it("uses the real prompt only when Chromium provided one", () => {
    expect(mode(UA.androidChrome, { hasPrompt: true })).toBe("prompt");
    expect(mode(UA.androidChrome)).toBe("android-manual");
  });

  it("gives Safari instructions on iPhone and iPad, never a fake button", () => {
    expect(mode(UA.iphoneSafari)).toBe("ios-safari");
    expect(mode(UA.ipadDesktopUa, { maxTouchPoints: 5 })).toBe("ios-safari");
    expect(mode(UA.iphoneChrome)).toBe("ios-other");
  });

  it("sends in-app browsers to Safari/Chrome first", () => {
    expect(mode(UA.iphoneInstagram)).toBe("in-app");
    expect(mode(UA.iphoneFacebook)).toBe("in-app");
    expect(mode(UA.androidWebView, { hasPrompt: true })).toBe("in-app");
  });

  it("is not offered on desktop", () => {
    expect(mode(UA.desktopChrome)).toBe("desktop");
    expect(mode(UA.ipadDesktopUa, { maxTouchPoints: 0 })).toBe("desktop");
  });
});
