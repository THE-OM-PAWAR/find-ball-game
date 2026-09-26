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
 * Minimal, Production-Grade Indian Gully Checkpoint System
 * - Pure 3D glowing beacons & floating gems (zero clumsy 3D text labels)
 * - Ultra-minimal top HUD tracker
 * - Beacons turn OFF / removed once reached
 */
export const CheckpointsSystem: React.FC<CheckpointsSystemProps> = ({
  onCheckpointReached,
  onBallRetrieved,
}) => {
  const [state, setState] = useState({
    activeId: CheckpointManager.activeId,
    completed: CheckpointManager.completed,
    notification: CheckpointManager.notification,
  });

  useEffect(() => {
    const unsubscribe = CheckpointManager.subscribe((newState) => {
      setState({
        activeId: newState.activeId,
        completed: newState.completed,
        notification: newState.notification,
      });

      if (newState.completed.has(5)) {
        onBallRetrieved?.();
      } else if (newState.completed.size > 0) {
        const lastId = Array.from(newState.completed).pop();
        if (lastId) onCheckpointReached?.(lastId);
      }
    });

    return () => unsubscribe();
  }, [onCheckpointReached, onBallRetrieved]);

  return (
    <group name="gully-checkpoints-system">
      {/* Pure 3D Checkpoint Beacons (completed ones are removed) */}
      {GULLY_CHECKPOINTS.map((cp) => {
        const isCompleted = state.completed.has(cp.id);
        if (isCompleted) return null;

        const isCurrent = state.activeId === cp.id;

        return (
          <SingleCheckpointBeacon
            key={cp.id}
            data={cp}
            isCurrent={isCurrent}
          />
        );
      })}

      {/* Ultra-Minimal Top Screen HUD */}
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
                background: 'rgba(16, 185, 129, 0.92)',
                backdropFilter: 'blur(8px)',
                color: '#ffffff',
                padding: '6px 18px',
                borderRadius: '20px',
                fontSize: '12px',
                fontWeight: 800,
                letterSpacing: '0.3px',
                whiteSpace: 'nowrap',
                boxShadow: '0 4px 20px rgba(16, 185, 129, 0.35)',
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
                background: 'rgba(15, 23, 42, 0.75)',
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
              <span style={{ fontSize: '13px' }}>🎯</span>
              <span style={{ color: '#e2e8f0' }}>
                {state.completed.has(5) ? 'Ball Found!' : `Checkpoint ${state.completed.size}/5`}
              </span>
              <div style={{ display: 'flex', gap: '5px', alignItems: 'center' }}>
                {GULLY_CHECKPOINTS.map((cp) => (
                  <div
                    key={cp.id}
                    style={{
                      width: '6px',
                      height: '6px',
                      borderRadius: '50%',
                      background: state.completed.has(cp.id)
                        ? '#10b981'
                        : state.activeId === cp.id
                        ? '#f59e0b'
                        : 'rgba(255, 255, 255, 0.25)',
                      boxShadow: state.completed.has(cp.id)
                        ? '0 0 6px #10b981'
                        : state.activeId === cp.id
                        ? '0 0 6px #f59e0b'
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
      gemRef.current.position.y = (data.isFinal ? 1.5 : 1.1) + Math.sin(Date.now() * 0.003) * 0.1;
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
        <cylinderGeometry args={[data.isFinal ? 0.4 : 0.22, data.isFinal ? 0.7 : 0.38, 16, 16, 1, true]} />
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

      {/* ── 3. ROTATING 3D FLOATING GEM (No text labels) ── */}
      <group ref={gemRef} position={[0, 1.1, 0]}>
        {data.isFinal ? (
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
        ) : (
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
