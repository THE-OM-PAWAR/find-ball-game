import React, { useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { CINEMATIC_TIMELINE, type CinematicShot } from './cinematicData';

interface CinematicCameraProps {
  currentTime: number;
  onShotChange?: (shot: CinematicShot) => void;
}

/**
 * Procedural Cinematic Camera Controller
 * Smoothly interpolates camera position, target vector, and field-of-view
 * across all cinematic timeline shots.
 */
export const CinematicCamera: React.FC<CinematicCameraProps> = ({
  currentTime,
  onShotChange,
}) => {
  const { camera } = useThree();
  const currentTargetRef = useRef<THREE.Vector3>(new THREE.Vector3(0, 1.5, 0));
  const activeShotIdRef = useRef<string>('');

  useFrame((_, delta) => {
    const dt = Math.min(delta, 0.05);

    // Find active shot
    const currentShot = CINEMATIC_TIMELINE.find(
      (s) => currentTime >= s.startTime && currentTime < s.startTime + s.duration
    ) || CINEMATIC_TIMELINE[CINEMATIC_TIMELINE.length - 1];

    if (currentShot.id !== activeShotIdRef.current) {
      activeShotIdRef.current = currentShot.id;
      onShotChange?.(currentShot);
    }

    // Shot progress: 0.0 to 1.0
    const shotElapsed = Math.max(0, currentTime - currentShot.startTime);
    const rawProgress = Math.min(1.0, shotElapsed / currentShot.duration);
    // Smooth ease-in-out curve
    const easeProgress = rawProgress * rawProgress * (3 - 2 * rawProgress);

    // 1. Camera Position Interpolation
    const [startX, startY, startZ] = currentShot.cameraPos;
    const [endX, endY, endZ] = currentShot.cameraPosEnd || currentShot.cameraPos;

    const idealCamPos = new THREE.Vector3(
      THREE.MathUtils.lerp(startX, endX, easeProgress),
      THREE.MathUtils.lerp(startY, endY, easeProgress),
      THREE.MathUtils.lerp(startZ, endZ, easeProgress)
    );

    camera.position.lerp(idealCamPos, 1 - Math.exp(-15 * dt));

    // 2. Camera Target LookAt Interpolation
    const [tStartX, tStartY, tStartZ] = currentShot.targetPos;
    const [tEndX, tEndY, tEndZ] = currentShot.targetPosEnd || currentShot.targetPos;

    const idealTarget = new THREE.Vector3(
      THREE.MathUtils.lerp(tStartX, tEndX, easeProgress),
      THREE.MathUtils.lerp(tStartY, tEndY, easeProgress),
      THREE.MathUtils.lerp(tStartZ, tEndZ, easeProgress)
    );

    currentTargetRef.current.lerp(idealTarget, 1 - Math.exp(-18 * dt));
    camera.lookAt(currentTargetRef.current);

    // 3. Field of View (FOV)
    const targetFov = currentShot.fovEnd
      ? THREE.MathUtils.lerp(currentShot.fov, currentShot.fovEnd, easeProgress)
      : currentShot.fov;

    if (camera instanceof THREE.PerspectiveCamera) {
      camera.fov = THREE.MathUtils.lerp(camera.fov, targetFov, 1 - Math.exp(-10 * dt));
      camera.updateProjectionMatrix();
    }
  });

  return null;
};
