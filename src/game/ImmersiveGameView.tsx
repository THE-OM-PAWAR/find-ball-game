import React, { Suspense, useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import * as THREE from 'three';
import { GullyLevelMap } from '../map/GullyLevelMap';
import { Player } from '../components/player/Player';
import { getLevel1MapColliders } from '../map/data/mapLayoutData';

/**
 * 100% Immersive Fullscreen Indian Gully Game View
 * Zero UI, zero overlays, immediate gameplay with 60 FPS performance
 */
export const ImmersiveGameView: React.FC = () => {
  // Precompute colliders once for optimal runtime performance
  const mapColliders = useMemo(() => getLevel1MapColliders(), []);

  // Player initial spawn in south central gully corridor facing north
  const initialSpawn: [number, number, number] = [0, 0.2, 14];

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
        cursor: 'crosshair',
      }}
    >
      <Canvas
        shadows
        camera={{ position: [0, 1.8, 17.5], fov: 54 }}
        dpr={[1, 1.5]}
        gl={{
          antialias: true,
          alpha: false,
          powerPreference: 'high-performance',
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
            lightingPreset="afternoon"
            includeAtmosphere={true}
          />

          {/* Active 3D Player Character with Full WASD + Mouse Look Controller */}
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
        </Suspense>
      </Canvas>
    </div>
  );
};

export default ImmersiveGameView;
