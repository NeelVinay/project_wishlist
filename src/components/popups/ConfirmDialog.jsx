import React from "react";
import Popup from "./Popup";

export default function ConfirmDialog({ message, onConfirm, onCancel, dark }) {
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
