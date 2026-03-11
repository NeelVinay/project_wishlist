import React, { useState } from "react";
import { getItemBudget } from "../utils/calculations";
import { fmtMoney } from "../utils/formatting";

export default function DonutChart({ items, dark, currency }) {
  const [hovered, setHovered] = useState(null);
  const total = items.reduce((s, i) => s + getItemBudget(i), 0);
  if (total === 0) return null;

  const pad = 10;
  const outerR = 80, baseW = 28, hoverW = 38;
  const svgDim = (outerR + hoverW / 2 + pad) * 2;
  const ctr = svgDim / 2;
  const r = outerR;
  const circ = 2 * Math.PI * r;

  let cum = 0;
  const segs = items.map((item) => {
    const val = getItemBudget(item);
    if (val === 0) return null;
    const pct = val / total, off = cum; cum += pct;
    return { id: item.id, name: item.name, val, pct, off, color: item.chartColor || "#888", subItems: item.subItems || [], saved: item.saved || 0 };
  }).filter(Boolean);

  const hSeg = hovered != null ? segs.find((s) => s.id === hovered) : null;

  const arcPath = (seg, sw) => {
    if (seg.pct >= 0.9999) {
      const innerR = r - sw / 2, outerRad = r + sw / 2;
      return "M " + (ctr - outerRad) + " " + ctr +
        " A " + outerRad + " " + outerRad + " 0 1 1 " + (ctr + outerRad) + " " + ctr +
        " A " + outerRad + " " + outerRad + " 0 1 1 " + (ctr - outerRad) + " " + ctr +
        " Z M " + (ctr - innerR) + " " + ctr +
        " A " + innerR + " " + innerR + " 0 1 0 " + (ctr + innerR) + " " + ctr +
        " A " + innerR + " " + innerR + " 0 1 0 " + (ctr - innerR) + " " + ctr + " Z";
    }
    const startAngle = seg.off * 2 * Math.PI - Math.PI / 2;
    const endAngle = (seg.off + seg.pct) * 2 * Math.PI - Math.PI / 2;
    const innerR = r - sw / 2, outerRad = r + sw / 2;
    const cos1 = Math.cos(startAngle), sin1 = Math.sin(startAngle);
    const cos2 = Math.cos(endAngle), sin2 = Math.sin(endAngle);
    const large = seg.pct > 0.5 ? 1 : 0;
    const ox1 = ctr + outerRad * cos1, oy1 = ctr + outerRad * sin1;
    const ox2 = ctr + outerRad * cos2, oy2 = ctr + outerRad * sin2;
    const ix2 = ctr + innerR * cos2, iy2 = ctr + innerR * sin2;
    const ix1 = ctr + innerR * cos1, iy1 = ctr + innerR * sin1;
    return "M " + ox1 + " " + oy1 + " A " + outerRad + " " + outerRad + " 0 " + large + " 1 " + ox2 + " " + oy2 + " L " + ix2 + " " + iy2 + " A " + innerR + " " + innerR + " 0 " + large + " 0 " + ix1 + " " + iy1 + " Z";
  };

  return (
    <div style={{ marginTop: 28, display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
      <span style={{ fontSize: 13, fontWeight: 600, color: dark ? "#ccc" : "#555" }}>Budget Breakdown</span>
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "center", gap: 40 }}>
        <div style={{ width: svgDim, height: svgDim, flexShrink: 0, position: "relative" }}>
          <svg width={svgDim} height={svgDim} viewBox={"0 0 " + svgDim + " " + svgDim} onMouseLeave={() => setHovered(null)}>
            <circle cx={ctr} cy={ctr} r={r} fill="none" stroke={dark ? "#222" : "#e9ecef"} strokeWidth={baseW} />
            {segs.map((seg) => (
              <circle key={"v-" + seg.id} cx={ctr} cy={ctr} r={r} fill="none"
                stroke={seg.color}
                strokeWidth={hovered === seg.id ? hoverW : baseW}
                strokeDasharray={seg.pct * circ + " " + circ}
                strokeDashoffset={-seg.off * circ}
                transform={"rotate(-90 " + ctr + " " + ctr + ")"}
                opacity={hovered != null && hovered !== seg.id ? 0.15 : 1}
                style={{ transition: "stroke-width 0.5s ease, opacity 0.4s ease", pointerEvents: "none" }}
              />
            ))}
            <rect x="0" y="0" width={svgDim} height={svgDim} fill="transparent" style={{ cursor: "default" }} onMouseEnter={() => setHovered(null)} />
            {segs.map((seg) => (
              <path key={"h-" + seg.id} d={arcPath(seg, baseW)} fill="transparent" style={{ cursor: "pointer" }} onMouseEnter={() => setHovered(seg.id)} />
            ))}
            <circle cx={ctr} cy={ctr} r={r - baseW / 2} fill="transparent" style={{ cursor: "default" }} onMouseEnter={() => setHovered(null)} />
          </svg>
          <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", textAlign: "center", pointerEvents: "none" }}>
            <div style={{ fontSize: 20, fontWeight: 700, color: dark ? "#e0e0e0" : "#1a1a2e" }}>{fmtMoney(total, currency)}</div>
            <div style={{ fontSize: 10, color: dark ? "#777" : "#999" }}>Total</div>
          </div>
        </div>
        <div style={{ width: 280, flexShrink: 0, padding: 16, borderRadius: 10, minHeight: 180, border: "1px solid " + (dark ? "#333" : "#ccc"), background: dark ? "#1a1a1a" : "#fafafa", boxShadow: "0 2px 6px " + (dark ? "rgba(0,0,0,0.3)" : "rgba(0,0,0,0.08)"), opacity: hSeg ? 1 : 0.5, transform: hSeg ? "translateY(0px)" : "translateY(6px)", transition: "opacity 0.4s ease, transform 0.4s ease" }}>
          {hSeg ? (
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
                <span style={{ width: 16, height: 16, borderRadius: 4, background: hSeg.color, display: "inline-block", flexShrink: 0 }} />
                <span style={{ fontSize: 16, fontWeight: 700, color: dark ? "#e0e0e0" : "#1a1a2e" }}>{hSeg.name}</span>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 12 }}>
                <span style={{ fontSize: 13, color: dark ? "#aaa" : "#666" }}>Budget: <strong>{fmtMoney(hSeg.val, currency)}</strong></span>
                <span style={{ fontSize: 13, color: dark ? "#aaa" : "#666" }}>Share: <strong>{Math.round(hSeg.pct * 100)}%</strong> of total</span>
                {hSeg.saved > 0 && <span style={{ fontSize: 13, color: dark ? "#aaa" : "#666" }}>Saved: <strong>{fmtMoney(hSeg.saved, currency)}</strong></span>}
              </div>
              {hSeg.subItems.length > 0 && (
                <div>
                  <span style={{ fontSize: 12, fontWeight: 600, color: dark ? "#888" : "#999", marginBottom: 6, display: "block" }}>Sub-items:</span>
                  <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                    {hSeg.subItems.map((sub) => {
                      const sp = hSeg.val > 0 ? Math.round(((sub.budget || 0) / hSeg.val) * 100) : 0;
                      return (
                        <div key={sub.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "4px 8px", borderRadius: 4, background: dark ? "#111" : "#f0f0f0", fontSize: 12 }}>
                          <span style={{ color: dark ? "#ccc" : "#444" }}>{sub.name}</span>
                          <span style={{ color: dark ? "#888" : "#999", whiteSpace: "nowrap", marginLeft: 12 }}>{fmtMoney(sub.budget || 0, currency)} ({sp}%)</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: 148, color: dark ? "#555" : "#bbb", fontSize: 13, fontStyle: "italic" }}>
              Hover over a segment to see details
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
