import { Suspense } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { cacheLife, cacheTag } from "next/cache";
import { ArrowLeft, Clock, PenSquare, Tag, User } from "lucide-react";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { site } from "@/lib/site";
import { formatDate } from "@/lib/utils";
import { countWords } from "@/lib/post-seo";
import { extractMarkdownHeadings, Markdown } from "@/components/markdown";
import { JsonLd } from "@/components/json-ld";
import { Button } from "@/components/ui/button";
import { Badge, Card, Container, PageFallback } from "@/components/ui/primitives";
import { CopyButton } from "@/components/ui/copy-button";
import { guideImageFor } from "@/components/shop/guides-client";

async function getPost(slug: string) {
  "use cache";
  cacheLife("minutes");
  cacheTag("catalog");
  return db.blogPost.findUnique({ where: { slug } });
}

async function getRelatedPosts(slug: string, category: string, tags: string[]) {
  "use cache";
  cacheLife("minutes");
  cacheTag("catalog");
  const all = await db.blogPost.findMany({
    where: { published: true },
    orderBy: [{ featured: "desc" }, { publishedAt: "desc" }],
  });
  return all
    .filter((p) => p.slug !== slug)
    .map((p) => {
      const pTags = Array.isArray(p.tags) ? p.tags : [];
      const sharedTags = pTags.filter((t) => tags.includes(t)).length;
      const sameCategory = p.category === category ? 2 : 0;
      return { post: p, score: sharedTags * 3 + sameCategory };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .map((x) => x.post);
}

function absoluteMediaUrl(src: string): string {
  if (src.startsWith("http://") || src.startsWith("https://")) return src;
  return `${site.url}${src.startsWith("/") ? src : `/${src}`}`;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post || !post.published) {
    return {
      title: "Not Found",
      robots: { index: false, follow: false },
    };
  }

  const seoTitle = post.metaTitle?.trim() || post.title;
  const seoDesc = post.metaDesc?.trim() || post.excerpt;
  const coverSrc = post.coverImage || guideImageFor(post.category, post.slug).src;
  const coverAlt = post.coverAlt || post.title;
  const canonical = post.canonicalUrl?.trim() || `/posts/${post.slug}`;
  const tags = Array.isArray(post.tags) ? post.tags : [];
  const keywords = [post.focusKeyword, post.category, ...tags].filter(Boolean) as string[];
  const allowIndex = post.published && !post.noIndex;

  return {
    title: seoTitle,
    description: seoDesc,
    keywords,
    authors: [{ name: post.authorName || "GlobalPool Editorial" }],
    alternates: { canonical },
    robots: {
      index: allowIndex,
      follow: allowIndex,
      googleBot: {
        index: allowIndex,
        follow: allowIndex,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    openGraph: {
      type: "article",
      title: seoTitle,
      description: seoDesc,
      url: `${site.url}/posts/${post.slug}`,
      siteName: site.name,
      publishedTime: post.publishedAt.toISOString(),
      modifiedTime: post.updatedAt.toISOString(),
      section: post.category,
      tags,
      authors: [post.authorName || "GlobalPool Editorial"],
      images: [
        {
          url: absoluteMediaUrl(coverSrc),
          width: 1200,
          height: 630,
          alt: coverAlt,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: seoTitle,
      description: seoDesc,
      images: [absoluteMediaUrl(coverSrc)],
    },
  };
}

export default function PostDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  return (
    <Suspense fallback={<PageFallback />}>
      <PostDetailBody params={params} />
    </Suspense>
  );
}

async function PostDetailBody({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [post, user] = await Promise.all([getPost(slug), getCurrentUser()]);
  if (!post) notFound();

  const isAdmin = user?.role === "ADMIN";
  if (!post.published && !isAdmin) notFound();

  const tags = Array.isArray(post.tags) ? post.tags : [];
  const related = await getRelatedPosts(post.slug, post.category, tags);
  const headings = extractMarkdownHeadings(post.body);
  const coverSrc = post.coverImage || guideImageFor(post.category, post.slug).src;
  const coverAlt = post.coverAlt || post.title;
  const wordCount = countWords(post.body);
  const postUrl = `${site.url}/posts/${post.slug}`;

  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BlogPosting",
        "@id": `${postUrl}#article`,
        headline: post.metaTitle?.trim() || post.title,
        description: post.metaDesc?.trim() || post.excerpt,
        image: {
          "@type": "ImageObject",
          url: absoluteMediaUrl(coverSrc),
          caption: coverAlt,
        },
        author: {
          "@type": "Person",
          name: post.authorName || "GlobalPool Editorial",
        },
        publisher: {
          "@type": "Organization",
          name: site.name,
          url: site.url,
          logo: {
            "@type": "ImageObject",
            url: absoluteMediaUrl("/images/pool/logo-8ball.jpg"),
          },
        },
        datePublished: post.publishedAt.toISOString(),
        dateModified: post.updatedAt.toISOString(),
        mainEntityOfPage: {
          "@type": "WebPage",
          "@id": postUrl,
        },
        articleSection: post.category,
        keywords: [post.focusKeyword, ...tags].filter(Boolean).join(", "),
        wordCount,
        timeRequired: `PT${post.readMinutes}M`,
        inLanguage: "en",
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: site.url },
          { "@type": "ListItem", position: 2, name: "Posts", item: `${site.url}/posts` },
          {
            "@type": "ListItem",
            position: 3,
            name: post.category,
            item: `${site.url}/posts?category=${encodeURIComponent(post.category)}`,
          },
          { "@type": "ListItem", position: 4, name: post.title, item: postUrl },
        ],
      },
    ],
  };

  return (
    <div className="bg-cream py-10 md:py-14">
      <JsonLd data={structuredData} />

      <Container>
        {!post.published && isAdmin && (
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-[4px] border border-brass bg-accent-soft px-4 py-3 text-xs text-ink">
            <span>
              <strong>Draft Preview (Admin Only)</strong> — This post is hidden from public visitors and search engines until published.
            </span>
            <Link href="/admin/posts" className="font-semibold text-felt underline">
              Return to Admin Publisher
            </Link>
          </div>
        )}

        {/* Semantic Header & Breadcrumbs */}
        <header className="max-w-3xl">
          <nav
            aria-label="Breadcrumb"
            className="flex flex-wrap items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-muted"
          >
            <Link href="/" className="hover:text-felt">
              Home
            </Link>
            <span>/</span>
            <Link href="/posts" className="hover:text-felt">
              Posts
            </Link>
            <span>/</span>
            <Link
              href={`/posts?category=${encodeURIComponent(post.category)}`}
              className="text-brass-dark hover:text-felt"
            >
              {post.category}
            </Link>
          </nav>

          <div className="mt-4 flex flex-wrap items-center gap-2">
            <Badge tone="gold">{post.category}</Badge>
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-muted">
              <Clock className="h-3.5 w-3.5 text-brass-dark" /> {post.readMinutes} min read
            </span>
          </div>

          <h1 className="mt-3 font-display text-3xl font-semibold leading-tight tracking-[-0.02em] text-ink md:text-5xl">
            {post.title}
          </h1>

          <p className="mt-3 text-base leading-relaxed text-muted">{post.excerpt}</p>

          <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-y border-border py-3 text-xs text-muted">
            <div className="flex flex-wrap items-center gap-3">
              <span className="inline-flex items-center gap-1.5 font-medium text-ink">
                <User className="h-3.5 w-3.5 text-felt" /> {post.authorName || "GlobalPool Editorial"}
              </span>
              <span>·</span>
              <time dateTime={post.publishedAt.toISOString()}>
                Published {formatDate(post.publishedAt)}
              </time>
              {post.updatedAt.getTime() - post.publishedAt.getTime() > 60_000 && (
                <>
                  <span>·</span>
                  <time dateTime={post.updatedAt.toISOString()}>
                    Updated {formatDate(post.updatedAt)}
                  </time>
                </>
              )}
            </div>

            <div className="flex items-center gap-2">
              <CopyButton text={postUrl} label="Copy link" />
              {isAdmin && (
                <Link
                  href="/admin/posts"
                  className="inline-flex h-8 items-center gap-1 rounded-[2px] border border-felt bg-felt px-2.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-paper hover:bg-felt-deep"
                >
                  <PenSquare className="h-3 w-3" /> Edit in Admin
                </Link>
              )}
            </div>
          </div>
        </header>

        {/* 8-col article + 4-col sticky sidebar */}
        <div className="mt-8 grid gap-8 lg:grid-cols-12 lg:items-start">
          <article className="space-y-6 lg:col-span-8">
            <figure className="overflow-hidden rounded-[6px] border border-brass/35 bg-felt-deep">
              <img
                src={coverSrc}
                alt={coverAlt}
                className="max-h-[420px] w-full object-cover"
              />
              {post.coverAlt && (
                <figcaption className="border-t border-brass/25 bg-felt-deep/95 px-4 py-2 text-xs text-cream/80">
                  {post.coverAlt}
                </figcaption>
              )}
            </figure>

            <Card className="p-6 md:p-10">
              <Markdown body={post.body} />

              {tags.length > 0 && (
                <footer className="mt-8 border-t border-border pt-5">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-muted">
                      <Tag className="h-3.5 w-3.5 text-brass-dark" /> Tagged:
                    </span>
                    {tags.map((tag) => (
                      <Link
                        key={tag}
                        href={`/posts?tag=${encodeURIComponent(tag)}`}
                        className="rounded-[2px] border border-border bg-cream/70 px-2.5 py-1 font-mono text-[11px] font-medium text-ink transition hover:border-brass hover:text-felt"
                      >
                        #{tag}
                      </Link>
                    ))}
                  </div>
                </footer>
              )}
            </Card>

            <div>
              <Link
                href="/posts"
                className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-felt hover:text-brass-dark"
              >
                <ArrowLeft className="h-3.5 w-3.5" /> Back to all posts
              </Link>
            </div>
          </article>

          <aside className="space-y-5 lg:sticky lg:top-24 lg:col-span-4">
            {headings.length > 0 && (
              <Card className="p-6">
                <div className="text-[11px] font-semibold uppercase tracking-[0.22em] text-brass-dark">
                  ON THIS PAGE
                </div>
                <nav aria-label="Table of contents" className="mt-3 space-y-1.5 border-l border-border">
                  {headings.map((h, idx) => (
                    <a
                      key={h.id}
                      href={`#${h.id}`}
                      className={
                        idx === 0
                          ? "-ml-px block border-l-2 border-brass py-1 pl-3 text-sm font-semibold text-ink"
                          : "-ml-px block border-l-2 border-transparent py-1 pl-3 text-sm text-muted transition hover:border-brass/60 hover:text-ink"
                      }
                    >
                      {h.text}
                    </a>
                  ))}
                </nav>
              </Card>
            )}

            <Card className="overflow-hidden p-6">
              <div className="relative mb-4 h-36 overflow-hidden rounded-[4px] border border-brass/30 bg-felt-deep">
                <img
                  src="/images/pool/logo-8ball.jpg"
                  alt="8 Ball Pool Coins Top-Up"
                  className="h-full w-full object-cover"
                />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-felt-deep/80 via-transparent to-black/15" />
              </div>
              <div className="text-[11px] font-semibold uppercase tracking-[0.2em] text-brass-dark">
                CLUBHOUSE COUNTER
              </div>
              <h2 className="mt-1 font-display text-xl font-semibold text-ink">Ready to top up?</h2>
              <p className="mt-1.5 text-sm leading-relaxed text-muted">
                Instant Unique ID coin transfers, 20/20 legendary cues, and verified rings.
              </p>
              <Link href="/store/coins-cash" className="mt-4 block">
                <Button className="w-full">SHOP COINS</Button>
              </Link>
            </Card>
          </aside>
        </div>

        {/* Related Posts */}
        {related.length > 0 && (
          <section className="mt-14 space-y-5 border-t border-border pt-10">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-brass-dark">
                KEEP READING
              </p>
              <h2 className="mt-1 font-display text-2xl font-semibold text-ink sm:text-3xl">
                Related Posts
              </h2>
            </div>

            <div className="grid gap-5 md:grid-cols-3">
              {related.map((rp) => {
                const rpImg = rp.coverImage || guideImageFor(rp.category, rp.slug).src;
                return (
                  <Link key={rp.id} href={`/posts/${rp.slug}`} className="group block">
                    <Card className="flex h-full flex-col overflow-hidden transition hover:border-brass">
                      <div className="relative h-40 overflow-hidden bg-felt-deep">
                        <img
                          src={rpImg}
                          alt={rp.coverAlt || rp.title}
                          loading="lazy"
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        <span className="pointer-events-none absolute bottom-2 left-2.5 rounded-[2px] border border-brass/40 bg-felt-deep/85 px-2 py-0.5 text-[9px] font-semibold uppercase tracking-[0.18em] text-brass">
                          {rp.category}
                        </span>
                      </div>
                      <div className="flex flex-1 flex-col justify-between p-4">
                        <h3 className="font-display text-base font-semibold leading-snug text-ink group-hover:text-felt">
                          {rp.title}
                        </h3>
                        <p className="mt-3 text-[11px] text-muted">
                          {rp.readMinutes} min read · {formatDate(rp.publishedAt)}
                        </p>
                      </div>
                    </Card>
                  </Link>
                );
              })}
            </div>
          </section>
        )}
      </Container>
    </div>
  );
}
