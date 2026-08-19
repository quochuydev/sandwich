import { COUPONS, DELIVERY_FEE, type Coupon } from "@/config"

export function findCoupon(code: string): Coupon | undefined {
  const normalized = code.trim().toUpperCase()
  return COUPONS.find((c) => c.code === normalized)
}

/** Returns the discount amount in VND, or 0 if the coupon doesn't apply. */
export function computeDiscount(coupon: Coupon, subtotal: number): number {
  if (coupon.minSubtotal && subtotal < coupon.minSubtotal) return 0
  if (coupon.type === "percent") {
    return Math.round((subtotal * coupon.value) / 100)
  }
  return Math.min(coupon.value, subtotal + DELIVERY_FEE)
}

export function computeTotal(subtotal: number, discount: number) {
  return Math.max(0, subtotal + DELIVERY_FEE - discount)
}

export { DELIVERY_FEE }
