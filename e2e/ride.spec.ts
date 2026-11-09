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

    await expect(page.getByText("Scroll or use the arrow keys to move.")).toBeVisible();
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
      await expect(page.getByText("Scroll or use the arrow keys to move.")).toBeHidden();

      await page.mouse.move(200, 400);
      await page.mouse.wheel(0, 300);
      await expect.poll(() => page.evaluate(() => window.scrollY)).toBeGreaterThan(200);
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
  });
});
