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
  const isClimbingLadderRef = useRef<boolean>(false);
  const activeLadderRef = useRef<EnvironmentCollider | null>(null);
  const climbingWallTimerRef = useRef<number>(0);

  // React State for visual state transitions
  const [visualState, setVisualState] = useState<PlayerState>('IDLE');
  const [visualFacingAngle, setVisualFacingAngle] = useState<number>(0);
  const [visualHorizontalSpeed, setVisualHorizontalSpeed] = useState<number>(0);
  const [visualIsGrounded, setVisualIsGrounded] = useState<boolean>(true);
  const [visualIsCrouching, setVisualIsCrouching] = useState<boolean>(false);
  const [mouseDelta, setMouseDelta] = useState<{ deltaX: number; deltaY: number }>({ deltaX: 0, deltaY: 0 });
  const [characterModel, setCharacterModel] = useState<THREE.Group | null>(null);

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

  const bindQuatsRef = useRef<Map<string, THREE.Quaternion>>(new Map());
  const bindPositionsRef = useRef<Map<string, THREE.Vector3>>(new Map());

  const handleModelReady = useCallback((
    model: THREE.Group,
    bones: Map<string, THREE.Bone>,
    bindQuats?: Map<string, THREE.Quaternion>,
    bindPositions?: Map<string, THREE.Vector3>
  ) => {
    bonesMapRef.current = bones;
    if (bindQuats) bindQuatsRef.current = bindQuats;
    if (bindPositions) bindPositionsRef.current = bindPositions;
    setCharacterModel(model);
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

    // 4. Check Ladder Interactions
    if (isClimbingLadderRef.current && activeLadderRef.current) {
      const lad = activeLadderRef.current;
      const climbSpeed = params.climbSpeed || 2.5;

      // Face the ladder
      if (lad.climbDirection) {
        const ladderAngle = Math.atan2(lad.climbDirection.x, lad.climbDirection.z);
        facingAngleRef.current = THREE.MathUtils.damp(facingAngleRef.current, ladderAngle, 18, dt);
      }

      // Vertical climb controls
      if (input.forward) {
        vel.current.y = climbSpeed;
      } else if (input.backward) {
        vel.current.y = -climbSpeed;
      } else {
        vel.current.y = 0;
      }

      vel.current.x = 0;
      vel.current.z = 0;

      // Jump off ladder
      if (input.jump) {
        vel.current.y = params.jumpForce * 0.85;
        const pushX = lad.climbDirection ? -lad.climbDirection.x * 2.5 : 0;
        const pushZ = lad.climbDirection ? -lad.climbDirection.z * 2.5 : 0;
        vel.current.x = pushX;
        vel.current.z = pushZ;
        isClimbingLadderRef.current = false;
        activeLadderRef.current = null;
      } else {
        // Reached top of ladder -> step onto roof
        if (lad.max && pos.current.y >= lad.max.y - 0.25) {
          pos.current.y = lad.targetLandingY || lad.max.y;
          if (lad.climbDirection) {
            pos.current.x += lad.climbDirection.x * 0.65;
            pos.current.z += lad.climbDirection.z * 0.65;
          }
          vel.current.set(0, 0, 0);
          isClimbingLadderRef.current = false;
          activeLadderRef.current = null;
          isGroundedRef.current = true;
        } else if (lad.min && pos.current.y <= lad.min.y && input.backward) {
          isClimbingLadderRef.current = false;
          activeLadderRef.current = null;
        }
      }
    } else {
      // Check if player entered a ladder trigger
      for (const col of colliders) {
        if (col.isLadder && col.min && col.max) {
          const inLadderBounds =
            pos.current.x >= col.min.x - 0.45 &&
            pos.current.x <= col.max.x + 0.45 &&
            pos.current.z >= col.min.z - 0.45 &&
            pos.current.z <= col.max.z + 0.45 &&
            pos.current.y >= col.min.y - 0.2 &&
            pos.current.y <= col.max.y + 0.4;

          if (inLadderBounds && (hasMovementInput || input.jump)) {
            isClimbingLadderRef.current = true;
            activeLadderRef.current = col;
            vel.current.set(0, 0, 0);
            break;
          }
        }
      }
    }

    // 5. Crouching & Ceiling Space Check (when not on ladder)
    if (!isClimbingLadderRef.current) {
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
    }

    // 6. Target Horizontal Speed & Velocity (Normal Locomotion)
    if (!isClimbingLadderRef.current) {
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

      tempTargetVel.copy(tempMoveDir).multiplyScalar(targetSpeed);
      const accelRate = isGroundedRef.current
        ? (hasMovementInput ? params.acceleration : params.deceleration)
        : params.acceleration * params.airControl;

      vel.current.x = THREE.MathUtils.damp(vel.current.x, tempTargetVel.x, accelRate, dt);
      vel.current.z = THREE.MathUtils.damp(vel.current.z, tempTargetVel.z, accelRate, dt);

      // Smooth Character Rotation
      if (hasMovementInput && climbingWallTimerRef.current <= 0) {
        const targetAngle = Math.atan2(tempMoveDir.x, tempMoveDir.z);
        let angleDiff = (targetAngle - facingAngleRef.current) % (Math.PI * 2);
        if (angleDiff > Math.PI) angleDiff -= Math.PI * 2;
        if (angleDiff < -Math.PI) angleDiff += Math.PI * 2;
        facingAngleRef.current += angleDiff * Math.min(1, params.rotationSpeed * dt);
      }

      // Vertical Physics: Jump & Gravity
      if (isGroundedRef.current) {
        if (input.jump && !isCrouchingRef.current) {
          vel.current.y = params.jumpForce;
          isGroundedRef.current = false;
        } else {
          vel.current.y = 0;
        }
      } else {
        vel.current.y -= params.gravity * dt;
        if (vel.current.y < -30) vel.current.y = -30;
      }

      // 7. Smooth Climbing & Mantling Detection (AC Units, Wall Ledges, Parapets)
      let isClimbingAssist = false;
      if (hasMovementInput || input.jump) {
        for (const col of colliders) {
          if (col.type === 'box' && col.min && col.max && !col.isLadder) {
            const ledgeTop = col.max.y;
            const heightDiff = ledgeTop - pos.current.y;

            // Check reachable climb height range (0.35m to 2.4m above feet)
            if (heightDiff > params.stepHeight && heightDiff <= 2.4) {
              const closestX = THREE.MathUtils.clamp(pos.current.x, col.min.x, col.max.x);
              const closestZ = THREE.MathUtils.clamp(pos.current.z, col.min.z, col.max.z);
              const toLedgeX = closestX - pos.current.x;
              const toLedgeZ = closestZ - pos.current.z;
              const distToLedge = Math.sqrt(toLedgeX * toLedgeX + toLedgeZ * toLedgeZ);

              if (distToLedge < params.radius + 0.55) {
                const dotMove = toLedgeX * tempMoveDir.x + toLedgeZ * tempMoveDir.z;
                if (dotMove > 0.01 || input.jump) {
                  isClimbingAssist = true;
                  climbingWallTimerRef.current = 0.55;

                  // Smooth upward mantle impulse
                  vel.current.y = Math.max(vel.current.y, 4.9);
                  // Forward assist to pull player safely onto the ledge
                  vel.current.x += tempMoveDir.x * 0.9;
                  vel.current.z += tempMoveDir.z * 0.9;

                  // Face the climbing obstacle
                  const climbAngle = Math.atan2(toLedgeX, toLedgeZ);
                  facingAngleRef.current = THREE.MathUtils.damp(facingAngleRef.current, climbAngle, 18, dt);
                  break;
                }
              }
            }
          }
        }
      }

      if (climbingWallTimerRef.current > 0) {
        climbingWallTimerRef.current -= dt;
      }
    }

    // 8. Proposed Position before collision
    const proposedPos = pos.current.clone();
    proposedPos.x += vel.current.x * dt;
    proposedPos.z += vel.current.z * dt;
    proposedPos.y += vel.current.y * dt;

    const currentRadius = params.radius;
    const currentHeight = colliderHeightRef.current;

    // 9. Resolve Step-Up & Horizontal Collisions against Static Colliders (when not on ladder)
    if (!isClimbingLadderRef.current) {
      for (const col of colliders) {
        if (col.type === 'box' && col.min && col.max && !col.isLadder) {
          const playerBottom = proposedPos.y;
          const playerTop = proposedPos.y + currentHeight;

          // Skip if entirely above or below this collider
          if (playerBottom >= col.max.y || playerTop <= col.min.y) {
            continue;
          }

          // Horizontal closest point on AABB
          const closestX = THREE.MathUtils.clamp(proposedPos.x, col.min.x, col.max.x);
          const closestZ = THREE.MathUtils.clamp(proposedPos.z, col.min.z, col.max.z);

          const dx = proposedPos.x - closestX;
          const dz = proposedPos.z - closestZ;
          const distSq = dx * dx + dz * dz;

          const isInside =
            proposedPos.x >= col.min.x &&
            proposedPos.x <= col.max.x &&
            proposedPos.z >= col.min.z &&
            proposedPos.z <= col.max.z;

          if (distSq < currentRadius * currentRadius || isInside) {
            // Check if this is a walkable step-up or climbable ledge
            const stepDiff = col.max.y - playerBottom;
            if (
              (isGroundedRef.current || climbingWallTimerRef.current > 0) &&
              stepDiff > 0.01 &&
              stepDiff <= params.stepHeight &&
              hasMovementInput
            ) {
              proposedPos.y = col.max.y;
              continue;
            }

            // Ledge snap: if player's feet are within 0.22m of the top, smoothly step up
            if (stepDiff > 0 && stepDiff <= 0.22 && vel.current.y >= -0.5) {
              proposedPos.y = col.max.y;
              vel.current.y = 0;
              continue;
            }

            // Otherwise resolve as solid obstacle pushback
            let nx = 0;
            let nz = 0;
            let pushDist = 0;

            if (isInside) {
              const dLeft = proposedPos.x - col.min.x;
              const dRight = col.max.x - proposedPos.x;
              const dBack = proposedPos.z - col.min.z;
              const dFront = col.max.z - proposedPos.z;

              const minD = Math.min(dLeft, dRight, dBack, dFront);
              if (minD === dLeft) {
                nx = -1;
                pushDist = dLeft + currentRadius;
              } else if (minD === dRight) {
                nx = 1;
                pushDist = dRight + currentRadius;
              } else if (minD === dBack) {
                nz = -1;
                pushDist = dBack + currentRadius;
              } else {
                nx = 1;
                pushDist = dFront + currentRadius;
              }
            } else {
              const dist = Math.sqrt(distSq);
              if (dist > 0.0001) {
                nx = dx / dist;
                nz = dz / dist;
                pushDist = currentRadius - dist;
              }
            }

            if (pushDist > 0) {
              proposedPos.x += nx * pushDist;
              proposedPos.z += nz * pushDist;

              // Slide along obstacle (project velocity along normal)
              const dot = vel.current.x * nx + vel.current.z * nz;
              if (dot < 0) {
                vel.current.x -= dot * nx;
                vel.current.z -= dot * nz;
              }
            }
          }
        }
      }
    }

    // 10. Ground Detection & Snapping (when not on ladder)
    if (!isClimbingLadderRef.current) {
      let groundLevel = 0; // Default flat ground level at Y = 0
      const footProbeRadius = 0.15; // Tight footprint radius

      for (const col of colliders) {
        if (col.type === 'box' && col.min && col.max && !col.isLadder) {
          if (
            proposedPos.x >= col.min.x - footProbeRadius &&
            proposedPos.x <= col.max.x + footProbeRadius &&
            proposedPos.z >= col.min.z - footProbeRadius &&
            proposedPos.z <= col.max.z + footProbeRadius
          ) {
            // Only register surfaces at or below the player's reachable step height
            if (col.max.y <= pos.current.y + params.stepHeight + 0.1) {
              if (col.max.y > groundLevel) {
                groundLevel = col.max.y;
              }
            }
          }
        }
      }

      // Ground landing & step-down snap resolution
      if (vel.current.y > 0.05) {
        // Actively jumping upward: do not snap to ground
        isGroundedRef.current = false;
      } else {
        const distToGround = proposedPos.y - groundLevel;

        if (distToGround <= 0.08 && distToGround >= -0.3) {
          // Landed on or near ground
          proposedPos.y = groundLevel;
          vel.current.y = 0;
          isGroundedRef.current = true;
        } else if (isGroundedRef.current && distToGround > 0.08 && distToGround <= params.stepHeight + 0.08) {
          // Step-down snapping (e.g. walking down stairs smoothly)
          proposedPos.y = groundLevel;
          vel.current.y = 0;
          isGroundedRef.current = true;
        } else {
          // In the air (e.g., falling off roof or high drop)
          isGroundedRef.current = false;
        }
      }
    } else {
      isGroundedRef.current = false;
    }

    pos.current.copy(proposedPos);

    // 11. Update Physics Body Transform in Scene
    if (physicsBodyRef.current) {
      physicsBodyRef.current.position.copy(pos.current);
    }

    // 12. State Machine Calculation
    const horizontalSpeed = Math.sqrt(vel.current.x * vel.current.x + vel.current.z * vel.current.z);

    let nextState: PlayerState = 'IDLE';
    if (isClimbingLadderRef.current) {
      nextState = 'CLIMB_LADDER';
    } else if (climbingWallTimerRef.current > 0) {
      nextState = 'CLIMB_WALL';
    } else if (!isGroundedRef.current) {
      nextState = vel.current.y > 0.5 ? 'JUMP' : 'FALL';
    } else if (isCrouchingRef.current) {
      nextState = (hasMovementInput || horizontalSpeed > 0.08) ? 'CROUCH_WALK' : 'CROUCH';
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

    // 13. Report Telemetry to HUD
    if (onTelemetryUpdate) {
      onTelemetryUpdate({
        position: pos.current.clone(),
        velocity: vel.current.clone(),
        horizontalSpeed,
        state: nextState,
        isGrounded: isGroundedRef.current,
        isCrouching: isCrouchingRef.current,
        isClimbing: isClimbingLadderRef.current || climbingWallTimerRef.current > 0,
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
          bindQuats={bindQuatsRef.current}
          bindPositions={bindPositionsRef.current}
          characterModel={characterModel}
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
