"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Card } from "@/components/ui/primitives";
import { cn } from "@/lib/utils";
import { ArrowRight } from "lucide-react";

export interface GuidePostItem {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  readMinutes: number;
  publishedAtLabel: string;
}

const TOPICS = ["All", "Guides", "Cues", "Rings", "Safety", "Tips"] as const;
type TopicTab = (typeof TOPICS)[number];

export function guideImageFor(category: string, slug: string): { src: string; alt: string } {
  const key = `${category} ${slug}`.toLowerCase();
  if (key.includes("cue") || key.includes("archangel")) {
    return { src: "/images/pool/cues-legendary.png", alt: "8 Ball Pool Legendary Cues Guide" };
  }
  if (key.includes("ring") || key.includes("venice") || key.includes("boost")) {
    return { src: "/images/pool/tables-venues.png", alt: "8 Ball Pool Championship Tables & Rings" };
  }
  if (key.includes("safe") || key.includes("security") || key.includes("ban") || key.includes("account")) {
    return { src: "/images/pool/pro-account-boosting.jpg", alt: "8 Ball Pool Account Safety Guide" };
  }
  if (key.includes("coin") || key.includes("cash") || key.includes("bank")) {
    return { src: "/images/pool/logo-8ball.jpg", alt: "8 Ball Pool Coins & Bankroll Guide" };
  }
  if (key.includes("pass") || key.includes("vip")) {
    return { src: "/images/pool/match-blue.jpg", alt: "8 Ball Pool VIP Membership Guide" };
  }
  return { src: "/images/pool/rack-break.jpg", alt: "8 Ball Pool Strategy & Break Guide" };
}

export function GuidesClient({ posts }: { posts: GuidePostItem[] }) {
  const [topic, setTopic] = useState<TopicTab>("All");

  const featured = posts[0];
  const restPosts = posts.slice(1);

  const filtered = useMemo(() => {
    const source = topic === "All" ? restPosts : posts;
    if (topic === "All") return source;
    const t = topic.toLowerCase();
    return source.filter((p) => {
      const hay = `${p.category} ${p.title} ${p.excerpt}`.toLowerCase();
      if (t === "guides") return hay.includes("guide") || hay.includes("how") || hay.includes("start");
      if (t === "cues") return hay.includes("cue");
      if (t === "rings") return hay.includes("ring") || hay.includes("venice") || hay.includes("berlin");
      if (t === "safety") return hay.includes("safe") || hay.includes("protect") || hay.includes("account") || hay.includes("ban");
      if (t === "tips") return hay.includes("tip") || hay.includes("coin") || hay.includes("spin") || hay.includes("break");
      return true;
    });
  }, [posts, restPosts, topic]);

  const featuredImg = featured ? guideImageFor(featured.category, featured.slug) : null;

  return (
    <div className="space-y-8">
      {/* Featured guide split Paper card with real image */}
      {featured && featuredImg && (
        <Link href={`/blog/${featured.slug}`} className="group block">
          <Card className="overflow-hidden transition hover:border-brass">
            <div className="grid md:grid-cols-[1.05fr_1fr]">
              <div className="relative min-h-[240px] overflow-hidden bg-felt-deep md:min-h-[300px]">
                <img
                  src={featuredImg.src}
                  alt={featuredImg.alt}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-felt-deep/80 via-transparent to-black/15" />
                <div className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-brass/25" />
              </div>
              <div className="flex flex-col justify-between p-6 md:p-8">
                <div>
                  <div className="text-[11px] font-semibold uppercase tracking-[0.22em] text-brass-dark">
                    FEATURED · {featured.category.toUpperCase()}
                  </div>
                  <h2 className="mt-2 font-display text-2xl font-semibold leading-snug text-ink group-hover:text-felt md:text-3xl">
                    {featured.title}
                  </h2>
                  <p className="mt-3 text-sm leading-relaxed text-muted">
                    {featured.excerpt}
                  </p>
                </div>
                <div className="mt-6 flex items-center justify-between border-t border-border pt-4 text-xs">
                  <span className="text-muted">
                    {featured.readMinutes} min read · {featured.publishedAtLabel}
                  </span>
                  <span className="inline-flex items-center gap-1.5 font-semibold uppercase tracking-[0.14em] text-felt group-hover:text-brass-dark">
                    Read guide <ArrowRight className="h-3.5 w-3.5" />
                  </span>
                </div>
              </div>
            </div>
          </Card>
        </Link>
      )}

      {/* Filter pills */}
      <div className="flex flex-wrap items-center gap-2">
        {TOPICS.map((tab) => {
          const active = topic === tab;
          return (
            <button
              key={tab}
              type="button"
              onClick={() => setTopic(tab)}
              className={cn(
                "rounded-[2px] border px-3.5 py-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] transition",
                active
                  ? "border-felt bg-felt text-paper"
                  : "border-border bg-paper text-ink hover:border-brass",
              )}
            >
              {tab}
            </button>
          );
        })}
      </div>

      {/* 3-col grid with real photography */}
      {filtered.length === 0 ? (
        <Card className="p-8 text-center text-sm text-muted">
          No guides filed under {topic} yet.
        </Card>
      ) : (
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((p) => {
            const img = guideImageFor(p.category, p.slug);
            return (
              <Link key={p.id} href={`/blog/${p.slug}`} className="group block">
                <Card className="flex h-full flex-col overflow-hidden transition hover:border-brass">
                  <div className="relative h-44 overflow-hidden bg-felt-deep">
                    <img
                      src={img.src}
                      alt={img.alt}
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
                      <h3 className="font-display text-lg font-semibold leading-snug text-ink group-hover:text-felt">
                        {p.title}
                      </h3>
                      <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-muted">
                        {p.excerpt}
                      </p>
                    </div>
                    <div className="mt-4 flex items-center justify-between border-t border-border pt-3 text-[11px] text-muted">
                      <span>{p.readMinutes} min read</span>
                      <span>{p.publishedAtLabel}</span>
                    </div>
                  </div>
                </Card>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
