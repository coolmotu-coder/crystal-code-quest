import fs from "node:fs";
import path from "node:path";
import { SCHEMA_SQL } from "@/lib/db/schema";

const schemaPath = path.resolve(process.cwd(), "scripts", "schema.sql");

const committed = fs.readFileSync(schemaPath, "utf-8");

if (committed !== SCHEMA_SQL) {
  console.error("Schema drift detected: scripts/schema.sql does not match lib/db/schema.ts");
  console.error("Run `pnpm exec tsx scripts/export-schema.ts` to regenerate scripts/schema.sql.");
  process.exit(1);
}

console.log("Schema is consistent: scripts/schema.sql matches lib/db/schema.ts");
