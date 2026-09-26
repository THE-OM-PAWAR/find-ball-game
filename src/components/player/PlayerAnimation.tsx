import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import type { PlayerState } from './PlayerTypes';

interface PlayerAnimationProps {
  state: PlayerState;
  horizontalSpeed?: number;
  isGrounded?: boolean;
  isCrouching?: boolean;
  bonesMap?: Map<string, THREE.Bone>;
}

export const PlayerAnimation: React.FC<PlayerAnimationProps> = ({
  state,
  bonesMap,
}) => {
  const timeRef = useRef<number>(0);
  const landDampRef = useRef<number>(0);

  useFrame((_, delta) => {
    if (!bonesMap || bonesMap.size === 0) return;

    const dt = Math.min(delta, 0.05);

    // Dynamic stride frequency based on movement speed
    let cycleSpeed = 4;
    if (state === 'SPRINT') cycleSpeed = 16;
    else if (state === 'RUN') cycleSpeed = 12;
    else if (state === 'WALK') cycleSpeed = 7;
    else if (state === 'CROUCH_WALK') cycleSpeed = 5;
    else cycleSpeed = 2;

    timeRef.current += dt * cycleSpeed;
    const t = timeRef.current;

    // Fetch primary Mixamo humanoid bones
    const hips = bonesMap.get('mixamorigHips');
    const spine = bonesMap.get('mixamorigSpine') || bonesMap.get('mixamorigSpine1');
    const neck = bonesMap.get('mixamorigNeck');
    const head = bonesMap.get('mixamorigHead');
    const lUpLeg = bonesMap.get('mixamorigLeftUpLeg');
    const rUpLeg = bonesMap.get('mixamorigRightUpLeg');
    const lLeg = bonesMap.get('mixamorigLeftLeg');
    const rLeg = bonesMap.get('mixamorigRightLeg');
    const lArm = bonesMap.get('mixamorigLeftArm');
    const rArm = bonesMap.get('mixamorigRightArm');
    const lForeArm = bonesMap.get('mixamorigLeftForeArm');
    const rForeArm = bonesMap.get('mixamorigRightForeArm');

    if (!hips || !lUpLeg || !rUpLeg) return;

    // Landing compression dampening
    if (state === 'LAND') {
      landDampRef.current = Math.min(1, landDampRef.current + dt * 8);
    } else {
      landDampRef.current = Math.max(0, landDampRef.current - dt * 6);
    }

    const stride = Math.sin(t);

    switch (state) {
      case 'IDLE': {
        const breath = Math.sin(t * 1.5) * 0.02;
        if (spine) spine.rotation.x = 0.03 + breath;
        if (neck) neck.rotation.x = -0.02;
        if (head) head.rotation.x = 0.01;

        lUpLeg.rotation.set(-0.04, 0, -0.02);
        rUpLeg.rotation.set(-0.04, 0, 0.02);
        if (lLeg) lLeg.rotation.set(0.06, 0, 0);
        if (rLeg) rLeg.rotation.set(0.06, 0, 0);

        if (lArm) lArm.rotation.set(0.1, 0, -0.15);
        if (rArm) rArm.rotation.set(0.1, 0, 0.15);
        if (lForeArm) lForeArm.rotation.set(0.2, 0, 0);
        if (rForeArm) rForeArm.rotation.set(0.2, 0, 0);
        break;
      }

      case 'WALK': {
        if (spine) {
          spine.rotation.x = 0.06;
          spine.rotation.y = -stride * 0.06;
        }

        lUpLeg.rotation.x = stride * 0.45;
        rUpLeg.rotation.x = -stride * 0.45;
        if (lLeg) lLeg.rotation.x = Math.max(0, -stride * 0.55);
        if (rLeg) rLeg.rotation.x = Math.max(0, stride * 0.55);

        if (lArm) lArm.rotation.set(-stride * 0.45, 0, -0.12);
        if (rArm) rArm.rotation.set(stride * 0.45, 0, 0.12);
        if (lForeArm) lForeArm.rotation.set(0.35, 0, 0);
        if (rForeArm) rForeArm.rotation.set(0.35, 0, 0);
        break;
      }

      case 'RUN': {
        if (spine) {
          spine.rotation.x = 0.16;
          spine.rotation.y = -stride * 0.12;
        }

        lUpLeg.rotation.x = stride * 0.85;
        rUpLeg.rotation.x = -stride * 0.85;
        if (lLeg) lLeg.rotation.x = Math.max(0, -stride * 1.1);
        if (rLeg) rLeg.rotation.x = Math.max(0, stride * 1.1);

        if (lArm) lArm.rotation.set(-stride * 0.9, 0.1, -0.2);
        if (rArm) rArm.rotation.set(stride * 0.9, -0.1, 0.2);
        if (lForeArm) lForeArm.rotation.set(0.65, 0, 0);
        if (rForeArm) rForeArm.rotation.set(0.65, 0, 0);
        break;
      }

      case 'SPRINT': {
        if (spine) {
          spine.rotation.x = 0.32; // Strong forward lean
          spine.rotation.y = -stride * 0.18;
        }

        lUpLeg.rotation.x = stride * 1.2;
        rUpLeg.rotation.x = -stride * 1.2;
        if (lLeg) lLeg.rotation.x = Math.max(0, -stride * 1.4);
        if (rLeg) rLeg.rotation.x = Math.max(0, stride * 1.4);

        if (lArm) lArm.rotation.set(-stride * 1.3, 0.15, -0.28);
        if (rArm) rArm.rotation.set(stride * 1.3, -0.15, 0.28);
        if (lForeArm) lForeArm.rotation.set(0.9, 0, 0);
        if (rForeArm) rForeArm.rotation.set(0.9, 0, 0);
        break;
      }

      case 'CROUCH':
      case 'CROUCH_WALK': {
        const isMoving = state === 'CROUCH_WALK';
        const crStride = isMoving ? Math.sin(t) : 0;

        if (spine) spine.rotation.x = 0.35;

        lUpLeg.rotation.set(0.85 + crStride * 0.3, 0, -0.15);
        rUpLeg.rotation.set(0.85 - crStride * 0.3, 0, 0.15);
        if (lLeg) lLeg.rotation.set(1.15 - Math.max(0, crStride * 0.4), 0, 0);
        if (rLeg) rLeg.rotation.set(1.15 - Math.max(0, -crStride * 0.4), 0, 0);

        if (lArm) lArm.rotation.set(0.4, 0, -0.15);
        if (rArm) rArm.rotation.set(0.4, 0, 0.15);
        if (lForeArm) lForeArm.rotation.set(0.5, 0, 0);
        if (rForeArm) rForeArm.rotation.set(0.5, 0, 0);
        break;
      }

      case 'JUMP': {
        if (spine) spine.rotation.x = 0.1;
        lUpLeg.rotation.set(0.4, 0, -0.12);
        rUpLeg.rotation.set(0.2, 0, 0.12);
        if (lLeg) lLeg.rotation.set(0.65, 0, 0);
        if (rLeg) rLeg.rotation.set(0.85, 0, 0);

        if (lArm) lArm.rotation.set(-0.6, 0, -0.4);
        if (rArm) rArm.rotation.set(-0.7, 0, 0.4);
        break;
      }

      case 'FALL': {
        if (spine) spine.rotation.x = -0.08;
        lUpLeg.rotation.set(0.15, 0, -0.15);
        rUpLeg.rotation.set(0.15, 0, 0.15);
        if (lLeg) lLeg.rotation.set(0.3, 0, 0);
        if (rLeg) rLeg.rotation.set(0.3, 0, 0);

        if (lArm) lArm.rotation.set(-0.8, 0, -0.5);
        if (rArm) rArm.rotation.set(-0.8, 0, 0.5);
        break;
      }
    }
  });

  return null;
};
