import Link from "next/link";
import { Suspense } from "react";
import type { Metadata } from "next";
import { KeyRound, MessageSquare, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge, Card, Container, Input, Label, PageFallback } from "@/components/ui/primitives";
import { ClubhousePageHero } from "@/components/clubhouse/page-hero";
import { OrderTimeline } from "@/components/shop/order-timeline";
import { DownloadReceiptButton } from "@/components/shop/receipt-button";
import { Price } from "@/components/price";
import { lookupOrder, statusLabels } from "@/lib/orders";
import { decrypt } from "@/lib/crypto";
import { formatDate } from "@/lib/utils";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Track Your Order",
  description: "Live order status checker. Enter your Order ID and your email or 8 Ball Pool Unique ID.",
};

async function TrackBody({ searchParams }: PageProps<"/track">) {
  const sp = await searchParams;
  const id = typeof sp.id === "string" ? sp.id : "";
  const v = typeof sp.v === "string" ? sp.v : "";
  const placed = sp.placed === "1";

  const order = id && v ? await lookupOrder(id, v) : null;
  const itemsSummary = order ? order.items.map((it) => `${it.name}${it.quantity > 1 ? ` × ${it.quantity}` : ""}`).join(", ") : "";

  return (
    <div className="bg-cream">
      <ClubhousePageHero
        crumbs={[{ label: "Home", href: "/" }, { label: "Track" }]}
        eyebrow="Order status"
        title="Track your order"
        subtitle="Enter your order number and the email or Unique ID you used."
      />

      <Container className="max-w-3xl space-y-6 py-10 sm:py-12">
        <Card className="p-5 sm:p-6">
          <form className="grid gap-4 sm:grid-cols-12">
            <div className="sm:col-span-5">
              <Label htmlFor="id">Order number</Label>
              <Input
                id="id"
                name="id"
                required
                defaultValue={id}
                placeholder="GPS-48213"
                className="font-mono uppercase"
              />
            </div>
            <div className="sm:col-span-5">
              <Label htmlFor="v">Email or Unique ID</Label>
              <Input
                id="v"
                name="v"
                required
                defaultValue={v}
                placeholder="347-829-1056 or you@example.com"
              />
            </div>
            <div className="flex items-end sm:col-span-2">
              <Button type="submit" variant="primary" size="md" className="w-full">
                <Search className="h-3.5 w-3.5" /> Track
              </Button>
            </div>
          </form>
        </Card>

        {id && v && !order && (
          <Card className="border-danger-border bg-danger-soft/70 p-5 text-sm text-danger">
            No matching order found. Check that both the order number and the email or Unique ID match what you entered at checkout.
          </Card>
        )}

        {order && (
          <Card className="space-y-6 p-5 sm:p-7">
            {placed && (
              <div className="rounded-[4px] border border-brand-border bg-brand-soft p-4 text-xs leading-relaxed text-felt">
                <strong>Order received.</strong> Save your order number{" "}
                <code className="font-mono font-semibold">{order.trackingId}</code>.{" "}
                {order.status === "PENDING_PAYMENT" && (
                  <span>
                    Our team will confirm your payment shortly. You can also message us on WhatsApp at {site.whatsapp}.
                  </span>
                )}
              </div>
            )}

            <div className="flex flex-wrap items-start justify-between gap-3 border-b border-border pb-4">
              <div>
                <p className="text-[11px] font-medium text-muted">Order</p>
                <p className="mt-0.5 font-display text-2xl font-semibold text-ink">
                  {order.trackingId} · {itemsSummary}
                </p>
              </div>
              <Badge
                tone={
                  order.status === "COMPLETED"
                    ? "green"
                    : order.status === "REFUNDED" || order.status === "CANCELLED"
                      ? "red"
                      : "felt"
                }
              >
                {statusLabels[order.status]}
              </Badge>
            </div>

            <OrderTimeline
              trackingId={order.trackingId}
              verifier={v}
              initialStatus={order.status}
              initialLabel={statusLabels[order.status]}
              initialEvents={order.events}
            />

            <div className="grid gap-4 border-t border-border pt-5 text-xs sm:grid-cols-3">
              <div>
                <p className="text-muted">Placed</p>
                <p className="mt-0.5 font-semibold text-ink">{formatDate(order.createdAt)}</p>
              </div>
              <div>
                <p className="text-muted">Unique ID</p>
                <p className="mt-0.5 font-mono font-semibold text-ink">{order.gameUniqueId ?? "Email delivery"}</p>
              </div>
              <div>
                <p className="text-muted">Total paid</p>
                <p className="mt-0.5 font-semibold text-ink">
                  <Price cents={order.totalCents} />
                </p>
              </div>
            </div>

            {order.items.some((it) => it.licenseKey) && (
              <div className="space-y-2 border-t border-border pt-4">
                <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-muted">Delivered keys</p>
                {order.items.map(
                  (it) =>
                    it.licenseKey && (
                      <div key={it.id} className="flex flex-wrap items-center justify-between gap-2 rounded-[4px] border border-border bg-cream/70 p-3 text-xs">
                        <span className="font-medium text-ink">{it.name}</span>
                        <Badge tone="green" className="font-mono break-all">
                          <KeyRound className="h-3 w-3 shrink-0" /> {decrypt(it.licenseKey.keyEnc)}
                        </Badge>
                      </div>
                    ),
                )}
              </div>
            )}

            <div className="flex flex-wrap items-center gap-3 border-t border-border pt-5">
              <Link
                href="/help#contact"
                className="btn-club-primary inline-flex h-10 items-center justify-center gap-2 rounded-[2px] px-5 text-[10px] font-semibold uppercase tracking-[0.2em]"
              >
                <MessageSquare className="h-3.5 w-3.5" /> Message support
              </Link>
              <DownloadReceiptButton
                trackingId={order.trackingId}
                itemsSummary={itemsSummary}
                uniqueId={order.gameUniqueId ?? ""}
                totalText={`$${(order.totalCents / 100).toFixed(2)}`}
                placedAt={formatDate(order.createdAt)}
              />
            </div>
          </Card>
        )}
      </Container>
    </div>
  );
}

export default function TrackPage(props: PageProps<"/track">) {
  return (
    <Suspense fallback={<PageFallback />}>
      <TrackBody {...props} />
    </Suspense>
  );
}
