"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function AdminLogin() {
  const router = useRouter()
  const [pin, setPin] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSubmitting(true)
    setError(null)
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pin }),
      })
      if (!res.ok) {
        const data = await res.json()
        setError(data.error ?? "Đăng nhập thất bại")
        return
      }
      router.refresh()
    } catch {
      setError("Có lỗi xảy ra, vui lòng thử lại")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <main className="mx-auto flex w-full max-w-md flex-1 flex-col items-center justify-center p-4">
      <form
        onSubmit={handleSubmit}
        className="flex w-full flex-col gap-3 rounded-2xl bg-card p-6"
      >
        <h1 className="font-heading text-lg font-extrabold uppercase tracking-tight">
          Đăng nhập quản trị
        </h1>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="pin">Mã PIN</Label>
          <Input
            id="pin"
            type="password"
            inputMode="numeric"
            autoFocus
            required
            value={pin}
            onChange={(e) => setPin(e.target.value)}
            className="rounded-xl"
          />
        </div>
        {error && <p className="text-sm text-destructive">{error}</p>}
        <Button
          type="submit"
          disabled={submitting}
          className="h-11 rounded-full bg-brand font-bold text-white hover:bg-brand-dark"
        >
          {submitting ? "Đang kiểm tra..." : "Đăng nhập"}
        </Button>
      </form>
    </main>
  )
}
