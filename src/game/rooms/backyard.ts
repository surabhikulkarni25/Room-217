import { RoomDefinition } from '../../types/game';
import { VIRTUAL_HEIGHT, VIRTUAL_WIDTH } from '../constants';

export const backyard: RoomDefinition = {
  id: 'backyard',
  name: 'Hostel Backyard',
  width: VIRTUAL_WIDTH,
  height: VIRTUAL_HEIGHT,
  spawnPosition: { x: 52, y: 132 },
  spawnDirection: 'right',

  // Boundary walls
  walls: [
    // Top stone perimeter wall & iron fence
    { x: 0, y: 0, width: VIRTUAL_WIDTH, height: 75 },
    // Bottom dense muddy overgrowth / thorny bramble
    { x: 0, y: 195, width: VIRTUAL_WIDTH, height: 45 },
    // Left rear hostel brick wall (with fire exit door)
    { x: 0, y: 0, width: 34, height: VIRTUAL_HEIGHT },
    // Right crumbling stone perimeter wall
    { x: 288, y: 0, width: 32, height: VIRTUAL_HEIGHT },
  ],

  // Physical obstacles
  obstacles: [
    // Dead gnarled oak tree on upper left
    {
      id: 'backyard_tree',
      name: 'Dead Courtyard Tree',
      type: 'furniture',
      rect: { x: 82, y: 66, width: 26, height: 28 },
    },
    // The ancient stone well structure collision
    {
      id: 'stone_well_collision',
      name: 'Ancient Stone Well',
      type: 'furniture',
      rect: { x: 188, y: 104, width: 46, height: 32 },
    },
  ],

  // Exactly ONE interactable object in this area: the ancient stone well
  interactables: [
    {
      id: 'backyard_well',
      name: 'Ancient Stone Well',
      rect: { x: 182, y: 98, width: 58, height: 44 },
      prompt: 'View Well',
      inspectTitle: 'Ancient Stone Well',
      visualType: 'well',
      inspectText:
        'A crumbling moss-slick stone well dating back to before the hostel was built.\n\nThe rotting timber winch has collapsed into the black water below. From deep within the shaft comes the faint, icy sound of dripping water.',
      interactionDistance: 32,
    },
  ],
};
