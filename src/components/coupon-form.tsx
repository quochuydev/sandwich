"use client"

import { useState } from "react"
import { Tag, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { useCart } from "@/lib/cart-context"
import { useApplyCoupon } from "@/lib/use-apply-coupon"
import { formatVND } from "@/lib/format"

export function CouponForm({ subtotal }: { subtotal: number }) {
  const { coupon, setCoupon } = useCart()
  const { applyCoupon, loading, error } = useApplyCoupon()
  const [code, setCode] = useState("")

  async function apply() {
    const ok = await applyCoupon(code, subtotal)
    if (ok) setCode("")
  }

  if (coupon) {
    return (
      <div className="flex items-center justify-between rounded-xl bg-accent px-3 py-2">
        <Badge className="rounded-full bg-gold font-bold text-ink hover:bg-gold">
          <Tag className="size-3.5" />
          {coupon.code}
        </Badge>
        <span className="text-sm font-semibold text-success">
          -{formatVND(coupon.discount)}
        </span>
        <button
          type="button"
          onClick={() => setCoupon(null)}
          aria-label="Bỏ mã giảm giá"
          className="text-muted-foreground"
        >
          <X className="size-4" />
        </button>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex gap-2">
        <Input
          value={code}
          onChange={(e) => setCode(e.target.value.toUpperCase())}
          placeholder="Nhập mã giảm giá"
          className="rounded-xl"
        />
        <Button
          type="button"
          variant="outline"
          className="shrink-0 rounded-xl font-bold"
          disabled={loading || !code.trim()}
          onClick={apply}
        >
          Áp dụng
        </Button>
      </div>
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  )
}
