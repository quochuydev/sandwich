/**
 * Single source of truth for environment variables, feature toggles, product
 * catalog and coupons. No other file should read `process.env` directly.
 */

export type Product = {
  id: string
  slug: string
  name: string
  description: string
  price: number
  image: string
}

export type Coupon = {
  code: string
  label: string
  type: "percent" | "fixed"
  value: number
  minSubtotal?: number
}

export type PaymentMethodId = "cod" | "stripe"

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is required (Postgres connection string)")
}

const env = {
  databaseUrl: process.env.DATABASE_URL,
  stripeSecretKey: process.env.STRIPE_SECRET_KEY ?? "",
  stripePublishableKey: process.env.STRIPE_PUBLISHABLE_KEY ?? "",
  stripeWebhookSecret: process.env.STRIPE_WEBHOOK_SECRET ?? "",
  baseUrl: process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000",
  adminPin: process.env.ADMIN_PIN ?? "111111",
}

export const SITE = {
  name: "Bánh Mì Ngon",
  tagline: "Bánh mì kẹp kiểu mới, đầy ắp topping",
  phone: "0900 000 000",
  address: "123 Lê Lợi, Phường Bến Nghé, Quận 1, TP. Hồ Chí Minh",
  currency: "VND",
  baseUrl: env.baseUrl,
  social: {
    facebook: "https://facebook.com",
    instagram: "https://instagram.com",
    zalo: "https://zalo.me",
  },
}

/** PIN for /admin. Override with ADMIN_PIN env var in production. */
export const ADMIN_PIN = env.adminPin

export const DATABASE_URL = env.databaseUrl

export const DELIVERY_FEE = 15000

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

export const PRODUCTS: Product[] = [
  {
    id: "ba-roi-phomai",
    slug: "ba-roi-phomai",
    name: "Ba Rọi Phô Mai",
    description: "Ba rọi áp chảo sốt cay, phô mai tan chảy, thơm phức.",
    price: 35000,
    image: "/products/product-baroi-phomai.png",
  },
  {
    id: "phomai",
    slug: "phomai",
    name: "Phô Mai",
    description: "Phô mai kéo sợi béo ngậy, xà lách tươi, sốt mayo đặc trưng.",
    price: 40000,
    image: "/products/product-phomai.png",
  },
  {
    id: "ba-roi-phomai-trung",
    slug: "ba-roi-phomai-trung",
    name: "Ba Rọi Phô Mai Trứng",
    description: "Ba rọi, phô mai, trứng hoà quyện béo ngậy.",
    price: 30000,
    image: "/products/product-baroi-phomai-trung.png",
  },
  {
    id: "tom-bap",
    slug: "tom-bap",
    name: "Tôm Bắp",
    description: "Tôm sốt cay, bắp ngọt, phô mai, sốt mayo trứ danh.",
    price: 38000,
    image: "/products/product-tom-bap.png",
  },
  {
    id: "trung-luoc",
    slug: "trung-luoc",
    name: "Trứng Luộc",
    description: "Trứng luộc lòng đào, rau thơm, sốt đặc biệt.",
    price: 25000,
    image: "/products/product-trungluoc.png",
  },
]

export const COUPONS: Coupon[] = [
  {
    code: "WELCOME10",
    label: "Giảm 10% cho đơn đầu tiên",
    type: "percent",
    value: 10,
  },
  {
    code: "FREESHIP",
    label: "Miễn phí giao hàng",
    type: "fixed",
    value: DELIVERY_FEE,
  },
  {
    code: "SALE20K",
    label: "Giảm 20.000₫ cho đơn từ 100.000₫",
    type: "fixed",
    value: 20000,
    minSubtotal: 100000,
  },
]
