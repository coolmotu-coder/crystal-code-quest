import fs from "node:fs";
import path from "node:path";
import bcrypt from "bcryptjs";
import { closeDatabase, getDatabase } from "@/lib/db";
import { seedAll, seedUsersAndProfiles } from "@/scripts/seed";

async function globalSetup() {
  const databasePath = path.resolve(process.cwd(), "tests", "e2e", "test.db");
  const dir = path.dirname(databasePath);

  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  if (fs.existsSync(databasePath)) {
    fs.unlinkSync(databasePath);
  }

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
