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

There is no test runner configured. `npm run lint` runs `tsc --noEmit` and is the only static analysis step.

## Architecture

**Full-stack SPA**: React 19 + TypeScript frontend served by an Express backend. Vite handles the frontend build; esbuild bundles `server.ts` to `dist/server.cjs` for production.

**Frontend** (`src/`):
- `App.tsx` — root component; owns all state (cart, wishlist, comparison, search/filter, notifications)
- `constants.ts` — mock product data (`PRODUCTS` array); the only data source for the frontend
- `types.ts` — shared TypeScript interfaces (`Product`, `CartItem`, `Review`)
- `components/` — feature-driven UI components; most receive state and callbacks as props from `App.tsx`
- `lib/utils.ts` — exports `cn()` (clsx + tailwind-merge)

**Backend** (`server.ts`):
- `/api/health` — health check
- `/api/products` — returns mock product array with a simulated 5% failure rate (intentional demo behavior)
- Dev mode: mounts Vite dev middleware for HMR
- Prod mode: serves `dist/` as static files, then falls through to `index.html` for client-side routing
- Listens on port 3000 (`0.0.0.0`)

**Styling**: Tailwind CSS 4 (Vite plugin). Custom theme tokens defined in `src/index.css` under `@theme`: `--color-paper` (#F8F7F5) and `--color-ink` (#0f172a). Luxury aesthetic — no dark mode.

**Gemini integration**: The app was scaffolded via Google AI Studio. `metadata.json` declares `MAJOR_CAPABILITY_SERVER_SIDE_GEMINI_API`. The `GEMINI_API_KEY` env var is expected at runtime (see `.env.example`).

**Path alias**: `@/*` resolves to the project root (configured in `vite.config.ts`).

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
