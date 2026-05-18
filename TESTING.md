# Testing

100% test coverage is the key to great vibe coding. Tests let you move fast, trust your instincts, and ship with confidence — without them, vibe coding is just yolo coding. With tests, it's a superpower.

## Frameworks

- **Unit / component:** Vitest 4 + @testing-library/react + jsdom
- **E2E:** Playwright (Chromium + Mobile Chrome + Mobile Safari)

## Running tests

```bash
# Unit tests (single run)
npm test

# Unit tests (watch mode)
npm run test:watch

# E2E tests (requires dev server on :3000)
npm run test:e2e

# E2E with interactive UI
npm run test:e2e:ui
```

## Test layers

| Layer | Where | What to test |
|-------|-------|-------------|
| Unit | `src/__tests__/` | Pure functions, business logic, component rendering |
| E2E | `e2e/` | User flows, navigation, interactive behavior |

## Conventions

- Test files: `src/__tests__/ComponentName.test.tsx` for units, `e2e/feature.spec.ts` for E2E
- Assertions: prefer role-based queries (`getByRole`, `getByLabel`) over class/id selectors
- Never `expect(x).toBeDefined()` — test what the code actually does
- One assertion per logical behavior, not per line of source

## Expectations

- When fixing a bug, write a regression test that encodes the exact bug condition first
- When adding a conditional (if/else), test both paths
- When adding interactive behavior (click, scroll, form), write an E2E spec
- Never commit code that makes existing tests fail
