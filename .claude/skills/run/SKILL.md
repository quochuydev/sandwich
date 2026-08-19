---
name: run
description: >-
  Start this Next.js sandwich-ordering app locally against the seeded Neon
  Postgres DB so a change can be viewed in a browser or hit with curl. Use
  when asked to run, start, preview, or screenshot the app.
---

# Run — Bánh Mì Ngon order app

1. Deps: `pnpm install` (skip if `node_modules` already present).
2. `.env.local` in this repo already has a working `DATABASE_URL` and
   `ADMIN_PIN` for local dev — don't overwrite it, and don't print its
   contents (it holds real Neon credentials).
3. On a fresh DB only, apply schema + seed products:
   ```bash
   pnpm db:migrate
   pnpm db:seed
   ```
4. Start the dev server in the background:
   ```bash
   pnpm dev
   ```
   Turbopack, default port 3000. If 3000 is taken, Next.js picks the next
   free port — read the actual URL from the startup log rather than
   assuming 3000.
5. Key routes:
   - `/` — product catalog
   - `/cart` — cart drawer/page
   - `/checkout` — checkout form (COD always available; Stripe option only
     renders if `STRIPE_SECRET_KEY` is set)
   - `/order/[id]` — order confirmation/status page
   - `/admin` — PIN-gated order list (PIN = `ADMIN_PIN` in `.env.local`,
     defaults to `2468` if unset)
6. Kill the background dev server when done rather than leaving it running
   across unrelated tasks.
