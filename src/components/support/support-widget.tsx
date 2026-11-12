"use client";

import { useState } from "react";
import Link from "next/link";
import { MessageSquare, Send, X } from "lucide-react";

type Msg = { role: "bot" | "user"; text: string };

export function SupportWidget() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [msgs, setMsgs] = useState<Msg[]>([
    {
      role: "bot",
      text: "Hello! Ask a question about delivery times, finding your Unique ID, or paste your Order ID (GPS-XXXXXX) to check status.",
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
      setMsgs((m) => [...m, { role: "bot", text: "Sorry, something went wrong. Please visit the Support page." }]);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="fixed bottom-4 right-4 z-40">
      {open ? (
        <div className="w-80 sm:w-96 overflow-hidden rounded-lg border border-border bg-surface shadow-xl">
          <div className="flex items-center justify-between border-b border-border bg-[#141413] px-4 py-2.5 text-white">
            <div className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4 text-[#5ec29f]" />
              <p className="text-xs font-semibold">Support Desk</p>
            </div>
            <button aria-label="Close support chat" onClick={() => setOpen(false)} className="text-white/70 hover:text-white">
              <X className="h-4 w-4" />
            </button>
          </div>
          <div className="max-h-72 space-y-2 overflow-y-auto p-3.5 text-xs">
            {msgs.map((m, i) => (
              <div
                key={i}
                className={
                  m.role === "user"
                    ? "ml-auto max-w-[80%] rounded-md bg-brand px-3 py-2 text-white"
                    : "mr-auto max-w-[85%] rounded-md border border-border bg-background px-3 py-2 text-foreground whitespace-pre-line"
                }
              >
                {m.text}
              </div>
            ))}
            <div className="flex flex-wrap gap-1.5 pt-1">
              {["Delivery time?", "Find Unique ID", "Refund policy", "Contact human"].map((q) => (
                <button
                  key={q}
                  onClick={() => send(q)}
                  className="cursor-pointer rounded border border-border bg-surface-2 px-2 py-1 text-[11px] text-muted hover:text-foreground"
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
            className="flex items-center gap-1.5 border-t border-border p-2"
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask a question or paste GPS-XXXXXX…"
              className="h-8 flex-1 rounded border border-border bg-background px-2.5 text-xs text-foreground outline-none focus:border-brand"
            />
            <button
              type="submit"
              disabled={busy}
              aria-label="Send"
              className="flex h-8 w-8 items-center justify-center rounded bg-brand text-white disabled:opacity-50"
            >
              <Send className="h-3.5 w-3.5" />
            </button>
          </form>
          <div className="border-t border-border bg-surface-2 px-3 py-1.5 text-center text-[11px] text-muted">
            Need a team member?{" "}
            <Link href="/help#contact" onClick={() => setOpen(false)} className="font-medium text-brand underline">
              Open a support ticket
            </Link>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setOpen(true)}
          aria-label="Open support chat"
          className="inline-flex cursor-pointer items-center gap-2 rounded-md border border-border bg-[#141413] px-3.5 py-2.5 text-xs font-medium text-white shadow-md transition hover:bg-[#292826]"
        >
          <MessageSquare className="h-4 w-4 text-[#5ec29f]" />
          <span>Support Chat</span>
        </button>
      )}
    </div>
  );
}
