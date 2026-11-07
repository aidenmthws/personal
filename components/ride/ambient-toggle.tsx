"use client";

import { useState } from "react";

type AmbientToggleProps = { pauseLabel: string; playLabel: string };

/** Pauses the boat's bob and wake. It only appears with the full Ride. */
export function AmbientToggle({ pauseLabel, playLabel }: AmbientToggleProps) {
  const [paused, setPaused] = useState(false);

  function toggle() {
    const next = !paused;
    setPaused(next);
    document.documentElement.dataset.ambient = next ? "paused" : "playing";
  }

  return (
    <button
      type="button"
      onClick={toggle}
      className="hidden min-h-11 rounded-sm px-2 text-label text-foreground underline ride:inline-flex ride:items-center"
    >
      {paused ? playLabel : pauseLabel}
    </button>
  );
}
