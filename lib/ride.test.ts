import assert from "node:assert/strict";
import { test } from "node:test";

import { landings } from "../content/landings.ts";
import {
  boatDock,
  boatMotion,
  boatPose,
  boatWidth,
  boatX,
  cardPose,
  easeDock,
  landingAfter,
  landingStage,
  poleAngle,
  rawPosition,
  readWheel,
  readingTime,
  restingLanding,
  rideOptInScript,
  routePoint,
  skyOpacity,
  skyStops,
  spring,
  sunPose,
  wheelPixels,
  worldPosition,
  type WheelGesture,
} from "./ride.ts";

const order = landings.map((landing) => landing.id);

test("the world slows at the dock and moves between landings", () => {
  assert.equal(easeDock(0), 0);
  assert.equal(easeDock(1), 1);
  assert.equal(easeDock(0.5), 0.5);
  assert.ok(easeDock(0.2) < 0.07);
  assert.ok(easeDock(0.8) > 0.93);
});

test("the world's speed never jumps, so it cannot stutter at a dock", () => {
  const step = 0.001;
  const speed = (t: number) => (easeDock(t + step) - easeDock(t)) / step;

  for (let t = 0; t < 0.998; t += step) {
    assert.ok(Math.abs(speed(t + step) - speed(t)) < 0.05, `t ${t}`);
  }
  assert.ok(Math.abs(speed(0) - speed(0.998)) < 0.05, "across a landing");
});

const still = { position: 0, velocity: 0 };

function runSpring(frames: number, frameMs: number, start = still, target = 1) {
  let drift = start;
  for (let frame = 0; frame < frames; frame += 1) drift = spring(drift, target, frameMs);
  return drift;
}

test("a trip eases in, never overshoots, and arrives in under a second", () => {
  let drift = still;
  let fastest = 0;
  for (let elapsed = 0; elapsed < 960; elapsed += 16) {
    drift = spring(drift, 1, 16);
    assert.ok(drift.position <= 1);
    fastest = Math.max(fastest, drift.velocity);
  }
  assert.ok(drift.position > 0.99);
  assert.ok(runSpring(1, 16).velocity < fastest);
});

test("the spring is the same at any frame rate", () => {
  const at60 = runSpring(30, 16);
  const at120 = runSpring(60, 8);
  assert.ok(Math.abs(at60.position - at120.position) < 1e-9);
  assert.ok(Math.abs(at60.velocity - at120.velocity) < 1e-9);
});

test("the spring lands exactly on the target and stops", () => {
  assert.deepEqual(spring({ position: 0.9999, velocity: 0 }, 1, 16), {
    position: 1,
    velocity: 0,
  });
});

test("a second scroll mid-trip keeps the world's speed", () => {
  const midway = runSpring(10, 16);
  const retargeted = spring(midway, 2, 0);
  assert.ok(Math.abs(retargeted.position - midway.position) < 1e-9);
  assert.ok(Math.abs(retargeted.velocity - midway.velocity) < 1e-9);
});

function countSteps(events: [time: number, delta: number][]) {
  let gesture: WheelGesture | null = null;
  const steps: number[] = [];
  for (const [time, delta] of events) {
    const read = readWheel(gesture, time, delta);
    gesture = read.gesture;
    if (read.step) steps.push(read.step);
  }
  return steps;
}

/** A trackpad flick: a quick rise, then momentum fading over about 1.4 seconds. */
function flick(start: number, sign = 1, frames = 85) {
  const events: [number, number][] = [];
  for (let frame = 0; frame < frames; frame += 1) {
    const size = frame < 4 ? 10 + frame * 25 : 85 * Math.exp(-(frame - 4) / 16);
    events.push([start + frame * 16, sign * Math.max(1, Math.round(size))]);
  }
  return events;
}

test("a trackpad flick and all its momentum is one step", () => {
  assert.deepEqual(countSteps(flick(0)), [1]);
  assert.deepEqual(countSteps(flick(0, -1)), [-1]);
});

test("a stall in the event stream right after a step is still one step", () => {
  const events = flick(0).map(([time, delta], index): [number, number] => [
    index >= 2 ? time + 170 : time,
    delta,
  ]);
  assert.deepEqual(countSteps(events), [1]);
});

test("two separate flicks are two steps", () => {
  assert.deepEqual(countSteps([...flick(0), ...flick(1600)]), [1, 1]);
});

test("a new flick during the last one's momentum is a second step", () => {
  const first = flick(0).slice(0, 45);
  assert.deepEqual(countSteps([...first, ...flick(45 * 16)]), [1, 1]);
});

test("a reversal mid-momentum steps the other way", () => {
  const first = flick(0).slice(0, 30);
  assert.deepEqual(countSteps([...first, ...flick(30 * 16, -1)]), [1, -1]);
});

test("finger jitter during momentum does not step", () => {
  const events = flick(0);
  events.splice(40, 0, [events[39][0] + 1, -2]);
  assert.deepEqual(countSteps(events), [1]);
});

test("mouse wheel notches step once each, and a fast spin counts once", () => {
  assert.deepEqual(countSteps([[0, 100], [300, 100], [600, 100]]), [1, 1, 1]);
  assert.deepEqual(countSteps([[0, 100], [40, 100], [80, 100]]), [1]);
});

test("a brushed trackpad does not step", () => {
  assert.deepEqual(countSteps([[0, 2], [16, 3], [32, 2]]), []);
});

test("wheel deltas convert to pixels", () => {
  assert.equal(wheelPixels(100, 0, 800), 100);
  assert.equal(wheelPixels(3, 1, 800), 48);
  assert.equal(wheelPixels(1, 2, 800), 800);
});

test("a step goes to the neighboring landing and stops at both ends", () => {
  assert.equal(landingAfter(3, 1, 8), 4);
  assert.equal(landingAfter(3, -1, 8), 2);
  assert.equal(landingAfter(3.3, 1, 8), 4);
  assert.equal(landingAfter(3.3, -1, 8), 3);
  assert.equal(landingAfter(3.001, -1, 8), 2);
  assert.equal(landingAfter(8, 1, 8), 8);
  assert.equal(landingAfter(0, -1, 8), 0);
});

test("the docking curve never runs backward", () => {
  let previous = 0;
  for (let step = 0; step <= 1000; step += 1) {
    const value = easeDock(step / 1000);
    assert.ok(value >= previous, `step ${step}`);
    previous = value;
  }
});

test("scroll offsets map to landings and clamp at both ends", () => {
  const tops = [0, 100, 200];

  assert.equal(rawPosition(-20, tops), 0);
  assert.equal(rawPosition(100, tops), 1);
  assert.equal(rawPosition(150, tops), 1.5);
  assert.equal(rawPosition(900, tops), 2);
});

test("a scrollbar that stops between landings settles in its direction", () => {
  assert.equal(restingLanding(3, 1, 8), null);
  assert.equal(restingLanding(3.1, 1, 8), null);
  assert.equal(restingLanding(3.9, -1, 8), null);
  assert.equal(restingLanding(3.3, 1, 8), 4);
  assert.equal(restingLanding(3.7, -1, 8), 3);
  assert.equal(restingLanding(7.5, 1, 8), 8);
});

test("every landing docks exactly at its section top", () => {
  order.forEach((_, index) => assert.equal(worldPosition(index), index));
});

test("the sky reaches each stop at its landing and ends at dusk", () => {
  const visibleTop = (world: number) =>
    skyStops.findLastIndex(
      (_, layer) => skyOpacity(layer, world, order) === 1,
    );

  assert.equal(skyStops[visibleTop(0)], "dawn");
  assert.equal(skyStops[visibleTop(1)], "dawn");
  assert.equal(skyStops[visibleTop(2)], "sunrise");
  assert.equal(skyStops[visibleTop(4)], "bright");
  assert.equal(skyStops[visibleTop(7)], "sunset");
  assert.equal(skyStops[visibleTop(8)], "dusk");
});

test("a card is solid at its dock and gone by the next", () => {
  assert.equal(cardPose(3, 3.06).opacity, 1);
  assert.equal(cardPose(3, 3.5).opacity, 0);
  assert.equal(cardPose(3, 4).opacity, 0);
});

test("the boat stays on a small path", () => {
  for (let world = 0; world <= 8; world += 0.1) {
    const pose = boatPose(world);
    assert.ok(Math.abs(pose.y) <= 14);
    assert.ok(Math.abs(pose.x) <= 10);
    assert.ok(Math.abs(pose.angle) <= 1.5);
  }
});

function runOptIn(pathname: string, matches: boolean) {
  const dataset: Record<string, string> = {};
  const listeners: Record<string, (event: { target: unknown }) => void> = {};
  const timers: (() => void)[] = [];

  new Function(
    "document",
    "location",
    "matchMedia",
    "addEventListener",
    "setTimeout",
    rideOptInScript,
  )(
    { documentElement: { dataset } },
    { pathname },
    () => ({ matches }),
    (type: string, listener: (event: { target: unknown }) => void) => {
      listeners[type] = listener;
    },
    (callback: () => void) => timers.push(callback),
  );

  return { dataset, listeners, timers };
}

test("the opt-in script turns the Ride on only where it fits", () => {
  assert.equal(runOptIn("/", true).dataset.ride, "on");
  assert.equal(runOptIn("/", false).dataset.ride, undefined);
  assert.equal(runOptIn("/dry-land", true).dataset.ride, undefined);
});

test("a failed script drops back to the stacked page", () => {
  const { dataset, listeners } = runOptIn("/", true);

  listeners.error({ target: { tagName: "IMG" } });
  assert.equal(dataset.ride, "on");
  listeners.error({ target: { tagName: "SCRIPT" } });
  assert.equal(dataset.ride, undefined);
});

test("a script that never arrives drops back to the stacked page", () => {
  const { dataset, timers } = runOptIn("/", true);

  timers.forEach((timer) => timer());
  assert.equal(dataset.ride, undefined);
});

test("a running Ride is never switched off by the fallback", () => {
  const { dataset, timers } = runOptIn("/", true);

  dataset.rideReady = "on";
  timers.forEach((timer) => timer());
  assert.equal(dataset.ride, "on");
});

test("the sun rises at the Shore, sets by the Harbor, and is highest midway", () => {
  const horizon = 70;
  const shore = sunPose(0, 8).yVh;
  assert.ok(shore < horizon && shore > horizon - 16, "low over the water at the Shore");
  assert.ok(sunPose(8, 8).yVh - 8 >= horizon, "set at the Harbor");
  assert.ok(sunPose(0, 8).glitter > 0);
  assert.equal(sunPose(8, 8).glitter, 0);

  const heights = order.map((_, world) => sunPose(world, 8).yVh);
  assert.equal(heights.indexOf(Math.min(...heights)), 3);
});

test("the sun crosses the sky in one direction", () => {
  for (let world = 0; world < 8; world += 0.25) {
    assert.ok(sunPose(world + 0.25, 8).xVw <= sunPose(world, 8).xVw);
  }
});

test("the boat docks clear of the card at every window size", () => {
  for (const viewport of [1024, 1280, 1440, 1920, 2560]) {
    for (const id of order) {
      const cardEdge = Math.max(32, viewport * 0.06) + (landingStage[id].card ? 672 : 512);
      const center = boatDock(id, viewport);
      const halfBoat = boatWidth(viewport) / 2;
      if (landingStage[id].side === "left") {
        assert.ok(center - halfBoat >= cardEdge, `${id} at ${viewport}`);
      } else {
        assert.ok(center + halfBoat <= viewport - cardEdge, `${id} at ${viewport}`);
      }
    }
  }
});

test("the boat moves smoothly between docks and stops on them", () => {
  assert.equal(boatX(3, order, 1440), boatDock("canal", 1440));
  assert.equal(boatX(4, order, 1440), boatDock("water", 1440));
  const middle = boatX(3.5, order, 1440);
  const [low, high] = [boatDock("canal", 1440), boatDock("water", 1440)].sort((a, b) => a - b);
  assert.ok(middle > low && middle < high);
});

test("the boat is level and wakeless at rest, and leans within limits at speed", () => {
  assert.equal(boatMotion(0).wake, 0);
  assert.equal(Math.abs(boatMotion(0).lean), 0);
  assert.equal(boatMotion(5).wake, 1);
  assert.ok(Math.abs(boatMotion(5).lean) <= 4);
  assert.ok(boatMotion(2).lean < 0 && boatMotion(-2).lean > 0);
});

test("the pole is at rest on every dock", () => {
  for (let dock = 0; dock <= 8; dock += 1) {
    assert.ok(Math.abs(poleAngle(dock)) < 1e-9);
  }
});

test("the route map's marker reaches every stop and stays on the river", () => {
  assert.equal(routePoint(0).x, 32);
  assert.equal(routePoint(8).x, 32 + 8 * 64);
  for (let world = 0; world <= 8; world += 0.1) {
    assert.ok(Math.abs(routePoint(world).y - 44) <= 4);
  }
});

test("longer cards hold the guided ride longer, within limits", () => {
  assert.ok(readingTime(40) > readingTime(20));
  assert.equal(readingTime(1), 2500);
  assert.equal(readingTime(500), 7500);
});

function steps(events: [number, number][]) {
  let gesture: WheelGesture | null = null;
  let total = 0;
  for (const [time, delta] of events) {
    const read = readWheel(gesture, time, delta);
    gesture = read.gesture;
    total += Math.abs(read.step);
  }
  return total;
}

test("a stall in the middle of a flick's momentum is still one gesture", () => {
  const rise: [number, number][] = [[0, 10], [16, 35], [32, 60], [48, 85]];
  const fade: [number, number][] = Array.from({ length: 40 }, (_, frame) => [
    64 + frame * 16,
    Math.max(1, Math.round(85 * Math.exp(-frame / 16))),
  ]);
  const last = fade[fade.length - 1];
  const afterStall: [number, number][] = [[last[0] + 354, last[1]], [last[0] + 370, last[1]]];

  assert.equal(steps([...rise, ...fade, ...afterStall]), 1);
});

test("mouse wheel notches stay separate steps however far apart", () => {
  assert.equal(steps([[0, 100], [300, 100], [600, 100]]), 3);
});
