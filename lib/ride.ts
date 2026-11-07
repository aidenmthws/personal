import type { LandingId } from "../content/landings.ts";

/**
 * Pure math for the Ride. Scroll position becomes a continuous landing index
 * (`raw`), docking turns that into the world position, and everything visible
 * is derived from the world position.
 *
 * Each landing docks at its section's top, so hash links land docked.
 */

/** The full Ride needs this much room and permission to move. */
export const RIDE_QUERY =
  "(min-width: 1024px) and (min-height: 700px) and (prefers-reduced-motion: no-preference)";

/** How long the page waits for the Ride's script before staying stacked. */
const AFTER_LOAD_MS = 3000;
const HARD_LIMIT_MS = 8000;

/**
 * Runs in <head> before first paint. The stacked page is the default, and this
 * opts in to the pinned layout. If the Ride's script fails or never arrives,
 * it opts back out, because pinned cards cannot move without that script.
 * RideController sets `rideReady` once it is running.
 */
export const rideOptInScript = `(function(){var r=document.documentElement;if(location.pathname!=="/"||!matchMedia(${JSON.stringify(RIDE_QUERY)}).matches)return;r.dataset.ride="on";function o(){if(!("rideReady"in r.dataset))delete r.dataset.ride}addEventListener("error",function(e){if(e.target&&e.target.tagName==="SCRIPT")o()},true);addEventListener("load",function(){setTimeout(o,${AFTER_LOAD_MS})});setTimeout(o,${HARD_LIMIT_MS})})()`;

export const skyStops = [
  "predawn",
  "sunrise",
  "gold",
  "bright",
  "amber",
  "dusk",
] as const;

export type SkyStop = (typeof skyStops)[number];

export const landingSky: Record<LandingId, SkyStop> = {
  shore: "predawn",
  boatman: "predawn",
  source: "sunrise",
  canal: "gold",
  water: "bright",
  lake: "bright",
  channels: "amber",
  market: "amber",
  harbor: "dusk",
};

/** How strongly the world slows at a dock. At 1 it would stop dead. */
const DOCK_HOLD = 0.92;

/** The world closes on the scroll position with this time constant. */
const GLIDE_MS = 90;
const SETTLED = 0.0005;

const clamp = (value: number, min = 0, max = 1) =>
  Math.min(max, Math.max(min, value));

/**
 * One continuous curve from dock to dock. Speed falls to 8% of scroll speed at
 * each landing and peaks midway, with no point where it stalls or jumps.
 */
export function easeDock(t: number) {
  const progress = clamp(t);
  return progress - (DOCK_HOLD * Math.sin(2 * Math.PI * progress)) / (2 * Math.PI);
}

/** Where a card is fully readable, as a share of the way between landings. */
const DOCK_ZONE = 0.2;

/**
 * Scrolling is native, so it can stop between two landings, where no card is
 * readable. Once it stops there, this picks the landing to settle on: the next
 * one in the direction of travel. It returns null when already docked.
 */
export function restingLanding(raw: number, direction: number, last: number) {
  const index = Math.floor(raw);
  const between = raw - index;
  if (between <= DOCK_ZONE || between >= 1 - DOCK_ZONE) return null;
  return Math.min(last, direction < 0 ? index : index + 1);
}

/** Moves the world toward the scroll position, at any frame rate. */
export function glide(shown: number, target: number, elapsedMs: number) {
  const next = target + (shown - target) * Math.exp(-elapsedMs / GLIDE_MS);
  return Math.abs(target - next) < SETTLED ? target : next;
}

/** Converts a scroll offset to a landing index, given each landing's top. */
export function rawPosition(y: number, tops: number[]) {
  const last = tops.length - 1;
  if (y <= tops[0]) return 0;
  if (y >= tops[last]) return last;

  let index = 0;
  while (y >= tops[index + 1]) index += 1;
  return index + (y - tops[index]) / (tops[index + 1] - tops[index]);
}

export function worldPosition(raw: number) {
  const index = Math.floor(raw);
  return index + easeDock(raw - index);
}

/** Opacity of a sky layer. Layers stack in order, so each fades in over the last. */
export function skyOpacity(layer: number, world: number, order: LandingId[]) {
  if (layer === 0) return 1;

  const index = clamp(Math.floor(world), 0, order.length - 1);
  const next = Math.min(index + 1, order.length - 1);
  const from = skyStops.indexOf(landingSky[order[index]]);
  const to = skyStops.indexOf(landingSky[order[next]]);
  const position = from + (to - from) * (world - index);

  return clamp(position - layer + 1);
}

/** A card holds still at its dock and fades out as the world moves on. */
export function cardPose(index: number, world: number) {
  const distance = Math.abs(index - world);
  return {
    opacity: clamp(1 - (distance - 0.07) / 0.17),
    shiftVw: (index - world) * 16,
  };
}

/** The boat's gently winding path, in pixels and degrees. */
export function boatPose(world: number) {
  const swing = 1.1;
  const rise = 14;
  return {
    x: 10 * Math.sin(world * 0.7),
    y: rise * Math.sin(world * swing),
    angle: 1.5 * Math.cos(world * swing),
  };
}
