import { expect, test, type Page } from "@playwright/test";
import { seedCustomParentAndChild, seedCustomParentWithTwoChildren } from "./helpers";

async function loginAsChild(page: Page, username: string, pin: string): Promise<void> {
  await page.goto("/child/login");
  await page.fill('input[name="username"]', username);
  await page.fill('input[name="pin"]', pin);
  await page.click('button[type="submit"]');
  await expect(page).toHaveURL("/child");
}

async function loginAsParent(page: Page, email: string, password: string): Promise<void> {
  await page.goto("/parent/login");
  await page.fill('input[name="email"]', email);
  await page.fill('input[name="password"]', password);
  await page.click('button[type="submit"]');
  await expect(page).toHaveURL("/parent");
}

function isMobileViewport(page: Page): boolean {
  const viewport = page.viewportSize();
  return viewport !== null && viewport.width < 768;
}

test.describe("authenticated identity regression", () => {
  test("Child dashboard greets the authenticated child by display name", async ({ page }) => {
    await seedCustomParentAndChild({
      parentEmail: "parent-maya@example.com",
      parentPassword: "ParentPass123!",
      childUsername: "maya-builder",
      childPin: "123456",
      childDisplayName: "Maya",
    });

    await loginAsChild(page, "maya-builder", "123456");

    await expect(page.getByRole("heading", { name: /Hi Maya/i, level: 1 })).toBeVisible();
    await expect(page.getByText("Hi Linus", { exact: false })).not.toBeVisible();
    await expect(page.getByText("Hi Parent-maya", { exact: false })).not.toBeVisible();
  });

  test("Parent dashboard greets the authenticated parent by display name", async ({ page }) => {
    await seedCustomParentAndChild({
      parentEmail: "asha@example.com",
      parentPassword: "AshaPass123!",
      childUsername: "maya-builder",
      childPin: "123456",
      childDisplayName: "Maya",
    });

    await loginAsParent(page, "asha@example.com", "AshaPass123!");

    await expect(page.getByRole("heading", { name: /Hi Asha/i, level: 1 })).toBeVisible();
    await expect(page.getByText("Hi Prakhar", { exact: false })).not.toBeVisible();
    await expect(page.getByText("Hi Maya", { exact: false })).not.toBeVisible();
  });

  test("Parent dashboard resolves the associated child through the persisted relationship", async ({
    page,
  }) => {
    await seedCustomParentAndChild({
      parentEmail: "parent-maya@example.com",
      parentPassword: "ParentPass123!",
      childUsername: "maya-builder",
      childPin: "123456",
      childDisplayName: "Maya",
    });

    await loginAsParent(page, "parent-maya@example.com", "ParentPass123!");

    const pageHeader = page
      .getByRole("heading", { name: /Hi Parent-maya/i, level: 1 })
      .locator("..");
    await expect(pageHeader.getByText(/Monitoring Maya/)).toBeVisible();
    await expect(pageHeader.getByText("Monitoring", { exact: false })).toBeVisible();
    await expect(
      page.getByLabel("Parent dashboard").getByText("Linus", { exact: false }),
    ).not.toBeVisible();
    await expect(
      page.getByLabel("Parent dashboard").getByText("your child", { exact: false }),
    ).not.toBeVisible();
  });

  test("duplicate display names are isolated by account ID", async ({ page }) => {
    await seedCustomParentWithTwoChildren({
      parentEmail: "parent-dup@example.com",
      parentPassword: "ParentPass123!",
      childA: { username: "maya-one", pin: "123456", displayName: "Maya" },
      childB: { username: "maya-two", pin: "654321", displayName: "Maya" },
    });

    // Each child should see only their own dashboard and quest state.
    await loginAsChild(page, "maya-one", "123456");
    await expect(page.getByRole("heading", { name: /Hi Maya/i, level: 1 })).toBeVisible();
    await expect(page.getByLabel("Current quest").getByText("No quest started yet")).toBeVisible();

    await loginAsChild(page, "maya-two", "654321");
    await expect(page.getByRole("heading", { name: /Hi Maya/i, level: 1 })).toBeVisible();
    await expect(page.getByLabel("Current quest").getByText("No quest started yet")).toBeVisible();
  });

  test("navigation uses role-specific ARIA labels", async ({ page }) => {
    await seedCustomParentAndChild({
      parentEmail: "parent-nav@example.com",
      parentPassword: "ParentPass123!",
      childUsername: "maya-builder",
      childPin: "123456",
      childDisplayName: "Maya",
    });

    await loginAsChild(page, "maya-builder", "123456");
    if (isMobileViewport(page)) {
      await expect(page.getByRole("navigation", { name: "Mobile navigation" })).toBeVisible();
      await expect(page.getByRole("navigation", { name: "Child navigation" })).toBeHidden();
    } else {
      await expect(page.getByRole("navigation", { name: "Child navigation" })).toBeVisible();
      await expect(page.getByRole("navigation", { name: "Mobile navigation" })).toBeHidden();
    }
    await expect(page.locator('[role="child"]')).toHaveCount(0);

    await loginAsParent(page, "parent-nav@example.com", "ParentPass123!");
    if (isMobileViewport(page)) {
      await expect(page.getByRole("navigation", { name: "Mobile navigation" })).toBeVisible();
      await expect(page.getByRole("navigation", { name: "Parent navigation" })).toBeHidden();
    } else {
      await expect(page.getByRole("navigation", { name: "Parent navigation" })).toBeVisible();
      await expect(page.getByRole("navigation", { name: "Mobile navigation" })).toBeHidden();
    }
    await expect(page.locator('[role="parent"]')).toHaveCount(0);
  });
});
