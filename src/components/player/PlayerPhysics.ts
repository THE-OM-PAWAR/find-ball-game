import * as THREE from 'three';
import type { PlayerControllerParams, PlayerInputState, PlayerState, PlayerTelemetry } from './PlayerTypes';

export interface CollisionCollider {
  type: 'box' | 'cylinder' | 'plane';
  min?: THREE.Vector3;
  max?: THREE.Vector3;
  center?: THREE.Vector3;
  radius?: number;
  height?: number;
  slopeNormal?: THREE.Vector3;
}

export class KinematicPlayerPhysics {
  public position = new THREE.Vector3(0, 0, 0);
  public velocity = new THREE.Vector3(0, 0, 0);
  public facingAngle = 0; // Yaw angle in radians

  public isGrounded = true;
  public isOnSlope = false;
  public slopeAngleDeg = 0;
  public stamina = 100;
  public state: PlayerState = 'IDLE';

  private params: PlayerControllerParams;
  private colliders: CollisionCollider[] = [];

  // Temporary vectors for allocations-free calculations in useFrame
  private tempMoveDir = new THREE.Vector3();
  private tempTargetVel = new THREE.Vector3();
  private tempGroundNormal = new THREE.Vector3(0, 1, 0);

  constructor(params: PlayerControllerParams, initialPos: [number, number, number] = [0, 0, 0]) {
    this.params = params;
    this.position.set(...initialPos);
  }

  public setColliders(colliders: CollisionCollider[]) {
    this.colliders = colliders;
  }

  public addCollider(collider: CollisionCollider) {
    this.colliders.push(collider);
  }

  public reset(pos: [number, number, number] = [0, 0, 0]) {
    this.position.set(...pos);
    this.velocity.set(0, 0, 0);
    this.facingAngle = 0;
    this.isGrounded = true;
    this.isOnSlope = false;
    this.stamina = 100;
    this.state = 'IDLE';
  }

  /**
   * Physics Update Step (called in useFrame with delta seconds)
   */
  public update(delta: number, input: PlayerInputState, cameraYaw: number): PlayerTelemetry {
    // Clamp delta to prevent physics explosion on lag spikes
    const dt = Math.min(delta, 0.05);

    // 1. Calculate input movement direction relative to camera yaw
    this.tempMoveDir.set(0, 0, 0);
    if (input.forward) this.tempMoveDir.z -= 1;
    if (input.backward) this.tempMoveDir.z += 1;
    if (input.left) this.tempMoveDir.x -= 1;
    if (input.right) this.tempMoveDir.x += 1;

    const hasInput = this.tempMoveDir.lengthSq() > 0.001;
    if (hasInput) {
      this.tempMoveDir.normalize();
      // Rotate move direction by camera horizontal angle
      this.tempMoveDir.applyAxisAngle(new THREE.Vector3(0, 1, 0), cameraYaw);
    }

    // 2. Determine target speed & stamina
    let targetSpeed = 0;
    let isSprinting = false;
    let isCrouching = false;

    if (hasInput) {
      if (input.crouch) {
        targetSpeed = this.params.crouchSpeed;
        isCrouching = true;
      } else if (input.sprint && this.stamina > 5) {
        targetSpeed = this.params.sprintSpeed;
        isSprinting = true;
        this.stamina = Math.max(0, this.stamina - 28 * dt);
      } else {
        targetSpeed = this.params.runSpeed;
      }
    } else {
      if (input.crouch) {
        isCrouching = true;
      }
    }

    // Stamina recovery when not sprinting
    if (!isSprinting) {
      this.stamina = Math.min(100, this.stamina + 20 * dt);
    }

    // 3. Horizontal Acceleration & Deceleration
    this.tempTargetVel.copy(this.tempMoveDir).multiplyScalar(targetSpeed);

    const accel = this.isGrounded
      ? (hasInput ? this.params.acceleration : this.params.deceleration)
      : this.params.acceleration * this.params.airControl;

    // Smoothly blend current horizontal velocity towards target
    this.velocity.x = THREE.MathUtils.damp(this.velocity.x, this.tempTargetVel.x, accel, dt);
    this.velocity.z = THREE.MathUtils.damp(this.velocity.z, this.tempTargetVel.z, accel, dt);

    // 4. Player Mesh Orientation / Facing Angle
    if (hasInput) {
      const targetAngle = Math.atan2(this.tempMoveDir.x, this.tempMoveDir.z);
      // Smooth angle interpolation handling 2PI wrap
      let angleDiff = (targetAngle - this.facingAngle) % (Math.PI * 2);
      if (angleDiff > Math.PI) angleDiff -= Math.PI * 2;
      if (angleDiff < -Math.PI) angleDiff += Math.PI * 2;
      this.facingAngle += angleDiff * Math.min(1, this.params.rotationSpeed * dt);
    }

    // 5. Vertical Physics: Gravity & Jumping
    if (this.isGrounded) {
      if (input.jump) {
        this.velocity.y = this.params.jumpForce;
        this.isGrounded = false;
      } else {
        // Small downward clamp to stick to ground slopes & stairs
        this.velocity.y = -2.0;
      }
    } else {
      // Apply gravity
      this.velocity.y -= this.params.gravity * dt;
      // Terminal fall velocity clamp
      if (this.velocity.y < -32) this.velocity.y = -32;
    }

    // 6. Proposed New Position
    const proposedPos = this.position.clone().addScaledVector(this.velocity, dt);

    // 7. Resolve Collisions against Environment & Colliders
    this.resolveCollisions(proposedPos, dt);

    // 8. Ground & Slope Detection
    this.checkGround(proposedPos);

    this.position.copy(proposedPos);

    // 9. Determine State Machine State
    const horizontalSpeed = Math.sqrt(this.velocity.x * this.velocity.x + this.velocity.z * this.velocity.z);

    if (!this.isGrounded) {
      if (this.velocity.y > 0.5) {
        this.state = 'JUMP';
      } else {
        this.state = 'FALL';
      }
    } else {
      if (input.action) {
        this.state = 'BATTING_SHOT';
      } else if (isCrouching) {
        this.state = horizontalSpeed > 0.25 ? 'CROUCH_WALK' : 'CROUCH';
      } else if (horizontalSpeed > 5.5) {
        this.state = 'SPRINT';
      } else if (horizontalSpeed > 2.6) {
        this.state = 'RUN';
      } else if (horizontalSpeed > 0.3) {
        this.state = 'WALK';
      } else {
        this.state = 'IDLE';
      }
    }

    return {
      position: this.position.clone(),
      velocity: this.velocity.clone(),
      horizontalSpeed,
      state: this.state,
      isGrounded: this.isGrounded,
      isOnSlope: this.isOnSlope,
      slopeAngleDeg: this.slopeAngleDeg,
      stamina: this.stamina,
      facingAngle: this.facingAngle,
    };
  }

  /**
   * Ground & Terrain Height Detection
   */
  private checkGround(pos: THREE.Vector3) {
    const rayStartY = pos.y + 0.5;
    let groundY = 0; // Default flat ground level at Y = 0
    let normal = this.tempGroundNormal.set(0, 1, 0);

    // Check custom floor/step colliders
    for (const col of this.colliders) {
      if (col.type === 'box' && col.min && col.max) {
        if (
          pos.x >= col.min.x - this.params.radius &&
          pos.x <= col.max.x + this.params.radius &&
          pos.z >= col.min.z - this.params.radius &&
          pos.z <= col.max.z + this.params.radius
        ) {
          if (rayStartY >= col.max.y && col.max.y >= groundY) {
            groundY = col.max.y;
          }
        }
      } else if (col.type === 'cylinder' && col.center && col.radius && col.height) {
        const dx = pos.x - col.center.x;
        const dz = pos.z - col.center.z;
        const distSq = dx * dx + dz * dz;
        const totalRadius = col.radius + this.params.radius;
        if (distSq < totalRadius * totalRadius) {
          const topY = col.center.y + col.height * 0.5;
          if (rayStartY >= topY && topY >= groundY) {
            groundY = topY;
          }
        }
      }
    }

    // Check if player base is at or below ground level
    if (pos.y <= groundY + 0.08) {
      pos.y = groundY;
      if (this.velocity.y < 0) {
        this.velocity.y = 0;
      }
      this.isGrounded = true;
    } else {
      this.isGrounded = false;
    }

    // Slope calculation
    this.slopeAngleDeg = THREE.MathUtils.radToDeg(normal.angleTo(new THREE.Vector3(0, 1, 0)));
    this.isOnSlope = this.slopeAngleDeg > 5;
  }

  /**
   * Horizontal Capsule vs Box/Cylinder Collider Resolution with Step Climbing
   */
  private resolveCollisions(pos: THREE.Vector3, _dt: number) {
    const radius = this.params.radius;
    const playerBottom = pos.y;
    const playerTop = pos.y + this.params.height;

    for (const col of this.colliders) {
      if (col.type === 'box' && col.min && col.max) {
        // Vertical overlap check
        if (playerBottom < col.max.y && playerTop > col.min.y) {
          // Check if it's a climbable step
          const stepHeight = col.max.y - playerBottom;
          if (stepHeight > 0 && stepHeight <= this.params.stepHeight && this.velocity.y <= 0) {
            // Step-up smooth assist
            pos.y = col.max.y;
            continue;
          }

          // Horizontal push-out
          const closestX = THREE.MathUtils.clamp(pos.x, col.min.x, col.max.x);
          const closestZ = THREE.MathUtils.clamp(pos.z, col.min.z, col.max.z);

          const dx = pos.x - closestX;
          const dz = pos.z - closestZ;
          const distSq = dx * dx + dz * dz;

          if (distSq < radius * radius && distSq > 0.00001) {
            const dist = Math.sqrt(distSq);
            const overlap = radius - dist;
            const nx = dx / dist;
            const nz = dz / dist;

            pos.x += nx * overlap;
            pos.z += nz * overlap;

            // Damp velocity along collision normal
            const dot = this.velocity.x * nx + this.velocity.z * nz;
            if (dot < 0) {
              this.velocity.x -= dot * nx;
              this.velocity.z -= dot * nz;
            }
          }
        }
      } else if (col.type === 'cylinder' && col.center && col.radius && col.height) {
        const colBottom = col.center.y - col.height * 0.5;
        const colTop = col.center.y + col.height * 0.5;

        if (playerBottom < colTop && playerTop > colBottom) {
          const dx = pos.x - col.center.x;
          const dz = pos.z - col.center.z;
          const distSq = dx * dx + dz * dz;
          const combinedRadius = radius + col.radius;

          if (distSq < combinedRadius * combinedRadius && distSq > 0.00001) {
            const dist = Math.sqrt(distSq);
            const overlap = combinedRadius - dist;
            const nx = dx / dist;
            const nz = dz / dist;

            pos.x += nx * overlap;
            pos.z += nz * overlap;

            const dot = this.velocity.x * nx + this.velocity.z * nz;
            if (dot < 0) {
              this.velocity.x -= dot * nx;
              this.velocity.z -= dot * nz;
            }
          }
        }
      }
    }

    // World boundary limits for test arena
    const arenaBound = 24.0;
    if (pos.x < -arenaBound) { pos.x = -arenaBound; this.velocity.x = 0; }
    if (pos.x > arenaBound) { pos.x = arenaBound; this.velocity.x = 0; }
    if (pos.z < -arenaBound) { pos.z = -arenaBound; this.velocity.z = 0; }
    if (pos.z > arenaBound) { pos.z = arenaBound; this.velocity.z = 0; }
  }
}
