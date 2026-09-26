import React from 'react';
import { DEFAULT_ATMOSPHERE_CONFIG } from './EnvironmentPerformance';

interface SunLightingProps {
  sunPosition?: [number, number, number];
  sunColor?: string;
  sunIntensity?: number;
  ambientColor?: string;
  ambientIntensity?: number;
  enableShadows?: boolean;
}

/**
 * Production-Grade Daylight Sun Lighting & Ambient Environment System
 * Provides clean cascading shadows across gully alleys and rooftops
 */
export const SunLighting: React.FC<SunLightingProps> = ({
  sunPosition = DEFAULT_ATMOSPHERE_CONFIG.sunPosition,
  sunColor = DEFAULT_ATMOSPHERE_CONFIG.sunColor,
  sunIntensity = DEFAULT_ATMOSPHERE_CONFIG.sunIntensity,
  ambientColor = DEFAULT_ATMOSPHERE_CONFIG.ambientColor,
  ambientIntensity = DEFAULT_ATMOSPHERE_CONFIG.ambientIntensity,
  enableShadows = true,
}) => {
  return (
    <group name="sun-lighting-system">
      {/* 1. Primary Directional Sun Light with Cascading Soft Shadows */}
      <directionalLight
        position={sunPosition}
        intensity={sunIntensity}
        color={sunColor}
        castShadow={enableShadows}
        shadow-mapSize={[2048, 2048]}
        shadow-camera-near={10}
        shadow-camera-far={130}
        shadow-camera-left={-28}
        shadow-camera-right={28}
        shadow-camera-top={28}
        shadow-camera-bottom={-28}
        shadow-bias={-0.00015}
        shadow-radius={1.5}
      />

      {/* 2. Natural Hemisphere Light (Sky Blue to Warm Earth Dust Bounce) */}
      <hemisphereLight
        color={ambientColor}
        groundColor="#8c7853"
        intensity={ambientIntensity}
      />

      {/* 3. Subtle Fill Light from Opposite Horizon (Simulating Atmospheric Ambient Bounce) */}
      <directionalLight
        position={[25, 18, -25]}
        intensity={0.45}
        color="#c7d2fe"
      />
    </group>
  );
};
