import React, { useMemo } from 'react';
import * as THREE from 'three';

export interface MotorcycleConfig {
  tankColor: string;
  seatColor: string;
  hasCrashGuard: boolean;
  hasSareeGuard: boolean;
  hasMirrors: boolean;
  hasLuggageCarrier: boolean;
}

/**
 * Iconic Indian Classic Roadster Motorcycle (Royal Enfield / Commuter Style)
 * High-fidelity 1:1 metric model:
 * - 2.05m length x 1.08m height x 0.76m width
 * - Spoked 19-inch wheels with detailed hubs and brake discs
 * - Finned air-cooled engine block, crankcase, spark plug & swept chrome bottle silencer
 * - Teardrop fuel tank with rubber knee pads and chrome cap
 * - Double-cradle steel frame, front telescopic fork with rubber gaiters, dual rear coil shocks
 * - Roadster handlebar with chrome dome headlamp, amber bullet indicators & speedometer console
 * - Dual ribbed leatherette seat, saree guard, engine crash guard & center parking stand
 */
export const IndianMotorcycle: React.FC<{
  config?: Partial<MotorcycleConfig>;
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
    tankColor = '#1e293b', // Classic stealth black / deep slate
    seatColor = '#3e2723', // Rich brown stitched leather
    hasCrashGuard = true,
    hasSareeGuard = true,
    hasMirrors = true,
    hasLuggageCarrier = true,
  } = config;

  // Materials
  const tankPaintMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: tankColor,
        roughness: 0.25,
        metalness: 0.65,
      }),
    [tankColor]
  );

  const chromeMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#f8fafc',
        roughness: 0.1,
        metalness: 0.98,
      }),
    []
  );

  const engineCastMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#64748b',
        roughness: 0.45,
        metalness: 0.75,
      }),
    []
  );

  const frameBlackMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#111827',
        roughness: 0.5,
        metalness: 0.5,
      }),
    []
  );

  const rubberMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#181a1b',
        roughness: 0.88,
        metalness: 0.08,
      }),
    []
  );

  const seatLeatherMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: seatColor,
        roughness: 0.72,
        metalness: 0.12,
      }),
    [seatColor]
  );

  const headlampGlassMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#fffbeb',
        emissive: '#fef08a',
        emissiveIntensity: 0.45,
        roughness: 0.15,
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
        roughness: 0.2,
      }),
    []
  );

  const indicatorAmberMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#f59e0b',
        emissive: '#d97706',
        emissiveIntensity: 0.25,
        roughness: 0.2,
      }),
    []
  );

  const goldAccentMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#eab308',
        roughness: 0.3,
        metalness: 0.85,
      }),
    []
  );

  return (
    <group position={position} rotation={rotation} scale={scale}>
      {/* 1. CENTER STAND (holds bike stable on tarmac) */}
      <group position={[0, 0.14, -0.05]}>
        <mesh position={[-0.12, -0.07, 0]} rotation={[0, 0, 0.12]} castShadow material={frameBlackMat}>
          <cylinderGeometry args={[0.012, 0.012, 0.22, 8]} />
        </mesh>
        <mesh position={[0.12, -0.07, 0]} rotation={[0, 0, -0.12]} castShadow material={frameBlackMat}>
          <cylinderGeometry args={[0.012, 0.012, 0.22, 8]} />
        </mesh>
        <mesh position={[0, -0.02, 0]} rotation={[0, 0, Math.PI / 2]} material={frameBlackMat}>
          <cylinderGeometry args={[0.012, 0.012, 0.26, 8]} />
        </mesh>
      </group>

      {/* 2. MAIN CRADLE FRAME (Black Tubular Steel) */}
      <group>
        {/* Backbone spine under tank */}
        <mesh position={[0, 0.65, 0.05]} rotation={[0.2, 0, 0]} castShadow material={frameBlackMat}>
          <cylinderGeometry args={[0.022, 0.022, 0.65, 10]} />
        </mesh>
        {/* Down tubes wrapping around engine */}
        <mesh position={[-0.07, 0.44, 0.25]} rotation={[-0.35, 0, 0]} castShadow material={frameBlackMat}>
          <cylinderGeometry args={[0.016, 0.016, 0.48, 8]} />
        </mesh>
        <mesh position={[0.07, 0.44, 0.25]} rotation={[-0.35, 0, 0]} castShadow material={frameBlackMat}>
          <cylinderGeometry args={[0.016, 0.016, 0.48, 8]} />
        </mesh>
        {/* Lower cradle cradle rails under engine */}
        <mesh position={[-0.07, 0.22, 0.02]} rotation={[Math.PI / 2, 0, 0]} castShadow material={frameBlackMat}>
          <cylinderGeometry args={[0.015, 0.015, 0.46, 8]} />
        </mesh>
        <mesh position={[0.07, 0.22, 0.02]} rotation={[Math.PI / 2, 0, 0]} castShadow material={frameBlackMat}>
          <cylinderGeometry args={[0.015, 0.015, 0.46, 8]} />
        </mesh>
        {/* Rear swingarm pivot plate */}
        <mesh position={[0, 0.32, -0.22]} castShadow material={frameBlackMat}>
          <boxGeometry args={[0.18, 0.22, 0.08]} />
        </mesh>
        {/* Rear Swingarm to axle */}
        <mesh position={[-0.09, 0.3, -0.45]} rotation={[-0.08, 0, 0]} castShadow material={frameBlackMat}>
          <boxGeometry args={[0.025, 0.045, 0.44]} />
        </mesh>
        <mesh position={[0.09, 0.3, -0.45]} rotation={[-0.08, 0, 0]} castShadow material={frameBlackMat}>
          <boxGeometry args={[0.025, 0.045, 0.44]} />
        </mesh>
        {/* Rear subframe under seat */}
        <mesh position={[-0.09, 0.62, -0.42]} rotation={[-0.15, 0, 0]} castShadow material={frameBlackMat}>
          <cylinderGeometry args={[0.014, 0.014, 0.52, 8]} />
        </mesh>
        <mesh position={[0.09, 0.62, -0.42]} rotation={[-0.15, 0, 0]} castShadow material={frameBlackMat}>
          <cylinderGeometry args={[0.014, 0.014, 0.52, 8]} />
        </mesh>
      </group>

      {/* 3. FRONT WHEEL & SUSPENSION ASSEMBLY */}
      <group position={[0, 0.31, 0.72]}>
        {/* Front Tire (19" rim with thick vintage tread profile) */}
        <mesh rotation={[0, Math.PI / 2, 0]} castShadow material={rubberMat}>
          <torusGeometry args={[0.31, 0.052, 16, 32]} />
        </mesh>
        {/* Chrome Wheel Rim */}
        <mesh rotation={[0, Math.PI / 2, 0]} material={chromeMat}>
          <torusGeometry args={[0.26, 0.022, 12, 32]} />
        </mesh>
        {/* Central Wheel Hub */}
        <mesh rotation={[0, 0, Math.PI / 2]} castShadow material={chromeMat}>
          <cylinderGeometry args={[0.065, 0.065, 0.11, 16]} />
        </mesh>
        {/* Front Brake Disc & Caliper */}
        <mesh position={[0.045, 0, 0]} rotation={[0, 0, Math.PI / 2]} material={chromeMat}>
          <cylinderGeometry args={[0.13, 0.13, 0.008, 18]} />
        </mesh>
        <mesh position={[0.05, 0.1, 0]} material={darkPlastic('black')}>
          <boxGeometry args={[0.035, 0.065, 0.045]} />
        </mesh>
        {/* Wire Spokes Cross Pattern */}
        {[0, 30, 60, 90, 120, 150].map((deg, i) => (
          <mesh
            key={`f-spoke-${i}`}
            rotation={[THREE.MathUtils.degToRad(deg), 0, 0]}
            material={chromeMat}
          >
            <cylinderGeometry args={[0.002, 0.002, 0.52, 4]} />
          </mesh>
        ))}

        {/* Front Mudguard / Fender (Curved metal with stays) */}
        <group position={[0, 0.02, 0]}>
          <mesh position={[0, 0.22, 0.02]} rotation={[0.25, 0, 0]} castShadow material={tankPaintMat}>
            <cylinderGeometry
              args={[0.34, 0.34, 0.11, 16, 1, true, -Math.PI * 0.42, Math.PI * 0.85]}
            />
          </mesh>
          {/* Chrome Fender stays */}
          <mesh position={[-0.065, 0.12, 0.12]} rotation={[0.4, 0, 0]} material={chromeMat}>
            <cylinderGeometry args={[0.005, 0.005, 0.26, 6]} />
          </mesh>
          <mesh position={[0.065, 0.12, 0.12]} rotation={[0.4, 0, 0]} material={chromeMat}>
            <cylinderGeometry args={[0.005, 0.005, 0.26, 6]} />
          </mesh>
        </group>
      </group>

      {/* Telescopic Front Forks with Rubber Gaiters */}
      <group position={[0, 0.58, 0.62]} rotation={[-0.32, 0, 0]}>
        {/* Left Fork Tube */}
        <mesh position={[-0.09, -0.05, 0]} castShadow material={chromeMat}>
          <cylinderGeometry args={[0.02, 0.02, 0.48, 12]} />
        </mesh>
        {/* Right Fork Tube */}
        <mesh position={[0.09, -0.05, 0]} castShadow material={chromeMat}>
          <cylinderGeometry args={[0.02, 0.02, 0.48, 12]} />
        </mesh>
        {/* Rubber Accordion Gaiters (Bellows) */}
        <mesh position={[-0.09, -0.15, 0]} material={rubberMat}>
          <cylinderGeometry args={[0.028, 0.028, 0.18, 12]} />
        </mesh>
        <mesh position={[0.09, -0.15, 0]} material={rubberMat}>
          <cylinderGeometry args={[0.028, 0.028, 0.18, 12]} />
        </mesh>
        {/* Lower Slider Stanchions */}
        <mesh position={[-0.09, -0.32, 0]} material={engineCastMat}>
          <cylinderGeometry args={[0.026, 0.026, 0.22, 12]} />
        </mesh>
        <mesh position={[0.09, -0.32, 0]} material={engineCastMat}>
          <cylinderGeometry args={[0.026, 0.026, 0.22, 12]} />
        </mesh>
        {/* Triple Tree Clamps (Upper & Lower Yoke) */}
        <mesh position={[0, 0.18, 0]} material={engineCastMat}>
          <boxGeometry args={[0.24, 0.035, 0.07]} />
        </mesh>
        <mesh position={[0, 0.02, 0]} material={engineCastMat}>
          <boxGeometry args={[0.24, 0.035, 0.07]} />
        </mesh>
      </group>

      {/* 4. REAR WHEEL & DUAL SHOCK ABSORBERS */}
      <group position={[0, 0.31, -0.66]}>
        {/* Rear Tire (18" with thick sidewall) */}
        <mesh rotation={[0, Math.PI / 2, 0]} castShadow material={rubberMat}>
          <torusGeometry args={[0.3, 0.058, 16, 32]} />
        </mesh>
        {/* Chrome Rim */}
        <mesh rotation={[0, Math.PI / 2, 0]} material={chromeMat}>
          <torusGeometry args={[0.25, 0.022, 12, 32]} />
        </mesh>
        {/* Drum Brake / Sprocket Hub */}
        <mesh rotation={[0, 0, Math.PI / 2]} castShadow material={engineCastMat}>
          <cylinderGeometry args={[0.09, 0.09, 0.12, 16]} />
        </mesh>
        {/* Drive Chain & Sprocket on left side */}
        <mesh position={[-0.07, 0, 0.18]} rotation={[0, 0, Math.PI / 2]} material={darkPlastic('black')}>
          <cylinderGeometry args={[0.095, 0.095, 0.012, 16]} />
        </mesh>
        {/* Rear Wheel Spokes */}
        {[0, 30, 60, 90, 120, 150].map((deg, i) => (
          <mesh
            key={`r-spoke-${i}`}
            rotation={[THREE.MathUtils.degToRad(deg), 0, 0]}
            material={chromeMat}
          >
            <cylinderGeometry args={[0.002, 0.002, 0.5, 4]} />
          </mesh>
        ))}

        {/* Deep Rear Mudguard (Classic wrap-around metal fender) */}
        <group position={[0, 0.04, 0]}>
          <mesh position={[0, 0.22, -0.06]} rotation={[-0.35, 0, 0]} castShadow material={tankPaintMat}>
            <cylinderGeometry
              args={[0.33, 0.33, 0.13, 16, 1, true, -Math.PI * 0.72, Math.PI * 0.9]}
            />
          </mesh>
        </group>
      </group>

      {/* Dual Gas-Charged Spring Shock Absorbers */}
      <group>
        {/* Left Shock */}
        <group position={[-0.12, 0.44, -0.52]} rotation={[-0.42, 0, 0]}>
          <mesh material={chromeMat}>
            <cylinderGeometry args={[0.018, 0.018, 0.32, 10]} />
          </mesh>
          <mesh material={chromeMat}>
            <torusGeometry args={[0.024, 0.006, 8, 16]} />
          </mesh>
          <mesh position={[0, 0.06, 0]} material={chromeMat}>
            <torusGeometry args={[0.024, 0.006, 8, 16]} />
          </mesh>
          <mesh position={[0, -0.06, 0]} material={chromeMat}>
            <torusGeometry args={[0.024, 0.006, 8, 16]} />
          </mesh>
        </group>
        {/* Right Shock */}
        <group position={[0.12, 0.44, -0.52]} rotation={[-0.42, 0, 0]}>
          <mesh material={chromeMat}>
            <cylinderGeometry args={[0.018, 0.018, 0.32, 10]} />
          </mesh>
          <mesh material={chromeMat}>
            <torusGeometry args={[0.024, 0.006, 8, 16]} />
          </mesh>
          <mesh position={[0, 0.06, 0]} material={chromeMat}>
            <torusGeometry args={[0.024, 0.006, 8, 16]} />
          </mesh>
          <mesh position={[0, -0.06, 0]} material={chromeMat}>
            <torusGeometry args={[0.024, 0.006, 8, 16]} />
          </mesh>
        </group>
      </group>

      {/* 5. 350cc AIR-COOLED ENGINE BLOCK & TRANSMISSION */}
      <group position={[0, 0.38, 0.02]}>
        {/* Main Crankcase (Rounded cast aluminum block) */}
        <mesh position={[0, -0.08, 0]} castShadow material={engineCastMat}>
          <boxGeometry args={[0.22, 0.18, 0.32]} />
        </mesh>
        {/* Left Oval Clutch/Primary Case with chrome badge */}
        <mesh position={[-0.12, -0.08, -0.02]} rotation={[0, 0, Math.PI / 2]} castShadow material={engineCastMat}>
          <cylinderGeometry args={[0.095, 0.095, 0.045, 16]} />
        </mesh>
        <mesh position={[-0.145, -0.08, -0.02]} rotation={[0, 0, Math.PI / 2]} material={chromeMat}>
          <cylinderGeometry args={[0.045, 0.045, 0.006, 16]} />
        </mesh>
        {/* Right Magneto / Tappet Cover */}
        <mesh position={[0.12, -0.08, 0.04]} rotation={[0, 0, Math.PI / 2]} castShadow material={engineCastMat}>
          <cylinderGeometry args={[0.075, 0.075, 0.045, 16]} />
        </mesh>

        {/* Upright Cylinder Block with Horizontal Cooling Fins */}
        <group position={[0, 0.08, 0.04]}>
          <mesh castShadow material={engineCastMat}>
            <cylinderGeometry args={[0.07, 0.075, 0.22, 12]} />
          </mesh>
          {/* Horizontal Cooling Fins (Finned stack) */}
          {[-0.08, -0.04, 0, 0.04, 0.08].map((y, i) => (
            <mesh key={`fin-${i}`} position={[0, y, 0]} castShadow material={engineCastMat}>
              <boxGeometry args={[0.19, 0.007, 0.18]} />
            </mesh>
          ))}
          {/* Cylinder Head & Rocker Covers */}
          <mesh position={[0, 0.13, 0]} castShadow material={chromeMat}>
            <boxGeometry args={[0.15, 0.055, 0.15]} />
          </mesh>
          {/* Spark plug and high-tension lead wire */}
          <mesh position={[0.06, 0.15, 0.03]} rotation={[0.4, 0, 0.5]} material={chromeMat}>
            <cylinderGeometry args={[0.008, 0.008, 0.04, 8]} />
          </mesh>
        </group>

        {/* Carburetor & Air Filter Pod */}
        <mesh position={[0, 0.06, -0.14]} castShadow material={engineCastMat}>
          <cylinderGeometry args={[0.035, 0.035, 0.08, 12]} />
        </mesh>
        {/* Left Side Oval Battery Utility Box */}
        <mesh position={[-0.11, 0.04, -0.16]} castShadow material={tankPaintMat}>
          <boxGeometry args={[0.065, 0.14, 0.16]} />
        </mesh>
        {/* Right Side Oval Air Filter Box */}
        <mesh position={[0.11, 0.04, -0.16]} castShadow material={tankPaintMat}>
          <boxGeometry args={[0.065, 0.14, 0.16]} />
        </mesh>

        {/* Kickstart Lever on right */}
        <group position={[0.14, -0.06, -0.1]}>
          <mesh rotation={[0.4, 0, 0]} material={chromeMat}>
            <cylinderGeometry args={[0.008, 0.008, 0.16, 8]} />
          </mesh>
          <mesh position={[0.03, 0.07, 0.02]} rotation={[0, 0, Math.PI / 2]} material={rubberMat}>
            <cylinderGeometry args={[0.012, 0.012, 0.06, 8]} />
          </mesh>
        </group>

        {/* Rider Footpegs & Brake Pedal */}
        <mesh position={[-0.18, -0.12, 0.05]} rotation={[0, 0, Math.PI / 2]} material={rubberMat}>
          <cylinderGeometry args={[0.016, 0.016, 0.11, 8]} />
        </mesh>
        <mesh position={[0.18, -0.12, 0.05]} rotation={[0, 0, Math.PI / 2]} material={rubberMat}>
          <cylinderGeometry args={[0.016, 0.016, 0.11, 8]} />
        </mesh>
      </group>

      {/* 6. SWEEPING CHROME EXHAUST SILENCER (Iconic Long Bottle Pipe) */}
      <group position={[0.13, 0.22, 0.12]}>
        {/* Exhaust Header Header Pipe coming out of cylinder */}
        <mesh position={[-0.03, 0.18, 0.08]} rotation={[-0.5, 0, 0.2]} material={chromeMat}>
          <cylinderGeometry args={[0.02, 0.02, 0.24, 12]} />
        </mesh>
        <mesh position={[0.01, 0.04, 0.14]} rotation={[0.8, 0, 0]} material={chromeMat}>
          <cylinderGeometry args={[0.02, 0.02, 0.18, 12]} />
        </mesh>
        {/* Main Swept Silencer / Muffler Tube */}
        <mesh position={[0.01, -0.01, -0.42]} rotation={[Math.PI / 2, 0, 0]} castShadow material={chromeMat}>
          <cylinderGeometry args={[0.038, 0.025, 0.76, 16]} />
        </mesh>
        {/* Tapered Exhaust Tip */}
        <mesh position={[0.01, -0.01, -0.81]} rotation={[Math.PI / 2, 0, 0]} material={chromeMat}>
          <cylinderGeometry args={[0.022, 0.034, 0.06, 16]} />
        </mesh>
      </group>

      {/* 7. TEARDROP FUEL TANK WITH THIGH RUBBER PADS */}
      <group position={[0, 0.72, 0.24]}>
        {/* Main Sculpted Tank Body */}
        <mesh castShadow material={tankPaintMat}>
          <sphereGeometry args={[0.17, 24, 16]} />
        </mesh>
        {/* Stretched tank back slope */}
        <mesh position={[0, -0.04, -0.12]} rotation={[-0.4, 0, 0]} castShadow material={tankPaintMat}>
          <boxGeometry args={[0.26, 0.18, 0.32]} />
        </mesh>
        {/* Left Knee Rubber Grip Pad */}
        <mesh position={[-0.142, -0.03, -0.02]} rotation={[0, 0.15, 0]} material={rubberMat}>
          <boxGeometry args={[0.012, 0.1, 0.16]} />
        </mesh>
        {/* Right Knee Rubber Grip Pad */}
        <mesh position={[0.142, -0.03, -0.02]} rotation={[0, -0.15, 0]} material={rubberMat}>
          <boxGeometry args={[0.012, 0.1, 0.16]} />
        </mesh>
        {/* Gold Pinstripe Badge / Wing Accent */}
        <mesh position={[-0.144, 0.05, 0.04]} rotation={[0, 0.2, 0]} material={goldAccentMat}>
          <boxGeometry args={[0.005, 0.032, 0.08]} />
        </mesh>
        <mesh position={[0.144, 0.05, 0.04]} rotation={[0, -0.2, 0]} material={goldAccentMat}>
          <boxGeometry args={[0.005, 0.032, 0.08]} />
        </mesh>
        {/* Chrome Fuel Filler Cap with Keyhole */}
        <mesh position={[0.04, 0.16, 0.05]} rotation={[0.2, 0, 0]} material={chromeMat}>
          <cylinderGeometry args={[0.032, 0.032, 0.022, 16]} />
        </mesh>
      </group>

      {/* 8. DUAL-LEVEL STITCHED LEATHER SEAT & PILLION GRAB RAIL */}
      <group position={[0, 0.75, -0.22]}>
        {/* Rider Contour Saddle */}
        <mesh position={[0, -0.03, 0.08]} rotation={[-0.12, 0, 0]} castShadow material={seatLeatherMat}>
          <boxGeometry args={[0.25, 0.09, 0.34]} />
        </mesh>
        {/* Pillion Raised Stepped Seat */}
        <mesh position={[0, 0.02, -0.22]} rotation={[-0.04, 0, 0]} castShadow material={seatLeatherMat}>
          <boxGeometry args={[0.21, 0.085, 0.32]} />
        </mesh>
        {/* Stitched Center Transition Rib */}
        <mesh position={[0, 0.01, -0.05]} material={darkPlastic('black')}>
          <boxGeometry args={[0.23, 0.02, 0.03]} />
        </mesh>
        {/* Chrome Pillion Grab Rail / Back Loop */}
        <mesh position={[0, 0.07, -0.39]} rotation={[Math.PI / 2, 0, 0]} material={chromeMat}>
          <torusGeometry args={[0.11, 0.01, 10, 20, Math.PI]} />
        </mesh>
      </group>

      {/* 9. ROADSTER HANDLEBAR, CHROME HEADLIGHT & INSTRUMENT CLUSTER */}
      <group position={[0, 0.88, 0.52]}>
        {/* Handlebar Stem / Risers */}
        <mesh position={[-0.06, -0.04, 0]} material={chromeMat}>
          <cylinderGeometry args={[0.014, 0.014, 0.08, 8]} />
        </mesh>
        <mesh position={[0.06, -0.04, 0]} material={chromeMat}>
          <cylinderGeometry args={[0.014, 0.014, 0.08, 8]} />
        </mesh>

        {/* Wide Chrome Roadster Handlebar */}
        <mesh position={[0, 0.02, 0]} rotation={[0, 0, Math.PI / 2]} material={chromeMat}>
          <cylinderGeometry args={[0.012, 0.012, 0.68, 16]} />
        </mesh>
        {/* Left & Right Swept-back Bar Ends with Rubber Grips */}
        <mesh position={[-0.34, 0.01, -0.04]} rotation={[0, 0.35, Math.PI / 2]} material={rubberMat}>
          <cylinderGeometry args={[0.018, 0.018, 0.12, 10]} />
        </mesh>
        <mesh position={[0.34, 0.01, -0.04]} rotation={[0, -0.35, Math.PI / 2]} material={rubberMat}>
          <cylinderGeometry args={[0.018, 0.018, 0.12, 10]} />
        </mesh>
        {/* Brake & Clutch Aluminum Levers */}
        <mesh position={[-0.32, -0.01, 0.02]} rotation={[0, -0.2, 0]} material={chromeMat}>
          <boxGeometry args={[0.11, 0.01, 0.016]} />
        </mesh>
        <mesh position={[0.32, -0.01, 0.02]} rotation={[0, 0.2, 0]} material={chromeMat}>
          <boxGeometry args={[0.11, 0.01, 0.016]} />
        </mesh>

        {/* Round Chrome Headlamp Nacelle / Bucket */}
        <group position={[0, -0.02, 0.14]}>
          <mesh castShadow material={chromeMat}>
            <sphereGeometry args={[0.11, 20, 16, 0, Math.PI * 2, 0, Math.PI * 0.58]} />
          </mesh>
          {/* Bright Headlamp Lens */}
          <mesh position={[0, 0, 0.08]} rotation={[Math.PI / 2, 0, 0]} material={headlampGlassMat}>
            <cylinderGeometry args={[0.098, 0.098, 0.018, 20]} />
          </mesh>
          {/* Chrome Headlamp Visor / Peak / Hood */}
          <mesh position={[0, 0.09, 0.07]} rotation={[-0.25, 0, 0]} material={chromeMat}>
            <boxGeometry args={[0.12, 0.012, 0.06]} />
          </mesh>
        </group>

        {/* Twin Chrome Speedometer & Amp Console Pods */}
        <mesh position={[-0.055, 0.08, 0.04]} rotation={[0.45, 0, 0]} material={chromeMat}>
          <cylinderGeometry args={[0.042, 0.038, 0.04, 16]} />
        </mesh>
        <mesh position={[0.055, 0.08, 0.04]} rotation={[0.45, 0, 0]} material={chromeMat}>
          <cylinderGeometry args={[0.035, 0.03, 0.035, 16]} />
        </mesh>

        {/* Round Chrome Rear-View Mirrors */}
        {hasMirrors && (
          <>
            {/* Left Mirror */}
            <group position={[-0.26, 0.12, 0.01]}>
              <mesh rotation={[0, 0, -0.3]} material={chromeMat}>
                <cylinderGeometry args={[0.005, 0.005, 0.16, 6]} />
              </mesh>
              <mesh position={[-0.04, 0.09, 0]} rotation={[0, 0.3, 0]} material={chromeMat}>
                <cylinderGeometry args={[0.045, 0.045, 0.012, 16]} />
              </mesh>
            </group>
            {/* Right Mirror */}
            <group position={[0.26, 0.12, 0.01]}>
              <mesh rotation={[0, 0, 0.3]} material={chromeMat}>
                <cylinderGeometry args={[0.005, 0.005, 0.16, 6]} />
              </mesh>
              <mesh position={[0.04, 0.09, 0]} rotation={[0, -0.3, 0]} material={chromeMat}>
                <cylinderGeometry args={[0.045, 0.045, 0.012, 16]} />
              </mesh>
            </group>
          </>
        )}

        {/* Front Amber Bullet Turn Indicators */}
        <group position={[-0.18, -0.04, 0.11]}>
          <mesh rotation={[0, 0, Math.PI / 2]} material={chromeMat}>
            <cylinderGeometry args={[0.008, 0.008, 0.07, 6]} />
          </mesh>
          <mesh position={[-0.04, 0, 0]} rotation={[0, -Math.PI / 2, 0]} material={indicatorAmberMat}>
            <sphereGeometry args={[0.024, 12, 10]} />
          </mesh>
        </group>
        <group position={[0.18, -0.04, 0.11]}>
          <mesh rotation={[0, 0, Math.PI / 2]} material={chromeMat}>
            <cylinderGeometry args={[0.008, 0.008, 0.07, 6]} />
          </mesh>
          <mesh position={[0.04, 0, 0]} rotation={[0, Math.PI / 2, 0]} material={indicatorAmberMat}>
            <sphereGeometry args={[0.024, 12, 10]} />
          </mesh>
        </group>
      </group>

      {/* 10. REAR LIGHTING, NUMBER PLATE & BULLET INDICATORS */}
      <group position={[0, 0.48, -0.88]}>
        {/* Round Chrome Tail Lamp Housing */}
        <mesh position={[0, 0.08, 0]} material={chromeMat}>
          <cylinderGeometry args={[0.042, 0.035, 0.04, 16]} />
        </mesh>
        {/* Red Glass Tail Lamp */}
        <mesh position={[0, 0.08, -0.022]} rotation={[Math.PI / 2, 0, 0]} material={tailLampRedMat}>
          <cylinderGeometry args={[0.038, 0.038, 0.015, 16]} />
        </mesh>
        {/* Rear Number Plate Board */}
        <mesh position={[0, -0.03, -0.02]} material={frameBlackMat}>
          <boxGeometry args={[0.18, 0.09, 0.008]} />
        </mesh>
        <mesh position={[0, -0.03, -0.026]} material={chromeMat}>
          <boxGeometry args={[0.16, 0.07, 0.004]} />
        </mesh>
        {/* Rear Turn Indicators */}
        <group position={[-0.14, 0.06, 0.04]}>
          <mesh rotation={[0, 0, Math.PI / 2]} material={chromeMat}>
            <cylinderGeometry args={[0.006, 0.006, 0.06, 6]} />
          </mesh>
          <mesh position={[-0.03, 0, 0]} material={indicatorAmberMat}>
            <sphereGeometry args={[0.022, 10, 8]} />
          </mesh>
        </group>
        <group position={[0.14, 0.06, 0.04]}>
          <mesh rotation={[0, 0, Math.PI / 2]} material={chromeMat}>
            <cylinderGeometry args={[0.006, 0.006, 0.06, 6]} />
          </mesh>
          <mesh position={[0.03, 0, 0]} material={indicatorAmberMat}>
            <sphereGeometry args={[0.022, 10, 8]} />
          </mesh>
        </group>
      </group>

      {/* 11. INDIAN STREET ACCESSORIES: ENGINE CRASH GUARD & SAREE GUARD */}
      {/* Front Heavy-Duty Chrome Leg / Crash Guard */}
      {hasCrashGuard && (
        <group position={[0, 0.45, 0.32]}>
          <mesh rotation={[0, 0, Math.PI / 2]} material={chromeMat}>
            <cylinderGeometry args={[0.016, 0.016, 0.58, 12]} />
          </mesh>
          {/* Outer loop bends */}
          <mesh position={[-0.28, -0.08, 0]} rotation={[0, 0, 0.45]} material={chromeMat}>
            <cylinderGeometry args={[0.014, 0.014, 0.22, 10]} />
          </mesh>
          <mesh position={[0.28, -0.08, 0]} rotation={[0, 0, -0.45]} material={chromeMat}>
            <cylinderGeometry args={[0.014, 0.014, 0.22, 10]} />
          </mesh>
          {/* Lower mounting struts to frame */}
          <mesh position={[-0.15, -0.16, 0]} rotation={[0, 0, -0.25]} material={chromeMat}>
            <cylinderGeometry args={[0.012, 0.012, 0.16, 8]} />
          </mesh>
          <mesh position={[0.15, -0.16, 0]} rotation={[0, 0, 0.25]} material={chromeMat}>
            <cylinderGeometry args={[0.012, 0.012, 0.16, 8]} />
          </mesh>
        </group>
      )}

      {/* Authentic Indian Saree Guard on Left Rear Wheel */}
      {hasSareeGuard && (
        <group position={[-0.14, 0.38, -0.58]}>
          {/* Outer Wire Frame */}
          <mesh material={frameBlackMat}>
            <boxGeometry args={[0.01, 0.24, 0.36]} />
          </mesh>
          {/* Protective mesh wire grill */}
          <mesh position={[0, 0, 0]} material={chromeMat}>
            <boxGeometry args={[0.005, 0.2, 0.32]} />
          </mesh>
          {/* Pillion Footrest Step */}
          <mesh position={[-0.04, -0.14, 0.06]} rotation={[0, 0, Math.PI / 2]} material={rubberMat}>
            <cylinderGeometry args={[0.014, 0.014, 0.1, 8]} />
          </mesh>
        </group>
      )}

      {/* Rear Chrome Luggage Carrier Rack */}
      {hasLuggageCarrier && (
        <group position={[0, 0.74, -0.6]}>
          {/* Horizontal rack tubes */}
          <mesh position={[0, 0.01, 0]} material={chromeMat}>
            <boxGeometry args={[0.22, 0.012, 0.28]} />
          </mesh>
          {/* Support struts down to shock mounts */}
          <mesh position={[-0.1, -0.12, -0.06]} rotation={[0.3, 0, 0]} material={chromeMat}>
            <cylinderGeometry args={[0.008, 0.008, 0.26, 6]} />
          </mesh>
          <mesh position={[0.1, -0.12, -0.06]} rotation={[0.3, 0, 0]} material={chromeMat}>
            <cylinderGeometry args={[0.008, 0.008, 0.26, 6]} />
          </mesh>
        </group>
      )}
    </group>
  );
};

// Helper for black plastic/metal
function darkPlastic(color: string) {
  return new THREE.MeshStandardMaterial({
    color: color === 'black' ? '#111827' : color,
    roughness: 0.5,
    metalness: 0.4,
  });
}
