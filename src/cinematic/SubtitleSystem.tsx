import React from 'react';
import { Html } from '@react-three/drei';
import type { CinematicShot } from './cinematicData';

interface SubtitleSystemProps {
  currentShot: CinematicShot | null;
  currentTime: number;
  totalDuration: number;
  onSkip: () => void;
}

/**
 * Production-Grade Cinematic Subtitle & Letterbox Overlay
 * Includes speaker badges, localization subtitles, progress bar, and skip button.
 */
export const SubtitleSystem: React.FC<SubtitleSystemProps> = ({
  currentShot,
  currentTime,
  totalDuration,
  onSkip,
}) => {
  const progressPercent = Math.min(100, Math.max(0, (currentTime / totalDuration) * 100));

  return (
    <Html fullscreen style={{ pointerEvents: 'none' }}>
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          zIndex: 99990,
          pointerEvents: 'none',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
          userSelect: 'none',
        }}
      >

      {/* ── TOP CINEMATIC BAR & SKIP BUTTON ── */}
      <div
        style={{
          width: '100%',
          height: '10vh',
          minHeight: '70px',
          background: 'linear-gradient(180deg, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.7) 70%, transparent 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 32px',
          boxSizing: 'border-box',
          pointerEvents: 'auto',
        }}
      >
        {/* Title Stamp */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontSize: '18px' }}>🏏</span>
          <div>
            <div
              style={{
                fontSize: '11px',
                fontWeight: 800,
                letterSpacing: '2px',
                textTransform: 'uppercase',
                color: '#f59e0b',
              }}
            >
              GULLY CRICKET 3D
            </div>
            <div style={{ fontSize: '10px', color: '#94a3b8', fontWeight: 600 }}>
              STORY INTRO: THE LOST BALL
            </div>
          </div>
        </div>

        {/* Skip Button */}
        <button
          onClick={onSkip}
          style={{
            background: 'rgba(255, 255, 255, 0.12)',
            backdropFilter: 'blur(10px)',
            color: '#f8fafc',
            border: '1px solid rgba(255, 255, 255, 0.25)',
            borderRadius: '24px',
            padding: '8px 20px',
            fontSize: '12px',
            fontWeight: 800,
            letterSpacing: '1px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.4)',
            transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'linear-gradient(135deg, #f59e0b 0%, #ea580c 100%)';
            e.currentTarget.style.transform = 'scale(1.04)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.12)';
            e.currentTarget.style.transform = 'scale(1)';
          }}
        >
          <span>SKIP INTRO</span>
          <span style={{ fontSize: '14px' }}>▶▶</span>
        </button>
      </div>

      {/* ── BOTTOM CINEMATIC BAR & SUBTITLE CARD ── */}
      <div
        style={{
          width: '100%',
          background: 'linear-gradient(0deg, rgba(0,0,0,0.96) 0%, rgba(0,0,0,0.8) 70%, transparent 100%)',
          padding: '24px 32px 30px',
          boxSizing: 'border-box',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '12px',
        }}
      >
        {/* Dynamic Subtitle Card */}
        {currentShot && currentShot.dialogue && (
          <div
            key={currentShot.id}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center',
              maxWidth: '680px',
              animation: 'subtitleFadeIn 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards',
            }}
          >
            {/* Speaker Tag */}
            {currentShot.speaker && (
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  background: 'rgba(15, 23, 42, 0.85)',
                  border: `1px solid ${currentShot.speakerColor || '#f59e0b'}66`,
                  padding: '4px 14px',
                  borderRadius: '20px',
                  marginBottom: '8px',
                  boxShadow: `0 0 15px ${currentShot.speakerColor || '#f59e0b'}33`,
                }}
              >
                <span
                  style={{
                    fontSize: '11px',
                    fontWeight: 900,
                    letterSpacing: '1.5px',
                    color: currentShot.speakerColor || '#f59e0b',
                    textTransform: 'uppercase',
                  }}
                >
                  {currentShot.speaker}
                </span>
                {currentShot.speakerRole && (
                  <span
                    style={{
                      fontSize: '9px',
                      fontWeight: 700,
                      color: '#94a3b8',
                      textTransform: 'uppercase',
                    }}
                  >
                    • {currentShot.speakerRole}
                  </span>
                )}
              </div>
            )}

            {/* Primary Dialogue Line */}
            <div
              style={{
                fontSize: 'clamp(15px, 2.2vw, 20px)',
                fontWeight: 700,
                color: '#ffffff',
                lineHeight: 1.4,
                textShadow: '0 2px 10px rgba(0, 0, 0, 0.9), 0 0 20px rgba(0,0,0,0.8)',
                letterSpacing: '0.2px',
              }}
            >
              {currentShot.dialogue}
            </div>

            {/* Hindi Subtitle Line */}
            {currentShot.dialogueHindi && (
              <div
                style={{
                  fontSize: '13px',
                  fontWeight: 500,
                  color: '#cbd5e1',
                  marginTop: '4px',
                  textShadow: '0 1px 8px rgba(0, 0, 0, 0.9)',
                }}
              >
                {currentShot.dialogueHindi}
              </div>
            )}
          </div>
        )}

        {/* Cinematic Progress Track */}
        <div
          style={{
            width: '100%',
            maxWidth: '480px',
            height: '3px',
            background: 'rgba(255, 255, 255, 0.15)',
            borderRadius: '999px',
            overflow: 'hidden',
            marginTop: '8px',
          }}
        >
          <div
            style={{
              height: '100%',
              width: `${progressPercent}%`,
              background: 'linear-gradient(90deg, #f59e0b 0%, #ea580c 50%, #10b981 100%)',
              borderRadius: '999px',
              transition: 'width 0.1s linear',
              boxShadow: '0 0 10px rgba(245, 158, 11, 0.8)',
            }}
          />
        </div>
      </div>

      <style>{`
        @keyframes subtitleFadeIn {
          from {
            opacity: 0;
            transform: translateY(8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
      </div>
    </Html>
  );
};

