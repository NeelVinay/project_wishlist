import React, { useState } from "react";
import { BrowserRouter, Routes, Route, Link, useNavigate, useLocation } from "react-router-dom";
import WishlistApp from "./WishlistApp";

const ACCENT = "#c0392b";
const ACCENT_HOVER = "#a93226";

function NavBar() {
  const location = useLocation();
  const isHome = location.pathname === "/";
  const pages = [
    { path: "/", label: "Home" },
    { path: "/app", label: "WishAway" },
    { path: "/visualize", label: "Data Visualization" },
    { path: "/about", label: "Who We Are" },
  ];
  return (
    <nav style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 500,
      display: "flex", alignItems: "center", justifyContent: "space-between",
      padding: "14px 40px",
      background: isHome ? "transparent" : "rgba(17,17,17,0.95)",
      backdropFilter: isHome ? "none" : "blur(10px)",
      borderBottom: isHome ? "none" : "1px solid #222",
      fontFamily: "'Inter',system-ui,-apple-system,sans-serif",
    }}>
      <Link to="/" style={{ textDecoration: "none" }}>
        <span style={{ fontSize: 20, fontWeight: 800, color: "#fff", letterSpacing: "-0.5px" }}>
          Wish<span style={{ color: ACCENT }}>Away</span>
        </span>
      </Link>
      <div style={{ display: "flex", gap: 24, alignItems: "center" }}>
        {pages.map((item) => (
          <Link key={item.path} to={item.path} style={{
            textDecoration: "none",
            fontSize: 14, fontWeight: 700,
            fontFamily: "'Inter',system-ui,-apple-system,sans-serif",
            color: location.pathname === item.path ? ACCENT : "rgba(255,255,255,0.6)",
            padding: "4px 0",
            borderBottom: location.pathname === item.path ? "2px solid " + ACCENT : "2px solid transparent",
          }}>
            {item.label}
          </Link>
        ))}
      </div>
    </nav>
  );
}

function LandingPage() {
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

function AboutPage() {
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

function DataVizPage() {
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

export default function App() {
  return (
    <BrowserRouter>
      <NavBar />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/app" element={<WishlistApp />} />
        <Route path="/visualize" element={<DataVizPage />} />
        <Route path="/about" element={<AboutPage />} />
      </Routes>
    </BrowserRouter>
  );
}