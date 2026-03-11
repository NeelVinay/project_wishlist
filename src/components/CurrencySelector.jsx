import React, { useState, useMemo, useRef, useEffect } from "react";
import { CURRENCIES } from "../constants/currencies";
import { inp } from "../styles";

export default function CurrencySelector({ currency, onChange, dark }) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const filtered = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase().trim();
    return CURRENCIES.filter((c) => c.code.toLowerCase().includes(q) || c.name.toLowerCase().includes(q) || c.country.toLowerCase().includes(q) || c.symbol.toLowerCase().includes(q)).slice(0, 8);
  }, [query]);
  useEffect(() => {
    const h = (e) => { if (ref.current && !ref.current.contains(e.target)) { setOpen(false); setQuery(""); } };
    document.addEventListener("mousedown", h); return () => document.removeEventListener("mousedown", h);
  }, []);
  return (
    <div ref={ref} style={{ position: "relative", marginBottom: 16 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <span style={{ fontSize: 13, fontWeight: 600, color: dark ? "#888" : "#777" }}>Currency:</span>
        <span style={{ fontSize: 13, fontWeight: 600, color: dark ? "#e07a6b" : "#c0392b" }}>{currency.symbol} ({currency.code})</span>
        <div style={{ position: "relative", flex: 1, maxWidth: 280 }}>
          <input value={query} onChange={(e) => { setQuery(e.target.value); setOpen(true); }} onFocus={() => { if (query.trim()) setOpen(true); }}
            placeholder="Search currency..." style={{ ...inp(dark), width: "100%", boxSizing: "border-box", fontSize: 13, padding: "8px 12px" }} />
          {open && filtered.length > 0 && (
            <div style={{ position: "absolute", top: "100%", left: 0, right: 0, marginTop: 4, background: dark ? "#1a1a1a" : "#fff", border: "1px solid " + (dark ? "#333" : "#e0e0e0"), borderRadius: 8, boxShadow: "0 4px 16px rgba(0,0,0,0.15)", zIndex: 100, overflow: "hidden" }}>
              {filtered.map((c) => (
                <button key={c.code} onClick={() => { onChange(c); setQuery(""); setOpen(false); }}
                  style={{ display: "flex", alignItems: "center", width: "100%", padding: "10px 14px", background: "none", border: "none", borderBottom: "1px solid " + (dark ? "#222" : "#f0f0f0"), cursor: "pointer", textAlign: "left", color: dark ? "#e0e0e0" : "#333", fontSize: 13 }}
                  onMouseEnter={(e) => e.currentTarget.style.background = dark ? "#222" : "#f5f5f5"}
                  onMouseLeave={(e) => e.currentTarget.style.background = "none"}>
                  <span style={{ fontWeight: 700, width: 44, flexShrink: 0, color: dark ? "#e07a6b" : "#c0392b" }}>{c.symbol}</span>
                  <span style={{ fontWeight: 600, width: 44, flexShrink: 0 }}>{c.code}</span>
                  <span style={{ color: dark ? "#888" : "#999" }}>{c.name} ({c.country})</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
