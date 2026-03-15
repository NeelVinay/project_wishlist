import React from "react";
import { fmtMoney } from "../../utils/formatting";

export default function HouseDetailOverlay({ item, currency, onClose }) {
  const pct = item.budget > 0 ? Math.round((item.saved / item.budget) * 100) : 0;
  const subs = item.subItems || [];

  return (
    <div style={{
      position: "absolute", right: 28, top: "50%", transform: "translateY(-50%)",
      width: 280, padding: 20, borderRadius: 12,
      background: "rgba(20,20,20,0.95)", border: "1px solid #333",
      boxShadow: "0 4px 20px rgba(0,0,0,0.6)",
      fontFamily: "'Inter',system-ui,-apple-system,sans-serif",
      zIndex: 10, backdropFilter: "blur(8px)",
    }}>
      <button
        onClick={onClose}
        style={{
          position: "absolute", top: 10, right: 12,
          background: "none", border: "none", color: "#666",
          fontSize: 18, cursor: "pointer", padding: 0, lineHeight: 1,
        }}
      >
        ✕
      </button>

      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
        <span style={{ width: 14, height: 14, borderRadius: 4, background: item.chartColor || "#888", flexShrink: 0 }} />
        <span style={{ fontSize: 15, fontWeight: 700, color: "#e0e0e0" }}>{item.name}</span>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 12 }}>
        <span style={{ fontSize: 13, color: "#aaa" }}>
          Budget: <strong style={{ color: "#ddd" }}>{fmtMoney(item.budget, currency)}</strong>
        </span>
        <span style={{ fontSize: 13, color: "#aaa" }}>
          Saved: <strong style={{ color: "#ddd" }}>{fmtMoney(item.saved, currency)}</strong>
        </span>
        <span style={{ fontSize: 13, color: "#aaa" }}>
          Priority: <strong style={{ color: "#ddd" }}>{item.priority}</strong>
        </span>
      </div>

      {/* Progress bar */}
      <div style={{
        width: "100%", height: 6, borderRadius: 3,
        background: "#222", marginBottom: subs.length > 0 ? 14 : 0,
      }}>
        <div style={{
          width: `${Math.min(pct, 100)}%`, height: "100%", borderRadius: 3,
          background: pct >= 100 ? "#27ae60" : "#c0392b",
          transition: "width 0.3s ease",
        }} />
      </div>

      {subs.length > 0 && (
        <div>
          <span style={{ fontSize: 11, fontWeight: 600, color: "#666", marginBottom: 6, display: "block" }}>
            Sub-items:
          </span>
          <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
            {subs.map((sub) => (
              <div key={sub.id} style={{
                display: "flex", alignItems: "center", justifyContent: "space-between",
                padding: "4px 8px", borderRadius: 4, background: "#111", fontSize: 12,
              }}>
                <span style={{ color: "#ccc" }}>{sub.name}</span>
                <span style={{ color: "#777", whiteSpace: "nowrap", marginLeft: 12 }}>
                  {fmtMoney(sub.budget || 0, currency)}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {item.completed && (
        <div style={{
          marginTop: 12, padding: "4px 10px", borderRadius: 4,
          background: "rgba(39,174,96,0.15)", color: "#27ae60",
          fontSize: 12, fontWeight: 600, textAlign: "center",
        }}>
          Completed
        </div>
      )}
    </div>
  );
}
