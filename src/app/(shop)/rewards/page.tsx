import Link from "next/link";
import { Suspense } from "react";
import type { Metadata } from "next";
import { Award, Gift, Users } from "lucide-react";
import { Badge, Card, Container, PageFallback, SectionHeading } from "@/components/ui/primitives";
import { buttonClass } from "@/components/ui/button";
import { CopyButton } from "@/components/ui/copy-button";
import { Price } from "@/components/price";
import { getCurrentUser } from "@/lib/auth";
import { POINTS_PER_DOLLAR_OFF, POINTS_PER_USD, site, tierFor, tiers } from "@/lib/site";

export const metadata: Metadata = {
  title: "Customer Rewards, VIP Tiers & Referrals",
  description: "Earn loyalty points on every 8 Ball Pool order, unlock VIP tiers and earn commission by referring friends.",
};

async function RewardsBody() {
  const user = await getCurrentUser();
  const tier = user ? tierFor(user.lifetimeSpend) : null;
  const refUrl = user ? `${site.url}/?ref=${user.referralCode}` : null;

  return (
    <Container className="space-y-12 py-10">
      <SectionHeading
        eyebrow="Customer Rewards"
        title="Loyalty Wallet, VIP Tiers & Referrals"
        subtitle={`Earn ${POINTS_PER_USD} points per $1 spent. ${POINTS_PER_DOLLAR_OFF} points = $1 off at checkout.`}
      />

      {user && tier ? (
        <Card className="grid gap-6 p-6 md:grid-cols-3">
          <div>
            <p className="text-xs text-muted">Your Wallet</p>
            <p className="mt-1 font-display text-3xl font-bold text-brand">{user.points.toLocaleString()} pts</p>
            <p className="text-xs text-muted">
              Current tier: <strong className="text-foreground">{tier.current.name}</strong> ({tier.current.multiplier}× multiplier)
            </p>
          </div>
          <div>
            <p className="text-xs text-muted">Tier Progress</p>
            <div className="mt-2 h-2 overflow-hidden rounded-full bg-surface-2">
              <div className={`h-full ${tier.current.color}`} style={{ width: `${tier.progress}%` }} />
            </div>
            <p className="mt-2 text-xs text-muted">
              Lifetime spend: <Price cents={user.lifetimeSpend} className="text-xs" />
            </p>
          </div>
          <div>
            <p className="text-xs text-muted">Your Referral Link ({site.referralPercent}% commission)</p>
            <p className="mt-1 truncate font-mono text-xs text-foreground">{refUrl}</p>
            <div className="mt-2">
              <CopyButton text={refUrl!} label="Copy referral link" />
            </div>
          </div>
        </Card>
      ) : (
        <Card className="flex flex-wrap items-center justify-between gap-4 p-6">
          <div>
            <h2 className="font-display text-lg font-bold text-foreground">Sign in to start earning</h2>
            <p className="text-sm text-muted">Create a free account to collect points and get your referral link.</p>
          </div>
          <Link href="/register?next=/rewards" className={buttonClass("primary", "md")}>
            Create Free Account
          </Link>
        </Card>
      )}

      {/* How it works */}
      <div className="grid gap-5 md:grid-cols-3">
        {[
          [Gift, "Earn on every order", `${POINTS_PER_USD} base points per $1 spent, multiplied by your VIP tier.`],
          [Award, "Redeem at checkout", `${POINTS_PER_DOLLAR_OFF} points = $1 instant discount on any item in the store.`],
          [Users, `Refer friends (${site.referralPercent}%)`, `Share your link. Every completed order from a referred player credits ${site.referralPercent}% to your wallet.`],
        ].map(([Icon, t, d]) => {
          const I = Icon as typeof Gift;
          return (
            <Card key={t as string} className="p-6">
              <I className="h-6 w-6 text-brand" />
              <h3 className="mt-3 font-display text-lg font-bold text-foreground">{t as string}</h3>
              <p className="mt-1 text-sm text-muted">{d as string}</p>
            </Card>
          );
        })}
      </div>

      {/* Tiers */}
      <section className="space-y-4">
        <h2 className="font-display text-xl font-bold text-foreground">VIP Tiers</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {tiers.map((t) => (
            <Card key={t.name} className="p-5">
              <div className={`mb-3 h-1 w-10 rounded-full ${t.color}`} />
              <Badge tone="gold">{t.multiplier}× Points</Badge>
              <h3 className="mt-2 font-display text-lg font-bold text-foreground">{t.name}</h3>
              <p className="mt-1 text-xs text-muted">
                {t.min === 0 ? "Unlocked at signup" : <>From <Price cents={t.min} className="text-xs" /> lifetime spend</>}
              </p>
            </Card>
          ))}
        </div>
      </section>
    </Container>
  );
}

export default function RewardsPage() {
  return (
    <Suspense fallback={<PageFallback />}>
      <RewardsBody />
    </Suspense>
  );
}
