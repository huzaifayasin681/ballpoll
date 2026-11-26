"use client";

import { useState } from "react";
import { Check } from "lucide-react";
import { Container } from "@/components/ui/primitives";

export function MembersListBanner() {
  const [email, setEmail] = useState("");
  const [joined, setJoined] = useState(false);

  return (
    <section className="border-t border-brass/25 bg-felt py-10 text-paper">
      <Container className="flex flex-col justify-between gap-6 md:flex-row md:items-center">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-brass">
            Members list
          </p>
          <h2 className="mt-1.5 font-display text-2xl font-semibold tracking-tight text-paper sm:text-[26px]">
            Join the club. Take 10% off your first order.
          </h2>
        </div>

        {joined ? (
          <div className="inline-flex items-center gap-2 rounded-[2px] border border-brass/50 bg-felt-deep px-4 py-2.5 text-xs text-paper">
            <Check className="h-4 w-4 text-brass" />
            <span>
              Welcome to the club. Use code <strong className="font-mono text-brass">WELCOME10</strong> at checkout.
            </span>
          </div>
        ) : (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (!email.trim()) return;
              setJoined(true);
            }}
            className="flex w-full max-w-md items-center gap-2"
          >
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Your email address"
              aria-label="Your email address"
              className="h-10 min-w-0 flex-1 rounded-[2px] border border-paper/25 bg-felt-deep px-3.5 text-xs text-paper placeholder:text-paper/45 outline-none transition focus:border-brass"
            />
            <button
              type="submit"
              className="h-10 shrink-0 cursor-pointer rounded-[2px] bg-brass px-5 text-[11px] font-semibold uppercase tracking-[0.2em] text-mahogany transition hover:bg-[#d4ae56]"
            >
              Join
            </button>
          </form>
        )}
      </Container>
    </section>
  );
}
