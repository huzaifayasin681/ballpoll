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
  if (category === "cues-unlocks") {
    return {
      title: { absolute: "Unlock Maxed Legendary Cues | 8 Ball Pool Cue Shop" },
      description:
        "Max Out Stats (Force, Aim, Spin, Time) with Coin-Back Guarantee. Starter Cue Box (3 Boxes), Ultimate Collector Pack (All 20 Legendary Cues), Max Level 5 Upgrade, or Custom Cue Request.",
      openGraph: {
        title: "Unlock Maxed Legendary Cues | 8 Ball Pool Cue Shop",
        description: "Max Out Stats (Force, Aim, Spin, Time) with Coin-Back Guarantee.",
        images: ["/images/pool/legendary-cues-maxed.jpg"],
      },
      alternates: { canonical: `/store/${cat.slug}` },
    };
  }
  if (category === "boosting") {
    return {
      title: { absolute: "8 Ball Pool Account Leveling & Berlin/Venice Ring Grinding" },
      description:
        "Hand-Played by Global Pro Players — Zero Risk, 100% Secure. Berlin, Rome & Mumbai Ring Grinding, Venice Pro Table Ring + Leaderboard Topping, Level 1 to 150+ Progression, and Ready-Made Pro Accounts.",
      openGraph: {
        title: "8 Ball Pool Account Leveling & Berlin/Venice Ring Grinding",
        description: "Hand-Played by Global Pro Players — Zero Risk, 100% Secure.",
        images: ["/images/pool/pro-account-boosting.jpg"],
      },
      alternates: { canonical: `/store/${cat.slug}` },
    };
  }
  if (category === "vip-access") {
    return {
      title: { absolute: "8 Ball Pool Pro Aim Assist & Extended Guideline Tools" },
      description:
        "Dominate Every Match with Precision Cushion Shot Predictions & Auto-Play. Weekly Pass (7 Days Key), Monthly VIP Key (30 Days + Cushion Line Prediction), and Ultimate Season Pass (Anti-Ban Update + 24/7 Support).",
      openGraph: {
        title: "8 Ball Pool Pro Aim Assist & Extended Guideline Tools",
        description: "Dominate Every Match with Precision Cushion Shot Predictions & Auto-Play.",
        images: ["/images/pool/gameplay-assist-tools.jpg"],
      },
      alternates: { canonical: `/store/${cat.slug}` },
    };
  }
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
