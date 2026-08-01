import { getDatabase } from "./index";
import { SCHEMA_SQL } from "./schema";

type Migration = {
  name: string;
  sql: string;
};

const STARTER_LEARNING_STAGE_ID = "00000000-0000-0000-0000-000000000010";
const STARTER_QUEST_TEMPLATE_ID = "00000000-0000-0000-0000-000000000020";

export const migrations: Migration[] = [
  {
    name: "001_initial_schema",
    sql: SCHEMA_SQL,
  },
  {
    name: "002_seed_starter_content",
    sql: `
      INSERT OR IGNORE INTO learning_stages (
        id, key, name, description, sort_order, max_daily_quests, allows_free_prompt, created_at
      ) VALUES (
        '${STARTER_LEARNING_STAGE_ID}',
        'select-options',
        'Select Prompt Options',
        'Choose approved ideas and options to build a structured prompt.',
        1,
        3,
        0,
        datetime('now')
      );

      INSERT OR IGNORE INTO quest_templates (
        id, category, slug, name, description, icon, learning_stage_id, options_schema, created_at
      ) VALUES (
        '${STARTER_QUEST_TEMPLATE_ID}',
        'Power',
        'super-jump-for-lucas',
        'Super Jump for Lucas',
        'Give Lucas a Super Jump power when he answers a hard maths question correctly.',
        'Zap',
        '${STARTER_LEARNING_STAGE_ID}',
        '${JSON.stringify({
          category: ["Power"],
          character: ["Lucas"],
          power: ["Super Jump"],
          trigger: ["Correct Answer"],
          subject: ["Maths"],
          difficulty: ["Hard"],
          usage: ["One obstacle"],
        })}',
        datetime('now')
      );
    `,
  },
];

export function runMigrations(): void {
  const db = getDatabase();

  db.exec(`
    CREATE TABLE IF NOT EXISTS migrations (
      name TEXT PRIMARY KEY,
      applied_at TEXT NOT NULL
    );
  `);

  for (const migration of migrations) {
    const alreadyApplied = db
      .prepare("SELECT 1 FROM migrations WHERE name = ?")
      .get(migration.name);

    if (alreadyApplied) continue;

    const apply = db.transaction(() => {
      db.exec(migration.sql);
      db.prepare("INSERT INTO migrations (name, applied_at) VALUES (?, ?)").run(
        migration.name,
        new Date().toISOString(),
      );
    });

    apply();
  }
}

export function getAppliedMigrations(): string[] {
  const db = getDatabase();
  const rows = db.prepare("SELECT name FROM migrations ORDER BY applied_at").all() as Array<{
    name: string;
  }>;
  return rows.map((row) => row.name);
}
