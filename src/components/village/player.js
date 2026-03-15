import { worldToScreen } from "./camera";

const SPEED = 5; // tiles per second
const LERP_FACTOR = 0.12;
const SIZE_W = 0.6; // tiles
const SIZE_H = 0.9;
const ACCENT = "#c0392b";

export function createPlayer(x, y) {
  return {
    x, y,
    vx: 0, vy: 0,
    facing: 0, // 0=down, 1=left, 2=up, 3=right
    animFrame: 0,
    animTimer: 0,
    w: SIZE_W,
    h: SIZE_H,
  };
}

export function updatePlayer(player, keys, dt, houses, bounds) {
  let dx = 0, dy = 0;
  if (keys["d"] || keys["ArrowRight"]) dx += 1;
  if (keys["a"] || keys["ArrowLeft"]) dx -= 1;
  if (keys["s"] || keys["ArrowDown"]) dy += 1;
  if (keys["w"] || keys["ArrowUp"]) dy -= 1;

  // Normalize diagonal
  if (dx !== 0 && dy !== 0) {
    const inv = 1 / Math.SQRT2;
    dx *= inv;
    dy *= inv;
  }

  // Smooth acceleration
  player.vx += (dx * SPEED - player.vx) * LERP_FACTOR;
  player.vy += (dy * SPEED - player.vy) * LERP_FACTOR;

  // Try X movement, then Y separately (slide along walls)
  const hw = player.w / 2;
  const hh = player.h * 0.3; // collision box is lower portion

  const nx = player.x + player.vx * dt;
  if (!collidesHouse(nx, player.y, hw, hh, houses)) {
    player.x = nx;
  }

  const ny = player.y + player.vy * dt;
  if (!collidesHouse(player.x, ny, hw, hh, houses)) {
    player.y = ny;
  }

  // Clamp to world bounds
  if (bounds) {
    player.x = Math.max(bounds.minX + hw, Math.min(bounds.maxX - hw, player.x));
    player.y = Math.max(bounds.minY + hh, Math.min(bounds.maxY - hh, player.y));
  }

  // Facing direction
  if (Math.abs(player.vx) > 0.1 || Math.abs(player.vy) > 0.1) {
    if (Math.abs(player.vx) > Math.abs(player.vy)) {
      player.facing = player.vx > 0 ? 3 : 1;
    } else {
      player.facing = player.vy > 0 ? 0 : 2;
    }
    // Walk animation
    player.animTimer += dt;
    if (player.animTimer > 0.2) {
      player.animTimer = 0;
      player.animFrame = (player.animFrame + 1) % 2;
    }
  } else {
    player.animFrame = 0;
    player.animTimer = 0;
  }
}

function collidesHouse(px, py, hw, hh, houses) {
  if (!houses) return false;
  for (const h of houses) {
    if (px + hw > h.x && px - hw < h.x + h.w &&
        py + hh > h.y && py - hh < h.y + h.h) {
      return true;
    }
  }
  return false;
}

export function drawPlayer(ctx, player, cam) {
  const { sx, sy } = worldToScreen(player.x, player.y, cam);
  const pw = player.w * cam.scale;
  const ph = player.h * cam.scale;
  const x = sx - pw / 2;
  const y = sy - ph;

  // Shadow
  ctx.fillStyle = "rgba(0,0,0,0.25)";
  ctx.beginPath();
  ctx.ellipse(sx, sy + 2, pw * 0.45, pw * 0.18, 0, 0, Math.PI * 2);
  ctx.fill();

  // Body
  const bob = player.animFrame === 1 ? -1.5 : 0;
  ctx.fillStyle = ACCENT;
  const bx = x + pw * 0.1;
  const bw = pw * 0.8;
  const bh = ph * 0.55;
  const by = y + ph * 0.35 + bob;
  ctx.beginPath();
  ctx.roundRect(bx, by, bw, bh, bw * 0.2);
  ctx.fill();

  // Head
  const headR = pw * 0.28;
  const headY = y + ph * 0.28 + bob;
  ctx.fillStyle = "#e8c4a0";
  ctx.beginPath();
  ctx.arc(sx, headY, headR, 0, Math.PI * 2);
  ctx.fill();

  // Hair
  ctx.fillStyle = "#4a3020";
  ctx.beginPath();
  ctx.arc(sx, headY - headR * 0.15, headR * 1.05, Math.PI, Math.PI * 2);
  ctx.fill();

  // Legs
  const legW = pw * 0.2;
  const legH = ph * 0.2;
  const legY = by + bh - 2;
  const legOff = player.animFrame === 1 ? 3 : -1;
  ctx.fillStyle = "#2c2c3e";
  ctx.fillRect(sx - pw * 0.22 - legOff, legY, legW, legH);
  ctx.fillRect(sx + pw * 0.02 + legOff, legY, legW, legH);
}
