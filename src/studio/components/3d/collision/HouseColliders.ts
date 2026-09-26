import * as THREE from 'three';
import type { EnvironmentCollider } from '../../../../components/player/PlayerTypes';

export interface StairColliderParams {
  stepCount: number;
  totalRise: number;
  totalRun: number;
  width: number;
  startLocalZ: number;
  startLocalY: number;
  localX: number;
  position?: [number, number, number];
  rotationY?: number;
}

/**
 * Transforms an axis-aligned local bounding box by translation and Y rotation into world AABB.
 */
export function createTransformedBoxCollider(
  minLocal: [number, number, number],
  maxLocal: [number, number, number],
  position: [number, number, number] = [0, 0, 0],
  rotationY: number = 0
): EnvironmentCollider {
  const [posX, posY, posZ] = position;
  const corners: [number, number, number][] = [
    [minLocal[0], minLocal[1], minLocal[2]],
    [maxLocal[0], minLocal[1], minLocal[2]],
    [minLocal[0], maxLocal[1], minLocal[2]],
    [maxLocal[0], maxLocal[1], minLocal[2]],
    [minLocal[0], minLocal[1], maxLocal[2]],
    [maxLocal[0], minLocal[1], maxLocal[2]],
    [minLocal[0], maxLocal[1], maxLocal[2]],
    [maxLocal[0], maxLocal[1], maxLocal[2]],
  ];

  const cos = Math.cos(rotationY);
  const sin = Math.sin(rotationY);

  let worldMinX = Infinity;
  let worldMinY = Infinity;
  let worldMinZ = Infinity;
  let worldMaxX = -Infinity;
  let worldMaxY = -Infinity;
  let worldMaxZ = -Infinity;

  for (const [cx, cy, cz] of corners) {
    const rx = cx * cos + cz * sin + posX;
    const ry = cy + posY;
    const rz = -cx * sin + cz * cos + posZ;

    if (rx < worldMinX) worldMinX = rx;
    if (ry < worldMinY) worldMinY = ry;
    if (rz < worldMinZ) worldMinZ = rz;
    if (rx > worldMaxX) worldMaxX = rx;
    if (ry > worldMaxY) worldMaxY = ry;
    if (rz > worldMaxZ) worldMaxZ = rz;
  }

  return {
    type: 'box',
    min: new THREE.Vector3(worldMinX, worldMinY, worldMinZ),
    max: new THREE.Vector3(worldMaxX, worldMaxY, worldMaxZ),
  };
}

/**
 * Programmatically generates discrete step box colliders for a playable architectural staircase.
 */
export function createStairColliders(params: StairColliderParams): EnvironmentCollider[] {
  const {
    stepCount,
    totalRise,
    totalRun,
    width,
    startLocalZ,
    startLocalY,
    localX,
    position = [0, 0, 0],
    rotationY = 0,
  } = params;

  const riser = totalRise / stepCount;
  const treadDepth = totalRun / stepCount;
  const colliders: EnvironmentCollider[] = [];

  for (let i = 0; i < stepCount; i++) {
    const stepMinY = startLocalY + i * riser;
    const stepMaxY = startLocalY + (i + 1) * riser;
    const stepMaxZ = startLocalZ - i * treadDepth;
    const stepMinZ = startLocalZ - (i + 1) * treadDepth;

    const minLocal: [number, number, number] = [
      localX - width / 2,
      stepMinY,
      stepMinZ,
    ];
    const maxLocal: [number, number, number] = [
      localX + width / 2,
      stepMaxY,
      stepMaxZ,
    ];

    colliders.push(createTransformedBoxCollider(minLocal, maxLocal, position, rotationY));
  }

  return colliders;
}

/**
 * Generates modular, architectural-matching static colliders for SingleStoryStairHouse (Open-Stair Bungalow).
 */
export function getSingleStoryStairHouseColliders(
  position: [number, number, number] = [0, 0, 0],
  rotationY: number = 0
): EnvironmentCollider[] {
  const colliders: EnvironmentCollider[] = [];

  // 1. Base Plinth (Low walkable platform at Y = 0.24m)
  colliders.push(
    createTransformedBoxCollider([-4.8, 0, -4.2], [4.8, 0.24, 4.2], position, rotationY)
  );

  // 2. Front Veranda Platform (Raised floor at Y = 0.48m)
  colliders.push(
    createTransformedBoxCollider([-2.0, 0.24, 0.4], [2.4, 0.48, 2.0], position, rotationY)
  );

  // 3. Front Entrance 4-Steps (leading from plinth Y=0.24 to veranda Y=0.48 on the right)
  for (let i = 0; i < 4; i++) {
    const stepY = 0.24 + (i + 1) * 0.06;
    const stepZMax = 2.6 - i * 0.15;
    const stepZMin = 2.6 - (i + 1) * 0.15;
    colliders.push(
      createTransformedBoxCollider([0.45, 0.24, stepZMin], [1.95, stepY, stepZMax], position, rotationY)
    );
  }

  // 4. Main House Body Walls (Solid, non-walkable building block, height 3.44m)
  // Left Stair Backing Wall (Flanking interior side of left stairs)
  colliders.push(
    createTransformedBoxCollider([-2.15, 0.24, -2.2], [-1.1, 3.44, 1.4], position, rotationY)
  );
  // Central Facade Wall (Door & Window section)
  colliders.push(
    createTransformedBoxCollider([-1.1, 0.24, -2.2], [1.9, 3.44, 1.4], position, rotationY)
  );
  // Right Wing Wall
  colliders.push(
    createTransformedBoxCollider([1.9, 0.24, -2.2], [3.7, 3.44, 1.4], position, rotationY)
  );

  // 5. 16 Discrete Step Colliders for Open Exterior Staircase on Left Side
  // Climbs from local Y=0.24m at local Z=2.15m to local Y=3.24m at local Z=-1.05m
  const stairSteps = createStairColliders({
    stepCount: 16,
    totalRise: 3.0,
    totalRun: 3.2,
    width: 1.0,
    startLocalZ: 2.15,
    startLocalY: 0.24,
    localX: -2.65,
    position,
    rotationY,
  });
  colliders.push(...stairSteps);

  // Top Stair Landing Pad (Walk-in to rooftop at Y = 3.24m)
  colliders.push(
    createTransformedBoxCollider([-3.15, 3.0, -1.68], [-2.15, 3.24, -1.02], position, rotationY)
  );

  // Bottom Stair Landing Pad (Pad at ground level Y = 0.24m)
  colliders.push(
    createTransformedBoxCollider([-3.15, 0, 2.15], [-2.15, 0.24, 2.45], position, rotationY)
  );

  // Outer Staircase Diagonal Balustrade Wall (Left side railing along X = -3.35 to -3.15)
  colliders.push(
    createTransformedBoxCollider([-3.35, 0.24, -1.7], [-3.15, 3.8, 2.3], position, rotationY)
  );

  // 6. Walkable Rooftop Terrace Floor Slab (Floor at Y = 3.24m)
  colliders.push(
    createTransformedBoxCollider([-2.15, 3.0, -1.9], [3.7, 3.24, 1.9], position, rotationY)
  );

  // 7. Rooftop Parapets & Safety Railings (Prevent falling off the roof)
  // Front Rooftop Parapet Railing
  colliders.push(
    createTransformedBoxCollider([-2.15, 3.24, 1.8], [3.7, 3.85, 1.95], position, rotationY)
  );
  // Right Rooftop Parapet Railing
  colliders.push(
    createTransformedBoxCollider([3.65, 3.24, -1.9], [3.8, 3.85, 1.9], position, rotationY)
  );
  // Back Rooftop Parapet Railing
  colliders.push(
    createTransformedBoxCollider([-2.15, 3.24, -2.0], [3.7, 3.85, -1.85], position, rotationY)
  );

  // Rooftop Sintex Water Tank Obstacle
  colliders.push(
    createTransformedBoxCollider([1.9, 3.24, -1.4], [2.9, 4.4, -0.4], position, rotationY)
  );

  return colliders;
}

/**
 * Generates modular static colliders for TwoStoryShopComplex.
 */
export function getTwoStoryShopComplexColliders(
  position: [number, number, number] = [0, 0, 0],
  rotationY: number = 0
): EnvironmentCollider[] {
  const colliders: EnvironmentCollider[] = [];

  // 1. Plinth Base (Height 0.24m)
  colliders.push(
    createTransformedBoxCollider([-6.2, 0, -4.2], [6.2, 0.24, 4.2], position, rotationY)
  );

  // 2. Main 2-Storey Commercial Building Block (Height 6.48m)
  colliders.push(
    createTransformedBoxCollider([-5.8, 0.24, -3.8], [5.8, 6.48, 3.8], position, rotationY)
  );

  return colliders;
}

/**
 * Generates modular static colliders for ModernGullyHouse.
 */
export function getModernGullyHouseColliders(
  position: [number, number, number] = [0, 0, 0],
  rotationY: number = 0
): EnvironmentCollider[] {
  const colliders: EnvironmentCollider[] = [];

  // 1. Plinth Base (Height 0.24m)
  colliders.push(
    createTransformedBoxCollider([-3.7, 0, -3.7], [3.7, 0.24, 3.7], position, rotationY)
  );

  // 2. Main Villa Building Block (Height 5.20m)
  colliders.push(
    createTransformedBoxCollider([-3.5, 0.24, -3.5], [3.5, 5.20, 3.5], position, rotationY)
  );

  return colliders;
}

/**
 * Generates modular static colliders for ThreeStoryShopComplex.
 */
export function getThreeStoryShopComplexColliders(
  position: [number, number, number] = [0, 0, 0],
  rotationY: number = 0
): EnvironmentCollider[] {
  const colliders: EnvironmentCollider[] = [];
  // 1. Plinth Base (Height 0.24m)
  colliders.push(
    createTransformedBoxCollider([-6.2, 0, -4.2], [6.2, 0.24, 4.2], position, rotationY)
  );
  // 2. Main 3-Storey Commercial Building Block (Height 9.48m)
  colliders.push(
    createTransformedBoxCollider([-5.8, 0.24, -3.8], [5.8, 9.48, 3.8], position, rotationY)
  );
  return colliders;
}

/**
 * Generates modular static colliders for TwoStoryBoxHouse.
 */
export function getTwoStoryBoxHouseColliders(
  position: [number, number, number] = [0, 0, 0],
  rotationY: number = 0
): EnvironmentCollider[] {
  const colliders: EnvironmentCollider[] = [];
  // 1. Plinth Base (Height 0.24m)
  colliders.push(
    createTransformedBoxCollider([-4.2, 0, -3.9], [4.2, 0.24, 3.9], position, rotationY)
  );
  // 2. Main 2-Storey Box Body (Height 6.48m)
  colliders.push(
    createTransformedBoxCollider([-3.9, 0.24, -3.6], [3.9, 6.48, 3.6], position, rotationY)
  );
  return colliders;
}

/**
 * Generates modular static colliders for ThreeStoryBoxHouse.
 */
export function getThreeStoryBoxHouseColliders(
  position: [number, number, number] = [0, 0, 0],
  rotationY: number = 0
): EnvironmentCollider[] {
  const colliders: EnvironmentCollider[] = [];
  // 1. Plinth Base (Height 0.24m)
  colliders.push(
    createTransformedBoxCollider([-4.2, 0, -3.9], [4.2, 0.24, 3.9], position, rotationY)
  );
  // 2. Main 3-Storey Box Body (Height 9.48m)
  colliders.push(
    createTransformedBoxCollider([-3.9, 0.24, -3.6], [3.9, 9.48, 3.6], position, rotationY)
  );
  return colliders;
}

/**
 * Generates modular static colliders for GullyChawlHouse.
 */
export function getGullyChawlHouseColliders(
  position: [number, number, number] = [0, 0, 0],
  rotationY: number = 0,
  storeys: number = 2
): EnvironmentCollider[] {
  const colliders: EnvironmentCollider[] = [];
  const height = storeys * 3.1;
  // 1. Plinth Steps
  colliders.push(
    createTransformedBoxCollider([-2.2, 0, 0.4], [2.2, 0.3, 1.6], position, rotationY)
  );
  // 2. Main Chawl Body
  colliders.push(
    createTransformedBoxCollider([-2.1, 0.3, -2.0], [2.1, height, 2.0], position, rotationY)
  );
  return colliders;
}

/**
 * Generates outer boundary wall box colliders for a level arena of given width & depth.
 */
export function createBoundaryWallColliders(
  width: number = 20,
  depth: number = 20,
  height: number = 2.8,
  thickness: number = 0.4
): EnvironmentCollider[] {
  const halfW = width / 2;
  const halfD = depth / 2;
  return [
    // North Wall
    { type: 'box', min: new THREE.Vector3(-halfW, 0, -halfD - thickness), max: new THREE.Vector3(halfW, height, -halfD) },
    // South Wall
    { type: 'box', min: new THREE.Vector3(-halfW, 0, halfD), max: new THREE.Vector3(halfW, height, halfD + thickness) },
    // East Wall
    { type: 'box', min: new THREE.Vector3(halfW, 0, -halfD), max: new THREE.Vector3(halfW + thickness, height, halfD) },
    // West Wall
    { type: 'box', min: new THREE.Vector3(-halfW - thickness, 0, -halfD), max: new THREE.Vector3(-halfW, height, halfD) },
  ];
}

/**
 * Convenient alias for SingleStoryStairHouse colliders
 */
export const buildSingleStoryHouseColliders = getSingleStoryStairHouseColliders;



