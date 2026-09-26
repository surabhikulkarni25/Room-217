import React, { useEffect, useRef } from 'react';

interface ShadowFigureFaceCloseUpProps {
  onComplete: () => void;
}

export const ShadowFigureFaceCloseUp: React.FC<ShadowFigureFaceCloseUpProps> = ({
  onComplete,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.imageSmoothingEnabled = false;

    // Render close-up of the Shadow Figure's face and unnatural porcelain smile
    ctx.fillStyle = '#020203';
    ctx.fillRect(0, 0, 160, 160);

    // Deep shadow head silhouette
    ctx.fillStyle = '#060608';
    ctx.beginPath();
    ctx.ellipse(80, 72, 48, 64, 0, 0, Math.PI * 2);
    ctx.fill();

    // Inner pure void face
    ctx.fillStyle = '#000000';
    ctx.beginPath();
    ctx.ellipse(80, 74, 42, 56, 0, 0, Math.PI * 2);
    ctx.fill();

    // Piercing pale void eye pinpricks staring dead forward
    ctx.fillStyle = '#e4eff8';
    ctx.fillRect(62, 54, 4, 3);
    ctx.fillRect(94, 54, 4, 3);
    ctx.fillStyle = 'rgba(210, 235, 255, 0.4)';
    ctx.fillRect(60, 52, 8, 7);
    ctx.fillRect(92, 52, 8, 7);

    // The Unnatural Porcelain Smile: wide crescent stretched across lower face
    ctx.fillStyle = '#f4f8fa';
    // Center smile bar
    ctx.fillRect(52, 92, 56, 4);
    // Upward crescent curls at cheek corners
    ctx.fillRect(48, 88, 5, 5);
    ctx.fillRect(44, 83, 5, 6);
    ctx.fillRect(107, 88, 5, 5);
    ctx.fillRect(111, 83, 5, 6);

    // Razor-thin vertical teeth separations
    ctx.fillStyle = '#05070a';
    for (let tx = 56; tx < 104; tx += 6) {
      ctx.fillRect(tx, 91, 1, 6);
    }

    // Lower chin shadow
    ctx.fillStyle = '#030405';
    ctx.fillRect(66, 114, 28, 6);

    // Lasts roughly 2.0 seconds, then dismisses into the ending sequence
    const timer = setTimeout(() => {
      onComplete();
    }, 2000);

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className="absolute inset-0 bg-[#000000] flex items-center justify-center select-none z-50 animate-fadeIn">
      <canvas
        ref={canvasRef}
        width={160}
        height={160}
        className="w-48 h-48 sm:w-64 sm:h-64 [image-rendering:pixelated] [image-rendering:crisp-edges] drop-shadow-2xl"
      />
    </div>
  );
};
