import { runMigrations, getAppliedMigrations } from "@/lib/db/migrations";

function main(): void {
  runMigrations();
  const applied = getAppliedMigrations();
  console.log(`Migrations applied: ${applied.length}`);
  for (const name of applied) {
    console.log(`  - ${name}`);
  }
}

main();
