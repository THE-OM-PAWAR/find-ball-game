import React from 'react';
import { Footprints, RotateCcw } from 'lucide-react';
import { Switch } from '../ui/Switch';
import { LEVEL_GAMEPLAY_MARKERS, type LevelGameplayMarker } from '../3d/level/LevelMarkers';
import { LEVEL_BOUNDS } from '../3d/level/LevelZones';

export interface LevelBlueprintConfig {
  viewMode: 'top_down' | 'perspective_3d' | 'player_walkthrough';
  showMarkers: boolean;
  showLabels: boolean;
  showGrid: boolean;
  activeRouteFilter: 'all' | 'retrieval' | 'escape' | 'dog_patrol';
  selectedMarkerId: string | null;
}

export const DEFAULT_LEVEL_BLUEPRINT_CONFIG: LevelBlueprintConfig = {
  viewMode: 'top_down',
  showMarkers: true,
  showLabels: true,
  showGrid: true,
  activeRouteFilter: 'all',
  selectedMarkerId: null,
};

interface LevelBlueprintInspectorProps {
  config: LevelBlueprintConfig;
  onConfigChange: (config: LevelBlueprintConfig) => void;
}

export const LevelBlueprintInspectorTab1: React.FC<LevelBlueprintInspectorProps> = ({
  config,
  onConfigChange,
}) => {
  return (
    <>
      {/* 1. View & Inspection Mode */}
      <div className="inspector-section">
        <span className="section-label">LEVEL INSPECTOR VIEW MODE</span>
        <div className="segmented-grid">
          <button
            className={`segment-card ${config.viewMode === 'top_down' ? 'selected' : ''}`}
            onClick={() => onConfigChange({ ...config, viewMode: 'top_down' })}
          >
            <span className="card-title">📐 Top-Down Blueprint (XZ)</span>
            <span className="card-subtitle">2D Orthographic architectural schematic plan</span>
          </button>

          <button
            className={`segment-card ${config.viewMode === 'perspective_3d' ? 'selected' : ''}`}
            onClick={() => onConfigChange({ ...config, viewMode: 'perspective_3d' })}
          >
            <span className="card-title">🧊 3D Perspective Orbit</span>
            <span className="card-subtitle">Inspect heights, roof elevations & jumps in 3D</span>
          </button>

          <button
            className={`segment-card ${config.viewMode === 'player_walkthrough' ? 'selected' : ''}`}
            onClick={() => onConfigChange({ ...config, viewMode: 'player_walkthrough' })}
          >
            <span className="card-title">🚶 Live Player Walkthrough</span>
            <span className="card-subtitle">Test movement, stair ascent and gully scaling directly</span>
          </button>
        </div>
      </div>

      {/* 2. Route Path Filter */}
      <div className="inspector-section">
        <span className="section-label">TRAVERSAL PATH FILTER</span>
        <div className="button-group-row" style={{ flexWrap: 'wrap' }}>
          {[
            { id: 'all', label: '🌐 All Routes (Complete Map)' },
            { id: 'retrieval', label: '🏏 Ball Retrieval (01 → 08)' },
            { id: 'escape', label: '🚪 Society Escape (08 → 10)' },
            { id: 'dog_patrol', label: '🐕 Dog Patrol Loop' },
          ].map((filter) => (
            <button
              key={filter.id}
              className={`pill-button ${config.activeRouteFilter === filter.id ? 'active' : ''}`}
              onClick={() => onConfigChange({ ...config, activeRouteFilter: filter.id as any })}
            >
              {filter.label}
            </button>
          ))}
        </div>
      </div>

      {/* 3. 10-Step Mission Traversal Checklist */}
      <div className="inspector-section">
        <div className="section-header-row">
          <span className="section-label">10-STEP LEVEL PROGRESSION</span>
          <Footprints size={13} className="section-header-icon" />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', maxHeight: '280px', overflowY: 'auto' }}>
          {LEVEL_GAMEPLAY_MARKERS.map((marker: LevelGameplayMarker) => {
            const isSelected = config.selectedMarkerId === marker.id;
            return (
              <div
                key={marker.id}
                onClick={() =>
                  onConfigChange({
                    ...config,
                    selectedMarkerId: isSelected ? null : marker.id,
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
                    width: '22px',
                    height: '22px',
                    borderRadius: '4px',
                    backgroundColor: marker.color,
                    color: '#000',
                    fontSize: '11px',
                    fontWeight: 700,
                  }}
                >
                  {marker.stepNumber}
                </span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: '12px', fontWeight: 600, color: '#f8fafc' }}>
                      {marker.icon} {marker.name}
                    </span>
                    <span style={{ fontSize: '10px', color: '#94a3b8', background: 'rgba(0,0,0,0.3)', padding: '1px 5px', borderRadius: '3px' }}>
                      +{marker.elevationMeters.toFixed(1)}m
                    </span>
                  </div>
                  <span style={{ fontSize: '11px', color: '#64748b', display: 'block', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                    {marker.description}
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

export const LevelBlueprintInspectorTab2: React.FC<LevelBlueprintInspectorProps> = ({
  config,
  onConfigChange,
}) => {
  return (
    <>
      {/* 1. HUD & Visualization Overlays */}
      <div className="inspector-section">
        <span className="section-label">BLUEPRINT VISUALIZATION OVERLAYS</span>

        <div className="feature-toggle-row">
          <div className="toggle-meta">
            <span className="toggle-title">Interactive 3D Pin Markers</span>
            <span className="toggle-sub">Laser pins and vertical altitude indicators</span>
          </div>
          <Switch
            checked={config.showMarkers}
            onCheckedChange={(checked) => onConfigChange({ ...config, showMarkers: checked })}
          />
        </div>

        <div className="feature-toggle-row" style={{ marginTop: '10px' }}>
          <div className="toggle-meta">
            <span className="toggle-title">Architectural Zone Labels</span>
            <span className="toggle-sub">House, Dog Zone, Staircase and Exit tags</span>
          </div>
          <Switch
            checked={config.showLabels}
            onCheckedChange={(checked) => onConfigChange({ ...config, showLabels: checked })}
          />
        </div>

        <div className="feature-toggle-row" style={{ marginTop: '10px' }}>
          <div className="toggle-meta">
            <span className="toggle-title">35m × 35m Real-Scale Grid</span>
            <span className="toggle-sub">1m subdivisions with North/South compass</span>
          </div>
          <Switch
            checked={config.showGrid}
            onCheckedChange={(checked) => onConfigChange({ ...config, showGrid: checked })}
          />
        </div>
      </div>

      {/* 2. Level Design Specs */}
      <div className="inspector-section">
        <span className="section-label">LEVEL 1 ARCHITECTURAL SPECS</span>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '12px', color: '#94a3b8' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
            <span>Total Playable Area:</span>
            <strong style={{ color: '#f8fafc' }}>{LEVEL_BOUNDS.width}m × {LEVEL_BOUNDS.depth}m (1,225 m²)</strong>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
            <span>Target Play Duration:</span>
            <strong style={{ color: '#38bdf8' }}>10 - 15 Minutes</strong>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
            <span>Key Hazard / Gatekeeper:</span>
            <strong style={{ color: '#eab308' }}>Guard Dog (Staircase)</strong>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
            <span>Vertical Traversal Path:</span>
            <strong style={{ color: '#a855f7' }}>Ground → Roof A → Roof B → Ball</strong>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
            <span>Objective Elevation:</span>
            <strong style={{ color: '#ef4444' }}>+4.85m (South Terrace)</strong>
          </div>
        </div>
      </div>

      {/* 3. Reset Button */}
      <div className="inspector-section">
        <button
          className="secondary-action-btn"
          onClick={() => onConfigChange(DEFAULT_LEVEL_BLUEPRINT_CONFIG)}
          style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
        >
          <RotateCcw size={13} />
          <span>Reset Blueprint Overlays to Default</span>
        </button>
      </div>
    </>
  );
};
