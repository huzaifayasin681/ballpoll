"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  Check,
  Crown,
  Crosshair,
  Infinity as InfinityIcon,
  KeyRound,
  ShieldCheck,
  Sparkles,
  Target,
} from "lucide-react";
import { useCart } from "@/components/cart/cart-context";
import { Button } from "@/components/ui/button";
import { Badge, Card } from "@/components/ui/primitives";
import { ShowcaseVideo } from "@/components/ui/showcase-video";
import { formatMoney, type CurrencyCode, type Rates } from "@/lib/currency";
import type { LegendaryPackItem } from "@/lib/catalog";
import { cn } from "@/lib/utils";

const ASSIST_HIGHLIGHTS = [
  { label: "Guideline", value: "EXTENDED" },
  { label: "Bank Shots", value: "CUSHION" },
  { label: "Key Delivery", value: "INSTANT" },
  { label: "VIP Desk", value: "24 / 7" },
] as const;

const ASSIST_CARD_SPECS = [
  {
    slug: "weekly-pass-key",
    title: "Weekly Pass",
    subtitle: "7 Days Pro Aim Assist & Long Guideline Key",
    badge: "7-Day Pass",
    badgeTone: "green" as const,
    metaLabel: "Instant Key",
    fallbackPriceCents: 1499,
    Icon: Crosshair,
    highlight: false,
    buttonVariant: "primary" as const,
    features: [
      "Extended long guideline trajectory overlay",
      "Precision direct-shot & rail aligner",
      "Instant automated license key activation",
    ],
  },
  {
    slug: "monthly-vip-key",
    title: "Monthly VIP Key",
    subtitle: "30 Days Full Features + Cushion Line Prediction",
    badge: "Most Popular",
    badgeTone: "gold" as const,
    metaLabel: "30-Day VIP",
    fallbackPriceCents: 3499,
    Icon: Crown,
    highlight: true,
    buttonVariant: "gold" as const,
    features: [
      "All pro aim assist & extended guidelines",
      "Multi-cushion bank shot line prediction",
      "Auto-play assist & priority updates",
    ],
  },
  {
    slug: "ultimate-season-pass",
    title: "Ultimate Season Pass",
    subtitle: "Lifetime / Latest Anti-Ban Update + 24/7 Support",
    badge: "Anti-Ban Build",
    badgeTone: "green" as const,
    metaLabel: "Lifetime Pass",
    fallbackPriceCents: 8999,
    Icon: InfinityIcon,
    highlight: false,
    buttonVariant: "primary" as const,
    features: [
      "Ongoing latest anti-ban protection builds",
      "Full cushion prediction & auto-play suite",
      "Dedicated 24/7 VIP support & key backup",
    ],
  },
] as const;

export function GameplayAssistShop({
  packs,
  currency,
  rates,
  headingTag = "h2",
  showCatalogLink = false,
}: {
  packs: LegendaryPackItem[];
  currency: CurrencyCode;
  rates: Rates;
  headingTag?: "h1" | "h2";
  showCatalogLink?: boolean;
}) {
  const { add } = useCart();
  const router = useRouter();

  const Heading = headingTag;

  function handleGetKey(pack: LegendaryPackItem) {
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
    <section aria-labelledby="gameplay-assist-heading" className="space-y-5">
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
                <Sparkles className="h-3 w-3" /> Advanced Gameplay Assist &amp; Tools
              </span>
              {showCatalogLink && (
                <Link
                  href="/store/vip-access"
                  className="inline-flex items-center gap-1 text-xs font-semibold text-[#68d8ae] hover:underline"
                >
                  All VIP &amp; Access Keys <ArrowRight className="h-3 w-3" />
                </Link>
              )}
            </div>

            <Heading
              id="gameplay-assist-heading"
              className="mt-3.5 text-2xl font-extrabold tracking-tight text-white sm:text-3xl lg:text-[2rem] lg:leading-[1.15]"
            >
              8 Ball Pool Pro Aim Assist{" "}
              <span className="bg-gradient-to-r from-[#f8d896] via-[#f3c474] to-[#e2a33b] bg-clip-text text-transparent">
                &amp; Extended Guideline Tools
              </span>
            </Heading>

            <p className="mt-2.5 max-w-xl text-xs leading-relaxed text-[#c6d3cd] sm:text-sm">
              Dominate Every Match with Precision Cushion Shot Predictions &amp; Auto-Play
            </p>

            {/* 4 Key Tool Capability Tiles */}
            <div className="mt-5 grid grid-cols-2 gap-2.5 sm:grid-cols-4">
              {ASSIST_HIGHLIGHTS.map((item) => (
                <div
                  key={item.label}
                  className="rounded-xl border border-white/10 bg-black/35 px-3 py-2.5 backdrop-blur-xs"
                >
                  <p className="font-mono text-xs font-extrabold text-[#f3c474]">{item.value}</p>
                  <p className="mt-0.5 text-[11px] font-semibold text-white">{item.label}</p>
                </div>
              ))}
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-[11px] text-[#b4c4bc]">
              <span className="inline-flex items-center gap-1.5">
                <Target className="h-3.5 w-3.5 text-[#f3c474]" /> Cushion Line Prediction
              </span>
              <span className="inline-flex items-center gap-1.5">
                <KeyRound className="h-3.5 w-3.5 text-[#68d8ae]" /> Instant License Delivery
              </span>
              <span className="inline-flex items-center gap-1.5">
                <ShieldCheck className="h-3.5 w-3.5 text-[#68d8ae]" /> Anti-Ban Builds &amp; 24/7 Support
              </span>
            </div>
          </div>

          <div className="lg:col-span-6">
            <div className="relative overflow-hidden rounded-xl border border-[#f3c474]/35 bg-black/50 shadow-2xl ring-1 ring-white/10">
              <ShowcaseVideo
                src="/videos/gameplay-assist-tools.mp4"
                poster="/images/pool/gameplay-assist-tools.jpg"
                title="Advanced Gameplay Assist Tools — Extended Guidelines and Precision Accuracy"
              />
            </div>
          </div>
        </div>
      </div>

      {/* 3 Pricing Cards Layout */}
      <div className="grid gap-4 md:grid-cols-3">
        {ASSIST_CARD_SPECS.map((spec) => {
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
                  <span className="shrink-0 whitespace-nowrap text-[11px] font-semibold uppercase tracking-wider text-muted">
                    Price
                  </span>
                  <div className="flex flex-wrap items-baseline justify-end gap-x-1.5 gap-y-0.5 text-right">
                    <span className="whitespace-nowrap font-mono text-2xl font-extrabold text-foreground">
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
                  onClick={() => pack && handleGetKey(pack)}
                >
                  <KeyRound className="h-4 w-4" />
                  {pack ? "Get Key" : "Currently Unavailable"}
                </Button>

                <div className="mt-2.5 text-center">
                  <Link
                    href={`/product/${spec.slug}`}
                    className="text-[11px] font-semibold text-muted transition-colors hover:text-brand hover:underline"
                  >
                    Key specifications →
                  </Link>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </section>
  );
}
