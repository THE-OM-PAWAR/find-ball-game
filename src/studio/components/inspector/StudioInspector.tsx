import React from 'react';
import { SlidersHorizontal, Ruler } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../ui/Tabs';
import { HouseInspectorTab1, HouseInspectorTab2 } from './HouseInspectorTabs';
import { VehicleInspectorTab1, VehicleInspectorTab2 } from './VehicleInspectorTabs';
import { NatureInspectorTab1, NatureInspectorTab2 } from './NatureInspectorTabs';
import { DogInspectorTab1, DogInspectorTab2 } from './DogInspectorTabs';
import { PlayerInspectorTab1, PlayerInspectorTab2 } from './PlayerInspectorTabs';
import { LevelBlueprintInspectorTab1, LevelBlueprintInspectorTab2 } from './LevelBlueprintInspectorTabs';
import { LightingInspectorTab } from './LightingInspectorTab';
import type { StudioState } from '../../hooks/useStudioState';

interface StudioInspectorProps {
  state: StudioState;
}

export const StudioInspector: React.FC<StudioInspectorProps> = ({ state }) => {
  const {
    isLevelView,
    levelConfig,
    setLevelConfig,
    isPlayerView,
    isDogView,
    isNatureView,
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
    dogConfig,
    setDogConfig,
    showDogDebug,
    setShowDogDebug,
    natureType,
    setNatureType,
    smallTreeConfig,
    setSmallTreeConfig,
    largeTreeConfig,
    setLargeTreeConfig,
    pottedPlantConfig,
    setPottedPlantConfig,
    bushConfig,
    setBushConfig,
    grassPatchConfig,
    setGrassPatchConfig,
    fallenLeavesConfig,
    setFallenLeavesConfig,
    applyBotanicalPalette,
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
            {isLevelView
              ? 'Level Traversal'
              : isPlayerView
              ? 'Movement & Physics'
              : isDogView
              ? 'AI Behavior'
              : isNatureView
              ? 'Botanical Props'
              : isVehicleView
              ? 'Props & Vehicles'
              : 'Architecture'}
          </TabsTrigger>
          <TabsTrigger value="props" className="radix-tabs-trigger">
            {isLevelView
              ? 'Overlays & Specs'
              : isPlayerView
              ? 'Camera & Debug'
              : isDogView
              ? 'Sensors & Debug'
              : isNatureView
              ? 'Density & Scatter'
              : 'Props & Tuning'}
          </TabsTrigger>
          <TabsTrigger value="lighting" className="radix-tabs-trigger">
            Lighting
          </TabsTrigger>
        </TabsList>

        {/* Tab 1: Primary Selection & Behavior */}
        <TabsContent value="geometry" className="radix-tabs-content">
          {isLevelView ? (
            <LevelBlueprintInspectorTab1
              config={levelConfig}
              onConfigChange={setLevelConfig}
            />
          ) : isPlayerView ? (
            <PlayerInspectorTab1
              playerParams={playerParams}
              onPlayerParamsChange={setPlayerParams}
              cameraParams={cameraParams}
              onCameraParamsChange={setCameraParams}
              showColliderDebug={showColliderDebug}
              onShowColliderDebugChange={setShowColliderDebug}
            />
          ) : isDogView ? (
            <DogInspectorTab1
              dogConfig={dogConfig}
              onDogConfigChange={setDogConfig}
              showDebug={showDogDebug}
              onShowDebugChange={setShowDogDebug}
            />
          ) : isNatureView ? (
            <NatureInspectorTab1
              natureType={natureType}
              onNatureTypeChange={setNatureType}
              smallTreeConfig={smallTreeConfig}
              onSmallTreeConfigChange={setSmallTreeConfig}
              largeTreeConfig={largeTreeConfig}
              onLargeTreeConfigChange={setLargeTreeConfig}
              pottedPlantConfig={pottedPlantConfig}
              onPottedPlantConfigChange={setPottedPlantConfig}
              bushConfig={bushConfig}
              onBushConfigChange={setBushConfig}
              grassPatchConfig={grassPatchConfig}
              onGrassPatchConfigChange={setGrassPatchConfig}
              fallenLeavesConfig={fallenLeavesConfig}
              onFallenLeavesConfigChange={setFallenLeavesConfig}
              onApplyBotanicalPalette={applyBotanicalPalette}
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

        {/* Tab 2: Sensors & Tuning */}
        <TabsContent value="props" className="radix-tabs-content">
          {isLevelView ? (
            <LevelBlueprintInspectorTab2
              config={levelConfig}
              onConfigChange={setLevelConfig}
            />
          ) : isPlayerView ? (
            <PlayerInspectorTab2
              playerParams={playerParams}
              onPlayerParamsChange={setPlayerParams}
              cameraParams={cameraParams}
              onCameraParamsChange={setCameraParams}
              showColliderDebug={showColliderDebug}
              onShowColliderDebugChange={setShowColliderDebug}
            />
          ) : isDogView ? (
            <DogInspectorTab2
              dogConfig={dogConfig}
              onDogConfigChange={setDogConfig}
              showDebug={showDogDebug}
              onShowDebugChange={setShowDogDebug}
            />
          ) : isNatureView ? (
            <NatureInspectorTab2
              natureType={natureType}
              onNatureTypeChange={setNatureType}
              smallTreeConfig={smallTreeConfig}
              onSmallTreeConfigChange={setSmallTreeConfig}
              largeTreeConfig={largeTreeConfig}
              onLargeTreeConfigChange={setLargeTreeConfig}
              pottedPlantConfig={pottedPlantConfig}
              onPottedPlantConfigChange={setPottedPlantConfig}
              bushConfig={bushConfig}
              onBushConfigChange={setBushConfig}
              grassPatchConfig={grassPatchConfig}
              onGrassPatchConfigChange={setGrassPatchConfig}
              fallenLeavesConfig={fallenLeavesConfig}
              onFallenLeavesConfigChange={setFallenLeavesConfig}
              onApplyBotanicalPalette={applyBotanicalPalette}
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
