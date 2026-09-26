import React from 'react';
import * as THREE from 'three';
import { MAP_DIMENSIONS } from '../data/mapLayoutData';

interface GroundTerrainProps {
  showPitchMarkings?: boolean;
}

/**
 * 3D Blade Grass Clump with multi-tone leaves
 */
const BladeGrassTuft: React.FC<{
  position: [number, number, number];
  scale?: number;
  color?: string;
}> = ({ position, scale = 1, color = '#4d7c0f' }) => (
  <group position={position} scale={[scale, scale, scale]}>
    {[-0.08, -0.02, 0.04, 0.09].map((offset, i) => (
      <mesh
        key={i}
        position={[offset, 0.1, (i % 2) * 0.05]}
        rotation={[0.15 * i, 0.5 * i, -0.3 + 0.2 * i]}
        castShadow
      >
        <coneGeometry args={[0.035, 0.24, 4]} />
        <meshStandardMaterial color={i % 2 === 0 ? color : '#65a30d'} roughness={0.88} />
      </mesh>
    ))}
    {/* Soil Root Node */}
    <mesh position={[0, 0.01, 0]}>
      <cylinderGeometry args={[0.1, 0.12, 0.02, 8]} />
      <meshStandardMaterial color="#451a03" roughness={0.98} />
    </mesh>
  </group>
);

/**
 * Entrance Ramp (Thada / Otla Ramp) connecting road to house entrance plinths
 */
const EntranceRamp: React.FC<{
  position: [number, number, number];
  rotation?: [number, number, number];
  width?: number;
  length?: number;
  height?: number;
}> = ({ position, rotation = [0, 0, 0], width = 1.4, length = 0.8, height = 0.12 }) => (
  <group position={position} rotation={rotation}>
    <mesh position={[0, height / 2, 0]} rotation={[-0.14, 0, 0]} castShadow receiveShadow>
      <boxGeometry args={[width, 0.04, length]} />
      <meshStandardMaterial color="#8c7b69" roughness={0.88} />
    </mesh>
    {/* Side Concrete/Brick Tapering */}
    <mesh position={[0, height * 0.3, 0]} receiveShadow>
      <boxGeometry args={[width, height * 0.6, length * 0.9]} />
      <meshStandardMaterial color="#6c5c4c" roughness={0.92} />
    </mesh>
  </group>
);

/**
 * Authentic Indian Gully Ground Terrain — Earthen Soil, Clay Lanes & Grassy Courtyards
 */
export const GroundTerrain: React.FC<GroundTerrainProps> = ({ showPitchMarkings = true }) => {
  const { width, depth } = MAP_DIMENSIONS;

  return (
    <group name="ground-terrain">
      {/* ═══════════════════════════════════════════════════════════════
          1. MASTER EARTH & SOIL SUBSTRATE (Warm Rich Indian Dirt)
      ═══════════════════════════════════════════════════════════════ */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.015, 0]} receiveShadow>
        <planeGeometry args={[width + 4, depth + 4, 16, 16]} />
        <meshStandardMaterial
          color="#5a452d" // Deep earthen soil
          roughness={0.96}
          metalness={0.02}
        />
      </mesh>

      {/* ═══════════════════════════════════════════════════════════════
          2. PLAYABLE CORRIDORS: BEATEN CLAY & SOIL ROADWAYS
      ═══════════════════════════════════════════════════════════════ */}
      {/* Central Main Gully Street (Warm beaten earth with sandy dust tint) */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.002, 3.0]} receiveShadow>
        <planeGeometry args={[11.5, 42.0]} />
        <meshStandardMaterial
          color="#735c41"
          roughness={0.94}
        />
      </mesh>

      {/* North Cross Alleyway (Connecting House 1, Sharma Niwas & West alley) */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.003, -11.5]} receiveShadow>
        <planeGeometry args={[38.0, 7.5]} />
        <meshStandardMaterial
          color="#6a543b"
          roughness={0.95}
        />
      </mesh>

      {/* West Chawl Alley (Leading towards Society Exit Gate) */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-16.5, 0.004, -7.5]} receiveShadow>
        <planeGeometry args={[7.5, 21.0]} />
        <meshStandardMaterial
          color="#665037"
          roughness={0.95}
        />
      </mesh>

      {/* South Entrance Alley */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.003, 19.5]} receiveShadow>
        <planeGeometry args={[12.0, 9.0]} />
        <meshStandardMaterial
          color="#6c553c"
          roughness={0.94}
        />
      </mesh>

      {/* ═══════════════════════════════════════════════════════════════
          3. GRASSY COURTYARDS, MEADOW BORDERS & LAWN PATCHES
      ═══════════════════════════════════════════════════════════════ */}
      <group name="grassy-patches">
        {/* North Courtyard Garden Lawn (In front of Sharma Niwas H2) */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-4.0, 0.012, -13.0]} receiveShadow>
          <planeGeometry args={[13.0, 4.5]} />
          <meshStandardMaterial color="#4a6b28" roughness={0.92} />
        </mesh>

        {/* Cricket Arena Grassy Surround (Green grass framing the clay pitch) */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-0.5, 0.005, 5.0]} receiveShadow>
          <planeGeometry args={[6.8, 16.0]} />
          <meshStandardMaterial color="#50732b" roughness={0.92} />
        </mesh>

        {/* South-West Courtyard Grass Lawn (Under large shade tree) */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-11.5, 0.008, 8.5]} receiveShadow>
          <circleGeometry args={[5.2, 24]} />
          <meshStandardMaterial color="#436122" roughness={0.94} />
        </mesh>

        {/* West Boundary Wall Grass Strip */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-17.8, 0.006, 6.0]} receiveShadow>
          <planeGeometry args={[3.2, 22.0]} />
          <meshStandardMaterial color="#3f5a20" roughness={0.95} />
        </mesh>

        {/* East Boundary Wall Grass Strip */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[17.8, 0.006, 6.0]} receiveShadow>
          <planeGeometry args={[3.2, 22.0]} />
          <meshStandardMaterial color="#3f5a20" roughness={0.95} />
        </mesh>
      </group>

      {/* ═══════════════════════════════════════════════════════════════
          4. SANDY DUST & SOIL OVERLAYS (Natural Dirt Wear Tracks)
      ═══════════════════════════════════════════════════════════════ */}
      <group name="dust-soil-overlays">
        {/* Sandy dust patch along foot paths */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-2.5, 0.006, -8.0]} receiveShadow>
          <planeGeometry args={[2.2, 4.8]} />
          <meshStandardMaterial color="#8a7051" roughness={0.96} />
        </mesh>
        <mesh rotation={[-Math.PI / 2, 0, 0.2]} position={[3.2, 0.006, 1.5]} receiveShadow>
          <planeGeometry args={[2.8, 1.8]} />
          <meshStandardMaterial color="#8e7454" roughness={0.96} />
        </mesh>
        <mesh rotation={[-Math.PI / 2, 0, -0.15]} position={[4.5, 0.006, -4.0]} receiveShadow>
          <planeGeometry args={[2.0, 3.2]} />
          <meshStandardMaterial color="#866c4e" roughness={0.96} />
        </mesh>
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-1.8, 0.006, 14.5]} receiveShadow>
          <planeGeometry args={[3.6, 2.2]} />
          <meshStandardMaterial color="#886e50" roughness={0.96} />
        </mesh>
      </group>

      {/* ═══════════════════════════════════════════════════════════════
          5. SIDEWALKS: WEATHERED SANDSTONE PAVERS & INTERLOCK TILES
      ═══════════════════════════════════════════════════════════════ */}
      {/* West House Sidewalk (Earth-toned sandstone pavers) */}
      <group position={[-8.4, 0.015, 3.5]}>
        <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
          <planeGeometry args={[2.6, 33.5]} />
          <meshStandardMaterial color="#948472" roughness={0.88} />
        </mesh>
        {/* Paver slab segmentation lines */}
        {[-14, -10, -6, -2, 2, 6, 10, 14].map((z, idx) => (
          <mesh key={`w-slab-${idx}`} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.001, z]}>
            <planeGeometry args={[2.55, 0.04]} />
            <meshBasicMaterial color="#57493a" />
          </mesh>
        ))}
      </group>

      {/* East House Sidewalk */}
      <group position={[8.4, 0.015, 3.5]}>
        <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
          <planeGeometry args={[2.6, 33.5]} />
          <meshStandardMaterial color="#948472" roughness={0.88} />
        </mesh>
        {/* Paver slab segmentation lines */}
        {[-14, -10, -6, -2, 2, 6, 10, 14].map((z, idx) => (
          <mesh key={`e-slab-${idx}`} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.001, z]}>
            <planeGeometry args={[2.55, 0.04]} />
            <meshBasicMaterial color="#57493a" />
          </mesh>
        ))}
      </group>

      {/* Modern Villa H4 Interlock Terracotta Pavers Porch */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[2.0, 0.016, -18.8]} receiveShadow>
        <planeGeometry args={[5.2, 2.4]} />
        <meshStandardMaterial color="#a14924" roughness={0.82} />
      </mesh>

      {/* ═══════════════════════════════════════════════════════════════
          6. ENTRANCE RAMPS (Earthy Stone / Plaster Ramps)
      ═══════════════════════════════════════════════════════════════ */}
      <group name="entrance-ramps">
        <EntranceRamp position={[-10.2, 0, -15.5]} rotation={[0, 0, 0]} width={1.8} length={0.9} height={0.14} />
        <EntranceRamp position={[1.8, 0, -17.5]} rotation={[0, 0, 0]} width={1.6} length={0.8} height={0.12} />
        <EntranceRamp position={[-15.2, 0, -4.5]} rotation={[0, Math.PI / 2, 0]} width={1.5} length={0.8} height={0.12} />
        <EntranceRamp position={[14.8, 0, 2.0]} rotation={[0, -Math.PI / 2, 0]} width={1.6} length={0.8} height={0.12} />
        <EntranceRamp position={[1.5, 0, 16.2]} rotation={[0, Math.PI, 0]} width={1.6} length={0.8} height={0.12} />
      </group>

      {/* ═══════════════════════════════════════════════════════════════
          7. DRAINAGE EDGES & SLIT GRATES
      ═══════════════════════════════════════════════════════════════ */}
      <group position={[-7.15, 0.02, 3.5]}>
        <mesh castShadow receiveShadow>
          <boxGeometry args={[0.26, 0.05, 33.5]} />
          <meshStandardMaterial color="#6a5d4f" roughness={0.92} />
        </mesh>
        {[-14, -10, -6, -2, 2, 6, 10, 14].map((zOffset, i) => (
          <group key={`drain-w-${i}`} position={[0, 0.028, zOffset]}>
            <mesh>
              <boxGeometry args={[0.22, 0.01, 0.45]} />
              <meshStandardMaterial color="#2d2419" roughness={0.4} metalness={0.7} />
            </mesh>
          </group>
        ))}
      </group>

      <group position={[7.15, 0.02, 3.5]}>
        <mesh castShadow receiveShadow>
          <boxGeometry args={[0.26, 0.05, 33.5]} />
          <meshStandardMaterial color="#6a5d4f" roughness={0.92} />
        </mesh>
        {[-14, -10, -6, -2, 2, 6, 10, 14].map((zOffset, i) => (
          <group key={`drain-e-${i}`} position={[0, 0.028, zOffset]}>
            <mesh>
              <boxGeometry args={[0.22, 0.01, 0.45]} />
              <meshStandardMaterial color="#2d2419" roughness={0.4} metalness={0.7} />
            </mesh>
          </group>
        ))}
      </group>

      {/* ═══════════════════════════════════════════════════════════════
          8. 3D BLADE GRASS CLUMPS & WILD VEGETATION TUFTS
      ═══════════════════════════════════════════════════════════════ */}
      <group name="blade-grass-tufts">
        {/* Along West Sidewalk curb */}
        <BladeGrassTuft position={[-7.1, 0.02, -12.0]} scale={1.1} color="#4d7c0f" />
        <BladeGrassTuft position={[-7.1, 0.02, -5.5]} scale={1.3} color="#527923" />
        <BladeGrassTuft position={[-7.1, 0.02, 3.0]} scale={1.0} color="#65a30d" />
        <BladeGrassTuft position={[-7.1, 0.02, 11.5]} scale={1.2} color="#4d7c0f" />

        {/* Along East Sidewalk curb */}
        <BladeGrassTuft position={[7.1, 0.02, -9.0]} scale={1.1} color="#527923" />
        <BladeGrassTuft position={[7.1, 0.02, -1.0]} scale={1.4} color="#65a30d" />
        <BladeGrassTuft position={[7.1, 0.02, 8.5]} scale={1.0} color="#4d7c0f" />
        <BladeGrassTuft position={[7.1, 0.02, 15.0]} scale={1.25} color="#527923" />

        {/* In Courtyard Under Tree */}
        <BladeGrassTuft position={[-10.2, 0.01, 7.5]} scale={1.4} color="#365314" />
        <BladeGrassTuft position={[-12.8, 0.01, 9.5]} scale={1.5} color="#4d7c0f" />
        <BladeGrassTuft position={[-11.0, 0.01, 10.2]} scale={1.3} color="#65a30d" />

        {/* Around Cricket Wicket Borders */}
        <BladeGrassTuft position={[-3.2, 0.01, 2.0]} scale={1.2} color="#527923" />
        <BladeGrassTuft position={[2.5, 0.01, 7.5]} scale={1.15} color="#65a30d" />
        <BladeGrassTuft position={[-2.8, 0.01, 9.0]} scale={1.3} color="#4d7c0f" />
        <BladeGrassTuft position={[2.9, 0.01, 1.5]} scale={1.2} color="#365314" />
      </group>

      {/* ═══════════════════════════════════════════════════════════════
          9. CAST-IRON MANHOLES
      ═══════════════════════════════════════════════════════════════ */}
      <group position={[-0.5, 0.008, -1.0]}>
        <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
          <circleGeometry args={[0.44, 24]} />
          <meshStandardMaterial color="#382e24" roughness={0.65} metalness={0.7} />
        </mesh>
      </group>
      <group position={[1.5, 0.008, 12.0]}>
        <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
          <circleGeometry args={[0.44, 24]} />
          <meshStandardMaterial color="#382e24" roughness={0.65} metalness={0.7} />
        </mesh>
      </group>

      {/* ═══════════════════════════════════════════════════════════════
          10. RESIDENTIAL RENOVATION / CONSTRUCTION SAND HEAP
      ═══════════════════════════════════════════════════════════════ */}
      <group position={[-6.2, 0, 16.5]} rotation={[0, 0.3, 0]} name="construction-materials">
        <mesh position={[0, 0.2, 0]} castShadow receiveShadow>
          <coneGeometry args={[1.2, 0.42, 16]} />
          <meshStandardMaterial color="#c4a572" roughness={0.98} />
        </mesh>
        <group position={[1.1, 0, -0.2]} rotation={[0, -0.2, 0]}>
          {[0, 0.12, 0.24].map((y, yi) =>
            [-0.22, 0, 0.22].map((z, zi) => (
              <mesh key={`brick-${yi}-${zi}`} position={[0, y + 0.06, z]} castShadow receiveShadow>
                <boxGeometry args={[0.42, 0.11, 0.2]} />
                <meshStandardMaterial color="#991b1b" roughness={0.92} />
              </mesh>
            ))
          )}
        </group>
      </group>

      {/* ═══════════════════════════════════════════════════════════════
          11. CENTRAL CRICKET ARENA - CLAY PITCH & BRICK WICKETS
      ═══════════════════════════════════════════════════════════════ */}
      {showPitchMarkings && (
        <group position={[-0.5, 0.006, 5.0]} name="cricket-pitch">
          {/* Earthen Red-Clay Pitch Rectangle */}
          <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
            <planeGeometry args={[2.8, 12.0]} />
            <meshStandardMaterial
              color="#99583b" // Authentic Indian red-clay wicket dirt
              roughness={0.96}
            />
          </mesh>

          {/* Batting Crease White Chalk Line */}
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.002, 5.0]}>
            <planeGeometry args={[2.4, 0.09]} />
            <meshStandardMaterial color="#fef08a" roughness={0.5} />
          </mesh>
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-1.2, 0.002, 5.35]}>
            <planeGeometry args={[0.09, 0.7]} />
            <meshStandardMaterial color="#fef08a" roughness={0.5} />
          </mesh>
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[1.2, 0.002, 5.35]}>
            <planeGeometry args={[0.09, 0.7]} />
            <meshStandardMaterial color="#fef08a" roughness={0.5} />
          </mesh>

          {/* Bowling Crease Line */}
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.002, -5.0]}>
            <planeGeometry args={[2.4, 0.09]} />
            <meshStandardMaterial color="#fef08a" roughness={0.5} />
          </mesh>

          {/* Gully Cricket Brick Wickets (3 stacked red clay bricks) */}
          <group position={[0, 0, 5.6]}>
            <mesh position={[0, 0.07, 0]} castShadow receiveShadow>
              <boxGeometry args={[0.42, 0.14, 0.22]} />
              <meshStandardMaterial color="#b91c1c" roughness={0.92} />
            </mesh>
            <mesh position={[0, 0.21, 0]} castShadow receiveShadow>
              <boxGeometry args={[0.42, 0.14, 0.22]} />
              <meshStandardMaterial color="#991b1b" roughness={0.92} />
            </mesh>
            <mesh position={[0, 0.35, 0]} castShadow receiveShadow>
              <boxGeometry args={[0.42, 0.14, 0.22]} />
              <meshStandardMaterial color="#b91c1c" roughness={0.92} />
            </mesh>

            {/* Willow Cricket Bat leaning on bricks */}
            <group position={[0.3, 0.38, 0.1]} rotation={[0.2, 0.3, -0.45]}>
              <mesh castShadow receiveShadow>
                <boxGeometry args={[0.11, 0.6, 0.04]} />
                <meshStandardMaterial color="#d4a373" roughness={0.65} />
              </mesh>
              <mesh position={[0, 0.38, 0]} castShadow>
                <cylinderGeometry args={[0.02, 0.02, 0.22, 12]} />
                <meshStandardMaterial color="#1e293b" roughness={0.8} />
              </mesh>
            </group>
          </group>

          {/* Bowler End Single Brick Marker */}
          <mesh position={[0, 0.07, -5.6]} castShadow receiveShadow>
            <boxGeometry args={[0.24, 0.14, 0.12]} />
            <meshStandardMaterial color="#b91c1c" roughness={0.92} />
          </mesh>
        </group>
      )}
    </group>
  );
};
