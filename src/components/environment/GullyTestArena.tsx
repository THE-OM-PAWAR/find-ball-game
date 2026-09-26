import React, { useMemo, useEffect } from 'react';
import * as THREE from 'three';
import { BajajChetakScooter } from '../../studio/components/3d/vehicles/BajajChetakScooter';
import { ParkedGullyCar } from '../../studio/components/3d/vehicles/ParkedGullyCar';
import { IndianPushCart } from '../../studio/components/3d/vehicles/IndianPushCart';
import { IndianGarbageBins } from '../../studio/components/3d/vehicles/IndianGarbageBins';
import { SingleStoryStairHouse } from '../../studio/components/3d/houses/SingleStoryStairHouse';
import { TwoStoryShopComplex } from '../../studio/components/3d/houses/TwoStoryShopComplex';
import type { CollisionCollider } from '../player/PlayerPhysics';

interface GullyTestArenaProps {
  onCollidersReady?: (colliders: CollisionCollider[]) => void;
}

export const GullyTestArena: React.FC<GullyTestArenaProps> = ({ onCollidersReady }) => {
  // Define environment collision boundaries
  const colliders: CollisionCollider[] = useMemo(() => {
    return [
      // 1. Single-Story House Body (Left side: X = -6.5, Z = 0)
      {
        type: 'box',
        min: new THREE.Vector3(-10.0, 0, -3.5),
        max: new THREE.Vector3(-3.0, 3.8, 3.5),
      },
      // 2. Two-Story Shop Complex (Right side: X = 7.0, Z = -1.0)
      {
        type: 'box',
        min: new THREE.Vector3(3.5, 0, -5.0),
        max: new THREE.Vector3(10.5, 6.8, 3.0),
      },
      // 3. Parked Gully Car (X = -1.8, Z = -4.5)
      {
        type: 'box',
        min: new THREE.Vector3(-2.8, 0, -6.5),
        max: new THREE.Vector3(-0.8, 1.6, -2.5),
      },
      // 4. Parked Scooter (X = 1.8, Z = 2.4)
      {
        type: 'box',
        min: new THREE.Vector3(1.3, 0, 1.8),
        max: new THREE.Vector3(2.3, 1.3, 3.0),
      },
      // 5. Sabzi Push Cart (X = 2.2, Z = -3.2)
      {
        type: 'box',
        min: new THREE.Vector3(1.4, 0, -4.2),
        max: new THREE.Vector3(3.0, 1.8, -2.2),
      },
      // 6. Municipal Garbage Bins (X = -2.2, Z = 4.2)
      {
        type: 'box',
        min: new THREE.Vector3(-2.8, 0, 3.6),
        max: new THREE.Vector3(-1.6, 1.2, 4.8),
      },
      // 7. Wickets / Stumps (X = 0, Z = -3.8)
      {
        type: 'cylinder',
        center: new THREE.Vector3(0, 0.36, -3.8),
        radius: 0.15,
        height: 0.72,
      },
      // 8. Test Step 1 (Climbable Curb: Height 0.18m)
      {
        type: 'box',
        min: new THREE.Vector3(-4.0, 0, 6.0),
        max: new THREE.Vector3(-1.0, 0.18, 8.5),
      },
      // 9. Test Step 2 (Higher Stair: Height 0.35m)
      {
        type: 'box',
        min: new THREE.Vector3(-4.0, 0.18, 7.2),
        max: new THREE.Vector3(-1.0, 0.35, 8.5),
      },
      // 10. Test Slope Ramp Block (X = 2.5, Z = 6.5)
      {
        type: 'box',
        min: new THREE.Vector3(1.0, 0, 6.0),
        max: new THREE.Vector3(3.5, 0.6, 9.0),
      },
    ];
  }, []);

  useEffect(() => {
    if (onCollidersReady) {
      onCollidersReady(colliders);
    }
  }, [colliders, onCollidersReady]);

  return (
    <group position={[0, 0, 0]}>
      {/* 1. MAIN ASPHALT GULLY ROAD (28m x 28m) */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow position={[0, -0.01, 0]}>
        <planeGeometry args={[28, 28]} />
        <meshStandardMaterial color="#22262d" roughness={0.9} metalness={0.05} />
      </mesh>

      {/* Road Drainage Gutters / Curbs */}
      <mesh position={[-3.1, 0.05, 0]} receiveShadow castShadow>
        <boxGeometry args={[0.3, 0.12, 28]} />
        <meshStandardMaterial color="#475569" roughness={0.8} />
      </mesh>
      <mesh position={[3.3, 0.05, 0]} receiveShadow castShadow>
        <boxGeometry args={[0.3, 0.12, 28]} />
        <meshStandardMaterial color="#475569" roughness={0.8} />
      </mesh>

      {/* Sidewalk Concrete Slabs */}
      <mesh position={[-4.8, 0.08, 0]} receiveShadow>
        <boxGeometry args={[3.1, 0.16, 28]} />
        <meshStandardMaterial color="#334155" roughness={0.85} />
      </mesh>
      <mesh position={[5.0, 0.08, 0]} receiveShadow>
        <boxGeometry args={[3.1, 0.16, 28]} />
        <meshStandardMaterial color="#334155" roughness={0.85} />
      </mesh>

      {/* 2. CRICKET PITCH MARKINGS & CREASES */}
      {/* Pitch Matting / Dirt Strip */}
      <mesh position={[0, 0.001, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[1.8, 14]} />
        <meshStandardMaterial color="#3f3b33" roughness={0.95} />
      </mesh>
      {/* Batsman Popping Crease (White Line) */}
      <mesh position={[0, 0.004, 0.25]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[1.8, 0.05]} />
        <meshStandardMaterial color="#f8fafc" roughness={0.4} />
      </mesh>
      {/* Bowler Crease at far end */}
      <mesh position={[0, 0.004, 8.0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[1.8, 0.05]} />
        <meshStandardMaterial color="#f8fafc" roughness={0.4} />
      </mesh>

      {/* Gully Wooden Wickets behind Batsman */}
      <group position={[0, 0, -3.8]}>
        {[-0.08, 0, 0.08].map((x, i) => (
          <mesh key={`stump-${i}`} position={[x, 0.36, 0]} castShadow>
            <cylinderGeometry args={[0.016, 0.016, 0.72, 8]} />
            <meshStandardMaterial color="#d4a373" roughness={0.7} />
          </mesh>
        ))}
        {/* Horizontal Bails */}
        <mesh position={[-0.04, 0.725, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.007, 0.007, 0.09, 6]} />
          <meshStandardMaterial color="#faedcd" roughness={0.6} />
        </mesh>
        <mesh position={[0.04, 0.725, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.007, 0.007, 0.09, 6]} />
          <meshStandardMaterial color="#faedcd" roughness={0.6} />
        </mesh>
      </group>

      {/* 3. SURROUNDING ENVIRONMENT HOUSES & BUILDINGS */}
      {/* Left House */}
      <group position={[-6.5, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
        <SingleStoryStairHouse />
      </group>

      {/* Right 2-Story Shop Complex */}
      <group position={[7.0, 0, -1.0]} rotation={[0, -Math.PI / 2, 0]}>
        <TwoStoryShopComplex />
      </group>

      {/* 4. PARKED VEHICLES & STREET PROPS (COLLIDABLE OBSTACLES) */}
      {/* Parked Gully Car */}
      <group position={[-1.8, 0, -4.5]} rotation={[0, 0.15, 0]}>
        <ParkedGullyCar />
      </group>

      {/* Bajaj Chetak Scooter */}
      <group position={[1.8, 0, 2.4]} rotation={[0, -0.4, 0]}>
        <BajajChetakScooter />
      </group>

      {/* Fruit / Sabzi Push Cart */}
      <group position={[2.2, 0, -3.2]} rotation={[0, -Math.PI / 2, 0]}>
        <IndianPushCart />
      </group>

      {/* Municipal Garbage Bins */}
      <group position={[-2.2, 0, 4.2]} rotation={[0, 0.3, 0]}>
        <IndianGarbageBins />
      </group>

      {/* 5. INTERACTIVE STEP & SLOPE TESTING OBSTACLE COURSE */}
      {/* Step Climbing Test Area */}
      <group position={[-2.5, 0, 7.2]}>
        {/* Step 1 (0.18m curb) */}
        <mesh position={[0, 0.09, -0.6]} castShadow receiveShadow>
          <boxGeometry args={[3.0, 0.18, 1.2]} />
          <meshStandardMaterial color="#64748b" roughness={0.7} />
        </mesh>
        {/* Step 2 (0.35m stair) */}
        <mesh position={[0, 0.265, 0.6]} castShadow receiveShadow>
          <boxGeometry args={[3.0, 0.35, 1.2]} />
          <meshStandardMaterial color="#475569" roughness={0.7} />
        </mesh>
        {/* Sign Label */}
        <mesh position={[0, 0.7, 1.2]} rotation={[0, Math.PI, 0]}>
          <planeGeometry args={[1.4, 0.3]} />
          <meshBasicMaterial color="#0284c7" />
        </mesh>
      </group>

      {/* Sloped Ramp Test Area (22 degree incline) */}
      <group position={[2.25, 0, 7.5]} rotation={[-0.25, 0, 0]}>
        <mesh position={[0, 0.2, 0]} castShadow receiveShadow>
          <boxGeometry args={[2.5, 0.15, 3.2]} />
          <meshStandardMaterial color="#0d9488" roughness={0.65} />
        </mesh>
      </group>

      {/* Street Lighting Poles */}
      <group position={[-3.3, 0, 3.5]}>
        <mesh position={[0, 2.5, 0]} castShadow>
          <cylinderGeometry args={[0.06, 0.08, 5.0, 8]} />
          <meshStandardMaterial color="#334155" metalness={0.8} roughness={0.3} />
        </mesh>
        <mesh position={[0.4, 4.9, 0]} rotation={[0, 0, -0.3]}>
          <cylinderGeometry args={[0.04, 0.04, 1.0, 8]} />
          <meshStandardMaterial color="#334155" metalness={0.8} />
        </mesh>
        {/* Street Light Luminaire */}
        <mesh position={[0.8, 4.7, 0]}>
          <boxGeometry args={[0.4, 0.1, 0.2]} />
          <meshStandardMaterial color="#fef08a" emissive="#fef08a" emissiveIntensity={1.2} />
        </mesh>
      </group>
    </group>
  );
};
