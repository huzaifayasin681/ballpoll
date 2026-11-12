"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Check, ShoppingCart, Zap } from "lucide-react";
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
    setTimeout(() => setAdded(false), 1800);
  }

  return (
    <div className="space-y-5">
      <div>
        <div className="mb-2.5 flex items-center justify-between">
          <p className="text-xs font-bold uppercase tracking-wider text-muted">Select Package / Option</p>
          <span className="font-mono text-[11px] text-muted">{variants.length} options available</span>
        </div>
        <div className="grid gap-2.5 sm:grid-cols-2">
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
                  "flex cursor-pointer items-center justify-between rounded-xl border px-3.5 py-3 text-left transition-all duration-150",
                  active
                    ? "border-brand bg-brand-soft shadow-2xs ring-1 ring-brand/25"
                    : "border-border bg-surface hover:border-border-hover hover:bg-surface-2/50",
                  oos && "cursor-not-allowed opacity-40 line-through",
                )}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <span
                    className={cn(
                      "flex h-4 w-4 shrink-0 items-center justify-center rounded-full border",
                      active ? "border-brand bg-brand text-white" : "border-border bg-background",
                    )}
                  >
                    {active && <Check className="h-2.5 w-2.5" />}
                  </span>
                  <span className="truncate text-sm font-semibold text-foreground">{v.label}</span>
                </div>
                <div className="text-right shrink-0 pl-2">
                  <span className="font-mono text-sm font-bold text-brand">
                    {formatMoney(v.salePriceCents, currency, rates)}
                  </span>
                  {hasSavings && (
                    <span className="ml-1.5 font-mono text-[11px] text-muted line-through">
                      {formatMoney(v.compareCents!, currency, rates)}
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border bg-surface-2/80 p-4">
        <div>
          <p className="text-xs font-medium text-muted">Selected Package: <strong className="text-foreground">{selected.label}</strong></p>
          <div className="mt-1 flex items-baseline gap-2.5">
            <span className="font-mono text-2xl font-extrabold text-foreground">
              {formatMoney(selected.salePriceCents, currency, rates)}
            </span>
            {selected.compareCents && selected.compareCents > selected.salePriceCents && (
              <span className="font-mono text-sm text-muted line-through">
                {formatMoney(selected.compareCents, currency, rates)}
              </span>
            )}
          </div>
        </div>
        <span
          className={cn(
            "inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold",
            out
              ? "border-danger-border bg-danger-soft text-danger"
              : "border-brand-border bg-brand-soft text-brand",
          )}
        >
          <span className={cn("h-1.5 w-1.5 rounded-full", out ? "bg-danger" : "bg-brand")} />
          {out ? "Out of stock" : selected.stock > 0 ? `${selected.stock} in stock` : "Ready for delivery"}
        </span>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <Button size="lg" variant="secondary" disabled={out} onClick={addCurrent}>
          {added ? <Check className="h-4 w-4 text-brand" /> : <ShoppingCart className="h-4 w-4" />}
          {added ? "Added to Cart" : "Add to Cart"}
        </Button>
        <Button
          variant="primary"
          size="lg"
          disabled={out}
          onClick={() => {
            addCurrent();
            router.push("/checkout");
          }}
        >
          <Zap className="h-4 w-4" /> Buy Now — Express Checkout
        </Button>
      </div>
    </div>
  );
}
