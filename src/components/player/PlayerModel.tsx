import React, { useMemo, useEffect, useRef } from 'react';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import { SkeletonUtils } from 'three-stdlib';
import type { PlayerState } from './PlayerTypes';

export const GLB_CHARACTER_PATH = '/X Bot.fbx.glb';

interface PlayerModelProps {
  state?: PlayerState;
  facingAngle: number;
  horizontalSpeed?: number;
  isGrounded?: boolean;
  isCrouching: boolean;
  onModelReady?: (model: THREE.Group, bones: Map<string, THREE.Bone>) => void;
}

export const PlayerModel: React.FC<PlayerModelProps> = ({
  facingAngle,
  isCrouching,
  onModelReady,
}) => {
  // Load the exact provided GLB character model
  const { scene } = useGLTF(GLB_CHARACTER_PATH);

  const modelRef = useRef<THREE.Group>(null);

  // Clone scene with skeleton hierarchy preservation
  const { clonedScene, bonesMap } = useMemo(() => {
    const clone = SkeletonUtils.clone(scene) as THREE.Group;
    const bones = new Map<string, THREE.Bone>();

    clone.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
      if ((child as THREE.Bone).isBone) {
        bones.set(child.name, child as THREE.Bone);
      }
    });

    return { clonedScene: clone, bonesMap: bones };
  }, [scene]);

  useEffect(() => {
    if (onModelReady && modelRef.current) {
      onModelReady(modelRef.current, bonesMap);
    }
  }, [clonedScene, bonesMap, onModelReady]);

  return (
    <group
      ref={modelRef}
      rotation={[0, facingAngle, 0]}
      position={[0, isCrouching ? -0.25 : 0, 0]}
    >
      {/* 
        The raw GLB geometry is 180.88cm tall (FBX 1unit = 1cm).
        Scale 0.01 maps 180.88cm to 1.808m in Three.js metric units.
      */}
      <primitive object={clonedScene} scale={[0.01, 0.01, 0.01]} />
    </group>
  );
};

// Preload the GLB character asset for instant loading without hitching
useGLTF.preload(GLB_CHARACTER_PATH);
