import React from 'react';
import { Direction } from '../types/game';

interface TouchControlsProps {
  onDirectionPress: (dir: Direction | null) => void;
  onInteract: () => void;
  canInteract: boolean;
}

export const TouchControls: React.FC<TouchControlsProps> = ({
  onDirectionPress,
  onInteract,
  canInteract,
}) => {
  return (
    <div className="sm:hidden absolute bottom-3 left-0 right-0 px-4 flex justify-between items-end pointer-events-none z-20">
      {/* Direction Pad */}
      <div className="grid grid-cols-3 gap-1 pointer-events-auto bg-black/40 p-1.5 rounded-lg border border-zinc-800">
        <div />
        <button
          className="w-10 h-10 bg-zinc-800/80 active:bg-zinc-700 text-zinc-300 font-bold rounded flex items-center justify-center text-sm"
          onTouchStart={(e) => {
            e.preventDefault();
            onDirectionPress('up');
          }}
          onTouchEnd={(e) => {
            e.preventDefault();
            onDirectionPress(null);
          }}
          onMouseDown={() => onDirectionPress('up')}
          onMouseUp={() => onDirectionPress(null)}
        >
          ▲
        </button>
        <div />
        <button
          className="w-10 h-10 bg-zinc-800/80 active:bg-zinc-700 text-zinc-300 font-bold rounded flex items-center justify-center text-sm"
          onTouchStart={(e) => {
            e.preventDefault();
            onDirectionPress('left');
          }}
          onTouchEnd={(e) => {
            e.preventDefault();
            onDirectionPress(null);
          }}
          onMouseDown={() => onDirectionPress('left')}
          onMouseUp={() => onDirectionPress(null)}
        >
          ◀
        </button>
        <button
          className="w-10 h-10 bg-zinc-800/80 active:bg-zinc-700 text-zinc-300 font-bold rounded flex items-center justify-center text-sm"
          onTouchStart={(e) => {
            e.preventDefault();
            onDirectionPress('down');
          }}
          onTouchEnd={(e) => {
            e.preventDefault();
            onDirectionPress(null);
          }}
          onMouseDown={() => onDirectionPress('down')}
          onMouseUp={() => onDirectionPress(null)}
        >
          ▼
        </button>
        <button
          className="w-10 h-10 bg-zinc-800/80 active:bg-zinc-700 text-zinc-300 font-bold rounded flex items-center justify-center text-sm"
          onTouchStart={(e) => {
            e.preventDefault();
            onDirectionPress('right');
          }}
          onTouchEnd={(e) => {
            e.preventDefault();
            onDirectionPress(null);
          }}
          onMouseDown={() => onDirectionPress('right')}
          onMouseUp={() => onDirectionPress(null)}
        >
          ▶
        </button>
      </div>

      {/* Interact Button */}
      <div className="pointer-events-auto">
        <button
          onClick={onInteract}
          disabled={!canInteract}
          className={`w-14 h-14 rounded-full font-mono font-bold text-sm flex flex-col items-center justify-center border transition-all ${
            canInteract
              ? 'bg-amber-600/90 text-amber-100 border-amber-400 shadow-lg shadow-amber-900/40 active:scale-95'
              : 'bg-zinc-900/60 text-zinc-600 border-zinc-800'
          }`}
        >
          <span>E</span>
          <span className="text-[9px] font-normal">INSPECT</span>
        </button>
      </div>
    </div>
  );
};
