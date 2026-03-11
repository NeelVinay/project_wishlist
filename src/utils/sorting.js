import { getAvgPri } from "./calculations";

export const sortSubs = (subs, sm, rev) => {
  if (sm === "manual") return subs;
  const dir = rev ? -1 : 1;
  return [...subs].sort((a, b) => {
    if (sm === "priority") { if (b.priority !== a.priority) return (b.priority - a.priority) * dir; return a.name.localeCompare(b.name); }
    if (sm === "alpha") return a.name.localeCompare(b.name) * dir;
    if (sm === "date") return ((b.createdAt || 0) - (a.createdAt || 0)) * dir;
    if (sm === "purchasable") { const ar = (a.budget || 0) > 0 && (a.saved || 0) >= (a.budget || 0) ? 1 : 0; const br = (b.budget || 0) > 0 && (b.saved || 0) >= (b.budget || 0) ? 1 : 0; if (br !== ar) return (br - ar) * dir; return a.name.localeCompare(b.name); }
    return 0;
  });
};

export const sortRoot = (items, sm, rev) => {
  if (sm === "manual") return items;
  const dir = rev ? -1 : 1;
  return [...items].sort((a, b) => {
    if (sm === "priority") { const ap = getAvgPri(a), bp = getAvgPri(b); if (bp !== ap) return (bp - ap) * dir; return a.name.localeCompare(b.name); }
    if (sm === "alpha") return a.name.localeCompare(b.name) * dir;
    if (sm === "date") return (b.createdAt - a.createdAt) * dir;
    if (sm === "purchasable") { const ar = (a.budget || 0) > 0 && (a.saved || 0) >= (a.budget || 0) ? 1 : 0; const br = (b.budget || 0) > 0 && (b.saved || 0) >= (b.budget || 0) ? 1 : 0; if (br !== ar) return (br - ar) * dir; return a.name.localeCompare(b.name); }
    return 0;
  });
};

export const getSortLabel = (m, r) => {
  if (m === "priority") return r ? "Low \u2192 High" : "High \u2192 Low";
  if (m === "alpha") return r ? "Z \u2192 A" : "A \u2192 Z";
  if (m === "date") return r ? "Oldest first" : "Newest first";
  if (m === "purchasable") return r ? "Not ready first" : "Ready to buy first";
  if (m === "manual") return "Drag to reorder";
  return "";
};
