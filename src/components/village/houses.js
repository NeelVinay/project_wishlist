import { worldToScreen } from "./camera";

const ACCENT = "#c0392b";

// House color based on savings progress
function houseColor(progress) {
  if (progress <= 0) return "#1a1a1a";       // black — no savings
  if (progress >= 1) return "#3a6a9f";        // blue — fully saved
  return "#6b4c3b";                           // brown — in progress
}

export function drawHouse(ctx, house, cam, isHovered) {
  const { sx, sy } = worldToScreen(house.x, house.y, cam);
  const sw = house.w * cam.scale;
  const sh = house.h * cam.scale;
  const color = houseColor(house.progress);

  // Simple rectangle house
  ctx.fillStyle = color;
  ctx.fillRect(sx, sy, sw, sh);

  // Outline
  ctx.strokeStyle = "rgba(0,0,0,0.3)";
  ctx.lineWidth = 1;
  ctx.strokeRect(sx, sy, sw, sh);

  // Simple peaked roof
  const roofH = sh * 0.4;
  ctx.fillStyle = "#4a3020";
  ctx.beginPath();
  ctx.moveTo(sx - 2, sy);
  ctx.lineTo(sx + sw / 2, sy - roofH);
  ctx.lineTo(sx + sw + 2, sy);
  ctx.closePath();
  ctx.fill();

  // Hover highlight
  if (isHovered) {
    ctx.strokeStyle = ACCENT;
    ctx.lineWidth = 2;
    ctx.strokeRect(sx - 2, sy - 2, sw + 4, sh + 4);
  }
}

// Draw name label above house
export function drawHouseLabel(ctx, house, cam) {
  const { sx, sy } = worldToScreen(house.x + house.w / 2, house.y, cam);
  const roofH = house.h * cam.scale * 0.4;
  const ly = sy - roofH - 10;
  const name = house.item.name;

  ctx.font = `bold ${Math.max(10, 12 * (cam.scale / 48))}px Inter, system-ui, sans-serif`;
  const tw = ctx.measureText(name).width;
  const px = 6, py = 3;

  ctx.fillStyle = "rgba(0,0,0,0.75)";
  ctx.beginPath();
  ctx.roundRect(sx - tw / 2 - px, ly - 7 - py, tw + px * 2, 14 + py * 2, 6);
  ctx.fill();

  ctx.strokeStyle = ACCENT;
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.roundRect(sx - tw / 2 - px, ly - 7 - py, tw + px * 2, 14 + py * 2, 6);
  ctx.stroke();

  ctx.fillStyle = "#fff";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(name, sx, ly);
}
