import Link from "next/link";
import { ArrowUpRight, Clock } from "lucide-react";
import { Badge, Card, Stars } from "@/components/ui/primitives";
import { ProductArt } from "@/components/product-art";
import { Price } from "@/components/price";
import { applySale, ratingSummary, type ActiveSale, type ProductCardData } from "@/lib/catalog";
import { formatDeliveryHours } from "@/lib/utils";

export function ProductCard({ product, sale }: { product: ProductCardData; sale?: ActiveSale | null }) {
  const prices = product.variants.map((v) => v.priceCents);
  const minRaw = prices.length ? Math.min(...prices) : 0;
  const min = applySale(minRaw, sale ?? null);
  const compare = sale ? minRaw : product.variants.find((v) => v.priceCents === minRaw)?.compareCents;
  const { avg, count } = ratingSummary(product.reviews);
  const allOut = product.variants.every((v) => v.stock === 0);
  const previewVariants = product.variants.slice(0, 3);
  const extraCount = Math.max(0, product.variants.length - previewVariants.length);

  return (
    <Link href={`/product/${product.slug}`} className="group block h-full">
      <Card className="flex h-full flex-col overflow-hidden transition-colors hover:border-border-hover">
        <div className="relative h-32">
          <ProductArt image={product.image} className="h-full w-full" />
          {allOut && (
            <div className="absolute inset-0 flex items-center justify-center bg-surface/90 text-xs font-semibold uppercase tracking-wider text-danger">
              Sold Out
            </div>
          )}
        </div>

        <div className="flex flex-1 flex-col p-4">
          <div className="flex items-center justify-between gap-2 text-[11px] text-muted">
            <div className="flex flex-wrap items-center gap-1.5">
              {sale && <Badge tone="red">-{sale.percentOff}%</Badge>}
              {product.badge && <Badge tone="gold">{product.badge}</Badge>}
              {!sale && !product.badge && <span>{product.category.name}</span>}
            </div>
            <span className="inline-flex shrink-0 items-center gap-1 font-mono text-[10px]">
              <Clock className="h-3 w-3 text-muted" /> {formatDeliveryHours(product.deliveryHours)}
            </span>
          </div>

          <h3 className="mt-2 text-sm font-bold text-foreground transition-colors group-hover:text-brand">
            {product.name}
          </h3>
          <p className="mt-1 line-clamp-2 flex-1 text-xs leading-relaxed text-muted">{product.shortDesc}</p>

          {previewVariants.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-1">
              {previewVariants.map((v) => (
                <span
                  key={v.id}
                  className="rounded border border-border bg-surface-2 px-1.5 py-0.5 font-mono text-[10px] text-muted"
                >
                  {v.label}
                </span>
              ))}
              {extraCount > 0 && (
                <span className="rounded border border-border bg-surface-2 px-1.5 py-0.5 font-mono text-[10px] text-foreground">
                  +{extraCount}
                </span>
              )}
            </div>
          )}

          <div className="mt-3.5 flex items-center justify-between border-t border-border pt-3">
            <div>
              {product.variants.length > 1 && <span className="mr-1 text-[11px] text-muted">From</span>}
              <Price cents={min} compare={compare} className="text-sm font-bold" />
              {count > 0 && (
                <span className="ml-2 inline-flex items-center gap-0.5 text-[10px] text-muted">
                  <Stars rating={avg} /> ({count})
                </span>
              )}
            </div>
            <span className="inline-flex items-center gap-1 rounded border border-border bg-surface-2 px-2.5 py-1 text-xs font-semibold text-foreground transition-colors group-hover:border-brand group-hover:bg-brand-btn group-hover:text-white">
              Select <ArrowUpRight className="h-3 w-3" />
            </span>
          </div>
        </div>
      </Card>
    </Link>
  );
}
