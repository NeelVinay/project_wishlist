import React, { useState } from "react";
import { fmtMoney } from "../utils/formatting";
import { inp } from "../styles";

export default function BudgetInp({ value, onChange, dark, small, currency }) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value ? String(value) : "");
  const sym = currency ? currency.symbol : "$";
  const commit = () => { const n = parseFloat(draft); onChange(isNaN(n) || n < 0 ? 0 : Math.round(n * 100) / 100); setEditing(false); };
  if (editing) return (<div style={{ display: "inline-flex", alignItems: "center", position: "relative", flexShrink: 0 }}><span style={{ position: "absolute", left: 6, top: "50%", transform: "translateY(-50%)", fontSize: small ? 11 : 12, color: dark ? "#e07a6b" : "#c0392b", fontWeight: 600, pointerEvents: "none" }}>{sym}</span><input value={draft} onChange={(e) => { const v = e.target.value; if (v === "" || /^\d*\.?\d{0,2}$/.test(v)) setDraft(v); }} onBlur={commit} onKeyDown={(e) => e.key === "Enter" && commit()} autoFocus placeholder="0" style={{ ...inp(dark), width: small ? 64 : 76, fontSize: small ? 11 : 12, padding: "3px 6px 3px " + (small ? 18 : 20) + "px" }} /></div>);
  return (<button onClick={() => { setDraft(value ? String(value) : ""); setEditing(true); }} title="Click to set budget" style={{ background: "none", border: "1px solid " + (dark ? "#333" : "#e0e0e0"), borderRadius: 4, padding: small ? "2px 6px" : "3px 8px", fontSize: small ? 11 : 12, color: (value || 0) > 0 ? (dark ? "#e07a6b" : "#c0392b") : (dark ? "#555" : "#bbb"), cursor: "pointer", fontWeight: 600, flexShrink: 0, whiteSpace: "nowrap" }}>{(value || 0) > 0 ? fmtMoney(value, currency) : (small ? sym : sym + " Budget")}</button>);
}
