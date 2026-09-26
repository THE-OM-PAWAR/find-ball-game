import React, { useState, useEffect } from 'react';
import { useProgress } from '@react-three/drei';

interface LoadingScreenProps {
  onStartGame?: () => void;
  autoStart?: boolean;
}

const GULLY_TIPS = [
  'Gully Rule #1: One tip out, direct out of bounds is 6 and out!',
  'Tip: Use Shift to sprint across rooftops and leap between terraces!',
  'Tip: Climb water tank ladders and desert cooler units to access higher roofs.',
  'Sharma Uncle Alert: Retrieve the lost red leather cricket ball from the Balaji Plaza roof.',
  'Tip: Move close to walls and tap Space to mantle onto ledges.',
];

/**
 * Production-Grade Indian Gully Cricket Loading Screen & Title Card
 * Inspired by classic gully cricket match intros with real asset load tracking
 */
export const LoadingScreen: React.FC<LoadingScreenProps> = ({ onStartGame, autoStart = false }) => {
  const { progress, active, item } = useProgress();
  const [displayProgress, setDisplayProgress] = useState<number>(0);
  const [tipIndex, setTipIndex] = useState<number>(0);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const [isFadingOut, setIsFadingOut] = useState<boolean>(false);

  // Smooth progress bar interpolation
  useEffect(() => {
    const timer = setInterval(() => {
      setDisplayProgress((prev) => {
        const target = Math.min(100, Math.max(prev, progress));
        const step = (target - prev) * 0.25 + 1.2;
        const next = prev + step;
        if (next >= 100 && !active) {
          setIsLoaded(true);
          return 100;
        }
        return Math.min(100, next);
      });
    }, 30);

    // Guaranteed fallback: ensures button appears even on instant cache or CDN response
    const fallbackTimer = setTimeout(() => {
      setDisplayProgress(100);
      setIsLoaded(true);
    }, 2800);

    return () => {
      clearInterval(timer);
      clearTimeout(fallbackTimer);
    };
  }, [progress, active]);

  // Rotate fun gully tips
  useEffect(() => {
    const tipTimer = setInterval(() => {
      setTipIndex((i) => (i + 1) % GULLY_TIPS.length);
    }, 4000);
    return () => clearInterval(tipTimer);
  }, []);

  // Auto-start when requested
  useEffect(() => {
    if (isLoaded && autoStart) {
      const timeout = setTimeout(() => {
        handleStart();
      }, 500);
      return () => clearTimeout(timeout);
    }
  }, [isLoaded, autoStart]);

  const handleStart = () => {
    setIsFadingOut(true);
    setTimeout(() => {
      onStartGame?.();
    }, 600);
  };

  // Human-readable asset description
  const getAssetStatus = (): string => {
    if (displayProgress >= 100) return 'Gully Environment Ready!';
    if (item.includes('.glb')) return `Loading 3D Models (${Math.round(displayProgress)}%)`;
    if (item.includes('tree') || item.includes('Nature')) return 'Generating Vegetation & Trees...';
    if (item.includes('Climbing') || item.includes('Walking')) return 'Loading Character Animations...';
    return `Unpacking Neighborhood Shaders (${Math.round(displayProgress)}%)...`;
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 9999,
        background: 'radial-gradient(circle at center, #1e130b 0%, #0d0704 60%, #050201 100%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
        color: '#f8fafc',
        userSelect: 'none',
        transition: 'opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1), transform 0.6s ease',
        opacity: isFadingOut ? 0 : 1,
        pointerEvents: isFadingOut ? 'none' : 'auto',
        transform: isFadingOut ? 'scale(1.04)' : 'scale(1)',
      }}
    >
      {/* Background Decorative Gully Art Glow */}
      <div
        style={{
          position: 'absolute',
          top: '20%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '500px',
          height: '350px',
          background: 'radial-gradient(circle, rgba(245, 158, 11, 0.15) 0%, rgba(220, 38, 38, 0.05) 50%, transparent 80%)',
          filter: 'blur(50px)',
          pointerEvents: 'none',
        }}
      />

      {/* Main Title & Branding Card */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          maxWidth: '580px',
          padding: '0 24px',
          zIndex: 2,
        }}
      >
        {/* Kicker Header */}
        <p
          style={{
            fontSize: '11px',
            fontWeight: 800,
            letterSpacing: '3.5px',
            textTransform: 'uppercase',
            color: '#f59e0b',
            marginBottom: '10px',
            textShadow: '0 0 12px rgba(245, 158, 11, 0.5)',
          }}
        >
          TEAM OPLUS PRESENTS
        </p>

        {/* Main Logo Title */}
        <h1
          style={{
            fontSize: 'clamp(38px, 6vw, 64px)',
            fontWeight: 900,
            lineHeight: 1.05,
            letterSpacing: '-1px',
            margin: 0,
            color: '#ffffff',
            textShadow: '0 4px 20px rgba(0, 0, 0, 0.8)',
          }}
        >
          GULLY{' '}
          <span
            style={{
              background: 'linear-gradient(135deg, #f59e0b 0%, #ea580c 60%, #ef4444 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              display: 'inline-block',
            }}
          >
            CRICKET!
          </span>
        </h1>

        {/* Tagline */}
        <p
          style={{
            fontSize: '14px',
            fontWeight: 500,
            color: '#d1d5db',
            marginTop: '12px',
            marginBottom: '32px',
            letterSpacing: '0.2px',
          }}
        >
          One ₹50 ball. One angry uncle. All jugaad.
        </p>

        {/* Dynamic Progress Bar Section */}
        <div style={{ width: '100%', maxWidth: '380px', marginBottom: '28px' }}>
          {/* Progress Percent & Status */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              fontSize: '11px',
              fontWeight: 700,
              color: '#9ca3af',
              marginBottom: '8px',
            }}
          >
            <span style={{ color: '#fbbf24' }}>{getAssetStatus()}</span>
            <span>{Math.round(displayProgress)}%</span>
          </div>

          {/* Progress Track */}
          <div
            style={{
              width: '100%',
              height: '6px',
              background: 'rgba(255, 255, 255, 0.08)',
              borderRadius: '999px',
              overflow: 'hidden',
              boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.5)',
              position: 'relative',
            }}
          >
            <div
              style={{
                height: '100%',
                width: `${displayProgress}%`,
                background: 'linear-gradient(90deg, #f59e0b 0%, #ea580c 50%, #10b981 100%)',
                borderRadius: '999px',
                transition: 'width 0.15s ease-out',
                boxShadow: '0 0 12px rgba(245, 158, 11, 0.8)',
              }}
            />
          </div>
        </div>

        {/* Action Button: Start Mission */}
        {isLoaded ? (
          <button
            onClick={handleStart}
            style={{
              background: 'linear-gradient(135deg, #f59e0b 0%, #ea580c 100%)',
              color: '#ffffff',
              border: 'none',
              borderRadius: '12px',
              padding: '15px 38px',
              fontSize: '15px',
              fontWeight: 800,
              letterSpacing: '0.8px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              boxShadow: '0 8px 25px rgba(234, 88, 12, 0.45), 0 0 0 1px rgba(255,255,255,0.2)',
              transform: 'scale(1)',
              transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'scale(1.05)';
              e.currentTarget.style.boxShadow = '0 12px 30px rgba(234, 88, 12, 0.65)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
              e.currentTarget.style.boxShadow = '0 8px 25px rgba(234, 88, 12, 0.45)';
            }}
          >
            <span>START MISSION</span>
            <span style={{ fontSize: '18px' }}>▶</span>
          </button>
        ) : (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              color: '#f59e0b',
              fontSize: '13px',
              fontWeight: 700,
              padding: '12px 24px',
              background: 'rgba(245, 158, 11, 0.08)',
              borderRadius: '10px',
              border: '1px solid rgba(245, 158, 11, 0.2)',
            }}
          >
            <div
              style={{
                width: '14px',
                height: '14px',
                border: '2px solid rgba(245, 158, 11, 0.3)',
                borderTopColor: '#f59e0b',
                borderRadius: '50%',
                animation: 'spin 0.8s linear infinite',
              }}
            />
            <span>ENTERING GULLY...</span>
          </div>
        )}

        {/* Control Badges / Pills */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            gap: '10px',
            marginTop: '36px',
          }}
        >
          <span style={controlPillStyle}>🖱️ Drag to Look</span>
          <span style={controlPillStyle}>⌨️ WASD to Move</span>
          <span style={controlPillStyle}>⚡ Shift to Sprint</span>
          <span style={controlPillStyle}>🚀 Space to Jump & Mantle</span>
        </div>

        {/* Rotating Indian Match Tip */}
        <p
          style={{
            fontSize: '12px',
            color: '#71717a',
            fontStyle: 'italic',
            marginTop: '28px',
            minHeight: '20px',
            maxWidth: '440px',
          }}
        >
          {GULLY_TIPS[tipIndex]}
        </p>
      </div>

      {/* Footer Version Stamp */}
      <div
        style={{
          position: 'absolute',
          bottom: '18px',
          fontSize: '10px',
          fontWeight: 700,
          letterSpacing: '2px',
          color: '#52525b',
        }}
      >
        GULLY CRICKET 3D · LEVEL 1 MAP
      </div>

      {/* Inline Spin Keyframe Animation */}
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

const controlPillStyle: React.CSSProperties = {
  background: 'rgba(255, 255, 255, 0.05)',
  border: '1px solid rgba(255, 255, 255, 0.1)',
  borderRadius: '20px',
  padding: '6px 14px',
  fontSize: '11px',
  fontWeight: 600,
  color: '#d4d4d8',
  display: 'inline-flex',
  alignItems: 'center',
  gap: '6px',
};
