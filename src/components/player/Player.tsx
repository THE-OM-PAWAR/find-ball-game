import React from 'react';
import { PlayerController, type PlayerControllerProps } from './PlayerController';

export interface PlayerProps extends PlayerControllerProps {}

/**
 * Root Player Component
 * 
 * Assembles:
 * - PlayerModel (Loads public/X Bot.fbx.glb with useGLTF)
 * - PlayerController (Kinematic capsule physics, camera-relative movement)
 * - PlayerInput (WASD, Shift, Ctrl, Space, Mouse look)
 * - PlayerAnimation (State machine: IDLE, WALK, RUN, SPRINT, CROUCH, JUMP, FALL, LAND)
 * - PlayerCamera (Collision-aware third-person orbit follow camera)
 */
export const Player: React.FC<PlayerProps> = (props) => {
  return <PlayerController {...props} />;
};

export default Player;
