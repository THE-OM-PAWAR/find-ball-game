import React, { Suspense, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, MapControls, GizmoHelper, GizmoViewport } from '@react-three/drei';
import * as THREE from 'three';
import { GullyLevelBlueprint } from './3d/level/GullyLevelBlueprint';
import { getBlueprintColliders } from './3d/level/LevelZones';
import { LEVEL_GAMEPLAY_MARKERS } from './3d/level/LevelMarkers';
import { Player } from '../../components/player/Player';
import { StudioLighting, type LightingPreset } from './3d/environment/StudioLighting';
import { Eye, Map, Play } from 'lucide-react';

export type BlueprintCameraMode = 'topdown' | 'perspective' | 'player';

interface LevelBlueprintStudioProps {
  lightingPreset?: LightingPreset;
  showMarkers?: boolean;
  showRoutes?: boolean;
  showLabels?: boolean;
  activeFilter?: 'all' | 'retrieval' | 'escape' | 'zones';
}

export const LevelBlueprintStudio: React.FC<LevelBlueprintStudioProps> = ({
  lightingPreset = 'afternoon',
  showMarkers = true,
  showRoutes = true,
  showLabels = true,
  activeFilter = 'all',
}) => {
  const [cameraMode, setCameraMode] = useState<BlueprintCameraMode>('topdown');
  const [selectedMarkerId, setSelectedMarkerId] = useState<string>('marker_start');
  const [playerSpawnKey, setPlayerSpawnKey] = useState<number>(0);

  const colliders = React.useMemo(() => getBlueprintColliders(), []);

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      {/* 3D WebGL Canvas */}
      <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}>
        <Canvas
          shadows
          camera={{ position: [0, 38, 0.01], fov: 40 }}
          gl={{
            antialias: true,
            alpha: true,
            preserveDrawingBuffer: true,
            toneMapping: THREE.ACESFilmicToneMapping,
            toneMappingExposure: 1.15,
          }}
        >
          <color attach="background" args={['#090d16']} />

          <Suspense fallback={null}>
            <StudioLighting preset={lightingPreset} />

            {/* Camera Controls for Top-Down & Perspective */}
            {cameraMode === 'topdown' && (
              <MapControls
                enableRotate={false}
                screenSpacePanning
                maxDistance={65}
                minDistance={10}
                dampingFactor={0.08}
              />
            )}

            {cameraMode === 'perspective' && (
              <OrbitControls
                enableDamping
                dampingFactor={0.06}
                maxPolarAngle={Math.PI / 2 - 0.02}
                minDistance={5}
                maxDistance={70}
              />
            )}

            {/* 35m x 35m Blueprint Map & Zones */}
            <GullyLevelBlueprint
              showMarkers={showMarkers}
              showRoutes={showRoutes}
              showLabels={showLabels}
              activeFilter={activeFilter}
            />

            {/* Playable Third-Person Character when in 'player' mode */}
            {cameraMode === 'player' && (
              <Player
                key={`bp-player-${playerSpawnKey}`}
                initialPosition={[0, 0, 8.0]}
                colliders={colliders}
                showColliderDebug={false}
                enabled={true}
              />
            )}

            {/* Axis Gizmo */}
            {cameraMode !== 'player' && (
              <GizmoHelper alignment="bottom-left" margin={[60, 60]}>
                <GizmoViewport axisColors={['#ef4444', '#22c55e', '#3b82f6']} labelColor="#ffffff" />
              </GizmoHelper>
            )}
          </Suspense>
        </Canvas>
      </div>

      {/* --- FLOATING CAMERA & TOOLBAR DOCK --- */}
      <div
        style={{
          position: 'absolute',
          top: '16px',
          left: '16px',
          zIndex: 10,
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
          pointerEvents: 'none',
        }}
      >
        {/* Camera Mode Segment Buttons */}
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
            onClick={() => setCameraMode('topdown')}
            style={{
              background: cameraMode === 'topdown' ? '#38bdf8' : 'transparent',
              color: cameraMode === 'topdown' ? '#0f172a' : '#94a3b8',
              border: 'none',
              borderRadius: '6px',
              padding: '6px 12px',
              fontSize: '12px',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <Map size={14} />
            <span>Top-Down 2D</span>
          </button>

          <button
            onClick={() => setCameraMode('perspective')}
            style={{
              background: cameraMode === 'perspective' ? '#38bdf8' : 'transparent',
              color: cameraMode === 'perspective' ? '#0f172a' : '#94a3b8',
              border: 'none',
              borderRadius: '6px',
              padding: '6px 12px',
              fontSize: '12px',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <Eye size={14} />
            <span>3D Orbit</span>
          </button>

          <button
            onClick={() => {
              setCameraMode('player');
              setPlayerSpawnKey((k) => k + 1);
            }}
            style={{
              background: cameraMode === 'player' ? '#22c55e' : 'transparent',
              color: cameraMode === 'player' ? '#0f172a' : '#94a3b8',
              border: 'none',
              borderRadius: '6px',
              padding: '6px 12px',
              fontSize: '12px',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <Play size={14} />
            <span>Walk Blueprint</span>
          </button>
        </div>

        {/* Mission Progression Step Checklist */}
        <div
          style={{
            pointerEvents: 'auto',
            background: 'rgba(15, 23, 42, 0.92)',
            backdropFilter: 'blur(8px)',
            border: '1px solid #334155',
            borderRadius: '10px',
            padding: '12px 14px',
            width: '260px',
            maxHeight: '360px',
            overflowY: 'auto',
            color: '#f8fafc',
            fontFamily: 'Inter, sans-serif',
            boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '11px', fontWeight: 700, color: '#38bdf8', letterSpacing: '0.5px' }}>
              LEVEL 1 FLOW ROUTE (10-15m)
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            {LEVEL_GAMEPLAY_MARKERS.map((m) => {
              const isSelected = selectedMarkerId === m.id;
              return (
                <div
                  key={m.id}
                  onClick={() => setSelectedMarkerId(m.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '4px 6px',
                    borderRadius: '6px',
                    background: isSelected ? 'rgba(56, 189, 248, 0.15)' : 'transparent',
                    border: isSelected ? '1px solid #38bdf8' : '1px solid transparent',
                    cursor: 'pointer',
                    fontSize: '11px',
                  }}
                >
                  <span
                    style={{
                      background: m.color,
                      color: '#000',
                      borderRadius: '50%',
                      width: '16px',
                      height: '16px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 800,
                      fontSize: '10px',
                      flexShrink: 0,
                    }}
                  >
                    {m.stepNumber}
                  </span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 600, color: isSelected ? '#38bdf8' : '#e2e8f0', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {m.icon} {m.name}
                    </div>
                  </div>
                  <span style={{ fontSize: '10px', color: '#94a3b8' }}>
                    {m.elevationMeters > 0 ? `+${m.elevationMeters}m` : '0m'}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Bottom Overlay Info Hint */}
      <div className="viewport-overlay-hint">
        {cameraMode === 'player' ? (
          <span>Click inside to lock mouse • <kbd>W A S D</kbd> Move • <kbd>Shift</kbd> Sprint • <kbd>Space</kbd> Jump</span>
        ) : cameraMode === 'topdown' ? (
          <span>Left click + Drag to Pan • Scroll to Zoom • 35m × 35m Real-World Footprint</span>
        ) : (
          <span>Left click + Drag to Orbit • Right click to Pan • Scroll to Zoom</span>
        )}
      </div>
    </div>
  );
};
