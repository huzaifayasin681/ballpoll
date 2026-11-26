"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight, Clock, Search, Tag, User } from "lucide-react";
import { Card } from "@/components/ui/primitives";
import { guideImageFor } from "@/components/shop/guides-client";
import { cn } from "@/lib/utils";

export interface PublicPostItem {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  coverImage: string | null;
  coverAlt: string | null;
  tags: string[];
  authorName: string;
  featured: boolean;
  readMinutes: number;
  publishedAtIso: string;
  publishedAtLabel: string;
}

export function PostsFeedClient({
  posts,
  initialTag = "",
  initialCategory = "All",
  initialQuery = "",
}: {
  posts: PublicPostItem[];
  initialTag?: string;
  initialCategory?: string;
  initialQuery?: string;
}) {
  const [query, setQuery] = useState(initialQuery);
  const [category, setCategory] = useState(initialCategory || "All");
  const [activeTag, setActiveTag] = useState(initialTag.toLowerCase());

  const categories = useMemo(() => {
    const set = new Set<string>();
    for (const p of posts) set.add(p.category);
    return ["All", ...Array.from(set)];
  }, [posts]);

  const allTags = useMemo(() => {
    const counts = new Map<string, number>();
    for (const p of posts) {
      for (const t of p.tags) {
        counts.set(t, (counts.get(t) ?? 0) + 1);
      }
    }
    return Array.from(counts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 14)
      .map(([name]) => name);
  }, [posts]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return posts.filter((p) => {
      if (category !== "All" && p.category.toLowerCase() !== category.toLowerCase()) return false;
      if (activeTag && !p.tags.includes(activeTag)) return false;
      if (q) {
        const hay = `${p.title} ${p.excerpt} ${p.category} ${p.tags.join(" ")} ${p.authorName}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }, [posts, category, activeTag, query]);

  const showFeaturedBanner = !query.trim() && category === "All" && !activeTag && filtered.length > 0;
  const featured = showFeaturedBanner ? (filtered.find((p) => p.featured) ?? filtered[0]) : null;
  const gridPosts = featured ? filtered.filter((p) => p.id !== featured.id) : filtered;

  return (
    <div className="space-y-8">
      {/* Search + Category & Tag Filters */}
      <Card className="space-y-4 p-5">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="pointer-events-none absolute left-3 top-3 h-4 w-4 text-muted" />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search posts, keywords, or tags..."
              aria-label="Search posts"
              className="h-10 w-full rounded-[2px] border border-border bg-cream/60 pl-9 pr-3.5 text-sm text-ink placeholder:text-muted/75 outline-none focus:border-felt focus:bg-paper"
            />
          </div>

          <div className="flex flex-wrap items-center gap-1.5">
            {categories.map((cat) => {
              const active = category.toLowerCase() === cat.toLowerCase();
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setCategory(cat)}
                  className={cn(
                    "cursor-pointer rounded-[2px] border px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.16em] transition",
                    active
                      ? "border-felt bg-felt text-paper"
                      : "border-border bg-paper text-ink hover:border-brass",
                  )}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </div>

        {allTags.length > 0 && (
          <div className="flex flex-wrap items-center gap-1.5 border-t border-border pt-3">
            <span className="inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-muted">
              <Tag className="h-3 w-3 text-brass-dark" /> Tags:
            </span>
            {activeTag && (
              <button
                type="button"
                onClick={() => setActiveTag("")}
                className="cursor-pointer rounded-[2px] border border-danger-border bg-danger-soft px-2 py-0.5 text-[10px] font-semibold text-danger"
              >
                Clear #{activeTag} ×
              </button>
            )}
            {allTags.map((tag) => {
              const isSelected = activeTag === tag;
              return (
                <button
                  key={tag}
                  type="button"
                  onClick={() => setActiveTag(isSelected ? "" : tag)}
                  className={cn(
                    "cursor-pointer rounded-[2px] border px-2 py-0.5 font-mono text-[10px] font-medium transition",
                    isSelected
                      ? "border-brass bg-accent-soft text-ink"
                      : "border-border bg-cream/50 text-muted hover:border-brass hover:text-ink",
                  )}
                >
                  #{tag}
                </button>
              );
            })}
          </div>
        )}
      </Card>

      {/* Featured Post Split Card */}
      {featured && (
        <article>
          <Link href={`/posts/${featured.slug}`} className="group block">
            <Card className="overflow-hidden transition hover:border-brass">
              <div className="grid md:grid-cols-[1.1fr_1fr]">
                <div className="relative min-h-[250px] overflow-hidden bg-felt-deep md:min-h-[320px]">
                  <img
                    src={featured.coverImage || guideImageFor(featured.category, featured.slug).src}
                    alt={featured.coverAlt || featured.title}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-felt-deep/80 via-transparent to-black/15" />
                  <span className="pointer-events-none absolute left-4 top-4 rounded-[2px] border border-brass/50 bg-felt-deep/90 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-brass">
                    FEATURED POST
                  </span>
                </div>

                <div className="flex flex-col justify-between p-6 md:p-8">
                  <div>
                    <div className="text-[11px] font-semibold uppercase tracking-[0.22em] text-brass-dark">
                      {featured.category}
                    </div>
                    <h2 className="mt-2 font-display text-2xl font-semibold leading-snug text-ink group-hover:text-felt md:text-3xl">
                      {featured.title}
                    </h2>
                    <p className="mt-3 text-sm leading-relaxed text-muted">{featured.excerpt}</p>

                    {featured.tags.length > 0 && (
                      <div className="mt-4 flex flex-wrap gap-1.5">
                        {featured.tags.slice(0, 5).map((t) => (
                          <span
                            key={t}
                            className="rounded-[2px] border border-border bg-cream/70 px-2 py-0.5 font-mono text-[10px] text-ink"
                          >
                            #{t}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="mt-6 flex flex-wrap items-center justify-between gap-2 border-t border-border pt-4 text-xs">
                    <div className="flex items-center gap-3 text-muted">
                      <span className="inline-flex items-center gap-1">
                        <User className="h-3.5 w-3.5 text-brass-dark" /> {featured.authorName}
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5 text-brass-dark" /> {featured.readMinutes} min
                      </span>
                      <time dateTime={featured.publishedAtIso}>{featured.publishedAtLabel}</time>
                    </div>
                    <span className="inline-flex items-center gap-1.5 font-semibold uppercase tracking-[0.14em] text-felt group-hover:text-brass-dark">
                      Read post <ArrowRight className="h-3.5 w-3.5" />
                    </span>
                  </div>
                </div>
              </div>
            </Card>
          </Link>
        </article>
      )}

      {/* Posts Grid */}
      {gridPosts.length === 0 && !featured ? (
        <Card className="p-10 text-center">
          <p className="font-display text-xl font-semibold text-ink">No matching posts found</p>
          <p className="mt-1 text-sm text-muted">Try clearing your tag filter or searching another keyword.</p>
          <button
            type="button"
            onClick={() => {
              setQuery("");
              setCategory("All");
              setActiveTag("");
            }}
            className="mt-4 cursor-pointer rounded-[2px] border border-border bg-cream px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-ink hover:border-brass"
          >
            Reset filters
          </button>
        </Card>
      ) : (
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {gridPosts.map((p) => {
            const imgSrc = p.coverImage || guideImageFor(p.category, p.slug).src;
            return (
              <article key={p.id}>
                <Link href={`/posts/${p.slug}`} className="group block h-full">
                  <Card className="flex h-full flex-col overflow-hidden transition hover:border-brass">
                    <div className="relative h-48 overflow-hidden bg-felt-deep">
                      <img
                        src={imgSrc}
                        alt={p.coverAlt || p.title}
                        loading="lazy"
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-felt-deep/80 via-transparent to-black/15" />
                      <span className="pointer-events-none absolute bottom-2.5 left-3 rounded-[2px] border border-brass/40 bg-felt-deep/85 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-brass">
                        {p.category}
                      </span>
                    </div>

                    <div className="flex flex-1 flex-col justify-between p-5">
                      <div>
                        <h2 className="font-display text-lg font-semibold leading-snug text-ink group-hover:text-felt">
                          {p.title}
                        </h2>
                        <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-muted">
                          {p.excerpt}
                        </p>

                        {p.tags.length > 0 && (
                          <div className="mt-3 flex flex-wrap gap-1">
                            {p.tags.slice(0, 3).map((t) => (
                              <span
                                key={t}
                                className="rounded-[2px] border border-border bg-cream/60 px-1.5 py-0.5 font-mono text-[10px] text-muted"
                              >
                                #{t}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>

                      <div className="mt-4 flex items-center justify-between border-t border-border pt-3 text-[11px] text-muted">
                        <span>{p.readMinutes} min read</span>
                        <time dateTime={p.publishedAtIso}>{p.publishedAtLabel}</time>
                      </div>
                    </div>
                  </Card>
                </Link>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
