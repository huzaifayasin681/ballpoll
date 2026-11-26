"use client";

import { useEffect, useState } from "react";
import { RomanOrderStepper } from "@/components/clubhouse/roman-timeline";
import type { OrderStatus } from "@/generated/prisma/enums";

type Event = { id: string; status: OrderStatus; message: string; createdAt: string | Date };

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

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between text-xs">
        <span className="inline-flex items-center gap-2 text-muted">
          <span className="h-2 w-2 rounded-full bg-success" />
          Live updates active · <strong className="font-semibold text-ink">{label}</strong>
        </span>
      </div>
      <RomanOrderStepper status={status} events={events} />
    </div>
  );
}
