"use client"

import { useState } from "react"
import { useCart } from "./cart-context"

export function useApplyCoupon() {
  const { setCoupon } = useCart()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function applyCoupon(code: string, subtotal: number) {
    if (!code.trim()) return false
    setLoading(true)
    setError(null)
    try {
      const res = await fetch("/api/coupons/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, subtotal }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error ?? "Không áp dụng được mã")
        return false
      }
      setCoupon({
        code: data.coupon.code,
        label: data.coupon.label,
        discount: data.discount,
      })
      return true
    } catch {
      setError("Có lỗi xảy ra, vui lòng thử lại")
      return false
    } finally {
      setLoading(false)
    }
  }

  return { applyCoupon, loading, error, setError }
}
