import React from "react";
import { getSortLabel } from "../utils/sorting";
import { inp } from "../styles";

export default function SearchSort({ searchQuery, onSearch, sortMode, onSort, reversed, onReverse, dark }) {
  return (
    <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap", marginTop: 16 }}>
      <div style={{ flex: 1, minWidth: 140, position: "relative" }}>
        <span style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", fontSize: 14, color: "#aaa", pointerEvents: "none" }}>{"\uD83D\uDD0D"}</span>
        <input value={searchQuery} onChange={(e) => onSearch(e.target.value)} placeholder="Search items..." style={{ ...inp(dark), width: "100%", paddingLeft: 32, boxSizing: "border-box" }} />
      </div>
      <select value={sortMode} onChange={(e) => onSort(e.target.value)} style={{ ...inp(dark), cursor: "pointer", color: dark ? "#ccc" : "#555", minWidth: 130, appearance: "auto" }}>
        <option value="priority">Sort: Priority</option>
        <option value="alpha">Sort: Alphabetical</option>
        <option value="date">Sort: Date Added</option>
        <option value="purchasable">Sort: Purchasable</option>
        <option value="manual">Sort: Manual</option>
      </select>
      <button onClick={onReverse} title={"Currently: " + getSortLabel(sortMode, reversed)} disabled={sortMode === "manual"}
        style={{ ...inp(dark), display: "inline-flex", alignItems: "center", justifyContent: "center", width: 42, height: 42, padding: 0, cursor: sortMode === "manual" ? "default" : "pointer", background: reversed ? "rgba(192,57,43,0.15)" : (dark ? "#222" : "#fafafa"), borderColor: reversed ? "#c0392b" : (dark ? "#333" : "#e0e0e0"), color: reversed ? "#c0392b" : "#999", fontSize: 18, fontWeight: 700, flexShrink: 0, opacity: sortMode === "manual" ? 0.4 : 1 }}>{"\u21C5"}</button>
    </div>
  );
}
