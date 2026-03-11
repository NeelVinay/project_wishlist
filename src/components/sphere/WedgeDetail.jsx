import React from "react";
import { Html } from "@react-three/drei";
import { fmtMoney } from "../../utils/formatting";

export default function WedgeDetail({ item, total, currency, position }) {
  const pct = total > 0 ? Math.round((item.budget / total) * 100) : 0;
  const subs = item.subItems || [];

  return (
    <Html position={position} center style={{ pointerEvents: "none" }}>
      <div style={{
        width: 260, padding: 16, borderRadius: 10,
        background: "rgba(20,20,20,0.95)", border: "1px solid #333",
        boxShadow: "0 4px 20px rgba(0,0,0,0.6)",
        fontFamily: "'Inter',system-ui,-apple-system,sans-serif",
        pointerEvents: "none", userSelect: "none",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
          <span style={{ width: 14, height: 14, borderRadius: 4, background: item.chartColor || "#888", flexShrink: 0 }} />
          <span style={{ fontSize: 15, fontWeight: 700, color: "#e0e0e0" }}>{item.name}</span>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 5, marginBottom: subs.length > 0 ? 12 : 0 }}>
          <span style={{ fontSize: 13, color: "#aaa" }}>Budget: <strong style={{ color: "#ddd" }}>{fmtMoney(item.budget, currency)}</strong></span>
          <span style={{ fontSize: 13, color: "#aaa" }}>Share: <strong style={{ color: "#ddd" }}>{pct}%</strong> of total</span>
          {item.saved > 0 && (
            <span style={{ fontSize: 13, color: "#aaa" }}>Saved: <strong style={{ color: "#ddd" }}>{fmtMoney(item.saved, currency)}</strong></span>
          )}
        </div>
        {subs.length > 0 && (
          <div>
            <span style={{ fontSize: 11, fontWeight: 600, color: "#666", marginBottom: 6, display: "block" }}>Sub-items:</span>
            <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
              {subs.map((sub) => {
                const sp = item.budget > 0 ? Math.round(((sub.budget || 0) / item.budget) * 100) : 0;
                return (
                  <div key={sub.id} style={{
                    display: "flex", alignItems: "center", justifyContent: "space-between",
                    padding: "4px 8px", borderRadius: 4, background: "#111", fontSize: 12,
                  }}>
                    <span style={{ color: "#ccc" }}>{sub.name}</span>
                    <span style={{ color: "#777", whiteSpace: "nowrap", marginLeft: 12 }}>
                      {fmtMoney(sub.budget || 0, currency)} ({sp}%)
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </Html>
  );
}
