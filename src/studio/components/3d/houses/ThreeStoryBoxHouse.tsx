import React, { useMemo } from 'react';
import * as THREE from 'three';
import { WaterTank, DishAntenna, Clothesline, ACUnit } from '../HouseProps';

export interface ThreeStoryBoxConfig {
  wallColor: string;
  accentColor: string;
  trimColor: string;
  hasWaterTank: boolean;
  hasDishAntenna: boolean;
  hasACUnits: boolean;
  hasClothesline: boolean;
  hasRebars: boolean;
  hasMumtyCabin: boolean;
}

/**
 * Three-Storey Indian Box House with Rooftop Terrace
 * Authentic, clean geometric multi-storey residential house popular in Indian neighborhoods:
 * - 3 full habitable storeys (Ground + 1st Floor + 2nd Floor)
 * - Walkable flat rooftop terrace at Y = 9.48m
 * - Staircase Mumty (rooftop stairhead room with exit door)
 * - Cantilevered concrete sunshades (Chhajjas) & floor bands
 * - 1st and 2nd Floor modern protective iron balconies
 * - Dual Sintex water tanks, satellite dish, dual AC units & iron rebars
 */
export const ThreeStoryBoxHouse: React.FC<{
  config?: Partial<ThreeStoryBoxConfig>;
  position?: [number, number, number];
  rotation?: [number, number, number];
}> = ({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  config = {},
}) => {
  const {
    wallColor = '#ded6c7', // Warm sandstone lime plaster
    accentColor = '#8a4b38', // Terracotta rust accent band
    trimColor = '#f8fafc', // Crisp white concrete trims
    hasWaterTank = true,
    hasDishAntenna = true,
    hasACUnits = true,
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


  return (
    <group position={position} rotation={rotation}>


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
        {/* Main Box */}
        <mesh position={[0, 1.5, 0]} castShadow receiveShadow material={wallMat}>
          <boxGeometry args={[5.6, 3.0, 5.0]} />
        </mesh>

        {/* Vertical Accent Color Block on Right */}
        <mesh position={[1.8, 1.5, 2.51]} castShadow receiveShadow material={accentMat}>
          <boxGeometry args={[1.6, 3.0, 0.04]} />
        </mesh>

        {/* Main Entrance Door */}
        <group position={[-1.2, 1.25, 2.52]}>
          <mesh castShadow material={woodDoorMat}>
            <boxGeometry args={[1.1, 2.2, 0.06]} />
          </mesh>
          <mesh position={[0.4, 0, 0.04]} castShadow material={trimMat}>
            <cylinderGeometry args={[0.012, 0.012, 0.7, 8]} />
          </mesh>
        </group>

        {/* Concrete Sunshade over Door */}
        <mesh position={[-1.2, 2.45, 2.75]} castShadow receiveShadow material={trimMat}>
          <boxGeometry args={[1.5, 0.08, 0.5]} />
        </mesh>

        {/* Ground Floor Window */}
        <group position={[1.8, 1.5, 2.53]}>
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
        <mesh position={[1.8, 2.3, 2.75]} castShadow receiveShadow material={trimMat}>
          <boxGeometry args={[1.5, 0.08, 0.45]} />
        </mesh>
      </group>

      {/* FLOOR 1 SLAB SEPARATOR (Y = 3.24) */}
      <mesh position={[0, 3.24 + 0.075, 0]} castShadow receiveShadow material={trimMat}>
        <boxGeometry args={[5.8, 0.15, 5.2]} />
      </mesh>

      {/* 3. FIRST FLOOR (LEVEL 2: Y = 3.39 to 6.39) */}
      <group position={[0, 3.39, 0]}>
        <mesh position={[0, 1.5, 0]} castShadow receiveShadow material={wallMat}>
          <boxGeometry args={[5.6, 3.0, 5.0]} />
        </mesh>

        {/* Horizontal Accent Line */}
        <mesh position={[0, 1.5, 2.51]} castShadow receiveShadow material={accentMat}>
          <boxGeometry args={[5.6, 0.4, 0.04]} />
        </mesh>

        {/* First Floor Balcony with Extended Slab */}
        <mesh position={[-1.2, 0.08, 2.8]} castShadow receiveShadow material={trimMat}>
          <boxGeometry args={[2.0, 0.16, 0.7]} />
        </mesh>
        {/* Balcony Metal Safety Railing */}
        <group position={[-1.2, 0.6, 3.1]}>
          <mesh position={[0, 0.45, 0]} material={darkFrameMat}>
            <boxGeometry args={[2.0, 0.04, 0.04]} />
          </mesh>
          {[-0.8, -0.4, 0, 0.4, 0.8].map((x, i) => (
            <mesh key={i} position={[x, 0, 0]} material={darkFrameMat}>
              <boxGeometry args={[0.02, 0.9, 0.02]} />
            </mesh>
          ))}
        </group>

        {/* French Balcony Doorway */}
        <group position={[-1.2, 1.4, 2.53]}>
          <mesh castShadow material={darkFrameMat}>
            <boxGeometry args={[1.4, 2.2, 0.06]} />
          </mesh>
          <mesh position={[0, 0, 0.01]}>
            <planeGeometry args={[1.28, 2.08]} />
            <primitive object={glassMat} />
          </mesh>
        </group>

        {/* Right Window */}
        <group position={[1.6, 1.5, 2.53]}>
          <mesh castShadow material={darkFrameMat}>
            <boxGeometry args={[1.2, 1.4, 0.06]} />
          </mesh>
          <mesh position={[0, 0, 0.01]}>
            <planeGeometry args={[1.1, 1.28]} />
            <primitive object={glassMat} />
          </mesh>
          <mesh position={[0, 0.8, 0.2]} castShadow material={trimMat}>
            <boxGeometry args={[1.4, 0.08, 0.4]} />
          </mesh>
        </group>

        {/* Split AC Unit 1 */}
        {hasACUnits && (
          <ACUnit position={[2.85, 1.8, 0.8]} rotation={[0, Math.PI / 2, 0]} />
        )}
      </group>

      {/* FLOOR 2 SLAB SEPARATOR (Y = 6.39) */}
      <mesh position={[0, 6.39 + 0.075, 0]} castShadow receiveShadow material={trimMat}>
        <boxGeometry args={[5.8, 0.15, 5.2]} />
      </mesh>

      {/* 4. SECOND FLOOR (LEVEL 3: Y = 6.54 to 9.54) */}
      <group position={[0, 6.54, 0]}>
        <mesh position={[0, 1.5, 0]} castShadow receiveShadow material={wallMat}>
          <boxGeometry args={[5.6, 3.0, 5.0]} />
        </mesh>

        {/* Second Floor Accent Pattern */}
        <mesh position={[1.6, 1.5, 2.51]} castShadow receiveShadow material={accentMat}>
          <boxGeometry args={[1.8, 3.0, 0.04]} />
        </mesh>

        {/* Left Window with Sunshade */}
        <group position={[-1.2, 1.5, 2.53]}>
          <mesh castShadow material={darkFrameMat}>
            <boxGeometry args={[1.4, 1.4, 0.06]} />
          </mesh>
          <mesh position={[0, 0, 0.01]}>
            <planeGeometry args={[1.28, 1.28]} />
            <primitive object={glassMat} />
          </mesh>
          <mesh position={[0, 0.8, 0.22]} castShadow material={trimMat}>
            <boxGeometry args={[1.6, 0.08, 0.45]} />
          </mesh>
        </group>

        {/* Right Window with Sunshade */}
        <group position={[1.6, 1.5, 2.53]}>
          <mesh castShadow material={darkFrameMat}>
            <boxGeometry args={[1.2, 1.4, 0.06]} />
          </mesh>
          <mesh position={[0, 0, 0.01]}>
            <planeGeometry args={[1.1, 1.28]} />
            <primitive object={glassMat} />
          </mesh>
          <mesh position={[0, 0.8, 0.22]} castShadow material={trimMat}>
            <boxGeometry args={[1.4, 0.08, 0.45]} />
          </mesh>
        </group>

        {/* Split AC Unit 2 */}
        {hasACUnits && (
          <ACUnit position={[-2.85, 1.8, -0.6]} rotation={[0, -Math.PI / 2, 0]} />
        )}
      </group>

      {/* 5. ROOFTOP SLAB (Y = 9.54 + 0.09 = 9.63) */}
      <mesh position={[0, 9.63, 0]} castShadow receiveShadow material={trimMat}>
        <boxGeometry args={[5.8, 0.18, 5.2]} />
      </mesh>

      {/* 6. ACCESSIBLE ROOFTOP TERRACE (Y = 9.72) */}
      <group position={[0, 9.72, 0]}>
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
            <mesh position={[0, 1.2, 0]} castShadow receiveShadow material={wallMat}>
              <boxGeometry args={[2.0, 2.4, 2.2]} />
            </mesh>
            <mesh position={[0, 2.45, 0]} castShadow receiveShadow material={trimMat}>
              <boxGeometry args={[2.2, 0.12, 2.4]} />
            </mesh>
            <mesh position={[0, 1.0, 1.11]} castShadow material={metalDoorMat}>
              <boxGeometry args={[0.85, 1.9, 0.04]} />
            </mesh>
            <mesh position={[0.3, 1.0, 1.14]} castShadow material={trimMat}>
              <cylinderGeometry args={[0.01, 0.01, 0.4, 8]} />
            </mesh>
            <mesh position={[0, 2.05, 1.28]} castShadow material={trimMat}>
              <boxGeometry args={[1.1, 0.06, 0.3]} />
            </mesh>
          </group>
        )}

        {/* Dual Sintex Water Tanks (for 3-storey building) */}
        {hasWaterTank && (
          <>
            <WaterTank
              position={hasMumtyCabin ? [-1.5, 2.51, -1.2] : [-1.5, 0, -1.2]}
              color="#0f172a"
              hasStand={true}
            />
            <WaterTank
              position={[-1.5, 0, 1.0]}
              color="#0284c7"
              hasStand={true}
            />
          </>
        )}

        {hasDishAntenna && (
          <DishAntenna position={[1.6, 0, -1.5]} rotation={[0, -0.6, 0]} scale={0.85} />
        )}

        {hasClothesline && (
          <Clothesline position={[1.0, 0, 0.8]} />
        )}

        {/* Unfinished Concrete Pillars with Iron Rebars */}
        {hasRebars && (
          <group>
            {[
              [-2.6, 2.2],
              [2.6, 2.2],
              [2.6, -2.2],
            ].map(([x, z], idx) => (
              <group key={idx} position={[x, 0.85, z]}>
                <mesh position={[0, 0.2, 0]} castShadow material={wallMat}>
                  <boxGeometry args={[0.3, 0.4, 0.3]} />
                </mesh>
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

      {/* Gully Red Tennis Cricket Ball */}
      <group position={[-0.4, 0.45, 2.7]}>
        <mesh castShadow>
          <sphereGeometry args={[0.04, 16, 16]} />
          <meshStandardMaterial color="#dc2626" roughness={0.35} />
        </mesh>
      </group>
    </group>
  );
};
