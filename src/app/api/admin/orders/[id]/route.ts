import { eq } from "drizzle-orm"
import { NextResponse } from "next/server"
import { z } from "zod"
import { db } from "@/db"
import { orders } from "@/db/schema"
import { isAdminAuthed } from "@/lib/admin-auth"

const bodySchema = z.object({
  status: z.enum(["pending", "confirmed", "delivering", "completed", "cancelled"]),
})

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await isAdminAuthed())) {
    return NextResponse.json({ error: "Chưa đăng nhập" }, { status: 401 })
  }

  const { id } = await params
  const parsed = bodySchema.safeParse(await request.json())
  if (!parsed.success) {
    return NextResponse.json({ error: "Trạng thái không hợp lệ" }, { status: 400 })
  }

  const [updated] = await db
    .update(orders)
    .set({ status: parsed.data.status })
    .where(eq(orders.id, id))
    .returning()

  if (!updated) {
    return NextResponse.json({ error: "Không tìm thấy đơn hàng" }, { status: 404 })
  }

  return NextResponse.json({ order: updated })
}
