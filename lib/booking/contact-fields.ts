import { z } from "zod";

// Optional email on a booking request: empty means "not given"; anything else must look like an
// address. Shown only in /admin and the owner email, never in calendar events or analytics.
export const optionalEmail = z
  .string()
  .trim()
  .max(120, "Email-i është shumë i gjatë.")
  .optional()
  .transform((v) => v || undefined)
  .pipe(z.email("Email-i nuk duket i saktë.").optional());
