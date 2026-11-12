"use client";

import { useActionState } from "react";
import { createTicketAction } from "@/app/actions/support";
import { Button } from "@/components/ui/button";
import { Input, Label, Textarea } from "@/components/ui/primitives";

export function TicketForm({ defaultEmail, defaultName }: { defaultEmail?: string; defaultName?: string | null }) {
  const [state, action, pending] = useActionState(createTicketAction, undefined);
  if (state?.ok) {
    return (
      <div className="rounded-xl border border-brand-border bg-brand-soft p-5 text-sm text-brand">
        <strong>Ticket received!</strong> Our support team will reply by email as soon as possible.
      </div>
    );
  }
  return (
    <form action={action} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor="name">Name</Label>
          <Input id="name" name="name" required defaultValue={defaultName ?? ""} />
        </div>
        <div>
          <Label htmlFor="email">Email</Label>
          <Input id="email" name="email" type="email" required defaultValue={defaultEmail ?? ""} />
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor="trackingId">Order ID (optional)</Label>
          <Input id="trackingId" name="trackingId" placeholder="GPS-XXXXXX" className="font-mono uppercase" />
        </div>
        <div>
          <Label htmlFor="subject">Subject</Label>
          <Input id="subject" name="subject" required placeholder="Delivery question" />
        </div>
      </div>
      <div>
        <Label htmlFor="message">Message</Label>
        <Textarea id="message" name="message" rows={4} required placeholder="Tell us how we can help…" />
      </div>
      {state?.error && <p className="text-xs text-danger">{state.error}</p>}
      <Button type="submit" disabled={pending}>
        Submit Support Ticket
      </Button>
    </form>
  );
}
