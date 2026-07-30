import { NextResponse } from "next/server";
import { getDatabase } from "@/lib/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(): Promise<NextResponse> {
  try {
    const db = getDatabase();
    const version = db.prepare("SELECT sqlite_version() AS version").get() as {
      version: string;
    };

    return NextResponse.json({
      status: "ok",
      database: "connected",
      sqliteVersion: version.version,
    });
  } catch (error) {
    return NextResponse.json(
      {
        status: "error",
        database: "disconnected",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
