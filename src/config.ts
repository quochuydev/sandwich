/**
 * Client-safe config: feature toggles, product catalog and coupons. No
 * secrets here — this file is bundled into client components. Server-only
 * values (DB connection string, PINs, API secrets) live in config.server.ts.
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

export const SITE = {
  name: "Bánh Mì Ngon",
  tagline: "Bánh mì kẹp kiểu mới, đầy ắp topping",
  phone: "0900 000 000",
  address: "Đ. Lê Văn Sỹ, P. Nhiêu Lộc, TP. Hồ Chí Minh",
  currency: "VND",
  baseUrl: process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000",
  social: {
    facebook: "https://facebook.com",
    instagram: "https://instagram.com",
    zalo: "https://zalo.me",
  },
}

export const DELIVERY_FEE = 5000

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
