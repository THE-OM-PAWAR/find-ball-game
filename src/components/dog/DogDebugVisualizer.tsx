import React, { useMemo } from 'react';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import type { DogConfig, DogTelemetry } from './DogTypes';

interface DogDebugVisualizerProps {
  telemetry: DogTelemetry;
  config: DogConfig;
}

export const DogDebugVisualizer: React.FC<DogDebugVisualizerProps> = ({ telemetry, config }) => {
  const { position, rotationY, state, detection, targetPosition, targetType, isSeeingPlayer, isHearingPlayer } = telemetry;

  // Determine vision cone color based on state
  const coneColor = useMemo(() => {
    switch (state) {
      case 'ALERT':
        return '#ef4444'; // Red
      case 'INVESTIGATING':
        return '#f97316'; // Orange
      case 'SUSPICIOUS':
        return '#eab308'; // Yellow
      case 'DISTRACTED':
        return '#06b6d4'; // Cyan
      case 'SLEEPING':
        return '#64748b'; // Slate
      case 'IDLE':
      case 'PATROLLING':
      case 'RETURNING':
      default:
        return '#22c55e'; // Green
    }
  }, [state]);

  // Create vision cone mesh geometry
  const coneGeometry = useMemo(() => {
    const isSleeping = state === 'SLEEPING';
    const range = isSleeping ? config.sleepingVisionRange : config.visionRange;
    const angleRad = ((isSleeping ? config.sleepingVisionAngle : config.visionAngle) * Math.PI) / 180;
    const segments = 24;

    const shape = new THREE.Shape();
    shape.moveTo(0, 0);

    const startAngle = -angleRad / 2;
    const step = angleRad / segments;

    for (let i = 0; i <= segments; i++) {
      const a = startAngle + step * i;
      const x = Math.sin(a) * range;
      const y = Math.cos(a) * range;
      shape.lineTo(x, y);
    }
    shape.closePath();

    return new THREE.ShapeGeometry(shape);
  }, [state, config.visionRange, config.visionAngle, config.sleepingVisionRange, config.sleepingVisionAngle]);

  // Waypoint path vertices
  const waypointPoints = useMemo(() => {
    if (config.patrolPoints.length < 2) return [];
    const pts = config.patrolPoints.map((wp) => new THREE.Vector3(...wp.position));
    pts.push(pts[0].clone()); // Close loop
    return pts;
  }, [config.patrolPoints]);

  return (
    <group>
      {/* 1. Vision Cone (Projected onto ground with dog facing) */}
      <group position={[position.x, 0.02, position.z]} rotation={[0, rotationY, 0]}>
        <mesh rotation={[-Math.PI / 2, 0, 0]} geometry={coneGeometry}>
          <meshBasicMaterial color={coneColor} transparent opacity={0.22} side={THREE.DoubleSide} />
        </mesh>
      </group>

      {/* 2. Hearing Radius Ring */}
      <mesh position={[position.x, 0.03, position.z]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[config.visionRange * 0.95, config.visionRange * 1.0, 32]} />
        <meshBasicMaterial color="#3b82f6" transparent opacity={0.3} side={THREE.DoubleSide} />
      </mesh>

      {/* 3. Patrol Waypoint Markers & Loop */}
      {config.patrolPoints.map((wp, idx) => (
        <group key={idx} position={wp.position}>
          <mesh position={[0, 0.1, 0]}>
            <cylinderGeometry args={[0.18, 0.18, 0.04, 12]} />
            <meshBasicMaterial color="#a855f7" transparent opacity={0.6} />
          </mesh>
        </group>
      ))}

      {/* 4. Target Destination Line */}
      {targetType !== 'none' && (
        <group>
          <mesh position={targetPosition}>
            <sphereGeometry args={[0.12, 8, 8]} />
            <meshBasicMaterial color={coneColor} />
          </mesh>
        </group>
      )}

      {/* 5. 3D Floating Status Billboard */}
      <group position={[position.x, position.y + 0.85, position.z]}>
        <Html center distanceFactor={12}>
          <div
            style={{
              background: 'rgba(15, 23, 42, 0.9)',
              border: `1px solid ${coneColor}`,
              borderRadius: '6px',
              padding: '4px 8px',
              fontSize: '11px',
              fontFamily: 'monospace',
              color: '#f8fafc',
              whiteSpace: 'nowrap',
              pointerEvents: 'none',
              boxShadow: '0 4px 12px rgba(0,0,0,0.5)',
              transform: 'translateY(-10px)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 'bold' }}>
              <span
                style={{
                  display: 'inline-block',
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  backgroundColor: coneColor,
                }}
              />
              <span>{state}</span>
              <span style={{ color: '#94a3b8' }}>({Math.round(detection)}%)</span>
            </div>

            {/* Detection Progress Bar */}
            <div
              style={{
                width: '100%',
                height: '4px',
                background: '#334155',
                borderRadius: '2px',
                marginTop: '3px',
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  width: `${detection}%`,
                  height: '100%',
                  background: coneColor,
                  transition: 'width 0.1s ease',
                }}
              />
            </div>

            <div style={{ color: '#cbd5e1', fontSize: '10px', marginTop: '2px' }}>
              Target: {targetType} • Dist: {telemetry.distanceToPlayer.toFixed(1)}m
            </div>
          </div>
        </Html>
      </group>
    </group>
  );
};
