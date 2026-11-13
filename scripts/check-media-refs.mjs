// Fails when code references a public/ image or video that is missing or not tracked by git.
// A missing file would ship an empty image slot; an untracked one would pass locally and 404 on
// Vercel. Run before every commit (npm run check:media).
// Limit: only quoted paths are checked. A path joined by concatenation is not seen, and a
// template literal with ${...} is reported as missing; keep public/ media paths as literals.
import { execFileSync } from "node:child_process";
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";

const roots = ["app", "components", "lib"];
const pattern = /["'`](\/(?:images|videos)\/[^"'`\s?#]+)["'`]/g;

function walk(dir, out = []) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) walk(p, out);
    else if (/\.(tsx?|mjs|js)$/.test(name)) out.push(p);
  }
  return out;
}

const refs = new Map();
for (const file of roots.flatMap((r) => walk(r))) {
  for (const m of readFileSync(file, "utf8").matchAll(pattern)) {
    if (!refs.has(m[1])) refs.set(m[1], file);
  }
}

const tracked = new Set(execFileSync("git", ["ls-files", "public"], { encoding: "utf8" }).split("\n").filter(Boolean));
const problems = [];
for (const [ref, file] of refs) {
  const path = `public${ref}`;
  if (!existsSync(path)) problems.push(`missing    ${path}  (referenced in ${file})`);
  else if (!tracked.has(path)) problems.push(`untracked  ${path}  (referenced in ${file})`);
}

if (problems.length) {
  console.error(`check:media: ${problems.length} referenced file(s) would not ship:\n  ${problems.join("\n  ")}`);
  process.exit(1);
}
console.log(`check:media: ${refs.size} referenced files, all present and tracked.`);
