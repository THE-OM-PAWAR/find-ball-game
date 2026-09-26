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
 * Production-Grade Indian Gully Traversal Checkpoint System
 * - High-visibility 16m beacons visible from far
 * - Instant detection (< 16ms frame-accurate)
 * - Beacons turn OFF / remove immediately once checkpoint is reached
 * - Smooth HUD notification with checkpoint progression
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
      {/* Render ONLY remaining uncompleted checkpoints (completed lights are removed) */}
      {GULLY_CHECKPOINTS.map((cp) => {
        const isCompleted = state.completed.has(cp.id);
        if (isCompleted) {
          // Light is OFF / removed once reached as requested
          return null;
        }

        const isCurrent = state.activeId === cp.id;

        return (
          <SingleCheckpointBeacon
            key={cp.id}
            data={cp}
            isCurrent={isCurrent}
          />
        );
      })}

      {/* Minimal Top Mission HUD */}
      <Html position={[0, 0, 0]} style={{ pointerEvents: 'none' }}>
        <div
          style={{
            position: 'fixed',
            top: '20px',
            left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '8px',
            zIndex: 1000,
            userSelect: 'none',
          }}
        >
          {state.notification ? (
            <div
              style={{
                background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.95), rgba(5, 150, 105, 0.95))',
                color: '#ffffff',
                padding: '8px 22px',
                borderRadius: '30px',
                fontSize: '13px',
                fontWeight: 800,
                letterSpacing: '0.4px',
                boxShadow: '0 8px 30px rgba(16, 185, 129, 0.4), 0 0 0 1px rgba(255,255,255,0.3)',
                animation: 'pulse 1s infinite alternate',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              <span>{state.notification}</span>
            </div>
          ) : (
            <div
              style={{
                background: 'rgba(15, 23, 42, 0.82)',
                backdropFilter: 'blur(10px)',
                color: '#f8fafc',
                padding: '6px 16px',
                borderRadius: '30px',
                fontSize: '11px',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                boxShadow: '0 6px 20px rgba(0, 0, 0, 0.35)',
              }}
            >
              <span style={{ color: '#f59e0b', fontSize: '13px' }}>🎯</span>
              <span>
                {state.completed.has(5)
                  ? 'Mission Complete! Ball Retrieved 🏆'
                  : `Retrieve Ball: Follow Next Beacon (${state.completed.size}/5)`}
              </span>
              <div style={{ display: 'flex', gap: '4px' }}>
                {GULLY_CHECKPOINTS.map((cp) => (
                  <div
                    key={cp.id}
                    style={{
                      width: '7px',
                      height: '7px',
                      borderRadius: '50%',
                      background: state.completed.has(cp.id)
                        ? '#10b981'
                        : state.activeId === cp.id
                        ? '#f59e0b'
                        : 'rgba(255, 255, 255, 0.2)',
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
      gemRef.current.position.y = (data.isFinal ? 1.6 : 1.2) + Math.sin(Date.now() * 0.003) * 0.12;
    }
    if (ringRef.current) {
      ringRef.current.rotation.z += delta * 0.8;
      const pulse = 1 + Math.sin(Date.now() * 0.004) * 0.15;
      ringRef.current.scale.set(pulse, pulse, pulse);
    }
    if (pillarRef.current) {
      const mat = pillarRef.current.material as THREE.MeshBasicMaterial;
      if (mat) {
        mat.opacity = isCurrent ? 0.35 + Math.sin(Date.now() * 0.005) * 0.1 : 0.18;
      }
    }
  });

  const [x, y, z] = data.position;

  return (
    <group position={[x, y, z]} name={`checkpoint-${data.id}`}>
      {/* ── 1. TALL VERTICAL LIGHT BEACON PILLAR (16m High - Visible from far) ── */}
      <mesh ref={pillarRef} position={[0, 8, 0]}>
        <cylinderGeometry args={[data.isFinal ? 0.45 : 0.26, data.isFinal ? 0.75 : 0.42, 16, 16, 1, true]} />
        <meshBasicMaterial
          color={displayColor}
          transparent={true}
          opacity={0.3}
          side={THREE.DoubleSide}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      {/* ── 2. PULSING GROUND CIRCLE RINGS ── */}
      <group position={[0, 0.04, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <mesh ref={ringRef}>
          <ringGeometry args={[1.2, 1.4, 32]} />
          <meshBasicMaterial
            color={displayColor}
            transparent={true}
            opacity={0.7}
            side={THREE.DoubleSide}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
        <mesh>
          <circleGeometry args={[1.1, 32]} />
          <meshBasicMaterial
            color={displayColor}
            transparent={true}
            opacity={0.22}
            side={THREE.DoubleSide}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
      </group>

      {/* ── 3. ROTATING 3D FLOATING GEM ── */}
      <group ref={gemRef} position={[0, 1.2, 0]}>
        {data.isFinal ? (
          <group>
            <mesh>
              <octahedronGeometry args={[0.35, 0]} />
              <meshStandardMaterial
                color="#ef4444"
                emissive="#dc2626"
                emissiveIntensity={1.2}
                roughness={0.2}
                metalness={0.8}
              />
            </mesh>
            <mesh scale={[1.3, 1.3, 1.3]}>
              <octahedronGeometry args={[0.35, 0]} />
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
              <octahedronGeometry args={[0.26, 0]} />
              <meshStandardMaterial
                color={displayColor}
                emissive={displayColor}
                emissiveIntensity={0.8}
                roughness={0.3}
              />
            </mesh>
            <mesh scale={[1.25, 1.25, 1.25]}>
              <octahedronGeometry args={[0.26, 0]} />
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

      {/* ── 4. FLOATING WORLD-SPACE WAYPOINT BADGE ── */}
      <Html position={[0, data.isFinal ? 2.4 : 1.9, 0]} center distanceFactor={22}>
        <div
          style={{
            background: isCurrent ? 'rgba(15, 23, 42, 0.92)' : 'rgba(30, 41, 59, 0.85)',
            color: '#ffffff',
            padding: '4px 10px',
            borderRadius: '8px',
            fontSize: '11px',
            fontWeight: 800,
            whiteSpace: 'nowrap',
            boxShadow: `0 4px 16px ${displayColor}66`,
            border: `1.5px solid ${displayColor}`,
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            pointerEvents: 'none',
            transform: isCurrent ? 'scale(1.08)' : 'scale(1)',
            transition: 'all 0.3s ease',
          }}
        >
          <span>{data.isFinal ? '🏏' : `#${data.id}`}</span>
          <span style={{ color: displayColor }}>{data.name}</span>
        </div>
      </Html>
    </group>
  );
};
