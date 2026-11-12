import { Suspense } from "react";
import type { Metadata } from "next";
import { KeyRound, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge, Card, Container, Input, Label, PageFallback, SectionHeading } from "@/components/ui/primitives";
import { OrderTimeline } from "@/components/shop/order-timeline";
import { Price } from "@/components/price";
import { lookupOrder, statusLabels } from "@/lib/orders";
import { decrypt } from "@/lib/crypto";
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

  return (
    <Container className="max-w-3xl space-y-8 py-10">
      <SectionHeading
        eyebrow="Live Order Tracker"
        title="Track Your Order"
        subtitle="Enter your Order ID (e.g. GPS-7F3K9Q) and the email or Miniclip Unique ID used at checkout."
      />

      <Card className="p-6">
        <form className="grid gap-4 sm:grid-cols-12">
          <div className="sm:col-span-5">
            <Label htmlFor="id">Order ID</Label>
            <Input id="id" name="id" required defaultValue={id} placeholder="GPS-XXXXXX" className="font-mono uppercase" />
          </div>
          <div className="sm:col-span-5">
            <Label htmlFor="v">Email or Unique ID</Label>
            <Input id="v" name="v" required defaultValue={v} placeholder="you@example.com or 123-456-789-0" />
          </div>
          <div className="flex items-end sm:col-span-2">
            <Button type="submit" className="h-11 w-full">
              <Search className="h-4 w-4" /> Track
            </Button>
          </div>
        </form>
      </Card>

      {id && v && !order && (
        <Card className="p-6 text-sm text-danger">
          No matching order found. Check that both the Order ID and the email / Unique ID match what you entered at checkout.
        </Card>
      )}

      {order && (
        <Card className="space-y-6 p-6">
          {placed && (
            <div className="rounded-xl border border-brand-border bg-brand-soft p-4 text-sm text-brand">
              <strong>Order received!</strong> Save your tracking ID <code className="font-mono">{order.trackingId}</code>.{" "}
              {order.status === "PENDING_PAYMENT" && (
                <span>
                  Our team will reach out at <strong>{order.email}</strong> (or message us on WhatsApp: {site.whatsapp}) to confirm payment.
                </span>
              )}
            </div>
          )}

          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border pb-4">
            <div>
              <p className="text-xs text-muted">Order ID</p>
              <p className="font-mono text-xl font-bold text-foreground">{order.trackingId}</p>
            </div>
            {order.gameUniqueId && (
              <div>
                <p className="text-xs text-muted">Unique ID</p>
                <p className="font-mono text-sm text-foreground">{order.gameUniqueId}</p>
              </div>
            )}
            <div className="text-right">
              <p className="text-xs text-muted">Total</p>
              <Price cents={order.totalCents} className="text-lg" />
            </div>
          </div>

          <OrderTimeline
            trackingId={order.trackingId}
            verifier={v}
            initialStatus={order.status}
            initialLabel={statusLabels[order.status]}
            initialEvents={order.events}
          />

          <div className="border-t border-border pt-4">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted">Items</p>
            <ul className="space-y-2 text-sm">
              {order.items.map((it) => (
                <li key={it.id} className="flex flex-wrap items-center justify-between gap-2 rounded-xl bg-surface-2 p-3">
                  <span>
                    {it.name} × {it.quantity}
                  </span>
                  {it.licenseKey && (
                    <Badge tone="green" className="font-mono break-all">
                      <KeyRound className="h-3 w-3 shrink-0" /> Key: {decrypt(it.licenseKey.keyEnc)}
                    </Badge>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </Card>
      )}
    </Container>
  );
}

export default function TrackPage(props: PageProps<"/track">) {
  return (
    <Suspense fallback={<PageFallback />}>
      <TrackBody {...props} />
    </Suspense>
  );
}
