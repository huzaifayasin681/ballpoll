import { Suspense } from "react";
import type { Metadata } from "next";
import { Badge, Card, Input, Label, PageFallback, Select, Textarea } from "@/components/ui/primitives";
import { Button } from "@/components/ui/button";
import { addLicenseKeysAction, toggleProductStockAction, updateVariantAction } from "@/app/actions/admin";
import { requireRole } from "@/lib/auth";
import { db } from "@/lib/db";

export const metadata: Metadata = { title: "Admin: Inventory & Prices", robots: { index: false } };

async function AdminInventoryBody() {
  await requireRole(["ADMIN"]);
  const products = await db.product.findMany({
    include: {
      category: { select: { name: true } },
      variants: {
        orderBy: { sortOrder: "asc" },
        include: { _count: { select: { licenseKeys: { where: { orderItemId: null } } } } },
      },
    },
    orderBy: [{ category: { sortOrder: "asc" } }, { name: "asc" }],
  });

  const keyVariants = products.filter((p) => p.type === "LICENSE_KEY").flatMap((p) => p.variants.map((v) => ({ id: v.id, label: `${p.name}: ${v.label}` })));

  return (
    <div className="space-y-8">
      <div>
        <p className="text-xs font-semibold uppercase tracking-widest text-brand">Inventory Manager</p>
        <h1 className="font-display text-2xl font-bold text-foreground">Stock & Dynamic Pricing</h1>
        <p className="text-xs text-muted">Toggle products in/out of stock, update variant prices (USD) and top up license key pools.</p>
      </div>

      {keyVariants.length > 0 && (
        <Card className="p-5">
          <h2 className="font-display text-base font-bold text-foreground">Add License Keys to Pool</h2>
          <form action={addLicenseKeysAction} className="mt-3 grid gap-3 sm:grid-cols-12">
            <div className="sm:col-span-4">
              <Label htmlFor="variantId" className="text-xs">
                Variant
              </Label>
              <Select id="variantId" name="variantId" className="h-9 text-xs">
                {keyVariants.map((v) => (
                  <option key={v.id} value={v.id}>
                    {v.label}
                  </option>
                ))}
              </Select>
            </div>
            <div className="sm:col-span-6">
              <Label htmlFor="keys" className="text-xs">
                One key per line (stored AES-256 encrypted)
              </Label>
              <Textarea id="keys" name="keys" rows={2} placeholder="VIP-XXXX-XXXX-XXXX" className="font-mono text-xs" />
            </div>
            <div className="flex items-end sm:col-span-2">
              <Button type="submit" size="sm" className="w-full">
                Add Keys
              </Button>
            </div>
          </form>
        </Card>
      )}

      <div className="space-y-4">
        {products.map((p) => (
          <Card key={p.id} className="p-5">
            <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <h2 className="font-display text-base font-bold text-foreground">{p.name}</h2>
                <Badge tone="gray">{p.category.name}</Badge>
                <Badge tone={p.isActive ? "green" : "red"}>{p.isActive ? "In Stock" : "Hidden"}</Badge>
              </div>
              <form action={toggleProductStockAction}>
                <input type="hidden" name="id" value={p.id} />
                <input type="hidden" name="isActive" value={String(!p.isActive)} />
                <Button type="submit" variant="secondary" size="sm">
                  {p.isActive ? "Mark Out of Stock" : "Mark In Stock"}
                </Button>
              </form>
            </div>
            <div className="divide-y divide-border text-xs">
              {p.variants.map((v) => (
                <form key={v.id} action={updateVariantAction} className="flex flex-wrap items-center justify-between gap-3 py-2.5">
                  <input type="hidden" name="id" value={v.id} />
                  <span className="min-w-44 font-medium text-foreground">
                    {v.label}
                    {p.type === "LICENSE_KEY" && <span className="ml-2 text-muted">({v._count.licenseKeys} keys unused)</span>}
                  </span>
                  <div className="flex flex-wrap items-center gap-2">
                    <label className="flex items-center gap-1 text-muted">
                      USD $
                      <Input
                        name="price"
                        type="number"
                        step="0.01"
                        defaultValue={(v.priceCents / 100).toFixed(2)}
                        className="h-8 w-24 text-xs"
                      />
                    </label>
                    <label className="flex items-center gap-1 text-muted">
                      Stock (-1 = ∞)
                      <Input name="stock" type="number" defaultValue={v.stock} className="h-8 w-20 text-xs" />
                    </label>
                    <label className="flex items-center gap-1 text-muted">
                      <input type="checkbox" name="isActive" defaultChecked={v.isActive} /> Active
                    </label>
                    <Button type="submit" variant="secondary" size="sm">
                      Save
                    </Button>
                  </div>
                </form>
              ))}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

export default function AdminInventoryPage() {
  return (
    <Suspense fallback={<PageFallback />}>
      <AdminInventoryBody />
    </Suspense>
  );
}
