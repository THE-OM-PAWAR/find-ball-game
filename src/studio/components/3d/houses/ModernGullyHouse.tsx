import React, { useMemo } from 'react';
import * as THREE from 'three';
import { WaterTank, DishAntenna } from '../HouseProps';

export interface ModernHouseConfig {
  mainColor: string;
  accentColor: string;
  frameColor: string;
  hasWaterTank: boolean;
  hasDishAntenna: boolean;
  hasPalmTree: boolean;
  hasStreetLamp: boolean;
  hasInteriorGlow: boolean;
}

/**
 * Modern 2-Storey Architectural Villa
 * Exact 1:1 match to reference render:
 * - Clean L-shaped side garden bed with correctly positioned palm tree
 * - Sculptural cantilever C-frame balcony
 * - Recessed ground entrance with 3 steps
 * - Inset windows with black sills
 * - Continuous clean parapet with flat roof
 */
export const ModernGullyHouse: React.FC<{
  config?: Partial<ModernHouseConfig>;
  position?: [number, number, number];
  rotation?: [number, number, number];
}> = ({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  config = {},
}) => {
  const {
    mainColor = '#c7ab85', // Warm sand ochre
    accentColor = '#2f353d', // Dark charcoal slate
    frameColor = '#f3f4f6', // Crisp off-white balcony frame
    hasWaterTank = false,
    hasDishAntenna = false,
    hasPalmTree = true,
    hasStreetLamp = true,
    hasInteriorGlow = true,
  } = config;

  // Architectural PBR Materials
  const mainMat = useMemo(
    () => new THREE.MeshStandardMaterial({ color: mainColor, roughness: 0.72, metalness: 0.05 }),
    [mainColor]
  );
  const accentMat = useMemo(
    () => new THREE.MeshStandardMaterial({ color: accentColor, roughness: 0.68, metalness: 0.08 }),
    [accentColor]
  );
  const frameMat = useMemo(
    () => new THREE.MeshStandardMaterial({ color: frameColor, roughness: 0.6, metalness: 0.05 }),
    [frameColor]
  );
  const darkTrimMat = useMemo(
    () => new THREE.MeshStandardMaterial({ color: '#16191f', roughness: 0.35, metalness: 0.6 }),
    []
  );
  const glassMat = useMemo(
    () => new THREE.MeshStandardMaterial({ color: '#090d16', roughness: 0.1, metalness: 0.95 }),
    []
  );
  const curtainGlowMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#fef3c7',
        emissive: '#fde68a',
        emissiveIntensity: 0.5,
        roughness: 0.6,
      }),
    []
  );

  return (
    <group position={position} rotation={rotation}>
      {/* 1. BASE PLINTH (Square white concrete platform with clean bevel) */}
      <mesh position={[0, 0.12, 0]} receiveShadow castShadow>
        <boxGeometry args={[7.4, 0.24, 7.4]} />
        <meshStandardMaterial color="#f1f5f9" roughness={0.9} />
      </mesh>

      {/* Front Entrance Steps (3 clean steps leading up to porch) */}
      <group position={[-0.45, 0.24, 1.85]}>
        <mesh position={[0, 0.04, 0.44]} receiveShadow castShadow>
          <boxGeometry args={[1.3, 0.08, 0.26]} />
          <meshStandardMaterial color="#e2e8f0" roughness={0.85} />
        </mesh>
        <mesh position={[0, 0.1, 0.22]} receiveShadow castShadow>
          <boxGeometry args={[1.3, 0.08, 0.26]} />
          <meshStandardMaterial color="#e2e8f0" roughness={0.85} />
        </mesh>
        <mesh position={[0, 0.16, 0]} receiveShadow castShadow>
          <boxGeometry args={[1.3, 0.08, 0.26]} />
          <meshStandardMaterial color="#e2e8f0" roughness={0.85} />
        </mesh>
      </group>

      {/* 2. LANDSCAPING GARDEN BED (L-Shaped Wrapping along the RIGHT SIDE FACADE) */}
      <group position={[0, 0.24, 0]}>
        {/* Front-Right Garden Strip */}
        <mesh position={[1.45, 0.015, 2.1]} receiveShadow>
          <boxGeometry args={[2.1, 0.03, 1.0]} />
          <meshStandardMaterial color="#38281e" roughness={0.95} />
        </mesh>
        {/* Side-Right Garden Strip */}
        <mesh position={[2.75, 0.015, 0.2]} receiveShadow>
          <boxGeometry args={[1.0, 0.03, 3.8]} />
          <meshStandardMaterial color="#38281e" roughness={0.95} />
        </mesh>

        {/* Low Shrubbery and Flowering Mounds (Arranged naturally along the garden bed) */}
        {[
          // Front strip shrubs
          { x: 0.65, z: 2.1, r: 0.18, color: '#4d7c0f' },
          { x: 1.15, z: 2.2, r: 0.22, color: '#3f6212' },
          { x: 1.65, z: 2.05, r: 0.2, color: '#65a30d', flower: '#e11d48' },
          { x: 2.15, z: 2.15, r: 0.19, color: '#4d7c0f' },
          // Side strip shrubs
          { x: 2.75, z: 1.4, r: 0.22, color: '#3f6212' },
          { x: 2.8, z: 0.8, r: 0.24, color: '#be185d', flower: '#f43f5e' },
          { x: 2.7, z: -0.4, r: 0.25, color: '#4d7c0f' },
          { x: 2.8, z: -1.0, r: 0.22, color: '#3f6212' },
          { x: 2.75, z: -1.5, r: 0.18, color: '#65a30d' },
        ].map((bush, i) => (
          <group key={i} position={[bush.x, bush.r * 0.65, bush.z]}>
            <mesh castShadow receiveShadow>
              <dodecahedronGeometry args={[bush.r, 1]} />
              <meshStandardMaterial color={bush.color} roughness={0.85} />
            </mesh>
            {bush.flower && (
              <mesh position={[0, bush.r * 0.7, 0]} castShadow>
                <sphereGeometry args={[0.07, 8, 8]} />
                <meshStandardMaterial color={bush.flower} roughness={0.7} />
              </mesh>
            )}
          </group>
        ))}

        {/* Slender Palm Tree (Positioned along RIGHT SIDE WALL matching Reference Render) */}
        {hasPalmTree && (
          <group position={[2.75, 0, 0.15]}>
            {/* Slender Curved Trunk */}
            {[
              { y: 0.3, r: 0.065, tilt: 0 },
              { y: 0.8, r: 0.058, tilt: -0.02 },
              { y: 1.3, r: 0.052, tilt: -0.05 },
              { y: 1.8, r: 0.046, tilt: -0.07 },
              { y: 2.3, r: 0.042, tilt: -0.05 },
            ].map((seg, idx) => (
              <mesh
                key={idx}
                position={[seg.tilt * (idx + 1) * 0.4, seg.y, 0]}
                rotation={[0, 0, seg.tilt]}
                castShadow
              >
                <cylinderGeometry args={[seg.r * 0.95, seg.r, 0.52, 10]} />
                <meshStandardMaterial color="#6b4c35" roughness={0.9} />
              </mesh>
            ))}

            {/* Arched Palm Fronds Canopy (Casting shadow across right facade) */}
            <group position={[-0.12, 2.55, 0]}>
              {[
                { angle: 0, droop: 0.55, len: 1.05 },
                { angle: 45, droop: 0.48, len: 1.15 },
                { angle: 90, droop: 0.6, len: 1.0 },
                { angle: 135, droop: 0.5, len: 1.1 },
                { angle: 180, droop: 0.45, len: 1.2 },
                { angle: 225, droop: 0.55, len: 1.05 },
                { angle: 270, droop: 0.62, len: 0.95 },
                { angle: 315, droop: 0.48, len: 1.15 },
              ].map((frond, idx) => (
                <group key={idx} rotation={[0, (frond.angle * Math.PI) / 180, 0]}>
                  <mesh
                    position={[frond.len * 0.45, -frond.droop * 0.35, 0]}
                    rotation={[0, 0, -frond.droop]}
                    castShadow
                  >
                    <boxGeometry args={[frond.len, 0.012, 0.11]} />
                    <meshStandardMaterial color="#3f6212" roughness={0.75} side={THREE.DoubleSide} />
                  </mesh>
                  {/* Detailed Pinnule leaves */}
                  {[-0.2, 0, 0.2].map((xOff, k) => (
                    <mesh
                      key={k}
                      position={[frond.len * 0.5 + xOff, -frond.droop * 0.4, 0]}
                      rotation={[0.25, 0, -frond.droop * 1.05]}
                      castShadow
                    >
                      <boxGeometry args={[0.3, 0.008, 0.16]} />
                      <meshStandardMaterial color="#4d7c0f" roughness={0.8} />
                    </mesh>
                  ))}
                </group>
              ))}
            </group>
          </group>
        )}
      </group>

      {/* Modern Minimalist Street Lamp Post on Left Sidewalk */}
      {hasStreetLamp && (
        <group position={[-2.4, 0.24, 2.3]}>
          <mesh position={[0, 0.85, 0]} castShadow>
            <cylinderGeometry args={[0.018, 0.018, 1.7, 8]} />
            <meshStandardMaterial color="#111827" metalness={0.8} roughness={0.3} />
          </mesh>
          <mesh position={[0.12, 1.7, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
            <cylinderGeometry args={[0.016, 0.016, 0.24, 8]} />
            <meshStandardMaterial color="#111827" metalness={0.8} roughness={0.3} />
          </mesh>
          <mesh position={[0.24, 1.68, 0]} castShadow>
            <boxGeometry args={[0.11, 0.025, 0.06]} />
            <meshStandardMaterial color="#030712" roughness={0.3} />
          </mesh>
        </group>
      )}

      {/* 3. SOLID MODULAR 2-STOREY ARCHITECTURAL VOLUMES */}
      <group position={[0, 0.24, -0.2]}>
        {/* Left Charcoal Slate Tower (Width: 1.7m, Height: 5.2m, Depth: 4.4m) */}
        <mesh position={[-1.45, 2.6, 0]} castShadow receiveShadow material={accentMat}>
          <boxGeometry args={[1.7, 5.2, 4.4]} />
        </mesh>

        {/* Right Warm Sand Main Body - Back Block (Full width 2.9m, Height: 5.2m, Depth: 2.4m) */}
        <mesh position={[0.85, 2.6, -1.0]} castShadow receiveShadow material={mainMat}>
          <boxGeometry args={[2.9, 5.2, 2.4]} />
        </mesh>

        {/* Right Warm Sand Main Body - Front Right Column (Width: 0.9m, Height: 5.2m, Depth: 2.0m) */}
        <mesh position={[1.85, 2.6, 1.2]} castShadow receiveShadow material={mainMat}>
          <boxGeometry args={[0.9, 5.2, 2.0]} />
        </mesh>

        {/* Recessed Ground Entrance Porch */}
        <group position={[-0.45, 1.25, 1.2]}>
          {/* Main Entrance Door */}
          <mesh position={[-0.15, 0, -0.92]} castShadow>
            <boxGeometry args={[0.9, 2.15, 0.06]} />
            <meshStandardMaterial color="#0f172a" roughness={0.3} metalness={0.7} />
          </mesh>
          {/* Vertical Stainless Handle */}
          <mesh position={[0.2, 0, -0.86]} castShadow material={darkTrimMat}>
            <cylinderGeometry args={[0.012, 0.012, 0.9, 8]} />
          </mesh>
          {/* Vertical Sidelight Window */}
          <mesh position={[0.55, 0, -0.92]} castShadow>
            <boxGeometry args={[0.25, 1.9, 0.05]} />
            <primitive object={glassMat} />
          </mesh>
        </group>

        {/* 4. SCULPTURAL CANTILEVER BALCONY (Crisp White Frame) */}
        <group position={[-0.45, 3.8, 1.2]}>
          {/* White Bottom Floor Cantilever Slab */}
          <mesh position={[0, -0.9, 0.5]} castShadow receiveShadow material={frameMat}>
            <boxGeometry args={[2.0, 0.2, 1.2]} />
          </mesh>

          {/* White Left Vertical Pillar Frame */}
          <mesh position={[-0.9, 0.1, 0.5]} castShadow receiveShadow material={frameMat}>
            <boxGeometry args={[0.2, 1.8, 1.2]} />
          </mesh>

          {/* White Top Horizontal Roof Beam Frame */}
          <mesh position={[0, 1.0, 0.5]} castShadow receiveShadow material={frameMat}>
            <boxGeometry args={[2.0, 0.2, 1.2]} />
          </mesh>

          {/* 1st Floor Balcony Glass Door with Curtain Glow */}
          <mesh position={[0, 0.05, -0.05]} castShadow>
            <boxGeometry args={[1.5, 1.7, 0.05]} />
            <primitive object={hasInteriorGlow ? curtainGlowMat : glassMat} />
          </mesh>
          {/* Dark Vertical Door Mullion */}
          <mesh position={[0, 0.05, -0.02]} castShadow material={darkTrimMat}>
            <boxGeometry args={[0.04, 1.7, 0.06]} />
          </mesh>

          {/* Sleek Vertical Black Metal Balcony Railings */}
          <group position={[0, -0.45, 1.05]}>
            {/* Top Handrail */}
            <mesh position={[0, 0.45, 0]} castShadow material={darkTrimMat}>
              <boxGeometry args={[1.8, 0.035, 0.035]} />
            </mesh>
            {/* Bottom Rail */}
            <mesh position={[0, 0.02, 0]} castShadow material={darkTrimMat}>
              <boxGeometry args={[1.8, 0.02, 0.02]} />
            </mesh>
            {/* Closely Spaced Vertical Balusters */}
            {[-0.75, -0.6, -0.45, -0.3, -0.15, 0, 0.15, 0.3, 0.45, 0.6, 0.75].map((x, i) => (
              <mesh key={i} position={[x, 0.23, 0]} castShadow material={darkTrimMat}>
                <boxGeometry args={[0.016, 0.44, 0.016]} />
              </mesh>
            ))}
          </group>
        </group>

        {/* 5. DEEP-SET WINDOWS WITH SILLS */}
        {/* Left Charcoal Facade Windows (2 Windows) */}
        <group position={[-1.75, 0, 2.22]}>
          {/* Ground Floor Window */}
          <group position={[0, 1.4, 0]}>
            <mesh castShadow material={darkTrimMat}>
              <boxGeometry args={[0.55, 1.25, 0.06]} />
            </mesh>
            <mesh position={[0, 0, 0.01]}>
              <planeGeometry args={[0.45, 1.15]} />
              <primitive object={glassMat} />
            </mesh>
            <mesh position={[0, -0.65, 0.03]} castShadow material={darkTrimMat}>
              <boxGeometry args={[0.65, 0.04, 0.1]} />
            </mesh>
          </group>

          {/* 1st Floor Window */}
          <group position={[0, 3.8, 0]}>
            <mesh castShadow material={darkTrimMat}>
              <boxGeometry args={[0.55, 1.15, 0.06]} />
            </mesh>
            <mesh position={[0, 0, 0.01]}>
              <planeGeometry args={[0.45, 1.05]} />
              <primitive object={glassMat} />
            </mesh>
            <mesh position={[0, -0.6, 0.03]} castShadow material={darkTrimMat}>
              <boxGeometry args={[0.65, 0.04, 0.1]} />
            </mesh>
          </group>
        </group>

        {/* Right Side Facade Windows (4 Windows with Deep Sills) */}
        <group position={[2.32, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
          {/* Top-Front Window */}
          <group position={[1.1, 3.8, 0]}>
            <mesh castShadow material={darkTrimMat}>
              <boxGeometry args={[0.6, 1.15, 0.06]} />
            </mesh>
            <mesh position={[0, 0, 0.01]}>
              <planeGeometry args={[0.5, 1.05]} />
              <primitive object={glassMat} />
            </mesh>
            <mesh position={[0, -0.6, 0.03]} castShadow material={darkTrimMat}>
              <boxGeometry args={[0.7, 0.04, 0.1]} />
            </mesh>
          </group>

          {/* Top-Back Window */}
          <group position={[-1.1, 3.8, 0]}>
            <mesh castShadow material={darkTrimMat}>
              <boxGeometry args={[0.6, 1.15, 0.06]} />
            </mesh>
            <mesh position={[0, 0, 0.01]}>
              <planeGeometry args={[0.5, 1.05]} />
              <primitive object={glassMat} />
            </mesh>
            <mesh position={[0, -0.6, 0.03]} castShadow material={darkTrimMat}>
              <boxGeometry args={[0.7, 0.04, 0.1]} />
            </mesh>
          </group>

          {/* Ground-Front Window */}
          <group position={[1.1, 1.4, 0]}>
            <mesh castShadow material={darkTrimMat}>
              <boxGeometry args={[0.6, 1.45, 0.06]} />
            </mesh>
            <mesh position={[0, 0, 0.01]}>
              <planeGeometry args={[0.5, 1.35]} />
              <primitive object={glassMat} />
            </mesh>
            <mesh position={[0, -0.75, 0.03]} castShadow material={darkTrimMat}>
              <boxGeometry args={[0.7, 0.04, 0.1]} />
            </mesh>
          </group>

          {/* Ground-Back Window */}
          <group position={[-1.1, 1.4, 0]}>
            <mesh castShadow material={darkTrimMat}>
              <boxGeometry args={[0.6, 1.25, 0.06]} />
            </mesh>
            <mesh position={[0, 0, 0.01]}>
              <planeGeometry args={[0.5, 1.15]} />
              <primitive object={glassMat} />
            </mesh>
            <mesh position={[0, -0.65, 0.03]} castShadow material={darkTrimMat}>
              <boxGeometry args={[0.7, 0.04, 0.1]} />
            </mesh>
          </group>
        </group>

        {/* 6. CLEAN RECESSED FLAT ROOF */}
        <group position={[0, 5.08, 0]}>
          <mesh position={[0, 0, 0]} receiveShadow>
            <boxGeometry args={[4.4, 0.04, 4.2]} />
            <meshStandardMaterial color="#b89a74" roughness={0.9} />
          </mesh>

          {/* Optional Props */}
          {hasWaterTank && (
            <WaterTank position={[-1.2, 0.04, -0.9]} color="#111827" hasStand={true} />
          )}
          {hasDishAntenna && (
            <DishAntenna position={[1.1, 0.04, -0.8]} rotation={[0, -0.4, 0]} scale={0.8} />
          )}
        </group>
      </group>
    </group>
  );
};
