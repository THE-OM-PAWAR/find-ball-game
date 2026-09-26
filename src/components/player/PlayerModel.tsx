import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import type { PlayerAppearanceConfig, PlayerState } from './PlayerTypes';

interface PlayerModelProps {
  appearance?: Partial<PlayerAppearanceConfig>;
  state: PlayerState;
  horizontalSpeed: number;
  facingAngle: number;
  isGrounded: boolean;
}

export const PlayerModel: React.FC<PlayerModelProps> = ({
  appearance: customAppearance,
  state,
  horizontalSpeed,
  facingAngle,
  isGrounded,
}) => {
  const config = {
    skinTone: '#c68642',
    hairColor: '#171717',
    jerseyColor: '#1d4ed8', // India Royal Blue
    jerseyAccentColor: '#f59e0b', // Saffron Amber
    jerseyNumber: '18',
    shortsColor: '#1e293b', // Deep Navy Charcoal
    shoesColor: '#f8fafc', // Crisp White
    hasCap: true,
    hasGloves: true,
    hasWristBand: true,
    hasBat: true,
    batWoodTone: 'kashmir-willow',
    ...customAppearance,
  };

  // Node references for procedural skeletal articulation
  const rootRef = useRef<THREE.Group>(null);
  const hipsRef = useRef<THREE.Group>(null);
  const spineRef = useRef<THREE.Group>(null);
  const headRef = useRef<THREE.Group>(null);
  const leftArmRef = useRef<THREE.Group>(null);
  const rightArmRef = useRef<THREE.Group>(null);
  const leftForearmRef = useRef<THREE.Group>(null);
  const rightForearmRef = useRef<THREE.Group>(null);
  const leftLegRef = useRef<THREE.Group>(null);
  const rightLegRef = useRef<THREE.Group>(null);
  const leftShinRef = useRef<THREE.Group>(null);
  const rightShinRef = useRef<THREE.Group>(null);
  const batRef = useRef<THREE.Group>(null);

  // Time accumulator for animations
  const animTimeRef = useRef<number>(0);
  const shotProgressRef = useRef<number>(0);

  // PBR Materials
  const materials = useMemo(() => {
    return {
      skin: new THREE.MeshStandardMaterial({
        color: config.skinTone,
        roughness: 0.65,
        metalness: 0.05,
      }),
      hair: new THREE.MeshStandardMaterial({
        color: config.hairColor,
        roughness: 0.9,
      }),
      jersey: new THREE.MeshStandardMaterial({
        color: config.jerseyColor,
        roughness: 0.7,
      }),
      jerseyAccent: new THREE.MeshStandardMaterial({
        color: config.jerseyAccentColor,
        roughness: 0.5,
      }),
      shorts: new THREE.MeshStandardMaterial({
        color: config.shortsColor,
        roughness: 0.8,
      }),
      shoes: new THREE.MeshStandardMaterial({
        color: config.shoesColor,
        roughness: 0.4,
      }),
      shoesSole: new THREE.MeshStandardMaterial({
        color: '#f97316', // Orange rubber studs
        roughness: 0.85,
      }),
      gloves: new THREE.MeshStandardMaterial({
        color: '#ffffff',
        roughness: 0.4,
      }),
      glovePalm: new THREE.MeshStandardMaterial({
        color: '#0284c7',
        roughness: 0.6,
      }),
      batWillow: new THREE.MeshStandardMaterial({
        color: config.batWoodTone === 'kashmir-willow' ? '#e2b382' : '#f5e2c8',
        roughness: 0.55,
      }),
      batGrip: new THREE.MeshStandardMaterial({
        color: '#dc2626', // Red rubber spiral grip
        roughness: 0.9,
      }),
      batSticker: new THREE.MeshStandardMaterial({
        color: '#ef4444',
        metalness: 0.3,
        roughness: 0.3,
      }),
      cap: new THREE.MeshStandardMaterial({
        color: config.jerseyColor,
        roughness: 0.8,
      }),
      wristBand: new THREE.MeshStandardMaterial({
        color: '#f59e0b',
        roughness: 0.8,
      }),
      eyes: new THREE.MeshStandardMaterial({
        color: '#111827',
        roughness: 0.1,
      }),
    };
  }, [config]);

  // Procedural Animation Blending in useFrame
  useFrame((_, delta) => {
    const dt = Math.min(delta, 0.05);

    if (rootRef.current) {
      rootRef.current.rotation.y = facingAngle;
    }

    // Accumulate animation phase based on actual movement speed or state
    let cycleSpeed = horizontalSpeed > 0.1 ? Math.max(4, horizontalSpeed * 2.4) : 2;
    if (!isGrounded) cycleSpeed = 3;
    if (state === 'SPRINT') cycleSpeed = 16;
    else if (state === 'RUN') cycleSpeed = 12;
    else if (state === 'WALK') cycleSpeed = 7;
    else if (state === 'CROUCH_WALK') cycleSpeed = 5;

    animTimeRef.current += dt * cycleSpeed;
    const t = animTimeRef.current;

    // References to body parts
    const hips = hipsRef.current;
    const spine = spineRef.current;
    const head = headRef.current;
    const lArm = leftArmRef.current;
    const rArm = rightArmRef.current;
    const lFore = leftForearmRef.current;
    const rFore = rightForearmRef.current;
    const lLeg = leftLegRef.current;
    const rLeg = rightLegRef.current;
    const lShin = leftShinRef.current;
    const rShin = rightShinRef.current;
    const bat = batRef.current;

    if (!hips || !spine || !head || !lArm || !rArm || !lLeg || !rLeg) return;

    // Shot animation trigger
    if (state === 'BATTING_SHOT') {
      shotProgressRef.current = Math.min(1, shotProgressRef.current + dt * 4.5);
    } else {
      shotProgressRef.current = Math.max(0, shotProgressRef.current - dt * 6.0);
    }
    const shot = shotProgressRef.current;

    // 1. Base Poses by State
    switch (state) {
      case 'IDLE':
      case 'BATTING_STANCE': {
        // Natural breathing and subtle weight shift
        const breath = Math.sin(t * 1.5) * 0.02;
        hips.position.y = 0.96 + breath;
        hips.rotation.x = 0;
        spine.rotation.x = 0.04 + breath * 0.5;
        spine.rotation.y = Math.sin(t * 0.8) * 0.03;
        head.rotation.x = -0.04;

        // Holding cricket bat ready in two hands
        if (config.hasBat) {
          lArm.rotation.set(0.45, 0.2, -0.35);
          rArm.rotation.set(0.65, -0.25, 0.3);
          lFore!.rotation.set(0.6, 0.2, 0);
          rFore!.rotation.set(0.8, -0.2, 0);
        } else {
          lArm.rotation.set(0.1, 0, -0.1);
          rArm.rotation.set(0.1, 0, 0.1);
          lFore!.rotation.set(0.15, 0, 0);
          rFore!.rotation.set(0.15, 0, 0);
        }

        lLeg.rotation.set(-0.04, 0, -0.05);
        rLeg.rotation.set(0.04, 0, 0.05);
        lShin!.rotation.set(0.08, 0, 0);
        rShin!.rotation.set(0.08, 0, 0);
        break;
      }

      case 'WALK': {
        const stride = Math.sin(t);
        const cosStride = Math.cos(t);
        hips.position.y = 0.95 + Math.abs(cosStride) * 0.03;
        hips.rotation.x = 0.05;
        spine.rotation.x = 0.06;
        spine.rotation.y = -stride * 0.08;

        // Leg stride
        lLeg.rotation.x = stride * 0.45;
        rLeg.rotation.x = -stride * 0.45;
        lShin!.rotation.x = Math.max(0, -stride * 0.6);
        rShin!.rotation.x = Math.max(0, stride * 0.6);

        // Arm swing
        if (config.hasBat) {
          lArm.rotation.set(0.35 - stride * 0.3, 0.15, -0.2);
          rArm.rotation.set(0.45 + stride * 0.25, -0.15, 0.2);
        } else {
          lArm.rotation.set(-stride * 0.5, 0, -0.1);
          rArm.rotation.set(stride * 0.5, 0, 0.1);
        }
        break;
      }

      case 'RUN': {
        const stride = Math.sin(t);
        const cosStride = Math.cos(t);
        hips.position.y = 0.94 + Math.abs(cosStride) * 0.06;
        hips.rotation.x = 0.16; // Lean forward
        spine.rotation.x = 0.14;
        spine.rotation.y = -stride * 0.14;

        // Dynamic leg drive
        lLeg.rotation.x = stride * 0.85;
        rLeg.rotation.x = -stride * 0.85;
        lShin!.rotation.x = Math.max(0, -stride * 1.1);
        rShin!.rotation.x = Math.max(0, stride * 1.1);

        // Vigorous arm pumping
        lArm.rotation.set(-stride * 0.9, 0.1, -0.25);
        rArm.rotation.set(stride * 0.9, -0.1, 0.25);
        lFore!.rotation.set(0.65, 0, 0);
        rFore!.rotation.set(0.65, 0, 0);
        break;
      }

      case 'SPRINT': {
        const stride = Math.sin(t);
        const cosStride = Math.cos(t);
        hips.position.y = 0.92 + Math.abs(cosStride) * 0.08;
        hips.rotation.x = 0.32; // Strong forward sprint tilt
        spine.rotation.x = 0.24;
        spine.rotation.y = -stride * 0.2;
        head.rotation.x = -0.22; // Eyes locked on horizon

        lLeg.rotation.x = stride * 1.15;
        rLeg.rotation.x = -stride * 1.15;
        lShin!.rotation.x = Math.max(0, -stride * 1.4);
        rShin!.rotation.x = Math.max(0, stride * 1.4);

        lArm.rotation.set(-stride * 1.25, 0.15, -0.3);
        rArm.rotation.set(stride * 1.25, -0.15, 0.3);
        lFore!.rotation.set(0.85, 0, 0);
        rFore!.rotation.set(0.85, 0, 0);
        break;
      }

      case 'CROUCH':
      case 'CROUCH_WALK': {
        const isMoving = state === 'CROUCH_WALK';
        const stride = isMoving ? Math.sin(t) : 0;

        hips.position.y = 0.62 + (isMoving ? Math.abs(Math.cos(t)) * 0.02 : 0);
        hips.rotation.x = 0.28;
        spine.rotation.x = 0.25;

        lLeg.rotation.set(0.8 + stride * 0.3, 0, -0.2);
        rLeg.rotation.set(0.8 - stride * 0.3, 0, 0.2);
        lShin!.rotation.set(1.1 - Math.max(0, stride * 0.4), 0, 0);
        rShin!.rotation.set(1.1 - Math.max(0, -stride * 0.4), 0, 0);

        lArm.rotation.set(0.4, 0, -0.2);
        rArm.rotation.set(0.4, 0, 0.2);
        lFore!.rotation.set(0.5, 0, 0);
        rFore!.rotation.set(0.5, 0, 0);
        break;
      }

      case 'JUMP': {
        // Airborne jump tuck
        hips.position.y = 0.98;
        hips.rotation.x = 0.12;
        spine.rotation.x = 0.08;

        lLeg.rotation.set(0.45, 0, -0.15);
        rLeg.rotation.set(0.2, 0, 0.15);
        lShin!.rotation.set(0.7, 0, 0);
        rShin!.rotation.set(0.9, 0, 0);

        lArm.rotation.set(-0.6, 0, -0.5);
        rArm.rotation.set(-0.7, 0, 0.5);
        break;
      }

      case 'FALL': {
        hips.position.y = 0.96;
        hips.rotation.x = -0.1;
        spine.rotation.x = -0.08;

        lLeg.rotation.set(0.15, 0, -0.2);
        rLeg.rotation.set(0.15, 0, 0.2);
        lShin!.rotation.set(0.3, 0, 0);
        rShin!.rotation.set(0.3, 0, 0);

        lArm.rotation.set(-0.8, 0, -0.6);
        rArm.rotation.set(-0.8, 0, 0.6);
        break;
      }
    }

    // 2. Cricket Bat Swing Follow-through Blend
    if (shot > 0.01) {
      spine.rotation.y = THREE.MathUtils.lerp(spine.rotation.y, -1.1 * shot, shot);
      rArm.rotation.set(
        THREE.MathUtils.lerp(rArm.rotation.x, -0.8 * shot, shot),
        THREE.MathUtils.lerp(rArm.rotation.y, 0.9 * shot, shot),
        THREE.MathUtils.lerp(rArm.rotation.z, 0.4 * shot, shot)
      );
      lArm.rotation.set(
        THREE.MathUtils.lerp(lArm.rotation.x, -0.4 * shot, shot),
        THREE.MathUtils.lerp(lArm.rotation.y, 0.7 * shot, shot),
        THREE.MathUtils.lerp(lArm.rotation.z, -0.3 * shot, shot)
      );
      if (bat) {
        bat.rotation.z = THREE.MathUtils.lerp(bat.rotation.z, -1.4 * shot, shot);
      }
    }
  });

  return (
    <group ref={rootRef} position={[0, 0, 0]}>
      {/* SKELETAL ROOT / HIPS JOINT */}
      <group ref={hipsRef} position={[0, 0.96, 0]}>
        {/* Pelvis / Shorts */}
        <mesh castShadow receiveShadow material={materials.shorts}>
          <boxGeometry args={[0.32, 0.22, 0.22]} />
        </mesh>

        {/* Athletic Waist Cord */}
        <mesh position={[0, 0.08, 0.115]} material={materials.jerseyAccent}>
          <cylinderGeometry args={[0.008, 0.008, 0.09, 6]} />
        </mesh>

        {/* SPINE / CHEST */}
        <group ref={spineRef} position={[0, 0.14, 0]}>
          {/* Main Torso / Graphic Cricket Jersey */}
          <mesh position={[0, 0.18, 0]} castShadow receiveShadow material={materials.jersey}>
            <boxGeometry args={[0.34, 0.36, 0.22]} />
          </mesh>

          {/* Jersey Side Accent Stripe (Left & Right) */}
          <mesh position={[-0.172, 0.18, 0]} material={materials.jerseyAccent}>
            <boxGeometry args={[0.008, 0.34, 0.14]} />
          </mesh>
          <mesh position={[0.172, 0.18, 0]} material={materials.jerseyAccent}>
            <boxGeometry args={[0.008, 0.34, 0.14]} />
          </mesh>

          {/* Jersey Number Plaque on Back (#18 or #7) */}
          <mesh position={[0, 0.22, -0.112]} rotation={[0, Math.PI, 0]} material={materials.jerseyAccent}>
            <planeGeometry args={[0.14, 0.14]} />
          </mesh>

          {/* NECK & HEAD */}
          <group position={[0, 0.38, 0]}>
            {/* Neck */}
            <mesh position={[0, 0.04, 0]} castShadow material={materials.skin}>
              <cylinderGeometry args={[0.06, 0.07, 0.1, 12]} />
            </mesh>

            {/* Head Joint */}
            <group ref={headRef} position={[0, 0.14, 0]}>
              {/* Stylized Face Mesh */}
              <mesh castShadow receiveShadow material={materials.skin}>
                <sphereGeometry args={[0.125, 16, 16]} />
              </mesh>
              {/* Jaw / Chin structure */}
              <mesh position={[0, -0.04, 0.04]} castShadow material={materials.skin}>
                <boxGeometry args={[0.11, 0.09, 0.11]} />
              </mesh>

              {/* Expressive Dark Eyes */}
              <mesh position={[-0.045, 0.015, 0.11]} material={materials.eyes}>
                <sphereGeometry args={[0.016, 8, 8]} />
              </mesh>
              <mesh position={[0.045, 0.015, 0.11]} material={materials.eyes}>
                <sphereGeometry args={[0.016, 8, 8]} />
              </mesh>

              {/* Eyebrows */}
              <mesh position={[-0.045, 0.04, 0.115]} rotation={[0, 0, 0.08]} material={materials.hair}>
                <boxGeometry args={[0.035, 0.008, 0.01]} />
              </mesh>
              <mesh position={[0.045, 0.04, 0.115]} rotation={[0, 0, -0.08]} material={materials.hair}>
                <boxGeometry args={[0.035, 0.008, 0.01]} />
              </mesh>

              {/* Nose */}
              <mesh position={[0, 0, 0.13]} material={materials.skin}>
                <coneGeometry args={[0.018, 0.04, 5]} />
              </mesh>

              {/* Modern Indian Undercut Fade Hair */}
              <mesh position={[0, 0.04, -0.01]} castShadow material={materials.hair}>
                <sphereGeometry args={[0.132, 16, 16, 0, Math.PI * 2, 0, Math.PI * 0.58]} />
              </mesh>
              {/* Hair Quiff / Volume Front */}
              <mesh position={[0, 0.12, 0.05]} rotation={[0.2, 0, 0]} castShadow material={materials.hair}>
                <boxGeometry args={[0.13, 0.06, 0.12]} />
              </mesh>

              {/* Optional Cricket Cap */}
              {config.hasCap && (
                <group position={[0, 0.07, 0.02]}>
                  <mesh castShadow material={materials.cap}>
                    <sphereGeometry args={[0.135, 16, 12, 0, Math.PI * 2, 0, Math.PI * 0.48]} />
                  </mesh>
                  {/* Cap Visor / Peak */}
                  <mesh position={[0, -0.02, 0.12]} rotation={[0.18, 0, 0]} castShadow material={materials.cap}>
                    <boxGeometry args={[0.15, 0.012, 0.11]} />
                  </mesh>
                </group>
              )}
            </group>
          </group>

          {/* LEFT SHOULDER & ARM */}
          <group ref={leftArmRef} position={[-0.22, 0.32, 0]}>
            {/* Shoulder sleeve */}
            <mesh material={materials.jersey}>
              <sphereGeometry args={[0.065, 10, 10]} />
            </mesh>
            {/* Upper Arm */}
            <mesh position={[0, -0.12, 0]} castShadow material={materials.skin}>
              <cylinderGeometry args={[0.045, 0.04, 0.22, 10]} />
            </mesh>
            {/* Left Forearm Joint */}
            <group ref={leftForearmRef} position={[0, -0.22, 0]}>
              <mesh position={[0, -0.11, 0]} castShadow material={materials.skin}>
                <cylinderGeometry args={[0.038, 0.034, 0.22, 10]} />
              </mesh>
              {/* Saffron Wrist Band */}
              {config.hasWristBand && (
                <mesh position={[0, -0.18, 0]} material={materials.wristBand}>
                  <cylinderGeometry args={[0.042, 0.042, 0.04, 10]} />
                </mesh>
              )}
              {/* Left Batting Glove */}
              <group position={[0, -0.24, 0]}>
                <mesh castShadow material={config.hasGloves ? materials.gloves : materials.skin}>
                  <boxGeometry args={[0.06, 0.07, 0.04]} />
                </mesh>
                {/* Glove Rubber Palm Grips */}
                {config.hasGloves && (
                  <mesh position={[0, 0, 0.021]} material={materials.glovePalm}>
                    <boxGeometry args={[0.05, 0.05, 0.005]} />
                  </mesh>
                )}
              </group>
            </group>
          </group>

          {/* RIGHT SHOULDER, ARM & CRICKET BAT */}
          <group ref={rightArmRef} position={[0.22, 0.32, 0]}>
            {/* Shoulder sleeve */}
            <mesh material={materials.jersey}>
              <sphereGeometry args={[0.065, 10, 10]} />
            </mesh>
            {/* Upper Arm */}
            <mesh position={[0, -0.12, 0]} castShadow material={materials.skin}>
              <cylinderGeometry args={[0.045, 0.04, 0.22, 10]} />
            </mesh>
            {/* Right Forearm Joint */}
            <group ref={rightForearmRef} position={[0, -0.22, 0]}>
              <mesh position={[0, -0.11, 0]} castShadow material={materials.skin}>
                <cylinderGeometry args={[0.038, 0.034, 0.22, 10]} />
              </mesh>
              {/* Right Batting Glove */}
              <group position={[0, -0.24, 0]}>
                <mesh castShadow material={config.hasGloves ? materials.gloves : materials.skin}>
                  <boxGeometry args={[0.06, 0.07, 0.04]} />
                </mesh>

                {/* GULLY CRICKET BAT ATTACHED TO RIGHT HAND */}
                {config.hasBat && (
                  <group ref={batRef} position={[0, -0.05, 0.08]} rotation={[0.4, 0.2, 0]}>
                    {/* Bat Rubber Grip Cane Handle */}
                    <mesh position={[0, 0.12, 0]} castShadow material={materials.batGrip}>
                      <cylinderGeometry args={[0.016, 0.016, 0.28, 10]} />
                    </mesh>
                    {/* Handle Top Knob */}
                    <mesh position={[0, 0.26, 0]} material={materials.batGrip}>
                      <sphereGeometry args={[0.02, 8, 8]} />
                    </mesh>
                    {/* Kashmir Willow Bat Blade */}
                    <mesh position={[0, -0.26, 0]} castShadow material={materials.batWillow}>
                      <boxGeometry args={[0.11, 0.52, 0.038]} />
                    </mesh>
                    {/* Bat Curved Spine / Sweet Spot */}
                    <mesh position={[0, -0.26, -0.02]} material={materials.batWillow}>
                      <boxGeometry args={[0.065, 0.46, 0.02]} />
                    </mesh>
                    {/* Red Front Power Sticker */}
                    <mesh position={[0, -0.18, 0.02]} material={materials.batSticker}>
                      <planeGeometry args={[0.08, 0.18]} />
                    </mesh>
                    {/* Curved Bat Toe */}
                    <mesh position={[0, -0.52, 0]} material={materials.batWillow}>
                      <cylinderGeometry args={[0.055, 0.055, 0.038, 8]} />
                    </mesh>
                  </group>
                )}
              </group>
            </group>
          </group>
        </group>

        {/* LEFT LEG */}
        <group ref={leftLegRef} position={[-0.1, -0.12, 0]}>
          {/* Thigh / Shorts Lower */}
          <mesh position={[0, -0.16, 0]} castShadow material={materials.shorts}>
            <cylinderGeometry args={[0.075, 0.065, 0.32, 12]} />
          </mesh>
          {/* Left Shin / Knee */}
          <group ref={leftShinRef} position={[0, -0.32, 0]}>
            {/* Calf */}
            <mesh position={[0, -0.18, 0]} castShadow material={materials.skin}>
              <cylinderGeometry args={[0.058, 0.048, 0.34, 12]} />
            </mesh>
            {/* White Ankle Socks */}
            <mesh position={[0, -0.31, 0]} material={materials.shoes}>
              <cylinderGeometry args={[0.05, 0.048, 0.08, 10]} />
            </mesh>
            {/* Left Cricket Shoe */}
            <group position={[0, -0.36, 0.05]}>
              <mesh castShadow material={materials.shoes}>
                <boxGeometry args={[0.09, 0.07, 0.22]} />
              </mesh>
              {/* Shoe Spikes / Stud Sole */}
              <mesh position={[0, -0.038, 0]} material={materials.shoesSole}>
                <boxGeometry args={[0.092, 0.016, 0.224]} />
              </mesh>
            </group>
          </group>
        </group>

        {/* RIGHT LEG */}
        <group ref={rightLegRef} position={[0.1, -0.12, 0]}>
          {/* Thigh / Shorts Lower */}
          <mesh position={[0, -0.16, 0]} castShadow material={materials.shorts}>
            <cylinderGeometry args={[0.075, 0.065, 0.32, 12]} />
          </mesh>
          {/* Right Shin / Knee */}
          <group ref={rightShinRef} position={[0, -0.32, 0]}>
            {/* Calf */}
            <mesh position={[0, -0.18, 0]} castShadow material={materials.skin}>
              <cylinderGeometry args={[0.058, 0.048, 0.34, 12]} />
            </mesh>
            {/* White Ankle Socks */}
            <mesh position={[0, -0.31, 0]} material={materials.shoes}>
              <cylinderGeometry args={[0.05, 0.048, 0.08, 10]} />
            </mesh>
            {/* Right Cricket Shoe */}
            <group position={[0, -0.36, 0.05]}>
              <mesh castShadow material={materials.shoes}>
                <boxGeometry args={[0.09, 0.07, 0.22]} />
              </mesh>
              {/* Shoe Spikes / Stud Sole */}
              <mesh position={[0, -0.038, 0]} material={materials.shoesSole}>
                <boxGeometry args={[0.092, 0.016, 0.224]} />
              </mesh>
            </group>
          </group>
        </group>
      </group>
    </group>
  );
};
