import Link from "next/link";
import { Suspense } from "react";
import type { Metadata } from "next";
import { LogOut, Plus, Shield, Trash2 } from "lucide-react";
import { Badge, Card, Container, Input, Label, PageFallback, SectionHeading } from "@/components/ui/primitives";
import { Button, buttonClass } from "@/components/ui/button";
import { CopyButton } from "@/components/ui/copy-button";
import { Price } from "@/components/price";
import { requireUser, STAFF_ROLES } from "@/lib/auth";
import { logoutAction } from "@/app/actions/auth";
import { addSavedGameIdAction, deleteSavedGameIdAction } from "@/app/actions/account";
import { db } from "@/lib/db";
import { statusLabels } from "@/lib/orders";
import { POINTS_PER_DOLLAR_OFF, site, tierFor } from "@/lib/site";
import { formatDate } from "@/lib/utils";

export const metadata: Metadata = { title: "My Account", robots: { index: false } };

async function DashboardBody() {
  const user = await requireUser("/dashboard");
  const [orders, gameIds, ledger, referrals] = await Promise.all([
    db.order.findMany({ where: { userId: user.id }, include: { items: true }, orderBy: { createdAt: "desc" } }),
    db.savedGameId.findMany({ where: { userId: user.id }, orderBy: { createdAt: "desc" } }),
    db.ledgerEntry.findMany({ where: { userId: user.id }, orderBy: { createdAt: "desc" }, take: 10 }),
    db.user.count({ where: { referredById: user.id } }),
  ]);

  const { current, next, progress } = tierFor(user.lifetimeSpend);
  const referralUrl = `${site.url}/?ref=${user.referralCode}`;

  return (
    <Container className="space-y-10 py-10">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <SectionHeading
          eyebrow="Customer Portal"
          title={`Welcome, ${user.name ?? user.email}`}
          subtitle="Manage your orders, saved Unique IDs, loyalty points and referral link."
        />
        <div className="flex items-center gap-2">
          {STAFF_ROLES.includes(user.role) && (
            <Link href="/admin" className={buttonClass("outline", "sm")}>
              <Shield className="h-4 w-4" /> Admin Panel ({user.role})
            </Link>
          )}
          <form action={logoutAction}>
            <Button type="submit" variant="ghost" size="sm">
              <LogOut className="h-4 w-4" /> Sign out
            </Button>
          </form>
        </div>
      </div>

      {/* Loyalty + Referral cards */}
      <div className="grid gap-5 md:grid-cols-3">
        <Card className="p-6">
          <p className="text-xs text-muted">Loyalty Balance</p>
          <p className="mt-1 font-display text-3xl font-bold text-brand">{user.points.toLocaleString()} pts</p>
          <p className="mt-1 text-xs text-muted">
            Worth <Price cents={(user.points / POINTS_PER_DOLLAR_OFF) * 100} className="text-xs" /> at checkout
          </p>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <p className="text-xs text-muted">VIP Tier</p>
            <Badge tone="gold">
              {current.name} · {current.multiplier}× pts
            </Badge>
          </div>
          <div className="mt-3 h-2 overflow-hidden rounded-full bg-surface-2">
            <div className={`h-full ${current.color}`} style={{ width: `${progress}%` }} />
          </div>
          <p className="mt-2 text-xs text-muted">
            {next ? (
              <>
                Spend <Price cents={next.min - user.lifetimeSpend} className="text-xs" /> more to unlock <strong>{next.name}</strong> ({next.multiplier}×)
              </>
            ) : (
              "Highest tier unlocked!"
            )}
          </p>
        </Card>

        <Card className="p-6">
          <p className="text-xs text-muted">Refer & Earn ({site.referralPercent}% commission)</p>
          <p className="mt-1 font-mono text-sm text-foreground break-all">{referralUrl}</p>
          <div className="mt-3 flex items-center justify-between">
            <span className="text-xs text-muted">{referrals} referred players</span>
            <CopyButton text={referralUrl} label="Copy link" />
          </div>
        </Card>
      </div>

      <div className="grid gap-8 lg:grid-cols-12">
        {/* Orders */}
        <div className="space-y-4 lg:col-span-8">
          <h2 className="font-display text-xl font-bold text-foreground">Order History ({orders.length})</h2>
          {orders.length === 0 ? (
            <Card className="p-8 text-center text-sm text-muted">
              No orders yet.{" "}
              <Link href="/store" className="text-brand underline">
                Browse the store
              </Link>
              .
            </Card>
          ) : (
            orders.map((o) => (
              <Card key={o.id} className="flex flex-wrap items-center justify-between gap-4 p-5">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-foreground">{o.trackingId}</span>
                    <Badge tone={o.status === "COMPLETED" ? "green" : o.status === "REFUNDED" ? "red" : "gold"}>
                      {statusLabels[o.status]}
                    </Badge>
                  </div>
                  <p className="mt-1 text-sm text-muted">{o.items.map((i) => `${i.name} × ${i.quantity}`).join(", ")}</p>
                  <p className="mt-0.5 text-xs text-muted">{formatDate(o.createdAt)}</p>
                </div>
                <div className="flex items-center gap-3">
                  <Price cents={o.totalCents} />
                  <Link href={`/track?id=${o.trackingId}&v=${encodeURIComponent(o.email)}`} className={buttonClass("secondary", "sm")}>
                    Track →
                  </Link>
                </div>
              </Card>
            ))
          )}
        </div>

        {/* Saved Unique IDs + Points ledger */}
        <div className="space-y-6 lg:col-span-4">
          <Card className="space-y-4 p-5">
            <div>
              <h2 className="font-display text-base font-bold text-foreground">Saved Miniclip Unique IDs</h2>
              <p className="text-xs text-muted">For one-click selection at checkout. Passwords are never saved here.</p>
            </div>
            <ul className="space-y-2 text-sm">
              {gameIds.map((g) => (
                <li key={g.id} className="flex items-center justify-between rounded-xl bg-surface-2 px-3 py-2">
                  <span>
                    <strong className="text-foreground">{g.label}:</strong> <code className="font-mono text-xs">{g.uniqueId}</code>
                  </span>
                  <form action={deleteSavedGameIdAction}>
                    <input type="hidden" name="id" value={g.id} />
                    <button aria-label="Remove" className="text-muted hover:text-danger">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </form>
                </li>
              ))}
            </ul>
            <form action={addSavedGameIdAction} className="space-y-2 border-t border-border pt-3">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label htmlFor="label" className="text-xs">
                    Label
                  </Label>
                  <Input id="label" name="label" required placeholder="Main" className="h-9 text-xs" />
                </div>
                <div>
                  <Label htmlFor="uniqueId" className="text-xs">
                    Unique ID
                  </Label>
                  <Input id="uniqueId" name="uniqueId" required placeholder="123-456-789-0" className="h-9 text-xs" />
                </div>
              </div>
              <Button type="submit" variant="secondary" size="sm" className="w-full">
                <Plus className="h-3.5 w-3.5" /> Save Unique ID
              </Button>
            </form>
          </Card>

          <Card className="space-y-3 p-5">
            <h2 className="font-display text-base font-bold text-foreground">Recent Points Activity</h2>
            {ledger.length === 0 ? (
              <p className="text-xs text-muted">Points earned and redeemed on orders will appear here.</p>
            ) : (
              <ul className="space-y-2 text-xs">
                {ledger.map((l) => (
                  <li key={l.id} className="flex justify-between">
                    <span className="text-muted">{l.note}</span>
                    <span className={l.points >= 0 ? "font-semibold text-brand" : "text-danger"}>
                      {l.points >= 0 ? `+${l.points}` : l.points} pts
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </Card>
        </div>
      </div>
    </Container>
  );
}

export default function DashboardPage() {
  return (
    <Suspense fallback={<PageFallback />}>
      <DashboardBody />
    </Suspense>
  );
}
