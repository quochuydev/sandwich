import { NextResponse } from "next/server"
import { z } from "zod"
import { DELIVERY_FEE } from "@/config"
import { computeDiscount, computeTotal, findCoupon } from "@/lib/pricing"

const bodySchema = z.object({
  code: z.string().min(1),
  subtotal: z.number().int().nonnegative(),
})

export async function POST(request: Request) {
  const parsed = bodySchema.safeParse(await request.json())
  if (!parsed.success) {
    return NextResponse.json({ error: "Yêu cầu không hợp lệ" }, { status: 400 })
  }

  const { code, subtotal } = parsed.data
  const coupon = findCoupon(code)

  if (!coupon) {
    return NextResponse.json(
      { error: "Mã giảm giá không tồn tại" },
      { status: 400 }
    )
  }

  const discount = computeDiscount(coupon, subtotal)
  if (discount === 0) {
    return NextResponse.json(
      {
        error: coupon.minSubtotal
          ? `Đơn tối thiểu ${coupon.minSubtotal.toLocaleString("vi-VN")}₫ để dùng mã này`
          : "Mã giảm giá không áp dụng cho đơn này",
      },
      { status: 400 }
    )
  }

  return NextResponse.json({
    coupon: { code: coupon.code, label: coupon.label },
    discount,
    deliveryFee: DELIVERY_FEE,
    total: computeTotal(subtotal, discount),
  })
}
