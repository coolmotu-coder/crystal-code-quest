import { runMigrations } from "@/lib/db/migrations";
import {
  createAchievement,
  createBuildRecord,
  createChildProfile,
  createImaginationJournalEntry,
  createLearningEvidence,
  createLearningStage,
  createParentChildRelationship,
  createParentPolicy,
  createPlanRecord,
  createPromptRecord,
  createQuestSelection,
  createQuestTemplate,
  createUser,
  getChildProfileById,
  getUserById,
} from "@/lib/db/queries";

const IDS = {
  parentUser: "00000000-0000-0000-0000-000000000001",
  childUser: "00000000-0000-0000-0000-000000000002",
  childProfile: "00000000-0000-0000-0000-000000000003",
  relationship: "00000000-0000-0000-0000-000000000004",
  learningStage: "00000000-0000-0000-0000-000000000010",
  questTemplate: "00000000-0000-0000-0000-000000000020",
  questSelection: "00000000-0000-0000-0000-000000000021",
  promptRecord: "00000000-0000-0000-0000-000000000022",
  planRecord: "00000000-0000-0000-0000-000000000023",
  buildRecord: "00000000-0000-0000-0000-000000000024",
  evidence1: "00000000-0000-0000-0000-000000000030",
  evidence2: "00000000-0000-0000-0000-000000000031",
  journalEntry: "00000000-0000-0000-0000-000000000040",
  achievement: "00000000-0000-0000-0000-000000000050",
  parentPolicy: "00000000-0000-0000-0000-000000000060",
};

export const SUPER_JUMP_SLUG = "super-jump-for-lucas";

export function seedLearningStages(): void {
  createLearningStage({
    id: IDS.learningStage,
    key: "select-options",
    name: "Select Prompt Options",
    description: "Choose approved ideas and options to build a structured prompt.",
    sortOrder: 1,
    maxDailyQuests: 3,
    allowsFreePrompt: 0,
    created_at: new Date().toISOString(),
  });
}

export function seedQuestTemplates(): void {
  createQuestTemplate({
    id: IDS.questTemplate,
    category: "Power",
    slug: SUPER_JUMP_SLUG,
    name: "Super Jump for Lucas",
    description: "Give Lucas a Super Jump power when he answers a hard maths question correctly.",
    icon: "Zap",
    learning_stage_id: IDS.learningStage,
    options_schema: JSON.stringify({
      category: ["Power"],
      character: ["Lucas"],
      power: ["Super Jump"],
      trigger: ["Correct Answer"],
      subject: ["Maths"],
      difficulty: ["Hard"],
      usage: ["One obstacle"],
    }),
    created_at: new Date().toISOString(),
  });
}

export function seedDemoHistory(): void {
  const childProfile = getChildProfileById(IDS.childProfile);
  if (!childProfile) {
    console.warn("No child profile found; skipping demo history seed.");
    return;
  }

  const now = new Date().toISOString();

  createQuestSelection({
    id: IDS.questSelection,
    child_profile_id: IDS.childProfile,
    template_id: IDS.questTemplate,
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
      "When Lucas answers a hard maths question correctly, give him Super Jump for one obstacle.",
    current_step: "success",
    created_at: now,
    updated_at: now,
  });

  createPromptRecord({
    id: IDS.promptRecord,
    quest_selection_id: IDS.questSelection,
    template_text:
      "When {character} answers a {difficulty} {subject} question {trigger}, give him {power} for {usage}.",
    final_prompt:
      "When Lucas answers a hard maths question correctly, give him Super Jump for one obstacle.",
    free_written_prompt: null,
    created_at: now,
  });

  createPlanRecord({
    id: IDS.planRecord,
    quest_selection_id: IDS.questSelection,
    plan_steps: JSON.stringify([
      "Listen for a correct hard maths answer.",
      "Give Super Jump to Lucas.",
      "Let Lucas clear one approved obstacle.",
      "Remove the power after it is used.",
      "Check that existing questions still work.",
    ]),
    changes_requested: null,
    status: "approved",
    created_at: now,
    updated_at: now,
  });

  createBuildRecord({
    id: IDS.buildRecord,
    quest_selection_id: IDS.questSelection,
    current_state: "preparing_preview",
    status: "mocked_success",
    result_summary:
      "Mocked result: the feature passed its practice tests. No real game code was changed.",
    failure_reason: null,
    created_at: now,
    completed_at: now,
  });

  createLearningEvidence({
    id: IDS.evidence1,
    child_profile_id: IDS.childProfile,
    quest_selection_id: IDS.questSelection,
    skill: "Identified character and action",
    evidence: "Linus selected Lucas as the character and Super Jump as the power.",
    created_at: now,
  });

  createLearningEvidence({
    id: IDS.evidence2,
    child_profile_id: IDS.childProfile,
    quest_selection_id: IDS.questSelection,
    skill: "Combined two conditions",
    evidence:
      "Linus added two conditions that must both be true: the answer must be correct and the question must be hard.",
    created_at: now,
  });

  createImaginationJournalEntry({
    id: IDS.journalEntry,
    child_profile_id: IDS.childProfile,
    quest_selection_id: IDS.questSelection,
    idea: "Lucas should get Super Jump after answering a hard maths question.",
    why_interesting:
      "Linus connected a learning moment (correct hard answer) to a gameplay reward (Super Jump).",
    what_learned: "A rule can have more than one condition that must all be true.",
    created_at: now,
  });

  createAchievement({
    id: IDS.achievement,
    child_profile_id: IDS.childProfile,
    slug: "first-prompt",
    name: "Prompt Builder",
    description: "Built your first structured prompt.",
    icon: "Pencil",
    unlocked_at: now,
  });
}

export function seedUsersAndProfiles(
  parentEmail: string,
  parentPasswordHash: string,
  childUsername: string,
  childPasswordHash: string,
): void {
  if (getUserById(IDS.parentUser)) {
    console.log("Seed users already exist; skipping user creation.");
    return;
  }

  const now = new Date().toISOString();

  createUser({
    id: IDS.parentUser,
    email: parentEmail,
    role: "parent",
    password_hash: parentPasswordHash,
    name: "Parent",
    created_at: now,
    updated_at: now,
  });

  createUser({
    id: IDS.childUser,
    email: null,
    role: "child",
    password_hash: childPasswordHash,
    name: childUsername,
    created_at: now,
    updated_at: now,
  });

  createChildProfile({
    id: IDS.childProfile,
    user_id: IDS.childUser,
    display_name: "Linus",
    level: 3,
    xp: 1250,
    streak_days: 5,
    current_stage_id: IDS.learningStage,
    created_at: now,
    updated_at: now,
  });

  createParentChildRelationship({
    id: IDS.relationship,
    parent_user_id: IDS.parentUser,
    child_user_id: IDS.childUser,
    created_at: now,
  });

  createParentPolicy({
    id: IDS.parentPolicy,
    parent_user_id: IDS.parentUser,
    child_profile_id: IDS.childProfile,
    current_stage_id: IDS.learningStage,
    allowed_categories: JSON.stringify(["Power", "Obstacle", "Reward"]),
    daily_quest_limit: 3,
    created_at: now,
    updated_at: now,
  });
}

export function seedAll(): void {
  runMigrations();
  seedLearningStages();
  seedQuestTemplates();
}

if (require.main === module) {
  seedAll();
  seedDemoHistory();
  console.log("Seed complete.");
}
