import React, { Suspense, useState, useRef, useMemo, useCallback } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, MapControls, GizmoHelper, GizmoViewport } from '@react-three/drei';
import * as THREE from 'three';
import { GullyLevelMap } from '../../map/GullyLevelMap';
import { type LightingPreset } from './3d/environment/StudioLighting';
import { Player } from '../../components/player/Player';
import { getLevel1MapColliders } from '../../map/data/mapLayoutData';
import type { PlayerTelemetry } from '../../components/player/PlayerTypes';
import {
  Map as MapIcon,
  Eye,
  Gamepad2,
  RotateCcw,
} from 'lucide-react';

interface MapStudioProps {
  lightingPreset?: LightingPreset;
  showWaypoints?: boolean;
  showZoneLabels?: boolean;
  showPitchMarkings?: boolean;
  activeFocus?: string;
  onFocusChange?: (focus: string) => void;
}

export const MapStudio: React.FC<MapStudioProps> = ({
  lightingPreset = 'afternoon',
  showWaypoints = true,
  showZoneLabels = true,
  showPitchMarkings = true,
  activeFocus = 'all',
  onFocusChange,
}) => {
  const [isPlayMode, setIsPlayMode] = useState<boolean>(false);
  const [cameraMode, setCameraMode] = useState<'orbit' | 'topdown'>('orbit');
  const [internalFocus, setInternalFocus] = useState<string>(activeFocus);
  const [spawnKey, setSpawnKey] = useState<number>(0);
  const [playerSpawnPos, setPlayerSpawnPos] = useState<[number, number, number]>([0, 0.2, 12]);
  const [telemetry, setTelemetry] = useState<PlayerTelemetry | null>(null);

  const controlsRef = useRef<any>(null);
  const mapColliders = useMemo(() => getLevel1MapColliders(), []);

  const handleFocusLandmark = (
    landmark: string,
    targetPos: [number, number, number],
    camPos: [number, number, number]
  ) => {
    setInternalFocus(landmark);
    onFocusChange?.(landmark);
    if (controlsRef.current) {
      controlsRef.current.target.set(...targetPos);
      controlsRef.current.object.position.set(...camPos);
      controlsRef.current.update();
    }
  };

  const handleSpawnAt = (pos: [number, number, number]) => {
    setPlayerSpawnPos(pos);
    setSpawnKey((k) => k + 1);
  };

  const handleTelemetryUpdate = useCallback((t: PlayerTelemetry) => {
    setTelemetry(t);
  }, []);

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden' }}>
      {/* 3D WebGL Canvas */}
      <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}>
        <Canvas
          shadows
          camera={{ position: [0, 32, 28], fov: 54 }}
          gl={{
            antialias: true,
            alpha: true,
            preserveDrawingBuffer: true,
            toneMapping: THREE.ACESFilmicToneMapping,
            toneMappingExposure: 1.12,
          }}
        >
          <Suspense fallback={null}>
            {/* Camera Controls when inspecting */}
            {!isPlayMode && (
              <>
                {cameraMode === 'topdown' ? (
                  <MapControls
                    ref={controlsRef}
                    enableRotate={false}
                    screenSpacePanning
                    maxDistance={90}
                    minDistance={12}
                    dampingFactor={0.08}
                  />
                ) : (
                  <OrbitControls
                    ref={controlsRef}
                    enableDamping
                    dampingFactor={0.06}
                    maxPolarAngle={Math.PI / 2 - 0.02}
                    minDistance={8}
                    maxDistance={95}
                  />
                )}
              </>
            )}

            {/* 50m x 50m Production Map with 20 Houses & 360° Atmosphere */}
            <GullyLevelMap
              showWaypoints={showWaypoints}
              showZoneLabels={showZoneLabels && !isPlayMode}
              showPitchMarkings={showPitchMarkings}
              lightingPreset={lightingPreset}
              includeAtmosphere={true}
            />

            {/* 3D Character Controller in Play Mode */}
            {isPlayMode && (
              <Player
                key={spawnKey}
                initialPosition={playerSpawnPos}
                colliders={mapColliders}
                onTelemetryUpdate={handleTelemetryUpdate}
                playerParams={{
                  walkSpeed: 2.5,
                  runSpeed: 5.2,
                  sprintSpeed: 8.0,
                  jumpForce: 6.8,
                  stepHeight: 0.42,
                  airControl: 0.65,
                  gravity: 17.0,
                  climbSpeed: 2.5,
                }}
              />
            )}

            {/* Axis Gizmo */}
            {!isPlayMode && (
              <GizmoHelper alignment="bottom-left" margin={[60, 60]}>
                <GizmoViewport axisColors={['#ef4444', '#22c55e', '#3b82f6']} labelColor="#ffffff" />
              </GizmoHelper>
            )}
          </Suspense>
        </Canvas>
      </div>

      {/* Mode Switcher Button (Top Right) */}
      <div
        style={{
          position: 'absolute',
          top: '16px',
          right: '16px',
          zIndex: 20,
          pointerEvents: 'auto',
        }}
      >
        <button
          onClick={() => {
            setIsPlayMode((p) => !p);
            if (!isPlayMode) {
              setSpawnKey((k) => k + 1);
            }
          }}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            background: isPlayMode
              ? 'linear-gradient(135deg, #10b981, #059669)'
              : 'linear-gradient(135deg, #38bdf8, #0284c7)',
            color: '#ffffff',
            border: 'none',
            borderRadius: '8px',
            padding: '10px 18px',
            fontSize: '13px',
            fontWeight: 800,
            cursor: 'pointer',
            boxShadow: isPlayMode
              ? '0 0 20px rgba(16,185,129,0.6)'
              : '0 0 20px rgba(56,189,248,0.5)',
            transition: 'all 0.2s ease',
          }}
        >
          <Gamepad2 size={18} />
          <span>{isPlayMode ? 'EXIT PLAY MODE (ESC)' : '🎮 PLAY AS CHARACTER'}</span>
        </button>
      </div>

      {/* Play Mode Active HUD Overlay */}
      {isPlayMode && (
        <>
          {/* Top-Left Telemetry & Action State HUD */}
          <div
            style={{
              position: 'absolute',
              top: '16px',
              left: '16px',
              zIndex: 15,
              background: 'rgba(15, 23, 42, 0.92)',
              backdropFilter: 'blur(8px)',
              border: '1px solid #334155',
              borderRadius: '10px',
              padding: '12px 16px',
              color: '#f8fafc',
              boxShadow: '0 8px 24px rgba(0,0,0,0.5)',
              display: 'flex',
              flexDirection: 'column',
              gap: '6px',
              fontFamily: 'Inter, sans-serif',
              minWidth: '220px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #334155', paddingBottom: '6px' }}>
              <span style={{ fontSize: '11px', fontWeight: 800, color: '#38bdf8', letterSpacing: '0.5px' }}>
                PLAYER TELEMETRY
              </span>
              <span
                style={{
                  fontSize: '10px',
                  fontWeight: 800,
                  padding: '2px 6px',
                  borderRadius: '4px',
                  background:
                    telemetry?.state === 'CLIMB_WALL' || telemetry?.state === 'CLIMB_LADDER'
                      ? '#10b981'
                      : telemetry?.state === 'SPRINT'
                      ? '#f59e0b'
                      : '#3b82f6',
                  color: '#ffffff',
                }}
              >
                {telemetry?.state || 'IDLE'}
              </span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px', fontSize: '11px', marginTop: '4px' }}>
              <div>
                <span style={{ color: '#94a3b8' }}>Height: </span>
                <span style={{ fontWeight: 700, color: '#f8fafc' }}>
                  {telemetry ? `${telemetry.position.y.toFixed(2)}m` : '0.20m'}
                </span>
              </div>
              <div>
                <span style={{ color: '#94a3b8' }}>Speed: </span>
                <span style={{ fontWeight: 700, color: '#38bdf8' }}>
                  {telemetry ? `${telemetry.horizontalSpeed.toFixed(1)} m/s` : '0.0 m/s'}
                </span>
              </div>
            </div>

            {(telemetry?.state === 'CLIMB_WALL' || telemetry?.state === 'CLIMB_LADDER') && (
              <div
                style={{
                  marginTop: '4px',
                  background: 'rgba(16, 185, 129, 0.2)',
                  border: '1px solid #10b981',
                  borderRadius: '4px',
                  padding: '4px 8px',
                  fontSize: '11px',
                  fontWeight: 700,
                  color: '#34d399',
                  textAlign: 'center',
                }}
              >
                🪜 {telemetry.state === 'CLIMB_LADDER' ? 'CLIMBING LADDER (W/S)' : 'MANTLING LEDGE...'}
              </div>
            )}
          </div>

          {/* Quick Spawn Selection Floating Bar */}
          <div
            style={{
              position: 'absolute',
              bottom: '20px',
              left: '50%',
              transform: 'translateX(-50%)',
              zIndex: 15,
              background: 'rgba(15, 23, 42, 0.94)',
              backdropFilter: 'blur(8px)',
              border: '1px solid #334155',
              borderRadius: '30px',
              padding: '6px 12px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              boxShadow: '0 8px 30px rgba(0,0,0,0.6)',
              fontFamily: 'Inter, sans-serif',
            }}
          >
            <span style={{ fontSize: '11px', fontWeight: 700, color: '#94a3b8', padding: '0 8px' }}>
              📍 Quick Spawn:
            </span>

            {[
              { label: 'Ground Alley', pos: [0, 0.2, 12] as [number, number, number] },
              { label: 'H2 Stair Base', pos: [-13.15, 0.2, -20.25] as [number, number, number] },
              { label: 'H2 Roof (+3.2m)', pos: [-10.5, 3.4, -22.4] as [number, number, number] },
              { label: 'H3 Roof (+6.2m)', pos: [-3.6, 6.4, -22.4] as [number, number, number] },
              { label: 'H5 Roof (+6.2m)', pos: [7.4, 6.4, -22.4] as [number, number, number] },
              { label: 'Target Ball (+6.6m)', pos: [22.4, 6.8, -0.4] as [number, number, number] },
            ].map((sp, idx) => (
              <button
                key={idx}
                onClick={() => handleSpawnAt(sp.pos)}
                style={{
                  background: 'rgba(255,255,255,0.06)',
                  color: '#f8fafc',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '20px',
                  padding: '5px 10px',
                  fontSize: '11px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
              >
                {sp.label}
              </button>
            ))}

            <button
              onClick={() => setSpawnKey((k) => k + 1)}
              style={{
                background: '#ef4444',
                color: '#ffffff',
                border: 'none',
                borderRadius: '20px',
                padding: '5px 10px',
                fontSize: '11px',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
              }}
            >
              <RotateCcw size={12} />
              Reset
            </button>
          </div>
        </>
      )}

      {/* Floating Camera & Landmark Toolset (Only when not in Play Mode) */}
      {!isPlayMode && (
        <div
          style={{
            position: 'absolute',
            top: '16px',
            left: '16px',
            zIndex: 10,
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
            width: '260px',
            pointerEvents: 'none',
            fontFamily: 'Inter, sans-serif',
          }}
        >
          {/* Camera Mode Segment */}
          <div
            style={{
              pointerEvents: 'auto',
              background: 'rgba(15, 23, 42, 0.92)',
              backdropFilter: 'blur(8px)',
              border: '1px solid #334155',
              borderRadius: '8px',
              padding: '4px',
              display: 'flex',
              gap: '4px',
              boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
            }}
          >
            <button
              onClick={() => {
                setCameraMode('orbit');
                if (controlsRef.current) {
                  controlsRef.current.target.set(0, 0, 0);
                  controlsRef.current.object.position.set(0, 36, 32);
                  controlsRef.current.update();
                }
              }}
              style={{
                flex: 1,
                background: cameraMode === 'orbit' ? '#38bdf8' : 'transparent',
                color: cameraMode === 'orbit' ? '#0f172a' : '#94a3b8',
                border: 'none',
                borderRadius: '6px',
                padding: '6px',
                fontSize: '12px',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
              }}
            >
              <Eye size={14} />
              <span>3D Orbit</span>
            </button>

            <button
              onClick={() => {
                setCameraMode('topdown');
                if (controlsRef.current) {
                  controlsRef.current.target.set(0, 0, 0);
                  controlsRef.current.object.position.set(0, 56, 0.01);
                  controlsRef.current.update();
                }
              }}
              style={{
                flex: 1,
                background: cameraMode === 'topdown' ? '#38bdf8' : 'transparent',
                color: cameraMode === 'topdown' ? '#0f172a' : '#94a3b8',
                border: 'none',
                borderRadius: '6px',
                padding: '6px',
                fontSize: '12px',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
              }}
            >
              <MapIcon size={14} />
              <span>Top-Down 2D</span>
            </button>
          </div>

          {/* Landmark Focus Buttons */}
          <div
            style={{
              pointerEvents: 'auto',
              background: 'rgba(15, 23, 42, 0.92)',
              backdropFilter: 'blur(8px)',
              border: '1px solid #334155',
              borderRadius: '10px',
              padding: '12px 14px',
              color: '#f8fafc',
              boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
            }}
          >
            <span
              style={{
                fontSize: '11px',
                fontWeight: 700,
                color: '#38bdf8',
                letterSpacing: '0.5px',
                display: 'block',
                marginBottom: '8px',
              }}
            >
              📍 LEVEL 1 LANDMARKS (20 HOUSES)
            </span>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
              {[
                {
                  id: 'all',
                  label: '🌐 Full 50m Gully Overview',
                  target: [0, 0, 0] as [number, number, number],
                  cam: [0, 36, 32] as [number, number, number],
                },
                {
                  id: 'spawn',
                  label: '🚩 Player Spawn (South Gully)',
                  target: [0, 1.2, 17] as [number, number, number],
                  cam: [0, 8, 28] as [number, number, number],
                },
                {
                  id: 'pitch',
                  label: '🏏 Central Cricket Arena & Pitch',
                  target: [-0.5, 0.5, 5] as [number, number, number],
                  cam: [-0.5, 10, 16] as [number, number, number],
                },
                {
                  id: 'stair_house',
                  label: '↑ House 2 Exterior Stairs (Sharma)',
                  target: [-10.5, 1.5, -20] as [number, number, number],
                  cam: [-10.5, 9, -10] as [number, number, number],
                },
                {
                  id: 'ball_roof',
                  label: '🎯 Target Ball on H11 Balaji Roof (+6.65m)',
                  target: [22.4, 6.8, -0.4] as [number, number, number],
                  cam: [22.4, 12, 10] as [number, number, number],
                },
                {
                  id: 'exit_gate',
                  label: '🚪 Society Exit Gate (North-West)',
                  target: [-18, 1.5, -14] as [number, number, number],
                  cam: [-18, 8, -5] as [number, number, number],
                },
              ].map((spot) => (
                <button
                  key={spot.id}
                  onClick={() => handleFocusLandmark(spot.id, spot.target, spot.cam)}
                  style={{
                    background: internalFocus === spot.id ? 'rgba(56, 189, 248, 0.2)' : 'rgba(255,255,255,0.03)',
                    color: internalFocus === spot.id ? '#38bdf8' : '#cbd5e1',
                    border: internalFocus === spot.id ? '1px solid #38bdf8' : '1px solid rgba(255,255,255,0.06)',
                    borderRadius: '6px',
                    padding: '6px 10px',
                    fontSize: '11px',
                    fontWeight: 600,
                    textAlign: 'left',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                  }}
                >
                  {spot.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Bottom Hint */}
      {!isPlayMode && (
        <div className="viewport-overlay-hint">
          <span>
            {cameraMode === 'topdown'
              ? 'Left click + Drag to Pan 50m Map • Scroll to Zoom'
              : 'Left click + Drag to Orbit • Right click to Pan • Scroll to Zoom • 20 Houses Dense Gully'}
          </span>
        </div>
      )}
    </div>
  );
};
