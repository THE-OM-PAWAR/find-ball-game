import React, { useRef, useEffect } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import type { ThirdPersonCameraParams, EnvironmentCollider } from './PlayerTypes';

interface PlayerCameraProps {
  targetPosition: THREE.Vector3;
  targetYaw: number;
  mouseDelta: { deltaX: number; deltaY: number };
  isSprinting: boolean;
  params?: Partial<ThirdPersonCameraParams>;
  colliders?: EnvironmentCollider[];
  onYawChange?: (yaw: number) => void;
  enabled?: boolean;
}

export const PlayerCamera: React.FC<PlayerCameraProps> = ({
  targetPosition,
  targetYaw,
  mouseDelta,
  isSprinting,
  params: customParams,
  colliders = [],
  onYawChange,
  enabled = true,
}) => {
  const { camera } = useThree();

  const params: ThirdPersonCameraParams = {
    distance: 3.6,
    minDistance: 1.2,
    maxDistance: 7.2,
    height: 1.48,
    shoulderOffset: 0.18,
    fov: 54,
    sprintFov: 62,
    pitchMin: -38,
    pitchMax: 68,
    sensitivityX: 0.003,
    sensitivityY: 0.0024,
    damping: 0.14,
    ...customParams,
  };

  // Spherical Angles
  const yawRef = useRef<number>(0);
  const pitchRef = useRef<number>(12 * (Math.PI / 180));
  const currentPosRef = useRef<THREE.Vector3>(new THREE.Vector3());
  const currentTargetRef = useRef<THREE.Vector3>(new THREE.Vector3());
  const currentDistanceRef = useRef<number>(params.distance);

  useEffect(() => {
    yawRef.current = targetYaw;
    if (onYawChange) onYawChange(targetYaw);
  }, []);

  useFrame((_, delta) => {
    if (!enabled) return;

    const dt = Math.min(delta, 0.05);

    // 1. Process Mouse Look
    if (mouseDelta.deltaX !== 0 || mouseDelta.deltaY !== 0) {
      yawRef.current -= mouseDelta.deltaX * params.sensitivityX;
      pitchRef.current -= mouseDelta.deltaY * params.sensitivityY;

      const minPitchRad = THREE.MathUtils.degToRad(params.pitchMin);
      const maxPitchRad = THREE.MathUtils.degToRad(params.pitchMax);
      pitchRef.current = THREE.MathUtils.clamp(pitchRef.current, minPitchRad, maxPitchRad);

      if (onYawChange) {
        onYawChange(yawRef.current);
      }
    }

    // 2. Camera Focus Target (Chest/Head)
    const shoulderDir = new THREE.Vector3(Math.cos(yawRef.current), 0, -Math.sin(yawRef.current));
    const idealTarget = new THREE.Vector3(
      targetPosition.x + shoulderDir.x * params.shoulderOffset,
      targetPosition.y + params.height,
      targetPosition.z + shoulderDir.z * params.shoulderOffset
    );

    currentTargetRef.current.lerp(idealTarget, 1 - Math.exp(-20 * dt));

    // 3. Spherical Camera Position
    const cosPitch = Math.cos(pitchRef.current);
    const sinPitch = Math.sin(pitchRef.current);
    const sinYaw = Math.sin(yawRef.current);
    const cosYaw = Math.cos(yawRef.current);

    let targetDist = params.distance;

    // 4. Collision-Aware Occlusion (Prevent clipping through walls)
    const rayDir = new THREE.Vector3(
      sinYaw * cosPitch,
      sinPitch,
      cosYaw * cosPitch
    ).normalize();

    for (const col of colliders) {
      if (col.type === 'box' && col.min && col.max) {
        const box = new THREE.Box3(col.min, col.max);
        const ray = new THREE.Ray(currentTargetRef.current, rayDir);
        const intersect = ray.intersectBox(box, new THREE.Vector3());
        if (intersect) {
          const hitDist = currentTargetRef.current.distanceTo(intersect) - 0.2;
          if (hitDist > 0 && hitDist < targetDist) {
            targetDist = Math.max(params.minDistance, hitDist);
          }
        }
      }
    }

    currentDistanceRef.current = THREE.MathUtils.damp(
      currentDistanceRef.current,
      targetDist,
      16,
      dt
    );

    const desiredCamPos = new THREE.Vector3(
      currentTargetRef.current.x + rayDir.x * currentDistanceRef.current,
      currentTargetRef.current.y + rayDir.y * currentDistanceRef.current,
      currentTargetRef.current.z + rayDir.z * currentDistanceRef.current
    );

    // Prevent camera floor clipping
    if (desiredCamPos.y < 0.25) {
      desiredCamPos.y = 0.25;
    }

    // 5. Smooth Camera Movement
    currentPosRef.current.lerp(desiredCamPos, 1 - Math.exp(-16 * dt));
    camera.position.copy(currentPosRef.current);
    camera.lookAt(currentTargetRef.current);

    // 6. Dynamic FOV on Sprint
    if (camera instanceof THREE.PerspectiveCamera) {
      const targetFov = isSprinting ? params.sprintFov : params.fov;
      camera.fov = THREE.MathUtils.damp(camera.fov, targetFov, 6, dt);
      camera.updateProjectionMatrix();
    }
  });

  return null;
};
