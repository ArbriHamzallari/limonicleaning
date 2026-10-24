#!/usr/bin/env node
/**
 * Prepare the 24 October cleaning media for the website.
 *
 * Usage:
 *   npm run media:oct24
 *   npm run media:oct24 -- "/path/to/raw/source/folder"
 *
 * Requires ffmpeg (including libx264) on PATH. Reads original IMG files from anywhere
 * under media-source/ (iPhone HEIC photos: export an upright IMG_xxxx.jpg next to them first), strips metadata/audio and writes browser-ready files in public/.
 * Originals stay in media-source/ and must not be committed (GPS and personal metadata).
 */
import { existsSync, mkdirSync, readdirSync } from "node:fs";
import { resolve, join, dirname } from "node:path";
import { spawnSync } from "node:child_process";

const sourceDir = resolve(process.argv[2] || "media-source");
const root = process.cwd();
const out = (path) => join(root, "public", path);

const jobs = [
  { input: "IMG_3468.jpg", output: "images/ekipi-pastrim-tavani-apartament-i-ri.jpg", kind: "photo" },
  { input: "IMG_3463.jpg", output: "images/ekipi-pastrim-dysheme-apartament-i-ri.jpg", kind: "photo" },
  { input: "IMG_3464.MOV", output: "pastrim-pllakash-apartament-i-ri", kind: "video" },
  { input: "IMG_3466.MOV", output: "pamje-banjo-apartament-i-ri", kind: "video" },
  { input: "IMG_3467.MOV", output: "pamje-apartament-pas-punimeve", kind: "video", posterAt: 2.6 },
  { input: "IMG_3440.MOV", output: "kuzhine-profesionale-gjendja-fillestare", kind: "video" },
  { input: "IMG_3441.MOV", output: "ekipi-pastrim-kuzhine-profesionale", kind: "video" },
  { input: "IMG_3442.MOV", output: "pastrim-siperfaqe-inox-1", kind: "video" },
  { input: "IMG_3443.MOV", output: "pastrim-siperfaqe-inox-2", kind: "video", posterAt: 4.6 },
];

function run(args) {
  const child = spawnSync("ffmpeg", ["-hide_banner", "-loglevel", "error", "-y", ...args], { stdio: "inherit" });
  if (child.error) throw child.error;
  if (child.status !== 0) throw new Error(`ffmpeg exited with status ${child.status}`);
}

function indexFiles(dir, index) {
  for (const file of readdirSync(dir, { withFileTypes: true })) {
    const filePath = join(dir, file.name);
    if (file.isDirectory()) indexFiles(filePath, index);
    else if (file.isFile()) {
      const normalized = file.name.toLowerCase();
      if (!index.has(normalized)) index.set(normalized, filePath);
    }
  }
}

if (!existsSync(sourceDir)) {
  console.error(`Source directory not found: ${sourceDir}\nPut originals in media-source/ or pass your source folder path.`);
  process.exit(1);
}

const index = new Map();
indexFiles(sourceDir, index);
let converted = 0;
let missing = 0;

for (const job of jobs) {
  const input = index.get(job.input.toLowerCase());
  if (!input) {
    console.warn(`Missing: ${job.input} (skipped; website falls back to existing media)`);
    missing++;
    continue;
  }

  try {
    if (job.kind === "photo") {
      const dest = out(job.output);
      mkdirSync(dirname(dest), { recursive: true });
      run([
        "-i", input, "-map_metadata", "-1",
        "-vf", "scale=1600:1600:force_original_aspect_ratio=decrease:force_divisible_by=2",
        "-frames:v", "1", "-q:v", "4", dest,
      ]);
      console.log(`Image: ${job.input} -> public/${job.output}`);
    } else {
      const video = out(`videos/${job.output}.mp4`);
      const poster = out(`images/${job.output}.jpg`);
      mkdirSync(dirname(video), { recursive: true });
      mkdirSync(dirname(poster), { recursive: true });

      // Default ffmpeg autorotation honors the phone display matrix. No sound or GPS.
      run([
        "-i", input, "-map_metadata", "-1", "-map", "0:v:0",
        "-vf", "scale=720:720:force_original_aspect_ratio=decrease:force_divisible_by=2,fps=20",
        "-c:v", "libx264", "-preset", "veryfast", "-crf", "27",
        "-pix_fmt", "yuv420p", "-an", "-movflags", "+faststart", video,
      ]);
      // Poster frames were picked by eye (1 s unless a clearer moment is set per job).
      run(["-ss", String(job.posterAt ?? 1), "-i", video, "-map_metadata", "-1", "-frames:v", "1", "-q:v", "4", poster]);
      console.log(`Video: ${job.input} -> public/videos/${job.output}.mp4 + poster`);
    }
    converted++;
  } catch (error) {
    console.error(`Failed to process ${job.input}: ${String(error)}`);
    process.exitCode = 1;
  }
}

console.log(`\nProcessed ${converted} files. Missing source files: ${missing}.`);
console.log("To publish: git add public/images public/videos && git commit -m 'Add October cleaning media' && git push");
