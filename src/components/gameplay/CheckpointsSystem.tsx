import React, { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';

export interface CheckpointData {
  id: number;
  name: string;
  subtext: string;
  position: [number, number, number];
  color: string;
  activeColor: string;
  isFinal?: boolean;
}

export const GULLY_CHECKPOINTS: CheckpointData[] = [
  {
    id: 1,
    name: '1. Stairs Entrance',
    subtext: 'Sharma Niwas Ground Approach',
    position: [-8.5, 0.05, -16.2],
    color: '#06b6d4', // Cyan neon
    activeColor: '#10b981',
  },
  {
    id: 2,
    name: '2. Sharma Terrace',
    subtext: 'Climb Desert Cooler to Roof (+3.2m)',
    position: [-8.5, 3.24, -22.0],
    color: '#38bdf8', // Sky blue
    activeColor: '#10b981',
  },
  {
    id: 3,
    name: '3. Gupta Terraces',
    subtext: 'Cross Scaffold Plank Bridge (+6.2m)',
    position: [1.8, 6.24, -22.4],
    color: '#f59e0b', // Amber gold
    activeColor: '#10b981',
  },
  {
    id: 4,
    name: '4. Tower Bridge',
    subtext: 'Ascend Ladder to Mahavir Heights (+6.2m)',
    position: [18.0, 6.26, -18.5],
    color: '#f97316', // Vibrant Orange
    activeColor: '#10b981',
  },
  {
    id: 5,
    name: '5. LOST BALL OBJECTIVE',
    subtext: 'Balaji Plaza Rooftop (+6.65m)',
    position: [22.4, 6.65, -0.4],
    color: '#ef4444', // Radiant Crimson-Gold
    activeColor: '#eab308',
    isFinal: true,
  },
];

interface CheckpointsSystemProps {
  onCheckpointReached?: (checkpointId: number) => void;
  onBallRetrieved?: () => void;
}

/**
 * 5 High-Visibility Beacons along the Rooftop Traversal Path to the Lost Ball.
 * Features:
 * - 16m vertical light pillars visible across the entire 50m map
 * - Rotating 3D floating markers & distance badges
 * - Pulsing ground rings with proximity detection
 * - Audio-visual celebration on reach
 */
export const CheckpointsSystem: React.FC<CheckpointsSystemProps> = ({
  onCheckpointReached,
  onBallRetrieved,
}) => {
  const [activeCheckpoint, setActiveCheckpoint] = useState<number>(1);
  const [completedCheckpoints, setCompletedCheckpoints] = useState<Set<number>>(new Set());
  const [notification, setNotification] = useState<string | null>(null);

  // Sound chime synthesization using Web Audio API
  const playCheckpointSound = (isLast: boolean) => {
    try {
      const ctx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      const now = ctx.currentTime;
      if (isLast) {
        // Victory Fanfare Chime
        osc.frequency.setValueAtTime(523.25, now); // C5
        osc.frequency.setValueAtTime(659.25, now + 0.12); // E5
        osc.frequency.setValueAtTime(783.99, now + 0.24); // G5
        osc.frequency.setValueAtTime(1046.50, now + 0.36); // C6
        gain.gain.setValueAtTime(0.3, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 1.2);
        osc.start(now);
        osc.stop(now + 1.2);
      } else {
        // Crisp Checkpoint Ding
        osc.frequency.setValueAtTime(587.33, now); // D5
        osc.frequency.setValueAtTime(880.00, now + 0.08); // A5
        gain.gain.setValueAtTime(0.25, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.6);
        osc.start(now);
        osc.stop(now + 0.6);
      }
    } catch {
      // Audio context suppressed if no user gesture yet
    }
  };

  // Check player distance to active checkpoint
  useFrame((state) => {
    const cameraPos = state.camera.position;
    
    // Check all uncompleted checkpoints within proximity
    GULLY_CHECKPOINTS.forEach((cp) => {
      if (completedCheckpoints.has(cp.id)) return;

      const [cx, cy, cz] = cp.position;
      const dx = cameraPos.x - cx;
      const dy = cameraPos.y - cy;
      const dz = cameraPos.z - cz;
      const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);

      // Trigger radius: 2.6 meters
      if (dist < 2.6) {
        setCompletedCheckpoints((prev) => {
          const next = new Set(prev);
          next.add(cp.id);
          return next;
        });

        if (cp.isFinal) {
          setNotification('🎉 MISSION COMPLETE: LOST BALL RETRIEVED!');
          playCheckpointSound(true);
          onBallRetrieved?.();
        } else {
          setNotification(`✓ CHECKPOINT ${cp.id}/5 REACHED: ${cp.name}`);
          playCheckpointSound(false);
          setActiveCheckpoint((curr) => Math.max(curr, cp.id + 1));
          onCheckpointReached?.(cp.id);
        }

        setTimeout(() => {
          setNotification(null);
        }, 4000);
      }
    });
  });

  return (
    <group name="gully-checkpoints-system">
      {/* 5 Visible 3D Checkpoint Beacons */}
      {GULLY_CHECKPOINTS.map((cp) => {
        const isCompleted = completedCheckpoints.has(cp.id);
        const isCurrent = activeCheckpoint === cp.id;

        return (
          <SingleCheckpointBeacon
            key={cp.id}
            data={cp}
            isCompleted={isCompleted}
            isCurrent={isCurrent}
          />
        );
      })}

      {/* Floating Mission Objective HUD Badge */}
      <Html position={[0, 0, 0]} style={{ pointerEvents: 'none' }}>
        <div
          style={{
            position: 'fixed',
            top: '24px',
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
          {/* Active Goal / Notification Banner */}
          {notification ? (
            <div
              style={{
                background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.95), rgba(5, 150, 105, 0.95))',
                color: '#ffffff',
                padding: '10px 24px',
                borderRadius: '30px',
                fontSize: '13px',
                fontWeight: 800,
                letterSpacing: '0.5px',
                boxShadow: '0 8px 30px rgba(16, 185, 129, 0.4), 0 0 0 1px rgba(255,255,255,0.3)',
                animation: 'pulse 1s infinite alternate',
              }}
            >
              {notification}
            </div>
          ) : (
            <div
              style={{
                background: 'rgba(15, 23, 42, 0.82)',
                backdropFilter: 'blur(10px)',
                color: '#f8fafc',
                padding: '8px 20px',
                borderRadius: '30px',
                fontSize: '12px',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                boxShadow: '0 8px 25px rgba(0, 0, 0, 0.4)',
              }}
            >
              <span style={{ color: '#f59e0b', fontSize: '14px' }}>🎯</span>
              <span>
                {completedCheckpoints.has(5)
                  ? 'Mission Accomplished! Ball Retrieved 🏆'
                  : `Objective: Follow Beacons to Lost Ball (${completedCheckpoints.size}/5)`}
              </span>
              <div style={{ display: 'flex', gap: '4px' }}>
                {GULLY_CHECKPOINTS.map((cp) => (
                  <div
                    key={cp.id}
                    style={{
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      background: completedCheckpoints.has(cp.id)
                        ? '#10b981'
                        : activeCheckpoint === cp.id
                        ? '#f59e0b'
                        : 'rgba(255, 255, 255, 0.2)',
                      boxShadow: completedCheckpoints.has(cp.id)
                        ? '0 0 8px #10b981'
                        : activeCheckpoint === cp.id
                        ? '0 0 8px #f59e0b'
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
  isCompleted: boolean;
  isCurrent: boolean;
}

const SingleCheckpointBeacon: React.FC<SingleCheckpointBeaconProps> = ({
  data,
  isCompleted,
  isCurrent,
}) => {
  const pillarRef = useRef<THREE.Mesh>(null);
  const gemRef = useRef<THREE.Group>(null);
  const ringRef = useRef<THREE.Mesh>(null);

  const displayColor = isCompleted ? '#10b981' : isCurrent ? data.color : '#64748b';

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
        mat.opacity = isCurrent ? 0.35 + Math.sin(Date.now() * 0.005) * 0.1 : isCompleted ? 0.18 : 0.22;
      }
    }
  });

  const [x, y, z] = data.position;

  return (
    <group position={[x, y, z]} name={`checkpoint-${data.id}`}>
      {/* ── 1. TALL VERTICAL LIGHT BEACON PILLAR (16m High - Visible across entire map) ── */}
      <mesh ref={pillarRef} position={[0, 8, 0]}>
        <cylinderGeometry args={[data.isFinal ? 0.45 : 0.28, data.isFinal ? 0.75 : 0.45, 16, 16, 1, true]} />
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
        {/* Outer Ring */}
        <mesh ref={ringRef}>
          <ringGeometry args={[1.2, 1.4, 32]} />
          <meshBasicMaterial
            color={displayColor}
            transparent={true}
            opacity={isCompleted ? 0.3 : 0.7}
            side={THREE.DoubleSide}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
        {/* Inner Solid Disk */}
        <mesh>
          <circleGeometry args={[1.1, 32]} />
          <meshBasicMaterial
            color={displayColor}
            transparent={true}
            opacity={isCompleted ? 0.12 : 0.22}
            side={THREE.DoubleSide}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
      </group>

      {/* ── 3. ROTATING 3D FLOATING GEM / MARKER ── */}
      <group ref={gemRef} position={[0, 1.2, 0]}>
        {data.isFinal ? (
          // Radiant Target Ball Star / Diamond
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
          // Rotating Checkpoint Diamond
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
            background: isCompleted
              ? 'rgba(16, 185, 129, 0.9)'
              : isCurrent
              ? 'rgba(15, 23, 42, 0.92)'
              : 'rgba(30, 41, 59, 0.85)',
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
          <span>{isCompleted ? '✓' : data.isFinal ? '🏏' : `#${data.id}`}</span>
          <span style={{ color: isCompleted ? '#ffffff' : displayColor }}>{data.name}</span>
        </div>
      </Html>
    </group>
  );
};
