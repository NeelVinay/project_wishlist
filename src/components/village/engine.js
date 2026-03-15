import { createCamera, updateCamera, resizeCamera, worldToScreen, screenToWorld, handleZoom } from "./camera";
import { createPlayer, updatePlayer, drawPlayer } from "./player";
import { computeLayout } from "./layout";
import { drawHouse, drawHouseLabel } from "./houses";
import { drawGround, drawRoads, drawWell, drawTree, drawBush, drawFence, drawFlowers, drawRocks, drawLamp } from "./environment";
import { createNPCs, updateNPCs, drawNPC } from "./npcs";

export function createEngine(canvas, items, currency, onHouseClick) {
  const ctx = canvas.getContext("2d");
  const dpr = window.devicePixelRatio || 1;
  const cam = createCamera(canvas.width / dpr, canvas.height / dpr);
  const layout = computeLayout(items);
  const player = createPlayer(layout.spawnPoint.x, layout.spawnPoint.y);
  const npcCount = Math.min(items.length * 2, 12);
  const npcs = createNPCs(layout, npcCount);

  const keys = {};
  let animId = 0;
  let lastTime = 0;
  let hoveredHouse = null;
  let mouseX = 0, mouseY = 0;

  // ── Input ───────────────────────────────────────────────────────────────

  const onKeyDown = (e) => {
    if (["w", "a", "s", "d", "ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.key)) {
      e.preventDefault();
      keys[e.key] = true;
    }
  };
  const onKeyUp = (e) => { keys[e.key] = false; };

  const onWheel = (e) => {
    e.preventDefault();
    handleZoom(cam, e.deltaY);
  };

  const onMouseMove = (e) => {
    const rect = canvas.getBoundingClientRect();
    mouseX = e.clientX - rect.left;
    mouseY = e.clientY - rect.top;
  };

  const onClick = (e) => {
    const rect = canvas.getBoundingClientRect();
    const cx = e.clientX - rect.left;
    const cy = e.clientY - rect.top;
    const { wx, wy } = screenToWorld(cx, cy, cam);
    const hit = hitTestHouse(wx, wy);
    onHouseClick(hit ? hit.item : null);
  };

  function hitTestHouse(wx, wy) {
    for (const h of layout.houses) {
      if (wx >= h.x && wx <= h.x + h.w && wy >= h.y && wy <= h.y + h.h) return h;
    }
    return null;
  }

  window.addEventListener("keydown", onKeyDown);
  window.addEventListener("keyup", onKeyUp);
  canvas.addEventListener("wheel", onWheel, { passive: false });
  canvas.addEventListener("mousemove", onMouseMove);
  canvas.addEventListener("click", onClick);

  // ── Game Loop ─────────────────────────────────────────────────────────

  function loop(timestamp) {
    const dt = Math.min((timestamp - lastTime) / 1000, 0.05);
    lastTime = timestamp;
    const time = timestamp / 1000;

    // Update
    updatePlayer(player, keys, dt, layout.houses, layout.bounds);
    updateNPCs(npcs, dt, layout, player);
    updateCamera(cam, player, dt);

    // Hover detection
    const { wx, wy } = screenToWorld(mouseX, mouseY, cam);
    hoveredHouse = hitTestHouse(wx, wy);

    // ── Render ────────────────────────────────────────────────────────

    ctx.save();
    ctx.scale(dpr, dpr);
    const w = canvas.width / dpr;
    const h = canvas.height / dpr;

    // 1. Ground
    drawGround(ctx, cam, layout.bounds, w, h);

    // 2. Roads
    drawRoads(ctx, layout.roads, cam);

    // 3. Well at center
    drawWell(ctx, cam, layout.wellCenter.x, layout.wellCenter.y, time);

    // 4. Fences (behind houses)
    for (const fence of layout.fences) drawFence(ctx, fence, cam);

    // 5. Flowers & rocks (ground level)
    drawFlowers(ctx, layout.flowers, cam);
    drawRocks(ctx, layout.rocks, cam);

    // 6. Collect y-sorted entities (houses, trees, bushes, player)
    const entities = [];
    for (const h of layout.houses) entities.push({ y: h.y + h.h, type: "house", data: h });
    for (const t of layout.trees) entities.push({ y: t.y, type: "tree", data: t });
    for (const b of layout.bushes) entities.push({ y: b.y, type: "bush", data: b });
    for (const n of npcs) entities.push({ y: n.y, type: "npc", data: n });
    entities.push({ y: player.y, type: "player", data: player });

    entities.sort((a, b) => a.y - b.y);

    for (const ent of entities) {
      switch (ent.type) {
        case "house":
          drawHouse(ctx, ent.data, cam, ent.data === hoveredHouse);
          break;
        case "tree":
          drawTree(ctx, ent.data, cam);
          break;
        case "bush":
          drawBush(ctx, ent.data, cam);
          break;
        case "npc":
          drawNPC(ctx, ent.data, cam);
          break;
        case "player":
          drawPlayer(ctx, ent.data, cam);
          break;
      }
    }

    // 7. Lamp glow overlays
    for (const dec of layout.decorations) {
      if (dec.type === "lamp") drawLamp(ctx, dec, cam, time);
    }

    // 8. Hover label
    if (hoveredHouse) {
      drawHouseLabel(ctx, hoveredHouse, cam);
    }

    ctx.restore();
    animId = requestAnimationFrame(loop);
  }

  animId = requestAnimationFrame((t) => { lastTime = t; loop(t); });

  return {
    destroy() {
      cancelAnimationFrame(animId);
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
      canvas.removeEventListener("wheel", onWheel);
      canvas.removeEventListener("mousemove", onMouseMove);
      canvas.removeEventListener("click", onClick);
    },
    resize(w, h) {
      resizeCamera(cam, w, h);
    },
  };
}
