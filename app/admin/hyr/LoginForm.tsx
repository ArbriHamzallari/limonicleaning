"use client";

import { useActionState } from "react";
import { login } from "./actions";

const field = "mt-2 block min-h-12 w-full rounded-lg border-2 border-border bg-bg px-4 text-lg focus:border-primary";

export function LoginForm() {
  const [error, action, pending] = useActionState(login, null);
  return (
    <form action={action} className="mt-8 grid gap-5 rounded-lg border border-border p-6">
      <div>
        <label htmlFor="username" className="block text-lg font-semibold">
          Përdoruesi
        </label>
        <input id="username" name="username" autoComplete="username" required className={field} />
      </div>
      <div>
        <label htmlFor="password" className="block text-lg font-semibold">
          Fjalëkalimi
        </label>
        <input id="password" name="password" type="password" autoComplete="current-password" required className={field} />
      </div>
      {error && (
        <p role="alert" className="font-medium text-red-700">
          {error}
        </p>
      )}
      <button disabled={pending} className="inline-flex min-h-14 items-center justify-center rounded-full bg-primary px-7 text-lg font-semibold text-white disabled:opacity-50">
        {pending ? "Po hyhet…" : "Hyr"}
      </button>
    </form>
  );
}
