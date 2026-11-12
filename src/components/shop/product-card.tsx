import Link from "next/link";
import { ArrowUpRight, Clock, ShieldCheck } from "lucide-react";
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
      <Card className="flex h-full flex-col overflow-hidden transition-all duration-200 hover:-translate-y-0.5 hover:border-brand/50 hover:shadow-md">
        <div className="relative h-40 overflow-hidden">
          <ProductArt image={product.image} className="h-full w-full" />

          {/* Floating top-left sale / highlight badges */}
          <div className="pointer-events-none absolute left-2.5 top-2.5 flex flex-wrap gap-1.5">
            {sale && (
              <span className="rounded-md bg-[#dc2626] px-2 py-0.5 font-mono text-[10px] font-bold uppercase tracking-wider text-white shadow-xs">
                -{sale.percentOff}% OFF
              </span>
            )}
            {product.badge && (
              <span className="rounded-md border border-[#f3c474]/40 bg-black/75 px-2 py-0.5 font-mono text-[10px] font-bold uppercase tracking-wider text-[#f3c474] backdrop-blur-xs">
                {product.badge}
              </span>
            )}
          </div>

          {/* Floating top-right delivery speed pill */}
          <span className="pointer-events-none absolute right-2.5 top-2.5 inline-flex items-center gap-1 rounded-md border border-white/15 bg-black/70 px-2 py-0.5 font-mono text-[10px] font-medium text-white backdrop-blur-xs">
            <Clock className="h-2.5 w-2.5 text-[#68d8ae]" />
            {formatDeliveryHours(product.deliveryHours)}
          </span>

          {allOut && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/75 text-xs font-bold uppercase tracking-widest text-danger backdrop-blur-xs">
              Sold Out
            </div>
          )}
        </div>

        <div className="flex flex-1 flex-col p-4">
          <div className="flex items-center justify-between gap-2 text-[11px] text-muted">
            <Badge tone="green" className="text-[10px]">
              {product.category.name}
            </Badge>
            {count > 0 ? (
              <span className="inline-flex items-center gap-1 text-[11px] font-medium text-muted">
                <Stars rating={avg} />
                <span>({count})</span>
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 text-[10px] text-muted">
                <ShieldCheck className="h-3 w-3 text-brand" /> Verified
              </span>
            )}
          </div>

          <h3 className="mt-2.5 text-base font-bold leading-snug text-foreground transition-colors group-hover:text-brand">
            {product.name}
          </h3>
          <p className="mt-1 line-clamp-2 flex-1 text-xs leading-relaxed text-muted">{product.shortDesc}</p>

          {previewVariants.length > 0 && (
            <div className="mt-3.5 flex flex-wrap gap-1.5">
              {previewVariants.map((v) => (
                <span
                  key={v.id}
                  className="rounded-md border border-border bg-surface-2/80 px-2 py-0.5 font-mono text-[10px] font-medium text-muted"
                >
                  {v.label}
                </span>
              ))}
              {extraCount > 0 && (
                <span className="rounded-md border border-brand-border bg-brand-soft px-2 py-0.5 font-mono text-[10px] font-semibold text-brand">
                  +{extraCount} more
                </span>
              )}
            </div>
          )}

          <div className="mt-4 flex items-center justify-between border-t border-border pt-3.5">
            <div>
              {product.variants.length > 1 && (
                <span className="block text-[10px] font-medium uppercase tracking-wider text-muted">Starting at</span>
              )}
              <Price cents={min} compare={compare} className="text-base font-extrabold text-foreground" />
            </div>
            <span className="inline-flex items-center gap-1 rounded-lg border border-border bg-surface-2 px-3 py-1.5 text-xs font-bold text-foreground transition-all duration-150 group-hover:border-brand group-hover:bg-brand-btn group-hover:text-white">
              View Options <ArrowUpRight className="h-3.5 w-3.5" />
            </span>
          </div>
        </div>
      </Card>
    </Link>
  );
}
