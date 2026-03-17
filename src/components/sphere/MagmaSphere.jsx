import React, { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

const vertexShader = `
  varying vec3 vPosition;
  varying vec3 vNormal;
  void main() {
    vPosition = position;
    vNormal = normalize(normalMatrix * normal);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const fragmentShader = `
  uniform float uTime;
  varying vec3 vPosition;
  varying vec3 vNormal;

  // 3D simplex-style noise via hash
  float hash(vec3 p) {
    p = fract(p * vec3(443.897, 441.423, 437.195));
    p += dot(p, p.yzx + 19.19);
    return fract((p.x + p.y) * p.z);
  }

  float noise(vec3 p) {
    vec3 i = floor(p);
    vec3 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);

    return mix(
      mix(mix(hash(i), hash(i + vec3(1,0,0)), f.x),
          mix(hash(i + vec3(0,1,0)), hash(i + vec3(1,1,0)), f.x), f.y),
      mix(mix(hash(i + vec3(0,0,1)), hash(i + vec3(1,0,1)), f.x),
          mix(hash(i + vec3(0,1,1)), hash(i + vec3(1,1,1)), f.x), f.y),
      f.z
    );
  }

  float fbm(vec3 p) {
    float v = 0.0;
    float a = 0.5;
    for (int i = 0; i < 4; i++) {
      v += a * noise(p);
      p *= 2.1;
      a *= 0.5;
    }
    return v;
  }

  void main() {
    vec3 p = vPosition * 2.5 + vec3(uTime * 0.08, uTime * 0.05, uTime * 0.03);
    float n = fbm(p);

    // Color palette: dark red -> orange -> bright yellow-orange
    vec3 darkRed = vec3(0.6, 0.08, 0.0);
    vec3 orange = vec3(1.0, 0.35, 0.0);
    vec3 brightOrange = vec3(1.0, 0.6, 0.05);
    vec3 yellow = vec3(1.0, 0.85, 0.2);

    vec3 col;
    if (n < 0.35) {
      col = mix(darkRed, orange, n / 0.35);
    } else if (n < 0.6) {
      col = mix(orange, brightOrange, (n - 0.35) / 0.25);
    } else {
      col = mix(brightOrange, yellow, (n - 0.6) / 0.4);
    }

    // Add view-dependent glow
    float fresnel = 1.0 - max(dot(vNormal, vec3(0.0, 0.0, 1.0)), 0.0);
    col += vec3(0.3, 0.1, 0.0) * fresnel * 0.5;

    gl_FragColor = vec4(col, 1.0);
  }
`;

export default function MagmaSphere({ radius }) {
  const matRef = useRef();

  const shaderMat = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader,
        fragmentShader,
        uniforms: { uTime: { value: 0 } },
      }),
    []
  );

  useFrame(({ clock }) => {
    shaderMat.uniforms.uTime.value = clock.getElapsedTime();
  });

  return (
    <mesh material={shaderMat}>
      <sphereGeometry args={[radius * 0.97, 64, 64]} />
    </mesh>
  );
}
