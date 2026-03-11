import React, { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import * as THREE from "three";
import { createCellGeometry } from "./VoronoiGeometry";

const HOVER_OFFSET = 0.4;
const EXPLODE_OFFSET = 0.8;
const LERP_SPEED = 0.1;
const BASE_OPACITY = 0.82;

export default React.memo(function SphereCell({
  icoGeo, cellData, radius, color, name,
  isHovered, isSelected, hasSelection, singleItem, exploded,
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
    () => createCellGeometry(icoGeo, cellData.faceIndices, cellData.centroid, cellData.boundaryEdges),
    [icoGeo, cellData]
  );

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
      const targetOpacity = hasSelection && !isSelected ? 0.08 : BASE_OPACITY;
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
        <meshStandardMaterial ref={matRef} color={color} side={THREE.DoubleSide} transparent opacity={BASE_OPACITY} />
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
