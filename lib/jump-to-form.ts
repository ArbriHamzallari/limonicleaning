// "Kërko ofertë / Kërko vlerësim" on a page that has its own form: jump there at once (no
// animated scroll across a long page) and move keyboard/screen-reader focus to the form's
// heading, without opening the phone keyboard. Returns false when the page has no form, so the
// caller can fall back to its normal link (/kerko-oferte?sherbimi=…).
export function jumpToLeadForm(): boolean {
  const target =
    document.querySelector<HTMLElement>("[data-lead-form-anchor]") ?? document.querySelector<HTMLElement>("[data-lead-form]");
  if (!target) return false;
  target.scrollIntoView({ block: "start", behavior: "instant" });
  if (!target.hasAttribute("tabindex")) target.setAttribute("tabindex", "-1");
  target.focus({ preventScroll: true });
  return true;
}
