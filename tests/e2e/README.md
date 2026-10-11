# E2E suite (Playwright)

## Running it

```
npm run test:e2e        # headed run against a dedicated Vite instance on :5174
npm run test:e2e:ui     # Playwright's interactive UI runner
npm run test:e2e:report # open the last HTML report
```

The config starts its own `vite` dev server on port **5174** (`playwright.config.js`
`webServer`), separate from whatever you might have running on the default 5173
with `npm run dev`. Nothing here depends on, or will interfere with, your normal
dev server.

Browser windows are always shown (`headless: false` is hard-coded in
`playwright.config.js`) — this suite is meant to be watched, not run invisibly.

## Why there's no DB reset/seed step

This app has no backend yet — all state lives in the browser's `localStorage`
(`src/hooks/useLocalStorage.js`), seeded from `src/data/mockExpenses.js` the first
time it loads with nothing stored. Playwright gives every test its own fresh
browser context by default, which means a brand-new, empty `localStorage` per
test — so the app reseeds itself from `MOCK_EXPENSES` on every single test with no
explicit reset step required. `fixtures/test-data.js` re-exports that same seed
data directly from the app source so the suite can never drift out of sync with
what ships.

When a real backend and auth are added later, this is the first thing that will
need revisiting: a real DB will need the migrate/reset/seed pipeline and an auth
fixture (real login through the UI once in global setup, reused via
`storageState`) described in the `e2e-test-suite-ui-playwright` skill.

## Structure

- `pages/ExpenseTrackerPage.js` — single Page Object for the app's one page
  (form, filter bar, list, summary). Specs call its methods; they never touch a
  CSS selector directly. All locators go through `data-testid` attributes added
  to the app components for this purpose.
- `fixtures/test-data.js` — the app's real seed data plus a couple of
  purpose-built expenses for add/edit tests, and a currency formatter matching
  the app's own `Intl.NumberFormat` config so assertions don't duplicate
  formatting logic.
- `*.spec.js` — one file per user journey: add (incl. validation errors), edit,
  delete, and search/filter/sort.

## Known issues caught by this suite

- **Initial run (2026-10-11):** `itemByDescription('Grocery shopping')` used a
  substring match, so after the edit test renamed that expense to "Grocery
  shopping (updated)" the old-name lookup still matched it, making a
  stale-item assertion pass for the wrong reason. Fixed by anchoring the match
  to the exact description text. Test-code bug, not an app bug.
