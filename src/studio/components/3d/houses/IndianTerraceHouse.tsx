import React, { useMemo } from 'react';

import {
  WaterTank,
  DishAntenna,
  ExposedRebars,
  WoodenLadder,
  RusticDoor,
  WindowWithGrill,
  TarpaulinCover,
  DrainPipeWithBottles,
  VintageScooter,
  TerraceClutter,
  Clothesline,
  DesertAirCooler,
} from '../HouseProps';
import { createHexTerraceTilePBR, createPeelingWallPBR } from '../../../materials/ProceduralTextures';

export interface HouseConfig {
  wallColor: string;
  floorColor: string;
  hasWaterTank: boolean;
  hasDishAntenna: boolean;
  hasRebars: boolean;
  hasLadder: boolean;
  hasScooter: boolean;
  hasClutter: boolean;
  hasClothesline: boolean;
  hasAirCooler: boolean;
  peelingAmount: number;
}

/**
 * Indian Rooftop Terrace House
 * 1:1 Metric Scale & Ground-Aligned (World origin at Y = 0 on X-Z Grid Plane)
 * High-fidelity PBR recreation of the Indian neighborhood terrace
 */
export const IndianTerraceHouse: React.FC<{
  config?: Partial<HouseConfig>;
  position?: [number, number, number];
  rotation?: [number, number, number];
}> = ({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  config = {},
}) => {
  const {
    wallColor = '#8fa3b3',
    floorColor = '#df8f85',
    hasWaterTank = true,
    hasDishAntenna = true,
    hasRebars = true,
    hasLadder = true,
    hasScooter = true,
    hasClutter = true,
    hasClothesline = false,
    hasAirCooler = false,
  } = config;

  // Studio PBR Textures
  const wallPBR = useMemo(
    () => createPeelingWallPBR(wallColor, '#b89f8d', '#eef5f8'),
    [wallColor]
  );
  const floorPBR = useMemo(
    () => createHexTerraceTilePBR(floorColor, '#eeddd7'),
    [floorColor]
  );
  const parapetPBR = useMemo(
    () => createPeelingWallPBR('#889ba8', '#9e897a', '#dbe6ec'),
    []
  );

  // Dimensions in meters (1 unit = 1 meter)
  const terraceWidth = 9.0;
  const terraceDepth = 7.0;
  const parapetHeight = 1.05;
  const parapetThick = 0.22;
  const roomWidth = 3.6;
  const roomHeight = 2.75;
  const roomDepth = 3.0;

  return (
    <group position={position} rotation={rotation}>
      {/* 1. TERRACE FLOOR SLAB (Hexagonal Terracotta Tiles at Y = 0) */}
      <mesh position={[0, 0, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[terraceWidth, terraceDepth]} />
        <meshStandardMaterial
          map={floorPBR.map}
          bumpMap={floorPBR.bumpMap}
          bumpScale={0.03}
          roughnessMap={floorPBR.roughnessMap}
          roughness={0.75}
        />
      </mesh>

      {/* Terracotta Floor Skirting Trim */}
      <mesh position={[0, 0.06, -terraceDepth / 2 + 0.05]} receiveShadow>
        <boxGeometry args={[terraceWidth, 0.12, 0.08]} />
        <meshStandardMaterial color="#991b1b" roughness={0.8} />
      </mesh>
      <mesh position={[-terraceWidth / 2 + 0.05, 0.06, 0]} receiveShadow>
        <boxGeometry args={[0.08, 0.12, terraceDepth]} />
        <meshStandardMaterial color="#991b1b" roughness={0.8} />
      </mesh>
      <mesh position={[terraceWidth / 2 - 0.05, 0.06, 0]} receiveShadow>
        <boxGeometry args={[0.08, 0.12, terraceDepth]} />
        <meshStandardMaterial color="#991b1b" roughness={0.8} />
      </mesh>

      {/* 2. PARAPET BOUNDARY WALLS (Anchored on Y = 0) */}
      {/* Left Wall */}
      <mesh
        position={[-terraceWidth / 2 + parapetThick / 2, parapetHeight / 2, 0]}
        castShadow
        receiveShadow
      >
        <boxGeometry args={[parapetThick, parapetHeight, terraceDepth]} />
        <meshStandardMaterial
          map={parapetPBR.map}
          bumpMap={parapetPBR.bumpMap}
          bumpScale={0.025}
          roughnessMap={parapetPBR.roughnessMap}
          roughness={0.85}
        />
      </mesh>

      {/* Right Wall */}
      <mesh
        position={[terraceWidth / 2 - parapetThick / 2, parapetHeight / 2, 0]}
        castShadow
        receiveShadow
      >
        <boxGeometry args={[parapetThick, parapetHeight, terraceDepth]} />
        <meshStandardMaterial
          map={parapetPBR.map}
          bumpMap={parapetPBR.bumpMap}
          bumpScale={0.025}
          roughnessMap={parapetPBR.roughnessMap}
          roughness={0.85}
        />
      </mesh>

      {/* Back Boundary Wall */}
      <mesh
        position={[0, parapetHeight / 2, -terraceDepth / 2 + parapetThick / 2]}
        castShadow
        receiveShadow
      >
        <boxGeometry args={[terraceWidth, parapetHeight, parapetThick]} />
        <meshStandardMaterial
          map={parapetPBR.map}
          bumpMap={parapetPBR.bumpMap}
          bumpScale={0.025}
          roughnessMap={parapetPBR.roughnessMap}
          roughness={0.85}
        />
      </mesh>

      {/* Parapet Wall Concrete Coping Caps */}
      <mesh position={[-terraceWidth / 2 + parapetThick / 2, parapetHeight + 0.04, 0]} castShadow>
        <boxGeometry args={[parapetThick + 0.06, 0.08, terraceDepth + 0.06]} />
        <meshStandardMaterial color="#cbd5e1" roughness={0.9} />
      </mesh>
      <mesh position={[terraceWidth / 2 - parapetThick / 2, parapetHeight + 0.04, 0]} castShadow>
        <boxGeometry args={[parapetThick + 0.06, 0.08, terraceDepth + 0.06]} />
        <meshStandardMaterial color="#cbd5e1" roughness={0.9} />
      </mesh>
      <mesh position={[0, parapetHeight + 0.04, -terraceDepth / 2 + parapetThick / 2]} castShadow>
        <boxGeometry args={[terraceWidth + 0.06, 0.08, parapetThick + 0.06]} />
        <meshStandardMaterial color="#cbd5e1" roughness={0.9} />
      </mesh>

      {/* 3. ROOFTOP ROOM STRUCTURE (Centered back-left, resting on Y = 0) */}
      <group position={[-1.4, 0, -1.8]}>
        {/* Main Room Body */}
        <mesh position={[0, roomHeight / 2, 0]} castShadow receiveShadow>
          <boxGeometry args={[roomWidth, roomHeight, roomDepth]} />
          <meshStandardMaterial
            map={wallPBR.map}
            bumpMap={wallPBR.bumpMap}
            bumpScale={0.03}
            roughnessMap={wallPBR.roughnessMap}
            roughness={0.85}
          />
        </mesh>

        {/* Rustic Blue Wooden Door */}
        <RusticDoor position={[0.15, 0, roomDepth / 2 + 0.01]} paintColor="#93c5fd" />

        {/* Vintage Window with Ornamental Iron Grill */}
        <WindowWithGrill position={[1.15, 1.35, roomDepth / 2 + 0.02]} />

        {/* Concrete Sunshade (Chhajja) over window */}
        <mesh position={[1.15, 1.88, roomDepth / 2 + 0.18]} castShadow>
          <boxGeometry args={[1.05, 0.06, 0.35]} />
          <meshStandardMaterial color="#64748b" roughness={0.9} />
        </mesh>

        {/* PVC Downspout Drain Pipe with hanging water cans */}
        <DrainPipeWithBottles position={[-roomWidth / 2 + 0.15, 0, roomDepth / 2 + 0.02]} height={roomHeight + 0.1} />

        {/* Tarpaulin (Tirpal) Sheet Overhang on Room Roof */}
        <TarpaulinCover position={[0, roomHeight + 0.02, 0]} width={roomWidth + 0.3} depth={roomDepth + 0.3} />

        {/* Sintex Water Tank on Room Roof */}
        {hasWaterTank && (
          <WaterTank position={[-0.8, roomHeight + 0.05, -0.3]} color="#0f172a" hasStand={true} />
        )}

        {/* Dish TV Satellite Antenna */}
        {hasDishAntenna && (
          <DishAntenna position={[0.65, roomHeight + 0.05, -0.2]} rotation={[0, -0.4, 0]} scale={0.85} />
        )}

        {/* Exposed Concrete Stumps with Rusted Rebars (Sariya) */}
        {hasRebars && (
          <>
            <ExposedRebars position={[-roomWidth / 2 + 0.2, roomHeight, -roomDepth / 2 + 0.2]} />
            <ExposedRebars position={[roomWidth / 2 - 0.2, roomHeight, -roomDepth / 2 + 0.2]} />
            <ExposedRebars position={[roomWidth / 2 - 0.2, roomHeight, roomDepth / 2 - 0.2]} />
            <ExposedRebars position={[0.2, roomHeight, roomDepth / 2 - 0.2]} />
          </>
        )}

        {/* Rustic Wooden Ladder leaning against room front wall */}
        {hasLadder && (
          <WoodenLadder
            position={[-1.25, 0, roomDepth / 2 + 0.45]}
            rotation={[-0.28, 0, 0.1]}
            height={2.5}
          />
        )}
      </group>

      {/* 4. TERRACE CLUTTER & ACCESSORIES (Firmly placed on Y = 0 floor) */}
      {hasClutter && (
        <TerraceClutter position={[2.4, 0, -2.4]} rotation={[0, -0.15, 0]} />
      )}

      {/* Vintage Scooter Parked along Right Parapet Wall */}
      {hasScooter && (
        <VintageScooter
          position={[3.2, 0, -0.8]}
          rotation={[0, -0.25, 0]}
          color="#38bdf8"
          scale={1.0}
        />
      )}

      {/* Balcony Clothesline */}
      {hasClothesline && (
        <Clothesline position={[-1.8, 1.8, 1.2]} length={3.6} />
      )}

      {/* Desert Air Cooler */}
      {hasAirCooler && (
        <DesertAirCooler position={[-3.0, 0, -1.8]} rotation={[0, 0.3, 0]} />
      )}

      {/* Gully Cricket Ball on Terrace (Exact 7cm scale at Y = 0.035) */}
      <group position={[0.8, 0.035, 1.2]}>
        <mesh castShadow>
          <sphereGeometry args={[0.04, 16, 16]} />
          <meshStandardMaterial color="#dc2626" roughness={0.35} />
        </mesh>
        <mesh rotation={[0.4, 0.3, 0]}>
          <torusGeometry args={[0.041, 0.003, 6, 20]} />
          <meshStandardMaterial color="#ffffff" roughness={0.5} />
        </mesh>
      </group>
    </group>
  );
};
