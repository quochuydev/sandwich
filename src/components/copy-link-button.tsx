"use client"

import { useState } from "react"
import { Check, Link2 } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"

export function CopyLinkButton() {
  const [copied, setCopied] = useState(false)

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(window.location.href)
      setCopied(true)
      toast.success("Đã sao chép liên kết đơn hàng")
      setTimeout(() => setCopied(false), 2000)
    } catch {
      toast.error("Không thể sao chép, vui lòng thử lại")
    }
  }

  return (
    <Button
      type="button"
      variant="outline"
      className="rounded-full font-bold"
      onClick={handleCopy}
    >
      {copied ? <Check className="size-4" /> : <Link2 className="size-4" />}
      Sao chép liên kết
    </Button>
  )
}
