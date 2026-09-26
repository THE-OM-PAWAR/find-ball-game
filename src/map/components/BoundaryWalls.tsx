import React from 'react';
import * as THREE from 'three';
import { MAP_DIMENSIONS } from '../data/mapLayoutData';

export const BoundaryWalls: React.FC = () => {
  const { halfWidth, halfDepth, width, depth } = MAP_DIMENSIONS;
  const wallHeight = 3.2;
  const wallThickness = 0.4;

  return (
    <group name="boundary-walls">
      {/* 1. North Wall (Behind North Row of Houses at Z = -25) */}
      <group position={[0, wallHeight / 2, -halfDepth]}>
        <mesh castShadow receiveShadow>
          <boxGeometry args={[width, wallHeight, wallThickness]} />
          <meshStandardMaterial color="#cbd5e1" roughness={0.9} />
        </mesh>
        <mesh position={[0, wallHeight / 2 + 0.06, 0]} castShadow>
          <boxGeometry args={[width + 0.1, 0.14, wallThickness + 0.12]} />
          <meshStandardMaterial color="#94a3b8" roughness={0.8} />
        </mesh>
      </group>

      {/* 2. South Wall (Behind South Row of Houses at Z = +25) */}
      <group position={[0, wallHeight / 2, halfDepth]}>
        <mesh castShadow receiveShadow>
          <boxGeometry args={[width, wallHeight, wallThickness]} />
          <meshStandardMaterial color="#cbd5e1" roughness={0.9} />
        </mesh>
        <mesh position={[0, wallHeight / 2 + 0.06, 0]} castShadow>
          <boxGeometry args={[width + 0.1, 0.14, wallThickness + 0.12]} />
          <meshStandardMaterial color="#94a3b8" roughness={0.8} />
        </mesh>
      </group>

      {/* 3. East Wall (Behind East Flank of Houses at X = +25) */}
      <group position={[halfWidth, wallHeight / 2, 0]}>
        <mesh castShadow receiveShadow>
          <boxGeometry args={[wallThickness, wallHeight, depth]} />
          <meshStandardMaterial color="#cbd5e1" roughness={0.9} />
        </mesh>
        <mesh position={[0, wallHeight / 2 + 0.06, 0]} castShadow>
          <boxGeometry args={[wallThickness + 0.12, 0.14, depth + 0.1]} />
          <meshStandardMaterial color="#94a3b8" roughness={0.8} />
        </mesh>
      </group>

      {/* 4. West Wall (Behind West Flank of Houses at X = -25) */}
      <group position={[-halfWidth, wallHeight / 2, 0]}>
        <mesh castShadow receiveShadow>
          <boxGeometry args={[wallThickness, wallHeight, depth]} />
          <meshStandardMaterial color="#cbd5e1" roughness={0.9} />
        </mesh>
        <mesh position={[0, wallHeight / 2 + 0.06, 0]} castShadow>
          <boxGeometry args={[wallThickness + 0.12, 0.14, depth + 0.1]} />
          <meshStandardMaterial color="#94a3b8" roughness={0.8} />
        </mesh>
      </group>
    </group>
  );
};
