"use client";

import { useActionState, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  CheckCircle2,
  CircleAlert,
  ExternalLink,
  Eye,
  FileText,
  ImagePlus,
  Loader2,
  Pencil,
  Plus,
  Search,
  Sparkles,
  Star,
  Tag,
  Trash2,
  Upload,
  X,
} from "lucide-react";
import {
  deletePostAction,
  savePostAction,
  togglePostPublishedAction,
  type PostActionState,
} from "@/app/actions/posts";
import { Badge, Card, Input, Label, Select, Textarea } from "@/components/ui/primitives";
import { Button } from "@/components/ui/button";
import { Markdown } from "@/components/markdown";
import { evaluatePostSeo, parseTags, slugifyPost } from "@/lib/post-seo";
import { cn } from "@/lib/utils";

export interface AdminPostRecord {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  body: string;
  category: string;
  coverImage: string | null;
  coverAlt: string | null;
  tags: string[];
  authorName: string;
  metaTitle: string | null;
  metaDesc: string | null;
  focusKeyword: string | null;
  canonicalUrl: string | null;
  noIndex: boolean;
  featured: boolean;
  readMinutes: number;
  published: boolean;
  publishedAt: string;
  updatedAt: string;
}

const CATEGORIES = [
  "Guides",
  "Coins",
  "Cues",
  "Rings",
  "Ranks",
  "Safety",
  "News",
  "Tips",
  "Updates",
] as const;

const SUGGESTED_TAGS = [
  "8 ball pool",
  "coins",
  "legendary cues",
  "archangel cue",
  "berlin ring",
  "venice ring",
  "unique id",
  "account safety",
  "tips",
  "updates",
] as const;

const GALLERY_PRESETS = [
  { label: "8 Ball Coins", src: "/images/pool/logo-8ball.jpg" },
  { label: "Legendary Cues", src: "/images/pool/cues-legendary.png" },
  { label: "Maxed Cues", src: "/images/pool/legendary-cues-maxed.jpg" },
  { label: "Tables & Rings", src: "/images/pool/tables-venues.png" },
  { label: "Pro Boosting", src: "/images/pool/pro-account-boosting.jpg" },
  { label: "Instant Top-Ups", src: "/images/pool/instant-coin-topups.jpg" },
  { label: "Combo Deals", src: "/images/pool/combo-bundles-deals.jpg" },
  { label: "Rack Break", src: "/images/pool/rack-break.jpg" },
  { label: "Gameplay Assist", src: "/images/pool/gameplay-assist-tools.jpg" },
] as const;

export function AdminPostsClient({
  posts,
  defaultAuthor,
  siteUrl,
}: {
  posts: AdminPostRecord[];
  defaultAuthor: string;
  siteUrl: string;
}) {
  const router = useRouter();
  const formSectionRef = useRef<HTMLDivElement | null>(null);
  const bodyRef = useRef<HTMLTextAreaElement | null>(null);

  const [editingId, setEditingId] = useState<string>("");
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [slugTouched, setSlugTouched] = useState(false);
  const [category, setCategory] = useState<string>("Guides");
  const [excerpt, setExcerpt] = useState("");
  const [body, setBody] = useState("");
  const [coverImage, setCoverImage] = useState("/images/pool/logo-8ball.jpg");
  const [coverAlt, setCoverAlt] = useState("");
  const [tags, setTags] = useState<string[]>(["8 ball pool", "guides"]);
  const [tagDraft, setTagDraft] = useState("");
  const [authorName, setAuthorName] = useState(defaultAuthor);
  const [metaTitle, setMetaTitle] = useState("");
  const [metaDesc, setMetaDesc] = useState("");
  const [focusKeyword, setFocusKeyword] = useState("");
  const [canonicalUrl, setCanonicalUrl] = useState("");
  const [published, setPublished] = useState(true);
  const [featured, setFeatured] = useState(false);
  const [noIndex, setNoIndex] = useState(false);

  const [editorTab, setEditorTab] = useState<"write" | "preview">("write");
  const [uploadingCover, setUploadingCover] = useState(false);
  const [uploadingInline, setUploadingInline] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [listFilter, setListFilter] = useState<"all" | "published" | "drafts">("all");
  const [listSearch, setListSearch] = useState("");

  const [state, formAction, pending] = useActionState<PostActionState, FormData>(savePostAction, {});

  useEffect(() => {
    if (state.ok) {
      router.refresh();
    }
  }, [state.ok, state.postId, state.mode, router]);

  function resetForm() {
    setEditingId("");
    setTitle("");
    setSlug("");
    setSlugTouched(false);
    setCategory("Guides");
    setExcerpt("");
    setBody("");
    setCoverImage("/images/pool/logo-8ball.jpg");
    setCoverAlt("");
    setTags(["8 ball pool"]);
    setTagDraft("");
    setAuthorName(defaultAuthor);
    setMetaTitle("");
    setMetaDesc("");
    setFocusKeyword("");
    setCanonicalUrl("");
    setPublished(true);
    setFeatured(false);
    setNoIndex(false);
    setUploadError(null);
    setEditorTab("write");
  }

  function loadPostForEdit(p: AdminPostRecord) {
    setEditingId(p.id);
    setTitle(p.title);
    setSlug(p.slug);
    setSlugTouched(true);
    setCategory(p.category);
    setExcerpt(p.excerpt);
    setBody(p.body);
    setCoverImage(p.coverImage ?? "");
    setCoverAlt(p.coverAlt ?? "");
    setTags(p.tags ?? []);
    setTagDraft("");
    setAuthorName(p.authorName || defaultAuthor);
    setMetaTitle(p.metaTitle ?? "");
    setMetaDesc(p.metaDesc ?? "");
    setFocusKeyword(p.focusKeyword ?? "");
    setCanonicalUrl(p.canonicalUrl ?? "");
    setPublished(p.published);
    setFeatured(p.featured);
    setNoIndex(p.noIndex);
    setUploadError(null);
    setEditorTab("write");
    formSectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function handleTitleChange(val: string) {
    setTitle(val);
    if (!slugTouched) {
      setSlug(slugifyPost(val));
    }
  }

  function addTagFromInput(raw?: string) {
    const input = raw ?? tagDraft;
    if (!input.trim()) return;
    const next = parseTags([...tags, ...input.split(",")]);
    setTags(next);
    if (!raw) setTagDraft("");
  }

  function removeTag(tagToRemove: string) {
    setTags((prev) => prev.filter((t) => t !== tagToRemove));
  }

  async function uploadImageFile(file: File, target: "cover" | "inline") {
    setUploadError(null);
    if (target === "cover") setUploadingCover(true);
    else setUploadingInline(true);

    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/admin/posts/upload", {
        method: "POST",
        body: fd,
      });
      const json = (await res.json()) as { url?: string; error?: string };
      if (!res.ok || !json.url) {
        setUploadError(json.error ?? "Upload failed.");
        return;
      }
      if (target === "cover") {
        setCoverImage(json.url);
        if (!coverAlt && title) setCoverAlt(title);
      } else {
        const alt = file.name.replace(/\.[^.]+$/, "").replace(/[-_]+/g, " ");
        insertMarkdown(`\n\n![${alt}](${json.url})\n\n`);
      }
    } catch {
      setUploadError("Network error while uploading image.");
    } finally {
      if (target === "cover") setUploadingCover(false);
      else setUploadingInline(false);
    }
  }

  function insertMarkdown(snippet: string) {
    const el = bodyRef.current;
    if (!el) {
      setBody((prev) => `${prev}${snippet}`);
      return;
    }
    const start = el.selectionStart;
    const end = el.selectionEnd;
    const next = body.slice(0, start) + snippet + body.slice(end);
    setBody(next);
    requestAnimationFrame(() => {
      el.focus();
      const pos = start + snippet.length;
      el.setSelectionRange(pos, pos);
    });
  }

  const derivedSlug = slug || slugifyPost(title);
  const seo = useMemo(
    () =>
      evaluatePostSeo({
        title,
        slug: derivedSlug,
        excerpt,
        body,
        coverImage,
        coverAlt,
        tags,
        metaTitle,
        metaDesc,
        focusKeyword,
      }),
    [title, derivedSlug, excerpt, body, coverImage, coverAlt, tags, metaTitle, metaDesc, focusKeyword],
  );

  const serpTitle = (metaTitle.trim() || title.trim() || "Your Post Title Will Appear Here").slice(0, 65);
  const serpDesc = (
    metaDesc.trim() ||
    excerpt.trim() ||
    "Add a compelling 120–160 character meta description so players click your guide in search results."
  ).slice(0, 165);
  const cleanHost = siteUrl.replace(/^https?:\/\//, "").replace(/\/$/, "");

  const filteredPosts = useMemo(() => {
    const q = listSearch.trim().toLowerCase();
    return posts.filter((p) => {
      if (listFilter === "published" && !p.published) return false;
      if (listFilter === "drafts" && p.published) return false;
      if (q) {
        const hay = `${p.title} ${p.slug} ${p.category} ${p.tags.join(" ")}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }, [posts, listFilter, listSearch]);

  const publishedCount = posts.filter((p) => p.published).length;
  const draftCount = posts.length - publishedCount;

  return (
    <div className="space-y-8">
      {/* Header & KPI Row */}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-brass-dark">
            ADMIN ONLY · EDITORIAL &amp; SEO STUDIO
          </p>
          <h1 className="mt-1 font-display text-3xl font-semibold text-ink">
            Posts &amp; SEO Publisher
          </h1>
          <p className="mt-1 text-sm text-muted">
            Create, upload images, tag, and publish fully SEO-optimized articles to{" "}
            <Link href="/posts" className="font-semibold text-felt underline-offset-2 hover:underline">
              /posts
            </Link>{" "}
            with automatic Open Graph, JSON-LD schema, and XML sitemap updates.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Link
            href="/posts"
            target="_blank"
            className="inline-flex h-9 items-center gap-1.5 rounded-[2px] border border-border bg-paper px-3.5 text-xs font-semibold uppercase tracking-[0.14em] text-ink transition hover:border-brass"
          >
            <ExternalLink className="h-3.5 w-3.5 text-felt" /> View Public Posts
          </Link>
          <Button type="button" size="sm" onClick={resetForm}>
            <Plus className="h-3.5 w-3.5" /> New Post
          </Button>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="p-4">
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-muted">Total Posts</p>
          <p className="mt-1 font-display text-3xl font-semibold text-ink">{posts.length}</p>
        </Card>
        <Card className="p-4">
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-muted">Published Live</p>
          <p className="mt-1 font-display text-3xl font-semibold text-felt">{publishedCount}</p>
        </Card>
        <Card className="p-4">
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-muted">Saved Drafts</p>
          <p className="mt-1 font-display text-3xl font-semibold text-brass-dark">{draftCount}</p>
        </Card>
      </div>

      {/* Main Editor + Live SEO Column */}
      <div ref={formSectionRef} className="scroll-mt-20">
        <form action={formAction} className="grid gap-6 lg:grid-cols-12 lg:items-start">
          <input type="hidden" name="id" value={editingId} />
          <input type="hidden" name="tags" value={tags.join(",")} />

          {/* Left 8 columns: Post Composer */}
          <Card className="space-y-6 p-6 lg:col-span-8">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border pb-4">
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-felt" />
                <h2 className="font-display text-xl font-semibold text-ink">
                  {editingId ? "Edit Post" : "Create New Post"}
                </h2>
                {editingId && <Badge tone="gold">Editing</Badge>}
              </div>
              {editingId && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="text-xs font-semibold text-muted hover:text-ink"
                >
                  Cancel edit
                </button>
              )}
            </div>

            {state.error && (
              <div className="flex items-center gap-2 rounded-[4px] border border-danger-border bg-danger-soft px-3.5 py-2.5 text-xs font-medium text-danger">
                <CircleAlert className="h-4 w-4 shrink-0" />
                <span>{state.error}</span>
              </div>
            )}

            {state.ok && state.slug && (
              <div className="flex flex-wrap items-center justify-between gap-2 rounded-[4px] border border-felt/30 bg-felt/10 px-3.5 py-2.5 text-xs font-medium text-felt">
                <span className="inline-flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 shrink-0" />
                  Post {state.mode === "updated" ? "updated" : "published"} successfully!
                </span>
                <Link
                  href={`/posts/${state.slug}`}
                  target="_blank"
                  className="inline-flex items-center gap-1 font-semibold underline"
                >
                  Open /posts/{state.slug} <ExternalLink className="h-3 w-3" />
                </Link>
              </div>
            )}

            {/* Title & Slug */}
            <div className="grid gap-4 sm:grid-cols-12">
              <div className="sm:col-span-7">
                <Label htmlFor="post-title">Post Title (H1) *</Label>
                <Input
                  id="post-title"
                  name="title"
                  required
                  minLength={5}
                  maxLength={140}
                  value={title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  placeholder="e.g. Best 8 Ball Pool Legendary Cues Ranked for 2026"
                />
              </div>

              <div className="sm:col-span-5">
                <Label htmlFor="post-slug">URL Slug *</Label>
                <div className="flex items-center">
                  <span className="flex h-10 items-center rounded-l-[2px] border border-r-0 border-border bg-cream px-2.5 font-mono text-[11px] text-muted">
                    /posts/
                  </span>
                  <Input
                    id="post-slug"
                    name="slug"
                    value={slug}
                    onChange={(e) => {
                      setSlugTouched(true);
                      setSlug(slugifyPost(e.target.value));
                    }}
                    placeholder="best-legendary-cues-2026"
                    className="rounded-l-none font-mono text-xs"
                  />
                </div>
              </div>
            </div>

            {/* Category & Author */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label htmlFor="post-category">Category *</Label>
                <Select
                  id="post-category"
                  name="category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                >
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </Select>
              </div>
              <div>
                <Label htmlFor="post-author">Author Name (Schema &amp; Byline)</Label>
                <Input
                  id="post-author"
                  name="authorName"
                  value={authorName}
                  onChange={(e) => setAuthorName(e.target.value)}
                  placeholder="GlobalPool Editorial"
                />
              </div>
            </div>

            {/* Featured Cover Image Upload + Gallery + Alt Text */}
            <div className="space-y-3 rounded-[4px] border border-border bg-cream/40 p-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <Label htmlFor="post-cover" className="mb-0">
                  Featured Cover Image (OpenGraph &amp; Hero)
                </Label>
                <label className="inline-flex cursor-pointer items-center gap-1.5 rounded-[2px] border border-felt bg-felt px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-paper transition hover:bg-felt-deep">
                  {uploadingCover ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  ) : (
                    <Upload className="h-3.5 w-3.5" />
                  )}
                  {uploadingCover ? "Uploading..." : "Upload Image"}
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp,image/avif,image/gif"
                    className="hidden"
                    disabled={uploadingCover}
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) void uploadImageFile(file, "cover");
                      e.target.value = "";
                    }}
                  />
                </label>
              </div>

              {uploadError && (
                <p className="text-xs font-medium text-danger">{uploadError}</p>
              )}

              <div className="grid gap-4 sm:grid-cols-12">
                <div className="space-y-3 sm:col-span-7">
                  <div>
                    <Label htmlFor="post-cover" className="text-[11px] text-muted">
                      Image Path or URL
                    </Label>
                    <Input
                      id="post-cover"
                      name="coverImage"
                      value={coverImage}
                      onChange={(e) => setCoverImage(e.target.value)}
                      placeholder="/uploads/posts/... or /images/pool/logo-8ball.jpg"
                      className="font-mono text-xs"
                    />
                  </div>
                  <div>
                    <Label htmlFor="post-cover-alt" className="text-[11px] text-muted">
                      Image Alt Text (SEO Accessibility) *
                    </Label>
                    <Input
                      id="post-cover-alt"
                      name="coverAlt"
                      value={coverAlt}
                      onChange={(e) => setCoverAlt(e.target.value)}
                      placeholder="Descriptive alt text containing your focus keyword"
                    />
                  </div>
                </div>

                <div className="sm:col-span-5">
                  <div className="relative h-36 overflow-hidden rounded-[4px] border border-brass/35 bg-felt-deep">
                    {coverImage ? (
                      <img
                        src={coverImage}
                        alt={coverAlt || title || "Cover preview"}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-xs text-cream/60">
                        No image selected
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div>
                <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-muted">
                  Or pick from store media library:
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {GALLERY_PRESETS.map((img) => {
                    const active = coverImage === img.src;
                    return (
                      <button
                        key={img.src}
                        type="button"
                        onClick={() => {
                          setCoverImage(img.src);
                          if (!coverAlt) setCoverAlt(`8 Ball Pool — ${img.label}`);
                        }}
                        className={cn(
                          "cursor-pointer rounded-[2px] border px-2 py-1 text-[10px] font-medium transition",
                          active
                            ? "border-felt bg-felt text-paper"
                            : "border-border bg-paper text-ink hover:border-brass",
                        )}
                      >
                        {img.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Tags Input */}
            <div className="space-y-2.5">
              <Label htmlFor="post-tag-input">
                <span className="inline-flex items-center gap-1.5">
                  <Tag className="h-3.5 w-3.5 text-brass-dark" /> Post Tags (Keywords &amp; Filtering)
                </span>
              </Label>

              <div className="flex flex-wrap items-center gap-1.5">
                {tags.map((t) => (
                  <span
                    key={t}
                    className="inline-flex items-center gap-1 rounded-[2px] border border-brass/50 bg-accent-soft px-2.5 py-1 font-mono text-[11px] font-semibold text-ink"
                  >
                    #{t}
                    <button
                      type="button"
                      onClick={() => removeTag(t)}
                      aria-label={`Remove tag ${t}`}
                      className="cursor-pointer text-muted hover:text-danger"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
              </div>

              <div className="flex gap-2">
                <Input
                  id="post-tag-input"
                  value={tagDraft}
                  onChange={(e) => setTagDraft(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === ",") {
                      e.preventDefault();
                      addTagFromInput();
                    }
                  }}
                  placeholder="Type tag and press Enter (e.g. archangel cue)"
                />
                <Button type="button" variant="secondary" size="sm" onClick={() => addTagFromInput()}>
                  Add Tag
                </Button>
              </div>

              <div className="flex flex-wrap items-center gap-1.5">
                <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-muted">
                  Quick tags:
                </span>
                {SUGGESTED_TAGS.map((st) => (
                  <button
                    key={st}
                    type="button"
                    onClick={() => addTagFromInput(st)}
                    className="cursor-pointer rounded-[2px] border border-border bg-paper px-2 py-0.5 text-[10px] text-muted transition hover:border-brass hover:text-ink"
                  >
                    + {st}
                  </button>
                ))}
              </div>
            </div>

            {/* Excerpt */}
            <div>
              <Label htmlFor="post-excerpt">Short Excerpt / Summary *</Label>
              <Textarea
                id="post-excerpt"
                name="excerpt"
                required
                minLength={15}
                maxLength={320}
                rows={2}
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value)}
                placeholder="1–2 sentence summary displayed on the /posts cards and social previews."
              />
            </div>

            {/* Markdown Body with Toolbar & Live Preview */}
            <div className="space-y-2">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <Label htmlFor="post-body" className="mb-0">
                  Post Content (Markdown) * ·{" "}
                  <span className="font-mono font-normal text-muted">
                    {seo.wordCount} words · ~{seo.readMinutes} min read
                  </span>
                </Label>
                <div className="flex items-center gap-1 rounded-[2px] border border-border bg-cream p-0.5">
                  <button
                    type="button"
                    onClick={() => setEditorTab("write")}
                    className={cn(
                      "cursor-pointer rounded-[2px] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em]",
                      editorTab === "write" ? "bg-felt text-paper" : "text-muted hover:text-ink",
                    )}
                  >
                    Write
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditorTab("preview")}
                    className={cn(
                      "inline-flex cursor-pointer items-center gap-1 rounded-[2px] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em]",
                      editorTab === "preview" ? "bg-felt text-paper" : "text-muted hover:text-ink",
                    )}
                  >
                    <Eye className="h-3 w-3" /> Preview
                  </button>
                </div>
              </div>

              {editorTab === "write" ? (
                <>
                  <div className="flex flex-wrap items-center gap-1.5 rounded-t-[2px] border border-b-0 border-border bg-cream/70 px-2.5 py-1.5">
                    {[
                      { label: "H2", snippet: "\n\n## Section Heading\n" },
                      { label: "H3", snippet: "\n\n### Subheading\n" },
                      { label: "Bold", snippet: "**bold text**" },
                      { label: "Quote", snippet: "\n\n> Pro tip callout\n" },
                      { label: "List", snippet: "\n\n- First item\n- Second item\n" },
                      { label: "Link", snippet: "[8 Ball Pool Coins](/store/coins-cash)" },
                    ].map((tool) => (
                      <button
                        key={tool.label}
                        type="button"
                        onClick={() => insertMarkdown(tool.snippet)}
                        className="cursor-pointer rounded-[2px] border border-border bg-paper px-2 py-0.5 font-mono text-[10px] font-semibold text-ink hover:border-brass"
                      >
                        {tool.label}
                      </button>
                    ))}
                    <label className="ml-auto inline-flex cursor-pointer items-center gap-1 rounded-[2px] border border-brass/50 bg-accent-soft px-2 py-0.5 text-[10px] font-semibold text-brass-dark hover:border-brass">
                      {uploadingInline ? (
                        <Loader2 className="h-3 w-3 animate-spin" />
                      ) : (
                        <ImagePlus className="h-3 w-3" />
                      )}
                      Insert Image
                      <input
                        type="file"
                        accept="image/jpeg,image/png,image/webp,image/avif,image/gif"
                        className="hidden"
                        disabled={uploadingInline}
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) void uploadImageFile(file, "inline");
                          e.target.value = "";
                        }}
                      />
                    </label>
                  </div>

                  <Textarea
                    ref={bodyRef}
                    id="post-body"
                    name="body"
                    required
                    minLength={40}
                    rows={14}
                    value={body}
                    onChange={(e) => setBody(e.target.value)}
                    placeholder={`Write your full guide using Markdown...\n\n## Why this matters\nExplain the key tip clearly.\n\n- Bullet points\n- Internal links like [Store](/store/coins-cash)`}
                    className="rounded-t-none font-mono text-xs leading-relaxed"
                  />
                </>
              ) : (
                <>
                  <input type="hidden" name="body" value={body} />
                  <div className="min-h-[320px] rounded-[4px] border border-border bg-paper p-5">
                    {body.trim() ? (
                      <Markdown body={body} />
                    ) : (
                      <p className="text-sm text-muted">Start writing Markdown to preview formatted content.</p>
                    )}
                  </div>
                </>
              )}
            </div>

            {/* Publish Controls */}
            <div className="flex flex-wrap items-center justify-between gap-4 border-t border-border pt-4">
              <div className="flex flex-wrap items-center gap-5 text-xs font-medium text-ink">
                <label className="inline-flex cursor-pointer items-center gap-2">
                  <input
                    type="checkbox"
                    name="published"
                    checked={published}
                    onChange={(e) => setPublished(e.target.checked)}
                    className="h-4 w-4 accent-felt"
                  />
                  Publish immediately
                </label>
                <label className="inline-flex cursor-pointer items-center gap-2">
                  <input
                    type="checkbox"
                    name="featured"
                    checked={featured}
                    onChange={(e) => setFeatured(e.target.checked)}
                    className="h-4 w-4 accent-felt"
                  />
                  Pin as Featured
                </label>
                <label className="inline-flex cursor-pointer items-center gap-2 text-muted">
                  <input
                    type="checkbox"
                    name="noIndex"
                    checked={noIndex}
                    onChange={(e) => setNoIndex(e.target.checked)}
                    className="h-4 w-4 accent-felt"
                  />
                  noindex (hide from Google)
                </label>
              </div>

              <Button type="submit" disabled={pending}>
                {pending
                  ? "Saving..."
                  : editingId
                    ? "UPDATE POST"
                    : published
                      ? "PUBLISH POST"
                      : "SAVE DRAFT"}
              </Button>
            </div>
          </Card>

          {/* Right 4 columns: SEO Optimization Panel & SERP Preview */}
          <div className="space-y-5 lg:sticky lg:top-20 lg:col-span-4">
            {/* SEO Score Card */}
            <Card className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-brass-dark">
                    ON-PAGE SEO SCORE
                  </p>
                  <p className="mt-0.5 font-display text-3xl font-semibold text-ink">
                    {seo.score}
                    <span className="text-sm font-normal text-muted"> / 100</span>
                  </p>
                </div>
                <Badge tone={seo.score >= 80 ? "green" : seo.score >= 50 ? "gold" : "red"}>
                  <Sparkles className="h-3 w-3" />
                  {seo.score >= 80 ? "SEO Ready" : seo.score >= 50 ? "Needs Polish" : "Incomplete"}
                </Badge>
              </div>

              <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-cream">
                <div
                  className={cn(
                    "h-full transition-all duration-300",
                    seo.score >= 80 ? "bg-felt" : seo.score >= 50 ? "bg-brass" : "bg-danger",
                  )}
                  style={{ width: `${seo.score}%` }}
                />
              </div>

              <ul className="mt-4 space-y-2 text-xs">
                {seo.checks.map((c) => (
                  <li key={c.id} className="flex items-start gap-2">
                    <span
                      className={cn(
                        "mt-0.5 h-3.5 w-3.5 shrink-0 rounded-full",
                        c.passed ? "text-felt" : "text-muted/60",
                      )}
                    >
                      {c.passed ? (
                        <CheckCircle2 className="h-3.5 w-3.5 text-felt" />
                      ) : (
                        <CircleAlert className="h-3.5 w-3.5 text-brass-dark" />
                      )}
                    </span>
                    <div>
                      <p className={cn("font-medium", c.passed ? "text-ink" : "text-muted")}>
                        {c.label}
                      </p>
                      <p className="text-[11px] text-muted">{c.hint}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </Card>

            {/* SEO Meta Inputs */}
            <Card className="space-y-4 p-5">
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-brass-dark">
                SEO METADATA
              </p>

              <div>
                <Label htmlFor="seo-keyword">Focus Keyword</Label>
                <Input
                  id="seo-keyword"
                  name="focusKeyword"
                  value={focusKeyword}
                  onChange={(e) => setFocusKeyword(e.target.value)}
                  placeholder="e.g. 8 ball pool legendary cues"
                />
              </div>

              <div>
                <div className="mb-1 flex items-center justify-between">
                  <Label htmlFor="seo-title" className="mb-0">
                    SEO Meta Title
                  </Label>
                  <span className="font-mono text-[10px] text-muted">
                    {(metaTitle || title).length} / 60
                  </span>
                </div>
                <Input
                  id="seo-title"
                  name="metaTitle"
                  maxLength={90}
                  value={metaTitle}
                  onChange={(e) => setMetaTitle(e.target.value)}
                  placeholder="Defaults to Post Title if left blank"
                />
              </div>

              <div>
                <div className="mb-1 flex items-center justify-between">
                  <Label htmlFor="seo-desc" className="mb-0">
                    SEO Meta Description
                  </Label>
                  <span className="font-mono text-[10px] text-muted">
                    {(metaDesc || excerpt).length} / 160
                  </span>
                </div>
                <Textarea
                  id="seo-desc"
                  name="metaDesc"
                  maxLength={220}
                  rows={3}
                  value={metaDesc}
                  onChange={(e) => setMetaDesc(e.target.value)}
                  placeholder="Defaults to Excerpt if left blank (aim for 120–160 chars)"
                />
              </div>

              <div>
                <Label htmlFor="seo-canonical">Canonical URL (Optional)</Label>
                <Input
                  id="seo-canonical"
                  name="canonicalUrl"
                  value={canonicalUrl}
                  onChange={(e) => setCanonicalUrl(e.target.value)}
                  placeholder={`/posts/${derivedSlug || "your-post-slug"}`}
                  className="font-mono text-xs"
                />
              </div>
            </Card>

            {/* Google SERP Preview */}
            <Card className="p-5">
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-brass-dark">
                GOOGLE SEARCH PREVIEW
              </p>
              <div className="mt-3 rounded-[4px] border border-border bg-white p-3.5 text-left">
                <p className="truncate text-[11px] text-[#202124]">
                  {cleanHost} › posts › {derivedSlug || "post-slug"}
                </p>
                <p className="mt-0.5 line-clamp-2 text-[15px] font-medium leading-snug text-[#1a0dab]">
                  {serpTitle}
                </p>
                <p className="mt-1 line-clamp-3 text-xs leading-relaxed text-[#4d5156]">
                  {serpDesc}
                </p>
              </div>
            </Card>
          </div>
        </form>
      </div>

      {/* Existing Posts Management List */}
      <Card className="overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border bg-cream/40 px-5 py-4">
          <div className="flex flex-wrap items-center gap-2">
            {(["all", "published", "drafts"] as const).map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setListFilter(tab)}
                className={cn(
                  "cursor-pointer rounded-[2px] border px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] transition",
                  listFilter === tab
                    ? "border-felt bg-felt text-paper"
                    : "border-border bg-paper text-ink hover:border-brass",
                )}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="pointer-events-none absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted" />
            <Input
              value={listSearch}
              onChange={(e) => setListSearch(e.target.value)}
              placeholder="Filter posts or tags..."
              className="h-8 pl-8 text-xs"
            />
          </div>
        </div>

        <div className="divide-y divide-border">
          {filteredPosts.length === 0 ? (
            <div className="p-8 text-center text-sm text-muted">No posts match this filter.</div>
          ) : (
            filteredPosts.map((p) => {
              const rowSeo = evaluatePostSeo({
                title: p.title,
                slug: p.slug,
                excerpt: p.excerpt,
                body: p.body,
                coverImage: p.coverImage,
                coverAlt: p.coverAlt,
                tags: p.tags,
                metaTitle: p.metaTitle,
                metaDesc: p.metaDesc,
                focusKeyword: p.focusKeyword,
              });
              return (
                <div
                  key={p.id}
                  className="flex flex-wrap items-center justify-between gap-4 px-5 py-4 hover:bg-cream/30"
                >
                  <div className="flex min-w-0 flex-1 items-center gap-3.5">
                    <div className="h-14 w-20 shrink-0 overflow-hidden rounded-[4px] border border-border bg-felt-deep">
                      {p.coverImage ? (
                        <img
                          src={p.coverImage}
                          alt={p.coverAlt || p.title}
                          className="h-full w-full object-cover"
                        />
                      ) : null}
                    </div>
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-1.5">
                        <Badge tone={p.published ? "green" : "gray"}>
                          {p.published ? "Published" : "Draft"}
                        </Badge>
                        <Badge tone="gold">{p.category}</Badge>
                        <Badge tone={rowSeo.score >= 80 ? "green" : "gold"}>
                          SEO {rowSeo.score}%
                        </Badge>
                        {p.featured && (
                          <span className="inline-flex items-center gap-0.5 text-[10px] font-semibold text-brass-dark">
                            <Star className="h-3 w-3 fill-brass text-brass" /> Featured
                          </span>
                        )}
                      </div>
                      <h3 className="mt-1 truncate font-display text-base font-semibold text-ink">
                        {p.title}
                      </h3>
                      <div className="mt-0.5 flex flex-wrap items-center gap-2 text-[11px] text-muted">
                        <span className="font-mono">/posts/{p.slug}</span>
                        <span>· {p.readMinutes} min</span>
                        {p.tags.length > 0 && (
                          <span className="truncate">
                            · {p.tags.map((t) => `#${t}`).join(" ")}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    {p.published && (
                      <Link
                        href={`/posts/${p.slug}`}
                        target="_blank"
                        className="inline-flex h-8 items-center gap-1 rounded-[2px] border border-border bg-paper px-2.5 text-[11px] font-semibold text-ink hover:border-brass"
                      >
                        <ExternalLink className="h-3 w-3" /> View
                      </Link>
                    )}

                    <Button
                      type="button"
                      variant="secondary"
                      size="sm"
                      onClick={() => loadPostForEdit(p)}
                    >
                      <Pencil className="h-3 w-3" /> Edit
                    </Button>

                    <form action={togglePostPublishedAction}>
                      <input type="hidden" name="id" value={p.id} />
                      <input type="hidden" name="published" value={String(!p.published)} />
                      <Button type="submit" variant="secondary" size="sm">
                        {p.published ? "Unpublish" : "Publish"}
                      </Button>
                    </form>

                    <form
                      action={deletePostAction}
                      onSubmit={(e) => {
                        if (!window.confirm(`Delete "${p.title}" permanently?`)) {
                          e.preventDefault();
                        }
                      }}
                    >
                      <input type="hidden" name="id" value={p.id} />
                      <Button
                        type="submit"
                        variant="secondary"
                        size="sm"
                        className="border-danger-border text-danger hover:bg-danger-soft"
                        aria-label={`Delete ${p.title}`}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </form>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </Card>
    </div>
  );
}
