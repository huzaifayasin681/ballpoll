"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";
import { Button } from "./button";

export function CopyButton({ text, label = "Copy" }: { text: string; label?: string }) {
  const [done, setDone] = useState(false);
  return (
    <Button
      type="button"
      variant="secondary"
      size="sm"
      onClick={() => {
        navigator.clipboard.writeText(text);
        setDone(true);
        setTimeout(() => setDone(false), 1500);
      }}
    >
      {done ? <Check className="h-3.5 w-3.5 text-brand" /> : <Copy className="h-3.5 w-3.5" />}
      {done ? "Copied" : label}
    </Button>
  );
}
