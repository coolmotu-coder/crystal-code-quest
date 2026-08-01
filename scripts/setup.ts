import "dotenv/config";
import fs from "node:fs";
import path from "node:path";
import readline from "node:readline";
import crypto from "node:crypto";
import bcrypt from "bcryptjs";
import { closeDatabase, getDatabase, resolveDatabasePath } from "@/lib/db";
import { deleteAllData } from "@/lib/db/queries";
import { seedAll, seedDemoHistory, seedUsersAndProfiles } from "@/scripts/seed";

const ENV_PATH = path.resolve(process.cwd(), ".env.local");
const RESET_FLAG = process.argv.includes("--reset");

function prompt(question: string): Promise<string> {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      rl.close();
      resolve(answer.trim());
    });
  });
}

function promptHidden(question: string): Promise<string> {
  return new Promise((resolve) => {
    process.stdout.write(question);

    const stdin = process.stdin;
    const originalRawMode = stdin.isRaw;
    stdin.setRawMode(true);
    stdin.resume();
    stdin.setEncoding("utf8");

    let value = "";
    const onData = (char: string) => {
      switch (char) {
        case "\n":
        case "\r":
        case "\u0004":
          stdin.setRawMode(originalRawMode ?? false);
          stdin.pause();
          stdin.removeListener("data", onData);
          process.stdout.write("\n");
          resolve(value.trim());
          break;
        case "\u0003":
          process.exit(1);
          break;
        case "\b":
        case "\x7f":
          if (value.length > 0) {
            value = value.slice(0, -1);
            process.stdout.write("\b \b");
          }
          break;
        default:
          value += char;
          process.stdout.write("*");
          break;
      }
    };

    stdin.on("data", onData);
  });
}

async function setup(): Promise<void> {
  if (RESET_FLAG) {
    console.log("Resetting database...");
    getDatabase();
    deleteAllData();
    closeDatabase();
    const databasePath = resolveDatabasePath();
    if (fs.existsSync(databasePath)) {
      fs.unlinkSync(databasePath);
    }
    console.log("Database reset.\n");
  }

  const sessionSecret = crypto.randomBytes(32).toString("hex");
  const databasePath = resolveDatabasePath();
  const envContent = `SESSION_SECRET=${sessionSecret}\nDATABASE_PATH=${databasePath}\n`;
  fs.writeFileSync(ENV_PATH, envContent);
  console.log("Generated .env.local with session secret.\n");

  const parentEmail = await prompt("Parent email: ");
  if (!parentEmail.includes("@")) {
    throw new Error("Invalid parent email.");
  }

  const parentPassword = await promptHidden("Parent password (hidden): ");
  if (parentPassword.length < 8) {
    throw new Error("Parent password must be at least 8 characters.");
  }

  const childUsername = await prompt("Child username: ");
  if (childUsername.length < 1) {
    throw new Error("Child username is required.");
  }

  const childPin = await promptHidden("Child PIN (at least 6 digits, hidden): ");
  if (!/^\d{6,}$/.test(childPin)) {
    throw new Error("Child PIN must be at least 6 digits.");
  }

  console.log("\nHashing credentials...");
  const parentHash = await bcrypt.hash(parentPassword, 12);
  const childHash = await bcrypt.hash(childPin, 12);

  seedAll();
  seedUsersAndProfiles(parentEmail, parentHash, childUsername, childHash);
  seedDemoHistory();

  console.log("\nSetup complete.");
  console.log(`  Parent account: ${parentEmail}`);
  console.log(`  Child account: ${childUsername}`);
  console.log("  Credentials are stored as hashes only.");
  console.log("  They are not saved in .env.local or committed.");
}

setup()
  .then(() => {
    closeDatabase();
    process.exit(0);
  })
  .catch((error) => {
    console.error("Setup failed:", error instanceof Error ? error.message : String(error));
    closeDatabase();
    process.exit(1);
  });
