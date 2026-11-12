import { Suspense } from "react";
import type { Metadata } from "next";
import { Badge, Card, PageFallback, Select } from "@/components/ui/primitives";
import { Button } from "@/components/ui/button";
import { updateUserRoleAction } from "@/app/actions/admin";
import { requireRole } from "@/lib/auth";
import { db } from "@/lib/db";

export const metadata: Metadata = { title: "Admin: Staff & Audit Log", robots: { index: false } };

async function AdminStaffBody() {
  const actor = await requireRole(["ADMIN"]);
  const [users, logs] = await Promise.all([
    db.user.findMany({ orderBy: [{ role: "desc" }, { createdAt: "desc" }], take: 50 }),
    db.auditLog.findMany({ include: { actor: { select: { email: true, role: true } } }, orderBy: { createdAt: "desc" }, take: 30 }),
  ]);

  return (
    <div className="grid gap-8 lg:grid-cols-12">
      <div className="space-y-4 lg:col-span-7">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-brand">Role-Based Access Control</p>
          <h1 className="font-display text-2xl font-bold text-foreground">Staff & Supplier Management</h1>
          <p className="text-xs text-muted">
            Assign <strong>BOOSTER</strong> (fulfillment only, no financials) or <strong>SUPPORT</strong> (tickets & order status, no financials).
          </p>
        </div>

        <Card className="divide-y divide-border text-xs">
          {users.map((u) => (
            <div key={u.id} className="flex flex-wrap items-center justify-between gap-2 px-4 py-3">
              <div>
                <p className="font-semibold text-foreground">{u.name ?? u.email}</p>
                <p className="text-muted">{u.email}</p>
              </div>
              <form action={updateUserRoleAction} className="flex items-center gap-2">
                <input type="hidden" name="userId" value={u.id} />
                <Select name="role" defaultValue={u.role} disabled={u.id === actor.id} className="h-8 w-36 text-xs">
                  <option value="CUSTOMER">CUSTOMER</option>
                  <option value="BOOSTER">BOOSTER</option>
                  <option value="SUPPORT">SUPPORT</option>
                  <option value="ADMIN">ADMIN</option>
                </Select>
                <Button type="submit" variant="secondary" size="sm" disabled={u.id === actor.id}>
                  Save
                </Button>
              </form>
            </div>
          ))}
        </Card>
      </div>

      <div className="space-y-4 lg:col-span-5">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-brand">Security</p>
          <h2 className="font-display text-2xl font-bold text-foreground">Audit Log</h2>
          <p className="text-xs text-muted">Every credential reveal, role change and status change is recorded.</p>
        </div>
        <Card className="divide-y divide-border text-xs">
          {logs.map((l) => (
            <div key={l.id} className="flex items-center justify-between gap-2 px-4 py-2.5">
              <div>
                <Badge tone={l.action.includes("credential") ? "gold" : "gray"}>{l.action}</Badge>{" "}
                <span className="font-mono text-foreground">{l.target}</span>
                <p className="text-muted">by {l.actor.email}</p>
              </div>
              <span className="text-muted">{new Date(l.createdAt).toLocaleTimeString()}</span>
            </div>
          ))}
        </Card>
      </div>
    </div>
  );
}

export default function AdminStaffPage() {
  return (
    <Suspense fallback={<PageFallback />}>
      <AdminStaffBody />
    </Suspense>
  );
}
