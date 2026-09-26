import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { HouseStudio, type HouseType, type RenderStyle } from './components/HouseStudio';
import { VehicleStudio, type VehicleType, type VehicleCameraPreset } from './components/VehicleStudio';
import { CharacterStudio, type CharacterCameraPreset } from './components/CharacterStudio';
import { type CharacterConfig } from './components/3d/character/GullyCricketPlayer';
import type { StairHouseConfig } from './components/3d/houses/SingleStoryStairHouse';
import type { BoxHouseConfig } from './components/3d/houses/TwoStoryBoxHouse';
import type { ThreeStoryBoxConfig } from './components/3d/houses/ThreeStoryBoxHouse';
import type { ShopComplexConfig } from './components/3d/houses/TwoStoryShopComplex';
import type { ThreeStoryShopConfig } from './components/3d/houses/ThreeStoryShopComplex';
import type { ModernHouseConfig } from './components/3d/houses/ModernGullyHouse';
import type { HouseConfig } from './components/3d/houses/IndianTerraceHouse';
import type { ScooterConfig } from './components/3d/vehicles/BajajChetakScooter';
import type { MotorcycleConfig } from './components/3d/vehicles/IndianMotorcycle';
import type { BicycleConfig } from './components/3d/vehicles/ClassicIndianBicycle';
import type { AutoRickshawConfig } from './components/3d/vehicles/AutoRickshaw';
import type { ParkedCarConfig } from './components/3d/vehicles/ParkedGullyCar';
import type { PushCartConfig } from './components/3d/vehicles/IndianPushCart';
import type { HandCartConfig } from './components/3d/vehicles/IndianHandCart';
import type { GarbageBinsConfig } from './components/3d/vehicles/IndianGarbageBins';
import type { LightingPreset } from './components/3d/environment/StudioLighting';
import { Switch } from './components/ui/Switch';
import { Tabs, TabsList, TabsTrigger, TabsContent } from './components/ui/Tabs';
import {
  Home,
  User,
  Bike,
  Sun,
  Volume2,
  VolumeX,
  RotateCcw,
  Sparkles,
  ChevronRight,
  Search,
  Moon,
  Sparkle,
  SlidersHorizontal,
  FolderGit2,
  BookOpen,
  PanelRightClose,
  PanelRightOpen,
  Camera,
  Ruler,
  Palette,
  CloudRain,
} from 'lucide-react';

export const StudioLayout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const pathParts = location.pathname.split('/');
  const rawCategory = pathParts[2] || 'houses';
  const isVehicleView = rawCategory === 'bikes' || rawCategory === 'props';
  const isCharacterView = rawCategory === 'character' || rawCategory === 'characters';
  const activeCategory = isCharacterView ? 'character' : isVehicleView ? 'bikes' : rawCategory;

  const [searchQuery, setSearchQuery] = useState<string>('');
  const [inspectorOpen, setInspectorOpen] = useState<boolean>(true);

  // Active 3D House State
  const [houseType, setHouseType] = useState<HouseType>('shop-2story');
  // Active 3D Vehicle & Street Prop State
  const [vehicleType, setVehicleType] = useState<VehicleType>('scooter');

  // Active Character State
  const [characterConfig, setCharacterConfig] = useState<CharacterConfig>({
    skinTone: '#c68642',
    hairColor: '#171717',
    jerseyColor: '#1d4ed8',
    jerseyAccentColor: '#f59e0b',
    jerseyNumber: '7',
    shortsColor: '#1e293b',
    shoesColor: '#f8fafc',
    hasCap: true,
    hasGloves: true,
    hasWristBand: true,
    batWoodTone: 'kashmir-willow',
    pose: 'batting-stance',
    animateIdle: true,
  });
  const [showReferenceVehicle, setShowReferenceVehicle] = useState<boolean>(true);
  const [showScaleRuler, setShowScaleRuler] = useState<boolean>(true);
  const [characterCamPreset, setCharacterCamPreset] = useState<CharacterCameraPreset>('full-body');

  const [lightingPreset, setLightingPreset] = useState<LightingPreset>('afternoon');
  const [renderStyle] = useState<RenderStyle>('textured');
  const [cameraPreset, setCameraPreset] = useState<VehicleCameraPreset>('reference');
  const [autoRotate, setAutoRotate] = useState<boolean>(false);
  const [ballThrows, setBallThrows] = useState<number>(0);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);

  // 1. Scooter Config
  const [scooterConfig, setScooterConfig] = useState<ScooterConfig>({
    bodyColor: '#4e8777', // Seafoam Green
    seatColor: '#2b211b',
    hasCrashGuard: true,
    hasSpareTire: true,
    hasMirrors: true,
    hasFootrest: true,
  });

  // 2. Motorcycle Config
  const [motorcycleConfig, setMotorcycleConfig] = useState<MotorcycleConfig>({
    tankColor: '#1e293b', // Stealth Black
    seatColor: '#3e2723',
    hasCrashGuard: true,
    hasSareeGuard: true,
    hasMirrors: true,
    hasLuggageCarrier: true,
  });

  // 3. Bicycle Config
  const [bicycleConfig, setBicycleConfig] = useState<BicycleConfig>({
    frameColor: '#0f172a', // Vintage Black
    hasCarrier: true,
    hasBell: true,
    hasDynamoLight: true,
    hasChainCover: true,
    hasDoubleTopTube: true,
  });

  // 4. Auto-Rickshaw Config
  const [autoConfig, setAutoConfig] = useState<AutoRickshawConfig>({
    bodyColor: '#15803d', // Gully Green
    roofColor: '#eab308', // Auto Yellow
    seatColor: '#1f242d',
    hasFareMeter: true,
    hasCurtains: true,
    hasFrontBumper: true,
    hasRearBumper: true,
    hasLuggageNet: true,
  });

  // 5. Parked Gully Car Config
  const [carConfig, setCarConfig] = useState<ParkedCarConfig>({
    bodyColor: '#e2e8f0', // Pearl White
    hasRoofRack: true,
    hasSideMoldings: true,
    hasMudFlaps: true,
    hasTaxiStrip: false,
    windowTint: 'dark',
  });

  // 6. Sabzi & Fruit Push Cart Config
  const [pushCartConfig, setPushCartConfig] = useState<PushCartConfig>({
    hasScale: true,
    hasProduce: true,
    hasUmbrella: true,
    hasHangingBulb: true,
    hasJuteSacks: true,
    woodTone: 'weathered',
  });

  // 7. Cargo Handcart Config
  const [handCartConfig, setHandCartConfig] = useState<HandCartConfig>({
    hasCargoSacks: true,
    hasCrates: true,
    hasRopeLashing: true,
    hasIronCornerBrackets: true,
    woodTone: 'aged',
  });

  // 8. Garbage Bins Config
  const [garbageConfig, setGarbageConfig] = useState<GarbageBinsConfig>({
    hasConcreteDrum: true,
    hasTwinSegregationBins: true,
    hasStreetClutter: true,
    hasConcretePlinth: true,
  });

  // Single-Storey Stair Bungalow Config
  const [stairConfig, setStairConfig] = useState<StairHouseConfig>({
    wallColor: '#e0d7c7',
    accentColor: '#2b3642',
    stoneAccentColor: '#524e49',
    trimColor: '#f8fafc',
    hasWaterTank: true,
    hasDishAntenna: true,
    hasCoveLight: true,
    hasFrontGarden: true,
  });

  // 2-Storey Box House Config
  const [box2Config, setBox2Config] = useState<BoxHouseConfig>({
    wallColor: '#e0d7c7',
    accentColor: '#2b3642',
    trimColor: '#f8fafc',
    hasWaterTank: true,
    hasDishAntenna: true,
    hasACUnit: true,
    hasClothesline: true,
    hasRebars: true,
    hasMumtyCabin: true,
  });

  // 3-Storey Box House Config
  const [box3Config, setBox3Config] = useState<ThreeStoryBoxConfig>({
    wallColor: '#eae2d5',
    accentColor: '#9e4436',
    trimColor: '#f8fafc',
    hasWaterTank: true,
    hasDishAntenna: true,
    hasACUnits: true,
    hasClothesline: true,
    hasRebars: true,
    hasMumtyCabin: true,
  });

  // 2-Storey Commercial Shop Complex Config
  const [shop2Config, setShop2Config] = useState<ShopComplexConfig>({
    wallColor: '#e0d7c7',
    accentColor: '#2b3642',
    trimColor: '#f8fafc',
    hasWaterTanks: true,
    hasDishAntenna: true,
    hasACUnits: true,
    hasClothesline: true,
    hasRebars: true,
    hasMumtyCabin: true,
    hasSignboardLights: true,
  });

  // 3-Storey Commercial Shop Complex Config
  const [shop3Config, setShop3Config] = useState<ThreeStoryShopConfig>({
    wallColor: '#e2ded4',
    accentColor: '#445447',
    trimColor: '#f8fafc',
    hasWaterTanks: true,
    hasDishAntenna: true,
    hasACUnits: true,
    hasClothesline: true,
    hasRebars: true,
    hasMumtyCabin: true,
    hasSignboardLights: true,
  });

  // Contemporary Villa Config
  const [modernConfig, setModernConfig] = useState<ModernHouseConfig>({
    mainColor: '#ded5c5',
    accentColor: '#1e385c',
    frameColor: '#ffffff',
    hasWaterTank: true,
    hasDishAntenna: true,
    hasPalmTree: true,
    hasStreetLamp: true,
    hasInteriorGlow: true,
  });

  // Traditional Terrace House Config
  const [houseConfig, setHouseConfig] = useState<HouseConfig>({
    wallColor: '#8fa3b3',
    floorColor: '#df8f85',
    hasWaterTank: true,
    hasDishAntenna: true,
    hasRebars: true,
    hasLadder: true,
    hasScooter: true,
    hasClutter: true,
    hasClothesline: false,
    hasAirCooler: false,
    peelingAmount: 0.5,
  });

  // Asset Categories in Left Sidebar
  const categories = [
    { id: 'houses', name: 'Houses & Complexes', route: '/studio/houses', icon: Home, count: '7 models' },
    { id: 'character', name: 'Characters & Players', route: '/studio/character', icon: User, count: '1 player • 4 poses' },
    { id: 'bikes', name: 'Vehicles & Street Props', route: '/studio/bikes', icon: Bike, count: '8 street props' },
    { id: 'lighting', name: 'Atmosphere & Sky', route: '/studio/lighting', icon: Sun, count: '4 presets' },
  ];

  // Active Environment Lighting List
  const lightingPresets = [
    { id: 'afternoon' as LightingPreset, name: 'Lazy Afternoon', sub: 'Warm Golden Sunlight', icon: Sun },
    { id: 'sunset' as LightingPreset, name: 'Gully Sunset', sub: 'Vibrant Orange Horizon', icon: Sparkles },
    { id: 'monsoon' as LightingPreset, name: 'Monsoon Overcast', sub: 'Cool Soft Diffused Sky', icon: CloudRain },
    { id: 'night' as LightingPreset, name: 'Night Cricket', sub: 'Deep Twilight Atmosphere', icon: Moon },
  ];

  // Curated Master Architectural Color Combination Presets
  const masterColorPresets = [
    {
      name: 'Nordic Slate & Sandstone',
      sub: 'Clean sandstone with dark slate accent',
      wall: '#e0d7c7',
      accent: '#2b3642',
      trim: '#f8fafc',
    },
    {
      name: 'Terracotta Haven & Charcoal',
      sub: 'Warm cream plaster with earthy terracotta',
      wall: '#eae2d5',
      accent: '#9e4436',
      trim: '#ffffff',
    },
    {
      name: 'Olive Sage & Mineral',
      sub: 'Soft mineral cream with forest sage accent',
      wall: '#e2ded4',
      accent: '#445447',
      trim: '#f1f5f9',
    },
    {
      name: 'Heritage Indigo & Sand',
      sub: 'Desert sand with deep royal indigo',
      wall: '#ded5c5',
      accent: '#1e385c',
      trim: '#f8fafc',
    },
    {
      name: 'Architectural Concrete & Slate',
      sub: 'Modern cool ash grey with midnight slate',
      wall: '#d5dbe2',
      accent: '#1e2530',
      trim: '#ffffff',
    },
    {
      name: 'Jaipur Ochre & Deep Bronze',
      sub: 'Warm sunlit ochre with dark bronze accents',
      wall: '#ebd8ba',
      accent: '#3d2b24',
      trim: '#fdfbf7',
    },
    {
      name: 'Modern Clay & Espresso',
      sub: 'Natural earth clay with dark roast espresso',
      wall: '#d4c6b5',
      accent: '#2d211d',
      trim: '#f8fafc',
    },
    {
      name: 'Coastal Mint & Deep Navy',
      sub: 'Subtle fresh mint wash with deep ocean navy',
      wall: '#d7e4df',
      accent: '#1f3347',
      trim: '#ffffff',
    },
  ];

  // Curated Team Cricket Jersey Presets
  const teamJerseyPresets = [
    {
      name: 'Team India Bleed Blue',
      sub: 'Deep royal blue with vibrant saffron trim',
      jersey: '#1d4ed8',
      accent: '#f59e0b',
      shorts: '#1e293b',
    },
    {
      name: 'Chennai Super Gold',
      sub: 'Vibrant canary yellow with ocean navy',
      jersey: '#eab308',
      accent: '#1e40af',
      shorts: '#1e3a8a',
    },
    {
      name: 'Mumbai Royal Cobalt',
      sub: 'Electric cobalt blue with championship gold',
      jersey: '#2563eb',
      accent: '#f59e0b',
      shorts: '#1e293b',
    },
    {
      name: 'Bangalore Royal Crimson',
      sub: 'Fiery scarlet crimson with carbon black',
      jersey: '#dc2626',
      accent: '#111827',
      shorts: '#0f172a',
    },
    {
      name: 'Kolkata Velvet Purple',
      sub: 'Royal regal purple with gold trim',
      jersey: '#6b21a8',
      accent: '#eab308',
      shorts: '#1f132b',
    },
    {
      name: 'Gully Champions Green',
      sub: 'Street turf green with crisp white trim',
      jersey: '#15803d',
      accent: '#ffffff',
      shorts: '#14532d',
    },
  ];

  // Curated Vehicle & Prop Paint Presets
  const vehicleColorPresets = [
    {
      name: 'Vintage Seafoam Mint',
      sub: 'Iconic Bajaj 2-Stroke Scooter finish',
      color: '#4e8777',
      accent: '#2b211b',
    },
    {
      name: 'Classic Bullet Black',
      sub: 'Stealth gloss roadster with gold pin',
      color: '#1e293b',
      accent: '#3e2723',
    },
    {
      name: 'Gully Auto Green & Yellow',
      sub: 'Capital city CNG Tuk-Tuk livery',
      color: '#15803d',
      accent: '#eab308',
    },
    {
      name: 'Pearl White Hatchback',
      sub: 'Clean Indian city commuter car',
      color: '#e2e8f0',
      accent: '#181b22',
    },
    {
      name: 'Mumbai Taxi Black & Yellow',
      sub: 'Iconic metropolis cab two-tone',
      color: '#181b20',
      accent: '#f59e0b',
    },
    {
      name: 'Royal Heritage Crimson',
      sub: 'Deep rich metallic maroon finish',
      color: '#831843',
      accent: '#2b1e1a',
    },
  ];

  // Apply colors to the currently active model
  const applyPresetColors = (wall: string, accent: string, trim: string) => {
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
  };

  const applyVehiclePresetColor = (mainColor: string, subColor: string) => {
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
  };

  // Get current active colors
  const getCurrentColors = () => {
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
  };

  const currentColors = getCurrentColors();

  const handleThrowBall = () => {
    setBallThrows((prev) => prev + 1);
    const event = new CustomEvent('throw-cricket-ball', {
      detail: {
        x: (Math.random() - 0.5) * 2.0,
        y: 1.0 + Math.random() * 0.6,
        z: -0.8,
      },
    });
    window.dispatchEvent(event);
  };

  const filteredCategories = categories.filter((c) =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getModelTitle = () => {
    if (isCharacterView) {
      return `Gully Cricket Player (${characterConfig.pose.replace('-', ' ').toUpperCase()})`;
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
  };

  const getDimensionsText = () => {
    if (isCharacterView) {
      return 'Height: 1.76m (Metric 1:1 Scale) • Shoulder Width: 0.44m • Fits 2.1m House Doors & 3.2m Storeys';
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
  };

  return (
    <div className="app-shell">
      {/* 1. Clean Category-Driven Left Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-brand" onClick={() => navigate('/studio/houses')} style={{ cursor: 'pointer' }}>
          <div className="brand-logo-badge">GC</div>
          <div className="brand-meta">
            <span className="brand-title">GullyCricket 3D</span>
            <span className="brand-subtitle">Asset Studio v1.0</span>
          </div>
        </div>

        {/* Search Filter */}
        <div className="sidebar-search">
          <Search size={14} className="search-icon" />
          <input
            type="text"
            className="search-input"
            placeholder="Search categories..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Active Asset Categories List */}
        <div className="sidebar-nav">
          <div className="nav-section-label">STUDIO ASSET CATEGORIES</div>
          <div className="nav-list">
            {filteredCategories.map((item) => {
              const Icon = item.icon;
              const isSelected = activeCategory === item.id;
              return (
                <button
                  key={item.id}
                  className={`nav-item ${isSelected ? 'selected' : ''}`}
                  onClick={() => navigate(item.route)}
                >
                  <Icon size={16} className="nav-icon" />
                  <span className="nav-text">{item.name}</span>
                  <span className="nav-pill-muted">{item.count}</span>
                </button>
              );
            })}
          </div>

          <div className="nav-section-label" style={{ marginTop: '20px' }}>
            PROJECT PIPELINE
          </div>
          <div className="nav-list">
            <div className="nav-item">
              <FolderGit2 size={16} className="nav-icon" />
              <span className="nav-text">Three.js R3F Pipeline</span>
            </div>
            <div className="nav-item">
              <BookOpen size={16} className="nav-icon" />
              <span className="nav-text">Neighborhood Lore</span>
            </div>
          </div>
        </div>

        {/* Sidebar Footer */}
        <div className="sidebar-footer">
          <div className="avatar-chip">CR</div>
          <div className="footer-meta">
            <span className="footer-name">Lead 3D Artist</span>
            <span className="footer-role">Gully Studio Engine</span>
          </div>
        </div>
      </aside>

      {/* 2. Central Main Workspace */}
      <div className="main-viewport-wrapper">
        {/* Top Header */}
        <header className="top-header">
          {/* Breadcrumbs */}
          <div className="breadcrumbs">
            <span className="crumb-root" onClick={() => navigate('/studio')} style={{ cursor: 'pointer' }}>
              Studio
            </span>
            <ChevronRight size={14} className="crumb-separator" />
            <span className="crumb-segment">
              {isCharacterView
                ? 'Characters & Players'
                : isVehicleView
                ? 'Vehicles & Street Props'
                : activeCategory === 'lighting'
                ? 'Atmosphere & Sky'
                : 'Houses'}
            </span>
            <ChevronRight size={14} className="crumb-separator" />
            <span className="crumb-current">{getModelTitle()}</span>
          </div>

          {/* Action Tools */}
          <div className="header-toolbar">
            {/* Camera View Switcher */}
            {isCharacterView ? (
              <div className="camera-pill-group">
                <button
                  className={`cam-btn ${characterCamPreset === 'full-body' ? 'active' : ''}`}
                  onClick={() => setCharacterCamPreset('full-body')}
                  title="Full Body 3/4 View"
                >
                  <Camera size={13} />
                  <span>Full Body</span>
                </button>
                <button
                  className={`cam-btn ${characterCamPreset === 'face-zoom' ? 'active' : ''}`}
                  onClick={() => setCharacterCamPreset('face-zoom')}
                  title="Face Close-up"
                >
                  <span>Portrait</span>
                </button>
                <button
                  className={`cam-btn ${characterCamPreset === 'side' ? 'active' : ''}`}
                  onClick={() => setCharacterCamPreset('side')}
                  title="Side Profile"
                >
                  <span>Side</span>
                </button>
                <button
                  className={`cam-btn ${characterCamPreset === 'batting-focus' ? 'active' : ''}`}
                  onClick={() => setCharacterCamPreset('batting-focus')}
                  title="Bat & Grip Focus"
                >
                  <span>Bat Focus</span>
                </button>
              </div>
            ) : (
              <div className="camera-pill-group">
                <button
                  className={`cam-btn ${cameraPreset === 'reference' ? 'active' : ''}`}
                  onClick={() => setCameraPreset('reference')}
                  title="Perspective 3/4 View"
                >
                  <Camera size={13} />
                  <span>3/4 View</span>
                </button>
                <button
                  className={`cam-btn ${cameraPreset === 'side' ? 'active' : ''}`}
                  onClick={() => setCameraPreset('side')}
                  title="Side Profile"
                >
                  <span>Side</span>
                </button>
                <button
                  className={`cam-btn ${cameraPreset === 'front' ? 'active' : ''}`}
                  onClick={() => setCameraPreset('front')}
                  title="Front Elevation"
                >
                  <span>Front</span>
                </button>
                <button
                  className={`cam-btn ${cameraPreset === 'top' ? 'active' : ''}`}
                  onClick={() => setCameraPreset('top')}
                  title="Top-Down Plan"
                >
                  <span>Top</span>
                </button>
              </div>
            )}

            <button
              className="btn-minimal btn-accent"
              onClick={handleThrowBall}
              title="Bowl a tennis ball towards the batsman"
            >
              <Sparkle size={14} />
              <span>Bowl Ball ({ballThrows})</span>
            </button>

            <button
              className={`btn-minimal ${autoRotate ? 'active' : ''}`}
              onClick={() => setAutoRotate(!autoRotate)}
              title="Toggle Auto Rotation"
            >
              <RotateCcw size={14} />
              <span>Turntable</span>
            </button>

            <button
              className="btn-icon-minimal"
              onClick={() => setSoundEnabled(!soundEnabled)}
              title="Toggle Ambience Sound"
            >
              {soundEnabled ? <Volume2 size={15} /> : <VolumeX size={15} />}
            </button>

            {/* Customizer Panel Toggle */}
            <button
              className={`btn-minimal ${inspectorOpen ? 'active' : ''}`}
              onClick={() => setInspectorOpen(!inspectorOpen)}
              title={inspectorOpen ? 'Hide Customizer Panel' : 'Show Customizer Panel'}
            >
              {inspectorOpen ? <PanelRightClose size={15} /> : <PanelRightOpen size={15} />}
              <span>{inspectorOpen ? 'Hide Panel' : 'Customizer'}</span>
            </button>
          </div>
        </header>

        {/* Viewport and Right Inspector */}
        <div className="workspace-split">
          {/* 3D Canvas Frame */}
          <div className="canvas-frame">
            {isCharacterView ? (
              <CharacterStudio
                characterConfig={characterConfig}
                lightingPreset={lightingPreset}
                showReferenceVehicle={showReferenceVehicle}
                showScaleRuler={showScaleRuler}
                autoRotate={autoRotate}
                cameraPreset={characterCamPreset}
              />
            ) : isVehicleView ? (
              <VehicleStudio
                vehicleType={vehicleType}
                lightingPreset={lightingPreset}
                scooterConfig={scooterConfig}
                motorcycleConfig={motorcycleConfig}
                bicycleConfig={bicycleConfig}
                autoConfig={autoConfig}
                carConfig={carConfig}
                pushCartConfig={pushCartConfig}
                handCartConfig={handCartConfig}
                garbageConfig={garbageConfig}
                autoRotate={autoRotate}
                cameraPreset={cameraPreset}
              />
            ) : (
              <HouseStudio
                houseType={houseType}
                lightingPreset={lightingPreset}
                renderStyle={renderStyle}
                houseConfig={houseConfig}
                modernConfig={modernConfig}
                stairConfig={stairConfig}
                box2Config={box2Config}
                box3Config={box3Config}
                shop2Config={shop2Config}
                shop3Config={shop3Config}
                autoRotate={autoRotate}
                showGrid={false}
                cameraPreset={cameraPreset === 'side' ? 'reference' : cameraPreset}
              />
            )}

            {/* Bottom Overlay Hint */}
            <div className="viewport-overlay-hint">
              <span>Hold <kbd>Shift</kbd> + Click to bowl a tennis ball anywhere</span>
            </div>
          </div>

          {/* 3. Right Property Inspector (Customizer) */}
          {inspectorOpen && (
            <aside className="right-inspector">
              <div className="inspector-header">
                <div className="inspector-header-title">
                  <SlidersHorizontal size={14} className="inspector-title-icon" />
                  <span>Customizer</span>
                </div>
                <span className="status-badge-active">PBR 1:1 Scale</span>
              </div>

              {/* Dimensions Metadata Bar */}
              <div className="dimensions-bar">
                <Ruler size={13} className="ruler-icon" />
                <span>{getDimensionsText()}</span>
              </div>

              {/* Radix Tabs */}
              <Tabs defaultValue="geometry" className="radix-tabs-root">
                <TabsList className="radix-tabs-list">
                  <TabsTrigger value="geometry" className="radix-tabs-trigger">
                    {isCharacterView ? 'Poses & Team' : isVehicleView ? 'Props & Vehicles' : 'Architecture'}
                  </TabsTrigger>
                  <TabsTrigger value="props" className="radix-tabs-trigger">
                    {isCharacterView ? 'Gear & Scale' : 'Props & Tuning'}
                  </TabsTrigger>
                  <TabsTrigger value="lighting" className="radix-tabs-trigger">
                    Lighting
                  </TabsTrigger>
                </TabsList>

                {/* Tab 1: Poses & Uniform Selection */}
                <TabsContent value="geometry" className="radix-tabs-content">
                  {isCharacterView ? (
                    <>
                      {/* Character Pose Selector */}
                      <div className="inspector-section">
                        <span className="section-label">SELECT CRICKET POSE</span>
                        <div className="segmented-grid">
                          <button
                            className={`segment-card ${characterConfig.pose === 'batting-stance' ? 'selected' : ''}`}
                            onClick={() => setCharacterConfig({ ...characterConfig, pose: 'batting-stance' })}
                          >
                            <span className="card-title">🏏 Classic Batting Stance</span>
                            <span className="card-subtitle">Grounded willow bat ready at popping crease</span>
                          </button>

                          <button
                            className={`segment-card ${characterConfig.pose === 'cover-drive' ? 'selected' : ''}`}
                            onClick={() => setCharacterConfig({ ...characterConfig, pose: 'cover-drive' })}
                          >
                            <span className="card-title">💥 Iconic Cover Drive</span>
                            <span className="card-subtitle">Front foot lunging forward, high elbow drive</span>
                          </button>

                          <button
                            className={`segment-card ${characterConfig.pose === 'idle-ready' ? 'selected' : ''}`}
                            onClick={() => setCharacterConfig({ ...characterConfig, pose: 'idle-ready' })}
                          >
                            <span className="card-title">🧍 Bat On Shoulder (Idle)</span>
                            <span className="card-subtitle">Relaxed street cricket stance resting bat</span>
                          </button>

                          <button
                            className={`segment-card ${characterConfig.pose === 'bowling-ready' ? 'selected' : ''}`}
                            onClick={() => setCharacterConfig({ ...characterConfig, pose: 'bowling-ready' })}
                          >
                            <span className="card-title">⚾ Taped Ball Bowling Grip</span>
                            <span className="card-subtitle">Holding taped tennis ball poised at bowling mark</span>
                          </button>
                        </div>
                      </div>

                      {/* Curated Team Jersey Presets */}
                      <div className="inspector-section">
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          <span className="section-label" style={{ margin: 0 }}>
                            TEAM JERSEY UNIFORMS
                          </span>
                          <Palette size={13} style={{ color: 'var(--text-muted)' }} />
                        </div>
                        <div className="palette-choice-list">
                          {teamJerseyPresets.map((p, idx) => {
                            const isSelected =
                              characterConfig.jerseyColor.toLowerCase() === p.jersey.toLowerCase() &&
                              characterConfig.jerseyAccentColor.toLowerCase() === p.accent.toLowerCase();

                            return (
                              <button
                                key={idx}
                                className={`palette-card-btn ${isSelected ? 'selected' : ''}`}
                                onClick={() =>
                                  setCharacterConfig({
                                    ...characterConfig,
                                    jerseyColor: p.jersey,
                                    jerseyAccentColor: p.accent,
                                    shortsColor: p.shorts,
                                  })
                                }
                              >
                                <div className="tri-color-preview">
                                  <span className="color-third" style={{ backgroundColor: p.jersey, flex: 2 }} />
                                  <span className="color-third" style={{ backgroundColor: p.accent, flex: 1 }} />
                                  <span className="color-third" style={{ backgroundColor: p.shorts, flex: 1 }} />
                                </div>
                                <div className="palette-meta-stack">
                                  <span className="palette-card-name">{p.name}</span>
                                  <span className="palette-card-sub">{p.sub}</span>
                                </div>
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* Custom Color Tuning */}
                      <div className="inspector-section">
                        <span className="section-label">CUSTOM PLAYER COLOR TUNER</span>
                        <div className="custom-color-group">
                          <div className="custom-color-item">
                            <span className="custom-color-label">Jersey Main Color</span>
                            <div className="color-picker-wrapper">
                              <span className="hex-badge">{characterConfig.jerseyColor}</span>
                              <input
                                type="color"
                                className="native-color-picker"
                                value={characterConfig.jerseyColor}
                                onChange={(e) =>
                                  setCharacterConfig({ ...characterConfig, jerseyColor: e.target.value })
                                }
                              />
                            </div>
                          </div>

                          <div className="custom-color-item">
                            <span className="custom-color-label">Jersey Accent Trim</span>
                            <div className="color-picker-wrapper">
                              <span className="hex-badge">{characterConfig.jerseyAccentColor}</span>
                              <input
                                type="color"
                                className="native-color-picker"
                                value={characterConfig.jerseyAccentColor}
                                onChange={(e) =>
                                  setCharacterConfig({ ...characterConfig, jerseyAccentColor: e.target.value })
                                }
                              />
                            </div>
                          </div>

                          <div className="custom-color-item">
                            <span className="custom-color-label">Skin Tone</span>
                            <div className="color-picker-wrapper">
                              <span className="hex-badge">{characterConfig.skinTone}</span>
                              <input
                                type="color"
                                className="native-color-picker"
                                value={characterConfig.skinTone}
                                onChange={(e) =>
                                  setCharacterConfig({ ...characterConfig, skinTone: e.target.value })
                                }
                              />
                            </div>
                          </div>

                          <div className="custom-color-item">
                            <span className="custom-color-label">Shorts / Track Pants</span>
                            <div className="color-picker-wrapper">
                              <span className="hex-badge">{characterConfig.shortsColor}</span>
                              <input
                                type="color"
                                className="native-color-picker"
                                value={characterConfig.shortsColor}
                                onChange={(e) =>
                                  setCharacterConfig({ ...characterConfig, shortsColor: e.target.value })
                                }
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </>
                  ) : isVehicleView ? (
                    <>
                      {/* Vehicle & Street Prop Selector Cards */}
                      <div className="inspector-section">
                        <span className="section-label">SELECT STREET PROP / VEHICLE</span>
                        <div className="segmented-grid">
                          <button
                            className={`segment-card ${vehicleType === 'scooter' ? 'selected' : ''}`}
                            onClick={() => setVehicleType('scooter')}
                          >
                            <span className="card-title">🛵 Vintage Bajaj Chetak</span>
                            <span className="card-subtitle">2-stroke scooter, spare wheel & split seats</span>
                          </button>

                          <button
                            className={`segment-card ${vehicleType === 'motorcycle' ? 'selected' : ''}`}
                            onClick={() => setVehicleType('motorcycle')}
                          >
                            <span className="card-title">🏍️ Indian Classic Roadster</span>
                            <span className="card-subtitle">350cc finned engine, spoked wheels, saree guard</span>
                          </button>

                          <button
                            className={`segment-card ${vehicleType === 'bicycle' ? 'selected' : ''}`}
                            onClick={() => setVehicleType('bicycle')}
                          >
                            <span className="card-title">🚲 Heavy-Duty Roadster Bicycle</span>
                            <span className="card-subtitle">Double top-tube frame, rod brakes, 28" wheels</span>
                          </button>

                          <button
                            className={`segment-card ${vehicleType === 'auto-rickshaw' ? 'selected' : ''}`}
                            onClick={() => setVehicleType('auto-rickshaw')}
                          >
                            <span className="card-title">🛺 Bajaj RE Auto-Rickshaw</span>
                            <span className="card-subtitle">3-wheeler Tuk-Tuk, fare meter, yellow/green canopy</span>
                          </button>

                          <button
                            className={`segment-card ${vehicleType === 'parked-car' ? 'selected' : ''}`}
                            onClick={() => setVehicleType('parked-car')}
                          >
                            <span className="card-title">🚗 Indian Gully Compact Car</span>
                            <span className="card-subtitle">Hatchback 4-door, roof rack, mud flaps, tinted glass</span>
                          </button>

                          <button
                            className={`segment-card ${vehicleType === 'push-cart' ? 'selected' : ''}`}
                            onClick={() => setVehicleType('push-cart')}
                          >
                            <span className="card-title">🛒 Sabzi & Fruit Push Cart</span>
                            <span className="card-subtitle">4 spoked wheels, Tarazu scale, produce baskets, umbrella</span>
                          </button>

                          <button
                            className={`segment-card ${vehicleType === 'hand-cart' ? 'selected' : ''}`}
                            onClick={() => setVehicleType('hand-cart')}
                          >
                            <span className="card-title">🛄 Cargo Handcart (Rehra)</span>
                            <span className="card-subtitle">2 massive wheels, jute cargo sacks, rope lashings</span>
                          </button>

                          <button
                            className={`segment-card ${vehicleType === 'garbage-bins' ? 'selected' : ''}`}
                            onClick={() => setVehicleType('garbage-bins')}
                          >
                            <span className="card-title">🗑️ Municipal Segregated Bins</span>
                            <span className="card-subtitle">Green/Blue waste station, concrete drum, chai cups</span>
                          </button>
                        </div>
                      </div>

                      {/* Curated Vehicle Paint Presets */}
                      <div className="inspector-section">
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          <span className="section-label" style={{ margin: 0 }}>
                            CURATED PAINT LIVERIES
                          </span>
                          <Palette size={13} style={{ color: 'var(--text-muted)' }} />
                        </div>
                        <div className="palette-choice-list">
                          {vehicleColorPresets.map((p, idx) => {
                            const isSelected =
                              (vehicleType === 'scooter' && scooterConfig.bodyColor.toLowerCase() === p.color.toLowerCase()) ||
                              (vehicleType === 'motorcycle' && motorcycleConfig.tankColor.toLowerCase() === p.color.toLowerCase()) ||
                              (vehicleType === 'bicycle' && bicycleConfig.frameColor.toLowerCase() === p.color.toLowerCase()) ||
                              (vehicleType === 'auto-rickshaw' && autoConfig.bodyColor.toLowerCase() === p.color.toLowerCase()) ||
                              (vehicleType === 'parked-car' && carConfig.bodyColor.toLowerCase() === p.color.toLowerCase());

                            return (
                              <button
                                key={idx}
                                className={`palette-card-btn ${isSelected ? 'selected' : ''}`}
                                onClick={() => applyVehiclePresetColor(p.color, p.accent)}
                              >
                                <div className="tri-color-preview">
                                  <span className="color-third" style={{ backgroundColor: p.color, flex: 2 }} />
                                  <span className="color-third" style={{ backgroundColor: p.accent, flex: 1 }} />
                                </div>
                                <div className="palette-meta-stack">
                                  <span className="palette-card-name">{p.name}</span>
                                  <span className="palette-card-sub">{p.sub}</span>
                                </div>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      {/* House Model Selector Cards */}
                      <div className="inspector-section">
                        <span className="section-label">SELECT HOUSE MODEL</span>
                        <div className="segmented-grid">
                          <button
                            className={`segment-card ${houseType === 'shop-2story' ? 'selected' : ''}`}
                            onClick={() => setHouseType('shop-2story')}
                          >
                            <span className="card-title">2-Storey Shop Complex</span>
                            <span className="card-subtitle">3 wide commercial shops + upper apartments</span>
                          </button>

                          <button
                            className={`segment-card ${houseType === 'shop-3story' ? 'selected' : ''}`}
                            onClick={() => setHouseType('shop-3story')}
                          >
                            <span className="card-title">3-Storey Shop Complex</span>
                            <span className="card-subtitle">3 shops + 2 upper floors + wide rooftop</span>
                          </button>

                          <button
                            className={`segment-card ${houseType === 'stair-bungalow' ? 'selected' : ''}`}
                            onClick={() => setHouseType('stair-bungalow')}
                          >
                            <span className="card-title">Single-Storey with Open Staircase</span>
                            <span className="card-subtitle">Raised veranda, LED canopy, open stairs</span>
                          </button>

                          <button
                            className={`segment-card ${houseType === 'box-2story' ? 'selected' : ''}`}
                            onClick={() => setHouseType('box-2story')}
                          >
                            <span className="card-title">2-Storey Indian Box House</span>
                            <span className="card-subtitle">Chhajjas, mumty cabin, AC unit, rooftop</span>
                          </button>

                          <button
                            className={`segment-card ${houseType === 'box-3story' ? 'selected' : ''}`}
                            onClick={() => setHouseType('box-3story')}
                          >
                            <span className="card-title">3-Storey Indian Box House</span>
                            <span className="card-subtitle">3 full floors, balconies, dual tanks</span>
                          </button>

                          <button
                            className={`segment-card ${houseType === 'modern-villa' ? 'selected' : ''}`}
                            onClick={() => setHouseType('modern-villa')}
                          >
                            <span className="card-title">Contemporary 2-Storey Villa</span>
                            <span className="card-subtitle">Cantilever frame balcony, side palm tree</span>
                          </button>

                          <button
                            className={`segment-card ${houseType === 'terrace' ? 'selected' : ''}`}
                            onClick={() => setHouseType('terrace')}
                          >
                            <span className="card-title">Reference Rooftop Terrace</span>
                            <span className="card-subtitle">Terrace, lime wash walls, Sintex tank</span>
                          </button>
                        </div>
                      </div>

                      {/* Curated Modern Color Combination Presets */}
                      <div className="inspector-section">
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          <span className="section-label" style={{ margin: 0 }}>
                            CURATED COLOR PALETTES
                          </span>
                          <Palette size={13} style={{ color: 'var(--text-muted)' }} />
                        </div>
                        <div className="palette-choice-list">
                          {masterColorPresets.map((p, idx) => {
                            const isSelected =
                              currentColors.wall.toLowerCase() === p.wall.toLowerCase() &&
                              currentColors.accent.toLowerCase() === p.accent.toLowerCase();
                            return (
                              <button
                                key={idx}
                                className={`palette-card-btn ${isSelected ? 'selected' : ''}`}
                                onClick={() => applyPresetColors(p.wall, p.accent, p.trim)}
                              >
                                <div className="tri-color-preview">
                                  <span className="color-third" style={{ backgroundColor: p.wall }} title="Main Wall" />
                                  <span className="color-third" style={{ backgroundColor: p.accent }} title="Accent" />
                                  <span className="color-third" style={{ backgroundColor: p.trim }} title="Trim" />
                                </div>
                                <div className="palette-meta-stack">
                                  <span className="palette-card-name">{p.name}</span>
                                  <span className="palette-card-sub">{p.sub}</span>
                                </div>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </>
                  )}
                </TabsContent>

                {/* Tab 2: Gear, Equipment & Scale Comparison */}
                <TabsContent value="props" className="radix-tabs-content">
                  <div className="inspector-section">
                    <span className="section-label">
                      {isCharacterView ? 'EQUIPMENT & SCALE COMPARISON' : 'PROPS & ACCESSORIES'}
                    </span>
                    <div className="switch-row-list">
                      {isCharacterView ? (
                        <>
                          <div className="switch-row">
                            <div className="switch-meta">
                              <span className="switch-label">Side-by-Side Reference Scooter</span>
                              <span className="switch-desc">Compare 1.76m player with 1.05m Bajaj Chetak</span>
                            </div>
                            <Switch
                              checked={showReferenceVehicle}
                              onCheckedChange={(checked) => setShowReferenceVehicle(checked)}
                            />
                          </div>

                          <div className="switch-row">
                            <div className="switch-meta">
                              <span className="switch-label">Metric Height Laser Ruler</span>
                              <span className="switch-desc">Height markers for Head (1.76m) & Stumps (0.71m)</span>
                            </div>
                            <Switch
                              checked={showScaleRuler}
                              onCheckedChange={(checked) => setShowScaleRuler(checked)}
                            />
                          </div>

                          <div className="switch-row">
                            <div className="switch-meta">
                              <span className="switch-label">Live Breathing Idle Animation</span>
                              <span className="switch-desc">Natural breathing micro-sway motion</span>
                            </div>
                            <Switch
                              checked={characterConfig.animateIdle}
                              onCheckedChange={(checked) =>
                                setCharacterConfig({ ...characterConfig, animateIdle: checked })
                              }
                            />
                          </div>

                          <div className="switch-row">
                            <div className="switch-meta">
                              <span className="switch-label">Cricket Team Cap</span>
                              <span className="switch-desc">Sun visor cap with golden emblem</span>
                            </div>
                            <Switch
                              checked={characterConfig.hasCap}
                              onCheckedChange={(checked) =>
                                setCharacterConfig({ ...characterConfig, hasCap: checked })
                              }
                            />
                          </div>

                          <div className="switch-row">
                            <div className="switch-meta">
                              <span className="switch-label">Batting Gloves</span>
                              <span className="switch-desc">Padded finger roll protection gloves</span>
                            </div>
                            <Switch
                              checked={characterConfig.hasGloves}
                              onCheckedChange={(checked) =>
                                setCharacterConfig({ ...characterConfig, hasGloves: checked })
                              }
                            />
                          </div>

                          <div className="switch-row">
                            <div className="switch-meta">
                              <span className="switch-label">Wrist Sweatband</span>
                              <span className="switch-desc">Athletic absorbent wristband</span>
                            </div>
                            <Switch
                              checked={characterConfig.hasWristBand}
                              onCheckedChange={(checked) =>
                                setCharacterConfig({ ...characterConfig, hasWristBand: checked })
                              }
                            />
                          </div>
                        </>
                      ) : (
                        <>
                          {vehicleType === 'parked-car' && (
                            <>
                              <div className="switch-row">
                                <div className="switch-meta">
                                  <span className="switch-label">Rooftop Luggage Rack</span>
                                  <span className="switch-desc">Steel carrier rack with crossbars</span>
                                </div>
                                <Switch
                                  checked={carConfig.hasRoofRack}
                                  onCheckedChange={(checked) => setCarConfig({ ...carConfig, hasRoofRack: checked })}
                                />
                              </div>
                              <div className="switch-row">
                                <div className="switch-meta">
                                  <span className="switch-label">Side Rubber Moldings</span>
                                  <span className="switch-desc">Door protective rub-strips</span>
                                </div>
                                <Switch
                                  checked={carConfig.hasSideMoldings}
                                  onCheckedChange={(checked) => setCarConfig({ ...carConfig, hasSideMoldings: checked })}
                                />
                              </div>
                            </>
                          )}
                          {vehicleType === 'push-cart' && (
                            <>
                              <div className="switch-row">
                                <div className="switch-meta">
                                  <span className="switch-label">Tarazu Balance Scale</span>
                                  <span className="switch-desc">Dual brass pans with iron weight blocks</span>
                                </div>
                                <Switch
                                  checked={pushCartConfig.hasScale}
                                  onCheckedChange={(checked) => setPushCartConfig({ ...pushCartConfig, hasScale: checked })}
                                />
                              </div>
                              <div className="switch-row">
                                <div className="switch-meta">
                                  <span className="switch-label">Produce Baskets</span>
                                  <span className="switch-desc">Fresh tomatoes, eggplants, cabbages & lemons</span>
                                </div>
                                <Switch
                                  checked={pushCartConfig.hasProduce}
                                  onCheckedChange={(checked) => setPushCartConfig({ ...pushCartConfig, hasProduce: checked })}
                                />
                              </div>
                              <div className="switch-row">
                                <div className="switch-meta">
                                  <span className="switch-label">Vendor Sun Umbrella</span>
                                  <span className="switch-desc">Striped red and yellow bazaar canopy</span>
                                </div>
                                <Switch
                                  checked={pushCartConfig.hasUmbrella}
                                  onCheckedChange={(checked) => setPushCartConfig({ ...pushCartConfig, hasUmbrella: checked })}
                                />
                              </div>
                              <div className="switch-row">
                                <div className="switch-meta">
                                  <span className="switch-label">Hanging Market Bulb</span>
                                  <span className="switch-desc">Evening bazaar glowing incandescent light</span>
                                </div>
                                <Switch
                                  checked={pushCartConfig.hasHangingBulb}
                                  onCheckedChange={(checked) => setPushCartConfig({ ...pushCartConfig, hasHangingBulb: checked })}
                                />
                              </div>
                              <div className="switch-row">
                                <div className="switch-meta">
                                  <span className="switch-label">Jute Hessian Sacks</span>
                                  <span className="switch-desc">Potato and onion storage sacks</span>
                                </div>
                                <Switch
                                  checked={pushCartConfig.hasJuteSacks}
                                  onCheckedChange={(checked) => setPushCartConfig({ ...pushCartConfig, hasJuteSacks: checked })}
                                />
                              </div>
                            </>
                          )}

                          {vehicleType === 'hand-cart' && (
                            <>
                              <div className="switch-row">
                                <div className="switch-meta">
                                  <span className="switch-label">Cargo Burlap Sacks</span>
                                  <span className="switch-desc">Stacked grain & wholesale cargo sacks</span>
                                </div>
                                <Switch
                                  checked={handCartConfig.hasCargoSacks}
                                  onCheckedChange={(checked) => setHandCartConfig({ ...handCartConfig, hasCargoSacks: checked })}
                                />
                              </div>
                              <div className="switch-row">
                                <div className="switch-meta">
                                  <span className="switch-label">Wooden Shipping Crates</span>
                                  <span className="switch-desc">Timber box with forged iron strapping</span>
                                </div>
                                <Switch
                                  checked={handCartConfig.hasCrates}
                                  onCheckedChange={(checked) => setHandCartConfig({ ...handCartConfig, hasCrates: checked })}
                                />
                              </div>
                              <div className="switch-row">
                                <div className="switch-meta">
                                  <span className="switch-label">Cargo Rope Lashings</span>
                                  <span className="switch-desc">Jute tension rope securing cargo load</span>
                                </div>
                                <Switch
                                  checked={handCartConfig.hasRopeLashing}
                                  onCheckedChange={(checked) => setHandCartConfig({ ...handCartConfig, hasRopeLashing: checked })}
                                />
                              </div>
                              <div className="switch-row">
                                <div className="switch-meta">
                                  <span className="switch-label">Forged Iron L-Plates</span>
                                  <span className="switch-desc">Corner reinforcing plates & tie rings</span>
                                </div>
                                <Switch
                                  checked={handCartConfig.hasIronCornerBrackets}
                                  onCheckedChange={(checked) => setHandCartConfig({ ...handCartConfig, hasIronCornerBrackets: checked })}
                                />
                              </div>
                            </>
                          )}

                          {vehicleType === 'garbage-bins' && (
                            <>
                              <div className="switch-row">
                                <div className="switch-meta">
                                  <span className="switch-label">Twin Segregated Dustbins</span>
                                  <span className="switch-desc">Green (Wet Waste) & Blue (Dry Waste)</span>
                                </div>
                                <Switch
                                  checked={garbageConfig.hasTwinSegregationBins}
                                  onCheckedChange={(checked) => setGarbageConfig({ ...garbageConfig, hasTwinSegregationBins: checked })}
                                />
                              </div>
                              <div className="switch-row">
                                <div className="switch-meta">
                                  <span className="switch-label">Concrete Roadside Drum</span>
                                  <span className="switch-desc">Heavy precast concrete municipal barrel</span>
                                </div>
                                <Switch
                                  checked={garbageConfig.hasConcreteDrum}
                                  onCheckedChange={(checked) => setGarbageConfig({ ...garbageConfig, hasConcreteDrum: checked })}
                                />
                              </div>
                              <div className="switch-row">
                                <div className="switch-meta">
                                  <span className="switch-label">Street Clutter Details</span>
                                  <span className="switch-desc">Chai cups, cardboard box, crushed can</span>
                                </div>
                                <Switch
                                  checked={garbageConfig.hasStreetClutter}
                                  onCheckedChange={(checked) => setGarbageConfig({ ...garbageConfig, hasStreetClutter: checked })}
                                />
                              </div>
                            </>
                          )}

                          {vehicleType === 'motorcycle' && (
                            <>
                              <div className="switch-row">
                                <div className="switch-meta">
                                  <span className="switch-label">Engine Crash Guard</span>
                                  <span className="switch-desc">Heavy-duty chrome tubular leg guard</span>
                                </div>
                                <Switch
                                  checked={motorcycleConfig.hasCrashGuard}
                                  onCheckedChange={(checked) => setMotorcycleConfig({ ...motorcycleConfig, hasCrashGuard: checked })}
                                />
                              </div>
                              <div className="switch-row">
                                <div className="switch-meta">
                                  <span className="switch-label">Traditional Saree Guard</span>
                                  <span className="switch-desc">Rear wheel mesh protective stay</span>
                                </div>
                                <Switch
                                  checked={motorcycleConfig.hasSareeGuard}
                                  onCheckedChange={(checked) => setMotorcycleConfig({ ...motorcycleConfig, hasSareeGuard: checked })}
                                />
                              </div>
                              <div className="switch-row">
                                <div className="switch-meta">
                                  <span className="switch-label">Rear Luggage Carrier</span>
                                  <span className="switch-desc">Chrome luggage rack and grab rail</span>
                                </div>
                                <Switch
                                  checked={motorcycleConfig.hasLuggageCarrier}
                                  onCheckedChange={(checked) => setMotorcycleConfig({ ...motorcycleConfig, hasLuggageCarrier: checked })}
                                />
                              </div>
                            </>
                          )}

                          {vehicleType === 'bicycle' && (
                            <>
                              <div className="switch-row">
                                <div className="switch-meta">
                                  <span className="switch-label">Double Top-Tube Frame</span>
                                  <span className="switch-desc">Iconic heavy-duty double-bar frame</span>
                                </div>
                                <Switch
                                  checked={bicycleConfig.hasDoubleTopTube}
                                  onCheckedChange={(checked) => setBicycleConfig({ ...bicycleConfig, hasDoubleTopTube: checked })}
                                />
                              </div>
                              <div className="switch-row">
                                <div className="switch-meta">
                                  <span className="switch-label">Full Enclosed Chaincase</span>
                                  <span className="switch-desc">Full steel protective chain cover</span>
                                </div>
                                <Switch
                                  checked={bicycleConfig.hasChainCover}
                                  onCheckedChange={(checked) => setBicycleConfig({ ...bicycleConfig, hasChainCover: checked })}
                                />
                              </div>
                              <div className="switch-row">
                                <div className="switch-meta">
                                  <span className="switch-label">Rear Luggage Carrier</span>
                                  <span className="switch-desc">Steel carrier rack with spring clip</span>
                                </div>
                                <Switch
                                  checked={bicycleConfig.hasCarrier}
                                  onCheckedChange={(checked) => setBicycleConfig({ ...bicycleConfig, hasCarrier: checked })}
                                />
                              </div>
                              <div className="switch-row">
                                <div className="switch-meta">
                                  <span className="switch-label">Bottle Dynamo & Headlamp</span>
                                  <span className="switch-desc">Wheel-powered vintage bullet light</span>
                                </div>
                                <Switch
                                  checked={bicycleConfig.hasDynamoLight}
                                  onCheckedChange={(checked) => setBicycleConfig({ ...bicycleConfig, hasDynamoLight: checked })}
                                />
                              </div>
                            </>
                          )}

                          {vehicleType === 'auto-rickshaw' && (
                            <>
                              <div className="switch-row">
                                <div className="switch-meta">
                                  <span className="switch-label">Cockpit Fare Meter</span>
                                  <span className="switch-desc">Iconic fare meter box on A-pillar</span>
                                </div>
                                <Switch
                                  checked={autoConfig.hasFareMeter}
                                  onCheckedChange={(checked) => setAutoConfig({ ...autoConfig, hasFareMeter: checked })}
                                />
                              </div>
                              <div className="switch-row">
                                <div className="switch-meta">
                                  <span className="switch-label">Rolled Weather Curtains</span>
                                  <span className="switch-desc">Rollable rexine weather curtains</span>
                                </div>
                                <Switch
                                  checked={autoConfig.hasCurtains}
                                  onCheckedChange={(checked) => setAutoConfig({ ...autoConfig, hasCurtains: checked })}
                                />
                              </div>
                              <div className="switch-row">
                                <div className="switch-meta">
                                  <span className="switch-label">Front Crash Bumper</span>
                                  <span className="switch-desc">Heavy-duty tubular front bumper</span>
                                </div>
                                <Switch
                                  checked={autoConfig.hasFrontBumper}
                                  onCheckedChange={(checked) => setAutoConfig({ ...autoConfig, hasFrontBumper: checked })}
                                />
                              </div>
                            </>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                </TabsContent>

                {/* Tab 3: Lighting */}
                <TabsContent value="lighting" className="radix-tabs-content">
                  <div className="inspector-section">
                    <span className="section-label">TIME OF DAY & ATMOSPHERE</span>
                    <div className="lighting-preset-grid">
                      {lightingPresets.map((p) => {
                        const Icon = p.icon;
                        const isSelected = lightingPreset === p.id;
                        return (
                          <button
                            key={p.id}
                            className={`lighting-card ${isSelected ? 'selected' : ''}`}
                            onClick={() => setLightingPreset(p.id)}
                          >
                            <div className="lighting-card-top">
                              <Icon size={16} className="lighting-icon" />
                              <span className="lighting-title">{p.name}</span>
                            </div>
                            <span className="lighting-desc">{p.sub}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </aside>
          )}
        </div>
      </div>
    </div>
  );
};
