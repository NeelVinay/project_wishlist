# Wishlist App

A personal wishlist manager built with React + Vite. Add items, organize them with sub-categories, rate their priority, track your spending with budget caps, and monitor your progress toward getting everything you want.

---

## What It Does

This app lets you create and manage a prioritized wishlist. Each item has a name, a priority rating (1–10), a budget, a status, and can contain sub-items with their own ratings and budgets. Root items act as budget caps for their sub-items, and their status is automatically derived from the sub-items beneath them. Items are searchable, sortable, and timestamped. A progress bar tracks your overall completion, and a donut chart visualizes your budget breakdown.

---

## Implemented Features

### Core
- [x] Add items to a wishlist with a name, priority (1–10), and budget
- [x] Edit an item's name or priority
- [x] Delete items from the wishlist
- [x] Input validation (no empty names, priority must be 1–10, budget accepts numbers only)
- [x] Empty wishlist message

### Sub-Items
- [x] Expandable sub-items under any root item (click ▶ to toggle)
- [x] Sub-items have their own name, priority, budget, and status
- [x] Root item displays the average priority of its sub-items
- [x] Budget input included in sub-item add form

### Search & Sort
- [x] Real-time search bar (matches root and sub-item names)
- [x] Search result count ("Showing 3 of 8 items")
- [x] Sort by: Priority, Alphabetical, Date Added, Manual
- [x] Reverse sort toggle button with visual indicator
- [x] Sub-items follow the same sort mode as root items

### UI & Input
- [x] Priority input as a dropdown select (1–10) with "Priority" placeholder
- [x] Date and time stamp on each root item and sub-item
- [x] Color-coded priority badges (blue for low, red for high)
- [x] Full-width responsive layout (1400px max)
- [x] Dark/light mode slider toggle
- [x] True black dark mode theme
- [x] Dark-mode-aware status badges and dropdowns

### Drag & Drop
- [x] Drag and drop reordering for root items
- [x] Visual drop indicator (blue highlight)
- [x] Auto-switches to Manual sort mode on drag

### Undo/Redo
- [x] Full undo/redo system for all actions
- [x] Keyboard shortcuts: Ctrl+Z (undo), Ctrl+Shift+Z (redo)
- [x] Visual indicators for undo/redo availability

### Safety
- [x] Confirmation dialog before deleting any item or sub-item
- [x] Confirmation dialog for bulk delete operations
- [x] Shows sub-item count in delete confirmation

### Bulk Actions
- [x] Select mode with checkboxes on each item
- [x] Select all / Deselect all
- [x] Bulk delete with confirmation
- [x] Cancel to exit select mode

### Status Tracking
- [x] Status field on each item and sub-item: "Want", "Saving For", "Purchased"
- [x] Color-coded status badges (red, orange, green)
- [x] Auto-derived root status when sub-items exist
- [x] "In Progress" status shown when sub-items have mixed statuses
- [x] Manual status control for root items without sub-items

### Progress Bar
- [x] Overall progress bar across the entire wishlist
- [x] Progress calculation: Want = 0%, Saving For = 50%, Purchased = 100%
- [x] Single bar representing the average progress of all items/sub-items
- [x] Gradient color (red → yellow → green) with animated shine effect
- [x] "In Progress" status excluded from progress calculation

### Budget Tracking
- [x] Budget input in main add form (with $ prefix, numbers only)
- [x] Budget input in sub-item add form (with $ prefix, numbers only)
- [x] Editable budget on root items (without sub-items) and all sub-items
- [x] Budget cap system: root item budget acts as ceiling for sub-item totals
- [x] Budget cap popup on first sub-item addition
- [x] Budget exceeded warning when sub-items would surpass the cap
- [x] Budget validation on sub-item creation (prevents exceeding cap at add time)
- [x] Budget cap cannot be set below current sub-item total
- [x] Clickable root budget display showing allocated / cap amounts
- [x] "Don't ask me again" option on informational popups
- [x] RGB color picker on each root item for donut chart representation
- [x] Color picker displays correct color (hex format)
- [x] Duplicate colors prevented across root items
- [x] Donut chart showing budget breakdown by root item (color-coded)
- [x] Total budget displayed in center of donut chart
- [x] Legend with item names, amounts, and percentages

---

## Upcoming Features

### Completed Section
- [x] Clickable "completed" button on each item/sub-item (to the right of status)
- [x] Collapsible "Completed" section at the bottom of the wishlist
- [x] Completed items remain in the main wishlist (not removed)
- [x] Completed section mirrors completed items for quick reference
- [x] Sub-items appear in completed section individually as marked done
- [x] Root item appears in completed section only when all sub-items are completed
- [x] Checking root item cascades completion to all sub-items
- [x] Checking last sub-item auto-completes the root item
- [x] Unchecking a sub-item auto-uncompletes the root item
- [x] Completed root items with sub-items show in expandable dropdown format

### Sort by Status
- [x] New sort option: sort by status (Want → Saving For → In Progress → Purchased)
- [x] Reversible with existing toggle (Purchased → In Progress → Saving For → Want)

### Multi-Page Routing
- [ ] React Router implementation with navigation bar
- [ ] Landing page with feature overview and "Get Started" CTA
- [ ] Main wishlist page (current app)
- [ ] Data visualization page

### Goals System
- [ ] User-defined targets (hit X% completion by a date, buy X items, save $X for an item)
- [ ] Goal progress tracking with deadlines
- [ ] Goal completion notifications

### Savings Tracker
- [ ] "Saved" field on each item/sub-item alongside budget
- [ ] Display format: "$120 / $500 saved"
- [ ] Savings progress comparison against required budget

### Interactive Donut Chart
- [ ] Hover-to-expand ring segments (replaces static legend)
- [ ] Tooltip/card showing item name, sub-items, and budget on hover
- [ ] Animated segment expansion

### Multi-Currency Support
- [ ] Currency selector with search bar
- [ ] Dynamic currency symbol swapping throughout the app
- [ ] Exchange rate fetching (free API)
- [ ] Base currency storage with display conversion

### Advanced Data Visualizations Page
- [ ] Multiple chart types (bar, treemap, bubble chart, etc.)
- [ ] 3D rotatable sphere visualization (Three.js)
- [ ] Sphere sectors sized by monetary value
- [ ] Exploded view on sector click showing sub-items

### Wishlist Village (Gamification)
- [ ] Stardew Valley-style 2D pixel art village
- [ ] Each house represents a wishlist item
- [ ] House construction state reflects item completion (not built / under construction / finished)
- [ ] Controllable character with walking animations
- [ ] NPC town members with building/living animations
- [ ] Enter completed houses to view sub-items as sprites
- [ ] Earned currency for visual house upgrades
- [ ] Selectable village themes

### Persistence
- [ ] Database backend (Express.js + SQLite)
- [ ] Data abstraction layer for easy storage swap
- [ ] Data persists across page refreshes and browser restarts

---

## Tech Stack

- **Frontend:** React 18
- **Build Tool:** Vite
- **Styling:** Inline styles (no external CSS libraries)
- **Persistence:** Database (planned — Express.js + SQLite)
- **Planned Libraries:** React Router, Three.js, Phaser.js, D3.js

---

## How to Run Locally

1. Make sure you have [Node.js](https://nodejs.org) installed (v18+)
2. Clone or download the project
3. In your terminal:
   ```bash
   cd wishlist
   npm install
   npm run dev
   ```
4. Open http://localhost:5173 in your browser

---

## Project Structure

```
wishlist/
├── index.html          # Entry HTML file
├── package.json        # Dependencies and scripts
├── vite.config.js      # Vite configuration
├── src/
│   ├── main.jsx        # React entry point
│   ├── App.jsx         # Main wishlist application (all components)
│   ├── App.css         # (empty - styles are inline)
│   └── index.css       # Minimal body reset
├── README.md           # This file
├── CHANGELOG.md        # Version history
└── BUGFIXES.md         # Bug fix documentation
```

*Structure will expand significantly as routing, visualizations, and gamification are added.*