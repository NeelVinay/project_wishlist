# Bug Fixes

All bug fixes for the Wishlist App are documented here.

---

## BF-010 — Saved input rejects 0 as valid value
**Date:** March 9, 2026
**Version:** v0.13.0
**Severity:** Medium

### Problem
When a user entered 0 as the saved amount for a root item or class, the input reverted back to the editable "Saved" button instead of displaying "$0 saved". The value 0 was treated the same as "not set".

### Fix
Changed the commit function to distinguish between an empty string (stores `null`, meaning "never set") and the value `0` (stores `0`, a valid amount). Updated the display logic to use a `hasValue` check (`value !== null && value !== undefined`) instead of checking `value > 0`.

### Files Changed
- `src/App.jsx` — Updated `SavedInput` commit function and display logic

---

## BF-009 — Saved tooltip says "exceeds" when saved equals budget
**Date:** March 9, 2026
**Version:** v0.11.0
**Severity:** Low (cosmetic)

### Problem
When a sub-item or root item's saved amount exactly matched the budget, the tooltip incorrectly displayed "Amount saved exceeds budget!" instead of indicating a match.

### Fix
Split the check into two conditions: `saved > budget` triggers "exceeds" tooltip, `saved === budget` triggers "matches" tooltip. Both show the green outline, but with accurate messaging.

### Files Changed
- `src/App.jsx` — Added `savedMatchesBudget` check in `SavedInput`, updated tooltip text

---

## BF-008 — ID collisions causing cross-item interference
**Date:** March 9, 2026
**Version:** v0.10.0
**Severity:** High

### Problem
The ID generator (`let nextId = 1`) reset when the module re-initialized in React's development strict mode. This caused multiple items to receive the same ID, meaning operations like adding sub-items, toggling completion, or editing would affect the wrong item.

### Fix
Changed the ID generator seed from `1` to `Date.now()`, producing large unique starting values. IDs now never collide even if the module re-initializes.

### Files Changed
- `src/App.jsx` — Changed `let nextId = 1` to `let nextId = Date.now()`

---

## BF-007 — Undo/redo hook stale state causing toggle errors
**Date:** March 9, 2026
**Version:** v0.10.0
**Severity:** High

### Problem
The `useUndoRedo` hook's `set` function captured `present` in its closure. When multiple rapid state changes occurred, the second change used a stale version of `present`, causing one item's toggle to incorrectly affect another.

### Fix
Added a `useRef` (`presentRef`) that always holds the latest value of `present`. The `set`, `undo`, and `redo` functions now read from `presentRef.current`.

### Files Changed
- `src/App.jsx` — Rewrote `useUndoRedo` hook to use `useRef`

---

## BF-006 — Sub-item budget can exceed root budget cap on creation
**Date:** March 8, 2026
**Version:** v0.9.0
**Severity:** Medium

### Problem
When adding sub-items with a pre-set budget, the app did not check whether the new sub-item's budget would push the total past the root item's budget cap.

### Fix
Added budget cap validation in `handleAddSub` before creating the sub-item.

### Files Changed
- `src/App.jsx` — Added cap check logic in `handleAddSub`

---

## BF-005 — Budget inputs accept non-numeric characters
**Date:** March 8, 2026
**Version:** v0.9.0
**Severity:** Low

### Problem
Budget input fields accepted any characters including letters and dashes.

### Fix
Added regex validation (`/^\d*\.?\d{0,2}$/`) on all budget input `onChange` handlers.

### Files Changed
- `src/App.jsx` — Updated onChange handlers in all budget inputs

---

## BF-004 — Color picker shows black instead of assigned color
**Date:** March 8, 2026
**Version:** v0.9.0
**Severity:** Low

### Problem
`randomColor()` generated HSL format but the color picker only accepts hex format, falling back to black.

### Fix
Rewrote `randomColor()` to output hex color codes with HSL-to-hex conversion.

### Files Changed
- `src/App.jsx` — Rewrote `randomColor()` function

---

## BF-003 — Root budget can be set below sub-item total
**Date:** March 8, 2026
**Version:** v0.8.1
**Severity:** Medium

### Problem
When editing a root item's budget cap, the user could set it below the current sub-item budget total.

### Fix
Added `minBudget` validation in `BudgetCapPopup` with inline error message.

### Files Changed
- `src/App.jsx` — Added `minBudget` prop and validation to `BudgetCapPopup`

---

## BF-002 — Duplicate colors allowed on donut chart
**Date:** March 8, 2026
**Version:** v0.8.1
**Severity:** Low

### Problem
Multiple root items could be assigned the same chart color, making the donut chart confusing.

### Fix
Added duplicate check in `handleColorChange` with conflict popup.

### Files Changed
- `src/App.jsx` — Added `colorConflict` state and validation

---

## BF-001 — Dark mode had purple tint instead of true black
**Date:** March 8, 2026
**Version:** v0.8.1
**Severity:** Low (cosmetic)

### Problem
Dark mode used purple-tinted backgrounds instead of true dark/black tones.

### Fix
Updated all dark mode colors to neutral black/dark gray tones.

### Files Changed
- `src/App.jsx` — Updated all dark mode color values