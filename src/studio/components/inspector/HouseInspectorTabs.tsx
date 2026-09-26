import React from 'react';
import { Palette } from 'lucide-react';
import { Switch } from '../ui/Switch';
import { MASTER_COLOR_PRESETS } from '../../data/studioPresets';
import type { HouseType } from '../HouseStudio';
import type { HouseConfig } from '../3d/houses/IndianTerraceHouse';
import type { ModernHouseConfig } from '../3d/houses/ModernGullyHouse';
import type { StairHouseConfig } from '../3d/houses/SingleStoryStairHouse';
import type { BoxHouseConfig } from '../3d/houses/TwoStoryBoxHouse';
import type { ThreeStoryBoxConfig } from '../3d/houses/ThreeStoryBoxHouse';
import type { ShopComplexConfig } from '../3d/houses/TwoStoryShopComplex';
import type { ThreeStoryShopConfig } from '../3d/houses/ThreeStoryShopComplex';

interface HouseInspectorTabsProps {
  houseType: HouseType;
  onHouseTypeChange: (type: HouseType) => void;
  currentColors: { wall: string; accent: string; trim: string };
  onApplyPresetColors: (wall: string, accent: string, trim: string) => void;
  houseConfig: HouseConfig;
  onHouseConfigChange: (config: HouseConfig) => void;
  modernConfig: ModernHouseConfig;
  onModernConfigChange: (config: ModernHouseConfig) => void;
  stairConfig: StairHouseConfig;
  onStairConfigChange: (config: StairHouseConfig) => void;
  box2Config: BoxHouseConfig;
  onBox2ConfigChange: (config: BoxHouseConfig) => void;
  box3Config: ThreeStoryBoxConfig;
  onBox3ConfigChange: (config: ThreeStoryBoxConfig) => void;
  shop2Config: ShopComplexConfig;
  onShop2ConfigChange: (config: ShopComplexConfig) => void;
  shop3Config: ThreeStoryShopConfig;
  onShop3ConfigChange: (config: ThreeStoryShopConfig) => void;
}

export const HouseInspectorTab1: React.FC<HouseInspectorTabsProps> = ({
  houseType,
  onHouseTypeChange,
  currentColors,
  onApplyPresetColors,
}) => {
  return (
    <>
      {/* 1. House Architecture Selection */}
      <div className="inspector-section">
        <span className="section-label">SELECT ARCHITECTURAL MODEL</span>
        <div className="segmented-grid">
          <button
            className={`segment-card ${houseType === 'shop-2story' ? 'selected' : ''}`}
            onClick={() => onHouseTypeChange('shop-2story')}
          >
            <span className="card-title">🏪 2-Storey Shop Complex</span>
            <span className="card-subtitle">3 Ground Commercial Shops + Rooftop</span>
          </button>

          <button
            className={`segment-card ${houseType === 'shop-3story' ? 'selected' : ''}`}
            onClick={() => onHouseTypeChange('shop-3story')}
          >
            <span className="card-title">🏬 3-Storey Shop Complex</span>
            <span className="card-subtitle">3 Shops + 2 Upper Residential Floors</span>
          </button>

          <button
            className={`segment-card ${houseType === 'box-2story' ? 'selected' : ''}`}
            onClick={() => onHouseTypeChange('box-2story')}
          >
            <span className="card-title">📦 2-Storey Box House</span>
            <span className="card-subtitle">Modern Cubist House with Mumty</span>
          </button>

          <button
            className={`segment-card ${houseType === 'box-3story' ? 'selected' : ''}`}
            onClick={() => onHouseTypeChange('box-3story')}
          >
            <span className="card-title">🏢 3-Storey Box House</span>
            <span className="card-subtitle">Triple Storey Urban Gully Residence</span>
          </button>

          <button
            className={`segment-card ${houseType === 'stair-bungalow' ? 'selected' : ''}`}
            onClick={() => onHouseTypeChange('stair-bungalow')}
          >
            <span className="card-title">🏡 Open-Stair Bungalow</span>
            <span className="card-subtitle">Single-Storey with Exterior Dog-Leg Staircase</span>
          </button>

          <button
            className={`segment-card ${houseType === 'modern-villa' ? 'selected' : ''}`}
            onClick={() => onHouseTypeChange('modern-villa')}
          >
            <span className="card-title">✨ Contemporary Villa</span>
            <span className="card-subtitle">2-Storey with Glass Balcony & Garden</span>
          </button>

          <button
            className={`segment-card ${houseType === 'terrace' ? 'selected' : ''}`}
            onClick={() => onHouseTypeChange('terrace')}
          >
            <span className="card-title">🧱 Rooftop Terrace House</span>
            <span className="card-subtitle">Traditional Plaster & Sintex Water Tank</span>
          </button>
        </div>
      </div>

      {/* 2. Curated Color Presets */}
      <div className="inspector-section">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span className="section-label" style={{ margin: 0 }}>
            CURATED COLOR PALETTES
          </span>
          <Palette size={13} style={{ color: 'var(--text-muted)' }} />
        </div>
        <div className="palette-choice-list">
          {MASTER_COLOR_PRESETS.map((p, idx) => {
            const isSelected =
              currentColors.wall.toLowerCase() === p.wall.toLowerCase() &&
              currentColors.accent.toLowerCase() === p.accent.toLowerCase();
            return (
              <button
                key={idx}
                className={`palette-card-btn ${isSelected ? 'selected' : ''}`}
                onClick={() => onApplyPresetColors(p.wall, p.accent, p.trim)}
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
  );
};

export const HouseInspectorTab2: React.FC<HouseInspectorTabsProps> = ({
  houseConfig,
  onHouseConfigChange,
}) => {
  return (
    <div className="inspector-section">
      <span className="section-label">ROOFTOP PROPS & ACCESSORIES</span>
      <div className="switch-row-list">
        <div className="switch-row">
          <div className="switch-meta">
            <span className="switch-label">Rooftop Sintex Water Tank</span>
            <span className="switch-desc">500L overhead water storage unit</span>
          </div>
          <Switch
            checked={houseConfig.hasWaterTank}
            onCheckedChange={(checked) => onHouseConfigChange({ ...houseConfig, hasWaterTank: checked })}
          />
        </div>

        <div className="switch-row">
          <div className="switch-meta">
            <span className="switch-label">Dish Satellite Antenna</span>
            <span className="switch-desc">Tata Sky / Airtel rooftop dish</span>
          </div>
          <Switch
            checked={houseConfig.hasDishAntenna}
            onCheckedChange={(checked) => onHouseConfigChange({ ...houseConfig, hasDishAntenna: checked })}
          />
        </div>

        <div className="switch-row">
          <div className="switch-meta">
            <span className="switch-label">Future Floor Steel Rebars</span>
            <span className="switch-desc">Exposed pillar construction rebar rods</span>
          </div>
          <Switch
            checked={houseConfig.hasRebars}
            onCheckedChange={(checked) => onHouseConfigChange({ ...houseConfig, hasRebars: checked })}
          />
        </div>

        <div className="switch-row">
          <div className="switch-meta">
            <span className="switch-label">Rooftop Access Ladder</span>
            <span className="switch-desc">Wall mounted steel pipe ladder</span>
          </div>
          <Switch
            checked={houseConfig.hasLadder}
            onCheckedChange={(checked) => onHouseConfigChange({ ...houseConfig, hasLadder: checked })}
          />
        </div>

        <div className="switch-row">
          <div className="switch-meta">
            <span className="switch-label">Rooftop Clutter & Bricks</span>
            <span className="switch-desc">Old tires, wooden crates, and brick piles</span>
          </div>
          <Switch
            checked={houseConfig.hasClutter}
            onCheckedChange={(checked) => onHouseConfigChange({ ...houseConfig, hasClutter: checked })}
          />
        </div>
      </div>
    </div>
  );
};
