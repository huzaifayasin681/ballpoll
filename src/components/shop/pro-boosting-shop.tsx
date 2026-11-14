"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  Award,
  Check,
  Crown,
  Lock,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  Trophy,
  UserRound,
  Zap,
} from "lucide-react";
import { useCart } from "@/components/cart/cart-context";
import { Button, buttonClass } from "@/components/ui/button";
import { Badge, Card } from "@/components/ui/primitives";
import { ShowcaseVideo } from "@/components/ui/showcase-video";
import { WhatsAppCta } from "@/components/ui/whatsapp-cta";
import { site } from "@/lib/site";
import { formatMoney, type CurrencyCode, type Rates } from "@/lib/currency";
import type { BoostingPackItem, PackVariantOption } from "@/lib/catalog";
import { cn } from "@/lib/utils";

const TRUST_METRICS = [
  { label: "Hand-Played", value: "100%" },
  { label: "Bots / Cheats", value: "ZERO" },
  { label: "Vault Login", value: "AES-256" },
  { label: "Order Tracking", value: "LIVE" },
] as const;

const BOOKING_CARD_SPECS = [
  {
    slug: "high-tier-ring-grinding",
    title: "High-Tier Rings",
    subtitle: "Berlin / Rome / Mumbai Ring Grinding",
    badge: "Per Ring",
    badgeTone: "green" as const,
    metaLabel: "48h Est.",
    priceLabel: "Price",
    priceSuffix: "/ ring",
    selectorLabel: "Select Table Ring",
    fallbackPriceCents: 4999,
    Icon: Award,
    highlight: false,
    buttonVariant: "primary" as const,
    features: [
      "Hand-played by high-stakes table pros",
      "Keep all coins & XP won during matches",
    ],
  },
  {
    slug: "venice-elite-ring-package",
    title: "Elite Package",
    subtitle: "Venice Pro Table Ring + Leaderboard Topping",
    badge: "Elite Package",
    badgeTone: "gold" as const,
    metaLabel: "Venice Pro",
    priceLabel: "Price",
    priceSuffix: "",
    selectorLabel: "",
    fallbackPriceCents: 11999,
    Icon: Crown,
    highlight: true,
    buttonVariant: "gold" as const,
    features: [
      "Venice Pro Table championship ring",
      "Country & World leaderboard topping",
      "Dedicated top-1% pro player assigned",
    ],
  },
  {
    slug: "account-level-progression",
    title: "Level Progression",
    subtitle: "Account Level Boost (e.g., Level 1 to 150+)",
    badge: "Level 150+",
    badgeTone: "green" as const,
    metaLabel: "XP Grind",
    priceLabel: "Price",
    priceSuffix: "",
    selectorLabel: "Select Target Range",
    fallbackPriceCents: 2999,
    Icon: TrendingUp,
    highlight: false,
    buttonVariant: "primary" as const,
    features: [
      "100% hand-leveled XP & trophy progress",
      "AES-256 vault auto-purged after delivery",
    ],
  },
] as const;

function formatChipLabel(label: string) {
  return label
    .replace(" Ring (Per Ring)", "")
    .replace("Level ", "")
    .replace(" Boost", "")
    .replace(" Full Max", "");
}

export function ProBoostingShop({
  packs,
  startingAccountPriceCents,
  currency,
  rates,
  headingTag = "h2",
  showCatalogLink = false,
}: {
  packs: BoostingPackItem[];
  startingAccountPriceCents: number | null;
  currency: CurrencyCode;
  rates: Rates;
  headingTag?: "h1" | "h2";
  showCatalogLink?: boolean;
}) {
  const { add } = useCart();
  const router = useRouter();
  const [selectedVariantBySlug, setSelectedVariantBySlug] = useState<Record<string, string>>({});

  const Heading = headingTag;

  function activeVariant(pack: BoostingPackItem | undefined): PackVariantOption | null {
    if (!pack || !pack.variants.length) return null;
    const chosenId = selectedVariantBySlug[pack.slug];
    return pack.variants.find((v) => v.id === chosenId) ?? pack.variants[0];
  }

  function handleBookSlot(pack: BoostingPackItem, variant: PackVariantOption) {
    add({
      variantId: variant.id,
      productSlug: pack.slug,
      productName: pack.name,
      variantLabel: variant.label,
      image: pack.image,
    });
    router.push("/checkout");
  }

  return (
    <section aria-labelledby="pro-boosting-heading" className="space-y-5">
      {/* Showcase Banner */}
      <div className="relative overflow-hidden rounded-2xl border border-[#1f4537] bg-[#081913] text-[#f5f3ed] shadow-lg ring-1 ring-white/5">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -left-24 -top-24 h-72 w-72 rounded-full bg-[#24916a]/20 blur-3xl" />
          <div className="absolute -bottom-24 right-10 h-72 w-72 rounded-full bg-[#f3c474]/15 blur-3xl" />
        </div>

        <div className="relative z-10 grid items-center gap-6 p-5 sm:gap-8 sm:p-8 lg:grid-cols-12 lg:p-10">
          <div className="lg:col-span-6">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-[#68d8ae]/35 bg-black/50 px-3 py-1 font-mono text-[10px] font-bold uppercase tracking-widest text-[#68d8ae] backdrop-blur-xs">
                <Trophy className="h-3 w-3 text-[#f3c474]" /> Pro Account Boosting &amp; Ring Grinding
              </span>
              {showCatalogLink && (
                <Link
                  href="/store/boosting"
                  className="inline-flex items-center gap-1 text-xs font-semibold text-[#68d8ae] hover:underline"
                >
                  Full Boosting Catalog <ArrowRight className="h-3 w-3" />
                </Link>
              )}
            </div>

            <Heading
              id="pro-boosting-heading"
              className="mt-3.5 text-2xl font-extrabold tracking-tight text-white sm:text-3xl lg:text-[2rem] lg:leading-[1.15]"
            >
              8 Ball Pool Account Leveling{" "}
              <span className="bg-gradient-to-r from-[#f8d896] via-[#f3c474] to-[#e2a33b] bg-clip-text text-transparent">
                &amp; Berlin/Venice Ring Grinding
              </span>
            </Heading>

            <p className="mt-2.5 max-w-xl text-xs leading-relaxed text-[#c6d3cd] sm:text-sm">
              Hand-Played by Global Pro Players — Zero Risk, 100% Secure
            </p>

            {/* 4 Safety & Pro Performance Tiles */}
            <div className="mt-5 grid grid-cols-2 gap-2.5 sm:grid-cols-4">
              {TRUST_METRICS.map((item) => (
                <div
                  key={item.label}
                  className="rounded-xl border border-white/10 bg-black/35 px-3 py-2.5 backdrop-blur-xs"
                >
                  <p className="font-mono text-xs font-extrabold text-[#f3c474]">{item.value}</p>
                  <p className="mt-0.5 text-[11px] font-medium text-[#d4dfd9]">{item.label}</p>
                </div>
              ))}
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-[11px] text-[#b4c4bc]">
              <span className="inline-flex items-center gap-1.5">
                <ShieldCheck className="h-3.5 w-3.5 text-[#68d8ae]" /> Zero Risk, 100% Secure
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Sparkles className="h-3.5 w-3.5 text-[#f3c474]" /> Berlin · Venice · Rome · Mumbai
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Lock className="h-3.5 w-3.5 text-[#68d8ae]" /> Auto-Purged Credentials (72h)
              </span>
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-2.5">
              <Link
                href="/store/boosting"
                className="inline-flex h-10 items-center justify-center gap-1.5 rounded-xl bg-gradient-to-b from-[#f6cf86] to-[#e5ad4c] px-5 text-xs font-bold text-[#1b1406] shadow-md transition hover:brightness-105"
              >
                Book Boosting Slot <ArrowRight className="h-3.5 w-3.5" />
              </Link>
              <WhatsAppCta
                message={`Hi ${site.name}! I want to book 8 Ball Pool Account Leveling or Berlin/Venice Ring Grinding.`}
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
                src="/videos/pro-account-boosting.mp4"
                poster="/images/pool/pro-account-boosting.jpg"
                title="8 Ball Pool Account Leveling and Berlin/Venice Ring Grinding"
              />
            </div>
          </div>
        </div>
      </div>

      {/* 4 Pricing Cards Layout */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {BOOKING_CARD_SPECS.map((spec) => {
          const pack = packs.find((p) => p.slug === spec.slug);
          const chosen = activeVariant(pack);
          const displayPrice = chosen ? chosen.priceCents : spec.fallbackPriceCents;
          const comparePrice = chosen?.compareCents ?? null;
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

                {pack && pack.variants.length > 1 && (
                  <div className="mt-3.5 border-t border-border pt-3.5">
                    <p className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-muted">
                      {spec.selectorLabel}
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {pack.variants.map((v) => {
                        const isSelected = chosen?.id === v.id;
                        return (
                          <button
                            key={v.id}
                            type="button"
                            onClick={() =>
                              setSelectedVariantBySlug((prev) => ({ ...prev, [pack.slug]: v.id }))
                            }
                            className={cn(
                              "cursor-pointer rounded-md border px-2 py-1 font-mono text-[10px] font-semibold transition-colors",
                              isSelected
                                ? "border-brand bg-brand-soft text-brand"
                                : "border-border bg-surface-2/70 text-muted hover:border-border-hover hover:text-foreground",
                            )}
                          >
                            {formatChipLabel(v.label)}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                <ul className="mt-4 space-y-2 border-t border-border pt-4 text-xs">
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
                  <span className="shrink-0 whitespace-nowrap text-[11px] font-semibold uppercase tracking-wider text-muted">
                    {spec.priceLabel}
                  </span>
                  <div className="flex flex-wrap items-baseline justify-end gap-x-1.5 text-right">
                    <span className="whitespace-nowrap font-mono text-2xl font-extrabold text-foreground">
                      {formatMoney(displayPrice, currency, rates)}
                      {spec.priceSuffix && (
                        <span className="ml-1 text-[11px] font-semibold text-muted">{spec.priceSuffix}</span>
                      )}
                    </span>
                    {comparePrice && comparePrice > displayPrice && (
                      <span className="whitespace-nowrap font-mono text-xs text-muted line-through">
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
                  disabled={!pack || !chosen}
                  onClick={() => pack && chosen && handleBookSlot(pack, chosen)}
                >
                  <Zap className="h-4 w-4" />
                  {pack && chosen ? "Book Slot" : "Currently Unavailable"}
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

        {/* Card 4: Ready-Made Pro Accounts */}
        <Card className="flex h-full flex-col justify-between p-5 hover:border-brand/50 hover:shadow-md">
          <div>
            <div className="flex items-center justify-between gap-2">
              <Badge tone="gray">
                <UserRound className="h-3 w-3" /> Ready-Made
              </Badge>
              <span className="font-mono text-[10px] font-semibold uppercase tracking-wider text-muted">
                Full Email Access
              </span>
            </div>

            <h3 className="mt-3.5 text-lg font-extrabold tracking-tight text-foreground">
              Ready-Made Pro Accounts
            </h3>
            <p className="mt-1 text-xs font-medium leading-relaxed text-muted">
              Pre-Maxed Accounts with Rare Rings &amp; Cues
            </p>

            <ul className="mt-4 space-y-2 border-t border-border pt-4 text-xs">
              {[
                "Level 100–150+ stacked profiles",
                "Berlin, Venice & tournament rings unlocked",
                "Legendary cues & billions of coins ready",
              ].map((feat) => (
                <li key={feat} className="flex items-start gap-2">
                  <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-brand" />
                  <span className="leading-snug text-muted">{feat}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-5 border-t border-border pt-4">
            <div className="mb-3 flex items-baseline justify-between gap-2">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-muted">Starting From</span>
              <span className="font-mono text-2xl font-extrabold text-brand">
                {formatMoney(startingAccountPriceCents ?? 19999, currency, rates)}
              </span>
            </div>

            <Link href="/store/accounts" className={buttonClass("secondary", "lg", "w-full border-brand/40 text-brand hover:bg-brand-soft")}>
              View Accounts <ArrowRight className="h-4 w-4" />
            </Link>

            <div className="mt-2.5 text-center">
              <Link
                href="/product/maxed-account-level-150"
                className="text-[11px] font-semibold text-muted transition-colors hover:text-brand hover:underline"
              >
                Inspect Level 150 Elite →
              </Link>
            </div>
          </div>
        </Card>
      </div>
    </section>
  );
}
