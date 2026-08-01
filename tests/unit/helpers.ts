import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { closeDatabase, getDatabase } from "@/lib/db";
import { runMigrations } from "@/lib/db/migrations";
import { SCHEMA_SQL } from "@/lib/db/schema";

export interface FreshDatabase {
  databasePath: string;
  tempDir: string;
}

export function createFreshDatabase(suffix: string): FreshDatabase {
  closeDatabase();

  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), `crystal-code-quest-test-${suffix}-`));
  const databasePath = path.join(tempDir, "test.db");

  process.env.DATABASE_PATH = databasePath;
  getDatabase();

  return { databasePath, tempDir };
}

export function cleanupFreshDatabase(tempDir: string): void {
  closeDatabase();

  const extensions = [".db", ".db-shm", ".db-wal"];
  for (const extension of extensions) {
    const filePath = path.join(tempDir, `test${extension}`);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  }

  fs.rmSync(tempDir, { recursive: true, force: true });
}

export function ensureExportedSchema(): string {
  const schemaPath = path.resolve(process.cwd(), "scripts", "schema.sql");

  if (!fs.existsSync(schemaPath)) {
    const dir = path.dirname(schemaPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(schemaPath, SCHEMA_SQL);
  }

  return schemaPath;
}

export function applyLocalMigrations(): void {
  runMigrations();
}

export async function applyContainerMigrations(): Promise<void> {
  const databasePath = process.env.DATABASE_PATH;
  if (!databasePath) {
    throw new Error("DATABASE_PATH must be set before running container migrations.");
  }

  // Ensure the generated SQL asset exists so the container startup path can read it.
  ensureExportedSchema();

  await import("@/scripts/migrate-startup.mjs");
}

export function getTableSchemaSummary(db: ReturnType<typeof getDatabase>): Array<{
  name: string;
  columns: number;
}> {
  const tables = db
    .prepare(
      "SELECT name FROM sqlite_master WHERE type = 'table' AND name NOT LIKE 'sqlite_%' ORDER BY name",
    )
    .all() as Array<{ name: string }>;

  return tables.map((table) => {
    const info = db.prepare(`PRAGMA table_info(${table.name})`).all() as Array<{
      name: string;
      type: string;
    }>;

    return {
      name: table.name,
      columns: info.length,
    };
  });
}

export function getStarterContent(db: ReturnType<typeof getDatabase>): {
  learningStage: unknown;
  questTemplate: unknown;
} {
  const learningStage = db
    .prepare("SELECT key, name FROM learning_stages WHERE key = 'select-options'")
    .get();
  const questTemplate = db
    .prepare("SELECT slug, name FROM quest_templates WHERE slug = 'super-jump-for-lucas'")
    .get();

  return { learningStage, questTemplate };
}
