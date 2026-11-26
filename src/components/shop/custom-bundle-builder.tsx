"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Check, Plus } from "lucide-react";
import { useCart } from "@/components/cart/cart-context";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/primitives";
import { formatMoney, type CurrencyCode, type Rates } from "@/lib/currency";
import { cn } from "@/lib/utils";

export type BundleOption = {
  slug: string;
  label: string;
  variantId: string;
  productName: string;
  variantLabel: string;
  image: string;
  priceCents: number;
};

export function CustomBundleBuilder({
  options,
  currency,
  rates,
}: {
  options: BundleOption[];
  currency: CurrencyCode;
  rates: Rates;
}) {
  const [selectedSlugs, setSelectedSlugs] = useState<string[]>(options.slice(0, 3).map((o) => o.slug));
  const { add } = useCart();
  const router = useRouter();

  function toggle(slug: string) {
    setSelectedSlugs((prev) => (prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug]));
  }

  const chosen = options.filter((o) => selectedSlugs.includes(o.slug));
  const rawTotal = chosen.reduce((sum, o) => sum + o.priceCents, 0);
  const qualifies = chosen.length >= 3;
  const discountedTotal = qualifies ? Math.round(rawTotal * 0.8) : rawTotal;

  function addBundle() {
    for (const item of chosen) {
      add({
        variantId: item.variantId,
        productSlug: item.slug,
        productName: item.productName,
        variantLabel: item.variantLabel,
        image: item.image,
      });
    }
    router.push("/cart");
  }

  return (
    <Card className="p-6 sm:p-8">
      <p className="text-[10px] font-semibold uppercase tracking-[0.26em] text-brass-dark">Custom build</p>
      <h2 className="mt-1.5 font-display text-3xl font-semibold text-ink">Build your own bundle</h2>
      <p className="mt-1 text-sm text-muted">Pick 3 or more items and save up to 20%.</p>

      <div className="mt-6 flex flex-col justify-between gap-5 lg:flex-row lg:items-center">
        <div className="flex flex-wrap gap-2.5">
          {options.map((opt) => {
            const active = selectedSlugs.includes(opt.slug);
            return (
              <button
                key={opt.slug}
                type="button"
                onClick={() => toggle(opt.slug)}
                className={cn(
                  "inline-flex cursor-pointer items-center gap-2 rounded-[2px] border px-3.5 py-2 text-xs font-medium transition",
                  active
                    ? "border-felt bg-felt text-paper"
                    : "border-[#D4C9B2] bg-cream/60 text-ink hover:border-brass",
                )}
              >
                {active ? <Check className="h-3.5 w-3.5 text-brass" /> : <Plus className="h-3.5 w-3.5 text-muted" />}
                <span>{opt.label}</span>
              </button>
            );
          })}
        </div>

        <div className="flex shrink-0 items-center gap-4 border-t border-border pt-4 lg:border-t-0 lg:pt-0">
          <div>
            <p className="text-[11px] text-muted">Bundle price</p>
            <div className="flex items-baseline gap-2">
              <span className="font-display text-2xl font-semibold text-ink">
                {formatMoney(discountedTotal, currency, rates)}
              </span>
              {qualifies && rawTotal > discountedTotal && (
                <span className="text-xs text-muted line-through">
                  {formatMoney(rawTotal, currency, rates)}
                </span>
              )}
            </div>
          </div>
          <Button type="button" variant="primary" size="md" disabled={chosen.length === 0} onClick={addBundle}>
            Add bundle
          </Button>
        </div>
      </div>
    </Card>
  );
}
