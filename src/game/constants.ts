/**
 * Game constants for Room 217.
 * Defines native pixel resolution, tile sizing, physics, and interaction thresholds.
 */

export const VIRTUAL_WIDTH = 320;
export const VIRTUAL_HEIGHT = 240;

// Player dimensions
export const PLAYER_SPRITE_WIDTH = 16;
export const PLAYER_SPRITE_HEIGHT = 24;

// Collision box (anchored at player's feet for top-down perspective depth)
export const PLAYER_HITBOX_WIDTH = 12;
export const PLAYER_HITBOX_HEIGHT = 8;
export const PLAYER_HITBOX_OFFSET_X = 2;
export const PLAYER_HITBOX_OFFSET_Y = 16;

// Physics & gameplay constants
export const DEFAULT_PLAYER_SPEED = 68; // pixels per second
export const INTERACTION_PROXIMITY = 20; // pixels to trigger interact prompt
