import { RoomDefinition } from '../../types/game';
import { VIRTUAL_HEIGHT, VIRTUAL_WIDTH } from '../constants';

export const room217: RoomDefinition = {
  id: 'room217',
  name: 'Hostel Room 217',
  width: VIRTUAL_WIDTH,
  height: VIRTUAL_HEIGHT,
  spawnPosition: { x: 236, y: 175 },
  spawnDirection: 'up',

  // Outer boundary walls
  walls: [
    // Top wall
    { x: 0, y: 0, width: VIRTUAL_WIDTH, height: 48 },
    // Bottom wall
    { x: 0, y: 216, width: VIRTUAL_WIDTH, height: 24 },
    // Left wall
    { x: 0, y: 0, width: 24, height: VIRTUAL_HEIGHT },
    // Right wall
    { x: 296, y: 0, width: 24, height: VIRTUAL_HEIGHT },
  ],

  // Physical obstacles in the room
  obstacles: [
    // Bed (upper left)
    {
      id: 'bed_obstacle',
      name: 'Bed',
      type: 'furniture',
      rect: { x: 34, y: 52, width: 44, height: 60 },
    },
    // Nightstand
    {
      id: 'nightstand_obstacle',
      name: 'Nightstand',
      type: 'furniture',
      rect: { x: 82, y: 54, width: 22, height: 24 },
    },
    // Desk (upper right)
    {
      id: 'desk_obstacle',
      name: 'Desk',
      type: 'furniture',
      rect: { x: 188, y: 56, width: 58, height: 32 },
    },
    // Wardrobe (right wall)
    {
      id: 'wardrobe_obstacle',
      name: 'Wardrobe',
      type: 'furniture',
      rect: { x: 270, y: 84, width: 22, height: 56 },
    },
  ],

  // Interactive points of interest
  interactables: [
    {
      id: 'bed',
      name: "Your Friend's Bed",
      rect: { x: 34, y: 52, width: 44, height: 64 },
      prompt: 'Inspect Bed',
      inspectTitle: "Your Friend's Bed",
      visualType: 'bed',
      inspectText:
        'The bed is hastily made, but cold to the touch. The wool blanket is pulled tight over the mattress, yet a corner of the sheet beneath the pillow is frayed.\n\nYour friend clearly did not sleep here last night.',
      interactionDistance: 26,
    },
    {
      id: 'nightstand',
      name: 'Nightstand',
      rect: { x: 82, y: 54, width: 22, height: 28 },
      prompt: 'Check Nightstand',
      inspectTitle: 'Nightstand Drawer',
      visualType: 'nightstand',
      inspectText:
        'A small bedside lamp flickers with a dull electrical hum. On the polished wood surface, four deep scratches are carved into the lacquer: IIII.\n\nThe drawer is shut tight.',
      interactionDistance: 24,
    },
    {
      id: 'desk',
      name: 'Writing Desk',
      rect: { x: 188, y: 56, width: 58, height: 36 },
      prompt: 'Examine Desk',
      inspectTitle: 'Writing Desk',
      visualType: 'desk',
      inspectText:
        'Scattered notes, reading glasses, and an empty coffee cup with dried grounds. Your friend\'s pocket notebook lies open.\n\nThe final sentence abruptly breaks off mid-thought: "There is a second rhythm behind the pipes—"',
      interactionDistance: 26,
    },
    {
      id: 'wardrobe',
      name: 'Wardrobe',
      rect: { x: 268, y: 84, width: 26, height: 58 },
      prompt: 'Open Wardrobe',
      inspectTitle: 'Old Wardrobe',
      visualType: 'wardrobe',
      inspectText:
        "Your friend's damp wool overcoat is hanging inside, smelling faintly of cold rain. A half-unpacked travel bag sits on the shelf above.\n\nEverything was left behind as if they planned to return within minutes.",
      interactionDistance: 26,
    },
    {
      id: 'window',
      name: 'Window',
      rect: { x: 124, y: 36, width: 48, height: 20 },
      prompt: 'Look Outside',
      inspectTitle: 'Courtyard Window',
      visualType: 'window',
      inspectText:
        'Rain beats steadily against the cold glass pane. Outside, a narrow path winds through the hostel courtyard toward the iron perimeter gate.',
      interactionDistance: 24,
    },
    {
      id: 'door',
      name: 'Corridor Door',
      rect: { x: 236, y: 208, width: 32, height: 16 },
      prompt: 'Examine Door',
      inspectTitle: 'Room 217 Door',
      visualType: 'door',
      inspectText:
        'The heavy timber door leading out to the hallway. The cast-brass deadbolt is turned horizontally into place—locked shut from the outside.\n\nYou cannot leave until you discover what happened to your friend.',
      interactionDistance: 26,
    },
  ],

  // Exits / Doors
  doors: [
    {
      id: 'door_corridor',
      rect: { x: 236, y: 208, width: 32, height: 16 },
      targetRoom: 'corridor',
      targetPosition: { x: 236, y: 110 },
      targetDirection: 'down',
      prompt: 'Corridor',
      locked: true,
      lockedMessage: 'The corridor door is bolted shut. You must find out what happened first.',
    },
  ],
};
