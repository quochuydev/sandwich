export const ORDER_STATUSES = [
  "pending",
  "confirmed",
  "delivering",
  "completed",
  "cancelled",
] as const

export type OrderStatus = (typeof ORDER_STATUSES)[number]

export const STATUS_LABEL: Record<string, string> = {
  pending: "Đang chờ xác nhận",
  confirmed: "Đã xác nhận",
  delivering: "Đang giao hàng",
  completed: "Hoàn thành",
  cancelled: "Đã huỷ",
}

export const PAYMENT_LABEL: Record<string, string> = {
  cod: "Thanh toán khi nhận hàng",
  stripe: "Thẻ / Ví (Stripe)",
}
