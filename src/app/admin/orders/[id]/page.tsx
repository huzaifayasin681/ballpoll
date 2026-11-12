import Link from "next/link";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { Badge, Card, Input, Label, PageFallback, Select, Textarea } from "@/components/ui/primitives";
import { Button } from "@/components/ui/button";
import { CredentialBox } from "@/components/admin/credential-box";
import { adminUpdateOrderAction } from "@/app/actions/admin";
import { can, requireRole, STAFF_ROLES } from "@/lib/auth";
import { db } from "@/lib/db";
import { nextStatuses, statusLabels } from "@/lib/orders";
import { formatMoney } from "@/lib/currency";

async function AdminOrderDetailBody({ params }: PageProps<"/admin/orders/[id]">) {
  const actor = await requireRole(STAFF_ROLES);
  const { id } = await params;
  const showFinancials = can.viewFinancials(actor.role);

  const [order, boosters] = await Promise.all([
    db.order.findUnique({
      where: { id },
      include: { items: true, events: { orderBy: { createdAt: "asc" } }, credential: { select: { id: true } } },
    }),
    db.user.findMany({ where: { role: { in: ["BOOSTER", "ADMIN"] } }, select: { id: true, name: true, email: true } }),
  ]);
  if (!order) notFound();
  if (actor.role === "BOOSTER" && order.assignedToId && order.assignedToId !== actor.id) notFound();

  const allowedNext = nextStatuses(order.status).filter((s) => (s === "REFUNDED" ? can.refund(actor.role) : true));

  return (
    <div className="max-w-4xl space-y-6">
      <Link href="/admin" className="text-xs text-muted hover:text-foreground">
        ← Back to orders
      </Link>

      <Card className="space-y-5 p-6">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border pb-4">
          <div>
            <p className="text-xs text-muted">Order</p>
            <h1 className="font-mono text-2xl font-bold text-foreground">{order.trackingId}</h1>
            <p className="text-xs text-muted">
              Customer: {order.email} {order.gameUniqueId ? `· Unique ID: ${order.gameUniqueId}` : ""}
            </p>
          </div>
          <div className="text-right">
            <Badge tone="gold">{statusLabels[order.status]}</Badge>
            {showFinancials && <p className="mt-1 font-display text-lg font-bold text-foreground">{formatMoney(order.totalCents)}</p>}
          </div>
        </div>

        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted">Items to Fulfill</p>
          <ul className="space-y-1.5 text-sm">
            {order.items.map((it) => (
              <li key={it.id} className="flex justify-between rounded-xl bg-surface-2 px-3.5 py-2">
                <span>
                  {it.name} × {it.quantity}
                </span>
                {showFinancials && <span className="text-muted">{formatMoney(it.unitCents * it.quantity)}</span>}
              </li>
            ))}
          </ul>
        </div>

        {order.credential && can.viewCredentials(actor.role) && <CredentialBox orderId={order.id} />}

        <form action={adminUpdateOrderAction} className="space-y-4 border-t border-border pt-4">
          <input type="hidden" name="orderId" value={order.id} />
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="status">Update Status</Label>
              <Select id="status" name="status" defaultValue={order.status}>
                <option value={order.status}>{statusLabels[order.status]} (current)</option>
                {allowedNext.map((s) => (
                  <option key={s} value={s}>
                    → {statusLabels[s]}
                  </option>
                ))}
              </Select>
            </div>
            <div>
              <Label htmlFor="assignedToId">Assigned Booster / Supplier</Label>
              <Select id="assignedToId" name="assignedToId" defaultValue={order.assignedToId ?? ""}>
                <option value="">Unassigned</option>
                {boosters.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.name ?? b.email}
                  </option>
                ))}
              </Select>
            </div>
          </div>
          <div>
            <Label htmlFor="message">Customer status update message (optional, shown on tracker & emailed)</Label>
            <Input id="message" name="message" placeholder="e.g. Booster logged in, 40% complete" />
          </div>
          <div>
            <Label htmlFor="staffNote">Internal staff note (hidden from customer)</Label>
            <Textarea id="staffNote" name="staffNote" rows={2} defaultValue={order.staffNote ?? ""} />
          </div>
          <Button type="submit">Save & Notify Customer</Button>
        </form>
      </Card>

      <Card className="p-6">
        <h2 className="mb-3 font-display text-base font-bold text-foreground">Event History</h2>
        <ul className="space-y-2 text-xs">
          {order.events.map((e) => (
            <li key={e.id} className="flex justify-between text-muted">
              <span>
                <strong className="text-foreground">{statusLabels[e.status]}:</strong> {e.message}
              </span>
              <span>{new Date(e.createdAt).toLocaleString()}</span>
            </li>
          ))}
        </ul>
      </Card>
    </div>
  );
}

export default function AdminOrderDetailPage(props: PageProps<"/admin/orders/[id]">) {
  return (
    <Suspense fallback={<PageFallback />}>
      <AdminOrderDetailBody {...props} />
    </Suspense>
  );
}
