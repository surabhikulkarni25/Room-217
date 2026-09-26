import React, { useEffect, useRef } from 'react';

interface ShadowFigureFaceCloseUpProps {
  onComplete: () => void;
}

/**
 * Supernatural Green Snake Eyes Sequence:
 * Displays ONLY a pair of terrifying, sharply focused, predatory glowing green
 * serpentine eyes with needle-thin vertical slit pupils against a pitch-black screen.
 * NO human face, no mouth, no nose, no body. Pure intense predatory stare.
 *
 * Sequence:
 * 1. Screen is pitch black (silence in darkness).
 * 2. Piercing, toxic-green predatory snake eyes snap into sharp focus.
 * 3. Intense steady stare directly at the player with subtle, ominous organic micro-pulse.
 * 4. A single deliberate, chilling serpentine blink.
 * 5. Screen cuts / dissolves back to pitch blackness.
 */
export const ShadowFigureFaceCloseUp: React.FC<ShadowFigureFaceCloseUpProps> = ({
  onComplete,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    const startTime = performance.now();
    let hasCompleted = false;

    const render = (now: number) => {
      const elapsed = (now - startTime) / 1000; // in seconds

      // Background is always pitch void black
      ctx.fillStyle = '#000000';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      let alpha = 0;
      let openness = 1.0;
      let pulse = 1.0;

      if (elapsed < 0.35) {
        // 0.0s - 0.35s: Total black suspense
        alpha = 0;
        openness = 1.0;
      } else if (elapsed < 0.65) {
        // 0.35s - 0.65s: Sharp snap into visibility (fast fade-in, intense threat)
        alpha = (elapsed - 0.35) / 0.3;
        openness = 1.0;
      } else if (elapsed < 1.85) {
        // 0.65s - 1.85s: Locked, predatory stare directly at player with micro-pulse
        alpha = 1.0;
        openness = 1.0;
        // Subtle micro-pulse simulating breathing predatory focus
        pulse = 1.0 + 0.04 * Math.sin((elapsed - 0.65) * 6.0);
      } else if (elapsed < 1.98) {
        // 1.85s - 1.98s: Fast, deliberate blink closing (130ms)
        alpha = 1.0;
        openness = Math.max(0, 1.0 - (elapsed - 1.85) / 0.13);
      } else if (elapsed < 2.12) {
        // 1.98s - 2.12s: Blink opening back up with cold precision (140ms)
        alpha = 1.0;
        openness = Math.min(1.0, (elapsed - 1.98) / 0.14);
      } else if (elapsed < 2.55) {
        // 2.12s - 2.55s: Lingering after-blink stare
        alpha = 1.0;
        openness = 1.0;
        pulse = 1.0 + 0.03 * Math.sin((elapsed - 2.12) * 5.0);
      } else if (elapsed < 2.95) {
        // 2.55s - 2.95s: Eyes vanish into darkness
        alpha = Math.max(0, 1.0 - (elapsed - 2.55) / 0.4);
        openness = 1.0;
      } else {
        // 2.95s+: Complete pitch black
        alpha = 0;
        openness = 0;
      }

      if (alpha > 0.01 && openness > 0.02) {
        // Center: canvas is 240x120. Left eye center (74, 60), Right eye center (166, 60)
        drawPredatorySnakeEye(ctx, 74, 60, true, openness, alpha, pulse);
        drawPredatorySnakeEye(ctx, 166, 60, false, openness, alpha, pulse);
      }

      if (elapsed >= 3.65) {
        if (!hasCompleted) {
          hasCompleted = true;
          onComplete();
        }
        return;
      }

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
    };
  }, [onComplete]);

  return (
    <div className="absolute inset-0 bg-[#000000] flex items-center justify-center select-none z-50 animate-fadeIn">
      <canvas
        ref={canvasRef}
        width={240}
        height={120}
        className="w-72 h-36 sm:w-96 sm:h-48 [image-rendering:pixelated] [image-rendering:crisp-edges] drop-shadow-2xl"
      />
    </div>
  );
};

export const GreenSnakeEyesSequence = ShadowFigureFaceCloseUp;

/**
 * Draws a single menacing, supernatural serpentine eye:
 * - Sharp, angular, predatory slit shape (steep upward aggressive slant, acute corners)
 * - Intense glowing toxic/acid emerald iris with radioactive sulfur core
 * - Dark black surrounding shadow that blends into the void
 * - Razor-sharp vertical slit pupil, tapering to needles at top and bottom
 * - Menacing upper predatory lid angle (unmistakably threatening, completely alert, zero sleepiness)
 */
function drawPredatorySnakeEye(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  isLeft: boolean,
  openness: number,
  alpha: number,
  pulse: number
): void {
  ctx.save();
  ctx.globalAlpha = alpha;

  const width = 28 * pulse;
  const height = 15 * openness * pulse;
  // Menacing inward predator slant: Left eye tilts slightly down-inward, Right eye mirrors
  const tilt = isLeft ? 0.09 : -0.09;

  ctx.translate(cx, cy);
  ctx.rotate(tilt);

  // 1. Wide supernatural toxic-green ambient halo
  const outerHalo = ctx.createRadialGradient(0, 0, 2, 0, 0, width * 2.2);
  outerHalo.addColorStop(0, 'rgba(16, 255, 130, 0.45)');
  outerHalo.addColorStop(0.35, 'rgba(5, 200, 95, 0.22)');
  outerHalo.addColorStop(0.65, 'rgba(2, 90, 40, 0.08)');
  outerHalo.addColorStop(1, 'rgba(0, 0, 0, 0)');

  ctx.fillStyle = outerHalo;
  ctx.beginPath();
  ctx.ellipse(0, 0, width * 2.2, height * 2.2, 0, 0, Math.PI * 2);
  ctx.fill();

  // 2. Sharp predatory eye contour (acute angular corners, aggressive downward brow)
  ctx.beginPath();
  const innerCornerX = isLeft ? width : -width;
  const outerCornerX = isLeft ? -width : width;
  const innerCornerY = isLeft ? -2 : -2;
  const outerCornerY = isLeft ? 1 : 1;

  ctx.moveTo(outerCornerX, outerCornerY);
  // Upper eyelid: aggressive angular predator curve
  ctx.bezierCurveTo(
    outerCornerX * 0.3,
    -height * 1.35,
    innerCornerX * 0.3,
    -height * 1.2,
    innerCornerX,
    innerCornerY
  );
  // Lower eyelid: tight, focused lower lid
  ctx.bezierCurveTo(
    innerCornerX * 0.4,
    height * 0.95,
    outerCornerX * 0.4,
    height * 1.1,
    outerCornerX,
    outerCornerY
  );
  ctx.closePath();

  // Clip all eye elements strictly within eyelid perimeter
  ctx.save();
  ctx.clip();

  // 3. Radioactive emerald / toxic sulfur iris
  const irisGrad = ctx.createRadialGradient(0, -1, 1, 0, 0, width * 1.1);
  irisGrad.addColorStop(0, '#c7ffb2'); // blinding bright toxic acid-lime core
  irisGrad.addColorStop(0.25, '#39ff85'); // intense supernatural radioactive neon green
  irisGrad.addColorStop(0.55, '#00b84c'); // vivid sinister emerald
  irisGrad.addColorStop(0.82, '#014d22'); // deep viper shadow
  irisGrad.addColorStop(1, '#001207'); // pitch black rim

  ctx.fillStyle = irisGrad;
  ctx.fillRect(-width - 5, -height - 5, (width + 5) * 2, (height + 5) * 2);

  // 4. Sharp serpentine iris striations (reptilian fiber textures)
  ctx.strokeStyle = 'rgba(0, 55, 20, 0.55)';
  ctx.lineWidth = 1;
  const striationCount = 12;
  for (let i = 0; i < striationCount; i++) {
    const angle = (i / striationCount) * Math.PI * 2;
    const x1 = Math.cos(angle) * (width * 0.3);
    const y1 = Math.sin(angle) * (height * 0.3);
    const x2 = Math.cos(angle) * (width * 0.95);
    const y2 = Math.sin(angle) * (height * 0.95);
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
  }

  // 5. Razor-sharp vertical slit pupil: needle-pointed viper pupil
  // When openness shrinks, pupil remains razor thin and vertical
  const pupilW = Math.max(1.1, 2.2 * Math.min(1.0, openness));
  const pupilH = height * 1.15;

  ctx.fillStyle = '#000000';
  ctx.beginPath();
  ctx.moveTo(0, -pupilH);
  ctx.bezierCurveTo(pupilW * 1.4, -pupilH * 0.35, pupilW * 1.4, pupilH * 0.35, 0, pupilH);
  ctx.bezierCurveTo(-pupilW * 1.4, pupilH * 0.35, -pupilW * 1.4, -pupilH * 0.35, 0, -pupilH);
  ctx.closePath();
  ctx.fill();

  // 6. Cold sinister pupil glint (specular reflection of predator staring in darkness)
  ctx.fillStyle = 'rgba(230, 255, 240, 0.85)';
  ctx.fillRect(-0.6, -pupilH * 0.45, 1.2, 2.0);

  ctx.restore(); // restore clip

  // 7. Sinister dark eyelid outline (sharp cut into the darkness)
  ctx.strokeStyle = '#001809';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(outerCornerX, outerCornerY);
  ctx.bezierCurveTo(
    outerCornerX * 0.3,
    -height * 1.35,
    innerCornerX * 0.3,
    -height * 1.2,
    innerCornerX,
    innerCornerY
  );
  ctx.stroke();

  ctx.strokeStyle = '#001407';
  ctx.lineWidth = 1.0;
  ctx.beginPath();
  ctx.moveTo(innerCornerX, innerCornerY);
  ctx.bezierCurveTo(
    innerCornerX * 0.4,
    height * 0.95,
    outerCornerX * 0.4,
    height * 1.1,
    outerCornerX,
    outerCornerY
  );
  ctx.stroke();

  ctx.restore();
}
