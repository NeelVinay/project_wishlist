import React, { useState } from "react";
import PriBadge from "./PriBadge";
import { getAvgPri } from "../utils/calculations";
import { fmtMoney, formatDate } from "../utils/formatting";
import { icnBtn } from "../styles";

export default function CompletedRoot({ item, dark, currency }) {
  const [exp, setExp] = useState(false);
  return (
    <div style={{ borderRadius: 8, border: "1px solid " + (dark ? "#222" : "#eee"), overflow: "hidden", opacity: 0.75 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 14px", background: dark ? "#1a1a1a" : "#f8f9fa" }}>
        <button onClick={() => setExp(!exp)} style={{ ...icnBtn(dark), fontSize: 10, transform: exp ? "rotate(90deg)" : "rotate(0deg)", transition: "transform 0.15s", color: "#27ae60" }}>{"\u25B6"}</button>
        <span style={{ color: "#27ae60", fontWeight: 700, fontSize: 14 }}>{"\u2713"}</span>
        <PriBadge value={getAvgPri(item)} small />
        <div style={{ flex: 1, minWidth: 0 }}><span style={{ fontSize: 14, color: dark ? "#ccc" : "#333", fontWeight: 500, textDecoration: "line-through" }}>{item.name}</span></div>
        {(item.budget || 0) > 0 && <span style={{ fontSize: 12, color: dark ? "#e07a6b" : "#c0392b", fontWeight: 600, flexShrink: 0 }}>{fmtMoney(item.saved || 0, currency)} saved</span>}
        <span style={{ fontSize: 10, color: dark ? "#444" : "#bbb", whiteSpace: "nowrap", flexShrink: 0 }}>{formatDate(item.createdAt)}</span>
      </div>
      {exp && item.subItems && (
        <div style={{ padding: "6px 14px 10px 48px", background: dark ? "#111" : "#f1f3f5", borderTop: "1px solid " + (dark ? "#222" : "#e9ecef"), display: "flex", flexDirection: "column", gap: 4 }}>
          {item.subItems.map((s) => (
            <div key={"cs-" + s.id} style={{ display: "flex", alignItems: "center", gap: 8, padding: "5px 10px", background: dark ? "#1a1a1a" : "#fff", borderRadius: 6, border: "1px solid " + (dark ? "#222" : "#e9ecef") }}>
              <span style={{ color: "#27ae60", fontWeight: 700, fontSize: 12 }}>{"\u2713"}</span>
              <PriBadge value={s.priority} small />
              <span style={{ flex: 1, fontSize: 13, color: dark ? "#ccc" : "#333", textDecoration: "line-through" }}>{s.name}</span>
              {(s.budget || 0) > 0 && <span style={{ fontSize: 11, color: dark ? "#e07a6b" : "#c0392b", fontWeight: 600, flexShrink: 0 }}>{fmtMoney(s.saved || 0, currency)} saved</span>}
              <span style={{ fontSize: 10, color: dark ? "#444" : "#bbb", whiteSpace: "nowrap", flexShrink: 0 }}>{formatDate(s.createdAt)}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
