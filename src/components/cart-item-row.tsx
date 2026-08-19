"use client"

import Image from "next/image"
import { Minus, Plus, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { formatVND } from "@/lib/format"
import { useCart, type CartItem } from "@/lib/cart-context"

export function CartItemRow({ item }: { item: CartItem }) {
  const { setQuantity, setNote, removeItem } = useCart()

  return (
    <div className="flex gap-3 rounded-2xl bg-card p-3">
      <div className="relative size-20 shrink-0 overflow-hidden rounded-xl">
        <Image src={item.image} alt={item.name} fill className="object-cover" sizes="80px" />
      </div>

      <div className="flex flex-1 flex-col gap-1">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-heading text-sm font-extrabold uppercase tracking-tight">
            {item.name}
          </h3>
          <button
            type="button"
            onClick={() => removeItem(item.id)}
            aria-label="Xoá món"
            className="text-muted-foreground"
          >
            <Trash2 className="size-4" />
          </button>
        </div>

        <Input
          value={item.note}
          onChange={(e) => setNote(item.id, e.target.value)}
          placeholder="Ghi chú..."
          className="h-8 rounded-lg text-xs"
        />

        <div className="mt-1 flex items-center justify-between">
          <span className="font-extrabold text-brand">
            {formatVND(item.price * item.quantity)}
          </span>
          <div className="flex items-center gap-2">
            <Button
              type="button"
              size="icon"
              variant="outline"
              className="size-7 rounded-full"
              onClick={() => setQuantity(item.id, item.quantity - 1)}
              aria-label="Giảm số lượng"
            >
              <Minus className="size-3.5" />
            </Button>
            <span className="w-5 text-center text-sm font-bold">
              {item.quantity}
            </span>
            <Button
              type="button"
              size="icon"
              variant="outline"
              className="size-7 rounded-full"
              onClick={() => setQuantity(item.id, item.quantity + 1)}
              aria-label="Tăng số lượng"
            >
              <Plus className="size-3.5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
