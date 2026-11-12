import Link from "next/link";
import { Suspense } from "react";
import type { Metadata } from "next";
import { Badge, Card, PageFallback, Select } from "@/components/ui/primitives";
import { Button, buttonClass } from "@/components/ui/button";
import { can, requireRole, STAFF_ROLES } from "@/lib/auth";
import { db } from "@/lib/db";
import { statusLabels } from "@/lib/orders";
import { formatMoney } from "@/lib/currency";
import { formatDate } from "@/lib/utils";
import type { OrderStatus, Prisma } from "@/generated/prisma/client";

export const metadata: Metadata = { title: "Admin: Orders", robots: { index: false } };

async function AdminOrdersBody({ searchParams }: PageProps<"/admin">) {
  const actor = await requireRole(STAFF_ROLES);
  const sp = await searchParams;
  const statusFilter = typeof sp.status === "string" && sp.status ? (sp.status as OrderStatus) : undefined;
  const showFinancials = can.viewFinancials(actor.role);

  const where: Prisma.OrderWhereInput = {
    ...(statusFilter ? { status: statusFilter } : {}),
    ...(actor.role === "BOOSTER" ? { OR: [{ assignedToId: actor.id }, { assignedToId: null, status: { in: ["PAID", "PROCESSING"] } }] } : {}),
  };

  // RBAC enforced in the query: totalCents is only selected when actor is ADMIN
  const [orders, counts, revenue] = await Promise.all([
    db.order.findMany({
      where,
      orderBy: { createdAt: "desc" },
      take: 100,
      select: {
        id: true,
        trackingId: true,
        email: true,
        gameUniqueId: true,
        status: true,
        createdAt: true,
        totalCents: showFinancials,
        assignedTo: { select: { id: true, name: true, email: true } },
        items: { select: { name: true, quantity: true } },
        credential: { select: { id: true } },
      },
    }),
    db.order.groupBy({ by: ["status"], _count: true }),
    showFinancials
      ? db.order.aggregate({ _sum: { totalCents: true }, where: { status: { in: ["PAID", "PROCESSING", "COMPLETED"] } } })
      : null,
  ]);

  const countMap = Object.fromEntries(counts.map((c) => [c.status, c._count]));

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-brand">Fulfillment Center</p>
          <h1 className="font-display text-2xl font-bold text-foreground">Centralized Order Dashboard</h1>
          <p className="text-xs text-muted">
            Signed in as <strong className="text-foreground">{actor.email}</strong> ({actor.role}).{" "}
            {!showFinancials && "Financial columns are hidden for your role."}
          </p>
        </div>
        <form className="flex items-center gap-2">
          <Select name="status" defaultValue={statusFilter ?? ""} className="h-9 w-48 text-xs">
            <option value="">All statuses</option>
            {Object.entries(statusLabels).map(([k, v]) => (
              <option key={k} value={k}>
                {v}
              </option>
            ))}
          </Select>
          <Button type="submit" size="sm">
            Filter
          </Button>
        </form>
      </div>

      {/* KPI strip */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-5">
        <Card className="p-4">
          <p className="text-xs text-muted">Awaiting Payment</p>
          <p className="mt-1 font-display text-2xl font-bold text-accent">{countMap.PENDING_PAYMENT ?? 0}</p>
        </Card>
        <Card className="p-4">
          <p className="text-xs text-muted">Paid (Queue)</p>
          <p className="mt-1 font-display text-2xl font-bold text-foreground">{countMap.PAID ?? 0}</p>
        </Card>
        <Card className="p-4">
          <p className="text-xs text-muted">Processing</p>
          <p className="mt-1 font-display text-2xl font-bold text-foreground">{countMap.PROCESSING ?? 0}</p>
        </Card>
        <Card className="p-4">
          <p className="text-xs text-muted">Completed</p>
          <p className="mt-1 font-display text-2xl font-bold text-brand">{countMap.COMPLETED ?? 0}</p>
        </Card>
        {showFinancials && revenue && (
          <Card className="p-4">
            <p className="text-xs text-muted">Paid Revenue (USD)</p>
            <p className="mt-1 font-display text-2xl font-bold text-foreground">{formatMoney(revenue._sum.totalCents ?? 0)}</p>
          </Card>
        )}
      </div>

      {/* Orders table */}
      <Card className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="border-b border-border bg-surface-2 text-muted">
            <tr>
              <th className="px-4 py-3">Order ID</th>
              <th className="px-4 py-3">Customer / Unique ID</th>
              <th className="px-4 py-3">Items</th>
              <th className="px-4 py-3">Assigned</th>
              <th className="px-4 py-3">Status</th>
              {showFinancials && <th className="px-4 py-3">Total</th>}
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {orders.map((o) => (
              <tr key={o.id} className="hover:bg-surface-2/60">
                <td className="px-4 py-3 font-mono font-bold text-foreground">
                  {o.trackingId}
                  {o.credential && <span className="ml-1.5 rounded bg-accent-soft px-1.5 py-0.5 text-[10px] font-sans text-accent">Vault</span>}
                </td>
                <td className="px-4 py-3">
                  <p className="text-foreground">{o.email}</p>
                  {o.gameUniqueId && <p className="font-mono text-muted">ID: {o.gameUniqueId}</p>}
                </td>
                <td className="px-4 py-3 text-muted">{o.items.map((i) => `${i.name} ×${i.quantity}`).join(", ")}</td>
                <td className="px-4 py-3 text-muted">{o.assignedTo?.name ?? o.assignedTo?.email ?? "Unassigned"}</td>
                <td className="px-4 py-3">
                  <Badge
                    tone={
                      o.status === "COMPLETED"
                        ? "green"
                        : o.status === "REFUNDED" || o.status === "CANCELLED"
                          ? "red"
                          : o.status === "PROCESSING"
                            ? "violet"
                            : "gold"
                    }
                  >
                    {statusLabels[o.status]}
                  </Badge>
                </td>
                {showFinancials && <td className="px-4 py-3 font-semibold text-foreground">{formatMoney(o.totalCents ?? 0)}</td>}
                <td className="px-4 py-3 text-muted">{formatDate(o.createdAt)}</td>
                <td className="px-4 py-3 text-right">
                  <Link href={`/admin/orders/${o.id}`} className={buttonClass("secondary", "sm")}>
                    Manage
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}

export default function AdminOrdersPage(props: PageProps<"/admin">) {
  return (
    <Suspense fallback={<PageFallback />}>
      <AdminOrdersBody {...props} />
    </Suspense>
  );
}
