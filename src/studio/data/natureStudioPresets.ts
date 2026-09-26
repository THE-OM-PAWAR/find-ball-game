export type NaturePropType =
  | 'small-tree'
  | 'large-tree'
  | 'potted-plant'
  | 'bush'
  | 'grass-patch'
  | 'fallen-leaves'
  | 'botanical-oasis';

export interface NatureSmallTreeConfig {
  variant: 'neem' | 'ashoka' | 'champa' | 'round' | 'conical' | 'flowering';
  foliageColor: string;
  highlightColor: string;
  trunkColor: string;
  hasFallenLeaves: boolean;
  scale: number;
}

export interface NatureLargeTreeConfig {
  hasFlowers: boolean;
  isBanyan: boolean;
  foliageColor: string;
  blossomColor: string;
  trunkColor: string;
  scale: number;
}

export interface NaturePottedPlantConfig {
  plantType: 'tulsi' | 'snake_plant' | 'money_plant' | 'flowering_hibiscus';
  potStyle: 'terracotta' | 'ceramic_blue' | 'cement_grey' | 'white_glazed' | 'tulsi_vrindavan';
  scale: number;
}

export interface NatureBushConfig {
  variant: 'flowering_bougainvillea' | 'round_shrub' | 'hedge_row' | 'marigold_genda';
  foliageColor: string;
  flowerColor: string;
  scale: number;
}

export interface NatureGrassPatchConfig {
  radius: number;
  bladeCount: number;
  hasFlowers: boolean;
  flowerColor: string;
  scale: number;
}

export interface NatureFallenLeavesConfig {
  count: number;
  radius: number;
  leafColor: string;
  scale: number;
}

export const DEFAULT_NATURE_SMALL_TREE: NatureSmallTreeConfig = {
  variant: 'neem',
  foliageColor: '#1e7f34',
  highlightColor: '#52c41a',
  trunkColor: '#4a3525',
  hasFallenLeaves: true,
  scale: 1.0,
};

export const DEFAULT_NATURE_LARGE_TREE: NatureLargeTreeConfig = {
  hasFlowers: true,
  isBanyan: false,
  foliageColor: '#15803d',
  blossomColor: '#ea580c',
  trunkColor: '#3e2723',
  scale: 1.0,
};

export const DEFAULT_NATURE_POTTED_PLANT: NaturePottedPlantConfig = {
  plantType: 'tulsi',
  potStyle: 'tulsi_vrindavan',
  scale: 1.0,
};

export const DEFAULT_NATURE_BUSH: NatureBushConfig = {
  variant: 'flowering_bougainvillea',
  foliageColor: '#15803d',
  flowerColor: '#ec4899',
  scale: 1.0,
};

export const DEFAULT_NATURE_GRASS_PATCH: NatureGrassPatchConfig = {
  radius: 0.65,
  bladeCount: 18,
  hasFlowers: true,
  flowerColor: '#facc15',
  scale: 1.0,
};

export const DEFAULT_NATURE_FALLEN_LEAVES: NatureFallenLeavesConfig = {
  count: 16,
  radius: 0.85,
  leafColor: '#d97706',
  scale: 1.0,
};

export interface BotanicalColorPalette {
  name: string;
  sub: string;
  foliage: string;
  highlight: string;
  accent: string;
}

export const BOTANICAL_COLOR_PALETTES: BotanicalColorPalette[] = [
  {
    name: 'Vibrant Gully Monsoon',
    sub: 'Lush fresh emerald greens with golden highlights',
    foliage: '#1e7f34',
    highlight: '#52c41a',
    accent: '#ea580c',
  },
  {
    name: 'Fiery Gulmohar Blossom',
    sub: 'Deep canopy green with blaze-orange clusters',
    foliage: '#15803d',
    highlight: '#4ade80',
    accent: '#ea580c',
  },
  {
    name: 'Bougainvillea Magenta Bloom',
    sub: 'Rich forest shrub green with vivid magenta flowers',
    foliage: '#14532d',
    highlight: '#4ade80',
    accent: '#ec4899',
  },
  {
    name: 'Marigold Festival Gold',
    sub: 'Festive gully gold & vermillion marigold tones',
    foliage: '#166534',
    highlight: '#86efac',
    accent: '#f59e0b',
  },
  {
    name: 'Vat Vriksha Sacred Banyan',
    sub: 'Ancient dark banyan foliage with earth prop roots',
    foliage: '#0f5132',
    highlight: '#22c55e',
    accent: '#c25e36',
  },
];
