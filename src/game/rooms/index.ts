import { RoomDefinition } from '../../types/game';
import { corridor } from './corridor';
import { room214 } from './room214';
import { room217 } from './room217';
import { basement } from './basement';
import { backyard } from './backyard';

export const rooms: Record<string, RoomDefinition> = {
  corridor,
  room214,
  room217,
  basement,
  backyard,
};

export function getRoom(
  roomId: string,
  storyFlags?: Record<string, any>
): RoomDefinition {
  const room = rooms[roomId];
  if (!room) {
    console.warn(`Room "${roomId}" not found, falling back to corridor`);
    return corridor;
  }

  // Corridor room dynamic updates
  if (roomId === 'corridor') {
    let nextRoom = { ...room };

    nextRoom.interactables = nextRoom.interactables.map((item) => {
      // Door 214: Unlockable with the 4-digit code (8412) from the maintenance register
      if (item.id === 'door_214' && storyFlags?.room214Unlocked) {
        return {
          ...item,
          prompt: 'Enter Room 214',
          inspectTitle: 'Room 214',
          inspectText:
            'The combination padlock hangs unlatched from the door hasp. The door swings open into the cold, abandoned room.',
          onInteract: (state) => ({
            currentRoom: 'room214',
            player: {
              ...state.player,
              position: { x: 160, y: 168 },
              direction: 'up',
              isMoving: false,
            },
          }),
        };
      }

      // Door 217: Unlocking for the first time with the key found in Room 214
      if (item.id === 'door_217') {
        if (storyFlags?.finalKeyFound) {
          return {
            ...item,
            prompt: 'Enter Room 217',
            inspectText:
              "Door 217 stands unlocked. The brass digits '217' catch the hallway sconce light.",
            onInteract: (state) => ({
              currentRoom: 'room217',
              player: {
                ...state.player,
                position: { x: 236, y: 175 },
                direction: 'up',
                isMoving: false,
              },
              storyFlags: {
                ...state.storyFlags,
                room217Locked: false,
                pendingRoom217Intro: false,
              },
            }),
          };
        } else if (storyFlags?.room217KeyFound) {
          return {
            ...item,
            prompt: 'Unlock & Enter Room 217',
            inspectText:
              'You insert the brass key labeled "217". The lock cylinder turns with a heavy mechanical click, and the door creaks open...',
            onInteract: (state) => ({
              currentRoom: 'room217',
              player: {
                ...state.player,
                position: { x: 236, y: 175 },
                direction: 'up',
                isMoving: false,
              },
              storyFlags: {
                ...state.storyFlags,
                room217Locked: true,
                pendingRoom217Intro: true,
              },
            }),
          };
        }
      }

      // Door 216 unlocks with the brass key and opens stairs to basement
      if (item.id === 'door_216' && storyFlags?.finalKeyFound) {
        return {
          ...item,
          name: 'Door 216 — Basement Stairs',
          prompt: 'Descend to Basement',
          inspectTitle: 'Room 216 Service Stairs',
          visualType: 'door',
          inspectText:
            'The heavy padlock on Door 216 hangs unlocked. Inside, the floor has been cut away to reveal steep wooden stairs leading into the dark basement storage.',
          onInteract: (state) => ({
            currentRoom: 'basement',
            player: {
              ...state.player,
              position: { x: 160, y: 92 },
              direction: 'down',
              isMoving: false,
            },
            storyFlags: {
              ...state.storyFlags,
              door216Unlocked: true,
            },
          }),
        };
      }

      return item;
    });

    // Guided False Exit: Once the basement parcel is revealed, the fire exit chain is gone
    // and the emergency door leads outside to the backyard
    if (storyFlags?.boxContentsRevealed) {
      nextRoom.obstacles = nextRoom.obstacles.filter(
        (o) => o.id !== 'chain_barrier'
      );

      const hasExit = nextRoom.interactables.some(
        (i) => i.id === 'emergency_exit'
      );
      if (!hasExit) {
        nextRoom.interactables = [
          ...nextRoom.interactables,
          {
            id: 'emergency_exit',
            name: 'Emergency Exit Door',
            rect: { x: 12, y: 84, width: 26, height: 46 },
            prompt: 'Push Bar to Exit',
            inspectTitle: 'Fire Exit Door',
            visualType: 'door',
            inspectText:
              'The heavy safety chain has been unfastened. Beyond the metal crash bar, cold night air and rain blow in from the dark hostel yard.',
            interactionDistance: 28,
            onInteract: (state) => ({
              currentRoom: 'backyard',
              player: {
                ...state.player,
                position: { x: 52, y: 132 },
                direction: 'right',
                isMoving: false,
              },
            }),
          },
        ];
      }
    }

    return nextRoom;
  }

  // Room 214 dynamic updates
  if (roomId === 'room214') {
    let nextRoom = { ...room };

    if (storyFlags?.room217KeyFound) {
      nextRoom.interactables = nextRoom.interactables.map((item) => {
        if (item.id === 'key_to_217') {
          return {
            id: 'key_to_217_empty',
            name: 'Dusty Floorboards',
            rect: { x: 238, y: 114, width: 28, height: 28 },
            prompt: 'Examine Floor',
            inspectTitle: 'Dust Outline',
            visualType: 'floor',
            inspectText:
              'A pale rectangular outline in the dust where the brass key and torn note previously lay.',
            interactionDistance: 26,
          };
        }
        return item;
      });
    }

    return nextRoom;
  }

  // Basement room dynamic updates
  if (roomId === 'basement') {
    let nextRoom = { ...room };

    if (storyFlags?.boxUnlocked) {
      const isRevealed = Boolean(storyFlags?.boxContentsRevealed);
      nextRoom.interactables = nextRoom.interactables.map((item) => {
        if (item.id === 'locked_box') {
          return {
            ...item,
            name: isRevealed ? 'Archived Evidence' : 'Iron-Banded Box (Open)',
            prompt: isRevealed ? 'Examine Evidence' : 'Unwrap Oilcloth Parcel',
            inspectTitle: isRevealed ? 'Archived Evidence' : 'Unwrapped Oilcloth Parcel',
            visualType: isRevealed ? 'parcel_contents' : 'box',
            inspectText: isRevealed
              ? "Inside the unfolded oilcloth rests an archival photograph from October 1983, a torn page from the hostel register stamped 'FL.2 / UNRECORDED', and an emergency tag inscribed in familiar handwriting: 'HOLD FOR: NEO'."
              : 'The heavy lid of the iron-banded box rests open on its hinges.\n\nInside lies an old parcel wrapped tightly in dark, heavy oilcloth, waiting to be examined closely.',
          };
        }
        return item;
      });
    }

    return nextRoom;
  }

  // If the first blackout has moved the desk chair in Room 217
  if (roomId === 'room217' && storyFlags?.chairMoved) {
    let nextRoom = { ...room };

    // Update window to State 2 (fogged glass, dead path & trees)
    nextRoom.interactables = nextRoom.interactables.map((item) => {
      if (item.id === 'window') {
        return {
          ...item,
          visualType: 'window_transformed',
        };
      }
      return item;
    });

    const hasDisplacedChair = room.obstacles.some((o) => o.id === 'displaced_chair');
    if (!hasDisplacedChair) {
      nextRoom.obstacles = [
        ...nextRoom.obstacles,
        {
          id: 'displaced_chair',
          name: 'Displaced Chair',
          type: 'furniture',
          rect: { x: 198, y: 124, width: 18, height: 20 },
        },
      ];
    }

    const hasDiary = room.interactables.some((i) => i.id === 'diary');
    if (!hasDiary) {
      nextRoom.interactables = [
        ...nextRoom.interactables,
        {
          id: 'diary',
          name: "Friend's Damaged Diary",
          rect: { x: 206, y: 68, width: 22, height: 20 },
          prompt: "Read Friend's Diary",
          inspectTitle: "Friend's Damaged Diary",
          visualType: 'diary',
          inspectText:
            "A worn pocket diary that was concealed behind the desk chair. The leather cover is charred at one corner and warped from moisture.\n\nYour friend's handwriting fills the pages.",
          interactionDistance: 26,
        },
      ];
    }

    // Hidden baseboard seam / cavity / phone (revealed after diary clue is read)
    if (storyFlags?.diaryDiscovered) {
      const isCavityOpen = Boolean(storyFlags?.hiddenCavityOpen);
      const isPhonePickedUp = Boolean(storyFlags?.phoneFound);

      const hasSeamOrCavityOrPhone = nextRoom.interactables.some(
        (i) =>
          i.id === 'hidden_seam' ||
          i.id === 'hidden_cavity' ||
          i.id === 'hidden_phone'
      );

      if (!hasSeamOrCavityOrPhone) {
        if (!isCavityOpen) {
          nextRoom.interactables = [
            ...nextRoom.interactables,
            {
              id: 'hidden_seam',
              name: 'Floorboard Seam',
              rect: { x: 248, y: 56, width: 18, height: 20 },
              prompt: 'Inspect Seam',
              inspectTitle: 'Wall & Floorboard Seam',
              visualType: 'seam',
              inspectText:
                'Where the baseboard meets the floor near the writing desk. A cold draft seeps out from an unnatural gap in the wood.\n\nYou press your fingers against the board—and the timber creaks loose with a snap.',
              interactionDistance: 26,
            },
          ];
        } else if (!isPhonePickedUp) {
          nextRoom.interactables = [
            ...nextRoom.interactables,
            {
              id: 'hidden_phone',
              name: "Friend's Phone",
              rect: { x: 248, y: 56, width: 18, height: 20 },
              prompt: "Pick Up Friend's Phone",
              inspectTitle: "Friend's Phone",
              visualType: 'phone',
              inspectText:
                "Tucked inside the dark cavity between the wall studs lies your friend's phone.\n\nThe glass screen is spiderwebbed with cracks, completely dark and cold to the touch.",
              interactionDistance: 26,
            },
          ];
        } else {
          nextRoom.interactables = [
            ...nextRoom.interactables,
            {
              id: 'hidden_cavity',
              name: 'Hollow Cavity',
              rect: { x: 248, y: 56, width: 18, height: 20 },
              prompt: 'Inspect Hollow Cavity',
              inspectTitle: 'Exposed Wall Cavity',
              visualType: 'cavity',
              inspectText:
                'The wooden baseboard has shifted outward into the room, leaving a deep hollow cavity exposed in the floorboards.\n\nThe air rising from the opening is cold, smelling of ancient dust and iron.',
              interactionDistance: 26,
            },
          ];
        }
      }
    }

    // Update wardrobe & mirror based on phoneUnlocked and finalKeyFound
    if (storyFlags?.phoneUnlocked) {
      nextRoom.interactables = nextRoom.interactables.map((item) => {
        if (item.id === 'wardrobe') {
          if (!storyFlags?.finalKeyFound) {
            return {
              ...item,
              name: 'Wardrobe Mirror',
              prompt: 'Inspect Wardrobe Mirror',
              inspectTitle: 'Wardrobe Mirror',
            };
          } else {
            return {
              ...item,
              name: 'Wardrobe',
              prompt: 'Examine Wardrobe',
              inspectTitle: 'Old Wardrobe',
              inspectText:
                "The small recessed compartment behind the wardrobe's mirror lies empty now. The mirror reflection has returned to normal.",
            };
          }
        }
        return item;
      });
    }

    // Update Room 217 door when finalKeyFound is true
    if (storyFlags?.finalKeyFound) {
      nextRoom.interactables = nextRoom.interactables.map((item) => {
        if (item.id === 'door') {
          return {
            ...item,
            prompt: 'Unlock & Exit to Corridor',
            inspectTitle: 'Corridor Door',
            inspectText:
              'You slide the small brass key into the old door lock. With a heavy metallic click, the deadbolt releases.\n\nThe door swings open into the hallway.',
            onInteract: (state) => ({
              currentRoom: 'corridor',
              player: {
                ...state.player,
                position: { x: 244, y: 105 },
                direction: 'down',
                isMoving: false,
              },
              storyFlags: {
                ...state.storyFlags,
                room217Locked: false,
              },
            }),
          };
        }
        return item;
      });

      if (nextRoom.doors) {
        nextRoom.doors = nextRoom.doors.map((door) => {
          if (door.id === 'door_corridor') {
            return {
              ...door,
              locked: false,
              prompt: 'Exit to Corridor',
            };
          }
          return door;
        });
      }
    }

    return nextRoom;
  }

  return room;
}
