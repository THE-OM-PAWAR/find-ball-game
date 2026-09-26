import React, { useMemo } from 'react';
import * as THREE from 'three';

export interface AutoRickshawConfig {
  bodyColor: string; // Lower cabin color (Green / Black / Blue)
  roofColor: string; // Upper canopy color (Iconic Auto Yellow)
  seatColor: string; // Interior upholstery
  hasFareMeter: boolean;
  hasCurtains: boolean;
  hasFrontBumper: boolean;
  hasRearBumper: boolean;
  hasLuggageNet: boolean;
}

/**
 * Iconic Indian 3-Wheeler Auto-Rickshaw (Bajaj RE Tuk-Tuk)
 * High-fidelity 1:1 metric model:
 * - 2.65m length x 1.72m height x 1.30m width
 * - 3-wheel chassis (1 front steer wheel, 2 rear wide track wheels)
 * - Two-tone iconic bodywork (Gully Green lower steel cabin + Sunlit Yellow canopy)
 * - Detailed driver cockpit: handlebar controls, split windscreen with wiper, iconic fare meter
 * - Passenger compartment: wide cushioned bench seat, grab rails, rolled weather curtains
 * - Rear engine bay with ventilation louvers, tail lamp clusters & heavy-duty bumpers
 */
export const AutoRickshaw: React.FC<{
  config?: Partial<AutoRickshawConfig>;
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
    bodyColor = '#15803d', // Iconic Delhi/Bangalore/Gujarat auto green
    roofColor = '#eab308', // Iconic Auto Yellow
    seatColor = '#1f242d', // Durable black textured rexine
    hasFareMeter = true,
    hasCurtains = true,
    hasFrontBumper = true,
    hasRearBumper = true,
    hasLuggageNet = true,
  } = config;

  // Materials
  const bodyPaintMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: bodyColor,
        roughness: 0.35,
        metalness: 0.3,
      }),
    [bodyColor]
  );

  const roofCanopyMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: roofColor,
        roughness: 0.65, // Fabric / matte rexine feel
        metalness: 0.1,
      }),
    [roofColor]
  );

  const chromeMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#f8fafc',
        roughness: 0.12,
        metalness: 0.95,
      }),
    []
  );

  const blackSteelMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#1e293b',
        roughness: 0.6,
        metalness: 0.6,
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

  const steelRimMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#cbd5e1',
        roughness: 0.35,
        metalness: 0.7,
      }),
    []
  );

  const seatUpholsteryMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: seatColor,
        roughness: 0.75,
        metalness: 0.1,
      }),
    [seatColor]
  );

  const glassMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#e2e8f0',
        roughness: 0.1,
        metalness: 0.9,
        transparent: true,
        opacity: 0.45,
      }),
    []
  );

  const headlampMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#fef9c3',
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
        roughness: 0.2,
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

  const meterDigitalMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#0f172a',
        emissive: '#22c55e',
        emissiveIntensity: 0.4,
        roughness: 0.3,
      }),
    []
  );

  const curtainMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#292524',
        roughness: 0.9,
        metalness: 0.05,
      }),
    []
  );

  return (
    <group position={position} rotation={rotation} scale={scale}>
      {/* 1. LOWER STEEL CHASSIS & FLOOR PAN */}
      <group position={[0, 0.22, 0]}>
        {/* Main Floor Platform */}
        <mesh position={[0, 0, 0]} castShadow material={blackSteelMat}>
          <boxGeometry args={[1.24, 0.06, 2.3]} />
        </mesh>
        {/* Ribbed Anti-Slip Rubber Floor Mat */}
        <mesh position={[0, 0.035, 0.05]} material={rubberTireMat}>
          <boxGeometry args={[1.18, 0.015, 2.15]} />
        </mesh>
        {/* Chassis Center Tube */}
        <mesh position={[0, -0.06, 0.1]} rotation={[Math.PI / 2, 0, 0]} material={blackSteelMat}>
          <cylinderGeometry args={[0.04, 0.04, 2.2, 10]} />
        </mesh>
      </group>

      {/* 2. THREE WHEELS & AXLES */}
      {/* Front Center Steer Wheel (10-inch Scooter Type Rim) */}
      <group position={[0, 0.22, 0.95]}>
        {/* Front Tire */}
        <mesh rotation={[0, Math.PI / 2, 0]} castShadow material={rubberTireMat}>
          <torusGeometry args={[0.22, 0.048, 14, 28]} />
        </mesh>
        {/* Steel Pressed Rim */}
        <mesh rotation={[0, 0, Math.PI / 2]} material={steelRimMat}>
          <cylinderGeometry args={[0.18, 0.18, 0.09, 16]} />
        </mesh>
        <mesh rotation={[0, 0, Math.PI / 2]} material={blackSteelMat}>
          <cylinderGeometry args={[0.06, 0.06, 0.1, 12]} />
        </mesh>
        {/* Front Fork Assembly */}
        <mesh position={[-0.07, 0.18, -0.02]} rotation={[-0.18, 0, 0]} castShadow material={blackSteelMat}>
          <cylinderGeometry args={[0.02, 0.02, 0.42, 10]} />
        </mesh>
        <mesh position={[0.07, 0.18, -0.02]} rotation={[-0.18, 0, 0]} castShadow material={blackSteelMat}>
          <cylinderGeometry args={[0.02, 0.02, 0.42, 10]} />
        </mesh>
        {/* Front Metal Mudguard */}
        <mesh position={[0, 0.16, 0.02]} rotation={[0.2, 0, 0]} castShadow material={bodyPaintMat}>
          <cylinderGeometry
            args={[0.26, 0.26, 0.16, 16, 1, true, -Math.PI * 0.4, Math.PI * 0.8]}
          />
        </mesh>
      </group>

      {/* Rear Left Wheel */}
      <group position={[-0.56, 0.22, -0.65]}>
        <mesh rotation={[0, Math.PI / 2, 0]} castShadow material={rubberTireMat}>
          <torusGeometry args={[0.22, 0.052, 14, 28]} />
        </mesh>
        <mesh rotation={[0, 0, Math.PI / 2]} material={steelRimMat}>
          <cylinderGeometry args={[0.18, 0.18, 0.095, 16]} />
        </mesh>
        <mesh rotation={[0, 0, Math.PI / 2]} material={blackSteelMat}>
          <cylinderGeometry args={[0.065, 0.065, 0.11, 12]} />
        </mesh>
        {/* Wheel Arch / Mudguard Flare */}
        <mesh position={[0.02, 0.14, 0]} material={bodyPaintMat}>
          <boxGeometry args={[0.14, 0.2, 0.52]} />
        </mesh>
      </group>

      {/* Rear Right Wheel */}
      <group position={[0.56, 0.22, -0.65]}>
        <mesh rotation={[0, Math.PI / 2, 0]} castShadow material={rubberTireMat}>
          <torusGeometry args={[0.22, 0.052, 14, 28]} />
        </mesh>
        <mesh rotation={[0, 0, Math.PI / 2]} material={steelRimMat}>
          <cylinderGeometry args={[0.18, 0.18, 0.095, 16]} />
        </mesh>
        <mesh rotation={[0, 0, Math.PI / 2]} material={blackSteelMat}>
          <cylinderGeometry args={[0.065, 0.065, 0.11, 12]} />
        </mesh>
        {/* Wheel Arch / Mudguard Flare */}
        <mesh position={[-0.02, 0.14, 0]} material={bodyPaintMat}>
          <boxGeometry args={[0.14, 0.2, 0.52]} />
        </mesh>
      </group>

      {/* 3. FRONT NOSE, APRON & LIGHTING */}
      <group position={[0, 0.55, 0.82]}>
        {/* Front Sculpted Apron Body */}
        <mesh position={[0, 0.04, 0.06]} rotation={[-0.2, 0, 0]} castShadow material={bodyPaintMat}>
          <boxGeometry args={[0.92, 0.58, 0.32]} />
        </mesh>
        {/* Tapered Front Center Nose */}
        <mesh position={[0, -0.06, 0.22]} rotation={[-0.28, 0, 0]} castShadow material={bodyPaintMat}>
          <boxGeometry args={[0.52, 0.42, 0.18]} />
        </mesh>

        {/* Central Large Round Chrome Headlamp */}
        <group position={[0, -0.02, 0.32]}>
          <mesh material={chromeMat}>
            <cylinderGeometry args={[0.095, 0.08, 0.05, 16]} />
          </mesh>
          <mesh position={[0, 0, 0.026]} rotation={[Math.PI / 2, 0, 0]} material={headlampMat}>
            <cylinderGeometry args={[0.088, 0.088, 0.012, 16]} />
          </mesh>
        </group>

        {/* Left & Right Amber Turn Indicators */}
        <mesh position={[-0.34, -0.04, 0.22]} material={indicatorAmberMat}>
          <boxGeometry args={[0.07, 0.045, 0.03]} />
        </mesh>
        <mesh position={[0.34, -0.04, 0.22]} material={indicatorAmberMat}>
          <boxGeometry args={[0.07, 0.045, 0.03]} />
        </mesh>

        {/* Front Metal Number Plate Board */}
        <mesh position={[0, -0.22, 0.28]} material={blackSteelMat}>
          <boxGeometry args={[0.26, 0.08, 0.012]} />
        </mesh>
        <mesh position={[0, -0.22, 0.29]} material={chromeMat}>
          <boxGeometry args={[0.24, 0.065, 0.005]} />
        </mesh>
      </group>

      {/* 4. SPLIT TWO-PIECE WINDSCREEN & WIPER */}
      <group position={[0, 1.08, 0.62]} rotation={[-0.14, 0, 0]}>
        {/* Steel Outer Window Frame */}
        <mesh material={blackSteelMat}>
          <boxGeometry args={[1.08, 0.54, 0.04]} />
        </mesh>
        {/* Left Toughened Glass Pane */}
        <mesh position={[-0.26, 0, 0]} material={glassMat}>
          <boxGeometry args={[0.48, 0.46, 0.015]} />
        </mesh>
        {/* Right Toughened Glass Pane */}
        <mesh position={[0.26, 0, 0]} material={glassMat}>
          <boxGeometry args={[0.48, 0.46, 0.015]} />
        </mesh>
        {/* Center Frame Divider Pillar */}
        <mesh position={[0, 0, 0]} material={blackSteelMat}>
          <boxGeometry args={[0.04, 0.5, 0.045]} />
        </mesh>

        {/* Single Black Windshield Wiper */}
        <group position={[0.2, -0.22, 0.03]}>
          <mesh rotation={[0, 0, 0.35]} material={blackSteelMat}>
            <cylinderGeometry args={[0.004, 0.004, 0.26, 6]} />
          </mesh>
          <mesh position={[0.06, 0.18, 0]} rotation={[0, 0, 0.35]} material={rubberTireMat}>
            <boxGeometry args={[0.012, 0.24, 0.008]} />
          </mesh>
        </group>

        {/* Left & Right Side Rear-View Mirrors */}
        <group position={[-0.58, 0.06, 0]}>
          <mesh rotation={[0, 0, -0.3]} material={chromeMat}>
            <cylinderGeometry args={[0.006, 0.006, 0.16, 6]} />
          </mesh>
          <mesh position={[-0.05, 0.08, 0]} material={blackSteelMat}>
            <boxGeometry args={[0.02, 0.12, 0.07]} />
          </mesh>
        </group>
        <group position={[0.58, 0.06, 0]}>
          <mesh rotation={[0, 0, 0.3]} material={chromeMat}>
            <cylinderGeometry args={[0.006, 0.006, 0.16, 6]} />
          </mesh>
          <mesh position={[0.05, 0.08, 0]} material={blackSteelMat}>
            <boxGeometry args={[0.02, 0.12, 0.07]} />
          </mesh>
        </group>
      </group>

      {/* 5. DRIVER COCKPIT, HANDLEBAR & ICONIC FARE METER */}
      <group position={[0, 0.65, 0.38]}>
        {/* Driver Steer Handlebar Column */}
        <mesh position={[0, 0.06, 0.14]} rotation={[-0.2, 0, 0]} material={blackSteelMat}>
          <cylinderGeometry args={[0.018, 0.018, 0.38, 8]} />
        </mesh>
        {/* Handlebar Cross Tube */}
        <mesh position={[0, 0.22, 0.1]} rotation={[0, 0, Math.PI / 2]} material={chromeMat}>
          <cylinderGeometry args={[0.012, 0.012, 0.52, 10]} />
        </mesh>
        {/* Left & Right Rubber Grips */}
        <mesh position={[-0.24, 0.22, 0.1]} rotation={[0, 0, Math.PI / 2]} material={rubberTireMat}>
          <cylinderGeometry args={[0.016, 0.016, 0.1, 8]} />
        </mesh>
        <mesh position={[0.24, 0.22, 0.1]} rotation={[0, 0, Math.PI / 2]} material={rubberTireMat}>
          <cylinderGeometry args={[0.016, 0.016, 0.1, 8]} />
        </mesh>

        {/* Speedometer Instrument Dial */}
        <mesh position={[0, 0.23, 0.06]} rotation={[0.4, 0, 0]} material={blackSteelMat}>
          <cylinderGeometry args={[0.045, 0.045, 0.025, 14]} />
        </mesh>

        {/* Iconic Mechanical / Digital Indian Auto FARE METER (Right A-Pillar) */}
        {hasFareMeter && (
          <group position={[0.48, 0.32, 0.16]}>
            {/* Meter Metal Box (Black/Yellow) */}
            <mesh castShadow material={blackSteelMat}>
              <boxGeometry args={[0.11, 0.14, 0.08]} />
            </mesh>
            {/* Glowing Digital / Flip Fare Display */}
            <mesh position={[0, 0.02, -0.041]} material={meterDigitalMat}>
              <boxGeometry args={[0.085, 0.045, 0.005]} />
            </mesh>
            {/* "HIRED / FOR HIRE" Top Flag / Lamp */}
            <mesh position={[0, 0.09, 0]} material={tailLampRedMat}>
              <boxGeometry args={[0.05, 0.035, 0.03]} />
            </mesh>
            {/* Support Mounting Arm */}
            <mesh position={[-0.04, -0.08, 0]} rotation={[0, 0, -0.3]} material={blackSteelMat}>
              <cylinderGeometry args={[0.006, 0.006, 0.12, 6]} />
            </mesh>
          </group>
        )}

        {/* Driver Bench Seat */}
        <group position={[0, -0.12, -0.2]}>
          <mesh castShadow material={seatUpholsteryMat}>
            <boxGeometry args={[0.72, 0.11, 0.34]} />
          </mesh>
          {/* Driver Backrest Pad */}
          <mesh position={[0, 0.16, -0.16]} castShadow material={seatUpholsteryMat}>
            <boxGeometry args={[0.68, 0.22, 0.06]} />
          </mesh>
          {/* Engine Access Cowl Hump under driver */}
          <mesh position={[0, -0.18, 0]} material={bodyPaintMat}>
            <boxGeometry args={[0.65, 0.24, 0.42]} />
          </mesh>
        </group>
      </group>

      {/* 6. PASSENGER CABIN & REAR BENCH SEAT */}
      <group position={[0, 0.58, -0.58]}>
        {/* Wide Cushioned Passenger Bench Seat */}
        <mesh position={[0, -0.06, 0]} castShadow material={seatUpholsteryMat}>
          <boxGeometry args={[1.14, 0.14, 0.48]} />
        </mesh>
        {/* Tall Cushioned Passenger Backrest */}
        <mesh position={[0, 0.24, -0.21]} castShadow material={seatUpholsteryMat}>
          <boxGeometry args={[1.12, 0.46, 0.08]} />
        </mesh>

        {/* Side Passenger Entry Grab Rails */}
        <mesh position={[-0.58, 0.16, 0.18]} material={chromeMat}>
          <cylinderGeometry args={[0.01, 0.01, 0.58, 8]} />
        </mesh>
        <mesh position={[0.58, 0.16, 0.18]} material={chromeMat}>
          <cylinderGeometry args={[0.01, 0.01, 0.58, 8]} />
        </mesh>

        {/* Rear Luggage Space Behind Seat */}
        {hasLuggageNet && (
          <group position={[0, 0.18, -0.32]}>
            <mesh material={blackSteelMat}>
              <boxGeometry args={[1.12, 0.34, 0.015]} />
            </mesh>
          </group>
        )}
      </group>

      {/* 7. TUBULAR CANOPY ROOF FRAME & YELLOW ROOF COVER */}
      <group position={[0, 1.48, 0]}>
        {/* Main Yellow Canopy Fabric Top */}
        <mesh castShadow material={roofCanopyMat}>
          <boxGeometry args={[1.24, 0.12, 2.22]} />
        </mesh>
        {/* Curved Canopy Peak / Crown */}
        <mesh position={[0, 0.06, 0]} castShadow material={roofCanopyMat}>
          <cylinderGeometry
            args={[1.15, 1.15, 2.18, 16, 1, false, -Math.PI * 0.2, Math.PI * 0.4]}
          />
        </mesh>

        {/* Black Roof Trim Edge */}
        <mesh position={[0, -0.06, 0]} material={blackSteelMat}>
          <boxGeometry args={[1.26, 0.025, 2.24]} />
        </mesh>

        {/* 4 Canopy Support Steel Pillars (A-Pillars & B/C-Pillars) */}
        {/* Front Left A-Pillar */}
        <mesh position={[-0.56, -0.5, 0.72]} rotation={[0.08, 0, 0.04]} material={blackSteelMat}>
          <cylinderGeometry args={[0.016, 0.016, 0.98, 8]} />
        </mesh>
        {/* Front Right A-Pillar */}
        <mesh position={[0.56, -0.5, 0.72]} rotation={[0.08, 0, -0.04]} material={blackSteelMat}>
          <cylinderGeometry args={[0.016, 0.016, 0.98, 8]} />
        </mesh>
        {/* Rear Left Pillar */}
        <mesh position={[-0.58, -0.52, -0.92]} material={blackSteelMat}>
          <cylinderGeometry args={[0.016, 0.016, 0.95, 8]} />
        </mesh>
        {/* Rear Right Pillar */}
        <mesh position={[0.58, -0.52, -0.92]} material={blackSteelMat}>
          <cylinderGeometry args={[0.016, 0.016, 0.95, 8]} />
        </mesh>

        {/* Passenger Overhead Hanging Grab Handles (Straps) */}
        <group position={[-0.32, -0.16, -0.3]}>
          <mesh material={rubberTireMat}>
            <cylinderGeometry args={[0.008, 0.008, 0.18, 6]} />
          </mesh>
          <mesh position={[0, -0.09, 0]} rotation={[Math.PI / 2, 0, 0]} material={chromeMat}>
            <torusGeometry args={[0.032, 0.006, 8, 14]} />
          </mesh>
        </group>
        <group position={[0.32, -0.16, -0.3]}>
          <mesh material={rubberTireMat}>
            <cylinderGeometry args={[0.008, 0.008, 0.18, 6]} />
          </mesh>
          <mesh position={[0, -0.09, 0]} rotation={[Math.PI / 2, 0, 0]} material={chromeMat}>
            <torusGeometry args={[0.032, 0.006, 8, 14]} />
          </mesh>
        </group>

        {/* Rolled Weatherproof Rexine Curtains (Side Curtains with Straps) */}
        {hasCurtains && (
          <>
            {/* Left Rolled Curtain */}
            <mesh position={[-0.6, -0.09, 0.05]} rotation={[Math.PI / 2, 0, 0]} material={curtainMat}>
              <cylinderGeometry args={[0.035, 0.035, 1.85, 10]} />
            </mesh>
            {/* Right Rolled Curtain */}
            <mesh position={[0.6, -0.09, 0.05]} rotation={[Math.PI / 2, 0, 0]} material={curtainMat}>
              <cylinderGeometry args={[0.035, 0.035, 1.85, 10]} />
            </mesh>
          </>
        )}
      </group>

      {/* 8. REAR ENGINE COMPARTMENT, VENTILATION LOUVERS & TAIL LIGHTS */}
      <group position={[0, 0.62, -1.02]}>
        {/* Rear Engine Cover Hatch (Sloped metal hatch) */}
        <mesh rotation={[-0.12, 0, 0]} castShadow material={bodyPaintMat}>
          <boxGeometry args={[1.22, 0.68, 0.22]} />
        </mesh>

        {/* Horizontal Engine Louver Cooling Slits */}
        {[-0.14, -0.08, -0.02, 0.04, 0.1].map((y, i) => (
          <mesh key={`louver-${i}`} position={[0, y, -0.115]} material={blackSteelMat}>
            <boxGeometry args={[0.68, 0.02, 0.01]} />
          </mesh>
        ))}

        {/* Rear Left Light Cluster (Brake, Indicator, Reflector) */}
        <group position={[-0.48, 0.02, -0.11]}>
          <mesh position={[0, 0.04, 0]} material={tailLampRedMat}>
            <boxGeometry args={[0.08, 0.06, 0.02]} />
          </mesh>
          <mesh position={[0, -0.04, 0]} material={indicatorAmberMat}>
            <boxGeometry args={[0.08, 0.06, 0.02]} />
          </mesh>
        </group>

        {/* Rear Right Light Cluster */}
        <group position={[0.48, 0.02, -0.11]}>
          <mesh position={[0, 0.04, 0]} material={tailLampRedMat}>
            <boxGeometry args={[0.08, 0.06, 0.02]} />
          </mesh>
          <mesh position={[0, -0.04, 0]} material={indicatorAmberMat}>
            <boxGeometry args={[0.08, 0.06, 0.02]} />
          </mesh>
        </group>

        {/* Rear Number Plate Board & Light */}
        <mesh position={[0, -0.18, -0.115]} material={blackSteelMat}>
          <boxGeometry args={[0.32, 0.11, 0.012]} />
        </mesh>
        <mesh position={[0, -0.18, -0.122]} material={chromeMat}>
          <boxGeometry args={[0.29, 0.09, 0.005]} />
        </mesh>

        {/* CNG Green Tag / Indian Street Slogan Plate */}
        <mesh position={[0, 0.22, -0.112]} material={blackSteelMat}>
          <boxGeometry args={[0.44, 0.06, 0.008]} />
        </mesh>
      </group>

      {/* 9. HEAVY-DUTY TUBULAR FRONT & REAR BUMPERS */}
      {/* Front Crash Bumper Guard */}
      {hasFrontBumper && (
        <group position={[0, 0.28, 1.14]}>
          {/* Main Horizontal Bumper Bar */}
          <mesh rotation={[0, 0, Math.PI / 2]} material={blackSteelMat}>
            <cylinderGeometry args={[0.018, 0.018, 0.88, 10]} />
          </mesh>
          {/* Left & Right Angled Corner Guards */}
          <mesh position={[-0.42, 0.04, -0.08]} rotation={[0, -0.65, 0]} material={blackSteelMat}>
            <cylinderGeometry args={[0.016, 0.016, 0.22, 8]} />
          </mesh>
          <mesh position={[0.42, 0.04, -0.08]} rotation={[0, 0.65, 0]} material={blackSteelMat}>
            <cylinderGeometry args={[0.016, 0.016, 0.22, 8]} />
          </mesh>
        </group>
      )}

      {/* Rear Full-Width Tubular Bumper Bar */}
      {hasRearBumper && (
        <group position={[0, 0.24, -1.16]}>
          {/* Main Full Bar */}
          <mesh rotation={[0, 0, Math.PI / 2]} material={blackSteelMat}>
            <cylinderGeometry args={[0.02, 0.02, 1.28, 10]} />
          </mesh>
          {/* Left & Right Corner Bumpers */}
          <mesh position={[-0.62, 0.06, 0.08]} rotation={[0, 0.6, 0]} material={blackSteelMat}>
            <cylinderGeometry args={[0.018, 0.018, 0.22, 8]} />
          </mesh>
          <mesh position={[0.62, 0.06, 0.08]} rotation={[0, -0.6, 0]} material={blackSteelMat}>
            <cylinderGeometry args={[0.018, 0.018, 0.22, 8]} />
          </mesh>
          {/* Bumper Mounts to Chassis */}
          <mesh position={[-0.32, 0, 0.08]} rotation={[Math.PI / 2, 0, 0]} material={blackSteelMat}>
            <cylinderGeometry args={[0.015, 0.015, 0.16, 8]} />
          </mesh>
          <mesh position={[0.32, 0, 0.08]} rotation={[Math.PI / 2, 0, 0]} material={blackSteelMat}>
            <cylinderGeometry args={[0.015, 0.015, 0.16, 8]} />
          </mesh>
        </group>
      )}
    </group>
  );
};
