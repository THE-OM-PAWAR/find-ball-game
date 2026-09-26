import React, { Suspense, useState, useRef, useEffect, useCallback } from 'react';
import { Canvas } from '@react-three/fiber';
import * as THREE from 'three';
import { Player } from '../../components/player/Player';
import { Dog } from '../../components/dog/Dog';
import { throwDistractionItem } from '../../components/dog/DogInteraction';
import { emitNoise } from '../../components/dog/DogPerception';
import type { DogConfig, DogTelemetry,} from '../../components/dog/DogTypes';
import { DEFAULT_DOG_CONFIG } from '../../components/dog/DogTypes';
import type { PlayerTelemetry } from '../../components/player/PlayerTypes';
import { StudioLighting, type LightingPreset } from './3d/environment/StudioLighting';
import { SingleStoryStairHouse } from './3d/houses/SingleStoryStairHouse';
import { LargeTree, SmallTree, Bush, PottedPlant } from './3d/NatureProps';
import { buildSingleStoryHouseColliders, createBoundaryWallColliders } from './3d/collision/HouseColliders';
import { DEFAULT_STAIR_CONFIG } from '../data/studioDefaultConfigs';

interface DogStudioProps {
  lightingPreset: LightingPreset;
  dogConfig?: Partial<DogConfig>;
  showDebug?: boolean;
}

export const DogStudio: React.FC<DogStudioProps> = ({
  lightingPreset = 'afternoon',
  dogConfig: userConfig,
  showDebug = true,
}) => {
  const [playerTelemetry, setPlayerTelemetry] = useState<PlayerTelemetry | null>(null);
  const [dogTelemetry, setDogTelemetry] = useState<DogTelemetry | null>(null);
  const [isAlert, setIsAlert] = useState<boolean>(false);
  const [, _setBiscuitsThrown] = useState<number>(0);
  const [missionNotice, setMissionNotice] = useState<string | null>(null);

  // Merge Config
  const config: DogConfig = {
    ...DEFAULT_DOG_CONFIG,
    ...userConfig,
    patrolPoints: userConfig?.patrolPoints || [
      { position: [2.5, 0, 1.5], waitTime: 2.0 },
      { position: [-2.5, 0, 1.5], waitTime: 2.0 },
      { position: [-2.5, 0, -2.5], waitTime: 2.0 },
      { position: [2.5, 0, -2.5], waitTime: 2.0 },
    ],
  };

  // Build Environment Colliders (Houses, boundary walls, courtyard barriers)
  const colliders = React.useMemo(() => {
    const list: any[] = [];
    // Boundary walls around 20m x 20m arena
    list.push(...createBoundaryWallColliders(20, 20, 2.8, 0.4));
    // House 1 Colliders (North-West)
    list.push(...buildSingleStoryHouseColliders([-4.5, 0, -4.5], 0));
    return list;
  }, []);

  // Throw Biscuit Function
  const handleThrowBiscuit = useCallback(() => {
    if (!playerTelemetry) {
      throwDistractionItem([0, 0.5, 0], [0, 0, -1], 'biscuit', 7.5);
    } else {
      // Throw forward in player facing direction
      const dir = new THREE.Vector3(
        Math.sin(playerTelemetry.facingAngle),
        0.3,
        Math.cos(playerTelemetry.facingAngle)
      ).normalize();

      throwDistractionItem(playerTelemetry.position, dir, 'biscuit', 7.8);
    }
    _setBiscuitsThrown((prev) => prev + 1);
  }, [playerTelemetry]);

  // Keyboard shortcut: Press 'B' to throw biscuit
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'b' || e.key === 'B') {
        handleThrowBiscuit();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [handleThrowBiscuit]);

  // Player noise emitter on movement
  const lastEmitTime = useRef<number>(0);
  const handlePlayerTelemetry = useCallback((telemetry: PlayerTelemetry) => {
    setPlayerTelemetry(telemetry);

    // Emit movement noise periodically
    const now = performance.now();
    if (now - lastEmitTime.current > 350) {
      lastEmitTime.current = now;

      if (telemetry.state === 'SPRINT') {
        emitNoise(telemetry.position, 12.0, 1.0, 'player_sprint');
      } else if (telemetry.state === 'RUN') {
        emitNoise(telemetry.position, 7.5, 0.65, 'player_run');
      } else if (telemetry.state === 'WALK') {
        emitNoise(telemetry.position, 4.0, 0.35, 'player_walk');
      } else if (telemetry.state === 'CROUCH_WALK') {
        emitNoise(telemetry.position, 2.0, 0.1, 'player_walk');
      }
    }
  }, []);

  // Handle Dog Telemetry
  const handleDogTelemetry = useCallback((telemetry: DogTelemetry) => {
    setDogTelemetry(telemetry);

    // If dog is alert and catches player (distance < 1.4m)
    if (telemetry.state === 'ALERT' && telemetry.distanceToPlayer < 1.4) {
      setMissionNotice('⚠️ CAUGHT BY DOG! SNEAK CROUCHING OR THROW BISCUITS (KEY [B])');
      setTimeout(() => setMissionNotice(null), 3000);
    }
  }, []);

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      {/* 3D WEBGL CANVAS */}
      <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}>
        <Canvas
          shadows
          camera={{ position: [0, 2.5, 5.0], fov: 48 }}
          gl={{
            antialias: true,
            alpha: true,
            preserveDrawingBuffer: true,
            toneMapping: THREE.ACESFilmicToneMapping,
            toneMappingExposure: 1.15,
          }}
        >
          <color attach="background" args={['#e0d7c7']} />

          <Suspense fallback={null}>
            <StudioLighting preset={lightingPreset} />

            {/* 20m x 20m Gully Courtyard Ground */}
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.002, 0]} receiveShadow>
              <planeGeometry args={[20, 20]} />
              <meshStandardMaterial color="#cbbba8" roughness={0.88} />
            </mesh>
            <gridHelper args={[20, 20, '#b8a690', '#d8ccbe']} position={[0, 0.001, 0]} />

            {/* Boundary Courtyard Walls */}
            <group position={[0, 0, 0]}>
              <mesh position={[0, 1.2, -10]} receiveShadow castShadow>
                <boxGeometry args={[20, 2.4, 0.4]} />
                <meshStandardMaterial color="#d4c5b3" roughness={0.9} />
              </mesh>
              <mesh position={[0, 1.2, 10]} receiveShadow castShadow>
                <boxGeometry args={[20, 2.4, 0.4]} />
                <meshStandardMaterial color="#d4c5b3" roughness={0.9} />
              </mesh>
              <mesh position={[-10, 1.2, 0]} receiveShadow castShadow>
                <boxGeometry args={[0.4, 2.4, 20]} />
                <meshStandardMaterial color="#d4c5b3" roughness={0.9} />
              </mesh>
              <mesh position={[10, 1.2, 0]} receiveShadow castShadow>
                <boxGeometry args={[0.4, 2.4, 20]} />
                <meshStandardMaterial color="#d4c5b3" roughness={0.9} />
              </mesh>
            </group>

            {/* Indian House 1 (North-West Bungalow obstacle) */}
            <SingleStoryStairHouse
              position={[-4.5, 0, -4.5]}
              rotation={[0, 0, 0]}
              config={{ ...DEFAULT_STAIR_CONFIG, hasFrontGarden: false }}
            />

            {/* Courtyard Nature Props & Cover */}
            <LargeTree position={[6.5, 0, -5.5]} scale={0.95} hasFlowers={true} />
            <SmallTree position={[-7.5, 0, 3.5]} variant="neem" />
            <Bush position={[2.5, 0, 5.0]} variant="flowering_bougainvillea" scale={1.1} />
            <PottedPlant position={[0.5, 0, -4.5]} plantType="tulsi" potStyle="tulsi_vrindavan" />
            <PottedPlant position={[2.2, 0, -4.5]} plantType="flowering_hibiscus" potStyle="ceramic_blue" />

            {/* --- DOG GAMEPLAY AGENT --- */}
            <Dog
              initialPosition={[2.5, 0, 0]}
              config={config}
              playerTelemetry={playerTelemetry}
              colliders={colliders}
              showDebug={showDebug}
              onTelemetryUpdate={handleDogTelemetry}
              onAlertStateChange={setIsAlert}
              enabled={true}
            />

            {/* --- PLAYER CHARACTER (Third-Person Controller) --- */}
            <Player
              initialPosition={[0, 0, 6.0]}
              colliders={colliders}
              onTelemetryUpdate={handlePlayerTelemetry}
              showColliderDebug={false}
              enabled={true}
            />
          </Suspense>
        </Canvas>
      </div>

      {/* --- HUD OVERLAYS & GAMEPLAY UI --- */}
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
        {/* Detection & State Card */}
        <div
          style={{
            background: 'rgba(15, 23, 42, 0.88)',
            backdropFilter: 'blur(8px)',
            border: `1px solid ${isAlert ? '#ef4444' : '#334155'}`,
            borderRadius: '10px',
            padding: '12px 16px',
            color: '#f8fafc',
            fontFamily: 'Inter, sans-serif',
            minWidth: '220px',
            boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
            <span style={{ fontSize: '11px', fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              🐕 Guard Dog AI
            </span>
            <span
              style={{
                fontSize: '11px',
                fontWeight: 700,
                padding: '2px 8px',
                borderRadius: '12px',
                backgroundColor:
                  dogTelemetry?.state === 'ALERT'
                    ? '#ef4444'
                    : dogTelemetry?.state === 'DISTRACTED'
                    ? '#06b6d4'
                    : dogTelemetry?.state === 'SUSPICIOUS' || dogTelemetry?.state === 'INVESTIGATING'
                    ? '#eab308'
                    : '#22c55e',
                color: '#fff',
              }}
            >
              {dogTelemetry?.state || 'PATROLLING'}
            </span>
          </div>

          {/* Detection Meter Bar */}
          <div style={{ marginBottom: '6px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', marginBottom: '3px' }}>
              <span style={{ color: '#cbd5e1' }}>Detection Awareness</span>
              <span style={{ fontWeight: 700, color: isAlert ? '#ef4444' : '#f59e0b' }}>
                {Math.round(dogTelemetry?.detection || 0)}%
              </span>
            </div>
            <div style={{ width: '100%', height: '6px', background: '#334155', borderRadius: '3px', overflow: 'hidden' }}>
              <div
                style={{
                  width: `${dogTelemetry?.detection || 0}%`,
                  height: '100%',
                  background: isAlert ? 'linear-gradient(90deg, #f59e0b, #ef4444)' : '#22c55e',
                  transition: 'width 0.15s ease',
                }}
              />
            </div>
          </div>

          <div style={{ fontSize: '11px', color: '#94a3b8', display: 'flex', gap: '12px' }}>
            <span>👀 Sight: {dogTelemetry?.isSeeingPlayer ? '🔴 VISIBLE' : '🟢 HIDDEN'}</span>
            <span>👂 Hear: {dogTelemetry?.isHearingPlayer ? '🟠 HEARD' : '🟢 QUIET'}</span>
          </div>
        </div>

        {/* Quick Throw Biscuit Action Button */}
        <button
          onClick={handleThrowBiscuit}
          style={{
            pointerEvents: 'auto',
            background: 'linear-gradient(135deg, #f59e0b, #d97706)',
            border: 'none',
            borderRadius: '8px',
            padding: '10px 16px',
            color: '#ffffff',
            fontWeight: 700,
            fontSize: '13px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            boxShadow: '0 4px 14px rgba(217, 119, 6, 0.4)',
            transition: 'transform 0.1s ease',
          }}
          onMouseDown={(e) => (e.currentTarget.style.transform = 'scale(0.96)')}
          onMouseUp={(e) => (e.currentTarget.style.transform = 'scale(1.0)')}
        >
          <span>🦴 Throw Parle-G Biscuit</span>
          <span style={{ background: 'rgba(0,0,0,0.2)', padding: '2px 6px', borderRadius: '4px', fontSize: '11px' }}>
            Key [B]
          </span>
        </button>
      </div>

      {/* Alert Banner */}
      {missionNotice && (
        <div
          style={{
            position: 'absolute',
            top: '20px',
            left: '50%',
            transform: 'translateX(-50%)',
            background: 'rgba(239, 68, 68, 0.95)',
            color: '#ffffff',
            fontWeight: 700,
            fontSize: '14px',
            padding: '10px 24px',
            borderRadius: '8px',
            zIndex: 20,
            boxShadow: '0 8px 24px rgba(239, 68, 68, 0.5)',
            pointerEvents: 'none',
          }}
        >
          {missionNotice}
        </div>
      )}

      {/* Bottom Controls Hint */}
      <div className="viewport-overlay-hint">
        <span>Click inside to lock mouse • <kbd>W A S D</kbd> Move • <kbd>Ctrl</kbd> Crouch Sneak • <kbd>Shift</kbd> Sprint • <kbd>B</kbd> Throw Biscuit Distraction</span>
      </div>
    </div>
  );
};
