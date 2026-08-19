import {
  boolean,
  integer,
  pgTable,
  serial,
  text,
  timestamp,
} from "drizzle-orm/pg-core"

export const products = pgTable("products", {
  id: text("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  price: integer("price").notNull(),
  image: text("image").notNull(),
  active: boolean("active").notNull().default(true),
})

export const orders = pgTable("orders", {
  id: text("id").primaryKey(),
  orderNumber: text("order_number").notNull().unique(),
  customerName: text("customer_name").notNull(),
  phone: text("phone").notNull(),
  address: text("address").notNull(),
  note: text("note"),
  subtotal: integer("subtotal").notNull(),
  discount: integer("discount").notNull().default(0),
  couponCode: text("coupon_code"),
  deliveryFee: integer("delivery_fee").notNull().default(0),
  total: integer("total").notNull(),
  paymentMethod: text("payment_method", { enum: ["cod", "stripe"] }).notNull(),
  paymentStatus: text("payment_status", {
    enum: ["unpaid", "paid"],
  })
    .notNull()
    .default("unpaid"),
  status: text("status", {
    enum: ["pending", "confirmed", "delivering", "completed", "cancelled"],
  })
    .notNull()
    .default("pending"),
  stripeSessionId: text("stripe_session_id"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
})

export const orderItems = pgTable("order_items", {
  id: serial("id").primaryKey(),
  orderId: text("order_id")
    .notNull()
    .references(() => orders.id),
  productId: text("product_id").notNull(),
  name: text("name").notNull(),
  price: integer("price").notNull(),
  quantity: integer("quantity").notNull(),
  note: text("note"),
})

export type ProductRow = typeof products.$inferSelect
export type OrderRow = typeof orders.$inferSelect
export type OrderItemRow = typeof orderItems.$inferSelect
