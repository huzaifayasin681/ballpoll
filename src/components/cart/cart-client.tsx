"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, Heart, Lock, Minus, Plus, ShoppingBag, X } from "lucide-react";
import { useCart } from "@/components/cart/cart-context";
import { ProductVectorArt } from "@/components/clubhouse/illustrations";
import { ButtonLink } from "@/components/ui/button";
import { Card } from "@/components/ui/primitives";
import { formatMoney, type CurrencyCode, type Rates } from "@/lib/currency";

type Quoted = { variantId: string; unitCents: number };
type QuoteRes = {
  lines: Quoted[];
  subtotal: number;
  coupon: { code: string; percentOff: number } | null;
  couponDiscount: number;
};

export function CartClient({ currency, rates }: { currency: CurrencyCode; rates: Rates }) {
  const { lines, setQty, remove, ready } = useCart();
  const [prices, setPrices] = useState<Record<string, number>>({});
  const [couponInput, setCouponInput] = useState("WELCOME10");
  const [appliedCoupon, setAppliedCoupon] = useState("");
  const [couponInfo, setCouponInfo] = useState<{ code: string; percentOff: number } | null>(null);
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [savedIds, setSavedIds] = useState<string[]>([]);

  useEffect(() => {
    let active = true;
    Promise.resolve().then(() => {
      if (!active) return;
      try {
        const savedCoupon = localStorage.getItem("gps_coupon");
        if (savedCoupon) {
          setCouponInput(savedCoupon);
          setAppliedCoupon(savedCoupon);
        }
      } catch {}
    });
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (!lines.length) return;
    fetch("/api/cart/quote", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        items: lines.map((l) => ({ variantId: l.variantId, quantity: l.quantity })),
        coupon: appliedCoupon || undefined,
      }),
    })
      .then((r) => r.json())
      .then((d: QuoteRes) => {
        setPrices(Object.fromEntries(d.lines.map((x) => [x.variantId, x.unitCents])));
        setCouponInfo(d.coupon ?? null);
        setCouponDiscount(d.couponDiscount ?? 0);
      })
      .catch(() => {});
  }, [lines, appliedCoupon]);

  if (!ready) return <Card className="h-56 animate-pulse" />;

  if (!lines.length) {
    return (
      <Card className="p-12 text-center">
        <ShoppingBag className="mx-auto h-10 w-10 text-brass-dark" />
        <h2 className="mt-3 font-display text-2xl font-semibold text-ink">Your cart is empty</h2>
        <p className="mt-1.5 text-sm text-muted">Add a coin pack, legendary cue, account or boost to get started.</p>
        <ButtonLink href="/store" variant="primary" size="md" className="mt-6">
          Browse the store
        </ButtonLink>
      </Card>
    );
  }

  const subtotal = lines.reduce((s, l) => s + (prices[l.variantId] ?? 0) * l.quantity, 0);
  const total = Math.max(0, subtotal - couponDiscount);

  function applyCode(e: React.FormEvent) {
    e.preventDefault();
    const code = couponInput.trim().toUpperCase();
    setAppliedCoupon(code);
    try {
      if (code) localStorage.setItem("gps_coupon", code);
      else localStorage.removeItem("gps_coupon");
    } catch {}
  }

  return (
    <div className="grid gap-8 lg:grid-cols-12">
      {/* Left: Cart items */}
      <div className="lg:col-span-8">
        <Card className="p-5 sm:p-6">
          <div className="divide-y divide-border">
            {lines.map((l) => {
              const unit = prices[l.variantId] ?? 0;
              const isSaved = savedIds.includes(l.variantId);
              return (
                <div key={l.variantId} className="flex flex-col gap-4 py-5 first:pt-1 last:pb-2 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center gap-4 min-w-0">
                    <div className="felt-window flex h-16 w-20 shrink-0 items-center justify-center rounded-[4px] border border-brass/30 p-2">
                      <ProductVectorArt slug={l.productSlug} image={l.image} className="h-full w-full" />
                    </div>
                    <div className="min-w-0">
                      <Link
                        href={`/product/${l.productSlug}`}
                        className="block truncate font-display text-lg font-semibold text-ink hover:text-felt"
                      >
                        {l.productName.replace(" (Legendary)", "")}
                      </Link>
                      <p className="mt-0.5 text-xs text-muted">{l.variantLabel}</p>
                      <div className="mt-2 flex items-center gap-3 text-[11px] text-muted">
                        <button
                          type="button"
                          onClick={() =>
                            setSavedIds((prev) =>
                              prev.includes(l.variantId) ? prev.filter((id) => id !== l.variantId) : [...prev, l.variantId],
                            )
                          }
                          className="inline-flex cursor-pointer items-center gap-1 hover:text-ink"
                        >
                          <Heart className={`h-3 w-3 ${isSaved ? "fill-brass text-brass" : ""}`} />
                          {isSaved ? "Saved" : "Save"}
                        </button>
                        <button
                          type="button"
                          onClick={() => remove(l.variantId)}
                          className="inline-flex cursor-pointer items-center gap-1 hover:text-danger"
                        >
                          <X className="h-3 w-3" /> Remove
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-5 sm:justify-end">
                    <div className="inline-flex items-center rounded-[2px] border border-border bg-cream/60">
                      <button
                        type="button"
                        aria-label="Decrease quantity"
                        onClick={() => setQty(l.variantId, l.quantity - 1)}
                        className="flex h-8 w-8 cursor-pointer items-center justify-center text-ink hover:bg-paper"
                      >
                        <Minus className="h-3 w-3" />
                      </button>
                      <span className="w-8 text-center text-xs font-semibold text-ink">{l.quantity}</span>
                      <button
                        type="button"
                        aria-label="Increase quantity"
                        onClick={() => setQty(l.variantId, l.quantity + 1)}
                        className="flex h-8 w-8 cursor-pointer items-center justify-center text-ink hover:bg-paper"
                      >
                        <Plus className="h-3 w-3" />
                      </button>
                    </div>

                    <p className="min-w-[72px] text-right font-display text-lg font-semibold text-ink">
                      {unit ? formatMoney(unit * l.quantity, currency, rates) : "…"}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-border pt-4 text-xs">
            <Link href="/store" className="inline-flex items-center gap-1.5 font-semibold text-felt hover:underline">
              → Continue shopping
            </Link>
            <span className="text-muted">Prices in {currency}</span>
          </div>
        </Card>
      </div>

      {/* Right: Summary + We accept */}
      <div className="space-y-4 lg:col-span-4">
        <Card className="space-y-4 p-5 sm:p-6">
          <h2 className="font-display text-2xl font-semibold text-ink">Order summary</h2>

          <div className="space-y-2.5 border-b border-border pb-4 text-xs">
            <div className="flex justify-between">
              <span className="text-muted">Subtotal</span>
              <span className="font-semibold text-ink">{formatMoney(subtotal, currency, rates)}</span>
            </div>
            {couponInfo && couponDiscount > 0 && (
              <div className="flex justify-between text-success">
                <span>
                  {couponInfo.code} ({couponInfo.percentOff}%)
                </span>
                <span className="font-semibold">-{formatMoney(couponDiscount, currency, rates)}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-muted">Delivery</span>
              <span className="font-semibold text-success">Free</span>
            </div>
          </div>

          <div className="flex items-baseline justify-between">
            <span className="text-sm font-semibold text-ink">Total</span>
            <span className="font-display text-2xl font-semibold text-ink">
              {formatMoney(total, currency, rates)}
            </span>
          </div>

          <form onSubmit={applyCode} className="flex gap-2">
            <input
              value={couponInput}
              onChange={(e) => setCouponInput(e.target.value)}
              placeholder="WELCOME10"
              aria-label="Promo code"
              className="h-9 min-w-0 flex-1 rounded-[2px] border border-border bg-cream/60 px-3 text-xs font-medium uppercase tracking-wider text-ink outline-none focus:border-felt"
            />
            <button
              type="submit"
              className="h-9 cursor-pointer rounded-[2px] border border-[#D4C9B2] bg-paper px-3.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-ink transition hover:border-brass"
            >
              {couponInfo ? "Applied" : "Apply"}
            </button>
          </form>

          <ButtonLink href="/checkout" variant="primary" size="lg" className="w-full">
            Checkout <ArrowRight className="h-3.5 w-3.5" />
          </ButtonLink>

          <p className="flex items-center justify-center gap-1.5 text-[11px] text-muted">
            <Lock className="h-3 w-3 text-felt" /> Payment confirmed manually by our team
          </p>
        </Card>

        <Card className="p-5">
          <p className="text-xs font-semibold text-ink">We accept</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {["JazzCash", "Easypaisa", "Bank transfer", "USDT · Binance Pay"].map((ch) => (
              <span
                key={ch}
                className="rounded-[2px] border border-border bg-cream/70 px-2.5 py-1 text-[11px] font-medium text-ink"
              >
                {ch}
              </span>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
