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
  "dawn",
  "sunrise",
  "gold",
  "bright",
  "amber",
  "sunset",
  "dusk",
] as const;

export type SkyStop = (typeof skyStops)[number];

export const landingSky: Record<LandingId, SkyStop> = {
  shore: "dawn",
  boatman: "dawn",
  source: "sunrise",
  canal: "gold",
  water: "bright",
  lake: "bright",
  channels: "amber",
  market: "sunset",
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
/** A busy frame can hold up momentum for this long and still be one gesture. */
const WHEEL_STALL_MS = 700;

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
 * Events stopped mid-momentum, then came back at the level they had faded to.
 * The fade tells this apart from a mouse wheel, whose notches are all one size.
 */
function isStalledMomentum(gesture: WheelGesture, time: number, size: number) {
  return (
    gesture.stepped &&
    gesture.floor <= gesture.peak * 0.6 &&
    time - gesture.at <= WHEEL_STALL_MS &&
    size <= gesture.floor * 2 + 8
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
    (time - gesture.at > WHEEL_GAP_MS && !justStepped && !isStalledMomentum(gesture, time, size)) ||
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
/* The day starts before the Shore, so the sun is just up there, low over the
   far palms, and is back under the water exactly at the Harbor. */
const SUNRISE = -0.1416;
const DAYLIGHT = 1 - SUNRISE;

/**
 * One day along the route. The sun is rising out of the water at the Shore, climbs to
 * its peak around First canal, and has set by the Harbor.
 */
export function sunPose(world: number, last: number) {
  const arc = clamp((clamp(world / last) - SUNRISE) / DAYLIGHT);
  const height = Math.sin(Math.PI * arc) ** 1.4;
  return {
    /* Cards sit to either side, so the sun keeps to the open middle of the sky,
       starting between the Shore card and the boat. */
    xVw: 56 - 14 * arc,
    yVh: HORIZON_VH + SUN_RADIUS_VH - height * 62,
    /** How far the disc has paled from sunrise orange toward midday. */
    pale: clamp((height - 0.6) / 0.3),
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

/**
 * How the boat answers its speed, in landings per second. It leans back as it
 * pulls away, trails a wake, and settles as the spring brings it to the dock.
 */
export function boatMotion(velocity: number) {
  const direction = velocity < 0 ? -1 : 1;
  const speed = Math.abs(velocity);
  return {
    lean: -direction * clamp(speed * 2, 0, 4),
    wake: clamp(speed / 1.6),
    direction,
  };
}

/** The pole swings through one stroke per landing and is upright at a dock. */
export function poleAngle(world: number) {
  return 9 * Math.sin(world * 2 * Math.PI);
}

/** Space between stops on the route map, in pixels. */
export const ROUTE_STEP = 64;
export const ROUTE_HEIGHT = 58;
const ROUTE_WAVE = [3, -3, 4, -2, 3, -4, 2, -3, 2];

/** A point on the route map's river. Stops are `ROUTE_STEP` apart. */
export function routePoint(world: number) {
  const last = ROUTE_WAVE.length - 1;
  const index = clamp(Math.floor(world), 0, last);
  const next = Math.min(index + 1, last);
  const t = clamp(world - index);
  const eased = t * t * (3 - 2 * t);
  return {
    x: ROUTE_STEP / 2 + world * ROUTE_STEP,
    y: 44 + ROUTE_WAVE[index] + (ROUTE_WAVE[next] - ROUTE_WAVE[index]) * eased,
  };
}

const READ_BASE_MS = 1000;
const READ_PER_WORD_MS = 130;
const READ_MIN_MS = 2500;
const READ_MAX_MS = 7500;

/** How long the guided ride stays at a card, from how much there is to read. */
export function readingTime(words: number) {
  return clamp(READ_BASE_MS + words * READ_PER_WORD_MS, READ_MIN_MS, READ_MAX_MS);
}

export type LandingStage = {
  /** Which side of the screen holds the card, so the art can fill the other. */
  side: "left" | "right";
  /** Where the boat docks, as the center of the boat in viewport widths. */
  boatVw: number;
  /** Wide cards hold long lists, so they stay short enough for small windows. */
  card?: "wide";
  /** The part of the art a narrow screen crops to, from 0 (left) to 1 (right). */
  focus: number;
};

export const landingStage: Record<LandingId, LandingStage> = {
  shore: { side: "left", boatVw: 68, focus: 0.74 },
  boatman: { side: "right", boatVw: 42, focus: 0.24 },
  source: { side: "left", boatVw: 58, focus: 0.74 },
  canal: { side: "right", boatVw: 40, focus: 0.26 },
  water: { side: "left", boatVw: 52, focus: 0.8 },
  lake: { side: "right", boatVw: 42, focus: 0.22 },
  channels: { side: "left", boatVw: 53, focus: 0.7 },
  market: { side: "right", boatVw: 34, focus: 0.3, card: "wide" },
  harbor: { side: "left", boatVw: 58, focus: 0.74 },
};

const CARD_INSET_VW = 6;
const CARD_INSET_MIN_PX = 32;
const CARD_WIDTH_PX = 512;
const WIDE_CARD_WIDTH_PX = 672;
const BOAT_CLEARANCE_PX = 24;

/** The boat's width in pixels. It grows with the art on wide screens. */
export function boatWidth(viewport: number) {
  return Math.max(240, viewport / 6);
}

/** Where the boat docks at one landing, kept clear of that landing's card. */
export function boatDock(id: LandingId, viewport: number) {
  const { side, boatVw, card } = landingStage[id];
  const center = (boatVw / 100) * viewport;
  const cardEdge = Math.max(CARD_INSET_MIN_PX, (CARD_INSET_VW / 100) * viewport) +
    (card === "wide" ? WIDE_CARD_WIDTH_PX : CARD_WIDTH_PX);
  const clearance = cardEdge + BOAT_CLEARANCE_PX + boatWidth(viewport) / 2;
  return side === "left"
    ? Math.max(center, clearance)
    : Math.min(center, viewport - clearance);
}

/** The boat's center between docks, in pixels from the left of the screen. */
export function boatX(world: number, order: LandingId[], viewport: number) {
  const index = clamp(Math.floor(world), 0, order.length - 1);
  const next = Math.min(index + 1, order.length - 1);
  const t = clamp(world - index);
  const eased = t * t * (3 - 2 * t);
  const from = boatDock(order[index], viewport);
  return from + (boatDock(order[next], viewport) - from) * eased;
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
