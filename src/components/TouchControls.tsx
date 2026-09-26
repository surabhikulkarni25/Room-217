import React, { useRef } from 'react';
import { Direction } from '../types/game';

interface TouchControlsProps {
  onDirectionPress: (dir: Direction | null) => void;
  onInteract: () => void;
  canInteract: boolean;
  interactLabel?: string;
  visible?: boolean;
}

export const TouchControls: React.FC<TouchControlsProps> = ({
  onDirectionPress,
  onInteract,
  canInteract,
  interactLabel = 'INTERACT',
  visible = true,
}) => {
  const lastTouchTimeRef = useRef<number>(0);

  if (!visible) return null;

  // Prevent double triggers from synthetic click after touch
  const handleTouchInteract = (e: React.TouchEvent | React.MouseEvent) => {
    e.preventDefault();
    const now = Date.now();
    if (now - lastTouchTimeRef.current < 250) return;
    lastTouchTimeRef.current = now;
    if (canInteract) {
      onInteract();
    }
  };

  const createDirectionHandlers = (dir: Direction) => ({
    onTouchStart: (e: React.TouchEvent) => {
      e.preventDefault();
      onDirectionPress(dir);
    },
    onTouchEnd: (e: React.TouchEvent) => {
      e.preventDefault();
      onDirectionPress(null);
    },
    onTouchCancel: (e: React.TouchEvent) => {
      e.preventDefault();
      onDirectionPress(null);
    },
    onPointerDown: (e: React.PointerEvent) => {
      // Only handle touch/pen pointer events or left click
      if (e.pointerType !== 'mouse' || e.button === 0) {
        onDirectionPress(dir);
      }
    },
    onPointerUp: () => onDirectionPress(null),
    onPointerCancel: () => onDirectionPress(null),
    onPointerLeave: () => onDirectionPress(null),
  });

  return (
    <div
      className="absolute bottom-2 sm:bottom-3 left-0 right-0 px-3 sm:px-5 flex justify-between items-end pointer-events-none z-20 select-none [touch-action:none]"
      aria-label="Touch Controls"
    >
      {/* Direction Pad (Left thumb) */}
      <div className="grid grid-cols-3 gap-1 pointer-events-auto bg-black/60 backdrop-blur-[2px] p-1.5 sm:p-2 rounded-xl border border-zinc-700/80 shadow-2xl">
        <div />
        <button
          type="button"
          {...createDirectionHandlers('up')}
          aria-label="Move Up"
          className="w-11 h-11 sm:w-13 sm:h-13 bg-zinc-800/90 active:bg-amber-600/60 active:border-amber-400 text-zinc-200 active:text-amber-200 font-bold rounded-lg border border-zinc-700 flex items-center justify-center text-base sm:text-lg transition-all touch-manipulation shadow-md"
        >
          ▲
        </button>
        <div />
        <button
          type="button"
          {...createDirectionHandlers('left')}
          aria-label="Move Left"
          className="w-11 h-11 sm:w-13 sm:h-13 bg-zinc-800/90 active:bg-amber-600/60 active:border-amber-400 text-zinc-200 active:text-amber-200 font-bold rounded-lg border border-zinc-700 flex items-center justify-center text-base sm:text-lg transition-all touch-manipulation shadow-md"
        >
          ◀
        </button>
        <button
          type="button"
          {...createDirectionHandlers('down')}
          aria-label="Move Down"
          className="w-11 h-11 sm:w-13 sm:h-13 bg-zinc-800/90 active:bg-amber-600/60 active:border-amber-400 text-zinc-200 active:text-amber-200 font-bold rounded-lg border border-zinc-700 flex items-center justify-center text-base sm:text-lg transition-all touch-manipulation shadow-md"
        >
          ▼
        </button>
        <button
          type="button"
          {...createDirectionHandlers('right')}
          aria-label="Move Right"
          className="w-11 h-11 sm:w-13 sm:h-13 bg-zinc-800/90 active:bg-amber-600/60 active:border-amber-400 text-zinc-200 active:text-amber-200 font-bold rounded-lg border border-zinc-700 flex items-center justify-center text-base sm:text-lg transition-all touch-manipulation shadow-md"
        >
          ▶
        </button>
      </div>

      {/* Action / Interact Button (Right thumb) */}
      <div className="pointer-events-auto">
        <button
          type="button"
          onTouchStart={handleTouchInteract}
          onClick={handleTouchInteract}
          disabled={!canInteract}
          aria-label={interactLabel}
          className={`w-16 h-16 sm:w-18 sm:h-18 rounded-full font-mono font-bold text-xs flex flex-col items-center justify-center border-2 transition-all touch-manipulation select-none ${
            canInteract
              ? 'bg-amber-600/95 active:bg-amber-500 text-amber-100 border-amber-300 shadow-2xl shadow-amber-900/60 active:scale-95 animate-pulse'
              : 'bg-zinc-900/50 text-zinc-600 border-zinc-800/80 opacity-50 cursor-not-allowed'
          }`}
        >
          <span className="text-sm font-extrabold tracking-wider leading-none">
            {interactLabel.slice(0, 7)}
          </span>
          <span className="text-[9px] font-normal text-amber-200/80 mt-0.5 tracking-tighter">
            [E / TAP]
          </span>
        </button>
      </div>
    </div>
  );
};

