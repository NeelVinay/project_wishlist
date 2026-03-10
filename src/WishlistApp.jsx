import React, { useState, useCallback, useMemo, useRef, useEffect } from "react";

let nextId = Date.now();
const generateId = () => nextId++;
const randomColor = () => {
  const h = Math.floor(Math.random() * 360), s = 65, l = 55;
  const a = s / 100, b = l / 100;
  const f = (n) => { const k = (n + h / 30) % 12; const c = b - a * Math.min(b, 1 - b) * Math.max(-1, Math.min(k - 3, 9 - k, 1)); return Math.round(255 * c).toString(16).padStart(2, "0"); };
  return "#" + f(0) + f(8) + f(4);
};

const CURRENCIES = [
  { code: "USD", symbol: "$", name: "US Dollar", country: "United States", decimals: 2 },
  { code: "EUR", symbol: "\u20AC", name: "Euro", country: "Europe", decimals: 2 },
  { code: "GBP", symbol: "\u00A3", name: "British Pound", country: "United Kingdom", decimals: 2 },
  { code: "JPY", symbol: "\u00A5", name: "Japanese Yen", country: "Japan", decimals: 0 },
  { code: "CNY", symbol: "\u00A5", name: "Chinese Yuan", country: "China", decimals: 2 },
  { code: "CHF", symbol: "CHF", name: "Swiss Franc", country: "Switzerland", decimals: 2 },
  { code: "CAD", symbol: "C$", name: "Canadian Dollar", country: "Canada", decimals: 2 },
  { code: "AUD", symbol: "A$", name: "Australian Dollar", country: "Australia", decimals: 2 },
  { code: "NZD", symbol: "NZ$", name: "New Zealand Dollar", country: "New Zealand", decimals: 2 },
  { code: "INR", symbol: "\u20B9", name: "Indian Rupee", country: "India", decimals: 2 },
  { code: "KRW", symbol: "\u20A9", name: "South Korean Won", country: "South Korea", decimals: 0 },
  { code: "BRL", symbol: "R$", name: "Brazilian Real", country: "Brazil", decimals: 2 },
  { code: "MXN", symbol: "MX$", name: "Mexican Peso", country: "Mexico", decimals: 2 },
  { code: "ZAR", symbol: "R", name: "South African Rand", country: "South Africa", decimals: 2 },
  { code: "RUB", symbol: "\u20BD", name: "Russian Ruble", country: "Russia", decimals: 2 },
  { code: "TRY", symbol: "\u20BA", name: "Turkish Lira", country: "Turkey", decimals: 2 },
  { code: "PLN", symbol: "z\u0142", name: "Polish Zloty", country: "Poland", decimals: 2 },
  { code: "SEK", symbol: "kr", name: "Swedish Krona", country: "Sweden", decimals: 2 },
  { code: "NOK", symbol: "kr", name: "Norwegian Krone", country: "Norway", decimals: 2 },
  { code: "DKK", symbol: "kr", name: "Danish Krone", country: "Denmark", decimals: 2 },
  { code: "CZK", symbol: "K\u010D", name: "Czech Koruna", country: "Czech Republic", decimals: 2 },
  { code: "HUF", symbol: "Ft", name: "Hungarian Forint", country: "Hungary", decimals: 0 },
  { code: "THB", symbol: "\u0E3F", name: "Thai Baht", country: "Thailand", decimals: 2 },
  { code: "SGD", symbol: "S$", name: "Singapore Dollar", country: "Singapore", decimals: 2 },
  { code: "HKD", symbol: "HK$", name: "Hong Kong Dollar", country: "Hong Kong", decimals: 2 },
  { code: "TWD", symbol: "NT$", name: "Taiwan Dollar", country: "Taiwan", decimals: 0 },
  { code: "MYR", symbol: "RM", name: "Malaysian Ringgit", country: "Malaysia", decimals: 2 },
  { code: "PHP", symbol: "\u20B1", name: "Philippine Peso", country: "Philippines", decimals: 2 },
  { code: "IDR", symbol: "Rp", name: "Indonesian Rupiah", country: "Indonesia", decimals: 0 },
  { code: "VND", symbol: "\u20AB", name: "Vietnamese Dong", country: "Vietnam", decimals: 0 },
  { code: "AED", symbol: "AED", name: "UAE Dirham", country: "United Arab Emirates", decimals: 2 },
  { code: "SAR", symbol: "SAR", name: "Saudi Riyal", country: "Saudi Arabia", decimals: 2 },
  { code: "EGP", symbol: "E\u00A3", name: "Egyptian Pound", country: "Egypt", decimals: 2 },
  { code: "NGN", symbol: "\u20A6", name: "Nigerian Naira", country: "Nigeria", decimals: 2 },
  { code: "ARS", symbol: "AR$", name: "Argentine Peso", country: "Argentina", decimals: 2 },
  { code: "CLP", symbol: "CL$", name: "Chilean Peso", country: "Chile", decimals: 0 },
  { code: "COP", symbol: "COL$", name: "Colombian Peso", country: "Colombia", decimals: 0 },
  { code: "PEN", symbol: "S/.", name: "Peruvian Sol", country: "Peru", decimals: 2 },
];

const fmtMoney = (n, cur) => {
  if (n === 0 || n == null) return (cur ? cur.symbol : "$") + "0";
  const d = cur ? cur.decimals : 2;
  return (cur ? cur.symbol : "$") + n.toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: d });
};

const getItemBudget = (i) => i.budget || 0;
const getSubBudgetTotal = (i) => i.subItems ? i.subItems.reduce((s, x) => s + (x.budget || 0), 0) : 0;
const getSubSavedTotal = (i) => i.subItems ? i.subItems.reduce((s, x) => s + (x.saved || 0), 0) : 0;

const formatDate = (ts) => {
  if (!ts) return "";
  const d = new Date(ts), day = d.getDate();
  const sfx = day % 10 === 1 && day !== 11 ? "st" : day % 10 === 2 && day !== 12 ? "nd" : day % 10 === 3 && day !== 13 ? "rd" : "th";
  return day + sfx + " " + d.toLocaleString("en-US", { month: "long" }) + ", " + d.getFullYear() + "  " + d.toLocaleString("en-US", { hour: "numeric", minute: "2-digit", hour12: true }).toLowerCase();
};

const getAvgPri = (i) => {
  if (!i.subItems || i.subItems.length === 0) return i.priority;
  return Math.round((i.subItems.reduce((a, s) => a + s.priority, 0) / i.subItems.length) * 10) / 10;
};

const sortSubs = (subs, sm, rev) => {
  if (sm === "manual") return subs;
  const dir = rev ? -1 : 1;
  return [...subs].sort((a, b) => {
    if (sm === "priority") { if (b.priority !== a.priority) return (b.priority - a.priority) * dir; return a.name.localeCompare(b.name); }
    if (sm === "alpha") return a.name.localeCompare(b.name) * dir;
    if (sm === "date") return ((b.createdAt || 0) - (a.createdAt || 0)) * dir;
    if (sm === "purchasable") { const ar = (a.budget || 0) > 0 && (a.saved || 0) >= (a.budget || 0) ? 1 : 0; const br = (b.budget || 0) > 0 && (b.saved || 0) >= (b.budget || 0) ? 1 : 0; if (br !== ar) return (br - ar) * dir; return a.name.localeCompare(b.name); }
    return 0;
  });
};

const sortRoot = (items, sm, rev) => {
  if (sm === "manual") return items;
  const dir = rev ? -1 : 1;
  return [...items].sort((a, b) => {
    if (sm === "priority") { const ap = getAvgPri(a), bp = getAvgPri(b); if (bp !== ap) return (bp - ap) * dir; return a.name.localeCompare(b.name); }
    if (sm === "alpha") return a.name.localeCompare(b.name) * dir;
    if (sm === "date") return (b.createdAt - a.createdAt) * dir;
    if (sm === "purchasable") { const ar = (a.budget || 0) > 0 && (a.saved || 0) >= (a.budget || 0) ? 1 : 0; const br = (b.budget || 0) > 0 && (b.saved || 0) >= (b.budget || 0) ? 1 : 0; if (br !== ar) return (br - ar) * dir; return a.name.localeCompare(b.name); }
    return 0;
  });
};

const getSortLabel = (m, r) => {
  if (m === "priority") return r ? "Low \u2192 High" : "High \u2192 Low";
  if (m === "alpha") return r ? "Z \u2192 A" : "A \u2192 Z";
  if (m === "date") return r ? "Oldest first" : "Newest first";
  if (m === "purchasable") return r ? "Not ready first" : "Ready to buy first";
  if (m === "manual") return "Drag to reorder";
  return "";
};

const getCompletionProgress = (items) => {
  let tw = 0, cw = 0;
  items.forEach((i) => {
    if (i.subItems && i.subItems.length > 0) { i.subItems.forEach((s) => { tw += s.priority; if (s.completed) cw += s.priority; }); }
    else { tw += i.priority; if (i.completed) cw += i.priority; }
  });
  return tw === 0 ? 0 : Math.round((cw / tw) * 100);
};

const getSavingsProgress = (items) => {
  let tb = 0, ts = 0;
  items.forEach((i) => {
    if (i.subItems && i.subItems.length > 0) { i.subItems.forEach((s) => { tb += s.budget || 0; ts += s.saved || 0; }); }
    else { tb += i.budget || 0; ts += i.saved || 0; }
  });
  return tb === 0 ? 0 : Math.min(100, Math.round((ts / tb) * 100));
};

// ── Undo/Redo ──
function useUndoRedo(init) {
  const [past, setPast] = useState([]);
  const [present, setPresent] = useState(init);
  const [future, setFuture] = useState([]);
  const ref = useRef(present);
  ref.current = present;
  const set = useCallback((ns) => { const c = ref.current; setPast((p) => [...p, c]); const n = typeof ns === "function" ? ns(c) : ns; setPresent(n); ref.current = n; setFuture([]); }, []);
  const undo = useCallback(() => { if (!past.length) return; setFuture((f) => [ref.current, ...f]); const p = past[past.length - 1]; setPresent(p); ref.current = p; setPast((pp) => pp.slice(0, -1)); }, [past]);
  const redo = useCallback(() => { if (!future.length) return; setPast((p) => [...p, ref.current]); const n = future[0]; setPresent(n); ref.current = n; setFuture((f) => f.slice(1)); }, [future]);
  return { state: present, set, undo, redo, canUndo: past.length > 0, canRedo: future.length > 0 };
}

// ── Popup ──
function Popup({ title, children, dark }) {
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 }}>
      <div style={{ background: dark ? "#1a1a1a" : "#fff", borderRadius: 12, padding: "24px 28px", boxShadow: "0 8px 30px rgba(0,0,0,0.2)", maxWidth: 420, width: "90%", color: dark ? "#e0e0e0" : "#1a1a2e" }}>
        {title && <h3 style={{ margin: "0 0 12px", fontSize: 16, fontWeight: 600 }}>{title}</h3>}
        {children}
      </div>
    </div>
  );
}

function ConfirmDialog({ message, onConfirm, onCancel, dark }) {
  return (
    <Popup dark={dark}>
      <p style={{ margin: "0 0 20px", fontSize: 15, lineHeight: 1.5 }}>{message}</p>
      <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
        <button onClick={onCancel} style={{ padding: "8px 18px", fontSize: 13, fontWeight: 600, borderRadius: 6, border: "none", background: dark ? "#333" : "#eee", color: dark ? "#ccc" : "#555", cursor: "pointer" }}>Cancel</button>
        <button onClick={onConfirm} style={{ padding: "8px 18px", fontSize: 13, fontWeight: 600, borderRadius: 6, border: "none", background: "#c0392b", color: "#fff", cursor: "pointer" }}>Delete</button>
      </div>
    </Popup>
  );
}

function BudgetCapPopup({ itemName, currentBudget, minBudget, onSave, onCancel, dark, showDontAsk, onDontAsk, currency }) {
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

function BudgetExceededPopup({ remaining, onClose, dark, currency }) {
  return (
    <Popup title="Budget exceeded" dark={dark}>
      <p style={{ margin: "0 0 16px", fontSize: 13, color: dark ? "#aaa" : "#666", lineHeight: 1.5 }}>Sub-item budgets would exceed the cap. You have <strong>{fmtMoney(remaining, currency)}</strong> remaining.</p>
      <div style={{ display: "flex", justifyContent: "flex-end" }}><button onClick={onClose} style={{ padding: "8px 18px", fontSize: 13, fontWeight: 600, borderRadius: 6, border: "none", background: "#2a6f97", color: "#fff", cursor: "pointer" }}>OK</button></div>
    </Popup>
  );
}

// ── Progress Section ──
function ProgressSection({ items, dark }) {
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

// ── Donut Chart ──
function DonutChart({ items, dark, currency }) {
  const [hovered, setHovered] = useState(null);
  const total = items.reduce((s, i) => s + getItemBudget(i), 0);
  if (total === 0) return null;

  const pad = 10;
  const outerR = 80, baseW = 28, hoverW = 38;
  const svgDim = (outerR + hoverW / 2 + pad) * 2;
  const ctr = svgDim / 2;
  const r = outerR;
  const circ = 2 * Math.PI * r;

  let cum = 0;
  const segs = items.map((item) => {
    const val = getItemBudget(item);
    if (val === 0) return null;
    const pct = val / total, off = cum; cum += pct;
    return { id: item.id, name: item.name, val, pct, off, color: item.chartColor || "#888", subItems: item.subItems || [], saved: item.saved || 0 };
  }).filter(Boolean);

  const hSeg = hovered != null ? segs.find((s) => s.id === hovered) : null;

  // Convert polar segment to a thick arc path for precise hit testing
  const arcPath = (seg, sw) => {
    if (seg.pct >= 0.9999) {
      // Full circle — draw two semicircles as a path
      const innerR = r - sw / 2, outerRad = r + sw / 2;
      return "M " + (ctr - outerRad) + " " + ctr +
        " A " + outerRad + " " + outerRad + " 0 1 1 " + (ctr + outerRad) + " " + ctr +
        " A " + outerRad + " " + outerRad + " 0 1 1 " + (ctr - outerRad) + " " + ctr +
        " Z M " + (ctr - innerR) + " " + ctr +
        " A " + innerR + " " + innerR + " 0 1 0 " + (ctr + innerR) + " " + ctr +
        " A " + innerR + " " + innerR + " 0 1 0 " + (ctr - innerR) + " " + ctr + " Z";
    }
    const startAngle = seg.off * 2 * Math.PI - Math.PI / 2;
    const endAngle = (seg.off + seg.pct) * 2 * Math.PI - Math.PI / 2;
    const innerR = r - sw / 2, outerRad = r + sw / 2;
    const cos1 = Math.cos(startAngle), sin1 = Math.sin(startAngle);
    const cos2 = Math.cos(endAngle), sin2 = Math.sin(endAngle);
    const large = seg.pct > 0.5 ? 1 : 0;
    const ox1 = ctr + outerRad * cos1, oy1 = ctr + outerRad * sin1;
    const ox2 = ctr + outerRad * cos2, oy2 = ctr + outerRad * sin2;
    const ix2 = ctr + innerR * cos2, iy2 = ctr + innerR * sin2;
    const ix1 = ctr + innerR * cos1, iy1 = ctr + innerR * sin1;
    return "M " + ox1 + " " + oy1 + " A " + outerRad + " " + outerRad + " 0 " + large + " 1 " + ox2 + " " + oy2 + " L " + ix2 + " " + iy2 + " A " + innerR + " " + innerR + " 0 " + large + " 0 " + ix1 + " " + iy1 + " Z";
  };

  return (
    <div style={{ marginTop: 28, display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
      <span style={{ fontSize: 13, fontWeight: 600, color: dark ? "#ccc" : "#555" }}>Budget Breakdown</span>
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "center", gap: 40 }}>
        {/* Donut */}
        <div style={{ width: svgDim, height: svgDim, flexShrink: 0, position: "relative" }}>
          <svg width={svgDim} height={svgDim} viewBox={"0 0 " + svgDim + " " + svgDim}
            onMouseLeave={() => setHovered(null)}>
            {/* Background ring */}
            <circle cx={ctr} cy={ctr} r={r} fill="none" stroke={dark ? "#222" : "#e9ecef"} strokeWidth={baseW} />
            {/* Visible arcs */}
            {segs.map((seg) => (
              <circle key={"v-" + seg.id} cx={ctr} cy={ctr} r={r} fill="none"
                stroke={seg.color}
                strokeWidth={hovered === seg.id ? hoverW : baseW}
                strokeDasharray={seg.pct * circ + " " + circ}
                strokeDashoffset={-seg.off * circ}
                transform={"rotate(-90 " + ctr + " " + ctr + ")"}
                opacity={hovered != null && hovered !== seg.id ? 0.15 : 1}
                style={{ transition: "stroke-width 0.5s ease, opacity 0.4s ease", pointerEvents: "none" }}
              />
            ))}
            {/* Outer dead zone — behind everything, clears hover outside donut */}
            <rect x="0" y="0" width={svgDim} height={svgDim} fill="transparent"
              style={{ cursor: "default" }}
              onMouseEnter={() => setHovered(null)}
            />
            {/* Hit-test paths — precise arc shapes, on top of dead zone */}
            {segs.map((seg) => (
              <path key={"h-" + seg.id}
                d={arcPath(seg, baseW)}
                fill="transparent"
                style={{ cursor: "pointer" }}
                onMouseEnter={() => setHovered(seg.id)}
              />
            ))}
            {/* Center dead zone — on top of hit paths, clears hover in center */}
            <circle cx={ctr} cy={ctr} r={r - baseW / 2} fill="transparent"
              style={{ cursor: "default" }}
              onMouseEnter={() => setHovered(null)}
            />
          </svg>
          <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", textAlign: "center", pointerEvents: "none" }}>
            <div style={{ fontSize: 20, fontWeight: 700, color: dark ? "#e0e0e0" : "#1a1a2e" }}>{fmtMoney(total, currency)}</div>
            <div style={{ fontSize: 10, color: dark ? "#777" : "#999" }}>Total</div>
          </div>
        </div>

        {/* Info panel */}
        <div style={{
          width: 280, flexShrink: 0, padding: 16, borderRadius: 10, minHeight: 180,
          border: "1px solid " + (dark ? "#333" : "#ccc"),
          background: dark ? "#1a1a1a" : "#fafafa",
          boxShadow: "0 2px 6px " + (dark ? "rgba(0,0,0,0.3)" : "rgba(0,0,0,0.08)"),
          opacity: hSeg ? 1 : 0.5,
          transform: hSeg ? "translateY(0px)" : "translateY(6px)",
          transition: "opacity 0.4s ease, transform 0.4s ease",
        }}>
          {hSeg ? (
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
                <span style={{ width: 16, height: 16, borderRadius: 4, background: hSeg.color, display: "inline-block", flexShrink: 0 }} />
                <span style={{ fontSize: 16, fontWeight: 700, color: dark ? "#e0e0e0" : "#1a1a2e" }}>{hSeg.name}</span>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 12 }}>
                <span style={{ fontSize: 13, color: dark ? "#aaa" : "#666" }}>Budget: <strong>{fmtMoney(hSeg.val, currency)}</strong></span>
                <span style={{ fontSize: 13, color: dark ? "#aaa" : "#666" }}>Share: <strong>{Math.round(hSeg.pct * 100)}%</strong> of total</span>
                {hSeg.saved > 0 && <span style={{ fontSize: 13, color: dark ? "#aaa" : "#666" }}>Saved: <strong>{fmtMoney(hSeg.saved, currency)}</strong></span>}
              </div>
              {hSeg.subItems.length > 0 && (
                <div>
                  <span style={{ fontSize: 12, fontWeight: 600, color: dark ? "#888" : "#999", marginBottom: 6, display: "block" }}>Sub-items:</span>
                  <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                    {hSeg.subItems.map((sub) => {
                      const sp = hSeg.val > 0 ? Math.round(((sub.budget || 0) / hSeg.val) * 100) : 0;
                      return (
                        <div key={sub.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "4px 8px", borderRadius: 4, background: dark ? "#111" : "#f0f0f0", fontSize: 12 }}>
                          <span style={{ color: dark ? "#ccc" : "#444" }}>{sub.name}</span>
                          <span style={{ color: dark ? "#888" : "#999", whiteSpace: "nowrap", marginLeft: 12 }}>{fmtMoney(sub.budget || 0, currency)} ({sp}%)</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: 148, color: dark ? "#555" : "#bbb", fontSize: 13, fontStyle: "italic" }}>
              Hover over a segment to see details
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Currency Selector ──
function CurrencySelector({ currency, onChange, dark }) {
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

// ── Small Components ──
function PriSelect({ value, onChange, small, showPh, dark }) {
  const b = small ? { fontSize: 13, padding: "7px 10px", width: 62 } : { width: 72 };
  return (<select value={value} onChange={(e) => onChange(e.target.value)} style={{ ...inp(dark), textAlign: "center", cursor: "pointer", color: value ? (dark ? "#e0e0e0" : "#333") : "#999", ...b }}>{showPh && <option value="" disabled>Priority</option>}{[1,2,3,4,5,6,7,8,9,10].map((n) => <option key={n} value={n}>{n}</option>)}</select>);
}

function PriBadge({ value, small }) {
  const c = Math.max(1, Math.min(10, value)), h = ((10 - c) / 9) * 200;
  return <span style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: small ? 26 : 32, height: small ? 26 : 32, borderRadius: 8, backgroundColor: "hsl(" + h + ",60%,92%)", color: "hsl(" + h + ",55%,35%)", fontWeight: 700, fontSize: small ? 12 : 14, flexShrink: 0 }}>{value}</span>;
}

function SavedInp({ value, budget, onChange, dark, small, editable, currency }) {
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

function BudgetInp({ value, onChange, dark, small, currency }) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value ? String(value) : "");
  const sym = currency ? currency.symbol : "$";
  const commit = () => { const n = parseFloat(draft); onChange(isNaN(n) || n < 0 ? 0 : Math.round(n * 100) / 100); setEditing(false); };
  if (editing) return (<div style={{ display: "inline-flex", alignItems: "center", position: "relative", flexShrink: 0 }}><span style={{ position: "absolute", left: 6, top: "50%", transform: "translateY(-50%)", fontSize: small ? 11 : 12, color: dark ? "#e07a6b" : "#c0392b", fontWeight: 600, pointerEvents: "none" }}>{sym}</span><input value={draft} onChange={(e) => { const v = e.target.value; if (v === "" || /^\d*\.?\d{0,2}$/.test(v)) setDraft(v); }} onBlur={commit} onKeyDown={(e) => e.key === "Enter" && commit()} autoFocus placeholder="0" style={{ ...inp(dark), width: small ? 64 : 76, fontSize: small ? 11 : 12, padding: "3px 6px 3px " + (small ? 18 : 20) + "px" }} /></div>);
  return (<button onClick={() => { setDraft(value ? String(value) : ""); setEditing(true); }} title="Click to set budget" style={{ background: "none", border: "1px solid " + (dark ? "#333" : "#e0e0e0"), borderRadius: 4, padding: small ? "2px 6px" : "3px 8px", fontSize: small ? 11 : 12, color: (value || 0) > 0 ? (dark ? "#e07a6b" : "#c0392b") : (dark ? "#555" : "#bbb"), cursor: "pointer", fontWeight: 600, flexShrink: 0, whiteSpace: "nowrap" }}>{(value || 0) > 0 ? fmtMoney(value, currency) : (small ? sym : sym + " Budget")}</button>);
}

function ColorPick({ value, onChange }) {
  return <input type="color" value={value || "#888888"} onChange={(e) => onChange(e.target.value)} title="Pick chart color" style={{ width: 22, height: 22, border: "none", borderRadius: 4, cursor: "pointer", padding: 0, flexShrink: 0, background: "none" }} />;
}

function EditRow({ item, onSave, onCancel, isSub, dark }) {
  const [n, setN] = useState(item.name); const [p, setP] = useState(String(item.priority)); const [e, setE] = useState("");
  const save = () => { const t = n.trim(), pr = Number(p); if (!t) return setE("Name can't be empty."); if (!Number.isInteger(pr) || pr < 1 || pr > 10) return setE("Priority must be 1-10."); setE(""); onSave({ name: t, priority: pr }); };
  const sm = isSub ? { fontSize: 13, padding: "7px 10px" } : {};
  return (<div style={{ display: "flex", flexDirection: "column", gap: 6, width: "100%" }}><div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}><input value={n} onChange={(ev) => setN(ev.target.value)} style={{ ...inp(dark), flex: 1, minWidth: 100, ...sm }} placeholder={isSub ? "Sub-item name" : "Item name"} autoFocus /><PriSelect value={p} onChange={setP} small={isSub} dark={dark} /><button onClick={save} style={btnSv}>Save</button><button onClick={onCancel} style={btnCn(dark)}>Cancel</button></div>{e && <p style={errS}>{e}</p>}</div>);
}

// ── Sub Item Row ──
function SubRow({ sub, onEdit, onDel, editId, onEditSave, onEditCancel, onBudget, onSaved, onToggle, dark, currency }) {
  const ed = editId === sub.id;
  const purchasable = (sub.budget || 0) > 0 && (sub.saved || 0) >= (sub.budget || 0);
  return (
    <div style={{ ...subRowS(dark), ...(purchasable ? { background: "rgba(39,174,96,0.15)" } : {}) }}>
      {ed ? (<EditRow item={sub} isSub onSave={(u) => onEditSave(sub.id, u)} onCancel={onEditCancel} dark={dark} />) : (<>
        <PriBadge value={sub.priority} small />
        <span style={{ flex: 1, fontSize: 13, color: dark ? "#ccc" : "#333", marginLeft: 4 }}>{sub.name}</span>
        <SavedInp value={sub.saved} budget={sub.budget || 0} onChange={(v) => onSaved(sub.id, v)} dark={dark} small editable currency={currency} />
        <BudgetInp value={sub.budget || 0} onChange={(v) => onBudget(sub.id, v)} dark={dark} small currency={currency} />
        <button onClick={() => onToggle(sub.id)} title={sub.completed ? "Mark incomplete" : "Mark completed"} style={{ fontSize: 12, background: "none", border: "1px solid " + (sub.completed ? "#27ae60" : (dark ? "#444" : "#ccc")), borderRadius: 4, cursor: "pointer", padding: "1px 6px", color: sub.completed ? "#27ae60" : (dark ? "#666" : "#aaa"), fontWeight: 600, flexShrink: 0 }}>{sub.completed ? "\u2713" : "\u25CB"}</button>
        <span style={{ fontSize: 10, color: dark ? "#555" : "#bbb", whiteSpace: "nowrap", flexShrink: 0 }}>{formatDate(sub.createdAt)}</span>
        <button onClick={() => onEdit(sub.id)} style={icnBtn(dark)} title="Edit">{"\u270E"}</button>
        <button onClick={() => onDel(sub.id)} style={{ ...icnBtn(dark), color: "#c0392b" }} title="Delete">{"\u2715"}</button>
      </>)}
    </div>
  );
}

// ── Add Sub Form ──
function AddSubForm({ onAdd, dark, currency }) {
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

// ── Wishlist Item ──
function WItem({ item, onDel, onEdit, onEditSave, editId, onEditCancel, onAddSub, onDelSub, onEditSub, onEditSubSave, onBudget, onSubBudget, onSaved, onSubSaved, onColor, onRootBudgetClick, onToggle, onToggleSub, dark, selected, onToggleSel, selMode, onDragStart, onDragOver, onDrop, dragOverId, currency }) {
  const [exp, setExp] = useState(false);
  const hasSubs = item.subItems && item.subItems.length > 0;
  const avgP = getAvgPri(item);
  const isEd = editId === item.id;
  const isDO = dragOverId === item.id;
  const subTot = getSubBudgetTotal(item);
  const dispSaved = hasSubs ? getSubSavedTotal(item) : (item.saved || 0);
  const purchasable = (item.budget || 0) > 0 && dispSaved >= (item.budget || 0);

  return (
    <div style={{ ...itemCont(dark), outline: selected ? "2px solid #c0392b" : "none", borderTop: isDO ? "3px solid #c0392b" : "1px solid " + (dark ? "#222" : "#eee") }}
      draggable={!isEd && !selMode} onDragStart={(e) => onDragStart(e, item.id)} onDragOver={(e) => onDragOver(e, item.id)} onDrop={(e) => onDrop(e, item.id)}>
      <div style={{ ...itemRow(dark), ...(purchasable ? { background: "rgba(39,174,96,0.15)" } : {}) }}>
        {isEd ? (<EditRow item={item} onSave={(u) => onEditSave(item.id, u)} onCancel={onEditCancel} dark={dark} />) : (<>
          {selMode && <input type="checkbox" checked={selected} onChange={() => onToggleSel(item.id)} style={{ width: 18, height: 18, cursor: "pointer", accentColor: "#c0392b", flexShrink: 0 }} />}
          <button onClick={() => setExp(!exp)} style={{ ...icnBtn(dark), fontSize: 12, transform: exp ? "rotate(90deg)" : "rotate(0deg)", transition: "transform 0.15s" }} title={exp ? "Collapse" : "Expand"}>{"\u25B6"}</button>
          <ColorPick value={item.chartColor} onChange={(c) => onColor(item.id, c)} />
          <PriBadge value={avgP} />
          <div style={{ flex: 1, marginLeft: 4, minWidth: 0 }}><span style={{ fontSize: 15, color: dark ? "#e0e0e0" : "#1a1a2e", fontWeight: 500 }}>{item.name}</span></div>
          <SavedInp value={dispSaved} budget={item.budget || 0} onChange={(v) => onSaved(item.id, v)} dark={dark} editable={!hasSubs} currency={currency} />
          {hasSubs ? (
            <button onClick={() => onRootBudgetClick(item.id)} title={"Total: " + fmtMoney(item.budget || 0, currency) + " | Used: " + fmtMoney(subTot, currency)} style={{ background: "none", border: "1px solid " + (dark ? "#333" : "#e0e0e0"), borderRadius: 4, padding: "3px 8px", fontSize: 12, fontWeight: 600, color: dark ? "#e07a6b" : "#c0392b", cursor: "pointer", flexShrink: 0, whiteSpace: "nowrap" }}>{fmtMoney(Math.max(0, (item.budget || 0) - subTot), currency)} remaining</button>
          ) : (<BudgetInp value={item.budget || 0} onChange={(v) => onBudget(item.id, v)} dark={dark} currency={currency} />)}
          <button onClick={() => onToggle(item.id)} title={item.completed ? "Mark incomplete" : "Mark completed"} style={{ fontSize: 14, background: "none", border: "1px solid " + (item.completed ? "#27ae60" : (dark ? "#444" : "#ccc")), borderRadius: 4, cursor: "pointer", padding: "2px 8px", color: item.completed ? "#27ae60" : (dark ? "#666" : "#aaa"), fontWeight: 600, flexShrink: 0 }}>{item.completed ? "\u2713" : "\u25CB"}</button>
          <span style={{ fontSize: 11, color: dark ? "#555" : "#aaa", whiteSpace: "nowrap", flexShrink: 0 }}>{formatDate(item.createdAt)}</span>
          {!selMode && (<><button onClick={() => onEdit(item.id)} style={icnBtn(dark)} title="Edit">{"\u270E"}</button><button onClick={() => onDel(item.id)} style={{ ...icnBtn(dark), color: "#c0392b" }} title="Delete">{"\u2715"}</button></>)}
        </>)}
      </div>
      {exp && (
        <div style={subPanel(dark)}>
          {hasSubs ? item.subItems.map((s) => (
            <SubRow key={s.id} sub={s} editId={editId} onEdit={onEditSub} onDel={(sid) => onDelSub(item.id, sid)}
              onEditSave={(sid, u) => onEditSubSave(item.id, sid, u)} onEditCancel={onEditCancel}
              onBudget={(sid, v) => onSubBudget(item.id, sid, v)} onSaved={(sid, v) => onSubSaved(item.id, sid, v)}
              onToggle={(sid) => onToggleSub(item.id, sid)} dark={dark} currency={currency} />
          )) : (<p style={{ fontSize: 12, color: dark ? "#555" : "#bbb", margin: "4px 0", textAlign: "center" }}>No sub-items yet.</p>)}
          <AddSubForm onAdd={(sd) => onAddSub(item.id, sd)} dark={dark} currency={currency} />
        </div>
      )}
    </div>
  );
}

// ── Completed Section ──
function CompletedRoot({ item, dark, currency }) {
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

function SearchSort({ searchQuery, onSearch, sortMode, onSort, reversed, onReverse, dark }) {
  return (
    <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap", marginTop: 16 }}>
      <div style={{ flex: 1, minWidth: 140, position: "relative" }}>
        <span style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", fontSize: 14, color: "#aaa", pointerEvents: "none" }}>{"\uD83D\uDD0D"}</span>
        <input value={searchQuery} onChange={(e) => onSearch(e.target.value)} placeholder="Search items..." style={{ ...inp(dark), width: "100%", paddingLeft: 32, boxSizing: "border-box" }} />
      </div>
      <select value={sortMode} onChange={(e) => onSort(e.target.value)} style={{ ...inp(dark), cursor: "pointer", color: dark ? "#ccc" : "#555", minWidth: 130, appearance: "auto" }}>
        <option value="priority">Sort: Priority</option><option value="alpha">Sort: Alphabetical</option><option value="date">Sort: Date Added</option><option value="purchasable">Sort: Purchasable</option><option value="manual">Sort: Manual</option>
      </select>
      <button onClick={onReverse} title={"Currently: " + getSortLabel(sortMode, reversed)} disabled={sortMode === "manual"}
        style={{ ...inp(dark), display: "inline-flex", alignItems: "center", justifyContent: "center", width: 42, height: 42, padding: 0, cursor: sortMode === "manual" ? "default" : "pointer", background: reversed ? "rgba(192,57,43,0.15)" : (dark ? "#222" : "#fafafa"), borderColor: reversed ? "#c0392b" : (dark ? "#333" : "#e0e0e0"), color: reversed ? "#c0392b" : "#999", fontSize: 18, fontWeight: 700, flexShrink: 0, opacity: sortMode === "manual" ? 0.4 : 1 }}>{"\u21C5"}</button>
    </div>
  );
}

function ShineStyle() {
  return <style dangerouslySetInnerHTML={{ __html: "@keyframes shine{0%{transform:translateX(-100%)}100%{transform:translateX(200%)}}" }} />;
}

// ── Main App ──
export default function WishlistApp() {
  const dark = true;
  const [currency, setCurrency] = useState(CURRENCIES[0]);
  const { state: items, set: setItems, undo, redo, canUndo, canRedo } = useUndoRedo([]);
  const [name, setName] = useState(""); const [priority, setPriority] = useState(""); const [budget, setBudget] = useState(""); const [saved, setSaved] = useState("");
  const [error, setError] = useState(""); const [editingId, setEditingId] = useState(null);
  const [searchQuery, setSearchQuery] = useState(""); const [sortMode, setSortMode] = useState("priority"); const [reversed, setReversed] = useState(false);
  const [confirmAction, setConfirmAction] = useState(null);
  const [selectMode, setSelectMode] = useState(false); const [selectedIds, setSelectedIds] = useState(new Set());
  const [dragOverId, setDragOverId] = useState(null); const dragItem = useRef(null);
  const [budgetPopup, setBudgetPopup] = useState(null);
  const [budgetExceeded, setBudgetExceeded] = useState(null);
  const [colorConflict, setColorConflict] = useState(null);
  const [dontAskBudgetCap, setDontAskBudgetCap] = useState(false);
  const [savedWillChange, setSavedWillChange] = useState(null);
  const [showCompleted, setShowCompleted] = useState(false);

  useEffect(() => {
    const h = (e) => { if ((e.metaKey || e.ctrlKey) && e.key === "z") { e.preventDefault(); if (e.shiftKey) redo(); else undo(); } };
    window.addEventListener("keydown", h); return () => window.removeEventListener("keydown", h);
  }, [undo, redo]);

  const displayed = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    let f = items;
    if (q) f = items.filter((i) => i.name.toLowerCase().includes(q) || i.subItems?.some((s) => s.name.toLowerCase().includes(q)));
    return sortRoot(f, sortMode, reversed).map((i) => ({ ...i, subItems: sortSubs(i.subItems || [], sortMode, reversed) }));
  }, [items, searchQuery, sortMode, reversed]);

  const completed = useMemo(() => {
    const r = [];
    items.forEach((i) => {
      if (i.subItems && i.subItems.length > 0) {
        if (i.completed && i.subItems.every((s) => s.completed)) r.push({ type: "rws", ...i });
        else i.subItems.filter((s) => s.completed).forEach((s) => r.push({ type: "sub", ...s, parentId: i.id, parentName: i.name }));
      } else if (i.completed) r.push({ type: "root", ...i });
    });
    return r;
  }, [items]);

  const sym = currency.symbol;

  const handleAdd = useCallback(() => {
    const t = name.trim(), p = Number(priority);
    if (!t) return setError("Please enter an item name."); if (!Number.isInteger(p) || p < 1 || p > 10) return setError("Priority must be 1-10.");
    const bv = parseFloat(budget), sv = parseFloat(saved);
    setItems((prev) => sortRoot([...prev, { id: generateId(), name: t, priority: p, subItems: [], createdAt: Date.now(), budget: isNaN(bv) || bv < 0 ? 0 : Math.round(bv * 100) / 100, saved: isNaN(sv) || sv < 0 ? 0 : Math.round(sv * 100) / 100, chartColor: randomColor(), completed: false }], sortMode, reversed));
    setName(""); setPriority(""); setBudget(""); setSaved(""); setError("");
  }, [name, priority, budget, saved, sortMode, reversed, setItems]);

  const reqDel = useCallback((id) => {
    const it = items.find((i) => i.id === id); const sc = it?.subItems?.length || 0;
    setConfirmAction({ message: sc > 0 ? "Delete \"" + it.name + "\" and its " + sc + " sub-item" + (sc !== 1 ? "s" : "") + "?" : "Delete \"" + it?.name + "\"?", action: () => { setItems((p) => p.filter((i) => i.id !== id)); if (editingId === id) setEditingId(null); setConfirmAction(null); } });
  }, [items, editingId, setItems]);

  const reqBulkDel = useCallback(() => {
    if (!selectedIds.size) return;
    setConfirmAction({ message: "Delete " + selectedIds.size + " selected item" + (selectedIds.size !== 1 ? "s" : "") + "?", action: () => { setItems((p) => p.filter((i) => !selectedIds.has(i.id))); setSelectedIds(new Set()); setSelectMode(false); setConfirmAction(null); } });
  }, [selectedIds, setItems]);

  const editSave = useCallback((id, u) => { setItems((p) => sortRoot(p.map((i) => (i.id === id ? { ...i, ...u } : i)), sortMode, reversed)); setEditingId(null); }, [sortMode, reversed, setItems]);
  const budgetChange = useCallback((id, v) => { setItems((p) => p.map((i) => (i.id === id ? { ...i, budget: v } : i))); }, [setItems]);
  const savedChange = useCallback((id, v) => { setItems((p) => p.map((i) => (i.id === id ? { ...i, saved: v } : i))); }, [setItems]);
  const colorChange = useCallback((id, c) => { const x = items.find((i) => i.id !== id && i.chartColor && i.chartColor.toLowerCase() === c.toLowerCase()); if (x) { setColorConflict(x.name); return; } setItems((p) => p.map((i) => (i.id === id ? { ...i, chartColor: c } : i))); }, [items, setItems]);
  const subSavedChange = useCallback((pid, sid, v) => { setItems((p) => p.map((i) => { if (i.id !== pid) return i; const us = i.subItems.map((s) => (s.id === sid ? { ...s, saved: v } : s)); return { ...i, subItems: us, saved: us.reduce((sum, s) => sum + (s.saved || 0), 0) }; })); }, [setItems]);
  const subBudgetChange = useCallback((pid, sid, v) => {
    const par = items.find((i) => i.id === pid); if (!par) return;
    const cap = par.budget || 0; const other = (par.subItems || []).filter((s) => s.id !== sid).reduce((sum, s) => sum + (s.budget || 0), 0);
    if (cap > 0 && other + v > cap) { setBudgetExceeded({ remaining: Math.max(0, cap - other) }); return; }
    setItems((p) => p.map((i) => { if (i.id !== pid) return i; return { ...i, subItems: i.subItems.map((s) => (s.id === sid ? { ...s, budget: v } : s)) }; }));
  }, [items, setItems]);

  const rootBudgetClick = useCallback((id) => { setBudgetPopup({ itemId: id, isFirstSub: false }); }, []);
  const budgetCapSave = useCallback((v) => { if (!budgetPopup) return; setItems((p) => p.map((i) => (i.id === budgetPopup.itemId ? { ...i, budget: v } : i))); setBudgetPopup(null); }, [budgetPopup, setItems]);

  const addSub = useCallback((pid, sd) => {
    const par = items.find((i) => i.id === pid);
    const isFirst = !par?.subItems || par.subItems.length === 0;
    const cap = par?.budget || 0; const curTot = getSubBudgetTotal(par || { subItems: [] }); const nb = sd.budget || 0;
    if (cap > 0 && nb > 0 && curTot + nb > cap) { setBudgetExceeded({ remaining: Math.max(0, cap - curTot) }); return; }
    if (isFirst && (par?.saved || 0) > 0) { setSavedWillChange({ parentId: pid, subData: sd }); return; }
    setItems((p) => sortRoot(p.map((i) => {
      if (i.id !== pid) return i;
      const ns = { id: generateId(), ...sd, createdAt: Date.now(), budget: sd.budget || 0, saved: sd.saved || 0, completed: false };
      const subs = sortSubs([...i.subItems, ns], sortMode, reversed);
      return { ...i, saved: isFirst ? (sd.saved || 0) : subs.reduce((sum, s) => sum + (s.saved || 0), 0), subItems: subs };
    }), sortMode, reversed));
    if (isFirst && !dontAskBudgetCap) setBudgetPopup({ itemId: pid, isFirstSub: true });
  }, [items, sortMode, reversed, setItems, dontAskBudgetCap]);

  const reqDelSub = useCallback((pid, sid) => {
    const par = items.find((i) => i.id === pid); const sub = par?.subItems?.find((s) => s.id === sid);
    setConfirmAction({ message: "Delete sub-item \"" + sub?.name + "\"?", action: () => {
      setItems((p) => sortRoot(p.map((i) => { if (i.id !== pid) return i; const ns = sortSubs(i.subItems.filter((s) => s.id !== sid), sortMode, reversed); return { ...i, subItems: ns, saved: ns.reduce((sum, s) => sum + (s.saved || 0), 0) }; }), sortMode, reversed));
      if (editingId === sid) setEditingId(null); setConfirmAction(null);
    } });
  }, [items, editingId, sortMode, reversed, setItems]);

  const editSubSave = useCallback((pid, sid, u) => {
    setItems((p) => sortRoot(p.map((i) => { if (i.id !== pid) return i; return { ...i, subItems: sortSubs(i.subItems.map((s) => (s.id === sid ? { ...s, ...u } : s)), sortMode, reversed) }; }), sortMode, reversed));
    setEditingId(null);
  }, [sortMode, reversed, setItems]);

  const toggleComp = useCallback((id) => { setItems((p) => p.map((i) => { if (i.id !== id) return i; const nv = !i.completed; if (i.subItems && i.subItems.length > 0) return { ...i, completed: nv, subItems: i.subItems.map((s) => ({ ...s, completed: nv })) }; return { ...i, completed: nv }; })); }, [setItems]);
  const toggleSubComp = useCallback((pid, sid) => { setItems((p) => p.map((i) => { if (i.id !== pid) return i; const us = i.subItems.map((s) => (s.id === sid ? { ...s, completed: !s.completed } : s)); return { ...i, subItems: us, completed: us.every((s) => s.completed) }; })); }, [setItems]);

  const dragStart = (e, id) => { dragItem.current = id; e.dataTransfer.effectAllowed = "move"; };
  const dragOver = (e, id) => { e.preventDefault(); if (dragItem.current !== id) setDragOverId(id); };
  const drop = (e, tid) => {
    e.preventDefault(); setDragOverId(null);
    if (!dragItem.current || dragItem.current === tid) return;
    const ord = displayed.map((i) => i.id); const fi = ord.indexOf(dragItem.current), ti = ord.indexOf(tid);
    if (fi === -1 || ti === -1) { dragItem.current = null; return; }
    ord.splice(fi, 1); ord.splice(ti, 0, dragItem.current);
    setItems((p) => { const m = new Map(p.map((i) => [i.id, i])); return [...ord.filter((id) => m.has(id)).map((id) => m.get(id)), ...p.filter((i) => !ord.includes(i.id))]; });
    setSortMode("manual"); setReversed(false); dragItem.current = null;
  };
  const dragEnd = () => { setDragOverId(null); dragItem.current = null; };

  const togSel = (id) => { setSelectedIds((p) => { const n = new Set(p); if (n.has(id)) n.delete(id); else n.add(id); return n; }); };
  const togSelAll = () => { if (selectedIds.size === displayed.length) setSelectedIds(new Set()); else setSelectedIds(new Set(displayed.map((i) => i.id))); };
  const exitSel = () => { setSelectMode(false); setSelectedIds(new Set()); };

  const tot = items.length, shown = displayed.length, searching = searchQuery.trim().length > 0;
  const bpItem = budgetPopup ? items.find((i) => i.id === budgetPopup.itemId) : null;

  return (
    <div style={{ background: dark ? "#0a0a0a" : "#f0f0f0", minHeight: "100vh", transition: "background 0.2s" }}>
      <ShineStyle />
      <div style={cont(dark)}>
        {/* Popups */}
        {confirmAction && <ConfirmDialog message={confirmAction.message} onConfirm={confirmAction.action} onCancel={() => setConfirmAction(null)} dark={dark} />}
        {budgetPopup && bpItem && <BudgetCapPopup itemName={bpItem.name} currentBudget={bpItem.budget} minBudget={getSubBudgetTotal(bpItem)} onSave={budgetCapSave} onCancel={() => setBudgetPopup(null)} dark={dark} showDontAsk={budgetPopup.isFirstSub} onDontAsk={() => setDontAskBudgetCap(true)} currency={currency} />}
        {budgetExceeded && <BudgetExceededPopup remaining={budgetExceeded.remaining} onClose={() => setBudgetExceeded(null)} dark={dark} currency={currency} />}
        {colorConflict && (<Popup title="Color already in use" dark={dark}><p style={{ margin: "0 0 16px", fontSize: 13, color: dark ? "#aaa" : "#666" }}>This color is already assigned to <strong>"{colorConflict}"</strong>. Please choose a different color.</p><div style={{ display: "flex", justifyContent: "flex-end" }}><button onClick={() => setColorConflict(null)} style={{ padding: "8px 18px", fontSize: 13, fontWeight: 600, borderRadius: 6, border: "none", background: "#2a6f97", color: "#fff", cursor: "pointer" }}>OK</button></div></Popup>)}
        {savedWillChange && (
          <Popup title="Saved amount will change" dark={dark}>
            <p style={{ margin: "0 0 16px", fontSize: 13, color: dark ? "#aaa" : "#666", lineHeight: 1.5 }}>Adding sub-items will reset saved to the sum of sub-item saved amounts. Continue?</p>
            <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
              <button onClick={() => setSavedWillChange(null)} style={{ padding: "8px 18px", fontSize: 13, fontWeight: 600, borderRadius: 6, border: "none", background: dark ? "#333" : "#eee", color: dark ? "#ccc" : "#555", cursor: "pointer" }}>Cancel</button>
              <button onClick={() => {
                const { parentId, subData } = savedWillChange;
                setItems((p) => sortRoot(p.map((i) => { if (i.id !== parentId) return i; return { ...i, saved: subData.saved || 0, subItems: sortSubs([...i.subItems, { id: generateId(), ...subData, createdAt: Date.now(), budget: subData.budget || 0, saved: subData.saved || 0, completed: false }], sortMode, reversed) }; }), sortMode, reversed));
                if (!dontAskBudgetCap) setBudgetPopup({ itemId: parentId, isFirstSub: true });
                setSavedWillChange(null);
              }} style={{ padding: "8px 18px", fontSize: 13, fontWeight: 600, borderRadius: 6, border: "none", background: "#2a6f97", color: "#fff", cursor: "pointer" }}>OK</button>
            </div>
          </Popup>
        )}

        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 4 }}>
          <h1 style={{ margin: 0, fontSize: 22, fontWeight: 700, color: dark ? "#e0e0e0" : "#1a1a2e" }}>Wishlist</h1>
          <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
            <button onClick={undo} disabled={!canUndo} title="Undo (Ctrl+Z)" style={{ ...icnBtn(dark), opacity: canUndo ? 1 : 0.3, fontSize: 18 }}>{"\u21A9"}</button>
            <button onClick={redo} disabled={!canRedo} title="Redo (Ctrl+Shift+Z)" style={{ ...icnBtn(dark), opacity: canRedo ? 1 : 0.3, fontSize: 18 }}>{"\u21AA"}</button>
          </div>
        </div>

        <CurrencySelector currency={currency} onChange={setCurrency} dark={dark} />
        {tot > 0 && <ProgressSection items={items} dark={dark} />}

        {/* Add form */}
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <input value={name} onChange={(e) => setName(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleAdd()} placeholder="Item name" style={{ ...inp(dark), flex: 1, minWidth: 140 }} />
          <div style={{ position: "relative", flexShrink: 0 }}><span style={{ position: "absolute", left: 8, top: "47%", transform: "translateY(-50%)", fontSize: 14, color: dark ? "#e07a6b" : "#c0392b", fontWeight: 600, pointerEvents: "none" }}>{sym}</span><input value={saved} onChange={(e) => { const v = e.target.value; if (v === "" || /^\d*\.?\d{0,2}$/.test(v)) setSaved(v); }} onKeyDown={(e) => e.key === "Enter" && handleAdd()} placeholder="Saved" style={{ ...inp(dark), width: 80, paddingLeft: 22 }} /></div>
          <div style={{ position: "relative", flexShrink: 0 }}><span style={{ position: "absolute", left: 8, top: "47%", transform: "translateY(-50%)", fontSize: 14, color: dark ? "#e07a6b" : "#c0392b", fontWeight: 600, pointerEvents: "none" }}>{sym}</span><input value={budget} onChange={(e) => { const v = e.target.value; if (v === "" || /^\d*\.?\d{0,2}$/.test(v)) setBudget(v); }} onKeyDown={(e) => e.key === "Enter" && handleAdd()} placeholder="Budget" style={{ ...inp(dark), width: 100, paddingLeft: 22 }} /></div>
          <PriSelect value={priority} onChange={setPriority} showPh dark={dark} />
          <button onClick={handleAdd} style={btnAd}>Add</button>
        </div>
        {error && <p style={errS}>{error}</p>}

        {tot > 0 && (
          <>
            <SearchSort searchQuery={searchQuery} onSearch={setSearchQuery} sortMode={sortMode} onSort={(m) => { setSortMode(m); setReversed(false); }} reversed={reversed} onReverse={() => setReversed((r) => !r)} dark={dark} />
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 6 }}>
              <p style={{ fontSize: 11, color: dark ? "#555" : "#bbb", margin: 0 }}>{getSortLabel(sortMode, reversed)}</p>
              {!selectMode ? (
                <button onClick={() => setSelectMode(true)} style={{ ...icnBtn(dark), fontSize: 12, color: dark ? "#888" : "#999" }}>{"\u2610"} Select</button>
              ) : (
                <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                  <button onClick={togSelAll} style={{ ...icnBtn(dark), fontSize: 12 }}>{selectedIds.size === displayed.length ? "Deselect all" : "Select all"}</button>
                  <button onClick={reqBulkDel} disabled={!selectedIds.size} style={{ fontSize: 12, fontWeight: 600, padding: "4px 10px", borderRadius: 6, border: "none", background: selectedIds.size ? "#c0392b" : (dark ? "#333" : "#ddd"), color: selectedIds.size ? "#fff" : "#999", cursor: selectedIds.size ? "pointer" : "default" }}>Delete ({selectedIds.size})</button>
                  <button onClick={exitSel} style={{ ...icnBtn(dark), fontSize: 12 }}>{"\u2715"} Cancel</button>
                </div>
              )}
            </div>
          </>
        )}

        {searching && tot > 0 && <p style={{ fontSize: 12, color: dark ? "#666" : "#999", margin: "4px 0 0" }}>Showing {shown} of {tot} item{tot !== 1 ? "s" : ""}{shown === 0 && " - try a different search term"}</p>}

        <div style={{ marginTop: 12, display: "flex", flexDirection: "column", gap: 10 }} onDragEnd={dragEnd}>
          {tot === 0 ? (<p style={{ textAlign: "center", color: dark ? "#555" : "#aaa", fontSize: 14, padding: 32 }}>Your wishlist is empty - add something above!</p>) : shown === 0 ? (<p style={{ textAlign: "center", color: dark ? "#555" : "#aaa", fontSize: 14, padding: 32 }}>No items match your search.</p>) : (
            displayed.map((item) => (
              <WItem key={item.id} item={item} editId={editingId} dark={dark}
                onDel={reqDel} onEdit={(id) => setEditingId(id)} onEditSave={editSave} onEditCancel={() => setEditingId(null)}
                onAddSub={addSub} onDelSub={reqDelSub} onEditSub={(id) => setEditingId(id)} onEditSubSave={editSubSave}
                onBudget={budgetChange} onSubBudget={subBudgetChange} onSaved={savedChange} onSubSaved={subSavedChange}
                onColor={colorChange} onRootBudgetClick={rootBudgetClick} onToggle={toggleComp} onToggleSub={toggleSubComp}
                selected={selectedIds.has(item.id)} onToggleSel={togSel} selMode={selectMode}
                onDragStart={dragStart} onDragOver={dragOver} onDrop={drop} dragOverId={dragOverId} currency={currency} />
            ))
          )}
        </div>

        {/* Completed */}
        {tot > 0 && completed.length > 0 && (
          <div style={{ marginTop: 24 }}>
            <button onClick={() => setShowCompleted((s) => !s)} style={{ background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 8, padding: "8px 0", width: "100%" }}>
              <span style={{ fontSize: 12, color: "#888", transform: showCompleted ? "rotate(90deg)" : "rotate(0deg)", transition: "transform 0.15s" }}>{"\u25B6"}</span>
              <span style={{ fontSize: 14, fontWeight: 600, color: dark ? "#888" : "#777" }}>Completed ({completed.length})</span>
              <div style={{ flex: 1, height: 1, background: dark ? "#222" : "#e0e0e0", marginLeft: 8 }} />
            </button>
            {showCompleted && (
              <div style={{ display: "flex", flexDirection: "column", gap: 6, marginTop: 8 }}>
                {completed.map((ci) => ci.type === "rws" ? (<CompletedRoot key={"rws-" + ci.id} item={ci} dark={dark} currency={currency} />) : (
                  <div key={ci.type + "-" + ci.id + (ci.parentId ? "-" + ci.parentId : "")} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 14px", borderRadius: 8, background: dark ? "#1a1a1a" : "#f8f9fa", border: "1px solid " + (dark ? "#222" : "#eee"), opacity: 0.75 }}>
                    <span style={{ color: "#27ae60", fontWeight: 700, fontSize: 14 }}>{"\u2713"}</span>
                    <PriBadge value={ci.priority} small />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <span style={{ fontSize: 14, color: dark ? "#ccc" : "#333", fontWeight: 500, textDecoration: "line-through" }}>{ci.name}</span>
                      {ci.parentName && <span style={{ fontSize: 11, color: dark ? "#555" : "#999", marginLeft: 8 }}>in {ci.parentName}</span>}
                    </div>
                    {(ci.budget || 0) > 0 && <span style={{ fontSize: 12, color: dark ? "#e07a6b" : "#c0392b", fontWeight: 600, flexShrink: 0 }}>{fmtMoney(ci.saved || 0, currency)} saved</span>}
                    <span style={{ fontSize: 10, color: dark ? "#444" : "#bbb", whiteSpace: "nowrap", flexShrink: 0 }}>{formatDate(ci.createdAt)}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {tot > 0 && items.some((i) => getItemBudget(i) > 0) && <DonutChart items={items} dark={dark} currency={currency} />}
      </div>
    </div>
  );
}

// ── Styles ──
const cont = (d) => ({ maxWidth: 1400, margin: "0 auto", padding: "80px 60px 40px", fontFamily: "'Inter',system-ui,-apple-system,sans-serif", background: d ? "#111" : "#fff", minHeight: "100vh", boxSizing: "border-box", transition: "background 0.2s" });
const inp = (d) => ({ padding: "10px 12px", fontSize: 14, border: "1.5px solid " + (d ? "#333" : "#e0e0e0"), borderRadius: 8, outline: "none", background: d ? "#1a1a1a" : "#fafafa", color: d ? "#e0e0e0" : "#333" });
const icnBtn = (d) => ({ background: "none", border: "none", cursor: "pointer", fontSize: 16, color: "#888", padding: "4px 6px", borderRadius: 4 });
const btnAd = { padding: "10px 20px", fontSize: 14, fontWeight: 600, background: "#1a1a2e", color: "#fff", border: "none", borderRadius: 8, cursor: "pointer" };
const btnSv = { padding: "6px 14px", fontSize: 13, fontWeight: 600, background: "#27ae60", color: "#fff", border: "none", borderRadius: 6, cursor: "pointer" };
const btnCn = (d) => ({ padding: "6px 14px", fontSize: 13, fontWeight: 600, background: d ? "#333" : "#eee", color: d ? "#ccc" : "#555", border: "none", borderRadius: 6, cursor: "pointer" });
const errS = { margin: "8px 0 0", fontSize: 13, color: "#c0392b", fontWeight: 500 };
const itemCont = (d) => ({ borderRadius: 10, border: "1px solid " + (d ? "#222" : "#eee"), overflow: "hidden" });
const itemRow = (d) => ({ display: "flex", alignItems: "center", gap: 10, padding: "10px 14px", background: d ? "#1a1a1a" : "#f8f9fa" });
const subPanel = (d) => ({ padding: "8px 14px 12px 42px", background: d ? "#111" : "#f1f3f5", borderTop: "1px solid " + (d ? "#222" : "#e9ecef"), display: "flex", flexDirection: "column", gap: 6 });
const subRowS = (d) => ({ display: "flex", alignItems: "center", gap: 8, padding: "6px 10px", background: d ? "#1a1a1a" : "#fff", borderRadius: 6, border: "1px solid " + (d ? "#222" : "#e9ecef") });