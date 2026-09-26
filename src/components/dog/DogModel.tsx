import React, { useMemo, useEffect } from 'react';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';

const GLB_PRIMARY_URL = '/dog/dog.glb';
const GLB_FALLBACK_URL = '/dog/source/animal  10.glb';

export interface DogModelProps {
  scale?: number;
}

export const DogModel: React.FC<DogModelProps> = ({ scale = 1.0 }) => {
  // Load Dog GLB
  const { scene } = useGLTF(GLB_PRIMARY_URL);

  const clonedScene = useMemo(() => {
    const clone = scene.clone(true);
    clone.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
    return clone;
  }, [scene]);

  return (
    <group scale={scale} position={[0, 0, 0]}>
      <primitive object={clonedScene} />
    </group>
  );
};

// Preload assets for instant load
try {
  useGLTF.preload(GLB_PRIMARY_URL);
} catch (e) {
  // Graceful fallback
}
