import {
  Home,
  Bike,
  Sun,
  User,
  Sparkles,
  CloudRain,
  Moon,
} from 'lucide-react';
import type {
  StudioCategory,
  StudioLightingPresetOption,
  MasterColorPreset,
  VehicleColorPreset,
} from '../types/studioTypes';

export const STUDIO_CATEGORIES: StudioCategory[] = [
  { id: 'houses', name: 'Houses & Complexes', route: '/studio/houses', icon: Home, count: '7 models' },
  { id: 'bikes', name: 'Vehicles & Street Props', route: '/studio/bikes', icon: Bike, count: '8 street props' },
  { id: 'player', name: 'Player Playground', route: '/studio/player', icon: User, count: 'QA Sandbox' },
  { id: 'lighting', name: 'Atmosphere & Sky', route: '/studio/lighting', icon: Sun, count: '4 presets' },
];

export const STUDIO_LIGHTING_PRESETS: StudioLightingPresetOption[] = [
  { id: 'afternoon', name: 'Lazy Afternoon', sub: 'Warm Golden Sunlight', icon: Sun },
  { id: 'sunset', name: 'Gully Sunset', sub: 'Vibrant Orange Horizon', icon: Sparkles },
  { id: 'monsoon', name: 'Monsoon Overcast', sub: 'Cool Soft Diffused Sky', icon: CloudRain },
  { id: 'night', name: 'Night Cricket', sub: 'Deep Twilight Atmosphere', icon: Moon },
];

export const MASTER_COLOR_PRESETS: MasterColorPreset[] = [
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

export const VEHICLE_COLOR_PRESETS: VehicleColorPreset[] = [
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
