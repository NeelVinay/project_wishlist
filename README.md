# Wishlist App

A personal wishlist manager built with React + Vite. Add items, organize them with sub-categories (classes), rate their priority, track your spending with budget caps and savings, and monitor your progress with weighted completion and savings progress bars. Features interactive donut chart visualization, a 3D Voronoi sphere budget visualization, localStorage persistence, multi-currency support, and a completed items section.

---

## What It Does

This app lets you create and manage a prioritized wishlist. Each item has a name, a priority rating (1–10), a budget, a saved amount, and can contain sub-items (classes) with their own ratings, budgets, and savings. Root items act as budget caps for their sub-items, and root saved amounts auto-calculate from sub-item totals. Items are searchable, sortable (including by purchasability), and timestamped. Two switchable progress bars track completion (weighted by priority) and savings. An interactive donut chart with hover details visualizes budget breakdown. Supports 38 currencies.

---

## Implemented Features

### Core
- [x] Add items to a wishlist with a name, priority (1–10), saved amount, and budget
- [x] Edit an item's name or priority
- [x] Delete items from the wishlist
- [x] Input validation (no empty names, priority must be 1–10, budget/saved accept numbers only)
- [x] Empty wishlist message

### Sub-Items (Classes)
- [x] Expandable sub-items under any root item (click ▶ to toggle)
- [x] Sub-items have their own name, priority, budget, and saved amount
- [x] Root item displays the average priority of its sub-items
- [x] Budget and saved inputs included in sub-item add form

### Search & Sort
- [x] Real-time search bar (matches root and sub-item names)
- [x] Search result count ("Showing 3 of 8 items")
- [x] Sort by: Priority, Alphabetical, Date Added, Purchasable, Manual
- [x] Sort by Purchasable works on both root items and sub-items within classes
- [x] Reverse sort toggle button with visual indicator
- [x] Sub-items follow the same sort mode as root items

### UI & Visual
- [x] Priority input as a dropdown select (1–10) with "Priority" placeholder
- [x] Date and time stamp on each root item and sub-item
- [x] Color-coded priority badges (blue for low, red for high)
- [x] Full-width responsive layout (1400px max)
- [x] Dark/light mode slider toggle
- [x] True black dark mode theme
- [x] Solid borders throughout
- [x] Purchasable items (saved >= budget) highlighted with light green row background
- [x] Green background works on both root items and sub-items
- [x] Tooltips on saved field: "matches budget" vs "exceeds budget"

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

### Completed Section
- [x] Clickable "completed" button on each item/sub-item
- [x] Collapsible "Completed" section at the bottom of the wishlist
- [x] Completed items remain in the main wishlist (not removed)
- [x] Completed section mirrors completed items for quick reference
- [x] Sub-items appear in completed section individually as marked done
- [x] Root item appears in completed section only when all sub-items are completed
- [x] Checking root item cascades completion to all sub-items
- [x] Checking last sub-item auto-completes the root item
- [x] Unchecking a sub-item auto-uncompletes the root item
- [x] Completed root items with sub-items show in expandable dropdown format

### Progress Bars
- [x] Two switchable progress bars with tab selector
- [x] Completion Progress: weighted by item priority (higher priority = more weight)
- [x] Savings Progress: total saved vs total budget across all items
- [x] Active bar renders in front, inactive bar faded behind at 35% opacity
- [x] Gradient color (red → yellow → green) with animated shine effect
- [x] Savings bar capped at 100%

### Savings Tracker
- [x] Saved field on each item and sub-item (to the left of budget)
- [x] Root items without sub-items: editable saved amount
- [x] Classes: auto-calculated sum of sub-item saved amounts (not editable)
- [x] Sub-items: individually editable saved amounts
- [x] Displays as "$x saved" format
- [x] Saved input in main add form and sub-item add form
- [x] Numbers-only validation on saved inputs
- [x] Green row background when saved matches or exceeds budget
- [x] Popup warning when adding first sub-item to root with existing saved amount
- [x] Root saved auto-updates when sub-item saved amounts change
- [x] Zero is a valid saved amount (distinct from "not set")

### Budget Tracking
- [x] Budget input in main add form (with currency prefix, numbers only)
- [x] Budget input in sub-item add form (with currency prefix, numbers only)
- [x] Editable budget on root items (without sub-items) and all sub-items
- [x] Budget cap system: root item budget acts as ceiling for sub-item totals
- [x] Classes display "$X remaining" (total budget minus allocated sub-item budgets)
- [x] Budget cap popup on first sub-item addition
- [x] Budget exceeded warning when sub-items would surpass the cap
- [x] Budget validation on sub-item creation (prevents exceeding cap at add time)
- [x] Budget cap cannot be set below current sub-item total
- [x] Clickable budget display to change the cap
- [x] "Don't ask me again" option on informational popups
- [x] RGB color picker on each root item for donut chart representation
- [x] Color picker displays correct color (hex format)
- [x] Duplicate colors prevented across root items

### Interactive Donut Chart
- [x] Donut chart showing budget breakdown by root item (color-coded)
- [x] Total budget displayed in center of donut chart
- [x] Hover-to-expand ring segments with smooth animation
- [x] Non-hovered segments fade to 15% opacity
- [x] Precise arc-path hit detection (only donut ring area is hoverable)
- [x] Info panel to the right of donut with border, background, and shadow
- [x] Info panel shows item name, color, budget, share %, saved amount
- [x] Classes show sub-items with individual budget and percentage contribution
- [x] Info panel animates in with opacity and slide transition
- [x] "Hover over a segment to see details" placeholder when not hovering

### localStorage Persistence
- [x] Wishlist items persist across page refreshes via localStorage
- [x] Currency selection persists
- [x] User preferences (e.g., "don't ask budget cap") persist
- [x] Graceful fallback on corrupted or missing data
- [x] Centralized storage utility for easy future database migration

### 3D Voronoi Sphere Visualization
- [x] Interactive 3D sphere on the Data Visualization page (`/visualize`)
- [x] Sphere divided into organic Voronoi-like cells (cracked-earth aesthetic)
- [x] Cell area proportional to each item's budget share
- [x] Hover: cell pulls out radially from sphere with name label
- [x] Click: isolates cell, shows detail overlay (budget, share %, saved, sub-items)
- [x] Click elsewhere to deselect with smooth animation
- [x] Rotate (drag) and zoom (scroll) controls
- [x] Slightly transparent materials for depth effect
- [x] Solid cell geometry with visible cross-section on hover
- [x] Exploded view toggle with auto-rotation
- [x] Space starfield background — 2,500 twinkling stars at varying depths (custom GLSL shaders)

### Multi-Currency Support (Level 1)
- [x] 38 currencies with code, symbol, name, country, and decimal places
- [x] Searchable currency selector (search by code, name, country, or symbol)
- [x] Dropdown appears as user types with filtered results
- [x] Aligned columns in dropdown (symbol, code, description)
- [x] Dynamic currency symbol throughout the entire app
- [x] Currency-aware number formatting (respects decimal places per currency)
- [x] Default currency: USD

---

## Upcoming Features

### Multi-Currency Support (Level 2)
- [ ] Per-item currency override (optional currency field on each item/sub-item)
- [ ] Exchange rate API integration (free tier)
- [ ] Automatic conversion when items have different currencies
- [ ] Prompt user to pick universal display currency for data visualizations
- [ ] Base currency storage with display conversion
- [ ] Exchange rate caching

### Progress Bar Animation
- [ ] Stacked/rotating card animation for switching between progress bars
- [ ] Smooth flip/slide transition on click

### Multi-Page Routing
- [ ] React Router implementation with navigation bar
- [ ] Landing page with feature overview and "Get Started" CTA
- [ ] Main wishlist page (current app)
- [ ] Data visualization page

### Goals System
- [ ] User-defined targets (hit X% completion by a date, buy X items, save $X for an item)
- [ ] Goal progress tracking with deadlines
- [ ] Goal completion notifications

### Advanced Data Visualizations Page
- [x] 3D rotatable sphere visualization (Three.js + React Three Fiber)
- [x] Sphere sectors sized by monetary value (Voronoi cells)
- [x] Exploded view toggle with auto-rotation
- [ ] Selectable geometry styles (Voronoi, curved triangles, hex grid, spiral bands)
- [ ] Visual themes (default colors, Earth, Star Wars/Coruscant)
- [ ] Multiple chart types (bar, treemap, bubble chart, etc.)

### Wishlist Village (Gamification)
- [ ] Stardew Valley-style 2D pixel art village
- [ ] Each house represents a wishlist item
- [ ] House construction state reflects item completion
- [ ] Controllable character with walking animations
- [ ] NPC town members with building/living animations
- [ ] Enter completed houses to view sub-items as sprites
- [ ] Earned currency for visual house upgrades
- [ ] Selectable village themes

### Login & Authorization System
- [ ] User accounts with secure authentication (JWT or session-based)
- [ ] Persistent user profiles tied to wishlist data
- [ ] Notification system for goal milestones (e.g. "You're 80% to your savings goal!")
- [ ] Email or push notifications for deadlines and achievements
- [ ] Per-user data isolation (each user sees only their own wishlist)

### Space World Visualization (Gamification)
- [ ] No Man's Sky-style 3D space environment (Three.js)
- [ ] User controls a spaceship with first-person or third-person flight
- [ ] Lightspeed travel between root items (planets)
- [ ] Each planet represents a root wishlist item, sized/styled by budget or priority
- [ ] Hovering over a planet reveals sub-items as orbiting moons or surface markers
- [ ] Procedurally generated star fields, nebulae, and planet textures
- [ ] Planet appearance reflects completion state (e.g. vibrant vs barren)
- [ ] Smooth hyperdrive/warp animation when jumping between planets

### Persistence
- [x] localStorage persistence (current — items, currency, preferences)
- [ ] Database backend (Express.js + SQLite)
- [ ] Data abstraction layer for easy storage swap

---

## Tech Stack

- **Frontend:** React 19
- **Build Tool:** Vite
- **Routing:** React Router v6
- **Styling:** Inline styles (no external CSS libraries)
- **3D Visualization:** Three.js, React Three Fiber, drei
- **Persistence:** localStorage (current), database planned (Express.js + SQLite)
- **Auth:** Planned — JWT or session-based
- **Planned Libraries:** Phaser.js, D3.js

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
├── index.html
├── package.json
├── vite.config.js
├── src/
│   ├── main.jsx                    # React entry point
│   ├── App.jsx                     # Router + NavBar
│   ├── styles.js                   # Shared style functions + ACCENT color
│   ├── constants/
│   │   └── currencies.js           # 38 currencies
│   ├── utils/
│   │   ├── storage.js              # localStorage persistence
│   │   ├── calculations.js         # Budget/progress calculations
│   │   ├── formatting.js           # Currency formatting
│   │   ├── sorting.js              # Sort functions
│   │   └── ids.js                  # ID generation
│   ├── hooks/
│   │   └── useUndoRedo.js          # Undo/redo with persist callback
│   ├── pages/
│   │   ├── LandingPage.jsx         # Home page
│   │   ├── WishlistApp.jsx         # Main wishlist (stateful)
│   │   ├── DataVizPage.jsx         # 3D sphere visualization
│   │   └── AboutPage.jsx           # About page
│   └── components/
│       ├── sphere/
│       │   ├── VoronoiGeometry.js   # Voronoi cell computation
│       │   ├── SphereCell.jsx       # Individual cell mesh + interactions
│       │   ├── BudgetSphere.jsx     # Root 3D component
│       │   └── WedgeDetail.jsx      # Click detail overlay
│       ├── popups/                  # Popup components
│       ├── DonutChart.jsx           # SVG donut chart
│       ├── ProgressSection.jsx      # Progress bars
│       ├── WItem.jsx                # Wishlist item row
│       └── ...                      # Other UI components
├── README.md
├── CHANGELOG.md
└── BUGFIXES.md
```