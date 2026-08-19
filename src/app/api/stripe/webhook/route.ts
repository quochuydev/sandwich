import { eq } from "drizzle-orm"
import { NextResponse } from "next/server"
import { STRIPE } from "@/config"
import { db } from "@/db"
import { orders } from "@/db/schema"
import { stripe } from "@/lib/stripe"

export async function POST(request: Request) {
  if (!stripe || !STRIPE.webhookSecret) {
    return NextResponse.json({ error: "Stripe chưa được bật" }, { status: 404 })
  }

  const signature = request.headers.get("stripe-signature")
  const body = await request.text()

  if (!signature) {
    return NextResponse.json({ error: "Thiếu chữ ký" }, { status: 400 })
  }

  let event
  try {
    event = stripe.webhooks.constructEvent(body, signature, STRIPE.webhookSecret)
  } catch {
    return NextResponse.json({ error: "Chữ ký không hợp lệ" }, { status: 400 })
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object
    const orderId = session.metadata?.orderId
    if (orderId) {
      await db
        .update(orders)
        .set({ paymentStatus: "paid", status: "confirmed" })
        .where(eq(orders.id, orderId))
    }
  }

  return NextResponse.json({ received: true })
}
