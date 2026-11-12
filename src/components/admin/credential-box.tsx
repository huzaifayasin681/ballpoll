"use client";

import { useState, useTransition } from "react";
import { Eye, EyeOff, Lock } from "lucide-react";
import { revealCredentialsAction } from "@/app/actions/admin";
import { Button } from "@/components/ui/button";
import { CopyButton } from "@/components/ui/copy-button";

export function CredentialBox({ orderId }: { orderId: string }) {
  const [creds, setCreds] = useState<{ login: string; secret: string } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pending, start] = useTransition();

  return (
    <div className="rounded-xl border border-accent-border bg-accent-soft p-4 text-xs">
      <div className="flex items-center justify-between gap-2">
        <span className="inline-flex items-center gap-1.5 font-semibold text-accent">
          <Lock className="h-4 w-4" /> Encrypted Game Credentials (audited)
        </span>
        {creds ? (
          <Button type="button" variant="ghost" size="sm" onClick={() => setCreds(null)}>
            <EyeOff className="h-3.5 w-3.5" /> Hide
          </Button>
        ) : (
          <Button
            type="button"
            variant="secondary"
            size="sm"
            disabled={pending}
            onClick={() =>
              start(async () => {
                setError(null);
                const r = await revealCredentialsAction(orderId);
                if ("error" in r && r.error) setError(r.error);
                else if ("login" in r && r.login) setCreds({ login: r.login, secret: r.secret });
              })
            }
          >
            <Eye className="h-3.5 w-3.5" /> Decrypt & View
          </Button>
        )}
      </div>
      {error && <p className="mt-2 text-danger">{error}</p>}
      {creds && (
        <div className="mt-3 grid gap-2 sm:grid-cols-2">
          <div className="flex items-center justify-between rounded-lg bg-surface px-3 py-2">
            <span>
              Login: <code className="font-mono text-foreground">{creds.login}</code>
            </span>
            <CopyButton text={creds.login} />
          </div>
          <div className="flex items-center justify-between rounded-lg bg-surface px-3 py-2">
            <span>
              Password: <code className="font-mono text-foreground">{creds.secret}</code>
            </span>
            <CopyButton text={creds.secret} />
          </div>
        </div>
      )}
    </div>
  );
}
