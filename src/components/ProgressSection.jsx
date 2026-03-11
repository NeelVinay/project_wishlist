import React, { useState, useMemo } from "react";
import { getCompletionProgress, getSavingsProgress } from "../utils/calculations";

export default function ProgressSection({ items, dark }) {
  const [tab, setTab] = useState("completion");
  const compPct = useMemo(() => getCompletionProgress(items), [items]);
  const savePct = useMemo(() => getSavingsProgress(items), [items]);
  const activePct = tab === "completion" ? compPct : savePct;
  const inactivePct = tab === "completion" ? savePct : compPct;
  const barCol = (p) => {
    if (p <= 50) { const r = p / 50; return "rgb(231," + Math.round(76 + 80 * r) + "," + Math.round(60 - 42 * r) + ")"; }
    const r = (p - 50) / 50; return "rgb(" + Math.round(231 - 192 * r) + "," + Math.round(156 + 18 * r) + "," + Math.round(18 + 78 * r) + ")";
  };
  const bar = (pct, faded) => (
    <div style={{ width: "100%", height: 20, borderRadius: 10, background: dark ? "#1a1a1a" : "#e9ecef", overflow: "hidden", position: "relative", border: "1px solid " + (dark ? "#222" : "#ddd"), opacity: faded ? 0.35 : 1, transition: "opacity 0.4s" }}>
      <div style={{ height: "100%", borderRadius: 10, width: pct + "%", background: "linear-gradient(90deg," + barCol(Math.max(pct - 20, 0)) + "," + barCol(pct) + ")", transition: "width 0.5s ease", position: "relative", overflow: "hidden" }}>
        {pct > 0 && pct < 100 && <div style={{ position: "absolute", inset: 0, background: "linear-gradient(90deg,transparent 0%,rgba(255,255,255,0.2) 50%,transparent 100%)", animation: "shine 2s infinite" }} />}
      </div>
    </div>
  );
  return (
    <div style={{ marginTop: 20, marginBottom: 8 }}>
      <div style={{ display: "flex", gap: 4, marginBottom: 10 }}>
        {["completion", "savings"].map((t) => (
          <button key={t} onClick={() => setTab(t)} style={{ flex: 1, padding: "8px 12px", fontSize: 12, fontWeight: 600, borderRadius: 6, border: "none", cursor: "pointer", transition: "all 0.2s", background: tab === t ? (dark ? "#333" : "#1a1a2e") : (dark ? "#1a1a1a" : "#e9ecef"), color: tab === t ? "#fff" : (dark ? "#888" : "#777") }}>
            {t === "completion" ? "Completion (Priority Weighted)" : "Savings Progress"}
          </button>
        ))}
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
        <span style={{ fontSize: 13, fontWeight: 600, color: dark ? "#ccc" : "#555" }}>{tab === "completion" ? "Completion Progress" : "Savings Progress"}</span>
        <span style={{ fontSize: 13, fontWeight: 700, color: barCol(activePct) }}>{activePct}%</span>
      </div>
      <div style={{ position: "relative" }}>
        <div style={{ position: "relative", zIndex: 1 }}>{bar(activePct, false)}</div>
        <div style={{ position: "absolute", top: 4, left: 0, right: 0, zIndex: 0 }}>{bar(inactivePct, true)}</div>
      </div>
      <div style={{ display: "flex", gap: 16, marginTop: 8, justifyContent: "center" }}>
        <span style={{ fontSize: 10, color: dark ? "#666" : "#aaa" }}>{tab === "completion" ? "Weighted by item priority (1-10)" : "Total saved vs total budget"}</span>
      </div>
    </div>
  );
}
