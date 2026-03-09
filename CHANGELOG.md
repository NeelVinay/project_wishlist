# Changelog

All notable changes to the Wishlist App are documented here.

---

## v0.9.0 — Budget Input Improvements & UI Polish
**Date:** March 8, 2026

### Added
- Budget input field in the main add form (between item name and priority)
- Budget input field in the sub-item add form
- Dollar sign ($) prefix inside all budget input fields
- Numbers-only validation on all budget inputs (digits and decimal only)
- Budget cap enforcement when adding sub-items with pre-set budgets

### Changed
- Dark/light mode toggle changed from icon button to slider switch
- Dark mode slider uses dark gray background instead of blue
- Status badges and dropdowns use dark gray background in dark mode
- Color picker now displays correct color (fixed HSL to hex conversion)
- "$ budget" label capitalized to "$ Budget"
- App container widened from 1100px to 1400px
- Duplicate chart colors now prevented with error popup

---

## v0.8.0 — Budget Cap & Auto-Status
**Date:** March 8, 2026

### Added
- Budget cap system: root item budget acts as a maximum ceiling for sub-item budget totals
- Budget cap popup appears when adding the first sub-item to a root item
- Budget exceeded warning popup when sub-item budgets would surpass the root cap
- Root budget display shows "allocated / cap" format (e.g. "$120 / $500")
- Clicking root budget opens popup to change the cap
- "Don't ask me again" checkbox on informational budget popups
- Auto-derived root status: root items with sub-items no longer have manual status control
- "In Progress" status (blue badge) shown when sub-items have mixed statuses
- Root status automatically matches sub-items when all share the same status
- "In Progress" excluded from progress bar calculation

---

## v0.7.0 — Budget Tracking & Donut Chart
**Date:** March 8, 2026

### Added
- Editable budget field on root items and sub-items (click to edit, dollar sign prefix)
- Root items with sub-items display the sum of sub-item budgets
- RGB color picker on each root item for donut chart representation
- Random color assigned to new items automatically
- Donut chart (SVG) showing budget breakdown by root item
- Chart legend with item names, dollar amounts, and percentages
- Total budget displayed in center of donut chart

### Changed
- Removed sub-item count and average text from root item display

---

## v0.6.0 — Status Tracking & Progress Bar
**Date:** March 8, 2026

### Added
- Status dropdown on each root item and sub-item: "Want", "Saving For", "Purchased"
- Color-coded status badges (red, orange, green)
- Overall progress bar with gradient coloring (red → yellow → green)
- Progress calculation: Want = 0%, Saving For = 50%, Purchased = 100%
- Animated shine effect on progress bar while in progress
- Status legend below the progress bar

---

## v0.5.0 — Dark Mode, Undo/Redo, Drag & Drop, Delete Confirmation, Bulk Actions
**Date:** March 8, 2026

### Added
- Dark/light mode toggle (moon/sun icon in header)
- All components are dark-mode aware
- Full undo/redo system tracking all item changes
- Keyboard shortcuts: Ctrl+Z (undo), Ctrl+Shift+Z (redo)
- Drag and drop reordering for root items with visual drop indicator
- "Sort: Manual" mode auto-activates on drag
- Confirmation dialog before any delete action
- Delete confirmation shows sub-item count
- Select mode with checkboxes on each item
- Select all / Deselect all toggle
- Bulk delete with confirmation
- Full-page background (no white borders)

---

## v0.4.0 — Date Stamps & Sort Improvements
**Date:** March 8, 2026

### Added
- Date and time stamp on each root item and sub-item
- Ordinal suffix formatting (st, nd, rd, th)
- Reverse sort toggle button with blue highlight when active
- Sort direction label shown below controls
- Sort dropdown simplified to: Priority, Alphabetical, Date Added
- Reverse toggle resets when changing sort modes
- Sub-items follow the same sort mode and direction as root items

---

## v0.3.0 — Priority Dropdown
**Date:** March 8, 2026

### Changed
- Priority input changed from free text to dropdown select (1–10)
- Dropdown used in: add item form, add sub-item form, and edit forms
- Disabled placeholder option shows "1–10" on add forms

---

## v0.2.0 — Search, Sort & Sub-Items
**Date:** March 8, 2026

### Added
- Expandable sub-items under any root item (click ▶ to toggle)
- Sub-items have their own name and priority rating
- Root item displays average priority of its sub-items
- Add, edit, and delete sub-items independently
- Real-time search bar (matches root and sub-item names)
- Search result count ("Showing 3 of 8 items")
- Sort by: Priority, Alphabetical, Newest first, Oldest first
- Timestamp (createdAt) stored on each item for date-based sorting

---

## v0.1.0 — Initial Release
**Date:** March 8, 2026

### Added
- Add items to a wishlist with a name and priority score (1–10)
- Edit item name or priority
- Delete items
- Items sorted by priority (descending), then alphabetically
- Input validation: no empty names, priority must be integer 1–10
- Color-coded priority badges (blue for low, red for high)
- Empty wishlist message
- Clean, minimal UI with Inter font