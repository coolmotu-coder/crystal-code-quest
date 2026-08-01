import Database from "better-sqlite3";
import fs from "node:fs";
import path from "node:path";

const DATABASE_PATH = process.env.DATABASE_PATH ?? "/data/crystal-code-quest.db";
const SCHEMA_PATH = path.resolve(process.cwd(), "scripts", "schema.sql");

function main() {
  const dir = path.dirname(DATABASE_PATH);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  const db = new Database(DATABASE_PATH);
  db.pragma("journal_mode = WAL");
  db.pragma("foreign_keys = ON");

  db.exec(`
    CREATE TABLE IF NOT EXISTS migrations (
      name TEXT PRIMARY KEY,
      applied_at TEXT NOT NULL
    );
  `);

  const alreadyApplied = db
    .prepare("SELECT 1 FROM migrations WHERE name = ?")
    .get("001_initial_schema");

  if (alreadyApplied) {
    console.log("Migrations already applied.");
    db.close();
    return;
  }

  const schemaSql = fs.readFileSync(SCHEMA_PATH, "utf-8");

  const apply = db.transaction(() => {
    db.exec(schemaSql);
    db.prepare("INSERT INTO migrations (name, applied_at) VALUES (?, ?)").run(
      "001_initial_schema",
      new Date().toISOString(),
    );
  });

  apply();

  applyStarterContent(db);

  console.log("Migrations applied.");
  db.close();
}

const STARTER_LEARNING_STAGE_ID = "00000000-0000-0000-0000-000000000010";
const STARTER_QUEST_TEMPLATE_ID = "00000000-0000-0000-0000-000000000020";

function applyStarterContent(db) {
  const alreadyApplied = db
    .prepare("SELECT 1 FROM migrations WHERE name = ?")
    .get("002_seed_starter_content");

  if (alreadyApplied) {
    console.log("Starter content already applied.");
    return;
  }

  const optionsSchema = JSON.stringify({
    category: ["Power"],
    character: ["Lucas"],
    power: ["Super Jump"],
    trigger: ["Correct Answer"],
    subject: ["Maths"],
    difficulty: ["Hard"],
    usage: ["One obstacle"],
  });

  const apply = db.transaction(() => {
    db.exec(`
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
        '${optionsSchema}',
        datetime('now')
      );
    `);

    db.prepare("INSERT INTO migrations (name, applied_at) VALUES (?, ?)").run(
      "002_seed_starter_content",
      new Date().toISOString(),
    );
  });

  apply();
  console.log("Starter content applied.");
}

main();
