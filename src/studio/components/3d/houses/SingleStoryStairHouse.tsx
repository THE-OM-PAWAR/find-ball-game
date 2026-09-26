import React, { useMemo } from 'react';
import * as THREE from 'three';
import { WaterTank, DishAntenna } from '../HouseProps';

export interface StairHouseConfig {
  wallColor: string;
  accentColor: string;
  stoneAccentColor: string;
  trimColor?: string;
  hasWaterTank: boolean;
  hasDishAntenna: boolean;
  hasCoveLight: boolean;
  hasFrontGarden: boolean;
}

/**
 * Single-Storey Contemporary Bungalow with Open Exterior Staircase
 * High-fidelity 1:1 reproduction of reference bungalow:
 * - Playable exterior open staircase climbing to rooftop terrace on the right side
 * - Stair base shifted forward for seamless and direct access onto the main terrace
 * - 100% open-to-sky stairwell with ZERO roof obstruction
 * - Clean, mathematically aligned white diagonal balustrade parapet wall
 * - Raised front veranda with entrance steps & white vertical railing
 * - Projecting architectural roof canopy with warm LED cove lighting
 * - Stone texture accent wall, groove horizontal cladding, and rooftop terrace railing
 */
export const SingleStoryStairHouse: React.FC<{
  config?: Partial<StairHouseConfig>;
  position?: [number, number, number];
  rotation?: [number, number, number];
}> = ({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  config = {},
}) => {
  const {
    wallColor = '#c4b5a2', // Warm modern taupe beige
    accentColor = '#242930', // Dark charcoal slate
    stoneAccentColor = '#59534c', // Textured slate grey stone
    trimColor = '#f8fafc', // Crisp white trims & parapet
    hasWaterTank = true,
    hasDishAntenna = true,
    hasCoveLight = true,
    hasFrontGarden = true,
  } = config;

  // Architectural PBR Materials
  const mainWallMat = useMemo(
    () => new THREE.MeshStandardMaterial({ color: wallColor, roughness: 0.75, metalness: 0.05 }),
    [wallColor]
  );
  const accentWallMat = useMemo(
    () => new THREE.MeshStandardMaterial({ color: accentColor, roughness: 0.7, metalness: 0.08 }),
    [accentColor]
  );
  const whiteTrimMat = useMemo(
    () => new THREE.MeshStandardMaterial({ color: trimColor, roughness: 0.55, metalness: 0.05 }),
    [trimColor]
  );
  const stoneMat = useMemo(
    () => new THREE.MeshStandardMaterial({ color: stoneAccentColor, roughness: 0.9, metalness: 0.1 }),
    [stoneAccentColor]
  );
  const darkTrimMat = useMemo(
    () => new THREE.MeshStandardMaterial({ color: '#181b22', roughness: 0.35, metalness: 0.6 }),
    []
  );
  const glassMat = useMemo(
    () => new THREE.MeshStandardMaterial({ color: '#090d16', roughness: 0.1, metalness: 0.95 }),
    []
  );
  const woodDoorMat = useMemo(
    () => new THREE.MeshStandardMaterial({ color: '#451a03', roughness: 0.5, metalness: 0.2 }),
    []
  );
  const stepTreadMat = useMemo(
    () => new THREE.MeshStandardMaterial({ color: '#1a202c', roughness: 0.55, metalness: 0.25 }),
    []
  );
  const coveLightMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#fef08a',
        emissive: '#f59e0b',
        emissiveIntensity: 1.4,
        roughness: 0.3,
      }),
    []
  );

  // Stair Parameters: 16 climbable steps from y = 0.24m (ground plinth) to y = 3.24m (rooftop floor)
  // Shifted forward (startZ = 2.15, endZ = -1.05) so top step lands directly on main terrace
  const stairCenterZ = 0.55;
  const stairSlopeAngle = 0.7531; // arctan(3.0 / 3.2) = 43.15 deg

  const stairSteps = useMemo(() => {
    const totalRise = 3.0; // from ground plinth (0.24) to roof floor (3.24)
    const count = 16;
    const riser = totalRise / count; // 0.1875m per step
    const startZ = 2.15;
    const endZ = -1.05;
    const totalDepth = startZ - endZ; // 3.2m
    const treadDepth = totalDepth / count; // 0.20m per tread
    const stairX = 2.65; // Center of stairs (between charcoal wall at x=2.15 and outer stringer at x=3.20)
    const stairWidth = 1.0;

    return Array.from({ length: count }).map((_, i) => ({
      index: i,
      x: stairX,
      y: 0.24 + (i + 0.5) * riser,
      z: startZ - (i + 0.5) * treadDepth,
      width: stairWidth,
      height: riser,
      depth: treadDepth + 0.02,
    }));
  }, []);

  return (
    <group position={position} rotation={rotation}>
      {/* 1. BASE PLINTH (Clean concrete ground platform) */}
      <mesh position={[0, 0.12, 0]} receiveShadow castShadow>
        <boxGeometry args={[9.6, 0.24, 8.4]} />
        <meshStandardMaterial color="#f1f5f9" roughness={0.9} />
      </mesh>

      {/* Front Entrance 4-Step Stairs (leading to raised veranda) */}
      <group position={[-1.2, 0.24, 2.15]}>
        {[
          { y: 0.035, z: 0.45, h: 0.07 },
          { y: 0.09, z: 0.3, h: 0.07 },
          { y: 0.145, z: 0.15, h: 0.07 },
          { y: 0.2, z: 0, h: 0.07 },
        ].map((step, i) => (
          <mesh key={i} position={[0, step.y, step.z]} receiveShadow castShadow material={stepTreadMat}>
            <boxGeometry args={[1.5, step.h, 0.18]} />
          </mesh>
        ))}
      </group>

      {/* 2. RAISED FRONT VERANDA / OTLA (Platform at Y = 0.48) */}
      <group position={[-0.2, 0.24, 1.2]}>
        {/* Raised Floor Slab */}
        <mesh position={[0, 0.12, 0]} receiveShadow castShadow>
          <boxGeometry args={[4.4, 0.24, 1.6]} />
          <meshStandardMaterial color="#e2e8f0" roughness={0.8} />
        </mesh>

        {/* Veranda Dark Skirting Base Trim */}
        <mesh position={[0, 0.25, 0.76]} receiveShadow material={darkTrimMat}>
          <boxGeometry args={[4.4, 0.04, 0.08]} />
        </mesh>

        {/* White Vertical Safety Railing on Front Veranda */}
        <group position={[0.35, 0.28, 0.74]}>
          {/* Top Handrail */}
          <mesh position={[0, 0.7, 0]} castShadow material={whiteTrimMat}>
            <boxGeometry args={[2.7, 0.04, 0.04]} />
          </mesh>
          {/* Bottom Rail */}
          <mesh position={[0, 0.02, 0]} castShadow material={whiteTrimMat}>
            <boxGeometry args={[2.7, 0.02, 0.02]} />
          </mesh>
          {/* Vertical White Slats */}
          {Array.from({ length: 14 }).map((_, i) => (
            <mesh key={i} position={[-1.25 + i * 0.19, 0.35, 0]} castShadow material={whiteTrimMat}>
              <boxGeometry args={[0.02, 0.68, 0.02]} />
            </mesh>
          ))}
        </group>
      </group>

      {/* 3. MAIN HOUSE BODY */}
      <group position={[0, 0.24, -0.4]}>
        {/* Left Section (Beige with horizontal groove cladding) */}
        <group position={[-2.8, 0, 0]}>
          {/* Left Wing Body */}
          <mesh position={[0, 1.6, 0]} castShadow receiveShadow material={mainWallMat}>
            <boxGeometry args={[1.8, 3.2, 3.6]} />
          </mesh>
          {/* Left Dark Vertical Accent Pillar */}
          <mesh position={[-0.9, 1.65, 0.1]} castShadow receiveShadow material={accentWallMat}>
            <boxGeometry args={[0.25, 3.3, 3.8]} />
          </mesh>
          {/* Horizontal Groove Cladding Strips on Lower Front */}
          {[-0.8, -0.5, -0.2, 0.1, 0.4].map((y, i) => (
            <mesh key={i} position={[0, 1.2 + y, 1.82]} material={whiteTrimMat}>
              <boxGeometry args={[1.4, 0.03, 0.02]} />
            </mesh>
          ))}
          {/* Left Window with White Sunshade */}
          <mesh position={[0, 2.3, 1.82]} castShadow material={darkTrimMat}>
            <boxGeometry args={[0.9, 0.85, 0.06]} />
          </mesh>
          <mesh position={[0, 2.8, 1.92]} castShadow material={whiteTrimMat}>
            <boxGeometry args={[1.1, 0.06, 0.25]} />
          </mesh>
        </group>

        {/* Central Facade (Beige Front Wall with Door, Stone Pillar, Big Window) */}
        <group position={[-0.4, 0, 0]}>
          {/* Main Enclosing Wall */}
          <mesh position={[0, 1.6, 0]} castShadow receiveShadow material={mainWallMat}>
            <boxGeometry args={[3.0, 3.2, 3.6]} />
          </mesh>

          {/* Front Entrance Wooden Door */}
          <mesh position={[-0.85, 1.35, 1.81]} castShadow material={woodDoorMat}>
            <boxGeometry args={[1.0, 2.2, 0.05]} />
          </mesh>
          {/* Door Vertical Metallic Handle */}
          <mesh position={[-0.45, 1.35, 1.86]} castShadow material={whiteTrimMat}>
            <cylinderGeometry args={[0.012, 0.012, 0.8, 8]} />
          </mesh>

          {/* Stone Accent Pillar (Separating Door and Window) */}
          <mesh position={[-0.1, 1.6, 1.83]} castShadow receiveShadow material={stoneMat}>
            <boxGeometry args={[0.55, 3.2, 0.12]} />
          </mesh>

          {/* Front Large Sliding Window */}
          <group position={[0.85, 1.6, 1.82]}>
            <mesh castShadow material={darkTrimMat}>
              <boxGeometry args={[1.25, 1.4, 0.06]} />
            </mesh>
            <mesh position={[0, 0, 0.01]}>
              <planeGeometry args={[1.15, 1.28]} />
              <primitive object={glassMat} />
            </mesh>
            {/* Window Center Vertical Mullion */}
            <mesh position={[0, 0, 0.02]} material={darkTrimMat}>
              <boxGeometry args={[0.04, 1.3, 0.04]} />
            </mesh>
          </group>
        </group>

        {/* Right Charcoal Backing Wall (Flanking the interior side of the stairs) */}
        {/* Height = 3.24m (stops flush at rooftop floor level so no roof covers the stairs) */}
        <mesh position={[1.65, 1.6, 0]} castShadow receiveShadow material={accentWallMat}>
          <boxGeometry args={[1.1, 3.2, 3.6]} />
        </mesh>

        {/* 4. PROJECTING CANTILEVER ROOF CANOPY & COVE LIGHTING */}
        {/* Only spans the front facade (x = -2.7 to 1.7), leaving stairs at x >= 2.15 completely open */}
        <group position={[-0.5, 3.2, 1.2]}>
          {/* White Projecting Roof Slab (Chhajja / Portico) */}
          <mesh position={[0, 0.12, 0]} castShadow receiveShadow material={whiteTrimMat}>
            <boxGeometry args={[4.4, 0.25, 2.0]} />
          </mesh>

          {/* Warm LED Cove Strip Lighting (Underside perimeter glow) */}
          {hasCoveLight && (
            <>
              {/* Front Cove Light Strip */}
              <mesh position={[0, -0.01, 0.95]} material={coveLightMat}>
                <boxGeometry args={[4.2, 0.03, 0.04]} />
              </mesh>
              {/* Left & Right Cove Light Strips */}
              <mesh position={[-2.15, -0.01, 0]} material={coveLightMat}>
                <boxGeometry args={[0.04, 0.03, 1.9]} />
              </mesh>
              <mesh position={[2.15, -0.01, 0]} material={coveLightMat}>
                <boxGeometry args={[0.04, 0.03, 1.9]} />
              </mesh>
              {/* Ceiling Recessed Spotlights */}
              {[-1.4, -0.7, 0, 0.7, 1.4].map((x, i) => (
                <mesh key={i} position={[x, -0.01, 0.2]} material={coveLightMat}>
                  <cylinderGeometry args={[0.04, 0.04, 0.02, 12]} />
                </mesh>
              ))}
            </>
          )}
        </group>

        {/* 5. PLAYABLE OPEN EXTERIOR STAIRCASE (Shifted Forward for Direct Terrace Walk-In) */}
        <group position={[0, 0, 0]}>
          {/* Individual Stair Treads (16 steps climbing up cleanly) */}
          {stairSteps.map((step) => (
            <mesh
              key={step.index}
              position={[step.x, step.y, step.z]}
              castShadow
              receiveShadow
              material={stepTreadMat}
            >
              <boxGeometry args={[step.width, step.height, step.depth]} />
            </mesh>
          ))}

          {/* Solid Under-Stair Concrete Support Base */}
          <mesh
            position={[2.7, 1.6, stairCenterZ]}
            rotation={[stairSlopeAngle, 0, 0]}
            receiveShadow
            material={accentWallMat}
          >
            <boxGeometry args={[1.0, 0.15, 4.4]} />
          </mesh>

          {/* White Outer Diagonal Parapet Wall / Balustrade */}
          {/* 1. Main Diagonal Sloping Parapet (rises from front to back parallel to stairs) */}
          <mesh
            position={[3.20, 2.1, stairCenterZ]}
            rotation={[stairSlopeAngle, 0, 0]}
            castShadow
            receiveShadow
            material={whiteTrimMat}
          >
            <boxGeometry args={[0.14, 0.70, 4.45]} />
          </mesh>

          {/* 2. Bottom Front Anchor Pillar (meets the front ground & veranda) */}
          <mesh position={[3.20, 0.74, 2.15]} castShadow receiveShadow material={whiteTrimMat}>
            <boxGeometry args={[0.14, 1.0, 0.30]} />
          </mesh>

          {/* 3. Top Rooftop Landing Pillar (meets rooftop terrace edge) */}
          <mesh position={[3.20, 3.59, -1.3]} castShadow receiveShadow material={whiteTrimMat}>
            <boxGeometry args={[0.24, 0.70, .9]} />
          </mesh>

          {/* Top Landing Platform (Direct seamless walk-in to rooftop terrace) */}
          <mesh position={[2.65, 3.12, -1.35]} receiveShadow material={stepTreadMat}>
            <boxGeometry args={[1.0, 0.24, 0.65]} />
          </mesh>

          {/* Staircase Bottom Landing Pad */}
          <mesh position={[2.65, 0.12, 2.25]} receiveShadow material={stepTreadMat}>
            <boxGeometry args={[1.0, 0.24, 0.35]} />
          </mesh>
        </group>

        {/* 6. ACCESSIBLE ROOFTOP TERRACE & PERIMETER RAILING */}
        <group position={[0, 3.24, 0]}>
          {/* Flat Walkable Rooftop Floor Slab */}
          <mesh position={[-0.8, 0.02, 0]} receiveShadow>
            <boxGeometry args={[5.8, 0.04, 3.8]} />
            <meshStandardMaterial color="#d1c7b7" roughness={0.85} />
          </mesh>

          {/* Modern Rooftop Vertical Slat Safety Railing (Front) */}
          <group position={[-0.8, 0.04, 1.8]}>
            {/* Top Handrail */}
            <mesh position={[0, 0.55, 0]} castShadow material={whiteTrimMat}>
              <boxGeometry args={[5.6, 0.035, 0.035]} />
            </mesh>
            {/* Vertical White Slats */}
            {Array.from({ length: 28 }).map((_, i) => (
              <mesh key={i} position={[-2.7 + i * 0.195, 0.28, 0]} castShadow material={whiteTrimMat}>
                <boxGeometry args={[0.018, 0.52, 0.018]} />
              </mesh>
            ))}
          </group>

          {/* Rooftop Left Perimeter Railing */}
          <group position={[-3.65, 0.04, 0]} rotation={[0, Math.PI / 2, 0]}>
            <mesh position={[0, 0.55, 0]} castShadow material={whiteTrimMat}>
              <boxGeometry args={[3.6, 0.035, 0.035]} />
            </mesh>
            {Array.from({ length: 18 }).map((_, i) => (
              <mesh key={i} position={[-1.7 + i * 0.19, 0.28, 0]} castShadow material={whiteTrimMat}>
                <boxGeometry args={[0.018, 0.52, 0.018]} />
              </mesh>
            ))}
          </group>

          {/* Rooftop Back Safety Railing */}
          <group position={[-0.8, 0.04, -1.85]}>
            <mesh position={[0, 0.55, 0]} castShadow material={whiteTrimMat}>
              <boxGeometry args={[5.6, 0.035, 0.035]} />
            </mesh>
            {Array.from({ length: 28 }).map((_, i) => (
              <mesh key={i} position={[-2.7 + i * 0.195, 0.28, 0]} castShadow material={whiteTrimMat}>
                <boxGeometry args={[0.018, 0.52, 0.018]} />
              </mesh>
            ))}
          </group>

          {/* Rooftop Sintex Water Tank & Dish Antenna */}
          {hasWaterTank && (
            <WaterTank position={[-2.4, 0.05, -0.9]} color="#0f172a" hasStand={true} />
          )}
          {hasDishAntenna && (
            <DishAntenna position={[0.8, 0.05, -1.0]} rotation={[0, -0.5, 0]} scale={0.8} />
          )}
        </group>
      </group>

      {/* 7. FRONT SIDEWALK / GARDEN DETAIL */}
      {hasFrontGarden && (
        <group position={[-3.2, 0.24, 2.5]}>
          {/* Low Green Bush Mounds along boundary */}
          {[-0.6, 0, 0.6].map((x, i) => (
            <mesh key={i} position={[x, 0.14, 0]} castShadow receiveShadow>
              <dodecahedronGeometry args={[0.18, 1]} />
              <meshStandardMaterial color={i === 1 ? '#4d7c0f' : '#3f6212'} roughness={0.85} />
            </mesh>
          ))}
        </group>
      )}

      {/* Gully Red Tennis Cricket Ball on Front Entrance Step */}
      <group position={[-1.2, 0.45, 2.2]}>
        <mesh castShadow>
          <sphereGeometry args={[0.04, 16, 16]} />
          <meshStandardMaterial color="#dc2626" roughness={0.35} />
        </mesh>
        <mesh rotation={[0.4, 0.3, 0]}>
          <torusGeometry args={[0.041, 0.003, 6, 20]} />
          <meshStandardMaterial color="#ffffff" roughness={0.5} />
        </mesh>
      </group>
    </group>
  );
};
