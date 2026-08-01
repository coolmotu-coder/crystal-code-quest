import bcrypt from "bcryptjs";
import { closeDatabase, getDatabase } from "@/lib/db";
import { deleteAllData } from "@/lib/db/queries";
import { seedAll, seedUsersAndProfiles } from "@/scripts/seed";
import { testChild, testParent } from "./fixtures";

export async function resetDatabase(): Promise<void> {
  closeDatabase();
  getDatabase();
  deleteAllData();
  seedAll();

  const parentHash = await bcrypt.hash(testParent.password, 12);
  const childHash = await bcrypt.hash(testChild.pin, 12);

  seedUsersAndProfiles(testParent.email, parentHash, testChild.username, childHash);

  closeDatabase();
}
