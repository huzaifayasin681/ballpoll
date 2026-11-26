export interface SeoCheckItem {
  id: string;
  label: string;
  passed: boolean;
  hint: string;
}

export interface PostSeoReport {
  score: number;
  wordCount: number;
  readMinutes: number;
  checks: SeoCheckItem[];
}

export function slugifyPost(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/['’]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 96);
}

export function parseTags(raw: string | string[]): string[] {
  const list = Array.isArray(raw) ? raw : raw.split(",");
  const seen = new Set<string>();
  const out: string[] = [];
  for (const item of list) {
    const clean = item.trim().toLowerCase().replace(/^#+/, "").slice(0, 32);
    if (clean && !seen.has(clean)) {
      seen.add(clean);
      out.push(clean);
    }
  }
  return out.slice(0, 12);
}

export function countWords(markdown: string): number {
  const plain = markdown
    .replace(/!\[[^\]]*\]\([^)]+\)/g, " ")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/[#>*`_~-]/g, " ")
    .trim();
  if (!plain) return 0;
  return plain.split(/\s+/).filter(Boolean).length;
}

export function estimateReadMinutes(markdown: string): number {
  const words = countWords(markdown);
  return Math.max(1, Math.ceil(words / 200));
}

export function evaluatePostSeo(input: {
  title: string;
  slug: string;
  excerpt: string;
  body: string;
  coverImage?: string | null;
  coverAlt?: string | null;
  tags: string[];
  metaTitle?: string | null;
  metaDesc?: string | null;
  focusKeyword?: string | null;
}): PostSeoReport {
  const effectiveTitle = (input.metaTitle?.trim() || input.title.trim());
  const effectiveDesc = (input.metaDesc?.trim() || input.excerpt.trim());
  const kw = input.focusKeyword?.trim().toLowerCase() || "";
  const wordCount = countWords(input.body);
  const readMinutes = estimateReadMinutes(input.body);
  const hasH2 = /^##\s+\S/m.test(input.body);
  const hasImage = Boolean(input.coverImage?.trim());
  const hasAlt = Boolean(input.coverAlt?.trim() && input.coverAlt.trim().length >= 5);

  const kwInTitle = !kw || effectiveTitle.toLowerCase().includes(kw);
  const kwInSlug = !kw || input.slug.toLowerCase().includes(kw.replace(/\s+/g, "-"));
  const kwInDesc = !kw || effectiveDesc.toLowerCase().includes(kw);
  const kwInBody = !kw || input.body.toLowerCase().includes(kw);

  const checks: SeoCheckItem[] = [
    {
      id: "meta-title",
      label: "SEO title length (30–60 chars)",
      passed: effectiveTitle.length >= 30 && effectiveTitle.length <= 60,
      hint: `Currently ${effectiveTitle.length} chars`,
    },
    {
      id: "meta-desc",
      label: "Meta description (120–160 chars)",
      passed: effectiveDesc.length >= 120 && effectiveDesc.length <= 160,
      hint: `Currently ${effectiveDesc.length} chars`,
    },
    {
      id: "cover-image",
      label: "Featured image & descriptive alt text",
      passed: hasImage && hasAlt,
      hint: !hasImage ? "Upload or pick a cover image" : hasAlt ? "Image & alt set" : "Add SEO alt text (5+ chars)",
    },
    {
      id: "tags",
      label: "Post tags (at least 2 tags)",
      passed: input.tags.length >= 2,
      hint: `${input.tags.length} tag${input.tags.length === 1 ? "" : "s"} added`,
    },
    {
      id: "headings",
      label: "Structured subheadings (## H2)",
      passed: hasH2,
      hint: hasH2 ? "Subheadings detected for Table of Contents" : "Add at least one ## heading",
    },
    {
      id: "word-count",
      label: "Content depth (300+ words recommended)",
      passed: wordCount >= 300,
      hint: `${wordCount} words (${readMinutes} min read)`,
    },
    {
      id: "keyword-title",
      label: "Focus keyword in title & slug",
      passed: Boolean(kw) && kwInTitle && kwInSlug,
      hint: !kw ? "Set a focus keyword" : kwInTitle && kwInSlug ? `Matches "${kw}"` : "Include focus keyword in SEO title & URL slug",
    },
    {
      id: "keyword-body",
      label: "Focus keyword in meta description & body",
      passed: Boolean(kw) && kwInDesc && kwInBody,
      hint: !kw ? "Set a focus keyword" : kwInDesc && kwInBody ? "Natural keyword placement verified" : "Use focus keyword in description and body",
    },
  ];

  const passedCount = checks.filter((c) => c.passed).length;
  const score = Math.round((passedCount / checks.length) * 100);

  return { score, wordCount, readMinutes, checks };
}
