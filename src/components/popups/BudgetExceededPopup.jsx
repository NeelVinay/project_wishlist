import React from "react";
import Popup from "./Popup";
import { fmtMoney } from "../../utils/formatting";

export default function BudgetExceededPopup({ remaining, onClose, dark, currency }) {
  return (
    <Popup title="Budget exceeded" dark={dark}>
      <p style={{ margin: "0 0 16px", fontSize: 13, color: dark ? "#aaa" : "#666", lineHeight: 1.5 }}>Sub-item budgets would exceed the cap. You have <strong>{fmtMoney(remaining, currency)}</strong> remaining.</p>
      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <button onClick={onClose} style={{ padding: "8px 18px", fontSize: 13, fontWeight: 600, borderRadius: 6, border: "none", background: "#2a6f97", color: "#fff", cursor: "pointer" }}>OK</button>
      </div>
    </Popup>
  );
}
