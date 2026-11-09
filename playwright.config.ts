import { defineConfig, devices } from "@playwright/test";

/* Port 3000 is left free for `npm run dev`. */
const PORT = 3100;
const baseURL = `http://localhost:${PORT}`;

export default defineConfig({
  testDir: "./e2e",
  forbidOnly: Boolean(process.env.CI),
  /* Wheel gestures are read by their timing, so tests must not compete for CPU. */
  workers: 1,
  use: { baseURL },
  projects: [
    { name: "chromium", use: devices["Desktop Chrome"] },
    { name: "firefox", use: devices["Desktop Firefox"] },
    { name: "webkit", use: devices["Desktop Safari"] },
  ],
  /* Tests run against a production build, the same way Vercel serves the site. */
  webServer: {
    command: `npm run build && npx next start -p ${PORT}`,
    url: baseURL,
    timeout: 180_000,
  },
});
