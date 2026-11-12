import Link from "next/link";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Clock, Globe, KeyRound, Lock, ShieldCheck } from "lucide-react";
import { Badge, Card, Container, PageFallback, Stars } from "@/components/ui/primitives";
import { ProductArt } from "@/components/product-art";
import { VariantPicker } from "@/components/shop/variant-picker";
import { ReviewForm } from "@/components/shop/review-form";
import { JsonLd } from "@/components/json-ld";
import { applySale, getActiveSales, getProduct, ratingSummary, saleFor } from "@/lib/catalog";
import { getMoneyContext } from "@/lib/money";
import { getCurrentUser } from "@/lib/auth";
import { formatDate, formatDeliveryHours } from "@/lib/utils";
import { site } from "@/lib/site";

export async function generateMetadata({ params }: PageProps<"/product/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const p = await getProduct(slug);
  if (!p) return { title: "Product" };
  return {
    title: p.metaTitle || p.name,
    description: p.metaDesc || p.shortDesc,
    alternates: { canonical: `/product/${p.slug}` },
  };
}

const inputExplain = {
  UNIQUE_ID: "Only your 10-digit Miniclip Unique ID is required at checkout. Zero password needed.",
  CREDENTIALS:
    "This service requires temporary login access. Your credentials are AES-256 encrypted, visible only to your assigned booster, and deleted automatically 72h after completion.",
  NONE: "No game details needed at checkout. Delivered by email and on your live order tracker.",
} as const;

async function ProductBody({ params }: PageProps<"/product/[slug]">) {
  const { slug } = await params;
  const p = await getProduct(slug);
  if (!p || !p.isActive) notFound();

  const [sales, { currency, rates }, user] = await Promise.all([getActiveSales(), getMoneyContext(), getCurrentUser()]);
  const sale = saleFor(sales, p.slug);
  const { avg, count } = ratingSummary(p.reviews);

  const variants = p.variants.map((v) => ({
    id: v.id,
    label: v.label,
    priceCents: v.priceCents,
    salePriceCents: applySale(v.priceCents, sale),
    compareCents: sale ? v.priceCents : v.compareCents,
    stock: v.stock,
  }));

  const schema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: p.name,
    description: p.description,
    category: p.category.name,
    brand: { "@type": "Brand", name: site.name },
    ...(count > 0 ? { aggregateRating: { "@type": "AggregateRating", ratingValue: avg.toFixed(1), reviewCount: count } } : {}),
    offers: variants.map((v) => ({
      "@type": "Offer",
      name: v.label,
      priceCurrency: "USD",
      price: (v.salePriceCents / 100).toFixed(2),
      availability: v.stock === 0 ? "https://schema.org/OutOfStock" : "https://schema.org/InStock",
      url: `${site.url}/product/${p.slug}`,
    })),
  };

  return (
    <Container className="space-y-12 py-8 sm:py-10">
      <JsonLd data={schema} />

      <nav className="flex flex-wrap items-center gap-1.5 text-xs text-muted">
        <Link href="/store" className="hover:text-foreground">
          Store
        </Link>
        <span>/</span>
        <Link href={`/store/${p.category.slug}`} className="hover:text-foreground">
          {p.category.name}
        </Link>
        <span>/</span>
        <span className="truncate font-medium text-foreground">{p.name}</span>
      </nav>

      <div className="grid gap-6 sm:gap-8 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <div className="group relative overflow-hidden rounded-2xl border border-border shadow-sm">
            <ProductArt image={p.image} size="lg" className="h-60 sm:h-76 w-full border-b-0" />
            <div className="pointer-events-none absolute left-3 top-3 flex flex-wrap gap-1.5">
              {sale && (
                <span className="rounded-md bg-[#dc2626] px-2.5 py-1 font-mono text-[11px] font-bold uppercase tracking-wider text-white shadow-xs">
                  -{sale.percentOff}% OFF
                </span>
              )}
              {p.badge && (
                <span className="rounded-md border border-[#f3c474]/40 bg-black/75 px-2.5 py-1 font-mono text-[11px] font-bold uppercase tracking-wider text-[#f3c474] backdrop-blur-xs">
                  {p.badge}
                </span>
              )}
            </div>
          </div>

          <div className="mt-3 grid grid-cols-3 gap-2 text-[11px] sm:text-xs">
            <Card className="flex items-center gap-2 p-3">
              <Clock className="h-4 w-4 shrink-0 text-brand" />
              <div className="min-w-0">
                <p className="text-[10px] text-muted">Est. Speed</p>
                <p className="truncate font-semibold text-foreground">{formatDeliveryHours(p.deliveryHours)}</p>
              </div>
            </Card>
            <Card className="flex items-center gap-2 p-3">
              <Globe className="h-4 w-4 shrink-0 text-brand" />
              <div className="min-w-0">
                <p className="text-[10px] text-muted">Region</p>
                <p className="truncate font-semibold text-foreground">{p.region}</p>
              </div>
            </Card>
            <Card className="flex items-center gap-2 p-3">
              <ShieldCheck className="h-4 w-4 shrink-0 text-brand" />
              <div className="min-w-0">
                <p className="text-[10px] text-muted">Protection</p>
                <p className="truncate font-semibold text-foreground">Ban-Safe</p>
              </div>
            </Card>
          </div>
        </div>

        <div className="space-y-6 lg:col-span-7">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              {sale && <Badge tone="red">-{sale.percentOff}% {sale.title}</Badge>}
              {p.badge && <Badge tone="gold">{p.badge}</Badge>}
              <Badge tone="green">{p.category.name}</Badge>
            </div>
            <h1 className="mt-3 font-display text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">
              {p.name}
            </h1>
            {count > 0 && (
              <p className="mt-1.5 flex items-center gap-1.5 text-sm text-muted">
                <Stars rating={avg} />
                <span className="font-semibold text-foreground">{avg.toFixed(1)}</span>
                <span>({count} verified reviews)</span>
              </p>
            )}
            <p className="mt-3 text-sm leading-relaxed text-muted">{p.description}</p>
          </div>

          <Card className="p-4 sm:p-5">
            <VariantPicker
              product={{ slug: p.slug, name: p.name, image: p.image }}
              variants={variants}
              currency={currency}
              rates={rates}
            />
          </Card>

          <Card className="flex items-start gap-3 border-brand-border bg-brand-soft/60 p-4 text-xs text-foreground">
            {p.requiredInput === "CREDENTIALS" ? (
              <Lock className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
            ) : (
              <KeyRound className="mt-0.5 h-4 w-4 shrink-0 text-brand" />
            )}
            <p className="leading-relaxed">{inputExplain[p.requiredInput]}</p>
          </Card>

          {p.account && (
            <Card className="p-5">
              <h2 className="font-display text-base font-bold text-foreground">Account Specifications</h2>
              <dl className="mt-3 grid grid-cols-2 gap-3 text-sm sm:grid-cols-4">
                <div className="rounded-lg border border-border bg-background/60 p-2.5">
                  <dt className="text-[11px] text-muted">Account Level</dt>
                  <dd className="mt-0.5 font-mono font-bold text-foreground">Lvl {p.account.level}</dd>
                </div>
                <div className="rounded-lg border border-border bg-background/60 p-2.5">
                  <dt className="text-[11px] text-muted">Win Rate</dt>
                  <dd className="mt-0.5 font-mono font-bold text-foreground">{p.account.winRate}%</dd>
                </div>
                <div className="rounded-lg border border-border bg-background/60 p-2.5">
                  <dt className="text-[11px] text-muted">Coin Balance</dt>
                  <dd className="mt-0.5 font-mono font-bold text-brand">{p.account.coins}</dd>
                </div>
                <div className="rounded-lg border border-border bg-background/60 p-2.5">
                  <dt className="text-[11px] text-muted">Pool Cash</dt>
                  <dd className="mt-0.5 font-mono font-bold text-accent">{p.account.cash.toLocaleString()}</dd>
                </div>
              </dl>
              <p className="mt-3 text-xs text-muted">
                <strong className="text-foreground">Unlocked Cues:</strong> {p.account.cues.join(", ")}
              </p>
              <p className="mt-1 text-xs text-muted">
                <strong className="text-foreground">Championship Rings:</strong> {p.account.rings.join(", ")}
              </p>
            </Card>
          )}
        </div>
      </div>

      {/* Reviews */}
      <section className="grid gap-8 lg:grid-cols-12">
        <div className="space-y-3 lg:col-span-7">
          <h2 className="font-display text-xl font-bold text-foreground">Customer Reviews ({count})</h2>
          {p.reviews.map((r) => (
            <Card key={r.id} className="p-4">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-foreground">
                  {r.author} <span className="text-muted">({r.country})</span>
                </span>
                <div className="flex items-center gap-2">
                  {r.verified ? <Badge tone="green">Verified Buyer</Badge> : <Badge tone="gray">Sample</Badge>}
                  <span className="text-muted">{formatDate(r.createdAt)}</span>
                </div>
              </div>
              <Stars rating={r.rating} className="mt-1 block text-xs" />
              <p className="mt-2 text-sm text-foreground">{r.body}</p>
            </Card>
          ))}
        </div>
        <Card className="h-fit p-5 lg:col-span-5">
          <h3 className="mb-3 font-display text-base font-bold text-foreground">Write a review</h3>
          <ReviewForm productId={p.id} slug={p.slug} defaultName={user?.name} />
        </Card>
      </section>
    </Container>
  );
}

export default function ProductPage(props: PageProps<"/product/[slug]">) {
  return (
    <Suspense fallback={<PageFallback />}>
      <ProductBody {...props} />
    </Suspense>
  );
}
