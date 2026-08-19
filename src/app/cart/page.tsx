"use client"

import { Suspense, useEffect, useRef } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { ArrowLeft, ShoppingBag } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { CartItemRow } from "@/components/cart-item-row"
import { CouponForm } from "@/components/coupon-form"
import { useCart } from "@/lib/cart-context"
import { useApplyCoupon } from "@/lib/use-apply-coupon"
import { formatVND } from "@/lib/format"
import { DELIVERY_FEE } from "@/lib/pricing"

/** Auto-applies ?coupon=CODE from the URL, e.g. /cart?coupon=WELCOME10 */
function CouponFromUrl({ subtotal }: { subtotal: number }) {
  const searchParams = useSearchParams()
  const router = useRouter()
  const { applyCoupon } = useApplyCoupon()
  const appliedRef = useRef(false)

  useEffect(() => {
    if (appliedRef.current) return
    const code = searchParams.get("coupon")
    if (!code) return
    appliedRef.current = true

    applyCoupon(code, subtotal).then((ok) => {
      if (ok) {
        toast.success(`Đã áp dụng mã ${code.toUpperCase()}`)
      } else {
        toast.error(`Không áp dụng được mã ${code.toUpperCase()}`)
      }
    })
    router.replace("/cart")
  }, [searchParams, subtotal, applyCoupon, router])

  return null
}

export default function CartPage() {
  const { items, coupon, hydrated, subtotal } = useCart()

  if (!hydrated) return null

  const discount = coupon?.discount ?? 0
  const total = Math.max(0, subtotal + DELIVERY_FEE - discount)

  return (
    <main className="mx-auto flex w-full max-w-md flex-1 flex-col">
      <Suspense fallback={null}>
        <CouponFromUrl subtotal={subtotal} />
      </Suspense>

      <header className="sticky top-0 z-30 flex items-center gap-3 bg-background/95 p-4 backdrop-blur">
        <Link href="/" aria-label="Quay lại" className="text-ink">
          <ArrowLeft className="size-5" />
        </Link>
        <h1 className="font-heading text-lg font-extrabold uppercase tracking-tight">
          Giỏ hàng
        </h1>
      </header>

      {items.length === 0 ? (
        <div className="flex flex-1 flex-col items-center justify-center gap-4 p-8 text-center">
          <ShoppingBag className="size-12 text-muted-foreground" />
          <p className="text-muted-foreground">Giỏ hàng của bạn đang trống</p>
          <Button
            className="rounded-full bg-brand font-bold text-white hover:bg-brand-dark"
            render={<Link href="/" />}
          >
            Đặt món ngay
          </Button>
        </div>
      ) : (
        <div className="flex flex-1 flex-col gap-4 p-4 pb-40">
          <div className="flex flex-col gap-3">
            {items.map((item) => (
              <CartItemRow key={item.id} item={item} />
            ))}
          </div>

          <CouponForm subtotal={subtotal} />

          <div className="flex flex-col gap-2 rounded-2xl bg-card p-4">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Tạm tính</span>
              <span>{formatVND(subtotal)}</span>
            </div>
            {discount > 0 && (
              <div className="flex justify-between text-sm text-success">
                <span>Giảm giá ({coupon?.code})</span>
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
        </div>
      )}

      {items.length > 0 && (
        <div className="fixed inset-x-0 bottom-0 z-40 mx-auto max-w-md p-4">
          <Button
            className="h-12 w-full rounded-full bg-brand text-base font-bold text-white shadow-lg shadow-black/20 hover:bg-brand-dark"
            render={<Link href="/checkout" />}
          >
            Thanh toán · {formatVND(total)}
          </Button>
        </div>
      )}
    </main>
  )
}
