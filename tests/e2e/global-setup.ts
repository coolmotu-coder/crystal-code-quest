import fs from "node:fs";
import path from "node:path";
import bcrypt from "bcryptjs";
import { closeDatabase, getDatabase } from "@/lib/db";
import { seedAll, seedUsersAndProfiles } from "@/scripts/seed";
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
    "DATABASE_PATH must be set or tests/e2e/.e2e-state.json must exist before global e2e setup.",
  );
}

async function globalSetup() {
  const databasePath = resolveE2eDatabasePath();

  process.env.DATABASE_PATH = databasePath;

  closeDatabase();
  getDatabase();

  seedAll();

  const parentHash = await bcrypt.hash("ParentPass123!", 12);
  const childHash = await bcrypt.hash("123456", 12);

  seedUsersAndProfiles("parent@example.com", parentHash, "linus", childHash);

  closeDatabase();
}

export default globalSetup;
