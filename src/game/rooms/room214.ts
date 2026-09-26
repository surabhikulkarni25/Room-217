import { RoomDefinition } from '../../types/game';
import { VIRTUAL_HEIGHT, VIRTUAL_WIDTH } from '../constants';

export const room214: RoomDefinition = {
  id: 'room214',
  name: 'Room 214 — Abandoned Room',
  width: VIRTUAL_WIDTH,
  height: VIRTUAL_HEIGHT,
  spawnPosition: { x: 160, y: 168 },
  spawnDirection: 'up',

  // Room boundary walls
  walls: [
    // Top wall
    { x: 0, y: 0, width: VIRTUAL_WIDTH, height: 80 },
    // Bottom wall (exit door side)
    { x: 0, y: 196, width: VIRTUAL_WIDTH, height: 44 },
    // Left boundary
    { x: 0, y: 0, width: 32, height: VIRTUAL_HEIGHT },
    // Right boundary
    { x: 288, y: 0, width: 32, height: VIRTUAL_HEIGHT },
  ],

  // Obstacles (bare stripped remnants)
  obstacles: [
    // Stripped rusted bed frame on the left
    {
      id: 'bare_bed_obstacle',
      name: 'Bare Bed Frame',
      type: 'furniture',
      rect: { x: 44, y: 84, width: 50, height: 60 },
    },
    // Broken chair remnants in corner
    {
      id: 'broken_chair_obstacle',
      name: 'Broken Chair',
      type: 'furniture',
      rect: { x: 242, y: 84, width: 24, height: 26 },
    },
  ],

  // Points of interest
  interactables: [
    {
      id: 'bare_mattress',
      name: 'Stripped Bed Frame',
      rect: { x: 44, y: 84, width: 50, height: 60 },
      prompt: 'Inspect Bed Frame',
      inspectTitle: 'Stripped Bed Frame',
      visualType: 'bed',
      inspectText:
        'A rusted metal bed frame stripped completely bare. The mattress is missing, leaving only cold iron springs. Dust lies undisturbed across the coils.',
      interactionDistance: 26,
    },
    {
      id: 'gouged_wallpaper',
      name: 'Gouged Wallpaper',
      rect: { x: 140, y: 56, width: 40, height: 26 },
      prompt: 'Examine Wall Scratches',
      inspectTitle: 'Deep Scratches',
      visualType: 'scratches',
      inspectText:
        'Violent claw-like gouges have torn the floral wallpaper down to raw grey plaster. The scratches are grouped in sets of four, dragging downward toward the floorboards.',
      interactionDistance: 26,
    },
    {
      id: 'key_to_217',
      name: 'Brass Key & Note',
      rect: { x: 238, y: 114, width: 28, height: 28 },
      prompt: 'Inspect Key & Note',
      inspectTitle: 'Key to Room 217',
      visualType: 'key217_note',
      inspectText:
        'Resting on the dusty floorboards is an antique brass key stamped with "217".\n\nTied to the bow of the key is a ragged scrap of paper with frantic, uneven handwriting:\n\n"why don\'t you come find out"\n\nYou take the Key to Room 217.',
      interactionDistance: 26,
    },
    {
      id: 'door_exit_214',
      name: 'Corridor Door',
      rect: { x: 146, y: 184, width: 28, height: 20 },
      prompt: 'Exit to Corridor',
      inspectTitle: 'Door 214',
      visualType: 'door',
      inspectText: 'The door leads back out into the second-floor corridor.',
      interactionDistance: 26,
      onInteract: (state) => ({
        currentRoom: 'corridor',
        player: {
          ...state.player,
          position: { x: 58, y: 110 },
          direction: 'down',
          isMoving: false,
        },
      }),
    },
  ],

  doors: [
    {
      id: 'door_corridor_214',
      rect: { x: 146, y: 188, width: 28, height: 16 },
      targetRoom: 'corridor',
      targetPosition: { x: 58, y: 110 },
      targetDirection: 'down',
      prompt: 'Corridor',
    },
  ],
};
