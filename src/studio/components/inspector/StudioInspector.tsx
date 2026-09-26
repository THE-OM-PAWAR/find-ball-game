import React from 'react';
import { SlidersHorizontal, Ruler } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../ui/Tabs';
import { HouseInspectorTab1, HouseInspectorTab2 } from './HouseInspectorTabs';
import { VehicleInspectorTab1, VehicleInspectorTab2 } from './VehicleInspectorTabs';
import { PlayerInspectorTab1, PlayerInspectorTab2 } from './PlayerInspectorTabs';
import { LightingInspectorTab } from './LightingInspectorTab';
import type { StudioState } from '../../hooks/useStudioState';

interface StudioInspectorProps {
  state: StudioState;
}

export const StudioInspector: React.FC<StudioInspectorProps> = ({ state }) => {
  const {
    isPlayerView,
    isVehicleView,
    getDimensionsText,
    houseType,
    setHouseType,
    currentColors,
    applyPresetColors,
    houseConfig,
    setHouseConfig,
    modernConfig,
    setModernConfig,
    stairConfig,
    setStairConfig,
    box2Config,
    setBox2Config,
    box3Config,
    setBox3Config,
    shop2Config,
    setShop2Config,
    shop3Config,
    setShop3Config,
    vehicleType,
    setVehicleType,
    scooterConfig,
    setScooterConfig,
    motorcycleConfig,
    setMotorcycleConfig,
    bicycleConfig,
    setBicycleConfig,
    autoConfig,
    setAutoConfig,
    carConfig,
    setCarConfig,
    pushCartConfig,
    setPushCartConfig,
    handCartConfig,
    setHandCartConfig,
    garbageConfig,
    setGarbageConfig,
    applyVehiclePresetColor,
    playerParams,
    setPlayerParams,
    cameraParams,
    setCameraParams,
    showColliderDebug,
    setShowColliderDebug,
    lightingPreset,
    setLightingPreset,
  } = state;

  return (
    <aside className="right-inspector">
      {/* Inspector Top Header */}
      <div className="inspector-header">
        <div className="inspector-header-title">
          <SlidersHorizontal size={14} className="inspector-title-icon" />
          <span>Customizer</span>
        </div>
        <span className="status-badge-active">PBR 1:1 Scale</span>
      </div>

      {/* Dimensions Metadata Bar */}
      <div className="dimensions-bar">
        <Ruler size={13} className="ruler-icon" />
        <span>{getDimensionsText()}</span>
      </div>

      {/* Radix Tabs */}
      <Tabs defaultValue="geometry" className="radix-tabs-root">
        <TabsList className="radix-tabs-list">
          <TabsTrigger value="geometry" className="radix-tabs-trigger">
            {isPlayerView ? 'Movement & Physics' : isVehicleView ? 'Props & Vehicles' : 'Architecture'}
          </TabsTrigger>
          <TabsTrigger value="props" className="radix-tabs-trigger">
            {isPlayerView ? 'Camera & Debug' : 'Props & Tuning'}
          </TabsTrigger>
          <TabsTrigger value="lighting" className="radix-tabs-trigger">
            Lighting
          </TabsTrigger>
        </TabsList>

        {/* Tab 1: Primary Selection & Poses */}
        <TabsContent value="geometry" className="radix-tabs-content">
          {isPlayerView ? (
            <PlayerInspectorTab1
              playerParams={playerParams}
              onPlayerParamsChange={setPlayerParams}
              cameraParams={cameraParams}
              onCameraParamsChange={setCameraParams}
              showColliderDebug={showColliderDebug}
              onShowColliderDebugChange={setShowColliderDebug}
            />
          ) : isVehicleView ? (
            <VehicleInspectorTab1
              vehicleType={vehicleType}
              onVehicleTypeChange={setVehicleType}
              scooterConfig={scooterConfig}
              onScooterConfigChange={setScooterConfig}
              motorcycleConfig={motorcycleConfig}
              onMotorcycleConfigChange={setMotorcycleConfig}
              bicycleConfig={bicycleConfig}
              onBicycleConfigChange={setBicycleConfig}
              autoConfig={autoConfig}
              onAutoConfigChange={setAutoConfig}
              carConfig={carConfig}
              onCarConfigChange={setCarConfig}
              pushCartConfig={pushCartConfig}
              onPushCartConfigChange={setPushCartConfig}
              handCartConfig={handCartConfig}
              onHandCartConfigChange={setHandCartConfig}
              garbageConfig={garbageConfig}
              onGarbageConfigChange={setGarbageConfig}
              onApplyVehiclePresetColor={applyVehiclePresetColor}
            />
          ) : (
            <HouseInspectorTab1
              houseType={houseType}
              onHouseTypeChange={setHouseType}
              currentColors={currentColors}
              onApplyPresetColors={applyPresetColors}
              houseConfig={houseConfig}
              onHouseConfigChange={setHouseConfig}
              modernConfig={modernConfig}
              onModernConfigChange={setModernConfig}
              stairConfig={stairConfig}
              onStairConfigChange={setStairConfig}
              box2Config={box2Config}
              onBox2ConfigChange={setBox2Config}
              box3Config={box3Config}
              onBox3ConfigChange={setBox3Config}
              shop2Config={shop2Config}
              onShop2ConfigChange={setShop2Config}
              shop3Config={shop3Config}
              onShop3ConfigChange={setShop3Config}
            />
          )}
        </TabsContent>

        {/* Tab 2: Accessories & Parameter Tuning */}
        <TabsContent value="props" className="radix-tabs-content">
          {isPlayerView ? (
            <PlayerInspectorTab2
              playerParams={playerParams}
              onPlayerParamsChange={setPlayerParams}
              cameraParams={cameraParams}
              onCameraParamsChange={setCameraParams}
              showColliderDebug={showColliderDebug}
              onShowColliderDebugChange={setShowColliderDebug}
            />
          ) : isVehicleView ? (
            <VehicleInspectorTab2
              vehicleType={vehicleType}
              onVehicleTypeChange={setVehicleType}
              scooterConfig={scooterConfig}
              onScooterConfigChange={setScooterConfig}
              motorcycleConfig={motorcycleConfig}
              onMotorcycleConfigChange={setMotorcycleConfig}
              bicycleConfig={bicycleConfig}
              onBicycleConfigChange={setBicycleConfig}
              autoConfig={autoConfig}
              onAutoConfigChange={setAutoConfig}
              carConfig={carConfig}
              onCarConfigChange={setCarConfig}
              pushCartConfig={pushCartConfig}
              onPushCartConfigChange={setPushCartConfig}
              handCartConfig={handCartConfig}
              onHandCartConfigChange={setHandCartConfig}
              garbageConfig={garbageConfig}
              onGarbageConfigChange={setGarbageConfig}
              onApplyVehiclePresetColor={applyVehiclePresetColor}
            />
          ) : (
            <HouseInspectorTab2
              houseType={houseType}
              onHouseTypeChange={setHouseType}
              currentColors={currentColors}
              onApplyPresetColors={applyPresetColors}
              houseConfig={houseConfig}
              onHouseConfigChange={setHouseConfig}
              modernConfig={modernConfig}
              onModernConfigChange={setModernConfig}
              stairConfig={stairConfig}
              onStairConfigChange={setStairConfig}
              box2Config={box2Config}
              onBox2ConfigChange={setBox2Config}
              box3Config={box3Config}
              onBox3ConfigChange={setBox3Config}
              shop2Config={shop2Config}
              onShop2ConfigChange={setShop2Config}
              shop3Config={shop3Config}
              onShop3ConfigChange={setShop3Config}
            />
          )}
        </TabsContent>

        {/* Tab 3: Sky Atmosphere & Lighting */}
        <TabsContent value="lighting" className="radix-tabs-content">
          <LightingInspectorTab
            lightingPreset={lightingPreset}
            onLightingPresetChange={setLightingPreset}
          />
        </TabsContent>
      </Tabs>
    </aside>
  );
};
