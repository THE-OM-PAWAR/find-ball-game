import * as THREE from 'three';
import type { EnvironmentCollider } from '../../../../components/player/PlayerTypes';

export interface LevelBlockZone {
  id: string;
  name: string;
  category: 'house' | 'play_area' | 'dog_zone' | 'boundary' | 'exit' | 'pathway' | 'stair';
  position: [number, number, number]; // Center position [x, y, z]
  size: [number, number, number];     // [width(x), height(y), depth(z)]
  color: string;
  wireframeColor?: string;
  opacity?: number;
  label?: string;
  subLabel?: string;
  isWalkableRoof?: boolean;
}

export const LEVEL_BOUNDS = {
  width: 35,
  depth: 35,
  minX: -17.5,
  maxX: 17.5,
  minZ: -17.5,
  maxZ: 17.5,
};

/**
 * 35m x 35m Blueprint Zone Layout
 * Matches the user's architectural schematic:
 * - North: House A (Roof traversal with Dog guarding staircase)
 * - West: Left House (Society boundary)
 * - North-West: Exit from Society Gate
 * - Center-South: Central Gully Cricket Play Area
 * - East: Long House B/C with Lost Cricket Ball on southern rooftop
 */
export const LEVEL_BLOCK_ZONES: LevelBlockZone[] = [
  // 1. Central Gully Play Area (Ground level cricket arena)
  {
    id: 'zone_play_area',
    name: 'Central Gully Play Area',
    category: 'play_area',
    position: [-0.5, 0.01, 3.5],
    size: [11.0, 0.02, 13.0],
    color: '#cbd5e1', // Light clear walkable grey
    wireframeColor: '#94a3b8',
    opacity: 0.9,
    label: '🏏 CENTRAL GULLY PLAY AREA',
    subLabel: 'Cricket Pitch & Open Manoeuvring Ground',
  },

  // 2. House A (North Traversal Building - 1st Floor Roof with Staircase)
  {
    id: 'zone_house_a',
    name: 'House A (North Bungalow)',
    category: 'house',
    position: [0.5, 1.8, -11.5],
    size: [21.0, 3.6, 7.0],
    color: '#475569', // Dark solid greybox block
    wireframeColor: '#334155',
    label: 'HOUSE A (NORTH)',
    subLabel: 'Elevation +3.60m • Walkable Rooftop A',
    isWalkableRoof: true,
  },

  // 3. Dog Patrol Zone (Between Play Area and House A Staircase)
  {
    id: 'zone_dog_zone',
    name: 'Dog Patrol Zone',
    category: 'dog_zone',
    position: [-0.5, 0.02, -5.5],
    size: [10.5, 0.02, 4.5],
    color: '#fef08a', // Translucent yellow warning zone
    wireframeColor: '#ca8a04',
    opacity: 0.45,
    label: '🐕 DOG PATROL ZONE',
    subLabel: 'Stealth Sneak / Biscuit Distraction Sector',
  },

  // 4. House West (Left Society Boundary Building - Multi-Storey)
  {
    id: 'zone_house_west',
    name: 'House West (Society Flank)',
    category: 'house',
    position: [-14.0, 3.2, 3.0],
    size: [6.5, 6.4, 21.0],
    color: '#334155',
    wireframeColor: '#1e293b',
    label: 'HOUSE WEST',
    subLabel: 'Multi-Storey Flank (6.4m Height)',
  },

  // 5. Exit From Society (North-West Gate)
  {
    id: 'zone_exit_society',
    name: 'Exit From Society',
    category: 'exit',
    position: [-14.0, 0.02, -14.0],
    size: [6.5, 0.02, 6.0],
    color: '#fecaca', // Red tint exit zone
    wireframeColor: '#dc2626',
    opacity: 0.75,
    label: '🚪 EXIT FROM SOCIETY',
    subLabel: 'Mission Extraction Gate',
  },

  // 6. House East (House B & C - Long Roof with Ball Objective at South)
  {
    id: 'zone_house_east',
    name: 'House East (House B/C - Ball Building)',
    category: 'house',
    position: [13.5, 2.4, 1.5],
    size: [7.0, 4.8, 23.0],
    color: '#475569',
    wireframeColor: '#334155',
    label: 'HOUSE B & C (BALL BUILDING)',
    subLabel: 'Elevation +4.80m • Rooftop B → Roof C',
    isWalkableRoof: true,
  },

  // 7. Staircase Footprint (Ramp / Step Zone from Dog Area to Roof A)
  {
    id: 'zone_stair_a',
    name: 'Exterior Staircase A',
    category: 'stair',
    position: [-0.5, 1.8, -8.3],
    size: [1.8, 3.6, 2.0],
    color: '#38bdf8', // Light blue traversal marker
    wireframeColor: '#0284c7',
    label: '↑ STAIRCASE TO ROOF A',
    subLabel: '16 Steps Ground → 3.6m',
  },

  // 8. Rooftop Bridge / Transition (Roof A to Roof B/C East)
  {
    id: 'zone_roof_bridge',
    name: 'Rooftop Bridge Transition',
    category: 'pathway',
    position: [9.5, 3.7, -9.0],
    size: [3.5, 0.2, 2.4],
    color: '#a855f7', // Purple transition ledge
    wireframeColor: '#7e22ce',
    label: '→ ROOFTOP LEDGE JUMP / LADDER',
    subLabel: 'Roof A (+3.6m) → Roof B (+4.8m)',
  },
];

/**
 * Generate environment colliders from blueprint zones for physical player walk-through
 */
export function getBlueprintColliders(): EnvironmentCollider[] {
  const colliders: EnvironmentCollider[] = [];

  // Outer 35m x 35m Boundary Walls
  const halfW = LEVEL_BOUNDS.width / 2;
  const halfD = LEVEL_BOUNDS.depth / 2;

  colliders.push(
    // North Wall
    { type: 'box', min: new THREE.Vector3(-halfW, 0, -halfD - 2), max: new THREE.Vector3(halfW, 5, -halfD) },
    // South Wall
    { type: 'box', min: new THREE.Vector3(-halfW, 0, halfD), max: new THREE.Vector3(halfW, 5, halfD + 2) },
    // East Wall
    { type: 'box', min: new THREE.Vector3(halfW, 0, -halfD), max: new THREE.Vector3(halfW + 2, 5, halfD) },
    // West Wall
    { type: 'box', min: new THREE.Vector3(-halfW - 2, 0, -halfD), max: new THREE.Vector3(-halfW, 5, halfD) }
  );

  // House Solid Block Colliders
  LEVEL_BLOCK_ZONES.forEach((zone) => {
    if (zone.category === 'house') {
      const [px, py, pz] = zone.position;
      const [sx, sy, sz] = zone.size;

      colliders.push({
        type: 'box',
        min: new THREE.Vector3(px - sx / 2, 0, pz - sz / 2),
        max: new THREE.Vector3(px + sx / 2, py + sy / 2, pz + sz / 2),
      });
    }
  });

  return colliders;
}
