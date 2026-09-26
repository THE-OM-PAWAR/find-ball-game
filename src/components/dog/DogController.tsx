import * as THREE from 'three';
import type { EnvironmentCollider } from '../player/PlayerTypes';

export interface DogMovementUpdate {
  position: THREE.Vector3;
  rotationY: number;
  currentSpeed: number;
}

const _box3 = new THREE.Box3();
const _nextPos = new THREE.Vector3();
const _displacement = new THREE.Vector3();

/**
 * Resolve dog capsule horizontal collision against box colliders
 */
export function resolveDogEnvironmentCollision(
  currentPos: THREE.Vector3,
  desiredPos: THREE.Vector3,
  colliders: EnvironmentCollider[],
  dogRadius: number = 0.28
): THREE.Vector3 {
  _nextPos.copy(desiredPos);

  // Check collision with each box collider
  for (let i = 0; i < colliders.length; i++) {
    const col = colliders[i];
    if (col.type === 'box' && col.min && col.max) {
      _box3.min.copy(col.min);
      _box3.max.copy(col.max);

      // Check if dog capsule intersects expanded box
      const expandedMinX = col.min.x - dogRadius;
      const expandedMaxX = col.max.x + dogRadius;
      const expandedMinZ = col.min.z - dogRadius;
      const expandedMaxZ = col.max.z + dogRadius;

      if (
        _nextPos.x >= expandedMinX &&
        _nextPos.x <= expandedMaxX &&
        _nextPos.z >= expandedMinZ &&
        _nextPos.z <= expandedMaxZ &&
        _nextPos.y >= col.min.y - 0.5 &&
        _nextPos.y <= col.max.y + 0.5
      ) {
        // Find closest point on box boundary and push out
        const distMinX = Math.abs(_nextPos.x - expandedMinX);
        const distMaxX = Math.abs(_nextPos.x - expandedMaxX);
        const distMinZ = Math.abs(_nextPos.z - expandedMinZ);
        const distMaxZ = Math.abs(_nextPos.z - expandedMaxZ);

        const minDist = Math.min(distMinX, distMaxX, distMinZ, distMaxZ);

        if (minDist === distMinX) _nextPos.x = expandedMinX;
        else if (minDist === distMaxX) _nextPos.x = expandedMaxX;
        else if (minDist === distMinZ) _nextPos.z = expandedMinZ;
        else _nextPos.z = expandedMaxZ;
      }
    }
  }

  return _nextPos;
}

/**
 * Smoothly update dog movement toward target position
 */
export function updateDogMovement(
  currentPos: THREE.Vector3,
  currentRotY: number,
  currentSpeed: number,
  targetPos: THREE.Vector3,
  desiredSpeed: number,
  rotationSpeed: number,
  colliders: EnvironmentCollider[],
  delta: number
): DogMovementUpdate {
  const newPos = currentPos.clone();
  let newRotY = currentRotY;

  // 1. Acceleration / Deceleration
  const accel = desiredSpeed > currentSpeed ? 8.0 : 12.0;
  const newSpeed = THREE.MathUtils.damp(currentSpeed, desiredSpeed, accel, delta);

  // 2. Direction to Target
  _displacement.subVectors(targetPos, currentPos).setY(0);
  const distance = _displacement.length();

  if (distance > 0.15 && newSpeed > 0.05) {
    _displacement.normalize();

    // 3. Smooth Rotation Steering
    // In Three.js, positive Z is backward, model faces +Z or -Z depending on orientation
    // We calculate target facing angle
    const targetAngle = Math.atan2(_displacement.x, _displacement.z);

    // Shortest arc angle difference
    let angleDiff = targetAngle - currentRotY;
    while (angleDiff > Math.PI) angleDiff -= Math.PI * 2;
    while (angleDiff < -Math.PI) angleDiff += Math.PI * 2;

    newRotY = currentRotY + THREE.MathUtils.clamp(angleDiff, -rotationSpeed * delta, rotationSpeed * delta);

    // 4. Position Update with Collision Checking
    const step = _displacement.multiplyScalar(newSpeed * delta);
    const candidatePos = new THREE.Vector3().addVectors(currentPos, step);

    const resolvedPos = resolveDogEnvironmentCollision(currentPos, candidatePos, colliders);
    newPos.copy(resolvedPos);
  }

  return {
    position: newPos,
    rotationY: newRotY,
    currentSpeed: newSpeed,
  };
}
