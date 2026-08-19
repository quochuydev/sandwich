# Bánh Mì Ngon — Order Booking App

Mobile-first sandwich ordering app. Guests can browse products, customize a
cart, apply coupons, and check out with Cash-on-Delivery or Stripe — no
account required. Includes a PIN-gated `/admin` page to view orders and
update status.

Live: https://sandwich.cappuai.com

## Stack

- Next.js 16 (App Router, Turbopack)
- Tailwind CSS + shadcn/ui
- Drizzle ORM + Postgres (Neon serverless driver)
- Stripe (optional, toggled by env var)

## Getting started

```bash
pnpm install
cp .env.local.example .env.local   # fill in DATABASE_URL at minimum
pnpm db:migrate                    # apply schema to your Postgres database
pnpm db:seed                       # seed products
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

## Configuration

Everything env-driven or hardcoded (prices, coupons, payment toggles) lives in
[`src/config.ts`](./src/config.ts) — no `process.env` reads anywhere else in
the app.

`.env.local`:

```bash
DATABASE_URL=postgres://...        # required — Neon/Postgres connection string
ADMIN_PIN=2468                     # required in production — PIN for /admin
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

Stripe checkout only appears as a payment option when `STRIPE_SECRET_KEY` is
set — otherwise Cash-on-Delivery is the only option. Coupon codes
(`WELCOME10`, `FREESHIP`, `SALE20K`) and product prices are defined in
`src/config.ts`. `ADMIN_PIN` falls back to `2468` for local dev if unset —
always set a real value in production.

## Scripts

- `pnpm dev` — start dev server
- `pnpm build` / `pnpm start` — production build/serve
- `pnpm db:generate` — generate a Drizzle migration after editing `src/db/schema.ts`
- `pnpm db:migrate` — apply pending migrations to `DATABASE_URL`
- `pnpm db:seed` — upsert products from `config.ts`
- `pnpm lint` — ESLint

## Design

See [`DESIGN.md`](./DESIGN.md) for the current (KFC-inspired, placeholder)
visual style guide.
