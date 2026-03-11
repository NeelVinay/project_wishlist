import React from "react";
import PriBadge from "./PriBadge";
import SavedInp from "./SavedInp";
import BudgetInp from "./BudgetInp";
import EditRow from "./EditRow";
import { icnBtn, subRowS } from "../styles";
import { formatDate } from "../utils/formatting";

export default function SubRow({ sub, onEdit, onDel, editId, onEditSave, onEditCancel, onBudget, onSaved, onToggle, dark, currency }) {
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
