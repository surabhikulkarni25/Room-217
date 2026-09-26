/**
 * Core type definitions for Room 217.
 * Single source of truth for game state, world models, and player systems.
 */

export type Direction = 'up' | 'down' | 'left' | 'right';

export interface Position {
  x: number;
  y: number;
}

export interface Rect {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface InteractableObject {
  id: string;
  name: string;
  rect: Rect;
  prompt: string;
  inspectTitle: string;
  inspectText: string;
  visualType?: 'bed' | 'nightstand' | 'desk' | 'wardrobe' | 'window' | 'door' | 'notice' | string;
  interactionDistance?: number;
  onInteract?: (state: GameState) => Partial<GameState> | void;
}

export interface RoomDoor {
  id: string;
  rect: Rect;
  targetRoom: string;
  targetPosition: Position;
  targetDirection: Direction;
  prompt: string;
  locked?: boolean;
  lockedMessage?: string;
}

export interface Obstacle {
  id: string;
  name: string;
  rect: Rect;
  type?: 'furniture' | 'wall' | 'decor';
}

export interface RoomDefinition {
  id: string;
  name: string;
  width: number;
  height: number;
  spawnPosition: Position;
  spawnDirection: Direction;
  walls: Rect[];
  obstacles: Obstacle[];
  interactables: InteractableObject[];
  doors?: RoomDoor[];
}

export interface PlayerState {
  position: Position;
  direction: Direction;
  isMoving: boolean;
  speed: number;
}

export interface GameState {
  currentRoom: string;
  player: PlayerState;
  inventory: string[];
  discoveredClues: string[];
  unlockedAreas: string[];
  completedPuzzles: string[];
  triggeredEvents: string[];
  storyFlags: Record<string, any>;
  currentAct: number;
}
