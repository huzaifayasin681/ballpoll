import { cn } from "@/lib/utils";
import Link from "next/link";
import type { ComponentProps } from "react";

type Variant = "primary" | "secondary" | "ghost" | "outline" | "danger" | "gold" | "brass" | "onFeltGhost";
type Size = "sm" | "md" | "lg";

const variants: Record<Variant, string> = {
  primary: "btn-club-primary font-semibold",
  gold: "btn-club-brass font-semibold",
  brass: "btn-club-brass font-semibold",
  secondary:
    "bg-paper text-ink border border-[#D4C9B2] hover:border-brass hover:bg-[#F5EEDC] font-semibold",
  outline:
    "border border-[#D4C9B2] bg-transparent text-ink hover:border-brass hover:bg-paper font-semibold",
  ghost:
    "border border-transparent text-ink hover:border-[#D4C9B2] hover:bg-paper font-semibold",
  onFeltGhost:
    "border border-brass/50 bg-transparent text-paper hover:border-brass hover:bg-white/5 font-semibold",
  danger: "bg-danger-soft text-danger border border-danger-border hover:opacity-90 font-semibold",
};

const sizes: Record<Size, string> = {
  sm: "h-8 px-3.5 text-[10px] tracking-[0.18em] uppercase rounded-[2px]",
  md: "h-10 px-5 text-[11px] tracking-[0.2em] uppercase rounded-[2px]",
  lg: "h-11 px-6 text-[11px] tracking-[0.22em] uppercase rounded-[2px]",
};

export function buttonClass(variant: Variant = "primary", size: Size = "md", className?: string) {
  return cn(
    "inline-flex items-center justify-center gap-2 whitespace-nowrap transition-all duration-150 cursor-pointer disabled:opacity-50 disabled:pointer-events-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brass/50",
    variants[variant],
    sizes[size],
    className,
  );
}

export function Button({
  variant,
  size,
  className,
  ...props
}: ComponentProps<"button"> & { variant?: Variant; size?: Size }) {
  return <button className={buttonClass(variant, size, className)} {...props} />;
}

export function ButtonLink({
  variant,
  size,
  className,
  ...props
}: ComponentProps<typeof Link> & { variant?: Variant; size?: Size }) {
  return <Link className={buttonClass(variant, size, className)} {...props} />;
}
