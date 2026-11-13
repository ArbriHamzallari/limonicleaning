// Motion on the homepage hero (the reel and the rotating heading) is allowed unless the visitor
// asks for reduced motion or Save-Data. Both components use this one check, so whenever the reel
// is off (and shows no pause button) the heading is still as well. Browser only.
export function motionAllowed(): boolean {
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const saveData = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData;
  return !reduced && !saveData;
}
