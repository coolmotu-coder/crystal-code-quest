import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { defineConfig, devices } from "@playwright/test";
import type { E2eGlobalSetupResult } from "./tests/e2e/global-teardown";

process.env.SESSION_SECRET =
  process.env.SESSION_SECRET ?? "test-secret-test-secret-test-secret-test-secret";

const e2eTempDir = fs.mkdtempSync(path.join(os.tmpdir(), "crystal-code-quest-e2e-"));
const e2eDatabasePath = path.join(e2eTempDir, "test.db");

process.env.DATABASE_PATH = process.env.DATABASE_PATH ?? e2eDatabasePath;

const state: E2eGlobalSetupResult = { tempDir: e2eTempDir, databasePath: e2eDatabasePath };
fs.writeFileSync(path.resolve(__dirname, "tests", "e2e", ".e2e-state.json"), JSON.stringify(state));

export default defineConfig({
  testDir: "./tests/e2e",
  globalSetup: "./tests/e2e/global-setup.ts",
  globalTeardown: "./tests/e2e/global-teardown.ts",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: 1,
  reporter: "html",
  use: {
    baseURL: process.env.PLAYWRIGHT_BASE_URL ?? "http://localhost:3000",
    trace: "on-first-retry",
    screenshot: "only-on-failure",
  },
  projects: [
    {
      name: "chromium-laptop",
      use: {
        ...devices["Desktop Chrome"],
        viewport: { width: 1440, height: 900 },
      },
    },
    {
      name: "chromium-ipad-landscape",
      use: {
        ...devices["Desktop Chrome"],
        viewport: { width: 1180, height: 820 },
      },
    },
    {
      name: "chromium-ipad-portrait",
      use: {
        ...devices["Desktop Chrome"],
        viewport: { width: 820, height: 1180 },
      },
    },
    {
      name: "chromium-mobile",
      use: {
        ...devices["Pixel 5"],
      },
    },
  ],
  webServer: {
    command: "pnpm build && pnpm start",
    env: {
      DATABASE_PATH: process.env.DATABASE_PATH,
      SESSION_SECRET: process.env.SESSION_SECRET,
    },
    url: "http://localhost:3000",
    // Each Playwright invocation creates a fresh temp database. Reusing a server
    // from a previous run would point it at the old database, so we always start
    // a new web server here.
    reuseExistingServer: false,
    timeout: 120000,
  },
});
