"use client";

import { useLayoutEffect } from "react";

import type { LandingId } from "@/content/landings";
import {
  RIDE_QUERY,
  boatMotion,
  boatPose,
  boatX,
  cardPose,
  landingAfter,
  poleAngle,
  rawPosition,
  readWheel,
  readingTime,
  restingLanding,
  routePoint,
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
const FRAME_DRIFT_VW = 34;
/** Clouds sit far off, so they slide a little across the whole route. */
const CLOUD_DRIFT_VW = 7;
/** How close to a dock the boat must be for that landing's arrival to play. */
const ARRIVE_WITHIN = 0.08;
/** The mooring comes loose before the first trip starts. */
const CAST_OFF_MS = 520;
/** A trip between landings, added to each card's reading time. */
const TRIP_MS = 500;
/** The pause at the Shore when a finished ride starts over. */
const SHORE_MS = 1000;
/** Controls in a card. Using one means the visitor wants the ride to wait. */
const CARD_CONTROL = '[data-card] :is(a, button, summary, [role="toolbar"])';
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
    const routeBoat = document.querySelector<HTMLElement>("[data-route-boat]");
    const tourToggle = document.querySelector<HTMLElement>("[data-tour-toggle]");
    const tourStatus = document.querySelector<HTMLElement>("[data-tour-status]");
    const tourProgress = document.querySelector<HTMLElement>("[data-tour-progress]");
    const pole = boat?.querySelector<SVGElement>("[data-pole]");
    const wake = boat?.querySelector<SVGElement>("[data-wake]");
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
        frame: scene?.querySelector<SVGElement>('[data-layer="frame"]'),
      };
    });
    const cards = sections.map((section) =>
      section.querySelector<HTMLElement>("[data-card]"),
    );

    const stage = window.matchMedia(RIDE_QUERY);
    let tops: number[] = [];
    let frame = 0;
    let current = -1;
    let arrived = -1;
    let castOffTimer = 0;
    /* The guided ride. A paused ride keeps its clock, and a ride the visitor
       has taken over from drops it. */
    let riding = false;
    let tourStop = -1;
    let clock: Animation | null = null;
    let held = false;
    let pointerX = -1;
    let pointerY = -1;
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
      if (index === 0 && !castOffTimer) delete root.dataset.castingOff;
      dots.forEach((dot, position) => {
        if (position === index) dot.setAttribute("aria-current", "location");
        else dot.removeAttribute("aria-current");
      });
      if (!first) window.history.replaceState(null, "", `#${order[index]}`);
      labelTourToggle();
    }

    /* A landing's small event plays once the boat is almost docked. */
    function markArrival(world: number) {
      const nearest = Math.round(world);
      const landing = Math.abs(world - nearest) < ARRIVE_WITHIN ? nearest : -1;
      if (landing === arrived) return;
      sections[arrived]?.removeAttribute("data-arrived");
      arrived = landing;
      sections[arrived]?.setAttribute("data-arrived", "on");
    }

    function paintStage(world: number, velocity = 0) {
      markArrival(world);
      scenes.forEach(({ scene, far, fore, frame }, index) => {
        if (!scene) return;
        const offset = index - world;
        const nearby = Math.abs(offset) < 1.6;
        scene.style.visibility = nearby ? "visible" : "hidden";
        if (!nearby) return;
        scene.style.transform = `translate3d(${offset * 100}vw,0,0)`;
        if (far) far.style.transform = `translate3d(${-offset * FAR_DRIFT_VW}vw,0,0)`;
        if (fore) fore.style.transform = `translate3d(${offset * FORE_DRIFT_VW}vw,0,0)`;
        if (frame) frame.style.transform = `translate3d(${offset * FRAME_DRIFT_VW}vw,0,0)`;
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

      if (routeBoat) {
        const { x, y } = routePoint(world);
        routeBoat.style.transform = `translate3d(${x}px,${y}px,0)`;
      }

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
        const motion = boatMotion(velocity);
        const center = boatX(world, order, window.innerWidth);
        boat.style.transform = `translate3d(${center + x}px,${y}px,0) rotate(${angle + motion.lean}deg)`;
        if (pole) pole.style.transform = `rotate(${poleAngle(world)}deg)`;
        if (wake) {
          wake.style.opacity = String(motion.wake);
          wake.style.transform = `scaleX(${motion.direction})`;
        }
      }
    }

    function clearStage() {
      const moved = [
        ...scenes.flatMap(({ scene, far, fore, frame }) => [scene, far, fore, frame]),
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
      paintStage(drift.position, drift.velocity);
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

    function labelTourToggle() {
      if (!tourToggle) return;
      const { pause, play, again } = tourToggle.dataset;
      const label = riding ? pause : current === sections.length - 1 ? again : play;
      if (label) tourToggle.textContent = label;
    }

    function syncClock() {
      if (!clock || !riding) return;
      if (held || document.hidden) clock.pause();
      else clock.play();
    }

    /* The progress bar's animation is the timer, so pausing one pauses both. */
    function waitAtStop(duration: number) {
      clock = tourProgress?.animate(
        [
          { opacity: 1, transform: "scaleX(0)" },
          { opacity: 1, transform: "scaleX(1)" },
        ],
        { duration },
      ) ?? null;
      if (!clock) return;
      clock.onfinish = () => {
        clock = null;
        if (tourStop === 0) castOff();
        else sail();
      };
      syncClock();
    }

    function readStop(index: number) {
      const text = sections[index].querySelector("[data-card]")?.textContent ?? "";
      waitAtStop(TRIP_MS + readingTime(text.trim().split(/\s+/).length));
    }

    /* The page jumps to the dock and the spring carries the world there. */
    function sail() {
      tourStop += 1;
      held = false;
      goTo(tourStop);
      if (tourStatus) tourStatus.textContent = dots[tourStop]?.textContent ?? "";
      if (tourStop === sections.length - 1) {
        riding = false;
        labelTourToggle();
      } else {
        readStop(tourStop);
      }
    }

    function castOff() {
      root.dataset.castingOff = "on";
      castOffTimer = window.setTimeout(() => {
        castOffTimer = 0;
        sail();
      }, CAST_OFF_MS);
    }

    /* Starts from wherever the visitor is, and a finished ride starts over. */
    function startRide() {
      stopRide();
      riding = true;
      held = false;
      tourStop = Math.round(rawPosition(window.scrollY, tops));
      if (tourStop === sections.length - 1) {
        tourStop = 0;
        goTo(0);
        waitAtStop(SHORE_MS);
      } else if (tourStop === 0) {
        castOff();
      } else {
        readStop(tourStop);
      }
      labelTourToggle();
    }

    function pauseRide() {
      if (!riding || !clock) return;
      riding = false;
      clock.pause();
      labelTourToggle();
    }

    /* The visitor has taken the pole. Cast off picks up from where they are. */
    function stopRide() {
      riding = false;
      held = false;
      clock?.cancel();
      clock = null;
      window.clearTimeout(castOffTimer);
      castOffTimer = 0;
      if (current === 0) delete root.dataset.castingOff;
      labelTourToggle();
    }

    function onTourToggle() {
      if (riding && castOffTimer) stopRide();
      else if (riding) pauseRide();
      else if (clock) {
        riding = true;
        syncClock();
        labelTourToggle();
      } else startRide();
    }

    /* Without the full Ride, Cast off is a plain hash link. */
    function onClick(event: MouseEvent) {
      if (!stage.matches) return;
      const target = event.target as Element;
      if (target.closest?.("[data-cast-off]")) {
        event.preventDefault();
        startRide();
        /* The link is leaving with its card, so hand focus to the pause control. */
        tourToggle?.focus({ preventScroll: true });
      } else if (target.closest?.(CARD_CONTROL)) {
        pauseRide();
      }
    }

    /* Pointing at a control holds the ride, without stopping it. Only real
       movement counts, because a card can appear under a mouse left at rest. */
    function onPointerMove(event: PointerEvent) {
      if (event.clientX === pointerX && event.clientY === pointerY) return;
      pointerX = event.clientX;
      pointerY = event.clientY;
      held = (event.target as Element).closest?.(CARD_CONTROL) != null;
      syncClock();
    }

    function onScroll() {
      const y = window.scrollY;
      if (y !== lastY) direction = y > lastY ? 1 : -1;
      lastY = y;
      /* Anything that moves the page off the ride's dock is the visitor's doing:
         the scrollbar, the route map, a hash link, Home, or End. */
      if ((riding || clock) && Math.abs(y - tops[tourStop]) > 2) stopRide();
      schedule();
      window.clearTimeout(settleTimer);
      settleTimer = window.setTimeout(settle, SETTLE_AFTER_MS);
    }

    function remeasure() {
      syncLayout();
      if (!stage.matches) clearStage();
      const wasPinned = root.dataset.ride === "on";
      measure();
      if (!stage.matches) stopRide();
      else if (riding || clock) window.scrollTo(0, tops[tourStop]);
      if (wasPinned) schedule();
      else snap();
    }

    function goTo(index: number) {
      window.scrollTo(0, tops[index]);
    }

    function move(step: number) {
      stopRide();
      const raw = rawPosition(window.scrollY, tops);
      goTo(landingAfter(raw, step, sections.length - 1));
    }

    /* The footer sits past the last landing and scrolls like a normal page. */
    function leavesRide(direction: number) {
      const end = tops[tops.length - 1];
      return direction > 0 ? window.scrollY >= end - 1 : window.scrollY > end + 1;
    }

    /* A tall card scrolls on its own before the river moves. */
    function scrollsInside(target: EventTarget | null, direction: number) {
      const card = (target as Element | null)?.closest?.<HTMLElement>("[data-card]");
      if (!card || card.scrollHeight <= card.clientHeight + 1) return false;
      return direction > 0
        ? card.scrollTop + card.clientHeight < card.scrollHeight - 1
        : card.scrollTop > 0;
    }

    function onWheel(event: WheelEvent) {
      if (!stage.matches || event.ctrlKey) return;
      if (scrollsInside(event.target, Math.sign(event.deltaY))) return;
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
      const swipe = touchY > event.touches[0].clientY ? 1 : -1;
      if (scrollsInside(event.target, swipe)) return;
      if (!leavesRide(swipe)) event.preventDefault();
    }

    function onTouchEnd(event: TouchEvent) {
      if (!stage.matches || touchY === null) return;
      const travel = touchY - event.changedTouches[0].clientY;
      touchY = null;
      const step = travel > 0 ? 1 : -1;
      if (scrollsInside(event.target, step)) return;
      if (Math.abs(travel) >= SWIPE_PX && !leavesRide(step)) move(step);
    }

    function onKeyDown(event: KeyboardEvent) {
      if (event.metaKey || event.ctrlKey || event.altKey) return;
      if (event.key === "Tab") stopRide();
      /* A skill group's arrow keys move between its jars. */
      if ((event.target as Element).closest?.('[role="toolbar"]')) return;
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
      const onControl = (event.target as Element).closest?.("a, button, summary");
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

    ride.addEventListener("click", onClick);
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    tourToggle?.addEventListener("click", onTourToggle);
    document.addEventListener("visibilitychange", syncClock);
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
      stopRide();
      resizes.disconnect();
      ride.removeEventListener("click", onClick);
      window.removeEventListener("pointermove", onPointerMove);
      tourToggle?.removeEventListener("click", onTourToggle);
      document.removeEventListener("visibilitychange", syncClock);
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
      delete root.dataset.castingOff;
      delete root.dataset.ride;
      delete root.dataset.rideReady;
    };
  }, []);

  return null;
}
