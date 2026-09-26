import React, { useMemo } from 'react';
import { BackgroundBuilding, type BackgroundBuildingProps } from './BackgroundBuilding';

/**
 * Distant Telecom / Cellular Mobile Tower with Red Obstruction Beacon
 */
const DistantCellTower: React.FC<{ position: [number, number, number] }> = ({ position }) => (
  <group position={position}>
    {/* Steel Lattice Mast */}
    <mesh position={[0, 18, 0]}>
      <cylinderGeometry args={[0.3, 1.2, 36, 4]} />
      <meshStandardMaterial color="#dc2626" wireframe />
    </mesh>
    {/* Top Antenna Mast & Red Beacon */}
    <mesh position={[0, 36.5, 0]}>
      <cylinderGeometry args={[0.08, 0.08, 3, 6]} />
      <meshStandardMaterial color="#ffffff" metalness={0.9} />
    </mesh>
    <mesh position={[0, 38.2, 0]}>
      <sphereGeometry args={[0.4, 8, 8]} />
      <meshBasicMaterial color="#ef4444" />
    </mesh>
  </group>
);

/**
 * Distant Tree Silhouette Canopy
 */
const DistantTreeCluster: React.FC<{ position: [number, number, number]; scale?: number }> = ({
  position,
  scale = 1,
}) => (
  <group position={position} scale={[scale, scale, scale]}>
    {/* Trunk */}
    <mesh position={[0, 3, 0]}>
      <cylinderGeometry args={[0.35, 0.55, 6, 6]} />
      <meshStandardMaterial color="#451a03" roughness={0.9} />
    </mesh>
    {/* Dense Canopy */}
    <mesh position={[0, 7.5, 0]}>
      <sphereGeometry args={[3.8, 8, 7]} />
      <meshStandardMaterial color="#1e3a1e" roughness={0.95} />
    </mesh>
    <mesh position={[1.5, 6.5, 1.2]}>
      <sphereGeometry args={[2.8, 8, 7]} />
      <meshStandardMaterial color="#14532d" roughness={0.95} />
    </mesh>
  </group>
);

/**
 * Master Background City Layer
 * Fills all 360-degree vistas outside the 50m x 50m playable area with dense Indian architecture
 */
export const BackgroundCity: React.FC = () => {
  // Precompute building placement data for static performance (zero garbage collection)
  const buildings = useMemo(() => {
    const list: BackgroundBuildingProps[] = [];

    // Helper to generate deterministic building variants
    let seed = 42;
    const random = () => {
      seed = (seed * 9301 + 49297) % 233280;
      return seed / 233280;
    };

    // ─────────────────────────────────────────────────────────────
    // 1. NORTH VISTA (Z: -32 to -95)
    // ─────────────────────────────────────────────────────────────
    for (let x = -85; x <= 85; x += 9.5) {
      // Near North Row
      list.push({
        position: [x + random() * 2, 0, -32 - random() * 4],
        rotation: [0, 0, 0],
        width: 7.5 + random() * 2.5,
        depth: 6.0 + random() * 2.0,
        height: 6.5 + Math.floor(random() * 4) * 3.0,
        colorIndex: Math.floor(random() * 8),
        hasWaterTank: true,
        hasMumty: true,
        hasDishAntenna: random() > 0.3,
        hasBalcony: random() > 0.4,
      });

      // Mid North Row
      list.push({
        position: [x + random() * 3, 0, -48 - random() * 6],
        rotation: [0, 0, 0],
        width: 8.0 + random() * 3.0,
        depth: 6.5 + random() * 2.0,
        height: 8.0 + Math.floor(random() * 4) * 3.2,
        colorIndex: Math.floor(random() * 8),
        hasWaterTank: true,
        hasMumty: true,
        hasDishAntenna: true,
        hasBalcony: random() > 0.5,
      });

      // Far North Row
      list.push({
        position: [x + random() * 4, 0, -70 - random() * 12],
        rotation: [0, 0, 0],
        width: 9.0 + random() * 4.0,
        depth: 7.5 + random() * 3.0,
        height: 10.0 + Math.floor(random() * 4) * 3.5,
        colorIndex: Math.floor(random() * 8),
        hasWaterTank: true,
        hasMumty: false,
        hasDishAntenna: false,
        hasBalcony: false,
      });
    }

    // ─────────────────────────────────────────────────────────────
    // 2. SOUTH VISTA (Z: +32 to +95)
    // ─────────────────────────────────────────────────────────────
    for (let x = -85; x <= 85; x += 9.5) {
      // Near South Row
      list.push({
        position: [x + random() * 2, 0, 32 + random() * 4],
        rotation: [0, Math.PI, 0],
        width: 7.5 + random() * 2.5,
        depth: 6.0 + random() * 2.0,
        height: 6.0 + Math.floor(random() * 4) * 3.0,
        colorIndex: Math.floor(random() * 8),
        hasWaterTank: true,
        hasMumty: true,
        hasDishAntenna: random() > 0.3,
        hasBalcony: random() > 0.4,
      });

      // Mid South Row
      list.push({
        position: [x + random() * 3, 0, 48 + random() * 6],
        rotation: [0, Math.PI, 0],
        width: 8.0 + random() * 3.0,
        depth: 6.5 + random() * 2.0,
        height: 8.0 + Math.floor(random() * 4) * 3.2,
        colorIndex: Math.floor(random() * 8),
        hasWaterTank: true,
        hasMumty: true,
        hasDishAntenna: true,
        hasBalcony: random() > 0.5,
      });

      // Far South Row
      list.push({
        position: [x + random() * 4, 0, 70 + random() * 12],
        rotation: [0, Math.PI, 0],
        width: 9.0 + random() * 4.0,
        depth: 7.5 + random() * 3.0,
        height: 10.0 + Math.floor(random() * 4) * 3.5,
        colorIndex: Math.floor(random() * 8),
        hasWaterTank: true,
        hasMumty: false,
        hasDishAntenna: false,
        hasBalcony: false,
      });
    }

    // ─────────────────────────────────────────────────────────────
    // 3. WEST VISTA (X: -32 to -95)
    // ─────────────────────────────────────────────────────────────
    for (let z = -85; z <= 85; z += 9.5) {
      // Near West Row
      list.push({
        position: [-32 - random() * 4, 0, z + random() * 2],
        rotation: [0, Math.PI / 2, 0],
        width: 7.5 + random() * 2.5,
        depth: 6.0 + random() * 2.0,
        height: 6.5 + Math.floor(random() * 4) * 3.0,
        colorIndex: Math.floor(random() * 8),
        hasWaterTank: true,
        hasMumty: true,
        hasDishAntenna: random() > 0.3,
        hasBalcony: random() > 0.4,
      });

      // Mid West Row
      list.push({
        position: [-48 - random() * 6, 0, z + random() * 3],
        rotation: [0, Math.PI / 2, 0],
        width: 8.0 + random() * 3.0,
        depth: 6.5 + random() * 2.0,
        height: 8.5 + Math.floor(random() * 4) * 3.2,
        colorIndex: Math.floor(random() * 8),
        hasWaterTank: true,
        hasMumty: true,
        hasDishAntenna: true,
        hasBalcony: random() > 0.5,
      });

      // Far West Row
      list.push({
        position: [-70 - random() * 12, 0, z + random() * 4],
        rotation: [0, Math.PI / 2, 0],
        width: 9.0 + random() * 4.0,
        depth: 7.5 + random() * 3.0,
        height: 11.0 + Math.floor(random() * 4) * 3.5,
        colorIndex: Math.floor(random() * 8),
        hasWaterTank: true,
        hasMumty: false,
        hasDishAntenna: false,
        hasBalcony: false,
      });
    }

    // ─────────────────────────────────────────────────────────────
    // 4. EAST VISTA (X: +32 to +95)
    // ─────────────────────────────────────────────────────────────
    for (let z = -85; z <= 85; z += 9.5) {
      // Near East Row
      list.push({
        position: [32 + random() * 4, 0, z + random() * 2],
        rotation: [0, -Math.PI / 2, 0],
        width: 7.5 + random() * 2.5,
        depth: 6.0 + random() * 2.0,
        height: 6.5 + Math.floor(random() * 4) * 3.0,
        colorIndex: Math.floor(random() * 8),
        hasWaterTank: true,
        hasMumty: true,
        hasDishAntenna: random() > 0.3,
        hasBalcony: random() > 0.4,
      });

      // Mid East Row
      list.push({
        position: [48 + random() * 6, 0, z + random() * 3],
        rotation: [0, -Math.PI / 2, 0],
        width: 8.0 + random() * 3.0,
        depth: 6.5 + random() * 2.0,
        height: 8.5 + Math.floor(random() * 4) * 3.2,
        colorIndex: Math.floor(random() * 8),
        hasWaterTank: true,
        hasMumty: true,
        hasDishAntenna: true,
        hasBalcony: random() > 0.5,
      });

      // Far East Row
      list.push({
        position: [70 + random() * 12, 0, z + random() * 4],
        rotation: [0, -Math.PI / 2, 0],
        width: 9.0 + random() * 4.0,
        depth: 7.5 + random() * 3.0,
        height: 11.0 + Math.floor(random() * 4) * 3.5,
        colorIndex: Math.floor(random() * 8),
        hasWaterTank: true,
        hasMumty: false,
        hasDishAntenna: false,
        hasBalcony: false,
      });
    }

    return list;
  }, []);

  return (
    <group name="background-city">
      {/* 1. Surrounding Low-Poly Residential Buildings */}
      {buildings.map((b, idx) => (
        <BackgroundBuilding key={`bg-bldg-${idx}`} {...b} />
      ))}

      {/* 2. Distant Cellular / Telecom Towers on the Horizon */}
      <DistantCellTower position={[-85, 0, -95]} />
      <DistantCellTower position={[110, 0, -85]} />
      <DistantCellTower position={[-95, 0, 110]} />
      <DistantCellTower position={[95, 0, 120]} />

      {/* 3. Distant Tree Clusters in Horizon Gaps */}
      <DistantTreeCluster position={[-42, 0, -28]} scale={1.2} />
      <DistantTreeCluster position={[42, 0, -28]} scale={1.1} />
      <DistantTreeCluster position={[-40, 0, 28]} scale={1.3} />
      <DistantTreeCluster position={[40, 0, 28]} scale={1.15} />
      <DistantTreeCluster position={[-65, 0, -55]} scale={1.6} />
      <DistantTreeCluster position={[65, 0, -60]} scale={1.7} />
      <DistantTreeCluster position={[-70, 0, 65]} scale={1.5} />
      <DistantTreeCluster position={[75, 0, 70]} scale={1.6} />
    </group>
  );
};
