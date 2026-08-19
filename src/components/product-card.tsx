"use client"

import Image from "next/image"
import { useState } from "react"
import { Minus, Plus } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { Textarea } from "@/components/ui/textarea"
import { formatVND } from "@/lib/format"
import { useCart } from "@/lib/cart-context"
import type { ProductRow } from "@/db/schema"

export function ProductCard({ product }: { product: ProductRow }) {
  const cart = useCart()
  const [open, setOpen] = useState(false)
  const [quantity, setQuantity] = useState(1)
  const [note, setNote] = useState("")

  function openSheet() {
    setQuantity(1)
    setNote("")
    setOpen(true)
  }

  function handleAdd() {
    cart.addItem({
      productId: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity,
      note,
    })
    toast.success(`Đã thêm ${product.name} vào giỏ hàng`)
    setOpen(false)
  }

  return (
    <>
      <div className="flex flex-col overflow-hidden rounded-2xl bg-card shadow-sm">
        <div className="relative aspect-[4/3] w-full">
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover"
            sizes="(min-width: 640px) 50vw, 100vw"
          />
        </div>
        <div className="flex flex-1 flex-col gap-1 p-3">
          <h3 className="font-heading text-sm font-extrabold uppercase tracking-tight">
            {product.name}
          </h3>
          <p className="line-clamp-2 flex-1 text-xs text-muted-foreground">
            {product.description}
          </p>
          <div className="mt-2 flex items-center justify-between">
            <span className="text-base font-extrabold text-brand">
              {formatVND(product.price)}
            </span>
            <Button
              size="sm"
              className="rounded-full bg-brand font-bold text-white hover:bg-brand-dark"
              onClick={openSheet}
            >
              Thêm
            </Button>
          </div>
        </div>
      </div>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="bottom" className="rounded-t-3xl">
          <SheetHeader>
            <SheetTitle className="font-heading uppercase tracking-tight">
              {product.name}
            </SheetTitle>
          </SheetHeader>

          <div className="flex flex-col gap-4 px-4">
            <div className="flex gap-3">
              <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-cover"
                  sizes="80px"
                />
              </div>
              <div className="flex flex-col justify-center gap-1">
                <p className="text-sm text-muted-foreground">
                  {product.description}
                </p>
                <span className="font-extrabold text-brand">
                  {formatVND(product.price)}
                </span>
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold">
                Ghi chú (ví dụ: không hành, ít cay...)
              </label>
              <Textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Không bắt buộc"
                className="rounded-xl"
              />
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold">Số lượng</span>
              <div className="flex items-center gap-3">
                <Button
                  type="button"
                  size="icon"
                  variant="outline"
                  className="size-9 rounded-full"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  aria-label="Giảm số lượng"
                >
                  <Minus className="size-4" />
                </Button>
                <span className="w-6 text-center font-bold">{quantity}</span>
                <Button
                  type="button"
                  size="icon"
                  variant="outline"
                  className="size-9 rounded-full"
                  onClick={() => setQuantity((q) => q + 1)}
                  aria-label="Tăng số lượng"
                >
                  <Plus className="size-4" />
                </Button>
              </div>
            </div>
          </div>

          <SheetFooter>
            <Button
              className="h-12 rounded-full bg-brand text-base font-bold text-white hover:bg-brand-dark"
              onClick={handleAdd}
            >
              Thêm vào giỏ · {formatVND(product.price * quantity)}
            </Button>
            <SheetClose
              render={<Button variant="ghost" className="rounded-full" />}
            >
              Huỷ
            </SheetClose>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </>
  )
}
