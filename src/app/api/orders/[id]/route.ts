import { eq } from "drizzle-orm"
import { NextResponse } from "next/server"
import { db } from "@/db"
import { orderItems, orders } from "@/db/schema"

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  const order = await db.query.orders.findFirst({
    where: eq(orders.id, id),
  })

  if (!order) {
    return NextResponse.json({ error: "Không tìm thấy đơn hàng" }, { status: 404 })
  }

  const items = await db
    .select()
    .from(orderItems)
    .where(eq(orderItems.orderId, id))

  return NextResponse.json({ order, items })
}
