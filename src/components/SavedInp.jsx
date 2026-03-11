import React, { useState } from "react";
import { fmtMoney } from "../utils/formatting";
import { inp } from "../styles";

export default function SavedInp({ value, budget, onChange, dark, small, editable, currency }) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value ? String(value) : "");
  const exceeds = budget > 0 && (value || 0) > budget;
  const matches = budget > 0 && (value || 0) === budget;
  const sym = currency ? currency.symbol : "$";
  const commit = () => { const n = parseFloat(draft); onChange(draft === "" ? null : (isNaN(n) || n < 0 ? 0 : Math.round(n * 100) / 100)); setEditing(false); };
  if (editing && editable) {
    return (<div style={{ display: "inline-flex", alignItems: "center", position: "relative", flexShrink: 0 }}><span style={{ position: "absolute", left: 6, top: "50%", transform: "translateY(-50%)", fontSize: small ? 11 : 12, color: dark ? "#e07a6b" : "#c0392b", fontWeight: 600, pointerEvents: "none" }}>{sym}</span><input value={draft} onChange={(e) => { const v = e.target.value; if (v === "" || /^\d*\.?\d{0,2}$/.test(v)) setDraft(v); }} onBlur={commit} onKeyDown={(e) => e.key === "Enter" && commit()} autoFocus placeholder="0" style={{ ...inp(dark), width: small ? 64 : 76, fontSize: small ? 11 : 12, padding: "3px 6px 3px " + (small ? 18 : 20) + "px" }} /></div>);
  }
  const has = value !== null && value !== undefined;
  const txt = has ? fmtMoney(value, currency) + " saved" : (small ? "Saved" : "Saved");
  const ttip = exceeds ? "Amount saved exceeds budget!" : matches ? "Amount saved matches budget!" : editable ? "Click to set saved amount" : "";
  const border = "1px solid " + (dark ? "#333" : "#e0e0e0");
  if (!editable) return (<span title={ttip} style={{ fontSize: small ? 11 : 12, fontWeight: 600, padding: small ? "2px 6px" : "3px 8px", borderRadius: 4, flexShrink: 0, whiteSpace: "nowrap", color: has ? (dark ? "#e07a6b" : "#c0392b") : (dark ? "#555" : "#bbb"), border }}>{txt}</span>);
  return (<button onClick={() => { setDraft(has ? String(value) : ""); setEditing(true); }} title={ttip} style={{ background: "none", borderRadius: 4, padding: small ? "2px 6px" : "3px 8px", fontSize: small ? 11 : 12, color: has ? (dark ? "#e07a6b" : "#c0392b") : (dark ? "#555" : "#bbb"), cursor: "pointer", fontWeight: 600, flexShrink: 0, whiteSpace: "nowrap", border, transition: "all 0.2s" }}>{txt}</button>);
}
