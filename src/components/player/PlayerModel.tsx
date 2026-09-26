import React, { useMemo, useEffect, useRef } from 'react';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import { SkeletonUtils } from 'three-stdlib';
import type { PlayerState } from './PlayerTypes';

export const GLB_CHARACTER_PATH = '/Ch38_nonPBR.fbx.glb';

interface PlayerModelProps {
  state?: PlayerState;
  facingAngle: number;
  horizontalSpeed?: number;
  isGrounded?: boolean;
  isCrouching: boolean;
  onModelReady?: (
    model: THREE.Group,
    bones: Map<string, THREE.Bone>,
    bindQuats?: Map<string, THREE.Quaternion>,
    bindPositions?: Map<string, THREE.Vector3>
  ) => void;
}

export const PlayerModel: React.FC<PlayerModelProps> = ({
  facingAngle,
  isCrouching: _isCrouching,
  onModelReady,
}) => {
  // Load the exact provided GLB character model
  const { scene } = useGLTF(GLB_CHARACTER_PATH);

  const modelRef = useRef<THREE.Group>(null);

  // Clone scene with skeleton hierarchy preservation
  const { clonedScene, bonesMap, bindQuats, bindPositions } = useMemo(() => {
    const clone = SkeletonUtils.clone(scene) as THREE.Group;
    const bones = new Map<string, THREE.Bone>();
    const quats = new Map<string, THREE.Quaternion>();
    const positions = new Map<string, THREE.Vector3>();

    clone.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.SkinnedMesh;
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        mesh.frustumCulled = false;

        if (Array.isArray(mesh.material)) {
          mesh.material.forEach((mat) => {
            if (mat.transparent) {
              mat.depthWrite = true;
            }
          });
        } else if (mesh.material && (mesh.material as THREE.Material).transparent) {
          (mesh.material as THREE.Material).depthWrite = true;
        }
      }
      if ((child as THREE.Bone).isBone) {
        const bone = child as THREE.Bone;
        bones.set(bone.name, bone);
        quats.set(bone.name, bone.quaternion.clone());
        positions.set(bone.name, bone.position.clone());
      }
    });

    return {
      clonedScene: clone,
      bonesMap: bones,
      bindQuats: quats,
      bindPositions: positions,
    };
  }, [scene]);

  useEffect(() => {
    if (onModelReady && modelRef.current) {
      onModelReady(modelRef.current, bonesMap, bindQuats, bindPositions);
    }
  }, [clonedScene, bonesMap, bindQuats, bindPositions, onModelReady]);

  return (
    <group
      ref={modelRef}
      rotation={[0, facingAngle, 0]}
      position={[0, 0, 0]}
    >
      {/* 
        The raw GLB geometry is 178.47cm tall (FBX 1unit = 1cm).
        Scale 0.01 maps 178.47cm to 1.785m in Three.js metric units.
      */}
      <primitive object={clonedScene} scale={[0.01, 0.01, 0.01]} />
    </group>
  );
};

// Preload the GLB character asset for instant loading without hitching
useGLTF.preload(GLB_CHARACTER_PATH);
