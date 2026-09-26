import React, { useState, useEffect } from 'react';
import { CheckpointManager } from './checkpoints/CheckpointManager';

/**
 * Production-Grade Indian Gully Cricket Victory & Game Completion Experience
 * Features:
 * - Golden & colorful celebratory confetti particles animation
 * - Glowing Trophy & Victory Title Card
 * - Mission statistics (Time Taken, Respawns, Ball Status)
 * - "PLAY AGAIN" & "EXPLORE FREELY" CTAs
 */
export const GameCompletionModal: React.FC = () => {
  const [isWon, setIsWon] = useState<boolean>(false);
  const [isDismissed, setIsDismissed] = useState<boolean>(false);
  const [elapsedSeconds, setElapsedSeconds] = useState<number>(0);
  const [respawns, setRespawns] = useState<number>(0);

  useEffect(() => {
    let startTimestamp = Date.now();

    const unsubscribe = CheckpointManager.subscribe((state) => {
      if (state.isGameWon) {
        setIsWon(true);
        setIsDismissed(false);
        const duration = Math.round((Date.now() - startTimestamp) / 1000);
        setElapsedSeconds(duration);
        setRespawns(state.respawnCount);
        playVictorySong();
      } else {
        if (!state.hasBall && state.completed.size === 0) {
          startTimestamp = Date.now();
        }
        setIsWon(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const playVictorySong = () => {
    try {
      const ctx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      const now = ctx.currentTime;

      // Chord Fanfare: C -> E -> G -> C -> D -> E
      const notes = [261.63, 329.63, 392.0, 523.25, 587.33, 659.25, 783.99, 1046.5];
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + idx * 0.12);
        gain.gain.setValueAtTime(0.2, now + idx * 0.12);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.12 + 0.8);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + idx * 0.12);
        osc.stop(now + idx * 0.12 + 0.8);
      });
    } catch {
      // Audio context suppressed if unmuted
    }
  };

  const handlePlayAgain = () => {
    setIsWon(false);
    setIsDismissed(true);
    CheckpointManager.restartGame();
  };

  const handleExplore = () => {
    setIsDismissed(true);
  };

  if (!isWon || isDismissed) return null;

  const minutes = Math.floor(elapsedSeconds / 60);
  const seconds = elapsedSeconds % 60;
  const timeFormatted = `${minutes}:${seconds.toString().padStart(2, '0')}`;

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 999999,
        background: 'radial-gradient(circle at center, rgba(15, 23, 42, 0.88) 0%, rgba(5, 7, 15, 0.96) 100%)',
        backdropFilter: 'blur(12px)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
        color: '#f8fafc',
        userSelect: 'none',
        animation: 'victoryFadeIn 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards',
      }}
    >
      {/* ── CELEBRATION CONFETTI PARTICLES ── */}
      <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', overflow: 'hidden', pointerEvents: 'none' }}>
        {Array.from({ length: 45 }).map((_, i) => {
          const colors = ['#f59e0b', '#ef4444', '#10b981', '#3b82f6', '#ec4899', '#8b5cf6', '#fbbf24'];
          const color = colors[i % colors.length];
          const left = `${(i * 2.3 + Math.random() * 5) % 100}%`;
          const delay = `${(i * 0.08).toFixed(2)}s`;
          const duration = `${(2.2 + (i % 5) * 0.4).toFixed(2)}s`;
          const size = `${6 + (i % 4) * 3}px`;

          return (
            <div
              key={i}
              style={{
                position: 'absolute',
                top: '-20px',
                left,
                width: size,
                height: size,
                background: color,
                borderRadius: i % 2 === 0 ? '50%' : '2px',
                boxShadow: `0 0 8px ${color}`,
                animation: `confettiFall ${duration} linear ${delay} infinite`,
              }}
            />
          );
        })}
      </div>

      {/* ── MAIN VICTORY CARD ── */}
      <div
        style={{
          position: 'relative',
          zIndex: 10,
          background: 'rgba(30, 41, 59, 0.85)',
          border: '1px solid rgba(245, 158, 11, 0.35)',
          borderRadius: '24px',
          padding: '36px 40px',
          maxWidth: '520px',
          width: '90%',
          textAlign: 'center',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.7), 0 0 40px rgba(245, 158, 11, 0.2)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          animation: 'cardScaleUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        }}
      >
        {/* Floating Glowing Trophy */}
        <div
          style={{
            fontSize: '52px',
            marginBottom: '8px',
            filter: 'drop-shadow(0 0 20px rgba(245, 158, 11, 0.8))',
            animation: 'trophyBounce 1.5s ease-in-out infinite alternate',
          }}
        >
          🏆
        </div>

        {/* Kicker */}
        <p
          style={{
            fontSize: '11px',
            fontWeight: 800,
            letterSpacing: '3px',
            textTransform: 'uppercase',
            color: '#f59e0b',
            margin: '0 0 6px 0',
          }}
        >
          MISSION ACCOMPLISHED
        </p>

        {/* Main Title */}
        <h1
          style={{
            fontSize: 'clamp(32px, 5vw, 44px)',
            fontWeight: 900,
            lineHeight: 1.1,
            margin: '0 0 12px 0',
            background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 50%, #ef4444 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            letterSpacing: '-0.5px',
          }}
        >
          GULLY LEGEND!
        </h1>

        {/* Subtitle */}
        <p
          style={{
            fontSize: '13px',
            color: '#cbd5e1',
            margin: '0 0 24px 0',
            lineHeight: 1.5,
          }}
        >
          You successfully scaled the rooftops, retrieved the lost leather ball from Balaji Plaza, and returned to the pitch. The match is back on!
        </p>

        {/* ── STATS GRID ── */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '12px',
            width: '100%',
            marginBottom: '28px',
          }}
        >
          <div style={statBoxStyle}>
            <span style={statLabelStyle}>⏱️ TIME</span>
            <span style={statValueStyle}>{timeFormatted}</span>
          </div>
          <div style={statBoxStyle}>
            <span style={statLabelStyle}>🎾 BALL</span>
            <span style={{ ...statValueStyle, color: '#10b981' }}>RECOVERED</span>
          </div>
          <div style={statBoxStyle}>
            <span style={statLabelStyle}>↺ FALLS</span>
            <span style={statValueStyle}>{respawns}</span>
          </div>
        </div>

        {/* ── ACTION BUTTONS ── */}
        <div style={{ display: 'flex', gap: '12px', width: '100%' }}>
          <button
            onClick={handlePlayAgain}
            style={{
              flex: 1,
              background: 'linear-gradient(135deg, #f59e0b 0%, #ea580c 100%)',
              color: '#ffffff',
              border: 'none',
              borderRadius: '12px',
              padding: '14px 20px',
              fontSize: '14px',
              fontWeight: 800,
              letterSpacing: '0.5px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              boxShadow: '0 8px 24px rgba(234, 88, 12, 0.45)',
              transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'scale(1.03)';
              e.currentTarget.style.boxShadow = '0 12px 30px rgba(234, 88, 12, 0.6)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
              e.currentTarget.style.boxShadow = '0 8px 24px rgba(234, 88, 12, 0.45)';
            }}
          >
            <span>PLAY AGAIN</span>
            <span>↺</span>
          </button>

          <button
            onClick={handleExplore}
            style={{
              flex: 1,
              background: 'rgba(255, 255, 255, 0.08)',
              color: '#e2e8f0',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              borderRadius: '12px',
              padding: '14px 20px',
              fontSize: '14px',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.14)';
              e.currentTarget.style.color = '#ffffff';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)';
              e.currentTarget.style.color = '#e2e8f0';
            }}
          >
            <span>FREE ROAM</span>
            <span>🏙️</span>
          </button>
        </div>
      </div>

      <style>{`
        @keyframes victoryFadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes cardScaleUp {
          from {
            opacity: 0;
            transform: scale(0.9) translateY(20px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }

        @keyframes trophyBounce {
          from { transform: translateY(0) scale(1); }
          to { transform: translateY(-6px) scale(1.06); }
        }

        @keyframes confettiFall {
          0% {
            transform: translateY(0) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(105vh) rotate(720deg);
            opacity: 0.2;
          }
        }
      `}</style>
    </div>
  );
};

const statBoxStyle: React.CSSProperties = {
  background: 'rgba(15, 23, 42, 0.65)',
  border: '1px solid rgba(255, 255, 255, 0.08)',
  borderRadius: '12px',
  padding: '10px 8px',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '4px',
};

const statLabelStyle: React.CSSProperties = {
  fontSize: '9px',
  fontWeight: 800,
  color: '#94a3b8',
  letterSpacing: '1px',
};

const statValueStyle: React.CSSProperties = {
  fontSize: '14px',
  fontWeight: 800,
  color: '#f8fafc',
};
