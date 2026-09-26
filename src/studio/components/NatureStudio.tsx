import React, { Suspense, useRef, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, GizmoHelper, GizmoViewport } from '@react-three/drei';
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib';
import * as THREE from 'three';
import {
  SmallTree,
  LargeTree,
  PottedPlant,
  Bush,
  GrassPatch,
  FallenLeaves,
} from './3d/NatureProps';
import { StudioLighting, type LightingPreset } from './3d/environment/StudioLighting';
import { CricketBallThrower } from './3d/physics/CricketBallThrower';
import type {
  NaturePropType,
  NatureSmallTreeConfig,
  NatureLargeTreeConfig,
  NaturePottedPlantConfig,
  NatureBushConfig,
  NatureGrassPatchConfig,
  NatureFallenLeavesConfig,
} from '../data/natureStudioPresets';
import type { VehicleCameraPreset } from './VehicleStudio';

interface NatureStudioProps {
  natureType: NaturePropType;
  lightingPreset: LightingPreset;
  smallTreeConfig: NatureSmallTreeConfig;
  largeTreeConfig: NatureLargeTreeConfig;
  pottedPlantConfig: NaturePottedPlantConfig;
  bushConfig: NatureBushConfig;
  grassPatchConfig: NatureGrassPatchConfig;
  fallenLeavesConfig: NatureFallenLeavesConfig;
  autoRotate: boolean;
  cameraPreset?: VehicleCameraPreset;
}

const NatureCameraController: React.FC<{
  preset?: VehicleCameraPreset;
  autoRotate: boolean;
  natureType: NaturePropType;
}> = ({ preset = 'reference', autoRotate, natureType }) => {
  const controlsRef = useRef<OrbitControlsImpl>(null);

  useEffect(() => {
    if (!controlsRef.current) return;
    const controls = controlsRef.current;

    let targetHeight = 1.0;
    if (natureType === 'large-tree') targetHeight = 2.2;
    else if (natureType === 'small-tree') targetHeight = 1.6;
    else if (natureType === 'potted-plant') targetHeight = 0.45;
    else if (natureType === 'bush') targetHeight = 0.65;
    else if (natureType === 'grass-patch' || natureType === 'fallen-leaves') targetHeight = 0.2;
    else if (natureType === 'botanical-oasis') targetHeight = 1.5;

    switch (preset) {
      case 'reference':
        if (natureType === 'large-tree') {
          controls.object.position.set(6.8, 4.2, 6.8);
        } else if (natureType === 'botanical-oasis') {
          controls.object.position.set(7.5, 4.8, 7.5);
        } else if (natureType === 'potted-plant' || natureType === 'grass-patch' || natureType === 'fallen-leaves') {
          controls.object.position.set(1.4, 0.9, 1.4);
        } else if (natureType === 'bush') {
          controls.object.position.set(2.2, 1.4, 2.2);
        } else {
          controls.object.position.set(4.2, 2.6, 4.2);
        }
        controls.target.set(0, targetHeight, 0);
        break;

      case 'side':
        if (natureType === 'large-tree') {
          controls.object.position.set(7.4, 2.8, 0);
        } else if (natureType === 'potted-plant' || natureType === 'grass-patch') {
          controls.object.position.set(1.6, 0.5, 0);
        } else {
          controls.object.position.set(4.5, 1.8, 0);
        }
        controls.target.set(0, targetHeight, 0);
        break;

      case 'front':
        if (natureType === 'large-tree') {
          controls.object.position.set(0, 2.8, 7.4);
        } else if (natureType === 'potted-plant' || natureType === 'grass-patch') {
          controls.object.position.set(0, 0.5, 1.6);
        } else {
          controls.object.position.set(0, 1.8, 4.5);
        }
        controls.target.set(0, targetHeight, 0);
        break;

      case 'top':
        if (natureType === 'large-tree' || natureType === 'botanical-oasis') {
          controls.object.position.set(0.01, 10.0, 0.01);
        } else if (natureType === 'potted-plant' || natureType === 'grass-patch') {
          controls.object.position.set(0.01, 2.2, 0.01);
        } else {
          controls.object.position.set(0.01, 5.8, 0.01);
        }
        controls.target.set(0, 0, 0);
        break;
    }

    controls.update();
  }, [preset, natureType]);

  return (
    <OrbitControls
      ref={controlsRef}
      enableDamping
      dampingFactor={0.06}
      maxPolarAngle={Math.PI / 2 - 0.02}
      minDistance={0.5}
      maxDistance={30}
      autoRotate={autoRotate}
      autoRotateSpeed={1.0}
    />
  );
};

/**
 * Aesthetic studio display dais and ground
 */
const NatureStudioGround: React.FC<{ isComposite: boolean }> = ({ isComposite }) => {
  return (
    <group position={[0, -0.005, 0]}>
      {/* Soft circular display ground / sandstone patio */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow position={[0, 0, 0]}>
        <circleGeometry args={[isComposite ? 8.5 : 4.5, 64]} />
        <meshStandardMaterial color="#e7dfd5" roughness={0.9} metalness={0.02} />
      </mesh>

      {/* Terracotta / Sandstone Ring Border */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.002, 0]}>
        <ringGeometry args={[isComposite ? 8.35 : 4.35, isComposite ? 8.5 : 4.5, 64]} />
        <meshStandardMaterial color="#c2410c" roughness={0.7} />
      </mesh>

      {/* Subtle Ground Grid Lines */}
      <gridHelper
        args={[isComposite ? 17 : 9, isComposite ? 34 : 18, '#d4c7b8', '#e2d8cd']}
        position={[0, 0.003, 0]}
      />
    </group>
  );
};

/**
 * Composite Botanical Oasis Courtyard
 */
const BotanicalOasisShowcase: React.FC = () => {
  return (
    <group position={[0, 0, 0]}>
      {/* 1. Grand Center Elm Tree (tree_elm.glb - majestic shade canopy) */}
      <LargeTree position={[3.2, 0, -2.4]} rotation={[0, 0.5, 0]} scale={1.05} variant="elm" hasFlowers={true} />

      {/* 2. Linden Tree (tree_3d_model_linden_tree.glb) */}
      <LargeTree position={[-3.6, 0, -2.6]} rotation={[0, -0.3, 0]} scale={1.0} variant="linden" hasFlowers={false} />

      {/* 3. Small Medium Tree (tree.glb) */}
      <SmallTree position={[-3.8, 0, 1.8]} rotation={[0, 0.8, 0]} scale={1.0} />

      {/* 4. Realistic Compact Fortnite Bushes (Fortnite_Bush.glb - natural knee/waist height) */}
      <Bush position={[-1.2, 0, -2.4]} scale={1.0} />
      <Bush position={[3.6, 0, 0.8]} scale={0.9} />
      <Bush position={[-2.4, 0, 2.6]} scale={1.05} />
      <Bush position={[1.8, 0, -3.2]} scale={0.95} />

      {/* 5. Traditional Indian Tulsi Vrindavan & Potted Plants */}
      <PottedPlant position={[-0.9, 0, 1.0]} plantType="tulsi" potStyle="tulsi_vrindavan" scale={1.15} />
      <PottedPlant position={[0.6, 0, 1.8]} plantType="flowering_hibiscus" potStyle="ceramic_blue" scale={1.05} />
      <PottedPlant position={[1.3, 0, 0.4]} plantType="snake_plant" potStyle="white_glazed" scale={1.0} />
      <PottedPlant position={[-1.8, 0, -0.6]} plantType="money_plant" potStyle="cement_grey" scale={1.0} />

      {/* 6. Realistic 3D Grass Patches (low_poly_grass_lods_1.glb - lush centered clumps) */}
      <GrassPatch position={[-0.3, 0, -0.9]} scale={1.1} />
      <GrassPatch position={[1.2, 0, 2.2]} scale={1.0} />
      <GrassPatch position={[-2.4, 0, 0.5]} scale={1.05} />
      <GrassPatch position={[2.2, 0, -0.4]} scale={0.95} />
      <GrassPatch position={[0.0, 0, 2.6]} scale={1.15} />

      {/* 7. Fallen Autumn Leaf Litter & Blossom Petals */}
      <FallenLeaves position={[1.6, 0, -1.4]} count={22} radius={1.4} color="#ea580c" />
      <FallenLeaves position={[-2.6, 0, -1.6]} count={14} radius={0.9} color="#d97706" />
      <FallenLeaves position={[-0.5, 0, 1.4]} count={10} radius={0.7} color="#b45309" />

      {/* Authentic Indian Sandstone Garden Bench */}
      <group position={[0.2, 0, -0.2]} rotation={[0, -0.4, 0]}>
        {/* Bench Legs */}
        <mesh position={[-0.6, 0.22, 0]} castShadow receiveShadow>
          <boxGeometry args={[0.16, 0.44, 0.36]} />
          <meshStandardMaterial color="#d6c7b2" roughness={0.8} />
        </mesh>
        <mesh position={[0.6, 0.22, 0]} castShadow receiveShadow>
          <boxGeometry args={[0.16, 0.44, 0.36]} />
          <meshStandardMaterial color="#d6c7b2" roughness={0.8} />
        </mesh>
        {/* Bench Slab Seat */}
        <mesh position={[0, 0.46, 0]} castShadow receiveShadow>
          <boxGeometry args={[1.5, 0.08, 0.48]} />
          <meshStandardMaterial color="#eedbc5" roughness={0.75} />
        </mesh>
      </group>
    </group>
  );
};

export const NatureStudio: React.FC<NatureStudioProps> = ({
  natureType,
  lightingPreset,
  smallTreeConfig,
  largeTreeConfig,
  pottedPlantConfig,
  bushConfig,
  grassPatchConfig,
  fallenLeavesConfig,
  autoRotate,
  cameraPreset = 'reference',
}) => {
  const isComposite = natureType === 'botanical-oasis';

  return (
    <Canvas
      shadows
      camera={{ position: [3.5, 2.2, 3.5], fov: 45 }}
      gl={{
        antialias: true,
        alpha: true,
        preserveDrawingBuffer: true,
        toneMapping: THREE.ACESFilmicToneMapping,
        toneMappingExposure: 1.15,
      }}
    >
      <Suspense fallback={null}>
        <StudioLighting preset={lightingPreset} />

        <NatureCameraController
          preset={cameraPreset}
          autoRotate={autoRotate}
          natureType={natureType}
        />

        {/* Circular Dias Studio Platform */}
        <NatureStudioGround isComposite={isComposite} />

        {/* Dynamic Prop Rendering using new GLB assets */}
        {natureType === 'small-tree' && (
          <SmallTree
            position={[0, 0, 0]}
            hasFallenLeaves={smallTreeConfig.hasFallenLeaves}
            scale={smallTreeConfig.scale}
          />
        )}

        {natureType === 'large-tree' && (
          <LargeTree
            position={[0, 0, 0]}
            hasFlowers={largeTreeConfig.hasFlowers}
            variant={largeTreeConfig.isBanyan ? 'linden' : 'elm'}
            scale={largeTreeConfig.scale}
          />
        )}

        {natureType === 'potted-plant' && (
          <PottedPlant
            position={[0, 0, 0]}
            plantType={pottedPlantConfig.plantType}
            potStyle={pottedPlantConfig.potStyle}
            scale={pottedPlantConfig.scale}
          />
        )}

        {natureType === 'bush' && (
          <Bush
            position={[0, 0, 0]}
            scale={bushConfig.scale}
          />
        )}

        {natureType === 'grass-patch' && (
          <GrassPatch
            position={[0, 0, 0]}
            scale={grassPatchConfig.scale}
          />
        )}

        {natureType === 'fallen-leaves' && (
          <FallenLeaves
            position={[0, 0, 0]}
            count={fallenLeavesConfig.count}
            radius={fallenLeavesConfig.radius}
            color={fallenLeavesConfig.leafColor}
            scale={fallenLeavesConfig.scale}
          />
        )}

        {natureType === 'botanical-oasis' && <BotanicalOasisShowcase />}

        {/* Tennis Cricket Ball Physics Testing */}
        <CricketBallThrower />

        {/* Viewport Axis Indicator */}
        <GizmoHelper alignment="bottom-left" margin={[60, 60]}>
          <GizmoViewport axisColors={['#ef4444', '#22c55e', '#3b82f6']} labelColor="#ffffff" />
        </GizmoHelper>
      </Suspense>
    </Canvas>
  );
};
