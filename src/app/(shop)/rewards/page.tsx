import Link from "next/link";
import { Suspense } from "react";
import type { Metadata } from "next";
import { Award, Check, Gift, ShoppingCart, Users } from "lucide-react";
import { Badge, Card, Container, PageFallback } from "@/components/ui/primitives";
import { ClubhousePageHero } from "@/components/clubhouse/page-hero";
import { CopyButton } from "@/components/ui/copy-button";
import { Price } from "@/components/price";
import { getCurrentUser } from "@/lib/auth";
import { POINTS_PER_DOLLAR_OFF, POINTS_PER_USD, site, tierFor, tiers } from "@/lib/site";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Customer Rewards, VIP Tiers & Referrals",
  description: "Earn loyalty points on every 8 Ball Pool order, unlock VIP tiers and earn commission by referring friends.",
};

async function RewardsBody() {
  const user = await getCurrentUser();
  const tier = user ? tierFor(user.lifetimeSpend) : null;
  const activeTierName = tier ? tier.current.name : tiers[0]?.name ?? "Bronze";
  const points = user?.points ?? 0;
  const progressPct = tier ? tier.progress : 0;
  const refUrl = user ? `${site.url}/?ref=${user.referralCode}` : null;

  return (
    <div className="bg-cream">
      <ClubhousePageHero
        crumbs={[{ label: "Home", href: "/" }, { label: "Rewards" }]}
        eyebrow="CUSTOMER REWARDS"
        title="Loyalty Wallet, VIP Tiers & Referrals"
        subtitle={`Earn ${POINTS_PER_USD} points per $1 spent. ${POINTS_PER_DOLLAR_OFF} points = $1 off at checkout.`}
      />

      <Container className="space-y-10 py-10 sm:py-12">
        {/* Wallet Balance Card */}
        <Card className="p-6 sm:p-7">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted">Your Wallet</p>
              <div className="mt-1 flex items-baseline gap-2">
                <span className="font-display text-4xl font-semibold text-ink">
                  {points.toLocaleString()}
                </span>
                <span className="text-xs text-muted">points</span>
              </div>

              {user && tier ? (
                <>
                  <div className="mt-4 h-1.5 w-full max-w-2xl overflow-hidden rounded-full bg-[#E5DBC7]">
                    <div className="h-full bg-brass transition-all" style={{ width: `${progressPct}%` }} />
                  </div>
                  <p className="mt-2 text-xs text-muted">
                    Current tier: <strong className="text-ink">{tier.current.name}</strong> ({tier.current.multiplier}× multiplier) · Lifetime spend:{" "}
                    <Price cents={user.lifetimeSpend} className="text-xs font-semibold text-ink" />
                  </p>
                </>
              ) : (
                <p className="mt-2 text-xs text-muted">
                  Create a free account to collect points on every purchase and get your {site.referralPercent}% referral link.
                </p>
              )}
            </div>

            {user ? (
              <Link
                href="/checkout"
                className="btn-club-primary inline-flex h-10 items-center justify-center rounded-[2px] px-5 text-[10px] font-semibold uppercase tracking-[0.2em]"
              >
                Redeem at Checkout
              </Link>
            ) : (
              <Link
                href="/register?next=/rewards"
                className="btn-club-primary inline-flex h-10 items-center justify-center rounded-[2px] px-5 text-[10px] font-semibold uppercase tracking-[0.2em]"
              >
                Create Free Account
              </Link>
            )}
          </div>

          {refUrl && (
            <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-border pt-4 text-xs">
              <span className="text-muted">
                Your referral link ({site.referralPercent}% commission):{" "}
                <code className="font-mono text-ink">{refUrl}</code>
              </span>
              <CopyButton text={refUrl} label="Copy referral link" />
            </div>
          )}
        </Card>

        {/* Real VIP Tiers from lib/site */}
        <section className="space-y-4">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-brass-dark">
              VIP PROGRESSION
            </p>
            <h2 className="mt-1 font-display text-2xl font-semibold text-ink sm:text-3xl">
              VIP Tiers
            </h2>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {tiers.map((t) => {
              const isCurrent = t.name === activeTierName;
              return (
                <div
                  key={t.name}
                  className={cn(
                    "flex flex-col justify-between rounded-[6px] border p-5 transition",
                    isCurrent
                      ? "felt-surface border-brass/50 text-paper"
                      : "border-border bg-paper text-ink hover:border-brass",
                  )}
                >
                  <div>
                    <div className="flex items-center justify-between gap-2">
                      <Badge tone="gold">{t.multiplier}× Points</Badge>
                      {isCurrent && (
                        <span className="text-[9px] font-semibold uppercase tracking-[0.2em] text-brass">
                          ACTIVE
                        </span>
                      )}
                    </div>
                    <h3 className="mt-3 font-display text-2xl font-semibold">{t.name}</h3>
                    <p className={cn("mt-1 text-xs", isCurrent ? "text-paper/75" : "text-muted")}>
                      {t.min === 0 ? (
                        "Unlocked at signup"
                      ) : (
                        <>
                          From <Price cents={t.min} className={cn("text-xs font-semibold", isCurrent ? "text-paper" : "text-ink")} /> spend
                        </>
                      )}
                    </p>
                  </div>
                  <div className={cn("mt-4 flex items-center gap-1.5 border-t pt-3 text-[11px]", isCurrent ? "border-paper/15 text-brass" : "border-border text-felt")}>
                    <Check className="h-3.5 w-3.5 shrink-0" />
                    <span>{Math.round(POINTS_PER_USD * t.multiplier)} pts per $1</span>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </Container>

      {/* Dark Felt Section: Real How It Works from lib/site */}
      <section className="felt-surface border-y border-brass/25 py-14 text-paper">
        <Container className="space-y-7">
          <h2 className="font-display text-3xl font-semibold text-paper">How rewards work</h2>
          <div className="grid gap-4 md:grid-cols-3">
            {[
              {
                Icon: ShoppingCart,
                title: "Earn on every order",
                sub: `${POINTS_PER_USD} base points per $1 spent, multiplied by your VIP tier.`,
              },
              {
                Icon: Award,
                title: "Redeem at checkout",
                sub: `${POINTS_PER_DOLLAR_OFF} points = $1 instant discount on any item in the store.`,
              },
              {
                Icon: Users,
                title: `Refer friends (${site.referralPercent}%)`,
                sub: `Share your link. Every completed order from a referred player credits ${site.referralPercent}% to your wallet.`,
              },
            ].map(({ Icon, title, sub }) => (
              <div
                key={title}
                className="flex flex-col items-start rounded-[6px] border border-brass/25 bg-felt-deep/65 p-6"
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-[4px] bg-brass text-mahogany">
                  <Icon className="h-4 w-4 stroke-[1.8]" />
                </span>
                <h3 className="mt-4 font-display text-xl font-semibold text-paper">{title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-paper/80">{sub}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Bottom CTA */}
      <section className="py-12">
        <Container>
          <Card className="flex flex-wrap items-center justify-between gap-4 p-6">
            <div className="flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-[4px] bg-felt text-brass">
                <Gift className="h-5 w-5" />
              </span>
              <div>
                <h3 className="font-display text-xl font-semibold text-ink">Ready to put your points to work?</h3>
                <p className="text-xs text-muted">Apply your points directly inside the checkout counter.</p>
              </div>
            </div>
            <Link
              href="/store"
              className="btn-club-brass inline-flex h-10 items-center justify-center rounded-[2px] px-5 text-[10px] font-semibold uppercase tracking-[0.18em]"
            >
              Browse Catalog
            </Link>
          </Card>
        </Container>
      </section>
    </div>
  );
}

export default function RewardsPage() {
  return (
    <Suspense fallback={<PageFallback />}>
      <RewardsBody />
    </Suspense>
  );
}
