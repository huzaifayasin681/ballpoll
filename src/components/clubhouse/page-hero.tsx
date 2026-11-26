import Link from "next/link";
import { Container } from "@/components/ui/primitives";

type Crumb = { label: string; href?: string };

export function ClubhousePageHero({
  crumbs,
  eyebrow,
  title,
  subtitle,
}: {
  crumbs: Crumb[];
  eyebrow: string;
  title: string;
  subtitle?: string;
}) {
  return (
    <section className="felt-surface border-b border-brass/25 py-12 text-paper sm:py-16">
      <Container className="text-center">
        <nav aria-label="Breadcrumb" className="flex flex-wrap items-center justify-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.24em] text-paper/60">
          {crumbs.map((c, idx) => (
            <span key={c.label} className="inline-flex items-center gap-1.5">
              {idx > 0 && <span aria-hidden>/</span>}
              {c.href ? (
                <Link href={c.href} className="transition hover:text-brass">
                  {c.label}
                </Link>
              ) : (
                <span className="text-paper/85">{c.label}</span>
              )}
            </span>
          ))}
        </nav>

        <div className="mt-4 flex items-center justify-center gap-3 text-[10px] font-semibold uppercase tracking-[0.3em] text-brass">
          <span className="h-px w-7 bg-brass/65" aria-hidden />
          <span>{eyebrow}</span>
          <span className="h-px w-7 bg-brass/65" aria-hidden />
        </div>

        <h1 className="mt-3 font-display text-4xl font-semibold tracking-tight text-paper sm:text-[46px] sm:leading-[1.08]">
          {title}
        </h1>

        {subtitle && (
          <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-paper/75">
            {subtitle}
          </p>
        )}
      </Container>
    </section>
  );
}
