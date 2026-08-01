import { expect, test, type Page } from "@playwright/test";
import { testChild } from "./fixtures";
import { resetDatabase } from "./helpers";

const expectedPrompt =
  "When Lucas answers a hard maths question correctly, give them Super Jump for one obstacle.";

async function loginAsChild(page: Page): Promise<void> {
  await page.goto("/child/login");
  await page.fill('input[name="username"]', testChild.username);
  await page.fill('input[name="pin"]', testChild.pin);
  await page.click('button[type="submit"]');
  await expect(page).toHaveURL("/child");
}

function isMobileViewport(page: Page): boolean {
  const viewport = page.viewportSize();
  return viewport !== null && viewport.width < 768;
}

async function expectNavigationForRole(page: Page, role: "child" | "parent"): Promise<void> {
  const sideNavName = role === "child" ? "Child navigation" : "Parent navigation";
  const mobileNav = page.getByRole("navigation", { name: "Mobile navigation" });
  const sideNav = page.getByRole("navigation", { name: sideNavName });
  if (isMobileViewport(page)) {
    await expect(mobileNav).toBeVisible();
    await expect(sideNav).toBeHidden();
  } else {
    await expect(sideNav).toBeVisible();
    await expect(mobileNav).toBeHidden();
  }
}

test.describe("child dashboard", () => {
  test.beforeEach(async ({ page }) => {
    await resetDatabase();
    await loginAsChild(page);
  });

  test("renders for Child session", async ({ page }) => {
    await expect(page.getByRole("heading", { name: /Hi Linus/i, level: 1 })).toBeVisible();
    await expectNavigationForRole(page, "child");
  });

  test("Parent is denied", async ({ page }) => {
    await page.goto("/parent/login");
    await page.fill('input[name="email"]', "parent@example.com");
    await page.fill('input[name="password"]', "ParentPass123!");
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL("/parent");

    await page.goto("/child");
    await expect(page).toHaveURL("/access-denied");
  });

  test("active quest has the correct Continue action", async ({ page }) => {
    await page.click("text=Start a new quest");
    await expect(page).toHaveURL("/child/quests");

    const superJumpCard = page.locator("h3", { hasText: "Super Jump for Lucas" }).locator("..");
    await superJumpCard.locator("button", { hasText: "Choose this quest" }).click();

    await expect(page).toHaveURL(/\/child\/quests\/[^/]+$/);

    await page.goto("/child");
    await expect(
      page.getByLabel("Current quest").getByRole("link", { name: "Continue your quest" }),
    ).toBeVisible();
  });

  test("completed quest displays the correct state", async ({ page }) => {
    await page.click("text=Start a new quest");
    const superJumpCard = page.locator("h3", { hasText: "Super Jump for Lucas" }).locator("..");
    await superJumpCard.locator("button", { hasText: "Choose this quest" }).click();

    await page.click("text=Looks good — continue");
    await page.click("text=Continue to AI plan");
    await page.click("text=Build my idea");
    await page.click("text=See the result");

    await page.goto("/child");
    const currentQuest = page.getByLabel("Current quest");
    await expect(currentQuest.getByRole("link", { name: "View your quest" })).toBeVisible();
    await expect(currentQuest.getByText("Complete", { exact: false })).toBeVisible();
  });

  test("Super Jump prompt is shown where appropriate", async ({ page }) => {
    await page.click("text=Start a new quest");
    const superJumpCard = page.locator("h3", { hasText: "Super Jump for Lucas" }).locator("..");
    await superJumpCard.locator("button", { hasText: "Choose this quest" }).click();
    await page.click("text=Looks good — continue");

    await page.goto("/child");
    await expect(page.getByLabel("Current quest").getByText(expectedPrompt)).toBeVisible();
  });

  test("mocked preview is labelled truthfully", async ({ page }) => {
    const previewPanel = page.getByLabel("The Crystal Adventure preview");
    await expect(previewPanel.getByText("Practice preview", { exact: false })).toBeVisible();
    await expect(previewPanel.getByText(/no real game code has been changed/i)).toBeVisible();
  });

  test("navigation works", async ({ page }) => {
    await page.goto("/child/quests");
    await expect(page).toHaveURL("/child/quests");

    await page.goto("/child");
    await expectNavigationForRole(page, "child");
    await page.getByLabel("Current quest").getByRole("link", { name: "Start a new quest" }).click();
    await expect(page).toHaveURL("/child/quests");
  });

  test("empty states do not show invented completed data", async ({ page }) => {
    await expect(
      page.getByLabel("Skills being practised").getByText("No skills recorded yet"),
    ).toBeVisible();
    await expect(
      page.getByLabel("Recent learning").getByText("No learning evidence yet"),
    ).toBeVisible();
    const streakCard = page.getByText("Learning streak").locator("..");
    await expect(streakCard.getByText("5 days")).toBeVisible();
    await expect(page.getByText("None yet")).toBeVisible();
  });
});
