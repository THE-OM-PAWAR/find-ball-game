import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { DogModel } from './DogModel';
import type { DogAIState } from './DogTypes';

interface DogAnimationProps {
  state: DogAIState;
  speed: number;
  scale?: number;
  shouldBark?: boolean;
}

export const DogAnimation: React.FC<DogAnimationProps> = ({
  state,
  speed,
  scale = 1.0,
  shouldBark = false,
}) => {
  const groupRef = useRef<THREE.Group>(null);
  const timeRef = useRef<number>(0);

  // Smooth posture targets
  const targetPosY = useRef<number>(0);
  const targetRotX = useRef<number>(0);
  const targetRotZ = useRef<number>(0);
  const targetScaleY = useRef<number>(1);

  useFrame((_, delta) => {
    if (!groupRef.current) return;
    timeRef.current += delta;
    const t = timeRef.current;

    const isMoving = speed > 0.1;

    let posY = 0;
    let rotX = 0;
    let rotZ = 0;
    let scaleY = 1.0;

    switch (state) {
      // 1. SLEEPING - Lower to ground, lie on side, breathe slow
      case 'SLEEPING': {
        posY = -0.16;
        rotZ = 0.45; // Lean on side
        rotX = 0.1;
        scaleY = 0.82 + Math.sin(t * 1.5) * 0.03; // Slow sleep breathing
        break;
      }

      // 2. ALERT - Tense upright stance, barking recoil
      case 'ALERT': {
        rotX = -0.15; // Chest high
        if (shouldBark) {
          // Sharp barking pulsation
          const barkPulse = Math.sin(t * 12);
          if (barkPulse > 0.6) {
            posY = 0.03;
            rotX = -0.22;
          }
        }
        break;
      }

      // 3. DISTRACTED (Eating / Sniffing biscuit)
      case 'DISTRACTED': {
        if (!isMoving) {
          posY = -0.06;
          rotX = 0.28; // Head down to floor sniffing/chewing
          // Chewing bob
          posY += Math.sin(t * 8) * 0.015;
        }
        break;
      }

      // 4. INVESTIGATING / SUSPICIOUS - Sniffing & cautious
      case 'INVESTIGATING':
      case 'SUSPICIOUS': {
        if (!isMoving) {
          rotX = 0.18; // Head lowered sniffing ground
          posY = -0.02;
        }
        break;
      }

      // 5. IDLE - Natural resting stand + breathing
      case 'IDLE':
      default: {
        scaleY = 1.0 + Math.sin(t * 2.5) * 0.015; // Calm breathing
        break;
      }
    }

    // Dynamic Trotting / Walking cycle when moving
    if (isMoving) {
      const strideFreq = speed > 3.0 ? 16.0 : 10.0;
      const strideBob = speed > 3.0 ? 0.04 : 0.02;
      const strideRoll = speed > 3.0 ? 0.06 : 0.03;

      posY += Math.abs(Math.sin(t * strideFreq)) * strideBob;
      rotZ += Math.sin(t * (strideFreq / 2)) * strideRoll;
      rotX += Math.sin(t * strideFreq) * 0.03;
    }

    // Smooth lerp to targets
    targetPosY.current = THREE.MathUtils.lerp(targetPosY.current, posY, delta * 12);
    targetRotX.current = THREE.MathUtils.lerp(targetRotX.current, rotX, delta * 12);
    targetRotZ.current = THREE.MathUtils.lerp(targetRotZ.current, rotZ, delta * 12);
    targetScaleY.current = THREE.MathUtils.lerp(targetScaleY.current, scaleY, delta * 12);

    groupRef.current.position.y = targetPosY.current;
    groupRef.current.rotation.x = targetRotX.current;
    groupRef.current.rotation.z = targetRotZ.current;
    groupRef.current.scale.set(scale, scale * targetScaleY.current, scale);
  });

  return (
    <group ref={groupRef}>
      <DogModel scale={1.0} />
    </group>
  );
};
