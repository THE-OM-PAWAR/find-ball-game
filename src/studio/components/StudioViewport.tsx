import React from 'react';
import { HouseStudio } from './HouseStudio';
import { VehicleStudio } from './VehicleStudio';
import { PlayerPlaygroundStudio } from './PlayerPlaygroundStudio';
import type { StudioState } from '../hooks/useStudioState';

interface StudioViewportProps {
  state: StudioState;
}

export const StudioViewport: React.FC<StudioViewportProps> = ({ state }) => {
  const {
    isPlayerView,
    isVehicleView,
    lightingPreset,
    playerParams,
    cameraParams,
    showColliderDebug,
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
      {isPlayerView ? (
        <PlayerPlaygroundStudio
          lightingPreset={lightingPreset}
          playerParams={playerParams}
          cameraParams={cameraParams}
          showColliderDebug={showColliderDebug}
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
        {isPlayerView ? (
          <span>Click inside 3D viewport to lock mouse • <kbd>W A S D</kbd> Move • <kbd>Shift</kbd> Sprint • <kbd>Ctrl</kbd> Crouch • <kbd>Space</kbd> Jump</span>
        ) : (
          <span>Hold <kbd>Shift</kbd> + Click to bowl a tennis ball anywhere</span>
        )}
      </div>
    </div>
  );
};
