import React, { useMemo } from 'react';
import * as THREE from 'three';

interface LadderProps {
  /** Base (bottom) world position of the ladder */
  position: [number, number, number];
  /** Height in metres */
  height: number;
  /** Y rotation */
  rotation?: number;
  /** Rung count (auto by default) */
  rungCount?: number;
  name?: string;
}

/**
 * Realistic Indian-gully style iron/bamboo ladder.
 * Two side rails + evenly spaced rungs.
 * Leans slightly against the wall (default 8° forward tilt).
 */
export const Ladder: React.FC<LadderProps> = ({
  position,
  height,
  rotation = 0,
  rungCount,
  name = 'ladder',
}) => {
  const RAIL_RADIUS = 0.025;
  const RUNG_RADIUS = 0.018;
  const RAIL_SEPARATION = 0.38;
  const LEAN_ANGLE = 0.14; // radians (≈8°)

  const count = rungCount ?? Math.max(3, Math.floor(height / 0.28));
  const rungSpacing = height / (count + 1);

  const railMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#4a3b28',
        roughness: 0.85,
        metalness: 0.05,
      }),
    []
  );

  const rungMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#5c4a2a',
        roughness: 0.9,
        metalness: 0.0,
      }),
    []
  );

  const rungs = useMemo(() => {
    const arr = [];
    for (let i = 1; i <= count; i++) {
      arr.push(i * rungSpacing);
    }
    return arr;
  }, [count, rungSpacing]);

  return (
    <group
      name={name}
      position={position}
      rotation={[LEAN_ANGLE, rotation, 0]}
    >
      {/* Left rail */}
      <mesh position={[-RAIL_SEPARATION / 2, height / 2, 0]} castShadow material={railMat}>
        <cylinderGeometry args={[RAIL_RADIUS, RAIL_RADIUS, height, 8]} />
      </mesh>

      {/* Right rail */}
      <mesh position={[RAIL_SEPARATION / 2, height / 2, 0]} castShadow material={railMat}>
        <cylinderGeometry args={[RAIL_RADIUS, RAIL_RADIUS, height, 8]} />
      </mesh>

      {/* Rungs */}
      {rungs.map((y, i) => (
        <mesh
          key={i}
          position={[0, y, 0]}
          rotation={[0, 0, Math.PI / 2]}
          castShadow
          material={rungMat}
        >
          <cylinderGeometry args={[RUNG_RADIUS, RUNG_RADIUS, RAIL_SEPARATION + 0.04, 8]} />
        </mesh>
      ))}
    </group>
  );
};
