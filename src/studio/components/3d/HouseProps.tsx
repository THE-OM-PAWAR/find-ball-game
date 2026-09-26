import React, { useMemo } from 'react';
import * as THREE from 'three';
import { createWeatheredWoodTexture, createTarpaulinTexture } from '../../materials/ProceduralTextures';

/**
 * Iconic Indian Rooftop Sintex / Cement Water Tank
 */
export const WaterTank: React.FC<{
  position?: [number, number, number];
  rotation?: [number, number, number];
  color?: string;
  hasStand?: boolean;
}> = ({ position = [0, 0, 0], rotation = [0, 0, 0], color = '#1e293b', hasStand = true }) => {
  return (
    <group position={position} rotation={rotation}>
      {/* Brick/Concrete Stand */}
      {hasStand && (
        <mesh position={[0, 0.25, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[0.55, 0.6, 0.5, 16]} />
          <meshStandardMaterial color="#64748b" roughness={0.9} />
        </mesh>
      )}

      {/* Main Tank Body */}
      <mesh position={[0, hasStand ? 0.95 : 0.45, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.5, 0.5, 0.9, 24]} />
        <meshStandardMaterial color={color} roughness={0.3} metalness={0.1} />
      </mesh>

      {/* Ribbed Rings on Tank */}
      {[-0.2, 0, 0.2].map((yOffset, i) => (
        <mesh key={i} position={[0, (hasStand ? 0.95 : 0.45) + yOffset, 0]}>
          <torusGeometry args={[0.505, 0.02, 8, 24]} />
          <meshStandardMaterial color="#0f172a" roughness={0.5} />
        </mesh>
      ))}

      {/* Tank Top Lid */}
      <mesh position={[0, hasStand ? 1.43 : 0.93, 0]} castShadow>
        <cylinderGeometry args={[0.25, 0.28, 0.08, 16]} />
        <meshStandardMaterial color="#eab308" roughness={0.4} />
      </mesh>

      {/* Overflow / Inflow PVC Pipe */}
      <mesh position={[0.42, hasStand ? 0.9 : 0.4, 0.2]} rotation={[0, 0, -Math.PI / 4]}>
        <cylinderGeometry args={[0.03, 0.03, 0.35, 8]} />
        <meshStandardMaterial color="#cbd5e1" roughness={0.5} />
      </mesh>
    </group>
  );
};

/**
 * Rooftop Satellite Dish Antenna (Dish TV / Tata Play style)
 */
export const DishAntenna: React.FC<{
  position?: [number, number, number];
  rotation?: [number, number, number];
  scale?: number;
}> = ({ position = [0, 0, 0], rotation = [0, 0, 0], scale = 1 }) => {
  return (
    <group position={position} rotation={rotation} scale={scale}>
      {/* Base Mounting Bracket on roof */}
      <mesh position={[0, 0.05, 0]} castShadow>
        <boxGeometry args={[0.3, 0.08, 0.3]} />
        <meshStandardMaterial color="#334155" roughness={0.8} metalness={0.5} />
      </mesh>

      {/* Angled Metal Support Pole */}
      <mesh position={[0, 0.45, -0.05]} rotation={[0.25, 0, 0]} castShadow>
        <cylinderGeometry args={[0.025, 0.025, 0.9, 12]} />
        <meshStandardMaterial color="#475569" roughness={0.6} metalness={0.7} />
      </mesh>

      {/* Curved Parabolic Dish */}
      <group position={[0, 0.85, 0.1]} rotation={[-0.45, 0, 0]}>
        <mesh castShadow>
          <sphereGeometry args={[0.48, 20, 12, 0, Math.PI * 2, 0, Math.PI * 0.4]} />
          <meshStandardMaterial color="#e2e8f0" roughness={0.4} metalness={0.2} side={THREE.DoubleSide} />
        </mesh>

        {/* LNB Arm & Receiver Feed */}
        <mesh position={[0, 0.2, 0.38]} rotation={[0.6, 0, 0]} castShadow>
          <cylinderGeometry args={[0.015, 0.015, 0.45, 8]} />
          <meshStandardMaterial color="#334155" roughness={0.5} />
        </mesh>
        <mesh position={[0, 0.35, 0.48]} castShadow>
          <cylinderGeometry args={[0.045, 0.04, 0.1, 10]} />
          <meshStandardMaterial color="#0f172a" roughness={0.3} />
        </mesh>
      </group>
    </group>
  );
};

/**
 * Iconic Exposed Concrete Column Extension with Rusted Iron Rebars (Sariya)
 */
export const ExposedRebars: React.FC<{
  position?: [number, number, number];
}> = ({ position = [0, 0, 0] }) => {
  const rebarOffsets = useMemo(
    () => [
      [-0.1, -0.1, 0.45, 0.05],
      [0.1, -0.1, 0.55, -0.04],
      [-0.1, 0.1, 0.4, 0.03],
      [0.1, 0.1, 0.5, -0.06],
    ],
    []
  );

  return (
    <group position={position}>
      {/* Unfinished Concrete Column Stub */}
      <mesh position={[0, 0.2, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.35, 0.4, 0.35]} />
        <meshStandardMaterial color="#94a3b8" roughness={0.95} />
      </mesh>

      {/* Exposed Rusted Iron Rods (Rebars) */}
      {rebarOffsets.map(([x, z, height, bend], idx) => (
        <group key={idx} position={[x, 0.4, z]}>
          <mesh position={[bend * 0.5, height / 2, 0]} rotation={[0, 0, bend]} castShadow>
            <cylinderGeometry args={[0.015, 0.015, height, 6]} />
            <meshStandardMaterial color="#78350f" roughness={0.9} metalness={0.4} />
          </mesh>
          {/* Hooked/Bent top */}
          <mesh position={[bend * 1.5, height, 0]} rotation={[0, 0, bend * 3]}>
            <cylinderGeometry args={[0.014, 0.014, 0.08, 6]} />
            <meshStandardMaterial color="#581c87" roughness={0.9} />
          </mesh>
        </group>
      ))}
    </group>
  );
};

/**
 * Rustic Wooden Ladder
 */
export const WoodenLadder: React.FC<{
  position?: [number, number, number];
  rotation?: [number, number, number];
  height?: number;
}> = ({ position = [0, 0, 0], rotation = [0, 0, 0], height = 2.2 }) => {
  const woodTexture = useMemo(() => createWeatheredWoodTexture('#a16207', '#451a03'), []);
  const rungCount = Math.floor(height / 0.32);

  return (
    <group position={position} rotation={rotation}>
      {/* Left Stringer */}
      <mesh position={[-0.22, height / 2, 0]} castShadow>
        <boxGeometry args={[0.05, height, 0.06]} />
        <meshStandardMaterial map={woodTexture} roughness={0.85} />
      </mesh>

      {/* Right Stringer */}
      <mesh position={[0.22, height / 2, 0]} castShadow>
        <boxGeometry args={[0.05, height, 0.06]} />
        <meshStandardMaterial map={woodTexture} roughness={0.85} />
      </mesh>

      {/* Rungs */}
      {Array.from({ length: rungCount }).map((_, i) => (
        <mesh key={i} position={[0, (i + 1) * 0.3, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
          <cylinderGeometry args={[0.022, 0.022, 0.44, 8]} />
          <meshStandardMaterial map={woodTexture} roughness={0.9} />
        </mesh>
      ))}
    </group>
  );
};

/**
 * Vintage Wooden Door with rustic distressed paint & iron knocker
 */
export const RusticDoor: React.FC<{
  position?: [number, number, number];
  rotation?: [number, number, number];
  paintColor?: string;
}> = ({ position = [0, 0, 0], rotation = [0, 0, 0], paintColor = '#bae6fd' }) => {
  const doorWood = useMemo(() => createWeatheredWoodTexture(paintColor, '#451a03'), [paintColor]);

  return (
    <group position={position} rotation={rotation}>
      {/* Outer Concrete / Wood Doorframe */}
      <mesh position={[0, 1.1, -0.02]} castShadow receiveShadow>
        <boxGeometry args={[1.15, 2.25, 0.1]} />
        <meshStandardMaterial color="#64748b" roughness={0.9} />
      </mesh>

      {/* Door Leaf (Vertical Planks) */}
      <mesh position={[0, 1.08, 0.02]} castShadow receiveShadow>
        <boxGeometry args={[0.95, 2.1, 0.05]} />
        <meshStandardMaterial map={doorWood} roughness={0.8} />
      </mesh>

      {/* Door Lintel Lamp / Bulb */}
      <mesh position={[0, 2.3, 0.08]} castShadow>
        <boxGeometry args={[0.1, 0.12, 0.08]} />
        <meshStandardMaterial color="#f8fafc" roughness={0.3} emissive="#fef08a" emissiveIntensity={0.2} />
      </mesh>

      {/* Metal Latch (Kundi) & Handle */}
      <mesh position={[0.38, 1.05, 0.06]} castShadow>
        <cylinderGeometry args={[0.015, 0.015, 0.18, 8]} />
        <meshStandardMaterial color="#1c1917" metalness={0.8} roughness={0.4} />
      </mesh>
      <mesh position={[0.38, 1.05, 0.08]}>
        <torusGeometry args={[0.035, 0.008, 6, 12]} />
        <meshStandardMaterial color="#1c1917" metalness={0.8} roughness={0.4} />
      </mesh>
    </group>
  );
};

/**
 * Vintage Window with Ornamental Diamond Iron Security Grill (Jaali)
 */
export const WindowWithGrill: React.FC<{
  position?: [number, number, number];
  rotation?: [number, number, number];
}> = ({ position = [0, 0, 0], rotation = [0, 0, 0] }) => {
  return (
    <group position={position} rotation={rotation}>
      {/* Frame Border */}
      <mesh castShadow receiveShadow>
        <boxGeometry args={[0.85, 0.95, 0.08]} />
        <meshStandardMaterial color="#475569" roughness={0.9} />
      </mesh>

      {/* Glass / Dark Recess */}
      <mesh position={[0, 0, -0.01]}>
        <planeGeometry args={[0.72, 0.82]} />
        <meshStandardMaterial color="#090d16" roughness={0.2} metalness={0.8} />
      </mesh>

      {/* Ornamental Iron Grill Diamond Lattice */}
      {[-0.22, -0.07, 0.07, 0.22].map((x, i) => (
        <mesh key={`v-${i}`} position={[x, 0, 0.03]} castShadow>
          <cylinderGeometry args={[0.008, 0.008, 0.8, 6]} />
          <meshStandardMaterial color="#1e293b" metalness={0.7} roughness={0.4} />
        </mesh>
      ))}
      {[-0.25, -0.08, 0.08, 0.25].map((y, i) => (
        <mesh key={`h-${i}`} position={[0, y, 0.03]} rotation={[0, 0, Math.PI / 2]} castShadow>
          <cylinderGeometry args={[0.008, 0.008, 0.7, 6]} />
          <meshStandardMaterial color="#1e293b" metalness={0.7} roughness={0.4} />
        </mesh>
      ))}
    </group>
  );
};

/**
 * Tarpaulin (Tirpal) Sheet Overhang with organic folds
 */
export const TarpaulinCover: React.FC<{
  position?: [number, number, number];
  width?: number;
  depth?: number;
}> = ({ position = [0, 0, 0], width = 3.6, depth = 3.2 }) => {
  const tarpTexture = useMemo(() => createTarpaulinTexture('#334155'), []);

  return (
    <group position={position}>
      {/* Main Top Roof Sheet */}
      <mesh position={[0, 0.05, 0]} rotation={[-Math.PI / 2, 0, 0]} castShadow receiveShadow>
        <planeGeometry args={[width, depth]} />
        <meshStandardMaterial map={tarpTexture} roughness={0.8} side={THREE.DoubleSide} />
      </mesh>

      {/* Drooping Overhang Edges */}
      <mesh position={[0, -0.15, depth / 2]} castShadow>
        <planeGeometry args={[width, 0.4]} />
        <meshStandardMaterial map={tarpTexture} roughness={0.85} side={THREE.DoubleSide} />
      </mesh>

      <mesh position={[-width / 2, -0.15, 0]} rotation={[0, Math.PI / 2, 0]} castShadow>
        <planeGeometry args={[depth, 0.4]} />
        <meshStandardMaterial map={tarpTexture} roughness={0.85} side={THREE.DoubleSide} />
      </mesh>

      {/* Corner Tie Ropes */}
      {[-width / 2, width / 2].map((x, i) => (
        <mesh key={i} position={[x, -0.4, depth / 2]} rotation={[0.4, 0, (i === 0 ? 1 : -1) * 0.2]}>
          <cylinderGeometry args={[0.008, 0.008, 0.9, 6]} />
          <meshStandardMaterial color="#e2e8f0" roughness={0.9} />
        </mesh>
      ))}
    </group>
  );
};

/**
 * PVC / GI Downspout Drain Pipe with hanging bottles
 */
export const DrainPipeWithBottles: React.FC<{
  position?: [number, number, number];
  height?: number;
}> = ({ position = [0, 0, 0], height = 3.0 }) => {
  return (
    <group position={position}>
      {/* Vertical Pipe */}
      <mesh position={[0, height / 2, 0]} castShadow>
        <cylinderGeometry args={[0.06, 0.06, height, 12]} />
        <meshStandardMaterial color="#94a3b8" roughness={0.6} />
      </mesh>

      {/* Pipe Wall Clamps */}
      {[0.5, height / 2, height - 0.4].map((y, idx) => (
        <mesh key={idx} position={[0, y, -0.04]}>
          <boxGeometry args={[0.16, 0.04, 0.08]} />
          <meshStandardMaterial color="#334155" roughness={0.5} />
        </mesh>
      ))}

      {/* Hanging plastic oil/water containers */}
      <group position={[0.15, height - 0.9, 0.08]}>
        {/* Rope */}
        <mesh position={[0, 0.15, 0]}>
          <cylinderGeometry args={[0.005, 0.005, 0.3, 4]} />
          <meshStandardMaterial color="#facc15" />
        </mesh>
        {/* Orange Can 1 */}
        <mesh position={[-0.04, 0, 0]} rotation={[0.1, 0, 0.15]} castShadow>
          <boxGeometry args={[0.14, 0.22, 0.1]} />
          <meshStandardMaterial color="#ea580c" roughness={0.4} />
        </mesh>
        {/* Orange Can 2 */}
        <mesh position={[0.06, -0.05, 0.02]} rotation={[-0.1, 0, -0.1]} castShadow>
          <boxGeometry args={[0.13, 0.2, 0.09]} />
          <meshStandardMaterial color="#f97316" roughness={0.4} />
        </mesh>
      </group>
    </group>
  );
};

/**
 * Vintage Scooter / Moped (Classic Indian Bajaj Chetak / Luna style)
 */
export const VintageScooter: React.FC<{
  position?: [number, number, number];
  rotation?: [number, number, number];
  scale?: number;
  color?: string;
}> = ({ position = [0, 0, 0], rotation = [0, 0, 0], scale = 1, color = '#3b82f6' }) => {
  return (
    <group position={position} rotation={rotation} scale={scale}>
      {/* Wheels */}
      <mesh position={[-0.5, 0.22, 0]} rotation={[Math.PI / 2, 0, 0]} castShadow>
        <torusGeometry args={[0.2, 0.05, 10, 20]} />
        <meshStandardMaterial color="#1e293b" roughness={0.9} />
      </mesh>
      <mesh position={[0.5, 0.22, 0]} rotation={[Math.PI / 2, 0, 0]} castShadow>
        <torusGeometry args={[0.2, 0.05, 10, 20]} />
        <meshStandardMaterial color="#1e293b" roughness={0.9} />
      </mesh>

      {/* Frame / Body */}
      <mesh position={[0, 0.35, 0]} castShadow>
        <boxGeometry args={[0.9, 0.25, 0.25]} />
        <meshStandardMaterial color={color} roughness={0.4} metalness={0.3} />
      </mesh>

      {/* Rear Engine Cover Cowl */}
      <mesh position={[-0.35, 0.38, 0]} castShadow>
        <sphereGeometry args={[0.22, 12, 10]} />
        <meshStandardMaterial color={color} roughness={0.4} />
      </mesh>

      {/* Seat */}
      <mesh position={[-0.15, 0.52, 0]} castShadow>
        <boxGeometry args={[0.5, 0.08, 0.22]} />
        <meshStandardMaterial color="#78350f" roughness={0.8} />
      </mesh>

      {/* Handlebar & Headlight */}
      <mesh position={[0.42, 0.72, 0]} rotation={[0, 0, -0.2]} castShadow>
        <cylinderGeometry args={[0.02, 0.02, 0.7, 8]} />
        <meshStandardMaterial color="#94a3b8" metalness={0.8} />
      </mesh>
      <mesh position={[0.38, 0.95, 0]} rotation={[Math.PI / 2, 0, 0]} castShadow>
        <cylinderGeometry args={[0.02, 0.02, 0.5, 8]} />
        <meshStandardMaterial color="#94a3b8" metalness={0.8} />
      </mesh>
      <mesh position={[0.48, 0.95, 0]} rotation={[0, Math.PI / 2, 0]} castShadow>
        <sphereGeometry args={[0.08, 12, 12]} />
        <meshStandardMaterial color="#f8fafc" roughness={0.1} emissive="#fef08a" emissiveIntensity={0.2} />
      </mesh>
    </group>
  );
};

/**
 * Terrace Props: Wooden storage box, globe, books, earthen matka pot, plant pot, broom
 */
export const TerraceClutter: React.FC<{
  position?: [number, number, number];
  rotation?: [number, number, number];
}> = ({ position = [0, 0, 0], rotation = [0, 0, 0] }) => {
  const woodTexture = useMemo(() => createWeatheredWoodTexture('#78350f', '#451a03'), []);

  return (
    <group position={position} rotation={rotation}>
      {/* Wooden Storage Crate */}
      <mesh position={[0, 0.25, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.9, 0.5, 0.5]} />
        <meshStandardMaterial map={woodTexture} roughness={0.85} />
      </mesh>

      {/* Books on crate */}
      <mesh position={[-0.2, 0.54, 0]} rotation={[0, 0.2, 0]} castShadow>
        <boxGeometry args={[0.22, 0.06, 0.16]} />
        <meshStandardMaterial color="#dc2626" />
      </mesh>
      <mesh position={[-0.18, 0.58, 0]} rotation={[0, -0.1, 0]} castShadow>
        <boxGeometry args={[0.2, 0.05, 0.15]} />
        <meshStandardMaterial color="#0284c7" />
      </mesh>

      {/* Vintage Globe on crate */}
      <group position={[0.2, 0.65, 0]}>
        <mesh castShadow>
          <sphereGeometry args={[0.12, 16, 12]} />
          <meshStandardMaterial color="#0d9488" roughness={0.4} />
        </mesh>
        <mesh position={[0, -0.1, 0]}>
          <cylinderGeometry args={[0.06, 0.08, 0.08, 12]} />
          <meshStandardMaterial color="#a16207" metalness={0.6} />
        </mesh>
      </group>

      {/* Earthen Clay Matka / Surahi Water Pot */}
      <group position={[0.7, 0.2, 0.1]}>
        <mesh castShadow>
          <sphereGeometry args={[0.18, 16, 14]} />
          <meshStandardMaterial color="#b45309" roughness={0.9} />
        </mesh>
        <mesh position={[0, 0.16, 0]} castShadow>
          <cylinderGeometry args={[0.08, 0.06, 0.1, 12]} />
          <meshStandardMaterial color="#92400e" roughness={0.9} />
        </mesh>
      </group>

      {/* Potted Tulsi / Green Planter */}
      <group position={[-0.7, 0.2, 0.1]}>
        {/* Pot */}
        <mesh position={[0, 0.1, 0]} castShadow>
          <cylinderGeometry args={[0.18, 0.14, 0.25, 12]} />
          <meshStandardMaterial color="#c2410c" roughness={0.8} />
        </mesh>
        {/* Bushy leaves */}
        <mesh position={[0, 0.3, 0]} castShadow>
          <dodecahedronGeometry args={[0.22, 1]} />
          <meshStandardMaterial color="#15803d" roughness={0.9} />
        </mesh>
      </group>

      {/* Traditional Indian Broom (Jhadu) leaning */}
      <group position={[1.1, 0.5, -0.1]} rotation={[0.2, 0, 0.35]}>
        <mesh castShadow>
          <cylinderGeometry args={[0.04, 0.01, 1.1, 8]} />
          <meshStandardMaterial color="#d97706" roughness={0.9} />
        </mesh>
      </group>
    </group>
  );
};

/**
 * Hanging Clothesline with swaying colourful clothes
 */
export const Clothesline: React.FC<{
  position?: [number, number, number];
  length?: number;
}> = ({ position = [0, 0, 0], length = 3.5 }) => {
  const clothes = [
    { offset: -1.0, color: '#f43f5e', w: 0.5, h: 0.7 },
    { offset: -0.2, color: '#0ea5e9', w: 0.45, h: 0.6 },
    { offset: 0.6, color: '#eab308', w: 0.6, h: 0.55 },
  ];

  return (
    <group position={position}>
      {/* The wire string */}
      <mesh position={[0, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.004, 0.004, length, 6]} />
        <meshStandardMaterial color="#475569" roughness={0.8} />
      </mesh>

      {/* Hanging fabrics */}
      {clothes.map((c, i) => (
        <group key={i} position={[c.offset, -c.h / 2, 0]}>
          <mesh castShadow>
            <planeGeometry args={[c.w, c.h]} />
            <meshStandardMaterial color={c.color} roughness={0.9} side={THREE.DoubleSide} />
          </mesh>
          {/* Pegs/Clips */}
          <mesh position={[-c.w / 4, c.h / 2 + 0.02, 0]}>
            <boxGeometry args={[0.02, 0.05, 0.02]} />
            <meshStandardMaterial color="#475569" />
          </mesh>
          <mesh position={[c.w / 4, c.h / 2 + 0.02, 0]}>
            <boxGeometry args={[0.02, 0.05, 0.02]} />
            <meshStandardMaterial color="#475569" />
          </mesh>
        </group>
      ))}
    </group>
  );
};

/**
 * Iconic Desert Air Cooler (Cooled metal box with exhaust fan)
 */
export const DesertAirCooler: React.FC<{
  position?: [number, number, number];
  rotation?: [number, number, number];
}> = ({ position = [0, 0, 0], rotation = [0, 0, 0] }) => {
  return (
    <group position={position} rotation={rotation}>
      {/* Main Steel Box */}
      <mesh position={[0, 0.45, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.7, 0.8, 0.7]} />
        <meshStandardMaterial color="#94a3b8" roughness={0.4} metalness={0.7} />
      </mesh>

      {/* Blue Plastic Fan Front Grill */}
      <mesh position={[0, 0.45, 0.36]} rotation={[Math.PI / 2, 0, 0]} castShadow>
        <cylinderGeometry args={[0.26, 0.26, 0.04, 16]} />
        <meshStandardMaterial color="#0284c7" roughness={0.5} />
      </mesh>

      {/* Side Grass Mats */}
      <mesh position={[-0.36, 0.45, 0]} rotation={[0, Math.PI / 2, 0]}>
        <planeGeometry args={[0.55, 0.65]} />
        <meshStandardMaterial color="#a16207" roughness={0.95} />
      </mesh>
      <mesh position={[0.36, 0.45, 0]} rotation={[0, -Math.PI / 2, 0]}>
        <planeGeometry args={[0.55, 0.65]} />
        <meshStandardMaterial color="#a16207" roughness={0.95} />
      </mesh>
    </group>
  );
};

/**
 * Split AC Outdoor Compressor Unit with Wall Mount Brackets
 */
export const ACUnit: React.FC<{
  position?: [number, number, number];
  rotation?: [number, number, number];
}> = ({ position = [0, 0, 0], rotation = [0, 0, 0] }) => {
  return (
    <group position={position} rotation={rotation}>
      {/* Wall Mounting Metal L-Brackets */}
      {[-0.35, 0.35].map((x, i) => (
        <group key={i} position={[x, -0.2, 0]}>
          <mesh position={[0, 0, 0]} castShadow>
            <boxGeometry args={[0.04, 0.04, 0.4]} />
            <meshStandardMaterial color="#334155" roughness={0.6} metalness={0.8} />
          </mesh>
          <mesh position={[0, -0.15, -0.18]} castShadow>
            <boxGeometry args={[0.04, 0.3, 0.04]} />
            <meshStandardMaterial color="#334155" roughness={0.6} metalness={0.8} />
          </mesh>
        </group>
      ))}

      {/* Main Compressor White/Off-White Box */}
      <mesh position={[0, 0.1, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.85, 0.55, 0.32]} />
        <meshStandardMaterial color="#e2e8f0" roughness={0.5} metalness={0.2} />
      </mesh>

      {/* Front Circular Exhaust Fan Grill */}
      <mesh position={[0.15, 0.1, 0.165]} rotation={[Math.PI / 2, 0, 0]} castShadow>
        <cylinderGeometry args={[0.18, 0.18, 0.02, 16]} />
        <meshStandardMaterial color="#475569" roughness={0.4} metalness={0.6} />
      </mesh>

      {/* Brand Badge */}
      <mesh position={[-0.25, 0.22, 0.165]}>
        <boxGeometry args={[0.16, 0.04, 0.01]} />
        <meshStandardMaterial color="#1e293b" roughness={0.3} />
      </mesh>

      {/* Insulated Piping */}
      <mesh position={[-0.36, -0.05, 0]} rotation={[0, 0, Math.PI / 3]}>
        <cylinderGeometry args={[0.02, 0.02, 0.3, 8]} />
        <meshStandardMaterial color="#334155" roughness={0.8} />
      </mesh>
    </group>
  );
};

// Re-export production-grade Nature Props (SmallTree, LargeTree, PottedPlant, Bush, GrassPatch, FallenLeaves)
export * from './NatureProps';
