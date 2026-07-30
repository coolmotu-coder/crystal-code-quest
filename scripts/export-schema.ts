import fs from "node:fs";
import path from "node:path";
import { SCHEMA_SQL } from "@/lib/db/schema";

const outPath = path.resolve(process.cwd(), "scripts", "schema.sql");

fs.writeFileSync(outPath, SCHEMA_SQL);

console.log(`Exported schema SQL to ${outPath}`);
