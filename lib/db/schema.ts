export const SCHEMA_SQL = `
CREATE TABLE IF NOT EXISTS migrations (
  name TEXT PRIMARY KEY,
  applied_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE,
  role TEXT NOT NULL CHECK (role IN ('parent', 'child')),
  password_hash TEXT NOT NULL,
  name TEXT NOT NULL,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS child_profiles (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL UNIQUE,
  display_name TEXT NOT NULL,
  level INTEGER NOT NULL DEFAULT 1,
  xp INTEGER NOT NULL DEFAULT 0,
  streak_days INTEGER NOT NULL DEFAULT 0,
  current_stage_id TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS parent_child_relationships (
  id TEXT PRIMARY KEY,
  parent_user_id TEXT NOT NULL,
  child_user_id TEXT NOT NULL UNIQUE,
  created_at TEXT NOT NULL,
  FOREIGN KEY (parent_user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (child_user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS quest_templates (
  id TEXT PRIMARY KEY,
  category TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  icon TEXT NOT NULL,
  learning_stage_id TEXT,
  options_schema TEXT NOT NULL,
  created_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS quest_selections (
  id TEXT PRIMARY KEY,
  child_profile_id TEXT NOT NULL,
  template_id TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'draft',
  selections TEXT NOT NULL,
  constructed_prompt TEXT,
  current_step TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  FOREIGN KEY (child_profile_id) REFERENCES child_profiles(id) ON DELETE CASCADE,
  FOREIGN KEY (template_id) REFERENCES quest_templates(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS prompt_records (
  id TEXT PRIMARY KEY,
  quest_selection_id TEXT NOT NULL UNIQUE,
  template_text TEXT NOT NULL,
  final_prompt TEXT NOT NULL,
  free_written_prompt TEXT,
  created_at TEXT NOT NULL,
  FOREIGN KEY (quest_selection_id) REFERENCES quest_selections(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS plan_records (
  id TEXT PRIMARY KEY,
  quest_selection_id TEXT NOT NULL UNIQUE,
  plan_steps TEXT NOT NULL,
  changes_requested TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  FOREIGN KEY (quest_selection_id) REFERENCES quest_selections(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS build_records (
  id TEXT PRIMARY KEY,
  quest_selection_id TEXT NOT NULL UNIQUE,
  current_state TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  result_summary TEXT,
  failure_reason TEXT,
  created_at TEXT NOT NULL,
  completed_at TEXT,
  FOREIGN KEY (quest_selection_id) REFERENCES quest_selections(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS learning_evidence (
  id TEXT PRIMARY KEY,
  child_profile_id TEXT NOT NULL,
  quest_selection_id TEXT NOT NULL,
  skill TEXT NOT NULL,
  evidence TEXT NOT NULL,
  created_at TEXT NOT NULL,
  FOREIGN KEY (child_profile_id) REFERENCES child_profiles(id) ON DELETE CASCADE,
  FOREIGN KEY (quest_selection_id) REFERENCES quest_selections(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS imagination_journal_entries (
  id TEXT PRIMARY KEY,
  child_profile_id TEXT NOT NULL,
  quest_selection_id TEXT NOT NULL,
  idea TEXT NOT NULL,
  why_interesting TEXT NOT NULL,
  what_learned TEXT NOT NULL,
  created_at TEXT NOT NULL,
  FOREIGN KEY (child_profile_id) REFERENCES child_profiles(id) ON DELETE CASCADE,
  FOREIGN KEY (quest_selection_id) REFERENCES quest_selections(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS achievements (
  id TEXT PRIMARY KEY,
  child_profile_id TEXT NOT NULL,
  slug TEXT NOT NULL,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  icon TEXT NOT NULL,
  unlocked_at TEXT NOT NULL,
  FOREIGN KEY (child_profile_id) REFERENCES child_profiles(id) ON DELETE CASCADE,
  UNIQUE (child_profile_id, slug)
);

CREATE TABLE IF NOT EXISTS learning_stages (
  id TEXT PRIMARY KEY,
  key TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  sort_order INTEGER NOT NULL UNIQUE,
  max_daily_quests INTEGER NOT NULL,
  allows_free_prompt INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS parent_policies (
  id TEXT PRIMARY KEY,
  parent_user_id TEXT NOT NULL,
  child_profile_id TEXT NOT NULL UNIQUE,
  current_stage_id TEXT NOT NULL,
  allowed_categories TEXT NOT NULL,
  daily_quest_limit INTEGER NOT NULL,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  FOREIGN KEY (parent_user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (child_profile_id) REFERENCES child_profiles(id) ON DELETE CASCADE,
  FOREIGN KEY (current_stage_id) REFERENCES learning_stages(id) ON DELETE CASCADE
);
`;
