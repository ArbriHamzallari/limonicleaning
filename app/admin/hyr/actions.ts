"use server";

import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { adminConfigured, endSession, startSession, verifyPassword } from "@/lib/admin/auth";
import { allowRequest } from "@/lib/rate-limit";

export async function login(_prev: string | null, formData: FormData): Promise<string | null> {
  if (!adminConfigured()) return "Hyrja nuk është konfiguruar.";
  const ip = (await headers()).get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  if (!allowRequest(`admin-login:${ip}`, Date.now(), 5)) return "Shumë përpjekje. Provoni pas 10 minutash.";
  const username = String(formData.get("username") ?? "");
  const password = String(formData.get("password") ?? "");
  if (!verifyPassword(username, password)) return "Emri ose fjalëkalimi nuk është i saktë.";
  await startSession(username);
  redirect("/admin/kerkesa");
}

export async function logout() {
  await endSession();
  redirect("/admin/hyr");
}
