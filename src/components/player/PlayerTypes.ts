import * as THREE from 'three';

/**
 * Character State Machine States
 */
export type PlayerState =
  | 'IDLE'
  | 'WALK'
  | 'RUN'
  | 'SPRINT'
  | 'CROUCH'
  | 'CROUCH_WALK'
  | 'JUMP'
  | 'FALL'
  | 'LAND'
  | 'HIT_REACTION'
  | 'BATTING_STANCE'
  | 'BATTING_SHOT'
  | 'BOWLING_RUNUP';

/**
 * Keyboard / Mouse / Touch Input State
 */
export interface PlayerInputState {
  forward: boolean;
  backward: boolean;
  left: boolean;
  right: boolean;
  sprint: boolean;
  crouch: boolean;
  jump: boolean;
  action: boolean; // Cricket swing / interact
  specialAction: boolean; // Throw ball / celebrate
  pointerLocked: boolean;
  mouseDeltaX: number;
  mouseDeltaY: number;
}

/**
 * Real-time Physics & Movement Telemetry (for HUD without triggering React re-renders)
 */
export interface PlayerTelemetry {
  position: THREE.Vector3;
  velocity: THREE.Vector3;
  horizontalSpeed: number;
  state: PlayerState;
  isGrounded: boolean;
  isOnSlope: boolean;
  slopeAngleDeg: number;
  stamina: number;
  facingAngle: number;
}

/**
 * Player Physical Properties & Controller Parameters
 */
export interface PlayerControllerParams {
  height: number;           // 1.76m (standard teen athlete height)
  radius: number;           // 0.30m capsule collision radius
  walkSpeed: number;        // 2.2 m/s
  runSpeed: number;         // 4.6 m/s
  sprintSpeed: number;      // 7.2 m/s
  crouchSpeed: number;      // 1.4 m/s
  jumpForce: number;        // 6.2 m/s
  gravity: number;          // 19.6 m/s² (crisp game feel)
  airControl: number;       // 0.45
  acceleration: number;     // 18 m/s²
  deceleration: number;     // 22 m/s²
  rotationSpeed: number;    // 14 rad/s
  maxSlopeAngleDeg: number; // 48 degrees
  stepHeight: number;       // 0.35m
}

export const DEFAULT_PLAYER_PARAMS: PlayerControllerParams = {
  height: 1.76,
  radius: 0.32,
  walkSpeed: 2.2,
  runSpeed: 4.8,
  sprintSpeed: 7.4,
  crouchSpeed: 1.4,
  jumpForce: 6.2,
  gravity: 19.6,
  airControl: 0.45,
  acceleration: 20.0,
  deceleration: 24.0,
  rotationSpeed: 16.0,
  maxSlopeAngleDeg: 48,
  stepHeight: 0.35,
};

/**
 * Third-Person Camera Configuration
 */
export interface ThirdPersonCameraParams {
  distance: number;          // Default 3.4m behind player
  minDistance: number;       // 1.0m
  maxDistance: number;       // 6.5m
  height: number;            // 1.45m above player base
  shoulderOffset: number;    // 0.25m right shoulder offset
  fov: number;               // 48 deg base FOV
  sprintFov: number;         // 56 deg during sprint
  pitchMin: number;          // -40 deg
  pitchMax: number;          // +70 deg
  sensitivityX: number;      // 0.0028
  sensitivityY: number;      // 0.0022
  damping: number;           // 0.12
  collisionRadius: number;   // 0.18m
}

export const DEFAULT_CAMERA_PARAMS: ThirdPersonCameraParams = {
  distance: 3.2,
  minDistance: 1.0,
  maxDistance: 6.0,
  height: 1.4,
  shoulderOffset: 0.22,
  fov: 46,
  sprintFov: 54,
  pitchMin: -35,
  pitchMax: 65,
  sensitivityX: 0.003,
  sensitivityY: 0.0024,
  damping: 0.14,
  collisionRadius: 0.18,
};

/**
 * Character Visual Customization
 */
export interface PlayerAppearanceConfig {
  skinTone: string;
  hairColor: string;
  jerseyColor: string;
  jerseyAccentColor: string;
  jerseyNumber: string;
  shortsColor: string;
  shoesColor: string;
  hasCap: boolean;
  hasGloves: boolean;
  hasWristBand: boolean;
  hasBat: boolean;
  batWoodTone: 'kashmir-willow' | 'english-willow' | 'gully-tape';
}

export const DEFAULT_APPEARANCE: PlayerAppearanceConfig = {
  skinTone: '#c68642',
  hairColor: '#171717',
  jerseyColor: '#1d4ed8',
  jerseyAccentColor: '#f59e0b',
  jerseyNumber: '18',
  shortsColor: '#1e293b',
  shoesColor: '#f8fafc',
  hasCap: true,
  hasGloves: true,
  hasWristBand: true,
  hasBat: true,
  batWoodTone: 'kashmir-willow',
};
