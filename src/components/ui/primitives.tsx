import { cn } from "@/lib/utils";
import type { ComponentProps } from "react";

export function Card({ className, ...p }: ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "rounded-xl border border-border bg-surface shadow-2xs transition-all duration-200",
        className,
      )}
      {...p}
    />
  );
}

export function Badge({
  className,
  tone = "green",
  ...p
}: ComponentProps<"span"> & { tone?: "green" | "gold" | "gray" | "red" | "blue" | "violet" }) {
  const tones = {
    green: "bg-brand-soft text-brand border-brand-border",
    gold: "bg-accent-soft text-accent border-accent-border",
    gray: "bg-surface-2 text-muted border-border",
    red: "bg-danger-soft text-danger border-danger-border",
    blue: "bg-surface-2 text-foreground border-border",
    violet: "bg-surface-2 text-foreground border-border",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-md border px-2 py-0.5 text-[11px] font-semibold leading-4 tracking-tight",
        tones[tone],
        className,
      )}
      {...p}
    />
  );
}

export function Input({ className, ...p }: ComponentProps<"input">) {
  return (
    <input
      className={cn(
        "h-10 w-full rounded-lg border border-border bg-surface px-3.5 text-sm text-foreground placeholder:text-muted/70 outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/15",
        className,
      )}
      {...p}
    />
  );
}

export function Textarea({ className, ...p }: ComponentProps<"textarea">) {
  return (
    <textarea
      className={cn(
        "w-full rounded-lg border border-border bg-surface px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted/70 outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/15",
        className,
      )}
      {...p}
    />
  );
}

export function Select({ className, ...p }: ComponentProps<"select">) {
  return (
    <select
      className={cn(
        "h-10 w-full rounded-lg border border-border bg-surface px-3 text-sm text-foreground outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/15",
        className,
      )}
      {...p}
    />
  );
}

export function Label({ className, ...p }: ComponentProps<"label">) {
  return <label className={cn("mb-1.5 block text-xs font-semibold text-foreground", className)} {...p} />;
}

export function Skeleton({ className }: { className?: string }) {
  return <div className={cn("animate-pulse rounded-xl bg-surface-2", className)} />;
}

export function PageFallback() {
  return (
    <Container className="py-10">
      <Skeleton className="h-7 w-48" />
      <Skeleton className="mt-2 h-4 w-72 max-w-full" />
      <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <Skeleton className="h-64" />
        <Skeleton className="h-64" />
        <Skeleton className="h-64" />
        <Skeleton className="h-64" />
      </div>
    </Container>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  className,
  align = "left",
}: {
  eyebrow?: string;
  title: React.ReactNode;
  subtitle?: string;
  className?: string;
  align?: "left" | "center";
}) {
  return (
    <div className={cn(align === "center" && "mx-auto max-w-2xl text-center", className)}>
      {eyebrow && (
        <span className="mb-1.5 inline-flex items-center gap-1.5 rounded-full border border-brand-border bg-brand-soft px-2.5 py-0.5 font-mono text-[10px] font-bold uppercase tracking-widest text-brand">
          <span className="h-1.5 w-1.5 rounded-full bg-brand" />
          {eyebrow}
        </span>
      )}
      <h2 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">{title}</h2>
      {subtitle && <p className="mt-1 text-xs sm:text-sm text-muted">{subtitle}</p>}
    </div>
  );
}

export function Container({ className, ...p }: ComponentProps<"div">) {
  return <div className={cn("mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8", className)} {...p} />;
}

export function Stars({ rating, className }: { rating: number; className?: string }) {
  return (
    <span className={cn("text-[#e5a024] tracking-tight", className)} aria-label={`${rating} out of 5 stars`}>
      {"★★★★★".slice(0, Math.round(rating))}
      <span className="text-border">{"★★★★★".slice(Math.round(rating))}</span>
    </span>
  );
}
