// @vitest-environment node

import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { closeDatabase } from "@/lib/db";
import {
  createChildProfile,
  createFirstParent,
  createImaginationJournalEntry,
  createLearningEvidence,
  createQuestSelection,
  createUser,
  hasImaginationJournalEntryForQuest,
  hasLearningEvidenceForQuest,
} from "@/lib/db/queries";
import { seedAll } from "@/scripts/seed";
import { cleanupFreshDatabase, createFreshDatabase, type FreshDatabase } from "./helpers";

const IDS = {
  parent: "00000000-0000-0000-0000-000000000001",
  childUser: "00000000-0000-0000-0000-000000000002",
  childProfile: "00000000-0000-0000-0000-000000000003",
  questSelection: "00000000-0000-0000-0000-000000000004",
};

async function seedUserAndSelection() {
  seedAll();

  const now = new Date().toISOString();
  const parentHash = "$2a$12$testhash"; // not used for authentication in this test

  createFirstParent({
    id: IDS.parent,
    email: "parent@example.com",
    role: "parent",
    password_hash: parentHash,
    name: "Parent",
    created_at: now,
    updated_at: now,
  });

  createUser({
    id: IDS.childUser,
    email: null,
    role: "child",
    password_hash: parentHash,
    name: "linus",
    created_at: now,
    updated_at: now,
  });

  createChildProfile({
    id: IDS.childProfile,
    user_id: IDS.childUser,
    display_name: "Linus",
    level: 1,
    xp: 0,
    streak_days: 0,
    current_stage_id: null,
    created_at: now,
    updated_at: now,
  });

  createQuestSelection({
    id: IDS.questSelection,
    child_profile_id: IDS.childProfile,
    template_id: "00000000-0000-0000-0000-000000000020",
    status: "success",
    selections: JSON.stringify({
      category: "Power",
      character: "Lucas",
      power: "Super Jump",
      trigger: "Correct Answer",
      subject: "Maths",
      difficulty: "Hard",
      usage: "One obstacle",
    }),
    constructed_prompt:
      "When Lucas answers a hard maths question correctly, give them Super Jump for one obstacle.",
    current_step: "success",
    created_at: now,
    updated_at: now,
  });
}

describe("quest completion idempotency", () => {
  let fresh: FreshDatabase;

  beforeEach(() => {
    fresh = createFreshDatabase("quest-completion");
  });

  afterEach(() => {
    closeDatabase();
    cleanupFreshDatabase(fresh.tempDir);
  });

  it("detects learning evidence for a quest after it is created", async () => {
    await seedUserAndSelection();

    expect(hasLearningEvidenceForQuest(IDS.questSelection)).toBe(false);

    createLearningEvidence({
      id: "00000000-0000-0000-0000-000000000010",
      child_profile_id: IDS.childProfile,
      quest_selection_id: IDS.questSelection,
      skill: "Identified character and action",
      evidence: "Linus selected Lucas and Super Jump.",
      created_at: new Date().toISOString(),
    });

    expect(hasLearningEvidenceForQuest(IDS.questSelection)).toBe(true);
  });

  it("detects an imagination journal entry for a quest after it is created", async () => {
    await seedUserAndSelection();

    expect(hasImaginationJournalEntryForQuest(IDS.questSelection)).toBe(false);

    createImaginationJournalEntry({
      id: "00000000-0000-0000-0000-000000000020",
      child_profile_id: IDS.childProfile,
      quest_selection_id: IDS.questSelection,
      idea: "Lucas should get Super Jump after a hard maths answer.",
      why_interesting: "Linus connected learning to gameplay.",
      what_learned: "Rules can have more than one condition.",
      created_at: new Date().toISOString(),
    });

    expect(hasImaginationJournalEntryForQuest(IDS.questSelection)).toBe(true);
  });
});
