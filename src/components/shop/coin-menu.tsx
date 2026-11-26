"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Check } from "lucide-react";
import { useCart } from "@/components/cart/cart-context";
import { GoldCoinStackArt } from "@/components/clubhouse/illustrations";
import { formatMoney, type CurrencyCode, type Rates } from "@/lib/currency";
import { cn } from "@/lib/utils";

type CoinVariant = {
  id: string;
  label: string;
  priceCents: number;
};

const ROW_TAGS: Record<number, string> = {
  1: "POPULAR",
  2: "+5% BONUS",
  3: "+8% BONUS",
  4: "+10% BONUS",
  5: "BEST VALUE",
};

function expandCoinLabel(label: string) {
  return label.replace(/(\d+)M\b/i, "$1 Million").replace(/(\d+)B\b/i, "$1 Billion");
}

export function CoinMenu({
  product,
  currency,
  rates,
}: {
  product: { slug: string; name: string; image: string; variants: CoinVariant[] } | null;
  currency: CurrencyCode;
  rates: Rates;
}) {
  const variants = product?.variants.slice(0, 6) ?? [];
  const [selectedId, setSelectedId] = useState(variants[1]?.id ?? variants[0]?.id ?? "");
  const [uniqueId, setUniqueId] = useState("");
  const { add } = useCart();
  const router = useRouter();

  if (!product || !variants.length) return null;
  const selected = variants.find((v) => v.id === selectedId) ?? variants[0];

  function handleTopUp() {
    if (!product || !selected) return;
    if (uniqueId.trim()) {
      try {
        localStorage.setItem("gps_prefill_uid", uniqueId.trim());
      } catch {}
    }
    add({
      variantId: selected.id,
      productSlug: product.slug,
      productName: product.name,
      variantLabel: selected.label,
      image: product.image,
    });
    router.push("/checkout");
  }

  return (
    <div className="rounded-[6px] border border-border bg-paper p-5 sm:p-7">
      <div className="grid items-stretch gap-6 lg:grid-cols-12 lg:gap-8">
        {/* Left: Dotted-leader coin menu */}
        <div className="flex flex-col justify-center lg:col-span-7">
          <div className="divide-y divide-[#EAE0CE]">
            {variants.map((v, idx) => {
              const active = v.id === selected.id;
              const tag = ROW_TAGS[idx];
              return (
                <button
                  key={v.id}
                  type="button"
                  onClick={() => setSelectedId(v.id)}
                  className={cn(
                    "group flex w-full cursor-pointer items-center gap-3 rounded-[4px] px-3 py-3.5 text-left transition-colors",
                    active ? "bg-cream/90 ring-1 ring-inset ring-brass/60" : "hover:bg-cream/45",
                  )}
                >
                  <span
                    className={cn(
                      "flex h-4 w-4 shrink-0 items-center justify-center rounded-full border transition-colors",
                      active ? "border-felt bg-felt" : "border-[#CBBFA6] bg-paper",
                    )}
                  >
                    {active && <span className="h-1.5 w-1.5 rounded-full bg-paper" />}
                  </span>

                  <span className="font-display text-base font-semibold text-ink sm:text-[17px]">
                    {expandCoinLabel(v.label)}
                  </span>

                  {tag && (
                    <span
                      className={cn(
                        "rounded-[2px] px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-[0.18em]",
                        idx === 1
                          ? "bg-felt text-paper"
                          : idx === 5
                            ? "bg-brass text-mahogany"
                            : "border border-brass/50 bg-accent-soft text-brass-dark",
                      )}
                    >
                      {tag}
                    </span>
                  )}

                  <span className="dotted-leader mb-1 flex-1" aria-hidden />

                  <span className="font-display text-base font-semibold tabular-nums text-ink sm:text-[17px]">
                    {formatMoney(v.priceCents, currency, rates)}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right: Felt top-up card */}
        <div className="felt-surface flex flex-col justify-between rounded-[6px] border border-brass/30 p-5 text-paper sm:p-6 lg:col-span-5">
          <div className="mx-auto h-28 w-36">
            <GoldCoinStackArt className="h-full w-full" />
          </div>

          <div className="mt-3 space-y-4">
            <div>
              <label htmlFor="home-coin-uid" className="block text-[11px] font-medium text-paper/80">
                Your Unique ID
              </label>
              <input
                id="home-coin-uid"
                value={uniqueId}
                onChange={(e) => setUniqueId(e.target.value)}
                placeholder="000-000-0000"
                className="mt-1.5 h-10 w-full rounded-[2px] border border-paper/20 bg-felt-deep px-3.5 font-mono text-sm text-paper placeholder:text-paper/35 outline-none transition focus:border-brass"
              />
            </div>

            <div className="flex items-baseline justify-between border-t border-paper/15 pt-3.5">
              <span className="text-sm text-paper/85">{expandCoinLabel(selected.label)}</span>
              <span className="font-display text-xl font-semibold text-paper">
                {formatMoney(selected.priceCents, currency, rates)}
              </span>
            </div>

            <button
              type="button"
              onClick={handleTopUp}
              className="btn-club-brass h-11 w-full cursor-pointer rounded-[2px] text-[11px] font-semibold uppercase tracking-[0.2em] transition"
            >
              Top up now
            </button>

            <p className="flex items-center justify-center gap-1.5 text-[11px] text-paper/75">
              <Check className="h-3.5 w-3.5 text-brass" /> Full refund if we cannot deliver
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
