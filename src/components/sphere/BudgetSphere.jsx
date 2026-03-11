import React, { useMemo, useState, useCallback } from "react";
import SphereCell from "./SphereCell";
import WedgeDetail from "./WedgeDetail";
import { computeVoronoiCells } from "./VoronoiGeometry";

const RADIUS = 2;

export default function BudgetSphere({ items, total, currency }) {
  const [hoveredId, setHoveredId] = useState(null);
  const [selectedId, setSelectedId] = useState(null);

  const { cells, icoGeo } = useMemo(
    () => computeVoronoiCells(items, total, RADIUS),
    [items, total]
  );

  const handleDeselect = useCallback(() => setSelectedId(null), []);
  const selectedCell = selectedId ? cells.find((c) => c.id === selectedId) : null;
  const singleItem = cells.length <= 1;

  return (
    <group onPointerMissed={handleDeselect}>
      <ambientLight intensity={0.4} />
      <directionalLight position={[5, 5, 5]} intensity={0.8} />
      <directionalLight position={[-3, -2, -4]} intensity={0.3} />
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
