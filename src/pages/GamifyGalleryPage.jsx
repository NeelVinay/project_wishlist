import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { loadItems } from "../utils/storage";
import { getItemBudget } from "../utils/calculations";
import { GAMIFY_OPTIONS } from "../constants/gamifyOptions";
import GamifyCard from "../components/gamify/GamifyCard";
import { ACCENT } from "../styles";

export default function GamifyGalleryPage() {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    loadItems().then((loaded) => {
      setItems(loaded.filter((i) => !i.completed));
      setLoaded(true);
    });
  }, []);

  const total = items.reduce((s, i) => s + getItemBudget(i), 0);
  const empty = loaded && total === 0;

  const handleClick = (viz) => {
    if (viz.comingSoon) return;
    navigate(`/gamify/${viz.id}`);
  };

  return (
    <div style={{
      minHeight: "100vh", background: "#0a0a0a",
      fontFamily: "'Inter',system-ui,-apple-system,sans-serif",
      position: "relative", overflow: "hidden",
    }}>
      <div style={{ position: "absolute", width: 500, height: 500, borderRadius: "50%", background: "radial-gradient(circle, rgba(192,57,43,0.06) 0%, transparent 70%)", top: "-8%", right: "-5%", pointerEvents: "none" }} />
      <div style={{ position: "absolute", width: 400, height: 400, borderRadius: "50%", background: "radial-gradient(circle, rgba(192,57,43,0.04) 0%, transparent 70%)", bottom: "5%", left: "-5%", pointerEvents: "none" }} />

      <div style={{
        position: "relative", zIndex: 1, maxWidth: 1100, margin: "0 auto",
        padding: "100px 40px 60px",
        display: "flex", flexDirection: "column", alignItems: "center",
      }}>
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <h1 style={{
            fontSize: 42, fontWeight: 800, color: "#fff", margin: 0,
            letterSpacing: "-1.5px", lineHeight: 1.1,
          }}>
            <span style={{ color: ACCENT }}>Gamify</span>
          </h1>
          <p style={{
            fontSize: 15, color: "rgba(255,255,255,0.4)", margin: "14px 0 0",
            fontWeight: 400, letterSpacing: "0.3px",
          }}>
            Experience your wishlist through interactive game worlds
          </p>
        </div>

        {empty ? (
          <div style={{ textAlign: "center", padding: "60px 0" }}>
            <p style={{ fontSize: 18, color: "rgba(255,255,255,0.4)" }}>
              No wishlist items with budgets to gamify.
            </p>
            <p style={{ fontSize: 14, color: "rgba(255,255,255,0.2)", marginTop: 8 }}>
              Add items in the wishlist app first.
            </p>
          </div>
        ) : (
          <div style={{ display: "flex", gap: 24, justifyContent: "center" }}>
            {GAMIFY_OPTIONS.map((viz) => (
              <GamifyCard key={viz.id} viz={viz} onClick={() => handleClick(viz)} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
