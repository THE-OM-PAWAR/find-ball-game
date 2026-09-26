import * as THREE from 'three';

export interface CheckpointData {
  id: number;
  name: string;
  subtext: string;
  position: [number, number, number];
  color: string;
  phase: 1 | 2; // 1 = Retrieve Ball, 2 = Return to Pitch
  isBall?: boolean;
  isVictory?: boolean;
}

export const GULLY_CHECKPOINTS: CheckpointData[] = [
  // ── PHASE 1: ASCENT & RETRIEVAL (1 -> 5) ──
  {
    id: 1,
    name: '1. Stairs Entrance',
    subtext: 'Sharma Niwas Ground Approach',
    position: [-8.5, 0.05, -16.2],
    color: '#06b6d4', // Cyan neon
    phase: 1,
  },
  {
    id: 2,
    name: '2. Sharma Terrace',
    subtext: 'Climb Desert Cooler to Roof (+3.2m)',
    position: [-8.5, 3.24, -22.0],
    color: '#38bdf8', // Sky blue
    phase: 1,
  },
  {
    id: 3,
    name: '3. Gupta Terraces',
    subtext: 'Cross Scaffold Plank Bridge (+6.2m)',
    position: [1.8, 6.24, -22.4],
    color: '#f59e0b', // Amber gold
    phase: 1,
  },
  {
    id: 4,
    name: '4. Tower Bridge',
    subtext: 'Ascend Ladder to Mahavir Heights (+6.2m)',
    position: [18.0, 6.26, -18.5],
    color: '#f97316', // Vibrant Orange
    phase: 1,
  },
  {
    id: 5,
    name: '5. RETRIEVE BALL',
    subtext: 'Balaji Plaza Rooftop (+6.65m)',
    position: [22.4, 6.65, -0.4],
    color: '#ef4444', // Radiant Crimson
    phase: 1,
    isBall: true,
  },

  // ── PHASE 2: EXACT SAME RETURN ROUTE IN REVERSE (6 -> 10) ──
  {
    id: 6,
    name: '6. Tower Bridge (Return)',
    subtext: 'Cross Back Towards North Terraces (+6.24m)',
    position: [18.0, 6.26, -18.5],
    color: '#a855f7', // Purple Neon
    phase: 2,
  },
  {
    id: 7,
    name: '7. Gupta Terraces (Return)',
    subtext: 'Cross Scaffold Planks to Sharma Roof (+6.24m)',
    position: [1.8, 6.24, -22.4],
    color: '#8b5cf6', // Violet
    phase: 2,
  },
  {
    id: 8,
    name: '8. Sharma Terrace (Return)',
    subtext: 'Descend Desert Cooler to Stairs (+3.24m)',
    position: [-8.5, 3.24, -22.0],
    color: '#38bdf8', // Sky Blue
    phase: 2,
  },
  {
    id: 9,
    name: '9. Ground Stairs (Return)',
    subtext: 'Reach Ground Level Gully (+0.05m)',
    position: [-8.5, 0.05, -16.2],
    color: '#06b6d4', // Cyan
    phase: 2,
  },
  {
    id: 10,
    name: '10. GULLY PITCH WICKETS',
    subtext: 'Deliver Ball to Batsman (Ground Pitch)',
    position: [0.0, 0.05, 0.0],
    color: '#10b981', // Victory Emerald
    phase: 2,
    isVictory: true,
  },
];

type CheckpointListener = (state: {
  activeId: number;
  completed: Set<number>;
  hasBall: boolean;
  isGameWon: boolean;
  lastSafePos: THREE.Vector3;
  notification: string | null;
  respawnCount: number;
}) => void;

class CheckpointManagerService {
  public activeId: number = 1;
  public completed: Set<number> = new Set();
  public hasBall: boolean = false;
  public isGameWon: boolean = false;
  public lastSafePos: THREE.Vector3 = new THREE.Vector3(0, 0.2, 14);
  public playerPos: THREE.Vector3 = new THREE.Vector3(0, 0.2, 14);
  public notification: string | null = null;
  public respawnCount: number = 0;
  public isDesyncing: boolean = false;
  
  private listeners: Set<CheckpointListener> = new Set();
  private notificationTimer: ReturnType<typeof setTimeout> | null = null;
  private respawnHandlers: Set<(pos: THREE.Vector3) => void> = new Set();
  private desyncHandlers: Set<() => void> = new Set();

  public subscribe(listener: CheckpointListener): () => void {
    this.listeners.add(listener);
    listener({
      activeId: this.activeId,
      completed: this.completed,
      hasBall: this.hasBall,
      isGameWon: this.isGameWon,
      lastSafePos: this.lastSafePos,
      notification: this.notification,
      respawnCount: this.respawnCount,
    });
    return () => {
      this.listeners.delete(listener);
    };
  }

  public registerRespawnHandler(handler: (pos: THREE.Vector3) => void): () => void {
    this.respawnHandlers.add(handler);
    return () => {
      this.respawnHandlers.delete(handler);
    };
  }

  public registerDesyncEvent(handler: () => void): () => void {
    this.desyncHandlers.add(handler);
    return () => {
      this.desyncHandlers.delete(handler);
    };
  }

  public updatePlayerPos(x: number, y: number, z: number) {
    this.playerPos.set(x, y, z);
    this.checkProximity(x, y, z);
  }

  /**
   * Fast, zero-allocation cylinder proximity detection against active checkpoint.
   * Runs in O(1) time per frame.
   */
  private checkProximity(px: number, py: number, pz: number) {
    if (this.isDesyncing) return;
    if (this.activeId > GULLY_CHECKPOINTS.length) return;

    const cp = GULLY_CHECKPOINTS.find((c) => c.id === this.activeId);
    if (!cp || this.completed.has(cp.id)) return;

    const [cx, cy, cz] = cp.position;
    const dx = px - cx;
    const dz = pz - cz;
    const distSq = dx * dx + dz * dz;
    const dy = Math.abs(py - cy);

    // Fast cylinder trigger: 2.4m horizontal radius and 2.5m vertical range
    if (distSq <= 2.4 * 2.4 && dy <= 2.5) {
      this.reachCheckpoint(cp);
    }
  }

  public isPickingUpBall: boolean = false;
  private ballPickupHandlers: Set<() => void> = new Set();

  public registerBallPickupEvent(handler: () => void): () => void {
    this.ballPickupHandlers.add(handler);
    return () => {
      this.ballPickupHandlers.delete(handler);
    };
  }

  public reachCheckpoint(cp: CheckpointData) {
    if (this.completed.has(cp.id) || this.isDesyncing || this.isPickingUpBall) return;

    this.completed.add(cp.id);
    // Update safe spawn position (ensure feet are right above floor)
    this.lastSafePos.set(cp.position[0], cp.position[1] + 0.15, cp.position[2]);
    this.activeId = cp.id + 1;

    if (cp.isBall) {
      this.isPickingUpBall = true;
      this.ballPickupHandlers.forEach((h) => h());
      this.setBanner('🎾 PICKING UP LOST BALL...');
      this.playSound(true);

      // Cutscene completes in 2.5 seconds
      setTimeout(() => {
        this.isPickingUpBall = false;
        this.hasBall = true;
        this.setBanner('🎾 BALL RETRIEVED! Return it to the Gully Pitch!');
        this.notify();
      }, 2500);
    } else if (cp.isVictory) {
      this.isGameWon = true;
      this.setBanner('🏆 MISSION COMPLETE! THE GULLY MATCH RESUMES!');
      this.playSound(true);
    } else {
      const stepText = cp.phase === 1 ? `CHECKPOINT ${cp.id}/5 (TO BALL)` : `CHECKPOINT ${cp.id - 5}/5 (TO PITCH)`;
      this.setBanner(`✓ ${stepText} REACHED`);
      this.playSound(false);
    }

    this.notify();
  }


  public requestRespawn(_reason: string = 'Fell off rooftops') {
    if (this.isDesyncing) return;
    this.isDesyncing = true;
    this.respawnCount++;

    // 1. Immediately trigger black-and-white desynchronized screen animation
    this.desyncHandlers.forEach((handler) => handler());

    // 2. Reposition player at 1.2s while screen is fully black/grayscale
    setTimeout(() => {
      const targetPos = this.lastSafePos.clone();
      this.respawnHandlers.forEach((handler) => {
        handler(targetPos);
      });
    }, 1200);

    // 3. Unlock controls and restore normal gameplay at 2.0s
    setTimeout(() => {
      this.isDesyncing = false;
      this.notify();
    }, 2000);

    this.notify();
  }

  public restartGame() {
    this.activeId = 1;
    this.completed.clear();
    this.hasBall = false;
    this.isGameWon = false;
    this.respawnCount = 0;
    this.lastSafePos.set(0, 0.2, 14);

    const initialSpawn = new THREE.Vector3(0, 0.2, 14);
    this.respawnHandlers.forEach((handler) => {
      handler(initialSpawn);
    });

    this.setBanner('🎮 NEW MISSION: Retrieve the lost cricket ball!');
    this.notify();
  }

  private setBanner(text: string) {
    this.notification = text;
    if (this.notificationTimer) clearTimeout(this.notificationTimer);
    this.notificationTimer = setTimeout(() => {
      this.notification = null;
      this.notify();
    }, 3500);
  }

  private playSound(isVictory: boolean) {
    try {
      const ctx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      const now = ctx.currentTime;

      if (isVictory) {
        osc.frequency.setValueAtTime(523.25, now);
        osc.frequency.setValueAtTime(659.25, now + 0.12);
        osc.frequency.setValueAtTime(783.99, now + 0.24);
        osc.frequency.setValueAtTime(1046.50, now + 0.36);
        gain.gain.setValueAtTime(0.28, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 1.2);
        osc.start(now);
        osc.stop(now + 1.2);
      } else {
        osc.frequency.setValueAtTime(659.25, now);
        osc.frequency.setValueAtTime(880.00, now + 0.08);
        gain.gain.setValueAtTime(0.22, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);
        osc.start(now);
        osc.stop(now + 0.5);
      }
    } catch {
      // Audio context ignored if not yet unmuted
    }
  }

  private notify() {
    this.listeners.forEach((listener) => {
      listener({
        activeId: this.activeId,
        completed: new Set(this.completed),
        hasBall: this.hasBall,
        isGameWon: this.isGameWon,
        lastSafePos: this.lastSafePos,
        notification: this.notification,
        respawnCount: this.respawnCount,
      });
    });
  }
}

export const CheckpointManager = new CheckpointManagerService();
