import { getDatabase } from "./index";

export type UserRow = {
  id: string;
  email: string | null;
  role: "parent" | "child";
  password_hash: string;
  name: string;
  created_at: string;
  updated_at: string;
};

export type ChildProfileRow = {
  id: string;
  user_id: string;
  display_name: string;
  level: number;
  xp: number;
  streak_days: number;
  current_stage_id: string | null;
  created_at: string;
  updated_at: string;
};

export type QuestTemplateRow = {
  id: string;
  category: string;
  slug: string;
  name: string;
  description: string;
  icon: string;
  learning_stage_id: string | null;
  options_schema: string;
  created_at: string;
};

export type QuestSelectionRow = {
  id: string;
  child_profile_id: string;
  template_id: string;
  status: string;
  selections: string;
  constructed_prompt: string | null;
  current_step: string | null;
  created_at: string;
  updated_at: string;
};

export type LearningStageRow = {
  id: string;
  key: string;
  name: string;
  description: string;
  order: number;
  // Application-level camelCase names. createLearningStage maps these to the
  // snake_case database columns max_daily_quests and allows_free_prompt.
  maxDailyQuests: number;
  allowsFreePrompt: number;
  created_at: string;
};

export function getUserByEmail(email: string): UserRow | undefined {
  const db = getDatabase();
  return db.prepare("SELECT * FROM users WHERE email = ?").get(email) as UserRow | undefined;
}

export function getUserById(id: string): UserRow | undefined {
  const db = getDatabase();
  return db.prepare("SELECT * FROM users WHERE id = ?").get(id) as UserRow | undefined;
}

export function getUserByUsername(username: string): UserRow | undefined {
  const db = getDatabase();
  return db.prepare("SELECT * FROM users WHERE name = ?").get(username) as UserRow | undefined;
}

export function getChildProfileByUserId(userId: string): ChildProfileRow | undefined {
  const db = getDatabase();
  return db
    .prepare("SELECT * FROM child_profiles WHERE user_id = ?")
    .get(userId) as ChildProfileRow | undefined;
}

export function getChildProfileById(id: string): ChildProfileRow | undefined {
  const db = getDatabase();
  return db.prepare("SELECT * FROM child_profiles WHERE id = ?").get(id) as ChildProfileRow | undefined;
}

export function getCurrentChildForParent(parentUserId: string): ChildProfileRow | undefined {
  const db = getDatabase();
  return db
    .prepare(
      `
      SELECT cp.* FROM child_profiles cp
      JOIN parent_child_relationships pcr ON pcr.child_user_id = cp.user_id
      WHERE pcr.parent_user_id = ?
      LIMIT 1
      `,
    )
    .get(parentUserId) as ChildProfileRow | undefined;
}

export function getQuestTemplateBySlug(slug: string): QuestTemplateRow | undefined {
  const db = getDatabase();
  return db
    .prepare("SELECT * FROM quest_templates WHERE slug = ?")
    .get(slug) as QuestTemplateRow | undefined;
}

export function getQuestTemplateById(id: string): QuestTemplateRow | undefined {
  const db = getDatabase();
  return db
    .prepare("SELECT * FROM quest_templates WHERE id = ?")
    .get(id) as QuestTemplateRow | undefined;
}

export function getQuestSelectionById(id: string): QuestSelectionRow | undefined {
  const db = getDatabase();
  return db
    .prepare("SELECT * FROM quest_selections WHERE id = ?")
    .get(id) as QuestSelectionRow | undefined;
}

export function getLatestQuestSelectionForChild(
  childProfileId: string,
): QuestSelectionRow | undefined {
  const db = getDatabase();
  return db
    .prepare(
      "SELECT * FROM quest_selections WHERE child_profile_id = ? ORDER BY updated_at DESC LIMIT 1",
    )
    .get(childProfileId) as QuestSelectionRow | undefined;
}

export function listQuestSelectionsForChild(childProfileId: string): QuestSelectionRow[] {
  const db = getDatabase();
  return db
    .prepare(
      "SELECT * FROM quest_selections WHERE child_profile_id = ? ORDER BY updated_at DESC",
    )
    .all(childProfileId) as QuestSelectionRow[];
}

export function getLearningStageById(id: string): LearningStageRow | undefined {
  const db = getDatabase();
  return db
    .prepare("SELECT * FROM learning_stages WHERE id = ?")
    .get(id) as LearningStageRow | undefined;
}

export function getLearningStageByKey(key: string): LearningStageRow | undefined {
  const db = getDatabase();
  return db
    .prepare("SELECT * FROM learning_stages WHERE key = ?")
    .get(key) as LearningStageRow | undefined;
}

export function getDefaultLearningStage(): LearningStageRow | undefined {
  const db = getDatabase();
  return db
    .prepare("SELECT * FROM learning_stages ORDER BY order ASC LIMIT 1")
    .get() as LearningStageRow | undefined;
}

export function getParentPolicyForChild(childProfileId: string): {
  id: string;
  parent_user_id: string;
  child_profile_id: string;
  current_stage_id: string;
  allowed_categories: string;
  daily_quest_limit: number;
  created_at: string;
  updated_at: string;
} | undefined {
  const db = getDatabase();
  return db
    .prepare("SELECT * FROM parent_policies WHERE child_profile_id = ?")
    .get(childProfileId) as
    | {
        id: string;
        parent_user_id: string;
        child_profile_id: string;
        current_stage_id: string;
        allowed_categories: string;
        daily_quest_limit: number;
        created_at: string;
        updated_at: string;
      }
    | undefined;
}

export function createUser(user: UserRow): void {
  const db = getDatabase();
  const stmt = db.prepare(
    `
    INSERT INTO users (id, email, role, password_hash, name, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?)
    `,
  );
  stmt.run(
    user.id,
    user.email,
    user.role,
    user.password_hash,
    user.name,
    user.created_at,
    user.updated_at,
  );
}

export function createChildProfile(profile: ChildProfileRow): void {
  const db = getDatabase();
  const stmt = db.prepare(
    `
    INSERT INTO child_profiles (id, user_id, display_name, level, xp, streak_days, current_stage_id, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `,
  );
  stmt.run(
    profile.id,
    profile.user_id,
    profile.display_name,
    profile.level,
    profile.xp,
    profile.streak_days,
    profile.current_stage_id,
    profile.created_at,
    profile.updated_at,
  );
}

export function createParentChildRelationship(relationship: {
  id: string;
  parent_user_id: string;
  child_user_id: string;
  created_at: string;
}): void {
  const db = getDatabase();
  const stmt = db.prepare(
    "INSERT INTO parent_child_relationships (id, parent_user_id, child_user_id, created_at) VALUES (?, ?, ?, ?)",
  );
  stmt.run(relationship.id, relationship.parent_user_id, relationship.child_user_id, relationship.created_at);
}

export function createLearningStage(stage: LearningStageRow): void {
  const db = getDatabase();
  const stmt = db.prepare(
    `
    INSERT INTO learning_stages (id, key, name, description, order, max_daily_quests, allows_free_prompt, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `,
  );
  stmt.run(
    stage.id,
    stage.key,
    stage.name,
    stage.description,
    stage.order,
    stage.maxDailyQuests,
    stage.allowsFreePrompt,
    stage.created_at,
  );
}

export function createParentPolicy(policy: {
  id: string;
  parent_user_id: string;
  child_profile_id: string;
  current_stage_id: string;
  allowed_categories: string;
  daily_quest_limit: number;
  created_at: string;
  updated_at: string;
}): void {
  const db = getDatabase();
  const stmt = db.prepare(
    `
    INSERT INTO parent_policies (id, parent_user_id, child_profile_id, current_stage_id, allowed_categories, daily_quest_limit, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `,
  );
  stmt.run(
    policy.id,
    policy.parent_user_id,
    policy.child_profile_id,
    policy.current_stage_id,
    policy.allowed_categories,
    policy.daily_quest_limit,
    policy.created_at,
    policy.updated_at,
  );
}

export function createQuestTemplate(template: QuestTemplateRow): void {
  const db = getDatabase();
  const stmt = db.prepare(
    `
    INSERT INTO quest_templates (id, category, slug, name, description, icon, learning_stage_id, options_schema, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `,
  );
  stmt.run(
    template.id,
    template.category,
    template.slug,
    template.name,
    template.description,
    template.icon,
    template.learning_stage_id,
    template.options_schema,
    template.created_at,
  );
}

export function createQuestSelection(selection: QuestSelectionRow): void {
  const db = getDatabase();
  const stmt = db.prepare(
    `
    INSERT INTO quest_selections (id, child_profile_id, template_id, status, selections, constructed_prompt, current_step, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `,
  );
  stmt.run(
    selection.id,
    selection.child_profile_id,
    selection.template_id,
    selection.status,
    selection.selections,
    selection.constructed_prompt,
    selection.current_step,
    selection.created_at,
    selection.updated_at,
  );
}

export function updateQuestSelection(selection: {
  id: string;
  status: string;
  constructed_prompt: string | null;
  current_step: string | null;
  updated_at: string;
}): void {
  const db = getDatabase();
  const stmt = db.prepare(
    `
    UPDATE quest_selections
    SET status = ?, constructed_prompt = ?, current_step = ?, updated_at = ?
    WHERE id = ?
    `,
  );
  stmt.run(selection.status, selection.constructed_prompt, selection.current_step, selection.updated_at, selection.id);
}

export function createPromptRecord(record: {
  id: string;
  quest_selection_id: string;
  template_text: string;
  final_prompt: string;
  free_written_prompt: string | null;
  created_at: string;
}): void {
  const db = getDatabase();
  const stmt = db.prepare(
    `
    INSERT INTO prompt_records (id, quest_selection_id, template_text, final_prompt, free_written_prompt, created_at)
    VALUES (?, ?, ?, ?, ?, ?)
    `,
  );
  stmt.run(
    record.id,
    record.quest_selection_id,
    record.template_text,
    record.final_prompt,
    record.free_written_prompt,
    record.created_at,
  );
}

export function createPlanRecord(record: {
  id: string;
  quest_selection_id: string;
  plan_steps: string;
  changes_requested: string | null;
  status: string;
  created_at: string;
  updated_at: string;
}): void {
  const db = getDatabase();
  const stmt = db.prepare(
    `
    INSERT INTO plan_records (id, quest_selection_id, plan_steps, changes_requested, status, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?)
    `,
  );
  stmt.run(
    record.id,
    record.quest_selection_id,
    record.plan_steps,
    record.changes_requested,
    record.status,
    record.created_at,
    record.updated_at,
  );
}

export function createBuildRecord(record: {
  id: string;
  quest_selection_id: string;
  current_state: string | null;
  status: string;
  result_summary: string | null;
  failure_reason: string | null;
  created_at: string;
  completed_at: string | null;
}): void {
  const db = getDatabase();
  const stmt = db.prepare(
    `
    INSERT INTO build_records (id, quest_selection_id, current_state, status, result_summary, failure_reason, created_at, completed_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `,
  );
  stmt.run(
    record.id,
    record.quest_selection_id,
    record.current_state,
    record.status,
    record.result_summary,
    record.failure_reason,
    record.created_at,
    record.completed_at,
  );
}

export function createLearningEvidence(record: {
  id: string;
  child_profile_id: string;
  quest_selection_id: string;
  skill: string;
  evidence: string;
  created_at: string;
}): void {
  const db = getDatabase();
  const stmt = db.prepare(
    `
    INSERT INTO learning_evidence (id, child_profile_id, quest_selection_id, skill, evidence, created_at)
    VALUES (?, ?, ?, ?, ?, ?)
    `,
  );
  stmt.run(
    record.id,
    record.child_profile_id,
    record.quest_selection_id,
    record.skill,
    record.evidence,
    record.created_at,
  );
}

export function createImaginationJournalEntry(record: {
  id: string;
  child_profile_id: string;
  quest_selection_id: string;
  idea: string;
  why_interesting: string;
  what_learned: string;
  created_at: string;
}): void {
  const db = getDatabase();
  const stmt = db.prepare(
    `
    INSERT INTO imagination_journal_entries (id, child_profile_id, quest_selection_id, idea, why_interesting, what_learned, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?)
    `,
  );
  stmt.run(
    record.id,
    record.child_profile_id,
    record.quest_selection_id,
    record.idea,
    record.why_interesting,
    record.what_learned,
    record.created_at,
  );
}

export function createAchievement(record: {
  id: string;
  child_profile_id: string;
  slug: string;
  name: string;
  description: string;
  icon: string;
  unlocked_at: string;
}): void {
  const db = getDatabase();
  const stmt = db.prepare(
    `
    INSERT INTO achievements (id, child_profile_id, slug, name, description, icon, unlocked_at)
    VALUES (?, ?, ?, ?, ?, ?, ?)
    ON CONFLICT(child_profile_id, slug) DO NOTHING
    `,
  );
  stmt.run(
    record.id,
    record.child_profile_id,
    record.slug,
    record.name,
    record.description,
    record.icon,
    record.unlocked_at,
  );
}

export function getLearningEvidenceForChild(childProfileId: string): Array<{
  id: string;
  child_profile_id: string;
  quest_selection_id: string;
  skill: string;
  evidence: string;
  created_at: string;
}> {
  const db = getDatabase();
  return db
    .prepare(
      "SELECT * FROM learning_evidence WHERE child_profile_id = ? ORDER BY created_at DESC",
    )
    .all(childProfileId) as Array<{
    id: string;
    child_profile_id: string;
    quest_selection_id: string;
    skill: string;
    evidence: string;
    created_at: string;
  }>;
}

export function getLearningEvidenceForQuest(questSelectionId: string): Array<{
  id: string;
  child_profile_id: string;
  quest_selection_id: string;
  skill: string;
  evidence: string;
  created_at: string;
}> {
  const db = getDatabase();
  return db
    .prepare("SELECT * FROM learning_evidence WHERE quest_selection_id = ? ORDER BY created_at DESC")
    .all(questSelectionId) as Array<{
    id: string;
    child_profile_id: string;
    quest_selection_id: string;
    skill: string;
    evidence: string;
    created_at: string;
  }>;
}

export function getImaginationJournalForChild(childProfileId: string): Array<{
  id: string;
  child_profile_id: string;
  quest_selection_id: string;
  idea: string;
  why_interesting: string;
  what_learned: string;
  created_at: string;
}> {
  const db = getDatabase();
  return db
    .prepare(
      "SELECT * FROM imagination_journal_entries WHERE child_profile_id = ? ORDER BY created_at DESC",
    )
    .all(childProfileId) as Array<{
    id: string;
    child_profile_id: string;
    quest_selection_id: string;
    idea: string;
    why_interesting: string;
    what_learned: string;
    created_at: string;
  }>;
}

export function getAchievementsForChild(childProfileId: string): Array<{
  id: string;
  child_profile_id: string;
  slug: string;
  name: string;
  description: string;
  icon: string;
  unlocked_at: string;
}> {
  const db = getDatabase();
  return db
    .prepare("SELECT * FROM achievements WHERE child_profile_id = ? ORDER BY unlocked_at DESC")
    .all(childProfileId) as Array<{
    id: string;
    child_profile_id: string;
    slug: string;
    name: string;
    description: string;
    icon: string;
    unlocked_at: string;
  }>;
}

export function getPromptRecord(questSelectionId: string): {
  id: string;
  quest_selection_id: string;
  template_text: string;
  final_prompt: string;
  free_written_prompt: string | null;
  created_at: string;
} | undefined {
  const db = getDatabase();
  return db
    .prepare("SELECT * FROM prompt_records WHERE quest_selection_id = ?")
    .get(questSelectionId) as
    | {
        id: string;
        quest_selection_id: string;
        template_text: string;
        final_prompt: string;
        free_written_prompt: string | null;
        created_at: string;
      }
    | undefined;
}

export function getPlanRecord(questSelectionId: string): {
  id: string;
  quest_selection_id: string;
  plan_steps: string;
  changes_requested: string | null;
  status: string;
  created_at: string;
  updated_at: string;
} | undefined {
  const db = getDatabase();
  return db
    .prepare("SELECT * FROM plan_records WHERE quest_selection_id = ?")
    .get(questSelectionId) as
    | {
        id: string;
        quest_selection_id: string;
        plan_steps: string;
        changes_requested: string | null;
        status: string;
        created_at: string;
        updated_at: string;
      }
    | undefined;
}

export function getBuildRecord(questSelectionId: string): {
  id: string;
  quest_selection_id: string;
  current_state: string | null;
  status: string;
  result_summary: string | null;
  failure_reason: string | null;
  created_at: string;
  completed_at: string | null;
} | undefined {
  const db = getDatabase();
  return db
    .prepare("SELECT * FROM build_records WHERE quest_selection_id = ?")
    .get(questSelectionId) as
    | {
        id: string;
        quest_selection_id: string;
        current_state: string | null;
        status: string;
        result_summary: string | null;
        failure_reason: string | null;
        created_at: string;
        completed_at: string | null;
      }
    | undefined;
}

export function updateBuildRecord(record: {
  id: string;
  current_state: string | null;
  status: string;
  result_summary: string | null;
  failure_reason: string | null;
  completed_at: string | null;
}): void {
  const db = getDatabase();
  const stmt = db.prepare(
    `
    UPDATE build_records
    SET current_state = ?, status = ?, result_summary = ?, failure_reason = ?, completed_at = ?
    WHERE id = ?
    `,
  );
  stmt.run(
    record.current_state,
    record.status,
    record.result_summary,
    record.failure_reason,
    record.completed_at,
    record.id,
  );
}

export function updatePlanRecord(record: {
  id: string;
  plan_steps: string;
  changes_requested: string | null;
  status: string;
  updated_at: string;
}): void {
  const db = getDatabase();
  const stmt = db.prepare(
    `
    UPDATE plan_records
    SET plan_steps = ?, changes_requested = ?, status = ?, updated_at = ?
    WHERE id = ?
    `,
  );
  stmt.run(
    record.plan_steps,
    record.changes_requested,
    record.status,
    record.updated_at,
    record.id,
  );
}

export function updateChildProfileStage(childProfileId: string, stageId: string): void {
  const db = getDatabase();
  const stmt = db.prepare(
    "UPDATE child_profiles SET current_stage_id = ?, updated_at = ? WHERE id = ?",
  );
  stmt.run(stageId, new Date().toISOString(), childProfileId);
}

export function updateParentPolicyStage(childProfileId: string, stageId: string): void {
  const db = getDatabase();
  const stmt = db.prepare(
    "UPDATE parent_policies SET current_stage_id = ?, updated_at = ? WHERE child_profile_id = ?",
  );
  stmt.run(stageId, new Date().toISOString(), childProfileId);
}

export function updateParentPolicyDailyLimit(childProfileId: string, limit: number): void {
  const db = getDatabase();
  const stmt = db.prepare(
    "UPDATE parent_policies SET daily_quest_limit = ?, updated_at = ? WHERE child_profile_id = ?",
  );
  stmt.run(limit, new Date().toISOString(), childProfileId);
}

export function updateParentPolicyAllowedCategories(childProfileId: string, categories: string): void {
  const db = getDatabase();
  const stmt = db.prepare(
    "UPDATE parent_policies SET allowed_categories = ?, updated_at = ? WHERE child_profile_id = ?",
  );
  stmt.run(categories, new Date().toISOString(), childProfileId);
}

export function updateChildProfileStreak(childProfileId: string, streak: number): void {
  const db = getDatabase();
  const stmt = db.prepare(
    "UPDATE child_profiles SET streak_days = ?, updated_at = ? WHERE id = ?",
  );
  stmt.run(streak, new Date().toISOString(), childProfileId);
}

export function updateChildProfileXp(childProfileId: string, xp: number): void {
  const db = getDatabase();
  const stmt = db.prepare(
    "UPDATE child_profiles SET xp = ?, updated_at = ? WHERE id = ?",
  );
  stmt.run(xp, new Date().toISOString(), childProfileId);
}

export function deleteAllData(): void {
  const db = getDatabase();
  db.exec("PRAGMA foreign_keys = OFF;");
  const tables = [
    "achievements",
    "imagination_journal_entries",
    "learning_evidence",
    "build_records",
    "plan_records",
    "prompt_records",
    "quest_selections",
    "quest_templates",
    "parent_policies",
    "parent_child_relationships",
    "learning_stages",
    "child_profiles",
    "users",
    "migrations",
  ];
  for (const table of tables) {
    db.exec(`DELETE FROM ${table};`);
  }
  db.exec("PRAGMA foreign_keys = ON;");
}
