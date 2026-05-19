# Eliana Textiles

Luxury bedding storefront for **Eliana Textiles**, Nairobi's premium duvets, mattresses and bed linen brand located at OTC Wholesale Mall.

**Live site:** https://eliana-textiles.vercel.app

---

## Stack

| Layer | Technology |
|---|---|
| Frontend | React 19, TypeScript, Tailwind CSS 4, Vite |
| Backend (dev) | Express + Vite dev middleware |
| Backend (prod) | Vercel serverless functions (`api/`) |
| Animations | Framer Motion |
| Testing | Vitest + Testing Library (unit), Playwright (E2E) |

---

## Local development

```bash
# Install dependencies
npm install

# Start dev server (Express + Vite HMR on port 3000)
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Environment variables

Copy `.env.example` to `.env.local` and fill in values:

```bash
cp .env.example .env.local
```

| Variable | Required | Purpose |
|---|---|---|
| `GEMINI_API_KEY` | No | Gemini AI integration (app works without it) |
| `PORT` | No | Override server port (default: 3000) |

---

## Commands

```bash
npm run dev          # Development server
npm run build        # Production build (Vite SPA + esbuild server bundle)
npm start            # Run production build
npm run lint         # TypeScript type-check (tsc --noEmit)
npm test             # Unit tests (Vitest)
npm run test:watch   # Unit tests in watch mode
npm run test:e2e     # E2E tests (requires dev server on :3000)
npm run test:e2e:ui  # E2E with Playwright UI
```

---

## Project structure

```
src/
  App.tsx           # Root component — owns all state
  types.ts          # Shared TypeScript interfaces
  data/products.ts  # Canonical product catalogue (KES prices)
  components/       # Feature-driven UI components
  lib/utils.ts      # cn() utility (clsx + tailwind-merge)

api/                # Vercel serverless functions (production)
  health.ts
  products.ts

server.ts           # Express server (local development)
e2e/                # Playwright specs
src/__tests__/      # Vitest unit tests
```

---

## Product data

Products are defined once in `src/data/products.ts` and imported by both the Express dev server (`server.ts`) and the Vercel production functions (`api/products.ts`). Edit that single file to add, remove, or update products.

---

## Deployment

The app deploys automatically to Vercel on push to `main`. Vercel serves:
- Static frontend from `dist/` (built by `vite build`)
- API routes from `api/` (Vercel serverless functions)

Customer orders are placed via WhatsApp — no payment gateway is integrated.
