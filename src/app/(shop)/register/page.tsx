import { Suspense } from "react";
import type { Metadata } from "next";
import { cookies } from "next/headers";
import { Card, Container, PageFallback } from "@/components/ui/primitives";
import { RegisterForm } from "@/components/auth/auth-forms";

export const metadata: Metadata = { title: "Create account", robots: { index: false } };

async function RegisterBody({ searchParams }: PageProps<"/register">) {
  const sp = await searchParams;
  const next = typeof sp.next === "string" ? sp.next : "/dashboard";
  const ref = typeof sp.ref === "string" ? sp.ref : (await cookies()).get("gps_ref")?.value;
  return (
    <Container className="flex justify-center py-16">
      <Card className="w-full max-w-md p-8">
        <h1 className="font-display text-2xl font-bold text-foreground">Create your account</h1>
        <p className="mb-6 mt-1 text-sm text-muted">Earn loyalty points on every order and unlock VIP tiers.</p>
        <RegisterForm next={next} refCode={ref} />
      </Card>
    </Container>
  );
}

export default function RegisterPage(props: PageProps<"/register">) {
  return (
    <Suspense fallback={<PageFallback />}>
      <RegisterBody {...props} />
    </Suspense>
  );
}
