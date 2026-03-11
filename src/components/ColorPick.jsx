import React from "react";

export default function ColorPick({ value, onChange }) {
  return <input type="color" value={value || "#888888"} onChange={(e) => onChange(e.target.value)} title="Pick chart color" style={{ width: 22, height: 22, border: "none", borderRadius: 4, cursor: "pointer", padding: 0, flexShrink: 0, background: "none" }} />;
}
