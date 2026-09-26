import React, { useMemo } from 'react';
import { Html, Line } from '@react-three/drei';
import * as THREE from 'three';
import { LEVEL_BLOCK_ZONES, LEVEL_BOUNDS } from './LevelZones';
import { LEVEL_GAMEPLAY_MARKERS } from './LevelMarkers';
import { LEVEL_ROUTES } from './LevelRoute';

interface GullyLevelBlueprintProps {
  showMarkers?: boolean;
  showRoutes?: boolean;
  showLabels?: boolean;
  activeFilter?: 'all' | 'retrieval' | 'escape' | 'zones';
}

export const GullyLevelBlueprint: React.FC<GullyLevelBlueprintProps> = ({
  showMarkers = true,
  showRoutes = true,
  showLabels = true,
  activeFilter = 'all',
}) => {
  return (
    <group position={[0, 0, 0]}>
      {/* ---------------- 1. 35m x 35m XZ GROUND PLANE & METRIC GRID ---------------- */}
      <group position={[0, 0, 0]}>
        {/* Main Base Terrain */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.005, 0]} receiveShadow>
          <planeGeometry args={[LEVEL_BOUNDS.width, LEVEL_BOUNDS.depth]} />
          <meshStandardMaterial color="#0f172a" roughness={0.9} />
        </mesh>

        {/* 1-Meter Blueprint Grid */}
        <gridHelper
          args={[LEVEL_BOUNDS.width, LEVEL_BOUNDS.width, '#334155', '#1e293b']}
          position={[0, 0.001, 0]}
        />

        {/* 35m Outer Perimeter Boundary Wire */}
        <mesh position={[0, 0.01, 0]}>
          <boxGeometry args={[LEVEL_BOUNDS.width, 0.02, LEVEL_BOUNDS.depth]} />
          <meshBasicMaterial color="#3b82f6" wireframe />
        </mesh>

        {/* Compass Cardinal Points */}
        <group position={[0, 0.02, 0]}>
          <mesh position={[0, 0, -LEVEL_BOUNDS.depth / 2 + 1.0]}>
            <Html center distanceFactor={25}>
              <div style={{ color: '#38bdf8', fontWeight: 800, fontSize: '14px', letterSpacing: '2px' }}>
                ▲ NORTH
              </div>
            </Html>
          </mesh>
          <mesh position={[LEVEL_BOUNDS.width / 2 - 1.5, 0, 0]}>
            <Html center distanceFactor={25}>
              <div style={{ color: '#94a3b8', fontWeight: 700, fontSize: '12px' }}>
                EAST ▶
              </div>
            </Html>
          </mesh>
          <mesh position={[-LEVEL_BOUNDS.width / 2 + 1.5, 0, 0]}>
            <Html center distanceFactor={25}>
              <div style={{ color: '#94a3b8', fontWeight: 700, fontSize: '12px' }}>
                ◀ WEST
              </div>
            </Html>
          </mesh>
          <mesh position={[0, 0, LEVEL_BOUNDS.depth / 2 - 1.0]}>
            <Html center distanceFactor={25}>
              <div style={{ color: '#94a3b8', fontWeight: 700, fontSize: '12px' }}>
                ▼ SOUTH
              </div>
            </Html>
          </mesh>
        </group>
      </group>

      {/* ---------------- 2. ARCHITECTURAL GREYBOX BLOCKS & ZONES ---------------- */}
      {LEVEL_BLOCK_ZONES.map((zone) => {
        const [px, py, pz] = zone.position;
        const [sx, sy, sz] = zone.size;

        return (
          <group key={zone.id} position={[px, py, pz]}>
            {/* Solid Greybox Volume */}
            <mesh castShadow receiveShadow>
              <boxGeometry args={[sx, sy, sz]} />
              <meshStandardMaterial
                color={zone.color}
                roughness={0.7}
                metalness={0.1}
                transparent={!!zone.opacity}
                opacity={zone.opacity || 1.0}
              />
            </mesh>

            {/* Edge Wireframe Outline for Blueprint Readability */}
            <mesh>
              <boxGeometry args={[sx + 0.02, sy + 0.02, sz + 0.02]} />
              <meshBasicMaterial
                color={zone.wireframeColor || '#ffffff'}
                wireframe
                transparent
                opacity={0.6}
              />
            </mesh>

            {/* In-World 3D Architectural Blueprint Label */}
            {showLabels && zone.label && (
              <group position={[0, sy / 2 + 0.35, 0]}>
                <Html center distanceFactor={20}>
                  <div
                    style={{
                      background: 'rgba(15, 23, 42, 0.92)',
                      border: `1px solid ${zone.wireframeColor || '#475569'}`,
                      borderRadius: '6px',
                      padding: '4px 8px',
                      color: '#f8fafc',
                      fontFamily: 'monospace',
                      fontSize: '11px',
                      fontWeight: 700,
                      whiteSpace: 'nowrap',
                      pointerEvents: 'none',
                      textAlign: 'center',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.5)',
                    }}
                  >
                    <div>{zone.label}</div>
                    {zone.subLabel && (
                      <div style={{ fontSize: '9px', color: '#94a3b8', marginTop: '2px', fontWeight: 400 }}>
                        {zone.subLabel}
                      </div>
                    )}
                  </div>
                </Html>
              </group>
            )}
          </group>
        );
      })}

      {/* ---------------- 3. TRAVERSAL ROUTES & SPLINES ---------------- */}
      {showRoutes &&
        LEVEL_ROUTES.map((route) => {
          if (activeFilter === 'retrieval' && route.type !== 'retrieval') return null;
          if (activeFilter === 'escape' && route.type !== 'escape') return null;

          return (
            <group key={route.id}>
              <Line
                points={route.points}
                color={route.color}
                lineWidth={3.5}
                dashed={!!route.dashed}
                dashScale={1.5}
                dashSize={0.6}
                gapSize={0.4}
              />
            </group>
          );
        })}

      {/* ---------------- 4. GAMEPLAY MARKERS (01 TO 10) ---------------- */}
      {showMarkers &&
        LEVEL_GAMEPLAY_MARKERS.map((marker) => {
          const [mx, my, mz] = marker.position;

          return (
            <group key={marker.id} position={[mx, my, mz]}>
              {/* Marker Base Pin Ring */}
              <mesh rotation={[-Math.PI / 2, 0, 0]}>
                <ringGeometry args={[0.35, 0.48, 24]} />
                <meshBasicMaterial color={marker.color} side={THREE.DoubleSide} />
              </mesh>

              {/* Vertical Laser Pillar Indicator */}
              <mesh position={[0, 0.6, 0]}>
                <cylinderGeometry args={[0.03, 0.03, 1.2, 8]} />
                <meshBasicMaterial color={marker.color} transparent opacity={0.7} />
              </mesh>

              {/* Glowing Numbered Pin Badge */}
              <group position={[0, 1.35, 0]}>
                <Html center distanceFactor={16}>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '5px',
                      background: 'rgba(15, 23, 42, 0.95)',
                      border: `2px solid ${marker.color}`,
                      borderRadius: '20px',
                      padding: '3px 8px',
                      color: '#ffffff',
                      fontFamily: 'Inter, monospace',
                      fontSize: '11px',
                      fontWeight: 700,
                      whiteSpace: 'nowrap',
                      pointerEvents: 'none',
                      boxShadow: `0 0 16px ${marker.color}66`,
                    }}
                  >
                    <span
                      style={{
                        background: marker.color,
                        color: '#000',
                        borderRadius: '50%',
                        width: '16px',
                        height: '16px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '10px',
                        fontWeight: 900,
                      }}
                    >
                      {marker.stepNumber}
                    </span>
                    <span>{marker.icon}</span>
                    <span>{marker.name}</span>
                  </div>
                </Html>
              </group>
            </group>
          );
        })}
    </group>
  );
};
