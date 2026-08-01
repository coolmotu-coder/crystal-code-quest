import { expect, test, type Page } from "@playwright/test";
import { testChild } from "./fixtures";
import { resetDatabase } from "./helpers";

const expectedPrompt =
  "When Lucas answers a hard maths question correctly, give him Super Jump for one obstacle.";

const planSteps = [
  "Listen for a correct hard maths answer.",
  "Give Super Jump to Lucas.",
  "Allow one approved obstacle.",
  "Remove the power after use.",
  "Verify existing questions still work.",
];

const buildStates = ["Preparing", "Building", "Checking", "Reviewing", "Complete"];

async function loginAsChild(page: Page): Promise<void> {
  await page.goto("/child/login");
  await page.fill('input[name="username"]', testChild.username);
  await page.fill('input[name="pin"]', testChild.pin);
  await page.click('button[type="submit"]');
  await expect(page).toHaveURL("/child");
}

async function startSuperJumpQuest(page: Page): Promise<void> {
  await page.click("text=Start a new quest");
  await expect(page).toHaveURL("/child/quests");

  const superJumpCard = page.locator("h3", { hasText: "Super Jump for Lucas" }).locator("..");
  await superJumpCard.locator("button", { hasText: "Choose this quest" }).click();

  await expect(page).toHaveURL(/\/child\/quests\/[^/]+$/);
}

test.describe("child builder Super Jump flow", () => {
  test.beforeEach(async ({ page }) => {
    await resetDatabase();
    await loginAsChild(page);
  });

  test("child can select the Super Jump quest and review the exact prompt", async ({ page }) => {
    await startSuperJumpQuest(page);

    await expect(page.getByText("Review your idea")).toBeVisible();

    const reviewSection = page.locator("section", { hasText: "Review your idea" });
    await expect(reviewSection.getByText("Lucas", { exact: true })).toBeVisible();
    await expect(reviewSection.getByText("Super Jump", { exact: true })).toBeVisible();

    await page.click("text=Looks good — continue");
    await expect(page).toHaveURL(/\/child\/quests\/[^/]+\/prompt$/);
    await expect(page.getByText(expectedPrompt)).toBeVisible();

    const promptParts = page.locator("section", { hasText: "Prompt parts" });
    await expect(promptParts.getByText("Who", { exact: true })).toBeVisible();
    await expect(promptParts.getByText("What", { exact: true })).toBeVisible();
    await expect(promptParts.getByText("When", { exact: true })).toBeVisible();
    await expect(promptParts.getByText("How long", { exact: true })).toBeVisible();
    await expect(promptParts.getByText("Expected result", { exact: true })).toBeVisible();
  });

  test("complete journey from selection through success", async ({ page }) => {
    await startSuperJumpQuest(page);

    await page.click("text=Looks good — continue");
    await expect(page).toHaveURL(/\/child\/quests\/[^/]+\/prompt$/);

    await page.click("text=Continue to AI plan");
    await expect(page).toHaveURL(/\/child\/quests\/[^/]+\/plan$/);

    await expect(page.getByText("Mocked plan — no real game code is being changed.")).toBeVisible();
    for (const step of planSteps) {
      await expect(page.getByText(step)).toBeVisible();
    }

    await page.click("text=Build my idea");
    await expect(page).toHaveURL(/\/child\/quests\/[^/]+\/build$/);

    await expect(
      page.getByText("This is a practice build. No real game repository was changed."),
    ).toBeVisible();

    const progressList = page.getByRole("list", { name: "Build progress" });
    for (const state of buildStates) {
      await expect(progressList.getByText(state, { exact: true })).toBeVisible();
    }

    await page.click("text=See the result");
    await expect(page).toHaveURL(/\/child\/quests\/[^/]+\/success$/);

    await expect(page.getByRole("heading", { name: "Quest complete" })).toBeVisible();
    await expect(page.getByText(expectedPrompt)).toBeVisible();
    await expect(
      page.getByText("Mocked result: the feature passed its practice tests."),
    ).toBeVisible();
    await expect(
      page.getByText("What would happen if Lucas answered an easy question"),
    ).toBeVisible();
    await expect(page.getByText("Back to Child home")).toBeVisible();
    await page.click("text=Back to Child home");
    await expect(page).toHaveURL("/child");
  });

  test("duplicate active quest selection is prevented and home shows continue", async ({
    page,
  }) => {
    await startSuperJumpQuest(page);
    const activeQuestUrl = page.url();

    await page.goto("/child/quests");
    const superJumpCard = page.locator("h3", { hasText: "Super Jump for Lucas" }).locator("..");
    await superJumpCard.locator("button", { hasText: "Choose this quest" }).click();
    await expect(page).toHaveURL(activeQuestUrl);

    await page.goto("/child");
    await expect(page.getByRole("link", { name: "Continue your quest" })).toBeVisible();
    await expect(page.locator("text=" + expectedPrompt)).toBeVisible();
  });
});

test.describe("child route security", () => {
  test("unauthenticated child quest route redirects to login", async ({ page }) => {
    await page.goto("/child/quests/00000000-0000-0000-0000-000000000021");
    await expect(page).toHaveURL(/\/login$/);
  });
});
