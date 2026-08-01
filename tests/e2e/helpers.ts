import fs from "node:fs";
import path from "node:path";
import bcrypt from "bcryptjs";
import { closeDatabase, getDatabase } from "@/lib/db";
import { deleteAllData } from "@/lib/db/queries";
import { seedAll, seedUsersAndProfiles } from "@/scripts/seed";
import { testChild, testParent } from "./fixtures";
import type { E2eGlobalSetupResult } from "./global-teardown";

function resolveE2eDatabasePath(): string {
  const configured = process.env.DATABASE_PATH;
  if (configured) {
    return configured;
  }

  const statePath = path.resolve(process.cwd(), "tests", "e2e", ".e2e-state.json");
  if (fs.existsSync(statePath)) {
    const state = JSON.parse(fs.readFileSync(statePath, "utf-8")) as E2eGlobalSetupResult;
    return state.databasePath;
  }

  throw new Error(
    "DATABASE_PATH must be set or tests/e2e/.e2e-state.json must exist before resetting the e2e database.",
  );
}

export async function resetDatabase(): Promise<void> {
  process.env.DATABASE_PATH = resolveE2eDatabasePath();

  closeDatabase();
  getDatabase();
  deleteAllData();
  seedAll();

  const parentHash = await bcrypt.hash(testParent.password, 12);
  const childHash = await bcrypt.hash(testChild.pin, 12);

  seedUsersAndProfiles(testParent.email, parentHash, testChild.username, childHash);

  closeDatabase();
}
