import React from 'react';
import { STUDIO_LIGHTING_PRESETS } from '../../data/studioPresets';
import type { LightingPreset } from '../3d/environment/StudioLighting';

interface LightingInspectorTabProps {
  lightingPreset: LightingPreset;
  onLightingPresetChange: (preset: LightingPreset) => void;
}

export const LightingInspectorTab: React.FC<LightingInspectorTabProps> = ({
  lightingPreset,
  onLightingPresetChange,
}) => {
  return (
    <div className="inspector-section">
      <span className="section-label">TIME OF DAY & ATMOSPHERE</span>
      <div className="lighting-preset-grid">
        {STUDIO_LIGHTING_PRESETS.map((p) => {
          const Icon = p.icon;
          const isSelected = lightingPreset === p.id;
          return (
            <button
              key={p.id}
              className={`lighting-card ${isSelected ? 'selected' : ''}`}
              onClick={() => onLightingPresetChange(p.id)}
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
  );
};
