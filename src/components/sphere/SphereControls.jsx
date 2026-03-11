import React from "react";

export default function SphereControls({ exploded, onToggleExplode }) {
  return (
    <div style={{
      position: "absolute", bottom: 28, left: "50%", transform: "translateX(-50%)",
      display: "flex", gap: 10, zIndex: 10,
      fontFamily: "'Inter',system-ui,-apple-system,sans-serif",
    }}>
      <button
        onClick={onToggleExplode}
        style={{
          padding: "8px 18px", borderRadius: 8,
          background: exploded ? "rgba(192,57,43,0.85)" : "rgba(26,26,46,0.85)",
          border: "1px solid " + (exploded ? "#e74c3c" : "#333"),
          color: "#e0e0e0", fontSize: 13, fontWeight: 600,
          cursor: "pointer", backdropFilter: "blur(8px)",
          transition: "background 0.3s ease, border-color 0.3s ease",
        }}
      >
        {exploded ? "Collapse" : "Exploded View"}
      </button>
    </div>
  );
}
