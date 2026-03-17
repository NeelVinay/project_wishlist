import React, { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import * as THREE from "three";
import { createCellGeometry } from "./VoronoiGeometry";

const HOVER_OFFSET = 0.4;
const EXPLODE_OFFSET = 0.8;
const LERP_SPEED = 0.1;
const BASE_OPACITY = 0.82;

// Deterministic dark charcoal color per cell for scorched theme
// Visible against black background even in exploded/hover view
function scorchedColor(id) {
  let h = 0;
  const s = String(id);
  for (let i = 0; i < s.length; i++) h = ((h << 5) - h + s.charCodeAt(i)) | 0;
  const base = 45 + Math.abs(h % 20); // 45-65 range: dark charcoal, clearly distinct from black
  // Slight cool tint to avoid brown
  return `rgb(${base},${base + Math.abs((h >> 8) % 4)},${base + Math.abs((h >> 16) % 6)})`;
}

export default React.memo(function SphereCell({
  icoGeo, cellData, radius, color, name,
  isHovered, isSelected, hasSelection, singleItem, exploded,
  scorched,
  onHover, onSelect,
}) {
  const groupRef = useRef();
  const matRef = useRef();

  // Radial direction: outward from sphere center through cell centroid
  const radialDir = useMemo(
    () => cellData.centroid.clone().normalize(),
    [cellData.centroid]
  );

  const labelPos = useMemo(
    () => radialDir.clone().multiplyScalar(radius + 0.4),
    [radialDir, radius]
  );

  const geometry = useMemo(
    () => createCellGeometry(icoGeo, cellData.faceIndices, cellData.centroid, cellData.boundaryEdges, scorched),
    [icoGeo, cellData, scorched]
  );

  const cellColor = scorched ? scorchedColor(cellData.id) : color;

  useFrame(() => {
    if (!groupRef.current) return;

    // Compound offset: explode + hover, both along radial direction
    let targetDist = 0;
    if (exploded) targetDist += EXPLODE_OFFSET;
    if (isHovered && !singleItem) targetDist += HOVER_OFFSET;

    const pos = groupRef.current.position;
    pos.x = THREE.MathUtils.lerp(pos.x, radialDir.x * targetDist, LERP_SPEED);
    pos.y = THREE.MathUtils.lerp(pos.y, radialDir.y * targetDist, LERP_SPEED);
    pos.z = THREE.MathUtils.lerp(pos.z, radialDir.z * targetDist, LERP_SPEED);

    // Opacity
    if (matRef.current) {
      const base = scorched ? 0.95 : BASE_OPACITY;
      const targetOpacity = hasSelection && !isSelected ? 0.08 : base;
      matRef.current.opacity = THREE.MathUtils.lerp(matRef.current.opacity, targetOpacity, LERP_SPEED);
    }
  });

  return (
    <group
      ref={groupRef}
      onPointerEnter={(e) => { e.stopPropagation(); onHover(true); }}
      onPointerLeave={() => onHover(false)}
      onClick={(e) => { e.stopPropagation(); onSelect(); }}
    >
      <mesh geometry={geometry}>
        <meshStandardMaterial
          ref={matRef}
          color={cellColor}
          side={THREE.DoubleSide}
          transparent
          opacity={BASE_OPACITY}
          roughness={scorched ? 0.95 : 0.5}
          metalness={scorched ? 0.1 : 0.0}
        />
      </mesh>
      {isHovered && !isSelected && !singleItem && (
        <Html position={labelPos} center style={{ pointerEvents: "none" }}>
          <div style={{
            padding: "4px 10px", borderRadius: 6,
            background: "rgba(20,20,20,0.85)", border: "1px solid #444",
            fontSize: 13, fontWeight: 600, color: "#e0e0e0", whiteSpace: "nowrap",
            fontFamily: "'Inter',system-ui,-apple-system,sans-serif",
          }}>
            {name}
          </div>
        </Html>
      )}
    </group>
  );
});
