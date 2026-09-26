import React from 'react';
import { useStudioState } from './hooks/useStudioState';
import { StudioSidebar } from './components/StudioSidebar';
import { StudioHeader } from './components/StudioHeader';
import { StudioViewport } from './components/StudioViewport';
import { StudioInspector } from './components/inspector/StudioInspector';

/**
 * Gully 3D Studio - Master Layout Architecture
 * 
 * Modular architecture:
 * - StudioSidebar: Asset categories, search, lore navigation
 * - StudioHeader: Breadcrumbs, camera pills, interactive action toolbar
 * - StudioViewport: 3D canvas router (HouseStudio, VehicleStudio, PlayerPlaygroundStudio)
 * - StudioInspector: Dedicated customizer tabs (Architecture, Vehicles, Player, Lighting)
 * - useStudioState: Centralized state store & presets manager
 */
export const StudioLayout: React.FC = () => {
  const studioState = useStudioState();
  const {
    activeCategory,
    searchQuery,
    setSearchQuery,
    isLevelView,
    isPlayerView,
    isDogView,
    isNatureView,
    isVehicleView,
    getModelTitle,
    cameraPreset,
    setCameraPreset,
    ballThrows,
    handleThrowBall,
    autoRotate,
    setAutoRotate,
    soundEnabled,
    setSoundEnabled,
    inspectorOpen,
    setInspectorOpen,
  } = studioState;

  return (
    <div className="app-shell">
      {/* 1. Category Navigation Sidebar */}
      <StudioSidebar
        activeCategory={activeCategory}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      {/* 2. Main Viewport Workspace */}
      <div className="main-viewport-wrapper">
        {/* Top Header & Action Toolbar */}
        <StudioHeader
          isLevelView={isLevelView}
          isPlayerView={isPlayerView}
          isDogView={isDogView}
          isNatureView={isNatureView}
          isVehicleView={isVehicleView}
          activeCategory={activeCategory}
          modelTitle={getModelTitle()}
          cameraPreset={cameraPreset}
          onCameraPresetChange={setCameraPreset}
          ballThrows={ballThrows}
          onThrowBall={handleThrowBall}
          autoRotate={autoRotate}
          onAutoRotateToggle={() => setAutoRotate(!autoRotate)}
          soundEnabled={soundEnabled}
          onSoundToggle={() => setSoundEnabled(!soundEnabled)}
          inspectorOpen={inspectorOpen}
          onInspectorToggle={() => setInspectorOpen(!inspectorOpen)}
        />

        {/* Viewport and Right Inspector */}
        <div className="workspace-split">
          {/* 3D WebGL Canvas Viewport */}
          <StudioViewport state={studioState} />

          {/* Right Properties Inspector */}
          {inspectorOpen && <StudioInspector state={studioState} />}
        </div>
      </div>
    </div>
  );
};

export default StudioLayout;
