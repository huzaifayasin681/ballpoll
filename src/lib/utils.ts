import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function slugify(s: string) {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

/** Human friendly relative time, e.g. "3 min ago". */
export function timeAgo(date: Date | string) {
  const d = typeof date === "string" ? new Date(date) : date;
  const s = Math.max(1, Math.floor((Date.now() - d.getTime()) / 1000));
  if (s < 60) return `${s}s ago`;
  const m = Math.floor(s / 60);
  if (m < 60) return `${m} min ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const days = Math.floor(h / 24);
  return `${days}d ago`;
}

export function formatDate(date: Date | string) {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function formatDeliveryHours(h: number) {
  if (h <= 0) return "Instant";
  if (h < 1) return `${Math.round(h * 60)} min`;
  if (h < 24) return `${h}h`;
  const d = Math.round(h / 24);
  return `${d} day${d > 1 ? "s" : ""}`;
}

/** Mask a name for public display: "Ahmed Khan" -> "Ahmed K." */
export function maskName(name: string | null | undefined) {
  if (!name) return "A player";
  const [first, last] = name.trim().split(/\s+/);
  return last ? `${first} ${last[0]}.` : first;
}
