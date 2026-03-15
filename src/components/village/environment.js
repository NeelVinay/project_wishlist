import { worldToScreen } from "./camera";

// ── Ground ──────────────────────────────────────────────────────────────────

export function drawGround(ctx, cam, bounds, w, h) {
  // Base grass
  ctx.fillStyle = "#1a3a1a";
  ctx.fillRect(0, 0, w, h);

  // Grass variation patches (pre-seeded, drawn as subtle overlapping circles)
  const patchSeed = 42;
  let s = patchSeed;
  const rng = () => { s = (s * 16807) % 2147483647; return (s - 1) / 2147483646; };

  for (let i = 0; i < 60; i++) {
    const wx = bounds.minX + rng() * (bounds.maxX - bounds.minX);
    const wy = bounds.minY + rng() * (bounds.maxY - bounds.minY);
    const { sx, sy } = worldToScreen(wx, wy, cam);
    const r = (2 + rng() * 4) * cam.scale;
    ctx.fillStyle = rng() > 0.5 ? "rgba(34,80,34,0.25)" : "rgba(20,50,20,0.2)";
    ctx.beginPath();
    ctx.arc(sx, sy, r, 0, Math.PI * 2);
    ctx.fill();
  }

  // Dirt patches near center
  for (let i = 0; i < 15; i++) {
    const wx = (rng() - 0.5) * 12;
    const wy = (rng() - 0.5) * 12;
    const { sx, sy } = worldToScreen(wx, wy, cam);
    const r = (1 + rng() * 2) * cam.scale;
    ctx.fillStyle = "rgba(58,42,26,0.15)";
    ctx.beginPath();
    ctx.arc(sx, sy, r, 0, Math.PI * 2);
    ctx.fill();
  }
}

// ── Roads ───────────────────────────────────────────────────────────────────

export function drawRoads(ctx, roads, cam) {
  for (const road of roads) {
    const p1 = worldToScreen(road.x1, road.y1, cam);
    const p2 = worldToScreen(road.x2, road.y2, cam);
    const rx = Math.min(p1.sx, p2.sx);
    const ry = Math.min(p1.sy, p2.sy);
    const rw = Math.abs(p2.sx - p1.sx);
    const rh = Math.abs(p2.sy - p1.sy);

    if (road.main) {
      // Road border
      ctx.fillStyle = "#3a3025";
      ctx.fillRect(rx - 2, ry - 2, rw + 4, rh + 4);
      // Road fill
      ctx.fillStyle = "#4a4035";
      ctx.fillRect(rx, ry, rw, rh);
      // Cobblestone dots
      drawCobblestones(ctx, rx, ry, rw, rh, cam);
    } else {
      // Side path — narrower, lighter
      ctx.fillStyle = "#3d3528";
      ctx.fillRect(rx, ry, Math.max(rw, 2), Math.max(rh, 2));
    }
  }
}

function drawCobblestones(ctx, rx, ry, rw, rh, cam) {
  const spacing = Math.max(6, cam.scale * 0.3);
  ctx.fillStyle = "rgba(80,72,58,0.4)";
  let s = 7;
  const rng = () => { s = (s * 16807) % 2147483647; return (s - 1) / 2147483646; };
  for (let x = rx + 4; x < rx + rw - 4; x += spacing) {
    for (let y = ry + 4; y < ry + rh - 4; y += spacing) {
      const ox = (rng() - 0.5) * spacing * 0.5;
      const oy = (rng() - 0.5) * spacing * 0.5;
      const r = 1 + rng() * 1.5;
      ctx.beginPath();
      ctx.arc(x + ox, y + oy, r, 0, Math.PI * 2);
      ctx.fill();
    }
  }
}

// ── Village Well ────────────────────────────────────────────────────────────

export function drawWell(ctx, cam, centerX, centerY, time) {
  const { sx, sy } = worldToScreen(centerX, centerY, cam);
  const s = cam.scale;

  // Stone base
  ctx.fillStyle = "#555";
  ctx.beginPath();
  ctx.ellipse(sx, sy, s * 1.0, s * 0.5, 0, 0, Math.PI * 2);
  ctx.fill();

  // Inner dark
  ctx.fillStyle = "#1a1a2a";
  ctx.beginPath();
  ctx.ellipse(sx, sy - 2, s * 0.65, s * 0.32, 0, 0, Math.PI * 2);
  ctx.fill();

  // Water shimmer
  const shimmer = 0.3 + 0.15 * Math.sin(time * 1.5);
  ctx.fillStyle = `rgba(80,140,200,${shimmer})`;
  ctx.beginPath();
  ctx.ellipse(sx, sy - 2, s * 0.55, s * 0.26, 0, 0, Math.PI * 2);
  ctx.fill();

  // Stone rim
  ctx.strokeStyle = "#777";
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.ellipse(sx, sy, s * 1.0, s * 0.5, 0, 0, Math.PI * 2);
  ctx.stroke();

  // Posts
  ctx.fillStyle = "#4a3520";
  ctx.fillRect(sx - s * 0.8, sy - s * 1.1, s * 0.12, s * 1.1);
  ctx.fillRect(sx + s * 0.68, sy - s * 1.1, s * 0.12, s * 1.1);

  // Crossbar
  ctx.fillRect(sx - s * 0.8, sy - s * 1.15, s * 1.72, s * 0.1);

  // Roof (small triangle)
  ctx.fillStyle = "#6a3a20";
  ctx.beginPath();
  ctx.moveTo(sx - s * 0.9, sy - s * 1.1);
  ctx.lineTo(sx, sy - s * 1.5);
  ctx.lineTo(sx + s * 0.9, sy - s * 1.1);
  ctx.closePath();
  ctx.fill();
}

// ── Trees ───────────────────────────────────────────────────────────────────

export function drawTree(ctx, tree, cam) {
  const { sx, sy } = worldToScreen(tree.x, tree.y, cam);
  const s = tree.size * cam.scale;

  // Shadow
  ctx.fillStyle = "rgba(0,0,0,0.15)";
  ctx.beginPath();
  ctx.ellipse(sx, sy + s * 0.1, s * 0.5, s * 0.2, 0, 0, Math.PI * 2);
  ctx.fill();

  if (tree.type === "pine") {
    // Trunk
    ctx.fillStyle = "#3a2818";
    ctx.fillRect(sx - s * 0.06, sy - s * 0.5, s * 0.12, s * 0.55);
    // Triangles stacked
    ctx.fillStyle = "#1a5a2a";
    for (let i = 0; i < 3; i++) {
      const ty = sy - s * 0.3 - i * s * 0.28;
      const tw = s * (0.45 - i * 0.08);
      ctx.beginPath();
      ctx.moveTo(sx - tw, ty);
      ctx.lineTo(sx, ty - s * 0.35);
      ctx.lineTo(sx + tw, ty);
      ctx.closePath();
      ctx.fill();
    }
  } else {
    // Round tree
    // Trunk
    ctx.fillStyle = "#4a3020";
    ctx.fillRect(sx - s * 0.06, sy - s * 0.4, s * 0.12, s * 0.45);
    // Canopy
    ctx.fillStyle = "#1e6830";
    ctx.beginPath();
    ctx.arc(sx, sy - s * 0.55, s * 0.4, 0, Math.PI * 2);
    ctx.fill();
    // Highlight
    ctx.fillStyle = "rgba(40,130,60,0.5)";
    ctx.beginPath();
    ctx.arc(sx - s * 0.1, sy - s * 0.62, s * 0.22, 0, Math.PI * 2);
    ctx.fill();
  }
}

// ── Bushes ──────────────────────────────────────────────────────────────────

export function drawBush(ctx, bush, cam) {
  const { sx, sy } = worldToScreen(bush.x, bush.y, cam);
  const r = bush.r * cam.scale;
  const color = bush.shade === 0 ? "#1a5a28" : "#1a6838";

  ctx.fillStyle = "rgba(0,0,0,0.1)";
  ctx.beginPath();
  ctx.ellipse(sx, sy + r * 0.3, r * 0.8, r * 0.3, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(sx, sy, r, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(sx - r * 0.5, sy + r * 0.2, r * 0.7, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(sx + r * 0.5, sy + r * 0.15, r * 0.65, 0, Math.PI * 2);
  ctx.fill();
}

// ── Fences ──────────────────────────────────────────────────────────────────

export function drawFence(ctx, fence, cam) {
  const p1 = worldToScreen(fence.x, fence.y, cam);
  const sw = fence.w * cam.scale;
  const sh = fence.h * cam.scale;
  const postH = Math.max(4, cam.scale * 0.18);
  const postW = Math.max(2, cam.scale * 0.05);
  const railH = Math.max(1, cam.scale * 0.03);
  const spacing = Math.max(8, cam.scale * 0.4);

  ctx.fillStyle = "#5a4030";

  // Draw 4 sides, skip gapSide
  const sides = [
    { x1: p1.sx, y1: p1.sy, x2: p1.sx + sw, y2: p1.sy, horiz: true },       // top
    { x1: p1.sx + sw, y1: p1.sy, x2: p1.sx + sw, y2: p1.sy + sh, horiz: false }, // right
    { x1: p1.sx, y1: p1.sy + sh, x2: p1.sx + sw, y2: p1.sy + sh, horiz: true },  // bottom
    { x1: p1.sx, y1: p1.sy, x2: p1.sx, y2: p1.sy + sh, horiz: false },       // left
  ];

  for (let i = 0; i < sides.length; i++) {
    if (i === fence.gapSide) continue;
    const side = sides[i];
    const len = side.horiz ? Math.abs(side.x2 - side.x1) : Math.abs(side.y2 - side.y1);
    const count = Math.max(2, Math.floor(len / spacing));

    for (let j = 0; j <= count; j++) {
      const t = j / count;
      if (side.horiz) {
        const x = side.x1 + (side.x2 - side.x1) * t;
        ctx.fillRect(x - postW / 2, side.y1 - postH, postW, postH);
      } else {
        const y = side.y1 + (side.y2 - side.y1) * t;
        ctx.fillRect(side.x1 - postW / 2, y - postH, postW, postH);
      }
    }

    // Rails
    ctx.fillStyle = "#4a3525";
    if (side.horiz) {
      ctx.fillRect(side.x1, side.y1 - postH * 0.7, len, railH);
      ctx.fillRect(side.x1, side.y1 - postH * 0.35, len, railH);
    } else {
      ctx.fillRect(side.x1 - railH, side.y1 - postH, railH, len);
    }
    ctx.fillStyle = "#5a4030";
  }
}

// ── Flowers ─────────────────────────────────────────────────────────────────

export function drawFlowers(ctx, flowers, cam) {
  for (const f of flowers) {
    const { sx, sy } = worldToScreen(f.x, f.y, cam);
    const r = Math.max(1.5, cam.scale * 0.04);
    ctx.fillStyle = f.color;
    ctx.beginPath();
    ctx.arc(sx, sy, r, 0, Math.PI * 2);
    ctx.fill();
    // Tiny stem
    ctx.strokeStyle = "#2a6a2a";
    ctx.lineWidth = 0.8;
    ctx.beginPath();
    ctx.moveTo(sx, sy + r);
    ctx.lineTo(sx, sy + r + 3);
    ctx.stroke();
  }
}

// ── Rocks ───────────────────────────────────────────────────────────────────

export function drawRocks(ctx, rocks, cam) {
  for (const rock of rocks) {
    const { sx, sy } = worldToScreen(rock.x, rock.y, cam);
    const r = rock.size * cam.scale;
    ctx.fillStyle = "#5a5a5a";
    ctx.beginPath();
    ctx.ellipse(sx, sy, r, r * 0.65, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "rgba(100,100,100,0.4)";
    ctx.beginPath();
    ctx.ellipse(sx - r * 0.2, sy - r * 0.15, r * 0.45, r * 0.3, 0, 0, Math.PI * 2);
    ctx.fill();
  }
}

// ── Lamp Posts ──────────────────────────────────────────────────────────────

export function drawLamp(ctx, lamp, cam, time) {
  const { sx, sy } = worldToScreen(lamp.x, lamp.y, cam);
  const s = cam.scale;

  // Pole
  ctx.fillStyle = "#333";
  ctx.fillRect(sx - 1.5, sy - s * 0.8, 3, s * 0.8);

  // Lamp head
  ctx.fillStyle = "#444";
  ctx.fillRect(sx - 4, sy - s * 0.85, 8, 5);

  // Glow
  const flicker = 0.7 + 0.1 * Math.sin(time * 3 + lamp.x * 7);
  const grad = ctx.createRadialGradient(sx, sy - s * 0.8, 0, sx, sy - s * 0.8, s * 0.8);
  grad.addColorStop(0, `rgba(255,220,120,${flicker * 0.3})`);
  grad.addColorStop(1, "rgba(255,220,120,0)");
  ctx.fillStyle = grad;
  ctx.beginPath();
  ctx.arc(sx, sy - s * 0.8, s * 0.8, 0, Math.PI * 2);
  ctx.fill();
}
