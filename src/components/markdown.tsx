import Link from "next/link";
import type { ReactNode } from "react";

function inline(text: string): ReactNode[] {
  const parts = text.split(/(\*\*[^*]+\*\*|`[^`]+`|\[[^\]]+\]\([^)]+\))/g);
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) return <strong key={i}>{part.slice(2, -2)}</strong>;
    if (part.startsWith("`") && part.endsWith("`")) return <code key={i}>{part.slice(1, -1)}</code>;
    const m = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
    if (m) return <Link key={i} href={m[2]}>{m[1]}</Link>;
    return part;
  });
}

export function headingSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export function extractMarkdownHeadings(body: string): { id: string; text: string }[] {
  return body
    .replace(/\r\n?/g, "\n")
    .trim()
    .split(/\n\n+/)
    .filter((b) => b.startsWith("## "))
    .map((b) => {
      const text = b.slice(3).split("\n")[0].trim();
      return { id: headingSlug(text), text };
    });
}

export function Markdown({ body }: { body: string }) {
  const blocks = body.replace(/\r\n?/g, "\n").trim().split(/\n\n+/);
  return (
    <div className="prose-gps">
      {blocks.map((b, i) => {
        if (b.startsWith("## ")) {
          const lines = b.split("\n");
          const headingText = lines[0].slice(3).trim();
          const rest = lines.slice(1).join("\n").trim();
          return (
            <div key={i}>
              <h2 id={headingSlug(headingText)} className="scroll-mt-24">
                {inline(headingText)}
              </h2>
              {rest && <p>{inline(rest)}</p>}
            </div>
          );
        }
        if (b.startsWith("### ")) return <h3 key={i}>{inline(b.slice(4))}</h3>;
        const imgMatch = b.trim().match(/^!\[([^\]]*)\]\(([^)]+)\)$/);
        if (imgMatch) {
          const altText = imgMatch[1] || "Post illustration";
          const imgUrl = imgMatch[2];
          return (
            <figure key={i} className="my-6 overflow-hidden rounded-[6px] border border-border bg-cream/50">
              <img src={imgUrl} alt={altText} loading="lazy" className="w-full max-h-[460px] object-cover" />
              {imgMatch[1] && (
                <figcaption className="border-t border-border px-4 py-2 text-xs text-muted">
                  {imgMatch[1]}
                </figcaption>
              )}
            </figure>
          );
        }
        if (b.startsWith("> ")) return <blockquote key={i}>{inline(b.slice(2))}</blockquote>;
        if (b.split("\n").every((l) => l.startsWith("- "))) {
          return (
            <ul key={i}>
              {b.split("\n").map((l, j) => (
                <li key={j}>{inline(l.slice(2))}</li>
              ))}
            </ul>
          );
        }
        if (b.split("\n").every((l) => /^\d+\.\s/.test(l))) {
          return (
            <ol key={i}>
              {b.split("\n").map((l, j) => (
                <li key={j}>{inline(l.replace(/^\d+\.\s/, ""))}</li>
              ))}
            </ol>
          );
        }
        return <p key={i}>{inline(b)}</p>;
      })}
    </div>
  );
}
