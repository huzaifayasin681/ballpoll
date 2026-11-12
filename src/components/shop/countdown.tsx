"use client";

import { useEffect, useState } from "react";

export function Countdown({ endsAt }: { endsAt: string }) {
  const [left, setLeft] = useState<number | null>(null);
  useEffect(() => {
    const end = new Date(endsAt).getTime();
    const tick = () => setLeft(Math.max(0, Math.floor((end - Date.now()) / 1000)));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [endsAt]);

  if (left === null) return <span className="font-mono text-xs text-muted">--:--:--</span>;
  const h = Math.floor(left / 3600);
  const m = Math.floor((left % 3600) / 60);
  const s = left % 60;
  const pad = (n: number) => String(n).padStart(2, "0");
  return (
    <span className="inline-flex items-center gap-1 font-mono text-xs font-semibold text-foreground">
      <span className="rounded border border-border bg-surface-2 px-1.5 py-0.5">{pad(h)}h</span>:
      <span className="rounded border border-border bg-surface-2 px-1.5 py-0.5">{pad(m)}m</span>:
      <span className="rounded border border-border bg-surface-2 px-1.5 py-0.5">{pad(s)}s</span>
    </span>
  );
}
