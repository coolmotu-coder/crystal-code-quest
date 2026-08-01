import { expect, test, type Page } from "@playwright/test";
import { testParent } from "./fixtures";
import { resetDatabase } from "./helpers";

const expectedPrompt =
  "When Lucas answers a hard maths question correctly, give them Super Jump for one obstacle.";

function isMobileViewport(page: Page): boolean {
  const viewport = page.viewportSize();
  return viewport !== null && viewport.width < 768;
}

async function expectParentNavigation(page: Page): Promise<void> {
  const mobileNav = page.getByRole("navigation", { name: "Mobile navigation" });
  const sideNav = page.getByRole("navigation", { name: "Parent navigation" });
  if (isMobileViewport(page)) {
    await expect(mobileNav).toBeVisible();
    await expect(sideNav).toBeHidden();
  } else {
    await expect(sideNav).toBeVisible();
    await expect(mobileNav).toBeHidden();
  }
}

test.describe("parent dashboard", () => {
  test.beforeEach(async ({ page }) => {
    await resetDatabase();
    await page.goto("/parent/login");
    await page.fill('input[name="email"]', testParent.email);
    await page.fill('input[name="password"]', testParent.password);
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL("/parent");
  });

  test("renders for Parent session", async ({ page }) => {
    await expect(page.getByRole("heading", { name: "Hi Parent", level: 1 })).toBeVisible();
    await expectParentNavigation(page);
    await expect(
      page.getByRole("heading", { name: "Hi Parent", level: 1 }).locator("..").getByText("Linus"),
    ).toBeVisible();
  });

  test("Child is denied", async ({ page }) => {
    await page.goto("/child/login");
    await page.fill('input[name="username"]', "linus");
    await page.fill('input[name="pin"]', "123456");
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL("/child");

    await page.goto("/parent");
    await expect(page).toHaveURL("/access-denied");
  });

  test("latest prompt is shown", async ({ page }) => {
    await expect(page.getByText("No prompt yet")).toBeVisible();
    await expect(page.getByText("No quest started")).toBeVisible();
  });

  test("latest quest status is shown", async ({ page }) => {
    await expect(
      page.getByLabel("Current objective").getByText("No quest", { exact: true }),
    ).toBeVisible();
  });

  test("learning evidence is shown when present", async ({ page }) => {
    const learningEvidence = page.getByLabel("Latest learning evidence");
    await expect(learningEvidence.getByText("No learning evidence yet")).toBeVisible();
    await expect(
      learningEvidence.getByText("Understanding Gates are planned for the agent workflow"),
    ).toBeVisible();
  });

  test("mocked build status is explicit", async ({ page }) => {
    await expect(page.getByText("Mocked build", { exact: false })).toBeVisible();
    await expect(
      page.getByText("No real game repository was changed", { exact: false }),
    ).toBeVisible();
  });

  test("secondary destinations are clearly labelled as unavailable or planned", async ({
    page,
  }) => {
    const moreAreas = page.getByRole("heading", { name: "More areas" }).locator("..");
    await expect(moreAreas.getByText("Prompt History")).toBeVisible();
    await expect(moreAreas.getByText("Imagination Journal")).toBeVisible();
    await expect(moreAreas.getByText("Builds")).toBeVisible();
    await expect(moreAreas.getByText("Learning Controls")).toBeVisible();
    await expect(moreAreas.getByText("Safety Settings")).toBeVisible();
    await expect(moreAreas.getByText("Child Preview")).toBeVisible();
    await expect(moreAreas.getByText("Coming soon", { exact: false })).toHaveCount(6);
  });
});

test.describe("parent dashboard with completed quest", () => {
  test.beforeEach(async ({ page }) => {
    await resetDatabase();

    // Log in as child and complete the Super Jump quest
    await page.goto("/child/login");
    await page.fill('input[name="username"]', "linus");
    await page.fill('input[name="pin"]', "123456");
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL("/child");

    await page.click("text=Start a new quest");
    const superJumpCard = page.locator("h3", { hasText: "Super Jump for Lucas" }).locator("..");
    await superJumpCard.locator("button", { hasText: "Choose this quest" }).click();
    await page.click("text=Looks good — continue");
    await page.click("text=Continue to AI plan");
    await page.click("text=Build my idea");
    await page.click("text=See the result");
    await expect(page).toHaveURL(/\/child\/quests\/[^/]+\/success$/);

    // Log in as parent
    await page.goto("/parent/login");
    await page.fill('input[name="email"]', testParent.email);
    await page.fill('input[name="password"]', testParent.password);
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL("/parent");
  });

  test("latest prompt is shown after quest completion", async ({ page }) => {
    const promptPanel = page.getByLabel("Latest structured prompt");
    await expect(promptPanel.getByText(expectedPrompt)).toBeVisible();
    await expect(promptPanel.getByText("Who", { exact: true })).toBeVisible();
    await expect(promptPanel.getByText("What", { exact: true })).toBeVisible();
    await expect(promptPanel.getByText("When", { exact: true })).toBeVisible();
    await expect(promptPanel.getByText("How long", { exact: true })).toBeVisible();
  });

  test("learning evidence is shown after quest completion", async ({ page }) => {
    const learningEvidence = page.getByLabel("Latest learning evidence");
    await expect(learningEvidence.getByText("Identified character and action")).toBeVisible();
    await expect(learningEvidence.getByText("Combined two conditions")).toBeVisible();
    await expect(learningEvidence.getByText("2 recorded", { exact: false })).toBeVisible();
  });

  test("mocked build status shows success after quest completion", async ({ page }) => {
    const buildPanel = page.getByLabel("Build status");
    await expect(buildPanel.getByText("Mocked success", { exact: false })).toBeVisible();
    await expect(
      buildPanel.getByText("No real game repository was changed", { exact: false }),
    ).toBeVisible();
  });
});
