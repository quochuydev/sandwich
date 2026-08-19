"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { formatVND } from "@/lib/format"
import { ORDER_STATUSES, PAYMENT_LABEL, STATUS_LABEL } from "@/lib/order-status"

export type AdminOrder = {
  id: string
  orderNumber: string
  customerName: string
  phone: string
  address: string
  total: number
  paymentMethod: string
  paymentStatus: string
  status: string
  createdAt: string
}

export function AdminOrdersList({
  initialOrders,
}: {
  initialOrders: AdminOrder[]
}) {
  const router = useRouter()
  const [orders, setOrders] = useState(initialOrders)
  const [refreshing, setRefreshing] = useState(false)
  const [updatingId, setUpdatingId] = useState<string | null>(null)

  async function refresh() {
    setRefreshing(true)
    try {
      const res = await fetch("/api/admin/orders")
      const data = await res.json()
      if (res.ok) setOrders(data.orders)
    } finally {
      setRefreshing(false)
    }
  }

  async function updateStatus(id: string, status: string) {
    const previous = orders
    setUpdatingId(id)
    setOrders((current) =>
      current.map((o) => (o.id === id ? { ...o, status } : o))
    )
    try {
      const res = await fetch(`/api/admin/orders/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      })
      if (!res.ok) {
        setOrders(previous)
        toast.error("Cập nhật trạng thái thất bại")
        return
      }
      toast.success("Đã cập nhật trạng thái")
    } catch {
      setOrders(previous)
      toast.error("Có lỗi xảy ra, vui lòng thử lại")
    } finally {
      setUpdatingId(null)
    }
  }

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" })
    router.refresh()
  }

  return (
    <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-4 p-4">
      <header className="flex items-center justify-between">
        <h1 className="font-heading text-lg font-extrabold uppercase tracking-tight">
          Đơn hàng ({orders.length})
        </h1>
        <div className="flex gap-2">
          <Button
            type="button"
            variant="outline"
            className="rounded-full"
            disabled={refreshing}
            onClick={refresh}
          >
            {refreshing ? "Đang tải..." : "Làm mới"}
          </Button>
          <Button
            type="button"
            variant="ghost"
            className="rounded-full"
            onClick={logout}
          >
            Đăng xuất
          </Button>
        </div>
      </header>

      {orders.length === 0 ? (
        <p className="text-center text-sm text-muted-foreground">
          Chưa có đơn hàng nào
        </p>
      ) : (
        <div className="flex flex-col gap-3">
          {orders.map((order) => (
            <div key={order.id} className="flex flex-col gap-2 rounded-2xl bg-card p-4">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="font-heading text-sm font-extrabold uppercase tracking-tight">
                    {order.orderNumber}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(order.createdAt).toLocaleString("vi-VN")}
                  </p>
                </div>
                <Link
                  href={`/order/${order.id}`}
                  className="text-xs font-semibold text-brand underline-offset-2 hover:underline"
                >
                  Chi tiết
                </Link>
              </div>

              <p className="text-sm">
                <span className="font-semibold">{order.customerName}</span> ·{" "}
                {order.phone}
              </p>
              <p className="text-xs text-muted-foreground">{order.address}</p>

              <div className="flex items-center justify-between gap-2">
                <span className="font-extrabold text-brand">
                  {formatVND(order.total)}
                </span>
                <span className="text-xs text-muted-foreground">
                  {PAYMENT_LABEL[order.paymentMethod] ?? order.paymentMethod}
                  {order.paymentStatus === "paid" ? " · Đã thanh toán" : ""}
                </span>
              </div>

              <select
                value={order.status}
                disabled={updatingId === order.id}
                onChange={(e) => updateStatus(order.id, e.target.value)}
                className="h-9 rounded-lg border border-border bg-background px-2 text-sm font-semibold disabled:opacity-50"
              >
                {ORDER_STATUSES.map((status) => (
                  <option key={status} value={status}>
                    {STATUS_LABEL[status]}
                  </option>
                ))}
              </select>
            </div>
          ))}
        </div>
      )}
    </main>
  )
}
