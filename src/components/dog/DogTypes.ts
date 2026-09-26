import * as THREE from 'three';
import type { EnvironmentCollider, PlayerTelemetry } from '../player/PlayerTypes';

/**
 * Dog AI States
 */
export type DogAIState =
  | 'SLEEPING'
  | 'IDLE'
  | 'PATROLLING'
  | 'SUSPICIOUS'
  | 'ALERT'
  | 'INVESTIGATING'
  | 'DISTRACTED'
  | 'RETURNING';

/**
 * Noise Events in the world
 */
export interface NoiseEvent {
  id: string;
  position: THREE.Vector3;
  radius: number;
  intensity: number; // 0.0 to 1.0
  timestamp: number;
  sourceType: 'player_walk' | 'player_run' | 'player_sprint' | 'jump_land' | 'biscuit_land' | 'rock_hit' | 'generic';
}

/**
 * Distraction Item (Biscuit / Treat / Thrown Ball)
 */
export interface DistractionItem {
  id: string;
  type: 'biscuit' | 'food' | 'ball';
  position: THREE.Vector3;
  velocity: THREE.Vector3;
  isGrounded: boolean;
  spawnTime: number;
  consumed: boolean;
}

/**
 * Configurable Patrol Point
 */
export interface DogPatrolPoint {
  position: [number, number, number];
  waitTime?: number; // seconds to wait at this point
}

/**
 * Dog Configuration Parameters
 */
export interface DogConfig {
  // Perception - Vision
  visionRange: number;       // Default: 7.0m
  visionAngle: number;       // In degrees, Default: 100°
  sleepingVisionRange: number; // In meters, Default: 2.2m
  sleepingVisionAngle: number; // In degrees, Default: 50°

  // Perception - Hearing
  hearingSensitivity: number; // Multiplier, Default: 1.0
  sleepingHearingSensitivity: number; // Default: 0.35

  // Speeds
  walkSpeed: number;         // Default: 1.8 m/s
  runSpeed: number;          // Default: 4.2 m/s
  prowlSpeed: number;        // Default: 1.1 m/s
  rotationSpeed: number;     // Default: 7.0 rad/s

  // Timers & Behavior
  idleDuration: number;      // Seconds at patrol points, Default: 2.5s
  investigateDuration: number; // Seconds to search an area, Default: 4.0s
  distractedDuration: number; // Seconds to eat/sniff biscuit, Default: 6.0s
  suspiciousThreshold: number; // Detection % for suspicious, Default: 25
  investigateThreshold: number; // Detection % for investigate, Default: 60
  alertThreshold: number;    // Detection % for full alert, Default: 90
  detectionRiseRate: number; // Rate per second when in sight, Default: 45
  detectionDecayRate: number; // Rate per second when lost, Default: 15

  // Distraction & Priority
  distractionPriority: boolean; // Prefer food over player when not yet 100% alert

  // Patrol
  patrolPoints: DogPatrolPoint[];
  startState: DogAIState;
}

export const DEFAULT_DOG_CONFIG: DogConfig = {
  visionRange: 7.0,
  visionAngle: 100,
  sleepingVisionRange: 2.2,
  sleepingVisionAngle: 50,
  hearingSensitivity: 1.0,
  sleepingHearingSensitivity: 0.35,
  walkSpeed: 1.8,
  runSpeed: 4.2,
  prowlSpeed: 1.1,
  rotationSpeed: 7.0,
  idleDuration: 2.5,
  investigateDuration: 4.0,
  distractedDuration: 6.0,
  suspiciousThreshold: 25,
  investigateThreshold: 60,
  alertThreshold: 90,
  detectionRiseRate: 45,
  detectionDecayRate: 15,
  distractionPriority: true,
  startState: 'PATROLLING',
  patrolPoints: [
    { position: [2.0, 0, 2.0], waitTime: 2.0 },
    { position: [-2.0, 0, 2.0], waitTime: 2.0 },
    { position: [-2.0, 0, -2.0], waitTime: 2.0 },
    { position: [2.0, 0, -2.0], waitTime: 2.0 },
  ],
};

/**
 * Real-time Dog Telemetry for UI and AI
 */
export interface DogTelemetry {
  position: THREE.Vector3;
  rotationY: number;
  velocity: THREE.Vector3;
  state: DogAIState;
  detection: number; // 0 to 100
  targetType: 'none' | 'player' | 'noise' | 'distraction' | 'patrol' | 'home';
  targetPosition: THREE.Vector3;
  distanceToPlayer: number;
  isSeeingPlayer: boolean;
  isHearingPlayer: boolean;
  activeDistractionId: string | null;
}
