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

  const d = left === null ? 2 : Math.floor(left / 86400);
  const h = left === null ? 5 : Math.floor((left % 86400) / 3600);
  const m = left === null ? 42 : Math.floor((left % 3600) / 60);
  const s = left === null ? 18 : left % 60;
  const pad = (n: number) => String(n).padStart(2, "0");

  const units = [
    { val: pad(d), label: "DAYS" },
    { val: pad(h), label: "HRS" },
    { val: pad(m), label: "MIN" },
    { val: pad(s), label: "SEC" },
  ];

  return (
    <div className="flex items-center gap-2">
      {units.map((u) => (
        <div
          key={u.label}
          className="flex w-14 flex-col items-center justify-center rounded-[4px] border border-brass/35 bg-felt-deep py-2 text-center"
        >
          <span className="font-display text-xl font-semibold leading-none text-paper">{u.val}</span>
          <span className="mt-1 text-[8px] font-semibold uppercase tracking-[0.22em] text-brass">{u.label}</span>
        </div>
      ))}
    </div>
  );
}
