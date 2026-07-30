import Database from "better-sqlite3";
import fs from "node:fs";
import path from "node:path";

/**
 * Resolve the SQLite database path at runtime from the environment.
 * Falls back to a local `data/` directory under the current working directory.
 */
export function resolveDatabasePath(): string {
  const configured = process.env.DATABASE_PATH?.trim();
  if (configured && configured.length > 0) {
    return path.resolve(configured);
  }

  return path.resolve(process.cwd(), "data", "crystal-code-quest.db");
}

let db: Database.Database | null = null;

export function getDatabase(): Database.Database {
  if (db) return db;

  const databasePath = resolveDatabasePath();
  const dir = path.dirname(databasePath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  db = new Database(databasePath);
  db.pragma("journal_mode = WAL");
  db.pragma("foreign_keys = ON");

  return db;
}

export function closeDatabase(): void {
  if (db) {
    db.close();
    db = null;
  }
}
