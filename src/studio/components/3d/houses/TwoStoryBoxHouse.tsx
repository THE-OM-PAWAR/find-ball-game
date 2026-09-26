import React, { useMemo } from 'react';
import * as THREE from 'three';
import { WaterTank, DishAntenna, ACUnit, Clothesline } from '../HouseProps';

export interface BoxHouseConfig {
  wallColor: string;
  accentColor: string;
  trimColor: string;
  hasWaterTank: boolean;
  hasDishAntenna: boolean;
  hasACUnit: boolean;
  hasClothesline: boolean;
  hasRebars: boolean;
  hasMumtyCabin: boolean;
}

/**
 * Two-Storey Indian Box House with Rooftop Terrace
 * Authentic, clean geometric residential house popular in Indian neighborhoods:
 * - 2 full habitable storeys (Ground + First Floor)
 * - Walkable flat rooftop terrace at Y = 6.48m
 * - Staircase Mumty (rooftop cabin with exit door)
 * - Concrete cantilevered sunshades (Chhajjas) over windows
 * - Iron rebars on roof corners (classic Indian construction detail)
 * - Rooftop Sintex water tank, dish antenna, and AC outdoor compressor
 */
export const TwoStoryBoxHouse: React.FC<{
  config?: Partial<BoxHouseConfig>;
  position?: [number, number, number];
  rotation?: [number, number, number];
}> = ({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  config = {},
}) => {
  const {
    wallColor = '#e2d9cc', // Clean warm off-white / light sandstone plaster
    accentColor = '#3b5266', // Modern petrol slate blue accent
    trimColor = '#f8fafc', // Crisp white concrete trims & chhajjas
    hasWaterTank = true,
    hasDishAntenna = true,
    hasACUnit = true,
    hasClothesline = true,
    hasRebars = true,
    hasMumtyCabin = true,
  } = config;

  // Architectural PBR Materials
  const wallMat = useMemo(
    () => new THREE.MeshStandardMaterial({ color: wallColor, roughness: 0.85, metalness: 0.05 }),
    [wallColor]
  );
  const accentMat = useMemo(
    () => new THREE.MeshStandardMaterial({ color: accentColor, roughness: 0.75, metalness: 0.08 }),
    [accentColor]
  );
  const trimMat = useMemo(
    () => new THREE.MeshStandardMaterial({ color: trimColor, roughness: 0.6, metalness: 0.05 }),
    [trimColor]
  );
  const darkFrameMat = useMemo(
    () => new THREE.MeshStandardMaterial({ color: '#1e293b', roughness: 0.35, metalness: 0.7 }),
    []
  );
  const glassMat = useMemo(
    () => new THREE.MeshStandardMaterial({ color: '#090d16', roughness: 0.1, metalness: 0.95 }),
    []
  );
  const woodDoorMat = useMemo(
    () => new THREE.MeshStandardMaterial({ color: '#3e2723', roughness: 0.6, metalness: 0.15 }),
    []
  );
  const metalDoorMat = useMemo(
    () => new THREE.MeshStandardMaterial({ color: '#334155', roughness: 0.5, metalness: 0.8 }),
    []
  );
  const rebarMat = useMemo(
    () => new THREE.MeshStandardMaterial({ color: '#78350f', roughness: 0.9, metalness: 0.6 }),
    []
  );
  const floorPlinthMat = useMemo(
    () => new THREE.MeshStandardMaterial({ color: '#cbd5e1', roughness: 0.8 }),
    []
  );

  // House Dimensions: Width = 5.6m, Depth = 5.0m, Floor Height = 3.0m each
  return (
    <group position={position} rotation={rotation}>
      {/* 1. GROUND PLINTH PLATFORM */}
      <mesh position={[0, 0.12, 0]} receiveShadow castShadow material={floorPlinthMat}>
        <boxGeometry args={[8.4, 0.24, 7.8]} />
      </mesh>

      {/* Front Entrance 2-Step Stairs */}
      <group position={[-1.2, 0.24, 2.7]}>
        {[
          { y: 0.06, z: 0.25, h: 0.12, d: 0.3 },
          { y: 0.18, z: 0.0, h: 0.12, d: 0.3 },
        ].map((step, i) => (
          <mesh key={i} position={[0, step.y, step.z]} receiveShadow castShadow>
            <boxGeometry args={[1.6, step.h, step.d]} />
            <meshStandardMaterial color="#334155" roughness={0.7} />
          </mesh>
        ))}
      </group>

      {/* 2. GROUND FLOOR (Y = 0.24 to 3.24) */}
      <group position={[0, 0.24, 0]}>
        {/* Main Ground Floor Box */}
        <mesh position={[0, 1.5, 0]} castShadow receiveShadow material={wallMat}>
          <boxGeometry args={[5.6, 3.0, 5.0]} />
        </mesh>

        {/* Vertical Accent Color Block on Right Side */}
        <mesh position={[1.8, 1.5, 2.51]} castShadow receiveShadow material={accentMat}>
          <boxGeometry args={[1.6, 3.0, 0.04]} />
        </mesh>

        {/* Ground Floor Main Entrance Door */}
        <group position={[-1.2, 1.25, 2.52]}>
          {/* Wooden Door Panel */}
          <mesh castShadow material={woodDoorMat}>
            <boxGeometry args={[1.1, 2.2, 0.06]} />
          </mesh>
          {/* Vertical Stainless Steel Door Handle */}
          <mesh position={[0.4, 0, 0.04]} castShadow material={trimMat}>
            <cylinderGeometry args={[0.012, 0.012, 0.7, 8]} />
          </mesh>
        </group>

        {/* Concrete Sunshade Canopy over Main Door */}
        <mesh position={[-1.2, 2.45, 2.75]} castShadow receiveShadow material={trimMat}>
          <boxGeometry args={[1.5, 0.08, 0.5]} />
        </mesh>

        {/* Ground Floor Large Window */}
        <group position={[1.8, 1.5, 2.53]}>
          <mesh castShadow material={darkFrameMat}>
            <boxGeometry args={[1.2, 1.4, 0.06]} />
          </mesh>
          <mesh position={[0, 0, 0.01]}>
            <planeGeometry args={[1.1, 1.28]} />
            <primitive object={glassMat} />
          </mesh>
          {/* Center Vertical Mullion */}
          <mesh position={[0, 0, 0.02]} material={darkFrameMat}>
            <boxGeometry args={[0.03, 1.3, 0.04]} />
          </mesh>
        </group>

        {/* Concrete Chhajja (Sunshade) over Ground Window */}
        <mesh position={[1.8, 2.3, 2.75]} castShadow receiveShadow material={trimMat}>
          <boxGeometry args={[1.5, 0.08, 0.45]} />
        </mesh>

        {/* Left Side Small Ventilation Window */}
        <group position={[-2.81, 2.0, 0.5]} rotation={[0, -Math.PI / 2, 0]}>
          <mesh castShadow material={darkFrameMat}>
            <boxGeometry args={[0.8, 0.8, 0.05]} />
          </mesh>
          <mesh position={[0, 0, 0.01]}>
            <planeGeometry args={[0.72, 0.72]} />
            <primitive object={glassMat} />
          </mesh>
          <mesh position={[0, 0.48, 0.15]} castShadow material={trimMat}>
            <boxGeometry args={[1.0, 0.06, 0.3]} />
          </mesh>
        </group>
      </group>

      {/* 3. FLOOR SEPARATOR CANTILEVERED SLAB (Y = 3.24) */}
      <mesh position={[0, 3.24 + 0.075, 0]} castShadow receiveShadow material={trimMat}>
        <boxGeometry args={[5.8, 0.15, 5.2]} />
      </mesh>

      {/* 4. FIRST FLOOR (LEVEL 2: Y = 3.39 to 6.39) */}
      <group position={[0, 3.39, 0]}>
        {/* Main First Floor Box */}
        <mesh position={[0, 1.5, 0]} castShadow receiveShadow material={wallMat}>
          <boxGeometry args={[5.6, 3.0, 5.0]} />
        </mesh>

        {/* First Floor Accent Panel */}
        <mesh position={[-1.2, 1.5, 2.51]} castShadow receiveShadow material={accentMat}>
          <boxGeometry args={[1.8, 3.0, 0.04]} />
        </mesh>

        {/* First Floor Balcony / Window 1 (Left side) */}
        <group position={[-1.2, 1.5, 2.53]}>
          <mesh castShadow material={darkFrameMat}>
            <boxGeometry args={[1.4, 1.5, 0.06]} />
          </mesh>
          <mesh position={[0, 0, 0.01]}>
            <planeGeometry args={[1.28, 1.38]} />
            <primitive object={glassMat} />
          </mesh>
          <mesh position={[0, 0, 0.02]} material={darkFrameMat}>
            <boxGeometry args={[0.04, 1.4, 0.04]} />
          </mesh>
          {/* Black Metal Protective Safety Grille */}
          {[-0.35, 0, 0.35].map((x, i) => (
            <mesh key={i} position={[x, -0.2, 0.04]} material={darkFrameMat}>
              <cylinderGeometry args={[0.008, 0.008, 0.8, 6]} />
            </mesh>
          ))}
        </group>

        {/* Concrete Chhajja over Left Window */}
        <mesh position={[-1.2, 2.35, 2.78]} castShadow receiveShadow material={trimMat}>
          <boxGeometry args={[1.7, 0.08, 0.5]} />
        </mesh>

        {/* First Floor Window 2 (Right side) */}
        <group position={[1.6, 1.5, 2.53]}>
          <mesh castShadow material={darkFrameMat}>
            <boxGeometry args={[1.2, 1.4, 0.06]} />
          </mesh>
          <mesh position={[0, 0, 0.01]}>
            <planeGeometry args={[1.1, 1.28]} />
            <primitive object={glassMat} />
          </mesh>
          <mesh position={[0, 0, 0.02]} material={darkFrameMat}>
            <boxGeometry args={[0.03, 1.3, 0.04]} />
          </mesh>
        </group>

        {/* Concrete Chhajja over Right Window */}
        <mesh position={[1.6, 2.3, 2.75]} castShadow receiveShadow material={trimMat}>
          <boxGeometry args={[1.5, 0.08, 0.45]} />
        </mesh>

        {/* Outdoor Split AC Compressor Unit */}
        {hasACUnit && (
          <ACUnit position={[2.85, 1.8, 0.8]} rotation={[0, Math.PI / 2, 0]} />
        )}
      </group>

      {/* 5. ROOFTOP SLAB (Y = 6.39 + 0.09 = 6.48) */}
      <mesh position={[0, 6.48, 0]} castShadow receiveShadow material={trimMat}>
        <boxGeometry args={[5.8, 0.18, 5.2]} />
      </mesh>

      {/* 6. ACCESSIBLE ROOFTOP TERRACE (Y = 6.57) */}
      <group position={[0, 6.57, 0]}>
        {/* Walkable Terrace Floor Surface */}
        <mesh position={[0, 0.01, 0]} receiveShadow>
          <boxGeometry args={[5.6, 0.02, 5.0]} />
          <meshStandardMaterial color="#cbd5e1" roughness={0.9} />
        </mesh>

        {/* Solid Plaster Parapet Safety Walls (0.85m High) */}
        {/* Front Parapet */}
        <mesh position={[0, 0.425, 2.44]} castShadow receiveShadow material={wallMat}>
          <boxGeometry args={[5.6, 0.85, 0.14]} />
        </mesh>
        <mesh position={[0, 0.87, 2.44]} castShadow material={trimMat}>
          <boxGeometry args={[5.7, 0.06, 0.18]} />
        </mesh>

        {/* Left Parapet */}
        <mesh position={[-2.74, 0.425, 0]} castShadow receiveShadow material={wallMat}>
          <boxGeometry args={[0.14, 0.85, 5.0]} />
        </mesh>
        <mesh position={[-2.74, 0.87, 0]} castShadow material={trimMat}>
          <boxGeometry args={[0.18, 0.06, 5.1]} />
        </mesh>

        {/* Right Parapet */}
        <mesh position={[2.74, 0.425, 0]} castShadow receiveShadow material={wallMat}>
          <boxGeometry args={[0.14, 0.85, 5.0]} />
        </mesh>
        <mesh position={[2.74, 0.87, 0]} castShadow material={trimMat}>
          <boxGeometry args={[0.18, 0.06, 5.1]} />
        </mesh>

        {/* Back Parapet */}
        <mesh position={[0, 0.425, -2.44]} castShadow receiveShadow material={wallMat}>
          <boxGeometry args={[5.6, 0.85, 0.14]} />
        </mesh>
        <mesh position={[0, 0.87, -2.44]} castShadow material={trimMat}>
          <boxGeometry args={[5.7, 0.06, 0.18]} />
        </mesh>

        {/* Staircase Mumty Cabin (Rooftop Stair Room at Back-Left) */}
        {hasMumtyCabin && (
          <group position={[-1.5, 0, -1.2]}>
            {/* Mumty Room Body (Height = 2.4m) */}
            <mesh position={[0, 1.2, 0]} castShadow receiveShadow material={wallMat}>
              <boxGeometry args={[2.0, 2.4, 2.2]} />
            </mesh>
            {/* Mumty Concrete Roof Top Slab */}
            <mesh position={[0, 2.45, 0]} castShadow receiveShadow material={trimMat}>
              <boxGeometry args={[2.2, 0.12, 2.4]} />
            </mesh>
            {/* Mumty Metal Exit Door onto Terrace */}
            <mesh position={[0, 1.0, 1.11]} castShadow material={metalDoorMat}>
              <boxGeometry args={[0.85, 1.9, 0.04]} />
            </mesh>
            <mesh position={[0.3, 1.0, 1.14]} castShadow material={trimMat}>
              <cylinderGeometry args={[0.01, 0.01, 0.4, 8]} />
            </mesh>
            {/* Door Small Concrete Sunshade */}
            <mesh position={[0, 2.05, 1.28]} castShadow material={trimMat}>
              <boxGeometry args={[1.1, 0.06, 0.3]} />
            </mesh>
          </group>
        )}

        {/* Iconic Indian Rooftop Props */}
        {hasWaterTank && (
          <WaterTank
            position={hasMumtyCabin ? [-1.5, 2.51, -1.2] : [-1.5, 0, -1.2]}
            color="#0f172a"
            hasStand={true}
          />
        )}

        {hasDishAntenna && (
          <DishAntenna position={[1.6, 0, -1.5]} rotation={[0, -0.6, 0]} scale={0.85} />
        )}

        {hasClothesline && (
          <Clothesline position={[1.0, 0, 1.0]} />
        )}

        {/* Unfinished Concrete Pillar Extension with Iron Rebars */}
        {hasRebars && (
          <group>
            {[
              [-2.6, 2.2],
              [2.6, 2.2],
              [2.6, -2.2],
            ].map(([x, z], idx) => (
              <group key={idx} position={[x, 0.85, z]}>
                {/* Short Concrete Pillar Base */}
                <mesh position={[0, 0.2, 0]} castShadow material={wallMat}>
                  <boxGeometry args={[0.3, 0.4, 0.3]} />
                </mesh>
                {/* 4 Exposed Iron Rebars */}
                {[
                  [-0.08, -0.08],
                  [0.08, -0.08],
                  [-0.08, 0.08],
                  [0.08, 0.08],
                ].map(([rx, rz], rIdx) => (
                  <mesh key={rIdx} position={[rx, 0.65, rz]} castShadow material={rebarMat}>
                    <cylinderGeometry args={[0.008, 0.008, 0.6, 6]} />
                  </mesh>
                ))}
              </group>
            ))}
          </group>
        )}
      </group>

      {/* Gully Red Tennis Cricket Ball near entrance */}
      <group position={[-0.4, 0.45, 2.7]}>
        <mesh castShadow>
          <sphereGeometry args={[0.04, 16, 16]} />
          <meshStandardMaterial color="#dc2626" roughness={0.35} />
        </mesh>
      </group>
    </group>
  );
};
