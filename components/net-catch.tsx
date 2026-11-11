"use client";

import { useRef, useState, type CSSProperties, type ReactNode } from "react";

import { buttonStyles } from "@/components/ui/button-styles";

type NetCatchProps = {
  labels: { cast: string; hint: string; empty: string; label: string };
  results: { value: string; label: string; story: string }[];
  /** The card's headline number, shown until the net comes up. */
  children: ReactNode;
};

/* When each result lands, in ms after the click. The first is the headline
   the card already showed, so it lands at once. The next lands as the net hits
   the water, and the last as it comes back in (see the boat's 1.6 s throw in
   globals.css). With no throw to follow, they land in quick order. */
const THROWN_BEATS = [0, 800, 1350];
const QUICK_BEATS = [0, 120, 240];

/**
 * The boatman throws his net and hauls it back, and the results land in the
 * card in time with it. The card answers the click at once, so nothing waits.
 * The button stays in place so focus never gets lost. Without script, the
 * headline number simply stays.
 */
export function NetCatch({ labels, results, children }: NetCatchProps) {
  const root = useRef<HTMLDivElement>(null);
  const [beats, setBeats] = useState<number[] | null>(null);

  function toggle() {
    const landing = root.current?.closest<HTMLElement>("[data-landing]");
    /* The boat lives on this page, outside the landing. */
    const boat = root.current?.closest("main")?.querySelector<HTMLElement>("[data-boat]");
    const casting = beats === null;
    for (const element of [landing, boat]) {
      if (!element) continue;
      if (casting) element.dataset.net = "down";
      else delete element.dataset.net;
    }
    if (!casting) {
      setBeats(null);
      return;
    }
    const thrown = Boolean(boat && getComputedStyle(boat).display !== "none");
    setBeats(thrown ? THROWN_BEATS : QUICK_BEATS);
  }

  return (
    <div ref={root} className="flex flex-col gap-4">
      <div aria-live="polite">
        {beats ? (
          <div>
            <h3 className="font-medium">{labels.label}</h3>
            {results.map((result, index) => (
              <details
                key={result.value}
                name="net-catch"
                open={index === 0}
                className="catch-in"
                style={{ "--beat": `${beats[index]}ms` } as CSSProperties}
              >
                <summary className="flex min-h-11 cursor-pointer items-center gap-4 py-2">
                  <svg aria-hidden="true" viewBox="0 0 28 14" className="catch-fish h-3.5 w-7 shrink-0">
                    <path
                      d="M2 7Q8 1 16 3Q20 4 22 7L27 2V12L22 7Q20 10 16 11Q8 13 2 7Z"
                      fill="#c7d6d2"
                      stroke="#14221f"
                      strokeWidth="1.5"
                      strokeLinejoin="round"
                    />
                    <circle cx="7" cy="6.5" r="1.2" fill="#14221f" />
                  </svg>
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
      </div>
      <div className="invisible flex flex-wrap items-center gap-4 hydrated:visible">
        <button type="button" onClick={toggle} className={buttonStyles.outline}>
          {beats ? labels.empty : labels.cast}
        </button>
        {!beats && <p className="text-label text-muted-foreground">{labels.hint}</p>}
      </div>
    </div>
  );
}
