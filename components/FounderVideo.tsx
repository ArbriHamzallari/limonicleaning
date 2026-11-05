import { publishedFounderVideo, type FounderVideoConfig } from "@/lib/founder-video";
import { FounderVideoPlayer } from "./FounderVideoPlayer";

// Server wrapper: renders nothing unless lib/founder-video.ts points at a real video, poster
// and Albanian captions in public/. So there is never a dead play button or a placeholder.
export function FounderVideo({
  placement,
  className = "",
  config,
}: {
  placement: string;
  className?: string;
  /** Override for tests/previews; defaults to the configured founder video. */
  config?: FounderVideoConfig | null;
}) {
  const video = publishedFounderVideo(config === undefined ? undefined : config);
  if (!video) return null;
  return <FounderVideoPlayer video={video} placement={placement} className={className} />;
}
