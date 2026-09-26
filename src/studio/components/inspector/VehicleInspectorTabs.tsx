import React from 'react';
import { Palette } from 'lucide-react';
import { Switch } from '../ui/Switch';
import { VEHICLE_COLOR_PRESETS } from '../../data/studioPresets';
import type { VehicleType } from '../VehicleStudio';
import type { ScooterConfig } from '../3d/vehicles/BajajChetakScooter';
import type { MotorcycleConfig } from '../3d/vehicles/IndianMotorcycle';
import type { BicycleConfig } from '../3d/vehicles/ClassicIndianBicycle';
import type { AutoRickshawConfig } from '../3d/vehicles/AutoRickshaw';
import type { ParkedCarConfig } from '../3d/vehicles/ParkedGullyCar';
import type { PushCartConfig } from '../3d/vehicles/IndianPushCart';
import type { HandCartConfig } from '../3d/vehicles/IndianHandCart';
import type { GarbageBinsConfig } from '../3d/vehicles/IndianGarbageBins';

interface VehicleInspectorTabsProps {
  vehicleType: VehicleType;
  onVehicleTypeChange: (type: VehicleType) => void;
  scooterConfig: ScooterConfig;
  onScooterConfigChange: (config: ScooterConfig) => void;
  motorcycleConfig: MotorcycleConfig;
  onMotorcycleConfigChange: (config: MotorcycleConfig) => void;
  bicycleConfig: BicycleConfig;
  onBicycleConfigChange: (config: BicycleConfig) => void;
  autoConfig: AutoRickshawConfig;
  onAutoConfigChange: (config: AutoRickshawConfig) => void;
  carConfig: ParkedCarConfig;
  onCarConfigChange: (config: ParkedCarConfig) => void;
  pushCartConfig: PushCartConfig;
  onPushCartConfigChange: (config: PushCartConfig) => void;
  handCartConfig: HandCartConfig;
  onHandCartConfigChange: (config: HandCartConfig) => void;
  garbageConfig: GarbageBinsConfig;
  onGarbageConfigChange: (config: GarbageBinsConfig) => void;
  onApplyVehiclePresetColor: (mainColor: string, subColor: string) => void;
}

export const VehicleInspectorTab1: React.FC<VehicleInspectorTabsProps> = ({
  vehicleType,
  onVehicleTypeChange,
  scooterConfig,
  motorcycleConfig,
  bicycleConfig,
  autoConfig,
  carConfig,
  onApplyVehiclePresetColor,
}) => {
  return (
    <>
      {/* 1. Vehicle & Street Prop Selector Cards */}
      <div className="inspector-section">
        <span className="section-label">SELECT STREET PROP / VEHICLE</span>
        <div className="segmented-grid">
          <button
            className={`segment-card ${vehicleType === 'scooter' ? 'selected' : ''}`}
            onClick={() => onVehicleTypeChange('scooter')}
          >
            <span className="card-title">🛵 Vintage Bajaj Chetak</span>
            <span className="card-subtitle">2-stroke scooter, spare wheel & split seats</span>
          </button>

          <button
            className={`segment-card ${vehicleType === 'motorcycle' ? 'selected' : ''}`}
            onClick={() => onVehicleTypeChange('motorcycle')}
          >
            <span className="card-title">🏍️ Indian Classic Roadster</span>
            <span className="card-subtitle">350cc finned engine, spoked wheels, saree guard</span>
          </button>

          <button
            className={`segment-card ${vehicleType === 'bicycle' ? 'selected' : ''}`}
            onClick={() => onVehicleTypeChange('bicycle')}
          >
            <span className="card-title">🚲 Heavy-Duty Roadster Bicycle</span>
            <span className="card-subtitle">Double top-tube frame, rod brakes, 28" wheels</span>
          </button>

          <button
            className={`segment-card ${vehicleType === 'auto-rickshaw' ? 'selected' : ''}`}
            onClick={() => onVehicleTypeChange('auto-rickshaw')}
          >
            <span className="card-title">🛺 Bajaj RE Auto-Rickshaw</span>
            <span className="card-subtitle">3-wheeler Tuk-Tuk, fare meter, yellow/green canopy</span>
          </button>

          <button
            className={`segment-card ${vehicleType === 'parked-car' ? 'selected' : ''}`}
            onClick={() => onVehicleTypeChange('parked-car')}
          >
            <span className="card-title">🚗 Indian Gully Compact Car</span>
            <span className="card-subtitle">Hatchback 4-door, roof rack, mud flaps, tinted glass</span>
          </button>

          <button
            className={`segment-card ${vehicleType === 'push-cart' ? 'selected' : ''}`}
            onClick={() => onVehicleTypeChange('push-cart')}
          >
            <span className="card-title">🛒 Sabzi & Fruit Push Cart</span>
            <span className="card-subtitle">4 spoked wheels, Tarazu scale, produce baskets, umbrella</span>
          </button>

          <button
            className={`segment-card ${vehicleType === 'hand-cart' ? 'selected' : ''}`}
            onClick={() => onVehicleTypeChange('hand-cart')}
          >
            <span className="card-title">🛄 Cargo Handcart (Rehra)</span>
            <span className="card-subtitle">2 massive wheels, jute cargo sacks, rope lashings</span>
          </button>

          <button
            className={`segment-card ${vehicleType === 'garbage-bins' ? 'selected' : ''}`}
            onClick={() => onVehicleTypeChange('garbage-bins')}
          >
            <span className="card-title">🗑️ Municipal Segregated Bins</span>
            <span className="card-subtitle">Green/Blue waste station, concrete drum, chai cups</span>
          </button>
        </div>
      </div>

      {/* 2. Curated Paint Liveries */}
      <div className="inspector-section">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span className="section-label" style={{ margin: 0 }}>
            CURATED PAINT LIVERIES
          </span>
          <Palette size={13} style={{ color: 'var(--text-muted)' }} />
        </div>
        <div className="palette-choice-list">
          {VEHICLE_COLOR_PRESETS.map((p, idx) => {
            const isSelected =
              (vehicleType === 'scooter' && scooterConfig.bodyColor.toLowerCase() === p.color.toLowerCase()) ||
              (vehicleType === 'motorcycle' && motorcycleConfig.tankColor.toLowerCase() === p.color.toLowerCase()) ||
              (vehicleType === 'bicycle' && bicycleConfig.frameColor.toLowerCase() === p.color.toLowerCase()) ||
              (vehicleType === 'auto-rickshaw' && autoConfig.bodyColor.toLowerCase() === p.color.toLowerCase()) ||
              (vehicleType === 'parked-car' && carConfig.bodyColor.toLowerCase() === p.color.toLowerCase());

            return (
              <button
                key={idx}
                className={`palette-card-btn ${isSelected ? 'selected' : ''}`}
                onClick={() => onApplyVehiclePresetColor(p.color, p.accent)}
              >
                <div className="dual-color-preview">
                  <span className="color-half" style={{ backgroundColor: p.color }} title="Primary Body Color" />
                  <span className="color-half" style={{ backgroundColor: p.accent }} title="Accent / Seat Color" />
                </div>
                <div className="palette-meta-stack">
                  <span className="palette-card-name">{p.name}</span>
                  <span className="palette-card-sub">{p.sub}</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </>
  );
};

export const VehicleInspectorTab2: React.FC<VehicleInspectorTabsProps> = ({
  vehicleType,
  scooterConfig,
  onScooterConfigChange,
  motorcycleConfig,
  onMotorcycleConfigChange,
  bicycleConfig,
  onBicycleConfigChange,
  autoConfig,
  onAutoConfigChange,
  carConfig,
  onCarConfigChange,
  pushCartConfig,
  onPushCartConfigChange,
  handCartConfig,
  onHandCartConfigChange,
  garbageConfig,
  onGarbageConfigChange,
}) => {
  return (
    <div className="inspector-section">
      <span className="section-label">PROPS & ACCESSORIES</span>
      <div className="switch-row-list">
        {vehicleType === 'parked-car' && (
          <>
            <div className="switch-row">
              <div className="switch-meta">
                <span className="switch-label">Rooftop Luggage Rack</span>
                <span className="switch-desc">Steel carrier rack with crossbars</span>
              </div>
              <Switch
                checked={carConfig.hasRoofRack}
                onCheckedChange={(checked) => onCarConfigChange({ ...carConfig, hasRoofRack: checked })}
              />
            </div>
            <div className="switch-row">
              <div className="switch-meta">
                <span className="switch-label">Side Rubber Moldings</span>
                <span className="switch-desc">Door protective rub-strips</span>
              </div>
              <Switch
                checked={carConfig.hasSideMoldings}
                onCheckedChange={(checked) => onCarConfigChange({ ...carConfig, hasSideMoldings: checked })}
              />
            </div>
            <div className="switch-row">
              <div className="switch-meta">
                <span className="switch-label">Mud Flaps</span>
                <span className="switch-desc">All-weather wheel splash guards</span>
              </div>
              <Switch
                checked={carConfig.hasMudFlaps}
                onCheckedChange={(checked) => onCarConfigChange({ ...carConfig, hasMudFlaps: checked })}
              />
            </div>
          </>
        )}

        {vehicleType === 'push-cart' && (
          <>
            <div className="switch-row">
              <div className="switch-meta">
                <span className="switch-label">Tarazu Weighing Scale</span>
                <span className="switch-desc">Traditional brass balance with iron weights</span>
              </div>
              <Switch
                checked={pushCartConfig.hasScale}
                onCheckedChange={(checked) => onPushCartConfigChange({ ...pushCartConfig, hasScale: checked })}
              />
            </div>
            <div className="switch-row">
              <div className="switch-meta">
                <span className="switch-label">Fresh Produce (Tomatoes & Onions)</span>
                <span className="switch-desc">Woven cane baskets full of vegetables</span>
              </div>
              <Switch
                checked={pushCartConfig.hasProduce}
                onCheckedChange={(checked) => onPushCartConfigChange({ ...pushCartConfig, hasProduce: checked })}
              />
            </div>
            <div className="switch-row">
              <div className="switch-meta">
                <span className="switch-label">Striped Canvas Umbrella</span>
                <span className="switch-desc">Weathered sunshade canopy pole</span>
              </div>
              <Switch
                checked={pushCartConfig.hasUmbrella}
                onCheckedChange={(checked) => onPushCartConfigChange({ ...pushCartConfig, hasUmbrella: checked })}
              />
            </div>
            <div className="switch-row">
              <div className="switch-meta">
                <span className="switch-label">Night Hanging Tungsten Bulb</span>
                <span className="switch-desc">Warm electric filament light overhead</span>
              </div>
              <Switch
                checked={pushCartConfig.hasHangingBulb}
                onCheckedChange={(checked) => onPushCartConfigChange({ ...pushCartConfig, hasHangingBulb: checked })}
              />
            </div>
          </>
        )}

        {vehicleType === 'hand-cart' && (
          <>
            <div className="switch-row">
              <div className="switch-meta">
                <span className="switch-label">Heavy Cargo Jute Sacks</span>
                <span className="switch-desc">Stacked 50kg burlap grain sacks</span>
              </div>
              <Switch
                checked={handCartConfig.hasCargoSacks}
                onCheckedChange={(checked) => onHandCartConfigChange({ ...handCartConfig, hasCargoSacks: checked })}
              />
            </div>
            <div className="switch-row">
              <div className="switch-meta">
                <span className="switch-label">Wooden Packing Crates</span>
                <span className="switch-desc">Reinforced timber cargo boxes</span>
              </div>
              <Switch
                checked={handCartConfig.hasCrates}
                onCheckedChange={(checked) => onHandCartConfigChange({ ...handCartConfig, hasCrates: checked })}
              />
            </div>
            <div className="switch-row">
              <div className="switch-meta">
                <span className="switch-label">Hemp Rope Lashings</span>
                <span className="switch-desc">Diagonal cargo security ties</span>
              </div>
              <Switch
                checked={handCartConfig.hasRopeLashing}
                onCheckedChange={(checked) => onHandCartConfigChange({ ...handCartConfig, hasRopeLashing: checked })}
              />
            </div>
          </>
        )}

        {vehicleType === 'garbage-bins' && (
          <>
            <div className="switch-row">
              <div className="switch-meta">
                <span className="switch-label">Segregated Dual Bins (Green/Blue)</span>
                <span className="switch-desc">Swachh Bharat municipal waste bins</span>
              </div>
              <Switch
                checked={garbageConfig.hasTwinSegregationBins}
                onCheckedChange={(checked) => onGarbageConfigChange({ ...garbageConfig, hasTwinSegregationBins: checked })}
              />
            </div>
            <div className="switch-row">
              <div className="switch-meta">
                <span className="switch-label">Concrete Roadside Drum</span>
                <span className="switch-desc">Heavy precast concrete municipal barrel</span>
              </div>
              <Switch
                checked={garbageConfig.hasConcreteDrum}
                onCheckedChange={(checked) => onGarbageConfigChange({ ...garbageConfig, hasConcreteDrum: checked })}
              />
            </div>
            <div className="switch-row">
              <div className="switch-meta">
                <span className="switch-label">Street Clutter Details</span>
                <span className="switch-desc">Chai cups, cardboard box, crushed can</span>
              </div>
              <Switch
                checked={garbageConfig.hasStreetClutter}
                onCheckedChange={(checked) => onGarbageConfigChange({ ...garbageConfig, hasStreetClutter: checked })}
              />
            </div>
          </>
        )}

        {vehicleType === 'motorcycle' && (
          <>
            <div className="switch-row">
              <div className="switch-meta">
                <span className="switch-label">Engine Crash Guard</span>
                <span className="switch-desc">Heavy-duty chrome tubular leg guard</span>
              </div>
              <Switch
                checked={motorcycleConfig.hasCrashGuard}
                onCheckedChange={(checked) => onMotorcycleConfigChange({ ...motorcycleConfig, hasCrashGuard: checked })}
              />
            </div>
            <div className="switch-row">
              <div className="switch-meta">
                <span className="switch-label">Traditional Saree Guard</span>
                <span className="switch-desc">Rear wheel mesh protective stay</span>
              </div>
              <Switch
                checked={motorcycleConfig.hasSareeGuard}
                onCheckedChange={(checked) => onMotorcycleConfigChange({ ...motorcycleConfig, hasSareeGuard: checked })}
              />
            </div>
            <div className="switch-row">
              <div className="switch-meta">
                <span className="switch-label">Rear Luggage Carrier</span>
                <span className="switch-desc">Chrome luggage rack and grab rail</span>
              </div>
              <Switch
                checked={motorcycleConfig.hasLuggageCarrier}
                onCheckedChange={(checked) => onMotorcycleConfigChange({ ...motorcycleConfig, hasLuggageCarrier: checked })}
              />
            </div>
          </>
        )}

        {vehicleType === 'bicycle' && (
          <>
            <div className="switch-row">
              <div className="switch-meta">
                <span className="switch-label">Rear Luggage Carrier</span>
                <span className="switch-desc">Heavy-duty spring-loaded pillion rack</span>
              </div>
              <Switch
                checked={bicycleConfig.hasCarrier}
                onCheckedChange={(checked) => onBicycleConfigChange({ ...bicycleConfig, hasCarrier: checked })}
              />
            </div>
            <div className="switch-row">
              <div className="switch-meta">
                <span className="switch-label">Handlebar Dome Bell</span>
                <span className="switch-desc">Classic rotary thumb chime bell</span>
              </div>
              <Switch
                checked={bicycleConfig.hasBell}
                onCheckedChange={(checked) => onBicycleConfigChange({ ...bicycleConfig, hasBell: checked })}
              />
            </div>
            <div className="switch-row">
              <div className="switch-meta">
                <span className="switch-label">Bottle Dynamo Headlight</span>
                <span className="switch-desc">Friction-driven chrome front lamp</span>
              </div>
              <Switch
                checked={bicycleConfig.hasDynamoLight}
                onCheckedChange={(checked) => onBicycleConfigChange({ ...bicycleConfig, hasDynamoLight: checked })}
              />
            </div>
          </>
        )}

        {vehicleType === 'scooter' && (
          <>
            <div className="switch-row">
              <div className="switch-meta">
                <span className="switch-label">Chrome Body Crash Guard</span>
                <span className="switch-desc">Protective perimeter tubular bumper</span>
              </div>
              <Switch
                checked={scooterConfig.hasCrashGuard}
                onCheckedChange={(checked) => onScooterConfigChange({ ...scooterConfig, hasCrashGuard: checked })}
              />
            </div>
            <div className="switch-row">
              <div className="switch-meta">
                <span className="switch-label">Rear Mounted Spare Tire</span>
                <span className="switch-desc">Tail bracket mounted Stepney wheel</span>
              </div>
              <Switch
                checked={scooterConfig.hasSpareTire}
                onCheckedChange={(checked) => onScooterConfigChange({ ...scooterConfig, hasSpareTire: checked })}
              />
            </div>
          </>
        )}

        {vehicleType === 'auto-rickshaw' && (
          <>
            <div className="switch-row">
              <div className="switch-meta">
                <span className="switch-label">Mechanical Fare Meter</span>
                <span className="switch-desc">Dashboard mounted fare calculation box</span>
              </div>
              <Switch
                checked={autoConfig.hasFareMeter}
                onCheckedChange={(checked) => onAutoConfigChange({ ...autoConfig, hasFareMeter: checked })}
              />
            </div>
            <div className="switch-row">
              <div className="switch-meta">
                <span className="switch-label">Rolled Weather Curtains</span>
                <span className="switch-desc">Side vinyl rain flaps strapped to canopy</span>
              </div>
              <Switch
                checked={autoConfig.hasCurtains}
                onCheckedChange={(checked) => onAutoConfigChange({ ...autoConfig, hasCurtains: checked })}
              />
            </div>
            <div className="switch-row">
              <div className="switch-meta">
                <span className="switch-label">Tubular Front Bullbar</span>
                <span className="switch-desc">Heavy-duty tubular front bumper</span>
              </div>
              <Switch
                checked={autoConfig.hasFrontBumper}
                onCheckedChange={(checked) => onAutoConfigChange({ ...autoConfig, hasFrontBumper: checked })}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
};
