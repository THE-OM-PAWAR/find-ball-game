import React, { useRef, useEffect, useState, useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { PlayerInputManager } from './PlayerInput';
import { KinematicPlayerPhysics, type CollisionCollider } from './PlayerPhysics';
import { PlayerCamera } from './PlayerCamera';
import { PlayerModel } from './PlayerModel';
import {
  DEFAULT_PLAYER_PARAMS,
  DEFAULT_APPEARANCE,
  type PlayerControllerParams,
  type ThirdPersonCameraParams,
  type PlayerAppearanceConfig,
  type PlayerTelemetry,
  type PlayerState,
} from './PlayerTypes';

export interface PlayerProps {
  initialPosition?: [number, number, number];
  appearance?: Partial<PlayerAppearanceConfig>;
  playerParams?: Partial<PlayerControllerParams>;
  cameraParams?: Partial<ThirdPersonCameraParams>;
  colliders?: CollisionCollider[];
  onTelemetryUpdate?: (telemetry: PlayerTelemetry) => void;
  enabled?: boolean;
}

export const Player: React.FC<PlayerProps> = ({
  initialPosition = [0, 0, 0],
  appearance = DEFAULT_APPEARANCE,
  playerParams = {},
  cameraParams = {},
  colliders = [],
  onTelemetryUpdate,
  enabled = true,
}) => {
  const { gl } = useThree();

  const mergedParams = useMemo(() => ({
    ...DEFAULT_PLAYER_PARAMS,
    ...playerParams,
  }), [playerParams]);

  // Input & Physics Instances (preserved across renders)
  const inputManager = useMemo(() => new PlayerInputManager(), []);
  const physics = useMemo(() => new KinematicPlayerPhysics(mergedParams, initialPosition), [mergedParams]);

  const playerGroupRef = useRef<THREE.Group>(null);
  const cameraYawRef = useRef<number>(0);

  // High-frequency telemetry ref
  const telemetryRef = useRef<PlayerTelemetry>({
    position: new THREE.Vector3(...initialPosition),
    velocity: new THREE.Vector3(0, 0, 0),
    horizontalSpeed: 0,
    state: 'IDLE' as PlayerState,
    isGrounded: true,
    isOnSlope: false,
    slopeAngleDeg: 0,
    stamina: 100,
    facingAngle: 0,
  });

  // State for rendering model (only updated when needed, or driven via useFrame ref)
  const [modelState, setModelState] = useState<PlayerState>('IDLE');
  const [facingAngle, setFacingAngle] = useState<number>(0);
  const [horizontalSpeed, setHorizontalSpeed] = useState<number>(0);
  const [isGrounded, setIsGrounded] = useState<boolean>(true);
  const [mouseDelta, setMouseDelta] = useState<{ deltaX: number; deltaY: number }>({ deltaX: 0, deltaY: 0 });

  // Attach input listeners to canvas dom element
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

  useEffect(() => {
    physics.setColliders(colliders);
  }, [colliders, physics]);

  // Physics & Animation Loop (executed every frame without React re-renders)
  useFrame((_, delta) => {
    if (!enabled) return;

    // 1. Consume Mouse Delta for Camera
    const deltaMouse = inputManager.consumeMouseDelta();
    setMouseDelta(deltaMouse);

    // 2. Query Input State
    const inputState = inputManager.getState();

    // 3. Step Physics
    const telemetry = physics.update(delta, inputState, cameraYawRef.current);
    telemetryRef.current = telemetry;

    // 4. Update Visual Position
    if (playerGroupRef.current) {
      playerGroupRef.current.position.copy(telemetry.position);
    }

    // 5. Update local state for visual model transitions
    if (modelState !== telemetry.state) {
      setModelState(telemetry.state);
    }
    setFacingAngle(telemetry.facingAngle);
    setHorizontalSpeed(telemetry.horizontalSpeed);
    setIsGrounded(telemetry.isGrounded);

    // 6. Report to HUD if callback registered
    if (onTelemetryUpdate) {
      onTelemetryUpdate(telemetry);
    }
  });

  return (
    <>
      {/* 3D Visual Character Model with Skeletal Rig */}
      <group ref={playerGroupRef} position={initialPosition}>
        <PlayerModel
          appearance={appearance}
          state={modelState}
          horizontalSpeed={horizontalSpeed}
          facingAngle={facingAngle}
          isGrounded={isGrounded}
        />
      </group>

      {/* Collision-Aware Orbit Camera Controller */}
      <PlayerCamera
        targetPosition={telemetryRef.current.position}
        targetYaw={cameraYawRef.current}
        mouseDelta={mouseDelta}
        isSprinting={modelState === 'SPRINT'}
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
