import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Sky } from '@react-three/drei';
import * as THREE from 'three';
import { DEFAULT_ATMOSPHERE_CONFIG } from './EnvironmentPerformance';

interface SkySystemProps {
  turbidity?: number;
  rayleigh?: number;
  mieCoefficient?: number;
  mieDirectionalG?: number;
  elevation?: number;
  azimuth?: number;
}

/**
 * Procedural 3D Fluffy Cumulus Cloud Formation
 * Composed of overlapping ellipsoidal puffs with soft shading
 */
const FluffyCloudFormation: React.FC<{
  position: [number, number, number];
  scale?: [number, number, number];
  rotation?: [number, number, number];
  opacity?: number;
}> = ({ position, scale = [1, 1, 1], rotation = [0, 0, 0], opacity = 0.88 }) => {
  // Puffs that make up an organic cumulus cloud shape
  const puffs = useMemo(
    () => [
      { offset: [0, 0, 0], size: [18, 9, 14] },
      { offset: [-8, -1, 2], size: [14, 7, 12] },
      { offset: [9, -1.5, -1], size: [15, 8, 12] },
      { offset: [-16, -3, 0], size: [11, 5, 10] },
      { offset: [17, -2.5, 1], size: [12, 6, 10] },
      { offset: [-4, 3.5, -2], size: [13, 8, 11] },
      { offset: [5, 4, 1], size: [12, 7, 10] },
      { offset: [0, 5, -0.5], size: [10, 6, 9] },
    ],
    []
  );

  return (
    <group position={position} scale={scale} rotation={rotation}>
      {puffs.map((puff, idx) => (
        <mesh key={idx} position={puff.offset as [number, number, number]}>
          <sphereGeometry args={[1, 14, 12]} />
          <meshStandardMaterial
            color="#ffffff"
            roughness={0.95}
            metalness={0.0}
            transparent
            opacity={opacity}
            depthWrite={false}
          />
        </mesh>
      ))}
      {/* Soft Ambient Underside Shade */}
      <mesh position={[0, -2.5, 0]}>
        <sphereGeometry args={[1, 14, 10]} />
        <meshStandardMaterial
          color="#dbeafe"
          roughness={0.98}
          transparent
          opacity={opacity * 0.7}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
};

/**
 * Production Sky & Dynamic 3D Cloud System
 */
export const SkySystem: React.FC<SkySystemProps> = ({
  turbidity = DEFAULT_ATMOSPHERE_CONFIG.skyTurbidity,
  rayleigh = DEFAULT_ATMOSPHERE_CONFIG.skyRayleigh,
  mieCoefficient = DEFAULT_ATMOSPHERE_CONFIG.skyMieCoefficient,
  mieDirectionalG = DEFAULT_ATMOSPHERE_CONFIG.skyMieDirectionalG,
  elevation = DEFAULT_ATMOSPHERE_CONFIG.skyElevation,
  azimuth = DEFAULT_ATMOSPHERE_CONFIG.skyAzimuth,
}) => {
  const cloudsGroupRef = useRef<THREE.Group>(null);

  // Convert spherical elevation/azimuth to sun position vector
  const sunPosition = useMemo(() => {
    const phi = THREE.MathUtils.degToRad(90 - elevation);
    const theta = THREE.MathUtils.degToRad(azimuth);
    return new THREE.Vector3(
      Math.sin(phi) * Math.sin(theta) * 100,
      Math.cos(phi) * 100,
      Math.sin(phi) * Math.cos(theta) * 100
    );
  }, [elevation, azimuth]);

  // Gentle atmospheric cloud drift (super lightweight, 0 garbage collection)
  useFrame((_, delta) => {
    if (cloudsGroupRef.current) {
      cloudsGroupRef.current.rotation.y += delta * 0.0018;
    }
  });

  return (
    <group name="sky-and-clouds-system">
      {/* 1. Procedural Atmospheric Sky Dome */}
      <Sky
        distance={450000}
        sunPosition={sunPosition}
        turbidity={turbidity}
        rayleigh={rayleigh}
        mieCoefficient={mieCoefficient}
        mieDirectionalG={mieDirectionalG}
      />

      {/* 2. Soft Sky Horizon Blend Gradient Dome */}
      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[420, 24, 16]} />
        <meshBasicMaterial
          color="#bae6fd"
          side={THREE.BackSide}
          transparent
          opacity={0.12}
          depthWrite={false}
        />
      </mesh>

      {/* 3. Layered 3D Fluffy Cumulus Clouds */}
      <group ref={cloudsGroupRef} position={[0, 75, 0]}>
        {/* Main High-Altitude Cloud Formations */}
        <FluffyCloudFormation
          position={[-65, 12, -90]}
          scale={[1.8, 1.4, 1.6]}
          rotation={[0.1, 0.4, -0.05]}
          opacity={0.9}
        />
        <FluffyCloudFormation
          position={[85, 18, -75]}
          scale={[2.2, 1.5, 1.8]}
          rotation={[-0.05, -0.8, 0.1]}
          opacity={0.88}
        />
        <FluffyCloudFormation
          position={[-95, 8, 70]}
          scale={[2.0, 1.3, 1.7]}
          rotation={[0.08, 1.2, 0]}
          opacity={0.85}
        />
        <FluffyCloudFormation
          position={[70, 15, 95]}
          scale={[2.4, 1.6, 2.0]}
          rotation={[-0.1, 0.6, -0.08]}
          opacity={0.92}
        />
        <FluffyCloudFormation
          position={[0, 26, -140]}
          scale={[3.0, 1.8, 2.4]}
          rotation={[0, -0.3, 0]}
          opacity={0.85}
        />
        <FluffyCloudFormation
          position={[-130, 20, -20]}
          scale={[2.5, 1.6, 2.2]}
          rotation={[0.05, 0.9, 0]}
          opacity={0.86}
        />
        <FluffyCloudFormation
          position={[135, 22, 10]}
          scale={[2.8, 1.7, 2.3]}
          rotation={[-0.06, -1.1, 0]}
          opacity={0.88}
        />
      </group>
    </group>
  );
};
