import React from 'react';
import { Footprints, RotateCcw, Home } from 'lucide-react';
import { Switch } from '../ui/Switch';
import {
  LEVEL_1_HOUSES,
  LEVEL_1_LANDMARKS,
  MAP_DIMENSIONS,
  type MapBuildingConfig,
  type MapLandmarkMarker,
} from '../../../map/data/mapLayoutData';

export interface MapStudioConfig {
  showWaypoints: boolean;
  showZoneLabels: boolean;
  showPitchMarkings: boolean;
  selectedLandmarkId: string | null;
}

export const DEFAULT_MAP_STUDIO_CONFIG: MapStudioConfig = {
  showWaypoints: true,
  showZoneLabels: true,
  showPitchMarkings: true,
  selectedLandmarkId: null,
};

interface MapInspectorTabsProps {
  config: MapStudioConfig;
  onConfigChange: (config: MapStudioConfig) => void;
}

export const MapInspectorTab1: React.FC<MapInspectorTabsProps> = ({ config, onConfigChange }) => {
  return (
    <>
      {/* 1. Visual Layer Overlays */}
      <div className="inspector-section">
        <span className="section-label">LEVEL 1 BLUEPRINT OVERLAYS</span>

        <div className="feature-toggle-row">
          <div className="toggle-meta">
            <span className="toggle-title">Objective Ball Beacon (+6.48m)</span>
            <span className="toggle-sub">Red light beam & HUD badge on House 10 roof</span>
          </div>
          <Switch
            checked={config.showWaypoints}
            onCheckedChange={(checked) => onConfigChange({ ...config, showWaypoints: checked })}
          />
        </div>

        <div className="feature-toggle-row" style={{ marginTop: '10px' }}>
          <div className="toggle-meta">
            <span className="toggle-title">Landmark Badges & Markers</span>
            <span className="toggle-sub">Floating 3D world tags for key locations</span>
          </div>
          <Switch
            checked={config.showZoneLabels}
            onCheckedChange={(checked) => onConfigChange({ ...config, showZoneLabels: checked })}
          />
        </div>

        <div className="feature-toggle-row" style={{ marginTop: '10px' }}>
          <div className="toggle-meta">
            <span className="toggle-title">Cricket Pitch & Brick Wickets</span>
            <span className="toggle-sub">Worn clay strip, chalk crease, brick stumps & bat</span>
          </div>
          <Switch
            checked={config.showPitchMarkings}
            onCheckedChange={(checked) => onConfigChange({ ...config, showPitchMarkings: checked })}
          />
        </div>
      </div>

      {/* 2. Traversal Landmark Directory */}
      <div className="inspector-section">
        <div className="section-header-row">
          <span className="section-label">GAMEPLAY TRAVERSAL LANDMARKS</span>
          <Footprints size={13} className="section-header-icon" />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', maxHeight: '300px', overflowY: 'auto' }}>
          {LEVEL_1_LANDMARKS.map((landmark: MapLandmarkMarker) => {
            const isSelected = config.selectedLandmarkId === landmark.id;
            return (
              <div
                key={landmark.id}
                onClick={() =>
                  onConfigChange({
                    ...config,
                    selectedLandmarkId: isSelected ? null : landmark.id,
                  })
                }
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '8px 10px',
                  borderRadius: '6px',
                  background: isSelected ? 'rgba(56, 189, 248, 0.16)' : 'rgba(255, 255, 255, 0.03)',
                  border: isSelected ? '1px solid rgba(56, 189, 248, 0.4)' : '1px solid rgba(255, 255, 255, 0.06)',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
              >
                <span
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '24px',
                    height: '24px',
                    borderRadius: '4px',
                    backgroundColor: landmark.color,
                    color: '#000',
                    fontSize: '12px',
                    flexShrink: 0,
                  }}
                >
                  {landmark.icon}
                </span>

                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: '12px', fontWeight: 600, color: '#f8fafc' }}>
                      {landmark.name}
                    </span>
                    <span style={{ fontSize: '10px', color: '#94a3b8' }}>
                      Y={landmark.position[1]}m
                    </span>
                  </div>
                  <span
                    style={{
                      fontSize: '11px',
                      color: '#64748b',
                      display: 'block',
                      textOverflow: 'ellipsis',
                      overflow: 'hidden',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {landmark.description}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
};

export const MapInspectorTab2: React.FC<MapInspectorTabsProps> = ({ onConfigChange }) => {
  return (
    <>
      {/* 1. 14 Houses Inventory */}
      <div className="inspector-section">
        <div className="section-header-row">
          <span className="section-label">14 HOUSES INVENTORY (DENSE MOHALLA)</span>
          <Home size={13} className="section-header-icon" />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', maxHeight: '320px', overflowY: 'auto' }}>
          {LEVEL_1_HOUSES.map((house: MapBuildingConfig, idx: number) => (
            <div
              key={house.id}
              style={{
                padding: '8px',
                borderRadius: '6px',
                background: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid rgba(255, 255, 255, 0.06)',
                fontSize: '11px',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2px' }}>
                <strong style={{ color: '#38bdf8', fontSize: '12px' }}>
                  #{idx + 1} {house.name}
                </strong>
                <span
                  style={{
                    background: 'rgba(255, 255, 255, 0.08)',
                    padding: '1px 5px',
                    borderRadius: '3px',
                    color: '#94a3b8',
                    fontSize: '10px',
                  }}
                >
                  {house.component}
                </span>
              </div>
              <div style={{ color: '#64748b' }}>
                Pos: [{house.position.map((v: number) => v.toFixed(1)).join(', ')}] • {house.description}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 2. Level Design Specifications */}
      <div className="inspector-section">
        <span className="section-label">MAP SPECIFICATIONS</span>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '12px', color: '#94a3b8' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
            <span>Playable Ground Footprint:</span>
            <strong style={{ color: '#f8fafc' }}>
              {MAP_DIMENSIONS.width}m × {MAP_DIMENSIONS.depth}m (2,500 m²)
            </strong>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
            <span>Total Houses Deployed:</span>
            <strong style={{ color: '#22c55e' }}>14 Instances (Zero IndianTerraceHouse)</strong>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
            <span>First Climbable Structure:</span>
            <strong style={{ color: '#06b6d4' }}>House 1 (Open 16-Step Staircase)</strong>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
            <span>Target Objective Ball:</span>
            <strong style={{ color: '#ef4444' }}>House 10 Rooftop (+6.48m)</strong>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
            <span>Extraction Exit:</span>
            <strong style={{ color: '#ec4899' }}>North-West Society Gate</strong>
          </div>
        </div>
      </div>

      {/* 3. Reset Button */}
      <div className="inspector-section">
        <button
          className="secondary-action-btn"
          onClick={() => onConfigChange(DEFAULT_MAP_STUDIO_CONFIG)}
          style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
        >
          <RotateCcw size={13} />
          <span>Reset Map Visuals to Default</span>
        </button>
      </div>
    </>
  );
};
