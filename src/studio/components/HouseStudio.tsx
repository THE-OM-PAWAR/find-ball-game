import React, { Suspense, useRef, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, GizmoHelper, GizmoViewport } from '@react-three/drei';
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib';
import * as THREE from 'three';
import { SingleStoryStairHouse, type StairHouseConfig } from './3d/houses/SingleStoryStairHouse';
import { TwoStoryBoxHouse, type BoxHouseConfig } from './3d/houses/TwoStoryBoxHouse';
import { ThreeStoryBoxHouse, type ThreeStoryBoxConfig } from './3d/houses/ThreeStoryBoxHouse';
import { TwoStoryShopComplex, type ShopComplexConfig } from './3d/houses/TwoStoryShopComplex';
import { ThreeStoryShopComplex, type ThreeStoryShopConfig } from './3d/houses/ThreeStoryShopComplex';
import { ModernGullyHouse, type ModernHouseConfig } from './3d/houses/ModernGullyHouse';
import { IndianTerraceHouse, type HouseConfig } from './3d/houses/IndianTerraceHouse';
import { StudioLighting, type LightingPreset } from './3d/environment/StudioLighting';
import { CricketBallThrower } from './3d/physics/CricketBallThrower';

export type HouseType =
  | 'stair-bungalow'
  | 'box-2story'
  | 'box-3story'
  | 'shop-2story'
  | 'shop-3story'
  | 'modern-villa'
  | 'terrace';

export type RenderStyle = 'textured' | 'wireframe' | 'clay';
export type CameraPreset = 'reference' | 'orbit' | 'front' | 'top';

interface HouseStudioProps {
  houseType: HouseType;
  lightingPreset: LightingPreset;
  renderStyle: RenderStyle;
  houseConfig: HouseConfig;
  modernConfig?: ModernHouseConfig;
  stairConfig?: StairHouseConfig;
  box2Config?: BoxHouseConfig;
  box3Config?: ThreeStoryBoxConfig;
  shop2Config?: ShopComplexConfig;
  shop3Config?: ThreeStoryShopConfig;
  autoRotate: boolean;
  showGrid?: boolean;
  cameraPreset?: CameraPreset;
}

const CameraController: React.FC<{
  preset?: CameraPreset;
  autoRotate: boolean;
  houseType: HouseType;
}> = ({
  preset = 'reference',
  autoRotate,
  houseType,
}) => {
  const controlsRef = useRef<OrbitControlsImpl>(null);

  useEffect(() => {
    if (!controlsRef.current) return;
    const controls = controlsRef.current;

    switch (preset) {
      case 'reference':
        if (houseType === 'stair-bungalow') {
          controls.object.position.set(4.5, 3.8, 7.8);
          controls.target.set(0, 1.6, 0);
        } else if (houseType === 'box-2story') {
          controls.object.position.set(5.8, 5.0, 8.2);
          controls.target.set(0, 3.2, 0);
        } else if (houseType === 'box-3story') {
          controls.object.position.set(7.2, 7.2, 10.5);
          controls.target.set(0, 4.8, 0);
        } else if (houseType === 'shop-2story') {
          controls.object.position.set(8.5, 5.8, 11.2);
          controls.target.set(0, 3.2, 0);
        } else if (houseType === 'shop-3story') {
          controls.object.position.set(9.5, 8.0, 13.0);
          controls.target.set(0, 4.8, 0);
        } else if (houseType === 'modern-villa') {
          controls.object.position.set(6.2, 5.4, 6.8);
          controls.target.set(0, 2.2, 0);
        } else {
          controls.object.position.set(5.5, 4.2, 7.5);
          controls.target.set(0, 1.6, 0);
        }
        break;
      case 'front':
        if (houseType === 'shop-3story') {
          controls.object.position.set(0, 5.2, 14.5);
          controls.target.set(0, 4.8, 0);
        } else if (houseType === 'shop-2story') {
          controls.object.position.set(0, 3.5, 12.5);
          controls.target.set(0, 3.2, 0);
        } else if (houseType === 'box-3story') {
          controls.object.position.set(0, 4.8, 12.5);
          controls.target.set(0, 4.8, 0);
        } else if (houseType === 'box-2story') {
          controls.object.position.set(0, 3.2, 10.5);
          controls.target.set(0, 3.2, 0);
        } else {
          controls.object.position.set(0, 2.2, 9.5);
          controls.target.set(0, 1.6, 0);
        }
        break;
      case 'top':
        if (houseType === 'shop-3story' || houseType === 'box-3story') {
          controls.object.position.set(0, 20.0, 0.5);
          controls.target.set(0, 4.8, 0);
        } else if (houseType === 'shop-2story') {
          controls.object.position.set(0, 17.0, 0.5);
          controls.target.set(0, 3.2, 0);
        } else {
          controls.object.position.set(0, 14.0, 0.5);
          controls.target.set(0, 2.0, 0);
        }
        break;
      case 'orbit':
      default:
        controls.object.position.set(7.5, 5.8, 10.5);
        controls.target.set(0, 3.0, 0);
        break;
    }
    controls.update();
  }, [preset, houseType]);

  return (
    <OrbitControls
      ref={controlsRef}
      makeDefault
      autoRotate={autoRotate}
      autoRotateSpeed={0.7}
      maxPolarAngle={Math.PI / 2 - 0.02}
      minDistance={2.5}
      maxDistance={40}
      target={[0, 2.5, 0]}
    />
  );
};

export const HouseStudio: React.FC<HouseStudioProps> = ({
  houseType,
  lightingPreset,
  houseConfig,
  modernConfig,
  stairConfig,
  box2Config,
  box3Config,
  shop2Config,
  shop3Config,
  autoRotate,
  cameraPreset = 'reference',
}) => {
  const handlePointerDown = (e: React.PointerEvent) => {
    if (e.target instanceof HTMLCanvasElement && e.shiftKey) {
      const event = new CustomEvent('throw-cricket-ball', {
        detail: { x: (Math.random() - 0.5) * 4.0, y: 1.2, z: -1.0 },
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
        return '#1c1d22';
    }
  };

  return (
    <div className="canvas-container" onPointerDown={handlePointerDown}>
      <Canvas
        shadows
        camera={{ position: [6.5, 5.5, 10.5], fov: 38 }}
        gl={{
          antialias: true,
          alpha: true,
          preserveDrawingBuffer: true,
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.08,
        }}
      >
        <color attach="background" args={[getBgColor()]} />

        <Suspense fallback={null}>
          <StudioLighting preset={lightingPreset} />

          {/* 3D House Models Anchored at Y = 0 */}
          <group position={[0, 0, 0]}>
            {houseType === 'stair-bungalow' && (
              <SingleStoryStairHouse config={stairConfig} position={[0, 0, 0]} />
            )}
            {houseType === 'box-2story' && (
              <TwoStoryBoxHouse config={box2Config} position={[0, 0, 0]} />
            )}
            {houseType === 'box-3story' && (
              <ThreeStoryBoxHouse config={box3Config} position={[0, 0, 0]} />
            )}
            {houseType === 'shop-2story' && (
              <TwoStoryShopComplex config={shop2Config} position={[0, 0, 0]} />
            )}
            {houseType === 'shop-3story' && (
              <ThreeStoryShopComplex config={shop3Config} position={[0, 0, 0]} />
            )}
            {houseType === 'modern-villa' && (
              <ModernGullyHouse
                config={{
                  mainColor: modernConfig?.mainColor || '#c7ab85',
                  accentColor: modernConfig?.accentColor || '#2f353d',
                  frameColor: modernConfig?.frameColor || '#f3f4f6',
                  hasWaterTank: modernConfig?.hasWaterTank ?? false,
                  hasDishAntenna: modernConfig?.hasDishAntenna ?? false,
                  hasPalmTree: modernConfig?.hasPalmTree ?? true,
                  hasStreetLamp: modernConfig?.hasStreetLamp ?? true,
                  hasInteriorGlow: modernConfig?.hasInteriorGlow ?? true,
                }}
                position={[0, 0, 0]}
              />
            )}
            {houseType === 'terrace' && (
              <IndianTerraceHouse config={houseConfig} position={[0, 0, 0]} />
            )}
          </group>

          {/* Interactive Gully Tennis Ball Physics */}
          <CricketBallThrower enabled={true} />

          {/* Camera Controller with Presets */}
          <CameraController
            preset={cameraPreset}
            autoRotate={autoRotate}
            houseType={houseType}
          />

          <GizmoHelper alignment="bottom-right" margin={[60, 60]}>
            <GizmoViewport axisColors={['#ef4444', '#22c55e', '#3b82f6']} labelColor="#ffffff" />
          </GizmoHelper>
        </Suspense>
      </Canvas>
    </div>
  );
};
