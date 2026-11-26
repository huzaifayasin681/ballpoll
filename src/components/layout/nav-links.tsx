"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Menu, Search, X } from "lucide-react";
import { buttonClass } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const LEFT_NAV = [
  { href: "/store", label: "STORE" },
  { href: "/deals", label: "DEALS" },
  { href: "/rewards", label: "REWARDS" },
] as const;

export const RIGHT_NAV = [
  { href: "/reviews", label: "REVIEWS" },
  { href: "/blog", label: "GUIDES" },
  { href: "/help", label: "SUPPORT" },
  { href: "/track", label: "TRACK" },
] as const;

export function NavItemGroup({ items }: { items: readonly { href: string; label: string }[] }) {
  const pathname = usePathname();
  return (
    <nav className="hidden items-center gap-5 lg:flex xl:gap-6">
      {items.map((n) => {
        const active =
          n.href === "/store" ? pathname === "/store" || pathname.startsWith("/store/") : pathname === n.href || pathname.startsWith(n.href + "/");
        return (
          <Link
            key={n.href}
            href={n.href}
            className={cn(
              "relative whitespace-nowrap py-1 text-[11px] font-semibold tracking-[0.2em] transition-colors",
              active ? "text-felt" : "text-ink/80 hover:text-felt",
            )}
          >
            {n.label}
            {active && <span className="absolute inset-x-0 -bottom-0.5 h-[1.5px] bg-brass" aria-hidden />}
          </Link>
        );
      })}
    </nav>
  );
}

export function SearchButton() {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const router = useRouter();

  return (
    <div className="relative">
      <button
        type="button"
        aria-label="Search catalog"
        onClick={() => setOpen((v) => !v)}
        className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-[2px] text-ink transition hover:bg-surface-2/70"
      >
        {open ? <X className="h-[18px] w-[18px] stroke-[1.8]" /> : <Search className="h-[18px] w-[18px] stroke-[1.8]" />}
      </button>
      {open && (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            setOpen(false);
            router.push(q.trim() ? `/store?q=${encodeURIComponent(q.trim())}` : "/store");
          }}
          className="absolute right-0 top-11 z-50 flex w-72 items-center gap-1.5 rounded-[4px] border border-border bg-paper p-2 shadow-lg"
        >
          <input
            autoFocus
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search coins, Archangel, Venice…"
            className="h-8 flex-1 rounded-[2px] border border-border bg-cream/60 px-2.5 text-xs text-ink outline-none focus:border-felt"
          />
          <button
            type="submit"
            className="h-8 cursor-pointer rounded-[2px] bg-felt px-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-paper hover:bg-felt-deep"
          >
            Go
          </button>
        </form>
      )}
    </div>
  );
}

export function MobileMenu() {
  const [open, setOpen] = useState(false);

  return (
    <div className="lg:hidden">
      <button
        aria-label="Open menu"
        onClick={() => setOpen(true)}
        className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-[2px] text-ink transition hover:bg-surface-2/70"
      >
        <Menu className="h-5 w-5 stroke-[1.8]" />
      </button>
      {open && (
        <div className="fixed inset-0 z-50 bg-mahogany/60 backdrop-blur-xs" onClick={() => setOpen(false)}>
          <div
            className="flex h-full w-[min(20rem,86vw)] flex-col overflow-y-auto border-r border-border bg-cream p-5 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-5 flex items-center justify-between border-b border-border pb-3.5">
              <div className="flex items-center gap-2.5">
                <span className="flex h-7 w-7 items-center justify-center rounded-full border border-brass bg-felt font-display text-[11px] font-bold text-brass">
                  GP
                </span>
                <span className="font-display text-base font-semibold text-ink">GlobalPool.</span>
              </div>
              <button
                aria-label="Close menu"
                onClick={() => setOpen(false)}
                className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-[2px] border border-border text-muted hover:text-ink"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form action="/store" className="mb-5 flex gap-1.5" onSubmit={() => setOpen(false)}>
              <input
                name="q"
                placeholder="Search coins, cues, rings…"
                className="h-9 min-w-0 flex-1 rounded-[2px] border border-border bg-paper px-3 text-xs text-ink outline-none focus:border-felt"
              />
              <button
                type="submit"
                aria-label="Search"
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[2px] bg-felt text-paper"
              >
                <Search className="h-3.5 w-3.5" />
              </button>
            </form>

            <nav className="flex flex-1 flex-col gap-0.5">
              {[
                { href: "/store", label: "Store & Catalog" },
                { href: "/deals", label: "Flash Deals" },
                { href: "/rewards", label: "Rewards Club" },
                { href: "/reviews", label: "Customer Reviews" },
                { href: "/blog", label: "Guides & News" },
                { href: "/help", label: "Help & Support" },
                { href: "/track", label: "Track Order" },
                { href: "/dashboard", label: "Account Dashboard" },
              ].map((n) => (
                <Link
                  key={n.href}
                  href={n.href}
                  onClick={() => setOpen(false)}
                  className="rounded-[2px] px-3 py-2.5 text-xs font-semibold uppercase tracking-[0.16em] text-ink transition-colors hover:bg-paper"
                >
                  {n.label}
                </Link>
              ))}
            </nav>

            <div className="mt-5 grid grid-cols-2 gap-2 border-t border-border pt-4">
              <Link
                href="/login"
                onClick={() => setOpen(false)}
                className={buttonClass("secondary", "sm", "w-full")}
              >
                Sign In
              </Link>
              <Link
                href="/register"
                onClick={() => setOpen(false)}
                className={buttonClass("primary", "sm", "w-full")}
              >
                Register
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
