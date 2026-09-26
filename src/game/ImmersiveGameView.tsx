import React, { Suspense, useMemo, useState, useCallback } from 'react';
import { Canvas } from '@react-three/fiber';
import * as THREE from 'three';
import { GullyLevelMap } from '../map/GullyLevelMap';
import { Player } from '../components/player/Player';
import { getLevel1MapColliders } from '../map/data/mapLayoutData';
import { LoadingScreen } from './LoadingScreen';
import { GameControlsOverlay } from './GameControlsOverlay';
import { DesynchronizedOverlay } from './DesynchronizedOverlay';
import { GameCompletionModal } from './GameCompletionModal';
import { BallPickupCinematicOverlay } from './BallPickupCinematicOverlay';
import { IntroSequence } from '../cinematic/IntroSequence';

export type GameState = 'loading' | 'cinematic' | 'gameplay';

/**
 * 100% Immersive Fullscreen Indian Gully Game View
 * With production loading screen, 3D cinematic opening sequence, and 60 FPS gameplay
 */
export const ImmersiveGameView: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>('loading');

  // Precompute colliders once for optimal runtime performance
  const mapColliders = useMemo(() => getLevel1MapColliders(), []);

  // Player initial spawn in south central gully corridor facing north
  const initialSpawn: [number, number, number] = [0, 0.2, 14];

  const handleStartFromLoading = useCallback(() => {
    setGameState('cinematic');
  }, []);

  const handleCinematicComplete = useCallback(() => {
    setGameState('gameplay');
  }, []);

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        background: '#090d16',
        overflow: 'hidden',
        userSelect: 'none',
        cursor: gameState === 'gameplay' ? 'crosshair' : 'default',
      }}
    >
      {/* 1. Production Loading Screen & Title Intro */}
      {gameState === 'loading' && (
        <LoadingScreen onStartGame={handleStartFromLoading} />
      )}

      {/* 2. In-Game HUD Overlays during active gameplay */}
      {gameState === 'gameplay' && (
        <>
          <GameControlsOverlay />
          <DesynchronizedOverlay />
          <GameCompletionModal />
          <BallPickupCinematicOverlay />
        </>
      )}

      {/* 3. Main 3D WebGL Canvas */}
      <Canvas
        shadows
        camera={{ position: [0, 8.5, 22.0], fov: 54 }}
        dpr={[1, Math.min(typeof window !== 'undefined' ? window.devicePixelRatio : 1, 1.75)]}
        gl={{
          antialias: true,
          alpha: false,
          powerPreference: 'high-performance',
          stencil: false,
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.12,
        }}
      >
        <Suspense fallback={null}>
          {/* Production 50m x 50m Indian Gully Map with 360° Sky, Clouds & Background City */}
          <GullyLevelMap
            showWaypoints={false}
            showZoneLabels={false}
            showPitchMarkings={true}
            showCheckpoints={gameState === 'gameplay'}
            lightingPreset="afternoon"
            includeAtmosphere={true}
          />

          {/* Phase 5: Cinematic Intro Sequence */}
          {gameState === 'cinematic' && (
            <IntroSequence onComplete={handleCinematicComplete} />
          )}

          {/* Active Gameplay Player Character */}
          {gameState === 'gameplay' && (
            <Player
              initialPosition={initialSpawn}
              colliders={mapColliders}
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
        </Suspense>
      </Canvas>
    </div>
  );
};

export default ImmersiveGameView;


