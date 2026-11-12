"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/components/cart/cart-context";
import { formatMoney, type CurrencyCode, type Rates } from "@/lib/currency";
import { cn } from "@/lib/utils";

type QuickVariant = { id: string; label: string; priceCents: number };

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
  const { add } = useCart();
  const router = useRouter();
  const selected = variants.find((v) => v.id === selectedId) ?? variants[0];

  return (
    <div className="relative overflow-hidden rounded-xl border border-[#1d3b30] bg-[#0c1f18] text-[#f5f3ed] shadow-sm">
      {/* Real 8 Ball Pool Backdrop Photography + Dark Emerald Studio Vignette */}
      <div className="pointer-events-none absolute inset-0">
        <img
          src="/images/pool/tables-venues.png"
          alt=""
          aria-hidden
          className="h-full w-full object-cover opacity-30"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#091913]/95 via-[#0c1f18]/85 to-[#091913]/90" />
      </div>

      {/* Main Hero Content Grid */}
      <div className="relative z-10 grid items-center gap-7 p-5 sm:gap-10 sm:p-10 lg:grid-cols-12 lg:p-14">
        {/* Left: Clean, Spacious Headline & Actions */}
        <div className="lg:col-span-7">
          <div className="inline-flex items-center gap-2.5 rounded-full border border-white/15 bg-black/35 py-1 pl-1.5 pr-3.5 backdrop-blur-xs">
            <img
              src="/images/pool/logo-8ball.jpg"
              alt="8 Ball Pool"
              className="h-6 w-6 rounded-full object-cover"
            />
            <span className="font-mono text-[11px] sm:text-xs font-semibold uppercase tracking-widest text-[#70cfa9]">
              8 Ball Pool Store &amp; Boosting
            </span>
          </div>

          <h1 className="mt-3.5 max-w-xl text-2xl font-bold tracking-tight text-white sm:mt-4 sm:text-5xl sm:leading-[1.1]">
            Master the Table.
          </h1>

          <p className="mt-3 max-w-lg text-xs leading-relaxed text-[#c4cec8] sm:mt-4 sm:text-base">
            Direct coin and cash top-ups using only your Miniclip Unique ID, maxed legendary cues, and verified Level 150 championship accounts.
          </p>

          {/* Mini real game preview strip */}
          <div className="mt-5 flex items-center gap-2.5">
            {[
              { src: "/images/pool/logo-8ball.jpg", label: "Coins & Cash" },
              { src: "/images/pool/cues-legendary.png", label: "Legendary Cues" },
              { src: "/images/pool/tables-venues.png", label: "Berlin & Venice Rings" },
            ].map((thumb) => (
              <div
                key={thumb.label}
                className="flex items-center gap-2 rounded-lg border border-white/12 bg-black/35 p-1.5 pr-2.5 backdrop-blur-xs"
              >
                <img src={thumb.src} alt={thumb.label} className="h-8 w-10 rounded object-cover" />
                <span className="hidden text-[11px] font-medium text-white/90 sm:inline">{thumb.label}</span>
              </div>
            ))}
          </div>

          <div className="mt-5 flex flex-wrap items-center gap-2.5 sm:mt-6 sm:gap-3">
            <Link
              href="/store"
              className="inline-flex h-10 sm:h-11 flex-1 sm:flex-initial items-center justify-center gap-2 rounded-md bg-[#f3c474] px-5 sm:px-6 text-xs sm:text-sm font-bold text-[#1b1406] transition hover:bg-[#eab557]"
            >
              Explore Store <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/track"
              className="inline-flex h-10 sm:h-11 flex-1 sm:flex-initial items-center justify-center gap-2 rounded-md border border-white/20 bg-white/5 px-4 sm:px-5 text-xs sm:text-sm font-medium text-white backdrop-blur-xs transition hover:bg-white/10"
            >
              Track Order
            </Link>
          </div>

          {/* Minimal 3-stat inline footer */}
          <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2 border-t border-white/10 pt-4 text-[11px] text-[#b0bdb6] sm:mt-8 sm:gap-x-8 sm:pt-5 sm:text-xs">
            <div>
              <span className="font-mono text-xs sm:text-sm font-bold text-white">1–2 Hours</span>
              <span className="ml-1.5 sm:ml-2">Avg Coin Delivery</span>
            </div>
            <div>
              <span className="font-mono text-xs sm:text-sm font-bold text-white">Unique ID Only</span>
              <span className="ml-1.5 sm:ml-2">No Password for Coins</span>
            </div>
            <div>
              <span className="font-mono text-xs sm:text-sm font-bold text-[#f3c474]">4.9 ★</span>
              <span className="ml-1.5 sm:ml-2">Verified Players</span>
            </div>
          </div>
        </div>

        {/* Right: Sleek Floating Quick Coin Selector Card */}
        {coinProduct && selected && (
          <div className="rounded-xl border border-white/15 bg-[#122a22]/90 p-4 sm:p-5 backdrop-blur-md lg:col-span-5">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 pb-3">
              <div className="flex items-center gap-2.5">
                <img
                  src="/images/pool/logo-8ball.jpg"
                  alt="8 Ball Pool Coins"
                  className="h-9 w-9 shrink-0 rounded-lg border border-white/15 object-cover"
                />
                <div>
                  <h2 className="text-sm font-bold text-white">Quick Coin Top-Up</h2>
                  <p className="text-[11px] sm:text-xs text-[#9cb0a6]">Delivered straight to your Unique ID</p>
                </div>
              </div>
              <Link
                href={`/product/${coinProduct.slug}`}
                className="font-mono text-[11px] font-semibold text-[#f3c474] hover:underline"
              >
                1B–10B Packs →
              </Link>
            </div>

            <div className="mt-3.5 grid grid-cols-2 gap-2">
              {variants.map((v) => {
                const active = v.id === selected.id;
                return (
                  <button
                    key={v.id}
                    type="button"
                    onClick={() => setSelectedId(v.id)}
                    className={cn(
                      "flex flex-col items-start sm:flex-row sm:items-center justify-between gap-0.5 rounded-lg border px-2.5 py-2 sm:px-3 sm:py-2.5 text-left transition cursor-pointer",
                      active
                        ? "border-[#70cfa9] bg-[#194536] text-white"
                        : "border-white/10 bg-black/20 text-[#c4cec8] hover:border-white/25 hover:text-white",
                    )}
                  >
                    <span className="text-xs font-semibold text-white">{v.label}</span>
                    <span className="font-mono text-[11px] sm:text-xs font-bold text-[#f3c474]">
                      {formatMoney(v.priceCents, currency, rates)}
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="mt-4 flex flex-col gap-3 border-t border-white/10 pt-3.5 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-[11px] text-[#9cb0a6]">Selected Pack</p>
                <p className="text-sm sm:text-base font-bold text-white">
                  {selected.label} ·{" "}
                  <span className="font-mono text-[#f3c474]">{formatMoney(selected.priceCents, currency, rates)}</span>
                </p>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  size="sm"
                  variant="secondary"
                  className="flex-1 sm:flex-initial border-white/20 bg-white/10 text-white hover:bg-white/15"
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
                  <ShoppingCart className="h-3.5 w-3.5" />
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
                  className="inline-flex h-9 flex-1 sm:flex-initial cursor-pointer items-center justify-center gap-1.5 rounded-md bg-[#f3c474] px-4 text-xs font-bold text-[#1b1406] transition hover:bg-[#eab557]"
                >
                  Buy Pack →
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
