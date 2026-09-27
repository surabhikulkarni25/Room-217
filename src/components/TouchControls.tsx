import React, { useCallback, useRef } from 'react';
import { Direction } from '../types/game';

interface TouchControlsProps {
  onDirectionPress: (dir: Direction | null) => void;
  onInteract: () => void;
  canInteract: boolean;
  actionPrompt?: string;
  isPortrait?: boolean;
}

export const TouchControls: React.FC<TouchControlsProps> = ({
  onDirectionPress,
  onInteract,
  canInteract,
  actionPrompt,
  isPortrait = false,
}) => {
  const activeDirRef = useRef<Direction | null>(null);

  const setDirection = useCallback(
    (dir: Direction | null) => {
      if (activeDirRef.current !== dir) {
        activeDirRef.current = dir;
        onDirectionPress(dir);
      }
    },
    [onDirectionPress]
  );

  const handlePointerDown = (dir: Direction, e: React.PointerEvent) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    } catch {
      // Ignore if pointer capture fails
    }
    setDirection(dir);
  };

  const handlePointerUp = (dir: Direction, e: React.PointerEvent) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
    } catch {
      // Ignore
    }
    if (activeDirRef.current === dir) {
      setDirection(null);
    }
  };

  const handlePointerCancel = (e: React.PointerEvent) => {
    e.preventDefault();
    setDirection(null);
  };

  return (
    <div
      className={`w-full flex items-end justify-between pointer-events-none z-30 select-none ${
        isPortrait
          ? 'py-2 px-3'
          : 'absolute bottom-2 left-0 right-0 px-3 pb-[max(0.5rem,env(safe-area-inset-bottom))]'
      }`}
      style={{ touchAction: 'none' }}
    >
      {/* Direction Pad */}
      <div
        className="pointer-events-auto bg-[#120f0c]/90 border border-[#3e3022] p-1.5 rounded-xl shadow-2xl backdrop-blur-xs flex flex-col items-center justify-center"
        style={{ touchAction: 'none' }}
      >
        {/* Up row */}
        <button
          type="button"
          aria-label="Move Up"
          className="w-12 h-12 sm:w-13 sm:h-13 bg-[#221b14] active:bg-[#523d24] text-[#d4aa50] font-bold rounded-lg border border-[#483726] flex items-center justify-center text-lg shadow-md cursor-pointer transition-transform active:scale-90"
          onPointerDown={(e) => handlePointerDown('up', e)}
          onPointerUp={(e) => handlePointerUp('up', e)}
          onPointerCancel={handlePointerCancel}
          onContextMenu={(e) => e.preventDefault()}
        >
          ▲
        </button>

        {/* Middle row: Left, Center Pivot, Right */}
        <div className="flex items-center gap-1.5 my-1">
          <button
            type="button"
            aria-label="Move Left"
            className="w-12 h-12 sm:w-13 sm:h-13 bg-[#221b14] active:bg-[#523d24] text-[#d4aa50] font-bold rounded-lg border border-[#483726] flex items-center justify-center text-lg shadow-md cursor-pointer transition-transform active:scale-90"
            onPointerDown={(e) => handlePointerDown('left', e)}
            onPointerUp={(e) => handlePointerUp('left', e)}
            onPointerCancel={handlePointerCancel}
            onContextMenu={(e) => e.preventDefault()}
          >
            ◀
          </button>

          <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-[#16120e] border border-[#2e2318] flex items-center justify-center pointer-events-none">
            <span className="w-2.5 h-2.5 rounded-full bg-[#3e3122]" />
          </div>

          <button
            type="button"
            aria-label="Move Right"
            className="w-12 h-12 sm:w-13 sm:h-13 bg-[#221b14] active:bg-[#523d24] text-[#d4aa50] font-bold rounded-lg border border-[#483726] flex items-center justify-center text-lg shadow-md cursor-pointer transition-transform active:scale-90"
            onPointerDown={(e) => handlePointerDown('right', e)}
            onPointerUp={(e) => handlePointerUp('right', e)}
            onPointerCancel={handlePointerCancel}
            onContextMenu={(e) => e.preventDefault()}
          >
            ▶
          </button>
        </div>

        {/* Down row */}
        <button
          type="button"
          aria-label="Move Down"
          className="w-12 h-12 sm:w-13 sm:h-13 bg-[#221b14] active:bg-[#523d24] text-[#d4aa50] font-bold rounded-lg border border-[#483726] flex items-center justify-center text-lg shadow-md cursor-pointer transition-transform active:scale-90"
          onPointerDown={(e) => handlePointerDown('down', e)}
          onPointerUp={(e) => handlePointerUp('down', e)}
          onPointerCancel={handlePointerCancel}
          onContextMenu={(e) => e.preventDefault()}
        >
          ▼
        </button>
      </div>

      {/* Action / Interact Button */}
      <div className="pointer-events-auto flex flex-col items-center">
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onInteract();
          }}
          aria-label={canInteract ? `Interact: ${actionPrompt || 'Inspect'}` : 'Interact'}
          className={`w-16 h-16 sm:w-18 sm:h-18 rounded-full font-mono font-bold flex flex-col items-center justify-center border-2 transition-all cursor-pointer shadow-2xl active:scale-90 ${
            canInteract
              ? 'bg-[#6b4c19] text-[#fff2cc] border-[#d4aa50] shadow-[0_0_20px_rgba(212,170,80,0.55)] ring-2 ring-[#d4aa50]/40 animate-pulse'
              : 'bg-[#18130e]/85 text-[#73634e] border-[#3a2d1f]'
          }`}
          style={{ touchAction: 'manipulation' }}
        >
          <span className="text-base sm:text-lg leading-none font-extrabold">E</span>
          <span className="text-[10px] sm:text-[11px] font-mono tracking-wider uppercase mt-0.5 truncate max-w-[56px] text-center">
            {canInteract ? actionPrompt || 'INSPECT' : 'ACTION'}
          </span>
        </button>
      </div>
    </div>
  );
};
