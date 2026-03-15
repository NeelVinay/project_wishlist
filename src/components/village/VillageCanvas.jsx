import React, { useRef, useEffect, useState, useCallback } from "react";
import { createEngine } from "./engine";
import HouseDetailOverlay from "./HouseDetailOverlay";

export default function VillageCanvas({ items, currency }) {
  const canvasRef = useRef(null);
  const engineRef = useRef(null);
  const [selectedHouse, setSelectedHouse] = useState(null);

  const onHouseClick = useCallback((item) => {
    setSelectedHouse(item);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dpr = window.devicePixelRatio || 1;
    const w = window.innerWidth;
    const h = window.innerHeight;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    canvas.style.width = w + "px";
    canvas.style.height = h + "px";

    const eng = createEngine(canvas, items, currency, onHouseClick);
    engineRef.current = eng;

    const onResize = () => {
      const nw = window.innerWidth;
      const nh = window.innerHeight;
      canvas.width = nw * dpr;
      canvas.height = nh * dpr;
      canvas.style.width = nw + "px";
      canvas.style.height = nh + "px";
      eng.resize(nw, nh);
    };
    window.addEventListener("resize", onResize);

    return () => {
      window.removeEventListener("resize", onResize);
      eng.destroy();
      engineRef.current = null;
    };
  }, [items, currency, onHouseClick]);

  return (
    <>
      <canvas
        ref={canvasRef}
        style={{ display: "block", width: "100vw", height: "100vh", cursor: "default" }}
      />
      {selectedHouse && (
        <HouseDetailOverlay
          item={selectedHouse}
          currency={currency}
          onClose={() => setSelectedHouse(null)}
        />
      )}
    </>
  );
}
