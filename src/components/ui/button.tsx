import { cn } from "@/lib/utils";
import Link from "next/link";
import type { ComponentProps } from "react";

type Variant = "primary" | "secondary" | "ghost" | "outline" | "danger" | "gold";
type Size = "sm" | "md" | "lg";

const variants: Record<Variant, string> = {
  primary: "bg-brand-btn text-white font-medium hover:bg-brand-btn-hover shadow-xs",
  gold: "bg-accent text-white font-medium hover:opacity-90",
  secondary: "bg-surface text-foreground border border-border hover:bg-surface-2 shadow-2xs",
  outline: "border border-border bg-transparent text-foreground hover:bg-surface-2",
  ghost: "text-muted hover:text-foreground hover:bg-surface-2",
  danger: "bg-danger-soft text-danger border border-danger-border hover:opacity-90",
};
const sizes: Record<Size, string> = {
  sm: "h-8 px-3 text-xs rounded-md",
  md: "h-9 px-4 text-sm rounded-md",
  lg: "h-11 px-5 text-sm rounded-md",
};

export function buttonClass(variant: Variant = "primary", size: Size = "md", className?: string) {
  return cn(
    "inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium transition-colors cursor-pointer disabled:opacity-50 disabled:pointer-events-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/30",
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
