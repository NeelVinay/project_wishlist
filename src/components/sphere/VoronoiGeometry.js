import * as THREE from "three";
import { getItemBudget } from "../../utils/calculations";

const GOLDEN_RATIO = (1 + Math.sqrt(5)) / 2;
const CELL_GAP = 0.008; // lerp factor toward centroid for cracked-earth gaps
const SCORCHED_GAP = 0.08; // wider cracks for scorched planet theme

// Helper: get vertex index for face f, vertex v (0-2) — works for both indexed and non-indexed geo
function faceVertexIndex(idx, f, v) {
  return idx ? idx.getX(f * 3 + v) : f * 3 + v;
}

/**
 * Computes Voronoi-like cells on a sphere via subdivided icosahedron + nearest-seed assignment.
 */
export function computeVoronoiCells(items, total, radius, detail = 5) {
  const icoGeo = new THREE.IcosahedronGeometry(radius, detail);
  const posAttr = icoGeo.getAttribute("position");
  const idx = icoGeo.getIndex(); // may be null for non-indexed geometry
  const faceCount = (idx ? idx.count : posAttr.count) / 3;

  // Filter to items with budget > 0
  const entries = items
    .map((item) => ({ item, budget: getItemBudget(item) }))
    .filter((e) => e.budget > 0);

  if (entries.length === 0) return { cells: [], icoGeo };

  // Place seed points via Fibonacci spiral with budget-proportional latitude
  let cum = 0;
  const seeds = entries.map((entry, i) => {
    const pct = entry.budget / total;
    const fMid = cum + pct / 2;
    cum += pct;
    const theta = Math.acos(1 - 2 * fMid);
    const phi = 2 * Math.PI * i / GOLDEN_RATIO;
    const sinT = Math.sin(theta);
    return {
      item: entry.item,
      seed: new THREE.Vector3(radius * sinT * Math.cos(phi), radius * Math.cos(theta), radius * sinT * Math.sin(phi)),
      faceIndices: [],
      centroidSum: new THREE.Vector3(),
    };
  });

  // Assign each face to nearest seed
  const faceOwner = new Int32Array(faceCount);
  for (let f = 0; f < faceCount; f++) {
    const i0 = faceVertexIndex(idx, f, 0);
    const i1 = faceVertexIndex(idx, f, 1);
    const i2 = faceVertexIndex(idx, f, 2);
    const cx = (posAttr.getX(i0) + posAttr.getX(i1) + posAttr.getX(i2)) / 3;
    const cy = (posAttr.getY(i0) + posAttr.getY(i1) + posAttr.getY(i2)) / 3;
    const cz = (posAttr.getZ(i0) + posAttr.getZ(i1) + posAttr.getZ(i2)) / 3;

    let best = 0, bestDot = -Infinity;
    for (let s = 0; s < seeds.length; s++) {
      const d = cx * seeds[s].seed.x + cy * seeds[s].seed.y + cz * seeds[s].seed.z;
      if (d > bestDot) { bestDot = d; best = s; }
    }
    faceOwner[f] = best;
    seeds[best].faceIndices.push(f);
    seeds[best].centroidSum.x += cx;
    seeds[best].centroidSum.y += cy;
    seeds[best].centroidSum.z += cz;
  }

  // Build edge map for boundary detection
  const edgeMap = new Map();
  for (let f = 0; f < faceCount; f++) {
    for (let e = 0; e < 3; e++) {
      const v0 = faceVertexIndex(idx, f, e);
      const v1 = faceVertexIndex(idx, f, (e + 1) % 3);
      // For non-indexed geo, vertices aren't shared, so use position-based keys
      const px0 = posAttr.getX(v0).toFixed(6) + "," + posAttr.getY(v0).toFixed(6) + "," + posAttr.getZ(v0).toFixed(6);
      const px1 = posAttr.getX(v1).toFixed(6) + "," + posAttr.getY(v1).toFixed(6) + "," + posAttr.getZ(v1).toFixed(6);
      const key = px0 < px1 ? px0 + "|" + px1 : px1 + "|" + px0;
      const entry = edgeMap.get(key);
      if (!entry) edgeMap.set(key, { v0, v1, faces: [f] });
      else entry.faces.push(f);
    }
  }

  // Collect boundary edges per cell
  const cellBoundaries = seeds.map(() => []);
  for (const [, edge] of edgeMap) {
    if (edge.faces.length === 2 && faceOwner[edge.faces[0]] !== faceOwner[edge.faces[1]]) {
      cellBoundaries[faceOwner[edge.faces[0]]].push([edge.v0, edge.v1]);
      cellBoundaries[faceOwner[edge.faces[1]]].push([edge.v0, edge.v1]);
    }
  }

  // Build cell data
  const cells = seeds.map((s, i) => {
    const n = s.faceIndices.length;
    const centroid = n > 0
      ? s.centroidSum.divideScalar(n).normalize()
      : s.seed.clone().normalize();
    return {
      id: s.item.id,
      item: s.item,
      color: s.item.chartColor || "#888",
      faceIndices: s.faceIndices,
      centroid,
      detailPos: centroid.clone().multiplyScalar(radius + 0.5),
      boundaryEdges: cellBoundaries[i],
    };
  });

  return { cells, icoGeo };
}

// Multi-octave hash noise for irregular, organic crack edges
function hash3(x, y, z) {
  const n = Math.sin(x * 127.1 + y * 311.7 + z * 74.7) * 43758.5453;
  return n - Math.floor(n);
}
function hash3b(x, y, z) {
  const n = Math.sin(x * 269.5 + y * 183.3 + z * 421.1) * 32187.7137;
  return n - Math.floor(n);
}
function scorchedNoise(x, y, z) {
  // 3 octaves of hash noise at different frequencies for organic irregularity
  const o1 = hash3(x * 3.7, y * 3.7, z * 3.7);
  const o2 = hash3b(x * 7.3, y * 7.3, z * 7.3) * 0.5;
  const o3 = hash3(x * 15.1, y * 15.1, z * 15.1) * 0.25;
  return (o1 + o2 + o3) / 1.75; // normalized 0..1
}

// Helper: read a vertex from the icosahedron, apply gap shrink toward centroid
function shrinkVertex(posAttr, vi, centroid, scorched = false) {
  const x = posAttr.getX(vi);
  const y = posAttr.getY(vi);
  const z = posAttr.getZ(vi);
  const r = Math.sqrt(x * x + y * y + z * z);
  const tx = centroid.x * r;
  const ty = centroid.y * r;
  const tz = centroid.z * r;

  let gap = CELL_GAP;
  if (scorched) {
    // Highly irregular gap: wide range from tight to very wide cracks
    const noise = scorchedNoise(x, y, z);
    gap = SCORCHED_GAP * (0.2 + noise * 1.6);
  }

  return [
    x + (tx - x) * gap,
    y + (ty - y) * gap,
    z + (tz - z) * gap,
  ];
}

/**
 * Creates geometry for a single Voronoi cell: surface faces + boundary side walls.
 */
export function createCellGeometry(icoGeo, faceIndices, centroid, boundaryEdges, scorched = false) {
  const posAttr = icoGeo.getAttribute("position");
  const idx = icoGeo.getIndex();
  const positions = [];

  // Surface triangles with gap shrink
  for (const f of faceIndices) {
    for (let v = 0; v < 3; v++) {
      const vi = faceVertexIndex(idx, f, v);
      const [sx, sy, sz] = shrinkVertex(posAttr, vi, centroid, scorched);
      positions.push(sx, sy, sz);
    }
  }

  // Boundary side walls: triangles from surface edge to origin
  // Skip in scorched mode so magma sphere shows through the cracks
  if (!scorched) {
    for (const [v0, v1] of boundaryEdges) {
      const [x0, y0, z0] = shrinkVertex(posAttr, v0, centroid, false);
      const [x1, y1, z1] = shrinkVertex(posAttr, v1, centroid, false);
      positions.push(x0, y0, z0, x1, y1, z1, 0, 0, 0);
      positions.push(x1, y1, z1, x0, y0, z0, 0, 0, 0);
    }
  }

  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
  geo.computeVertexNormals();
  return geo;
}
