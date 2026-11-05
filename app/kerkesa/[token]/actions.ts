"use server";

import { redirect } from "next/navigation";
import { after } from "next/server";
import { headers } from "next/headers";
import { customerAccept, customerCancel, customerDecline, customerReply, findByToken, WorkflowError } from "@/lib/booking/requests";
import { notifyOwnerUpdate } from "@/lib/booking/notify-owner";
import { looksLikeToken } from "@/lib/booking/tokens";
import { allowRequest } from "@/lib/rate-limit";

// Every action is authorised only by the unguessable status-link token in the form.
async function guard(formData: FormData): Promise<string> {
  const token = formData.get("token");
  if (!looksLikeToken(token)) redirect("/");
  const ip = (await headers()).get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  if (!allowRequest(`kerkesa-action:${ip}`, Date.now(), 20)) redirect(`/kerkesa/${token}?gabim=shume`);
  return token;
}

async function run(token: string, fn: () => Promise<void>, ok: string, notify?: string) {
  let target = `/kerkesa/${token}?u=${ok}`;
  try {
    await fn();
    if (notify) {
      const r = await findByToken(token);
      if (r) after(() => notifyOwnerUpdate(r.id, notify));
    }
  } catch (e) {
    target = `/kerkesa/${token}?gabim=${e instanceof WorkflowError ? "veprimi" : "teknik"}`;
  }
  redirect(target);
}

export async function acceptProposal(formData: FormData) {
  const token = await guard(formData);
  await run(token, () => customerAccept(token, String(formData.get("proposalId"))), "pranuar", "Klienti pranoi ofertën e rishikuar");
}

export async function declineProposal(formData: FormData) {
  const token = await guard(formData);
  await run(token, () => customerDecline(token, String(formData.get("proposalId")), String(formData.get("reason") ?? "")), "refuzuar", "Klienti nuk e pranoi ofertën");
}

export async function cancelRequest(formData: FormData) {
  const token = await guard(formData);
  if (formData.get("confirm") !== "po") redirect(`/kerkesa/${token}?gabim=konfirmo`);
  await run(token, () => customerCancel(token, String(formData.get("reason") ?? "")), "anuluar", "Klienti e anuloi kërkesën");
}

export async function replyToRequest(formData: FormData) {
  const token = await guard(formData);
  const message = String(formData.get("message") ?? "").trim();
  if (message.length < 2) redirect(`/kerkesa/${token}?gabim=bosh`);
  await run(token, () => customerReply(token, message), "derguar", "Klienti u përgjigj");
}
