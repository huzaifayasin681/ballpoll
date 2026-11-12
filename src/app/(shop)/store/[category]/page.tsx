import { Suspense } from "react";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { PageFallback } from "@/components/ui/primitives";
import { getCategories } from "@/lib/catalog";
import { StoreView } from "../page";

export async function generateMetadata({ params }: PageProps<"/store/[category]">): Promise<Metadata> {
  const { category } = await params;
  const cats = await getCategories();
  const cat = cats.find((c) => c.slug === category);
  if (!cat) return { title: "Category" };
  return { title: cat.name, description: cat.description, alternates: { canonical: `/store/${cat.slug}` } };
}

async function CategoryBody({ params, searchParams }: PageProps<"/store/[category]">) {
  const { category } = await params;
  const cats = await getCategories();
  if (!cats.some((c) => c.slug === category)) notFound();
  return <StoreView categorySlug={category} searchParams={await searchParams} />;
}

export default function CategoryPage(props: PageProps<"/store/[category]">) {
  return (
    <Suspense fallback={<PageFallback />}>
      <CategoryBody {...props} />
    </Suspense>
  );
}
