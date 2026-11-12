import Link from "next/link";
import { Suspense } from "react";
import { ArrowLeft, Boxes, ClipboardList, LifeBuoy, Shield, Users } from "lucide-react";
import { Badge, Container, Skeleton } from "@/components/ui/primitives";
import { can, requireRole, STAFF_ROLES } from "@/lib/auth";
import { Logo } from "@/components/layout/header";
import { ThemeToggle } from "@/components/layout/theme-toggle";

async function AdminChrome({ children }: { children: React.ReactNode }) {
  const actor = await requireRole(STAFF_ROLES);
  const nav = [
    { href: "/admin", label: "Orders", Icon: ClipboardList, show: true },
    { href: "/admin/inventory", label: "Inventory & Prices", Icon: Boxes, show: can.manageCatalog(actor.role) },
    { href: "/admin/tickets", label: "Tickets", Icon: LifeBuoy, show: can.tickets(actor.role) },
    { href: "/admin/staff", label: "Staff & Audit", Icon: Users, show: can.manageUsers(actor.role) },
  ].filter((n) => n.show);

  return (
    <div className="min-h-screen">
      <header className="border-b border-border bg-surface/90 backdrop-blur">
        <Container className="flex flex-wrap items-center justify-between gap-3 py-3 lg:h-16 lg:py-0">
          <div className="flex min-w-0 items-center gap-4 lg:gap-6">
            <Logo />
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            <ThemeToggle />
            <Badge tone="gold">
              <Shield className="h-3 w-3" /> {actor.role}
            </Badge>
            <Link href="/" className="inline-flex items-center gap-1 text-xs text-muted hover:text-foreground">
              <ArrowLeft className="h-3.5 w-3.5" /> <span className="hidden sm:inline">Storefront</span>
            </Link>
          </div>
          <nav className="-mx-4 flex w-[calc(100%+2rem)] items-center gap-1 overflow-x-auto border-t border-border px-4 pt-2.5 no-scrollbar lg:order-2 lg:mx-0 lg:w-auto lg:border-t-0 lg:px-0 lg:pt-0">
            {nav.map(({ href, label, Icon }) => (
              <Link
                key={href}
                href={href}
                className="inline-flex shrink-0 items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium text-muted hover:bg-surface-2 hover:text-foreground"
              >
                <Icon className="h-4 w-4 text-brand" /> {label}
              </Link>
            ))}
          </nav>
        </Container>
      </header>
      <Container className="py-8">{children}</Container>
    </div>
  );
}

export default function AdminLayout({ children }: LayoutProps<"/admin">) {
  return (
    <Suspense
      fallback={
        <Container className="py-10">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="mt-6 h-80 w-full" />
        </Container>
      }
    >
      <AdminChrome>{children}</AdminChrome>
    </Suspense>
  );
}
