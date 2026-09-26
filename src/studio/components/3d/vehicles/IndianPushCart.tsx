import React, { useMemo } from 'react';
import * as THREE from 'three';

export interface PushCartConfig {
  hasScale: boolean;
  hasProduce: boolean;
  hasUmbrella: boolean;
  hasHangingBulb: boolean;
  hasJuteSacks: boolean;
  woodTone: 'weathered' | 'natural';
}

/**
 * Iconic Indian Street Vendor Push Cart (Sabzi / Fruit Thela)
 * High-fidelity 1:1 metric model:
 * - 1.90m length x 1.05m table height (1.95m with canopy umbrella) x 0.95m width
 * - Heavy weathered timber plank tabletop with raised perimeter retaining lips
 * - 4 large spoked wheels with steel axles, under-deck slatted crate shelf
 * - Authentic dual-pan mechanical balance scale (Tarazu) with iron weights
 * - Woven cane baskets & wooden crates with colorful produce (tomatoes, eggplants, lemons, cabbages)
 * - Jute hessian sacks of potatoes/onions, evening market hanging bulb, & striped sun umbrella
 */
export const IndianPushCart: React.FC<{
  config?: Partial<PushCartConfig>;
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
    hasScale = true,
    hasProduce = true,
    hasUmbrella = true,
    hasHangingBulb = true,
    hasJuteSacks = true,
    woodTone = 'weathered',
  } = config;

  // Materials
  const woodPlankMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: woodTone === 'weathered' ? '#6b5e52' : '#8b5a2b',
        roughness: 0.88,
        metalness: 0.05,
      }),
    [woodTone]
  );

  const darkIronMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#26292e',
        roughness: 0.7,
        metalness: 0.85,
      }),
    []
  );

  const rubberTireMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#1a1d20',
        roughness: 0.9,
        metalness: 0.05,
      }),
    []
  );

  const chromeMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#e2e8f0',
        roughness: 0.2,
        metalness: 0.9,
      }),
    []
  );

  const brassScaleMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#d97706',
        roughness: 0.35,
        metalness: 0.8,
      }),
    []
  );

  const juteSackMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#b08968',
        roughness: 0.95,
        metalness: 0.02,
      }),
    []
  );

  const caneBasketMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#cb997e',
        roughness: 0.85,
        metalness: 0.05,
      }),
    []
  );

  // Produce Materials
  const tomatoRedMat = useMemo(
    () => new THREE.MeshStandardMaterial({ color: '#dc2626', roughness: 0.35 }),
    []
  );
  const brinjalPurpleMat = useMemo(
    () => new THREE.MeshStandardMaterial({ color: '#4c1d95', roughness: 0.3 }),
    []
  );
  const lemonYellowMat = useMemo(
    () => new THREE.MeshStandardMaterial({ color: '#facc15', roughness: 0.4 }),
    []
  );
  const cabbageGreenMat = useMemo(
    () => new THREE.MeshStandardMaterial({ color: '#65a30d', roughness: 0.6 }),
    []
  );

  // Umbrella & Light Materials
  const umbrellaRedMat = useMemo(
    () => new THREE.MeshStandardMaterial({ color: '#b91c1c', roughness: 0.6 }),
    []
  );
  const umbrellaYellowMat = useMemo(
    () => new THREE.MeshStandardMaterial({ color: '#f59e0b', roughness: 0.6 }),
    []
  );
  const bulbGlowMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#fffbeb',
        emissive: '#fde047',
        emissiveIntensity: 0.65,
        roughness: 0.1,
      }),
    []
  );

  return (
    <group position={position} rotation={rotation} scale={scale}>
      {/* 1. LOWER STEEL FRAME & 4 SPOKED WHEELS */}
      <group position={[0, 0.38, 0]}>
        {/* Longitudinal Angle Iron Rails */}
        <mesh position={[-0.42, 0, 0]} material={darkIronMat}>
          <boxGeometry args={[0.04, 0.05, 1.76]} />
        </mesh>
        <mesh position={[0.42, 0, 0]} material={darkIronMat}>
          <boxGeometry args={[0.04, 0.05, 1.76]} />
        </mesh>
        {/* Transverse Cross Axles */}
        <mesh position={[0, 0, 0.62]} rotation={[0, 0, Math.PI / 2]} material={darkIronMat}>
          <cylinderGeometry args={[0.016, 0.016, 0.96, 12]} />
        </mesh>
        <mesh position={[0, 0, -0.62]} rotation={[0, 0, Math.PI / 2]} material={darkIronMat}>
          <cylinderGeometry args={[0.016, 0.016, 0.96, 12]} />
        </mesh>

        {/* 4 Large Spoked Bicycle Wheels (Front & Rear pairs) */}
        {[-0.48, 0.48].map((x, xi) =>
          [-0.62, 0.62].map((z, zi) => (
            <group key={`wheel-${xi}-${zi}`} position={[x, 0, z]}>
              {/* Rubber Tire */}
              <mesh rotation={[0, Math.PI / 2, 0]} castShadow material={rubberTireMat}>
                <torusGeometry args={[0.28, 0.024, 12, 28]} />
              </mesh>
              {/* Chrome/Steel Rim */}
              <mesh rotation={[0, Math.PI / 2, 0]} material={chromeMat}>
                <torusGeometry args={[0.26, 0.012, 8, 28]} />
              </mesh>
              {/* Hub */}
              <mesh rotation={[0, 0, Math.PI / 2]} material={darkIronMat}>
                <cylinderGeometry args={[0.035, 0.035, 0.06, 12]} />
              </mesh>
              {/* Spokes */}
              {[0, 30, 60, 90, 120, 150].map((deg, si) => (
                <mesh
                  key={`spoke-${si}`}
                  rotation={[THREE.MathUtils.degToRad(deg), 0, 0]}
                  material={chromeMat}
                >
                  <cylinderGeometry args={[0.0015, 0.0015, 0.52, 4]} />
                </mesh>
              ))}
            </group>
          ))
        )}

        {/* Under-deck Storage Slatted Shelf */}
        <group position={[0, 0.06, 0]}>
          {[-0.5, -0.25, 0, 0.25, 0.5].map((z, i) => (
            <mesh key={`shelf-slat-${i}`} position={[0, 0, z]} material={woodPlankMat}>
              <boxGeometry args={[0.8, 0.018, 0.12]} />
            </mesh>
          ))}
        </group>
      </group>

      {/* 2. TABLETOP DECK & WOODEN RISERS */}
      <group position={[0, 0.85, 0]}>
        {/* 4 Corner Heavy Wooden Leg Posts */}
        {[-0.42, 0.42].map((x, xi) =>
          [-0.82, 0.82].map((z, zi) => (
            <mesh key={`leg-${xi}-${zi}`} position={[x, -0.22, z]} castShadow material={woodPlankMat}>
              <boxGeometry args={[0.065, 0.44, 0.065]} />
            </mesh>
          ))
        )}

        {/* Main Flat Weathered Wood Deck Planks */}
        <mesh position={[0, 0, 0]} castShadow receiveShadow material={woodPlankMat}>
          <boxGeometry args={[0.92, 0.045, 1.84]} />
        </mesh>

        {/* Raised Perimeter Retaining Lip Borders (prevents veggies falling) */}
        {/* Left Lip */}
        <mesh position={[-0.44, 0.05, 0]} material={woodPlankMat}>
          <boxGeometry args={[0.035, 0.07, 1.84]} />
        </mesh>
        {/* Right Lip */}
        <mesh position={[0.44, 0.05, 0]} material={woodPlankMat}>
          <boxGeometry args={[0.035, 0.07, 1.84]} />
        </mesh>
        {/* Front Lip */}
        <mesh position={[0, 0.05, 0.9]} material={woodPlankMat}>
          <boxGeometry args={[0.92, 0.07, 0.035]} />
        </mesh>
        {/* Rear Lip */}
        <mesh position={[0, 0.05, -0.9]} material={woodPlankMat}>
          <boxGeometry args={[0.92, 0.07, 0.035]} />
        </mesh>

        {/* Front Pushing Handle Bar */}
        <mesh position={[0, 0.06, 1.04]} rotation={[0, 0, Math.PI / 2]} material={woodPlankMat}>
          <cylinderGeometry args={[0.02, 0.02, 0.88, 10]} />
        </mesh>
        <mesh position={[-0.38, 0.06, 0.97]} rotation={[Math.PI / 2, 0, 0]} material={darkIronMat}>
          <cylinderGeometry args={[0.012, 0.012, 0.16, 8]} />
        </mesh>
        <mesh position={[0.38, 0.06, 0.97]} rotation={[Math.PI / 2, 0, 0]} material={darkIronMat}>
          <cylinderGeometry args={[0.012, 0.012, 0.16, 8]} />
        </mesh>
      </group>

      {/* 3. TRADITIONAL DUAL-PAN MECHANICAL BALANCE SCALE (TARAZU) */}
      {hasScale && (
        <group position={[-0.22, 0.92, 0.52]}>
          {/* Iron Stand Upright Pillar */}
          <mesh position={[0, 0.18, 0]} material={darkIronMat}>
            <cylinderGeometry args={[0.008, 0.012, 0.36, 8]} />
          </mesh>
          <mesh position={[0, 0.01, 0]} material={darkIronMat}>
            <cylinderGeometry args={[0.06, 0.07, 0.02, 12]} />
          </mesh>
          {/* Horizontal Balance Beam */}
          <mesh position={[0, 0.34, 0]} rotation={[0, 0, 0.08]} material={darkIronMat}>
            <boxGeometry args={[0.38, 0.014, 0.012]} />
          </mesh>
          {/* Left Brass Pan */}
          <group position={[-0.18, 0.18, 0]}>
            <mesh material={brassScaleMat}>
              <cylinderGeometry args={[0.085, 0.06, 0.03, 16]} />
            </mesh>
            {/* Hanging Wire Strings */}
            <mesh position={[0, 0.08, 0]} material={darkIronMat}>
              <cylinderGeometry args={[0.0015, 0.0015, 0.14, 4]} />
            </mesh>
          </group>
          {/* Right Brass Pan */}
          <group position={[0.18, 0.22, 0]}>
            <mesh material={brassScaleMat}>
              <cylinderGeometry args={[0.085, 0.06, 0.03, 16]} />
            </mesh>
            {/* Hanging Wire Strings */}
            <mesh position={[0, 0.06, 0]} material={darkIronMat}>
              <cylinderGeometry args={[0.0015, 0.0015, 0.12, 4]} />
            </mesh>
            {/* 1kg & 500g Iron Weight Blocks in right pan */}
            <mesh position={[0.02, 0.025, 0]} material={darkIronMat}>
              <cylinderGeometry args={[0.025, 0.025, 0.025, 8]} />
            </mesh>
            <mesh position={[-0.03, 0.02, 0.01]} material={darkIronMat}>
              <cylinderGeometry args={[0.018, 0.018, 0.018, 8]} />
            </mesh>
          </group>
        </group>
      )}

      {/* 4. FRESH PRODUCE BASKETS, CRATES & VEGETABLES */}
      {hasProduce && (
        <group position={[0, 0.9, 0]}>
          {/* Basket 1: Red Tomatoes */}
          <group position={[0.22, 0.04, 0.5]}>
            <mesh material={caneBasketMat}>
              <cylinderGeometry args={[0.16, 0.12, 0.09, 14]} />
            </mesh>
            {/* Tomatoes mound */}
            {[-0.05, 0, 0.05].map((tx, i) =>
              [-0.05, 0, 0.05].map((tz, j) => (
                <mesh key={`tom-${i}-${j}`} position={[tx, 0.06, tz]} material={tomatoRedMat}>
                  <sphereGeometry args={[0.032, 10, 8]} />
                </mesh>
              ))
            )}
            <mesh position={[0, 0.09, 0]} material={tomatoRedMat}>
              <sphereGeometry args={[0.034, 10, 8]} />
            </mesh>
          </group>

          {/* Basket 2: Purple Brinjal / Eggplants */}
          <group position={[-0.2, 0.04, 0.05]}>
            <mesh material={caneBasketMat}>
              <cylinderGeometry args={[0.16, 0.12, 0.09, 14]} />
            </mesh>
            {[-0.04, 0.04].map((bx, i) => (
              <mesh key={`brin-${i}`} position={[bx, 0.06, 0]} rotation={[0.4, 0, 0.3]} material={brinjalPurpleMat}>
                <cylinderGeometry args={[0.025, 0.035, 0.11, 8]} />
              </mesh>
            ))}
          </group>

          {/* Wooden Crate 3: Fresh Green Cabbages */}
          <group position={[0.2, 0.05, -0.05]}>
            <mesh material={woodPlankMat}>
              <boxGeometry args={[0.34, 0.12, 0.34]} />
            </mesh>
            {[-0.07, 0.07].map((cx, i) =>
              [-0.07, 0.07].map((cz, j) => (
                <mesh key={`cab-${i}-${j}`} position={[cx, 0.08, cz]} material={cabbageGreenMat}>
                  <sphereGeometry args={[0.052, 10, 8]} />
                </mesh>
              ))
            )}
          </group>

          {/* Basket 4: Bright Yellow Lemons / Bananas */}
          <group position={[0.2, 0.04, -0.52]}>
            <mesh material={caneBasketMat}>
              <cylinderGeometry args={[0.15, 0.11, 0.08, 14]} />
            </mesh>
            {[-0.04, 0, 0.04].map((lx, i) =>
              [-0.04, 0.04].map((lz, j) => (
                <mesh key={`lem-${i}-${j}`} position={[lx, 0.05, lz]} material={lemonYellowMat}>
                  <sphereGeometry args={[0.024, 8, 6]} />
                </mesh>
              ))
            )}
          </group>
        </group>
      )}

      {/* 5. JUTE HESSIAN SACKS (Potatoes / Onions) */}
      {hasJuteSacks && (
        <group position={[-0.22, 0.94, -0.52]}>
          {/* Main Potato Sack */}
          <mesh castShadow material={juteSackMat}>
            <boxGeometry args={[0.32, 0.18, 0.38]} />
          </mesh>
          {/* Tied top neck */}
          <mesh position={[0, 0.11, 0.14]} material={juteSackMat}>
            <cylinderGeometry args={[0.06, 0.08, 0.06, 8]} />
          </mesh>
          {/* Under-deck storage sack */}
          <mesh position={[0.2, -0.44, 0.2]} castShadow material={juteSackMat}>
            <boxGeometry args={[0.38, 0.18, 0.44]} />
          </mesh>
        </group>
      )}

      {/* 6. HANGING BAZAAR BULB ON BAMBOO POLE */}
      {hasHangingBulb && (
        <group position={[-0.42, 0.9, -0.84]}>
          {/* Angled Bamboo Pole */}
          <mesh position={[0.08, 0.42, 0.12]} rotation={[-0.22, 0, 0.15]} material={woodPlankMat}>
            <cylinderGeometry args={[0.016, 0.018, 0.92, 8]} />
          </mesh>
          {/* Hanging Electric Wire & Socket */}
          <mesh position={[0.18, 0.72, 0.35]} material={darkIronMat}>
            <cylinderGeometry args={[0.003, 0.003, 0.18, 4]} />
          </mesh>
          <mesh position={[0.18, 0.62, 0.35]} material={darkIronMat}>
            <cylinderGeometry args={[0.018, 0.018, 0.03, 8]} />
          </mesh>
          {/* Glowing Bulb */}
          <mesh position={[0.18, 0.58, 0.35]} material={bulbGlowMat}>
            <sphereGeometry args={[0.028, 12, 10]} />
          </mesh>
        </group>
      )}

      {/* 7. COLORFUL STRIPED SUN UMBRELLA / CANOPY */}
      {hasUmbrella && (
        <group position={[0, 0.9, 0]}>
          {/* Center Umbrella Pole */}
          <mesh position={[0, 0.58, 0]} material={darkIronMat}>
            <cylinderGeometry args={[0.016, 0.016, 1.25, 8]} />
          </mesh>
          {/* Main Conical Canopy */}
          <mesh position={[0, 1.15, 0]} rotation={[0, 0, 0]} castShadow material={umbrellaRedMat}>
            <cylinderGeometry args={[0.02, 0.88, 0.32, 16, 1, true]} />
          </mesh>
          {/* Alternating Yellow Segments */}
          <mesh position={[0, 1.152, 0]} rotation={[0, Math.PI / 4, 0]} material={umbrellaYellowMat}>
            <cylinderGeometry args={[0.02, 0.88, 0.315, 8, 1, true]} />
          </mesh>
          {/* Top Brass Finial Cap */}
          <mesh position={[0, 1.32, 0]} material={brassScaleMat}>
            <sphereGeometry args={[0.035, 10, 8]} />
          </mesh>
        </group>
      )}
    </group>
  );
};
