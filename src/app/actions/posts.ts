"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import { z } from "zod";
import { db } from "@/lib/db";
import { requireRole } from "@/lib/auth";
import { estimateReadMinutes, parseTags, slugifyPost } from "@/lib/post-seo";

export type PostActionState = {
  ok?: boolean;
  error?: string;
  postId?: string;
  slug?: string;
  mode?: "created" | "updated";
};

const optionalUrlOrPath = z
  .string()
  .trim()
  .max(500)
  .optional()
  .refine(
    (v) => !v || v.startsWith("/") || v.startsWith("https://") || v.startsWith("http://"),
    "Must be a valid relative path (/images/...) or http(s) URL.",
  );

const postSchema = z.object({
  id: z.string().trim().optional(),
  title: z.string().trim().min(5, "Title must be at least 5 characters.").max(140),
  slug: z.string().trim().max(110).optional(),
  excerpt: z.string().trim().min(15, "Excerpt must be at least 15 characters.").max(320),
  body: z.string().trim().min(40, "Post body must be at least 40 characters.").max(50000),
  category: z.string().trim().min(2).max(40),
  coverImage: optionalUrlOrPath,
  coverAlt: z.string().trim().max(180).optional(),
  tags: z.string().max(400).optional(),
  authorName: z.string().trim().min(2).max(80).optional(),
  metaTitle: z.string().trim().max(90).optional(),
  metaDesc: z.string().trim().max(220).optional(),
  focusKeyword: z.string().trim().max(80).optional(),
  canonicalUrl: optionalUrlOrPath,
  noIndex: z.boolean().optional(),
  featured: z.boolean().optional(),
  published: z.boolean().optional(),
});

function revalidatePostPaths(slug?: string) {
  revalidateTag("catalog", "max");
  revalidatePath("/admin/posts");
  revalidatePath("/posts");
  revalidatePath("/blog");
  revalidatePath("/sitemap.xml");
  if (slug) {
    revalidatePath(`/posts/${slug}`);
    revalidatePath(`/blog/${slug}`);
  }
}

export async function savePostAction(
  _prev: PostActionState,
  form: FormData,
): Promise<PostActionState> {
  const actor = await requireRole(["ADMIN"]);

  const parsed = postSchema.safeParse({
    id: String(form.get("id") ?? "").trim() || undefined,
    title: String(form.get("title") ?? ""),
    slug: String(form.get("slug") ?? ""),
    excerpt: String(form.get("excerpt") ?? ""),
    body: String(form.get("body") ?? ""),
    category: String(form.get("category") ?? "Guides"),
    coverImage: String(form.get("coverImage") ?? "").trim() || undefined,
    coverAlt: String(form.get("coverAlt") ?? "").trim() || undefined,
    tags: String(form.get("tags") ?? ""),
    authorName: String(form.get("authorName") ?? "").trim() || "GlobalPool Editorial",
    metaTitle: String(form.get("metaTitle") ?? "").trim() || undefined,
    metaDesc: String(form.get("metaDesc") ?? "").trim() || undefined,
    focusKeyword: String(form.get("focusKeyword") ?? "").trim() || undefined,
    canonicalUrl: String(form.get("canonicalUrl") ?? "").trim() || undefined,
    noIndex: form.get("noIndex") === "on",
    featured: form.get("featured") === "on",
    published: form.get("published") === "on",
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Please review the highlighted post fields." };
  }

  const d = parsed.data;
  const baseSlug = slugifyPost(d.slug || d.title);
  if (!baseSlug) {
    return { error: "Could not derive a valid URL slug from the title." };
  }

  const normalizedBody = d.body.replace(/\r\n?/g, "\n");
  const tags = parseTags(d.tags ?? "");
  const readMinutes = estimateReadMinutes(normalizedBody);

  // Check slug collision against other posts
  const existingBySlug = await db.blogPost.findUnique({ where: { slug: baseSlug } });
  if (existingBySlug && existingBySlug.id !== d.id) {
    return { error: `The URL slug "${baseSlug}" is already used by another post. Choose a different slug.` };
  }

  const data = {
    slug: baseSlug,
    title: d.title,
    excerpt: d.excerpt,
    body: normalizedBody,
    category: d.category,
    coverImage: d.coverImage ?? null,
    coverAlt: d.coverAlt || d.title,
    tags,
    authorName: d.authorName || actor.name || "GlobalPool Editorial",
    metaTitle: d.metaTitle ?? null,
    metaDesc: d.metaDesc ?? null,
    focusKeyword: d.focusKeyword ?? null,
    canonicalUrl: d.canonicalUrl ?? null,
    noIndex: Boolean(d.noIndex),
    featured: Boolean(d.featured),
    published: Boolean(d.published),
    readMinutes,
  };

  if (d.id) {
    const previous = await db.blogPost.findUnique({ where: { id: d.id } });
    if (!previous) return { error: "Post no longer exists." };

    const updated = await db.blogPost.update({
      where: { id: d.id },
      data,
    });
    await db.auditLog.create({
      data: { actorId: actor.id, action: "post.update", target: updated.slug },
    });
    revalidatePostPaths(previous.slug);
    revalidatePostPaths(updated.slug);
    return { ok: true, postId: updated.id, slug: updated.slug, mode: "updated" };
  }

  const created = await db.blogPost.create({
    data: {
      ...data,
      publishedAt: new Date(),
    },
  });
  await db.auditLog.create({
    data: { actorId: actor.id, action: "post.create", target: created.slug },
  });
  revalidatePostPaths(created.slug);
  return { ok: true, postId: created.id, slug: created.slug, mode: "created" };
}

export async function togglePostPublishedAction(form: FormData) {
  const actor = await requireRole(["ADMIN"]);
  const id = String(form.get("id") ?? "");
  const published = form.get("published") === "true";
  if (!id) return;

  const updated = await db.blogPost.update({
    where: { id },
    data: { published },
  });
  await db.auditLog.create({
    data: { actorId: actor.id, action: `post.${published ? "publish" : "unpublish"}`, target: updated.slug },
  });
  revalidatePostPaths(updated.slug);
}

export async function deletePostAction(form: FormData) {
  const actor = await requireRole(["ADMIN"]);
  const id = String(form.get("id") ?? "");
  if (!id) return;

  const existing = await db.blogPost.findUnique({ where: { id } });
  if (!existing) return;

  await db.blogPost.delete({ where: { id } });
  await db.auditLog.create({
    data: { actorId: actor.id, action: "post.delete", target: existing.slug },
  });
  revalidatePostPaths(existing.slug);
}
