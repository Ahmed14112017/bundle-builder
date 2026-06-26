# Security System Bundle Builder

A multi-step product bundle builder with a live review panel, built as a
frontend take-home. Shoppers pick cameras, a monitoring plan, sensors, and
accessories through a 4-step accordion, while a review panel on the side
keeps a running tally of everything they've chosen.

## Tech stack

- **React 19 + TypeScript** — component layer
- **Vite** — dev server / build tool
- **Zustand** — state management (quantities, active color variant per
  product, which accordion step is open)
- **Tailwind CSS v4** — styling, using the new CSS-first `@theme` config
  (no `tailwind.config.js` needed)
- **lucide-react** — step icons

## Running it locally

Requires Node 18+.

```bash
npm install
npm run dev
```

Then open the URL Vite prints (usually `http://localhost:5173`).

Other scripts:

```bash
npm run build      # type-check + production build into dist/
npm run preview    # serve the production build locally
```

## Project structure

```
src/
├── data/
│   └── products.json       # The single source of truth for all product/step content
├── types/
│   └── index.ts             # Product, Step, BundleData, and state shape types
├── lib/
│   └── pricing.ts           # All price math: line totals, savings, grand total
├── store/
│   └── bundleStore.ts       # Zustand store: quantities, active variants, accordion state, save/load
├── components/
│   ├── builder/             # Left column: accordion steps + product cards
│   ├── review/              # Right column: review panel + price summary
│   └── ui/                  # Small reusable pieces (stepper, badge, icons)
└── App.tsx                  # Two-column responsive layout
```

## How it's data-driven

Nothing product-specific is hardcoded into a component. `products.json`
defines every step, every product, and how each product should look
(badge or not, variants or not, compare-at price or not). Components only
know how to render the _shapes_ described in `src/types/index.ts` — adding
a tenth product or a fifth step means editing the JSON, not the React code.

The JSON also seeds initial state via `initialQuantities`, which is how the
review panel shows pre-populated sensors/accessories/plan on first load
even though those steps don't expose an "add" control in the visible step.

## Variant + quantity behavior

This was the trickiest interaction to get right, so here's the model:

- Quantities are stored per **product + variant**, not just per product:
  `quantities["wyze-cam-v4"] = { white: 1, black: 0 }`. Red and blue (or
  white and black) truly track separate counts.
- Each product also has an `activeVariant` — whichever color chip is
  currently selected on the card. The stepper always reads/writes the
  quantity for _that_ variant. Switching the active color doesn't touch
  any other variant's count.
- The review panel iterates over every variant with qty > 0 across every
  product, so if you have 2 Red and switch the card to Blue, Red (×2)
  still shows up as its own line.
- Products with no `variants` array just use a single `"default"` key
  internally — same code path, simpler data.

## Persistence ("Save my system for later")

Clicking the link serializes `{ quantities, activeVariant, savedAt }` to
`localStorage` under one key. On app mount, `hydrateFromStorage()` checks
for that key and restores the snapshot if present — so a reload or a
return visit picks up exactly where the shopper left off. If localStorage
is unavailable (private browsing, quota exceeded), saving fails silently
and the rest of the app keeps working without persistence.

## Decisions & tradeoffs

- **Unit price vs. mockup line totals**: the design mockup is a static
  Figma file, not a live calculator — a couple of its displayed numbers
  don't multiply out perfectly against quantity (e.g. the review panel's
  line total for one product doesn't exactly equal `unit price × qty` as
  shown on its own card). Rather than hardcode the mockup's specific
  numbers, this app computes every total live as `unit price × quantity`
  everywhere, using the `price`/`oldprice` fields on each product as the
  source of truth. This means totals are internally consistent and will
  stay correct as quantities change, even though one or two static numbers
  may differ very slightly from the original screenshots.
- **Product images**: real Wyze product photography isn't included (no
  rights to redistribute it). Each product has a small distinct SVG
  placeholder under `public/images/products/` instead. Swapping in real
  images later is a one-line change per product in `products.json`.
- **No backend**: per the brief, a backend is a bonus and not required.
  `products.json` is read directly as a local file via a JSON import.
- **Checkout**: there's nowhere for it to go in this prototype, so it's a
  simple `window.alert` confirmation, as suggested in the brief.
- **Responsiveness**: the builder and review panel stack into a single
  column below the `lg` breakpoint; the review panel is `sticky` on
  desktop so it stays visible while scrolling through steps.

## What I'd do with more time

- Swap placeholder SVGs for real product photography
- Add unit tests around `lib/pricing.ts` (the math is the part most worth
  protecting from regressions)
- Animate the accordion expand/collapse instead of an instant toggle
- Add keyboard navigation polish for the variant chip selector
