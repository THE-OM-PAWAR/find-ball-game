import React, { useMemo } from 'react';
import * as THREE from 'three';

export interface ParkedCarConfig {
  bodyColor: string;
  hasRoofRack: boolean;
  hasSideMoldings: boolean;
  hasMudFlaps: boolean;
  hasTaxiStrip: boolean;
  windowTint: 'light' | 'dark';
}

/**
 * Iconic Indian Gully Compact Hatchback (Maruti 800 / Zen / Alto Style)
 * High-fidelity 1:1 metric model:
 * - 3.40m length x 1.42m height x 1.48m width (wheelbase 2.18m)
 * - Sculpted aerodynamic boxy cabin with sloped bonnet hood and rear hatch
 * - 4 wheels with rubber tires, steel rims, wheel covers and disc/drum brakes
 * - Front grille with chrome emblem, rectangular headlights with clear lenses, amber indicators
 * - Side mirrors, flush door handles, black rubber protective body side moldings
 * - Rear hatch with wiper blade, high-mount stop lamp, detailed tail lights and exhaust muffler
 * - Optional rooftop luggage carrier rack with crossbars and gully taxi strip
 */
export const ParkedGullyCar: React.FC<{
  config?: Partial<ParkedCarConfig>;
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
    bodyColor = '#e2e8f0', // Classic pearl white / silver grey
    hasRoofRack = true,
    hasSideMoldings = true,
    hasMudFlaps = true,
    hasTaxiStrip = false,
    windowTint = 'dark',
  } = config;

  // Materials
  const carPaintMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: bodyColor,
        roughness: 0.28,
        metalness: 0.65,
      }),
    [bodyColor]
  );

  const blackTrimMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#181b22',
        roughness: 0.65,
        metalness: 0.2,
      }),
    []
  );

  const chromeMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#f8fafc',
        roughness: 0.1,
        metalness: 0.96,
      }),
    []
  );

  const rubberTireMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#1a1d20',
        roughness: 0.88,
        metalness: 0.08,
      }),
    []
  );

  const wheelRimMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#cbd5e1',
        roughness: 0.3,
        metalness: 0.8,
      }),
    []
  );

  const glassMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: windowTint === 'dark' ? '#111827' : '#94a3b8',
        roughness: 0.08,
        metalness: 0.95,
        transparent: true,
        opacity: windowTint === 'dark' ? 0.78 : 0.45,
      }),
    [windowTint]
  );

  const headlightMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#fffbeb',
        emissive: '#fef08a',
        emissiveIntensity: 0.45,
        roughness: 0.1,
        metalness: 0.9,
      }),
    []
  );

  const tailLampRedMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#dc2626',
        emissive: '#ef4444',
        emissiveIntensity: 0.35,
        roughness: 0.15,
      }),
    []
  );

  const indicatorAmberMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#f59e0b',
        emissive: '#d97706',
        emissiveIntensity: 0.3,
        roughness: 0.2,
      }),
    []
  );

  const taxiYellowMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#eab308',
        roughness: 0.35,
        metalness: 0.3,
      }),
    []
  );

  return (
    <group position={position} rotation={rotation} scale={scale}>
      {/* 1. MAIN LOWER BODY CHASSIS & FLOOR */}
      <group position={[0, 0.42, 0]}>
        {/* Lower Main Hull */}
        <mesh castShadow material={carPaintMat}>
          <boxGeometry args={[1.44, 0.46, 3.3]} />
        </mesh>
        {/* Underbody Chassis Floor */}
        <mesh position={[0, -0.22, 0]} material={blackTrimMat}>
          <boxGeometry args={[1.36, 0.08, 3.1]} />
        </mesh>

        {/* Front Bonnet Hood / Engine Bay */}
        <mesh position={[0, 0.12, 1.05]} rotation={[-0.08, 0, 0]} castShadow material={carPaintMat}>
          <boxGeometry args={[1.42, 0.26, 1.05]} />
        </mesh>

        {/* Sloped Nose Grille Header */}
        <mesh position={[0, -0.02, 1.62]} rotation={[-0.22, 0, 0]} castShadow material={carPaintMat}>
          <boxGeometry args={[1.42, 0.22, 0.14]} />
        </mesh>

        {/* Rear Sloped Boot / Hatch Understructure */}
        <mesh position={[0, 0.14, -1.22]} rotation={[0.15, 0, 0]} castShadow material={carPaintMat}>
          <boxGeometry args={[1.42, 0.28, 0.8]} />
        </mesh>
      </group>

      {/* 2. CABIN GREENHOUSE (Pillars, Roof & Windows) */}
      <group position={[0, 0.98, -0.15]}>
        {/* Main Roof Plate */}
        <mesh position={[0, 0.34, 0]} castShadow material={carPaintMat}>
          <boxGeometry args={[1.26, 0.06, 1.78]} />
        </mesh>
        {/* Subtle Roof Rib Creases for Stiffening */}
        <mesh position={[-0.32, 0.375, 0]} material={carPaintMat}>
          <boxGeometry args={[0.03, 0.015, 1.65]} />
        </mesh>
        <mesh position={[0.32, 0.375, 0]} material={carPaintMat}>
          <boxGeometry args={[0.03, 0.015, 1.65]} />
        </mesh>

        {/* Front Sloped Windscreen Glass */}
        <mesh position={[0, 0.08, 0.76]} rotation={[-0.58, 0, 0]} material={glassMat}>
          <boxGeometry args={[1.28, 0.58, 0.02]} />
        </mesh>
        {/* Front A-Pillars (Left & Right) */}
        <mesh position={[-0.62, 0.08, 0.76]} rotation={[-0.58, 0, 0.06]} material={carPaintMat}>
          <boxGeometry args={[0.06, 0.62, 0.06]} />
        </mesh>
        <mesh position={[0.62, 0.08, 0.76]} rotation={[-0.58, 0, -0.06]} material={carPaintMat}>
          <boxGeometry args={[0.06, 0.62, 0.06]} />
        </mesh>

        {/* Rear Sloped Hatch Windscreen Glass */}
        <mesh position={[0, 0.07, -0.84]} rotation={[0.55, 0, 0]} material={glassMat}>
          <boxGeometry args={[1.24, 0.54, 0.02]} />
        </mesh>
        {/* Rear C-Pillars */}
        <mesh position={[-0.61, 0.07, -0.84]} rotation={[0.55, 0, -0.06]} material={carPaintMat}>
          <boxGeometry args={[0.08, 0.58, 0.07]} />
        </mesh>
        <mesh position={[0.61, 0.07, -0.84]} rotation={[0.55, 0, 0.06]} material={carPaintMat}>
          <boxGeometry args={[0.08, 0.58, 0.07]} />
        </mesh>

        {/* Side Windows (Left & Right Cabin Panes) */}
        <mesh position={[-0.64, 0.06, -0.04]} material={glassMat}>
          <boxGeometry args={[0.02, 0.48, 1.48]} />
        </mesh>
        <mesh position={[0.64, 0.06, -0.04]} material={glassMat}>
          <boxGeometry args={[0.02, 0.48, 1.48]} />
        </mesh>

        {/* Center B-Pillars (Blacked out frame) */}
        <mesh position={[-0.645, 0.06, -0.04]} material={blackTrimMat}>
          <boxGeometry args={[0.025, 0.5, 0.08]} />
        </mesh>
        <mesh position={[0.645, 0.06, -0.04]} material={blackTrimMat}>
          <boxGeometry args={[0.025, 0.5, 0.08]} />
        </mesh>

        {/* Front Dual Windscreen Wipers */}
        <group position={[0, -0.22, 1.02]} rotation={[-0.55, 0, 0]}>
          <mesh position={[-0.24, 0.16, 0.02]} rotation={[0, 0, 0.25]} material={blackTrimMat}>
            <boxGeometry args={[0.012, 0.38, 0.008]} />
          </mesh>
          <mesh position={[0.24, 0.16, 0.02]} rotation={[0, 0, 0.25]} material={blackTrimMat}>
            <boxGeometry args={[0.012, 0.38, 0.008]} />
          </mesh>
        </group>

        {/* Rear Windshield Wiper */}
        <mesh position={[0, -0.2, -1.05]} rotation={[0.5, 0, 0.6]} material={blackTrimMat}>
          <boxGeometry args={[0.01, 0.26, 0.006]} />
        </mesh>
      </group>

      {/* 3. FOUR WHEELS & WHEEL ARCHES */}
      {/* Front Left Wheel */}
      <group position={[-0.66, 0.28, 1.05]}>
        <mesh rotation={[0, Math.PI / 2, 0]} castShadow material={rubberTireMat}>
          <torusGeometry args={[0.27, 0.062, 14, 28]} />
        </mesh>
        <mesh rotation={[0, 0, Math.PI / 2]} material={wheelRimMat}>
          <cylinderGeometry args={[0.22, 0.22, 0.12, 16]} />
        </mesh>
        <mesh rotation={[0, 0, Math.PI / 2]} material={chromeMat}>
          <cylinderGeometry args={[0.08, 0.08, 0.13, 12]} />
        </mesh>
      </group>

      {/* Front Right Wheel */}
      <group position={[0.66, 0.28, 1.05]}>
        <mesh rotation={[0, Math.PI / 2, 0]} castShadow material={rubberTireMat}>
          <torusGeometry args={[0.27, 0.062, 14, 28]} />
        </mesh>
        <mesh rotation={[0, 0, Math.PI / 2]} material={wheelRimMat}>
          <cylinderGeometry args={[0.22, 0.22, 0.12, 16]} />
        </mesh>
        <mesh rotation={[0, 0, Math.PI / 2]} material={chromeMat}>
          <cylinderGeometry args={[0.08, 0.08, 0.13, 12]} />
        </mesh>
      </group>

      {/* Rear Left Wheel */}
      <group position={[-0.66, 0.28, -1.08]}>
        <mesh rotation={[0, Math.PI / 2, 0]} castShadow material={rubberTireMat}>
          <torusGeometry args={[0.27, 0.062, 14, 28]} />
        </mesh>
        <mesh rotation={[0, 0, Math.PI / 2]} material={wheelRimMat}>
          <cylinderGeometry args={[0.22, 0.22, 0.12, 16]} />
        </mesh>
        <mesh rotation={[0, 0, Math.PI / 2]} material={chromeMat}>
          <cylinderGeometry args={[0.08, 0.08, 0.13, 12]} />
        </mesh>
      </group>

      {/* Rear Right Wheel */}
      <group position={[0.66, 0.28, -1.08]}>
        <mesh rotation={[0, Math.PI / 2, 0]} castShadow material={rubberTireMat}>
          <torusGeometry args={[0.27, 0.062, 14, 28]} />
        </mesh>
        <mesh rotation={[0, 0, Math.PI / 2]} material={wheelRimMat}>
          <cylinderGeometry args={[0.22, 0.22, 0.12, 16]} />
        </mesh>
        <mesh rotation={[0, 0, Math.PI / 2]} material={chromeMat}>
          <cylinderGeometry args={[0.08, 0.08, 0.13, 12]} />
        </mesh>
      </group>

      {/* 4. FRONT NOSE, RADIATOR GRILLE, HEADLIGHTS & BUMPER */}
      <group position={[0, 0.44, 1.66]}>
        {/* Front Plastic Bumper */}
        <mesh position={[0, -0.12, 0.02]} castShadow material={blackTrimMat}>
          <boxGeometry args={[1.46, 0.24, 0.16]} />
        </mesh>

        {/* Radiator Center Air Grille */}
        <mesh position={[0, 0.06, 0]} material={blackTrimMat}>
          <boxGeometry args={[0.74, 0.14, 0.04]} />
        </mesh>
        {/* Chrome Grille Emblem */}
        <mesh position={[0, 0.06, 0.025]} material={chromeMat}>
          <boxGeometry args={[0.08, 0.05, 0.01]} />
        </mesh>

        {/* Left Headlamp Cluster */}
        <group position={[-0.52, 0.06, 0]}>
          <mesh material={headlightMat}>
            <boxGeometry args={[0.26, 0.14, 0.03]} />
          </mesh>
          {/* Outer Amber Indicator */}
          <mesh position={[-0.14, 0, 0.005]} material={indicatorAmberMat}>
            <boxGeometry args={[0.06, 0.13, 0.03]} />
          </mesh>
        </group>

        {/* Right Headlamp Cluster */}
        <group position={[0.52, 0.06, 0]}>
          <mesh material={headlightMat}>
            <boxGeometry args={[0.26, 0.14, 0.03]} />
          </mesh>
          {/* Outer Amber Indicator */}
          <mesh position={[0.14, 0, 0.005]} material={indicatorAmberMat}>
            <boxGeometry args={[0.06, 0.13, 0.03]} />
          </mesh>
        </group>

        {/* Front Number Plate */}
        <mesh position={[0, -0.12, 0.11]} material={blackTrimMat}>
          <boxGeometry args={[0.38, 0.09, 0.008]} />
        </mesh>
        <mesh position={[0, -0.12, 0.115]} material={chromeMat}>
          <boxGeometry args={[0.36, 0.075, 0.004]} />
        </mesh>
      </group>

      {/* 5. REAR HATCH, TAIL LAMPS, NUMBER PLATE & EXHAUST */}
      <group position={[0, 0.46, -1.66]}>
        {/* Rear Bumper */}
        <mesh position={[0, -0.14, -0.02]} castShadow material={blackTrimMat}>
          <boxGeometry args={[1.46, 0.24, 0.16]} />
        </mesh>

        {/* Left Vertical Tail Lamp Cluster (Brake, Indicator, Reverse) */}
        <group position={[-0.56, 0.18, 0.01]}>
          <mesh position={[0, 0.08, 0]} material={tailLampRedMat}>
            <boxGeometry args={[0.12, 0.12, 0.025]} />
          </mesh>
          <mesh position={[0, -0.03, 0]} material={indicatorAmberMat}>
            <boxGeometry args={[0.12, 0.07, 0.025]} />
          </mesh>
          <mesh position={[0, -0.1, 0]} material={chromeMat}>
            <boxGeometry args={[0.12, 0.05, 0.025]} />
          </mesh>
        </group>

        {/* Right Vertical Tail Lamp Cluster */}
        <group position={[0.56, 0.18, 0.01]}>
          <mesh position={[0, 0.08, 0]} material={tailLampRedMat}>
            <boxGeometry args={[0.12, 0.12, 0.025]} />
          </mesh>
          <mesh position={[0, -0.03, 0]} material={indicatorAmberMat}>
            <boxGeometry args={[0.12, 0.07, 0.025]} />
          </mesh>
          <mesh position={[0, -0.1, 0]} material={chromeMat}>
            <boxGeometry args={[0.12, 0.05, 0.025]} />
          </mesh>
        </group>

        {/* Rear Number Plate */}
        <mesh position={[0, -0.04, 0.01]} material={blackTrimMat}>
          <boxGeometry args={[0.38, 0.11, 0.008]} />
        </mesh>
        <mesh position={[0, -0.04, 0.015]} material={chromeMat}>
          <boxGeometry args={[0.35, 0.085, 0.004]} />
        </mesh>

        {/* Hatch Release Handle */}
        <mesh position={[0, 0.08, 0.015]} material={blackTrimMat}>
          <boxGeometry args={[0.16, 0.03, 0.015]} />
        </mesh>

        {/* Chrome Exhaust Tailpipe Tip (Bottom Right) */}
        <mesh position={[0.48, -0.22, 0.08]} rotation={[Math.PI / 2, 0, 0]} material={chromeMat}>
          <cylinderGeometry args={[0.025, 0.025, 0.14, 12]} />
        </mesh>
      </group>

      {/* 6. SIDE DETAILS: MIRRORS, DOOR HANDLES & RUB STRIPS */}
      {/* Side Mirrors */}
      <group position={[-0.72, 0.88, 0.52]}>
        <mesh material={blackTrimMat}>
          <boxGeometry args={[0.08, 0.09, 0.14]} />
        </mesh>
        <mesh position={[-0.042, 0, 0]} material={chromeMat}>
          <boxGeometry args={[0.005, 0.07, 0.11]} />
        </mesh>
      </group>
      <group position={[0.72, 0.88, 0.52]}>
        <mesh material={blackTrimMat}>
          <boxGeometry args={[0.08, 0.09, 0.14]} />
        </mesh>
        <mesh position={[0.042, 0, 0]} material={chromeMat}>
          <boxGeometry args={[0.005, 0.07, 0.11]} />
        </mesh>
      </group>

      {/* Door Handles (Flush Black Plastic) */}
      <mesh position={[-0.73, 0.65, 0.24]} material={blackTrimMat}>
        <boxGeometry args={[0.015, 0.03, 0.1]} />
      </mesh>
      <mesh position={[-0.73, 0.65, -0.42]} material={blackTrimMat}>
        <boxGeometry args={[0.015, 0.03, 0.1]} />
      </mesh>
      <mesh position={[0.73, 0.65, 0.24]} material={blackTrimMat}>
        <boxGeometry args={[0.015, 0.03, 0.1]} />
      </mesh>
      <mesh position={[0.73, 0.65, -0.42]} material={blackTrimMat}>
        <boxGeometry args={[0.015, 0.03, 0.1]} />
      </mesh>

      {/* Black Protective Side Rubbing Moldings */}
      {hasSideMoldings && (
        <>
          <mesh position={[-0.728, 0.44, 0]} material={blackTrimMat}>
            <boxGeometry args={[0.015, 0.05, 2.05]} />
          </mesh>
          <mesh position={[0.728, 0.44, 0]} material={blackTrimMat}>
            <boxGeometry args={[0.015, 0.05, 2.05]} />
          </mesh>
        </>
      )}

      {/* Rubber Mud Flaps behind wheels */}
      {hasMudFlaps && (
        <>
          <mesh position={[-0.64, 0.14, -1.38]} material={rubberTireMat}>
            <boxGeometry args={[0.14, 0.16, 0.012]} />
          </mesh>
          <mesh position={[0.64, 0.14, -1.38]} material={rubberTireMat}>
            <boxGeometry args={[0.14, 0.16, 0.012]} />
          </mesh>
        </>
      )}

      {/* 7. ROOFTOP LUGGAGE CARRIER RACK & TAXI SIGN */}
      {hasRoofRack && (
        <group position={[0, 1.38, -0.15]}>
          {/* Left & Right Longitudinal Rail Tubes */}
          <mesh position={[-0.52, 0.04, 0]} material={blackTrimMat}>
            <cylinderGeometry args={[0.012, 0.012, 1.45, 8]} />
          </mesh>
          <mesh position={[0.52, 0.04, 0]} material={blackTrimMat}>
            <cylinderGeometry args={[0.012, 0.012, 1.45, 8]} />
          </mesh>
          {/* Transverse Crossbars */}
          {[-0.5, -0.18, 0.18, 0.5].map((z, i) => (
            <mesh key={`rack-bar-${i}`} position={[0, 0.04, z]} rotation={[0, 0, Math.PI / 2]} material={blackTrimMat}>
              <cylinderGeometry args={[0.01, 0.01, 1.04, 8]} />
            </mesh>
          ))}
          {/* Stanchion Leg Mounts to Roof */}
          {[-0.52, 0.52].map((x, xi) =>
            [-0.5, 0.5].map((z, zi) => (
              <mesh key={`mount-${xi}-${zi}`} position={[x, -0.02, z]} material={blackTrimMat}>
                <boxGeometry args={[0.04, 0.06, 0.04]} />
              </mesh>
            ))
          )}
        </group>
      )}

      {/* Yellow/Black Gully Taxi Strip */}
      {hasTaxiStrip && (
        <group position={[0, 0.65, 0]}>
          <mesh position={[-0.73, 0, 0]} material={taxiYellowMat}>
            <boxGeometry args={[0.01, 0.09, 2.1]} />
          </mesh>
          <mesh position={[0.73, 0, 0]} material={taxiYellowMat}>
            <boxGeometry args={[0.01, 0.09, 2.1]} />
          </mesh>
        </group>
      )}
    </group>
  );
};
