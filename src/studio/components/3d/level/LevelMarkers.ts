export type LevelMarkerType =
  | 'START'
  | 'DOG'
  | 'STAIR_UP'
  | 'ROOF'
  | 'LADDER_UP'
  | 'JUMP_GAP'
  | 'BALL'
  | 'RETURN'
  | 'EXIT';

export interface LevelGameplayMarker {
  id: string;
  stepNumber: number;
  name: string;
  type: LevelMarkerType;
  position: [number, number, number]; // [x, y, z]
  elevationMeters: number;
  icon: string;
  color: string;
  description: string;
}

export const LEVEL_GAMEPLAY_MARKERS: LevelGameplayMarker[] = [
  // Step 1: Player Start
  {
    id: 'marker_start',
    stepNumber: 1,
    name: 'PLAYER_START',
    type: 'START',
    position: [0.0, 0.05, 8.0],
    elevationMeters: 0.0,
    icon: '🚩',
    color: '#22c55e', // Green
    description: 'Ground Spawn Point in Central Cricket Gully',
  },

  // Step 2: Dog Zone Patrol & Obstacle
  {
    id: 'marker_dog',
    stepNumber: 2,
    name: 'DOG_PATROL_ZONE',
    type: 'DOG',
    position: [-0.5, 0.05, -5.5],
    elevationMeters: 0.0,
    icon: '🐕',
    color: '#eab308', // Yellow / Amber
    description: 'Guard Dog Patrol Circuit • Sneak or Distract with Biscuit',
  },

  // Step 3: Staircase Entry
  {
    id: 'marker_stair_entry',
    stepNumber: 3,
    name: 'STAIR_ENTRY',
    type: 'STAIR_UP',
    position: [-0.5, 0.05, -7.5],
    elevationMeters: 0.0,
    icon: '↑',
    color: '#06b6d4', // Cyan
    description: 'Exterior Staircase Base (Ascend to Roof A)',
  },

  // Step 4: Roof A Platform
  {
    id: 'marker_roof_a',
    stepNumber: 4,
    name: 'ROOF_A',
    type: 'ROOF',
    position: [2.0, 3.65, -11.5],
    elevationMeters: 3.6,
    icon: '🏢',
    color: '#3b82f6', // Blue
    description: 'House A Rooftop (Parapet, Water Tank & East Ledge)',
  },

  // Step 5: Ladder / Rooftop Gap
  {
    id: 'marker_ladder_a',
    stepNumber: 5,
    name: 'LADDER_LOCATION',
    type: 'LADDER_UP',
    position: [8.5, 3.65, -9.0],
    elevationMeters: 3.6,
    icon: '🪜',
    color: '#a855f7', // Purple
    description: 'Ascend / Jump from Roof A (+3.6m) to East Roof B (+4.8m)',
  },

  // Step 6: Roof B Section
  {
    id: 'marker_roof_b',
    stepNumber: 6,
    name: 'ROOF_B',
    type: 'ROOF',
    position: [13.5, 4.85, -4.0],
    elevationMeters: 4.8,
    icon: '🏢',
    color: '#3b82f6',
    description: 'House B Upper Terrace Pathway',
  },

  // Step 7: Rooftop Jump / Parapet Traverse
  {
    id: 'marker_jump_a',
    stepNumber: 7,
    name: 'ROOFTOP_JUMP_POINT',
    type: 'JUMP_GAP',
    position: [13.5, 4.85, 3.0],
    elevationMeters: 4.8,
    icon: '→',
    color: '#f97316', // Orange
    description: 'Traverse along Roof C toward South end',
  },

  // Step 8: Ball Objective
  {
    id: 'marker_ball',
    stepNumber: 8,
    name: 'BALL_OBJECTIVE',
    type: 'BALL',
    position: [13.5, 4.85, 10.5],
    elevationMeters: 4.8,
    icon: '🏏',
    color: '#ef4444', // Red Pulse
    description: 'Lost Red Cricket Ball on South Roof C Terrace',
  },

  // Step 9: Escape & Return Route
  {
    id: 'marker_escape',
    stepNumber: 9,
    name: 'ESCAPE_DESCENT',
    type: 'RETURN',
    position: [4.5, 0.05, 0.0],
    elevationMeters: 0.0,
    icon: '🏃',
    color: '#10b981', // Emerald
    description: 'Ground Escape Path back through Gully Alleyway',
  },

  // Step 10: Society Exit Gate
  {
    id: 'marker_exit',
    stepNumber: 10,
    name: 'LEVEL_EXIT',
    type: 'EXIT',
    position: [-14.0, 0.05, -14.0],
    elevationMeters: 0.0,
    icon: '🏁',
    color: '#ec4899', // Pink
    description: 'Society Exit Gateway • Mission Complete Extraction',
  },
];
