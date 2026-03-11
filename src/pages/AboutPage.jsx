import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ACCENT, ACCENT_HOVER } from "../styles";

export default function AboutPage() {
  const navigate = useNavigate();
  const [hoverBtn, setHoverBtn] = useState(false);
  return (
    <div style={{
      minHeight: "100vh", background: "#0a0a0a",
      display: "flex", flexDirection: "column", alignItems: "center",
      fontFamily: "'Inter',system-ui,-apple-system,sans-serif",
      paddingTop: 120, paddingBottom: 80,
    }}>
      <div style={{ maxWidth: 700, padding: "0 24px" }}>
        <h1 style={{ fontSize: 42, fontWeight: 800, color: "#fff", margin: 0, letterSpacing: "-1px" }}>
          Who We <span style={{ color: ACCENT }}>Are</span>
        </h1>

        <p style={{ fontSize: 16, color: "rgba(255,255,255,0.5)", margin: "24px 0 0", lineHeight: 1.8 }}>
          We have all been there - a mental list of things we want, scattered across bookmarks, screenshots, and half-forgotten notes. Wishlists should not be an afterthought. They should be a tool.
        </p>

        <p style={{ fontSize: 16, color: "rgba(255,255,255,0.5)", margin: "20px 0 0", lineHeight: 1.8 }}>
          <strong style={{ color: "rgba(255,255,255,0.8)" }}>WishAway</strong> was built out of a simple frustration: there was no good way to organize what you want, track how close you are to getting it, and actually feel the progress. Most wishlist apps are glorified shopping lists. We wanted something that feels alive - something that grows with you.
        </p>

        <h2 style={{ fontSize: 24, fontWeight: 700, color: "#fff", margin: "48px 0 16px", letterSpacing: "-0.5px" }}>
          Why <span style={{ color: ACCENT }}>WishAway</span>?
        </h2>

        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          {[
            { title: "Organize with purpose", desc: "Group your wishes into categories with sub-items, priorities, and budgets. Know exactly what matters most." },
            { title: "Track your savings", desc: "See how close you are to affording each item. The savings tracker turns abstract goals into concrete progress." },
            { title: "Visualize your progress", desc: "Interactive charts, weighted progress bars, and budget breakdowns give you a birds-eye view of your entire wishlist." },
            { title: "Stay motivated", desc: "Watching a progress bar fill up and items turn green when they are purchasable is surprisingly satisfying. That is by design." },
          ].map((item) => (
            <div key={item.title} style={{ padding: "20px 24px", borderRadius: 10, background: "#1a1a1a", border: "1px solid #222" }}>
              <div style={{ fontSize: 15, fontWeight: 700, color: "rgba(255,255,255,0.85)", marginBottom: 6 }}>{item.title}</div>
              <div style={{ fontSize: 14, color: "rgba(255,255,255,0.4)", lineHeight: 1.6 }}>{item.desc}</div>
            </div>
          ))}
        </div>

        <p style={{ fontSize: 16, color: "rgba(255,255,255,0.5)", margin: "40px 0 0", lineHeight: 1.8 }}>
          This project started as a simple idea and has grown into something we are genuinely proud of. And we are just getting started - with plans for data visualizations, gamification, multi-currency support, and more, WishAway is evolving into much more than a wishlist.
        </p>

        <div style={{ marginTop: 48, textAlign: "center" }}>
          <button onClick={() => navigate("/app")}
            onMouseEnter={() => setHoverBtn(true)} onMouseLeave={() => setHoverBtn(false)}
            style={{
              padding: "14px 36px", fontSize: 15, fontWeight: 700,
              color: "#fff", background: hoverBtn ? ACCENT_HOVER : ACCENT,
              border: "none", borderRadius: 10, cursor: "pointer",
              transition: "all 0.3s ease",
              transform: hoverBtn ? "translateY(-2px)" : "translateY(0)",
              boxShadow: hoverBtn ? "0 8px 24px rgba(192,57,43,0.35)" : "0 4px 12px rgba(192,57,43,0.2)",
            }}>
            Try WishAway
          </button>
        </div>
      </div>
    </div>
  );
}
