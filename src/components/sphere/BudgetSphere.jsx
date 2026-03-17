import React, { useMemo, useState, useCallback, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import SphereCell from "./SphereCell";
import WedgeDetail from "./WedgeDetail";
import Starfield from "./Starfield";
import MagmaSphere from "./MagmaSphere";
import { computeVoronoiCells } from "./VoronoiGeometry";

const RADIUS = 2;
const AUTO_ROTATE_SPEED = 0.15; // radians per second

export default function BudgetSphere({ items, total, currency, exploded, scorched }) {
  const [hoveredId, setHoveredId] = useState(null);
  const [selectedId, setSelectedId] = useState(null);
  const groupRef = useRef();

  const { cells, icoGeo } = useMemo(
    () => computeVoronoiCells(items, total, RADIUS),
    [items, total]
  );

  const handleDeselect = useCallback(() => setSelectedId(null), []);
  const selectedCell = selectedId ? cells.find((c) => c.id === selectedId) : null;
  const singleItem = cells.length <= 1;

  // Auto-rotate the group when in exploded view
  useFrame((_, delta) => {
    if (!groupRef.current) return;
    if (exploded) {
      groupRef.current.rotation.y += delta * AUTO_ROTATE_SPEED;
    }
  });

  return (
    <group ref={groupRef} onPointerMissed={handleDeselect}>
      <Starfield />
      <ambientLight intensity={scorched ? 0.25 : 0.4} />
      <directionalLight position={[5, 5, 5]} intensity={scorched ? 0.5 : 0.8} />
      <directionalLight position={[-3, -2, -4]} intensity={scorched ? 0.2 : 0.3} />
      {scorched && <MagmaSphere radius={RADIUS} />}
      {scorched && (
        <pointLight position={[0, 0, 0]} color="#ff5500" intensity={3} distance={8} />
      )}
      {cells.map((c) => (
        <SphereCell
          key={c.id}
          icoGeo={icoGeo}
          cellData={c}
          radius={RADIUS}
          color={c.color}
          name={c.item.name}
          isHovered={hoveredId === c.id}
          isSelected={selectedId === c.id}
          hasSelection={selectedId !== null}
          singleItem={singleItem}
          exploded={exploded}
          scorched={scorched}
          onHover={(enter) => setHoveredId(enter ? c.id : null)}
          onSelect={() => setSelectedId(selectedId === c.id ? null : c.id)}
        />
      ))}
      {selectedCell && (
        <WedgeDetail
          item={selectedCell.item}
          total={total}
          currency={currency}
          position={selectedCell.detailPos}
        />
      )}
    </group>
  );
}
