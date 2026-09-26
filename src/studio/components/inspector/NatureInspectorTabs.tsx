import React from 'react';
import { Palette, RotateCcw } from 'lucide-react';
import { Switch } from '../ui/Switch';
import {
  BOTANICAL_COLOR_PALETTES,
  type NaturePropType,
  type NatureSmallTreeConfig,
  type NatureLargeTreeConfig,
  type NaturePottedPlantConfig,
  type NatureBushConfig,
  type NatureGrassPatchConfig,
  type NatureFallenLeavesConfig,
  DEFAULT_NATURE_SMALL_TREE,
  DEFAULT_NATURE_LARGE_TREE,
  DEFAULT_NATURE_POTTED_PLANT,
  DEFAULT_NATURE_BUSH,
  DEFAULT_NATURE_GRASS_PATCH,
  DEFAULT_NATURE_FALLEN_LEAVES,
} from '../../data/natureStudioPresets';

interface NatureInspectorTabsProps {
  natureType: NaturePropType;
  onNatureTypeChange: (type: NaturePropType) => void;
  smallTreeConfig: NatureSmallTreeConfig;
  onSmallTreeConfigChange: (config: NatureSmallTreeConfig) => void;
  largeTreeConfig: NatureLargeTreeConfig;
  onLargeTreeConfigChange: (config: NatureLargeTreeConfig) => void;
  pottedPlantConfig: NaturePottedPlantConfig;
  onPottedPlantConfigChange: (config: NaturePottedPlantConfig) => void;
  bushConfig: NatureBushConfig;
  onBushConfigChange: (config: NatureBushConfig) => void;
  grassPatchConfig: NatureGrassPatchConfig;
  onGrassPatchConfigChange: (config: NatureGrassPatchConfig) => void;
  fallenLeavesConfig: NatureFallenLeavesConfig;
  onFallenLeavesConfigChange: (config: NatureFallenLeavesConfig) => void;
  onApplyBotanicalPalette: (foliage: string, highlight: string, accent: string) => void;
}

export const NatureInspectorTab1: React.FC<NatureInspectorTabsProps> = ({
  natureType,
  onNatureTypeChange,
  smallTreeConfig,
  onSmallTreeConfigChange,
  largeTreeConfig,
  onLargeTreeConfigChange,
  pottedPlantConfig,
  onPottedPlantConfigChange,
  bushConfig,
  onBushConfigChange,
  onApplyBotanicalPalette,
}) => {
  return (
    <>
      {/* 1. Prop Selector Grid */}
      <div className="inspector-section">
        <span className="section-label">SELECT BOTANICAL PROP</span>
        <div className="segmented-grid">
          <button
            className={`segment-card ${natureType === 'botanical-oasis' ? 'selected' : ''}`}
            onClick={() => onNatureTypeChange('botanical-oasis')}
          >
            <span className="card-title">🏞️ Courtyard Botanical Oasis</span>
            <span className="card-subtitle">All 6 Indian flora props composed with sandstone bench</span>
          </button>

          <button
            className={`segment-card ${natureType === 'large-tree' ? 'selected' : ''}`}
            onClick={() => onNatureTypeChange('large-tree')}
          >
            <span className="card-title">🌳 Gulmohar & Banyan Tree</span>
            <span className="card-subtitle">Buttress roots, aerial prop roots & fiery blossoms</span>
          </button>

          <button
            className={`segment-card ${natureType === 'small-tree' ? 'selected' : ''}`}
            onClick={() => onNatureTypeChange('small-tree')}
          >
            <span className="card-title">🌲 Neem, Ashoka & Champa</span>
            <span className="card-subtitle">Azadirachta neem, weeping mast tree, frangipani blossoms</span>
          </button>

          <button
            className={`segment-card ${natureType === 'potted-plant' ? 'selected' : ''}`}
            onClick={() => onNatureTypeChange('potted-plant')}
          >
            <span className="card-title">🪴 Tulsi Vrindavan & Potted Plants</span>
            <span className="card-subtitle">Holy Tulsi, snake plant, pothos & red hibiscus</span>
          </button>

          <button
            className={`segment-card ${natureType === 'bush' ? 'selected' : ''}`}
            onClick={() => onNatureTypeChange('bush')}
          >
            <span className="card-title">🌺 Bougainvillea & Marigold Genda</span>
            <span className="card-subtitle">Vivid magenta wall climbers & festive gold marigolds</span>
          </button>

          <button
            className={`segment-card ${natureType === 'grass-patch' ? 'selected' : ''}`}
            onClick={() => onNatureTypeChange('grass-patch')}
          >
            <span className="card-title">🌾 Cynodon (Doob) Grass Patch</span>
            <span className="card-subtitle">Multi-blade tropical tufts with yellow wildflowers</span>
          </button>

          <button
            className={`segment-card ${natureType === 'fallen-leaves' ? 'selected' : ''}`}
            onClick={() => onNatureTypeChange('fallen-leaves')}
          >
            <span className="card-title">🍂 Leaf & Blossom Petal Scatter</span>
            <span className="card-subtitle">Golden-amber leaves and Gulmohar petals</span>
          </button>
        </div>
      </div>

      {/* 2. Species & Variant Selectors */}
      {natureType === 'large-tree' && (
        <div className="inspector-section">
          <span className="section-label">INDIAN TREE SPECIES</span>
          <div className="button-group-row">
            <button
              className={`pill-button ${!largeTreeConfig.isBanyan ? 'active' : ''}`}
              onClick={() => onLargeTreeConfigChange({ ...largeTreeConfig, isBanyan: false, hasFlowers: true })}
            >
              🌺 Gulmohar (Poinciana)
            </button>
            <button
              className={`pill-button ${largeTreeConfig.isBanyan ? 'active' : ''}`}
              onClick={() => onLargeTreeConfigChange({ ...largeTreeConfig, isBanyan: true, hasFlowers: false })}
            >
              🌳 Banyan (Vat-Vriksha)
            </button>
          </div>
        </div>
      )}

      {natureType === 'small-tree' && (
        <div className="inspector-section">
          <span className="section-label">BOTANICAL SPECIES VARIANT</span>
          <div className="button-group-row">
            {(
              [
                { id: 'neem', label: '🌿 Neem (Azadirachta)' },
                { id: 'ashoka', label: '🌲 Ashoka (Mast Tree)' },
                { id: 'champa', label: '🌸 Champa (Frangipani)' },
              ] as const
            ).map((v) => (
              <button
                key={v.id}
                className={`pill-button ${smallTreeConfig.variant === v.id ? 'active' : ''}`}
                onClick={() => onSmallTreeConfigChange({ ...smallTreeConfig, variant: v.id })}
              >
                {v.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {natureType === 'potted-plant' && (
        <div className="inspector-section">
          <span className="section-label">INDIAN FLORA SPECIES</span>
          <div className="segmented-grid" style={{ gridTemplateColumns: 'repeat(2, 1fr)' }}>
            {(
              [
                { id: 'tulsi', label: '🌿 Holy Tulsi', sub: 'Sacred Basil & Manjaris' },
                { id: 'flowering_hibiscus', label: '🌺 Hibiscus (Gudhal)', sub: 'Red Trumpet Flower' },
                { id: 'snake_plant', label: '🌱 Snake Plant', sub: 'Sansevieria Sword' },
                { id: 'money_plant', label: '🍃 Money Plant', sub: 'Pothos & Coir Pole' },
              ] as const
            ).map((sp) => (
              <button
                key={sp.id}
                className={`segment-card ${pottedPlantConfig.plantType === sp.id ? 'selected' : ''}`}
                onClick={() =>
                  onPottedPlantConfigChange({
                    ...pottedPlantConfig,
                    plantType: sp.id,
                    potStyle: sp.id === 'tulsi' ? 'tulsi_vrindavan' : pottedPlantConfig.potStyle,
                  })
                }
              >
                <span className="card-title" style={{ fontSize: '13px' }}>{sp.label}</span>
                <span className="card-subtitle" style={{ fontSize: '11px' }}>{sp.sub}</span>
              </button>
            ))}
          </div>

          <span className="section-label" style={{ marginTop: '14px' }}>PLANTER CONTAINER / VRINDAVAN</span>
          <div className="button-group-row" style={{ flexWrap: 'wrap' }}>
            {(
              [
                { id: 'tulsi_vrindavan', label: '🏛️ Tulsi Vrindavan Chaura' },
                { id: 'terracotta', label: '🏺 Terracotta Clay Gamla' },
                { id: 'ceramic_blue', label: '🔷 Royal Blue Ceramic' },
                { id: 'cement_grey', label: '🔘 Cement Modern' },
                { id: 'white_glazed', label: '⚪ Glazed White' },
              ] as const
            ).map((pot) => (
              <button
                key={pot.id}
                className={`pill-button ${pottedPlantConfig.potStyle === pot.id ? 'active' : ''}`}
                onClick={() => onPottedPlantConfigChange({ ...pottedPlantConfig, potStyle: pot.id })}
              >
                {pot.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {natureType === 'bush' && (
        <div className="inspector-section">
          <span className="section-label">INDIAN SHRUB & HEDGE VARIANT</span>
          <div className="button-group-row" style={{ flexWrap: 'wrap' }}>
            {(
              [
                { id: 'flowering_bougainvillea', label: '🌺 Bougainvillea Climber' },
                { id: 'marigold_genda', label: '🌼 Genda (Marigold) Bush' },
                { id: 'round_shrub', label: '🟢 Evergreen Shrub' },
                { id: 'hedge_row', label: '🟩 Border Hedge' },
              ] as const
            ).map((b) => (
              <button
                key={b.id}
                className={`pill-button ${bushConfig.variant === b.id ? 'active' : ''}`}
                onClick={() => onBushConfigChange({ ...bushConfig, variant: b.id })}
              >
                {b.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* 3. Color Harmonizer Palettes */}
      <div className="inspector-section">
        <div className="section-header-row">
          <span className="section-label">BOTANICAL COLOR HARMONIES</span>
          <Palette size={13} className="section-header-icon" />
        </div>
        <div className="preset-palette-list">
          {BOTANICAL_COLOR_PALETTES.map((pal) => (
            <div
              key={pal.name}
              className="preset-palette-card"
              onClick={() => onApplyBotanicalPalette(pal.foliage, pal.highlight, pal.accent)}
            >
              <div className="palette-color-swatches">
                <span className="color-swatch-dot" style={{ backgroundColor: pal.foliage }} />
                <span className="color-swatch-dot" style={{ backgroundColor: pal.highlight }} />
                <span className="color-swatch-dot" style={{ backgroundColor: pal.accent }} />
              </div>
              <div className="palette-meta">
                <span className="palette-name">{pal.name}</span>
                <span className="palette-sub">{pal.sub}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export const NatureInspectorTab2: React.FC<NatureInspectorTabsProps> = ({
  natureType,
  smallTreeConfig,
  onSmallTreeConfigChange,
  largeTreeConfig,
  onLargeTreeConfigChange,
  pottedPlantConfig,
  onPottedPlantConfigChange,
  bushConfig,
  onBushConfigChange,
  grassPatchConfig,
  onGrassPatchConfigChange,
  fallenLeavesConfig,
  onFallenLeavesConfigChange,
}) => {
  return (
    <>
      {/* 1. Scale & Dimensions Slider */}
      <div className="inspector-section">
        <span className="section-label">OBJECT SCALE MULTIPLIER</span>
        <div className="slider-control-row">
          <div className="slider-header">
            <span>Uniform Scale</span>
            <span className="slider-value">
              {natureType === 'small-tree'
                ? `${smallTreeConfig.scale.toFixed(2)}x`
                : natureType === 'large-tree'
                ? `${largeTreeConfig.scale.toFixed(2)}x`
                : natureType === 'potted-plant'
                ? `${pottedPlantConfig.scale.toFixed(2)}x`
                : natureType === 'bush'
                ? `${bushConfig.scale.toFixed(2)}x`
                : natureType === 'grass-patch'
                ? `${grassPatchConfig.scale.toFixed(2)}x`
                : `${fallenLeavesConfig.scale.toFixed(2)}x`}
            </span>
          </div>
          <input
            type="range"
            min="0.5"
            max="2.0"
            step="0.05"
            value={
              natureType === 'small-tree'
                ? smallTreeConfig.scale
                : natureType === 'large-tree'
                ? largeTreeConfig.scale
                : natureType === 'potted-plant'
                ? pottedPlantConfig.scale
                : natureType === 'bush'
                ? bushConfig.scale
                : natureType === 'grass-patch'
                ? grassPatchConfig.scale
                : fallenLeavesConfig.scale
            }
            onChange={(e) => {
              const val = parseFloat(e.target.value);
              if (natureType === 'small-tree') onSmallTreeConfigChange({ ...smallTreeConfig, scale: val });
              else if (natureType === 'large-tree') onLargeTreeConfigChange({ ...largeTreeConfig, scale: val });
              else if (natureType === 'potted-plant') onPottedPlantConfigChange({ ...pottedPlantConfig, scale: val });
              else if (natureType === 'bush') onBushConfigChange({ ...bushConfig, scale: val });
              else if (natureType === 'grass-patch') onGrassPatchConfigChange({ ...grassPatchConfig, scale: val });
              else onFallenLeavesConfigChange({ ...fallenLeavesConfig, scale: val });
            }}
            className="styled-range-slider"
          />
        </div>
      </div>

      {/* 2. Specific Feature Toggles */}
      <div className="inspector-section">
        <span className="section-label">SPECIAL FEATURES & SCATTER</span>

        {natureType === 'large-tree' && (
          <>
            <div className="feature-toggle-row">
              <div className="toggle-meta">
                <span className="toggle-title">Fiery Gulmohar Blossoms</span>
                <span className="toggle-sub">Scarlet & orange flower clusters and ground petals</span>
              </div>
              <Switch
                checked={largeTreeConfig.hasFlowers}
                onCheckedChange={(checked) => onLargeTreeConfigChange({ ...largeTreeConfig, hasFlowers: checked })}
              />
            </div>

            <div className="feature-toggle-row" style={{ marginTop: '10px' }}>
              <div className="toggle-meta">
                <span className="toggle-title">Hanging Aerial Prop Roots</span>
                <span className="toggle-sub">Sacred Banyan tree aerial pillar roots</span>
              </div>
              <Switch
                checked={largeTreeConfig.isBanyan}
                onCheckedChange={(checked) => onLargeTreeConfigChange({ ...largeTreeConfig, isBanyan: checked })}
              />
            </div>
          </>
        )}

        {natureType === 'small-tree' && (
          <div className="feature-toggle-row">
            <div className="toggle-meta">
              <span className="toggle-title">Base Leaf Scatter</span>
              <span className="toggle-sub">Fallen organic leaf scatter around trunk flare</span>
            </div>
            <Switch
              checked={smallTreeConfig.hasFallenLeaves}
              onCheckedChange={(checked) => onSmallTreeConfigChange({ ...smallTreeConfig, hasFallenLeaves: checked })}
            />
          </div>
        )}

        {natureType === 'grass-patch' && (
          <>
            <div className="slider-control-row" style={{ marginTop: '8px' }}>
              <div className="slider-header">
                <span>Grass Blade Density</span>
                <span className="slider-value">{grassPatchConfig.bladeCount} blades</span>
              </div>
              <input
                type="range"
                min="6"
                max="36"
                step="2"
                value={grassPatchConfig.bladeCount}
                onChange={(e) => onGrassPatchConfigChange({ ...grassPatchConfig, bladeCount: parseInt(e.target.value) })}
                className="styled-range-slider"
              />
            </div>

            <div className="slider-control-row" style={{ marginTop: '12px' }}>
              <div className="slider-header">
                <span>Patch Radius</span>
                <span className="slider-value">{grassPatchConfig.radius.toFixed(2)}m</span>
              </div>
              <input
                type="range"
                min="0.3"
                max="1.2"
                step="0.05"
                value={grassPatchConfig.radius}
                onChange={(e) => onGrassPatchConfigChange({ ...grassPatchConfig, radius: parseFloat(e.target.value) })}
                className="styled-range-slider"
              />
            </div>
          </>
        )}

        {natureType === 'fallen-leaves' && (
          <>
            <div className="slider-control-row" style={{ marginTop: '8px' }}>
              <div className="slider-header">
                <span>Leaf Scatter Density</span>
                <span className="slider-value">{fallenLeavesConfig.count} leaves</span>
              </div>
              <input
                type="range"
                min="6"
                max="40"
                step="2"
                value={fallenLeavesConfig.count}
                onChange={(e) => onFallenLeavesConfigChange({ ...fallenLeavesConfig, count: parseInt(e.target.value) })}
                className="styled-range-slider"
              />
            </div>

            <div className="slider-control-row" style={{ marginTop: '12px' }}>
              <div className="slider-header">
                <span>Scatter Spread Radius</span>
                <span className="slider-value">{fallenLeavesConfig.radius.toFixed(2)}m</span>
              </div>
              <input
                type="range"
                min="0.4"
                max="1.6"
                step="0.05"
                value={fallenLeavesConfig.radius}
                onChange={(e) => onFallenLeavesConfigChange({ ...fallenLeavesConfig, radius: parseFloat(e.target.value) })}
                className="styled-range-slider"
              />
            </div>
          </>
        )}
      </div>

      {/* 3. Reset Defaults */}
      <div className="inspector-section">
        <button
          className="secondary-action-btn"
          onClick={() => {
            onSmallTreeConfigChange(DEFAULT_NATURE_SMALL_TREE);
            onLargeTreeConfigChange(DEFAULT_NATURE_LARGE_TREE);
            onPottedPlantConfigChange(DEFAULT_NATURE_POTTED_PLANT);
            onBushConfigChange(DEFAULT_NATURE_BUSH);
            onGrassPatchConfigChange(DEFAULT_NATURE_GRASS_PATCH);
            onFallenLeavesConfigChange(DEFAULT_NATURE_FALLEN_LEAVES);
          }}
          style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
        >
          <RotateCcw size={13} />
          <span>Reset Nature Configs to Factory Defaults</span>
        </button>
      </div>
    </>
  );
};
