import React, { useRef, useMemo, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import { SkeletonUtils } from 'three-stdlib';
import { CinematicAudio } from './CinematicAudio';

const BATSMAN_GLB = '/Ch38_nonPBR.fbx.glb';
const BOWLER_GLB = '/Remy.fbx.glb';
const FIELDER_GLB = '/Ch02_nonPBR.fbx.glb';
const WALKING_GLB = '/Walking.fbx.glb';
const CROUCH_IDLE_GLB = '/Crouching Idle.fbx.glb';

interface CricketMatchActionProps {
  currentTime: number;
}

interface CharacterRig {
  scene: THREE.Group;
  bones: Map<string, THREE.Bone>;
  restQuats: Map<string, THREE.Quaternion>;
  restPositions: Map<string, THREE.Vector3>;
  prefix: string;
}

function extractRig(rawScene: THREE.Group): CharacterRig {
  const cloned = SkeletonUtils.clone(rawScene) as THREE.Group;
  const bones = new Map<string, THREE.Bone>();
  const restQuats = new Map<string, THREE.Quaternion>();
  const restPositions = new Map<string, THREE.Vector3>();
  let prefix = 'mixamorig';

  cloned.traverse((child) => {
    if ((child as THREE.Mesh).isMesh) {
      const mesh = child as THREE.SkinnedMesh;
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      mesh.frustumCulled = false;
      if (Array.isArray(mesh.material)) {
        mesh.material.forEach((m) => {
          if (m.transparent) m.depthWrite = true;
        });
      } else if (mesh.material && (mesh.material as THREE.Material).transparent) {
        (mesh.material as THREE.Material).depthWrite = true;
      }
    }
    if ((child as THREE.Bone).isBone) {
      const bone = child as THREE.Bone;
      bones.set(bone.name, bone);
      restQuats.set(bone.name, bone.quaternion.clone());
      restPositions.set(bone.name, bone.position.clone());

      const match = bone.name.match(/^(mixamorig\d*)/i);
      if (match) prefix = match[1];
    }
  });

  return {
    scene: cloned,
    bones,
    restQuats,
    restPositions,
    prefix,
  };
}

function findBone(bones: Map<string, THREE.Bone>, targetName: string): THREE.Bone | undefined {
  const direct = bones.get(targetName);
  if (direct) return direct;
  const cleanTarget = targetName.replace(/^mixamorig\d*/i, '').replace(/^mixamorig:/i, '').toLowerCase();
  for (const [key, bone] of bones.entries()) {
    const cleanKey = key.replace(/^mixamorig\d*/i, '').replace(/^mixamorig:/i, '').toLowerCase();
    if (cleanKey === cleanTarget || cleanKey.endsWith(cleanTarget)) {
      return bone;
    }
  }
  return undefined;
}

function resetRigPose(rig: CharacterRig) {
  rig.bones.forEach((bone, name) => {
    const q = rig.restQuats.get(name);
    const p = rig.restPositions.get(name);
    if (q) bone.quaternion.copy(q);
    if (p) bone.position.copy(p);
  });
}

function applyDeltaRot(
  rig: CharacterRig,
  boneName: string,
  x: number,
  y: number,
  z: number,
  order: THREE.EulerOrder = 'XYZ'
) {
  const bone = findBone(rig.bones, boneName);
  if (!bone) return;
  const rest = rig.restQuats.get(bone.name);
  if (!rest) return;
  const euler = new THREE.Euler(x, y, z, order);
  const deltaQ = new THREE.Quaternion().setFromEuler(euler);
  bone.quaternion.copy(rest).multiply(deltaQ);
}

function prepareClip(
  animations: THREE.AnimationClip[] | undefined,
  clipName: string,
  activePrefix: string
): THREE.AnimationClip | null {
  if (!animations || animations.length === 0) return null;
  const rawClip = animations[0];
  const clonedClip = rawClip.clone();
  clonedClip.name = clipName;
  clonedClip.tracks.forEach((track) => {
    track.name = track.name.replace(/^mixamorig\d*/i, activePrefix).replace(/^mixamorig:/i, activePrefix);
    // Lock horizontal translation on root hips so character position is controlled explicitly
    if (track.name.toLowerCase().includes('hips.position')) {
      const values = track.values;
      const initX = values[0];
      const initZ = values[2];
      for (let i = 0; i < values.length; i += 3) {
        values[i] = initX;
        values[i + 2] = initZ;
      }
    }
  });
  return clonedClip;
}

/**
 * 3D Animated Cricket Match Scene
 * Authentic Indian Gully Cricket Choreography:
 * - Batsman (Ch38): Sideways ready stance, rhythmic bat-tapping on crease, backlift, power pull shot & follow-through
 * - Bowler (Remy): Running run-up, high leap, overhead windmill delivery & follow-through
 * - Wicketkeeper (Ch02): Authentic crouch behind wickets, standing reaction & hands-on-head in shock
 */
export const CricketMatchAction: React.FC<CricketMatchActionProps> = ({ currentTime }) => {
  const batsmanGLTF = useGLTF(BATSMAN_GLB);
  const bowlerGLTF = useGLTF(BOWLER_GLB);
  const fielderGLTF = useGLTF(FIELDER_GLB);
  const walkingGLTF = useGLTF(WALKING_GLB);
  const crouchIdleGLTF = useGLTF(CROUCH_IDLE_GLB);

  const batsmanRig = useMemo(() => extractRig(batsmanGLTF.scene), [batsmanGLTF]);
  const bowlerRig = useMemo(() => extractRig(bowlerGLTF.scene), [bowlerGLTF]);
  const fielderRig = useMemo(() => extractRig(fielderGLTF.scene), [fielderGLTF]);

  // Animation Mixers for Bowler Run-up and Keeper Crouch
  const bowlerMixer = useMemo(() => new THREE.AnimationMixer(bowlerRig.scene), [bowlerRig]);
  const fielderMixer = useMemo(() => new THREE.AnimationMixer(fielderRig.scene), [fielderRig]);

  const bowlerRunClip = useMemo(
    () => prepareClip(walkingGLTF.animations, 'bowler_run', bowlerRig.prefix),
    [walkingGLTF, bowlerRig]
  );
  const keeperCrouchClip = useMemo(
    () => prepareClip(crouchIdleGLTF.animations, 'keeper_crouch', fielderRig.prefix),
    [crouchIdleGLTF, fielderRig]
  );

  const bowlerRunActionRef = useRef<THREE.AnimationAction | null>(null);
  const keeperCrouchActionRef = useRef<THREE.AnimationAction | null>(null);

  useEffect(() => {
    if (bowlerMixer && bowlerRunClip) {
      const a = bowlerMixer.clipAction(bowlerRunClip);
      a.setLoop(THREE.LoopRepeat, Infinity);
      a.timeScale = 1.7;
      a.play();
      a.setEffectiveWeight(0);
      bowlerRunActionRef.current = a;
    }
    return () => {
      bowlerMixer.stopAllAction();
    };
  }, [bowlerMixer, bowlerRunClip]);

  useEffect(() => {
    if (fielderMixer && keeperCrouchClip) {
      const a = fielderMixer.clipAction(keeperCrouchClip);
      a.setLoop(THREE.LoopRepeat, Infinity);
      a.timeScale = 1.0;
      a.play();
      a.setEffectiveWeight(0);
      keeperCrouchActionRef.current = a;
    }
    return () => {
      fielderMixer.stopAllAction();
    };
  }, [fielderMixer, keeperCrouchClip]);

  const batsmanGroupRef = useRef<THREE.Group>(null);
  const bowlerGroupRef = useRef<THREE.Group>(null);
  const fielderGroupRef = useRef<THREE.Group>(null);
  const ballRef = useRef<THREE.Group>(null);
  const batRef = useRef<THREE.Group>(null);

  const hasHitAudioPlayedRef = useRef<boolean>(false);
  const hasBounceAudioPlayedRef = useRef<boolean>(false);

  // Ball Parabolic Trajectory
  const ballFlightStart = 9.5;
  const ballFlightDuration = 10.0;
  const hitImpactPos = useMemo(() => new THREE.Vector3(0.18, 0.95, -2.5), []);
  const peakPos = useMemo(() => new THREE.Vector3(11.2, 14.8, -1.5), []);
  const landingPos = useMemo(() => new THREE.Vector3(22.4, 6.695, -0.4), []);

  useFrame((_, delta) => {
    const dt = Math.min(delta, 0.05);

    // ── 1. BATSMAN CHOREOGRAPHY (Ch38) ──
    resetRigPose(batsmanRig);

    if (currentTime < 8.0) {
      // PHASE A: Ready Sideways Batting Stance with Rhythmic Crease Tapping
      const tap = Math.sin(currentTime * 4.5) * 0.04;
      const breathe = Math.sin(currentTime * 2.0) * 0.015;

      // Slight athletic ready crouch
      applyDeltaRot(batsmanRig, 'Spine', 0.08 + breathe, 0, 0);
      applyDeltaRot(batsmanRig, 'Spine1', 0.05, 0, 0);
      // Head looking sideways down the pitch towards bowler
      applyDeltaRot(batsmanRig, 'Neck', -0.05, -1.1, 0);
      applyDeltaRot(batsmanRig, 'Head', -0.05, -0.25, 0);

      // Both arms holding bat handle naturally in front of hips (using proven natural arm down axes)
      applyDeltaRot(batsmanRig, 'LeftArm', 1.20 + tap * 0.5, 0.25, 0.15);
      applyDeltaRot(batsmanRig, 'LeftForeArm', 0.35 + tap, 0.1, 0.15);
      applyDeltaRot(batsmanRig, 'RightArm', 1.20 + tap * 0.5, -0.15, -0.15);
      applyDeltaRot(batsmanRig, 'RightForeArm', 0.35 + tap, -0.1, -0.15);

      if (batRef.current) {
        batRef.current.position.set(0.22, 0.46 + tap * 0.1, -2.48);
        batRef.current.rotation.set(0.12 + tap * 0.15, 0.25, -0.15);
      }
    } else if (currentTime >= 8.0 && currentTime < 9.2) {
      // PHASE B: Bowler Running In -> Batsman Backlift & Ready Trigger
      const prep = (currentTime - 8.0) / 1.2;
      const backlift = Math.sin(prep * Math.PI * 0.5);

      applyDeltaRot(batsmanRig, 'Spine', 0.06, -0.15 * backlift, 0);
      applyDeltaRot(batsmanRig, 'Neck', -0.05, -1.15, 0);
      applyDeltaRot(batsmanRig, 'Head', -0.05, -0.25, 0);

      // Raising bat up in backlift
      applyDeltaRot(batsmanRig, 'LeftArm', 1.20 - backlift * 0.45, 0.35, 0.2);
      applyDeltaRot(batsmanRig, 'LeftForeArm', 0.35 + backlift * 0.45, 0.1, 0.2);
      applyDeltaRot(batsmanRig, 'RightArm', 1.20 - backlift * 0.55, -0.25, -0.2);
      applyDeltaRot(batsmanRig, 'RightForeArm', 0.35 + backlift * 0.55, -0.1, -0.2);

      if (batRef.current) {
        batRef.current.position.set(0.24, 0.62 + backlift * 0.28, -2.44);
        batRef.current.rotation.set(-0.25 * backlift, 0.4 + backlift * 0.3, -0.35 * backlift);
      }
    } else if (currentTime >= 9.2 && currentTime < 10.4) {
      // PHASE C: Powerful Downswing & Sixer Impact (Impact at t = 9.5s)
      const swingP = (currentTime - 9.2) / 1.2;
      const swingAngle = Math.sin(swingP * Math.PI);

      // Torso rotates through into shot
      applyDeltaRot(batsmanRig, 'Spine', 0.05, 0.55 * swingAngle - 0.1, 0);
      applyDeltaRot(batsmanRig, 'Neck', -0.1, -0.8 + 0.5 * swingAngle, 0);
      applyDeltaRot(batsmanRig, 'Head', -0.2 * swingAngle, -0.1, 0);

      // Arms swing through the ball in high arc
      applyDeltaRot(batsmanRig, 'LeftArm', 0.7 - swingP * 0.8, 0.3, 0.3);
      applyDeltaRot(batsmanRig, 'LeftForeArm', 0.8 + swingP * 0.3, 0.1, 0.3);
      applyDeltaRot(batsmanRig, 'RightArm', 0.6 - swingP * 0.9, -0.3, -0.3);
      applyDeltaRot(batsmanRig, 'RightForeArm', 0.8 + swingP * 0.3, -0.1, -0.3);

      if (batRef.current) {
        const batX = THREE.MathUtils.lerp(0.24, -0.18, swingP);
        const batY = 0.75 + Math.sin(swingP * Math.PI) * 0.45;
        const batZ = THREE.MathUtils.lerp(-2.44, -2.62, swingP);
        batRef.current.position.set(batX, batY, batZ);
        batRef.current.rotation.set(-0.3 + swingP * 1.6, 0.7 - swingP * 1.4, 0.2 + swingP * 0.8);
      }
    } else {
      // PHASE D: Clean Follow-through & Watching Ball Soar over Terraces
      const skyProgress = Math.min(1.0, (currentTime - 10.4) / 2.0);

      applyDeltaRot(batsmanRig, 'Spine', -0.05 * skyProgress, 0.25 * skyProgress, 0);
      // Head looking up at soaring ball
      applyDeltaRot(batsmanRig, 'Neck', -0.35 * skyProgress, 0.3 * skyProgress, 0);
      applyDeltaRot(batsmanRig, 'Head', -0.25 * skyProgress, 0.2 * skyProgress, 0);

      // Bat held high over left side in follow-through pose
      applyDeltaRot(batsmanRig, 'LeftArm', -0.1, 0.2, 0.2);
      applyDeltaRot(batsmanRig, 'LeftForeArm', 1.1, 0.1, 0.2);
      applyDeltaRot(batsmanRig, 'RightArm', -0.2, -0.2, -0.2);
      applyDeltaRot(batsmanRig, 'RightForeArm', 1.1, -0.1, -0.2);

      if (batRef.current) {
        batRef.current.position.set(-0.2, 1.32, -2.58);
        batRef.current.rotation.set(1.2, -0.4, 1.1);
      }
    }

    // ── 2. BOWLER CHOREOGRAPHY (Remy - Bunty) ──
    if (currentTime >= 5.0 && currentTime < 8.5) {
      // Smooth Mocap Run-Up from Walking.fbx.glb
      const runProgress = (currentTime - 5.0) / 3.5;
      const curZ = THREE.MathUtils.lerp(9.5, 3.2, runProgress);
      if (bowlerGroupRef.current) {
        bowlerGroupRef.current.position.set(0, 0, curZ);
      }
      if (bowlerRunActionRef.current) {
        bowlerRunActionRef.current.setEffectiveWeight(1.0);
      }
      bowlerMixer.update(dt);
    } else {
      if (bowlerRunActionRef.current) {
        bowlerRunActionRef.current.setEffectiveWeight(0);
      }
      resetRigPose(bowlerRig);

      if (currentTime < 5.0) {
        // Natural ready stance at mark
        if (bowlerGroupRef.current) bowlerGroupRef.current.position.set(0, 0, 9.5);
        applyDeltaRot(bowlerRig, 'LeftArm', 1.25, 0.15, 0.1);
        applyDeltaRot(bowlerRig, 'LeftForeArm', 0.15, 0, 0.05);
        applyDeltaRot(bowlerRig, 'RightArm', 1.25, -0.15, -0.1);
        applyDeltaRot(bowlerRig, 'RightForeArm', 0.15, 0, -0.05);
      } else if (currentTime >= 8.5 && currentTime < 9.5) {
        // Overhead Bowling Windmill Delivery (Release at t = 8.8s)
        const delivP = (currentTime - 8.5) / 1.0;
        const curZ = THREE.MathUtils.lerp(3.2, 2.4, delivP);
        if (bowlerGroupRef.current) bowlerGroupRef.current.position.set(0, 0, curZ);

        // Bowling right arm circular delivery arc
        const windmill = delivP * Math.PI * 2.0;
        applyDeltaRot(bowlerRig, 'RightArm', Math.PI * 0.75 - windmill, 0, -0.1);
        applyDeltaRot(bowlerRig, 'RightForeArm', 0.1, 0, 0);

        // Non-bowling left arm pulls down
        applyDeltaRot(bowlerRig, 'LeftArm', -Math.PI * 0.4 + delivP * Math.PI * 0.8, 0.1, 0.1);
        applyDeltaRot(bowlerRig, 'LeftForeArm', 0.2, 0, 0);

        applyDeltaRot(bowlerRig, 'Spine', 0.25 + delivP * 0.2, 0, 0);
      } else if (currentTime >= 30.0 && currentTime < 36.0) {
        // Shot 7: Bowler points accusingly/playfully at batsman ("Tune maari hai, tu hi lekar aa!")
        if (bowlerGroupRef.current) bowlerGroupRef.current.position.set(0, 0, 2.4);
        applyDeltaRot(bowlerRig, 'Spine', 0.05, 0, 0);
        // Right arm points forward
        applyDeltaRot(bowlerRig, 'RightArm', 0.15, -0.1, -0.1);
        applyDeltaRot(bowlerRig, 'RightForeArm', 0.05, 0, 0);
        // Left arm resting at side
        applyDeltaRot(bowlerRig, 'LeftArm', 1.30, 0.15, 0.1);
        applyDeltaRot(bowlerRig, 'LeftForeArm', 0.1, 0, 0.05);
      } else {
        // Follow-through looking up at ball flight
        if (bowlerGroupRef.current) bowlerGroupRef.current.position.set(0, 0, 2.4);
        applyDeltaRot(bowlerRig, 'Spine', 0.05, 0.2, 0);
        applyDeltaRot(bowlerRig, 'Neck', -0.3, 0.2, 0);
        applyDeltaRot(bowlerRig, 'Head', -0.2, 0.2, 0);
        applyDeltaRot(bowlerRig, 'LeftArm', 1.30, 0.15, 0.1);
        applyDeltaRot(bowlerRig, 'RightArm', 1.30, -0.15, -0.1);
        applyDeltaRot(bowlerRig, 'LeftForeArm', 0.1, 0, 0.05);
        applyDeltaRot(bowlerRig, 'RightForeArm', 0.1, 0, -0.05);
      }
    }

    // ── 3. WICKETKEEPER CHOREOGRAPHY (Ch02 - Bittu) ──
    if (currentTime < 9.5) {
      // Natural Mocap Crouch Stance from Crouching Idle.fbx.glb
      if (keeperCrouchActionRef.current) {
        keeperCrouchActionRef.current.setEffectiveWeight(1.0);
      }
      fielderMixer.update(dt);
    } else {
      if (keeperCrouchActionRef.current) {
        keeperCrouchActionRef.current.setEffectiveWeight(0);
      }
      resetRigPose(fielderRig);

      if (currentTime >= 24.0 && currentTime < 30.0) {
        // Shot 6: Hands on Head in Disbelief ("Bhai... Ball toh Sharma uncle ki chhat par gayi..!")
        const dreadShake = Math.sin(currentTime * 6.0) * 0.02;
        applyDeltaRot(fielderRig, 'Spine', 0.05 + dreadShake, 0, 0);
        applyDeltaRot(fielderRig, 'Neck', -0.2, dreadShake * 2, 0);
        applyDeltaRot(fielderRig, 'Head', -0.15, dreadShake * 2, 0);

        // Hands resting on head
        applyDeltaRot(fielderRig, 'LeftArm', -0.9, 0.25, -0.3);
        applyDeltaRot(fielderRig, 'LeftForeArm', 1.4, 0.1, 0.3);
        applyDeltaRot(fielderRig, 'RightArm', -0.9, -0.25, 0.3);
        applyDeltaRot(fielderRig, 'RightForeArm', 1.4, -0.1, -0.3);
      } else {
        // Standing up watching ball soar into gully rooftops
        applyDeltaRot(fielderRig, 'Spine', 0.02, 0.15, 0);
        applyDeltaRot(fielderRig, 'Neck', -0.35, 0.25, 0);
        applyDeltaRot(fielderRig, 'Head', -0.25, 0.25, 0);
        applyDeltaRot(fielderRig, 'LeftArm', 1.30, 0.15, 0.1);
        applyDeltaRot(fielderRig, 'RightArm', 1.30, -0.15, -0.1);
        applyDeltaRot(fielderRig, 'LeftForeArm', 0.1, 0, 0.05);
        applyDeltaRot(fielderRig, 'RightForeArm', 0.1, 0, -0.05);
      }
    }

    // ── 4. SOUND EFFECTS ──
    if (currentTime >= 9.5 && !hasHitAudioPlayedRef.current) {
      hasHitAudioPlayedRef.current = true;
      CinematicAudio.playBatHitImpact();
    }
    if (currentTime >= 19.5 && !hasBounceAudioPlayedRef.current) {
      hasBounceAudioPlayedRef.current = true;
      CinematicAudio.playBallRooftopBounce();
    }

    // ── 5. CRICKET BALL DYNAMICS ──
    if (ballRef.current) {
      if (currentTime < 8.8) {
        // In Bowler's Hand during run-up
        const bz = bowlerGroupRef.current ? bowlerGroupRef.current.position.z : 9.5;
        ballRef.current.position.set(0.18, 1.2, bz - 0.2);
      } else if (currentTime >= 8.8 && currentTime < 9.5) {
        // Delivery Pitch Travel: Released from bowler hand to batsman sweetspot
        const pitchProgress = (currentTime - 8.8) / 0.7;
        const bz = THREE.MathUtils.lerp(2.2, hitImpactPos.z, pitchProgress);
        const by = THREE.MathUtils.lerp(1.7, hitImpactPos.y, pitchProgress) - Math.sin(pitchProgress * Math.PI) * 0.45;
        ballRef.current.position.set(hitImpactPos.x, by, bz);
      } else if (currentTime >= 9.5 && currentTime < 19.5) {
        // Soaring Monster Sixer Parabolic Flight into H11 Rooftop
        const t = (currentTime - ballFlightStart) / ballFlightDuration;
        const invT = 1 - t;
        const bx = invT * invT * hitImpactPos.x + 2 * invT * t * peakPos.x + t * t * landingPos.x;
        const by = invT * invT * hitImpactPos.y + 2 * invT * t * peakPos.y + t * t * landingPos.y;
        const bz = invT * invT * hitImpactPos.z + 2 * invT * t * peakPos.z + t * t * landingPos.z;

        ballRef.current.position.set(bx, by, bz);
        ballRef.current.rotation.x += 0.3;
        ballRef.current.rotation.y += 0.2;
      } else {
        // Settled on H11 Balaji Plaza Terrace
        ballRef.current.position.copy(landingPos);
      }
    }
  });

  return (
    <group name="cricket-match-cinematic-scene">
      {/* ── 1. BATSMAN (Player Character - Ch38 scaled 0.01 to 1.78m) ── */}
      <group
        ref={batsmanGroupRef}
        position={[0.2, 0, -2.5]}
        rotation={[0, 1.45, 0]}
      >
        <primitive object={batsmanRig.scene} scale={[0.01, 0.01, 0.01]} />
      </group>

      {/* Handheld Willow Cricket Bat */}
      <group ref={batRef} position={[0.18, 0.52, -2.45]} rotation={[0.2, 0.85, -0.25]}>
        {/* Bat Blade */}
        <mesh castShadow position={[0, -0.32, 0]}>
          <boxGeometry args={[0.11, 0.72, 0.045]} />
          <meshStandardMaterial color="#d4b996" roughness={0.6} />
        </mesh>
        {/* Cane Handle with Grip */}
        <mesh position={[0, 0.12, 0]} castShadow>
          <cylinderGeometry args={[0.022, 0.022, 0.28, 12]} />
          <meshStandardMaterial color="#831843" roughness={0.8} />
        </mesh>
      </group>

      {/* ── 2. BOWLER (Remy - scaled 0.005 to 1.85m) ── */}
      <group
        ref={bowlerGroupRef}
        position={[0, 0, 9.5]}
        rotation={[0, Math.PI, 0]}
      >
        <primitive object={bowlerRig.scene} scale={[0.005, 0.005, 0.005]} />
      </group>

      {/* ── 3. WICKETKEEPER / FIELDER (Ch02 - scaled 0.01 to 1.76m) ── */}
      <group
        ref={fielderGroupRef}
        position={[0.1, 0, -4.5]}
        rotation={[0, 0, 0]}
      >
        <primitive object={fielderRig.scene} scale={[0.01, 0.01, 0.01]} />
      </group>

      {/* ── 4. ANIMATED RED LEATHER CRICKET BALL ── */}
      <group ref={ballRef} position={[0.18, 1.2, 9.3]}>
        <mesh castShadow receiveShadow>
          <sphereGeometry args={[0.045, 24, 24]} />
          <meshStandardMaterial color="#991b1b" roughness={0.35} metalness={0.15} />
        </mesh>
        {/* White Seam */}
        <mesh rotation={[0, 0, Math.PI / 2]}>
          <torusGeometry args={[0.0452, 0.0035, 8, 32]} />
          <meshStandardMaterial color="#f8fafc" roughness={0.6} />
        </mesh>
      </group>

      {/* ── 5. CRICKET WICKETS (Stumps & Bails) ── */}
      {/* Batting Crease Wickets */}
      <group position={[0, 0, -3.2]}>
        {[-0.1, 0, 0.1].map((offset, idx) => (
          <mesh key={idx} position={[offset, 0.42, 0]} castShadow>
            <cylinderGeometry args={[0.018, 0.018, 0.84, 12]} />
            <meshStandardMaterial color="#eab308" roughness={0.7} />
          </mesh>
        ))}
        {/* Bails */}
        <mesh position={[0, 0.85, 0]}>
          <boxGeometry args={[0.26, 0.02, 0.02]} />
          <meshStandardMaterial color="#ca8a04" roughness={0.7} />
        </mesh>
      </group>

      {/* Bowling Crease Wickets */}
      <group position={[0, 0, 8.8]}>
        {[-0.1, 0, 0.1].map((offset, idx) => (
          <mesh key={idx} position={[offset, 0.42, 0]} castShadow>
            <cylinderGeometry args={[0.018, 0.018, 0.84, 12]} />
            <meshStandardMaterial color="#eab308" roughness={0.7} />
          </mesh>
        ))}
        {/* Bails */}
        <mesh position={[0, 0.85, 0]}>
          <boxGeometry args={[0.26, 0.02, 0.02]} />
          <meshStandardMaterial color="#ca8a04" roughness={0.7} />
        </mesh>
      </group>
    </group>
  );
};

useGLTF.preload(BATSMAN_GLB);
useGLTF.preload(BOWLER_GLB);
useGLTF.preload(FIELDER_GLB);
useGLTF.preload(WALKING_GLB);
useGLTF.preload(CROUCH_IDLE_GLB);


