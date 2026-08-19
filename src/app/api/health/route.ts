import { sql } from "drizzle-orm"
import { NextResponse } from "next/server"
import { db } from "@/db"

export async function GET() {
  const startedAt = Date.now()
  try {
    await db.execute(sql`select 1`)
    return NextResponse.json({
      status: "ok",
      db: "connected",
      latencyMs: Date.now() - startedAt,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    return NextResponse.json(
      {
        status: "error",
        db: "disconnected",
        error: error instanceof Error ? error.message : "Unknown error",
        timestamp: new Date().toISOString(),
      },
      { status: 503 }
    )
  }
}
