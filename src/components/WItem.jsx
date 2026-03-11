import React, { useState } from "react";
import PriBadge from "./PriBadge";
import SavedInp from "./SavedInp";
import BudgetInp from "./BudgetInp";
import ColorPick from "./ColorPick";
import EditRow from "./EditRow";
import SubRow from "./SubRow";
import AddSubForm from "./AddSubForm";
import { getAvgPri, getSubBudgetTotal, getSubSavedTotal } from "../utils/calculations";
import { fmtMoney, formatDate } from "../utils/formatting";
import { icnBtn, itemCont, itemRow, subPanel } from "../styles";

export default function WItem({ item, onDel, onEdit, onEditSave, editId, onEditCancel, onAddSub, onDelSub, onEditSub, onEditSubSave, onBudget, onSubBudget, onSaved, onSubSaved, onColor, onRootBudgetClick, onToggle, onToggleSub, dark, selected, onToggleSel, selMode, onDragStart, onDragOver, onDrop, dragOverId, currency }) {
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
