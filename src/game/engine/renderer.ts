import {
  PLAYER_HITBOX_HEIGHT,
  PLAYER_HITBOX_OFFSET_X,
  PLAYER_HITBOX_OFFSET_Y,
  PLAYER_HITBOX_WIDTH,
  PLAYER_SPRITE_HEIGHT,
  PLAYER_SPRITE_WIDTH,
  VIRTUAL_HEIGHT,
  VIRTUAL_WIDTH,
} from '../constants';
import { Direction, InteractableObject, PlayerState, RoomDefinition } from '../../types/game';

/**
 * Draws the entire room, objects, player, and atmospheric effects.
 */
export function renderGame(
  ctx: CanvasRenderingContext2D,
  room: RoomDefinition,
  player: PlayerState,
  activeInteractable: InteractableObject | null,
  walkFrame: number,
  showDebug: boolean = false,
  storyFlags?: Record<string, any>,
  shadowFigure?: { active: boolean; alpha: number; x: number; y: number; revealFace?: boolean } | null
): void {
  // If a blackout event is active, render complete darkness
  if (storyFlags?.blackoutActive) {
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, VIRTUAL_WIDTH, VIRTUAL_HEIGHT);
    return;
  }

  // Ensure crisp pixel rendering
  ctx.imageSmoothingEnabled = false;

  // Clear canvas
  ctx.fillStyle = '#0a0a0c';
  ctx.fillRect(0, 0, VIRTUAL_WIDTH, VIRTUAL_HEIGHT);

  if (room.id === 'corridor') {
    // 1. Corridor floor & carpet runner
    drawCorridorFloor(ctx);
    // 2. Corridor walls, doors & sconces
    drawCorridorWalls(ctx, storyFlags);
    // 3. Corridor obstacles & props
    drawCorridorObstacles(ctx);
    // 4. Render Player
    drawPlayer(ctx, player, walkFrame);
    // 5. Corridor ambient lighting & vignette
    drawCorridorLighting(ctx, player);
  } else if (room.id === 'basement') {
    // 1. Basement stone floor & damp puddles
    drawBasementFloor(ctx);
    // 2. Basement stone walls, overhead pipes & stairs
    drawBasementWalls(ctx);
    // 3. Basement boiler, archives, workbench, box & shadow figure
    drawBasementDecor(ctx, room, storyFlags, shadowFigure);
    // 4. Render Player
    drawPlayer(ctx, player, walkFrame);
    // 5. Basement dim lighting & flashlight vignette
    drawBasementLighting(ctx, player);
  } else if (room.id === 'room214') {
    // 1. Abandoned Room 214 dusty cracked floor
    drawRoom214Floor(ctx);
    // 2. Gouged wallpaper, torn plaster, bare perimeter
    drawRoom214Walls(ctx);
    // 3. Stripped rusted bed coils, broken chair, key & note
    drawRoom214Decor(ctx, room, storyFlags);
    // 4. Render Player
    drawPlayer(ctx, player, walkFrame);
    // 5. Cold abandoned room lighting
    drawRoom214Lighting(ctx, player);
  } else if (room.id === 'backyard') {
    // 1. Backyard muddy earth & wet pathways
    drawBackyardGround(ctx);
    // 2. Backyard perimeter wall, dead tree & brickwork
    drawBackyardWalls(ctx);
    // 3. Ancient stone well
    drawBackyardWell(ctx, room);
    // 4. Render Player
    drawPlayer(ctx, player, walkFrame);
    // 5. Shadow Figure if active
    if (shadowFigure?.active) {
      drawShadowFigure(
        ctx,
        shadowFigure.x,
        shadowFigure.y,
        shadowFigure.alpha,
        shadowFigure.revealFace !== false
      );
    }
    // 6. Rain streaks
    drawRainOverlay(ctx);
    // 7. Atmospheric backyard lighting & cold darkness
    drawBackyardLighting(ctx, player);
  } else {
    // Room 217
    // 1. Render Floor (Room 217 wooden planks)
    drawFloor(ctx);
    // 2. Render Walls and Wall Decor
    drawWalls(ctx, room);
    // 3. Render Furniture & Obstacles
    drawRoomDecorAndObstacles(ctx, room, storyFlags);
    // 4. Render Player
    drawPlayer(ctx, player, walkFrame);
    // 5. Render Atmospheric Lighting & Vignette
    drawLighting(ctx, player);
  }

  // 6. Render In-Game Interaction Cue
  if (activeInteractable) {
    drawInteractionCue(ctx, activeInteractable);
  }

  // 7. Render Debug Collision Overlay (optional)
  if (showDebug) {
    drawDebugOverlay(ctx, room, player, activeInteractable);
  }
}

/* =========================================================================
   HOSTEL CORRIDOR RENDERING
   ========================================================================= */

function drawCorridorFloor(ctx: CanvasRenderingContext2D): void {
  const floorX = 24;
  const floorY = 78;
  const floorW = VIRTUAL_WIDTH - 48;
  const floorH = 104;

  // Wood floor base
  ctx.fillStyle = '#1a130e';
  ctx.fillRect(floorX, floorY, floorW, floorH);

  // Horizontal wood planks
  const plankH = 10;
  for (let y = floorY; y < floorY + floorH; y += plankH) {
    ctx.fillStyle = '#100c09';
    ctx.fillRect(floorX, y, floorW, 1);

    const isOdd = Math.floor(y / plankH) % 2 === 1;
    ctx.fillStyle = isOdd ? 'rgba(0, 0, 0, 0.1)' : 'rgba(255, 255, 255, 0.02)';
    ctx.fillRect(floorX, y + 1, floorW, plankH - 1);
  }

  // Central hallway vintage carpet runner
  const carpetY = 102;
  const carpetH = 56;
  ctx.fillStyle = '#3a161b';
  ctx.fillRect(floorX, carpetY, floorW, carpetH);

  // Gold border embroidery along top & bottom edges
  ctx.fillStyle = '#7a5a25';
  ctx.fillRect(floorX, carpetY + 2, floorW, 2);
  ctx.fillRect(floorX, carpetY + carpetH - 4, floorW, 2);

  // Carpet subtle diamond pattern
  ctx.fillStyle = '#2d1115';
  for (let x = floorX + 8; x < floorX + floorW - 8; x += 16) {
    ctx.fillRect(x + 4, carpetY + 18, 8, 20);
  }
}

function drawCorridorWalls(
  ctx: CanvasRenderingContext2D,
  storyFlags?: Record<string, any>
): void {
  // Back wall (y: 0 to 78)
  ctx.fillStyle = '#1c1e1c';
  ctx.fillRect(24, 0, VIRTUAL_WIDTH - 48, 62);

  // Dark damask wallpaper flecks
  ctx.fillStyle = '#141614';
  for (let wx = 32; wx < VIRTUAL_WIDTH - 48; wx += 18) {
    ctx.fillRect(wx, 12, 2, 2);
    ctx.fillRect(wx - 2, 16, 6, 1);
    ctx.fillRect(wx, 19, 2, 2);
  }

  // Chair rail
  ctx.fillStyle = '#342217';
  ctx.fillRect(24, 62, VIRTUAL_WIDTH - 48, 4);
  // Lower wainscot
  ctx.fillStyle = '#1e140d';
  ctx.fillRect(24, 66, VIRTUAL_WIDTH - 48, 12);
  // Baseboard
  ctx.fillStyle = '#0f0a06';
  ctx.fillRect(24, 76, VIRTUAL_WIDTH - 48, 2);

  // Left boundary (emergency fire exit door)
  ctx.fillStyle = '#0c0e0d';
  ctx.fillRect(0, 0, 24, VIRTUAL_HEIGHT);
  ctx.fillStyle = '#1a130e';
  ctx.fillRect(4, 40, 18, 90);

  const isExitOpen = Boolean(storyFlags?.boxContentsRevealed);
  if (!isExitOpen) {
    // Chained shut prior to completing the basement investigation
    ctx.fillStyle = '#443322';
    ctx.fillRect(8, 70, 10, 2); // Chained shut
  } else {
    // Unchained & unlatched: illuminated green EXIT sign + cold outdoor mist leaking in
    ctx.fillStyle = '#0f2913';
    ctx.fillRect(4, 30, 18, 8); // EXIT sign box
    ctx.fillStyle = '#34d399';
    ctx.fillRect(5, 31, 16, 6); // Green luminous face
    ctx.fillStyle = '#021f0b';
    ctx.font = '5px monospace';
    ctx.textAlign = 'center';
    ctx.fillText('EXIT', 13, 36);

    // Door cracked open slightly into the rain
    ctx.fillStyle = '#000000';
    ctx.fillRect(20, 44, 3, 86);
    // Cold outdoor rain mist / draft line
    ctx.fillStyle = 'rgba(180, 215, 240, 0.25)';
    ctx.fillRect(18, 48, 8, 80);
    // Heavy brass push bar
    ctx.fillStyle = '#8f7b59';
    ctx.fillRect(6, 88, 14, 3);
  }

  // Right boundary (blocked stairwell)
  ctx.fillStyle = '#0c0e0d';
  ctx.fillRect(VIRTUAL_WIDTH - 24, 0, 24, VIRTUAL_HEIGHT);
  ctx.fillStyle = '#1e1610';
  ctx.fillRect(VIRTUAL_WIDTH - 20, 40, 16, 90);

  // Foreground corridor wall / railing (y: 180 to 240)
  ctx.fillStyle = '#0a0d0c';
  ctx.fillRect(0, 182, VIRTUAL_WIDTH, 58);
  ctx.fillStyle = '#2c1e15';
  ctx.fillRect(24, 180, VIRTUAL_WIDTH - 48, 4);

  // DOORS:
  // Door 214 (Padlocked with combination lock until code 8412 is entered)
  const is214Padlocked = !Boolean(storyFlags?.room214Unlocked);
  drawCorridorDoor(ctx, 44, 34, 28, 44, '214', is214Padlocked, true);

  // Door 215
  drawCorridorDoor(ctx, 104, 34, 28, 44, '215', false, false);

  // Notice Board (between 215 and 216)
  drawNoticeBoard(ctx, 140, 46, 20, 22);

  // Door 216 (Padlocked until final brass key is found)
  const is216Padlocked = !Boolean(storyFlags?.finalKeyFound);
  drawCorridorDoor(ctx, 168, 34, 28, 44, '216', is216Padlocked, false);

  // Door 217 (Primary destination, highlighted)
  drawCorridorDoor217(ctx, 228, 32, 34, 46);

  // Wall Sconces
  drawWallSconce(ctx, 86, 26);
  drawWallSconce(ctx, 150, 26);
  drawWallSconce(ctx, 210, 26);
  drawWallSconce(ctx, 276, 26);
}

function drawCorridorDoor(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  num: string,
  padlocked: boolean,
  hasDoNotDisturb: boolean
): void {
  // Frame
  ctx.fillStyle = '#19110b';
  ctx.fillRect(x - 2, y - 2, w + 4, h + 2);

  // Door leaf
  ctx.fillStyle = '#291b12';
  ctx.fillRect(x, y, w, h);

  // Inset panels
  ctx.fillStyle = '#1d130c';
  ctx.fillRect(x + 3, y + 5, w - 6, 14);
  ctx.fillRect(x + 3, y + 23, w - 6, 15);

  // Brass number plate
  ctx.fillStyle = '#8a6e35';
  ctx.fillRect(x + Math.floor(w / 2) - 6, y + 8, 12, 5);
  ctx.fillStyle = '#181008';
  ctx.fillRect(x + Math.floor(w / 2) - 4, y + 10, 8, 2);

  // Brass doorknob
  ctx.fillStyle = '#a6853f';
  ctx.fillRect(x + 3, y + 22, 3, 3);

  // Padlock for Door 216
  if (padlocked) {
    ctx.fillStyle = '#55555c';
    ctx.fillRect(x + 2, y + 21, 5, 6);
    ctx.fillStyle = '#888892';
    ctx.fillRect(x + 3, y + 19, 3, 2);
  }

  // Do Not Disturb card for Door 214
  if (hasDoNotDisturb) {
    ctx.fillStyle = '#dcd7cf';
    ctx.fillRect(x + 4, y + 24, 4, 7);
    ctx.fillStyle = '#aa2222';
    ctx.fillRect(x + 5, y + 26, 2, 2);
  }
}

function drawCorridorDoor217(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number
): void {
  // Enhanced frame with crown trim
  ctx.fillStyle = '#1c130b';
  ctx.fillRect(x - 3, y - 3, w + 6, h + 3);
  ctx.fillStyle = '#342215';
  ctx.fillRect(x - 4, y - 4, w + 8, 3);

  // Rich dark polished door leaf
  ctx.fillStyle = '#322115';
  ctx.fillRect(x, y, w, h);

  // Molded panels
  ctx.fillStyle = '#21150c';
  ctx.fillRect(x + 4, y + 6, w - 8, 15);
  ctx.fillRect(x + 4, y + 25, w - 8, 15);

  ctx.strokeStyle = '#432c1b';
  ctx.lineWidth = 1;
  ctx.strokeRect(x + 4.5, y + 6.5, w - 9, 14);
  ctx.strokeRect(x + 4.5, y + 25.5, w - 9, 14);

  // Polished golden Room 217 plaque
  ctx.fillStyle = '#d4aa50';
  ctx.fillRect(x + Math.floor(w / 2) - 8, y + 9, 16, 7);
  // Plaque dark border
  ctx.strokeStyle = '#7c5d20';
  ctx.lineWidth = 1;
  ctx.strokeRect(x + Math.floor(w / 2) - 8.5, y + 8.5, 17, 8);

  // "217" text pixels
  ctx.fillStyle = '#1a1005';
  // 2
  ctx.fillRect(x + Math.floor(w / 2) - 6, y + 11, 3, 1);
  ctx.fillRect(x + Math.floor(w / 2) - 4, y + 12, 1, 1);
  ctx.fillRect(x + Math.floor(w / 2) - 6, y + 13, 3, 1);
  // 1
  ctx.fillRect(x + Math.floor(w / 2) - 1, y + 11, 2, 3);
  // 7
  ctx.fillRect(x + Math.floor(w / 2) + 3, y + 11, 3, 1);
  ctx.fillRect(x + Math.floor(w / 2) + 5, y + 12, 1, 2);

  // Polished brass handle & keyhole
  ctx.fillStyle = '#d4aa50';
  ctx.fillRect(x + 4, y + 24, 4, 3);
  ctx.fillStyle = '#1a1005';
  ctx.fillRect(x + 5, y + 28, 2, 3);
}

function drawNoticeBoard(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number
): void {
  // Wooden frame
  ctx.fillStyle = '#342216';
  ctx.fillRect(x, y, w, h);
  // Cork interior
  ctx.fillStyle = '#593f2c';
  ctx.fillRect(x + 2, y + 2, w - 4, h - 4);

  // Yellowed notice slips
  ctx.fillStyle = '#dcd2b8';
  ctx.fillRect(x + 4, y + 4, 10, 8);
  ctx.fillStyle = '#8f3322';
  ctx.fillRect(x + 8, y + 4, 2, 2); // Pushpin

  ctx.fillStyle = '#cfc2a5';
  ctx.fillRect(x + 7, y + 12, 9, 6);
  ctx.fillStyle = '#225588';
  ctx.fillRect(x + 11, y + 12, 2, 2); // Pushpin
}

function drawWallSconce(ctx: CanvasRenderingContext2D, x: number, y: number): void {
  // Brass bracket
  ctx.fillStyle = '#8a6e35';
  ctx.fillRect(x, y, 4, 6);
  ctx.fillRect(x - 2, y + 5, 8, 2);

  // Amber bulb / glass
  ctx.fillStyle = '#f2be5c';
  ctx.fillRect(x - 1, y + 1, 6, 4);
  ctx.fillStyle = '#fff4bd';
  ctx.fillRect(x, y + 2, 4, 2);
}

function drawCorridorObstacles(ctx: CanvasRenderingContext2D): void {
  // Right side hallway table (x: 280, y: 80, w: 16, h: 34)
  ctx.fillStyle = 'rgba(0,0,0,0.4)';
  ctx.fillRect(279, 110, 18, 6);

  ctx.fillStyle = '#342216';
  ctx.fillRect(280, 84, 16, 26);
  ctx.fillStyle = '#4c3222';
  ctx.fillRect(279, 83, 18, 3);

  // Small ceramic vase on table
  ctx.fillStyle = '#9e978e';
  ctx.fillRect(286, 76, 4, 7);
}

function drawCorridorLighting(ctx: CanvasRenderingContext2D, player: PlayerState): void {
  // Sconces glow
  const sconcePositions = [88, 152, 212, 278];
  for (const sx of sconcePositions) {
    const sGrad = ctx.createRadialGradient(sx, 30, 2, sx, 30, 48);
    sGrad.addColorStop(0, 'rgba(235, 180, 80, 0.22)');
    sGrad.addColorStop(0.6, 'rgba(180, 120, 40, 0.08)');
    sGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = sGrad;
    ctx.fillRect(0, 0, VIRTUAL_WIDTH, VIRTUAL_HEIGHT);
  }

  // Distinct glow illuminating Room 217 doorway
  const doorGrad = ctx.createRadialGradient(245, 52, 4, 245, 52, 60);
  doorGrad.addColorStop(0, 'rgba(245, 195, 100, 0.25)');
  doorGrad.addColorStop(0.5, 'rgba(190, 140, 50, 0.1)');
  doorGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
  ctx.fillStyle = doorGrad;
  ctx.fillRect(0, 0, VIRTUAL_WIDTH, VIRTUAL_HEIGHT);

  // Player personal aura
  const px = player.position.x + 8;
  const py = player.position.y + 12;
  const pAura = ctx.createRadialGradient(px, py, 4, px, py, 55);
  pAura.addColorStop(0, 'rgba(255, 255, 255, 0.05)');
  pAura.addColorStop(1, 'rgba(0, 0, 0, 0)');
  ctx.fillStyle = pAura;
  ctx.fillRect(0, 0, VIRTUAL_WIDTH, VIRTUAL_HEIGHT);

  // Hallway vignette / darkness
  const vignette = ctx.createRadialGradient(
    VIRTUAL_WIDTH / 2,
    130,
    70,
    VIRTUAL_WIDTH / 2,
    130,
    175
  );
  vignette.addColorStop(0, 'rgba(0, 0, 0, 0)');
  vignette.addColorStop(0.7, 'rgba(0, 0, 0, 0.25)');
  vignette.addColorStop(1, 'rgba(0, 0, 0, 0.65)');
  ctx.fillStyle = vignette;
  ctx.fillRect(0, 0, VIRTUAL_WIDTH, VIRTUAL_HEIGHT);
}

/* =========================================================================
   ROOM 217 RENDERING
   ========================================================================= */

function drawFloor(ctx: CanvasRenderingContext2D): void {
  const floorX = 24;
  const floorY = 48;
  const floorW = VIRTUAL_WIDTH - 48;
  const floorH = VIRTUAL_HEIGHT - 72;

  // Base floor tone
  ctx.fillStyle = '#1e1610';
  ctx.fillRect(floorX, floorY, floorW, floorH);

  // Planks
  const plankHeight = 12;
  for (let y = floorY; y < floorY + floorH; y += plankHeight) {
    ctx.fillStyle = '#140e0a';
    ctx.fillRect(floorX, y, floorW, 1);

    const isOdd = Math.floor(y / plankHeight) % 2 === 1;
    ctx.fillStyle = isOdd ? 'rgba(0, 0, 0, 0.08)' : 'rgba(255, 255, 255, 0.03)';
    ctx.fillRect(floorX, y + 1, floorW, plankHeight - 1);

    const shift = isOdd ? 40 : 0;
    for (let x = floorX + shift; x < floorX + floorW; x += 64) {
      ctx.fillStyle = '#140e0a';
      ctx.fillRect(x, y, 1, plankHeight);
    }
  }

  // Vintage patterned rug in the center
  const rugX = 110;
  const rugY = 110;
  const rugW = 86;
  const rugH = 68;

  ctx.fillStyle = '#3a1e20';
  ctx.fillRect(rugX, rugY, rugW, rugH);

  ctx.strokeStyle = '#5a3032';
  ctx.lineWidth = 2;
  ctx.strokeRect(rugX + 3, rugY + 3, rugW - 6, rugH - 6);

  ctx.fillStyle = '#2a1618';
  ctx.fillRect(rugX + 28, rugY + 20, rugW - 56, rugH - 40);

  ctx.fillStyle = '#6e5a48';
  for (let fx = rugX + 2; fx < rugX + rugW - 2; fx += 4) {
    ctx.fillRect(fx, rugY - 1, 2, 2);
    ctx.fillRect(fx, rugY + rugH - 1, 2, 2);
  }
}

function drawWalls(ctx: CanvasRenderingContext2D, room: RoomDefinition): void {
  // Upper wallpaper
  ctx.fillStyle = '#1b2220';
  ctx.fillRect(24, 0, VIRTUAL_WIDTH - 48, 36);

  ctx.fillStyle = '#151b19';
  for (let wx = 36; wx < VIRTUAL_WIDTH - 48; wx += 20) {
    ctx.fillRect(wx, 8, 3, 3);
    ctx.fillRect(wx - 3, 14, 9, 2);
    ctx.fillRect(wx, 19, 3, 3);
  }

  // Chair rail molding
  ctx.fillStyle = '#362419';
  ctx.fillRect(24, 36, VIRTUAL_WIDTH - 48, 3);
  ctx.fillStyle = '#1e140d';
  ctx.fillRect(24, 39, VIRTUAL_WIDTH - 48, 9);

  // Baseboard trim
  ctx.fillStyle = '#100a06';
  ctx.fillRect(24, 46, VIRTUAL_WIDTH - 48, 2);

  // Left boundary wall
  ctx.fillStyle = '#0f1211';
  ctx.fillRect(0, 0, 24, VIRTUAL_HEIGHT);
  ctx.fillStyle = '#080a09';
  ctx.fillRect(22, 0, 2, VIRTUAL_HEIGHT);

  // Right boundary wall
  ctx.fillStyle = '#0f1211';
  ctx.fillRect(VIRTUAL_WIDTH - 24, 0, 24, VIRTUAL_HEIGHT);
  ctx.fillStyle = '#080a09';
  ctx.fillRect(VIRTUAL_WIDTH - 24, 0, 2, VIRTUAL_HEIGHT);

  // Bottom boundary wall
  ctx.fillStyle = '#0a0d0c';
  ctx.fillRect(0, VIRTUAL_HEIGHT - 24, VIRTUAL_WIDTH, 24);
  ctx.fillStyle = '#17110c';
  ctx.fillRect(24, VIRTUAL_HEIGHT - 24, VIRTUAL_WIDTH - 48, 3);

  // Courtyard Window (x: 124, y: 10, w: 48, h: 32)
  drawWindow(ctx, 124, 8, 48, 32);

  // Corridor Door (x: 236, y: 196, w: 32, h: 44)
  drawDoor(ctx, 236, 194, 32, 44);
}

function drawWindow(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number): void {
  ctx.fillStyle = '#322318';
  ctx.fillRect(x, y, w, h);

  ctx.fillStyle = '#0c161d';
  ctx.fillRect(x + 3, y + 3, w - 6, h - 6);

  const grad = ctx.createLinearGradient(x, y, x, y + h);
  grad.addColorStop(0, '#10222e');
  grad.addColorStop(1, '#070f14');
  ctx.fillStyle = grad;
  ctx.fillRect(x + 3, y + 3, w - 6, h - 6);

  ctx.fillStyle = 'rgba(120, 160, 190, 0.4)';
  ctx.fillRect(x + 10, y + 8, 1, 8);
  ctx.fillRect(x + 18, y + 14, 1, 11);
  ctx.fillRect(x + 28, y + 6, 1, 14);
  ctx.fillRect(x + 38, y + 16, 1, 7);

  ctx.fillStyle = '#22170f';
  ctx.fillRect(x + Math.floor(w / 2), y + 3, 2, h - 6);
  ctx.fillRect(x + 3, y + Math.floor(h / 2), w - 6, 2);

  ctx.fillStyle = '#483424';
  ctx.fillRect(x - 2, y + h - 2, w + 4, 4);
}

function drawDoor(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number): void {
  ctx.fillStyle = '#1c130d';
  ctx.fillRect(x - 2, y, w + 4, h);

  ctx.fillStyle = '#2a1d14';
  ctx.fillRect(x, y + 2, w, h - 2);

  ctx.fillStyle = '#1e140d';
  ctx.fillRect(x + 4, y + 6, w - 8, 14);
  ctx.strokeStyle = '#38281c';
  ctx.lineWidth = 1;
  ctx.strokeRect(x + 4, y + 6, w - 8, 14);

  ctx.fillStyle = '#1e140d';
  ctx.fillRect(x + 4, y + 24, w - 8, 14);
  ctx.strokeStyle = '#38281c';
  ctx.lineWidth = 1;
  ctx.strokeRect(x + 4, y + 24, w - 8, 14);

  // Brass plaque "217"
  ctx.fillStyle = '#c89d44';
  ctx.fillRect(x + 10, y + 9, 12, 6);
  ctx.fillStyle = '#221508';
  ctx.fillRect(x + 12, y + 11, 2, 2);
  ctx.fillRect(x + 15, y + 11, 2, 2);
  ctx.fillRect(x + 18, y + 11, 2, 2);

  // Brass doorknob
  ctx.fillStyle = '#d4aa50';
  ctx.fillRect(x + 4, y + 22, 3, 3);
}

function drawRoomDecorAndObstacles(
  ctx: CanvasRenderingContext2D,
  room: RoomDefinition,
  storyFlags?: Record<string, any>
): void {
  // Bed
  drawBed(ctx, 34, 52, 44, 60);
  // Nightstand
  drawNightstand(ctx, 82, 54, 22, 24);
  // Desk
  drawDesk(ctx, 188, 56, 58, 32, storyFlags?.chairMoved);
  // Wardrobe
  drawWardrobe(ctx, 270, 84, 22, 56);

  // If the first blackout displaced the chair into the room:
  if (storyFlags?.chairMoved) {
    drawDisplacedChair(ctx, 198, 124);
  }

  // Wall baseboard seam / open cavity beside the desk
  if (storyFlags?.hiddenCavityOpen) {
    drawOpenCavity(ctx, 248, 46, storyFlags?.phoneFound);
  } else if (storyFlags?.diaryDiscovered) {
    drawBaseboardSeam(ctx, 248, 46);
  }
}

function drawBaseboardSeam(ctx: CanvasRenderingContext2D, x: number, y: number): void {
  // Faint dark seam line in the baseboard
  ctx.fillStyle = '#090604';
  ctx.fillRect(x + 2, y, 1, 8);
  ctx.fillRect(x + 1, y + 7, 8, 1);
}

function drawOpenCavity(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  isPhonePickedUp?: boolean
): void {
  // Deep dark hollow cavity exposed in wall & floor
  ctx.fillStyle = '#000000';
  ctx.fillRect(x, y + 2, 12, 7);

  // Phone resting in the cavity if not yet picked up
  if (!isPhonePickedUp) {
    ctx.fillStyle = '#181b1c';
    ctx.fillRect(x + 3, y + 4, 6, 4);
    ctx.fillStyle = '#3a4b52';
    ctx.fillRect(x + 4, y + 5, 4, 2);
  }

  // Shifted timber baseboard pried forward
  ctx.fillStyle = '#382316';
  ctx.fillRect(x - 1, y + 7, 14, 3);
  ctx.fillStyle = '#4f3220';
  ctx.fillRect(x, y + 7, 12, 1);

  // Cold draft mist flecks
  ctx.fillStyle = 'rgba(160, 205, 235, 0.4)';
  ctx.fillRect(x + 4, y, 1, 3);
  ctx.fillRect(x + 8, y + 1, 1, 2);
}

/**
 * Draws the wooden chair displaced into the center of the room.
 */
function drawDisplacedChair(ctx: CanvasRenderingContext2D, x: number, y: number): void {
  // Drop shadow
  ctx.fillStyle = 'rgba(0, 0, 0, 0.45)';
  ctx.beginPath();
  ctx.ellipse(x + 9, y + 17, 9, 4, 0, 0, Math.PI * 2);
  ctx.fill();

  // Chair rear legs
  ctx.fillStyle = '#1c110b';
  ctx.fillRect(x + 3, y + 6, 2, 12);
  ctx.fillRect(x + 13, y + 6, 2, 12);

  // Chair front legs
  ctx.fillStyle = '#2d1a10';
  ctx.fillRect(x + 2, y + 9, 2, 11);
  ctx.fillRect(x + 14, y + 9, 2, 11);

  // Leg stretcher rails
  ctx.fillStyle = '#1a0e08';
  ctx.fillRect(x + 2, y + 15, 14, 1);

  // Wooden chair seat (angled slightly toward the room)
  ctx.fillStyle = '#3a2315';
  ctx.fillRect(x + 1, y + 6, 16, 5);
  ctx.fillStyle = '#52331f';
  ctx.fillRect(x + 2, y + 7, 14, 2);

  // Chair Backrest Spindles (angled askew)
  ctx.fillStyle = '#2a190e';
  ctx.fillRect(x + 2, y - 6, 2, 13);
  ctx.fillRect(x + 6, y - 5, 1, 12);
  ctx.fillRect(x + 9, y - 5, 1, 12);
  ctx.fillRect(x + 12, y - 5, 1, 12);
  ctx.fillRect(x + 14, y - 6, 2, 13);

  // Curved top rail
  ctx.fillStyle = '#4c301c';
  ctx.fillRect(x + 1, y - 8, 16, 3);
  ctx.fillStyle = '#634026';
  ctx.fillRect(x + 2, y - 8, 14, 1);
}

function drawBed(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number): void {
  ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
  ctx.fillRect(x - 2, y + h - 2, w + 4, 6);

  ctx.fillStyle = '#281a11';
  ctx.fillRect(x, y, w, 8);
  ctx.fillStyle = '#3c281b';
  ctx.fillRect(x + 2, y + 1, w - 4, 4);

  ctx.fillStyle = '#3a2618';
  ctx.fillRect(x, y + 8, w, h - 8);

  ctx.fillStyle = '#c7beaf';
  ctx.fillRect(x + 4, y + 10, 16, 10);
  ctx.fillRect(x + 24, y + 10, 16, 10);
  ctx.fillStyle = '#9e9485';
  ctx.fillRect(x + 6, y + 13, 12, 2);
  ctx.fillRect(x + 26, y + 13, 12, 2);

  ctx.fillStyle = '#2a3439';
  ctx.fillRect(x + 2, y + 22, w - 4, h - 24);

  ctx.fillStyle = '#b8aea0';
  ctx.fillRect(x + 2, y + 20, w - 4, 4);

  ctx.fillStyle = '#1c2428';
  ctx.fillRect(x + 6, y + 34, w - 16, 2);
  ctx.fillRect(x + 12, y + 46, w - 20, 2);

  ctx.fillStyle = '#281a11';
  ctx.fillRect(x, y + h - 4, w, 4);
}

function drawNightstand(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number): void {
  ctx.fillStyle = 'rgba(0,0,0,0.35)';
  ctx.fillRect(x - 1, y + h - 2, w + 2, 4);

  ctx.fillStyle = '#3c271a';
  ctx.fillRect(x, y, w, h);
  ctx.fillStyle = '#503523';
  ctx.fillRect(x + 1, y + 1, w - 2, 4);

  ctx.fillStyle = '#1e130c';
  ctx.fillRect(x + 2, y + 7, w - 4, 1);
  ctx.fillRect(x + 2, y + 14, w - 4, 1);

  ctx.fillStyle = '#c89d44';
  ctx.fillRect(x + Math.floor(w / 2) - 2, y + 10, 4, 2);

  ctx.fillStyle = '#23160e';
  ctx.fillRect(x + 1, y + h - 4, 3, 4);
  ctx.fillRect(x + w - 4, y + h - 4, 3, 4);

  ctx.fillStyle = '#c89d44';
  ctx.fillRect(x + 7, y - 2, 8, 3);
  ctx.fillStyle = '#8a6828';
  ctx.fillRect(x + 10, y - 8, 2, 6);
  ctx.fillStyle = '#d8cb96';
  ctx.fillRect(x + 6, y - 14, 10, 6);
  ctx.fillStyle = '#fff4bd';
  ctx.fillRect(x + 7, y - 13, 8, 4);
}

function drawDesk(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  chairMoved?: boolean
): void {
  ctx.fillStyle = 'rgba(0,0,0,0.4)';
  ctx.fillRect(x - 2, y + h - 2, w + 4, 6);

  ctx.fillStyle = '#382417';
  ctx.fillRect(x, y, w, h);
  ctx.fillStyle = '#4c3120';
  ctx.fillRect(x + 1, y + 1, w - 2, 5);

  ctx.fillStyle = '#24170e';
  ctx.fillRect(x + 2, y + 7, 16, h - 8);
  ctx.fillRect(x + w - 18, y + 7, 16, h - 8);

  ctx.fillStyle = '#c89d44';
  ctx.fillRect(x + 7, y + 12, 5, 2);
  ctx.fillRect(x + 7, y + 20, 5, 2);
  ctx.fillRect(x + w - 13, y + 12, 5, 2);
  ctx.fillRect(x + w - 13, y + 20, 5, 2);

  // Kneehole
  ctx.fillStyle = '#120b07';
  ctx.fillRect(x + 18, y + 7, w - 36, h - 7);

  // If chair is still tucked under the desk (before blackout)
  if (!chairMoved) {
    // Tucked chair backrest rail & spindles visible inside kneehole
    ctx.fillStyle = '#3a2315';
    ctx.fillRect(x + 23, y + 12, 14, 3);
    ctx.fillStyle = '#26160d';
    ctx.fillRect(x + 24, y + 15, 2, 10);
    ctx.fillRect(x + 29, y + 15, 2, 10);
    ctx.fillRect(x + 34, y + 15, 2, 10);
  } else {
    // Fallen diary on the floor beneath the desk
    ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
    ctx.fillRect(x + 21, y + 18, 12, 8); // Shadow

    ctx.fillStyle = '#362316';
    ctx.fillRect(x + 20, y + 16, 12, 8); // Leather cover
    ctx.fillStyle = '#dcd3c2';
    ctx.fillRect(x + 22, y + 17, 9, 6); // Exposed pages
    ctx.fillStyle = '#8a2016';
    ctx.fillRect(x + 24, y + 23, 2, 4); // Red ribbon bookmark
  }

  ctx.fillStyle = '#ddd5c5';
  ctx.fillRect(x + 24, y + 3, 12, 9);
  ctx.fillStyle = '#c4bbae';
  ctx.fillRect(x + 22, y + 5, 10, 8);
  ctx.fillStyle = '#4a4239';
  ctx.fillRect(x + 25, y + 5, 8, 1);
  ctx.fillRect(x + 25, y + 7, 7, 1);
  ctx.fillRect(x + 25, y + 9, 6, 1);

  ctx.fillStyle = '#ece8df';
  ctx.fillRect(x + 40, y + 4, 5, 5);
  ctx.fillStyle = '#382215';
  ctx.fillRect(x + 41, y + 5, 3, 3);
}

function drawWardrobe(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number): void {
  ctx.fillStyle = 'rgba(0,0,0,0.5)';
  ctx.fillRect(x - 2, y + h - 2, w + 4, 5);

  ctx.fillStyle = '#281a12';
  ctx.fillRect(x, y, w, h);

  ctx.fillStyle = '#3a261a';
  ctx.fillRect(x - 2, y, w + 4, 4);

  ctx.fillStyle = '#20140e';
  ctx.fillRect(x + 2, y + 5, Math.floor(w / 2) - 3, h - 9);
  ctx.fillRect(x + Math.floor(w / 2), y + 5, Math.floor(w / 2) - 2, h - 9);

  ctx.fillStyle = '#c89d44';
  ctx.fillRect(x + Math.floor(w / 2) - 3, y + 26, 2, 4);
  ctx.fillRect(x + Math.floor(w / 2) + 1, y + 26, 2, 4);
}

function drawLighting(ctx: CanvasRenderingContext2D, player: PlayerState): void {
  const px = player.position.x + 8;
  const py = player.position.y + 12;

  // Lamp warm glow
  const lampGrad = ctx.createRadialGradient(93, 56, 4, 93, 56, 75);
  lampGrad.addColorStop(0, 'rgba(235, 185, 95, 0.18)');
  lampGrad.addColorStop(0.5, 'rgba(180, 130, 60, 0.08)');
  lampGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
  ctx.fillStyle = lampGrad;
  ctx.fillRect(0, 0, VIRTUAL_WIDTH, VIRTUAL_HEIGHT);

  // Cold moonlight beam from window
  const moonGrad = ctx.createRadialGradient(148, 24, 6, 148, 100, 110);
  moonGrad.addColorStop(0, 'rgba(90, 140, 180, 0.14)');
  moonGrad.addColorStop(0.6, 'rgba(40, 80, 110, 0.05)');
  moonGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
  ctx.fillStyle = moonGrad;
  ctx.fillRect(0, 0, VIRTUAL_WIDTH, VIRTUAL_HEIGHT);

  // Player personal aura
  const playerAura = ctx.createRadialGradient(px, py, 4, px, py, 60);
  playerAura.addColorStop(0, 'rgba(255, 255, 255, 0.04)');
  playerAura.addColorStop(1, 'rgba(0, 0, 0, 0)');
  ctx.fillStyle = playerAura;
  ctx.fillRect(0, 0, VIRTUAL_WIDTH, VIRTUAL_HEIGHT);

  // Perimeter darkness vignette
  const vignette = ctx.createRadialGradient(
    VIRTUAL_WIDTH / 2,
    VIRTUAL_HEIGHT / 2,
    90,
    VIRTUAL_WIDTH / 2,
    VIRTUAL_HEIGHT / 2,
    180
  );
  vignette.addColorStop(0, 'rgba(0, 0, 0, 0)');
  vignette.addColorStop(0.7, 'rgba(0, 0, 0, 0.25)');
  vignette.addColorStop(1, 'rgba(0, 0, 0, 0.7)');
  ctx.fillStyle = vignette;
  ctx.fillRect(0, 0, VIRTUAL_WIDTH, VIRTUAL_HEIGHT);
}

/* =========================================================================
   PLAYER & UI RENDERING
   ========================================================================= */

function drawPlayer(ctx: CanvasRenderingContext2D, player: PlayerState, walkFrame: number): void {
  const px = Math.round(player.position.x);
  const py = Math.round(player.position.y);

  // Soft oval drop shadow beneath feet
  ctx.fillStyle = 'rgba(0, 0, 0, 0.45)';
  ctx.beginPath();
  ctx.ellipse(px + 8, py + 22, 6, 3, 0, 0, Math.PI * 2);
  ctx.fill();

  const bob = player.isMoving ? (walkFrame % 2 === 0 ? 1 : 0) : 0;
  const legStep = player.isMoving ? (walkFrame % 4) : 0;

  switch (player.direction) {
    case 'down': {
      ctx.fillStyle = '#1c1c20';
      if (legStep === 1) {
        ctx.fillRect(px + 4, py + 18, 3, 4);
        ctx.fillRect(px + 9, py + 19, 3, 3);
      } else if (legStep === 3) {
        ctx.fillRect(px + 4, py + 19, 3, 3);
        ctx.fillRect(px + 9, py + 18, 3, 4);
      } else {
        ctx.fillRect(px + 4, py + 18, 3, 4);
        ctx.fillRect(px + 9, py + 18, 3, 4);
      }
      ctx.fillStyle = '#111012';
      ctx.fillRect(px + 4, py + 22, 3, 2);
      ctx.fillRect(px + 9, py + 22, 3, 2);

      ctx.fillStyle = '#443c34';
      ctx.fillRect(px + 3, py + 8 + bob, 10, 11);
      ctx.fillStyle = '#564d43';
      ctx.fillRect(px + 6, py + 9 + bob, 4, 5);
      ctx.fillStyle = '#22201e';
      ctx.fillRect(px + 7, py + 11 + bob, 2, 8);

      ctx.fillStyle = '#d4a381';
      ctx.fillRect(px + 5, py + 5 + bob, 6, 4);
      ctx.fillStyle = '#241b18';
      ctx.fillRect(px + 6, py + 7 + bob, 1, 1);
      ctx.fillRect(px + 9, py + 7 + bob, 1, 1);

      ctx.fillStyle = '#36302a';
      ctx.fillRect(px + 2, py + 4 + bob, 12, 2);
      ctx.fillRect(px + 4, py + 1 + bob, 8, 4);
      ctx.fillStyle = '#221e1a';
      ctx.fillRect(px + 4, py + 4 + bob, 8, 1);
      break;
    }

    case 'up': {
      ctx.fillStyle = '#1c1c20';
      if (legStep === 1) {
        ctx.fillRect(px + 4, py + 18, 3, 4);
        ctx.fillRect(px + 9, py + 19, 3, 3);
      } else if (legStep === 3) {
        ctx.fillRect(px + 4, py + 19, 3, 3);
        ctx.fillRect(px + 9, py + 18, 3, 4);
      } else {
        ctx.fillRect(px + 4, py + 18, 3, 4);
        ctx.fillRect(px + 9, py + 18, 3, 4);
      }
      ctx.fillStyle = '#111012';
      ctx.fillRect(px + 4, py + 22, 3, 2);
      ctx.fillRect(px + 9, py + 22, 3, 2);

      ctx.fillStyle = '#443c34';
      ctx.fillRect(px + 3, py + 8 + bob, 10, 11);
      ctx.fillStyle = '#2e2823';
      ctx.fillRect(px + 7, py + 10 + bob, 2, 9);

      ctx.fillStyle = '#241b18';
      ctx.fillRect(px + 5, py + 5 + bob, 6, 4);

      ctx.fillStyle = '#36302a';
      ctx.fillRect(px + 2, py + 4 + bob, 12, 2);
      ctx.fillRect(px + 4, py + 1 + bob, 8, 4);
      ctx.fillStyle = '#221e1a';
      ctx.fillRect(px + 4, py + 4 + bob, 8, 1);
      break;
    }

    case 'left': {
      ctx.fillStyle = '#1c1c20';
      const stride = player.isMoving ? (legStep === 1 ? -2 : legStep === 3 ? 2 : 0) : 0;
      ctx.fillRect(px + 5 + stride, py + 18, 3, 4);
      ctx.fillRect(px + 7 - stride, py + 18, 3, 4);
      ctx.fillStyle = '#111012';
      ctx.fillRect(px + 4 + stride, py + 22, 4, 2);
      ctx.fillRect(px + 6 - stride, py + 22, 4, 2);

      ctx.fillStyle = '#443c34';
      ctx.fillRect(px + 4, py + 8 + bob, 8, 11);
      ctx.fillStyle = '#2e2823';
      ctx.fillRect(px + 3, py + 10 + bob, 3, 7);

      ctx.fillStyle = '#d4a381';
      ctx.fillRect(px + 4, py + 5 + bob, 4, 4);
      ctx.fillStyle = '#241b18';
      ctx.fillRect(px + 4, py + 7 + bob, 1, 1);

      ctx.fillStyle = '#36302a';
      ctx.fillRect(px + 1, py + 4 + bob, 12, 2);
      ctx.fillRect(px + 4, py + 1 + bob, 7, 4);
      ctx.fillStyle = '#221e1a';
      ctx.fillRect(px + 4, py + 4 + bob, 7, 1);
      break;
    }

    case 'right': {
      ctx.fillStyle = '#1c1c20';
      const stride = player.isMoving ? (legStep === 1 ? -2 : legStep === 3 ? 2 : 0) : 0;
      ctx.fillRect(px + 5 + stride, py + 18, 3, 4);
      ctx.fillRect(px + 7 - stride, py + 18, 3, 4);
      ctx.fillStyle = '#111012';
      ctx.fillRect(px + 6 + stride, py + 22, 4, 2);
      ctx.fillRect(px + 8 - stride, py + 22, 4, 2);

      ctx.fillStyle = '#443c34';
      ctx.fillRect(px + 4, py + 8 + bob, 8, 11);
      ctx.fillStyle = '#2e2823';
      ctx.fillRect(px + 10, py + 10 + bob, 3, 7);

      ctx.fillStyle = '#d4a381';
      ctx.fillRect(px + 8, py + 5 + bob, 4, 4);
      ctx.fillStyle = '#241b18';
      ctx.fillRect(px + 11, py + 7 + bob, 1, 1);

      ctx.fillStyle = '#36302a';
      ctx.fillRect(px + 3, py + 4 + bob, 12, 2);
      ctx.fillRect(px + 5, py + 1 + bob, 7, 4);
      ctx.fillStyle = '#221e1a';
      ctx.fillRect(px + 5, py + 4 + bob, 7, 1);
      break;
    }
  }
}

function drawInteractionCue(ctx: CanvasRenderingContext2D, item: InteractableObject): void {
  const cx = Math.floor(item.rect.x + item.rect.width / 2);
  const cy = Math.floor(item.rect.y - 6);

  const badgeW = 20;
  const badgeH = 10;
  const bx = cx - Math.floor(badgeW / 2);
  const by = cy - badgeH;

  ctx.fillStyle = 'rgba(15, 15, 20, 0.9)';
  ctx.fillRect(bx, by, badgeW, badgeH);

  ctx.strokeStyle = '#d4aa50';
  ctx.lineWidth = 1;
  ctx.strokeRect(bx + 0.5, by + 0.5, badgeW - 1, badgeH - 1);

  ctx.fillStyle = '#ffffff';
  ctx.font = '7px monospace';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('[E]', cx, by + Math.floor(badgeH / 2));
}

function drawDebugOverlay(
  ctx: CanvasRenderingContext2D,
  room: RoomDefinition,
  player: PlayerState,
  activeInteractable: InteractableObject | null
): void {
  // Walls (red)
  ctx.strokeStyle = 'rgba(255, 60, 60, 0.7)';
  ctx.lineWidth = 1;
  for (const wall of room.walls) {
    ctx.strokeRect(wall.x + 0.5, wall.y + 0.5, wall.width - 1, wall.height - 1);
  }

  // Obstacles (orange)
  ctx.strokeStyle = 'rgba(255, 160, 40, 0.8)';
  for (const obs of room.obstacles) {
    ctx.strokeRect(obs.rect.x + 0.5, obs.rect.y + 0.5, obs.rect.width - 1, obs.rect.height - 1);
  }

  // Interactables (cyan or bright yellow when active)
  for (const item of room.interactables) {
    const isActive = activeInteractable?.id === item.id;
    ctx.strokeStyle = isActive ? 'rgba(255, 255, 0, 0.9)' : 'rgba(40, 200, 255, 0.5)';
    ctx.strokeRect(item.rect.x + 0.5, item.rect.y + 0.5, item.rect.width - 1, item.rect.height - 1);
  }

  // Player feet hitbox (green)
  ctx.strokeStyle = 'rgba(60, 255, 60, 0.9)';
  ctx.strokeRect(
    player.position.x + PLAYER_HITBOX_OFFSET_X + 0.5,
    player.position.y + PLAYER_HITBOX_OFFSET_Y + 0.5,
    PLAYER_HITBOX_WIDTH - 1,
    PLAYER_HITBOX_HEIGHT - 1
  );
}

/* =========================================================================
   HOSTEL BASEMENT RENDERING
   ========================================================================= */

function drawBasementFloor(ctx: CanvasRenderingContext2D): void {
  const floorX = 24;
  const floorY = 74;
  const floorW = VIRTUAL_WIDTH - 48;
  const floorH = 130;

  // Cold damp stone paver base
  ctx.fillStyle = '#0f1315';
  ctx.fillRect(floorX, floorY, floorW, floorH);

  // Irregular concrete / stone pavers
  const tileW = 24;
  const tileH = 18;
  for (let y = floorY; y < floorY + floorH; y += tileH) {
    const isOddRow = Math.floor((y - floorY) / tileH) % 2 === 1;
    const xOffset = isOddRow ? 12 : 0;
    for (let x = floorX - xOffset; x < floorX + floorW; x += tileW) {
      ctx.fillStyle = '#161b1e';
      ctx.fillRect(
        Math.max(floorX, x + 1),
        y + 1,
        Math.min(tileW - 2, floorX + floorW - x - 1),
        tileH - 2
      );

      // Subtle salt/damp flecks
      if ((x + y) % 5 === 0) {
        ctx.fillStyle = '#1f2529';
        ctx.fillRect(Math.max(floorX, x + 4), y + 4, 3, 2);
      }
    }
  }

  // Mortar lines
  ctx.fillStyle = '#080a0b';
  for (let y = floorY; y <= floorY + floorH; y += tileH) {
    ctx.fillRect(floorX, y, floorW, 1);
  }

  // Water puddle on the floor
  ctx.fillStyle = 'rgba(25, 45, 55, 0.45)';
  ctx.beginPath();
  ctx.ellipse(90, 165, 34, 12, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = 'rgba(70, 110, 130, 0.25)';
  ctx.beginPath();
  ctx.ellipse(88, 164, 20, 6, 0, 0, Math.PI * 2);
  ctx.fill();
}

function drawBasementWalls(ctx: CanvasRenderingContext2D): void {
  // Top foundation wall
  ctx.fillStyle = '#121618';
  ctx.fillRect(0, 0, VIRTUAL_WIDTH, 74);

  // Exposed rough stone brickwork
  ctx.fillStyle = '#0a0d0e';
  for (let y = 14; y < 74; y += 12) {
    ctx.fillRect(0, y, VIRTUAL_WIDTH, 1);
    const row = Math.floor(y / 12);
    const offset = row % 2 === 0 ? 0 : 16;
    for (let x = offset; x < VIRTUAL_WIDTH; x += 32) {
      ctx.fillRect(x, y, 1, 12);
    }
  }

  // Left & Right boundary stone walls
  ctx.fillStyle = '#0d1012';
  ctx.fillRect(0, 0, 24, VIRTUAL_HEIGHT);
  ctx.fillRect(VIRTUAL_WIDTH - 24, 0, 24, VIRTUAL_HEIGHT);

  // Bottom wall footing
  ctx.fillStyle = '#0a0d0e';
  ctx.fillRect(0, 204, VIRTUAL_WIDTH, 36);

  // Overhead rusted copper / iron pipes along ceiling
  ctx.fillStyle = '#263438';
  ctx.fillRect(24, 8, VIRTUAL_WIDTH - 48, 4);
  ctx.fillStyle = '#4a2f1c'; // Rusted pipe
  ctx.fillRect(24, 16, VIRTUAL_WIDTH - 48, 5);

  // Staircase opening in the center wall (x: 144 to 176)
  // Dark staircase alcove
  ctx.fillStyle = '#050708';
  ctx.fillRect(144, 18, 32, 56);
  // Wooden stairs ascending into darkness
  for (let i = 0; i < 5; i++) {
    const sy = 64 - i * 9;
    ctx.fillStyle = '#4d3423';
    ctx.fillRect(146, sy, 28, 3);
    ctx.fillStyle = '#2a1b12';
    ctx.fillRect(146, sy + 3, 28, 6);
  }
}

function drawBasementDecor(
  ctx: CanvasRenderingContext2D,
  room: RoomDefinition,
  storyFlags?: Record<string, any>,
  shadowFigure?: { active: boolean; alpha: number; x: number; y: number } | null
): void {
  // 1. Cast Iron Boiler (x: 32, y: 78, w: 48, h: 54)
  const bx = 32;
  const by = 78;
  // Boiler shadow
  ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
  ctx.fillRect(bx - 2, by + 46, 52, 10);
  // Cylindrical boiler body
  ctx.fillStyle = '#14181a';
  ctx.fillRect(bx + 4, by + 8, 40, 42);
  ctx.fillStyle = '#232b2e';
  ctx.fillRect(bx + 6, by + 6, 36, 4); // Boiler rounded top
  // Flue pipe running into wall
  ctx.fillStyle = '#1c2225';
  ctx.fillRect(bx + 18, by, 12, 8);
  // Rusted metal seams & rivets
  ctx.fillStyle = '#4a2c1a';
  ctx.fillRect(bx + 4, by + 20, 40, 2);
  ctx.fillRect(bx + 4, by + 34, 40, 2);
  // Round brass pressure gauge
  ctx.fillStyle = '#9e813a';
  ctx.beginPath();
  ctx.arc(bx + 24, by + 16, 5, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#fffdf0';
  ctx.beginPath();
  ctx.arc(bx + 24, by + 16, 3, 0, Math.PI * 2);
  ctx.fill();

  // 2. Storage Shelves (x: 240, y: 78, w: 48, h: 54)
  const sx = 240;
  const sy = 78;
  // Shelving frame
  ctx.fillStyle = '#2d1e14';
  ctx.fillRect(sx, sy, 4, 54);
  ctx.fillRect(sx + 44, sy, 4, 54);
  // Shelves horizontal planks
  ctx.fillStyle = '#3d281a';
  ctx.fillRect(sx, sy + 16, 48, 3);
  ctx.fillRect(sx, sy + 34, 48, 3);
  ctx.fillRect(sx, sy + 51, 48, 3);
  // Stacked cardboard archives & ledgers
  ctx.fillStyle = '#42362a';
  ctx.fillRect(sx + 6, sy + 5, 18, 11);
  ctx.fillStyle = '#34291f';
  ctx.fillRect(sx + 26, sy + 7, 14, 9);
  // Lower shelf moldy binders
  ctx.fillStyle = '#2a3b35';
  ctx.fillRect(sx + 6, sy + 21, 8, 13);
  ctx.fillStyle = '#3d3024';
  ctx.fillRect(sx + 16, sy + 23, 22, 11);

  // 3. Workbench (x: 126, y: 136, w: 68, h: 32)
  const wx = 126;
  const wy = 136;
  // Workbench shadow
  ctx.fillStyle = 'rgba(0, 0, 0, 0.65)';
  ctx.fillRect(wx - 4, wy + 26, 76, 8);
  // Heavy timber legs
  ctx.fillStyle = '#1e140d';
  ctx.fillRect(wx + 4, wy + 8, 6, 22);
  ctx.fillRect(wx + 58, wy + 8, 6, 22);
  // Thick scarred oak tabletop
  ctx.fillStyle = '#332115';
  ctx.fillRect(wx, wy, 68, 10);
  ctx.fillStyle = '#452d1d';
  ctx.fillRect(wx, wy, 68, 2); // Tabletop bevel

  // 4. The Iron-Banded Box on the workbench (x: 144, y: 122, w: 32, h: 16)
  const isBoxOpen = Boolean(storyFlags?.boxUnlocked);
  const boxX = 144;
  const boxY = 122;
  // Box shadow
  ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
  ctx.fillRect(boxX - 1, boxY + 13, 34, 4);

  // Box oak body
  ctx.fillStyle = '#3a2618';
  ctx.fillRect(boxX, boxY + 4, 32, 10);

  // Iron straps
  ctx.fillStyle = '#16191b';
  ctx.fillRect(boxX + 4, boxY + 4, 3, 10);
  ctx.fillRect(boxX + 25, boxY + 4, 3, 10);

  if (!isBoxOpen) {
    // Closed box lid
    ctx.fillStyle = '#4a3220';
    ctx.fillRect(boxX - 1, boxY, 34, 5);
    ctx.fillStyle = '#16191b';
    ctx.fillRect(boxX + 4, boxY, 3, 5);
    ctx.fillRect(boxX + 25, boxY, 3, 5);
    // Brass latch
    ctx.fillStyle = '#d4b459';
    ctx.fillRect(boxX + 14, boxY + 4, 4, 3);
  } else {
    // Open box lid tilted back
    ctx.fillStyle = '#2d1c11';
    ctx.fillRect(boxX, boxY - 4, 32, 5);
    // Dark void inside box
    ctx.fillStyle = '#060403';
    ctx.fillRect(boxX + 2, boxY + 1, 28, 6);
    // Oilcloth parcel bundle
    ctx.fillStyle = '#1c241d';
    ctx.fillRect(boxX + 6, boxY + 2, 20, 5);
  }

  // 5. Stationary Shadow Figure (in the dim alcove near the archives)
  if (shadowFigure?.active && shadowFigure.alpha > 0) {
    drawShadowFigure(ctx, shadowFigure.x, shadowFigure.y, shadowFigure.alpha);
  }
}

function drawShadowFigure(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  alpha: number,
  revealFace: boolean = true
): void {
  ctx.save();
  ctx.globalAlpha = Math.max(0, Math.min(1, alpha));

  // Shadow pool at feet on concrete floor
  ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
  ctx.beginPath();
  ctx.ellipse(x + 7, y + 42, 9, 3, 0, 0, Math.PI * 2);
  ctx.fill();

  // Pure dark humanoid silhouette (darker than environment)
  ctx.fillStyle = '#020304';

  // Torso & long coat
  ctx.fillRect(x + 2, y + 14, 10, 26);
  // Slender raised shoulders
  ctx.fillRect(x, y + 13, 14, 4);

  // Long arms hanging dead-still at sides
  ctx.fillRect(x - 1, y + 15, 3, 21);
  ctx.fillRect(x + 12, y + 15, 3, 21);

  // Head silhouette
  ctx.beginPath();
  ctx.ellipse(x + 7, y + 6, 5, 7, 0, 0, Math.PI * 2);
  ctx.fill();

  // Face Reveal (midway through approach):
  // When revealFace is false: completely dark, unreadable faceless humanoid silhouette.
  // When revealFace is true: deeply disturbing supernatural face looking directly through the screen at the viewer with an unnatural creepy smile.
  if (revealFace) {
    // 1. Faint ashen death-pallor skin mask emerging from the void
    ctx.fillStyle = 'rgba(165, 178, 185, 0.18)';
    ctx.fillRect(x + 3, y + 3, 9, 8);

    // 2. Sunken, cavernous orbital eye sockets
    ctx.fillStyle = '#010203';
    ctx.fillRect(x + 3, y + 3, 4, 4);
    ctx.fillRect(x + 8, y + 3, 4, 4);

    // 3. Direct Camera Eye Contact:
    // Pale unblinking supernatural sclera staring straight out of the screen at the real viewer
    ctx.fillStyle = 'rgba(238, 246, 252, 0.92)';
    ctx.fillRect(x + 4, y + 4, 2, 2);
    ctx.fillRect(x + 9, y + 4, 2, 2);

    // Piercing needle pupils locked dead forward onto the viewer
    ctx.fillStyle = '#000000';
    ctx.fillRect(x + 5, y + 4, 1, 1);
    ctx.fillRect(x + 9, y + 4, 1, 1);

    // 4. Sunken gaunt cheek hollows
    ctx.fillStyle = 'rgba(0, 0, 0, 0.65)';
    ctx.fillRect(x + 2, y + 7, 2, 3);
    ctx.fillRect(x + 11, y + 7, 2, 3);

    // 5. Deeply Disturbing Supernatural Smile:
    // Unnaturally wide, cold porcelain grin curving slightly up toward the cheekbones
    ctx.fillStyle = '#e8eff4';
    ctx.fillRect(x + 3, y + 9, 9, 1);
    ctx.fillRect(x + 2, y + 8, 1, 1);
    ctx.fillRect(x + 12, y + 8, 1, 1);

    // Dark separation inside the mouth
    ctx.fillStyle = '#000000';
    ctx.fillRect(x + 3, y + 8, 9, 1);

    // Pale, unsettling teeth slivers
    ctx.fillStyle = 'rgba(245, 250, 255, 0.95)';
    [3, 5, 7, 9, 11].forEach((tx) => {
      ctx.fillRect(x + tx, y + 8, 1, 1);
    });
  }

  ctx.restore();
}

function drawBasementLighting(ctx: CanvasRenderingContext2D, player: PlayerState): void {
  // Center hanging bulb pale warm light pool
  const centerBulb = ctx.createRadialGradient(160, 60, 10, 160, 120, 110);
  centerBulb.addColorStop(0, 'rgba(215, 180, 120, 0.22)');
  centerBulb.addColorStop(0.5, 'rgba(120, 100, 70, 0.08)');
  centerBulb.addColorStop(1, 'rgba(0, 0, 0, 0)');
  ctx.fillStyle = centerBulb;
  ctx.fillRect(24, 60, VIRTUAL_WIDTH - 48, 140);

  // Player personal flashlight vignette
  const px = player.position.x + 8;
  const py = player.position.y + 12;

  const playerGlow = ctx.createRadialGradient(px, py, 6, px, py, 58);
  playerGlow.addColorStop(0, 'rgba(200, 230, 245, 0.24)');
  playerGlow.addColorStop(0.6, 'rgba(100, 150, 180, 0.07)');
  playerGlow.addColorStop(1, 'rgba(0, 0, 0, 0)');
  ctx.fillStyle = playerGlow;
  ctx.fillRect(0, 0, VIRTUAL_WIDTH, VIRTUAL_HEIGHT);

  // Cold, dark peripheral basement darkness vignette
  const vignette = ctx.createRadialGradient(
    VIRTUAL_WIDTH / 2,
    VIRTUAL_HEIGHT / 2,
    55,
    VIRTUAL_WIDTH / 2,
    VIRTUAL_HEIGHT / 2,
    145
  );
  vignette.addColorStop(0, 'rgba(0, 0, 0, 0)');
  vignette.addColorStop(0.65, 'rgba(6, 9, 11, 0.65)');
  vignette.addColorStop(1, 'rgba(3, 5, 7, 0.94)');
  ctx.fillStyle = vignette;
  ctx.fillRect(0, 0, VIRTUAL_WIDTH, VIRTUAL_HEIGHT);
}

/* =========================================================================
   ROOM 214 — ABANDONED ROOM RENDERING
   ========================================================================= */

function drawRoom214Floor(ctx: CanvasRenderingContext2D): void {
  const floorX = 32;
  const floorY = 78;
  const floorW = VIRTUAL_WIDTH - 64;
  const floorH = 118;

  // Dark dusty floorboards
  ctx.fillStyle = '#1c1611';
  ctx.fillRect(floorX, floorY, floorW, floorH);

  // Horizontal wood planks
  const plankH = 12;
  for (let y = floorY; y < floorY + floorH; y += plankH) {
    ctx.fillStyle = Math.floor((y - floorY) / plankH) % 2 === 0 ? '#221b14' : '#19130f';
    ctx.fillRect(floorX, y, floorW, plankH - 1);

    // Seam line
    ctx.fillStyle = '#0f0b08';
    ctx.fillRect(floorX, y + plankH - 1, floorW, 1);

    // Vertical grain / cracks
    for (let x = floorX + 24; x < floorX + floorW; x += 48) {
      if ((x + y) % 3 === 0) {
        ctx.fillStyle = '#0e0a07';
        ctx.fillRect(x, y, 1, plankH - 1);
      }
    }
  }

  // Water damage dark stains on floor
  ctx.fillStyle = 'rgba(10, 8, 6, 0.55)';
  ctx.beginPath();
  ctx.ellipse(100, 140, 26, 10, 0, 0, Math.PI * 2);
  ctx.fill();
}

function drawRoom214Walls(ctx: CanvasRenderingContext2D): void {
  // Back wall (y: 0 to 78)
  ctx.fillStyle = '#1e1813';
  ctx.fillRect(32, 0, VIRTUAL_WIDTH - 64, 78);

  // Peeling wallpaper torn down to grey plaster
  ctx.fillStyle = '#3a3229'; // Raw plaster patch
  ctx.fillRect(110, 20, 80, 50);
  ctx.fillStyle = '#2d261e';
  ctx.fillRect(118, 26, 64, 38);

  // Wallpaper remnants around plaster
  ctx.fillStyle = '#1c1510';
  ctx.fillRect(32, 70, VIRTUAL_WIDTH - 64, 8); // Baseboard

  // Left & right walls
  ctx.fillStyle = '#140f0c';
  ctx.fillRect(0, 0, 32, VIRTUAL_HEIGHT);
  ctx.fillRect(VIRTUAL_WIDTH - 32, 0, 32, VIRTUAL_HEIGHT);

  // Foreground wall (y: 196 to 240) with doorway opening at x: 146
  ctx.fillStyle = '#0f0b08';
  ctx.fillRect(0, 196, 146, 44);
  ctx.fillRect(174, 196, VIRTUAL_WIDTH - 174, 44);

  // Doorway threshold frame
  ctx.fillStyle = '#261b13';
  ctx.fillRect(144, 194, 32, 4);
}

function drawRoom214Decor(
  ctx: CanvasRenderingContext2D,
  room: RoomDefinition,
  storyFlags?: Record<string, any>
): void {
  // 1. Stripped Rusted Bed Frame (x: 44, y: 84, w: 50, h: 60)
  const bx = 44;
  const by = 84;
  // Floor shadow
  ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
  ctx.fillRect(bx - 2, by + 50, 54, 12);

  // Rusted headboard iron frame & corner posts
  ctx.fillStyle = '#382518';
  ctx.fillRect(bx, by, 4, 48); // Left post
  ctx.fillRect(bx + 46, by, 4, 48); // Right post
  ctx.fillRect(bx, by + 4, 50, 3); // Top rail
  ctx.fillRect(bx, by + 18, 50, 2); // Mid rail

  // Bare metal spring coils grid (no mattress)
  ctx.fillStyle = '#1f1610';
  ctx.fillRect(bx + 4, by + 18, 42, 38);
  ctx.fillStyle = '#523a27'; // Iron coils
  for (let cy = by + 22; cy < by + 52; cy += 8) {
    for (let cx = bx + 8; cx < bx + 42; cx += 8) {
      ctx.beginPath();
      ctx.arc(cx, cy, 2.5, 0, Math.PI * 2);
      ctx.stroke();
    }
  }

  // 2. Gouged Wallpaper Scratches on Back Wall (x: 140, y: 56, w: 40, h: 26)
  ctx.fillStyle = '#0a0604';
  [144, 149, 154, 159].forEach((sx) => {
    ctx.beginPath();
    ctx.moveTo(sx, 48);
    ctx.lineTo(sx - 2, 70);
    ctx.strokeStyle = '#0a0604';
    ctx.lineWidth = 1.5;
    ctx.stroke();
  });

  // 3. Broken Chair in Corner (x: 242, y: 84, w: 24, h: 26)
  const cx = 242;
  const cy = 84;
  ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
  ctx.fillRect(cx - 2, cy + 20, 28, 8);
  ctx.fillStyle = '#382519';
  ctx.fillRect(cx, cy + 6, 18, 3); // Cracked seat
  ctx.fillRect(cx + 2, cy + 9, 3, 14); // Broken leg
  ctx.fillRect(cx + 14, cy + 9, 3, 14);
  // Fallen backrest leaning sideways
  ctx.beginPath();
  ctx.moveTo(cx + 16, cy + 6);
  ctx.lineTo(cx + 24, cy - 8);
  ctx.strokeStyle = '#2d1c12';
  ctx.lineWidth = 3;
  ctx.stroke();

  // 4. The Brass Key & Note on Floor (x: 238, y: 114, w: 28, h: 28)
  const kx = 238;
  const ky = 114;
  if (!storyFlags?.room217KeyFound) {
    // Drop shadow
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(kx, ky + 1, 18, 14);

    // Ragged scrap of paper
    ctx.fillStyle = '#dcd3b8';
    ctx.fillRect(kx, ky, 16, 12);
    // Dark frantic scratch text indication
    ctx.fillStyle = '#22150a';
    ctx.fillRect(kx + 2, ky + 3, 12, 1);
    ctx.fillRect(kx + 2, ky + 6, 10, 1);

    // Brass key attached to note
    ctx.fillStyle = '#d4aa50';
    ctx.fillRect(kx + 10, ky + 7, 10, 4); // Key body
    ctx.fillStyle = '#8f7035';
    ctx.fillRect(kx + 16, ky + 11, 4, 3); // Bit teeth
    ctx.fillStyle = '#fae196';
    ctx.fillRect(kx + 9, ky + 8, 3, 2); // Glint
  } else {
    // Pale dusty outline where it lay
    ctx.fillStyle = '#2c221a';
    ctx.fillRect(kx + 1, ky + 1, 16, 12);
  }
}

function drawRoom214Lighting(ctx: CanvasRenderingContext2D, player: PlayerState): void {
  // Cold, pale, dead ambient room light
  const ambient = ctx.createRadialGradient(160, 110, 10, 160, 120, 120);
  ambient.addColorStop(0, 'rgba(160, 180, 190, 0.08)');
  ambient.addColorStop(0.7, 'rgba(60, 70, 75, 0.03)');
  ambient.addColorStop(1, 'rgba(0, 0, 0, 0)');
  ctx.fillStyle = ambient;
  ctx.fillRect(32, 60, VIRTUAL_WIDTH - 64, 140);

  // Player personal flashlight vignette
  const px = player.position.x + 8;
  const py = player.position.y + 12;

  const playerGlow = ctx.createRadialGradient(px, py, 6, px, py, 62);
  playerGlow.addColorStop(0, 'rgba(215, 235, 245, 0.22)');
  playerGlow.addColorStop(0.6, 'rgba(110, 150, 175, 0.06)');
  playerGlow.addColorStop(1, 'rgba(0, 0, 0, 0)');
  ctx.fillStyle = playerGlow;
  ctx.fillRect(0, 0, VIRTUAL_WIDTH, VIRTUAL_HEIGHT);

  // Heavy dark vignette closing in on the bare corners
  const vignette = ctx.createRadialGradient(
    VIRTUAL_WIDTH / 2,
    VIRTUAL_HEIGHT / 2,
    50,
    VIRTUAL_WIDTH / 2,
    VIRTUAL_HEIGHT / 2,
    145
  );
  vignette.addColorStop(0, 'rgba(0, 0, 0, 0)');
  vignette.addColorStop(0.65, 'rgba(8, 7, 6, 0.65)');
  vignette.addColorStop(1, 'rgba(4, 3, 2, 0.95)');
  ctx.fillStyle = vignette;
  ctx.fillRect(0, 0, VIRTUAL_WIDTH, VIRTUAL_HEIGHT);
}

/* =========================================================================
   HOSTEL BACKYARD — OUTDOOR COURTYARD & WELL RENDERING
   ========================================================================= */

function drawBackyardGround(ctx: CanvasRenderingContext2D): void {
  // Muddy dark earth base
  ctx.fillStyle = '#111613';
  ctx.fillRect(34, 75, VIRTUAL_WIDTH - 66, 120);

  // Wet mud textures and darker earth variations
  ctx.fillStyle = '#0c100e';
  for (let y = 78; y < 192; y += 14) {
    for (let x = 38; x < 282; x += 22) {
      if ((x * 3 + y * 7) % 5 === 0) {
        ctx.fillRect(x, y, 16, 4);
      }
    }
  }

  // Worn cobblestone pathway leading from fire exit door (x:34, y:120-145) toward well (x:188, y:104)
  const pathStones = [
    { x: 42, y: 130, w: 12, h: 7 },
    { x: 58, y: 132, w: 14, h: 8 },
    { x: 74, y: 128, w: 13, h: 7 },
    { x: 90, y: 126, w: 15, h: 8 },
    { x: 108, y: 122, w: 14, h: 7 },
    { x: 124, y: 120, w: 13, h: 8 },
    { x: 140, y: 116, w: 14, h: 7 },
    { x: 156, y: 114, w: 15, h: 8 },
    { x: 172, y: 112, w: 12, h: 7 },
    // Scattered auxiliary stepping stones
    { x: 64, y: 144, w: 10, h: 6 },
    { x: 96, y: 140, w: 11, h: 6 },
    { x: 132, y: 134, w: 10, h: 6 },
    { x: 168, y: 128, w: 11, h: 6 },
  ];

  pathStones.forEach((stone) => {
    // Wet cobblestone shadow
    ctx.fillStyle = '#080c09';
    ctx.fillRect(stone.x, stone.y + 1, stone.w, stone.h);
    // Stone body
    ctx.fillStyle = '#222d28';
    ctx.fillRect(stone.x, stone.y, stone.w, stone.h - 1);
    // Mossy edge
    ctx.fillStyle = '#18241b';
    ctx.fillRect(stone.x + 1, stone.y + 1, 3, stone.h - 3);
    // Wet highlight glint
    ctx.fillStyle = 'rgba(160, 190, 205, 0.18)';
    ctx.fillRect(stone.x + 2, stone.y, stone.w - 4, 1);
  });

  // Dark rain puddles with murky water sheen
  const puddles = [
    { x: 112, y: 154, rx: 18, ry: 7 },
    { x: 196, y: 150, rx: 22, ry: 8 },
    { x: 236, y: 122, rx: 14, ry: 6 },
    { x: 70, y: 102, rx: 12, ry: 5 },
  ];

  puddles.forEach((p) => {
    // Outer damp ring
    ctx.fillStyle = '#0a100d';
    ctx.beginPath();
    ctx.ellipse(p.x, p.y, p.rx + 2, p.ry + 2, 0, 0, Math.PI * 2);
    ctx.fill();

    // Water surface
    ctx.fillStyle = '#0f1820';
    ctx.beginPath();
    ctx.ellipse(p.x, p.y, p.rx, p.ry, 0, 0, Math.PI * 2);
    ctx.fill();

    // Rain ripple reflections
    ctx.fillStyle = 'rgba(140, 185, 215, 0.25)';
    ctx.fillRect(p.x - p.rx + 5, p.y - 1, p.rx * 1.2, 1);
    ctx.fillRect(p.x - p.rx + 8, p.y + 2, p.rx * 0.8, 1);
  });

  // Dark clumps of wild wet grass and creeping weeds
  ctx.fillStyle = '#162319';
  const weeds = [
    [48, 88], [80, 168], [144, 178], [210, 172], [260, 150], [250, 96], [160, 90]
  ];
  weeds.forEach(([wx, wy]) => {
    ctx.fillRect(wx, wy, 2, 5);
    ctx.fillRect(wx - 2, wy + 2, 6, 2);
    ctx.fillRect(wx + 3, wy + 1, 2, 4);
  });
}

function drawBackyardWalls(ctx: CanvasRenderingContext2D): void {
  // Top stone perimeter wall (y: 0 to 75)
  // Dark sky behind iron railing
  const skyGrad = ctx.createLinearGradient(0, 0, 0, 50);
  skyGrad.addColorStop(0, '#04070a');
  skyGrad.addColorStop(1, '#091017');
  ctx.fillStyle = skyGrad;
  ctx.fillRect(0, 0, VIRTUAL_WIDTH, 50);

  // Distant iron railing posts atop wall (y: 18 to 44)
  ctx.fillStyle = '#12171c';
  for (let rx = 36; rx < 288; rx += 8) {
    ctx.fillRect(rx, 22, 2, 24);
    // Finial spear points
    ctx.fillRect(rx - 1, 19, 4, 3);
  }
  ctx.fillRect(34, 25, 254, 2); // Horizontal rail top
  ctx.fillRect(34, 40, 254, 2); // Horizontal rail bottom

  // Heavy stone masonry wall base (y: 45 to 75)
  ctx.fillStyle = '#19201d';
  ctx.fillRect(0, 45, VIRTUAL_WIDTH, 30);

  // Stone block grid & mortar grooves
  ctx.fillStyle = '#0f1412';
  ctx.fillRect(0, 45, VIRTUAL_WIDTH, 2); // Top wall cap
  ctx.fillRect(0, 74, VIRTUAL_WIDTH, 2); // Bottom mortar line
  for (let sy = 47; sy < 74; sy += 9) {
    ctx.fillRect(0, sy, VIRTUAL_WIDTH, 1);
    const offset = (sy % 18 === 0) ? 0 : 16;
    for (let sx = offset; sx < VIRTUAL_WIDTH; sx += 32) {
      ctx.fillRect(sx, sy, 1, 9);
    }
  }

  // Left rear hostel building brick wall (x: 0 to 34, y: 0 to VIRTUAL_HEIGHT)
  ctx.fillStyle = '#1c1514';
  ctx.fillRect(0, 0, 34, VIRTUAL_HEIGHT);
  // Reddish-grey weathered brick lines
  ctx.fillStyle = '#140e0d';
  for (let by = 0; by < VIRTUAL_HEIGHT; by += 8) {
    ctx.fillRect(0, by, 34, 1);
  }
  // Hostel Fire Exit Door on left wall (x: 20 to 34, y: 110 to 156)
  ctx.fillStyle = '#0b0e11';
  ctx.fillRect(18, 110, 16, 46);
  ctx.fillStyle = '#222830';
  ctx.fillRect(20, 112, 14, 42); // Steel door panel
  ctx.fillStyle = '#3a4450';
  ctx.fillRect(28, 114, 2, 38); // Door vertical rebate
  // Emergency crash push bar
  ctx.fillStyle = '#8b2520';
  ctx.fillRect(24, 130, 8, 4);
  ctx.fillStyle = '#d4aa50';
  ctx.fillRect(23, 131, 2, 2); // Brass bracket

  // Right crumbling stone perimeter wall (x: 288 to 320, y: 0 to VIRTUAL_HEIGHT)
  ctx.fillStyle = '#161d19';
  ctx.fillRect(288, 0, 32, VIRTUAL_HEIGHT);
  ctx.fillStyle = '#0e1310';
  for (let rsy = 0; rsy < VIRTUAL_HEIGHT; rsy += 10) {
    ctx.fillRect(288, rsy, 32, 1);
    const roffset = (rsy % 20 === 0) ? 296 : 308;
    ctx.fillRect(roffset, rsy, 1, 10);
  }

  // Creeping dead ivy along right and top wall
  ctx.fillStyle = '#111a14';
  ctx.fillRect(284, 52, 6, 28);
  ctx.fillRect(280, 60, 4, 16);
  ctx.fillRect(276, 68, 6, 10);

  // Bottom dense muddy overgrowth and brambles (y: 195 to 240)
  ctx.fillStyle = '#090d0b';
  ctx.fillRect(0, 195, VIRTUAL_WIDTH, 45);
  // Thorny bramble silhouettes
  ctx.fillStyle = '#131b15';
  for (let bx = 0; bx < VIRTUAL_WIDTH; bx += 6) {
    const spikeH = 4 + ((bx * 7) % 10);
    ctx.fillRect(bx, 195 - spikeH, 3, spikeH + 4);
  }

  // Dead gnarled oak tree (rect: { x: 82, y: 66, width: 26, height: 28 })
  const tx = 82;
  const ty = 66;

  // Tree base drop shadow
  ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
  ctx.beginPath();
  ctx.ellipse(tx + 13, ty + 26, 16, 5, 0, 0, Math.PI * 2);
  ctx.fill();

  // Twisted dark trunk
  ctx.fillStyle = '#18130e';
  ctx.fillRect(tx + 9, ty + 10, 8, 16); // Trunk center
  ctx.fillRect(tx + 6, ty + 18, 5, 8);  // Left root flare
  ctx.fillRect(tx + 15, ty + 19, 6, 7); // Right root flare

  // Bark texture & highlights
  ctx.fillStyle = '#261e16';
  ctx.fillRect(tx + 10, ty + 12, 3, 12);
  ctx.fillStyle = '#0f0c09';
  ctx.fillRect(tx + 13, ty + 14, 2, 10);

  // Twisted bare dead branches reaching into upper courtyard
  ctx.strokeStyle = '#1a140f';
  ctx.lineWidth = 3;
  ctx.beginPath();
  // Main left branch
  ctx.moveTo(tx + 11, ty + 10);
  ctx.lineTo(tx + 4, ty + 2);
  ctx.lineTo(tx - 4, ty - 6);
  // Main right branch
  ctx.moveTo(tx + 15, ty + 10);
  ctx.lineTo(tx + 22, ty + 3);
  ctx.lineTo(tx + 29, ty - 5);
  // Center high branch
  ctx.moveTo(tx + 13, ty + 10);
  ctx.lineTo(tx + 14, ty - 8);
  ctx.stroke();

  // Thinner splinter twigs
  ctx.strokeStyle = '#120e0a';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(tx + 4, ty + 2);
  ctx.lineTo(tx + 1, ty - 4);
  ctx.moveTo(tx + 22, ty + 3);
  ctx.lineTo(tx + 25, ty - 1);
  ctx.moveTo(tx + 14, ty - 2);
  ctx.lineTo(tx + 18, ty - 10);
  ctx.stroke();
}

function drawBackyardWell(ctx: CanvasRenderingContext2D, room: RoomDefinition): void {
  // Ancient Stone Well: collision at { x: 188, y: 104, width: 46, height: 32 }
  const wx = 188;
  const wy = 104;

  // Deep ground contact shadow
  ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
  ctx.beginPath();
  ctx.ellipse(wx + 23, wy + 26, 28, 8, 0, 0, Math.PI * 2);
  ctx.fill();

  // Outer stone masonry cylinder wall
  ctx.fillStyle = '#1e2622';
  ctx.fillRect(wx + 2, wy + 8, 42, 20);

  // Stone block textures on cylindrical rim
  ctx.fillStyle = '#2b3631';
  ctx.fillRect(wx + 4, wy + 9, 10, 5);
  ctx.fillRect(wx + 18, wy + 9, 11, 5);
  ctx.fillRect(wx + 32, wy + 9, 10, 5);

  ctx.fillStyle = '#18201c';
  ctx.fillRect(wx + 10, wy + 16, 12, 5);
  ctx.fillRect(wx + 26, wy + 16, 12, 5);

  // Damp dark moss patches on stones
  ctx.fillStyle = '#1b2a1e';
  ctx.fillRect(wx + 3, wy + 18, 6, 8);
  ctx.fillRect(wx + 37, wy + 12, 5, 12);
  ctx.fillRect(wx + 20, wy + 22, 8, 4);

  // Rim top stone collar
  ctx.fillStyle = '#2d3832';
  ctx.beginPath();
  ctx.ellipse(wx + 23, wy + 9, 21, 7, 0, 0, Math.PI * 2);
  ctx.fill();

  // Pitch-black well shaft opening inside
  ctx.fillStyle = '#030506';
  ctx.beginPath();
  ctx.ellipse(wx + 23, wy + 9, 16, 5, 0, 0, Math.PI * 2);
  ctx.fill();

  // Black water reflection deep within
  ctx.fillStyle = 'rgba(100, 160, 190, 0.15)';
  ctx.fillRect(wx + 18, wy + 8, 10, 1);

  // Weathered wooden vertical gallows posts
  ctx.fillStyle = '#241a12';
  ctx.fillRect(wx + 3, wy - 14, 4, 24); // Left post
  ctx.fillRect(wx + 39, wy - 14, 4, 24); // Right post

  // Decayed rotting crossbeam
  ctx.fillStyle = '#2e2117';
  ctx.fillRect(wx + 1, wy - 14, 44, 4);

  // Iron axle and collapsed rotting spool
  ctx.fillStyle = '#1a130d';
  ctx.fillRect(wx + 18, wy - 12, 10, 5);

  // Severed frayed hemp rope dangling down into the abyss
  ctx.strokeStyle = '#61533c';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(wx + 23, wy - 8);
  ctx.lineTo(wx + 23, wy + 7);
  ctx.stroke();

  // Wet rain glint on crossbeam top
  ctx.fillStyle = 'rgba(180, 210, 230, 0.25)';
  ctx.fillRect(wx + 2, wy - 14, 42, 1);
}

function drawRainOverlay(ctx: CanvasRenderingContext2D): void {
  // Rain streaks falling diagonally
  ctx.strokeStyle = 'rgba(165, 195, 220, 0.22)';
  ctx.lineWidth = 1;

  ctx.beginPath();
  // Fixed pseudo-random rain distribution across screen
  const rainDrops = [
    [24, 30], [54, 80], [86, 40], [120, 110], [150, 65], [178, 140],
    [208, 50], [236, 120], [264, 75], [294, 150], [42, 160], [78, 190],
    [104, 145], [138, 185], [168, 205], [220, 195], [252, 175], [280, 210],
    [32, 95], [68, 130], [112, 70], [146, 125], [192, 90], [228, 155],
    [272, 105], [306, 85], [14, 180], [92, 215], [160, 160], [244, 225]
  ];

  rainDrops.forEach(([rx, ry]) => {
    ctx.moveTo(rx, ry);
    ctx.lineTo(rx - 3, ry + 11);
  });
  ctx.stroke();
}

function drawBackyardLighting(ctx: CanvasRenderingContext2D, player: PlayerState): void {
  // Cold, stormy moonlight ambient filter
  const ambient = ctx.createRadialGradient(160, 60, 20, 160, 120, 140);
  ambient.addColorStop(0, 'rgba(80, 115, 140, 0.12)');
  ambient.addColorStop(0.6, 'rgba(30, 45, 60, 0.08)');
  ambient.addColorStop(1, 'rgba(0, 0, 0, 0)');
  ctx.fillStyle = ambient;
  ctx.fillRect(0, 0, VIRTUAL_WIDTH, VIRTUAL_HEIGHT);

  // Player personal flashlight beam / circle in the rain
  const px = player.position.x + 8;
  const py = player.position.y + 12;

  const playerGlow = ctx.createRadialGradient(px, py, 6, px, py, 64);
  playerGlow.addColorStop(0, 'rgba(215, 235, 250, 0.28)');
  playerGlow.addColorStop(0.5, 'rgba(110, 155, 185, 0.09)');
  playerGlow.addColorStop(1, 'rgba(0, 0, 0, 0)');
  ctx.fillStyle = playerGlow;
  ctx.fillRect(0, 0, VIRTUAL_WIDTH, VIRTUAL_HEIGHT);

  // Cold murky night vignette around outer perimeter
  const vignette = ctx.createRadialGradient(
    VIRTUAL_WIDTH / 2,
    VIRTUAL_HEIGHT / 2,
    55,
    VIRTUAL_WIDTH / 2,
    VIRTUAL_HEIGHT / 2,
    148
  );
  vignette.addColorStop(0, 'rgba(0, 0, 0, 0)');
  vignette.addColorStop(0.65, 'rgba(5, 9, 12, 0.65)');
  vignette.addColorStop(1, 'rgba(2, 4, 6, 0.95)');
  ctx.fillStyle = vignette;
  ctx.fillRect(0, 0, VIRTUAL_WIDTH, VIRTUAL_HEIGHT);
}


