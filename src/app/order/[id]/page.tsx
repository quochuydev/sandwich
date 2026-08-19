import Link from "next/link"
import { eq } from "drizzle-orm"
import { notFound } from "next/navigation"
import { CheckCircle2 } from "lucide-react"
import { db } from "@/db"
import { orderItems, orders } from "@/db/schema"
import { Button } from "@/components/ui/button"
import { CopyLinkButton } from "@/components/copy-link-button"
import { formatVND } from "@/lib/format"
import { PAYMENT_LABEL, STATUS_LABEL } from "@/lib/order-status"

export default async function OrderConfirmationPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  const order = await db.query.orders.findFirst({
    where: eq(orders.id, id),
  })

  if (!order) notFound()

  const items = await db
    .select()
    .from(orderItems)
    .where(eq(orderItems.orderId, id))

  return (
    <main className="mx-auto flex w-full max-w-md flex-1 flex-col gap-4 p-4">
      <div className="flex flex-col items-center gap-2 py-6 text-center">
        <CheckCircle2 className="size-14 text-success" />
        <h1 className="font-heading text-xl font-extrabold uppercase tracking-tight">
          Đặt hàng thành công!
        </h1>
        <p className="text-sm text-muted-foreground">
          Mã đơn hàng <span className="font-bold text-ink">{order.orderNumber}</span>
        </p>
        <CopyLinkButton />
      </div>

      <div className="flex flex-col gap-3 rounded-2xl bg-card p-4">
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Trạng thái</span>
          <span className="rounded-full bg-accent px-3 py-1 text-xs font-bold">
            {STATUS_LABEL[order.status] ?? order.status}
          </span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Thanh toán</span>
          <span className="font-semibold">
            {PAYMENT_LABEL[order.paymentMethod] ?? order.paymentMethod}
            {order.paymentStatus === "paid" ? " · Đã thanh toán" : ""}
          </span>
        </div>
      </div>

      <div className="flex flex-col gap-3 rounded-2xl bg-card p-4">
        <h2 className="font-heading text-sm font-extrabold uppercase tracking-tight">
          Món đã đặt
        </h2>
        {items.map((item) => (
          <div key={item.id} className="flex flex-col">
            <div className="flex justify-between text-sm font-semibold">
              <span>
                {item.quantity}× {item.name}
              </span>
              <span>{formatVND(item.price * item.quantity)}</span>
            </div>
            {item.note && (
              <span className="text-xs text-muted-foreground">{item.note}</span>
            )}
          </div>
        ))}

        <div className="mt-1 flex flex-col gap-1 border-t border-border pt-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Tạm tính</span>
            <span>{formatVND(order.subtotal)}</span>
          </div>
          {order.discount > 0 && (
            <div className="flex justify-between text-success">
              <span>Giảm giá ({order.couponCode})</span>
              <span>-{formatVND(order.discount)}</span>
            </div>
          )}
          <div className="flex justify-between">
            <span className="text-muted-foreground">Phí giao hàng</span>
            <span>{formatVND(order.deliveryFee)}</span>
          </div>
          <div className="flex justify-between text-base font-extrabold">
            <span>Tổng cộng</span>
            <span className="text-brand">{formatVND(order.total)}</span>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-3 rounded-2xl bg-card p-4 text-sm">
        <h2 className="font-heading text-sm font-extrabold uppercase tracking-tight">
          Thông tin giao hàng
        </h2>
        <p>
          <span className="text-muted-foreground">Người nhận: </span>
          {order.customerName} · {order.phone}
        </p>
        <p>
          <span className="text-muted-foreground">Địa chỉ: </span>
          {order.address}
        </p>
        {order.note && (
          <p>
            <span className="text-muted-foreground">Ghi chú: </span>
            {order.note}
          </p>
        )}
      </div>

      <Button
        className="h-12 w-full rounded-full bg-brand text-base font-bold text-white hover:bg-brand-dark"
        render={<Link href="/" />}
      >
        Về trang chủ
      </Button>
    </main>
  )
}
