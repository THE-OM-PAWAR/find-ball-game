import React, { useRef, useEffect, useState, useMemo, useCallback } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { PlayerInputManager } from './PlayerInput';
import { PlayerCamera } from './PlayerCamera';
import { PlayerModel } from './PlayerModel';
import { PlayerAnimation } from './PlayerAnimation';
import {
  DEFAULT_PLAYER_PARAMS,
  type PlayerControllerParams,
  type ThirdPersonCameraParams,
  type PlayerTelemetry,
  type PlayerState,
  type EnvironmentCollider,
} from './PlayerTypes';

export interface PlayerControllerProps {
  initialPosition?: [number, number, number];
  playerParams?: Partial<PlayerControllerParams>;
  cameraParams?: Partial<ThirdPersonCameraParams>;
  colliders?: EnvironmentCollider[];
  onTelemetryUpdate?: (telemetry: PlayerTelemetry) => void;
  showColliderDebug?: boolean;
  enabled?: boolean;
}

export const PlayerController: React.FC<PlayerControllerProps> = ({
  initialPosition = [0, 0, 0],
  playerParams = {},
  cameraParams = {},
  colliders = [],
  onTelemetryUpdate,
  showColliderDebug = false,
  enabled = true,
}) => {
  const { gl } = useThree();

  const params: PlayerControllerParams = useMemo(() => ({
    ...DEFAULT_PLAYER_PARAMS,
    ...playerParams,
  }), [playerParams]);

  // Input Manager
  const inputManager = useMemo(() => new PlayerInputManager(), []);

  // Visual & Physics Node References
  const physicsBodyRef = useRef<THREE.Group>(null);
  const cameraYawRef = useRef<number>(0);
  const bonesMapRef = useRef<Map<string, THREE.Bone>>(new Map());

  // Kinematic Physics State (Mutated in useFrame without React re-renders)
  const pos = useRef<THREE.Vector3>(new THREE.Vector3(...initialPosition));
  const vel = useRef<THREE.Vector3>(new THREE.Vector3(0, 0, 0));
  const facingAngleRef = useRef<number>(0);
  const isGroundedRef = useRef<boolean>(true);
  const isCrouchingRef = useRef<boolean>(false);
  const colliderHeightRef = useRef<number>(params.standingHeight);
  const currentStateRef = useRef<PlayerState>('IDLE');

  // React State for visual state transitions
  const [visualState, setVisualState] = useState<PlayerState>('IDLE');
  const [visualFacingAngle, setVisualFacingAngle] = useState<number>(0);
  const [visualHorizontalSpeed, setVisualHorizontalSpeed] = useState<number>(0);
  const [visualIsGrounded, setVisualIsGrounded] = useState<boolean>(true);
  const [visualIsCrouching, setVisualIsCrouching] = useState<boolean>(false);
  const [mouseDelta, setMouseDelta] = useState<{ deltaX: number; deltaY: number }>({ deltaX: 0, deltaY: 0 });

  // Temporary Vectors for allocation-free useFrame loop
  const tempMoveDir = useMemo(() => new THREE.Vector3(), []);
  const tempTargetVel = useMemo(() => new THREE.Vector3(), []);

  // Attach input listeners
  useEffect(() => {
    if (gl.domElement) {
      inputManager.attach(gl.domElement);
    }
    return () => {
      inputManager.detach();
    };
  }, [gl.domElement, inputManager]);

  useEffect(() => {
    inputManager.setEnabled(enabled);
  }, [enabled, inputManager]);

  const handleModelReady = useCallback((_model: THREE.Group, bones: Map<string, THREE.Bone>) => {
    bonesMapRef.current = bones;
  }, []);

  // Physics & Movement Loop (60 FPS)
  useFrame((_, delta) => {
    if (!enabled) return;

    const dt = Math.min(delta, 0.05);

    // 1. Consume Mouse Look Delta for Camera
    const deltaMouse = inputManager.consumeMouseDelta();
    setMouseDelta(deltaMouse);

    // 2. Query Keyboard Inputs
    const input = inputManager.getState();

    // 3. Camera-Relative Movement Vector Calculation
    tempMoveDir.set(0, 0, 0);
    if (input.forward) tempMoveDir.z -= 1;
    if (input.backward) tempMoveDir.z += 1;
    if (input.left) tempMoveDir.x -= 1;
    if (input.right) tempMoveDir.x += 1;

    const hasMovementInput = tempMoveDir.lengthSq() > 0.001;
    if (hasMovementInput) {
      tempMoveDir.normalize();
      // Rotate movement direction by camera yaw
      tempMoveDir.applyAxisAngle(new THREE.Vector3(0, 1, 0), cameraYawRef.current);
    }

    // 4. Crouching & Ceiling Space Check
    if (input.crouch) {
      isCrouchingRef.current = true;
      colliderHeightRef.current = params.crouchingHeight;
    } else if (isCrouchingRef.current) {
      // Check ceiling clearance before standing up
      let hasCeilingObstacle = false;
      const headCheckY = pos.current.y + params.standingHeight;
      for (const col of colliders) {
        if (col.type === 'box' && col.min && col.max) {
          if (
            pos.current.x >= col.min.x - params.radius &&
            pos.current.x <= col.max.x + params.radius &&
            pos.current.z >= col.min.z - params.radius &&
            pos.current.z <= col.max.z + params.radius
          ) {
            if (headCheckY >= col.min.y && pos.current.y <= col.min.y) {
              hasCeilingObstacle = true;
              break;
            }
          }
        }
      }

      if (!hasCeilingObstacle) {
        isCrouchingRef.current = false;
        colliderHeightRef.current = params.standingHeight;
      }
    }

    // 5. Target Horizontal Speed
    let targetSpeed = 0;
    if (hasMovementInput) {
      if (isCrouchingRef.current) {
        targetSpeed = params.crouchSpeed;
      } else if (input.sprint) {
        targetSpeed = params.sprintSpeed;
      } else {
        targetSpeed = params.runSpeed;
      }
    }

    // 6. Horizontal Velocity Acceleration / Deceleration
    tempTargetVel.copy(tempMoveDir).multiplyScalar(targetSpeed);
    const accelRate = isGroundedRef.current
      ? (hasMovementInput ? params.acceleration : params.deceleration)
      : params.acceleration * params.airControl;

    vel.current.x = THREE.MathUtils.damp(vel.current.x, tempTargetVel.x, accelRate, dt);
    vel.current.z = THREE.MathUtils.damp(vel.current.z, tempTargetVel.z, accelRate, dt);

    // 7. Smooth Character Rotation (Facing movement direction)
    if (hasMovementInput) {
      const targetAngle = Math.atan2(tempMoveDir.x, tempMoveDir.z);
      let angleDiff = (targetAngle - facingAngleRef.current) % (Math.PI * 2);
      if (angleDiff > Math.PI) angleDiff -= Math.PI * 2;
      if (angleDiff < -Math.PI) angleDiff += Math.PI * 2;
      facingAngleRef.current += angleDiff * Math.min(1, params.rotationSpeed * dt);
    }

    // 8. Vertical Physics: Jump & Gravity
    if (isGroundedRef.current) {
      if (input.jump && !isCrouchingRef.current) {
        vel.current.y = params.jumpForce;
        isGroundedRef.current = false;
      } else {
        vel.current.y = -2.0; // Ground snap clamp
      }
    } else {
      vel.current.y -= params.gravity * dt;
      if (vel.current.y < -30) vel.current.y = -30;
    }

    // 9. Integrate Proposed Position
    const proposedPos = pos.current.clone().addScaledVector(vel.current, dt);

    // 10. Resolve Collisions against Colliders with Step-Up Support
    const currentRadius = params.radius;
    const currentHeight = colliderHeightRef.current;

    for (const col of colliders) {
      if (col.type === 'box' && col.min && col.max) {
        if (proposedPos.y < col.max.y && proposedPos.y + currentHeight > col.min.y) {
          // Check step climbing
          const stepDiff = col.max.y - proposedPos.y;
          if (stepDiff > 0 && stepDiff <= params.stepHeight && vel.current.y <= 0) {
            proposedPos.y = col.max.y;
            continue;
          }

          // Horizontal pushback
          const closestX = THREE.MathUtils.clamp(proposedPos.x, col.min.x, col.max.x);
          const closestZ = THREE.MathUtils.clamp(proposedPos.z, col.min.z, col.max.z);

          const dx = proposedPos.x - closestX;
          const dz = proposedPos.z - closestZ;
          const distSq = dx * dx + dz * dz;

          if (distSq < currentRadius * currentRadius && distSq > 0.00001) {
            const dist = Math.sqrt(distSq);
            const overlap = currentRadius - dist;
            const nx = dx / dist;
            const nz = dz / dist;

            proposedPos.x += nx * overlap;
            proposedPos.z += nz * overlap;

            const dot = vel.current.x * nx + vel.current.z * nz;
            if (dot < 0) {
              vel.current.x -= dot * nx;
              vel.current.z -= dot * nz;
            }
          }
        }
      }
    }

    // 11. Ground Detection
    let groundLevel = 0; // Default flat terrain plane at Y = 0
    const rayStartY = proposedPos.y + 0.5;

    for (const col of colliders) {
      if (col.type === 'box' && col.min && col.max) {
        if (
          proposedPos.x >= col.min.x - currentRadius &&
          proposedPos.x <= col.max.x + currentRadius &&
          proposedPos.z >= col.min.z - currentRadius &&
          proposedPos.z <= col.max.z + currentRadius
        ) {
          if (rayStartY >= col.max.y && col.max.y >= groundLevel) {
            groundLevel = col.max.y;
          }
        }
      }
    }

    if (proposedPos.y <= groundLevel + 0.06) {
      proposedPos.y = groundLevel;
      if (vel.current.y < 0) {
        vel.current.y = 0;
      }
      isGroundedRef.current = true;
    } else {
      isGroundedRef.current = false;
    }

    pos.current.copy(proposedPos);

    // 12. Update Physics Body Transform in Scene
    if (physicsBodyRef.current) {
      physicsBodyRef.current.position.copy(pos.current);
    }

    // 13. State Machine Calculation
    const horizontalSpeed = Math.sqrt(vel.current.x * vel.current.x + vel.current.z * vel.current.z);

    let nextState: PlayerState = 'IDLE';
    if (!isGroundedRef.current) {
      nextState = vel.current.y > 0.5 ? 'JUMP' : 'FALL';
    } else if (isCrouchingRef.current) {
      nextState = horizontalSpeed > 0.25 ? 'CROUCH_WALK' : 'CROUCH';
    } else if (horizontalSpeed > 5.5) {
      nextState = 'SPRINT';
    } else if (horizontalSpeed > 2.5) {
      nextState = 'RUN';
    } else if (horizontalSpeed > 0.3) {
      nextState = 'WALK';
    } else {
      nextState = 'IDLE';
    }

    currentStateRef.current = nextState;

    // Sync visual state for rendering
    if (visualState !== nextState) setVisualState(nextState);
    setVisualFacingAngle(facingAngleRef.current);
    setVisualHorizontalSpeed(horizontalSpeed);
    setVisualIsGrounded(isGroundedRef.current);
    setVisualIsCrouching(isCrouchingRef.current);

    // 14. Report Telemetry to HUD
    if (onTelemetryUpdate) {
      onTelemetryUpdate({
        position: pos.current.clone(),
        velocity: vel.current.clone(),
        horizontalSpeed,
        state: nextState,
        isGrounded: isGroundedRef.current,
        isCrouching: isCrouchingRef.current,
        facingAngle: facingAngleRef.current,
        colliderHeight: currentHeight,
      });
    }
  });

  return (
    <>
      {/* 
        PHYSICS BODY: 
        Separate Capsule Collider root controlling character world position.
        The visual GLB model follows this physics body.
      */}
      <group ref={physicsBodyRef} position={initialPosition}>
        {/* Visual Capsule Collider representation (Debug) */}
        {showColliderDebug && (
          <mesh position={[0, visualIsCrouching ? params.crouchingHeight / 2 : params.standingHeight / 2, 0]}>
            <capsuleGeometry
              args={[
                params.radius,
                visualIsCrouching ? params.crouchingHeight - params.radius * 2 : params.standingHeight - params.radius * 2,
                8,
                16,
              ]}
            />
            <meshBasicMaterial color="#00ff88" wireframe transparent opacity={0.6} />
          </mesh>
        )}

        {/* GLB Character Model */}
        <PlayerModel
          state={visualState}
          facingAngle={visualFacingAngle}
          horizontalSpeed={visualHorizontalSpeed}
          isGrounded={visualIsGrounded}
          isCrouching={visualIsCrouching}
          onModelReady={handleModelReady}
        />

        {/* Animation & Bone Blending System */}
        <PlayerAnimation
          state={visualState}
          horizontalSpeed={visualHorizontalSpeed}
          isGrounded={visualIsGrounded}
          isCrouching={visualIsCrouching}
          bonesMap={bonesMapRef.current}
        />
      </group>

      {/* Third-Person Follow Camera System */}
      <PlayerCamera
        targetPosition={pos.current}
        targetYaw={cameraYawRef.current}
        mouseDelta={mouseDelta}
        isSprinting={visualState === 'SPRINT'}
        params={cameraParams}
        colliders={colliders}
        onYawChange={(yaw) => {
          cameraYawRef.current = yaw;
        }}
        enabled={enabled}
      />
    </>
  );
};
