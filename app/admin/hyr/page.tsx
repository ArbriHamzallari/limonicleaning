import { redirect } from "next/navigation";
import { adminConfigured, currentAdmin } from "@/lib/admin/auth";
import { LoginForm } from "./LoginForm";

export const metadata = { title: "Hyrja" };

export default async function LoginPage() {
  if (await currentAdmin()) redirect("/admin/kerkesa");
  return (
    <div className="mx-auto max-w-md">
      <h1 className="text-3xl font-extrabold tracking-tight">Paneli i kërkesave</h1>
      {adminConfigured() ? (
        <LoginForm />
      ) : (
        <p className="mt-6 rounded-lg bg-bg-muted p-5">
          Hyrja nuk është konfiguruar ende. Vendosni <code>ADMIN_USERS</code> dhe <code>ADMIN_SESSION_SECRET</code> në Vercel (shih{" "}
          <code>docs/booking-system.md</code>).
        </p>
      )}
    </div>
  );
}
