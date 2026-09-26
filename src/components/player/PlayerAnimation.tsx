import React, { useRef, useMemo, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import type { PlayerState } from './PlayerTypes';

export const WALKING_GLB_PATH = '/Walking.fbx.glb';
export const JUMP_GLB_PATH = '/Jump.fbx.glb';
export const STAND_TO_CROUCH_GLB_PATH = '/Standing To Crouched.fbx.glb';
export const CROUCH_IDLE_GLB_PATH = '/Crouching Idle.fbx.glb';
export const CROUCH_WALK_GLB_PATH = '/Crouch Walk.fbx.glb';
export const CROUCH_TO_STAND_GLB_PATH = '/Crouched To Standing.fbx.glb';

interface PlayerAnimationProps {
  state: PlayerState;
  horizontalSpeed?: number;
  isGrounded?: boolean;
  isCrouching?: boolean;
  bonesMap?: Map<string, THREE.Bone>;
  bindQuats?: Map<string, THREE.Quaternion>;
  bindPositions?: Map<string, THREE.Vector3>;
  characterModel?: THREE.Group | null;
}

/**
 * Prepares an in-place AnimationClip with retargeted skeletal bone names
 * and locked horizontal root displacement to avoid physics capsule drift.
 */
function prepareInPlaceClip(
  animations: THREE.AnimationClip[] | undefined,
  clipName: string,
  activePrefix: string
): THREE.AnimationClip | null {
  if (!animations || animations.length === 0) return null;
  const rawClip = animations[0];
  const clonedClip = rawClip.clone();
  clonedClip.name = clipName;

  clonedClip.tracks.forEach((track) => {
    // Retarget bone prefix (e.g. mixamorig5 -> active character bone prefix)
    track.name = track.name.replace(/^mixamorig\d*/i, activePrefix);

    // In-place conversion: zero out horizontal X and Z translation drift on root Hips
    if (track.name.toLowerCase().includes('hips.position')) {
      const values = track.values;
      const initialX = values[0];
      const initialZ = values[2];
      for (let i = 0; i < values.length; i += 3) {
        values[i] = initialX;
        // Keep vertical Y channel for realistic crouch drop, jump leap, and steps
        values[i + 2] = initialZ;
      }
    }
  });

  return clonedClip;
}

export const PlayerAnimation: React.FC<PlayerAnimationProps> = ({
  state,
  horizontalSpeed = 0,
  bonesMap,
  bindQuats,
  bindPositions,
  characterModel,
}) => {
  const timeRef = useRef<number>(0);
  const landDampRef = useRef<number>(0);
  const prevStateRef = useRef<PlayerState>(state);
  const fallbackQuatsRef = useRef<Map<string, THREE.Quaternion>>(new Map());
  const fallbackPositionsRef = useRef<Map<string, THREE.Vector3>>(new Map());

  // Load all 6 Animation GLB Clips
  const { animations: walkAnims } = useGLTF(WALKING_GLB_PATH);
  const { animations: jumpAnims } = useGLTF(JUMP_GLB_PATH);
  const { animations: standToCrouchAnims } = useGLTF(STAND_TO_CROUCH_GLB_PATH);
  const { animations: crouchIdleAnims } = useGLTF(CROUCH_IDLE_GLB_PATH);
  const { animations: crouchWalkAnims } = useGLTF(CROUCH_WALK_GLB_PATH);
  const { animations: crouchToStandAnims } = useGLTF(CROUCH_TO_STAND_GLB_PATH);

  // Determine active skeleton prefix
  const activePrefix = useMemo(() => {
    const firstBoneName = bonesMap && bonesMap.size > 0 ? Array.from(bonesMap.keys())[0] : '';
    const match = firstBoneName.match(/^(mixamorig\d*)/i);
    return match ? match[1] : 'mixamorig5';
  }, [bonesMap]);

  // Prepared In-Place Animation Clips
  const walkClip = useMemo(() => prepareInPlaceClip(walkAnims, 'walk_in_place', activePrefix), [walkAnims, activePrefix]);
  const jumpClip = useMemo(() => prepareInPlaceClip(jumpAnims, 'jump_in_place', activePrefix), [jumpAnims, activePrefix]);
  const standToCrouchClip = useMemo(() => prepareInPlaceClip(standToCrouchAnims, 'stand_to_crouch', activePrefix), [standToCrouchAnims, activePrefix]);
  const crouchIdleClip = useMemo(() => prepareInPlaceClip(crouchIdleAnims, 'crouch_idle', activePrefix), [crouchIdleAnims, activePrefix]);
  const crouchWalkClip = useMemo(() => prepareInPlaceClip(crouchWalkAnims, 'crouch_walk', activePrefix), [crouchWalkAnims, activePrefix]);
  const crouchToStandClip = useMemo(() => prepareInPlaceClip(crouchToStandAnims, 'crouch_to_stand', activePrefix), [crouchToStandAnims, activePrefix]);

  // Animation Mixer instance bound to Skinned Character Model
  const mixer = useMemo(() => {
    if (!characterModel) return null;
    return new THREE.AnimationMixer(characterModel);
  }, [characterModel]);

  // Action References
  const walkActionRef = useRef<THREE.AnimationAction | null>(null);
  const jumpActionRef = useRef<THREE.AnimationAction | null>(null);
  const standToCrouchActionRef = useRef<THREE.AnimationAction | null>(null);
  const crouchIdleActionRef = useRef<THREE.AnimationAction | null>(null);
  const crouchWalkActionRef = useRef<THREE.AnimationAction | null>(null);
  const crouchToStandActionRef = useRef<THREE.AnimationAction | null>(null);

  // Initialize Animation Actions
  useEffect(() => {
    if (!mixer) return;

    if (walkClip) {
      const a = mixer.clipAction(walkClip);
      a.setLoop(THREE.LoopRepeat, Infinity);
      a.play();
      a.setEffectiveWeight(0);
      walkActionRef.current = a;
    }
    if (jumpClip) {
      const a = mixer.clipAction(jumpClip);
      a.setLoop(THREE.LoopOnce, 1);
      a.clampWhenFinished = true;
      a.play();
      a.setEffectiveWeight(0);
      jumpActionRef.current = a;
    }
    if (standToCrouchClip) {
      const a = mixer.clipAction(standToCrouchClip);
      a.setLoop(THREE.LoopOnce, 1);
      a.clampWhenFinished = true;
      a.play();
      a.setEffectiveWeight(0);
      standToCrouchActionRef.current = a;
    }
    if (crouchIdleClip) {
      const a = mixer.clipAction(crouchIdleClip);
      a.setLoop(THREE.LoopRepeat, Infinity);
      a.play();
      a.setEffectiveWeight(0);
      crouchIdleActionRef.current = a;
    }
    if (crouchWalkClip) {
      const a = mixer.clipAction(crouchWalkClip);
      a.setLoop(THREE.LoopRepeat, Infinity);
      a.play();
      a.setEffectiveWeight(0);
      crouchWalkActionRef.current = a;
    }
    if (crouchToStandClip) {
      const a = mixer.clipAction(crouchToStandClip);
      a.setLoop(THREE.LoopOnce, 1);
      a.clampWhenFinished = true;
      a.play();
      a.setEffectiveWeight(0);
      crouchToStandActionRef.current = a;
    }

    return () => {
      mixer.stopAllAction();
    };
  }, [mixer, walkClip, jumpClip, standToCrouchClip, crouchIdleClip, crouchWalkClip, crouchToStandClip]);

  useFrame((_, delta) => {
    if (!bonesMap || bonesMap.size === 0) return;

    // Cache fallback bind pose if not supplied via props
    if (fallbackQuatsRef.current.size === 0) {
      bonesMap.forEach((bone, name) => {
        fallbackQuatsRef.current.set(name, bone.quaternion.clone());
        fallbackPositionsRef.current.set(name, bone.position.clone());
      });
    }

    const dt = Math.min(delta, 0.05);

    // Stride frequency
    let cycleSpeed = 3.0;
    if (state === 'SPRINT') cycleSpeed = 15.0;
    else if (state === 'RUN') cycleSpeed = 10.5;
    else if (state === 'WALK') cycleSpeed = 6.5;
    else if (state === 'CROUCH_WALK') cycleSpeed = 4.5;
    else cycleSpeed = 1.8;

    timeRef.current += dt * cycleSpeed;
    const t = timeRef.current;

    // Helper: find bone by direct name, prefix variant, or suffix
    const getBone = (targetName: string): THREE.Bone | undefined => {
      if (!bonesMap) return undefined;
      const direct = bonesMap.get(targetName);
      if (direct) return direct;
      const cleanTarget = targetName.replace(/^mixamorig\d*/i, '').toLowerCase();
      for (const [key, bone] of bonesMap.entries()) {
        const cleanKey = key.replace(/^mixamorig\d*/i, '').toLowerCase();
        if (cleanKey === cleanTarget || key.toLowerCase().endsWith(cleanTarget)) {
          return bone;
        }
      }
      return undefined;
    };

    const getRestQuat = (boneName: string): THREE.Quaternion | undefined => {
      if (bindQuats && bindQuats.has(boneName)) return bindQuats.get(boneName);
      return fallbackQuatsRef.current.get(boneName);
    };

    const getRestPos = (boneName: string): THREE.Vector3 | undefined => {
      if (bindPositions && bindPositions.has(boneName)) return bindPositions.get(boneName);
      return fallbackPositionsRef.current.get(boneName);
    };

    // Helper: apply delta rotation relative to pristine bind-pose quaternion
    const applyDeltaRotation = (
      boneName: string,
      x: number,
      y: number,
      z: number,
      order: THREE.EulerOrder = 'XYZ'
    ) => {
      const bone = getBone(boneName);
      if (!bone) return;
      const rest = getRestQuat(bone.name);
      if (!rest) return;

      const tempEuler = new THREE.Euler(x, y, z, order);
      const tempQuat = new THREE.Quaternion().setFromEuler(tempEuler);
      bone.quaternion.copy(rest).multiply(tempQuat);
    };

    // Landing compression dampening
    if (state === 'LAND') {
      landDampRef.current = Math.min(1, landDampRef.current + dt * 8);
    } else {
      landDampRef.current = Math.max(0, landDampRef.current - dt * 6);
    }

    const isWalkingState = state === 'WALK' || state === 'RUN' || state === 'SPRINT';
    const isJumpState = state === 'JUMP' || state === 'FALL';
    const isCrouchState = state === 'CROUCH' || state === 'CROUCH_WALK';
    const wasCrouchState = prevStateRef.current === 'CROUCH' || prevStateRef.current === 'CROUCH_WALK';

    // 1. Trigger Transition Actions
    if (state === 'JUMP' && prevStateRef.current !== 'JUMP') {
      if (jumpActionRef.current) {
        jumpActionRef.current.reset();
        jumpActionRef.current.setEffectiveWeight(1.0);
        jumpActionRef.current.timeScale = 1.45;
        jumpActionRef.current.play();
      }
    }

    // Entering Crouch
    if (isCrouchState && !wasCrouchState) {
      if (standToCrouchActionRef.current) {
        standToCrouchActionRef.current.reset();
        standToCrouchActionRef.current.setEffectiveWeight(1.0);
        standToCrouchActionRef.current.timeScale = 1.5;
        standToCrouchActionRef.current.play();
      }
    }

    // Exiting Crouch to Standing
    if (!isCrouchState && wasCrouchState && state === 'IDLE') {
      if (crouchToStandActionRef.current) {
        crouchToStandActionRef.current.reset();
        crouchToStandActionRef.current.setEffectiveWeight(1.0);
        crouchToStandActionRef.current.timeScale = 1.5;
        crouchToStandActionRef.current.play();
      }
    }

    prevStateRef.current = state;

    // 2. Control Weights for All Actions
    // Walking / Running / Sprinting
    if (walkActionRef.current) {
      if (isWalkingState && !isJumpState && !isCrouchState) {
        let targetSpeed = 1.0;
        if (state === 'SPRINT') targetSpeed = 1.75;
        else if (state === 'RUN') targetSpeed = 1.35;
        else if (state === 'WALK') targetSpeed = Math.max(0.8, horizontalSpeed / 2.2);

        walkActionRef.current.timeScale = targetSpeed;
        walkActionRef.current.setEffectiveWeight(
          THREE.MathUtils.damp(walkActionRef.current.getEffectiveWeight(), 1.0, 14, dt)
        );
      } else {
        walkActionRef.current.setEffectiveWeight(
          THREE.MathUtils.damp(walkActionRef.current.getEffectiveWeight(), 0.0, 14, dt)
        );
      }
    }

    // Jump / Fall
    if (jumpActionRef.current) {
      if (isJumpState) {
        jumpActionRef.current.setEffectiveWeight(
          THREE.MathUtils.damp(jumpActionRef.current.getEffectiveWeight(), 1.0, 14, dt)
        );
      } else {
        jumpActionRef.current.setEffectiveWeight(
          THREE.MathUtils.damp(jumpActionRef.current.getEffectiveWeight(), 0.0, 14, dt)
        );
      }
    }

    // Crouch Locomotion 1D Blend Tree (Crouch Idle <-> Crouch Walk)
    const crouchSpeedRatio = Math.min(1.0, Math.max(0.0, (horizontalSpeed - 0.05) / 1.4));
    const targetCrouchWalkWeight = isCrouchState && !isJumpState ? (state === 'CROUCH_WALK' ? Math.max(0.3, crouchSpeedRatio) : crouchSpeedRatio) : 0;
    const targetCrouchIdleWeight = isCrouchState && !isJumpState ? (1.0 - targetCrouchWalkWeight) : 0;

    if (crouchIdleActionRef.current) {
      crouchIdleActionRef.current.setEffectiveWeight(
        THREE.MathUtils.damp(crouchIdleActionRef.current.getEffectiveWeight(), targetCrouchIdleWeight, 16, dt)
      );
    }

    if (crouchWalkActionRef.current) {
      if (isCrouchState && !isJumpState) {
        crouchWalkActionRef.current.timeScale = Math.max(0.9, Math.min(1.6, horizontalSpeed / 1.3));
      }
      crouchWalkActionRef.current.setEffectiveWeight(
        THREE.MathUtils.damp(crouchWalkActionRef.current.getEffectiveWeight(), targetCrouchWalkWeight, 16, dt)
      );
    }

    // Stand to Crouch transition action
    if (standToCrouchActionRef.current) {
      if (isCrouchState && standToCrouchActionRef.current.isRunning()) {
        standToCrouchActionRef.current.setEffectiveWeight(
          THREE.MathUtils.damp(standToCrouchActionRef.current.getEffectiveWeight(), 0.0, 6, dt)
        );
      } else {
        standToCrouchActionRef.current.setEffectiveWeight(0);
      }
    }

    // Crouch to Stand transition action
    if (crouchToStandActionRef.current) {
      if (!isCrouchState && crouchToStandActionRef.current.isRunning()) {
        crouchToStandActionRef.current.setEffectiveWeight(
          THREE.MathUtils.damp(crouchToStandActionRef.current.getEffectiveWeight(), 0.0, 6, dt)
        );
      } else {
        crouchToStandActionRef.current.setEffectiveWeight(0);
      }
    }

    // Update Animation Mixer
    if (mixer) {
      mixer.update(dt);
    }

    // 3. Procedural Overlay Poses for Standing IDLE and LAND states
    if (state === 'IDLE' && !isCrouchState && (!crouchToStandActionRef.current || !crouchToStandActionRef.current.isRunning())) {
      // Reset bones to pristine bind pose before applying natural standing IDLE breathing & arm posture
      bonesMap.forEach((bone, name) => {
        const rQ = getRestQuat(name);
        const rP = getRestPos(name);
        if (rQ) bone.quaternion.copy(rQ);
        if (rP) bone.position.copy(rP);
      });

      const breath = Math.sin(t * 1.5) * 0.015;

      // Spine: subtle breathing
      applyDeltaRotation('Spine', breath, 0, 0);
      applyDeltaRotation('Spine1', breath * 0.6, 0, 0);
      applyDeltaRotation('Neck', -0.015, 0, 0);
      applyDeltaRotation('Head', 0.015, 0, 0);

      // Arms: natural resting position at sides
      applyDeltaRotation('LeftArm', 1.30, 0.15, 0.10);
      applyDeltaRotation('RightArm', 1.30, -0.15, -0.10);

      // ForeArms: subtle natural resting elbow curve
      applyDeltaRotation('LeftForeArm', 0.10, 0, 0.08);
      applyDeltaRotation('RightForeArm', 0.10, 0, -0.08);

      // Hands: relaxed
      applyDeltaRotation('LeftHand', 0, 0, 0);
      applyDeltaRotation('RightHand', 0, 0, 0);

      // Legs: straight standing
      applyDeltaRotation('LeftUpLeg', 0.01, 0, 0);
      applyDeltaRotation('RightUpLeg', -0.01, 0, 0);
      applyDeltaRotation('LeftLeg', 0, 0, 0);
      applyDeltaRotation('RightLeg', 0, 0, 0);
    }
  });

  return null;
};

// Preload All Animation GLB assets
useGLTF.preload(WALKING_GLB_PATH);
useGLTF.preload(JUMP_GLB_PATH);
useGLTF.preload(STAND_TO_CROUCH_GLB_PATH);
useGLTF.preload(CROUCH_IDLE_GLB_PATH);
useGLTF.preload(CROUCH_WALK_GLB_PATH);
useGLTF.preload(CROUCH_TO_STAND_GLB_PATH);
