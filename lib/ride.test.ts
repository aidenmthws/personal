import assert from "node:assert/strict";
import { test } from "node:test";

import { landings } from "../content/landings.ts";
import {
  boatPose,
  cardPose,
  easeDock,
  glide,
  rawPosition,
  restingLanding,
  rideOptInScript,
  skyOpacity,
  skyStops,
  worldPosition,
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

test("the world glides to the scroll position within 300 ms", () => {
  let shown = 0;
  let previousStep = Infinity;
  for (let elapsed = 0; elapsed < 300; elapsed += 16) {
    const next = glide(shown, 1, 16);
    assert.ok(next - shown < previousStep);
    previousStep = next - shown;
    shown = next;
  }
  assert.ok(shown > 0.95);
});

test("the glide is the same at any frame rate", () => {
  let at60 = 0;
  let at120 = 0;
  for (let frame = 0; frame < 6; frame += 1) at60 = glide(at60, 1, 16);
  for (let frame = 0; frame < 12; frame += 1) at120 = glide(at120, 1, 8);
  assert.ok(Math.abs(at60 - at120) < 0.001);
});

test("the glide lands exactly on the target", () => {
  assert.equal(glide(0.9999, 1, 16), 1);
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

test("scrolling that stops between landings settles in its direction", () => {
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

  assert.equal(skyStops[visibleTop(0)], "predawn");
  assert.equal(skyStops[visibleTop(1)], "predawn");
  assert.equal(skyStops[visibleTop(2)], "sunrise");
  assert.equal(skyStops[visibleTop(4)], "bright");
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
