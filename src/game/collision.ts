import {
  PLAYER_HITBOX_HEIGHT,
  PLAYER_HITBOX_OFFSET_X,
  PLAYER_HITBOX_OFFSET_Y,
  PLAYER_HITBOX_WIDTH,
} from './constants';
import { Direction, InteractableObject, Position, Rect, RoomDefinition } from '../types/game';

/**
 * Computes the axis-aligned bounding box (hitbox) of the player at position (x, y).
 * Hits are anchored near the feet to provide depth perspective.
 */
export function getPlayerHitbox(x: number, y: number): Rect {
  return {
    x: x + PLAYER_HITBOX_OFFSET_X,
    y: y + PLAYER_HITBOX_OFFSET_Y,
    width: PLAYER_HITBOX_WIDTH,
    height: PLAYER_HITBOX_HEIGHT,
  };
}

/**
 * Checks whether two rectangles intersect.
 */
export function rectsIntersect(a: Rect, b: Rect): boolean {
  return (
    a.x < b.x + b.width &&
    a.x + a.width > b.x &&
    a.y < b.y + b.height &&
    a.y + a.height > b.y
  );
}

/**
 * Checks whether a proposed hitbox collides with room walls or obstacles.
 */
export function checkCollision(hitbox: Rect, room: RoomDefinition): boolean {
  // Check room outer walls
  for (const wall of room.walls) {
    if (rectsIntersect(hitbox, wall)) {
      return true;
    }
  }

  // Check room obstacles (furniture, pillars, etc.)
  for (const obstacle of room.obstacles) {
    if (rectsIntersect(hitbox, obstacle.rect)) {
      return true;
    }
  }

  return false;
}

/**
 * Resolves movement with independent X and Y axis sliding.
 * Returns the final valid position without clipping.
 */
export function resolveMovement(
  currentPos: Position,
  deltaX: number,
  deltaY: number,
  room: RoomDefinition
): Position {
  let nextX = currentPos.x;
  let nextY = currentPos.y;

  // Try moving along X axis
  if (deltaX !== 0) {
    const testX = currentPos.x + deltaX;
    const hitboxX = getPlayerHitbox(testX, currentPos.y);
    if (!checkCollision(hitboxX, room)) {
      nextX = testX;
    }
  }

  // Try moving along Y axis
  if (deltaY !== 0) {
    const testY = currentPos.y + deltaY;
    const hitboxY = getPlayerHitbox(nextX, testY);
    if (!checkCollision(hitboxY, room)) {
      nextY = testY;
    }
  }

  return { x: nextX, y: nextY };
}

/**
 * Finds the nearest interactable object in front of or close to the player.
 */
export function findNearestInteractable(
  playerPos: Position,
  direction: Direction,
  room: RoomDefinition,
  proximity: number = 24
): InteractableObject | null {
  const pCenterX = playerPos.x + PLAYER_HITBOX_OFFSET_X + PLAYER_HITBOX_WIDTH / 2;
  const pCenterY = playerPos.y + PLAYER_HITBOX_OFFSET_Y + PLAYER_HITBOX_HEIGHT / 2;

  // Bias interaction point in the player's facing direction
  let reachX = pCenterX;
  let reachY = pCenterY;
  const reachOffset = 14;

  switch (direction) {
    case 'up':
      reachY -= reachOffset;
      break;
    case 'down':
      reachY += reachOffset;
      break;
    case 'left':
      reachX -= reachOffset;
      break;
    case 'right':
      reachX += reachOffset;
      break;
  }

  let closest: InteractableObject | null = null;
  let minDistance = Infinity;

  for (const item of room.interactables) {
    const itemCenterX = item.rect.x + item.rect.width / 2;
    const itemCenterY = item.rect.y + item.rect.height / 2;

    const dx = reachX - itemCenterX;
    const dy = reachY - itemCenterY;
    const dist = Math.sqrt(dx * dx + dy * dy);

    const maxAllowedDist = item.interactionDistance || proximity;
    if (dist <= maxAllowedDist && dist < minDistance) {
      minDistance = dist;
      closest = item;
    }
  }

  return closest;
}
