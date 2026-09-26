export interface LevelRouteSegment {
  id: string;
  name: string;
  points: [number, number, number][];
  color: string;
  dashed?: boolean;
  type: 'retrieval' | 'escape' | 'dog_patrol';
}

/**
 * Visual Route Segments connecting mission markers
 */
export const LEVEL_ROUTES: LevelRouteSegment[] = [
  // 1. Mission Retrieval Traversal Path (Green to Red Ball)
  {
    id: 'route_retrieval',
    name: 'Ball Retrieval Path (Ground → Roof A → Roof B → Ball)',
    type: 'retrieval',
    color: '#38bdf8', // Light blue line
    points: [
      [0.0, 0.15, 8.0],    // Start in central play area
      [0.0, 0.15, 0.0],    // Move north through gully
      [-0.5, 0.15, -4.5],  // Approach Dog Patrol zone
      [-0.5, 0.15, -7.5],  // Reach Staircase base
      [-0.5, 1.8, -9.5],   // Ascend Staircase mid-point
      [0.5, 3.75, -11.5],  // Arrive on Roof A
      [6.5, 3.75, -11.5],  // Traverse East along Roof A
      [9.5, 3.75, -9.0],   // Reach East Transition Ledge
      [13.5, 4.95, -7.0],  // Climb up to Roof B
      [13.5, 4.95, 2.0],   // Traverse South across Roof B/C
      [13.5, 4.95, 10.5],  // Reach Cricket Ball on South Roof!
    ],
  },

  // 2. Escape / Return Route (Ball → Ground → Society Exit Gate)
  {
    id: 'route_escape',
    name: 'Society Escape Route (Ball → Alleyway → Exit Gate)',
    type: 'escape',
    color: '#ec4899', // Pink dashed line
    dashed: true,
    points: [
      [13.5, 4.95, 10.5],  // Ball on South Roof
      [13.5, 4.95, 4.0],   // Move north along roof
      [13.5, 4.95, -6.0],  // Return towards Roof A bridge
      [9.5, 3.75, -9.0],   // Cross back to Roof A
      [0.5, 3.75, -11.5],  // Move west along Roof A
      [-0.5, 0.15, -7.5],  // Descend stairs to ground
      [-6.0, 0.15, -8.0],  // Cut west toward Society Exit
      [-14.0, 0.15, -14.0],// Reach Society Exit Gate!
    ],
  },

  // 3. Dog Patrol Circuit (4-point loop in front of House A)
  {
    id: 'route_dog_patrol',
    name: 'Dog Patrol Circuit',
    type: 'dog_patrol',
    color: '#eab308', // Amber dashed loop
    dashed: true,
    points: [
      [3.0, 0.1, -4.0],
      [-3.5, 0.1, -4.0],
      [-3.5, 0.1, -7.0],
      [3.0, 0.1, -7.0],
      [3.0, 0.1, -4.0], // Closes loop
    ],
  },
];
