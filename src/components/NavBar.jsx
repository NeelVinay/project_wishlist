import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { ACCENT } from "../styles";

export default function NavBar() {
  const location = useLocation();
  const [hovering, setHovering] = useState(false);
  const isHome = location.pathname === "/";
  const isActiveViz = location.pathname.startsWith("/visualize/");
  const isVizSection = location.pathname.startsWith("/visualize");
  const pages = [
    { path: "/", label: "Home" },
    { path: "/app", label: "WishAway" },
    { path: "/visualize", label: "Data Visualization" },
    { path: "/about", label: "Who We Are" },
  ];

  const navContent = (
    <>
      <Link to="/" style={{ textDecoration: "none" }}>
        <span style={{ fontSize: 20, fontWeight: 800, color: "#fff", letterSpacing: "-0.5px" }}>
          Wish<span style={{ color: ACCENT }}>Away</span>
        </span>
      </Link>
      <div style={{ display: "flex", gap: 24, alignItems: "center" }}>
        {pages.map((item) => {
          const active = item.path === "/visualize"
            ? isVizSection
            : location.pathname === item.path;
          return (
            <Link key={item.path} to={item.path} style={{
              textDecoration: "none",
              fontSize: 14, fontWeight: 700,
              fontFamily: "'Inter',system-ui,-apple-system,sans-serif",
              color: active ? ACCENT : "rgba(255,255,255,0.6)",
              padding: "4px 0",
              borderBottom: active ? "2px solid " + ACCENT : "2px solid transparent",
            }}>
              {item.label}
            </Link>
          );
        })}
      </div>
    </>
  );

  if (isActiveViz) {
    return (
      <>
        <div
          onMouseEnter={() => setHovering(true)}
          style={{
            position: "fixed", top: 0, left: 0, right: 0, height: 60,
            zIndex: 501, pointerEvents: "auto", background: "transparent",
          }}
        />
        <nav
          onMouseEnter={() => setHovering(true)}
          onMouseLeave={() => setHovering(false)}
          style={{
            position: "fixed", top: 0, left: 0, right: 0, zIndex: 502,
            display: "flex", alignItems: "center", justifyContent: "space-between",
            padding: "14px 40px",
            background: "rgba(17,17,17,0.95)",
            backdropFilter: "blur(10px)",
            borderBottom: "1px solid #222",
            fontFamily: "'Inter',system-ui,-apple-system,sans-serif",
            transform: hovering ? "translateY(0)" : "translateY(-100%)",
            opacity: hovering ? 1 : 0,
            transition: "transform 0.3s ease, opacity 0.3s ease",
            pointerEvents: hovering ? "auto" : "none",
          }}
        >
          {navContent}
        </nav>
      </>
    );
  }

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
      {navContent}
    </nav>
  );
}
