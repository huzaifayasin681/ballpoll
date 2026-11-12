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
        <Container className="flex h-16 items-center justify-between gap-4">
          <div className="flex items-center gap-6">
            <Logo />
            <nav className="flex items-center gap-1">
              {nav.map(({ href, label, Icon }) => (
                <Link
                  key={href}
                  href={href}
                  className="inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-medium text-muted hover:bg-surface-2 hover:text-foreground"
                >
                  <Icon className="h-4 w-4 text-brand" /> {label}
                </Link>
              ))}
            </nav>
          </div>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Badge tone="gold">
              <Shield className="h-3 w-3" /> {actor.role}
            </Badge>
            <Link href="/" className="inline-flex items-center gap-1 text-xs text-muted hover:text-foreground">
              <ArrowLeft className="h-3.5 w-3.5" /> Storefront
            </Link>
          </div>
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
