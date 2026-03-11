import React from "react";
import { ACCENT } from "../styles";

export default function DataVizPage() {
  return (
    <div style={{
      minHeight: "100vh", background: "#0a0a0a",
      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
      fontFamily: "'Inter',system-ui,-apple-system,sans-serif",
    }}>
      <div style={{ textAlign: "center", padding: "0 24px" }}>
        <h1 style={{ fontSize: 48, fontWeight: 800, color: "#fff", margin: 0, letterSpacing: "-1.5px", lineHeight: 1.2 }}>
          Data Visualization
        </h1>

        <p style={{ fontSize: 22, color: ACCENT, margin: "16px 0 0", fontWeight: 600 }}>
          Like you have never seen before.
        </p>

        <p style={{ fontSize: 15, color: "rgba(255,255,255,0.35)", margin: "20px auto 0", maxWidth: 460, lineHeight: 1.7 }}>
          Interactive charts, 3D visualizations, budget breakdowns, and progress tracking - all in one place. See your wishlist from every angle.
        </p>

        <div style={{ marginTop: 48, display: "flex", gap: 24, justifyContent: "center", flexWrap: "wrap" }}>
          {[
            { label: "Donut Charts" },
            { label: "Treemaps" },
            { label: "3D Sphere" },
            { label: "Bar Charts" },
          ].map((v) => (
            <div key={v.label} style={{
              padding: "20px 24px", borderRadius: 10, background: "#1a1a1a", border: "1px solid #222",
              textAlign: "center", minWidth: 100,
            }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: "rgba(255,255,255,0.5)" }}>{v.label}</div>
            </div>
          ))}
        </div>

        <p style={{ fontSize: 18, color: "rgba(255,255,255,0.2)", margin: "60px 0 0", fontStyle: "italic" }}>
          Coming soon.
        </p>
      </div>
    </div>
  );
}
