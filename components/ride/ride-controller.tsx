"use client";

import { useLayoutEffect } from "react";

import type { LandingId } from "@/content/landings";
import {
  RIDE_QUERY,
  boatPose,
  boatX,
  cardPose,
  landingAfter,
  rawPosition,
  readWheel,
  restingLanding,
  skyOpacity,
  spring,
  sunPose,
  wheelPixels,
  worldPosition,
  type Drift,
  type WheelGesture,
} from "@/lib/ride";

/* The far layer is inset by 12.5% of the width, so a 12vw drift never lets a
   neighboring scene's hills show at a dock. */
const FAR_DRIFT_VW = 12;

/** How long a dragged scrollbar must be still before it settles on a landing. */
const SETTLE_AFTER_MS = 160;
const FORE_DRIFT_VW = 20;
/** Clouds sit far off, so they slide a little across the whole route. */
const CLOUD_DRIFT_VW = 7;
/** How far a finger must travel to count as a swipe. */
const SWIPE_PX = 40;

const pinnedKeySteps: Record<string, number> = {
  ArrowDown: 1,
  ArrowRight: 1,
  PageDown: 1,
  ArrowUp: -1,
  ArrowLeft: -1,
  PageUp: -1,
};

/**
 * The one scroll loop for the Ride. The page is complete HTML without it: this
 * only moves what is already there. On the pinned Ride, one gesture or key press
 * is one landing: the page jumps to that dock, invisibly because everything is
 * pinned, and the world travels there on a spring.
 */
export function RideController() {
  useLayoutEffect(() => {
    const root = document.documentElement;
    /* Next keeps the page you left in the DOM, hidden, and Dry Land has landings
       too, so only look inside the Ride. */
    const ride = document.getElementById("ride");
    if (!ride) return;
    const sections = [...ride.querySelectorAll<HTMLElement>("[data-landing]")];
    const order = sections.map((section) => section.id as LandingId);
    const dots = [...document.querySelectorAll<HTMLElement>("[data-route-dot]")];
    const skies = [...document.querySelectorAll<HTMLElement>("[data-sky-layer]")];
    const boat = document.querySelector<HTMLElement>("[data-boat]");
    const clouds = [...document.querySelectorAll<HTMLElement>("[data-clouds]")];
    const sun = document.querySelector<HTMLElement>("[data-sun]");
    const sunPale = document.querySelector<SVGElement>("[data-sun-pale]");
    const glitter = document.querySelector<HTMLElement>("[data-glitter]");
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
    let drift: Drift = { position: 0, velocity: 0 };
    let lastFrame = 0;
    let gliding = false;
    let lastY = window.scrollY;
    let direction = 1;
    let settleTimer = 0;
    let wheel: WheelGesture | null = null;
    let wheelIsNative = false;
    let touchY: number | null = null;

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

      clouds.forEach((bank) => {
        bank.style.transform = `translate3d(${-world * CLOUD_DRIFT_VW}vw,0,0)`;
      });

      const light = sunPose(world, sections.length - 1);
      if (sun) sun.style.transform = `translate3d(${light.xVw}vw,${light.yVh}vh,0)`;
      if (sunPale) sunPale.style.opacity = String(light.pale);
      if (glitter) {
        glitter.style.transform = `translate3d(${light.xVw}vw,0,0)`;
        glitter.style.opacity = String(light.glitter);
      }

      if (boat) {
        const { x, y, angle } = boatPose(world);
        const center = boatX(world, order, window.innerWidth);
        boat.style.transform = `translate3d(${center + x}px,${y}px,0) rotate(${angle}deg)`;
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

    /* The world follows the page's position on a spring. */
    function paint(now: number) {
      frame = 0;
      const goal = target();
      if (!stage.matches) {
        setCurrent(Math.round(goal));
        return;
      }

      drift = spring(drift, goal, gliding ? Math.min(now - lastFrame, 50) : 16);
      lastFrame = now;
      gliding = drift.position !== goal || drift.velocity !== 0;
      /* The map and the URL follow what is on screen, not where the trip ends. */
      setCurrent(Math.round(drift.position));
      paintStage(drift.position);
      if (gliding) frame = requestAnimationFrame(paint);
    }

    function snap() {
      drift = { position: target(), velocity: 0 };
      gliding = false;
      setCurrent(Math.round(drift.position));
      if (stage.matches) paintStage(drift.position);
    }

    function schedule() {
      if (!frame) frame = requestAnimationFrame(paint);
    }

    /* If the scrollbar stops between landings, finish the trip to the next one. */
    function settle() {
      settleTimer = 0;
      if (!stage.matches) return;
      const landing = restingLanding(
        rawPosition(window.scrollY, tops),
        direction,
        sections.length - 1,
      );
      if (landing !== null) goTo(landing);
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
      window.scrollTo(0, tops[index]);
    }

    function move(step: number) {
      const raw = rawPosition(window.scrollY, tops);
      goTo(landingAfter(raw, step, sections.length - 1));
    }

    /* The footer sits past the last landing and scrolls like a normal page. */
    function leavesRide(direction: number) {
      const end = tops[tops.length - 1];
      return direction > 0 ? window.scrollY >= end - 1 : window.scrollY > end + 1;
    }

    function onWheel(event: WheelEvent) {
      if (!stage.matches || event.ctrlKey) return;
      if (Math.abs(event.deltaX) > Math.abs(event.deltaY)) return;

      const delta = wheelPixels(event.deltaY, event.deltaMode, window.innerHeight);
      const read = readWheel(wheel, event.timeStamp, delta);
      wheel = read.gesture;
      const direction = Math.sign(delta);
      if (!wheel?.stepped || read.step) wheelIsNative = leavesRide(direction);
      if (wheelIsNative && leavesRide(direction)) return;

      event.preventDefault();
      if (read.step) move(read.step);
    }

    function onTouchStart(event: TouchEvent) {
      touchY = event.touches.length === 1 ? event.touches[0].clientY : null;
    }

    function onTouchMove(event: TouchEvent) {
      if (!stage.matches || touchY === null || event.touches.length > 1) return;
      if (!leavesRide(touchY > event.touches[0].clientY ? 1 : -1)) event.preventDefault();
    }

    function onTouchEnd(event: TouchEvent) {
      if (!stage.matches || touchY === null) return;
      const travel = touchY - event.changedTouches[0].clientY;
      touchY = null;
      const step = travel > 0 ? 1 : -1;
      if (Math.abs(travel) >= SWIPE_PX && !leavesRide(step)) move(step);
    }

    function onKeyDown(event: KeyboardEvent) {
      if (event.metaKey || event.ctrlKey || event.altKey) return;
      if (event.key === "]" || event.key === "[") {
        move(event.key === "]" ? 1 : -1);
        return;
      }
      if (event.key === "End" || (event.key === "Home" && stage.matches)) {
        event.preventDefault();
        goTo(event.key === "End" ? sections.length - 1 : 0);
        return;
      }
      if (!stage.matches) return;

      /* Space belongs to a focused link or button. */
      const onControl = (event.target as Element).closest?.("a, button");
      const spaceStep = onControl ? 0 : event.shiftKey ? -1 : 1;
      const step = event.key === " " ? spaceStep : (pinnedKeySteps[event.key] ?? 0);
      if (step === 0 || leavesRide(step)) return;

      event.preventDefault();
      if (!event.repeat) move(step);
    }

    /* Cards are pinned, so the browser will not scroll to a focused link. */
    function onFocusIn(event: FocusEvent) {
      if (!stage.matches) return;
      const target = event.target as HTMLElement;
      const index = sections.findIndex((section) => section.contains(target));
      if (index !== -1 && index !== current) goTo(index);
    }

    root.dataset.rideReady = "on";
    syncLayout();
    measure();
    snap();

    const resizes = new ResizeObserver(remeasure);
    resizes.observe(ride);

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: false });
    window.addEventListener("touchend", onTouchEnd, { passive: true });
    window.addEventListener("resize", remeasure);
    window.addEventListener("keydown", onKeyDown);
    document.addEventListener("focusin", onFocusIn);
    stage.addEventListener("change", remeasure);

    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.clearTimeout(settleTimer);
      resizes.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", onTouchEnd);
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
