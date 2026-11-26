"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { SlidersHorizontal, X } from "lucide-react";
import { ProductArt } from "@/components/product-art";
import { QuickAddPlusButton } from "@/components/shop/quick-add-button";
import { Card, Stars } from "@/components/ui/primitives";
import { formatMoney, type CurrencyCode, type Rates } from "@/lib/currency";
import { cn } from "@/lib/utils";

export type CatalogItem = {
  id: string;
  slug: string;
  name: string;
  shortDesc: string;
  image: string;
  badge: string | null;
  requiredInput: "UNIQUE_ID" | "CREDENTIALS" | "NONE";
  deliveryHours: number;
  categorySlug: string;
  categoryName: string;
  tier: "Legendary" | "Epic" | "Rare";
  ratingAvg: number;
  ratingCount: number;
  minPriceCents: number;
  compareCents: number | null;
  discountPct: number | null;
  defaultVariantId: string;
  defaultVariantLabel: string;
  soldOut: boolean;
};

export function StoreCatalogClient({
  items,
  initialQuery,
  currency,
  rates,
}: {
  items: CatalogItem[];
  initialQuery?: string;
  currency: CurrencyCode;
  rates: Rates;
}) {
  const [tiers, setTiers] = useState<string[]>([]);
  const [delivery, setDelivery] = useState<string[]>([]);
  const [maxPriceDollars, setMaxPriceDollars] = useState<number>(500);
  const [minRating, setMinRating] = useState<number>(0);
  const [sort, setSort] = useState<"popular" | "price-asc" | "price-desc" | "fastest">("popular");
  const [limit, setLimit] = useState<number>(6);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const toggleArr = (arr: string[], val: string, set: (v: string[]) => void) => {
    set(arr.includes(val) ? arr.filter((x) => x !== val) : [...arr, val]);
  };

  const filtered = useMemo(() => {
    const q = initialQuery?.trim().toLowerCase();
    const list = items.filter((item) => {
      if (q && !item.name.toLowerCase().includes(q) && !item.shortDesc.toLowerCase().includes(q)) return false;
      if (tiers.length > 0 && !tiers.includes(item.tier)) return false;
      if (delivery.length > 0) {
        const matchesUnique = delivery.includes("unique") && item.requiredInput !== "CREDENTIALS";
        const matchesCreds = delivery.includes("creds") && item.requiredInput === "CREDENTIALS";
        if (!matchesUnique && !matchesCreds) return false;
      }
      if (item.minPriceCents > maxPriceDollars * 100) return false;
      if (minRating > 0 && item.ratingAvg < minRating) return false;
      return true;
    });

    if (sort === "price-asc") return [...list].sort((a, b) => a.minPriceCents - b.minPriceCents);
    if (sort === "price-desc") return [...list].sort((a, b) => b.minPriceCents - a.minPriceCents);
    if (sort === "fastest") return [...list].sort((a, b) => a.deliveryHours - b.deliveryHours);
    return list;
  }, [items, initialQuery, tiers, delivery, maxPriceDollars, minRating, sort]);

  const visible = filtered.slice(0, limit);
  const remaining = Math.max(0, filtered.length - visible.length);

  const filterPanel = (
    <div className="space-y-6">
      {/* Tier */}
      <div>
        <p className="mb-2.5 text-[10px] font-semibold uppercase tracking-[0.24em] text-muted">Tier</p>
        <div className="space-y-2">
          {(["Legendary", "Epic", "Rare"] as const).map((t) => (
            <label key={t} className="flex cursor-pointer items-center gap-2.5 text-xs text-ink">
              <input
                type="checkbox"
                checked={tiers.includes(t)}
                onChange={() => toggleArr(tiers, t, setTiers)}
                className="h-3.5 w-3.5 rounded-[2px] border-border accent-felt"
              />
              <span>{t}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Delivery */}
      <div className="border-t border-border pt-5">
        <p className="mb-2.5 text-[10px] font-semibold uppercase tracking-[0.24em] text-muted">Delivery</p>
        <div className="space-y-2">
          <label className="flex cursor-pointer items-center gap-2.5 text-xs text-ink">
            <input
              type="checkbox"
              checked={delivery.includes("unique")}
              onChange={() => toggleArr(delivery, "unique", setDelivery)}
              className="h-3.5 w-3.5 rounded-[2px] border-border accent-felt"
            />
            <span>Unique ID only</span>
          </label>
          <label className="flex cursor-pointer items-center gap-2.5 text-xs text-ink">
            <input
              type="checkbox"
              checked={delivery.includes("creds")}
              onChange={() => toggleArr(delivery, "creds", setDelivery)}
              className="h-3.5 w-3.5 rounded-[2px] border-border accent-felt"
            />
            <span>Needs account access</span>
          </label>
        </div>
      </div>

      {/* Price */}
      <div className="border-t border-border pt-5">
        <div className="mb-2 flex items-center justify-between">
          <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-muted">Price</p>
          <span className="text-[11px] font-medium text-ink">Up to ${maxPriceDollars}</span>
        </div>
        <input
          type="range"
          min={10}
          max={500}
          step={10}
          value={maxPriceDollars}
          onChange={(e) => setMaxPriceDollars(Number(e.target.value))}
          className="w-full accent-felt"
        />
        <div className="mt-1 flex justify-between text-[10px] text-muted">
          <span>$10</span>
          <span>$500</span>
        </div>
      </div>

      {/* Rating */}
      <div className="border-t border-border pt-5">
        <p className="mb-2.5 text-[10px] font-semibold uppercase tracking-[0.24em] text-muted">Rating</p>
        <div className="space-y-2">
          {[
            { label: "4.5 and up", val: 4.5 },
            { label: "4.0 and up", val: 4.0 },
          ].map((r) => (
            <label key={r.val} className="flex cursor-pointer items-center gap-2.5 text-xs text-ink">
              <input
                type="checkbox"
                checked={minRating === r.val}
                onChange={() => setMinRating(minRating === r.val ? 0 : r.val)}
                className="h-3.5 w-3.5 rounded-[2px] border-border accent-felt"
              />
              <span>{r.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Guide callout */}
      <div className="rounded-[4px] border border-border bg-paper p-3.5">
        <p className="text-xs font-medium text-ink">Not sure which cue?</p>
        <Link
          href="/blog/how-to-get-legendary-cues-in-8-ball-pool"
          className="mt-1 inline-block text-xs font-semibold text-felt underline decoration-brass/60 underline-offset-4 hover:text-felt-deep"
        >
          Read the cue guide
        </Link>
      </div>
    </div>
  );

  return (
    <div className="grid gap-8 lg:grid-cols-12">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:col-span-3 lg:block">{filterPanel}</aside>

      {/* Mobile Filters Drawer */}
      {mobileFiltersOpen && (
        <div className="fixed inset-0 z-50 bg-mahogany/60 backdrop-blur-xs lg:hidden" onClick={() => setMobileFiltersOpen(false)}>
          <div
            className="h-full w-[min(20rem,85vw)] overflow-y-auto bg-cream p-5 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-5 flex items-center justify-between border-b border-border pb-3">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-ink">Filters</p>
              <button
                type="button"
                aria-label="Close filters"
                onClick={() => setMobileFiltersOpen(false)}
                className="p-1 text-muted hover:text-ink"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            {filterPanel}
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="lg:col-span-9">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <p className="text-xs text-muted">
            Showing <strong className="text-ink">{visible.length}</strong> of{" "}
            <strong className="text-ink">{filtered.length}</strong>
            {initialQuery ? ` for “${initialQuery}”` : ""}
          </p>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setMobileFiltersOpen(true)}
              className="inline-flex h-8 cursor-pointer items-center gap-1.5 rounded-[2px] border border-border bg-paper px-3 text-xs font-medium text-ink hover:border-brass lg:hidden"
            >
              <SlidersHorizontal className="h-3.5 w-3.5" /> Filters
            </button>

            <select
              aria-label="Sort products"
              value={sort}
              onChange={(e) => setSort(e.target.value as typeof sort)}
              className="h-8 cursor-pointer rounded-[2px] border border-border bg-paper px-3 text-xs font-medium text-ink outline-none focus:border-felt"
            >
              <option value="popular">Sort: Most popular</option>
              <option value="price-asc">Sort: Price low to high</option>
              <option value="price-desc">Sort: Price high to low</option>
              <option value="fastest">Sort: Fastest delivery</option>
            </select>
          </div>
        </div>

        {visible.length === 0 ? (
          <Card className="p-12 text-center">
            <p className="font-display text-xl font-semibold text-ink">No matching packages</p>
            <p className="mt-1.5 text-xs text-muted">Try adjusting your filters or clearing your search.</p>
            <button
              type="button"
              onClick={() => {
                setTiers([]);
                setDelivery([]);
                setMaxPriceDollars(500);
                setMinRating(0);
              }}
              className="mt-4 inline-flex h-9 cursor-pointer items-center rounded-[2px] border border-border bg-cream px-4 text-[11px] font-semibold uppercase tracking-[0.18em] text-ink hover:border-brass"
            >
              Reset filters
            </button>
          </Card>
        ) : (
          <>
            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {visible.map((p) => (
                <Link key={p.id} href={`/product/${p.slug}`} className="group block h-full">
                  <Card className="relative flex h-full flex-col p-3.5 transition-all duration-200 hover:-translate-y-0.5 hover:border-brass">
                    {p.discountPct && p.discountPct > 0 && (
                      <span className="absolute left-2.5 top-2.5 z-10 rounded-[2px] bg-brass px-2 py-0.5 text-[10px] font-bold tracking-wider text-mahogany">
                        -{p.discountPct}%
                      </span>
                    )}

                    <div className="rounded-[4px] bg-felt-deep p-2 pb-0">
                      <ProductArt
                        image={p.image}
                        arched
                        size="md"
                        className="h-44 w-full"
                      />
                    </div>

                    <div className="flex flex-1 flex-col pt-3.5">
                      <p className="text-[9px] font-semibold uppercase tracking-[0.24em] text-brass-dark">
                        {p.tier.toUpperCase()} · {p.categoryName}
                      </p>

                      <h3 className="mt-1 font-display text-[17px] font-semibold leading-snug text-ink group-hover:text-felt">
                        {p.name}
                      </h3>

                      <div className="mt-1.5 flex items-center gap-1.5 text-[11px] text-muted">
                        <Stars rating={p.ratingAvg} />
                        <span className="font-medium text-ink">{p.ratingAvg.toFixed(1)}</span>
                        <span>({p.ratingCount})</span>
                      </div>

                      <div className="mt-auto flex items-center justify-between gap-2 pt-4">
                        <div className="flex items-baseline gap-2">
                          <span className="font-display text-lg font-semibold text-ink">
                            {formatMoney(p.minPriceCents, currency, rates)}
                          </span>
                          {p.compareCents && p.compareCents > p.minPriceCents && (
                            <span className="text-xs text-muted line-through">
                              {formatMoney(p.compareCents, currency, rates)}
                            </span>
                          )}
                        </div>

                        {p.defaultVariantId && (
                          <QuickAddPlusButton
                            variantId={p.defaultVariantId}
                            productSlug={p.slug}
                            productName={p.name}
                            variantLabel={p.defaultVariantLabel}
                            image={p.image}
                            disabled={p.soldOut}
                          />
                        )}
                      </div>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>

            {remaining > 0 && (
              <div className="mt-8 flex justify-center">
                <button
                  type="button"
                  onClick={() => setLimit((n) => n + 6)}
                  className={cn(
                    "h-10 cursor-pointer rounded-[2px] border border-[#D4C9B2] bg-paper px-6 text-[11px] font-semibold uppercase tracking-[0.2em] text-ink transition hover:border-brass",
                  )}
                >
                  Load {Math.min(remaining, 6)} more
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
