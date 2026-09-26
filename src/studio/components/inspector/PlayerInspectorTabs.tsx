import React from 'react';
import { RotateCcw, Activity, Shield } from 'lucide-react';
import { Switch } from '../ui/Switch';
import {
  DEFAULT_PLAYER_PARAMS,
  DEFAULT_CAMERA_PARAMS,
  type PlayerControllerParams,
  type ThirdPersonCameraParams,
} from '../../../components/player/PlayerTypes';

interface PlayerInspectorTabsProps {
  playerParams: Partial<PlayerControllerParams>;
  onPlayerParamsChange: (updater: (prev: Partial<PlayerControllerParams>) => Partial<PlayerControllerParams>) => void;
  cameraParams: Partial<ThirdPersonCameraParams>;
  onCameraParamsChange: (updater: (prev: Partial<ThirdPersonCameraParams>) => Partial<ThirdPersonCameraParams>) => void;
  showColliderDebug: boolean;
  onShowColliderDebugChange: (show: boolean) => void;
}

export const PlayerInspectorTab1: React.FC<PlayerInspectorTabsProps> = ({
  playerParams,
  onPlayerParamsChange,
}) => {
  return (
    <>
      <div className="inspector-section">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span className="section-label">LOCOMOTION SPEEDS (M/S)</span>
          <button
            className="btn-minimal"
            style={{ padding: '2px 8px', fontSize: 10.5 }}
            onClick={() => onPlayerParamsChange(() => DEFAULT_PLAYER_PARAMS)}
          >
            <RotateCcw size={10} /> Reset
          </button>
        </div>

        {/* Walk Speed */}
        <div className="slider-row">
          <div className="slider-header">
            <span className="slider-label">Walk Speed</span>
            <span className="slider-value">{(playerParams.walkSpeed ?? DEFAULT_PLAYER_PARAMS.walkSpeed).toFixed(1)} m/s</span>
          </div>
          <input
            type="range"
            min="1.0"
            max="4.0"
            step="0.1"
            value={playerParams.walkSpeed ?? DEFAULT_PLAYER_PARAMS.walkSpeed}
            onChange={(e) => {
              const val = parseFloat(e.target.value);
              onPlayerParamsChange((prev) => ({ ...prev, walkSpeed: val }));
            }}
            className="studio-range-slider"
          />
        </div>

        {/* Run Speed */}
        <div className="slider-row">
          <div className="slider-header">
            <span className="slider-label">Run Speed</span>
            <span className="slider-value">{(playerParams.runSpeed ?? DEFAULT_PLAYER_PARAMS.runSpeed).toFixed(1)} m/s</span>
          </div>
          <input
            type="range"
            min="3.0"
            max="8.0"
            step="0.1"
            value={playerParams.runSpeed ?? DEFAULT_PLAYER_PARAMS.runSpeed}
            onChange={(e) => {
              const val = parseFloat(e.target.value);
              onPlayerParamsChange((prev) => ({ ...prev, runSpeed: val }));
            }}
            className="studio-range-slider"
          />
        </div>

        {/* Sprint Speed */}
        <div className="slider-row">
          <div className="slider-header">
            <span className="slider-label">Sprint Speed</span>
            <span className="slider-value">{(playerParams.sprintSpeed ?? DEFAULT_PLAYER_PARAMS.sprintSpeed).toFixed(1)} m/s</span>
          </div>
          <input
            type="range"
            min="5.0"
            max="12.0"
            step="0.1"
            value={playerParams.sprintSpeed ?? DEFAULT_PLAYER_PARAMS.sprintSpeed}
            onChange={(e) => {
              const val = parseFloat(e.target.value);
              onPlayerParamsChange((prev) => ({ ...prev, sprintSpeed: val }));
            }}
            className="studio-range-slider"
          />
        </div>

        {/* Crouch Speed */}
        <div className="slider-row">
          <div className="slider-header">
            <span className="slider-label">Crouch Speed</span>
            <span className="slider-value">{(playerParams.crouchSpeed ?? DEFAULT_PLAYER_PARAMS.crouchSpeed).toFixed(1)} m/s</span>
          </div>
          <input
            type="range"
            min="0.8"
            max="2.5"
            step="0.1"
            value={playerParams.crouchSpeed ?? DEFAULT_PLAYER_PARAMS.crouchSpeed}
            onChange={(e) => {
              const val = parseFloat(e.target.value);
              onPlayerParamsChange((prev) => ({ ...prev, crouchSpeed: val }));
            }}
            className="studio-range-slider"
          />
        </div>
      </div>

      <div className="inspector-section">
        <span className="section-label">JUMP & GRAVITY DYNAMICS</span>

        {/* Jump Force */}
        <div className="slider-row">
          <div className="slider-header">
            <span className="slider-label">Jump Impulse Force</span>
            <span className="slider-value">{(playerParams.jumpForce ?? DEFAULT_PLAYER_PARAMS.jumpForce).toFixed(1)} m/s</span>
          </div>
          <input
            type="range"
            min="3.0"
            max="10.0"
            step="0.2"
            value={playerParams.jumpForce ?? DEFAULT_PLAYER_PARAMS.jumpForce}
            onChange={(e) => {
              const val = parseFloat(e.target.value);
              onPlayerParamsChange((prev) => ({ ...prev, jumpForce: val }));
            }}
            className="studio-range-slider"
          />
        </div>

        {/* Gravity */}
        <div className="slider-row">
          <div className="slider-header">
            <span className="slider-label">Downward Gravity</span>
            <span className="slider-value">{(playerParams.gravity ?? DEFAULT_PLAYER_PARAMS.gravity).toFixed(1)} m/s²</span>
          </div>
          <input
            type="range"
            min="9.8"
            max="30.0"
            step="0.5"
            value={playerParams.gravity ?? DEFAULT_PLAYER_PARAMS.gravity}
            onChange={(e) => {
              const val = parseFloat(e.target.value);
              onPlayerParamsChange((prev) => ({ ...prev, gravity: val }));
            }}
            className="studio-range-slider"
          />
        </div>

        {/* Acceleration */}
        <div className="slider-row">
          <div className="slider-header">
            <span className="slider-label">Ground Acceleration</span>
            <span className="slider-value">{(playerParams.acceleration ?? DEFAULT_PLAYER_PARAMS.acceleration).toFixed(0)} m/s²</span>
          </div>
          <input
            type="range"
            min="8.0"
            max="35.0"
            step="1.0"
            value={playerParams.acceleration ?? DEFAULT_PLAYER_PARAMS.acceleration}
            onChange={(e) => {
              const val = parseFloat(e.target.value);
              onPlayerParamsChange((prev) => ({ ...prev, acceleration: val }));
            }}
            className="studio-range-slider"
          />
        </div>

        {/* Deceleration */}
        <div className="slider-row">
          <div className="slider-header">
            <span className="slider-label">Deceleration Friction</span>
            <span className="slider-value">{(playerParams.deceleration ?? DEFAULT_PLAYER_PARAMS.deceleration).toFixed(0)} m/s²</span>
          </div>
          <input
            type="range"
            min="8.0"
            max="40.0"
            step="1.0"
            value={playerParams.deceleration ?? DEFAULT_PLAYER_PARAMS.deceleration}
            onChange={(e) => {
              const val = parseFloat(e.target.value);
              onPlayerParamsChange((prev) => ({ ...prev, deceleration: val }));
            }}
            className="studio-range-slider"
          />
        </div>
      </div>

      <div className="info-box-playground">
        <div className="info-box-title">
          <Activity size={13} style={{ color: '#0ea5e9' }} />
          Kinematic Physics QA Sandbox
        </div>
        Isolated 20m × 20m test floor with boundary curbs. Character uses 3D capsule physics, camera-relative movement, air control, and smooth yaw damping.
      </div>
    </>
  );
};

export const PlayerInspectorTab2: React.FC<PlayerInspectorTabsProps> = ({
  cameraParams,
  onCameraParamsChange,
  showColliderDebug,
  onShowColliderDebugChange,
}) => {
  return (
    <>
      <div className="inspector-section">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span className="section-label">THIRD-PERSON CAMERA</span>
          <button
            className="btn-minimal"
            style={{ padding: '2px 8px', fontSize: 10.5 }}
            onClick={() => onCameraParamsChange(() => DEFAULT_CAMERA_PARAMS)}
          >
            <RotateCcw size={10} /> Reset
          </button>
        </div>

        {/* Camera Distance */}
        <div className="slider-row">
          <div className="slider-header">
            <span className="slider-label">Follow Distance</span>
            <span className="slider-value">{(cameraParams.distance ?? DEFAULT_CAMERA_PARAMS.distance).toFixed(2)}m</span>
          </div>
          <input
            type="range"
            min="1.5"
            max="6.0"
            step="0.1"
            value={cameraParams.distance ?? DEFAULT_CAMERA_PARAMS.distance}
            onChange={(e) => {
              const val = parseFloat(e.target.value);
              onCameraParamsChange((prev) => ({ ...prev, distance: val }));
            }}
            className="studio-range-slider"
          />
        </div>

        {/* Camera Height */}
        <div className="slider-row">
          <div className="slider-header">
            <span className="slider-label">Focal Height</span>
            <span className="slider-value">{(cameraParams.height ?? DEFAULT_CAMERA_PARAMS.height).toFixed(2)}m</span>
          </div>
          <input
            type="range"
            min="0.8"
            max="2.2"
            step="0.05"
            value={cameraParams.height ?? DEFAULT_CAMERA_PARAMS.height}
            onChange={(e) => {
              const val = parseFloat(e.target.value);
              onCameraParamsChange((prev) => ({ ...prev, height: val }));
            }}
            className="studio-range-slider"
          />
        </div>

        {/* FOV */}
        <div className="slider-row">
          <div className="slider-header">
            <span className="slider-label">Base Field of View (FOV)</span>
            <span className="slider-value">{(cameraParams.fov ?? DEFAULT_CAMERA_PARAMS.fov).toFixed(0)}°</span>
          </div>
          <input
            type="range"
            min="35"
            max="75"
            step="1"
            value={cameraParams.fov ?? DEFAULT_CAMERA_PARAMS.fov}
            onChange={(e) => {
              const val = parseFloat(e.target.value);
              onCameraParamsChange((prev) => ({ ...prev, fov: val }));
            }}
            className="studio-range-slider"
          />
        </div>

        {/* Sprint Dynamic FOV */}
        <div className="slider-row">
          <div className="slider-header">
            <span className="slider-label">Sprint Dynamic FOV</span>
            <span className="slider-value">{(cameraParams.sprintFov ?? DEFAULT_CAMERA_PARAMS.sprintFov).toFixed(0)}°</span>
          </div>
          <input
            type="range"
            min="45"
            max="85"
            step="1"
            value={cameraParams.sprintFov ?? DEFAULT_CAMERA_PARAMS.sprintFov}
            onChange={(e) => {
              const val = parseFloat(e.target.value);
              onCameraParamsChange((prev) => ({ ...prev, sprintFov: val }));
            }}
            className="studio-range-slider"
          />
        </div>
      </div>

      <div className="inspector-section">
        <span className="section-label">PHYSICS & COLLISION DEBUG</span>
        <div className="switch-row-list">
          <div className="switch-row">
            <div className="switch-meta">
              <span className="switch-label">Capsule Collider Wireframe</span>
              <span className="switch-desc">Visualize 1.80m standing / 1.15m crouch capsule</span>
            </div>
            <Switch
              checked={showColliderDebug}
              onCheckedChange={onShowColliderDebugChange}
            />
          </div>
        </div>
      </div>

      <div className="inspector-section">
        <span className="section-label">ACTIVE QA HOUSES (3 BUILDINGS)</span>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6, fontSize: 11.5 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 10px', background: '#ffffff', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)' }}>
            <div>
              <div style={{ fontWeight: 600, color: 'var(--text-main)', fontSize: 12 }}>🏡 Open-Stair Bungalow</div>
              <div style={{ fontSize: 10.5, color: 'var(--text-subtle)' }}>North-West • Exterior staircase & veranda</div>
            </div>
            <span className="status-badge-active" style={{ fontSize: 9.5 }}>Solid Box</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 10px', background: '#ffffff', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)' }}>
            <div>
              <div style={{ fontWeight: 600, color: 'var(--text-main)', fontSize: 12 }}>🏪 2-Storey Shop Complex</div>
              <div style={{ fontSize: 10.5, color: 'var(--text-subtle)' }}>East Promenade • 6.48m tall façade</div>
            </div>
            <span className="status-badge-active" style={{ fontSize: 9.5 }}>Solid Box</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 10px', background: '#ffffff', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)' }}>
            <div>
              <div style={{ fontWeight: 600, color: 'var(--text-main)', fontSize: 12 }}>✨ Contemporary Villa</div>
              <div style={{ fontSize: 10.5, color: 'var(--text-subtle)' }}>South-West • Narrow 1.6m alleyway</div>
            </div>
            <span className="status-badge-active" style={{ fontSize: 9.5 }}>Solid Box</span>
          </div>
        </div>
      </div>

      <div className="info-box-playground">
        <div className="info-box-title">
          <Shield size={13} style={{ color: '#10b981' }} />
          Collision & Occlusion Verification
        </div>
        Verifies ground detection, standing clearance, building corner collisions, narrow alleyway navigation, and third-person camera occlusion avoidance against realistic architectural geometry.
      </div>
    </>
  );
};
