import Link from "next/link";
import { Suspense } from "react";
import { Search, Shield, ShieldCheck, Sparkles, User } from "lucide-react";
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
    <Link href="/" className="group flex shrink-0 items-center gap-2.5" aria-label={`${site.name} home`}>
      <div className="relative h-8 w-8 shrink-0 overflow-hidden rounded-lg border border-border shadow-2xs ring-1 ring-black/5 transition-transform duration-200 group-hover:scale-105">
        <img
          src="/images/pool/logo-8ball.jpg"
          alt="8 Ball Pool"
          className="h-full w-full object-cover"
        />
      </div>
      <div className="flex flex-col leading-none">
        <span className="text-sm font-bold tracking-tight text-foreground sm:text-base">
          GlobalPool<span className="text-brand">Store</span>
        </span>
        <span className="hidden font-mono text-[9px] font-semibold uppercase tracking-widest text-muted sm:block">
          8 Ball Pool Market
        </span>
      </div>
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
          className={buttonClass("secondary", "sm", "px-2.5 sm:px-3")}
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
      <Link href="/dashboard" className={buttonClass("secondary", "sm", "px-2.5 sm:px-3")}>
        <User className="h-3.5 w-3.5" />
        <span className="hidden sm:inline">{user.name?.split(" ")[0] ?? "Account"}</span>
      </Link>
    </div>
  );
}

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-border/80 bg-surface/90 backdrop-blur-md">
      {/* Top announcement & utility bar */}
      <div className="border-b border-white/10 bg-gradient-to-r from-[#081c15] via-[#0d2e22] to-[#081c15] text-[11px] sm:text-xs text-[#d6dfd9]">
        <Container className="flex h-8 items-center justify-between gap-2">
          <div className="flex min-w-0 items-center gap-3 sm:gap-4">
            <span className="inline-flex items-center gap-1.5 truncate font-medium text-white">
              <ShieldCheck className="h-3.5 w-3.5 shrink-0 text-[#68d8ae]" />
              100% Ban-Safe Delivery
            </span>
            <span className="hidden sm:inline text-white/20">•</span>
            <Link
              href="/deals"
              className="hidden md:inline-flex items-center gap-1 truncate text-[#f3c474] hover:underline"
            >
              <Sparkles className="h-3 w-3 shrink-0" />
              Use code <strong className="font-mono font-bold">WELCOME10</strong> for 10% off
            </Link>
          </div>
          <div className="flex shrink-0 items-center gap-3 sm:gap-4">
            <Link href="/rewards" className="hidden md:inline transition-colors hover:text-white">
              Rewards
            </Link>
            <Link href="/reviews" className="hidden md:inline transition-colors hover:text-white">
              Reviews
            </Link>
            <Link href="/blog" className="hidden lg:inline transition-colors hover:text-white">
              Guides
            </Link>
            <Link href="/help" className="hidden sm:inline transition-colors hover:text-white">
              Support
            </Link>
            <Link
              href="/track"
              className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/10 px-2.5 py-0.5 text-[11px] font-semibold text-white transition hover:bg-white/15"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-[#68d8ae]" />
              Track Order
            </Link>
          </div>
        </Container>
      </div>

      {/* Main bar */}
      <Container className="flex h-15 items-center justify-between gap-2 sm:gap-3">
        <div className="flex min-w-0 items-center gap-4 xl:gap-7">
          <Logo />
          <Suspense fallback={<div className="hidden h-8 w-64 lg:block" />}>
            <NavLinks />
          </Suspense>
        </div>
        <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
          <form action="/store" className="relative hidden xl:block">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted" />
            <input
              name="q"
              placeholder="Search coins, Archangel, Venice…"
              className="h-8.5 w-48 2xl:w-60 rounded-lg border border-border bg-background/80 pl-8.5 pr-3 text-xs text-foreground placeholder:text-muted outline-none transition focus:border-brand focus:bg-surface focus:ring-2 focus:ring-brand/15"
            />
          </form>
          <Suspense fallback={<div className="h-8 w-14 rounded-lg bg-surface-2" />}>
            <CurrencySlot />
          </Suspense>
          <ThemeToggle />
          <CartButton />
          <Suspense fallback={<div className="h-8 w-8 sm:w-20 rounded-lg bg-surface-2" />}>
            <UserSlot />
          </Suspense>
          <MobileMenu />
        </div>
      </Container>
    </header>
  );
}
