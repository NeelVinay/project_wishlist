import React, { useState, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import BudgetSphere from "../components/sphere/BudgetSphere";
import SphereControls from "../components/sphere/SphereControls";
import { loadItems, loadCurrencyCode } from "../utils/storage";
import { CURRENCIES } from "../constants/currencies";
import { getItemBudget } from "../utils/calculations";

export default function DataVizPage() {
  const [items, setItems] = useState([]);
  const [currency, setCurrency] = useState(CURRENCIES[0]);
  const [exploded, setExploded] = useState(false);

  useEffect(() => {
    const loaded = loadItems().filter((i) => !i.completed);
    setItems(loaded);
    const code = loadCurrencyCode();
    if (code) {
      const found = CURRENCIES.find((c) => c.code === code);
      if (found) setCurrency(found);
    }
  }, []);

  const total = items.reduce((s, i) => s + getItemBudget(i), 0);

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
        <OrbitControls
          makeDefault
          enableDamping
          dampingFactor={0.08}
          minDistance={3}
          maxDistance={20}
        />
      </Canvas>
      <SphereControls exploded={exploded} onToggleExplode={() => setExploded((e) => !e)} />
    </div>
  );
}
