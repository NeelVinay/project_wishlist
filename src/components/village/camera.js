export function createCamera(w, h) {
  return {
    x: 0, y: 0,
    targetScale: 48,
    scale: 48,
    hw: w / 2,
    hh: h / 2,
    minScale: 24,
    maxScale: 96,
  };
}

export function updateCamera(cam, player, dt) {
  // Smooth follow player
  const lerpF = 1 - Math.pow(0.001, dt);
  cam.x += (player.x - cam.x) * lerpF;
  cam.y += (player.y - cam.y) * lerpF;

  // Smooth zoom
  cam.scale += (cam.targetScale - cam.scale) * lerpF;
}

export function resizeCamera(cam, w, h) {
  cam.hw = w / 2;
  cam.hh = h / 2;
}

export function worldToScreen(wx, wy, cam) {
  return {
    sx: (wx - cam.x) * cam.scale + cam.hw,
    sy: (wy - cam.y) * cam.scale + cam.hh,
  };
}

export function screenToWorld(sx, sy, cam) {
  return {
    wx: (sx - cam.hw) / cam.scale + cam.x,
    wy: (sy - cam.hh) / cam.scale + cam.y,
  };
}

export function handleZoom(cam, deltaY) {
  const zoomFactor = deltaY > 0 ? 0.9 : 1.1;
  cam.targetScale = Math.max(cam.minScale, Math.min(cam.maxScale, cam.targetScale * zoomFactor));
}
