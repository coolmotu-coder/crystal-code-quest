import fs from "node:fs";
import path from "node:path";
import bcrypt from "bcryptjs";
import crypto from "node:crypto";
import { closeDatabase, getDatabase } from "@/lib/db";
import { deleteAllData } from "@/lib/db/queries";
import { seedAll, seedUsersAndProfiles } from "@/scripts/seed";
import { testChild, testParent } from "./fixtures";
import type { E2eGlobalSetupResult } from "./global-teardown";
import { createChildProfile, createParentChildRelationship, createUser } from "@/lib/db/queries";

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
  const db = getDatabase();
  deleteAllData();
  seedAll();

  const parentHash = await bcrypt.hash(testParent.password, 12);
  const childHash = await bcrypt.hash(testChild.pin, 12);

  seedUsersAndProfiles(testParent.email, parentHash, testChild.username, childHash);

  db.pragma("wal_checkpoint(FULL)");
  closeDatabase();
}

export type CustomAccount = {
  parentEmail: string;
  parentPassword: string;
  childUsername: string;
  childPin: string;
  childDisplayName: string;
};

export type TwoChildAccount = {
  parentEmail: string;
  parentPassword: string;
  childA: { username: string; pin: string; displayName: string };
  childB: { username: string; pin: string; displayName: string };
};

export async function seedCustomParentAndChild(account: CustomAccount): Promise<void> {
  process.env.DATABASE_PATH = resolveE2eDatabasePath();

  closeDatabase();
  const db = getDatabase();
  deleteAllData();
  seedAll();

  const now = new Date().toISOString();
  const parentUserId = crypto.randomUUID();
  const childUserId = crypto.randomUUID();
  const childProfileId = crypto.randomUUID();
  const relationshipId = crypto.randomUUID();
  const parentHash = await bcrypt.hash(account.parentPassword, 12);
  const childHash = await bcrypt.hash(account.childPin, 12);

  const emailLocalPart = account.parentEmail.split("@")[0] ?? "Parent";
  const parentDisplayName = emailLocalPart.charAt(0).toUpperCase() + emailLocalPart.slice(1);

  createUser({
    id: parentUserId,
    email: account.parentEmail,
    role: "parent",
    password_hash: parentHash,
    name: parentDisplayName,
    created_at: now,
    updated_at: now,
  });

  createUser({
    id: childUserId,
    email: null,
    role: "child",
    password_hash: childHash,
    name: account.childUsername,
    created_at: now,
    updated_at: now,
  });

  createChildProfile({
    id: childProfileId,
    user_id: childUserId,
    display_name: account.childDisplayName,
    level: 1,
    xp: 0,
    streak_days: 0,
    current_stage_id: null,
    created_at: now,
    updated_at: now,
  });

  createParentChildRelationship({
    id: relationshipId,
    parent_user_id: parentUserId,
    child_user_id: childUserId,
    created_at: now,
  });

  db.pragma("wal_checkpoint(FULL)");
  closeDatabase();
}

export async function seedCustomParentWithTwoChildren(account: TwoChildAccount): Promise<void> {
  process.env.DATABASE_PATH = resolveE2eDatabasePath();

  closeDatabase();
  const db = getDatabase();
  deleteAllData();
  seedAll();

  const now = new Date().toISOString();
  const parentUserId = crypto.randomUUID();
  const parentHash = await bcrypt.hash(account.parentPassword, 12);

  const emailLocalPart = account.parentEmail.split("@")[0] ?? "Parent";
  const parentDisplayName = emailLocalPart.charAt(0).toUpperCase() + emailLocalPart.slice(1);

  createUser({
    id: parentUserId,
    email: account.parentEmail,
    role: "parent",
    password_hash: parentHash,
    name: parentDisplayName,
    created_at: now,
    updated_at: now,
  });

  for (const child of [account.childA, account.childB]) {
    const childUserId = crypto.randomUUID();
    const childProfileId = crypto.randomUUID();
    const relationshipId = crypto.randomUUID();
    const childHash = await bcrypt.hash(child.pin, 12);

    createUser({
      id: childUserId,
      email: null,
      role: "child",
      password_hash: childHash,
      name: child.username,
      created_at: now,
      updated_at: now,
    });

    createChildProfile({
      id: childProfileId,
      user_id: childUserId,
      display_name: child.displayName,
      level: 1,
      xp: 0,
      streak_days: 0,
      current_stage_id: null,
      created_at: now,
      updated_at: now,
    });

    createParentChildRelationship({
      id: relationshipId,
      parent_user_id: parentUserId,
      child_user_id: childUserId,
      created_at: now,
    });
  }

  db.pragma("wal_checkpoint(FULL)");
  closeDatabase();
}
