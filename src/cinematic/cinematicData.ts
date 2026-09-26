export interface CinematicShot {
  id: string;
  name: string;
  startTime: number; // in seconds
  duration: number; // in seconds
  cameraPos: [number, number, number];
  targetPos: [number, number, number];
  cameraPosEnd?: [number, number, number];
  targetPosEnd?: [number, number, number];
  fov: number;
  fovEnd?: number;
  speaker?: string;
  speakerColor?: string;
  speakerRole?: string;
  dialogue?: string;
  dialogueHindi?: string;
  audioFile?: string;
}

export const CINEMATIC_TIMELINE: CinematicShot[] = [
  // ── SHOT 1: THE GULLY ESTABLISHING SHOT ──
  {
    id: 'shot_establishing',
    name: 'Gully Establishing Shot',
    startTime: 0.0,
    duration: 5.0,
    cameraPos: [0, 8.5, 22.0],
    targetPos: [0, 1.5, 0.0],
    cameraPosEnd: [0, 4.5, 15.0],
    targetPosEnd: [0, 1.2, -1.0],
    fov: 60,
    fovEnd: 52,
    speaker: 'NARRATOR',
    speakerColor: '#f59e0b',
    speakerRole: 'Gully Memory',
    dialogue: 'Gully cricket ka rule simple tha... aakhri ball pe six maarna zaroori hai!',
    dialogueHindi: 'गल्ली क्रिकेट का रूल सिंपल था... आखिरी बॉल पे सिक्स मारना ज़रूरी है!',
  },

  // ── SHOT 2: THE BOWLER RUN-UP & ENCOURAGEMENT ──
  {
    id: 'shot_bowler_shout',
    name: 'Bunty Bowls',
    startTime: 5.0,
    duration: 4.5,
    cameraPos: [2.8, 1.6, 9.5],
    targetPos: [0, 1.4, 7.5],
    cameraPosEnd: [1.8, 1.4, 6.0],
    targetPosEnd: [0, 1.2, -2.5],
    fov: 50,
    fovEnd: 48,
    speaker: 'BUNTY',
    speakerColor: '#38bdf8',
    speakerRole: 'Bowler',
    dialogue: 'Bhai seedhe maar chhat ke paar..!',
    dialogueHindi: 'भाई सीधे मार छत के पार..!',
    audioFile: '/Bhai sidde maar chat ke paar..mp3',
  },

  // ── SHOT 3: THE MASSIVE BAT SWING & IMPACT ──
  {
    id: 'shot_bat_swing',
    name: 'The Sixer Hit',
    startTime: 9.5,
    duration: 3.5,
    cameraPos: [-1.8, 1.3, -1.0],
    targetPos: [0, 1.2, -2.5],
    cameraPosEnd: [-2.4, 2.2, -1.2],
    targetPosEnd: [0, 2.0, -2.5],
    fov: 46,
    fovEnd: 55,
    speaker: 'MATCH ACTION',
    speakerColor: '#fbbf24',
    speakerRole: 'The Shot',
    dialogue: '*KHADDAKKK!* A monster shot launched high into the sky!',
    dialogueHindi: '*खटाक!* गेंद हवा में बहुत ऊपर उड़ी!',
  },

  // ── SHOT 4: THE BALL SOARING OVER ROOFTOPS ──
  {
    id: 'shot_ball_flight',
    name: 'Ball Flight Over Gully',
    startTime: 13.0,
    duration: 6.5,
    cameraPos: [3.5, 7.5, 2.0],
    targetPos: [12.0, 11.0, -1.0],
    cameraPosEnd: [16.0, 11.5, -0.8],
    targetPosEnd: [22.4, 7.5, -0.4],
    fov: 54,
    fovEnd: 44,
    speaker: 'NARRATOR',
    speakerColor: '#f59e0b',
    speakerRole: 'The Flight',
    dialogue: 'Ball went straight over the electric cables and terrace tanks...',
    dialogueHindi: 'गेंद बिजली के तारों और पानी की टंकियों के ऊपर से निकल गई...',
  },

  // ── SHOT 5: BALL LANDS ON BALAJI PLAZA ROOF ──
  {
    id: 'shot_ball_landing',
    name: 'Landing on Balaji Roof',
    startTime: 19.5,
    duration: 5.0,
    cameraPos: [21.0, 7.6, -1.8],
    targetPos: [22.4, 6.7, -0.4],
    cameraPosEnd: [22.0, 7.2, -0.9],
    targetPosEnd: [22.4, 6.65, -0.4],
    fov: 42,
    fovEnd: 38,
    speaker: 'SHARMA UNCLE ROOF',
    speakerColor: '#ef4444',
    speakerRole: 'Danger Zone',
    dialogue: '*TAP! TAP!* The ball lands right on Sharma Uncle’s terrace!',
    dialogueHindi: '*टप! टप!* गेंद सीधे शर्मा अंकल की छत पर गिरी!',
  },

  // ── SHOT 6: FRIENDS REACT IN HORROR ──
  {
    id: 'shot_reaction_dread',
    name: 'Reaction Dread',
    startTime: 24.5,
    duration: 5.5,
    cameraPos: [0, 1.5, -1.0],
    targetPos: [0, 1.4, -4.5],
    cameraPosEnd: [0.8, 1.4, -1.5],
    targetPosEnd: [-0.6, 1.3, -4.5],
    fov: 48,
    fovEnd: 46,
    speaker: 'BITTU',
    speakerColor: '#ec4899',
    speakerRole: 'Wicketkeeper',
    dialogue: 'Bhai... Ball toh Sharma uncle ki chhat par gayi..!',
    dialogueHindi: 'भाई... बॉल तो शर्मा अंकल की छत पर गयी..!',
    audioFile: '/Bhai Ball toh Sharma uncle K chat par gai.mp3',
  },

  // ── SHOT 7: THE JUGAAD MISSION APPOINTMENT ──
  {
    id: 'shot_appointment',
    name: 'You Hit It, You Bring It',
    startTime: 30.0,
    duration: 5.5,
    cameraPos: [-0.8, 1.6, -3.8],
    targetPos: [0, 1.5, -2.5],
    cameraPosEnd: [-0.4, 1.6, -3.2],
    targetPosEnd: [0, 1.5, -2.5],
    fov: 46,
    fovEnd: 44,
    speaker: 'BUNTY',
    speakerColor: '#38bdf8',
    speakerRole: 'Bowler',
    dialogue: 'Tune maari hai, tu hi lekar aa!',
    dialogueHindi: 'तूने मारी है, तू ही लेकर आ!',
    audioFile: '/Tune maari hai tuhi likhar AA.mp3',
  },

  // ── SHOT 8: HERO POV & SEAMLESS GAMEPLAY SWOOP ──
  {
    id: 'shot_transition_gameplay',
    name: 'Mission Transition',
    startTime: 35.5,
    duration: 4.5,
    cameraPos: [0, 2.8, -0.5],
    targetPos: [0, 1.6, -20.0],
    cameraPosEnd: [0, 1.8, 17.5],
    targetPosEnd: [0, 1.2, 14.0],
    fov: 52,
    fovEnd: 54,
    speaker: 'MISSION OBJECTIVE',
    speakerColor: '#10b981',
    speakerRole: 'Start Mission',
    dialogue: 'RETRIEVE THE BALL: Climb Sharma Niwas stairs and traverse the rooftops!',
    dialogueHindi: 'मिशन: शर्मा निवास की सीढ़ियां चढ़ो और छतों के रास्ते बॉल वापस लाओ!',
  },
];

export const TOTAL_CINEMATIC_DURATION = 40.0;
