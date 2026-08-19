# Design Guide — Bánh Mì Ngon

A starting point, inspired by KFC's bold fast-food visual language. Meant to be
changed later — nothing here is precious.

## Principles

- **Mobile-first.** Design for a 375–430px viewport first; scale up from there.
- **Appetite appeal.** Big, bright product photography leads every card.
- **Loud, confident, fast-food energy.** Bold color blocks, thick type, high
  contrast, pill-shaped CTAs — not a delicate/minimal aesthetic.
- **One thumb, no friction.** Sticky bottom cart bar, big tap targets (min 44px),
  minimal typing (steppers over text inputs where possible).

## Color palette

| Token             | Hex       | Usage                                   |
| ------------------ | --------- | ---------------------------------------- |
| `brand` (KFC red)  | `#E4002B` | Primary buttons, price tags, active nav  |
| `brand-dark`       | `#B4001F` | Hover/active state of brand              |
| `ink` (black)      | `#1A1A1A` | Headings, primary text                   |
| `cream` (bg)        | `#FFF8EE` | Page background — warm, not stark white |
| `paper` (surface)  | `#FFFFFF` | Cards, sheets, inputs                    |
| `gold` (accent)    | `#FFC72C` | Badges, coupon highlights, star ratings  |
| `muted`            | `#6B6B6B` | Secondary text                           |
| `success`          | `#1E8E3E` | Order confirmed states                   |

Implemented as CSS variables in `globals.css` under `@theme inline`, mapped onto
shadcn's `--primary` / `--background` / etc. tokens so every shadcn component
inherits the palette automatically.

## Typography

- **Font:** [Be Vietnam Pro](https://fonts.google.com/specimen/Be+Vietnam+Pro) —
  full Vietnamese diacritic support, has a heavy 800/900 weight for
  KFC-style bold headlines. One family, two roles:
  - Headings / prices / buttons → weight 800–900, uppercase, tight tracking.
  - Body copy → weight 400–500.
- Headings are uppercase with slightly tightened letter-spacing (`tracking-tight`).
- Prices are always bold and in `brand` red.

## Components

- **Buttons:** full pill shape (`rounded-full`), bold uppercase label, brand
  red fill for primary actions, generous horizontal padding, min-height 44px.
- **Cards (ProductCard):** white surface, rounded-2xl, soft shadow, image fills
  the top ~60%, name/price/add-button below. Tapping "Add" opens a bottom
  sheet to customize (quantity + note) before adding to cart.
- **Bottom cart bar:** sticky, brand-red background, white bold text, shows
  item count + subtotal + "Xem giỏ hàng →"; only visible when cart has items.
- **Badges:** gold background, black text, for coupon codes / "Mới" tags.
- **Forms:** rounded-xl inputs, clear labels above (not floating), large
  touch targets.

## Layout

- Single column on mobile; product grid becomes 2 columns at `sm:` (≥640px).
- Section padding: `px-4` on mobile, `px-6` at `sm:` and up.
- Banner image full-bleed at the top of the home page, rounded-b-3xl.
- Max content width `max-w-md` centered on larger screens — this stays a
  mobile-shaped experience even on desktop, matching a single-store ordering
  app rather than a full marketing site.

## Notes for future changes

This is a placeholder brand identity (explicitly borrowing KFC's red/black/gold
fast-food language) so the app has a finished feel out of the box. Swap the
palette, font, and logo here first — the Tailwind theme in `globals.css` and
shadcn tokens read from these values, so most of the UI will follow.
