import { eq, inArray } from "drizzle-orm"
import { NextResponse } from "next/server"
import { z } from "zod"
import { SITE } from "@/config"
import { PAYMENTS } from "@/config.server"
import { db } from "@/db"
import { orderItems, orders, products } from "@/db/schema"
import { generateOrderNumber } from "@/lib/order-number"
import { computeDiscount, computeTotal, DELIVERY_FEE, findCoupon } from "@/lib/pricing"
import { stripe } from "@/lib/stripe"

const bodySchema = z.object({
  customerName: z.string().trim().min(1, "Vui lòng nhập tên"),
  phone: z.string().trim().min(8, "Số điện thoại không hợp lệ"),
  address: z.string().trim().min(1, "Vui lòng nhập địa chỉ"),
  note: z.string().trim().optional(),
  paymentMethod: z.enum(["cod", "stripe"]),
  couponCode: z.string().trim().optional(),
  items: z
    .array(
      z.object({
        productId: z.string(),
        quantity: z.number().int().positive(),
        note: z.string().trim().optional(),
      })
    )
    .min(1, "Giỏ hàng đang trống"),
})

export async function POST(request: Request) {
  const parsed = bodySchema.safeParse(await request.json())
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Yêu cầu không hợp lệ" },
      { status: 400 }
    )
  }

  const input = parsed.data

  if (!PAYMENTS[input.paymentMethod].enabled) {
    return NextResponse.json(
      { error: "Phương thức thanh toán không khả dụng" },
      { status: 400 }
    )
  }

  const productIds = input.items.map((item) => item.productId)
  const productRows = await db
    .select()
    .from(products)
    .where(inArray(products.id, productIds))

  const productMap = new Map(productRows.map((p) => [p.id, p]))

  const missingProduct = input.items.find((item) => {
    const product = productMap.get(item.productId)
    return !product || !product.active
  })
  if (missingProduct) {
    return NextResponse.json(
      { error: "Một số sản phẩm trong giỏ hàng không còn tồn tại" },
      { status: 400 }
    )
  }

  const lineItems = input.items.map((item) => {
    const product = productMap.get(item.productId)!
    return {
      productId: product.id,
      name: product.name,
      price: product.price,
      quantity: item.quantity,
      note: item.note ?? "",
    }
  })

  const subtotal = lineItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  )

  let discount = 0
  let couponCode: string | null = null
  if (input.couponCode) {
    const coupon = findCoupon(input.couponCode)
    if (!coupon) {
      return NextResponse.json(
        { error: "Mã giảm giá không hợp lệ" },
        { status: 400 }
      )
    }
    discount = computeDiscount(coupon, subtotal)
    couponCode = coupon.code
  }

  const total = computeTotal(subtotal, discount)
  const orderId = crypto.randomUUID()
  const orderNumber = generateOrderNumber()

  await db.insert(orders).values({
    id: orderId,
    orderNumber,
    customerName: input.customerName,
    phone: input.phone,
    address: input.address,
    note: input.note || null,
    subtotal,
    discount,
    couponCode,
    deliveryFee: DELIVERY_FEE,
    total,
    paymentMethod: input.paymentMethod,
    paymentStatus: "unpaid",
    status: "pending",
  })

  await db.insert(orderItems).values(
    lineItems.map((item) => ({
      orderId,
      productId: item.productId,
      name: item.name,
      price: item.price,
      quantity: item.quantity,
      note: item.note || null,
    }))
  )

  if (input.paymentMethod === "stripe" && stripe) {
    const discountCoupon =
      discount > 0
        ? await stripe.coupons.create({
            amount_off: discount,
            currency: "vnd",
            duration: "once",
          })
        : null

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items: [
        ...lineItems.map((item) => ({
          price_data: {
            currency: "vnd",
            product_data: { name: item.name },
            unit_amount: item.price,
          },
          quantity: item.quantity,
        })),
        {
          price_data: {
            currency: "vnd",
            product_data: { name: "Phí giao hàng" },
            unit_amount: DELIVERY_FEE,
          },
          quantity: 1,
        },
      ],
      discounts: discountCoupon ? [{ coupon: discountCoupon.id }] : undefined,
      success_url: `${SITE.baseUrl}/order/${orderId}`,
      cancel_url: `${SITE.baseUrl}/checkout`,
      metadata: { orderId },
    })

    await db
      .update(orders)
      .set({ stripeSessionId: session.id })
      .where(eq(orders.id, orderId))

    return NextResponse.json({ orderId, url: session.url })
  }

  return NextResponse.json({ orderId })
}
