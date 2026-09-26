import React, { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';

export type CharacterPose = 'batting-stance' | 'cover-drive' | 'idle-ready' | 'bowling-ready';

export interface CharacterConfig {
  skinTone: string;
  hairColor: string;
  jerseyColor: string;
  jerseyAccentColor: string;
  jerseyNumber: string;
  shortsColor: string;
  shoesColor: string;
  hasCap: boolean;
  hasGloves: boolean;
  hasWristBand: boolean;
  batWoodTone: 'kashmir-willow' | 'english-willow';
  pose: CharacterPose;
  animateIdle: boolean;
}

/**
 * High-Fidelity 1:1 Metric Gully Cricket Player Model
 * Proportioned to match realistic architectural dimensions:
 * - Height: 1.76m (Head top to ground)
 * - Shoulder Width: 0.44m
 * - Realistic anatomical joint hierarchy with multiple interactive poses:
 *   1. 'batting-stance': Classic grounded bat ready position
 *   2. 'cover-drive': Iconic front-foot stylish lofted drive
 *   3. 'idle-ready': Casual bat on shoulder street stance
 *   4. 'bowling-ready': Taped tennis ball grip poised to deliver
 * - Detailed Kashmir/English Willow bat with rubber grip wrapping & brand sticker
 * - Gully taped tennis ball with wound electrical insulation tape details
 */
export const GullyCricketPlayer: React.FC<{
  config?: Partial<CharacterConfig>;
  position?: [number, number, number];
  rotation?: [number, number, number];
  scale?: number;
}> = ({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = 1,
  config = {},
}) => {
  const {
    skinTone = '#c68642', // Warm Indian skin tone
    hairColor = '#171717', // Natural dark hair
    jerseyColor = '#1d4ed8', // Vibrant Team Blue (India / Gully XI)
    jerseyAccentColor = '#f59e0b', // Golden saffron trim
    jerseyNumber = '7',
    shortsColor = '#1e293b', // Deep navy shorts
    shoesColor = '#f8fafc', // Clean white sneakers with accents
    hasCap = true,
    hasGloves = true,
    hasWristBand = true,
    batWoodTone = 'kashmir-willow',
    pose = 'batting-stance',
    animateIdle = true,
  } = config;

  const rootGroupRef = useRef<THREE.Group>(null);
  const spineRef = useRef<THREE.Group>(null);
  const headRef = useRef<THREE.Group>(null);

  // Materials
  const skinMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: skinTone,
        roughness: 0.62,
        metalness: 0.05,
      }),
    [skinTone]
  );

  const hairMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: hairColor,
        roughness: 0.85,
        metalness: 0.1,
      }),
    [hairColor]
  );

  const jerseyMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: jerseyColor,
        roughness: 0.7,
        metalness: 0.1,
      }),
    [jerseyColor]
  );

  const jerseyTrimMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: jerseyAccentColor,
        roughness: 0.5,
        metalness: 0.2,
      }),
    [jerseyAccentColor]
  );

  const shortsMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: shortsColor,
        roughness: 0.75,
        metalness: 0.08,
      }),
    [shortsColor]
  );

  const shoesMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: shoesColor,
        roughness: 0.4,
        metalness: 0.15,
      }),
    [shoesColor]
  );

  const shoesSoleMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#dc2626', // Red athletic tread sole
        roughness: 0.6,
        metalness: 0.1,
      }),
    []
  );

  const socksMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#f8fafc',
        roughness: 0.8,
      }),
    []
  );

  const gloveMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#ffffff',
        roughness: 0.5,
        metalness: 0.2,
      }),
    []
  );

  const glovePadMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: jerseyAccentColor,
        roughness: 0.4,
        metalness: 0.15,
      }),
    [jerseyAccentColor]
  );

  const batWoodMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: batWoodTone === 'kashmir-willow' ? '#d4a373' : '#faedcd',
        roughness: 0.68,
        metalness: 0.05,
      }),
    [batWoodTone]
  );

  const batGripMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#dc2626', // Red textured rubber grip
        roughness: 0.85,
        metalness: 0.1,
      }),
    []
  );

  const tennisBallMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#ef4444', // Red taped tennis ball
        roughness: 0.5,
        metalness: 0.1,
      }),
    []
  );

  const tapeWhiteMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#f8fafc',
        roughness: 0.4,
      }),
    []
  );

  const darkEyeMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#111827',
        roughness: 0.2,
      }),
    []
  );

  // Subtle Procedural Breathing Animation
  useFrame(({ clock }) => {
    if (!animateIdle || !spineRef.current || !headRef.current) return;
    const t = clock.getElapsedTime();
    const breath = Math.sin(t * 2.2) * 0.015;
    spineRef.current.position.y = 0.98 + breath * 0.5;
    headRef.current.rotation.x = Math.sin(t * 1.5) * 0.02;
  });

  return (
    <group position={position} rotation={rotation} scale={scale} ref={rootGroupRef}>
      {/* ---------------- 1. LEGS & FEET ---------------- */}
      {pose === 'batting-stance' && (
        <group>
          {/* Left Leg (Back Leg - Slightly angled) */}
          <group position={[-0.14, 0.52, -0.06]} rotation={[0.08, -0.15, -0.08]}>
            {/* Thigh */}
            <mesh position={[0, 0.16, 0]} castShadow material={skinMat}>
              <cylinderGeometry args={[0.072, 0.058, 0.38, 12]} />
            </mesh>
            {/* Shin & Calf */}
            <mesh position={[0, -0.18, 0]} castShadow material={skinMat}>
              <cylinderGeometry args={[0.055, 0.045, 0.38, 12]} />
            </mesh>
            {/* Ankle Sock */}
            <mesh position={[0, -0.34, 0]} material={socksMat}>
              <cylinderGeometry args={[0.048, 0.046, 0.1, 12]} />
            </mesh>
            {/* Left Sneaker */}
            <group position={[0, -0.44, 0.05]} rotation={[0, 0.15, 0]}>
              <mesh castShadow material={shoesMat}>
                <boxGeometry args={[0.09, 0.08, 0.22]} />
              </mesh>
              <mesh position={[0, -0.038, 0]} material={shoesSoleMat}>
                <boxGeometry args={[0.095, 0.018, 0.23]} />
              </mesh>
            </group>
          </group>

          {/* Right Leg (Front Leg - Slightly forward) */}
          <group position={[0.14, 0.52, 0.08]} rotation={[-0.08, 0.15, 0.08]}>
            {/* Thigh */}
            <mesh position={[0, 0.16, 0]} castShadow material={skinMat}>
              <cylinderGeometry args={[0.072, 0.058, 0.38, 12]} />
            </mesh>
            {/* Shin & Calf */}
            <mesh position={[0, -0.18, 0]} castShadow material={skinMat}>
              <cylinderGeometry args={[0.055, 0.045, 0.38, 12]} />
            </mesh>
            {/* Ankle Sock */}
            <mesh position={[0, -0.34, 0]} material={socksMat}>
              <cylinderGeometry args={[0.048, 0.046, 0.1, 12]} />
            </mesh>
            {/* Right Sneaker */}
            <group position={[0, -0.44, 0.05]} rotation={[0, -0.15, 0]}>
              <mesh castShadow material={shoesMat}>
                <boxGeometry args={[0.09, 0.08, 0.22]} />
              </mesh>
              <mesh position={[0, -0.038, 0]} material={shoesSoleMat}>
                <boxGeometry args={[0.095, 0.018, 0.23]} />
              </mesh>
            </group>
          </group>
        </group>
      )}

      {pose === 'cover-drive' && (
        <group>
          {/* Left Leg (Back Leg - Bent low for drive anchor) */}
          <group position={[-0.18, 0.44, -0.28]} rotation={[0.45, -0.1, -0.1]}>
            <mesh position={[0, 0.16, 0]} castShadow material={skinMat}>
              <cylinderGeometry args={[0.072, 0.058, 0.38, 12]} />
            </mesh>
            <mesh position={[0, -0.18, 0.05]} rotation={[-0.5, 0, 0]} castShadow material={skinMat}>
              <cylinderGeometry args={[0.055, 0.045, 0.38, 12]} />
            </mesh>
            <group position={[0, -0.38, 0.14]} rotation={[-0.4, 0, 0]}>
              <mesh castShadow material={shoesMat}>
                <boxGeometry args={[0.09, 0.08, 0.22]} />
              </mesh>
              <mesh position={[0, -0.038, 0]} material={shoesSoleMat}>
                <boxGeometry args={[0.095, 0.018, 0.23]} />
              </mesh>
            </group>
          </group>

          {/* Right Leg (Front Stride Lunging Forward into shot) */}
          <group position={[0.12, 0.46, 0.38]} rotation={[-0.4, 0.1, 0.05]}>
            <mesh position={[0, 0.16, 0]} castShadow material={skinMat}>
              <cylinderGeometry args={[0.072, 0.058, 0.38, 12]} />
            </mesh>
            <mesh position={[0, -0.18, -0.04]} rotation={[0.45, 0, 0]} castShadow material={skinMat}>
              <cylinderGeometry args={[0.055, 0.045, 0.38, 12]} />
            </mesh>
            <group position={[0, -0.38, 0.06]}>
              <mesh castShadow material={shoesMat}>
                <boxGeometry args={[0.09, 0.08, 0.22]} />
              </mesh>
              <mesh position={[0, -0.038, 0]} material={shoesSoleMat}>
                <boxGeometry args={[0.095, 0.018, 0.23]} />
              </mesh>
            </group>
          </group>
        </group>
      )}

      {(pose === 'idle-ready' || pose === 'bowling-ready') && (
        <group>
          {/* Left Leg (Upright relaxed stance) */}
          <group position={[-0.12, 0.52, 0]} rotation={[0, 0, -0.03]}>
            <mesh position={[0, 0.16, 0]} castShadow material={skinMat}>
              <cylinderGeometry args={[0.072, 0.058, 0.38, 12]} />
            </mesh>
            <mesh position={[0, -0.18, 0]} castShadow material={skinMat}>
              <cylinderGeometry args={[0.055, 0.045, 0.38, 12]} />
            </mesh>
            <mesh position={[0, -0.34, 0]} material={socksMat}>
              <cylinderGeometry args={[0.048, 0.046, 0.1, 12]} />
            </mesh>
            <group position={[0, -0.44, 0.05]}>
              <mesh castShadow material={shoesMat}>
                <boxGeometry args={[0.09, 0.08, 0.22]} />
              </mesh>
              <mesh position={[0, -0.038, 0]} material={shoesSoleMat}>
                <boxGeometry args={[0.095, 0.018, 0.23]} />
              </mesh>
            </group>
          </group>

          {/* Right Leg */}
          <group position={[0.12, 0.52, 0]} rotation={[0, 0, 0.03]}>
            <mesh position={[0, 0.16, 0]} castShadow material={skinMat}>
              <cylinderGeometry args={[0.072, 0.058, 0.38, 12]} />
            </mesh>
            <mesh position={[0, -0.18, 0]} castShadow material={skinMat}>
              <cylinderGeometry args={[0.055, 0.045, 0.38, 12]} />
            </mesh>
            <mesh position={[0, -0.34, 0]} material={socksMat}>
              <cylinderGeometry args={[0.048, 0.046, 0.1, 12]} />
            </mesh>
            <group position={[0, -0.44, 0.05]}>
              <mesh castShadow material={shoesMat}>
                <boxGeometry args={[0.09, 0.08, 0.22]} />
              </mesh>
              <mesh position={[0, -0.038, 0]} material={shoesSoleMat}>
                <boxGeometry args={[0.095, 0.018, 0.23]} />
              </mesh>
            </group>
          </group>
        </group>
      )}

      {/* ---------------- 2. HIPS & SHORTS ---------------- */}
      <group position={[0, 0.88, 0]}>
        {/* Main Hips Pelvis */}
        <mesh castShadow material={shortsMat}>
          <boxGeometry args={[0.34, 0.18, 0.22]} />
        </mesh>
        {/* Left Shorts Leg */}
        <mesh position={[-0.12, -0.1, 0]} castShadow material={shortsMat}>
          <cylinderGeometry args={[0.088, 0.082, 0.18, 14]} />
        </mesh>
        {/* Right Shorts Leg */}
        <mesh position={[0.12, -0.1, 0]} castShadow material={shortsMat}>
          <cylinderGeometry args={[0.088, 0.082, 0.18, 14]} />
        </mesh>
        {/* Shorts Sporty Side Stripes */}
        <mesh position={[-0.175, -0.04, 0]} material={jerseyTrimMat}>
          <boxGeometry args={[0.006, 0.22, 0.04]} />
        </mesh>
        <mesh position={[0.175, -0.04, 0]} material={jerseyTrimMat}>
          <boxGeometry args={[0.006, 0.22, 0.04]} />
        </mesh>
      </group>

      {/* ---------------- 3. SPINE, TORSO & CRICKET JERSEY ---------------- */}
      <group position={[0, 0.98, 0]} ref={spineRef}>
        {/* Lower Abdomen */}
        <mesh position={[0, 0.12, 0]} castShadow material={jerseyMat}>
          <cylinderGeometry args={[0.165, 0.155, 0.22, 14]} />
        </mesh>

        {/* Athletic Chest & Back */}
        <mesh position={[0, 0.28, 0]} castShadow material={jerseyMat}>
          <boxGeometry args={[0.36, 0.24, 0.21]} />
        </mesh>

        {/* Contrast Jersey V-Neck / Collar */}
        <mesh position={[0, 0.38, 0.04]} rotation={[-0.3, 0, 0]} material={jerseyTrimMat}>
          <torusGeometry args={[0.08, 0.015, 8, 16, Math.PI]} />
        </mesh>

        {/* Printed Jersey Number on Back */}
        <group position={[0, 0.28, -0.11]}>
          <mesh material={jerseyTrimMat}>
            <boxGeometry args={[0.1, 0.12, 0.006]} />
          </mesh>
          {/* Inner cutout contrast showing jersey number */}
          {jerseyNumber === '7' ? (
            <mesh position={[0, 0, -0.004]} material={jerseyMat}>
              <boxGeometry args={[0.06, 0.08, 0.002]} />
            </mesh>
          ) : (
            <mesh position={[0, 0, -0.004]} material={jerseyMat}>
              <boxGeometry args={[0.07, 0.08, 0.002]} />
            </mesh>
          )}
        </group>

        {/* Shoulders */}
        <mesh position={[-0.2, 0.36, 0]} rotation={[0, 0, -0.3]} castShadow material={jerseyMat}>
          <sphereGeometry args={[0.075, 12, 10]} />
        </mesh>
        <mesh position={[0.2, 0.36, 0]} rotation={[0, 0, 0.3]} castShadow material={jerseyMat}>
          <sphereGeometry args={[0.075, 12, 10]} />
        </mesh>

        {/* ---------------- 4. NECK & HEAD ---------------- */}
        <group position={[0, 0.42, 0]} ref={headRef}>
          {/* Neck */}
          <mesh position={[0, 0.04, 0]} castShadow material={skinMat}>
            <cylinderGeometry args={[0.048, 0.054, 0.1, 12]} />
          </mesh>

          {/* Head & Face */}
          <group position={[0, 0.18, 0.02]}>
            {/* Cranium / Face Oval */}
            <mesh castShadow material={skinMat}>
              <sphereGeometry args={[0.11, 18, 16]} />
            </mesh>

            {/* Jaw / Chin */}
            <mesh position={[0, -0.05, 0.04]} castShadow material={skinMat}>
              <boxGeometry args={[0.11, 0.08, 0.1]} />
            </mesh>

            {/* Nose */}
            <mesh position={[0, -0.01, 0.11]} rotation={[-0.1, 0, 0]} material={skinMat}>
              <coneGeometry args={[0.018, 0.04, 6]} />
            </mesh>

            {/* Left & Right Eyes */}
            <mesh position={[-0.042, 0.02, 0.1]} material={darkEyeMat}>
              <sphereGeometry args={[0.014, 8, 6]} />
            </mesh>
            <mesh position={[0.042, 0.02, 0.1]} material={darkEyeMat}>
              <sphereGeometry args={[0.014, 8, 6]} />
            </mesh>

            {/* Eyebrows */}
            <mesh position={[-0.044, 0.045, 0.095]} rotation={[0, 0, 0.1]} material={hairMat}>
              <boxGeometry args={[0.038, 0.008, 0.01]} />
            </mesh>
            <mesh position={[0.044, 0.045, 0.095]} rotation={[0, 0, -0.1]} material={hairMat}>
              <boxGeometry args={[0.038, 0.008, 0.01]} />
            </mesh>

            {/* Ears */}
            <mesh position={[-0.11, 0, 0]} rotation={[0, 0, -0.2]} material={skinMat}>
              <sphereGeometry args={[0.025, 8, 8]} />
            </mesh>
            <mesh position={[0.11, 0, 0]} rotation={[0, 0, 0.2]} material={skinMat}>
              <sphereGeometry args={[0.025, 8, 8]} />
            </mesh>

            {/* Modern Street Hairstyle (Fade / Textured Top) */}
            <group position={[0, 0.05, -0.01]}>
              <mesh castShadow material={hairMat}>
                <sphereGeometry args={[0.118, 16, 12, 0, Math.PI * 2, 0, Math.PI * 0.55]} />
              </mesh>
              {/* Front Bangs Fringe */}
              <mesh position={[0, 0.06, 0.08]} rotation={[0.4, 0, 0]} material={hairMat}>
                <boxGeometry args={[0.14, 0.04, 0.06]} />
              </mesh>
            </group>

            {/* Optional Cricket Cap */}
            {hasCap && (
              <group position={[0, 0.07, 0]}>
                {/* Cap Dome */}
                <mesh castShadow material={jerseyMat}>
                  <sphereGeometry args={[0.12, 16, 12, 0, Math.PI * 2, 0, Math.PI * 0.5]} />
                </mesh>
                {/* Cap Curved Visor / Peak */}
                <mesh position={[0, 0.01, 0.12]} rotation={[0.22, 0, 0]} material={jerseyMat}>
                  <boxGeometry args={[0.15, 0.012, 0.1]} />
                </mesh>
                {/* Saffron Emblem Badge on Cap */}
                <mesh position={[0, 0.04, 0.115]} material={jerseyTrimMat}>
                  <cylinderGeometry args={[0.016, 0.016, 0.005, 8]} />
                </mesh>
              </group>
            )}
          </group>
        </group>

        {/* ---------------- 5. ARMS & CRICKET GEAR (POSES) ---------------- */}
        {/* POSE 1: BATTING STANCE (Classic Cricket Stance) */}
        {pose === 'batting-stance' && (
          <group>
            {/* Left Arm (Top Hand on bat grip) */}
            <group position={[-0.22, 0.32, 0]} rotation={[0.6, 0.35, -0.4]}>
              <mesh position={[0, -0.12, 0]} castShadow material={skinMat}>
                <cylinderGeometry args={[0.046, 0.04, 0.26, 10]} />
              </mesh>
              {/* Forearm & Hand */}
              <group position={[0, -0.24, 0]} rotation={[0.8, -0.2, 0]}>
                <mesh position={[0, -0.1, 0]} castShadow material={skinMat}>
                  <cylinderGeometry args={[0.04, 0.034, 0.22, 10]} />
                </mesh>
                {/* Batting Glove */}
                <mesh position={[0, -0.22, 0.02]} material={hasGloves ? gloveMat : skinMat}>
                  <boxGeometry args={[0.065, 0.08, 0.065]} />
                </mesh>
              </group>
            </group>

            {/* Right Arm (Bottom Hand on bat grip) */}
            <group position={[0.22, 0.32, 0]} rotation={[0.8, -0.2, 0.3]}>
              <mesh position={[0, -0.12, 0]} castShadow material={skinMat}>
                <cylinderGeometry args={[0.046, 0.04, 0.26, 10]} />
              </mesh>
              <group position={[0, -0.24, 0]} rotation={[0.9, 0.2, 0]}>
                <mesh position={[0, -0.1, 0]} castShadow material={skinMat}>
                  <cylinderGeometry args={[0.04, 0.034, 0.22, 10]} />
                </mesh>
                {/* Right Batting Glove */}
                <mesh position={[0, -0.22, 0.02]} material={hasGloves ? gloveMat : skinMat}>
                  <boxGeometry args={[0.065, 0.08, 0.065]} />
                </mesh>
                {/* Glove Finger Roll Pads */}
                {hasGloves && (
                  <mesh position={[0, -0.22, 0.05]} material={glovePadMat}>
                    <boxGeometry args={[0.058, 0.07, 0.015]} />
                  </mesh>
                )}
              </group>
            </group>

            {/* Kashmir/English Willow Cricket Bat (Grounded at Crease) */}
            <group position={[0.02, -0.12, 0.32]} rotation={[-0.2, 0.1, -0.15]}>
              {/* Bat Rubber Handle */}
              <mesh position={[0, 0.28, 0]} castShadow material={batGripMat}>
                <cylinderGeometry args={[0.018, 0.018, 0.32, 12]} />
              </mesh>
              {/* Handle Top Cap */}
              <mesh position={[0, 0.44, 0]} material={darkEyeMat}>
                <cylinderGeometry args={[0.02, 0.02, 0.015, 10]} />
              </mesh>
              {/* Bat Shoulder / Spine Transition */}
              <mesh position={[0, 0.08, 0]} castShadow material={batWoodMat}>
                <boxGeometry args={[0.09, 0.12, 0.045]} />
              </mesh>
              {/* Main Flat Willow Blade */}
              <mesh position={[0, -0.26, 0]} castShadow material={batWoodMat}>
                <boxGeometry args={[0.11, 0.58, 0.038]} />
              </mesh>
              {/* Colored Brand Sticker on Blade */}
              <mesh position={[0, -0.12, 0.02]} material={jerseyTrimMat}>
                <boxGeometry args={[0.085, 0.18, 0.004]} />
              </mesh>
              {/* Rubber Toe Guard */}
              <mesh position={[0, -0.55, 0]} material={darkEyeMat}>
                <boxGeometry args={[0.112, 0.018, 0.04]} />
              </mesh>
            </group>
          </group>
        )}

        {/* POSE 2: COVER DRIVE (Dynamic High-Elbow Shot) */}
        {pose === 'cover-drive' && (
          <group>
            {/* High Left Elbow */}
            <group position={[-0.22, 0.32, 0]} rotation={[1.4, 0.6, -0.6]}>
              <mesh position={[0, -0.12, 0]} castShadow material={skinMat}>
                <cylinderGeometry args={[0.046, 0.04, 0.26, 10]} />
              </mesh>
              <group position={[0, -0.24, 0]} rotation={[0.4, -0.1, 0]}>
                <mesh position={[0, -0.1, 0]} castShadow material={skinMat}>
                  <cylinderGeometry args={[0.04, 0.034, 0.22, 10]} />
                </mesh>
                <mesh position={[0, -0.22, 0]} material={hasGloves ? gloveMat : skinMat}>
                  <boxGeometry args={[0.065, 0.08, 0.065]} />
                </mesh>
              </group>
            </group>

            {/* Right Arm following through */}
            <group position={[0.22, 0.32, 0]} rotation={[1.1, -0.3, 0.2]}>
              <mesh position={[0, -0.12, 0]} castShadow material={skinMat}>
                <cylinderGeometry args={[0.046, 0.04, 0.26, 10]} />
              </mesh>
              <group position={[0, -0.24, 0]} rotation={[0.6, 0.1, 0]}>
                <mesh position={[0, -0.1, 0]} castShadow material={skinMat}>
                  <cylinderGeometry args={[0.04, 0.034, 0.22, 10]} />
                </mesh>
                <mesh position={[0, -0.22, 0]} material={hasGloves ? gloveMat : skinMat}>
                  <boxGeometry args={[0.065, 0.08, 0.065]} />
                </mesh>
              </group>
            </group>

            {/* Sweeping Bat in Cover Drive Arc */}
            <group position={[0.18, 0.08, 0.44]} rotation={[0.6, 0.4, -0.8]}>
              <mesh position={[0, 0.28, 0]} castShadow material={batGripMat}>
                <cylinderGeometry args={[0.018, 0.018, 0.32, 12]} />
              </mesh>
              <mesh position={[0, -0.26, 0]} castShadow material={batWoodMat}>
                <boxGeometry args={[0.11, 0.58, 0.038]} />
              </mesh>
              <mesh position={[0, -0.12, 0.02]} material={jerseyTrimMat}>
                <boxGeometry args={[0.085, 0.18, 0.004]} />
              </mesh>
            </group>
          </group>
        )}

        {/* POSE 3: IDLE READY (Bat on Shoulder) */}
        {pose === 'idle-ready' && (
          <group>
            {/* Left Hand on hip */}
            <group position={[-0.22, 0.32, 0]} rotation={[0.2, 0, -0.5]}>
              <mesh position={[0, -0.12, 0]} castShadow material={skinMat}>
                <cylinderGeometry args={[0.046, 0.04, 0.26, 10]} />
              </mesh>
              <group position={[0, -0.24, 0]} rotation={[0, 0, 0.8]}>
                <mesh position={[0, -0.1, 0]} castShadow material={skinMat}>
                  <cylinderGeometry args={[0.04, 0.034, 0.22, 10]} />
                </mesh>
                <mesh position={[0, -0.2, 0]} material={skinMat}>
                  <boxGeometry args={[0.05, 0.06, 0.04]} />
                </mesh>
              </group>
            </group>

            {/* Right Arm Holding Bat over shoulder */}
            <group position={[0.22, 0.32, 0]} rotation={[-0.5, 0, 0.6]}>
              <mesh position={[0, -0.12, 0]} castShadow material={skinMat}>
                <cylinderGeometry args={[0.046, 0.04, 0.26, 10]} />
              </mesh>
              <group position={[0, -0.24, 0]} rotation={[-1.6, 0, 0]}>
                <mesh position={[0, -0.1, 0]} castShadow material={skinMat}>
                  <cylinderGeometry args={[0.04, 0.034, 0.22, 10]} />
                </mesh>
                <mesh position={[0, -0.2, 0]} material={skinMat}>
                  <boxGeometry args={[0.05, 0.06, 0.04]} />
                </mesh>
              </group>
            </group>

            {/* Bat Resting on Right Shoulder */}
            <group position={[0.24, 0.44, 0.04]} rotation={[0.8, -0.3, 0.2]}>
              <mesh position={[0, 0.28, 0]} castShadow material={batGripMat}>
                <cylinderGeometry args={[0.018, 0.018, 0.32, 12]} />
              </mesh>
              <mesh position={[0, -0.26, 0]} castShadow material={batWoodMat}>
                <boxGeometry args={[0.11, 0.58, 0.038]} />
              </mesh>
            </group>
          </group>
        )}

        {/* POSE 4: BOWLING READY (Holding Taped Tennis Ball) */}
        {pose === 'bowling-ready' && (
          <group>
            {/* Left Arm hanging relaxed */}
            <group position={[-0.22, 0.32, 0]} rotation={[0.1, 0, -0.15]}>
              <mesh position={[0, -0.14, 0]} castShadow material={skinMat}>
                <cylinderGeometry args={[0.046, 0.04, 0.28, 10]} />
              </mesh>
              <mesh position={[0, -0.34, 0]} castShadow material={skinMat}>
                <cylinderGeometry args={[0.04, 0.034, 0.24, 10]} />
              </mesh>
              <mesh position={[0, -0.48, 0]} material={skinMat}>
                <boxGeometry args={[0.05, 0.06, 0.04]} />
              </mesh>
            </group>

            {/* Right Arm Raised Holding Ball at Chest */}
            <group position={[0.22, 0.32, 0]} rotation={[0.6, 0, 0.3]}>
              <mesh position={[0, -0.12, 0]} castShadow material={skinMat}>
                <cylinderGeometry args={[0.046, 0.04, 0.26, 10]} />
              </mesh>
              <group position={[0, -0.24, 0]} rotation={[1.1, 0, 0]}>
                <mesh position={[0, -0.1, 0]} castShadow material={skinMat}>
                  <cylinderGeometry args={[0.04, 0.034, 0.22, 10]} />
                </mesh>
                {/* Wrist Sweatband */}
                {hasWristBand && (
                  <mesh position={[0, -0.16, 0]} material={jerseyTrimMat}>
                    <cylinderGeometry args={[0.042, 0.042, 0.05, 12]} />
                  </mesh>
                )}
                {/* Hand Gripping Ball */}
                <group position={[0, -0.24, 0.02]}>
                  <mesh material={skinMat}>
                    <sphereGeometry args={[0.04, 10, 8]} />
                  </mesh>
                  {/* Heavy Taped Gully Tennis Ball */}
                  <mesh position={[0, 0.02, 0.04]} castShadow material={tennisBallMat}>
                    <sphereGeometry args={[0.036, 16, 12]} />
                  </mesh>
                  {/* White Insulation Tape Strip around seam */}
                  <mesh position={[0, 0.02, 0.04]} material={tapeWhiteMat}>
                    <torusGeometry args={[0.0365, 0.006, 8, 20]} />
                  </mesh>
                </group>
              </group>
            </group>
          </group>
        )}
      </group>
    </group>
  );
};
