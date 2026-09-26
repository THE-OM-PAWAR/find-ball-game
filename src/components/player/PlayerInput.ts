import type { PlayerInputState } from './PlayerTypes';

export class PlayerInputManager {
  private state: PlayerInputState = {
    forward: false,
    backward: false,
    left: false,
    right: false,
    sprint: false,
    crouch: false,
    jump: false,
    pointerLocked: false,
    mouseDeltaX: 0,
    mouseDeltaY: 0,
  };

  private domElement: HTMLElement | null = null;
  private isPointerDown = false;
  private lastPointerX = 0;
  private lastPointerY = 0;
  private enabled = true;

  constructor() {
    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.handleKeyUp = this.handleKeyUp.bind(this);
    this.handleMouseMove = this.handleMouseMove.bind(this);
    this.handlePointerDown = this.handlePointerDown.bind(this);
    this.handlePointerUp = this.handlePointerUp.bind(this);
    this.handlePointerLockChange = this.handlePointerLockChange.bind(this);
  }

  public attach(domElement: HTMLElement = document.body) {
    this.detach();
    this.domElement = domElement;

    window.addEventListener('keydown', this.handleKeyDown);
    window.addEventListener('keyup', this.handleKeyUp);
    window.addEventListener('mousemove', this.handleMouseMove);
    domElement.addEventListener('pointerdown', this.handlePointerDown);
    window.addEventListener('pointerup', this.handlePointerUp);
    document.addEventListener('pointerlockchange', this.handlePointerLockChange);
  }

  public detach() {
    window.removeEventListener('keydown', this.handleKeyDown);
    window.removeEventListener('keyup', this.handleKeyUp);
    window.removeEventListener('mousemove', this.handleMouseMove);
    if (this.domElement) {
      this.domElement.removeEventListener('pointerdown', this.handlePointerDown);
    }
    window.removeEventListener('pointerup', this.handlePointerUp);
    document.removeEventListener('pointerlockchange', this.handlePointerLockChange);
    this.reset();
  }

  public setEnabled(enabled: boolean) {
    this.enabled = enabled;
    if (!enabled) this.reset();
  }

  public requestPointerLock() {
    if (this.domElement && document.pointerLockElement !== this.domElement) {
      try {
        this.domElement.requestPointerLock();
      } catch (err) {
        console.warn('Pointer lock request ignored:', err);
      }
    }
  }

  public getState(): PlayerInputState {
    return { ...this.state };
  }

  /**
   * Consume and reset mouse delta per frame
   */
  public consumeMouseDelta(): { deltaX: number; deltaY: number } {
    const deltaX = this.state.mouseDeltaX;
    const deltaY = this.state.mouseDeltaY;
    this.state.mouseDeltaX = 0;
    this.state.mouseDeltaY = 0;
    return { deltaX, deltaY };
  }

  private handleKeyDown(e: KeyboardEvent) {
    if (!this.enabled) return;
    if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

    switch (e.code) {
      case 'KeyW':
      case 'ArrowUp':
        this.state.forward = true;
        break;
      case 'KeyS':
      case 'ArrowDown':
        this.state.backward = true;
        break;
      case 'KeyA':
      case 'ArrowLeft':
        this.state.left = true;
        break;
      case 'KeyD':
      case 'ArrowRight':
        this.state.right = true;
        break;
      case 'ShiftLeft':
      case 'ShiftRight':
        this.state.sprint = true;
        break;
      case 'ControlLeft':
      case 'ControlRight':
      case 'KeyC':
        this.state.crouch = true;
        break;
      case 'Space':
        this.state.jump = true;
        e.preventDefault();
        break;
    }
  }

  private handleKeyUp(e: KeyboardEvent) {
    if (!this.enabled) return;

    switch (e.code) {
      case 'KeyW':
      case 'ArrowUp':
        this.state.forward = false;
        break;
      case 'KeyS':
      case 'ArrowDown':
        this.state.backward = false;
        break;
      case 'KeyA':
      case 'ArrowLeft':
        this.state.left = false;
        break;
      case 'KeyD':
      case 'ArrowRight':
        this.state.right = false;
        break;
      case 'ShiftLeft':
      case 'ShiftRight':
        this.state.sprint = false;
        break;
      case 'ControlLeft':
      case 'ControlRight':
      case 'KeyC':
        this.state.crouch = false;
        break;
      case 'Space':
        this.state.jump = false;
        break;
    }
  }

  private handleMouseMove(e: MouseEvent) {
    if (!this.enabled) return;

    if (this.state.pointerLocked) {
      this.state.mouseDeltaX += e.movementX;
      this.state.mouseDeltaY += e.movementY;
    } else if (this.isPointerDown) {
      const dx = e.clientX - this.lastPointerX;
      const dy = e.clientY - this.lastPointerY;
      this.lastPointerX = e.clientX;
      this.lastPointerY = e.clientY;
      this.state.mouseDeltaX += dx;
      this.state.mouseDeltaY += dy;
    }
  }

  private handlePointerDown(e: PointerEvent) {
    if (!this.enabled) return;
    this.isPointerDown = true;
    this.lastPointerX = e.clientX;
    this.lastPointerY = e.clientY;
  }

  private handlePointerUp(_e: PointerEvent) {
    this.isPointerDown = false;
  }

  private handlePointerLockChange() {
    this.state.pointerLocked = document.pointerLockElement === this.domElement;
  }

  public reset() {
    this.state = {
      forward: false,
      backward: false,
      left: false,
      right: false,
      sprint: false,
      crouch: false,
      jump: false,
      pointerLocked: false,
      mouseDeltaX: 0,
      mouseDeltaY: 0,
    };
    this.isPointerDown = false;
  }
}
