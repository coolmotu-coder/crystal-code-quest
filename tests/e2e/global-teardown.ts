import fs from "node:fs";
import path from "node:path";

export interface E2eGlobalSetupResult {
  tempDir: string;
  databasePath: string;
}

async function globalTeardown(): Promise<void> {
  const statePath = path.resolve(process.cwd(), "tests", "e2e", ".e2e-state.json");

  if (!fs.existsSync(statePath)) {
    return;
  }

  const state = JSON.parse(fs.readFileSync(statePath, "utf-8")) as E2eGlobalSetupResult;

  const extensions = [".db", ".db-shm", ".db-wal"];
  for (const extension of extensions) {
    const filePath = path.join(state.tempDir, `test${extension}`);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  }

  fs.rmSync(state.tempDir, { recursive: true, force: true });
  fs.unlinkSync(statePath);
}

export default globalTeardown;
