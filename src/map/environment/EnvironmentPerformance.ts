/**
 * Production Environment Performance & Atmosphere Configuration
 */

export type LightingPreset = 'afternoon' | 'sunset' | 'monsoon' | 'night';

export interface EnvironmentConfig {
  fogColor: string;
  fogNear: number;
  fogFar: number;
  fogDensity: number;
  sunPosition: [number, number, number];
  sunColor: string;
  sunIntensity: number;
  ambientColor: string;
  ambientIntensity: number;
  skyTurbidity: number;
  skyRayleigh: number;
  skyMieCoefficient: number;
  skyMieDirectionalG: number;
  skyElevation: number;
  skyAzimuth: number;
  exposure: number;
}

export const ATMOSPHERE_PRESETS: Record<LightingPreset, EnvironmentConfig> = {
  afternoon: {
    fogColor: '#c8dded',
    fogNear: 35,
    fogFar: 220,
    fogDensity: 0.0055,
    sunPosition: [-32, 48, 26],
    sunColor: '#fffbeb',
    sunIntensity: 2.85,
    ambientColor: '#dbeafe',
    ambientIntensity: 0.82,
    skyTurbidity: 3.2,
    skyRayleigh: 1.6,
    skyMieCoefficient: 0.004,
    skyMieDirectionalG: 0.84,
    skyElevation: 52,
    skyAzimuth: 145,
    exposure: 1.12,
  },
  sunset: {
    fogColor: '#fbcfe8',
    fogNear: 25,
    fogFar: 180,
    fogDensity: 0.007,
    sunPosition: [-45, 14, 20],
    sunColor: '#fb923c',
    sunIntensity: 2.9,
    ambientColor: '#fed7aa',
    ambientIntensity: 0.75,
    skyTurbidity: 6.5,
    skyRayleigh: 2.8,
    skyMieCoefficient: 0.008,
    skyMieDirectionalG: 0.88,
    skyElevation: 12,
    skyAzimuth: 155,
    exposure: 1.05,
  },
  monsoon: {
    fogColor: '#94a3b8',
    fogNear: 20,
    fogFar: 150,
    fogDensity: 0.009,
    sunPosition: [-15, 42, 15],
    sunColor: '#cbd5e1',
    sunIntensity: 1.6,
    ambientColor: '#94a3b8',
    ambientIntensity: 0.95,
    skyTurbidity: 8.5,
    skyRayleigh: 0.8,
    skyMieCoefficient: 0.012,
    skyMieDirectionalG: 0.75,
    skyElevation: 45,
    skyAzimuth: 140,
    exposure: 1.0,
  },
  night: {
    fogColor: '#090d16',
    fogNear: 15,
    fogFar: 120,
    fogDensity: 0.012,
    sunPosition: [-25, 40, -25],
    sunColor: '#60a5fa',
    sunIntensity: 0.35,
    ambientColor: '#1e1b4b',
    ambientIntensity: 0.3,
    skyTurbidity: 1.5,
    skyRayleigh: 0.3,
    skyMieCoefficient: 0.002,
    skyMieDirectionalG: 0.9,
    skyElevation: 5,
    skyAzimuth: 220,
    exposure: 0.9,
  },
};

export const DEFAULT_ATMOSPHERE_CONFIG = ATMOSPHERE_PRESETS.afternoon;

// Indian Town Plaster Color Palette for Background Buildings
export const BACKGROUND_BUILDING_COLORS = [
  '#e2d9cc', // Pale Sandstone Cream
  '#d5c3b2', // Weathered Warm Plaster
  '#cbd5e1', // Cool Grey Wash
  '#d8b4a0', // Terracotta Peach
  '#c7d2fe', // Faded Sky Blue Wall
  '#fde68a', // Light Mustard Yellow
  '#bbf7d0', // Faded Pista Green
  '#94a3b8', // Unplastered Concrete Block
];

// Rooftop Detail Colors
export const ROOFTOP_COLORS = {
  waterTankBlack: '#0f172a',
  waterTankBlue: '#1e3a8a',
  brickParapet: '#991b1b',
  dishAntenna: '#e2e8f0',
  acCompressor: '#cbd5e1',
};
