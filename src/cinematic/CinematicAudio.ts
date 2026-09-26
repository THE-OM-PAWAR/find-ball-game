/**
 * Production-Grade Cinematic Audio Manager for Gully Cricket Intro
 * Controls voice playback, ambient layering, bat-hit impacts, and cleanup.
 */
export class CinematicAudioManager {
  private activeAudios: HTMLAudioElement[] = [];
  private audioCtx: AudioContext | null = null;
  private playedShots: Set<string> = new Set();

  public init() {
    try {
      this.audioCtx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
    } catch {
      // Handled silently if browser restricts autoplay before user gesture
    }
  }

  public playVoiceClip(shotId: string, audioFile: string) {
    if (this.playedShots.has(shotId)) return;
    this.playedShots.add(shotId);

    try {
      const audio = new Audio(audioFile);
      audio.volume = 1.0;
      audio.play().catch(() => {
        // Suppressed if user hasn't clicked page yet
      });
      this.activeAudios.push(audio);
    } catch {
      // Audio playback failed gracefully
    }
  }

  public playBatHitImpact() {
    if (!this.audioCtx) return;
    try {
      const ctx = this.audioCtx;
      const now = ctx.currentTime;

      // 1. Solid Willow Wood Crack (Square + Lowpass)
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(440, now);
      osc.frequency.exponentialRampToValueAtTime(110, now + 0.18);

      gain.gain.setValueAtTime(0.7, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.2);

      // 2. High-Frequency Wood Resonant "TOCK"
      const oscHigh = ctx.createOscillator();
      const gainHigh = ctx.createGain();
      oscHigh.type = 'sine';
      oscHigh.frequency.setValueAtTime(1250, now);
      oscHigh.frequency.exponentialRampToValueAtTime(320, now + 0.12);

      gainHigh.gain.setValueAtTime(0.5, now);
      gainHigh.gain.exponentialRampToValueAtTime(0.001, now + 0.14);

      oscHigh.connect(gainHigh);
      gainHigh.connect(ctx.destination);
      oscHigh.start(now);
      oscHigh.stop(now + 0.14);
    } catch {
      // Ignored
    }
  }

  public playBallRooftopBounce() {
    if (!this.audioCtx) return;
    try {
      const ctx = this.audioCtx;
      const now = ctx.currentTime;

      // Double Terracotta Roof Bounce (Tap-Tap)
      [0, 0.22].forEach((delay, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(220 - i * 40, now + delay);
        osc.frequency.exponentialRampToValueAtTime(80, now + delay + 0.12);

        gain.gain.setValueAtTime(0.4 - i * 0.15, now + delay);
        gain.gain.exponentialRampToValueAtTime(0.001, now + delay + 0.12);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + delay);
        osc.stop(now + delay + 0.12);
      });
    } catch {
      // Ignored
    }
  }

  public stopAll() {
    this.activeAudios.forEach((audio) => {
      try {
        audio.pause();
        audio.currentTime = 0;
      } catch {
        // Ignored
      }
    });
    this.activeAudios = [];
    this.playedShots.clear();
  }
}

export const CinematicAudio = new CinematicAudioManager();
