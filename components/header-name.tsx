"use client";

import { useEffect, useRef, type ReactNode } from "react";

/**
 * Holds the header's name and hides it while the page shows the name itself,
 * so it is never on screen twice. On the full Ride that is while the boat is
 * docked at the Shore; on a scrolling page, while the page's h1 is in view.
 * It starts hidden, because both pages open on their name. Hidden, the link
 * leaves the tab order too.
 */
export function HeaderName({ children }: { children: ReactNode }) {
  const holder = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = holder.current;
    /* The page this header belongs to: its main follows the header. */
    const main = element?.closest("header")?.nextElementSibling;
    const heading = main?.querySelector("h1");
    if (!element || !main || !heading) {
      if (element) delete element.dataset.hidden;
      return;
    }
    const root = document.documentElement;
    const landing = heading.closest<HTMLElement>("[data-landing]");
    const onRide = Boolean(main.querySelector("#ride"));
    let inView = true;

    function update() {
      /* On the full Ride the cards are pinned, so what counts is where the boat is. */
      const shown = onRide && root.dataset.ride ? Boolean(landing?.hasAttribute("data-arrived")) : inView;
      if (shown) element!.dataset.hidden = "on";
      else delete element!.dataset.hidden;
    }

    const sight = new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting;
      update();
    });
    sight.observe(heading);
    const changes = new MutationObserver(update);
    changes.observe(root, { attributes: true, attributeFilter: ["data-ride"] });
    if (landing) changes.observe(landing, { attributes: true, attributeFilter: ["data-arrived"] });
    update();

    return () => {
      sight.disconnect();
      changes.disconnect();
    };
  }, []);

  return (
    <div ref={holder} data-header-name data-hidden="on">
      {children}
    </div>
  );
}
