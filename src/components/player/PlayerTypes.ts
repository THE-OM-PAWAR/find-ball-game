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
  | 'LAND';

/**
 * Keyboard & Mouse Look Input State
 */
export interface PlayerInputState {
  forward: boolean;
  backward: boolean;
  left: boolean;
  right: boolean;
  sprint: boolean;
  crouch: boolean;
  jump: boolean;
  pointerLocked: boolean;
  mouseDeltaX: number;
  mouseDeltaY: number;
}

/**
 * Real-time Physics & Controller Telemetry (used via refs to avoid React re-renders)
 */
export interface PlayerTelemetry {
  position: THREE.Vector3;
  velocity: THREE.Vector3;
  horizontalSpeed: number;
  state: PlayerState;
  isGrounded: boolean;
  isCrouching: boolean;
  facingAngle: number;
  colliderHeight: number;
}

/**
 * Kinematic Controller & Capsule Physical Parameters
 */
export interface PlayerControllerParams {
  standingHeight: number; // 1.80m capsule height
  crouchingHeight: number; // 1.15m crouch capsule height
  radius: number;          // 0.32m capsule radius
  walkSpeed: number;       // 2.2 m/s
  runSpeed: number;        // 4.6 m/s
  sprintSpeed: number;     // 7.2 m/s
  crouchSpeed: number;     // 1.4 m/s
  jumpForce: number;       // 6.0 m/s
  gravity: number;         // 18.0 m/s²
  airControl: number;      // 0.40
  acceleration: number;    // 18.0 m/s²
  deceleration: number;    // 22.0 m/s²
  rotationSpeed: number;   // 14.0 rad/s
  stepHeight: number;      // 0.35m max climbable step
}

export const DEFAULT_PLAYER_PARAMS: PlayerControllerParams = {
  standingHeight: 1.80,
  crouchingHeight: 1.15,
  radius: 0.32,
  walkSpeed: 2.2,
  runSpeed: 4.6,
  sprintSpeed: 7.2,
  crouchSpeed: 1.6,
  jumpForce: 6.0,
  gravity: 18.0,
  airControl: 0.40,
  acceleration: 18.0,
  deceleration: 22.0,
  rotationSpeed: 14.0,
  stepHeight: 0.35,
};

/**
 * Third-Person Orbit Follow Camera Configuration
 */
export interface ThirdPersonCameraParams {
  distance: number;        // Target distance behind player (meters)
  minDistance: number;     // Minimum zoomed-in distance (meters)
  maxDistance: number;     // Maximum zoomed-out distance (meters)
  height: number;          // Camera focal target height above player feet (meters)
  shoulderOffset: number;  // Lateral shoulder offset
  fov: number;             // Default field of view (degrees)
  sprintFov: number;       // Field of view when sprinting (degrees)
  pitchMin: number;        // Lowest pitch limit (degrees)
  pitchMax: number;        // Highest pitch limit (degrees)
  sensitivityX: number;    // Horizontal mouse sensitivity
  sensitivityY: number;    // Vertical mouse sensitivity
  damping: number;         // Damping factor for smooth camera lag
}

export const DEFAULT_CAMERA_PARAMS: ThirdPersonCameraParams = {
  distance: 3.5,
  minDistance: 1.2,
  maxDistance: 7.0,
  height: 1.45,
  shoulderOffset: 0.15,
  fov: 48,
  sprintFov: 56,
  pitchMin: -35,
  pitchMax: 65,
  sensitivityX: 0.003,
  sensitivityY: 0.0024,
  damping: 0.14,
};

/**
 * Environment Collision Box/Cylinder
 */
export interface EnvironmentCollider {
  type: 'box' | 'cylinder';
  min?: THREE.Vector3;
  max?: THREE.Vector3;
  center?: THREE.Vector3;
  radius?: number;
  height?: number;
}
