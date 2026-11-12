"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, Circle } from "lucide-react";
import { Badge } from "@/components/ui/primitives";
import { cn } from "@/lib/utils";
import type { OrderStatus } from "@/generated/prisma/enums";

type Event = { id: string; status: OrderStatus; message: string; createdAt: string | Date };

const steps: { status: OrderStatus; label: string }[] = [
  { status: "PENDING_PAYMENT", label: "Order Placed" },
  { status: "PAID", label: "Paid & Queued" },
  { status: "PROCESSING", label: "In Progress" },
  { status: "COMPLETED", label: "Delivered" },
];

export function OrderTimeline({
  trackingId,
  verifier,
  initialStatus,
  initialLabel,
  initialEvents,
}: {
  trackingId: string;
  verifier: string;
  initialStatus: OrderStatus;
  initialLabel: string;
  initialEvents: Event[];
}) {
  const [status, setStatus] = useState(initialStatus);
  const [label, setLabel] = useState(initialLabel);
  const [events, setEvents] = useState(initialEvents);

  useEffect(() => {
    const es = new EventSource(`/api/track/stream?id=${encodeURIComponent(trackingId)}&v=${encodeURIComponent(verifier)}`);
    es.onmessage = (ev) => {
      try {
        const d = JSON.parse(ev.data) as { status: OrderStatus; statusLabel: string; events: Event[] };
        setStatus(d.status);
        setLabel(d.statusLabel);
        setEvents(d.events);
      } catch {}
    };
    return () => es.close();
  }, [trackingId, verifier]);

  const currentIdx = steps.findIndex((s) => s.status === status);
  const tone = status === "COMPLETED" ? "green" : status === "REFUNDED" || status === "CANCELLED" ? "red" : "gold";

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="inline-flex items-center gap-2 text-xs text-muted">
          <span className="h-2 w-2 rounded-full bg-brand" /> Live status updates active
        </span>
        <Badge tone={tone}>{label}</Badge>
      </div>

      {currentIdx >= 0 && (
        <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4 sm:gap-2">
          {steps.map((s, i) => {
            const done = i <= currentIdx;
            return (
              <div key={s.status} className="space-y-1.5">
                <div className={cn("h-1.5 rounded-full", done ? "bg-brand" : "bg-surface-2")} />
                <p className={cn("text-[11px] sm:text-xs font-medium", done ? "text-brand" : "text-muted")}>{s.label}</p>
              </div>
            );
          })}
        </div>
      )}

      <ol className="space-y-3 border-l border-border pl-4">
        {events.map((e, i) => {
          const latest = i === events.length - 1;
          return (
            <li key={e.id} className="relative text-sm">
              <span className="absolute -left-[22px] top-0.5 bg-surface">
                {latest ? <CheckCircle2 className="h-4 w-4 text-brand" /> : <Circle className="h-4 w-4 text-muted" />}
              </span>
              <p className={cn("font-medium", latest ? "text-foreground" : "text-muted")}>{e.message}</p>
              <p suppressHydrationWarning className="text-xs text-muted">{new Date(e.createdAt).toLocaleString()}</p>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
