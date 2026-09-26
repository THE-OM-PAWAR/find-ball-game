import React, { useMemo } from 'react';
import * as THREE from 'three';

interface WoodenPlankBridgeProps {
  /** World start point of the bridge */
  from: [number, number, number];
  /** World end point of the bridge */
  to: [number, number, number];
  /** Bridge width in metres (default 0.9) */
  width?: number;
  /** Number of planks (default auto from length) */
  plankCount?: number;
  /** Show side rails/ropes */
  showRails?: boolean;
  /** Visible ID name */
  name?: string;
}

/**
 * A rickety wooden plank bridge connecting two rooftop points.
 * Planks are rendered as individual thin boxes with slight random sag,
 * side rails are rope-style thin cylinders, and the whole group is oriented
 * along the vector from `from` to `to`.
 */
export const WoodenPlankBridge: React.FC<WoodenPlankBridgeProps> = ({
  from,
  to,
  width = 0.9,
  plankCount,
  showRails = true,
  name = 'plank-bridge',
}) => {
  const { midpoint, length, angle, planks, railPoints } = useMemo(() => {
    const fromVec = new THREE.Vector3(...from);
    const toVec = new THREE.Vector3(...to);
    const diff = new THREE.Vector3().subVectors(toVec, fromVec);
    const len = diff.length();
    const mid: [number, number, number] = [
      (from[0] + to[0]) / 2,
      (from[1] + to[1]) / 2,
      (from[2] + to[2]) / 2,
    ];

    // Angle on XZ plane
    const ang = Math.atan2(diff.x, diff.z);

    const count = plankCount ?? Math.max(4, Math.floor(len / 0.25));
    const plankSpacing = len / count;
    const plankWidth = plankSpacing * 0.78;

    const plankData: Array<{ offset: number; sagY: number; tilt: number }> = [];
    for (let i = 0; i < count; i++) {
      const t = (i + 0.5) / count;
      const sagY = -Math.sin(t * Math.PI) * 0.04; // slight sag in the middle
      const tilt = (Math.random() - 0.5) * 0.03;
      plankData.push({ offset: (t - 0.5) * len, sagY, tilt });
    }

    // Height slope per unit along bridge
    const heightSlope = (to[1] - from[1]) / len;

    // Rail attachment points along the bridge (every 1.2m)
    const railSegments = Math.max(2, Math.floor(len / 1.2));
    const rp: Array<[number, number, number]> = [];
    for (let i = 0; i <= railSegments; i++) {
      const t = i / railSegments;
      const localZ = (t - 0.5) * len;
      const localY = heightSlope * (t * len);
      rp.push([0, localY + 0.42, localZ]);
    }

    return {
      midpoint: mid,
      length: len,
      angle: ang,
      planks: { data: plankData, plankWidth, spacing: plankSpacing, heightSlope },
      railPoints: rp,
    };
  }, [from, to, plankCount]);

  const plankMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#8B6914',
        roughness: 0.92,
        metalness: 0.0,
      }),
    []
  );

  const railMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#6B4C12',
        roughness: 0.95,
        metalness: 0.0,
      }),
    []
  );

  const ropeMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#B5924C',
        roughness: 1.0,
        metalness: 0.0,
      }),
    []
  );

  return (
    <group
      name={name}
      position={midpoint}
      rotation={[0, angle, 0]}
    >
      {/* === PLANKS === */}
      {planks.data.map((plank, i) => {
        const localY = planks.heightSlope * ((i + 0.5) / planks.data.length) * length;
        return (
          <mesh
            key={i}
            position={[0, localY + plank.sagY, plank.offset]}
            rotation={[plank.tilt, 0, 0]}
            material={plankMat}
            castShadow
            receiveShadow
          >
            <boxGeometry args={[width, 0.06, planks.plankWidth]} />
          </mesh>
        );
      })}

      {/* === SIDE RAILS (vertical posts + horizontal rope) === */}
      {showRails && (
        <>
          {/* Left rail posts and rope */}
          {railPoints.map((rp, i) => {
            if (i === railPoints.length - 1) return null;
            const next = railPoints[i + 1];
            const segLen = new THREE.Vector3(
              next[0] - rp[0],
              next[1] - rp[1],
              next[2] - rp[2]
            ).length();
            const midRail: [number, number, number] = [
              (rp[0] + next[0]) / 2 - width / 2,
              (rp[1] + next[1]) / 2,
              (rp[2] + next[2]) / 2,
            ];
            const segAngle = Math.atan2(next[2] - rp[2], next[1] - rp[1]);
            return (
              <mesh key={`lrope-${i}`} position={midRail} rotation={[segAngle, 0, 0]} material={ropeMat}>
                <cylinderGeometry args={[0.018, 0.018, segLen, 6]} />
              </mesh>
            );
          })}
          {/* Right rail rope */}
          {railPoints.map((rp, i) => {
            if (i === railPoints.length - 1) return null;
            const next = railPoints[i + 1];
            const segLen = new THREE.Vector3(
              next[0] - rp[0],
              next[1] - rp[1],
              next[2] - rp[2]
            ).length();
            const midRail: [number, number, number] = [
              (rp[0] + next[0]) / 2 + width / 2,
              (rp[1] + next[1]) / 2,
              (rp[2] + next[2]) / 2,
            ];
            const segAngle = Math.atan2(next[2] - rp[2], next[1] - rp[1]);
            return (
              <mesh key={`rrope-${i}`} position={midRail} rotation={[segAngle, 0, 0]} material={ropeMat}>
                <cylinderGeometry args={[0.018, 0.018, segLen, 6]} />
              </mesh>
            );
          })}

          {/* Vertical posts at each rail point */}
          {railPoints.map((rp, i) => (
            <React.Fragment key={`posts-${i}`}>
              {/* Left post */}
              <mesh position={[-width / 2, rp[1] + 0.2, rp[2]]} material={railMat} castShadow>
                <boxGeometry args={[0.06, 0.44, 0.06]} />
              </mesh>
              {/* Right post */}
              <mesh position={[width / 2, rp[1] + 0.2, rp[2]]} material={railMat} castShadow>
                <boxGeometry args={[0.06, 0.44, 0.06]} />
              </mesh>
            </React.Fragment>
          ))}
        </>
      )}
    </group>
  );
};
