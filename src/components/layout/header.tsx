import Link from "next/link";
import { Suspense } from "react";
import { Shield, User } from "lucide-react";
import { Container } from "@/components/ui/primitives";
import { CartButton } from "./cart-button";
import { CurrencySwitcher } from "./currency-switcher";
import { LEFT_NAV, MobileMenu, NavItemGroup, RIGHT_NAV, SearchButton } from "./nav-links";
import { getCurrency } from "@/lib/money";
import { getCurrentUser, STAFF_ROLES } from "@/lib/auth";
import { site } from "@/lib/site";

export function Logo({ inverted = false }: { inverted?: boolean }) {
  return (
    <Link href="/" className="group flex shrink-0 items-center gap-2.5" aria-label={`${site.name} home`}>
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-brass bg-felt font-display text-sm font-bold tracking-tight text-brass shadow-2xs ring-1 ring-inset ring-brass/30 transition-transform duration-200 group-hover:scale-105">
        GP
      </span>
      <span className="flex flex-col leading-none">
        <span className={`font-display text-lg font-semibold tracking-tight sm:text-xl ${inverted ? "text-paper" : "text-ink"}`}>
          GlobalPool<span className="text-brass">.</span>
        </span>
        <span className={`mt-0.5 text-[8px] font-semibold uppercase tracking-[0.28em] ${inverted ? "text-paper/65" : "text-muted"}`}>
          STORE · EST. 2026
        </span>
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
      <Link
        href="/login"
        aria-label="Sign in"
        title="Member sign in"
        className="flex h-9 w-9 items-center justify-center rounded-[2px] text-ink transition hover:bg-surface-2/70"
      >
        <User className="h-[18px] w-[18px] stroke-[1.8]" />
      </Link>
    );
  }
  const isStaff = STAFF_ROLES.includes(user.role);
  return (
    <div className="flex items-center gap-1">
      {isStaff && (
        <Link
          href="/admin"
          title="Admin panel"
          aria-label="Admin panel"
          className="hidden h-9 w-9 items-center justify-center rounded-[2px] text-felt transition hover:bg-surface-2/70 sm:flex"
        >
          <Shield className="h-[18px] w-[18px] stroke-[1.8]" />
        </Link>
      )}
      <Link
        href="/dashboard"
        aria-label="Member dashboard"
        title={user.name ?? "Account"}
        className="flex h-9 items-center gap-1.5 rounded-[2px] px-2 text-ink transition hover:bg-surface-2/70"
      >
        <User className="h-[18px] w-[18px] stroke-[1.8] text-felt" />
        <span className="hidden text-[11px] font-semibold uppercase tracking-[0.14em] xl:inline">
          {user.name?.split(" ")[0] ?? "Member"}
        </span>
      </Link>
    </div>
  );
}

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-paper/95 backdrop-blur-md">
      {/* Top Felt Deep utility bar */}
      <div className="bg-felt-deep text-[10px] font-medium uppercase tracking-[0.22em] text-paper/85">
        <Container className="flex h-8 items-center justify-center gap-3 sm:gap-5">
          <span className="truncate">Typical delivery 1 to 2 hours</span>
          <span className="hidden text-brass sm:inline" aria-hidden>◆</span>
          <Link href="/deals" className="hidden truncate transition hover:text-brass sm:inline">
            Code <strong className="font-semibold text-brass">WELCOME10</strong> · 10% off your first order
          </Link>
          <span className="hidden text-brass md:inline" aria-hidden>◆</span>
          <Link href="/help" className="hidden truncate transition hover:text-brass md:inline">
            Concierge online 24/7
          </Link>
        </Container>
      </div>

      {/* Centered-crest main navigation bar */}
      <Container className="flex h-16 items-center justify-between gap-3">
        {/* Mobile left: Hamburger | Desktop left: Nav + Logo */}
        <div className="flex items-center gap-3 lg:flex-1 lg:justify-between lg:pr-6">
          <MobileMenu />
          <Suspense fallback={<div className="hidden h-5 w-48 lg:block" />}>
            <NavItemGroup items={LEFT_NAV} />
          </Suspense>
          <div className="hidden lg:block" />
        </div>

        {/* Center Crest */}
        <Logo />

        {/* Mobile right: Cart | Desktop right: Nav + Utility Icons */}
        <div className="flex items-center justify-end gap-1 lg:flex-1 lg:justify-between lg:pl-6">
          <Suspense fallback={<div className="hidden h-5 w-60 lg:block" />}>
            <NavItemGroup items={RIGHT_NAV} />
          </Suspense>

          <div className="flex items-center gap-0.5 sm:gap-1">
            <div className="hidden sm:block">
              <SearchButton />
            </div>
            <div className="hidden xl:block">
              <Suspense fallback={<div className="h-8 w-12" />}>
                <CurrencySlot />
              </Suspense>
            </div>
            <div className="hidden sm:block">
              <Suspense fallback={<div className="h-9 w-9" />}>
                <UserSlot />
              </Suspense>
            </div>
            <CartButton />
          </div>
        </div>
      </Container>
    </header>
  );
}
