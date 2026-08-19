import crypto from "node:crypto"
import { cookies } from "next/headers"
import { ADMIN_PIN } from "@/config"

const COOKIE_NAME = "admin_auth"

function tokenFor(pin: string) {
  return crypto.createHash("sha256").update(pin).digest("hex")
}

export async function isAdminAuthed() {
  const store = await cookies()
  return store.get(COOKIE_NAME)?.value === tokenFor(ADMIN_PIN)
}

export async function setAdminCookie() {
  const store = await cookies()
  store.set(COOKIE_NAME, tokenFor(ADMIN_PIN), {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  })
}

export async function clearAdminCookie() {
  const store = await cookies()
  store.delete(COOKIE_NAME)
}
