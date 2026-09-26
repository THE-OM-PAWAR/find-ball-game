import React, { useRef, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import {
  GULLY_CHECKPOINTS,
  CheckpointManager,
  type CheckpointData,
} from '../../game/checkpoints/CheckpointManager';

interface CheckpointsSystemProps {
  onCheckpointReached?: (checkpointId: number) => void;
  onBallRetrieved?: () => void;
}

/**
 * 2-Phase Indian Gully Checkpoint Traversal System
 * - Phase 1 (1-5): Ascend rooftops & retrieve lost ball
 * - Phase 2 (6-10): Descend through East/South terraces back to the ground cricket pitch
 * - 16m tall vertical light beacons visible from far
 * - Lights turn OFF / removed once each checkpoint is reached
 * - Minimal top HUD tracker
 */
export const CheckpointsSystem: React.FC<CheckpointsSystemProps> = ({
  onCheckpointReached,
  onBallRetrieved,
}) => {
  const [state, setState] = useState({
    activeId: CheckpointManager.activeId,
    completed: CheckpointManager.completed,
    hasBall: CheckpointManager.hasBall,
    isGameWon: CheckpointManager.isGameWon,
    notification: CheckpointManager.notification,
  });

  useEffect(() => {
    const unsubscribe = CheckpointManager.subscribe((newState) => {
      setState({
        activeId: newState.activeId,
        completed: newState.completed,
        hasBall: newState.hasBall,
        isGameWon: newState.isGameWon,
        notification: newState.notification,
      });

      if (newState.hasBall && newState.completed.has(5)) {
        onBallRetrieved?.();
      }
      if (newState.completed.size > 0) {
        const lastId = Array.from(newState.completed).pop();
        if (lastId) onCheckpointReached?.(lastId);
      }
    });

    return () => unsubscribe();
  }, [onCheckpointReached, onBallRetrieved]);

  // Determine which phase checkpoints to render:
  // If player does not have ball yet -> show Phase 1 (1..5)
  // If player retrieved ball -> show Phase 2 (6..10)
  const activePhase = state.hasBall ? 2 : 1;
  const currentPhaseCheckpoints = GULLY_CHECKPOINTS.filter((cp) => cp.phase === activePhase);
  const phaseCompletedCount = currentPhaseCheckpoints.filter((cp) => state.completed.has(cp.id)).length;

  return (
    <group name="gully-checkpoints-system">
      {/* Render ONLY uncompleted checkpoints for current active phase */}
      {currentPhaseCheckpoints.map((cp) => {
        const isCompleted = state.completed.has(cp.id);
        if (isCompleted) return null; // Light is removed once reached

        const isCurrent = state.activeId === cp.id;

        return (
          <SingleCheckpointBeacon
            key={cp.id}
            data={cp}
            isCurrent={isCurrent}
          />
        );
      })}

      {/* Minimal Top Screen HUD */}
      <Html position={[0, 0, 0]} style={{ pointerEvents: 'none' }}>
        <div
          style={{
            position: 'fixed',
            top: '18px',
            left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '8px',
            zIndex: 1000,
            userSelect: 'none',
            pointerEvents: 'none',
          }}
        >
          {state.notification ? (
            <div
              style={{
                background: state.hasBall
                  ? 'rgba(234, 88, 12, 0.92)'
                  : 'rgba(16, 185, 129, 0.92)',
                backdropFilter: 'blur(8px)',
                color: '#ffffff',
                padding: '6px 18px',
                borderRadius: '20px',
                fontSize: '12px',
                fontWeight: 800,
                letterSpacing: '0.3px',
                whiteSpace: 'nowrap',
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.35)',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              <span>{state.notification}</span>
            </div>
          ) : (
            <div
              style={{
                background: 'rgba(15, 23, 42, 0.78)',
                backdropFilter: 'blur(12px)',
                color: '#f8fafc',
                padding: '6px 16px',
                borderRadius: '24px',
                fontSize: '11px',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                whiteSpace: 'nowrap',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                boxShadow: '0 4px 16px rgba(0, 0, 0, 0.3)',
              }}
            >
              <span style={{ fontSize: '13px' }}>{state.hasBall ? '🏏' : '🎯'}</span>
              <span style={{ color: '#e2e8f0' }}>
                {state.isGameWon
                  ? 'Gully Match Resumed! 🏆'
                  : state.hasBall
                  ? `Return to Pitch (${phaseCompletedCount}/5)`
                  : `Retrieve Ball (${phaseCompletedCount}/5)`}
              </span>
              <div style={{ display: 'flex', gap: '5px', alignItems: 'center' }}>
                {currentPhaseCheckpoints.map((cp) => (
                  <div
                    key={cp.id}
                    style={{
                      width: '6px',
                      height: '6px',
                      borderRadius: '50%',
                      background: state.completed.has(cp.id)
                        ? '#10b981'
                        : state.activeId === cp.id
                        ? state.hasBall
                          ? '#a855f7'
                          : '#f59e0b'
                        : 'rgba(255, 255, 255, 0.25)',
                      boxShadow: state.completed.has(cp.id)
                        ? '0 0 6px #10b981'
                        : state.activeId === cp.id
                        ? `0 0 6px ${state.hasBall ? '#a855f7' : '#f59e0b'}`
                        : 'none',
                    }}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </Html>
    </group>
  );
};

interface SingleCheckpointBeaconProps {
  data: CheckpointData;
  isCurrent: boolean;
}

const SingleCheckpointBeacon: React.FC<SingleCheckpointBeaconProps> = ({
  data,
  isCurrent,
}) => {
  const pillarRef = useRef<THREE.Mesh>(null);
  const gemRef = useRef<THREE.Group>(null);
  const ringRef = useRef<THREE.Mesh>(null);

  const displayColor = isCurrent ? data.color : '#64748b';

  useFrame((_, delta) => {
    if (gemRef.current) {
      gemRef.current.rotation.y += delta * 1.5;
      gemRef.current.position.y = (data.isBall || data.isVictory ? 1.5 : 1.1) + Math.sin(Date.now() * 0.003) * 0.1;
    }
    if (ringRef.current) {
      ringRef.current.rotation.z += delta * 0.6;
      const pulse = 1 + Math.sin(Date.now() * 0.004) * 0.12;
      ringRef.current.scale.set(pulse, pulse, pulse);
    }
    if (pillarRef.current) {
      const mat = pillarRef.current.material as THREE.MeshBasicMaterial;
      if (mat) {
        mat.opacity = isCurrent ? 0.32 + Math.sin(Date.now() * 0.005) * 0.08 : 0.15;
      }
    }
  });

  const [x, y, z] = data.position;

  return (
    <group position={[x, y, z]} name={`checkpoint-${data.id}`}>
      {/* ── 1. TALL VERTICAL LIGHT BEACON PILLAR (16m High - Visible from far) ── */}
      <mesh ref={pillarRef} position={[0, 8, 0]}>
        <cylinderGeometry
          args={[
            data.isBall || data.isVictory ? 0.42 : 0.22,
            data.isBall || data.isVictory ? 0.72 : 0.38,
            16,
            16,
            1,
            true,
          ]}
        />
        <meshBasicMaterial
          color={displayColor}
          transparent={true}
          opacity={0.28}
          side={THREE.DoubleSide}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      {/* ── 2. PULSING GROUND CIRCLE RINGS ── */}
      <group position={[0, 0.04, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <mesh ref={ringRef}>
          <ringGeometry args={[1.0, 1.25, 32]} />
          <meshBasicMaterial
            color={displayColor}
            transparent={true}
            opacity={0.65}
            side={THREE.DoubleSide}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
        <mesh>
          <circleGeometry args={[0.95, 32]} />
          <meshBasicMaterial
            color={displayColor}
            transparent={true}
            opacity={0.18}
            side={THREE.DoubleSide}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
      </group>

      {/* ── 3. ROTATING 3D FLOATING GEM ── */}
      <group ref={gemRef} position={[0, 1.1, 0]}>
        {data.isBall ? (
          // Radiant Cricket Ball Gem
          <group>
            <mesh>
              <octahedronGeometry args={[0.32, 0]} />
              <meshStandardMaterial
                color="#ef4444"
                emissive="#dc2626"
                emissiveIntensity={1.2}
                roughness={0.2}
                metalness={0.8}
              />
            </mesh>
            <mesh scale={[1.25, 1.25, 1.25]}>
              <octahedronGeometry args={[0.32, 0]} />
              <meshBasicMaterial
                color="#f59e0b"
                wireframe={true}
                transparent={true}
                opacity={0.6}
              />
            </mesh>
          </group>
        ) : data.isVictory ? (
          // Radiant Victory Emerald Pitch Trophy Gem
          <group>
            <mesh>
              <octahedronGeometry args={[0.36, 0]} />
              <meshStandardMaterial
                color="#10b981"
                emissive="#059669"
                emissiveIntensity={1.4}
                roughness={0.2}
                metalness={0.9}
              />
            </mesh>
            <mesh scale={[1.3, 1.3, 1.3]}>
              <octahedronGeometry args={[0.36, 0]} />
              <meshBasicMaterial
                color="#34d399"
                wireframe={true}
                transparent={true}
                opacity={0.7}
              />
            </mesh>
          </group>
        ) : (
          // Standard Checkpoint Diamond
          <group>
            <mesh>
              <octahedronGeometry args={[0.22, 0]} />
              <meshStandardMaterial
                color={displayColor}
                emissive={displayColor}
                emissiveIntensity={0.8}
                roughness={0.3}
              />
            </mesh>
            <mesh scale={[1.2, 1.2, 1.2]}>
              <octahedronGeometry args={[0.22, 0]} />
              <meshBasicMaterial
                color="#ffffff"
                wireframe={true}
                transparent={true}
                opacity={0.5}
              />
            </mesh>
          </group>
        )}
      </group>
    </group>
  );
};
