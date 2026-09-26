import React from 'react';
import { ContactShadows, Environment } from '@react-three/drei';

export type LightingPreset = 'afternoon' | 'sunset' | 'monsoon' | 'night';

export const StudioLighting: React.FC<{
  preset?: LightingPreset;
}> = ({ preset = 'afternoon' }) => {
  switch (preset) {
    case 'sunset':
      return (
        <>
          <ambientLight intensity={0.7} color="#fed7aa" />
          <directionalLight
            position={[-8, 6, 6]}
            intensity={2.8}
            color="#fb923c"
            castShadow
            shadow-mapSize={[2048, 2048]}
            shadow-bias={-0.0001}
          />
          <directionalLight position={[6, 4, -4]} intensity={0.6} color="#c084fc" />
          <ContactShadows position={[0, -0.01, 0]} opacity={0.65} scale={20} blur={1.5} far={8} color="#431407" />
          <Environment preset="sunset" />
        </>
      );

    case 'monsoon':
      return (
        <>
          <ambientLight intensity={1.0} color="#94a3b8" />
          <directionalLight
            position={[-4, 10, 4]}
            intensity={1.5}
            color="#e2e8f0"
            castShadow
            shadow-mapSize={[2048, 2048]}
          />
          <ContactShadows position={[0, -0.01, 0]} opacity={0.45} scale={20} blur={2.0} far={8} color="#0f172a" />
          <Environment preset="city" />
        </>
      );

    case 'night':
      return (
        <>
          <ambientLight intensity={0.25} color="#1e1b4b" />
          <pointLight position={[-2.4, 2.2, 2.4]} intensity={5.5} color="#f59e0b" distance={12} castShadow />
          <directionalLight position={[-4, 10, -5]} intensity={0.3} color="#60a5fa" />
          <ContactShadows position={[0, -0.01, 0]} opacity={0.7} scale={20} blur={1.8} far={8} color="#020617" />
          <Environment preset="night" />
        </>
      );

    case 'afternoon':
    default:
      return (
        <>
          {/* Warm Key Sunlight from Upper-Left (Matching 4th Reference Shadow Angle) */}
          <ambientLight intensity={0.85} color="#fef08a" />
          <directionalLight
            position={[-7, 8.5, 6]}
            intensity={2.7}
            color="#fffbeb"
            castShadow
            shadow-mapSize={[2048, 2048]}
            shadow-camera-left={-6}
            shadow-camera-right={6}
            shadow-camera-top={6}
            shadow-camera-bottom={-6}
            shadow-bias={-0.0001}
          />
          {/* Subtle Ambient Fill Light from Right */}
          <directionalLight position={[6, 4, -4]} intensity={0.65} color="#94a3b8" />
          <directionalLight position={[0, -4, 0]} intensity={0.2} color="#c7ab85" />
          <ContactShadows position={[0, -0.01, 0]} opacity={0.6} scale={20} blur={1.2} far={8} color="#18181b" />
          <Environment preset="apartment" />
        </>
      );
  }
};
