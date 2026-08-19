import { desc } from "drizzle-orm"
import { db } from "@/db"
import { orders } from "@/db/schema"
import { isAdminAuthed } from "@/lib/admin-auth"
import { AdminLogin } from "@/components/admin-login"
import { AdminOrdersList } from "@/components/admin-orders-list"

export default async function AdminPage() {
  if (!(await isAdminAuthed())) {
    return <AdminLogin />
  }

  const rows = await db.select().from(orders).orderBy(desc(orders.createdAt))

  return (
    <AdminOrdersList
      initialOrders={rows.map((order) => ({
        ...order,
        createdAt: order.createdAt.toISOString(),
      }))}
    />
  )
}
