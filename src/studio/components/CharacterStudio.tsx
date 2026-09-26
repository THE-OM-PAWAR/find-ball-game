import React, { Suspense, useRef, useEffect, useState, useCallback } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, GizmoHelper, GizmoViewport } from '@react-three/drei';
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib';
import * as THREE from 'three';
import { GullyCricketPlayer, type CharacterConfig } from './3d/character/GullyCricketPlayer';
import { BajajChetakScooter } from './3d/vehicles/BajajChetakScooter';
import { StudioLighting, type LightingPreset } from './3d/environment/StudioLighting';
import { CricketBallThrower } from './3d/physics/CricketBallThrower';
import { Player } from '../../components/player/Player';
import { GullyTestArena } from '../../components/environment/GullyTestArena';
import type { CollisionCollider } from '../../components/player/PlayerPhysics';
import type { PlayerTelemetry, PlayerState } from '../../components/player/PlayerTypes';
import {
  Gamepad2,
  Eye,
  RotateCcw,
  Zap,
  Gauge,
  Activity,
} from 'lucide-react';

export type CharacterCameraPreset = 'full-body' | 'face-zoom' | 'side' | 'batting-focus';

interface CharacterStudioProps {
  characterConfig: CharacterConfig;
  lightingPreset: LightingPreset;
  showReferenceVehicle: boolean;
  showScaleRuler: boolean;
  autoRotate: boolean;
  cameraPreset?: CharacterCameraPreset;
}

const CharacterCameraController: React.FC<{
  preset?: CharacterCameraPreset;
  autoRotate: boolean;
}> = ({
  preset = 'full-body',
  autoRotate,
}) => {
  const controlsRef = useRef<OrbitControlsImpl>(null);

  useEffect(() => {
    if (!controlsRef.current) return;
    const controls = controlsRef.current;

    switch (preset) {
      case 'full-body':
        controls.object.position.set(2.4, 1.4, 2.8);
        controls.target.set(0, 0.95, 0);
        break;
      case 'face-zoom':
        controls.object.position.set(0.6, 1.62, 1.1);
        controls.target.set(0, 1.58, 0.05);
        break;
      case 'side':
        controls.object.position.set(3.2, 1.1, 0);
        controls.target.set(0, 0.95, 0);
        break;
      case 'batting-focus':
        controls.object.position.set(1.4, 0.8, 1.8);
        controls.target.set(0.1, 0.7, 0.2);
        break;
      default:
        controls.object.position.set(2.4, 1.4, 2.8);
        controls.target.set(0, 0.95, 0);
        break;
    }
    controls.update();
  }, [preset]);

  return (
    <OrbitControls
      ref={controlsRef}
      makeDefault
      autoRotate={autoRotate}
      autoRotateSpeed={0.8}
      maxPolarAngle={Math.PI / 2 - 0.02}
      minDistance={0.6}
      maxDistance={8}
      target={[0, 0.95, 0]}
    />
  );
};

/**
 * Inspection Mode Pitch Ground with Popping Crease, Stumps & Metric Scale Markers
 */
const PitchGround: React.FC<{ showScaleRuler: boolean }> = ({ showScaleRuler }) => {
  return (
    <group position={[0, -0.01, 0]}>
      {/* Asphalt Street Surface */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[14, 14]} />
        <meshStandardMaterial color="#22262d" roughness={0.88} metalness={0.08} />
      </mesh>

      {/* Chalk Popping Crease (White line at batsman's feet) */}
      <mesh position={[0, 0.002, 0.25]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[1.8, 0.04]} />
        <meshStandardMaterial color="#ffffff" roughness={0.5} />
      </mesh>

      {/* Chalk Bowling Crease / Return Crease */}
      <mesh position={[-0.9, 0.002, 0.55]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[0.04, 0.6]} />
        <meshStandardMaterial color="#ffffff" roughness={0.5} />
      </mesh>
      <mesh position={[0.9, 0.002, 0.55]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[0.04, 0.6]} />
        <meshStandardMaterial color="#ffffff" roughness={0.5} />
      </mesh>

      {/* Wooden Gully Wickets / Stumps behind Batsman */}
      <group position={[0, 0, -0.45]}>
        {[-0.08, 0, 0.08].map((x, i) => (
          <mesh key={`stump-${i}`} position={[x, 0.36, 0]} castShadow>
            <cylinderGeometry args={[0.016, 0.016, 0.72, 8]} />
            <meshStandardMaterial color="#d4a373" roughness={0.7} />
          </mesh>
        ))}
        {/* Horizontal Bails */}
        <mesh position={[-0.04, 0.725, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.007, 0.007, 0.09, 6]} />
          <meshStandardMaterial color="#faedcd" roughness={0.6} />
        </mesh>
        <mesh position={[0.04, 0.725, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.007, 0.007, 0.09, 6]} />
          <meshStandardMaterial color="#faedcd" roughness={0.6} />
        </mesh>
      </group>

      {/* Metric 1:1 Height Scale Laser Guide */}
      {showScaleRuler && (
        <group position={[-0.8, 0, 0]}>
          {/* Vertical Height Pole */}
          <mesh position={[0, 1.0, 0]}>
            <cylinderGeometry args={[0.006, 0.006, 2.0, 8]} />
            <meshStandardMaterial color="#64748b" roughness={0.3} metalness={0.8} />
          </mesh>
          {/* 1.76m Head Marker */}
          <mesh position={[0.1, 1.76, 0]}>
            <boxGeometry args={[0.2, 0.008, 0.02]} />
            <meshStandardMaterial color="#22c55e" emissive="#16a34a" emissiveIntensity={0.6} />
          </mesh>
          {/* 1.05m Waist/Scooter Marker */}
          <mesh position={[0.1, 1.05, 0]}>
            <boxGeometry args={[0.15, 0.008, 0.02]} />
            <meshStandardMaterial color="#eab308" emissive="#ca8a04" emissiveIntensity={0.5} />
          </mesh>
          {/* 0.71m Stump Marker */}
          <mesh position={[0.1, 0.71, 0]}>
            <boxGeometry args={[0.15, 0.008, 0.02]} />
            <meshStandardMaterial color="#ef4444" emissive="#dc2626" emissiveIntensity={0.5} />
          </mesh>
        </group>
      )}
    </group>
  );
};

export const CharacterStudio: React.FC<CharacterStudioProps> = ({
  characterConfig,
  lightingPreset,
  showReferenceVehicle,
  showScaleRuler,
  autoRotate,
  cameraPreset = 'full-body',
}) => {
  // Studio Mode: 'playable' (3rd-Person Character Controller) or 'inspect' (360 Turntable)
  const [mode, setMode] = useState<'playable' | 'inspect'>('playable');
  const [colliders, setColliders] = useState<CollisionCollider[]>([]);
  const [playerKey, setPlayerKey] = useState<number>(0);

  // Live Telemetry state for HUD
  const [telemetry, setTelemetry] = useState<PlayerTelemetry>({
    position: new THREE.Vector3(0, 0, 0),
    velocity: new THREE.Vector3(0, 0, 0),
    horizontalSpeed: 0,
    state: 'IDLE' as PlayerState,
    isGrounded: true,
    isOnSlope: false,
    slopeAngleDeg: 0,
    stamina: 100,
    facingAngle: 0,
  });

  const handleTelemetryUpdate = useCallback((t: PlayerTelemetry) => {
    setTelemetry(t);
  }, []);

  const handleResetPosition = () => {
    setPlayerKey((k) => k + 1);
  };

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
        return '#181a1f';
    }
  };

  const getStateBadgeColor = (st: PlayerState) => {
    switch (st) {
      case 'SPRINT':
        return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
      case 'RUN':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'WALK':
        return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
      case 'JUMP':
      case 'FALL':
        return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
      case 'CROUCH':
      case 'CROUCH_WALK':
        return 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30';
      case 'BATTING_SHOT':
        return 'bg-rose-500/20 text-rose-400 border-rose-500/30';
      default:
        return 'bg-slate-500/20 text-slate-300 border-slate-500/30';
    }
  };

  return (
    <div className="relative w-full h-full select-none">
      {/* TOP STUDIO MODE SELECTOR & STATUS BAR */}
      <div className="absolute top-4 left-6 z-20 flex items-center gap-3">
        <div className="bg-slate-900/85 backdrop-blur-md p-1 rounded-xl border border-slate-700/60 shadow-xl flex items-center gap-1">
          <button
            onClick={() => setMode('playable')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              mode === 'playable'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <Gamepad2 className="w-3.5 h-3.5" />
            🎮 Playable 3rd-Person Controller
          </button>
          <button
            onClick={() => setMode('inspect')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              mode === 'inspect'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            🔍 Inspection Studio
          </button>
        </div>

        {mode === 'playable' && (
          <button
            onClick={handleResetPosition}
            title="Reset Character Position (Spawn at pitch)"
            className="bg-slate-900/85 hover:bg-slate-800 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-700/60 text-xs font-medium text-slate-300 hover:text-white flex items-center gap-1.5 transition-all shadow-lg"
          >
            <RotateCcw className="w-3.5 h-3.5 text-blue-400" />
            Reset Spawn
          </button>
        )}
      </div>

      {/* PLAYABLE MODE: REAL-TIME CONTROLLER TELEMETRY HUD */}
      {mode === 'playable' && (
        <>
          {/* Top-Right Telemetry Dashboard */}
          <div className="absolute top-4 right-6 z-20 bg-slate-900/90 backdrop-blur-md p-3.5 rounded-2xl border border-slate-700/60 shadow-2xl flex flex-col gap-2.5 min-w-[240px]">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-blue-400 animate-pulse" />
                <span className="text-xs font-bold tracking-wider text-slate-200 uppercase">Kinematic Physics</span>
              </div>
              <span className={`px-2 py-0.5 rounded-md text-[11px] font-bold uppercase tracking-wider border ${getStateBadgeColor(telemetry.state)}`}>
                {telemetry.state.replace('_', ' ')}
              </span>
            </div>

            {/* Speed & Stamina Gauges */}
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="bg-slate-800/70 p-2 rounded-lg flex flex-col gap-0.5">
                <div className="flex items-center gap-1 text-[10px] text-slate-400 font-medium">
                  <Gauge className="w-3 h-3 text-cyan-400" /> Speed
                </div>
                <div className="text-sm font-bold text-slate-100">
                  {telemetry.horizontalSpeed.toFixed(1)} <span className="text-[10px] text-slate-400 font-normal">m/s</span>
                </div>
              </div>

              <div className="bg-slate-800/70 p-2 rounded-lg flex flex-col gap-0.5">
                <div className="flex items-center gap-1 text-[10px] text-slate-400 font-medium">
                  <Zap className="w-3 h-3 text-amber-400" /> Stamina
                </div>
                <div className="text-sm font-bold text-slate-100">
                  {Math.round(telemetry.stamina)}%
                </div>
              </div>
            </div>

            {/* Stamina Bar */}
            <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
              <div
                className="bg-gradient-to-r from-amber-500 to-emerald-400 h-full transition-all duration-75"
                style={{ width: `${telemetry.stamina}%` }}
              />
            </div>

            {/* Position & Ground Status */}
            <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1 border-t border-slate-800/80">
              <span>Pos: ({telemetry.position.x.toFixed(1)}, {telemetry.position.z.toFixed(1)})</span>
              <span className="flex items-center gap-1">
                <span className={`w-2 h-2 rounded-full ${telemetry.isGrounded ? 'bg-emerald-500' : 'bg-purple-500'}`} />
                {telemetry.isGrounded ? 'Grounded' : 'Airborne'}
              </span>
            </div>
          </div>

          {/* Bottom-Left Controls Keybinds Cheat Sheet */}
          <div className="absolute bottom-6 left-6 z-20 bg-slate-900/90 backdrop-blur-md p-3.5 rounded-2xl border border-slate-700/60 shadow-2xl flex flex-col gap-2 max-w-[280px]">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-200 uppercase tracking-wide border-b border-slate-800 pb-1.5">
              <Gamepad2 className="w-4 h-4 text-amber-400" /> Controls Guide
            </div>
            <div className="grid grid-cols-2 gap-x-3 gap-y-1.5 text-[11px]">
              <div className="flex items-center gap-1.5">
                <kbd className="px-1.5 py-0.5 bg-slate-800 border border-slate-700 rounded text-slate-200 font-mono text-[10px] font-bold">W A S D</kbd>
                <span className="text-slate-400">Move</span>
              </div>
              <div className="flex items-center gap-1.5">
                <kbd className="px-1.5 py-0.5 bg-slate-800 border border-slate-700 rounded text-slate-200 font-mono text-[10px] font-bold">Shift</kbd>
                <span className="text-slate-400">Sprint (7.4m/s)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <kbd className="px-1.5 py-0.5 bg-slate-800 border border-slate-700 rounded text-slate-200 font-mono text-[10px] font-bold">Space</kbd>
                <span className="text-slate-400">Jump</span>
              </div>
              <div className="flex items-center gap-1.5">
                <kbd className="px-1.5 py-0.5 bg-slate-800 border border-slate-700 rounded text-slate-200 font-mono text-[10px] font-bold">Ctrl / C</kbd>
                <span className="text-slate-400">Crouch</span>
              </div>
              <div className="flex items-center gap-1.5">
                <kbd className="px-1.5 py-0.5 bg-slate-800 border border-slate-700 rounded text-slate-200 font-mono text-[10px] font-bold">E / Click</kbd>
                <span className="text-slate-400">Cricket Swing</span>
              </div>
              <div className="flex items-center gap-1.5">
                <kbd className="px-1.5 py-0.5 bg-slate-800 border border-slate-700 rounded text-slate-200 font-mono text-[10px] font-bold">Mouse</kbd>
                <span className="text-slate-400">Look / Orbit</span>
              </div>
            </div>
          </div>
        </>
      )}

      {/* 3D WEBGL CANVAS */}
      <div className="canvas-container w-full h-full">
        <Canvas
          shadows
          camera={
            mode === 'playable'
              ? { position: [0, 2.0, 4.0], fov: 46 }
              : { position: [2.6, 1.5, 3.0], fov: 38 }
          }
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

            {/* PLAYABLE 3RD PERSON CONTROLLER & GULLY ARENA */}
            {mode === 'playable' ? (
              <>
                {/* Gully Environment with Step Climbs, Slopes, Houses, Vehicles */}
                <GullyTestArena onCollidersReady={setColliders} />

                {/* 3rd Person Player Character Controller */}
                <Player
                  key={`player-${playerKey}`}
                  initialPosition={[0, 0, 0]}
                  appearance={{
                    skinTone: characterConfig.skinTone,
                    hairColor: characterConfig.hairColor,
                    jerseyColor: characterConfig.jerseyColor,
                    jerseyAccentColor: characterConfig.jerseyAccentColor,
                    jerseyNumber: characterConfig.jerseyNumber,
                    shortsColor: characterConfig.shortsColor,
                    shoesColor: characterConfig.shoesColor,
                    hasCap: characterConfig.hasCap,
                    hasGloves: characterConfig.hasGloves,
                    hasWristBand: characterConfig.hasWristBand,
                    hasBat: true,
                    batWoodTone: characterConfig.batWoodTone,
                  }}
                  colliders={colliders}
                  onTelemetryUpdate={handleTelemetryUpdate}
                  enabled={true}
                />
              </>
            ) : (
              /* INSPECTION STUDIO 360 TURNTABLE MODE */
              <>
                <PitchGround showScaleRuler={showScaleRuler} />

                <GullyCricketPlayer config={characterConfig} position={[0, 0, 0]} />

                {showReferenceVehicle && (
                  <group position={[1.4, 0, -0.4]} rotation={[0, -0.3, 0]}>
                    <BajajChetakScooter />
                  </group>
                )}

                <CricketBallThrower enabled={true} />

                <CharacterCameraController
                  preset={cameraPreset}
                  autoRotate={autoRotate}
                />

                <GizmoHelper alignment="bottom-right" margin={[60, 60]}>
                  <GizmoViewport axisColors={['#ef4444', '#22c55e', '#3b82f6']} labelColor="#ffffff" />
                </GizmoHelper>
              </>
            )}
          </Suspense>
        </Canvas>
      </div>
    </div>
  );
};
