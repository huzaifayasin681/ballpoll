"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

/**
 * Full-screen Clubhouse crest loader shown briefly on initial document load.
 */
export function SplashLoader() {
  const [phase, setPhase] = useState<"visible" | "fading" | "done">("visible");

  useEffect(() => {
    const prefersReducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const holdMs = prefersReducedMotion ? 100 : 750;
    const fadeMs = prefersReducedMotion ? 120 : 350;

    const fadeTimer = window.setTimeout(() => setPhase("fading"), holdMs);
    const doneTimer = window.setTimeout(() => setPhase("done"), holdMs + fadeMs);

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setPhase("fading");
    }
    window.addEventListener("keydown", onKeyDown);

    return () => {
      window.clearTimeout(fadeTimer);
      window.clearTimeout(doneTimer);
      window.removeEventListener("keydown", onKeyDown);
    };
  }, []);

  if (phase === "done") return null;

  return (
    <div
      role="status"
      aria-live="polite"
      aria-label="Loading GlobalPoolStore"
      onClick={() => setPhase("fading")}
      className={cn(
        "fixed inset-0 z-[100] flex flex-col items-center justify-center bg-felt-deep px-6 text-paper transition-opacity duration-350 ease-out",
        phase === "fading" ? "pointer-events-none opacity-0" : "pointer-events-auto opacity-100",
      )}
    >
      <div className="flex flex-col items-center text-center">
        <div className="relative flex h-20 w-20 items-center justify-center">
          <div
            aria-hidden="true"
            className="animate-gps-spin absolute inset-0 rounded-full border border-dashed border-brass/50"
          />
          <div className="flex h-14 w-14 items-center justify-center rounded-full border border-brass bg-felt font-display text-xl font-bold text-brass shadow-lg">
            GP
          </div>
        </div>

        <p className="mt-5 font-display text-2xl font-semibold tracking-tight text-paper">
          GlobalPool<span className="text-brass">.</span>
        </p>
        <p className="mt-1 text-[10px] font-semibold uppercase tracking-[0.28em] text-brass/85">
          The Clubhouse · Est. 2026
        </p>

        <div className="mt-5 h-[2px] w-44 overflow-hidden bg-paper/15">
          <div className="animate-gps-progress h-full w-full bg-brass" />
        </div>
      </div>
    </div>
  );
}
