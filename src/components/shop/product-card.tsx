import Link from "next/link";
import { Clock, ShieldCheck } from "lucide-react";
import { Badge, Card, Stars } from "@/components/ui/primitives";
import { ProductArt } from "@/components/product-art";
import { Price } from "@/components/price";
import { QuickAddPlusButton } from "@/components/shop/quick-add-button";
import { applySale, ratingSummary, type ActiveSale, type ProductCardData } from "@/lib/catalog";
import { formatDeliveryHours } from "@/lib/utils";

export function ProductCard({
  product,
  sale,
}: {
  product: ProductCardData;
  sale?: ActiveSale | null;
}) {
  const prices = product.variants.map((v) => v.priceCents);
  const minRaw = prices.length ? Math.min(...prices) : 0;
  const min = applySale(minRaw, sale ?? null);
  const firstVar = product.variants.find((v) => v.priceCents === minRaw) ?? product.variants[0];
  const compare = sale ? minRaw : firstVar?.compareCents;
  const { avg, count } = ratingSummary(product.reviews);
  const allOut = product.variants.every((v) => v.stock === 0);
  const previewVariants = product.variants.slice(0, 3);
  const extraCount = Math.max(0, product.variants.length - previewVariants.length);

  const computedPercent =
    sale?.percentOff ??
    (compare && compare > min ? Math.round(((compare - min) / compare) * 100) : 0);

  return (
    <Card className="group flex h-full flex-col overflow-hidden p-3 transition-colors duration-200 hover:border-brass">
      <div className="relative">
        <Link href={`/product/${product.slug}`} className="block">
          <div className="rounded-[4px] bg-felt-deep p-2 pb-0">
            <ProductArt
              image={product.image}
              arched
              size="md"
              className="h-44 w-full"
            />
          </div>
        </Link>

        {/* Top-left real discount & product badge */}
        <div className="pointer-events-none absolute left-2.5 top-2.5 z-10 flex flex-wrap gap-1.5">
          {computedPercent > 0 && (
            <span className="rounded-[2px] bg-brass px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.14em] text-ink shadow-xs">
              -{computedPercent}%
            </span>
          )}
          {product.badge && (
            <span className="rounded-[2px] border border-brass/50 bg-felt-deep/90 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-paper">
              {product.badge}
            </span>
          )}
        </div>

        {/* Top-right real delivery SLA badge */}
        <span className="pointer-events-none absolute right-2.5 top-2.5 z-10 inline-flex items-center gap-1 rounded-[2px] border border-paper/20 bg-felt-deep/85 px-2 py-0.5 font-mono text-[10px] font-medium text-cream backdrop-blur-xs">
          <Clock className="h-2.5 w-2.5 text-brass" />
          {formatDeliveryHours(product.deliveryHours)}
        </span>

        {allOut && (
          <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center rounded-[4px] bg-ink/75 text-xs font-semibold uppercase tracking-[0.2em] text-paper">
            Sold out
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col px-1.5 pb-1.5 pt-3.5">
        <div className="flex items-center justify-between gap-2 text-[11px] text-muted">
          <Badge tone="gray" className="text-[9px]">
            {product.category.name}
          </Badge>
          {count > 0 ? (
            <div className="flex items-center gap-1.5">
              <Stars rating={avg} />
              <span className="text-[11px] font-medium text-muted">({count})</span>
            </div>
          ) : (
            <span className="inline-flex items-center gap-1 text-[10px] font-medium text-muted">
              <ShieldCheck className="h-3 w-3 text-felt" /> Verified
            </span>
          )}
        </div>

        <Link href={`/product/${product.slug}`} className="mt-2 block">
          <h3 className="font-display text-[19px] font-semibold leading-snug text-ink transition-colors group-hover:text-felt">
            {product.name}
          </h3>
        </Link>
        <p className="mt-1 line-clamp-2 flex-1 text-xs leading-relaxed text-muted">
          {product.shortDesc}
        </p>

        {previewVariants.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {previewVariants.map((v) => (
              <span
                key={v.id}
                className="rounded-[2px] border border-border bg-cream/70 px-2 py-0.5 font-mono text-[10px] font-medium text-ink"
              >
                {v.label}
              </span>
            ))}
            {extraCount > 0 && (
              <span className="rounded-[2px] border border-brass/50 bg-accent-soft px-2 py-0.5 font-mono text-[10px] font-semibold text-brass-dark">
                +{extraCount} more
              </span>
            )}
          </div>
        )}

        <div className="mt-4 flex items-end justify-between border-t border-border pt-3">
          <div>
            {product.variants.length > 1 && (
              <span className="block text-[10px] font-semibold uppercase tracking-[0.16em] text-muted">
                From
              </span>
            )}
            <Price cents={min} compare={compare} className="text-lg font-semibold text-ink" />
          </div>

          {firstVar && (
            <QuickAddPlusButton
              variantId={firstVar.id}
              productSlug={product.slug}
              productName={product.name}
              variantLabel={firstVar.label}
              image={product.image}
              disabled={allOut}
            />
          )}
        </div>
      </div>
    </Card>
  );
}
