import Image from "next/image"
import { eq } from "drizzle-orm"
import { db } from "@/db"
import { products } from "@/db/schema"
import { SITE } from "@/config"
import { ProductCard } from "@/components/product-card"
import { BottomCartBar } from "@/components/bottom-cart-bar"
import { SiteFooter } from "@/components/site-footer"

export default async function HomePage() {
  const rows = await db
    .select()
    .from(products)
    .where(eq(products.active, true))

  return (
    <main className="mx-auto w-full max-w-md flex-1 pb-28">
      <div className="relative aspect-[16/9] w-full overflow-hidden rounded-b-3xl">
        <Image
          src="/banner.png"
          alt={SITE.name}
          fill
          priority
          className="object-cover"
          sizes="(min-width: 640px) 640px, 100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 p-4">
          <h1 className="font-heading text-2xl font-extrabold uppercase tracking-tight text-white">
            {SITE.name}
          </h1>
          <p className="text-sm text-white/90">{SITE.tagline}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 p-4">
        {rows.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      <SiteFooter />
      <BottomCartBar />
    </main>
  )
}
