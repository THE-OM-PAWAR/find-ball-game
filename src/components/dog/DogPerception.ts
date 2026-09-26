import * as THREE from 'three';
import type { EnvironmentCollider, PlayerTelemetry } from '../player/PlayerTypes';
import type { DogConfig, DogAIState, NoiseEvent } from './DogTypes';

// Global Noise Event Bus
const activeNoiseEvents: NoiseEvent[] = [];
let noiseEventCounter = 0;

/**
 * Emit a physical sound event in the game world
 */
export function emitNoise(
  position: THREE.Vector3 | [number, number, number],
  radius: number,
  intensity: number,
  sourceType: NoiseEvent['sourceType'] = 'generic'
) {
  const pos = position instanceof THREE.Vector3 ? position.clone() : new THREE.Vector3(...position);
  const event: NoiseEvent = {
    id: `noise-${Date.now()}-${++noiseEventCounter}`,
    position: pos,
    radius,
    intensity: Math.min(1.0, Math.max(0.05, intensity)),
    timestamp: performance.now(),
    sourceType,
  };
  activeNoiseEvents.push(event);

  // Dispatch custom DOM event for debug listeners
  window.dispatchEvent(new CustomEvent('dog-noise-emitted', { detail: event }));

  // Prune noise events older than 1.5s
  const now = performance.now();
  while (activeNoiseEvents.length > 0 && now - activeNoiseEvents[0].timestamp > 1500) {
    activeNoiseEvents.shift();
  }
}

/**
 * Fast Line of Sight Raycaster checking bounding box colliders
 */
const _ray = new THREE.Ray();
const _dogEye = new THREE.Vector3();
const _playerTarget = new THREE.Vector3();
const _rayDir = new THREE.Vector3();
const _box3 = new THREE.Box3();
const _hitPoint = new THREE.Vector3();

export function checkLineOfSight(
  dogPos: THREE.Vector3,
  playerPos: THREE.Vector3,
  colliders: EnvironmentCollider[]
): boolean {
  _dogEye.copy(dogPos).add({ x: 0, y: 0.45, z: 0 });
  _playerTarget.copy(playerPos).add({ x: 0, y: 0.85, z: 0 });

  const totalDist = _dogEye.distanceTo(_playerTarget);
  if (totalDist <= 0.05) return true;

  _rayDir.subVectors(_playerTarget, _dogEye).normalize();
  _ray.set(_dogEye, _rayDir);

  // Check intersection with all environment box colliders
  for (let i = 0; i < colliders.length; i++) {
    const col = colliders[i];
    if (col.type === 'box' && col.min && col.max) {
      _box3.min.copy(col.min);
      _box3.max.copy(col.max);

      const intersection = _ray.intersectBox(_box3, _hitPoint);
      if (intersection) {
        const hitDist = _dogEye.distanceTo(_hitPoint);
        // If an obstacle is closer than the player, LOS is blocked!
        if (hitDist < totalDist - 0.2) {
          return false;
        }
      }
    }
  }

  return true;
}

/**
 * Evaluate Dog Perception (Vision + Hearing + Detection Meter)
 */
export interface PerceptionResult {
  isSeeingPlayer: boolean;
  isHearingPlayer: boolean;
  distanceToPlayer: number;
  visionClarity: number; // 0..1
  loudestNoise: NoiseEvent | null;
  newDetection: number;
}

export function evaluateDogPerception(
  dogPos: THREE.Vector3,
  dogForward: THREE.Vector3,
  currentState: DogAIState,
  currentDetection: number,
  config: DogConfig,
  playerTelemetry: PlayerTelemetry | null,
  colliders: EnvironmentCollider[],
  delta: number,
  isSuppressed: boolean
): PerceptionResult {
  const isSleeping = currentState === 'SLEEPING';
  const effectiveVisionRange = isSleeping ? config.sleepingVisionRange : config.visionRange;
  const effectiveVisionAngleDeg = isSleeping ? config.sleepingVisionAngle : config.visionAngle;
  const effectiveVisionAngleRad = (effectiveVisionAngleDeg * Math.PI) / 180;
  const effectiveHearingSensitivity = isSleeping ? config.sleepingHearingSensitivity : config.hearingSensitivity;

  let isSeeingPlayer = false;
  let isHearingPlayer = false;
  let distanceToPlayer = 999.0;
  let visionClarity = 0.0;
  let loudestNoise: NoiseEvent | null = null;
  let maxPerceivedIntensity = 0.0;

  // 1. VISION CHECK
  if (playerTelemetry && !isSuppressed) {
    distanceToPlayer = dogPos.distanceTo(playerTelemetry.position);

    if (distanceToPlayer <= effectiveVisionRange) {
      // Calculate angle between dog forward and direction to player
      const toPlayer = new THREE.Vector3().subVectors(playerTelemetry.position, dogPos).setY(0).normalize();
      const angle = dogForward.angleTo(toPlayer);

      if (angle <= effectiveVisionAngleRad / 2) {
        // Line of sight raycast test
        const hasLOS = checkLineOfSight(dogPos, playerTelemetry.position, colliders);
        if (hasLOS) {
          isSeeingPlayer = true;

          // Stealth factor based on player movement state
          let stealthVisibilityMultiplier = 1.0;
          if (playerTelemetry.state === 'CROUCH' || playerTelemetry.state === 'CROUCH_WALK') {
            stealthVisibilityMultiplier = 0.45; // Crouching is hard to see
          } else if (playerTelemetry.state === 'IDLE') {
            stealthVisibilityMultiplier = 0.65;
          } else if (playerTelemetry.state === 'SPRINT') {
            stealthVisibilityMultiplier = 1.4; // Sprinting catches peripheral eye instantly
          }

          const proximityFactor = 1.0 - distanceToPlayer / effectiveVisionRange;
          visionClarity = Math.max(0.1, proximityFactor * stealthVisibilityMultiplier);
        }
      }
    }
  }

  // 2. HEARING CHECK (Noise System)
  const now = performance.now();
  for (let i = 0; i < activeNoiseEvents.length; i++) {
    const ne = activeNoiseEvents[i];
    if (now - ne.timestamp > 1200) continue;

    const distToNoise = dogPos.distanceTo(ne.position);
    const effectiveRadius = ne.radius * effectiveHearingSensitivity;

    if (distToNoise <= effectiveRadius) {
      const perceivedIntensity = ne.intensity * (1.0 - distToNoise / effectiveRadius);
      if (perceivedIntensity > maxPerceivedIntensity) {
        maxPerceivedIntensity = perceivedIntensity;
        loudestNoise = ne;
      }
    }
  }

  if (maxPerceivedIntensity > 0.15) {
    isHearingPlayer = true;
  }

  // 3. DETECTION METER UPDATE
  let detection = currentDetection;

  if (isSeeingPlayer) {
    // Rise based on clarity and delta
    const rise = config.detectionRiseRate * visionClarity * delta;
    detection = Math.min(100, detection + rise);
  } else if (isHearingPlayer && loudestNoise) {
    // Noise increases suspicion / detection
    const noiseRise = maxPerceivedIntensity * 50 * delta;
    detection = Math.min(85, detection + noiseRise);
  } else {
    // Decay detection when undetected
    const decay = config.detectionDecayRate * delta;
    detection = Math.max(0, detection - decay);
  }

  return {
    isSeeingPlayer,
    isHearingPlayer,
    distanceToPlayer,
    visionClarity,
    loudestNoise,
    newDetection: detection,
  };
}
