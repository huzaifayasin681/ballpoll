"use client";

import { useEffect, useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Loader2, Lock, ShieldCheck, Tag } from "lucide-react";
import { useCart } from "@/components/cart/cart-context";
import { placeOrderAction } from "@/app/actions/checkout";
import { Button } from "@/components/ui/button";
import { Badge, Card, Input, Label } from "@/components/ui/primitives";
import { formatMoney, type CurrencyCode, type Rates } from "@/lib/currency";
import { POINTS_PER_DOLLAR_OFF } from "@/lib/site";
import { cn } from "@/lib/utils";

type Quote = {
  lines: { variantId: string; productName: string; variantLabel: string; quantity: number; unitCents: number }[];
  subtotal: number;
  coupon: { code: string; percentOff: number } | null;
  couponDiscount: number;
  needsUniqueId: boolean;
  needsCreds: boolean;
};

type Gateway = { id: string; label: string; description: string; enabled: boolean };

export function CheckoutClient({
  user,
  savedIds,
  gateways,
  currency,
  rates,
}: {
  user: { email: string; name: string | null; points: number } | null;
  savedIds: { id: string; label: string; uniqueId: string }[];
  gateways: Gateway[];
  currency: CurrencyCode;
  rates: Rates;
}) {
  const { lines, clear, ready } = useCart();
  const router = useRouter();
  const [quote, setQuote] = useState<Quote | null>(null);
  const [couponInput, setCouponInput] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState("");
  const [usePoints, setUsePoints] = useState(false);

  const [email, setEmail] = useState(user?.email ?? "");
  const [uniqueId, setUniqueId] = useState(savedIds[0]?.uniqueId ?? "");
  const [login, setLogin] = useState("");
  const [secret, setSecret] = useState("");
  const [paymentMethod, setPaymentMethod] = useState(gateways.find((g) => g.enabled)?.id ?? "manual");
  const [agree, setAgree] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pending, start] = useTransition();

  useEffect(() => {
    if (!lines.length) return;
    fetch("/api/cart/quote", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        items: lines.map((l) => ({ variantId: l.variantId, quantity: l.quantity })),
        coupon: appliedCoupon,
      }),
    })
      .then((r) => r.json())
      .then(setQuote)
      .catch(() => {});
  }, [lines, appliedCoupon]);

  if (!ready) return <Card className="h-64 animate-pulse" />;
  if (!lines.length) {
    return (
      <Card className="p-10 text-center">
        <p className="text-muted">Your cart is empty.</p>
        <Link href="/store" className="mt-3 inline-block text-sm font-semibold text-brand underline">
          Return to Store
        </Link>
      </Card>
    );
  }

  const subtotal = quote?.subtotal ?? 0;
  const couponDiscount = quote?.couponDiscount ?? 0;
  const maxByTotal = (subtotal - couponDiscount) * 0.5;
  const usablePts = user ? Math.min(user.points, Math.floor((maxByTotal / 100) * POINTS_PER_DOLLAR_OFF)) : 0;
  const redeemablePts = usablePts - (usablePts % POINTS_PER_DOLLAR_OFF);
  const pointsDiscount = usePoints ? (redeemablePts / POINTS_PER_DOLLAR_OFF) * 100 : 0;
  const total = Math.max(0, subtotal - couponDiscount - pointsDiscount);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    start(async () => {
      const res = await placeOrderAction({
        email,
        gameUniqueId: uniqueId || undefined,
        login: login || undefined,
        secret: secret || undefined,
        coupon: appliedCoupon || undefined,
        usePoints,
        paymentMethod,
        items: lines.map((l) => ({ variantId: l.variantId, quantity: l.quantity })),
        agree,
      });
      if ("error" in res && res.error) {
        setError(res.error);
        return;
      }
      clear();
      if (res.redirectUrl) {
        window.location.href = res.redirectUrl;
      } else {
        router.push(`/track?id=${res.trackingId}&v=${encodeURIComponent(email)}&placed=1`);
      }
    });
  }

  return (
    <form onSubmit={submit} className="grid gap-8 lg:grid-cols-12">
      <div className="space-y-6 lg:col-span-7">
        {/* Step 1: Contact */}
        <Card className="space-y-4 p-6">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-lg font-bold text-foreground">1. Contact Email</h2>
            {!user && (
              <Link href="/login?next=/checkout" className="text-xs font-medium text-brand hover:underline">
                Have an account? Sign in
              </Link>
            )}
          </div>
          <div>
            <Label htmlFor="email">Order confirmation & tracking updates will be sent here</Label>
            <Input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />
          </div>
        </Card>

        {/* Step 2: Game details (conditional) */}
        {(quote?.needsUniqueId || quote?.needsCreds) && (
          <Card className="space-y-4 p-6">
            <h2 className="font-display text-lg font-bold text-foreground">2. 8 Ball Pool Account Details</h2>
            {quote.needsUniqueId && (
              <div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="uid">Miniclip Unique ID</Label>
                  <Link href="/blog/how-to-find-your-miniclip-unique-id" className="text-xs text-brand hover:underline">
                    Where do I find this?
                  </Link>
                </div>
                {savedIds.length > 0 && (
                  <div className="mb-2 flex flex-wrap gap-1.5">
                    {savedIds.map((s) => (
                      <button
                        type="button"
                        key={s.id}
                        onClick={() => setUniqueId(s.uniqueId)}
                        className={cn(
                          "rounded-lg border px-2.5 py-1 text-xs",
                          uniqueId === s.uniqueId ? "border-brand bg-brand-soft text-brand" : "border-border text-muted",
                        )}
                      >
                        {s.label}: {s.uniqueId}
                      </button>
                    ))}
                  </div>
                )}
                <Input
                  id="uid"
                  required
                  value={uniqueId}
                  onChange={(e) => setUniqueId(e.target.value)}
                  placeholder="e.g. 123-456-789-0"
                />
              </div>
            )}

            {quote.needsCreds && (
              <div className="space-y-3 rounded-xl border border-accent-border bg-accent-soft p-4">
                <p className="flex items-center gap-2 text-xs text-accent">
                  <Lock className="h-4 w-4 shrink-0" />
                  Encrypted with AES-256. Visible only to your assigned booster and auto-deleted 72h after completion.
                </p>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <Label htmlFor="login">Game login (email / Miniclip ID)</Label>
                    <Input id="login" required value={login} onChange={(e) => setLogin(e.target.value)} autoComplete="off" />
                  </div>
                  <div>
                    <Label htmlFor="secret">Game password</Label>
                    <Input id="secret" type="password" required value={secret} onChange={(e) => setSecret(e.target.value)} autoComplete="new-password" />
                  </div>
                </div>
              </div>
            )}
          </Card>
        )}

        {/* Step 3: Payment method */}
        <Card className="space-y-3 p-6">
          <h2 className="font-display text-lg font-bold text-foreground">3. Payment Method</h2>
          <div className="grid gap-2.5">
            {gateways.map((g) => (
              <label
                key={g.id}
                className={cn(
                  "flex cursor-pointer items-start justify-between gap-3 rounded-xl border p-3.5 transition",
                  paymentMethod === g.id ? "border-brand bg-brand-soft" : "border-border bg-surface-2",
                  !g.enabled && "cursor-not-allowed opacity-45",
                )}
              >
                <div className="flex items-start gap-3">
                  <input
                    type="radio"
                    name="gateway"
                    disabled={!g.enabled}
                    checked={paymentMethod === g.id}
                    onChange={() => setPaymentMethod(g.id)}
                    className="mt-1"
                  />
                  <div>
                    <p className="text-sm font-semibold text-foreground">{g.label}</p>
                    <p className="text-xs text-muted">{g.description}</p>
                  </div>
                </div>
                {!g.enabled && <Badge tone="gray">Soon</Badge>}
              </label>
            ))}
          </div>
        </Card>
      </div>

      {/* Summary */}
      <Card className="h-fit space-y-4 p-6 lg:col-span-5">
        <h2 className="font-display text-lg font-bold text-foreground">Order Summary</h2>
        <ul className="divide-y divide-border text-sm">
          {(quote?.lines ?? []).map((l) => (
            <li key={l.variantId} className="flex justify-between py-2.5">
              <span>
                {l.productName} <span className="text-muted">({l.variantLabel}) × {l.quantity}</span>
              </span>
              <span className="font-medium text-foreground">{formatMoney(l.unitCents * l.quantity, currency, rates)}</span>
            </li>
          ))}
        </ul>

        {/* Coupon */}
        <div className="flex gap-2">
          <Input
            value={couponInput}
            onChange={(e) => setCouponInput(e.target.value)}
            placeholder="Promo code (try WELCOME10)"
            className="h-9 text-xs"
          />
          <Button type="button" variant="secondary" size="sm" className="h-9" onClick={() => setAppliedCoupon(couponInput)}>
            <Tag className="h-3.5 w-3.5" /> Apply
          </Button>
        </div>
        {appliedCoupon && !quote?.coupon && <p className="text-xs text-danger">Invalid or expired code.</p>}

        {/* Loyalty points */}
        {user && redeemablePts >= POINTS_PER_DOLLAR_OFF && (
          <label className="flex items-center justify-between rounded-xl border border-border bg-surface-2 px-3.5 py-2.5 text-xs">
            <span>
              Redeem <strong>{redeemablePts}</strong> points ({formatMoney((redeemablePts / POINTS_PER_DOLLAR_OFF) * 100, currency, rates)} off)
            </span>
            <input type="checkbox" checked={usePoints} onChange={(e) => setUsePoints(e.target.checked)} />
          </label>
        )}

        <div className="space-y-1.5 border-t border-border pt-3 text-sm">
          <div className="flex justify-between text-muted">
            <span>Subtotal</span>
            <span>{formatMoney(subtotal, currency, rates)}</span>
          </div>
          {couponDiscount > 0 && (
            <div className="flex justify-between text-brand">
              <span>Promo ({quote?.coupon?.code})</span>
              <span>-{formatMoney(couponDiscount, currency, rates)}</span>
            </div>
          )}
          {pointsDiscount > 0 && (
            <div className="flex justify-between text-brand">
              <span>Loyalty points</span>
              <span>-{formatMoney(pointsDiscount, currency, rates)}</span>
            </div>
          )}
          <div className="flex justify-between pt-2 font-display text-lg font-bold text-foreground">
            <span>Total</span>
            <span>{formatMoney(total, currency, rates)}</span>
          </div>
        </div>

        <label className="flex items-start gap-2.5 text-xs text-muted">
          <input type="checkbox" checked={agree} onChange={(e) => setAgree(e.target.checked)} className="mt-0.5" />
          <span>
            I agree to the{" "}
            <Link href="/legal/terms" className="text-brand underline">
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link href="/legal/refund" className="text-brand underline">
              Refund Policy
            </Link>
            .
          </span>
        </label>

        {error && <p className="rounded-lg bg-danger-soft p-3 text-xs text-danger">{error}</p>}

        <Button type="submit" size="lg" className="w-full" disabled={pending}>
          {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : <ShieldCheck className="h-4 w-4" />}
          Place Order ({formatMoney(total, currency, rates)})
        </Button>
      </Card>
    </form>
  );
}
