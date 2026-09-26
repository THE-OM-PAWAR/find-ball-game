import React, { useMemo } from 'react';
import * as THREE from 'three';

export interface ScooterConfig {
  bodyColor: string;
  seatColor: string;
  hasCrashGuard: boolean;
  hasSpareTire: boolean;
  hasMirrors: boolean;
  hasFootrest: boolean;
}

/**
 * Iconic Vintage Bajaj Chetak Indian 2-Stroke Scooter
 * High-fidelity 1:1 metric model:
 * - Pressed steel curved front leg shield with chrome beading
 * - Classic split dual sprung leatherette seats
 * - Bulbous side cowls (engine louver vents & battery cowl)
 * - Side-mounted spare wheel with metal cover
 * - Chrome crash guards, handlebar shroud with round headlight, and floor rubber strips
 */
export const BajajChetakScooter: React.FC<{
  config?: Partial<ScooterConfig>;
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
    bodyColor = '#4e8777', // Classic vintage seafoam green
    seatColor = '#2b211b', // Dark brown leatherette
    hasCrashGuard = true,
    hasSpareTire = true,
    hasMirrors = true,
    hasFootrest = true,
  } = config;

  // Materials
  const bodyMat = useMemo(
    () => new THREE.MeshStandardMaterial({ color: bodyColor, roughness: 0.35, metalness: 0.3 }),
    [bodyColor]
  );
  const chromeMat = useMemo(
    () => new THREE.MeshStandardMaterial({ color: '#f1f5f9', roughness: 0.15, metalness: 0.95 }),
    []
  );
  const rubberTireMat = useMemo(
    () => new THREE.MeshStandardMaterial({ color: '#1a1d20', roughness: 0.85, metalness: 0.1 }),
    []
  );
  const steelRimMat = useMemo(
    () => new THREE.MeshStandardMaterial({ color: '#cbd5e1', roughness: 0.3, metalness: 0.7 }),
    []
  );
  const seatMat = useMemo(
    () => new THREE.MeshStandardMaterial({ color: seatColor, roughness: 0.7, metalness: 0.1 }),
    [seatColor]
  );
  const darkPlasticMat = useMemo(
    () => new THREE.MeshStandardMaterial({ color: '#181b22', roughness: 0.6, metalness: 0.2 }),
    []
  );
  const headlightGlassMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#fef9c3',
        emissive: '#facc15',
        emissiveIntensity: 0.4,
        roughness: 0.1,
        metalness: 0.9,
      }),
    []
  );
  const taillightRedMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#dc2626',
        emissive: '#ef4444',
        emissiveIntensity: 0.3,
        roughness: 0.2,
      }),
    []
  );
  const indicatorAmberMat = useMemo(
    () => new THREE.MeshStandardMaterial({ color: '#f59e0b', roughness: 0.2, metalness: 0.5 }),
    []
  );

  return (
    <group position={position} rotation={rotation} scale={scale}>
      {/* 1. GROUND STAND & CHASSIS BASE */}
      {/* Double Center Parking Stand holding scooter upright */}
      <group position={[0, 0.15, -0.05]}>
        <mesh position={[-0.14, -0.07, 0]} rotation={[0, 0, 0.15]} castShadow material={darkPlasticMat}>
          <cylinderGeometry args={[0.012, 0.012, 0.18, 8]} />
        </mesh>
        <mesh position={[0.14, -0.07, 0]} rotation={[0, 0, -0.15]} castShadow material={darkPlasticMat}>
          <cylinderGeometry args={[0.012, 0.012, 0.18, 8]} />
        </mesh>
        <mesh position={[0, -0.14, 0]} rotation={[0, 0, Math.PI / 2]} material={darkPlasticMat}>
          <cylinderGeometry args={[0.012, 0.012, 0.32, 8]} />
        </mesh>
      </group>

      {/* 2. WHEELS (10-Inch Indian Scooter Rims) */}
      {/* Front Wheel (Z = +0.62m, Y = 0.20m) */}
      <group position={[0, 0.2, 0.62]}>
        {/* Rubber Tire */}
        <mesh rotation={[0, Math.PI / 2, 0]} castShadow receiveShadow material={rubberTireMat}>
          <torusGeometry args={[0.15, 0.05, 12, 24]} />
        </mesh>
        {/* Steel Hub Rim */}
        <mesh rotation={[0, 0, Math.PI / 2]} castShadow material={steelRimMat}>
          <cylinderGeometry args={[0.12, 0.12, 0.06, 16]} />
        </mesh>
        {/* Center Hub Nut */}
        <mesh position={[0.04, 0, 0]} rotation={[0, 0, Math.PI / 2]} material={chromeMat}>
          <cylinderGeometry args={[0.03, 0.03, 0.02, 6]} />
        </mesh>
      </group>

      {/* Rear Wheel (Z = -0.58m, Y = 0.20m) */}
      <group position={[0, 0.2, -0.58]}>
        <mesh rotation={[0, Math.PI / 2, 0]} castShadow receiveShadow material={rubberTireMat}>
          <torusGeometry args={[0.15, 0.05, 12, 24]} />
        </mesh>
        <mesh rotation={[0, 0, Math.PI / 2]} castShadow material={steelRimMat}>
          <cylinderGeometry args={[0.12, 0.12, 0.06, 16]} />
        </mesh>
      </group>

      {/* 3. FRONT SUSPENSION FORK & MUDGUARD */}
      <group position={[0, 0.2, 0.62]}>
        {/* Single-Sided Trailing Link Suspension Arm (Left side) */}
        <mesh position={[-0.045, 0.08, 0]} rotation={[0.2, 0, 0]} castShadow material={steelRimMat}>
          <boxGeometry args={[0.02, 0.18, 0.03]} />
        </mesh>
        {/* Front Chrome Mudguard / Fender */}
        <mesh position={[0, 0.12, 0]} rotation={[0.25, 0, 0]} castShadow material={bodyMat}>
          <sphereGeometry args={[0.21, 16, 12, 0, Math.PI, 0, Math.PI * 0.55]} />
        </mesh>
        {/* Mudguard Chrome Top Crest */}
        <mesh position={[0, 0.23, 0.04]} rotation={[0.25, 0, 0]} material={chromeMat}>
          <boxGeometry args={[0.015, 0.02, 0.14]} />
        </mesh>
      </group>

      {/* Steering Column Tube */}
      <mesh position={[0, 0.58, 0.52]} rotation={[-0.22, 0, 0]} castShadow material={steelRimMat}>
        <cylinderGeometry args={[0.025, 0.025, 0.65, 12]} />
      </mesh>

      {/* 4. FRONT LEG SHIELD (APRON) */}
      <group position={[0, 0.54, 0.44]} rotation={[-0.18, 0, 0]}>
        {/* Main Curved Steel Apron */}
        <mesh castShadow receiveShadow material={bodyMat}>
          <boxGeometry args={[0.48, 0.58, 0.02]} />
        </mesh>
        {/* Chrome Outer Beading Trim */}
        <mesh position={[-0.24, 0, 0]} material={chromeMat}>
          <cylinderGeometry args={[0.008, 0.008, 0.58, 8]} />
        </mesh>
        <mesh position={[0.24, 0, 0]} material={chromeMat}>
          <cylinderGeometry args={[0.008, 0.008, 0.58, 8]} />
        </mesh>
        {/* Front Number Plate */}
        <mesh position={[0, -0.15, 0.02]} castShadow material={darkPlasticMat}>
          <boxGeometry args={[0.26, 0.07, 0.01]} />
        </mesh>
        <mesh position={[0, -0.15, 0.028]}>
          <planeGeometry args={[0.24, 0.055]} />
          <meshBasicMaterial color="#ffffff" />
        </mesh>
        {/* Vintage Bajaj Emblem Badge */}
        <mesh position={[0, 0.16, 0.02]} material={chromeMat}>
          <boxGeometry args={[0.08, 0.025, 0.008]} />
        </mesh>
      </group>

      {/* 5. GLOVE BOX (Toolbox on inner side of leg shield) */}
      <mesh position={[0, 0.52, 0.36]} castShadow material={bodyMat}>
        <boxGeometry args={[0.34, 0.22, 0.12]} />
      </mesh>
      {/* Keyhole Lock */}
      <mesh position={[0, 0.58, 0.42]} material={chromeMat}>
        <cylinderGeometry args={[0.01, 0.01, 0.01, 8]} />
      </mesh>

      {/* 6. CENTER FLOORBOARD (Otla Footrest) */}
      <group position={[0, 0.26, 0.04]}>
        {/* Floor Platform */}
        <mesh castShadow receiveShadow material={bodyMat}>
          <boxGeometry args={[0.42, 0.03, 0.65]} />
        </mesh>
        {/* Central Spine Tunnel */}
        <mesh position={[0, 0.08, 0]} castShadow material={bodyMat}>
          <boxGeometry args={[0.16, 0.14, 0.62]} />
        </mesh>
        {/* Rubber Anti-Skid Strips */}
        {[-0.14, -0.11, 0.11, 0.14].map((x, i) => (
          <mesh key={i} position={[x, 0.02, 0]} material={darkPlasticMat}>
            <boxGeometry args={[0.015, 0.008, 0.55]} />
          </mesh>
        ))}
        {/* Floor Rear Brake Foot Pedal */}
        <mesh position={[0.14, 0.06, 0.18]} rotation={[0.2, 0, 0]} castShadow material={steelRimMat}>
          <boxGeometry args={[0.04, 0.06, 0.03]} />
        </mesh>
      </group>

      {/* 7. HANDLEBAR SHROUD & HEADLIGHT CLUSTER */}
      <group position={[0, 0.88, 0.44]} rotation={[-0.12, 0, 0]}>
        {/* Handlebar Metal Casting Head */}
        <mesh castShadow material={bodyMat}>
          <boxGeometry args={[0.54, 0.10, 0.12]} />
        </mesh>
        {/* Center Round Chrome Headlight */}
        <group position={[0, 0.01, 0.065]}>
          <mesh rotation={[Math.PI / 2, 0, 0]} castShadow material={chromeMat}>
            <cylinderGeometry args={[0.07, 0.07, 0.03, 16]} />
          </mesh>
          <mesh position={[0, 0, 0.018]} rotation={[Math.PI / 2, 0, 0]} material={headlightGlassMat}>
            <cylinderGeometry args={[0.062, 0.062, 0.008, 16]} />
          </mesh>
        </group>
        {/* Speedometer Cluster (Top Face) */}
        <mesh position={[0, 0.052, 0]} rotation={[-Math.PI / 3, 0, 0]}>
          <circleGeometry args={[0.04, 16]} />
          <meshBasicMaterial color="#f8fafc" />
        </mesh>
        {/* Rubber Grips & Chrome Levers */}
        {[-0.27, 0.27].map((x, i) => (
          <group key={i} position={[x, 0, 0]}>
            <mesh rotation={[0, 0, Math.PI / 2]} material={darkPlasticMat}>
              <cylinderGeometry args={[0.018, 0.018, 0.1, 10]} />
            </mesh>
            <mesh position={[0, -0.01, 0.04]} rotation={[0, (i === 0 ? 0.3 : -0.3), 0]} material={chromeMat}>
              <boxGeometry args={[0.08, 0.008, 0.012]} />
            </mesh>
          </group>
        ))}

        {/* Dual Chrome Rear-View Mirrors */}
        {hasMirrors &&
          [-0.24, 0.24].map((x, i) => (
            <group key={i} position={[x, 0.05, -0.02]}>
              {/* Chrome Stem */}
              <mesh position={[0, 0.08, 0]} rotation={[0, 0, i === 0 ? -0.2 : 0.2]} material={chromeMat}>
                <cylinderGeometry args={[0.005, 0.005, 0.16, 8]} />
              </mesh>
              {/* Round Mirror */}
              <mesh position={[i === 0 ? -0.04 : 0.04, 0.16, 0]} material={chromeMat}>
                <cylinderGeometry args={[0.04, 0.04, 0.01, 16]} />
              </mesh>
              <mesh position={[i === 0 ? -0.04 : 0.04, 0.16, -0.006]} material={chromeMat}>
                <circleGeometry args={[0.036, 16]} />
              </mesh>
            </group>
          ))}
      </group>

      {/* 8. REAR BODY & BULBOUS ENGINE SIDE COWLS */}
      <group position={[0, 0.44, -0.38]}>
        {/* Main Monocoque Rear Frame */}
        <mesh position={[0, 0.05, 0]} castShadow receiveShadow material={bodyMat}>
          <boxGeometry args={[0.34, 0.38, 0.65]} />
        </mesh>

        {/* Right Side Cowl: 2-Stroke Engine Cowl with Cooling Slits */}
        <group position={[0.21, 0, 0.02]}>
          <mesh castShadow receiveShadow material={bodyMat}>
            <sphereGeometry args={[0.22, 16, 12, 0, Math.PI, 0, Math.PI]} />
          </mesh>
          {/* Horizontal Louver Cooling Air Gills */}
          {[-0.05, 0, 0.05].map((y, idx) => (
            <mesh key={idx} position={[0.16, y, 0]} material={darkPlasticMat}>
              <boxGeometry args={[0.01, 0.015, 0.18]} />
            </mesh>
          ))}
        </group>

        {/* Left Side Cowl: Battery & Spare Tire Compartment */}
        <group position={[-0.21, 0, 0.02]}>
          <mesh castShadow receiveShadow material={bodyMat}>
            <sphereGeometry args={[0.22, 16, 12, 0, Math.PI, 0, Math.PI]} />
          </mesh>
          {/* Side-Mounted Spare Tire */}
          {hasSpareTire && (
            <group position={[-0.14, 0, 0]}>
              <mesh rotation={[0, Math.PI / 2, 0]} castShadow material={rubberTireMat}>
                <torusGeometry args={[0.14, 0.04, 10, 20]} />
              </mesh>
              <mesh rotation={[0, 0, Math.PI / 2]} material={bodyMat}>
                <cylinderGeometry args={[0.11, 0.11, 0.04, 16]} />
              </mesh>
              <mesh position={[-0.025, 0, 0]} rotation={[0, 0, Math.PI / 2]} material={chromeMat}>
                <cylinderGeometry args={[0.02, 0.02, 0.02, 6]} />
              </mesh>
            </group>
          )}
        </group>
      </group>

      {/* 9. VINTAGE DUAL SPLIT SEATS */}
      <group position={[0, 0.68, -0.15]}>
        {/* Driver Front Sprung Saddle */}
        <mesh position={[0, 0, 0.08]} castShadow material={seatMat}>
          <boxGeometry args={[0.28, 0.08, 0.28]} />
        </mesh>
        {/* Pillion Passenger Rear Pad */}
        <mesh position={[0, 0.02, -0.26]} castShadow material={seatMat}>
          <boxGeometry args={[0.24, 0.08, 0.30]} />
        </mesh>
        {/* Rear Chrome Passenger Grab Rail */}
        <group position={[0, 0.05, -0.42]}>
          <mesh position={[0, 0.06, 0]} material={chromeMat}>
            <boxGeometry args={[0.22, 0.015, 0.015]} />
          </mesh>
          {[-0.1, 0.1].map((x, i) => (
            <mesh key={i} position={[x, 0, 0]} material={chromeMat}>
              <cylinderGeometry args={[0.007, 0.007, 0.12, 8]} />
            </mesh>
          ))}
        </group>
      </group>

      {/* 10. REAR LIGHT CLUSTER & NUMBER PLATE */}
      <group position={[0, 0.42, -0.74]}>
        {/* Chrome Taillight Housing */}
        <mesh position={[0, 0.08, 0]} material={chromeMat}>
          <boxGeometry args={[0.12, 0.08, 0.04]} />
        </mesh>
        <mesh position={[0, 0.08, -0.022]} material={taillightRedMat}>
          <boxGeometry args={[0.10, 0.06, 0.01]} />
        </mesh>
        {/* Orange Amber Turn Indicators */}
        {[-0.12, 0.12].map((x, i) => (
          <mesh key={i} position={[x, 0.08, 0]} material={indicatorAmberMat}>
            <cylinderGeometry args={[0.025, 0.025, 0.03, 12]} />
          </mesh>
        ))}
        {/* Rear Number Plate */}
        <mesh position={[0, -0.05, 0.01]} castShadow material={darkPlasticMat}>
          <boxGeometry args={[0.24, 0.12, 0.01]} />
        </mesh>
        <mesh position={[0, -0.05, -0.008]}>
          <planeGeometry args={[0.22, 0.10]} />
          <meshBasicMaterial color="#ffffff" />
        </mesh>
        {/* Exhaust Pipe Muffler Tip (Right Bottom) */}
        <mesh position={[0.15, -0.16, 0.08]} rotation={[Math.PI / 2, 0, 0]} material={chromeMat}>
          <cylinderGeometry args={[0.018, 0.018, 0.18, 8]} />
        </mesh>
      </group>

      {/* 11. CHROME CRASH GUARD PERIMETER BARS */}
      {hasCrashGuard && (
        <group>
          {/* Front Apron Crash Guard */}
          <group position={[0, 0.52, 0.46]} rotation={[-0.18, 0, 0]}>
            <mesh position={[-0.26, 0, 0.02]} material={chromeMat}>
              <cylinderGeometry args={[0.008, 0.008, 0.56, 8]} />
            </mesh>
            <mesh position={[0.26, 0, 0.02]} material={chromeMat}>
              <cylinderGeometry args={[0.008, 0.008, 0.56, 8]} />
            </mesh>
          </group>
          {/* Rear Side Cowl Wrap-around Bumpers */}
          <group position={[0, 0.42, -0.38]}>
            <mesh position={[-0.25, 0, 0]} material={chromeMat}>
              <boxGeometry args={[0.015, 0.015, 0.55]} />
            </mesh>
            <mesh position={[0.25, 0, 0]} material={chromeMat}>
              <boxGeometry args={[0.015, 0.015, 0.55]} />
            </mesh>
          </group>
        </group>
      )}

      {/* Saree Footrest / Side Step on Left Side */}
      {hasFootrest && (
        <mesh position={[-0.22, 0.22, -0.22]} material={darkPlasticMat}>
          <boxGeometry args={[0.12, 0.02, 0.18]} />
        </mesh>
      )}
    </group>
  );
};
