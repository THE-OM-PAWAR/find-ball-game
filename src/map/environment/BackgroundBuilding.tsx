import React from 'react';
import { BACKGROUND_BUILDING_COLORS, ROOFTOP_COLORS } from './EnvironmentPerformance';

export interface BackgroundBuildingProps {
  position: [number, number, number];
  rotation?: [number, number, number];
  width?: number;
  depth?: number;
  height?: number;
  colorIndex?: number;
  hasWaterTank?: boolean;
  hasMumty?: boolean;
  hasDishAntenna?: boolean;
  hasBalcony?: boolean;
}

/**
 * Low-Poly Background Indian Residential Building Block
 * Lightweight geometry designed for surrounding distant urban vistas
 */
export const BackgroundBuilding: React.FC<BackgroundBuildingProps> = ({
  position,
  rotation = [0, 0, 0],
  width = 6.0,
  depth = 5.5,
  height = 7.0,
  colorIndex = 0,
  hasWaterTank = true,
  hasMumty = true,
  hasDishAntenna = true,
  hasBalcony = false,
}) => {
  const wallColor = BACKGROUND_BUILDING_COLORS[colorIndex % BACKGROUND_BUILDING_COLORS.length];
  const waterTankColor = colorIndex % 2 === 0 ? ROOFTOP_COLORS.waterTankBlack : ROOFTOP_COLORS.waterTankBlue;

  return (
    <group position={position} rotation={rotation}>
      {/* 1. Main Building Body */}
      <mesh position={[0, height / 2, 0]} receiveShadow>
        <boxGeometry args={[width, height, depth]} />
        <meshStandardMaterial color={wallColor} roughness={0.88} />
      </mesh>

      {/* 2. Rooftop Parapet Wall (Continuous perimeter lip) */}
      <group position={[0, height + 0.35, 0]}>
        {/* Front & Back Parapet */}
        <mesh position={[0, 0, depth / 2 - 0.08]}>
          <boxGeometry args={[width, 0.7, 0.16]} />
          <meshStandardMaterial color={wallColor} roughness={0.9} />
        </mesh>
        <mesh position={[0, 0, -depth / 2 + 0.08]}>
          <boxGeometry args={[width, 0.7, 0.16]} />
          <meshStandardMaterial color={wallColor} roughness={0.9} />
        </mesh>
        {/* Left & Right Parapet */}
        <mesh position={[-width / 2 + 0.08, 0, 0]}>
          <boxGeometry args={[0.16, 0.7, depth]} />
          <meshStandardMaterial color={wallColor} roughness={0.9} />
        </mesh>
        <mesh position={[width / 2 - 0.08, 0, 0]}>
          <boxGeometry args={[0.16, 0.7, depth]} />
          <meshStandardMaterial color={wallColor} roughness={0.9} />
        </mesh>
      </group>

      {/* 3. Rooftop Staircase Cabin (Mumty) */}
      {hasMumty && (
        <group position={[width * 0.22, height + 1.1, -depth * 0.2]}>
          <mesh>
            <boxGeometry args={[width * 0.4, 2.2, depth * 0.45]} />
            <meshStandardMaterial color={wallColor} roughness={0.9} />
          </mesh>
          {/* Overhanging Concrete Chhajja/Slab */}
          <mesh position={[0, 1.15, 0]}>
            <boxGeometry args={[width * 0.44, 0.1, depth * 0.48]} />
            <meshStandardMaterial color="#64748b" roughness={0.85} />
          </mesh>
        </group>
      )}

      {/* 4. Overhead Sintex Polymer Water Tank */}
      {hasWaterTank && (
        <group position={[-width * 0.24, height + 0.8, depth * 0.18]}>
          {/* Brick Masonry Plinth */}
          <mesh position={[0, 0.15, 0]}>
            <boxGeometry args={[1.1, 0.3, 1.1]} />
            <meshStandardMaterial color={ROOFTOP_COLORS.brickParapet} roughness={0.92} />
          </mesh>
          {/* Ribbed Water Tank Cylinder */}
          <mesh position={[0, 0.75, 0]}>
            <cylinderGeometry args={[0.48, 0.48, 0.9, 12]} />
            <meshStandardMaterial color={waterTankColor} roughness={0.4} />
          </mesh>
        </group>
      )}

      {/* 5. Tata Sky / DTH Dish Antenna */}
      {hasDishAntenna && (
        <group position={[-width * 0.28, height + 0.5, -depth * 0.25]} rotation={[0.3, 0.6, 0]}>
          <mesh position={[0, 0.25, 0]}>
            <cylinderGeometry args={[0.02, 0.02, 0.5, 6]} />
            <meshStandardMaterial color="#475569" metalness={0.7} />
          </mesh>
          <mesh position={[0, 0.48, 0.06]} rotation={[0.4, 0, 0]}>
            <cylinderGeometry args={[0.26, 0.26, 0.03, 12]} />
            <meshStandardMaterial color={ROOFTOP_COLORS.dishAntenna} roughness={0.5} />
          </mesh>
        </group>
      )}

      {/* 6. Cantilevered Upper-Floor Front Balcony */}
      {hasBalcony && height >= 6 && (
        <group position={[0, height * 0.5, depth / 2 + 0.45]}>
          {/* Concrete Slab Floor */}
          <mesh position={[0, 0, 0]}>
            <boxGeometry args={[width * 0.75, 0.12, 0.9]} />
            <meshStandardMaterial color="#64748b" roughness={0.8} />
          </mesh>
          {/* Balcony Steel Railing / Plaster Wall */}
          <mesh position={[0, 0.45, 0.4]}>
            <boxGeometry args={[width * 0.75, 0.8, 0.06]} />
            <meshStandardMaterial color="#334155" metalness={0.6} roughness={0.4} />
          </mesh>
        </group>
      )}

      {/* 7. Window Shading Bands (Concrete Chhajjas) on Façade */}
      {[height * 0.4, height * 0.75].map((yOffset, wIdx) => (
        <mesh key={wIdx} position={[0, yOffset, depth / 2 + 0.04]}>
          <boxGeometry args={[width * 0.6, 0.08, 0.25]} />
          <meshStandardMaterial color="#475569" roughness={0.7} />
        </mesh>
      ))}
    </group>
  );
};
