// @vitest-environment node

import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { requireChildApi, requireParentApi } from "@/lib/auth/guards";
import { hashPassword } from "@/lib/auth/password";
import type { GuardContext } from "@/lib/auth/guards";
import { createChildProfile, createFirstParent, createUser } from "@/lib/db/queries";
import { seedAll } from "@/scripts/seed";
import { cleanupFreshDatabase, createFreshDatabase, type FreshDatabase } from "./helpers";

const PARENT_ID = "00000000-0000-0000-0000-000000000001";
const CHILD_USER_ID = "00000000-0000-0000-0000-000000000002";
const CHILD_PROFILE_ID = "00000000-0000-0000-0000-000000000003";

async function seedParentAndChild() {
  seedAll();

  const parentHash = await hashPassword("parentpass123");
  const childHash = await hashPassword("123456");
  const now = new Date().toISOString();

  createFirstParent({
    id: PARENT_ID,
    email: "parent@example.com",
    role: "parent",
    password_hash: parentHash,
    name: "Parent",
    created_at: now,
    updated_at: now,
  });

  createUser({
    id: CHILD_USER_ID,
    email: null,
    role: "child",
    password_hash: childHash,
    name: "maya-builder",
    created_at: now,
    updated_at: now,
  });

  createChildProfile({
    id: CHILD_PROFILE_ID,
    user_id: CHILD_USER_ID,
    display_name: "Maya",
    level: 1,
    xp: 0,
    streak_days: 0,
    current_stage_id: null,
    created_at: now,
    updated_at: now,
  });
}

describe("role guards", () => {
  let fresh: FreshDatabase;

  beforeEach(() => {
    fresh = createFreshDatabase("guards");
  });

  afterEach(() => {
    cleanupFreshDatabase(fresh.tempDir);
  });

  it("rejects a parent session from child-only routes", async () => {
    await seedParentAndChild();

    const parentContext: GuardContext = {
      userId: PARENT_ID,
      role: "parent",
      displayName: "Parent",
    };

    expect(() => requireChildApi(parentContext)).toThrow("Forbidden");
  });

  it("rejects a child session from parent-only routes", async () => {
    await seedParentAndChild();

    const childContext: GuardContext = {
      userId: CHILD_USER_ID,
      role: "child",
      displayName: "Linus",
    };

    expect(() => requireParentApi(childContext)).toThrow("Forbidden");
  });

  it("allows a child session for child-only routes", async () => {
    await seedParentAndChild();

    const childContext: GuardContext = {
      userId: CHILD_USER_ID,
      role: "child",
      displayName: "Linus",
    };

    const result = requireChildApi(childContext);
    expect(result.userId).toBe(CHILD_USER_ID);
    expect(result.profileId).toBe(CHILD_PROFILE_ID);
    expect(result.displayName).toBe("Linus");
  });
});
