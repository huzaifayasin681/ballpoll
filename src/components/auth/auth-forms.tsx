"use client";

import { useActionState } from "react";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import { loginAction, registerAction, type AuthState } from "@/app/actions/auth";
import { Button, buttonClass } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/primitives";

function GoogleButton({ next }: { next: string }) {
  return (
    <a href={`/api/auth/google?next=${encodeURIComponent(next)}`} className={buttonClass("secondary", "lg", "w-full")}>
      <svg className="h-5 w-5" viewBox="0 0 48 48" aria-hidden>
        <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.4-.4-3.5z" />
        <path fill="#FF3D00" d="m6.3 14.7 6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z" />
        <path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.1 26.7 36 24 36c-5.2 0-9.6-3.3-11.3-8l-6.5 5C9.5 39.6 16.2 44 24 44z" />
        <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.2-4.1 5.6l6.2 5.2C37 39.2 44 34 44 24c0-1.3-.1-2.4-.4-3.5z" />
      </svg>
      Continue with Google
    </a>
  );
}

function Divider() {
  return (
    <div className="my-6 flex items-center gap-3 text-xs text-muted">
      <span className="h-px flex-1 bg-border" /> or <span className="h-px flex-1 bg-border" />
    </div>
  );
}

export function LoginForm({ next, error: initialError }: { next: string; error?: string }) {
  const [state, action, pending] = useActionState<AuthState, FormData>(loginAction, initialError ? { error: initialError } : undefined);
  return (
    <>
      <GoogleButton next={next} />
      <Divider />
      <form action={action} className="space-y-4">
        <input type="hidden" name="next" value={next} />
        <div>
          <Label htmlFor="email">Email</Label>
          <Input id="email" name="email" type="email" autoComplete="email" required placeholder="you@example.com" />
        </div>
        <div>
          <Label htmlFor="password">Password</Label>
          <Input id="password" name="password" type="password" autoComplete="current-password" required />
        </div>
        {state?.error && <p className="rounded-lg bg-danger-soft px-3 py-2 text-sm text-danger">{state.error}</p>}
        <Button type="submit" size="lg" className="w-full" disabled={pending}>
          {pending && <Loader2 className="h-4 w-4 animate-spin" />} Sign in
        </Button>
      </form>
      <p className="mt-6 text-center text-sm text-muted">
        New here?{" "}
        <Link href={`/register?next=${encodeURIComponent(next)}`} className="font-medium text-brand hover:underline">
          Create an account
        </Link>{" "}
        ·{" "}
        <Link href="/cart" className="font-medium text-brand hover:underline">
          Checkout as guest
        </Link>
      </p>
    </>
  );
}

export function RegisterForm({ next, refCode }: { next: string; refCode?: string }) {
  const [state, action, pending] = useActionState<AuthState, FormData>(registerAction, undefined);
  return (
    <>
      <GoogleButton next={next} />
      <Divider />
      <form action={action} className="space-y-4">
        <input type="hidden" name="next" value={next} />
        <div>
          <Label htmlFor="name">Name</Label>
          <Input id="name" name="name" required autoComplete="name" placeholder="Your name" />
        </div>
        <div>
          <Label htmlFor="email">Email</Label>
          <Input id="email" name="email" type="email" required autoComplete="email" placeholder="you@example.com" />
        </div>
        <div>
          <Label htmlFor="password">Password</Label>
          <Input id="password" name="password" type="password" required minLength={8} autoComplete="new-password" placeholder="At least 8 characters" />
        </div>
        <div>
          <Label htmlFor="ref">Referral code (optional)</Label>
          <Input id="ref" name="ref" defaultValue={refCode} placeholder="e.g. AHMED2026" />
        </div>
        {state?.error && <p className="rounded-lg bg-danger-soft px-3 py-2 text-sm text-danger">{state.error}</p>}
        <Button type="submit" size="lg" className="w-full" disabled={pending}>
          {pending && <Loader2 className="h-4 w-4 animate-spin" />} Create account
        </Button>
      </form>
      <p className="mt-6 text-center text-sm text-muted">
        Already have an account?{" "}
        <Link href={`/login?next=${encodeURIComponent(next)}`} className="font-medium text-brand hover:underline">
          Sign in
        </Link>
      </p>
    </>
  );
}
