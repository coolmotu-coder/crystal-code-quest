import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  serverExternalPackages: ["better-sqlite3"],
  experimental: {
    // Next.js 15: keep native SQLite module out of the client bundle.
  },
  env: {
    DATABASE_PATH: process.env.DATABASE_PATH ?? "./data/crystal-code-quest.db",
  },
};

export default nextConfig;
