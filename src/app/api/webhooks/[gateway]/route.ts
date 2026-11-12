import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getGateway } from "@/lib/payments";
import { updateOrderStatus } from "@/lib/orders";

/**
 * Idempotent payment webhook endpoint.
 * When a gateway adapter in `src/lib/payments/index.ts` implements `verifyWebhook`,
 * events are verified here, logged once by `externalId` and the order is moved to PAID.
 */
export async function POST(req: NextRequest, { params }: RouteContext<"/api/webhooks/[gateway]">) {
  const { gateway: id } = await params;
  const g = getGateway(id);
  if (!g?.verifyWebhook) {
    return NextResponse.json({ error: "Gateway webhook not configured" }, { status: 400 });
  }
  try {
    const ev = await g.verifyWebhook(req);
    const existing = await db.payment.findUnique({ where: { externalId: ev.externalId } });
    if (existing) return NextResponse.json({ ok: true, deduped: true });

    const order = await db.order.findUnique({ where: { trackingId: ev.orderTrackingId } });
    if (!order) return NextResponse.json({ error: "Order not found" }, { status: 404 });

    await db.payment.create({
      data: {
        orderId: order.id,
        gateway: id,
        externalId: ev.externalId,
        amountCents: ev.amountCents,
        currency: ev.currency,
        status: ev.status,
        raw: ev.raw as object,
      },
    });
    if (ev.status === "paid" && order.status === "PENDING_PAYMENT") {
      await updateOrderStatus(order.id, "PAID", { message: `Payment confirmed via ${g.label}` });
    }
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : "Invalid webhook" }, { status: 400 });
  }
}
