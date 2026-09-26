import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import { SkeletonUtils } from 'three-stdlib';
import { CinematicAudio } from './CinematicAudio';

const BATSMAN_GLB = '/Ch38_nonPBR.fbx.glb';
const BOWLER_GLB = '/Remy.fbx.glb';
const FIELDER_GLB = '/Ch02_nonPBR.fbx.glb';

interface CricketMatchActionProps {
  currentTime: number;
}

interface CharacterRig {
  scene: THREE.Group;
  bones: Map<string, THREE.Bone>;
  restQuats: Map<string, THREE.Quaternion>;
  restPositions: Map<string, THREE.Vector3>;
}

function extractRig(rawScene: THREE.Group): CharacterRig {
  const cloned = SkeletonUtils.clone(rawScene) as THREE.Group;
  const bones = new Map<string, THREE.Bone>();
  const restQuats = new Map<string, THREE.Quaternion>();
  const restPositions = new Map<string, THREE.Vector3>();

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
    }
  });

  return {
    scene: cloned,
    bones,
    restQuats,
    restPositions,
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

/**
 * 3D Choreographed Cricket Match Scene for the Cinematic Sequence
 * - Batsman (Ch38): Realistic sideways batting stance, bat tapping, backlift, dynamic downswing & sixer follow-through
 * - Bowler (Remy): Natural run-up stride cycle, delivery leap, overhead bowling arm windmill rotation & follow-through
 * - Wicketkeeper (Ch02): Wicketkeeping crouch stance behind stumps, standing up to track ball flight & shock hands-on-head pose
 * - Cricket Ball: Synchronized delivery pitch travel, bat impact, and soaring parabolic flight into H11 rooftop
 */
export const CricketMatchAction: React.FC<CricketMatchActionProps> = ({ currentTime }) => {
  const batsmanGLTF = useGLTF(BATSMAN_GLB);
  const bowlerGLTF = useGLTF(BOWLER_GLB);
  const fielderGLTF = useGLTF(FIELDER_GLB);

  const batsmanRig = useMemo(() => extractRig(batsmanGLTF.scene), [batsmanGLTF]);
  const bowlerRig = useMemo(() => extractRig(bowlerGLTF.scene), [bowlerGLTF]);
  const fielderRig = useMemo(() => extractRig(fielderGLTF.scene), [fielderGLTF]);

  const batsmanGroupRef = useRef<THREE.Group>(null);
  const bowlerGroupRef = useRef<THREE.Group>(null);
  const fielderGroupRef = useRef<THREE.Group>(null);
  const ballRef = useRef<THREE.Group>(null);
  const batRef = useRef<THREE.Group>(null);

  const hasHitAudioPlayedRef = useRef<boolean>(false);
  const hasBounceAudioPlayedRef = useRef<boolean>(false);

  // Ball Parabolic Trajectory
  // Bowler delivery: 8.5s -> 9.5s
  // Batsman impact: 9.5s
  // Lands on H11 rooftop: 19.5s
  const ballFlightStart = 9.5;
  const ballFlightDuration = 10.0;
  const hitImpactPos = useMemo(() => new THREE.Vector3(0.15, 0.95, -2.5), []);
  const peakPos = useMemo(() => new THREE.Vector3(11.2, 14.8, -1.5), []);
  const landingPos = useMemo(() => new THREE.Vector3(22.4, 6.695, -0.4), []);

  useFrame(() => {
    // ── 1. BATSMAN CHOREOGRAPHY (Ch38) ──
    resetRigPose(batsmanRig);

    if (currentTime < 8.0) {
      // PHASE A: Ready Sideways Stance + Bat Tapping
      const tap = Math.sin(currentTime * 5.0) * 0.08;
      const breathe = Math.sin(currentTime * 2.0) * 0.02;

      // Lower body: athletic flexed stance
      applyDeltaRot(batsmanRig, 'LeftUpLeg', 0.28, 0.1, -0.15);
      applyDeltaRot(batsmanRig, 'LeftLeg', -0.38, 0, 0);
      applyDeltaRot(batsmanRig, 'RightUpLeg', 0.25, -0.1, 0.15);
      applyDeltaRot(batsmanRig, 'RightLeg', -0.35, 0, 0);

      // Spine bent forward over crease
      applyDeltaRot(batsmanRig, 'Spine', 0.22 + breathe, -0.15, 0);
      applyDeltaRot(batsmanRig, 'Spine1', 0.15, -0.1, 0);
      // Head looking sideways down pitch at bowler
      applyDeltaRot(batsmanRig, 'Neck', -0.1, -1.15, 0);
      applyDeltaRot(batsmanRig, 'Head', -0.1, -0.35, 0);

      // Arms holding bat handle in front of thigh with tap
      applyDeltaRot(batsmanRig, 'LeftArm', 0.95 + tap, 0.35, 0.25);
      applyDeltaRot(batsmanRig, 'LeftForeArm', 0.55 + tap * 0.5, 0.1, 0.4);
      applyDeltaRot(batsmanRig, 'RightArm', 1.05 + tap, -0.15, -0.2);
      applyDeltaRot(batsmanRig, 'RightForeArm', 0.65 + tap * 0.5, 0, -0.35);

      if (batRef.current) {
        batRef.current.position.set(0.18, 0.55 + tap * 0.15, -2.42);
        batRef.current.rotation.set(0.25 + tap * 0.3, 0.8, -0.2);
      }
    } else if (currentTime >= 8.0 && currentTime < 9.2) {
      // PHASE B: Bowler Running In -> Batsman Backlift & Front Foot Trigger
      const prep = (currentTime - 8.0) / 1.2;
      const backlift = Math.sin(prep * Math.PI * 0.5);

      // Front foot steps forward
      applyDeltaRot(batsmanRig, 'LeftUpLeg', 0.35 + backlift * 0.15, 0.15, -0.1);
      applyDeltaRot(batsmanRig, 'LeftLeg', -0.45, 0, 0);
      applyDeltaRot(batsmanRig, 'RightUpLeg', 0.2, -0.1, 0.1);
      applyDeltaRot(batsmanRig, 'RightLeg', -0.3, 0, 0);

      // Spine coils back slightly
      applyDeltaRot(batsmanRig, 'Spine', 0.18, -0.25 - backlift * 0.2, 0);
      applyDeltaRot(batsmanRig, 'Neck', -0.1, -1.2, 0);
      applyDeltaRot(batsmanRig, 'Head', -0.1, -0.3, 0);

      // Raising bat up in high backlift
      applyDeltaRot(batsmanRig, 'LeftArm', 0.95 - backlift * 0.4, 0.45, 0.4);
      applyDeltaRot(batsmanRig, 'LeftForeArm', 0.55 + backlift * 0.5, 0.2, 0.6);
      applyDeltaRot(batsmanRig, 'RightArm', 1.05 - backlift * 0.5, -0.1, 0.3);
      applyDeltaRot(batsmanRig, 'RightForeArm', 0.65 + backlift * 0.4, 0.2, -0.1);

      if (batRef.current) {
        batRef.current.position.set(0.22, 0.7 + backlift * 0.35, -2.4);
        batRef.current.rotation.set(-0.4 * backlift, 1.1 + backlift * 0.4, -0.5 * backlift);
      }
    } else if (currentTime >= 9.2 && currentTime < 10.4) {
      // PHASE C: Powerful Downswing & Sixer Impact (Impact at t = 9.5s)
      const swingP = (currentTime - 9.2) / 1.2;
      const swingAngle = Math.sin(swingP * Math.PI);

      // Weight transfers powerfully to front leg, hips rotate into shot
      applyDeltaRot(batsmanRig, 'LeftUpLeg', 0.45, 0.2, -0.1);
      applyDeltaRot(batsmanRig, 'LeftLeg', -0.5, 0, 0);
      applyDeltaRot(batsmanRig, 'RightUpLeg', 0.1, -0.2, 0.2);
      applyDeltaRot(batsmanRig, 'RightLeg', -0.15, 0, 0);

      // Torso rotates vigorously toward off-side/mid-wicket
      applyDeltaRot(batsmanRig, 'Spine', 0.1, 0.6 * swingAngle - 0.2, -0.15);
      applyDeltaRot(batsmanRig, 'Neck', -0.2, -0.8 + 0.5 * swingAngle, 0);
      applyDeltaRot(batsmanRig, 'Head', -0.3 * swingAngle, -0.2, 0);

      // Arms swing bat through the ball in explosive follow-through arc
      applyDeltaRot(batsmanRig, 'LeftArm', 1.4 - swingP * 1.6, 0.3, -0.8 * swingP);
      applyDeltaRot(batsmanRig, 'LeftForeArm', 0.9 + swingP * 0.4, 0.2, 0.8);
      applyDeltaRot(batsmanRig, 'RightArm', 1.2 - swingP * 1.8, -0.4, 0.6 * swingP);
      applyDeltaRot(batsmanRig, 'RightForeArm', 1.1 + swingP * 0.3, -0.2, 0.2);

      if (batRef.current) {
        const batX = THREE.MathUtils.lerp(0.22, -0.15, swingP);
        const batY = 0.85 + Math.sin(swingP * Math.PI) * 0.5;
        const batZ = THREE.MathUtils.lerp(-2.4, -2.6, swingP);
        batRef.current.position.set(batX, batY, batZ);
        batRef.current.rotation.set(-0.8 + swingP * 2.2, 1.2 - swingP * 2.0, 0.4 + swingP * 1.2);
      }
    } else {
      // PHASE D: Follow-Through & Watching Ball Soar over Gully Terraces
      const skyProgress = Math.min(1.0, (currentTime - 10.4) / 2.0);

      applyDeltaRot(batsmanRig, 'LeftUpLeg', 0.2, 0.1, 0);
      applyDeltaRot(batsmanRig, 'RightUpLeg', 0.1, -0.1, 0);
      applyDeltaRot(batsmanRig, 'Spine', -0.15 * skyProgress, 0.35 * skyProgress, 0);
      // Head looking way up into the sky towards East rooftops
      applyDeltaRot(batsmanRig, 'Neck', -0.65 * skyProgress, 0.45 * skyProgress, 0);
      applyDeltaRot(batsmanRig, 'Head', -0.45 * skyProgress, 0.35 * skyProgress, 0);

      // Holding bat resting high over shoulder
      applyDeltaRot(batsmanRig, 'LeftArm', -0.2, 0.4, -0.6);
      applyDeltaRot(batsmanRig, 'LeftForeArm', 1.4, 0.3, 0.8);
      applyDeltaRot(batsmanRig, 'RightArm', -0.4, -0.3, 0.6);
      applyDeltaRot(batsmanRig, 'RightForeArm', 1.5, -0.3, 0.4);

      if (batRef.current) {
        batRef.current.position.set(-0.15, 1.45, -2.6);
        batRef.current.rotation.set(1.4, -0.8, 1.6);
      }
    }

    // ── 2. BOWLER CHOREOGRAPHY (Remy - Bunty) ──
    resetRigPose(bowlerRig);

    if (currentTime < 5.0) {
      // Waiting at top of bowling mark (Z = 9.5)
      if (bowlerGroupRef.current) {
        bowlerGroupRef.current.position.set(0, 0, 9.5);
      }
      const idleBounce = Math.sin(currentTime * 3.5) * 0.05;
      applyDeltaRot(bowlerRig, 'LeftUpLeg', 0.15, 0, 0);
      applyDeltaRot(bowlerRig, 'RightUpLeg', 0.15, 0, 0);
      applyDeltaRot(bowlerRig, 'LeftLeg', -0.2, 0, 0);
      applyDeltaRot(bowlerRig, 'RightLeg', -0.2, 0, 0);
      applyDeltaRot(bowlerRig, 'Spine', 0.1 + idleBounce, 0, 0);
      // Holding ball in right hand near chest
      applyDeltaRot(bowlerRig, 'RightArm', 0.9, -0.3, -0.4);
      applyDeltaRot(bowlerRig, 'RightForeArm', 1.2, 0, 0.6);
      applyDeltaRot(bowlerRig, 'LeftArm', 0.8, 0.2, 0.3);
      applyDeltaRot(bowlerRig, 'LeftForeArm', 0.9, 0, -0.5);
    } else if (currentTime >= 5.0 && currentTime < 8.5) {
      // Dynamic Bowler Run-Up (Z = 9.5 -> 3.2)
      const runProgress = (currentTime - 5.0) / 3.5;
      const curZ = THREE.MathUtils.lerp(9.5, 3.2, runProgress);
      if (bowlerGroupRef.current) {
        bowlerGroupRef.current.position.set(0, 0, curZ);
      }

      const strideFreq = 16.0;
      const legPhase = Math.sin((currentTime - 5.0) * strideFreq);
      const armPhase = -legPhase;

      // Leg running oscillation
      applyDeltaRot(bowlerRig, 'LeftUpLeg', legPhase * 0.75 + 0.2, 0, 0);
      applyDeltaRot(bowlerRig, 'LeftLeg', Math.max(0, -legPhase * 1.1), 0, 0);
      applyDeltaRot(bowlerRig, 'RightUpLeg', -legPhase * 0.75 + 0.2, 0, 0);
      applyDeltaRot(bowlerRig, 'RightLeg', Math.max(0, legPhase * 1.1), 0, 0);

      // Arm running pumps
      applyDeltaRot(bowlerRig, 'LeftArm', armPhase * 0.8 + 0.4, 0.1, 0.15);
      applyDeltaRot(bowlerRig, 'LeftForeArm', 0.8, 0, 0);
      applyDeltaRot(bowlerRig, 'RightArm', -armPhase * 0.8 + 0.4, -0.1, -0.15);
      applyDeltaRot(bowlerRig, 'RightForeArm', 0.8, 0, 0);

      // Spine forward lean
      applyDeltaRot(bowlerRig, 'Spine', 0.28, armPhase * 0.15, 0);
      applyDeltaRot(bowlerRig, 'Head', -0.15, 0, 0);
    } else if (currentTime >= 8.5 && currentTime < 9.5) {
      // Final Bowling Leap & Overhead Windmill Delivery (Ball releases at t = 8.8s)
      const delivP = (currentTime - 8.5) / 1.0;
      const curZ = THREE.MathUtils.lerp(3.2, 2.4, delivP);
      if (bowlerGroupRef.current) {
        bowlerGroupRef.current.position.set(0, 0, curZ);
      }

      // Windmill arm 360 degree overarm arc
      const windmillAngle = delivP * Math.PI * 2.2;
      applyDeltaRot(bowlerRig, 'RightArm', Math.PI * 0.8 - windmillAngle, -0.2, -0.2);
      applyDeltaRot(bowlerRig, 'RightForeArm', 0.2, 0, 0);

      // Non-bowling left arm points high then pulls down
      applyDeltaRot(bowlerRig, 'LeftArm', -Math.PI * 0.6 + delivP * Math.PI * 1.2, 0.3, 0.4);
      applyDeltaRot(bowlerRig, 'LeftForeArm', 0.4, 0, 0);

      // Jump & landing stride
      applyDeltaRot(bowlerRig, 'LeftUpLeg', 0.6 - delivP * 0.3, 0, 0);
      applyDeltaRot(bowlerRig, 'LeftLeg', -0.7 + delivP * 0.4, 0, 0);
      applyDeltaRot(bowlerRig, 'RightUpLeg', -0.5 + delivP * 0.8, 0, 0);
      applyDeltaRot(bowlerRig, 'RightLeg', -0.2, 0, 0);

      // Torso flexion
      applyDeltaRot(bowlerRig, 'Spine', 0.35 + delivP * 0.35, 0, 0);
    } else if (currentTime >= 30.0 && currentTime < 36.0) {
      // Shot 7: Bowler points accusingly/playfully at batsman ("Tune maari hai, tu hi lekar aa!")
      if (bowlerGroupRef.current) {
        bowlerGroupRef.current.position.set(0, 0, 2.4);
      }
      // Turned facing batsman
      applyDeltaRot(bowlerRig, 'Spine', 0.1, 0, 0);
      applyDeltaRot(bowlerRig, 'RightArm', 1.45, -0.25, 0);
      applyDeltaRot(bowlerRig, 'RightForeArm', 0.1, 0, 0); // Straight pointing arm
      applyDeltaRot(bowlerRig, 'LeftArm', 0.6, 0.2, 0.4);
      applyDeltaRot(bowlerRig, 'LeftForeArm', 0.8, 0, 0);
    } else {
      // Resting follow-through looking up at ball flight
      if (bowlerGroupRef.current) {
        bowlerGroupRef.current.position.set(0, 0, 2.4);
      }
      applyDeltaRot(bowlerRig, 'Spine', 0.05, 0.4, 0);
      applyDeltaRot(bowlerRig, 'Head', -0.6, 0.4, 0);
      applyDeltaRot(bowlerRig, 'RightArm', 0.8, -0.3, -0.2);
      applyDeltaRot(bowlerRig, 'RightForeArm', 0.3, 0, 0);
      applyDeltaRot(bowlerRig, 'LeftArm', 0.8, 0.3, 0.2);
      applyDeltaRot(bowlerRig, 'LeftForeArm', 0.3, 0, 0);
    }

    // ── 3. WICKETKEEPER CHOREOGRAPHY (Ch02 - Bittu) ──
    resetRigPose(fielderRig);

    if (currentTime < 9.5) {
      // Low Wicketkeeping Crouch Stance behind stumps (Z = -4.5)
      // Deep knee squat
      applyDeltaRot(fielderRig, 'LeftUpLeg', 0.95, 0.15, -0.2);
      applyDeltaRot(fielderRig, 'LeftLeg', -1.25, 0, 0);
      applyDeltaRot(fielderRig, 'RightUpLeg', 0.95, -0.15, 0.2);
      applyDeltaRot(fielderRig, 'RightLeg', -1.25, 0, 0);

      // Spine bent forward
      applyDeltaRot(fielderRig, 'Spine', 0.45, 0, 0);
      applyDeltaRot(fielderRig, 'Neck', -0.35, 0, 0);
      applyDeltaRot(fielderRig, 'Head', -0.25, 0, 0);

      // Hands cupped together in front of knees ready for edge
      applyDeltaRot(fielderRig, 'LeftArm', 0.8, 0.35, 0.4);
      applyDeltaRot(fielderRig, 'LeftForeArm', 0.9, 0.2, -0.3);
      applyDeltaRot(fielderRig, 'RightArm', 0.8, -0.35, -0.4);
      applyDeltaRot(fielderRig, 'RightForeArm', 0.9, -0.2, 0.3);
    } else if (currentTime >= 24.0 && currentTime < 30.0) {
      // Shot 6: Hands on Head in Disbelief ("Bhai... Ball toh Sharma uncle ki chhat par gayi..!")
      const dreadShake = Math.sin(currentTime * 8.0) * 0.04;
      applyDeltaRot(fielderRig, 'LeftUpLeg', 0.1, 0, 0);
      applyDeltaRot(fielderRig, 'RightUpLeg', 0.1, 0, 0);
      applyDeltaRot(fielderRig, 'Spine', -0.1 + dreadShake, 0, 0);
      applyDeltaRot(fielderRig, 'Head', -0.3, dreadShake * 2, 0);

      // Both hands holding head/helmet in despair
      applyDeltaRot(fielderRig, 'LeftArm', -0.7, 0.6, -1.2);
      applyDeltaRot(fielderRig, 'LeftForeArm', 1.9, 0, 0.6);
      applyDeltaRot(fielderRig, 'RightArm', -0.7, -0.6, 1.2);
      applyDeltaRot(fielderRig, 'RightForeArm', 1.9, 0, -0.6);
    } else {
      // Standing up watching ball soar into the gully rooftops
      applyDeltaRot(fielderRig, 'LeftUpLeg', 0.1, 0, 0);
      applyDeltaRot(fielderRig, 'RightUpLeg', 0.1, 0, 0);
      applyDeltaRot(fielderRig, 'Spine', -0.15, 0.2, 0);
      applyDeltaRot(fielderRig, 'Neck', -0.65, 0.3, 0);
      applyDeltaRot(fielderRig, 'Head', -0.45, 0.3, 0);
      applyDeltaRot(fielderRig, 'LeftArm', 0.9, 0.2, 0.2);
      applyDeltaRot(fielderRig, 'RightArm', 0.9, -0.2, -0.2);
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
        ballRef.current.position.set(0.2, 1.25, bz - 0.2);
      } else if (currentTime >= 8.8 && currentTime < 9.5) {
        // Delivery Pitch Travel: Released from bowler hand to batsman sweetspot
        const pitchProgress = (currentTime - 8.8) / 0.7;
        const bz = THREE.MathUtils.lerp(2.2, hitImpactPos.z, pitchProgress);
        // Bounce on good-length pitch spot (Z ~ 0)
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
      <group ref={batRef} position={[0.18, 0.55, -2.42]} rotation={[0.25, 0.8, -0.2]}>
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
      <group ref={ballRef} position={[0.2, 1.25, 9.3]}>
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

