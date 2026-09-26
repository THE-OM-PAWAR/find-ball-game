import React from 'react';
import * as THREE from 'three';

interface SocietyExitGateProps {
  position?: [number, number, number];
  rotation?: [number, number, number];
}

export const SocietyExitGate: React.FC<SocietyExitGateProps> = ({
  position = [-14.0, 0, -14.0],
  rotation = [0, 0, 0],
}) => {
  return (
    <group position={position} rotation={rotation} name="society-exit-gate">
      {/* 1. Left Brick Pillar */}
      <group position={[-2.4, 0, 0]}>
        {/* Concrete Foundation Plinth */}
        <mesh position={[0, 0.15, 0]} castShadow receiveShadow>
          <boxGeometry args={[0.9, 0.3, 0.9]} />
          <meshStandardMaterial color="#475569" roughness={0.9} />
        </mesh>
        {/* Pillar Body (Sandstone Plaster) */}
        <mesh position={[0, 1.65, 0]} castShadow receiveShadow>
          <boxGeometry args={[0.75, 2.7, 0.75]} />
          <meshStandardMaterial color="#e0d7c7" roughness={0.85} />
        </mesh>
        {/* Decorative Trim Band */}
        <mesh position={[0, 2.8, 0]} castShadow receiveShadow>
          <boxGeometry args={[0.82, 0.12, 0.82]} />
          <meshStandardMaterial color="#9e4436" roughness={0.8} />
        </mesh>
        {/* Pillar Cap Pyramidal Top */}
        <mesh position={[0, 3.1, 0]} rotation={[0, Math.PI / 4, 0]} castShadow receiveShadow>
          <coneGeometry args={[0.55, 0.35, 4]} />
          <meshStandardMaterial color="#cbd5e1" roughness={0.7} />
        </mesh>
        {/* Top Sphere Finial */}
        <mesh position={[0, 3.4, 0]} castShadow>
          <sphereGeometry args={[0.12, 16, 16]} />
          <meshStandardMaterial color="#e2e8f0" roughness={0.5} metalness={0.2} />
        </mesh>
      </group>

      {/* 2. Right Brick Pillar */}
      <group position={[2.4, 0, 0]}>
        {/* Concrete Foundation Plinth */}
        <mesh position={[0, 0.15, 0]} castShadow receiveShadow>
          <boxGeometry args={[0.9, 0.3, 0.9]} />
          <meshStandardMaterial color="#475569" roughness={0.9} />
        </mesh>
        {/* Pillar Body */}
        <mesh position={[0, 1.65, 0]} castShadow receiveShadow>
          <boxGeometry args={[0.75, 2.7, 0.75]} />
          <meshStandardMaterial color="#e0d7c7" roughness={0.85} />
        </mesh>
        {/* Decorative Trim Band */}
        <mesh position={[0, 2.8, 0]} castShadow receiveShadow>
          <boxGeometry args={[0.82, 0.12, 0.82]} />
          <meshStandardMaterial color="#9e4436" roughness={0.8} />
        </mesh>
        {/* Pillar Cap Top */}
        <mesh position={[0, 3.1, 0]} rotation={[0, Math.PI / 4, 0]} castShadow receiveShadow>
          <coneGeometry args={[0.55, 0.35, 4]} />
          <meshStandardMaterial color="#cbd5e1" roughness={0.7} />
        </mesh>
        {/* Top Sphere Finial */}
        <mesh position={[0, 3.4, 0]} castShadow>
          <sphereGeometry args={[0.12, 16, 16]} />
          <meshStandardMaterial color="#e2e8f0" roughness={0.5} metalness={0.2} />
        </mesh>
      </group>

      {/* 3. Overhead Steel Arch with Society Nameplate */}
      <group position={[0, 3.3, 0]}>
        {/* Arch Beam */}
        <mesh castShadow receiveShadow>
          <boxGeometry args={[4.8, 0.16, 0.16]} />
          <meshStandardMaterial color="#1e293b" roughness={0.5} metalness={0.8} />
        </mesh>

        {/* Society Signboard Frame */}
        <mesh position={[0, 0.45, 0]} castShadow receiveShadow>
          <boxGeometry args={[3.6, 0.65, 0.08]} />
          <meshStandardMaterial color="#1e385c" roughness={0.4} metalness={0.3} />
        </mesh>
        {/* Signboard Border Gold Inset */}
        <mesh position={[0, 0.45, 0.045]}>
          <boxGeometry args={[3.45, 0.52, 0.01]} />
          <meshStandardMaterial color="#fef08a" roughness={0.3} metalness={0.6} />
        </mesh>
        {/* Signboard Face */}
        <mesh position={[0, 0.45, 0.052]}>
          <boxGeometry args={[3.35, 0.44, 0.01]} />
          <meshStandardMaterial color="#0f2744" roughness={0.5} />
        </mesh>

        {/* Arch Lantern Bracket */}
        <group position={[0, -0.25, 0.2]}>
          <mesh castShadow>
            <cylinderGeometry args={[0.08, 0.05, 0.22, 8]} />
            <meshStandardMaterial color="#1e293b" metalness={0.8} />
          </mesh>
          {/* Glass Lantern Bulb */}
          <mesh position={[0, -0.15, 0]}>
            <sphereGeometry args={[0.07, 12, 12]} />
            <meshStandardMaterial color="#fef08a" emissive="#fef08a" emissiveIntensity={0.6} />
          </mesh>
          <pointLight color="#fef08a" intensity={1.2} distance={6} position={[0, -0.15, 0]} />
        </group>
      </group>

      {/* 4. Heavy Iron Gate Wings (Left & Right Leaves Open Slightly) */}
      {/* Left Gate Leaf */}
      <group position={[-2.0, 0.3, 0]} rotation={[0, 0.35, 0]}>
        <mesh position={[0.9, 0.9, 0]} castShadow receiveShadow>
          <boxGeometry args={[1.8, 1.8, 0.05]} />
          <meshStandardMaterial color="#1e293b" roughness={0.6} metalness={0.7} />
        </mesh>
        {/* Iron Vertical Spindles */}
        {[-0.6, -0.3, 0, 0.3, 0.6].map((xOffset, i) => (
          <mesh key={`spindle-l-${i}`} position={[0.9 + xOffset, 1.9, 0]} castShadow>
            <cylinderGeometry args={[0.02, 0.02, 0.3, 8]} />
            <meshStandardMaterial color="#334155" metalness={0.8} />
          </mesh>
        ))}
      </group>

      {/* Right Gate Leaf */}
      <group position={[2.0, 0.3, 0]} rotation={[0, -0.4, 0]}>
        <mesh position={[-0.9, 0.9, 0]} castShadow receiveShadow>
          <boxGeometry args={[1.8, 1.8, 0.05]} />
          <meshStandardMaterial color="#1e293b" roughness={0.6} metalness={0.7} />
        </mesh>
        {/* Iron Vertical Spindles */}
        {[-0.6, -0.3, 0, 0.3, 0.6].map((xOffset, i) => (
          <mesh key={`spindle-r-${i}`} position={[-0.9 + xOffset, 1.9, 0]} castShadow>
            <cylinderGeometry args={[0.02, 0.02, 0.3, 8]} />
            <meshStandardMaterial color="#334155" metalness={0.8} />
          </mesh>
        ))}
      </group>

      {/* 5. Speed Breaker with Yellow-Black Hazard Stripes */}
      <group position={[0, 0.04, 0.6]}>
        <mesh castShadow receiveShadow>
          <boxGeometry args={[4.2, 0.08, 0.55]} />
          <meshStandardMaterial color="#1e293b" roughness={0.85} />
        </mesh>
        {/* Yellow Diagonal Stripes */}
        {[-1.5, -0.75, 0, 0.75, 1.5].map((xOffset, i) => (
          <mesh key={`stripe-${i}`} position={[xOffset, 0.045, 0]} rotation={[0, 0.2, 0]}>
            <boxGeometry args={[0.22, 0.01, 0.52]} />
            <meshStandardMaterial color="#eab308" roughness={0.7} />
          </mesh>
        ))}
      </group>
    </group>
  );
};
