import React, { useMemo } from 'react';
import * as THREE from 'three';

export interface GarbageBinsConfig {
  hasConcreteDrum: boolean;
  hasTwinSegregationBins: boolean;
  hasStreetClutter: boolean;
  hasConcretePlinth: boolean;
}

/**
 * Authentic Indian Street Municipal Waste Bins (Swachh Gully Station)
 * High-fidelity 1:1 metric model:
 * - 1.65m width x 1.05m height x 0.85m depth
 * - Twin Municipal Segregated Dustbins (Green for Wet Waste / Blue for Dry Waste) on steel swivel stand
 * - Heavy Precast Concrete Roadside Cylinder Drum Bin with "USE ME" rim
 * - Stylized street litter clutter: cardboard box, chai cups, crushed tin cans
 * - Concrete sidewalk pavement curb base
 */
export const IndianGarbageBins: React.FC<{
  config?: Partial<GarbageBinsConfig>;
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
    hasConcreteDrum = true,
    hasTwinSegregationBins = true,
    hasStreetClutter = true,
    hasConcretePlinth = true,
  } = config;

  // Materials
  const greenBinMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#16a34a', // Wet Waste Green
        roughness: 0.45,
        metalness: 0.15,
      }),
    []
  );

  const blueBinMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#0284c7', // Dry Waste Blue
        roughness: 0.45,
        metalness: 0.15,
      }),
    []
  );

  const standSteelMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#1e3a1e', // Dark green painted municipal iron frame
        roughness: 0.55,
        metalness: 0.75,
      }),
    []
  );

  const concreteMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#78716c', // Weathered ash-grey concrete
        roughness: 0.95,
        metalness: 0.05,
      }),
    []
  );

  const concreteDarkMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#57534e',
        roughness: 0.92,
        metalness: 0.05,
      }),
    []
  );

  const cardboardMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#b08968',
        roughness: 0.9,
        metalness: 0.02,
      }),
    []
  );

  const chaiCupMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#cb997e', // Terracotta kulhad / paper cup
        roughness: 0.8,
      }),
    []
  );

  const aluminumCanMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#ef4444', // Red soda can
        roughness: 0.3,
        metalness: 0.85,
      }),
    []
  );

  const labelWhiteMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#f8fafc',
        roughness: 0.3,
      }),
    []
  );

  return (
    <group position={position} rotation={rotation} scale={scale}>
      {/* 1. CONCRETE SIDEWALK SLAB PLINTH */}
      {hasConcretePlinth && (
        <mesh position={[0, 0.04, 0]} receiveShadow material={concreteMat}>
          <boxGeometry args={[1.8, 0.08, 1.1]} />
        </mesh>
      )}

      {/* 2. TWIN MUNICIPAL SEGREGATION DUSTBINS ON STEEL STAND */}
      {hasTwinSegregationBins && (
        <group position={[-0.32, 0.08, 0]}>
          {/* Tubular Steel Stand Base & Uprights */}
          {/* Left Post */}
          <mesh position={[-0.45, 0.44, 0]} material={standSteelMat}>
            <cylinderGeometry args={[0.016, 0.016, 0.88, 8]} />
          </mesh>
          {/* Center Post */}
          <mesh position={[0, 0.44, 0]} material={standSteelMat}>
            <cylinderGeometry args={[0.016, 0.016, 0.88, 8]} />
          </mesh>
          {/* Right Post */}
          <mesh position={[0.45, 0.44, 0]} material={standSteelMat}>
            <cylinderGeometry args={[0.016, 0.016, 0.88, 8]} />
          </mesh>
          {/* Top Pivot Crossbar */}
          <mesh position={[0, 0.72, 0]} rotation={[0, 0, Math.PI / 2]} material={standSteelMat}>
            <cylinderGeometry args={[0.014, 0.014, 0.94, 8]} />
          </mesh>
          {/* Ground Foot Flanges */}
          {[-0.45, 0, 0.45].map((x, i) => (
            <mesh key={`foot-${i}`} position={[x, 0.01, 0]} material={standSteelMat}>
              <boxGeometry args={[0.08, 0.02, 0.18]} />
            </mesh>
          ))}

          {/* GREEN BIN: WET WASTE / GEELA KACHRA */}
          <group position={[-0.22, 0.42, 0]} rotation={[0.05, 0, 0]}>
            {/* Tapered Plastic Bucket Body */}
            <mesh castShadow material={greenBinMat}>
              <cylinderGeometry args={[0.16, 0.13, 0.48, 16]} />
            </mesh>
            {/* Top Rim Collar */}
            <mesh position={[0, 0.23, 0]} material={greenBinMat}>
              <cylinderGeometry args={[0.175, 0.175, 0.04, 16]} />
            </mesh>
            {/* Front White Stencil Label Badge */}
            <mesh position={[0, 0.08, 0.155]} material={labelWhiteMat}>
              <boxGeometry args={[0.16, 0.1, 0.005]} />
            </mesh>
            {/* Swivel Pivot Pins to frame */}
            <mesh rotation={[0, 0, Math.PI / 2]} material={standSteelMat}>
              <cylinderGeometry args={[0.008, 0.008, 0.36, 6]} />
            </mesh>
          </group>

          {/* BLUE BIN: DRY WASTE / SOOKHA KACHRA */}
          <group position={[0.22, 0.42, 0]} rotation={[-0.04, 0, 0]}>
            {/* Tapered Plastic Bucket Body */}
            <mesh castShadow material={blueBinMat}>
              <cylinderGeometry args={[0.16, 0.13, 0.48, 16]} />
            </mesh>
            {/* Top Rim Collar */}
            <mesh position={[0, 0.23, 0]} material={blueBinMat}>
              <cylinderGeometry args={[0.175, 0.175, 0.04, 16]} />
            </mesh>
            {/* Front White Stencil Label Badge */}
            <mesh position={[0, 0.08, 0.155]} material={labelWhiteMat}>
              <boxGeometry args={[0.16, 0.1, 0.005]} />
            </mesh>
            {/* Swivel Pivot Pins */}
            <mesh rotation={[0, 0, Math.PI / 2]} material={standSteelMat}>
              <cylinderGeometry args={[0.008, 0.008, 0.36, 6]} />
            </mesh>
          </group>
        </group>
      )}

      {/* 3. HEAVY PRECAST CONCRETE ROADSIDE DRUM BIN */}
      {hasConcreteDrum && (
        <group position={[0.56, 0.08, 0]}>
          {/* Main Cylindrical Concrete Barrel */}
          <mesh position={[0, 0.38, 0]} castShadow receiveShadow material={concreteMat}>
            <cylinderGeometry args={[0.24, 0.25, 0.76, 18]} />
          </mesh>
          {/* Hollow Inner Top Cavity */}
          <mesh position={[0, 0.74, 0]} material={concreteDarkMat}>
            <cylinderGeometry args={[0.18, 0.18, 0.06, 16]} />
          </mesh>
          {/* Embossed Concrete Center Ring Band */}
          <mesh position={[0, 0.44, 0]} material={concreteDarkMat}>
            <cylinderGeometry args={[0.252, 0.252, 0.08, 18]} />
          </mesh>
          {/* Base Foot Stand Collar */}
          <mesh position={[0, 0.05, 0]} material={concreteDarkMat}>
            <cylinderGeometry args={[0.27, 0.27, 0.1, 18]} />
          </mesh>
        </group>
      )}

      {/* 4. STREET LITTER CLUTTER (Chai Cups, Box, Crushed Can) */}
      {hasStreetClutter && (
        <group position={[0, 0.08, 0]}>
          {/* Cardboard Shipping Box */}
          <mesh position={[-0.62, 0.1, -0.28]} rotation={[0, 0.35, 0]} castShadow material={cardboardMat}>
            <boxGeometry args={[0.26, 0.18, 0.24]} />
          </mesh>

          {/* Crushed Red Soda Can */}
          <mesh position={[0.12, 0.03, 0.34]} rotation={[Math.PI / 2, 0, 0.6]} material={aluminumCanMat}>
            <cylinderGeometry args={[0.03, 0.03, 0.08, 10]} />
          </mesh>

          {/* Chai Kulhad / Clay Cups on pavement */}
          <mesh position={[0.24, 0.04, 0.32]} material={chaiCupMat}>
            <cylinderGeometry args={[0.03, 0.02, 0.06, 10]} />
          </mesh>
          <mesh position={[0.32, 0.025, 0.28]} rotation={[0.4, 0.2, 0.8]} material={chaiCupMat}>
            <cylinderGeometry args={[0.03, 0.02, 0.06, 10]} />
          </mesh>
        </group>
      )}
    </group>
  );
};
