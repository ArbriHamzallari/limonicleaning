// The founder video ("Arbri flet për pastrimin me themel"). Not recorded yet: `founderVideo`
// stays null and the player renders nothing (no dead play button, no "coming soon" block).
//
// To publish it (docs/vsl-production.md):
//  1. Put the compressed MP4, a real poster JPG and the Albanian WebVTT captions in public/.
//  2. Fill in the object below with the paths, the transcript and the MEASURED runtime
//     (ffprobe), never an estimate.
//  3. The files are checked at build time: if any is missing, the player stays hidden.

import { existsSync } from "node:fs";
import { join } from "node:path";

export interface FounderVideoConfig {
  src: string;
  poster: string;
  /** Albanian captions, WebVTT. Required: the clip has speech. */
  captions: string;
  /** Measured with ffprobe. Shown on the page, so it must be the real length. */
  durationSeconds?: number;
  /** Plain-text transcript shown under the player. */
  transcript: string[];
  title: string;
}

export const founderVideo: FounderVideoConfig | null = null;

function inPublic(path: string) {
  return existsSync(join(process.cwd(), "public", path.replace(/^\//, "")));
}

/** The config, only if every file it points to is really in public/. Server-only. */
export function publishedFounderVideo(config: FounderVideoConfig | null = founderVideo): FounderVideoConfig | null {
  if (!config) return null;
  if (!config.transcript.length) return null;
  return [config.src, config.poster, config.captions].every(inPublic) ? config : null;
}
