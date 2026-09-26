import React, { useState, useEffect } from 'react';
import { CheckpointManager } from './checkpoints/CheckpointManager';

/**
 * Cinematic Black-and-White "DESYNCHRONIZED" Respawn Sequence
 * Styled after classic high-impact death screens with dark vignette,
 * bold red typography, procedural sub-bass audio hit, and 2-second transition.
 */
export const DesynchronizedOverlay: React.FC = () => {
  const [isDesync, setIsDesync] = useState<boolean>(false);
  const [fadeState, setFadeState] = useState<'entering' | 'active' | 'exiting'>('entering');

  useEffect(() => {
    const handleDesync = () => {
      setIsDesync(true);
      setFadeState('entering');

      // Play dramatic desync bass drop and glitch sound
      playDesyncSound();

      // Trigger exit fade at 1.5s
      const exitTimer = setTimeout(() => {
        setFadeState('exiting');
      }, 1500);

      // Complete reset at 2.0s
      const finishTimer = setTimeout(() => {
        setIsDesync(false);
      }, 2000);

      return () => {
        clearTimeout(exitTimer);
        clearTimeout(finishTimer);
      };
    };

    const unsubscribe = CheckpointManager.registerDesyncEvent(handleDesync);
    return () => unsubscribe();
  }, []);

  const playDesyncSound = () => {
    try {
      const ctx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      const now = ctx.currentTime;

      // 1. Deep Sub-Bass Impact Boom (85Hz -> 32Hz)
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(85, now);
      osc.frequency.exponentialRampToValueAtTime(32, now + 1.2);

      gain.gain.setValueAtTime(0.45, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 1.4);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 1.4);

      // 2. Distorted Low-Pass Noise Burst / Static Hit
      const bufferSize = ctx.sampleRate * 0.4;
      const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.25));
      }

      const whiteNoise = ctx.createBufferSource();
      whiteNoise.buffer = noiseBuffer;

      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(380, now);
      filter.frequency.linearRampToValueAtTime(80, now + 0.4);

      const noiseGain = ctx.createGain();
      noiseGain.gain.setValueAtTime(0.3, now);
      noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);

      whiteNoise.connect(filter);
      filter.connect(noiseGain);
      noiseGain.connect(ctx.destination);
      whiteNoise.start(now);
    } catch {
      // Audio context suppressed if unmuted
    }
  };

  if (!isDesync) return null;

  const isExiting = fadeState === 'exiting';

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 99999,
        pointerEvents: 'none',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: "'Impact', 'Arial Black', sans-serif",
        userSelect: 'none',
        transition: 'opacity 0.5s ease-out',
        opacity: isExiting ? 0 : 1,
      }}
    >
      {/* Heavy Cinematic Black Vignette & Grayscale Flash */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: 'radial-gradient(circle at center, rgba(10, 4, 4, 0.72) 0%, rgba(0, 0, 0, 0.94) 70%, #000000 100%)',
          backdropFilter: 'grayscale(100%) contrast(160%) brightness(0.6)',
          WebkitBackdropFilter: 'grayscale(100%) contrast(160%) brightness(0.6)',
          animation: 'vignettePulse 2s ease-out forwards',
        }}
      />

      {/* Subtle Noise / Grain Texture Overlay */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: 'radial-gradient(ellipse at center, transparent 30%, rgba(0,0,0,0.8) 100%)',
          mixBlendMode: 'multiply',
          pointerEvents: 'none',
        }}
      />

      {/* Main Bold Red "DESYNCHRONIZED" Title Card */}
      <div
        style={{
          position: 'relative',
          zIndex: 10,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          animation: 'desyncTextZoom 2s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        }}
      >
        <h1
          style={{
            margin: 0,
            fontSize: 'clamp(46px, 9vw, 92px)',
            fontWeight: 900,
            textTransform: 'lowercase',
            letterSpacing: '3px',
            color: '#dc2626',
            textShadow: '0 0 35px rgba(220, 38, 38, 0.85), 0 6px 20px rgba(0, 0, 0, 0.95), 0 0 10px rgba(239, 68, 68, 0.5)',
            fontFamily: "'Impact', 'Arial Black', sans-serif",
            lineHeight: 1,
          }}
        >
          desynchronised
        </h1>

        <p
          style={{
            fontFamily: "'Inter', -apple-system, sans-serif",
            fontSize: '12px',
            fontWeight: 700,
            letterSpacing: '4px',
            textTransform: 'uppercase',
            color: '#a1a1aa',
            marginTop: '16px',
            textShadow: '0 2px 10px rgba(0,0,0,0.9)',
          }}
        >
          Restarting from Checkpoint
        </p>
      </div>

      <style>{`
        @keyframes desyncTextZoom {
          0% {
            transform: scale(0.85);
            opacity: 0;
            filter: blur(8px);
          }
          15% {
            transform: scale(1.02);
            opacity: 1;
            filter: blur(0px);
          }
          100% {
            transform: scale(1.1);
            opacity: 1;
            filter: blur(0px);
          }
        }

        @keyframes vignettePulse {
          0% {
            opacity: 0;
          }
          20% {
            opacity: 1;
          }
          100% {
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
};
