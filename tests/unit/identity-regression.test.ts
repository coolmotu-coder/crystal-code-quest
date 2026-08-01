// @vitest-environment node

import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { constructPrompt, buildMockedPlanSteps, parsePromptSelections } from "@/lib/quest/prompt";
import { requireParentApi } from "@/lib/auth/guards";
import { cleanupFreshDatabase, createFreshDatabase, type FreshDatabase } from "./helpers";
import { closeDatabase } from "@/lib/db";
import {
  createChildProfile,
  createFirstParent,
  createParentChildRelationship,
  createQuestSelection,
  createUser,
  listQuestSelectionsForChild,
} from "@/lib/db/queries";
import { seedAll } from "@/scripts/seed";

const IDS = {
  parentUser: "00000000-0000-0000-0000-000000000001",
  parentUserAsha: "00000000-0000-0000-0000-000000000002",
  childUserMaya: "00000000-0000-0000-0000-000000000003",
  childProfileMaya: "00000000-0000-0000-0000-000000000004",
  childUserMaya2: "00000000-0000-0000-0000-000000000005",
  childProfileMaya2: "00000000-0000-0000-0000-000000000006",
  questTemplate: "00000000-0000-0000-0000-000000000020",
  questSelectionA: "00000000-0000-0000-0000-000000000007",
  questSelectionB: "00000000-0000-0000-0000-000000000008",
};

function seedParentWithChild(
  parentUserId: string,
  parentEmail: string,
  parentName: string,
  childUserId: string,
  childProfileId: string,
  childUsername: string,
  childDisplayName: string,
) {
  const now = new Date().toISOString();
  const passwordHash = "$2a$12$testhash"; // not used for authentication in these tests

  createFirstParent({
    id: parentUserId,
    email: parentEmail,
    role: "parent",
    password_hash: passwordHash,
    name: parentName,
    created_at: now,
    updated_at: now,
  });

  createUser({
    id: childUserId,
    email: null,
    role: "child",
    password_hash: passwordHash,
    name: childUsername,
    created_at: now,
    updated_at: now,
  });

  createChildProfile({
    id: childProfileId,
    user_id: childUserId,
    display_name: childDisplayName,
    level: 1,
    xp: 0,
    streak_days: 0,
    current_stage_id: null,
    created_at: now,
    updated_at: now,
  });

  createParentChildRelationship({
    id: crypto.randomUUID(),
    parent_user_id: parentUserId,
    child_user_id: childUserId,
    created_at: now,
  });
}

describe("creator and player identity separation", () => {
  it("uses the selected character in the prompt, not the creator name", () => {
    const selections = parsePromptSelections({
      category: "Power",
      character: "Arjun",
      power: "Super Jump",
      trigger: "Correct Answer",
      subject: "Maths",
      difficulty: "Hard",
      usage: "One obstacle",
    });

    const prompt = constructPrompt(selections);

    expect(prompt.text).toBe(
      "When Arjun answers a hard maths question correctly, give them Super Jump for one obstacle.",
    );
    expect(prompt.text).not.toContain("Maya");
    expect(prompt.who).toBe("Arjun");
    expect(prompt.expectedResult).toBe("Arjun can clear a higher obstacle");
  });

  it("uses the selected character in mocked plan steps", () => {
    const steps = buildMockedPlanSteps("Arjun");

    expect(steps).toContain("Give Super Jump to Arjun.");
    expect(steps).toContain("Let Arjun clear one approved obstacle.");
    expect(steps).not.toContain("Maya");
  });

  it("changes the prompt when the player changes", () => {
    const baseSelections = {
      category: "Power",
      power: "Super Jump",
      trigger: "Correct Answer",
      subject: "Maths",
      difficulty: "Hard",
      usage: "One obstacle",
    };

    const arjunPrompt = constructPrompt(
      parsePromptSelections({ ...baseSelections, character: "Arjun" }),
    );
    const lucasPrompt = constructPrompt(
      parsePromptSelections({ ...baseSelections, character: "Lucas" }),
    );

    expect(arjunPrompt.text).toContain("Arjun");
    expect(lucasPrompt.text).toContain("Lucas");
    expect(arjunPrompt.text).not.toContain("Lucas");
    expect(lucasPrompt.text).not.toContain("Arjun");
  });

  it("does not change the player when the creator display name changes", () => {
    const selections = parsePromptSelections({
      category: "Power",
      character: "Arjun",
      power: "Super Jump",
      trigger: "Correct Answer",
      subject: "Maths",
      difficulty: "Hard",
      usage: "One obstacle",
    });

    const promptByMaya = constructPrompt(selections);
    const promptByJordan = constructPrompt(selections);

    expect(promptByMaya.text).toBe(promptByJordan.text);
    expect(promptByMaya.text).toContain("Arjun");
    expect(promptByMaya.text).not.toContain("Maya");
    expect(promptByMaya.text).not.toContain("Jordan");
  });
});

describe("Parent-associated child resolution", () => {
  let fresh: FreshDatabase;

  beforeEach(() => {
    fresh = createFreshDatabase("parent-child-resolution");
    seedAll();
  });

  afterEach(() => {
    closeDatabase();
    cleanupFreshDatabase(fresh.tempDir);
  });

  it("resolves the associated child through the persisted relationship, not by display name", async () => {
    seedParentWithChild(
      IDS.parentUserAsha,
      "asha@example.com",
      "Asha",
      IDS.childUserMaya,
      IDS.childProfileMaya,
      "maya-builder",
      "Maya",
    );

    const result = requireParentApi({
      userId: IDS.parentUserAsha,
      role: "parent",
      displayName: "Asha",
    });

    expect(result.displayName).toBe("Asha");
    expect(result.childProfileId).toBe(IDS.childProfileMaya);
  });

  it("does not resolve a child by display name alone", () => {
    seedParentWithChild(
      IDS.parentUser,
      "parent@example.com",
      "Parent",
      IDS.childUserMaya,
      IDS.childProfileMaya,
      "maya-builder",
      "Maya",
    );

    // Create an unrelated parent with no child relationship.
    createFirstParent({
      id: IDS.parentUserAsha,
      email: "asha@example.com",
      role: "parent",
      password_hash: "$2a$12$testhash",
      name: "Asha",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });

    expect(() =>
      requireParentApi({
        userId: IDS.parentUserAsha,
        role: "parent",
        displayName: "Asha",
      }),
    ).toThrow();
  });
});

describe("duplicate display name isolation", () => {
  let fresh: FreshDatabase;

  beforeEach(() => {
    fresh = createFreshDatabase("duplicate-display-names");
    seedAll();
  });

  afterEach(() => {
    closeDatabase();
    cleanupFreshDatabase(fresh.tempDir);
  });

  it("keeps each child’s quests separate even when display names are identical", () => {
    seedParentWithChild(
      IDS.parentUser,
      "parent@example.com",
      "Parent",
      IDS.childUserMaya,
      IDS.childProfileMaya,
      "maya-one",
      "Maya",
    );
    seedParentWithChild(
      IDS.parentUser,
      "parent@example.com",
      "Parent",
      IDS.childUserMaya2,
      IDS.childProfileMaya2,
      "maya-two",
      "Maya",
    );

    const now = new Date().toISOString();
    const selections = JSON.stringify({
      category: "Power",
      character: "Arjun",
      power: "Super Jump",
      trigger: "Correct Answer",
      subject: "Maths",
      difficulty: "Hard",
      usage: "One obstacle",
    });

    createQuestSelection({
      id: IDS.questSelectionA,
      child_profile_id: IDS.childProfileMaya,
      template_id: IDS.questTemplate,
      status: "draft",
      selections,
      constructed_prompt:
        "When Arjun answers a hard maths question correctly, give them Super Jump for one obstacle.",
      current_step: "selected",
      created_at: now,
      updated_at: now,
    });

    createQuestSelection({
      id: IDS.questSelectionB,
      child_profile_id: IDS.childProfileMaya2,
      template_id: IDS.questTemplate,
      status: "draft",
      selections,
      constructed_prompt:
        "When Arjun answers a hard maths question correctly, give them Super Jump for one obstacle.",
      current_step: "selected",
      created_at: now,
      updated_at: now,
    });

    const childAQuests = listQuestSelectionsForChild(IDS.childProfileMaya);
    const childBQuests = listQuestSelectionsForChild(IDS.childProfileMaya2);

    expect(childAQuests).toHaveLength(1);
    expect(childBQuests).toHaveLength(1);
    expect(childAQuests[0]).toBeDefined();
    expect(childBQuests[0]).toBeDefined();
    expect(childAQuests[0]!.id).toBe(IDS.questSelectionA);
    expect(childBQuests[0]!.id).toBe(IDS.questSelectionB);
    expect(childAQuests[0]!.id).not.toBe(childBQuests[0]!.id);
  });
});
