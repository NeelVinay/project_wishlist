import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import BudgetSphere from "../components/sphere/BudgetSphere";
import SphereControls from "../components/sphere/SphereControls";
import { loadItems, loadCurrencyCode } from "../utils/storage";
import { CURRENCIES } from "../constants/currencies";
import { getItemBudget } from "../utils/calculations";
import { VIZ_OPTIONS } from "../constants/visualizations";

export default function VizViewerPage() {
  const { vizId } = useParams();
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [currency, setCurrency] = useState(CURRENCIES[0]);
  const [exploded, setExploded] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    Promise.all([loadItems(), loadCurrencyCode()]).then(([ld, code]) => {
      setItems(ld.filter((i) => !i.completed));
      if (code) {
        const found = CURRENCIES.find((c) => c.code === code);
        if (found) setCurrency(found);
      }
      setLoaded(true);
    });
  }, []);

  const valid = VIZ_OPTIONS.some((v) => v.id === vizId);
  useEffect(() => {
    if (loaded && !valid) navigate("/visualize", { replace: true });
  }, [loaded, valid, navigate]);

  const total = items.reduce((s, i) => s + getItemBudget(i), 0);

  if (!loaded) return <div style={{ minHeight: "100vh", background: "#000" }} />;

  if (total === 0) {
    return (
      <div style={{
        minHeight: "100vh", background: "#000",
        display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
        fontFamily: "'Inter',system-ui,-apple-system,sans-serif",
      }}>
        <p style={{ fontSize: 18, color: "rgba(255,255,255,0.4)" }}>
          No wishlist items with budgets to visualize.
        </p>
        <p style={{ fontSize: 14, color: "rgba(255,255,255,0.2)", marginTop: 8 }}>
          Add items in the wishlist app first.
        </p>
      </div>
    );
  }

  return (
    <div style={{ width: "100vw", height: "100vh", background: "#000", position: "relative" }}>
      <Canvas
        camera={{ position: [0, 0, 6], fov: 50 }}
        scene={{ background: new THREE.Color(0x000000) }}
        onPointerMissed={() => {}}
      >
        <BudgetSphere items={items} total={total} currency={currency} exploded={exploded} />
        <OrbitControls makeDefault enableDamping dampingFactor={0.08} minDistance={3} maxDistance={20} />
      </Canvas>
      <SphereControls exploded={exploded} onToggleExplode={() => setExploded((e) => !e)} />
      <button
        onClick={() => navigate("/visualize")}
        style={{
          position: "absolute", bottom: 28, left: 28, zIndex: 10,
          padding: "8px 18px", borderRadius: 8,
          background: "rgba(26,26,46,0.85)",
          border: "1px solid #333",
          color: "#e0e0e0", fontSize: 13, fontWeight: 600,
          cursor: "pointer", backdropFilter: "blur(8px)",
          transition: "background 0.3s ease",
          fontFamily: "'Inter',system-ui,-apple-system,sans-serif",
        }}
      >
        Back to Gallery
      </button>
    </div>
  );
}
