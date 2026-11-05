import { describe, expect, it } from "vitest";
import { checkFile, signatureMatches, MAX_PHOTO_BYTES, MAX_VIDEO_BYTES } from "@/lib/booking/media";

const bytes = (...b: number[]) => new Uint8Array(b);
const ascii = (s: string) => new Uint8Array([...s].map((c) => c.charCodeAt(0)));

describe("upload rules", () => {
  it("accepts phone photos and videos within limits, by type or extension", () => {
    expect(checkFile("a.jpg", "image/jpeg", 1000)).toMatchObject({ ok: true, kind: "photo" });
    expect(checkFile("IMG_1.HEIC", "", 2_000_000)).toMatchObject({ ok: true, type: "image/heic" });
    expect(checkFile("v.mov", "video/quicktime", 50_000_000)).toMatchObject({ ok: true, kind: "video" });
  });
  it("rejects other types, empty files and oversize files with Albanian messages", () => {
    expect(checkFile("a.pdf", "application/pdf", 10)).toMatchObject({ ok: false });
    expect(checkFile("a.jpg", "image/jpeg", 0)).toMatchObject({ ok: false });
    expect(checkFile("a.jpg", "image/jpeg", MAX_PHOTO_BYTES + 1)).toMatchObject({ ok: false, error: expect.stringContaining("15 MB") });
    expect(checkFile("a.mp4", "video/mp4", MAX_VIDEO_BYTES + 1)).toMatchObject({ ok: false, error: expect.stringContaining("100 MB") });
  });
  it("checks the real file signature, not the name", () => {
    expect(signatureMatches("image/jpeg", bytes(0xff, 0xd8, 0xff, 0xe0))).toBe(true);
    expect(signatureMatches("image/jpeg", ascii("<html>"))).toBe(false);
    expect(signatureMatches("image/png", bytes(0x89, 0x50, 0x4e, 0x47))).toBe(true);
    expect(signatureMatches("video/mp4", ascii("\0\0\0\x18ftypisom"))).toBe(true);
    expect(signatureMatches("image/heic", ascii("\0\0\0\x18ftypheic"))).toBe(true);
    expect(signatureMatches("image/webp", ascii("RIFF\0\0\0\0WEBP"))).toBe(true);
  });
});
