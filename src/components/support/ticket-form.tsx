"use client";

import { useActionState, useState } from "react";
import { createTicketAction } from "@/app/actions/support";
import { Input, Label, Select, Textarea } from "@/components/ui/primitives";
import { Button } from "@/components/ui/button";
import { CheckCircle2 } from "lucide-react";

const TOPICS = [
  "Order delivery & status",
  "Unique ID or coin top-up",
  "Cues, accounts & boosting",
  "Payment & refund inquiry",
  "Rewards & referral points",
  "Other",
];

export function TicketForm({
  defaultName = "",
  defaultEmail = "",
}: {
  defaultName?: string;
  defaultEmail?: string;
}) {
  const [state, action, pending] = useActionState<{ ok?: boolean; error?: string }, FormData>(
    createTicketAction,
    {},
  );
  const [topic, setTopic] = useState(TOPICS[0]);

  if (state.ok) {
    return (
      <div className="rounded-[4px] border border-felt/30 bg-felt/10 p-6 text-center">
        <CheckCircle2 className="mx-auto h-9 w-9 text-felt" />
        <p className="mt-3 font-display text-xl font-semibold text-ink">Ticket received</p>
        <p className="mt-1 text-sm text-muted">
          Our clubhouse desk responds under 5 minutes on live channels and by email.
        </p>
      </div>
    );
  }

  return (
    <form action={action} className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <Label htmlFor="ticket-name">Your name</Label>
          <Input
            id="ticket-name"
            name="name"
            required
            minLength={2}
            defaultValue={defaultName}
            placeholder="Alex"
          />
        </div>
        <div>
          <Label htmlFor="ticket-email">Email</Label>
          <Input
            id="ticket-email"
            name="email"
            type="email"
            required
            defaultValue={defaultEmail}
            placeholder="you@example.com"
          />
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <Label htmlFor="ticket-tracking">Order number (optional)</Label>
          <Input
            id="ticket-tracking"
            name="trackingId"
            placeholder="GPS-7F3K9Q"
          />
        </div>
        <div>
          <Label htmlFor="ticket-subject">Topic</Label>
          <Select
            id="ticket-subject"
            name="subject"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
          >
            {TOPICS.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </Select>
        </div>
      </div>

      <div>
        <Label htmlFor="ticket-message">Message</Label>
        <Textarea
          id="ticket-message"
          name="message"
          required
          minLength={10}
          rows={4}
          placeholder="Tell us your Unique ID, order reference, or question..."
        />
      </div>

      {state.error && (
        <p className="rounded-[2px] border border-danger-border bg-danger-soft px-3 py-2 text-xs font-medium text-danger">
          {state.error}
        </p>
      )}

      <Button type="submit" disabled={pending} className="w-full">
        {pending ? "Sending..." : "SEND TICKET"}
      </Button>
    </form>
  );
}
