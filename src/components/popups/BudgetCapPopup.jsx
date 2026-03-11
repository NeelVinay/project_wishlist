import React, { useState } from "react";
import Popup from "./Popup";
import { fmtMoney } from "../../utils/formatting";
import { inp } from "../../styles";

export default function BudgetCapPopup({ itemName, currentBudget, minBudget, onSave, onCancel, dark, showDontAsk, onDontAsk, currency }) {
  const [val, setVal] = useState(currentBudget ? String(currentBudget) : "");
  const [dontAsk, setDontAsk] = useState(false);
  const [err, setErr] = useState("");
  const sym = currency ? currency.symbol : "$";
  const save = () => {
    const n = parseFloat(val); const amt = isNaN(n) || n < 0 ? 0 : Math.round(n * 100) / 100;
    if (minBudget > 0 && amt < minBudget) { setErr("Budget cannot be lower than " + fmtMoney(minBudget, currency) + " (current sub-item total)."); return; }
    setErr(""); onSave(amt); if (dontAsk && onDontAsk) onDontAsk();
  };
  return (
    <Popup title={"Set budget cap for \"" + itemName + "\""} dark={dark}>
      <p style={{ margin: "0 0 14px", fontSize: 13, color: dark ? "#aaa" : "#666", lineHeight: 1.5 }}>This budget will be the maximum total across all sub-items.</p>
      <div style={{ position: "relative", marginBottom: 16 }}>
        <span style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", fontSize: 16, fontWeight: 600, color: dark ? "#e07a6b" : "#c0392b", pointerEvents: "none" }}>{sym}</span>
        <input value={val} onChange={(e) => { const v = e.target.value; if (v === "" || /^\d*\.?\d{0,2}$/.test(v)) setVal(v); }} autoFocus placeholder="Enter budget" onKeyDown={(e) => e.key === "Enter" && save()} style={{ ...inp(dark), width: "100%", boxSizing: "border-box", fontSize: 16, padding: "10px 12px 10px 28px" }} />
      </div>
      {err && <p style={{ margin: "0 0 10px", fontSize: 13, color: "#c0392b", fontWeight: 500 }}>{err}</p>}
      {showDontAsk && <label style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: dark ? "#777" : "#999", marginBottom: 14, cursor: "pointer" }}><input type="checkbox" checked={dontAsk} onChange={(e) => setDontAsk(e.target.checked)} style={{ accentColor: "#4285f4" }} />Don't ask me again</label>}
      <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
        <button onClick={onCancel} style={{ padding: "8px 18px", fontSize: 13, fontWeight: 600, borderRadius: 6, border: "none", background: dark ? "#333" : "#eee", color: dark ? "#ccc" : "#555", cursor: "pointer" }}>Cancel</button>
        <button onClick={save} style={{ padding: "8px 18px", fontSize: 13, fontWeight: 600, borderRadius: 6, border: "none", background: "#2a6f97", color: "#fff", cursor: "pointer" }}>Save</button>
      </div>
    </Popup>
  );
}
