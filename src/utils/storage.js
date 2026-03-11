const KEYS = {
  ITEMS: "wishlist_items",
  CURRENCY: "wishlist_currency",
  PREFS: "wishlist_prefs_",
};

export function loadItems() {
  try {
    const raw = localStorage.getItem(KEYS.ITEMS);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    console.warn("Failed to load wishlist items from localStorage");
    return [];
  }
}

export function saveItems(items) {
  try {
    localStorage.setItem(KEYS.ITEMS, JSON.stringify(items));
  } catch {
    console.warn("Failed to save wishlist items to localStorage");
  }
}

export function loadCurrencyCode() {
  return localStorage.getItem(KEYS.CURRENCY);
}

export function saveCurrencyCode(code) {
  try {
    localStorage.setItem(KEYS.CURRENCY, code);
  } catch {
    console.warn("Failed to save currency to localStorage");
  }
}

export function loadPref(key) {
  try {
    const raw = localStorage.getItem(KEYS.PREFS + key);
    return raw !== null ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function savePref(key, value) {
  try {
    localStorage.setItem(KEYS.PREFS + key, JSON.stringify(value));
  } catch {
    console.warn(`Failed to save preference "${key}" to localStorage`);
  }
}
