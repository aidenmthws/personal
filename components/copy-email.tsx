"use client";

import { useState, useSyncExternalStore } from "react";

import { buttonStyles } from "@/components/ui/button-styles";

type CopyEmailProps = {
  email: string;
  labels: { action: string; done: string; failed: string };
};

type CopyState = "idle" | "done" | "failed";

const subscribe = () => () => {};

/**
 * The button does nothing without script, so it holds its space, hidden, until
 * the page hydrates. Without script, a plain email link stands in for it.
 */
export function CopyEmail({ email, labels }: CopyEmailProps) {
  const [state, setState] = useState<CopyState>("idle");
  const hydrated = useSyncExternalStore(subscribe, () => true, () => false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(email);
      setState("done");
    } catch {
      setState("failed");
    }
  }

  return (
    <div>
      <noscript>
        <a href={`mailto:${email}`} className="inline-block py-2.5 break-all">
          {email}
        </a>
      </noscript>
      <div className={hydrated ? "" : "invisible"}>
        <button type="button" onClick={copy} className={buttonStyles.outline}>
          {labels.action}
        </button>
        <p role="status" className="mt-2 text-label">
          {state === "done" && labels.done}
          {state === "failed" && (
            <>
              {labels.failed} <span className="font-mono select-all">{email}</span>
            </>
          )}
        </p>
      </div>
    </div>
  );
}
