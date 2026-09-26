/**
 * Inspection Close-Up Pixel Art Renderer
 * Renders dedicated close-up pixel-art views of inspected objects on a 96x96 canvas.
 * Preserves authentic 2D pixel-art aesthetics with zero external assets.
 */

export const INSPECTION_CANVAS_SIZE = 96;

export function renderInspectionVisual(
  ctx: CanvasRenderingContext2D,
  visualType: string,
  objectId?: string,
  inspectTitle?: string
): void {
  ctx.imageSmoothingEnabled = false;

  // Clear background
  ctx.fillStyle = '#0c0a08';
  ctx.fillRect(0, 0, INSPECTION_CANVAS_SIZE, INSPECTION_CANVAS_SIZE);

  switch (visualType) {
    case 'bed':
      renderBedCloseUp(ctx);
      break;
    case 'nightstand':
      renderNightstandCloseUp(ctx);
      break;
    case 'desk':
      renderDeskCloseUp(ctx);
      break;
    case 'wardrobe':
      renderWardrobeCloseUp(ctx);
      break;
    case 'window':
      renderWindowCloseUp(ctx, false);
      break;
    case 'window_transformed':
      renderWindowCloseUp(ctx, true);
      break;
    case 'door':
      renderDoorCloseUp(ctx, objectId, inspectTitle);
      break;
    case 'notice':
      renderNoticeCloseUp(ctx);
      break;
    case 'diary':
      renderDiaryCloseUp(ctx);
      break;
    case 'seam':
      renderSeamCloseUp(ctx);
      break;
    case 'cavity':
      renderCavityCloseUp(ctx);
      break;
    case 'phone':
      renderPhoneCloseUp(ctx);
      break;
    case 'key':
      renderKeyCloseUp(ctx);
      break;
    case 'box':
      renderBoxCloseUp(ctx, Boolean(inspectTitle?.includes('Open') || objectId === 'box_opened'));
      break;
    case 'parcel_contents':
      renderParcelContentsCloseUp(ctx);
      break;
    case 'key217_note':
      renderKey217NoteCloseUp(ctx);
      break;
    case 'well':
      renderWellCloseUp(ctx);
      break;
    default:
      renderGenericCloseUp(ctx);
      break;
  }
}

/**
 * 1. Close-up of the rumpled bed with frayed sheet & pillow.
 */
function renderBedCloseUp(ctx: CanvasRenderingContext2D): void {
  // Dark bedroom wall behind headboard
  ctx.fillStyle = '#141a18';
  ctx.fillRect(0, 0, 96, 28);

  // Wooden headboard top trim
  ctx.fillStyle = '#342216';
  ctx.fillRect(6, 12, 84, 8);
  ctx.fillStyle = '#4c3322';
  ctx.fillRect(8, 14, 80, 4);

  // Headboard vertical slats
  ctx.fillStyle = '#26180f';
  ctx.fillRect(6, 20, 84, 16);
  for (let x = 12; x < 84; x += 10) {
    ctx.fillStyle = '#382417';
    ctx.fillRect(x, 20, 7, 16);
    ctx.fillStyle = '#180f09';
    ctx.fillRect(x + 7, 20, 1, 16);
  }

  // Mattress base shadow
  ctx.fillStyle = '#120b07';
  ctx.fillRect(4, 34, 88, 6);

  // The Pillow (slightly indented, cold shadow)
  ctx.fillStyle = '#968c7e';
  ctx.fillRect(14, 30, 68, 22);
  ctx.fillStyle = '#c8bfb0';
  ctx.fillRect(16, 32, 64, 18);

  // Pillow center depression / indentation where a head would rest
  ctx.fillStyle = '#aba191';
  ctx.fillRect(32, 36, 32, 10);
  ctx.fillStyle = '#8f8475';
  ctx.fillRect(36, 38, 24, 6);

  // Pillow fabric crease lines
  ctx.fillStyle = '#7a7062';
  ctx.fillRect(22, 42, 14, 1);
  ctx.fillRect(60, 41, 16, 1);
  ctx.fillRect(56, 45, 12, 1);

  // Turned-down white linen sheet (showing cold frayed edge)
  ctx.fillStyle = '#dcd3c4';
  ctx.fillRect(10, 48, 76, 12);
  ctx.fillStyle = '#b5ac9d';
  ctx.fillRect(10, 58, 76, 2);

  // Frayed thread tear on left side
  ctx.fillStyle = '#7e7568';
  ctx.fillRect(18, 50, 8, 2);
  ctx.fillStyle = '#524a3e';
  ctx.fillRect(20, 52, 5, 2);
  ctx.fillStyle = '#dcd3c4';
  ctx.fillRect(19, 54, 1, 3);
  ctx.fillRect(23, 54, 1, 2);

  // Heavy wool hostel blanket (dark navy/grey with weave pattern)
  ctx.fillStyle = '#222c32';
  ctx.fillRect(8, 60, 80, 36);

  // Blanket horizontal weave ribs
  ctx.fillStyle = '#1c2429';
  for (let y = 64; y < 96; y += 4) {
    ctx.fillRect(8, y, 80, 1);
  }

  // Blanket folds and deep shadows
  ctx.fillStyle = '#151b1f';
  ctx.fillRect(24, 68, 48, 3);
  ctx.fillRect(16, 80, 64, 4);

  // Atmospheric cold ambient shadow
  const grad = ctx.createLinearGradient(0, 0, 0, 96);
  grad.addColorStop(0, 'rgba(0, 0, 0, 0.25)');
  grad.addColorStop(1, 'rgba(0, 0, 0, 0.45)');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 96, 96);
}

/**
 * 2. Close-up of the nightstand with lamp and scratched tally marks.
 */
function renderNightstandCloseUp(ctx: CanvasRenderingContext2D): void {
  // Dark wall backdrop
  ctx.fillStyle = '#181b19';
  ctx.fillRect(0, 0, 96, 36);

  // Nightstand beveled top surface
  ctx.fillStyle = '#422a1b';
  ctx.fillRect(8, 36, 80, 26);
  ctx.fillStyle = '#593925';
  ctx.fillRect(10, 37, 76, 4); // Highlight edge

  // Wood grain variations
  ctx.fillStyle = '#362215';
  ctx.fillRect(14, 44, 68, 1);
  ctx.fillRect(18, 52, 60, 1);

  // Drawer seam & face
  ctx.fillStyle = '#19100a';
  ctx.fillRect(10, 62, 76, 2);
  ctx.fillStyle = '#2e1c12';
  ctx.fillRect(12, 64, 72, 30);

  // Brass drawer handle
  ctx.fillStyle = '#150d08';
  ctx.fillRect(40, 76, 16, 8);
  ctx.fillStyle = '#d4aa50';
  ctx.fillRect(42, 77, 12, 5);
  ctx.fillStyle = '#8a6e35';
  ctx.fillRect(44, 82, 8, 3);

  // Bedside Lamp (on left)
  // Brass Base
  ctx.fillStyle = '#9e7e38';
  ctx.fillRect(18, 42, 16, 5);
  ctx.fillStyle = '#d4aa50';
  ctx.fillRect(20, 40, 12, 2);

  // Lamp Stem
  ctx.fillStyle = '#8a6e35';
  ctx.fillRect(25, 20, 2, 20);
  ctx.fillRect(25, 18, 6, 2); // Gooseneck bend

  // Lamp Shade (flared vintage cone)
  ctx.fillStyle = '#cfbe8c';
  ctx.fillRect(28, 14, 12, 10);
  ctx.fillStyle = '#fff4bd';
  ctx.fillRect(30, 20, 8, 4);

  // Warm Amber Glow from Lamp
  const glow = ctx.createRadialGradient(34, 22, 2, 34, 22, 44);
  glow.addColorStop(0, 'rgba(255, 215, 120, 0.45)');
  glow.addColorStop(0.5, 'rgba(230, 160, 60, 0.18)');
  glow.addColorStop(1, 'rgba(0, 0, 0, 0)');
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, 96, 96);

  // The 4 carved scratches: IIII (right side of tabletop)
  // Highlight edge + carved groove
  const scratchX = 60;
  const scratchY = 44;
  for (let i = 0; i < 4; i++) {
    const sx = scratchX + i * 5;
    // Dark groove
    ctx.fillStyle = '#100a06';
    ctx.fillRect(sx, scratchY, 1, 12);
    // Rough pale scratch wood fiber highlight
    ctx.fillStyle = '#826042';
    ctx.fillRect(sx + 1, scratchY + 1, 1, 10);
  }
}

/**
 * 3. Close-up of the writing desk with notebook, glasses, and coffee mug.
 */
function renderDeskCloseUp(ctx: CanvasRenderingContext2D): void {
  // Wood desk surface filling entire view
  ctx.fillStyle = '#342114';
  ctx.fillRect(0, 0, 96, 96);

  // Longitudinal wood planks
  ctx.fillStyle = '#22150d';
  ctx.fillRect(0, 32, 96, 1);
  ctx.fillRect(0, 64, 96, 1);

  ctx.fillStyle = 'rgba(255, 255, 255, 0.03)';
  ctx.fillRect(0, 1, 96, 30);
  ctx.fillRect(0, 34, 96, 29);

  // Stack of receipts / yellowed loose notes on left
  ctx.fillStyle = '#aba293';
  ctx.fillRect(8, 14, 30, 36);
  ctx.fillStyle = '#d6cebf';
  ctx.fillRect(10, 16, 28, 32);
  ctx.fillStyle = '#ece5d8';
  ctx.fillRect(12, 18, 24, 28);

  // Text scribbles on receipts
  ctx.fillStyle = '#645d52';
  for (let y = 22; y < 44; y += 4) {
    ctx.fillRect(14, y, 18, 1);
  }

  // Coffee mug (top right)
  // Mug shadow
  ctx.fillStyle = '#140c07';
  ctx.beginPath();
  ctx.ellipse(74, 28, 12, 6, 0, 0, Math.PI * 2);
  ctx.fill();

  // Ceramic mug rim
  ctx.fillStyle = '#e4dfd3';
  ctx.fillRect(64, 14, 18, 18);
  ctx.fillStyle = '#3b2516';
  ctx.fillRect(66, 16, 14, 8); // Inside mug
  ctx.fillStyle = '#1a0e07';
  ctx.fillRect(67, 18, 12, 5); // Dried coffee grounds residue ring

  // Mug handle
  ctx.fillStyle = '#cfc9bd';
  ctx.fillRect(82, 17, 4, 12);
  ctx.fillStyle = '#342114';
  ctx.fillRect(83, 19, 2, 8);

  // The Friend's Pocket Notebook (center bottom)
  // Notebook leather cover
  ctx.fillStyle = '#1e2428';
  ctx.fillRect(20, 48, 56, 42);

  // Open Paper Pages (aged cream paper)
  ctx.fillStyle = '#e2dcce';
  ctx.fillRect(23, 50, 50, 38);

  // Center binding seam
  ctx.fillStyle = '#787063';
  ctx.fillRect(47, 50, 2, 38);

  // Page ruled lines & rushed handwriting scrawls
  ctx.fillStyle = '#544c42';
  // Left page
  ctx.fillRect(26, 54, 18, 1);
  ctx.fillRect(26, 58, 19, 1);
  ctx.fillRect(26, 62, 16, 1);
  ctx.fillRect(26, 66, 18, 1);
  ctx.fillRect(26, 70, 14, 1);
  ctx.fillRect(26, 74, 17, 1);

  // Right page with abruptly truncated notes
  ctx.fillRect(51, 54, 19, 1);
  ctx.fillRect(51, 58, 18, 1);
  ctx.fillRect(51, 62, 20, 1);
  ctx.fillRect(51, 66, 11, 1); // Breaks off here!

  // Wire-rim reading glasses resting beside notebook
  ctx.fillStyle = '#bfa568';
  ctx.strokeRect(16, 74, 8, 6);
  ctx.strokeRect(26, 74, 8, 6);
  ctx.fillRect(24, 76, 2, 1); // Bridge
}

/**
 * 4. Close-up of the wardrobe with dark oak panels, keyhole & hanging coat.
 */
function renderWardrobeCloseUp(ctx: CanvasRenderingContext2D): void {
  // Wardrobe rich dark oak wood panels
  ctx.fillStyle = '#26180f';
  ctx.fillRect(0, 0, 96, 96);

  // Left door panel molding
  ctx.fillStyle = '#3a2517';
  ctx.fillRect(8, 8, 38, 80);
  ctx.fillStyle = '#1c110a';
  ctx.fillRect(12, 12, 30, 72);

  // Right door panel molding
  ctx.fillStyle = '#3a2517';
  ctx.fillRect(50, 8, 38, 80);
  ctx.fillStyle = '#1c110a';
  ctx.fillRect(54, 12, 30, 72);

  // The vertical gap between the two doors
  ctx.fillStyle = '#0a0604';
  ctx.fillRect(46, 0, 4, 96);

  // Inside the gap: shadow and friend's dark tweed coat fabric
  ctx.fillStyle = '#14181a';
  ctx.fillRect(47, 16, 2, 64);
  ctx.fillStyle = '#2d383d';
  ctx.fillRect(47, 24, 2, 18); // Fold of wool fabric

  // Antique brass escutcheon keyhole plate on right door
  ctx.fillStyle = '#9e7e38';
  ctx.fillRect(52, 42, 6, 14);
  ctx.fillStyle = '#d4aa50';
  ctx.fillRect(53, 44, 4, 10);

  // Keyhole opening
  ctx.fillStyle = '#120c06';
  ctx.beginPath();
  ctx.arc(55, 47, 1.5, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillRect(54.5, 48, 1, 3);

  // Heavy brass door pull handle
  ctx.fillStyle = '#7a5e26';
  ctx.fillRect(49, 44, 2, 10);
  ctx.fillRect(48, 46, 2, 6);

  // Weathered scratches on wood varnish
  ctx.fillStyle = '#4c3220';
  ctx.fillRect(20, 28, 12, 1);
  ctx.fillRect(66, 62, 14, 1);
}

/**
 * 5. Close-up of the courtyard window.
 * State 1 (isTransformed = false): Normal winding path, rain on glass, healthy shrubs and tree, warm lamp glow.
 * State 2 (isTransformed = true): Fogged/frosted glass overlay, dead trees, withered flowers, cold dead path.
 */
function renderWindowCloseUp(ctx: CanvasRenderingContext2D, isTransformed: boolean = false): void {
  // Heavy wooden frame border
  ctx.fillStyle = '#22160e';
  ctx.fillRect(0, 0, 96, 96);

  // Glass pane area
  const paneX = 8;
  const paneY = 8;
  const paneW = 80;
  const paneH = 80;

  if (!isTransformed) {
    // =========================================================================
    // STATE 1 — NORMAL PATH + RAIN (BEFORE FIRST BLACKOUT)
    // =========================================================================

    // 1. Rainy evening / overcast sky gradient
    const skyGrad = ctx.createLinearGradient(paneX, paneY, paneX, paneY + 36);
    skyGrad.addColorStop(0, '#121e2b');
    skyGrad.addColorStop(1, '#1b2d3d');
    ctx.fillStyle = skyGrad;
    ctx.fillRect(paneX, paneY, paneW, 36);

    // 2. Distant courtyard perimeter stone wall & iron gate
    ctx.fillStyle = '#2d3339';
    ctx.fillRect(paneX, paneY + 32, paneW, 8);
    // Iron fence vertical rail spears
    ctx.fillStyle = '#181b1e';
    for (let fx = paneX + 2; fx < paneX + paneW; fx += 5) {
      ctx.fillRect(fx, paneY + 28, 1, 5);
      ctx.fillRect(fx - 1, paneY + 28, 3, 1);
    }
    // Iron courtyard gate at path terminus (center)
    ctx.fillStyle = '#14181a';
    ctx.fillRect(paneX + 34, paneY + 25, 12, 15);
    ctx.fillStyle = '#22292d';
    ctx.fillRect(paneX + 35, paneY + 26, 10, 1);

    // 3. Normal wet courtyard ground / dark green grass lawn
    const lawnGrad = ctx.createLinearGradient(paneX, paneY + 36, paneX, paneY + paneH);
    lawnGrad.addColorStop(0, '#1c2e1b');
    lawnGrad.addColorStop(1, '#273e26');
    ctx.fillStyle = lawnGrad;
    ctx.fillRect(paneX, paneY + 36, paneW, paneH - 36);

    // 4. The Path: A normal, unremarkable gravel / cobblestone path
    // Winding from bottom center curving gently left then toward the gate
    ctx.fillStyle = '#4c443b';
    ctx.beginPath();
    ctx.moveTo(paneX + 30, paneY + paneH); // Bottom left of path
    ctx.lineTo(paneX + 54, paneY + paneH); // Bottom right of path
    ctx.lineTo(paneX + 48, paneY + 60);
    ctx.lineTo(paneX + 44, paneY + 36);    // Gate terminus right
    ctx.lineTo(paneX + 36, paneY + 36);    // Gate terminus left
    ctx.lineTo(paneX + 34, paneY + 54);
    ctx.closePath();
    ctx.fill();

    // Cobblestone paving details on normal path
    ctx.fillStyle = '#63594d';
    // Cobblestone stones
    const stones = [
      { x: 38, y: 76, w: 4, h: 2 },
      { x: 44, y: 75, w: 5, h: 2 },
      { x: 35, y: 68, w: 4, h: 2 },
      { x: 41, y: 67, w: 4, h: 2 },
      { x: 38, y: 58, w: 3, h: 2 },
      { x: 43, y: 57, w: 3, h: 2 },
      { x: 37, y: 48, w: 3, h: 1 },
      { x: 41, y: 47, w: 3, h: 1 },
      { x: 38, y: 40, w: 3, h: 1 },
    ];
    stones.forEach((st) => {
      ctx.fillRect(paneX + st.x, paneY + st.y, st.w, st.h);
    });

    // 5. Living Vegetation (Normal green shrubs & healthy tree)
    // Left border shrubbery
    ctx.fillStyle = '#254523';
    ctx.beginPath();
    ctx.arc(paneX + 16, paneY + 62, 12, 0, Math.PI * 2);
    ctx.arc(paneX + 26, paneY + 70, 8, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#345e31';
    ctx.fillRect(paneX + 14, paneY + 56, 3, 2);
    ctx.fillRect(paneX + 22, paneY + 64, 3, 2);

    // Normal courtyard tree on right
    ctx.fillStyle = '#362417'; // Healthy wood trunk
    ctx.fillRect(paneX + 66, paneY + 44, 4, 36);
    // Tree leafy canopy
    ctx.fillStyle = '#1e3c1d';
    ctx.beginPath();
    ctx.arc(paneX + 68, paneY + 34, 15, 0, Math.PI * 2);
    ctx.arc(paneX + 58, paneY + 38, 9, 0, Math.PI * 2);
    ctx.arc(paneX + 74, paneY + 32, 10, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#2c532b'; // Leaf highlights
    ctx.fillRect(paneX + 64, paneY + 28, 4, 3);
    ctx.fillRect(paneX + 72, paneY + 34, 3, 3);
    ctx.fillRect(paneX + 57, paneY + 36, 3, 2);

    // Small healthy courtyard flowers along right path verge
    ctx.fillStyle = '#d4aa50'; // Amber blossoms
    ctx.fillRect(paneX + 50, paneY + 68, 2, 2);
    ctx.fillRect(paneX + 54, paneY + 62, 2, 2);
    ctx.fillStyle = '#e2dac6'; // White blossoms
    ctx.fillRect(paneX + 48, paneY + 54, 2, 2);
    ctx.fillRect(paneX + 45, paneY + 44, 1, 1);

    // 6. Courtyard Streetlight with warm amber glow
    // Cast iron lamp post
    ctx.fillStyle = '#1c2024';
    ctx.fillRect(paneX + 28, paneY + 48, 2, 24); // Post
    ctx.fillRect(paneX + 26, paneY + 46, 6, 2);  // Lantern bracket
    ctx.fillRect(paneX + 27, paneY + 42, 4, 4);  // Lantern housing
    // Warm amber glow from lamp
    ctx.fillStyle = '#e5b84c';
    ctx.fillRect(paneX + 28, paneY + 43, 2, 2);
    // Soft halo
    const lampGlow = ctx.createRadialGradient(
      paneX + 29,
      paneY + 44,
      1,
      paneX + 29,
      paneY + 44,
      16
    );
    lampGlow.addColorStop(0, 'rgba(235, 190, 80, 0.35)');
    lampGlow.addColorStop(1, 'rgba(235, 190, 80, 0)');
    ctx.fillStyle = lampGlow;
    ctx.beginPath();
    ctx.arc(paneX + 29, paneY + 44, 16, 0, Math.PI * 2);
    ctx.fill();

    // 7. Clear glass with clean rain streaks & droplets
    ctx.fillStyle = 'rgba(170, 210, 240, 0.45)';
    // Rain streaks falling diagonally
    const rainLines = [
      [10, 12, 1, 16],
      [18, 6, 1, 22],
      [28, 14, 1, 18],
      [14, 44, 1, 26],
      [24, 52, 1, 20],
      [48, 10, 1, 18],
      [56, 16, 1, 24],
      [68, 8, 1, 20],
      [54, 46, 1, 28],
      [66, 56, 1, 22],
      [74, 48, 1, 24],
    ];
    rainLines.forEach(([rx, ry, rw, rh]) => {
      ctx.fillRect(paneX + rx, paneY + ry, rw, rh);
    });

    // Droplets on glass
    ctx.fillStyle = 'rgba(200, 230, 255, 0.7)';
    const drops = [
      [11, 29],
      [19, 29],
      [29, 33],
      [15, 71],
      [49, 29],
      [57, 41],
      [69, 29],
      [55, 75],
    ];
    drops.forEach(([dx, dy]) => {
      ctx.fillRect(paneX + dx, paneY + dy, 2, 2);
    });
  } else {
    // =========================================================================
    // STATE 2 — FOGGED GLASS + DEAD PATH & TREES (AFTER FIRST BLACKOUT)
    // =========================================================================

    // 1. Chilling, dead monochrome slate/black night sky gradient
    const deadSky = ctx.createLinearGradient(paneX, paneY, paneX, paneY + 36);
    deadSky.addColorStop(0, '#0a0d11');
    deadSky.addColorStop(1, '#11161b');
    ctx.fillStyle = deadSky;
    ctx.fillRect(paneX, paneY, paneW, 36);

    // 2. Crumbling, desolate courtyard perimeter wall & warped iron fence
    ctx.fillStyle = '#1c1f22';
    ctx.fillRect(paneX, paneY + 32, paneW, 8);
    // Warped, broken fence spears
    ctx.fillStyle = '#0f1113';
    for (let fx = paneX + 2; fx < paneX + paneW; fx += 5) {
      const slant = (fx % 3 === 0) ? -1 : 0;
      ctx.fillRect(fx + slant, paneY + 28, 1, 5);
    }
    // Heavy rusted gate sagging on rusted hinges
    ctx.fillStyle = '#0c0e10';
    ctx.fillRect(paneX + 34, paneY + 26, 12, 14);

    // 3. Barren, blackened earth & decayed rotting soil (zero green)
    const deadGround = ctx.createLinearGradient(paneX, paneY + 36, paneX, paneY + paneH);
    deadGround.addColorStop(0, '#13100e');
    deadGround.addColorStop(1, '#1a1613');
    ctx.fillStyle = deadGround;
    ctx.fillRect(paneX, paneY + 36, paneW, paneH - 36);

    // 4. Dead, cracked path choked with black roots
    ctx.fillStyle = '#2c2925';
    ctx.beginPath();
    ctx.moveTo(paneX + 30, paneY + paneH);
    ctx.lineTo(paneX + 54, paneY + paneH);
    ctx.lineTo(paneX + 48, paneY + 60);
    ctx.lineTo(paneX + 44, paneY + 36);
    ctx.lineTo(paneX + 36, paneY + 36);
    ctx.lineTo(paneX + 34, paneY + 54);
    ctx.closePath();
    ctx.fill();

    // Ash-grey cracked stone pavers
    ctx.fillStyle = '#3a3631';
    [
      { x: 38, y: 76, w: 4, h: 2 },
      { x: 44, y: 75, w: 5, h: 2 },
      { x: 35, y: 68, w: 4, h: 2 },
      { x: 41, y: 67, w: 4, h: 2 },
      { x: 38, y: 58, w: 3, h: 2 },
      { x: 43, y: 57, w: 3, h: 2 },
      { x: 38, y: 40, w: 3, h: 1 },
    ].forEach((st) => {
      ctx.fillRect(paneX + st.x, paneY + st.y, st.w, st.h);
    });

    // Deep black fractures & tangled roots crossing the path
    ctx.fillStyle = '#0d0b09';
    ctx.fillRect(paneX + 36, paneY + 70, 10, 1);
    ctx.fillRect(paneX + 40, paneY + 59, 8, 1);
    ctx.fillRect(paneX + 37, paneY + 48, 6, 1);

    // 5. DEAD TREES & WITHERED VEGETATION
    // Right courtyard tree: Twisted, dead, skeletal bare branches reaching upward
    ctx.fillStyle = '#140f0c'; // Dead blackened trunk
    ctx.fillRect(paneX + 66, paneY + 44, 4, 36);
    // Skeletal bare branches (no leaves whatsoever)
    ctx.beginPath();
    ctx.strokeStyle = '#120d09';
    ctx.lineWidth = 1.5;
    // Main branch left
    ctx.moveTo(paneX + 67, paneY + 50);
    ctx.lineTo(paneX + 56, paneY + 36);
    ctx.lineTo(paneX + 52, paneY + 32);
    // Fork off left branch
    ctx.moveTo(paneX + 58, paneY + 40);
    ctx.lineTo(paneX + 56, paneY + 28);
    // Main branch right
    ctx.moveTo(paneX + 69, paneY + 46);
    ctx.lineTo(paneX + 76, paneY + 32);
    ctx.lineTo(paneX + 80, paneY + 26);
    // Center top claw
    ctx.moveTo(paneX + 68, paneY + 44);
    ctx.lineTo(paneX + 67, paneY + 24);
    ctx.lineTo(paneX + 63, paneY + 18);
    ctx.stroke();

    // Withered, drooping dead flower stems along the path verge
    ctx.strokeStyle = '#1f1313';
    ctx.lineWidth = 1;
    // Limp drooping stalks
    ctx.beginPath();
    ctx.moveTo(paneX + 50, paneY + 72);
    ctx.lineTo(paneX + 52, paneY + 68);
    ctx.lineTo(paneX + 50, paneY + 66);

    ctx.moveTo(paneX + 54, paneY + 64);
    ctx.lineTo(paneX + 56, paneY + 60);
    ctx.lineTo(paneX + 54, paneY + 58);

    ctx.moveTo(paneX + 48, paneY + 56);
    ctx.lineTo(paneX + 50, paneY + 52);
    ctx.stroke();

    // Blackened, shriveled dead flower heads
    ctx.fillStyle = '#261212';
    ctx.fillRect(paneX + 49, paneY + 66, 2, 2);
    ctx.fillRect(paneX + 53, paneY + 58, 2, 2);
    ctx.fillRect(paneX + 49, paneY + 52, 2, 1);

    // Left border dead briar brambles
    ctx.fillStyle = '#16110d';
    ctx.fillRect(paneX + 12, paneY + 62, 14, 8);
    ctx.fillRect(paneX + 22, paneY + 68, 8, 6);

    // 6. Extinguished, dead cast-iron streetlight (crooked, cold, dark)
    ctx.fillStyle = '#0f1113';
    ctx.fillRect(paneX + 28, paneY + 50, 2, 22);
    // Bent head
    ctx.fillRect(paneX + 25, paneY + 48, 6, 2);
    ctx.fillRect(paneX + 26, paneY + 44, 4, 4);
    ctx.fillStyle = '#070809'; // Dead, hollow dark lantern
    ctx.fillRect(paneX + 27, paneY + 45, 2, 2);

    // 7. FROSTED / FOGGED GLASS TRANSLUCENT OVERLAY
    // Greasy condensation fog across the glass
    const frostOverlay = ctx.createLinearGradient(paneX, paneY, paneX + paneW, paneY + paneH);
    frostOverlay.addColorStop(0, 'rgba(175, 195, 210, 0.42)');
    frostOverlay.addColorStop(0.5, 'rgba(160, 180, 195, 0.36)');
    frostOverlay.addColorStop(1, 'rgba(185, 205, 220, 0.45)');
    ctx.fillStyle = frostOverlay;
    ctx.fillRect(paneX, paneY, paneW, paneH);

    // Heavier condensation around pane corners
    ctx.fillStyle = 'rgba(200, 220, 235, 0.25)';
    ctx.fillRect(paneX, paneY, 20, 20);
    ctx.fillRect(paneX + paneW - 20, paneY, 20, 20);
    ctx.fillRect(paneX, paneY + paneH - 20, 20, 20);
    ctx.fillRect(paneX + paneW - 20, paneY + paneH - 20, 20, 20);

    // Clear condensation drip rivulets cutting vertically through the fog
    ctx.fillStyle = 'rgba(10, 14, 18, 0.28)';
    ctx.fillRect(paneX + 16, paneY + 8, 2, 60);
    ctx.fillRect(paneX + 32, paneY + 12, 1, 52);
    ctx.fillRect(paneX + 58, paneY + 6, 2, 66);
    ctx.fillRect(paneX + 70, paneY + 14, 1, 50);

    // Exterior rain streaks & moisture droplets
    ctx.fillStyle = 'rgba(150, 185, 210, 0.4)';
    const rainLines2 = [
      [12, 16, 1, 20],
      [22, 10, 1, 24],
      [36, 18, 1, 16],
      [52, 12, 1, 22],
      [64, 18, 1, 26],
      [74, 10, 1, 20],
    ];
    rainLines2.forEach(([rx, ry, rw, rh]) => {
      ctx.fillRect(paneX + rx, paneY + ry, rw, rh);
    });

    ctx.fillStyle = 'rgba(195, 220, 240, 0.6)';
    const drops2 = [
      [17, 69],
      [33, 65],
      [59, 73],
      [71, 65],
      [23, 35],
      [65, 45],
    ];
    drops2.forEach(([dx, dy]) => {
      ctx.fillRect(paneX + dx, paneY + dy, 2, 2);
    });
  }

  // =========================================================================
  // COMMON WINDOW FRAME & MULLION CROSSBARS
  // =========================================================================

  // Wooden window mullion (crossbars dividing into 4 quadrants)
  ctx.fillStyle = '#1c120a';
  ctx.fillRect(paneX + Math.floor(paneW / 2) - 2, paneY, 4, paneH); // Vertical mullion
  ctx.fillRect(paneX, paneY + Math.floor(paneH / 2) - 2, paneW, 4); // Horizontal mullion

  // Window mullion bevel shadow & highlight
  ctx.fillStyle = '#0f0a06';
  ctx.fillRect(paneX + Math.floor(paneW / 2) + 2, paneY, 1, paneH);
  ctx.fillRect(paneX, paneY + Math.floor(paneH / 2) + 2, paneW, 1);

  // Bottom window sill
  ctx.fillStyle = '#3c271b';
  ctx.fillRect(4, 88, 88, 8);
  ctx.fillStyle = '#503424';
  ctx.fillRect(4, 88, 88, 2);
  ctx.fillStyle = '#26180f';
  ctx.fillRect(4, 95, 88, 1);
}

/**
 * 6. Close-up of the door with dynamic room plaque and hardware.
 */
function renderDoorCloseUp(
  ctx: CanvasRenderingContext2D,
  objectId?: string,
  inspectTitle?: string
): void {
  // Determine door number
  let doorNum = '217';
  if (objectId?.includes('214') || inspectTitle?.includes('214')) doorNum = '214';
  else if (objectId?.includes('215') || inspectTitle?.includes('215')) doorNum = '215';
  else if (objectId?.includes('216') || inspectTitle?.includes('216')) doorNum = '216';
  else if (objectId?.includes('217') || inspectTitle?.includes('217')) doorNum = '217';

  const isInsideRoom217 = objectId === 'door' || objectId === 'room217_intro_message';

  // Door dark timber wood paneling
  ctx.fillStyle = '#2a1a11';
  ctx.fillRect(0, 0, 96, 96);

  // Wood grain vertical seams
  ctx.fillStyle = '#1c110b';
  ctx.fillRect(20, 0, 1, 96);
  ctx.fillRect(48, 0, 1, 96);
  ctx.fillRect(76, 0, 1, 96);

  // Door panel molded frame
  ctx.fillStyle = '#3a2417';
  ctx.fillRect(8, 8, 80, 80);
  ctx.fillStyle = '#1f130c';
  ctx.fillRect(12, 12, 72, 72);

  // Brass Plaque
  ctx.fillStyle = '#8a6828';
  ctx.fillRect(22, 18, 52, 24);
  ctx.fillStyle = '#d4aa50';
  ctx.fillRect(24, 20, 48, 20);

  // Plaque dark border
  ctx.strokeStyle = '#5a4216';
  ctx.lineWidth = 1;
  ctx.strokeRect(23.5, 19.5, 49, 21);

  // Brass mounting screws
  ctx.fillStyle = '#4a3612';
  ctx.fillRect(25, 21, 2, 2);
  ctx.fillRect(69, 21, 2, 2);
  ctx.fillRect(25, 37, 2, 2);
  ctx.fillRect(69, 37, 2, 2);

  // Engraved Plaque numbers (2, 1, and third digit)
  ctx.fillStyle = '#261b07';
  // Common first digit: '2'
  ctx.fillRect(32, 24, 8, 2);
  ctx.fillRect(38, 26, 2, 4);
  ctx.fillRect(32, 30, 8, 2);
  ctx.fillRect(32, 32, 2, 4);
  ctx.fillRect(32, 36, 8, 2);

  // Common second digit: '1'
  ctx.fillRect(45, 26, 2, 2);
  ctx.fillRect(47, 24, 2, 14);
  ctx.fillRect(44, 36, 8, 2);

  // Third digit: 4, 5, 6, or 7
  if (doorNum === '214') {
    // '4'
    ctx.fillRect(57, 24, 2, 8);
    ctx.fillRect(57, 30, 8, 2);
    ctx.fillRect(63, 24, 2, 14);
  } else if (doorNum === '215') {
    // '5'
    ctx.fillRect(57, 24, 8, 2);
    ctx.fillRect(57, 26, 2, 4);
    ctx.fillRect(57, 30, 8, 2);
    ctx.fillRect(63, 32, 2, 4);
    ctx.fillRect(57, 36, 8, 2);
  } else if (doorNum === '216') {
    // '6'
    ctx.fillRect(57, 24, 8, 2);
    ctx.fillRect(57, 26, 2, 12);
    ctx.fillRect(57, 30, 8, 2);
    ctx.fillRect(63, 32, 2, 4);
    ctx.fillRect(57, 36, 8, 2);
  } else {
    // '7'
    ctx.fillRect(57, 24, 8, 2);
    ctx.fillRect(63, 26, 2, 4);
    ctx.fillRect(61, 30, 2, 4);
    ctx.fillRect(59, 34, 2, 4);
  }

  // Hardware rendering specific to each door:
  if (isInsideRoom217) {
    // Heavy Horizontal Brass Deadbolt (LOCKED position inside Room 217)
    ctx.fillStyle = '#120b07';
    ctx.fillRect(16, 54, 64, 24);

    // Deadbolt housing backplate
    ctx.fillStyle = '#7a5a22';
    ctx.fillRect(18, 56, 44, 20);
    ctx.fillStyle = '#d4aa50';
    ctx.fillRect(20, 58, 40, 16);

    // Bolt cylinder extending firmly into door strike keeper on right
    ctx.fillStyle = '#b08b3a';
    ctx.fillRect(58, 62, 18, 8);
    ctx.fillStyle = '#e8c46c';
    ctx.fillRect(58, 63, 18, 3);

    // Deadbolt turn knob
    ctx.fillStyle = '#3a270d';
    ctx.fillRect(34, 62, 10, 8);
    ctx.fillStyle = '#d4aa50';
    ctx.fillRect(35, 63, 8, 6);
    ctx.fillStyle = '#8a6828';
    ctx.fillRect(38, 61, 2, 10);
  } else if (doorNum === '214') {
    // Door 214: Brass lever handle with DO NOT DISTURB card
    ctx.fillStyle = '#18120b';
    ctx.fillRect(36, 56, 12, 16);
    ctx.fillStyle = '#d4aa50';
    ctx.fillRect(38, 58, 8, 12);
    ctx.fillStyle = '#a6853f';
    ctx.fillRect(30, 60, 12, 4); // Handle lever

    // White & Red "Do Not Disturb" card hanging from handle
    ctx.fillStyle = '#16120e';
    ctx.fillRect(31, 62, 16, 28);
    ctx.fillStyle = '#e8e2d8';
    ctx.fillRect(32, 63, 14, 26);
    // Card cutout ring
    ctx.fillStyle = '#2a1a11';
    ctx.fillRect(37, 65, 4, 4);

    // Red printed graphic and text lines
    ctx.fillStyle = '#9e2222';
    ctx.fillRect(35, 73, 8, 8);
    ctx.fillStyle = '#e8e2d8';
    ctx.fillRect(37, 75, 4, 4);
    ctx.fillStyle = '#4a3f36';
    ctx.fillRect(34, 83, 10, 1);
    ctx.fillRect(35, 86, 8, 1);
  } else if (doorNum === '216') {
    // Door 216: Steel Hasp with Heavy Padlock & "UNOCCUPIED" label
    // Steel mounting hasp plate
    ctx.fillStyle = '#3a3a42';
    ctx.fillRect(26, 56, 32, 8);
    ctx.fillStyle = '#555562';
    ctx.fillRect(27, 57, 30, 6);
    ctx.fillStyle = '#222228';
    ctx.fillRect(52, 54, 4, 12); // Loop staple

    // Cast-iron padlock hanging on staple
    ctx.fillStyle = '#777785';
    ctx.fillRect(51, 58, 6, 8); // Shackle
    ctx.fillStyle = '#2a1a11';
    ctx.fillRect(53, 60, 2, 4);

    ctx.fillStyle = '#1e1e24';
    ctx.fillRect(47, 66, 14, 16); // Body
    ctx.fillStyle = '#383844';
    ctx.fillRect(48, 67, 12, 14);
    ctx.fillStyle = '#111116';
    ctx.fillRect(53, 73, 2, 4); // Keyway

    // Tacked paper card: "UNOCCUPIED"
    ctx.fillStyle = '#d5cebe';
    ctx.fillRect(24, 76, 18, 12);
    ctx.fillStyle = '#8f2018';
    ctx.fillRect(32, 75, 2, 2); // Tack
    ctx.fillStyle = '#554a3e';
    ctx.fillRect(26, 80, 14, 2);
    ctx.fillRect(27, 84, 12, 1);
  } else if (doorNum === '215') {
    // Door 215: Standard brass handle & keyhole (locked)
    ctx.fillStyle = '#1a120c';
    ctx.fillRect(42, 54, 12, 26);
    ctx.fillStyle = '#d4aa50';
    ctx.fillRect(44, 56, 8, 22);

    // Brass lever
    ctx.fillStyle = '#b08b3a';
    ctx.fillRect(36, 58, 12, 4);

    // Dark keyhole
    ctx.fillStyle = '#100a06';
    ctx.beginPath();
    ctx.arc(48, 70, 2, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillRect(47.5, 71, 1, 3);
  } else {
    // Door 217 in Corridor: Unlocked brass handle with polished plate
    ctx.fillStyle = '#1a120c';
    ctx.fillRect(42, 54, 12, 28);
    ctx.fillStyle = '#d4aa50';
    ctx.fillRect(44, 56, 8, 24);
    ctx.fillStyle = '#f5cc66';
    ctx.fillRect(45, 57, 2, 22); // Highlight

    // Turn knob / lever
    ctx.fillStyle = '#b08b3a';
    ctx.fillRect(34, 58, 14, 5);
    ctx.fillStyle = '#f5cc66';
    ctx.fillRect(35, 59, 12, 2);

    // Keyhole
    ctx.fillStyle = '#100a06';
    ctx.fillRect(47, 72, 2, 4);
  }
}

/**
 * 7. Close-up of the corkboard hostel notice.
 */
function renderNoticeCloseUp(ctx: CanvasRenderingContext2D): void {
  // Corkboard texture
  ctx.fillStyle = '#5a3d28';
  ctx.fillRect(0, 0, 96, 96);

  // Cork speckled grain
  ctx.fillStyle = '#442c1b';
  for (let y = 4; y < 96; y += 6) {
    for (let x = 4; x < 96; x += 8) {
      ctx.fillRect(x + ((y % 12 === 0) ? 3 : 0), y, 2, 2);
    }
  }

  // Yellowed paper notice
  ctx.fillStyle = '#c4b89d';
  ctx.fillRect(12, 10, 72, 76);
  ctx.fillStyle = '#e5dbbe';
  ctx.fillRect(14, 12, 68, 72);

  // Red pushpin at top center
  ctx.fillStyle = '#8f2018';
  ctx.beginPath();
  ctx.arc(48, 14, 4, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#d94b43';
  ctx.fillRect(47, 13, 2, 2);

  // Notice Header Banner
  ctx.fillStyle = '#2c2217';
  ctx.fillRect(20, 20, 56, 4);

  // Typed text lines simulation
  ctx.fillStyle = '#594d3d';
  for (let y = 30; y < 76; y += 5) {
    const w = (y === 65 || y === 75) ? 38 : 56;
    ctx.fillRect(20, y, w, 2);
  }
}

/**
 * 8. Close-up of the friend's damaged pocket diary.
 */
function renderDiaryCloseUp(ctx: CanvasRenderingContext2D): void {
  // Dark wooden floor background
  ctx.fillStyle = '#1e140d';
  ctx.fillRect(0, 0, 96, 96);

  // Soft drop shadow
  ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
  ctx.fillRect(16, 20, 68, 64);

  // Worn leather/cloth diary cover
  ctx.fillStyle = '#261b14';
  ctx.fillRect(18, 16, 62, 62);
  ctx.fillStyle = '#3a2b20';
  ctx.fillRect(20, 18, 58, 58);

  // Diary spine (on left)
  ctx.fillStyle = '#1c120c';
  ctx.fillRect(18, 16, 8, 62);
  ctx.fillStyle = '#4f3827';
  ctx.fillRect(20, 18, 2, 58);

  // Thread binding stitches
  ctx.fillStyle = '#c5b18a';
  for (let y = 24; y < 74; y += 10) {
    ctx.fillRect(21, y, 4, 2);
  }

  // Exposed paper page edges (aged cream parchment)
  ctx.fillStyle = '#dcd2bd';
  ctx.fillRect(28, 22, 48, 50);
  ctx.fillStyle = '#c8bc9f';
  ctx.fillRect(28, 24, 46, 46);

  // Corner burn / charred damage on top right
  ctx.fillStyle = '#180f08';
  ctx.beginPath();
  ctx.moveTo(76, 16);
  ctx.lineTo(80, 16);
  ctx.lineTo(80, 28);
  ctx.lineTo(68, 16);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = '#482010';
  ctx.fillRect(66, 18, 10, 4);

  // Water stain mark (faded ring)
  ctx.strokeStyle = '#b0a082';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.arc(52, 48, 14, 0, Math.PI * 2);
  ctx.stroke();

  // Faint handwritten ink lines on exposed page
  ctx.fillStyle = '#594d3f';
  for (let y = 30; y < 64; y += 5) {
    const lw = (y === 55) ? 22 : 36;
    ctx.fillRect(32, y, lw, 1);
  }

  // Woven ribbon bookmark hanging down
  ctx.fillStyle = '#8b2820';
  ctx.fillRect(44, 68, 3, 22);
  ctx.fillStyle = '#ab3c32';
  ctx.fillRect(45, 68, 1, 20);
}

/**
 * 9. Close-up of the baseboard seam before second blackout.
 */
function renderSeamCloseUp(ctx: CanvasRenderingContext2D): void {
  // Dark wall plaster (top half)
  ctx.fillStyle = '#181b19';
  ctx.fillRect(0, 0, 96, 42);

  // Wallpaper seam & aged plaster flecks
  ctx.fillStyle = '#121514';
  ctx.fillRect(48, 0, 1, 42);
  ctx.fillRect(20, 18, 2, 2);
  ctx.fillRect(72, 28, 2, 2);

  // Wooden baseboard
  ctx.fillStyle = '#321f14';
  ctx.fillRect(0, 42, 96, 22);
  ctx.fillStyle = '#482e1e';
  ctx.fillRect(0, 42, 96, 3); // Baseboard top bevel

  // Wooden floorboards (bottom)
  ctx.fillStyle = '#1c130d';
  ctx.fillRect(0, 64, 96, 32);

  // Floorboard plank seams
  ctx.fillStyle = '#0f0a07';
  ctx.fillRect(0, 78, 96, 1);
  ctx.fillRect(40, 64, 1, 32);

  // The loose, shifting seam where the board separates
  ctx.fillStyle = '#070503';
  ctx.fillRect(22, 63, 52, 3);
  ctx.fillStyle = '#140c08';
  ctx.fillRect(26, 61, 44, 2);

  // Subtle cold draft wisps rising from the crack
  ctx.fillStyle = 'rgba(150, 190, 220, 0.15)';
  ctx.fillRect(36, 52, 2, 8);
  ctx.fillRect(52, 48, 2, 10);
  ctx.fillRect(44, 42, 2, 6);
}

/**
 * 10. Close-up of the open hollow cavity in the baseboard/floorboards.
 */
function renderCavityCloseUp(ctx: CanvasRenderingContext2D): void {
  // Dark wall plaster (top half)
  ctx.fillStyle = '#161917';
  ctx.fillRect(0, 0, 96, 38);

  // Shifted baseboard (pried outward from wall)
  ctx.fillStyle = '#3a2417';
  ctx.fillRect(0, 38, 96, 16);
  ctx.fillStyle = '#543622';
  ctx.fillRect(0, 38, 96, 3);

  // Shifted board gap (wooden grain angled outward)
  ctx.fillStyle = '#26160e';
  ctx.fillRect(16, 50, 64, 8);

  // Deep hollow cavity recess inside the wall/floorboard
  ctx.fillStyle = '#050302';
  ctx.fillRect(14, 54, 68, 26);
  ctx.fillStyle = '#0a0604';
  ctx.fillRect(16, 56, 64, 22);

  // Exposed wall studs / floor lath inside the cavity
  ctx.fillStyle = '#1c120a';
  ctx.fillRect(18, 58, 4, 18);
  ctx.fillRect(74, 58, 4, 18);

  // Internal void shadow gradient
  ctx.fillStyle = '#000000';
  ctx.fillRect(22, 62, 52, 14);

  // Floorboards in foreground
  ctx.fillStyle = '#1c130d';
  ctx.fillRect(0, 80, 96, 16);
  ctx.fillStyle = '#0e0906';
  ctx.fillRect(0, 80, 96, 1);

  // Cold draft mist rising from the open cavity
  ctx.fillStyle = 'rgba(170, 210, 240, 0.22)';
  ctx.fillRect(32, 44, 3, 14);
  ctx.fillRect(48, 36, 4, 20);
  ctx.fillRect(62, 42, 3, 16);
}

/**
 * 11. Close-up of the friend's cracked, dark mobile phone.
 */
function renderPhoneCloseUp(ctx: CanvasRenderingContext2D): void {
  // Dark void cavity background
  ctx.fillStyle = '#0a0a0c';
  ctx.fillRect(0, 0, 96, 96);

  // Soft shadow under phone
  ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
  ctx.fillRect(26, 12, 44, 76);

  // Phone outer bezel casing (matte dark titanium)
  ctx.fillStyle = '#1c1f21';
  ctx.fillRect(28, 10, 40, 76);
  ctx.fillStyle = '#2d3337';
  ctx.fillRect(29, 11, 38, 74);

  // Inner black glass screen
  ctx.fillStyle = '#0a1012';
  ctx.fillRect(32, 16, 32, 62);

  // Top earpiece slit & camera
  ctx.fillStyle = '#121517';
  ctx.fillRect(44, 13, 8, 1.5);
  ctx.fillRect(39, 13, 1.5, 1.5);

  // Deep spiderweb cracks across the glass screen
  ctx.strokeStyle = '#5a7885';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(64, 16);
  ctx.lineTo(52, 34);
  ctx.lineTo(58, 48);
  ctx.lineTo(44, 66);
  ctx.lineTo(50, 78);
  ctx.stroke();

  ctx.strokeStyle = '#3d5661';
  ctx.beginPath();
  ctx.moveTo(52, 34);
  ctx.lineTo(36, 30);
  ctx.moveTo(58, 48);
  ctx.lineTo(64, 56);
  ctx.moveTo(44, 66);
  ctx.lineTo(34, 72);
  ctx.stroke();

  // Dim red blinking battery indicator
  ctx.fillStyle = '#9e2a2b';
  ctx.fillRect(56, 18, 5, 3);
  ctx.fillStyle = '#e63946';
  ctx.fillRect(57, 19, 2, 1);

  // Faint boot glint reflection
  ctx.fillStyle = 'rgba(100, 180, 200, 0.12)';
  ctx.beginPath();
  ctx.moveTo(32, 16);
  ctx.lineTo(48, 16);
  ctx.lineTo(32, 48);
  ctx.closePath();
  ctx.fill();
}

/**
 * 12. Close-up of the wardrobe mirror with eerie delayed reflection alongside the recessed brass fixture.
 */
function renderKeyCloseUp(ctx: CanvasRenderingContext2D): void {
  // Dark wardrobe interior paneling
  ctx.fillStyle = '#140c08';
  ctx.fillRect(0, 0, 96, 96);

  // ==========================================
  // LEFT SIDE: The Wardrobe Mirror with Eerie Lagging Reflection
  // ==========================================

  // Mirror outer frame
  ctx.fillStyle = '#26170e';
  ctx.fillRect(4, 4, 46, 88);
  ctx.fillStyle = '#3d2516';
  ctx.fillRect(5, 5, 44, 86);

  // Mirror glass pane (cold, desaturated dark void)
  ctx.fillStyle = '#0f171c';
  ctx.fillRect(7, 7, 40, 82);

  // Faint cold ambient mist / glass sheen
  ctx.fillStyle = 'rgba(70, 105, 125, 0.15)';
  ctx.fillRect(7, 7, 40, 82);

  // Faint delayed ghost echo behind Neo (lagging reflection)
  ctx.fillStyle = 'rgba(35, 55, 68, 0.4)';
  // Ghost head & shoulders offset to the left
  ctx.fillRect(21, 23, 14, 16);
  ctx.fillRect(17, 39, 22, 38);

  // Main Desaturated "Wrong" Reflection of Neo
  // Coat / Torso (desaturated slate-teal)
  ctx.fillStyle = '#26343b';
  ctx.fillRect(19, 41, 18, 38);
  // Coat inner collar
  ctx.fillStyle = '#192429';
  ctx.fillRect(25, 41, 6, 12);
  // Coat lapels
  ctx.fillStyle = '#32444d';
  ctx.fillRect(20, 42, 4, 24);
  ctx.fillRect(33, 42, 4, 24);

  // Neck (pale, bloodless)
  ctx.fillStyle = '#7a8c91';
  ctx.fillRect(26, 35, 4, 7);

  // Head / Face (pale, lifeless tone)
  ctx.fillStyle = '#8a9c9f';
  ctx.fillRect(23, 21, 10, 15);
  ctx.fillStyle = '#75878a';
  ctx.fillRect(23, 31, 10, 5); // Jaw shadow

  // Dark messy hair
  ctx.fillStyle = '#111719';
  ctx.fillRect(22, 19, 12, 6);
  ctx.fillRect(21, 23, 3, 7);
  ctx.fillRect(32, 23, 3, 6);

  // Unsettling fixed stare: hollow void eye sockets
  ctx.fillStyle = '#040708';
  ctx.fillRect(25, 27, 2, 3);
  ctx.fillRect(29, 27, 2, 3);
  // Tiny piercing pale pinprick pupils staring directly at the player
  ctx.fillStyle = '#d8eaee';
  ctx.fillRect(25, 28, 1, 1);
  ctx.fillRect(29, 28, 1, 1);

  // Expressionless mouth line
  ctx.fillStyle = '#516164';
  ctx.fillRect(26, 33, 4, 1);

  // Diagonal crack / tarnished mercury streak across the mirror glass
  ctx.strokeStyle = 'rgba(140, 180, 200, 0.4)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(8, 70);
  ctx.lineTo(24, 52);
  ctx.lineTo(28, 38);
  ctx.lineTo(44, 20);
  ctx.stroke();

  // Glass edge bevel highlights
  ctx.fillStyle = 'rgba(180, 220, 240, 0.2)';
  ctx.fillRect(7, 7, 40, 1);
  ctx.fillRect(7, 7, 1, 82);

  // ==========================================
  // RIGHT SIDE: The Concealed Recessed Brass Fixture & Key
  // ==========================================

  // Dark molding divider between mirror and wall
  ctx.fillStyle = '#0a0604';
  ctx.fillRect(52, 0, 3, 96);

  // Recessed rectangular brass housing box (beveled frame)
  ctx.fillStyle = '#261b0f';
  ctx.fillRect(57, 16, 35, 64);
  ctx.fillStyle = '#423118';
  ctx.fillRect(59, 18, 31, 60);

  // Deep recessed cavity velvet/felt lining
  ctx.fillStyle = '#0d0805';
  ctx.fillRect(61, 22, 27, 52);
  ctx.fillStyle = '#140c08';
  ctx.fillRect(63, 24, 23, 48);

  // Spring latch catch visible at top
  ctx.fillStyle = '#9e814d';
  ctx.fillRect(72, 19, 6, 3);
  ctx.fillStyle = '#d4b36c';
  ctx.fillRect(73, 20, 4, 1);

  // Antique Brass Key (vertical hanging/resting in the fixture)
  // Key shadow
  ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
  ctx.fillRect(72, 28, 8, 42);

  // Key Bow (top)
  ctx.fillStyle = '#8f7035';
  ctx.beginPath();
  ctx.arc(74, 34, 7, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#d4b36c';
  ctx.beginPath();
  ctx.arc(73, 33, 6, 0, Math.PI * 2);
  ctx.fill();

  // Hole inside oval bow
  ctx.fillStyle = '#140c08';
  ctx.beginPath();
  ctx.arc(74, 34, 3, 0, Math.PI * 2);
  ctx.fill();

  // Key shaft / stem (running down)
  ctx.fillStyle = '#8f7035';
  ctx.fillRect(72, 40, 4, 24);
  ctx.fillStyle = '#e8c87c';
  ctx.fillRect(73, 40, 1.5, 23); // Highlight

  // Shaft collar rings
  ctx.fillStyle = '#d4b36c';
  ctx.fillRect(71, 42, 6, 2);
  ctx.fillRect(71, 48, 6, 2);

  // Key Bit / Notched wards (pointing right at bottom)
  ctx.fillStyle = '#8f7035';
  ctx.fillRect(76, 56, 6, 8);
  ctx.fillStyle = '#d4b36c';
  ctx.fillRect(76, 56, 5, 7);
  ctx.fillStyle = '#140c08';
  ctx.fillRect(78, 59, 3, 2); // Ward notch cut

  // Key tip
  ctx.fillStyle = '#d4b36c';
  ctx.fillRect(72, 64, 4, 2);

  // Metallic glint star on key bow
  ctx.fillStyle = '#fffdf0';
  ctx.fillRect(71, 30, 2, 2);
}

/**
 * 13. Close-up of the heavy iron-banded box (locked or open with oilcloth bundle).
 */
function renderBoxCloseUp(ctx: CanvasRenderingContext2D, isOpen: boolean): void {
  // Dark basement stone wall background
  ctx.fillStyle = '#0e1113';
  ctx.fillRect(0, 0, 96, 96);

  // Basement mortar lines
  ctx.fillStyle = '#161a1d';
  ctx.fillRect(0, 24, 96, 1);
  ctx.fillRect(0, 52, 96, 1);
  ctx.fillRect(40, 0, 1, 24);
  ctx.fillRect(72, 24, 1, 28);

  // Scarred wooden workbench surface
  ctx.fillStyle = '#22160e';
  ctx.fillRect(0, 76, 96, 20);
  ctx.fillStyle = '#382517';
  ctx.fillRect(0, 76, 96, 2);

  // Box shadow on table
  ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
  ctx.fillRect(12, 74, 72, 14);

  // Main Oak Chest Body (lower box)
  ctx.fillStyle = '#3a2618';
  ctx.fillRect(14, 46, 68, 30);
  ctx.fillStyle = '#2d1c11';
  ctx.fillRect(16, 48, 64, 26);

  // Vertical wood plank grain on box
  ctx.fillStyle = '#22150c';
  ctx.fillRect(36, 48, 1, 26);
  ctx.fillRect(58, 48, 1, 26);

  if (!isOpen) {
    // ==========================================
    // LOCKED STATE
    // ==========================================
    // Closed Lid
    ctx.fillStyle = '#4a3220';
    ctx.fillRect(12, 28, 72, 18);
    ctx.fillStyle = '#5c3e28';
    ctx.fillRect(13, 29, 70, 3); // Lid bevel highlight
    ctx.fillStyle = '#2d1c11';
    ctx.fillRect(12, 45, 72, 2); // Lid seam shadow

    // Iron corner straps on lid & body
    ctx.fillStyle = '#1c1f21';
    ctx.fillRect(14, 28, 6, 48);
    ctx.fillRect(76, 28, 6, 48);
    // Iron center bands
    ctx.fillRect(34, 28, 5, 48);
    ctx.fillRect(57, 28, 5, 48);

    // Rivet studs on iron straps
    ctx.fillStyle = '#4f565b';
    [16, 36, 59, 78].forEach((rx) => {
      ctx.fillRect(rx, 31, 2, 2);
      ctx.fillRect(rx, 40, 2, 2);
      ctx.fillRect(rx, 52, 2, 2);
      ctx.fillRect(rx, 68, 2, 2);
    });

    // Front Iron Hasp Plate
    ctx.fillStyle = '#151719';
    ctx.fillRect(44, 42, 8, 16);
    // Brass Padlock / Cylinder
    ctx.fillStyle = '#9e813a';
    ctx.fillRect(43, 52, 10, 11);
    ctx.fillStyle = '#d4b459';
    ctx.fillRect(44, 53, 8, 3);
    // Keyhole
    ctx.fillStyle = '#120d04';
    ctx.fillRect(47, 57, 2, 4);
  } else {
    // ==========================================
    // UNLOCKED & OPEN STATE
    // ==========================================
    // Lid raised and tilted back into shadows
    ctx.fillStyle = '#1c140d';
    ctx.fillRect(14, 10, 68, 20);
    ctx.fillStyle = '#2f2015';
    ctx.fillRect(14, 10, 68, 3);

    // Deep interior cavity shadow of the open chest
    ctx.fillStyle = '#060403';
    ctx.fillRect(16, 26, 64, 24);

    // Iron straps on box body
    ctx.fillStyle = '#1c1f21';
    ctx.fillRect(14, 46, 6, 30);
    ctx.fillRect(76, 46, 6, 30);
    ctx.fillRect(34, 46, 5, 30);
    ctx.fillRect(57, 46, 5, 30);

    // Rivets
    ctx.fillStyle = '#4f565b';
    [16, 36, 59, 78].forEach((rx) => {
      ctx.fillRect(rx, 52, 2, 2);
      ctx.fillRect(rx, 68, 2, 2);
    });

    // Unlocked brass latch flipped open to the side
    ctx.fillStyle = '#9e813a';
    ctx.fillRect(49, 44, 11, 4);
    ctx.fillStyle = '#d4b459';
    ctx.fillRect(50, 45, 9, 2);

    // The Mysterious Oilcloth Bundle inside the box cavity
    // Dark waxed heavy canvas wrapped parcel
    ctx.fillStyle = '#1a1f18';
    ctx.fillRect(26, 32, 44, 18);
    ctx.fillStyle = '#262d23';
    ctx.fillRect(28, 33, 40, 15);
    // Canvas fold creases
    ctx.fillStyle = '#131812';
    ctx.fillRect(38, 33, 1, 15);
    ctx.fillRect(54, 33, 1, 15);
    // Faint twine cord tied around the parcel
    ctx.fillStyle = '#8a7752';
    ctx.fillRect(26, 40, 44, 1);
    ctx.fillRect(46, 32, 2, 18);
  }
}

/**
 * 14. Close-up of the unwrapped parcel contents (1983 photo, torn ledger entry, and parcel tag).
 */
function renderParcelContentsCloseUp(ctx: CanvasRenderingContext2D): void {
  // Unfolded dark waxed oilcloth backing
  ctx.fillStyle = '#171c15';
  ctx.fillRect(0, 0, 96, 96);

  // Waxed oilcloth fold creases
  ctx.fillStyle = '#10140e';
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.lineTo(24, 28);
  ctx.lineTo(0, 56);
  ctx.fill();

  ctx.beginPath();
  ctx.moveTo(96, 0);
  ctx.lineTo(76, 24);
  ctx.lineTo(96, 60);
  ctx.fill();

  // Dropped shadows for evidence items
  ctx.fillStyle = 'rgba(0, 0, 0, 0.65)';
  ctx.fillRect(8, 12, 44, 52);
  ctx.fillRect(44, 8, 48, 62);
  ctx.fillRect(18, 62, 66, 26);

  // ==========================================
  // ITEM 1: 1983 B&W Photograph (left side)
  // ==========================================
  // Polaroid / Print Border (aged yellowish-white)
  ctx.fillStyle = '#dcd5c0';
  ctx.fillRect(6, 10, 42, 50);

  // Silver bromide photo frame
  ctx.fillStyle = '#121415';
  ctx.fillRect(9, 13, 36, 36);

  // Room 217 Wardrobe Mirror reflection in photo
  ctx.fillStyle = '#22282c';
  ctx.fillRect(18, 15, 18, 30);
  ctx.fillStyle = '#181e22';
  ctx.fillRect(20, 17, 14, 26);

  // Figure standing in front of mirror (identical stance and silhouette to Neo)
  ctx.fillStyle = '#080a0b';
  // Head
  ctx.fillRect(24, 20, 6, 6);
  // Coat & shoulders
  ctx.fillRect(22, 26, 10, 17);
  ctx.fillRect(20, 28, 14, 15);
  // Faint white collar glint
  ctx.fillStyle = '#8a9ea8';
  ctx.fillRect(26, 26, 2, 2);

  // Photo bottom border handwritten caption
  ctx.fillStyle = '#3a2d24';
  ctx.font = '5px monospace';
  ctx.fillText("OCT '83 - 217", 10, 56);

  // ==========================================
  // ITEM 2: Torn Tenant Ledger Page (right side)
  // ==========================================
  // Yellowed, aged register paper
  ctx.fillStyle = '#e4dcbe';
  ctx.fillRect(42, 6, 48, 58);

  // Rough razor-cut left edge notches
  ctx.fillStyle = '#171c15';
  for (let y = 6; y < 64; y += 4) {
    if (y % 8 === 0) {
      ctx.fillRect(42, y, 2, 2);
    }
  }

  // Faint ledger rule lines
  ctx.fillStyle = '#b8ad8f';
  for (let ly = 16; ly < 60; ly += 6) {
    ctx.fillRect(45, ly, 42, 1);
  }

  // Header line
  ctx.fillStyle = '#4a3d2c';
  ctx.fillRect(45, 10, 28, 2);

  // Red stamped ink notation: "FL.2 / UNRECORDED"
  ctx.fillStyle = '#8f2424';
  ctx.fillRect(48, 18, 34, 6);
  ctx.fillStyle = '#ffffff';
  ctx.font = '5px monospace';
  ctx.fillText('UNRECORDED', 50, 23);

  // Handwritten ledger cursive lines
  ctx.fillStyle = '#2c2217';
  ctx.fillRect(46, 28, 38, 2);
  ctx.fillRect(46, 34, 30, 2);
  ctx.fillRect(46, 40, 36, 2);

  // Faded red circular official hostel stamp
  ctx.strokeStyle = 'rgba(140, 35, 35, 0.45)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.arc(76, 46, 8, 0, Math.PI * 2);
  ctx.stroke();

  // ==========================================
  // ITEM 3: Manila Evidence Tag (Ambiguous Neo Connection)
  // ==========================================
  // Manila tag card
  ctx.fillStyle = '#c7ab77';
  ctx.fillRect(16, 60, 68, 26);
  ctx.fillStyle = '#ab905d';
  ctx.strokeRect(16.5, 60.5, 67, 25);

  // Left clipped corners on tag
  ctx.fillStyle = '#171c15';
  ctx.fillRect(16, 60, 4, 4);
  ctx.fillRect(16, 82, 4, 4);

  // Brass reinforced eyelet hole
  ctx.fillStyle = '#7a5a22';
  ctx.beginPath();
  ctx.arc(24, 73, 3.5, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#171c15';
  ctx.beginPath();
  ctx.arc(24, 73, 1.5, 0, Math.PI * 2);
  ctx.fill();

  // Twine string running from eyelet
  ctx.strokeStyle = '#6e5a3c';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(24, 73);
  ctx.lineTo(8, 78);
  ctx.stroke();

  // Handwritten inscription on tag (familiar handwriting):
  // "HOLD FOR: NEO"
  // "Rm 217 - 1983"
  ctx.fillStyle = '#1f160e';
  ctx.font = '7px monospace';
  ctx.fillText('FOR: NEO', 32, 70);
  ctx.font = '5px monospace';
  ctx.fillStyle = '#4a3726';
  ctx.fillText('RM 217 - OCT 1983', 32, 79);
}

/**
 * 15. Close-up of the Key to Room 217 attached to the terrifying handwritten note.
 * Exactly reads: "why don't you come find out"
 */
function renderKey217NoteCloseUp(ctx: CanvasRenderingContext2D): void {
  // Dusty abandoned room floorboards
  ctx.fillStyle = '#1c1611';
  ctx.fillRect(0, 0, 96, 96);

  // Planks and floorboard gap seams
  ctx.fillStyle = '#120d09';
  ctx.fillRect(0, 32, 96, 2);
  ctx.fillRect(0, 68, 96, 2);
  ctx.fillStyle = '#261e17';
  ctx.fillRect(40, 0, 1, 32);
  ctx.fillRect(68, 34, 1, 34);

  // Drop shadow for the ragged note
  ctx.fillStyle = 'rgba(0, 0, 0, 0.65)';
  ctx.fillRect(10, 12, 76, 54);

  // Torn scrap of aged notebook paper (ragged torn fibrous edges)
  ctx.fillStyle = '#dcd3b8';
  ctx.fillRect(10, 10, 74, 52);

  // Torn / jagged paper contour flecks
  ctx.fillStyle = '#1c1611';
  // Top jagged tear
  ctx.fillRect(20, 10, 3, 2);
  ctx.fillRect(36, 10, 4, 3);
  ctx.fillRect(58, 10, 3, 2);
  // Bottom jagged tear
  ctx.fillRect(14, 59, 4, 3);
  ctx.fillRect(44, 60, 5, 2);
  ctx.fillRect(66, 58, 4, 4);
  // Right jagged tear
  ctx.fillRect(81, 24, 3, 4);
  ctx.fillRect(80, 42, 4, 3);

  // Faint faded blue notebook rule lines
  ctx.fillStyle = 'rgba(120, 140, 160, 0.25)';
  ctx.fillRect(14, 24, 68, 1);
  ctx.fillRect(14, 36, 68, 1);
  ctx.fillRect(14, 48, 68, 1);

  // Water stain / brown grime on the corner of the scrap
  ctx.fillStyle = 'rgba(100, 75, 45, 0.2)';
  ctx.beginPath();
  ctx.arc(76, 16, 12, 0, Math.PI * 2);
  ctx.fill();

  // UNSETTLING, UNEVEN, "SCARY" HANDWRITTEN LETTERING
  // Exact text: "why don't you come find out"
  ctx.fillStyle = '#18120c';

  // Line 1: "why don't you"
  // Drawn with jagged, scratchy pixel-art strokes
  // 'w'
  ctx.fillRect(16, 26, 1, 6);
  ctx.fillRect(17, 31, 1, 1);
  ctx.fillRect(18, 28, 1, 4);
  ctx.fillRect(19, 31, 1, 1);
  ctx.fillRect(20, 26, 1, 6);
  // 'h'
  ctx.fillRect(23, 23, 1, 9);
  ctx.fillRect(24, 27, 2, 1);
  ctx.fillRect(26, 28, 1, 4);
  // 'y'
  ctx.fillRect(29, 27, 1, 4);
  ctx.fillRect(31, 27, 1, 7);
  ctx.fillRect(30, 30, 1, 1);
  ctx.fillRect(29, 34, 2, 1);

  // "don't"
  // 'd'
  ctx.fillRect(36, 27, 2, 1);
  ctx.fillRect(35, 28, 1, 3);
  ctx.fillRect(36, 31, 2, 1);
  ctx.fillRect(38, 23, 1, 9);
  // 'o'
  ctx.fillRect(40, 28, 1, 3);
  ctx.fillRect(43, 28, 1, 3);
  ctx.fillRect(41, 27, 2, 1);
  ctx.fillRect(41, 31, 2, 1);
  // 'n'
  ctx.fillRect(45, 27, 1, 5);
  ctx.fillRect(46, 28, 2, 1);
  ctx.fillRect(48, 29, 1, 3);
  // apostrophe
  ctx.fillRect(49, 23, 1, 3);
  // 't'
  ctx.fillRect(51, 24, 1, 8);
  ctx.fillRect(50, 26, 3, 1);

  // "you"
  // 'y'
  ctx.fillRect(57, 27, 1, 4);
  ctx.fillRect(59, 27, 1, 7);
  ctx.fillRect(58, 30, 1, 1);
  ctx.fillRect(57, 34, 2, 1);
  // 'o'
  ctx.fillRect(62, 28, 1, 3);
  ctx.fillRect(65, 28, 1, 3);
  ctx.fillRect(63, 27, 2, 1);
  ctx.fillRect(63, 31, 2, 1);
  // 'u'
  ctx.fillRect(68, 27, 1, 4);
  ctx.fillRect(71, 27, 1, 5);
  ctx.fillRect(69, 31, 2, 1);

  // Line 2: "come find out"
  // 'c'
  ctx.fillRect(17, 39, 1, 4);
  ctx.fillRect(18, 38, 3, 1);
  ctx.fillRect(18, 43, 3, 1);
  // 'o'
  ctx.fillRect(22, 39, 1, 4);
  ctx.fillRect(25, 39, 1, 4);
  ctx.fillRect(23, 38, 2, 1);
  ctx.fillRect(23, 43, 2, 1);
  // 'm'
  ctx.fillRect(27, 38, 1, 6);
  ctx.fillRect(28, 39, 1, 1);
  ctx.fillRect(29, 40, 1, 4);
  ctx.fillRect(30, 39, 1, 1);
  ctx.fillRect(31, 40, 1, 4);
  // 'e'
  ctx.fillRect(34, 39, 1, 4);
  ctx.fillRect(35, 38, 2, 1);
  ctx.fillRect(35, 40, 2, 1);
  ctx.fillRect(35, 43, 2, 1);
  ctx.fillRect(37, 39, 1, 2);

  // "find"
  // 'f'
  ctx.fillRect(41, 35, 2, 1);
  ctx.fillRect(41, 36, 1, 8);
  ctx.fillRect(40, 38, 3, 1);
  // 'i'
  ctx.fillRect(44, 36, 1, 1);
  ctx.fillRect(44, 38, 1, 6);
  // 'n'
  ctx.fillRect(47, 38, 1, 6);
  ctx.fillRect(48, 39, 2, 1);
  ctx.fillRect(50, 40, 1, 4);
  // 'd'
  ctx.fillRect(53, 39, 2, 1);
  ctx.fillRect(52, 40, 1, 3);
  ctx.fillRect(53, 43, 2, 1);
  ctx.fillRect(55, 35, 1, 9);

  // "out"
  // 'o'
  ctx.fillRect(59, 39, 1, 4);
  ctx.fillRect(62, 39, 1, 4);
  ctx.fillRect(60, 38, 2, 1);
  ctx.fillRect(60, 43, 2, 1);
  // 'u'
  ctx.fillRect(64, 38, 1, 5);
  ctx.fillRect(67, 38, 1, 6);
  ctx.fillRect(65, 43, 2, 1);
  // 't'
  ctx.fillRect(70, 36, 1, 8);
  ctx.fillRect(69, 38, 3, 1);

  // Punch hole in note where twine ties key
  ctx.fillStyle = '#1c1611';
  ctx.fillRect(16, 48, 3, 3);

  // ==========================================
  // Heavy Antique Brass Key stamped "217"
  // ==========================================
  // Twine loop connecting note to key bow
  ctx.strokeStyle = '#685038';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(17, 49);
  ctx.lineTo(24, 62);
  ctx.stroke();

  // Key shadow
  ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
  ctx.fillRect(22, 64, 62, 18);

  // Key bow (oval ring)
  ctx.fillStyle = '#9e813a';
  ctx.fillRect(18, 62, 18, 16);
  ctx.fillStyle = '#d4b459';
  ctx.fillRect(19, 63, 16, 2);
  // Key bow cutout
  ctx.fillStyle = '#1c1611';
  ctx.fillRect(22, 66, 10, 8);

  // Stamped "217" on key bow plate
  ctx.fillStyle = '#2b1f0c';
  ctx.fillRect(23, 76, 8, 3);
  ctx.fillStyle = '#f4e8c1';
  ctx.font = '5px monospace';
  ctx.fillText('217', 24, 78);

  // Brass shaft
  ctx.fillStyle = '#d4b459';
  ctx.fillRect(34, 68, 36, 5);
  ctx.fillStyle = '#8f7035';
  ctx.fillRect(34, 72, 36, 1);

  // Shaft collar rings
  ctx.fillStyle = '#fae196';
  ctx.fillRect(38, 67, 3, 7);
  ctx.fillRect(44, 67, 2, 7);

  // Key bit / ward teeth (pointing down)
  ctx.fillStyle = '#d4b459';
  ctx.fillRect(60, 73, 10, 8);
  ctx.fillStyle = '#8f7035';
  ctx.fillRect(60, 80, 10, 1);
  // Ward cuts
  ctx.fillStyle = '#1c1611';
  ctx.fillRect(63, 75, 2, 6);
  ctx.fillRect(67, 77, 2, 4);

  // Key tip
  ctx.fillStyle = '#fae196';
  ctx.fillRect(70, 69, 3, 3);
}

/**
 * 18. Close-up of the Ancient Stone Well.
 */
function renderWellCloseUp(ctx: CanvasRenderingContext2D): void {
  // Cold rainy night sky gradient background
  const skyGrad = ctx.createLinearGradient(0, 0, 0, 50);
  skyGrad.addColorStop(0, '#04070a');
  skyGrad.addColorStop(1, '#0c151c');
  ctx.fillStyle = skyGrad;
  ctx.fillRect(0, 0, 96, 50);

  // Rain streaks
  ctx.strokeStyle = 'rgba(160, 195, 220, 0.28)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  const rainStreaks = [
    [12, 6], [28, 14], [45, 8], [62, 18], [78, 10], [90, 22],
    [20, 32], [36, 40], [54, 30], [70, 44], [84, 36]
  ];
  rainStreaks.forEach(([rx, ry]) => {
    ctx.moveTo(rx, ry);
    ctx.lineTo(rx - 2, ry + 8);
  });
  ctx.stroke();

  // Dark ground surrounding well base
  ctx.fillStyle = '#0f1412';
  ctx.fillRect(0, 50, 96, 46);

  // Heavy stone masonry outer cylinder
  ctx.fillStyle = '#1e2622';
  ctx.fillRect(10, 48, 76, 44);

  // Individual textured mossy stones on well front
  const stones = [
    { x: 12, y: 50, w: 22, h: 10, c: '#27342e' },
    { x: 36, y: 50, w: 24, h: 10, c: '#232f29' },
    { x: 62, y: 50, w: 22, h: 10, c: '#293730' },
    { x: 10, y: 62, w: 18, h: 11, c: '#222d27' },
    { x: 30, y: 62, w: 26, h: 11, c: '#2b3932' },
    { x: 58, y: 62, w: 28, h: 11, c: '#202a24' },
    { x: 12, y: 75, w: 24, h: 12, c: '#26332d' },
    { x: 38, y: 75, w: 26, h: 12, c: '#1f2923' },
    { x: 66, y: 75, w: 18, h: 12, c: '#25322b' },
  ];

  stones.forEach((s) => {
    ctx.fillStyle = s.c;
    ctx.fillRect(s.x, s.y, s.w, s.h);
    // Dark mortar borders
    ctx.strokeStyle = '#0d1310';
    ctx.lineWidth = 1;
    ctx.strokeRect(s.x + 0.5, s.y + 0.5, s.w - 1, s.h - 1);
  });

  // Dark green weeping moss dripping from seams
  ctx.fillStyle = '#1b2a1e';
  ctx.fillRect(16, 60, 8, 4);
  ctx.fillRect(48, 72, 10, 5);
  ctx.fillRect(72, 58, 6, 6);

  // Top stone rim collar
  ctx.fillStyle = '#323f38';
  ctx.beginPath();
  ctx.ellipse(48, 46, 38, 12, 0, 0, Math.PI * 2);
  ctx.fill();

  // Dark inner rim shadow
  ctx.fillStyle = '#131916';
  ctx.beginPath();
  ctx.ellipse(48, 46, 32, 9, 0, 0, Math.PI * 2);
  ctx.fill();

  // Bottomless pitch-black shaft
  ctx.fillStyle = '#020304';
  ctx.beginPath();
  ctx.ellipse(48, 46, 28, 7, 0, 0, Math.PI * 2);
  ctx.fill();

  // Murky deep reflection at bottom
  ctx.fillStyle = 'rgba(100, 160, 195, 0.2)';
  ctx.fillRect(38, 45, 20, 2);

  // Weathered wooden upright gallows timber
  ctx.fillStyle = '#261b13';
  ctx.fillRect(12, 10, 6, 40); // Left beam
  ctx.fillRect(78, 10, 6, 40); // Right beam
  ctx.fillStyle = '#3a2a1d';
  ctx.fillRect(13, 10, 2, 40);
  ctx.fillRect(79, 10, 2, 40);

  // Decayed crossbeam timber
  ctx.fillStyle = '#2e2016';
  ctx.fillRect(8, 8, 80, 7);
  ctx.fillStyle = '#423021';
  ctx.fillRect(9, 9, 78, 2);

  // Iron spool axle & collapsed drum
  ctx.fillStyle = '#18120c';
  ctx.fillRect(36, 12, 24, 7);

  // Severed frayed rope
  ctx.strokeStyle = '#7c694c';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(48, 17);
  ctx.lineTo(48, 42);
  ctx.stroke();

  // Severed frayed fibers
  ctx.strokeStyle = '#a48b64';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(48, 42);
  ctx.lineTo(46, 45);
  ctx.moveTo(48, 42);
  ctx.lineTo(50, 46);
  ctx.stroke();
}

/**
 * Generic fallback close-up.
 */
function renderGenericCloseUp(ctx: CanvasRenderingContext2D): void {
  ctx.fillStyle = '#1c1814';
  ctx.fillRect(12, 12, 72, 72);
  ctx.strokeStyle = '#524434';
  ctx.strokeRect(12.5, 12.5, 71, 71);

  ctx.fillStyle = '#d4aa50';
  ctx.fillRect(46, 36, 4, 16);
  ctx.fillRect(46, 56, 4, 4);
}
