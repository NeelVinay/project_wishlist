import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ACCENT, ACCENT_HOVER } from "../styles";

export default function LandingPage() {
  const navigate = useNavigate();
  const [hoverBtn, setHoverBtn] = useState(false);
  return (
    <div style={{
      minHeight: "100vh", background: "#0a0a0a",
      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
      fontFamily: "'Inter',system-ui,-apple-system,sans-serif",
      position: "relative", overflow: "hidden",
    }}>
      <div style={{ position: "absolute", width: 500, height: 500, borderRadius: "50%", background: "radial-gradient(circle, rgba(192,57,43,0.08) 0%, transparent 70%)", top: "-10%", right: "-5%", pointerEvents: "none" }} />
      <div style={{ position: "absolute", width: 400, height: 400, borderRadius: "50%", background: "radial-gradient(circle, rgba(192,57,43,0.05) 0%, transparent 70%)", bottom: "5%", left: "-5%", pointerEvents: "none" }} />

      <div style={{ textAlign: "center", zIndex: 1, padding: "0 20px" }}>
        <h1 style={{ fontSize: 72, fontWeight: 800, color: "#fff", margin: 0, letterSpacing: "-2px", lineHeight: 1.1 }}>
          Wish<span style={{ color: ACCENT }}>Away</span>
        </h1>

        <p style={{ fontSize: 20, color: "rgba(255,255,255,0.5)", margin: "16px 0 0", fontWeight: 400, letterSpacing: "0.5px" }}>
          Your wishes, organized. Your goals, tracked.
        </p>

        <p style={{ fontSize: 14, color: "rgba(255,255,255,0.3)", margin: "12px auto 48px", maxWidth: 440, lineHeight: 1.6 }}>
          Track what you want, save toward what matters, and watch your wishlist come to life — one item at a time.
        </p>

        <button onClick={() => navigate("/app")}
          onMouseEnter={() => setHoverBtn(true)} onMouseLeave={() => setHoverBtn(false)}
          style={{
            padding: "16px 40px", fontSize: 16, fontWeight: 700,
            color: "#fff", background: hoverBtn ? ACCENT_HOVER : ACCENT,
            border: "none", borderRadius: 12, cursor: "pointer",
            transition: "all 0.3s ease",
            transform: hoverBtn ? "translateY(-2px)" : "translateY(0)",
            boxShadow: hoverBtn ? "0 8px 30px rgba(192,57,43,0.4)" : "0 4px 16px rgba(192,57,43,0.25)",
            letterSpacing: "0.5px",
          }}>
          Start Wishing Now
        </button>

        <div style={{ marginTop: 60, display: "flex", gap: 40, justifyContent: "center", flexWrap: "wrap" }}>
          {[
            { label: "Track", desc: "Prioritize your wishes" },
            { label: "Save", desc: "Monitor your savings" },
            { label: "Achieve", desc: "Complete your goals" },
          ].map((f) => (
            <div key={f.label} style={{ textAlign: "center" }}>
              <div style={{ fontSize: 16, fontWeight: 700, color: "rgba(255,255,255,0.7)" }}>{f.label}</div>
              <div style={{ fontSize: 12, color: "rgba(255,255,255,0.3)", marginTop: 4 }}>{f.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
