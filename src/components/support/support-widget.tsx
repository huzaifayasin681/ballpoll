"use client";

import { useState } from "react";
import Link from "next/link";
import { MessageSquare, Send, X } from "lucide-react";
import { site } from "@/lib/site";

type Msg = { role: "bot" | "user"; text: string };

const whatsappConversionUrl = `${site.whatsappHref}?text=${encodeURIComponent(
  `Hi ${site.name}! I'd like to speak with the Clubhouse concierge.`,
)}`;

export function SupportWidget() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [msgs, setMsgs] = useState<Msg[]>([
    {
      role: "bot",
      text: "Welcome to The Clubhouse Concierge. Ask about delivery times, Unique IDs, or paste your order number (GPS-XXXXXX) to check status.",
    },
  ]);

  async function send(q: string) {
    const text = q.trim();
    if (!text || busy) return;
    setInput("");
    setMsgs((m) => [...m, { role: "user", text }]);
    setBusy(true);
    try {
      const r = await fetch("/api/support/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text }),
      });
      const data = (await r.json()) as { reply: string };
      setMsgs((m) => [...m, { role: "bot", text: data.reply }]);
    } catch {
      setMsgs((m) => [...m, { role: "bot", text: "Please visit our Support page or message us directly on WhatsApp." }]);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div id="concierge" className="fixed bottom-5 right-5 z-40 flex max-w-[calc(100vw-2.5rem)] flex-col items-end gap-2.5">
      {open ? (
        <div className="w-[calc(100vw-2.5rem)] max-w-96 overflow-hidden rounded-[6px] border border-brass/50 bg-paper shadow-2xl">
          <div className="flex items-center justify-between border-b border-brass/30 bg-felt px-4 py-3 text-paper">
            <div className="flex items-center gap-2.5">
              <span className="flex h-6 w-6 items-center justify-center rounded-full border border-brass/60 bg-felt-deep font-display text-[10px] font-bold text-brass">
                GP
              </span>
              <div>
                <p className="font-display text-sm font-semibold leading-none text-paper">Clubhouse Concierge</p>
                <p className="mt-0.5 text-[9px] font-semibold uppercase tracking-[0.22em] text-brass">Online 24/7</p>
              </div>
            </div>
            <button
              aria-label="Close concierge"
              onClick={() => setOpen(false)}
              className="cursor-pointer text-paper/70 hover:text-paper"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="max-h-72 space-y-2.5 overflow-y-auto bg-cream/60 p-3.5 text-xs">
            {msgs.map((m, i) => (
              <div
                key={i}
                className={
                  m.role === "user"
                    ? "ml-auto max-w-[82%] rounded-[4px] bg-felt px-3 py-2 text-paper"
                    : "mr-auto max-w-[86%] whitespace-pre-line rounded-[4px] border border-border bg-paper px-3 py-2 text-ink"
                }
              >
                {m.text}
              </div>
            ))}
            <div className="flex flex-wrap gap-1.5 pt-1">
              {["Delivery time?", "Find Unique ID", "Refund policy", "Contact human"].map((q) => (
                <button
                  key={q}
                  type="button"
                  onClick={() => send(q)}
                  className="cursor-pointer rounded-[2px] border border-border bg-paper px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-muted transition hover:border-brass hover:text-ink"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              send(input);
            }}
            className="flex items-center gap-1.5 border-t border-border bg-paper p-2.5"
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask a question or paste GPS-XXXXXX…"
              className="h-8 flex-1 rounded-[2px] border border-border bg-cream/60 px-2.5 text-xs text-ink outline-none focus:border-felt"
            />
            <button
              type="submit"
              disabled={busy}
              aria-label="Send"
              className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-[2px] bg-felt text-paper disabled:opacity-50"
            >
              <Send className="h-3.5 w-3.5" />
            </button>
          </form>

          <div className="flex items-center justify-between border-t border-border bg-cream px-3.5 py-2 text-[11px]">
            <a
              href={whatsappConversionUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-felt underline decoration-brass/60 underline-offset-2 hover:text-felt-deep"
            >
              Chat on WhatsApp →
            </a>
            <Link href="/help#contact" onClick={() => setOpen(false)} className="text-muted hover:text-ink">
              Open ticket
            </Link>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label="Open Concierge"
          className="hidden sm:inline-flex cursor-pointer items-center gap-2 rounded-[2px] border border-[#9E7D31] bg-brass px-3.5 py-2 text-[10px] font-semibold uppercase tracking-[0.22em] text-mahogany shadow-lg transition hover:bg-[#d4ae56]"
        >
          <MessageSquare className="h-3.5 w-3.5 stroke-[1.8]" />
          <span>Concierge</span>
        </button>
      )}
    </div>
  );
}
