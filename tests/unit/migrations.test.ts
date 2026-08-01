// @vitest-environment node

import { beforeEach, describe, expect, it } from "vitest";
import fs from "node:fs";
import path from "node:path";
import { closeDatabase, getDatabase } from "@/lib/db";
import { SCHEMA_SQL } from "@/lib/db/schema";
import {
  applyContainerMigrations,
  applyLocalMigrations,
  createFreshDatabase,
  ensureExportedSchema,
  getStarterContent,
  getTableSchemaSummary,
} from "./helpers";

describe("migrations", () => {
  beforeEach(() => {
    createFreshDatabase("migrations");
  });

  it("exported schema SQL matches the TypeScript source of truth", () => {
    ensureExportedSchema();
    const exportedSchema = fs.readFileSync(
      path.resolve(process.cwd(), "scripts", "schema.sql"),
      "utf-8",
    );
    expect(exportedSchema).toBe(SCHEMA_SQL);
  });

  it("local and container-startup migrations produce equivalent starter schema", async () => {
    // Local migration path.
    applyLocalMigrations();
    const localDb = getDatabase();
    const localSchema = getTableSchemaSummary(localDb);
    const localStarter = getStarterContent(localDb);

    // Switch to a fresh database for the container migration path.
    closeDatabase();
    createFreshDatabase("container-migrations");
    await applyContainerMigrations();
    const containerDb = getDatabase();
    const containerSchema = getTableSchemaSummary(containerDb);
    const containerStarter = getStarterContent(containerDb);

    expect(containerSchema).toEqual(localSchema);
    expect(containerStarter).toEqual(localStarter);
    expect(containerStarter.learningStage).toBeTruthy();
    expect(containerStarter.questTemplate).toBeTruthy();
  });
});
