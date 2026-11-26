"use client";

import { useState } from "react";
import Link from "next/link";
import { Award, Bookmark, LayoutGrid, LogOut, Package, Plus, Settings, Trash2 } from "lucide-react";
import { RomanOrderStepper } from "@/components/clubhouse/roman-timeline";
import { Button } from "@/components/ui/button";
import { Badge, Card, Input, Label } from "@/components/ui/primitives";
import { CopyButton } from "@/components/ui/copy-button";
import { logoutAction } from "@/app/actions/auth";
import { addSavedGameIdAction, deleteSavedGameIdAction } from "@/app/actions/account";
import { formatMoney } from "@/lib/currency";
import { cn } from "@/lib/utils";
import type { OrderStatus } from "@/generated/prisma/enums";

type DashOrder = {
  id: string;
  trackingId: string;
  email: string;
  status: OrderStatus;
  statusLabel: string;
  totalCents: number;
  createdAtLabel: string;
  itemSummary: string;
  events: { id: string; status: OrderStatus; message: string; createdAt: string }[];
};

type SavedId = { id: string; label: string; uniqueId: string };

export function DashboardClient({
  user,
  orders,
  savedIds,
  tierName,
  tierMultiplier,
  pointsToNext,
  nextTierName,
  referralUrl,
  referralCount,
}: {
  user: { email: string; name: string | null; points: number };
  orders: DashOrder[];
  savedIds: SavedId[];
  tierName: string;
  tierMultiplier: number;
  pointsToNext: number;
  nextTierName: string | null;
  referralUrl: string;
  referralCount: number;
}) {
  const [tab, setTab] = useState<"overview" | "orders" | "rewards" | "ids" | "settings">("overview");
  const [showAddId, setShowAddId] = useState(false);
  const [showAllOrders, setShowAllOrders] = useState(false);

  const activeOrder = orders.find((o) => o.status !== "COMPLETED" && o.status !== "CANCELLED") ?? orders[0] ?? null;
  const visibleOrders = showAllOrders || tab === "orders" ? orders : orders.slice(0, 4);

  const navItems = [
    { key: "overview", label: "Overview", Icon: LayoutGrid },
    { key: "orders", label: "Orders", Icon: Package },
    { key: "rewards", label: "Rewards", Icon: Award },
    { key: "ids", label: "Saved Unique IDs", Icon: Bookmark },
    { key: "settings", label: "Settings", Icon: Settings },
  ] as const;

  return (
    <div className="grid gap-6 lg:grid-cols-12">
      {/* Sidebar */}
      <aside className="lg:col-span-3">
        <Card className="p-2">
          <nav className="flex gap-1 overflow-x-auto no-scrollbar lg:flex-col">
            {navItems.map(({ key, label, Icon }) => {
              const active = tab === key;
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => setTab(key)}
                  className={cn(
                    "flex shrink-0 cursor-pointer items-center gap-2.5 rounded-[4px] px-3.5 py-2.5 text-left text-xs font-medium transition-colors",
                    active ? "bg-felt text-paper font-semibold" : "text-ink/80 hover:bg-cream",
                  )}
                >
                  <Icon className="h-3.5 w-3.5 shrink-0 stroke-[1.8]" />
                  <span>{label}</span>
                </button>
              );
            })}
            <form action={logoutAction} className="lg:mt-2 lg:border-t lg:border-border lg:pt-2">
              <button
                type="submit"
                className="flex w-full shrink-0 cursor-pointer items-center gap-2.5 rounded-[4px] px-3.5 py-2.5 text-left text-xs font-medium text-muted transition-colors hover:bg-cream hover:text-ink"
              >
                <LogOut className="h-3.5 w-3.5 shrink-0 stroke-[1.8]" />
                <span>Sign out</span>
              </button>
            </form>
          </nav>
        </Card>
      </aside>

      {/* Main Content */}
      <div className="space-y-6 lg:col-span-9">
        {tab === "overview" && (
          <>
            {/* 3 KPI cards */}
            <div className="grid gap-4 sm:grid-cols-3">
              <Card className="p-5">
                <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-muted">Orders</p>
                <p className="mt-2 font-display text-3xl font-semibold text-ink">{orders.length}</p>
                <p className="mt-1 text-xs text-muted">Tracked live</p>
              </Card>

              <Card className="p-5">
                <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-muted">Reward points</p>
                <p className="mt-2 font-display text-3xl font-semibold text-ink">{user.points.toLocaleString()}</p>
                <p className="mt-1 text-xs text-muted">
                  {nextTierName ? `${pointsToNext.toLocaleString()} to ${nextTierName}` : "Top tier reached"}
                </p>
              </Card>

              <div className="felt-surface rounded-[6px] border border-brass/30 p-5 text-paper">
                <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-brass">Tier</p>
                <p className="mt-2 font-display text-3xl font-semibold text-paper">{tierName}</p>
                <p className="mt-1 text-xs text-paper/75">{tierMultiplier} points per $1</p>
              </div>
            </div>

            {/* Active Order */}
            {activeOrder && (
              <Card className="space-y-5 p-5 sm:p-6">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-brass-dark">
                      Active order
                    </p>
                    <p className="mt-1 font-display text-2xl font-semibold text-ink">
                      {activeOrder.trackingId} · {activeOrder.itemSummary}
                    </p>
                  </div>
                  <Link
                    href={`/track?id=${activeOrder.trackingId}&v=${encodeURIComponent(activeOrder.email)}`}
                    className="btn-club-primary inline-flex h-9 items-center justify-center rounded-[2px] px-4 text-[10px] font-semibold uppercase tracking-[0.2em]"
                  >
                    Track
                  </Link>
                </div>
                <RomanOrderStepper status={activeOrder.status} events={activeOrder.events} />
              </Card>
            )}
          </>
        )}

        {(tab === "overview" || tab === "orders") && (
          <Card className="p-5 sm:p-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-display text-2xl font-semibold text-ink">Order history</h2>
              {tab === "overview" && orders.length > 4 && (
                <button
                  type="button"
                  onClick={() => setShowAllOrders((v) => !v)}
                  className="cursor-pointer text-xs font-semibold text-felt underline"
                >
                  {showAllOrders ? "Show less" : "View all"}
                </button>
              )}
            </div>

            {orders.length === 0 ? (
              <p className="py-6 text-sm text-muted">
                No orders placed yet.{" "}
                <Link href="/store" className="font-semibold text-felt underline">
                  Browse the store
                </Link>
              </p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-border text-[9px] font-semibold uppercase tracking-[0.22em] text-muted">
                      <th className="pb-2.5 pr-4">Order</th>
                      <th className="pb-2.5 pr-4">Item</th>
                      <th className="hidden pb-2.5 pr-4 sm:table-cell">Date</th>
                      <th className="pb-2.5 pr-4">Status</th>
                      <th className="pb-2.5 text-right">Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/70">
                    {visibleOrders.map((o) => (
                      <tr key={o.id} className="hover:bg-cream/40">
                        <td className="py-3 pr-4 font-mono font-semibold text-ink">
                          <Link
                            href={`/track?id=${o.trackingId}&v=${encodeURIComponent(o.email)}`}
                            className="hover:text-felt hover:underline"
                          >
                            {o.trackingId}
                          </Link>
                        </td>
                        <td className="py-3 pr-4 text-ink">{o.itemSummary}</td>
                        <td className="hidden py-3 pr-4 text-muted sm:table-cell">{o.createdAtLabel}</td>
                        <td className="py-3 pr-4">
                          <Badge tone={o.status === "COMPLETED" ? "gold" : o.status === "REFUNDED" ? "red" : "felt"}>
                            {o.statusLabel}
                          </Badge>
                        </td>
                        <td className="py-3 text-right font-semibold text-ink">{formatMoney(o.totalCents)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </Card>
        )}

        {(tab === "overview" || tab === "ids") && (
          <Card id="saved-ids" className="space-y-4 p-5 sm:p-6">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-2xl font-semibold text-ink">Saved Unique IDs</h2>
              <button
                type="button"
                onClick={() => setShowAddId((v) => !v)}
                className="inline-flex h-8 cursor-pointer items-center gap-1 rounded-[2px] border border-[#D4C9B2] bg-paper px-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-ink hover:border-brass"
              >
                <Plus className="h-3 w-3" /> Add ID
              </button>
            </div>

            {showAddId && (
              <form
                action={addSavedGameIdAction}
                className="grid gap-3 rounded-[4px] border border-border bg-cream/60 p-4 sm:grid-cols-12"
              >
                <div className="sm:col-span-4">
                  <Label htmlFor="dash-label">Label</Label>
                  <Input id="dash-label" name="label" required placeholder="MAIN_ID" className="h-9 text-xs" />
                </div>
                <div className="sm:col-span-5">
                  <Label htmlFor="dash-uid">Unique ID</Label>
                  <Input id="dash-uid" name="uniqueId" required placeholder="347-829-1056" className="h-9 text-xs" />
                </div>
                <div className="flex items-end sm:col-span-3">
                  <Button type="submit" variant="primary" size="sm" className="h-9 w-full">
                    Save ID
                  </Button>
                </div>
              </form>
            )}

            {savedIds.length === 0 ? (
              <p className="text-xs text-muted">No saved Unique IDs yet. Add one for faster checkout.</p>
            ) : (
              <div className="grid gap-3 sm:grid-cols-2">
                {savedIds.map((g, idx) => (
                  <div
                    key={g.id}
                    className="flex items-center justify-between gap-3 rounded-[4px] border border-border bg-cream/50 px-4 py-3"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-xs font-semibold uppercase tracking-wider text-ink">{g.label}</p>
                      <p className="mt-0.5 font-mono text-xs text-muted">{g.uniqueId}</p>
                    </div>
                    <div className="flex shrink-0 items-center gap-2">
                      {idx === 0 && (
                        <span className="rounded-[2px] bg-felt px-2 py-0.5 text-[9px] font-semibold uppercase tracking-[0.18em] text-paper">
                          Default
                        </span>
                      )}
                      <CopyButton text={g.uniqueId} label="Copy" />
                      <form action={deleteSavedGameIdAction}>
                        <input type="hidden" name="id" value={g.id} />
                        <button
                          type="submit"
                          aria-label="Remove Unique ID"
                          className="cursor-pointer p-1 text-muted hover:text-danger"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </form>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        )}

        {tab === "rewards" && (
          <Card className="space-y-4 p-6">
            <h2 className="font-display text-2xl font-semibold text-ink">Rewards & Referrals</h2>
            <p className="text-sm text-muted">
              You currently hold <strong className="text-ink">{user.points.toLocaleString()} points</strong> in the{" "}
              <strong className="text-ink">{tierName}</strong> tier ({tierMultiplier}× multiplier).
            </p>
            <div className="rounded-[4px] border border-border bg-cream/60 p-4">
              <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-muted">
                Your referral link ({referralCount} referred)
              </p>
              <div className="mt-2 flex flex-wrap items-center justify-between gap-2">
                <code className="font-mono text-xs text-ink break-all">{referralUrl}</code>
                <CopyButton text={referralUrl} label="Copy link" />
              </div>
            </div>
            <Link
              href="/rewards"
              className="btn-club-primary inline-flex h-10 items-center justify-center rounded-[2px] px-5 text-[10px] font-semibold uppercase tracking-[0.2em]"
            >
              Open rewards club
            </Link>
          </Card>
        )}

        {tab === "settings" && (
          <Card className="space-y-4 p-6">
            <h2 className="font-display text-2xl font-semibold text-ink">Member details</h2>
            <div className="grid gap-4 text-xs sm:grid-cols-2">
              <div>
                <p className="text-muted">Name</p>
                <p className="mt-1 font-semibold text-ink">{user.name ?? "Club Member"}</p>
              </div>
              <div>
                <p className="text-muted">Email</p>
                <p className="mt-1 font-semibold text-ink">{user.email}</p>
              </div>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
