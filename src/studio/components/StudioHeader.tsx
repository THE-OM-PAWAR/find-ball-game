import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ChevronRight,
  Camera,
  Sparkle,
  RotateCcw,
  Volume2,
  VolumeX,
  PanelRightClose,
  PanelRightOpen,
} from 'lucide-react';
import type { VehicleCameraPreset } from './VehicleStudio';

interface StudioHeaderProps {
  isLevelView?: boolean;
  isPlayerView: boolean;
  isDogView?: boolean;
  isNatureView?: boolean;
  isVehicleView: boolean;
  activeCategory: string;
  modelTitle: string;
  cameraPreset: VehicleCameraPreset;
  onCameraPresetChange: (preset: VehicleCameraPreset) => void;
  ballThrows: number;
  onThrowBall: () => void;
  autoRotate: boolean;
  onAutoRotateToggle: () => void;
  soundEnabled: boolean;
  onSoundToggle: () => void;
  inspectorOpen: boolean;
  onInspectorToggle: () => void;
}

export const StudioHeader: React.FC<StudioHeaderProps> = ({
  isLevelView,
  isPlayerView,
  isDogView,
  isNatureView,
  isVehicleView,
  activeCategory,
  modelTitle,
  cameraPreset,
  onCameraPresetChange,
  ballThrows,
  onThrowBall,
  autoRotate,
  onAutoRotateToggle,
  soundEnabled,
  onSoundToggle,
  inspectorOpen,
  onInspectorToggle,
}) => {
  const navigate = useNavigate();

  return (
    <header className="top-header">
      {/* Breadcrumbs */}
      <div className="breadcrumbs">
        <span className="crumb-root" onClick={() => navigate('/studio/map')} style={{ cursor: 'pointer' }}>
          Studio
        </span>
        <ChevronRight size={14} className="crumb-separator" />
        <span className="crumb-segment">
          {isLevelView || activeCategory === 'map' || activeCategory === 'level'
            ? 'Level 1 Map'
            : isPlayerView
            ? 'Player Playground'
            : isDogView || activeCategory === 'dog'
            ? 'Dog AI & Stealth'
            : isNatureView || activeCategory === 'nature'
            ? 'Nature & Foliage'
            : isVehicleView
            ? 'Vehicles & Street Props'
            : activeCategory === 'lighting'
            ? 'Atmosphere & Sky'
            : 'Houses'}
        </span>
        <ChevronRight size={14} className="crumb-separator" />
        <span className="crumb-current">{modelTitle}</span>
      </div>

      {/* Action Tools */}
      <div className="header-toolbar">
        {!isPlayerView && (
          <>
            {/* Camera View Switcher */}
            <div className="camera-pill-group">
              <button
                className={`cam-btn ${cameraPreset === 'reference' ? 'active' : ''}`}
                onClick={() => onCameraPresetChange('reference')}
                title="Perspective 3/4 View"
              >
                <Camera size={13} />
                <span>3/4 View</span>
              </button>
              <button
                className={`cam-btn ${cameraPreset === 'side' ? 'active' : ''}`}
                onClick={() => onCameraPresetChange('side')}
                title="Side Profile"
              >
                <span>Side</span>
              </button>
              <button
                className={`cam-btn ${cameraPreset === 'front' ? 'active' : ''}`}
                onClick={() => onCameraPresetChange('front')}
                title="Front Elevation"
              >
                <span>Front</span>
              </button>
              <button
                className={`cam-btn ${cameraPreset === 'top' ? 'active' : ''}`}
                onClick={() => onCameraPresetChange('top')}
                title="Top-Down Plan"
              >
                <span>Top</span>
              </button>
            </div>

            <button
              className="btn-minimal btn-accent"
              onClick={onThrowBall}
              title="Bowl a tennis ball towards the batsman"
            >
              <Sparkle size={14} />
              <span>Bowl Ball ({ballThrows})</span>
            </button>

            <button
              className={`btn-minimal ${autoRotate ? 'active' : ''}`}
              onClick={onAutoRotateToggle}
              title="Toggle Auto Rotation"
            >
              <RotateCcw size={14} />
              <span>Turntable</span>
            </button>

            <button
              className="btn-icon-minimal"
              onClick={onSoundToggle}
              title="Toggle Ambience Sound"
            >
              {soundEnabled ? <Volume2 size={15} /> : <VolumeX size={15} />}
            </button>
          </>
        )}

        {/* Customizer Panel Toggle */}
        <button
          className={`btn-minimal ${inspectorOpen ? 'active' : ''}`}
          onClick={onInspectorToggle}
          title={inspectorOpen ? 'Hide Customizer Panel' : 'Show Customizer Panel'}
        >
          {inspectorOpen ? <PanelRightClose size={15} /> : <PanelRightOpen size={15} />}
          <span>{inspectorOpen ? 'Hide Panel' : 'Customizer'}</span>
        </button>
      </div>
    </header>
  );
};
