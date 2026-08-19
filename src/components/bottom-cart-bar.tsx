"use client"

import Link from "next/link"
import { ShoppingBag } from "lucide-react"
import { useCart } from "@/lib/cart-context"
import { formatVND } from "@/lib/format"

export function BottomCartBar() {
  const { hydrated, itemCount, subtotal } = useCart()

  if (!hydrated || itemCount === 0) return null

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 mx-auto max-w-md p-4">
      <Link
        href="/cart"
        className="flex items-center justify-between rounded-full bg-brand px-5 py-3.5 text-white shadow-lg shadow-black/20 active:scale-[0.99]"
      >
        <span className="flex items-center gap-2 font-bold">
          <span className="relative">
            <ShoppingBag className="size-5" />
            <span className="absolute -right-2 -top-2 flex size-4 items-center justify-center rounded-full bg-gold text-[10px] font-extrabold text-ink">
              {itemCount}
            </span>
          </span>
          Xem giỏ hàng
        </span>
        <span className="font-extrabold">{formatVND(subtotal)}</span>
      </Link>
    </div>
  )
}
