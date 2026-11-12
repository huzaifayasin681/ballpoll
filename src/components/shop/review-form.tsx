"use client";

import { useActionState } from "react";
import { submitReviewAction } from "@/app/actions/reviews";
import { Button } from "@/components/ui/button";
import { Input, Label, Select, Textarea } from "@/components/ui/primitives";

export function ReviewForm({ productId, slug, defaultName }: { productId: string; slug: string; defaultName?: string | null }) {
  const [state, action, pending] = useActionState(submitReviewAction, undefined);
  if (state?.ok) {
    return <p className="rounded-xl bg-brand-soft p-4 text-sm text-brand">Thanks! Your review has been posted.</p>;
  }
  return (
    <form action={action} className="space-y-3">
      <input type="hidden" name="productId" value={productId} />
      <input type="hidden" name="slug" value={slug} />
      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <Label htmlFor="author">Your name</Label>
          <Input id="author" name="author" required defaultValue={defaultName ?? ""} placeholder="Ahmed K." />
        </div>
        <div>
          <Label htmlFor="rating">Rating</Label>
          <Select id="rating" name="rating" defaultValue="5">
            <option value="5">★★★★★ (5)</option>
            <option value="4">★★★★☆ (4)</option>
            <option value="3">★★★☆☆ (3)</option>
            <option value="2">★★☆☆☆ (2)</option>
            <option value="1">★☆☆☆☆ (1)</option>
          </Select>
        </div>
      </div>
      <div>
        <Label htmlFor="body">Review</Label>
        <Textarea id="body" name="body" rows={3} required placeholder="How was the delivery speed and support?" />
      </div>
      {state?.error && <p className="text-xs text-danger">{state.error}</p>}
      <Button type="submit" size="sm" disabled={pending}>
        Post Review
      </Button>
    </form>
  );
}
