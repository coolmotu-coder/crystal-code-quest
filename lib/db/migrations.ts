import { getDatabase } from "./index";
import { SCHEMA_SQL } from "./schema";

type Migration = {
  name: string;
  sql: string;
};

export const migrations: Migration[] = [
  {
    name: "001_initial_schema",
    sql: SCHEMA_SQL,
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
