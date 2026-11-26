import { Suspense } from "react";
import type { Metadata } from "next";
import { PageFallback, Container } from "@/components/ui/primitives";
import { ClubhousePageHero } from "@/components/clubhouse/page-hero";
import { DashboardClient } from "@/components/shop/dashboard-client";
import { requireUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { statusLabels } from "@/lib/orders";
import { site, tierFor } from "@/lib/site";
import { formatDate } from "@/lib/utils";

export const metadata: Metadata = { title: "Account Dashboard", robots: { index: false } };

async function DashboardBody() {
  const user = await requireUser("/dashboard");
  const [orders, gameIds, referrals] = await Promise.all([
    db.order.findMany({
      where: { userId: user.id },
      include: { items: true, events: { orderBy: { createdAt: "asc" } } },
      orderBy: { createdAt: "desc" },
    }),
    db.savedGameId.findMany({ where: { userId: user.id }, orderBy: { createdAt: "desc" } }),
    db.user.count({ where: { referredById: user.id } }),
  ]);

  const { current, next } = tierFor(user.lifetimeSpend);
  const referralUrl = `${site.url}/?ref=${user.referralCode}`;
  const firstName = user.name?.split(" ")[0] ?? "Member";
  const memberSince = new Date(user.createdAt).toLocaleDateString("en-US", { month: "long", year: "numeric" });

  const mappedOrders = orders.map((o) => ({
    id: o.id,
    trackingId: o.trackingId,
    email: o.email,
    status: o.status,
    statusLabel: statusLabels[o.status],
    totalCents: o.totalCents,
    createdAtLabel: formatDate(o.createdAt),
    itemSummary: o.items.map((i) => `${i.name}${i.quantity > 1 ? ` × ${i.quantity}` : ""}`).join(", "),
    events: o.events.map((e) => ({
      id: e.id,
      status: e.status,
      message: e.message,
      createdAt: e.createdAt.toISOString(),
    })),
  }));

  const pointsToNext = next ? Math.max(0, Math.round((next.min - user.lifetimeSpend) / 10)) : 0;

  return (
    <div className="bg-cream">
      <ClubhousePageHero
        crumbs={[
          { label: "Home", href: "/" },
          { label: "Dashboard" },
        ]}
        eyebrow="Members' area"
        title={`Good evening, ${firstName}`}
        subtitle={`${current.name} member since ${memberSince}`}
      />

      <Container className="py-10 sm:py-12">
        <DashboardClient
          user={{ email: user.email, name: user.name, points: user.points }}
          orders={mappedOrders}
          savedIds={gameIds.map((g) => ({ id: g.id, label: g.label, uniqueId: g.uniqueId }))}
          tierName={current.name}
          tierMultiplier={current.multiplier}
          pointsToNext={pointsToNext}
          nextTierName={next?.name ?? null}
          referralUrl={referralUrl}
          referralCount={referrals}
        />
      </Container>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <Suspense fallback={<PageFallback />}>
      <DashboardBody />
    </Suspense>
  );
}
