import * as THREE from 'three';
import type { DistractionItem } from './DogTypes';
import { emitNoise } from './DogPerception';

// Active distraction items array
let activeDistractions: DistractionItem[] = [];
let distractionIdCounter = 0;

export function getActiveDistractions(): DistractionItem[] {
  return activeDistractions;
}

export function clearDistractions(): void {
  activeDistractions = [];
}

/**
 * Throw a Biscuit or Distraction item into the scene
 */
export function throwDistractionItem(
  startPos: THREE.Vector3 | [number, number, number],
  direction: THREE.Vector3 | [number, number, number],
  type: DistractionItem['type'] = 'biscuit',
  force: number = 7.5
): DistractionItem {
  const origin = startPos instanceof THREE.Vector3 ? startPos.clone() : new THREE.Vector3(...startPos);
  const dir = direction instanceof THREE.Vector3 ? direction.clone() : new THREE.Vector3(...direction);
  dir.normalize();

  // Add upward arc
  const velocity = dir.clone().multiplyScalar(force);
  velocity.y += 3.2;

  const item: DistractionItem = {
    id: `distraction-${Date.now()}-${++distractionIdCounter}`,
    type,
    position: origin.add({ x: 0, y: 0.7, z: 0 }),
    velocity,
    isGrounded: false,
    spawnTime: performance.now(),
    consumed: false,
  };

  activeDistractions.push(item);

  // Dispatch event for UI
  window.dispatchEvent(new CustomEvent('dog-distraction-thrown', { detail: item }));

  return item;
}

/**
 * Update physical trajectory and ground bounce of active distraction items
 */
export function updateDistractionPhysics(delta: number): void {
  const gravity = 14.0;

  for (let i = activeDistractions.length - 1; i >= 0; i--) {
    const item = activeDistractions[i];
    if (item.consumed) {
      activeDistractions.splice(i, 1);
      continue;
    }

    if (!item.isGrounded) {
      item.velocity.y -= gravity * delta;
      item.position.addScaledVector(item.velocity, delta);

      // Ground hit at y = 0
      if (item.position.y <= 0.05) {
        item.position.y = 0.05;
        item.isGrounded = true;
        item.velocity.set(0, 0, 0);

        // Emit landing sound to attract the dog!
        emitNoise(item.position, 12.0, 0.9, 'biscuit_land');
      }
    }
  }
}

/**
 * Find the closest unconsumed distraction item to the dog
 */
export function findNearestDistraction(dogPos: THREE.Vector3, maxRange: number = 15.0): DistractionItem | null {
  let closest: DistractionItem | null = null;
  let minDistance = maxRange;

  for (let i = 0; i < activeDistractions.length; i++) {
    const item = activeDistractions[i];
    if (item.consumed) continue;

    const dist = dogPos.distanceTo(item.position);
    if (dist < minDistance) {
      minDistance = dist;
      closest = item;
    }
  }

  return closest;
}

/**
 * Mark a distraction item as consumed
 */
export function consumeDistraction(itemId: string): void {
  const item = activeDistractions.find((d) => d.id === itemId);
  if (item) {
    item.consumed = true;
    window.dispatchEvent(new CustomEvent('dog-distraction-consumed', { detail: item }));
  }
}
