import { expect, test } from "@playwright/test";
import { testChild } from "./fixtures";
import { resetDatabase } from "./helpers";

const expectedPrompt =
  "When Lucas answers a hard maths question correctly, give him Super Jump for one obstacle.";

test.describe("child builder Super Jump flow", () => {
  test.beforeEach(async ({ page }) => {
    await resetDatabase();
    await page.goto("/child/login");
    await page.fill('input[name="username"]', testChild.username);
    await page.fill('input[name="pin"]', testChild.pin);
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL("/child");
  });

  test("child can select the Super Jump quest and sees the exact prompt", async ({ page }) => {
    await expect(page.getByRole("link", { name: "Start a new quest" })).toBeVisible();
    await page.click("text=Start a new quest");
    await expect(page).toHaveURL("/child/quests");

    const superJumpCard = page.locator("h3", { hasText: "Super Jump for Lucas" }).locator("..");
    await superJumpCard.locator("button", { hasText: "Choose this quest" }).click();

    await expect(page).toHaveURL("/child/quest");
    await expect(page.locator("text=" + expectedPrompt)).toBeVisible();
  });

  test("duplicate active quest selection is prevented and home shows continue", async ({
    page,
  }) => {
    await page.click("text=Start a new quest");
    const superJumpCard = page.locator("h3", { hasText: "Super Jump for Lucas" }).locator("..");
    await superJumpCard.locator("button", { hasText: "Choose this quest" }).click();
    await expect(page).toHaveURL("/child/quest");

    await page.goto("/child/quests");
    await superJumpCard.locator("button", { hasText: "Choose this quest" }).click();
    await expect(page).toHaveURL("/child/quest");

    await page.goto("/child");
    await expect(page.getByRole("link", { name: "Continue your quest" })).toBeVisible();
    await expect(page.locator("text=" + expectedPrompt)).toBeVisible();
  });
});
