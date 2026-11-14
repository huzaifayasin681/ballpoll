"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  Check,
  Coins,
  Crown,
  Flame,
  Lock,
  MessageCircle,
  Package,
  ShieldCheck,
  Sparkles,
  Zap,
} from "lucide-react";
import { useCart } from "@/components/cart/cart-context";
import { Button } from "@/components/ui/button";
import { Badge, Card, Input } from "@/components/ui/primitives";
import { ShowcaseVideo } from "@/components/ui/showcase-video";
import { WhatsAppCta } from "@/components/ui/whatsapp-cta";
import { formatMoney, type CurrencyCode, type Rates } from "@/lib/currency";
import type { LegendaryPackItem } from "@/lib/catalog";
import { cn } from "@/lib/utils";

const MAX_STATS = [
  { label: "Force", value: "10 / 10" },
  { label: "Aim", value: "10 / 10" },
  { label: "Spin", value: "10 / 10" },
  { label: "Time", value: "10 / 10" },
] as const;

const ORDER_CARD_SPECS = [
  {
    slug: "starter-cue-box",
    title: "Starter Cue Box",
    subtitle: "Random Legendary Cue Unlock (3 Boxes)",
    badge: "Starter Pack",
    badgeTone: "green" as const,
    metaLabel: "6h Delivery",
    fallbackPriceCents: 999,
    Icon: Package,
    highlight: false,
    buttonVariant: "primary" as const,
    features: [
      "3x Legendary Surprise Boxes opened",
      "Random Legendary Cue piece unlocks",
      "Starts Coin-Back & bonus XP perks",
    ],
  },
  {
    slug: "ultimate-collector-pack",
    title: "Ultimate Collector Pack",
    subtitle: "All 20 Legendary Cues Unlocked",
    badge: "Most Popular",
    badgeTone: "gold" as const,
    metaLabel: "20 / 20 Cues",
    fallbackPriceCents: 14999,
    Icon: Crown,
    highlight: true,
    buttonVariant: "gold" as const,
    features: [
      "All 20 Legendary Cues unlocked",
      "Max Force, Aim, Spin & Time potential",
      "Up to 100% Coin-Back Guarantee & 0 recharge",
    ],
  },
  {
    slug: "max-level-upgrade",
    title: "Max Level Upgrade",
    subtitle: "Upgrade All Existing Cues to Level 5 Max",
    badge: "Level 5 Max",
    badgeTone: "green" as const,
    metaLabel: "Max Stats",
    fallbackPriceCents: 6999,
    Icon: Flame,
    highlight: false,
    buttonVariant: "primary" as const,
    features: [
      "All owned cues upgraded to Level 5 Max",
      "Full Force, Aim, Spin & Time bars",
      "Free cue recharge & max Coin-Back rate",
    ],
  },
] as const;

const POPULAR_CUSTOM_CUES = ["Archon", "Valkyrie", "Archangel", "Firestorm", "Mandora", "Other"] as const;

export function LegendaryCuesShop({
  packs,
  currency,
  rates,
  whatsappHref,
  siteName,
  headingTag = "h2",
  showCatalogLink = false,
}: {
  packs: LegendaryPackItem[];
  currency: CurrencyCode;
  rates: Rates;
  whatsappHref: string;
  siteName: string;
  headingTag?: "h1" | "h2";
  showCatalogLink?: boolean;
}) {
  const { add } = useCart();
  const router = useRouter();
  const [selectedCue, setSelectedCue] = useState<string>("");
  const [customCueName, setCustomCueName] = useState<string>("");

  const Heading = headingTag;

  const requestedCue =
    selectedCue === "Other" ? customCueName.trim() : selectedCue.trim();
  const whatsappMessage = requestedCue
    ? `Hi ${siteName}! I'd like to get a quote for the ${requestedCue} Legendary Cue in 8 Ball Pool.`
    : `Hi ${siteName}! I'd like to get a quote for a specific Legendary Cue (Archon, Valkyrie, etc.) in 8 Ball Pool.`;
  const whatsappUrl = `${whatsappHref}?text=${encodeURIComponent(whatsappMessage)}`;

  function handleOrderNow(pack: LegendaryPackItem) {
    add({
      variantId: pack.variantId,
      productSlug: pack.slug,
      productName: pack.name,
      variantLabel: pack.variantLabel,
      image: pack.image,
    });
    router.push("/checkout");
  }

  return (
    <section aria-labelledby="legendary-cues-heading" className="space-y-5">
      {/* Showcase Banner */}
      <div className="relative overflow-hidden rounded-2xl border border-[#1f4537] bg-[#081913] text-[#f5f3ed] shadow-lg ring-1 ring-white/5">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -left-24 -top-24 h-72 w-72 rounded-full bg-[#24916a]/20 blur-3xl" />
          <div className="absolute -bottom-24 right-10 h-72 w-72 rounded-full bg-[#f3c474]/15 blur-3xl" />
        </div>

        <div className="relative z-10 grid items-center gap-6 p-5 sm:gap-8 sm:p-8 lg:grid-cols-12 lg:p-10">
          <div className="lg:col-span-6">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-[#f3c474]/35 bg-black/50 px-3 py-1 font-mono text-[10px] font-bold uppercase tracking-widest text-[#f3c474] backdrop-blur-xs">
                <Sparkles className="h-3 w-3" /> Legendary Cues &amp; Max Stats Shop
              </span>
              {showCatalogLink && (
                <Link
                  href="/store/cues-unlocks"
                  className="inline-flex items-center gap-1 text-xs font-semibold text-[#68d8ae] hover:underline"
                >
                  Full Cue Catalog <ArrowRight className="h-3 w-3" />
                </Link>
              )}
            </div>

            <Heading
              id="legendary-cues-heading"
              className="mt-3.5 text-2xl font-extrabold tracking-tight text-white sm:text-3xl lg:text-[2rem] lg:leading-[1.15]"
            >
              Unlock Maxed Legendary Cues{" "}
              <span className="bg-gradient-to-r from-[#f8d896] via-[#f3c474] to-[#e2a33b] bg-clip-text text-transparent">
                | 8 Ball Pool Cue Shop
              </span>
            </Heading>

            <p className="mt-2.5 max-w-xl text-xs leading-relaxed text-[#c6d3cd] sm:text-sm">
              Max Out Stats (Force, Aim, Spin, Time) with Coin-Back Guarantee
            </p>

            {/* 4 Max Stat Gauges */}
            <div className="mt-5 grid grid-cols-2 gap-2.5 sm:grid-cols-4">
              {MAX_STATS.map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-xl border border-white/10 bg-black/35 px-3 py-2.5 backdrop-blur-xs"
                >
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-semibold text-white">{stat.label}</span>
                    <span className="font-mono text-[10px] font-bold text-[#f3c474]">{stat.value}</span>
                  </div>
                  <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-white/10">
                    <div className="h-full w-full rounded-full bg-gradient-to-r from-[#68d8ae] to-[#f3c474]" />
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-[11px] text-[#b4c4bc]">
              <span className="inline-flex items-center gap-1.5">
                <Coins className="h-3.5 w-3.5 text-[#f3c474]" /> Coin-Back Guarantee
              </span>
              <span className="inline-flex items-center gap-1.5">
                <ShieldCheck className="h-3.5 w-3.5 text-[#68d8ae]" /> Zero Cue Recharge Fee
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Lock className="h-3.5 w-3.5 text-[#68d8ae]" /> AES-256 Encrypted Vault
              </span>
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-2.5">
              <Link
                href="/store/cues-unlocks"
                className="inline-flex h-10 items-center justify-center gap-1.5 rounded-xl bg-gradient-to-b from-[#f6cf86] to-[#e5ad4c] px-5 text-xs font-bold text-[#1b1406] shadow-md transition hover:brightness-105"
              >
                Buy Cues Instantly <ArrowRight className="h-3.5 w-3.5" />
              </Link>
              <WhatsAppCta
                message={`Hi ${siteName}! I want to unlock Maxed Legendary Cues in 8 Ball Pool.`}
                label="WhatsApp"
                showNumber
                size="sm"
                className="h-10 rounded-xl px-4 text-xs"
              />
            </div>
          </div>

          <div className="lg:col-span-6">
            <div className="relative overflow-hidden rounded-xl border border-[#f3c474]/35 bg-black/50 shadow-2xl ring-1 ring-white/10">
              <ShowcaseVideo
                src="/videos/legendary-cues-maxed.mp4"
                poster="/images/pool/legendary-cues-maxed.jpg"
                title="Maxed Out Legendary Cues — 8 Ball Pool Cue Shop"
              />
            </div>
          </div>
        </div>
      </div>

      {/* 4 Pricing Cards Layout */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {ORDER_CARD_SPECS.map((spec) => {
          const pack = packs.find((p) => p.slug === spec.slug) ?? null;
          const displayPrice = pack ? pack.priceCents : spec.fallbackPriceCents;
          const comparePrice = pack?.compareCents ?? null;
          const CardIcon = spec.Icon;

          return (
            <Card
              key={spec.slug}
              className={cn(
                "flex h-full flex-col justify-between p-5 hover:shadow-md",
                spec.highlight
                  ? "border-accent-border bg-gradient-to-b from-accent-soft/75 via-surface to-surface ring-1 ring-accent/25 dark:from-[#211c12] dark:via-surface dark:to-surface"
                  : "hover:border-brand/50",
              )}
            >
              <div>
                <div className="flex items-center justify-between gap-2">
                  <Badge tone={spec.badgeTone}>
                    <CardIcon className="h-3 w-3" /> {spec.badge}
                  </Badge>
                  <span className="font-mono text-[10px] font-semibold uppercase tracking-wider text-muted">
                    {pack?.salePercentOff ? `-${pack.salePercentOff}% OFF` : spec.metaLabel}
                  </span>
                </div>

                <h3 className="mt-3.5 text-lg font-extrabold tracking-tight text-foreground">{spec.title}</h3>
                <p className="mt-1 text-xs font-medium leading-relaxed text-muted">{spec.subtitle}</p>

                <ul className="mt-4 space-y-2 border-t border-border pt-4 text-xs text-foreground">
                  {spec.features.map((feat) => (
                    <li key={feat} className="flex items-start gap-2">
                      <Check
                        className={cn(
                          "mt-0.5 h-3.5 w-3.5 shrink-0",
                          spec.highlight ? "text-accent" : "text-brand",
                        )}
                      />
                      <span className="leading-snug text-muted">{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-5 border-t border-border pt-4">
                <div className="mb-3 flex items-baseline justify-between gap-2">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-muted">Price</span>
                  <div className="flex items-baseline gap-1.5 text-right">
                    <span className="font-mono text-2xl font-extrabold text-foreground">
                      {formatMoney(displayPrice, currency, rates)}
                    </span>
                    {comparePrice && comparePrice > displayPrice && (
                      <span className="font-mono text-xs text-muted line-through">
                        {formatMoney(comparePrice, currency, rates)}
                      </span>
                    )}
                  </div>
                </div>

                <Button
                  type="button"
                  variant={spec.buttonVariant}
                  size="lg"
                  className="w-full"
                  disabled={!pack}
                  onClick={() => pack && handleOrderNow(pack)}
                >
                  <Zap className="h-4 w-4" />
                  {pack ? "Order Now" : "Currently Unavailable"}
                </Button>

                <div className="mt-2.5 text-center">
                  <Link
                    href={`/product/${spec.slug}`}
                    className="text-[11px] font-semibold text-muted transition-colors hover:text-brand hover:underline"
                  >
                    Package specifications →
                  </Link>
                </div>
              </div>
            </Card>
          );
        })}

        {/* Card 4: Custom Cue Request (WhatsApp) */}
        <Card className="flex h-full flex-col justify-between p-5 hover:border-brand/50 hover:shadow-md">
          <div>
            <div className="flex items-center justify-between gap-2">
              <Badge tone="gray">Custom Request</Badge>
              <span className="font-mono text-[10px] font-semibold uppercase tracking-wider text-muted">
                Instant Quote
              </span>
            </div>

            <h3 className="mt-3.5 text-lg font-extrabold tracking-tight text-foreground">Custom Cue Request</h3>
            <p className="mt-1 text-xs font-medium leading-relaxed text-muted">
              Specific Legendary Cue (Archon, Valkyrie, etc.)
            </p>

            <div className="mt-4 border-t border-border pt-3.5">
              <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-muted">
                Select Cue (Optional)
              </p>
              <div className="flex flex-wrap gap-1.5">
                {POPULAR_CUSTOM_CUES.map((cue) => {
                  const active = selectedCue === cue;
                  return (
                    <button
                      key={cue}
                      type="button"
                      onClick={() => setSelectedCue(active ? "" : cue)}
                      className={cn(
                        "cursor-pointer rounded-md border px-2 py-1 font-mono text-[10px] font-semibold transition-colors",
                        active
                          ? "border-brand bg-brand-soft text-brand"
                          : "border-border bg-surface-2/70 text-muted hover:border-border-hover hover:text-foreground",
                      )}
                    >
                      {cue}
                    </button>
                  );
                })}
              </div>
              {selectedCue === "Other" && (
                <Input
                  value={customCueName}
                  onChange={(e) => setCustomCueName(e.target.value)}
                  placeholder="Enter cue name (e.g. Phoenix)"
                  aria-label="Custom Legendary Cue Name"
                  className="mt-2 h-8 text-xs"
                />
              )}
            </div>

            <ul className="mt-3.5 space-y-1.5 text-xs">
              <li className="flex items-start gap-2">
                <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-brand" />
                <span className="leading-snug text-muted">Pick any specific cue &amp; target level</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-brand" />
                <span className="leading-snug text-muted">Direct quote via WhatsApp in minutes</span>
              </li>
            </ul>
          </div>

          <div className="mt-5 border-t border-border pt-4">
            <div className="mb-3 flex items-baseline justify-between gap-2">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-muted">Price</span>
              <span className="font-mono text-2xl font-extrabold text-brand">Get Quote</span>
            </div>

            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-[#15803d] px-5 text-sm font-bold text-white shadow-xs transition-all duration-150 hover:bg-[#166534] hover:shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#15803d]/40"
            >
              <MessageCircle className="h-4 w-4" />
              WhatsApp
            </a>

            <div className="mt-2.5 text-center">
              <Link
                href="/help#contact"
                className="text-[11px] font-semibold text-muted transition-colors hover:text-brand hover:underline"
              >
                Or open a support ticket →
              </Link>
            </div>
          </div>
        </Card>
      </div>
    </section>
  );
}
