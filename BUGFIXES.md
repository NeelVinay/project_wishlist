# Bug Fixes

All bug fixes for the Wishlist App are documented here.

---

## BF-016 — Save functions silently succeed on server errors
**Date:** March 11, 2026
**Version:** v0.20.0
**Severity:** High

### Problem
`saveItems`, `saveCurrencyCode`, and `savePref` in the async fetch-based `storage.js` awaited `fetch()` but never checked `res.ok`. If the Express server returned an error (e.g., 502 from Vite proxy during startup), the save appeared to succeed without actually persisting data. Items added in WishlistApp would not appear on the DataVizPage after navigation.

### Fix
Added `res.ok` checks to all three save functions. Non-OK responses now log warnings with the status code. Error messages in catch blocks now include `err.message` for better diagnostics.

### Files Changed
- `src/utils/storage.js` — Added `res.ok` checks and improved error logging in all save functions

---

## BF-015 — Save effects overwrite database values on mount
**Date:** March 11, 2026
**Version:** v0.20.0
**Severity:** High

### Problem
The `useEffect` hooks for `saveCurrencyCode` and `savePref` in WishlistApp fired immediately on component mount with default values (USD, false), racing with the async data load from the API. If the save completed before the load, the database values were overwritten with defaults.

### Fix
Added `!loading` guard to both save effects. They now only fire after the initial async load completes and `loading` is set to `false`. Added `loading` to the dependency arrays.

### Files Changed
- `src/pages/WishlistApp.jsx` — Guarded currency and preference save effects with `!loading` check

---

## BF-014 — Custom size attribute ignored by pointsMaterial
**Date:** March 11, 2026
**Version:** v0.18.0
**Severity:** Medium

### Problem
The initial `Starfield` implementation used `<pointsMaterial>` with a fixed `size` prop alongside a per-vertex `size` buffer attribute. `pointsMaterial` does not read custom vertex attributes, so all stars rendered at the same size regardless of depth, removing the parallax depth effect.

### Fix
Replaced `pointsMaterial` with a `ShaderMaterial` using a custom vertex shader that reads the `size` attribute directly via `gl_PointSize = size * (200.0 / -mvPos.z)` and applies correct perspective attenuation. The fragment shader draws soft circular points using `smoothstep` on `gl_PointCoord` distance.

### Files Changed
- `src/components/sphere/Starfield.jsx` — Replaced pointsMaterial with custom ShaderMaterial

---

## BF-013 — Voronoi geometry crash on non-indexed IcosahedronGeometry
**Date:** March 11, 2026
**Version:** v0.17.0
**Severity:** Critical

### Problem
Three.js `IcosahedronGeometry` creates non-indexed geometry where `getIndex()` returns `null`. The initial Voronoi cell implementation assumed indexed geometry, causing `null.count` to crash and render a blank white screen.

### Fix
Added `faceVertexIndex()` helper that handles both indexed and non-indexed geometry. Changed edge map keys from vertex indices (which aren't shared in non-indexed geo) to position-based string keys so shared edges between adjacent faces are properly detected.

### Files Changed
- `src/components/sphere/VoronoiGeometry.js` — Added null-safe index handling and position-based edge keys

---

## BF-012 — Wedge geometry mergeGeometries fails on mismatched attributes
**Date:** March 11, 2026
**Version:** v0.17.0
**Severity:** High

### Problem
The initial wedge-based sphere sectors used `mergeGeometries` to combine the outer SphereGeometry (which has UV attributes) with manually-created side panels (which only have position attributes). This attribute mismatch caused `mergeGeometries` to fail silently, producing invisible meshes and a black screen.

### Fix
Split each wedge into three separate meshes rendered in a group (later replaced entirely by Voronoi cell geometry which builds a single non-indexed BufferGeometry).

### Files Changed
- `src/components/sphere/WedgeGeometry.js` — Separated into individual geometry functions (later replaced by VoronoiGeometry.js)
- `src/components/sphere/SphereWedge.jsx` — Rendered three separate meshes (later replaced by SphereCell.jsx)

---

## BF-011 — Donut chart layout shift, oversized hitbox, missing info panel styling
**Date:** March 9, 2026
**Version:** v0.15.0
**Severity:** Medium

### Problem
Four issues with the donut chart: (1) Hovering over a segment caused the entire donut to shift right because the enlarged stroke overflowed the SVG viewBox. (2) The hit detection area extended into the center hole and outside the donut ring, triggering hover in empty space. (3) The info panel had no visible border/outline, appearing to float. (4) The info panel appeared abruptly with no animation.

### Fix
Full rewrite of DonutChart component. Added padding to SVG viewBox so enlarged strokes stay within bounds. Replaced circle-stroke hit areas with precise arc `<path>` elements that trace the exact inner and outer boundaries of each segment. Info panel now has a solid border, background color, border-radius, and box-shadow. Panel transitions between states using CSS opacity (0.5 to 1) and transform (translateY 6px to 0) over 0.4s. Fixed-width containers for both donut and panel prevent layout reflow.

### Files Changed
- `src/App.jsx` — Complete rewrite of DonutChart with arc-path hit detection, padded viewBox, styled info panel with transitions

---

## BF-010 — Saved input rejects 0 as valid value
**Date:** March 9, 2026
**Version:** v0.13.0
**Severity:** Medium

### Problem
When a user entered 0 as the saved amount, the input reverted to the "Saved" button instead of displaying "$0 saved".

### Fix
Changed commit function to distinguish between empty string (stores null) and value 0 (stores 0). Updated display logic to use `hasValue` check instead of `value > 0`.

### Files Changed
- `src/App.jsx` — Updated SavedInput commit function and display logic

---

## BF-009 — Saved tooltip says "exceeds" when saved equals budget
**Date:** March 9, 2026
**Version:** v0.11.0
**Severity:** Low (cosmetic)

### Problem
When saved exactly matched budget, tooltip said "exceeds" instead of "matches".

### Fix
Split into two conditions: `saved > budget` shows "exceeds", `saved === budget` shows "matches".

### Files Changed
- `src/App.jsx` — Added separate match/exceed checks in SavedInput

---

## BF-008 — ID collisions causing cross-item interference
**Date:** March 9, 2026
**Version:** v0.10.0
**Severity:** High

### Problem
ID generator reset on module re-initialization in React strict mode, causing duplicate IDs and cross-item interference.

### Fix
Changed seed from `1` to `Date.now()` for guaranteed unique IDs.

### Files Changed
- `src/App.jsx` — Changed `let nextId = 1` to `let nextId = Date.now()`

---

## BF-007 — Undo/redo hook stale state causing toggle errors
**Date:** March 9, 2026
**Version:** v0.10.0
**Severity:** High

### Problem
The useUndoRedo hook captured stale `present` in closures, causing rapid toggles to affect wrong items.

### Fix
Added `useRef` to always read latest state value.

### Files Changed
- `src/App.jsx` — Rewrote useUndoRedo with useRef

---

## BF-006 — Sub-item budget can exceed root budget cap on creation
**Date:** March 8, 2026
**Version:** v0.9.0
**Severity:** Medium

### Problem
Adding sub-items with pre-set budgets didn't check against the root's budget cap.

### Fix
Added cap validation in handleAddSub before creating sub-item.

### Files Changed
- `src/App.jsx` — Added cap check in handleAddSub

---

## BF-005 — Budget inputs accept non-numeric characters
**Date:** March 8, 2026
**Version:** v0.9.0
**Severity:** Low

### Problem
Budget fields accepted letters, dashes, and special characters.

### Fix
Added regex validation on all budget input onChange handlers.

### Files Changed
- `src/App.jsx` — Updated onChange handlers with numeric regex

---

## BF-004 — Color picker shows black instead of assigned color
**Date:** March 8, 2026
**Version:** v0.9.0
**Severity:** Low

### Problem
randomColor() generated HSL format but color picker only accepts hex.

### Fix
Rewrote randomColor() to output hex codes.

### Files Changed
- `src/App.jsx` — HSL-to-hex conversion in randomColor()

---

## BF-003 — Root budget can be set below sub-item total
**Date:** March 8, 2026
**Version:** v0.8.1
**Severity:** Medium

### Problem
Budget cap could be set below existing sub-item total.

### Fix
Added minBudget validation in BudgetCapPopup.

### Files Changed
- `src/App.jsx` — Added minBudget prop and validation

---

## BF-002 — Duplicate colors allowed on donut chart
**Date:** March 8, 2026
**Version:** v0.8.1
**Severity:** Low

### Problem
Multiple root items could share the same chart color.

### Fix
Added duplicate check with conflict popup.

### Files Changed
- `src/App.jsx` — Added colorConflict state and validation

---

## BF-001 — Dark mode had purple tint instead of true black
**Date:** March 8, 2026
**Version:** v0.8.1
**Severity:** Low (cosmetic)

### Problem
Dark mode used purple-tinted backgrounds.

### Fix
Updated all dark mode colors to neutral black/gray tones.

### Files Changed
- `src/App.jsx` — Updated all dark mode color values