"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { useCart } from "@/components/cart/cart-context";
import { ProductArt } from "@/components/product-art";
import { Button, buttonClass } from "@/components/ui/button";
import { Card } from "@/components/ui/primitives";
import { formatMoney, type CurrencyCode, type Rates } from "@/lib/currency";

type Quoted = { variantId: string; unitCents: number };

export function CartClient({ currency, rates }: { currency: CurrencyCode; rates: Rates }) {
  const { lines, setQty, remove, clear, ready } = useCart();
  const [prices, setPrices] = useState<Record<string, number>>({});

  useEffect(() => {
    if (!lines.length) return;
    fetch("/api/cart/quote", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ items: lines.map((l) => ({ variantId: l.variantId, quantity: l.quantity })) }),
    })
      .then((r) => r.json())
      .then((d: { lines: Quoted[] }) => setPrices(Object.fromEntries(d.lines.map((x) => [x.variantId, x.unitCents]))))
      .catch(() => {});
  }, [lines]);

  if (!ready) return <Card className="h-48 animate-pulse" />;

  if (!lines.length) {
    return (
      <Card className="p-12 text-center">
        <ShoppingBag className="mx-auto h-10 w-10 text-muted" />
        <h2 className="mt-3 font-display text-xl font-bold text-foreground">Your cart is empty</h2>
        <p className="mt-1 text-sm text-muted">Add a coin pack, cue, account or boost to get started.</p>
        <Link href="/store" className={buttonClass("primary", "md", "mt-5")}>
          Browse Store
        </Link>
      </Card>
    );
  }

  const subtotal = lines.reduce((s, l) => s + (prices[l.variantId] ?? 0) * l.quantity, 0);

  return (
    <div className="grid gap-8 lg:grid-cols-12">
      <div className="space-y-3 lg:col-span-8">
        {lines.map((l) => {
          const unit = prices[l.variantId] ?? 0;
          return (
            <Card key={l.variantId} className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:gap-4">
              <div className="flex items-center gap-3.5 min-w-0 flex-1">
                <ProductArt image={l.image} size="sm" className="h-14 w-14 sm:h-16 sm:w-16 shrink-0 rounded-xl" />
                <div className="min-w-0 flex-1">
                  <Link href={`/product/${l.productSlug}`} className="block truncate font-display text-sm sm:text-base font-bold text-foreground hover:text-brand">
                    {l.productName}
                  </Link>
                  <p className="text-xs text-muted">{l.variantLabel}</p>
                  <p className="mt-1 text-sm font-semibold text-brand">
                    {unit ? formatMoney(unit, currency, rates) : "…"}
                  </p>
                </div>
              </div>
              <div className="flex items-center justify-between border-t border-border pt-2.5 sm:border-t-0 sm:pt-0 sm:justify-end gap-3">
                <div className="flex items-center gap-1.5">
                  <button
                    aria-label="Decrease quantity"
                    onClick={() => setQty(l.variantId, l.quantity - 1)}
                    className="flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-surface-2"
                  >
                    <Minus className="h-3.5 w-3.5" />
                  </button>
                  <span className="w-7 text-center text-sm font-medium">{l.quantity}</span>
                  <button
                    aria-label="Increase quantity"
                    onClick={() => setQty(l.variantId, l.quantity + 1)}
                    className="flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-surface-2"
                  >
                    <Plus className="h-3.5 w-3.5" />
                  </button>
                </div>
                <button
                  aria-label="Remove item"
                  onClick={() => remove(l.variantId)}
                  className="p-1 text-muted hover:text-danger"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </Card>
          );
        })}
        <Button variant="ghost" size="sm" onClick={clear}>
          Clear cart
        </Button>
      </div>

      <Card className="h-fit space-y-4 p-6 lg:col-span-4">
        <h2 className="font-display text-lg font-bold text-foreground">Order Summary</h2>
        <div className="flex justify-between text-sm">
          <span className="text-muted">Subtotal</span>
          <span className="font-semibold text-foreground">{formatMoney(subtotal, currency, rates)}</span>
        </div>
        <p className="text-xs text-muted">Promo codes and loyalty points can be applied on the next step.</p>
        <Link href="/checkout" className={buttonClass("primary", "lg", "w-full")}>
          Continue to Checkout →
        </Link>
      </Card>
    </div>
  );
}
