import Database from "better-sqlite3";
import fs from "node:fs";
import path from "node:path";

const DATABASE_PATH = process.env.DATABASE_PATH ?? "/data/crystal-code-quest.db";
const SCHEMA_PATH = path.resolve(process.cwd(), "schema.sql");

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

  console.log("Migrations applied.");
  db.close();
}

main();
