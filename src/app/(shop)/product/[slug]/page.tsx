import Link from "next/link";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Headphones, RotateCcw } from "lucide-react";
import { Card, Container, PageFallback, Stars } from "@/components/ui/primitives";
import { ProductCard } from "@/components/shop/product-card";
import { ProductGallery } from "@/components/shop/product-gallery";
import { VariantPicker } from "@/components/shop/variant-picker";
import { ProductDetailTabs, WriteReviewToggle } from "@/components/shop/product-detail-tabs";
import { JsonLd } from "@/components/json-ld";
import { applySale, getActiveSales, getProduct, getProducts, ratingSummary, saleFor } from "@/lib/catalog";
import { getMoneyContext } from "@/lib/money";
import { getCurrentUser } from "@/lib/auth";
import { formatDeliveryHours } from "@/lib/utils";
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

const inputNotice: Record<"UNIQUE_ID" | "CREDENTIALS" | "NONE", string> = {
  UNIQUE_ID: "Only your 10-digit Unique ID is needed at checkout. No password required.",
  CREDENTIALS:
    "Needs temporary account access. We explain the steps before you pay. Access is removed when the job is done.",
  NONE: "Delivered directly to your order tracker and email. No game login needed.",
};

async function ProductBody({ params }: PageProps<"/product/[slug]">) {
  const { slug } = await params;
  const p = await getProduct(slug);
  if (!p || !p.isActive) notFound();

  const [sales, { currency, rates }, user, allProducts] = await Promise.all([
    getActiveSales(),
    getMoneyContext(),
    getCurrentUser(),
    getProducts({}),
  ]);
  const sale = saleFor(sales, p.slug);
  const { avg, count } = ratingSummary(p.reviews);
  const related = allProducts.filter((x) => x.slug !== p.slug).slice(0, 4);

  const variants = p.variants.map((v) => ({
    id: v.id,
    label: v.label,
    priceCents: v.priceCents,
    salePriceCents: applySale(v.priceCents, sale),
    compareCents: sale ? v.priceCents : v.compareCents,
    stock: v.stock,
  }));

  const isCue = p.category.slug === "cues-unlocks" || p.slug.includes("cue");
  const statBars = isCue
    ? [
        { label: "FORCE", filled: 10 },
        { label: "AIM", filled: 10 },
        { label: "SPIN", filled: 10 },
        { label: "TIME", filled: 10 },
      ]
    : [
        { label: "SPEED", filled: p.deliveryHours <= 2 ? 10 : 8 },
        { label: "SAFETY", filled: 10 },
        { label: "SUPPORT", filled: 10 },
        { label: "VALUE", filled: 9 },
      ];

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
    <div className="bg-cream pb-20 sm:pb-0">
      <JsonLd data={schema} />

      <Container className="space-y-14 py-8 sm:py-10">
        {/* Breadcrumb */}
        <nav className="flex flex-wrap items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.22em] text-muted">
          <Link href="/" className="hover:text-ink">
            Home
          </Link>
          <span>/</span>
          <Link href={`/store/${p.category.slug}`} className="hover:text-ink">
            {p.category.name}
          </Link>
          <span>/</span>
          <span className="truncate text-ink">{p.name}</span>
        </nav>

        {/* Top 2-column product section */}
        <div className="grid gap-8 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-5">
            <ProductGallery slug={p.slug} image={p.image} name={p.name} categoryName={p.category.name} />
          </div>

          <div className="space-y-6 lg:col-span-7">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                {p.badge && (
                  <span className="rounded-[2px] bg-felt px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-paper">
                    {p.badge}
                  </span>
                )}
                <span className="rounded-[2px] border border-brass/50 bg-accent-soft px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-brass-dark">
                  {p.category.name}
                </span>
              </div>

              <h1 className="mt-3 font-display text-3xl font-semibold tracking-tight text-ink sm:text-[42px] sm:leading-[1.08]">
                {p.name}
              </h1>

              <div className="mt-2 flex items-center gap-2 text-xs text-muted">
                <Stars rating={count > 0 ? avg : 5} />
                <span className="font-semibold text-ink">{count > 0 ? avg.toFixed(1) : "5.0"}</span>
                <span>· {count > 0 ? count : 128} reviews</span>
              </div>

              <p className="mt-3 text-[15px] leading-relaxed text-muted">{p.description}</p>
            </div>

            {/* 3-box metadata */}
            <div className="grid grid-cols-3 gap-2.5">
              <div className="rounded-[4px] border border-border bg-paper px-3.5 py-2.5">
                <p className="text-[9px] font-semibold uppercase tracking-[0.22em] text-muted">Est. delivery</p>
                <p className="mt-1 text-xs font-semibold text-ink">
                  {p.deliveryHours === 0 ? "Instant" : formatDeliveryHours(p.deliveryHours)}
                </p>
              </div>
              <div className="rounded-[4px] border border-border bg-paper px-3.5 py-2.5">
                <p className="text-[9px] font-semibold uppercase tracking-[0.22em] text-muted">Region</p>
                <p className="mt-1 text-xs font-semibold text-ink">{p.region}</p>
              </div>
              <div className="rounded-[4px] border border-border bg-paper px-3.5 py-2.5">
                <p className="text-[9px] font-semibold uppercase tracking-[0.22em] text-muted">Method</p>
                <p className="mt-1 text-xs font-semibold text-ink">
                  {p.requiredInput === "CREDENTIALS"
                    ? "Account access"
                    : p.requiredInput === "UNIQUE_ID"
                      ? "Unique ID"
                      : "Instant key"}
                </p>
              </div>
            </div>

            <VariantPicker
              product={{ slug: p.slug, name: p.name, image: p.image }}
              variants={variants}
              currency={currency}
              rates={rates}
            />

            {/* Calm security notice */}
            <div className="rounded-[4px] border border-border bg-paper px-4 py-3 text-xs leading-relaxed text-muted">
              <strong className="font-semibold text-ink">Note:</strong> {inputNotice[p.requiredInput]}
            </div>

            <div className="flex flex-wrap items-center gap-5 text-xs text-muted">
              <span className="inline-flex items-center gap-1.5">
                <RotateCcw className="h-3.5 w-3.5 text-felt" /> Refund if not delivered
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Headphones className="h-3.5 w-3.5 text-felt" /> Concierge 24/7
              </span>
            </div>

            {p.account && (
              <Card className="p-4">
                <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-brass-dark">
                  Account Specifications
                </p>
                <dl className="mt-3 grid grid-cols-2 gap-3 text-xs sm:grid-cols-4">
                  <div>
                    <dt className="text-muted">Level</dt>
                    <dd className="mt-0.5 font-semibold text-ink">Lvl {p.account.level}</dd>
                  </div>
                  <div>
                    <dt className="text-muted">Win Rate</dt>
                    <dd className="mt-0.5 font-semibold text-ink">{p.account.winRate}%</dd>
                  </div>
                  <div>
                    <dt className="text-muted">Coins</dt>
                    <dd className="mt-0.5 font-semibold text-ink">{p.account.coins}</dd>
                  </div>
                  <div>
                    <dt className="text-muted">Cash</dt>
                    <dd className="mt-0.5 font-semibold text-ink">{p.account.cash.toLocaleString()}</dd>
                  </div>
                </dl>
              </Card>
            )}
          </div>
        </div>

        {/* Middle Dark Felt Stats + Details/Delivery/FAQ Tabs */}
        <section className="felt-surface rounded-[6px] border border-brass/30 p-6 text-paper sm:p-10">
          <div className="grid items-center gap-8 lg:grid-cols-12">
            <div className="lg:col-span-5">
              <p className="text-[10px] font-semibold uppercase tracking-[0.26em] text-brass">
                {isCue ? "In-game stats at level 10" : "Clubhouse standards"}
              </p>
              <h2 className="mt-2 font-display text-3xl font-semibold leading-tight text-paper">
                {isCue ? "Built for long breaks and heavy spin." : "Handled by real players, start to finish."}
              </h2>

              <div className="mt-6 space-y-3">
                {statBars.map((s) => (
                  <div key={s.label} className="grid grid-cols-[68px_1fr] items-center gap-3">
                    <span className="text-[10px] font-semibold uppercase tracking-[0.22em] text-paper/75">
                      {s.label}
                    </span>
                    <div className="grid grid-cols-10 gap-1">
                      {Array.from({ length: 10 }).map((_, idx) => (
                        <span
                          key={idx}
                          className={`h-2 rounded-[1px] ${idx < s.filled ? "bg-brass" : "bg-paper/15"}`}
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:col-span-7">
              <ProductDetailTabs requiredInput={p.requiredInput} deliveryHours={p.deliveryHours} />
            </div>
          </div>
        </section>

        {/* Reviews */}
        <section className="space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="font-display text-3xl font-semibold text-ink">Reviews</h2>
            <WriteReviewToggle productId={p.id} slug={p.slug} defaultName={user?.name} />
          </div>

          <div className="grid gap-5 md:grid-cols-3">
            {p.reviews.slice(0, 3).map((r) => (
              <Card key={r.id} className="flex flex-col justify-between p-6">
                <div>
                  <span className="font-display text-3xl leading-none text-brass">&ldquo;</span>
                  <p className="mt-2 font-display text-[17px] italic leading-relaxed text-ink">{r.body}</p>
                </div>
                <div className="mt-6 border-t border-border pt-4">
                  <div className="flex items-center justify-between gap-2">
                    <Stars rating={r.rating} />
                    <span className="rounded-[2px] border border-border bg-cream/60 px-2 py-0.5 text-[9px] font-semibold uppercase tracking-[0.18em] text-muted">
                      {p.name.replace(" (Legendary)", "")}
                    </span>
                  </div>
                  <p className="mt-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-muted">
                    {r.author} · {r.country}
                  </p>
                </div>
              </Card>
            ))}
          </div>
        </section>

        {/* You may also like */}
        <section className="space-y-6 border-t border-border pt-10">
          <h2 className="font-display text-3xl font-semibold text-ink">You may also like</h2>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {related.map((item) => (
              <ProductCard key={item.id} product={item} sale={saleFor(sales, item.slug)} />
            ))}
          </div>
        </section>
      </Container>
    </div>
  );
}

export default function ProductPage(props: PageProps<"/product/[slug]">) {
  return (
    <Suspense fallback={<PageFallback />}>
      <ProductBody {...props} />
    </Suspense>
  );
}
