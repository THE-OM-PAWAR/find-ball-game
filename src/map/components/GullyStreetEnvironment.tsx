import React from 'react';
import * as THREE from 'three';
import { AutoRickshaw } from '../../studio/components/3d/vehicles/AutoRickshaw';
import { BajajChetakScooter } from '../../studio/components/3d/vehicles/BajajChetakScooter';
import { IndianMotorcycle } from '../../studio/components/3d/vehicles/IndianMotorcycle';
import { ClassicIndianBicycle } from '../../studio/components/3d/vehicles/ClassicIndianBicycle';
import { IndianPushCart } from '../../studio/components/3d/vehicles/IndianPushCart';
import { IndianGarbageBins } from '../../studio/components/3d/vehicles/IndianGarbageBins';
import { ParkedGullyCar } from '../../studio/components/3d/vehicles/ParkedGullyCar';
import { SmallTree, LargeTree, PottedPlant, Bush, GrassPatch } from '../../studio/components/3d/NatureProps';

/**
 * Concrete Electric Utility Pole with transformer, street light arm, and crossarms
 */
const ConcreteElectricPole: React.FC<{
  position: [number, number, number];
  rotation?: [number, number, number];
  hasTransformer?: boolean;
  hasStreetLamp?: boolean;
}> = ({ position, rotation = [0, 0, 0], hasTransformer = false, hasStreetLamp = true }) => {
  const poleHeight = 7.5;

  return (
    <group position={position} rotation={rotation}>
      {/* Heavy Concrete Square Foundation Plinth */}
      <mesh position={[0, 0.25, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.5, 0.5, 0.5]} />
        <meshStandardMaterial color="#64748b" roughness={0.9} />
      </mesh>

      {/* Main Square Tapered Concrete Pole Shaft */}
      <mesh position={[0, poleHeight / 2, 0]} castShadow>
        <boxGeometry args={[0.3, poleHeight, 0.3]} />
        <meshStandardMaterial color="#94a3b8" roughness={0.85} />
      </mesh>

      {/* Steel Crossarms for High-Voltage Distribution */}
      {[poleHeight - 0.4, poleHeight - 1.0].map((y, idx) => (
        <group key={idx} position={[0, y, 0]}>
          <mesh castShadow>
            <boxGeometry args={[1.8, 0.08, 0.08]} />
            <meshStandardMaterial color="#334155" roughness={0.5} metalness={0.8} />
          </mesh>
          {/* Ceramic Pin Insulators (Brown Glazed Porcelain) */}
          {[-0.8, -0.4, 0, 0.4, 0.8].map((x, iIdx) => (
            <mesh key={iIdx} position={[x, 0.1, 0]} castShadow>
              <cylinderGeometry args={[0.04, 0.05, 0.14, 8]} />
              <meshStandardMaterial color="#78350f" roughness={0.3} metalness={0.2} />
            </mesh>
          ))}
        </group>
      ))}

      {/* Heavy-Duty 3-Phase Step-Down Transformer Box */}
      {hasTransformer && (
        <group position={[0.42, poleHeight * 0.58, 0]}>
          <mesh castShadow receiveShadow>
            <boxGeometry args={[0.65, 0.85, 0.55]} />
            <meshStandardMaterial color="#3b82f6" roughness={0.4} metalness={0.6} />
          </mesh>
          {/* Cooling Fins */}
          {[-0.2, 0, 0.2].map((z, fIdx) => (
            <mesh key={fIdx} position={[0.34, 0, z]}>
              <boxGeometry args={[0.03, 0.7, 0.08]} />
              <meshStandardMaterial color="#1e40af" roughness={0.5} />
            </mesh>
          ))}
          {/* Yellow Danger Hazard Triangle */}
          <mesh position={[0.34, 0.12, 0]} rotation={[0, Math.PI / 2, 0]}>
            <planeGeometry args={[0.2, 0.2]} />
            <meshBasicMaterial color="#eab308" />
          </mesh>
        </group>
      )}

      {/* Street Light Bracket Arm with Warm Sodium Glow */}
      {hasStreetLamp && (
        <group position={[0, poleHeight - 1.5, 0.2]} rotation={[0.25, 0, 0]}>
          <mesh position={[0, 0.3, 0.5]} rotation={[0.4, 0, 0]} castShadow>
            <cylinderGeometry args={[0.025, 0.025, 1.1, 8]} />
            <meshStandardMaterial color="#1e293b" metalness={0.8} />
          </mesh>
          {/* Luminaire Fixture Casing */}
          <mesh position={[0, 0.65, 0.95]} rotation={[-0.4, 0, 0]} castShadow>
            <boxGeometry args={[0.22, 0.12, 0.42]} />
            <meshStandardMaterial color="#334155" roughness={0.4} />
          </mesh>
          {/* Glass Lens (Warm Illuminant) */}
          <mesh position={[0, 0.58, 0.95]}>
            <boxGeometry args={[0.18, 0.02, 0.36]} />
            <meshBasicMaterial color="#fef08a" />
          </mesh>
          {/* Warm Amber Downlight */}
          <pointLight
            position={[0, 0.5, 0.95]}
            color="#fed7aa"
            intensity={3.5}
            distance={14}
            decay={2}
          />
        </group>
      )}

      {/* Wall-Mounted Metal Meter Box & Electrical Conduit */}
      <group position={[0.18, 1.5, 0]}>
        <mesh castShadow>
          <boxGeometry args={[0.08, 0.45, 0.32]} />
          <meshStandardMaterial color="#475569" roughness={0.6} metalness={0.7} />
        </mesh>
        {/* PVC Conduit Pipe running down */}
        <mesh position={[0, -0.6, 0]}>
          <cylinderGeometry args={[0.015, 0.015, 0.8, 6]} />
          <meshStandardMaterial color="#334155" />
        </mesh>
      </group>
    </group>
  );
};

/**
 * Hanging Parabolic Overhead Power & Cable TV Wire Bundle
 */
const OverheadCableSpan: React.FC<{
  start: [number, number, number];
  end: [number, number, number];
  sag?: number;
  count?: number;
}> = ({ start, end, sag = 0.45, count = 3 }) => {
  const points = React.useMemo(() => {
    const p1 = new THREE.Vector3(...start);
    const p2 = new THREE.Vector3(...end);
    const mid = new THREE.Vector3().addVectors(p1, p2).multiplyScalar(0.5);
    mid.y -= sag;

    const curve = new THREE.QuadraticBezierCurve3(p1, mid, p2);
    return curve.getPoints(24);
  }, [start, end, sag]);

  const lineGeometry = React.useMemo(() => {
    const geo = new THREE.BufferGeometry().setFromPoints(points);
    return geo;
  }, [points]);

  return (
    <group>
      {Array.from({ length: count }).map((_, i) => (
        <line key={i} geometry={lineGeometry} position={[0, i * 0.06 - 0.06, 0]}>
          <lineBasicMaterial color="#0f172a" linewidth={1.5} />
        </line>
      ))}
    </group>
  );
};

/**
 * Chai Stall Wooden Bench with Stainless Steel Milk Churners & Glass Rack
 */
const ChaiStallBench: React.FC<{
  position: [number, number, number];
  rotation?: [number, number, number];
}> = ({ position, rotation = [0, 0, 0] }) => (
  <group position={position} rotation={rotation}>
    {/* Wooden Plank Bench */}
    <mesh position={[0, 0.45, 0]} castShadow receiveShadow>
      <boxGeometry args={[1.5, 0.06, 0.35]} />
      <meshStandardMaterial color="#78350f" roughness={0.8} />
    </mesh>
    {/* Angle Iron Legs */}
    {[-0.65, 0.65].map((x, i) => (
      <mesh key={i} position={[x, 0.22, 0]} castShadow>
        <boxGeometry args={[0.04, 0.44, 0.3]} />
        <meshStandardMaterial color="#1e293b" roughness={0.7} />
      </mesh>
    ))}

    {/* Stainless Steel 20L Milk Cans / Churners */}
    {[-0.5, 0.5].map((x, mIdx) => (
      <group key={mIdx} position={[x * 0.6, 0.28, 0.38]}>
        <mesh castShadow>
          <cylinderGeometry args={[0.16, 0.18, 0.56, 16]} />
          <meshStandardMaterial color="#e2e8f0" metalness={0.9} roughness={0.2} />
        </mesh>
        {/* Can Lid & Handle */}
        <mesh position={[0, 0.31, 0]}>
          <cylinderGeometry args={[0.11, 0.11, 0.06, 12]} />
          <meshStandardMaterial color="#cbd5e1" metalness={0.85} roughness={0.3} />
        </mesh>
      </group>
    ))}
  </group>
);

/**
 * Plastic Milk / Beverage Crates Stacking
 */
const PlasticCratesStack: React.FC<{
  position: [number, number, number];
  rotation?: [number, number, number];
}> = ({ position, rotation = [0, 0, 0] }) => (
  <group position={position} rotation={rotation}>
    {[0, 0.26, 0.52].map((y, i) => (
      <mesh key={i} position={[0, y + 0.13, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.42, 0.24, 0.34]} />
        <meshStandardMaterial
          color={i === 0 ? '#1d4ed8' : i === 1 ? '#b91c1c' : '#ca8a04'}
          roughness={0.5}
        />
      </mesh>
    ))}
  </group>
);

/**
 * Wall-Mounted Weathered Neighborhood Decal / Poster Plate
 */
const WallPoster: React.FC<{
  position: [number, number, number];
  rotation: [number, number, number];
  width?: number;
  height?: number;
  color?: string;
  borderColor?: string;
}> = ({ position, rotation, width = 0.8, height = 1.0, color = '#fef08a', borderColor = '#dc2626' }) => (
  <group position={position} rotation={rotation}>
    {/* Poster Body */}
    <mesh position={[0, 0, 0.005]}>
      <planeGeometry args={[width, height]} />
      <meshStandardMaterial color={color} roughness={0.9} />
    </mesh>
    {/* Border Frame */}
    <mesh position={[0, 0, 0.006]}>
      <planeGeometry args={[width * 0.92, height * 0.88]} />
      <meshBasicMaterial color={borderColor} wireframe />
    </mesh>
  </group>
);

/**
 * Paan / Betel Nut Red-Brown Corner Wall Stain Decal
 */
const PaanStainDecal: React.FC<{
  position: [number, number, number];
  rotation?: [number, number, number];
}> = ({ position, rotation = [0, 0, 0] }) => (
  <mesh position={position} rotation={rotation}>
    <planeGeometry args={[0.38, 0.55]} />
    <meshBasicMaterial color="#581c87" transparent opacity={0.35} />
  </mesh>
);

/**
 * Domestic Gas Meter with Yellow Pipe Conduit
 */
const DomesticGasMeter: React.FC<{
  position: [number, number, number];
  rotation?: [number, number, number];
}> = ({ position, rotation = [0, 0, 0] }) => (
  <group position={position} rotation={rotation}>
    {/* Yellow Gas Line Vertical Pipe */}
    <mesh position={[0, 0.9, 0]} castShadow>
      <cylinderGeometry args={[0.015, 0.015, 1.8, 8]} />
      <meshStandardMaterial color="#eab308" roughness={0.5} />
    </mesh>
    {/* Meter Box (Grey Metal) */}
    <mesh position={[0.06, 1.3, 0]} castShadow>
      <boxGeometry args={[0.12, 0.28, 0.22]} />
      <meshStandardMaterial color="#cbd5e1" roughness={0.6} metalness={0.5} />
    </mesh>
  </group>
);

/**
 * Master Lived-In Indian Gully Environment Layer
 * Transforms Level 1 into an authentic residential neighborhood while preserving Phase 2 traversal
 */
export const GullyStreetEnvironment: React.FC = () => {
  return (
    <group name="gully-street-environment">
      {/* ═══════════════════════════════════════════════════════════════
          1. OVERHEAD ELECTRICAL UTILITY NETWORK (Poles & Cables)
      ═══════════════════════════════════════════════════════════════ */}
      <group name="electrical-grid">
        {/* Pole 1: North-West Society Gate Corridor */}
        <ConcreteElectricPole
          position={[-16.5, 0, -11.0]}
          rotation={[0, 0.4, 0]}
          hasTransformer={true}
          hasStreetLamp={true}
        />

        {/* Pole 2: North Courtyard (Sharma Niwas Stair Entry Corner) */}
        <ConcreteElectricPole
          position={[-8.0, 0, -14.5]}
          rotation={[0, 0, 0]}
          hasTransformer={false}
          hasStreetLamp={true}
        />

        {/* Pole 3: East Flank (Near H5 / H15 boundary) */}
        <ConcreteElectricPole
          position={[11.5, 0, -15.5]}
          rotation={[0, -0.6, 0]}
          hasTransformer={false}
          hasStreetLamp={true}
        />

        {/* Pole 4: South Central Gully (Near Cricket Pitch) */}
        <ConcreteElectricPole
          position={[-6.0, 0, 10.5]}
          rotation={[0, Math.PI / 2, 0]}
          hasTransformer={false}
          hasStreetLamp={true}
        />

        {/* Pole 5: South-East Corner */}
        <ConcreteElectricPole
          position={[8.5, 0, 12.5]}
          rotation={[0, -Math.PI / 2, 0]}
          hasTransformer={false}
          hasStreetLamp={true}
        />

        {/* Sagging Overhead Electrical Power Cable Spans */}
        <OverheadCableSpan start={[-16.5, 6.5, -11.0]} end={[-8.0, 6.5, -14.5]} sag={0.6} count={3} />
        <OverheadCableSpan start={[-8.0, 6.5, -14.5]} end={[11.5, 6.5, -15.5]} sag={0.9} count={4} />
        <OverheadCableSpan start={[-16.5, 6.5, -11.0]} end={[-6.0, 6.5, 10.5]} sag={0.8} count={3} />
        <OverheadCableSpan start={[-6.0, 6.5, 10.5]} end={[8.5, 6.5, 12.5]} sag={0.5} count={3} />
      </group>

      {/* ═══════════════════════════════════════════════════════════════
          2. AUTHENTIC PARKED INDIAN VEHICLES & CARTS
      ═══════════════════════════════════════════════════════════════ */}
      <group name="gully-vehicles">
        {/* Bajaj Auto-Rickshaw parked in North-West alley near society gate */}
        <AutoRickshaw
          position={[-16.2, 0, -15.5]}
          rotation={[0, 0.5, 0]}
          scale={0.95}
          config={{
            bodyColor: '#16a34a',
            roofColor: '#eab308',
            hasFareMeter: true,
            hasCurtains: true,
          }}
        />

        {/* Bajaj Chetak Scooter parked neatly by House 2 sidewalk plinth */}
        <BajajChetakScooter
          position={[-8.8, 0, -15.8]}
          rotation={[0, 1.2, 0]}
          scale={0.95}
          config={{
            bodyColor: '#64748b',
            hasSpareWheel: true,
            hasSideMirrors: true,
          }}
        />

        {/* Hero Splendor / Pulsar Motorcycle parked along east sidewalk */}
        <IndianMotorcycle
          position={[7.5, 0, -3.5]}
          rotation={[0, -Math.PI / 2 + 0.2, 0]}
          scale={0.95}
          config={{
            tankColor: '#1e293b',
            accentColor: '#dc2626',
            hasSariGuard: true,
            hasCrashGuard: true,
          }}
        />

        {/* Classic Hero Roadster Bicycle propped against H6 Chawl wall */}
        <ClassicIndianBicycle
          position={[-18.8, 0, -6.0]}
          rotation={[0, 0.15, 0]}
          scale={0.95}
          config={{
            frameColor: '#0f172a',
            hasFrontBasket: true,
            hasRearCarrier: true,
            hasChainCover: true,
          }}
        />

        {/* 4-Wheel Wooden Vegetable Pushcart (Thela/Rehri) under tree shade */}
        <IndianPushCart
          position={[-4.5, 0, 9.2]}
          rotation={[0, 0.4, 0]}
          scale={0.95}
          config={{
            hasWeighingScale: true,
            hasCrates: true,
            hasJuteCover: true,
          }}
        />

        {/* White Compact Sedan parked at south entrance alley */}
        <ParkedGullyCar
          position={[2.0, 0, 18.0]}
          rotation={[0, Math.PI - 0.1, 0]}
          scale={0.92}
          config={{
            bodyColor: '#f1f5f9',
            hasLuggageCarrier: false,
          }}
        />
      </group>

      {/* ═══════════════════════════════════════════════════════════════
          3. STREET UTILITY & LIVED-IN CLUTTER
      ═══════════════════════════════════════════════════════════════ */}
      <group name="street-utility-props">
        {/* Municipal Twin Dustbins (Swachh Bharat Blue & Green) */}
        <IndianGarbageBins position={[-15.0, 0, -11.5]} rotation={[0, 0.3, 0]} scale={0.9} />

        {/* Chai Stall Bench with Milk Cans in front of H1 Commercial Shop */}
        <ChaiStallBench position={[-14.5, 0, -17.5]} rotation={[0, 0, 0]} />

        {/* Stack of Plastic Milk / Soda Crates */}
        <PlasticCratesStack position={[-13.2, 0, -17.5]} rotation={[0, 0.2, 0]} />

        {/* Domestic Gas Meters with Yellow Pipes on House Fronts */}
        <DomesticGasMeter position={[-6.2, 0, -19.4]} rotation={[0, 0, 0]} />
        <DomesticGasMeter position={[6.2, 0, -19.4]} rotation={[0, 0, 0]} />

        {/* Blue PVC Water Pipeline along West plinth with brass bibcock and plastic buckets */}
        <group position={[-14.2, 0.12, -22.5]}>
          <mesh rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.025, 0.025, 8.0, 8]} />
            <meshStandardMaterial color="#2563eb" roughness={0.6} />
          </mesh>
          {/* Brass Water Meter Tap */}
          <mesh position={[0, 0.15, 0]} castShadow>
            <boxGeometry args={[0.12, 0.14, 0.08]} />
            <meshStandardMaterial color="#ca8a04" metalness={0.8} roughness={0.3} />
          </mesh>
          {/* Plastic Water Buckets (Red & Blue Balti) */}
          <group position={[0.25, 0.12, 0]}>
            <mesh castShadow>
              <cylinderGeometry args={[0.16, 0.12, 0.32, 12]} />
              <meshStandardMaterial color="#2563eb" roughness={0.4} />
            </mesh>
          </group>
          <group position={[0.55, 0.12, 0.2]}>
            <mesh castShadow>
              <cylinderGeometry args={[0.15, 0.11, 0.3, 12]} />
              <meshStandardMaterial color="#dc2626" roughness={0.4} />
            </mesh>
          </group>
        </group>

        {/* Wall Posters & Neighbourhood Signage Decals */}
        <WallPoster
          position={[-18.6, 1.8, -13.0]}
          rotation={[0, Math.PI / 2, 0]}
          width={0.7}
          height={0.9}
          color="#fef08a"
          borderColor="#dc2626"
        />
        <WallPoster
          position={[-18.6, 1.6, -11.8]}
          rotation={[0, Math.PI / 2, 0]}
          width={0.6}
          height={0.7}
          color="#fed7aa"
          borderColor="#2563eb"
        />
        <WallPoster
          position={[18.6, 1.8, -12.0]}
          rotation={[0, -Math.PI / 2, 0]}
          width={0.8}
          height={1.0}
          color="#dbeafe"
          borderColor="#16a34a"
        />

        {/* Paan / Gutkha Corner Wall Stains */}
        <PaanStainDecal position={[-18.58, 0.45, -14.2]} rotation={[0, Math.PI / 2, 0]} />
        <PaanStainDecal position={[18.58, 0.4, -14.5]} rotation={[0, -Math.PI / 2, 0]} />
        <PaanStainDecal position={[-6.2, 0.35, -19.45]} rotation={[0, 0, 0]} />
      </group>

      {/* ═══════════════════════════════════════════════════════════════
          4. NATURAL VEGETATION & POTTED PLANTS (Believable Placement)
      ═══════════════════════════════════════════════════════════════ */}
      <group name="street-vegetation">
        {/* Mature Shade Neem Tree near House 13 South-West Courtyard Garden */}
        <LargeTree
          position={[-14.2, 0, 19.5]}
          rotation={[0, 0.6, 0]}
          scale={1.1}
          hasFallenLeaves={true}
        />

        {/* Medium Tree near House 12 East Garden Pocket */}
        <SmallTree
          position={[16.8, 0, 8.5]}
          rotation={[0, -0.5, 0]}
          scale={0.92}
          hasFallenLeaves={true}
        />

        {/* Medium Garden Tree in South-East Corner (Near H19/H17) */}
        <SmallTree
          position={[10.5, 0, 17.5]}
          rotation={[0, -0.8, 0]}
          scale={0.9}
          hasFallenLeaves={true}
        />

        {/* Courtyard Tree along West Wall Corridor (Near Society Exit Gate) */}
        <SmallTree
          position={[-18.2, 0, -8.5]}
          rotation={[0, 0.3, 0]}
          scale={0.88}
          hasFallenLeaves={true}
        />

        {/* Potted Plants outside Contemporary Villa H4 & Sharma Niwas H2 Entrance */}
        <PottedPlant position={[-6.8, 0, -19.5]} scale={0.9} />
        <PottedPlant position={[-5.8, 0, -19.5]} scale={0.85} />
        <PottedPlant position={[0.6, 0, -19.2]} scale={0.9} />
        <PottedPlant position={[3.2, 0, -19.2]} scale={0.95} />
        <PottedPlant position={[15.2, 0, 5.5]} scale={0.85} />

        {/* Wild Green Shrubs & Grass Patches along unpaved boundary edges */}
        <Bush position={[-18.5, 0, 14.0]} scale={0.85} />
        <Bush position={[8.5, 0, 15.5]} scale={0.85} />
        <Bush position={[-18.2, 0, -2.5]} scale={0.75} />
        <GrassPatch position={[-7.5, 0, 3.5]} scale={0.7} />
        <GrassPatch position={[7.5, 0, 3.5]} scale={0.7} />
        <GrassPatch position={[-16.0, 0, -9.0]} scale={0.65} />
      </group>
    </group>
  );
};
