import assert from "node:assert/strict";
import { test } from "node:test";

import { dryLandLandings, landings, site } from "./landings.ts";

const wordCount = (text: string) => text.trim().split(/\s+/).length;
const everything = JSON.stringify({ landings, site });

test("no placeholder copy ships", () => {
  assert.doesNotMatch(everything, /placeholder/i);
});

test("the nine landings run in route order", () => {
  assert.deepEqual(
    landings.map((landing) => landing.id),
    [
      "shore",
      "boatman",
      "source",
      "canal",
      "water",
      "lake",
      "channels",
      "market",
      "harbor",
    ],
  );
});

test("Dry Land holds every landing, with the newest job first", () => {
  const ids = dryLandLandings.map((landing) => landing.id);

  assert.deepEqual(
    [...ids].sort(),
    landings.map((landing) => landing.id).sort(),
  );
  assert.equal(ids[0], "shore");
  assert.equal(ids.at(-1), "harbor");
  assert.ok(ids.indexOf("lake") < ids.indexOf("water"));
  assert.ok(ids.indexOf("water") < ids.indexOf("canal"));
});

test("card summaries stay within 45 words", () => {
  for (const landing of landings) {
    assert.ok(wordCount(landing.summary) <= 45, landing.id);
  }
});

test("card summaries carry at most one percentage", () => {
  for (const landing of landings) {
    const percentages = landing.summary.match(/\d+%/g) ?? [];
    assert.ok(percentages.length <= 1, landing.id);
  }
});

test("a card summary does not repeat its headline number", () => {
  for (const landing of landings) {
    const headline = landing.metrics[0];
    if (headline) assert.ok(!landing.summary.includes(headline.value), landing.id);
  }
});

test("every metric appears in the resume text it came from", () => {
  for (const landing of landings) {
    const source = landing.bullets.join(" ");
    for (const metric of landing.metrics) {
      assert.ok(source.includes(metric.value), `${landing.id}: ${metric.value}`);
    }
    for (const project of landing.projects ?? []) {
      for (const metric of project.metrics) {
        assert.ok(
          project.description.includes(metric.value),
          `${project.name}: ${metric.value}`,
        );
      }
    }
  }
});

test("a project in progress shows no results", () => {
  const projects = landings.flatMap((landing) => landing.projects ?? []);
  const harness = projects.find((project) => project.name.includes("Harness"));

  assert.equal(harness?.status, "In progress");
  for (const project of projects.filter((item) => item.status)) {
    assert.equal(project.metrics.length, 0, project.name);
    assert.doesNotMatch(project.description, /\d+%/, project.name);
  }
});

test("landing skills all come from the Spice market lists", () => {
  const market = landings.find((landing) => landing.id === "market");
  const stocked = new Set(
    market?.skillGroups?.flatMap((group) => group.skills) ?? [],
  );

  assert.equal(market?.skillGroups?.length, 4);
  for (const landing of landings) {
    for (const skill of landing.skills) {
      assert.ok(stocked.has(skill), `${landing.id}: ${skill}`);
    }
  }
});

test("every Spice market skill is used at a landing", () => {
  const market = landings.find((landing) => landing.id === "market");
  const used = new Set(landings.flatMap((landing) => landing.skills));

  for (const skill of market?.skillGroups?.flatMap((group) => group.skills) ?? []) {
    assert.ok(used.has(skill), skill);
  }
});

test("every result in the net comes from the resume text", () => {
  const water = landings.find((landing) => landing.id === "water");
  const source = water?.bullets.join(" ") ?? "";

  assert.equal(water?.catch?.length, 3);
  for (const result of water?.catch ?? []) {
    assert.ok(source.includes(result.value), result.value);
    assert.ok(source.includes(result.label.replace(/^of /, "")), result.label);
    assert.ok(result.story.includes(result.value), result.value);
  }
});

test("nothing off limits is published", () => {
  assert.doesNotMatch(everything, /\(?\d{3}\)?[-.\s]\d{3}[-.\s]\d{4}/, "phone");
  assert.doesNotMatch(everything, /github\.com/i, "GitHub link");
  /* Malayalam appears only as the header name. */
  const { nameMalayalam, ...rest } = site;
  assert.match(nameMalayalam, /^[ഀ-ൿ\s]+$/);
  assert.doesNotMatch(JSON.stringify({ landings, site: rest }), /[ഀ-ൿ]/, "Malayalam text");
  assert.match(everything, /2023amathews@gmail\.com/);
});

test("the positioning lines match the plan", () => {
  assert.equal(
    site.heroLine,
    "I build backend systems and AI tooling that make messy data easier to use.",
  );
  assert.equal(
    site.shareDescription,
    "Software engineer building APIs, observability, and LLM tooling.",
  );
  assert.equal(
    site.pageTitle,
    "Aiden Mathews | Software engineer building APIs, observability, and LLM tooling.",
  );
});
