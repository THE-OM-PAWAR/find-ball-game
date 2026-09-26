import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { CinematicCamera } from './CinematicCamera';
import { CricketMatchAction } from './CricketMatchAction';
import { SubtitleSystem } from './SubtitleSystem';
import { CinematicAudio } from './CinematicAudio';
import {
  CINEMATIC_TIMELINE,
  TOTAL_CINEMATIC_DURATION,
  type CinematicShot,
} from './cinematicData';

interface IntroSequenceProps {
  onComplete: () => void;
}

/**
 * Phase 5 Production-Grade Cinematic Opening Sequence
 * Orchestrates 3D cricket match action, dynamic shots, voices, subtitles,
 * and seamless transition into third-person gameplay.
 */
export const IntroSequence: React.FC<IntroSequenceProps> = ({ onComplete }) => {
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [currentShot, setCurrentShot] = useState<CinematicShot>(CINEMATIC_TIMELINE[0]);
  const isCompletedRef = useRef<boolean>(false);

  // Initialize audio engine on mount
  useEffect(() => {
    CinematicAudio.init();

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' || e.key === 'Escape') {
        handleSkip();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      CinematicAudio.stopAll();
    };
  }, []);

  const handleSkip = useCallback(() => {
    if (isCompletedRef.current) return;
    isCompletedRef.current = true;
    CinematicAudio.stopAll();
    onComplete();
  }, [onComplete]);

  // Main timeline progress loop
  useFrame((_, delta) => {
    if (isCompletedRef.current) return;

    const dt = Math.min(delta, 0.05);
    setCurrentTime((prevTime) => {
      const nextTime = prevTime + dt;

      // Find active shot
      const activeShot = CINEMATIC_TIMELINE.find(
        (s) => nextTime >= s.startTime && nextTime < s.startTime + s.duration
      );

      if (activeShot) {
        if (activeShot.id !== currentShot.id) {
          setCurrentShot(activeShot);
        }

        // Trigger voice clip if shot specifies an audio file
        if (activeShot.audioFile) {
          CinematicAudio.playVoiceClip(activeShot.id, activeShot.audioFile);
        }
      }

      // Check for completion
      if (nextTime >= TOTAL_CINEMATIC_DURATION) {
        handleSkip();
        return TOTAL_CINEMATIC_DURATION;
      }

      return nextTime;
    });
  });

  return (
    <>
      {/* ── 3D CINEMATIC CAMERA ── */}
      <CinematicCamera currentTime={currentTime} onShotChange={setCurrentShot} />

      {/* ── 3D CRICKET MATCH ANIMATIONS & BALL TRAJECTORY ── */}
      <CricketMatchAction currentTime={currentTime} />

      {/* ── 2D CINEMATIC SUBTITLES, LETTERBOXING & SKIP CTA ── */}
      <SubtitleSystem
        currentShot={currentShot}
        currentTime={currentTime}
        totalDuration={TOTAL_CINEMATIC_DURATION}
        onSkip={handleSkip}
      />
    </>
  );
};
