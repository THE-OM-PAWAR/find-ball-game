import React from 'react';
import * as THREE from 'three';
import { GroundTerrain } from './components/GroundTerrain';
import { BoundaryWalls } from './components/BoundaryWalls';
import { SocietyExitGate } from './components/SocietyExitGate';
import { GullyStreetEnvironment } from './components/GullyStreetEnvironment';
import { SingleStoryStairHouse } from '../studio/components/3d/houses/SingleStoryStairHouse';
import { TwoStoryShopComplex } from '../studio/components/3d/houses/TwoStoryShopComplex';
import { ThreeStoryShopComplex } from '../studio/components/3d/houses/ThreeStoryShopComplex';
import { TwoStoryBoxHouse } from '../studio/components/3d/houses/TwoStoryBoxHouse';
import { ThreeStoryBoxHouse } from '../studio/components/3d/houses/ThreeStoryBoxHouse';
import { ModernGullyHouse } from '../studio/components/3d/houses/ModernGullyHouse';
import { GullyChawlHouse } from '../studio/components/3d/houses/GullyChawlHouse';
import { LEVEL_1_LANDMARKS } from './data/mapLayoutData';
import { WorldAtmosphere } from './environment';
import type { LightingPreset } from './environment/EnvironmentPerformance';
import { Html } from '@react-three/drei';

// ─── GROUND FIX ────────────────────────────────────────────────────────────
// Plinth (0.24m) was removed. House internals still offset by +0.24 inside.
// All groups set to Y = -0.24 so floors land at world Y = 0.
// GullyChawlHouse has no plinth offset → stays at Y = 0.
const Y0 = -0.24;
const YC = 0; // GullyChawlHouse

// ─── ROTATION REFERENCE ───────────────────────────────────────────────────
// All house fronts (local +Z = door/façade) must face inward toward the gully:
//
//  North row  rotation [0,  0,      0] → front faces +Z (south) ✓
//  South row  rotation [0,  π,      0] → front faces -Z (north) ✓
//  West flank rotation [0, +π/2,   0] → front faces +X (east)  ✓
//  East flank rotation [0, -π/2,   0] → front faces -X (west)  ✓
//
// PROOF (standard Three.js y-rotation: x'=x·cosθ+z·sinθ, z'=-x·sinθ+z·cosθ):
//   [0,+π/2,0] : local+Z(0,0,1) → x'=1, z'=0 → world +X  ✓ west-flank faces east
//   [0,-π/2,0] : local+Z(0,0,1) → x'=-1,z'=0 → world -X  ✓ east-flank faces west
// ──────────────────────────────────────────────────────────────────────────

// ─── HOUSE FOOTPRINTS (actual building body, not plinth) ──────────────────
// ThreeStoryShopComplex  W=10.4  D=5.2
// TwoStoryShopComplex    W=10.4  D=5.2
// SingleStoryStairHouse  W= 8.2  D=5.6  (left wing −3.7 → stair right ~+4.5)
// ThreeStoryBoxHouse     W= 5.6  D=5.0
// TwoStoryBoxHouse       W= 5.6  D=5.0
// ModernGullyHouse       W= 5.4  D=5.4  (main block)
// GullyChawlHouse        W= 4.2  D=4.0
//
// PACKING RULE — north/south row houses:
//   Back edge = Z ± D/2 touching ±25 boundary → centre_Z = ∓25 ± D/2
//   Houses tile left→right along X: next_centre_X = prev_right_edge + next_W/2
//
// PACKING RULE — west/east flank houses (rotated ±90°):
//   House local X (width) → runs along world Z axis
//   House local Z (depth) → runs along world X axis (toward/away from centre)
//   Back (local −Z) → world ±X at boundary → centre_X = ∓25 ± D/2
//   Houses tile north→south along Z: next_centre_Z = prev_south_edge + next_W/2
// ──────────────────────────────────────────────────────────────────────────

const HouseNumberBadge: React.FC<{ n: number; pos: [number, number, number]; c?: string; show?: boolean }> = ({
  n, pos, c = '#f59e0b', show = true,
}) => {
  if (!show) return null;
  return (
    <Html position={pos} center distanceFactor={18}>
      <div style={{
        background: 'rgba(8,14,26,0.93)',
        color: c,
        border: `1.5px solid ${c}`,
        borderRadius: '50%',
        width: 24, height: 24,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 11, fontWeight: 800, fontFamily: 'Inter,sans-serif',
        boxShadow: `0 0 10px ${c}66`,
        pointerEvents: 'none', userSelect: 'none', lineHeight: '1',
      }}>{n}</div>
    </Html>
  );
};

/**
 * Authentic Indian Desert Air Cooler on Rusted Welded Angle-Iron Stand
 * Used naturally by residents and serves as a physical stepping box (height ~1.05m)
 */
const DesertCoolerUnit: React.FC<{
  position: [number, number, number];
  rotation?: [number, number, number];
  width?: number;
  height?: number;
  depth?: number;
}> = ({ position, rotation = [0, 0, 0], width = 0.9, height = 0.6, depth = 0.55 }) => (
  <group position={position} rotation={rotation}>
    {/* Rusted Angle-Iron Stand (4 Legs & Braces) */}
    {[-width * 0.42, width * 0.42].map((x, xi) =>
      [-depth * 0.42, depth * 0.42].map((z, zi) => (
        <mesh key={`${xi}-${zi}`} position={[x, -height * 0.5, z]} castShadow>
          <boxGeometry args={[0.035, height, 0.035]} />
          <meshStandardMaterial color="#451a03" roughness={0.9} metalness={0.4} />
        </mesh>
      ))
    )}
    {/* Cross Bracing on Stand */}
    <mesh position={[0, -height * 0.5, 0]} castShadow>
      <boxGeometry args={[width * 0.88, 0.025, depth * 0.88]} />
      <meshStandardMaterial color="#78350f" roughness={0.85} metalness={0.5} />
    </mesh>

    {/* Painted Sheet-Metal Cooler Body */}
    <mesh position={[0, 0, 0]} castShadow receiveShadow>
      <boxGeometry args={[width, height, depth]} />
      <meshStandardMaterial color="#d1d5db" roughness={0.7} metalness={0.3} />
    </mesh>

    {/* Khus-Grass / Straw Cooling Pad Side Panels */}
    {[-width / 2 - 0.005, width / 2 + 0.005].map((x, idx) => (
      <mesh key={idx} position={[x, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
        <planeGeometry args={[depth * 0.8, height * 0.75]} />
        <meshStandardMaterial color="#854d0e" roughness={0.95} />
      </mesh>
    ))}

    {/* Front Circular Blower Fan Grill */}
    <group position={[0, 0, depth / 2 + 0.01]}>
      <mesh rotation={[Math.PI / 2, 0, 0]} castShadow>
        <cylinderGeometry args={[height * 0.38, height * 0.38, 0.025, 24]} />
        <meshStandardMaterial color="#1e293b" roughness={0.5} metalness={0.6} />
      </mesh>
      {/* Louver Slits */}
      {[-0.12, -0.04, 0.04, 0.12].map((yOffset, lIdx) => (
        <mesh key={lIdx} position={[0, yOffset, 0.018]}>
          <boxGeometry args={[width * 0.6, 0.015, 0.01]} />
          <meshStandardMaterial color="#0f172a" roughness={0.4} />
        </mesh>
      ))}
    </group>

    {/* Weathered Water Top Lid with Top Stepping Plate */}
    <mesh position={[0, height / 2 + 0.02, 0]} receiveShadow>
      <boxGeometry args={[width + 0.04, 0.04, depth + 0.04]} />
      <meshStandardMaterial color="#94a3b8" roughness={0.6} metalness={0.4} />
    </mesh>
  </group>
);

/**
 * 1000L Sintex Black/Dark-Blue Polymer Overhead Water Tank on Masonry Pier
 * Essential rooftop feature providing access to high walls and parapets
 */
const SintexWaterTank: React.FC<{
  position: [number, number, number];
  rotation?: [number, number, number];
  color?: string;
  hasLadder?: boolean;
}> = ({ position, rotation = [0, 0, 0], color = '#0f172a', hasLadder = true }) => {
  const tankRadius = 0.62;
  const tankHeight = 1.35;
  const plinthHeight = 0.38;

  return (
    <group position={position} rotation={rotation}>
      {/* Red Brick Raised Masonry Plinth */}
      <mesh position={[0, plinthHeight / 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[tankRadius * 2.3, plinthHeight, tankRadius * 2.3]} />
        <meshStandardMaterial color="#9a3412" roughness={0.9} />
      </mesh>

      {/* Main Ribbed Cylindrical Polymer Tank */}
      <group position={[0, plinthHeight + tankHeight / 2, 0]}>
        <mesh castShadow receiveShadow>
          <cylinderGeometry args={[tankRadius, tankRadius, tankHeight, 24]} />
          <meshStandardMaterial color={color} roughness={0.4} metalness={0.15} />
        </mesh>
        {/* Circumferential Reinforcement Hoops/Ribs */}
        {[-0.4, -0.15, 0.1, 0.35].map((yPos, rIdx) => (
          <mesh key={rIdx} position={[0, yPos, 0]}>
            <torusGeometry args={[tankRadius + 0.012, 0.018, 8, 24]} />
            <meshStandardMaterial color={color} roughness={0.3} metalness={0.2} />
          </mesh>
        ))}
        {/* Threaded Inspection Manhole Lid */}
        <mesh position={[0, tankHeight / 2 + 0.05, 0]} castShadow>
          <cylinderGeometry args={[tankRadius * 0.45, tankRadius * 0.48, 0.10, 16]} />
          <meshStandardMaterial color="#1e293b" roughness={0.5} />
        </mesh>
        {/* White Stenciled Brand Band */}
        <mesh position={[0, 0.22, 0]}>
          <cylinderGeometry args={[tankRadius + 0.005, tankRadius + 0.005, 0.18, 24]} />
          <meshStandardMaterial color="#f8fafc" roughness={0.8} />
        </mesh>
      </group>

      {/* Rusted Iron Service Ladder alongside tank */}
      {hasLadder && (
        <WallServiceLadder
          position={[tankRadius + 0.28, plinthHeight, 0]}
          rotation={[0, -Math.PI / 2, 0]}
          height={tankHeight + 0.3}
          width={0.45}
        />
      )}
    </group>
  );
};

/**
 * Weathered Wooden Scaffold / Mason's Timber Planks spanning parapet gaps
 */
const RooftopPlankBridge: React.FC<{
  position: [number, number, number];
  rotation?: [number, number, number];
  length?: number;
  width?: number;
}> = ({ position, rotation = [0, 0, 0], length = 2.0, width = 0.75 }) => (
  <group position={position} rotation={rotation}>
    {/* Sturdy Thick Timber Planks with Cement Splatters */}
    {[-width * 0.28, 0, width * 0.28].map((xOffset, idx) => (
      <mesh key={idx} position={[xOffset, 0.035, 0]} castShadow receiveShadow>
        <boxGeometry args={[width * 0.29, 0.07, length]} />
        <meshStandardMaterial color={idx % 2 === 0 ? '#78350f' : '#854d0e'} roughness={0.9} />
      </mesh>
    ))}
    {/* Steel End Cleat Clamps / Nail Plates */}
    {[-length * 0.42, length * 0.42].map((zOffset, cIdx) => (
      <mesh key={cIdx} position={[0, 0.075, zOffset]} castShadow>
        <boxGeometry args={[width + 0.04, 0.015, 0.08]} />
        <meshStandardMaterial color="#475569" roughness={0.6} metalness={0.7} />
      </mesh>
    ))}
  </group>
);

/**
 * Galvanized Steel Service Wall Ladder with realistic industrial iron finish
 */
const WallServiceLadder: React.FC<{
  position: [number, number, number];
  rotation?: [number, number, number];
  height?: number;
  width?: number;
}> = ({ position, rotation = [0, 0, 0], height = 3.0, width = 0.55 }) => {
  const rungCount = Math.floor(height / 0.3);
  return (
    <group position={position} rotation={rotation}>
      {/* Left Stringer */}
      <mesh position={[-width / 2, height / 2, 0.08]} castShadow>
        <boxGeometry args={[0.045, height, 0.045]} />
        <meshStandardMaterial color="#475569" roughness={0.5} metalness={0.8} />
      </mesh>
      {/* Right Stringer */}
      <mesh position={[width / 2, height / 2, 0.08]} castShadow>
        <boxGeometry args={[0.045, height, 0.045]} />
        <meshStandardMaterial color="#475569" roughness={0.5} metalness={0.8} />
      </mesh>
      {/* Wall Standoff Brackets */}
      {[0.4, height / 2, height - 0.4].map((y, idx) => (
        <group key={idx} position={[0, y, 0.04]}>
          {[-width / 2, width / 2].map((x, sIdx) => (
            <mesh key={sIdx} position={[x, 0, -0.04]} castShadow>
              <boxGeometry args={[0.035, 0.035, 0.08]} />
              <meshStandardMaterial color="#334155" roughness={0.6} metalness={0.85} />
            </mesh>
          ))}
        </group>
      ))}
      {/* Steel Round Rungs */}
      {Array.from({ length: rungCount }).map((_, i) => (
        <mesh
          key={i}
          position={[0, (i + 1) * 0.28, 0.08]}
          rotation={[0, 0, Math.PI / 2]}
          castShadow
        >
          <cylinderGeometry args={[0.016, 0.016, width - 0.02, 8]} />
          <meshStandardMaterial color="#94a3b8" roughness={0.5} metalness={0.7} />
        </mesh>
      ))}
    </group>
  );
};

/**
 * Traditional Indian Woven Khatia / Charpai resting against parapet
 */
const RooftopCharpai: React.FC<{
  position: [number, number, number];
  rotation?: [number, number, number];
}> = ({ position, rotation = [0, 0, 0] }) => (
  <group position={position} rotation={rotation}>
    {/* Wooden Frame */}
    <mesh castShadow receiveShadow>
      <boxGeometry args={[1.6, 0.08, 0.85]} />
      <meshStandardMaterial color="#78350f" roughness={0.8} />
    </mesh>
    {/* Woven Jute Rope Bed Webbing */}
    <mesh position={[0, 0.02, 0]}>
      <planeGeometry args={[1.4, 0.7]} />
      <meshStandardMaterial color="#ca8a04" roughness={0.95} />
    </mesh>
    {/* 4 Turned Wooden Legs */}
    {[-0.7, 0.7].map((lx, i) =>
      [-0.35, 0.35].map((lz, j) => (
        <mesh key={`${i}-${j}`} position={[lx, -0.22, lz]} castShadow>
          <cylinderGeometry args={[0.04, 0.03, 0.4, 8]} />
          <meshStandardMaterial color="#451a03" roughness={0.7} />
        </mesh>
      ))
    )}
  </group>
);

/**
 * Rooftop Satellite TV Dish Antenna (Tata Sky / Airtel)
 */
const RooftopDishAntenna: React.FC<{
  position: [number, number, number];
  rotation?: [number, number, number];
}> = ({ position, rotation = [0, 0, 0] }) => (
  <group position={position} rotation={rotation}>
    {/* Wall/Floor Mounting Pole */}
    <mesh position={[0, 0.35, 0]} castShadow>
      <cylinderGeometry args={[0.025, 0.025, 0.7, 8]} />
      <meshStandardMaterial color="#334155" metalness={0.8} roughness={0.4} />
    </mesh>
    {/* Curved Satellite Dish Bowl */}
    <group position={[0, 0.65, 0.1]} rotation={[-0.45, 0, 0]}>
      <mesh castShadow>
        <cylinderGeometry args={[0.38, 0.38, 0.06, 20]} />
        <meshStandardMaterial color="#e2e8f0" roughness={0.4} metalness={0.2} />
      </mesh>
      {/* LNB Feedhorn Arm */}
      <mesh position={[0, -0.08, 0.28]} rotation={[0.4, 0, 0]}>
        <boxGeometry args={[0.02, 0.02, 0.4]} />
        <meshStandardMaterial color="#1e293b" />
      </mesh>
      <mesh position={[0, 0.04, 0.44]}>
        <cylinderGeometry args={[0.035, 0.035, 0.07, 8]} />
        <meshStandardMaterial color="#0f172a" />
      </mesh>
    </group>
  </group>
);

/**
 * Clothesline with drying cotton clothes (adds life and wind motion)
 */
const ClotheslineWithLaundry: React.FC<{
  position: [number, number, number];
  rotation?: [number, number, number];
  length?: number;
}> = ({ position, rotation = [0, 0, 0], length = 3.5 }) => (
  <group position={position} rotation={rotation}>
    {/* Steel End Angle-Iron Posts */}
    {[-length / 2, length / 2].map((px, idx) => (
      <mesh key={idx} position={[px, 0.75, 0]} castShadow>
        <boxGeometry args={[0.04, 1.5, 0.04]} />
        <meshStandardMaterial color="#475569" roughness={0.6} metalness={0.7} />
      </mesh>
    ))}
    {/* Sagging Wire */}
    <mesh position={[0, 1.45, 0]} rotation={[0, 0, Math.PI / 2]}>
      <cylinderGeometry args={[0.006, 0.006, length, 6]} />
      <meshStandardMaterial color="#94a3b8" metalness={0.9} />
    </mesh>
    {/* Hanging Clothes */}
    {[-length * 0.3, -length * 0.08, length * 0.15, length * 0.34].map((cx, cIdx) => {
      const colors = ['#38bdf8', '#fbbf24', '#f43f5e', '#ffffff'];
      return (
        <mesh key={cIdx} position={[cx, 1.15, 0]} castShadow>
          <planeGeometry args={[0.45, 0.55]} />
          <meshStandardMaterial color={colors[cIdx % colors.length]} roughness={0.9} side={THREE.DoubleSide} />
        </mesh>
      );
    })}
  </group>
);

interface GullyLevelMapProps {
  showWaypoints?: boolean;
  showZoneLabels?: boolean;
  showPitchMarkings?: boolean;
  includeAtmosphere?: boolean;
  lightingPreset?: LightingPreset;
}

export const GullyLevelMap: React.FC<GullyLevelMapProps> = ({
  showWaypoints = true,
  showZoneLabels = true,
  showPitchMarkings = true,
  includeAtmosphere = true,
  lightingPreset = 'afternoon',
}) => {
  const HN: React.FC<{ n: number; pos: [number, number, number]; c?: string }> = ({ n, pos, c }) => (
    <HouseNumberBadge n={n} pos={pos} c={c} show={showZoneLabels} />
  );

  return (
    <group name="gully-level-1-map">
      {/* Production Atmosphere, Daytime Sky, Sunlight & 360° Background City */}
      {includeAtmosphere && <WorldAtmosphere preset={lightingPreset} />}

      <GroundTerrain showPitchMarkings={showPitchMarkings} />
      <BoundaryWalls />
      <SocietyExitGate position={[-19.5, 0, -14.5]} rotation={[0, 0, 0]} />
      <GullyStreetEnvironment />

      {/* ═══════════════════════════════════════════════════════════════
          NORTH ROW — rotation [0, 0, 0], front faces south (+Z)
          Back walls touching Z = −25, depth ≈ 5.2m → centre_Z ≈ −22.4
          Packed left → right (west to east):

          H1 ThreeStoryShopComplex W=10.4 : X −25.0 → −19.8 → −14.6
          H2 SingleStoryStairHouse W=  8.2 : X −14.6 → −10.5 →  −6.4  (Stairs entry +3.24m)
          H3 TwoStoryBoxHouse      W=  5.6 : X  −6.4 →  −3.6 →  −0.8  (+6.24m roof, AC climb from H2)
          H4 ModernGullyHouse      W=  5.4 : X  −0.8 →   1.9 →   4.6  (+6.24m roof level)
          H5 TwoStoryBoxHouse      W=  5.6 : X   4.6 →   7.4 →  10.2  (+6.24m roof level)
          H15 ThreeStoryBoxHouse   W=  5.6 : X  10.2 →  13.0 →  15.8  (+9.24m landmark tower)
      ═══════════════════════════════════════════════════════════════ */}

      {/* H1 — Krishna Commercial Market */}
      <ThreeStoryShopComplex
        position={[-19.8, Y0, -22.4]}
        rotation={[0, 0, 0]}
        config={{
          wallColor: '#ded8cc', accentColor: '#1e385c', trimColor: '#f8fafc',
          hasWaterTanks: true, hasDishAntenna: true, hasACUnits: true,
          hasClothesline: true, hasRebars: true, hasMumtyCabin: true, hasSignboardLights: true,
        }}
      />
      <HN n={1} pos={[-19.8, 10.5, -22.4]} c="#60a5fa" />

      {/* H2 — Sharma Niwas (Primary Ground-to-Roof Stair Entrance) */}
      <SingleStoryStairHouse
        position={[-10.5, Y0, -22.4]}
        rotation={[0, 0, 0]}
        config={{
          wallColor: '#c4b5a2', accentColor: '#242930', stoneAccentColor: '#59534c',
          trimColor: '#f8fafc', hasWaterTank: true, hasDishAntenna: true,
          hasCoveLight: true, hasFrontGarden: true,
        }}
      />
      <HN n={2} pos={[-10.5, 6.5, -22.4]} c="#f59e0b" />

      {/* H3 — Gupta Mansion (2-Storey Box House) */}
      <TwoStoryBoxHouse
        position={[-3.6, Y0, -22.4]}
        rotation={[0, 0, 0]}
        config={{
          wallColor: '#ded6c7', accentColor: '#8a4b38', trimColor: '#f8fafc',
          hasWaterTank: true, hasDishAntenna: true, hasACUnit: true,
          hasClothesline: true, hasRebars: true, hasMumtyCabin: true,
        }}
      />
      <HN n={3} pos={[-3.6, 9, -22.4]} c="#a78bfa" />

      {/* H4 — Contemporary Villa */}
      <ModernGullyHouse
        position={[1.9, Y0, -22.3]}
        rotation={[0, 0, 0]}
        config={{
          mainColor: '#c7ab85', accentColor: '#2f353d', frameColor: '#f3f4f6',
          hasWaterTank: false, hasDishAntenna: false, hasPalmTree: true,
          hasStreetLamp: true, hasInteriorGlow: true,
        }}
      />
      <HN n={4} pos={[1.9, 8, -22.3]} c="#c084fc" />

      {/* H5 — Agarwal House */}
      <TwoStoryBoxHouse
        position={[7.4, Y0, -22.4]}
        rotation={[0, 0, 0]}
        config={{
          wallColor: '#e2d9cc', accentColor: '#3b5266', trimColor: '#f8fafc',
          hasWaterTank: true, hasDishAntenna: true, hasACUnit: true,
          hasClothesline: true, hasRebars: true, hasMumtyCabin: true,
        }}
      />
      <HN n={5} pos={[7.4, 9, -22.4]} c="#34d399" />

      {/* H15 — Joshi Bhavan [NE gap filler, between H5 and east flank] */}
      <ThreeStoryBoxHouse
        position={[13.0, Y0, -22.4]}
        rotation={[0, 0, 0]}
        config={{
          wallColor: '#d6cec0', accentColor: '#5c3d2e', trimColor: '#f8fafc',
          hasWaterTank: true, hasDishAntenna: true, hasACUnits: true,
          hasClothesline: true, hasRebars: true, hasMumtyCabin: true,
        }}
      />
      <HN n={15} pos={[13.0, 11.5, -22.4]} c="#fb923c" />

      {/* ═══════════════════════════════════════════════════════════════
          WEST FLANK — rotation [0, +π/2, 0], front faces east (+X)
          local+Z→world+X : fronts face the central gully ✓
          Back (local−Z)→world−X, touching X = −25
          Depths → centre X:  Chawl(4.0)→−23, Shop(5.2)→−22.4, Villa(5.4)→−22.3

          Packed north → south along Z:
          H6  GullyChawlHouse 2F W=4.2 : Z −16.0 → −13.9 → −11.8
          H7  TwoStoryShopComplex W=10.4: Z −11.8 →  −6.6 →  −1.4
          H8  ModernGullyHouse   W= 5.4 : Z  −1.4 →   1.3 →   4.0
          H9  GullyChawlHouse 3F W= 4.2 : Z   4.0 →   6.1 →   8.2
      ═══════════════════════════════════════════════════════════════ */}

      {/* H6 — Sai Kripa Chawl 2F */}
      <GullyChawlHouse
        position={[-23.0, YC, -13.9]}
        rotation={[0, Math.PI / 2, 0]}
        storeys={2}
        wallColor="#0284c7"
      />
      <HN n={6} pos={[-23.0, 7.5, -13.9]} c="#38bdf8" />

      {/* H7 — Laxmi Bazaar */}
      <TwoStoryShopComplex
        position={[-22.4, Y0, -6.6]}
        rotation={[0, Math.PI / 2, 0]}
        config={{
          wallColor: '#eae2d5', accentColor: '#9e4436', trimColor: '#ffffff',
          hasWaterTanks: true, hasDishAntenna: true, hasACUnits: true,
          hasClothesline: true, hasRebars: true, hasMumtyCabin: true, hasSignboardLights: true,
        }}
      />
      <HN n={7} pos={[-22.4, 9, -6.6]} c="#fb923c" />

      {/* H8 — Modern Villa West */}
      <ModernGullyHouse
        position={[-22.3, Y0, 1.3]}
        rotation={[0, Math.PI / 2, 0]}
        config={{
          mainColor: '#c7ab85', accentColor: '#2f353d', frameColor: '#f3f4f6',
          hasWaterTank: false, hasDishAntenna: false, hasPalmTree: true,
          hasStreetLamp: true, hasInteriorGlow: true,
        }}
      />
      <HN n={8} pos={[-22.3, 8, 1.3]} c="#c084fc" />

      {/* H9 — Ganesh Chawl 3F */}
      <GullyChawlHouse
        position={[-23.0, YC, 6.1]}
        rotation={[0, Math.PI / 2, 0]}
        storeys={3}
        wallColor="#f59e0b"
      />
      <HN n={9} pos={[-23.0, 11, 6.1]} c="#fbbf24" />

      {/* ═══════════════════════════════════════════════════════════════
          EAST FLANK — rotation [0, −π/2, 0], front faces west (−X)
          local+Z→world−X : fronts face the central gully ✓
          Back (local−Z)→world+X, touching X = +25
          Depths → centre X:  Shop(5.2)→22.4, Villa(5.4)→22.3, Chawl(4.0)→23

          Packed north → south along Z:
          H20 TwoStoryBoxHouse      W= 5.6 : Z −21.6 → −18.8 → −16.0
          H10 ThreeStoryShopComplex W=10.4 : Z −16.0 → −10.8 →  −5.6
          H11 TwoStoryShopComplex   W=10.4 : Z  −5.6 →  −0.4 →   4.8  ★ TARGET
          H12 ModernGullyHouse      W= 5.4 : Z   4.8 →   7.5 →  10.2
          H16 GullyChawlHouse 3F    W= 4.2 : Z  10.2 →  12.3 →  14.4
          H17 TwoStoryBoxHouse      W= 5.6 : Z  14.4 →  17.2 →  20.0
      ═══════════════════════════════════════════════════════════════ */}

      {/* H20 — NE Corner TwoStoryBoxHouse [ROOF BRIDGE: H15 → H20 → H10]
           East flank, north of H10.
           South edge Z = −18.8 + 2.8 = −16.0 → touches H10 north edge ✓
           North edge Z = −18.8 − 2.8 = −21.6 → aligns flush with corner boundary ✓ */}
      <TwoStoryBoxHouse
        position={[19.4, Y0, -19.8]}
        rotation={[0, -Math.PI / 4, 0]}
        config={{
          wallColor: '#e0d2c1', accentColor: '#3a4b56', trimColor: '#f8fafc',
          hasWaterTank: true, hasDishAntenna: true, hasACUnit: true,
          hasClothesline: true, hasRebars: true, hasMumtyCabin: true,
        }}
      />
      <HN n={20} pos={[22.4, 9, -18.8]} c="#34d399" />

      {/* H10 — Mahavir Heights */}
      <ThreeStoryShopComplex
        position={[22.4, Y0, -10.8]}
        rotation={[0, -Math.PI / 2, 0]}
        config={{
          wallColor: '#ded5c5', accentColor: '#2b394a', trimColor: '#f8fafc',
          hasWaterTanks: true, hasDishAntenna: true, hasACUnits: true,
          hasClothesline: true, hasRebars: true, hasMumtyCabin: true, hasSignboardLights: true,
        }}
      />
      <HN n={10} pos={[22.4, 11.5, -10.8]} c="#60a5fa" />

      {/* H11 — Balaji Plaza ★ TARGET — LOST CRICKET BALL ON ROOF ★ */}
      <TwoStoryShopComplex
        position={[22.4, Y0, -0.4]}
        rotation={[0, -Math.PI / 2, 0]}
        config={{
          wallColor: '#ebd8ba', accentColor: '#3d2b24', trimColor: '#fdfbf7',
          hasWaterTanks: true, hasDishAntenna: true, hasACUnits: true,
          hasClothesline: true, hasRebars: true, hasMumtyCabin: true, hasSignboardLights: true,
        }}
      />
      <HN n={11} pos={[22.4, 9, -0.4]} c="#ef4444" />

      {/* H12 — Modern Villa East */}
      <ModernGullyHouse
        position={[22.3, Y0, 7.5]}
        rotation={[0, -Math.PI / 2, 0]}
        config={{
          mainColor: '#c7ab85', accentColor: '#2b3642', frameColor: '#f8fafc',
          hasWaterTank: false, hasDishAntenna: false, hasPalmTree: true,
          hasStreetLamp: true, hasInteriorGlow: true,
        }}
      />
      <HN n={12} pos={[22.3, 8, 7.5]} c="#c084fc" />

      {/* H16 — Om Prakash Chawl 3F [SE east flank filler between H12 & H14] */}
      <GullyChawlHouse
        position={[23.0, YC, 12.3]}
        rotation={[0, -Math.PI / 2, 0]}
        storeys={3}
        wallColor="#16a34a"
      />
      <HN n={16} pos={[23.0, 11, 12.3]} c="#4ade80" />

      {/* H17 — Patel Niwas [SE east flank, between H16 & south boundary] */}
      <TwoStoryBoxHouse
        position={[22.4, Y0, 17.2]}
        rotation={[0, -Math.PI / 2, 0]}
        config={{
          wallColor: '#d9c9b5', accentColor: '#4a3728', trimColor: '#f8fafc',
          hasWaterTank: true, hasDishAntenna: true, hasACUnit: true,
          hasClothesline: true, hasRebars: true, hasMumtyCabin: true,
        }}
      />
      <HN n={17} pos={[22.4, 9, 17.2]} c="#34d399" />

      {/* ═══════════════════════════════════════════════════════════════
          SOUTH ROW — rotation [0, π, 0], front faces north (−Z)
          Back walls touching Z = +25, depth ≈ 5.0m → centre_Z = 22.5
          Packed left → right (west to east):

          H13 ThreeStoryBoxHouse W=5.6 : X −12.8 → −10.0 →  −7.2
          H14 TwoStoryBoxHouse   W=5.6 : X  −7.2 →  −4.4 →  −1.6
          H18 TwoStoryBoxHouse   W=5.6 : X  −1.6 →   1.2 →   4.0
          H19 GullyChawlHouse    W=4.2 : X   4.0 →   6.1 →   8.2
      ═══════════════════════════════════════════════════════════════ */}

      {/* H13 — Shrinath Bhavan */}
      <ThreeStoryBoxHouse
        position={[-10.0, Y0, 22.5]}
        rotation={[0, Math.PI, 0]}
        config={{
          wallColor: '#ded6c7', accentColor: '#2b3642', trimColor: '#f8fafc',
          hasWaterTank: true, hasDishAntenna: true, hasACUnits: true,
          hasClothesline: true, hasRebars: true, hasMumtyCabin: true,
        }}
      />
      <HN n={13} pos={[-10.0, 11.5, 22.5]} c="#a78bfa" />

      {/* H14 — Radha Kunj */}
      <TwoStoryBoxHouse
        position={[-4.4, Y0, 22.5]}
        rotation={[0, Math.PI, 0]}
        config={{
          wallColor: '#d4c6b5', accentColor: '#2d211d', trimColor: '#f8fafc',
          hasWaterTank: true, hasDishAntenna: true, hasACUnit: true,
          hasClothesline: true, hasRebars: true, hasMumtyCabin: true,
        }}
      />
      <HN n={14} pos={[-4.4, 9, 22.5]} c="#34d399" />

      {/* H18 — Suresh Mansion [SE south row, right of H14] */}
      <TwoStoryBoxHouse
        position={[1.2, Y0, 22.5]}
        rotation={[0, Math.PI, 0]}
        config={{
          wallColor: '#cfc3b0', accentColor: '#3c2d1e', trimColor: '#f8fafc',
          hasWaterTank: true, hasDishAntenna: true, hasACUnit: true,
          hasClothesline: true, hasRebars: true, hasMumtyCabin: true,
        }}
      />
      <HN n={18} pos={[1.2, 9, 22.5]} c="#f59e0b" />

      {/* H19 — Deepak Chawl [SE south row corner] */}
      <GullyChawlHouse
        position={[6.1, YC, 22.5]}
        rotation={[0, Math.PI, 0]}
        storeys={2}
        wallColor="#dc2626"
      />
      <HN n={19} pos={[6.1, 7.5, 22.5]} c="#f87171" />

      {/* ═══════════════════════════════════════════════════════════════
          REALISTIC INDIAN ROOFTOP TRAVERSAL NETWORK
          Natural environmental traversal path connecting:
          Ground → H2 Stairs (+3.24m) → Desert Cooler / Ladder → H3 Roof (+6.24m)
          → Scaffold Planks → H4/H5 Roofs (+6.24m) → Sintex Water Tank & Ladder → H15 Tower (+9.24m)
          → Corner Timber Plank → H20 (+6.24m) → Service Ladder → H10 (+9.48m) → Drop to H11 (+6.65m Ball)
      ═══════════════════════════════════════════════════════════════ */}
      <group name="rooftop-traversal-props">
        {/* ── PATH 1: H2 Sharma Niwas (+3.24m) → H3 Gupta Mansion (+6.24m) ── */}
        {/* Step 1: Desert Air Cooler on rusted angle stand against party wall */}
        <DesertCoolerUnit
          position={[-6.38, 4.30, -22.0]}
          rotation={[0, Math.PI / 2, 0]}
          width={0.95}
          height={0.58}
          depth={0.52}
        />
        {/* Step 2: Wall-Mounted AC Condenser Bracket (intermediate step to H3 parapet) */}
        <group position={[-6.38, 5.35, -22.8]} rotation={[0, Math.PI / 2, 0]}>
          <mesh castShadow receiveShadow>
            <boxGeometry args={[0.95, 0.52, 0.45]} />
            <meshStandardMaterial color="#cbd5e1" roughness={0.6} />
          </mesh>
          <mesh position={[0, 0.28, 0]} receiveShadow>
            <boxGeometry args={[0.92, 0.03, 0.42]} />
            <meshStandardMaterial color="#1e293b" roughness={0.8} />
          </mesh>
        </group>
        {/* Wall Maintenance Ladder (direct climb option from H2 terrace to H3) */}
        <WallServiceLadder
          position={[-6.38, 3.24, -21.2]}
          rotation={[0, Math.PI / 2, 0]}
          height={3.0}
        />
        {/* H2 Terrace Clutter: Dish Antenna & Clothesline */}
        <RooftopDishAntenna position={[-9.5, 3.24, -23.8]} rotation={[0, 0.4, 0]} />
        <ClotheslineWithLaundry position={[-10.2, 3.24, -21.4]} rotation={[0, 0.2, 0]} length={3.2} />

        {/* ── PATH 2: H3 (+6.24m) ↔ H4 (+6.24m) ↔ H5 (+6.24m) Connected Terraces ── */}
        {/* Mason's Construction Scaffold Planks spanning parapet gaps */}
        <RooftopPlankBridge position={[-0.8, 6.26, -22.4]} length={2.2} width={0.8} />
        <RooftopPlankBridge position={[4.6, 6.26, -22.4]} length={2.2} width={0.8} />

        {/* H4 Contemporary Villa Terrace Clutter: Woven Charpai Daybed & Clay Pots */}
        <RooftopCharpai position={[1.8, 6.24, -23.4]} rotation={[0, 0.15, 0]} />
        <RooftopDishAntenna position={[3.6, 6.24, -23.8]} rotation={[0, -0.3, 0]} />

        {/* H3 & H5 Terrace Clutter: Clothesline & Clay Water Pots */}
        <ClotheslineWithLaundry position={[-3.5, 6.24, -21.5]} rotation={[0, 0, 0]} length={3.6} />
        <group position={[7.8, 6.24, -23.6]}>
          {/* Stacked Red Terracotta Bricks (builder materials) */}
          <mesh position={[0, 0.2, 0]} castShadow receiveShadow>
            <boxGeometry args={[0.8, 0.4, 0.5]} />
            <meshStandardMaterial color="#9a3412" roughness={0.9} />
          </mesh>
        </group>

        {/* ── PATH 3: H5 Roof (+6.24m) → H15 Joshi Bhavan (+9.24m) ── */}
        {/* 1000L Sintex Black Polymer Water Tank with Service Ladder */}
        <SintexWaterTank position={[10.22, 6.24, -21.2]} color="#0f172a" hasLadder={true} />
        {/* Desert Cooler on stand (intermediate step option) */}
        <DesertCoolerUnit
          position={[10.22, 7.30, -22.0]}
          rotation={[0, -Math.PI / 2, 0]}
          width={0.95}
          height={0.58}
          depth={0.52}
        />
        {/* Upper Condenser Bracket to H15 Roof */}
        <group position={[10.22, 8.35, -22.8]} rotation={[0, -Math.PI / 2, 0]}>
          <mesh castShadow receiveShadow>
            <boxGeometry args={[0.95, 0.52, 0.45]} />
            <meshStandardMaterial color="#cbd5e1" roughness={0.6} />
          </mesh>
        </group>

        {/* ── PATH 4: H15 (+9.24m) → H20 Corner (+6.24m) → H10 Mahavir Heights (+9.48m) ── */}
        {/* Diagonal Scaffold Plank Bridge from H15 to H20 Corner */}
        <RooftopPlankBridge
          position={[18.0, 6.26, -20.2]}
          rotation={[0, Math.PI / 4, 0]}
          length={2.4}
          width={0.8}
        />
        {/* Dark Blue Water Tank on H20 Roof */}
        <SintexWaterTank position={[20.5, 6.24, -18.2]} color="#1e3a8a" hasLadder={false} />
        {/* Commercial AC Condenser Racks on H10 North Wall */}
        <group position={[22.4, 7.35, -15.98]} rotation={[0, Math.PI, 0]}>
          <mesh castShadow receiveShadow>
            <boxGeometry args={[1.1, 0.6, 0.5]} />
            <meshStandardMaterial color="#94a3b8" roughness={0.5} />
          </mesh>
        </group>
        <group position={[21.4, 8.45, -15.98]} rotation={[0, Math.PI, 0]}>
          <mesh castShadow receiveShadow>
            <boxGeometry args={[1.1, 0.6, 0.5]} />
            <meshStandardMaterial color="#94a3b8" roughness={0.5} />
          </mesh>
        </group>
        {/* Steel Utility Ladder on H10 North Wall */}
        <WallServiceLadder
          position={[22.8, 6.24, -15.98]}
          rotation={[0, Math.PI, 0]}
          height={3.25}
        />

        {/* ── PATH 5: H10 Roof (+9.48m) ↔ H11 Balaji Plaza Roof (+6.65m) [Ball Retrieval] ── */}
        {/* Steel Maintenance Ladder on H10 South Wall connecting H11 terrace to H10 */}
        <WallServiceLadder
          position={[21.6, 6.65, -5.62]}
          rotation={[0, 0, 0]}
          height={2.85}
        />
        {/* Desert Cooler on stand (escape climb assist back to H10) */}
        <DesertCoolerUnit
          position={[22.4, 7.80, -5.62]}
          rotation={[0, 0, 0]}
          width={1.1}
          height={0.6}
          depth={0.5}
        />

        {/* ── PATH 6: Alternate West Ascent: H2 Roof (+3.24m) → H1 Commercial (+9.48m) ── */}
        <WallServiceLadder
          position={[-14.58, 3.24, -21.2]}
          rotation={[0, -Math.PI / 2, 0]}
          height={6.25}
        />
      </group>

      {/* ── NATURAL OBJECTIVE: THE LOST CRICKET BALL on H11 Balaji Plaza Rooftop (+6.65m) ── */}
      <group position={[22.4, 6.65, -0.4]} name="objective-cricket-ball">
        {/* Authentic Red Leather Cricket Ball with White Seam */}
        <group position={[0, 0.045, 0]}>
          <mesh castShadow receiveShadow>
            <sphereGeometry args={[0.045, 24, 24]} />
            <meshStandardMaterial color="#991b1b" roughness={0.35} metalness={0.15} />
          </mesh>
          {/* White Raised Hand-Stitched Seam */}
          <mesh rotation={[0, 0, Math.PI / 2]}>
            <torusGeometry args={[0.0452, 0.0035, 8, 32]} />
            <meshStandardMaterial color="#f8fafc" roughness={0.6} />
          </mesh>
        </group>

        {/* Propped Willow Cricket Bat (SS Ton / English Willow style) */}
        <group position={[-0.22, 0.38, -0.15]} rotation={[0.2, 0.3, -0.35]}>
          {/* Wooden Blade */}
          <mesh castShadow>
            <boxGeometry args={[0.11, 0.72, 0.045]} />
            <meshStandardMaterial color="#d4b996" roughness={0.6} />
          </mesh>
          {/* Cane Handle with Maroon Rubber Grip */}
          <mesh position={[0, 0.48, 0]} castShadow>
            <cylinderGeometry args={[0.022, 0.022, 0.28, 12]} />
            <meshStandardMaterial color="#831843" roughness={0.8} />
          </mesh>
        </group>

        {/* Traditional Terracotta Water Pot (Matka) next to the ball */}
        <group position={[0.28, 0.16, 0.12]}>
          <mesh castShadow receiveShadow>
            <sphereGeometry args={[0.16, 16, 16]} />
            <meshStandardMaterial color="#c2410c" roughness={0.85} />
          </mesh>
          {/* Pot Neck & Rim */}
          <mesh position={[0, 0.15, 0]} castShadow>
            <cylinderGeometry args={[0.075, 0.065, 0.08, 16]} />
            <meshStandardMaterial color="#9a3412" roughness={0.85} />
          </mesh>
        </group>

        {/* Woven Charpai Daybed on H11 terrace */}
        <RooftopCharpai position={[-0.8, 0, 0.6]} rotation={[0, Math.PI / 2, 0]} />

        {/* Clothesline on H11 terrace */}
        <ClotheslineWithLaundry position={[0, 0, 1.4]} rotation={[0, Math.PI / 2, 0]} length={2.8} />

        {/* Optional Waypoint Marker (Only if showWaypoints is enabled) */}
        {showWaypoints && (
          <Html position={[0, 1.0, 0]} center distanceFactor={18}>
            <div style={{
              background: 'rgba(15,23,42,0.92)', color: '#f8fafc',
              padding: '4px 10px', borderRadius: '6px', fontSize: '11px',
              fontWeight: 800, whiteSpace: 'nowrap',
              boxShadow: '0 4px 16px rgba(0,0,0,0.5)',
              border: '1px solid #ef4444', display: 'flex',
              alignItems: 'center', gap: '6px', pointerEvents: 'none',
            }}>
              <span>🏏</span>
              <span style={{ color: '#ef4444' }}>LOST BALL</span>
            </div>
          </Html>
        )}
      </group>

      {/* ── LANDMARK HUD BADGES (Only when showZoneLabels is explicitly enabled in studio view) ── */}
      {showZoneLabels && LEVEL_1_LANDMARKS.map((lm) => {
        if (lm.id === 'landmark_ball') return null;
        return (
          <Html key={lm.id} position={lm.position} center distanceFactor={22}>
            <div style={{
              background: 'rgba(15,23,42,0.9)', color: '#f8fafc',
              padding: '3px 8px', borderRadius: '5px', fontSize: '10px',
              fontWeight: 700, whiteSpace: 'nowrap',
              border: `1px solid ${lm.color}`,
              boxShadow: '0 2px 8px rgba(0,0,0,0.4)',
              pointerEvents: 'none', display: 'flex',
              alignItems: 'center', gap: '4px',
            }}>
              <span>{lm.icon}</span>
              <span style={{ color: lm.color }}>{lm.name}</span>
            </div>
          </Html>
        );
      })}
    </group>
  );
}