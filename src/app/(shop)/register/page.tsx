import { Suspense } from "react";
import { RegisterForm } from "@/components/auth/auth-forms";
import { Container, PageFallback } from "@/components/ui/primitives";
import { ClubhousePageHero } from "@/components/clubhouse/page-hero";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Create account", robots: { index: false } };

async function RegisterInner({
  searchParams,
}: {
  searchParams: Promise<{ next?: string; ref?: string }>;
}) {
  const sp = await searchParams;
  const next = sp.next && sp.next.startsWith("/") ? sp.next : "/dashboard";
  return (
    <div className="bg-cream pb-16">
      <ClubhousePageHero
        crumbs={[{ label: "Home", href: "/" }, { label: "Create account" }]}
        eyebrow="JOIN THE CLUBHOUSE"
        title="Create your account"
        subtitle="Earn Clubhouse points on every purchase, track orders live, and save Unique IDs."
      />
      <Container className="mt-10 max-w-md">
        <RegisterForm next={next} refCode={sp.ref} />
      </Container>
    </div>
  );
}

export default function RegisterPage(props: PageProps<"/register">) {
  return (
    <Suspense fallback={<PageFallback />}>
      <RegisterInner searchParams={props.searchParams} />
    </Suspense>
  );
}
