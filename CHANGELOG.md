# Changelog

All notable changes to the Wishlist App are documented here.

---

## v0.13.0 — Sort by Purchasable, Green Row Highlight & Bug Fixes
**Date:** March 9, 2026

### Added
- Sort by Purchasable option in sort dropdown
- Purchasable sort works on both root items and sub-items within classes
- Sort label: "Ready to buy first" / "Not ready first"
- Light green row background on items where saved >= budget
- Green background in both light mode (#eafaf1) and dark mode (#0a2e0a)

### Changed
- Removed green glow/outline from saved input (row background handles it now)
- Saved input with value 0 now displays "$0 saved" instead of reverting to edit mode

### Fixed
- Saved input rejecting 0 as a valid value (BF-010)

---

## v0.12.0 — Status Removal, Dual Progress Bars & UI Polish
**Date:** March 9, 2026

### Added
- Two switchable progress bars with tab selector (Completion and Savings)
- Completion Progress bar: weighted by item priority (higher priority items contribute more)
- Savings Progress bar: total saved vs total budget across all items, capped at 100%
- Active bar renders in front, inactive bar faded behind at 35% opacity

### Changed
- Classes now display "$X remaining" instead of "$X / $Y" for budget
- Remaining = total budget minus sum of sub-item budgets
- Hover tooltip on class budget shows total budget and allocated amount
- All dashed borders replaced with solid gray borders throughout the app

### Removed
- Status section (Want / Saving For / Purchased) from all items and sub-items
- StatusBadge and StatusSelect components
- "In Progress" auto-derived status logic
- Sort by Status option
- Status display in completed section
- Old single progress bar based on status percentages

---

## v0.11.0 — Savings Tracker
**Date:** March 9, 2026

### Added
- Saved field on each root item and sub-item (to the left of budget)
- Saved input in main add form and sub-item add form with $ prefix
- Root items without sub-items: editable saved amount
- Classes: auto-calculated sum of sub-item saved (not editable)
- Root saved auto-updates when any sub-item saved amount changes
- Displays as "$x saved" format
- Green outline and tooltip when saved matches budget
- Green outline and tooltip when saved exceeds budget
- Popup warning when adding first sub-item to a root that already has a saved amount
- Completed section now shows saved amounts

### Removed
- Savings exceeded popup with update/complete/dismiss options (simplified)
- Saved discrepancy popup and red glow logic (simplified)
- Percentage toggle on saved display (simplified)

---

## v0.10.0 — Completed Section, Sort by Status & Bug Fixes
**Date:** March 9, 2026

### Added
- Completed toggle button on each root item and sub-item
- Collapsible "Completed (n)" section at bottom of wishlist
- Completed items remain in main wishlist; completed section is a mirror view
- Root items with sub-items show in expandable dropdown format in completed section
- Checking a root item cascades completion to all its sub-items
- Checking the last sub-item auto-completes the root item
- Sort by Status option (Want → Saving For → In Progress → Purchased)

### Fixed
- ID collision bug causing operations on one item to affect another (BF-008)
- Undo/redo hook using stale state causing toggle to affect wrong items (BF-007)

---

## v0.9.0 — Budget Input Improvements & UI Polish
**Date:** March 8, 2026

### Added
- Budget input field in the main add form
- Budget input field in the sub-item add form
- Dollar sign ($) prefix inside all budget input fields
- Numbers-only validation on all budget inputs
- Budget cap enforcement when adding sub-items with pre-set budgets

### Changed
- Dark/light mode toggle changed from icon button to slider switch
- Dark mode slider uses dark gray background
- Status badges and dropdowns use dark gray background in dark mode
- Color picker now displays correct color (fixed HSL to hex conversion)
- "$ budget" label capitalized to "$ Budget"
- App container widened from 1100px to 1400px
- Duplicate chart colors prevented with error popup
- Priority dropdown placeholder changed from "1-10" to "Priority"

---

## v0.8.0 — Budget Cap & Auto-Status
**Date:** March 8, 2026

### Added
- Budget cap system: root item budget acts as maximum ceiling for sub-item totals
- Budget cap popup appears when adding first sub-item
- Budget exceeded warning popup
- "Don't ask me again" checkbox on informational popups
- Auto-derived root status when sub-items exist
- "In Progress" status for mixed sub-item statuses

---

## v0.7.0 — Budget Tracking & Donut Chart
**Date:** March 8, 2026

### Added
- Editable budget field on root items and sub-items
- RGB color picker on each root item for donut chart
- Random color assigned to new items automatically
- Donut chart (SVG) showing budget breakdown by root item
- Chart legend with item names, dollar amounts, and percentages

### Changed
- Removed sub-item count and average text from root item display

---

## v0.6.0 — Status Tracking & Progress Bar
**Date:** March 8, 2026

### Added
- Status dropdown on each item: "Want", "Saving For", "Purchased"
- Color-coded status badges
- Overall progress bar with gradient coloring
- Animated shine effect on progress bar

---

## v0.5.0 — Dark Mode, Undo/Redo, Drag & Drop, Delete Confirmation, Bulk Actions
**Date:** March 8, 2026

### Added
- Dark/light mode toggle
- Full undo/redo system with keyboard shortcuts
- Drag and drop reordering with visual indicator
- Confirmation dialog before any delete action
- Select mode with bulk delete

---

## v0.4.0 — Date Stamps & Sort Improvements
**Date:** March 8, 2026

### Added
- Date and time stamps on all items
- Reverse sort toggle button
- Sort by Date Added option

---

## v0.3.0 — Priority Dropdown
**Date:** March 8, 2026

### Changed
- Priority input changed from free text to dropdown select (1–10)

---

## v0.2.0 — Search, Sort & Sub-Items
**Date:** March 8, 2026

### Added
- Expandable sub-items under any root item
- Real-time search bar
- Sort by Priority, Alphabetical, Date Added

---

## v0.1.0 — Initial Release
**Date:** March 8, 2026

### Added
- Add items with name and priority (1–10)
- Edit, delete items
- Priority-based sorting
- Input validation
- Color-coded priority badges
- Clean, minimal UI