// Human-readable booking reference. Generated server-side and only ever returned to the
// client after the booking row has actually been persisted — unlike the prototype, which
// generated a reference in the browser with nothing behind it.
export function generateBookingReference(date = new Date()): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  const suffix = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `LC-${y}${m}${d}-${suffix}`;
}
