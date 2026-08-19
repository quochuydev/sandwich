import { NextResponse } from "next/server"
import { z } from "zod"
import { ADMIN_PIN } from "@/config.server"
import { setAdminCookie } from "@/lib/admin-auth"

const bodySchema = z.object({ pin: z.string().min(1) })

export async function POST(request: Request) {
  const parsed = bodySchema.safeParse(await request.json())
  if (!parsed.success || parsed.data.pin !== ADMIN_PIN) {
    return NextResponse.json({ error: "Mã PIN không đúng" }, { status: 401 })
  }

  await setAdminCookie()
  return NextResponse.json({ ok: true })
}
