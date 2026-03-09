# Bug Fixes

All bug fixes for the Wishlist App are documented here.

---

## BF-008 — ID collisions causing cross-item interference
**Date:** March 9, 2026
**Version:** v0.10.0
**Severity:** High

### Problem
The ID generator (`let nextId = 1`) reset when the module re-initialized in React's development strict mode. This caused multiple items to receive the same ID, meaning operations like adding sub-items, toggling completion, or editing would affect the wrong item — particularly noticeable with items sharing the same priority and budget.

### Fix
Changed the ID generator seed from `1` to `Date.now()`, producing large unique starting values (e.g. `1741459200000`). IDs now never collide even if the module re-initializes.

### Files Changed
- `src/App.jsx` — Changed `let nextId = 1` to `let nextId = Date.now()`

---

## BF-007 — Undo/redo hook stale state causing toggle errors
**Date:** March 9, 2026
**Version:** v0.10.0
**Severity:** High

### Problem
The `useUndoRedo` hook's `set` function captured `present` in its closure via the dependency array. When multiple rapid state changes occurred (e.g. toggling completed on items), the second change used a stale version of `present`, causing one item's toggle to incorrectly affect another item.

### Fix
Added a `useRef` (`presentRef`) that always holds the latest value of `present`. The `set` function now reads from `presentRef.current` instead of the closure-captured `present`, ensuring it always operates on the most recent state. The `undo` and `redo` functions were similarly updated.

### Files Changed
- `src/App.jsx` — Rewrote `useUndoRedo` hook to use `useRef` for current state tracking

---

## BF-006 — Sub-item budget can exceed root budget cap on creation
**Date:** March 8, 2026
**Version:** v0.9.0
**Severity:** Medium

### Problem
When adding sub-items with a pre-set budget through the new sub-item budget input, the app did not check whether the new sub-item's budget would push the total past the root item's budget cap. Multiple sub-items could be added with budgets that collectively exceeded the cap.

### Fix
Added budget cap validation in `handleAddSub`. Before creating the sub-item, the function now calculates the current sub-item budget total, adds the new sub-item's budget, and checks against the root's cap. If the total would exceed the cap, the budget exceeded popup appears and the sub-item is not added.

### Files Changed
- `src/App.jsx` — Added cap check logic in `handleAddSub`

---

## BF-005 — Budget inputs accept non-numeric characters
**Date:** March 8, 2026
**Version:** v0.9.0
**Severity:** Low

### Problem
Budget input fields (main add form, sub-item add form, inline edit, and budget cap popup) accepted any characters including letters, dashes, and special characters. Entering values like "5-00" would silently parse to $5 without feedback.

### Fix
Added regex validation (`/^\d*\.?\d{0,2}$/`) on all budget input `onChange` handlers. Inputs now only accept digits and an optional decimal point with up to 2 decimal places. Invalid characters are rejected as the user types.

### Files Changed
- `src/App.jsx` — Updated onChange handlers in main budget input, `BudgetInput` component, and `BudgetCapPopup`

---

## BF-004 — Color picker shows black instead of assigned color
**Date:** March 8, 2026
**Version:** v0.9.0
**Severity:** Low

### Problem
When a new root item was created, it was assigned a random color in HSL format (e.g. `hsl(200, 65%, 55%)`). However, the HTML color picker input (`type="color"`) only accepts hex format. Since it couldn't parse the HSL value, it fell back to displaying black.

### Fix
Rewrote the `randomColor()` function to output hex color codes (e.g. `#3a8fd4`) instead of HSL strings. The function now generates a random hue, converts from HSL to RGB, then formats as a hex string.

### Files Changed
- `src/App.jsx` — Rewrote `randomColor()` function with HSL-to-hex conversion

---

## BF-003 — Root budget can be set below sub-item total
**Date:** March 8, 2026
**Version:** v0.8.1
**Severity:** Medium

### Problem
When editing a root item's budget cap, the user could set it to a value lower than the current total of all sub-item budgets. This created an inconsistent state where sub-items already exceeded the cap.

### Fix
Added validation in the `BudgetCapPopup` component that checks the new budget value against the current sub-item budget total (`minBudget`). If the entered amount is less than the sum of existing sub-item budgets, an inline error message appears: "Budget cannot be lower than $X (current sub-item total)." The save button is blocked until a valid amount is entered.

### Files Changed
- `src/App.jsx` — Added `minBudget` prop to `BudgetCapPopup`, added validation logic and error display

---

## BF-002 — Duplicate colors allowed on donut chart
**Date:** March 8, 2026
**Version:** v0.8.1
**Severity:** Low

### Problem
Multiple root items could be assigned the same chart color via the color picker. This made the donut chart confusing, as visually identical segments could represent different items.

### Fix
Added a duplicate check in `handleColorChange`. When the user picks a color, the app checks if any other root item already uses that exact color (case-insensitive hex comparison). If a conflict is found, a popup appears stating the color is already in use and asks the user to choose a different one. The color change is blocked until a unique color is selected.

### Files Changed
- `src/App.jsx` — Added `colorConflict` state, validation in `handleColorChange`, and conflict popup rendering

---

## BF-001 — Dark mode had purple tint instead of true black
**Date:** March 8, 2026
**Version:** v0.8.1
**Severity:** Low (cosmetic)

### Problem
The dark mode color scheme used purple-tinted backgrounds (`#1e1e2e`, `#2a2a3e`, `#262638`) instead of true dark/black tones, giving the app an unintended purple appearance.

### Fix
Updated all dark mode background colors across the app to use neutral black/dark gray tones: outer background changed to `#0a0a0a`, container to `#111111`, input backgrounds and item rows to `#1a1a1a`, borders to `#222`. Popup backgrounds, progress bar tracks, and donut chart backgrounds were also updated to match the new neutral dark palette.

### Files Changed
- `src/App.jsx` — Updated all dark mode color values in style functions