import React from 'react';
import { SkySystem } from './SkySystem';
import { SunLighting } from './SunLighting';
import { BackgroundCity } from './BackgroundCity';
import { WorldBoundary } from './WorldBoundary';
import { ATMOSPHERE_PRESETS, type LightingPreset, type EnvironmentConfig } from './EnvironmentPerformance';

interface WorldAtmosphereProps {
  preset?: LightingPreset;
  config?: Partial<EnvironmentConfig>;
  enableBackgroundCity?: boolean;
  enableShadows?: boolean;
}

/**
 * Master World Atmosphere & Environment Layer
 * Upgrades Level 1 into a production-grade outdoor Indian township scene
 */
export const WorldAtmosphere: React.FC<WorldAtmosphereProps> = ({
  preset = 'afternoon',
  config: customConfig,
  enableBackgroundCity = true,
  enableShadows = true,
}) => {
  const baseConfig = ATMOSPHERE_PRESETS[preset] || ATMOSPHERE_PRESETS.afternoon;
  const config = {
    ...baseConfig,
    ...customConfig,
  };

  return (
    <group name="world-atmosphere-layer">
      {/* 1. Atmospheric Perspective Linear Distance Fog (matching sky horizon tint) */}
      <fog attach="fog" args={[config.fogColor, config.fogNear, config.fogFar]} />

      {/* 2. Procedural Rayleigh Scattering Sky Dome with Soft Clouds */}
      <SkySystem
        turbidity={config.skyTurbidity}
        rayleigh={config.skyRayleigh}
        mieCoefficient={config.skyMieCoefficient}
        mieDirectionalG={config.skyMieDirectionalG}
        elevation={config.skyElevation}
        azimuth={config.skyAzimuth}
      />

      {/* 3. Production Sunlight & Ambient Fill */}
      <SunLighting
        sunPosition={config.sunPosition}
        sunColor={config.sunColor}
        sunIntensity={config.sunIntensity}
        ambientColor={config.ambientColor}
        ambientIntensity={config.ambientIntensity}
        enableShadows={enableShadows}
      />

      {/* 4. Extended Ground Substrate & Outgoing Roadways */}
      <WorldBoundary />

      {/* 5. 360-Degree Background Indian City Layer */}
      {enableBackgroundCity && <BackgroundCity />}
    </group>
  );
};
