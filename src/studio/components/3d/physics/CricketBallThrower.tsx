import React, { useState, useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface Ball {
  id: number;
  position: THREE.Vector3;
  velocity: THREE.Vector3;
  rotation: THREE.Euler;
  rotationSpeed: THREE.Vector3;
  bounces: number;
}

// Simple Web Audio API sound generator for cricket ball impacts
const playBallHitSound = (speed: number) => {
  try {
    const AudioContext = window.AudioContext || (window as unknown as { webkitAudioContext: typeof window.AudioContext }).webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(140 + Math.random() * 40, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(40, ctx.currentTime + 0.08);

    const volume = Math.min(Math.max(speed * 0.05, 0.05), 0.3);
    gain.gain.setValueAtTime(volume, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.09);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.1);
  } catch (e) {
    // AudioContext autoplay restrictions or disabled
  }
};

export const CricketBallThrower: React.FC<{
  enabled?: boolean;
}> = ({ enabled = true }) => {
  const [balls, setBalls] = useState<Ball[]>([]);
  const nextId = useRef(1);

  // Function to spawn a ball bowled toward the house
  const spawnBall = (targetX = 0, targetY = 1.5, targetZ = 0) => {
    // Bowler position in the gully
    const startPos = new THREE.Vector3(
      (Math.random() - 0.5) * 2,
      1.2,
      7.0
    );
    const targetPos = new THREE.Vector3(targetX, targetY, targetZ);
    const dir = new THREE.Vector3().subVectors(targetPos, startPos).normalize();
    const speed = 14 + Math.random() * 4;

    const velocity = dir.multiplyScalar(speed);
    // Add an upward arc
    velocity.y += 3.5;

    const newBall: Ball = {
      id: nextId.current++,
      position: startPos,
      velocity: velocity,
      rotation: new THREE.Euler(0, 0, 0),
      rotationSpeed: new THREE.Vector3(
        Math.random() * 10,
        Math.random() * 10,
        Math.random() * 10
      ),
      bounces: 0,
    };

    setBalls((prev) => [...prev.slice(-6), newBall]); // Keep max 7 active balls
    playBallHitSound(12);
  };

  // Expose throw event listener on window
  useEffect(() => {
    const handleThrowEvent = (e: CustomEvent<{ x: number; y: number; z: number }>) => {
      const { x = 0, y = 1.5, z = -1 } = e.detail || {};
      spawnBall(x, y, z);
    };

    window.addEventListener('throw-cricket-ball' as any, handleThrowEvent);
    return () => {
      window.removeEventListener('throw-cricket-ball' as any, handleThrowEvent);
    };
  }, []);

  useFrame((_, delta) => {
    if (delta > 0.1) return; // Ignore large lag spikes

    setBalls((prevBalls) => {
      return prevBalls
        .map((ball) => {
          // Gravity
          ball.velocity.y -= 19.8 * delta;

          // Update position
          ball.position.x += ball.velocity.x * delta;
          ball.position.y += ball.velocity.y * delta;
          ball.position.z += ball.velocity.z * delta;

          // Rotation
          ball.rotation.x += ball.rotationSpeed.x * delta;
          ball.rotation.y += ball.rotationSpeed.y * delta;

          // Collision with Terrace Floor (y = 0.08)
          if (ball.position.y <= 0.08) {
            ball.position.y = 0.08;
            ball.velocity.y = -ball.velocity.y * 0.68; // Bounciness
            ball.velocity.x *= 0.85;
            ball.velocity.z *= 0.85;
            ball.bounces++;
            if (Math.abs(ball.velocity.y) > 0.5) {
              playBallHitSound(Math.abs(ball.velocity.y) * 3);
            }
          }

          // Collision with Roof Room Floor (y = 3.0, x in [-3, 1], z in [-4, 0])
          if (
            ball.position.y <= 3.08 &&
            ball.position.y >= 2.9 &&
            ball.position.x >= -3.2 &&
            ball.position.x <= 1.0 &&
            ball.position.z >= -3.8 &&
            ball.position.z <= -0.4
          ) {
            ball.position.y = 3.08;
            ball.velocity.y = -ball.velocity.y * 0.65;
            playBallHitSound(Math.abs(ball.velocity.y) * 2);
          }

          // Collision with Room Front Wall (z = -0.5)
          if (
            ball.position.z <= -0.45 &&
            ball.position.z >= -0.65 &&
            ball.position.y >= 0 &&
            ball.position.y <= 3.0 &&
            ball.position.x >= -3.2 &&
            ball.position.x <= 1.0
          ) {
            ball.velocity.z = Math.abs(ball.velocity.z) * 0.65;
            playBallHitSound(Math.abs(ball.velocity.z) * 2);
          }

          // Collision with Right Parapet (x = 4.8)
          if (ball.position.x >= 4.8 && ball.position.y <= 1.5) {
            ball.velocity.x = -Math.abs(ball.velocity.x) * 0.6;
            playBallHitSound(5);
          }

          // Collision with Left Parapet (x = -4.8)
          if (ball.position.x <= -4.8 && ball.position.y <= 1.5) {
            ball.velocity.x = Math.abs(ball.velocity.x) * 0.6;
            playBallHitSound(5);
          }

          return ball;
        })
        .filter((b) => b.position.y > -5 && b.bounces < 8);
    });
  });

  if (!enabled) return null;

  return (
    <group>
      {balls.map((ball) => (
        <group
          key={ball.id}
          position={[ball.position.x, ball.position.y, ball.position.z]}
          rotation={[ball.rotation.x, ball.rotation.y, ball.rotation.z]}
        >
          {/* Gully Cricket Red Rubber/Tennis Ball */}
          <mesh castShadow>
            <sphereGeometry args={[0.07, 16, 16]} />
            <meshStandardMaterial color="#ef4444" roughness={0.35} />
          </mesh>
          {/* White Rubber Seam Ring */}
          <mesh rotation={[Math.PI / 4, 0, 0]}>
            <torusGeometry args={[0.071, 0.005, 6, 20]} />
            <meshStandardMaterial color="#ffffff" roughness={0.6} />
          </mesh>
        </group>
      ))}
    </group>
  );
};
