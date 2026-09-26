import React, { useState, useEffect } from 'react';
import { CheckpointManager } from './checkpoints/CheckpointManager';

/**
 * Cinematic Ball Pick-Up Cutscene Overlay
 * Displays 21:9 cinematic letterboxing bars, golden shine effects,
 * dramatic title banner, and leather pickup audio at the 5th Checkpoint.
 */
export const BallPickupCinematicOverlay: React.FC = () => {
  const [isActive, setIsActive] = useState<boolean>(false);
  const [fadeState, setFadeState] = useState<'enter' | 'active' | 'exit'>('enter');

  useEffect(() => {
    const handlePickup = () => {
      setIsActive(true);
      setFadeState('enter');

      playPickupSound();

      const exitTimer = setTimeout(() => {
        setFadeState('exit');
      }, 2000);

      const closeTimer = setTimeout(() => {
        setIsActive(false);
      }, 2500);

      return () => {
        clearTimeout(exitTimer);
        clearTimeout(closeTimer);
      };
    };

    const unsubscribe = CheckpointManager.registerBallPickupEvent(handlePickup);
    return () => unsubscribe();
  }, []);

  const playPickupSound = () => {
    try {
      const ctx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      const now = ctx.currentTime;

      // 1. Leather Thud / Grab Impact
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(160, now);
      osc.frequency.exponentialRampToValueAtTime(60, now + 0.25);
      gain.gain.setValueAtTime(0.4, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.3);

      // 2. Sparkling Shimmer Chimes (Gleam Effect)
      const chimes = [659.25, 880.0, 1046.5, 1318.51, 1567.98];
      chimes.forEach((freq, i) => {
        const chimeOsc = ctx.createOscillator();
        const chimeGain = ctx.createGain();
        chimeOsc.type = 'sine';
        chimeOsc.frequency.setValueAtTime(freq, now + 0.08 + i * 0.06);
        chimeGain.gain.setValueAtTime(0.25, now + 0.08 + i * 0.06);
        chimeGain.gain.exponentialRampToValueAtTime(0.001, now + 0.08 + i * 0.06 + 0.6);
        chimeOsc.connect(chimeGain);
        chimeGain.connect(ctx.destination);
        chimeOsc.start(now + 0.08 + i * 0.06);
        chimeOsc.stop(now + 0.08 + i * 0.06 + 0.6);
      });
    } catch {
      // Audio context suppressed if unmuted
    }
  };

  if (!isActive) return null;

  const isExiting = fadeState === 'exit';

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 99998,
        pointerEvents: 'none',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
        userSelect: 'none',
        transition: 'opacity 0.4s ease',
        opacity: isExiting ? 0 : 1,
      }}
    >
      {/* ── TOP CINEMATIC LETTERBOX BAR ── */}
      <div
        style={{
          width: '100%',
          height: '12vh',
          background: '#000000',
          boxShadow: '0 8px 30px rgba(0, 0, 0, 0.8)',
          animation: 'letterboxDown 0.4s ease-out forwards',
        }}
      />

      {/* ── CENTER CINEMATIC TITLE CARD & GLEAM ── */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          padding: '0 20px',
          animation: 'cinematicTextPop 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        }}
      >
        {/* Glowing Ball Sparkle Icon */}
        <div
          style={{
            fontSize: '56px',
            marginBottom: '10px',
            filter: 'drop-shadow(0 0 25px rgba(239, 68, 68, 0.85)) drop-shadow(0 0 40px rgba(245, 158, 11, 0.6))',
            animation: 'ballGleamPulse 1.2s ease-in-out infinite alternate',
          }}
        >
          🎾
        </div>

        {/* Header Kicker */}
        <div
          style={{
            background: 'rgba(239, 68, 68, 0.2)',
            border: '1px solid rgba(239, 68, 68, 0.4)',
            color: '#f87171',
            padding: '4px 14px',
            borderRadius: '20px',
            fontSize: '11px',
            fontWeight: 800,
            letterSpacing: '2.5px',
            textTransform: 'uppercase',
            marginBottom: '10px',
            backdropFilter: 'blur(8px)',
          }}
        >
          ✦ OBJECTIVE ACQUIRED ✦
        </div>

        {/* Main Title */}
        <h1
          style={{
            margin: 0,
            fontSize: 'clamp(28px, 6vw, 48px)',
            fontWeight: 900,
            letterSpacing: '-0.5px',
            color: '#ffffff',
            textShadow: '0 4px 25px rgba(0, 0, 0, 0.9), 0 0 30px rgba(239, 68, 68, 0.6)',
          }}
        >
          RED LEATHER BALL{' '}
          <span
            style={{
              background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 50%, #ef4444 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            RETRIEVED!
          </span>
        </h1>

        {/* Subtitle */}
        <p
          style={{
            marginTop: '10px',
            fontSize: '14px',
            fontWeight: 600,
            color: '#e2e8f0',
            textShadow: '0 2px 10px rgba(0, 0, 0, 0.8)',
            maxWidth: '480px',
          }}
        >
          Now escape back across the rooftops to the Gully Pitch before uncle catches you!
        </p>
      </div>

      {/* ── BOTTOM CINEMATIC LETTERBOX BAR ── */}
      <div
        style={{
          width: '100%',
          height: '12vh',
          background: '#000000',
          boxShadow: '0 -8px 30px rgba(0, 0, 0, 0.8)',
          animation: 'letterboxUp 0.4s ease-out forwards',
        }}
      />

      <style>{`
        @keyframes letterboxDown {
          from { transform: translateY(-100%); }
          to { transform: translateY(0); }
        }

        @keyframes letterboxUp {
          from { transform: translateY(100%); }
          to { transform: translateY(0); }
        }

        @keyframes cinematicTextPop {
          0% {
            opacity: 0;
            transform: scale(0.9) translateY(15px);
          }
          100% {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }

        @keyframes ballGleamPulse {
          from {
            transform: scale(1) rotate(-5deg);
          }
          to {
            transform: scale(1.15) rotate(10deg);
          }
        }
      `}</style>
    </div>
  );
};
