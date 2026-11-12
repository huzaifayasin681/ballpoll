import Link from "next/link";
import { Suspense } from "react";
import { Search, Shield, ShieldCheck, User } from "lucide-react";
import { Container } from "@/components/ui/primitives";
import { buttonClass } from "@/components/ui/button";
import { CartButton } from "./cart-button";
import { CurrencySwitcher } from "./currency-switcher";
import { MobileMenu, NavLinks } from "./nav-links";
import { ThemeToggle } from "./theme-toggle";
import { getCurrency } from "@/lib/money";
import { getCurrentUser, STAFF_ROLES } from "@/lib/auth";
import { site } from "@/lib/site";

export function Logo() {
  return (
    <Link href="/" className="flex shrink-0 items-center gap-2 sm:gap-2.5" aria-label={`${site.name} home`}>
      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded bg-brand-btn font-mono text-xs font-bold text-white">
        8
      </span>
      <span className="text-sm font-semibold tracking-tight text-foreground sm:text-base">
        GlobalPool<span className="text-brand">Store</span>
      </span>
    </Link>
  );
}

async function CurrencySlot() {
  const currency = await getCurrency();
  return <CurrencySwitcher current={currency} />;
}

async function UserSlot() {
  const user = await getCurrentUser();
  if (!user) {
    return (
      <div className="flex items-center gap-1.5 sm:gap-2">
        <Link
          href="/login"
          aria-label="Sign in"
          className={buttonClass("secondary", "sm", "px-2 sm:px-3")}
        >
          <User className="h-3.5 w-3.5 sm:hidden" />
          <span className="hidden sm:inline">Sign in</span>
        </Link>
        <Link href="/register" className={buttonClass("primary", "sm", "hidden md:inline-flex")}>
          Register
        </Link>
      </div>
    );
  }
  const isStaff = STAFF_ROLES.includes(user.role);
  return (
    <div className="flex items-center gap-1.5 sm:gap-2">
      {isStaff && (
        <Link href="/admin" className={buttonClass("outline", "sm", "hidden sm:inline-flex")}>
          <Shield className="h-3.5 w-3.5" /> Admin
        </Link>
      )}
      <Link href="/dashboard" className={buttonClass("secondary", "sm", "px-2 sm:px-3")}>
        <User className="h-3.5 w-3.5" />
        <span className="hidden sm:inline">{user.name?.split(" ")[0] ?? "Account"}</span>
      </Link>
    </div>
  );
}

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-surface">
      {/* Top announcement & utility bar */}
      <div className="bg-[#141413] text-[11px] sm:text-xs text-[#d6d3cb]">
        <Container className="flex h-8 items-center justify-between gap-2">
          <div className="flex min-w-0 items-center gap-3 sm:gap-4">
            <span className="inline-flex items-center gap-1.5 truncate font-medium text-white">
              <ShieldCheck className="h-3.5 w-3.5 shrink-0 text-[#5ec29f]" />
              100% Delivery Guarantee
            </span>
            <span className="hidden sm:inline text-white/20">|</span>
            <span className="hidden sm:inline truncate">Average coin fulfillment: 1–2 hours</span>
          </div>
          <div className="flex shrink-0 items-center gap-3 sm:gap-4">
            <Link href="/rewards" className="hidden md:inline hover:text-white">
              Rewards & Referrals
            </Link>
            <Link href="/reviews" className="hidden md:inline hover:text-white">
              Reviews
            </Link>
            <Link href="/blog" className="hidden md:inline hover:text-white">
              Guides
            </Link>
            <Link href="/help" className="hidden sm:inline hover:text-white">
              Support
            </Link>
            <Link href="/track" className="font-medium text-white hover:underline">
              Track Order
            </Link>
          </div>
        </Container>
      </div>

      {/* Main bar */}
      <Container className="flex h-14 items-center justify-between gap-2 sm:gap-3">
        <div className="flex min-w-0 items-center gap-4 xl:gap-6">
          <Logo />
          <Suspense fallback={<div className="hidden h-8 w-64 lg:block" />}>
            <NavLinks />
          </Suspense>
        </div>
        <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
          <form action="/store" className="relative hidden xl:block">
            <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted" />
            <input
              name="q"
              placeholder="Search catalog…"
              className="h-8 w-44 2xl:w-56 rounded-md border border-border bg-background pl-8 pr-3 text-xs text-foreground placeholder:text-muted outline-none focus:border-[#0d4f3c]"
            />
          </form>
          <Suspense fallback={<div className="h-8 w-14 rounded-md bg-surface-2" />}>
            <CurrencySlot />
          </Suspense>
          <ThemeToggle />
          <CartButton />
          <Suspense fallback={<div className="h-8 w-8 sm:w-20 rounded-md bg-surface-2" />}>
            <UserSlot />
          </Suspense>
          <MobileMenu />
        </div>
      </Container>
    </header>
  );
}
