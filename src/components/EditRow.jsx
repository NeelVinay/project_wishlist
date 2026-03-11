import React, { useState } from "react";
import PriSelect from "./PriSelect";
import { inp, btnSv, btnCn, errS } from "../styles";

export default function EditRow({ item, onSave, onCancel, isSub, dark }) {
  const [n, setN] = useState(item.name);
  const [p, setP] = useState(String(item.priority));
  const [e, setE] = useState("");
  const save = () => {
    const t = n.trim(), pr = Number(p);
    if (!t) return setE("Name can't be empty.");
    if (!Number.isInteger(pr) || pr < 1 || pr > 10) return setE("Priority must be 1-10.");
    setE(""); onSave({ name: t, priority: pr });
  };
  const sm = isSub ? { fontSize: 13, padding: "7px 10px" } : {};
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6, width: "100%" }}>
      <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
        <input value={n} onChange={(ev) => setN(ev.target.value)} style={{ ...inp(dark), flex: 1, minWidth: 100, ...sm }} placeholder={isSub ? "Sub-item name" : "Item name"} autoFocus />
        <PriSelect value={p} onChange={setP} small={isSub} dark={dark} />
        <button onClick={save} style={btnSv}>Save</button>
        <button onClick={onCancel} style={btnCn(dark)}>Cancel</button>
      </div>
      {e && <p style={errS}>{e}</p>}
    </div>
  );
}
