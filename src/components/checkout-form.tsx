"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import { useEffect, useReducer, useRef, useState } from "react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  PaymentMethodPicker,
  type PaymentMethodOption,
} from "@/components/payment-method-picker"
import { useCart } from "@/lib/cart-context"
import {
  loadCustomerInfo,
  saveCustomerInfo,
  type CustomerInfo,
} from "@/lib/customer-info"
import { formatVND } from "@/lib/format"
import { DELIVERY_FEE } from "@/lib/pricing"

type CustomerAction =
  | { type: "hydrate"; info: CustomerInfo }
  | { type: "set"; field: keyof CustomerInfo; value: string }

function customerReducer(
  state: CustomerInfo,
  action: CustomerAction
): CustomerInfo {
  switch (action.type) {
    case "hydrate":
      return action.info
    case "set": {
      const next = { ...state, [action.field]: action.value }
      saveCustomerInfo(next)
      return next
    }
    default:
      return state
  }
}

export function CheckoutForm({ methods }: { methods: PaymentMethodOption[] }) {
  const router = useRouter()
  const cart = useCart()
  const [customer, dispatchCustomer] = useReducer(customerReducer, {
    customerName: "",
    phone: "",
    address: "",
  })
  const [note, setNote] = useState("")
  const [paymentMethod, setPaymentMethod] = useState(methods[0]?.id ?? "cod")
  const [submitting, setSubmitting] = useState(false)
  const orderPlacedRef = useRef(false)

  useEffect(() => {
    if (orderPlacedRef.current) return
    if (cart.hydrated && cart.items.length === 0) {
      router.replace("/cart")
    }
  }, [cart.hydrated, cart.items.length, router])

  useEffect(() => {
    const saved = loadCustomerInfo()
    if (!saved) return
    dispatchCustomer({ type: "hydrate", info: saved })
  }, [])

  const discount = cart.coupon?.discount ?? 0
  const total = Math.max(0, cart.subtotal + DELIVERY_FEE - discount)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (submitting) return
    setSubmitting(true)
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...customer,
          note,
          paymentMethod,
          couponCode: cart.coupon?.code,
          items: cart.items.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            note: item.note,
          })),
        }),
      })
      const data = await res.json()
      if (!res.ok) {
        toast.error(data.error ?? "Đặt hàng thất bại, vui lòng thử lại")
        return
      }
      orderPlacedRef.current = true
      cart.clear()
      if (data.url) {
        window.location.href = data.url
        return
      }
      router.push(`/order/${data.orderId}`)
    } catch {
      toast.error("Có lỗi xảy ra, vui lòng thử lại")
    } finally {
      setSubmitting(false)
    }
  }

  if (!cart.hydrated || cart.items.length === 0) return null

  return (
    <main className="mx-auto flex w-full max-w-md flex-1 flex-col">
      <header className="sticky top-0 z-30 flex items-center gap-3 bg-background/95 p-4 backdrop-blur">
        <Link href="/cart" aria-label="Quay lại" className="text-ink">
          <ArrowLeft className="size-5" />
        </Link>
        <h1 className="font-heading text-lg font-extrabold uppercase tracking-tight">
          Thông tin đặt hàng
        </h1>
      </header>

      <form onSubmit={handleSubmit} className="flex flex-1 flex-col gap-4 p-4 pb-28">
        <div className="flex flex-col gap-3 rounded-2xl bg-card p-4">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="customerName">Họ tên</Label>
            <Input
              id="customerName"
              required
              value={customer.customerName}
              onChange={(e) =>
                dispatchCustomer({
                  type: "set",
                  field: "customerName",
                  value: e.target.value,
                })
              }
              placeholder="Nguyễn Văn A"
              className="rounded-xl"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="phone">Số điện thoại</Label>
            <Input
              id="phone"
              required
              type="tel"
              value={customer.phone}
              onChange={(e) =>
                dispatchCustomer({
                  type: "set",
                  field: "phone",
                  value: e.target.value,
                })
              }
              placeholder="09xxxxxxxx"
              className="rounded-xl"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="address">Địa chỉ giao hàng</Label>
            <Input
              id="address"
              required
              value={customer.address}
              onChange={(e) =>
                dispatchCustomer({
                  type: "set",
                  field: "address",
                  value: e.target.value,
                })
              }
              placeholder="Số nhà, đường, phường/xã..."
              className="rounded-xl"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="note">Ghi chú cho đơn hàng</Label>
            <Textarea
              id="note"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Không bắt buộc"
              className="rounded-xl"
            />
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <span className="text-sm font-semibold">Phương thức thanh toán</span>
          <PaymentMethodPicker
            methods={methods}
            value={paymentMethod}
            onChange={setPaymentMethod}
          />
        </div>

        <div className="flex flex-col gap-2 rounded-2xl bg-card p-4">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Tạm tính</span>
            <span>{formatVND(cart.subtotal)}</span>
          </div>
          {discount > 0 && (
            <div className="flex justify-between text-sm text-success">
              <span>Giảm giá ({cart.coupon?.code})</span>
              <span>-{formatVND(discount)}</span>
            </div>
          )}
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Phí giao hàng</span>
            <span>{formatVND(DELIVERY_FEE)}</span>
          </div>
          <div className="mt-1 flex justify-between border-t border-border pt-2 text-base font-extrabold">
            <span>Tổng cộng</span>
            <span className="text-brand">{formatVND(total)}</span>
          </div>
        </div>

        <div className="fixed inset-x-0 bottom-0 z-40 mx-auto max-w-md p-4">
          <Button
            type="submit"
            disabled={submitting}
            className="h-12 w-full rounded-full bg-brand text-base font-bold text-white shadow-lg shadow-black/20 hover:bg-brand-dark"
          >
            {submitting ? "Đang xử lý..." : `Đặt hàng · ${formatVND(total)}`}
          </Button>
        </div>
      </form>
    </main>
  )
}
