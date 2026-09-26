import * as THREE from 'three';
import type { EnvironmentCollider } from '../../components/player/PlayerTypes';
import {
  getSingleStoryStairHouseColliders,
  getTwoStoryShopComplexColliders,
  getThreeStoryShopComplexColliders,
  getTwoStoryBoxHouseColliders,
  getThreeStoryBoxHouseColliders,
  getModernGullyHouseColliders,
  getGullyChawlHouseColliders,
  createBoundaryWallColliders,
} from '../../studio/components/3d/collision/HouseColliders';

export interface MapBuildingConfig {
  id: string;
  name: string;
  component: 'SingleStoryStairHouse' | 'TwoStoryShopComplex' | 'ThreeStoryShopComplex' | 'TwoStoryBoxHouse' | 'ThreeStoryBoxHouse' | 'ModernGullyHouse' | 'GullyChawlHouse';
  position: [number, number, number];
  rotation: [number, number, number];
  storeys?: number;
  config?: Record<string, any>;
  description: string;
}

export const MAP_DIMENSIONS = {
  width: 50,
  depth: 50,
  halfWidth: 25,
  halfDepth: 25,
};

/**
 * 50m x 50m Level 1 Dense Indian Gully Map
 * Exactly 14 House Instances - Wall-to-Wall Indian Neighborhood Density:
 * - NO IndianTerraceHouse is used!
 * - 2 x SingleStoryStairHouse (H1, H2)
 * - 2 x GullyChawlHouse (H3, H4)
 * - 2 x ModernGullyHouse (H5, H6)
 * - 2 x TwoStoryBoxHouse (H7, H8)
 * - 2 x TwoStoryShopComplex (H9, H10)
 * - 2 x ThreeStoryBoxHouse (H11, H12)
 * - 2 x ThreeStoryShopComplex (H13, H14)
 */
export const LEVEL_1_HOUSES: MapBuildingConfig[] = [
  // ── NORTH ROW ──
  {
    id: 'h1_shop3',
    name: 'H1: Krishna Commercial Market',
    component: 'ThreeStoryShopComplex',
    position: [-19.8, 0, -22.4],
    rotation: [0, 0, 0],
    description: '3-storey commercial shop complex framing northwest society entrance (+9.48m)',
  },
  {
    id: 'h2_stair',
    name: 'H2: Sharma Niwas (Stair Entry)',
    component: 'SingleStoryStairHouse',
    position: [-10.5, 0, -22.4],
    rotation: [0, 0, 0],
    description: 'Single-storey bungalow with open 16-step staircase to roof (+3.24m)',
  },
  {
    id: 'h3_box2',
    name: 'H3: Gupta Mansion',
    component: 'TwoStoryBoxHouse',
    position: [-3.6, 0, -22.4],
    rotation: [0, 0, 0],
    description: '2-storey box house with AC climbing platforms to reach roof (+6.24m)',
  },
  {
    id: 'h4_modern',
    name: 'H4: Contemporary Villa',
    component: 'ModernGullyHouse',
    position: [1.9, 0, -22.3],
    rotation: [0, 0, 0],
    description: 'Contemporary architectural villa with balcony (+6.24m)',
  },
  {
    id: 'h5_box2',
    name: 'H5: Agarwal House',
    component: 'TwoStoryBoxHouse',
    position: [7.4, 0, -22.4],
    rotation: [0, 0, 0],
    description: '2-storey box house forming continuous rooftop walkway (+6.24m)',
  },
  {
    id: 'h15_box3',
    name: 'H15: Joshi Bhavan',
    component: 'ThreeStoryBoxHouse',
    position: [13.0, 0, -22.4],
    rotation: [0, 0, 0],
    description: '3-storey landmark tower reachable via AC stepping units from H5 (+9.24m)',
  },

  // ── WEST FLANK ──
  {
    id: 'h6_chawl',
    name: 'H6: Sai Kripa Chawl 2F',
    component: 'GullyChawlHouse',
    position: [-23.0, 0, -13.9],
    rotation: [0, Math.PI / 2, 0],
    storeys: 2,
    description: '2-storey chawl facing east into the gully (+6.2m)',
  },
  {
    id: 'h7_shop2',
    name: 'H7: Laxmi Bazaar',
    component: 'TwoStoryShopComplex',
    position: [-22.4, 0, -6.6],
    rotation: [0, Math.PI / 2, 0],
    description: '2-storey commercial shop complex (+6.48m)',
  },
  {
    id: 'h8_modern',
    name: 'H8: Modern Villa West',
    component: 'ModernGullyHouse',
    position: [-22.3, 0, 1.3],
    rotation: [0, Math.PI / 2, 0],
    description: 'Contemporary villa with cantilever balcony (+5.2m)',
  },
  {
    id: 'h9_chawl',
    name: 'H9: Ganesh Chawl 3F',
    component: 'GullyChawlHouse',
    position: [-23.0, 0, 6.1],
    rotation: [0, Math.PI / 2, 0],
    storeys: 3,
    description: '3-storey vibrant chawl building (+9.3m)',
  },

  // ── EAST FLANK ──
  {
    id: 'h20_box2',
    name: 'H20: NE Corner Bridge House',
    component: 'TwoStoryBoxHouse',
    position: [19.4, 0, -19.8],
    rotation: [0, -Math.PI / 4, 0],
    description: '2-storey corner box house connecting north row to east flank (+6.24m)',
  },
  {
    id: 'h10_shop3',
    name: 'H10: Mahavir Heights',
    component: 'ThreeStoryShopComplex',
    position: [22.4, 0, -10.8],
    rotation: [0, -Math.PI / 2, 0],
    description: '3-storey commercial tower (+9.48m)',
  },
  {
    id: 'h11_shop2',
    name: 'H11: Balaji Plaza ★ TARGET ROOFTOP',
    component: 'TwoStoryShopComplex',
    position: [22.4, 0, -0.4],
    rotation: [0, -Math.PI / 2, 0],
    description: 'Target building where the lost red cricket ball is located (+6.65m)',
  },
  {
    id: 'h12_modern',
    name: 'H12: Modern Villa East',
    component: 'ModernGullyHouse',
    position: [22.3, 0, 7.5],
    rotation: [0, -Math.PI / 2, 0],
    description: 'Modern villa enclosing eastern lane (+5.2m)',
  },
  {
    id: 'h16_chawl',
    name: 'H16: Om Prakash Chawl 3F',
    component: 'GullyChawlHouse',
    position: [23.0, 0, 12.3],
    rotation: [0, -Math.PI / 2, 0],
    storeys: 3,
    description: '3-storey chawl on east boundary (+9.3m)',
  },
  {
    id: 'h17_box2',
    name: 'H17: Patel Niwas',
    component: 'TwoStoryBoxHouse',
    position: [22.4, 0, 17.2],
    rotation: [0, -Math.PI / 2, 0],
    description: '2-storey southeast corner house (+6.24m)',
  },

  // ── SOUTH ROW ──
  {
    id: 'h13_box3',
    name: 'H13: Shrinath Bhavan',
    component: 'ThreeStoryBoxHouse',
    position: [-10.0, 0, 22.5],
    rotation: [0, Math.PI, 0],
    description: '3-storey residential house on south wall (+9.48m)',
  },
  {
    id: 'h14_box2',
    name: 'H14: Radha Kunj',
    component: 'TwoStoryBoxHouse',
    position: [-4.4, 0, 22.5],
    rotation: [0, Math.PI, 0],
    description: '2-storey house on south row (+6.24m)',
  },
  {
    id: 'h18_box2',
    name: 'H18: Suresh Mansion',
    component: 'TwoStoryBoxHouse',
    position: [1.2, 0, 22.5],
    rotation: [0, Math.PI, 0],
    description: '2-storey house defining the south gully (+6.24m)',
  },
  {
    id: 'h19_chawl',
    name: 'H19: Deepak Chawl',
    component: 'GullyChawlHouse',
    position: [6.1, 0, 22.5],
    rotation: [0, Math.PI, 0],
    storeys: 2,
    description: '2-storey chawl on southeast corner (+6.2m)',
  },
];

export interface MapLandmarkMarker {
  id: string;
  name: string;
  position: [number, number, number];
  color: string;
  icon: string;
  description: string;
}

export const LEVEL_1_LANDMARKS: MapLandmarkMarker[] = [
  {
    id: 'landmark_spawn',
    name: 'PLAYER_SPAWN',
    position: [0.0, 0.2, 12.0],
    color: '#22c55e',
    icon: '🚩',
    description: 'South gully spawn point looking towards the cricket pitch',
  },
  {
    id: 'landmark_cricket_pitch',
    name: 'CENTRAL_GULLY_PITCH',
    position: [0.0, 0.2, 0.0],
    color: '#38bdf8',
    icon: '🏏',
    description: 'Clay wicket strip with chalk crease, stumps & bat',
  },
  {
    id: 'landmark_dog_zone',
    name: 'DOG_PATROL_ZONE',
    position: [-10.5, 0.2, -14.0],
    color: '#eab308',
    icon: '🐕',
    description: 'Courtyard guarding House 2 exterior stairs (Tommy patrol zone)',
  },
  {
    id: 'landmark_first_stair',
    name: 'STAIR_ENTRY_H2',
    position: [-13.15, 0.2, -20.25],
    color: '#06b6d4',
    icon: '🪜',
    description: 'Base of House 2 open 16-step staircase ascending to roof (+3.24m)',
  },
  {
    id: 'landmark_roof_a',
    name: 'ROOFTOP_RUNWAY_H3_H5',
    position: [1.9, 6.5, -22.3],
    color: '#a855f7',
    icon: '🏢',
    description: 'Continuous 6.24m rooftop runway connecting H3, H4, and H5',
  },
  {
    id: 'landmark_ball',
    name: 'LOST_BALL_OBJECTIVE',
    position: [22.4, 6.65, -0.4],
    color: '#ef4444',
    icon: '🏏',
    description: 'Lost red cricket ball on H11 Balaji Plaza rooftop terrace (+6.65m)',
  },
  {
    id: 'landmark_exit',
    name: 'SOCIETY_EXIT_GATE',
    position: [-19.5, 0.2, -14.5],
    color: '#ec4899',
    icon: '🚪',
    description: 'North-West extraction archway gate (Shanti Niwas Society)',
  },
];

/**
 * Generate accurate, tight physical colliders for all 20 buildings, boundaries, and parkour climbing stepping props
 */
export function getLevel1MapColliders(): EnvironmentCollider[] {
  const colliders: EnvironmentCollider[] = [];

  // 1. Ground Plane Collider (Walkable floor at Y = 0)
  colliders.push({
    type: 'box',
    min: new THREE.Vector3(-25, -1, -25),
    max: new THREE.Vector3(25, 0, 25),
  });

  // 2. Outer 50m x 50m boundary walls
  colliders.push(...createBoundaryWallColliders(MAP_DIMENSIONS.width, MAP_DIMENSIONS.depth, 3.2, 0.45));

  // 3. Exact colliders for all 20 house instances
  LEVEL_1_HOUSES.forEach((house) => {
    const pos = house.position;
    const rotY = house.rotation[1];

    switch (house.component) {
      case 'SingleStoryStairHouse':
        colliders.push(...getSingleStoryStairHouseColliders(pos, rotY));
        break;
      case 'TwoStoryShopComplex':
        colliders.push(...getTwoStoryShopComplexColliders(pos, rotY));
        break;
      case 'ThreeStoryShopComplex':
        colliders.push(...getThreeStoryShopComplexColliders(pos, rotY));
        break;
      case 'TwoStoryBoxHouse':
        colliders.push(...getTwoStoryBoxHouseColliders(pos, rotY));
        break;
      case 'ThreeStoryBoxHouse':
        colliders.push(...getThreeStoryBoxHouseColliders(pos, rotY));
        break;
      case 'ModernGullyHouse':
        colliders.push(...getModernGullyHouseColliders(pos, rotY));
        break;
      case 'GullyChawlHouse':
        colliders.push(...getGullyChawlHouseColliders(pos, rotY, house.storeys || 2));
        break;
    }
  });

  // 4. Climbable AC Outdoor Stepping Units (Walkable step platforms)
  const acSteps: [number, number, number, number, number, number][] = [
    // [minX, minY, minZ, maxX, maxY, maxZ]
    // H2 → H3 West Wall AC steps
    [-6.85, 3.9, -22.5, -5.9, 4.58, -21.5],
    [-6.85, 4.9, -23.3, -5.9, 5.63, -22.3],
    // H5 → H15 West Wall AC steps
    [9.75, 6.9, -22.5, 10.7, 7.58, -21.5],
    [9.75, 7.9, -23.3, 10.7, 8.63, -22.3],
    // H20 → H10 North Wall AC steps
    [21.8, 6.9, -16.5, 23.0, 7.65, -15.5],
    [20.8, 8.0, -16.5, 22.0, 8.75, -15.5],
    // H11 → H10 South Wall Escape AC step
    [21.8, 7.4, -6.1, 23.0, 8.10, -5.1],
    // H2 → H1 Alternate East Wall AC steps
    [-15.1, 4.0, -22.5, -14.1, 4.68, -21.5],
    [-15.1, 5.4, -23.3, -14.1, 6.08, -22.3],
    [-15.1, 6.8, -22.5, -14.1, 7.48, -21.5],
    [-15.1, 8.1, -23.3, -14.1, 8.78, -22.3],
  ];

  for (const [minX, minY, minZ, maxX, maxY, maxZ] of acSteps) {
    colliders.push({
      type: 'box',
      min: new THREE.Vector3(minX, minY, minZ),
      max: new THREE.Vector3(maxX, maxY, maxZ),
    });
  }

  // 5. Rooftop Plank Bridges (Walkable bridges between roofs)
  const plankBridges: [number, number, number, number, number, number][] = [
    // H3 ↔ H4
    [-1.2, 6.2, -23.5, -0.4, 6.35, -21.3],
    // H4 ↔ H5
    [4.2, 6.2, -23.5, 5.0, 6.35, -21.3],
    // H15 ↔ H20 Corner
    [17.0, 6.2, -21.2, 19.0, 6.35, -19.2],
  ];

  for (const [minX, minY, minZ, maxX, maxY, maxZ] of plankBridges) {
    colliders.push({
      type: 'box',
      min: new THREE.Vector3(minX, minY, minZ),
      max: new THREE.Vector3(maxX, maxY, maxZ),
    });
  }

  // 6. Wall Service Ladders (Climbable ladder trigger volumes)
  const ladders = [
    // Ladder 1: H2 Roof (+3.24m) → H3 Roof (+6.24m)
    {
      min: new THREE.Vector3(-6.75, 3.20, -21.55),
      max: new THREE.Vector3(-6.00, 6.35, -20.85),
      targetLandingY: 6.24,
      climbDirection: new THREE.Vector3(1, 0, 0),
    },
    // Ladder 2: H5 Roof (+6.24m) → H15 Landmark Tower (+9.24m)
    {
      min: new THREE.Vector3(9.85, 6.20, -21.55),
      max: new THREE.Vector3(10.60, 9.35, -20.85),
      targetLandingY: 9.24,
      climbDirection: new THREE.Vector3(-1, 0, 0),
    },
    // Ladder 3: H20 Corner (+6.24m) → H10 Shop Complex (+9.48m)
    {
      min: new THREE.Vector3(22.45, 6.20, -16.35),
      max: new THREE.Vector3(23.15, 9.55, -15.60),
      targetLandingY: 9.48,
      climbDirection: new THREE.Vector3(0, 0, 1),
    },
    // Ladder 4: H11 Roof (+6.65m) ↔ H10 South Wall (+9.48m)
    {
      min: new THREE.Vector3(21.25, 6.60, -5.98),
      max: new THREE.Vector3(21.95, 9.55, -5.25),
      targetLandingY: 9.48,
      climbDirection: new THREE.Vector3(0, 0, -1),
    },
    // Ladder 5: H2 Roof (+3.24m) → H1 Shop Complex (+9.48m)
    {
      min: new THREE.Vector3(-14.95, 3.20, -21.55),
      max: new THREE.Vector3(-14.25, 9.55, -20.85),
      targetLandingY: 9.48,
      climbDirection: new THREE.Vector3(-1, 0, 0),
    },
  ];

  for (const lad of ladders) {
    colliders.push({
      type: 'box',
      min: lad.min,
      max: lad.max,
      isLadder: true,
      targetLandingY: lad.targetLandingY,
      climbDirection: lad.climbDirection,
    });
  }

  // 7. Street Vehicles, Electric Utility Poles & Street Obstacles
  const streetObstacles = [
    // Concrete Electric Utility Poles (0.4m x 0.4m x 7.5m)
    { min: new THREE.Vector3(-16.75, 0, -11.25), max: new THREE.Vector3(-16.25, 7.5, -10.75) },
    { min: new THREE.Vector3(-8.25, 0, -14.75), max: new THREE.Vector3(-7.75, 7.5, -14.25) },
    { min: new THREE.Vector3(11.25, 0, -15.75), max: new THREE.Vector3(11.75, 7.5, -15.25) },
    { min: new THREE.Vector3(-6.25, 0, 10.25), max: new THREE.Vector3(-5.75, 7.5, 10.75) },
    { min: new THREE.Vector3(8.25, 0, 12.25), max: new THREE.Vector3(8.75, 7.5, 12.75) },

    // Parked Compact Gully Car at South alley
    { min: new THREE.Vector3(0.8, 0, 16.2), max: new THREE.Vector3(3.2, 1.5, 19.8) },

    // 4-Wheel Vegetable Pushcart (Thela)
    { min: new THREE.Vector3(-5.3, 0, 8.4), max: new THREE.Vector3(-3.7, 1.1, 10.0) },

    // Mature Shade Neem Tree Trunk near House 13
    { min: new THREE.Vector3(-14.7, 0, 19.0), max: new THREE.Vector3(-13.7, 4.5, 20.0) },

    // Tree Trunk near House 12 East Garden Pocket
    { min: new THREE.Vector3(16.4, 0, 8.1), max: new THREE.Vector3(17.2, 4.0, 8.9) },

    // Medium Tree in South-East Corner (Near H19/H17)
    { min: new THREE.Vector3(10.1, 0, 17.1), max: new THREE.Vector3(10.9, 4.0, 17.9) },

    // Tree along West Wall Corridor (Near Society Exit Gate)
    { min: new THREE.Vector3(-18.6, 0, -8.9), max: new THREE.Vector3(-17.8, 4.0, -8.1) },

    // Chai Stall Bench with Milk Cans
    { min: new THREE.Vector3(-15.3, 0, -17.8), max: new THREE.Vector3(-13.7, 0.6, -17.0) },

    // Municipal Twin Dustbins
    { min: new THREE.Vector3(-15.5, 0, -12.0), max: new THREE.Vector3(-14.5, 1.0, -11.0) },

    // Residential Construction Sand & Brick Stack Corner
    { min: new THREE.Vector3(-7.2, 0, 15.3), max: new THREE.Vector3(-5.0, 0.6, 17.6) },

    // Plastic Crates Stack near Chai Stall
    { min: new THREE.Vector3(-13.5, 0, -17.8), max: new THREE.Vector3(-12.9, 0.8, -17.2) },
  ];

  for (const obs of streetObstacles) {
    colliders.push({
      type: 'box',
      min: obs.min,
      max: obs.max,
    });
  }

  return colliders;
}
