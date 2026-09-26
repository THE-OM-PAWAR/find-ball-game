import React, { Suspense, useState, useMemo, useCallback } from 'react';
import { Canvas } from '@react-three/fiber';
import * as THREE from 'three';
import { Player } from '../../components/player/Player';
import { StudioLighting, type LightingPreset } from './3d/environment/StudioLighting';
import { SingleStoryStairHouse } from './3d/houses/SingleStoryStairHouse';
import { TwoStoryShopComplex } from './3d/houses/TwoStoryShopComplex';
import { ModernGullyHouse } from './3d/houses/ModernGullyHouse';
import {
  SmallTree,
  LargeTree,
  PottedPlant,
  Bush,
  GrassPatch,
  FallenLeaves,
} from './3d/NatureProps';
import { Dog } from '../../components/dog/Dog';
import { throwDistractionItem } from '../../components/dog/DogInteraction';
import { emitNoise } from '../../components/dog/DogPerception';
import {
  DEFAULT_STAIR_CONFIG,
  DEFAULT_SHOP2_CONFIG,
  DEFAULT_MODERN_CONFIG,
} from '../data/studioDefaultConfigs';
import {
  getSingleStoryStairHouseColliders,
  getTwoStoryShopComplexColliders,
  getModernGullyHouseColliders,
} from './3d/collision/HouseColliders';
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
  Building2,
  ShieldCheck,
  ShieldAlert,
  Layers,
} from 'lucide-react';

export type PlaygroundMode = 'houses' | 'empty';

interface PlayerPlaygroundStudioProps {
  lightingPreset: LightingPreset;
  playerParams?: Partial<PlayerControllerParams>;
  cameraParams?: Partial<ThirdPersonCameraParams>;
  showColliderDebug?: boolean;
}

/**
 * Minimal 20m x 20m Playground Ground & Perimeter Boundaries
 */
const PlaygroundGround: React.FC<{ mode: PlaygroundMode }> = ({ mode }) => {
  return (
    <group position={[0, 0, 0]}>
      {/* 20m x 20m Neutral Flat Ground Plane */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow position={[0, 0, 0]}>
        <planeGeometry args={[20, 20]} />
        <meshStandardMaterial
          color="#1e242c"
          roughness={0.88}
          metalness={0.08}
        />
      </mesh>

      {/* Subtle 1-meter Metric Grid Helper */}
      <gridHelper args={[20, 20, '#475569', '#334155']} position={[0, 0.002, 0]} />

      {/* Playground Boundary Perimeter Curbs (X = +-10m, Z = +-10m) */}
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

      {/* Mode visual indicator text / footprint guide */}
      {mode === 'houses' && (
        <group position={[0, 0.004, 0]}>
          {/* Alleyway guide line between House 1 and House 3 */}
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-4.5, 0, 0]}>
            <planeGeometry args={[7.0, 0.08]} />
            <meshBasicMaterial color="#38bdf8" transparent opacity={0.25} />
          </mesh>
        </group>
      )}
    </group>
  );
};

/**
 * Visual Representation of Debug Box Colliders
 */
const ColliderDebugVisualizer: React.FC<{ colliders: EnvironmentCollider[] }> = ({ colliders }) => {
  return (
    <group>
      {colliders.map((col, idx) => {
        if (col.type === 'box' && col.min && col.max) {
          const size = new THREE.Vector3().subVectors(col.max, col.min);
          const center = new THREE.Vector3().addVectors(col.min, col.max).multiplyScalar(0.5);
          return (
            <mesh key={idx} position={center}>
              <boxGeometry args={[size.x, size.y, size.z]} />
              <meshBasicMaterial color="#ef4444" wireframe transparent opacity={0.45} />
            </mesh>
          );
        }
        return null;
      })}
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
  const [testMode, setTestMode] = useState<PlaygroundMode>('houses');

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

  const lastEmitTime = React.useRef<number>(0);
  const handleTelemetryUpdate = useCallback((t: PlayerTelemetry) => {
    setTelemetry(t);

    const now = performance.now();
    if (now - lastEmitTime.current > 350) {
      lastEmitTime.current = now;
      if (t.state === 'SPRINT') {
        emitNoise(t.position, 12.0, 1.0, 'player_sprint');
      } else if (t.state === 'RUN') {
        emitNoise(t.position, 7.5, 0.65, 'player_run');
      } else if (t.state === 'WALK') {
        emitNoise(t.position, 4.0, 0.35, 'player_walk');
      } else if (t.state === 'CROUCH_WALK') {
        emitNoise(t.position, 2.0, 0.1, 'player_walk');
      }
    }
  }, []);

  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'b' || e.key === 'B') {
        const dir = new THREE.Vector3(
          Math.sin(telemetry.facingAngle),
          0.3,
          Math.cos(telemetry.facingAngle)
        ).normalize();
        throwDistractionItem(telemetry.position, dir, 'biscuit', 7.5);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [telemetry]);

  const handleResetSpawn = () => {
    setPlayerKey((k) => k + 1);
  };

  // 20m x 20m Rectangular Boundaries + Architectural Houses Colliders
  const colliders: EnvironmentCollider[] = useMemo(() => {
    // 1. Outer Perimeter Curbs (X = +-10m, Z = +-10m)
    const list: EnvironmentCollider[] = [
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

    if (testMode === 'houses') {
      // 2. House 1: SingleStoryStairHouse (Open-Stair Bungalow with 16 modular stair steps, walls, and walkable roof)
      list.push(...getSingleStoryStairHouseColliders([-4.5, 0, -4.5], 0));

      // 3. House 2: TwoStoryShopComplex at position [5.2, 0, 0.0] (rot -90 deg)
      list.push(...getTwoStoryShopComplexColliders([5.2, 0, 0], -Math.PI / 2));

      // 4. House 3: ModernGullyHouse at position [-4.5, 0, 4.5]
      list.push(...getModernGullyHouseColliders([-4.5, 0, 4.5], 0));

      // 5. Large Gulmohar Tree Trunk Collider at [6.8, 0, 6.2]
      list.push({
        type: 'box',
        min: new THREE.Vector3(6.8 - 0.45, 0, 6.2 - 0.45),
        max: new THREE.Vector3(6.8 + 0.45, 3.5, 6.2 + 0.45),
      });

      // 6. Small Neem Tree Trunk Collider at [-8.8, 0, 0.2]
      list.push({
        type: 'box',
        min: new THREE.Vector3(-8.8 - 0.25, 0, 0.2 - 0.25),
        max: new THREE.Vector3(-8.8 + 0.25, 2.5, 0.2 + 0.25),
      });
    }

    return list;
  }, [testMode]);

  // Real-time Collision Contact Status
  const isContacting = useMemo(() => {
    const px = telemetry.position.x;
    const py = telemetry.position.y;
    const pz = telemetry.position.z;
    const r = 0.32; // player radius
    const h = telemetry.colliderHeight;

    for (const col of colliders) {
      if (col.type === 'box' && col.min && col.max) {
        if (py + h >= col.min.y && py <= col.max.y) {
          const dx = Math.max(0, Math.max(col.min.x - px, px - col.max.x));
          const dz = Math.max(0, Math.max(col.min.z - pz, pz - col.max.z));
          const distSq = dx * dx + dz * dz;
          if (distSq <= (r + 0.05) * (r + 0.05)) {
            return true;
          }
        }
      }
    }
    return false;
  }, [telemetry.position, telemetry.colliderHeight, colliders]);

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
      {/* TOP-LEFT TITLE, MODE TOGGLE & RESET BUTTON */}
      <div style={{ position: 'absolute', top: 16, left: 20, zIndex: 20, display: 'flex', alignItems: 'center', gap: 10 }}>
        {/* Title pill */}
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
            PLAYER PLAYGROUND (20m × 20m)
          </span>
        </div>

        {/* Mode Switcher Pill Group: [ Empty Test ] [ House Collision Test ] */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          background: 'rgba(15, 23, 42, 0.88)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          border: '1px solid rgba(255, 255, 255, 0.12)',
          borderRadius: 10,
          padding: '2px',
          gap: 2,
          boxShadow: '0 4px 14px rgba(0, 0, 0, 0.2)',
        }}>
          <button
            onClick={() => setTestMode('empty')}
            style={{
              padding: '5px 10px',
              fontSize: 11.5,
              fontWeight: 600,
              borderRadius: 8,
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 5,
              background: testMode === 'empty' ? '#38bdf8' : 'transparent',
              color: testMode === 'empty' ? '#0f172a' : '#94a3b8',
              transition: 'all 0.15s ease',
            }}
          >
            <Layers style={{ width: 13, height: 13 }} />
            Empty Test
          </button>
          <button
            onClick={() => setTestMode('houses')}
            style={{
              padding: '5px 10px',
              fontSize: 11.5,
              fontWeight: 600,
              borderRadius: 8,
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 5,
              background: testMode === 'houses' ? '#38bdf8' : 'transparent',
              color: testMode === 'houses' ? '#0f172a' : '#94a3b8',
              transition: 'all 0.15s ease',
            }}
          >
            <Building2 style={{ width: 13, height: 13 }} />
            House Collision Test
          </button>
        </div>

        {/* Reset Spawn Button */}
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

      {/* TOP-RIGHT REAL-TIME TELEMETRY & COLLISION HUD */}
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
        minWidth: 230,
      }}>
        {/* Header with State badge */}
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

        {/* Speed & Ground Metrics */}
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

        {/* Collision Status Indicator */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: isContacting ? 'rgba(245, 158, 11, 0.15)' : 'rgba(16, 185, 129, 0.12)',
          border: `1px solid ${isContacting ? 'rgba(245, 158, 11, 0.4)' : 'rgba(16, 185, 129, 0.3)'}`,
          borderRadius: 8,
          padding: '7px 10px',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            {isContacting ? (
              <ShieldAlert style={{ width: 14, height: 14, color: '#f59e0b' }} />
            ) : (
              <ShieldCheck style={{ width: 14, height: 14, color: '#10b981' }} />
            )}
            <span style={{ fontSize: 11, fontWeight: 600, color: '#e2e8f0' }}>Collision Status:</span>
          </div>
          <span style={{
            fontSize: 11,
            fontWeight: 800,
            letterSpacing: '0.04em',
            color: isContacting ? '#fbbf24' : '#34d399',
          }}>
            {isContacting ? 'CONTACT' : 'CLEAR'}
          </span>
        </div>

        {/* Position & Collider Height */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: 11, color: '#94a3b8', paddingTop: 2 }}>
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
        maxWidth: 320,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', paddingBottom: 6 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#f1f5f9' }}>
            <Gamepad2 style={{ width: 14, height: 14, color: '#f59e0b' }} /> Controls Guide
          </div>
          <span style={{ fontSize: 10, color: '#94a3b8' }}>
            {testMode === 'houses' ? '3 Houses Active' : 'Empty Arena'}
          </span>
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
            <PlaygroundGround mode={testMode} />

            {/* Exactly 3 Existing Indian Houses when testMode is 'houses' */}
            {testMode === 'houses' && (
              <group>
                {/* House 1: SingleStoryStairHouse (North-West) */}
                <SingleStoryStairHouse
                  position={[-4.5, 0, -4.5]}
                  rotation={[0, 0, 0]}
                  config={{ ...DEFAULT_STAIR_CONFIG, hasFrontGarden: false }}
                />

                {/* House 2: TwoStoryShopComplex (East Promenade) */}
                <TwoStoryShopComplex
                  position={[5.2, 0, 0]}
                  rotation={[0, -Math.PI / 2, 0]}
                  config={DEFAULT_SHOP2_CONFIG}
                />

                {/* House 3: ModernGullyHouse (South-West) */}
                <ModernGullyHouse
                  position={[-4.5, 0, 4.5]}
                  rotation={[0, 0, 0]}
                  config={{ ...DEFAULT_MODERN_CONFIG, hasPalmTree: false, hasStreetLamp: false }}
                />

                {/* --- 🌳 LUSH PRODUCTION NATURE PROPS --- */}
                {/* 1. Grand Large Gulmohar Tree with Orange Blossoms (South-East Courtyard) */}
                <LargeTree position={[6.8, 0, 6.2]} rotation={[0, 0.4, 0]} scale={0.95} hasFlowers={true} />

                {/* 2. Small Trees (Neem & Conical Ashoka) */}
                <SmallTree position={[-8.8, 0, 0.2]} rotation={[0, 0.8, 0]} variant="round" foliageColor="#15803d" />
                <SmallTree position={[8.4, 0, -6.8]} rotation={[0, -0.4, 0]} variant="conical" foliageColor="#16a34a" />

                {/* 3. Potted Plants on Verandas & Terraces */}
                <PottedPlant position={[-2.4, 0.48, -3.2]} plantType="tulsi" potStyle="terracotta" />
                <PottedPlant position={[-6.2, 0.48, -3.2]} plantType="snake_plant" potStyle="ceramic_blue" />
                <PottedPlant position={[-3.2, 3.24, -3.4]} plantType="money_plant" potStyle="white_glazed" />
                <PottedPlant position={[1.8, 0, 3.8]} plantType="flowering_hibiscus" potStyle="terracotta" />

                {/* 4. Bushes (Vibrant Pink Bougainvillea & Shrub Rows) */}
                <Bush position={[0.8, 0, -4.5]} variant="flowering_bougainvillea" scale={1.1} />
                <Bush position={[-8.2, 0, 8.2]} variant="hedge_row" rotation={[0, Math.PI / 2, 0]} />
                <Bush position={[8.6, 0, 1.8]} variant="round_shrub" />

                {/* 5. Grass Patches & Wildflower Tufts */}
                <GrassPatch position={[-1.2, 0, 2.8]} radius={0.6} bladeCount={16} />
                <GrassPatch position={[0.6, 0, -1.2]} radius={0.5} bladeCount={12} />
                <GrassPatch position={[-6.8, 0, -0.5]} radius={0.7} bladeCount={18} />
                <GrassPatch position={[3.2, 0, 5.2]} radius={0.55} bladeCount={14} />

                {/* 6. Fallen Leaves Litter */}
                <FallenLeaves position={[-0.8, 0, -0.2]} count={14} radius={0.8} />
                <FallenLeaves position={[-4.5, 0, 1.8]} count={10} radius={0.6} color="#b45309" />

                {/* 🐕 Guard Dog AI Patrolling Courtyard */}
                <Dog
                  initialPosition={[1.8, 0, -1.5]}
                  playerTelemetry={telemetry}
                  colliders={colliders}
                  showDebug={showColliderDebug}
                  config={{
                    patrolPoints: [
                      { position: [1.8, 0, -1.5], waitTime: 2.0 },
                      { position: [1.8, 0, 3.5], waitTime: 2.0 },
                      { position: [-1.2, 0, 2.0], waitTime: 3.0 },
                      { position: [-1.2, 0, -1.5], waitTime: 2.5 },
                    ],
                  }}
                  enabled={true}
                />
              </group>
            )}

            {/* Debug Collider Wireframes (Red boxes) */}
            {showColliderDebug && <ColliderDebugVisualizer colliders={colliders} />}

            {/* Production Player Character */}
            <Player
              key={`playground-player-${playerKey}-${testMode}`}
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
