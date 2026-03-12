import Database from "better-sqlite3";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const DB_PATH = process.env.DB_PATH || join(__dirname, "..", "wishlist.db");

const db = new Database(DB_PATH);
db.pragma("journal_mode = WAL");
db.pragma("foreign_keys = ON");

// Create tables immediately so prepared statements can be compiled
db.exec(`
  CREATE TABLE IF NOT EXISTS items (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    priority INTEGER NOT NULL DEFAULT 5,
    budget REAL DEFAULT 0,
    saved REAL DEFAULT 0,
    chart_color TEXT,
    completed INTEGER DEFAULT 0,
    created_at INTEGER,
    sort_order INTEGER DEFAULT 0,
    sub_items TEXT DEFAULT '[]'
  )
`);

db.exec(`
  CREATE TABLE IF NOT EXISTS preferences (
    key TEXT PRIMARY KEY,
    value TEXT
  )
`);

// --- Items ---

const selectAll = db.prepare("SELECT * FROM items ORDER BY sort_order ASC");
const deleteAll = db.prepare("DELETE FROM items");
const insertItem = db.prepare(`
  INSERT INTO items (id, name, priority, budget, saved, chart_color, completed, created_at, sort_order, sub_items)
  VALUES (@id, @name, @priority, @budget, @saved, @chart_color, @completed, @created_at, @sort_order, @sub_items)
`);

export function getAllItems() {
  const rows = selectAll.all();
  return rows.map((r) => ({
    id: r.id,
    name: r.name,
    priority: r.priority,
    budget: r.budget,
    saved: r.saved,
    chartColor: r.chart_color,
    completed: r.completed === 1,
    createdAt: r.created_at,
    subItems: JSON.parse(r.sub_items || "[]"),
  }));
}

const replaceTransaction = db.transaction((items) => {
  deleteAll.run();
  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    insertItem.run({
      id: String(item.id),
      name: item.name,
      priority: item.priority,
      budget: item.budget || 0,
      saved: item.saved || 0,
      chart_color: item.chartColor || null,
      completed: item.completed ? 1 : 0,
      created_at: item.createdAt || null,
      sort_order: i,
      sub_items: JSON.stringify(item.subItems || []),
    });
  }
});

export function replaceAllItems(items) {
  replaceTransaction(items);
}

// --- Preferences ---

const selectPref = db.prepare("SELECT value FROM preferences WHERE key = ?");
const upsertPref = db.prepare(
  "INSERT OR REPLACE INTO preferences (key, value) VALUES (?, ?)"
);

export function getPref(key) {
  const row = selectPref.get(key);
  return row ? row.value : null;
}

export function setPref(key, value) {
  upsertPref.run(key, value);
}

export default db;
