import { DEFAULT_PLAYER_SPEED } from '../constants';
import { GameState } from '../../types/game';
import { corridor } from '../rooms/corridor';

export function createInitialGameState(): GameState {
  return {
    currentRoom: corridor.id,
    player: {
      position: { ...corridor.spawnPosition },
      direction: corridor.spawnDirection,
      isMoving: false,
      speed: DEFAULT_PLAYER_SPEED,
    },
    inventory: [],
    discoveredClues: [],
    unlockedAreas: ['corridor'],
    completedPuzzles: [],
    triggeredEvents: [],
    storyFlags: {
      openingActive: true,
      registerCodeFound: false,
      room214Unlocked: false,
      room217KeyFound: false,
      room217Locked: false,
      pendingRoom217Intro: false,
      firstBlackoutTriggered: false,
      firstBlackoutCompleted: false,
      blackoutActive: false,
      chairMoved: false,
      inspectedRoom217Objects: [],
      diaryDiscovered: false,
      hiddenLocationFound: false,
      secondBlackoutTriggered: false,
      secondBlackoutCompleted: false,
      hiddenCavityOpen: false,
      phoneRung: false,
      phoneFound: false,
      phoneUnlocked: false,
      finalKeyFound: false,
      door216Unlocked: false,
      boxUnlocked: false,
      boxContentsRevealed: false,
      parcelWhisperPlayed: false,
      shadowFigureSeen: false,
      endingTriggered: false,
    },
    currentAct: 1,
  };
}
