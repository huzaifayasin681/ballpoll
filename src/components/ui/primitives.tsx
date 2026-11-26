import { cn } from "@/lib/utils";
import type { ComponentProps } from "react";

export function Card({ className, ...p }: ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "rounded-[6px] border border-border bg-paper transition-colors duration-200",
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
}: ComponentProps<"span"> & { tone?: "green" | "gold" | "gray" | "red" | "blue" | "violet" | "felt" }) {
  const tones = {
    green: "bg-felt text-paper border-felt",
    felt: "bg-felt text-paper border-felt",
    gold: "bg-accent-soft text-brass-dark border-brass/50",
    gray: "bg-cream text-muted border-border",
    red: "bg-danger-soft text-danger border-danger-border",
    blue: "bg-cream text-ink border-border",
    violet: "bg-cream text-ink border-border",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-[2px] border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.2em] leading-4",
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
        "h-10 w-full rounded-[2px] border border-border bg-cream/60 px-3.5 text-sm text-ink placeholder:text-muted/70 outline-none transition focus:border-felt focus:bg-paper focus:ring-1 focus:ring-felt/25",
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
        "w-full rounded-[2px] border border-border bg-cream/60 px-3.5 py-2.5 text-sm text-ink placeholder:text-muted/70 outline-none transition focus:border-felt focus:bg-paper focus:ring-1 focus:ring-felt/25",
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
        "h-10 w-full rounded-[2px] border border-border bg-paper px-3 text-sm text-ink outline-none transition focus:border-felt focus:ring-1 focus:ring-felt/25",
        className,
      )}
      {...p}
    />
  );
}

export function Label({ className, ...p }: ComponentProps<"label">) {
  return <label className={cn("mb-1.5 block text-xs font-semibold text-ink", className)} {...p} />;
}

export function Skeleton({ className }: { className?: string }) {
  return <div className={cn("animate-pulse rounded-[6px] bg-surface-2", className)} />;
}

export function PageFallback() {
  return (
    <Container className="py-12">
      <Skeleton className="h-8 w-52" />
      <Skeleton className="mt-2 h-4 w-72 max-w-full" />
      <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <Skeleton className="h-72" />
        <Skeleton className="h-72" />
        <Skeleton className="h-72" />
        <Skeleton className="h-72" />
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
        <div
          className={cn(
            "mb-2 flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.28em] text-brass-dark",
            align === "center" && "justify-center",
          )}
        >
          {align === "center" && <span className="h-px w-6 bg-brass/70" aria-hidden />}
          <span>{eyebrow}</span>
          <span className="h-px w-6 bg-brass/70" aria-hidden />
        </div>
      )}
      <h2 className="font-display text-3xl font-semibold leading-[1.1] tracking-tight text-ink sm:text-[40px]">
        {title}
      </h2>
      {subtitle && <p className="mt-2 text-sm leading-relaxed text-muted">{subtitle}</p>}
    </div>
  );
}

export function Container({ className, ...p }: ComponentProps<"div">) {
  return <div className={cn("mx-auto w-full max-w-[1260px] px-4 sm:px-6 lg:px-8", className)} {...p} />;
}

export function Stars({ rating, className }: { rating: number; className?: string }) {
  const filled = Math.max(0, Math.min(5, Math.round(rating)));
  return (
    <span className={cn("inline-flex items-center gap-0.5 text-brass text-xs", className)} aria-label={`${rating} out of 5 stars`}>
      {"★★★★★".slice(0, filled)}
      <span className="text-[#D5CBB5]">{"★★★★★".slice(filled)}</span>
    </span>
  );
}
