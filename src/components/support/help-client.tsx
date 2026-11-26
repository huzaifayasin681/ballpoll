"use client";

import { useMemo, useState } from "react";
import { Card } from "@/components/ui/primitives";
import { TicketForm } from "@/components/support/ticket-form";
import { site } from "@/lib/site";
import { cn } from "@/lib/utils";
import { Mail, MessageCircle, Minus, Plus, Search, Send } from "lucide-react";

export interface HelpFaqItem {
  id: string;
  question: string;
  answer: string;
  category: string;
}

export function HelpClient({
  faqs,
  defaultName,
  defaultEmail,
}: {
  faqs: HelpFaqItem[];
  defaultName: string;
  defaultEmail: string;
}) {
  const [query, setQuery] = useState("");
  const [openId, setOpenId] = useState<string | null>(faqs[0]?.id ?? null);

  const filteredFaqs = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return faqs;
    return faqs.filter(
      (f) =>
        f.question.toLowerCase().includes(q) ||
        f.answer.toLowerCase().includes(q) ||
        f.category.toLowerCase().includes(q),
    );
  }, [faqs, query]);

  return (
    <div className="space-y-8">
      {/* Full-width Paper search bar */}
      <Card className="p-2">
        <div className="relative flex items-center">
          <Search className="pointer-events-none absolute left-3.5 h-4 w-4 text-muted" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search questions (Unique ID, coins, cues, JazzCash, refunds)..."
            aria-label="Search the help centre"
            className="h-11 w-full rounded-[4px] bg-paper pl-10 pr-4 text-sm text-ink placeholder:text-muted/75 outline-none focus:ring-1 focus:ring-felt/30"
          />
        </div>
      </Card>

      {/* 3 contact channel Paper cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <a href={site.whatsappHref} target="_blank" rel="noreferrer" className="group block">
          <Card className="flex h-full items-center gap-4 p-5 transition hover:border-brass">
            <span className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-[4px] bg-felt text-brass">
              <MessageCircle className="h-5 w-5" />
            </span>
            <div>
              <div className="text-[10px] font-semibold uppercase tracking-[0.2em] text-brass-dark">
                INSTANT DESK · 24/7
              </div>
              <div className="mt-0.5 font-display text-lg font-semibold text-ink group-hover:text-felt">
                WhatsApp
              </div>
              <div className="text-xs text-muted">
                {site.whatsapp} · Avg reply ~3 min
              </div>
            </div>
          </Card>
        </a>

        <a href={site.telegramHref} target="_blank" rel="noreferrer" className="group block">
          <Card className="flex h-full items-center gap-4 p-5 transition hover:border-brass">
            <span className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-[4px] bg-felt text-brass">
              <Send className="h-5 w-5" />
            </span>
            <div>
              <div className="text-[10px] font-semibold uppercase tracking-[0.2em] text-brass-dark">
                DIRECT OPERATOR
              </div>
              <div className="mt-0.5 font-display text-lg font-semibold text-ink group-hover:text-felt">
                Telegram
              </div>
              <div className="text-xs text-muted">
                {site.telegram} · Order updates
              </div>
            </div>
          </Card>
        </a>

        <a href={`mailto:${site.supportEmail}`} className="group block">
          <Card className="flex h-full items-center gap-4 p-5 transition hover:border-brass">
            <span className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-[4px] bg-felt text-brass">
              <Mail className="h-5 w-5" />
            </span>
            <div>
              <div className="text-[10px] font-semibold uppercase tracking-[0.2em] text-brass-dark">
                WRITTEN SUPPORT
              </div>
              <div className="mt-0.5 font-display text-lg font-semibold text-ink group-hover:text-felt">
                Email
              </div>
              <div className="text-xs text-muted">
                {site.supportEmail}
              </div>
            </div>
          </Card>
        </a>
      </div>

      {/* 2-column FAQ accordion + Open a ticket */}
      <div className="grid gap-8 lg:grid-cols-12 lg:items-start">
        <div className="space-y-3 lg:col-span-7">
          <div className="mb-4">
            <div className="text-[11px] font-semibold uppercase tracking-[0.22em] text-brass-dark">
              COMMON QUESTIONS
            </div>
            <h2 className="mt-1 font-display text-2xl font-semibold text-ink">
              Frequently asked
            </h2>
          </div>

          {filteredFaqs.length === 0 ? (
            <Card className="p-6 text-sm text-muted">
              No answers matched “{query}”. Try another term or open a ticket alongside.
            </Card>
          ) : (
            <Card className="divide-y divide-border overflow-hidden">
              {filteredFaqs.map((faq) => {
                const isOpen = openId === faq.id;
                return (
                  <div key={faq.id}>
                    <button
                      type="button"
                      onClick={() => setOpenId(isOpen ? null : faq.id)}
                      aria-expanded={isOpen}
                      className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left transition hover:bg-cream/50"
                    >
                      <span className="font-display text-[17px] font-semibold leading-snug text-ink">
                        {faq.question}
                      </span>
                      <span
                        className={cn(
                          "inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-[2px] border transition",
                          isOpen
                            ? "border-felt bg-felt text-paper"
                            : "border-border bg-cream text-ink",
                        )}
                      >
                        {isOpen ? <Minus className="h-3.5 w-3.5" /> : <Plus className="h-3.5 w-3.5" />}
                      </span>
                    </button>
                    {isOpen && (
                      <div className="border-t border-border/60 bg-cream/35 px-5 py-4 text-sm leading-relaxed text-muted">
                        {faq.answer}
                      </div>
                    )}
                  </div>
                );
              })}
            </Card>
          )}
        </div>

        <div className="lg:col-span-5">
          <Card className="p-6 md:p-7">
            <div className="mb-5 border-b border-border pb-4">
              <div className="text-[11px] font-semibold uppercase tracking-[0.22em] text-brass-dark">
                CLUBHOUSE DESK
              </div>
              <h2 className="mt-1 font-display text-2xl font-semibold text-ink">
                Open a ticket
              </h2>
              <p className="mt-1 text-sm text-muted">
                Every ticket goes straight to a live fulfillment specialist.
              </p>
            </div>
            <TicketForm defaultName={defaultName} defaultEmail={defaultEmail} />
          </Card>
        </div>
      </div>
    </div>
  );
}
