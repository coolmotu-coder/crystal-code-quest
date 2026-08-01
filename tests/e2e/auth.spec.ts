import { expect, test } from "@playwright/test";
import { testParent } from "./fixtures";

test.describe("authentication", () => {
  test("unauthenticated /child redirects to /login", async ({ page }) => {
    await page.goto("/child");
    await expect(page).toHaveURL(/\/login$/);
  });

  test("parent session is denied child routes", async ({ page }) => {
    await page.goto("/parent/login");
    await page.fill('input[name="email"]', testParent.email);
    await page.fill('input[name="password"]', testParent.password);
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL("/parent");

    await page.goto("/child");
    await expect(page).toHaveURL("/access-denied");
  });
});
