import React, { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

const STAR_COUNT = 2500;
const FIELD_RADIUS = 80;
const INNER_RADIUS = 15;
const TWINKLE_SPEED = 0.8;

const vertexShader = `
  attribute float size;
  varying float vAlpha;
  void main() {
    vec4 mvPos = modelViewMatrix * vec4(position, 1.0);
    gl_PointSize = size * (200.0 / -mvPos.z);
    gl_Position = projectionMatrix * mvPos;
    // Fade distant stars slightly
    float dist = length(position);
    vAlpha = mix(0.3, 1.0, 1.0 - (dist - ${INNER_RADIUS.toFixed(1)}) / ${(FIELD_RADIUS - INNER_RADIUS).toFixed(1)});
  }
`;

const fragmentShader = `
  varying float vAlpha;
  void main() {
    // Soft circular point
    float d = length(gl_PointCoord - vec2(0.5));
    if (d > 0.5) discard;
    float alpha = vAlpha * smoothstep(0.5, 0.1, d);
    gl_FragColor = vec4(1.0, 1.0, 1.0, alpha);
  }
`;

export default function Starfield() {
  const pointsRef = useRef();

  const { positions, baseSizes, phases } = useMemo(() => {
    const pos = new Float32Array(STAR_COUNT * 3);
    const sz = new Float32Array(STAR_COUNT);
    const ph = new Float32Array(STAR_COUNT);

    for (let i = 0; i < STAR_COUNT; i++) {
      const r = INNER_RADIUS + Math.random() * (FIELD_RADIUS - INNER_RADIUS);
      const theta = Math.acos(2 * Math.random() - 1);
      const phi = Math.random() * Math.PI * 2;

      pos[i * 3] = r * Math.sin(theta) * Math.cos(phi);
      pos[i * 3 + 1] = r * Math.sin(theta) * Math.sin(phi);
      pos[i * 3 + 2] = r * Math.cos(theta);

      // Closer stars are larger
      const distFactor = (r - INNER_RADIUS) / (FIELD_RADIUS - INNER_RADIUS);
      sz[i] = 0.4 + (1 - distFactor) * 1.5 + Math.random() * 0.6;

      ph[i] = Math.random() * Math.PI * 2;
    }

    return { positions: pos, baseSizes: sz, phases: ph };
  }, []);

  const sizeArray = useMemo(() => new Float32Array(baseSizes), [baseSizes]);

  useFrame(({ clock }) => {
    if (!pointsRef.current) return;
    const geo = pointsRef.current.geometry;
    const attr = geo.getAttribute("size");
    if (!attr) return;

    const t = clock.getElapsedTime() * TWINKLE_SPEED;
    const arr = attr.array;

    for (let i = 0; i < STAR_COUNT; i++) {
      const twinkle = 0.4 + 0.6 * (0.5 + 0.5 * Math.sin(t + phases[i]));
      arr[i] = baseSizes[i] * twinkle;
    }
    attr.needsUpdate = true;
  });

  const shaderMat = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader,
        fragmentShader,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      }),
    []
  );

  return (
    <points ref={pointsRef} material={shaderMat} frustumCulled={false}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          array={positions}
          count={STAR_COUNT}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-size"
          array={sizeArray}
          count={STAR_COUNT}
          itemSize={1}
        />
      </bufferGeometry>
    </points>
  );
}
