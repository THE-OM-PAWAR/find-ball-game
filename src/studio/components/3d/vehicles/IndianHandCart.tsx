import React, { useMemo } from 'react';
import * as THREE from 'three';

export interface HandCartConfig {
  hasCargoSacks: boolean;
  hasCrates: boolean;
  hasRopeLashing: boolean;
  hasIronCornerBrackets: boolean;
  woodTone: 'aged' | 'raw';
}

/**
 * Heavy-Duty Indian 2-Wheeled Cargo Handcart (Rehra / Haath-Thela)
 * High-fidelity 1:1 metric model:
 * - 2.40m overall length (with pull shafts) x 0.85m height x 1.20m width
 * - 2 massive heavy-duty spoked cart wheels (0.80m diameter) with thick iron hubs
 * - Heavy timber load platform with forged iron corner L-plates and tie-down rings
 * - Long forward pulling handles with crossbar and front parking support leg
 * - Authentic cargo load: stacked jute hessian grain/flour sacks with rope lashing and wooden crates
 */
export const IndianHandCart: React.FC<{
  config?: Partial<HandCartConfig>;
  position?: [number, number, number];
  rotation?: [number, number, number];
  scale?: number;
}> = ({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = 1,
  config = {},
}) => {
  const {
    hasCargoSacks = true,
    hasCrates = true,
    hasRopeLashing = true,
    hasIronCornerBrackets = true,
    woodTone = 'aged',
  } = config;

  // Materials
  const timberDeckMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: woodTone === 'aged' ? '#5c4d3c' : '#7f5539',
        roughness: 0.9,
        metalness: 0.05,
      }),
    [woodTone]
  );

  const timberHandleMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: woodTone === 'aged' ? '#786452' : '#9c6644',
        roughness: 0.85,
        metalness: 0.05,
      }),
    [woodTone]
  );

  const forgedIronMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#1f2428',
        roughness: 0.68,
        metalness: 0.88,
      }),
    []
  );

  const wheelRimMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#2d333b',
        roughness: 0.75,
        metalness: 0.75,
      }),
    []
  );

  const spokeSteelMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#94a3b8',
        roughness: 0.35,
        metalness: 0.85,
      }),
    []
  );

  const juteSackMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#b08968',
        roughness: 0.96,
        metalness: 0.02,
      }),
    []
  );

  const juteSackDarkMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#9c6644',
        roughness: 0.95,
        metalness: 0.02,
      }),
    []
  );

  const cargoRopeMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#ddb892',
        roughness: 0.92,
        metalness: 0.05,
      }),
    []
  );

  const crateWoodMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#b07d62',
        roughness: 0.86,
        metalness: 0.06,
      }),
    []
  );

  return (
    <group position={position} rotation={rotation} scale={scale}>
      {/* 1. SOLID AXLE & 2 LARGE HEAVY-DUTY WHEELS */}
      <group position={[0, 0.4, -0.15]}>
        {/* Heavy Square Iron Axle Beam */}
        <mesh rotation={[0, 0, Math.PI / 2]} material={forgedIronMat}>
          <boxGeometry args={[0.07, 0.07, 1.28]} />
        </mesh>
        {/* Axle Pillow Blocks / Bolted Clamps */}
        <mesh position={[-0.45, 0.04, 0]} material={forgedIronMat}>
          <boxGeometry args={[0.09, 0.05, 0.12]} />
        </mesh>
        <mesh position={[0.45, 0.04, 0]} material={forgedIronMat}>
          <boxGeometry args={[0.09, 0.05, 0.12]} />
        </mesh>

        {/* Left Wheel (0.80m Diameter) */}
        <group position={[-0.58, 0, 0]}>
          {/* Outer Iron Band Tire */}
          <mesh rotation={[0, Math.PI / 2, 0]} castShadow material={wheelRimMat}>
            <torusGeometry args={[0.39, 0.026, 14, 32]} />
          </mesh>
          {/* Inner Wooden Felly / Rim */}
          <mesh rotation={[0, Math.PI / 2, 0]} material={timberDeckMat}>
            <torusGeometry args={[0.36, 0.022, 10, 32]} />
          </mesh>
          {/* Massive Iron Hub with Grease Cap */}
          <mesh rotation={[0, 0, Math.PI / 2]} castShadow material={forgedIronMat}>
            <cylinderGeometry args={[0.07, 0.07, 0.14, 16]} />
          </mesh>
          {/* 12 Heavy Cross Spokes */}
          {[0, 30, 60, 90, 120, 150].map((deg, i) => (
            <mesh
              key={`l-spoke-${i}`}
              rotation={[THREE.MathUtils.degToRad(deg), 0, 0]}
              material={spokeSteelMat}
            >
              <cylinderGeometry args={[0.005, 0.005, 0.72, 6]} />
            </mesh>
          ))}
        </group>

        {/* Right Wheel (0.80m Diameter) */}
        <group position={[0.58, 0, 0]}>
          {/* Outer Iron Band Tire */}
          <mesh rotation={[0, Math.PI / 2, 0]} castShadow material={wheelRimMat}>
            <torusGeometry args={[0.39, 0.026, 14, 32]} />
          </mesh>
          {/* Inner Wooden Felly */}
          <mesh rotation={[0, Math.PI / 2, 0]} material={timberDeckMat}>
            <torusGeometry args={[0.36, 0.022, 10, 32]} />
          </mesh>
          {/* Massive Iron Hub */}
          <mesh rotation={[0, 0, Math.PI / 2]} castShadow material={forgedIronMat}>
            <cylinderGeometry args={[0.07, 0.07, 0.14, 16]} />
          </mesh>
          {/* Spokes */}
          {[0, 30, 60, 90, 120, 150].map((deg, i) => (
            <mesh
              key={`r-spoke-${i}`}
              rotation={[THREE.MathUtils.degToRad(deg), 0, 0]}
              material={spokeSteelMat}
            >
              <cylinderGeometry args={[0.005, 0.005, 0.72, 6]} />
            </mesh>
          ))}
        </group>
      </group>

      {/* 2. HEAVY TIMBER LOAD DECK & CHASSIS FRAME */}
      <group position={[0, 0.48, -0.2]}>
        {/* Main Solid Timber Deck Platform */}
        <mesh position={[0, 0, 0]} castShadow receiveShadow material={timberDeckMat}>
          <boxGeometry args={[1.04, 0.065, 1.68]} />
        </mesh>

        {/* Longitudinal Heavy Timber Beams under deck */}
        <mesh position={[-0.44, -0.06, 0]} material={timberDeckMat}>
          <boxGeometry args={[0.08, 0.08, 1.68]} />
        </mesh>
        <mesh position={[0.44, -0.06, 0]} material={timberDeckMat}>
          <boxGeometry args={[0.08, 0.08, 1.68]} />
        </mesh>

        {/* Raised Side Guard Rails / Retaining Planks */}
        <mesh position={[-0.5, 0.08, 0]} material={timberDeckMat}>
          <boxGeometry args={[0.04, 0.12, 1.68]} />
        </mesh>
        <mesh position={[0.5, 0.08, 0]} material={timberDeckMat}>
          <boxGeometry args={[0.04, 0.12, 1.68]} />
        </mesh>
        {/* Rear Guard Rail */}
        <mesh position={[0, 0.08, -0.82]} material={timberDeckMat}>
          <boxGeometry args={[1.04, 0.12, 0.04]} />
        </mesh>

        {/* Forged Iron Corner L-Brackets & Reinforcing Plates */}
        {hasIronCornerBrackets && (
          <>
            {[-0.51, 0.51].map((x, xi) =>
              [-0.83, 0.83].map((z, zi) => (
                <mesh key={`bracket-${xi}-${zi}`} position={[x, 0.05, z]} material={forgedIronMat}>
                  <boxGeometry args={[0.03, 0.15, 0.08]} />
                </mesh>
              ))
            )}
            {/* Forged Tie-down Rings on sides */}
            {[-0.52, 0.52].map((x, xi) =>
              [-0.4, 0.4].map((z, zi) => (
                <mesh key={`ring-${xi}-${zi}`} position={[x, 0.04, z]} rotation={[0, 0, Math.PI / 2]} material={forgedIronMat}>
                  <torusGeometry args={[0.024, 0.005, 8, 12]} />
                </mesh>
              ))
            )}
          </>
        )}
      </group>

      {/* 3. FORWARD PULLING SHAFTS (HANDLES) & RESTING LEG */}
      <group position={[0, 0.46, 0.65]}>
        {/* Left Long Wooden Tapered Pull Shaft */}
        <mesh position={[-0.42, 0, 0.46]} rotation={[0.02, 0.06, 0]} material={timberHandleMat}>
          <boxGeometry args={[0.06, 0.065, 1.15]} />
        </mesh>
        {/* Right Long Wooden Tapered Pull Shaft */}
        <mesh position={[0.42, 0, 0.46]} rotation={[0.02, -0.06, 0]} material={timberHandleMat}>
          <boxGeometry args={[0.06, 0.065, 1.15]} />
        </mesh>

        {/* Front Wooden Grip Crossbar */}
        <mesh position={[0, 0.01, 1.02]} rotation={[0, 0, Math.PI / 2]} material={timberHandleMat}>
          <cylinderGeometry args={[0.022, 0.022, 0.88, 12]} />
        </mesh>

        {/* Front Folding Parking Support Leg (rests cart on ground) */}
        <group position={[0, -0.22, 0.35]}>
          <mesh rotation={[0.15, 0, 0]} material={forgedIronMat}>
            <cylinderGeometry args={[0.014, 0.014, 0.44, 8]} />
          </mesh>
          <mesh position={[0, -0.22, 0.04]} material={forgedIronMat}>
            <boxGeometry args={[0.18, 0.02, 0.08]} />
          </mesh>
        </group>
      </group>

      {/* 4. CARGO LOAD: STACKED BURLAP GRAIN SACKS & WOODEN CRATES */}
      <group position={[0, 0.54, -0.2]}>
        {/* Layer 1: Bottom Sacks */}
        {hasCargoSacks && (
          <>
            <mesh position={[-0.24, 0.1, -0.42]} rotation={[0, 0.05, 0]} castShadow material={juteSackMat}>
              <boxGeometry args={[0.44, 0.22, 0.62]} />
            </mesh>
            <mesh position={[0.24, 0.1, -0.42]} rotation={[0, -0.05, 0]} castShadow material={juteSackDarkMat}>
              <boxGeometry args={[0.44, 0.22, 0.62]} />
            </mesh>
            <mesh position={[-0.24, 0.1, 0.24]} rotation={[0, -0.03, 0]} castShadow material={juteSackDarkMat}>
              <boxGeometry args={[0.44, 0.22, 0.62]} />
            </mesh>

            {/* Layer 2: Upper Stacking Sacks */}
            <mesh position={[0, 0.3, -0.38]} rotation={[0, 0.08, 0]} castShadow material={juteSackMat}>
              <boxGeometry args={[0.52, 0.22, 0.68]} />
            </mesh>
            <mesh position={[-0.12, 0.3, 0.2]} rotation={[0, -0.06, 0]} castShadow material={juteSackMat}>
              <boxGeometry args={[0.46, 0.2, 0.58]} />
            </mesh>
          </>
        )}

        {/* Cargo Wooden Shipping Crates */}
        {hasCrates && (
          <group position={[0.24, 0.12, 0.26]}>
            <mesh castShadow material={crateWoodMat}>
              <boxGeometry args={[0.42, 0.24, 0.48]} />
            </mesh>
            {/* Iron corner straps on crate */}
            <mesh position={[0, 0, 0]} material={forgedIronMat}>
              <boxGeometry args={[0.43, 0.02, 0.49]} />
            </mesh>
          </group>
        )}

        {/* Criss-Cross Cargo Natural Jute Lashing Rope */}
        {hasRopeLashing && (
          <group>
            {/* Diagonal Ropes over sacks */}
            <mesh position={[0, 0.42, -0.1]} rotation={[0.4, 0.2, 0]} material={cargoRopeMat}>
              <cylinderGeometry args={[0.005, 0.005, 1.25, 6]} />
            </mesh>
            <mesh position={[0, 0.42, -0.1]} rotation={[-0.4, -0.2, 0]} material={cargoRopeMat}>
              <cylinderGeometry args={[0.005, 0.005, 1.25, 6]} />
            </mesh>
            {/* Cross tie rope */}
            <mesh position={[0, 0.42, -0.38]} rotation={[0, 0, Math.PI / 2]} material={cargoRopeMat}>
              <cylinderGeometry args={[0.005, 0.005, 0.94, 6]} />
            </mesh>
          </group>
        )}
      </group>
    </group>
  );
};
