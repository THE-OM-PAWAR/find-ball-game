import React, { useRef, useMemo, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { DogAIBrain } from './DogAI';
import { DogAnimation } from './DogAnimation';
import { updateDogMovement } from './DogController';
import { DogDebugVisualizer } from './DogDebugVisualizer';
import { updateDistractionPhysics, getActiveDistractions } from './DogInteraction';
import type { DogConfig, DogTelemetry, DogAIState, DistractionItem } from './DogTypes';
import { DEFAULT_DOG_CONFIG } from './DogTypes';
import type { EnvironmentCollider, PlayerTelemetry } from '../player/PlayerTypes';

export interface DogProps {
  initialPosition?: [number, number, number];
  config?: Partial<DogConfig>;
  playerTelemetry?: PlayerTelemetry | null;
  colliders?: EnvironmentCollider[];
  showDebug?: boolean;
  onTelemetryUpdate?: (telemetry: DogTelemetry) => void;
  onAlertStateChange?: (isAlert: boolean) => void;
  enabled?: boolean;
}

export const Dog: React.FC<DogProps> = ({
  initialPosition = [0, 0, 0],
  config: userConfig,
  playerTelemetry = null,
  colliders = [],
  showDebug = false,
  onTelemetryUpdate,
  onAlertStateChange,
  enabled = true,
}) => {
  const mergedConfig: DogConfig = useMemo(
    () => ({ ...DEFAULT_DOG_CONFIG, ...userConfig }),
    [userConfig]
  );

  // Position & Orientation State Refs
  const initPos = useMemo(() => new THREE.Vector3(...initialPosition), [initialPosition]);
  const posRef = useRef<THREE.Vector3>(initPos.clone());
  const rotYRef = useRef<number>(0);
  const speedRef = useRef<number>(0);
  const forwardRef = useRef<THREE.Vector3>(new THREE.Vector3(0, 0, 1));

  // AI Brain
  const brain = useMemo(() => new DogAIBrain(initPos, mergedConfig.startState), [initPos, mergedConfig.startState]);

  // React State for rendering updates only when needed
  const [currentAIState, setCurrentAIState] = useState<DogAIState>(mergedConfig.startState);
  const [currentDetection, setCurrentDetection] = useState<number>(0);
  const [renderTelemetry, setRenderTelemetry] = useState<DogTelemetry>({
    position: initPos.clone(),
    rotationY: 0,
    velocity: new THREE.Vector3(),
    state: mergedConfig.startState,
    detection: 0,
    targetType: 'none',
    targetPosition: initPos.clone(),
    distanceToPlayer: 999,
    isSeeingPlayer: false,
    isHearingPlayer: false,
    activeDistractionId: null,
  });

  const lastStateRef = useRef<DogAIState>(mergedConfig.startState);
  const lastAlertRef = useRef<boolean>(false);
  const groupRef = useRef<THREE.Group>(null);

  // Sync initial position if prop changes
  useEffect(() => {
    posRef.current.copy(initPos);
    brain.reset(initPos, mergedConfig.startState);
  }, [initPos, brain, mergedConfig.startState]);

  useFrame((_, delta) => {
    if (!enabled) return;

    // 1. Update Distraction Physics (thrown biscuits)
    updateDistractionPhysics(delta);

    // 2. Compute Dog Forward Vector from rotY
    forwardRef.current.set(Math.sin(rotYRef.current), 0, Math.cos(rotYRef.current)).normalize();

    // 3. Update AI Brain
    const aiResult = brain.update(
      posRef.current,
      forwardRef.current,
      mergedConfig,
      playerTelemetry,
      colliders,
      delta
    );

    // 4. Update Physical Movement Controller
    const moveResult = updateDogMovement(
      posRef.current,
      rotYRef.current,
      speedRef.current,
      aiResult.targetPosition,
      aiResult.desiredSpeed,
      mergedConfig.rotationSpeed,
      colliders,
      delta
    );

    posRef.current.copy(moveResult.position);
    rotYRef.current = moveResult.rotationY;
    speedRef.current = moveResult.currentSpeed;

    // Apply transform to 3D Group
    if (groupRef.current) {
      groupRef.current.position.copy(posRef.current);
      groupRef.current.rotation.y = rotYRef.current;
    }

    // 5. Notify Parent of Telemetry (Throttled for efficiency)
    const distToPlayer = playerTelemetry ? posRef.current.distanceTo(playerTelemetry.position) : 999;
    const telemetryData: DogTelemetry = {
      position: posRef.current.clone(),
      rotationY: rotYRef.current,
      velocity: forwardRef.current.clone().multiplyScalar(speedRef.current),
      state: aiResult.state,
      detection: aiResult.detection,
      targetType: aiResult.targetType,
      targetPosition: aiResult.targetPosition.clone(),
      distanceToPlayer: distToPlayer,
      isSeeingPlayer: aiResult.isSeeingPlayer,
      isHearingPlayer: aiResult.isHearingPlayer,
      activeDistractionId: aiResult.activeDistractionId,
    };

    if (onTelemetryUpdate) {
      onTelemetryUpdate(telemetryData);
    }

    // 6. Handle State Transitions in React (only on change)
    if (aiResult.state !== lastStateRef.current) {
      lastStateRef.current = aiResult.state;
      setCurrentAIState(aiResult.state);

      const isAlert = aiResult.state === 'ALERT';
      if (isAlert !== lastAlertRef.current) {
        lastAlertRef.current = isAlert;
        if (onAlertStateChange) {
          onAlertStateChange(isAlert);
        }
      }
    }

    if (showDebug) {
      setRenderTelemetry(telemetryData);
    }
  });

  // Render 3D Thrown Biscuits in World
  const activeDistractions = getActiveDistractions();

  return (
    <group>
      {/* Dog Entity Group */}
      <group ref={groupRef} position={initialPosition}>
        <DogAnimation
          state={currentAIState}
          speed={speedRef.current}
          scale={0.92}
          shouldBark={currentAIState === 'ALERT'}
        />
      </group>

      {/* Render 3D Biscuits / Distraction items */}
      {activeDistractions.map((item) => (
        <group key={item.id} position={item.position.toArray()}>
          {/* Parle-G Rectangular Biscuit / Bone */}
          <mesh castShadow receiveShadow>
            <boxGeometry args={[0.12, 0.03, 0.08]} />
            <meshStandardMaterial color="#d97706" roughness={0.7} />
          </mesh>
          {/* Subtle Glow Ring on ground */}
          <mesh position={[0, 0.005, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <circleGeometry args={[0.16, 16]} />
            <meshBasicMaterial color="#f59e0b" transparent opacity={0.4} />
          </mesh>
        </group>
      ))}

      {/* Debug Overlays */}
      {showDebug && <DogDebugVisualizer telemetry={renderTelemetry} config={mergedConfig} />}
    </group>
  );
};
