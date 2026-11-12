"use client";

import { useTransition } from "react";
import { currencies, type CurrencyCode } from "@/lib/currency";
import { setCurrencyAction } from "@/app/actions/preferences";

export function CurrencySwitcher({ current }: { current: CurrencyCode }) {
  const [pending, start] = useTransition();
  return (
    <label className="relative">
      <span className="sr-only">Currency</span>
      <select
        value={current}
        disabled={pending}
        onChange={(e) => start(() => setCurrencyAction(e.target.value))}
        className="h-8 cursor-pointer appearance-none rounded-md border border-border bg-surface pl-2.5 pr-6 text-xs font-medium text-foreground outline-none hover:bg-surface-2 disabled:opacity-60"
      >
        {Object.keys(currencies).map((c) => (
          <option key={c} value={c}>
            {c}
          </option>
        ))}
      </select>
      <span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-[9px] text-muted">▼</span>
    </label>
  );
}
