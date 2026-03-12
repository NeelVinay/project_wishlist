# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev        # Vite dev server (http://localhost:5173)
npm run build      # Production build
npm run lint       # ESLint
npm run preview    # Preview production build
```

No test framework is configured.

## Architecture

React 19 SPA with Vite, React Router v6, and Three.js for 3D visualization. No external state library — pure React hooks throughout.

### Routes (`App.jsx`)
- `/` — Landing page
- `/app` — Main wishlist manager (`WishlistApp.jsx`)
- `/visualize` — Visualization gallery (`VizGalleryPage.jsx`)
- `/visualize/:vizId` — Active visualization (`VizViewerPage.jsx`), e.g. `/visualize/sphere`
- `/about` — About page

### State & Persistence
- **`useUndoRedo` hook** wraps the items array with past/present/future stacks. Every mutation calls `saveItems()` to localStorage automatically.
- **`src/utils/storage.js`** is the centralized persistence layer (designed for future database swap): `loadItems`, `saveItems`, `loadCurrencyCode`, `saveCurrencyCode`, `loadPref`, `savePref`.
- No context API — all state lives in page components and is passed via props.

### Budget Hierarchy
Root items have a `budget` (cap) and `saved` amount. Sub-items have independent budget/saved. Key invariant: when sub-items exist, the root's `saved` auto-calculates as the sum of sub-item saved amounts (not manually editable). Sub-item budgets are validated against the root's budget cap.

### Visualization Gallery & Viewer
- `VizGalleryPage` shows a card gallery of available visualizations at `/visualize`
- `VizViewerPage` renders the selected visualization at `/visualize/:vizId`
- `VizCard` and `VizPreviews` provide the gallery UI with static SVG preview icons
- Visualization options defined in `src/constants/visualizations.js`
- NavBar auto-hides on active visualization pages (slides up, reappears on mouse hover near top)

### 3D Visualization Pipeline
1. `VizViewerPage` loads non-completed items from the database
2. `BudgetSphere` orchestrates the scene (lights, cells, selection state, auto-rotation)
3. `VoronoiGeometry.js` — `computeVoronoiCells()` creates a subdivided icosahedron (detail=5, 20K faces), places seeds via Fibonacci spiral with budget-proportional latitude, assigns faces to nearest seed
4. `SphereCell` renders each cell mesh with useFrame lerp animations for hover/select/explode
5. `Starfield` renders twinkling star particles via custom vertex/fragment shaders
6. `WedgeDetail` shows an Html overlay with item details on click

Important: `IcosahedronGeometry` produces non-indexed geometry (`getIndex()` returns null). The code uses position-based edge keys (`.toFixed(6)`) for boundary detection.

### Donut Chart
SVG-based (`DonutChart.jsx`) with arc-path hit detection, hover-to-expand segments, and an info panel showing budget breakdown including sub-items.

## Styling

All styles are inline, exported as functions from `src/styles.js`. Most accept a `dark` boolean parameter for theming (e.g., `cont(d)`, `inp(d)`). No CSS libraries. The accent color is `#c0392b`.

## Conventions

- **Short variable names** in tight contexts: `d` (dark mode), `s` (sub-item), `n` (name), `p` (priority), `sym` (currency symbol)
- **Prop drilling** is the norm — callbacks like `onAdd`, `onDelete`, `onEdit` passed through component layers
- **`currency` prop** is an object `{ code, symbol, name, country, decimals }` from `constants/currencies.js` (38 currencies)
- **Popup pattern**: generic `Popup` wrapper component, specialized popups (`BudgetCapPopup`, `BudgetExceededPopup`, `ConfirmDialog`) manage their own content
- **Budget/saved validation**: onChange uses `/^\d*\.?\d{0,2}$/` regex to restrict input
- **3D components** use `React.memo` and `useMemo` heavily for performance; animations use `useFrame` with `THREE.MathUtils.lerp`
- **Completed items logic**: completing a root cascades to all sub-items; completing the last sub-item auto-completes the root; uncompleting a sub-item uncompletes the root
