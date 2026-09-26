import * as THREE from 'three';

export interface CheckpointData {
  id: number;
  name: string;
  subtext: string;
  position: [number, number, number];
  color: string;
  isFinal?: boolean;
}

export const GULLY_CHECKPOINTS: CheckpointData[] = [
  {
    id: 1,
    name: '1. Stairs Entrance',
    subtext: 'Sharma Niwas Ground Approach',
    position: [-8.5, 0.05, -16.2],
    color: '#06b6d4', // Cyan neon
  },
  {
    id: 2,
    name: '2. Sharma Terrace',
    subtext: 'Climb Desert Cooler to Roof (+3.2m)',
    position: [-8.5, 3.24, -22.0],
    color: '#38bdf8', // Sky blue
  },
  {
    id: 3,
    name: '3. Gupta Terraces',
    subtext: 'Cross Scaffold Plank Bridge (+6.2m)',
    position: [1.8, 6.24, -22.4],
    color: '#f59e0b', // Amber gold
  },
  {
    id: 4,
    name: '4. Tower Bridge',
    subtext: 'Ascend Ladder to Mahavir Heights (+6.2m)',
    position: [18.0, 6.26, -18.5],
    color: '#f97316', // Vibrant Orange
  },
  {
    id: 5,
    name: '5. LOST BALL OBJECTIVE',
    subtext: 'Balaji Plaza Rooftop (+6.65m)',
    position: [22.4, 6.65, -0.4],
    color: '#ef4444', // Radiant Crimson-Gold
    isFinal: true,
  },
];

type CheckpointListener = (state: {
  activeId: number;
  completed: Set<number>;
  lastSafePos: THREE.Vector3;
  notification: string | null;
  respawnCount: number;
}) => void;

class CheckpointManagerService {
  public activeId: number = 1;
  public completed: Set<number> = new Set();
  public lastSafePos: THREE.Vector3 = new THREE.Vector3(0, 0.2, 14);
  public playerPos: THREE.Vector3 = new THREE.Vector3(0, 0.2, 14);
  public notification: string | null = null;
  public respawnCount: number = 0;
  
  private listeners: Set<CheckpointListener> = new Set();
  private notificationTimer: ReturnType<typeof setTimeout> | null = null;
  private respawnHandlers: Set<(pos: THREE.Vector3) => void> = new Set();

  public subscribe(listener: CheckpointListener): () => void {
    this.listeners.add(listener);
    listener({
      activeId: this.activeId,
      completed: this.completed,
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

  public updatePlayerPos(x: number, y: number, z: number) {
    this.playerPos.set(x, y, z);
    this.checkProximity(x, y, z);
  }

  /**
   * Fast, zero-allocation cylinder proximity detection against active checkpoint.
   * Runs in O(1) time per frame.
   */
  private checkProximity(px: number, py: number, pz: number) {
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

  public reachCheckpoint(cp: CheckpointData) {
    if (this.completed.has(cp.id)) return;

    this.completed.add(cp.id);
    // Update safe spawn position (ensure feet are right above floor)
    this.lastSafePos.set(cp.position[0], cp.position[1] + 0.15, cp.position[2]);
    this.activeId = cp.id + 1;

    if (cp.isFinal) {
      this.setBanner('🎉 MISSION ACCOMPLISHED: LOST BALL RETRIEVED!');
      this.playSound(true);
    } else {
      this.setBanner(`✓ CHECKPOINT ${cp.id}/5 REACHED: ${cp.name}`);
      this.playSound(false);
    }

    this.notify();
  }

  public requestRespawn(reason: string = 'Fell off rooftops') {
    this.respawnCount++;
    this.setBanner(`↺ RESTARTING FROM LAST CHECKPOINT: ${reason}`);
    
    // Teleport player & camera immediately to last safe checkpoint
    const targetPos = this.lastSafePos.clone();
    this.respawnHandlers.forEach((handler) => {
      handler(targetPos);
    });

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
        lastSafePos: this.lastSafePos,
        notification: this.notification,
        respawnCount: this.respawnCount,
      });
    });
  }
}

export const CheckpointManager = new CheckpointManagerService();
