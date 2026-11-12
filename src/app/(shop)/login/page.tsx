import { Suspense } from "react";
import type { Metadata } from "next";
import { Card, Container, PageFallback } from "@/components/ui/primitives";
import { LoginForm } from "@/components/auth/auth-forms";

export const metadata: Metadata = { title: "Sign in", robots: { index: false } };

const errors: Record<string, string> = {
  google: "Google sign-in failed. Please try again.",
  google_disabled: "Google sign-in isn't configured yet. Please use email and password.",
};

async function LoginBody({ searchParams }: PageProps<"/login">) {
  const sp = await searchParams;
  const next = typeof sp.next === "string" ? sp.next : "/dashboard";
  const err = typeof sp.error === "string" ? errors[sp.error] : undefined;
  return (
    <Container className="flex justify-center py-16">
      <Card className="w-full max-w-md p-8">
        <h1 className="font-display text-2xl font-bold text-foreground">Welcome back</h1>
        <p className="mb-6 mt-1 text-sm text-muted">Sign in to track orders, earn points and check out faster.</p>
        <LoginForm next={next} error={err} />
      </Card>
    </Container>
  );
}

export default function LoginPage(props: PageProps<"/login">) {
  return (
    <Suspense fallback={<PageFallback />}>
      <LoginBody {...props} />
    </Suspense>
  );
}
