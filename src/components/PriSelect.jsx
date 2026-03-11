import React from "react";
import { inp } from "../styles";

export default function PriSelect({ value, onChange, small, showPh, dark }) {
  const b = small ? { fontSize: 13, padding: "7px 10px", width: 62 } : { width: 72 };
  return (
    <select value={value} onChange={(e) => onChange(e.target.value)} style={{ ...inp(dark), textAlign: "center", cursor: "pointer", color: value ? (dark ? "#e0e0e0" : "#333") : "#999", ...b }}>
      {showPh && <option value="" disabled>Priority</option>}
      {[1,2,3,4,5,6,7,8,9,10].map((n) => <option key={n} value={n}>{n}</option>)}
    </select>
  );
}
