import { site } from "@/content/landings";

/**
 * My name, which turns to Malayalam on hover, and on focus when it sits in a
 * link. Both names share one cell, so the swap never moves the layout. The
 * Malayalam is hidden from assistive tech, so the name read out stays English.
 */
export function NameSwap() {
  return (
    <span className="group grid">
      <span className="name-swap-out [grid-area:1/1]">{site.name}</span>
      <span lang="ml" aria-hidden="true" className="name-swap-in [grid-area:1/1]">
        {site.nameMalayalam}
      </span>
    </span>
  );
}
