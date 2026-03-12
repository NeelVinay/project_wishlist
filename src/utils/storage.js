export async function loadItems() {
  try {
    const res = await fetch("/api/items");
    if (!res.ok) return [];
    return await res.json();
  } catch {
    console.warn("Failed to load wishlist items from server");
    return [];
  }
}

export async function saveItems(items) {
  try {
    const res = await fetch("/api/items", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(items),
    });
    if (!res.ok) console.warn("Save items failed:", res.status);
  } catch (err) {
    console.warn("Failed to save wishlist items to server:", err.message);
  }
}

export async function loadCurrencyCode() {
  try {
    const res = await fetch("/api/currency");
    if (!res.ok) return null;
    const data = await res.json();
    return data.code;
  } catch {
    console.warn("Failed to load currency from server");
    return null;
  }
}

export async function saveCurrencyCode(code) {
  try {
    const res = await fetch("/api/currency", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code }),
    });
    if (!res.ok) console.warn("Save currency failed:", res.status);
  } catch (err) {
    console.warn("Failed to save currency to server:", err.message);
  }
}

export async function loadPref(key) {
  try {
    const res = await fetch(`/api/prefs/${encodeURIComponent(key)}`);
    if (!res.ok) return null;
    const data = await res.json();
    return data.value;
  } catch {
    return null;
  }
}

export async function savePref(key, value) {
  try {
    const res = await fetch(`/api/prefs/${encodeURIComponent(key)}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ value }),
    });
    if (!res.ok) console.warn(`Save pref "${key}" failed:`, res.status);
  } catch (err) {
    console.warn(`Failed to save preference "${key}" to server:`, err.message);
  }
}
