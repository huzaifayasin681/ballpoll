"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  Check,
  Crown,
  Flame,
  Gift,
  Lock,
  MessageCircle,
  ShieldCheck,
  SlidersHorizontal,
  Sparkles,
  Tag,
} from "lucide-react";
import { useCart } from "@/components/cart/cart-context";
import { Button } from "@/components/ui/button";
import { Badge, Card } from "@/components/ui/primitives";
import { WhatsAppCta } from "@/components/ui/whatsapp-cta";
import { formatMoney, type CurrencyCode, type Rates } from "@/lib/currency";
import type { LegendaryPackItem } from "@/lib/catalog";
import { cn } from "@/lib/utils";

const BUNDLE_METRICS = [
  { label: "Bundle Savings", value: "UP TO 40%" },
  { label: "Combo Packs", value: "ALL-IN-1" },
  { label: "Venice / Berlin", value: "VIP RINGS" },
  { label: "Custom Deals", value: "TAILORED" },
] as const;

const COMBO_CARD_SPECS = [
  {
    slug: "gamer-starter-combo",
    title: "Gamer Starter Combo",
    subtitle: "500M Coins + 5 Legendary Cues + 100 Cash",
    badge: "Save 40%",
    badgeTone: "green" as const,
    metaLabel: "Starter Deal",
    fallbackPriceCents: 2999,
    fallbackCompareCents: 4999,
    Icon: Gift,
    highlight: false,
    buttonVariant: "primary" as const,
    features: [
      "500M Pool Coins added to balance",
      "5 Legendary Cues unlocked cleanly",
      "100 Cash for boxes & Pool Pass",
    ],
  },
  {
    slug: "king-master-bundle",
    title: "King Master Bundle",
    subtitle: "2 Billion Coins + All 20 Cues + 1 Venice/Berlin Ring",
    badge: "40% OFF · VIP",
    badgeTone: "gold" as const,
    metaLabel: "Best Value",
    fallbackPriceCents: 14999,
    fallbackCompareCents: 24999,
    Icon: Crown,
    highlight: true,
    buttonVariant: "gold" as const,
    features: [
      "2 Billion Coins bankroll upgrade",
      "All 20 Legendary Cues unlocked",
      "1 Hand-played Venice or Berlin Ring",
    ],
  },
] as const;

const CUSTOM_BUILD_OPTIONS = [
  "Coins",
  "Legendary Cues",
  "Cash",
  "Venice / Berlin Ring",
  "Aim Assist Key",
] as const;

export function ComboBundlesShop({
  packs,
  currency,
  rates,
  whatsappHref,
  siteName,
  headingTag = "h2",
  showDealsLink = false,
}: {
  packs: LegendaryPackItem[];
  currency: CurrencyCode;
  rates: Rates;
  whatsappHref: string;
  siteName: string;
  headingTag?: "h1" | "h2";
  showDealsLink?: boolean;
}) {
  const { add } = useCart();
  const router = useRouter();
  const [selectedMix, setSelectedMix] = useState<string[]>(["Coins", "Legendary Cues"]);

  const Heading = headingTag;

  function toggleMix(option: string) {
    setSelectedMix((prev) => (prev.includes(option) ? prev.filter((item) => item !== option) : [...prev, option]));
  }

  function handleGrabDeal(pack: LegendaryPackItem) {
    add({
      variantId: pack.variantId,
      productSlug: pack.slug,
      productName: pack.name,
      variantLabel: pack.variantLabel,
      image: pack.image,
    });
    router.push("/checkout");
  }

  const mixSummary = selectedMix.length > 0 ? selectedMix.join(" + ") : "coins, cues, and tools";
  const customChatMessage = `Hi ${siteName}! I'd like a custom bundle quote for: ${mixSummary}.`;
  const customChatUrl = `${whatsappHref}?text=${encodeURIComponent(customChatMessage)}`;

  return (
    <section aria-labelledby="combo-bundles-heading" className="space-y-5">
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
                <Sparkles className="h-3 w-3" /> Mega Combo Bundles &amp; Custom Services
              </span>
              {showDealsLink && (
                <Link
                  href="/deals"
                  className="inline-flex items-center gap-1 text-xs font-semibold text-brass hover:underline"
                >
                  All Deals &amp; Promo Codes <ArrowRight className="h-3 w-3" />
                </Link>
              )}
            </div>

            <Heading
              id="combo-bundles-heading"
              className="mt-3.5 font-display text-2xl font-semibold tracking-[-0.02em] text-paper sm:text-3xl lg:text-[2.1rem] lg:leading-[1.12]"
            >
              8 Ball Pool Combo Deals{" "}
              <span className="font-normal italic text-brass">
                &amp; Custom Service Packages
              </span>
            </Heading>

            <p className="mt-2.5 max-w-xl text-xs leading-relaxed text-cream/85 sm:text-sm">
              Save Up to 40% with All-in-One Gamer Bundles
            </p>

            {/* 4 Bundle Value Tiles */}
            <div className="mt-5 grid grid-cols-2 gap-2.5 sm:grid-cols-4">
              {BUNDLE_METRICS.map((item) => (
                <div
                  key={item.label}
                  className="rounded-[4px] border border-paper/15 bg-felt-deep/65 px-3 py-2.5 backdrop-blur-xs"
                >
                  <p className="font-mono text-xs font-extrabold text-brass">{item.value}</p>
                  <p className="mt-0.5 text-[11px] font-semibold text-white">{item.label}</p>
                </div>
              ))}
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-[11px] text-cream/75">
              <span className="inline-flex items-center gap-1.5">
                <Tag className="h-3.5 w-3.5 text-brass" /> Best Market Bundle Rates
              </span>
              <span className="inline-flex items-center gap-1.5">
                <ShieldCheck className="h-3.5 w-3.5 text-brass" /> Verified Hand Fulfillment
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Lock className="h-3.5 w-3.5 text-brass" /> AES-256 Encrypted Vault
              </span>
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-2.5">
              <Link
                href="/deals"
                className="inline-flex h-10 items-center justify-center gap-1.5 rounded-[2px] border border-brass bg-brass px-5 text-xs font-semibold uppercase tracking-[0.14em] text-ink outline -outline-offset-[4px] outline-1 outline-ink/25 transition hover:bg-brass/90"
              >
                Grab Combo Deals <ArrowRight className="h-3.5 w-3.5" />
              </Link>
              <WhatsAppCta
                message={`Hi ${siteName}! I want a quote or to order an 8 Ball Pool Combo Deal.`}
                label="WhatsApp"
                showNumber
                size="sm"
                className="h-10 rounded-xl px-4 text-xs"
              />
            </div>
          </div>

          <div className="lg:col-span-6">
            <div className="relative overflow-hidden rounded-[4px] border border-brass/35 bg-felt-deep">
              <Image
                src="/images/pool/combo-bundles-deals.jpg"
                alt="Esports Exclusive Combo Bundles — Custom Top-Ups and Special Services"
                width={1376}
                height={768}
                priority={headingTag === "h1"}
                className="h-auto w-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>

      {/* 3 Pricing Cards Layout */}
      <div className="grid gap-4 md:grid-cols-3">
        {COMBO_CARD_SPECS.map((spec) => {
          const pack = packs.find((p) => p.slug === spec.slug) ?? null;
          const displayPrice = pack ? pack.priceCents : spec.fallbackPriceCents;
          const comparePrice = pack?.compareCents ?? spec.fallbackCompareCents;
          const discountPct =
            comparePrice && comparePrice > displayPrice
              ? Math.round(((comparePrice - displayPrice) / comparePrice) * 100)
              : null;
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
                    {discountPct ? `-${discountPct}% BUNDLE` : spec.metaLabel}
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
                  <span className="shrink-0 whitespace-nowrap text-[11px] font-semibold uppercase tracking-wider text-muted">
                    Discounted Price
                  </span>
                  <div className="flex flex-wrap items-baseline justify-end gap-x-1.5 gap-y-0.5 text-right">
                    <span className="whitespace-nowrap font-mono text-2xl font-semibold text-ink">
                      {formatMoney(displayPrice, currency, rates)}
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
                  disabled={!pack}
                  onClick={() => pack && handleGrabDeal(pack)}
                >
                  <Flame className="h-4 w-4" />
                  {pack ? "Grab Deal" : "Currently Unavailable"}
                </Button>

                <div className="mt-2.5 text-center">
                  <Link
                    href={`/product/${spec.slug}`}
                    className="text-[11px] font-semibold text-muted transition-colors hover:text-brand hover:underline"
                  >
                    Bundle breakdown →
                  </Link>
                </div>
              </div>
            </Card>
          );
        })}

        {/* Card 3: Custom Build Box */}
        <Card className="flex h-full flex-col justify-between p-5 hover:border-brand/50 hover:shadow-md">
          <div>
            <div className="flex items-center justify-between gap-2">
              <Badge tone="gray">
                <SlidersHorizontal className="h-3 w-3" /> Custom Service
              </Badge>
              <span className="font-mono text-[10px] font-semibold uppercase tracking-wider text-muted">
                Tailored Quote
              </span>
            </div>

            <h3 className="mt-3.5 font-display text-xl font-semibold tracking-tight text-ink">Custom Build Box</h3>
            <p className="mt-1 text-xs font-medium leading-relaxed text-muted">
              Mix &amp; match coins, cues, and tools to your exact needs
            </p>

            <div className="mt-4 border-t border-border pt-3.5">
              <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-muted">
                Pick Bundle Items
              </p>
              <div className="flex flex-wrap gap-1.5">
                {CUSTOM_BUILD_OPTIONS.map((opt) => {
                  const active = selectedMix.includes(opt);
                  return (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => toggleMix(opt)}
                      className={cn(
                        "cursor-pointer rounded-md border px-2.5 py-1 font-mono text-[10px] font-semibold transition-colors",
                        active
                          ? "border-brand bg-brand-soft text-brand"
                          : "border-border bg-surface-2/70 text-muted hover:border-border-hover hover:text-foreground",
                      )}
                    >
                      {active ? `✓ ${opt}` : `+ ${opt}`}
                    </button>
                  );
                })}
              </div>
            </div>

            <ul className="mt-3.5 space-y-1.5 text-xs">
              <li className="flex items-start gap-2">
                <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-brand" />
                <span className="leading-snug text-muted">Custom multi-item discount up to 40% off</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-brand" />
                <span className="leading-snug text-muted">Direct quote &amp; coordinated single delivery</span>
              </li>
            </ul>
          </div>

          <div className="mt-5 border-t border-border pt-4">
            <div className="mb-3 flex items-baseline justify-between gap-2">
              <span className="shrink-0 whitespace-nowrap text-[11px] font-semibold uppercase tracking-wider text-muted">
                Bundle Quote
              </span>
              <span className="whitespace-nowrap font-mono text-2xl font-semibold text-felt">Custom Price</span>
            </div>

            <a
              href={customChatUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-[2px] border border-felt bg-felt px-5 text-xs font-semibold uppercase tracking-[0.16em] text-paper outline -outline-offset-[4px] outline-1 outline-brass/50 transition-all duration-150 hover:bg-felt-deep"
            >
              <MessageCircle className="h-4 w-4" />
              Chat for Custom Price
            </a>

            <div className="mt-2.5 text-center">
              <Link
                href="/help#contact"
                className="text-[11px] font-semibold text-muted transition-colors hover:text-brand hover:underline"
              >
                Or open support ticket →
              </Link>
            </div>
          </div>
        </Card>
      </div>
    </section>
  );
}
