import React, { useState } from "react";
import GAMIFY_PREVIEW_MAP from "./GamifyPreviews";

const ACCENT = "#c0392b";

export default function GamifyCard({ viz, onClick }) {
  const [hov, setHov] = useState(false);
  const Preview = GAMIFY_PREVIEW_MAP[viz.id];
  const soon = viz.comingSoon;

  return (
    <div
      onClick={soon ? undefined : onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        position: "relative",
        background: hov && !soon ? "#1a1a1a" : "#151515",
        border: `1px solid ${hov && !soon ? ACCENT : "#222"}`,
        borderRadius: 14,
        padding: "28px 24px 24px",
        cursor: soon ? "default" : "pointer",
        transition: "all 0.3s ease",
        transform: hov && !soon ? "translateY(-4px) scale(1.02)" : "translateY(0) scale(1)",
        boxShadow: hov && !soon ? `0 12px 40px rgba(192,57,43,0.15)` : "0 2px 8px rgba(0,0,0,0.3)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 16,
        opacity: soon ? 0.5 : 1,
      }}
    >
      {soon && (
        <div style={{
          position: "absolute", top: 12, right: 12,
          padding: "3px 8px", borderRadius: 6,
          background: "#222", border: "1px solid #333",
          fontSize: 10, fontWeight: 700, color: "#888",
          letterSpacing: "0.5px", textTransform: "uppercase",
        }}>
          Coming Soon
        </div>
      )}
      <div style={{
        width: 100, height: 100,
        display: "flex", alignItems: "center", justifyContent: "center",
        opacity: hov && !soon ? 1 : 0.7,
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
