"use server";

import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/admin/auth";
import {
  approveOriginal,
  askForInfo,
  closeRequest,
  rotateCustomerLink,
  rotateJobSheet,
  sendRevision,
  setAddress,
  setFeasibility,
  setPlanning,
  WorkflowError,
} from "@/lib/booking/requests";
import { syncCalendar } from "@/lib/booking/calendar-sync";
import { isValidYmd } from "@/lib/booking/time";

const str = (f: FormData, k: string) => String(f.get(k) ?? "").trim();
const lines = (f: FormData, k: string) =>
  str(f, k)
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean)
    .slice(0, 40)
    .map((l) => l.slice(0, 200));
const int = (f: FormData, k: string) => {
  const n = Number(str(f, k));
  return Number.isInteger(n) && n > 0 ? n : null;
};

async function act(f: FormData, ok: string, fn: (id: string, user: string) => Promise<unknown>) {
  const user = await requireAdmin();
  const id = str(f, "id");
  let target = `/admin/kerkesa/${id}?ok=${ok}`;
  try {
    await fn(id, user);
  } catch (e) {
    const msg = e instanceof WorkflowError ? e.message : "Veprimi dështoi. Provoni përsëri.";
    if (!(e instanceof WorkflowError)) console.error("[admin] action failed:", e instanceof Error ? e.name : "unknown");
    target = `/admin/kerkesa/${id}?gabim=${encodeURIComponent(msg)}`;
  }
  redirect(target);
}

export async function feasibilityAction(f: FormData) {
  await act(f, "u-ruajt", (id, u) => setFeasibility(id, u, f.get("ok") === "po", str(f, "note")));
}

export async function planningAction(f: FormData) {
  await act(f, "u-ruajt", (id, u) => setPlanning(id, u, int(f, "crews"), int(f, "minutes")));
}

export async function approveAction(f: FormData) {
  await act(f, "u-miratua", (id, u) => approveOriginal(id, u, { time: str(f, "time") || undefined, override: f.get("override") === "po" }));
}

export async function reviseAction(f: FormData) {
  await act(f, "oferta-u-dergua", (id, u) => {
    const date = str(f, "date");
    if (date && !isValidYmd(date)) throw new WorkflowError("Data nuk është e saktë.");
    return sendRevision(id, u, {
      priceLek: int(f, "price"),
      priceNote: str(f, "priceNote") || undefined,
      included: lines(f, "included"),
      excluded: lines(f, "excluded"),
      clarify: lines(f, "clarify"),
      date: date || undefined,
      time: str(f, "time") || undefined,
      durationMinutes: int(f, "minutes") ?? undefined,
      message: str(f, "message") || undefined,
    });
  });
}

export async function infoAction(f: FormData) {
  const message = str(f, "message");
  await act(f, "pyetja-u-ruajt", (id, u) => {
    if (message.length < 3) throw new WorkflowError("Shkruani pyetjen për klientin.");
    return askForInfo(id, u, message);
  });
}

export async function closeAction(f: FormData) {
  const to = str(f, "to") as "DECLINED" | "CANCELLED" | "COMPLETED";
  if (!["DECLINED", "CANCELLED", "COMPLETED"].includes(to)) redirect("/admin/kerkesa");
  await act(f, "u-mbyll", (id, u) => {
    if (to !== "COMPLETED" && f.get("confirm") !== "po") throw new WorkflowError("Shënoni kutinë për ta konfirmuar.");
    return closeRequest(id, u, to, str(f, "reason"));
  });
}

export async function addressAction(f: FormData) {
  await act(f, "u-ruajt", (id, u) => setAddress(id, u, str(f, "address")));
}

export async function syncAction(f: FormData) {
  await act(f, "kalendari", (id) => syncCalendar(id));
}

export async function rotateLinkAction(f: FormData) {
  await act(f, "lidhje-e-re", (id, u) => rotateCustomerLink(id, u));
}

export async function rotateJobSheetAction(f: FormData) {
  await act(f, "flete-e-re", (id, u) => rotateJobSheet(id, u));
}
