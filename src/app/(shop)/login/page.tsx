import { Suspense } from "react";
import { LoginForm } from "@/components/auth/auth-forms";
import { Container, PageFallback } from "@/components/ui/primitives";
import { ClubhousePageHero } from "@/components/clubhouse/page-hero";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Sign in", robots: { index: false } };

async function LoginInner({
  searchParams,
}: {
  searchParams: Promise<{ next?: string; error?: string }>;
}) {
  const sp = await searchParams;
  const next = sp.next && sp.next.startsWith("/") ? sp.next : "/dashboard";
  return (
    <div className="bg-cream pb-16">
      <ClubhousePageHero
        crumbs={[{ label: "Home", href: "/" }, { label: "Sign in" }]}
        eyebrow="MEMBER ACCESS"
        title="Sign in to your account"
        subtitle="Track live orders, saved Miniclip Unique IDs, and Clubhouse reward points."
      />
      <Container className="mt-10 max-w-md">
        <LoginForm next={next} error={sp.error} />
      </Container>
    </div>
  );
}

export default function LoginPage(props: PageProps<"/login">) {
  return (
    <Suspense fallback={<PageFallback />}>
      <LoginInner searchParams={props.searchParams} />
    </Suspense>
  );
}
