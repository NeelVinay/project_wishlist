# Changelog

All notable changes to the Wishlist App are documented here.

---

## v0.19.0 — CLAUDE.md & Codebase Documentation
**Date:** March 11, 2026

### Added
- `CLAUDE.md` — guidance file for Claude Code describing commands, architecture, and conventions

---

## v0.18.0 — Space Starfield Background & Exploded View
**Date:** March 11, 2026

### Added
- Starfield background on `/visualize` — 2,500 twinkling stars at varying depths via custom GLSL vertex/fragment shaders
- Stars use additive blending and size attenuation; closer stars are larger and brighter for true depth perspective
- Per-star random twinkling via sinusoidal phase offsets animated in `useFrame`
- Exploded view toggle on the sphere — cells drift outward radially along their centroid direction
- Auto-rotation when exploded view is active (slow Y-axis rotation)
- Compound hover + explode offset along the same radial direction
- `SphereControls` button switches between "Exploded View" and "Collapse" with red active state
- OrbitControls max zoom-out increased to 20 to showcase starfield depth

### Files Changed
- `src/components/sphere/Starfield.jsx` — new component (custom shader-based star particles)
- `src/components/sphere/BudgetSphere.jsx` — added Starfield, exploded prop, auto-rotation
- `src/components/sphere/SphereCell.jsx` — added exploded offset logic
- `src/components/sphere/SphereControls.jsx` — new component (explode toggle button)
- `src/pages/DataVizPage.jsx` — wired exploded state, increased maxDistance

---

## v0.17.0 — 3D Voronoi Sphere Visualization
**Date:** March 11, 2026

### Added
- 3D interactive sphere visualization on `/visualize` route (Three.js + React Three Fiber)
- Sphere divided into organic Voronoi-like cells proportional to each item's budget
- Voronoi cells generated via subdivided icosahedron (20,480 faces) with Fibonacci spiral seed placement
- Hover interaction: cells pull out radially from the sphere with smooth lerp animation and name label
- Click interaction: isolates a cell (others fade to 8% opacity), shows detail overlay with budget, share %, saved amount, and sub-items
- Click away to deselect with smooth opacity return animation
- Rotate (drag) and zoom (scroll) via OrbitControls
- Cracked-earth gap effect between cells for organic aesthetic
- Solid cell geometry with boundary side walls visible on hover pull-out
- Slightly transparent materials (82% opacity) to avoid flat beach-ball appearance
- Empty state message when no items have budgets

---

## v0.16.0 — localStorage Persistence
**Date:** March 11, 2026

### Added
- localStorage persistence for wishlist items, currency, and user preferences
- `src/utils/storage.js` — centralized storage utility (loadItems, saveItems, loadCurrencyCode, saveCurrencyCode, loadPref, savePref)
- Items auto-save on every add, edit, delete, reorder, undo, and redo
- Currency selection persists across page refreshes
- "Don't ask budget cap" preference persists
- Data loads from localStorage on app start; corrupted data fails gracefully to empty state

### Changed
- `useUndoRedo` hook now accepts optional `persistFn` callback, called on every state change
- WishlistApp initializes state from localStorage instead of empty defaults

---

## v0.15.0 — Interactive Donut Chart & Full Rewrite
**Date:** March 9, 2026

### Added
- Hover-to-expand donut chart segments with smooth 0.5s animation
- Non-hovered segments fade to 15% opacity
- Precise arc-path hit detection (only visible donut ring is hoverable)
- Info panel to the right of donut with border, background, box-shadow
- Info panel shows item name, color swatch, budget, share %, saved amount
- Classes show sub-items with individual budgets and percentage contributions
- Info panel animates in with opacity and translateY transition (0.4s)
- "Hover over a segment to see details" placeholder text
- SVG viewBox padding prevents layout shift on hover enlargement

### Changed
- Full codebase rewrite for consistency and clean component structure
- Removed bottom legend from donut chart (replaced by hover info panel)
- Component names shortened for readability (WItem, SubRow, PriBadge, etc.)

---

## v0.14.0 — Multi-Currency Support (Level 1)
**Date:** March 9, 2026

### Added
- 38 currencies with code, symbol, name, country, and decimal places
- Searchable currency selector replacing description text below header
- Search by currency code, name, country, or symbol
- Dropdown with filtered results and aligned columns
- Dynamic currency symbol throughout entire app
- Currency-aware formatting via updated fmtMoney (respects decimal places)
- Default currency: USD

---

## v0.13.0 — Sort by Purchasable, Green Row Highlight & Bug Fixes
**Date:** March 9, 2026

### Added
- Sort by Purchasable option in sort dropdown
- Purchasable sort works on both root items and sub-items within classes
- Light green row background on items where saved >= budget

### Changed
- Removed green glow from saved input (row background handles it)

### Fixed
- Saved input rejecting 0 as a valid value (BF-010)

---

## v0.12.0 — Status Removal, Dual Progress Bars & UI Polish
**Date:** March 9, 2026

### Added
- Two switchable progress bars with tab selector (Completion and Savings)
- Completion Progress bar: weighted by item priority
- Savings Progress bar: total saved vs total budget, capped at 100%
- Active bar in front, inactive faded behind at 35% opacity

### Changed
- Classes display "$X remaining" instead of "$X / $Y" for budget
- All dashed borders replaced with solid gray borders

### Removed
- Status section (Want / Saving For / Purchased) from all items
- Sort by Status option
- "In Progress" auto-derived status logic
- Old single progress bar based on status

---

## v0.11.0 — Savings Tracker
**Date:** March 9, 2026

### Added
- Saved field on each root item and sub-item
- Saved input in main add form and sub-item add form
- Root items without sub-items: editable saved amount
- Classes: auto-calculated sum of sub-item saved (not editable)
- Green outline when saved matches/exceeds budget
- Popup warning when adding first sub-item to root with saved amount

### Removed
- Complex savings exceeded popup (simplified)
- Saved discrepancy popup and red glow logic (simplified)

---

## v0.10.0 — Completed Section, Sort by Status & Bug Fixes
**Date:** March 9, 2026

### Added
- Completed toggle button on each root item and sub-item
- Collapsible "Completed" section at bottom of wishlist
- Root items with sub-items show in expandable dropdown format
- Checking root cascades completion to all sub-items
- Sort by Status option

### Fixed
- ID collision bug (BF-008)
- Undo/redo stale state bug (BF-007)

---

## v0.9.0 — Budget Input Improvements & UI Polish
**Date:** March 8, 2026

### Added
- Budget input in main add form and sub-item add form
- Numbers-only validation on all budget inputs
- Budget cap enforcement on sub-item creation

### Changed
- Dark/light mode toggle changed to slider switch
- Dark mode colors updated for status badges
- Color picker fixed (HSL to hex conversion)
- App container widened to 1400px
- Priority placeholder changed to "Priority"

---

## v0.8.0 — Budget Cap & Auto-Status
**Date:** March 8, 2026

### Added
- Budget cap system for classes
- Budget cap popup on first sub-item addition
- "Don't ask me again" on informational popups
- Auto-derived root status

---

## v0.7.0 — Budget Tracking & Donut Chart
**Date:** March 8, 2026

### Added
- Editable budget on items and sub-items
- RGB color picker for donut chart
- Donut chart with SVG ring segments

---

## v0.6.0 — Status Tracking & Progress Bar
**Date:** March 8, 2026

### Added
- Status dropdowns, color-coded badges, progress bar with gradient and shine

---

## v0.5.0 — Dark Mode, Undo/Redo, Drag & Drop, Confirmation, Bulk Actions
**Date:** March 8, 2026

### Added
- Dark/light mode, undo/redo with shortcuts, drag-drop, delete confirmation, bulk select/delete

---

## v0.4.0 — Date Stamps & Sort Improvements
**Date:** March 8, 2026

### Added
- Date/time stamps, reverse sort toggle, sort by date

---

## v0.3.0 — Priority Dropdown
**Date:** March 8, 2026

### Changed
- Priority input changed to dropdown select (1–10)

---

## v0.2.0 — Search, Sort & Sub-Items
**Date:** March 8, 2026

### Added
- Expandable sub-items, search bar, sort by priority/alpha/date

---

## v0.1.0 — Initial Release
**Date:** March 8, 2026

### Added
- Add/edit/delete items, priority sorting, validation, color badges, minimal UI