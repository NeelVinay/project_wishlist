import { worldToScreen } from "./camera";

const NPC_COLORS = [
  "#4a7fbf", "#bf6a4a", "#6abf4a", "#9b59b6",
  "#e67e22", "#1abc9c", "#e74c3c", "#3498db",
  "#8e6c4a", "#d4a843", "#5b8c5a", "#c0607e",
];

const NPC_SPEED_MIN = 1.2;
const NPC_SPEED_MAX = 2.5;
const IDLE_MIN = 1.0;
const IDLE_MAX = 3.5;

export function createNPCs(layout, count) {
  const npcs = [];
  const paths = layout.npcPaths;
  if (paths.length === 0) return npcs;

  for (let i = 0; i < count; i++) {
    const path = paths[i % paths.length];
    const t = 0.2 + Math.random() * 0.6;
    const x = path.x1 + (path.x2 - path.x1) * t;
    const y = path.y1 + (path.y2 - path.y1) * t;

    npcs.push({
      x, y,
      targetX: x, targetY: y,
      speed: NPC_SPEED_MIN + Math.random() * (NPC_SPEED_MAX - NPC_SPEED_MIN),
      facing: Math.floor(Math.random() * 4),
      animFrame: 0,
      animTimer: 0,
      color: NPC_COLORS[i % NPC_COLORS.length],
      idleTimer: Math.random() * 2, // stagger initial idle
      isIdle: true,
      pathIndex: i % paths.length,
    });
  }
  return npcs;
}

export function updateNPCs(npcs, dt, layout, player) {
  const paths = layout.npcPaths;

  for (const npc of npcs) {
    if (npc.isIdle) {
      npc.idleTimer -= dt;
      npc.animFrame = 0;
      if (npc.idleTimer <= 0) {
        npc.isIdle = false;
        pickNewTarget(npc, paths);
      }
      continue;
    }

    // Move toward target
    const dx = npc.targetX - npc.x;
    const dy = npc.targetY - npc.y;
    const dist = Math.sqrt(dx * dx + dy * dy);

    if (dist < 0.3) {
      // Arrived — go idle
      npc.isIdle = true;
      npc.idleTimer = IDLE_MIN + Math.random() * (IDLE_MAX - IDLE_MIN);
      npc.animFrame = 0;
      continue;
    }

    // Check if player is blocking path
    const pdx = player.x - npc.x;
    const pdy = player.y - npc.y;
    const pDist = Math.sqrt(pdx * pdx + pdy * pdy);
    if (pDist < 1.2) {
      // Wait for player to pass
      npc.animFrame = 0;
      continue;
    }

    const nx = dx / dist;
    const ny = dy / dist;
    npc.x += nx * npc.speed * dt;
    npc.y += ny * npc.speed * dt;

    // Facing
    if (Math.abs(nx) > Math.abs(ny)) {
      npc.facing = nx > 0 ? 3 : 1;
    } else {
      npc.facing = ny > 0 ? 0 : 2;
    }

    // Walk animation
    npc.animTimer += dt;
    if (npc.animTimer > 0.25) {
      npc.animTimer = 0;
      npc.animFrame = (npc.animFrame + 1) % 2;
    }
  }
}

function pickNewTarget(npc, paths) {
  // Pick a random point along the same path or switch path
  const switchPath = Math.random() > 0.6;
  const pi = switchPath ? Math.floor(Math.random() * paths.length) : npc.pathIndex;
  const path = paths[pi];
  npc.pathIndex = pi;

  const t = 0.05 + Math.random() * 0.9;
  npc.targetX = path.x1 + (path.x2 - path.x1) * t;
  npc.targetY = path.y1 + (path.y2 - path.y1) * t;
}

export function drawNPC(ctx, npc, cam) {
  const { sx, sy } = worldToScreen(npc.x, npc.y, cam);
  const s = cam.scale;
  const w = s * 0.5;
  const h = s * 0.75;
  const x = sx - w / 2;
  const y = sy - h;
  const bob = npc.animFrame === 1 ? -1.2 : 0;

  // Shadow
  ctx.fillStyle = "rgba(0,0,0,0.2)";
  ctx.beginPath();
  ctx.ellipse(sx, sy + 1, w * 0.4, w * 0.15, 0, 0, Math.PI * 2);
  ctx.fill();

  // Body
  ctx.fillStyle = npc.color;
  const bx = x + w * 0.1;
  const bw = w * 0.8;
  const bh = h * 0.5;
  const by = y + h * 0.38 + bob;
  ctx.beginPath();
  ctx.roundRect(bx, by, bw, bh, bw * 0.2);
  ctx.fill();

  // Head
  const headR = w * 0.26;
  const headY = y + h * 0.3 + bob;
  ctx.fillStyle = "#e0b88a";
  ctx.beginPath();
  ctx.arc(sx, headY, headR, 0, Math.PI * 2);
  ctx.fill();

  // Hair (varies by color index for variety)
  ctx.fillStyle = "#3a2a18";
  ctx.beginPath();
  ctx.arc(sx, headY - headR * 0.2, headR * 1.0, Math.PI, Math.PI * 2);
  ctx.fill();

  // Legs
  const legW = w * 0.18;
  const legH = h * 0.18;
  const legY = by + bh - 1.5;
  const legOff = npc.animFrame === 1 ? 2.5 : -0.5;
  ctx.fillStyle = "#3a3a4a";
  ctx.fillRect(sx - w * 0.2 - legOff, legY, legW, legH);
  ctx.fillRect(sx + w * 0.02 + legOff, legY, legW, legH);
}
