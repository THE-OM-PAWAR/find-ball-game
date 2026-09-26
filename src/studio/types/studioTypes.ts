import type { LucideIcon } from 'lucide-react';
import type { LightingPreset } from '../components/3d/environment/StudioLighting';

export interface StudioCategory {
  id: string;
  name: string;
  route: string;
  icon: LucideIcon;
  count: string;
}

export interface StudioLightingPresetOption {
  id: LightingPreset;
  name: string;
  sub: string;
  icon: LucideIcon;
}

export interface MasterColorPreset {
  name: string;
  sub: string;
  wall: string;
  accent: string;
  trim: string;
}

export interface VehicleColorPreset {
  name: string;
  sub: string;
  color: string;
  accent: string;
}
