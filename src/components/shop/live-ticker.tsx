"use client";

import { useEffect, useState } from "react";
import { CheckCircle2 } from "lucide-react";
import { timeAgo } from "@/lib/utils";

type Item = { id: string; who: string; country: string | null; item: string; at: string };

export function LiveOrderTicker({ initial }: { initial: Item[] }) {
  const [items, setItems] = useState(initial);

  useEffect(() => {
    const id = setInterval(async () => {
      try {
        const r = await fetch("/api/ticker");
        if (r.ok) setItems(await r.json());
      } catch {}
    }, 30_000);
    return () => clearInterval(id);
  }, []);

  if (!items.length) return null;

  return (
    <div className="flex items-center gap-3 overflow-x-auto rounded-[6px] border border-border bg-paper px-3.5 py-2.5 text-xs text-muted no-scrollbar">
      <span className="inline-flex shrink-0 items-center gap-1.5 rounded-[2px] border border-brass/50 bg-accent-soft px-2.5 py-1 font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-brass-dark">
        <span className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-felt opacity-75" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-felt" />
        </span>
        Recent Fulfillments
      </span>
      <div className="flex items-center gap-2.5 overflow-x-auto">
        {items.slice(0, 5).map((o) => (
          <span
            key={o.id}
            className="inline-flex shrink-0 items-center gap-1.5 rounded-[2px] border border-border bg-cream/65 px-2.5 py-1 text-[11px]"
          >
            <CheckCircle2 className="h-3 w-3 shrink-0 text-felt" />
            <strong className="font-semibold text-ink">{o.who}</strong>
            {o.country && (
              <span className="rounded-[2px] border border-border bg-paper px-1 font-mono text-[9px] font-semibold text-muted">
                {o.country}
              </span>
            )}
            <span className="text-muted">received</span>
            <span className="font-semibold text-felt">{o.item}</span>
            <span suppressHydrationWarning className="font-mono text-[10px] text-muted">
              · {timeAgo(o.at)}
            </span>
          </span>
        ))}
      </div>
    </div>
  );
}
