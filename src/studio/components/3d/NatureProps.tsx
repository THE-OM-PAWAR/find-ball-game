import React, { useMemo } from 'react';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';

// Asset URLs
const GLB_BUSH = '/Fortnite_Bush.glb';
const GLB_GRASS = '/low_poly_grass_lods_1.glb';
const GLB_TREE_ELM = '/tree_elm.glb';
const GLB_TREE = '/tree.glb';
const GLB_TREE_LINDEN = '/tree_3d_model_linden_tree.glb';

// Preload assets for instantaneous rendering
try {
  useGLTF.preload(GLB_BUSH);
  useGLTF.preload(GLB_GRASS);
  useGLTF.preload(GLB_TREE_ELM);
  useGLTF.preload(GLB_TREE);
  useGLTF.preload(GLB_TREE_LINDEN);
} catch (e) {
  // Graceful handling
}

// =========================================================================
// 1. SMALL TREE (Using tree.glb - realistic 4.0m to 5.0m garden tree)
// =========================================================================

export interface SmallTreeProps {
  position?: [number, number, number];
  rotation?: [number, number, number];
  scale?: number | [number, number, number];
  variant?: string;
  hasFallenLeaves?: boolean;
  foliageColor?: string;
}

export const SmallTree: React.FC<SmallTreeProps> = ({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = 1,
  hasFallenLeaves = true,
}) => {
  const { scene } = useGLTF(GLB_TREE);

  const finalScaleMultiplier = typeof scale === 'number' ? scale : scale[0];
  // Scaled to realistic 4.2m height
  const modelScale = 0.45 * finalScaleMultiplier;

  const cloned = useMemo(() => {
    const clone = scene.clone(true);
    clone.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
    return clone;
  }, [scene]);

  const leafMat = useMemo(
    () => new THREE.MeshStandardMaterial({ color: '#ca8a04', roughness: 0.85, side: THREE.DoubleSide }),
    []
  );

  return (
    <group position={position} rotation={rotation}>
      {/* 3D Model Tree */}
      <group scale={modelScale} position={[0, 0, 0]}>
        <primitive object={cloned} />
      </group>

      {/* Base Fallen Leaf Scatter */}
      {hasFallenLeaves && (
        <group position={[0, 0.008, 0]}>
          {[
            { pos: [0.45, 0, 0.3], rot: 0.8, s: 0.11 },
            { pos: [-0.5, 0, -0.35], rot: -1.2, s: 0.12 },
            { pos: [0.2, 0, -0.55], rot: 2.1, s: 0.1 },
            { pos: [-0.35, 0, 0.5], rot: -0.4, s: 0.11 },
          ].map((l, i) => (
            <mesh
              key={i}
              position={l.pos as [number, number, number]}
              rotation={[-Math.PI / 2, 0, l.rot]}
              scale={[l.s, l.s * 1.8, 0.005]}
              material={leafMat}
            >
              <planeGeometry args={[1, 1]} />
            </mesh>
          ))}
        </group>
      )}
    </group>
  );
};

// =========================================================================
// 2. LARGE TREE (Using tree_elm.glb and tree_3d_model_linden_tree.glb - grand 7-8m canopy)
// =========================================================================

export interface LargeTreeProps {
  position?: [number, number, number];
  rotation?: [number, number, number];
  scale?: number | [number, number, number];
  variant?: 'elm' | 'linden';
  hasFlowers?: boolean;
  foliageColor?: string;
  blossomColor?: string;
}

export const LargeTree: React.FC<LargeTreeProps> = ({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = 1,
  variant = 'elm',
  hasFlowers = true,
  blossomColor = '#ea580c',
}) => {
  const isLinden = variant === 'linden';
  const { scene } = useGLTF(isLinden ? GLB_TREE_LINDEN : GLB_TREE_ELM);

  const finalScaleMultiplier = typeof scale === 'number' ? scale : scale[0];
  // Scaled to grand 7.5m - 8.0m height with majestic canopy
  const modelScale = (isLinden ? 0.42 : 0.46) * finalScaleMultiplier;

  const cloned = useMemo(() => {
    const clone = scene.clone(true);
    clone.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
    return clone;
  }, [scene]);

  return (
    <group position={position} rotation={rotation}>
      {/* 3D GLB Model Tree */}
      <group scale={modelScale} position={[0, 0, 0]}>
        <primitive object={cloned} />
      </group>

      {/* Ground Blossom Petal Scatter */}
      {hasFlowers && (
        <group position={[0, 0.008, 0]}>
          {[
            { pos: [1.2, 0, 0.9], rot: 0.4 },
            { pos: [-1.4, 0, 1.1], rot: -0.8 },
            { pos: [0.5, 0, -1.6], rot: 1.2 },
            { pos: [-0.9, 0, -1.3], rot: 2.3 },
            { pos: [1.8, 0, -0.5], rot: -1.5 },
            { pos: [-1.9, 0, -0.3], rot: 0.9 },
          ].map((p, i) => (
            <mesh key={i} position={p.pos as [number, number, number]} rotation={[-Math.PI / 2, 0, p.rot]}>
              <circleGeometry args={[0.26, 6]} />
              <meshStandardMaterial color={blossomColor} roughness={0.8} />
            </mesh>
          ))}
        </group>
      )}
    </group>
  );
};

// =========================================================================
// 3. BUSH (Using Fortnite_Bush.glb - scaled to natural ~0.55m height)
// =========================================================================

export interface BushProps {
  position?: [number, number, number];
  rotation?: [number, number, number];
  scale?: number | [number, number, number];
  variant?: string;
  flowerColor?: string;
}

export const Bush: React.FC<BushProps> = ({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = 1,
}) => {
  const { scene } = useGLTF(GLB_BUSH);

  const finalScaleMultiplier = typeof scale === 'number' ? scale : scale[0];
  // Natural garden bush scale: ~0.55m height, 0.85m diameter
  const modelScale = 0.55 * finalScaleMultiplier;

  const cloned = useMemo(() => {
    const clone = scene.clone(true);
    clone.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
    return clone;
  }, [scene]);

  return (
    <group position={position} rotation={rotation}>
      {/* Lower slightly by -0.06m to sit flush on soil ground */}
      <group scale={modelScale} position={[0, -0.06, 0]}>
        <primitive object={cloned} />
      </group>
    </group>
  );
};

// =========================================================================
// 4. GRASS PATCH (Using low_poly_grass_lods_1.glb - centered, upright & visible)
// =========================================================================

export interface GrassPatchProps {
  position?: [number, number, number];
  rotation?: [number, number, number];
  scale?: number | [number, number, number];
  radius?: number;
  bladeCount?: number;
}

export const GrassPatch: React.FC<GrassPatchProps> = ({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = 1,
}) => {
  const { scene } = useGLTF(GLB_GRASS);

  const finalScaleMultiplier = typeof scale === 'number' ? scale : scale[0];
  // Visible grass clump scale (~0.35m - 0.45m height)
  const modelScale = 0.35 * finalScaleMultiplier;

  const cloned = useMemo(() => {
    const clone = scene.clone(true);

    // Compute bounding box of grass LODs to center perfectly around origin (0, 0, 0)
    const box = new THREE.Box3().setFromObject(clone);
    const center = new THREE.Vector3();
    box.getCenter(center);
    const bottomY = box.min.y;

    // Center the geometry so roots sit at y=0 and center at x=0, z=0
    clone.position.set(-center.x, -bottomY, -center.z);

    clone.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
        const mesh = child as THREE.Mesh;
        if (mesh.material) {
          const mat = mesh.material as THREE.MeshStandardMaterial;
          mat.side = THREE.DoubleSide;
          mat.roughness = 0.7;
          // Boost green saturation if needed
          if (mat.color) {
            mat.color.set('#4ade80');
          }
        }
      }
    });

    const wrapper = new THREE.Group();
    wrapper.add(clone);
    return wrapper;
  }, [scene]);

  return (
    <group position={position} rotation={rotation}>
      <group scale={modelScale} position={[0, 0, 0]}>
        <primitive object={cloned} />
      </group>
    </group>
  );
};

// =========================================================================
// 5. POTTED PLANTS (Tulsi Vrindavan / Snake Plant / Money Plant / Hibiscus)
// =========================================================================

export interface PottedPlantProps {
  position?: [number, number, number];
  rotation?: [number, number, number];
  scale?: number | [number, number, number];
  plantType?: 'tulsi' | 'snake_plant' | 'money_plant' | 'flowering_hibiscus';
  potStyle?: 'terracotta' | 'ceramic_blue' | 'cement_grey' | 'white_glazed' | 'tulsi_vrindavan';
}

export const PottedPlant: React.FC<PottedPlantProps> = ({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = 1,
  plantType = 'tulsi',
  potStyle = 'tulsi_vrindavan',
}) => {
  const finalScale: [number, number, number] =
    typeof scale === 'number' ? [scale, scale, scale] : scale;

  // Materials
  const terracottaMat = useMemo(
    () => new THREE.MeshStandardMaterial({ color: '#c25e36', roughness: 0.85, metalness: 0.02 }),
    []
  );
  const ceramicBlueMat = useMemo(
    () => new THREE.MeshStandardMaterial({ color: '#1e3a8a', roughness: 0.25, metalness: 0.1 }),
    []
  );
  const cementMat = useMemo(
    () => new THREE.MeshStandardMaterial({ color: '#9ca3af', roughness: 0.9, metalness: 0.05 }),
    []
  );
  const whiteGlazeMat = useMemo(
    () => new THREE.MeshStandardMaterial({ color: '#f8fafc', roughness: 0.2, metalness: 0.05 }),
    []
  );
  const vrindavanMat = useMemo(
    () => new THREE.MeshStandardMaterial({ color: '#d97706', roughness: 0.8, metalness: 0.02 }),
    []
  );
  const soilMat = useMemo(
    () => new THREE.MeshStandardMaterial({ color: '#271b12', roughness: 0.98 }),
    []
  );

  // Plant Materials
  const tulsiGreenMat = useMemo(
    () => new THREE.MeshStandardMaterial({ color: '#15803d', roughness: 0.6, metalness: 0.02 }),
    []
  );
  const tulsiManjariMat = useMemo(
    () => new THREE.MeshStandardMaterial({ color: '#581c87', roughness: 0.5 }),
    []
  );
  const snakePlantBodyMat = useMemo(
    () => new THREE.MeshStandardMaterial({ color: '#14532d', roughness: 0.5 }),
    []
  );
  const snakePlantEdgeMat = useMemo(
    () => new THREE.MeshStandardMaterial({ color: '#facc15', roughness: 0.5 }),
    []
  );
  const moneyPlantMat = useMemo(
    () => new THREE.MeshStandardMaterial({ color: '#22c55e', roughness: 0.45 }),
    []
  );
  const moneyVariegatedMat = useMemo(
    () => new THREE.MeshStandardMaterial({ color: '#a3e635', roughness: 0.45 }),
    []
  );
  const coirPoleMat = useMemo(
    () => new THREE.MeshStandardMaterial({ color: '#78350f', roughness: 0.95 }),
    []
  );
  const hibiscusLeafMat = useMemo(
    () => new THREE.MeshStandardMaterial({ color: '#166534', roughness: 0.4 }),
    []
  );
  const hibiscusFlowerMat = useMemo(
    () => new THREE.MeshStandardMaterial({ color: '#dc2626', roughness: 0.35 }),
    []
  );
  const hibiscusStamenMat = useMemo(
    () => new THREE.MeshStandardMaterial({ color: '#fbbf24', roughness: 0.3 }),
    []
  );

  const activePotMat =
    potStyle === 'ceramic_blue'
      ? ceramicBlueMat
      : potStyle === 'cement_grey'
      ? cementMat
      : potStyle === 'white_glazed'
      ? whiteGlazeMat
      : potStyle === 'tulsi_vrindavan'
      ? vrindavanMat
      : terracottaMat;

  return (
    <group position={position} rotation={rotation} scale={finalScale}>
      {/* 1. POT / PLANTER CONTAINER */}
      {potStyle === 'tulsi_vrindavan' || (plantType === 'tulsi' && potStyle === 'terracotta') ? (
        <group position={[0, 0, 0]}>
          <mesh position={[0, 0.05, 0]} castShadow receiveShadow material={terracottaMat}>
            <boxGeometry args={[0.44, 0.1, 0.44]} />
          </mesh>
          <mesh position={[0, 0.13, 0]} castShadow receiveShadow material={terracottaMat}>
            <boxGeometry args={[0.38, 0.08, 0.38]} />
          </mesh>
          <mesh position={[0, 0.3, 0]} castShadow receiveShadow material={terracottaMat}>
            <boxGeometry args={[0.32, 0.28, 0.32]} />
          </mesh>
          <mesh position={[0, 0.3, 0.162]} material={soilMat}>
            <boxGeometry args={[0.1, 0.12, 0.02]} />
          </mesh>
          <mesh position={[0, 0.46, 0]} castShadow receiveShadow material={terracottaMat}>
            <boxGeometry args={[0.38, 0.06, 0.38]} />
          </mesh>
          <mesh position={[0, 0.49, 0]} rotation={[-Math.PI / 2, 0, 0]} material={soilMat}>
            <circleGeometry args={[0.14, 16]} />
          </mesh>
        </group>
      ) : (
        <group position={[0, 0, 0]}>
          <mesh position={[0, 0.02, 0]} castShadow receiveShadow material={activePotMat}>
            <cylinderGeometry args={[0.19, 0.17, 0.04, 18]} />
          </mesh>
          <mesh position={[0, 0.2, 0]} castShadow receiveShadow material={activePotMat}>
            <cylinderGeometry args={[0.18, 0.13, 0.34, 18]} />
          </mesh>
          <mesh position={[0, 0.37, 0]} castShadow receiveShadow material={activePotMat}>
            <cylinderGeometry args={[0.195, 0.185, 0.04, 18]} />
          </mesh>
          <mesh position={[0, 0.36, 0]} rotation={[-Math.PI / 2, 0, 0]} material={soilMat}>
            <circleGeometry args={[0.17, 18]} />
          </mesh>
        </group>
      )}

      {/* 2. BOTANICAL SPECIES */}
      {plantType === 'tulsi' && (
        <group position={[0, potStyle === 'tulsi_vrindavan' || potStyle === 'terracotta' ? 0.48 : 0.36, 0]}>
          <mesh position={[0, 0.12, 0]} castShadow material={tulsiGreenMat}>
            <cylinderGeometry args={[0.015, 0.025, 0.24, 6]} />
          </mesh>
          {[0, 1.57, 3.14, 4.71].map((ang, i) => (
            <group key={i} position={[Math.cos(ang) * 0.06, 0.18, Math.sin(ang) * 0.06]} rotation={[0.2, ang, 0.3]}>
              <mesh scale={[0.12, 0.12, 0.12]} castShadow material={tulsiGreenMat}>
                <dodecahedronGeometry args={[1, 1]} />
              </mesh>
              <mesh position={[0, 0.14, 0]} castShadow material={tulsiManjariMat}>
                <cylinderGeometry args={[0.008, 0.014, 0.16, 5]} />
              </mesh>
            </group>
          ))}
          <mesh position={[0, 0.32, 0]} castShadow material={tulsiManjariMat}>
            <cylinderGeometry args={[0.01, 0.016, 0.18, 5]} />
          </mesh>
        </group>
      )}

      {plantType === 'snake_plant' && (
        <group position={[0, 0.36, 0]}>
          {[
            { angle: 0, height: 0.55, tilt: 0.08, width: 0.07 },
            { angle: 1.1, height: 0.65, tilt: 0.12, width: 0.075 },
            { angle: 2.2, height: 0.5, tilt: 0.1, width: 0.065 },
            { angle: 3.3, height: 0.62, tilt: 0.09, width: 0.075 },
            { angle: 4.4, height: 0.45, tilt: 0.14, width: 0.06 },
            { angle: 5.4, height: 0.58, tilt: 0.11, width: 0.07 },
            { angle: 0.5, height: 0.7, tilt: 0.04, width: 0.08 },
          ].map((b, i) => (
            <group
              key={i}
              position={[Math.cos(b.angle) * 0.04, 0, Math.sin(b.angle) * 0.04]}
              rotation={[Math.sin(b.angle) * b.tilt, b.angle, Math.cos(b.angle) * b.tilt]}
            >
              <mesh position={[0, b.height / 2, 0]} scale={[b.width, b.height, 0.012]} castShadow material={snakePlantBodyMat}>
                <boxGeometry args={[1, 1, 1]} />
              </mesh>
              <mesh position={[b.width / 2, b.height / 2, 0]} scale={[0.012, b.height, 0.014]} material={snakePlantEdgeMat}>
                <boxGeometry args={[1, 1, 1]} />
              </mesh>
              <mesh position={[-b.width / 2, b.height / 2, 0]} scale={[0.012, b.height, 0.014]} material={snakePlantEdgeMat}>
                <boxGeometry args={[1, 1, 1]} />
              </mesh>
            </group>
          ))}
        </group>
      )}

      {plantType === 'money_plant' && (
        <group position={[0, 0.36, 0]}>
          <mesh position={[0, 0.28, 0]} castShadow material={coirPoleMat}>
            <cylinderGeometry args={[0.03, 0.035, 0.56, 8]} />
          </mesh>
          {[
            { y: 0.08, ang: 0.2, s: 0.08, drop: true },
            { y: 0.12, ang: 2.1, s: 0.09, drop: true },
            { y: 0.16, ang: 4.3, s: 0.085, drop: true },
            { y: 0.25, ang: 1.0, s: 0.09, drop: false },
            { y: 0.32, ang: 3.2, s: 0.085, drop: false },
            { y: 0.42, ang: 5.1, s: 0.08, drop: false },
            { y: 0.52, ang: 0.8, s: 0.075, drop: false },
          ].map((leaf, i) => (
            <mesh
              key={i}
              position={[
                Math.cos(leaf.ang) * (leaf.drop ? 0.14 : 0.06),
                leaf.y,
                Math.sin(leaf.ang) * (leaf.drop ? 0.14 : 0.06),
              ]}
              rotation={[leaf.drop ? 0.8 : -0.3, leaf.ang, 0.2]}
              scale={[leaf.s, leaf.s * 1.3, 0.008]}
              castShadow
              material={i % 2 === 0 ? moneyPlantMat : moneyVariegatedMat}
            >
              <sphereGeometry args={[1, 6, 6]} />
            </mesh>
          ))}
        </group>
      )}

      {plantType === 'flowering_hibiscus' && (
        <group position={[0, 0.36, 0]}>
          <mesh position={[0.02, 0.15, 0]} rotation={[0.1, 0, 0.1]} castShadow material={tulsiGreenMat}>
            <cylinderGeometry args={[0.02, 0.03, 0.3, 6]} />
          </mesh>
          <mesh position={[-0.03, 0.18, 0.02]} rotation={[-0.2, 0.3, -0.15]} castShadow material={tulsiGreenMat}>
            <cylinderGeometry args={[0.015, 0.025, 0.32, 6]} />
          </mesh>
          <mesh position={[0, 0.26, 0]} scale={[0.18, 0.14, 0.18]} castShadow material={hibiscusLeafMat}>
            <dodecahedronGeometry args={[1, 1]} />
          </mesh>
          <mesh position={[0.08, 0.34, -0.05]} scale={[0.14, 0.12, 0.14]} castShadow material={hibiscusLeafMat}>
            <dodecahedronGeometry args={[1, 1]} />
          </mesh>
          <group position={[0.12, 0.38, 0.1]} rotation={[0.4, 0.6, 0]}>
            <mesh castShadow material={hibiscusFlowerMat}>
              <coneGeometry args={[0.12, 0.08, 5]} />
            </mesh>
            <mesh position={[0, 0.08, 0]} material={hibiscusStamenMat}>
              <cylinderGeometry args={[0.006, 0.008, 0.12, 5]} />
            </mesh>
            <mesh position={[0, 0.14, 0]} material={hibiscusFlowerMat}>
              <sphereGeometry args={[0.015, 5, 5]} />
            </mesh>
          </group>
        </group>
      )}
    </group>
  );
};

// =========================================================================
// 6. FALLEN LEAVES (Ground scatter with multi-toned autumn leaves)
// =========================================================================

export interface FallenLeavesProps {
  position?: [number, number, number];
  rotation?: [number, number, number];
  scale?: number | [number, number, number];
  count?: number;
  radius?: number;
  color?: string;
}

export const FallenLeaves: React.FC<FallenLeavesProps> = ({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = 1,
  count = 16,
  radius = 0.85,
  color = '#d97706',
}) => {
  const finalScale: [number, number, number] =
    typeof scale === 'number' ? [scale, scale, scale] : scale;

  const leafMat1 = useMemo(
    () => new THREE.MeshStandardMaterial({ color, roughness: 0.85, side: THREE.DoubleSide }),
    [color]
  );
  const leafMat2 = useMemo(
    () => new THREE.MeshStandardMaterial({ color: '#ea580c', roughness: 0.85, side: THREE.DoubleSide }),
    []
  );
  const leafMat3 = useMemo(
    () => new THREE.MeshStandardMaterial({ color: '#78350f', roughness: 0.9, side: THREE.DoubleSide }),
    []
  );

  const leaves = useMemo(() => {
    const list = [];
    for (let i = 0; i < count; i++) {
      const r = Math.sqrt(Math.random()) * radius;
      const theta = Math.random() * Math.PI * 2;
      const x = Math.cos(theta) * r;
      const z = Math.sin(theta) * r;
      const rotZ = Math.random() * Math.PI * 2;
      const tiltX = (Math.random() - 0.5) * 0.2;
      const s = 0.07 + Math.random() * 0.06;
      const type = i % 3;
      list.push({ x, z, rotZ, tiltX, s, type });
    }
    return list;
  }, [count, radius]);

  return (
    <group position={position} rotation={rotation} scale={finalScale}>
      {leaves.map((l, i) => (
        <mesh
          key={i}
          position={[l.x, 0.005 + i * 0.0004, l.z]}
          rotation={[-Math.PI / 2 + l.tiltX, 0, l.rotZ]}
          scale={[l.s, l.s * 1.8, 0.005]}
          material={l.type === 0 ? leafMat1 : l.type === 1 ? leafMat2 : leafMat3}
        >
          <planeGeometry args={[1, 1]} />
        </mesh>
      ))}
    </group>
  );
};
