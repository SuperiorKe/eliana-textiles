# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
# Development (Express server with Vite HMR)
npm run dev

# Type-check (no emit — used as lint)
npm run lint

# Production build (Vite SPA + esbuild server bundle)
npm run build

# Run production build
npm start
```

```bash
# Unit tests (single run)
npm test

# Unit tests (watch mode)
npm run test:watch

# Run a single test file
npx vitest run src/__tests__/ComponentName.test.tsx

# E2E tests (requires dev server running on :3000)
npm run test:e2e

# E2E with interactive Playwright UI
npm run test:e2e:ui
```

See `TESTING.md` for full conventions. `npm run lint` runs `tsc --noEmit`.

## Architecture

**Full-stack SPA**: React 19 + TypeScript frontend served by an Express backend. Vite handles the frontend build; esbuild bundles `server.ts` to `dist/server.cjs` for production.

**Frontend** (`src/`):
- `App.tsx` — root component; owns all state (cart, wishlist, comparison, search/filter, notifications)
- `constants.ts` — orphaned `PRODUCTS` array (not imported by any component; see **Data sources** below)
- `types.ts` — shared TypeScript interfaces (`Product`, `CartItem`, `Review`)
- `components/` — feature-driven UI components; most receive state and callbacks as props from `App.tsx`
- `lib/utils.ts` — exports `cn()` (clsx + tailwind-merge)

**Backend** (`server.ts`):
- `/api/health` — health check
- `/api/products` — returns inline mock product array (KES prices, Nairobi-specific descriptions); the `shouldFail` flag at the top of the handler can be set to `true` to test error-state UI
- Dev mode: mounts Vite dev middleware for HMR
- Prod mode: serves `dist/` as static files, then falls through to `index.html` for client-side routing
- Listens on port 3000 (`0.0.0.0`)

**Data sources**: `src/constants.ts` contains a separate `PRODUCTS` array (USD prices) that is **not imported anywhere** — the app's live data comes exclusively from `server.ts`. Do not add logic that reads from `constants.ts` expecting it to match the API response.

**Styling**: Tailwind CSS 4 (Vite plugin). Custom theme tokens defined in `src/index.css` under `@theme`: `--color-paper` (#F8F7F5) and `--color-ink` (#0f172a). Luxury aesthetic — no dark mode.

**Non-obvious behaviors**:
- "Accessories" category in the filter is a catch-all — it matches any product whose `category` is not one of the three named categories (Duvets, Mattresses, Bed Sheets). Products with `category: "Accessories"` or any unlisted value fall here.
- Comparison list is capped at 4 products (`toggleComparison` silently ignores a 5th add).
- `addToCart` strips `reviews` and `attributes` from the product before storing it in cart state (see `CartItem` type).

**Gemini integration**: The app was scaffolded via Google AI Studio. `metadata.json` declares `MAJOR_CAPABILITY_SERVER_SIDE_GEMINI_API`. The `GEMINI_API_KEY` env var is expected at runtime (see `.env.example`).

**Path alias**: `@/*` resolves to the project root (configured in `vite.config.ts`).

## Testing

- Unit tests: `src/__tests__/` via Vitest + @testing-library/react
- E2E tests: `e2e/` via Playwright (Chromium + Mobile Chrome + Mobile Safari)
- Run: `npm test` (unit), `npm run test:e2e` (E2E, needs server on :3000)
- See `TESTING.md` for full conventions
- When fixing a bug → write a regression test first
- When adding interactive behavior → write an E2E spec in `e2e/`
- Never commit code that breaks existing tests

## Project context

This is a client project for **Eliana Textiles** — a Nairobi-based bedding wholesaler located at OTC Wholesale Mall. The live site is at `eliana-textiles.vercel.app`. The scope (see `SCOPE.md`) covers a storefront + CMS; online payments/M-Pesa are explicitly out of scope. Customers order via WhatsApp.

## Skill routing

When the user's request matches an available skill, invoke it via the Skill tool. When in doubt, invoke the skill.

Key routing rules:
- Product ideas/brainstorming → invoke /office-hours
- Strategy/scope → invoke /plan-ceo-review
- Architecture → invoke /plan-eng-review
- Design system/plan review → invoke /design-consultation or /plan-design-review
- Full review pipeline → invoke /autoplan
- Bugs/errors → invoke /investigate
- QA/testing site behavior → invoke /qa or /qa-only
- Code review/diff check → invoke /review
- Visual polish → invoke /design-review
- Ship/deploy/PR → invoke /ship or /land-and-deploy
- Save progress → invoke /context-save
- Resume context → invoke /context-restore
