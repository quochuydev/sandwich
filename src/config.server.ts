import "server-only"
import type { PaymentMethodId } from "@/config"

/**
 * Server-only config: env vars and secrets. The `server-only` import makes
 * accidentally importing this from a client component a build-time error
 * instead of a runtime crash. No other file should read `process.env`
 * directly for these values.
 */

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is required (Postgres connection string)")
}

const env = {
  databaseUrl: process.env.DATABASE_URL,
  stripeSecretKey: process.env.STRIPE_SECRET_KEY ?? "",
  stripePublishableKey: process.env.STRIPE_PUBLISHABLE_KEY ?? "",
  stripeWebhookSecret: process.env.STRIPE_WEBHOOK_SECRET ?? "",
  adminPin: process.env.ADMIN_PIN ?? "111111",
}

/** PIN for /admin. Override with ADMIN_PIN env var in production. */
export const ADMIN_PIN = env.adminPin

export const DATABASE_URL = env.databaseUrl

/**
 * Both methods can be toggled here. Stripe only actually renders in the UI
 * when it's enabled AND a secret key is configured.
 */
export const PAYMENTS: Record<
  PaymentMethodId,
  { enabled: boolean; label: string }
> = {
  cod: {
    enabled: true,
    label: "Thanh toán khi nhận hàng (COD)",
  },
  stripe: {
    enabled: Boolean(env.stripeSecretKey),
    label: "Thẻ / Ví (Stripe)",
  },
}

export const STRIPE = {
  secretKey: env.stripeSecretKey,
  publishableKey: env.stripePublishableKey,
  webhookSecret: env.stripeWebhookSecret,
}
