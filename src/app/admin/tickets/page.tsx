import { Suspense } from "react";
import type { Metadata } from "next";
import { Badge, Card, PageFallback, Select } from "@/components/ui/primitives";
import { Button } from "@/components/ui/button";
import { updateTicketStatusAction } from "@/app/actions/admin";
import { requireRole } from "@/lib/auth";
import { db } from "@/lib/db";
import { formatDate } from "@/lib/utils";

export const metadata: Metadata = { title: "Admin: Support Tickets", robots: { index: false } };

async function AdminTicketsBody() {
  await requireRole(["ADMIN", "SUPPORT"]);
  const tickets = await db.supportTicket.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs font-semibold uppercase tracking-widest text-brand">Support Center</p>
        <h1 className="font-display text-2xl font-bold text-foreground">Customer Tickets ({tickets.length})</h1>
      </div>

      {tickets.length === 0 ? (
        <Card className="p-8 text-sm text-muted">No tickets yet.</Card>
      ) : (
        <div className="space-y-3">
          {tickets.map((t) => (
            <Card key={t.id} className="flex flex-wrap items-start justify-between gap-4 p-5">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Badge tone={t.status === "OPEN" ? "gold" : t.status === "ANSWERED" ? "green" : "gray"}>{t.status}</Badge>
                  <h2 className="font-display font-bold text-foreground">{t.subject}</h2>
                  {t.trackingId && <span className="font-mono text-xs text-brand">{t.trackingId}</span>}
                </div>
                <p className="text-xs text-muted">
                  From {t.name} ({t.email}) · {formatDate(t.createdAt)}
                </p>
                <p className="pt-1 text-sm text-foreground whitespace-pre-line">{t.message}</p>
              </div>
              <form action={updateTicketStatusAction} className="flex items-center gap-2">
                <input type="hidden" name="id" value={t.id} />
                <Select name="status" defaultValue={t.status} className="h-9 w-36 text-xs">
                  <option value="OPEN">OPEN</option>
                  <option value="ANSWERED">ANSWERED</option>
                  <option value="CLOSED">CLOSED</option>
                </Select>
                <Button type="submit" variant="secondary" size="sm">
                  Update
                </Button>
              </form>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

export default function AdminTicketsPage() {
  return (
    <Suspense fallback={<PageFallback />}>
      <AdminTicketsBody />
    </Suspense>
  );
}
