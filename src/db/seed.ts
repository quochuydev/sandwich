import { PRODUCTS } from "@/config"
import { db } from "./index"
import { products } from "./schema"

async function main() {
  for (const product of PRODUCTS) {
    await db
      .insert(products)
      .values({ ...product, active: true })
      .onConflictDoUpdate({
        target: products.id,
        set: {
          slug: product.slug,
          name: product.name,
          description: product.description,
          price: product.price,
          image: product.image,
          active: true,
        },
      })
  }

  console.log(`Seeded ${PRODUCTS.length} products.`)
}

main()
