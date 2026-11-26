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
        className="h-8 cursor-pointer appearance-none rounded-[2px] border border-border bg-paper pl-2 pr-5 text-[10px] font-semibold uppercase tracking-[0.15em] text-ink outline-none transition hover:border-brass disabled:opacity-60"
      >
        {Object.keys(currencies).map((c) => (
          <option key={c} value={c}>
            {c}
          </option>
        ))}
      </select>
      <span className="pointer-events-none absolute right-1.5 top-1/2 -translate-y-1/2 text-[8px] text-muted">▼</span>
    </label>
  );
}
