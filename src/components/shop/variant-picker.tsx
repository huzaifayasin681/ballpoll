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
        <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted">Choose an option</p>
        <div className="grid gap-2 sm:grid-cols-2">
          {variants.map((v) => {
            const active = v.id === selected.id;
            const oos = v.stock === 0;
            return (
              <button
                key={v.id}
                type="button"
                disabled={oos}
                onClick={() => setSelectedId(v.id)}
                className={cn(
                  "flex cursor-pointer items-center justify-between rounded-md border px-3.5 py-2.5 text-left transition",
                  active
                    ? "border-brand bg-brand-soft"
                    : "border-border bg-surface hover:border-border-hover",
                  oos && "cursor-not-allowed opacity-40 line-through",
                )}
              >
                <span className="text-sm font-medium text-foreground">{v.label}</span>
                <span className="font-mono text-sm font-semibold text-brand">
                  {formatMoney(v.salePriceCents, currency, rates)}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex items-baseline justify-between rounded-lg border border-border bg-surface-2 p-4">
        <div>
          <p className="text-xs text-muted">Selected: {selected.label}</p>
          <div className="mt-0.5 flex items-baseline gap-2">
            <span className="text-2xl font-semibold text-foreground">
              {formatMoney(selected.salePriceCents, currency, rates)}
            </span>
            {selected.compareCents && selected.compareCents > selected.salePriceCents && (
              <span className="text-sm text-muted line-through">
                {formatMoney(selected.compareCents, currency, rates)}
              </span>
            )}
          </div>
        </div>
        <span className={cn("text-xs font-medium", out ? "text-danger" : "text-brand")}>
          {out ? "Out of stock" : selected.stock > 0 ? `${selected.stock} left` : "In stock"}
        </span>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <Button size="lg" variant="secondary" disabled={out} onClick={addCurrent}>
          {added ? <Check className="h-4 w-4" /> : <ShoppingCart className="h-4 w-4" />}
          {added ? "Added to cart" : "Add to Cart"}
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
          <Zap className="h-4 w-4" /> Buy Now
        </Button>
      </div>
    </div>
  );
}
