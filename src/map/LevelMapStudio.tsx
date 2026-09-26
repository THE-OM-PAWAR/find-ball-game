import React, { Suspense, useState, useRef, useMemo, useCallback } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, MapControls, GizmoHelper, GizmoViewport } from '@react-three/drei';
import * as THREE from 'three';
import { GullyLevelMap } from './GullyLevelMap';
import { StudioLighting, type LightingPreset } from '../studio/components/3d/environment/StudioLighting';
import { Player } from '../components/player/Player';
import { getLevel1MapColliders } from './data/mapLayoutData';
import type { PlayerTelemetry } from '../components/player/PlayerTypes';
import {
  Map,
  Eye,
  Compass,
  ChevronRight,
  Gamepad2,
  RotateCcw,
  Gauge,
  Zap,
  Activity,
  Footprints,
} from 'lucide-react';

export type MapCameraView = 'perspective' | 'topdown' | 'house_a' | 'ball_roof' | 'exit_gate' | 'cricket_pitch';

export const LevelMapStudio: React.FC = () => {
  const [isPlayMode, setIsPlayMode] = useState<boolean>(false);
  const [cameraMode, setCameraMode] = useState<'orbit' | 'topdown'>('orbit');
  const [lightingPreset, setLightingPreset] = useState<LightingPreset>('afternoon');
  const [showWaypoints, setShowWaypoints] = useState<boolean>(true);
  const [showZoneLabels, setShowZoneLabels] = useState<boolean>(true);
  const [showPitchMarkings, setShowPitchMarkings] = useState<boolean>(true);
  const [selectedFocus, setSelectedFocus] = useState<string>('all');
  const [spawnKey, setSpawnKey] = useState<number>(0);
  const [playerSpawnPos, setPlayerSpawnPos] = useState<[number, number, number]>([0, 0.2, 12]);
  const [telemetry, setTelemetry] = useState<PlayerTelemetry | null>(null);

  const controlsRef = useRef<any>(null);

  // High-fidelity physical colliders for all 20 houses, AC steps, and bridges
  const mapColliders = useMemo(() => getLevel1MapColliders(), []);

  const handleFocusLandmark = (landmark: string, targetPos: [number, number, number], camPos: [number, number, number]) => {
    setSelectedFocus(landmark);
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

  // Distance to cricket ball (at [22.4, 6.65, -0.4])
  const distToBall = telemetry
    ? Math.sqrt(
        Math.pow(telemetry.position.x - 22.4, 2) +
          Math.pow(telemetry.position.y - 6.65, 2) +
          Math.pow(telemetry.position.z - (-0.4), 2)
      ).toFixed(1)
    : '28.5';

  return (
    <div style={{ position: 'relative', width: '100vw', height: '100vh', background: '#090d16', overflow: 'hidden' }}>
      {/* 1. Master WebGL 3D Canvas */}
      <Canvas
        shadows
        camera={{ position: [0, 26, 24], fov: 54 }}
        gl={{
          antialias: true,
          alpha: true,
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
                  maxDistance={85}
                  minDistance={10}
                  dampingFactor={0.08}
                />
              ) : (
                <OrbitControls
                  ref={controlsRef}
                  enableDamping
                  dampingFactor={0.06}
                  maxPolarAngle={Math.PI / 2 - 0.02}
                  minDistance={6}
                  maxDistance={85}
                />
              )}
            </>
          )}

          {/* 50m x 50m Production Level 1 Map with 360° Atmosphere & Background City */}
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
              }}
            />
          )}

          {/* Axis Gizmo in inspection mode */}
          {!isPlayMode && (
            <GizmoHelper alignment="bottom-left" margin={[60, 60]}>
              <GizmoViewport axisColors={['#ef4444', '#22c55e', '#3b82f6']} labelColor="#ffffff" />
            </GizmoHelper>
          )}
        </Suspense>
      </Canvas>

      {/* 2. Top Header Navigation Bar */}
      <header
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '52px',
          background: 'rgba(15, 23, 42, 0.92)',
          backdropFilter: 'blur(10px)',
          borderBottom: '1px solid #334155',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 20px',
          zIndex: 20,
          color: '#f8fafc',
          fontFamily: 'Inter, sans-serif',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontSize: '14px', fontWeight: 800, color: '#38bdf8', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Compass size={16} />
            GULLYCRICKET 3D
          </span>
          <ChevronRight size={14} color="#64748b" />
          <span style={{ fontSize: '13px', fontWeight: 600, color: '#e2e8f0' }}>50m × 50m Dense Gully Map</span>
          <span
            style={{
              fontSize: '11px',
              fontWeight: 700,
              background: 'rgba(56, 189, 248, 0.15)',
              color: '#38bdf8',
              padding: '2px 8px',
              borderRadius: '4px',
              border: '1px solid rgba(56, 189, 248, 0.4)',
            }}
          >
            20 Houses • Parkour Ready
          </span>
        </div>

        {/* Header Quick Controls & Mode Toggle */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {/* Main Play Mode Toggle Button */}
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
              gap: '6px',
              background: isPlayMode
                ? 'linear-gradient(135deg, #10b981, #059669)'
                : 'linear-gradient(135deg, #38bdf8, #0284c7)',
              color: '#ffffff',
              border: 'none',
              borderRadius: '6px',
              padding: '7px 14px',
              fontSize: '12px',
              fontWeight: 800,
              cursor: 'pointer',
              boxShadow: isPlayMode
                ? '0 0 16px rgba(16,185,129,0.5)'
                : '0 0 16px rgba(56,189,248,0.4)',
              transition: 'all 0.2s ease',
            }}
          >
            <Gamepad2 size={16} />
            <span>{isPlayMode ? 'EXIT PLAY MODE (ESC)' : '🎮 PLAY AS CHARACTER'}</span>
          </button>

          {/* Lighting Selector */}
          <div
            style={{
              display: 'flex',
              background: 'rgba(30, 41, 59, 0.8)',
              borderRadius: '6px',
              padding: '2px',
              border: '1px solid #475569',
            }}
          >
            {[
              { id: 'afternoon', label: '☀️' },
              { id: 'sunset', label: '🌅' },
              { id: 'monsoon', label: '🌧️' },
              { id: 'night', label: '🌙' },
            ].map((p) => (
              <button
                key={p.id}
                onClick={() => setLightingPreset(p.id as LightingPreset)}
                style={{
                  background: lightingPreset === p.id ? '#38bdf8' : 'transparent',
                  color: lightingPreset === p.id ? '#0f172a' : '#cbd5e1',
                  border: 'none',
                  borderRadius: '4px',
                  padding: '4px 8px',
                  fontSize: '11px',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                {p.label}
              </button>
            ))}
          </div>

          <a
            href="/studio/level"
            style={{
              textDecoration: 'none',
              fontSize: '12px',
              fontWeight: 600,
              color: '#94a3b8',
              padding: '6px 12px',
              borderRadius: '6px',
              border: '1px solid #334155',
              background: 'rgba(30, 41, 59, 0.5)',
            }}
          >
            Blueprint
          </a>
        </div>
      </header>

      {/* 3. Left Floating Landmark Navigator & Camera Presets (Inspection Mode) */}
      {!isPlayMode && (
        <div
          style={{
            position: 'absolute',
            top: '68px',
            left: '16px',
            zIndex: 10,
            display: 'flex',
            flexDirection: 'column',
            gap: '10px',
            width: '260px',
            pointerEvents: 'none',
            fontFamily: 'Inter, sans-serif',
          }}
        >
          {/* Camera Mode Segment */}
          <div
            style={{
              pointerEvents: 'auto',
              background: 'rgba(15, 23, 42, 0.94)',
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
                  controlsRef.current.object.position.set(0, 26, 24);
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
                  controlsRef.current.object.position.set(0, 42, 0.01);
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
              <Map size={14} />
              <span>Top-Down 2D</span>
            </button>
          </div>

          {/* Landmark Focus Hotspots */}
          <div
            style={{
              pointerEvents: 'auto',
              background: 'rgba(15, 23, 42, 0.94)',
              backdropFilter: 'blur(8px)',
              border: '1px solid #334155',
              borderRadius: '10px',
              padding: '12px 14px',
              color: '#f8fafc',
              boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
            }}
          >
            <span style={{ fontSize: '11px', fontWeight: 700, color: '#38bdf8', letterSpacing: '0.5px', display: 'block', marginBottom: '8px' }}>
              📍 LANDMARK QUICK FOCUS
            </span>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
              {[
                {
                  id: 'all',
                  label: '🌐 Full 50m Gully View',
                  target: [0, 0, 0] as [number, number, number],
                  cam: [0, 28, 26] as [number, number, number],
                },
                {
                  id: 'cricket_pitch',
                  label: '🏏 Central Cricket Pitch',
                  target: [0, 0, 0] as [number, number, number],
                  cam: [0, 9, 14] as [number, number, number],
                },
                {
                  id: 'h2_stairs',
                  label: '🪜 H2 Sharma Niwas Stairs',
                  target: [-10.5, 2, -22.4] as [number, number, number],
                  cam: [-10.5, 9, -12] as [number, number, number],
                },
                {
                  id: 'h3_h5_runway',
                  label: '🏢 H3-H5 Rooftop Runway',
                  target: [1.9, 6.5, -22.3] as [number, number, number],
                  cam: [1.9, 14, -10] as [number, number, number],
                },
                {
                  id: 'ball_roof',
                  label: '🎯 Target Ball on H11 Roof',
                  target: [22.4, 6.65, -0.4] as [number, number, number],
                  cam: [13.5, 12, 5.0] as [number, number, number],
                },
                {
                  id: 'exit_gate',
                  label: '🚪 Society Exit Gateway',
                  target: [-19.5, 1.5, -14.5] as [number, number, number],
                  cam: [-14.5, 7, -8.0] as [number, number, number],
                },
              ].map((spot) => (
                <button
                  key={spot.id}
                  onClick={() => handleFocusLandmark(spot.id, spot.target, spot.cam)}
                  style={{
                    background: selectedFocus === spot.id ? 'rgba(56, 189, 248, 0.2)' : 'rgba(255,255,255,0.03)',
                    color: selectedFocus === spot.id ? '#38bdf8' : '#cbd5e1',
                    border: selectedFocus === spot.id ? '1px solid #38bdf8' : '1px solid rgba(255,255,255,0.06)',
                    borderRadius: '6px',
                    padding: '6px 10px',
                    fontSize: '12px',
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

          {/* Viewport Overlay Toggles */}
          <div
            style={{
              pointerEvents: 'auto',
              background: 'rgba(15, 23, 42, 0.94)',
              backdropFilter: 'blur(8px)',
              border: '1px solid #334155',
              borderRadius: '10px',
              padding: '12px 14px',
              color: '#f8fafc',
              boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
            }}
          >
            <span style={{ fontSize: '11px', fontWeight: 700, color: '#38bdf8', letterSpacing: '0.5px', display: 'block', marginBottom: '8px' }}>
              👁️ VISUAL OVERLAYS
            </span>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '12px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={showWaypoints}
                  onChange={(e) => setShowWaypoints(e.target.checked)}
                  style={{ accentColor: '#38bdf8' }}
                />
                <span>Objective Ball Beacon</span>
              </label>

              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={showZoneLabels}
                  onChange={(e) => setShowZoneLabels(e.target.checked)}
                  style={{ accentColor: '#38bdf8' }}
                />
                <span>Zone & Landmark Badges</span>
              </label>

              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={showPitchMarkings}
                  onChange={(e) => setShowPitchMarkings(e.target.checked)}
                  style={{ accentColor: '#38bdf8' }}
                />
                <span>Cricket Pitch Wickets & Bat</span>
              </label>
            </div>
          </div>
        </div>
      )}

      {/* 4. Right Side Plan & Traversal Guide (Inspection Mode) */}
      {!isPlayMode && (
        <aside
          style={{
            position: 'absolute',
            top: '68px',
            right: '16px',
            bottom: '16px',
            width: '320px',
            background: 'rgba(15, 23, 42, 0.94)',
            backdropFilter: 'blur(10px)',
            border: '1px solid #334155',
            borderRadius: '10px',
            padding: '16px',
            zIndex: 10,
            display: 'flex',
            flexDirection: 'column',
            gap: '14px',
            overflowY: 'auto',
            color: '#f8fafc',
            fontFamily: 'Inter, sans-serif',
            boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
          }}
        >
          <div style={{ borderBottom: '1px solid #334155', paddingBottom: '10px' }}>
            <span style={{ fontSize: '13px', fontWeight: 800, color: '#f8fafc', display: 'block' }}>
              LEVEL 1 GULLY MOHALLA
            </span>
            <span style={{ fontSize: '11px', color: '#38bdf8', fontWeight: 600 }}>20 Houses • Parkour Traversal Network</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '11px', color: '#cbd5e1', lineHeight: 1.5 }}>
            <div style={{ padding: '8px 10px', background: 'rgba(56,189,248,0.1)', borderRadius: '6px', border: '1px solid rgba(56,189,248,0.3)' }}>
              <strong style={{ color: '#38bdf8' }}>🧗 Complete Traversal Flow:</strong>
              <div style={{ marginTop: '4px', fontSize: '10.5px' }}>
                1. Ground → H2 Stairs (+3.24m)<br />
                2. H2 → AC Steps → H3 Roof (+6.24m)<br />
                3. H3 ↔ H4 ↔ H5 Plank Bridges (+6.24m)<br />
                4. H5 → AC Steps → H15 Tower (+9.24m)<br />
                5. H15 → H20 Corner → H10 (+9.48m)<br />
                6. Drop to H11 Roof (+6.65m Ball)
              </div>
            </div>

            <button
              onClick={() => setIsPlayMode(true)}
              style={{
                background: 'linear-gradient(135deg, #10b981, #059669)',
                color: '#fff',
                border: 'none',
                borderRadius: '6px',
                padding: '10px',
                fontWeight: 800,
                fontSize: '12px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                marginTop: '6px',
                boxShadow: '0 4px 12px rgba(16,185,129,0.4)',
              }}
            >
              <Gamepad2 size={16} />
              <span>TEST TRAVERSAL IN PLAY MODE</span>
            </button>
          </div>

          {/* 6 Map Design Priorities */}
          <div style={{ borderTop: '1px solid #334155', paddingTop: '10px' }}>
            <span style={{ fontSize: '12px', fontWeight: 700, color: '#f8fafc', display: 'block', marginBottom: '6px' }}>
              🎯 6 DESIGN PRIORITIES
            </span>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', fontSize: '11px', color: '#cbd5e1' }}>
              <div><strong>1. Clear Objective:</strong> Red ball on H11 Roof with glowing beacon.</div>
              <div><strong>2. Traversal Flow:</strong> Ground → Stairs → Roofs → AC Steps → Ball.</div>
              <div><strong>3. Obstacles:</strong> Tommy dog patrol zone near H2 stairs.</div>
              <div><strong>4. Multiple Routes:</strong> West tower ascent vs. East flank bridge.</div>
              <div><strong>5. Vertical Play:</strong> 4 distinct heights (+0.0m, +3.24m, +6.24m, +9.48m).</div>
              <div><strong>6. Readable Spaces:</strong> 20 labeled house markers & gully landmarks.</div>
            </div>
          </div>
        </aside>
      )}

      {/* 5. IN-GAME PLAY MODE HUD OVERLAY (Active in Play Mode) */}
      {isPlayMode && (
        <>
          {/* Top Objective Bar */}
          <div
            style={{
              position: 'absolute',
              top: '64px',
              left: '50%',
              transform: 'translateX(-50%)',
              background: 'rgba(15, 23, 42, 0.94)',
              backdropFilter: 'blur(10px)',
              border: '1px solid #ef4444',
              borderRadius: '30px',
              padding: '8px 20px',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              color: '#f8fafc',
              fontFamily: 'Inter, sans-serif',
              boxShadow: '0 4px 20px rgba(239,68,68,0.3)',
              zIndex: 30,
              pointerEvents: 'none',
            }}
          >
            <span style={{ fontSize: '18px' }}>🏏</span>
            <div>
              <div style={{ fontSize: '12px', fontWeight: 800, color: '#f87171' }}>
                OBJECTIVE: RETRIEVE LOST CRICKET BALL
              </div>
              <div style={{ fontSize: '10.5px', color: '#cbd5e1' }}>
                Target: H11 Balaji Plaza Roof (+6.65m) • Distance: <strong style={{ color: '#38bdf8' }}>{distToBall}m</strong>
              </div>
            </div>
          </div>

          {/* Quick Respawn & Teleport Hotspots (Top Left) */}
          <div
            style={{
              position: 'absolute',
              top: '68px',
              left: '16px',
              background: 'rgba(15, 23, 42, 0.92)',
              backdropFilter: 'blur(10px)',
              border: '1px solid #334155',
              borderRadius: '10px',
              padding: '12px',
              display: 'flex',
              flexDirection: 'column',
              gap: '6px',
              fontFamily: 'Inter, sans-serif',
              zIndex: 30,
              boxShadow: '0 8px 24px rgba(0,0,0,0.5)',
            }}
          >
            <div style={{ fontSize: '11px', fontWeight: 800, color: '#38bdf8', marginBottom: '2px', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <RotateCcw size={13} />
              <span>QUICK SPAWN POINTS</span>
            </div>

            {[
              { label: '🏏 Ground Pitch (0m)', pos: [0, 0.2, 10] as [number, number, number] },
              { label: '🪜 H2 Staircase (+0m)', pos: [-10.5, 0.2, -19.5] as [number, number, number] },
              { label: '🏢 H3 Roof Runway (+6.24m)', pos: [-3.6, 6.4, -22.4] as [number, number, number] },
              { label: '🗼 H15 Landmark Tower (+9.24m)', pos: [13.0, 9.4, -22.4] as [number, number, number] },
              { label: '🏏 H11 Target Roof (+6.65m)', pos: [22.4, 6.8, -0.4] as [number, number, number] },
            ].map((sp, idx) => (
              <button
                key={idx}
                onClick={() => handleSpawnAt(sp.pos)}
                style={{
                  background: 'rgba(255,255,255,0.06)',
                  color: '#e2e8f0',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '5px',
                  padding: '5px 8px',
                  fontSize: '11px',
                  fontWeight: 600,
                  textAlign: 'left',
                  cursor: 'pointer',
                  transition: 'background 0.15s ease',
                }}
              >
                {sp.label}
              </button>
            ))}
          </div>

          {/* Bottom Left Telemetry HUD */}
          <div
            style={{
              position: 'absolute',
              bottom: '20px',
              left: '20px',
              background: 'rgba(15, 23, 42, 0.94)',
              backdropFilter: 'blur(10px)',
              border: '1px solid #334155',
              borderRadius: '10px',
              padding: '12px 16px',
              display: 'flex',
              gap: '16px',
              color: '#f8fafc',
              fontFamily: 'Inter, sans-serif',
              zIndex: 30,
              boxShadow: '0 8px 24px rgba(0,0,0,0.5)',
              pointerEvents: 'none',
            }}
          >
            <div>
              <div style={{ fontSize: '10px', color: '#94a3b8', fontWeight: 600 }}>HEIGHT / ALTITUDE</div>
              <div style={{ fontSize: '16px', fontWeight: 800, color: '#38bdf8' }}>
                {telemetry ? `${telemetry.position.y.toFixed(2)}m` : '0.00m'}
              </div>
            </div>

            <div style={{ borderLeft: '1px solid #334155', paddingLeft: '16px' }}>
              <div style={{ fontSize: '10px', color: '#94a3b8', fontWeight: 600 }}>SPEED</div>
              <div style={{ fontSize: '16px', fontWeight: 800, color: '#10b981' }}>
                {telemetry ? `${((telemetry.horizontalSpeed || 0) * 3.6).toFixed(1)} km/h` : '0.0 km/h'}
              </div>
            </div>

            <div style={{ borderLeft: '1px solid #334155', paddingLeft: '16px' }}>
              <div style={{ fontSize: '10px', color: '#94a3b8', fontWeight: 600 }}>STATE</div>
              <div style={{ fontSize: '16px', fontWeight: 800, color: '#fbbf24' }}>
                {telemetry?.state || 'IDLE'}
              </div>
            </div>
          </div>

          {/* Bottom Center Controls Guide */}
          <div
            style={{
              position: 'absolute',
              bottom: '20px',
              left: '50%',
              transform: 'translateX(-50%)',
              background: 'rgba(15, 23, 42, 0.94)',
              backdropFilter: 'blur(10px)',
              border: '1px solid #334155',
              borderRadius: '24px',
              padding: '8px 20px',
              display: 'flex',
              alignItems: 'center',
              gap: '14px',
              fontSize: '11px',
              fontWeight: 600,
              color: '#e2e8f0',
              fontFamily: 'Inter, sans-serif',
              zIndex: 30,
              boxShadow: '0 8px 24px rgba(0,0,0,0.5)',
              pointerEvents: 'none',
            }}
          >
            <span><kbd style={{ background: '#334155', padding: '2px 6px', borderRadius: '4px', color: '#38bdf8', fontWeight: 800 }}>WASD</kbd> Move</span>
            <span><kbd style={{ background: '#334155', padding: '2px 6px', borderRadius: '4px', color: '#38bdf8', fontWeight: 800 }}>Shift</kbd> Sprint</span>
            <span><kbd style={{ background: '#334155', padding: '2px 6px', borderRadius: '4px', color: '#10b981', fontWeight: 800 }}>Space</kbd> Jump / Climb Mantle</span>
            <span><kbd style={{ background: '#334155', padding: '2px 6px', borderRadius: '4px', color: '#eab308', fontWeight: 800 }}>C</kbd> Crouch</span>
            <span><kbd style={{ background: '#334155', padding: '2px 6px', borderRadius: '4px', color: '#cbd5e1', fontWeight: 800 }}>Mouse</kbd> Look</span>
          </div>
        </>
      )}

      {/* Bottom Controls Instruction Overlay in Inspection Mode */}
      {!isPlayMode && (
        <div className="viewport-overlay-hint" style={{ bottom: '16px' }}>
          <span>{cameraMode === 'topdown' ? 'Left click + Drag to Pan Map • Scroll to Zoom' : 'Left click + Drag to Orbit • Right click to Pan • Scroll to Zoom'}</span>
        </div>
      )}
    </div>
  );
};

export default LevelMapStudio;
