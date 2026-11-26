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
      <div className="relative overflow-hidden felt-hero-surface rounded-[6px] border border-brass/35 text-paper">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -left-24 -top-24 h-72 w-72 rounded-full bg-felt/30 blur-3xl" />
          <div className="absolute -bottom-24 right-10 h-72 w-72 rounded-full bg-brass/12 blur-3xl" />
        </div>

        <div className="relative z-10 grid items-center gap-6 p-5 sm:gap-8 sm:p-8 lg:grid-cols-12 lg:p-10">
          <div className="lg:col-span-6">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-[2px] border border-brass/40 bg-felt-deep/85 px-3 py-1 font-mono text-[10px] font-bold uppercase tracking-widest text-brass backdrop-blur-xs">
                <Sparkles className="h-3 w-3" /> Legendary Cues &amp; Max Stats Shop
              </span>
              {showCatalogLink && (
                <Link
                  href="/store/cues-unlocks"
                  className="inline-flex items-center gap-1 text-xs font-semibold text-brass hover:underline"
                >
                  Full Cue Catalog <ArrowRight className="h-3 w-3" />
                </Link>
              )}
            </div>

            <Heading
              id="legendary-cues-heading"
              className="mt-3.5 font-display text-2xl font-semibold tracking-[-0.02em] text-paper sm:text-3xl lg:text-[2.1rem] lg:leading-[1.12]"
            >
              Unlock Maxed Legendary Cues{" "}
              <span className="font-normal italic text-brass">
                | 8 Ball Pool Cue Shop
              </span>
            </Heading>

            <p className="mt-2.5 max-w-xl text-xs leading-relaxed text-cream/85 sm:text-sm">
              Max Out Stats (Force, Aim, Spin, Time) with Coin-Back Guarantee
            </p>

            {/* 4 Max Stat Gauges */}
            <div className="mt-5 grid grid-cols-2 gap-2.5 sm:grid-cols-4">
              {MAX_STATS.map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-[4px] border border-paper/15 bg-felt-deep/65 px-3 py-2.5 backdrop-blur-xs"
                >
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-semibold text-white">{stat.label}</span>
                    <span className="font-mono text-[10px] font-bold text-brass">{stat.value}</span>
                  </div>
                  <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-white/10">
                    <div className="h-full w-full rounded-full bg-brass" />
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-[11px] text-cream/75">
              <span className="inline-flex items-center gap-1.5">
                <Coins className="h-3.5 w-3.5 text-brass" /> Coin-Back Guarantee
              </span>
              <span className="inline-flex items-center gap-1.5">
                <ShieldCheck className="h-3.5 w-3.5 text-brass" /> Zero Cue Recharge Fee
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Lock className="h-3.5 w-3.5 text-brass" /> AES-256 Encrypted Vault
              </span>
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-2.5">
              <Link
                href="/store/cues-unlocks"
                className="inline-flex h-10 items-center justify-center gap-1.5 rounded-[2px] border border-brass bg-brass px-5 text-xs font-semibold uppercase tracking-[0.14em] text-ink outline -outline-offset-[4px] outline-1 outline-ink/25 transition hover:bg-brass/90"
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
            <div className="relative overflow-hidden rounded-[4px] border border-brass/35 bg-felt-deep">
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
                  ? "border-brass bg-paper ring-1 ring-brass/30"
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

                <h3 className="mt-3.5 font-display text-xl font-semibold tracking-tight text-ink">{spec.title}</h3>
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
                    <span className="font-mono text-2xl font-semibold text-ink">
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

            <h3 className="mt-3.5 font-display text-xl font-semibold tracking-tight text-ink">Custom Cue Request</h3>
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
              <span className="font-mono text-2xl font-semibold text-felt">Get Quote</span>
            </div>

            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-[2px] border border-felt bg-felt px-5 text-xs font-semibold uppercase tracking-[0.16em] text-paper outline -outline-offset-[4px] outline-1 outline-brass/50 transition-all duration-150 hover:bg-felt-deep"
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
