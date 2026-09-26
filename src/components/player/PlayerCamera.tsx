import React, { useRef, useEffect } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import type { ThirdPersonCameraParams } from './PlayerTypes';
import type { CollisionCollider } from './PlayerPhysics';

interface PlayerCameraProps {
  targetPosition: THREE.Vector3;
  targetYaw: number;
  mouseDelta: { deltaX: number; deltaY: number };
  isSprinting: boolean;
  params?: Partial<ThirdPersonCameraParams>;
  colliders?: CollisionCollider[];
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
    distance: 3.4,
    minDistance: 1.0,
    maxDistance: 6.5,
    height: 1.45,
    shoulderOffset: 0.2,
    fov: 46,
    sprintFov: 54,
    pitchMin: -35,
    pitchMax: 65,
    sensitivityX: 0.0032,
    sensitivityY: 0.0026,
    damping: 0.14,
    collisionRadius: 0.2,
    ...customParams,
  };

  // Camera spherical angles
  const yawRef = useRef<number>(0);
  const pitchRef = useRef<number>(10 * (Math.PI / 180)); // 10 degrees default pitch
  const currentPosRef = useRef<THREE.Vector3>(new THREE.Vector3());
  const currentTargetRef = useRef<THREE.Vector3>(new THREE.Vector3());
  const currentDistanceRef = useRef<number>(params.distance);

  // Initialize camera position behind player on mount
  useEffect(() => {
    yawRef.current = targetYaw;
    if (onYawChange) onYawChange(targetYaw);
  }, []);

  useFrame((_, delta) => {
    if (!enabled) return;

    const dt = Math.min(delta, 0.05);

    // 1. Process Mouse Look Input
    if (mouseDelta.deltaX !== 0 || mouseDelta.deltaY !== 0) {
      yawRef.current -= mouseDelta.deltaX * params.sensitivityX;
      pitchRef.current -= mouseDelta.deltaY * params.sensitivityY;

      // Clamp pitch to prevent flipping
      const minPitchRad = THREE.MathUtils.degToRad(params.pitchMin);
      const maxPitchRad = THREE.MathUtils.degToRad(params.pitchMax);
      pitchRef.current = THREE.MathUtils.clamp(pitchRef.current, minPitchRad, maxPitchRad);

      if (onYawChange) {
        onYawChange(yawRef.current);
      }
    }

    // 2. Desired Focus Target (Player Chest/Head with slight right shoulder offset)
    const shoulderDir = new THREE.Vector3(Math.cos(yawRef.current), 0, -Math.sin(yawRef.current));
    const idealTarget = new THREE.Vector3(
      targetPosition.x + shoulderDir.x * params.shoulderOffset,
      targetPosition.y + params.height,
      targetPosition.z + shoulderDir.z * params.shoulderOffset
    );

    // Smoothly follow focus target
    currentTargetRef.current.lerp(idealTarget, 1 - Math.exp(-18 * dt));

    // 3. Compute Ideal Camera Position along Sphere
    const cosPitch = Math.cos(pitchRef.current);
    const sinPitch = Math.sin(pitchRef.current);
    const sinYaw = Math.sin(yawRef.current);
    const cosYaw = Math.cos(yawRef.current);

    let targetDist = params.distance;

    // 4. Collision-Aware Occlusion Raycasting
    // Check if walls or roofs intersect the line from focus target to camera
    const rayDir = new THREE.Vector3(
      sinYaw * cosPitch,
      sinPitch,
      cosYaw * cosPitch
    ).normalize();

    // Check collision with scene colliders
    for (const col of colliders) {
      if (col.type === 'box' && col.min && col.max) {
        const box = new THREE.Box3(col.min, col.max);
        const ray = new THREE.Ray(currentTargetRef.current, rayDir);
        const intersect = ray.intersectBox(box, new THREE.Vector3());
        if (intersect) {
          const hitDist = currentTargetRef.current.distanceTo(intersect) - params.collisionRadius;
          if (hitDist > 0 && hitDist < targetDist) {
            targetDist = Math.max(params.minDistance, hitDist);
          }
        }
      }
    }

    // Smoothly interpolate distance to prevent snapping
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

    // Prevent camera from clipping through floor
    if (desiredCamPos.y < 0.25) {
      desiredCamPos.y = 0.25;
    }

    // 5. Smooth Camera Movement Interpolation
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
