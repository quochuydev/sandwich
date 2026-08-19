import { desc } from "drizzle-orm"
import { NextResponse } from "next/server"
import { db } from "@/db"
import { orders } from "@/db/schema"
import { isAdminAuthed } from "@/lib/admin-auth"

export async function GET() {
  if (!(await isAdminAuthed())) {
    return NextResponse.json({ error: "Chưa đăng nhập" }, { status: 401 })
  }

  const rows = await db.select().from(orders).orderBy(desc(orders.createdAt))
  return NextResponse.json({ orders: rows })
}
