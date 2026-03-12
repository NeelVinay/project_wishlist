import React, { useState, useCallback, useMemo, useRef, useEffect } from "react";
import { useUndoRedo } from "../hooks/useUndoRedo";
import { CURRENCIES } from "../constants/currencies";
import { generateId, randomColor } from "../utils/ids";
import { loadItems, saveItems, loadCurrencyCode, saveCurrencyCode, loadPref, savePref } from "../utils/storage";
import { fmtMoney, formatDate } from "../utils/formatting";
import { sortRoot, sortSubs, getSortLabel } from "../utils/sorting";
import { getItemBudget, getSubBudgetTotal, getSubSavedTotal } from "../utils/calculations";
import { cont, inp, icnBtn, btnAd, errS } from "../styles";
import Popup from "../components/popups/Popup";
import ConfirmDialog from "../components/popups/ConfirmDialog";
import BudgetCapPopup from "../components/popups/BudgetCapPopup";
import BudgetExceededPopup from "../components/popups/BudgetExceededPopup";
import ShineStyle from "../components/ShineStyle";
import ProgressSection from "../components/ProgressSection";
import DonutChart from "../components/DonutChart";
import CurrencySelector from "../components/CurrencySelector";
import SearchSort from "../components/SearchSort";
import PriSelect from "../components/PriSelect";
import PriBadge from "../components/PriBadge";
import WItem from "../components/WItem";
import CompletedRoot from "../components/CompletedRoot";

export default function WishlistApp() {
  const dark = true;
  const [loading, setLoading] = useState(true);
  const [currency, setCurrency] = useState(CURRENCIES[0]);
  const { state: items, set: setItems, undo, redo, reset, canUndo, canRedo } = useUndoRedo([], saveItems);
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
    Promise.all([loadItems(), loadCurrencyCode(), loadPref("dontAskBudgetCap")]).then(([loadedItems, code, dontAskPref]) => {
      if (loadedItems.length > 0) reset(loadedItems);
      if (code) { const found = CURRENCIES.find(c => c.code === code); if (found) setCurrency(found); }
      if (dontAskPref !== null) setDontAskBudgetCap(dontAskPref);
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    const h = (e) => { if ((e.metaKey || e.ctrlKey) && e.key === "z") { e.preventDefault(); if (e.shiftKey) redo(); else undo(); } };
    window.addEventListener("keydown", h); return () => window.removeEventListener("keydown", h);
  }, [undo, redo]);

  useEffect(() => { if (!loading) saveCurrencyCode(currency.code); }, [currency, loading]);
  useEffect(() => { if (!loading) savePref("dontAskBudgetCap", dontAskBudgetCap); }, [dontAskBudgetCap, loading]);

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

  if (loading) return (
    <div style={{ background: "#0a0a0a", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Inter',system-ui,-apple-system,sans-serif" }}>
      <p style={{ fontSize: 16, color: "rgba(255,255,255,0.4)" }}>Loading...</p>
    </div>
  );

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

        {/* Completed section */}
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
