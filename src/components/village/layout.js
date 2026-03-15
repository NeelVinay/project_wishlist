// Village layout: computes positions for houses, roads, decorations from item data.
// All coordinates in tile units. (0,0) is village center.
// Houses are placed INSIDE lots, set back from roads with clear yard space.

const LOT_W = 12;
const LOT_H = 10;
const ROAD_W = 3;
const SETBACK = 2.5; // tiles of yard between road edge and house
const PADDING = 5;

// Seeded random for deterministic layouts given the same items
function seededRandom(seed) {
  let s = seed;
  return () => {
    s = (s * 16807 + 0) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

function hashItems(items) {
  let h = 0;
  for (const it of items) {
    for (let i = 0; i < it.id.length; i++) h = ((h << 5) - h + it.id.charCodeAt(i)) | 0;
  }
  return Math.abs(h) || 1;
}

// All houses are the same small size for now
const HOUSE_W = 2.5;
const HOUSE_H = 2.0;

export function computeLayout(items) {
  const rand = seededRandom(hashItems(items));
  const budgetItems = items.filter((i) => i.budget > 0);
  const N = budgetItems.length;

  if (N === 0) {
    return {
      houses: [], roads: [], decorations: [], trees: [],
      bushes: [], fences: [], flowers: [], rocks: [],
      bounds: { minX: -10, minY: -10, maxX: 10, maxY: 10 },
      spawnPoint: { x: 0, y: 0 },
      npcPaths: [],
      wellCenter: { x: 0, y: 0 },
    };
  }

  // Sort by priority descending — high priority near center
  const sorted = [...budgetItems].sort((a, b) => b.priority - a.priority);

  // Grid: houses go into quadrants around the cross-shaped road
  // With ROAD_W=3 road in center, lots are in 4 quadrants
  const cols = Math.max(2, Math.ceil(Math.sqrt(N * 1.5)));
  const rows = Math.max(1, Math.ceil(N / cols));

  const houses = [];
  const roads = [];
  const trees = [];
  const bushes = [];
  const fences = [];
  const flowers = [];
  const rocks = [];
  const decorations = [];

  // Grid dimensions — lots are separated by roads
  const gridW = cols * LOT_W + (cols + 1) * ROAD_W;
  const gridH = rows * LOT_H + (rows + 1) * ROAD_W;
  const ox = -gridW / 2;
  const oy = -gridH / 2;

  // Main roads: horizontal and vertical through center
  const mainRoadY = 0;
  const mainRoadX = 0;

  // Horizontal main road (full width)
  roads.push({ x1: ox - PADDING, y1: mainRoadY - ROAD_W / 2, x2: ox + gridW + PADDING, y2: mainRoadY + ROAD_W / 2, main: true });
  // Vertical main road (full height)
  roads.push({ x1: mainRoadX - ROAD_W / 2, y1: oy - PADDING, x2: mainRoadX + ROAD_W / 2, y2: oy + gridH + PADDING, main: true });

  // Secondary roads between each row/column of lots
  for (let c = 0; c <= cols; c++) {
    const rx = ox + c * (LOT_W + ROAD_W) + ROAD_W / 2;
    if (Math.abs(rx - mainRoadX) > ROAD_W) {
      roads.push({ x1: rx - ROAD_W * 0.4, y1: oy - 1, x2: rx + ROAD_W * 0.4, y2: oy + gridH + 1, main: false });
    }
  }
  for (let r = 0; r <= rows; r++) {
    const ry = oy + r * (LOT_H + ROAD_W) + ROAD_W / 2;
    if (Math.abs(ry - mainRoadY) > ROAD_W) {
      roads.push({ x1: ox - 1, y1: ry - ROAD_W * 0.4, x2: ox + gridW + 1, y2: ry + ROAD_W * 0.4, main: false });
    }
  }

  // Place houses centered in their lots, set back from roads
  for (let i = 0; i < sorted.length; i++) {
    const item = sorted[i];
    const col = i % cols;
    const row = Math.floor(i / cols);

    // Lot top-left (inside the road grid)
    const lotX = ox + ROAD_W + col * (LOT_W + ROAD_W);
    const lotY = oy + ROAD_W + row * (LOT_H + ROAD_W);

    // Center house in lot with setback from edges
    const jx = (rand() - 0.5) * 1.2;
    const jy = (rand() - 0.5) * 0.8;
    const hx = lotX + (LOT_W - HOUSE_W) / 2 + jx;
    const hy = lotY + SETBACK + (LOT_H - SETBACK * 2 - HOUSE_H) / 2 + jy;

    const clampedX = Math.max(lotX + SETBACK, Math.min(lotX + LOT_W - HOUSE_W - SETBACK, hx));
    const clampedY = Math.max(lotY + SETBACK, Math.min(lotY + LOT_H - HOUSE_H - SETBACK, hy));

    houses.push({
      x: clampedX, y: clampedY, w: HOUSE_W, h: HOUSE_H,
      item,
      progress: item.budget > 0 ? item.saved / item.budget : 0,
    });

    // Side path from house front door down to nearest road
    const houseCenterX = clampedX + HOUSE_W / 2;
    const houseFrontY = clampedY + HOUSE_H;
    const nextRoadY = lotY + LOT_H + ROAD_W / 2;
    roads.push({
      x1: houseCenterX - 0.5, y1: houseFrontY + 0.1,
      x2: houseCenterX + 0.5, y2: Math.min(nextRoadY, lotY + LOT_H),
      main: false,
    });

    // Landscaping — bushes on sides of house
    const bCount = 1 + Math.floor(rand() * 3);
    for (let b = 0; b < bCount; b++) {
      const side = rand() > 0.5 ? 1 : -1;
      bushes.push({
        x: clampedX + (side > 0 ? HOUSE_W + 0.4 : -0.9) + rand() * 0.4,
        y: clampedY + 0.5 + rand() * (HOUSE_H - 1),
        r: 0.3 + rand() * 0.3,
        shade: rand() > 0.5 ? 0 : 1,
      });
    }

    // Flowers in front yard
    const fCount = 1 + Math.floor(rand() * 4);
    for (let f = 0; f < fCount; f++) {
      flowers.push({
        x: clampedX - 0.5 + rand() * (HOUSE_W + 1),
        y: houseFrontY + 0.3 + rand() * (SETBACK - 0.5),
        color: ["#e88ca5", "#ecd85a", "#c792ea", "#fff"][Math.floor(rand() * 4)],
      });
    }

    // Fence around lot (with gap at front for path)
    if (rand() > 0.35) {
      fences.push({
        x: lotX + 0.3, y: lotY + 0.3,
        w: LOT_W - 0.6, h: LOT_H - 0.6,
        gapSide: 2, // bottom side gap for walkway
      });
    }
  }

  // Bounds
  const bPad = PADDING + 8;
  const bounds = {
    minX: ox - bPad,
    minY: oy - bPad,
    maxX: ox + gridW + bPad,
    maxY: oy + gridH + bPad,
  };

  // Trees: border tree line + scattered in empty areas
  const treeCount = 30 + Math.floor(N * 3);
  for (let t = 0; t < treeCount; t++) {
    const tx = bounds.minX + rand() * (bounds.maxX - bounds.minX);
    const ty = bounds.minY + rand() * (bounds.maxY - bounds.minY);

    // Don't place on top of houses (with margin)
    const onHouse = houses.some((h) => tx > h.x - 2 && tx < h.x + h.w + 2 && ty > h.y - 3 && ty < h.y + h.h + 2);
    // Don't place on roads
    const onHorizRoad = Math.abs(ty - mainRoadY) < ROAD_W * 0.7;
    const onVertRoad = Math.abs(tx - mainRoadX) < ROAD_W * 0.7;
    // Don't place inside lots (keep trees outside the village grid or at edges)
    const inLot = tx > ox + ROAD_W - 0.5 && tx < ox + gridW - ROAD_W + 0.5 &&
                  ty > oy + ROAD_W - 0.5 && ty < oy + gridH - ROAD_W + 0.5;
    const atBorder = tx < ox + 1 || tx > ox + gridW - 1 || ty < oy + 1 || ty > oy + gridH - 1;

    if (!onHouse && !onHorizRoad && !onVertRoad && (!inLot || atBorder)) {
      const type = rand() > 0.55 ? "pine" : "round";
      const sizeVar = 0.7 + rand() * 0.8;
      trees.push({ x: tx, y: ty, type, size: sizeVar });
    }
  }

  // Rocks scattered (avoid roads)
  const rockCount = 8 + Math.floor(rand() * 10);
  for (let r = 0; r < rockCount; r++) {
    const rx = bounds.minX + 2 + rand() * (bounds.maxX - bounds.minX - 4);
    const ry = bounds.minY + 2 + rand() * (bounds.maxY - bounds.minY - 4);
    if (Math.abs(ry - mainRoadY) > ROAD_W && Math.abs(rx - mainRoadX) > ROAD_W) {
      rocks.push({ x: rx, y: ry, size: 0.2 + rand() * 0.4 });
    }
  }

  // Lamp posts along main roads
  const lampSpacing = 7;
  for (let lx = ox + 2; lx < ox + gridW - 2; lx += lampSpacing) {
    if (Math.abs(lx - mainRoadX) > ROAD_W) {
      decorations.push({ type: "lamp", x: lx, y: mainRoadY - ROAD_W / 2 - 0.3 });
    }
  }
  for (let ly = oy + 2; ly < oy + gridH - 2; ly += lampSpacing) {
    if (Math.abs(ly - mainRoadY) > ROAD_W) {
      decorations.push({ type: "lamp", x: mainRoadX + ROAD_W / 2 + 0.3, y: ly });
    }
  }

  // NPC paths along main roads (center of road)
  const npcPaths = [
    { x1: ox - 3, y1: mainRoadY, x2: ox + gridW + 3, y2: mainRoadY },
    { x1: mainRoadX, y1: oy - 3, x2: mainRoadX, y2: oy + gridH + 3 },
  ];

  return {
    houses, roads, decorations, trees, bushes, fences, flowers, rocks,
    bounds, spawnPoint: { x: 0, y: ROAD_W }, npcPaths,
    wellCenter: { x: 0, y: 0 },
  };
}
