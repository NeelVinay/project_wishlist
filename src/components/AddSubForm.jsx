import React, { useState } from "react";
import PriSelect from "./PriSelect";
import { inp, btnAd, errS } from "../styles";

export default function AddSubForm({ onAdd, dark, currency }) {
  const [n, setN] = useState(""); const [p, setP] = useState(""); const [b, setB] = useState(""); const [sv, setSv] = useState(""); const [e, setE] = useState("");
  const sym = currency ? currency.symbol : "$";
  const add = () => {
    const t = n.trim(), pr = Number(p); if (!t) return setE("Name can't be empty."); if (!Number.isInteger(pr) || pr < 1 || pr > 10) return setE("Priority must be 1-10.");
    const bv = parseFloat(b), svv = parseFloat(sv);
    onAdd({ name: t, priority: pr, budget: isNaN(bv) || bv < 0 ? 0 : Math.round(bv * 100) / 100, saved: isNaN(svv) || svv < 0 ? 0 : Math.round(svv * 100) / 100 });
    setN(""); setP(""); setB(""); setSv(""); setE("");
  };
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6, marginTop: 6 }}>
      <div style={{ display: "flex", gap: 6, alignItems: "center", flexWrap: "wrap" }}>
        <input value={n} onChange={(ev) => setN(ev.target.value)} onKeyDown={(ev) => ev.key === "Enter" && add()} placeholder="Add sub-item..." style={{ ...inp(dark), flex: 1, minWidth: 80, fontSize: 13, padding: "7px 10px" }} />
        <div style={{ position: "relative", flexShrink: 0 }}><span style={{ position: "absolute", left: 8, top: "50%", transform: "translateY(-50%)", fontSize: 12, color: dark ? "#e07a6b" : "#c0392b", fontWeight: 600, pointerEvents: "none" }}>{sym}</span><input value={sv} onChange={(ev) => { const v = ev.target.value; if (v === "" || /^\d*\.?\d{0,2}$/.test(v)) setSv(v); }} onKeyDown={(ev) => ev.key === "Enter" && add()} placeholder="Saved" style={{ ...inp(dark), width: 68, fontSize: 13, padding: "7px 10px 7px 20px" }} /></div>
        <div style={{ position: "relative", flexShrink: 0 }}><span style={{ position: "absolute", left: 8, top: "50%", transform: "translateY(-50%)", fontSize: 12, color: dark ? "#e07a6b" : "#c0392b", fontWeight: 600, pointerEvents: "none" }}>{sym}</span><input value={b} onChange={(ev) => { const v = ev.target.value; if (v === "" || /^\d*\.?\d{0,2}$/.test(v)) setB(v); }} onKeyDown={(ev) => ev.key === "Enter" && add()} placeholder="Budget" style={{ ...inp(dark), width: 76, fontSize: 13, padding: "7px 10px 7px 20px" }} /></div>
        <PriSelect value={p} onChange={setP} small showPh dark={dark} />
        <button onClick={add} style={{ ...btnAd, padding: "7px 14px", fontSize: 13 }}>Add</button>
      </div>
      {e && <p style={errS}>{e}</p>}
    </div>
  );
}
