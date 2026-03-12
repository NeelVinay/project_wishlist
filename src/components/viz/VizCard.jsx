import React, { useState } from "react";
import PREVIEW_MAP from "./VizPreviews";

const ACCENT = "#c0392b";

export default function VizCard({ viz, onClick }) {
  const [hov, setHov] = useState(false);
  const Preview = PREVIEW_MAP[viz.id];

  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        background: hov ? "#1a1a1a" : "#151515",
        border: `1px solid ${hov ? ACCENT : "#222"}`,
        borderRadius: 14,
        padding: "28px 24px 24px",
        cursor: "pointer",
        transition: "all 0.3s ease",
        transform: hov ? "translateY(-4px) scale(1.02)" : "translateY(0) scale(1)",
        boxShadow: hov ? `0 12px 40px rgba(192,57,43,0.15)` : "0 2px 8px rgba(0,0,0,0.3)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 16,
      }}
    >
      <div style={{
        width: 100, height: 100,
        display: "flex", alignItems: "center", justifyContent: "center",
        opacity: hov ? 1 : 0.7,
        transition: "opacity 0.3s ease",
      }}>
        {Preview && <Preview />}
      </div>
      <div style={{ textAlign: "center" }}>
        <div style={{
          fontSize: 16, fontWeight: 700, color: "#fff",
          marginBottom: 6, letterSpacing: "-0.3px",
        }}>
          {viz.name}
        </div>
        <div style={{
          fontSize: 12, color: "rgba(255,255,255,0.4)",
          lineHeight: 1.5, maxWidth: 240,
        }}>
          {viz.description}
        </div>
      </div>
    </div>
  );
}
