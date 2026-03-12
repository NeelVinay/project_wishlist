import React from "react";

const A = "#c0392b";
const D = "rgba(255,255,255,0.15)";
const S = { width: 100, height: 100, viewBox: "0 0 100 100" };

export function SpherePreview() {
  return (
    <svg {...S}>
      <circle cx="50" cy="50" r="36" fill="none" stroke={D} strokeWidth="1.5" />
      <circle cx="50" cy="50" r="36" fill="none" stroke={A} strokeWidth="1" opacity="0.4" />
      <path d="M30 28 Q50 20 70 30" stroke={D} fill="none" strokeWidth="1" />
      <path d="M22 50 Q50 42 78 50" stroke={D} fill="none" strokeWidth="1" />
      <path d="M28 70 Q50 62 72 72" stroke={D} fill="none" strokeWidth="1" />
      <path d="M40 16 Q42 50 38 84" stroke={D} fill="none" strokeWidth="1" />
      <path d="M60 18 Q58 50 62 82" stroke={D} fill="none" strokeWidth="1" />
      <circle cx="50" cy="50" r="4" fill={A} opacity="0.6" />
      <circle cx="35" cy="35" r="2" fill={A} opacity="0.4" />
      <circle cx="65" cy="40" r="2" fill={A} opacity="0.4" />
      <circle cx="45" cy="68" r="2" fill={A} opacity="0.4" />
    </svg>
  );
}

const PREVIEW_MAP = {
  sphere: SpherePreview,
};

export default PREVIEW_MAP;
