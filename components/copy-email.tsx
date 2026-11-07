"use client";

import { useState } from "react";

import { buttonStyles } from "@/components/ui/button-styles";

type CopyEmailProps = {
  email: string;
  labels: { action: string; done: string; failed: string };
};

type CopyState = "idle" | "done" | "failed";

/** Stays hidden until the page's script runs, because it does nothing without it. */
export function CopyEmail({ email, labels }: CopyEmailProps) {
  const [state, setState] = useState<CopyState>("idle");

  async function copy() {
    try {
      await navigator.clipboard.writeText(email);
      setState("done");
    } catch {
      setState("failed");
    }
  }

  return (
    <div className="invisible hydrated:visible">
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
  );
}
