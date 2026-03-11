import React from "react";

export default function PriBadge({ value, small }) {
  const c = Math.max(1, Math.min(10, value)), h = ((10 - c) / 9) * 200;
  return <span style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: small ? 26 : 32, height: small ? 26 : 32, borderRadius: 8, backgroundColor: "hsl(" + h + ",60%,92%)", color: "hsl(" + h + ",55%,35%)", fontWeight: 700, fontSize: small ? 12 : 14, flexShrink: 0 }}>{value}</span>;
}
