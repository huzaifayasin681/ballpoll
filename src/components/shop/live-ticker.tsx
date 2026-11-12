"use client";

import { useEffect, useState } from "react";
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
    <div className="flex items-center gap-3 overflow-x-auto rounded-lg border border-border bg-surface px-3.5 py-2 text-xs text-muted no-scrollbar">
      <span className="inline-flex shrink-0 items-center gap-1.5 rounded border border-brand-border bg-brand-soft px-2 py-0.5 font-mono text-[10px] font-bold uppercase tracking-wider text-brand">
        <span className="h-1.5 w-1.5 rounded-full bg-brand" />
        Live Feed
      </span>
      <div className="flex items-center gap-2.5 overflow-x-auto">
        {items.slice(0, 4).map((o) => (
          <span
            key={o.id}
            className="inline-flex shrink-0 items-center gap-1.5 rounded border border-border bg-background px-2.5 py-1 text-[11px]"
          >
            <strong className="font-semibold text-foreground">{o.who}</strong>
            {o.country && (
              <span className="rounded bg-surface-2 px-1 py-0.2 font-mono text-[9px] text-muted">{o.country}</span>
            )}
            <span className="text-muted">delivered</span>
            <span className="font-medium text-brand">{o.item}</span>
            <span suppressHydrationWarning className="font-mono text-[10px] text-muted">
              · {timeAgo(o.at)}
            </span>
          </span>
        ))}
      </div>
    </div>
  );
}
