let nextId = Date.now();
export const generateId = () => nextId++;

export const randomColor = () => {
  const h = Math.floor(Math.random() * 360), s = 65, l = 55;
  const a = s / 100, b = l / 100;
  const f = (n) => { const k = (n + h / 30) % 12; const c = b - a * Math.min(b, 1 - b) * Math.max(-1, Math.min(k - 3, 9 - k, 1)); return Math.round(255 * c).toString(16).padStart(2, "0"); };
  return "#" + f(0) + f(8) + f(4);
};
