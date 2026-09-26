import { useState, useMemo, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import type { HouseType, RenderStyle } from '../components/HouseStudio';
import type { VehicleType, VehicleCameraPreset } from '../components/VehicleStudio';
import type { LightingPreset } from '../components/3d/environment/StudioLighting';
import {
  DEFAULT_PLAYER_PARAMS,
  DEFAULT_CAMERA_PARAMS,
  type PlayerControllerParams,
  type ThirdPersonCameraParams,
} from '../../components/player/PlayerTypes';

import {
  DEFAULT_SCOOTER_CONFIG,
  DEFAULT_MOTORCYCLE_CONFIG,
  DEFAULT_BICYCLE_CONFIG,
  DEFAULT_AUTO_CONFIG,
  DEFAULT_CAR_CONFIG,
  DEFAULT_PUSH_CART_CONFIG,
  DEFAULT_HAND_CART_CONFIG,
  DEFAULT_GARBAGE_CONFIG,
  DEFAULT_STAIR_CONFIG,
  DEFAULT_BOX2_CONFIG,
  DEFAULT_BOX3_CONFIG,
  DEFAULT_SHOP2_CONFIG,
  DEFAULT_SHOP3_CONFIG,
  DEFAULT_MODERN_CONFIG,
  DEFAULT_TERRACE_CONFIG,
} from '../data/studioDefaultConfigs';

export function useStudioState() {
  const location = useLocation();

  const pathParts = location.pathname.split('/');
  const rawCategory = pathParts[2] || 'houses';
  const isPlayerView = rawCategory === 'player';
  const isVehicleView = rawCategory === 'bikes' || rawCategory === 'props';
  const activeCategory = isPlayerView ? 'player' : isVehicleView ? 'bikes' : rawCategory;

  const [searchQuery, setSearchQuery] = useState<string>('');
  const [inspectorOpen, setInspectorOpen] = useState<boolean>(true);

  // Active 3D Player Playground State
  const [playerParams, setPlayerParams] = useState<Partial<PlayerControllerParams>>(DEFAULT_PLAYER_PARAMS);
  const [cameraParams, setCameraParams] = useState<Partial<ThirdPersonCameraParams>>(DEFAULT_CAMERA_PARAMS);
  const [showColliderDebug, setShowColliderDebug] = useState<boolean>(false);

  // Active 3D House State
  const [houseType, setHouseType] = useState<HouseType>('shop-2story');
  // Active 3D Vehicle & Street Prop State
  const [vehicleType, setVehicleType] = useState<VehicleType>('scooter');

  const [lightingPreset, setLightingPreset] = useState<LightingPreset>('afternoon');
  const [renderStyle] = useState<RenderStyle>('textured');
  const [cameraPreset, setCameraPreset] = useState<VehicleCameraPreset>('reference');
  const [autoRotate, setAutoRotate] = useState<boolean>(false);
  const [ballThrows, setBallThrows] = useState<number>(0);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);

  // Vehicle Configs
  const [scooterConfig, setScooterConfig] = useState(DEFAULT_SCOOTER_CONFIG);
  const [motorcycleConfig, setMotorcycleConfig] = useState(DEFAULT_MOTORCYCLE_CONFIG);
  const [bicycleConfig, setBicycleConfig] = useState(DEFAULT_BICYCLE_CONFIG);
  const [autoConfig, setAutoConfig] = useState(DEFAULT_AUTO_CONFIG);
  const [carConfig, setCarConfig] = useState(DEFAULT_CAR_CONFIG);
  const [pushCartConfig, setPushCartConfig] = useState(DEFAULT_PUSH_CART_CONFIG);
  const [handCartConfig, setHandCartConfig] = useState(DEFAULT_HAND_CART_CONFIG);
  const [garbageConfig, setGarbageConfig] = useState(DEFAULT_GARBAGE_CONFIG);

  // House Configs
  const [stairConfig, setStairConfig] = useState(DEFAULT_STAIR_CONFIG);
  const [box2Config, setBox2Config] = useState(DEFAULT_BOX2_CONFIG);
  const [box3Config, setBox3Config] = useState(DEFAULT_BOX3_CONFIG);
  const [shop2Config, setShop2Config] = useState(DEFAULT_SHOP2_CONFIG);
  const [shop3Config, setShop3Config] = useState(DEFAULT_SHOP3_CONFIG);
  const [modernConfig, setModernConfig] = useState(DEFAULT_MODERN_CONFIG);
  const [houseConfig, setHouseConfig] = useState(DEFAULT_TERRACE_CONFIG);

  // Apply colors to the currently active model
  const applyPresetColors = useCallback((wall: string, accent: string, trim: string) => {
    switch (houseType) {
      case 'shop-2story':
        setShop2Config((prev) => ({ ...prev, wallColor: wall, accentColor: accent, trimColor: trim }));
        break;
      case 'shop-3story':
        setShop3Config((prev) => ({ ...prev, wallColor: wall, accentColor: accent, trimColor: trim }));
        break;
      case 'box-2story':
        setBox2Config((prev) => ({ ...prev, wallColor: wall, accentColor: accent, trimColor: trim }));
        break;
      case 'box-3story':
        setBox3Config((prev) => ({ ...prev, wallColor: wall, accentColor: accent, trimColor: trim }));
        break;
      case 'stair-bungalow':
        setStairConfig((prev) => ({ ...prev, wallColor: wall, accentColor: accent, trimColor: trim }));
        break;
      case 'modern-villa':
        setModernConfig((prev) => ({ ...prev, mainColor: wall, accentColor: accent, frameColor: trim }));
        break;
      case 'terrace':
        setHouseConfig((prev) => ({ ...prev, wallColor: wall }));
        break;
    }
  }, [houseType]);

  const applyVehiclePresetColor = useCallback((mainColor: string, subColor: string) => {
    switch (vehicleType) {
      case 'scooter':
        setScooterConfig((prev) => ({ ...prev, bodyColor: mainColor, seatColor: subColor }));
        break;
      case 'motorcycle':
        setMotorcycleConfig((prev) => ({ ...prev, tankColor: mainColor, seatColor: subColor }));
        break;
      case 'bicycle':
        setBicycleConfig((prev) => ({ ...prev, frameColor: mainColor }));
        break;
      case 'auto-rickshaw':
        setAutoConfig((prev) => ({ ...prev, bodyColor: mainColor, roofColor: subColor }));
        break;
      case 'parked-car':
        setCarConfig((prev) => ({ ...prev, bodyColor: mainColor }));
        break;
    }
  }, [vehicleType]);

  // Get current active colors
  const currentColors = useMemo(() => {
    switch (houseType) {
      case 'shop-2story':
        return { wall: shop2Config.wallColor, accent: shop2Config.accentColor, trim: shop2Config.trimColor };
      case 'shop-3story':
        return { wall: shop3Config.wallColor, accent: shop3Config.accentColor, trim: shop3Config.trimColor };
      case 'box-2story':
        return { wall: box2Config.wallColor, accent: box2Config.accentColor, trim: box2Config.trimColor };
      case 'box-3story':
        return { wall: box3Config.wallColor, accent: box3Config.accentColor, trim: box3Config.trimColor };
      case 'stair-bungalow':
        return { wall: stairConfig.wallColor, accent: stairConfig.accentColor, trim: stairConfig.trimColor || '#f8fafc' };
      case 'modern-villa':
        return { wall: modernConfig.mainColor, accent: modernConfig.accentColor, trim: modernConfig.frameColor };
      case 'terrace':
      default:
        return { wall: houseConfig.wallColor, accent: '#3b5266', trim: '#ffffff' };
    }
  }, [houseType, shop2Config, shop3Config, box2Config, box3Config, stairConfig, modernConfig, houseConfig]);

  const handleThrowBall = useCallback(() => {
    setBallThrows((prev) => prev + 1);
    const event = new CustomEvent('throw-cricket-ball', {
      detail: {
        x: (Math.random() - 0.5) * 2.0,
        y: 1.0 + Math.random() * 0.6,
        z: -0.8,
      },
    });
    window.dispatchEvent(event);
  }, []);

  const getModelTitle = useCallback((): string => {
    if (isPlayerView) {
      return 'Main Character Movement & Physics QA Playground';
    }

    if (isVehicleView) {
      switch (vehicleType) {
        case 'scooter':
          return 'Bajaj Chetak Vintage 2-Stroke Scooter';
        case 'motorcycle':
          return 'Classic Indian 350cc Roadster Motorcycle';
        case 'bicycle':
          return 'Classic Heavy-Duty Double-Tube Roadster Bicycle';
        case 'auto-rickshaw':
          return 'Bajaj RE 3-Wheeler Auto-Rickshaw';
        case 'parked-car':
          return 'Indian Gully Compact Hatchback (Maruti 800)';
        case 'push-cart':
          return 'Sabzi & Fruit Push Cart (Vendor Thela)';
        case 'hand-cart':
          return 'Heavy Cargo 2-Wheeled Handcart (Rehra)';
        case 'garbage-bins':
          return 'Municipal Waste Bins & Concrete Drum';
        default:
          return 'Indian Street Prop';
      }
    }

    switch (houseType) {
      case 'stair-bungalow':
        return 'Single-Storey Bungalow with Open Staircase';
      case 'shop-2story':
        return '2-Storey Commercial Shop Complex';
      case 'shop-3story':
        return '3-Storey Commercial Shop Complex';
      case 'box-2story':
        return 'Two-Storey Indian Box House';
      case 'box-3story':
        return 'Three-Storey Indian Box House';
      case 'modern-villa':
        return 'Contemporary 2-Storey Villa';
      case 'terrace':
      default:
        return 'Rooftop Terrace House';
    }
  }, [isPlayerView, isVehicleView, vehicleType, houseType]);

  const getDimensionsText = useCallback((): string => {
    if (isPlayerView) {
      return 'Test Area: 20m × 20m • Standing Height: 1.80m • Capsule Radius: 0.32m • Zero Props';
    }

    if (isVehicleView) {
      switch (vehicleType) {
        case 'scooter':
          return 'Length: 1.75m • Height: 1.05m • Width: 0.68m • Dual Split Seats • Spare Tire';
        case 'motorcycle':
          return 'Length: 2.05m • Height: 1.08m • Width: 0.76m • 350cc Finned Engine • Saree Guard';
        case 'bicycle':
          return 'Length: 1.80m • Height: 1.02m • 28" Wheels • Double Top-Tube • Luggage Carrier';
        case 'auto-rickshaw':
          return 'Length: 2.65m • Height: 1.72m • Width: 1.30m • 3 Wheels • Canopy • Fare Meter';
        case 'parked-car':
          return 'Length: 3.40m • Height: 1.42m • Width: 1.48m • 4-Door Hatchback • Roof Rack';
        case 'push-cart':
          return 'Length: 1.90m • Height: 1.05m (1.95m Canopy) • Width: 0.95m • Tarazu Scale • Veggies';
        case 'hand-cart':
          return 'Length: 2.40m • Height: 0.85m • Width: 1.20m • Burlap Cargo Sacks • Rope Lashings';
        case 'garbage-bins':
          return 'Width: 1.65m • Height: 1.05m • Depth: 0.85m • Wet/Dry Waste Segregation • Concrete Drum';
        default:
          return 'Metric 1:1 Scale Model';
      }
    }

    switch (houseType) {
      case 'stair-bungalow':
        return 'Plinth: 9.6m × 8.4m • Height: 3.24m • 16 Open Steps';
      case 'shop-2story':
        return 'Plinth: 12.4m × 8.4m • Height: 6.48m • 3 Ground Shops + Wide Rooftop';
      case 'shop-3story':
        return 'Plinth: 12.4m × 8.4m • Height: 9.48m • 3 Shops + 2 Upper Floors + Rooftop';
      case 'box-2story':
        return 'Plinth: 8.4m × 7.8m • Height: 6.48m • 2-Storey + Mumty Rooftop';
      case 'box-3story':
        return 'Plinth: 8.4m × 7.8m • Height: 9.48m • 3-Storey + Mumty Rooftop';
      case 'modern-villa':
        return 'Plinth: 7.4m × 7.4m • Height: 5.20m • 2-Storey Villa';
      case 'terrace':
      default:
        return 'Terrace: 9.0m × 7.0m • Height: 2.75m • Traditional Rooftop';
    }
  }, [isPlayerView, isVehicleView, vehicleType, houseType]);

  return {
    rawCategory,
    isPlayerView,
    isVehicleView,
    activeCategory,
    searchQuery,
    setSearchQuery,
    inspectorOpen,
    setInspectorOpen,
    playerParams,
    setPlayerParams,
    cameraParams,
    setCameraParams,
    showColliderDebug,
    setShowColliderDebug,
    houseType,
    setHouseType,
    vehicleType,
    setVehicleType,
    lightingPreset,
    setLightingPreset,
    renderStyle,
    cameraPreset,
    setCameraPreset,
    autoRotate,
    setAutoRotate,
    ballThrows,
    soundEnabled,
    setSoundEnabled,
    scooterConfig,
    setScooterConfig,
    motorcycleConfig,
    setMotorcycleConfig,
    bicycleConfig,
    setBicycleConfig,
    autoConfig,
    setAutoConfig,
    carConfig,
    setCarConfig,
    pushCartConfig,
    setPushCartConfig,
    handCartConfig,
    setHandCartConfig,
    garbageConfig,
    setGarbageConfig,
    stairConfig,
    setStairConfig,
    box2Config,
    setBox2Config,
    box3Config,
    setBox3Config,
    shop2Config,
    setShop2Config,
    shop3Config,
    setShop3Config,
    modernConfig,
    setModernConfig,
    houseConfig,
    setHouseConfig,
    applyPresetColors,
    applyVehiclePresetColor,
    currentColors,
    handleThrowBall,
    getModelTitle,
    getDimensionsText,
  };
}

export type StudioState = ReturnType<typeof useStudioState>;
