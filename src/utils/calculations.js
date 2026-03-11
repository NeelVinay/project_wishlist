export const getItemBudget = (i) => i.budget || 0;
export const getSubBudgetTotal = (i) => i.subItems ? i.subItems.reduce((s, x) => s + (x.budget || 0), 0) : 0;
export const getSubSavedTotal = (i) => i.subItems ? i.subItems.reduce((s, x) => s + (x.saved || 0), 0) : 0;

export const getAvgPri = (i) => {
  if (!i.subItems || i.subItems.length === 0) return i.priority;
  return Math.round((i.subItems.reduce((a, s) => a + s.priority, 0) / i.subItems.length) * 10) / 10;
};

export const getCompletionProgress = (items) => {
  let tw = 0, cw = 0;
  items.forEach((i) => {
    if (i.subItems && i.subItems.length > 0) { i.subItems.forEach((s) => { tw += s.priority; if (s.completed) cw += s.priority; }); }
    else { tw += i.priority; if (i.completed) cw += i.priority; }
  });
  return tw === 0 ? 0 : Math.round((cw / tw) * 100);
};

export const getSavingsProgress = (items) => {
  let tb = 0, ts = 0;
  items.forEach((i) => {
    if (i.subItems && i.subItems.length > 0) { i.subItems.forEach((s) => { tb += s.budget || 0; ts += s.saved || 0; }); }
    else { tb += i.budget || 0; ts += i.saved || 0; }
  });
  return tb === 0 ? 0 : Math.min(100, Math.round((ts / tb) * 100));
};
