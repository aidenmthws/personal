"use client";

import { useRef, useState, type ReactNode } from "react";

import { buttonStyles } from "@/components/ui/button-styles";

type NetCatchProps = {
  labels: { lower: string; hint: string; raise: string; label: string };
  results: { value: string; label: string; story: string }[];
  /** The card's headline number, shown until the net comes up. */
  children: ReactNode;
};

/**
 * Lowers the net in the scene and lands the results. The button stays in place
 * so focus never gets lost. Without script, the headline number simply stays.
 */
export function NetCatch({ labels, results, children }: NetCatchProps) {
  const root = useRef<HTMLDivElement>(null);
  const [caught, setCaught] = useState(false);

  function toggle() {
    const next = !caught;
    setCaught(next);
    const landing = root.current?.closest<HTMLElement>("[data-landing]");
    if (landing) landing.dataset.net = next ? "down" : "up";
  }

  return (
    <div ref={root} className="flex flex-col gap-4">
      {caught ? (
        <div>
          <h3 className="font-medium">{labels.label}</h3>
          {results.map((result, index) => (
            <details key={result.value} name="net-catch" open={index === 0}>
              <summary className="flex min-h-11 cursor-pointer items-baseline gap-4 py-2">
                <span className="font-display text-title">{result.value}</span>
                <span className="text-label text-muted-foreground">{result.label}</span>
              </summary>
              <p className="pb-2">{result.story}</p>
            </details>
          ))}
        </div>
      ) : (
        children
      )}
      <div className="invisible flex flex-wrap items-center gap-4 hydrated:visible">
        <button type="button" onClick={toggle} className={buttonStyles.outline}>
          {caught ? labels.raise : labels.lower}
        </button>
        {!caught && <p className="text-label text-muted-foreground">{labels.hint}</p>}
      </div>
    </div>
  );
}
