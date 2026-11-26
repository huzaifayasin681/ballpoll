import { Suspense } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { cacheLife, cacheTag } from "next/cache";
import { db } from "@/lib/db";
import { site } from "@/lib/site";
import { formatDate } from "@/lib/utils";
import { extractMarkdownHeadings, Markdown } from "@/components/markdown";
import { JsonLd } from "@/components/json-ld";
import { Button } from "@/components/ui/button";
import { Card, Container, PageFallback } from "@/components/ui/primitives";
import { GoldCoinStackArt } from "@/components/clubhouse/illustrations";
import { guideImageFor } from "@/components/shop/guides-client";
import type { Metadata } from "next";

async function getPost(slug: string) {
  "use cache";
  cacheLife("minutes");
  cacheTag("catalog");
  return db.blogPost.findUnique({ where: { slug } });
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const p = await getPost(slug);
  if (!p) return {};
  return { title: p.title, description: p.excerpt };
}

export default function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  return (
    <Suspense fallback={<PageFallback />}>
      <BlogPostBody params={params} />
    </Suspense>
  );
}

async function BlogPostBody({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post || !post.published) notFound();

  const headings = extractMarkdownHeadings(post.body);

  return (
    <div className="bg-cream py-10 md:py-14">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Article",
          headline: post.title,
          description: post.excerpt,
          datePublished: post.publishedAt.toISOString(),
          dateModified: post.updatedAt.toISOString(),
          author: { "@type": "Organization", name: site.name },
          publisher: { "@type": "Organization", name: site.name },
        }}
      />

      <Container>
        {/* Editorial breadcrumb & title header directly on Cream */}
        <div className="max-w-3xl">
          <nav aria-label="Breadcrumb" className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted">
            <Link href="/blog" className="hover:text-felt">
              Guides
            </Link>
            <span className="mx-2">/</span>
            <span className="text-brass-dark">{post.category}</span>
          </nav>

          <div className="mt-4 text-[11px] font-semibold uppercase tracking-[0.22em] text-brass-dark">
            {post.category.toUpperCase()} · {post.readMinutes} MIN READ
          </div>
          <h1 className="mt-2 font-display text-3xl font-semibold leading-tight tracking-[-0.02em] text-ink md:text-5xl">
            {post.title}
          </h1>
          <p className="mt-3 text-sm text-muted">
            Published {formatDate(post.publishedAt)} · GlobalPool Clubhouse Editorial
          </p>
        </div>

        {/* 8-col article + 4-col sticky sidebar */}
        <div className="mt-8 grid gap-8 lg:grid-cols-12 lg:items-start">
          <article className="space-y-6 lg:col-span-8">
            {/* Real photo hero card framed in Felt & Brass */}
            <div className="relative h-60 overflow-hidden rounded-[6px] border border-brass/35 bg-felt-deep md:h-72">
              <img
                src={guideImageFor(post.category, post.slug).src}
                alt={post.title}
                className="h-full w-full object-cover"
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-felt-deep/80 via-transparent to-black/15" />
            </div>

            <Card className="p-6 md:p-10">
              <Markdown body={post.body} />
            </Card>
          </article>

          <aside className="space-y-5 lg:sticky lg:top-24 lg:col-span-4">
            {headings.length > 0 && (
              <Card className="p-6">
                <div className="text-[11px] font-semibold uppercase tracking-[0.22em] text-brass-dark">
                  ON THIS PAGE
                </div>
                <nav className="mt-3 space-y-1.5 border-l border-border">
                  {headings.map((h, idx) => (
                    <a
                      key={h.id}
                      href={`#${h.id}`}
                      className={
                        idx === 0
                          ? "-ml-px block border-l-2 border-brass pl-3 py-1 text-sm font-semibold text-ink"
                          : "-ml-px block border-l-2 border-transparent pl-3 py-1 text-sm text-muted transition hover:border-brass/60 hover:text-ink"
                      }
                    >
                      {h.text}
                    </a>
                  ))}
                </nav>
              </Card>
            )}

            <Card className="overflow-hidden p-6">
              <div className="felt-window mb-4 flex h-32 items-center justify-center rounded-[4px] p-4">
                <div className="h-24 w-36">
                  <GoldCoinStackArt />
                </div>
              </div>
              <div className="text-[11px] font-semibold uppercase tracking-[0.2em] text-brass-dark">
                CLUBHOUSE COUNTER
              </div>
              <h2 className="mt-1 font-display text-xl font-semibold text-ink">
                Ready to top up?
              </h2>
              <p className="mt-1.5 text-sm leading-relaxed text-muted">
                Instant Unique ID coin top-ups and verified cues in 5 minutes.
              </p>
              <Link href="/store/coins-cash" className="mt-4 block">
                <Button className="w-full">SHOP COINS</Button>
              </Link>
            </Card>
          </aside>
        </div>
      </Container>
    </div>
  );
}
