import React, { useMemo } from 'react';
import {
  WaterTank,
  DishAntenna,
  ExposedRebars,
  WindowWithGrill,
  Clothesline,
  DesertAirCooler,
} from '../HouseProps';
import { createPeelingWallTexture } from '../../../materials/ProceduralTextures';

export const GullyChawlHouse: React.FC<{
  position?: [number, number, number];
  rotation?: [number, number, number];
  wallColor?: string;
  storeys?: number;
}> = ({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  wallColor = '#f59e0b',
  storeys = 2,
}) => {
  const wallTexture = useMemo(
    () => createPeelingWallTexture(wallColor, '#b45309', '#fef3c7'),
    [wallColor]
  );

  return (
    <group position={position} rotation={rotation}>
      {/* Ground Floor Plinth / Threshold Steps */}
      <mesh position={[0, 0.15, 0.4]} receiveShadow>
        <boxGeometry args={[4.4, 0.3, 1.2]} />
        <meshStandardMaterial color="#64748b" roughness={0.9} />
      </mesh>

      {/* Main Ground Floor Building Body */}
      <mesh position={[0, 1.6, 0]} castShadow receiveShadow>
        <boxGeometry args={[4.2, 3.2, 4.0]} />
        <meshStandardMaterial map={wallTexture} roughness={0.85} />
      </mesh>

      {/* Ground Floor Metal Rolling Shutter / Shop Entrance */}
      <mesh position={[0, 1.4, 2.02]} castShadow>
        <boxGeometry args={[2.8, 2.4, 0.08]} />
        <meshStandardMaterial color="#0284c7" metalness={0.7} roughness={0.4} />
      </mesh>
      {/* Horizontal Grooves on Shutter */}
      {[-0.8, -0.4, 0, 0.4, 0.8].map((y, i) => (
        <mesh key={i} position={[0, 1.4 + y, 2.07]}>
          <boxGeometry args={[2.7, 0.04, 0.02]} />
          <meshStandardMaterial color="#0369a1" roughness={0.5} />
        </mesh>
      ))}

      {/* Shop Board ("SHARMA GENERAL STORE") */}
      <group position={[0, 2.8, 2.15]}>
        <mesh castShadow>
          <boxGeometry args={[3.2, 0.6, 0.1]} />
          <meshStandardMaterial color="#dc2626" roughness={0.5} />
        </mesh>
      </group>

      {/* 1st Floor Balcony */}
      <group position={[0, 3.2, 0]}>
        {/* Balcony Floor Slab Projection */}
        <mesh position={[0, 0.1, 1.2]} castShadow receiveShadow>
          <boxGeometry args={[4.0, 0.2, 1.6]} />
          <meshStandardMaterial color="#94a3b8" roughness={0.85} />
        </mesh>

        {/* 1st Floor Body */}
        <mesh position={[0, 1.6, 0]} castShadow receiveShadow>
          <boxGeometry args={[4.2, 3.0, 4.0]} />
          <meshStandardMaterial map={wallTexture} roughness={0.85} />
        </mesh>

        {/* Ornate Balcony Metal Railing */}
        <mesh position={[0, 0.6, 1.95]} castShadow>
          <boxGeometry args={[3.9, 0.8, 0.06]} />
          <meshStandardMaterial color="#1e293b" metalness={0.8} roughness={0.4} />
        </mesh>
        <mesh position={[-1.95, 0.6, 1.2]} rotation={[0, Math.PI / 2, 0]} castShadow>
          <boxGeometry args={[1.5, 0.8, 0.06]} />
          <meshStandardMaterial color="#1e293b" metalness={0.8} roughness={0.4} />
        </mesh>
        <mesh position={[1.95, 0.6, 1.2]} rotation={[0, Math.PI / 2, 0]} castShadow>
          <boxGeometry args={[1.5, 0.8, 0.06]} />
          <meshStandardMaterial color="#1e293b" metalness={0.8} roughness={0.4} />
        </mesh>

        {/* Balcony French Door / Windows */}
        <WindowWithGrill position={[-1.0, 1.5, 2.02]} />
        <WindowWithGrill position={[1.0, 1.5, 2.02]} />

        {/* Air Cooler on 1st floor window */}
        <DesertAirCooler position={[-1.0, 0.7, 1.5]} rotation={[0, 0, 0]} />

        {/* Clothesline on balcony */}
        <Clothesline position={[0, 1.4, 1.8]} length={3.2} />
      </group>

      {/* 2nd Floor (if storeys >= 3) */}
      {storeys >= 3 && (
        <group position={[0, 6.2, 0]}>
          <mesh position={[0, 1.5, 0]} castShadow receiveShadow>
            <boxGeometry args={[4.2, 3.0, 4.0]} />
            <meshStandardMaterial map={wallTexture} roughness={0.85} />
          </mesh>
          <WindowWithGrill position={[0, 1.4, 2.02]} />
          <DishAntenna position={[1.2, 1.5, 2.1]} scale={0.8} />
        </group>
      )}

      {/* Rooftop on Top */}
      <group position={[0, storeys === 3 ? 9.2 : 6.2, 0]}>
        {/* Parapet Wall */}
        <mesh position={[0, 0.4, 2.0]} castShadow>
          <boxGeometry args={[4.3, 0.8, 0.15]} />
          <meshStandardMaterial color="#94a3b8" roughness={0.9} />
        </mesh>
        <mesh position={[-2.1, 0.4, 0]} rotation={[0, Math.PI / 2, 0]} castShadow>
          <boxGeometry args={[4.0, 0.8, 0.15]} />
          <meshStandardMaterial color="#94a3b8" roughness={0.9} />
        </mesh>
        <mesh position={[2.1, 0.4, 0]} rotation={[0, Math.PI / 2, 0]} castShadow>
          <boxGeometry args={[4.0, 0.8, 0.15]} />
          <meshStandardMaterial color="#94a3b8" roughness={0.9} />
        </mesh>

        {/* Sintex Water Tank */}
        <WaterTank position={[-1.2, 0, -0.8]} color="#0284c7" />

        {/* Satellite Dish */}
        <DishAntenna position={[1.1, 0, 0.6]} rotation={[0, -0.6, 0]} />

        {/* Rebars on rooftop corners */}
        <ExposedRebars position={[-1.9, 0, -1.8]} />
        <ExposedRebars position={[1.9, 0, -1.8]} />
        <ExposedRebars position={[-1.9, 0, 1.8]} />
        <ExposedRebars position={[1.9, 0, 1.8]} />
      </group>

      {/* Side Electric Junction Meter Box */}
      <group position={[-2.12, 1.8, 0.5]}>
        <mesh castShadow>
          <boxGeometry args={[0.08, 0.6, 0.4]} />
          <meshStandardMaterial color="#475569" roughness={0.5} />
        </mesh>
        <mesh position={[0, -0.5, 0]}>
          <cylinderGeometry args={[0.015, 0.015, 0.8, 6]} />
          <meshStandardMaterial color="#0f172a" roughness={0.9} />
        </mesh>
      </group>
    </group>
  );
};
