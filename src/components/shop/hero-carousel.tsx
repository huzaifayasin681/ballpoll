"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, Check, ShieldCheck, ShoppingCart, Sparkles, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { WhatsAppCta } from "@/components/ui/whatsapp-cta";
import { useCart } from "@/components/cart/cart-context";
import { formatMoney, type CurrencyCode, type Rates } from "@/lib/currency";
import { site } from "@/lib/site";
import { cn } from "@/lib/utils";

type QuickVariant = { id: string; label: string; priceCents: number };

const HERO_ROTATING_SLIDES = [
  {
    badge: "#1 8 Ball Pool Marketplace",
    headline: "Maxed Gear & Coins.",
  },
  {
    badge: "1–2h Unique ID Transfer",
    headline: "20/20 Legendary Cues.",
  },
  {
    badge: "100% Hand-Played Pros",
    headline: "Berlin & Venice Rings.",
  },
  {
    badge: "Up to 40% Off Combos",
    headline: "Pro Aim Assist Keys.",
  },
] as const;

const heroShowcaseCards = [
  {
    href: "/store/coins-cash",
    src: "/images/pool/logo-8ball.jpg",
    title: "Coins & Cash",
    sub: "Up to 10B · Unique ID",
  },
  {
    href: "/store/cues-unlocks",
    src: "/images/pool/cues-legendary.png",
    title: "20/20 Legendary Cues",
    sub: "Archangel · Firestorm",
  },
  {
    href: "/store/boosting",
    src: "/images/pool/tables-venues.png",
    title: "Berlin & Venice Rings",
    sub: "Pro Champion Boost",
  },
];

export function HeroQuickOrder({
  coinProduct,
  currency,
  rates,
}: {
  coinProduct: { slug: string; name: string; image: string; variants: QuickVariant[] } | null;
  currency: CurrencyCode;
  rates: Rates;
}) {
  const variants = coinProduct?.variants.slice(0, 6) ?? [];
  const [selectedId, setSelectedId] = useState(variants[2]?.id ?? variants[0]?.id ?? "");
  const [justAdded, setJustAdded] = useState(false);
  const [phraseIdx, setPhraseIdx] = useState(0);
  const [activeCardIdx, setActiveCardIdx] = useState(0);
  const [cardsPaused, setCardsPaused] = useState(false);
  const { add } = useCart();
  const router = useRouter();
  const selected = variants.find((v) => v.id === selectedId) ?? variants[0];

  useEffect(() => {
    const prefersReducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) return;

    const timer = window.setInterval(() => {
      setPhraseIdx((i) => (i + 1) % HERO_ROTATING_SLIDES.length);
    }, 3200);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    const prefersReducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion || cardsPaused) return;

    const timer = window.setInterval(() => {
      setActiveCardIdx((i) => (i + 1) % heroShowcaseCards.length);
    }, 2600);
    return () => window.clearInterval(timer);
  }, [cardsPaused]);

  const currentSlide = HERO_ROTATING_SLIDES[phraseIdx];

  return (
    <div className="relative overflow-hidden rounded-2xl border border-[#1f4537] bg-[#081913] text-[#f5f3ed] shadow-lg ring-1 ring-white/5">
      {/* Real 8 Ball Pool Backdrop Video + Multi-layered Emerald & Gold Lighting */}
      <div className="pointer-events-none absolute inset-0">
        <video
          autoPlay
          loop
          muted
          playsInline
          preload="metadata"
          poster="/images/pool/tables-venues.png"
          aria-hidden="true"
          className="h-full w-full object-cover opacity-30"
        >
          <source src="/videos/instant-coin-topups.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-r from-[#06140f]/95 via-[#091f17]/88 to-[#071812]/92" />
        <div className="animate-gps-float absolute -left-24 -top-24 h-80 w-80 rounded-full bg-[#24916a]/25 blur-3xl" />
        <div
          className="animate-gps-float absolute -bottom-24 right-10 h-80 w-80 rounded-full bg-[#f3c474]/20 blur-3xl"
          style={{ animationDelay: "1.8s" }}
        />
      </div>

      {/* Main Hero Content Grid */}
      <div className="relative z-10 grid items-center gap-8 p-5 sm:gap-10 sm:p-10 lg:grid-cols-12 lg:p-12">
        {/* Left: Headline, Interactive Category Previews & Actions */}
        <div className="lg:col-span-7">
          <div className="inline-flex items-center gap-2.5 rounded-full border border-[#68d8ae]/35 bg-[#0d2d22]/85 py-1 pl-1.5 pr-3.5 shadow-sm backdrop-blur-md">
            <img
              src="/images/pool/logo-8ball.jpg"
              alt="8 Ball Pool"
              className="h-6 w-6 rounded-full border border-white/20 object-cover"
            />
            <span
              key={currentSlide.badge}
              className="animate-gps-slide-up font-mono text-[11px] font-bold uppercase tracking-widest text-[#68d8ae]"
            >
              {currentSlide.badge}
            </span>
          </div>

          <h1 className="mt-4 max-w-xl text-3xl font-extrabold tracking-tight text-white sm:text-5xl sm:leading-[1.08]">
            Dominate Every Table with{" "}
            <span
              key={currentSlide.headline}
              className="animate-gps-slide-up inline-block bg-gradient-to-r from-[#f8d896] via-[#f3c474] to-[#e2a33b] bg-clip-text text-transparent"
            >
              {currentSlide.headline}
            </span>
          </h1>

          <p className="mt-3.5 max-w-lg text-xs leading-relaxed text-[#c6d3cd] sm:text-base">
            Instant 8 Ball Pool coin and cash top-ups using only your 10-digit Miniclip Unique ID, 20/20 maxed Legendary Cues, and verified championship accounts.
          </p>

          {/* Interactive 3-Card Real 8 Ball Pool Showcase Strip */}
          <div
            className="mt-6 grid grid-cols-1 gap-2.5 sm:grid-cols-3"
            onMouseEnter={() => setCardsPaused(true)}
            onMouseLeave={() => setCardsPaused(false)}
          >
            {heroShowcaseCards.map((card, idx) => {
              const isSpotlight = idx === activeCardIdx;
              return (
                <Link
                  key={card.title}
                  href={card.href}
                  onMouseEnter={() => setActiveCardIdx(idx)}
                  className={cn(
                    "group relative flex items-center gap-2.5 overflow-hidden rounded-xl border p-2 pr-3 backdrop-blur-md transition-all duration-300",
                    isSpotlight
                      ? "-translate-y-0.5 border-[#f3c474]/70 bg-black/65 shadow-md ring-1 ring-[#f3c474]/30"
                      : "border-white/12 bg-black/40 hover:border-[#f3c474]/50 hover:bg-black/60",
                  )}
                >
                  <div className="relative h-11 w-14 shrink-0 overflow-hidden rounded-lg border border-white/15">
                    <img
                      src={card.src}
                      alt={card.title}
                      className={cn(
                        "h-full w-full object-cover transition-transform duration-500",
                        isSpotlight ? "scale-110" : "group-hover:scale-110",
                      )}
                    />
                  </div>
                  <div className="min-w-0">
                    <p
                      className={cn(
                        "truncate text-xs font-bold transition-colors",
                        isSpotlight ? "text-[#f3c474]" : "text-white group-hover:text-[#f3c474]",
                      )}
                    >
                      {card.title}
                    </p>
                    <p className="truncate text-[10px] text-[#9eb2a8]">{card.sub}</p>
                  </div>
                  {isSpotlight && (
                    <span
                      aria-hidden="true"
                      className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-[#68d8ae] shadow-[0_0_8px_#68d8ae]"
                    />
                  )}
                </Link>
              );
            })}
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <Link
              href="/store"
              className="relative inline-flex h-11 flex-1 sm:flex-initial items-center justify-center gap-2 overflow-hidden rounded-xl bg-gradient-to-b from-[#f6cf86] to-[#e5ad4c] px-6 text-xs sm:text-sm font-bold text-[#1b1406] shadow-md transition hover:brightness-105"
            >
              <span
                aria-hidden="true"
                className="animate-gps-shimmer pointer-events-none absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-transparent via-white/45 to-transparent"
              />
              <span className="relative z-10 inline-flex items-center gap-2">
                Browse Full Catalog <ArrowRight className="h-4 w-4" />
              </span>
            </Link>
            <Link
              href="/deals"
              className="inline-flex h-11 flex-1 sm:flex-initial items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/8 px-5 text-xs sm:text-sm font-semibold text-white backdrop-blur-xs transition hover:border-white/35 hover:bg-white/14"
            >
              <Sparkles className="h-4 w-4 text-[#f3c474]" /> Flash Deals
            </Link>
            <WhatsAppCta
              message={`Hi ${site.name}! I want to order 8 Ball Pool coins, cues, or VIP tools.`}
              label="WhatsApp"
              showNumber
              className="w-full sm:w-auto"
            />
          </div>

          {/* 3-stat trust bar */}
          <div className="mt-7 grid grid-cols-3 gap-3 border-t border-white/10 pt-5 text-[11px] text-[#b0bdb6] sm:text-xs">
            <div>
              <p className="font-mono text-xs sm:text-sm font-bold text-white">1–2 Hours</p>
              <p className="text-[10px] sm:text-[11px] text-[#8fa59b]">Express Coin Transfer</p>
            </div>
            <div>
              <p className="font-mono text-xs sm:text-sm font-bold text-[#68d8ae]">Unique ID Only</p>
              <p className="text-[10px] sm:text-[11px] text-[#8fa59b]">No Password for Coins</p>
            </div>
            <div>
              <p className="font-mono text-xs sm:text-sm font-bold text-[#f3c474]">4.9 / 5.0 ★</p>
              <p className="text-[10px] sm:text-[11px] text-[#8fa59b]">Verified Pool Players</p>
            </div>
          </div>
        </div>

        {/* Right: Elevated Floating Quick Coin Top-Up Card */}
        {coinProduct && selected && (
          <div className="relative overflow-hidden rounded-2xl border border-white/15 bg-[#0e241c]/95 p-4 sm:p-6 shadow-2xl backdrop-blur-xl lg:col-span-5">
            <div className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[#5cd4a8] via-[#f3c474] to-[#5cd4a8]" />

            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 pb-3.5">
              <div className="flex items-center gap-3">
                <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-xl border border-[#f3c474]/40 shadow-sm">
                  <img
                    src="/images/pool/logo-8ball.jpg"
                    alt="8 Ball Pool Coins"
                    className="h-full w-full object-cover"
                  />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-sm sm:text-base font-bold text-white">Express Coin Top-Up</h2>
                    <span className="inline-flex items-center gap-1 rounded-full bg-[#194d3b] px-2 py-0.5 font-mono text-[9px] font-bold uppercase tracking-wider text-[#68d8ae]">
                      <span className="h-1.5 w-1.5 rounded-full bg-[#68d8ae] animate-ping" />
                      Instant Queue
                    </span>
                  </div>
                  <p className="text-[11px] text-[#9cb0a6]">Enter your 10-digit Unique ID at checkout</p>
                </div>
              </div>
              <Link
                href={`/product/${coinProduct.slug}`}
                className="font-mono text-[11px] font-semibold text-[#f3c474] hover:underline"
              >
                All Packs →
              </Link>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-2.5">
              {variants.map((v, idx) => {
                const active = v.id === selected.id;
                const popular = idx === 2;
                return (
                  <button
                    key={v.id}
                    type="button"
                    onClick={() => setSelectedId(v.id)}
                    className={cn(
                      "relative flex flex-col items-start justify-between gap-1 rounded-xl border p-3 text-left transition-all duration-150 cursor-pointer",
                      active
                        ? "border-[#68d8ae] bg-gradient-to-b from-[#1a4a3a] to-[#13382b] text-white shadow-sm ring-1 ring-[#68d8ae]/40"
                        : "border-white/10 bg-black/25 text-[#c4cec8] hover:border-white/25 hover:bg-black/40 hover:text-white",
                    )}
                  >
                    {popular && (
                      <span className=" -top-2 right-2 absolute rounded-full bg-[#f3c474] px-1.5 py-0.2 font-mono text-[8px] font-extrabold uppercase tracking-wider text-[#1b1406]">
                        Popular
                      </span>
                    )}
                    <div className="flex w-full items-center justify-between gap-1">
                      <span className="text-xs font-bold text-white">{v.label}</span>
                      {active && <Check className="h-3.5 w-3.5 shrink-0 text-[#68d8ae]" />}
                    </div>
                    <span className="font-mono text-xs font-bold text-[#f3c474]">
                      {formatMoney(v.priceCents, currency, rates)}
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="mt-4 flex flex-col gap-3 rounded-xl border border-white/10 bg-black/30 p-3.5 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-[10px] font-medium uppercase tracking-wider text-[#9cb0a6]">Selected Package</p>
                <p className="mt-0.5 text-sm sm:text-base font-extrabold text-white">
                  {selected.label} ·{" "}
                  <span className="font-mono text-[#f3c474]">{formatMoney(selected.priceCents, currency, rates)}</span>
                </p>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  size="sm"
                  variant="secondary"
                  className="h-9 flex-1 sm:flex-initial border-white/20 bg-white/10 text-white hover:bg-white/15"
                  onClick={() => {
                    add({
                      variantId: selected.id,
                      productSlug: coinProduct.slug,
                      productName: coinProduct.name,
                      variantLabel: selected.label,
                      image: coinProduct.image,
                    });
                    setJustAdded(true);
                    setTimeout(() => setJustAdded(false), 1500);
                  }}
                >
                  {justAdded ? <Check className="h-3.5 w-3.5 text-[#68d8ae]" /> : <ShoppingCart className="h-3.5 w-3.5" />}
                  {justAdded ? "Added" : "Add"}
                </Button>
                <button
                  type="button"
                  onClick={() => {
                    add({
                      variantId: selected.id,
                      productSlug: coinProduct.slug,
                      productName: coinProduct.name,
                      variantLabel: selected.label,
                      image: coinProduct.image,
                    });
                    router.push("/checkout");
                  }}
                  className="inline-flex h-9 flex-1 sm:flex-initial cursor-pointer items-center justify-center gap-1.5 rounded-lg bg-gradient-to-b from-[#f6cf86] to-[#e5ad4c] px-4 text-xs font-bold text-[#1b1406] shadow-xs transition hover:brightness-105"
                >
                  <Zap className="h-3.5 w-3.5" /> Buy Now
                </button>
              </div>
            </div>

            <div className="mt-3 flex items-center justify-center gap-1.5 text-center text-[11px] text-[#9cb0a6]">
              <ShieldCheck className="h-3.5 w-3.5 text-[#68d8ae]" />
              <span>Protected by 100% Delivery or Money-Back Guarantee</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
