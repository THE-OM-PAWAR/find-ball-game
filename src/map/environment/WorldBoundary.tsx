import React from 'react';

/**
 * World Boundary & Extended Terrain System
 * Seamlessly extends the ground plane to 260m radius with soily & grassy terrain and outgoing dirt road connections
 */
export const WorldBoundary: React.FC = () => {
  return (
    <group name="world-boundary-transitions">
      {/* 1. Vast Outer Ground Terrain Floor (260m x 260m) - Grassy Soil */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.02, 0]} receiveShadow>
        <planeGeometry args={[260, 260, 8, 8]} />
        <meshStandardMaterial
          color="#4b632c" // Rich grassy earthen terrain
          roughness={0.96}
          metalness={0.02}
        />
      </mesh>

      {/* 2. Outer Soil Earth Undertone Layer */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.025, 0]}>
        <planeGeometry args={[280, 280, 4, 4]} />
        <meshStandardMaterial
          color="#523f2a" // Deep soil bedrock
          roughness={0.98}
        />
      </mesh>

      {/* 3. Outgoing Road: North-West Society Gate Corridor (Continues into distant town) */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-16.5, -0.005, -55.0]} receiveShadow>
        <planeGeometry args={[7.5, 60.0]} />
        <meshStandardMaterial color="#6a543b" roughness={0.94} />
      </mesh>

      {/* 4. Outgoing Road: South Gully Street (Continues past boundary) */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.005, 55.0]} receiveShadow>
        <planeGeometry args={[11.5, 60.0]} />
        <meshStandardMaterial color="#6a543b" roughness={0.94} />
      </mesh>

      {/* 5. Outgoing Road: East Cross Street */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[55.0, -0.005, 3.0]} receiveShadow>
        <planeGeometry args={[60.0, 8.0]} />
        <meshStandardMaterial color="#685239" roughness={0.94} />
      </mesh>

      {/* 6. Outgoing Road: West Cross Street */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-55.0, -0.005, 3.0]} receiveShadow>
        <planeGeometry args={[60.0, 8.0]} />
        <meshStandardMaterial color="#685239" roughness={0.94} />
      </mesh>
    </group>
  );
};
