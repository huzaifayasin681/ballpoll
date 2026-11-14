"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  KeyRound,
  ShieldCheck,
  Sparkles,
  Zap,
} from "lucide-react";
import { cn } from "@/lib/utils";

const SPOTLIGHT_SLIDES = [
  {
    id: "coins",
    tab: "Coins & Cash",
    eyebrow: "INSTANT TOP-UP · 24/7",
    title: "Up to 10 Billion Coins via Unique ID",
    description:
      "Zero password required. Enter your 10-digit Miniclip Unique ID at checkout and track your coin or cash transfer live.",
    statLabel: "Avg. Delivery",
    statValue: "1–2 Hours",
    badge: "BAN-SAFE METHOD",
    image: "/images/pool/instant-coin-topups.jpg",
    href: "/store/coins-cash",
    cta: "Shop Coins & Cash",
  },
  {
    id: "cues",
    tab: "Legendary Cues",
    eyebrow: "20 / 20 MAXED STATS",
    title: "Unlock Archangel, Archon & Firestorm Cues",
    description:
      "Max out Force, Aim, Spin & Time to 10/10 with up to 100% Coin-Back Guarantee and zero cue recharge fees.",
    statLabel: "Coin-Back Perk",
    statValue: "Up to 100%",
    badge: "LEVEL 5 MAX",
    image: "/images/pool/legendary-cues-maxed.jpg",
    href: "/store/cues-unlocks",
    cta: "Explore Legendary Cues",
  },
  {
    id: "boosting",
    tab: "Ring Boosting",
    eyebrow: "100% HAND-PLAYED PROS",
    title: "Berlin, Rome & Venice Championship Rings",
    description:
      "Played manually by top-1% pool pros with zero bots or cheats. AES-256 encrypted vault auto-purged after delivery.",
    statLabel: "Safety Record",
    statValue: "Zero Bots",
    badge: "PRO BOOSTERS",
    image: "/images/pool/pro-account-boosting.jpg",
    href: "/store/boosting",
    cta: "Book Ring Boost",
  },
  {
    id: "assist",
    tab: "Aim Assist VIP",
    eyebrow: "PRECISION GUIDELINES",
    title: "Extended Cushion Shot Lines & VIP Keys",
    description:
      "Instant license key delivery for Weekly Pass, Monthly VIP, and Ultimate Season Pass with 24/7 anti-ban updates.",
    statLabel: "Key Activation",
    statValue: "Instant",
    badge: "VIP ACCESS",
    image: "/images/pool/gameplay-assist-tools.jpg",
    href: "/store/vip-access",
    cta: "Get VIP Access Key",
  },
  {
    id: "bundles",
    tab: "Combo Deals",
    eyebrow: "SAVE UP TO 40%",
    title: "All-in-One Gamer & King Master Bundles",
    description:
      "Combine Billions of Coins, all 20 Legendary Cues, Cash, and Berlin/Venice Rings into one discounted mega bundle.",
    statLabel: "Bundle Savings",
    statValue: "Up to 40%",
    badge: "CODE: WELCOME10",
    image: "/images/pool/combo-bundles-deals.jpg",
    href: "/deals",
    cta: "Claim Combo Deals",
  },
] as const;

/**
 * Auto-rotating marketplace spotlight banner on the landing page with
 * crossfading visuals, animated slide progress bars, and interactive controls.
 */
export function LiveSpotlightCarousel() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    const prefersReducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion || paused) return;

    const id = window.setInterval(() => {
      setIndex((prev) => (prev + 1) % SPOTLIGHT_SLIDES.length);
    }, 4000);
    return () => window.clearInterval(id);
  }, [paused]);

  const slide = SPOTLIGHT_SLIDES[index];

  return (
    <section
      aria-label="Live Marketplace Spotlight"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      className="relative overflow-hidden rounded-2xl border border-[#1f4537] bg-[#071812] text-white shadow-lg ring-1 ring-white/5"
    >
      {/* Ambient drifting glow */}
      <div className="pointer-events-none absolute inset-0">
        <div className="animate-gps-float absolute -left-16 -top-16 h-64 w-64 rounded-full bg-[#24916a]/20 blur-3xl" />
        <div
          className="animate-gps-float absolute -bottom-20 right-12 h-64 w-64 rounded-full bg-[#f3c474]/15 blur-3xl"
          style={{ animationDelay: "2s" }}
        />
      </div>

      {/* Top interactive department switcher tabs */}
      <div className="relative z-10 flex flex-wrap items-center justify-between gap-2 border-b border-white/10 bg-black/30 px-4 py-3 sm:px-6">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 font-mono text-[10px] font-bold uppercase tracking-widest text-[#68d8ae]">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#68d8ae] opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-[#68d8ae]" />
            </span>
            Live Rotating Spotlight
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          {SPOTLIGHT_SLIDES.map((s, idx) => {
            const active = idx === index;
            return (
              <button
                key={s.id}
                type="button"
                onClick={() => setIndex(idx)}
                className={cn(
                  "cursor-pointer rounded-full border px-2.5 py-1 font-mono text-[10px] font-semibold transition-all",
                  active
                    ? "border-[#f3c474]/70 bg-[#f3c474]/15 text-[#f3c474] shadow-xs"
                    : "border-white/10 bg-white/5 text-[#9eb2a8] hover:border-white/25 hover:text-white",
                )}
              >
                {s.tab}
              </button>
            );
          })}
        </div>
      </div>

      {/* Animated Slide Content */}
      <div className="relative z-10 grid items-center gap-6 p-5 sm:p-7 lg:grid-cols-12 lg:gap-8 lg:p-8">
        <div key={slide.id} className="animate-gps-slide-up lg:col-span-7">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-[#f3c474]/40 bg-black/50 px-3 py-1 font-mono text-[10px] font-bold uppercase tracking-widest text-[#f3c474]">
              <Sparkles className="h-3 w-3" /> {slide.eyebrow}
            </span>
            <span className="rounded-full border border-[#68d8ae]/35 bg-[#0f3024] px-2.5 py-1 font-mono text-[10px] font-bold uppercase tracking-wider text-[#68d8ae]">
              {slide.badge}
            </span>
          </div>

          <h2 className="mt-3.5 text-2xl font-extrabold tracking-tight text-white sm:text-3xl">
            {slide.title}
          </h2>
          <p className="mt-2 max-w-xl text-xs leading-relaxed text-[#c6d3cd] sm:text-sm">
            {slide.description}
          </p>

          <div className="mt-5 flex flex-wrap items-center gap-3">
            <Link
              href={slide.href}
              className="relative inline-flex h-10 items-center justify-center gap-2 overflow-hidden rounded-xl bg-gradient-to-b from-[#f6cf86] to-[#e5ad4c] px-5 text-xs font-bold text-[#1b1406] shadow-md transition hover:brightness-105"
            >
              <span
                aria-hidden="true"
                className="animate-gps-shimmer pointer-events-none absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-transparent via-white/45 to-transparent"
              />
              <span className="relative z-10 inline-flex items-center gap-1.5">
                {slide.cta} <ArrowRight className="h-3.5 w-3.5" />
              </span>
            </Link>

            <div className="rounded-xl border border-white/10 bg-black/35 px-3.5 py-1.5">
              <p className="text-[10px] uppercase tracking-wider text-[#9eb2a8]">{slide.statLabel}</p>
              <p className="font-mono text-xs font-extrabold text-[#f3c474]">{slide.statValue}</p>
            </div>

            <div className="ml-auto flex items-center gap-1.5">
              <button
                type="button"
                aria-label="Previous spotlight slide"
                onClick={() =>
                  setIndex((prev) => (prev - 1 + SPOTLIGHT_SLIDES.length) % SPOTLIGHT_SLIDES.length)
                }
                className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg border border-white/15 bg-black/40 text-white transition hover:border-[#f3c474]/60 hover:text-[#f3c474]"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                type="button"
                aria-label="Next spotlight slide"
                onClick={() => setIndex((prev) => (prev + 1) % SPOTLIGHT_SLIDES.length)}
                className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg border border-white/15 bg-black/40 text-white transition hover:border-[#f3c474]/60 hover:text-[#f3c474]"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Right: Animated Preview Image Frame */}
        <div className="lg:col-span-5">
          <Link
            href={slide.href}
            className="group relative block aspect-[16/9] overflow-hidden rounded-xl border border-[#f3c474]/40 bg-black/60 shadow-2xl ring-1 ring-white/10"
          >
            <img
              key={slide.image}
              src={slide.image}
              alt={slide.title}
              className="animate-gps-ken-burns h-full w-full object-cover"
            />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-black/10" />
            <div className="pointer-events-none absolute bottom-3 left-3 right-3 flex items-center justify-between gap-2">
              <span className="rounded-md border border-white/15 bg-black/70 px-2.5 py-1 font-mono text-[10px] font-bold text-white backdrop-blur-xs">
                {slide.tab}
              </span>
              <span className="inline-flex items-center gap-1 rounded-md bg-[#f3c474] px-2.5 py-1 font-mono text-[10px] font-extrabold text-[#1b1406]">
                View <ArrowRight className="h-3 w-3" />
              </span>
            </div>
          </Link>
        </div>
      </div>

      {/* Bottom 4-second slide progress indicator */}
      <div className="relative z-10 grid grid-cols-5 gap-1.5 px-5 pb-4 sm:px-7">
        {SPOTLIGHT_SLIDES.map((s, idx) => (
          <button
            key={s.id}
            type="button"
            aria-label={`Show ${s.tab}`}
            onClick={() => setIndex(idx)}
            className="h-1 cursor-pointer overflow-hidden rounded-full bg-white/10"
          >
            {idx === index && (
              <div
                key={`${index}-${paused ? "paused" : "run"}`}
                className={cn(
                  "h-full w-full rounded-full bg-gradient-to-r from-[#68d8ae] to-[#f3c474]",
                  !paused && "animate-gps-progress-4s",
                )}
              />
            )}
            {idx < index && <div className="h-full w-full rounded-full bg-[#68d8ae]/60" />}
          </button>
        ))}
      </div>
    </section>
  );
}

const DELIVERY_STEPS = [
  {
    step: "01",
    Icon: KeyRound,
    title: "Pick Your Pack & Enter Unique ID",
    body: "For coin, cash, and VIP key orders, only your 10-digit Miniclip Unique ID is needed—no password required.",
  },
  {
    step: "02",
    Icon: ShieldCheck,
    title: "Instant Encrypted Checkout",
    body: "Pay with JazzCash, Easypaisa, Bank Transfer, or USDT/Binance Pay. Credentials for cue/ring boosts are AES-256 encrypted.",
  },
  {
    step: "03",
    Icon: Zap,
    title: "1–2 Hour Transfer & Live Tracking",
    body: "Follow your order in real time from Queued → In Progress → Delivered with instant email confirmation.",
  },
] as const;

/**
 * Interactive 3-step delivery strip that cycles an active spotlight across
 * steps 01 -> 02 -> 03 to keep the fulfillment flow lively and scannable.
 */
export function AnimatedDeliverySteps() {
  const [activeStep, setActiveStep] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    const prefersReducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion || paused) return;

    const id = window.setInterval(() => {
      setActiveStep((prev) => (prev + 1) % DELIVERY_STEPS.length);
    }, 2800);
    return () => window.clearInterval(id);
  }, [paused]);

  return (
    <div
      className="grid gap-4 md:grid-cols-3"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {DELIVERY_STEPS.map(({ step, Icon, title, body }, idx) => {
        const active = idx === activeStep;
        return (
          <div
            key={step}
            onMouseEnter={() => setActiveStep(idx)}
            className={cn(
              "relative flex flex-col justify-between overflow-hidden rounded-xl border p-5 transition-all duration-300",
              active
                ? "-translate-y-0.5 border-brand bg-brand-soft/40 shadow-md ring-1 ring-brand/25"
                : "border-border bg-background/60 hover:border-border-hover",
            )}
          >
            {active && (
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-[#68d8ae] via-[#f3c474] to-[#68d8ae]"
              />
            )}
            <div>
              <div className="flex items-center justify-between">
                <span
                  className={cn(
                    "flex h-10 w-10 items-center justify-center rounded-xl border transition-transform duration-300",
                    active
                      ? "scale-105 border-brand bg-brand text-white shadow-sm"
                      : "border-brand-border bg-brand-soft text-brand",
                  )}
                >
                  <Icon className="h-5 w-5" />
                </span>
                <span
                  className={cn(
                    "inline-flex items-center gap-1.5 font-mono text-xs font-extrabold transition-colors",
                    active ? "text-brand" : "text-muted",
                  )}
                >
                  {active && <span className="h-1.5 w-1.5 rounded-full bg-brand animate-ping" />}
                  STEP {step}
                </span>
              </div>
              <h3 className="mt-4 text-sm sm:text-base font-bold text-foreground">{title}</h3>
              <p className="mt-1.5 text-xs leading-relaxed text-muted">{body}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
