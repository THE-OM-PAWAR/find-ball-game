import React, { useMemo } from 'react';
import * as THREE from 'three';

export interface BicycleConfig {
  frameColor: string;
  hasCarrier: boolean;
  hasBell: boolean;
  hasDynamoLight: boolean;
  hasChainCover: boolean;
  hasDoubleTopTube: boolean;
}

/**
 * Iconic Heavy-Duty Indian Roadster Bicycle (Atlas / Hero / Avon Style)
 * High-fidelity 1:1 metric model:
 * - 1.80m length x 1.02m height x 0.58m handlebar width
 * - Authentic double top-tube heavy duty welded steel diamond frame
 * - 28-inch spoked wheels with chrome rims and deep mudguards
 * - Full enclosed metal chaincase with central crankset and rubber block pedals
 * - Upright swept chrome handlebars with rod-pull brake levers & classic rotary bell
 * - Sprung wide leatherette saddle with twin chrome coil suspension springs
 * - Heavy-duty rear steel luggage carrier rack & rear-axle double-leg parking stand
 * - Fork-mounted bottle dynamo generator with vintage bullet chrome headlamp
 */
export const ClassicIndianBicycle: React.FC<{
  config?: Partial<BicycleConfig>;
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
    frameColor = '#0f172a', // Classic vintage black / deep midnight green
    hasCarrier = true,
    hasBell = true,
    hasDynamoLight = true,
    hasChainCover = true,
    hasDoubleTopTube = true,
  } = config;

  // Materials
  const frameMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: frameColor,
        roughness: 0.35,
        metalness: 0.45,
      }),
    [frameColor]
  );

  const chromeMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#f8fafc',
        roughness: 0.12,
        metalness: 0.98,
      }),
    []
  );

  const rubberTireMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#1e2124',
        roughness: 0.85,
        metalness: 0.05,
      }),
    []
  );

  const saddleLeatherMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#38220f', // Classic dark tan vintage leather
        roughness: 0.75,
        metalness: 0.1,
      }),
    []
  );

  const darkGripMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#111827',
        roughness: 0.8,
        metalness: 0.1,
      }),
    []
  );

  const whiteSafetyMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#f8fafc',
        roughness: 0.4,
        metalness: 0.1,
      }),
    []
  );

  const reflectorAmberMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#f59e0b',
        emissive: '#d97706',
        emissiveIntensity: 0.2,
        roughness: 0.2,
      }),
    []
  );

  const dynamoHeadlightMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#fffbeb',
        emissive: '#fef08a',
        emissiveIntensity: 0.4,
        roughness: 0.1,
        metalness: 0.9,
      }),
    []
  );

  const goldPinstripeMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#eab308',
        roughness: 0.3,
        metalness: 0.8,
      }),
    []
  );

  return (
    <group position={position} rotation={rotation} scale={scale}>
      {/* 1. REAR AXLE DOUBLE-LEG PARKING STAND (Flips down behind rear wheel) */}
      <group position={[0, 0.22, -0.6]}>
        {/* Left Stand Leg */}
        <mesh position={[-0.14, -0.1, 0.06]} rotation={[0.2, 0, 0.22]} material={frameMat}>
          <cylinderGeometry args={[0.007, 0.007, 0.28, 6]} />
        </mesh>
        {/* Right Stand Leg */}
        <mesh position={[0.14, -0.1, 0.06]} rotation={[0.2, 0, -0.22]} material={frameMat}>
          <cylinderGeometry args={[0.007, 0.007, 0.28, 6]} />
        </mesh>
        {/* Cross Bottom Connecting Bar */}
        <mesh position={[0, -0.22, 0.1]} rotation={[0, 0, Math.PI / 2]} material={frameMat}>
          <cylinderGeometry args={[0.007, 0.007, 0.32, 6]} />
        </mesh>
      </group>

      {/* 2. AUTHENTIC HEAVY-DUTY DOUBLE TOP-TUBE FRAME */}
      <group>
        {/* Bottom Bracket Shell (Center Crank Pivot) */}
        <mesh position={[0, 0.28, 0]} rotation={[0, 0, Math.PI / 2]} material={frameMat}>
          <cylinderGeometry args={[0.024, 0.024, 0.08, 12]} />
        </mesh>

        {/* Seat Tube (BB to Saddle Lug) */}
        <mesh position={[0, 0.54, -0.06]} rotation={[0.26, 0, 0]} castShadow material={frameMat}>
          <cylinderGeometry args={[0.015, 0.015, 0.58, 10]} />
        </mesh>

        {/* Head Tube (Steering Fork Column) */}
        <mesh position={[0, 0.74, 0.58]} rotation={[-0.32, 0, 0]} castShadow material={frameMat}>
          <cylinderGeometry args={[0.018, 0.018, 0.22, 10]} />
        </mesh>

        {/* Primary Upper Top Tube */}
        <mesh position={[0, 0.76, 0.25]} rotation={[0.04, 0, 0]} castShadow material={frameMat}>
          <cylinderGeometry args={[0.014, 0.014, 0.64, 8]} />
        </mesh>

        {/* Iconic Indian Second Parallel Top Tube (Double Bar Frame) */}
        {hasDoubleTopTube && (
          <group>
            <mesh position={[0, 0.7, 0.25]} rotation={[0.04, 0, 0]} castShadow material={frameMat}>
              <cylinderGeometry args={[0.012, 0.012, 0.63, 8]} />
            </mesh>
            {/* Gold Pinstripe Accent Ring */}
            <mesh position={[0, 0.7, 0.25]} rotation={[0.04, 0, 0]} material={goldPinstripeMat}>
              <cylinderGeometry args={[0.013, 0.013, 0.06, 8]} />
            </mesh>
          </group>
        )}

        {/* Down Tube (BB to Head Tube) */}
        <mesh position={[0, 0.49, 0.28]} rotation={[-0.6, 0, 0]} castShadow material={frameMat}>
          <cylinderGeometry args={[0.015, 0.015, 0.68, 8]} />
        </mesh>

        {/* Chain Stays (BB to Rear Axle) */}
        <mesh position={[-0.045, 0.32, -0.31]} rotation={[0.12, 0, 0]} material={frameMat}>
          <cylinderGeometry args={[0.01, 0.01, 0.46, 6]} />
        </mesh>
        <mesh position={[0.045, 0.32, -0.31]} rotation={[0.12, 0, 0]} material={frameMat}>
          <cylinderGeometry args={[0.01, 0.01, 0.46, 6]} />
        </mesh>

        {/* Seat Stays (Seat Lug to Rear Axle) */}
        <mesh position={[-0.045, 0.54, -0.34]} rotation={[-0.68, 0, 0]} material={frameMat}>
          <cylinderGeometry args={[0.009, 0.009, 0.58, 6]} />
        </mesh>
        <mesh position={[0.045, 0.54, -0.34]} rotation={[-0.68, 0, 0]} material={frameMat}>
          <cylinderGeometry args={[0.009, 0.009, 0.58, 6]} />
        </mesh>
      </group>

      {/* 3. FRONT 28-INCH SPOKED WHEEL & FORK */}
      <group position={[0, 0.36, 0.66]}>
        {/* 28" Black Rubber Tire */}
        <mesh rotation={[0, Math.PI / 2, 0]} castShadow material={rubberTireMat}>
          <torusGeometry args={[0.355, 0.022, 12, 32]} />
        </mesh>
        {/* Deep High-Polish Chrome Rim */}
        <mesh rotation={[0, Math.PI / 2, 0]} material={chromeMat}>
          <torusGeometry args={[0.338, 0.012, 10, 32]} />
        </mesh>
        {/* Front Chrome Center Hub */}
        <mesh rotation={[0, 0, Math.PI / 2]} material={chromeMat}>
          <cylinderGeometry args={[0.024, 0.024, 0.075, 12]} />
        </mesh>
        {/* Steel Wire Spokes (Realistic 36-spoke cross pattern) */}
        {[0, 20, 40, 60, 80, 100, 120, 140, 160].map((deg, i) => (
          <mesh
            key={`f-spoke-${i}`}
            rotation={[THREE.MathUtils.degToRad(deg), 0, 0]}
            material={chromeMat}
          >
            <cylinderGeometry args={[0.0012, 0.0012, 0.68, 4]} />
          </mesh>
        ))}

        {/* Curved Front Mudguard / Fender with Chrome Tip */}
        <group position={[0, 0.02, 0]}>
          <mesh position={[0, 0.22, 0.06]} rotation={[0.26, 0, 0]} castShadow material={frameMat}>
            <cylinderGeometry
              args={[0.38, 0.38, 0.045, 16, 1, true, -Math.PI * 0.45, Math.PI * 0.85]}
            />
          </mesh>
          {/* Mudguard Stays (Braces to Axle) */}
          <mesh position={[-0.035, 0.12, 0.14]} rotation={[0.5, 0, 0]} material={chromeMat}>
            <cylinderGeometry args={[0.003, 0.003, 0.32, 4]} />
          </mesh>
          <mesh position={[0.035, 0.12, 0.14]} rotation={[0.5, 0, 0]} material={chromeMat}>
            <cylinderGeometry args={[0.003, 0.003, 0.32, 4]} />
          </mesh>
        </group>
      </group>

      {/* Front Rigid Steel Fork */}
      <group position={[0, 0.58, 0.62]} rotation={[-0.32, 0, 0]}>
        {/* Fork Crown & Steerer */}
        <mesh position={[0, 0.12, 0]} material={frameMat}>
          <boxGeometry args={[0.09, 0.028, 0.035]} />
        </mesh>
        {/* Left Fork Blade */}
        <mesh position={[-0.04, -0.15, 0]} material={frameMat}>
          <cylinderGeometry args={[0.011, 0.008, 0.44, 8]} />
        </mesh>
        {/* Right Fork Blade */}
        <mesh position={[0.04, -0.15, 0]} material={frameMat}>
          <cylinderGeometry args={[0.011, 0.008, 0.44, 8]} />
        </mesh>
      </group>

      {/* 4. REAR 28-INCH SPOKED WHEEL & SAFETY PATCH MUDGUARD */}
      <group position={[0, 0.36, -0.6]}>
        {/* 28" Black Rubber Tire */}
        <mesh rotation={[0, Math.PI / 2, 0]} castShadow material={rubberTireMat}>
          <torusGeometry args={[0.355, 0.022, 12, 32]} />
        </mesh>
        {/* Chrome Rim */}
        <mesh rotation={[0, Math.PI / 2, 0]} material={chromeMat}>
          <torusGeometry args={[0.338, 0.012, 10, 32]} />
        </mesh>
        {/* Rear Axle Hub & Single-Speed Freewheel Sprocket */}
        <mesh rotation={[0, 0, Math.PI / 2]} material={chromeMat}>
          <cylinderGeometry args={[0.028, 0.028, 0.08, 12]} />
        </mesh>
        {/* Rear Spokes */}
        {[0, 20, 40, 60, 80, 100, 120, 140, 160].map((deg, i) => (
          <mesh
            key={`r-spoke-${i}`}
            rotation={[THREE.MathUtils.degToRad(deg), 0, 0]}
            material={chromeMat}
          >
            <cylinderGeometry args={[0.0012, 0.0012, 0.68, 4]} />
          </mesh>
        ))}

        {/* Deep Full Rear Mudguard */}
        <group position={[0, 0.02, 0]}>
          <mesh position={[0, 0.22, -0.06]} rotation={[-0.32, 0, 0]} castShadow material={frameMat}>
            <cylinderGeometry
              args={[0.38, 0.38, 0.045, 16, 1, true, -Math.PI * 0.75, Math.PI * 0.95]}
            />
          </mesh>
          {/* Iconic White Painted Safety Tail Patch (Indian regulation feature) */}
          <mesh position={[0, -0.08, -0.36]} rotation={[-1.15, 0, 0]} material={whiteSafetyMat}>
            <boxGeometry args={[0.046, 0.12, 0.005]} />
          </mesh>
          {/* Rear Red Cat-Eye Reflector */}
          <mesh position={[0, -0.02, -0.38]} material={reflectorAmberMat}>
            <cylinderGeometry args={[0.014, 0.014, 0.008, 8]} />
          </mesh>
          {/* Rear Fender Stays */}
          <mesh position={[-0.035, 0.08, -0.16]} rotation={[-0.45, 0, 0]} material={chromeMat}>
            <cylinderGeometry args={[0.003, 0.003, 0.34, 4]} />
          </mesh>
          <mesh position={[0.035, 0.08, -0.16]} rotation={[-0.45, 0, 0]} material={chromeMat}>
            <cylinderGeometry args={[0.003, 0.003, 0.34, 4]} />
          </mesh>
        </group>
      </group>

      {/* 5. FULL METAL ENCLOSED CHAINCASE & CRANKSET */}
      {hasChainCover ? (
        <group position={[0.05, 0.3, -0.3]}>
          {/* Enclosed Steel Chain Cover */}
          <mesh castShadow material={frameMat}>
            <boxGeometry args={[0.03, 0.13, 0.62]} />
          </mesh>
          {/* Front Round Chainwheel Housing */}
          <mesh position={[0, -0.02, 0.3]} rotation={[0, 0, Math.PI / 2]} material={frameMat}>
            <cylinderGeometry args={[0.11, 0.11, 0.032, 16]} />
          </mesh>
          {/* Gold Decorative Pinstripe on Chaingaurd */}
          <mesh position={[0.016, 0, 0]} material={goldPinstripeMat}>
            <boxGeometry args={[0.002, 0.015, 0.54]} />
          </mesh>
          {/* Right Pedal Crank Arm */}
          <mesh position={[0.035, 0.02, 0.3]} rotation={[0.6, 0, 0]} material={chromeMat}>
            <boxGeometry args={[0.012, 0.17, 0.022]} />
          </mesh>
          {/* Right Rubber Block Pedal with Reflectors */}
          <mesh position={[0.075, 0.09, 0.36]} material={darkGripMat}>
            <boxGeometry args={[0.065, 0.022, 0.09]} />
          </mesh>
          {/* Left Pedal Crank Arm */}
          <mesh position={[-0.135, -0.06, 0.3]} rotation={[-0.6, 0, 0]} material={chromeMat}>
            <boxGeometry args={[0.012, 0.17, 0.022]} />
          </mesh>
          {/* Left Rubber Block Pedal */}
          <mesh position={[-0.175, -0.13, 0.24]} material={darkGripMat}>
            <boxGeometry args={[0.065, 0.022, 0.09]} />
          </mesh>
        </group>
      ) : (
        /* Open Chainset fallback */
        <group position={[0.05, 0.28, 0]}>
          <mesh rotation={[0, 0, Math.PI / 2]} material={chromeMat}>
            <cylinderGeometry args={[0.09, 0.09, 0.008, 16]} />
          </mesh>
        </group>
      )}

      {/* 6. SPRUNG LEATHER SADDLE WITH TWIN CHROME SPRINGS */}
      <group position={[0, 0.86, -0.16]}>
        {/* Chrome Adjustable Seatpost */}
        <mesh position={[0, -0.08, 0.02]} rotation={[0.26, 0, 0]} material={chromeMat}>
          <cylinderGeometry args={[0.012, 0.012, 0.22, 8]} />
        </mesh>
        {/* Under-saddle Steel Subframe */}
        <mesh position={[0, 0.01, 0]} material={chromeMat}>
          <boxGeometry args={[0.12, 0.015, 0.18]} />
        </mesh>
        {/* Left Chrome Suspension Coil Spring */}
        <mesh position={[-0.055, -0.03, -0.07]} material={chromeMat}>
          <cylinderGeometry args={[0.018, 0.018, 0.07, 8]} />
        </mesh>
        {/* Right Chrome Suspension Coil Spring */}
        <mesh position={[0.055, -0.03, -0.07]} material={chromeMat}>
          <cylinderGeometry args={[0.018, 0.018, 0.07, 8]} />
        </mesh>
        {/* Wide Contoured Leatherette Saddle Top */}
        <mesh position={[0, 0.04, 0]} rotation={[-0.05, 0, 0]} castShadow material={saddleLeatherMat}>
          <boxGeometry args={[0.21, 0.045, 0.26]} />
        </mesh>
        {/* Tapered Saddle Nose */}
        <mesh position={[0, 0.035, 0.14]} rotation={[-0.05, 0, 0]} castShadow material={saddleLeatherMat}>
          <boxGeometry args={[0.09, 0.04, 0.12]} />
        </mesh>
      </group>

      {/* 7. UPRIGHT SWEPT CHROME HANDLEBARS, ROD BRAKES & ROTARY BELL */}
      <group position={[0, 0.96, 0.5]}>
        {/* Chrome Stem / Quill */}
        <mesh position={[0, -0.12, 0.04]} rotation={[-0.32, 0, 0]} material={chromeMat}>
          <cylinderGeometry args={[0.012, 0.012, 0.26, 8]} />
        </mesh>
        {/* Central Handlebar Clamp & Rise */}
        <mesh position={[0, 0, 0]} rotation={[0, 0, Math.PI / 2]} material={chromeMat}>
          <cylinderGeometry args={[0.011, 0.011, 0.24, 12]} />
        </mesh>
        {/* Left Swept Bar */}
        <mesh position={[-0.21, 0.02, -0.08]} rotation={[0, 0.45, Math.PI / 2]} material={chromeMat}>
          <cylinderGeometry args={[0.011, 0.011, 0.26, 12]} />
        </mesh>
        {/* Right Swept Bar */}
        <mesh position={[0.21, 0.02, -0.08]} rotation={[0, -0.45, Math.PI / 2]} material={chromeMat}>
          <cylinderGeometry args={[0.011, 0.011, 0.26, 12]} />
        </mesh>
        {/* Left Ribbed Black Rubber Grip */}
        <mesh position={[-0.28, 0.02, -0.16]} rotation={[0, 0.45, Math.PI / 2]} material={darkGripMat}>
          <cylinderGeometry args={[0.016, 0.016, 0.12, 8]} />
        </mesh>
        {/* Right Ribbed Black Rubber Grip */}
        <mesh position={[0.28, 0.02, -0.16]} rotation={[0, -0.45, Math.PI / 2]} material={darkGripMat}>
          <cylinderGeometry args={[0.016, 0.016, 0.12, 8]} />
        </mesh>

        {/* Traditional Rod-Pull Brake Levers & Metal Linkage Rods */}
        <mesh position={[-0.14, -0.015, -0.03]} rotation={[0, 0.2, 0]} material={chromeMat}>
          <boxGeometry args={[0.16, 0.008, 0.014]} />
        </mesh>
        <mesh position={[0.14, -0.015, -0.03]} rotation={[0, -0.2, 0]} material={chromeMat}>
          <boxGeometry args={[0.16, 0.008, 0.014]} />
        </mesh>
        {/* Central Rod Linkage going down head tube */}
        <mesh position={[0, -0.15, 0.07]} material={chromeMat}>
          <cylinderGeometry args={[0.003, 0.003, 0.24, 4]} />
        </mesh>

        {/* Iconic Chrome Dome Rotary Bicycle Bell (Left Handlebar) */}
        {hasBell && (
          <group position={[-0.15, 0.04, -0.03]}>
            <mesh castShadow material={chromeMat}>
              <sphereGeometry args={[0.028, 14, 10, 0, Math.PI * 2, 0, Math.PI * 0.55]} />
            </mesh>
            <mesh position={[-0.025, 0, 0]} rotation={[0, 0, 0.4]} material={chromeMat}>
              <boxGeometry args={[0.02, 0.006, 0.012]} />
            </mesh>
          </group>
        )}
      </group>

      {/* 8. FORK DYNAMO & VINTAGE BULLET HEADLIGHT */}
      {hasDynamoLight && (
        <group position={[0, 0.72, 0.62]}>
          {/* Round Chrome Bullet Headlamp */}
          <group position={[0, 0.02, 0.08]}>
            <mesh castShadow material={chromeMat}>
              <sphereGeometry args={[0.045, 14, 10, 0, Math.PI * 2, 0, Math.PI * 0.58]} />
            </mesh>
            <mesh position={[0, 0, 0.035]} rotation={[Math.PI / 2, 0, 0]} material={dynamoHeadlightMat}>
              <cylinderGeometry args={[0.04, 0.04, 0.01, 14]} />
            </mesh>
            {/* Chrome Mounting Bracket to Headset */}
            <mesh position={[0, -0.04, -0.04]} rotation={[0.4, 0, 0]} material={chromeMat}>
              <boxGeometry args={[0.012, 0.08, 0.006]} />
            </mesh>
          </group>

          {/* Bottle Dynamo on Right Fork Blade */}
          <group position={[0.065, -0.14, -0.01]}>
            <mesh material={chromeMat}>
              <cylinderGeometry args={[0.016, 0.016, 0.075, 8]} />
            </mesh>
            <mesh position={[0, 0.045, 0]} material={rubberTireMat}>
              <cylinderGeometry args={[0.01, 0.01, 0.02, 8]} />
            </mesh>
          </group>
        </group>
      )}

      {/* 9. HEAVY-DUTY REAR TUBULAR STEEL LUGGAGE CARRIER RACK */}
      {hasCarrier && (
        <group position={[0, 0.74, -0.48]}>
          {/* Main Flat Platform Bars */}
          <mesh castShadow material={frameMat}>
            <boxGeometry args={[0.16, 0.015, 0.42]} />
          </mesh>
          {/* Longitudinal Wire Struts */}
          <mesh position={[-0.05, 0.01, 0]} material={chromeMat}>
            <cylinderGeometry args={[0.003, 0.003, 0.4, 4]} />
          </mesh>
          <mesh position={[0.05, 0.01, 0]} material={chromeMat}>
            <cylinderGeometry args={[0.003, 0.003, 0.4, 4]} />
          </mesh>
          {/* Spring-Loaded Clamp Bar (Clip) */}
          <mesh position={[0, 0.025, 0.08]} material={chromeMat}>
            <boxGeometry args={[0.14, 0.01, 0.02]} />
          </mesh>
          {/* Tubular Support Stays to Rear Axle */}
          <mesh position={[-0.07, -0.2, -0.06]} rotation={[0.22, 0, 0]} material={frameMat}>
            <cylinderGeometry args={[0.006, 0.006, 0.42, 6]} />
          </mesh>
          <mesh position={[0.07, -0.2, -0.06]} rotation={[0.22, 0, 0]} material={frameMat}>
            <cylinderGeometry args={[0.006, 0.006, 0.42, 6]} />
          </mesh>
        </group>
      )}
    </group>
  );
};
