"use client";

import { useEffect, useRef, useState } from "react";
import { Pause, Play, Volume2, VolumeX } from "lucide-react";
import { cn } from "@/lib/utils";

type ShowcaseVideoProps = {
  src: string;
  poster: string;
  title: string;
  aspect?: "landscape" | "portrait";
  className?: string;
  videoClassName?: string;
  autoPlay?: boolean;
  showControls?: boolean;
};

/**
 * Self-hosted looping MP4 showcase player with explicit aspect-ratio framing,
 * poster fallback, reduced-motion support, and accessible play/mute controls.
 */
export function ShowcaseVideo({
  src,
  poster,
  title,
  aspect = "landscape",
  className,
  videoClassName,
  autoPlay = true,
  showControls = true,
}: ShowcaseVideoProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);

  useEffect(() => {
    const el = videoRef.current;
    if (!el) return;

    const prefersReducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (autoPlay && !prefersReducedMotion) {
      const playPromise = el.play();
      if (playPromise && typeof playPromise.catch === "function") {
        playPromise.catch(() => {
          setIsPlaying(false);
        });
      }
    }
  }, [autoPlay]);

  function togglePlay() {
    const el = videoRef.current;
    if (!el) return;
    if (el.paused) {
      el.play().catch(() => {});
    } else {
      el.pause();
    }
  }

  function toggleMute() {
    const el = videoRef.current;
    if (!el) return;
    const nextMuted = !el.muted;
    el.muted = nextMuted;
    setIsMuted(nextMuted);
    if (!nextMuted && el.paused) {
      el.play().catch(() => {});
    }
  }

  return (
    <div
      className={cn(
        "group relative w-full overflow-hidden bg-black",
        aspect === "portrait" ? "aspect-[478/850]" : "aspect-[848/478]",
        className,
      )}
    >
      <video
        ref={videoRef}
        poster={poster}
        loop
        muted={isMuted}
        playsInline
        preload="metadata"
        aria-label={title}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onClick={showControls ? togglePlay : undefined}
        className={cn(
          "h-full w-full object-cover",
          showControls && "cursor-pointer",
          videoClassName,
        )}
      >
        <source src={src} type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {showControls && (
        <div className="pointer-events-none absolute inset-x-0 bottom-0 flex items-center justify-end gap-1.5 bg-gradient-to-t from-black/70 via-black/20 to-transparent p-2.5 opacity-90 transition-opacity group-hover:opacity-100">
          <button
            type="button"
            onClick={togglePlay}
            aria-label={isPlaying ? `Pause ${title}` : `Play ${title}`}
            className="pointer-events-auto flex h-7 w-7 cursor-pointer items-center justify-center rounded-full border border-white/25 bg-black/70 text-white backdrop-blur-xs transition hover:border-[#f3c474] hover:text-[#f3c474]"
          >
            {isPlaying ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5 translate-x-px" />}
          </button>
          <button
            type="button"
            onClick={toggleMute}
            aria-label={isMuted ? `Unmute ${title}` : `Mute ${title}`}
            className="pointer-events-auto flex h-7 w-7 cursor-pointer items-center justify-center rounded-full border border-white/25 bg-black/70 text-white backdrop-blur-xs transition hover:border-[#f3c474] hover:text-[#f3c474]"
          >
            {isMuted ? <VolumeX className="h-3.5 w-3.5" /> : <Volume2 className="h-3.5 w-3.5 text-[#f3c474]" />}
          </button>
        </div>
      )}
    </div>
  );
}
