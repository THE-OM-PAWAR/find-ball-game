import React, { useMemo } from 'react';
import * as THREE from 'three';

interface JumpPlatformProps {
  /** World centre position */
  position: [number, number, number];
  /** Horizontal dimensions [width, depth] */
  size?: [number, number];
  /** Visual type — affects colour and edge trim */
  type?: 'roof_edge' | 'ac_unit' | 'water_tank' | 'parapet';
  /** Show danger stripe edge markings */
  showEdgeStripes?: boolean;
  name?: string;
}

/**
 * A raised platform / jump pad marker used to visualise
 * climbable surfaces, momentum jump points, and landing zones.
 * In gameplay this marks where the player can jump across gaps.
 */
export const JumpPlatform: React.FC<JumpPlatformProps> = ({
  position,
  size = [1.2, 1.2],
  type = 'roof_edge',
  showEdgeStripes = true,
  name = 'jump-platform',
}) => {
  const colors: Record<string, { base: string; edge: string; emissive: string }> = {
    roof_edge:   { base: '#334155', edge: '#f59e0b', emissive: '#c07800' },
    ac_unit:     { base: '#94a3b8', edge: '#60a5fa', emissive: '#2563eb' },
    water_tank:  { base: '#475569', edge: '#22d3ee', emissive: '#0891b2' },
    parapet:     { base: '#6b7280', edge: '#a3e635', emissive: '#65a30d' },
  };

  const { base, edge, emissive } = colors[type] ?? colors.roof_edge;

  const baseMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: base,
        roughness: 0.8,
        metalness: 0.1,
      }),
    [base]
  );

  const edgeMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: edge,
        emissive,
        emissiveIntensity: 0.55,
        roughness: 0.5,
        metalness: 0.2,
      }),
    [edge, emissive]
  );

  const [w, d] = size;

  return (
    <group name={name} position={position}>
      {/* Main platform surface */}
      <mesh receiveShadow material={baseMat}>
        <boxGeometry args={[w, 0.08, d]} />
      </mesh>

      {showEdgeStripes && (
        <>
          {/* Front edge stripe */}
          <mesh position={[0, 0.05, d / 2]} material={edgeMat}>
            <boxGeometry args={[w, 0.04, 0.07]} />
          </mesh>
          {/* Back edge stripe */}
          <mesh position={[0, 0.05, -d / 2]} material={edgeMat}>
            <boxGeometry args={[w, 0.04, 0.07]} />
          </mesh>
          {/* Left edge stripe */}
          <mesh position={[-w / 2, 0.05, 0]} material={edgeMat}>
            <boxGeometry args={[0.07, 0.04, d]} />
          </mesh>
          {/* Right edge stripe */}
          <mesh position={[w / 2, 0.05, 0]} material={edgeMat}>
            <boxGeometry args={[0.07, 0.04, d]} />
          </mesh>

          {/* Subtle point glow */}
          <pointLight
            color={edge}
            intensity={1.2}
            distance={3.5}
            position={[0, 0.3, 0]}
          />
        </>
      )}
    </group>
  );
};
