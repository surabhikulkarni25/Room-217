import { RoomDefinition } from '../../types/game';
import { VIRTUAL_HEIGHT, VIRTUAL_WIDTH } from '../constants';

export const basement: RoomDefinition = {
  id: 'basement',
  name: 'Hostel Storage Basement',
  width: VIRTUAL_WIDTH,
  height: VIRTUAL_HEIGHT,
  spawnPosition: { x: 160, y: 92 },
  spawnDirection: 'down',

  // Basement boundaries
  walls: [
    // Top wall (foundation stone & stairwell alcove)
    { x: 0, y: 0, width: VIRTUAL_WIDTH, height: 74 },
    // Bottom wall (waterlogged footing)
    { x: 0, y: 204, width: VIRTUAL_WIDTH, height: 36 },
    // Left stone wall
    { x: 0, y: 0, width: 24, height: VIRTUAL_HEIGHT },
    // Right stone wall
    { x: 296, y: 0, width: 24, height: VIRTUAL_HEIGHT },
  ],

  // Physical obstacles
  obstacles: [
    // Rusted iron boiler on the left
    {
      id: 'boiler_obstacle',
      name: 'Rusted Boiler',
      type: 'furniture',
      rect: { x: 32, y: 78, width: 48, height: 54 },
    },
    // Old archive shelves on the right
    {
      id: 'shelves_obstacle',
      name: 'Storage Shelves',
      type: 'furniture',
      rect: { x: 240, y: 78, width: 48, height: 54 },
    },
    // Heavy central workbench
    {
      id: 'workbench_obstacle',
      name: 'Worktable',
      type: 'furniture',
      rect: { x: 126, y: 136, width: 68, height: 32 },
    },
  ],

  // Interactive points of interest
  interactables: [
    {
      id: 'stairs_up',
      name: 'Stairs to Second Floor',
      rect: { x: 144, y: 60, width: 32, height: 26 },
      prompt: 'Ascend to Corridor',
      inspectTitle: 'Service Stairs',
      visualType: 'door',
      inspectText:
        'The unpainted wooden service stairs lead back up through Door 216 into the second-floor corridor.',
      interactionDistance: 26,
      onInteract: (state) => ({
        currentRoom: 'corridor',
        player: {
          ...state.player,
          position: { x: 182, y: 110 },
          direction: 'down',
          isMoving: false,
        },
      }),
    },
    {
      id: 'boiler',
      name: 'Rusted Boiler',
      rect: { x: 32, y: 78, width: 48, height: 54 },
      prompt: 'Inspect Boiler',
      inspectTitle: 'Rusted Iron Boiler',
      visualType: 'notice',
      inspectText:
        'The heavy cast-iron boiler ticks with cold contraction. A thick layer of soot cakes the flue, and copper pipes run up into the floorboards above.\n\nA slow rhythmic drip echoes from somewhere behind the brickwork: drip... drip... drip.',
      interactionDistance: 26,
    },
    {
      id: 'shelves',
      name: 'Waterlogged Storage',
      rect: { x: 240, y: 78, width: 48, height: 54 },
      prompt: 'Examine Archives',
      inspectTitle: 'Hostel Archives',
      visualType: 'notice',
      inspectText:
        'Cardboard boxes softened by decades of groundwater seepage. Inside are moldering hostel registers and ledger books from the 1970s and 80s.\n\nThe tenant ledger for the second floor has several pages roughly razor-cut from the binding.',
      interactionDistance: 26,
    },
    {
      id: 'locked_box',
      name: 'Iron-Banded Box',
      rect: { x: 138, y: 136, width: 44, height: 32 },
      prompt: 'Inspect Locked Box',
      inspectTitle: 'Iron-Banded Box',
      visualType: 'box',
      inspectText:
        'Resting atop the scarred workbench is a heavy oak box, reinforced with dark iron bands. A tarnished brass lock cylinder secures the front latch.\n\nThe keyhole matches the small brass key you found behind the wardrobe mirror.',
      interactionDistance: 28,
    },
  ],

  // Exits / Doors
  doors: [
    {
      id: 'door_to_corridor',
      rect: { x: 144, y: 56, width: 32, height: 20 },
      targetRoom: 'corridor',
      targetPosition: { x: 182, y: 110 },
      targetDirection: 'down',
      prompt: 'Corridor',
    },
  ],
};
