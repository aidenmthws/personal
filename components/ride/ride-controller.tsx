"use client";

import { useLayoutEffect } from "react";

import type { LandingId } from "@/content/landings";
import {
  RIDE_QUERY,
  boatPose,
  cardPose,
  glide,
  rawPosition,
  restingLanding,
  skyOpacity,
  worldPosition,
} from "@/lib/ride";

/* The far layer is inset by 12.5% of the width, so a 12vw drift never lets a
   neighboring scene's hills show at a dock. */
const FAR_DRIFT_VW = 12;

/** How long scrolling must be still, momentum included, before it settles. */
const SETTLE_AFTER_MS = 160;
const FORE_DRIFT_VW = 20;

/**
 * The one scroll loop for the Ride. The page is complete HTML without it: this
 * only moves what is already there, and scrolling stays native throughout.
 */
export function RideController() {
  useLayoutEffect(() => {
    const root = document.documentElement;
    const sections = [...document.querySelectorAll<HTMLElement>("[data-landing]")];
    const order = sections.map((section) => section.id as LandingId);
    const dots = [...document.querySelectorAll<HTMLElement>("[data-route-dot]")];
    const skies = [...document.querySelectorAll<HTMLElement>("[data-sky-layer]")];
    const boat = document.querySelector<HTMLElement>("[data-boat]");
    const scenes = sections.map((section) => {
      const scene = section.querySelector<HTMLElement>("[data-scene]");
      return {
        scene,
        far: scene?.querySelector<SVGElement>('[data-layer="far"]'),
        fore: scene?.querySelector<SVGElement>('[data-layer="fore"]'),
      };
    });
    const cards = sections.map((section) =>
      section.querySelector<HTMLElement>("[data-card]"),
    );

    const stage = window.matchMedia(RIDE_QUERY);
    let tops: number[] = [];
    let frame = 0;
    let current = -1;
    let shown = 0;
    let lastFrame = 0;
    let gliding = false;
    let lastY = window.scrollY;
    let direction = 1;
    let settleTimer = 0;

    function syncLayout() {
      if (stage.matches) root.dataset.ride = "on";
      else delete root.dataset.ride;
    }

    /* A landing is reached once its top meets the sticky header, if there is one. */
    function measure() {
      const scroll = window.scrollY;
      const inset = parseFloat(getComputedStyle(root).scrollPaddingTop) || 0;
      tops = sections.map(
        (section) => Math.floor(section.getBoundingClientRect().top + scroll - inset),
      );
    }

    function setCurrent(index: number) {
      if (index === current) return;
      const first = current === -1;
      current = index;
      dots.forEach((dot, position) => {
        if (position === index) dot.setAttribute("aria-current", "location");
        else dot.removeAttribute("aria-current");
      });
      if (!first) window.history.replaceState(null, "", `#${order[index]}`);
    }

    function paintStage(world: number) {
      scenes.forEach(({ scene, far, fore }, index) => {
        if (!scene) return;
        const offset = index - world;
        const nearby = Math.abs(offset) < 1.6;
        scene.style.visibility = nearby ? "visible" : "hidden";
        if (!nearby) return;
        scene.style.transform = `translate3d(${offset * 100}vw,0,0)`;
        if (far) far.style.transform = `translate3d(${-offset * FAR_DRIFT_VW}vw,0,0)`;
        if (fore) fore.style.transform = `translate3d(${offset * FORE_DRIFT_VW}vw,0,0)`;
      });

      cards.forEach((card, index) => {
        if (!card) return;
        const { opacity, shiftVw } = cardPose(index, world);
        card.style.opacity = String(opacity);
        card.style.transform = `translate3d(${shiftVw}vw,0,0)`;
        card.style.pointerEvents = opacity > 0.5 ? "auto" : "none";
      });

      skies.forEach((sky, layer) => {
        sky.style.opacity = String(skyOpacity(layer, world, order));
      });

      if (boat) {
        const { x, y, angle } = boatPose(world);
        boat.style.transform = `translate3d(${x}px,${y}px,0) rotate(${angle}deg)`;
      }
    }

    function clearStage() {
      const moved = [
        ...scenes.flatMap(({ scene, far, fore }) => [scene, far, fore]),
        ...cards,
        boat,
      ];
      moved.forEach((element) => {
        element?.style.removeProperty("transform");
        element?.style.removeProperty("visibility");
        element?.style.removeProperty("opacity");
        element?.style.removeProperty("pointer-events");
      });
    }

    function target() {
      return worldPosition(rawPosition(window.scrollY, tops));
    }

    /* The world follows native scroll, smoothing wheel steps along the way. */
    function paint(now: number) {
      frame = 0;
      const goal = target();
      if (!stage.matches) {
        setCurrent(Math.round(goal));
        return;
      }

      shown = glide(shown, goal, gliding ? Math.min(now - lastFrame, 50) : 16);
      lastFrame = now;
      gliding = shown !== goal;
      /* The map and the URL follow what is on screen, not where scroll is headed. */
      setCurrent(Math.round(shown));
      paintStage(shown);
      if (gliding) frame = requestAnimationFrame(paint);
    }

    function snap() {
      shown = target();
      gliding = false;
      setCurrent(Math.round(shown));
      if (stage.matches) paintStage(shown);
    }

    function schedule() {
      if (!frame) frame = requestAnimationFrame(paint);
    }

    /* If scrolling stops between landings, finish the trip to the next one. */
    function settle() {
      settleTimer = 0;
      if (!stage.matches) return;
      const landing = restingLanding(
        rawPosition(window.scrollY, tops),
        direction,
        sections.length - 1,
      );
      if (landing !== null) window.scrollTo({ top: tops[landing], behavior: "smooth" });
    }

    function onScroll() {
      const y = window.scrollY;
      if (y !== lastY) direction = y > lastY ? 1 : -1;
      lastY = y;
      schedule();
      window.clearTimeout(settleTimer);
      settleTimer = window.setTimeout(settle, SETTLE_AFTER_MS);
    }

    function remeasure() {
      syncLayout();
      if (!stage.matches) clearStage();
      const wasPinned = root.dataset.ride === "on";
      measure();
      if (wasPinned) schedule();
      else snap();
    }

    function goTo(index: number) {
      const target = Math.min(sections.length - 1, Math.max(0, index));
      window.scrollTo({ top: tops[target] });
    }

    function onKeyDown(event: KeyboardEvent) {
      if (event.metaKey || event.ctrlKey || event.altKey) return;
      if (event.key === "]") goTo(current + 1);
      else if (event.key === "[") goTo(current - 1);
      else if (event.key === "End") {
        event.preventDefault();
        goTo(sections.length - 1);
      } else return;
    }

    /* Cards are pinned, so the browser will not scroll to a focused link. */
    function onFocusIn(event: FocusEvent) {
      if (!stage.matches) return;
      const target = event.target as HTMLElement;
      const index = sections.findIndex((section) => section.contains(target));
      if (index !== -1 && index !== current) {
        window.scrollTo({ top: tops[index], behavior: "instant" });
      }
    }

    root.dataset.rideReady = "on";
    syncLayout();
    measure();
    snap();

    const resizes = new ResizeObserver(remeasure);
    const ride = document.getElementById("ride");
    if (ride) resizes.observe(ride);

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", remeasure);
    window.addEventListener("keydown", onKeyDown);
    document.addEventListener("focusin", onFocusIn);
    stage.addEventListener("change", remeasure);

    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.clearTimeout(settleTimer);
      resizes.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", remeasure);
      window.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("focusin", onFocusIn);
      stage.removeEventListener("change", remeasure);
      delete root.dataset.ambient;
      delete root.dataset.ride;
      delete root.dataset.rideReady;
    };
  }, []);

  return null;
}
