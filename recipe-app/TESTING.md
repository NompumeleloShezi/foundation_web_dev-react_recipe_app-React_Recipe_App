# Testing

This project uses [Vitest](https://vitest.dev) and
[React Testing Library](https://testing-library.com/react) for automated
tests, plus [oxlint](https://oxc.rs/docs/guide/usage/linter.html) for
static analysis.

## Running tests

```bash
npm test          # run the full suite once
npm run test:watch # watch mode while developing
npm run lint       # static analysis (react-hooks rules included)
```

## What's covered

- **`src/utils/__tests__/helpers.test.js`** — every pure function in
  `helpers.js`: time formatting, difficulty icons, filtering, sorting,
  the empty meal-plan builder, the shopping-list aggregator, and the
  localStorage read/write helpers (including corrupt-JSON recovery).
- **`src/components/UI/__tests__/Button.test.jsx`** — rendering, click
  handling, the disabled state, and the default variant.
- **`src/components/Recipe/__tests__/RecipeCard.test.jsx`** — rendered
  content, the favorite toggle (both states and the callback), and the
  combined prep+cook time display.
- **`src/components/MealPlanner/__tests__/MealPlanner.test.jsx`** —
  rendering all seven days, assigning a recipe to a slot through the
  picker modal, the shopping list's disabled/enabled state, its generated
  content, and the clear-week action.

38 tests across 4 files, all passing, 0 lint warnings/errors.

## CI

`.github/workflows/ci.yml` runs `npm ci`, `npm run lint`, `npm test`, and
`npm run build` on every push and pull request against `main`.
