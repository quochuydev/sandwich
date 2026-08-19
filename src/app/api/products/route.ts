import { eq } from "drizzle-orm"
import { NextResponse } from "next/server"
import { db } from "@/db"
import { products } from "@/db/schema"

export async function GET() {
  const rows = await db
    .select()
    .from(products)
    .where(eq(products.active, true))

  return NextResponse.json({ products: rows })
}
