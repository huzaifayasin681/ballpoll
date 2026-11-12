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

export function Markdown({ body }: { body: string }) {
  const blocks = body.trim().split(/\n\n+/);
  return (
    <div className="prose-gps">
      {blocks.map((b, i) => {
        if (b.startsWith("## ")) return <h2 key={i}>{inline(b.slice(3))}</h2>;
        if (b.startsWith("### ")) return <h3 key={i}>{inline(b.slice(4))}</h3>;
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
