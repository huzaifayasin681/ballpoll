"use client";

import { useEffect, useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Check, FileText, Loader2, Lock } from "lucide-react";
import { useCart } from "@/components/cart/cart-context";
import { ProductVectorArt } from "@/components/clubhouse/illustrations";
import { placeOrderAction } from "@/app/actions/checkout";
import { Button } from "@/components/ui/button";
import { Card, Input, Label, Select } from "@/components/ui/primitives";
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

const MANUAL_CHANNELS = [
  {
    id: "jazzcash",
    name: "JazzCash",
    sub: "Mobile wallet · instant",
    instructionTitle: "Send to JazzCash 0300-0000000",
    instructionBody: "Account title: GlobalPoolStore. Then upload the screenshot below. We confirm within 15 minutes.",
  },
  {
    id: "easypaisa",
    name: "Easypaisa",
    sub: "Mobile wallet · instant",
    instructionTitle: "Send to Easypaisa 0345-0000000",
    instructionBody: "Account title: GlobalPoolStore. Then upload the screenshot below. We confirm within 15 minutes.",
  },
  {
    id: "bank",
    name: "Bank transfer",
    sub: "1 to 3 hours to confirm",
    instructionTitle: "IBFT / Wire to Meezan Bank · PK42 MEZN 0000 0000 1234",
    instructionBody: "Account title: GlobalPoolStore. Upload your transfer receipt below for verification.",
  },
  {
    id: "usdt",
    name: "USDT · Binance Pay",
    sub: "Crypto · TRC20 or BEP20",
    instructionTitle: "Binance Pay ID: 492018442 · TRC20 Wallet on confirmation",
    instructionBody: "Send exact USD equivalent in USDT, then upload your transaction screenshot below.",
  },
] as const;

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
  const [whatsapp, setWhatsapp] = useState("");
  const [country, setCountry] = useState("Pakistan");
  const [login, setLogin] = useState("");
  const [secret, setSecret] = useState("");
  const [channelId, setChannelId] = useState<string>("jazzcash");
  const [paymentMethod, setPaymentMethod] = useState(gateways.find((g) => g.enabled)?.id ?? "manual");
  const [receiptFileName, setReceiptFileName] = useState<string | null>(null);
  const [agree, setAgree] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pending, start] = useTransition();

  useEffect(() => {
    try {
      const uid = localStorage.getItem("gps_prefill_uid");
      // eslint-disable-next-line react-hooks/set-state-in-effect -- prefill uniqueId & coupon from localStorage
      if (uid && !uniqueId) setUniqueId(uid);
      const savedCoupon = localStorage.getItem("gps_coupon");
      if (savedCoupon) {
        setCouponInput(savedCoupon);
        setAppliedCoupon(savedCoupon);
      }
    } catch {}
  }, [uniqueId]);

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
      .then(setQuote)
      .catch(() => {});
  }, [lines, appliedCoupon]);

  if (!ready) return <Card className="h-64 animate-pulse" />;
  if (!lines.length) {
    return (
      <Card className="p-10 text-center">
        <p className="font-display text-xl font-semibold text-ink">Your cart is empty.</p>
        <Link href="/store" className="mt-3 inline-block text-xs font-semibold uppercase tracking-[0.2em] text-felt underline">
          Return to store
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

  const selectedChannel = MANUAL_CHANNELS.find((c) => c.id === channelId) ?? MANUAL_CHANNELS[0];
  const uidValid = uniqueId.replace(/\D/g, "").length >= 7;

  const stepActive = !email || (quote?.needsUniqueId && !uidValid) ? 1 : !receiptFileName ? 2 : 3;

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
      try {
        localStorage.removeItem("gps_coupon");
      } catch {}
      if (res.redirectUrl) {
        window.location.href = res.redirectUrl;
      } else {
        router.push(`/track?id=${res.trackingId}&v=${encodeURIComponent(email)}&placed=1`);
      }
    });
  }

  return (
    <div className="space-y-8">
      {/* 3-step Progress Strip */}
      <div className="relative mx-auto flex max-w-3xl items-center justify-between gap-4 px-2">
        <div className="absolute left-6 right-6 top-1/2 -z-10 h-px -translate-y-1/2 bg-border" aria-hidden />
        {[
          { num: 1, label: "Details" },
          { num: 2, label: "Payment" },
          { num: 3, label: "Confirm" },
        ].map((st) => {
          const active = stepActive === st.num;
          const done = stepActive > st.num;
          return (
            <div key={st.num} className="flex items-center gap-2 bg-cream px-2.5">
              <span
                className={cn(
                  "flex h-6 w-6 items-center justify-center rounded-full text-[11px] font-semibold",
                  active || done ? "bg-felt text-paper" : "border border-[#CBBFA6] bg-paper text-muted",
                  active && st.num === 1 && "bg-brass text-mahogany",
                )}
              >
                {st.num}
              </span>
              <span className="text-xs font-medium text-ink">{st.label}</span>
            </div>
          );
        })}
      </div>

      <form onSubmit={submit} className="grid gap-8 lg:grid-cols-12">
        {/* Left column: Delivery + Payment */}
        <div className="space-y-6 lg:col-span-7">
          <Card className="space-y-4 p-5 sm:p-6">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-xl font-semibold text-ink">Delivery details</h2>
              {!user && (
                <Link href="/login?next=/checkout" className="text-xs font-medium text-felt underline">
                  Member sign in
                </Link>
              )}
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label htmlFor="uid">8 Ball Pool Unique ID</Label>
                {savedIds.length > 0 && (
                  <div className="mb-2 flex flex-wrap gap-1.5">
                    {savedIds.map((s) => (
                      <button
                        type="button"
                        key={s.id}
                        onClick={() => setUniqueId(s.uniqueId)}
                        className={cn(
                          "cursor-pointer rounded-[2px] border px-2 py-0.5 text-[10px] font-semibold",
                          uniqueId === s.uniqueId ? "border-felt bg-felt text-paper" : "border-border bg-cream text-muted",
                        )}
                      >
                        {s.label}
                      </button>
                    ))}
                  </div>
                )}
                <Input
                  id="uid"
                  required={Boolean(quote?.needsUniqueId)}
                  value={uniqueId}
                  onChange={(e) => setUniqueId(e.target.value)}
                  placeholder="347-829-1056"
                />
                {uidValid && (
                  <p className="mt-1.5 flex items-center gap-1 text-[11px] font-medium text-success">
                    <Check className="h-3 w-3" /> Unique ID format verified
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="email">Email for receipt</Label>
                <Input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                />
              </div>

              <div>
                <Label htmlFor="whatsapp">WhatsApp number</Label>
                <Input
                  id="whatsapp"
                  value={whatsapp}
                  onChange={(e) => setWhatsapp(e.target.value)}
                  placeholder="+92 300 0000000"
                />
              </div>

              <div>
                <Label htmlFor="country">Country</Label>
                <Select id="country" value={country} onChange={(e) => setCountry(e.target.value)}>
                  <option value="Pakistan">Pakistan</option>
                  <option value="United Arab Emirates">United Arab Emirates</option>
                  <option value="Saudi Arabia">Saudi Arabia</option>
                  <option value="United Kingdom">United Kingdom</option>
                  <option value="United States">United States</option>
                  <option value="India">India</option>
                  <option value="Turkey">Turkey</option>
                  <option value="Canada">Canada</option>
                  <option value="Other">Other</option>
                </Select>
              </div>
            </div>

            {quote?.needsCreds && (
              <div className="space-y-3 rounded-[4px] border border-brass/50 bg-accent-soft p-4">
                <p className="flex items-center gap-2 text-xs text-ink">
                  <Lock className="h-4 w-4 shrink-0 text-brass-dark" />
                  Temporary login access is AES-256 encrypted, visible only to your assigned player, and purged 72h after delivery.
                </p>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <Label htmlFor="login">Game login (email / Miniclip ID)</Label>
                    <Input id="login" required value={login} onChange={(e) => setLogin(e.target.value)} autoComplete="off" />
                  </div>
                  <div>
                    <Label htmlFor="secret">Game password</Label>
                    <Input
                      id="secret"
                      type="password"
                      required
                      value={secret}
                      onChange={(e) => setSecret(e.target.value)}
                      autoComplete="new-password"
                    />
                  </div>
                </div>
              </div>
            )}
          </Card>

          <Card className="space-y-4 p-5 sm:p-6">
            <h2 className="font-display text-xl font-semibold text-ink">Payment method</h2>

            <div className="grid gap-2.5 sm:grid-cols-2">
              {MANUAL_CHANNELS.map((ch) => {
                const active = channelId === ch.id;
                return (
                  <button
                    key={ch.id}
                    type="button"
                    onClick={() => {
                      setChannelId(ch.id);
                      setPaymentMethod("manual");
                    }}
                    className={cn(
                      "flex cursor-pointer items-start gap-3 rounded-[4px] border p-3.5 text-left transition",
                      active ? "border-felt bg-cream/80 ring-1 ring-felt/30" : "border-border bg-paper hover:border-brass",
                    )}
                  >
                    <span
                      className={cn(
                        "mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full border",
                        active ? "border-felt bg-felt" : "border-[#CBBFA6]",
                      )}
                    >
                      {active && <span className="h-1.5 w-1.5 rounded-full bg-paper" />}
                    </span>
                    <div>
                      <p className="text-xs font-semibold text-ink">{ch.name}</p>
                      <p className="mt-0.5 text-[11px] text-muted">{ch.sub}</p>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Payment instruction callout */}
            <div className="rounded-[4px] border border-brass/50 bg-accent-soft/80 p-4 text-xs">
              <p className="font-semibold text-ink">
                Send {formatMoney(total, currency, rates)} · {selectedChannel.instructionTitle}
              </p>
              <p className="mt-1 leading-relaxed text-muted">{selectedChannel.instructionBody}</p>
            </div>

            {/* Screenshot upload */}
            <label className="flex cursor-pointer items-center gap-3 rounded-[4px] border border-dashed border-[#CBBFA6] bg-cream/50 px-4 py-4 transition hover:border-brass">
              <FileText className="h-5 w-5 shrink-0 text-muted" />
              <div className="min-w-0">
                <p className="text-xs font-semibold text-ink">
                  {receiptFileName ? `Attached: ${receiptFileName}` : "Upload payment screenshot"}
                </p>
                <p className="text-[11px] text-muted">PNG or JPG, up to 5 MB</p>
              </div>
              <input
                type="file"
                accept="image/png,image/jpeg,image/webp"
                className="sr-only"
                onChange={(e) => setReceiptFileName(e.target.files?.[0]?.name ?? null)}
              />
            </label>
          </Card>

          <label className="flex cursor-pointer items-center gap-2.5 text-xs text-muted">
            <input
              type="checkbox"
              checked={agree}
              onChange={(e) => setAgree(e.target.checked)}
              className="h-4 w-4 rounded-[2px] border-border accent-felt"
            />
            <span>
              I agree to the{" "}
              <Link href="/legal/terms" className="text-felt underline">
                Terms
              </Link>{" "}
              and{" "}
              <Link href="/legal/refund" className="text-felt underline">
                Refund Policy
              </Link>
            </span>
          </label>
        </div>

        {/* Right column: Order Summary */}
        <div className="lg:col-span-5">
          <Card className="h-fit space-y-4 p-5 sm:p-6">
            <h2 className="font-display text-xl font-semibold text-ink">Your order</h2>

            <div className="divide-y divide-border">
              {lines.map((l) => {
                const qLine = quote?.lines.find((x) => x.variantId === l.variantId);
                return (
                  <div key={l.variantId} className="flex items-center justify-between gap-3 py-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="felt-window flex h-11 w-12 shrink-0 items-center justify-center rounded-[3px] border border-brass/30 p-1">
                        <ProductVectorArt slug={l.productSlug} image={l.image} className="h-full w-full" />
                      </div>
                      <div className="min-w-0">
                        <p className="truncate text-xs font-semibold text-ink">
                          {l.productName.replace(" (Legendary)", "")}
                          {l.quantity > 1 ? ` × ${l.quantity}` : ""}
                        </p>
                        <p className="truncate text-[11px] text-muted">{l.variantLabel}</p>
                      </div>
                    </div>
                    <span className="shrink-0 text-xs font-semibold text-ink">
                      {qLine ? formatMoney(qLine.unitCents * l.quantity, currency, rates) : "…"}
                    </span>
                  </div>
                );
              })}
            </div>

            <div className="flex gap-2 border-t border-border pt-3">
              <Input
                value={couponInput}
                onChange={(e) => setCouponInput(e.target.value)}
                placeholder="Promo code (e.g. WELCOME10)"
                className="h-9 text-xs"
              />
              <Button
                type="button"
                variant="secondary"
                size="sm"
                className="h-9"
                onClick={() => setAppliedCoupon(couponInput.trim().toUpperCase())}
              >
                Apply
              </Button>
            </div>

            {user && redeemablePts >= POINTS_PER_DOLLAR_OFF && (
              <label className="flex cursor-pointer items-center justify-between rounded-[4px] border border-border bg-cream/60 px-3 py-2 text-xs">
                <span>
                  Use <strong>{redeemablePts}</strong> pts (
                  {formatMoney((redeemablePts / POINTS_PER_DOLLAR_OFF) * 100, currency, rates)} off)
                </span>
                <input
                  type="checkbox"
                  checked={usePoints}
                  onChange={(e) => setUsePoints(e.target.checked)}
                  className="accent-felt"
                />
              </label>
            )}

            <div className="space-y-2 border-t border-border pt-3 text-xs">
              {(couponDiscount > 0 || pointsDiscount > 0) && (
                <div className="flex justify-between text-success">
                  <span>Discount</span>
                  <span>-{formatMoney(couponDiscount + pointsDiscount, currency, rates)}</span>
                </div>
              )}
              <div className="flex items-baseline justify-between pt-1">
                <span className="text-sm font-semibold text-ink">Total</span>
                <span className="font-display text-2xl font-semibold text-ink">
                  {formatMoney(total, currency, rates)}
                </span>
              </div>
            </div>

            {error && <p className="rounded-[4px] bg-danger-soft p-3 text-xs text-danger">{error}</p>}

            <Button type="submit" variant="primary" size="lg" className="w-full" disabled={pending}>
              {pending && <Loader2 className="h-4 w-4 animate-spin" />}
              I have paid · place order
            </Button>

            <p className="text-center text-[11px] text-muted">Estimated delivery: 1 to 2 hours</p>
          </Card>
        </div>
      </form>
    </div>
  );
}
