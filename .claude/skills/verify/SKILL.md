---
name: verify
description: >-
  Exercise this app's real runtime flows (product list, ordering via COD,
  pricing/coupons, order confirmation page, admin PIN login and order
  visibility, /api/health) end-to-end after a code change, since the repo
  has no automated test suite. Use before considering any change under
  src/app, src/components, src/lib, or src/db complete.
---

# Verify — Bánh Mì Ngon order app

There are no automated tests in this repo (no test framework installed) —
this skill *is* the test suite. Prefer driving the real HTTP surface with
curl over trusting `pnpm build` alone; most of the app's logic (pricing,
coupons, order numbers, admin auth) only runs against a live DB request.

## 0. Static checks (fast, always run first)
```bash
pnpm lint
pnpm build   # catches type errors and route/build breakage the dev server won't
```

## 1. Start the app
Follow the [`run`](../run/SKILL.md) skill: start `pnpm dev` in the
background, confirm the DB is migrated/seeded. Note the actual port from
the dev server's startup log (default 3000).

## 2. Health + product data
```bash
curl -s localhost:3000/api/health          # expect status: ok, db: connected
curl -s localhost:3000/api/products        # expect the 5 seeded products (src/config.ts), each active: true
```

## 3. Order flow (COD) via API — the critical path
```bash
curl -s -X POST localhost:3000/api/orders \
  -H 'content-type: application/json' \
  -d '{
    "customerName": "Test User",
    "phone": "0900000000",
    "address": "123 Test St",
    "paymentMethod": "cod",
    "items": [{"productId": "phomai", "quantity": 2}]
  }'
```
Expect `{"orderId": "<uuid>"}` and no `url` field (COD has no Stripe
redirect). Then confirm the confirmation page renders:
```bash
curl -s -o /dev/null -w '%{http_code}\n' localhost:3000/order/<orderId>   # expect 200
```

If the change touches pricing or coupons, repeat with a `couponCode`
(`WELCOME10`, `FREESHIP`, or `SALE20K` — defined in `src/config.ts`) and
hand-check the resulting total against `src/lib/pricing.ts`. A bad
`productId`, an inactive product, or an unknown coupon code should each
get a 400 with a Vietnamese error message, not a 500 — worth checking when
touching `src/app/api/orders/route.ts` validation.

If the change touches `PAYMENTS`/Stripe in `src/config.ts`, note that
`paymentMethod: "stripe"` only succeeds when `STRIPE_SECRET_KEY` is set in
`.env.local`; otherwise it should 400 with "Phương thức thanh toán không
khả dụng" — that rejection is itself the thing to check when Stripe isn't
configured locally.

## 4. Admin
```bash
# wrong PIN -> should fail
curl -s -i -X POST localhost:3000/api/admin/login \
  -H 'content-type: application/json' -d '{"pin":"0000"}' | head -1

# correct PIN -> should set a cookie and succeed. Values in .env.local are
# double-quoted (e.g. ADMIN_PIN="111111") — strip the quotes or the JSON
# body breaks.
ADMIN_PIN=$(grep '^ADMIN_PIN=' .env.local | cut -d= -f2- | tr -d '"')
curl -s -i -c /tmp/admin-cookie.txt -X POST localhost:3000/api/admin/login \
  -H 'content-type: application/json' -d "{\"pin\":\"$ADMIN_PIN\"}" | head -1

# authenticated admin page should now list the order created in step 3
curl -s -b /tmp/admin-cookie.txt localhost:3000/admin | grep -o 'Test User' || echo "order not visible in admin"
```

## 5. Cleanup
Kill the background dev server. Test orders inserted during verification
are harmless (same seeded DB as manual dev use) — no need to delete them
unless the change specifically concerns order listing/counts.
