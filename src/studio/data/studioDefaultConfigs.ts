import type { ScooterConfig } from '../components/3d/vehicles/BajajChetakScooter';
import type { MotorcycleConfig } from '../components/3d/vehicles/IndianMotorcycle';
import type { BicycleConfig } from '../components/3d/vehicles/ClassicIndianBicycle';
import type { AutoRickshawConfig } from '../components/3d/vehicles/AutoRickshaw';
import type { ParkedCarConfig } from '../components/3d/vehicles/ParkedGullyCar';
import type { PushCartConfig } from '../components/3d/vehicles/IndianPushCart';
import type { HandCartConfig } from '../components/3d/vehicles/IndianHandCart';
import type { GarbageBinsConfig } from '../components/3d/vehicles/IndianGarbageBins';

import type { StairHouseConfig } from '../components/3d/houses/SingleStoryStairHouse';
import type { BoxHouseConfig } from '../components/3d/houses/TwoStoryBoxHouse';
import type { ThreeStoryBoxConfig } from '../components/3d/houses/ThreeStoryBoxHouse';
import type { ShopComplexConfig } from '../components/3d/houses/TwoStoryShopComplex';
import type { ThreeStoryShopConfig } from '../components/3d/houses/ThreeStoryShopComplex';
import type { ModernHouseConfig } from '../components/3d/houses/ModernGullyHouse';
import type { HouseConfig } from '../components/3d/houses/IndianTerraceHouse';

export const DEFAULT_SCOOTER_CONFIG: ScooterConfig = {
  bodyColor: '#4e8777',
  seatColor: '#2b211b',
  hasCrashGuard: true,
  hasSpareTire: true,
  hasMirrors: true,
  hasFootrest: true,
};

export const DEFAULT_MOTORCYCLE_CONFIG: MotorcycleConfig = {
  tankColor: '#1e293b',
  seatColor: '#3e2723',
  hasCrashGuard: true,
  hasSareeGuard: true,
  hasMirrors: true,
  hasLuggageCarrier: true,
};

export const DEFAULT_BICYCLE_CONFIG: BicycleConfig = {
  frameColor: '#0f172a',
  hasCarrier: true,
  hasBell: true,
  hasDynamoLight: true,
  hasChainCover: true,
  hasDoubleTopTube: true,
};

export const DEFAULT_AUTO_CONFIG: AutoRickshawConfig = {
  bodyColor: '#15803d',
  roofColor: '#eab308',
  seatColor: '#1f242d',
  hasFareMeter: true,
  hasCurtains: true,
  hasFrontBumper: true,
  hasRearBumper: true,
  hasLuggageNet: true,
};

export const DEFAULT_CAR_CONFIG: ParkedCarConfig = {
  bodyColor: '#e2e8f0',
  hasRoofRack: true,
  hasSideMoldings: true,
  hasMudFlaps: true,
  hasTaxiStrip: false,
  windowTint: 'dark',
};

export const DEFAULT_PUSH_CART_CONFIG: PushCartConfig = {
  hasScale: true,
  hasProduce: true,
  hasUmbrella: true,
  hasHangingBulb: true,
  hasJuteSacks: true,
  woodTone: 'weathered',
};

export const DEFAULT_HAND_CART_CONFIG: HandCartConfig = {
  hasCargoSacks: true,
  hasCrates: true,
  hasRopeLashing: true,
  hasIronCornerBrackets: true,
  woodTone: 'aged',
};

export const DEFAULT_GARBAGE_CONFIG: GarbageBinsConfig = {
  hasConcreteDrum: true,
  hasTwinSegregationBins: true,
  hasStreetClutter: true,
  hasConcretePlinth: true,
};

export const DEFAULT_STAIR_CONFIG: StairHouseConfig = {
  wallColor: '#e0d7c7',
  accentColor: '#2b3642',
  stoneAccentColor: '#524e49',
  trimColor: '#f8fafc',
  hasWaterTank: true,
  hasDishAntenna: true,
  hasCoveLight: true,
  hasFrontGarden: true,
};

export const DEFAULT_BOX2_CONFIG: BoxHouseConfig = {
  wallColor: '#e0d7c7',
  accentColor: '#2b3642',
  trimColor: '#f8fafc',
  hasWaterTank: true,
  hasDishAntenna: true,
  hasACUnit: true,
  hasClothesline: true,
  hasRebars: true,
  hasMumtyCabin: true,
};

export const DEFAULT_BOX3_CONFIG: ThreeStoryBoxConfig = {
  wallColor: '#eae2d5',
  accentColor: '#9e4436',
  trimColor: '#f8fafc',
  hasWaterTank: true,
  hasDishAntenna: true,
  hasACUnits: true,
  hasClothesline: true,
  hasRebars: true,
  hasMumtyCabin: true,
};

export const DEFAULT_SHOP2_CONFIG: ShopComplexConfig = {
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
};

export const DEFAULT_SHOP3_CONFIG: ThreeStoryShopConfig = {
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
};

export const DEFAULT_MODERN_CONFIG: ModernHouseConfig = {
  mainColor: '#ded5c5',
  accentColor: '#1e385c',
  frameColor: '#ffffff',
  hasWaterTank: true,
  hasDishAntenna: true,
  hasPalmTree: true,
  hasStreetLamp: true,
  hasInteriorGlow: true,
};

export const DEFAULT_TERRACE_CONFIG: HouseConfig = {
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
};
