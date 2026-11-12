"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, Search, X } from "lucide-react";
import { mainNav } from "@/lib/site";
import { buttonClass } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function NavLinks() {
  const pathname = usePathname();
  return (
    <nav className="hidden items-center gap-0.5 lg:flex">
      {mainNav.map((n) => {
        const active = n.href === "/store" ? pathname === "/store" : pathname === n.href || pathname.startsWith(n.href + "/");
        return (
          <Link
            key={n.href}
            href={n.href}
            className={cn(
              "whitespace-nowrap rounded-md px-2.5 py-1.5 text-xs xl:text-sm font-medium transition-colors",
              active ? "bg-surface-2 text-foreground" : "text-muted hover:text-foreground",
            )}
          >
            {n.label}
          </Link>
        );
      })}
    </nav>
  );
}

export function MobileMenu() {
  const [open, setOpen] = useState(false);

  return (
    <div className="lg:hidden">
      <button
        aria-label="Open menu"
        onClick={() => setOpen(true)}
        className="flex h-8 w-8 items-center justify-center rounded-md border border-border bg-surface text-foreground"
      >
        <Menu className="h-4 w-4" />
      </button>
      {open && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs" onClick={() => setOpen(false)}>
          <div
            className="absolute right-0 top-0 flex h-full w-[min(20rem,88vw)] flex-col overflow-y-auto border-l border-border bg-surface p-5 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-4 flex items-center justify-between">
              <span className="text-sm font-bold text-foreground">Menu</span>
              <button
                aria-label="Close menu"
                onClick={() => setOpen(false)}
                className="flex h-8 w-8 items-center justify-center rounded-md border border-border text-muted hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <form action="/store" className="mb-4 flex gap-1.5" onSubmit={() => setOpen(false)}>
              <input
                name="q"
                placeholder="Search products…"
                className="h-9 min-w-0 flex-1 rounded-md border border-border bg-background px-2.5 text-xs text-foreground outline-none focus:border-brand"
              />
              <button
                type="submit"
                aria-label="Search"
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-brand-btn text-white"
              >
                <Search className="h-3.5 w-3.5" />
              </button>
            </form>
            <nav className="flex flex-1 flex-col gap-0.5">
              {[
                ...mainNav,
                { href: "/rewards", label: "Rewards & Referrals" },
                { href: "/reviews", label: "Customer Reviews" },
                { href: "/blog", label: "Guides & Tips" },
                { href: "/help", label: "Support Center" },
                { href: "/track", label: "Track Order" },
                { href: "/dashboard", label: "My Account" },
              ].map((n) => (
                <Link
                  key={n.href}
                  href={n.href}
                  onClick={() => setOpen(false)}
                  className="rounded-md px-3 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-surface-2"
                >
                  {n.label}
                </Link>
              ))}
            </nav>
            <div className="mt-4 grid grid-cols-2 gap-2 border-t border-border pt-4">
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
