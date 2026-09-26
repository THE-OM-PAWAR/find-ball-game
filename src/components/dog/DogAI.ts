import * as THREE from 'three';
import type { DogConfig, DogAIState, DogTelemetry, DistractionItem, NoiseEvent } from './DogTypes';
import type { PlayerTelemetry } from '../player/PlayerTypes';
import { evaluateDogPerception, type PerceptionResult } from './DogPerception';
import { findNearestDistraction, consumeDistraction } from './DogInteraction';

export interface DogAIUpdateResult {
  state: DogAIState;
  targetPosition: THREE.Vector3;
  targetType: DogTelemetry['targetType'];
  desiredSpeed: number;
  detection: number;
  isSeeingPlayer: boolean;
  isHearingPlayer: boolean;
  activeDistractionId: string | null;
  shouldBark: boolean;
}

export class DogAIBrain {
  public state: DogAIState;
  public detection: number = 0;
  public currentWaypointIndex: number = 0;
  public homePosition: THREE.Vector3;
  public lastKnownPlayerPos: THREE.Vector3 | null = null;
  public investigateTargetPos: THREE.Vector3 | null = null;
  public activeDistraction: DistractionItem | null = null;

  // Timers
  public stateTimer: number = 0;
  public suppressionTimer: number = 0; // Temporary safety window when eating
  public lastBarkTime: number = 0;

  constructor(initialPosition: THREE.Vector3, startState: DogAIState = 'PATROLLING') {
    this.homePosition = initialPosition.clone();
    this.state = startState;
  }

  public reset(position?: THREE.Vector3, startState: DogAIState = 'PATROLLING') {
    if (position) {
      this.homePosition.copy(position);
    }
    this.state = startState;
    this.detection = 0;
    this.currentWaypointIndex = 0;
    this.lastKnownPlayerPos = null;
    this.investigateTargetPos = null;
    this.activeDistraction = null;
    this.stateTimer = 0;
    this.suppressionTimer = 0;
  }

  public update(
    dogPos: THREE.Vector3,
    dogForward: THREE.Vector3,
    config: DogConfig,
    playerTelemetry: PlayerTelemetry | null,
    colliders: any[],
    delta: number
  ): DogAIUpdateResult {
    this.stateTimer += delta;
    if (this.suppressionTimer > 0) {
      this.suppressionTimer = Math.max(0, this.suppressionTimer - delta);
    }

    const isSuppressed = this.suppressionTimer > 0;

    // 1. Evaluate Perception
    const perception: PerceptionResult = evaluateDogPerception(
      dogPos,
      dogForward,
      this.state,
      this.detection,
      config,
      playerTelemetry,
      colliders,
      delta,
      isSuppressed
    );
    this.detection = perception.newDetection;

    if (perception.isSeeingPlayer && playerTelemetry) {
      if (!this.lastKnownPlayerPos) this.lastKnownPlayerPos = new THREE.Vector3();
      this.lastKnownPlayerPos.copy(playerTelemetry.position);
    }

    // 2. Check for Distractions (Biscuits / Food)
    const nearestFood = findNearestDistraction(dogPos, 14.0);
    const hasDistraction = nearestFood !== null && !nearestFood.consumed;

    let targetPos = dogPos.clone();
    let targetType: DogTelemetry['targetType'] = 'none';
    let desiredSpeed = 0;
    let shouldBark = false;

    // ================= STATE MACHINE TRANSITIONS =================
    switch (this.state) {
      // -------------------------------------------------------------
      // 1. SLEEPING
      // -------------------------------------------------------------
      case 'SLEEPING': {
        desiredSpeed = 0;
        targetType = 'home';
        targetPos.copy(this.homePosition);

        // Wake up if loud noise occurs nearby or detection exceeds threshold
        if (perception.loudestNoise && perception.loudestNoise.intensity > 0.4) {
          this.state = 'SUSPICIOUS';
          this.stateTimer = 0;
          this.investigateTargetPos = perception.loudestNoise.position.clone();
        } else if (this.detection >= config.suspiciousThreshold) {
          this.state = 'SUSPICIOUS';
          this.stateTimer = 0;
        }
        break;
      }

      // -------------------------------------------------------------
      // 2. IDLE
      // -------------------------------------------------------------
      case 'IDLE': {
        desiredSpeed = 0;
        targetType = 'patrol';

        // Check Distraction Priority
        if (hasDistraction && config.distractionPriority) {
          this.activeDistraction = nearestFood;
          this.state = 'DISTRACTED';
          this.stateTimer = 0;
          break;
        }

        // Check Sight / Hearing Alert
        if (this.detection >= config.alertThreshold) {
          this.state = 'ALERT';
          this.stateTimer = 0;
        } else if (this.detection >= config.investigateThreshold) {
          this.state = 'INVESTIGATING';
          this.stateTimer = 0;
          if (this.lastKnownPlayerPos) {
            this.investigateTargetPos = this.lastKnownPlayerPos.clone();
          } else if (perception.loudestNoise) {
            this.investigateTargetPos = perception.loudestNoise.position.clone();
          }
        } else if (this.detection >= config.suspiciousThreshold || perception.loudestNoise) {
          this.state = 'SUSPICIOUS';
          this.stateTimer = 0;
          if (perception.loudestNoise) {
            this.investigateTargetPos = perception.loudestNoise.position.clone();
          }
        } else if (this.stateTimer >= config.idleDuration) {
          // Finished waiting, resume patrol
          this.state = 'PATROLLING';
          this.stateTimer = 0;
          if (config.patrolPoints.length > 0) {
            this.currentWaypointIndex = (this.currentWaypointIndex + 1) % config.patrolPoints.length;
          }
        }
        break;
      }

      // -------------------------------------------------------------
      // 3. PATROLLING
      // -------------------------------------------------------------
      case 'PATROLLING': {
        // Distraction override
        if (hasDistraction && config.distractionPriority) {
          this.activeDistraction = nearestFood;
          this.state = 'DISTRACTED';
          this.stateTimer = 0;
          break;
        }

        // Perception triggers
        if (this.detection >= config.alertThreshold) {
          this.state = 'ALERT';
          this.stateTimer = 0;
          break;
        } else if (this.detection >= config.investigateThreshold) {
          this.state = 'INVESTIGATING';
          this.stateTimer = 0;
          this.investigateTargetPos = this.lastKnownPlayerPos
            ? this.lastKnownPlayerPos.clone()
            : perception.loudestNoise?.position.clone() || null;
          break;
        } else if (this.detection >= config.suspiciousThreshold || (perception.loudestNoise && perception.loudestNoise.intensity > 0.3)) {
          this.state = 'SUSPICIOUS';
          this.stateTimer = 0;
          if (perception.loudestNoise) {
            this.investigateTargetPos = perception.loudestNoise.position.clone();
          }
          break;
        }

        // Move to current patrol waypoint
        if (config.patrolPoints.length > 0) {
          const wp = config.patrolPoints[this.currentWaypointIndex];
          targetPos.set(...wp.position);
          targetType = 'patrol';
          desiredSpeed = config.walkSpeed;

          const distToWp = dogPos.distanceTo(targetPos);
          if (distToWp < 0.6) {
            // Reached waypoint!
            this.state = 'IDLE';
            this.stateTimer = 0;
          }
        } else {
          targetPos.copy(this.homePosition);
          targetType = 'home';
          desiredSpeed = 0;
        }
        break;
      }

      // -------------------------------------------------------------
      // 4. SUSPICIOUS
      // -------------------------------------------------------------
      case 'SUSPICIOUS': {
        desiredSpeed = 0;
        targetType = 'noise';

        // Face suspicious source
        if (this.investigateTargetPos) {
          targetPos.copy(this.investigateTargetPos);
        } else if (this.lastKnownPlayerPos) {
          targetPos.copy(this.lastKnownPlayerPos);
        }

        // Distraction override
        if (hasDistraction && config.distractionPriority) {
          this.activeDistraction = nearestFood;
          this.state = 'DISTRACTED';
          this.stateTimer = 0;
          break;
        }

        if (this.detection >= config.alertThreshold) {
          this.state = 'ALERT';
          this.stateTimer = 0;
        } else if (this.detection >= config.investigateThreshold) {
          this.state = 'INVESTIGATING';
          this.stateTimer = 0;
        } else if (this.detection < 10 && this.stateTimer >= 3.0) {
          // Calm down and return
          this.state = 'RETURNING';
          this.stateTimer = 0;
        }
        break;
      }

      // -------------------------------------------------------------
      // 5. ALERT
      // -------------------------------------------------------------
      case 'ALERT': {
        shouldBark = true;
        targetType = 'player';

        if (playerTelemetry) {
          targetPos.copy(playerTelemetry.position);
        } else if (this.lastKnownPlayerPos) {
          targetPos.copy(this.lastKnownPlayerPos);
        }

        // Move menacingly towards player but stop at safe obstacle distance
        const dist = playerTelemetry ? dogPos.distanceTo(playerTelemetry.position) : 999;
        if (dist > 2.0) {
          desiredSpeed = config.prowlSpeed;
        } else {
          desiredSpeed = 0;
        }

        // If player manages to hide behind a wall and detection drops:
        if (!perception.isSeeingPlayer && this.detection < config.investigateThreshold) {
          this.state = 'INVESTIGATING';
          this.stateTimer = 0;
          if (this.lastKnownPlayerPos) {
            this.investigateTargetPos = this.lastKnownPlayerPos.clone();
          }
        }
        break;
      }

      // -------------------------------------------------------------
      // 6. INVESTIGATING
      // -------------------------------------------------------------
      case 'INVESTIGATING': {
        // Distraction override
        if (hasDistraction && config.distractionPriority) {
          this.activeDistraction = nearestFood;
          this.state = 'DISTRACTED';
          this.stateTimer = 0;
          break;
        }

        if (this.detection >= config.alertThreshold) {
          this.state = 'ALERT';
          this.stateTimer = 0;
          break;
        }

        if (this.investigateTargetPos) {
          targetPos.copy(this.investigateTargetPos);
          targetType = 'noise';
          desiredSpeed = config.prowlSpeed;

          const distToTarget = dogPos.distanceTo(targetPos);
          if (distToTarget < 0.8) {
            // Sniffing around the noise spot
            desiredSpeed = 0;
            if (this.stateTimer >= config.investigateDuration) {
              // Nothing found, return to patrol!
              this.state = 'RETURNING';
              this.stateTimer = 0;
              this.investigateTargetPos = null;
            }
          }
        } else {
          this.state = 'RETURNING';
          this.stateTimer = 0;
        }
        break;
      }

      // -------------------------------------------------------------
      // 7. DISTRACTED (Eating / Sniffing Biscuit or Food)
      // -------------------------------------------------------------
      case 'DISTRACTED': {
        if (!this.activeDistraction || this.activeDistraction.consumed) {
          // Item gone or consumed, resume patrol
          this.state = 'RETURNING';
          this.stateTimer = 0;
          this.activeDistraction = null;
          break;
        }

        targetPos.copy(this.activeDistraction.position);
        targetType = 'distraction';

        const distToFood = dogPos.distanceTo(this.activeDistraction.position);
        if (distToFood > 0.45) {
          // Trotting eagerly to the biscuit
          desiredSpeed = config.runSpeed;
        } else {
          // Reached the biscuit! Lower head and eat/sniff
          desiredSpeed = 0;

          // Temporary stealth safety window for player
          this.suppressionTimer = config.distractedDuration;

          if (this.stateTimer >= config.distractedDuration) {
            consumeDistraction(this.activeDistraction.id);
            this.activeDistraction = null;
            this.state = 'RETURNING';
            this.stateTimer = 0;
          }
        }
        break;
      }

      // -------------------------------------------------------------
      // 8. RETURNING
      // -------------------------------------------------------------
      case 'RETURNING': {
        if (hasDistraction && config.distractionPriority) {
          this.activeDistraction = nearestFood;
          this.state = 'DISTRACTED';
          this.stateTimer = 0;
          break;
        }

        if (this.detection >= config.alertThreshold) {
          this.state = 'ALERT';
          this.stateTimer = 0;
          break;
        }

        // Return to nearest waypoint or home position
        if (config.patrolPoints.length > 0) {
          targetPos.set(...config.patrolPoints[this.currentWaypointIndex].position);
          targetType = 'patrol';
        } else {
          targetPos.copy(this.homePosition);
          targetType = 'home';
        }

        desiredSpeed = config.walkSpeed;

        const dist = dogPos.distanceTo(targetPos);
        if (dist < 0.8) {
          this.state = 'IDLE';
          this.stateTimer = 0;
        }
        break;
      }
    }

    return {
      state: this.state,
      targetPosition: targetPos,
      targetType,
      desiredSpeed,
      detection: this.detection,
      isSeeingPlayer: perception.isSeeingPlayer,
      isHearingPlayer: perception.isHearingPlayer,
      activeDistractionId: this.activeDistraction?.id || null,
      shouldBark,
    };
  }
}
