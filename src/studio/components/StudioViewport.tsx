import React from 'react';
import { HouseStudio } from './HouseStudio';
import { VehicleStudio } from './VehicleStudio';
import { NatureStudio } from './NatureStudio';
import { DogStudio } from './DogStudio';
import { PlayerPlaygroundStudio } from './PlayerPlaygroundStudio';
import { LevelBlueprintStudio } from './LevelBlueprintStudio';
import type { StudioState } from '../hooks/useStudioState';

interface StudioViewportProps {
  state: StudioState;
}

export const StudioViewport: React.FC<StudioViewportProps> = ({ state }) => {
  const {
    isLevelView,
    levelConfig,
    isPlayerView,
    isDogView,
    isNatureView,
    isVehicleView,
    lightingPreset,
    playerParams,
    cameraParams,
    showColliderDebug,
    dogConfig,
    showDogDebug,
    natureType,
    smallTreeConfig,
    largeTreeConfig,
    pottedPlantConfig,
    bushConfig,
    grassPatchConfig,
    fallenLeavesConfig,
    vehicleType,
    scooterConfig,
    motorcycleConfig,
    bicycleConfig,
    autoConfig,
    carConfig,
    pushCartConfig,
    handCartConfig,
    garbageConfig,
    autoRotate,
    cameraPreset,
    houseType,
    renderStyle,
    houseConfig,
    modernConfig,
    stairConfig,
    box2Config,
    box3Config,
    shop2Config,
    shop3Config,
  } = state;

  return (
    <div className="canvas-frame">
      {isLevelView ? (
        <LevelBlueprintStudio
          lightingPreset={lightingPreset}
          showMarkers={levelConfig.showMarkers}
          showRoutes={true}
          showLabels={levelConfig.showLabels}
          activeFilter={levelConfig.activeRouteFilter === 'dog_patrol' ? 'all' : (levelConfig.activeRouteFilter as any)}
        />
      ) : isPlayerView ? (
        <PlayerPlaygroundStudio
          lightingPreset={lightingPreset}
          playerParams={playerParams}
          cameraParams={cameraParams}
          showColliderDebug={showColliderDebug}
        />
      ) : isDogView ? (
        <DogStudio
          lightingPreset={lightingPreset}
          dogConfig={dogConfig}
          showDebug={showDogDebug}
        />
      ) : isNatureView ? (
        <NatureStudio
          natureType={natureType}
          lightingPreset={lightingPreset}
          smallTreeConfig={smallTreeConfig}
          largeTreeConfig={largeTreeConfig}
          pottedPlantConfig={pottedPlantConfig}
          bushConfig={bushConfig}
          grassPatchConfig={grassPatchConfig}
          fallenLeavesConfig={fallenLeavesConfig}
          autoRotate={autoRotate}
          cameraPreset={cameraPreset}
        />
      ) : isVehicleView ? (
        <VehicleStudio
          vehicleType={vehicleType}
          lightingPreset={lightingPreset}
          scooterConfig={scooterConfig}
          motorcycleConfig={motorcycleConfig}
          bicycleConfig={bicycleConfig}
          autoConfig={autoConfig}
          carConfig={carConfig}
          pushCartConfig={pushCartConfig}
          handCartConfig={handCartConfig}
          garbageConfig={garbageConfig}
          autoRotate={autoRotate}
          cameraPreset={cameraPreset}
        />
      ) : (
        <HouseStudio
          houseType={houseType}
          lightingPreset={lightingPreset}
          renderStyle={renderStyle}
          houseConfig={houseConfig}
          modernConfig={modernConfig}
          stairConfig={stairConfig}
          box2Config={box2Config}
          box3Config={box3Config}
          shop2Config={shop2Config}
          shop3Config={shop3Config}
          autoRotate={autoRotate}
          showGrid={false}
          cameraPreset={cameraPreset === 'side' ? 'reference' : cameraPreset}
        />
      )}

      {/* Bottom Overlay Hint */}
      <div className="viewport-overlay-hint">
        {isPlayerView || isDogView ? (
          <span>Click inside 3D viewport to lock mouse • <kbd>W A S D</kbd> Move • <kbd>Shift</kbd> Sprint • <kbd>Ctrl</kbd> Crouch Sneak • <kbd>B</kbd> Throw Biscuit</span>
        ) : (
          <span>Hold <kbd>Shift</kbd> + Click to bowl a tennis ball anywhere</span>
        )}
      </div>
    </div>
  );
};
