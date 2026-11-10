"use client";

import { useState, type ReactNode } from "react";

type AmbientToggleProps = {
  pauseLabel: string;
  playLabel: string;
  className?: string;
  /** An icon in place of the text label. The label still names the button. */
  children?: ReactNode;
};

const rideOnly =
  "hidden min-h-11 rounded-sm px-2 text-label whitespace-nowrap text-foreground underline ride:inline-flex ride:items-center";

/**
 * Pauses every ambient loop on the page. By default it only appears with the
 * full Ride; Dry Land passes its own classes to show it beside its scenery.
 */
export function AmbientToggle({ pauseLabel, playLabel, className = rideOnly, children }: AmbientToggleProps) {
  const [paused, setPaused] = useState(false);
  const label = paused ? playLabel : pauseLabel;

  function toggle() {
    const next = !paused;
    setPaused(next);
    document.documentElement.dataset.ambient = next ? "paused" : "playing";
  }

  return (
    <button
      type="button"
      onClick={toggle}
      data-paused={paused ? "" : undefined}
      aria-label={children ? label : undefined}
      className={className}
    >
      {children ?? label}
      {children && (
        <span
          aria-hidden="true"
          className="bar-tip pointer-events-none absolute bottom-full left-1/2 mb-2 -translate-x-1/2 rounded-sm bg-secondary px-2 py-1 text-label whitespace-nowrap text-secondary-foreground"
        >
          {label}
        </span>
      )}
    </button>
  );
}
