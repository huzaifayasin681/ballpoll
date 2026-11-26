"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Check } from "lucide-react";
import { useCart } from "@/components/cart/cart-context";
import { Button } from "@/components/ui/button";
import { formatMoney, type CurrencyCode, type Rates } from "@/lib/currency";
import { cn } from "@/lib/utils";

type Variant = {
  id: string;
  label: string;
  priceCents: number;
  salePriceCents: number;
  compareCents: number | null;
  stock: number;
};

export function VariantPicker({
  product,
  variants,
  currency,
  rates,
}: {
  product: { slug: string; name: string; image: string };
  variants: Variant[];
  currency: CurrencyCode;
  rates: Rates;
}) {
  const firstInStock = variants.find((v) => v.stock !== 0) ?? variants[0];
  const [selectedId, setSelectedId] = useState(firstInStock?.id);
  const [added, setAdded] = useState(false);
  const { add } = useCart();
  const router = useRouter();
  const selected = variants.find((v) => v.id === selectedId) ?? variants[0];
  if (!selected) return null;

  const out = selected.stock === 0;

  function addCurrent() {
    add({
      variantId: selected.id,
      productSlug: product.slug,
      productName: product.name,
      variantLabel: selected.label,
      image: product.image,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 1600);
  }

  return (
    <>
      <div className="space-y-4">
        <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-muted">
          Choose a package
        </p>

        <div className="space-y-2.5">
          {variants.map((v) => {
            const active = v.id === selected.id;
            const oos = v.stock === 0;
            const hasSavings = v.compareCents && v.compareCents > v.salePriceCents;
            return (
              <button
                key={v.id}
                type="button"
                disabled={oos}
                onClick={() => setSelectedId(v.id)}
                className={cn(
                  "flex w-full cursor-pointer items-center justify-between rounded-[4px] border px-4 py-3.5 text-left transition-all",
                  active
                    ? "border-felt bg-paper ring-1 ring-felt/30"
                    : "border-border bg-paper/70 hover:border-brass",
                  oos && "cursor-not-allowed opacity-40 line-through",
                )}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span
                    className={cn(
                      "flex h-4 w-4 shrink-0 items-center justify-center rounded-full border",
                      active ? "border-felt bg-felt" : "border-[#CBBFA6] bg-paper",
                    )}
                  >
                    {active && <span className="h-1.5 w-1.5 rounded-full bg-paper" />}
                  </span>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-ink">{v.label}</p>
                    <p className="text-[11px] text-muted">
                      {oos ? "Out of stock" : v.stock > 0 ? `${v.stock} available` : "Ready for delivery"}
                    </p>
                  </div>
                </div>

                <div className="shrink-0 pl-3 text-right">
                  <span className="font-display text-lg font-semibold text-ink">
                    {formatMoney(v.salePriceCents, currency, rates)}
                  </span>
                  {hasSavings && (
                    <span className="ml-2 text-xs text-muted line-through">
                      {formatMoney(v.compareCents!, currency, rates)}
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </div>

        <div className="grid gap-3 pt-1 sm:grid-cols-2">
          <Button size="lg" variant="primary" disabled={out} onClick={addCurrent}>
            {added ? (
              <>
                <Check className="h-4 w-4 text-brass" /> Added to cart
              </>
            ) : (
              "Add to cart"
            )}
          </Button>
          <Button
            variant="brass"
            size="lg"
            disabled={out}
            onClick={() => {
              addCurrent();
              router.push("/checkout");
            }}
          >
            Buy now
          </Button>
        </div>
      </div>

      {/* Mobile sticky buy bar */}
      <div className="fixed inset-x-0 bottom-0 z-30 flex items-center justify-between gap-3 border-t border-border bg-paper px-4 py-3 shadow-lg sm:hidden">
        <div className="min-w-0">
          <p className="truncate text-[11px] text-muted">{selected.label}</p>
          <p className="font-display text-lg font-semibold text-ink">
            {formatMoney(selected.salePriceCents, currency, rates)}
          </p>
        </div>
        <Button
          variant="brass"
          size="md"
          disabled={out}
          onClick={() => {
            addCurrent();
            router.push("/checkout");
          }}
        >
          Buy now
        </Button>
      </div>
    </>
  );
}
