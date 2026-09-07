# Fork & Plan — Recipe Discovery & Meal Planning App

A React app for a local cooking school and its food-blogger partners:
browse recipes, filter by category/cuisine/difficulty, watch tutorials,
plan a week of meals, generate a shopping list, and save favorites — all
persisted between visits.

## Features

- **Recipe browsing** — search by name, filter by category, cuisine, and
  difficulty, with a "clear filters" shortcut.
- **Recipe detail pages** — interactive, checkable ingredient list, numbered
  method, and an embedded tutorial video for recipes that have one.
- **Meal planner** — a 7-day × 3-meal grid; add a recipe to any slot via a
  searchable picker modal, remove it with one click, or clear the whole week.
- **Shopping list** — generates a de-duplicated, alphabetized ingredient list
  from everything currently in the meal plan, merging repeated ingredients
  and noting how many recipes call for each one.
- **Favorites** — save/unsave any recipe from anywhere in the app; the count
  shows live in the navbar.
- **Media components** — `VideoPlayer` (tutorials) and `AudioPlayer`
  (kitchen tips), each with native controls plus a custom play/pause button.
- **Persistence** — favorites and the meal plan are saved to `localStorage`
  and reloaded on refresh.
- **Responsive design** — a sticky navbar that collapses into a hamburger
  menu below 760px, and a fluid grid throughout.
- **404 page** for unmatched routes.
- **Accessible by default** — skip-to-content link, `aria-current` nav
  state, and a keyboard-dismissible, focus-managed Modal.

## Technologies

React 19, React Router DOM v7, PropTypes, CSS Modules, Vite, Vitest,
React Testing Library, oxlint, GitHub Actions.

## Installation

```bash
npm install
npm run dev       # dev server
npm run build     # production build
npm run preview   # preview build
npm test          # test suite (see TESTING.md)
npm run lint      # static analysis
```

## Project Structure

See the folder tree in the repo root. Key ideas:

- `src/data/recipesData.js` — the static recipe dataset (20 recipes across
  5 categories) plus a cuisine-color lookup used throughout the UI.
- `src/utils/helpers.js` — pure, unit-tested functions: formatting,
  filtering, sorting, the shopping-list aggregator, localStorage I/O, and
  the empty meal-plan builder (see `TESTING.md`).
- `src/components/` — organized by domain (`Navigation`, `Recipe`,
  `MealPlanner`, `Media`, `UI`, `common`), each folder pairing components
  with a CSS Module.
- `src/pages/` — one file per route, composing the components above.
- `src/App.jsx` — owns the two pieces of state shared across routes
  (favorites and the meal plan), the `<Routes>` table, and the
  localStorage `useEffect`s.

## Component Descriptions

- **Navbar** — active-link highlighting, mobile hamburger, favorites badge.
- **RecipeCard / RecipeList / RecipeFilter / RecipeDetail** — summary card,
  the mapped grid, filter controls, and the full page (`useParams`, 404 case).
- **MealPlanner / DayCard** — the weekly grid, a recipe-picker modal, and a
  shopping-list modal, built from one reusable day column (×7).
- **VideoPlayer / AudioPlayer** — native media elements with a controlled
  play/pause button via a ref.
- **Button / Card / SearchBar / Loading / Modal** — the five required
  reusable UI primitives (`Card`/`Modal` use `children` for composition).
- **Header / Footer** — shared page chrome.

## State Management

Favorites and the meal plan are **lifted up** to `App.jsx` since multiple
pages read and write them. Everything else — search text, filters, modal
open/closed state, checked ingredients — lives locally in the component
that owns it, following "lift state only as far as it needs to go." Both
shared pieces persist to `localStorage` via a `useEffect` keyed on their
own value, read back with a lazy `useState` initializer.

## Routing

| Route | Page |
|---|---|
| `/` | Home |
| `/recipes` | RecipesPage |
| `/recipes/:id` | RecipeDetail |
| `/meal-planner` | MealPlannerPage |
| `/favorites` | FavoritesPage |
| `*` | NotFound (404) |

## Media Assets

Recipe images, the tutorial video, and the kitchen-tips audio clip are all
**synthesized placeholder assets** (generated with Pillow/ffmpeg) rather
than stock photography, so the project has no external licensing
dependencies. Swap in real photography/video by replacing files under
`public/assets/` and updating the paths in `recipesData.js`.

## Future Enhancements

- Real backend/CMS instead of a static data file.
- Drag-and-drop meal planning; exportable/printable shopping list.
- User accounts so favorites/plans sync across devices.

## Screenshots

See `/screenshots`: Home, Recipes (filtered), Recipe Detail (with video),
Meal Planner, Favorites, and the mobile responsive nav.
