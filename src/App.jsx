import React, { useState, useCallback, useMemo, useRef, useEffect } from "react";

let nextId = 1;
const generateId = () => nextId++;
const randomColor = () => {
  const h = Math.floor(Math.random() * 360), s = 65, l = 55;
  const a = s / 100, b = l / 100;
  const f = (n) => { const k = (n + h / 30) % 12; const c = b - a * Math.min(b, 1 - b) * Math.max(-1, Math.min(k - 3, 9 - k, 1)); return Math.round(255 * c).toString(16).padStart(2, "0"); };
  return "#" + f(0) + f(8) + f(4);
};

const STATUSES = [
  { value: "want", label: "Want", color: "#e74c3c", bg: "#fdecea", percent: 0 },
  { value: "saving", label: "Saving For", color: "#f39c12", bg: "#fef5e7", percent: 50 },
  { value: "purchased", label: "Purchased", color: "#27ae60", bg: "#eafaf1", percent: 100 },
  { value: "inprogress", label: "In Progress", color: "#3498db", bg: "#ebf5fb", percent: null },
];
const getStatusInfo = (s) => STATUSES.find((x) => x.value === s) || STATUSES[0];

const deriveRootStatus = (item) => {
  if (!item.subItems || item.subItems.length === 0) return item.status || "want";
  const statuses = item.subItems.map((s) => s.status || "want");
  return statuses.every((s) => s === statuses[0]) ? statuses[0] : "inprogress";
};

const getOverallProgress = (items) => {
  const all = [];
  items.forEach((item) => {
    if (item.subItems && item.subItems.length > 0) {
      item.subItems.forEach((sub) => all.push(getStatusInfo(sub.status || "want").percent));
    } else {
      all.push(getStatusInfo(item.status || "want").percent);
    }
  });
  const valid = all.filter((v) => v !== null);
  if (valid.length === 0) return 0;
  return Math.round(valid.reduce((a, b) => a + b, 0) / valid.length);
};

const fmtMoney = (n) => {
  if (n === 0 || n == null) return "$0";
  return "$" + n.toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 2 });
};

const getItemBudget = (item) => item.budget || 0;

const getSubItemBudgetTotal = (item) => {
  if (!item.subItems) return 0;
  return item.subItems.reduce((sum, s) => sum + (s.budget || 0), 0);
};

const formatDate = (ts) => {
  if (!ts) return "";
  const d = new Date(ts), day = d.getDate();
  const sfx = day % 10 === 1 && day !== 11 ? "st" : day % 10 === 2 && day !== 12 ? "nd" : day % 10 === 3 && day !== 13 ? "rd" : "th";
  return `${day}${sfx} ${d.toLocaleString("en-US", { month: "long" })}, ${d.getFullYear()}  ${d.toLocaleString("en-US", { hour: "numeric", minute: "2-digit", hour12: true }).toLowerCase()}`;
};

const getAveragePriority = (item) => {
  if (!item.subItems || item.subItems.length === 0) return item.priority;
  const sum = item.subItems.reduce((a, s) => a + s.priority, 0);
  return Math.round((sum / item.subItems.length) * 10) / 10;
};

const sortSubItems = (subs, sm = "priority", rev = false) => {
  if (sm === "manual") return subs;
  const dir = rev ? -1 : 1;
  return [...subs].sort((a, b) => {
    switch (sm) {
      case "priority": if (b.priority !== a.priority) return (b.priority - a.priority) * dir; return a.name.localeCompare(b.name);
      case "alpha": return a.name.localeCompare(b.name) * dir;
      case "date": return ((b.createdAt || 0) - (a.createdAt || 0)) * dir;
      default: return 0;
    }
  });
};

const sortItems = (items, sm, rev) => {
  if (sm === "manual") return items;
  const dir = rev ? -1 : 1;
  return [...items].sort((a, b) => {
    switch (sm) {
      case "priority": { const ap = getAveragePriority(a), bp = getAveragePriority(b); if (bp !== ap) return (bp - ap) * dir; return a.name.localeCompare(b.name); }
      case "alpha": return a.name.localeCompare(b.name) * dir;
      case "date": return (b.createdAt - a.createdAt) * dir;
      default: return 0;
    }
  });
};

const getSortLabel = (m, r) => {
  switch (m) { case "priority": return r ? "Low → High" : "High → Low"; case "alpha": return r ? "Z → A" : "A → Z"; case "date": return r ? "Oldest first" : "Newest first"; case "manual": return "Drag to reorder"; default: return ""; }
};

function useUndoRedo(initial) {
  const [past, setPast] = useState([]);
  const [present, setPresent] = useState(initial);
  const [future, setFuture] = useState([]);
  const set = useCallback((ns) => { setPast((p) => [...p, present]); setPresent(typeof ns === "function" ? ns(present) : ns); setFuture([]); }, [present]);
  const undo = useCallback(() => { if (!past.length) return; setFuture((f) => [present, ...f]); setPresent(past[past.length - 1]); setPast((p) => p.slice(0, -1)); }, [past, present]);
  const redo = useCallback(() => { if (!future.length) return; setPast((p) => [...p, present]); setPresent(future[0]); setFuture((f) => f.slice(1)); }, [future, present]);
  return { state: present, set, undo, redo, canUndo: past.length > 0, canRedo: future.length > 0 };
}

function Popup({ title, children, dark }) {
  return (
    <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.4)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 }}>
      <div style={{ background: dark ? "#1a1a1a" : "#fff", borderRadius: 12, padding: "24px 28px", boxShadow: "0 8px 30px rgba(0,0,0,0.2)", maxWidth: 400, width: "90%", color: dark ? "#e0e0e0" : "#1a1a2e" }}>
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

function BudgetCapPopup({ itemName, currentBudget, minBudget, onSave, onCancel, dark, showDontAsk, onDontAsk }) {
  const [val, setVal] = useState(currentBudget ? String(currentBudget) : "");
  const [dontAsk, setDontAsk] = useState(false);
  const [error, setError] = useState("");
  const handleSave = () => {
    const n = parseFloat(val);
    const amount = isNaN(n) || n < 0 ? 0 : Math.round(n * 100) / 100;
    if (minBudget > 0 && amount < minBudget) {
      setError("Budget cannot be lower than " + fmtMoney(minBudget) + " (current sub-item total).");
      return;
    }
    setError("");
    onSave(amount);
    if (dontAsk && onDontAsk) onDontAsk();
  };
  return (
    <Popup title={"Set budget cap for \"" + itemName + "\""} dark={dark}>
      <p style={{ margin: "0 0 14px", fontSize: 13, color: dark ? "#aaa" : "#666", lineHeight: 1.5 }}>
        This budget will be the maximum total that can be allocated across all sub-items.
      </p>
      <div style={{ position: "relative", marginBottom: 16 }}>
        <span style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", fontSize: 16, fontWeight: 600, color: dark ? "#8ecae6" : "#2a6f97", pointerEvents: "none" }}>$</span>
        <input value={val} onChange={(e) => { const v = e.target.value; if (v === "" || /^\d*\.?\d{0,2}$/.test(v)) setVal(v); }} autoFocus placeholder="Enter budget"
          onKeyDown={(e) => e.key === "Enter" && handleSave()}
          style={{ ...getInputStyle(dark), width: "100%", boxSizing: "border-box", fontSize: 16, padding: "10px 12px", paddingLeft: 28 }} />
      </div>
      {error && <p style={{ margin: "0 0 10px", fontSize: 13, color: "#c0392b", fontWeight: 500 }}>{error}</p>}
      {showDontAsk && (
        <label style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: dark ? "#777" : "#999", marginBottom: 14, cursor: "pointer" }}>
          <input type="checkbox" checked={dontAsk} onChange={(e) => setDontAsk(e.target.checked)} style={{ accentColor: "#4285f4" }} />
          Don't ask me again
        </label>
      )}
      <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
        <button onClick={onCancel} style={{ padding: "8px 18px", fontSize: 13, fontWeight: 600, borderRadius: 6, border: "none", background: dark ? "#333" : "#eee", color: dark ? "#ccc" : "#555", cursor: "pointer" }}>Cancel</button>
        <button onClick={handleSave} style={{ padding: "8px 18px", fontSize: 13, fontWeight: 600, borderRadius: 6, border: "none", background: "#2a6f97", color: "#fff", cursor: "pointer" }}>Save</button>
      </div>
    </Popup>
  );
}

function BudgetExceededPopup({ remaining, onClose, dark }) {
  return (
    <Popup title="Budget exceeded" dark={dark}>
      <p style={{ margin: "0 0 16px", fontSize: 13, color: dark ? "#aaa" : "#666", lineHeight: 1.5 }}>
        The total sub-item budgets would exceed the root item's budget cap. You have <strong>{fmtMoney(remaining)}</strong> remaining. Please enter a smaller amount, or increase the root item's budget.
      </p>
      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <button onClick={onClose} style={{ padding: "8px 18px", fontSize: 13, fontWeight: 600, borderRadius: 6, border: "none", background: "#2a6f97", color: "#fff", cursor: "pointer" }}>OK</button>
      </div>
    </Popup>
  );
}

function DonutChart({ items, dark }) {
  const total = items.reduce((sum, i) => sum + getItemBudget(i), 0);
  if (total === 0) return null;
  const size = 200, cx = 100, cy = 100, r = 72, stroke = 24;
  const circumference = 2 * Math.PI * r;
  let cumulative = 0;
  const segments = items.map((item) => {
    const val = getItemBudget(item); if (val === 0) return null;
    const pct = val / total, offset = cumulative; cumulative += pct;
    return { id: item.id, name: item.name, val, pct, offset, color: item.chartColor || "#888" };
  }).filter(Boolean);
  return (
    <div style={{ marginTop: 28, display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
      <span style={{ fontSize: 13, fontWeight: 600, color: dark ? "#ccc" : "#555" }}>Budget Breakdown</span>
      <div style={{ position: "relative", width: size, height: size }}>
        <svg width={size} height={size} viewBox={"0 0 " + size + " " + size}>
          <circle cx={cx} cy={cy} r={r} fill="none" stroke={dark ? "#222" : "#e9ecef"} strokeWidth={stroke} />
          {segments.map((seg) => (
            <circle key={seg.id} cx={cx} cy={cy} r={r} fill="none" stroke={seg.color} strokeWidth={stroke}
              strokeDasharray={seg.pct * circumference + " " + circumference}
              strokeDashoffset={-seg.offset * circumference}
              transform={"rotate(-90 " + cx + " " + cy + ")"}
              style={{ transition: "stroke-dasharray 0.4s, stroke-dashoffset 0.4s" }} />
          ))}
        </svg>
        <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", textAlign: "center" }}>
          <div style={{ fontSize: 20, fontWeight: 700, color: dark ? "#e0e0e0" : "#1a1a2e" }}>{fmtMoney(total)}</div>
          <div style={{ fontSize: 10, color: dark ? "#777" : "#999" }}>Total</div>
        </div>
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "6px 14px", justifyContent: "center", maxWidth: 500 }}>
        {segments.map((seg) => (
          <span key={seg.id} style={{ fontSize: 11, color: dark ? "#aaa" : "#666", display: "flex", alignItems: "center", gap: 4 }}>
            <span style={{ width: 10, height: 10, borderRadius: 2, background: seg.color, display: "inline-block", flexShrink: 0 }} />
            {seg.name}: {fmtMoney(seg.val)} ({Math.round(seg.pct * 100)}%)
          </span>
        ))}
      </div>
    </div>
  );
}

function ProgressBar({ progress, dark }) {
  const getBarColor = (pct) => {
    if (pct <= 50) { const ratio = pct / 50; return "rgb(231, " + Math.round(76 + 80 * ratio) + ", " + Math.round(60 - 42 * ratio) + ")"; }
    const ratio = (pct - 50) / 50; return "rgb(" + Math.round(231 - 192 * ratio) + ", " + Math.round(156 + 18 * ratio) + ", " + Math.round(18 + 78 * ratio) + ")";
  };
  return (
    <div style={{ marginTop: 20, marginBottom: 8 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
        <span style={{ fontSize: 13, fontWeight: 600, color: dark ? "#ccc" : "#555" }}>Overall Progress</span>
        <span style={{ fontSize: 13, fontWeight: 700, color: getBarColor(progress) }}>{progress}%</span>
      </div>
      <div style={{ width: "100%", height: 20, borderRadius: 10, background: dark ? "#1a1a1a" : "#e9ecef", overflow: "hidden", position: "relative", border: "1px solid " + (dark ? "#222" : "#ddd") }}>
        <div style={{ height: "100%", borderRadius: 10, width: progress + "%", background: "linear-gradient(90deg, " + getBarColor(Math.max(progress - 20, 0)) + ", " + getBarColor(progress) + ")", transition: "width 0.5s ease, background 0.5s ease", position: "relative", overflow: "hidden" }}>
          {progress > 0 && progress < 100 && <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, background: "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.2) 50%, transparent 100%)", animation: "shine 2s infinite" }} />}
        </div>
      </div>
      <div style={{ display: "flex", gap: 12, marginTop: 6, justifyContent: "center" }}>
        {STATUSES.filter((s) => s.percent !== null).map((s) => (
          <span key={s.value} style={{ fontSize: 10, color: dark ? "#666" : "#aaa", display: "flex", alignItems: "center", gap: 3 }}>
            <span style={{ width: 8, height: 8, borderRadius: 2, background: s.color, display: "inline-block" }} />
            {s.label} = {s.percent}%
          </span>
        ))}
      </div>
    </div>
  );
}

function StatusBadge({ status, dark }) {
  const info = getStatusInfo(status);
  return <span style={{ fontSize: 11, fontWeight: 600, padding: "3px 6px", borderRadius: 4, background: dark ? "#2a2a2a" : info.bg, color: info.color, flexShrink: 0 }}>{info.label}</span>;
}

function StatusSelect({ value, onChange, small, dark }) {
  const info = getStatusInfo(value);
  return (
    <select value={value} onChange={(e) => onChange(e.target.value)}
      style={{ fontSize: small ? 10 : 11, fontWeight: 600, padding: small ? "2px 4px" : "3px 6px", borderRadius: 4, border: "none", cursor: "pointer", appearance: "auto", background: dark ? "#2a2a2a" : info.bg, color: info.color, flexShrink: 0 }}>
      {STATUSES.filter((s) => s.value !== "inprogress").map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
    </select>
  );
}

function PrioritySelect({ value, onChange, small, showPlaceholder, dark }) {
  const base = small ? { fontSize: 13, padding: "7px 10px", width: 62 } : { width: 72 };
  return (
    <select value={value} onChange={(e) => onChange(e.target.value)}
      style={{ ...getInputStyle(dark), textAlign: "center", cursor: "pointer", color: value ? (dark ? "#e0e0e0" : "#333") : "#999", ...base }}>
      {showPlaceholder && <option value="" disabled>Priority</option>}
      {[1,2,3,4,5,6,7,8,9,10].map((n) => <option key={n} value={n}>{n}</option>)}
    </select>
  );
}

function PriorityBadge({ value, small }) {
  const c = Math.max(1, Math.min(10, value)), hue = ((10 - c) / 9) * 200;
  return <span style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: small ? 26 : 32, height: small ? 26 : 32, borderRadius: 8, backgroundColor: "hsl(" + hue + ", 60%, 92%)", color: "hsl(" + hue + ", 55%, 35%)", fontWeight: 700, fontSize: small ? 12 : 14, flexShrink: 0 }}>{value}</span>;
}

function BudgetInput({ value, onChange, dark, small }) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value ? String(value) : "");
  const commit = () => { const n = parseFloat(draft); onChange(isNaN(n) || n < 0 ? 0 : Math.round(n * 100) / 100); setEditing(false); };
  if (editing) {
    return (
      <div style={{ display: "inline-flex", alignItems: "center", position: "relative", flexShrink: 0 }}>
        <span style={{ position: "absolute", left: 6, top: "50%", transform: "translateY(-50%)", fontSize: small ? 11 : 12, color: dark ? "#8ecae6" : "#2a6f97", fontWeight: 600, pointerEvents: "none" }}>$</span>
        <input value={draft} onChange={(e) => { const v = e.target.value; if (v === "" || /^\d*\.?\d{0,2}$/.test(v)) setDraft(v); }}
          onBlur={commit} onKeyDown={(e) => e.key === "Enter" && commit()}
          autoFocus placeholder="0" style={{ ...getInputStyle(dark), width: small ? 64 : 76, fontSize: small ? 11 : 12, padding: "3px 6px", paddingLeft: small ? 18 : 20 }} />
      </div>
    );
  }
  return (
    <button onClick={() => { setDraft(value ? String(value) : ""); setEditing(true); }} title="Click to set budget"
      style={{ background: "none", border: "1px dashed " + (dark ? "#444" : "#ccc"), borderRadius: 4, padding: small ? "2px 6px" : "3px 8px", fontSize: small ? 11 : 12, color: (value || 0) > 0 ? (dark ? "#8ecae6" : "#2a6f97") : (dark ? "#555" : "#bbb"), cursor: "pointer", fontWeight: 600, flexShrink: 0, whiteSpace: "nowrap" }}>
      {(value || 0) > 0 ? fmtMoney(value) : (small ? "$" : "$ Budget")}
    </button>
  );
}

function ColorPicker({ value, onChange }) {
  return <input type="color" value={value || "#888888"} onChange={(e) => onChange(e.target.value)} title="Pick chart color"
    style={{ width: 22, height: 22, border: "none", borderRadius: 4, cursor: "pointer", padding: 0, flexShrink: 0, background: "none" }} />;
}

function EditRow({ item, onSave, onCancel, isSubItem, dark }) {
  const [name, setName] = useState(item.name);
  const [priority, setPriority] = useState(String(item.priority));
  const [error, setError] = useState("");
  const handleSave = () => { const t = name.trim(), p = Number(priority); if (!t) return setError("Name can't be empty."); if (!Number.isInteger(p) || p < 1 || p > 10) return setError("Priority must be 1-10."); setError(""); onSave({ name: t, priority: p }); };
  const small = isSubItem ? { fontSize: 13, padding: "7px 10px" } : {};
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6, width: "100%" }}>
      <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
        <input value={name} onChange={(e) => setName(e.target.value)} style={{ ...getInputStyle(dark), flex: 1, minWidth: 100, ...small }} placeholder={isSubItem ? "Sub-item name" : "Item name"} autoFocus />
        <PrioritySelect value={priority} onChange={setPriority} small={isSubItem} dark={dark} />
        <button onClick={handleSave} style={btnSave}>Save</button>
        <button onClick={onCancel} style={getBtnCancel(dark)}>Cancel</button>
      </div>
      {error && <p style={errorStyle}>{error}</p>}
    </div>
  );
}

function SubItemRow({ subItem, onEdit, onDelete, editingId, onEditSave, onEditCancel, onStatusChange, onBudgetChange, dark }) {
  const isEditing = editingId === subItem.id;
  return (
    <div style={getSubItemRowStyle(dark)}>
      {isEditing ? (
        <EditRow item={subItem} isSubItem onSave={(u) => onEditSave(subItem.id, u)} onCancel={onEditCancel} dark={dark} />
      ) : (
        <>
          <PriorityBadge value={subItem.priority} small />
          <span style={{ flex: 1, fontSize: 13, color: dark ? "#ccc" : "#333", marginLeft: 4 }}>{subItem.name}</span>
          <BudgetInput value={subItem.budget || 0} onChange={(v) => onBudgetChange(subItem.id, v)} dark={dark} small />
          <StatusSelect value={subItem.status || "want"} onChange={(s) => onStatusChange(subItem.id, s)} small dark={dark} />
          <span style={{ fontSize: 10, color: dark ? "#555" : "#bbb", whiteSpace: "nowrap", flexShrink: 0 }}>{formatDate(subItem.createdAt)}</span>
          <button onClick={() => onEdit(subItem.id)} style={getBtnIcon(dark)} title="Edit">✎</button>
          <button onClick={() => onDelete(subItem.id)} style={{ ...getBtnIcon(dark), color: "#c0392b" }} title="Delete">✕</button>
        </>
      )}
    </div>
  );
}

function AddSubItemForm({ onAdd, dark }) {
  const [name, setName] = useState(""); const [priority, setPriority] = useState(""); const [budget, setBudget] = useState(""); const [error, setError] = useState("");
  const handleAdd = () => {
    const t = name.trim(), p = Number(priority);
    if (!t) return setError("Name can't be empty.");
    if (!Number.isInteger(p) || p < 1 || p > 10) return setError("Priority must be 1-10.");
    const b = parseFloat(budget);
    const budgetVal = isNaN(b) || b < 0 ? 0 : Math.round(b * 100) / 100;
    onAdd({ name: t, priority: p, budget: budgetVal }); setName(""); setPriority(""); setBudget(""); setError("");
  };
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6, marginTop: 6 }}>
      <div style={{ display: "flex", gap: 6, alignItems: "center", flexWrap: "wrap" }}>
        <input value={name} onChange={(e) => setName(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleAdd()}
          placeholder="Add sub-item..." style={{ ...getInputStyle(dark), flex: 1, minWidth: 80, fontSize: 13, padding: "7px 10px" }} />
        <div style={{ position: "relative", flexShrink: 0 }}>
          <span style={{ position: "absolute", left: 8, top: "50%", transform: "translateY(-50%)", fontSize: 12, color: dark ? "#8ecae6" : "#2a6f97", fontWeight: 600, pointerEvents: "none" }}>$</span>
          <input value={budget} onChange={(e) => { const v = e.target.value; if (v === "" || /^\d*\.?\d{0,2}$/.test(v)) setBudget(v); }}
            onKeyDown={(e) => e.key === "Enter" && handleAdd()}
            placeholder="Budget" style={{ ...getInputStyle(dark), width: 76, fontSize: 13, padding: "7px 10px", paddingLeft: 20 }} />
        </div>
        <PrioritySelect value={priority} onChange={setPriority} small showPlaceholder dark={dark} />
        <button onClick={handleAdd} style={{ ...btnAdd, padding: "7px 14px", fontSize: 13 }}>Add</button>
      </div>
      {error && <p style={errorStyle}>{error}</p>}
    </div>
  );
}

function WishlistItem({ item, onDelete, onEdit, onEditSave, editingId, onEditCancel, onAddSub, onDeleteSub, onEditSub, onEditSubSave, onStatusChange, onSubStatusChange, onBudgetChange, onSubBudgetChange, onColorChange, onRootBudgetClick, dark, selected, onToggleSelect, selectMode, onDragStart, onDragOver, onDrop, dragOverId }) {
  const [expanded, setExpanded] = useState(false);
  const hasSubs = item.subItems && item.subItems.length > 0;
  const avgPriority = getAveragePriority(item);
  const isEditing = editingId === item.id;
  const isDragOver = dragOverId === item.id;
  const rootStatus = deriveRootStatus(item);
  const subTotal = getSubItemBudgetTotal(item);

  return (
    <div style={{ ...getItemContainer(dark), outline: selected ? "2px solid #4285f4" : "none", borderTop: isDragOver ? "3px solid #4285f4" : "1px solid " + (dark ? "#222" : "#eee"), transition: "border-top 0.1s" }}
      draggable={!isEditing && !selectMode}
      onDragStart={(e) => onDragStart && onDragStart(e, item.id)}
      onDragOver={(e) => onDragOver && onDragOver(e, item.id)}
      onDrop={(e) => onDrop && onDrop(e, item.id)}>
      <div style={getItemRow(dark)}>
        {isEditing ? (
          <EditRow item={item} onSave={(u) => onEditSave(item.id, u)} onCancel={onEditCancel} dark={dark} />
        ) : (
          <>
            {selectMode && <input type="checkbox" checked={selected} onChange={() => onToggleSelect(item.id)} style={{ width: 18, height: 18, cursor: "pointer", accentColor: "#4285f4", flexShrink: 0 }} />}
            <button onClick={() => setExpanded(!expanded)} style={{ ...getBtnIcon(dark), fontSize: 12, transform: expanded ? "rotate(90deg)" : "rotate(0deg)", transition: "transform 0.15s" }} title={expanded ? "Collapse" : "Expand"}>▶</button>
            <ColorPicker value={item.chartColor} onChange={(c) => onColorChange(item.id, c)} />
            <PriorityBadge value={avgPriority} />
            <div style={{ flex: 1, marginLeft: 4, minWidth: 0 }}>
              <span style={{ fontSize: 15, color: dark ? "#e0e0e0" : "#1a1a2e", fontWeight: 500 }}>{item.name}</span>
            </div>
            {hasSubs ? (
              <button onClick={() => onRootBudgetClick(item.id)} title="Click to change budget cap"
                style={{ background: "none", border: "1px solid " + (dark ? "#444" : "#ccc"), borderRadius: 4, padding: "3px 8px", fontSize: 12, fontWeight: 600, color: dark ? "#8ecae6" : "#2a6f97", cursor: "pointer", flexShrink: 0, whiteSpace: "nowrap" }}>
                {fmtMoney(subTotal)} / {fmtMoney(item.budget || 0)}
              </button>
            ) : (
              <BudgetInput value={item.budget || 0} onChange={(v) => onBudgetChange(item.id, v)} dark={dark} />
            )}
            {hasSubs ? <StatusBadge status={rootStatus} dark={dark} /> : <StatusSelect value={item.status || "want"} onChange={(s) => onStatusChange(item.id, s)} dark={dark} />}
            <span style={{ fontSize: 11, color: dark ? "#555" : "#aaa", whiteSpace: "nowrap", flexShrink: 0 }}>{formatDate(item.createdAt)}</span>
            {!selectMode && (
              <>
                <button onClick={() => onEdit(item.id)} style={getBtnIcon(dark)} title="Edit">✎</button>
                <button onClick={() => onDelete(item.id)} style={{ ...getBtnIcon(dark), color: "#c0392b" }} title="Delete">✕</button>
              </>
            )}
          </>
        )}
      </div>
      {expanded && (
        <div style={getSubPanel(dark)}>
          {hasSubs ? item.subItems.map((sub) => (
            <SubItemRow key={sub.id} subItem={sub} editingId={editingId} onEdit={onEditSub}
              onDelete={(subId) => onDeleteSub(item.id, subId)}
              onEditSave={(subId, u) => onEditSubSave(item.id, subId, u)}
              onEditCancel={onEditCancel}
              onStatusChange={(subId, s) => onSubStatusChange(item.id, subId, s)}
              onBudgetChange={(subId, v) => onSubBudgetChange(item.id, subId, v)}
              dark={dark} />
          )) : (
            <p style={{ fontSize: 12, color: dark ? "#555" : "#bbb", margin: "4px 0", textAlign: "center" }}>No sub-items yet.</p>
          )}
          <AddSubItemForm onAdd={(subData) => onAddSub(item.id, subData)} dark={dark} />
        </div>
      )}
    </div>
  );
}

function SearchSortBar({ searchQuery, onSearchChange, sortMode, onSortChange, reversed, onToggleReversed, dark }) {
  return (
    <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap", marginTop: 16 }}>
      <div style={{ flex: 1, minWidth: 140, position: "relative" }}>
        <span style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", fontSize: 14, color: "#aaa", pointerEvents: "none" }}>🔍</span>
        <input value={searchQuery} onChange={(e) => onSearchChange(e.target.value)} placeholder="Search items..."
          style={{ ...getInputStyle(dark), width: "100%", paddingLeft: 32, boxSizing: "border-box" }} />
      </div>
      <select value={sortMode} onChange={(e) => onSortChange(e.target.value)}
        style={{ ...getInputStyle(dark), cursor: "pointer", color: dark ? "#ccc" : "#555", minWidth: 130, appearance: "auto" }}>
        <option value="priority">Sort: Priority</option>
        <option value="alpha">Sort: Alphabetical</option>
        <option value="date">Sort: Date Added</option>
        <option value="manual">Sort: Manual</option>
      </select>
      <button onClick={onToggleReversed} title={"Currently: " + getSortLabel(sortMode, reversed)} disabled={sortMode === "manual"}
        style={{ ...getInputStyle(dark), display: "inline-flex", alignItems: "center", justifyContent: "center", width: 42, height: 42, padding: 0, cursor: sortMode === "manual" ? "default" : "pointer", background: reversed ? "#e8f0fe" : (dark ? "#222" : "#fafafa"), borderColor: reversed ? "#4285f4" : (dark ? "#333" : "#e0e0e0"), color: reversed ? "#4285f4" : "#999", fontSize: 18, fontWeight: 700, transition: "all 0.15s", flexShrink: 0, opacity: sortMode === "manual" ? 0.4 : 1 }}>⇅</button>
    </div>
  );
}

function ShineStyle() { return <style>{"@keyframes shine { 0% { transform: translateX(-100%); } 100% { transform: translateX(200%); } }"}</style>; }

export default function WishlistApp() {
  const [dark, setDark] = useState(false);
  const { state: items, set: setItems, undo, redo, canUndo, canRedo } = useUndoRedo([]);
  const [name, setName] = useState("");
  const [priority, setPriority] = useState("");
  const [budget, setBudget] = useState("");
  const [error, setError] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortMode, setSortMode] = useState("priority");
  const [reversed, setReversed] = useState(false);
  const [confirmAction, setConfirmAction] = useState(null);
  const [selectMode, setSelectMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [dragOverId, setDragOverId] = useState(null);
  const dragItem = useRef(null);
  const [budgetPopup, setBudgetPopup] = useState(null);
  const [budgetExceeded, setBudgetExceeded] = useState(null);
  const [colorConflict, setColorConflict] = useState(null);
  const [dontAskBudgetCap, setDontAskBudgetCap] = useState(false);
  const [dontAskBudgetChange, setDontAskBudgetChange] = useState(false);

  const overallProgress = useMemo(() => getOverallProgress(items), [items]);

  useEffect(() => {
    const handler = (e) => { if ((e.metaKey || e.ctrlKey) && e.key === "z") { e.preventDefault(); if (e.shiftKey) redo(); else undo(); } };
    window.addEventListener("keydown", handler); return () => window.removeEventListener("keydown", handler);
  }, [undo, redo]);

  const displayedItems = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    let filtered = items;
    if (q) filtered = items.filter((i) => i.name.toLowerCase().includes(q) || i.subItems?.some((s) => s.name.toLowerCase().includes(q)));
    const sorted = sortItems(filtered, sortMode, reversed);
    return sorted.map((i) => ({ ...i, subItems: sortSubItems(i.subItems || [], sortMode, reversed) }));
  }, [items, searchQuery, sortMode, reversed]);

  const handleAdd = useCallback(() => {
    const t = name.trim(), p = Number(priority);
    if (!t) return setError("Please enter an item name.");
    if (!Number.isInteger(p) || p < 1 || p > 10) return setError("Priority must be a whole number from 1 to 10.");
    const b = parseFloat(budget);
    const budgetVal = isNaN(b) || b < 0 ? 0 : Math.round(b * 100) / 100;
    setItems((prev) => sortItems([...prev, { id: generateId(), name: t, priority: p, subItems: [], createdAt: Date.now(), status: "want", budget: budgetVal, chartColor: randomColor() }], sortMode, reversed));
    setName(""); setPriority(""); setBudget(""); setError("");
  }, [name, priority, budget, sortMode, reversed, setItems]);

  const requestDelete = useCallback((id) => {
    const item = items.find((i) => i.id === id); const sc = item?.subItems?.length || 0;
    setConfirmAction({ message: sc > 0 ? "Delete \"" + item.name + "\" and its " + sc + " sub-item" + (sc !== 1 ? "s" : "") + "?" : "Delete \"" + (item?.name) + "\"?", action: () => { setItems((prev) => prev.filter((i) => i.id !== id)); if (editingId === id) setEditingId(null); setConfirmAction(null); } });
  }, [items, editingId, setItems]);

  const requestBulkDelete = useCallback(() => {
    if (selectedIds.size === 0) return;
    setConfirmAction({ message: "Delete " + selectedIds.size + " selected item" + (selectedIds.size !== 1 ? "s" : "") + " and all their sub-items?", action: () => { setItems((prev) => prev.filter((i) => !selectedIds.has(i.id))); setSelectedIds(new Set()); setSelectMode(false); setConfirmAction(null); } });
  }, [selectedIds, setItems]);

  const handleEditSave = useCallback((id, u) => { setItems((prev) => sortItems(prev.map((i) => (i.id === id ? { ...i, ...u } : i)), sortMode, reversed)); setEditingId(null); }, [sortMode, reversed, setItems]);
  const handleStatusChange = useCallback((id, s) => { setItems((prev) => prev.map((i) => (i.id === id ? { ...i, status: s } : i))); }, [setItems]);
  const handleSubStatusChange = useCallback((pid, sid, s) => { setItems((prev) => prev.map((i) => { if (i.id !== pid) return i; return { ...i, subItems: i.subItems.map((x) => (x.id === sid ? { ...x, status: s } : x)) }; })); }, [setItems]);
  const handleBudgetChange = useCallback((id, v) => { setItems((prev) => prev.map((i) => (i.id === id ? { ...i, budget: v } : i))); }, [setItems]);

  const handleColorChange = useCallback((id, c) => {
    const conflict = items.find((i) => i.id !== id && i.chartColor && i.chartColor.toLowerCase() === c.toLowerCase());
    if (conflict) { setColorConflict(conflict.name); return; }
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, chartColor: c } : i)));
  }, [items, setItems]);

  const handleSubBudgetChange = useCallback((pid, sid, newVal) => {
    const parent = items.find((i) => i.id === pid);
    if (!parent) return;
    const cap = parent.budget || 0;
    const otherTotal = (parent.subItems || []).filter((s) => s.id !== sid).reduce((sum, s) => sum + (s.budget || 0), 0);
    if (cap > 0 && otherTotal + newVal > cap) { setBudgetExceeded({ remaining: Math.max(0, cap - otherTotal) }); return; }
    setItems((prev) => prev.map((i) => { if (i.id !== pid) return i; return { ...i, subItems: i.subItems.map((x) => (x.id === sid ? { ...x, budget: newVal } : x)) }; }));
  }, [items, setItems]);

  const handleRootBudgetClick = useCallback((id) => {
    if (dontAskBudgetChange) { setBudgetPopup({ itemId: id, isFirstSub: false, skipMessage: true }); }
    else { setBudgetPopup({ itemId: id, isFirstSub: false }); }
  }, [dontAskBudgetChange]);

  const handleBudgetCapSave = useCallback((val) => {
    if (!budgetPopup) return;
    setItems((prev) => prev.map((i) => (i.id === budgetPopup.itemId ? { ...i, budget: val } : i)));
    setBudgetPopup(null);
  }, [budgetPopup, setItems]);

  const handleAddSub = useCallback((pid, sd) => {
    const parent = items.find((i) => i.id === pid);
    const isFirst = !parent?.subItems || parent.subItems.length === 0;
    const cap = parent?.budget || 0;
    const currentTotal = getSubItemBudgetTotal(parent || { subItems: [] });
    const newBudget = sd.budget || 0;
    if (cap > 0 && newBudget > 0 && currentTotal + newBudget > cap) {
      setBudgetExceeded({ remaining: Math.max(0, cap - currentTotal) });
      return;
    }
    setItems((prev) => sortItems(prev.map((i) => {
      if (i.id !== pid) return i;
      return { ...i, subItems: sortSubItems([...i.subItems, { id: generateId(), ...sd, createdAt: Date.now(), status: "want", budget: sd.budget || 0 }], sortMode, reversed) };
    }), sortMode, reversed));
    if (isFirst && !dontAskBudgetCap) setBudgetPopup({ itemId: pid, isFirstSub: true });
  }, [items, sortMode, reversed, setItems, dontAskBudgetCap]);

  const requestDeleteSub = useCallback((pid, sid) => {
    const parent = items.find((i) => i.id === pid); const sub = parent?.subItems?.find((s) => s.id === sid);
    setConfirmAction({ message: "Delete sub-item \"" + (sub?.name) + "\"?", action: () => {
      setItems((prev) => sortItems(prev.map((i) => { if (i.id !== pid) return i; return { ...i, subItems: sortSubItems(i.subItems.filter((s) => s.id !== sid), sortMode, reversed) }; }), sortMode, reversed));
      if (editingId === sid) setEditingId(null); setConfirmAction(null);
    } });
  }, [items, editingId, sortMode, reversed, setItems]);

  const handleEditSubSave = useCallback((pid, sid, u) => {
    setItems((prev) => sortItems(prev.map((i) => { if (i.id !== pid) return i; return { ...i, subItems: sortSubItems(i.subItems.map((s) => (s.id === sid ? { ...s, ...u } : s)), sortMode, reversed) }; }), sortMode, reversed));
    setEditingId(null);
  }, [sortMode, reversed, setItems]);

  const handleDragStart = (e, id) => { dragItem.current = id; e.dataTransfer.effectAllowed = "move"; };
  const handleDragOver = (e, id) => { e.preventDefault(); if (dragItem.current !== id) setDragOverId(id); };
  const handleDrop = (e, targetId) => {
    e.preventDefault(); setDragOverId(null);
    if (dragItem.current === null || dragItem.current === targetId) return;
    const order = displayedItems.map((i) => i.id);
    const fi = order.indexOf(dragItem.current), ti = order.indexOf(targetId);
    if (fi === -1 || ti === -1) { dragItem.current = null; return; }
    order.splice(fi, 1); order.splice(ti, 0, dragItem.current);
    setItems((prev) => { const map = new Map(prev.map((i) => [i.id, i])); const reordered = order.filter((id) => map.has(id)).map((id) => map.get(id)); const remaining = prev.filter((i) => !order.includes(i.id)); return [...reordered, ...remaining]; });
    setSortMode("manual"); setReversed(false); dragItem.current = null;
  };
  const handleDragEnd = () => { setDragOverId(null); dragItem.current = null; };

  const toggleSelect = (id) => { setSelectedIds((p) => { const n = new Set(p); if (n.has(id)) n.delete(id); else n.add(id); return n; }); };
  const toggleSelectAll = () => { if (selectedIds.size === displayedItems.length) setSelectedIds(new Set()); else setSelectedIds(new Set(displayedItems.map((i) => i.id))); };
  const exitSelectMode = () => { setSelectMode(false); setSelectedIds(new Set()); };

  const totalItems = items.length, shownItems = displayedItems.length, isSearching = searchQuery.trim().length > 0;
  const budgetPopupItem = budgetPopup ? items.find((i) => i.id === budgetPopup.itemId) : null;

  return (
    <div style={{ background: dark ? "#0a0a0a" : "#f0f0f0", minHeight: "100vh", transition: "background 0.2s" }}>
      <ShineStyle />
      <div style={getContainer(dark)}>
        {confirmAction && <ConfirmDialog message={confirmAction.message} onConfirm={confirmAction.action} onCancel={() => setConfirmAction(null)} dark={dark} />}
        {budgetPopup && budgetPopupItem && (
          <BudgetCapPopup itemName={budgetPopupItem.name} currentBudget={budgetPopupItem.budget}
            minBudget={getSubItemBudgetTotal(budgetPopupItem)}
            onSave={handleBudgetCapSave} onCancel={() => setBudgetPopup(null)} dark={dark}
            showDontAsk={budgetPopup.isFirstSub} onDontAsk={() => setDontAskBudgetCap(true)} />
        )}
        {budgetExceeded && <BudgetExceededPopup remaining={budgetExceeded.remaining} onClose={() => setBudgetExceeded(null)} dark={dark} />}
        {colorConflict && (
          <Popup title="Color already in use" dark={dark}>
            <p style={{ margin: "0 0 16px", fontSize: 13, color: dark ? "#aaa" : "#666", lineHeight: 1.5 }}>
              This color is already assigned to <strong>"{colorConflict}"</strong>. Each root item must have a unique color so the budget chart is easy to read. Please choose a different color.
            </p>
            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <button onClick={() => setColorConflict(null)} style={{ padding: "8px 18px", fontSize: 13, fontWeight: 600, borderRadius: 6, border: "none", background: "#2a6f97", color: "#fff", cursor: "pointer" }}>OK</button>
            </div>
          </Popup>
        )}

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 4 }}>
          <h1 style={{ margin: 0, fontSize: 22, fontWeight: 700, color: dark ? "#e0e0e0" : "#1a1a2e" }}>Wishlist</h1>
          <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
            <button onClick={undo} disabled={!canUndo} title="Undo (Ctrl+Z)" style={{ ...getBtnIcon(dark), opacity: canUndo ? 1 : 0.3, fontSize: 18 }}>↩</button>
            <button onClick={redo} disabled={!canRedo} title="Redo (Ctrl+Shift+Z)" style={{ ...getBtnIcon(dark), opacity: canRedo ? 1 : 0.3, fontSize: 18 }}>↪</button>
            <div onClick={() => setDark((d) => !d)} title={dark ? "Light mode" : "Dark mode"}
              style={{ width: 48, height: 26, borderRadius: 13, background: dark ? "#333" : "#ccc", position: "relative", cursor: "pointer", transition: "background 0.2s", flexShrink: 0 }}>
              <div style={{ width: 20, height: 20, borderRadius: 10, background: "#fff", position: "absolute", top: 3, left: dark ? 25 : 3, transition: "left 0.2s", boxShadow: "0 1px 3px rgba(0,0,0,0.2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11 }}>
                {dark ? "🌙" : "☀️"}
              </div>
            </div>
          </div>
        </div>
        <p style={{ margin: "0 0 20px", fontSize: 13, color: dark ? "#666" : "#888" }}>Add items and rank them 1-10. Click ▶ to expand sub-items.</p>

        {totalItems > 0 && <ProgressBar progress={overallProgress} dark={dark} />}

        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <input value={name} onChange={(e) => setName(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleAdd()}
            placeholder="Item name" style={{ ...getInputStyle(dark), flex: 1, minWidth: 140 }} />
          <div style={{ position: "relative", flexShrink: 0 }}>
            <span style={{ position: "absolute", left: 8, top: "47%", transform: "translateY(-50%)", fontSize: 14, color: dark ? "#8ecae6" : "#2a6f97", fontWeight: 600, pointerEvents: "none" }}>$</span>
            <input value={budget} onChange={(e) => { const v = e.target.value; if (v === "" || /^\d*\.?\d{0,2}$/.test(v)) setBudget(v); }}
              onKeyDown={(e) => e.key === "Enter" && handleAdd()}
              placeholder="Budget" style={{ ...getInputStyle(dark), width: 100, paddingLeft: 22 }} />
          </div>
          <PrioritySelect value={priority} onChange={setPriority} showPlaceholder dark={dark} />
          <button onClick={handleAdd} style={btnAdd}>Add</button>
        </div>
        {error && <p style={errorStyle}>{error}</p>}

        {totalItems > 0 && (
          <>
            <SearchSortBar searchQuery={searchQuery} onSearchChange={setSearchQuery} sortMode={sortMode} onSortChange={(m) => { setSortMode(m); setReversed(false); }} reversed={reversed} onToggleReversed={() => setReversed((r) => !r)} dark={dark} />
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 6 }}>
              <p style={{ fontSize: 11, color: dark ? "#555" : "#bbb", margin: 0 }}>{getSortLabel(sortMode, reversed)}</p>
              {!selectMode ? (
                <button onClick={() => setSelectMode(true)} style={{ ...getBtnIcon(dark), fontSize: 12, color: dark ? "#888" : "#999" }}>☐ Select</button>
              ) : (
                <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                  <button onClick={toggleSelectAll} style={{ ...getBtnIcon(dark), fontSize: 12 }}>{selectedIds.size === displayedItems.length ? "Deselect all" : "Select all"}</button>
                  <button onClick={requestBulkDelete} disabled={selectedIds.size === 0}
                    style={{ fontSize: 12, fontWeight: 600, padding: "4px 10px", borderRadius: 6, border: "none", background: selectedIds.size > 0 ? "#c0392b" : (dark ? "#333" : "#ddd"), color: selectedIds.size > 0 ? "#fff" : "#999", cursor: selectedIds.size > 0 ? "pointer" : "default" }}>Delete ({selectedIds.size})</button>
                  <button onClick={exitSelectMode} style={{ ...getBtnIcon(dark), fontSize: 12 }}>✕ Cancel</button>
                </div>
              )}
            </div>
          </>
        )}

        {isSearching && totalItems > 0 && (
          <p style={{ fontSize: 12, color: dark ? "#666" : "#999", margin: "4px 0 0" }}>
            Showing {shownItems} of {totalItems} item{totalItems !== 1 ? "s" : ""}{shownItems === 0 && " - try a different search term"}
          </p>
        )}

        <div style={{ marginTop: 12, display: "flex", flexDirection: "column", gap: 10 }} onDragEnd={handleDragEnd}>
          {totalItems === 0 ? (
            <p style={{ textAlign: "center", color: dark ? "#555" : "#aaa", fontSize: 14, padding: 32 }}>Your wishlist is empty - add something above!</p>
          ) : shownItems === 0 ? (
            <p style={{ textAlign: "center", color: dark ? "#555" : "#aaa", fontSize: 14, padding: 32 }}>No items match your search.</p>
          ) : (
            displayedItems.map((item) => (
              <WishlistItem key={item.id} item={item} editingId={editingId} dark={dark}
                onDelete={requestDelete} onEdit={(id) => setEditingId(id)} onEditSave={handleEditSave}
                onEditCancel={() => setEditingId(null)} onAddSub={handleAddSub} onDeleteSub={requestDeleteSub}
                onEditSub={(id) => setEditingId(id)} onEditSubSave={handleEditSubSave}
                onStatusChange={handleStatusChange} onSubStatusChange={handleSubStatusChange}
                onBudgetChange={handleBudgetChange} onSubBudgetChange={handleSubBudgetChange}
                onColorChange={handleColorChange} onRootBudgetClick={handleRootBudgetClick}
                selected={selectedIds.has(item.id)} onToggleSelect={toggleSelect} selectMode={selectMode}
                onDragStart={handleDragStart} onDragOver={handleDragOver} onDrop={handleDrop} dragOverId={dragOverId} />
            ))
          )}
        </div>

        {totalItems > 0 && items.some((i) => getItemBudget(i) > 0) && <DonutChart items={items} dark={dark} />}
      </div>
    </div>
  );
}

const getContainer = (dark) => ({ maxWidth: 1400, margin: "0 auto", padding: "40px 60px", fontFamily: "'Inter', system-ui, -apple-system, sans-serif", background: dark ? "#111111" : "#fff", minHeight: "100vh", boxSizing: "border-box", transition: "background 0.2s, color 0.2s" });
const getInputStyle = (dark) => ({ padding: "10px 12px", fontSize: 14, border: "1.5px solid " + (dark ? "#333" : "#e0e0e0"), borderRadius: 8, outline: "none", transition: "border 0.15s", background: dark ? "#1a1a1a" : "#fafafa", color: dark ? "#e0e0e0" : "#333" });
const getBtnIcon = (dark) => ({ background: "none", border: "none", cursor: "pointer", fontSize: 16, color: "#888", padding: "4px 6px", borderRadius: 4, transition: "background 0.15s" });
const getBtnCancel = (dark) => ({ padding: "6px 14px", fontSize: 13, fontWeight: 600, background: dark ? "#333" : "#eee", color: dark ? "#ccc" : "#555", border: "none", borderRadius: 6, cursor: "pointer" });
const getItemContainer = (dark) => ({ borderRadius: 10, border: "1px solid " + (dark ? "#222" : "#eee"), overflow: "hidden" });
const getItemRow = (dark) => ({ display: "flex", alignItems: "center", gap: 10, padding: "10px 14px", background: dark ? "#1a1a1a" : "#f8f9fa" });
const getSubPanel = (dark) => ({ padding: "8px 14px 12px 42px", background: dark ? "#111111" : "#f1f3f5", borderTop: "1px solid " + (dark ? "#222" : "#e9ecef"), display: "flex", flexDirection: "column", gap: 6 });
const getSubItemRowStyle = (dark) => ({ display: "flex", alignItems: "center", gap: 8, padding: "6px 10px", background: dark ? "#1a1a1a" : "#fff", borderRadius: 6, border: "1px solid " + (dark ? "#222" : "#e9ecef") });
const btnAdd = { padding: "10px 20px", fontSize: 14, fontWeight: 600, background: "#1a1a2e", color: "#fff", border: "none", borderRadius: 8, cursor: "pointer" };
const btnSave = { padding: "6px 14px", fontSize: 13, fontWeight: 600, background: "#27ae60", color: "#fff", border: "none", borderRadius: 6, cursor: "pointer" };
const errorStyle = { margin: "8px 0 0", fontSize: 13, color: "#c0392b", fontWeight: 500 };