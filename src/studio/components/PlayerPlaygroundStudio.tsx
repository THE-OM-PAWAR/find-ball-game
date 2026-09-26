import React, { Suspense, useState, useMemo, useCallback } from 'react';
import { Canvas } from '@react-three/fiber';
import * as THREE from 'three';
import { Player } from '../../components/player/Player';
import { StudioLighting, type LightingPreset } from './3d/environment/StudioLighting';
import type {
  PlayerControllerParams,
  ThirdPersonCameraParams,
  PlayerTelemetry,
  EnvironmentCollider,
  PlayerState,
} from '../../components/player/PlayerTypes';
import {
  Gamepad2,
  Activity,
  Gauge,
  Zap,
  RotateCcw,
} from 'lucide-react';

interface PlayerPlaygroundStudioProps {
  lightingPreset: LightingPreset;
  playerParams?: Partial<PlayerControllerParams>;
  cameraParams?: Partial<ThirdPersonCameraParams>;
  showColliderDebug?: boolean;
}

/**
 * Minimal 20m x 20m Playground Ground & Boundaries
 */
const PlaygroundGround: React.FC = () => {
  return (
    <group position={[0, 0, 0]}>
      {/* 20m x 20m Neutral Flat Ground Plane */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow position={[0, 0, 0]}>
        <planeGeometry args={[20, 20]} />
        <meshStandardMaterial
          color="#1e242c"
          roughness={0.85}
          metalness={0.1}
        />
      </mesh>

      {/* Subtle 1-meter Metric Grid Helper */}
      <gridHelper args={[20, 20, '#475569', '#334155']} position={[0, 0.002, 0]} />

      {/* Playground Boundary Perimeter Curbs */}
      {/* North Wall (+Z = 10m) */}
      <mesh position={[0, 0.1, 10]} receiveShadow castShadow>
        <boxGeometry args={[20.2, 0.2, 0.2]} />
        <meshStandardMaterial color="#3b82f6" roughness={0.6} />
      </mesh>
      {/* South Wall (-Z = -10m) */}
      <mesh position={[0, 0.1, -10]} receiveShadow castShadow>
        <boxGeometry args={[20.2, 0.2, 0.2]} />
        <meshStandardMaterial color="#3b82f6" roughness={0.6} />
      </mesh>
      {/* East Wall (+X = 10m) */}
      <mesh position={[10, 0.1, 0]} receiveShadow castShadow>
        <boxGeometry args={[0.2, 0.2, 20.2]} />
        <meshStandardMaterial color="#3b82f6" roughness={0.6} />
      </mesh>
      {/* West Wall (-X = -10m) */}
      <mesh position={[-10, 0.1, 0]} receiveShadow castShadow>
        <boxGeometry args={[0.2, 0.2, 20.2]} />
        <meshStandardMaterial color="#3b82f6" roughness={0.6} />
      </mesh>

      {/* Center Spawn Origin Marker */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.003, 0]} receiveShadow>
        <ringGeometry args={[0.4, 0.45, 32]} />
        <meshBasicMaterial color="#60a5fa" transparent opacity={0.6} />
      </mesh>
    </group>
  );
};

export const PlayerPlaygroundStudio: React.FC<PlayerPlaygroundStudioProps> = ({
  lightingPreset = 'afternoon',
  playerParams = {},
  cameraParams = {},
  showColliderDebug = false,
}) => {
  const [playerKey, setPlayerKey] = useState<number>(0);

  // Live Telemetry state for HUD
  const [telemetry, setTelemetry] = useState<PlayerTelemetry>({
    position: new THREE.Vector3(0, 0, 0),
    velocity: new THREE.Vector3(0, 0, 0),
    horizontalSpeed: 0,
    state: 'IDLE' as PlayerState,
    isGrounded: true,
    isCrouching: false,
    facingAngle: 0,
    colliderHeight: 1.80,
  });

  const handleTelemetryUpdate = useCallback((t: PlayerTelemetry) => {
    setTelemetry(t);
  }, []);

  const handleResetSpawn = () => {
    setPlayerKey((k) => k + 1);
  };

  // 20m x 20m Rectangular Boundary Colliders
  const colliders: EnvironmentCollider[] = useMemo(() => {
    return [
      // North Boundary (Z >= 10m)
      {
        type: 'box',
        min: new THREE.Vector3(-12, 0, 10),
        max: new THREE.Vector3(12, 4, 12),
      },
      // South Boundary (Z <= -10m)
      {
        type: 'box',
        min: new THREE.Vector3(-12, 0, -12),
        max: new THREE.Vector3(12, 4, -10),
      },
      // East Boundary (X >= 10m)
      {
        type: 'box',
        min: new THREE.Vector3(10, 0, -12),
        max: new THREE.Vector3(12, 4, 12),
      },
      // West Boundary (X <= -10m)
      {
        type: 'box',
        min: new THREE.Vector3(-12, 0, -12),
        max: new THREE.Vector3(-10, 4, 12),
      },
    ];
  }, []);

  const getBgColor = () => {
    switch (lightingPreset) {
      case 'night':
        return '#090d16';
      case 'sunset':
        return '#1b141d';
      case 'monsoon':
        return '#1f242b';
      case 'afternoon':
      default:
        return '#14181f';
    }
  };

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden', userSelect: 'none' }}>
      {/* TOP-LEFT TITLE & RESET BUTTON */}
      <div style={{ position: 'absolute', top: 16, left: 20, zIndex: 20, display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          background: 'rgba(15, 23, 42, 0.88)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          padding: '6px 14px',
          borderRadius: 12,
          border: '1px solid rgba(255, 255, 255, 0.12)',
          boxShadow: '0 8px 24px rgba(0, 0, 0, 0.3)',
        }}>
          <Gamepad2 style={{ width: 15, height: 15, color: '#38bdf8' }} />
          <span style={{ fontSize: 12, fontWeight: 700, color: '#f8fafc', letterSpacing: '0.04em' }}>
            PLAYER PLAYGROUND (20m × 20m QA)
          </span>
        </div>

        <button
          onClick={handleResetSpawn}
          title="Reset Character to Center Spawn (0, 0)"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            padding: '7px 12px',
            borderRadius: 10,
            fontSize: 12,
            fontWeight: 600,
            color: '#e2e8f0',
            background: 'rgba(15, 23, 42, 0.88)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            border: '1px solid rgba(255, 255, 255, 0.12)',
            cursor: 'pointer',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
          }}
        >
          <RotateCcw style={{ width: 13, height: 13, color: '#60a5fa' }} />
          Reset Spawn
        </button>
      </div>

      {/* TOP-RIGHT REAL-TIME TELEMETRY HUD */}
      <div style={{
        position: 'absolute',
        top: 16,
        right: 20,
        zIndex: 20,
        background: 'rgba(15, 23, 42, 0.90)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        border: '1px solid rgba(255, 255, 255, 0.12)',
        borderRadius: 16,
        padding: '14px 16px',
        boxShadow: '0 16px 36px rgba(0, 0, 0, 0.35)',
        display: 'flex',
        flexDirection: 'column',
        gap: 10,
        minWidth: 220,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', paddingBottom: 8 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#cbd5e1' }}>
            <Activity style={{ width: 14, height: 14, color: '#60a5fa' }} />
            <span>Telemetry</span>
          </div>
          <span style={{
            padding: '2px 8px',
            borderRadius: 6,
            fontSize: 11,
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.04em',
            background: telemetry.state === 'SPRINT' ? 'rgba(245, 158, 11, 0.25)' : telemetry.state === 'RUN' ? 'rgba(59, 130, 246, 0.2)' : telemetry.state === 'WALK' ? 'rgba(16, 185, 129, 0.2)' : telemetry.state === 'CROUCH' || telemetry.state === 'CROUCH_WALK' ? 'rgba(6, 182, 212, 0.2)' : 'rgba(100, 116, 139, 0.2)',
            color: telemetry.state === 'SPRINT' ? '#fbbf24' : telemetry.state === 'RUN' ? '#60a5fa' : telemetry.state === 'WALK' ? '#34d399' : telemetry.state === 'CROUCH' || telemetry.state === 'CROUCH_WALK' ? '#22d3ee' : '#cbd5e1',
            border: '1px solid rgba(255, 255, 255, 0.1)',
          }}>
            {telemetry.state.replace('_', ' ')}
          </span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
          <div style={{ background: 'rgba(30, 41, 59, 0.6)', border: '1px solid rgba(255, 255, 255, 0.05)', borderRadius: 8, padding: '8px 10px', display: 'flex', flexDirection: 'column', gap: 2 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 10, fontWeight: 500, color: '#94a3b8' }}>
              <Gauge style={{ width: 12, height: 12, color: '#38bdf8' }} /> Speed
            </div>
            <div style={{ fontSize: 14, fontWeight: 700, color: '#f8fafc' }}>
              {telemetry.horizontalSpeed.toFixed(1)} <span style={{ fontSize: 10, fontWeight: 400, color: '#94a3b8' }}>m/s</span>
            </div>
          </div>

          <div style={{ background: 'rgba(30, 41, 59, 0.6)', border: '1px solid rgba(255, 255, 255, 0.05)', borderRadius: 8, padding: '8px 10px', display: 'flex', flexDirection: 'column', gap: 2 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 10, fontWeight: 500, color: '#94a3b8' }}>
              <Zap style={{ width: 12, height: 12, color: '#fbbf24' }} /> Ground
            </div>
            <div style={{ fontSize: 13, fontWeight: 700, color: telemetry.isGrounded ? '#10b981' : '#c084fc' }}>
              {telemetry.isGrounded ? 'GROUNDED' : 'AIRBORNE'}
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: 11, color: '#94a3b8', paddingTop: 4, borderTop: '1px solid rgba(255, 255, 255, 0.06)' }}>
          <span>Pos: ({telemetry.position.x.toFixed(1)}, {telemetry.position.z.toFixed(1)})</span>
          <span>Collider: {telemetry.colliderHeight.toFixed(2)}m</span>
        </div>
      </div>

      {/* BOTTOM-LEFT CONTROLS HUD */}
      <div style={{
        position: 'absolute',
        bottom: 20,
        left: 20,
        zIndex: 20,
        background: 'rgba(15, 23, 42, 0.90)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        border: '1px solid rgba(255, 255, 255, 0.12)',
        borderRadius: 16,
        padding: '12px 16px',
        boxShadow: '0 16px 36px rgba(0, 0, 0, 0.35)',
        display: 'flex',
        flexDirection: 'column',
        gap: 8,
        maxWidth: 300,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#f1f5f9', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', paddingBottom: 6 }}>
          <Gamepad2 style={{ width: 14, height: 14, color: '#f59e0b' }} /> Controls Guide
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px 12px', fontSize: 11.5 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <kbd style={{ padding: '2px 6px', background: '#1e293b', border: '1px solid rgba(255, 255, 255, 0.18)', borderRadius: 4, color: '#f8fafc', fontFamily: 'monospace', fontSize: 10, fontWeight: 700 }}>W A S D</kbd>
            <span style={{ color: '#94a3b8', fontSize: 11 }}>Move</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <kbd style={{ padding: '2px 6px', background: '#1e293b', border: '1px solid rgba(255, 255, 255, 0.18)', borderRadius: 4, color: '#f8fafc', fontFamily: 'monospace', fontSize: 10, fontWeight: 700 }}>Shift</kbd>
            <span style={{ color: '#94a3b8', fontSize: 11 }}>Sprint</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <kbd style={{ padding: '2px 6px', background: '#1e293b', border: '1px solid rgba(255, 255, 255, 0.18)', borderRadius: 4, color: '#f8fafc', fontFamily: 'monospace', fontSize: 10, fontWeight: 700 }}>Ctrl / C</kbd>
            <span style={{ color: '#94a3b8', fontSize: 11 }}>Crouch</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <kbd style={{ padding: '2px 6px', background: '#1e293b', border: '1px solid rgba(255, 255, 255, 0.18)', borderRadius: 4, color: '#f8fafc', fontFamily: 'monospace', fontSize: 10, fontWeight: 700 }}>Space</kbd>
            <span style={{ color: '#94a3b8', fontSize: 11 }}>Jump</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <kbd style={{ padding: '2px 6px', background: '#1e293b', border: '1px solid rgba(255, 255, 255, 0.18)', borderRadius: 4, color: '#f8fafc', fontFamily: 'monospace', fontSize: 10, fontWeight: 700 }}>Mouse</kbd>
            <span style={{ color: '#94a3b8', fontSize: 11 }}>Orbit Look</span>
          </div>
        </div>
      </div>

      {/* 3D WEBGL CANVAS */}
      <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}>
        <Canvas
          shadows
          camera={{ position: [0, 2.0, 4.0], fov: 48 }}
          gl={{
            antialias: true,
            alpha: true,
            preserveDrawingBuffer: true,
            toneMapping: THREE.ACESFilmicToneMapping,
            toneMappingExposure: 1.12,
          }}
        >
          <color attach="background" args={[getBgColor()]} />

          <Suspense fallback={null}>
            <StudioLighting preset={lightingPreset} />

            {/* 20m x 20m Isolated Ground & Perimeter */}
            <PlaygroundGround />

            {/* Production Player Character */}
            <Player
              key={`playground-player-${playerKey}`}
              initialPosition={[0, 0, 0]}
              playerParams={playerParams}
              cameraParams={cameraParams}
              colliders={colliders}
              onTelemetryUpdate={handleTelemetryUpdate}
              showColliderDebug={showColliderDebug}
              enabled={true}
            />
          </Suspense>
        </Canvas>
      </div>
    </div>
  );
};
