import React, { useMemo } from 'react';
import * as THREE from 'three';

interface DrainpipeClimbProps {
  /** Base position */
  position: [number, number, number];
  /** Height to reach */
  height: number;
  /** Pipe radius (default 0.06) */
  radius?: number;
  /** Y rotation */
  rotation?: number;
  name?: string;
}

/**
 * Drainpipe / PVC pipe mount on a wall face.
 * Consists of a main vertical pipe + two bracket clamps.
 * Provides an alternate climbing route for sneaky players.
 */
export const DrainpipeClimb: React.FC<DrainpipeClimbProps> = ({
  position,
  height,
  radius = 0.055,
  rotation = 0,
  name = 'drainpipe',
}) => {
  const pipeMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#7d9a6a',
        roughness: 0.6,
        metalness: 0.2,
      }),
    []
  );

  const bracketMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#555',
        roughness: 0.8,
        metalness: 0.5,
      }),
    []
  );

  const bracketPositions = [height * 0.25, height * 0.55, height * 0.82];

  return (
    <group name={name} position={position} rotation={[0, rotation, 0]}>
      {/* Main pipe */}
      <mesh position={[0, height / 2, 0]} castShadow material={pipeMat}>
        <cylinderGeometry args={[radius, radius, height, 10]} />
      </mesh>

      {/* Clamp brackets */}
      {bracketPositions.map((y, i) => (
        <mesh key={i} position={[0, y, -radius * 0.5]} castShadow material={bracketMat}>
          <torusGeometry args={[radius + 0.018, 0.012, 6, 12, Math.PI]} />
        </mesh>
      ))}

      {/* Elbow bend at bottom (pointing away from wall) */}
      <mesh position={[0, 0.15, radius + 0.02]} rotation={[Math.PI / 2, 0, 0]} material={pipeMat}>
        <cylinderGeometry args={[radius * 0.9, radius * 0.9, 0.22, 10]} />
      </mesh>
    </group>
  );
};
