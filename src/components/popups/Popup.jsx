import React from "react";

export default function Popup({ title, children, dark }) {
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 }}>
      <div style={{ background: dark ? "#1a1a1a" : "#fff", borderRadius: 12, padding: "24px 28px", boxShadow: "0 8px 30px rgba(0,0,0,0.2)", maxWidth: 420, width: "90%", color: dark ? "#e0e0e0" : "#1a1a2e" }}>
        {title && <h3 style={{ margin: "0 0 12px", fontSize: 16, fontWeight: 600 }}>{title}</h3>}
        {children}
      </div>
    </div>
  );
}
