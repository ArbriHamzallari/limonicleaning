// A clientRequestId returns the existing status link to whoever presents it again, so it must
// be unguessable: crypto only, never a Math.random fallback.
export function newId(): string {
  if (typeof crypto.randomUUID === "function") return crypto.randomUUID();
  const b = crypto.getRandomValues(new Uint8Array(16));
  return Array.from(b, (x) => x.toString(16).padStart(2, "0")).join("");
}
