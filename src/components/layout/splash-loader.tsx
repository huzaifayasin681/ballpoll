"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

/**
 * Full-screen brand splash loader shown once per initial document load in RootLayout.
 * Does not replay during client-side Next.js route transitions.
 */
export function SplashLoader() {
  const [phase, setPhase] = useState<"visible" | "fading" | "done">("visible");

  useEffect(() => {
    const prefersReducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const holdMs = prefersReducedMotion ? 150 : 1200;
    const fadeMs = prefersReducedMotion ? 150 : 420;

    const fadeTimer = window.setTimeout(() => setPhase("fading"), holdMs);
    const doneTimer = window.setTimeout(() => setPhase("done"), holdMs + fadeMs);

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setPhase("fading");
      }
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
        "fixed inset-0 z-[100] flex flex-col items-center justify-center overflow-hidden bg-[#06140f] px-6 text-white transition-all duration-400 ease-out",
        phase === "fading"
          ? "pointer-events-none scale-[1.02] opacity-0"
          : "pointer-events-auto scale-100 opacity-100",
      )}
    >
      {/* Ambient emerald & gold spotlight backdrop */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#24916a]/20 blur-3xl animate-pulse" />
        <div className="animate-gps-float absolute left-1/3 top-1/3 h-64 w-64 rounded-full bg-[#f3c474]/12 blur-3xl" />
      </div>

      {/* Center animated logo emblem */}
      <div className="relative z-10 flex flex-col items-center text-center">
        <div className="relative flex h-28 w-28 items-center justify-center sm:h-32 sm:w-32">
          {/* Outer rotating gold-emerald dashed orbital ring */}
          <div
            aria-hidden="true"
            className="animate-gps-spin absolute inset-0 rounded-full border-2 border-dashed border-[#f3c474]/60"
          />
          {/* Inner counter-rotating emerald arc ring */}
          <div
            aria-hidden="true"
            className="animate-gps-spin-reverse absolute inset-2 rounded-full border-2 border-transparent border-t-[#68d8ae] border-r-[#f3c474]"
          />
          {/* Soft halo */}
          <div
            aria-hidden="true"
            className="absolute inset-4 rounded-full bg-[#68d8ae]/20 blur-md animate-pulse"
          />

          {/* Main 8 Ball Pool Logo */}
          <div className="relative h-20 w-20 overflow-hidden rounded-2xl border-2 border-[#f3c474]/60 bg-[#0a2219] shadow-2xl ring-2 ring-white/10 sm:h-22 sm:w-22">
            <img
              src="/images/pool/logo-8ball.jpg"
              alt="GlobalPoolStore 8 Ball Pool Logo"
              className="h-full w-full object-cover"
            />
            <div
              aria-hidden="true"
              className="animate-gps-shimmer pointer-events-none absolute inset-y-0 left-0 w-1/2 bg-gradient-to-r from-transparent via-white/30 to-transparent"
            />
          </div>
        </div>

        {/* Brand name & tagline */}
        <div className="mt-6 space-y-1.5">
          <p className="text-2xl font-extrabold tracking-tight text-white sm:text-3xl">
            GlobalPool
            <span className="bg-gradient-to-r from-[#f8d896] via-[#f3c474] to-[#e2a33b] bg-clip-text text-transparent">
              Store
            </span>
          </p>
          <p className="font-mono text-[10px] font-bold uppercase tracking-[0.28em] text-[#68d8ae] sm:text-[11px]">
            8 Ball Pool Elite Marketplace
          </p>
        </div>

        {/* Animated progress bar */}
        <div className="mt-6 w-52 sm:w-60">
          <div className="h-1.5 w-full overflow-hidden rounded-full border border-white/10 bg-black/50">
            <div className="animate-gps-progress h-full w-full rounded-full bg-gradient-to-r from-[#68d8ae] via-[#f3c474] to-[#68d8ae]" />
          </div>
          <p className="mt-2.5 font-mono text-[10px] tracking-wider text-[#9eb2a8]">
            Preparing tables, cues &amp; live deals…
          </p>
        </div>
      </div>
    </div>
  );
}
