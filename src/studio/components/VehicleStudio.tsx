import React, { Suspense, useRef, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, GizmoHelper, GizmoViewport } from '@react-three/drei';
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib';
import * as THREE from 'three';
import { BajajChetakScooter, type ScooterConfig } from './3d/vehicles/BajajChetakScooter';
import { IndianMotorcycle, type MotorcycleConfig } from './3d/vehicles/IndianMotorcycle';
import { ClassicIndianBicycle, type BicycleConfig } from './3d/vehicles/ClassicIndianBicycle';
import { AutoRickshaw, type AutoRickshawConfig } from './3d/vehicles/AutoRickshaw';
import { ParkedGullyCar, type ParkedCarConfig } from './3d/vehicles/ParkedGullyCar';
import { IndianPushCart, type PushCartConfig } from './3d/vehicles/IndianPushCart';
import { IndianHandCart, type HandCartConfig } from './3d/vehicles/IndianHandCart';
import { IndianGarbageBins, type GarbageBinsConfig } from './3d/vehicles/IndianGarbageBins';
import { StudioLighting, type LightingPreset } from './3d/environment/StudioLighting';
import { CricketBallThrower } from './3d/physics/CricketBallThrower';

export type VehicleType =
  | 'scooter'
  | 'motorcycle'
  | 'bicycle'
  | 'auto-rickshaw'
  | 'parked-car'
  | 'push-cart'
  | 'hand-cart'
  | 'garbage-bins';

export type VehicleCameraPreset = 'reference' | 'side' | 'front' | 'top';

interface VehicleStudioProps {
  vehicleType: VehicleType;
  lightingPreset: LightingPreset;
  scooterConfig?: ScooterConfig;
  motorcycleConfig?: MotorcycleConfig;
  bicycleConfig?: BicycleConfig;
  autoConfig?: AutoRickshawConfig;
  carConfig?: ParkedCarConfig;
  pushCartConfig?: PushCartConfig;
  handCartConfig?: HandCartConfig;
  garbageConfig?: GarbageBinsConfig;
  autoRotate: boolean;
  cameraPreset?: VehicleCameraPreset;
}

const VehicleCameraController: React.FC<{
  preset?: VehicleCameraPreset;
  autoRotate: boolean;
  vehicleType: VehicleType;
}> = ({
  preset = 'reference',
  autoRotate,
  vehicleType,
}) => {
  const controlsRef = useRef<OrbitControlsImpl>(null);

  useEffect(() => {
    if (!controlsRef.current) return;
    const controls = controlsRef.current;

    let targetHeight = 0.55;
    if (vehicleType === 'parked-car') targetHeight = 0.75;
    else if (vehicleType === 'auto-rickshaw') targetHeight = 0.85;
    else if (vehicleType === 'push-cart') targetHeight = 0.95;
    else if (vehicleType === 'hand-cart') targetHeight = 0.55;
    else if (vehicleType === 'garbage-bins') targetHeight = 0.45;

    switch (preset) {
      case 'reference':
        if (vehicleType === 'parked-car') {
          controls.object.position.set(3.8, 2.2, 4.4);
        } else if (vehicleType === 'auto-rickshaw') {
          controls.object.position.set(2.8, 1.8, 3.4);
        } else if (vehicleType === 'push-cart') {
          controls.object.position.set(2.6, 1.8, 2.8);
        } else if (vehicleType === 'hand-cart') {
          controls.object.position.set(2.6, 1.6, 2.8);
        } else if (vehicleType === 'garbage-bins') {
          controls.object.position.set(2.0, 1.4, 2.2);
        } else {
          controls.object.position.set(2.2, 1.3, 2.5);
        }
        controls.target.set(0, targetHeight, 0);
        break;

      case 'side':
        if (vehicleType === 'parked-car') {
          controls.object.position.set(5.2, 1.2, 0);
        } else if (vehicleType === 'auto-rickshaw') {
          controls.object.position.set(4.2, 1.1, 0);
        } else if (vehicleType === 'push-cart' || vehicleType === 'hand-cart') {
          controls.object.position.set(3.6, 1.0, 0);
        } else {
          controls.object.position.set(3.2, 0.75, 0);
        }
        controls.target.set(0, targetHeight, 0);
        break;

      case 'front':
        if (vehicleType === 'parked-car') {
          controls.object.position.set(0, 1.2, 5.0);
        } else if (vehicleType === 'auto-rickshaw') {
          controls.object.position.set(0, 1.1, 4.0);
        } else if (vehicleType === 'push-cart' || vehicleType === 'hand-cart') {
          controls.object.position.set(0, 1.1, 3.4);
        } else {
          controls.object.position.set(0, 0.8, 3.2);
        }
        controls.target.set(0, targetHeight, 0);
        break;

      case 'top':
        if (vehicleType === 'parked-car') {
          controls.object.position.set(0, 6.8, 0.1);
        } else if (vehicleType === 'auto-rickshaw' || vehicleType === 'push-cart') {
          controls.object.position.set(0, 5.5, 0.1);
        } else {
          controls.object.position.set(0, 4.2, 0.1);
        }
        controls.target.set(0, targetHeight, 0);
        break;

      default:
        controls.object.position.set(2.4, 1.4, 2.8);
        controls.target.set(0, targetHeight, 0);
        break;
    }
    controls.update();
  }, [preset, vehicleType]);

  return (
    <OrbitControls
      ref={controlsRef}
      makeDefault
      autoRotate={autoRotate}
      autoRotateSpeed={0.8}
      maxPolarAngle={Math.PI / 2 - 0.02}
      minDistance={1.0}
      maxDistance={15}
      target={[0, 0.6, 0]}
    />
  );
};

/**
 * Detailed Indian Street Asphalt Road Ground with Sidewalk Curb & Road Markings
 */
const StreetGround: React.FC = () => {
  return (
    <group position={[0, -0.01, 0]}>
      {/* Asphalt Road Plane */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[18, 18]} />
        <meshStandardMaterial color="#212529" roughness={0.88} metalness={0.08} />
      </mesh>

      {/* Yellow Center Road Line Markings */}
      {[-6, -4, -2, 0, 2, 4, 6].map((z, i) => (
        <mesh key={`marking-${i}`} position={[-2.0, 0.002, z]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[0.12, 1.2]} />
          <meshStandardMaterial color="#eab308" roughness={0.5} />
        </mesh>
      ))}

      {/* White Road Edge Solid Stripe */}
      <mesh position={[1.5, 0.002, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[0.1, 16]} />
        <meshStandardMaterial color="#f8fafc" roughness={0.6} />
      </mesh>

      {/* Concrete Sidewalk Curb */}
      <mesh position={[2.8, 0.1, 0]} receiveShadow castShadow>
        <boxGeometry args={[2.4, 0.2, 18]} />
        <meshStandardMaterial color="#78716c" roughness={0.92} metalness={0.05} />
      </mesh>
      {/* Curb Edge Stone Bevel */}
      <mesh position={[1.6, 0.1, 0]}>
        <boxGeometry args={[0.08, 0.2, 18]} />
        <meshStandardMaterial color="#57534e" roughness={0.85} />
      </mesh>
    </group>
  );
};

export const VehicleStudio: React.FC<VehicleStudioProps> = ({
  vehicleType,
  lightingPreset,
  scooterConfig,
  motorcycleConfig,
  bicycleConfig,
  autoConfig,
  carConfig,
  pushCartConfig,
  handCartConfig,
  garbageConfig,
  autoRotate,
  cameraPreset = 'reference',
}) => {
  const handlePointerDown = (e: React.PointerEvent) => {
    if (e.target instanceof HTMLCanvasElement && e.shiftKey) {
      const event = new CustomEvent('throw-cricket-ball', {
        detail: { x: (Math.random() - 0.5) * 1.8, y: 0.9, z: -0.8 },
      });
      window.dispatchEvent(event);
    }
  };

  const getBgColor = () => {
    switch (lightingPreset) {
      case 'night':
        return '#090d16';
      case 'sunset':
        return '#1b141d';
      case 'monsoon':
        return '#1f242b';
      case 'afternoon':
      default:
        return '#181a1f';
    }
  };

  return (
    <div className="canvas-container" onPointerDown={handlePointerDown}>
      <Canvas
        shadows
        camera={{ position: [3.2, 1.8, 3.8], fov: 38 }}
        gl={{
          antialias: true,
          alpha: true,
          preserveDrawingBuffer: true,
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.1,
        }}
      >
        <color attach="background" args={[getBgColor()]} />

        <Suspense fallback={null}>
          <StudioLighting preset={lightingPreset} />

          {/* Realistic Indian Street Asphalt Ground */}
          <StreetGround />

          {/* 3D Vehicle & Street Prop Models Positioned at Origin */}
          <group position={[0, 0, 0]}>
            {vehicleType === 'scooter' && (
              <BajajChetakScooter config={scooterConfig} position={[0, 0, 0]} />
            )}
            {vehicleType === 'motorcycle' && (
              <IndianMotorcycle config={motorcycleConfig} position={[0, 0, 0]} />
            )}
            {vehicleType === 'bicycle' && (
              <ClassicIndianBicycle config={bicycleConfig} position={[0, 0, 0]} />
            )}
            {vehicleType === 'auto-rickshaw' && (
              <AutoRickshaw config={autoConfig} position={[0, 0, 0]} />
            )}
            {vehicleType === 'parked-car' && (
              <ParkedGullyCar config={carConfig} position={[0, 0, 0]} />
            )}
            {vehicleType === 'push-cart' && (
              <IndianPushCart config={pushCartConfig} position={[0, 0, 0]} />
            )}
            {vehicleType === 'hand-cart' && (
              <IndianHandCart config={handCartConfig} position={[0, 0, 0]} />
            )}
            {vehicleType === 'garbage-bins' && (
              <IndianGarbageBins config={garbageConfig} position={[0, 0, 0]} />
            )}
          </group>

          {/* Interactive Gully Cricket Ball Physics */}
          <CricketBallThrower enabled={true} />

          {/* Precision Vehicle & Street Prop Camera Controls */}
          <VehicleCameraController
            preset={cameraPreset}
            autoRotate={autoRotate}
            vehicleType={vehicleType}
          />

          <GizmoHelper alignment="bottom-right" margin={[60, 60]}>
            <GizmoViewport axisColors={['#ef4444', '#22c55e', '#3b82f6']} labelColor="#ffffff" />
          </GizmoHelper>
        </Suspense>
      </Canvas>
    </div>
  );
};
