import { expect, test, type Page } from "@playwright/test";

async function openRide(page: Page) {
  await page.goto("/");
}

async function readyToRide(page: Page) {
  await expect(page.locator("html")).toHaveAttribute("data-ride", "on");
  await expect(page.locator("html")).toHaveAttribute("data-ride-ready", "on");
  await page.mouse.move(900, 400);
}

async function switchTo(page: Page, version: "Ride" | "Dry Land") {
  await page
    .getByRole("navigation", { name: "Site version" })
    .getByRole("link", { name: version })
    .click();
  await expect(page).toHaveURL(version === "Ride" ? /\/$/ : /\/dry-land$/);
}

/** The page sits exactly at this landing, and the route map says so. */
async function expectDocked(page: Page, id: string, index: number) {
  await expect
    .poll(() =>
      page.evaluate(
        (landing) =>
          Math.abs(document.querySelector(`#ride #${landing}`)!.getBoundingClientRect().top),
        id,
      ),
    )
    .toBeLessThanOrEqual(1);
  await expect(page.locator(`[data-route-dot="${index}"]`)).toHaveAttribute(
    "aria-current",
    "location",
  );
}

/** A trackpad flick: a quick rise, then momentum fading for over a second. */
async function flick(page: Page) {
  for (let frame = 0; frame < 85; frame += 1) {
    const size = frame < 4 ? 10 + frame * 25 : 85 * Math.exp(-(frame - 4) / 16);
    await page.mouse.wheel(0, Math.max(1, Math.round(size)));
    await page.waitForTimeout(16);
  }
}

test.describe("the full Ride", () => {
  test("one trackpad flick and its momentum moves one landing", async ({ page }) => {
    await openRide(page);
    await readyToRide(page);

    await flick(page);
    await expectDocked(page, "boatman", 1);
  });

  test("one mouse wheel notch moves one landing", async ({ page }) => {
    await openRide(page);
    await readyToRide(page);

    await page.mouse.wheel(0, 100);
    await expectDocked(page, "boatman", 1);
  });

  test("arrow keys move one landing each way", async ({ page }) => {
    await openRide(page);
    await readyToRide(page);

    await page.keyboard.press("ArrowDown");
    await expectDocked(page, "boatman", 1);
    await page.keyboard.press("ArrowRight");
    await expectDocked(page, "source", 2);
    await page.keyboard.press("ArrowUp");
    await expectDocked(page, "boatman", 1);
  });

  test("the first card says how to move", async ({ page }) => {
    await openRide(page);
    await readyToRide(page);

    await expect(page.getByText("Cast off for a guided ride, or scroll or use the arrow keys.")).toBeVisible();
  });
});

test.describe("the guided ride", () => {
  const toggle = (page: Page) => page.locator("[data-tour-toggle]");

  /** Ends the current stop's reading time, which is the progress bar's animation. */
  async function finishReading(page: Page) {
    await expect
      .poll(() => page.locator("[data-tour-progress]").evaluate((el) => el.getAnimations().length))
      .toBe(1);
    await page.locator("[data-tour-progress]").evaluate((el) => el.getAnimations()[0].finish());
  }

  async function castOff(page: Page) {
    await openRide(page);
    await readyToRide(page);
    await page.getByRole("link", { name: "Cast off" }).click();
    await expectDocked(page, "boatman", 1);
    await expect(toggle(page)).toHaveAccessibleName("Pause ride");
  }

  test("moves on by itself once a card has had its reading time", async ({ page }) => {
    await castOff(page);
    await finishReading(page);
    await expectDocked(page, "source", 2);
    await finishReading(page);
    await expectDocked(page, "canal", 3);
  });

  test("an arrow key takes over, and Cast off continues from there", async ({ page }) => {
    await castOff(page);

    await page.keyboard.press("ArrowDown");
    await expectDocked(page, "source", 2);
    await expect(toggle(page)).toHaveAccessibleName("Cast off");
    await expect
      .poll(() => page.locator("[data-tour-progress]").evaluate((el) => el.getAnimations().length))
      .toBe(0);

    await toggle(page).click();
    await expect(toggle(page)).toHaveAccessibleName("Pause ride");
    await expectDocked(page, "source", 2);
    await finishReading(page);
    await expectDocked(page, "canal", 3);
  });

  test("the scroll wheel and route map also take over", async ({ page }) => {
    await castOff(page);
    await page.mouse.wheel(0, 100);
    await expectDocked(page, "source", 2);
    await expect(toggle(page)).toHaveAccessibleName("Cast off");

    await toggle(page).click();
    await page.locator('[data-route-dot="6"]').click();
    await expectDocked(page, "channels", 6);
    await expect(toggle(page)).toHaveAccessibleName("Cast off");
  });

  test("pause holds the stop and play resumes it", async ({ page }) => {
    await castOff(page);
    await toggle(page).click();
    await expect(toggle(page)).toHaveAccessibleName("Cast off");

    const state = () =>
      page.locator("[data-tour-progress]").evaluate((el) => el.getAnimations()[0].playState);
    await expect.poll(state).toBe("paused");

    await toggle(page).click();
    await expect.poll(state).toBe("running");
    await finishReading(page);
    await expectDocked(page, "source", 2);
  });

  test("using a control in a card pauses the ride", async ({ page }) => {
    await page.goto("/#canal");
    await readyToRide(page);
    await toggle(page).click();
    await page.locator('[data-route-dot="4"]').click();
    await expectDocked(page, "water", 4);

    await toggle(page).click();
    await page.locator("#water").getByRole("button", { name: "Lower the net" }).click();
    await expect(toggle(page)).toHaveAccessibleName("Cast off");
    await expectDocked(page, "water", 4);
  });

  test("a mouse left at rest never holds the ride, but pointing at a control does", async ({ page }) => {
    await page.goto("/#water");
    await readyToRide(page);
    const net = page.locator("#water").getByRole("button", { name: "Lower the net" });
    await expect.poll(() => net.evaluate((el) => getComputedStyle(el.closest("[data-card]")!).opacity)).toBe("1");
    const box = (await net.boundingBox())!;
    await page.locator('[data-route-dot="3"]').click();
    await expectDocked(page, "canal", 3);
    const state = () =>
      page.locator("[data-tour-progress]").evaluate((el) => el.getAnimations()[0]?.playState);

    /* The net's button will appear under this resting mouse. */
    await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
    await toggle(page).focus();
    await page.keyboard.press("Enter");
    await finishReading(page);
    await expectDocked(page, "water", 4);
    await expect.poll(() => net.evaluate((el) => getComputedStyle(el.closest("[data-card]")!).opacity)).toBe("1");
    expect(await state()).toBe("running");

    await page.mouse.move(box.x + box.width / 2 + 3, box.y + box.height / 2);
    await expect.poll(state).toBe("paused");
    await page.mouse.move(900, 300);
    await expect.poll(state).toBe("running");
  });

  test("stops at the Harbor and offers to ride again", async ({ page }) => {
    await page.goto("/#market");
    await readyToRide(page);
    await toggle(page).click();
    await finishReading(page);
    await expectDocked(page, "harbor", 8);
    await expect(toggle(page)).toHaveAccessibleName("Ride again");

    await toggle(page).click();
    await expectDocked(page, "shore", 0);
    await finishReading(page);
    await expectDocked(page, "boatman", 1);
  });

  test("Cast off stays a plain link with reduced motion", async ({ browser }) => {
    const context = await browser.newContext({ reducedMotion: "reduce" });
    const page = await context.newPage();
    await page.goto("/");
    await expect(page.locator("[data-tour-toggle]")).toBeHidden();
    await expect(page.getByRole("link", { name: "Cast off" })).toHaveAttribute("href", "#boatman");
    await context.close();
  });
});

test.describe("the living river", () => {
  test("Cast off unties the boat and moves to the next landing", async ({ page }) => {
    await openRide(page);
    await readyToRide(page);

    await page.getByRole("link", { name: "Cast off" }).click();
    await expect(page.locator("html")).toHaveAttribute("data-casting-off", "on");
    await expectDocked(page, "boatman", 1);
    await expect(page).toHaveURL(/#boatman$/);
  });

  test("the Harbor's lamps come on when the boat arrives", async ({ page }) => {
    await openRide(page);
    await readyToRide(page);
    const lamp = page.locator("#harbor .arrive-lamp").first();
    await expect.poll(() => lamp.evaluate((el) => getComputedStyle(el).opacity)).toBe("0");

    await page.locator('[data-route-dot="8"]').click();
    await expectDocked(page, "harbor", 8);
    await expect.poll(() => lamp.evaluate((el) => Number(getComputedStyle(el).opacity))).toBeGreaterThan(0);
  });

  test("the pause control stops the scene's loops", async ({ page }) => {
    await openRide(page);
    await readyToRide(page);
    await page.getByRole("button", { name: "Pause motion" }).click();

    const state = await page.locator("#shore .sway").first().evaluate((el) => getComputedStyle(el).animationPlayState);
    expect(state).toBe("paused");
  });

  test("the net lands three results and keeps focus on its button", async ({ page }) => {
    await page.goto("/#water");
    await readyToRide(page);

    const button = page.locator("#water").getByRole("button", { name: "Lower the net" });
    await button.focus();
    await page.keyboard.press("Enter");

    await expect(page.locator("#water details")).toHaveCount(3);
    await expect(page.locator("#water")).toHaveAttribute("data-net", "down");
    await expect(page.locator("#water").getByRole("button", { name: "Empty the basket" })).toBeFocused();
  });

  test("a skill lights its landings, and arrow keys stay among the jars", async ({ page }) => {
    await page.goto("/#market");
    await readyToRide(page);

    const react = page.locator("#market").getByRole("button", { name: "React", exact: true });
    await react.hover();
    await expect(page.locator('[data-route-dot="3"]')).toHaveAttribute("data-lit", "on");
    await expect(page.locator('[data-route-dot="6"]')).toHaveAttribute("data-lit", "on");
    await expect(page.locator('[data-route-dot][data-lit]')).toHaveCount(2);
    await expect(page.locator("#market [role=status]")).toContainText("Bunchful Enterprise, Projects");

    await react.focus();
    await page.keyboard.press("ArrowRight");
    await expect(page.locator("#market").getByRole("button", { name: "Spring Boot" })).toBeFocused();
    await expectDocked(page, "market", 7);
  });

  test("every card fits a small Ride window", async ({ page }) => {
    await page.setViewportSize({ width: 1024, height: 700 });
    await openRide(page);
    await readyToRide(page);

    const clipped = await page.evaluate(() =>
      [...document.querySelectorAll<HTMLElement>("#ride [data-card]")]
        .filter((card) => card.scrollHeight > card.clientHeight + 1)
        .map((card) => card.closest("[data-landing]")!.id),
    );
    expect(clipped).toEqual([]);
  });
});

/* Next keeps the page you left in the DOM, hidden. Dry Land has landings too, and
   they must not count as stops on the Ride. */
test.describe("returning to the Ride from Dry Land", () => {
  const routes = [
    { name: "Ride, Dry Land, Ride", start: "/", steps: ["Dry Land", "Ride"] },
    { name: "Dry Land, Ride", start: "/dry-land", steps: ["Ride"] },
    {
      name: "two round trips",
      start: "/",
      steps: ["Dry Land", "Ride", "Dry Land", "Ride"],
    },
  ] as const;

  for (const { name, start, steps } of routes) {
    test(`one scroll moves one landing after ${name}`, async ({ page }) => {
      await page.goto(start);
      for (const version of steps) await switchTo(page, version);
      await readyToRide(page);

      await page.mouse.wheel(0, 100);
      await expectDocked(page, "boatman", 1);

      await page.keyboard.press("ArrowDown");
      await expectDocked(page, "source", 2);

      await page.locator('[data-route-dot="5"]').click();
      await expectDocked(page, "lake", 5);
    });
  }

  test("Dry Land's skip link still works after a visit to the Ride", async ({ page }) => {
    await openRide(page);
    await readyToRide(page);
    await switchTo(page, "Dry Land");

    await page.getByRole("link", { name: "Skip to contact" }).focus();
    await page.keyboard.press("Enter");
    await expect.poll(() => page.evaluate(() => window.scrollY)).toBeGreaterThan(500);
  });
});

test.describe("the stacked page", () => {
  test.describe("on a phone", () => {
    test.use({ viewport: { width: 390, height: 844 } });

    test("scrolls normally and hides the hint", async ({ page }) => {
      await openRide(page);
      await expect(page.locator("html")).not.toHaveAttribute("data-ride", "on");
      await expect(page.getByText("Cast off for a guided ride, or scroll or use the arrow keys.")).toBeHidden();

      await page.mouse.move(200, 400);
      await page.mouse.wheel(0, 300);
      await expect.poll(() => page.evaluate(() => window.scrollY)).toBeGreaterThan(200);
    });

    test("shows each scene above its card, not behind it", async ({ page }) => {
      await openRide(page);
      const { sceneBottom, cardTop } = await page.evaluate(() => {
        const landing = document.querySelector("#ride #water")!;
        return {
          sceneBottom: landing.querySelector("[data-scene]")!.getBoundingClientRect().height,
          cardTop:
            landing.querySelector("[data-card]")!.getBoundingClientRect().top -
            landing.getBoundingClientRect().top,
        };
      });
      expect(cardTop).toBeGreaterThan(300);
      expect(sceneBottom).toBeGreaterThan(cardTop);
    });
  });

  test.describe("with reduced motion", () => {
    test.use({ contextOptions: { reducedMotion: "reduce" } });

    test("turns the Ride off and scrolls normally", async ({ page }) => {
      await openRide(page);
      await expect(page.locator("html")).not.toHaveAttribute("data-ride", "on");

      await page.mouse.move(700, 400);
      await page.mouse.wheel(0, 250);
      await expect.poll(() => page.evaluate(() => window.scrollY)).toBeGreaterThan(200);
    });

    test("runs no scene loops and leaves the lamps lit", async ({ page }) => {
      await openRide(page);
      const names = await page.locator("#ride .sway").first().evaluate((el) => getComputedStyle(el).animationName);
      expect(names).toBe("none");
      const lamp = page.locator("#harbor .arrive-lamp").first();
      expect(Number(await lamp.evaluate((el) => getComputedStyle(el).opacity))).toBeGreaterThan(0);
    });
  });
});
