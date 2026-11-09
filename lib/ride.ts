import type { LandingId } from "../content/landings.ts";

/**
 * Pure math for the Ride. Scroll position becomes a continuous landing index
 * (`raw`), docking turns that into the world position, and everything visible
 * is derived from the world position.
 *
 * Each landing docks at its section's top, so hash links land docked. A scroll
 * gesture or key press moves the page straight to the next dock, and the world
 * then travels there on a spring.
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

/** How quickly the world closes on its target, per second. */
const SPRING_RATE = 8;
const SETTLED_POSITION = 0.0005;
const SETTLED_VELOCITY = 0.005;

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
 * Dragging the scrollbar can stop between two landings, where no card is
 * readable. Once it stops there, this picks the landing to settle on: the next
 * one in the direction of travel. It returns null when already docked.
 */
export function restingLanding(raw: number, direction: number, last: number) {
  const index = Math.floor(raw);
  const between = raw - index;
  if (between <= DOCK_ZONE || between >= 1 - DOCK_ZONE) return null;
  return Math.min(last, direction < 0 ? index : index + 1);
}

/** The landing one step from here. Between landings, the nearest in that direction. */
export function landingAfter(raw: number, step: number, last: number) {
  const nearest = Math.round(raw);
  const from = Math.abs(raw - nearest) < 0.02 ? nearest : raw;
  return clamp(step > 0 ? Math.floor(from) + 1 : Math.ceil(from) - 1, 0, last);
}

export type Drift = { position: number; velocity: number };

/**
 * Moves the world toward its target on a critically damped spring, at any frame
 * rate. It eases in and out without overshoot, and velocity carries through a
 * change of target, so a second scroll mid-trip never makes it stutter.
 */
export function spring({ position, velocity }: Drift, target: number, elapsedMs: number): Drift {
  const time = elapsedMs / 1000;
  const offset = position - target;
  const push = velocity + SPRING_RATE * offset;
  const decay = Math.exp(-SPRING_RATE * time);
  const next = {
    position: target + (offset + push * time) * decay,
    velocity: (push - SPRING_RATE * (offset + push * time)) * decay,
  };

  const settled =
    Math.abs(next.position - target) < SETTLED_POSITION &&
    Math.abs(next.velocity) < SETTLED_VELOCITY;
  return settled ? { position: target, velocity: 0 } : next;
}

/** Input this far apart in time belongs to two separate gestures. */
const WHEEL_GAP_MS = 150;
/** A gesture must travel this far to count, so a brushed trackpad stays put. */
const WHEEL_THRESHOLD = 12;
/** Smaller reversals are finger jitter. */
const WHEEL_REVERSAL = 4;
/** No new gesture starts this soon after a step, even if the events stall. */
const WHEEL_REARM_MS = 250;
/** How much a decaying gesture must grow, at least, to be a second push. */
const WHEEL_PUSH_RATIO = 3;
const WHEEL_PUSH_SIZE = 16;
const WHEEL_LINE_PX = 16;

/** Browsers report wheel deltas in pixels, lines, or pages. */
export function wheelPixels(delta: number, deltaMode: number, pageHeight: number) {
  if (deltaMode === 1) return delta * WHEEL_LINE_PX;
  if (deltaMode === 2) return delta * pageHeight;
  return delta;
}

export type WheelGesture = {
  at: number;
  direction: number;
  travelled: number;
  stepped: boolean;
  steppedAt: number;
  peak: number;
  floor: number;
};

/** A new push during momentum: the deltas had faded, and now they jump back up. */
function isSecondPush(gesture: WheelGesture, time: number, size: number) {
  return (
    gesture.stepped &&
    time - gesture.steppedAt >= WHEEL_REARM_MS &&
    gesture.floor <= gesture.peak * 0.6 &&
    size >= Math.max(gesture.floor * WHEEL_PUSH_RATIO, gesture.floor + WHEEL_PUSH_SIZE)
  );
}

/**
 * Turns the stream of wheel events into one step per gesture. A trackpad keeps
 * sending momentum for a second or more after the finger lifts, and all of that
 * belongs to the step already taken.
 */
export function readWheel(gesture: WheelGesture | null, time: number, delta: number) {
  const size = Math.abs(delta);
  if (size === 0) return { gesture, step: 0 };

  const direction = delta > 0 ? 1 : -1;
  const reversed = gesture && direction !== gesture.direction;
  if (gesture && reversed && size < WHEEL_REVERSAL && time - gesture.at <= WHEEL_GAP_MS) {
    return { gesture: { ...gesture, at: time }, step: 0 };
  }

  const justStepped =
    gesture && gesture.stepped && time - gesture.steppedAt < WHEEL_REARM_MS;
  const isNew =
    !gesture ||
    reversed ||
    (time - gesture.at > WHEEL_GAP_MS && !justStepped) ||
    isSecondPush(gesture, time, size);
  const base: WheelGesture = isNew
    ? { at: time, direction, travelled: 0, stepped: false, steppedAt: 0, peak: size, floor: size }
    : gesture;

  const travelled = base.travelled + size;
  const steps = !base.stepped && travelled >= WHEEL_THRESHOLD;
  return {
    gesture: {
      ...base,
      at: time,
      travelled,
      stepped: base.stepped || steps,
      steppedAt: steps ? time : base.steppedAt,
      peak: Math.max(base.peak, size),
      floor: size >= base.peak ? size : Math.min(base.floor, size),
    },
    step: steps ? direction : 0,
  };
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

/** The sky's height above the waterline, as a share of the viewport height. */
const HORIZON_VH = 70;
const SUN_RADIUS_VH = 8;
/** The share of the route the sun has crossed starts after the Shore, in the dark. */
const SUNRISE = 0.06;
const DAYLIGHT = 0.92;

/**
 * One day along the route. The sun is below the water at the Shore, climbs to
 * its peak around Broad water, and has set by the Harbor.
 */
export function sunPose(world: number, last: number) {
  const arc = clamp((clamp(world / last) - SUNRISE) / DAYLIGHT);
  const height = Math.sin(Math.PI * arc) ** 1.4;
  return {
    xVw: 84 - 52 * arc,
    yVh: HORIZON_VH + SUN_RADIUS_VH - height * 62,
    /** How far the disc has paled from sunrise orange toward midday. */
    pale: clamp((height - 0.35) / 0.4),
    /** Light on the water, gone once the sun is down. */
    glitter: Math.round(clamp(height * 3) * 1000) / 1000,
  };
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
