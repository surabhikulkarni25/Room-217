import { RoomDefinition } from '../../types/game';
import { VIRTUAL_HEIGHT, VIRTUAL_WIDTH } from '../constants';

export const corridor: RoomDefinition = {
  id: 'corridor',
  name: 'Hostel Second Floor Corridor',
  width: VIRTUAL_WIDTH,
  height: VIRTUAL_HEIGHT,
  spawnPosition: { x: 48, y: 124 },
  spawnDirection: 'right',

  // Corridor boundary walls
  walls: [
    // Top wall (where the hotel room doors are placed)
    { x: 0, y: 0, width: VIRTUAL_WIDTH, height: 80 },
    // Bottom wall (foreground corridor wainscot & banister)
    { x: 0, y: 180, width: VIRTUAL_WIDTH, height: 60 },
    // Left wall (dead-end emergency door)
    { x: 0, y: 0, width: 24, height: VIRTUAL_HEIGHT },
    // Right wall (blocked stairwell)
    { x: 296, y: 0, width: 24, height: VIRTUAL_HEIGHT },
  ],

  // Physical obstacles in corridor
  obstacles: [
    // Fire exit chain barrier on far left
    {
      id: 'chain_barrier',
      name: 'Chained Fire Exit',
      type: 'furniture',
      rect: { x: 24, y: 80, width: 12, height: 36 },
    },
    // Small hallway side table on far right
    {
      id: 'hallway_table',
      name: 'Hallway Table',
      type: 'furniture',
      rect: { x: 280, y: 80, width: 16, height: 34 },
    },
  ],

  // Interactive items in corridor
  interactables: [
    {
      id: 'door_214',
      name: 'Door 214',
      rect: { x: 44, y: 64, width: 28, height: 26 },
      prompt: 'Inspect Door 214',
      inspectTitle: 'Room 214',
      visualType: 'door',
      inspectText:
        'A faded "Do Not Disturb" card hangs from the door lever. The door is secured by a heavy brass 4-digit combination padlock.',
      interactionDistance: 24,
    },
    {
      id: 'door_215',
      name: 'Door 215',
      rect: { x: 104, y: 64, width: 28, height: 26 },
      prompt: 'Inspect Door 215',
      inspectTitle: 'Room 215',
      visualType: 'door',
      inspectText:
        'The door is locked fast. You knock gently against the wood, but nobody answers.',
      interactionDistance: 24,
    },
    {
      id: 'notice_board',
      name: 'Notice Board & Floor Log',
      rect: { x: 140, y: 54, width: 20, height: 26 },
      prompt: 'Read Floor Log',
      inspectTitle: 'Floor 2 Maintenance Log',
      visualType: 'notice',
      inspectText:
        'A clipboard pinned to the corkboard holds the handwritten Floor 2 Maintenance Log. Several entries detail lock changes and room maintenance.',
      interactionDistance: 24,
    },
    {
      id: 'door_216',
      name: 'Door 216',
      rect: { x: 168, y: 64, width: 28, height: 26 },
      prompt: 'Inspect Door 216',
      inspectTitle: 'Room 216',
      visualType: 'door',
      inspectText:
        'A heavy padlock holds the latch closed from the outside. A faded label reads: "UNOCCUPIED - DO NOT ENTER".',
      interactionDistance: 24,
    },
    {
      id: 'door_217',
      name: 'Door 217',
      rect: { x: 228, y: 64, width: 34, height: 28 },
      prompt: 'Inspect Door 217',
      inspectTitle: 'Room 217',
      visualType: 'door',
      inspectText:
        "The door to Room 217 is locked tight. The heavy brass deadbolt is firmly engaged from the outside. Your missing friend's belongings are inside.",
      interactionDistance: 26,
    },
  ],
};
