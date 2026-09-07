# Planning Document — Fork & Plan

## Component Hierarchy

```
main.jsx (BrowserRouter)
└── App.jsx (owns: favorites[], mealPlan{})
    ├── Navbar
    ├── <Routes>
    │   ├── "/"             → Home
    │   │                      ├── Header, Card, AudioPlayer, Button
    │   │                      └── RecipeList → RecipeCard (×n)
    │   ├── "/recipes"      → RecipesPage
    │   │                      ├── Header, SearchBar, RecipeFilter, Loading
    │   │                      └── RecipeList → RecipeCard (×n)
    │   ├── "/recipes/:id"  → RecipeDetail
    │   │                      └── VideoPlayer, Button
    │   ├── "/meal-planner" → MealPlannerPage
    │   │                      ├── Header
    │   │                      └── MealPlanner
    │   │                          ├── DayCard (×7)
    │   │                          └── Modal (recipe picker)
    │   ├── "/favorites"    → FavoritesPage
    │   │                      └── RecipeList → RecipeCard (×n) | empty state
    │   └── "*"             → NotFound
    └── Footer
```

## Data Flow Diagram

```
recipesData.js (static array)
        │
        ▼
   App.jsx state ── favorites[] ──────┐
        │                             ▼
        │                    RecipeCard.onFavoriteToggle (child→parent callback)
        │                             │
        ▼                             ▼
   mealPlan{day:{slot}} ◄──── RecipeDetail.onAddToPlan / MealPlanner.onAssignMeal
        │
        ▼
   localStorage (persisted via useEffect on [favorites]/[mealPlan])
```

Props flow **down** (App → Page → List → Card), callbacks flow **up**
(Card click → List → Page → App's state setter). Sibling pages never talk
directly to each other — e.g. Favorites and RecipesPage both read/write the
same `favorites` array that lives in App, so a heart tapped on one page is
reflected on the other automatically.

## Components (18 total)

Navbar, Header, Footer, Button, Card, SearchBar, Loading, Modal,
RecipeCard, RecipeList, RecipeFilter, RecipeDetail, MealPlanner, DayCard,
VideoPlayer, AudioPlayer, plus 5 page components (Home, RecipesPage,
MealPlannerPage, FavoritesPage, NotFound).

## State Management Strategy

- **Lifted to App.jsx:** `favorites` (array of recipe objects) and
  `mealPlan` (object keyed by day → slot), because 4–5 different
  pages/routes need to read or mutate them.
- **Local to component:** search term, active filters, modal visibility,
  checked ingredients, picker day/slot selection — none of these are
  needed outside the component that owns them.
- **Persistence:** both shared pieces sync to `localStorage` in a
  `useEffect`, and are re-hydrated with a lazy `useState` initializer.
