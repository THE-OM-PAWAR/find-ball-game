import React, { useMemo } from 'react';
import * as THREE from 'three';
import { WaterTank, DishAntenna, ACUnit, Clothesline } from '../HouseProps';

export interface ThreeStoryShopConfig {
  wallColor: string;
  accentColor: string;
  trimColor: string;
  hasWaterTanks: boolean;
  hasDishAntenna: boolean;
  hasACUnits: boolean;
  hasClothesline: boolean;
  hasRebars: boolean;
  hasMumtyCabin: boolean;
  hasSignboardLights: boolean;
}

/**
 * 3-Storey Wide Commercial-Residential Shop Complex
 * Iconic Indian neighborhood multi-storey market complex:
 * - Wide ground floor with 3 commercial shops (rolling shutters & glowing signboards)
 * - 1st Floor offices / clinic & 2nd Floor residential apartments with balconies
 * - Wide open flat rooftop terrace at Y = 9.48m (No exterior staircase)
 * - Staircase Mumty cabin, 3 Sintex water tanks, dual dishes, multiple AC units & rebars
 */
export const ThreeStoryShopComplex: React.FC<{
  config?: Partial<ThreeStoryShopConfig>;
  position?: [number, number, number];
  rotation?: [number, number, number];
}> = ({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  config = {},
}) => {
  const {
    wallColor = '#ded8cc', // Warm sandstone cream
    accentColor = '#883a2d', // Classic Indian terracotta brick accent
    trimColor = '#f8fafc', // Crisp white concrete fascia & trims
    hasWaterTanks = true,
    hasDishAntenna = true,
    hasACUnits = true,
    hasClothesline = true,
    hasRebars = true,
    hasMumtyCabin = true,
    hasSignboardLights = true,
  } = config;

  // Architectural PBR Materials
  const wallMat = useMemo(
    () => new THREE.MeshStandardMaterial({ color: wallColor, roughness: 0.85, metalness: 0.05 }),
    [wallColor]
  );
  const accentMat = useMemo(
    () => new THREE.MeshStandardMaterial({ color: accentColor, roughness: 0.7, metalness: 0.1 }),
    [accentColor]
  );
  const trimMat = useMemo(
    () => new THREE.MeshStandardMaterial({ color: trimColor, roughness: 0.55, metalness: 0.05 }),
    [trimColor]
  );
  const shutterBlueMat = useMemo(
    () => new THREE.MeshStandardMaterial({ color: '#1e40af', roughness: 0.45, metalness: 0.5 }),
    []
  );
  const shutterGreenMat = useMemo(
    () => new THREE.MeshStandardMaterial({ color: '#166534', roughness: 0.45, metalness: 0.5 }),
    []
  );
  const shutterGreyMat = useMemo(
    () => new THREE.MeshStandardMaterial({ color: '#334155', roughness: 0.45, metalness: 0.6 }),
    []
  );
  const darkFrameMat = useMemo(
    () => new THREE.MeshStandardMaterial({ color: '#181b22', roughness: 0.35, metalness: 0.7 }),
    []
  );
  const glassMat = useMemo(
    () => new THREE.MeshStandardMaterial({ color: '#090d16', roughness: 0.1, metalness: 0.95 }),
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
  const signGlowMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#fef08a',
        emissive: '#f59e0b',
        emissiveIntensity: 0.6,
        roughness: 0.4,
      }),
    []
  );

  const shops = [
    {
      name: 'SHARMA GENERAL STORE',
      sub: 'GROCERY & KIRANA',
      x: -3.3,
      shutterMat: shutterBlueMat,
      signColor: '#1e3a8a',
      signText: '#facc15',
      openAmount: 0.85,
    },
    {
      name: 'GULLY SWEETS & CHAI',
      sub: 'FRESH SNACKS & TEA',
      x: 0.0,
      shutterMat: shutterGreenMat,
      signColor: '#14532d',
      signText: '#ffffff',
      openAmount: 0.0,
    },
    {
      name: 'APEX MEDICOS & CHEMIST',
      sub: '24/7 PHARMACY & XEROX',
      x: 3.3,
      shutterMat: shutterGreyMat,
      signColor: '#831843',
      signText: '#38bdf8',
      openAmount: 0.9,
    },
  ];

  return (
    <group position={position} rotation={rotation}>


      {/* Front Commercial Concrete Sidewalk Steps */}
      <mesh position={[0, 0.24 + 0.06, 2.9]} receiveShadow castShadow>
        <boxGeometry args={[11.2, 0.12, 0.8]} />
        <meshStandardMaterial color="#94a3b8" roughness={0.8} />
      </mesh>

      {/* 2. GROUND FLOOR SHOPS (Y = 0.24 to 3.24) */}
      <group position={[0, 0.24, 0]}>
        <mesh position={[0, 1.5, 0]} castShadow receiveShadow material={wallMat}>
          <boxGeometry args={[10.4, 3.0, 5.2]} />
        </mesh>

        {/* 3 Commercial Shops */}
        {shops.map((shop, i) => (
          <group key={i} position={[shop.x, 0, 2.61]}>
            <mesh position={[-1.5, 1.5, 0.04]} castShadow receiveShadow material={wallMat}>
              <boxGeometry args={[0.2, 3.0, 0.12]} />
            </mesh>
            <mesh position={[1.5, 1.5, 0.04]} castShadow receiveShadow material={wallMat}>
              <boxGeometry args={[0.2, 3.0, 0.12]} />
            </mesh>

            {/* Shutter Hood Box */}
            <mesh position={[0, 2.45, 0.12]} castShadow receiveShadow material={darkFrameMat}>
              <boxGeometry args={[2.9, 0.35, 0.28]} />
            </mesh>

            {/* Corrugated Shutter */}
            {shop.openAmount === 0 ? (
              <group position={[0, 1.1, 0.05]}>
                <mesh castShadow material={shop.shutterMat}>
                  <boxGeometry args={[2.8, 2.2, 0.04]} />
                </mesh>
                {Array.from({ length: 14 }).map((_, sIdx) => (
                  <mesh key={sIdx} position={[0, -0.95 + sIdx * 0.15, 0.025]} material={darkFrameMat}>
                    <boxGeometry args={[2.78, 0.02, 0.015]} />
                  </mesh>
                ))}
                <mesh position={[0, -1.05, 0.04]} castShadow material={darkFrameMat}>
                  <boxGeometry args={[2.8, 0.08, 0.04]} />
                </mesh>
                <mesh position={[0, -1.05, 0.07]} material={trimMat}>
                  <cylinderGeometry args={[0.025, 0.025, 0.05, 8]} />
                </mesh>
              </group>
            ) : (
              <group position={[0, 0, 0]}>
                <mesh position={[0, 2.05, 0.05]} castShadow material={shop.shutterMat}>
                  <boxGeometry args={[2.8, 0.5, 0.04]} />
                </mesh>
                <mesh position={[0, 1.0, -0.15]} material={darkFrameMat}>
                  <boxGeometry args={[2.75, 1.9, 0.04]} />
                </mesh>
                <mesh position={[0, 1.0, -0.12]}>
                  <planeGeometry args={[2.65, 1.8]} />
                  <primitive object={glassMat} />
                </mesh>
                <mesh position={[0, 0.5, 0.05]} castShadow receiveShadow>
                  <boxGeometry args={[2.2, 0.95, 0.35]} />
                  <meshStandardMaterial color="#475569" roughness={0.6} />
                </mesh>
                <mesh position={[0, 0.98, 0.05]} material={trimMat}>
                  <boxGeometry args={[2.24, 0.04, 0.38]} />
                </mesh>
              </group>
            )}

            {/* Commercial Signboard */}
            <mesh position={[0, 2.78, 0.16]} castShadow receiveShadow>
              <boxGeometry args={[2.9, 0.42, 0.12]} />
              <meshStandardMaterial color={shop.signColor} roughness={0.4} metalness={0.2} />
            </mesh>
            <mesh position={[0, 2.78, 0.23]}>
              <boxGeometry args={[2.78, 0.34, 0.01]} />
              <meshStandardMaterial color={shop.signText} roughness={0.3} emissive={shop.signColor} emissiveIntensity={0.2} />
            </mesh>
          </group>
        ))}

        {/* Continuous Awning with Spotlights */}
        <mesh position={[0, 3.02, 2.95]} castShadow receiveShadow material={trimMat}>
          <boxGeometry args={[10.8, 0.12, 0.9]} />
        </mesh>
        {hasSignboardLights &&
          [-4.5, -3.0, -1.5, 0, 1.5, 3.0, 4.5].map((x, idx) => (
            <mesh key={idx} position={[x, 2.95, 2.75]} material={signGlowMat}>
              <cylinderGeometry args={[0.04, 0.04, 0.02, 12]} />
            </mesh>
          ))}
      </group>

      {/* FLOOR 1 SEPARATOR SLAB (Y = 3.24) */}
      <mesh position={[0, 3.24 + 0.08, 0]} castShadow receiveShadow material={trimMat}>
        <boxGeometry args={[10.8, 0.16, 5.4]} />
      </mesh>

      {/* 3. FIRST FLOOR (LEVEL 2: Offices / Apartments, Y = 3.40 to 6.40) */}
      <group position={[0, 3.4, 0]}>
        <mesh position={[0, 1.5, 0]} castShadow receiveShadow material={wallMat}>
          <boxGeometry args={[10.4, 3.0, 5.2]} />
        </mesh>

        {/* Accent Horizontal Band */}
        <mesh position={[0, 1.5, 2.61]} castShadow receiveShadow material={accentMat}>
          <boxGeometry args={[10.4, 0.4, 0.04]} />
        </mesh>

        {/* Left Balcony */}
        <group position={[-3.3, 0, 2.61]}>
          <mesh position={[0, 0.08, 0.4]} castShadow receiveShadow material={trimMat}>
            <boxGeometry args={[2.5, 0.16, 0.8]} />
          </mesh>
          <group position={[0, 0.55, 0.78]}>
            <mesh position={[0, 0.4, 0]} material={darkFrameMat}>
              <boxGeometry args={[2.5, 0.04, 0.04]} />
            </mesh>
            {[-1.0, -0.5, 0, 0.5, 1.0].map((x, i) => (
              <mesh key={i} position={[x, 0, 0]} material={darkFrameMat}>
                <boxGeometry args={[0.02, 0.8, 0.02]} />
              </mesh>
            ))}
          </group>
          <group position={[0, 1.4, 0.02]}>
            <mesh castShadow material={darkFrameMat}>
              <boxGeometry args={[2.0, 2.2, 0.06]} />
            </mesh>
            <mesh position={[0, 0, 0.01]}>
              <planeGeometry args={[1.88, 2.08]} />
              <primitive object={glassMat} />
            </mesh>
          </group>
        </group>

        {/* Center Windows */}
        <group position={[0, 1.5, 2.62]}>
          <mesh castShadow material={darkFrameMat}>
            <boxGeometry args={[2.2, 1.4, 0.06]} />
          </mesh>
          <mesh position={[0, 0, 0.01]}>
            <planeGeometry args={[2.08, 1.28]} />
            <primitive object={glassMat} />
          </mesh>
          <mesh position={[0, 0.82, 0.22]} castShadow receiveShadow material={trimMat}>
            <boxGeometry args={[2.5, 0.08, 0.45]} />
          </mesh>
        </group>

        {/* Right Windows */}
        <group position={[3.3, 1.5, 2.62]}>
          <mesh castShadow material={darkFrameMat}>
            <boxGeometry args={[2.2, 1.4, 0.06]} />
          </mesh>
          <mesh position={[0, 0, 0.01]}>
            <planeGeometry args={[2.08, 1.28]} />
            <primitive object={glassMat} />
          </mesh>
          <mesh position={[0, 0.82, 0.22]} castShadow receiveShadow material={trimMat}>
            <boxGeometry args={[2.5, 0.08, 0.45]} />
          </mesh>
        </group>

        {/* AC Unit on 1st floor side */}
        {hasACUnits && (
          <ACUnit position={[-4.7, 1.8, 0.8]} rotation={[0, -Math.PI / 2, 0]} />
        )}
      </group>

      {/* FLOOR 2 SEPARATOR SLAB (Y = 6.40) */}
      <mesh position={[0, 6.40 + 0.08, 0]} castShadow receiveShadow material={trimMat}>
        <boxGeometry args={[10.8, 0.16, 5.4]} />
      </mesh>

      {/* 4. SECOND FLOOR (LEVEL 3: Upper Residences, Y = 6.56 to 9.56) */}
      <group position={[0, 6.56, 0]}>
        <mesh position={[0, 1.5, 0]} castShadow receiveShadow material={wallMat}>
          <boxGeometry args={[10.4, 3.0, 5.2]} />
        </mesh>

        {/* Accent Horizontal Band */}
        <mesh position={[0, 1.5, 2.61]} castShadow receiveShadow material={accentMat}>
          <boxGeometry args={[10.4, 0.4, 0.04]} />
        </mesh>

        {/* Left Windows */}
        <group position={[-3.3, 1.5, 2.62]}>
          <mesh castShadow material={darkFrameMat}>
            <boxGeometry args={[2.2, 1.4, 0.06]} />
          </mesh>
          <mesh position={[0, 0, 0.01]}>
            <planeGeometry args={[2.08, 1.28]} />
            <primitive object={glassMat} />
          </mesh>
          <mesh position={[0, 0.82, 0.22]} castShadow receiveShadow material={trimMat}>
            <boxGeometry args={[2.5, 0.08, 0.45]} />
          </mesh>
        </group>

        {/* Center Windows */}
        <group position={[0, 1.5, 2.62]}>
          <mesh castShadow material={darkFrameMat}>
            <boxGeometry args={[2.2, 1.4, 0.06]} />
          </mesh>
          <mesh position={[0, 0, 0.01]}>
            <planeGeometry args={[2.08, 1.28]} />
            <primitive object={glassMat} />
          </mesh>
          <mesh position={[0, 0.82, 0.22]} castShadow receiveShadow material={trimMat}>
            <boxGeometry args={[2.5, 0.08, 0.45]} />
          </mesh>
        </group>

        {/* Right Balcony */}
        <group position={[3.3, 0, 2.61]}>
          <mesh position={[0, 0.08, 0.4]} castShadow receiveShadow material={trimMat}>
            <boxGeometry args={[2.5, 0.16, 0.8]} />
          </mesh>
          <group position={[0, 0.55, 0.78]}>
            <mesh position={[0, 0.4, 0]} material={darkFrameMat}>
              <boxGeometry args={[2.5, 0.04, 0.04]} />
            </mesh>
            {[-1.0, -0.5, 0, 0.5, 1.0].map((x, i) => (
              <mesh key={i} position={[x, 0, 0]} material={darkFrameMat}>
                <boxGeometry args={[0.02, 0.8, 0.02]} />
              </mesh>
            ))}
          </group>
          <group position={[0, 1.4, 0.02]}>
            <mesh castShadow material={darkFrameMat}>
              <boxGeometry args={[2.0, 2.2, 0.06]} />
            </mesh>
            <mesh position={[0, 0, 0.01]}>
              <planeGeometry args={[1.88, 2.08]} />
              <primitive object={glassMat} />
            </mesh>
          </group>
        </group>

        {/* AC Unit on 2nd floor side */}
        {hasACUnits && (
          <ACUnit position={[4.7, 1.8, 0.8]} rotation={[0, Math.PI / 2, 0]} />
        )}
      </group>

      {/* 5. ROOFTOP SLAB (Y = 9.56 + 0.08 = 9.64) */}
      <mesh position={[0, 9.64, 0]} castShadow receiveShadow material={trimMat}>
        <boxGeometry args={[10.8, 0.16, 5.4]} />
      </mesh>

      {/* 6. ACCESSIBLE ROOFTOP TERRACE (Y = 9.72, 100% Flat & Open) */}
      <group position={[0, 9.72, 0]}>
        {/* Walkable Rooftop Terrace Floor */}
        <mesh position={[0, 0.01, 0]} receiveShadow>
          <boxGeometry args={[10.4, 0.02, 5.2]} />
          <meshStandardMaterial color="#cbd5e1" roughness={0.9} />
        </mesh>

        {/* Solid Parapet Walls with Coping Trims */}
        {/* Front */}
        <mesh position={[0, 0.425, 2.53]} castShadow receiveShadow material={wallMat}>
          <boxGeometry args={[10.4, 0.85, 0.14]} />
        </mesh>
        <mesh position={[0, 0.87, 2.53]} castShadow material={trimMat}>
          <boxGeometry args={[10.6, 0.06, 0.18]} />
        </mesh>

        {/* Left */}
        <mesh position={[-5.13, 0.425, 0]} castShadow receiveShadow material={wallMat}>
          <boxGeometry args={[0.14, 0.85, 5.2]} />
        </mesh>
        <mesh position={[-5.13, 0.87, 0]} castShadow material={trimMat}>
          <boxGeometry args={[0.18, 0.06, 5.3]} />
        </mesh>

        {/* Right */}
        <mesh position={[5.13, 0.425, 0]} castShadow receiveShadow material={wallMat}>
          <boxGeometry args={[0.14, 0.85, 5.2]} />
        </mesh>
        <mesh position={[5.13, 0.87, 0]} castShadow material={trimMat}>
          <boxGeometry args={[0.18, 0.06, 5.3]} />
        </mesh>

        {/* Back */}
        <mesh position={[0, 0.425, -2.53]} castShadow receiveShadow material={wallMat}>
          <boxGeometry args={[10.4, 0.85, 0.14]} />
        </mesh>
        <mesh position={[0, 0.87, -2.53]} castShadow material={trimMat}>
          <boxGeometry args={[10.6, 0.06, 0.18]} />
        </mesh>

        {/* Staircase Mumty Cabin (Back-Left) */}
        {hasMumtyCabin && (
          <group position={[-3.6, 0, -1.3]}>
            <mesh position={[0, 1.2, 0]} castShadow receiveShadow material={wallMat}>
              <boxGeometry args={[2.2, 2.4, 2.2]} />
            </mesh>
            <mesh position={[0, 2.45, 0]} castShadow receiveShadow material={trimMat}>
              <boxGeometry args={[2.4, 0.12, 2.4]} />
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

        {/* Triple Sintex Water Tanks (for 3-storey multi-unit complex) */}
        {hasWaterTanks && (
          <>
            <WaterTank
              position={hasMumtyCabin ? [-3.6, 2.51, -1.3] : [-3.6, 0, -1.3]}
              color="#0f172a"
              hasStand={true}
            />
            <WaterTank position={[-1.2, 0, -1.6]} color="#0284c7" hasStand={true} />
            <WaterTank position={[1.2, 0, -1.6]} color="#0f172a" hasStand={true} />
          </>
        )}

        {/* Satellite Dish Antennas */}
        {hasDishAntenna && (
          <>
            <DishAntenna position={[3.2, 0, -1.8]} rotation={[0, -0.5, 0]} scale={0.85} />
            <DishAntenna position={[4.5, 0, -1.8]} rotation={[0, -0.8, 0]} scale={0.85} />
          </>
        )}

        {/* Clothesline */}
        {hasClothesline && (
          <Clothesline position={[2.2, 0, 1.0]} />
        )}

        {/* Exposed Rebars on Column Points */}
        {hasRebars && (
          <group>
            {[
              [-5.0, 2.4],
              [0.0, 2.4],
              [5.0, 2.4],
              [5.0, -2.4],
              [0.0, -2.4],
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
      <group position={[1.5, 0.45, 3.2]}>
        <mesh castShadow>
          <sphereGeometry args={[0.04, 16, 16]} />
          <meshStandardMaterial color="#dc2626" roughness={0.35} />
        </mesh>
      </group>
    </group>
  );
};
