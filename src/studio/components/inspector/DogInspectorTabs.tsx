import React from 'react';
import { Eye, Volume2, RotateCcw } from 'lucide-react';
import { Switch } from '../ui/Switch';
import { DEFAULT_DOG_CONFIG, throwDistractionItem, type DogAIState, type DogConfig } from '../../../components/dog';

interface DogInspectorTabsProps {
  dogConfig: DogConfig;
  onDogConfigChange: (config: DogConfig) => void;
  showDebug: boolean;
  onShowDebugChange: (show: boolean) => void;
}

export const DogInspectorTab1: React.FC<DogInspectorTabsProps> = ({
  dogConfig,
  onDogConfigChange,
}) => {
  const handleSetStartState = (state: DogAIState) => {
    onDogConfigChange({ ...dogConfig, startState: state });
  };

  const handleSetPatrolPreset = (preset: 'square' | 'alley' | 'shade_tree' | 'stationary') => {
    if (preset === 'square') {
      onDogConfigChange({
        ...dogConfig,
        patrolPoints: [
          { position: [2.5, 0, 1.5], waitTime: 2.0 },
          { position: [-2.5, 0, 1.5], waitTime: 2.0 },
          { position: [-2.5, 0, -2.5], waitTime: 2.0 },
          { position: [2.5, 0, -2.5], waitTime: 2.0 },
        ],
      });
    } else if (preset === 'alley') {
      onDogConfigChange({
        ...dogConfig,
        patrolPoints: [
          { position: [3.5, 0, -6.0], waitTime: 2.5 },
          { position: [3.5, 0, 4.0], waitTime: 2.5 },
        ],
      });
    } else if (preset === 'shade_tree') {
      onDogConfigChange({
        ...dogConfig,
        startState: 'SLEEPING',
        patrolPoints: [
          { position: [6.0, 0, -4.5], waitTime: 5.0 },
          { position: [4.0, 0, -3.0], waitTime: 3.0 },
        ],
      });
    } else {
      onDogConfigChange({
        ...dogConfig,
        startState: 'IDLE',
        patrolPoints: [{ position: [2.5, 0, 0], waitTime: 10.0 }],
      });
    }
  };

  return (
    <>
      {/* 1. Starting AI State */}
      <div className="inspector-section">
        <span className="section-label">AI STARTING STATE</span>
        <div className="segmented-grid" style={{ gridTemplateColumns: 'repeat(2, 1fr)' }}>
          <button
            className={`segment-card ${dogConfig.startState === 'PATROLLING' ? 'selected' : ''}`}
            onClick={() => handleSetStartState('PATROLLING')}
          >
            <span className="card-title">🚶‍♂️ Patrol</span>
            <span className="card-subtitle">Normal alert walk</span>
          </button>

          <button
            className={`segment-card ${dogConfig.startState === 'SLEEPING' ? 'selected' : ''}`}
            onClick={() => handleSetStartState('SLEEPING')}
          >
            <span className="card-title">💤 Sleeping</span>
            <span className="card-subtitle">Low awareness resting</span>
          </button>

          <button
            className={`segment-card ${dogConfig.startState === 'IDLE' ? 'selected' : ''}`}
            onClick={() => handleSetStartState('IDLE')}
          >
            <span className="card-title">🐕 Idle Stand</span>
            <span className="card-subtitle">Sniffing area</span>
          </button>

          <button
            className={`segment-card ${dogConfig.startState === 'ALERT' ? 'selected' : ''}`}
            onClick={() => handleSetStartState('ALERT')}
          >
            <span className="card-title">⚠️ Full Alert</span>
            <span className="card-subtitle">Barking at player</span>
          </button>
        </div>
      </div>

      {/* 2. Patrol Route Presets */}
      <div className="inspector-section">
        <span className="section-label">PATROL ROUTE CIRCUITS</span>
        <div className="button-group-row" style={{ flexWrap: 'wrap' }}>
          <button className="pill-button" onClick={() => handleSetPatrolPreset('square')}>
            Courtyard Square (4 Pts)
          </button>
          <button className="pill-button" onClick={() => handleSetPatrolPreset('alley')}>
            East Alley (2 Pts)
          </button>
          <button className="pill-button" onClick={() => handleSetPatrolPreset('shade_tree')}>
            Under Shade Tree (Sleep)
          </button>
          <button className="pill-button" onClick={() => handleSetPatrolPreset('stationary')}>
            Guard Post (Stationary)
          </button>
        </div>
      </div>

      {/* 3. Gameplay Distraction Action */}
      <div className="inspector-section">
        <span className="section-label">DISTRACTION MECHANICS</span>
        <button
          className="secondary-action-btn"
          onClick={() => throwDistractionItem([0, 0.5, 3.0], [0.3, 0.2, -0.8], 'biscuit', 7.5)}
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            background: 'linear-gradient(135deg, #f59e0b, #d97706)',
            color: '#fff',
            fontWeight: 'bold',
            border: 'none',
          }}
        >
          <span>🦴 Throw Biscuit (Key [B])</span>
        </button>

        <div className="feature-toggle-row" style={{ marginTop: '12px' }}>
          <div className="toggle-meta">
            <span className="toggle-title">Distraction Priority</span>
            <span className="toggle-sub">Dog prioritizes food over searching for sneaking player</span>
          </div>
          <Switch
            checked={dogConfig.distractionPriority}
            onCheckedChange={(checked) => onDogConfigChange({ ...dogConfig, distractionPriority: checked })}
          />
        </div>
      </div>

      {/* 4. Movement Speeds */}
      <div className="inspector-section">
        <span className="section-label">DOG LOCOMOTION SPEED</span>
        <div className="slider-control-row">
          <div className="slider-header">
            <span>Patrol Walk Speed</span>
            <span className="slider-value">{dogConfig.walkSpeed.toFixed(1)} m/s</span>
          </div>
          <input
            type="range"
            min="1.0"
            max="3.0"
            step="0.1"
            value={dogConfig.walkSpeed}
            onChange={(e) => onDogConfigChange({ ...dogConfig, walkSpeed: parseFloat(e.target.value) })}
            className="styled-range-slider"
          />
        </div>

        <div className="slider-control-row" style={{ marginTop: '10px' }}>
          <div className="slider-header">
            <span>Run / Fetch Speed</span>
            <span className="slider-value">{dogConfig.runSpeed.toFixed(1)} m/s</span>
          </div>
          <input
            type="range"
            min="2.5"
            max="6.0"
            step="0.2"
            value={dogConfig.runSpeed}
            onChange={(e) => onDogConfigChange({ ...dogConfig, runSpeed: parseFloat(e.target.value) })}
            className="styled-range-slider"
          />
        </div>
      </div>

      {/* 5. Reset Defaults */}
      <div className="inspector-section">
        <button
          className="secondary-action-btn"
          onClick={() => onDogConfigChange(DEFAULT_DOG_CONFIG)}
          style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
        >
          <RotateCcw size={13} />
          <span>Reset Dog AI Configs to Factory Defaults</span>
        </button>
      </div>
    </>
  );
};

export const DogInspectorTab2: React.FC<DogInspectorTabsProps> = ({
  dogConfig,
  onDogConfigChange,
  showDebug,
  onShowDebugChange,
}) => {
  return (
    <>
      {/* 1. Debug Overlays */}
      <div className="inspector-section">
        <span className="section-label">DEBUG SENSOR OVERLAYS</span>
        <div className="feature-toggle-row">
          <div className="toggle-meta">
            <span className="toggle-title">3D Vision Cone & Hearing Rings</span>
            <span className="toggle-sub">Visual rays, detection meter & waypoint markers</span>
          </div>
          <Switch checked={showDebug} onCheckedChange={onShowDebugChange} />
        </div>
      </div>

      {/* 2. Vision Cone Tuning */}
      <div className="inspector-section">
        <div className="section-header-row">
          <span className="section-label">VISION SENSOR TUNING</span>
          <Eye size={13} className="section-header-icon" />
        </div>

        <div className="slider-control-row">
          <div className="slider-header">
            <span>Vision Range</span>
            <span className="slider-value">{dogConfig.visionRange.toFixed(1)} meters</span>
          </div>
          <input
            type="range"
            min="4.0"
            max="14.0"
            step="0.5"
            value={dogConfig.visionRange}
            onChange={(e) => onDogConfigChange({ ...dogConfig, visionRange: parseFloat(e.target.value) })}
            className="styled-range-slider"
          />
        </div>

        <div className="slider-control-row" style={{ marginTop: '12px' }}>
          <div className="slider-header">
            <span>Vision Cone Angle</span>
            <span className="slider-value">{dogConfig.visionAngle}°</span>
          </div>
          <input
            type="range"
            min="60"
            max="160"
            step="5"
            value={dogConfig.visionAngle}
            onChange={(e) => onDogConfigChange({ ...dogConfig, visionAngle: parseInt(e.target.value) })}
            className="styled-range-slider"
          />
        </div>
      </div>

      {/* 3. Hearing & Sound Detection */}
      <div className="inspector-section">
        <div className="section-header-row">
          <span className="section-label">HEARING & NOISE SENSITIVITY</span>
          <Volume2 size={13} className="section-header-icon" />
        </div>

        <div className="slider-control-row">
          <div className="slider-header">
            <span>Hearing Sensitivity</span>
            <span className="slider-value">{dogConfig.hearingSensitivity.toFixed(1)}x</span>
          </div>
          <input
            type="range"
            min="0.3"
            max="2.5"
            step="0.1"
            value={dogConfig.hearingSensitivity}
            onChange={(e) => onDogConfigChange({ ...dogConfig, hearingSensitivity: parseFloat(e.target.value) })}
            className="styled-range-slider"
          />
        </div>
      </div>

      {/* 4. Timers & Durations */}
      <div className="inspector-section">
        <span className="section-label">BEHAVIOR TIMERS & DURATIONS</span>

        <div className="slider-control-row">
          <div className="slider-header">
            <span>Distraction Eating Safe Window</span>
            <span className="slider-value">{dogConfig.distractedDuration.toFixed(1)}s</span>
          </div>
          <input
            type="range"
            min="2.0"
            max="12.0"
            step="0.5"
            value={dogConfig.distractedDuration}
            onChange={(e) => onDogConfigChange({ ...dogConfig, distractedDuration: parseFloat(e.target.value) })}
            className="styled-range-slider"
          />
        </div>

        <div className="slider-control-row" style={{ marginTop: '12px' }}>
          <div className="slider-header">
            <span>Investigation Duration</span>
            <span className="slider-value">{dogConfig.investigateDuration.toFixed(1)}s</span>
          </div>
          <input
            type="range"
            min="1.5"
            max="8.0"
            step="0.5"
            value={dogConfig.investigateDuration}
            onChange={(e) => onDogConfigChange({ ...dogConfig, investigateDuration: parseFloat(e.target.value) })}
            className="styled-range-slider"
          />
        </div>
      </div>
    </>
  );
};
