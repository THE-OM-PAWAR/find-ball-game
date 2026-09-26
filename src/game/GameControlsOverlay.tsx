import React, { useState, useEffect } from 'react';

/**
 * Minimalist In-Game Controls HUD Overlay
 * Displays controls when game starts with a sleek collapsible pill
 */
export const GameControlsOverlay: React.FC = () => {
  const [isMinimized, setIsMinimized] = useState<boolean>(false);

  // Auto-minimize after 10 seconds of gameplay
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsMinimized(true);
    }, 9000);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === 'h') {
        setIsMinimized((prev) => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '22px',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 1000,
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
        userSelect: 'none',
        pointerEvents: 'auto',
        transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
      }}
    >
      {isMinimized ? (
        <button
          onClick={() => setIsMinimized(false)}
          style={{
            background: 'rgba(15, 23, 42, 0.75)',
            backdropFilter: 'blur(10px)',
            color: '#94a3b8',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '20px',
            padding: '5px 14px',
            fontSize: '11px',
            fontWeight: 600,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            boxShadow: '0 4px 16px rgba(0, 0, 0, 0.3)',
            transition: 'all 0.2s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = '#f8fafc';
            e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.25)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = '#94a3b8';
            e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
          }}
        >
          <span>⌨️</span>
          <span>Controls [H]</span>
        </button>
      ) : (
        <div
          style={{
            background: 'rgba(15, 23, 42, 0.82)',
            backdropFilter: 'blur(14px)',
            border: '1px solid rgba(255, 255, 255, 0.12)',
            borderRadius: '16px',
            padding: '8px 16px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.45)',
            animation: 'fadeInUp 0.4s ease-out',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={pillStyle}><kbd style={kbdStyle}>WASD</kbd> Move</span>
            <span style={pillStyle}><kbd style={kbdStyle}>Shift</kbd> Sprint</span>
            <span style={pillStyle}><kbd style={kbdStyle}>Space</kbd> Jump / Climb</span>
            <span style={pillStyle}><kbd style={kbdStyle}>Mouse</kbd> Look</span>
            <span style={pillStyle}><kbd style={kbdStyle}>C</kbd> Crouch</span>
          </div>

          <button
            onClick={() => setIsMinimized(true)}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#64748b',
              cursor: 'pointer',
              fontSize: '14px',
              padding: '2px 6px',
              borderRadius: '6px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'color 0.2s',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = '#cbd5e1')}
            onMouseLeave={(e) => (e.currentTarget.style.color = '#64748b')}
            title="Minimize controls"
          >
            ✕
          </button>
        </div>
      )}

      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

const pillStyle: React.CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: '5px',
  fontSize: '11px',
  fontWeight: 600,
  color: '#cbd5e1',
};

const kbdStyle: React.CSSProperties = {
  background: 'rgba(255, 255, 255, 0.1)',
  border: '1px solid rgba(255, 255, 255, 0.2)',
  borderRadius: '4px',
  padding: '2px 6px',
  fontSize: '10px',
  fontWeight: 700,
  color: '#f8fafc',
  fontFamily: 'monospace',
  boxShadow: '0 1px 2px rgba(0,0,0,0.3)',
};
